import fs from 'fs';

const OUT = 'data_processed/p0_validation_command_center.csv';
const OUT_DOC = 'docs/decision/p0-validation-command-center-v1.md';

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
  fs.writeFileSync(file, [headers.join(','), ...rows.map(row => headers.map(h => csvEscape(row[h])).join(','))].join('\n'));
}

function mdTable(rows, columns, limit = rows.length) {
  const limited = rows.slice(0, limit);
  const header = `| ${columns.map(c => c.label).join(' | ')} |`;
  const sep = `| ${columns.map(c => c.align === 'right' ? '---:' : '---').join(' | ')} |`;
  const body = limited.map(row => `| ${columns.map(c => clean(row[c.key]).replace(/\|/g, '<br>')).join(' | ')} |`);
  return [header, sep, ...body].join('\n');
}

function countBy(rows, key) {
  const out = {};
  for (const row of rows) out[row[key] || 'unknown'] = (out[row[key] || 'unknown'] || 0) + 1;
  return out;
}

function bulletCounts(counts) {
  return Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .map(([key, value]) => `- ${key}: ${value}`)
    .join('\n');
}

function truncate(value, limit = 220) {
  const text = clean(value);
  return text.length > limit ? `${text.slice(0, limit - 1).trim()}...` : text;
}

function rowBase({ command_id, priority, lane, sequence, target, linked_hypotheses, source_files, output_file_to_update }) {
  return {
    command_id,
    priority,
    lane,
    sequence,
    target,
    linked_hypotheses,
    current_status: 'not_started',
    proof_gap: '',
    evidence_to_capture: '',
    pass_gate: '',
    downgrade_or_kill_gate: '',
    source_files,
    output_file_to_update,
    capture_slot_or_metric: '',
    source_url: '',
    current_evidence_read: '',
    next_operator_action: '',
    notes_field_to_fill: ''
  };
}

const execution = csv('data_processed/validation_execution_dashboard.csv');
const hypothesis = csv('data_processed/hypothesis_decision_matrix.csv');
const manual = csv('data_processed/manual_competitor_inspection_packet.csv');
const publicListing = csv('data_processed/public_listing_inspection_results.csv');
const paywall = csv('data_processed/web_paywall_visual_adjudication.csv');
const icpTests = csv('data_processed/icp_validation_test_plan.csv');
const icpSegments = csv('data_processed/icp_segment_matrix.csv');
const prototype = csv('data_processed/prototype_validation_stimulus_flow.csv');
const prototypeScorecard = csv('data_processed/prototype_validation_scorecard.csv');

const publicByAppId = new Map(publicListing.map(row => [row.app_store_id, row]));
const segmentById = new Map(icpSegments.map(row => [row.segment_id, row]));
const hById = new Map(hypothesis.map(row => [row.hypothesis_id, row]));

const rows = [];

for (const app of manual) {
  const listing = publicByAppId.get(app.app_store_id) || {};
  const base = rowBase({
    command_id: `P0_MANUAL_${String(app.inspection_rank).padStart(2, '0')}`,
    priority: app.inspection_rank === '1' ? 'P0_blocker' : 'P0',
    lane: 'manual_competitor_walkthrough',
    sequence: Number(app.inspection_rank || 0),
    target: app.app_name,
    linked_hypotheses: 'H1|H3',
    source_files: 'data_processed/manual_competitor_inspection_packet.csv;data_processed/public_listing_inspection_results.csv;data_processed/manual_walkthrough_capture_sheet.csv',
    output_file_to_update: 'data_processed/manual_competitor_inspection_packet.csv;data_processed/validation_gap_roadmap.csv;data_processed/hypothesis_decision_matrix.csv'
  });
  rows.push({
    ...base,
    proof_gap: hById.get('H1')?.key_gap || 'App/onboarding screenshots are still missing.',
    evidence_to_capture: app.required_screenshot_slots,
    pass_gate: app.pass_condition,
    downgrade_or_kill_gate: app.fail_condition,
    capture_slot_or_metric: 'listing|onboarding|first_action|progress_avatar_identity_feedback|paywall_boundary',
    source_url: app.app_store_url,
    current_evidence_read: `${listing.public_listing_verdict || app.competitive_verdict_prefill}; causality=${listing.action_to_avatar_causality_public_read || app.behavior_tied_progression_prefill}; hidden_clone_risk=${listing.hidden_clone_risk_public_read || 'unknown'}`,
    next_operator_action: `Open app/listing, capture required screenshots, answer: ${truncate(app.core_inspection_questions, 300)}`,
    notes_field_to_fill: 'captured_screenshot_paths|inspector_notes|final_verdict_after_inspection'
  });
}

for (const row of paywall.filter(r => r.signoff_status === 'needs_human_signoff')) {
  const highPriority = ['confirmed_visible_public_pricing', 'partial_paid_surface_language', 'visible_price_context_uncertain', 'manual_review_required_high_prior'].includes(row.visual_adjudication);
  const base = rowBase({
    command_id: `P0_PAYWALL_${String(row.capture_rank).padStart(2, '0')}`,
    priority: highPriority ? 'P0' : 'P1_context',
    lane: 'paid_flow_validation',
    sequence: Number(row.capture_rank || 0),
    target: row.app_name,
    linked_hypotheses: 'H2',
    source_files: 'data_processed/web_paywall_visual_adjudication.csv;data_processed/competitor_revenue_proxy_review.csv;data_processed/paid_flow_capture_sheet.csv',
    output_file_to_update: 'data_processed/web_paywall_visual_adjudication.csv;data_processed/validation_gap_roadmap.csv;data_processed/hypothesis_decision_matrix.csv'
  });
  rows.push({
    ...base,
    proof_gap: hById.get('H2')?.key_gap || 'Human paid-flow signoff is still missing.',
    evidence_to_capture: 'public pricing screenshot|app/product match|trial length|monthly price|annual price|first meaningful paywall boundary|human signoff note',
    pass_gate: 'Human review confirms product-matched pricing/paywall evidence or records a conservative partial label.',
    downgrade_or_kill_gate: 'Signal is parent-company only, unrelated, login-gated, OCR artifact, or not useful for Alina market-money claims.',
    capture_slot_or_metric: row.screenshot_path,
    source_url: row.source_url,
    current_evidence_read: `${row.visual_adjudication}; confidence=${row.adjudication_confidence}; price=${row.price_evidence || row.original_detected_prices || 'none'}`,
    next_operator_action: 'Review screenshot and, if needed, inspect app/web paid flow; set confirm/partial/reject with human note.',
    notes_field_to_fill: 'signoff_status|conservative_rationale|final_claim_limit'
  });
}

for (const test of icpTests.filter(row => row.priority === 'P0_top_two')) {
  const segment = segmentById.get(test.segment_id) || {};
  const base = rowBase({
    command_id: `P0_ICP_${test.test_id}`,
    priority: 'P0',
    lane: 'icp_interviews',
    sequence: rows.length + 1,
    target: `${test.segment_name} / ${test.validation_type}`,
    linked_hypotheses: 'H5|H6',
    source_files: 'data_processed/icp_validation_test_plan.csv;data_processed/icp_segment_matrix.csv;data_processed/icp_interview_capture_sheet.csv',
    output_file_to_update: 'data_processed/icp_validation_test_plan.csv;data_processed/icp_segment_matrix.csv;data_processed/hypothesis_decision_matrix.csv'
  });
  rows.push({
    ...base,
    proof_gap: hById.get('H5')?.key_gap || 'ICP interview evidence is still missing.',
    evidence_to_capture: test.metric,
    pass_gate: test.success_signal,
    downgrade_or_kill_gate: test.failure_signal,
    capture_slot_or_metric: test.test_id,
    source_url: '',
    current_evidence_read: `${segment.evidence_band || 'unknown'}; core_job=${segment.core_job || test.hypothesis}`,
    next_operator_action: test.task_or_question,
    notes_field_to_fill: 'status|notes'
  });
}

for (const screen of prototype.filter(row => ['ICP_A', 'ICP_D'].includes(row.segment_id))) {
  const base = rowBase({
    command_id: `P0_PROTO_${screen.segment_id}_${screen.screen_id}`,
    priority: screen.screen_id === 'S06_AVATAR_CHANGE' ? 'P0_blocker' : 'P0',
    lane: 'prototype_user_validation',
    sequence: rows.length + 1,
    target: `${screen.segment_name} / ${screen.screen_id}`,
    linked_hypotheses: 'H4|H6',
    source_files: 'data_processed/prototype_validation_stimulus_flow.csv;data_processed/prototype_validation_scorecard.csv;data_processed/prototype_session_capture_sheet.csv',
    output_file_to_update: 'data_processed/prototype_validation_scorecard.csv;data_processed/prototype_session_capture_sheet.csv;data_processed/hypothesis_decision_matrix.csv'
  });
  rows.push({
    ...base,
    proof_gap: hById.get('H4')?.key_gap || 'Prototype participant evidence is still missing.',
    evidence_to_capture: screen.evidence_to_capture,
    pass_gate: screen.expected_signal,
    downgrade_or_kill_gate: screen.failure_signal,
    capture_slot_or_metric: screen.screen_id,
    source_url: '',
    current_evidence_read: `${screen.screen_name}; max_seconds=${screen.max_seconds}; question=${screen.test_question}`,
    next_operator_action: `${screen.user_action} Copy shown: ${truncate(screen.prototype_copy, 180)}`,
    notes_field_to_fill: 'completion_time_seconds|comprehension_yes_no|meaning_lift_1_5|differentiation_1_5|return_intent_1_5|verbatim_quote'
  });
}

for (const metric of prototypeScorecard) {
  const base = rowBase({
    command_id: `P0_SCORE_${metric.metric_id}`,
    priority: ['PVS_M01', 'PVS_M04', 'PVS_M05'].includes(metric.metric_id) ? 'P0_blocker' : 'P0',
    lane: 'prototype_scorecard_gate',
    sequence: rows.length + 1,
    target: metric.gate,
    linked_hypotheses: 'H4|H6',
    source_files: 'data_processed/prototype_validation_scorecard.csv;data_processed/prototype_session_capture_sheet.csv',
    output_file_to_update: 'data_processed/prototype_validation_scorecard.csv;data_processed/hypothesis_decision_matrix.csv'
  });
  rows.push({
    ...base,
    proof_gap: hById.get('H4')?.key_gap || 'Prototype scorecard evidence is still missing.',
    evidence_to_capture: metric.gate,
    pass_gate: metric.success_threshold,
    downgrade_or_kill_gate: metric.kill_threshold,
    capture_slot_or_metric: metric.metric_id,
    source_url: '',
    current_evidence_read: metric.why_it_matters,
    next_operator_action: 'After prototype sessions, calculate metric and update gate verdict.',
    notes_field_to_fill: 'observed_value|gate_status|notes'
  });
}

rows.sort((a, b) => {
  const priorityRank = { P0_blocker: 0, P0: 1, P1_context: 2 };
  return (priorityRank[a.priority] ?? 9) - (priorityRank[b.priority] ?? 9)
    || String(a.lane).localeCompare(String(b.lane))
    || Number(a.sequence || 0) - Number(b.sequence || 0);
});

writeCsv(OUT, rows, [
  'command_id', 'priority', 'lane', 'sequence', 'target', 'linked_hypotheses', 'current_status',
  'proof_gap', 'evidence_to_capture', 'pass_gate', 'downgrade_or_kill_gate', 'source_files',
  'output_file_to_update', 'capture_slot_or_metric', 'source_url', 'current_evidence_read',
  'next_operator_action', 'notes_field_to_fill'
]);

const p0 = rows.filter(row => row.priority === 'P0');
const blockers = rows.filter(row => row.priority === 'P0_blocker');
const lines = [];
lines.push('# P0 Validation Command Center V1');
lines.push('');
lines.push(`Generated: ${new Date().toISOString()}`);
lines.push('');
lines.push('## Purpose');
lines.push('');
lines.push('This command center turns the open validation burden into an operator-ready checklist. It does not add new claims; it tells the next human or agent exactly what evidence must be captured before H1-H6 can move from hold/validate toward go, pivot, or stop.');
lines.push('');
lines.push('## Summary');
lines.push('');
lines.push(`- Command rows: ${rows.length}`);
lines.push(`- P0 blocker rows: ${blockers.length}`);
lines.push(`- P0 rows: ${p0.length}`);
lines.push(`- P1 context rows: ${rows.filter(row => row.priority === 'P1_context').length}`);
lines.push('');
lines.push('Rows by lane:');
lines.push('');
lines.push(bulletCounts(countBy(rows, 'lane')));
lines.push('');
lines.push('Rows by priority:');
lines.push('');
lines.push(bulletCounts(countBy(rows, 'priority')));
lines.push('');
lines.push('## First Fifteen Commands');
lines.push('');
lines.push(mdTable(rows, [
  { key: 'command_id', label: 'Command' },
  { key: 'priority', label: 'Priority' },
  { key: 'lane', label: 'Lane' },
  { key: 'target', label: 'Target' },
  { key: 'linked_hypotheses', label: 'Hypotheses' },
  { key: 'next_operator_action', label: 'Next Action' }
], 15));
lines.push('');
lines.push('## Blocker Gates');
lines.push('');
lines.push(mdTable(blockers, [
  { key: 'command_id', label: 'Command' },
  { key: 'target', label: 'Target' },
  { key: 'pass_gate', label: 'Pass Gate' },
  { key: 'downgrade_or_kill_gate', label: 'Downgrade/Kill Gate' }
], blockers.length));
lines.push('');
lines.push('## Operating Rule');
lines.push('');
lines.push('- Do not upgrade H1-H6 from hold/validate until the relevant command rows contain observed evidence and updated verdicts.');
lines.push('- If a downgrade/kill gate is triggered, update the source CSV, hypothesis decision matrix, evidence audit, completion audit, report, and PDF caveats in the same commit.');
lines.push('- Screenshots, participant quotes, and human signoff notes should be saved before claim language is strengthened.');
lines.push('');
lines.push('## Files');
lines.push('');
lines.push(`- \`${OUT}\``);

fs.writeFileSync(OUT_DOC, `${lines.join('\n')}\n`);

console.log(`commands=${OUT}`);
console.log(`doc=${OUT_DOC}`);
console.log(`rows=${rows.length}`);
console.log(`p0_blockers=${blockers.length}`);
console.log(`p0=${p0.length}`);
