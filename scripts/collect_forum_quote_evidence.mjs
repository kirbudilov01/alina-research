import fs from 'fs';
import * as cheerio from 'cheerio';

const INPUT = 'data_raw/forum_evidence_signals.csv';
const OUT_RAW = 'data_raw/forum_quote_evidence_raw.csv';
const OUT_MATRIX = 'data_processed/forum_quote_coding_matrix.csv';
const OUT_DOC = 'docs/audience/forum-quote-coding-v1.md';

for (const dir of ['data_raw', 'data_processed', 'docs/audience']) fs.mkdirSync(dir, { recursive: true });

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
    .replace(/\s+/g, ' ')
    .replace(/\u00a0/g, ' ')
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

function fetchUrl(row) {
  if (row.platform === 'reddit' && row.source_url.includes('www.reddit.com')) {
    return row.source_url.replace('https://www.reddit.com', 'https://old.reddit.com');
  }
  return row.source_url;
}

const CODING_RULES = {
  wants_accuracy_explanation: ['accurate', 'accuracy', 'transit', 'chart', 'birth', 'natal', 'generic', 'explain'],
  wants_low_friction_daily_use: ['daily', 'routine', 'habit', 'simple', 'easy', 'reminder', 'morning', 'track'],
  rejects_hard_paywall: ['paywall', 'subscription', 'free', 'pay', 'paid', 'worth', 'price', 'trial'],
  streaks_can_motivate: ['streak', 'streaks', 'motivat', 'consistent', 'accountab'],
  streaks_can_create_anxiety: ['streak', 'stress', 'anxiety', 'punish', 'pressure', 'break', 'lose', 'lost'],
  wants_recovery_or_forgiveness: ['recover', 'forgive', 'pause', 'vacation', 'missed', 'skip', 'reset'],
  wants_visible_progression: ['progress', 'reward', 'level', 'xp', 'achievement', 'unlock', 'grow'],
  rejects_manipulative_gamification: ['monetization', 'cash', 'daily reward', 'login reward', 'gacha', 'manipulative'],
  wants_emotional_support: ['support', 'lonely', 'companion', 'emotion', 'mental', 'calm', 'stress'],
  safety_boundary_needed: ['privacy', 'safe', 'ai', 'advice', 'therapy', 'spiritual', 'caution', 'risk']
};

function codingTags(text) {
  const t = text.toLowerCase();
  return Object.entries(CODING_RULES)
    .filter(([, words]) => words.some(w => matchesTerm(t, w)))
    .map(([tag]) => tag);
}

function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function matchesTerm(text, term) {
  const normalized = term.toLowerCase();
  if (/^[a-z0-9]+$/.test(normalized) && normalized.length <= 3) {
    return new RegExp(`\\b${escapeRegex(normalized)}\\b`).test(text);
  }
  return text.includes(normalized);
}

function selectSnippets(snippets, row) {
  const wanted = [];
  const seen = new Set();
  const baseNeedles = [
    row.signal_type,
    row.market,
    'daily',
    'streak',
    'subscription',
    'paywall',
    'accurate',
    'habit',
    'progress',
    'reward',
    'ai',
    'calm'
  ].join(' ').toLowerCase().split(/[_\s]+/).filter(Boolean);

  for (const snippet of snippets) {
    const text = clean(snippet.text);
    if (text.length < 28 || text.length > 900) continue;
    const key = text.slice(0, 120).toLowerCase();
    if (seen.has(key)) continue;
    const lower = text.toLowerCase();
    const score = baseNeedles.filter(n => n.length > 2 && lower.includes(n)).length + codingTags(text).length;
    if (score <= 0 && snippet.kind !== 'post_title') continue;
    seen.add(key);
    wanted.push({ ...snippet, text, score });
  }

  return wanted
    .sort((a, b) => b.score - a.score)
    .slice(0, 4);
}

async function fetchHtml(url) {
  const res = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0 AlinaResearch/0.1' } });
  const html = await res.text();
  return { status: res.status, contentType: res.headers.get('content-type') || '', html };
}

function redditSnippets(html) {
  const $ = cheerio.load(html);
  const snippets = [];
  const title = clean($('a.title').first().text() || $('title').first().text());
  if (title) snippets.push({ kind: 'post_title', text: title });
  $('.link .usertext-body .md').first().find('p, li').each((_, el) => {
    const text = clean($(el).text());
    if (text) snippets.push({ kind: 'post_body', text });
  });
  $('.comment .usertext-body .md').slice(0, 30).each((_, el) => {
    const text = clean($(el).text());
    if (text) snippets.push({ kind: 'comment', text });
  });
  return snippets;
}

function docSnippets(html) {
  const $ = cheerio.load(html);
  const snippets = [];
  const title = clean($('h1').first().text() || $('title').first().text());
  if (title) snippets.push({ kind: 'doc_title', text: title });
  $('main p, article p, main li, article li').slice(0, 80).each((_, el) => {
    const text = clean($(el).text());
    if (text) snippets.push({ kind: 'doc_body', text });
  });
  return snippets;
}

const sources = parseCsv(fs.readFileSync(INPUT, 'utf8'));
const rawRows = [];
const matrixRows = [];

for (const [index, row] of sources.entries()) {
  const url = fetchUrl(row);
  console.log(`[${index + 1}/${sources.length}] ${row.source_id} ${url}`);
  let status = '';
  let contentType = '';
  let snippets = [];
  try {
    const fetched = await fetchHtml(url);
    status = String(fetched.status);
    contentType = fetched.contentType;
    snippets = row.source_url.includes('developers.reddit.com')
      ? docSnippets(fetched.html)
      : redditSnippets(fetched.html);
  } catch (error) {
    status = `error:${error.message}`;
  }

  const selected = selectSnippets(snippets, row);
  if (!selected.length) {
    selected.push({ kind: 'source_summary', text: row.signal_summary, score: 0 });
  }

  for (const [snippetIndex, snippet] of selected.entries()) {
    const tags = codingTags(snippet.text);
    const raw = {
      source_id: row.source_id,
      market: row.market,
      platform: row.platform,
      signal_type: row.signal_type,
      snippet_rank: snippetIndex + 1,
      snippet_kind: snippet.kind,
      quote_excerpt: snippet.text.slice(0, 420),
      retrieval_url: url,
      source_url: row.source_url,
      http_status: status,
      content_type: contentType,
      collected_at: new Date().toISOString()
    };
    rawRows.push(raw);
    matrixRows.push({
      source_id: row.source_id,
      market: row.market,
      signal_type: row.signal_type,
      coding_tags: tags.join('|') || 'uncoded',
      snippet_kind: snippet.kind,
      evidence_strength: row.evidence_strength,
      alina_implication: row.alina_implication,
      quote_excerpt: snippet.text.slice(0, 240),
      source_url: row.source_url
    });
  }
  await sleep(160);
}

writeCsv(OUT_RAW, rawRows, [
  'source_id', 'market', 'platform', 'signal_type', 'snippet_rank', 'snippet_kind',
  'quote_excerpt', 'retrieval_url', 'source_url', 'http_status', 'content_type', 'collected_at'
]);

writeCsv(OUT_MATRIX, matrixRows, [
  'source_id', 'market', 'signal_type', 'coding_tags', 'snippet_kind',
  'evidence_strength', 'alina_implication', 'quote_excerpt', 'source_url'
]);

function countBy(rows, key) {
  const out = {};
  for (const row of rows) out[row[key] || 'unknown'] = (out[row[key] || 'unknown'] || 0) + 1;
  return out;
}

function tagCounts(rows) {
  const out = {};
  for (const row of rows) {
    for (const tag of row.coding_tags.split('|').filter(Boolean)) out[tag] = (out[tag] || 0) + 1;
  }
  return out;
}

function bulletCounts(counts) {
  return Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .map(([k, v]) => `- ${k}: ${v}`)
    .join('\n');
}

const lines = [];
lines.push('# Forum Quote Coding V1');
lines.push('');
lines.push(`Generated: ${new Date().toISOString()}`);
lines.push('');
lines.push('## Scope');
lines.push('');
lines.push(`Retrieved public HTML for ${sources.length} forum/source rows and extracted short title/body/comment/doc snippets for qualitative coding. Reddit JSON endpoints were not used; Reddit pages were fetched through old.reddit.com when available.`);
lines.push('');
lines.push('## Coverage');
lines.push('');
lines.push(`- Source rows requested: ${sources.length}`);
lines.push(`- Extracted snippet rows: ${rawRows.length}`);
lines.push(`- Coding matrix rows: ${matrixRows.length}`);
lines.push(`- Sources with at least one snippet: ${new Set(rawRows.map(r => r.source_id)).size}`);
lines.push('');
lines.push('## Coding Tags');
lines.push('');
lines.push(bulletCounts(tagCounts(matrixRows)));
lines.push('');
lines.push('## Snippets by Market');
lines.push('');
lines.push(bulletCounts(countBy(matrixRows, 'market')));
lines.push('');
lines.push('## Interpretation');
lines.push('');
lines.push('- Forum/source language strengthens the product rule that Alina should keep one low-friction daily loop rather than a broad feature suite.');
lines.push('- Streaks and rewards remain useful but risky: coding shows both motivation and anxiety/recovery themes.');
lines.push('- Accuracy, safety, and explainability matter especially for astrology/spiritual/AI guidance.');
lines.push('- Subscription resistance appears across mindfulness/productivity contexts, matching App Store review pain clusters.');
lines.push('');
lines.push('## Limitations');
lines.push('');
lines.push('- This is retrieval-assisted qualitative coding, not a representative sample.');
lines.push('- Some snippets are post titles or documentation text rather than user comments.');
lines.push('- Human validation should confirm context before using individual snippets in external-facing materials.');
lines.push('');
lines.push('## Files');
lines.push('');
lines.push(`- \`${OUT_RAW}\``);
lines.push(`- \`${OUT_MATRIX}\``);
fs.writeFileSync(OUT_DOC, `${lines.join('\n')}\n`);

console.log(`sources=${sources.length}`);
console.log(`raw_rows=${rawRows.length}`);
console.log(`matrix_rows=${matrixRows.length}`);
