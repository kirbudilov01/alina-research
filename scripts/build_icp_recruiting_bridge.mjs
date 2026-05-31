import fs from 'fs';

const IN_SEGMENTS = 'data_processed/icp_segment_matrix.csv';
const IN_TESTS = 'data_processed/icp_validation_test_plan.csv';
const IN_COMMUNITY_ROWS = 'data_processed/community_referral_signal_rows.csv';
const IN_COMMUNITY_SUMMARY = 'data_processed/community_referral_summary.csv';
const IN_PROTOTYPE = 'data_processed/prototype_validation_stimulus_flow.csv';
const IN_SCORECARD = 'data_processed/prototype_validation_scorecard.csv';
const OUT_BRIDGE = 'data_processed/icp_recruiting_bridge.csv';
const OUT_MESSAGES = 'data_processed/icp_recruiting_message_bank.csv';
const OUT_DOC = 'docs/audience/icp-recruiting-bridge-v1.md';

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
  if (!headers) return [];
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

function mdTable(rows, columns, limit = rows.length) {
  const limited = rows.slice(0, limit);
  const header = `| ${columns.map(c => c.label).join(' | ')} |`;
  const sep = `| ${columns.map(c => c.align === 'right' ? '---:' : '---').join(' | ')} |`;
  const body = limited.map(row => `| ${columns.map(c => clean(row[c.key]).replace(/\|/g, '/')).join(' | ')} |`);
  return [header, sep, ...body].join('\n');
}

function includesAny(text, tokens) {
  const haystack = clean(text).toLowerCase();
  return tokens.some(token => haystack.includes(token.toLowerCase()));
}

function segmentTokens(segment) {
  const marketTokens = clean(segment.primary_markets).split('|').filter(Boolean);
  const nameTokens = clean(segment.segment_name).toLowerCase().split(/\s+/).filter(t => t.length > 4);
  const extra = {
    ICP_A: ['astrology', 'spiritual', 'manifestation', 'faith', 'devotional', 'tarot'],
    ICP_B: ['avatar', 'identity', 'companion', 'roleplay', 'future-self'],
    ICP_C: ['mindfulness', 'calm', 'stress', 'sleep', 'mood', 'reset'],
    ICP_D: ['habit', 'progress', 'routine', 'journal', 'planner', 'gamified']
  }[segment.segment_id] || [];
  return Array.from(new Set([...marketTokens, ...nameTokens, ...extra]));
}

function topCounts(rows, key, limit = 5) {
  return Object.entries(countBy(rows, key))
    .filter(([k]) => k !== 'unknown')
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([k, v]) => `${k}:${v}`)
    .join('|');
}

function channelRows(segment, communityRows, communitySummary) {
  const tokens = segmentTokens(segment);
  const matched = communityRows.filter(row => includesAny(`${row.market_or_archetype} ${row.interpretation} ${row.quote_excerpt}`, tokens));
  const summarySignal = communitySummary[0]?.signal_kind || 'community_or_accountability_need';
  const referralRows = matched.filter(row => ['word_of_mouth_or_personal_recommendation', 'developer_outreach_referral', 'reddit_or_forum_referral'].includes(row.signal_kind));
  const communityNeed = matched.filter(row => row.signal_kind === 'community_or_accountability_need');
  const socialRows = matched.filter(row => row.signal_kind === 'social_platform_discovery');
  const forumRows = matched.filter(row => row.source_type === 'forum_quote' || row.signal_kind === 'coded_forum_need_or_competitor_context');
  return [
    {
      channel_id: 'CH_REFERRAL',
      channel_hypothesis: 'Warm referral or friend-of-user intro',
      source_signal_kind: 'word_of_mouth_or_personal_recommendation',
      matched_rows: referralRows.length,
      top_sources: topCounts(referralRows, 'app_or_source_name') || topCounts(matched, 'app_or_source_name'),
      ethical_constraint: 'Ask for opt-in intros only; no pretending to be a user or scraping private communities.'
    },
    {
      channel_id: 'CH_COMMUNITY',
      channel_hypothesis: 'Relevant community thread, Discord, forum, or group where users already discuss the job',
      source_signal_kind: 'community_or_accountability_need',
      matched_rows: communityNeed.length,
      top_sources: topCounts(communityNeed, 'app_or_source_name') || topCounts(matched, 'app_or_source_name'),
      ethical_constraint: 'Post transparently, follow community rules, and offer a short paid or clearly voluntary research session.'
    },
    {
      channel_id: 'CH_SOCIAL_PROOF',
      channel_hypothesis: 'Social platform discovery or creator/community mention',
      source_signal_kind: 'social_platform_discovery',
      matched_rows: socialRows.length,
      top_sources: topCounts(socialRows, 'app_or_source_name') || topCounts(matched, 'app_or_source_name'),
      ethical_constraint: 'Use public posts only as channel hypotheses; do not harvest identities from reviews.'
    },
    {
      channel_id: 'CH_FORUM_LANGUAGE',
      channel_hypothesis: 'Forum-language recruiting using exact problem wording from coded snippets',
      source_signal_kind: forumRows.length ? 'coded_forum_need_or_competitor_context' : summarySignal,
      matched_rows: forumRows.length,
      top_sources: topCounts(forumRows, 'app_or_source_name') || topCounts(matched, 'app_or_source_name'),
      ethical_constraint: 'Use forum evidence for language and problem framing; recruit only through allowed public or owned channels.'
    }
  ];
}

function mainTestsFor(segment, tests) {
  return tests
    .filter(row => row.segment_id === segment.segment_id && ['screener', 'problem_interview', 'prototype_loop', 'willingness_to_pay', 'disconfirmation'].includes(row.validation_type))
    .map(row => row.test_id)
    .join('|');
}

function prototypePromptFor(segment, prototypeRows) {
  const avatar = prototypeRows.find(row => row.segment_id === segment.segment_id && row.screen_id === 'S06_AVATAR_CHANGE');
  const value = prototypeRows.find(row => row.segment_id === segment.segment_id && row.screen_id === 'S08_VALUE_CHECK');
  if (avatar && value) return `${avatar.test_question} Then ask: ${value.test_question}`;
  return 'Show the two-minute loop and ask what changed, what caused it, and whether the participant would return tomorrow.';
}

const segments = csv(IN_SEGMENTS)
  .sort((a, b) => Number(b.evidence_score || 0) - Number(a.evidence_score || 0));
const tests = csv(IN_TESTS);
const communityRows = csv(IN_COMMUNITY_ROWS);
const communitySummary = csv(IN_COMMUNITY_SUMMARY);
const prototypeRows = csv(IN_PROTOTYPE);
const scorecard = csv(IN_SCORECARD);

const bridgeRows = [];
const messageRows = [];

segments.forEach((segment, segmentIndex) => {
  const priority = segmentIndex < 2 ? 'P0_top_two' : 'P1_compare';
  const tokens = segmentTokens(segment);
  const matchedCommunity = communityRows.filter(row => includesAny(`${row.market_or_archetype} ${row.interpretation} ${row.quote_excerpt}`, tokens));
  const channels = channelRows(segment, communityRows, communitySummary);
  for (const channel of channels) {
    const bridgeId = `${segment.segment_id}_${channel.channel_id}`;
    bridgeRows.push({
      bridge_id: bridgeId,
      segment_id: segment.segment_id,
      segment_name: segment.segment_name,
      priority,
      evidence_score: segment.evidence_score,
      core_job: segment.core_job,
      primary_markets: segment.primary_markets,
      source_signal_kind: channel.source_signal_kind,
      matched_community_signal_rows: channel.matched_rows,
      total_segment_community_rows: matchedCommunity.length,
      top_signal_sources: channel.top_sources,
      recruiting_channel_hypothesis: channel.channel_hypothesis,
      screener_question: `In the last 30 days, which apps, rituals, journals, coaches, avatars, or reset tools did you actually use for this job: ${segment.core_job}`,
      qualifying_signal: `Participant names a recent tool/use moment in ${segment.primary_markets} and can describe the trigger without being led.`,
      disqualifying_signal: 'Participant only likes the idea abstractly, cannot name recent behavior, or is outside the target market for the last 90 days.',
      prototype_prompt: prototypePromptFor(segment, prototypeRows),
      wtp_probe: `What are you paying for now in ${segment.primary_markets}, and which paid-depth feature would make this worth paying for after one free loop?`,
      evidence_to_capture: 'recent_behavior_match|specific_episode|current_tool|verbatim_language|loop_comprehension|meaning_lift_1_5|differentiation_1_5|return_intent_1_5|paid_depth_feature|fatal_objection',
      linked_tests: mainTestsFor(segment, tests),
      ethical_constraint: channel.ethical_constraint
    });
    messageRows.push({
      message_id: `${bridgeId}_M01`,
      bridge_id: bridgeId,
      segment_id: segment.segment_id,
      segment_name: segment.segment_name,
      channel_id: channel.channel_id,
      message_variant: 'transparent_research_invite',
      subject_or_hook: `Research chat about ${segment.core_job}`,
      outreach_copy: `Hi, I am researching how people use apps or rituals to ${segment.core_job.toLowerCase()} If this is something you have done recently, I would love to ask a few questions in a 25-35 minute opt-in research chat. No pitch, no hidden signup, and you can skip anything uncomfortable.`,
      follow_up_copy: `Quick follow-up: the useful part for us is your recent real behavior, not whether you like a concept. If you are open to it, we will ask about the last tool or ritual you used and show a tiny prototype flow for feedback.`,
      consent_note: 'Be explicit that this is research, ask permission before recording, allow participant to decline questions, and do not contact people through private scraped data.',
      success_metric: 'qualified_reply_or_scheduled_session',
      linked_bridge_id: bridgeId
    });
  }
});

writeCsv(OUT_BRIDGE, bridgeRows, [
  'bridge_id', 'segment_id', 'segment_name', 'priority', 'evidence_score', 'core_job', 'primary_markets',
  'source_signal_kind', 'matched_community_signal_rows', 'total_segment_community_rows', 'top_signal_sources',
  'recruiting_channel_hypothesis', 'screener_question', 'qualifying_signal', 'disqualifying_signal',
  'prototype_prompt', 'wtp_probe', 'evidence_to_capture', 'linked_tests', 'ethical_constraint'
]);

writeCsv(OUT_MESSAGES, messageRows, [
  'message_id', 'bridge_id', 'segment_id', 'segment_name', 'channel_id', 'message_variant',
  'subject_or_hook', 'outreach_copy', 'follow_up_copy', 'consent_note', 'success_metric', 'linked_bridge_id'
]);

const topBridge = bridgeRows
  .slice()
  .sort((a, b) => Number(b.matched_community_signal_rows || 0) - Number(a.matched_community_signal_rows || 0))
  .slice(0, 8);

const lines = [];
lines.push('# ICP Recruiting Bridge V1');
lines.push('');
lines.push(`Generated: ${new Date().toISOString()}`);
lines.push('');
lines.push('## Purpose');
lines.push('');
lines.push('This bridge converts the directional ICP, community/referral evidence, validation tests, and prototype stimulus into operator-ready recruiting and validation assets. It is not proof that a channel works; it is the handoff layer for running ethical opt-in interviews and prototype sessions.');
lines.push('');
lines.push('## Scope');
lines.push('');
lines.push(`- ICP segments: ${segments.length}`);
lines.push(`- Bridge rows: ${bridgeRows.length}`);
lines.push(`- Outreach/message rows: ${messageRows.length}`);
lines.push(`- Community/referral signal rows scanned: ${communityRows.length}`);
lines.push(`- Prototype scorecard metrics linked: ${scorecard.length}`);
lines.push('');
lines.push('## Top Recruiting Bridges');
lines.push('');
lines.push(mdTable(topBridge, [
  { key: 'bridge_id', label: 'Bridge' },
  { key: 'segment_name', label: 'Segment' },
  { key: 'priority', label: 'Priority' },
  { key: 'matched_community_signal_rows', label: 'Matched Rows', align: 'right' },
  { key: 'recruiting_channel_hypothesis', label: 'Channel Hypothesis' },
  { key: 'qualifying_signal', label: 'Qualifying Signal' }
]));
lines.push('');
lines.push('## Segment Summary');
lines.push('');
lines.push(mdTable(segments.map(segment => {
  const rows = bridgeRows.filter(row => row.segment_id === segment.segment_id);
  return {
    segment_id: segment.segment_id,
    segment_name: segment.segment_name,
    evidence_score: segment.evidence_score,
    bridge_rows: rows.length,
    total_matched_rows: rows.reduce((sum, row) => sum + Number(row.matched_community_signal_rows || 0), 0),
    core_job: segment.core_job
  };
}), [
  { key: 'segment_id', label: 'ID' },
  { key: 'segment_name', label: 'Segment' },
  { key: 'evidence_score', label: 'Score', align: 'right' },
  { key: 'bridge_rows', label: 'Bridge Rows', align: 'right' },
  { key: 'total_matched_rows', label: 'Matched Signal Rows', align: 'right' },
  { key: 'core_job', label: 'Core Job' }
]));
lines.push('');
lines.push('## Evidence Handling Rules');
lines.push('');
lines.push('- Treat outreach copy as a starting script, not a claim of channel-market fit.');
lines.push('- Recruit only through opt-in, transparent, rule-compliant channels.');
lines.push('- Upgrade an ICP only after recent behavior, problem episode, prototype comprehension, differentiation, and paid-depth evidence are captured.');
lines.push('- Downgrade a segment if participants cannot name recent behavior, interpret the loop as generic, or raise fatal trust/safety objections.');
lines.push('');
lines.push('## Files');
lines.push('');
lines.push(`- \`${OUT_BRIDGE}\``);
lines.push(`- \`${OUT_MESSAGES}\``);
lines.push(`- \`${IN_SEGMENTS}\``);
lines.push(`- \`${IN_TESTS}\``);
lines.push(`- \`${IN_COMMUNITY_ROWS}\``);
lines.push(`- \`${IN_PROTOTYPE}\``);

fs.writeFileSync(OUT_DOC, `${lines.join('\n')}\n`);

console.log(`bridge=${OUT_BRIDGE}`);
console.log(`messages=${OUT_MESSAGES}`);
console.log(`doc=${OUT_DOC}`);
console.log(`bridge_rows=${bridgeRows.length}`);
console.log(`message_rows=${messageRows.length}`);
