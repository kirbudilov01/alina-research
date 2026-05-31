import fs from 'fs';

const MATRIX = 'data_processed/reddit_mention_signal_matrix.csv';
const APP_SUMMARY = 'data_processed/reddit_mention_app_summary.csv';
const OUT_QUEUE = 'data_processed/reddit_manual_reading_queue.csv';
const OUT_PROMPTS = 'data_processed/reddit_manual_reading_prompt_bank.csv';
const OUT_DOC = 'docs/audience/reddit-manual-reading-queue-v1.md';

for (const dir of ['data_processed', 'docs/audience']) fs.mkdirSync(dir, { recursive: true });

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
  const header = rows.shift();
  if (!header) return [];
  return rows
    .filter(r => r.some(Boolean))
    .map(r => Object.fromEntries(header.map((h, i) => [h, r[i] ?? ''])));
}

function csv(file) {
  return fs.existsSync(file) ? parseCsv(fs.readFileSync(file, 'utf8')) : [];
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

function topCounts(rows, key, limit = 5) {
  return Object.entries(countBy(rows, key))
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .slice(0, limit)
    .map(([k, v]) => `${k}:${v}`)
    .join('|');
}

function uniq(values) {
  return Array.from(new Set(values.map(clean).filter(Boolean)));
}

function mdTable(rows, columns, limit = rows.length) {
  const limited = rows.slice(0, limit);
  const header = `| ${columns.map(c => c.label).join(' | ')} |`;
  const sep = `| ${columns.map(c => c.align === 'right' ? '---:' : '---').join(' | ')} |`;
  const body = limited.map(row => `| ${columns.map(c => clean(row[c.key]).replace(/\|/g, '/')).join(' | ')} |`);
  return [header, sep, ...body].join('\n');
}

const GROUP_PRIORITY = {
  pain_or_rejection_of_overbuilt_systems: 35,
  alternative_or_tool_switching_request: 32,
  pricing_or_subscription_sensitivity: 28,
  identity_companion_or_avatar_need: 25,
  habit_accountability_and_progress_need: 24,
  spiritual_guidance_or_meaning_need: 22,
  reset_mindfulness_or_emotional_regulation_need: 22,
  gamified_progression_or_reward_need: 20,
  unclassified_context_language: 6
};

const STRENGTH_SCORE = {
  medium_high_qualitative: 24,
  medium_qualitative: 18,
  low_medium_qualitative: 10,
  low_qualitative: 4
};

const MARKET_COVERAGE_BONUS = {
  coaching: 8,
  mindfulness: 8,
  avatar_identity: 8,
  astrology_esoterics: 10,
  gaming_progression: 10
};

function queueLane(groups) {
  if (groups.includes('pain_or_rejection_of_overbuilt_systems')) return 'whitespace_objection_read';
  if (groups.includes('alternative_or_tool_switching_request')) return 'competitor_alternative_read';
  if (groups.includes('pricing_or_subscription_sensitivity')) return 'paid_value_objection_read';
  if (groups.includes('identity_companion_or_avatar_need')) return 'avatar_identity_positioning_read';
  if (groups.includes('spiritual_guidance_or_meaning_need')) return 'spiritual_guidance_trust_read';
  if (groups.includes('reset_mindfulness_or_emotional_regulation_need')) return 'reset_safety_language_read';
  if (groups.includes('gamified_progression_or_reward_need')) return 'progression_mechanics_read';
  if (groups.includes('habit_accountability_and_progress_need')) return 'habit_progress_read';
  return 'context_language_read';
}

function manualTask(lane) {
  const tasks = {
    whitespace_objection_read: 'Read the thread and classify what users reject: setup load, notifications, streak anxiety, vague guidance, safety/trust, price, or weak progression.',
    competitor_alternative_read: 'Extract named alternatives from comments, why the current tool failed, and whether users ask for a simpler ritual, stronger personalization, or social proof.',
    paid_value_objection_read: 'Capture explicit price objections, free-vs-paid expectations, trial language, and when users would accept paying after a first value moment.',
    avatar_identity_positioning_read: 'Separate companion/chat expectations from identity/progress feedback; note whether users want emotional presence, customization, or causality from action.',
    spiritual_guidance_trust_read: 'Capture trust language, deterministic-risk objections, desired grounding, and what makes symbolic guidance feel useful rather than vague.',
    reset_safety_language_read: 'Capture anxiety/stress/ADHD/sleep language and flag any safety, clinical, or overclaiming boundaries that product copy must avoid.',
    progression_mechanics_read: 'Extract progression mechanics users praise or reject: quests, collectibles, levels, streaks, daily rewards, customization, and pressure.',
    habit_progress_read: 'Classify habit/accountability needs, missed-day recovery, overwhelm, multi-device desire, and progress visualization.',
    context_language_read: 'Read for vocabulary only; do not use as claim evidence until a clearer signal is manually confirmed.'
  };
  return tasks[lane] || tasks.context_language_read;
}

function interviewPrompt(lane) {
  const prompts = {
    whitespace_objection_read: 'Tell me about the last self-improvement/productivity/wellness app you stopped using. What made it feel too heavy, vague, or pressuring?',
    competitor_alternative_read: 'When you ask people for app recommendations, what are you hoping the next app will fix that the current one does not?',
    paid_value_objection_read: 'What would you need to experience for free before a daily guidance/progress app felt worth paying for?',
    avatar_identity_positioning_read: 'Would seeing a version of yourself change after a completed action feel motivating, silly, or invasive? Why?',
    spiritual_guidance_trust_read: 'What makes personal/spiritual guidance feel trustworthy and useful rather than generic or manipulative?',
    reset_safety_language_read: 'In a stressful moment, what kind of app help feels safe and useful, and what wording would make you close it?',
    progression_mechanics_read: 'Which progress/reward mechanics feel encouraging, and which feel like chores or manipulation?',
    habit_progress_read: 'What helps you recover after missing a day without abandoning the habit?'
  };
  return prompts[lane] || 'What words would you use to describe the problem this thread is circling around?';
}

function whitespacePrompt(lane) {
  const prompts = {
    whitespace_objection_read: 'Does Alina avoid the rejected pattern while still delivering a concrete next action?',
    competitor_alternative_read: 'Which named alternatives already own this job, and where do they fail to connect meaning -> action -> visible progress?',
    paid_value_objection_read: 'Can the free loop prove enough value before paid depth, personalization, or analysis?',
    avatar_identity_positioning_read: 'Is the opportunity avatar-as-progress-feedback, or is this already satisfied by companion/chat products?',
    spiritual_guidance_trust_read: 'Can symbolic guidance be grounded into action without deterministic claims?',
    reset_safety_language_read: 'Can a reset be framed as wellness support without clinical overreach?',
    progression_mechanics_read: 'Can progression feel gentle and self-related rather than retention bait?',
    habit_progress_read: 'Can action-tied progress beat streak/task-manager anxiety?'
  };
  return prompts[lane] || 'Is there a product gap here, or only generic category language?';
}

const matrix = csv(MATRIX);
const appSummary = csv(APP_SUMMARY);
const appStrength = new Map(appSummary.map(row => [row.app_name, row.evidence_strength]));

const byUrl = new Map();
for (const row of matrix) {
  const key = row.source_url || `${row.thread_title}|${row.subreddit}|${row.keyword}`;
  if (!byUrl.has(key)) byUrl.set(key, []);
  byUrl.get(key).push(row);
}

const queue = Array.from(byUrl.entries()).map(([source_url, rows]) => {
  const groups = uniq(rows.map(row => row.signal_group));
  const apps = uniq(rows.map(row => row.app_name));
  const icps = uniq(rows.flatMap(row => String(row.linked_icp_segments || '').split('|')));
  const niches = uniq(rows.map(row => row.niche));
  const strengths = rows.map(row => row.competitor_signal_strength);
  const title = rows.find(row => row.thread_title)?.thread_title || '';
  const snippet = rows.find(row => row.thread_snippet)?.thread_snippet || '';
  const groupScore = Math.max(...groups.map(group => GROUP_PRIORITY[group] || 4));
  const strengthScore = Math.max(...strengths.map(strength => STRENGTH_SCORE[strength] || 0));
  const appScore = apps.some(app => ['strong_qualitative_attention', 'medium_qualitative_attention'].includes(appStrength.get(app))) ? 12 : 0;
  const nicheBonus = Math.max(...niches.map(niche => MARKET_COVERAGE_BONUS[niche] || 0));
  const multiSignalBonus = Math.min(14, (groups.length - 1) * 4 + (apps.length - 1) * 2);
  const snippetBonus = clean(snippet).length > 180 ? 8 : 0;
  const score = groupScore + strengthScore + appScore + nicheBonus + multiSignalBonus + snippetBonus;
  const lane = queueLane(groups);
  return {
    reddit_read_id: '',
    priority_rank: '',
    priority_score: score,
    priority_band: score >= 82 ? 'P0_read_first' : (score >= 68 ? 'P1_read_next' : (score >= 54 ? 'P2_context_read' : 'P3_backlog')),
    queue_lane: lane,
    niche_mix: niches.join('|'),
    subreddit: topCounts(rows, 'subreddit', 3),
    signal_groups: groups.join('|'),
    linked_icp_segments: icps.join('|'),
    app_names: apps.slice(0, 8).join('|') || 'unknown_or_unextracted',
    mention_rows: rows.length,
    known_app_rows: rows.filter(row => clean(row.app_name) && row.collection_status === 'ok').length,
    thread_title: title,
    thread_snippet: snippet,
    source_url,
    manual_read_task: manualTask(lane),
    interview_prompt_seed: interviewPrompt(lane),
    whitespace_prompt_seed: whitespacePrompt(lane),
    capture_fields: 'manual_sentiment|named_alternatives_in_comments|accepted_solution|rejected_solution|paid_signal|safety_boundary|alina_implication|claim_status',
    claim_boundary: 'Manual reading queue only; thread must be read by a human before any external-facing quote, demand, market-share, or competitor-strength claim.'
  };
}).sort((a, b) => Number(b.priority_score) - Number(a.priority_score) || String(a.thread_title).localeCompare(String(b.thread_title)));

queue.forEach((row, idx) => {
  row.priority_rank = idx + 1;
  row.reddit_read_id = `RMR-${String(idx + 1).padStart(4, '0')}`;
});

const promptRows = Object.entries(countBy(queue, 'queue_lane')).map(([queue_lane, row_count]) => {
  const rows = queue.filter(row => row.queue_lane === queue_lane);
  return {
    queue_lane,
    row_count,
    p0_rows: rows.filter(row => row.priority_band === 'P0_read_first').length,
    p1_rows: rows.filter(row => row.priority_band === 'P1_read_next').length,
    top_icp_segments: topCounts(rows.flatMap(row => row.linked_icp_segments.split('|').map(segment => ({ segment }))), 'segment', 6),
    top_signal_groups: topCounts(rows.flatMap(row => row.signal_groups.split('|').map(signal_group => ({ signal_group }))), 'signal_group', 6),
    manual_read_task: manualTask(queue_lane),
    interview_prompt_seed: interviewPrompt(queue_lane),
    whitespace_prompt_seed: whitespacePrompt(queue_lane),
    output_decision: 'Use read results to update ICP interview language, manual competitor walkthrough notes, and whitespace claim boundaries.'
  };
}).sort((a, b) => Number(b.p0_rows) - Number(a.p0_rows) || Number(b.row_count) - Number(a.row_count));

writeCsv(OUT_QUEUE, queue, [
  'reddit_read_id', 'priority_rank', 'priority_score', 'priority_band',
  'queue_lane', 'niche_mix', 'subreddit', 'signal_groups', 'linked_icp_segments',
  'app_names', 'mention_rows', 'known_app_rows', 'thread_title', 'thread_snippet',
  'source_url', 'manual_read_task', 'interview_prompt_seed', 'whitespace_prompt_seed',
  'capture_fields', 'claim_boundary'
]);

writeCsv(OUT_PROMPTS, promptRows, [
  'queue_lane', 'row_count', 'p0_rows', 'p1_rows', 'top_icp_segments',
  'top_signal_groups', 'manual_read_task', 'interview_prompt_seed',
  'whitespace_prompt_seed', 'output_decision'
]);

const lines = [];
lines.push('# Reddit Manual Reading Queue V1');
lines.push('');
lines.push(`Generated: ${new Date().toISOString()}`);
lines.push('');
lines.push('## Purpose');
lines.push('');
lines.push('This artifact turns coded Reddit signal rows into a human reading queue. It prioritizes unique threads by qualitative strength, signal group, market coverage, known-app attention, and snippet usefulness. It does not fetch new sources and does not convert Reddit volume into demand proof.');
lines.push('');
lines.push('## Evidence Boundary');
lines.push('');
lines.push('- Use this queue to decide what a human should read first.');
lines.push('- Use prompt seeds for ICP interviews, prototype objections, and whitespace review.');
lines.push('- Do not quote, cite, or upgrade claims from a queued row until the thread has been manually read and captured.');
lines.push('');
lines.push('## Summary');
lines.push('');
lines.push(`- Unique Reddit threads queued: ${queue.length}`);
lines.push(`- P0 read-first rows: ${queue.filter(row => row.priority_band === 'P0_read_first').length}`);
lines.push(`- P1 read-next rows: ${queue.filter(row => row.priority_band === 'P1_read_next').length}`);
lines.push(`- Queue lanes: ${promptRows.length}`);
lines.push(`- Source signal rows covered: ${matrix.length}`);
lines.push('');
lines.push('## Prompt Bank');
lines.push('');
lines.push(mdTable(promptRows, [
  { key: 'queue_lane', label: 'Lane' },
  { key: 'row_count', label: 'Rows', align: 'right' },
  { key: 'p0_rows', label: 'P0', align: 'right' },
  { key: 'top_icp_segments', label: 'Top ICP' },
  { key: 'interview_prompt_seed', label: 'Interview Prompt Seed' }
], promptRows.length));
lines.push('');
lines.push('## Top Read-First Threads');
lines.push('');
lines.push(mdTable(queue, [
  { key: 'priority_rank', label: 'Rank', align: 'right' },
  { key: 'priority_band', label: 'Band' },
  { key: 'queue_lane', label: 'Lane' },
  { key: 'app_names', label: 'Apps' },
  { key: 'signal_groups', label: 'Signals' },
  { key: 'thread_title', label: 'Thread' }
], 30));
lines.push('');
lines.push('## Files');
lines.push('');
lines.push(`- \`${OUT_QUEUE}\``);
lines.push(`- \`${OUT_PROMPTS}\``);
lines.push(`- \`${OUT_DOC}\``);

fs.writeFileSync(OUT_DOC, `${lines.join('\n')}\n`);

console.log(`reddit_manual_read_queue_rows=${queue.length}`);
console.log(`reddit_manual_read_p0=${queue.filter(row => row.priority_band === 'P0_read_first').length}`);
console.log(`reddit_manual_prompt_rows=${promptRows.length}`);
