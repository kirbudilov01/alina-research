import fs from 'fs';

const OUT = 'data_processed/russian_validation_runway.csv';
const DOC = 'docs/decision/russian-validation-runway-v1.md';

for (const dir of ['data_processed', 'docs/decision']) fs.mkdirSync(dir, { recursive: true });

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

function clean(value) {
  return String(value ?? '').replace(/\s+/g, ' ').trim();
}

function csvEscape(value) {
  return `"${clean(value).replace(/"/g, '""')}"`;
}

function writeCsv(file, rows, headers) {
  fs.writeFileSync(file, [headers.join(','), ...rows.map(row => headers.map(h => csvEscape(row[h])).join(','))].join('\n'));
}

function mdTable(rows, columns, limit = rows.length) {
  const limited = rows.slice(0, limit);
  const header = `| ${columns.map(c => c.label).join(' | ')} |`;
  const sep = `| ${columns.map(c => c.align === 'right' ? '---:' : '---').join(' | ')} |`;
  const body = limited.map(row => `| ${columns.map(c => clean(row[c.key]).replace(/\|/g, '/')).join(' | ')} |`);
  return [header, sep, ...body].join('\n');
}

function sum(rows, key) {
  return rows.reduce((acc, row) => acc + Number(row[key] || 0), 0);
}

const competitor = csv('data_processed/russian_p0_walkthrough_dossiers.csv');
const paid = csv('data_processed/russian_paid_flow_dossiers.csv');
const icp = csv('data_processed/russian_icp_interview_dossiers.csv');
const prototype = csv('data_processed/russian_prototype_session_dossiers.csv');
const gates = csv('data_processed/russian_validation_gate_cards.csv');

const rows = [
  {
    runway_order: 1,
    workstream_id: 'WS_COMPETITOR_HIDDEN_CLONE',
    workstream_ru: 'P0 competitor walkthrough',
    linked_hypotheses: 'H1|H3',
    why_first_ru: 'Начинаем с hidden-clone риска: если Shepherd или другой P0 конкурент уже владеет полной петлей, whitespace и product-shape claims надо ослабить до дальнейшего расширения.',
    unit_count: competitor.length,
    required_capture_rows: sum(competitor, 'required_slots_count'),
    completed_capture_rows: sum(competitor, 'completed_slots_count'),
    p0_focus_ru: competitor.slice(0, 3).map(row => `${row.dossier_rank}. ${row.app_name}`).join(' | '),
    pass_rule_ru: '5 P0 продуктов имеют сопоставимые listing/onboarding/action/progress/paywall screenshots, и полный hidden direct clone не подтвержден.',
    downgrade_rule_ru: 'если walkthrough показывает полную петлю meaning -> action -> reset -> causally changing identity/avatar/progress -> next-day hook, H3 downgrade обязателен.',
    source_files: 'data_processed/russian_p0_walkthrough_dossiers.csv;data_processed/manual_walkthrough_capture_sheet.csv'
  },
  {
    runway_order: 2,
    workstream_id: 'WS_PAID_FLOW_SIGNOFF',
    workstream_ru: 'Paid-flow signoff',
    linked_hypotheses: 'H2',
    why_first_ru: 'После competitor boundary проверяем деньги: H2 нельзя усиливать по public pricing без human product-match и paywall-boundary signoff.',
    unit_count: paid.length,
    required_capture_rows: sum(paid, 'required_slots_count'),
    completed_capture_rows: sum(paid, 'completed_slots_count'),
    p0_focus_ru: paid.slice(0, 3).map(row => `${row.dossier_rank}. ${row.app_name}`).join(' | '),
    pass_rule_ru: 'visible price/trial, product-match, unlock depth и first meaningful paywall boundary подтверждены человеком для strongest paid-flow rows.',
    downgrade_rule_ru: 'если price относится к parent/B2B/unrelated/login-only flow, источник уходит из сильной H2 опоры.',
    source_files: 'data_processed/russian_paid_flow_dossiers.csv;data_processed/paid_flow_capture_sheet.csv'
  },
  {
    runway_order: 3,
    workstream_id: 'WS_ICP_INTERVIEWS',
    workstream_ru: 'ICP interviews',
    linked_hypotheses: 'H5|H6',
    why_first_ru: 'Проверяем, что аудитория существует как recent behavior, а не как красивая persona. P0 сегменты: ICP_A и ICP_D.',
    unit_count: icp.length,
    required_capture_rows: sum(icp, 'capture_rows_count'),
    completed_capture_rows: sum(icp, 'completed_capture_rows'),
    p0_focus_ru: icp.filter(row => row.priority === 'P0_top_two').map(row => `${row.segment_id}. ${row.segment_name}`).join(' | '),
    pass_rule_ru: 'P0 участники называют recent behavior, specific episode, current workaround, language resonance, paid depth и отсутствие fatal objection.',
    downgrade_rule_ru: 'если участники не называют recent behavior или paid depth/fatal objection ломают сегмент, ICP нельзя выбирать как primary.',
    source_files: 'data_processed/russian_icp_interview_dossiers.csv;data_processed/icp_interview_capture_sheet.csv'
  },
  {
    runway_order: 4,
    workstream_id: 'WS_PROTOTYPE_SESSIONS',
    workstream_ru: 'Prototype sessions',
    linked_hypotheses: 'H4|H6|H5|H2',
    why_first_ru: 'После сегментного fit проверяем петлю: участники должны понять causality, пройти flow, отличить Alina от generic alternatives и назвать paid-depth possibility.',
    unit_count: prototype.length,
    required_capture_rows: sum(prototype, 'capture_rows_count'),
    completed_capture_rows: sum(prototype, 'completed_capture_rows'),
    p0_focus_ru: prototype.map(row => `${row.segment_id}. ${row.segment_name}`).join(' | '),
    pass_rule_ru: 'scorecard проходит comprehension, two-minute completion, meaning lift, differentiation, trust/safety и paid-depth gates.',
    downgrade_rule_ru: 'если flow читается как generic habit tracker/vague reading/manipulative gamification/unsafe guidance, H4/H6 downgrade.',
    source_files: 'data_processed/russian_prototype_session_dossiers.csv;data_processed/prototype_session_capture_sheet.csv;data_processed/prototype_validation_scorecard.csv'
  },
  {
    runway_order: 5,
    workstream_id: 'WS_DECISION_REBUILD',
    workstream_ru: 'Decision rebuild and PDF refresh',
    linked_hypotheses: 'H1|H2|H3|H4|H5|H6',
    why_first_ru: 'Финальный шаг после observed rows: пересобрать gates, hypothesis decisions, completion audit, русский report/PDF и manifest, затем commit/push.',
    unit_count: gates.length,
    required_capture_rows: 0,
    completed_capture_rows: 0,
    p0_focus_ru: gates.map(row => row.hypothesis_id).join('|'),
    pass_rule_ru: 'claim statuses меняются только после заполненных capture rows и пересборки evidence package.',
    downgrade_rule_ru: 'если observed evidence противоречит desk claim, отчет должен стать слабее, а не красивее.',
    source_files: 'data_processed/hypothesis_decision_matrix.csv;data_processed/research_completion_audit.csv;reports/alina-russian-narrative-report-v1.md;output/pdf/alina-russian-narrative-report-v1.pdf'
  }
];

const headers = [
  'runway_order', 'workstream_id', 'workstream_ru', 'linked_hypotheses',
  'why_first_ru', 'unit_count', 'required_capture_rows', 'completed_capture_rows',
  'p0_focus_ru', 'pass_rule_ru', 'downgrade_rule_ru', 'source_files'
];

writeCsv(OUT, rows, headers);

const totalRequired = sum(rows, 'required_capture_rows');
const totalCompleted = sum(rows, 'completed_capture_rows');

const lines = [];
lines.push('# Русский validation runway V1');
lines.push('');
lines.push(`Собрано: ${new Date().toISOString()}`);
lines.push('');
lines.push('## Зачем нужен этот слой');
lines.push('');
lines.push('Этот runway соединяет все подготовленные dossier-слои в одну операторскую очередь. Он отвечает на вопрос: что делать первым, какие capture rows закрывать, какие гипотезы затрагиваются, когда claim можно усилить и когда его надо ослабить.');
lines.push('');
lines.push(`Всего required capture rows в runway: ${totalRequired}. Completed: ${totalCompleted}. Пока completed rows равны нулю, весь пакет остается evidence-ready, но не observed-validated.`);
lines.push('');
lines.push('## Очередь');
lines.push('');
lines.push(mdTable(rows, [
  { key: 'runway_order', label: '#' },
  { key: 'workstream_ru', label: 'Workstream' },
  { key: 'linked_hypotheses', label: 'H' },
  { key: 'unit_count', label: 'Units', align: 'right' },
  { key: 'required_capture_rows', label: 'Need', align: 'right' },
  { key: 'completed_capture_rows', label: 'Done', align: 'right' },
  { key: 'p0_focus_ru', label: 'P0 focus' }
], rows.length));
lines.push('');
for (const row of rows) {
  lines.push(`## ${row.runway_order}. ${row.workstream_ru}`);
  lines.push('');
  lines.push(`**Почему сейчас:** ${row.why_first_ru}`);
  lines.push('');
  lines.push(`**Pass:** ${row.pass_rule_ru}`);
  lines.push('');
  lines.push(`**Downgrade:** ${row.downgrade_rule_ru}`);
  lines.push('');
  lines.push(`**Files:** ${row.source_files}`);
  lines.push('');
}
lines.push('## Файлы');
lines.push('');
lines.push(`- \`${OUT}\``);
lines.push(`- \`${DOC}\``);

fs.writeFileSync(DOC, `${lines.join('\n')}\n`);

console.log(`russian_validation_runway=${rows.length}`);
console.log(`required_capture_rows=${totalRequired}`);
console.log(`completed_capture_rows=${totalCompleted}`);
console.log(`doc=${DOC}`);
