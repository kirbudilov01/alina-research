import fs from 'fs';

const OUT = 'data_processed/global_goal_evidence_coverage.csv';
const DOC = 'docs/decision/global-goal-evidence-coverage-v1.md';

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
  return fs.existsSync(file) ? parseCsv(fs.readFileSync(file, 'utf8')) : [];
}

function writeCsv(file, rows, headers) {
  fs.writeFileSync(file, `${[headers.join(','), ...rows.map(row => headers.map(h => csvEscape(row[h])).join(','))].join('\n')}\n`);
}

function mdTable(rows, columns, limit = rows.length) {
  const limited = rows.slice(0, limit);
  const header = `| ${columns.map(c => c.label).join(' | ')} |`;
  const sep = `| ${columns.map(c => c.align === 'right' ? '---:' : '---').join(' | ')} |`;
  const body = limited.map(row => `| ${columns.map(c => clean(row[c.key]).replace(/\|/g, '<br>')).join(' | ')} |`);
  return [header, sep, ...body].join('\n');
}

function num(value) {
  const n = Number(String(value ?? '').replace(/[^\d.-]/g, ''));
  return Number.isFinite(n) ? n : 0;
}

function countRows(file) {
  return csv(file).length;
}

function exists(file) {
  return fs.existsSync(file) ? 'yes' : 'no';
}

const manifest = csv('data_processed/evidence_artifact_manifest.csv');
const gates = csv('data_processed/global_hypothesis_gate_snapshot.csv');
const sourceScale = csv('data_processed/source_scale_milestone.csv');

const manifestMissing = manifest.filter(row => row.exists !== 'yes').length;
const manifestRows = manifest.length;
const rawMilestone = sourceScale.find(row => row.milestone_id === 'RAW_50K_SOURCE_SCALE') || {};
const dedupMilestone = sourceScale.find(row => row.milestone_id === 'DEDUP_30_40K_BAND') || {};
const dedup50 = sourceScale.find(row => row.milestone_id === 'DEDUP_50K_UPPER_ASPIRATION') || {};
const gateOpen = gates.filter(row => row.decision_ru === 'оставить hold_validate').length;
const gateStarted = gates.filter(row => clean(row.gate_status_ru).startsWith('начато')).length;

const rows = [
  {
    coverage_id: 'GOAL_01_PLAN',
    objective_part_ru: 'Зафиксировать большой план задач и execution path',
    status_ru: 'покрыто как рабочая система',
    evidence_strength_ru: 'сильное',
    current_evidence_ru: `${countRows('data_processed/global_next_validation_backlog.csv')} next-validation задач; ${countRows('data_processed/p0_validation_command_center.csv')} command-center задач; ${countRows('data_processed/russian_validation_runway.csv')} runway шагов`,
    key_files: 'data_processed/global_next_validation_backlog.csv;docs/decision/global-next-validation-backlog-v1.md;data_processed/p0_validation_command_center.csv;data_processed/russian_validation_runway.csv',
    remaining_gap_ru: 'план есть, но требует обновления после observed evidence',
    next_move_ru: 'после каждой ручной проверки пересобирать backlog и gates'
  },
  {
    coverage_id: 'GOAL_02_SOURCE_SCALE',
    objective_part_ru: 'Расширить конкурентов и источники по 5 рынкам до большого масштаба',
    status_ru: 'покрыто по raw 50k и dedup 30k+, dedup 50k остается aspiration',
    evidence_strength_ru: 'средне-сильное',
    current_evidence_ru: `raw=${rawMilestone.metric_value || 'n/a'}; dedup=${dedupMilestone.metric_value || 'n/a'}; dedup50_status=${dedup50.status || 'open'}; source_refs=${manifest.reduce((sum, row) => sum + num(row.source_ref_rows), 0)}`,
    key_files: 'data_processed/cross_source_universe_raw_index.csv;data_processed/cross_source_universe_dedup.csv;data_processed/source_scale_milestone.csv;data_processed/cross_source_coverage_matrix.csv',
    remaining_gap_ru: 'нельзя писать, что 50k dedup уникальных конкурентов доказаны; доказаны raw 50k и dedup 30k-40k band',
    next_move_ru: 'расширять source-native lanes без тяжелого поискового crawl'
  },
  {
    coverage_id: 'GOAL_03_FIVE_MARKETS',
    objective_part_ru: 'Покрыть 5 направлений: mindfulness, coaching, astrology/esoterics, avatar/identity, gaming/progression',
    status_ru: 'покрыто',
    evidence_strength_ru: 'сильное',
    current_evidence_ru: `${countRows('data_processed/russian_readable_niche_summary.csv')} market rows; ${countRows('data_processed/global_whitespace_audience_synthesis.csv')} whitespace/audience rows; ${countRows('data_processed/global_market_sizing_methodology.csv')} market methodology rows`,
    key_files: 'data_processed/russian_readable_niche_summary.csv;data_processed/global_whitespace_audience_synthesis.csv;data_processed/global_market_sizing_methodology.csv',
    remaining_gap_ru: 'gaming остается benchmark-only до direct audience overlap proof',
    next_move_ru: 'сохранять gaming вне прямого TAM и H3 proof'
  },
  {
    coverage_id: 'GOAL_04_TAM_SAM_SOM',
    objective_part_ru: 'Подготовить рыночную методологию TAM/SAM/SOM и stress-сценарии',
    status_ru: 'покрыто как range-based methodology, не финальный revenue proof',
    evidence_strength_ru: 'средне-сильное',
    current_evidence_ru: `${countRows('data_processed/global_market_sizing_methodology.csv')} methodology rows; ${countRows('data_processed/tam_sam_som_model.csv')} TAM/SAM/SOM rows; ${countRows('data_processed/market_sizing_stress_test.csv')} stress scenarios`,
    key_files: 'data_processed/global_market_sizing_methodology.csv;docs/market/global-market-sizing-methodology-v1.md;data_processed/tam_sam_som_model.csv;data_processed/market_sizing_stress_test.csv',
    remaining_gap_ru: 'H2 не закрыт: paid-flow signoff ниже порога, WTP и paid-depth prototype signals еще нужны',
    next_move_ru: 'добрать paid-flow capture rows и WTP вопросы из P0 backlog'
  },
  {
    coverage_id: 'GOAL_05_WHITESPACE_AUDIENCE',
    objective_part_ru: 'Собрать whitespace и аудиторные матрицы',
    status_ru: 'покрыто как directional synthesis, validation остается открытой',
    evidence_strength_ru: 'среднее',
    current_evidence_ru: `${countRows('data_processed/global_whitespace_audience_synthesis.csv')} synthesis rows; ${countRows('data_processed/russian_whitespace_decision_map.csv')} whitespace rows; ${countRows('data_processed/russian_icp_battlecards.csv')} ICP rows; ${countRows('data_processed/audience_signal_matrix.csv')} audience signal rows`,
    key_files: 'data_processed/global_whitespace_audience_synthesis.csv;docs/intersections/global-whitespace-audience-synthesis-v1.md;data_processed/russian_whitespace_decision_map.csv;data_processed/russian_icp_battlecards.csv',
    remaining_gap_ru: 'H3/H5 нельзя усиливать без manual walkthrough и recent-behavior interviews',
    next_move_ru: 'исполнить первые 5 walkthrough и P0 ICP interview rows'
  },
  {
    coverage_id: 'GOAL_06_REPORT_RU',
    objective_part_ru: 'Собрать последовательный русский мировой отчет и PDF/DOCX',
    status_ru: 'покрыто как draft, не финальная validated версия',
    evidence_strength_ru: 'средне-сильное',
    current_evidence_ru: `global report md=${exists('reports/alina-global-hypothesis-report-v1.md')}; pdf=${exists('output/pdf/alina-global-hypothesis-report-v1.pdf')}; docx=${exists('output/docx/alina-global-hypothesis-report-v1.docx')}`,
    key_files: 'reports/alina-global-hypothesis-report-v1.md;output/pdf/alina-global-hypothesis-report-v1.pdf;output/docx/alina-global-hypothesis-report-v1.docx',
    remaining_gap_ru: 'финальная версия должна обновиться после observed validation rows',
    next_move_ru: 'после capture rows пересобрать отчет и изменить claim language'
  },
  {
    coverage_id: 'GOAL_07_VERSIONING',
    objective_part_ru: 'Сохранять локально, трассировать источники и версионировать через GitHub',
    status_ru: 'покрыто активно',
    evidence_strength_ru: 'сильное',
    current_evidence_ru: `manifest=${manifestRows}; missing=${manifestMissing}; docs=${manifest.filter(row => row.artifact_type === 'research_doc').length}; scripts=${manifest.filter(row => row.artifact_type === 'generator_script').length}`,
    key_files: 'data_processed/evidence_artifact_manifest.csv;docs/decision/evidence-package-manifest-v1.md;git log',
    remaining_gap_ru: 'manifest надо обновлять после каждого нового слоя',
    next_move_ru: 'пересобирать manifest и делать commit/push после изменений'
  },
  {
    coverage_id: 'GOAL_08_VALIDATION',
    objective_part_ru: 'Критически мыслить и не закрывать гипотезы без observed evidence',
    status_ru: 'открыто, capture-ready',
    evidence_strength_ru: 'сильное для процесса, слабое для финального proof',
    current_evidence_ru: `gates=${gates.length}; hold_validate=${gateOpen}; started=${gateStarted}; H2_completed=8/40; H1/H3/H4/H5/H6 observed rows still 0`,
    key_files: 'data_processed/global_hypothesis_gate_snapshot.csv;data_processed/global_next_validation_backlog.csv;data_processed/validation_gate_calculator.csv;data_processed/manual_walkthrough_capture_sheet.csv;data_processed/icp_interview_capture_sheet.csv;data_processed/prototype_session_capture_sheet.csv',
    remaining_gap_ru: 'цель нельзя считать завершенной, пока observed validation gates не закрыты или не понижены по evidence',
    next_move_ru: 'исполнить P0 validation backlog и обновить gate statuses'
  }
];

writeCsv(OUT, rows, [
  'coverage_id',
  'objective_part_ru',
  'status_ru',
  'evidence_strength_ru',
  'current_evidence_ru',
  'key_files',
  'remaining_gap_ru',
  'next_move_ru'
]);

const lines = [];
lines.push('# Global Goal Evidence Coverage V1');
lines.push('');
lines.push(`Generated: ${new Date().toISOString()}`);
lines.push('');
lines.push('## Зачем нужен этот слой');
lines.push('');
lines.push('Это карта соответствия между исходной целью пользователя и текущим evidence package. Она нужна, чтобы отличать готовые исследовательские слои от незакрытых validation claims. Если строка помечена как “покрыто”, это означает наличие локальных файлов и методологии, а не автоматическое доказательство product-market fit.');
lines.push('');
lines.push('## Coverage Table');
lines.push('');
lines.push(mdTable(rows, [
  { key: 'coverage_id', label: 'ID' },
  { key: 'objective_part_ru', label: 'Часть цели' },
  { key: 'status_ru', label: 'Статус' },
  { key: 'evidence_strength_ru', label: 'Сила' },
  { key: 'current_evidence_ru', label: 'Текущее evidence' },
  { key: 'remaining_gap_ru', label: 'Осталось' },
  { key: 'next_move_ru', label: 'Следующий ход' }
]));
lines.push('');
lines.push('## Главный вывод');
lines.push('');
lines.push('Исследовательский пакет уже большой и трассируемый: есть source scale, пять рынков, TAM/SAM/SOM methodology, whitespace/audience synthesis, report PDF/DOCX и GitHub history. Но цель нельзя закрывать как финально достигнутую, потому что observed validation gates все еще открыты: H1/H3/H4/H5/H6 без capture rows, H2 начат, но ниже порога.');
lines.push('');
lines.push('## Files');
lines.push('');
lines.push(`- \`${OUT}\``);
lines.push('- `data_processed/evidence_artifact_manifest.csv`');
lines.push('- `data_processed/global_hypothesis_gate_snapshot.csv`');
lines.push('- `data_processed/global_next_validation_backlog.csv`');

fs.writeFileSync(DOC, `${lines.join('\n')}\n`);

console.log(`global_goal_evidence_coverage=${OUT}`);
console.log(`doc=${DOC}`);
console.log(`rows=${rows.length}`);
