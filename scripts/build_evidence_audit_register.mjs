import fs from 'fs';

const OUT = 'data_processed/evidence_claim_register.csv';
const OUT_DOC = 'docs/decision/evidence-audit-v1.md';

for (const dir of ['data_processed', 'docs/decision']) fs.mkdirSync(dir, { recursive: true });

function parseCsv(text) {
  const rows = [];
  let row = [];
  let cell = '';
  let quoted = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    const n = text[i + 1];
    if (quoted) {
      if (c === '"' && n === '"') {
        cell += '"';
        i++;
      } else if (c === '"') {
        quoted = false;
      } else {
        cell += c;
      }
    } else if (c === '"') {
      quoted = true;
    } else if (c === ',') {
      row.push(cell);
      cell = '';
    } else if (c === '\n') {
      row.push(cell);
      rows.push(row);
      row = [];
      cell = '';
    } else if (c !== '\r') {
      cell += c;
    }
  }
  if (cell || row.length) {
    row.push(cell);
    rows.push(row);
  }
  const header = rows.shift();
  if (!header) return [];
  return rows.filter(r => r.length === header.length).map(r => Object.fromEntries(header.map((h, i) => [h, r[i] || ''])));
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

function pct(num, den) {
  if (!den) return '0%';
  return `${Math.round((num / den) * 1000) / 10}%`;
}

const expanded = csv('data_raw/expanded/all_expanded_dedup.csv');
const expandedRaw = csv('data_raw/expanded/all_expanded_raw.csv');
const feature = csv('data_processed/competitor_feature_matrix.csv');
const audience = csv('data_processed/audience_signal_matrix.csv');
const whitespace = csv('data_processed/whitespace_signal_matrix.csv');
const tam = csv('data_processed/tam_sam_som_model.csv');
const som = csv('data_processed/som_sensitivity_scenarios.csv');
const claims = csv('data_processed/market_claims.csv');
const top100 = csv('data_processed/top100_competitor_review_scorecard.csv');
const validationQueue = csv('data_processed/top100_human_validation_queue.csv');
const iap = csv('data_raw/app_store_iap_pricing_raw.csv');
const googlePlay = csv('data_raw/google_play_pricing_raw.csv');
const webPaywalls = csv('data_processed/web_paywall_signal_matrix.csv');
const screenshots = csv('data_processed/web_paywall_screenshot_validation.csv');
const screenshotInterpretation = csv('data_processed/web_paywall_screenshot_interpretation.csv');
const reviews = csv('data_raw/app_store_top_candidate_reviews.csv');
const reviewSignals = csv('data_processed/review_signal_matrix.csv');
const reviewClusters = csv('data_processed/review_jtbd_cluster_summary.csv');
const forumSources = csv('data_raw/forum_evidence_signals.csv');
const forumQuotes = csv('data_processed/forum_quote_coding_matrix.csv');
const productCore = csv('data_processed/product_core_evidence_matrix.csv');
const p0External = csv('data_raw/expanded/p0_external_sources_raw.csv');

const primary = top100.filter(row => row.duplicate_flag === 'primary_app_entry');
const highThreat = primary.filter(row => Number(row.competitive_threat_score || 0) >= 24);
const direct = primary.filter(row => row.competitive_verdict === 'direct_reference_competitor');
const behaviorTied = productCore.filter(row => row.behavior_tied_progression === 'yes');
const highWhitespace = whitespace.filter(row => row.whitespace_band === 'high');
const googleOk = googlePlay.filter(row => row.collection_status === 'ok');
const appsWithIap = new Set(iap.map(row => row.app_store_id).filter(Boolean)).size;
const webConfirmedPricing = screenshotInterpretation.filter(row => row.screenshot_interpretation_verdict === 'confirms_public_pricing_signal');
const webWeakens = screenshotInterpretation.filter(row => row.screenshot_interpretation_verdict === 'weakens_signal_not_found');
const p0 = validationQueue.filter(row => row.priority_band === 'P0_validate_first');
const p1 = validationQueue.filter(row => row.priority_band === 'P1_high');
const reviewApps = new Set(reviews.map(row => row.app_store_id).filter(Boolean)).size;
const forumSourceCount = new Set(forumQuotes.map(row => row.source_id).filter(Boolean)).size;
const intersection = tam.find(row => row.pillar === 'intersection') || {};
const p0ExternalUsable = p0External.filter(row => row.collection_status === 'ok');

const rows = [
  {
    claim_id: 'REQ_plan',
    claim_type: 'project_requirement',
    claim: 'A large expansion plan/backlog exists and routes the research into phased work.',
    evidence_status: 'proved_v1',
    confidence: 'high',
    primary_metric: 'master plan exists',
    quantitative_evidence: 'docs/research-expansion-master-plan.md',
    evidence_files: 'docs/research-expansion-master-plan.md;docs/strategy/research-phases.md;reports/expanded-research-kickoff-2026-05-31.md',
    strongest_support: 'Research expansion plan and phase docs exist in repository.',
    key_gap: 'Needs periodic refresh as validation findings change.',
    next_action: 'Update plan after human validation and prototype testing.'
  },
  {
    claim_id: 'REQ_competitor_universe',
    claim_type: 'project_requirement',
    claim: 'Competitor/source universe has been expanded across the five target markets.',
    evidence_status: 'substantial_v1_not_50k_dedup',
    confidence: 'medium_high',
    primary_metric: `${expanded.length} dedup rows; ${expandedRaw.length} raw expanded rows; ${p0ExternalUsable.length} usable P0 external smoke rows`,
    quantitative_evidence: `niches=${Object.keys(countBy(expanded, 'niche')).length}; source_kinds=${Object.keys(countBy(expanded, 'source_kind')).length}; p0_external_rows=${p0External.length}; p0_external_usable=${p0ExternalUsable.length}`,
    evidence_files: 'data_raw/expanded/all_expanded_raw.csv;data_raw/expanded/all_expanded_dedup.csv;data_raw/expanded/p0_external_sources_raw.csv;data_processed/p0_external_source_summary.csv;data_processed/competitor_feature_matrix.csv;docs/competitive/expanded-source-map.md;docs/competitive/p0-external-source-collection-v1.md',
    strongest_support: 'Large normalized universe exists across App Store, Steam, Google Play fallback, and web search rows; a controlled P0 external smoke pass added browser-extension candidates.',
    key_gap: 'Deduped universe is below the aspirational 30k-50k app target; P0 external pass is intentionally small, with Product Hunt/AlternativeTo still needing source-native or curated collection.',
    next_action: 'Detail-fetch usable Chrome Web Store candidates, then continue source expansion through curated/non-search-heavy directories, desktop apps, forums, Product Hunt exports/lists, and subreddit/wiki lists.'
  },
  {
    claim_id: 'H1_product_shape_exists',
    claim_type: 'product_hypothesis',
    claim: 'The proposed product shape exists as an intersection of meaning, daily action, reset, identity/avatar feedback, and progression.',
    evidence_status: 'partially_supported',
    confidence: 'medium',
    primary_metric: `${top100.length} top-candidate rows; ${primary.length} primary apps`,
    quantitative_evidence: `primary_apps=${primary.length}; high_threat=${highThreat.length}; direct_reference=${direct.length}; behavior_tied=${behaviorTied.length}`,
    evidence_files: 'data_processed/top100_competitor_review_scorecard.csv;docs/competitive/top100-competitor-review-v1.md;docs/product/product-core-evidence-v1.md',
    strongest_support: 'Top-100 scorecard shows many adjacent products combining several required primitives.',
    key_gap: 'Strict full loop is rare and needs manual product/onboarding validation.',
    next_action: 'Execute P0/P1 human validation queue and inspect app flows/screenshots.'
  },
  {
    claim_id: 'H2_markets_have_money',
    claim_type: 'product_hypothesis',
    claim: 'The five adjacent markets contain monetizable demand and paid behavior.',
    evidence_status: 'supported_with_ranges',
    confidence: 'medium',
    primary_metric: `intersection SAM base USD ${intersection.samBase || 'n/a'}`,
    quantitative_evidence: `market_claims=${claims.length}; SOM scenarios=${som.length}; App Store IAP rows=${iap.length}; Google Play IAP apps=${googleOk.filter(row => row.offers_iap === 'yes').length}`,
    evidence_files: 'data_processed/tam_sam_som_model.csv;data_processed/som_sensitivity_scenarios.csv;data_processed/market_claims.csv;data_raw/app_store_iap_pricing_raw.csv;data_raw/google_play_pricing_raw.csv;docs/market/tam-sam-som-model-v1.md',
    strongest_support: 'TAM/SAM/SOM model and observed IAP metadata show paid depth across adjacent categories.',
    key_gap: 'Market sizing is modeled from public claims and needs source-by-source confidence review.',
    next_action: 'Add more primary market research sources and update sensitivity ranges.'
  },
  {
    claim_id: 'H2_paywall_visible_evidence',
    claim_type: 'pricing_subclaim',
    claim: 'Some adjacent products expose public web paywall/pricing signals outside app stores.',
    evidence_status: 'supported_narrowly',
    confidence: 'medium_low',
    primary_metric: `${webConfirmedPricing.length}/${screenshotInterpretation.length} screenshots confirm visible public pricing`,
    quantitative_evidence: `web_domains=${webPaywalls.length}; screenshot_captured=${screenshots.filter(row => row.screenshot_status === 'captured').length}; weakens_signal=${webWeakens.length}`,
    evidence_files: 'data_processed/web_paywall_signal_matrix.csv;data_processed/web_paywall_screenshot_validation.csv;data_processed/web_paywall_screenshot_interpretation.csv;docs/competitive/web-paywall-screenshot-interpretation-v1.md;output/paywall_screenshots/*.png',
    strongest_support: 'Character.ai and Meditopia screenshots/OCR confirm visible price signals.',
    key_gap: 'Most web signals are ambiguous, not found, parent-company pages, or require human interpretation.',
    next_action: 'Human-review screenshot queue and classify confirm/partial/reject with notes.'
  },
  {
    claim_id: 'H3_whitespace_exists',
    claim_type: 'product_hypothesis',
    claim: 'There is a narrow whitespace around behavior-tied avatar/identity progression caused by a daily action.',
    evidence_status: 'narrow_supported_not_final',
    confidence: 'medium',
    primary_metric: `${behaviorTied.length}/100 strict behavior-tied progression signals`,
    quantitative_evidence: `high_whitespace=${highWhitespace.length}; medium_whitespace=${whitespace.filter(row => row.whitespace_band === 'medium').length}; low_whitespace=${whitespace.filter(row => row.whitespace_band === 'low').length}`,
    evidence_files: 'data_processed/whitespace_signal_matrix.csv;data_processed/product_core_evidence_matrix.csv;docs/intersections/whitespace-map-v2.md;docs/product/product-core-evidence-v1.md',
    strongest_support: 'Broad adjacent market is crowded, but strict behavior-tied avatar progression appears rare in current top-100 metadata.',
    key_gap: 'Metadata can under-detect in-app mechanics; manual app inspection may reveal more direct competitors.',
    next_action: 'Validate P0/P1 competitors for actual in-app progression mechanics.'
  },
  {
    claim_id: 'H4_competitive_advantage_plausible',
    claim_type: 'product_hypothesis',
    claim: 'A competitive advantage is plausible if Alina owns the integrated daily transformation loop rather than a generic feature.',
    evidence_status: 'plausible_unproven',
    confidence: 'medium_low',
    primary_metric: `${direct.length} direct reference competitor; ${highThreat.length} high-threat competitors`,
    quantitative_evidence: `P0_validation=${p0.length}; P1_validation=${p1.length}; human_confirmed=0`,
    evidence_files: 'data_processed/top100_competitor_review_scorecard.csv;data_processed/top100_human_validation_queue.csv;docs/competitive/human-validation-guide-v1.md;docs/strategy/value-proposition-v1.md',
    strongest_support: 'Scorecard separates close substitutes from the one current direct reference; strategy docs define differentiating loop.',
    key_gap: 'No human validation or prototype test yet proves users value the loop.',
    next_action: 'Run manual competitor validation and prototype the two-minute loop.'
  },
  {
    claim_id: 'H5_shared_audience_exists',
    claim_type: 'product_hypothesis',
    claim: 'A shared audience exists around digital rituals for identity, emotional regulation, self-improvement, and visible progress.',
    evidence_status: 'directionally_supported',
    confidence: 'medium',
    primary_metric: `${audience.length} audience signal rows`,
    quantitative_evidence: `reviews=${reviews.length}; review_apps=${reviewApps}; review_signals=${reviewSignals.length}; review_clusters=${reviewClusters.length}; forum_quote_rows=${forumQuotes.length}`,
    evidence_files: 'data_processed/audience_signal_matrix.csv;data_raw/app_store_top_candidate_reviews.csv;data_processed/review_signal_matrix.csv;data_processed/review_jtbd_cluster_summary.csv;data_processed/forum_quote_coding_matrix.csv;docs/audience/review-language-synthesis-v1.md;docs/audience/forum-quote-coding-v1.md',
    strongest_support: 'Reviews and forum snippets converge on daily anchors, visible progress, emotional support, pricing sensitivity, and safety boundaries.',
    key_gap: 'Keyword/OCR/forum coding needs human validation and real user interviews.',
    next_action: 'Human-validate quote coding and run target user interviews/prototype tests.'
  },
  {
    claim_id: 'H6_product_core_defined',
    claim_type: 'product_hypothesis',
    claim: 'The MVP product core can be defined as personal meaning -> one daily action -> short reset -> avatar/identity feedback -> visible progression -> next-day hook.',
    evidence_status: 'supported_for_mvp_framing',
    confidence: 'medium',
    primary_metric: `${feature.length} feature matrix rows; ${productCore.length} product-core rows`,
    quantitative_evidence: `retention_tags=${Object.keys(countBy(csv('data_processed/pricing_retention_matrix.csv'), 'retention_tags')).length}; product_core_rows=${productCore.length}`,
    evidence_files: 'data_processed/product_core_evidence_matrix.csv;docs/product/product-core-evidence-v1.md;docs/strategy/user-flow-v1.md;docs/strategy/avatar-loop-spec.md',
    strongest_support: 'Product-core matrix and strategy docs converge on a testable MVP loop.',
    key_gap: 'No user prototype evidence yet confirms comprehension, emotional value, or retention impact.',
    next_action: 'Build/validate prototype and measure loop completion, comprehension, and willingness to return.'
  },
  {
    claim_id: 'REQ_final_artifacts_versioned',
    claim_type: 'project_requirement',
    claim: 'Research artifacts are saved locally, rendered into PDFs, and versioned in GitHub.',
    evidence_status: 'proved_active',
    confidence: 'high',
    primary_metric: 'current branch pushed through latest commit',
    quantitative_evidence: 'PDFs rendered; report/status/docs/data committed',
    evidence_files: 'output/pdf/alina-evidence-first-report-draft.pdf;output/pdf/alina-evidence-visual-report-v1.pdf;reports/evidence-status-2026-05-31.md;git log',
    strongest_support: 'Artifacts exist in repo and commits have been pushed after each major layer.',
    key_gap: 'Final polished investor/user-facing PDF is still draft-level, not final designed publication.',
    next_action: 'After human validation, produce final polished PDF and archive data provenance.'
  }
];

writeCsv(OUT, rows, [
  'claim_id', 'claim_type', 'claim', 'evidence_status', 'confidence',
  'primary_metric', 'quantitative_evidence', 'evidence_files',
  'strongest_support', 'key_gap', 'next_action'
]);

const lines = [];
lines.push('# Evidence Audit V1');
lines.push('');
lines.push(`Generated: ${new Date().toISOString()}`);
lines.push('');
lines.push('## Purpose');
lines.push('');
lines.push('This register turns the large research corpus into an auditable claim map. Each row states what is currently proved, what is only directional, what evidence files support it, and what remains to validate.');
lines.push('');
lines.push('## Status Mix');
lines.push('');
lines.push(bulletCounts(countBy(rows, 'evidence_status')));
lines.push('');
lines.push('## Confidence Mix');
lines.push('');
lines.push(bulletCounts(countBy(rows, 'confidence')));
lines.push('');
lines.push('## Claim Register');
lines.push('');
lines.push('| Claim ID | Status | Confidence | Primary Metric | Key Gap |');
lines.push('| --- | --- | --- | --- | --- |');
for (const row of rows) {
  lines.push(`| ${row.claim_id} | ${row.evidence_status} | ${row.confidence} | ${clean(row.primary_metric).replace(/\|/g, '/')} | ${clean(row.key_gap).replace(/\|/g, '/')} |`);
}
lines.push('');
lines.push('## Audit Read');
lines.push('');
lines.push('- Strongest proved project layers: plan/backlog, TAM/SAM/SOM v1, matrices, saved artifacts, PDF rendering, and GitHub versioning.');
lines.push('- Strongest product evidence: adjacent markets are monetized; the user language around daily ritual/progress is real; strict behavior-tied avatar progression remains narrow in current metadata.');
lines.push('- Weakest remaining proof: human validation of competitors, actual in-app paywall/onboarding flows, real user prototype response, and final source-by-source market sizing review.');
lines.push('- Current decision should remain conditional-go for validation, not full product-build go.');
lines.push('');
lines.push('## Files');
lines.push('');
lines.push(`- \`${OUT}\``);
fs.writeFileSync(OUT_DOC, `${lines.join('\n')}\n`);

console.log(`register=${OUT}`);
console.log(`doc=${OUT_DOC}`);
console.log(`claims=${rows.length}`);
