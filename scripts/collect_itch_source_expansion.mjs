import fs from 'fs';
import fetch from 'node-fetch';
import * as cheerio from 'cheerio';

const OUT_RAW = 'data_raw/expanded_itch_raw.csv';
const OUT_SUMMARY = 'data_processed/itch_source_summary.csv';
const OUT_DOC = 'docs/competitive/itch-source-expansion-v1.md';

const MAX_PAGES_PER_TAG = Number(process.env.ITCH_MAX_PAGES_PER_TAG || 3);
const TIMEOUT_MS = Number(process.env.ITCH_TIMEOUT_MS || 12000);

for (const dir of ['data_raw', 'data_processed', 'docs/competitive']) fs.mkdirSync(dir, { recursive: true });

const TAGS = {
  gaming: [
    'cozy', 'idle', 'life-simulation', 'relaxing', 'casual', 'wholesome', 'slice-of-life', 'rpg'
  ],
  mindfulness: [
    'meditation', 'relaxing', 'mental-health', 'breathing', 'self-care', 'calming'
  ],
  avatar_identity: [
    'character-customization', 'character-creator', 'avatar', 'dress-up', 'virtual-pet'
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
        'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
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
    platform: 'web_game',
    source_kind: 'itch_tag_page',
    source_bucket: 'itch.io',
    source_url: '',
    niche: '',
    keyword: '',
    tag: '',
    page: '',
    rank_position: '',
    category: 'itch.io game',
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
    evidence_quality: 'medium_low',
    collection_status: 'ok',
    ...base
  };
}

function headers() {
  return [
    'app_name', 'publisher', 'platform', 'source_kind', 'source_bucket', 'source_url',
    'niche', 'keyword', 'tag', 'page', 'rank_position', 'category', 'rating', 'review_count',
    'pricing_type', 'iap_present', 'subscription_present', 'core_features',
    'retention_mechanics', 'personalization_tags', 'audience_tags', 'monetization_notes',
    'collected_at', 'evidence_quality', 'collection_status'
  ];
}

function parseGameCells(html, niche, tag, page, pageUrl) {
  const $ = cheerio.load(html);
  const rows = [];
  const cells = $('.game_cell, .game_cell_data, .browse_game, .game_grid_widget .game_cell');
  const seenUrls = new Set();

  cells.each((i, el) => {
    const cell = $(el);
    const linkEl = cell.find('a.title, .game_title a, a.game_link, a.thumb_link').first();
    const href = linkEl.attr('href') || cell.find('a').first().attr('href') || '';
    const title = clean(linkEl.text() || cell.find('.title').first().text() || cell.find('.game_title').first().text());
    if (!title || !href || seenUrls.has(href)) return;
    seenUrls.add(href);
    const author = clean(cell.find('.game_author a, .game_author, .author').first().text());
    const desc = clean(cell.find('.game_text, .game_desc, .excerpt, .sub').first().text());
    const priceText = clean(cell.find('.price_value, .sale_price, .price_tag, .price').first().text());
    const tags = clean(cell.find('.game_genre, .tags, .game_tags').text());
    rows.push(row({
      app_name: title,
      publisher: author,
      source_url: href.startsWith('http') ? href : new URL(href, 'https://itch.io').href,
      niche,
      keyword: tag,
      tag,
      page,
      rank_position: i + 1,
      category: tags || 'itch.io game',
      pricing_type: priceText || 'unknown_or_free',
      core_features: desc,
      monetization_notes: priceText ? `Visible itch price label: ${priceText}` : '',
      retention_mechanics: niche === 'gaming' ? 'progression_or_loop_benchmark_possible' : '',
      personalization_tags: niche === 'avatar_identity' ? 'avatar_or_identity_benchmark_possible' : '',
      audience_tags: niche === 'mindfulness' ? 'calm_or_self_care_benchmark_possible' : ''
    }));
  });

  if (rows.length) return rows;

  const fallbackLinks = $('a.title, a.game_link')
    .map((i, el) => ({ title: clean($(el).text()), href: $(el).attr('href') || '' }))
    .get()
    .filter(link => link.title && link.href && /itch\.io/.test(link.href));

  for (const [i, link] of fallbackLinks.entries()) {
    rows.push(row({
      app_name: link.title,
      source_url: link.href.startsWith('http') ? link.href : new URL(link.href, 'https://itch.io').href,
      niche,
      keyword: tag,
      tag,
      page,
      rank_position: i + 1,
      core_features: 'Fallback extracted from itch.io tag page link list.',
      evidence_quality: 'low'
    }));
  }

  if (!rows.length) {
    rows.push(row({
      app_name: `itch:${tag}: no parsed results`,
      source_url: pageUrl,
      niche,
      keyword: tag,
      tag,
      page,
      rank_position: 0,
      category: 'collection_note',
      core_features: 'No game cells parsed from itch.io tag page.',
      evidence_quality: 'low',
      collection_status: 'empty_result'
    }));
  }
  return rows;
}

async function collectTag(niche, tag) {
  const rows = [];
  for (let page = 1; page <= MAX_PAGES_PER_TAG; page += 1) {
    const url = `https://itch.io/games/tag-${encodeURIComponent(tag)}?page=${page}`;
    try {
      const res = await fetchWithTimeout(url);
      const html = await res.text();
      rows.push(...parseGameCells(html, niche, tag, page, url));
    } catch (error) {
      rows.push(row({
        app_name: `itch:${tag}: collection error`,
        source_url: url,
        niche,
        keyword: tag,
        tag,
        page,
        rank_position: 0,
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
    const key = [item.niche, item.source_url || item.app_name, item.tag].map(v => clean(v).toLowerCase()).join('|');
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(item);
  }
  return out;
}

async function run() {
  const raw = [];
  for (const [niche, tags] of Object.entries(TAGS)) {
    for (const tag of tags) {
      console.log(`[itch] ${niche}:${tag}`);
      raw.push(...await collectTag(niche, tag));
    }
  }
  const rows = dedupe(raw);
  writeCsv(OUT_RAW, rows, headers());

  const okRows = rows.filter(r => r.collection_status === 'ok');
  const summaryRows = Object.entries(countBy(rows, 'niche')).map(([niche, count]) => ({
    app_name: `itch_summary:${niche}`,
    publisher: '',
    platform: 'summary',
    source_kind: 'itch_source_summary',
    source_bucket: 'itch.io',
    source_url: 'https://itch.io/games',
    niche,
    keyword: '',
    tag: '',
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
    evidence_quality: 'medium_low',
    collection_status: 'summary'
  }));
  writeCsv(OUT_SUMMARY, summaryRows, headers());

  const lines = [];
  lines.push('# Itch Source Expansion V1');
  lines.push('');
  lines.push(`Generated: ${now()}`);
  lines.push('');
  lines.push('## Purpose');
  lines.push('');
  lines.push('This collector expands the competitor/source universe through source-native itch.io tag pages. Treat this as mechanic and saturation discovery, not direct market-share proof.');
  lines.push('');
  lines.push('## Summary');
  lines.push('');
  lines.push(`- Raw/deduped rows: ${rows.length}`);
  lines.push(`- OK rows: ${okRows.length}`);
  lines.push(`- Tags collected: ${Object.values(TAGS).reduce((sum, tags) => sum + tags.length, 0)}`);
  lines.push(`- Pages per tag: ${MAX_PAGES_PER_TAG}`);
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
  lines.push('- Itch rows are discovery/mechanic evidence. They should not be merged into direct mobile app competitor claims without manual validation.');
  lines.push('- Gaming/progression rows are useful as retention-loop benchmarks.');
  lines.push('- Mindfulness and avatar/identity rows are useful for product metaphor and UX pattern discovery.');
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
