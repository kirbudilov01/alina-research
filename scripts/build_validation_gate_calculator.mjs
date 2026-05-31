import fs from 'fs';

const OUT = 'data_processed/validation_gate_calculator.csv';
const OUT_SUMMARY = 'data_processed/validation_gate_status_summary.csv';
const OUT_DOC = 'docs/decision/validation-gate-calculator-v1.md';

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
  return body.filter(r => r.some(Boolean)).map(r => Object.fromEntries(headers.map((h, i) => [h, r[i] ?? ''])));
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
  const body = limited.map(row => `| ${columns.map(c => clean(row[c.key]).replace(/\|/g, '/')).join(' | ')} |`);
  return [header, sep, ...body].join('\n');
}

function countBy(rows, key) {
  const out = {};
  for (const row of rows) out[row[key] || 'unknown'] = (out[row[key] || 'unknown'] || 0) + 1;
  return out;
}

function isStarted(row) {
  return !['', 'not_started', 'todo', 'pending'].includes(clean(row.capture_status || row.status).toLowerCase());
}

function boolYes(value) {
  return ['yes', 'true', '1', 'success', 'pass', 'passed', 'seen', 'confirmed'].includes(clean(value).toLowerCase());
}

function boolNo(value) {
  return ['no', 'false', '0', 'failure', 'fail', 'failed', 'blocked', 'rejected'].includes(clean(value).toLowerCase());
}

function completedManual(row) {
  return isStarted(row) && clean(row.observed_answer) && clean(row.inspector_notes);
}

function successManual(row) {
  if (clean(row.capture_status).toLowerCase().includes('public_listing_signoff')) return false;
  return completedManual(row)
    && ['full_loop', 'adjacent_loop', 'weak_adjacency', 'not_alina_like'].includes(clean(row.directness_label).toLowerCase())
    && clean(row.action_to_avatar_causality_label)
    && clean(row.paywall_boundary_label);
}

function failManual(row) {
  if (clean(row.capture_status).toLowerCase().includes('public_listing_signoff')) return false;
  const directness = clean(row.directness_label).toLowerCase();
  const causality = clean(row.action_to_avatar_causality_label).toLowerCase();
  return directness === 'full_loop' || causality === 'confirmed_full_action_to_avatar_causality';
}

function completedPaid(row) {
  return isStarted(row) && clean(row.observed_price_or_trial) && clean(row.paid_flow_label) && clean(row.product_match_label);
}

function successPaid(row) {
  const paidFlow = clean(row.paid_flow_label).toLowerCase();
  const productMatch = clean(row.product_match_label).toLowerCase();
  const strength = clean(row.signoff_strength).toLowerCase();
  if (!completedPaid(row)) return false;
  if (['reject', 'unrelated_product', 'wrong_product'].includes(productMatch)) return false;
  if (paidFlow.includes('no_clean') || productMatch.includes('no_clean') || strength.includes('no_clean')) return false;
  return true;
}

function failPaid(row) {
  return completedPaid(row)
    && ['reject', 'unrelated_product', 'wrong_product'].includes(clean(row.product_match_label).toLowerCase());
}

function completedIcp(row) {
  return isStarted(row) && clean(row.observed_answer_or_score);
}

function successIcp(row) {
  if (clean(row.capture_status).toLowerCase().includes('secondary_voc_signoff')) return false;
  return completedIcp(row) && boolYes(row.success_flag) && !boolYes(row.fatal_objection_flag);
}

function failIcp(row) {
  if (clean(row.capture_status).toLowerCase().includes('secondary_voc_signoff')) return false;
  return completedIcp(row) && (boolNo(row.success_flag) || boolYes(row.fatal_objection_flag));
}

function completedPrototype(row) {
  return isStarted(row) && (clean(row.observed_behavior) || clean(row.participant_paraphrase));
}

function successPrototype(row) {
  if (clean(row.capture_status).toLowerCase().includes('prototype_readiness_signoff')) return false;
  return completedPrototype(row) && boolYes(row.success_signal_seen) && !boolYes(row.failure_signal_seen);
}

function failPrototype(row) {
  if (clean(row.capture_status).toLowerCase().includes('prototype_readiness_signoff')) return false;
  return completedPrototype(row) && boolYes(row.failure_signal_seen);
}

function gateStatus({ requiredRows, startedRows, completedRows, successRows, failRows, fatalRows, minCompleted, minSuccess, maxFail }) {
  if (fatalRows > 0) return 'kill_or_downgrade_triggered';
  if (completedRows >= minCompleted && successRows >= minSuccess && failRows <= maxFail) return 'pass_ready_for_review';
  if (startedRows > 0) return 'in_progress_insufficient_evidence';
  return requiredRows > 0 ? 'not_started' : 'missing_source_rows';
}

function evidenceState(status) {
  if (status === 'pass_ready_for_review') return 'observed_evidence_meets_threshold_review_needed';
  if (status === 'kill_or_downgrade_triggered') return 'observed_evidence_triggers_downgrade_or_kill_review';
  if (status === 'in_progress_insufficient_evidence') return 'partial_observed_evidence';
  if (status === 'not_started') return 'capture_rows_ready_no_observed_evidence';
  return 'missing_capture_rows';
}

const manualRows = csv('data_processed/manual_walkthrough_capture_sheet.csv');
const paidRows = csv('data_processed/paid_flow_capture_sheet.csv');
const icpRows = csv('data_processed/icp_interview_capture_sheet.csv');
const prototypeRows = csv('data_processed/prototype_session_capture_sheet.csv');
const decisions = csv('data_processed/hypothesis_decision_matrix.csv');
const execution = csv('data_processed/validation_execution_dashboard.csv');

const decisionByHypothesis = new Map(decisions.map(row => [row.hypothesis_id, row]));
const executionByWorkstream = new Map();
for (const row of execution) {
  const rows = executionByWorkstream.get(row.workstream) || [];
  rows.push(row);
  executionByWorkstream.set(row.workstream, rows);
}

const gateSpecs = [
  {
    gate_id: 'GATE_H1_MANUAL_PRODUCT_SHAPE',
    linked_hypotheses: 'H1',
    workstream: 'manual_competitor_walkthrough',
    rows: manualRows,
    isCompleted: completedManual,
    isSuccess: successManual,
    isFail: failManual,
    minCompleted: 25,
    minSuccess: 25,
    maxFail: 0,
    success_gate: 'At least five P0 apps have all five walkthrough slots classified without confirming a hidden full-loop clone.',
    kill_gate: 'Any P0 competitor clearly owns the full Alina loop with action->identity/avatar causality.'
  },
  {
    gate_id: 'GATE_H3_MANUAL_WHITESPACE',
    linked_hypotheses: 'H3',
    workstream: 'manual_competitor_walkthrough',
    rows: manualRows,
    isCompleted: completedManual,
    isSuccess: successManual,
    isFail: failManual,
    minCompleted: 25,
    minSuccess: 25,
    maxFail: 0,
    success_gate: 'Manual walkthrough confirms behavior-tied identity/avatar progression remains rare among high-risk substitutes.',
    kill_gate: 'Walkthrough reveals common full-loop substitutes or hidden clone risk is confirmed.'
  },
  {
    gate_id: 'GATE_H2_PAID_FLOW',
    linked_hypotheses: 'H2',
    workstream: 'paid_flow_validation',
    rows: paidRows,
    isCompleted: completedPaid,
    isSuccess: successPaid,
    isFail: failPaid,
    minCompleted: 16,
    minSuccess: 12,
    maxFail: 4,
    success_gate: 'Highest-money competitors receive confirm/partial/reject paid-flow labels with human product-match notes.',
    kill_gate: 'Paid signals mostly belong to parent pages, unrelated products, or login-gated pages that cannot support market-money claims.'
  },
  {
    gate_id: 'GATE_H5_ICP_RECENT_BEHAVIOR',
    linked_hypotheses: 'H5',
    workstream: 'icp_interviews',
    rows: icpRows,
    isCompleted: completedIcp,
    isSuccess: successIcp,
    isFail: failIcp,
    minCompleted: 48,
    minSuccess: 30,
    maxFail: 10,
    success_gate: 'Top two ICP segments produce recent-behavior, language resonance, return-intent, and WTP signals.',
    kill_gate: 'No segment recalls a concrete use episode or all reject the action-tied identity/progress premise.'
  },
  {
    gate_id: 'GATE_H4_PROTOTYPE_ADVANTAGE',
    linked_hypotheses: 'H4',
    workstream: 'prototype_user_validation',
    rows: prototypeRows,
    isCompleted: completedPrototype,
    isSuccess: successPrototype,
    isFail: failPrototype,
    minCompleted: 48,
    minSuccess: 32,
    maxFail: 8,
    success_gate: 'Prototype users understand and prefer the integrated loop over generic alternatives.',
    kill_gate: 'Participants read the loop as generic, unsafe, childish, manipulative, or not worth returning to.'
  },
  {
    gate_id: 'GATE_H6_PRODUCT_CORE',
    linked_hypotheses: 'H6',
    workstream: 'prototype_user_validation',
    rows: prototypeRows,
    isCompleted: completedPrototype,
    isSuccess: successPrototype,
    isFail: failPrototype,
    minCompleted: 48,
    minSuccess: 32,
    maxFail: 8,
    success_gate: 'MVP loop remains coherent after prototype sessions and competitor walkthrough updates.',
    kill_gate: 'The loop requires too much friction/content cost or users cannot explain causality.'
  }
];

const rows = gateSpecs.map(spec => {
  const startedRows = spec.rows.filter(isStarted).length;
  const completedRows = spec.rows.filter(spec.isCompleted).length;
  const successRows = spec.rows.filter(spec.isSuccess).length;
  const failRows = spec.rows.filter(spec.isFail).length;
  const fatalRows = spec.rows.filter(spec.isFail).length;
  const status = gateStatus({
    requiredRows: spec.rows.length,
    startedRows,
    completedRows,
    successRows,
    failRows,
    fatalRows,
    minCompleted: spec.minCompleted,
    minSuccess: spec.minSuccess,
    maxFail: spec.maxFail
  });
  const linkedDecisions = spec.linked_hypotheses
    .split('|')
    .map(id => decisionByHypothesis.get(id))
    .filter(Boolean);
  const executionRows = executionByWorkstream.get(spec.workstream) || [];
  return {
    gate_id: spec.gate_id,
    linked_hypotheses: spec.linked_hypotheses,
    workstream: spec.workstream,
    gate_status: status,
    evidence_state: evidenceState(status),
    required_capture_rows: spec.rows.length,
    started_rows: startedRows,
    completed_rows: completedRows,
    success_rows: successRows,
    fail_or_downgrade_rows: failRows,
    fatal_rows: fatalRows,
    min_completed_threshold: spec.minCompleted,
    min_success_threshold: spec.minSuccess,
    max_fail_threshold: spec.maxFail,
    capture_progress_pct: spec.rows.length ? Math.round((completedRows / spec.rows.length) * 1000) / 10 : 0,
    success_progress_pct: spec.minSuccess ? Math.round((successRows / spec.minSuccess) * 1000) / 10 : 0,
    current_decision_effect: status === 'pass_ready_for_review' ? 'eligible_to_upgrade_after_review' : (status === 'kill_or_downgrade_triggered' ? 'requires_downgrade_or_kill_review' : 'keeps_hold_validate'),
    current_blocker: status === 'not_started'
      ? 'No observed capture rows yet.'
      : (status === 'in_progress_insufficient_evidence' ? 'Observed evidence is partial and below threshold.' : ''),
    success_gate: spec.success_gate,
    kill_or_downgrade_gate: spec.kill_gate,
    source_files: Array.from(new Set([
      ...linkedDecisions.flatMap(row => clean(row.evidence_files).split(';').filter(Boolean)),
      ...executionRows.flatMap(row => clean(row.source_files).split(';').filter(Boolean))
    ])).join(';'),
    output_file_to_update: Array.from(new Set(executionRows.map(row => row.output_file_to_update).filter(Boolean))).join(';'),
    next_action: linkedDecisions.map(row => row.next_action).filter(Boolean).join(' | ') || 'Fill the linked capture rows and rerun the calculator.'
  };
});

const summaryRows = Object.entries(countBy(rows, 'gate_status')).map(([gate_status, row_count]) => ({
  gate_status,
  row_count,
  linked_hypotheses: rows.filter(row => row.gate_status === gate_status).map(row => row.linked_hypotheses).join('|'),
  total_required_capture_rows: rows.filter(row => row.gate_status === gate_status).reduce((sum, row) => sum + Number(row.required_capture_rows || 0), 0),
  total_started_rows: rows.filter(row => row.gate_status === gate_status).reduce((sum, row) => sum + Number(row.started_rows || 0), 0),
  total_completed_rows: rows.filter(row => row.gate_status === gate_status).reduce((sum, row) => sum + Number(row.completed_rows || 0), 0)
}));

writeCsv(OUT, rows, [
  'gate_id', 'linked_hypotheses', 'workstream', 'gate_status', 'evidence_state',
  'required_capture_rows', 'started_rows', 'completed_rows', 'success_rows',
  'fail_or_downgrade_rows', 'fatal_rows', 'min_completed_threshold',
  'min_success_threshold', 'max_fail_threshold', 'capture_progress_pct',
  'success_progress_pct', 'current_decision_effect', 'current_blocker',
  'success_gate', 'kill_or_downgrade_gate', 'source_files', 'output_file_to_update',
  'next_action'
]);

writeCsv(OUT_SUMMARY, summaryRows, [
  'gate_status', 'row_count', 'linked_hypotheses', 'total_required_capture_rows',
  'total_started_rows', 'total_completed_rows'
]);

const lines = [];
lines.push('# Validation Gate Calculator V1');
lines.push('');
lines.push(`Generated: ${new Date().toISOString()}`);
lines.push('');
lines.push('## Purpose');
lines.push('');
lines.push('This calculator reads the manual walkthrough, paid-flow, ICP interview, and prototype session capture sheets and turns them into gate-level status for H1-H6. It prevents the research from upgrading a hypothesis because a checklist exists; only observed capture rows can move a gate out of hold/validate.');
lines.push('');
lines.push('## Current Gate Status');
lines.push('');
lines.push(mdTable(rows, [
  { key: 'gate_id', label: 'Gate' },
  { key: 'linked_hypotheses', label: 'Hypotheses' },
  { key: 'workstream', label: 'Workstream' },
  { key: 'gate_status', label: 'Status' },
  { key: 'required_capture_rows', label: 'Required Rows', align: 'right' },
  { key: 'completed_rows', label: 'Completed Rows', align: 'right' },
  { key: 'success_rows', label: 'Success Rows', align: 'right' },
  { key: 'current_decision_effect', label: 'Decision Effect' }
]));
lines.push('');
lines.push('## Status Summary');
lines.push('');
lines.push(mdTable(summaryRows, [
  { key: 'gate_status', label: 'Status' },
  { key: 'row_count', label: 'Gates', align: 'right' },
  { key: 'linked_hypotheses', label: 'Hypotheses' },
  { key: 'total_required_capture_rows', label: 'Required Capture Rows', align: 'right' },
  { key: 'total_completed_rows', label: 'Completed Capture Rows', align: 'right' }
]));
lines.push('');
lines.push('## Interpretation');
lines.push('');
lines.push('- `not_started` means the capture sheet is ready but no observed evidence has been entered.');
lines.push('- `in_progress_insufficient_evidence` means at least one row has started, but the gate is below threshold.');
lines.push('- `pass_ready_for_review` means observed rows meet the numeric threshold, but a human still needs to review the claim upgrade.');
lines.push('- `kill_or_downgrade_triggered` means observed evidence may contradict the hypothesis and should force a decision review.');
lines.push('');
lines.push('## Files');
lines.push('');
lines.push(`- \`${OUT}\``);
lines.push(`- \`${OUT_SUMMARY}\``);
lines.push('- `data_processed/manual_walkthrough_capture_sheet.csv`');
lines.push('- `data_processed/paid_flow_capture_sheet.csv`');
lines.push('- `data_processed/icp_interview_capture_sheet.csv`');
lines.push('- `data_processed/prototype_session_capture_sheet.csv`');

fs.writeFileSync(OUT_DOC, `${lines.join('\n')}\n`);

console.log(`calculator=${OUT}`);
console.log(`summary=${OUT_SUMMARY}`);
console.log(`doc=${OUT_DOC}`);
console.log(`gates=${rows.length}`);
console.log(`not_started=${rows.filter(row => row.gate_status === 'not_started').length}`);
