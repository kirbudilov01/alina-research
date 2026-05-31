import fs from 'fs';

const PREFILL = 'data_processed/top_intersection_review_prefill.csv';
const CORE = 'data_processed/product_core_evidence_matrix.csv';
const PRICING = 'data_processed/pricing_retention_matrix.csv';
const REVIEW_SIGNALS = 'data_processed/review_signal_matrix.csv';
const JTBD_ROWS = 'data_processed/review_jtbd_cluster_rows.csv';
const IAP_SUMMARY = 'data_processed/app_store_iap_pricing_summary.csv';

const OUT_SCORECARD = 'data_processed/top100_competitor_review_scorecard.csv';
const OUT_BATTLECARDS = 'docs/competitive/top100-competitor-battlecards-v1.md';
const OUT_SUMMARY = 'docs/competitive/top100-competitor-review-v1.md';

for (const dir of ['data_processed', 'docs/competitive']) fs.mkdirSync(dir, { recursive: true });

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

function csv(file) {
  return parseCsv(fs.readFileSync(file, 'utf8'));
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

function topCounts(rows, key, limit = 5) {
  return Object.entries(countBy(rows, key))
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([name, count]) => `${name}:${count}`)
    .join('|');
}

function idxBy(rows, key) {
  const out = new Map();
  for (const row of rows) if (!out.has(row[key])) out.set(row[key], row);
  return out;
}

function splitTags(value) {
  return clean(value).split('|').filter(Boolean);
}

function threatScore(row) {
  let score = 0;
  score += Number(row.alina_core_score || 0) * 2;
  if (row.behavior_tied_progression === 'yes') score += 8;
  if (row.direct_threat_level === 'high') score += 8;
  if (row.direct_threat_level === 'medium_high') score += 5;
  if ((row.top_review_jtbd || '').includes('jtbd_daily_anchor')) score += 3;
  if ((row.top_review_jtbd || '').includes('jtbd_make_growth_visible')) score += 4;
  if ((row.retention_tags || '').includes('avatar_feedback')) score += 3;
  if ((row.retention_tags || '').includes('xp_levels')) score += 2;
  score += Math.min(4, Math.log10(Number(row.review_count || 0) + 1));
  return Math.round(score * 10) / 10;
}

function verdict(row) {
  if (row.behavior_tied_progression === 'yes') return 'direct_reference_competitor';
  if (Number(row.competitive_threat_score) >= 24) return 'high_priority_close_substitute';
  if (Number(row.alina_core_score || 0) >= 5) return 'close_substitute';
  if ((row.top_review_pains || '').includes('pain_subscription_value')) return 'monetization_risk_benchmark';
  return 'adjacent_benchmark';
}

function alinaOpening(row) {
  if (row.behavior_tied_progression === 'yes') return 'Differentiate by broader spiritual/identity scope, softer safety framing, and better reliability around action-tied progression.';
  if ((row.retention_tags || '').includes('avatar_feedback') && row.behavior_tied_progression !== 'yes') return 'Make the avatar causally respond to completed daily action, not just exist as profile or decorative identity.';
  if ((row.top_review_pains || '').includes('pain_subscription_value')) return 'Demonstrate daily-loop value before paywall; monetize depth and advanced personalization.';
  if ((row.top_review_jtbd || '').includes('jtbd_daily_anchor')) return 'Compress the daily anchor into a two-minute ritual with visible identity feedback.';
  return 'Use as adjacent evidence, not a direct positioning anchor.';
}

const prefill = csv(PREFILL);
const core = idxBy(csv(CORE), 'app_name');
const pricing = idxBy(csv(PRICING), 'app_name');
const iapSummary = fs.existsSync(IAP_SUMMARY) ? idxBy(csv(IAP_SUMMARY), 'app_store_id') : new Map();
const reviewSignals = csv(REVIEW_SIGNALS);
const jtbdRows = csv(JTBD_ROWS);

const signalByApp = new Map();
for (const row of reviewSignals) {
  const key = row.app_store_id || row.app_name;
  if (!signalByApp.has(key)) signalByApp.set(key, []);
  signalByApp.get(key).push(row);
}

const jtbdByApp = new Map();
for (const row of jtbdRows) {
  const key = row.app_store_id || row.app_name;
  if (!jtbdByApp.has(key)) jtbdByApp.set(key, []);
  jtbdByApp.get(key).push(row);
}

const seenApps = new Set();
const scoreRows = [];

for (const row of prefill) {
  const appKey = row.app_store_id || row.app_name;
  const appNameKey = row.app_name;
  const c = core.get(appNameKey) || {};
  const p = pricing.get(appNameKey) || {};
  const iap = iapSummary.get(appKey) || {};
  const signals = signalByApp.get(appKey) || signalByApp.get(appNameKey) || [];
  const jtbd = jtbdByApp.get(appKey) || jtbdByApp.get(appNameKey) || [];
  const jtbdOnly = jtbd.filter(r => r.cluster_type === 'jtbd');
  const painOnly = jtbd.filter(r => r.cluster_type === 'pain');
  const topReviewJtbd = topCounts(jtbdOnly, 'cluster_id', 4);
  const topReviewPains = topCounts(painOnly, 'cluster_id', 4);
  const duplicateFlag = seenApps.has(appKey) ? 'duplicate_app_entry' : 'primary_app_entry';
  seenApps.add(appKey);

  const scoreRow = {
    review_rank: row.review_rank,
    app_store_id: row.app_store_id,
    app_name: row.app_name,
    seller_name: row.seller_name,
    archetype: row.archetype,
    direct_threat_level: row.direct_threat_level,
    review_status: 'ai_assisted_review_v1_needs_human_validation',
    duplicate_flag: duplicateFlag,
    app_store_rating: row.app_store_rating,
    review_count: row.app_store_review_count || row.review_count,
    alina_closeness: c.alina_closeness || '',
    alina_core_score: c.alina_core_score || '',
    personal_meaning: c.personal_meaning || '',
    one_daily_action: c.one_daily_action || '',
    short_reset: c.short_reset || '',
    avatar_or_identity: c.avatar_or_identity || '',
    behavior_tied_progression: c.behavior_tied_progression || '',
    next_day_hook: c.next_day_hook || '',
    pricing_tags: p.pricing_tags || '',
    observed_iap_count: iap.iap_count || '',
    observed_min_iap_price_usd: iap.min_price_usd || '',
    observed_max_iap_price_usd: iap.max_price_usd || '',
    observed_iap_product_tags: iap.product_tags || '',
    retention_tags: p.retention_tags || '',
    review_signal_rows: signals.length,
    top_review_signals: topCounts(signals, 'signal', 5),
    jtbd_cluster_rows: jtbdOnly.length,
    pain_cluster_rows: painOnly.length,
    top_review_jtbd: topReviewJtbd,
    top_review_pains: topReviewPains,
    app_store_url: row.source_url,
    source_evidence_excerpt: clean(row.description_excerpt).slice(0, 360)
  };
  scoreRow.competitive_threat_score = threatScore(scoreRow);
  scoreRow.competitive_verdict = verdict(scoreRow);
  scoreRow.alina_opening = alinaOpening(scoreRow);
  scoreRows.push(scoreRow);
}

scoreRows.sort((a, b) => Number(a.review_rank) - Number(b.review_rank));

writeCsv(OUT_SCORECARD, scoreRows, [
  'review_rank', 'app_store_id', 'app_name', 'seller_name', 'archetype',
  'direct_threat_level', 'review_status', 'duplicate_flag', 'app_store_rating',
  'review_count', 'alina_closeness', 'alina_core_score', 'competitive_threat_score',
  'competitive_verdict', 'personal_meaning', 'one_daily_action', 'short_reset',
  'avatar_or_identity', 'behavior_tied_progression', 'next_day_hook', 'pricing_tags',
  'observed_iap_count', 'observed_min_iap_price_usd', 'observed_max_iap_price_usd',
  'observed_iap_product_tags', 'retention_tags', 'review_signal_rows', 'top_review_signals', 'jtbd_cluster_rows',
  'pain_cluster_rows', 'top_review_jtbd', 'top_review_pains', 'alina_opening',
  'app_store_url', 'source_evidence_excerpt'
]);

const primaryRows = scoreRows.filter(row => row.duplicate_flag === 'primary_app_entry');
const topBattlecards = [...primaryRows]
  .sort((a, b) => Number(b.competitive_threat_score) - Number(a.competitive_threat_score))
  .slice(0, 25);

const battle = [];
battle.push('# Top-100 Competitor Battlecards V1');
battle.push('');
battle.push(`Generated: ${new Date().toISOString()}`);
battle.push('');
battle.push('## Scope');
battle.push('');
battle.push('AI-assisted battlecards for the highest-priority unique apps in the top-100 intersection review set. This is an evidence triage layer built from App Store metadata, existing core/pricing matrices, and public App Store review clusters. It still requires human product review before final investor-grade claims.');
battle.push('');
for (const row of topBattlecards) {
  battle.push(`## ${row.app_name}`);
  battle.push('');
  battle.push(`- Rank: ${row.review_rank}`);
  battle.push(`- Archetype: ${row.archetype}`);
  battle.push(`- Threat score: ${row.competitive_threat_score}`);
  battle.push(`- Verdict: ${row.competitive_verdict}`);
  battle.push(`- Core score: ${row.alina_core_score}/6; behavior-tied progression: ${row.behavior_tied_progression}`);
  battle.push(`- Retention tags: ${row.retention_tags || 'none detected'}`);
  battle.push(`- Pricing tags: ${row.pricing_tags || 'none detected'}`);
  battle.push(`- Observed IAP: ${row.observed_iap_count || 0} rows; range ${row.observed_min_iap_price_usd || 'n/a'}-${row.observed_max_iap_price_usd || 'n/a'} USD; tags ${row.observed_iap_product_tags || 'none observed'}`);
  battle.push(`- Review signals: ${row.top_review_signals || 'none collected'}`);
  battle.push(`- JTBD clusters: ${row.top_review_jtbd || 'none collected'}`);
  battle.push(`- Pain clusters: ${row.top_review_pains || 'none collected'}`);
  battle.push(`- Alina opening: ${row.alina_opening}`);
  battle.push(`- Source: ${row.app_store_url}`);
  battle.push('');
}
fs.writeFileSync(OUT_BATTLECARDS, `${battle.join('\n')}\n`);

const verdictCounts = countBy(scoreRows, 'competitive_verdict');
const statusCounts = countBy(scoreRows, 'review_status');
const duplicateCounts = countBy(scoreRows, 'duplicate_flag');
const highThreat = primaryRows.filter(row => Number(row.competitive_threat_score) >= 24);
const directReference = primaryRows.filter(row => row.competitive_verdict === 'direct_reference_competitor');

const lines = [];
lines.push('# Top-100 Competitor Review V1');
lines.push('');
lines.push(`Generated: ${new Date().toISOString()}`);
lines.push('');
lines.push('## Scope');
lines.push('');
lines.push('This is an AI-assisted competitor review pass over the top-100 intersection candidates. It upgrades the previous prefilled sheet into a scorecard with direct threat scoring, review-language evidence, JTBD/pain clusters, and Alina-specific openings. It is intentionally labeled as requiring human validation.');
lines.push('');
lines.push('## Coverage');
lines.push('');
lines.push(`- Top-100 rows reviewed: ${scoreRows.length}`);
lines.push(`- Unique primary app entries: ${primaryRows.length}`);
lines.push(`- Duplicate app entries: ${scoreRows.length - primaryRows.length}`);
lines.push(`- Apps with public review signals: ${primaryRows.filter(r => Number(r.review_signal_rows) > 0).length}`);
lines.push(`- Apps with observed IAP pricing: ${primaryRows.filter(r => Number(r.observed_iap_count) > 0).length}`);
lines.push(`- High-threat unique apps (score >= 24): ${highThreat.length}`);
lines.push(`- Direct reference competitors with behavior-tied progression evidence: ${directReference.length}`);
lines.push('');
lines.push('## Verdict Counts');
lines.push('');
for (const [key, value] of Object.entries(verdictCounts).sort((a, b) => b[1] - a[1])) lines.push(`- ${key}: ${value}`);
lines.push('');
lines.push('## Review Status Counts');
lines.push('');
for (const [key, value] of Object.entries(statusCounts).sort((a, b) => b[1] - a[1])) lines.push(`- ${key}: ${value}`);
lines.push('');
lines.push('## Duplicate Status');
lines.push('');
for (const [key, value] of Object.entries(duplicateCounts).sort((a, b) => b[1] - a[1])) lines.push(`- ${key}: ${value}`);
lines.push('');
lines.push('## Top Competitive Threats');
lines.push('');
lines.push('| Rank | App | Threat | Verdict | Core | Behavior Progression | Top Pain | Alina Opening |');
lines.push('| ---: | --- | ---: | --- | ---: | --- | --- | --- |');
for (const row of topBattlecards.slice(0, 15)) {
  const pain = (row.top_review_pains || '').split('|')[0] || 'none';
  lines.push(`| ${row.review_rank} | ${clean(row.app_name).replace(/\|/g, '/')} | ${row.competitive_threat_score} | ${row.competitive_verdict} | ${row.alina_core_score} | ${row.behavior_tied_progression} | ${pain} | ${row.alina_opening.replace(/\|/g, '/')} |`);
}
lines.push('');
lines.push('## Interpretation');
lines.push('');
lines.push('- The competitive field is broad, but direct reference competition is still narrow when behavior-tied progression is required.');
lines.push('- Apps with visible progress, daily anchors, and identity/spiritual meaning are the most strategically relevant benchmarks.');
lines.push('- The strongest Alina opening is not simply adding an avatar; it is making the avatar/progress object causally respond to a completed daily action.');
lines.push('- Subscription and reliability pain clusters should shape MVP monetization and quality gates.');
lines.push('');
lines.push('## Files');
lines.push('');
lines.push(`- \`${OUT_SCORECARD}\``);
lines.push(`- \`${OUT_BATTLECARDS}\``);
fs.writeFileSync(OUT_SUMMARY, `${lines.join('\n')}\n`);

console.log(`scorecard_rows=${scoreRows.length}`);
console.log(`primary_apps=${primaryRows.length}`);
console.log(`battlecards=${topBattlecards.length}`);
console.log(`high_threat=${highThreat.length}`);
console.log(`direct_reference=${directReference.length}`);
