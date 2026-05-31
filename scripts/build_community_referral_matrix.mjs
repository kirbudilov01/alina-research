import fs from 'fs';

const REVIEW_INPUT = 'data_raw/app_store_top_candidate_reviews.csv';
const FORUM_INPUT = 'data_processed/forum_quote_coding_matrix.csv';
const OUT_ROWS = 'data_processed/community_referral_signal_rows.csv';
const OUT_SUMMARY = 'data_processed/community_referral_summary.csv';
const OUT_DOC = 'docs/audience/community-referral-evidence-v1.md';

for (const dir of ['data_processed', 'docs/audience']) fs.mkdirSync(dir, { recursive: true });

function parseCsv(text) {
  const rows = [];
  let row = [];
  let cell = '';
  let quoted = false;
  for (let i = 0; i < text.length; i += 1) {
    const c = text[i];
    const n = text[i + 1];
    if (quoted) {
      if (c === '"' && n === '"') {
        cell += '"';
        i += 1;
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
  if (!header) return [];
  return rows
    .filter(r => r.length === header.length)
    .map(r => Object.fromEntries(header.map((h, i) => [h, r[i] || ''])));
}

function csv(file) {
  return fs.existsSync(file) ? parseCsv(fs.readFileSync(file, 'utf8')) : [];
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

function mdTable(rows, columns, limit = rows.length) {
  const slice = rows.slice(0, limit);
  const header = `| ${columns.map(c => c.label).join(' | ')} |`;
  const sep = `| ${columns.map(c => c.align === 'right' ? '---:' : '---').join(' | ')} |`;
  const body = slice.map(row => `| ${columns.map(c => clean(row[c.key]).replace(/\|/g, '<br>')).join(' | ')} |`);
  return [header, sep, ...body].join('\n');
}

function includesAny(text, terms) {
  return terms.some(term => text.includes(term));
}

const SIGNAL_RULES = [
  {
    signal_kind: 'reddit_or_forum_referral',
    evidence_strength: 'medium_high',
    terms: ['reddit', 'subreddit', 'forum', 'forums'],
    interpretation: 'Users are discovering or discussing adjacent tools in community contexts; treat as channel/audience-language evidence, not ranked acquisition proof.'
  },
  {
    signal_kind: 'developer_outreach_referral',
    evidence_strength: 'medium',
    terms: ['developer reached out', 'dev reached out', 'someone reached out', 'reached out to me', 'developer was offering', 'devs'],
    interpretation: 'Indie or early-stage products appear to recruit through direct community outreach; useful for launch-channel hypotheses and founder-led validation.'
  },
  {
    signal_kind: 'word_of_mouth_or_personal_recommendation',
    evidence_strength: 'medium',
    terms: ['recommended', 'recommendation', 'friend told', 'my friend', 'family', 'referred', 'referral', 'heard about', 'saw the developer mention'],
    interpretation: 'Personal recommendations and lightweight social proof matter; Alina should make the first value moment easy to describe.'
  },
  {
    signal_kind: 'community_or_accountability_need',
    evidence_strength: 'medium',
    terms: ['community', 'accountability', 'share', 'friends', 'together', 'encourage', 'support group', 'challenge'],
    interpretation: 'There is demand for being accompanied, but community mechanics should support the solo ritual rather than replace it.'
  },
  {
    signal_kind: 'social_platform_discovery',
    evidence_strength: 'low_medium',
    terms: ['tiktok', 'tik tok', 'instagram', 'youtube', 'discord', 'facebook', 'twitter', 'x.com'],
    interpretation: 'Social platform mentions are directional channel evidence and should be validated before channel prioritization.'
  }
];

function signalMatches(text) {
  const normalized = text.toLowerCase();
  return SIGNAL_RULES.filter(rule => includesAny(normalized, rule.terms));
}

function excerptAround(text, rule) {
  const normalized = text.toLowerCase();
  const term = rule.terms.find(t => normalized.includes(t));
  if (!term) return clean(text).slice(0, 360);
  const idx = normalized.indexOf(term);
  const start = Math.max(0, idx - 140);
  const end = Math.min(text.length, idx + term.length + 220);
  return clean(text.slice(start, end));
}

const reviews = csv(REVIEW_INPUT);
const forumQuotes = csv(FORUM_INPUT);
const signalRows = [];

for (const review of reviews) {
  const fullText = `${review.title} ${review.content}`;
  for (const rule of signalMatches(fullText)) {
    signalRows.push({
      signal_row_id: `CSR-${String(signalRows.length + 1).padStart(5, '0')}`,
      source_type: 'app_store_review',
      signal_kind: rule.signal_kind,
      evidence_strength: rule.evidence_strength,
      market_or_archetype: review.archetype,
      app_or_source_name: review.app_name,
      app_store_id: review.app_store_id,
      rating: review.rating,
      updated_at: review.updated_at,
      interpretation: rule.interpretation,
      quote_excerpt: excerptAround(fullText, rule),
      source_url: review.source_url
    });
  }
}

for (const quote of forumQuotes) {
  signalRows.push({
    signal_row_id: `CSR-${String(signalRows.length + 1).padStart(5, '0')}`,
    source_type: 'forum_quote',
    signal_kind: 'coded_forum_need_or_competitor_context',
    evidence_strength: quote.evidence_strength || 'medium',
    market_or_archetype: quote.market,
    app_or_source_name: quote.source_id,
    app_store_id: '',
    rating: '',
    updated_at: '',
    interpretation: quote.alina_implication,
    quote_excerpt: quote.quote_excerpt,
    source_url: quote.source_url
  });
}

const summaryRows = Object.entries(countBy(signalRows, 'signal_kind'))
  .map(([signal_kind, row_count]) => {
    const rows = signalRows.filter(row => row.signal_kind === signal_kind);
    const reviewsOnly = rows.filter(row => row.source_type === 'app_store_review');
    const forumsOnly = rows.filter(row => row.source_type === 'forum_quote');
    const markets = countBy(rows, 'market_or_archetype');
    const apps = countBy(rows, 'app_or_source_name');
    const strengths = countBy(rows, 'evidence_strength');
    const topRule = SIGNAL_RULES.find(rule => rule.signal_kind === signal_kind);
    return {
      signal_kind,
      row_count,
      review_rows: reviewsOnly.length,
      forum_rows: forumsOnly.length,
      unique_apps_or_sources: new Set(rows.map(row => row.app_or_source_name).filter(Boolean)).size,
      top_markets_or_archetypes: Object.entries(markets).sort((a, b) => b[1] - a[1]).slice(0, 5).map(([k, v]) => `${k}:${v}`).join('|'),
      top_apps_or_sources: Object.entries(apps).sort((a, b) => b[1] - a[1]).slice(0, 6).map(([k, v]) => `${k}:${v}`).join('|'),
      evidence_strength_mix: Object.entries(strengths).sort((a, b) => b[1] - a[1]).map(([k, v]) => `${k}:${v}`).join('|'),
      implication: topRule?.interpretation || 'Forum-coded qualitative signals should inform ICP language, validation scripts, and competitor context.'
    };
  })
  .sort((a, b) => Number(b.row_count) - Number(a.row_count));

writeCsv(OUT_ROWS, signalRows, [
  'signal_row_id', 'source_type', 'signal_kind', 'evidence_strength',
  'market_or_archetype', 'app_or_source_name', 'app_store_id', 'rating',
  'updated_at', 'interpretation', 'quote_excerpt', 'source_url'
]);

writeCsv(OUT_SUMMARY, summaryRows, [
  'signal_kind', 'row_count', 'review_rows', 'forum_rows',
  'unique_apps_or_sources', 'top_markets_or_archetypes',
  'top_apps_or_sources', 'evidence_strength_mix', 'implication'
]);

const lines = [];
lines.push('# Community Referral Evidence V1');
lines.push('');
lines.push(`Generated: ${new Date().toISOString()}`);
lines.push('');
lines.push('## Purpose');
lines.push('');
lines.push('This matrix mines the already collected App Store review corpus and coded forum quotes for community, Reddit, referral, developer-outreach, and accountability signals. It avoids new broad search and treats these rows as audience/channel evidence, not market-share proof.');
lines.push('');
lines.push('## Summary');
lines.push('');
lines.push(`- Review corpus rows scanned: ${reviews.length}`);
lines.push(`- Forum quote rows included: ${forumQuotes.length}`);
lines.push(`- Community/referral signal rows: ${signalRows.length}`);
lines.push(`- Signal kinds: ${summaryRows.length}`);
lines.push('');
lines.push(mdTable(summaryRows, [
  { key: 'signal_kind', label: 'Signal' },
  { key: 'row_count', label: 'Rows', align: 'right' },
  { key: 'review_rows', label: 'Review Rows', align: 'right' },
  { key: 'forum_rows', label: 'Forum Rows', align: 'right' },
  { key: 'unique_apps_or_sources', label: 'Apps/Sources', align: 'right' },
  { key: 'implication', label: 'Implication' }
]));
lines.push('');
lines.push('## Highest-Signal Review Excerpts');
lines.push('');
lines.push(mdTable(
  signalRows
    .filter(row => row.source_type === 'app_store_review')
    .sort((a, b) => {
      const rank = { reddit_or_forum_referral: 5, developer_outreach_referral: 4, word_of_mouth_or_personal_recommendation: 3 };
      return (rank[b.signal_kind] || 0) - (rank[a.signal_kind] || 0);
    }),
  [
    { key: 'signal_kind', label: 'Signal' },
    { key: 'app_or_source_name', label: 'App' },
    { key: 'market_or_archetype', label: 'Archetype' },
    { key: 'quote_excerpt', label: 'Excerpt' }
  ],
  12
));
lines.push('');
lines.push('## Operating Rule');
lines.push('');
lines.push('- Use these rows to enrich ICP interview recruiting, launch-channel hypotheses, and product-language tests.');
lines.push('- Do not treat Reddit or community mentions in reviews as channel attribution without manual confirmation.');
lines.push('- Pair these signals with `data_processed/icp_validation_test_plan.csv` and prototype sessions before upgrading audience claims.');
lines.push('');
lines.push('## Files');
lines.push('');
lines.push(`- \`${OUT_ROWS}\``);
lines.push(`- \`${OUT_SUMMARY}\``);

fs.writeFileSync(OUT_DOC, `${lines.join('\n')}\n`);

console.log(`rows=${OUT_ROWS}`);
console.log(`summary=${OUT_SUMMARY}`);
console.log(`doc=${OUT_DOC}`);
console.log(`signal_rows=${signalRows.length}`);
console.log(`summary_rows=${summaryRows.length}`);
