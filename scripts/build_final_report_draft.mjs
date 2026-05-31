import fs from 'fs';

const OUT = 'reports/alina-evidence-first-report-draft.md';
const STATUS_OUT = 'reports/evidence-status-2026-05-31.md';

for (const dir of ['reports']) fs.mkdirSync(dir, { recursive: true });

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
  return rows.filter(r => r.length === header.length).map(r => Object.fromEntries(header.map((h, i) => [h, r[i] || ''])));
}

function read(file) {
  return fs.existsSync(file) ? fs.readFileSync(file, 'utf8') : '';
}

function csv(file) {
  return parseCsv(read(file));
}

function clean(value) {
  return String(value ?? '').replace(/\s+/g, ' ').trim();
}

function countBy(rows, key) {
  const out = {};
  for (const row of rows) out[row[key] || 'unknown'] = (out[row[key] || 'unknown'] || 0) + 1;
  return out;
}

function mdTable(rows, columns, limit = rows.length) {
  const limited = rows.slice(0, limit);
  const header = `| ${columns.map(c => c.label).join(' | ')} |`;
  const sep = `| ${columns.map(c => c.align === 'right' ? '---:' : '---').join(' | ')} |`;
  const body = limited.map(row => `| ${columns.map(c => clean(row[c.key]).replace(/\|/g, '/')).join(' | ')} |`);
  return [header, sep, ...body].join('\n');
}

function bulletCounts(counts) {
  return Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .map(([k, v]) => `- ${k}: ${v}`)
    .join('\n');
}

const expanded = csv('data_raw/expanded/all_expanded_dedup.csv');
const feature = csv('data_processed/competitor_feature_matrix.csv');
const audience = csv('data_processed/audience_signal_matrix.csv');
const whitespace = csv('data_processed/whitespace_signal_matrix.csv');
const tam = csv('data_processed/tam_sam_som_model.csv');
const som = csv('data_processed/som_sensitivity_scenarios.csv');
const claims = csv('data_processed/market_claims.csv');
const prefill = csv('data_processed/top_intersection_review_prefill.csv');
const pricing = csv('data_processed/pricing_retention_matrix.csv');
const core = csv('data_processed/product_core_evidence_matrix.csv');
const reviewSignals = csv('data_processed/review_signal_matrix.csv');
const rawReviews = csv('data_raw/app_store_top_candidate_reviews.csv');
const reviewClusters = csv('data_processed/review_jtbd_cluster_summary.csv');
const forumSignals = csv('data_raw/forum_evidence_signals.csv');
const forumQuoteCoding = csv('data_processed/forum_quote_coding_matrix.csv');
const top100Review = csv('data_processed/top100_competitor_review_scorecard.csv');
const humanValidationQueue = csv('data_processed/top100_human_validation_queue.csv');
const iapRaw = csv('data_raw/app_store_iap_pricing_raw.csv');
const iapSummary = csv('data_processed/app_store_iap_pricing_summary.csv');
const googlePlayPricing = csv('data_raw/google_play_pricing_raw.csv');
const googlePlayPricingSummary = csv('data_processed/google_play_pricing_summary.csv');
const webPaywallRaw = csv('data_raw/web_paywall_discovery_raw.csv');
const webPaywallSignals = csv('data_processed/web_paywall_signal_matrix.csv');
const webPaywallScreenshots = csv('data_processed/web_paywall_screenshot_validation.csv');
const webPaywallScreenshotInterpretation = csv('data_processed/web_paywall_screenshot_interpretation.csv');
const evidenceAudit = csv('data_processed/evidence_claim_register.csv');
const sourceExpansionBacklog = csv('data_processed/source_expansion_backlog.csv');
const p0ExternalSources = csv('data_raw/expanded/p0_external_sources_raw.csv');
const p0ExternalSummary = csv('data_processed/p0_external_source_summary.csv');

const highWhitespace = whitespace.filter(r => r.whitespace_band === 'high').length;
const mediumWhitespace = whitespace.filter(r => r.whitespace_band === 'medium').length;
const lowWhitespace = whitespace.filter(r => r.whitespace_band === 'low').length;
const veryClose = core.filter(r => r.alina_closeness === 'very_close').length;
const close = core.filter(r => r.alina_closeness === 'close').length;
const behaviorTied = core.filter(r => r.behavior_tied_progression === 'yes').length;
const baseIntersection = tam.find(r => r.pillar === 'intersection') || {};
const reviewApps = new Set(rawReviews.map(r => r.app_store_id).filter(Boolean)).size;
const ratingMix = countBy(rawReviews, 'rating');
const reviewSignalCounts = countBy(reviewSignals, 'signal');
const primaryCompetitors = top100Review.filter(r => r.duplicate_flag === 'primary_app_entry');
const highThreatCompetitors = primaryCompetitors.filter(r => Number(r.competitive_threat_score) >= 24);
const directReferenceCompetitors = primaryCompetitors.filter(r => r.competitive_verdict === 'direct_reference_competitor');
const p0HumanValidation = humanValidationQueue.filter(r => r.priority_band === 'P0_validate_first');
const p1HumanValidation = humanValidationQueue.filter(r => r.priority_band === 'P1_high');
const appsWithIap = new Set(iapRaw.map(r => r.app_store_id).filter(Boolean)).size;
const iapPrices = iapRaw.map(r => Number(r.price_usd)).filter(Number.isFinite);
const googlePlayOk = googlePlayPricing.filter(r => r.collection_status === 'ok');
const webPaywallScreenshotQueue = webPaywallSignals.filter(r => r.needs_screenshot_validation === 'yes');
const webPaywallCapturedScreenshots = webPaywallScreenshots.filter(r => r.screenshot_status === 'captured');
const confirmedPublicPricingScreenshots = webPaywallScreenshotInterpretation.filter(r => r.screenshot_interpretation_verdict === 'confirms_public_pricing_signal');
const p0ExternalUsable = p0ExternalSources.filter(r => r.collection_status === 'ok');

const report = [];

report.push('# Alina Evidence-First Research Report Draft');
report.push('');
report.push(`Generated: ${new Date().toISOString()}`);
report.push('');
report.push('## 1. Executive Summary');
report.push('');
report.push('Alina is a proposed daily companion app combining personal meaning, identity reinforcement, coaching/action, short reset practices, and game-like progression. The research now supports a more precise opportunity statement: adjacent markets and partial substitutes are real, but the under-owned space appears to be the causal loop where completing a daily action visibly changes an identity/avatar feedback object.');
report.push('');
report.push('Current evidence verdict: **continue research / conditional go**. The market existence signal is strong enough to keep going; the remaining proof burden is competitor manual review, detailed pricing/paywall extraction, forum evidence beyond App Store reviews, and user validation of the avatar-progress mechanic.');
report.push('');
report.push('Key quantified signals:');
report.push('');
report.push(`- Expanded competitor universe: ${expanded.length} deduplicated rows from ${Object.keys(countBy(expanded, 'source_kind')).length} source kinds.`);
report.push(`- Audience signal rows: ${audience.length}.`);
report.push(`- High whitespace candidates: ${highWhitespace}; medium: ${mediumWhitespace}; low: ${lowWhitespace}.`);
report.push(`- Top-100 intersection candidates enriched from App Store metadata: ${prefill.length}/100.`);
report.push(`- AI-assisted top-100 competitor review: ${top100Review.length} rows, ${primaryCompetitors.length} unique primary apps, ${highThreatCompetitors.length} high-threat apps, ${directReferenceCompetitors.length} direct reference competitor.`);
report.push(`- Human validation packet: ${humanValidationQueue.length} primary apps queued; ${p0HumanValidation.length} P0 and ${p1HumanValidation.length} P1 validation targets.`);
report.push(`- App Store IAP pricing layer: ${iapRaw.length} observed purchase rows across ${appsWithIap} apps; observed price range ${iapPrices.length ? `$${Math.min(...iapPrices).toFixed(2)}-$${Math.max(...iapPrices).toFixed(2)}` : 'n/a'}.`);
report.push(`- Google Play pricing validation: ${googlePlayOk.length}/${googlePlayPricing.length} successful Android lookups; ${googlePlayOk.filter(r => r.offers_iap === 'yes').length} apps offer IAP.`);
report.push(`- Developer website paywall discovery: ${webPaywallRaw.length} fetched URL rows across ${webPaywallSignals.length} app/domain rows; ${webPaywallScreenshotQueue.length} domains queued for screenshot validation.`);
report.push(`- Web paywall screenshot capture: ${webPaywallCapturedScreenshots.length}/${webPaywallScreenshots.length} queued screenshots captured for manual interpretation.`);
report.push(`- Web paywall OCR interpretation: ${webPaywallScreenshotInterpretation.length} screenshots interpreted; ${confirmedPublicPricingScreenshots.length} currently confirm visible public pricing, while the rest need human review or weaken the signal.`);
report.push(`- Evidence audit register: ${evidenceAudit.length} claim rows mapping hypotheses/requirements to proof status, confidence, gaps, and next actions.`);
report.push(`- Source expansion backlog: ${sourceExpansionBacklog.length} prioritized collector/source tasks for the next move toward a 30k-50k raw universe.`);
report.push(`- Controlled P0 external-source smoke pass: ${p0ExternalSources.length} rows, ${p0ExternalUsable.length} usable candidates, with search-engine-heavy expansion intentionally deferred.`);
report.push(`- Strict behavior-tied avatar progression signal in top-100: ${behaviorTied}/100.`);
report.push(`- App Store review-language layer: ${rawReviews.length} reviews from ${reviewApps} top-candidate apps, mapped into ${reviewSignals.length} signal rows.`);
report.push(`- Review JTBD/pain clusters: ${reviewClusters.length} themes; top cluster is "${reviewClusters[0]?.cluster_label || 'n/a'}" with ${reviewClusters[0]?.review_rows || 'n/a'} rows.`);
report.push(`- Forum/source evidence map: ${forumSignals.length} qualitative rows across ${Object.keys(countBy(forumSignals, 'market')).length} market pillars.`);
report.push(`- Forum quote coding layer: ${forumQuoteCoding.length} snippet rows across ${new Set(forumQuoteCoding.map(r => r.source_id)).size} sources.`);
report.push('- Draft visual chart pack: whitespace bands, review clusters, SAM by pillar, SOM scenarios, forum source coverage, top-100 competitor verdicts, IAP price bands, Android pricing models, web paywall discovery, and forum quote coding.');
report.push('- Visual PDF companion: native ReportLab charts embedded in a separate visual report.');
report.push(`- Modeled direct intersection SAM base: USD ${baseIntersection.samBase || 'n/a'}.`);
report.push('');
report.push('## 2. Product Hypotheses');
report.push('');
report.push(mdTable([
  { id: 'H1', hypothesis: 'Product shape exists', status: 'partially supported', evidence: 'Adjacent apps combine several pillars; top-100 shows meaning/action/reset/progress language.' },
  { id: 'H2', hypothesis: 'Markets have money', status: 'supported with ranges', evidence: `TAM/SAM/SOM model and ${claims.length} market claims across gaming, astrology, avatar, coaching, mindfulness.` },
  { id: 'H3', hypothesis: 'Whitespace exists', status: 'narrowed', evidence: 'Broad space is crowded; strict behavior-tied avatar progression appears rare in top-100 metadata.' },
  { id: 'H4', hypothesis: 'Competitive advantage is plausible', status: 'unproven but sharpened', evidence: 'Moat candidate is integrated daily transformation loop, not any single feature.' },
  { id: 'H5', hypothesis: 'Shared audience exists', status: 'directionally supported', evidence: `Audience matrix plus ${reviewSignals.length} review-language signals point to digital ritual users across spirituality, identity, self-improvement, calm, and cozy progress.` },
  { id: 'H6', hypothesis: 'Product core can be defined', status: 'supported for MVP framing', evidence: 'Product-core evidence defines target loop and MVP testable claim.' }
], [
  { key: 'id', label: 'ID' },
  { key: 'hypothesis', label: 'Hypothesis' },
  { key: 'status', label: 'Status' },
  { key: 'evidence', label: 'Evidence' }
]));
report.push('');
if (evidenceAudit.length) {
  report.push('## 2B. Evidence Audit Register');
  report.push('');
  report.push('The project now has a claim-level audit register. This conservative layer separates proved project infrastructure from directional product evidence, and it names remaining validation burden explicitly.');
  report.push('');
  report.push('Evidence status mix:');
  report.push('');
  report.push(bulletCounts(countBy(evidenceAudit, 'evidence_status')));
  report.push('');
  report.push('Claim-level audit snapshot:');
  report.push('');
  report.push(mdTable(evidenceAudit, [
    { key: 'claim_id', label: 'Claim' },
    { key: 'evidence_status', label: 'Status' },
    { key: 'confidence', label: 'Confidence' },
    { key: 'primary_metric', label: 'Primary Metric' },
    { key: 'key_gap', label: 'Key Gap' }
  ], evidenceAudit.length));
  report.push('');
}
report.push('## 3. Dataset Overview');
report.push('');
report.push('### Expanded Rows by Niche');
report.push('');
report.push(bulletCounts(countBy(expanded, 'niche')));
report.push('');
report.push('### Expanded Rows by Source Kind');
report.push('');
report.push(bulletCounts(countBy(expanded, 'source_kind')));
report.push('');
if (sourceExpansionBacklog.length) {
  report.push('### Next Source Expansion Backlog');
  report.push('');
  report.push('The next collector wave is now prioritized so expansion beyond the current universe is concrete rather than generic. P0 focuses on Product Hunt, AlternativeTo, and Chrome Web Store/browser extensions to reduce app-store bias.');
  report.push('');
  report.push('Backlog priority mix:');
  report.push('');
  report.push(bulletCounts(countBy(sourceExpansionBacklog, 'priority')));
  report.push('');
  report.push(mdTable(sourceExpansionBacklog, [
    { key: 'backlog_id', label: 'ID' },
    { key: 'priority', label: 'Priority' },
    { key: 'source_bucket', label: 'Source' },
    { key: 'expected_raw_rows', label: 'Expected Rows' },
    { key: 'target_output', label: 'Output' }
  ], sourceExpansionBacklog.length));
  report.push('');
}
if (p0ExternalSources.length) {
  report.push('### Controlled P0 External Source Smoke Pass');
  report.push('');
  report.push('A small P0 pass was run to test external discovery beyond mobile stores without turning the research into a broad search-engine crawl. Chrome Web Store produced usable browser-extension candidates; Product Hunt and AlternativeTo attempts are retained as empty-attempt evidence and should be revisited through source-native or curated methods.');
  report.push('');
  report.push(mdTable(p0ExternalSummary, [
    { key: 'source_bucket', label: 'Source' },
    { key: 'raw_rows', label: 'Raw Rows', align: 'right' },
    { key: 'usable_rows', label: 'Usable', align: 'right' },
    { key: 'empty_or_error_rows', label: 'Empty/Error', align: 'right' },
    { key: 'markets', label: 'Markets' },
    { key: 'top_examples', label: 'Examples' }
  ], p0ExternalSummary.length));
  report.push('');
}
report.push('## 4. Market Sizing');
report.push('');
report.push('The model intentionally avoids adding five TAMs together. Gaming is treated primarily as a mechanic benchmark; direct SAM is modeled from discounted adjacent consumer app markets.');
report.push('');
report.push(mdTable(tam, [
  { key: 'pillar', label: 'Pillar' },
  { key: 'tamLow', label: 'TAM Low', align: 'right' },
  { key: 'tamBase', label: 'TAM Base', align: 'right' },
  { key: 'tamHigh', label: 'TAM High', align: 'right' },
  { key: 'samLow', label: 'SAM Low', align: 'right' },
  { key: 'samBase', label: 'SAM Base', align: 'right' },
  { key: 'samHigh', label: 'SAM High', align: 'right' },
  { key: 'confidence', label: 'Confidence' }
]));
report.push('');
report.push('### SOM Sensitivity');
report.push('');
report.push(mdTable(som, [
  { key: 'scenario', label: 'Scenario' },
  { key: 'reachableUsers', label: 'Reachable Users', align: 'right' },
  { key: 'activationRate', label: 'Activation', align: 'right' },
  { key: 'paidConversion', label: 'Paid Conversion', align: 'right' },
  { key: 'arppuYear', label: 'ARPPU/year', align: 'right' },
  { key: 'annualRevenue', label: 'Annual Revenue', align: 'right' }
]));
report.push('');
report.push('## 5. Competitive Landscape');
report.push('');
report.push('### Top-100 Archetype Mix');
report.push('');
report.push(bulletCounts(countBy(prefill, 'archetype')));
report.push('');
report.push('### Pricing Signals');
report.push('');
const pricingTags = {};
for (const row of pricing) for (const tag of String(row.pricing_tags || '').split('|').filter(Boolean)) pricingTags[tag] = (pricingTags[tag] || 0) + 1;
report.push(bulletCounts(pricingTags));
report.push('');
if (iapRaw.length) {
  report.push('### Observed App Store IAP Pricing');
  report.push('');
  report.push(`Public App Store pages exposed ${iapRaw.length} in-app purchase rows across ${appsWithIap} top-candidate apps. This is observed webpage pricing, not guaranteed complete backend IAP catalog data.`);
  report.push('');
  report.push('Observed price bands:');
  report.push('');
  report.push(bulletCounts(countBy(iapRaw, 'price_band')));
  report.push('');
  const iapTagCounts = {};
  for (const row of iapRaw) for (const tag of String(row.product_tags || '').split('|').filter(Boolean)) iapTagCounts[tag] = (iapTagCounts[tag] || 0) + 1;
  report.push('Observed IAP product tags:');
  report.push('');
  report.push(bulletCounts(iapTagCounts));
  report.push('');
  report.push('Highest observed IAP ceilings:');
  report.push('');
  report.push(mdTable([...iapSummary]
    .filter(r => Number(r.iap_count) > 0)
    .sort((a, b) => Number(b.max_price_usd) - Number(a.max_price_usd))
    .slice(0, 8), [
      { key: 'app_name', label: 'App' },
      { key: 'iap_count', label: 'IAP Rows', align: 'right' },
      { key: 'min_price_usd', label: 'Min', align: 'right' },
      { key: 'max_price_usd', label: 'Max', align: 'right' },
      { key: 'product_tags', label: 'Product Tags' }
    ], 8));
  report.push('');
}
if (googlePlayPricing.length) {
  report.push('### Google Play Pricing Validation');
  report.push('');
  report.push(`Google Play metadata was collected for ${googlePlayPricing.length} Android package rows across the five market pillars. Successful lookups: ${googlePlayOk.length}. Apps offering IAP: ${googlePlayOk.filter(r => r.offers_iap === 'yes').length}; ad-supported apps: ${googlePlayOk.filter(r => r.ad_supported === 'yes').length}; paid download apps: ${googlePlayOk.filter(r => r.free === 'no').length}.`);
  report.push('');
  report.push('Android pricing model counts:');
  report.push('');
  report.push(bulletCounts(countBy(googlePlayOk, 'pricing_model')));
  report.push('');
  report.push('Android pricing summary by market:');
  report.push('');
  report.push(mdTable(googlePlayPricingSummary, [
    { key: 'niche', label: 'Market' },
    { key: 'successful_rows', label: 'OK', align: 'right' },
    { key: 'free_download_apps', label: 'Free', align: 'right' },
    { key: 'paid_download_apps', label: 'Paid', align: 'right' },
    { key: 'offers_iap_apps', label: 'IAP', align: 'right' },
    { key: 'ad_supported_apps', label: 'Ads', align: 'right' },
    { key: 'apps_with_developer_website', label: 'Dev Website', align: 'right' }
  ], googlePlayPricingSummary.length));
  report.push('');
}
if (webPaywallSignals.length) {
  report.push('### Developer Website Paywall Discovery');
  report.push('');
  report.push(`A first web-paywall discovery pass fetched ${webPaywallRaw.length} public URL rows from developer websites in Google Play metadata and aggregated them into ${webPaywallSignals.length} app/domain rows. This layer detects visible pricing, subscription, trial, checkout, premium, and upgrade language. It is a prioritization queue, not a substitute for screenshots or in-app paywall testing.`);
  report.push('');
  report.push('Website paywall signal strength:');
  report.push('');
  report.push(bulletCounts(countBy(webPaywallSignals, 'strongest_signal')));
  report.push('');
  report.push(`Screenshot validation queue: ${webPaywallScreenshotQueue.length} domains with medium/high public pricing or paywall language.`);
  report.push('');
  report.push(mdTable(webPaywallScreenshotQueue.slice(0, 12), [
    { key: 'app_name', label: 'App' },
    { key: 'niche', label: 'Market' },
    { key: 'strongest_signal', label: 'Signal' },
    { key: 'best_url', label: 'Best URL' },
    { key: 'detected_price_points', label: 'Detected Prices' }
  ], 12));
  report.push('');
}
if (webPaywallScreenshots.length) {
  report.push('### Web Paywall Screenshot Evidence');
  report.push('');
  report.push(`Headless Chrome captured ${webPaywallCapturedScreenshots.length}/${webPaywallScreenshots.length} screenshots from the web-paywall queue. These PNGs are visual evidence for manual interpretation; a captured page may confirm, weaken, or reject the original paywall signal.`);
  report.push('');
  report.push('Screenshot capture status:');
  report.push('');
  report.push(bulletCounts(countBy(webPaywallScreenshots, 'screenshot_status')));
  report.push('');
  report.push('Captured screenshots by market:');
  report.push('');
  report.push(bulletCounts(countBy(webPaywallCapturedScreenshots, 'niche')));
  report.push('');
  report.push('Highest-priority screenshot evidence:');
  report.push('');
  report.push(mdTable(webPaywallScreenshots.slice(0, 12), [
    { key: 'capture_rank', label: 'Rank', align: 'right' },
    { key: 'app_name', label: 'App' },
    { key: 'niche', label: 'Market' },
    { key: 'strongest_signal', label: 'Signal' },
    { key: 'screenshot_status', label: 'Status' },
    { key: 'screenshot_path', label: 'Screenshot' }
  ], 12));
  report.push('');
}
if (webPaywallScreenshotInterpretation.length) {
  report.push('### Web Paywall Screenshot OCR Interpretation');
  report.push('');
  report.push(`OCR interpretation was run for ${webPaywallScreenshotInterpretation.length} captured screenshots. This conservative layer separates visible public pricing from ambiguous pages, login gates, and not-found pages; it still requires human review before final claims.`);
  report.push('');
  report.push('Screenshot interpretation verdicts:');
  report.push('');
  report.push(bulletCounts(countBy(webPaywallScreenshotInterpretation, 'screenshot_interpretation_verdict')));
  report.push('');
  report.push('Strongest confirmed/weakening examples:');
  report.push('');
  report.push(mdTable(webPaywallScreenshotInterpretation
    .filter(r => ['confirms_public_pricing_signal', 'weakens_signal_not_found', 'needs_manual_review_high_signal_no_visible_price'].includes(r.screenshot_interpretation_verdict))
    .slice(0, 12), [
      { key: 'capture_rank', label: 'Rank', align: 'right' },
      { key: 'app_name', label: 'App' },
      { key: 'strongest_signal', label: 'Original Signal' },
      { key: 'screenshot_interpretation_verdict', label: 'OCR Verdict' },
      { key: 'ocr_detected_prices', label: 'OCR Prices' },
      { key: 'screenshot_path', label: 'Screenshot' }
    ], 12));
  report.push('');
}
report.push('### Retention Signals');
report.push('');
const retentionTags = {};
for (const row of pricing) for (const tag of String(row.retention_tags || '').split('|').filter(Boolean)) retentionTags[tag] = (retentionTags[tag] || 0) + 1;
report.push(bulletCounts(retentionTags));
report.push('');
if (top100Review.length) {
  report.push('### AI-Assisted Top-100 Competitor Review');
  report.push('');
  report.push(`The top-100 candidate set now has an AI-assisted scorecard that combines App Store metadata, product-core scoring, pricing/retention tags, review-language signals, and JTBD/pain clusters. This is a strong triage layer but still needs human product validation before final claims.`);
  report.push('');
  report.push(`Coverage: ${top100Review.length} rows, ${primaryCompetitors.length} unique primary apps, ${top100Review.length - primaryCompetitors.length} duplicate app entries, ${primaryCompetitors.filter(r => Number(r.review_signal_rows) > 0).length} unique apps with public review signals.`);
  report.push('');
  report.push('Competitor verdict counts:');
  report.push('');
  report.push(bulletCounts(countBy(top100Review, 'competitive_verdict')));
  report.push('');
  report.push('Highest-threat primary competitors:');
  report.push('');
  report.push(mdTable([...primaryCompetitors]
    .sort((a, b) => Number(b.competitive_threat_score) - Number(a.competitive_threat_score))
    .slice(0, 10), [
      { key: 'review_rank', label: 'Rank', align: 'right' },
      { key: 'app_name', label: 'App' },
      { key: 'competitive_threat_score', label: 'Threat', align: 'right' },
      { key: 'competitive_verdict', label: 'Verdict' },
      { key: 'alina_core_score', label: 'Core', align: 'right' },
      { key: 'behavior_tied_progression', label: 'Behavior Progression' }
    ], 10));
  report.push('');
  report.push('Competitive interpretation: the field is full of close substitutes, but only one direct reference competitor currently shows strict behavior-tied avatar/identity progression. That keeps the whitespace narrow but real.');
  report.push('');
}
if (humanValidationQueue.length) {
  report.push('### Human Validation Queue');
  report.push('');
  report.push(`The AI-assisted top-100 review now has a ranked human validation queue covering ${humanValidationQueue.length} primary app entries. P0/P1 apps should be manually checked before external-facing claims are treated as confirmed.`);
  report.push('');
  report.push('Validation priority bands:');
  report.push('');
  report.push(bulletCounts(countBy(humanValidationQueue, 'priority_band')));
  report.push('');
  report.push('P0 validation targets:');
  report.push('');
  report.push(mdTable(p0HumanValidation.slice(0, 12), [
    { key: 'validation_rank', label: 'Rank', align: 'right' },
    { key: 'app_name', label: 'App' },
    { key: 'competitive_verdict', label: 'Verdict' },
    { key: 'validation_priority_score', label: 'Priority', align: 'right' },
    { key: 'behavior_tied_progression_claim', label: 'Behavior Claim' },
    { key: 'manual_checks', label: 'Manual Checks' }
  ], 12));
  report.push('');
}
report.push('## 6. Whitespace Analysis');
report.push('');
report.push('Broad whitespace is weak: the market already has many products that combine meaning, habits, AI, mindfulness, and identity language. Narrow whitespace is stronger: top-100 metadata shows only one strict signal of behavior-tied avatar progression.');
report.push('');
report.push('### Product Core Signals in Top-100');
report.push('');
const coreSignals = [
  { element: 'Personal meaning', count: core.filter(r => r.personal_meaning === 'yes').length },
  { element: 'One daily action', count: core.filter(r => r.one_daily_action === 'yes').length },
  { element: 'Short reset', count: core.filter(r => r.short_reset === 'yes').length },
  { element: 'Avatar or identity', count: core.filter(r => r.avatar_or_identity === 'yes').length },
  { element: 'Behavior-tied progression', count: behaviorTied },
  { element: 'Next-day hook', count: core.filter(r => r.next_day_hook === 'yes').length }
];
report.push(mdTable(coreSignals.map(r => ({ ...r, denominator: '100' })), [
  { key: 'element', label: 'Core Element' },
  { key: 'count', label: 'Detected', align: 'right' },
  { key: 'denominator', label: 'Out Of', align: 'right' }
]));
report.push('');
report.push('## 7. Audience Segmentation');
report.push('');
report.push('The strongest shared-audience hypothesis is not "people who use all five app categories." It is people who already use digital rituals to regulate identity and emotion.');
report.push('');
report.push('Audience signal counts:');
report.push('');
report.push(bulletCounts(countBy(audience, 'audience_tag')));
report.push('');
report.push('### App Store Review Language');
report.push('');
report.push(`Recent public App Store reviews were collected for top intersection candidates. Coverage is ${rawReviews.length} deduplicated reviews across ${reviewApps} apps, converted into keyword-based signal rows. This is not final sentiment modeling, but it is useful evidence for user language, delight, objections, and churn risk.`);
report.push('');
report.push('Review rating mix:');
report.push('');
report.push(bulletCounts(ratingMix));
report.push('');
report.push('Review signal counts:');
report.push('');
report.push(bulletCounts(reviewSignalCounts));
report.push('');
report.push('Interpretation: users respond strongly to daily ritual loops, emotional support, and visible progress/identity mechanics; recurring objections cluster around content depth, subscription value, bugs, trust/accuracy, and safety/privacy.');
report.push('');
report.push('### JTBD and Pain Clusters from Reviews');
report.push('');
report.push(mdTable(reviewClusters.slice(0, 8), [
  { key: 'cluster_label', label: 'Cluster' },
  { key: 'cluster_type', label: 'Type' },
  { key: 'review_rows', label: 'Rows', align: 'right' },
  { key: 'app_count', label: 'Apps', align: 'right' },
  { key: 'avg_rating', label: 'Avg Rating', align: 'right' },
  { key: 'product_implication', label: 'Product Implication' }
], 8));
report.push('');
report.push('The strongest product read: Alina should start as one daily ritual that turns personal meaning into one concrete action, then makes the effort visible through progress/avatar feedback. The strongest risk read: subscription gates, broken streak/reward mechanics, vague content, and unsafe overclaiming can destroy trust quickly.');
report.push('');
report.push('### Forum and External Discussion Signals');
report.push('');
report.push(`A first public forum/source map adds ${forumSignals.length} qualitative rows. These sources are not representative survey data, but they help triangulate language and objections outside app-store reviews.`);
report.push('');
report.push('Forum signals by market:');
report.push('');
report.push(bulletCounts(countBy(forumSignals, 'market')));
report.push('');
report.push('Forum signals by type:');
report.push('');
report.push(bulletCounts(countBy(forumSignals, 'signal_type')));
report.push('');
if (forumQuoteCoding.length) {
  report.push('Forum quote coding tags:');
  report.push('');
  const forumQuoteTagCounts = {};
  for (const row of forumQuoteCoding) {
    for (const tag of String(row.coding_tags || '').split('|').filter(Boolean)) {
      forumQuoteTagCounts[tag] = (forumQuoteTagCounts[tag] || 0) + 1;
    }
  }
  report.push(bulletCounts(forumQuoteTagCounts));
  report.push('');
}
report.push('Cross-source read: daily anchors and visible progress are attractive, but users push back against generic guidance, hard paywalls, strict streak punishment, noisy gamification, and spiritual/AI overclaiming.');
report.push('');
report.push('## 8. Product Core');
report.push('');
report.push('Target loop: personal meaning -> one daily action -> short reset -> avatar/identity feedback -> visible progression -> next-day hook.');
report.push('');
report.push('MVP testable claim: users should understand and complete the full daily loop in under two minutes, then report that the avatar/progress cue makes the action feel more personally meaningful.');
report.push('');
report.push('## 9. Risk Register');
report.push('');
report.push(mdTable([
  { risk: 'Fragmentation', severity: 'high', mitigation: 'Force one daily flow; avoid separate feature tabs as MVP core.' },
  { risk: 'Avatar novelty churn', severity: 'high', mitigation: 'Tie avatar changes to completed actions and progress, not one-off image generation.' },
  { risk: 'Astrology trust/overclaiming', severity: 'high', mitigation: 'Use soft framing, confidence labels, and avoid deterministic claims.' },
  { risk: 'AI hallucination in guidance', severity: 'high', mitigation: 'Constrain advice to low-stakes coaching prompts and clear disclaimers.' },
  { risk: 'Subscription fatigue', severity: 'medium', mitigation: 'Keep daily loop free; monetize depth/personal analysis/advanced progress.' },
  { risk: 'Crowded adjacent markets', severity: 'medium', mitigation: 'Position around integrated transformation loop, not generic astrology/mindfulness/avatar.' }
], [
  { key: 'risk', label: 'Risk' },
  { key: 'severity', label: 'Severity' },
  { key: 'mitigation', label: 'Mitigation' }
]));
report.push('');
report.push('## 10. Go/No-Go Status');
report.push('');
report.push('Current status: conditional go for continued validation, not yet go for full product build.');
report.push('');
report.push('Go signals present:');
report.push('');
report.push('- Adjacent markets have meaningful revenue pools.');
report.push('- Users are already trained on daily loops, streaks, reflection, and spiritual/personalized guidance.');
report.push('- Top-100 evidence suggests avatar/identity is common but behavior-tied avatar progression is rare.');
report.push('- AI-assisted competitor review found many close substitutes but only one direct reference competitor under the strict behavior-tied progression criterion.');
report.push('- Review language confirms user pull toward daily support, emotional regulation, progress cues, and personal meaning.');
report.push('');
report.push('Remaining proof required:');
report.push('');
report.push('- Manual validation of the top-100 candidates.');
report.push('- Human validation of AI-assisted battlecards and scorecard verdicts.');
report.push('- Completion of P0/P1 human validation queue and status updates in `data_processed/top100_human_validation_queue.csv`.');
report.push('- Forum evidence and deeper manual clustering of reviews for user pain language and subscription objections.');
report.push('- Human validation of forum/source quote coding before external-facing use.');
report.push('- Web/paywall screenshots and trial-term validation where accessible.');
report.push('- Prototype test of the two-minute daily loop.');
report.push('');
report.push('## 11. Source and Claim Layer');
report.push('');
report.push(`Market claims currently normalized: ${claims.length}.`);
if (evidenceAudit.length) report.push(`Claim audit rows currently normalized: ${evidenceAudit.length}.`);
report.push('');
report.push(mdTable(claims.slice(0, 12), [
  { key: 'claim_id', label: 'Claim ID' },
  { key: 'market', label: 'Market' },
  { key: 'value', label: 'Value', align: 'right' },
  { key: 'period', label: 'Period' },
  { key: 'confidence', label: 'Confidence' },
  { key: 'source_id', label: 'Source' }
], 12));
report.push('');
report.push('## 12. Appendices / File Map');
report.push('');
report.push('- `docs/research-expansion-master-plan.md`');
report.push('- `docs/market/tam-sam-som-model-v1.md`');
report.push('- `docs/intersections/whitespace-map-v2.md`');
report.push('- `docs/audience/audience-segmentation-v1.md`');
report.push('- `docs/audience/review-language-synthesis-v1.md`');
report.push('- `docs/audience/review-jtbd-clusters-v1.md`');
report.push('- `docs/audience/forum-evidence-synthesis-v1.md`');
report.push('- `docs/audience/forum-quote-coding-v1.md`');
report.push('- `docs/visuals/chart-index-v1.md`');
report.push('- `docs/competitive/top-intersection-review-synthesis-v1.md`');
report.push('- `docs/competitive/top100-competitor-review-v1.md`');
report.push('- `docs/competitive/top100-competitor-battlecards-v1.md`');
report.push('- `docs/competitive/human-validation-guide-v1.md`');
report.push('- `docs/competitive/app-store-iap-pricing-v1.md`');
report.push('- `docs/competitive/google-play-pricing-v1.md`');
report.push('- `docs/competitive/web-paywall-validation-v1.md`');
report.push('- `docs/competitive/web-paywall-screenshot-validation-v1.md`');
report.push('- `docs/competitive/web-paywall-screenshot-interpretation-v1.md`');
report.push('- `docs/competitive/source-expansion-backlog-v1.md`');
report.push('- `docs/competitive/p0-external-source-collection-v1.md`');
report.push('- `docs/decision/evidence-audit-v1.md`');
report.push('- `docs/product/product-core-evidence-v1.md`');
report.push('- `data_processed/tam_sam_som_model.csv`');
report.push('- `data_processed/evidence_claim_register.csv`');
report.push('- `data_processed/source_expansion_backlog.csv`');
report.push('- `data_processed/p0_external_source_summary.csv`');
report.push('- `data_processed/competitor_feature_matrix.csv`');
report.push('- `data_processed/audience_signal_matrix.csv`');
report.push('- `data_processed/whitespace_signal_matrix.csv`');
report.push('- `data_processed/top_intersection_review_prefill.csv`');
report.push('- `data_processed/top100_competitor_review_scorecard.csv`');
report.push('- `data_processed/top100_human_validation_queue.csv`');
report.push('- `data_processed/app_store_iap_pricing_summary.csv`');
report.push('- `data_processed/google_play_pricing_summary.csv`');
report.push('- `data_processed/web_paywall_signal_matrix.csv`');
report.push('- `data_processed/web_paywall_screenshot_validation.csv`');
report.push('- `data_processed/web_paywall_screenshot_interpretation.csv`');
report.push('- `data_processed/pricing_retention_matrix.csv`');
report.push('- `data_processed/product_core_evidence_matrix.csv`');
report.push('- `data_processed/review_signal_matrix.csv`');
report.push('- `data_processed/review_jtbd_cluster_summary.csv`');
report.push('- `data_processed/review_jtbd_cluster_rows.csv`');
report.push('- `data_raw/app_store_top_candidate_reviews.csv`');
report.push('- `data_raw/app_store_iap_pricing_raw.csv`');
report.push('- `data_raw/google_play_pricing_raw.csv`');
report.push('- `data_raw/web_paywall_discovery_raw.csv`');
report.push('- `data_raw/forum_evidence_signals.csv`');
report.push('- `data_raw/forum_quote_evidence_raw.csv`');
report.push('- `data_raw/expanded/p0_external_sources_raw.csv`');
report.push('- `data_raw/expanded_chrome_extensions_raw.csv`');
report.push('- `data_processed/forum_quote_coding_matrix.csv`');
report.push('- `output/charts/whitespace-bands.svg`');
report.push('- `output/charts/review-jtbd-clusters.svg`');
report.push('- `output/charts/sam-base-by-pillar.svg`');
report.push('- `output/charts/som-scenarios.svg`');
report.push('- `output/charts/forum-signals-by-market.svg`');
report.push('- `output/charts/forum-quote-coding-tags.svg`');
report.push('- `output/charts/top100-competitor-verdicts.svg`');
report.push('- `output/charts/top100-threat-scores.svg`');
report.push('- `output/charts/iap-price-bands.svg`');
report.push('- `output/charts/google-play-pricing-models.svg`');
report.push('- `output/charts/google-play-iap-by-market.svg`');
report.push('- `output/charts/web-paywall-signal-strength.svg`');
report.push('- `output/charts/web-paywall-screenshot-queue-by-market.svg`');
report.push('- `output/paywall_screenshots/*.png`');
report.push('- `output/pdf/alina-evidence-first-report-draft.pdf`');
report.push('- `output/pdf/alina-evidence-visual-report-v1.pdf`');
report.push('');
report.push('## 13. Next Work');
report.push('');
report.push('1. Human-validate the P0/P1 queue from `data_processed/top100_human_validation_queue.csv` and update validation statuses.');
report.push('2. Manually validate the highest-signal review clusters and extract exact user language for positioning.');
report.push('3. Screenshot-validate the website paywall queue and verify trial terms / first meaningful paywall location.');
report.push('4. Polish final designed PDF and add web/paywall screenshots where useful.');
report.push('5. Human-validate retrieval-assisted Reddit/forum/website quote coding.');
report.push('6. Update go/no-go decision after manual review and user validation.');

fs.writeFileSync(OUT, `${report.join('\n')}\n`);

const status = [];
status.push('# Evidence Status');
status.push('');
status.push(`Generated: ${new Date().toISOString()}`);
status.push('');
status.push(mdTable([
  { requirement: 'Large plan/backlog', evidence: 'docs/research-expansion-master-plan.md', status: 'done' },
  { requirement: 'Competitor/source expansion', evidence: 'data_raw/expanded/all_expanded_raw.csv; data_raw/research_source_discovery.csv', status: 'partial but substantial' },
  { requirement: 'Next source expansion backlog', evidence: 'data_processed/source_expansion_backlog.csv; docs/competitive/source-expansion-backlog-v1.md', status: 'done v1; prioritized sources, target outputs, expected row ranges, and risks captured' },
  { requirement: 'Controlled P0 external-source smoke pass', evidence: 'data_raw/expanded/p0_external_sources_raw.csv; data_processed/p0_external_source_summary.csv; docs/competitive/p0-external-source-collection-v1.md', status: 'done v1; small by design; Chrome Web Store yielded usable candidates, Product Hunt/AlternativeTo attempts retained as empty-source evidence' },
  { requirement: '5-market TAM/SAM/SOM method', evidence: 'docs/market/market-sizing-methodology.md; data_processed/tam_sam_som_model.csv', status: 'done v1' },
  { requirement: 'Whitespace matrices', evidence: 'data_processed/whitespace_signal_matrix.csv; docs/intersections/whitespace-map-v2.md', status: 'done v1' },
  { requirement: 'Audience matrices', evidence: 'data_processed/audience_signal_matrix.csv; docs/audience/audience-segmentation-v1.md', status: 'done v1' },
  { requirement: 'Versioned on GitHub', evidence: 'git log through current commit after push', status: 'active' },
  { requirement: 'Final PDF', evidence: 'output/pdf/alina-evidence-first-report-draft.pdf; output/pdf/alina-evidence-visual-report-v1.pdf', status: 'draft evidence PDF and visual PDF companion done' },
  { requirement: 'Visual charts', evidence: 'docs/visuals/chart-index-v1.md; output/charts/*.svg; output/pdf/alina-evidence-visual-report-v1.pdf', status: 'draft chart pack and embedded visual PDF done' },
  { requirement: 'Evidence audit / claim register', evidence: 'data_processed/evidence_claim_register.csv; docs/decision/evidence-audit-v1.md', status: 'done v1; proof status, confidence, gaps, and next actions explicit' },
  { requirement: 'Manual review of top 100', evidence: 'data_processed/top100_competitor_review_scorecard.csv; data_processed/top100_human_validation_queue.csv; docs/competitive/top100-competitor-review-v1.md; docs/competitive/top100-competitor-battlecards-v1.md; docs/competitive/human-validation-guide-v1.md', status: 'AI-assisted review and ranked human validation packet done v1; human execution pending' },
  { requirement: 'Detailed pricing/IAP extraction', evidence: 'data_raw/app_store_iap_pricing_raw.csv; data_processed/app_store_iap_pricing_summary.csv; docs/competitive/app-store-iap-pricing-v1.md; data_raw/google_play_pricing_raw.csv; data_processed/google_play_pricing_summary.csv; docs/competitive/google-play-pricing-v1.md; data_raw/web_paywall_discovery_raw.csv; data_processed/web_paywall_signal_matrix.csv; docs/competitive/web-paywall-validation-v1.md; data_processed/web_paywall_screenshot_validation.csv; data_processed/web_paywall_screenshot_interpretation.csv; docs/competitive/web-paywall-screenshot-validation-v1.md; docs/competitive/web-paywall-screenshot-interpretation-v1.md; output/paywall_screenshots/*.png', status: 'App Store web IAP extraction, Google Play pricing validation, developer website paywall discovery, screenshot capture, and OCR interpretation done v1; human paywall interpretation pending' },
  { requirement: 'Review/forum evidence', evidence: 'data_raw/app_store_top_candidate_reviews.csv; data_raw/forum_evidence_signals.csv; data_raw/forum_quote_evidence_raw.csv; data_processed/review_signal_matrix.csv; data_processed/review_jtbd_cluster_summary.csv; data_processed/forum_quote_coding_matrix.csv; docs/audience/review-language-synthesis-v1.md; docs/audience/forum-evidence-synthesis-v1.md; docs/audience/forum-quote-coding-v1.md', status: 'App Store review extraction, JTBD clustering, forum source map, and retrieval-assisted quote coding done v1; human validation pending' }
], [
  { key: 'requirement', label: 'Requirement' },
  { key: 'evidence', label: 'Evidence' },
  { key: 'status', label: 'Status' }
]));
fs.writeFileSync(STATUS_OUT, `${status.join('\n')}\n`);

console.log(`report=${OUT}`);
console.log(`status=${STATUS_OUT}`);
console.log(`expanded_rows=${expanded.length}`);
console.log(`audience_rows=${audience.length}`);
console.log(`market_claims=${claims.length}`);
console.log(`review_rows=${rawReviews.length}`);
console.log(`review_signal_rows=${reviewSignals.length}`);
console.log(`review_clusters=${reviewClusters.length}`);
console.log(`forum_signal_rows=${forumSignals.length}`);
console.log(`forum_quote_rows=${forumQuoteCoding.length}`);
console.log(`iap_rows=${iapRaw.length}`);
console.log(`google_play_pricing_rows=${googlePlayPricing.length}`);
console.log(`web_paywall_rows=${webPaywallRaw.length}`);
console.log(`web_paywall_domains=${webPaywallSignals.length}`);
console.log(`web_paywall_screenshots=${webPaywallCapturedScreenshots.length}/${webPaywallScreenshots.length}`);
console.log(`web_paywall_screenshot_interpretations=${webPaywallScreenshotInterpretation.length}`);
console.log(`human_validation_queue_rows=${humanValidationQueue.length}`);
console.log(`evidence_audit_rows=${evidenceAudit.length}`);
console.log(`source_expansion_backlog_rows=${sourceExpansionBacklog.length}`);
console.log(`p0_external_rows=${p0ExternalSources.length}`);
console.log(`p0_external_usable=${p0ExternalUsable.length}`);
