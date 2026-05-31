import fs from 'fs';

const OUT = 'data_processed/russian_frontmatter_dashboard.csv';
const DOC = 'docs/decision/russian-frontmatter-dashboard-v1.md';

for (const dir of ['data_processed', 'docs/decision']) fs.mkdirSync(dir, { recursive: true });

function clean(value) {
  return String(value ?? '').replace(/\s+/g, ' ').trim();
}

function csvEscape(value) {
  return `"${clean(value).replace(/"/g, '""')}"`;
}

function parseCsv(text) {
  const rows = [];
  let row = [];
  let field = '';
  let quoted = false;
  for (let i = 0; i < text.length; i += 1) {
    const ch = text[i];
    const next = text[i + 1];
    if (quoted) {
      if (ch === '"' && next === '"') {
        field += '"';
        i += 1;
      } else if (ch === '"') {
        quoted = false;
      } else {
        field += ch;
      }
    } else if (ch === '"') {
      quoted = true;
    } else if (ch === ',') {
      row.push(field);
      field = '';
    } else if (ch === '\n') {
      row.push(field);
      rows.push(row);
      row = [];
      field = '';
    } else if (ch !== '\r') {
      field += ch;
    }
  }
  if (field || row.length) {
    row.push(field);
    rows.push(row);
  }
  const header = rows.shift();
  if (!header) return [];
  return rows
    .filter(r => r.some(Boolean))
    .map(r => Object.fromEntries(header.map((h, i) => [h, r[i] ?? ''])));
}

function csv(file) {
  if (!fs.existsSync(file) && file === 'data_processed/cross_source_universe_raw.csv') {
    return csv('data_processed/cross_source_universe_raw_index.csv')
      .flatMap(row => fs.existsSync(row.file_path) ? csv(row.file_path) : []);
  }
  return fs.existsSync(file) ? parseCsv(fs.readFileSync(file, 'utf8')) : [];
}

function writeCsv(file, rows, headers) {
  fs.writeFileSync(file, `${[headers.join(','), ...rows.map(row => headers.map(h => csvEscape(row[h])).join(','))].join('\n')}\n`);
}

function mdTable(rows, columns, limit = rows.length) {
  const limited = rows.slice(0, limit);
  const header = `| ${columns.map(c => c.label).join(' | ')} |`;
  const sep = `| ${columns.map(c => c.align === 'right' ? '---:' : '---').join(' | ')} |`;
  const body = limited.map(row => `| ${columns.map(c => clean(row[c.key]).replace(/\|/g, '/')).join(' | ')} |`);
  return [header, sep, ...body].join('\n');
}

function num(value) {
  const n = Number(String(value ?? '').replace(/[^\d.-]/g, ''));
  return Number.isFinite(n) ? n : 0;
}

function fmt(value) {
  return Math.round(num(value)).toLocaleString('en-US');
}

function money(value) {
  const n = num(value);
  if (!n) return 'нет данных';
  if (n >= 1_000_000_000) return `$${(n / 1_000_000_000).toFixed(1)}B`;
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(n >= 100_000_000 ? 0 : 1)}M`;
  return `$${Math.round(n).toLocaleString('en-US')}`;
}

function by(rows, key, value) {
  return rows.find(row => row[key] === value) || {};
}

function gateRatio(row) {
  return `${row.completed_vs_required || '0 / 0'}; success ${row.success_vs_threshold || '0 / 0'}`;
}

const rawRows = csv('data_processed/cross_source_universe_raw.csv');
const dedupRows = csv('data_processed/cross_source_universe_dedup.csv');
const manifest = csv('data_processed/evidence_artifact_manifest.csv');
const nicheRollup = csv('data_processed/global_niche_count_rollup.csv');
const gates = csv('data_processed/global_hypothesis_gate_snapshot.csv');
const tam = csv('data_processed/tam_sam_som_model.csv');
const sensitivity = csv('data_processed/market_model_sensitivity_audit.csv');
const validationBacklog = csv('data_processed/global_next_validation_backlog.csv');
const readability = csv('data_processed/global_report_readability_audit.csv');
const sourceQuality = csv('data_processed/global_source_quality_gap_audit.csv');
const intersection = by(tam, 'pillar', 'intersection');
const holdGates = gates.filter(row => row.decision_ru === 'оставить hold_validate');
const highRiskSensitivity = sensitivity.filter(row => ['высокий', 'очень высокий', 'средне-высокий'].includes(clean(row.sensitivity_risk_ru)));

const rows = [
  {
    dashboard_id: 'DASH_01_PACKAGE_SCALE',
    block_ru: 'Сводка пакета',
    metric_ru: 'Масштаб evidence base',
    value_ru: `${fmt(rawRows.length)} raw source-строк; ${fmt(dedupRows.length)} global dedup; ${fmt(manifest.length)} manifest artifacts`,
    interpretation_ru: 'Пакет уже большой как карта рынка и конкурентов.',
    boundary_ru: 'Масштаб строк не равен доказанному спросу или числу прямых клонов.',
    source_files: 'data_processed/cross_source_universe_raw_index.csv;data_processed/cross_source_universe_dedup.csv;data_processed/evidence_artifact_manifest.csv'
  },
  {
    dashboard_id: 'DASH_02_NICHE_COVERAGE',
    block_ru: 'Сводка пакета',
    metric_ru: 'Покрытие пяти направлений',
    value_ru: `${nicheRollup.length} market rows; ${fmt(nicheRollup.reduce((sum, row) => sum + num(row.direct_app_store_dedup_rows), 0))} direct app dedup rows by niche; ${fmt(nicheRollup.reduce((sum, row) => sum + num(row.all_source_dedup_rows), 0))} all-source dedup rows by niche`,
    interpretation_ru: 'По каждой нише видно, сколько данных лежит под выводами.',
    boundary_ru: 'Niche dedup rows нельзя складывать как уникальные продукты: один продукт может жить в нескольких контекстах.',
    source_files: 'data_processed/global_niche_count_rollup.csv;data_processed/russian_readable_niche_summary.csv'
  },
  {
    dashboard_id: 'DASH_03_MARKET_MODEL',
    block_ru: 'Сводка пакета',
    metric_ru: 'Денежная рамка H2',
    value_ru: `intersection SAM ${money(intersection.samBase)}; weighted SAM ${money(intersection.weightedSamBase || by(csv('data_processed/market_money_triangulation.csv'), 'pillar', 'intersection').weighted_sam_base_usd)}; sensitivity high-or-above ${highRiskSensitivity.length}/${sensitivity.length}`,
    interpretation_ru: 'Денежная зона выглядит достаточно большой, чтобы продолжать проверку.',
    boundary_ru: 'Это range-based sizing, не revenue forecast и не закрытый H2 gate.',
    source_files: 'data_processed/tam_sam_som_model.csv;data_processed/market_model_sensitivity_audit.csv;data_processed/market_money_triangulation.csv'
  },
  {
    dashboard_id: 'DASH_04_VALIDATION_STATUS',
    block_ru: 'Сводка пакета',
    metric_ru: 'Статус гипотез',
    value_ru: `${holdGates.length}/${gates.length} gates hold_validate; H1 ${gateRatio(by(gates, 'hypothesis_id', 'H1'))}; H2 ${gateRatio(by(gates, 'hypothesis_id', 'H2'))}; H5 ${gateRatio(by(gates, 'hypothesis_id', 'H5'))}`,
    interpretation_ru: 'Исследование готово к ручной проверке, но еще не готово к claim upgrade.',
    boundary_ru: 'Listing-only, secondary VOC и prototype-readiness не заменяют observed walkthrough/interview/session evidence.',
    source_files: 'data_processed/global_hypothesis_gate_snapshot.csv;data_processed/validation_gate_calculator.csv'
  },
  {
    dashboard_id: 'DASH_05_NEXT_ACTION',
    block_ru: 'Сводка пакета',
    metric_ru: 'Следующий рабочий фокус',
    value_ru: `${validationBacklog.length} next-validation tasks; readability rows=${readability.length}; source-quality rows=${sourceQuality.length}`,
    interpretation_ru: 'Следующий прирост качества должен прийти от observed rows, а не от бесконечного расширения desk research.',
    boundary_ru: 'Backlog описывает работу, но не считается выполненным evidence.',
    source_files: 'data_processed/global_next_validation_backlog.csv;data_processed/global_report_readability_audit.csv;data_processed/global_source_quality_gap_audit.csv'
  },
  ...nicheRollup.map((row, idx) => ({
    dashboard_id: `DASH_NICHE_${String(idx + 1).padStart(2, '0')}`,
    block_ru: 'Ниши',
    metric_ru: row.market_ru,
    value_ru: `raw=${fmt(row.all_source_raw_rows)}; all dedup=${fmt(row.all_source_dedup_rows)}; direct app dedup=${fmt(row.direct_app_store_dedup_rows)}; top100=${fmt(row.top100_primary_competitors)}; manual targets=${fmt(row.manual_validation_targets)}`,
    interpretation_ru: row.market_id === 'gaming_progression'
      ? 'Использовать как benchmark механик прогресса, возврата и монетизации.'
      : clean(row.money_verdict_ru || row.coverage_read_ru || 'Использовать как adjacent consumer-app поле для проверки.'),
    boundary_ru: row.market_id === 'gaming_progression'
      ? 'Gaming не считать прямым TAM Alina до доказанного ritual/self-improvement overlap.'
      : 'Счетчики показывают coverage, но не доказывают demand, WTP или отсутствие hidden clone.',
    source_files: 'data_processed/global_niche_count_rollup.csv;data_processed/cross_source_coverage_matrix.csv'
  })),
  ...gates.map(row => ({
    dashboard_id: `DASH_GATE_${row.hypothesis_id}`,
    block_ru: 'Gates',
    metric_ru: `${row.hypothesis_id}: ${row.hypothesis_ru || row.hypothesis_name_ru || ''}`,
    value_ru: `${row.gate_status_ru || 'status n/a'}; completed ${row.completed_vs_required || '0 / 0'}; success ${row.success_vs_threshold || '0 / 0'}`,
    interpretation_ru: row.next_validation_step_ru || 'Нужна observed validation строка.',
    boundary_ru: row.decision_ru || 'оставить hold_validate до observed evidence',
    source_files: 'data_processed/global_hypothesis_gate_snapshot.csv;data_processed/validation_gate_calculator.csv'
  }))
];

writeCsv(OUT, rows, [
  'dashboard_id',
  'block_ru',
  'metric_ru',
  'value_ru',
  'interpretation_ru',
  'boundary_ru',
  'source_files'
]);

const summaryRows = rows.filter(row => row.block_ru === 'Сводка пакета');
const nicheRows = rows.filter(row => row.block_ru === 'Ниши');
const gateRows = rows.filter(row => row.block_ru === 'Gates');

const lines = [];
lines.push('# Russian Frontmatter Dashboard V1');
lines.push('');
lines.push(`Generated: ${new Date().toISOString().slice(0, 10)}`);
lines.push('');
lines.push('## Зачем нужен этот слой');
lines.push('');
lines.push('Этот dashboard ставится в начало русской версии отчета, чтобы читатель сразу увидел масштаб пакета, счетчики по пяти нишам, денежную рамку, статус gates и главный следующий ход. Он нужен не как новая гипотеза, а как навигационная панель перед длинным evidence pack.');
lines.push('');
lines.push('## Главные числа');
lines.push('');
lines.push(mdTable(summaryRows, [
  { key: 'metric_ru', label: 'Метрика' },
  { key: 'value_ru', label: 'Значение' },
  { key: 'interpretation_ru', label: 'Как читать' },
  { key: 'boundary_ru', label: 'Граница' }
]));
lines.push('');
lines.push('## Пять ниш');
lines.push('');
lines.push(mdTable(nicheRows, [
  { key: 'metric_ru', label: 'Ниша' },
  { key: 'value_ru', label: 'Сколько данных' },
  { key: 'interpretation_ru', label: 'Как читать' },
  { key: 'boundary_ru', label: 'Граница' }
]));
lines.push('');
lines.push('## Gates');
lines.push('');
lines.push(mdTable(gateRows, [
  { key: 'metric_ru', label: 'Гипотеза' },
  { key: 'value_ru', label: 'Статус' },
  { key: 'interpretation_ru', label: 'Следующий шаг' },
  { key: 'boundary_ru', label: 'Решение сейчас' }
]));
lines.push('');
lines.push('## Files');
lines.push('');
lines.push(`- \`${OUT}\``);
lines.push('- `reports/alina-global-hypothesis-report-v1.md`');
lines.push('- `reports/alina-global-executive-narrative-v1.md`');

fs.writeFileSync(DOC, `${lines.join('\n')}\n`);

console.log(`russian_frontmatter_dashboard=${OUT}`);
console.log(`doc=${DOC}`);
console.log(`dashboard_rows=${rows.length}`);
