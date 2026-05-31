import fs from 'fs';

const OUT_ROWS = 'data_processed/competitor_revenue_proxy_review.csv';
const OUT_SUMMARY = 'data_processed/competitor_revenue_proxy_market_summary.csv';
const OUT_DOC = 'docs/market/competitor-revenue-proxy-review-v1.md';

for (const dir of ['data_processed', 'docs/market']) fs.mkdirSync(dir, { recursive: true });

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

function idxBy(rows, key) {
  const out = new Map();
  for (const row of rows) {
    const value = row[key];
    if (value && !out.has(value)) out.set(value, row);
  }
  return out;
}

function number(value) {
  const n = Number(String(value || '').replace(/[^0-9.-]/g, ''));
  return Number.isFinite(n) ? n : 0;
}

function money(value) {
  const n = Number(value || 0);
  return n ? n.toFixed(2).replace(/\.00$/, '') : '';
}

function marketFromArchetype(row) {
  const archetype = String(row.archetype || '').toLowerCase();
  const name = `${row.app_name || ''} ${row.source_evidence_excerpt || ''}`.toLowerCase();
  if (archetype.includes('faith') || archetype.includes('manifestation') || name.includes('astrolog') || name.includes('tarot')) return 'astrology_esoterics';
  if (archetype.includes('avatar') || archetype.includes('identity') || name.includes('avatar') || name.includes('character')) return 'avatar_identity';
  if (archetype.includes('mindful') || name.includes('meditat') || name.includes('breath') || name.includes('sleep')) return 'mindfulness';
  if (archetype.includes('game') || archetype.includes('rpg') || name.includes('quest') || name.includes('level')) return 'gaming_progression';
  return 'coaching_self_improvement';
}

function evidenceQuality(row, iap, web) {
  const parts = [];
  if (Number(iap.iap_count || 0) > 0) parts.push('observed_app_store_iap');
  if (String(row.pricing_tags || '').includes('subscription')) parts.push('subscription_like_metadata');
  if (web?.strongest_signal && web.strongest_signal !== 'low') parts.push(`web_${web.strongest_signal}_paywall_signal`);
  if (Number(row.review_count || 0) >= 1000) parts.push('meaningful_review_scale');
  if (Number(row.review_signal_rows || 0) >= 20) parts.push('review_language_depth');
  return parts.length ? parts.join('|') : 'weak_public_proxy_only';
}

function revenueProxyScore(row, iap, web) {
  let score = 0;
  const reviewCount = number(row.review_count);
  const iapCount = number(iap.iap_count || row.observed_iap_count);
  const maxPrice = number(iap.max_price_usd || row.observed_max_iap_price_usd);
  const minPrice = number(iap.min_price_usd || row.observed_min_iap_price_usd);
  const pricingTags = `${row.pricing_tags || ''}|${iap.product_tags || ''}`.toLowerCase();
  const webSignal = web?.strongest_signal || '';

  if (iapCount > 0) score += 20;
  if (pricingTags.includes('subscription')) score += 18;
  if (pricingTags.includes('trial')) score += 8;
  if (pricingTags.includes('consumable') || pricingTags.includes('credits')) score += 8;
  if (maxPrice >= 99) score += 18;
  else if (maxPrice >= 49) score += 14;
  else if (maxPrice >= 15) score += 8;
  else if (minPrice > 0) score += 4;
  if (reviewCount >= 10000) score += 18;
  else if (reviewCount >= 1000) score += 12;
  else if (reviewCount >= 100) score += 6;
  if (webSignal === 'high') score += 10;
  else if (webSignal === 'medium') score += 6;
  if (Number(row.review_signal_rows || 0) >= 20) score += 6;
  if (row.direct_threat_level === 'medium_high') score += 4;

  return Math.min(score, 100);
}

function band(score, row, iap) {
  const iapCount = number(iap.iap_count || row.observed_iap_count);
  if (score >= 70) return 'strong_bottom_up_money_proxy';
  if (score >= 48) return 'medium_bottom_up_money_proxy';
  if (score >= 28 || iapCount > 0) return 'weak_to_medium_money_proxy';
  return 'weak_public_money_proxy';
}

function interpretation(row, iap, scoreBand) {
  const maxPrice = money(iap.max_price_usd || row.observed_max_iap_price_usd);
  const tags = `${row.pricing_tags || ''}|${iap.product_tags || ''}`;
  if (scoreBand === 'strong_bottom_up_money_proxy') {
    return `Strong public monetization proxy: observed IAP/pricing ladder${maxPrice ? ` up to $${maxPrice}` : ''}, review scale, and adjacent product fit. Treat as bottom-up demand evidence, not revenue proof.`;
  }
  if (scoreBand === 'medium_bottom_up_money_proxy') {
    return `Meaningful paid-surface proxy with ${tags.includes('subscription') ? 'subscription-like' : 'IAP'} evidence, but revenue magnitude remains unverified.`;
  }
  if (scoreBand === 'weak_to_medium_money_proxy') {
    return 'Some paid-surface evidence exists, but public data is too thin for revenue inference without manual app/paywall review.';
  }
  return 'Public monetization proxy is weak or absent; useful mainly as competitive context.';
}

const top100 = csv('data_processed/top100_competitor_review_scorecard.csv');
const iapSummary = idxBy(csv('data_processed/app_store_iap_pricing_summary.csv'), 'app_store_id');
const webPaywalls = idxBy(csv('data_processed/web_paywall_signal_matrix.csv'), 'app_name');
const googlePlay = csv('data_raw/google_play_pricing_raw.csv').filter(row => row.collection_status === 'ok');
const googleSummary = csv('data_processed/google_play_pricing_summary.csv');

const primary = top100.filter(row => row.duplicate_flag === 'primary_app_entry');
const rows = primary.map(row => {
  const iap = iapSummary.get(row.app_store_id) || {};
  const web = webPaywalls.get(row.app_name) || {};
  const score = revenueProxyScore(row, iap, web);
  const proxyBand = band(score, row, iap);
  const market = marketFromArchetype(row);
  const evidence = evidenceQuality(row, iap, web);
  return {
    app_store_id: row.app_store_id,
    app_name: row.app_name,
    seller_name: row.seller_name,
    market,
    archetype: row.archetype,
    competitive_verdict: row.competitive_verdict,
    direct_threat_level: row.direct_threat_level,
    app_store_rating: row.app_store_rating,
    review_count: row.review_count,
    observed_iap_count: iap.iap_count || row.observed_iap_count || '0',
    observed_min_price_usd: iap.min_price_usd || row.observed_min_iap_price_usd || '',
    observed_max_price_usd: iap.max_price_usd || row.observed_max_iap_price_usd || '',
    median_observed_price_usd: iap.median_observed_price_usd || '',
    price_bands: iap.price_bands || '',
    product_tags: iap.product_tags || row.observed_iap_product_tags || '',
    pricing_tags: row.pricing_tags,
    web_paywall_signal: web.strongest_signal || 'not_checked_or_no_match',
    web_price_points: web.detected_price_points || '',
    review_signal_rows: row.review_signal_rows,
    top_review_signals: row.top_review_signals,
    revenue_proxy_score: String(score),
    revenue_proxy_band: proxyBand,
    evidence_quality_flags: evidence,
    conservative_interpretation: interpretation(row, iap, proxyBand),
    revenue_claim_limit: 'No direct revenue estimate. This is a public paid-surface and demand-depth proxy only.',
    source_urls: [row.app_store_url, web.best_url].filter(Boolean).join('|')
  };
}).sort((a, b) => Number(b.revenue_proxy_score) - Number(a.revenue_proxy_score));

const byMarket = new Map();
for (const row of rows) {
  if (!byMarket.has(row.market)) byMarket.set(row.market, []);
  byMarket.get(row.market).push(row);
}

const googleByMarket = new Map();
for (const row of googleSummary) googleByMarket.set(row.niche, row);

const summary = [...byMarket.entries()].map(([market, marketRows]) => {
  const strong = marketRows.filter(row => row.revenue_proxy_band === 'strong_bottom_up_money_proxy');
  const mediumPlus = marketRows.filter(row => ['strong_bottom_up_money_proxy', 'medium_bottom_up_money_proxy'].includes(row.revenue_proxy_band));
  const iapApps = marketRows.filter(row => Number(row.observed_iap_count || 0) > 0);
  const maxPrice = Math.max(0, ...marketRows.map(row => number(row.observed_max_price_usd)));
  const reviews = marketRows.reduce((sum, row) => sum + number(row.review_count), 0);
  const g = googleByMarket.get(market.replace('_progression', '')) || googleByMarket.get(market) || {};
  return {
    market,
    reviewed_competitors: String(marketRows.length),
    strong_proxy_competitors: String(strong.length),
    medium_or_stronger_proxy_competitors: String(mediumPlus.length),
    observed_iap_competitors: String(iapApps.length),
    max_observed_price_usd: money(maxPrice),
    total_app_store_reviews_in_reviewed_set: String(reviews),
    google_play_successful_rows: g.successful_rows || '',
    google_play_iap_apps: g.offers_iap_apps || '',
    google_play_top_install_apps: g.top_install_apps || '',
    market_money_read: strong.length >= 3 || mediumPlus.length >= 8 ? 'bottom_up_paid_behavior_visible' : mediumPlus.length >= 3 ? 'bottom_up_paid_behavior_directional' : 'thin_bottom_up_paid_behavior',
    main_caveat: 'Public IAP/review/install/paywall proxies cannot prove revenue; use for triangulation and validation prioritization.'
  };
}).sort((a, b) => Number(b.strong_proxy_competitors) - Number(a.strong_proxy_competitors));

writeCsv(OUT_ROWS, rows, [
  'app_store_id', 'app_name', 'seller_name', 'market', 'archetype',
  'competitive_verdict', 'direct_threat_level', 'app_store_rating', 'review_count',
  'observed_iap_count', 'observed_min_price_usd', 'observed_max_price_usd',
  'median_observed_price_usd', 'price_bands', 'product_tags', 'pricing_tags',
  'web_paywall_signal', 'web_price_points', 'review_signal_rows', 'top_review_signals',
  'revenue_proxy_score', 'revenue_proxy_band', 'evidence_quality_flags',
  'conservative_interpretation', 'revenue_claim_limit', 'source_urls'
]);

writeCsv(OUT_SUMMARY, summary, [
  'market', 'reviewed_competitors', 'strong_proxy_competitors',
  'medium_or_stronger_proxy_competitors', 'observed_iap_competitors',
  'max_observed_price_usd', 'total_app_store_reviews_in_reviewed_set',
  'google_play_successful_rows', 'google_play_iap_apps', 'google_play_top_install_apps',
  'market_money_read', 'main_caveat'
]);

const lines = [];
lines.push('# Competitor Revenue Proxy Review V1');
lines.push('');
lines.push(`Generated: ${new Date().toISOString()}`);
lines.push('');
lines.push('## Purpose');
lines.push('');
lines.push('This layer adds bottom-up monetization triangulation without broad search-engine crawling. It combines already collected App Store IAP rows, top-100 competitor scorecards, Google Play pricing/install metadata, review depth, and public web-paywall signals.');
lines.push('');
lines.push('It does not estimate actual competitor revenue. It ranks public paid-surface evidence so the TAM/SAM/SOM model has a stronger sanity check and so manual validation can focus on the highest-money competitors.');
lines.push('');
lines.push('## Summary');
lines.push('');
lines.push(`- Competitors reviewed: ${rows.length}`);
lines.push(`- Strong bottom-up money proxies: ${rows.filter(row => row.revenue_proxy_band === 'strong_bottom_up_money_proxy').length}`);
lines.push(`- Medium-or-stronger money proxies: ${rows.filter(row => ['strong_bottom_up_money_proxy', 'medium_bottom_up_money_proxy'].includes(row.revenue_proxy_band)).length}`);
lines.push(`- Competitors with observed App Store IAP: ${rows.filter(row => Number(row.observed_iap_count || 0) > 0).length}`);
lines.push(`- Google Play pricing rows used as market context: ${googlePlay.length}`);
lines.push('');
lines.push('Revenue proxy bands:');
lines.push('');
lines.push(bulletCounts(countBy(rows, 'revenue_proxy_band')));
lines.push('');
lines.push('## Market Summary');
lines.push('');
lines.push(mdTable(summary, [
  { key: 'market', label: 'Market' },
  { key: 'reviewed_competitors', label: 'Reviewed', align: 'right' },
  { key: 'strong_proxy_competitors', label: 'Strong', align: 'right' },
  { key: 'medium_or_stronger_proxy_competitors', label: 'Medium+', align: 'right' },
  { key: 'observed_iap_competitors', label: 'IAP Apps', align: 'right' },
  { key: 'max_observed_price_usd', label: 'Max Price', align: 'right' },
  { key: 'market_money_read', label: 'Read' }
]));
lines.push('');
lines.push('## Highest-Signal Competitors');
lines.push('');
lines.push(mdTable(rows.slice(0, 25), [
  { key: 'app_name', label: 'App' },
  { key: 'market', label: 'Market' },
  { key: 'competitive_verdict', label: 'Verdict' },
  { key: 'review_count', label: 'Reviews', align: 'right' },
  { key: 'observed_iap_count', label: 'IAP', align: 'right' },
  { key: 'observed_max_price_usd', label: 'Max Price', align: 'right' },
  { key: 'revenue_proxy_score', label: 'Score', align: 'right' },
  { key: 'revenue_proxy_band', label: 'Band' }
], 25));
lines.push('');
lines.push('## Interpretation Rules');
lines.push('');
lines.push('- Strong proxy: visible IAP/pricing ladder, subscription-like or high-price signal, meaningful review depth, and adjacency to the Alina product loop.');
lines.push('- Medium proxy: paid surface is visible but review scale, web confirmation, or product adjacency is weaker.');
lines.push('- Weak proxy: useful for competitor context but not enough for market-money claims.');
lines.push('- Revenue claim limit: these rows prove public monetization surfaces and demand-depth proxies, not actual revenue.');
lines.push('');
lines.push('## Files');
lines.push('');
lines.push(`- \`${OUT_ROWS}\``);
lines.push(`- \`${OUT_SUMMARY}\``);

fs.writeFileSync(OUT_DOC, `${lines.join('\n')}\n`);

console.log(`rows=${OUT_ROWS}`);
console.log(`summary=${OUT_SUMMARY}`);
console.log(`doc=${OUT_DOC}`);
console.log(`reviewed=${rows.length}`);
console.log(`strong=${rows.filter(row => row.revenue_proxy_band === 'strong_bottom_up_money_proxy').length}`);
console.log(`medium_plus=${rows.filter(row => ['strong_bottom_up_money_proxy', 'medium_bottom_up_money_proxy'].includes(row.revenue_proxy_band)).length}`);
