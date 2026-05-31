import fs from 'fs';

const OUT_ROWS = 'data_processed/web_paywall_visual_adjudication.csv';
const OUT_SUMMARY = 'data_processed/web_paywall_visual_adjudication_summary.csv';
const OUT_DOC = 'docs/competitive/web-paywall-visual-adjudication-v1.md';

for (const dir of ['data_processed', 'docs/competitive']) fs.mkdirSync(dir, { recursive: true });

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
  return body.filter(r => r.some(Boolean)).map(r => Object.fromEntries(headers.map((h, i) => [h, r[i] ?? ''])));
}

function csv(file) {
  return fs.existsSync(file) ? parseCsv(fs.readFileSync(file, 'utf8')) : [];
}

function writeCsv(file, rows, headers) {
  fs.writeFileSync(file, [headers.join(','), ...rows.map(row => headers.map(h => csvEscape(row[h])).join(','))].join('\n'));
}

function mdTable(rows, columns, limit = rows.length) {
  const slice = rows.slice(0, limit);
  const header = `| ${columns.map(c => c.label).join(' | ')} |`;
  const sep = `| ${columns.map(c => c.align === 'right' ? '---:' : '---').join(' | ')} |`;
  const body = slice.map(row => `| ${columns.map(c => clean(row[c.key]).replace(/\|/g, '/')).join(' | ')} |`);
  return [header, sep, ...body].join('\n');
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

function adjudicate(row) {
  const verdict = row.screenshot_interpretation_verdict;
  const tags = String(row.ocr_detected_tags || '');
  const prices = clean(row.ocr_detected_prices);
  const originalPrices = clean(row.original_detected_prices);
  const excerpt = String(row.ocr_excerpt || '').toLowerCase();

  if (verdict === 'confirms_public_pricing_signal' && prices) {
    return {
      adjudication: 'confirmed_visible_public_pricing',
      confidence: 'high',
      price_evidence: prices,
      rationale: 'Screenshot OCR contains visible price and pricing/subscription/checkout language.'
    };
  }
  if (verdict === 'confirms_public_pricing_signal') {
    return {
      adjudication: 'confirmed_paid_surface_no_clean_price',
      confidence: 'medium',
      price_evidence: prices || originalPrices,
      rationale: 'Screenshot confirms paid surface language but price extraction is incomplete.'
    };
  }
  if (verdict === 'partially_confirms_paywall_language') {
    return {
      adjudication: 'partial_paid_surface_language',
      confidence: tags.includes('visible_subscription') ? 'medium' : 'low_medium',
      price_evidence: prices || originalPrices,
      rationale: 'Screenshot contains subscription/paywall language but not enough visible price or plan terms.'
    };
  }
  if (verdict === 'weakens_signal_not_found') {
    return {
      adjudication: 'reject_or_weaken_public_page_signal',
      confidence: 'medium',
      price_evidence: '',
      rationale: 'Captured page is not found, unreachable, or visibly not the claimed pricing/paywall page.'
    };
  }
  if (verdict === 'needs_manual_review_high_signal_no_visible_price') {
    return {
      adjudication: 'manual_review_required_high_prior',
      confidence: 'low_medium',
      price_evidence: originalPrices,
      rationale: 'Original crawler saw high paywall/pricing signal, but screenshot did not expose a clean visible price.'
    };
  }
  if (tags.includes('visible_login_gate') || excerpt.includes('login')) {
    return {
      adjudication: 'login_gate_or_app_store_redirect',
      confidence: 'low_medium',
      price_evidence: prices || originalPrices,
      rationale: 'Captured page appears to gate pricing behind login, redirect, or account flow.'
    };
  }
  if (tags.includes('visible_price') && prices) {
    return {
      adjudication: 'visible_price_context_uncertain',
      confidence: 'low_medium',
      price_evidence: prices,
      rationale: 'A price-like token is visible, but OCR/page context does not confirm subscription or paywall terms.'
    };
  }
  return {
    adjudication: 'weak_or_unconfirmed_public_signal',
    confidence: 'low',
    price_evidence: prices || originalPrices,
    rationale: 'Screenshot/OCR does not confirm public pricing or paywall terms.'
  };
}

const rows = csv('data_processed/web_paywall_screenshot_interpretation.csv');

const adjudicated = rows.map(row => {
  const result = adjudicate(row);
  return {
    capture_rank: row.capture_rank,
    app_name: row.app_name,
    niche: row.niche,
    original_signal: row.strongest_signal,
    source_url: row.source_url,
    screenshot_path: row.screenshot_path,
    ocr_status: row.ocr_status,
    ocr_detected_tags: row.ocr_detected_tags,
    original_detected_prices: row.original_detected_prices,
    ocr_detected_prices: row.ocr_detected_prices,
    screenshot_interpretation_verdict: row.screenshot_interpretation_verdict,
    visual_adjudication: result.adjudication,
    adjudication_confidence: result.confidence,
    price_evidence: result.price_evidence,
    conservative_rationale: result.rationale,
    final_claim_limit: 'Public screenshot/OCR evidence only; human review and in-app paywall inspection remain required before final claims.',
    signoff_status: 'needs_human_signoff',
    ocr_excerpt: row.ocr_excerpt
  };
});

const markets = [...new Set(adjudicated.map(row => row.niche))].sort();
const summary = markets.map(niche => {
  const marketRows = adjudicated.filter(row => row.niche === niche);
  const confirmed = marketRows.filter(row => row.visual_adjudication === 'confirmed_visible_public_pricing');
  const partial = marketRows.filter(row => ['confirmed_paid_surface_no_clean_price', 'partial_paid_surface_language', 'visible_price_context_uncertain'].includes(row.visual_adjudication));
  const weakened = marketRows.filter(row => row.visual_adjudication === 'reject_or_weaken_public_page_signal');
  const manual = marketRows.filter(row => ['manual_review_required_high_prior', 'login_gate_or_app_store_redirect'].includes(row.visual_adjudication));
  return {
    niche,
    screenshots_reviewed: String(marketRows.length),
    confirmed_visible_pricing: String(confirmed.length),
    partial_paid_surface: String(partial.length),
    weakened_or_rejected: String(weakened.length),
    manual_or_login_gate: String(manual.length),
    strongest_examples: confirmed.concat(partial).slice(0, 5).map(row => row.app_name).join('|'),
    market_read: confirmed.length >= 1 ? 'visible_public_pricing_confirmed_for_some_examples' : partial.length >= 2 ? 'paid_surface_language_directional' : 'mostly_unconfirmed_public_web_pricing',
    caveat: 'Public website screenshots often miss in-app paywalls; this is validation-priority evidence, not full monetization proof.'
  };
});

writeCsv(OUT_ROWS, adjudicated, [
  'capture_rank', 'app_name', 'niche', 'original_signal', 'source_url',
  'screenshot_path', 'ocr_status', 'ocr_detected_tags', 'original_detected_prices',
  'ocr_detected_prices', 'screenshot_interpretation_verdict', 'visual_adjudication',
  'adjudication_confidence', 'price_evidence', 'conservative_rationale',
  'final_claim_limit', 'signoff_status', 'ocr_excerpt'
]);

writeCsv(OUT_SUMMARY, summary, [
  'niche', 'screenshots_reviewed', 'confirmed_visible_pricing',
  'partial_paid_surface', 'weakened_or_rejected', 'manual_or_login_gate',
  'strongest_examples', 'market_read', 'caveat'
]);

const confirmed = adjudicated.filter(row => row.visual_adjudication === 'confirmed_visible_public_pricing');
const partial = adjudicated.filter(row => ['confirmed_paid_surface_no_clean_price', 'partial_paid_surface_language', 'visible_price_context_uncertain'].includes(row.visual_adjudication));
const weakened = adjudicated.filter(row => row.visual_adjudication === 'reject_or_weaken_public_page_signal');
const manual = adjudicated.filter(row => ['manual_review_required_high_prior', 'login_gate_or_app_store_redirect'].includes(row.visual_adjudication));

const lines = [];
lines.push('# Web Paywall Visual Adjudication V1');
lines.push('');
lines.push(`Generated: ${new Date().toISOString()}`);
lines.push('');
lines.push('## Purpose');
lines.push('');
lines.push('This layer turns the screenshot/OCR paywall queue into conservative evidence categories. It is not human sign-off and it does not inspect in-app paywalls; it decides what the captured public website screenshots can and cannot support.');
lines.push('');
lines.push('## Summary');
lines.push('');
lines.push(`- Screenshots adjudicated: ${adjudicated.length}`);
lines.push(`- Confirmed visible public pricing: ${confirmed.length}`);
lines.push(`- Partial paid-surface language or uncertain visible price: ${partial.length}`);
lines.push(`- Weakened/rejected public page signal: ${weakened.length}`);
lines.push(`- Login/high-priority manual review required: ${manual.length}`);
lines.push('');
lines.push('Visual adjudication mix:');
lines.push('');
lines.push(bulletCounts(countBy(adjudicated, 'visual_adjudication')));
lines.push('');
lines.push('## Market Summary');
lines.push('');
lines.push(mdTable(summary, [
  { key: 'niche', label: 'Market' },
  { key: 'screenshots_reviewed', label: 'Screenshots', align: 'right' },
  { key: 'confirmed_visible_pricing', label: 'Confirmed', align: 'right' },
  { key: 'partial_paid_surface', label: 'Partial', align: 'right' },
  { key: 'weakened_or_rejected', label: 'Weakened', align: 'right' },
  { key: 'manual_or_login_gate', label: 'Manual/Login', align: 'right' },
  { key: 'market_read', label: 'Read' }
]));
lines.push('');
lines.push('## Confirmed And Partial Examples');
lines.push('');
lines.push(mdTable(confirmed.concat(partial), [
  { key: 'capture_rank', label: 'Rank', align: 'right' },
  { key: 'app_name', label: 'App' },
  { key: 'niche', label: 'Market' },
  { key: 'visual_adjudication', label: 'Adjudication' },
  { key: 'price_evidence', label: 'Price Evidence' },
  { key: 'screenshot_path', label: 'Screenshot' }
], 20));
lines.push('');
lines.push('## Claim Limits');
lines.push('');
lines.push('- Confirmed visible public pricing means the public screenshot/OCR supports a pricing-surface claim for that URL.');
lines.push('- Partial paid-surface language means the page hints at paid plans/subscription/commerce but does not show enough price/terms to be final.');
lines.push('- Weakened/rejected means the earlier crawler signal should not be used as paywall proof without a better URL.');
lines.push('- Human sign-off and in-app paywall inspection remain required for final investor/user-facing claims.');
lines.push('');
lines.push('## Files');
lines.push('');
lines.push(`- \`${OUT_ROWS}\``);
lines.push(`- \`${OUT_SUMMARY}\``);

fs.writeFileSync(OUT_DOC, `${lines.join('\n')}\n`);

console.log(`rows=${OUT_ROWS}`);
console.log(`summary=${OUT_SUMMARY}`);
console.log(`doc=${OUT_DOC}`);
console.log(`adjudicated=${adjudicated.length}`);
console.log(`confirmed=${confirmed.length}`);
console.log(`partial=${partial.length}`);
console.log(`weakened=${weakened.length}`);
console.log(`manual_or_login=${manual.length}`);
