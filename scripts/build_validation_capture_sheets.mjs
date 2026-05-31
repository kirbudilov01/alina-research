import fs from 'fs';

const OUT_DIR = 'data_processed';
const DOC_DIR = 'docs/decision';
const WALKTHROUGH_OUT = `${OUT_DIR}/manual_walkthrough_capture_sheet.csv`;
const ICP_OUT = `${OUT_DIR}/icp_interview_capture_sheet.csv`;
const PROTOTYPE_OUT = `${OUT_DIR}/prototype_session_capture_sheet.csv`;
const PAID_OUT = `${OUT_DIR}/paid_flow_capture_sheet.csv`;
const DOC_OUT = `${DOC_DIR}/validation-capture-sheets-v1.md`;

for (const dir of [OUT_DIR, DOC_DIR]) fs.mkdirSync(dir, { recursive: true });

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
  fs.writeFileSync(file, [
    headers.join(','),
    ...rows.map(row => headers.map(h => csvEscape(row[h])).join(','))
  ].join('\n'));
}

function mdTable(rows, columns, limit = rows.length) {
  const slice = rows.slice(0, limit);
  const header = `| ${columns.map(c => c.label).join(' | ')} |`;
  const sep = `| ${columns.map(c => c.align === 'right' ? '---:' : '---').join(' | ')} |`;
  const body = slice.map(row => `| ${columns.map(c => clean(row[c.key]).replace(/\|/g, '/')).join(' | ')} |`);
  return [header, sep, ...body].join('\n');
}

function slug(value) {
  return clean(value)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 56);
}

function topSegments(rows) {
  return rows
    .slice()
    .sort((a, b) => Number(b.evidence_score || 0) - Number(a.evidence_score || 0))
    .slice(0, 2);
}

const manualPacket = csv('data_processed/manual_competitor_inspection_packet.csv');
const icpSegments = topSegments(csv('data_processed/icp_segment_matrix.csv'));
const icpTests = csv('data_processed/icp_validation_test_plan.csv');
const prototypeFlow = csv('data_processed/prototype_validation_stimulus_flow.csv');
const prototypeScorecard = csv('data_processed/prototype_validation_scorecard.csv');
const paywallAdjudication = csv('data_processed/web_paywall_visual_adjudication.csv');
const revenueProxy = csv('data_processed/competitor_revenue_proxy_review.csv');

const screenshotSlots = [
  {
    slot_id: 'MCI_S01',
    screenshot_slot: 'app_store_listing_or_public_positioning',
    capture_question: 'What promise, audience, and daily loop does the public listing imply?'
  },
  {
    slot_id: 'MCI_S02',
    screenshot_slot: 'onboarding_first_value_screen',
    capture_question: 'Does onboarding show one coherent loop or separate feature shelves?'
  },
  {
    slot_id: 'MCI_S03',
    screenshot_slot: 'first_daily_action_or_task_screen',
    capture_question: 'Is there a concrete action that can be completed in under two minutes?'
  },
  {
    slot_id: 'MCI_S04',
    screenshot_slot: 'progress_avatar_identity_feedback_screen',
    capture_question: 'Does completion visibly change avatar, identity, or progress feedback?'
  },
  {
    slot_id: 'MCI_S05',
    screenshot_slot: 'first_paywall_or_iap_terms_screen',
    capture_question: 'Is the first meaningful value before or after a subscription/trial wall?'
  }
];

const walkthroughRows = [];
for (const app of manualPacket) {
  for (const slot of screenshotSlots) {
    walkthroughRows.push({
      capture_id: `MCI_${String(app.inspection_rank).padStart(2, '0')}_${slot.slot_id}`,
      inspection_rank: app.inspection_rank,
      app_name: app.app_name,
      app_store_id: app.app_store_id,
      revenue_proxy_band: app.revenue_proxy_band,
      behavior_tied_progression_prefill: app.behavior_tied_progression_prefill,
      screenshot_slot: slot.screenshot_slot,
      required_filename_stub: `output/manual_validation/${String(app.inspection_rank).padStart(2, '0')}-${slug(app.app_name)}-${slot.screenshot_slot}.png`,
      capture_status: 'not_started',
      capture_question: slot.capture_question,
      observed_answer: '',
      directness_label: '',
      action_to_avatar_causality_label: '',
      paywall_boundary_label: '',
      inspector_notes: '',
      claim_update_target: 'data_processed/manual_competitor_inspection_packet.csv',
      downgrade_trigger: app.fail_condition,
      source_url: app.app_store_url || app.public_web_url
    });
  }
}

const paidTargets = paywallAdjudication
  .filter(row => ['confirmed_visible_public_pricing', 'confirmed_paid_surface_no_clean_price', 'partial_paid_surface_language', 'visible_price_context_uncertain'].includes(row.visual_adjudication))
  .slice(0, 12);
const revenueByName = new Map(revenueProxy.map(row => [row.app_name, row]));
const paidSlots = [
  ['PF_S01', 'public_pricing_or_store_iap', 'Capture visible price, trial, subscription term, or IAP list.'],
  ['PF_S02', 'first_meaningful_paywall_boundary', 'Capture whether the paywall appears before or after first meaningful loop value.'],
  ['PF_S03', 'plan_depth_and_unlocks', 'Capture what paid tier unlocks and whether it matches Alina paid-depth logic.'],
  ['PF_S04', 'human_match_check', 'Confirm the paid surface belongs to the same product/app, not a parent or unrelated page.']
];
const paidRows = [];
paidTargets.forEach((app, index) => {
  const proxy = revenueByName.get(app.app_name) || {};
  for (const [slotId, slot, question] of paidSlots) {
    paidRows.push({
      capture_id: `PF_${String(index + 1).padStart(2, '0')}_${slotId}`,
      app_name: app.app_name,
      market: app.market,
      visual_adjudication_prefill: app.visual_adjudication,
      revenue_proxy_band: proxy.revenue_proxy_band || '',
      capture_slot: slot,
      required_filename_stub: `output/manual_validation/paid-flow-${String(index + 1).padStart(2, '0')}-${slug(app.app_name)}-${slot}.png`,
      capture_status: 'not_started',
      capture_question: question,
      observed_price_or_trial: '',
      paid_flow_label: '',
      product_match_label: '',
      human_notes: '',
      claim_update_target: 'data_processed/web_paywall_visual_adjudication.csv',
      source_url: app.screenshot_source_url || app.source_url || app.app_store_url || ''
    });
  }
});

const icpRows = [];
const testsBySegment = new Map();
for (const test of icpTests) {
  const rows = testsBySegment.get(test.segment_name) || [];
  rows.push(test);
  testsBySegment.set(test.segment_name, rows);
}
for (const segment of icpSegments) {
  const tests = testsBySegment.get(segment.segment_name) || [];
  for (let participant = 1; participant <= 8; participant += 1) {
    for (const test of tests) {
      icpRows.push({
        capture_id: `${test.test_id}_P${String(participant).padStart(2, '0')}`,
        segment_name: segment.segment_name,
        participant_slot: `P${String(participant).padStart(2, '0')}`,
        test_id: test.test_id,
        priority: test.priority,
        test_type: test.test_type || test.validation_type,
        metric: test.metric,
        capture_status: 'not_started',
        prompt_to_run: test.prompt_to_run || test.task_or_question || test.success_signal,
        observed_answer_or_score: '',
        success_flag: '',
        fatal_objection_flag: '',
        exact_quote: '',
        researcher_notes: '',
        claim_update_target: 'data_processed/icp_validation_test_plan.csv'
      });
    }
  }
}

const prototypeRows = [];
const metricIds = prototypeScorecard.map(row => row.metric_id).filter(Boolean);
for (const segment of icpSegments) {
  for (let participant = 1; participant <= 5; participant += 1) {
    for (const screen of prototypeFlow) {
      if (screen.segment_id && screen.segment_id !== segment.segment_id) continue;
      prototypeRows.push({
        capture_id: `PVS_${segment.segment_id}_P${String(participant).padStart(2, '0')}_${screen.screen_id}`,
        segment_id: segment.segment_id,
        segment_name: segment.segment_name,
        participant_slot: `P${String(participant).padStart(2, '0')}`,
        screen_id: screen.screen_id,
        screen_name: screen.screen_name,
        stimulus_copy: screen.stimulus_copy || screen.prototype_copy,
        capture_status: 'not_started',
        observed_behavior: '',
        participant_paraphrase: '',
        success_signal_seen: '',
        failure_signal_seen: '',
        metric_ids_to_score: metricIds.join('|'),
        researcher_notes: '',
        claim_update_target: 'data_processed/prototype_validation_scorecard.csv'
      });
    }
  }
}

writeCsv(WALKTHROUGH_OUT, walkthroughRows, [
  'capture_id', 'inspection_rank', 'app_name', 'app_store_id', 'revenue_proxy_band',
  'behavior_tied_progression_prefill', 'screenshot_slot', 'required_filename_stub',
  'capture_status', 'capture_question', 'observed_answer', 'directness_label',
  'action_to_avatar_causality_label', 'paywall_boundary_label', 'inspector_notes',
  'claim_update_target', 'downgrade_trigger', 'source_url'
]);

writeCsv(PAID_OUT, paidRows, [
  'capture_id', 'app_name', 'market', 'visual_adjudication_prefill', 'revenue_proxy_band',
  'capture_slot', 'required_filename_stub', 'capture_status', 'capture_question',
  'observed_price_or_trial', 'paid_flow_label', 'product_match_label', 'human_notes',
  'claim_update_target', 'source_url'
]);

writeCsv(ICP_OUT, icpRows, [
  'capture_id', 'segment_name', 'participant_slot', 'test_id', 'priority', 'test_type',
  'metric', 'capture_status', 'prompt_to_run', 'observed_answer_or_score',
  'success_flag', 'fatal_objection_flag', 'exact_quote', 'researcher_notes',
  'claim_update_target'
]);

writeCsv(PROTOTYPE_OUT, prototypeRows, [
  'capture_id', 'segment_id', 'segment_name', 'participant_slot', 'screen_id',
  'screen_name', 'stimulus_copy', 'capture_status', 'observed_behavior',
  'participant_paraphrase', 'success_signal_seen', 'failure_signal_seen',
  'metric_ids_to_score', 'researcher_notes', 'claim_update_target'
]);

const summaryRows = [
  { sheet: WALKTHROUGH_OUT, rows: walkthroughRows.length, purpose: 'P0 app/onboarding screenshot capture by app and slot.' },
  { sheet: PAID_OUT, rows: paidRows.length, purpose: 'Human paid-flow signoff by app and evidence slot.' },
  { sheet: ICP_OUT, rows: icpRows.length, purpose: 'Top-two ICP interview capture by participant and test.' },
  { sheet: PROTOTYPE_OUT, rows: prototypeRows.length, purpose: 'Two-minute prototype session observations by segment, participant, and screen.' }
];

const lines = [];
lines.push('# Validation Capture Sheets V1');
lines.push('');
lines.push(`Generated: ${new Date().toISOString()}`);
lines.push('');
lines.push('## Purpose');
lines.push('');
lines.push('These capture sheets turn the validation execution dashboard into fillable evidence rows. They do not claim validation has happened. They define exactly which screenshot, interview, prototype, and paid-flow observations must be collected before any P0 gate can graduate.');
lines.push('');
lines.push('## Summary');
lines.push('');
lines.push(`- Manual walkthrough rows: ${walkthroughRows.length}`);
lines.push(`- Paid-flow rows: ${paidRows.length}`);
lines.push(`- ICP interview rows: ${icpRows.length}`);
lines.push(`- Prototype session rows: ${prototypeRows.length}`);
lines.push(`- Total capture rows: ${walkthroughRows.length + paidRows.length + icpRows.length + prototypeRows.length}`);
lines.push('');
lines.push('## Sheets');
lines.push('');
lines.push(mdTable(summaryRows, [
  { key: 'sheet', label: 'Sheet' },
  { key: 'rows', label: 'Rows', align: 'right' },
  { key: 'purpose', label: 'Purpose' }
]));
lines.push('');
lines.push('## Manual Walkthrough Slots');
lines.push('');
lines.push(mdTable(screenshotSlots, [
  { key: 'slot_id', label: 'Slot' },
  { key: 'screenshot_slot', label: 'Screenshot Slot' },
  { key: 'capture_question', label: 'Capture Question' }
]));
lines.push('');
lines.push('## ICP Segments Queued');
lines.push('');
lines.push(mdTable(icpSegments, [
  { key: 'segment_id', label: 'Segment ID' },
  { key: 'segment_name', label: 'Segment' },
  { key: 'evidence_score', label: 'Score', align: 'right' },
  { key: 'core_job', label: 'Core Job' }
]));
lines.push('');
lines.push('## Operating Rule');
lines.push('');
lines.push('- Leave `capture_status=not_started` until direct observed evidence exists.');
lines.push('- Fill exact screenshot paths, quotes, participant notes, and final labels before updating claim status.');
lines.push('- If any row triggers a downgrade condition, update the relevant claim/register before regenerating the PDF.');
lines.push('');
lines.push('## Files');
lines.push('');
for (const row of summaryRows) lines.push(`- \`${row.sheet}\``);

fs.writeFileSync(DOC_OUT, `${lines.join('\n')}\n`);

console.log(`walkthrough_rows=${walkthroughRows.length}`);
console.log(`paid_rows=${paidRows.length}`);
console.log(`icp_rows=${icpRows.length}`);
console.log(`prototype_rows=${prototypeRows.length}`);
console.log(`doc=${DOC_OUT}`);
