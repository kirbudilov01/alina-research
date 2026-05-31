import fs from 'fs';

const OUT = 'data_processed/public_listing_inspection_results.csv';
const OUT_SUMMARY = 'data_processed/public_listing_inspection_summary.csv';
const OUT_DOC = 'docs/competitive/public-listing-inspection-v1.md';

for (const dir of ['data_processed', 'docs/competitive']) fs.mkdirSync(dir, { recursive: true });

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
  return body.filter(r => r.some(Boolean)).map(r => Object.fromEntries(headers.map((h, i) => [h, r[i] ?? ''])));
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
  const sep = `| ${columns.map(c => c.align === 'right' ? '---:' : '---').join(' | ')} |`;
  const body = slice.map(row => `| ${columns.map(c => clean(row[c.key]).replace(/\|/g, '/')).join(' | ')} |`);
  return [header, sep, ...body].join('\n');
}

function mapBy(rows, key) {
  const out = new Map();
  for (const row of rows) {
    const value = row[key];
    if (value && !out.has(value)) out.set(value, row);
  }
  return out;
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

function keywordHits(text, groups) {
  const hay = clean(text).toLowerCase();
  const hits = [];
  for (const [label, terms] of Object.entries(groups)) {
    if (terms.some(term => hay.includes(term))) hits.push(label);
  }
  return hits;
}

function verdict(scorecard, hits) {
  const score = Number(scorecard.alina_core_score || 0);
  const hasCausal = scorecard.behavior_tied_progression === 'yes'
    || (hits.includes('completion_causality') && (hits.includes('avatar_identity') || hits.includes('progression')));
  const hasLoop = score >= 5 || ['daily_action', 'reflection_reset', 'progression'].filter(tag => hits.includes(tag)).length >= 2;
  if (hasCausal && hasLoop) return 'public_listing_supports_strict_loop_claim';
  if (hasLoop) return 'public_listing_supports_adjacent_loop_not_causality';
  if (hits.length >= 2) return 'public_listing_supports_partial_adjacency';
  return 'public_listing_weak_or_unclear';
}

function causalityRead(scorecard, hits) {
  if (scorecard.behavior_tied_progression === 'yes' && hits.includes('completion_causality')) return 'visible_in_public_copy';
  if (scorecard.behavior_tied_progression === 'yes') return 'metadata_claim_present_copy_needs_walkthrough';
  if (hits.includes('avatar_identity') && hits.includes('progression')) return 'inferred_from_public_copy_not_causal';
  if (hits.includes('avatar_identity') || hits.includes('progression')) return 'decorative_or_progress_only_possible';
  return 'not_visible_public_listing';
}

function riskRead(row, causality) {
  if (row.competitive_verdict_prefill === 'direct_reference_competitor' && causality === 'visible_in_public_copy') return 'high_hidden_clone_risk_requires_app_walkthrough';
  if (causality.includes('metadata_claim')) return 'medium_hidden_clone_risk_requires_app_walkthrough';
  if (causality.includes('inferred') || causality.includes('decorative')) return 'medium_adjacency_risk';
  return 'low_public_listing_directness_risk';
}

function topIapRows(rows, appStoreId) {
  return rows
    .filter(row => row.app_store_id === appStoreId)
    .slice(0, 5)
    .map(row => `${row.product_name || 'iap'} ${row.price_text || ''}`.trim())
    .join('|');
}

const packet = csv('data_processed/manual_competitor_inspection_packet.csv');
const scoreById = mapBy(csv('data_processed/top100_competitor_review_scorecard.csv'), 'app_store_id');
const iap = csv('data_raw/app_store_iap_pricing_raw.csv');
const revenueById = mapBy(csv('data_processed/competitor_revenue_proxy_review.csv'), 'app_store_id');

const keywordGroups = {
  daily_action: ['daily', 'habit', 'routine', 'quest', 'challenge', 'task', 'workout', 'practice', 'wins'],
  reflection_reset: ['reflect', 'reflection', 'journal', 'pray', 'meditat', 'breath', 'reset', 'prompt'],
  avatar_identity: ['avatar', 'lamb', 'future self', 'identity', 'ai coach', 'ai avatar', 'character', 'visual self'],
  completion_causality: ['finish all', 'complete', 'completion', 'revives', 'gains xp', 'levels up', 'grow closer', 'progress'],
  progression: ['xp', 'level', 'streak', 'progress', 'track', 'path', 'grow', 'revives', 'faints'],
  monetization: ['trial', 'subscription', 'pro', 'unlock', 'premium', 'credits']
};

const rows = packet.map(row => {
  const scorecard = scoreById.get(row.app_store_id) || {};
  const revenue = revenueById.get(row.app_store_id) || {};
  const evidence = scorecard.source_evidence_excerpt || '';
  const hits = keywordHits(evidence, keywordGroups);
  const causality = causalityRead(scorecard, hits);
  return {
    inspection_rank: row.inspection_rank,
    app_store_id: row.app_store_id,
    app_name: row.app_name,
    seller_name: row.seller_name,
    public_listing_inspection_status: evidence ? 'public_listing_inspected' : 'missing_public_listing_excerpt',
    walkthrough_status: 'app_onboarding_walkthrough_not_done',
    public_listing_verdict: verdict(scorecard, hits),
    action_to_avatar_causality_public_read: causality,
    hidden_clone_risk_public_read: riskRead(row, causality),
    keyword_evidence_tags: hits.join('|'),
    alina_core_score: scorecard.alina_core_score || '',
    competitive_verdict_prefill: row.competitive_verdict_prefill,
    revenue_proxy_band: row.revenue_proxy_band,
    top_iap_public_rows: topIapRows(iap, row.app_store_id),
    revenue_proxy_evidence: revenue.proxy_reason || revenue.quantitative_evidence || '',
    public_evidence_excerpt: evidence.slice(0, 650),
    source_url: row.app_store_url,
    implication_for_h3_whitespace: causality === 'visible_in_public_copy'
      ? 'downgrade_whitespace_if_walkthrough_confirms_full_loop'
      : 'whitespace_survives_public_listing_but_requires_walkthrough',
    next_required_evidence: 'capture_onboarding_first_action_progress_feedback_and_paywall_screens'
  };
});

const summaryRows = Object.entries(countBy(rows, 'public_listing_verdict')).map(([public_listing_verdict, count]) => ({
  summary_type: 'public_listing_verdict',
  bucket: public_listing_verdict,
  count
})).concat(Object.entries(countBy(rows, 'action_to_avatar_causality_public_read')).map(([bucket, count]) => ({
  summary_type: 'causality_public_read',
  bucket,
  count
}))).concat(Object.entries(countBy(rows, 'hidden_clone_risk_public_read')).map(([bucket, count]) => ({
  summary_type: 'hidden_clone_risk_public_read',
  bucket,
  count
})));

writeCsv(OUT, rows, [
  'inspection_rank', 'app_store_id', 'app_name', 'seller_name',
  'public_listing_inspection_status', 'walkthrough_status', 'public_listing_verdict',
  'action_to_avatar_causality_public_read', 'hidden_clone_risk_public_read',
  'keyword_evidence_tags', 'alina_core_score', 'competitive_verdict_prefill',
  'revenue_proxy_band', 'top_iap_public_rows', 'revenue_proxy_evidence',
  'public_evidence_excerpt', 'source_url', 'implication_for_h3_whitespace',
  'next_required_evidence'
]);
writeCsv(OUT_SUMMARY, summaryRows, ['summary_type', 'bucket', 'count']);

const lines = [];
lines.push('# Public Listing Inspection V1');
lines.push('');
lines.push(`Generated: ${new Date().toISOString()}`);
lines.push('');
lines.push('## Purpose');
lines.push('');
lines.push('This is a no-broad-search inspection layer for the 12 P0 competitors already selected in the manual inspection packet. It reviews existing App Store public listing excerpts, pricing rows, scorecard fields, and source URLs. It does not claim the app/onboarding walkthrough is complete.');
lines.push('');
lines.push('## Summary');
lines.push('');
lines.push(`- Public listing rows inspected: ${rows.length}`);
lines.push(`- Rows with public listing excerpts: ${rows.filter(row => row.public_listing_inspection_status === 'public_listing_inspected').length}`);
lines.push(`- App walkthroughs completed: 0`);
lines.push(`- Visible public-copy action-to-avatar causality reads: ${rows.filter(row => row.action_to_avatar_causality_public_read === 'visible_in_public_copy').length}`);
lines.push(`- High hidden clone risk from public listing: ${rows.filter(row => row.hidden_clone_risk_public_read === 'high_hidden_clone_risk_requires_app_walkthrough').length}`);
lines.push('');
lines.push('Public listing verdict mix:');
lines.push('');
lines.push(bulletCounts(countBy(rows, 'public_listing_verdict')));
lines.push('');
lines.push('Causality public-read mix:');
lines.push('');
lines.push(bulletCounts(countBy(rows, 'action_to_avatar_causality_public_read')));
lines.push('');
lines.push('## Inspection Rows');
lines.push('');
lines.push(mdTable(rows, [
  { key: 'inspection_rank', label: 'Rank', align: 'right' },
  { key: 'app_name', label: 'App' },
  { key: 'public_listing_verdict', label: 'Public Verdict' },
  { key: 'action_to_avatar_causality_public_read', label: 'Causality Read' },
  { key: 'hidden_clone_risk_public_read', label: 'Clone Risk' },
  { key: 'implication_for_h3_whitespace', label: 'H3 Implication' }
], rows.length));
lines.push('');
lines.push('## Interpretation');
lines.push('');
lines.push('- This layer reduces ambiguity in public positioning, but it cannot prove in-app mechanics.');
lines.push('- Any row with visible or metadata-implied action-to-avatar causality remains P0 for walkthrough screenshots.');
lines.push('- The H3 whitespace claim should remain narrow and conditional until onboarding, first action, progress feedback, and paywall screenshots are captured.');
lines.push('');
lines.push('## Files');
lines.push('');
lines.push(`- \`${OUT}\``);
lines.push(`- \`${OUT_SUMMARY}\``);

fs.writeFileSync(OUT_DOC, `${lines.join('\n')}\n`);

console.log(`results=${OUT}`);
console.log(`summary=${OUT_SUMMARY}`);
console.log(`doc=${OUT_DOC}`);
console.log(`rows=${rows.length}`);
console.log(`visible_causality=${rows.filter(row => row.action_to_avatar_causality_public_read === 'visible_in_public_copy').length}`);
