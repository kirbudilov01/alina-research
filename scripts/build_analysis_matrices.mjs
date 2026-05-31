import fs from 'fs';

const INPUT = 'data_raw/expanded/all_expanded_dedup.csv';
const OUT_FEATURE = 'data_processed/competitor_feature_matrix.csv';
const OUT_AUDIENCE = 'data_processed/audience_signal_matrix.csv';
const OUT_WHITESPACE = 'data_processed/whitespace_signal_matrix.csv';
const OUT_SUMMARY = 'data_processed/analysis_matrix_summary.md';

const FEATURE_RULES = {
  ai: [' ai ', 'artificial intelligence', 'chatgpt', 'gpt', 'llm', 'assistant', 'smart coach'],
  astrology: ['astrology', 'horoscope', 'zodiac', 'birth chart', 'natal', 'vedic', 'moon phase'],
  tarot_or_oracle: ['tarot', 'oracle card', 'fortune', 'psychic', 'palm reading'],
  manifestation_spirituality: ['manifestation', 'spiritual', 'chakra', 'energy', 'affirmation', 'law of attraction'],
  avatar_identity: ['avatar', 'character creator', 'profile picture', 'digital identity', 'vtuber', 'virtual persona', 'self portrait'],
  photo_video_generation: ['photo', 'video', 'image generator', 'face', 'animation', 'anime', 'portrait'],
  coaching: ['coach', 'coaching', 'goal', 'accountability', 'self improvement', 'personal development', 'mindset'],
  habits_streaks: ['habit', 'streak', 'daily', 'routine', 'tracker', 'progress', 'challenge'],
  mindfulness: ['meditation', 'mindfulness', 'breath', 'breathing', 'calm', 'stress', 'anxiety', 'relax', 'sleep'],
  journaling_mood: ['journal', 'journaling', 'mood', 'gratitude', 'reflection', 'diary'],
  gaming_progression: ['quest', 'level', 'xp', 'reward', 'season', 'battle pass', 'rank', 'leaderboard', 'achievement'],
  social_community: ['friends', 'community', 'clan', 'multiplayer', 'share', 'chat', 'social', 'group']
};

const AUDIENCE_RULES = {
  gen_z_creator_identity: ['avatar', 'anime', 'profile picture', 'vtuber', 'creator', 'influencer', 'persona'],
  spiritual_seekers: ['astrology', 'horoscope', 'tarot', 'zodiac', 'manifestation', 'spiritual', 'chakra'],
  anxious_stressed_users: ['anxiety', 'stress', 'calm', 'sleep', 'relax', 'mental wellness', 'breath'],
  self_improvement_users: ['self improvement', 'goal', 'habit', 'mindset', 'productivity', 'confidence', 'personal development'],
  casual_gamers: ['casual', 'puzzle', 'idle', 'cozy', 'quest', 'reward', 'level'],
  coaching_professionals: ['executive', 'career', 'business coaching', 'coach crm', 'client', 'mentor']
};

const MONETIZATION_RULES = {
  subscription_likely: ['subscription', 'premium', 'pro', 'monthly', 'annual', 'subscribe'],
  iap_likely: ['in-app purchase', 'coins', 'gems', 'credits', 'packs', 'unlock', 'items'],
  freemium_likely: ['free', 'premium', 'upgrade', 'trial']
};

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

function textFor(row) {
  return [
    row.app_name,
    row.publisher,
    row.platform,
    row.source_kind,
    row.niche,
    row.keyword,
    row.category,
    row.pricing_type,
    row.core_features,
    row.retention_mechanics,
    row.personalization_tags,
    row.audience_tags,
    row.monetization_notes
  ].join(' ').toLowerCase();
}

function matchRules(text, rules) {
  return Object.entries(rules)
    .filter(([, needles]) => needles.some(n => text.includes(n)))
    .map(([name]) => name);
}

function csvEscape(value) {
  return `"${clean(value).replace(/"/g, '""')}"`;
}

function writeCsv(file, rows, headers) {
  fs.writeFileSync(file, [headers.join(','), ...rows.map(row => headers.map(h => csvEscape(row[h])).join(','))].join('\n'));
}

function scoreWhitespace(tags) {
  const s = new Set(tags);
  const pillars = [
    s.has('astrology') || s.has('tarot_or_oracle') || s.has('manifestation_spirituality'),
    s.has('avatar_identity') || s.has('photo_video_generation'),
    s.has('coaching'),
    s.has('mindfulness') || s.has('journaling_mood'),
    s.has('gaming_progression') || s.has('habits_streaks')
  ].filter(Boolean).length;

  let score = pillars;
  if (s.has('ai')) score += 1;
  if (s.has('habits_streaks')) score += 1;
  if (s.has('avatar_identity') && s.has('coaching')) score += 1;
  if ((s.has('astrology') || s.has('tarot_or_oracle')) && s.has('coaching')) score += 1;
  if ((s.has('mindfulness') || s.has('journaling_mood')) && s.has('gaming_progression')) score += 1;
  return { pillars, score };
}

function increment(map, key, by = 1) {
  map[key] = (map[key] || 0) + by;
}

const rows = parseCsv(fs.readFileSync(INPUT, 'utf8'));

const featureRows = [];
const audienceRows = [];
const whitespaceRows = [];
const summary = {
  total: rows.length,
  byNiche: {},
  byFeature: {},
  byAudience: {},
  byWhitespaceBand: {},
  topIntersectionCandidates: []
};

for (const [i, row] of rows.entries()) {
  const text = textFor(row);
  const featureTags = matchRules(` ${text} `, FEATURE_RULES);
  const audienceTags = matchRules(` ${text} `, AUDIENCE_RULES);
  const monetizationTags = matchRules(` ${text} `, MONETIZATION_RULES);
  const { pillars, score } = scoreWhitespace(featureTags);
  const band = score >= 7 ? 'high' : score >= 4 ? 'medium' : 'low';
  increment(summary.byNiche, row.niche || 'unknown');
  for (const tag of featureTags) increment(summary.byFeature, tag);
  for (const tag of audienceTags) increment(summary.byAudience, tag);
  increment(summary.byWhitespaceBand, band);

  const recordId = `CMP-${String(i + 1).padStart(6, '0')}`;
  featureRows.push({
    record_id: recordId,
    app_name: row.app_name,
    publisher: row.publisher,
    platform: row.platform,
    source_kind: row.source_kind,
    niche: row.niche,
    keyword: row.keyword,
    rating: row.rating,
    review_count: row.review_count,
    pricing_type: row.pricing_type,
    source_url: row.source_url,
    feature_tags: featureTags.join('|'),
    monetization_tags: monetizationTags.join('|'),
    pillar_count: pillars,
    whitespace_score: score,
    evidence_quality: row.evidence_quality
  });

  for (const tag of audienceTags) {
    audienceRows.push({
      record_id: recordId,
      app_name: row.app_name,
      niche: row.niche,
      platform: row.platform,
      audience_tag: tag,
      signal_text: clean(row.core_features).slice(0, 500),
      source_url: row.source_url,
      evidence_quality: row.evidence_quality
    });
  }

  whitespaceRows.push({
    record_id: recordId,
    app_name: row.app_name,
    niche: row.niche,
    platform: row.platform,
    source_kind: row.source_kind,
    keyword: row.keyword,
    feature_tags: featureTags.join('|'),
    audience_tags: audienceTags.join('|'),
    pillar_count: pillars,
    whitespace_score: score,
    whitespace_band: band,
    source_url: row.source_url,
    evidence_quality: row.evidence_quality
  });
}

const topCandidates = [...whitespaceRows]
  .filter(r => Number(r.whitespace_score) >= 5)
  .sort((a, b) => Number(b.whitespace_score) - Number(a.whitespace_score) || Number(b.pillar_count) - Number(a.pillar_count))
  .slice(0, 100);
summary.topIntersectionCandidates = topCandidates.slice(0, 20);

writeCsv(OUT_FEATURE, featureRows, [
  'record_id', 'app_name', 'publisher', 'platform', 'source_kind', 'niche', 'keyword',
  'rating', 'review_count', 'pricing_type', 'source_url', 'feature_tags', 'monetization_tags',
  'pillar_count', 'whitespace_score', 'evidence_quality'
]);

writeCsv(OUT_AUDIENCE, audienceRows, [
  'record_id', 'app_name', 'niche', 'platform', 'audience_tag', 'signal_text', 'source_url', 'evidence_quality'
]);

writeCsv(OUT_WHITESPACE, whitespaceRows, [
  'record_id', 'app_name', 'niche', 'platform', 'source_kind', 'keyword', 'feature_tags',
  'audience_tags', 'pillar_count', 'whitespace_score', 'whitespace_band', 'source_url', 'evidence_quality'
]);

const lines = [];
lines.push('# Analysis Matrix Summary');
lines.push('');
lines.push(`Generated: ${new Date().toISOString()}`);
lines.push('');
lines.push(`Input: \`${INPUT}\``);
lines.push(`Rows analyzed: ${summary.total}`);
lines.push('');
lines.push('## Rows by Niche');
lines.push('');
for (const [key, value] of Object.entries(summary.byNiche).sort((a, b) => b[1] - a[1])) {
  lines.push(`- ${key}: ${value}`);
}
lines.push('');
lines.push('## Feature Tag Counts');
lines.push('');
for (const [key, value] of Object.entries(summary.byFeature).sort((a, b) => b[1] - a[1])) {
  lines.push(`- ${key}: ${value}`);
}
lines.push('');
lines.push('## Audience Signal Counts');
lines.push('');
for (const [key, value] of Object.entries(summary.byAudience).sort((a, b) => b[1] - a[1])) {
  lines.push(`- ${key}: ${value}`);
}
lines.push('');
lines.push('## Whitespace Bands');
lines.push('');
for (const [key, value] of Object.entries(summary.byWhitespaceBand).sort((a, b) => b[1] - a[1])) {
  lines.push(`- ${key}: ${value}`);
}
lines.push('');
lines.push('## Top Intersection Candidates');
lines.push('');
lines.push('| App | Niche | Platform | Score | Pillars | Tags |');
lines.push('|---|---|---:|---:|---:|---|');
for (const row of summary.topIntersectionCandidates) {
  lines.push(`| ${clean(row.app_name).replace(/\|/g, '/')} | ${row.niche} | ${row.platform} | ${row.whitespace_score} | ${row.pillar_count} | ${row.feature_tags.replace(/\|/g, ', ')} |`);
}
lines.push('');
lines.push('## Caveats');
lines.push('');
lines.push('- Tags are rules-based and should be treated as first-pass signals, not final classification.');
lines.push('- App Store descriptions dominate the current feature text, so source weighting is needed later.');
lines.push('- High whitespace score does not prove opportunity by itself; it identifies products to inspect manually.');

fs.writeFileSync(OUT_SUMMARY, `${lines.join('\n')}\n`);

console.log(`feature_rows=${featureRows.length}`);
console.log(`audience_rows=${audienceRows.length}`);
console.log(`whitespace_rows=${whitespaceRows.length}`);
console.log(`outputs=${[OUT_FEATURE, OUT_AUDIENCE, OUT_WHITESPACE, OUT_SUMMARY].join(',')}`);
