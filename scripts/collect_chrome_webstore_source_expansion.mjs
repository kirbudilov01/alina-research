import fs from 'fs';
import fetch from 'node-fetch';
import * as cheerio from 'cheerio';

const OUT_RAW = 'data_raw/expanded_chrome_extensions_raw.csv';
const OUT_SUMMARY = 'data_processed/chrome_webstore_source_expansion_summary.csv';
const OUT_DOC = 'docs/competitive/chrome-webstore-source-expansion-v1.md';

const QUERY_LIMIT = Number(process.env.CHROME_WEBSTORE_QUERY_LIMIT || 999);
const MAX_RESULTS_PER_QUERY = Number(process.env.CHROME_WEBSTORE_MAX_RESULTS || 18);
const TIMEOUT_MS = Number(process.env.CHROME_WEBSTORE_TIMEOUT_MS || 12000);

for (const dir of ['data_raw', 'data_processed', 'docs/competitive']) fs.mkdirSync(dir, { recursive: true });

const MARKET_QUERIES = {
  coaching: [
    'AI coach', 'habit tracker', 'goal tracker', 'accountability', 'self improvement',
    'productivity coach', 'daily routine', 'behavior change'
  ],
  mindfulness: [
    'meditation', 'mindfulness', 'breathwork', 'journaling', 'mood tracker',
    'gratitude', 'focus timer', 'mental wellness'
  ],
  avatar_identity: [
    'AI avatar', 'avatar maker', 'character creator', 'digital identity',
    'AI companion', 'persona', 'profile picture', 'virtual character'
  ],
  astrology_esoterics: [
    'astrology', 'horoscope', 'tarot', 'manifestation', 'birth chart',
    'spiritual guidance', 'numerology', 'affirmations'
  ],
  gaming_progression: [
    'gamification', 'xp tracker', 'level up', 'quest tracker', 'streak tracker',
    'progress tracker', 'RPG productivity', 'achievement tracker'
  ]
};

function now() {
  return new Date().toISOString();
}

function clean(value) {
  return String(value ?? '')
    .replace(/&amp;/g, '&')
    .replace(/&#39;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/\s+/g, ' ')
    .trim();
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

function meaningfulTokens(keyword) {
  const stop = new Set(['app', 'apps', 'web', 'ai', 'tool', 'tools', 'software', 'extension']);
  return clean(keyword)
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter(token => token.length >= 3 && !stop.has(token));
}

function relevantToKeyword(title, snippet, keyword) {
  const tokens = meaningfulTokens(keyword);
  if (!tokens.length) return true;
  const haystack = `${title} ${snippet}`.toLowerCase();
  return tokens.some(token => haystack.includes(token));
}

async function fetchWithTimeout(url) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    return await fetch(url, {
      signal: controller.signal,
      headers: {
        'user-agent': 'Mozilla/5.0',
        'accept-language': 'en-US,en;q=0.9'
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
    platform: 'browser_extension',
    source_kind: 'chrome_web_store_native_search',
    source_bucket: 'Chrome Web Store',
    source_url: '',
    niche: '',
    keyword: '',
    query: '',
    rank_position: '',
    category: 'Chrome Web Store',
    rating: '',
    review_count: '',
    pricing_type: '',
    iap_present: '',
    subscription_present: '',
    core_features: '',
    retention_mechanics: '',
    personalization_tags: '',
    audience_tags: '',
    monetization_notes: '',
    collected_at: now(),
    evidence_quality: 'medium',
    collection_status: 'ok',
    ...base
  };
}

function headers() {
  return [
    'app_name', 'publisher', 'platform', 'source_kind', 'source_bucket', 'source_url',
    'niche', 'keyword', 'query', 'rank_position', 'category', 'rating', 'review_count',
    'pricing_type', 'iap_present', 'subscription_present', 'core_features',
    'retention_mechanics', 'personalization_tags', 'audience_tags', 'monetization_notes',
    'collected_at', 'evidence_quality', 'collection_status'
  ];
}

async function collectChromeQuery(niche, keyword, queryIndex) {
  const url = `https://chromewebstore.google.com/search/${encodeURIComponent(keyword)}`;
  try {
    const res = await fetchWithTimeout(url);
    const html = await res.text();
    const $ = cheerio.load(html);
    const out = [];
    $('a[href^="./detail"]').slice(0, MAX_RESULTS_PER_QUERY).each((i, el) => {
      const href = $(el).attr('href') || '';
      const labelIds = clean($(el).attr('aria-labelledby') || '').split(/\s+/).filter(Boolean);
      const descIds = clean($(el).attr('aria-describedby') || '').split(/\s+/).filter(Boolean);
      const title = clean(labelIds.map(id => $(`#${id}`).text()).join(' ')) || clean($(el).parent().text()).slice(0, 90);
      const snippet = clean(descIds.map(id => $(`#${id}`).text()).join(' ')) || clean($(el).parent().text()).slice(0, 500);
      if (!title || !href || !relevantToKeyword(title, snippet, keyword)) return;
      const ratingMatch = snippet.match(/Average rating ([0-9.]+) out of 5/i);
      const reviewMatch = snippet.match(/([0-9,.]+)\s+ratings?/i);
      out.push(row({
        app_name: title,
        source_url: new URL(href.replace(/^\.\//, '/'), 'https://chromewebstore.google.com').href,
        niche,
        keyword,
        query: `chromewebstore native search ${keyword}`,
        rank_position: i + 1,
        rating: ratingMatch ? ratingMatch[1] : '',
        review_count: reviewMatch ? reviewMatch[1].replace(/,/g, '') : '',
        core_features: snippet,
        collection_status: res.ok ? 'ok' : `http_${res.status}`,
        evidence_quality: res.ok ? 'medium' : 'low'
      }));
    });
    if (!out.length) {
      out.push(row({
        app_name: 'Chrome Web Store: no extracted results',
        source_url: url,
        niche,
        keyword,
        query: `chromewebstore native search ${keyword}`,
        rank_position: queryIndex + 1,
        category: 'collection_note',
        core_features: 'No matching Chrome Web Store search results extracted from public HTML.',
        evidence_quality: 'low',
        collection_status: res.ok ? 'empty_result' : `http_${res.status}`
      }));
    }
    return out;
  } catch (error) {
    return [row({
      app_name: 'Chrome Web Store: collection error',
      source_url: url,
      niche,
      keyword,
      query: `chromewebstore native search ${keyword}`,
      rank_position: queryIndex + 1,
      category: 'collection_error',
      core_features: clean(error.message),
      evidence_quality: 'low',
      collection_status: `error:${clean(error.message)}`
    })];
  }
}

const queryPairs = Object.entries(MARKET_QUERIES)
  .flatMap(([niche, keywords]) => keywords.map(keyword => ({ niche, keyword })))
  .slice(0, QUERY_LIMIT);

const collected = [];
for (const [index, pair] of queryPairs.entries()) {
  console.log(`[Chrome native] ${index + 1}/${queryPairs.length} ${pair.niche} / ${pair.keyword}`);
  collected.push(...await collectChromeQuery(pair.niche, pair.keyword, index));
  await new Promise(resolve => setTimeout(resolve, 250));
}

const seen = new Set();
const deduped = [];
for (const item of collected) {
  const key = item.source_url || `${item.niche}:${item.keyword}:${item.app_name}`;
  if (seen.has(key)) continue;
  seen.add(key);
  deduped.push(item);
}

const summary = [
  ...Object.entries(countBy(deduped, 'niche')).map(([bucket, count]) => ({ summary_type: 'niche', bucket, count })),
  ...Object.entries(countBy(deduped, 'collection_status')).map(([bucket, count]) => ({ summary_type: 'collection_status', bucket, count }))
];

writeCsv(OUT_RAW, deduped, headers());
writeCsv(OUT_SUMMARY, summary, ['summary_type', 'bucket', 'count']);

const okRows = deduped.filter(row => row.collection_status === 'ok');
const lines = [];
lines.push('# Chrome Web Store Source Expansion V1');
lines.push('');
lines.push(`Generated: ${new Date().toISOString()}`);
lines.push('');
lines.push('## Purpose');
lines.push('');
lines.push('This source-native collector expands browser-extension evidence without using broad search engines. It queries public Chrome Web Store search pages across the five research markets and deduplicates by source URL.');
lines.push('');
lines.push('## Summary');
lines.push('');
lines.push(`- Query pairs attempted: ${queryPairs.length}`);
lines.push(`- Raw extracted rows after dedupe: ${deduped.length}`);
lines.push(`- OK rows: ${okRows.length}`);
lines.push(`- Max results per query: ${MAX_RESULTS_PER_QUERY}`);
lines.push('');
lines.push('Rows by market:');
lines.push('');
lines.push(bulletCounts(countBy(deduped, 'niche')));
lines.push('');
lines.push('Collection statuses:');
lines.push('');
lines.push(bulletCounts(countBy(deduped, 'collection_status')));
lines.push('');
lines.push('## Interpretation');
lines.push('');
lines.push('- Browser extensions are not the main consumer-mobile competitor set, but they are useful evidence for lightweight coaching, habit capture, accountability, progress, and AI feedback mechanics.');
lines.push('- Treat this as source-universe and mechanic evidence, not market-size or revenue proof.');
lines.push('- The detail enrichment script classifies fit bands and mechanic battlecards after this raw expansion.');
lines.push('');
lines.push('## Files');
lines.push('');
lines.push(`- \`${OUT_RAW}\``);
lines.push(`- \`${OUT_SUMMARY}\``);
fs.writeFileSync(OUT_DOC, `${lines.join('\n')}\n`);

console.log(`raw=${OUT_RAW}`);
console.log(`summary=${OUT_SUMMARY}`);
console.log(`doc=${OUT_DOC}`);
console.log(`queries=${queryPairs.length}`);
console.log(`rows=${deduped.length}`);
console.log(`ok=${okRows.length}`);
