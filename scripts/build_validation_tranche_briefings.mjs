import fs from 'fs';

const OUT = 'data_processed/validation_tranche_briefing_index.csv';
const DOC = 'docs/decision/validation-tranche-briefings-v1.md';
const DATE = new Date().toISOString().slice(0, 10);
const BRIEF_DIR = `output/validation/${DATE}/tranche_briefings`;

for (const dir of ['data_processed', 'docs/decision', BRIEF_DIR]) fs.mkdirSync(dir, { recursive: true });

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
  fs.writeFileSync(file, `${[headers.join(','), ...rows.map(row => headers.map(h => csvEscape(row[h])).join(','))].join('\n')}\n`);
}

function mdTable(rows, columns, limit = rows.length) {
  const limited = rows.slice(0, limit);
  const header = `| ${columns.map(c => c.label).join(' | ')} |`;
  const sep = `| ${columns.map(c => c.align === 'right' ? '---:' : '---').join(' | ')} |`;
  const body = limited.map(row => `| ${columns.map(c => clean(row[c.key]).replace(/\|/g, '<br>')).join(' | ')} |`);
  return [header, sep, ...body].join('\n');
}

function slug(value) {
  return clean(value).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'untitled';
}

function ids(rows, key = 'capture_id', limit = 12) {
  return rows.slice(0, limit).map(row => row[key]).filter(Boolean).join('|');
}

function apps(rows, limit = 8) {
  return [...new Set(rows.map(row => row.app_name || row.segment_name || row.thread_title || row.target_scope).filter(Boolean))]
    .slice(0, limit)
    .join('|');
}

function bySet(rows, key, values) {
  return rows.filter(row => values.includes(row[key]));
}

function firstN(rows, predicate, n) {
  return rows.filter(predicate).slice(0, n);
}

function noteValue(row, fields) {
  return fields.map(field => row[field]).filter(Boolean).join(' | ');
}

const planner = csv('data_processed/validation_tranche_planner.csv');
const manual = csv('data_processed/manual_walkthrough_capture_sheet.csv');
const paid = csv('data_processed/paid_flow_capture_sheet.csv');
const icp = csv('data_processed/icp_interview_capture_sheet.csv');
const prototype = csv('data_processed/prototype_session_capture_sheet.csv');
const reddit = csv('data_processed/reddit_manual_reading_capture_sheet.csv');
const gates = csv('data_processed/validation_gate_calculator.csv');

const briefingSpecs = [
  {
    tranche_id: 'TRANCHE_01_HIDDEN_CLONE_SPIKE',
    capture_rows: firstN(manual, row => row.inspection_rank === '1', 5),
    source_files: 'data_processed/manual_walkthrough_capture_sheet.csv;data_processed/manual_competitor_inspection_packet.csv;data_processed/public_listing_inspection_results.csv',
    operator_minutes: '45-75',
    rows_table: [
      { key: 'capture_id', label: 'Capture ID' },
      { key: 'app_name', label: 'App' },
      { key: 'screenshot_slot', label: 'Slot' },
      { key: 'capture_question', label: 'Question' },
      { key: 'source_url', label: 'URL' }
    ]
  },
  {
    tranche_id: 'TRANCHE_02_MANUAL_TOP5',
    capture_rows: firstN(manual, row => Number(row.inspection_rank || 0) <= 5, 25),
    source_files: 'data_processed/manual_walkthrough_capture_sheet.csv;data_processed/manual_competitor_inspection_packet.csv',
    operator_minutes: '180-300',
    rows_table: [
      { key: 'capture_id', label: 'Capture ID' },
      { key: 'app_name', label: 'App' },
      { key: 'screenshot_slot', label: 'Slot' },
      { key: 'capture_question', label: 'Question' }
    ]
  },
  {
    tranche_id: 'TRANCHE_03_PAID_CONFIRMED_SPIKE',
    capture_rows: firstN(paid, row => row.visual_adjudication_prefill === 'confirmed_visible_public_pricing', 8),
    source_files: 'data_processed/paid_flow_capture_sheet.csv;data_processed/web_paywall_visual_adjudication.csv',
    operator_minutes: '60-90',
    rows_table: [
      { key: 'capture_id', label: 'Capture ID' },
      { key: 'app_name', label: 'App' },
      { key: 'capture_slot', label: 'Slot' },
      { key: 'capture_question', label: 'Question' },
      { key: 'source_url', label: 'URL' }
    ]
  },
  {
    tranche_id: 'TRANCHE_04_ICP_PILOT',
    capture_rows: bySet(icp, 'participant_slot', ['P01', 'P02']),
    source_files: 'data_processed/icp_interview_capture_sheet.csv;data_processed/icp_validation_test_plan.csv;data_processed/icp_segment_matrix.csv',
    operator_minutes: '120-180',
    rows_table: [
      { key: 'capture_id', label: 'Capture ID' },
      { key: 'segment_name', label: 'Segment' },
      { key: 'participant_slot', label: 'Participant' },
      { key: 'test_type', label: 'Test' },
      { key: 'metric', label: 'Metric' }
    ]
  },
  {
    tranche_id: 'TRANCHE_05_PROTOTYPE_PILOT',
    capture_rows: bySet(prototype, 'participant_slot', ['P01', 'P02']),
    source_files: 'data_processed/prototype_session_capture_sheet.csv;data_processed/prototype_validation_stimulus_flow.csv;data_processed/prototype_validation_scorecard.csv',
    operator_minutes: '90-150',
    rows_table: [
      { key: 'capture_id', label: 'Capture ID' },
      { key: 'segment_name', label: 'Segment' },
      { key: 'participant_slot', label: 'Participant' },
      { key: 'screen_id', label: 'Screen' },
      { key: 'screen_name', label: 'Name' }
    ]
  },
  {
    tranche_id: 'TRANCHE_06_REDDIT_TOP25_LANGUAGE',
    capture_rows: firstN(reddit, row => row.priority_band === 'P0_read_first' && Number(row.priority_rank || 0) <= 25, 25),
    source_files: 'data_processed/reddit_manual_reading_capture_sheet.csv;data_processed/reddit_manual_reading_queue.csv',
    operator_minutes: '150-240',
    rows_table: [
      { key: 'capture_id', label: 'Capture ID' },
      { key: 'priority_rank', label: 'Rank', align: 'right' },
      { key: 'queue_lane', label: 'Lane' },
      { key: 'thread_title', label: 'Thread' },
      { key: 'source_url', label: 'URL' }
    ]
  }
];

function briefingMarkdown(plan, spec, filePath) {
  const lines = [];
  const gateRows = gates.filter(row => clean(plan.linked_gates).split('|').includes(row.gate_id));
  lines.push(`# ${plan.tranche_id} Briefing`);
  lines.push('');
  lines.push(`Generated: ${new Date().toISOString()}`);
  lines.push('');
  lines.push('## Operator Goal');
  lines.push('');
  lines.push(plan.operator_goal_ru);
  lines.push('');
  lines.push('## Scope');
  lines.push('');
  lines.push(`- Priority: ${plan.priority}`);
  lines.push(`- Workstream: ${plan.workstream_mix}`);
  lines.push(`- Target scope: ${plan.target_scope}`);
  lines.push(`- Capture rows in this briefing: ${spec.capture_rows.length}`);
  lines.push(`- Estimated operator time: ${spec.operator_minutes} minutes`);
  lines.push(`- Source files: ${spec.source_files}`);
  lines.push('');
  lines.push('## Success And Stop Rules');
  lines.push('');
  lines.push(`- Success threshold: ${plan.success_threshold_ru}`);
  lines.push(`- Stop/downgrade rule: ${plan.stop_or_downgrade_rule_ru}`);
  lines.push(`- Rebuild after tranche: ${plan.rebuild_after_tranche}`);
  lines.push('');
  if (gateRows.length) {
    lines.push('## Linked Gates');
    lines.push('');
    lines.push(mdTable(gateRows, [
      { key: 'gate_id', label: 'Gate' },
      { key: 'linked_hypotheses', label: 'Hypotheses' },
      { key: 'gate_status', label: 'Status' },
      { key: 'success_gate', label: 'Success' },
      { key: 'kill_or_downgrade_gate', label: 'Kill / Downgrade' }
    ], gateRows.length));
    lines.push('');
  }
  lines.push('## Capture Rows');
  lines.push('');
  lines.push(mdTable(spec.capture_rows, spec.rows_table, spec.capture_rows.length));
  lines.push('');
  lines.push('## Fields To Fill');
  lines.push('');
  lines.push('- capture_status');
  lines.push('- observed_answer_or_score / observed_behavior / observed_price_or_trial');
  lines.push('- success_flag or final label');
  lines.push('- fatal_objection_flag or downgrade trigger');
  lines.push('- exact_quote or visible text where relevant');
  lines.push('- researcher_notes / inspector_notes / human_notes');
  lines.push('- local screenshot or notes paths');
  lines.push('');
  lines.push('## Claim Boundary');
  lines.push('');
  lines.push('This briefing is not validation evidence. It only routes the operator to the right rows. Claims change only after the source capture rows are filled, linked to saved evidence, and rebuilt into gate/audit/report artifacts.');
  lines.push('');
  lines.push('## File');
  lines.push('');
  lines.push(`- \`${filePath}\``);
  return `${lines.join('\n')}\n`;
}

const indexRows = briefingSpecs.map((spec, index) => {
  const plan = planner.find(row => row.tranche_id === spec.tranche_id) || {};
  const filePath = `${BRIEF_DIR}/${String(index + 1).padStart(2, '0')}__${slug(spec.tranche_id)}__briefing.md`;
  fs.writeFileSync(filePath, briefingMarkdown(plan, spec, filePath));
  return {
    briefing_rank: index + 1,
    tranche_id: spec.tranche_id,
    priority: plan.priority || '',
    workstream_mix: plan.workstream_mix || '',
    linked_gates: plan.linked_gates || '',
    row_count: spec.capture_rows.length,
    row_ids_sample: ids(spec.capture_rows),
    target_scope: plan.target_scope || apps(spec.capture_rows),
    briefing_path: filePath,
    source_files: spec.source_files,
    operator_minutes: spec.operator_minutes,
    status: 'not_started',
    claim_boundary: 'briefing_routes_execution_only_no_claim_upgrade_without_filled_capture_rows'
  };
});

writeCsv(OUT, indexRows, [
  'briefing_rank',
  'tranche_id',
  'priority',
  'workstream_mix',
  'linked_gates',
  'row_count',
  'row_ids_sample',
  'target_scope',
  'briefing_path',
  'source_files',
  'operator_minutes',
  'status',
  'claim_boundary'
]);

const lines = [];
lines.push('# Validation Tranche Briefings V1');
lines.push('');
lines.push(`Generated: ${new Date().toISOString()}`);
lines.push('');
lines.push('## Purpose');
lines.push('');
lines.push('These briefing files sit between the tranche planner and the capture sheets. Each briefing gives the operator one concrete work packet: goal, linked gates, success and stop rules, exact capture rows, fields to fill, and rebuild expectations.');
lines.push('');
lines.push('## Summary');
lines.push('');
lines.push(`- Briefings: ${indexRows.length}`);
lines.push(`- Capture rows routed: ${indexRows.reduce((sum, row) => sum + Number(row.row_count || 0), 0)}`);
lines.push(`- Briefing directory: \`${BRIEF_DIR}\``);
lines.push(`- Index: \`${OUT}\``);
lines.push('');
lines.push('## Briefing Index');
lines.push('');
lines.push(mdTable(indexRows, [
  { key: 'briefing_rank', label: '#', align: 'right' },
  { key: 'tranche_id', label: 'Tranche' },
  { key: 'priority', label: 'Priority' },
  { key: 'workstream_mix', label: 'Workstream' },
  { key: 'row_count', label: 'Rows', align: 'right' },
  { key: 'briefing_path', label: 'Briefing' },
  { key: 'claim_boundary', label: 'Boundary' }
], indexRows.length));
lines.push('');
lines.push('## Claim Boundary');
lines.push('');
lines.push('Briefings do not upgrade H1-H6. They only make the first fieldwork packets executable. A hypothesis can move only after observed screenshots, quotes, scores, or human signoff are written back into source capture sheets and rebuilt into gate/audit/report outputs.');
lines.push('');
lines.push('## Files');
lines.push('');
lines.push(`- \`${OUT}\``);
lines.push(`- \`${DOC}\``);

fs.writeFileSync(DOC, `${lines.join('\n')}\n`);

console.log(`validation_tranche_briefings=${indexRows.length}`);
console.log(`capture_rows_routed=${indexRows.reduce((sum, row) => sum + Number(row.row_count || 0), 0)}`);
console.log(`briefing_dir=${BRIEF_DIR}`);
