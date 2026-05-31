import fs from 'fs';

const CSV_OUT = 'data_processed/russian_report_steering_brief.csv';
const DOC_OUT = 'docs/decision/russian-report-steering-brief-v1.md';
const REPORT_OUT = 'reports/alina-russian-steering-brief-v1.md';

for (const dir of ['data_processed', 'docs/decision', 'reports']) fs.mkdirSync(dir, { recursive: true });

function clean(value) {
  return String(value ?? '').replace(/\s+/g, ' ').trim();
}

function csvEscape(value) {
  return `"${clean(value).replace(/"/g, '""')}"`;
}

function parseCsv(text) {
  const rows = [];
  let row = [];
  let cell = '';
  let quoted = false;
  for (let i = 0; i < text.length; i += 1) {
    const ch = text[i];
    const next = text[i + 1];
    if (quoted) {
      if (ch === '"' && next === '"') {
        cell += '"';
        i += 1;
      } else if (ch === '"') {
        quoted = false;
      } else {
        cell += ch;
      }
    } else if (ch === '"') {
      quoted = true;
    } else if (ch === ',') {
      row.push(cell);
      cell = '';
    } else if (ch === '\n') {
      row.push(cell);
      rows.push(row);
      row = [];
      cell = '';
    } else if (ch !== '\r') {
      cell += ch;
    }
  }
  if (cell || row.length) {
    row.push(cell);
    rows.push(row);
  }
  const [headers, ...body] = rows;
  if (!headers) return [];
  return body
    .filter(r => r.some(Boolean))
    .map(r => Object.fromEntries(headers.map((h, i) => [h, r[i] ?? ''])));
}

function csv(file) {
  return fs.existsSync(file) ? parseCsv(fs.readFileSync(file, 'utf8')) : [];
}

function writeCsv(file, rows, headers) {
  fs.writeFileSync(file, `${[headers.join(','), ...rows.map(row => headers.map(h => csvEscape(row[h])).join(','))].join('\n')}\n`);
}

function mdTable(rows, columns) {
  const header = `| ${columns.map(c => c.label).join(' | ')} |`;
  const sep = `| ${columns.map(c => c.align === 'right' ? '---:' : '---').join(' | ')} |`;
  const body = rows.map(row => `| ${columns.map(c => clean(row[c.key]).replace(/\|/g, '/')).join(' | ')} |`);
  return [header, sep, ...body].join('\n');
}

function num(value) {
  const n = Number(String(value ?? '').replace(/[^\d.-]/g, ''));
  return Number.isFinite(n) ? n : 0;
}

function fmt(value) {
  return Math.round(num(value)).toLocaleString('en-US');
}

function by(rows, key, value) {
  return rows.find(row => row[key] === value) || {};
}

function ratio(row, field, fallback) {
  return clean(row[field]) || fallback;
}

const sourceScale = csv('data_processed/source_scale_milestone.csv');
const nicheRollup = csv('data_processed/global_niche_count_rollup.csv');
const nicheReconciliation = csv('data_processed/niche_count_reconciliation.csv');
const gates = csv('data_processed/global_hypothesis_gate_snapshot.csv');
const recommendations = csv('data_processed/russian_decision_recommendations.csv');
const p0Slice = csv('data_processed/p0_validation_execution_slice.csv');
const manifest = csv('data_processed/evidence_artifact_manifest.csv');
const completionAudit = csv('data_processed/research_completion_audit.csv');

const rawSource = by(sourceScale, 'milestone_id', 'RAW_50K_SOURCE_SCALE');
const dedupBand = by(sourceScale, 'milestone_id', 'DEDUP_30_40K_BAND');
const directApp = by(nicheReconciliation, 'count_type_ru', 'sum of direct app-store dedup rows by niche');
const allSourceNiche = by(nicheReconciliation, 'count_type_ru', 'sum of all-source niche dedup rows');
const missingManifest = manifest.filter(row => row.exists !== 'yes').length;
const gatesHold = gates.filter(row => clean(row.decision_ru) === 'оставить hold_validate' || clean(row.current_decision) === 'hold_validate').length;

const rows = [
  {
    section_id: 'S01_STATUS',
    section_ru: 'Вердикт на сегодня',
    conclusion_ru: 'Отчет уже можно читать как крупную карту мирового рынка и план проверки, но нельзя читать как доказанный PMF или финальное go.',
    evidence_ru: `raw=${fmt(rawSource.metric_value)}; global_dedup=${fmt(dedupBand.metric_value)}; manifest=${fmt(manifest.length)}; missing=${fmt(missingManifest)}; gates_hold=${fmt(gatesHold)}/${fmt(gates.length)}`,
    decision_ru: 'Использовать как decision pack для validation-first спринта.',
    boundary_ru: 'Не продавать как доказательство спроса, выручки или выбранного ICP.'
  },
  {
    section_id: 'S02_COUNTS',
    section_ru: 'Сколько данных собрано',
    conclusion_ru: 'Счетчики теперь разделены: global source scale, direct app-store слой и all-source niche слой отвечают на разные вопросы.',
    evidence_ru: `global raw=${fmt(rawSource.metric_value)}; global dedup=${fmt(dedupBand.metric_value)}; direct app-store niche sum=${fmt(directApp.count_value)}; all-source niche sum=${fmt(allSourceNiche.count_value)}`,
    decision_ru: 'В reader/executive тексте показывать все четыре числа рядом с пояснением scope.',
    boundary_ru: 'Не складывать niche dedup как общее число уникальных приложений.'
  },
  {
    section_id: 'S03_MARKET_PRIORITY',
    section_ru: 'Приоритет рынков',
    conclusion_ru: 'Первые проверки лучше держать вокруг Mindfulness/reset и Avatar/identity; Astrology и Coaching использовать как язык аудитории и paid-depth контекст; Gaming оставить benchmark-only.',
    evidence_ru: nicheRollup.map(row => `${row.market_ru}: direct ${row.direct_app_store_dedup_rows}, all ${row.all_source_dedup_rows}`).join(' | '),
    decision_ru: 'MVP и интервью формулировать как daily meaning/action/reset/progress loop, а не как игру, астрологию или трекер.',
    boundary_ru: 'Gaming не использовать как прямой TAM/whitespace proof до доказанного behavioral overlap.'
  },
  {
    section_id: 'S04_HYPOTHESES',
    section_ru: 'Статус гипотез',
    conclusion_ru: 'Все H1-H6 остаются hold_validate: это нормальный статус для evidence-first ресерча до observed rows.',
    evidence_ru: gates.map(row => `${row.hypothesis_id}: ${ratio(row, 'completed_vs_required', 'n/a')}, success ${ratio(row, 'success_vs_threshold', 'n/a')}`).join(' | '),
    decision_ru: 'Усиливать claims только после walkthrough, interviews, prototype sessions и WTP capture.',
    boundary_ru: 'Desk evidence и public listing signoff не заменяют наблюдаемую проверку.'
  },
  {
    section_id: 'S05_PRODUCT_CORE',
    section_ru: 'Продуктовое ядро',
    conclusion_ru: 'Проверяемая ставка: personal meaning -> tiny action -> reset -> visible identity/progress -> next-day hook.',
    evidence_ru: 'H4/H6 пока без success rows; prototype stimulus и scorecards готовы, но пользовательских сессий нет.',
    decision_ru: 'Сузить MVP до одной причинной сессии и измерять понимание причинности.',
    boundary_ru: 'Не расширять feature set до проверки базовой петли.'
  },
  {
    section_id: 'S06_NEXT_SPRINT',
    section_ru: 'Следующий спринт',
    conclusion_ru: 'Следующий прирост качества должен прийти от observed validation, а не от еще одного большого слоя desk research.',
    evidence_ru: `P0 execution slice=${fmt(p0Slice.length)} tasks; first blocks=${[...new Set(p0Slice.map(row => row.execution_block_ru).filter(Boolean))].join(' -> ')}`,
    decision_ru: 'Сначала 5 hidden-clone walkthrough, затем 5 paid-flow/WTP, затем ICP recent-behavior interviews, затем prototype sessions.',
    boundary_ru: 'Не переписывать выводы руками: сначала capture rows, потом генераторы и PDF.'
  },
  {
    section_id: 'S07_RECOMMENDATIONS',
    section_ru: 'Рекомендации',
    conclusion_ru: 'Управленческий слой уже сформулирован и должен оставаться жестким: продолжать, но не объявлять go.',
    evidence_ru: recommendations.map(row => `${row.block_ru}: ${row.recommendation_ru}`).slice(0, 4).join(' | '),
    decision_ru: 'В pitch/обсуждениях говорить “мы проверяем связку”, а не “мы доказали рынок Alina”.',
    boundary_ru: 'Не использовать сильные формулировки без gate upgrade.'
  },
  {
    section_id: 'S08_COMPLETION',
    section_ru: 'Что еще не закрыто',
    conclusion_ru: 'Финальная цель не завершена, потому что validation gates не прошли и нет фактических пользовательских/продуктовых наблюдений.',
    evidence_ru: completionAudit.filter(row => row.status.includes('open') || row.status.includes('hold') || row.status.includes('not_validated')).map(row => `${row.requirement_id}: ${row.status}`).join(' | '),
    decision_ru: 'Держать цель активной и двигаться по P0 validation rows.',
    boundary_ru: 'Не закрывать goal как complete до requirement-by-requirement proof.'
  }
];

writeCsv(CSV_OUT, rows, ['section_id', 'section_ru', 'conclusion_ru', 'evidence_ru', 'decision_ru', 'boundary_ru']);

const lines = [];
lines.push('# Alina Research. Steering Brief на русском');
lines.push('');
lines.push(`Собрано: ${new Date().toISOString().slice(0, 10)}`);
lines.push('');
lines.push('## Зачем нужен этот brief');
lines.push('');
lines.push('Это короткий слой для чтения перед большим PDF. Он отвечает на вопросы: что уже можно утверждать, сколько данных собрано по рынкам, где границы доказательств, какие рекомендации действуют и что надо делать первым. Он не добавляет новых утверждений поверх данных, а сжимает существующий evidence pack в управленческую форму.');
lines.push('');
lines.push('## Главное');
lines.push('');
lines.push(`Сейчас пакет доказывает масштаб desk research: ${fmt(rawSource.metric_value)} raw source rows, ${fmt(dedupBand.metric_value)} global dedup rows, ${fmt(manifest.length)} локальных артефактов в manifest и ${fmt(missingManifest)} missing. Но все validation gates остаются hold_validate, поэтому итоговый вывод должен звучать осторожно: Alina стоит проверять дальше, но продукт, аудитория, WTP и конкурентное преимущество еще не доказаны наблюдаемыми данными.`);
lines.push('');
lines.push('## Decision Table');
lines.push('');
lines.push(mdTable(rows, [
  { key: 'section_ru', label: 'Блок' },
  { key: 'conclusion_ru', label: 'Вывод' },
  { key: 'evidence_ru', label: 'Опора' },
  { key: 'decision_ru', label: 'Решение' },
  { key: 'boundary_ru', label: 'Граница' }
]));
lines.push('');
lines.push('## Счетчики по пяти направлениям');
lines.push('');
lines.push(mdTable(nicheRollup.map(row => ({
  market: row.market_ru,
  raw: row.all_source_raw_rows,
  allDedup: row.all_source_dedup_rows,
  direct: row.direct_app_store_dedup_rows,
  role: row.role_ru,
  boundary: row.claim_boundary_ru
})), [
  { key: 'market', label: 'Направление' },
  { key: 'raw', label: 'All-source raw' },
  { key: 'allDedup', label: 'All-source dedup' },
  { key: 'direct', label: 'Direct app-store dedup' },
  { key: 'role', label: 'Роль' },
  { key: 'boundary', label: 'Как читать' }
]));
lines.push('');
lines.push('## Что открыть дальше');
lines.push('');
lines.push('- `reports/alina-global-reader-report-v1.md` - читательская версия отчета.');
lines.push('- `reports/alina-global-executive-narrative-v1.md` - управленческая narrative-версия.');
lines.push('- `reports/alina-global-hypothesis-report-v1.md` - полный гипотезный отчет.');
lines.push('- `data_processed/p0_validation_execution_slice.csv` - первая очередь действий.');
lines.push('- `data_processed/research_completion_audit.csv` - честный audit незакрытых требований.');
lines.push('');
lines.push('## Boundary');
lines.push('');
lines.push('Этот brief улучшает читаемость и управленческую последовательность. Он не заменяет manual walkthrough, ICP interviews, prototype sessions и willingness-to-pay validation.');

const text = `${lines.join('\n')}\n`;
fs.writeFileSync(DOC_OUT, text);
fs.writeFileSync(REPORT_OUT, text);

console.log(`steering_brief_csv=${CSV_OUT}`);
console.log(`steering_brief_doc=${DOC_OUT}`);
console.log(`steering_brief_report=${REPORT_OUT}`);
console.log(`sections=${rows.length}`);
