import fs from 'fs';
import fetch from 'node-fetch';
import * as cheerio from 'cheerio';

const OUT_RAW = 'data_raw/expanded_steam_tags_raw.csv';
const OUT_SUMMARY = 'data_processed/steam_tag_source_summary.csv';
const OUT_DOC = 'docs/competitive/steam-tag-expansion-v1.md';

const MAX_PAGES_PER_TAG = Number(process.env.STEAM_TAG_MAX_PAGES || 3);
const PAGE_SIZE = Number(process.env.STEAM_TAG_PAGE_SIZE || 100);
const TIMEOUT_MS = Number(process.env.STEAM_TAG_TIMEOUT_MS || 12000);

for (const dir of ['data_raw', 'data_processed', 'docs/competitive']) fs.mkdirSync(dir, { recursive: true });

const TAG_PLAN = {
  gaming: [
    'Cozy', 'Life Sim', 'Relaxing', 'Casual', 'Idler', 'RPG', 'Simulation', 'Wholesome',
    'Cute', 'Farming Sim', 'Management', 'Choices Matter'
  ],
  mindfulness: [
    'Relaxing', 'Walking Simulator', 'Atmospheric', 'Psychological', 'Education', 'Nature'
  ],
  avatar_identity: [
    'Character Customization', 'Life Sim', 'Dating Sim', 'Visual Novel', 'Anime', 'Choices Matter'
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
        'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
        'accept': 'application/json,text/html,*/*'
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
    platform: 'pc',
    source_kind: 'steam_tag_search',
    source_bucket: 'Steam',
    source_url: '',
    niche: '',
    keyword: '',
    tag_name: '',
    tag_id: '',
    page: '',
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
    'niche', 'keyword', 'tag_name', 'tag_id', 'page', 'rank_position', 'category',
    'rating', 'review_count', 'pricing_type', 'iap_present', 'subscription_present',
    'core_features', 'retention_mechanics', 'personalization_tags', 'audience_tags',
    'monetization_notes', 'collected_at', 'evidence_quality', 'collection_status'
  ];
}

async function loadTagIds() {
  const res = await fetchWithTimeout('https://store.steampowered.com/tagdata/populartags/english');
  const tags = await res.json();
  const map = new Map(tags.map(tag => [clean(tag.name).toLowerCase(), String(tag.tagid)]));
  return map;
}

function parseResultsHtml(html, niche, tagName, tagId, page, start, pageUrl) {
  const $ = cheerio.load(html || '');
  const out = [];
  $('a.search_result_row').each((i, el) => {
    const item = $(el);
    const href = item.attr('href') || '';
    const title = clean(item.find('.title').first().text());
    if (!title || !href) return;
    const appId = item.attr('data-ds-appid') || '';
    const release = clean(item.find('.search_released').first().text());
    const price = clean(item.find('.discount_final_price').first().text() || item.find('.search_price').first().text());
    const review = clean(item.find('.search_review_summary').attr('data-tooltip-html') || item.find('.search_review_summary').attr('aria-label') || '');
    const category = item.find('.platform_img').map((_, img) => clean($(img).attr('class'))).get().join('|');
    out.push(row({
      app_name: title,
      publisher: '',
      source_url: href,
      niche,
      keyword: tagName,
      tag_name: tagName,
      tag_id: tagId,
      page,
      rank_position: start + i + 1,
      category,
      rating: review,
      pricing_type: price || 'unknown_or_free',
      core_features: release ? `Steam release: ${release}` : '',
      retention_mechanics: 'steam_progression_or_game_loop_benchmark',
      personalization_tags: /character|life sim|dating|visual novel|anime/i.test(tagName) ? 'identity_or_avatar_benchmark_possible' : '',
      audience_tags: /cozy|relaxing|casual|wholesome/i.test(tagName) ? 'casual_gamers|cozy_progression_users' : '',
      monetization_notes: price ? `Visible Steam price label: ${price}` : '',
      evidence_quality: 'medium'
    }));
  });

  if (!out.length) {
    out.push(row({
      app_name: `steam:${tagName}: no parsed results`,
      source_url: pageUrl,
      niche,
      keyword: tagName,
      tag_name: tagName,
      tag_id: tagId,
      page,
      rank_position: start,
      category: 'collection_note',
      core_features: 'No search_result_row parsed from Steam results HTML.',
      evidence_quality: 'low',
      collection_status: 'empty_result'
    }));
  }
  return out;
}

async function collectTag(niche, tagName, tagId) {
  const rows = [];
  for (let page = 0; page < MAX_PAGES_PER_TAG; page += 1) {
    const start = page * PAGE_SIZE;
    const url = `https://store.steampowered.com/search/results/?query&start=${start}&count=${PAGE_SIZE}&dynamic_data=&sort_by=_ASC&tags=${encodeURIComponent(tagId)}&infinite=1`;
    try {
      const res = await fetchWithTimeout(url);
      const data = await res.json();
      rows.push(...parseResultsHtml(data.results_html, niche, tagName, tagId, page + 1, start, url));
    } catch (error) {
      rows.push(row({
        app_name: `steam:${tagName}: collection error`,
        source_url: url,
        niche,
        keyword: tagName,
        tag_name: tagName,
        tag_id: tagId,
        page: page + 1,
        rank_position: start,
        category: 'collection_error',
        core_features: clean(error.message),
        evidence_quality: 'low',
        collection_status: 'error'
      }));
    }
  }
  return rows;
}

function dedupe(rows) {
  const seen = new Set();
  const out = [];
  for (const item of rows) {
    const key = [item.niche, item.source_url || item.app_name, item.tag_id].map(v => clean(v).toLowerCase()).join('|');
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(item);
  }
  return out;
}

async function run() {
  const tagIds = await loadTagIds();
  const raw = [];
  for (const [niche, tags] of Object.entries(TAG_PLAN)) {
    for (const tagName of tags) {
      const tagId = tagIds.get(tagName.toLowerCase());
      console.log(`[steam] ${niche}:${tagName}:${tagId || 'missing'}`);
      if (!tagId) {
        raw.push(row({
          app_name: `steam:${tagName}: missing tag id`,
          source_url: 'https://store.steampowered.com/tagdata/populartags/english',
          niche,
          keyword: tagName,
          tag_name: tagName,
          category: 'collection_error',
          core_features: 'Tag name was not present in Steam popular tag data.',
          evidence_quality: 'low',
          collection_status: 'missing_tag'
        }));
        continue;
      }
      raw.push(...await collectTag(niche, tagName, tagId));
    }
  }

  const rows = dedupe(raw);
  const okRows = rows.filter(r => r.collection_status === 'ok');
  writeCsv(OUT_RAW, rows, headers());

  const summaryRows = Object.entries(countBy(rows, 'niche')).map(([niche, count]) => ({
    app_name: `steam_tag_summary:${niche}`,
    publisher: '',
    platform: 'summary',
    source_kind: 'steam_tag_source_summary',
    source_bucket: 'Steam',
    source_url: 'https://store.steampowered.com/search/results/',
    niche,
    keyword: '',
    tag_name: '',
    tag_id: '',
    page: '',
    rank_position: '',
    category: '',
    rating: '',
    review_count: '',
    pricing_type: '',
    iap_present: '',
    subscription_present: '',
    core_features: `rows=${count}; ok=${okRows.filter(r => r.niche === niche).length}`,
    retention_mechanics: '',
    personalization_tags: '',
    audience_tags: '',
    monetization_notes: '',
    collected_at: now(),
    evidence_quality: 'medium',
    collection_status: 'summary'
  }));
  writeCsv(OUT_SUMMARY, summaryRows, headers());

  const lines = [];
  lines.push('# Steam Tag Expansion V1');
  lines.push('');
  lines.push(`Generated: ${now()}`);
  lines.push('');
  lines.push('## Purpose');
  lines.push('');
  lines.push('This collector expands the source universe through Steam tag search results. Treat Steam rows as PC mechanic, progression, avatar/identity, and saturation evidence, not direct mobile wellness market proof.');
  lines.push('');
  lines.push('## Summary');
  lines.push('');
  lines.push(`- Raw/deduped rows: ${rows.length}`);
  lines.push(`- OK rows: ${okRows.length}`);
  lines.push(`- Tags collected: ${Object.values(TAG_PLAN).reduce((sum, tags) => sum + tags.length, 0)}`);
  lines.push(`- Pages per tag: ${MAX_PAGES_PER_TAG}`);
  lines.push(`- Page size: ${PAGE_SIZE}`);
  lines.push('');
  lines.push('Rows by market:');
  lines.push('');
  lines.push(bulletCounts(countBy(rows, 'niche')));
  lines.push('');
  lines.push('Rows by status:');
  lines.push('');
  lines.push(bulletCounts(countBy(rows, 'collection_status')));
  lines.push('');
  lines.push('## Evidence Caveat');
  lines.push('');
  lines.push('- Steam rows are source expansion and mechanics evidence. Do not score them as direct Alina competitors without manual relevance review.');
  lines.push('- Gaming rows are useful for progression, cozy, idle, RPG, and loop design benchmarks.');
  lines.push('- Mindfulness/avatar rows are useful as metaphor and UX pattern discovery, but the consumer context differs from a mobile daily companion.');
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
}

run().catch(error => {
  console.error(error);
  process.exit(1);
});
