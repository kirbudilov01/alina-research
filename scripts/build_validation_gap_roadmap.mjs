import fs from 'fs';

const OUT_MATRIX = 'data_processed/validation_gap_roadmap.csv';
const OUT_DOC = 'docs/decision/validation-gap-roadmap-v1.md';

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

function countBy(rows, key) {
  const out = {};
  for (const row of rows) out[row[key] || 'unknown'] = (out[row[key] || 'unknown'] || 0) + 1;
  return out;
}

function count(rows, predicate) {
  return rows.filter(predicate).length;
}

function rowBelongsToMarket(row, niche) {
  const text = [
    row.niche,
    row.market,
    row.archetype,
    row.keyword,
    row.app_name,
    row.competitive_verdict
  ].map(clean).join(' ').toLowerCase();
  if (text.includes(niche.toLowerCase())) return true;
  if (niche === 'coaching') return /coach|self improvement|fitness|workout|therapy|growth|routine/.test(text);
  if (niche === 'mindfulness') return /meditat|mindful|calm|sleep|breath|reset|yoga/.test(text);
  if (niche === 'avatar_identity') return /avatar|identity|character|persona|ai companion|companion|profile|workout/.test(text);
  if (niche === 'astrology_esoterics') return /astrolog|horoscope|tarot|manifest|spiritual|devotional|faith|bible|vision board/.test(text);
  if (niche === 'gaming') return /game|gaming|quest|level|xp|rpg|cozy|streak/.test(text);
  return false;
}

function bulletCounts(counts) {
  return Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .map(([key, value]) => `- ${key}: ${value}`)
    .join('\n');
}

const expanded = csv('data_raw/expanded/all_expanded_dedup.csv');
const audience = csv('data_processed/audience_signal_matrix.csv');
const whitespace = csv('data_processed/whitespace_signal_matrix.csv');
const tam = csv('data_processed/tam_sam_som_model.csv');
const claims = csv('data_processed/market_claims.csv');
const top100 = csv('data_processed/top100_competitor_review_scorecard.csv');
const validationQueue = csv('data_processed/top100_human_validation_queue.csv');
const pricing = csv('data_raw/app_store_iap_pricing_raw.csv');
const googlePricing = csv('data_raw/google_play_pricing_raw.csv');
const forumQuotes = csv('data_processed/forum_quote_coding_matrix.csv');
const chromeBattlecards = csv('data_processed/chrome_extension_mechanic_battlecards.csv');
const publicListingInspection = csv('data_processed/public_listing_inspection_results.csv');
const marketStressTest = csv('data_processed/market_sizing_stress_test.csv');
const marketAssumptionAudit = csv('data_processed/market_sizing_assumption_audit.csv');
const icpSegments = csv('data_processed/icp_segment_matrix.csv');
const icpValidationPlan = csv('data_processed/icp_validation_test_plan.csv');
const evidence = csv('data_processed/evidence_claim_register.csv');
const strongIcpSegments = icpSegments.filter(row => row.evidence_band === 'strong_directional_icp');
const publicListingInspected = publicListingInspection.filter(row => row.public_listing_inspection_status === 'public_listing_inspected').length;
const publicListingHighRisk = publicListingInspection.filter(row => row.hidden_clone_risk_public_read === 'high_hidden_clone_risk_requires_app_walkthrough').length;
const chromePriorityCount = count(chromeBattlecards, row => ['mechanic_threat_high', 'mechanic_threat_medium', 'mechanic_reference_high'].includes(row.threat_band));

const marketNames = {
  coaching: 'Coaching / self-improvement',
  mindfulness: 'Mindfulness / reset',
  avatar_identity: 'Avatar / identity',
  astrology_esoterics: 'Astrology / esoterics',
  gaming: 'Gaming / progression benchmark'
};

function marketRow(niche) {
  const tamRow = tam.find(row => row.pillar === niche) || {};
  const expandedRows = count(expanded, row => row.niche === niche);
  const audienceRows = count(audience, row => row.niche === niche || row.market === niche);
  const highWs = count(whitespace, row => row.niche === niche && row.whitespace_band === 'high');
  const medWs = count(whitespace, row => row.niche === niche && row.whitespace_band === 'medium');
  const topRows = count(top100, row => rowBelongsToMarket(row, niche));
  const p0p1 = count(validationQueue, row => rowBelongsToMarket(row, niche) && ['P0_validate_first', 'P1_high'].includes(row.priority_band));
  const iapRows = count(pricing, row => row.niche === niche);
  const gpRows = count(googlePricing, row => row.niche === niche && row.collection_status === 'ok');
  const quoteRows = count(forumQuotes, row => row.market === niche);
  const claimRows = count(claims, row => row.market === niche || row.pillar === niche);
  const score = (
    Math.min(3, Math.floor(expandedRows / 1000)) +
    Math.min(2, Math.floor(audienceRows / 1000)) +
    Math.min(2, Math.floor((highWs + medWs) / 250)) +
    Math.min(2, Math.floor((iapRows + gpRows) / 50)) +
    Math.min(2, quoteRows > 0 ? 1 : 0) +
    Math.min(2, claimRows)
  );
  const evidenceBand = score >= 10 ? 'strong_directional' : score >= 7 ? 'medium_directional' : 'thin';
  const gap = [];
  if (claimRows < 2) gap.push('market_claim_depth');
  if (p0p1 < 5) gap.push('manual_competitor_validation');
  if (quoteRows < 8) gap.push('qualitative_user_language');
  if (iapRows + gpRows < 40) gap.push('pricing_depth');
  if (niche === 'gaming') gap.push('directness_limit_mechanic_benchmark_only');
  if (niche === 'avatar_identity') gap.push('consumer_identity_share_uncertain');
  if (niche === 'astrology_esoterics') gap.push('public_market_sources_vary_widely');
  return {
    roadmap_id: `MKT_${niche}`,
    roadmap_type: 'market_validation',
    market: niche,
    label: marketNames[niche],
    evidence_band: evidenceBand,
    priority: evidenceBand === 'thin' ? 'P0' : 'P1',
    current_evidence: `expanded=${expandedRows}; audience=${audienceRows}; high_ws=${highWs}; medium_ws=${medWs}; top_review=${topRows}; p0p1_validation=${p0p1}; pricing_rows=${iapRows + gpRows}; forum_quotes=${quoteRows}; market_claims=${claimRows}; sam_base=${tamRow.samBase || 'n/a'}`,
    main_gap: gap.join('|') || 'human_validation',
    recommended_next_action: marketNextAction(niche, gap),
    success_gate: marketSuccessGate(niche),
    source_files: 'data_raw/expanded/all_expanded_dedup.csv;data_processed/audience_signal_matrix.csv;data_processed/whitespace_signal_matrix.csv;data_processed/tam_sam_som_model.csv;data_processed/top100_human_validation_queue.csv'
  };
}

function marketNextAction(niche, gaps) {
  if (niche === 'gaming') return 'Use only as retention/progression benchmark; extract 10 concrete mechanics from high-signal cozy/progression examples before any direct TAM claim.';
  if (niche === 'avatar_identity') return 'Validate whether avatar identity products create recurring self-change value or only one-off generation/novelty.';
  if (niche === 'astrology_esoterics') return 'Add source confidence review and compare subscription/retention mechanics against app-store IAP evidence.';
  if (niche === 'mindfulness') return 'Manually inspect reset/paywall/onboarding flows for calm-versus-gamification tension.';
  if (niche === 'coaching') return 'Validate whether AI coach/accountability tools overlap with daily ritual users or mostly serve narrow productivity/B2B jobs.';
  return gaps.includes('qualitative_user_language') ? 'Add human quote validation and user interviews.' : 'Run P0/P1 competitor validation.';
}

function marketSuccessGate(niche) {
  if (niche === 'gaming') return 'Mechanic benchmark only: 10 inspected mechanics, 0 claims of direct spend unless direct consumer overlap is proven.';
  if (niche === 'avatar_identity') return 'At least 5 inspected products prove identity/avatar is part of recurring loop, not only asset creation.';
  if (niche === 'astrology_esoterics') return 'At least 3 credible market/revenue sources plus pricing evidence for subscription willingness.';
  if (niche === 'mindfulness') return 'At least 5 inspected reset products with notes on monetization, streak pressure, and calm UX.';
  if (niche === 'coaching') return 'At least 5 inspected coaching/accountability products with clear consumer daily-use overlap.';
  return 'Manual validation notes resolve top evidence gap.';
}

function hypothesisRow(claim) {
  const status = clean(claim.evidence_status);
  const confidence = clean(claim.confidence);
  let priority = 'P2';
  if (/unproven|not_final|partial|narrow|supported_narrowly/.test(status) || /low/.test(confidence)) priority = 'P0';
  else if (/directionally|ranges|medium/.test(status) || confidence === 'medium') priority = 'P1';
  return {
    roadmap_id: claim.claim_id,
    roadmap_type: 'hypothesis_validation',
    market: 'all',
    label: claim.claim,
    evidence_band: `${status}/${confidence}`,
    priority,
    current_evidence: claim.primary_metric,
    main_gap: claim.key_gap,
    recommended_next_action: claim.next_action,
    success_gate: successGateForClaim(claim.claim_id),
    source_files: claim.evidence_files
  };
}

function successGateForClaim(claimId) {
  if (claimId === 'H1_product_shape_exists') return 'Human validation confirms at least 5 close substitutes and no hidden direct clone invalidates the loop.';
  if (claimId === 'H2_markets_have_money') return 'Market stress-test, source confidence, and paid-flow validation support range-based money claims without overclaiming revenue.';
  if (claimId === 'H2_paywall_visible_evidence') return 'Human screenshot review classifies public pricing/paywall evidence as confirm/partial/reject.';
  if (claimId === 'H3_whitespace_exists') return 'Manual app/onboarding inspection confirms action -> identity/avatar causality remains rare.';
  if (claimId === 'H4_competitive_advantage_plausible') return 'Prototype or user test shows the integrated loop is understood and preferred over generic habit/coach alternatives.';
  if (claimId === 'H5_shared_audience_exists') return 'User interviews or validated quotes confirm one audience segment with shared language and willingness to use/pay.';
  if (claimId === 'H6_product_core_defined') return 'Prototype test validates comprehension, emotional value, and next-day return intent.';
  return 'Requirement remains true after next evidence refresh.';
}

const markets = ['coaching', 'mindfulness', 'avatar_identity', 'astrology_esoterics', 'gaming'];
const rows = [
  ...markets.map(marketRow),
  ...evidence
    .filter(row => row.claim_id.startsWith('H'))
    .map(hypothesisRow),
  {
    roadmap_id: 'XR_CHROME_MECHANIC_VALIDATION',
    roadmap_type: 'cross_source_validation',
    market: 'coaching|mindfulness|avatar_identity',
    label: 'Chrome extension mechanic references',
    evidence_band: 'mechanic_evidence_not_direct_competition',
    priority: 'P1',
    current_evidence: `${chromeBattlecards.length} battlecards; ${chromePriorityCount} priority mechanic references`,
    main_gap: 'screenshots/onboarding may reveal hidden identity metaphors or richer loops than metadata shows',
    recommended_next_action: 'Capture screenshots for priority Chrome mechanic references and classify progress as numeric, emotional, behavioral, or identity/avatar-linked.',
    success_gate: 'Priority Chrome references are classified and either strengthen or weaken the narrow whitespace claim.',
    source_files: 'data_processed/chrome_extension_mechanic_battlecards.csv;docs/competitive/chrome-extension-mechanic-battlecards-v1.md'
  },
  {
    roadmap_id: 'XR_MARKET_STRESS_FOLLOWUP',
    roadmap_type: 'cross_source_validation',
    market: 'all',
    label: 'Market sizing stress-test follow-up',
    evidence_band: `${marketAssumptionAudit.length} assumption rows; ${marketStressTest.length} stress scenarios`,
    priority: 'P1',
    current_evidence: `${marketStressTest.length} stress scenarios; ${marketAssumptionAudit.filter(row => /high|benchmark_only/.test(row.model_risk)).length} high-risk/range-only rows`,
    main_gap: 'stress-test is model evidence, not actual revenue or willingness-to-pay proof',
    recommended_next_action: 'Use stress-test rows to prioritize paid-flow inspection and prototype willingness-to-pay questions.',
    success_gate: 'High-risk market assumptions either gain stronger source/proxy support or remain explicitly caveated in final PDF.',
    source_files: 'data_processed/market_sizing_assumption_audit.csv;data_processed/market_sizing_stress_test.csv;docs/market/market-sizing-stress-test-v1.md'
  },
  {
    roadmap_id: 'XR_PUBLIC_LISTING_WALKTHROUGH',
    roadmap_type: 'cross_source_validation',
    market: 'all',
    label: 'P0 public listing to app walkthrough bridge',
    evidence_band: `${publicListingInspected} public listings inspected; ${publicListingHighRisk} high clone-risk public read`,
    priority: 'P0',
    current_evidence: `${publicListingInspected} public listings inspected; manual app walkthrough done=0`,
    main_gap: 'public listing evidence cannot prove hidden in-app mechanics',
    recommended_next_action: 'Capture onboarding, first action, progress/avatar feedback, and paywall-boundary screenshots for the high-risk P0 apps.',
    success_gate: 'P0 apps have final directness, action-to-avatar causality, hidden clone risk, and paywall-boundary verdicts.',
    source_files: 'data_processed/public_listing_inspection_results.csv;data_processed/manual_competitor_inspection_packet.csv;docs/competitive/public-listing-inspection-v1.md'
  },
  {
    roadmap_id: 'XR_ICP_SEGMENT_VALIDATION',
    roadmap_type: 'cross_source_validation',
    market: 'all',
    label: 'ICP segment validation',
    evidence_band: `${icpSegments.length} directional ICP hypotheses`,
    priority: 'P0',
    current_evidence: `${icpSegments.length} segments; ${strongIcpSegments.length} strong_directional_icp; ${icpValidationPlan.length} validation tests`,
    main_gap: 'directional segments have not been validated with interviews, prototype response, or willingness-to-pay checks',
    recommended_next_action: 'Run the ICP validation packet for the top two segments, compare language resonance, loop completion, return intent, and willingness to pay.',
    success_gate: 'One primary ICP and one secondary ICP are selected with validated language, top pains, activation trigger, and willingness-to-pay evidence.',
    source_files: 'data_processed/icp_segment_matrix.csv;data_processed/icp_validation_test_plan.csv;docs/audience/icp-segment-matrix-v1.md;docs/audience/icp-validation-packet-v1.md'
  }
];

writeCsv(OUT_MATRIX, rows, [
  'roadmap_id', 'roadmap_type', 'market', 'label', 'evidence_band', 'priority',
  'current_evidence', 'main_gap', 'recommended_next_action', 'success_gate', 'source_files'
]);

const lines = [];
lines.push('# Validation Gap Roadmap V1');
lines.push('');
lines.push(`Generated: ${new Date().toISOString()}`);
lines.push('');
lines.push('## Purpose');
lines.push('');
lines.push('This roadmap converts the current evidence base into the next validation queue. It is intentionally conservative: rows are not marked complete just because data exists; each row names the gap that must be closed before final claims or a polished PDF.');
lines.push('');
lines.push('## Priority Mix');
lines.push('');
lines.push(bulletCounts(countBy(rows, 'priority')));
lines.push('');
lines.push('## Market Validation');
lines.push('');
lines.push('| Market | Evidence Band | Priority | Current Evidence | Main Gap | Next Action |');
lines.push('| --- | --- | --- | --- | --- | --- |');
for (const row of rows.filter(r => r.roadmap_type === 'market_validation')) {
  lines.push(`| ${row.label} | ${row.evidence_band} | ${row.priority} | ${row.current_evidence} | ${row.main_gap.replace(/\|/g, '<br>')} | ${row.recommended_next_action} |`);
}
lines.push('');
lines.push('## Hypothesis Validation');
lines.push('');
lines.push('| Hypothesis | Evidence Band | Priority | Gap | Success Gate |');
lines.push('| --- | --- | --- | --- | --- |');
for (const row of rows.filter(r => r.roadmap_type === 'hypothesis_validation')) {
  lines.push(`| ${row.roadmap_id} | ${row.evidence_band} | ${row.priority} | ${row.main_gap} | ${row.success_gate} |`);
}
lines.push('');
lines.push('## Cross-Source Tasks');
lines.push('');
for (const row of rows.filter(r => r.roadmap_type === 'cross_source_validation')) {
  lines.push(`### ${row.label}`);
  lines.push('');
  lines.push(`- Priority: ${row.priority}`);
  lines.push(`- Current evidence: ${row.current_evidence}`);
  lines.push(`- Gap: ${row.main_gap}`);
  lines.push(`- Next action: ${row.recommended_next_action}`);
  lines.push(`- Success gate: ${row.success_gate}`);
  lines.push('');
}
lines.push('## Files');
lines.push('');
lines.push(`- \`${OUT_MATRIX}\``);
fs.writeFileSync(OUT_DOC, `${lines.join('\n')}\n`);

console.log(`matrix=${OUT_MATRIX}`);
console.log(`doc=${OUT_DOC}`);
console.log(`rows=${rows.length}`);
console.log(`p0=${rows.filter(row => row.priority === 'P0').length}`);
console.log(`p1=${rows.filter(row => row.priority === 'P1').length}`);
