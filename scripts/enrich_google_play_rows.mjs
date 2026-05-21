import fs from 'fs';

const FILES = [
  'data_raw/top300_gaming_multi_source.csv',
  'data_raw/top300_astrology_esoterics_multi_source.csv',
  'data_raw/top300_avatar_identity_multi_source.csv',
  'data_raw/top300_coaching_multi_source.csv',
  'data_raw/top300_mindfulness_multi_source.csv'
];

function parseCsv(content) {
  const rows = [];
  let row = [];
  let cell = '';
  let inQuotes = false;
  for (let i = 0; i < content.length; i++) {
    const ch = content[i];
    const next = content[i + 1];
    if (inQuotes) {
      if (ch === '"' && next === '"') {
        cell += '"';
        i++;
      } else if (ch === '"') {
        inQuotes = false;
      } else {
        cell += ch;
      }
    } else {
      if (ch === '"') {
        inQuotes = true;
      } else if (ch === ',') {
        row.push(cell);
        cell = '';
      } else if (ch === '\n') {
        row.push(cell);
        rows.push(row);
        row = [];
        cell = '';
      } else if (ch === '\r') {
      } else {
        cell += ch;
      }
    }
  }
  if (cell.length > 0 || row.length > 0) {
    row.push(cell);
    rows.push(row);
  }
  return rows;
}

function toCsv(rows) {
  return rows.map((r) => r.map((v) => `"${String(v ?? '').replace(/"/g, '""')}"`).join(',')).join('\n') + '\n';
}

function looksLikePackageName(name) {
  return /^[a-z0-9_]+(\.[a-z0-9_]+)+$/i.test((name || '').trim());
}

function extractPackageId(url) {
  const m = (url || '').match(/[?&]id=([^&]+)/);
  return m ? decodeURIComponent(m[1]) : '';
}

function decodeHtml(s) {
  return (s || '')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>');
}

async function fetchPlayMeta(packageId) {
  const url = `https://play.google.com/store/apps/details?id=${encodeURIComponent(packageId)}&hl=en&gl=us`;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 7000);
  const res = await fetch(url, {
    headers: { 'User-Agent': 'Mozilla/5.0' },
    signal: controller.signal
  });
  clearTimeout(timer);
  if (!res.ok) {
    throw new Error(`HTTP ${res.status}`);
  }
  const html = await res.text();

  let title = '';
  let developer = '';

  const og = html.match(/<meta\s+property="og:title"\s+content="([^"]+)"/i);
  if (og && og[1]) {
    title = decodeHtml(og[1]).replace(/\s*-\s*Apps on Google Play\s*$/i, '').trim();
  }

  const dev = html.match(/"developerName":"([^"]+)"/i);
  if (dev && dev[1]) {
    developer = decodeHtml(dev[1]).trim();
  }

  if (!developer) {
    const altDev = html.match(/"name":"([^"]+)","@type":"Organization"/i);
    if (altDev && altDev[1]) {
      developer = decodeHtml(altDev[1]).trim();
    }
  }

  return { title, developer };
}

async function run() {
  let touched = 0;
  let enriched = 0;
  const maxTouches = 180;

  for (const file of FILES) {
    const raw = fs.readFileSync(file, 'utf8');
    const rows = parseCsv(raw);
    if (rows.length < 2) continue;

    const header = rows[0];
    const idx = Object.fromEntries(header.map((h, i) => [h, i]));

    const cache = new Map();

    for (let r = 1; r < rows.length; r++) {
      const row = rows[r];
      const sourceKind = row[idx.source_kind] || '';
      if (sourceKind !== 'google_play') continue;

      const appName = row[idx.app_name] || '';
      const appUrl = row[idx.source_url] || '';
      if (!looksLikePackageName(appName)) continue;

      const packageId = extractPackageId(appUrl) || appName;
      if (!packageId) continue;
      if (touched >= maxTouches) continue;

      touched++;
      try {
        let meta = cache.get(packageId);
        if (!meta) {
          meta = await fetchPlayMeta(packageId);
          cache.set(packageId, meta);
        }

        if (meta.title) {
          row[idx.app_name] = meta.title;
        }
        if (meta.developer && (!row[idx.publisher] || looksLikePackageName(row[idx.publisher]))) {
          row[idx.publisher] = meta.developer;
        }
        enriched++;
      } catch (e) {
      }
    }

    fs.writeFileSync(file, toCsv(rows));
  }

  const report = [
    '# Google Play Enrichment Pass',
    '',
    `- touched_rows: ${touched}`,
    `- enriched_rows: ${enriched}`,
    `- max_touches_limit: ${maxTouches}`,
    `- date: 2026-05-21`
  ].join('\n');

  fs.writeFileSync('data_processed/google_play_enrichment_report.md', report + '\n');
  console.log(`touched_rows=${touched}`);
  console.log(`enriched_rows=${enriched}`);
}

run();
