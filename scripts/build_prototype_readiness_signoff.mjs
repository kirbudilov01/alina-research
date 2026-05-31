import fs from 'fs';

const CAPTURE = 'data_processed/prototype_session_capture_sheet.csv';
const STIMULUS = 'data_processed/prototype_validation_stimulus_flow.csv';
const SCORECARD = 'data_processed/prototype_validation_scorecard.csv';
const OUT = 'data_processed/prototype_readiness_signoff.csv';
const DOC = 'docs/product/prototype-readiness-signoff-v1.md';

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
  if (!headers) return { headers: [], rows: [] };
  return {
    headers,
    rows: body.filter(r => r.some(Boolean)).map(r => Object.fromEntries(headers.map((h, i) => [h, r[i] ?? ''])))
  };
}

function readCsv(file) {
  return fs.existsSync(file) ? parseCsv(fs.readFileSync(file, 'utf8')) : { headers: [], rows: [] };
}

function writeCsv(file, rows, headers) {
  fs.writeFileSync(file, `${[headers.join(','), ...rows.map(row => headers.map(h => csvEscape(row[h])).join(','))].join('\n')}\n`);
}

function mdTable(rows, columns, limit = rows.length) {
  const limited = rows.slice(0, limit);
  const header = `| ${columns.map(c => c.label).join(' | ')} |`;
  const sep = `| ${columns.map(c => c.align === 'right' ? '---:' : '---').join(' | ')} |`;
  const body = limited.map(row => `| ${columns.map(c => clean(row[c.key]).replace(/\|/g, '/')).join(' | ')} |`);
  return [header, sep, ...body].join('\n');
}

const capture = readCsv(CAPTURE);
const stimulus = readCsv(STIMULUS).rows;
const scorecard = readCsv(SCORECARD).rows;
const stimulusByKey = new Map(stimulus.map(row => [`${row.segment_id}_${row.screen_id}`, row]));
const metricIds = new Set(scorecard.map(row => row.metric_id));
const signoffs = [];

for (const row of capture.rows) {
  if (row.participant_slot !== 'P01') continue;
  if (!['ICP_A', 'ICP_D'].includes(row.segment_id)) continue;
  const stimulusRow = stimulusByKey.get(`${row.segment_id}_${row.screen_id}`) || {};
  const rowMetricIds = clean(row.metric_ids_to_score).split('|').filter(Boolean);
  const knownMetrics = rowMetricIds.filter(id => metricIds.has(id));
  const missing = [];
  for (const field of ['user_goal', 'prototype_copy', 'user_action', 'expected_signal', 'failure_signal', 'test_question', 'evidence_to_capture']) {
    if (!clean(stimulusRow[field])) missing.push(field);
  }
  if (knownMetrics.length !== rowMetricIds.length) missing.push('unknown_metric_id');
  const readiness = missing.length ? 'needs_repair_before_user_session' : 'ready_for_user_session_capture';
  row.capture_status = 'prototype_readiness_signoff_completed_not_user_session';
  row.observed_behavior = [
    `Prototype readiness review only, no participant observed.`,
    `Screen has user goal: ${stimulusRow.user_goal || 'missing'}.`,
    `Expected signal: ${stimulusRow.expected_signal || 'missing'}.`,
    `Failure signal: ${stimulusRow.failure_signal || 'missing'}.`,
    `Metrics attached: ${knownMetrics.join('|') || 'none'}.`,
    `Readiness: ${readiness}.`
  ].join(' ');
  row.participant_paraphrase = '';
  row.success_signal_seen = '';
  row.failure_signal_seen = '';
  row.researcher_notes = 'Readiness signoff from prototype stimulus and scorecard. Replace with real participant behavior before H4/H6 upgrade.';
  signoffs.push({
    capture_id: row.capture_id,
    segment_id: row.segment_id,
    segment_name: row.segment_name,
    screen_id: row.screen_id,
    screen_name: row.screen_name,
    readiness_label: readiness,
    metric_ids: knownMetrics.join('|'),
    missing_fields: missing.join('|'),
    claim_limit: 'Prototype readiness only; not a user session, not comprehension proof, not H4/H6 success evidence.'
  });
}

writeCsv(CAPTURE, capture.rows, capture.headers);
writeCsv(OUT, signoffs, [
  'capture_id',
  'segment_id',
  'segment_name',
  'screen_id',
  'screen_name',
  'readiness_label',
  'metric_ids',
  'missing_fields',
  'claim_limit'
]);

const readyRows = signoffs.filter(row => row.readiness_label === 'ready_for_user_session_capture').length;
const lines = [];
lines.push('# Prototype Readiness Signoff V1');
lines.push('');
lines.push(`Generated: ${new Date().toISOString()}`);
lines.push('');
lines.push('## Purpose');
lines.push('');
lines.push('This artifact reviews the prototype stimulus and scorecard before real user sessions. It fills the first prototype capture slots as readiness evidence only. It does not count as H4/H6 success because no participant behavior, paraphrase, comprehension, preference, or safety objection has been observed.');
lines.push('');
lines.push('## Gate Read');
lines.push('');
lines.push(`- Readiness rows filled: ${signoffs.length}.`);
lines.push(`- Ready for user-session capture: ${readyRows}.`);
lines.push('- H4/H6 should move to in-progress/partial readiness evidence, but success must remain 0 until real prototype sessions are run.');
lines.push('');
lines.push('## Signoff Rows');
lines.push('');
lines.push(mdTable(signoffs, [
  { key: 'capture_id', label: 'Capture' },
  { key: 'segment_id', label: 'Segment' },
  { key: 'screen_id', label: 'Screen' },
  { key: 'readiness_label', label: 'Readiness' },
  { key: 'metric_ids', label: 'Metrics' },
  { key: 'missing_fields', label: 'Missing' },
  { key: 'claim_limit', label: 'Claim Limit' }
]));
lines.push('');
lines.push('## Files');
lines.push('');
lines.push(`- \`${OUT}\``);
lines.push(`- \`${CAPTURE}\``);
lines.push(`- \`${STIMULUS}\``);
lines.push(`- \`${SCORECARD}\``);

fs.writeFileSync(DOC, `${lines.join('\n')}\n`);

console.log(`prototype_readiness_signoff=${OUT}`);
console.log(`doc=${DOC}`);
console.log(`signoff_rows=${signoffs.length}`);
console.log(`ready_rows=${readyRows}`);
