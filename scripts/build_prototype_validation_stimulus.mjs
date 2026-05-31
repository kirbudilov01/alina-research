import fs from 'fs';

const OUT_FLOW = 'data_processed/prototype_validation_stimulus_flow.csv';
const OUT_SCORECARD = 'data_processed/prototype_validation_scorecard.csv';
const OUT_DOC = 'docs/product/prototype-validation-stimulus-v1.md';

for (const dir of ['data_processed', 'docs/product']) fs.mkdirSync(dir, { recursive: true });

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

function topSegments(rows) {
  const topTwo = rows.filter(row => row.segment_id === 'ICP_A' || row.segment_id === 'ICP_D');
  if (topTwo.length >= 2) return topTwo;
  return [...rows].sort((a, b) => Number(b.evidence_score || 0) - Number(a.evidence_score || 0)).slice(0, 2);
}

const icpSegments = csv('data_processed/icp_segment_matrix.csv');
const reviewClusters = csv('data_processed/review_jtbd_cluster_summary.csv');
const validationPlan = csv('data_processed/icp_validation_test_plan.csv');
const revenueProxy = csv('data_processed/competitor_revenue_proxy_review.csv');

const segments = topSegments(icpSegments);
const topPain = reviewClusters.filter(row => row.cluster_type === 'pain').slice(0, 4);
const topJtbd = reviewClusters.filter(row => row.cluster_type === 'jtbd').slice(0, 4);
const strongMoney = revenueProxy.filter(row => row.revenue_proxy_band === 'strong_bottom_up_money_proxy').slice(0, 8);

const baseScreens = [
  {
    step: 1,
    screen_id: 'S01_ENTRY',
    screen_name: 'Daily meaning entry',
    user_goal: 'Recognize why today matters without deterministic or clinical overclaim.',
    prototype_copy: 'Today is for turning one real feeling into one small proof. Pick the theme that feels alive right now.',
    user_action: 'Choose one theme: courage, repair, clarity, softness, momentum.',
    expected_signal: 'Participant can explain why this is personal rather than generic content.',
    failure_signal: 'Participant reads it as vague astrology, generic motivation, or unsafe certainty.',
    max_seconds: 20
  },
  {
    step: 2,
    screen_id: 'S02_REFLECTION',
    screen_name: 'Tiny context prompt',
    user_goal: 'Give the loop enough context to avoid generic advice.',
    prototype_copy: 'One sentence only: what do you want to feel different by tonight?',
    user_action: 'Type or speak one short sentence.',
    expected_signal: 'Participant supplies a concrete lived moment or emotional target.',
    failure_signal: 'Participant skips because the prompt feels too broad, exposing, or irrelevant.',
    max_seconds: 20
  },
  {
    step: 3,
    screen_id: 'S03_ACTION_CARD',
    screen_name: 'One grounded action',
    user_goal: 'Convert meaning into a concrete action small enough to finish now.',
    prototype_copy: 'Your action: send one honest message, tidy one visible surface, or take a two-minute walk. Pick the one that proves your theme.',
    user_action: 'Pick one action and mark intent.',
    expected_signal: 'Participant sees the action as doable and causally linked to the chosen theme.',
    failure_signal: 'Participant sees it as a random task, chore list, or generic habit tracker.',
    max_seconds: 20
  },
  {
    step: 4,
    screen_id: 'S04_RESET',
    screen_name: 'Short reset',
    user_goal: 'Reduce friction and avoid hard streak pressure before completion.',
    prototype_copy: 'Before you do it: breathe out once, unclench your jaw, name the smallest next move.',
    user_action: 'Complete a simulated 15-second reset.',
    expected_signal: 'Participant feels the reset makes action easier without feeling clinical.',
    failure_signal: 'Participant thinks the reset is filler or clashes with the progress mechanic.',
    max_seconds: 20
  },
  {
    step: 5,
    screen_id: 'S05_COMPLETION',
    screen_name: 'Action evidence',
    user_goal: 'Capture proof of completion without turning the flow into surveillance.',
    prototype_copy: 'Proof, not perfection: tap Done and choose how it felt: lighter, clearer, braver, steadier, no change.',
    user_action: 'Tap Done and select one felt-state tag.',
    expected_signal: 'Participant accepts lightweight self-report as enough evidence.',
    failure_signal: 'Participant wants objective tracking, rejects proof language, or feels judged.',
    max_seconds: 20
  },
  {
    step: 6,
    screen_id: 'S06_AVATAR_CHANGE',
    screen_name: 'Identity/avatar feedback',
    user_goal: 'Make completed action visibly change the identity object.',
    prototype_copy: 'Your future-self signal brightened because you acted. Today added one visible layer: clarity.',
    user_action: 'Observe avatar/progress change and explain what caused it.',
    expected_signal: 'Participant understands action -> identity/avatar causality.',
    failure_signal: 'Participant sees avatar as decoration, reward spam, or unrelated game skin.',
    max_seconds: 20
  },
  {
    step: 7,
    screen_id: 'S07_TOMORROW_HOOK',
    screen_name: 'Next-day hook',
    user_goal: 'Create return intent without punitive streak anxiety.',
    prototype_copy: 'Tomorrow, we will build on this gently. No streak punishment. Just one more proof.',
    user_action: 'Choose reminder tone: quiet, encouraging, playful, direct.',
    expected_signal: 'Participant wants to return and understands continuity.',
    failure_signal: 'Participant feels manipulated, infantilized, or indifferent.',
    max_seconds: 15
  },
  {
    step: 8,
    screen_id: 'S08_VALUE_CHECK',
    screen_name: 'Immediate value check',
    user_goal: 'Measure comprehension, emotional lift, differentiation, and willingness to continue.',
    prototype_copy: 'What did Alina help you do: understand yourself, pick an action, calm down, see progress, or none?',
    user_action: 'Answer one choice and one open text question.',
    expected_signal: 'Participant names the integrated loop in their own words.',
    failure_signal: 'Participant cannot distinguish it from a generic habit tracker, meditation app, or horoscope.',
    max_seconds: 25
  }
];

const flowRows = [];
for (const segment of segments) {
  for (const screen of baseScreens) {
    flowRows.push({
      segment_id: segment.segment_id,
      segment_name: segment.segment_name,
      primary_markets: segment.primary_markets,
      core_job: segment.core_job,
      positioning_angle: segment.positioning_angle,
      main_risk: segment.main_risk,
      ...screen,
      test_question: screen.screen_id === 'S06_AVATAR_CHANGE'
        ? 'What changed, and what caused the change?'
        : screen.screen_id === 'S08_VALUE_CHECK'
          ? 'What would you call this product after using this loop once?'
          : 'Narrate what you think is happening on this screen.',
      evidence_to_capture: 'completion_time_seconds|comprehension_yes_no|meaning_lift_1_5|differentiation_1_5|return_intent_1_5|verbatim_quote'
    });
  }
}

const metrics = [
  {
    metric_id: 'PVS_M01',
    gate: 'comprehension',
    success_threshold: '>=80% of prototype participants correctly explain personal meaning -> action -> avatar/progress causality',
    kill_threshold: '<50% can explain the causal loop without prompting',
    why_it_matters: 'Competitive advantage depends on the integrated loop being understood, not merely on feature novelty.'
  },
  {
    metric_id: 'PVS_M02',
    gate: 'two_minute_completion',
    success_threshold: '>=70% complete simulated loop in under 120 seconds',
    kill_threshold: '<40% complete or flow feels too fragmented',
    why_it_matters: 'The MVP claim is a tiny daily ritual, not a long onboarding or content library.'
  },
  {
    metric_id: 'PVS_M03',
    gate: 'meaning_lift',
    success_threshold: 'Average meaning_lift >=4/5 among target ICP participants',
    kill_threshold: 'Average meaning_lift <=2.5/5',
    why_it_matters: 'The avatar/progress cue must make action feel personally meaningful, not decorative.'
  },
  {
    metric_id: 'PVS_M04',
    gate: 'differentiation',
    success_threshold: '>=60% prefer Alina framing over generic habit/coach alternative',
    kill_threshold: 'Generic habit/coach/meditation alternative wins by clear margin',
    why_it_matters: 'H4 is about competitive advantage, not general product appeal.'
  },
  {
    metric_id: 'PVS_M05',
    gate: 'trust_safety',
    success_threshold: 'No fatal safety/trust objection from target participants; objections are addressable by copy/control',
    kill_threshold: 'Recurring fatal objections: manipulative, spiritual overclaim, childish, clinical, or unsafe guidance',
    why_it_matters: 'Trust failures can invalidate the spiritual/identity loop even if engagement is high.'
  },
  {
    metric_id: 'PVS_M06',
    gate: 'paid_depth',
    success_threshold: '>=40% name a plausible paid depth feature after free loop value is clear',
    kill_threshold: 'Users expect all value free or reject paid depth after seeing loop',
    why_it_matters: 'Market-money evidence needs product-level willingness-to-pay validation.'
  }
];

writeCsv(OUT_FLOW, flowRows, [
  'segment_id', 'segment_name', 'primary_markets', 'core_job', 'positioning_angle',
  'main_risk', 'step', 'screen_id', 'screen_name', 'user_goal', 'prototype_copy',
  'user_action', 'expected_signal', 'failure_signal', 'max_seconds',
  'test_question', 'evidence_to_capture'
]);

writeCsv(OUT_SCORECARD, metrics, [
  'metric_id', 'gate', 'success_threshold', 'kill_threshold', 'why_it_matters'
]);

const lines = [];
lines.push('# Prototype Validation Stimulus V1');
lines.push('');
lines.push(`Generated: ${new Date().toISOString()}`);
lines.push('');
lines.push('## Purpose');
lines.push('');
lines.push('This package converts the product-core hypothesis into a concrete two-minute prototype test. It does not claim user validation has happened. It defines exactly what to show, what to measure, what would support H4, and what would kill or downgrade the competitive-advantage claim.');
lines.push('');
lines.push('## Target Segments');
lines.push('');
lines.push(mdTable(segments, [
  { key: 'segment_id', label: 'ID' },
  { key: 'segment_name', label: 'Segment' },
  { key: 'core_job', label: 'Core Job' },
  { key: 'positioning_angle', label: 'Positioning' },
  { key: 'main_risk', label: 'Main Risk' }
], segments.length));
lines.push('');
lines.push('## Prototype Flow');
lines.push('');
lines.push(`The stimulus contains ${baseScreens.length} screens and is designed to be narrated or mocked in Figma, slides, HTML, or a no-code prototype. Target completion: under 120 seconds.`);
lines.push('');
lines.push(mdTable(baseScreens, [
  { key: 'step', label: 'Step', align: 'right' },
  { key: 'screen_name', label: 'Screen' },
  { key: 'prototype_copy', label: 'Stimulus Copy' },
  { key: 'expected_signal', label: 'Expected Signal' },
  { key: 'failure_signal', label: 'Failure Signal' }
], baseScreens.length));
lines.push('');
lines.push('## Success / Kill Scorecard');
lines.push('');
lines.push(mdTable(metrics, [
  { key: 'metric_id', label: 'Metric' },
  { key: 'gate', label: 'Gate' },
  { key: 'success_threshold', label: 'Success Threshold' },
  { key: 'kill_threshold', label: 'Kill Threshold' },
  { key: 'why_it_matters', label: 'Why It Matters' }
], metrics.length));
lines.push('');
lines.push('## Evidence Inputs Used');
lines.push('');
lines.push(`- ICP segments: ${segments.map(row => row.segment_name).join('; ')}`);
lines.push(`- ICP validation tests already queued: ${validationPlan.length}`);
lines.push(`- Top JTBD clusters considered: ${topJtbd.map(row => row.cluster_label).join('; ')}`);
lines.push(`- Top pain clusters considered: ${topPain.map(row => row.cluster_label).join('; ')}`);
lines.push(`- Strong competitor money proxies considered for paid-depth prompts: ${strongMoney.length}`);
lines.push('');
lines.push('## Claim Boundary');
lines.push('');
lines.push('This artifact closes the stimulus-design gap, not the user-validation gap. H4 remains unproven until real participants complete the loop and the scorecard is filled with observed results.');
lines.push('');
lines.push('## Files');
lines.push('');
lines.push(`- \`${OUT_FLOW}\``);
lines.push(`- \`${OUT_SCORECARD}\``);

fs.writeFileSync(OUT_DOC, `${lines.join('\n')}\n`);

console.log(`flow=${OUT_FLOW}`);
console.log(`scorecard=${OUT_SCORECARD}`);
console.log(`doc=${OUT_DOC}`);
console.log(`segments=${segments.length}`);
console.log(`screens=${baseScreens.length}`);
console.log(`flow_rows=${flowRows.length}`);
console.log(`metrics=${metrics.length}`);
