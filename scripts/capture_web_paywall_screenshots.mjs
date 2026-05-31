import fs from 'fs';
import path from 'path';
import { spawn } from 'child_process';

const IN = 'data_processed/web_paywall_signal_matrix.csv';
const OUT_DIR = 'output/paywall_screenshots';
const OUT_INDEX = 'data_processed/web_paywall_screenshot_validation.csv';
const OUT_DOC = 'docs/competitive/web-paywall-screenshot-validation-v1.md';
const CHROME = process.env.CHROME_PATH || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const LIMIT = Number(process.env.PAYWALL_SCREENSHOT_LIMIT || 29);
const TIMEOUT_MS = Number(process.env.PAYWALL_SCREENSHOT_TIMEOUT_MS || 25000);

for (const dir of [OUT_DIR, 'data_processed', 'docs/competitive']) fs.mkdirSync(dir, { recursive: true });

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

function slug(value) {
  return clean(value)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 70) || 'paywall';
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

function capture(url, file) {
  return new Promise(resolve => {
    const args = [
      '--headless=new',
      '--disable-gpu',
      '--hide-scrollbars',
      '--no-first-run',
      '--no-default-browser-check',
      '--disable-dev-shm-usage',
      '--window-size=1440,1400',
      `--screenshot=${file}`,
      url
    ];
    const child = spawn(CHROME, args, { stdio: ['ignore', 'pipe', 'pipe'] });
    let stdout = '';
    let stderr = '';
    const timer = setTimeout(() => {
      child.kill('SIGKILL');
      resolve({ ok: false, status: 'timeout', stdout, stderr });
    }, TIMEOUT_MS);
    child.stdout.on('data', chunk => { stdout += chunk.toString(); });
    child.stderr.on('data', chunk => { stderr += chunk.toString(); });
    child.on('error', error => {
      clearTimeout(timer);
      resolve({ ok: false, status: `spawn_error:${error.message}`, stdout, stderr });
    });
    child.on('close', code => {
      clearTimeout(timer);
      const exists = fs.existsSync(file) && fs.statSync(file).size > 0;
      resolve({ ok: code === 0 && exists, status: code === 0 && exists ? 'captured' : `chrome_exit_${code}`, stdout, stderr });
    });
  });
}

const candidates = parseCsv(fs.readFileSync(IN, 'utf8'))
  .filter(row => row.needs_screenshot_validation === 'yes')
  .sort((a, b) => {
    const strength = { high: 3, medium: 2, low: 1 };
    return (strength[b.strongest_signal] || 0) - (strength[a.strongest_signal] || 0);
  })
  .slice(0, LIMIT);

const rows = [];
for (const [index, row] of candidates.entries()) {
  const filename = `${String(index + 1).padStart(2, '0')}-${slug(row.app_name)}-${slug(row.strongest_signal)}.png`;
  const screenshotPath = path.join(OUT_DIR, filename);
  console.log(`[${index + 1}/${candidates.length}] ${row.app_name} ${row.best_url}`);
  const result = await capture(row.best_url, screenshotPath);
  rows.push({
    capture_rank: index + 1,
    app_name: row.app_name,
    niche: row.niche,
    developer: row.developer,
    strongest_signal: row.strongest_signal,
    source_url: row.best_url,
    detected_tags: row.detected_tags,
    detected_price_points: row.detected_price_points,
    screenshot_status: result.ok ? 'captured' : result.status,
    screenshot_path: result.ok ? screenshotPath : '',
    screenshot_bytes: result.ok ? fs.statSync(screenshotPath).size : 0,
    manual_validation_status: 'needs_human_review',
    validation_questions: 'Is the visible page actually about this app/product? Are trial length, monthly/annual price, and first meaningful paywall boundary visible? Does the screenshot confirm or weaken the pricing claim?',
    captured_at: new Date().toISOString()
  });
}

writeCsv(OUT_INDEX, rows, [
  'capture_rank', 'app_name', 'niche', 'developer', 'strongest_signal', 'source_url',
  'detected_tags', 'detected_price_points', 'screenshot_status', 'screenshot_path',
  'screenshot_bytes', 'manual_validation_status', 'validation_questions', 'captured_at'
]);

const captured = rows.filter(row => row.screenshot_status === 'captured');
const lines = [];
lines.push('# Web Paywall Screenshot Validation V1');
lines.push('');
lines.push(`Generated: ${new Date().toISOString()}`);
lines.push('');
lines.push('## Scope');
lines.push('');
lines.push(`This pass uses headless Chrome to capture screenshots for the web-paywall queue. It covers ${rows.length} queued URLs prioritized by high/medium pricing signal strength.`);
lines.push('');
lines.push('This is visual evidence capture, not final interpretation. A human still needs to inspect each screenshot and decide whether the page truly confirms product pricing, trial terms, and paywall timing.');
lines.push('');
lines.push('## Coverage');
lines.push('');
lines.push(`- Attempted captures: ${rows.length}`);
lines.push(`- Captured screenshots: ${captured.length}`);
lines.push(`- Screenshot directory: \`${OUT_DIR}\``);
lines.push('');
lines.push('Capture status counts:');
lines.push('');
lines.push(bulletCounts(countBy(rows, 'screenshot_status')));
lines.push('');
lines.push('Captured screenshots by market:');
lines.push('');
lines.push(bulletCounts(countBy(captured, 'niche')));
lines.push('');
lines.push('## Screenshot Index');
lines.push('');
lines.push('| Rank | App | Market | Signal | Source URL | Screenshot | Detected Prices |');
lines.push('| ---: | --- | --- | --- | --- | --- | --- |');
for (const row of rows) {
  lines.push(`| ${row.capture_rank} | ${clean(row.app_name).replace(/\|/g, '/')} | ${row.niche} | ${row.strongest_signal} | ${row.source_url} | ${row.screenshot_path ? `\`${row.screenshot_path}\`` : row.screenshot_status} | ${row.detected_price_points.replace(/\|/g, '<br>')} |`);
}
lines.push('');
lines.push('## Manual Review Instructions');
lines.push('');
lines.push('For each captured screenshot, mark whether it confirms, partially confirms, weakens, or rejects the paywall claim. Record exact visible price/trial terms, whether the page belongs to the same app or only the parent company, and whether the first meaningful user action appears gated.');
lines.push('');
lines.push('## Files');
lines.push('');
lines.push(`- \`${OUT_INDEX}\``);
lines.push(`- \`${OUT_DIR}/*.png\``);
fs.writeFileSync(OUT_DOC, `${lines.join('\n')}\n`);

console.log(`index=${OUT_INDEX}`);
console.log(`doc=${OUT_DOC}`);
console.log(`attempted=${rows.length}`);
console.log(`captured=${captured.length}`);
