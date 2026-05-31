import fs from 'fs';

const INPUT = 'data_processed/top_intersection_review_prefill.csv';
const OUT_PRICING = 'data_processed/pricing_retention_matrix.csv';
const OUT_CORE = 'data_processed/product_core_evidence_matrix.csv';
const OUT_SYNTHESIS = 'docs/competitive/top-intersection-review-synthesis-v1.md';
const OUT_PRODUCT = 'docs/product/product-core-evidence-v1.md';

for (const dir of ['data_processed', 'docs/competitive', 'docs/product']) {
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

function text(row) {
  return [
    row.app_name,
    row.keyword,
    row.feature_tags,
    row.audience_tags,
    row.description_excerpt,
    row.release_notes_excerpt,
    row.pricing_notes,
    row.archetype
  ].join(' ').toLowerCase();
}

function hasAny(haystack, needles) {
  return needles.some(n => haystack.includes(n));
}

function tags(haystack, rules) {
  return Object.entries(rules).filter(([, words]) => hasAny(haystack, words)).map(([name]) => name);
}

const PRICING_RULES = {
  free_entry: ['free', 'get started for free', 'download for free'],
  premium: ['premium', ' pro ', ' plus ', 'upgrade'],
  subscription: ['subscription', 'subscribe', 'monthly', 'annual', 'yearly'],
  trial: ['trial', 'free trial'],
  credits_or_consumables: ['credits', 'coins', 'gems', 'packs', 'unlock'],
  enterprise_or_human_service: ['human coaching', 'executive coach', 'fortune 500', 'coach-driven', 'service requests']
};

const RETENTION_RULES = {
  daily_loop: ['daily', 'every morning', 'today', 'day’s', "day's"],
  streaks: ['streak', 'streaks'],
  xp_levels: ['xp', 'level', 'levels', 'level up'],
  quests_challenges: ['quest', 'quests', 'challenge', 'challenges', 'tasks'],
  avatar_feedback: ['avatar', 'lamb', 'character', 'revives', 'faints', 'skins', 'accessories'],
  journaling_reflection: ['journal', 'reflection', 'reflect', 'diary'],
  social: ['friends', 'share', 'social', 'community', 'flock'],
  reminders_habits: ['habit', 'habits', 'routine', 'reminder', 'consistency']
};

const CORE_RULES = {
  personal_meaning: ['birth chart', 'horoscope', 'zodiac', 'astrology', 'tarot', 'oracle', 'manifestation', 'spiritual', 'devotional', 'bible', 'soul', 'numerology'],
  one_daily_action: ['three daily wins', 'daily action', 'task', 'tasks', 'habit', 'coach-driven habits', 'goal', 'plan', 'quest', 'challenge', 'pray with a focused prompt'],
  short_reset: ['meditation', 'mindfulness', 'breath', 'breathing', 'calm', 'reset', 'reflect in sixty seconds', 'reflection', 'stress', 'anxiety', 'sleep'],
  avatar_or_identity: ['avatar', 'character', 'lamb', 'persona', 'profile', 'photo', 'portrait', 'soulmate sketch', 'identity'],
  behavior_tied_progression: ['finish all three', 'revives', 'faints', 'gains xp', 'lamb revives', 'avatar progress', 'avatar evolves', 'character grows', 'level up your avatar', 'transform your avatar'],
  next_day_hook: ['daily', 'every morning', 'streak', 'tomorrow', 'next', 'coming soon']
};

function alinaCloseness(row, t) {
  const core = {
    personal_meaning: hasAny(t, CORE_RULES.personal_meaning),
    one_daily_action: hasAny(t, CORE_RULES.one_daily_action),
    short_reset: hasAny(t, CORE_RULES.short_reset),
    avatar_or_identity: hasAny(t, CORE_RULES.avatar_or_identity),
    behavior_tied_progression: hasAny(t, CORE_RULES.behavior_tied_progression),
    next_day_hook: hasAny(t, CORE_RULES.next_day_hook)
  };
  const score = Object.values(core).filter(Boolean).length;
  const behaviorAvatar = core.avatar_or_identity && core.behavior_tied_progression;
  const rating = score >= 6 && behaviorAvatar ? 'very_close' : score >= 5 ? 'close' : score >= 4 ? 'adjacent' : 'weak';
  return { core, score, rating };
}

function duplicateKey(row) {
  return `${clean(row.app_store_id) || clean(row.source_url) || clean(row.app_name).toLowerCase()}`;
}

const rows = parseCsv(fs.readFileSync(INPUT, 'utf8'));
const duplicateCounts = {};
for (const row of rows) duplicateCounts[duplicateKey(row)] = (duplicateCounts[duplicateKey(row)] || 0) + 1;

const pricingRows = [];
const coreRows = [];
const summary = {
  total: rows.length,
  duplicateRows: 0,
  pricing: {},
  retention: {},
  closeness: {},
  archetype: {},
  highPriority: []
};

function inc(map, key) {
  map[key] = (map[key] || 0) + 1;
}

for (const row of rows) {
  const t = text(row);
  const pricingTags = tags(t, PRICING_RULES);
  const retentionTags = tags(t, RETENTION_RULES);
  const { core, score, rating } = alinaCloseness(row, t);
  const dupCount = duplicateCounts[duplicateKey(row)] || 1;
  if (dupCount > 1) summary.duplicateRows++;
  for (const tag of pricingTags) inc(summary.pricing, tag);
  for (const tag of retentionTags) inc(summary.retention, tag);
  inc(summary.closeness, rating);
  inc(summary.archetype, row.archetype || 'unknown');

  pricingRows.push({
    review_rank: row.review_rank,
    app_name: row.app_name,
    archetype: row.archetype,
    direct_threat_level: row.direct_threat_level,
    pricing_tags: pricingTags.join('|'),
    retention_tags: retentionTags.join('|'),
    app_store_price: row.app_store_price,
    pricing_notes: row.pricing_notes,
    rating: row.app_store_rating,
    review_count: row.app_store_review_count,
    source_url: row.source_url,
    duplicate_count: dupCount,
    evidence_text: clean(row.description_excerpt).slice(0, 420)
  });

  const coreRow = {
    review_rank: row.review_rank,
    app_name: row.app_name,
    archetype: row.archetype,
    direct_threat_level: row.direct_threat_level,
    alina_closeness: rating,
    alina_core_score: score,
    personal_meaning: core.personal_meaning ? 'yes' : 'no',
    one_daily_action: core.one_daily_action ? 'yes' : 'no',
    short_reset: core.short_reset ? 'yes' : 'no',
    avatar_or_identity: core.avatar_or_identity ? 'yes' : 'no',
    behavior_tied_progression: core.behavior_tied_progression ? 'yes' : 'no',
    next_day_hook: core.next_day_hook ? 'yes' : 'no',
    source_url: row.source_url,
    duplicate_count: dupCount,
    evidence_text: clean(row.description_excerpt).slice(0, 500)
  };
  coreRows.push(coreRow);
}

summary.highPriority = coreRows
  .filter(row => ['very_close', 'close'].includes(row.alina_closeness))
  .sort((a, b) => Number(b.alina_core_score) - Number(a.alina_core_score) || Number(a.review_rank) - Number(b.review_rank))
  .slice(0, 30);

writeCsv(OUT_PRICING, pricingRows, [
  'review_rank', 'app_name', 'archetype', 'direct_threat_level', 'pricing_tags',
  'retention_tags', 'app_store_price', 'pricing_notes', 'rating', 'review_count',
  'source_url', 'duplicate_count', 'evidence_text'
]);

writeCsv(OUT_CORE, coreRows, [
  'review_rank', 'app_name', 'archetype', 'direct_threat_level', 'alina_closeness',
  'alina_core_score', 'personal_meaning', 'one_daily_action', 'short_reset',
  'avatar_or_identity', 'behavior_tied_progression', 'next_day_hook',
  'source_url', 'duplicate_count', 'evidence_text'
]);

const lines = [];
lines.push('# Top Intersection Review Synthesis V1');
lines.push('');
lines.push(`Generated: ${new Date().toISOString()}`);
lines.push('');
lines.push('## Scope');
lines.push('');
lines.push('This synthesis is based on the top-100 prefilled competitor candidates. It is still heuristic, but uses App Store descriptions rather than only keyword search rows.');
lines.push('');
lines.push('## Archetype Mix');
lines.push('');
for (const [key, value] of Object.entries(summary.archetype).sort((a, b) => b[1] - a[1])) lines.push(`- ${key}: ${value}`);
lines.push('');
lines.push('## Pricing Signals');
lines.push('');
for (const [key, value] of Object.entries(summary.pricing).sort((a, b) => b[1] - a[1])) lines.push(`- ${key}: ${value}`);
lines.push('');
lines.push('## Retention Signals');
lines.push('');
for (const [key, value] of Object.entries(summary.retention).sort((a, b) => b[1] - a[1])) lines.push(`- ${key}: ${value}`);
lines.push('');
lines.push('## Alina Closeness');
lines.push('');
for (const [key, value] of Object.entries(summary.closeness).sort((a, b) => b[1] - a[1])) lines.push(`- ${key}: ${value}`);
lines.push('');
lines.push('## Interpretation');
lines.push('');
lines.push('The top-100 candidates show strong evidence that daily loops, progress tracking, and emotional/spiritual framing already exist in adjacent products. The stronger unresolved question is whether competitors tie avatar/identity progression directly to completed daily behavior.');
lines.push('');
lines.push('## Priority Manual Review List');
lines.push('');
lines.push('| Rank | App | Closeness | Score | Archetype | Meaning | Action | Reset | Avatar | Behavior Progression |');
lines.push('|---:|---|---|---:|---|---|---|---|---|---|');
for (const row of summary.highPriority) {
  lines.push(`| ${row.review_rank} | ${clean(row.app_name).replace(/\|/g, '/')} | ${row.alina_closeness} | ${row.alina_core_score} | ${row.archetype} | ${row.personal_meaning} | ${row.one_daily_action} | ${row.short_reset} | ${row.avatar_or_identity} | ${row.behavior_tied_progression} |`);
}
lines.push('');
lines.push('## What This Changes');
lines.push('');
lines.push('- The whitespace claim should now focus on behavior-tied avatar progression, not generic avatar presence.');
lines.push('- Pricing evidence remains weak because App Store lookup does not expose detailed IAP/subscription menus.');
lines.push('- Retention evidence is strong enough to justify building Alina around a daily loop, but not yet enough to forecast retention.');
lines.push('');
lines.push('## Next Evidence Tasks');
lines.push('');
lines.push('1. Manually inspect the priority list for real avatar progression.');
lines.push('2. Add IAP/subscription extraction where available.');
lines.push('3. Pull reviews for close/very-close competitors.');
lines.push('4. Update `whitespace-map-v3.md` after manual review.');
fs.writeFileSync(OUT_SYNTHESIS, `${lines.join('\n')}\n`);

const product = [];
product.push('# Product Core Evidence V1');
product.push('');
product.push(`Generated: ${new Date().toISOString()}`);
product.push('');
product.push('## Alina Target Loop');
product.push('');
product.push('Personal meaning -> one daily action -> short reset -> avatar/identity feedback -> visible progression -> next-day hook.');
product.push('');
product.push('## Evidence From Top-100 Candidates');
product.push('');
product.push('| Core Element | Evidence Signal | Interpretation |');
product.push('|---|---|---|');
product.push(`| Personal meaning | ${coreRows.filter(r => r.personal_meaning === 'yes').length}/100 | Very common across spiritual, manifestation, tarot, devotional, and astrology products. |`);
product.push(`| One daily action | ${coreRows.filter(r => r.one_daily_action === 'yes').length}/100 | Common, but the action can be vague; manual review must separate content prompts from concrete behavior. |`);
product.push(`| Short reset | ${coreRows.filter(r => r.short_reset === 'yes').length}/100 | Strong adjacent evidence through meditation, reflection, stress, sleep, and calm language. |`);
product.push(`| Avatar or identity | ${coreRows.filter(r => r.avatar_or_identity === 'yes').length}/100 | Common enough that avatar presence alone is not differentiating. |`);
product.push(`| Behavior-tied progression | ${coreRows.filter(r => r.behavior_tied_progression === 'yes').length}/100 | This is the key field to manually validate; text signals may include generic streaks rather than avatar-linked progress. |`);
product.push(`| Next-day hook | ${coreRows.filter(r => r.next_day_hook === 'yes').length}/100 | Daily hooks are common and should be treated as table stakes. |`);
product.push('');
product.push('## Product Implication');
product.push('');
product.push('Alina should not rely on any single pillar as the moat. The moat candidate is the sequence and the causal link: completing the daily action changes the identity/avatar feedback object.');
product.push('');
product.push('## MVP Testable Claim');
product.push('');
product.push('Users should understand and complete the full daily loop in under two minutes, then report that the avatar/progress cue makes the action feel more personally meaningful.');
fs.writeFileSync(OUT_PRODUCT, `${product.join('\n')}\n`);

console.log(`pricing_rows=${pricingRows.length}`);
console.log(`core_rows=${coreRows.length}`);
console.log(`close_or_very_close=${summary.highPriority.length}`);
console.log(`outputs=${[OUT_PRICING, OUT_CORE, OUT_SYNTHESIS, OUT_PRODUCT].join(',')}`);
