import fs from 'fs';
import fetch from 'node-fetch';

const OUT_RAW = 'data_raw/expanded_desktop_store_raw.csv';
const OUT_SUMMARY = 'data_processed/desktop_store_source_summary.csv';
const OUT_DOC = 'docs/competitive/desktop-store-expansion-v1.md';

const QUERY_LIMIT = Number(process.env.DESKTOP_STORE_QUERY_LIMIT || 999);
const RESULT_LIMIT = Number(process.env.DESKTOP_STORE_RESULT_LIMIT || 50);
const TIMEOUT_MS = Number(process.env.DESKTOP_STORE_TIMEOUT_MS || 12000);
const COUNTRIES = (process.env.DESKTOP_STORE_COUNTRIES || 'us,gb,ca,au')
  .split(',')
  .map(country => country.trim())
  .filter(Boolean);

for (const dir of ['data_raw', 'data_processed', 'docs/competitive']) fs.mkdirSync(dir, { recursive: true });

const MARKET_QUERIES = {
  coaching: [
    'life coach', 'habit tracker', 'goal tracker', 'personal growth', 'daily routine',
    'productivity coach', 'self improvement', 'accountability', 'journal coach', 'planner'
  ],
  mindfulness: [
    'meditation', 'mindfulness', 'breathing', 'mood tracker', 'gratitude journal',
    'sleep meditation', 'focus timer', 'mental wellness', 'self care', 'stress relief'
  ],
  avatar_identity: [
    'avatar maker', 'character creator', 'profile picture', 'ai avatar', 'digital identity',
    'memoji', 'dress up', 'virtual character', 'persona', 'face editor'
  ],
  astrology_esoterics: [
    'astrology', 'horoscope', 'tarot', 'birth chart', 'manifestation',
    'numerology', 'moon calendar', 'affirmations', 'spiritual guidance', 'zodiac'
  ],
  gaming_progression: [
    'cozy game', 'life simulation', 'idle game', 'rpg', 'quest tracker',
    'achievement tracker', 'level up', 'virtual pet', 'farming game', 'progress tracker'
  ]
};

function now() {
  return new Date().toISOString();
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

async function fetchWithTimeout(url) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    return await fetch(url, {
      signal: controller.signal,
      headers: {
        'user-agent': 'AlinaResearchOS/1.0 source-native desktop store collector',
        'accept': 'application/json'
      }
    });
  } finally {
    clearTimeout(timer);
  }
}

function row(base) {
  return {
    app_name: '',
    publisher: '',
    platform: 'mac_desktop',
    source_kind: 'mac_app_store_search_api',
    source_bucket: 'Mac App Store',
    source_url: '',
    niche: '',
    keyword: '',
    country: '',
    rank_position: '',
    app_store_id: '',
    bundle_id: '',
    category: '',
    rating: '',
    review_count: '',
    pricing_type: '',
    price_usd: '',
    iap_present: '',
    subscription_present: '',
    core_features: '',
    retention_mechanics: '',
    personalization_tags: '',
    audience_tags: '',
    monetization_notes: '',
    collected_at: now(),
    evidence_quality: 'medium_high',
    collection_status: 'ok',
    ...base
  };
}

function headers() {
  return [
    'app_name', 'publisher', 'platform', 'source_kind', 'source_bucket', 'source_url',
    'niche', 'keyword', 'country', 'rank_position', 'app_store_id', 'bundle_id',
    'category', 'rating', 'review_count', 'pricing_type', 'price_usd', 'iap_present',
    'subscription_present', 'core_features', 'retention_mechanics', 'personalization_tags',
    'audience_tags', 'monetization_notes', 'collected_at', 'evidence_quality',
    'collection_status'
  ];
}

function featureTags(text, niche) {
  const haystack = text.toLowerCase();
  const tags = [];
  if (/habit|routine|goal|streak|accountability|planner|task/.test(haystack)) tags.push('habit_or_goal_loop');
  if (/meditat|mindful|breath|calm|sleep|stress|mood/.test(haystack)) tags.push('mindfulness_or_reset');
  if (/avatar|character|profile|persona|identity|face|dress/.test(haystack)) tags.push('avatar_or_identity');
  if (/horoscope|astrology|tarot|zodiac|birth chart|moon|manifest/.test(haystack)) tags.push('symbolic_guidance');
  if (/level|quest|rpg|achievement|idle|virtual pet|progress/.test(haystack)) tags.push('progression_benchmark');
  if (!tags.length) tags.push(`${niche}_adjacent`);
  return tags.join('|');
}

function monetizationLabel(item) {
  const price = Number(item.price || 0);
  const hasIap = Array.isArray(item.screenshotUrls) || Array.isArray(item.macScreenshotUrls);
  if (price > 0) return `paid_desktop_app:${price}`;
  if (hasIap && item.formattedPrice && item.formattedPrice !== 'Free') return `visible_price:${item.formattedPrice}`;
  return item.formattedPrice === 'Free' ? 'free_or_freemium_unknown' : 'unknown';
}

async function collectQuery(niche, keyword, country) {
  const params = new URLSearchParams({
    term: keyword,
    entity: 'macSoftware',
    media: 'software',
    country,
    limit: String(RESULT_LIMIT)
  });
  const url = `https://itunes.apple.com/search?${params.toString()}`;
  try {
    const res = await fetchWithTimeout(url);
    const data = await res.json();
    const results = Array.isArray(data.results) ? data.results : [];
    if (!results.length) {
      return [row({
        app_name: `mac_app_store:${keyword}: no results`,
        source_url: url,
        niche,
        keyword,
        country,
        rank_position: 0,
        category: 'collection_note',
        core_features: 'No Mac App Store API results for query.',
        evidence_quality: 'low',
        collection_status: res.ok ? 'empty_result' : `http_${res.status}`
      })];
    }
    return results.map((item, index) => {
      const description = clean(item.description || '');
      const features = featureTags(`${item.trackName} ${item.primaryGenreName} ${description}`, niche);
      const price = Number(item.price || 0);
      return row({
        app_name: item.trackName,
        publisher: item.sellerName || item.artistName,
        source_url: item.trackViewUrl,
        niche,
        keyword,
        country,
        rank_position: index + 1,
        app_store_id: item.trackId,
        bundle_id: item.bundleId,
        category: item.primaryGenreName,
        rating: item.averageUserRating || '',
        review_count: item.userRatingCount || '',
        pricing_type: price > 0 ? 'paid' : 'free_or_freemium_unknown',
        price_usd: price,
        iap_present: '',
        subscription_present: '',
        core_features: description.slice(0, 420),
        retention_mechanics: /habit|routine|goal|streak|quest|level|progress/i.test(`${item.trackName} ${description}`) ? 'visible_loop_or_progression_language' : '',
        personalization_tags: /avatar|character|profile|persona|identity|personal|custom/i.test(`${item.trackName} ${description}`) ? 'personalization_or_identity_language' : '',
        audience_tags: features,
        monetization_notes: monetizationLabel(item),
        collection_status: res.ok ? 'ok' : `http_${res.status}`,
        evidence_quality: res.ok ? 'medium_high' : 'low'
      });
    });
  } catch (error) {
    return [row({
      app_name: `mac_app_store:${keyword}: collection error`,
      source_url: url,
      niche,
      keyword,
      country,
      rank_position: 0,
      category: 'collection_error',
      core_features: clean(error.message),
      evidence_quality: 'low',
      collection_status: `error:${clean(error.message)}`
    })];
  }
}

function dedupe(rows) {
  const seen = new Set();
  const out = [];
  for (const item of rows) {
    const key = [
      item.niche,
      item.app_store_id || item.bundle_id || item.source_url || item.app_name,
      item.keyword,
      item.country
    ].map(value => clean(value).toLowerCase()).join('|');
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(item);
  }
  return out;
}

const queryPairs = Object.entries(MARKET_QUERIES)
  .flatMap(([niche, keywords]) => keywords.map(keyword => ({ niche, keyword })))
  .slice(0, QUERY_LIMIT);

const raw = [];
for (const [index, pair] of queryPairs.entries()) {
  for (const country of COUNTRIES) {
    console.log(`[mac-app-store] ${index + 1}/${queryPairs.length} ${pair.niche} / ${pair.keyword} / ${country}`);
    raw.push(...await collectQuery(pair.niche, pair.keyword, country));
    await new Promise(resolve => setTimeout(resolve, 120));
  }
}

const rows = dedupe(raw);
writeCsv(OUT_RAW, rows, headers());

const okRows = rows.filter(item => item.collection_status === 'ok');
const uniqueAppsByNiche = new Map();
for (const item of okRows) {
  const set = uniqueAppsByNiche.get(item.niche) || new Set();
  set.add(item.app_store_id || item.bundle_id || item.source_url || item.app_name);
  uniqueAppsByNiche.set(item.niche, set);
}

const summaryRows = Object.entries(countBy(rows, 'niche')).map(([niche, count]) => {
  const nicheRows = rows.filter(item => item.niche === niche);
  const ok = nicheRows.filter(item => item.collection_status === 'ok');
  const paid = ok.filter(item => item.pricing_type === 'paid');
  return row({
    app_name: `desktop_store_summary:${niche}`,
    platform: 'summary',
    source_kind: 'desktop_store_source_summary',
    source_url: 'https://itunes.apple.com/search?entity=macSoftware',
    niche,
    country: COUNTRIES.join('|'),
    category: 'summary',
    core_features: `rows=${count}; ok=${ok.length}; unique_apps=${uniqueAppsByNiche.get(niche)?.size || 0}; paid=${paid.length}`,
    retention_mechanics: `top_categories=${Object.entries(countBy(ok, 'category')).sort((a, b) => b[1] - a[1]).slice(0, 5).map(([k, v]) => `${k}:${v}`).join('|')}`,
    personalization_tags: `feature_tags=${Object.entries(countBy(ok, 'audience_tags')).sort((a, b) => b[1] - a[1]).slice(0, 5).map(([k, v]) => `${k}:${v}`).join('|')}`,
    monetization_notes: `paid_rows=${paid.length}`,
    evidence_quality: 'medium_high',
    collection_status: 'summary'
  });
});
writeCsv(OUT_SUMMARY, summaryRows, headers());

const lines = [];
lines.push('# Desktop Store Expansion V1');
lines.push('');
lines.push(`Generated: ${now()}`);
lines.push('');
lines.push('## Purpose');
lines.push('');
lines.push('This source-native collector expands the competitor universe beyond mobile, browser extensions, itch.io, and Steam by querying the public Mac App Store/iTunes Search API. It avoids broad search engines and treats desktop apps as discovery/mechanic evidence, not final market-share proof.');
lines.push('');
lines.push('## Collection Summary');
lines.push('');
lines.push(`- Raw desktop store rows: ${rows.length}`);
lines.push(`- OK rows: ${okRows.length}`);
lines.push(`- Countries: ${COUNTRIES.join(', ')}`);
lines.push(`- Query pairs: ${queryPairs.length}`);
lines.push(`- Unique OK app IDs/bundles: ${new Set(okRows.map(item => item.app_store_id || item.bundle_id || item.source_url || item.app_name)).size}`);
lines.push('');
lines.push('Rows by market:');
lines.push('');
lines.push(bulletCounts(countBy(rows, 'niche')));
lines.push('');
lines.push('Rows by category:');
lines.push('');
lines.push(bulletCounts(Object.fromEntries(Object.entries(countBy(okRows, 'category')).sort((a, b) => b[1] - a[1]).slice(0, 12))));
lines.push('');
lines.push('## Market Summary');
lines.push('');
lines.push('| Market | Rows / OK / Unique / Paid | Top Categories | Feature Tags |');
lines.push('| --- | --- | --- | --- |');
for (const item of summaryRows) {
  lines.push(`| ${item.niche} | ${item.core_features.replace(/\|/g, '/')} | ${item.retention_mechanics.replace(/^top_categories=/, '').replace(/\|/g, '<br>')} | ${item.personalization_tags.replace(/^feature_tags=/, '').replace(/\|/g, '<br>')} |`);
}
lines.push('');
lines.push('## Claim Boundary');
lines.push('');
lines.push('- Mac App Store rows strengthen desktop-app coverage and source diversity.');
lines.push('- They should not be merged into revenue, market-share, or hidden-clone proof without manual inspection.');
lines.push('- Desktop rows are strongest as competitive-discovery, mechanic-saturation, and positioning evidence.');
lines.push('');
lines.push('## Files');
lines.push('');
lines.push(`- \`${OUT_RAW}\``);
lines.push(`- \`${OUT_SUMMARY}\``);

fs.writeFileSync(OUT_DOC, `${lines.join('\n')}\n`);

console.log(`raw=${OUT_RAW}`);
console.log(`summary=${OUT_SUMMARY}`);
console.log(`doc=${OUT_DOC}`);
console.log(`rows=${rows.length}`);
console.log(`ok=${okRows.length}`);
