import fs from 'fs';

const INPUT = 'data_raw/expanded_reddit_competitor_mentions_raw.csv';
const OUT_MATRIX = 'data_processed/reddit_mention_signal_matrix.csv';
const OUT_APP_SUMMARY = 'data_processed/reddit_mention_app_summary.csv';
const OUT_DOC = 'docs/audience/reddit-mention-signal-matrix-v1.md';

for (const dir of ['data_processed', 'docs/audience']) fs.mkdirSync(dir, { recursive: true });

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
  const header = rows.shift();
  if (!header) return [];
  return rows
    .filter(r => r.some(Boolean))
    .map(r => Object.fromEntries(header.map((h, i) => [h, r[i] ?? ''])));
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

function topCounts(rows, key, limit = 6) {
  return Object.entries(countBy(rows, key))
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .slice(0, limit)
    .map(([k, v]) => `${k}:${v}`)
    .join('|');
}

function mdTable(rows, columns, limit = rows.length) {
  const limited = rows.slice(0, limit);
  const header = `| ${columns.map(c => c.label).join(' | ')} |`;
  const sep = `| ${columns.map(c => c.align === 'right' ? '---:' : '---').join(' | ')} |`;
  const body = limited.map(row => `| ${columns.map(c => clean(row[c.key]).replace(/\|/g, '/')).join(' | ')} |`);
  return [header, sep, ...body].join('\n');
}

const SIGNAL_RULES = [
  {
    group: 'alternative_or_tool_switching_request',
    terms: ['alternative', 'trouble with my current', 'which app', 'which one', 'what app', 'recommend', 'recommendation', 'looking for a good', 'save me from downloading'],
    interpretation: 'The thread is actively comparing tools or asking for alternatives, so it can inform competitor substitution and switching friction.'
  },
  {
    group: 'pain_or_rejection_of_overbuilt_systems',
    terms: ['overwhelm', 'anxiety', 'too many', 'tons notifications', 'abandon', 'hate', 'fuck', 'lost in the app', 'maintaining', 'doesn\'t overwhelm'],
    interpretation: 'Users reject heavy systems, notification pressure, or maintenance overhead; the product loop should feel small, forgiving, and immediately useful.'
  },
  {
    group: 'habit_accountability_and_progress_need',
    terms: ['habit', 'routine', 'streak', 'accountability', 'progress', 'keep up', 'daily', 'focus', 'one thing', 'track'],
    interpretation: 'The thread points to concrete habit/progress needs; useful for testing action-tied avatar progress against plain trackers.'
  },
  {
    group: 'identity_companion_or_avatar_need',
    terms: ['avatar', 'character', 'companion', 'ai friend', 'ai girlfriend', 'roleplay', 'replika', 'character ai', 'future self', 'identity'],
    interpretation: 'Identity, companion, or avatar language appears; useful for testing whether Alina is read as growth feedback rather than generic chat or avatar generation.'
  },
  {
    group: 'reset_mindfulness_or_emotional_regulation_need',
    terms: ['meditation', 'mindfulness', 'anxiety', 'sleep', 'calm', 'stress', 'reset', 'breath', 'relax', 'adhd'],
    interpretation: 'The thread signals short emotional-regulation jobs; useful for validating a two-minute reset plus one next action.'
  },
  {
    group: 'spiritual_guidance_or_meaning_need',
    terms: ['astrology', 'tarot', 'manifest', 'spiritual', 'horoscope', 'birth chart', 'guidance', 'meaning', 'ritual'],
    interpretation: 'Spiritual or symbolic guidance language appears; useful for testing trust, safety boundaries, and whether guidance becomes grounded action.'
  },
  {
    group: 'gamified_progression_or_reward_need',
    terms: ['game', 'quest', 'level', 'reward', 'collect', 'cozy', 'daily reward', 'progression', 'customization'],
    interpretation: 'Progression or reward language appears; useful for borrowing gentle game mechanics without making growth feel manipulative.'
  },
  {
    group: 'pricing_or_subscription_sensitivity',
    terms: ['subscription', 'price', 'pricing', 'paid', 'premium', 'free', 'trial', 'paywall', 'cost'],
    interpretation: 'The thread surfaces price sensitivity; useful for paid-loop validation and free-first value sequencing.'
  }
];

const ICP_BY_NICHE = {
  astrology_esoterics: ['ICP_A'],
  avatar_identity: ['ICP_B', 'ICP_E'],
  mindfulness: ['ICP_C', 'ICP_D'],
  coaching: ['ICP_D', 'ICP_F', 'ICP_A'],
  gaming_progression: ['ICP_E', 'ICP_B']
};

const ICP_BY_GROUP = {
  alternative_or_tool_switching_request: ['ICP_D', 'ICP_F'],
  pain_or_rejection_of_overbuilt_systems: ['ICP_C', 'ICP_D'],
  habit_accountability_and_progress_need: ['ICP_D', 'ICP_F'],
  identity_companion_or_avatar_need: ['ICP_B', 'ICP_E'],
  reset_mindfulness_or_emotional_regulation_need: ['ICP_C', 'ICP_D'],
  spiritual_guidance_or_meaning_need: ['ICP_A'],
  gamified_progression_or_reward_need: ['ICP_E'],
  pricing_or_subscription_sensitivity: ['ICP_A', 'ICP_C', 'ICP_D']
};

function detectSignalGroup(row) {
  const text = `${row.mention_type} ${row.keyword} ${row.thread_title} ${row.thread_snippet} ${row.mentioned_apps} ${row.core_features}`.toLowerCase();
  if (row.mention_type === 'alternative_request') return 'alternative_or_tool_switching_request';
  if (row.mention_type === 'recommendation_request') return 'alternative_or_tool_switching_request';
  if (row.mention_type === 'pain_or_rejection') return 'pain_or_rejection_of_overbuilt_systems';

  const scored = SIGNAL_RULES
    .map(rule => ({
      group: rule.group,
      score: rule.terms.reduce((sum, term) => sum + (text.includes(term) ? 1 : 0), 0)
    }))
    .filter(item => item.score > 0)
    .sort((a, b) => b.score - a.score);
  return scored[0]?.group || 'unclassified_context_language';
}

function linkedIcps(niche, group) {
  const ids = new Set([...(ICP_BY_NICHE[niche] || []), ...(ICP_BY_GROUP[group] || [])]);
  return Array.from(ids).join('|') || 'ICP_review_needed';
}

function evidenceUse(group) {
  if (group === 'alternative_or_tool_switching_request') return 'competitor substitution set; manual walkthrough queue; switching-friction prompts';
  if (group === 'pain_or_rejection_of_overbuilt_systems') return 'whitespace proof; onboarding friction checks; prototype disconfirmation prompts';
  if (group === 'pricing_or_subscription_sensitivity') return 'paid-flow validation; free-value sequencing; WTP interview prompts';
  if (group === 'spiritual_guidance_or_meaning_need') return 'ICP_A trust/safety scripts; guidance-to-action prototype copy';
  if (group === 'identity_companion_or_avatar_need') return 'ICP_B/ICP_E avatar differentiation; companion vs progress-feedback boundary';
  if (group === 'reset_mindfulness_or_emotional_regulation_need') return 'ICP_C reset job; stress/anxiety safety boundary language';
  if (group === 'gamified_progression_or_reward_need') return 'ICP_E progression mechanics; non-manipulative reward design';
  if (group === 'habit_accountability_and_progress_need') return 'ICP_D action-tied progress tests; streak-anxiety mitigation';
  return 'qualitative language bank; source triage for manual review';
}

function signalStrength(row, group) {
  const knownApp = clean(row.app_name) && row.collection_status === 'ok';
  const titleSnippet = clean(`${row.thread_title} ${row.thread_snippet}`);
  if (knownApp && ['alternative_or_tool_switching_request', 'pain_or_rejection_of_overbuilt_systems'].includes(group)) return 'medium_high_qualitative';
  if (knownApp) return 'medium_qualitative';
  if (titleSnippet.length > 80) return 'low_medium_qualitative';
  return 'low_qualitative';
}

function boundary(row) {
  const base = 'Qualitative Reddit discovery row; not representative demand, market share, conversion, or retention proof.';
  if (row.collection_status !== 'ok') return `${base} Collector status is ${row.collection_status || 'unknown'} and should be manually checked before use.`;
  return base;
}

function interpretationFor(group) {
  return SIGNAL_RULES.find(rule => rule.group === group)?.interpretation || 'Unclassified context language should be treated as a source for manual reading and prompt design, not as a claim by itself.';
}

const rawRows = csv(INPUT);
const matrixRows = rawRows.map((row, idx) => {
  const group = detectSignalGroup(row);
  return {
    signal_id: `RMS-${String(idx + 1).padStart(5, '0')}`,
    niche: row.niche,
    subreddit: row.subreddit,
    keyword: row.keyword,
    app_name: row.app_name,
    mention_type: row.mention_type,
    signal_group: group,
    linked_icp_segments: linkedIcps(row.niche, group),
    competitor_signal_strength: signalStrength(row, group),
    evidence_quality: row.evidence_quality,
    collection_status: row.collection_status,
    thread_title: row.thread_title,
    thread_snippet: row.thread_snippet,
    source_url: row.source_url,
    interpretation: interpretationFor(group),
    evidence_use: evidenceUse(group),
    claim_boundary: boundary(row)
  };
});

const appGroups = new Map();
for (const row of matrixRows) {
  const app = clean(row.app_name) || 'unknown_or_unextracted';
  if (!appGroups.has(app)) appGroups.set(app, []);
  appGroups.get(app).push(row);
}

const appSummaryRows = Array.from(appGroups.entries()).map(([app_name, rows]) => {
  const okRows = rows.filter(row => row.collection_status === 'ok');
  const knownRows = rows.filter(row => clean(row.app_name) && row.collection_status === 'ok');
  const mediumPlus = rows.filter(row => ['medium_high_qualitative', 'medium_qualitative'].includes(row.competitor_signal_strength));
  return {
    app_name,
    mention_rows: rows.length,
    known_app_rows: knownRows.length,
    unique_subreddits: new Set(rows.map(row => row.subreddit).filter(Boolean)).size,
    niches: topCounts(rows, 'niche', 5),
    top_signal_groups: topCounts(rows, 'signal_group', 5),
    top_mention_types: topCounts(rows, 'mention_type', 5),
    top_keywords: topCounts(rows, 'keyword', 5),
    evidence_strength: mediumPlus.length >= 10 ? 'strong_qualitative_attention' : (mediumPlus.length >= 3 ? 'medium_qualitative_attention' : (okRows.length ? 'low_medium_qualitative_attention' : 'manual_check_needed')),
    next_manual_read: okRows.length ? 'Read top threads for unmet-need phrasing, alternatives named in comments, and whether app mention is positive, negative, or incidental.' : 'Verify source row before using as evidence.'
  };
}).sort((a, b) => Number(b.mention_rows) - Number(a.mention_rows) || a.app_name.localeCompare(b.app_name));

writeCsv(OUT_MATRIX, matrixRows, [
  'signal_id', 'niche', 'subreddit', 'keyword', 'app_name', 'mention_type',
  'signal_group', 'linked_icp_segments', 'competitor_signal_strength',
  'evidence_quality', 'collection_status', 'thread_title', 'thread_snippet',
  'source_url', 'interpretation', 'evidence_use', 'claim_boundary'
]);

writeCsv(OUT_APP_SUMMARY, appSummaryRows, [
  'app_name', 'mention_rows', 'known_app_rows', 'unique_subreddits', 'niches',
  'top_signal_groups', 'top_mention_types', 'top_keywords',
  'evidence_strength', 'next_manual_read'
]);

const signalSummary = Object.entries(countBy(matrixRows, 'signal_group'))
  .sort((a, b) => b[1] - a[1])
  .map(([signal_group, row_count]) => {
    const rows = matrixRows.filter(row => row.signal_group === signal_group);
    return {
      signal_group,
      row_count,
      top_niches: topCounts(rows, 'niche', 5),
      top_icp_segments: topCounts(rows.flatMap(row => row.linked_icp_segments.split('|').map(segment => ({ segment }))), 'segment', 5),
      interpretation: interpretationFor(signal_group)
    };
  });

const lines = [];
lines.push('# Reddit Mention Signal Matrix V1');
lines.push('');
lines.push(`Generated: ${new Date().toISOString()}`);
lines.push('');
lines.push('## Purpose');
lines.push('');
lines.push('This layer turns the source-native old.reddit mention collection into coded competitor, audience, ICP, and whitespace signals. It uses only already collected local Reddit rows and does not make a representative market-size claim.');
lines.push('');
lines.push('## Evidence Boundary');
lines.push('');
lines.push('- Use this as qualitative discovery evidence: language, alternatives, pain, objections, and manual-review routing.');
lines.push('- Do not use this as demand volume, market share, conversion, retention, or willingness-to-pay proof.');
lines.push('- Rows with useful snippets still need human reading before they appear in external-facing claims.');
lines.push('');
lines.push('## Summary');
lines.push('');
lines.push(`- Reddit raw rows coded: ${matrixRows.length}`);
lines.push(`- App summary rows: ${appSummaryRows.length}`);
lines.push(`- Known-app ok rows: ${matrixRows.filter(row => clean(row.app_name) && row.collection_status === 'ok').length}`);
lines.push(`- Signal groups: ${new Set(matrixRows.map(row => row.signal_group)).size}`);
lines.push(`- Subreddits covered: ${new Set(matrixRows.map(row => row.subreddit).filter(Boolean)).size}`);
lines.push('');
lines.push('## Signal Groups');
lines.push('');
lines.push(mdTable(signalSummary, [
  { key: 'signal_group', label: 'Signal Group' },
  { key: 'row_count', label: 'Rows', align: 'right' },
  { key: 'top_niches', label: 'Top Niches' },
  { key: 'top_icp_segments', label: 'Top ICP' },
  { key: 'interpretation', label: 'Interpretation' }
], 12));
lines.push('');
lines.push('## Top App Mention Summaries');
lines.push('');
lines.push(mdTable(appSummaryRows, [
  { key: 'app_name', label: 'App' },
  { key: 'mention_rows', label: 'Rows', align: 'right' },
  { key: 'unique_subreddits', label: 'Subreddits', align: 'right' },
  { key: 'top_signal_groups', label: 'Top Signals' },
  { key: 'evidence_strength', label: 'Evidence Strength' }
], 25));
lines.push('');
lines.push('## Files');
lines.push('');
lines.push(`- \`${OUT_MATRIX}\``);
lines.push(`- \`${OUT_APP_SUMMARY}\``);
lines.push(`- \`${OUT_DOC}\``);

fs.writeFileSync(OUT_DOC, `${lines.join('\n')}\n`);

console.log(`reddit_mention_signal_rows=${matrixRows.length}`);
console.log(`reddit_mention_app_summary_rows=${appSummaryRows.length}`);
console.log(`reddit_mention_signal_groups=${new Set(matrixRows.map(row => row.signal_group)).size}`);
