import fs from 'fs';

const OUT = 'data_processed/validation_execution_dashboard.csv';
const OUT_DOC = 'docs/decision/validation-execution-dashboard-v1.md';

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
  const slice = rows.slice(0, limit);
  const header = `| ${columns.map(c => c.label).join(' | ')} |`;
  const sep = `| ${columns.map(c => c.align === 'right' ? '---:' : '---').join(' | ') } |`;
  const body = slice.map(row => `| ${columns.map(c => clean(row[c.key]).replace(/\|/g, '/')).join(' | ')} |`);
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

const roadmap = csv('data_processed/validation_gap_roadmap.csv');
const publicListing = csv('data_processed/public_listing_inspection_results.csv');
const manualPacket = csv('data_processed/manual_competitor_inspection_packet.csv');
const chromeBattlecards = csv('data_processed/chrome_extension_mechanic_battlecards.csv');
const icpSegments = csv('data_processed/icp_segment_matrix.csv');
const prototypeScorecard = csv('data_processed/prototype_validation_scorecard.csv');
const marketStress = csv('data_processed/market_sizing_stress_test.csv');
const marketAssumptions = csv('data_processed/market_sizing_assumption_audit.csv');
const paywallAdjudication = csv('data_processed/web_paywall_visual_adjudication.csv');

const publicHighRisk = publicListing
  .filter(row => row.hidden_clone_risk_public_read === 'high_hidden_clone_risk_requires_app_walkthrough'
    || row.action_to_avatar_causality_public_read === 'visible_in_public_copy')
  .slice(0, 5);
const manualTop = manualPacket.slice(0, 5);
const chromePriority = chromeBattlecards
  .filter(row => ['mechanic_threat_high', 'mechanic_threat_medium', 'mechanic_reference_high'].includes(row.threat_band))
  .slice(0, 8);
const topIcp = icpSegments.slice().sort((a, b) => Number(b.evidence_score || 0) - Number(a.evidence_score || 0)).slice(0, 2);
const riskyMarketRows = marketAssumptions.filter(row => /high|benchmark_only/.test(row.model_risk)).slice(0, 4);
const partialPaywalls = paywallAdjudication
  .filter(row => ['confirmed_visible_public_pricing', 'confirmed_paid_surface_no_clean_price', 'partial_paid_surface_language', 'visible_price_context_uncertain'].includes(row.visual_adjudication))
  .slice(0, 8);

const rows = [];
function add(row) {
  rows.push({
    execution_rank: rows.length + 1,
    status: 'not_started',
    ...row
  });
}

add({
  workstream: 'manual_competitor_walkthrough',
  priority: 'P0',
  task: `Inspect public high-risk directness apps: ${publicHighRisk.map(row => row.app_name).join(' | ') || manualTop.map(row => row.app_name).join(' | ')}`,
  why_now: 'H1/H3 cannot graduate because public listings can overstate or hide in-app action-to-avatar causality.',
  exact_evidence_to_capture: 'listing screenshot | onboarding first value | first action | progress/avatar feedback | paywall/free boundary | inspector notes',
  success_gate: 'At least 5 P0 apps classified as full loop / adjacent loop / weak adjacency / blocked, with screenshot paths and final verdicts.',
  kill_or_downgrade_gate: 'Any app fully owns the Alina loop with clear action->identity/avatar causality and strong execution.',
  source_files: 'data_processed/manual_competitor_inspection_packet.csv;data_processed/public_listing_inspection_results.csv',
  output_file_to_update: 'data_processed/manual_competitor_inspection_packet.csv'
});

add({
  workstream: 'prototype_user_validation',
  priority: 'P0',
  task: `Run two-minute prototype sessions for ${topIcp.map(row => row.segment_name).join(' and ')}`,
  why_now: 'H4 remains unvalidated until real users understand and value the meaning -> action -> progress loop.',
  exact_evidence_to_capture: prototypeScorecard.map(row => row.metric_id || row.metric_name).filter(Boolean).join(' | '),
  success_gate: 'Top two ICP segments produce comprehension, meaning lift, differentiation, return intent, and paid-depth signals above scorecard thresholds.',
  kill_or_downgrade_gate: 'Participants read the loop as generic motivation, unsafe certainty, chore-like gamification, or not worth returning to.',
  source_files: 'data_processed/prototype_validation_stimulus_flow.csv;data_processed/prototype_validation_scorecard.csv;data_processed/icp_segment_matrix.csv',
  output_file_to_update: 'data_processed/prototype_validation_scorecard.csv'
});

add({
  workstream: 'icp_interviews',
  priority: 'P0',
  task: `Run ICP validation packet for ${topIcp.map(row => row.segment_name).join(' and ')}`,
  why_now: 'Audience signal is directional; the project still lacks validated language, recent behavior, and willingness-to-pay evidence.',
  exact_evidence_to_capture: 'recent episode | current workaround | pain intensity | language resonance | trust/safety concerns | acceptable price range',
  success_gate: 'One primary ICP and one secondary ICP selected with recent behavior, shared language, activation trigger, and WTP signal.',
  kill_or_downgrade_gate: 'No segment recalls a concrete use episode or all reject the action-tied identity/progress premise.',
  source_files: 'data_processed/icp_validation_test_plan.csv;docs/audience/icp-validation-packet-v1.md',
  output_file_to_update: 'data_processed/icp_validation_test_plan.csv'
});

add({
  workstream: 'paid_flow_validation',
  priority: 'P0',
  task: `Human-signoff paid-surface evidence: ${partialPaywalls.map(row => row.app_name).join(' | ')}`,
  why_now: 'Market-money evidence is strong as proxy but not final revenue/paywall proof.',
  exact_evidence_to_capture: 'public pricing screenshot | app/product match | trial length | monthly/annual price | first meaningful paywall boundary',
  success_gate: 'Highest-money competitors have confirm/partial/reject paid-flow labels with human notes.',
  kill_or_downgrade_gate: 'Paid signals mostly belong to parent company pages, unrelated products, or login-gated pages that cannot support claims.',
  source_files: 'data_processed/web_paywall_visual_adjudication.csv;data_processed/competitor_revenue_proxy_review.csv',
  output_file_to_update: 'data_processed/web_paywall_visual_adjudication.csv'
});

add({
  workstream: 'market_stress_followup',
  priority: 'P1',
  task: `Resolve highest market sizing risk rows: ${riskyMarketRows.map(row => row.pillar).join(' | ')}`,
  why_now: 'TAM/SAM/SOM is stress-tested but final claims still depend on source quality, directness, and paid-flow validation.',
  exact_evidence_to_capture: 'source definition | directness adjustment | competitor proxy support | paid-flow proof | final model role',
  success_gate: 'High-risk rows either receive stronger source/proxy support or remain explicitly range-only/context-only.',
  kill_or_downgrade_gate: 'Intersection/direct SAM depends on broad benchmark sources without validated direct consumer overlap.',
  source_files: 'data_processed/market_sizing_assumption_audit.csv;data_processed/market_sizing_stress_test.csv',
  output_file_to_update: 'data_processed/market_sizing_assumption_audit.csv'
});

add({
  workstream: 'chrome_mechanic_screenshots',
  priority: 'P1',
  task: `Inspect priority Chrome mechanics: ${chromePriority.map(row => row.app_name).join(' | ')}`,
  why_now: 'Chrome battlecards show lightweight habit/progress/accountability mechanics, but screenshots may reveal richer identity metaphors.',
  exact_evidence_to_capture: 'extension listing | first-use flow | capture/progress surface | emotional/behavioral/numeric/identity classification',
  success_gate: 'Priority references classified by mechanic type and whether they strengthen or weaken narrow whitespace.',
  kill_or_downgrade_gate: 'Browser tools already deliver action-tied identity/avatar progression with strong user traction.',
  source_files: 'data_processed/chrome_extension_mechanic_battlecards.csv;docs/competitive/chrome-extension-mechanic-battlecards-v1.md',
  output_file_to_update: 'data_processed/chrome_extension_mechanic_battlecards.csv'
});

add({
  workstream: 'final_report_upgrade',
  priority: 'P1',
  task: 'Upgrade polished evidence draft after P0 validation evidence exists',
  why_now: 'REQ_08 is a polished evidence draft, not final validated publication.',
  exact_evidence_to_capture: 'manual inspection verdicts | prototype scorecard observations | ICP interview results | paid-flow human notes',
  success_gate: 'Final PDF can make validated claims without caveat inflation.',
  kill_or_downgrade_gate: 'Validation results contradict product core, ICP, market-money, or whitespace claims.',
  source_files: 'output/pdf/alina-polished-evidence-pack-v1.pdf;data_processed/research_completion_audit.csv',
  output_file_to_update: 'output/pdf/alina-polished-evidence-pack-v1.pdf'
});

for (const roadmapRow of roadmap.filter(row => row.priority === 'P0').slice(0, 4)) {
  add({
    workstream: 'roadmap_p0_trace',
    priority: 'P0',
    task: roadmapRow.recommended_next_action,
    why_now: roadmapRow.main_gap,
    exact_evidence_to_capture: 'Evidence named in source files plus final status update.',
    success_gate: roadmapRow.success_gate,
    kill_or_downgrade_gate: 'Success gate cannot be met after direct inspection or participant response.',
    source_files: roadmapRow.source_files,
    output_file_to_update: 'data_processed/validation_gap_roadmap.csv'
  });
}

writeCsv(OUT, rows, [
  'execution_rank', 'priority', 'workstream', 'status', 'task', 'why_now',
  'exact_evidence_to_capture', 'success_gate', 'kill_or_downgrade_gate',
  'source_files', 'output_file_to_update'
]);

const lines = [];
lines.push('# Validation Execution Dashboard V1');
lines.push('');
lines.push(`Generated: ${new Date().toISOString()}`);
lines.push('');
lines.push('## Purpose');
lines.push('');
lines.push('This dashboard turns the open validation gates into concrete execution tasks. It does not claim validation has happened; every row is intentionally marked not_started until screenshots, interviews, prototype observations, or paid-flow notes are captured.');
lines.push('');
lines.push('## Summary');
lines.push('');
lines.push(`- Execution tasks: ${rows.length}`);
lines.push(`- P0 tasks: ${rows.filter(row => row.priority === 'P0').length}`);
lines.push(`- P1 tasks: ${rows.filter(row => row.priority === 'P1').length}`);
lines.push('');
lines.push('Workstreams:');
lines.push('');
lines.push(bulletCounts(countBy(rows, 'workstream')));
lines.push('');
lines.push('## Dashboard');
lines.push('');
lines.push(mdTable(rows, [
  { key: 'execution_rank', label: 'Rank', align: 'right' },
  { key: 'priority', label: 'Priority' },
  { key: 'workstream', label: 'Workstream' },
  { key: 'task', label: 'Task' },
  { key: 'success_gate', label: 'Success Gate' },
  { key: 'output_file_to_update', label: 'Update' }
], rows.length));
lines.push('');
lines.push('## Operating Rule');
lines.push('');
lines.push('- Do not mark any row complete from metadata alone.');
lines.push('- Each P0 row needs direct observed evidence: screenshots, filled scorecards, participant notes, or human paid-flow adjudication.');
lines.push('- If evidence contradicts the current thesis, downgrade the related claim before updating the PDF.');
lines.push('');
lines.push('## Files');
lines.push('');
lines.push(`- \`${OUT}\``);

fs.writeFileSync(OUT_DOC, `${lines.join('\n')}\n`);

console.log(`dashboard=${OUT}`);
console.log(`doc=${OUT_DOC}`);
console.log(`tasks=${rows.length}`);
console.log(`p0=${rows.filter(row => row.priority === 'P0').length}`);
console.log(`p1=${rows.filter(row => row.priority === 'P1').length}`);
