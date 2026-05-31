import fs from 'fs';

const OUT = 'data_processed/p0_validation_field_guide.csv';
const OUT_DOC = 'docs/decision/p0-validation-field-guide-v1.md';

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

function compactList(values) {
  return values.filter(Boolean).join(' | ');
}

const commands = csv('data_processed/p0_validation_command_center.csv');
const manual = csv('data_processed/manual_competitor_inspection_packet.csv');
const icp = csv('data_processed/icp_validation_test_plan.csv');
const prototype = csv('data_processed/prototype_validation_stimulus_flow.csv');
const scorecard = csv('data_processed/prototype_validation_scorecard.csv');
const paywall = csv('data_processed/web_paywall_visual_adjudication.csv');

const blockerRows = commands.filter(row => row.priority === 'P0_blocker');
const p0Rows = commands.filter(row => row.priority === 'P0');
const manualSlots = manual[0]?.required_screenshot_slots || 'app_store_listing_or_public_positioning|onboarding_first_value_screen|first_daily_action_or_task_screen|progress_avatar_identity_feedback_screen|first_paywall_or_iap_terms_screen';
const topManual = manual.slice(0, 5).map(row => row.app_name).join(' | ');
const topPaywall = paywall
  .filter(row => ['confirmed_visible_public_pricing', 'partial_paid_surface_language', 'visible_price_context_uncertain', 'manual_review_required_high_prior'].includes(row.visual_adjudication))
  .slice(0, 10)
  .map(row => row.app_name)
  .join(' | ');
const p0IcpTests = icp.filter(row => row.priority === 'P0_top_two');
const p0PrototypeScreens = prototype.filter(row => ['ICP_A', 'ICP_D'].includes(row.segment_id));

const rows = [
  {
    section_id: 'FG_01',
    section_type: 'operating_rule',
    lane: 'all',
    title: 'Evidence handling rules',
    objective: 'Prevent claim inflation while validation is being executed.',
    exact_script_or_checklist: 'Capture raw evidence first; then write notes; then assign verdict; then update downstream CSV/docs/PDF in the same commit. Never upgrade H1-H6 from hold_validate from memory or vibe.',
    evidence_to_capture: 'screenshot_paths|participant_quote|observed_value|human_signoff_note|final_verdict',
    pass_or_success_gate: 'Every changed claim links back to a saved evidence artifact or filled capture row.',
    downgrade_or_kill_gate: 'Any result that contradicts the current claim updates the claim language before report/PDF regeneration.',
    source_rows: `commands=${commands.length}; blockers=${blockerRows.length}; p0=${p0Rows.length}`,
    output_update_protocol: 'Update source capture CSV -> rebuild p0 command center -> rebuild hypothesis decisions -> rebuild audits/report/PDF -> commit/push.'
  },
  {
    section_id: 'FG_02',
    section_type: 'naming_protocol',
    lane: 'all',
    title: 'Evidence file naming',
    objective: 'Make screenshots and session notes auditable without opening the whole repo.',
    exact_script_or_checklist: 'Use output/validation/YYYY-MM-DD/<lane>/<command_id>__<target_slug>__<slot>.png for screenshots and .md for notes. Keep raw screenshots unchanged; add interpretation in CSV notes fields.',
    evidence_to_capture: 'raw screenshot path|notes path|command_id|slot',
    pass_or_success_gate: 'Every capture path can be joined back to command_id and source file row.',
    downgrade_or_kill_gate: 'Unlinked screenshots or notes cannot support final claims.',
    source_rows: 'data_processed/p0_validation_command_center.csv',
    output_update_protocol: 'Fill captured_screenshot_paths or relevant capture sheet fields with exact local paths.'
  },
  {
    section_id: 'FG_03',
    section_type: 'session_agenda',
    lane: 'manual_competitor_walkthrough',
    title: 'Competitor walkthrough script',
    objective: 'Decide whether P0 competitors secretly own the Alina loop.',
    exact_script_or_checklist: compactList([
      '1. Open listing/source URL and save public positioning screenshot.',
      '2. Start onboarding or public demo and capture first value screen.',
      '3. Locate first action/task a user can complete.',
      '4. Capture progress/avatar/identity feedback immediately after action.',
      '5. Capture first paywall or free boundary.',
      '6. Answer: full loop, adjacent loop, weak adjacency, blocked, or hidden direct clone.'
    ]),
    evidence_to_capture: manualSlots,
    pass_or_success_gate: 'At least 5 P0 apps receive final directness, causality, hidden clone risk, and paywall-boundary verdicts.',
    downgrade_or_kill_gate: 'Any app fully owns personal meaning -> action -> reset -> causally changing identity/avatar/progress -> next-day hook.',
    source_rows: `manual_targets=${manual.length}; first_targets=${topManual}`,
    output_update_protocol: 'Update data_processed/manual_competitor_inspection_packet.csv and data_processed/manual_walkthrough_capture_sheet.csv.'
  },
  {
    section_id: 'FG_04',
    section_type: 'session_agenda',
    lane: 'paid_flow_validation',
    title: 'Paid-flow signoff script',
    objective: 'Turn proxy market-money evidence into human-signed conservative labels.',
    exact_script_or_checklist: compactList([
      '1. Open existing screenshot_path and source_url.',
      '2. Confirm product match: same app, same brand, or parent-company-only.',
      '3. Record visible monthly, annual, trial, or bundle price.',
      '4. Mark confirm, partial, reject, login-gated, or unrelated.',
      '5. Capture in-app paywall boundary only when available without unsafe account/payment steps.'
    ]),
    evidence_to_capture: 'public pricing screenshot|app/product match|trial length|monthly price|annual price|first meaningful paywall boundary|human signoff note',
    pass_or_success_gate: 'Highest-money competitors receive confirm/partial/reject paid-flow labels with notes.',
    downgrade_or_kill_gate: 'Signals mostly belong to parent pages, unrelated products, OCR artifacts, or login-gated pages.',
    source_rows: `paywall_rows=${paywall.length}; high_priority=${topPaywall}`,
    output_update_protocol: 'Update data_processed/web_paywall_visual_adjudication.csv and paid_flow_capture_sheet.csv.'
  },
  {
    section_id: 'FG_05',
    section_type: 'interview_script',
    lane: 'icp_interviews',
    title: 'ICP interview script',
    objective: 'Select a primary and secondary ICP from observed recent behavior, language resonance, and paid depth.',
    exact_script_or_checklist: compactList([
      '1. Screener: which apps/rituals/tools did you use in the last 30 days and what triggered last use?',
      '2. Last episode: tell me the last moment when you needed this job.',
      '3. Workaround: what did you use instead and what was missing?',
      '4. Prototype loop narration: what do you think is happening?',
      '5. Positioning comparison: current tool vs generic habit/coach vs Alina angle.',
      '6. WTP: what do you pay for now and what paid depth would be worth testing?',
      '7. Disconfirmation: what feels unsafe, cringe, manipulative, generic, or not for you?'
    ]),
    evidence_to_capture: 'recent_behavior_match|specific_episode|workaround|pain_intensity_1_5|preferred_concept|differentiation_1_5|acceptable_price_range|fatal_objection|verbatim_quote',
    pass_or_success_gate: 'One primary and one secondary ICP selected with recent behavior, shared language, activation trigger, and WTP signal.',
    downgrade_or_kill_gate: 'No segment recalls concrete use episodes or all reject action-tied identity/progress premise.',
    source_rows: `p0_icp_tests=${p0IcpTests.length}; segments=ICP_A|ICP_D`,
    output_update_protocol: 'Update data_processed/icp_validation_test_plan.csv, icp_interview_capture_sheet.csv, and icp_segment_matrix.csv.'
  },
  {
    section_id: 'FG_06',
    section_type: 'prototype_script',
    lane: 'prototype_user_validation',
    title: 'Two-minute prototype session script',
    objective: 'Validate whether the integrated loop is understood, differentiated, emotionally meaningful, and safe.',
    exact_script_or_checklist: compactList([
      'Show S01-S08 in order.',
      'Ask participant to narrate each screen.',
      'Do not explain the product until after S08.',
      'On S06 ask: what changed, and what caused the change?',
      'After S08 ask what they would call the product and whether they would return tomorrow.',
      'Record completion time and verbatim confusion/trust/differentiation language.'
    ]),
    evidence_to_capture: 'completion_time_seconds|comprehension_yes_no|meaning_lift_1_5|differentiation_1_5|return_intent_1_5|trust_objection|verbatim_quote',
    pass_or_success_gate: 'Participants understand action -> avatar/progress causality and prefer the integrated loop over generic alternatives.',
    downgrade_or_kill_gate: 'Participants read the loop as generic, unsafe, childish, manipulative, decorative, or not worth returning to.',
    source_rows: `prototype_rows=${p0PrototypeScreens.length}; scorecard_metrics=${scorecard.length}`,
    output_update_protocol: 'Update prototype_session_capture_sheet.csv and prototype_validation_scorecard.csv.'
  },
  {
    section_id: 'FG_07',
    section_type: 'scorecard_protocol',
    lane: 'prototype_scorecard_gate',
    title: 'Prototype scorecard calculation',
    objective: 'Translate session observations into H4/H6 go, hold, pivot, or stop evidence.',
    exact_script_or_checklist: compactList(scorecard.map(row => `${row.metric_id}: success ${row.success_threshold}; kill ${row.kill_threshold}`)),
    evidence_to_capture: 'observed_value|gate_status|supporting_quotes|sample_size',
    pass_or_success_gate: 'PVS_M01, PVS_M04, and PVS_M05 pass without fatal objections; remaining metrics are directionally positive.',
    downgrade_or_kill_gate: 'Any blocker metric hits its kill threshold or exposes a repeated fatal trust/safety objection.',
    source_rows: `scorecard_metrics=${scorecard.length}`,
    output_update_protocol: 'Update prototype_validation_scorecard.csv, hypothesis_decision_matrix.csv, evidence_claim_register.csv, and completion audit.'
  },
  {
    section_id: 'FG_08',
    section_type: 'commit_protocol',
    lane: 'all',
    title: 'Post-validation rebuild protocol',
    objective: 'Keep local evidence, report, PDF, manifest, and GitHub in sync after validation.',
    exact_script_or_checklist: 'Run: npm run build:p0-command-center && npm run build:hypothesis-decision && npm run build:evidence-manifest && npm run build:evidence-audit && npm run build:completion-audit && npm run build:report-draft && npm run build:polished-pdf && npm test. Then commit and push.',
    evidence_to_capture: 'terminal output|git commit hash|updated manifest rows|updated PDF readback',
    pass_or_success_gate: 'Repo is clean after commit/push and report/PDF reflect changed verdicts.',
    downgrade_or_kill_gate: 'Validation evidence exists locally but is not committed, not linked, or not reflected in report/PDF.',
    source_rows: 'package.json scripts and generated artifacts',
    output_update_protocol: 'Commit every validation tranche with source CSVs, docs, reports, PDFs, and manifest.'
  }
];

writeCsv(OUT, rows, [
  'section_id', 'section_type', 'lane', 'title', 'objective', 'exact_script_or_checklist',
  'evidence_to_capture', 'pass_or_success_gate', 'downgrade_or_kill_gate',
  'source_rows', 'output_update_protocol'
]);

const lines = [];
lines.push('# P0 Validation Field Guide V1');
lines.push('');
lines.push(`Generated: ${new Date().toISOString()}`);
lines.push('');
lines.push('## Purpose');
lines.push('');
lines.push('This field guide turns the P0 command center into executable operator scripts. It is designed for the first validation tranche: competitor walkthroughs, paid-flow signoff, ICP interviews, prototype sessions, and scorecard updates. It does not close validation by itself.');
lines.push('');
lines.push('## Summary');
lines.push('');
lines.push(`- Guide sections: ${rows.length}`);
lines.push(`- Command center rows referenced: ${commands.length}`);
lines.push(`- P0 blockers referenced: ${blockerRows.length}`);
lines.push(`- P0 rows referenced: ${p0Rows.length}`);
lines.push('');
lines.push('Sections by lane:');
lines.push('');
lines.push(bulletCounts(countBy(rows, 'lane')));
lines.push('');
lines.push('## Field Guide');
lines.push('');
lines.push(mdTable(rows, [
  { key: 'section_id', label: 'ID' },
  { key: 'lane', label: 'Lane' },
  { key: 'title', label: 'Title' },
  { key: 'objective', label: 'Objective' },
  { key: 'evidence_to_capture', label: 'Evidence' }
]));
lines.push('');
lines.push('## Scripts');
lines.push('');
for (const row of rows) {
  lines.push(`### ${row.section_id}. ${row.title}`);
  lines.push('');
  lines.push(`- Lane: ${row.lane}`);
  lines.push(`- Objective: ${row.objective}`);
  lines.push(`- Checklist/script: ${row.exact_script_or_checklist}`);
  lines.push(`- Evidence to capture: ${row.evidence_to_capture}`);
  lines.push(`- Pass/success gate: ${row.pass_or_success_gate}`);
  lines.push(`- Downgrade/kill gate: ${row.downgrade_or_kill_gate}`);
  lines.push(`- Source rows: ${row.source_rows}`);
  lines.push(`- Output update protocol: ${row.output_update_protocol}`);
  lines.push('');
}
lines.push('## Claim Boundary');
lines.push('');
lines.push('- This guide is an execution asset, not validation evidence.');
lines.push('- Only filled capture rows, screenshots, participant quotes, human signoff notes, and updated verdicts can upgrade or downgrade H1-H6.');
lines.push('- After each validation tranche, rebuild the evidence package and push to GitHub.');
lines.push('');
lines.push('## Files');
lines.push('');
lines.push(`- \`${OUT}\``);

fs.writeFileSync(OUT_DOC, `${lines.join('\n')}\n`);

console.log(`guide=${OUT}`);
console.log(`doc=${OUT_DOC}`);
console.log(`sections=${rows.length}`);
console.log(`commands_referenced=${commands.length}`);
