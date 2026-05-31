import fs from 'fs';

const AUDIENCE = 'data_processed/audience_signal_matrix.csv';
const REVIEW_CLUSTERS = 'data_processed/review_jtbd_cluster_summary.csv';
const FORUM_QUOTES = 'data_processed/forum_quote_coding_matrix.csv';
const MONETIZATION = 'data_processed/market_monetization_proxy_matrix.csv';
const OUT_MATRIX = 'data_processed/icp_segment_matrix.csv';
const OUT_DOC = 'docs/audience/icp-segment-matrix-v1.md';

for (const dir of ['data_processed', 'docs/audience']) fs.mkdirSync(dir, { recursive: true });

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

function sum(rows, key) {
  return rows.reduce((total, row) => total + Number(row[key] || 0), 0);
}

function topRows(rows, key, limit = 4) {
  return rows
    .slice()
    .sort((a, b) => Number(b[key] || 0) - Number(a[key] || 0))
    .slice(0, limit);
}

const audience = csv(AUDIENCE);
const reviewClusters = csv(REVIEW_CLUSTERS);
const forumQuotes = csv(FORUM_QUOTES);
const monetization = csv(MONETIZATION);

const audienceCounts = countBy(audience, 'audience_tag');
const monetizationByMarket = new Map(monetization.map(row => [row.market, row]));

const cluster = id => reviewClusters.find(row => row.cluster_id === id) || {};
const forumCount = (...tags) => forumQuotes.filter(row => tags.some(tag => clean(row.coding_tags).includes(tag))).length;
const marketForumCount = market => forumQuotes.filter(row => row.market === market).length;
const moneyBand = market => monetizationByMarket.get(market)?.monetization_proxy_band || 'unknown';

const segmentDefs = [
  {
    segment_id: 'ICP_A',
    segment_name: 'Spiritual self-improvers',
    primary_markets: 'astrology_esoterics|coaching',
    audience_tags: 'spiritual_seekers|self_improvement_users',
    entry_behavior: 'Uses astrology, tarot, manifestation, devotional, journaling, or guidance apps to make today feel meaningful.',
    core_job: 'Turn symbolic/personal meaning into one grounded action today.',
    top_jtbd: 'jtbd_feel_seen_personalized|jtbd_daily_anchor|jtbd_structure_self_improvement',
    top_pains: 'pain_trust_accuracy_safety|pain_content_depth_customization|pain_subscription_value',
    monetization_markets: ['astrology_esoterics', 'coaching'],
    proof_markets: ['astrology_esoterics', 'coaching'],
    positioning: 'Personal guidance that becomes action, not another vague reading.',
    validation_gate: '5 interviews or manual sessions show users trust the daily guidance enough to act on it.'
  },
  {
    segment_id: 'ICP_B',
    segment_name: 'Avatar identity builders',
    primary_markets: 'avatar_identity|coaching',
    audience_tags: 'gen_z_creator_identity|self_improvement_users',
    entry_behavior: 'Uses avatars, AI companions, profile identity, roleplay, or future-self visuals to explore identity.',
    core_job: 'See a version of myself change as I make progress.',
    top_jtbd: 'jtbd_make_growth_visible|jtbd_feel_seen_personalized|jtbd_belonging_accountability',
    top_pains: 'pain_unclear_game_loop|pain_trust_accuracy_safety|pain_content_depth_customization',
    monetization_markets: ['avatar_identity', 'coaching'],
    proof_markets: ['avatar_identity'],
    positioning: 'An identity object that responds to completed action, not a one-off avatar generator.',
    validation_gate: 'Manual inspection confirms avatar/identity products rarely make the visual self causally respond to a daily action.'
  },
  {
    segment_id: 'ICP_C',
    segment_name: 'Anxious daily reset users',
    primary_markets: 'mindfulness|coaching',
    audience_tags: 'anxious_stressed_users|self_improvement_users',
    entry_behavior: 'Uses meditation, breathwork, sleep, calm, mood, or stress tools for short relief.',
    core_job: 'Calm down quickly and return to the day with one manageable next step.',
    top_jtbd: 'jtbd_fast_emotional_reset|jtbd_daily_anchor|jtbd_structure_self_improvement',
    top_pains: 'pain_subscription_value|pain_signup_access_friction|pain_reliability_breaks_ritual',
    monetization_markets: ['mindfulness', 'coaching'],
    proof_markets: ['mindfulness'],
    positioning: 'A two-minute reset connected to meaning and progress, not a generic meditation library.',
    validation_gate: 'Prototype users complete the reset without feeling gamified, pressured, or clinically generic.'
  },
  {
    segment_id: 'ICP_D',
    segment_name: 'Habit and progress users',
    primary_markets: 'coaching|mindfulness',
    audience_tags: 'self_improvement_users|anxious_stressed_users',
    entry_behavior: 'Uses habit trackers, planners, streaks, routines, journals, or AI coaches to stay consistent.',
    core_job: 'Make vague growth concrete and keep momentum without streak anxiety.',
    top_jtbd: 'jtbd_structure_self_improvement|jtbd_make_growth_visible|jtbd_daily_anchor',
    top_pains: 'pain_subscription_value|pain_reliability_breaks_ritual|pain_unclear_game_loop',
    monetization_markets: ['coaching', 'mindfulness'],
    proof_markets: ['coaching'],
    positioning: 'One meaningful action with forgiving visible progress, not another task manager.',
    validation_gate: 'Users prefer action-tied progress/identity feedback over a plain checklist or streak counter.'
  },
  {
    segment_id: 'ICP_E',
    segment_name: 'Cozy/casual progression users',
    primary_markets: 'gaming|avatar_identity',
    audience_tags: 'casual_gamers|gen_z_creator_identity',
    entry_behavior: 'Likes low-pressure progression, collectibles, quests, daily rewards, customization, or cozy game loops.',
    core_job: 'Return because progress feels gentle, visible, and emotionally rewarding.',
    top_jtbd: 'jtbd_make_growth_visible|jtbd_belonging_accountability|jtbd_daily_anchor',
    top_pains: 'pain_unclear_game_loop|pain_reliability_breaks_ritual|pain_subscription_value',
    monetization_markets: ['gaming', 'avatar_identity'],
    proof_markets: ['gaming', 'avatar_identity'],
    positioning: 'Borrow cozy progression, but avoid manipulative daily-claim monetization.',
    validation_gate: 'Users read progression as self-growth feedback, not game chores or retention tricks.'
  },
  {
    segment_id: 'ICP_F',
    segment_name: 'Coaching professionals and structured growth users',
    primary_markets: 'coaching',
    audience_tags: 'coaching_professionals|self_improvement_users',
    entry_behavior: 'Uses coaching, structured learning, professional growth, fitness/health coaching, or AI recommendation tools.',
    core_job: 'Get structured guidance that turns intention into accountable practice.',
    top_jtbd: 'jtbd_structure_self_improvement|jtbd_belonging_accountability|jtbd_daily_anchor',
    top_pains: 'pain_content_depth_customization|pain_subscription_value|pain_trust_accuracy_safety',
    monetization_markets: ['coaching'],
    proof_markets: ['coaching'],
    positioning: 'A personal daily ritual coach rather than enterprise/career coaching software.',
    validation_gate: 'Evidence separates consumer daily ritual use from B2B/career coaching demand.'
  }
];

function rowsForClusterIds(ids) {
  return ids.split('|').map(id => cluster(id)).filter(row => row.cluster_id);
}

function monetizationSummary(markets) {
  return markets
    .map(market => `${market}:${moneyBand(market)}`)
    .join('|');
}

function segmentEvidenceScore(def, jtbdRows, painRows) {
  const audienceRows = def.audience_tags.split('|').reduce((total, tag) => total + Number(audienceCounts[tag] || 0), 0);
  const reviewRows = sum(jtbdRows, 'review_rows') + sum(painRows, 'review_rows');
  const forumRows = def.proof_markets.reduce((total, market) => total + marketForumCount(market), 0);
  const strongMoney = def.monetization_markets.filter(market => moneyBand(market) === 'strong_paid_behavior_proxy').length;
  let score = 0;
  score += Math.min(3, Math.floor(audienceRows / 2000));
  score += Math.min(3, Math.floor(reviewRows / 500));
  score += Math.min(2, Math.floor(forumRows / 8));
  score += strongMoney >= 1 ? 2 : 0;
  return score;
}

function band(score) {
  if (score >= 8) return 'strong_directional_icp';
  if (score >= 6) return 'medium_directional_icp';
  if (score >= 4) return 'thin_directional_icp';
  return 'weak_icp';
}

const rows = segmentDefs.map(def => {
  const jtbdRows = rowsForClusterIds(def.top_jtbd);
  const painRows = rowsForClusterIds(def.top_pains);
  const audienceRows = def.audience_tags.split('|').reduce((total, tag) => total + Number(audienceCounts[tag] || 0), 0);
  const reviewRows = sum(jtbdRows, 'review_rows') + sum(painRows, 'review_rows');
  const forumRows = def.proof_markets.reduce((total, market) => total + marketForumCount(market), 0);
  const score = segmentEvidenceScore(def, jtbdRows, painRows);
  return {
    segment_id: def.segment_id,
    segment_name: def.segment_name,
    primary_markets: def.primary_markets,
    evidence_band: band(score),
    evidence_score: score,
    audience_signal_rows: audienceRows,
    review_cluster_rows: reviewRows,
    forum_quote_rows: forumRows,
    monetization_proxy: monetizationSummary(def.monetization_markets),
    entry_behavior: def.entry_behavior,
    core_job: def.core_job,
    top_jtbd_clusters: jtbdRows.map(row => `${row.cluster_id}:${row.review_rows}`).join('|'),
    top_pain_clusters: painRows.map(row => `${row.cluster_id}:${row.review_rows}`).join('|'),
    positioning_angle: def.positioning,
    main_risk: painRows[0]?.product_implication || 'Requires direct user validation.',
    validation_gate: def.validation_gate
  };
});

writeCsv(OUT_MATRIX, rows, [
  'segment_id', 'segment_name', 'primary_markets', 'evidence_band', 'evidence_score',
  'audience_signal_rows', 'review_cluster_rows', 'forum_quote_rows', 'monetization_proxy',
  'entry_behavior', 'core_job', 'top_jtbd_clusters', 'top_pain_clusters',
  'positioning_angle', 'main_risk', 'validation_gate'
]);

const lines = [];
lines.push('# ICP Segment Matrix V1');
lines.push('');
lines.push(`Generated: ${new Date().toISOString()}`);
lines.push('');
lines.push('## Purpose');
lines.push('');
lines.push('This matrix turns metadata audience tags, App Store review JTBD/pain clusters, forum quote coding, and monetization proxies into testable ICP hypotheses. It is directional evidence, not final user research.');
lines.push('');
lines.push('## Evidence Bands');
lines.push('');
lines.push(bulletCounts(countBy(rows, 'evidence_band')));
lines.push('');
lines.push('## Segment Matrix');
lines.push('');
lines.push('| Segment | Evidence | Audience Rows | Review Rows | Forum Rows | Core Job | Positioning | Validation Gate |');
lines.push('| --- | --- | ---: | ---: | ---: | --- | --- | --- |');
for (const row of rows) {
  lines.push(`| ${row.segment_name} | ${row.evidence_band} | ${row.audience_signal_rows} | ${row.review_cluster_rows} | ${row.forum_quote_rows} | ${row.core_job} | ${row.positioning_angle} | ${row.validation_gate} |`);
}
lines.push('');
lines.push('## Strongest Initial ICP Read');
lines.push('');
const strongest = rows.slice().sort((a, b) => Number(b.evidence_score) - Number(a.evidence_score))[0];
lines.push(`The highest-scoring segment is **${strongest.segment_name}** (${strongest.evidence_band}). This does not mean it is the final target; it means current evidence gives it the best starting validation case.`);
lines.push('');
lines.push('## Cross-Segment Implications');
lines.push('');
lines.push('- The shared audience is not one demographic label; it is a behavior: people already using digital rituals to make identity, emotion, and progress feel manageable.');
lines.push('- Daily anchor, concrete action, visible progress, and emotional reset appear across multiple segments.');
lines.push('- Subscription fatigue, reliability, signup friction, and trust/safety recur enough to be treated as product requirements, not edge cases.');
lines.push('- The MVP should start with one segment, but preserve bridges to adjacent segments through language and mechanics.');
lines.push('');
lines.push('## Files');
lines.push('');
lines.push(`- \`${OUT_MATRIX}\``);
fs.writeFileSync(OUT_DOC, `${lines.join('\n')}\n`);

console.log(`matrix=${OUT_MATRIX}`);
console.log(`doc=${OUT_DOC}`);
console.log(`segments=${rows.length}`);
console.log(`strong=${rows.filter(row => row.evidence_band === 'strong_directional_icp').length}`);
