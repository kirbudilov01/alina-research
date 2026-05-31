import fs from 'fs';

const OUT = 'data_processed/validation_evidence_rollup.csv';
const OUT_DOC = 'docs/decision/validation-evidence-rollup-v1.md';

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
  fs.writeFileSync(file, `${[headers.join(','), ...rows.map(row => headers.map(h => csvEscape(row[h])).join(','))].join('\n')}\n`);
}

function mdTable(rows, columns, limit = rows.length) {
  const limited = rows.slice(0, limit);
  const header = `| ${columns.map(c => c.label).join(' | ')} |`;
  const sep = `| ${columns.map(c => c.align === 'right' ? '---:' : '---').join(' | ')} |`;
  const body = limited.map(row => `| ${columns.map(c => clean(row[c.key]).replace(/\|/g, '<br>')).join(' | ')} |`);
  return [header, sep, ...body].join('\n');
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

function pathsExist(value) {
  const paths = clean(value).split(';').filter(Boolean);
  if (!paths.length) return 'n/a';
  return paths.every(file => fs.existsSync(file)) ? 'yes' : 'no';
}

const commands = csv('data_processed/p0_validation_command_center.csv');
const batches = [
  ...csv('data_processed/validation_batch_01_index.csv'),
  ...csv('data_processed/validation_batch_02_index.csv'),
  ...csv('data_processed/validation_batch_03_index.csv')
];
const batchByCommand = new Map(batches.map(row => [row.command_id, row]));

const rows = commands.map(command => {
  const batch = batchByCommand.get(command.command_id) || {};
  const noteExists = batch.note_path && fs.existsSync(batch.note_path) ? 'yes' : 'no';
  const linkedPathsExist = pathsExist(batch.prefilled_evidence_paths);
  let evidenceState = 'missing_batch_note';
  if (noteExists === 'yes' && batch.prefill_status === 'existing_local_artifact_linked' && linkedPathsExist === 'yes') {
    evidenceState = 'local_artifact_linked_not_signed_off';
  } else if (noteExists === 'yes') {
    evidenceState = 'note_ready_no_local_artifact';
  }
  return {
    command_id: command.command_id,
    batch_id: batch.batch_id || '',
    priority: command.priority,
    lane: command.lane,
    target: command.target,
    linked_hypotheses: command.linked_hypotheses,
    note_path: batch.note_path || '',
    note_exists: noteExists,
    prefill_status: batch.prefill_status || 'no_batch_row',
    prefilled_evidence_paths: batch.prefilled_evidence_paths || '',
    prefilled_paths_exist: linkedPathsExist,
    command_status: command.current_status,
    batch_status: batch.status || '',
    evidence_state: evidenceState,
    source_url: command.source_url,
    output_file_to_update: command.output_file_to_update
  };
});

writeCsv(OUT, rows, [
  'command_id', 'batch_id', 'priority', 'lane', 'target', 'linked_hypotheses',
  'note_path', 'note_exists', 'prefill_status', 'prefilled_evidence_paths',
  'prefilled_paths_exist', 'command_status', 'batch_status', 'evidence_state',
  'source_url', 'output_file_to_update'
]);

const localArtifactLinked = rows.filter(row => row.evidence_state === 'local_artifact_linked_not_signed_off');
const noteReady = rows.filter(row => row.evidence_state === 'note_ready_no_local_artifact');
const missing = rows.filter(row => row.evidence_state === 'missing_batch_note');

const lines = [];
lines.push('# Validation Evidence Rollup V1');
lines.push('');
lines.push(`Generated: ${new Date().toISOString()}`);
lines.push('');
lines.push('## Purpose');
lines.push('');
lines.push('This rollup audits the validation intake layer at command level. It verifies that every command has a batch note, identifies notes that already point to existing local artifacts, and keeps those links clearly below human signoff or final validation proof.');
lines.push('');
lines.push('## Summary');
lines.push('');
lines.push(`- Command rows: ${commands.length}`);
lines.push(`- Batch rows: ${batches.length}`);
lines.push(`- Note files present: ${rows.filter(row => row.note_exists === 'yes').length}`);
lines.push(`- Local artifact links present: ${localArtifactLinked.length}`);
lines.push(`- Notes ready without local artifact: ${noteReady.length}`);
lines.push(`- Missing batch notes: ${missing.length}`);
lines.push('');
lines.push('Evidence state mix:');
lines.push('');
lines.push(bulletCounts(countBy(rows, 'evidence_state')));
lines.push('');
lines.push('Rows by lane:');
lines.push('');
lines.push(bulletCounts(countBy(rows, 'lane')));
lines.push('');
lines.push('## Lane Summary');
lines.push('');
const laneRows = Object.entries(countBy(rows, 'lane')).map(([lane, total]) => {
  const laneCommands = rows.filter(row => row.lane === lane);
  return {
    lane,
    total,
    local_artifact_linked: laneCommands.filter(row => row.evidence_state === 'local_artifact_linked_not_signed_off').length,
    note_ready_no_local_artifact: laneCommands.filter(row => row.evidence_state === 'note_ready_no_local_artifact').length,
    missing_batch_note: laneCommands.filter(row => row.evidence_state === 'missing_batch_note').length
  };
});
lines.push(mdTable(laneRows, [
  { key: 'lane', label: 'Lane' },
  { key: 'total', label: 'Total', align: 'right' },
  { key: 'local_artifact_linked', label: 'Local Artifact Linked', align: 'right' },
  { key: 'note_ready_no_local_artifact', label: 'Note Ready Only', align: 'right' },
  { key: 'missing_batch_note', label: 'Missing', align: 'right' }
], laneRows.length));
lines.push('');
lines.push('## Local Artifact Links');
lines.push('');
lines.push(mdTable(localArtifactLinked, [
  { key: 'command_id', label: 'Command' },
  { key: 'batch_id', label: 'Batch' },
  { key: 'priority', label: 'Priority' },
  { key: 'target', label: 'Target' },
  { key: 'prefilled_evidence_paths', label: 'Local Artifact' }
], localArtifactLinked.length));
lines.push('');
lines.push('## Operating Rule');
lines.push('');
lines.push('- Treat `local_artifact_linked_not_signed_off` as existing local evidence only; it is not a confirmed human verdict.');
lines.push('- Upgrade or downgrade claims only after the linked note, source CSV, and relevant capture sheet agree.');
lines.push('- Keep `note_ready_no_local_artifact` rows in the validation queue until screenshots, quotes, observed values, or scorecard calculations exist.');
lines.push('');
lines.push('## Files');
lines.push('');
lines.push(`- \`${OUT}\``);
lines.push('- `data_processed/validation_batch_01_index.csv`');
lines.push('- `data_processed/validation_batch_02_index.csv`');
lines.push('- `data_processed/validation_batch_03_index.csv`');

fs.writeFileSync(OUT_DOC, `${lines.join('\n')}\n`);

console.log(`rollup=${OUT}`);
console.log(`doc=${OUT_DOC}`);
console.log(`commands=${commands.length}`);
console.log(`batch_rows=${batches.length}`);
console.log(`local_artifact_links=${localArtifactLinked.length}`);
console.log(`missing_batch_notes=${missing.length}`);
