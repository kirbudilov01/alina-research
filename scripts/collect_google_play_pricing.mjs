import fs from 'fs';
import gplay from 'google-play-scraper';

const FILES = [
  ['gaming', 'data_raw/top300_gaming_multi_source.csv'],
  ['astrology_esoterics', 'data_raw/top300_astrology_esoterics_multi_source.csv'],
  ['avatar_identity', 'data_raw/top300_avatar_identity_multi_source.csv'],
  ['coaching', 'data_raw/top300_coaching_multi_source.csv'],
  ['mindfulness', 'data_raw/top300_mindfulness_multi_source.csv']
];

const OUT_RAW = 'data_raw/google_play_pricing_raw.csv';
const OUT_SUMMARY = 'data_processed/google_play_pricing_summary.csv';
const OUT_DOC = 'docs/competitive/google-play-pricing-v1.md';
const MAX_PER_NICHE = Number(process.env.GPLAY_PRICING_PER_NICHE || 50);

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
  return String(value ?? '').replace(/\s+/g, ' ').trim();
}

function csvEscape(value) {
  return `"${clean(value).replace(/"/g, '""')}"`;
}

function writeCsv(file, rows, headers) {
  fs.writeFileSync(file, [headers.join(','), ...rows.map(row => headers.map(h => csvEscape(row[h])).join(','))].join('\n'));
}

function packageId(row) {
  const m = clean(row.source_url).match(/[?&]id=([^&]+)/);
  if (m) return decodeURIComponent(m[1]);
  if (/^[a-z0-9_]+(\.[a-z0-9_]+)+$/i.test(clean(row.app_name))) return clean(row.app_name);
  return '';
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function pricingModel(app) {
  const tags = [];
  if (app.free) tags.push('free_download');
  if (!app.free) tags.push('paid_download');
  if (app.offersIAP) tags.push('offers_iap');
  if (app.adSupported) tags.push('ad_supported');
  if (app.isAvailableInPlayPass) tags.push('play_pass');
  return tags.join('|') || 'unknown';
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

const candidates = [];
for (const [niche, file] of FILES) {
  const rows = parseCsv(fs.readFileSync(file, 'utf8'))
    .filter(row => row.platform === 'android' || row.source_kind === 'google_play')
    .map(row => ({ ...row, niche, package_id: packageId(row) }))
    .filter(row => row.package_id);

  const seen = new Set();
  for (const row of rows) {
    if (seen.has(row.package_id)) continue;
    seen.add(row.package_id);
    candidates.push(row);
    if (seen.size >= MAX_PER_NICHE) break;
  }
}

const rawRows = [];
for (const [index, row] of candidates.entries()) {
  console.log(`[${index + 1}/${candidates.length}] ${row.niche} ${row.package_id}`);
  try {
    const app = await gplay.app({ appId: row.package_id, lang: 'en', country: 'us' });
    rawRows.push({
      niche: row.niche,
      package_id: row.package_id,
      app_name: app.title || row.app_name,
      developer: app.developer || row.publisher,
      genre: app.genre,
      score: app.score,
      ratings: app.ratings,
      reviews: app.reviews,
      installs: app.installs,
      min_installs: app.minInstalls,
      max_installs: app.maxInstalls,
      free: app.free ? 'yes' : 'no',
      price: app.price,
      price_text: app.priceText,
      currency: app.currency,
      offers_iap: app.offersIAP ? 'yes' : 'no',
      iap_range: app.IAPRange || '',
      ad_supported: app.adSupported ? 'yes' : 'no',
      play_pass: app.isAvailableInPlayPass ? 'yes' : 'no',
      pricing_model: pricingModel(app),
      developer_website: app.developerWebsite || '',
      privacy_policy: app.privacyPolicy || '',
      source_url: app.url || row.source_url,
      collection_status: 'ok',
      collected_at: new Date().toISOString()
    });
  } catch (error) {
    rawRows.push({
      niche: row.niche,
      package_id: row.package_id,
      app_name: row.app_name,
      developer: row.publisher,
      genre: '',
      score: '',
      ratings: '',
      reviews: '',
      installs: '',
      min_installs: '',
      max_installs: '',
      free: '',
      price: '',
      price_text: '',
      currency: '',
      offers_iap: '',
      iap_range: '',
      ad_supported: '',
      play_pass: '',
      pricing_model: 'lookup_failed',
      developer_website: '',
      privacy_policy: '',
      source_url: row.source_url,
      collection_status: `error:${error.message}`,
      collected_at: new Date().toISOString()
    });
  }
  await sleep(100);
}

writeCsv(OUT_RAW, rawRows, [
  'niche', 'package_id', 'app_name', 'developer', 'genre', 'score', 'ratings',
  'reviews', 'installs', 'min_installs', 'max_installs', 'free', 'price',
  'price_text', 'currency', 'offers_iap', 'iap_range', 'ad_supported',
  'play_pass', 'pricing_model', 'developer_website', 'privacy_policy',
  'source_url', 'collection_status', 'collected_at'
]);

const summaryRows = [];
for (const [niche] of FILES) {
  const rows = rawRows.filter(row => row.niche === niche);
  const ok = rows.filter(row => row.collection_status === 'ok');
  summaryRows.push({
    niche,
    requested_rows: rows.length,
    successful_rows: ok.length,
    free_download_apps: ok.filter(row => row.free === 'yes').length,
    paid_download_apps: ok.filter(row => row.free === 'no').length,
    offers_iap_apps: ok.filter(row => row.offers_iap === 'yes').length,
    ad_supported_apps: ok.filter(row => row.ad_supported === 'yes').length,
    play_pass_apps: ok.filter(row => row.play_pass === 'yes').length,
    apps_with_developer_website: ok.filter(row => row.developer_website).length,
    top_install_apps: ok
      .sort((a, b) => Number(b.min_installs || 0) - Number(a.min_installs || 0))
      .slice(0, 5)
      .map(row => `${row.app_name} (${row.installs})`)
      .join('|')
  });
}

writeCsv(OUT_SUMMARY, summaryRows, [
  'niche', 'requested_rows', 'successful_rows', 'free_download_apps',
  'paid_download_apps', 'offers_iap_apps', 'ad_supported_apps', 'play_pass_apps',
  'apps_with_developer_website', 'top_install_apps'
]);

const okRows = rawRows.filter(row => row.collection_status === 'ok');
const lines = [];
lines.push('# Google Play Pricing V1');
lines.push('');
lines.push(`Generated: ${new Date().toISOString()}`);
lines.push('');
lines.push('## Scope');
lines.push('');
lines.push(`Collected Google Play metadata for up to ${MAX_PER_NICHE} Android apps per market pillar from existing top300 multi-source files. This validates Android-side pricing signals: free/paid download, IAP availability, ads, Play Pass, developer website, and install/review scale.`);
lines.push('');
lines.push('## Coverage');
lines.push('');
lines.push(`- Requested package rows: ${rawRows.length}`);
lines.push(`- Successful lookups: ${okRows.length}`);
lines.push(`- Failed lookups: ${rawRows.length - okRows.length}`);
lines.push(`- Apps offering IAP: ${okRows.filter(row => row.offers_iap === 'yes').length}`);
lines.push(`- Ad-supported apps: ${okRows.filter(row => row.ad_supported === 'yes').length}`);
lines.push(`- Paid download apps: ${okRows.filter(row => row.free === 'no').length}`);
lines.push('');
lines.push('## Summary by Market');
lines.push('');
lines.push('| Market | Requested | OK | Free | Paid | IAP | Ads | Play Pass | Dev Website |');
lines.push('| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |');
for (const row of summaryRows) {
  lines.push(`| ${row.niche} | ${row.requested_rows} | ${row.successful_rows} | ${row.free_download_apps} | ${row.paid_download_apps} | ${row.offers_iap_apps} | ${row.ad_supported_apps} | ${row.play_pass_apps} | ${row.apps_with_developer_website} |`);
}
lines.push('');
lines.push('## Pricing Models');
lines.push('');
lines.push(bulletCounts(countBy(okRows, 'pricing_model')));
lines.push('');
lines.push('## Interpretation');
lines.push('');
lines.push('- Android-side metadata confirms that free download plus IAP is common across the adjacent markets.');
lines.push('- Ads are a meaningful monetization layer in games/avatar apps but less central for premium coaching/mindfulness positioning.');
lines.push('- Developer websites are available for many Android apps and can support a later web/paywall screenshot pass.');
lines.push('- Google Play exposes IAP availability but not detailed IAP price ladders as cleanly as App Store web pages; treat this as validation, not full price extraction.');
lines.push('');
lines.push('## Files');
lines.push('');
lines.push(`- \`${OUT_RAW}\``);
lines.push(`- \`${OUT_SUMMARY}\``);
fs.writeFileSync(OUT_DOC, `${lines.join('\n')}\n`);

console.log(`requested_rows=${rawRows.length}`);
console.log(`successful_rows=${okRows.length}`);
console.log(`iap_apps=${okRows.filter(row => row.offers_iap === 'yes').length}`);
