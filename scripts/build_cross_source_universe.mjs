import fs from 'fs';
import crypto from 'crypto';

const OUT_RAW = 'data_processed/cross_source_universe_raw.csv';
const OUT_RAW_SHARD_DIR = 'data_processed/cross_source_universe_raw_parts';
const OUT_RAW_SHARD_INDEX = 'data_processed/cross_source_universe_raw_index.csv';
const OUT_DEDUP = 'data_processed/cross_source_universe_dedup.csv';
const OUT_SUMMARY = 'data_processed/cross_source_universe_summary.csv';
const OUT_DOC = 'docs/competitive/cross-source-universe-v1.md';
const RAW_SHARD_ROWS = Number(process.env.CROSS_SOURCE_RAW_SHARD_ROWS || 15000);

for (const dir of ['data_processed', OUT_RAW_SHARD_DIR, 'docs/competitive']) fs.mkdirSync(dir, { recursive: true });

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
  return body
    .filter(r => r.some(Boolean))
    .map(r => Object.fromEntries(headers.map((h, i) => [h, r[i] ?? ''])));
}

function csv(file) {
  return fs.existsSync(file) ? parseCsv(fs.readFileSync(file, 'utf8')) : [];
}

function writeCsv(file, rows, headers) {
  fs.writeFileSync(file, [headers.join(','), ...rows.map(row => headers.map(h => csvEscape(row[h])).join(','))].join('\n'));
}

function sha256(file) {
  return crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex').slice(0, 16);
}

function writeCsvShards(dir, indexFile, rows, headers, rowsPerShard) {
  fs.rmSync(dir, { recursive: true, force: true });
  fs.mkdirSync(dir, { recursive: true });
  const shards = [];
  for (let start = 0; start < rows.length; start += rowsPerShard) {
    const partRows = rows.slice(start, start + rowsPerShard);
    const partNumber = shards.length + 1;
    const filePath = `${dir}/part_${String(partNumber).padStart(3, '0')}.csv`;
    writeCsv(filePath, partRows, headers);
    shards.push({
      part_number: partNumber,
      file_path: filePath,
      row_count: partRows.length,
      first_universe_row_id: partRows[0]?.universe_row_id || '',
      last_universe_row_id: partRows[partRows.length - 1]?.universe_row_id || '',
      sha256: sha256(filePath)
    });
  }
  writeCsv(indexFile, shards, [
    'part_number', 'file_path', 'row_count',
    'first_universe_row_id', 'last_universe_row_id', 'sha256'
  ]);
  return shards;
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

function mdTable(rows, columns, limit = rows.length) {
  const slice = rows.slice(0, limit);
  const header = `| ${columns.map(c => c.label).join(' | ')} |`;
  const sep = `| ${columns.map(c => c.align === 'right' ? '---:' : '---').join(' | ')} |`;
  const body = slice.map(row => `| ${columns.map(c => clean(row[c.key]).replace(/\|/g, '<br>')).join(' | ')} |`);
  return [header, sep, ...body].join('\n');
}

function normalizeName(value) {
  return clean(value)
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, ' ')
    .replace(/\b(app|apps|game|games|tracker|journal|meditation)\b/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function stableId(value) {
  return crypto.createHash('sha1').update(value).digest('hex').slice(0, 12);
}

function sourceIdentity(sourceUrl) {
  const url = clean(sourceUrl);
  if (!url) return '';
  const playId = url.match(/[?&]id=([^&#]+)/);
  if (playId) return `google_play:${playId[1]}`;
  const steamId = url.match(/store\.steampowered\.com\/app\/(\d+)/);
  if (steamId) return `steam:${steamId[1]}`;
  const appleId = url.match(/\/id(\d+)/);
  if (appleId) return `apple:${appleId[1]}`;
  return url.replace(/#.*$/, '');
}

function sourceGroup(sourceKind, sourceBucket, platform) {
  const text = `${sourceKind} ${sourceBucket} ${platform}`.toLowerCase();
  if (/steam/.test(text)) return 'steam_pc';
  if (/itch/.test(text)) return 'itch_web_game';
  if (/mac|desktop|itunes/.test(text)) return 'desktop_store';
  if (/chrome|browser/.test(text)) return 'browser_extension';
  if (/reddit|forum|community/.test(text)) return 'community_forum';
  if (/app store|itunes|ios/.test(text)) return 'mobile_app_store';
  if (/google|android/.test(text)) return 'google_play_or_android';
  return clean(sourceBucket || sourceKind || platform || 'unknown_source');
}

function qualityRank(row) {
  const quality = clean(row.evidence_quality);
  const status = clean(row.collection_status);
  let score = 0;
  if (status === 'ok' || !status) score += 10;
  if (/high/.test(quality)) score += 8;
  else if (/medium/.test(quality)) score += 5;
  else if (/low/.test(quality)) score += 1;
  if (clean(row.source_url)) score += 3;
  if (clean(row.rating) || clean(row.review_count)) score += 2;
  if (clean(row.core_features)) score += 1;
  return score;
}

function normalizeRow(row, sourceFile) {
  const sourceKind = clean(row.source_kind);
  const sourceBucket = clean(row.source_bucket || sourceKind);
  const group = sourceGroup(sourceKind, sourceBucket, row.platform);
  const name = clean(row.app_name);
  const publisher = clean(row.publisher || row.seller_name || row.offered_by);
  const platform = clean(row.platform);
  const sourceUrl = clean(row.source_url);
  const appStoreId = clean(row.app_store_id || row.track_id);
  const bundleId = clean(row.bundle_id || row.package_name || row.extension_id);
  const normalizedName = normalizeName(name);
  const normalizedPublisher = normalizeName(publisher);
  const idPart = appStoreId || bundleId || sourceIdentity(sourceUrl) || `${normalizedName}:${normalizedPublisher}:${platform}`;
  const dedupKey = `${group}:${idPart || normalizedName}`;
  const rowId = stableId(`${sourceFile}:${dedupKey}:${row.keyword || ''}:${row.rank_position || ''}:${row.country || ''}:${row.tag || row.tag_name || ''}`);
  return {
    universe_row_id: rowId,
    dedup_key: dedupKey,
    normalized_name: normalizedName,
    app_name: name,
    publisher,
    platform,
    source_group: group,
    source_kind: sourceKind,
    source_bucket: sourceBucket,
    source_file: sourceFile,
    source_url: sourceUrl,
    app_store_id: appStoreId,
    bundle_id: bundleId,
    niche: clean(row.niche),
    keyword: clean(row.keyword || row.query || row.tag || row.tag_name),
    country: clean(row.country),
    category: clean(row.category),
    rating: clean(row.rating),
    review_count: clean(row.review_count || row.users),
    pricing_type: clean(row.pricing_type),
    price_usd: clean(row.price_usd),
    iap_present: clean(row.iap_present),
    subscription_present: clean(row.subscription_present),
    feature_tags: clean(row.feature_tags || row.audience_tags || row.personalization_tags),
    core_features: clean(row.core_features || row.short_description),
    retention_mechanics: clean(row.retention_mechanics),
    monetization_notes: clean(row.monetization_notes),
    evidence_quality: clean(row.evidence_quality),
    collection_status: clean(row.collection_status || row.detail_status || 'ok'),
    provenance_count: 1,
    provenance_sources: sourceFile,
    merged_source_groups: group,
    cross_source_priority_score: qualityRank(row)
  };
}

const inputs = [
  ['data_raw/expanded/all_expanded_raw.csv', csv('data_raw/expanded/all_expanded_raw.csv')],
  ['data_raw/expanded_itch_raw.csv', csv('data_raw/expanded_itch_raw.csv')],
  ['data_raw/expanded_steam_tags_raw.csv', csv('data_raw/expanded_steam_tags_raw.csv')],
  ['data_raw/expanded_desktop_store_raw.csv', csv('data_raw/expanded_desktop_store_raw.csv')],
  ['data_raw/expanded_chrome_extensions_raw.csv', csv('data_raw/expanded_chrome_extensions_raw.csv')],
  ['data_raw/chrome_extension_detail_raw.csv', csv('data_raw/chrome_extension_detail_raw.csv')],
  ['data_raw/expanded_reddit_competitor_mentions_raw.csv', csv('data_raw/expanded_reddit_competitor_mentions_raw.csv')]
];

const rawRows = inputs.flatMap(([file, rows]) => rows.map(row => normalizeRow(row, file)));
const dedupMap = new Map();

for (const row of rawRows) {
  const existing = dedupMap.get(row.dedup_key);
  if (!existing) {
    dedupMap.set(row.dedup_key, { ...row });
    continue;
  }
  existing.provenance_count = Number(existing.provenance_count || 1) + 1;
  existing.provenance_sources = Array.from(new Set(`${existing.provenance_sources}|${row.provenance_sources}`.split('|'))).join('|');
  existing.merged_source_groups = Array.from(new Set(`${existing.merged_source_groups}|${row.source_group}`.split('|'))).join('|');
  if (!existing.niche.includes(row.niche)) existing.niche = Array.from(new Set(`${existing.niche}|${row.niche}`.split('|').filter(Boolean))).join('|');
  if (!existing.keyword.includes(row.keyword)) existing.keyword = Array.from(new Set(`${existing.keyword}|${row.keyword}`.split('|').filter(Boolean))).slice(0, 8).join('|');
  if (qualityRank(row) > qualityRank(existing)) {
    for (const key of [
      'app_name', 'publisher', 'platform', 'source_group', 'source_kind', 'source_bucket',
      'source_file', 'source_url', 'app_store_id', 'bundle_id', 'category', 'rating',
      'review_count', 'pricing_type', 'price_usd', 'iap_present', 'subscription_present',
      'feature_tags', 'core_features', 'retention_mechanics', 'monetization_notes',
      'evidence_quality', 'collection_status', 'cross_source_priority_score'
    ]) existing[key] = row[key];
  }
}

const dedupRows = Array.from(dedupMap.values())
  .sort((a, b) => Number(b.cross_source_priority_score || 0) - Number(a.cross_source_priority_score || 0));

const headers = [
  'universe_row_id', 'dedup_key', 'normalized_name', 'app_name', 'publisher', 'platform',
  'source_group', 'source_kind', 'source_bucket', 'source_file', 'source_url',
  'app_store_id', 'bundle_id', 'niche', 'keyword', 'country', 'category', 'rating',
  'review_count', 'pricing_type', 'price_usd', 'iap_present', 'subscription_present',
  'feature_tags', 'core_features', 'retention_mechanics', 'monetization_notes',
  'evidence_quality', 'collection_status', 'provenance_count', 'provenance_sources',
  'merged_source_groups', 'cross_source_priority_score'
];

const rawShards = writeCsvShards(OUT_RAW_SHARD_DIR, OUT_RAW_SHARD_INDEX, rawRows, headers, RAW_SHARD_ROWS);
writeCsv(OUT_RAW, rawRows, headers);
writeCsv(OUT_DEDUP, dedupRows, headers);

const summaryRows = [];
for (const [source_group, count] of Object.entries(countBy(rawRows, 'source_group'))) {
  const sourceRows = rawRows.filter(row => row.source_group === source_group);
  const dedupSourceRows = dedupRows.filter(row => row.merged_source_groups.split('|').includes(source_group));
  summaryRows.push({
    summary_type: 'source_group',
    segment: source_group,
    raw_rows: count,
    dedup_rows: dedupSourceRows.length,
    ok_rows: sourceRows.filter(row => row.collection_status === 'ok').length,
    unique_niches: Object.keys(countBy(sourceRows, 'niche')).length,
    top_niches: Object.entries(countBy(sourceRows, 'niche')).sort((a, b) => b[1] - a[1]).slice(0, 5).map(([k, v]) => `${k}:${v}`).join('|'),
    top_categories: Object.entries(countBy(sourceRows, 'category')).sort((a, b) => b[1] - a[1]).slice(0, 5).map(([k, v]) => `${k}:${v}`).join('|')
  });
}
for (const [niche, count] of Object.entries(countBy(rawRows, 'niche'))) {
  const nicheRows = rawRows.filter(row => row.niche === niche);
  const dedupNicheRows = dedupRows.filter(row => row.niche.split('|').includes(niche));
  summaryRows.push({
    summary_type: 'niche',
    segment: niche,
    raw_rows: count,
    dedup_rows: dedupNicheRows.length,
    ok_rows: nicheRows.filter(row => row.collection_status === 'ok').length,
    unique_niches: 1,
    top_niches: niche,
    top_categories: Object.entries(countBy(nicheRows, 'category')).sort((a, b) => b[1] - a[1]).slice(0, 5).map(([k, v]) => `${k}:${v}`).join('|')
  });
}

writeCsv(OUT_SUMMARY, summaryRows, [
  'summary_type', 'segment', 'raw_rows', 'dedup_rows', 'ok_rows',
  'unique_niches', 'top_niches', 'top_categories'
]);

const lines = [];
lines.push('# Cross-Source Universe V1');
lines.push('');
lines.push(`Generated: ${new Date().toISOString()}`);
lines.push('');
lines.push('## Purpose');
lines.push('');
lines.push('This layer normalizes the major source-native collections into one auditable universe. It keeps raw provenance while producing a cross-source deduplicated view across core app-store rows, itch.io, Steam, Mac desktop store, Chrome Web Store search/detail pages, and Reddit forum mention discovery.');
lines.push('');
lines.push('## Summary');
lines.push('');
lines.push(`- Cross-source raw rows: ${rawRows.length}`);
lines.push(`- Cross-source dedup rows: ${dedupRows.length}`);
lines.push(`- Raw shard files: ${rawShards.length}`);
lines.push(`- Source groups: ${Object.keys(countBy(rawRows, 'source_group')).length}`);
lines.push(`- Niches represented: ${Object.keys(countBy(rawRows, 'niche')).length}`);
lines.push(`- Rows with source URLs: ${rawRows.filter(row => row.source_url).length}`);
lines.push('');
lines.push('Raw rows by source group:');
lines.push('');
lines.push(bulletCounts(countBy(rawRows, 'source_group')));
lines.push('');
lines.push('Dedup rows by primary source group:');
lines.push('');
lines.push(bulletCounts(countBy(dedupRows, 'source_group')));
lines.push('');
lines.push('## Source Group Summary');
lines.push('');
lines.push(mdTable(summaryRows.filter(row => row.summary_type === 'source_group'), [
  { key: 'segment', label: 'Source Group' },
  { key: 'raw_rows', label: 'Raw Rows', align: 'right' },
  { key: 'dedup_rows', label: 'Dedup Rows', align: 'right' },
  { key: 'ok_rows', label: 'OK Rows', align: 'right' },
  { key: 'top_niches', label: 'Top Niches' }
]));
lines.push('');
lines.push('## Claim Boundary');
lines.push('');
lines.push('- This is a normalization/provenance layer, not new market-share proof.');
lines.push('- Cross-source dedup protects the project from double-counting repeated country/query/tag results.');
lines.push('- Source-specific interpretation caveats still apply: Steam/itch are mechanic discovery, desktop store is discovery, Chrome is browser-mechanic evidence, Reddit is qualitative forum-discovery evidence, and mobile app-store rows remain the strongest direct consumer-app competitor base.');
lines.push('');
lines.push('## Files');
lines.push('');
lines.push(`- \`${OUT_RAW_SHARD_INDEX}\``);
lines.push(`- \`${OUT_RAW_SHARD_DIR}/part_*.csv\``);
lines.push(`- \`${OUT_RAW}\` (local generated full file; ignored by Git to avoid large-file warnings)`);
lines.push(`- \`${OUT_DEDUP}\``);
lines.push(`- \`${OUT_SUMMARY}\``);

fs.writeFileSync(OUT_DOC, `${lines.join('\n')}\n`);

console.log(`raw=${OUT_RAW}`);
console.log(`raw_shard_index=${OUT_RAW_SHARD_INDEX}`);
console.log(`raw_shards=${rawShards.length}`);
console.log(`dedup=${OUT_DEDUP}`);
console.log(`summary=${OUT_SUMMARY}`);
console.log(`doc=${OUT_DOC}`);
console.log(`raw_rows=${rawRows.length}`);
console.log(`dedup_rows=${dedupRows.length}`);
