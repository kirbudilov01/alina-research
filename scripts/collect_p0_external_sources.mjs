import fs from 'fs';
import fetch from 'node-fetch';
import * as cheerio from 'cheerio';

const OUT_PRODUCT_HUNT = 'data_raw/expanded_product_hunt_raw.csv';
const OUT_ALTERNATIVETO = 'data_raw/expanded_alternativeto_raw.csv';
const OUT_CHROME = 'data_raw/expanded_chrome_extensions_raw.csv';
const OUT_ALL = 'data_raw/expanded/p0_external_sources_raw.csv';
const OUT_SUMMARY = 'data_processed/p0_external_source_summary.csv';
const OUT_DOC = 'docs/competitive/p0-external-source-collection-v1.md';

const QUERY_LIMIT = Number(process.env.P0_EXTERNAL_QUERY_LIMIT || 3);
const MAX_RESULTS_PER_QUERY = Number(process.env.P0_EXTERNAL_MAX_RESULTS || 30);
const TIMEOUT_MS = Number(process.env.P0_EXTERNAL_TIMEOUT_MS || 12000);

for (const dir of ['data_raw', 'data_raw/expanded', 'data_processed', 'docs/competitive']) fs.mkdirSync(dir, { recursive: true });

const SOURCE_CONFIGS = [
  {
    source_bucket: 'Product Hunt',
    source_kind: 'product_hunt_site_search',
    platform: 'web',
    output: OUT_PRODUCT_HUNT,
    domain: 'producthunt.com',
    domainQuery: 'site:producthunt.com/products',
    evidence_quality: 'medium',
    markets: ['coaching', 'mindfulness', 'avatar_identity', 'astrology_esoterics']
  },
  {
    source_bucket: 'AlternativeTo',
    source_kind: 'alternativeto_site_search',
    platform: 'multi_platform',
    output: OUT_ALTERNATIVETO,
    domain: 'alternativeto.net',
    domainQuery: 'site:alternativeto.net',
    evidence_quality: 'medium_high',
    markets: ['coaching', 'mindfulness', 'avatar_identity']
  },
  {
    source_bucket: 'Chrome Web Store',
    source_kind: 'chrome_web_store_site_search',
    platform: 'browser_extension',
    output: OUT_CHROME,
    domain: 'chromewebstore.google.com',
    domainQuery: 'site:chromewebstore.google.com',
    evidence_quality: 'medium',
    markets: ['coaching', 'mindfulness', 'avatar_identity']
  }
];

const MARKET_QUERIES = {
  coaching: [
    'AI coach', 'habit tracker', 'accountability app', 'goal tracker', 'self improvement',
    'life coach app', 'mindset coach', 'productivity coach', 'behavior change app'
  ],
  mindfulness: [
    'meditation app', 'mindfulness app', 'breathwork', 'journaling app', 'mood tracker',
    'gratitude app', 'focus timer', 'sleep meditation', 'mental wellness'
  ],
  avatar_identity: [
    'AI avatar', 'avatar maker', 'character creator', 'digital identity', 'virtual persona',
    'AI companion', 'profile picture generator', 'vtuber avatar'
  ],
  astrology_esoterics: [
    'astrology app', 'horoscope app', 'tarot app', 'manifestation app', 'birth chart',
    'spiritual guidance', 'AI astrologer', 'numerology app'
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

async function fetchWithTimeout(url, options = {}) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    return await fetch(url, { ...options, signal: controller.signal });
  } finally {
    clearTimeout(timer);
  }
}

function decodeDuckDuckGoUrl(href) {
  if (!href) return '';
  try {
    const url = new URL(href, 'https://duckduckgo.com');
    const uddg = url.searchParams.get('uddg');
    return uddg ? decodeURIComponent(uddg) : url.href;
  } catch {
    return href;
  }
}

function titleToName(title, sourceBucket) {
  let name = clean(title)
    .replace(/\s*[-|]\s*Product Hunt.*$/i, '')
    .replace(/\s*[-|]\s*AlternativeTo.*$/i, '')
    .replace(/\s*[-|]\s*Chrome Web Store.*$/i, '')
    .replace(/\s*[-|]\s*Google Chrome.*$/i, '')
    .replace(/^AlternativeTo\s*[-:]\s*/i, '')
    .replace(/^Chrome Web Store\s*[-:]\s*/i, '');
  if (sourceBucket === 'Product Hunt') name = name.replace(/\s*—\s*.*$/, '');
  return clean(name);
}

function meaningfulTokens(keyword) {
  const stop = new Set(['app', 'apps', 'web', 'ai', 'tool', 'tools', 'software', 'platform']);
  return clean(keyword)
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter(token => token.length >= 3 && !stop.has(token));
}

function relevantToKeyword(title, snippet, keyword) {
  const tokens = meaningfulTokens(keyword);
  if (!tokens.length) return true;
  const haystack = `${title} ${snippet}`.toLowerCase();
  const matches = tokens.filter(token => haystack.includes(token)).length;
  return matches >= 1;
}

function isDirectorySelfResult(title, href, sourceBucket) {
  const name = clean(title).toLowerCase();
  if (sourceBucket === 'Product Hunt' && /the place to discover your next favorite thing/.test(name)) return true;
  if (sourceBucket === 'AlternativeTo' && /^alternativeto\b/.test(name) && !/alternatives|software/.test(name)) return true;
  if (sourceBucket === 'Chrome Web Store' && /^chrome web store\b/.test(name)) return true;
  return false;
}

function row(base) {
  return {
    app_name: '',
    publisher: '',
    platform: '',
    source_kind: '',
    source_bucket: '',
    source_url: '',
    niche: '',
    keyword: '',
    query: '',
    rank_position: '',
    category: '',
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

async function collectQuery(config, niche, keyword, queryIndex) {
  if (config.source_kind === 'chrome_web_store_site_search') {
    return collectChromeWebStoreSearch(config, niche, keyword, queryIndex);
  }

  const query = `${config.domainQuery} ${keyword}`;
  const url = `https://www.bing.com/search?q=${encodeURIComponent(query)}`;
  try {
    const res = await fetchWithTimeout(url, { headers: { 'user-agent': 'Mozilla/5.0' } });
    const html = await res.text();
    const $ = cheerio.load(html);
    const out = [];
    $('li.b_algo').slice(0, MAX_RESULTS_PER_QUERY).each((i, el) => {
      const linkEl = $(el).find('h2 a').first();
      const title = clean(linkEl.text());
      const href = linkEl.attr('href') || '';
      const snippet = clean($(el).find('.b_caption p').first().text() || $(el).text());
      if (!title || !href || !href.includes(config.domain)) return;
      if (!relevantToKeyword(title, snippet, keyword)) return;
      if (isDirectorySelfResult(title, href, config.source_bucket)) return;
      out.push(row({
        app_name: titleToName(title, config.source_bucket),
        platform: config.platform,
        source_kind: config.source_kind,
        source_bucket: config.source_bucket,
        source_url: href,
        niche,
        keyword,
        query,
        rank_position: i + 1,
        category: config.source_bucket,
        core_features: snippet,
        evidence_quality: config.evidence_quality
      }));
    });
    if (!out.length) {
      out.push(row({
        app_name: `${config.source_bucket}: no indexed results`,
        platform: config.platform,
        source_kind: config.source_kind,
        source_bucket: config.source_bucket,
        source_url: url,
        niche,
        keyword,
        query,
        rank_position: queryIndex + 1,
        category: 'collection_note',
        core_features: 'No matching indexed results extracted from Bing HTML site search.',
        evidence_quality: 'low',
        collection_status: 'empty_result'
      }));
    }
    return out;
  } catch (error) {
    return [row({
      app_name: `${config.source_bucket}: collection error`,
      platform: config.platform,
      source_kind: config.source_kind,
      source_bucket: config.source_bucket,
      source_url: url,
      niche,
      keyword,
      query,
      rank_position: queryIndex + 1,
      category: 'collection_error',
      core_features: clean(error.message),
      evidence_quality: 'low',
      collection_status: `error:${clean(error.message)}`
    })];
  }
}

async function collectChromeWebStoreSearch(config, niche, keyword, queryIndex) {
  const url = `https://chromewebstore.google.com/search/${encodeURIComponent(keyword)}`;
  try {
    const res = await fetchWithTimeout(url, { headers: { 'user-agent': 'Mozilla/5.0' } });
    const html = await res.text();
    const $ = cheerio.load(html);
    const out = [];
    $('a[href^="./detail"]').slice(0, MAX_RESULTS_PER_QUERY).each((i, el) => {
      const href = $(el).attr('href') || '';
      const labelIds = clean($(el).attr('aria-labelledby') || '').split(/\s+/).filter(Boolean);
      const descIds = clean($(el).attr('aria-describedby') || '').split(/\s+/).filter(Boolean);
      const title = clean(labelIds.map(id => $(`#${id}`).text()).join(' ')) || clean($(el).parent().text()).slice(0, 90);
      const snippet = clean(descIds.map(id => $(`#${id}`).text()).join(' ')) || clean($(el).parent().text()).slice(0, 500);
      if (!title || !relevantToKeyword(title, snippet, keyword)) return;
      const ratingMatch = snippet.match(/Average rating ([0-9.]+) out of 5/i);
      out.push(row({
        app_name: titleToName(title, config.source_bucket),
        platform: config.platform,
        source_kind: config.source_kind,
        source_bucket: config.source_bucket,
        source_url: new URL(href.replace(/^\.\//, '/'), 'https://chromewebstore.google.com').href,
        niche,
        keyword,
        query: `chromewebstore search ${keyword}`,
        rank_position: i + 1,
        category: config.source_bucket,
        rating: ratingMatch ? ratingMatch[1] : '',
        core_features: snippet,
        evidence_quality: config.evidence_quality
      }));
    });
    if (!out.length) {
      out.push(row({
        app_name: `${config.source_bucket}: no indexed results`,
        platform: config.platform,
        source_kind: config.source_kind,
        source_bucket: config.source_bucket,
        source_url: url,
        niche,
        keyword,
        query: `chromewebstore search ${keyword}`,
        rank_position: queryIndex + 1,
        category: 'collection_note',
        core_features: 'No matching Chrome Web Store search results extracted.',
        evidence_quality: 'low',
        collection_status: 'empty_result'
      }));
    }
    return out;
  } catch (error) {
    return [row({
      app_name: `${config.source_bucket}: collection error`,
      platform: config.platform,
      source_kind: config.source_kind,
      source_bucket: config.source_bucket,
      source_url: url,
      niche,
      keyword,
      query: `chromewebstore search ${keyword}`,
      rank_position: queryIndex + 1,
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
  for (const r of rows) {
    const key = `${r.source_kind}|${r.source_url}`.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(r);
  }
  return out;
}

const allRows = [];
const rowsByOutput = new Map(SOURCE_CONFIGS.map(config => [config.output, []]));

for (const config of SOURCE_CONFIGS) {
  let marketKeywordPairs = [];
  for (const market of config.markets) {
    for (const keyword of MARKET_QUERIES[market] || []) marketKeywordPairs.push([market, keyword]);
  }
  if (QUERY_LIMIT > 0) marketKeywordPairs = marketKeywordPairs.slice(0, QUERY_LIMIT);
  for (const [index, [niche, keyword]] of marketKeywordPairs.entries()) {
    console.log(`[${config.source_bucket}] ${index + 1}/${marketKeywordPairs.length} ${niche} :: ${keyword}`);
    const rows = await collectQuery(config, niche, keyword, index);
    rowsByOutput.get(config.output).push(...rows);
    allRows.push(...rows);
    await new Promise(resolve => setTimeout(resolve, 250));
  }
}

for (const [file, rows] of rowsByOutput.entries()) {
  writeCsv(file, dedupe(rows), headers());
}

const dedupedAll = dedupe(allRows);
writeCsv(OUT_ALL, dedupedAll, headers());

const summaryRows = SOURCE_CONFIGS.map(config => {
  const rows = dedupe(rowsByOutput.get(config.output) || []);
  const ok = rows.filter(r => r.collection_status === 'ok');
  return {
    source_bucket: config.source_bucket,
    source_kind: config.source_kind,
    raw_rows: rows.length,
    usable_rows: ok.length,
    empty_or_error_rows: rows.length - ok.length,
    markets: [...new Set(rows.map(r => r.niche).filter(Boolean))].join('|'),
    target_output: config.output,
    top_examples: ok.slice(0, 8).map(r => r.app_name).join('|')
  };
});

writeCsv(OUT_SUMMARY, summaryRows, [
  'source_bucket', 'source_kind', 'raw_rows', 'usable_rows',
  'empty_or_error_rows', 'markets', 'target_output', 'top_examples'
]);

const lines = [];
lines.push('# P0 External Source Collection V1');
lines.push('');
lines.push(`Generated: ${new Date().toISOString()}`);
lines.push('');
lines.push('## Scope');
lines.push('');
lines.push('This collector executes a controlled P0 source-expansion smoke pass using indexed search pages for Product Hunt and AlternativeTo plus direct Chrome Web Store search pages. It is intentionally small by default and is a discovery layer, not a final detail-page parser.');
lines.push('');
lines.push('## Coverage');
lines.push('');
lines.push(`- Deduplicated P0 external rows: ${dedupedAll.length}`);
lines.push(`- Usable rows: ${dedupedAll.filter(r => r.collection_status === 'ok').length}`);
lines.push('');
lines.push('Rows by source bucket:');
lines.push('');
lines.push(bulletCounts(countBy(dedupedAll, 'source_bucket')));
lines.push('');
lines.push('Rows by market:');
lines.push('');
lines.push(bulletCounts(countBy(dedupedAll, 'niche')));
lines.push('');
lines.push('## Source Summary');
lines.push('');
lines.push('| Source | Raw Rows | Usable | Output | Examples |');
lines.push('| --- | ---: | ---: | --- | --- |');
for (const row of summaryRows) {
  lines.push(`| ${row.source_bucket} | ${row.raw_rows} | ${row.usable_rows} | \`${row.target_output}\` | ${row.top_examples.replace(/\|/g, '<br>')} |`);
}
lines.push('');
lines.push('## Interpretation');
lines.push('');
lines.push('- This pass should be read as a controlled method test, not a heavy search-engine crawl.');
lines.push('- Chrome Web Store returned usable browser-extension candidates and reduces mobile-store bias.');
lines.push('- Product Hunt and AlternativeTo returned empty indexed-search attempts in this smoke pass; those rows are retained as source-attempt evidence, not competitor evidence.');
lines.push('- The next pass should detail-fetch top Chrome candidates and use source-native or curated exports for Product Hunt/AlternativeTo rather than relying only on search result pages.');
lines.push('');
lines.push('## Files');
lines.push('');
lines.push(`- \`${OUT_PRODUCT_HUNT}\``);
lines.push(`- \`${OUT_ALTERNATIVETO}\``);
lines.push(`- \`${OUT_CHROME}\``);
lines.push(`- \`${OUT_ALL}\``);
lines.push(`- \`${OUT_SUMMARY}\``);
fs.writeFileSync(OUT_DOC, `${lines.join('\n')}\n`);

console.log(`product_hunt=${OUT_PRODUCT_HUNT}`);
console.log(`alternativeto=${OUT_ALTERNATIVETO}`);
console.log(`chrome=${OUT_CHROME}`);
console.log(`all=${OUT_ALL}`);
console.log(`summary=${OUT_SUMMARY}`);
console.log(`doc=${OUT_DOC}`);
console.log(`deduped_rows=${dedupedAll.length}`);
