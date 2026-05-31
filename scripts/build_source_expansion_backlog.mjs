import fs from 'fs';

const OUT = 'data_processed/source_expansion_backlog.csv';
const OUT_DOC = 'docs/competitive/source-expansion-backlog-v1.md';

for (const dir of ['data_processed', 'docs/competitive']) fs.mkdirSync(dir, { recursive: true });

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

function bulletCounts(counts) {
  return Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .map(([key, value]) => `- ${key}: ${value}`)
    .join('\n');
}

const rows = [
  {
    backlog_id: 'SRC-001',
    priority: 'P0',
    source_bucket: 'Product Hunt',
    markets: 'coaching|mindfulness|avatar_identity|astrology_esoterics',
    gap_closed: 'early-stage web/mobile/AI tools missing from app-store-heavy universe',
    collection_method: 'query Product Hunt search pages and product slugs via public web HTML',
    target_output: 'data_raw/expanded_product_hunt_raw.csv',
    expected_raw_rows: '1500-4000',
    expected_evidence_quality: 'medium',
    command_or_next_step: 'Create collect_product_hunt_candidates.mjs; queries: AI coach, habit tracker, meditation, avatar, manifestation, astrology, journaling, self improvement.',
    risk_or_blocker: 'Search pages may rate-limit or require JS; fallback to web search site:producthunt.com/posts.'
  },
  {
    backlog_id: 'SRC-002',
    priority: 'P0',
    source_bucket: 'AlternativeTo',
    markets: 'coaching|mindfulness|avatar_identity',
    gap_closed: 'long-tail software substitutes and web/desktop tools',
    collection_method: 'crawl search/category pages and extract app names/platform tags/source URLs',
    target_output: 'data_raw/expanded_alternativeto_raw.csv',
    expected_raw_rows: '1000-2500',
    expected_evidence_quality: 'medium_high',
    command_or_next_step: 'Create collect_alternativeto_candidates.mjs; seed with Habitica, Calm, Headspace, Replika, Character AI, Notion habit templates, journaling apps.',
    risk_or_blocker: 'Some pages may block automated HTML; keep URL registry even if details are partial.'
  },
  {
    backlog_id: 'SRC-003',
    priority: 'P0',
    source_bucket: 'Chrome Web Store / browser extensions',
    markets: 'coaching|mindfulness|avatar_identity',
    gap_closed: 'browser-based productivity, focus, journaling, mood, avatar and AI assistant tools',
    collection_method: 'controlled Chrome Web Store search/detail extraction with small batches before any broader expansion',
    target_output: 'data_raw/expanded_chrome_extensions_raw.csv',
    expected_raw_rows: '1000-3000',
    expected_evidence_quality: 'medium',
    command_or_next_step: 'Run collect:p0-external and enrich:chrome-extensions, then detail-fetch only high-signal extension candidates.',
    risk_or_blocker: 'Chrome Web Store native search is dynamic; keep batches small and avoid search-engine-heavy expansion unless explicitly needed.'
  },
  {
    backlog_id: 'SRC-004',
    priority: 'P1',
    source_bucket: 'Microsoft Store / Mac App Store web',
    markets: 'coaching|mindfulness|avatar_identity|gaming',
    gap_closed: 'desktop apps and PC wellness/productivity tools outside Steam',
    collection_method: 'site search and public store HTML extraction',
    target_output: 'data_raw/expanded_desktop_store_raw.csv',
    expected_raw_rows: '1000-2500',
    expected_evidence_quality: 'medium',
    command_or_next_step: 'Create collect_desktop_store_candidates.mjs; query Microsoft Store and Mac App Store web pages for meditation, habit, journal, avatar, coach.',
    risk_or_blocker: 'Mac App Store web overlaps iTunes API; dedupe carefully by bundle/name/source.'
  },
  {
    backlog_id: 'SRC-005',
    priority: 'P1',
    source_bucket: 'itch.io / indie game directories',
    markets: 'gaming|mindfulness|avatar_identity',
    gap_closed: 'indie cozy/ritual/avatar/life-sim experiments not visible in mobile stores',
    collection_method: 'crawl tag/search pages for cozy, self-care, meditation, avatar, life sim, idle, ritual',
    target_output: 'data_raw/expanded_itch_raw.csv',
    expected_raw_rows: '2000-6000',
    expected_evidence_quality: 'medium_low',
    command_or_next_step: 'Create collect_itch_candidates.mjs; preserve tags and creator pages; do not over-score as direct competitors.',
    risk_or_blocker: 'Large noisy corpus; useful for mechanic inspiration more than monetization proof.'
  },
  {
    backlog_id: 'SRC-006',
    priority: 'P1',
    source_bucket: 'G2 / Capterra / GetApp style directories',
    markets: 'coaching|mindfulness',
    gap_closed: 'B2B coaching, wellness, employee wellbeing and habit platforms',
    collection_method: 'public category page extraction and search-engine fallback',
    target_output: 'data_raw/expanded_b2b_review_directories_raw.csv',
    expected_raw_rows: '500-1500',
    expected_evidence_quality: 'medium_high',
    command_or_next_step: 'Create collect_b2b_directory_candidates.mjs; categories: wellness software, coaching, employee engagement, mental health, learning experience.',
    risk_or_blocker: 'Anti-bot and commercial pages; store only source URLs and visible public metadata.'
  },
  {
    backlog_id: 'SRC-007',
    priority: 'P1',
    source_bucket: 'Reddit/subreddit discovery as competitor source',
    markets: 'all',
    gap_closed: 'user-named alternatives and unmet needs outside app stores',
    collection_method: 'query old.reddit/search pages and subreddit wiki/sidebar links; extract mentioned app names conservatively',
    target_output: 'data_raw/expanded_reddit_competitor_mentions_raw.csv',
    expected_raw_rows: '500-2000 mentions',
    expected_evidence_quality: 'medium_low',
    command_or_next_step: 'Extend collect_forum_quote_evidence.mjs or create collect_reddit_competitor_mentions.mjs; subreddits: productivity, selfimprovement, meditation, astrology, journaling, gamification, CharacterAI.',
    risk_or_blocker: 'Mentions are noisy and must be coded as qualitative evidence, not ranked market share.'
  },
  {
    backlog_id: 'SRC-008',
    priority: 'P2',
    source_bucket: 'Public website/pricing pages for top candidates',
    markets: 'all',
    gap_closed: 'actual packaging, claims, paywall and trial terms beyond app stores',
    collection_method: 'expand web-paywall queue from Android developer sites to App Store seller sites and top100 manual URL discovery',
    target_output: 'data_raw/company_positioning_raw.csv;data_processed/company_positioning_matrix.csv',
    expected_raw_rows: '500-1200 pages',
    expected_evidence_quality: 'medium_high',
    command_or_next_step: 'Create collect_company_positioning_pages.mjs; fetch homepage/pricing/features/blog/about for P0/P1 competitors.',
    risk_or_blocker: 'Requires careful domain matching; parent-company pages can mislead.'
  },
  {
    backlog_id: 'SRC-009',
    priority: 'P2',
    source_bucket: 'Steam deep tag expansion',
    markets: 'gaming|mindfulness|avatar_identity',
    gap_closed: 'PC game mechanics and avatar/progression design beyond keyword search',
    collection_method: 'tag page crawl for cozy, life sim, relaxing, idle, RPG, character customization, psychological, meditation',
    target_output: 'data_raw/expanded_steam_tags_raw.csv',
    expected_raw_rows: '3000-8000',
    expected_evidence_quality: 'medium',
    command_or_next_step: 'Add tag-mode to expand_competitor_universe.mjs; preserve tag source and rank.',
    risk_or_blocker: 'High noise; use for mechanics and saturation, not direct mobile competitor claims.'
  },
  {
    backlog_id: 'SRC-010',
    priority: 'P2',
    source_bucket: 'Market reports and PDF source expansion',
    markets: 'all',
    gap_closed: 'stronger TAM/SAM/SOM source base and confidence ranges',
    collection_method: 'targeted public report search, PDF discovery, claim extraction and source registry update',
    target_output: 'data_processed/market_source_registry_v2.csv;data_processed/market_claims_v2.csv',
    expected_raw_rows: '50-150 claims',
    expected_evidence_quality: 'medium_high',
    command_or_next_step: 'Extend collect_research_sources.mjs with market-specific report queries and PDF URL capture; manually rank source credibility.',
    risk_or_blocker: 'Many market reports are paywalled; cite only public claims and confidence-tag them.'
  }
];

writeCsv(OUT, rows, [
  'backlog_id', 'priority', 'source_bucket', 'markets', 'gap_closed',
  'collection_method', 'target_output', 'expected_raw_rows',
  'expected_evidence_quality', 'command_or_next_step', 'risk_or_blocker'
]);

const lines = [];
lines.push('# Source Expansion Backlog V1');
lines.push('');
lines.push(`Generated: ${new Date().toISOString()}`);
lines.push('');
lines.push('## Purpose');
lines.push('');
lines.push('The current universe is substantial, but still too mobile-store-heavy and below the aspirational 30k-50k raw collection target. This backlog turns the next expansion into concrete collector work, with priorities, outputs, risks, and expected evidence quality.');
lines.push('');
lines.push('## Priority Mix');
lines.push('');
lines.push(bulletCounts(countBy(rows, 'priority')));
lines.push('');
lines.push('## Source Backlog');
lines.push('');
lines.push('| ID | Priority | Source | Markets | Expected Rows | Output | Main Risk |');
lines.push('| --- | --- | --- | --- | ---: | --- | --- |');
for (const row of rows) {
  lines.push(`| ${row.backlog_id} | ${row.priority} | ${row.source_bucket} | ${row.markets.replace(/\|/g, '<br>')} | ${row.expected_raw_rows} | \`${row.target_output}\` | ${row.risk_or_blocker.replace(/\|/g, '/')} |`);
}
lines.push('');
lines.push('## Recommended Next Run Order');
lines.push('');
lines.push('1. Detail-fetch the controlled Chrome Web Store smoke-pass candidates and use them as browser-mechanic references.');
lines.push('2. Product Hunt + AlternativeTo via source-native/curated-list approaches to add web app / AI tool competitors.');
lines.push('3. Reddit competitor mentions to capture user-named alternatives and pain language.');
lines.push('4. Company positioning pages for P0/P1 competitors to improve moat and paywall evidence.');
lines.push('5. Market report source expansion to strengthen TAM/SAM/SOM confidence.');
lines.push('');
lines.push('## Guardrails');
lines.push('');
lines.push('- Keep raw rows even when noisy, but mark evidence quality explicitly.');
lines.push('- Do not merge qualitative mentions with app-store competitors without source_kind and confidence tags.');
lines.push('- Treat Product Hunt, Reddit, itch.io, and Steam tags as discovery/mechanic sources until manually validated.');
lines.push('- Preserve every source URL and query string so the final PDF can defend provenance.');
lines.push('');
lines.push('## Files');
lines.push('');
lines.push(`- \`${OUT}\``);
fs.writeFileSync(OUT_DOC, `${lines.join('\n')}\n`);

console.log(`backlog=${OUT}`);
console.log(`doc=${OUT_DOC}`);
console.log(`rows=${rows.length}`);
