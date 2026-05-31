import fs from 'fs';

const INPUT = 'data_raw/app_store_top_candidate_reviews.csv';
const OUT_ROWS = 'data_processed/review_jtbd_cluster_rows.csv';
const OUT_SUMMARY = 'data_processed/review_jtbd_cluster_summary.csv';
const OUT_DOC = 'docs/audience/review-jtbd-clusters-v1.md';

for (const dir of ['data_processed', 'docs/audience']) fs.mkdirSync(dir, { recursive: true });

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

function countBy(rows, key) {
  const out = {};
  for (const row of rows) out[row[key] || 'unknown'] = (out[row[key] || 'unknown'] || 0) + 1;
  return out;
}

const CLUSTERS = [
  {
    cluster_id: 'jtbd_daily_anchor',
    type: 'jtbd',
    label: 'Give me a daily anchor I can return to',
    implication: 'Alina needs one obvious recurring ritual, not a menu of disconnected features.',
    keywords: ['daily', 'every day', 'routine', 'remind', 'streak', 'habit', 'devotional', 'horoscope', 'reading', 'pray', 'prayer']
  },
  {
    cluster_id: 'jtbd_feel_seen_personalized',
    type: 'jtbd',
    label: 'Make the guidance feel personally about me',
    implication: 'Personalization must be concrete and explainable, especially around birth data, goals, mood, and recent actions.',
    keywords: ['personalized', 'tailored', 'specific to me', 'accurate', 'spot on', 'birth chart', 'natal', 'my chart', 'understand me']
  },
  {
    cluster_id: 'jtbd_fast_emotional_reset',
    type: 'jtbd',
    label: 'Help me calm down or reset quickly',
    implication: 'A two-minute reset is a plausible core unit if it produces relief without feeling clinical or generic.',
    keywords: ['anxiety', 'anxious', 'stress', 'calm', 'peace', 'comfort', 'breathe', 'breathing', 'sleep', 'panic', 'relax']
  },
  {
    cluster_id: 'jtbd_make_growth_visible',
    type: 'jtbd',
    label: 'Show me visible progress so effort feels real',
    implication: 'The avatar/progress object should act as proof of effort, not decoration.',
    keywords: ['progress', 'level', 'xp', 'reward', 'rewards', 'grow', 'avatar', 'lamb', 'character', 'evolve', 'achievement', 'badge']
  },
  {
    cluster_id: 'jtbd_structure_self_improvement',
    type: 'jtbd',
    label: 'Turn vague self-improvement into concrete actions',
    implication: 'The product should translate identity/guidance into one small completed action per day.',
    keywords: ['goal', 'goals', 'task', 'tasks', 'habit', 'tracker', 'focus', 'productive', 'discipline', 'journal', 'reflection']
  },
  {
    cluster_id: 'jtbd_belonging_accountability',
    type: 'jtbd',
    label: 'Feel accompanied or accountable',
    implication: 'Companion energy can be useful, but social/community features should not precede the solo daily loop.',
    keywords: ['friend', 'friends', 'community', 'share', 'social', 'family', 'together', 'accountability', 'encourage']
  },
  {
    cluster_id: 'pain_subscription_value',
    type: 'pain',
    label: 'Subscription or paywall does not feel worth it',
    implication: 'The free loop must demonstrate value before asking for deeper paid analysis or personalization.',
    keywords: ['price', 'expensive', 'pay', 'paid', 'subscription', 'subscribe', 'trial', 'charged', 'money', 'cancel']
  },
  {
    cluster_id: 'pain_reliability_breaks_ritual',
    type: 'pain',
    label: 'Bugs break trust and interrupt the ritual',
    implication: 'Reliability is part of the emotional promise; broken streaks, loading failures, or lost rewards are high-risk.',
    keywords: ['bug', 'bugs', 'crash', 'crashes', 'glitch', 'broken', 'loading', 'error', 'doesn’t work', "doesn't work", 'reset my streak']
  },
  {
    cluster_id: 'pain_content_depth_customization',
    type: 'pain',
    label: 'Users want more depth, options, or customization',
    implication: 'Depth should be earned after the core loop, especially custom rituals, richer avatar choices, and accessibility options.',
    keywords: ['more', 'wish', 'needs', 'add', 'feature', 'custom', 'customize', 'options', 'read aloud', 'audio']
  },
  {
    cluster_id: 'pain_trust_accuracy_safety',
    type: 'pain',
    label: 'Trust, accuracy, or spiritual safety concerns',
    implication: 'Alina needs careful framing: soft guidance, no deterministic claims, visible limits, and clear safety posture.',
    keywords: ['wrong', 'inaccurate', 'fake', 'scam', 'generic', 'misleading', 'ai isn’t real', 'not real', 'privacy', 'data', 'safe']
  },
  {
    cluster_id: 'pain_unclear_game_loop',
    type: 'pain',
    label: 'The game layer can feel confusing or disconnected',
    implication: 'Progression must be causally tied to the action users just completed; story/rewards cannot feel arbitrary.',
    keywords: ['boring', 'don’t get it', "don't get it", 'confusing', 'reward system', 'story', 'what the story', 'not worth']
  },
  {
    cluster_id: 'pain_signup_access_friction',
    type: 'pain',
    label: 'Signup, access, or device friction blocks activation',
    implication: 'Avoid unnecessary phone-number gates and preserve low-friction first-use flow.',
    keywords: ['phone number', 'register', 'sign up', 'login', 'code', 'verification', 'load', 'access']
  }
];

function matchedClusters(review) {
  const text = `${review.title} ${review.content}`.toLowerCase();
  return CLUSTERS.filter(cluster => cluster.keywords.some(keyword => text.includes(keyword)));
}

const reviews = parseCsv(fs.readFileSync(INPUT, 'utf8'));
const clusterRows = [];

for (const review of reviews) {
  for (const cluster of matchedClusters(review)) {
    clusterRows.push({
      app_store_id: review.app_store_id,
      app_name: review.app_name,
      archetype: review.archetype,
      direct_threat_level: review.direct_threat_level,
      rating: review.rating,
      cluster_id: cluster.cluster_id,
      cluster_type: cluster.type,
      cluster_label: cluster.label,
      updated_at: review.updated_at,
      source_url: review.source_url
    });
  }
}

const summary = CLUSTERS.map(cluster => {
  const rows = clusterRows.filter(row => row.cluster_id === cluster.cluster_id);
  const ratings = rows.map(row => Number(row.rating)).filter(Number.isFinite);
  const apps = countBy(rows, 'app_name');
  const archetypes = countBy(rows, 'archetype');
  return {
    cluster_id: cluster.cluster_id,
    cluster_type: cluster.type,
    cluster_label: cluster.label,
    review_rows: rows.length,
    app_count: new Set(rows.map(row => row.app_store_id)).size,
    avg_rating: ratings.length ? (ratings.reduce((a, b) => a + b, 0) / ratings.length).toFixed(2) : '',
    top_apps: Object.entries(apps).sort((a, b) => b[1] - a[1]).slice(0, 5).map(([app, count]) => `${app} (${count})`).join('; '),
    top_archetypes: Object.entries(archetypes).sort((a, b) => b[1] - a[1]).slice(0, 4).map(([name, count]) => `${name} (${count})`).join('; '),
    product_implication: cluster.implication
  };
}).sort((a, b) => Number(b.review_rows) - Number(a.review_rows));

writeCsv(OUT_ROWS, clusterRows, [
  'app_store_id', 'app_name', 'archetype', 'direct_threat_level', 'rating',
  'cluster_id', 'cluster_type', 'cluster_label', 'updated_at', 'source_url'
]);

writeCsv(OUT_SUMMARY, summary, [
  'cluster_id', 'cluster_type', 'cluster_label', 'review_rows', 'app_count',
  'avg_rating', 'top_apps', 'top_archetypes', 'product_implication'
]);

const lines = [];
lines.push('# Review JTBD and Pain Clusters V1');
lines.push('');
lines.push(`Generated: ${new Date().toISOString()}`);
lines.push('');
lines.push('## Scope');
lines.push('');
lines.push(`This clusters ${reviews.length} public App Store review rows into repeatable Jobs To Be Done and pain themes for Alina. Clusters are keyword-based evidence triage, not final qualitative coding.`);
lines.push('');
lines.push('## Summary');
lines.push('');
lines.push('| Cluster | Type | Review Rows | Apps | Avg Rating | Product Implication |');
lines.push('| --- | --- | ---: | ---: | ---: | --- |');
for (const row of summary) {
  lines.push(`| ${row.cluster_label} | ${row.cluster_type} | ${row.review_rows} | ${row.app_count} | ${row.avg_rating} | ${row.product_implication.replace(/\|/g, '/')} |`);
}
lines.push('');
lines.push('## Highest-Signal Interpretation');
lines.push('');
lines.push('- The largest cluster is not generic wellness demand; it is desire for more depth, options, customization, and accessibility after users understand the basic product.');
lines.push('- The strongest Alina-specific opportunity remains visible progress: users like effort becoming visible through streaks, levels, characters, rewards, and growth metaphors.');
lines.push('- The sharpest execution risk is reliability. When a ritual app breaks, the product does not merely lose utility; it breaks emotional trust.');
lines.push('- Subscription complaints are common enough that monetization should sit behind a proven daily loop, not before it.');
lines.push('- Trust/accuracy and spiritual safety concerns are smaller by row count but strategically important because Alina touches guidance, belief, identity, and emotion.');
lines.push('');
lines.push('## Files');
lines.push('');
lines.push(`- \`${OUT_ROWS}\``);
lines.push(`- \`${OUT_SUMMARY}\``);
fs.writeFileSync(OUT_DOC, `${lines.join('\n')}\n`);

console.log(`cluster_rows=${clusterRows.length}`);
console.log(`summary_rows=${summary.length}`);
console.log(`doc=${OUT_DOC}`);
