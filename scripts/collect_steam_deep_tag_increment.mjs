import fs from 'fs';
import fetch from 'node-fetch';
import * as cheerio from 'cheerio';

const OUT_RAW = 'data_raw/expanded_steam_deep_tags_raw.csv';
const OUT_SUMMARY = 'data_processed/steam_deep_tag_source_summary.csv';
const OUT_DOC = 'docs/competitive/steam-deep-tag-increment-v1.md';

const MAX_PAGES_PER_TAG = Number(process.env.STEAM_DEEP_TAG_MAX_PAGES || 8);
const PAGE_SIZE = Number(process.env.STEAM_DEEP_TAG_PAGE_SIZE || 100);
const TIMEOUT_MS = Number(process.env.STEAM_DEEP_TAG_TIMEOUT_MS || 12000);

for (const dir of ['data_raw', 'data_processed', 'docs/competitive']) fs.mkdirSync(dir, { recursive: true });

const TAG_PLAN = {
  gaming: [
    'Incremental', 'Inventory Management', 'Base Building', 'Open World', 'Singleplayer',
    'Turn-Based', 'Strategy', 'Card Game', 'Tabletop', 'Automation', 'Economy'
  ],
  mindfulness: [
    'Beautiful', 'Philosophical', 'Narrative', 'Short', 'Minimalist',
    'Experimental', 'Soundtrack', 'Hand-drawn', 'Surreal', 'Abstract'
  ],
  avatar_identity: [
    'Character Action Game', 'Otome', 'JRPG', 'LGBTQ+', 'Romance',
    'Party-Based RPG', 'CRPG', 'Dating Sim', 'Multiple Endings'
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
    source_kind: 'steam_deep_tag_search',
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
  return new Map(tags.map(tag => [clean(tag.name).toLowerCase(), String(tag.tagid)]));
}

function parseResultsHtml(html, niche, tagName, tagId, page, start, pageUrl) {
  const $ = cheerio.load(html || '');
  const out = [];
  $('a.search_result_row').each((i, el) => {
    const item = $(el);
    const href = item.attr('href') || '';
    const title = clean(item.find('.title').first().text());
    if (!title || !href) return;
    const release = clean(item.find('.search_released').first().text());
    const price = clean(item.find('.discount_final_price').first().text() || item.find('.search_price').first().text());
    const review = clean(item.find('.search_review_summary').attr('data-tooltip-html') || item.find('.search_review_summary').attr('aria-label') || '');
    const category = item.find('.platform_img').map((_, img) => clean($(img).attr('class'))).get().join('|');
    out.push(row({
      app_name: title,
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
      retention_mechanics: 'steam_deep_progression_or_mechanic_benchmark',
      personalization_tags: /character|otome|jrpg|romance|lgbtq|rpg/i.test(tagName) ? 'identity_or_avatar_benchmark_possible' : '',
      audience_tags: /beautiful|philosophical|minimalist|surreal|abstract/i.test(tagName) ? 'reflective_or_ritual_benchmark_possible' : '',
      monetization_notes: price ? `Visible Steam price label: ${price}` : ''
    }));
  });
  if (!out.length) {
    out.push(row({
      app_name: `steam_deep:${tagName}: no parsed results`,
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
      const text = await res.text();
      let html = text;
      try {
        const data = JSON.parse(text);
        html = data.results_html || '';
      } catch {
        // Steam can return the HTML fragment directly.
      }
      rows.push(...parseResultsHtml(html, niche, tagName, tagId, page + 1, start, url));
    } catch (error) {
      rows.push(row({
        app_name: `steam_deep:${tagName}: collection error`,
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
      console.log(`[steam-deep] ${niche}:${tagName}:${tagId || 'missing'}`);
      if (!tagId) {
        raw.push(row({
          app_name: `steam_deep:${tagName}: missing tag id`,
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
    app_name: `steam_deep_tag_summary:${niche}`,
    platform: 'summary',
    source_kind: 'steam_deep_tag_source_summary',
    source_bucket: 'Steam',
    source_url: 'https://store.steampowered.com/search/results/',
    niche,
    core_features: `rows=${count}; ok=${rows.filter(r => r.niche === niche && r.collection_status === 'ok').length}`,
    collected_at: now(),
    evidence_quality: 'medium',
    collection_status: 'summary'
  }));
  writeCsv(OUT_SUMMARY, summaryRows, headers());

  const lines = [];
  lines.push('# Steam Deep Tag Increment V1');
  lines.push('');
  lines.push(`Generated: ${new Date().toISOString()}`);
  lines.push('');
  lines.push('## Purpose');
  lines.push('');
  lines.push('This additive collector expands the Steam benchmark/mechanics corpus without overwriting the main Steam tag file. It targets extra progression, identity, reflective, and narrative tags that help the Alina research compare adjacent loops and mechanics.');
  lines.push('');
  lines.push('## Summary');
  lines.push('');
  lines.push(`- Rows: ${rows.length}`);
  lines.push(`- OK rows: ${okRows.length}`);
  lines.push(`- Tags attempted: ${Object.values(TAG_PLAN).flat().length}`);
  lines.push(`- Max pages per tag: ${MAX_PAGES_PER_TAG}`);
  lines.push('');
  lines.push('Rows by niche:');
  lines.push('');
  lines.push(bulletCounts(countBy(rows, 'niche')));
  lines.push('');
  lines.push('## Claim Boundary');
  lines.push('');
  lines.push('Steam deep tags are benchmark/mechanics evidence, not direct consumer-app competitor proof. They should influence product-loop and whitespace reasoning only after cross-source deduplication and manual relevance review.');
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
