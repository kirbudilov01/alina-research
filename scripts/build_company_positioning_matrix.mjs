import fs from 'fs';

const RAW_OUT = 'data_raw/company_positioning_raw.csv';
const MATRIX_OUT = 'data_processed/company_positioning_matrix.csv';
const DOC_OUT = 'docs/competitive/company-positioning-matrix-v1.md';

for (const dir of ['data_raw', 'data_processed', 'docs/competitive']) fs.mkdirSync(dir, { recursive: true });

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
  fs.writeFileSync(file, `${[headers.join(','), ...rows.map(row => headers.map(h => csvEscape(row[h])).join(','))].join('\n')}\n`);
}

function mdTable(rows, columns, limit = rows.length) {
  const slice = rows.slice(0, limit);
  const header = `| ${columns.map(c => c.label).join(' | ')} |`;
  const sep = `| ${columns.map(c => c.align === 'right' ? '---:' : '---').join(' | ')} |`;
  const body = slice.map(row => `| ${columns.map(c => clean(row[c.key]).replace(/\|/g, '<br>')).join(' | ')} |`);
  return [header, sep, ...body].join('\n');
}

function countBy(rows, key) {
  const out = {};
  for (const row of rows) out[row[key] || 'unknown'] = (out[row[key] || 'unknown'] || 0) + 1;
  return out;
}

function uniq(values) {
  return Array.from(new Set(values.map(clean).filter(Boolean)));
}

function host(url) {
  try {
    return new URL(clean(url)).hostname.replace(/^www\./, '');
  } catch {
    return '';
  }
}

function pageType(url) {
  const path = (() => {
    try {
      return new URL(clean(url)).pathname.toLowerCase();
    } catch {
      return clean(url).toLowerCase();
    }
  })();
  if (/pricing|plans|subscribe|subscription|premium|upgrade|membership/.test(path)) return 'pricing_or_plan_page';
  if (/business|enterprise|employer|teams|workplace|providers/.test(path)) return 'b2b_or_enterprise_page';
  if (/features|product|apps|games/.test(path)) return 'feature_or_product_page';
  if (path === '/' || !path.replace(/\//g, '')) return 'homepage';
  return 'other_public_page';
}

function tagsFromText(text) {
  const lower = clean(text).toLowerCase();
  const tags = [];
  const checks = [
    ['ai_or_personalization', /\bai\b|personalized|personalization|recommend|assistant|coach/],
    ['mindfulness_reset', /mindful|meditation|breath|sleep|stress|anxiety|therapy|mental health|wellbeing|wellness/],
    ['habit_action_loop', /habit|routine|daily|streak|goal|task|action|challenge|quest/],
    ['avatar_identity', /avatar|character|persona|identity|profile|customi[sz]e|virtual/],
    ['astrology_spiritual', /astrology|horoscope|tarot|kundli|birth chart|spiritual|manifest|affirmation|devotional|prayer|bible/],
    ['progress_feedback', /progress|level|xp|achievement|insight|stats|journey|growth/],
    ['community_social', /community|friend|social|share|group|partner|accountability/],
    ['b2b_enterprise', /business|enterprise|employer|employee|team|organization|provider|workplace|demo/],
    ['game_progression', /game|play|player|reward|coin|skin|battle|leaderboard/]
  ];
  for (const [tag, pattern] of checks) {
    if (pattern.test(lower)) tags.push(tag);
  }
  return tags.join('|') || 'unclassified_public_positioning';
}

function monetizationTags(row, text) {
  const signalTags = clean(row.signal_tags).replace(/\bno_pricing_signal\b/g, '');
  const lower = clean(`${signalTags} ${row.price_points_detected || ''} ${text}`).toLowerCase();
  const tags = [];
  if (/\$\d|€\d|£\d|price|pricing|per month|per year|monthly|yearly/.test(lower)) tags.push('visible_price_or_pricing_language');
  if (/subscription|subscribe|membership|premium|plus|pro/.test(lower)) tags.push('subscription_or_premium_language');
  if (/trial|free trial/.test(lower)) tags.push('trial_language');
  if (/demo|sales|enterprise|business|employee|team/.test(lower)) tags.push('b2b_sales_motion');
  if (/checkout|buy now|book|purchase|upgrade/.test(lower)) tags.push('purchase_or_upgrade_cta');
  if (!tags.length) tags.push('no_clean_public_monetization_signal');
  return tags.join('|');
}

function evidenceQuality(row) {
  if (clean(row.fetch_status) !== 'ok' || clean(row.http_status) !== '200') return 'low';
  const signalTags = clean(row.signal_tags).replace(/\bno_pricing_signal\b/g, '');
  if (clean(row.price_points_detected) || /visible_price|visible_subscription|pricing/.test(signalTags)) return 'medium_high';
  if (clean(row.text_excerpt).length > 120) return 'medium';
  return 'low';
}

function productMatchRisk(row, url) {
  const domain = host(url);
  const lower = `${domain} ${row.page_title || ''} ${row.text_excerpt || ''}`.toLowerCase();
  if (/apps\.apple\.com|play\.google\.com/.test(domain)) return 'app_store_listing_not_company_site';
  if (/business|enterprise|employer|employee|team|provider|demo/.test(lower)) return 'b2b_or_parent_context_possible';
  if (/404|not found|can't be reached|temporarily down/.test(lower)) return 'unreachable_or_not_found';
  return 'public_company_or_product_page';
}

const webRows = csv('data_raw/web_paywall_discovery_raw.csv');

const rawRows = webRows.map((row, index) => {
  const text = clean(`${row.page_title || ''} ${row.text_excerpt || ''}`);
  const sourceUrl = clean(row.final_url || row.requested_url || row.domain);
  const pType = pageType(sourceUrl);
  return {
    positioning_row_id: `CP_${String(index + 1).padStart(4, '0')}`,
    app_name: clean(row.app_name),
    publisher: clean(row.developer),
    platform: 'public_web',
    source_kind: 'company_positioning_page',
    source_bucket: 'Company/public web positioning',
    source_url: sourceUrl,
    requested_url: clean(row.requested_url),
    final_url: clean(row.final_url),
    domain: host(sourceUrl),
    niche: clean(row.niche),
    keyword: pType,
    query: `known_domain_${pType}`,
    rank_position: index + 1,
    category: pType,
    rating: '',
    review_count: '',
    pricing_type: monetizationTags(row, text),
    iap_present: clean(row.offers_iap),
    subscription_present: /subscription|subscribe|membership|premium|plus|pro/i.test(`${row.signal_tags || ''} ${text}`) ? 'yes_or_language_present' : '',
    core_features: text.slice(0, 900),
    retention_mechanics: tagsFromText(text),
    personalization_tags: tagsFromText(text).split('|').filter(tag => /ai|personalization|avatar|identity/.test(tag)).join('|'),
    audience_tags: tagsFromText(text).split('|').filter(tag => /mindfulness|spiritual|b2b|game|community/.test(tag)).join('|'),
    monetization_notes: clean(row.price_points_detected || row.signal_tags || 'no clean pricing extracted'),
    page_title: clean(row.page_title),
    http_status: clean(row.http_status),
    fetch_status: clean(row.fetch_status),
    page_type: pType,
    positioning_tags: tagsFromText(text),
    monetization_tags: monetizationTags(row, text),
    price_points_detected: clean(row.price_points_detected),
    product_match_risk: productMatchRisk(row, sourceUrl),
    text_excerpt: clean(row.text_excerpt).slice(0, 1200),
    collected_at: clean(row.collected_at) || new Date().toISOString(),
    evidence_quality: evidenceQuality(row),
    collection_status: clean(row.fetch_status) === 'ok' ? 'ok' : clean(row.fetch_status || 'unknown')
  };
});

const byApp = new Map();
for (const row of rawRows) {
  const key = `${row.app_name}|${row.niche}`;
  if (!byApp.has(key)) byApp.set(key, []);
  byApp.get(key).push(row);
}

const matrixRows = Array.from(byApp.entries()).map(([key, rows]) => {
  const [appName, niche] = key.split('|');
  const okRows = rows.filter(row => row.collection_status === 'ok');
  const pricingRows = rows.filter(row => !row.monetization_tags.includes('no_clean_public_monetization_signal'));
  const b2bRows = rows.filter(row => row.product_match_risk === 'b2b_or_parent_context_possible');
  const pageTypes = uniq(rows.map(row => row.page_type));
  const positioningTags = uniq(rows.flatMap(row => row.positioning_tags.split('|')));
  const monetization = uniq(rows.flatMap(row => row.monetization_tags.split('|')));
  return {
    app_name: appName,
    niche,
    page_rows: rows.length,
    ok_rows: okRows.length,
    domains: uniq(rows.map(row => row.domain)).join('|'),
    page_types: pageTypes.join('|'),
    positioning_tags: positioningTags.join('|'),
    monetization_tags: monetization.join('|'),
    price_points_seen: uniq(rows.map(row => row.price_points_detected)).join('|'),
    b2b_or_parent_context_rows: b2bRows.length,
    clean_public_monetization_rows: pricingRows.length,
    evidence_quality_band: okRows.length >= 2 && pricingRows.length >= 1 ? 'medium_high_public_positioning' : (okRows.length ? 'medium_public_positioning' : 'low_or_unreachable'),
    conservative_use_ru: pricingRows.length
      ? 'Использовать как public positioning / monetization context, но не как in-app WTP proof.'
      : 'Использовать как public positioning context; monetization claim не усиливать без paywall/WTP evidence.',
    source_urls: uniq(rows.map(row => row.source_url)).slice(0, 12).join('|')
  };
}).sort((a, b) => Number(b.clean_public_monetization_rows) - Number(a.clean_public_monetization_rows) || Number(b.ok_rows) - Number(a.ok_rows));

const rawHeaders = [
  'positioning_row_id', 'app_name', 'publisher', 'platform', 'source_kind', 'source_bucket',
  'source_url', 'requested_url', 'final_url', 'domain', 'niche', 'keyword', 'query',
  'rank_position', 'category', 'rating', 'review_count', 'pricing_type', 'iap_present',
  'subscription_present', 'core_features', 'retention_mechanics', 'personalization_tags',
  'audience_tags', 'monetization_notes', 'page_title', 'http_status', 'fetch_status',
  'page_type', 'positioning_tags', 'monetization_tags', 'price_points_detected',
  'product_match_risk', 'text_excerpt', 'collected_at', 'evidence_quality', 'collection_status'
];
const matrixHeaders = [
  'app_name', 'niche', 'page_rows', 'ok_rows', 'domains', 'page_types',
  'positioning_tags', 'monetization_tags', 'price_points_seen',
  'b2b_or_parent_context_rows', 'clean_public_monetization_rows',
  'evidence_quality_band', 'conservative_use_ru', 'source_urls'
];

writeCsv(RAW_OUT, rawRows, rawHeaders);
writeCsv(MATRIX_OUT, matrixRows, matrixHeaders);

const lines = [];
lines.push('# Company Positioning Matrix V1');
lines.push('');
lines.push(`Generated: ${new Date().toISOString()}`);
lines.push('');
lines.push('## Purpose');
lines.push('');
lines.push('This layer converts already collected public web/paywall pages into an auditable company-positioning matrix. It deliberately avoids search-engine expansion: every row comes from known competitor domains and previously collected public URLs.');
lines.push('');
lines.push('## Summary');
lines.push('');
lines.push(`- Raw public positioning rows: ${rawRows.length}`);
lines.push(`- App/niche matrix rows: ${matrixRows.length}`);
lines.push(`- OK fetched rows: ${rawRows.filter(row => row.collection_status === 'ok').length}`);
lines.push(`- Rows with clean public monetization language: ${rawRows.filter(row => !row.monetization_tags.includes('no_clean_public_monetization_signal')).length}`);
lines.push(`- Domains represented: ${Object.keys(countBy(rawRows, 'domain')).length}`);
lines.push('');
lines.push('## Matrix Preview');
lines.push('');
lines.push(mdTable(matrixRows, [
  { key: 'app_name', label: 'App' },
  { key: 'niche', label: 'Niche' },
  { key: 'page_rows', label: 'Pages', align: 'right' },
  { key: 'ok_rows', label: 'OK', align: 'right' },
  { key: 'positioning_tags', label: 'Positioning Tags' },
  { key: 'monetization_tags', label: 'Monetization Tags' },
  { key: 'evidence_quality_band', label: 'Use Band' }
], 20));
lines.push('');
lines.push('## Claim Boundary');
lines.push('');
lines.push('- Public company pages can support positioning, language, paid-depth, B2B/consumer boundary, and product-match risk reads.');
lines.push('- They do not prove in-app paywall order, conversion, retention, or Alina willingness-to-pay.');
lines.push('- Rows flagged as B2B/parent context must not be used as direct consumer app pricing proof.');
lines.push('');
lines.push('## Files');
lines.push('');
lines.push(`- \`${RAW_OUT}\``);
lines.push(`- \`${MATRIX_OUT}\``);

fs.writeFileSync(DOC_OUT, `${lines.join('\n')}\n`);

console.log(`company_positioning_raw=${RAW_OUT}`);
console.log(`company_positioning_matrix=${MATRIX_OUT}`);
console.log(`doc=${DOC_OUT}`);
console.log(`raw_rows=${rawRows.length}`);
console.log(`matrix_rows=${matrixRows.length}`);
