import fs from 'fs';

const INPUT = 'data_processed/top_intersection_review_prefill.csv';
const OUT_RAW = 'data_raw/app_store_top_candidate_reviews.csv';
const OUT_SIGNAL = 'data_processed/review_signal_matrix.csv';
const OUT_DOC = 'docs/audience/review-language-synthesis-v1.md';
const MAX_APPS = Number(process.env.REVIEW_APP_LIMIT || 100);

for (const dir of ['data_raw', 'data_processed', 'docs/audience']) {
  fs.mkdirSync(dir, { recursive: true });
}

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

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function fetchReviews(app) {
  const url = `https://itunes.apple.com/us/rss/customerreviews/id=${app.app_store_id}/sortBy=mostRecent/json`;
  try {
    const res = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' } });
    if (!res.ok) return [];
    const data = await res.json();
    const entries = data?.feed?.entry || [];
    const reviews = Array.isArray(entries) ? entries.filter(e => e?.['im:rating']) : [];
    return reviews.map((entry, i) => ({
      app_store_id: app.app_store_id,
      app_name: app.app_name,
      review_rank: app.review_rank,
      archetype: app.archetype,
      direct_threat_level: app.direct_threat_level,
      review_position: i + 1,
      review_id: entry.id?.label || '',
      updated_at: entry.updated?.label || '',
      rating: entry['im:rating']?.label || '',
      title: entry.title?.label || '',
      author: entry.author?.name?.label || '',
      content: entry.content?.label || '',
      source_url: url
    }));
  } catch (error) {
    return [];
  }
}

const SIGNAL_RULES = {
  loves_daily_loop: ['daily', 'every day', 'streak', 'routine', 'habit', 'consistent', 'consistency'],
  loves_personalization: ['personalized', 'tailored', 'specific to me', 'birth chart', 'my chart', 'natal chart', 'accurate for me', 'felt accurate', 'spot on'],
  loves_emotional_support: ['helped me', 'calm', 'anxiety', 'stress', 'peace', 'comfort', 'motivat', 'inspir'],
  loves_avatar_progress: ['avatar', 'character', 'lamb', 'level', 'xp', 'progress', 'grow', 'evolve'],
  pricing_complaint: ['expensive', 'price', 'pay', 'paid', 'subscription', 'subscribe', 'trial', 'cancel', 'charged', 'money'],
  quality_bug_complaint: ['bug', 'crash', 'glitch', 'broken', 'slow', 'doesn’t work', "doesn't work", 'error', 'loading'],
  trust_accuracy_complaint: ['wrong', 'inaccurate', 'fake', 'scam', 'generic', 'not accurate', 'misleading'],
  content_depth_request: ['more', 'wish', 'needs', 'add', 'feature', 'custom', 'options'],
  churn_signal: ['deleted', 'uninstall', 'cancel', 'stopped', 'not worth', 'waste'],
  privacy_safety_signal: ['privacy', 'data', 'safe', 'secure', 'creepy']
};

function classifyReview(review) {
  const t = `${review.title} ${review.content}`.toLowerCase();
  return Object.entries(SIGNAL_RULES)
    .filter(([, words]) => words.some(w => t.includes(w)))
    .map(([signal]) => signal);
}

const apps = parseCsv(fs.readFileSync(INPUT, 'utf8'))
  .filter(row => row.app_store_id)
  .slice(0, MAX_APPS);

const allReviews = [];
for (const [i, app] of apps.entries()) {
  console.log(`[${i + 1}/${apps.length}] ${app.app_name}`);
  allReviews.push(...await fetchReviews(app));
  await sleep(80);
}

const seen = new Set();
const deduped = [];
for (const review of allReviews) {
  const key = `${review.app_store_id}|${review.review_id}|${review.title}|${review.content.slice(0, 80)}`;
  if (seen.has(key)) continue;
  seen.add(key);
  deduped.push(review);
}

writeCsv(OUT_RAW, deduped, [
  'app_store_id', 'app_name', 'review_rank', 'archetype', 'direct_threat_level',
  'review_position', 'review_id', 'updated_at', 'rating', 'title', 'author',
  'content', 'source_url'
]);

const signalRows = [];
const counts = {
  totalReviews: deduped.length,
  appsWithReviews: new Set(deduped.map(r => r.app_store_id)).size,
  ratings: {},
  signals: {},
  archetypeSignals: {}
};

function inc(obj, key) {
  obj[key] = (obj[key] || 0) + 1;
}

for (const review of deduped) {
  inc(counts.ratings, review.rating || 'unknown');
  const signals = classifyReview(review);
  for (const signal of signals) {
    inc(counts.signals, signal);
    const archetypeKey = `${review.archetype}:${signal}`;
    inc(counts.archetypeSignals, archetypeKey);
    signalRows.push({
      app_store_id: review.app_store_id,
      app_name: review.app_name,
      archetype: review.archetype,
      direct_threat_level: review.direct_threat_level,
      rating: review.rating,
      signal,
      title: review.title,
      excerpt: review.content.slice(0, 500),
      updated_at: review.updated_at,
      source_url: review.source_url
    });
  }
}

writeCsv(OUT_SIGNAL, signalRows, [
  'app_store_id', 'app_name', 'archetype', 'direct_threat_level', 'rating',
  'signal', 'title', 'excerpt', 'updated_at', 'source_url'
]);

const topNegative = deduped
  .filter(r => Number(r.rating || 0) <= 2)
  .slice(0, 12);
const topPositive = deduped
  .filter(r => Number(r.rating || 0) >= 5)
  .slice(0, 12);

const lines = [];
lines.push('# Review Language Synthesis V1');
lines.push('');
lines.push(`Generated: ${new Date().toISOString()}`);
lines.push('');
lines.push('## Scope');
lines.push('');
lines.push(`Collected recent App Store RSS reviews for top intersection candidates from \`${INPUT}\`.`);
lines.push('');
lines.push('## Coverage');
lines.push('');
lines.push(`- Apps requested: ${apps.length}`);
lines.push(`- Apps with reviews: ${counts.appsWithReviews}`);
lines.push(`- Deduplicated reviews: ${counts.totalReviews}`);
lines.push(`- Signal rows: ${signalRows.length}`);
lines.push('');
lines.push('## Rating Mix');
lines.push('');
for (const [rating, count] of Object.entries(counts.ratings).sort((a, b) => Number(b[0]) - Number(a[0]))) {
  lines.push(`- ${rating} star: ${count}`);
}
lines.push('');
lines.push('## Signal Counts');
lines.push('');
for (const [signal, count] of Object.entries(counts.signals).sort((a, b) => b[1] - a[1])) {
  lines.push(`- ${signal}: ${count}`);
}
lines.push('');
lines.push('## Interpretation');
lines.push('');
lines.push('- Review language is now available as a first evidence layer beyond app metadata.');
lines.push('- Signals should be treated as keyword clusters, not final sentiment analysis.');
lines.push('- The next pass should manually inspect high-signal reviews for exact user wording around daily use, pricing, trust, and avatar/progress motivation.');
lines.push('');
lines.push('## Sample Negative Reviews');
lines.push('');
for (const review of topNegative) {
  lines.push(`- ${review.app_name} (${review.rating} star): ${clean(review.title)} - ${clean(review.content).slice(0, 220)}`);
}
lines.push('');
lines.push('## Sample Positive Reviews');
lines.push('');
for (const review of topPositive) {
  lines.push(`- ${review.app_name} (${review.rating} star): ${clean(review.title)} - ${clean(review.content).slice(0, 220)}`);
}
lines.push('');
lines.push('## Files');
lines.push('');
lines.push(`- \`${OUT_RAW}\``);
lines.push(`- \`${OUT_SIGNAL}\``);

fs.writeFileSync(OUT_DOC, `${lines.join('\n')}\n`);

console.log(`reviews=${deduped.length}`);
console.log(`apps_with_reviews=${counts.appsWithReviews}`);
console.log(`signal_rows=${signalRows.length}`);
console.log(`outputs=${OUT_RAW},${OUT_SIGNAL},${OUT_DOC}`);
