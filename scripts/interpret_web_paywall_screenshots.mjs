import fs from 'fs';
import { spawn } from 'child_process';

const IN = 'data_processed/web_paywall_screenshot_validation.csv';
const OUT = 'data_processed/web_paywall_screenshot_interpretation.csv';
const OUT_DOC = 'docs/competitive/web-paywall-screenshot-interpretation-v1.md';
const TESSERACT = process.env.TESSERACT_PATH || 'tesseract';
const TIMEOUT_MS = Number(process.env.OCR_TIMEOUT_MS || 20000);

for (const dir of ['data_processed', 'docs/competitive']) fs.mkdirSync(dir, { recursive: true });

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

function ocr(file) {
  return new Promise(resolve => {
    if (!file || !fs.existsSync(file)) return resolve({ ok: false, text: '', status: 'missing_file' });
    const child = spawn(TESSERACT, [file, 'stdout', '-l', 'eng', '--psm', '6'], { stdio: ['ignore', 'pipe', 'pipe'] });
    let stdout = '';
    let stderr = '';
    const timer = setTimeout(() => {
      child.kill('SIGKILL');
      resolve({ ok: false, text: stdout, status: 'timeout' });
    }, TIMEOUT_MS);
    child.stdout.on('data', chunk => { stdout += chunk.toString(); });
    child.stderr.on('data', chunk => { stderr += chunk.toString(); });
    child.on('error', error => {
      clearTimeout(timer);
      resolve({ ok: false, text: stdout, status: `spawn_error:${error.message}` });
    });
    child.on('close', code => {
      clearTimeout(timer);
      resolve({ ok: code === 0, text: stdout, status: code === 0 ? 'ok' : `tesseract_exit_${code}:${stderr.slice(0, 120)}` });
    });
  });
}

function analyze(text, row) {
  const lower = text.toLowerCase();
  const priceMatches = [...new Set((text.match(/(?:[$€£]\s?\d+(?:[.,]\d{2})?|\d+(?:[.,]\d{2})?\s?(?:usd|eur|gbp))/gi) || []).map(clean))].slice(0, 20);
  const flags = {
    visible_price: priceMatches.length > 0,
    visible_subscription: /\b(month|monthly|year|yearly|annual|subscription|subscribe|renew|renews|per user|per month|per year)\b/i.test(text),
    visible_trial: /\b(free trial|trial|try free|7 day|14 day|30 day)\b/i.test(text),
    visible_checkout: /\b(checkout|billing|payment|buy now|subscribe to|calculate pricing|book a demo|contact us)\b/i.test(text),
    visible_not_found: /\b(404|not found|can't seem to find|cannot find|can't be reached|site can't be reached|temporarily down|moved permanently|page you're looking for|oops)\b/i.test(text),
    visible_login_gate: /\b(log in|login|sign in|create account)\b/i.test(text)
  };
  let verdict = 'weak_or_unconfirmed';
  if (flags.visible_not_found) verdict = 'weakens_signal_not_found';
  else if (flags.visible_price && (flags.visible_subscription || flags.visible_checkout)) verdict = 'confirms_public_pricing_signal';
  else if (flags.visible_subscription || flags.visible_trial || flags.visible_checkout) verdict = 'partially_confirms_paywall_language';
  else if (row.strongest_signal === 'high' && !flags.visible_price) verdict = 'needs_manual_review_high_signal_no_visible_price';
  const tags = Object.entries(flags).filter(([, ok]) => ok).map(([tag]) => tag);
  if (!tags.length) tags.push('no_ocr_paywall_terms');
  return { priceMatches, tags, verdict };
}

const input = parseCsv(fs.readFileSync(IN, 'utf8'));
const rows = [];
for (const [index, row] of input.entries()) {
  console.log(`[${index + 1}/${input.length}] ${row.app_name}`);
  const result = await ocr(row.screenshot_path);
  const analysis = analyze(result.text, row);
  rows.push({
    capture_rank: row.capture_rank,
    app_name: row.app_name,
    niche: row.niche,
    strongest_signal: row.strongest_signal,
    source_url: row.source_url,
    screenshot_path: row.screenshot_path,
    ocr_status: result.status,
    ocr_char_count: clean(result.text).length,
    ocr_detected_tags: analysis.tags.join('|'),
    ocr_detected_prices: analysis.priceMatches.join('|'),
    original_detected_prices: row.detected_price_points,
    screenshot_interpretation_verdict: analysis.verdict,
    manual_validation_status: 'needs_human_review',
    ocr_excerpt: clean(result.text).slice(0, 700)
  });
}

writeCsv(OUT, rows, [
  'capture_rank', 'app_name', 'niche', 'strongest_signal', 'source_url',
  'screenshot_path', 'ocr_status', 'ocr_char_count', 'ocr_detected_tags',
  'ocr_detected_prices', 'original_detected_prices',
  'screenshot_interpretation_verdict', 'manual_validation_status', 'ocr_excerpt'
]);

const lines = [];
lines.push('# Web Paywall Screenshot Interpretation V1');
lines.push('');
lines.push(`Generated: ${new Date().toISOString()}`);
lines.push('');
lines.push('## Scope');
lines.push('');
lines.push('This layer OCRs the captured paywall screenshots and applies conservative heuristics to separate visible pricing evidence from weak, ambiguous, login-gated, or not-found pages.');
lines.push('');
lines.push('This is still not final human validation. OCR can miss text and cannot fully judge whether a page belongs to the same mobile app, but it is a stronger triage layer than HTML keywords alone.');
lines.push('');
lines.push('## Coverage');
lines.push('');
lines.push(`- Screenshots interpreted: ${rows.length}`);
lines.push(`- OCR success rows: ${rows.filter(row => row.ocr_status === 'ok').length}`);
lines.push('');
lines.push('Interpretation verdict counts:');
lines.push('');
lines.push(bulletCounts(countBy(rows, 'screenshot_interpretation_verdict')));
lines.push('');
lines.push('OCR tag counts:');
lines.push('');
const tagCounts = {};
for (const row of rows) for (const tag of String(row.ocr_detected_tags || '').split('|').filter(Boolean)) tagCounts[tag] = (tagCounts[tag] || 0) + 1;
lines.push(bulletCounts(tagCounts));
lines.push('');
lines.push('## Priority Review Table');
lines.push('');
lines.push('| Rank | App | Signal | Verdict | OCR Prices | Screenshot |');
lines.push('| ---: | --- | --- | --- | --- | --- |');
for (const row of rows) {
  lines.push(`| ${row.capture_rank} | ${clean(row.app_name).replace(/\|/g, '/')} | ${row.strongest_signal} | ${row.screenshot_interpretation_verdict} | ${row.ocr_detected_prices.replace(/\|/g, '<br>')} | \`${row.screenshot_path}\` |`);
}
lines.push('');
lines.push('## Interpretation');
lines.push('');
lines.push('- Treat `confirms_public_pricing_signal` as the strongest evidence for visible public pricing.');
lines.push('- Treat `partially_confirms_paywall_language` as evidence of packaging/paywall language, but still verify exact product and terms.');
lines.push('- Treat `weakens_signal_not_found` as a reason to downgrade the web-paywall claim for that row unless another URL confirms pricing.');
lines.push('- Keep all rows as `needs_human_review` until screenshots are inspected by a person.');
lines.push('');
lines.push('## Files');
lines.push('');
lines.push(`- \`${OUT}\``);
fs.writeFileSync(OUT_DOC, `${lines.join('\n')}\n`);

console.log(`out=${OUT}`);
console.log(`doc=${OUT_DOC}`);
console.log(`rows=${rows.length}`);
