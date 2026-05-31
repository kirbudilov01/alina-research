import fs from 'fs';

const OUT = 'data_processed/russian_prototype_session_dossiers.csv';
const DOC = 'docs/product/russian-prototype-session-dossiers-v1.md';

for (const dir of ['data_processed', 'docs/product']) fs.mkdirSync(dir, { recursive: true });

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

function screenPlan(rows) {
  return rows
    .sort((a, b) => Number(a.step || 0) - Number(b.step || 0))
    .map(row => `${row.screen_id}: ${row.screen_name} -> ${row.test_question}`)
    .join(' | ');
}

function metricSummary(rows) {
  return rows.map(row => `${row.metric_id}/${row.gate}: success ${row.success_threshold}; kill ${row.kill_threshold}`).join(' | ');
}

const stimulus = csv('data_processed/prototype_validation_stimulus_flow.csv');
const scorecard = csv('data_processed/prototype_validation_scorecard.csv');
const capture = csv('data_processed/prototype_session_capture_sheet.csv');
const loopCards = csv('data_processed/russian_product_loop_cards.csv');
const icpDossiers = csv('data_processed/russian_icp_interview_dossiers.csv');

const segments = Array.from(new Set(stimulus.map(row => row.segment_id).filter(Boolean)));
const rows = segments.map(segmentId => {
  const screens = stimulus.filter(row => row.segment_id === segmentId);
  const segmentCapture = capture.filter(row => row.segment_id === segmentId);
  const completed = segmentCapture.filter(row => !['', 'not_started'].includes(clean(row.capture_status))).length;
  const segment = screens[0] || {};
  const icp = icpDossiers.find(row => row.segment_id === segmentId) || {};
  const criticalScreens = screens
    .filter(row => ['S03_ACTION_CARD', 'S06_AVATAR_CHANGE', 'S08_VALUE_CHECK'].includes(row.screen_id))
    .map(row => `${row.screen_id}: ${row.expected_signal}`)
    .join(' | ');
  return {
    segment_id: segmentId,
    segment_name: segment.segment_name,
    primary_markets: segment.primary_markets,
    core_job_ru: segment.core_job,
    positioning_angle_ru: segment.positioning_angle,
    main_risk_ru: segment.main_risk,
    screen_count: screens.length,
    capture_rows_count: segmentCapture.length,
    completed_capture_rows: completed,
    session_flow_ru: screenPlan(screens),
    critical_screens_ru: criticalScreens,
    scorecard_metrics_ru: metricSummary(scorecard),
    required_evidence_ru: 'completion_time_seconds|comprehension_yes_no|meaning_lift_1_5|differentiation_1_5|return_intent_1_5|verbatim_quote|fatal_objection',
    upgrade_rule_ru: 'усилить H4/H6 только если участники понимают причинность meaning -> action -> avatar/progress, проходят петлю примерно за две минуты, видят отличие от habit/coach/meditation альтернатив и не дают fatal trust/safety objection.',
    downgrade_rule_ru: `ослабить H4/H6, если пользователи читают петлю как generic habit tracker, vague reading, manipulative gamification, childish avatar toy или unsafe guidance. Segment risk: ${segment.main_risk}`,
    p0_icp_link_ru: icp.success_rule_ru || '',
    output_target: 'data_processed/prototype_session_capture_sheet.csv;data_processed/prototype_validation_scorecard.csv;data_processed/hypothesis_decision_matrix.csv'
  };
});

const headers = [
  'segment_id', 'segment_name', 'primary_markets', 'core_job_ru', 'positioning_angle_ru',
  'main_risk_ru', 'screen_count', 'capture_rows_count', 'completed_capture_rows',
  'session_flow_ru', 'critical_screens_ru', 'scorecard_metrics_ru', 'required_evidence_ru',
  'upgrade_rule_ru', 'downgrade_rule_ru', 'p0_icp_link_ru', 'output_target'
];

writeCsv(OUT, rows, headers);

const totalCapture = rows.reduce((sum, row) => sum + Number(row.capture_rows_count || 0), 0);
const completedCapture = rows.reduce((sum, row) => sum + Number(row.completed_capture_rows || 0), 0);

const lines = [];
lines.push('# Русские prototype session dossiers V1');
lines.push('');
lines.push(`Собрано: ${new Date().toISOString()}`);
lines.push('');
lines.push('## Зачем нужен этот слой');
lines.push('');
lines.push('Этот dossier переводит H4/H6 из красивого описания продуктовой петли в исполнимую программу прототипных сессий. Он показывает, какие экраны проходят участники, какие моменты являются критическими, какие scorecard metrics решают конкурентное преимущество и продуктовое ядро, и какие ответы заставляют усилить или ослабить claims.');
lines.push('');
lines.push(`Всего prototype dossiers: ${rows.length}. Capture rows: ${totalCapture}. Completed rows: ${completedCapture}. Scorecard metrics: ${scorecard.length}. Пока completed rows равны нулю, H4/H6 остаются prototype-stimulus-ready, но не validated.`);
lines.push('');
lines.push('## Prototype session очередь');
lines.push('');
lines.push(mdTable(rows, [
  { key: 'segment_id', label: 'ICP' },
  { key: 'segment_name', label: 'Segment' },
  { key: 'screen_count', label: 'Screens', align: 'right' },
  { key: 'capture_rows_count', label: 'Rows', align: 'right' },
  { key: 'completed_capture_rows', label: 'Done', align: 'right' },
  { key: 'critical_screens_ru', label: 'Critical screens' }
], rows.length));
lines.push('');
for (const row of rows) {
  lines.push(`## ${row.segment_id}. ${row.segment_name}`);
  lines.push('');
  lines.push(`**Core job:** ${row.core_job_ru}`);
  lines.push('');
  lines.push(`**Flow:** ${row.session_flow_ru}`);
  lines.push('');
  lines.push(`**Critical screens:** ${row.critical_screens_ru}`);
  lines.push('');
  lines.push(`**Scorecard:** ${row.scorecard_metrics_ru}`);
  lines.push('');
  lines.push(`**Capture:** ${row.required_evidence_ru}`);
  lines.push('');
  lines.push(`**Upgrade:** ${row.upgrade_rule_ru}`);
  lines.push('');
  lines.push(`**Downgrade:** ${row.downgrade_rule_ru}`);
  lines.push('');
}
lines.push('## Файлы');
lines.push('');
lines.push(`- \`${OUT}\``);
lines.push(`- \`${DOC}\``);
lines.push('- `data_processed/prototype_validation_stimulus_flow.csv`');
lines.push('- `data_processed/prototype_validation_scorecard.csv`');
lines.push('- `data_processed/prototype_session_capture_sheet.csv`');
lines.push('- `data_processed/russian_product_loop_cards.csv`');

fs.writeFileSync(DOC, `${lines.join('\n')}\n`);

console.log(`russian_prototype_session_dossiers=${rows.length}`);
console.log(`capture_rows=${totalCapture}`);
console.log(`completed_capture_rows=${completedCapture}`);
console.log(`scorecard_metrics=${scorecard.length}`);
console.log(`loop_cards=${loopCards.length}`);
console.log(`doc=${DOC}`);
