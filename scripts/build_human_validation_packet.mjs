import fs from 'fs';

const TOP100 = 'data_processed/top100_competitor_review_scorecard.csv';
const WEB_PAYWALL = 'data_processed/web_paywall_signal_matrix.csv';
const OUT_QUEUE = 'data_processed/top100_human_validation_queue.csv';
const OUT_DOC = 'docs/competitive/human-validation-guide-v1.md';

for (const dir of ['data_processed', 'docs/competitive']) fs.mkdirSync(dir, { recursive: true });

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

function normalizeName(value) {
  return clean(value).toLowerCase().replace(/[^a-z0-9]+/g, '');
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

function priorityScore(row, web) {
  let score = Number(row.competitive_threat_score || 0) * 2;
  if (row.competitive_verdict === 'direct_reference_competitor') score += 40;
  if (row.competitive_verdict === 'high_priority_close_substitute') score += 20;
  if (row.behavior_tied_progression === 'yes') score += 25;
  if (Number(row.review_signal_rows || 0) >= 40) score += 8;
  if (Number(row.observed_iap_count || 0) >= 5) score += 8;
  if (web?.needs_screenshot_validation === 'yes') score += 10;
  if (row.direct_threat_level === 'high') score += 8;
  return Math.round(score * 10) / 10;
}

function priorityBand(score) {
  if (score >= 90) return 'P0_validate_first';
  if (score >= 70) return 'P1_high';
  if (score >= 50) return 'P2_medium';
  return 'P3_backlog';
}

function manualChecks(row, web) {
  const checks = [
    'confirm_app_store_metadata',
    'inspect_onboarding_and_first_session',
    'verify_core_feature_claims',
    'verify_pricing_iap_and_trial_terms',
    'capture_3_to_5_screenshots',
    'record_positioning_language'
  ];
  if (row.behavior_tied_progression === 'yes' || row.avatar_or_identity === 'yes') checks.push('verify_behavior_tied_avatar_progression');
  if (Number(row.review_signal_rows || 0) > 0) checks.push('sample_reviews_for_user_language');
  if (web?.needs_screenshot_validation === 'yes') checks.push('validate_public_web_paywall');
  if (/ai|astrology|spiritual|tarot|oracle|health|wellness/i.test(`${row.app_name} ${row.archetype} ${row.source_evidence_excerpt}`)) checks.push('check_safety_and_overclaiming');
  return checks.join('|');
}

function validationQuestions(row) {
  const questions = [
    'Does the product actually solve a daily ritual / self-improvement / guidance job, or is the metadata overstating it?',
    'Is avatar/identity/progression decorative, or does it causally respond to completed user action?',
    'What is free before the first meaningful paywall?',
    'Which user language or screenshot would change our positioning?'
  ];
  if (row.competitive_verdict === 'direct_reference_competitor') {
    questions.unshift('Is this truly a direct reference competitor under the strict Alina loop, or only a faith-specific adjacent example?');
  }
  return questions.join(' | ');
}

const top100 = parseCsv(fs.readFileSync(TOP100, 'utf8'));
const webRows = fs.existsSync(WEB_PAYWALL) ? parseCsv(fs.readFileSync(WEB_PAYWALL, 'utf8')) : [];
const webByName = new Map(webRows.map(row => [normalizeName(row.app_name), row]));
const primary = top100.filter(row => row.duplicate_flag === 'primary_app_entry');

const queue = primary.map(row => {
  const web = webByName.get(normalizeName(row.app_name));
  const score = priorityScore(row, web);
  return {
    validation_rank: '',
    priority_band: priorityBand(score),
    validation_priority_score: score,
    app_store_rank: row.review_rank,
    app_store_id: row.app_store_id,
    app_name: row.app_name,
    seller_name: row.seller_name,
    archetype: row.archetype,
    competitive_verdict: row.competitive_verdict,
    competitive_threat_score: row.competitive_threat_score,
    alina_core_score: row.alina_core_score,
    behavior_tied_progression_claim: row.behavior_tied_progression,
    observed_iap_count: row.observed_iap_count,
    observed_iap_price_range: row.observed_min_iap_price_usd && row.observed_max_iap_price_usd
      ? `$${row.observed_min_iap_price_usd}-$${row.observed_max_iap_price_usd}`
      : '',
    review_signal_rows: row.review_signal_rows,
    top_review_signals: row.top_review_signals,
    top_review_pains: row.top_review_pains,
    web_paywall_signal: web?.strongest_signal || '',
    web_paywall_best_url: web?.best_url || '',
    web_paywall_prices: web?.detected_price_points || '',
    manual_checks: manualChecks(row, web),
    validation_questions: validationQuestions(row),
    current_research_claim: row.alina_opening,
    app_store_url: row.app_store_url,
    validation_status: 'not_started',
    human_notes: ''
  };
}).sort((a, b) => Number(b.validation_priority_score) - Number(a.validation_priority_score));

queue.forEach((row, i) => {
  row.validation_rank = String(i + 1);
});

writeCsv(OUT_QUEUE, queue, [
  'validation_rank', 'priority_band', 'validation_priority_score', 'app_store_rank',
  'app_store_id', 'app_name', 'seller_name', 'archetype', 'competitive_verdict',
  'competitive_threat_score', 'alina_core_score', 'behavior_tied_progression_claim',
  'observed_iap_count', 'observed_iap_price_range', 'review_signal_rows',
  'top_review_signals', 'top_review_pains', 'web_paywall_signal',
  'web_paywall_best_url', 'web_paywall_prices', 'manual_checks',
  'validation_questions', 'current_research_claim', 'app_store_url',
  'validation_status', 'human_notes'
]);

const p0 = queue.filter(row => row.priority_band === 'P0_validate_first');
const p1 = queue.filter(row => row.priority_band === 'P1_high');
const lines = [];
lines.push('# Human Validation Guide V1');
lines.push('');
lines.push(`Generated: ${new Date().toISOString()}`);
lines.push('');
lines.push('## Purpose');
lines.push('');
lines.push('The top-100 competitor review is intentionally labeled AI-assisted. This packet turns it into a human validation workflow so final claims do not rest on metadata heuristics alone.');
lines.push('');
lines.push('## Outputs');
lines.push('');
lines.push(`- \`${OUT_QUEUE}\`: ranked validation queue for ${queue.length} primary app entries.`);
lines.push('- Suggested status values: `not_started`, `confirmed`, `partially_confirmed`, `rejected`, `needs_more_evidence`.');
lines.push('');
lines.push('## Priority Mix');
lines.push('');
lines.push(bulletCounts(countBy(queue, 'priority_band')));
lines.push('');
lines.push('## Validation Protocol');
lines.push('');
lines.push('For each P0/P1 app, capture evidence before changing the final report:');
lines.push('');
lines.push('1. Open App Store page and confirm description, screenshots, rating count, seller, and visible IAP terms.');
lines.push('2. If install/access is available, inspect onboarding, first meaningful action, free/paywall boundary, and progression feedback.');
lines.push('3. Decide whether avatar/identity/progression is decorative or causally tied to completed action.');
lines.push('4. Sample recent reviews for the exact user language behind love/pain signals.');
lines.push('5. If a web paywall URL exists, capture screenshot and verify trial length, monthly/annual price, and cancellation/renewal framing.');
lines.push('6. Mark `validation_status` and write short `human_notes` with evidence links or screenshot filenames.');
lines.push('');
lines.push('## P0 Validate First');
lines.push('');
lines.push('| Rank | App | Verdict | Priority | Behavior Claim | IAP | Web Signal | Key Question |');
lines.push('| ---: | --- | --- | ---: | --- | ---: | --- | --- |');
for (const row of p0.slice(0, 20)) {
  lines.push(`| ${row.validation_rank} | ${clean(row.app_name).replace(/\|/g, '/')} | ${row.competitive_verdict} | ${row.validation_priority_score} | ${row.behavior_tied_progression_claim} | ${row.observed_iap_count || '0'} | ${row.web_paywall_signal || 'n/a'} | ${row.validation_questions.split(' | ')[0].replace(/\|/g, '/')} |`);
}
lines.push('');
lines.push('## P1 High Priority');
lines.push('');
lines.push('| Rank | App | Verdict | Priority | Checks |');
lines.push('| ---: | --- | --- | ---: | --- |');
for (const row of p1.slice(0, 30)) {
  lines.push(`| ${row.validation_rank} | ${clean(row.app_name).replace(/\|/g, '/')} | ${row.competitive_verdict} | ${row.validation_priority_score} | ${row.manual_checks.split('|').slice(0, 5).join('<br>')} |`);
}
lines.push('');
lines.push('## Rules For Updating Claims');
lines.push('');
lines.push('- If behavior-tied progression is not visible after manual review, downgrade the directness claim even if metadata sounded close.');
lines.push('- If the paywall appears before the first meaningful action, treat it as a subscription-risk benchmark.');
lines.push('- If reviews complain about generic content, bugs, safety, or trust, keep those as product risks rather than marketing opportunities.');
lines.push('- If a competitor has a strong daily action -> visible identity feedback loop, promote it into the battlecard set and revisit the whitespace claim.');
fs.writeFileSync(OUT_DOC, `${lines.join('\n')}\n`);

console.log(`queue=${OUT_QUEUE}`);
console.log(`doc=${OUT_DOC}`);
console.log(`queue_rows=${queue.length}`);
console.log(`p0=${p0.length}`);
console.log(`p1=${p1.length}`);
