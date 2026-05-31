import fs from 'fs';

const APP_STORE_IAP = 'data_processed/app_store_iap_pricing_summary.csv';
const GOOGLE_PLAY = 'data_raw/google_play_pricing_raw.csv';
const WEB_PAYWALLS = 'data_processed/web_paywall_signal_matrix.csv';
const SCREENSHOTS = 'data_processed/web_paywall_screenshot_interpretation.csv';
const OUT_MARKET = 'data_processed/market_monetization_proxy_matrix.csv';
const OUT_EXAMPLES = 'data_processed/monetization_proxy_examples.csv';
const OUT_DOC = 'docs/market/monetization-proxy-matrix-v1.md';

for (const dir of ['data_processed', 'docs/market']) fs.mkdirSync(dir, { recursive: true });

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
  return body.filter(r => r.some(Boolean)).map(r => Object.fromEntries(headers.map((h, i) => [h, r[i] ?? ''])));
}

function csv(file) {
  return fs.existsSync(file) ? parseCsv(fs.readFileSync(file, 'utf8')) : [];
}

function writeCsv(file, rows, headers) {
  fs.writeFileSync(file, [headers.join(','), ...rows.map(row => headers.map(h => csvEscape(row[h])).join(','))].join('\n'));
}

function uniq(values) {
  return [...new Set(values.filter(Boolean))];
}

function numeric(values) {
  return values.map(v => Number(v)).filter(Number.isFinite);
}

function median(values) {
  const nums = numeric(values).sort((a, b) => a - b);
  if (!nums.length) return '';
  const mid = Math.floor(nums.length / 2);
  return nums.length % 2 ? nums[mid] : Math.round(((nums[mid - 1] + nums[mid]) / 2) * 100) / 100;
}

function max(values) {
  const nums = numeric(values);
  return nums.length ? Math.max(...nums) : '';
}

function marketFromArchetype(row) {
  const text = `${row.niche || ''} ${row.archetype || ''} ${row.app_name || ''}`.toLowerCase();
  if (/gaming|game|rpg|cozy|mahjong/.test(text)) return 'gaming';
  if (/mindful|meditat|sleep|calm|breath|yoga|hypnosis/.test(text)) return 'mindfulness';
  if (/avatar|identity|character|companion|roleplay|chatbot|emoji|sticker|pregnancy|fitness|workout|health/.test(text)) return 'avatar_identity';
  if (/astro|tarot|oracle|manifest|spiritual|faith|bible|devotional|horoscope|soulmate|law of attraction|vision board/.test(text)) return 'astrology_esoterics';
  if (/coach|self|habit|planner|goal|quit|development|routine|life/.test(text)) return 'coaching';
  return 'coaching';
}

function evidenceBand(row) {
  let score = 0;
  score += Number(row.app_store_iap_apps || 0) > 0 ? 2 : 0;
  score += Number(row.app_store_subscription_like_apps || 0) > 0 ? 2 : 0;
  score += Number(row.google_play_iap_apps || 0) > 0 ? 2 : 0;
  score += Number(row.web_medium_high_paywall_domains || 0) > 0 ? 1 : 0;
  score += Number(row.screenshot_confirmed_public_pricing || 0) > 0 ? 2 : 0;
  score += Number(row.max_observed_price_usd || 0) >= 49 ? 1 : 0;
  if (score >= 8) return 'strong_paid_behavior_proxy';
  if (score >= 5) return 'medium_paid_behavior_proxy';
  if (score >= 3) return 'thin_paid_behavior_proxy';
  return 'weak_or_indirect_proxy';
}

function marketInterpretation(market, row) {
  if (market === 'gaming') return 'Very strong IAP monetization proxy, but use as retention/payment benchmark rather than direct Alina spend.';
  if (market === 'astrology_esoterics') return 'Strong subscription/IAP proxy for spiritual and manifestation categories; paywall screenshots still need human review.';
  if (market === 'avatar_identity') return 'Paid behavior exists across avatar/companion/identity tools, but recurring identity value must be separated from novelty generation.';
  if (market === 'mindfulness') return 'Subscription willingness exists in reset/wellness apps; calm UX and paywall timing remain validation risks.';
  if (market === 'coaching') return 'Paid behavior exists in coaching/habit/self-improvement apps, but consumer daily ritual overlap needs manual validation.';
  return 'Paid behavior proxy exists but needs manual validation.';
}

const appStore = csv(APP_STORE_IAP).map(row => ({ ...row, market: marketFromArchetype(row) }));
const googlePlay = csv(GOOGLE_PLAY).filter(row => row.collection_status === 'ok');
const webPaywalls = csv(WEB_PAYWALLS);
const screenshots = csv(SCREENSHOTS);

const markets = ['coaching', 'mindfulness', 'avatar_identity', 'astrology_esoterics', 'gaming'];

const marketRows = markets.map(market => {
  const iapRows = appStore.filter(row => row.market === market);
  const iapFound = iapRows.filter(row => row.extraction_status === 'iap_found');
  const gpRows = googlePlay.filter(row => row.niche === market);
  const webRows = webPaywalls.filter(row => row.niche === market);
  const shotRows = screenshots.filter(row => row.niche === market);
  const subscriptionApps = iapFound.filter(row => /subscription_like/.test(row.product_tags || ''));
  const trialApps = iapFound.filter(row => /trial_like/.test(row.product_tags || ''));
  const lifetimeApps = iapFound.filter(row => /lifetime_like/.test(row.product_tags || ''));
  const row = {
    market,
    app_store_reviewed_apps: uniq(iapRows.map(r => r.app_store_id)).length,
    app_store_iap_apps: uniq(iapFound.map(r => r.app_store_id)).length,
    app_store_subscription_like_apps: uniq(subscriptionApps.map(r => r.app_store_id)).length,
    app_store_trial_like_apps: uniq(trialApps.map(r => r.app_store_id)).length,
    app_store_lifetime_like_apps: uniq(lifetimeApps.map(r => r.app_store_id)).length,
    median_observed_price_usd: median(iapFound.map(r => r.median_observed_price_usd)),
    max_observed_price_usd: max(iapFound.map(r => r.max_price_usd)),
    google_play_ok_apps: gpRows.length,
    google_play_iap_apps: gpRows.filter(r => r.offers_iap === 'yes').length,
    google_play_ad_supported_apps: gpRows.filter(r => r.ad_supported === 'yes').length,
    web_paywall_domains: webRows.length,
    web_medium_high_paywall_domains: webRows.filter(r => ['medium', 'high'].includes(r.strongest_signal)).length,
    screenshot_confirmed_public_pricing: shotRows.filter(r => r.screenshot_interpretation_verdict === 'confirms_public_pricing_signal').length,
    screenshot_partial_paywall_language: shotRows.filter(r => r.screenshot_interpretation_verdict === 'partially_confirms_paywall_language').length,
    strongest_price_examples: ''
  };
  row.monetization_proxy_band = evidenceBand(row);
  row.interpretation = marketInterpretation(market, row);
  row.strongest_price_examples = iapFound
    .slice()
    .sort((a, b) => Number(b.max_price_usd || 0) - Number(a.max_price_usd || 0))
    .slice(0, 5)
    .map(r => `${r.app_name} max $${r.max_price_usd}`)
    .join('|');
  return row;
});

const examples = [
  ...appStore
    .filter(row => row.extraction_status === 'iap_found')
    .map(row => ({
      source_layer: 'app_store_iap',
      market: row.market,
      app_name: row.app_name,
      monetization_signal: row.product_tags,
      observed_price_signal: `${row.min_price_usd}-${row.max_price_usd}`,
      evidence_quality: 'medium_high',
      source_url: row.source_url,
      interpretation: /subscription_like/.test(row.product_tags || '')
        ? 'Observed subscription-like IAP metadata supports paid behavior proxy.'
        : 'Observed IAP metadata supports paid behavior proxy, but product type may be consumable/unclassified.'
    })),
  ...googlePlay
    .filter(row => row.offers_iap === 'yes')
    .map(row => ({
      source_layer: 'google_play_pricing',
      market: row.niche,
      app_name: row.app_name,
      monetization_signal: row.pricing_model,
      observed_price_signal: row.iap_range,
      evidence_quality: 'medium',
      source_url: row.source_url,
      interpretation: 'Google Play detail metadata confirms free-download plus IAP behavior.'
    })),
  ...screenshots
    .filter(row => ['confirms_public_pricing_signal', 'partially_confirms_paywall_language'].includes(row.screenshot_interpretation_verdict))
    .map(row => ({
      source_layer: 'web_paywall_screenshot',
      market: row.niche,
      app_name: row.app_name,
      monetization_signal: row.screenshot_interpretation_verdict,
      observed_price_signal: row.ocr_detected_prices || row.original_detected_prices,
      evidence_quality: row.screenshot_interpretation_verdict === 'confirms_public_pricing_signal' ? 'medium_high' : 'medium_low',
      source_url: row.source_url,
      interpretation: 'Public web screenshot/OCR provides visual monetization signal; human review still required.'
    }))
].sort((a, b) => {
  const quality = { medium_high: 3, medium: 2, medium_low: 1 };
  return (quality[b.evidence_quality] || 0) - (quality[a.evidence_quality] || 0);
});

writeCsv(OUT_MARKET, marketRows, [
  'market', 'monetization_proxy_band', 'app_store_reviewed_apps', 'app_store_iap_apps',
  'app_store_subscription_like_apps', 'app_store_trial_like_apps', 'app_store_lifetime_like_apps',
  'median_observed_price_usd', 'max_observed_price_usd', 'google_play_ok_apps',
  'google_play_iap_apps', 'google_play_ad_supported_apps', 'web_paywall_domains',
  'web_medium_high_paywall_domains', 'screenshot_confirmed_public_pricing',
  'screenshot_partial_paywall_language', 'strongest_price_examples', 'interpretation'
]);

writeCsv(OUT_EXAMPLES, examples.slice(0, 250), [
  'source_layer', 'market', 'app_name', 'monetization_signal', 'observed_price_signal',
  'evidence_quality', 'source_url', 'interpretation'
]);

const lines = [];
lines.push('# Monetization Proxy Matrix V1');
lines.push('');
lines.push(`Generated: ${new Date().toISOString()}`);
lines.push('');
lines.push('## Purpose');
lines.push('');
lines.push('This matrix strengthens H2 using observed monetization proxies from existing competitor evidence: App Store IAP metadata, Google Play pricing/IAP metadata, and public web paywall screenshots. It does not estimate competitor revenue; it proves that paid behavior and monetization surfaces exist across adjacent markets.');
lines.push('');
lines.push('## Market Summary');
lines.push('');
lines.push('| Market | Proxy Band | App Store IAP Apps | Subscription-like Apps | Google Play IAP Apps | Web Medium/High Domains | Confirmed Web Pricing | Max Observed Price | Interpretation |');
lines.push('| --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | --- |');
for (const row of marketRows) {
  lines.push(`| ${row.market} | ${row.monetization_proxy_band} | ${row.app_store_iap_apps} | ${row.app_store_subscription_like_apps} | ${row.google_play_iap_apps} | ${row.web_medium_high_paywall_domains} | ${row.screenshot_confirmed_public_pricing} | ${row.max_observed_price_usd} | ${row.interpretation} |`);
}
lines.push('');
lines.push('## Strongest Price Examples');
lines.push('');
lines.push('| Market | Examples |');
lines.push('| --- | --- |');
for (const row of marketRows) {
  lines.push(`| ${row.market} | ${row.strongest_price_examples.replace(/\|/g, '<br>')} |`);
}
lines.push('');
lines.push('## Interpretation');
lines.push('');
lines.push('- Paid behavior is visible in every target market through IAP or Google Play pricing metadata.');
lines.push('- App Store IAP metadata is the strongest monetization proxy layer because it is app-specific and price-bearing.');
lines.push('- Google Play reinforces free-download plus IAP behavior across all five markets, but it is broader and includes high-noise gaming benchmarks.');
lines.push('- Web paywall screenshots are valuable but conservative: most require human interpretation, and only confirmed screenshots should be used as public-pricing proof.');
lines.push('- This layer supports market existence, not Alina-specific willingness to pay; that still needs prototype and user validation.');
lines.push('');
lines.push('## Files');
lines.push('');
lines.push(`- \`${OUT_MARKET}\``);
lines.push(`- \`${OUT_EXAMPLES}\``);
fs.writeFileSync(OUT_DOC, `${lines.join('\n')}\n`);

console.log(`matrix=${OUT_MARKET}`);
console.log(`examples=${OUT_EXAMPLES}`);
console.log(`doc=${OUT_DOC}`);
console.log(`markets=${marketRows.length}`);
console.log(`examples_rows=${examples.length}`);
