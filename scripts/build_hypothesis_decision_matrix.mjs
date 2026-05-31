import fs from 'fs';

const OUT = 'data_processed/hypothesis_decision_matrix.csv';
const OUT_DOC = 'docs/decision/hypothesis-decision-matrix-v1.md';

for (const dir of ['data_processed', 'docs/decision']) fs.mkdirSync(dir, { recursive: true });

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
  return body
    .filter(r => r.some(Boolean))
    .map(r => Object.fromEntries(headers.map((h, i) => [h, r[i] ?? ''])));
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
  const body = slice.map(row => `| ${columns.map(c => clean(row[c.key]).replace(/\|/g, '<br>')).join(' | ')} |`);
  return [header, sep, ...body].join('\n');
}

function countBy(rows, key) {
  const out = {};
  for (const row of rows) out[row[key] || 'unknown'] = (out[row[key] || 'unknown'] || 0) + 1;
  return out;
}

function claim(id) {
  return evidence.find(row => row.claim_id === id) || {};
}

function decisionFor(row) {
  const status = clean(row.evidence_status);
  const confidence = clean(row.confidence);
  if (/unvalidated|walkthrough_open|directional|narrow_supported|supported_with_ranges|supported_narrowly/.test(status)) return 'hold_validate';
  if (/proved|supported_for_mvp_framing/.test(status) && ['high', 'medium_high'].includes(confidence)) return 'go_for_next_phase';
  if (/missing|weak|reject|fatal/.test(status)) return 'stop_or_pivot';
  return 'hold_validate';
}

function gateFor(hypothesisId) {
  const gates = {
    H1: {
      go: 'At least 5 P0 competitors classified by direct app walkthrough and no hidden direct clone owns the full loop.',
      hold: 'Public metadata supports adjacency but onboarding/action/progress screenshots are missing.',
      kill: 'A P0 competitor clearly owns personal meaning -> action -> reset -> causally changing identity/avatar/progress -> next-day hook.'
    },
    H2: {
      go: 'Paid-flow inspection confirms top money proxies and prototype/WTP sessions show plausible paid depth.',
      hold: 'TAM/SAM/SOM and proxy monetization are range-supported but not final revenue proof.',
      kill: 'Paid signals fail product matching or users reject paid depth after free loop value.'
    },
    H3: {
      go: 'Manual walkthrough confirms behavior-tied identity/avatar progression remains rare among high-risk direct substitutes.',
      hold: 'Metadata and cross-source saturation are directional; gaming remains benchmark-only.',
      kill: 'Walkthrough reveals common full-loop substitutes or hidden clone risk is confirmed.'
    },
    H4: {
      go: 'Prototype users understand and prefer the integrated loop over generic habit/coach/meditation alternatives.',
      hold: 'Prototype stimulus and scorecard exist, but no participant results are recorded.',
      kill: 'Participants read Alina as generic, unsafe, childish, manipulative, or not worth returning to.'
    },
    H5: {
      go: 'Top two ICP segments produce recent-behavior, language resonance, return-intent, and WTP signals.',
      hold: 'Audience/ICP matrix is directional and needs interviews/prototype sessions.',
      kill: 'No segment recalls concrete use episodes or all reject action-tied identity/progress premise.'
    },
    H6: {
      go: 'MVP loop remains coherent after prototype sessions and competitor walkthrough updates.',
      hold: 'Product core is defined, but comprehension and emotional value are not yet observed.',
      kill: 'The loop requires too much friction/content cost or users cannot explain causality.'
    }
  };
  return gates[hypothesisId];
}

const evidence = csv('data_processed/evidence_claim_register.csv');
const executionDashboard = csv('data_processed/validation_execution_dashboard.csv');
const captureRows = [
  ...csv('data_processed/manual_walkthrough_capture_sheet.csv'),
  ...csv('data_processed/paid_flow_capture_sheet.csv'),
  ...csv('data_processed/icp_interview_capture_sheet.csv'),
  ...csv('data_processed/prototype_session_capture_sheet.csv')
];

const hypothesisMap = [
  ['H1', 'Product shape exists', 'H1_product_shape_exists', 'manual_competitor_walkthrough'],
  ['H2', 'Markets have money', 'H2_markets_have_money', 'paid_flow_validation'],
  ['H3', 'Whitespace exists', 'H3_whitespace_exists', 'manual_competitor_walkthrough'],
  ['H4', 'Competitive advantage is plausible', 'H4_competitive_advantage_plausible', 'prototype_user_validation'],
  ['H5', 'Shared audience exists', 'H5_shared_audience_exists', 'icp_interviews'],
  ['H6', 'Product core can be defined', 'H6_product_core_defined', 'prototype_user_validation']
];

const rows = hypothesisMap.map(([hypothesis_id, hypothesis, claim_id, primary_workstream]) => {
  const evidenceRow = claim(claim_id);
  const gate = gateFor(hypothesis_id);
  const relatedTasks = executionDashboard.filter(row => row.workstream === primary_workstream || clean(row.task).includes(hypothesis_id));
  const relevantCaptureRows = captureRows.filter(row => {
    const target = clean(row.claim_update_target);
    if (primary_workstream === 'manual_competitor_walkthrough') return /manual|validation_gap/.test(target);
    if (primary_workstream === 'paid_flow_validation') return /paywall|paid/i.test(target);
    if (primary_workstream === 'prototype_user_validation') return /prototype/.test(target);
    if (primary_workstream === 'icp_interviews') return /icp/.test(target);
    return false;
  });
  const captureStarted = relevantCaptureRows.filter(row => row.capture_status && row.capture_status !== 'not_started').length;
  const decision = decisionFor(evidenceRow);
  return {
    hypothesis_id,
    hypothesis,
    current_decision: decision,
    evidence_status: evidenceRow.evidence_status || 'missing',
    confidence: evidenceRow.confidence || 'unknown',
    primary_metric: evidenceRow.primary_metric || '',
    strongest_support: evidenceRow.strongest_support || '',
    key_gap: evidenceRow.key_gap || '',
    go_gate: gate.go,
    hold_gate: gate.hold,
    kill_gate: gate.kill,
    next_action: evidenceRow.next_action || '',
    primary_workstream,
    execution_tasks: relatedTasks.length,
    capture_rows: relevantCaptureRows.length,
    capture_started: captureStarted,
    evidence_files: evidenceRow.evidence_files || ''
  };
});

writeCsv(OUT, rows, [
  'hypothesis_id', 'hypothesis', 'current_decision', 'evidence_status', 'confidence',
  'primary_metric', 'strongest_support', 'key_gap', 'go_gate', 'hold_gate', 'kill_gate',
  'next_action', 'primary_workstream', 'execution_tasks', 'capture_rows', 'capture_started',
  'evidence_files'
]);

const decisionMix = countBy(rows, 'current_decision');
const lines = [];
lines.push('# Hypothesis Decision Matrix V1');
lines.push('');
lines.push(`Generated: ${new Date().toISOString()}`);
lines.push('');
lines.push('## Purpose');
lines.push('');
lines.push('This matrix converts H1-H6 from research claims into operating decisions. It separates what can move forward, what must stay in validation, and what would kill or downgrade the thesis. It intentionally does not mark any open user/manual validation gate as complete.');
lines.push('');
lines.push('## Summary');
lines.push('');
lines.push(`- Hypotheses scored: ${rows.length}`);
lines.push(`- Go for next phase: ${decisionMix.go_for_next_phase || 0}`);
lines.push(`- Hold / validate: ${decisionMix.hold_validate || 0}`);
lines.push(`- Stop or pivot: ${decisionMix.stop_or_pivot || 0}`);
lines.push(`- Linked capture rows: ${rows.reduce((sum, row) => sum + Number(row.capture_rows || 0), 0)}`);
lines.push('');
lines.push('Decision mix:');
lines.push('');
lines.push(Object.entries(decisionMix).sort((a, b) => b[1] - a[1]).map(([key, value]) => `- ${key}: ${value}`).join('\n'));
lines.push('');
lines.push('## Matrix');
lines.push('');
lines.push(mdTable(rows, [
  { key: 'hypothesis_id', label: 'ID' },
  { key: 'hypothesis', label: 'Hypothesis' },
  { key: 'current_decision', label: 'Decision' },
  { key: 'confidence', label: 'Confidence' },
  { key: 'primary_metric', label: 'Primary Metric' },
  { key: 'key_gap', label: 'Key Gap' }
]));
lines.push('');
lines.push('## Gates');
lines.push('');
lines.push(mdTable(rows, [
  { key: 'hypothesis_id', label: 'ID' },
  { key: 'go_gate', label: 'Go Gate' },
  { key: 'hold_gate', label: 'Hold Gate' },
  { key: 'kill_gate', label: 'Kill/Pivot Gate' }
]));
lines.push('');
lines.push('## Claim Boundary');
lines.push('');
lines.push('- A hold/validate decision is progress: it preserves the hypothesis while naming exactly what evidence is still missing.');
lines.push('- No hypothesis with participant, walkthrough, or paid-flow gaps is allowed to graduate from metadata alone.');
lines.push('- Any kill-gate trigger should update evidence claims, report language, and final PDF caveats before further expansion.');
lines.push('');
lines.push('## Files');
lines.push('');
lines.push(`- \`${OUT}\``);

fs.writeFileSync(OUT_DOC, `${lines.join('\n')}\n`);

console.log(`matrix=${OUT}`);
console.log(`doc=${OUT_DOC}`);
console.log(`hypotheses=${rows.length}`);
console.log(`hold_validate=${decisionMix.hold_validate || 0}`);
console.log(`go_for_next_phase=${decisionMix.go_for_next_phase || 0}`);
