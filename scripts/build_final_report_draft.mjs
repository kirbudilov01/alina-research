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
report.push(`- Strict behavior-tied avatar progression signal in top-100: ${behaviorTied}/100.`);
report.push(`- App Store review-language layer: ${rawReviews.length} reviews from ${reviewApps} top-candidate apps, mapped into ${reviewSignals.length} signal rows.`);
report.push(`- Review JTBD/pain clusters: ${reviewClusters.length} themes; top cluster is "${reviewClusters[0]?.cluster_label || 'n/a'}" with ${reviewClusters[0]?.review_rows || 'n/a'} rows.`);
report.push(`- Forum/source evidence map: ${forumSignals.length} qualitative rows across ${Object.keys(countBy(forumSignals, 'market')).length} market pillars.`);
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
report.push('### Retention Signals');
report.push('');
const retentionTags = {};
for (const row of pricing) for (const tag of String(row.retention_tags || '').split('|').filter(Boolean)) retentionTags[tag] = (retentionTags[tag] || 0) + 1;
report.push(bulletCounts(retentionTags));
report.push('');
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
report.push('- Review language confirms user pull toward daily support, emotional regulation, progress cues, and personal meaning.');
report.push('');
report.push('Remaining proof required:');
report.push('');
report.push('- Manual validation of the top-100 candidates.');
report.push('- Forum evidence and deeper manual clustering of reviews for user pain language and subscription objections.');
report.push('- Manual quote-level coding of forum/source rows.');
report.push('- Pricing/IAP extraction beyond App Store metadata.');
report.push('- Prototype test of the two-minute daily loop.');
report.push('');
report.push('## 11. Source and Claim Layer');
report.push('');
report.push(`Market claims currently normalized: ${claims.length}.`);
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
report.push('- `docs/competitive/top-intersection-review-synthesis-v1.md`');
report.push('- `docs/product/product-core-evidence-v1.md`');
report.push('- `data_processed/tam_sam_som_model.csv`');
report.push('- `data_processed/competitor_feature_matrix.csv`');
report.push('- `data_processed/audience_signal_matrix.csv`');
report.push('- `data_processed/whitespace_signal_matrix.csv`');
report.push('- `data_processed/top_intersection_review_prefill.csv`');
report.push('- `data_processed/pricing_retention_matrix.csv`');
report.push('- `data_processed/product_core_evidence_matrix.csv`');
report.push('- `data_processed/review_signal_matrix.csv`');
report.push('- `data_processed/review_jtbd_cluster_summary.csv`');
report.push('- `data_processed/review_jtbd_cluster_rows.csv`');
report.push('- `data_raw/app_store_top_candidate_reviews.csv`');
report.push('- `data_raw/forum_evidence_signals.csv`');
report.push('');
report.push('## 13. Next Work');
report.push('');
report.push('1. Complete manual review of top 100 intersection candidates.');
report.push('2. Manually validate the highest-signal review clusters and extract exact user language for positioning.');
report.push('3. Extract detailed IAP/subscription pricing where accessible.');
report.push('4. Build visual charts and render the PDF version.');
report.push('5. Manually code Reddit/forum/website evidence beyond the current source map.');
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
  { requirement: '5-market TAM/SAM/SOM method', evidence: 'docs/market/market-sizing-methodology.md; data_processed/tam_sam_som_model.csv', status: 'done v1' },
  { requirement: 'Whitespace matrices', evidence: 'data_processed/whitespace_signal_matrix.csv; docs/intersections/whitespace-map-v2.md', status: 'done v1' },
  { requirement: 'Audience matrices', evidence: 'data_processed/audience_signal_matrix.csv; docs/audience/audience-segmentation-v1.md', status: 'done v1' },
  { requirement: 'Versioned on GitHub', evidence: 'git log through current commit after push', status: 'active' },
  { requirement: 'Final PDF', evidence: 'output/pdf/alina-evidence-first-report-draft.pdf', status: 'draft PDF done' },
  { requirement: 'Manual review of top 100', evidence: 'data_processed/top_intersection_review_prefill.csv', status: 'prefilled, not manually completed' },
  { requirement: 'Review/forum evidence', evidence: 'data_raw/app_store_top_candidate_reviews.csv; data_raw/forum_evidence_signals.csv; data_processed/review_signal_matrix.csv; data_processed/review_jtbd_cluster_summary.csv; docs/audience/review-language-synthesis-v1.md; docs/audience/forum-evidence-synthesis-v1.md', status: 'App Store review extraction, JTBD clustering, and forum source map done v1; quote-level forum coding pending' }
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
