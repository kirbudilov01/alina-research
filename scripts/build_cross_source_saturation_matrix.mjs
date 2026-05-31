import fs from 'fs';

const OUT = 'data_processed/cross_source_market_saturation_matrix.csv';
const OUT_DOC = 'docs/intersections/cross-source-saturation-whitespace-v1.md';

for (const dir of ['data_processed', 'docs/intersections']) fs.mkdirSync(dir, { recursive: true });

const FEATURE_RULES = {
  ai: [' ai ', 'artificial intelligence', 'chatgpt', 'gpt', 'llm', 'assistant', 'smart coach'],
  astrology: ['astrology', 'horoscope', 'zodiac', 'birth chart', 'natal', 'vedic', 'moon phase'],
  tarot_or_oracle: ['tarot', 'oracle card', 'fortune', 'psychic', 'palm reading'],
  manifestation_spirituality: ['manifestation', 'spiritual', 'chakra', 'energy', 'affirmation', 'law of attraction'],
  avatar_identity: ['avatar', 'character creator', 'profile picture', 'digital identity', 'vtuber', 'virtual persona', 'self portrait', 'character customization'],
  photo_video_generation: ['photo', 'video', 'image generator', 'face', 'animation', 'anime', 'portrait'],
  coaching: ['coach', 'coaching', 'goal', 'accountability', 'self improvement', 'personal development', 'mindset'],
  habits_streaks: ['habit', 'streak', 'daily', 'routine', 'tracker', 'progress', 'challenge'],
  mindfulness: ['meditation', 'mindfulness', 'breath', 'breathing', 'calm', 'stress', 'anxiety', 'relax', 'sleep'],
  journaling_mood: ['journal', 'journaling', 'mood', 'gratitude', 'reflection', 'diary'],
  gaming_progression: ['quest', 'level', 'xp', 'reward', 'season', 'battle pass', 'rank', 'leaderboard', 'achievement'],
  social_community: ['friends', 'community', 'clan', 'multiplayer', 'share', 'chat', 'social', 'group']
};

const DIRECTNESS_WEIGHTS = {
  mobile_app_store: 1.0,
  google_play_or_android: 0.85,
  desktop_store: 0.65,
  browser_extension: 0.45,
  steam_pc: 0.35,
  itch_web_game: 0.25,
  duckduckgo_search: 0.15,
  unknown_source: 0.1
};

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
  return body
    .filter(r => r.some(Boolean))
    .map(r => Object.fromEntries(headers.map((h, i) => [h, r[i] ?? ''])));
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
  const sep = `| ${columns.map(c => c.align === 'right' ? '---:' : '---').join(' | ') } |`;
  const body = slice.map(row => `| ${columns.map(c => clean(row[c.key]).replace(/\|/g, '<br>')).join(' | ')} |`);
  return [header, sep, ...body].join('\n');
}

function countBy(rows, key) {
  const out = {};
  for (const row of rows) out[row[key] || 'unknown'] = (out[row[key] || 'unknown'] || 0) + 1;
  return out;
}

function textFor(row) {
  return [
    row.app_name,
    row.publisher,
    row.platform,
    row.source_group,
    row.source_kind,
    row.niche,
    row.keyword,
    row.category,
    row.pricing_type,
    row.feature_tags,
    row.core_features,
    row.retention_mechanics,
    row.monetization_notes
  ].join(' ').toLowerCase();
}

function matchRules(text, rules) {
  return Object.entries(rules)
    .filter(([, needles]) => needles.some(n => text.includes(n)))
    .map(([name]) => name);
}

function pillars(tags) {
  const s = new Set(tags);
  return [
    s.has('astrology') || s.has('tarot_or_oracle') || s.has('manifestation_spirituality'),
    s.has('avatar_identity') || s.has('photo_video_generation'),
    s.has('coaching'),
    s.has('mindfulness') || s.has('journaling_mood'),
    s.has('gaming_progression') || s.has('habits_streaks')
  ].filter(Boolean).length;
}

function whitespaceLike(tags) {
  const s = new Set(tags);
  let score = pillars(tags);
  if (s.has('ai')) score += 1;
  if (s.has('habits_streaks')) score += 1;
  if (s.has('avatar_identity') && s.has('coaching')) score += 1;
  if ((s.has('astrology') || s.has('tarot_or_oracle') || s.has('manifestation_spirituality')) && s.has('coaching')) score += 1;
  if ((s.has('mindfulness') || s.has('journaling_mood')) && s.has('gaming_progression')) score += 1;
  return score;
}

function opportunityBand(row) {
  if (row.niche === 'gaming' || row.niche === 'gaming_progression') return 'mechanic_benchmark_not_primary_market';
  const scarcity = Number(row.full_loop_scarcity_score || 0);
  const direct = Number(row.directness_weighted_rows || 0);
  const support = Number(row.strong_medium_coverage_cells || 0);
  if (scarcity >= 80 && direct >= 500 && support >= 2) return 'high_opportunity_validate_now';
  if (scarcity >= 55 && direct >= 250) return 'medium_opportunity_needs_sampling';
  if (direct >= 100) return 'crowded_or_unclear_context';
  return 'thin_context_only';
}

function round(value, digits = 1) {
  return Number(value || 0).toFixed(digits);
}

const dedup = csv('data_processed/cross_source_universe_dedup.csv');
const coverage = csv('data_processed/cross_source_coverage_matrix.csv');
const markets = Array.from(new Set(dedup.flatMap(row => clean(row.niche).split('|')).filter(Boolean))).sort();
const rows = [];

for (const niche of markets) {
  const items = dedup.filter(row => clean(row.niche).split('|').includes(niche));
  const sourceGroups = Array.from(new Set(items.map(row => row.source_group).filter(Boolean)));
  let directnessWeighted = 0;
  let highIntersection = 0;
  let fullLoop = 0;
  let behaviorSignals = 0;
  let moneySignals = 0;
  const featureCounts = {};
  for (const item of items) {
    directnessWeighted += DIRECTNESS_WEIGHTS[item.source_group] ?? 0.2;
    const tags = matchRules(` ${textFor(item)} `, FEATURE_RULES);
    const score = whitespaceLike(tags);
    if (score >= 6) highIntersection += 1;
    if (score >= 7) fullLoop += 1;
    if (tags.includes('habits_streaks') && (tags.includes('avatar_identity') || tags.includes('gaming_progression'))) behaviorSignals += 1;
    if (item.pricing_type === 'paid' || item.price_usd || /paid|price|subscription|\$|€|£|฿/.test(item.monetization_notes)) moneySignals += 1;
    for (const tag of tags) featureCounts[tag] = (featureCounts[tag] || 0) + 1;
  }
  const marketCoverage = coverage.filter(row => row.niche === niche);
  const strongMedium = marketCoverage.filter(row => ['strong_coverage', 'medium_coverage'].includes(row.coverage_band));
  const saturationScore = Math.min(100, (Math.log10(items.length + 1) / 4) * 100);
  const fullLoopRate = items.length ? (fullLoop / items.length) * 100 : 0;
  const scarcityScore = Math.max(0, 100 - (fullLoopRate * 10));
  const topFeatures = Object.entries(featureCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(([key, value]) => `${key}:${value}`)
    .join('|');
  const topSourceGroups = Object.entries(countBy(items, 'source_group'))
    .sort((a, b) => b[1] - a[1])
    .map(([key, value]) => `${key}:${value}`)
    .join('|');
  const row = {
    niche,
    cross_source_dedup_rows: items.length,
    source_group_count: sourceGroups.length,
    strong_medium_coverage_cells: strongMedium.length,
    directness_weighted_rows: round(directnessWeighted),
    saturation_score_0_100: round(saturationScore),
    high_intersection_candidates: highIntersection,
    full_loop_like_candidates: fullLoop,
    full_loop_rate_pct: round(fullLoopRate, 2),
    full_loop_scarcity_score: round(scarcityScore),
    behavior_identity_or_progress_signals: behaviorSignals,
    money_signal_rows: moneySignals,
    top_source_groups: topSourceGroups,
    top_feature_tags: topFeatures,
    opportunity_band: '',
    interpretation: '',
    next_validation_move: ''
  };
  row.opportunity_band = opportunityBand(row);
  row.interpretation = row.opportunity_band === 'high_opportunity_validate_now'
    ? 'Large cross-source surface with scarce full-loop direct substitutes; prioritize manual validation and product testing.'
    : row.opportunity_band === 'mechanic_benchmark_not_primary_market'
      ? 'Strong mechanic/saturation benchmark, but not a primary Alina consumer market without direct ritual/self-improvement overlap.'
    : row.opportunity_band === 'medium_opportunity_needs_sampling'
      ? 'Plausible whitespace, but needs sampled competitor inspection before claim upgrade.'
      : row.opportunity_band === 'crowded_or_unclear_context'
        ? 'Market is visible but either crowded, indirect, or weakly tied to the full Alina loop.'
        : 'Insufficient cross-source density for standalone claims.';
  row.next_validation_move = row.opportunity_band === 'mechanic_benchmark_not_primary_market'
    ? 'Use for progression/avatar/retention mechanics only; do not treat as direct market proof.'
    : row.opportunity_band.includes('opportunity')
    ? 'Sample top direct consumer-app and desktop rows, then compare against prototype scorecard.'
    : 'Use only as support/context unless new source-native evidence is added.';
  rows.push(row);
}

rows.sort((a, b) => {
  const order = {
  high_opportunity_validate_now: 0,
  medium_opportunity_needs_sampling: 1,
  mechanic_benchmark_not_primary_market: 2,
  crowded_or_unclear_context: 3,
  thin_context_only: 4
  };
  return (order[a.opportunity_band] - order[b.opportunity_band])
    || Number(b.directness_weighted_rows) - Number(a.directness_weighted_rows);
});

writeCsv(OUT, rows, [
  'niche', 'cross_source_dedup_rows', 'source_group_count', 'strong_medium_coverage_cells',
  'directness_weighted_rows', 'saturation_score_0_100', 'high_intersection_candidates',
  'full_loop_like_candidates', 'full_loop_rate_pct', 'full_loop_scarcity_score',
  'behavior_identity_or_progress_signals', 'money_signal_rows', 'top_source_groups',
  'top_feature_tags', 'opportunity_band', 'interpretation', 'next_validation_move'
]);

const bandCounts = countBy(rows, 'opportunity_band');
const lines = [];
lines.push('# Cross-Source Saturation And Whitespace V1');
lines.push('');
lines.push(`Generated: ${new Date().toISOString()}`);
lines.push('');
lines.push('## Purpose');
lines.push('');
lines.push('This matrix translates the cross-source universe and coverage matrix into a market-level saturation and whitespace read. It is not a replacement for manual competitor walkthroughs; it is a prioritization layer for where the Alina thesis has enough source coverage and enough apparent full-loop scarcity to validate next.');
lines.push('');
lines.push('## Summary');
lines.push('');
lines.push(`- Markets scored: ${rows.length}`);
lines.push(`- High opportunity: ${bandCounts.high_opportunity_validate_now || 0}`);
lines.push(`- Medium opportunity: ${bandCounts.medium_opportunity_needs_sampling || 0}`);
lines.push(`- Mechanic benchmark / not primary market: ${bandCounts.mechanic_benchmark_not_primary_market || 0}`);
lines.push(`- Crowded/unclear/context: ${(bandCounts.crowded_or_unclear_context || 0) + (bandCounts.thin_context_only || 0)}`);
lines.push('');
lines.push('Opportunity band mix:');
lines.push('');
lines.push(Object.entries(bandCounts).sort((a, b) => b[1] - a[1]).map(([key, value]) => `- ${key}: ${value}`).join('\n'));
lines.push('');
lines.push('## Market Matrix');
lines.push('');
lines.push(mdTable(rows, [
  { key: 'niche', label: 'Market' },
  { key: 'cross_source_dedup_rows', label: 'Dedup Rows', align: 'right' },
  { key: 'strong_medium_coverage_cells', label: 'Strong/Medium Cells', align: 'right' },
  { key: 'directness_weighted_rows', label: 'Directness-Weighted Rows', align: 'right' },
  { key: 'full_loop_like_candidates', label: 'Full-Loop-Like', align: 'right' },
  { key: 'full_loop_scarcity_score', label: 'Scarcity', align: 'right' },
  { key: 'opportunity_band', label: 'Opportunity' }
]));
lines.push('');
lines.push('## Interpretation');
lines.push('');
for (const row of rows) {
  lines.push(`- ${row.niche}: ${row.interpretation} Next: ${row.next_validation_move}`);
}
lines.push('');
lines.push('## Claim Boundary');
lines.push('');
lines.push('- This matrix uses text-derived feature rules and source directness weights; it is useful for prioritization, not final proof.');
lines.push('- High opportunity means: broad source coverage, enough direct/adjacent density, and scarce full-loop-like substitutes in public metadata.');
lines.push('- Any upgrade from opportunity to claim must pass manual walkthrough, paid-flow signoff, and user/prototype validation gates.');
lines.push('');
lines.push('## Files');
lines.push('');
lines.push(`- \`${OUT}\``);

fs.writeFileSync(OUT_DOC, `${lines.join('\n')}\n`);

console.log(`matrix=${OUT}`);
console.log(`doc=${OUT_DOC}`);
console.log(`markets=${rows.length}`);
console.log(`high=${bandCounts.high_opportunity_validate_now || 0}`);
console.log(`medium=${bandCounts.medium_opportunity_needs_sampling || 0}`);
