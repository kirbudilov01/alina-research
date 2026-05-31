import fs from 'fs';

const OUT_PACKET = 'data_processed/manual_competitor_inspection_packet.csv';
const OUT_RUBRIC = 'data_processed/manual_competitor_inspection_rubric.csv';
const OUT_DOC = 'docs/competitive/manual-competitor-inspection-packet-v1.md';

for (const dir of ['data_processed', 'docs/competitive']) fs.mkdirSync(dir, { recursive: true });

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
  const slice = rows.slice(0, limit);
  const header = `| ${columns.map(c => c.label).join(' | ')} |`;
  const sep = `| ${columns.map(c => c.align === 'right' ? '---:' : '---').join(' | ')} |`;
  const body = slice.map(row => `| ${columns.map(c => clean(row[c.key]).replace(/\|/g, '/')).join(' | ')} |`);
  return [header, sep, ...body].join('\n');
}

function mapBy(rows, key) {
  const out = new Map();
  for (const row of rows) {
    const value = row[key];
    if (value && !out.has(value)) out.set(value, row);
  }
  return out;
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

function priorityReason(row, revenue, scorecard) {
  const reasons = [];
  if (row.competitive_verdict === 'direct_reference_competitor') reasons.push('only_current_direct_reference');
  if (Number(row.validation_priority_score || 0) >= 100) reasons.push('top_p0_validation_score');
  if (revenue?.revenue_proxy_band === 'strong_bottom_up_money_proxy') reasons.push('strong_money_proxy');
  if (scorecard?.behavior_tied_progression === 'yes') reasons.push('metadata_claims_behavior_tied_progression');
  if (Number(row.review_signal_rows || 0) >= 50) reasons.push('deep_review_language');
  return reasons.join('|') || 'p0_queue_priority';
}

function screenshotSlots(row) {
  return [
    'app_store_listing_or_public_positioning',
    'onboarding_first_value_screen',
    'first_daily_action_or_task_screen',
    'progress_avatar_identity_feedback_screen',
    Number(row.observed_iap_count || 0) > 0 ? 'first_paywall_or_iap_terms_screen' : 'pricing_if_visible_or_free_boundary_screen'
  ].join('|');
}

const queue = csv('data_processed/top100_human_validation_queue.csv')
  .filter(row => row.priority_band === 'P0_validate_first')
  .sort((a, b) => Number(a.validation_rank || 9999) - Number(b.validation_rank || 9999));
const revenueById = mapBy(csv('data_processed/competitor_revenue_proxy_review.csv'), 'app_store_id');
const scoreById = mapBy(csv('data_processed/top100_competitor_review_scorecard.csv'), 'app_store_id');
const webByName = mapBy(csv('data_processed/web_paywall_visual_adjudication.csv'), 'app_name');

const selected = queue.slice(0, 12).map(row => {
  const revenue = revenueById.get(row.app_store_id) || {};
  const scorecard = scoreById.get(row.app_store_id) || {};
  const web = webByName.get(row.app_name) || {};
  const expectedOutcome = row.competitive_verdict === 'direct_reference_competitor'
    ? 'confirm_or_downgrade_direct_reference'
    : 'test_hidden_directness_or_confirm_close_substitute';
  return {
    inspection_rank: row.validation_rank,
    app_store_id: row.app_store_id,
    app_name: row.app_name,
    seller_name: row.seller_name,
    archetype: row.archetype,
    competitive_verdict_prefill: row.competitive_verdict,
    validation_priority_score: row.validation_priority_score,
    revenue_proxy_band: revenue.revenue_proxy_band || '',
    observed_iap_price_range: row.observed_iap_price_range,
    review_signal_rows: row.review_signal_rows,
    top_review_signals: row.top_review_signals,
    behavior_tied_progression_prefill: row.behavior_tied_progression_claim,
    alina_opening_prefill: row.current_research_claim,
    priority_reason: priorityReason(row, revenue, scorecard),
    required_screenshot_slots: screenshotSlots(row),
    core_inspection_questions: [
      'Does onboarding show one coherent daily loop or separate feature shelves?',
      'Is there a personal meaning prompt before the action?',
      'Is there one concrete action that can be completed in under two minutes?',
      'Does completion causally change avatar/identity/progress feedback?',
      'Is paywall before or after first meaningful value?',
      'Would this invalidate Alina whitespace by being a hidden direct clone?'
    ].join('|'),
    pass_condition: 'evidence supports close substitute/directness classification and clarifies whether action->identity/avatar causality exists',
    fail_condition: 'metadata claim is not visible, flow is unrelated, or app is only decorative/generic without daily transformation loop',
    expected_claim_update: expectedOutcome,
    app_store_url: row.app_store_url,
    public_web_url: web.source_url || revenue.source_urls || '',
    inspection_status: 'not_started',
    captured_screenshot_paths: '',
    inspector_notes: '',
    final_verdict_after_inspection: ''
  };
});

const rubric = [
  {
    rubric_id: 'MCI_R01',
    inspection_dimension: 'directness',
    pass_definition: 'App clearly combines personal meaning, one daily action, short reset/reflection, progress or identity feedback, and next-day hook.',
    downgrade_trigger: 'Only one or two primitives are visible, or the loop is scattered across unrelated features.',
    effect_on_claims: 'Confirming directness strengthens H1/H3; downgrading protects whitespace from overclaim.'
  },
  {
    rubric_id: 'MCI_R02',
    inspection_dimension: 'action_to_avatar_causality',
    pass_definition: 'Completed user action visibly changes avatar, identity object, future-self state, or progress representation.',
    downgrade_trigger: 'Avatar/progress is decorative, static, generic, or only a profile asset.',
    effect_on_claims: 'This is the core whitespace test for behavior-tied avatar progression.'
  },
  {
    rubric_id: 'MCI_R03',
    inspection_dimension: 'first_value_before_paywall',
    pass_definition: 'User can experience meaningful loop value before subscription, credits, trial wall, or account lock.',
    downgrade_trigger: 'Paywall blocks first meaningful output or hides the loop.',
    effect_on_claims: 'Feeds monetization/readiness risk and prototype pricing strategy.'
  },
  {
    rubric_id: 'MCI_R04',
    inspection_dimension: 'positioning_overlap',
    pass_definition: 'Public/onboarding copy directly targets daily transformation, identity, ritual, emotional reset, or guided action.',
    downgrade_trigger: 'Copy is generic wellness, content library, one-off avatar generation, or broad coaching without daily ritual.',
    effect_on_claims: 'Refines competitive messaging and ICP fit.'
  },
  {
    rubric_id: 'MCI_R05',
    inspection_dimension: 'safety_and_trust',
    pass_definition: 'Claims are framed softly with user agency and no deterministic/clinical overclaim.',
    downgrade_trigger: 'Manipulative streak pressure, spiritual certainty, unsafe advice, or deceptive pricing.',
    effect_on_claims: 'Feeds product safety boundaries and differentiation.'
  },
  {
    rubric_id: 'MCI_R06',
    inspection_dimension: 'hidden_clone_risk',
    pass_definition: 'No inspected P0 app fully owns the same integrated loop with strong execution.',
    downgrade_trigger: 'A competitor already delivers the full Alina loop with clear action->identity feedback.',
    effect_on_claims: 'If triggered, H3/H4 must be downgraded and positioning/product core revised.'
  }
];

writeCsv(OUT_PACKET, selected, [
  'inspection_rank', 'app_store_id', 'app_name', 'seller_name', 'archetype',
  'competitive_verdict_prefill', 'validation_priority_score', 'revenue_proxy_band',
  'observed_iap_price_range', 'review_signal_rows', 'top_review_signals',
  'behavior_tied_progression_prefill', 'alina_opening_prefill', 'priority_reason',
  'required_screenshot_slots', 'core_inspection_questions', 'pass_condition',
  'fail_condition', 'expected_claim_update', 'app_store_url', 'public_web_url',
  'inspection_status', 'captured_screenshot_paths', 'inspector_notes',
  'final_verdict_after_inspection'
]);

writeCsv(OUT_RUBRIC, rubric, [
  'rubric_id', 'inspection_dimension', 'pass_definition', 'downgrade_trigger',
  'effect_on_claims'
]);

const lines = [];
lines.push('# Manual Competitor Inspection Packet V1');
lines.push('');
lines.push(`Generated: ${new Date().toISOString()}`);
lines.push('');
lines.push('## Purpose');
lines.push('');
lines.push('This packet turns the P0 human validation queue into a concrete inspection workflow for the highest-risk competitors. It does not claim the inspections have been completed. It defines which apps to inspect, what evidence to capture, and how the result should update whitespace and competitive-advantage claims.');
lines.push('');
lines.push('## Packet Summary');
lines.push('');
lines.push(`- P0 apps selected for first inspection wave: ${selected.length}`);
lines.push(`- Rubric dimensions: ${rubric.length}`);
lines.push(`- Apps with strong money proxy in selected set: ${selected.filter(row => row.revenue_proxy_band === 'strong_bottom_up_money_proxy').length}`);
lines.push(`- Apps with prefilled behavior-tied progression claim: ${selected.filter(row => row.behavior_tied_progression_prefill === 'yes').length}`);
lines.push('');
lines.push('Priority reasons:');
lines.push('');
const reasonCounts = {};
for (const row of selected) for (const reason of row.priority_reason.split('|').filter(Boolean)) reasonCounts[reason] = (reasonCounts[reason] || 0) + 1;
lines.push(bulletCounts(reasonCounts));
lines.push('');
lines.push('## First Inspection Wave');
lines.push('');
lines.push(mdTable(selected, [
  { key: 'inspection_rank', label: 'Rank', align: 'right' },
  { key: 'app_name', label: 'App' },
  { key: 'competitive_verdict_prefill', label: 'Prefill Verdict' },
  { key: 'revenue_proxy_band', label: 'Money Proxy' },
  { key: 'behavior_tied_progression_prefill', label: 'Behavior-Tied?' },
  { key: 'priority_reason', label: 'Why Inspect' }
], selected.length));
lines.push('');
lines.push('## Rubric');
lines.push('');
lines.push(mdTable(rubric, [
  { key: 'rubric_id', label: 'ID' },
  { key: 'inspection_dimension', label: 'Dimension' },
  { key: 'pass_definition', label: 'Pass Definition' },
  { key: 'downgrade_trigger', label: 'Downgrade Trigger' },
  { key: 'effect_on_claims', label: 'Claim Effect' }
], rubric.length));
lines.push('');
lines.push('## Required Evidence');
lines.push('');
lines.push('- Capture 3-5 screenshots per app: listing/positioning, onboarding, first action, avatar/progress feedback, and paywall/free-boundary when visible.');
lines.push('- Record whether action -> avatar/identity causality is visible, inferred, absent, or blocked.');
lines.push('- Update `inspection_status`, `captured_screenshot_paths`, `inspector_notes`, and `final_verdict_after_inspection` in the packet CSV after review.');
lines.push('- If any app is a hidden direct clone, downgrade the whitespace claim and revise Alina positioning before final PDF.');
lines.push('');
lines.push('## Files');
lines.push('');
lines.push(`- \`${OUT_PACKET}\``);
lines.push(`- \`${OUT_RUBRIC}\``);

fs.writeFileSync(OUT_DOC, `${lines.join('\n')}\n`);

console.log(`packet=${OUT_PACKET}`);
console.log(`rubric=${OUT_RUBRIC}`);
console.log(`doc=${OUT_DOC}`);
console.log(`selected=${selected.length}`);
console.log(`rubric_rows=${rubric.length}`);
console.log(`strong_money=${selected.filter(row => row.revenue_proxy_band === 'strong_bottom_up_money_proxy').length}`);
