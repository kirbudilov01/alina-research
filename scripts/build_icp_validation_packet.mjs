import fs from 'fs';

const IN = 'data_processed/icp_segment_matrix.csv';
const OUT_MATRIX = 'data_processed/icp_validation_test_plan.csv';
const OUT_DOC = 'docs/audience/icp-validation-packet-v1.md';

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

function writeCsv(file, rows, headers) {
  fs.writeFileSync(file, [headers.join(','), ...rows.map(row => headers.map(h => csvEscape(row[h])).join(','))].join('\n'));
}

function mdTable(rows, columns) {
  const header = `| ${columns.map(c => c.label).join(' | ')} |`;
  const sep = `| ${columns.map(c => c.align === 'right' ? '---:' : '---').join(' | ')} |`;
  const body = rows.map(row => `| ${columns.map(c => clean(row[c.key]).replace(/\|/g, '/')).join(' | ')} |`);
  return [header, sep, ...body].join('\n');
}

const segments = parseCsv(fs.readFileSync(IN, 'utf8'))
  .sort((a, b) => Number(b.evidence_score || 0) - Number(a.evidence_score || 0));

function priorityFor(index) {
  if (index < 2) return 'P0_top_two';
  if (index < 4) return 'P1_compare';
  return 'P2_backstop';
}

function sampleTarget(priority) {
  if (priority === 'P0_top_two') return '8 interviews + 5 prototype sessions';
  if (priority === 'P1_compare') return '4 interviews + 3 prototype sessions';
  return '2 interviews if early data is contradictory';
}

function participantFilter(segment) {
  return `Has used or paid for at least one tool in ${segment.primary_markets} in the last 90 days; describes current need as: ${segment.core_job}`;
}

const templates = [
  {
    validation_type: 'screener',
    hypothesis: 'The segment is reachable and can self-identify with the entry behavior.',
    task: segment => `Ask: "Which apps, rituals, games, journals, coaches, avatars, or guidance tools did you use in the last 30 days, and what triggered the last use?" Match against: ${segment.entry_behavior}`,
    success: 'Participant names recent behavior without being led and describes a recurring trigger.',
    failure: 'Participant only likes the idea abstractly or cannot name a recent behavior.',
    metric: 'recent_behavior_match=yes/no'
  },
  {
    validation_type: 'problem_interview',
    hypothesis: 'The core job exists before the product is shown.',
    task: segment => `Ask for the last real moment when they needed this job: ${segment.core_job}. Capture exact language, workaround, emotional stakes, and what they tried instead.`,
    success: 'Participant recalls a specific recent episode, existing workaround, and meaningful frustration or desire.',
    failure: 'Problem is hypothetical, low-frequency, or solved well enough by current tools.',
    metric: 'specific_episode + workaround + pain_intensity_1_5'
  },
  {
    validation_type: 'prototype_loop',
    hypothesis: 'The two-minute Alina loop is understood and feels personally meaningful.',
    task: segment => 'Show a simple flow: personal meaning prompt -> one daily action -> short reset -> avatar/identity change -> tomorrow hook. Ask participant to narrate what they think is happening and complete one simulated loop.',
    success: 'Participant understands causal action-to-progress link and says the feedback makes the action feel more meaningful.',
    failure: 'Participant sees it as a generic habit tracker, vague reading, or manipulative gamification.',
    metric: 'comprehension=yes/no; meaning_lift_1_5; loop_completion'
  },
  {
    validation_type: 'positioning_test',
    hypothesis: 'The positioning angle is sharper than adjacent alternatives.',
    task: segment => `Compare three one-line concepts: current tool, generic habit/coach app, and Alina angle: "${segment.positioning_angle}". Ask which they would try first and why.`,
    success: 'Alina angle wins or is clearly differentiated for the target job.',
    failure: 'Generic alternative wins because Alina sounds vague, unsafe, childish, or redundant.',
    metric: 'preferred_concept; differentiation_1_5'
  },
  {
    validation_type: 'willingness_to_pay',
    hypothesis: 'The segment can support free entry with paid depth.',
    task: segment => `Ask what they currently pay for in ${segment.primary_markets}, then test paid depth: richer analysis, custom rituals, advanced avatar/progress history, and coaching-style review.`,
    success: 'Participant has paid recently or names a concrete paid upgrade that would be worth testing.',
    failure: 'Participant rejects paid depth or expects all value before sign-up with no monetizable path.',
    metric: 'current_paid_behavior=yes/no; acceptable_price_range; paid_feature_rank'
  },
  {
    validation_type: 'disconfirmation',
    hypothesis: 'The segment does not hide a fatal trust, safety, or UX rejection.',
    task: segment => `Ask directly: "What would make this feel unsafe, cringe, manipulative, generic, or not for you?" Probe against known risk: ${segment.main_risk}`,
    success: 'Risks are addressable through framing, control, recovery, or product boundaries.',
    failure: 'Core concept triggers non-addressable trust, identity, spiritual, clinical, or gamification rejection.',
    metric: 'fatal_objection=yes/no; top_objection'
  }
];

const rows = [];
segments.forEach((segment, index) => {
  const priority = priorityFor(index);
  templates.forEach((template, templateIndex) => {
    rows.push({
      test_id: `${segment.segment_id}_T${String(templateIndex + 1).padStart(2, '0')}`,
      segment_id: segment.segment_id,
      segment_name: segment.segment_name,
      priority,
      sample_target: sampleTarget(priority),
      validation_type: template.validation_type,
      hypothesis: template.hypothesis,
      participant_filter: participantFilter(segment),
      task_or_question: template.task(segment),
      success_signal: template.success,
      failure_signal: template.failure,
      metric: template.metric,
      linked_gate: segment.validation_gate,
      status: 'not_started',
      notes: ''
    });
  });
});

writeCsv(OUT_MATRIX, rows, [
  'test_id', 'segment_id', 'segment_name', 'priority', 'sample_target',
  'validation_type', 'hypothesis', 'participant_filter', 'task_or_question',
  'success_signal', 'failure_signal', 'metric', 'linked_gate', 'status', 'notes'
]);

const topTwo = segments.slice(0, 2);
const lines = [];
lines.push('# ICP Validation Packet V1');
lines.push('');
lines.push(`Generated: ${new Date().toISOString()}`);
lines.push('');
lines.push('## Purpose');
lines.push('');
lines.push('This packet turns the directional ICP segment matrix into a validation workflow. It is designed to close the P0 ICP gate without adding new search-engine collection: recruit or manually source participants, run the same protocol across segments, and update the CSV with results.');
lines.push('');
lines.push('## Primary Validation Decision');
lines.push('');
lines.push(`Start with the top two current segments: **${topTwo.map(s => s.segment_name).join('** and **')}**. The goal is not to prove both; the goal is to choose one primary ICP, one secondary ICP, or reject the current framing.`);
lines.push('');
lines.push('## Segment Priority');
lines.push('');
lines.push(mdTable(segments.map((segment, index) => ({
  segment_name: segment.segment_name,
  priority: priorityFor(index),
  evidence_score: segment.evidence_score,
  sample_target: sampleTarget(priorityFor(index)),
  core_job: segment.core_job,
  validation_gate: segment.validation_gate
})), [
  { key: 'segment_name', label: 'Segment' },
  { key: 'priority', label: 'Priority' },
  { key: 'evidence_score', label: 'Score', align: 'right' },
  { key: 'sample_target', label: 'Sample Target' },
  { key: 'core_job', label: 'Core Job' },
  { key: 'validation_gate', label: 'Gate' }
]));
lines.push('');
lines.push('## Interview Protocol');
lines.push('');
lines.push('Run 30 to 40 minutes per participant:');
lines.push('');
lines.push('1. Screener and recent behavior: confirm the participant has used a relevant adjacent tool recently.');
lines.push('2. Last real episode: ask for a specific moment, trigger, workaround, and emotional stakes before showing Alina.');
lines.push('3. Prototype loop: show the two-minute flow and ask the participant to narrate it back.');
lines.push('4. Differentiation: compare Alina against the current tool and a generic habit/coach app.');
lines.push('5. Willingness to pay: ask about current paid behavior and rank paid-depth features.');
lines.push('6. Disconfirmation: actively ask what feels unsafe, generic, childish, manipulative, or not for them.');
lines.push('');
lines.push('## Success Gates');
lines.push('');
lines.push('- Primary ICP candidate: at least 6 of 8 top-segment participants match recent behavior, 5 of 8 recall a specific episode, and 4 of 5 prototype users understand the action-to-progress causality.');
lines.push('- Secondary ICP candidate: smaller but clear pull, with differentiated language and no fatal objections.');
lines.push('- Kill or pivot signal: participants like the concept only abstractly, cannot describe a real recent job, or interpret the loop as generic streak/gamification.');
lines.push('');
lines.push('## Test Plan Matrix');
lines.push('');
lines.push(mdTable(rows, [
  { key: 'test_id', label: 'Test' },
  { key: 'segment_name', label: 'Segment' },
  { key: 'priority', label: 'Priority' },
  { key: 'validation_type', label: 'Type' },
  { key: 'metric', label: 'Metric' },
  { key: 'success_signal', label: 'Success Signal' }
]));
lines.push('');
lines.push('## Files');
lines.push('');
lines.push(`- \`${OUT_MATRIX}\``);
lines.push(`- \`${IN}\``);

fs.writeFileSync(OUT_DOC, `${lines.join('\n')}\n`);

console.log(`matrix=${OUT_MATRIX}`);
console.log(`doc=${OUT_DOC}`);
console.log(`segments=${segments.length}`);
console.log(`tests=${rows.length}`);
