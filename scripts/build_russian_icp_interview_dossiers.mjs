import fs from 'fs';

const OUT = 'data_processed/russian_icp_interview_dossiers.csv';
const DOC = 'docs/audience/russian-icp-interview-dossiers-v1.md';

for (const dir of ['data_processed', 'docs/audience']) fs.mkdirSync(dir, { recursive: true });

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

function testPlanSummary(tests) {
  return tests
    .sort((a, b) => clean(a.test_id).localeCompare(clean(b.test_id)))
    .map(row => `${row.test_id}: ${row.validation_type} -> ${row.metric}`)
    .join(' | ');
}

function recruitingSummary(rows) {
  return rows
    .sort((a, b) => Number(b.matched_community_signal_rows || 0) - Number(a.matched_community_signal_rows || 0))
    .slice(0, 4)
    .map(row => `${row.source_signal_kind}: ${row.recruiting_channel_hypothesis}`)
    .join(' | ');
}

function promptSummary(tests) {
  return tests
    .filter(row => ['screener', 'problem_interview', 'willingness_to_pay', 'disconfirmation'].includes(row.validation_type))
    .map(row => `${row.validation_type}: ${row.task_or_question}`)
    .join(' | ');
}

function gateRule(segment) {
  if (segment.segment_id === 'ICP_A') return 'апгрейдить primary ICP, если recent behavior, trust, meaning lift и WTP не противоречат spiritual/self-improvement framing.';
  if (segment.segment_id === 'ICP_D') return 'апгрейдить primary ICP, если action-tied progress выигрывает у plain checklist/streak и не вызывает streak anxiety.';
  return 'оставить как secondary ICP, пока P0_top_two не дадут слабый результат или сегмент не покажет более сильный recent-behavior/WTP signal.';
}

function downgradeRule(segment) {
  return `ослабить сегмент, если участники не называют recent behavior, проблема оказывается абстрактной, paid depth отвергается, или возникает fatal objection: ${segment.main_risk}`;
}

const segments = csv('data_processed/icp_segment_matrix.csv');
const tests = csv('data_processed/icp_validation_test_plan.csv');
const capture = csv('data_processed/icp_interview_capture_sheet.csv');
const recruiting = csv('data_processed/icp_recruiting_bridge.csv');
const battlecards = csv('data_processed/russian_icp_battlecards.csv');

const rows = segments.map(segment => {
  const segmentTests = tests.filter(row => row.segment_id === segment.segment_id);
  const segmentCapture = capture.filter(row => clean(row.test_id).startsWith(`${segment.segment_id}_`));
  const segmentRecruiting = recruiting.filter(row => row.segment_id === segment.segment_id);
  const completed = segmentCapture.filter(row => !['', 'not_started'].includes(clean(row.capture_status))).length;
  const card = battlecards.find(row => row.segment_id === segment.segment_id) || {};
  return {
    segment_id: segment.segment_id,
    segment_name: segment.segment_name,
    priority: segmentTests.some(row => row.priority === 'P0_top_two') ? 'P0_top_two' : 'P1_secondary',
    evidence_band: segment.evidence_band,
    evidence_score: segment.evidence_score,
    primary_markets: segment.primary_markets,
    core_job_ru: segment.core_job,
    entry_behavior_ru: segment.entry_behavior,
    positioning_angle_ru: segment.positioning_angle,
    main_risk_ru: segment.main_risk,
    validation_gate_ru: segment.validation_gate,
    interview_tests_count: segmentTests.length,
    capture_rows_count: segmentCapture.length,
    completed_capture_rows: completed,
    recruiting_channels_count: segmentRecruiting.length,
    best_recruiting_routes_ru: recruitingSummary(segmentRecruiting),
    test_plan_ru: testPlanSummary(segmentTests),
    prompt_pack_ru: promptSummary(segmentTests),
    success_rule_ru: gateRule(segment),
    downgrade_rule_ru: downgradeRule(segment),
    evidence_to_capture_ru: segmentRecruiting[0]?.evidence_to_capture || 'recent_behavior_match|specific_episode|verbatim_language|loop_comprehension|meaning_lift_1_5|differentiation_1_5|return_intent_1_5|paid_depth_feature|fatal_objection',
    ethical_constraint_ru: segmentRecruiting[0]?.ethical_constraint || 'Recruit only transparently and with consent.',
    battlecard_summary_ru: card.narrative_ru || card.positioning_ru || '',
    output_target: 'data_processed/icp_interview_capture_sheet.csv;data_processed/icp_validation_test_plan.csv;data_processed/icp_segment_matrix.csv;data_processed/hypothesis_decision_matrix.csv'
  };
});

const headers = [
  'segment_id', 'segment_name', 'priority', 'evidence_band', 'evidence_score',
  'primary_markets', 'core_job_ru', 'entry_behavior_ru', 'positioning_angle_ru',
  'main_risk_ru', 'validation_gate_ru', 'interview_tests_count', 'capture_rows_count',
  'completed_capture_rows', 'recruiting_channels_count', 'best_recruiting_routes_ru',
  'test_plan_ru', 'prompt_pack_ru', 'success_rule_ru', 'downgrade_rule_ru',
  'evidence_to_capture_ru', 'ethical_constraint_ru', 'battlecard_summary_ru', 'output_target'
];

writeCsv(OUT, rows, headers);

const p0 = rows.filter(row => row.priority === 'P0_top_two');
const totalCapture = rows.reduce((sum, row) => sum + Number(row.capture_rows_count || 0), 0);
const completedCapture = rows.reduce((sum, row) => sum + Number(row.completed_capture_rows || 0), 0);

const lines = [];
lines.push('# Русские ICP interview dossiers V1');
lines.push('');
lines.push(`Собрано: ${new Date().toISOString()}`);
lines.push('');
lines.push('## Зачем нужен этот слой');
lines.push('');
lines.push('Этот dossier переводит H5 из audience matrix в исполнимую программу интервью. По каждому ICP видно: кого искать, через какие каналы, какие шесть тестов провести, какие evidence fields заполнить, что усилит сегмент и что его ослабит. Это не заменяет интервью; это делает их сопоставимыми и защищает отчет от выбора аудитории по вкусу.');
lines.push('');
lines.push(`Всего ICP dossiers: ${rows.length}. P0 segments: ${p0.map(row => row.segment_id).join(', ')}. Capture rows: ${totalCapture}. Completed rows: ${completedCapture}. Пока completed rows равны нулю, H5 остается directionally supported, но не validated.`);
lines.push('');
lines.push('## ICP очередь');
lines.push('');
lines.push(mdTable(rows, [
  { key: 'segment_id', label: 'ICP' },
  { key: 'segment_name', label: 'Segment' },
  { key: 'priority', label: 'Priority' },
  { key: 'evidence_score', label: 'Score', align: 'right' },
  { key: 'capture_rows_count', label: 'Rows', align: 'right' },
  { key: 'completed_capture_rows', label: 'Done', align: 'right' },
  { key: 'success_rule_ru', label: 'Upgrade rule' }
], rows.length));
lines.push('');
for (const row of rows) {
  lines.push(`## ${row.segment_id}. ${row.segment_name}`);
  lines.push('');
  lines.push(`**Core job:** ${row.core_job_ru}`);
  lines.push('');
  lines.push(`**Entry behavior:** ${row.entry_behavior_ru}`);
  lines.push('');
  lines.push(`**Recruiting:** ${row.best_recruiting_routes_ru}`);
  lines.push('');
  lines.push(`**Tests:** ${row.test_plan_ru}`);
  lines.push('');
  lines.push(`**Prompt pack:** ${row.prompt_pack_ru}`);
  lines.push('');
  lines.push(`**Capture:** ${row.evidence_to_capture_ru}`);
  lines.push('');
  lines.push(`**Upgrade:** ${row.success_rule_ru}`);
  lines.push('');
  lines.push(`**Downgrade:** ${row.downgrade_rule_ru}`);
  lines.push('');
  lines.push(`**Ethics:** ${row.ethical_constraint_ru}`);
  lines.push('');
}
lines.push('## Файлы');
lines.push('');
lines.push(`- \`${OUT}\``);
lines.push(`- \`${DOC}\``);
lines.push('- `data_processed/icp_segment_matrix.csv`');
lines.push('- `data_processed/icp_validation_test_plan.csv`');
lines.push('- `data_processed/icp_interview_capture_sheet.csv`');
lines.push('- `data_processed/icp_recruiting_bridge.csv`');

fs.writeFileSync(DOC, `${lines.join('\n')}\n`);

console.log(`russian_icp_interview_dossiers=${rows.length}`);
console.log(`p0_segments=${p0.length}`);
console.log(`capture_rows=${totalCapture}`);
console.log(`completed_capture_rows=${completedCapture}`);
console.log(`doc=${DOC}`);
