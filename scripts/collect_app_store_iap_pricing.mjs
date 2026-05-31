import fs from 'fs';

const INPUT = 'data_processed/top_intersection_review_prefill.csv';
const OUT_RAW = 'data_raw/app_store_iap_pricing_raw.csv';
const OUT_SUMMARY = 'data_processed/app_store_iap_pricing_summary.csv';
const OUT_DOC = 'docs/competitive/app-store-iap-pricing-v1.md';
const MAX_APPS = Number(process.env.IAP_APP_LIMIT || 100);

for (const dir of ['data_raw', 'data_processed', 'docs/competitive']) fs.mkdirSync(dir, { recursive: true });

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

function clean(value) {
  return String(value ?? '')
    .replace(/\\u002F/g, '/')
    .replace(/\\n/g, ' ')
    .replace(/\\"/g, '"')
    .replace(/&amp;/g, '&')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, ' ')
    .trim();
}

function csvEscape(value) {
  return `"${clean(value).replace(/"/g, '""')}"`;
}

function writeCsv(file, rows, headers) {
  fs.writeFileSync(file, [headers.join(','), ...rows.map(row => headers.map(h => csvEscape(row[h])).join(','))].join('\n'));
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function numericPrice(value) {
  const match = clean(value).match(/(\d+(?:\.\d{2})?)/);
  return match ? Number(match[1]) : null;
}

function priceBand(price) {
  if (!Number.isFinite(price)) return 'unknown';
  if (price < 5) return 'under_5';
  if (price < 15) return '5_to_14_99';
  if (price < 50) return '15_to_49_99';
  if (price < 100) return '50_to_99_99';
  return '100_plus';
}

function classifyProduct(name, price) {
  const t = `${name} ${price}`.toLowerCase();
  const tags = [];
  if (/(month|monthly|week|weekly|year|annual|yearly|subscription|trial|pro|premium|plus)/.test(t)) tags.push('subscription_like');
  if (/(coin|coins|credit|credits|gem|gems|pack|bundle|unlock|token)/.test(t)) tags.push('consumable_or_unlock');
  if (/(lifetime|forever|permanent)/.test(t)) tags.push('lifetime_like');
  if (/(trial|free trial)/.test(t)) tags.push('trial_like');
  return tags.length ? tags.join('|') : 'unclear_iap';
}

function extractPairs(html) {
  const rows = [];
  const jsonPairRe = /"leadingText":"([^"]{1,160})","trailingText":"(\$\d+(?:\.\d{2})?)"/g;
  for (const match of html.matchAll(jsonPairRe)) {
    rows.push({ product_name: clean(match[1]), price_text: clean(match[2]), extraction_method: 'embedded_json_textPair' });
  }

  const htmlPairRe = /<div class="text-pair[^"]*"><span>([^<]{1,160})<\/span>\s*<span>(\$\d+(?:\.\d{2})?)<\/span>/g;
  for (const match of html.matchAll(htmlPairRe)) {
    rows.push({ product_name: clean(match[1]), price_text: clean(match[2]), extraction_method: 'html_text_pair' });
  }

  const seen = new Set();
  return rows.filter(row => {
    const key = `${row.product_name}|${row.price_text}`.toLowerCase();
    if (seen.has(key)) return false;
    seen.add(key);
    return row.product_name && row.price_text;
  });
}

async function fetchIaps(app) {
  if (!app.source_url) return [];
  try {
    const res = await fetch(app.source_url, { headers: { 'User-Agent': 'Mozilla/5.0' } });
    if (!res.ok) return [];
    const html = await res.text();
    return extractPairs(html).map((row, index) => {
      const price = numericPrice(row.price_text);
      return {
        app_store_id: app.app_store_id,
        app_name: app.app_name,
        review_rank: app.review_rank,
        archetype: app.archetype,
        direct_threat_level: app.direct_threat_level,
        iap_position: index + 1,
        product_name: row.product_name,
        price_text: row.price_text,
        price_usd: price === null ? '' : price,
        price_band: priceBand(price),
        product_tags: classifyProduct(row.product_name, row.price_text),
        source_url: app.source_url,
        extraction_method: row.extraction_method
      };
    });
  } catch {
    return [];
  }
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

const apps = parseCsv(fs.readFileSync(INPUT, 'utf8'))
  .filter(row => row.app_store_id && row.source_url)
  .slice(0, MAX_APPS);

const allRows = [];
for (const [index, app] of apps.entries()) {
  console.log(`[${index + 1}/${apps.length}] ${app.app_name}`);
  allRows.push(...await fetchIaps(app));
  await sleep(120);
}

writeCsv(OUT_RAW, allRows, [
  'app_store_id', 'app_name', 'review_rank', 'archetype', 'direct_threat_level',
  'iap_position', 'product_name', 'price_text', 'price_usd', 'price_band',
  'product_tags', 'source_url', 'extraction_method'
]);

const byApp = new Map();
for (const row of allRows) {
  if (!byApp.has(row.app_store_id)) byApp.set(row.app_store_id, []);
  byApp.get(row.app_store_id).push(row);
}

const summaryRows = [];
for (const app of apps) {
  const rows = byApp.get(app.app_store_id) || [];
  const prices = rows.map(row => Number(row.price_usd)).filter(Number.isFinite);
  const productTags = {};
  for (const row of rows) {
    for (const tag of row.product_tags.split('|').filter(Boolean)) productTags[tag] = (productTags[tag] || 0) + 1;
  }
  summaryRows.push({
    app_store_id: app.app_store_id,
    app_name: app.app_name,
    review_rank: app.review_rank,
    archetype: app.archetype,
    direct_threat_level: app.direct_threat_level,
    iap_count: rows.length,
    min_price_usd: prices.length ? Math.min(...prices).toFixed(2) : '',
    max_price_usd: prices.length ? Math.max(...prices).toFixed(2) : '',
    median_observed_price_usd: prices.length ? prices.sort((a, b) => a - b)[Math.floor(prices.length / 2)].toFixed(2) : '',
    price_bands: Object.entries(countBy(rows, 'price_band')).map(([key, value]) => `${key}:${value}`).join('|'),
    product_tags: Object.entries(productTags).map(([key, value]) => `${key}:${value}`).join('|'),
    sample_products: rows.slice(0, 6).map(row => `${row.product_name} ${row.price_text}`).join('|'),
    source_url: app.source_url,
    extraction_status: rows.length ? 'iap_found' : 'no_iap_found_or_not_public'
  });
}

writeCsv(OUT_SUMMARY, summaryRows, [
  'app_store_id', 'app_name', 'review_rank', 'archetype', 'direct_threat_level',
  'iap_count', 'min_price_usd', 'max_price_usd', 'median_observed_price_usd',
  'price_bands', 'product_tags', 'sample_products', 'source_url', 'extraction_status'
]);

const withIap = summaryRows.filter(row => Number(row.iap_count) > 0);
const prices = allRows.map(row => Number(row.price_usd)).filter(Number.isFinite);
const lines = [];
lines.push('# App Store IAP Pricing V1');
lines.push('');
lines.push(`Generated: ${new Date().toISOString()}`);
lines.push('');
lines.push('## Scope');
lines.push('');
lines.push(`Collected publicly visible In-App Purchase name/price pairs from App Store web pages for ${apps.length} top intersection candidates. This is observed web-page pricing, not guaranteed complete backend IAP catalog data.`);
lines.push('');
lines.push('## Coverage');
lines.push('');
lines.push(`- Apps requested: ${apps.length}`);
lines.push(`- Apps with observed IAP rows: ${withIap.length}`);
lines.push(`- Raw IAP rows: ${allRows.length}`);
lines.push(`- Lowest observed price: ${prices.length ? `$${Math.min(...prices).toFixed(2)}` : 'n/a'}`);
lines.push(`- Highest observed price: ${prices.length ? `$${Math.max(...prices).toFixed(2)}` : 'n/a'}`);
lines.push('');
lines.push('## Price Bands');
lines.push('');
lines.push(bulletCounts(countBy(allRows, 'price_band')));
lines.push('');
lines.push('## Product Tag Counts');
lines.push('');
const tagCounts = {};
for (const row of allRows) for (const tag of row.product_tags.split('|').filter(Boolean)) tagCounts[tag] = (tagCounts[tag] || 0) + 1;
lines.push(bulletCounts(tagCounts));
lines.push('');
lines.push('## Highest IAP Ceilings');
lines.push('');
lines.push('| App | IAP Count | Min | Max | Sample Products |');
lines.push('| --- | ---: | ---: | ---: | --- |');
for (const row of [...summaryRows].filter(r => Number(r.iap_count) > 0).sort((a, b) => Number(b.max_price_usd) - Number(a.max_price_usd)).slice(0, 20)) {
  lines.push(`| ${row.app_name.replace(/\|/g, '/')} | ${row.iap_count} | ${row.min_price_usd} | ${row.max_price_usd} | ${row.sample_products.replace(/\|/g, '; ').replace(/\$/g, '$')} |`);
}
lines.push('');
lines.push('## Interpretation');
lines.push('');
lines.push('- Public App Store pages expose enough IAP information to benchmark price ladders for many top candidates.');
lines.push('- The observed set mixes subscription-like products, unlocks, credits/gems, trials, and ambiguous premium products.');
lines.push('- Alina should avoid forcing payment before the daily loop demonstrates value; paid depth can be benchmarked against observed subscription and unlock ladders.');
lines.push('');
lines.push('## Files');
lines.push('');
lines.push(`- \`${OUT_RAW}\``);
lines.push(`- \`${OUT_SUMMARY}\``);
fs.writeFileSync(OUT_DOC, `${lines.join('\n')}\n`);

console.log(`apps=${apps.length}`);
console.log(`apps_with_iap=${withIap.length}`);
console.log(`iap_rows=${allRows.length}`);
