import fs from 'fs';
import fetch from 'node-fetch';

const REVIEW_INPUT = 'data_processed/top_intersection_review_candidates.csv';
const RAW_INPUT = 'data_raw/expanded/all_expanded_dedup.csv';
const OUT_CSV = 'data_processed/top_intersection_review_prefill.csv';
const OUT_MD = 'docs/competitive/top-intersection-review-prefill-v1.md';

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

function appStoreId(url) {
  const match = String(url || '').match(/\/id(\d+)/);
  return match ? match[1] : '';
}

function recordIndex(recordId) {
  const match = String(recordId || '').match(/CMP-(\d+)/);
  return match ? Number(match[1]) - 1 : -1;
}

async function fetchJson(url) {
  const res = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' } });
  if (!res.ok) return null;
  return await res.json();
}

async function lookupAppStore(ids) {
  const out = new Map();
  const unique = [...new Set(ids.filter(Boolean))];
  for (let i = 0; i < unique.length; i += 50) {
    const chunk = unique.slice(i, i + 50);
    const url = `https://itunes.apple.com/lookup?id=${chunk.join(',')}&country=us`;
    try {
      const data = await fetchJson(url);
      for (const item of data?.results || []) {
        out.set(String(item.trackId), item);
      }
    } catch (error) {
      // Keep enrichment best-effort.
    }
  }
  return out;
}

const RULES = {
  spiritual: ['astrology', 'horoscope', 'zodiac', 'birth chart', 'natal', 'tarot', 'oracle', 'manifestation', 'spiritual', 'soul', 'moon', 'numerology', 'human design', 'bible'],
  dailyAction: ['daily action', 'action', 'challenge', 'task', 'habit', 'goal', 'coach', 'plan', 'routine', 'quest', 'todo', 'to-do', 'accountability'],
  reset: ['meditation', 'mindfulness', 'breath', 'breathing', 'calm', 'reset', 'stress', 'anxiety', 'sleep', 'relax', 'grounding', 'reflection'],
  avatar: ['avatar', 'character', 'persona', 'profile picture', 'photo', 'selfie', 'portrait', 'drawing', '3d', 'identity', 'influencer'],
  avatarProgression: ['avatar progress', 'evolve', 'evolution', 'level up your avatar', 'transform your avatar', 'future self', 'best self'],
  visibleProgression: ['streak', 'progress', 'level', 'xp', 'achievement', 'milestone', 'tracker', 'rank', 'reward', 'journey', 'growth'],
  pricing: ['subscription', 'premium', 'trial', 'in-app purchase', 'pro', 'monthly', 'annual', 'unlock']
};

function includesAny(text, words) {
  return words.some(word => text.includes(word));
}

function answer(text, primaryWords, secondaryWords = []) {
  if (includesAny(text, primaryWords)) return 'yes';
  if (secondaryWords.length && includesAny(text, secondaryWords)) return 'partial';
  return 'no';
}

function threatLevel(row) {
  const coreYes = [
    row.has_birthdate_or_spiritual_context,
    row.has_daily_action,
    row.has_reset_practice,
    row.has_visible_progression
  ].filter(v => v === 'yes').length;
  const score = Number(row.whitespace_score || 0);
  const reviews = Number(row.review_count || 0);
  if (coreYes >= 4 && row.has_avatar_progression === 'yes' && score >= 8) return 'high';
  if (coreYes >= 4 && row.has_avatar_progression === 'partial' && score >= 8) return 'medium_high';
  if (coreYes >= 3 && ['yes', 'partial'].includes(row.has_avatar_progression) && score >= 7) return 'medium';
  if (coreYes >= 2 || reviews > 1000) return 'low_medium';
  return 'low';
}

function archetype(row, text) {
  const tags = new Set(String(row.feature_tags || '').split('|').filter(Boolean));
  if (includesAny(text, ['birth chart', 'horoscope', 'zodiac', 'astrology', 'natal chart'])) return 'astrology_guidance';
  if (includesAny(text, ['tarot', 'oracle', 'psychic', 'coffee reading'])) return 'tarot_or_oracle_guidance';
  if (includesAny(text, ['manifest', 'law of attraction', 'vision board', 'affirmation'])) return 'manifestation_tool';
  if (includesAny(text, ['bible', 'christian', 'devotional', 'pray with', 'prayer'])) return 'faith_devotional_habit';
  if (includesAny(text, ['roleplay', 'crush', 'harem', 'character ai', 'ai character', 'chat with characters', 'fantasy roleplay'])) return 'ai_companion_roleplay';
  if (includesAny(text, ['adhd', 'task', 'todo', 'to-do', 'productivity', 'habit tracker', 'goal tracker', 'level up your life'])) return 'gamified_self_improvement';
  if ((tags.has('avatar_identity') || tags.has('photo_video_generation')) && tags.has('coaching')) return 'avatar_identity_coaching';
  if ((tags.has('mindfulness') || tags.has('journaling_mood')) && (tags.has('gaming_progression') || tags.has('habits_streaks'))) return 'gamified_mindfulness_or_habit';
  if (tags.has('avatar_identity') || tags.has('photo_video_generation')) return 'avatar_identity_tool';
  if (tags.has('mindfulness')) return 'mindfulness_reset_tool';
  return 'adjacent_candidate';
}

function sourceConfidence(appStoreData, rawRow) {
  if (appStoreData && rawRow?.evidence_quality === 'high') return 'high';
  if (appStoreData || rawRow?.evidence_quality === 'high') return 'medium';
  return 'low';
}

const reviewRows = parseCsv(fs.readFileSync(REVIEW_INPUT, 'utf8'));
const rawRows = parseCsv(fs.readFileSync(RAW_INPUT, 'utf8'));
const ids = reviewRows.map(r => appStoreId(r.source_url));
const appStore = await lookupAppStore(ids);

const enriched = reviewRows.map(row => {
  const idx = recordIndex(row.record_id);
  const raw = rawRows[idx] || {};
  const id = appStoreId(row.source_url);
  const app = appStore.get(id) || {};
  const description = clean(app.description || raw.core_features || '');
  const releaseNotes = clean(app.releaseNotes || '');
  const text = [
    row.app_name,
    row.keyword,
    row.feature_tags,
    row.audience_tags,
    description,
    releaseNotes,
    app.primaryGenreName,
    (app.genres || []).join(' ')
  ].join(' ').toLowerCase();
  const classificationText = [
    row.app_name,
    row.keyword,
    description,
    releaseNotes,
    app.primaryGenreName,
    (app.genres || []).join(' ')
  ].join(' ').toLowerCase();

  const prefill = {
    ...row,
    app_store_id: id,
    seller_name: app.sellerName || raw.publisher || '',
    primary_genre: app.primaryGenreName || raw.category || '',
    genres: (app.genres || []).join('|'),
    content_rating: app.contentAdvisoryRating || '',
    current_version_release_date: app.currentVersionReleaseDate || '',
    app_store_price: app.formattedPrice || row.pricing_type || '',
    app_store_rating: app.averageUserRating || row.rating || '',
    app_store_review_count: app.userRatingCount || row.review_count || '',
    description_excerpt: description.slice(0, 900),
    release_notes_excerpt: releaseNotes.slice(0, 500),
    prefill_status: app.trackId ? 'app_store_lookup_enriched' : 'metadata_only',
    source_confidence: sourceConfidence(app.trackId, raw),
    archetype: archetype(row, classificationText),
    has_birthdate_or_spiritual_context: answer(text, RULES.spiritual),
    has_daily_action: answer(text, ['daily action', 'challenge', 'task', 'habit', 'goal', 'plan', 'routine', 'quest', 'todo', 'to-do', 'accountability'], ['coach', 'coaching', 'guidance']),
    has_reset_practice: answer(text, RULES.reset),
    has_avatar_progression: answer(text, RULES.avatarProgression, RULES.avatar),
    has_visible_progression: answer(text, RULES.visibleProgression, ['daily', 'journey', 'growth']),
    pricing_notes: includesAny(text, RULES.pricing) ? 'pricing/paywall language detected in metadata' : (app.formattedPrice ? `app price: ${app.formattedPrice}` : ''),
    review_notes: ''
  };

  prefill.direct_threat_level = threatLevel(prefill);
  prefill.manual_status = 'prefilled_needs_manual_review';
  return prefill;
});

writeCsv(OUT_CSV, enriched, [
  'review_rank', 'record_id', 'app_name', 'niche', 'platform', 'source_kind', 'keyword',
  'rating', 'review_count', 'pricing_type', 'feature_tags', 'audience_tags', 'pillar_count',
  'whitespace_score', 'source_url', 'manual_status', 'direct_threat_level',
  'has_birthdate_or_spiritual_context', 'has_daily_action', 'has_reset_practice',
  'has_avatar_progression', 'has_visible_progression', 'pricing_notes', 'review_notes',
  'app_store_id', 'seller_name', 'primary_genre', 'genres', 'content_rating',
  'current_version_release_date', 'app_store_price', 'app_store_rating',
  'app_store_review_count', 'description_excerpt', 'release_notes_excerpt',
  'prefill_status', 'source_confidence', 'archetype'
]);

const counts = {
  total: enriched.length,
  threat: {},
  archetype: {},
  spiritual: {},
  dailyAction: {},
  reset: {},
  avatarProgression: {},
  visibleProgression: {},
  enriched: {}
};

function inc(obj, key) {
  obj[key] = (obj[key] || 0) + 1;
}

for (const row of enriched) {
  inc(counts.threat, row.direct_threat_level);
  inc(counts.archetype, row.archetype);
  inc(counts.spiritual, row.has_birthdate_or_spiritual_context);
  inc(counts.dailyAction, row.has_daily_action);
  inc(counts.reset, row.has_reset_practice);
  inc(counts.avatarProgression, row.has_avatar_progression);
  inc(counts.visibleProgression, row.has_visible_progression);
  inc(counts.enriched, row.prefill_status);
}

const topThreats = enriched
  .filter(r => ['high', 'medium_high'].includes(r.direct_threat_level))
  .slice(0, 25);

const lines = [];
lines.push('# Top Intersection Review Prefill V1');
lines.push('');
lines.push(`Generated: ${new Date().toISOString()}`);
lines.push('');
lines.push('## Purpose');
lines.push('');
lines.push('This file pre-fills the top-100 manual competitor review with App Store metadata and heuristic fields. It is not a substitute for manual review; it is a triage accelerator.');
lines.push('');
lines.push('## Output');
lines.push('');
lines.push(`- \`${OUT_CSV}\``);
lines.push('');
lines.push('## Coverage');
lines.push('');
for (const [key, value] of Object.entries(counts.enriched)) lines.push(`- ${key}: ${value}`);
lines.push('');
lines.push('## Threat Levels');
lines.push('');
for (const [key, value] of Object.entries(counts.threat)) lines.push(`- ${key}: ${value}`);
lines.push('');
lines.push('## Archetypes');
lines.push('');
for (const [key, value] of Object.entries(counts.archetype).sort((a, b) => b[1] - a[1])) lines.push(`- ${key}: ${value}`);
lines.push('');
lines.push('## Heuristic Feature Coverage');
lines.push('');
lines.push('| Field | Counts |');
lines.push('|---|---|');
lines.push(`| Spiritual / birth-date context | ${Object.entries(counts.spiritual).map(([k, v]) => `${k}: ${v}`).join(', ')} |`);
lines.push(`| Daily action | ${Object.entries(counts.dailyAction).map(([k, v]) => `${k}: ${v}`).join(', ')} |`);
lines.push(`| Reset practice | ${Object.entries(counts.reset).map(([k, v]) => `${k}: ${v}`).join(', ')} |`);
lines.push(`| Avatar progression | ${Object.entries(counts.avatarProgression).map(([k, v]) => `${k}: ${v}`).join(', ')} |`);
lines.push(`| Visible progression | ${Object.entries(counts.visibleProgression).map(([k, v]) => `${k}: ${v}`).join(', ')} |`);
lines.push('');
lines.push('## Highest-Priority Manual Checks');
lines.push('');
lines.push('| Rank | App | Threat | Archetype | Spiritual | Action | Reset | Avatar Progression | Visible Progression |');
lines.push('|---:|---|---|---|---|---|---|---|---|');
for (const row of topThreats) {
  lines.push(`| ${row.review_rank} | ${clean(row.app_name).replace(/\|/g, '/')} | ${row.direct_threat_level} | ${row.archetype} | ${row.has_birthdate_or_spiritual_context} | ${row.has_daily_action} | ${row.has_reset_practice} | ${row.has_avatar_progression} | ${row.has_visible_progression} |`);
}
lines.push('');
lines.push('## Caveats');
lines.push('');
lines.push('- App Store lookup does not reliably expose subscription price or full IAP menus.');
lines.push('- `has_avatar_progression=partial` often means avatar/photo/identity is present, not that behavior-tied progression is proven.');
lines.push('- `direct_threat_level` is heuristic and should be overwritten during manual review.');
lines.push('- Duplicate apps across niches should be merged or marked duplicate in the completed review file.');

fs.writeFileSync(OUT_MD, `${lines.join('\n')}\n`);

console.log(`prefill_rows=${enriched.length}`);
console.log(`app_store_enriched=${counts.enriched.app_store_lookup_enriched || 0}`);
console.log(`metadata_only=${counts.enriched.metadata_only || 0}`);
console.log(`outputs=${OUT_CSV},${OUT_MD}`);
