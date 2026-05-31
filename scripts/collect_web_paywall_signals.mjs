import fs from 'fs';
import * as cheerio from 'cheerio';

const IN = 'data_raw/google_play_pricing_raw.csv';
const OUT_RAW = 'data_raw/web_paywall_discovery_raw.csv';
const OUT_MATRIX = 'data_processed/web_paywall_signal_matrix.csv';
const OUT_DOC = 'docs/competitive/web-paywall-validation-v1.md';
const SITE_LIMIT = Number(process.env.WEB_PAYWALL_SITE_LIMIT || 70);
const FETCH_TIMEOUT_MS = Number(process.env.WEB_PAYWALL_TIMEOUT_MS || 9000);
const PATHS = ['', '/pricing', '/plans', '/premium', '/subscribe', '/subscription', '/upgrade'];

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

function safeUrl(raw) {
  const value = clean(raw);
  if (!value || value.startsWith('mailto:')) return null;
  try {
    const withProtocol = /^https?:\/\//i.test(value) ? value : `https://${value}`;
    const url = new URL(withProtocol);
    if (!['http:', 'https:'].includes(url.protocol)) return null;
    return url;
  } catch {
    return null;
  }
}

function canonicalOrigin(url) {
  const host = url.hostname.replace(/^www\./, '').toLowerCase();
  return `${url.protocol}//${host}`;
}

function urlCandidates(url) {
  const origin = `${url.protocol}//${url.hostname}`;
  const basePath = url.pathname && url.pathname !== '/' ? url.pathname.replace(/\/$/, '') : '';
  const urls = new Set();
  urls.add(`${origin}${basePath || '/'}`);
  for (const path of PATHS) urls.add(`${origin}${path}`);
  return [...urls];
}

function classifyText(text, url) {
  if (!clean(text)) {
    return { tags: ['no_pricing_signal'], pricePoints: [], strength: 'low' };
  }
  const lower = text.toLowerCase();
  const path = url.toLowerCase();
  const tests = {
    pricing_page: /\b(pricing|plans|membership|subscribe|subscription|premium|upgrade)\b/.test(lower) || /\/(pricing|plans|premium|subscribe|subscription|upgrade)\/?$/i.test(path),
    subscription_terms: /\b(monthly|yearly|annual|annually|subscription|subscribe|renews|recurring)\b/.test(lower),
    trial_terms: /\b(free trial|trial|7-day|14-day|30-day)\b/.test(lower),
    paywall_language: /\b(upgrade|premium|pro plan|unlock|members only|paid plan|unlimited access)\b/.test(lower),
    checkout_language: /\b(checkout|billing|payment|stripe|purchase|buy now)\b/.test(lower),
    app_store_redirect: /(apps\.apple\.com|play\.google\.com|app store|google play)/.test(lower)
  };
  const pricePoints = [...new Set((text.match(/(?:[$€£]\s?\d+(?:[.,]\d{2})?|\d+(?:[.,]\d{2})?\s?(?:usd|eur|gbp))/gi) || []).map(clean))].slice(0, 12);
  const tags = Object.entries(tests).filter(([, ok]) => ok).map(([tag]) => tag);
  if (pricePoints.length) tags.push('price_points_detected');
  if (!tags.length) tags.push('no_pricing_signal');
  let strength = 'low';
  if (pricePoints.length && (tests.subscription_terms || tests.paywall_language || tests.checkout_language)) strength = 'high';
  else if (tests.pricing_page || tests.subscription_terms || tests.paywall_language || pricePoints.length) strength = 'medium';
  return { tags, pricePoints, strength };
}

async function fetchPage(url) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
  try {
    const response = await fetch(url, {
      redirect: 'follow',
      signal: controller.signal,
      headers: {
        'user-agent': 'Mozilla/5.0 (compatible; AlinaResearchBot/1.0; market-research evidence collection)'
      }
    });
    const contentType = response.headers.get('content-type') || '';
    if (!contentType.includes('text/html') && !contentType.includes('text/plain')) {
      return { ok: false, status: response.status, finalUrl: response.url, title: '', text: '', error: `non_text:${contentType}` };
    }
    const html = await response.text();
    const $ = cheerio.load(html);
    $('script,style,noscript,svg').remove();
    const title = clean($('title').first().text());
    const meta = clean($('meta[name="description"]').attr('content') || '');
    const body = clean($('body').text()).slice(0, 9000);
    return { ok: response.ok, status: response.status, finalUrl: response.url, title, text: clean(`${title} ${meta} ${body}`), error: response.ok ? '' : `http_${response.status}` };
  } catch (error) {
    return { ok: false, status: '', finalUrl: url, title: '', text: '', error: clean(error.message || error.name || 'fetch_error') };
  } finally {
    clearTimeout(timer);
  }
}

const gplayRows = parseCsv(fs.readFileSync(IN, 'utf8'))
  .filter(row => row.collection_status === 'ok')
  .filter(row => row.developer_website)
  .sort((a, b) => {
    const ai = a.offers_iap === 'yes' ? 1 : 0;
    const bi = b.offers_iap === 'yes' ? 1 : 0;
    return bi - ai || Number(b.min_installs || 0) - Number(a.min_installs || 0);
  });

const siteRows = [];
const seenOrigins = new Set();
for (const row of gplayRows) {
  const url = safeUrl(row.developer_website);
  if (!url) continue;
  const origin = canonicalOrigin(url);
  if (seenOrigins.has(origin)) continue;
  seenOrigins.add(origin);
  siteRows.push({ row, url, origin });
  if (siteRows.length >= SITE_LIMIT) break;
}

const rawRows = [];
for (const [siteIndex, site] of siteRows.entries()) {
  const urls = urlCandidates(site.url);
  console.log(`[${siteIndex + 1}/${siteRows.length}] ${site.row.niche} ${site.row.app_name} ${site.origin}`);
  for (const candidate of urls) {
    const fetched = await fetchPage(candidate);
    const classification = fetched.ok
      ? classifyText(fetched.text || '', candidate)
      : { tags: ['no_pricing_signal'], pricePoints: [], strength: 'low' };
    rawRows.push({
      niche: site.row.niche,
      package_id: site.row.package_id,
      app_name: site.row.app_name,
      developer: site.row.developer,
      offers_iap: site.row.offers_iap,
      google_play_iap_range: site.row.iap_range,
      min_installs: site.row.min_installs,
      domain: site.origin,
      requested_url: candidate,
      final_url: fetched.finalUrl,
      http_status: fetched.status,
      fetch_status: fetched.ok ? 'ok' : `error:${fetched.error}`,
      page_title: fetched.title,
      signal_tags: classification.tags.join('|'),
      price_points_detected: classification.pricePoints.join('|'),
      price_point_count: classification.pricePoints.length,
      paywall_signal_strength: classification.strength,
      text_excerpt: (fetched.text || '').slice(0, 500),
      collected_at: new Date().toISOString()
    });
    await new Promise(resolve => setTimeout(resolve, 80));
  }
}

writeCsv(OUT_RAW, rawRows, [
  'niche', 'package_id', 'app_name', 'developer', 'offers_iap', 'google_play_iap_range',
  'min_installs', 'domain', 'requested_url', 'final_url', 'http_status', 'fetch_status',
  'page_title', 'signal_tags', 'price_points_detected', 'price_point_count',
  'paywall_signal_strength', 'text_excerpt', 'collected_at'
]);

const matrix = [];
for (const site of siteRows) {
  const rows = rawRows.filter(row => row.domain === site.origin);
  const okRows = rows.filter(row => row.fetch_status === 'ok');
  const best = [...rows].sort((a, b) => {
    const score = row => ({ high: 3, medium: 2, low: 1 }[row.paywall_signal_strength] || 0) * 100 + Number(row.price_point_count || 0);
    return score(b) - score(a);
  })[0] || {};
  const tagCounts = {};
  for (const row of rows) for (const tag of String(row.signal_tags || '').split('|').filter(Boolean)) tagCounts[tag] = (tagCounts[tag] || 0) + 1;
  const prices = [...new Set(rows.flatMap(row => String(row.price_points_detected || '').split('|').filter(Boolean)))].slice(0, 20);
  matrix.push({
    niche: site.row.niche,
    package_id: site.row.package_id,
    app_name: site.row.app_name,
    developer: site.row.developer,
    domain: site.origin,
    requested_pages: rows.length,
    successful_pages: okRows.length,
    offers_iap: site.row.offers_iap,
    google_play_iap_range: site.row.iap_range,
    strongest_signal: best.paywall_signal_strength || 'none',
    best_url: best.final_url || best.requested_url || '',
    detected_tags: Object.entries(tagCounts).sort((a, b) => b[1] - a[1]).map(([tag, count]) => `${tag}:${count}`).join('|'),
    detected_price_points: prices.join('|'),
    needs_screenshot_validation: ['high', 'medium'].includes(best.paywall_signal_strength) ? 'yes' : 'no',
    validation_note: best.paywall_signal_strength === 'high'
      ? 'Strong public paywall/pricing signal; capture screenshot and verify trial terms.'
      : best.paywall_signal_strength === 'medium'
        ? 'Pricing/paywall language present but terms may be incomplete.'
        : 'Weak or no public web paywall signal from fetched pages.'
  });
}

writeCsv(OUT_MATRIX, matrix, [
  'niche', 'package_id', 'app_name', 'developer', 'domain', 'requested_pages',
  'successful_pages', 'offers_iap', 'google_play_iap_range', 'strongest_signal',
  'best_url', 'detected_tags', 'detected_price_points',
  'needs_screenshot_validation', 'validation_note'
]);

const lines = [];
lines.push('# Web Paywall Validation V1');
lines.push('');
lines.push(`Generated: ${new Date().toISOString()}`);
lines.push('');
lines.push('## Scope');
lines.push('');
lines.push(`This pass fetched developer websites from Google Play metadata for ${siteRows.length} unique domains, prioritizing apps with IAP and high install counts. It checks home/pricing/plan/premium/subscribe/upgrade URLs for public pricing, trial, subscription, checkout, and paywall language.`);
lines.push('');
lines.push('This is **not** final screenshot validation. It is a reproducible discovery layer that says where manual screenshots and trial-term verification should happen next.');
lines.push('');
lines.push('## Coverage');
lines.push('');
lines.push(`- Fetched URL rows: ${rawRows.length}`);
lines.push(`- Successful pages: ${rawRows.filter(row => row.fetch_status === 'ok').length}`);
lines.push(`- Aggregated app/domain rows: ${matrix.length}`);
lines.push(`- Domains needing screenshot validation: ${matrix.filter(row => row.needs_screenshot_validation === 'yes').length}`);
lines.push('');
lines.push('Signal strength counts:');
lines.push('');
lines.push(bulletCounts(countBy(matrix, 'strongest_signal')));
lines.push('');
lines.push('Markets covered:');
lines.push('');
lines.push(bulletCounts(countBy(matrix, 'niche')));
lines.push('');
lines.push('## Highest Priority Screenshot Queue');
lines.push('');
lines.push('| App | Market | Signal | Best URL | Tags | Price Points |');
lines.push('| --- | --- | --- | --- | --- | --- |');
const priorityRows = matrix
  .filter(r => r.needs_screenshot_validation === 'yes')
  .sort((a, b) => ({ high: 3, medium: 2, low: 1 }[b.strongest_signal] || 0) - ({ high: 3, medium: 2, low: 1 }[a.strongest_signal] || 0));
for (const row of priorityRows.slice(0, 25)) {
  lines.push(`| ${clean(row.app_name).replace(/\|/g, '/')} | ${row.niche} | ${row.strongest_signal} | ${row.best_url} | ${row.detected_tags.replace(/\|/g, '<br>')} | ${row.detected_price_points.replace(/\|/g, '<br>')} |`);
}
lines.push('');
lines.push('## Interpretation');
lines.push('');
lines.push('- Web pricing pages are noisy: many developer links go to support, corporate, or app landing pages rather than a clean checkout.');
lines.push('- Strong public web paywall signals are useful for monetization packaging evidence, but absence of a signal does not mean the app has no paywall because many mobile apps gate pricing inside the native app.');
lines.push('- Best next step: capture screenshots for high/medium rows, verify trial length, monthly/annual pricing, free-tier behavior, and whether the first meaningful action is paywalled.');
lines.push('');
lines.push('## Files');
lines.push('');
lines.push(`- \`${OUT_RAW}\``);
lines.push(`- \`${OUT_MATRIX}\``);
fs.writeFileSync(OUT_DOC, `${lines.join('\n')}\n`);

console.log(`raw=${OUT_RAW}`);
console.log(`matrix=${OUT_MATRIX}`);
console.log(`doc=${OUT_DOC}`);
console.log(`domains=${siteRows.length}`);
console.log(`raw_rows=${rawRows.length}`);
console.log(`screenshot_queue=${matrix.filter(row => row.needs_screenshot_validation === 'yes').length}`);
