import fs from 'fs';
import fetch from 'node-fetch';
import * as cheerio from 'cheerio';

const OUT_RAW = 'data_raw/expanded_reddit_competitor_mentions_raw.csv';
const OUT_SUMMARY = 'data_processed/reddit_competitor_mentions_summary.csv';
const OUT_DOC = 'docs/audience/reddit-competitor-mentions-v1.md';

const QUERY_LIMIT = Number(process.env.REDDIT_MENTION_QUERY_LIMIT || 999);
const MAX_RESULTS_PER_QUERY = Number(process.env.REDDIT_MENTION_MAX_RESULTS || 25);
const TIMEOUT_MS = Number(process.env.REDDIT_MENTION_TIMEOUT_MS || 12000);

for (const dir of ['data_raw', 'data_processed', 'docs/audience']) fs.mkdirSync(dir, { recursive: true });

const SUBREDDIT_QUERIES = {
  coaching: {
    subreddits: ['productivity', 'selfimprovement', 'getdisciplined', 'NonZeroDay', 'ADHD'],
    keywords: ['habit tracker app', 'goal tracker app', 'accountability app', 'self improvement app', 'life coach app', 'routine app']
  },
  mindfulness: {
    subreddits: ['meditation', 'Mindfulness', 'Anxiety', 'journaling', 'sleep'],
    keywords: ['meditation app', 'mindfulness app', 'breathing app', 'mood tracker app', 'gratitude journal app', 'sleep meditation app']
  },
  avatar_identity: {
    subreddits: ['CharacterAI', 'Replika', 'aiArt', 'StableDiffusion', 'VirtualYoutubers'],
    keywords: ['AI companion app', 'avatar app', 'character creator app', 'AI avatar app', 'virtual persona app', 'profile picture app']
  },
  astrology_esoterics: {
    subreddits: ['astrology', 'tarot', 'witchcraft', 'lawofattraction', 'manifestation'],
    keywords: ['astrology app', 'tarot app', 'manifestation app', 'birth chart app', 'horoscope app', 'spiritual guidance app']
  },
  gaming_progression: {
    subreddits: ['gamification', 'Habitica', 'cozygamers', 'incremental_games', 'StopGaming'],
    keywords: ['gamified habit app', 'Habitica alternative', 'life RPG app', 'quest tracker app', 'level up app', 'progression app']
  }
};

function now() {
  return new Date().toISOString();
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

function normalizeName(value) {
  return clean(value)
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, ' ')
    .replace(/\b(app|apps|game|games|tracker|journal|meditation)\b/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function titleCase(value) {
  return clean(value).replace(/\b[a-z]/g, c => c.toUpperCase());
}

function knownAppLexicon() {
  const sources = [
    ...csv('data_processed/top100_competitor_review_scorecard.csv').map(row => row.app_name),
    ...csv('data_processed/competitor_revenue_proxy_review.csv').map(row => row.app_name),
    ...csv('data_processed/icp_recruiting_bridge.csv').map(row => row.top_signal_sources).flatMap(value => clean(value).split('|').map(part => part.split(':')[0]))
  ];
  const manual = [
    'Habitica', 'Streaks', 'Todoist', 'Notion', 'Finch', 'Forest', 'Fabulous',
    'Calm', 'Headspace', 'Insight Timer', 'Waking Up', 'Medito', 'Balance',
    'Replika', 'Character AI', 'Janitor AI', 'Chai', 'Zepeto', 'Bitmoji',
    'Co-Star', 'The Pattern', 'TimePassages', 'AstroMatrix', 'Nebula',
    'Day One', 'Journey', 'Stoic', 'Rosebud', 'Moodnotes'
  ];
  const names = Array.from(new Set([...sources, ...manual].map(clean).filter(name => name.length >= 3)));
  return names
    .map(name => ({ name, normalized: normalizeName(name) }))
    .filter(item => item.normalized.length >= 3)
    .sort((a, b) => b.normalized.length - a.normalized.length);
}

const APP_LEXICON = knownAppLexicon();

function extractKnownMentions(text) {
  const haystack = ` ${normalizeName(text)} `;
  const out = [];
  for (const item of APP_LEXICON) {
    if (haystack.includes(` ${item.normalized} `)) out.push(item.name);
    if (out.length >= 6) break;
  }
  return Array.from(new Set(out));
}

function inferNeedLabel(title, snippet, keyword) {
  const text = `${title} ${snippet} ${keyword}`.toLowerCase();
  if (/alternative|instead|replace|similar/.test(text)) return 'alternative_request';
  if (/recommend|which|best|use currently|suggest/.test(text)) return 'recommendation_request';
  if (/depressing|hate|frustrat|problem|anxiety|adhd|struggle/.test(text)) return 'pain_or_rejection';
  if (/accountab|habit|streak|routine|goal/.test(text)) return 'habit_accountability_need';
  if (/avatar|companion|character|persona/.test(text)) return 'identity_companion_need';
  if (/meditat|mindful|breath|sleep|calm/.test(text)) return 'reset_mindfulness_need';
  return 'general_tool_discussion';
}

async function fetchWithTimeout(url) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    return await fetch(url, {
      signal: controller.signal,
      headers: {
        'user-agent': 'Mozilla/5.0 (compatible; AlinaResearch/1.0; source-native public HTML audit)',
        'accept-language': 'en-US,en;q=0.9'
      }
    });
  } finally {
    clearTimeout(timer);
  }
}

function row(base) {
  return {
    app_name: '',
    publisher: 'reddit_user_thread',
    platform: 'community_forum',
    source_kind: 'reddit_old_search_mention',
    source_bucket: 'Reddit',
    source_url: '',
    niche: '',
    keyword: '',
    query: '',
    subreddit: '',
    rank_position: '',
    category: 'forum_competitor_mention',
    rating: '',
    review_count: '',
    pricing_type: '',
    iap_present: '',
    subscription_present: '',
    core_features: '',
    retention_mechanics: '',
    personalization_tags: '',
    audience_tags: '',
    monetization_notes: '',
    thread_title: '',
    thread_snippet: '',
    mentioned_apps: '',
    mention_type: '',
    collected_at: now(),
    evidence_quality: 'medium_low',
    collection_status: 'ok',
    ...base
  };
}

function headers() {
  return [
    'app_name', 'publisher', 'platform', 'source_kind', 'source_bucket', 'source_url',
    'niche', 'keyword', 'query', 'subreddit', 'rank_position', 'category', 'rating',
    'review_count', 'pricing_type', 'iap_present', 'subscription_present',
    'core_features', 'retention_mechanics', 'personalization_tags', 'audience_tags',
    'monetization_notes', 'thread_title', 'thread_snippet', 'mentioned_apps',
    'mention_type', 'collected_at', 'evidence_quality', 'collection_status'
  ];
}

async function collectQuery(niche, subreddit, keyword, queryIndex) {
  const url = `https://old.reddit.com/r/${encodeURIComponent(subreddit)}/search?q=${encodeURIComponent(keyword)}&restrict_sr=on&sort=relevance&t=all`;
  try {
    const res = await fetchWithTimeout(url);
    const html = await res.text();
    const $ = cheerio.load(html);
    const results = [];
    $('.search-result').slice(0, MAX_RESULTS_PER_QUERY).each((i, el) => {
      const titleEl = $(el).find('a.search-title').first();
      const title = clean(titleEl.text());
      const href = titleEl.attr('href') || '';
      const snippet = clean($(el).find('.search-result-body').text() || $(el).find('.md').text() || $(el).text()).slice(0, 900);
      if (!title || !href) return;
      const mentions = extractKnownMentions(`${title} ${snippet}`);
      const mentionType = inferNeedLabel(title, snippet, keyword);
      if (!mentions.length) {
        results.push(row({
          app_name: `Reddit thread: ${titleCase(title).slice(0, 90)}`,
          source_url: href,
          niche,
          keyword,
          query: `old.reddit r/${subreddit} ${keyword}`,
          subreddit,
          rank_position: i + 1,
          core_features: snippet || title,
          audience_tags: mentionType,
          thread_title: title,
          thread_snippet: snippet,
          mentioned_apps: '',
          mention_type: mentionType,
          evidence_quality: 'low_medium',
          collection_status: res.ok ? 'ok_thread_without_known_app_extract' : `http_${res.status}`
        }));
        return;
      }
      for (const mention of mentions) {
        results.push(row({
          app_name: mention,
          source_url: href,
          niche,
          keyword,
          query: `old.reddit r/${subreddit} ${keyword}`,
          subreddit,
          rank_position: i + 1,
          core_features: snippet || title,
          audience_tags: mentionType,
          thread_title: title,
          thread_snippet: snippet,
          mentioned_apps: mentions.join('|'),
          mention_type: mentionType,
          evidence_quality: 'medium_low',
          collection_status: res.ok ? 'ok' : `http_${res.status}`
        }));
      }
    });
    if (!results.length) {
      results.push(row({
        app_name: `Reddit r/${subreddit}: no extracted results`,
        source_url: url,
        niche,
        keyword,
        query: `old.reddit r/${subreddit} ${keyword}`,
        subreddit,
        rank_position: queryIndex + 1,
        category: 'collection_note',
        core_features: 'No old.reddit search results extracted from public HTML.',
        evidence_quality: 'low',
        collection_status: res.ok ? 'empty_result' : `http_${res.status}`
      }));
    }
    return results;
  } catch (error) {
    return [row({
      app_name: `Reddit r/${subreddit}: collection error`,
      source_url: url,
      niche,
      keyword,
      query: `old.reddit r/${subreddit} ${keyword}`,
      subreddit,
      rank_position: queryIndex + 1,
      category: 'collection_error',
      core_features: clean(error.message),
      evidence_quality: 'low',
      collection_status: `error:${clean(error.message)}`
    })];
  }
}

const queryPairs = Object.entries(SUBREDDIT_QUERIES)
  .flatMap(([niche, cfg]) => cfg.subreddits.flatMap(subreddit => cfg.keywords.map(keyword => ({ niche, subreddit, keyword }))))
  .slice(0, QUERY_LIMIT);

const collected = [];
for (const [index, pair] of queryPairs.entries()) {
  console.log(`[Reddit mentions] ${index + 1}/${queryPairs.length} r/${pair.subreddit} / ${pair.keyword}`);
  collected.push(...await collectQuery(pair.niche, pair.subreddit, pair.keyword, index));
  await new Promise(resolve => setTimeout(resolve, 300));
}

const seen = new Set();
const deduped = [];
for (const item of collected) {
  const key = `${item.source_url}|${item.app_name}|${item.niche}|${item.keyword}`;
  if (seen.has(key)) continue;
  seen.add(key);
  deduped.push(item);
}

const summary = [
  ...Object.entries(countBy(deduped, 'niche')).map(([bucket, count]) => ({ summary_type: 'niche', bucket, count })),
  ...Object.entries(countBy(deduped, 'subreddit')).map(([bucket, count]) => ({ summary_type: 'subreddit', bucket, count })),
  ...Object.entries(countBy(deduped, 'mention_type')).map(([bucket, count]) => ({ summary_type: 'mention_type', bucket, count })),
  ...Object.entries(countBy(deduped, 'collection_status')).map(([bucket, count]) => ({ summary_type: 'collection_status', bucket, count }))
];

writeCsv(OUT_RAW, deduped, headers());
writeCsv(OUT_SUMMARY, summary, ['summary_type', 'bucket', 'count']);

const okRows = deduped.filter(row => row.collection_status === 'ok');
const lines = [];
lines.push('# Reddit Competitor Mentions V1');
lines.push('');
lines.push(`Generated: ${new Date().toISOString()}`);
lines.push('');
lines.push('## Purpose');
lines.push('');
lines.push('This source-native collector expands forum evidence through old.reddit public search pages. It captures user-named tools and unmet-needs threads across the five research markets. Mentions are qualitative discovery evidence, not ranking, market share, or demand proof.');
lines.push('');
lines.push('## Summary');
lines.push('');
lines.push(`- Query pairs attempted: ${queryPairs.length}`);
lines.push(`- Raw rows after dedupe: ${deduped.length}`);
lines.push(`- Known-app mention rows: ${okRows.length}`);
lines.push(`- Max results per query: ${MAX_RESULTS_PER_QUERY}`);
lines.push('');
lines.push('Rows by market:');
lines.push('');
lines.push(bulletCounts(countBy(deduped, 'niche')));
lines.push('');
lines.push('Rows by mention type:');
lines.push('');
lines.push(bulletCounts(countBy(deduped, 'mention_type')));
lines.push('');
lines.push('Collection statuses:');
lines.push('');
lines.push(bulletCounts(countBy(deduped, 'collection_status')));
lines.push('');
lines.push('## Claim Boundary');
lines.push('');
lines.push('- Reddit rows are forum-language and competitor-discovery evidence.');
lines.push('- They should not be used as market share, revenue, or broad audience-size claims.');
lines.push('- Thread rows without a known-app extraction are retained because they preserve unmet-need language for ICP and product positioning.');
lines.push('');
lines.push('## Files');
lines.push('');
lines.push(`- \`${OUT_RAW}\``);
lines.push(`- \`${OUT_SUMMARY}\``);
fs.writeFileSync(OUT_DOC, `${lines.join('\n')}\n`);

console.log(`raw=${OUT_RAW}`);
console.log(`summary=${OUT_SUMMARY}`);
console.log(`doc=${OUT_DOC}`);
console.log(`queries=${queryPairs.length}`);
console.log(`rows=${deduped.length}`);
console.log(`ok=${okRows.length}`);
