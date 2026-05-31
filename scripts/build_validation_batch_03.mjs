import fs from 'fs';

const OUT = 'data_processed/validation_batch_03_index.csv';
const OUT_DOC = 'docs/decision/validation-batch-03-v1.md';
const DATE = new Date().toISOString().slice(0, 10);
const ROOT = `output/validation/${DATE}`;

for (const dir of ['data_processed', 'docs/decision', ROOT]) fs.mkdirSync(dir, { recursive: true });

function clean(value) {
  return String(value ?? '').replace(/\s+/g, ' ').trim();
}

function slug(value) {
  return clean(value).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'untitled';
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

function noteFor(row) {
  const lines = [];
  lines.push(`# Validation Batch 03 Note: ${row.command_id}`);
  lines.push('');
  lines.push(`- command_id: ${row.command_id}`);
  lines.push(`- lane: ${row.lane}`);
  lines.push(`- priority: ${row.priority}`);
  lines.push(`- target: ${row.target}`);
  lines.push(`- linked_hypotheses: ${row.linked_hypotheses}`);
  lines.push(`- date: ${DATE}`);
  lines.push('- operator:');
  lines.push(`- source_url: ${row.source_url}`);
  lines.push(`- source_files: ${row.source_files}`);
  lines.push(`- output_file_to_update: ${row.output_file_to_update}`);
  lines.push('');
  lines.push('## Current Evidence Read');
  lines.push('');
  lines.push(row.current_evidence_read || 'n/a');
  lines.push('');
  lines.push('## Proof Gap');
  lines.push('');
  lines.push(row.proof_gap || 'n/a');
  lines.push('');
  lines.push('## Evidence To Capture');
  lines.push('');
  for (const item of clean(row.evidence_to_capture).split('|').filter(Boolean)) lines.push(`- ${item}`);
  lines.push('');
  lines.push('## Operator Action');
  lines.push('');
  const operatorActions = clean(row.next_operator_action).split('|').filter(Boolean);
  if (operatorActions.length > 1) {
    for (const item of operatorActions) lines.push(`- ${item}`);
  } else {
    lines.push(row.next_operator_action || 'Fill evidence according to the field guide.');
  }
  lines.push('');
  lines.push('## Gate Decision');
  lines.push('');
  lines.push(`- pass_gate: ${row.pass_gate}`);
  lines.push(`- downgrade_or_kill_gate: ${row.downgrade_or_kill_gate}`);
  lines.push('- current_status: not_started');
  lines.push('- final_verdict:');
  lines.push('');
  lines.push('## Evidence Links');
  lines.push('');
  lines.push('- screenshot_paths:');
  lines.push('- notes_paths:');
  lines.push('- participant_quote_or_visible_text:');
  lines.push('- observed_value:');
  lines.push('');
  lines.push('## Fields To Fill Back');
  lines.push('');
  for (const item of clean(row.notes_field_to_fill).split('|').filter(Boolean)) lines.push(`- ${item}:`);
  lines.push('');
  lines.push('## Downstream Update Checklist');
  lines.push('');
  lines.push('- source_csv_updated: no');
  lines.push('- hypothesis_decision_update_required: yes');
  lines.push('- evidence_audit_update_required: yes');
  lines.push('- completion_audit_update_required: yes');
  lines.push('- report_pdf_caveat_update_required: yes');
  return `${lines.join('\n')}\n`;
}

const commands = csv('data_processed/p0_validation_command_center.csv');
const workspace = csv('data_processed/validation_evidence_workspace_index.csv');
const rows = commands
  .filter(row => row.priority === 'P1_context')
  .map((row, index) => {
    const dir = `${ROOT}/${row.lane}`;
    fs.mkdirSync(dir, { recursive: true });
    const notePath = `${dir}/batch03_${String(index + 1).padStart(2, '0')}__${row.command_id}__${slug(row.target)}__notes.md`;
    fs.writeFileSync(notePath, noteFor(row));
    return {
      batch_id: 'BATCH_03',
      batch_rank: index + 1,
      command_id: row.command_id,
      priority: row.priority,
      lane: row.lane,
      target: row.target,
      linked_hypotheses: row.linked_hypotheses,
      note_path: notePath,
      source_url: row.source_url,
      pass_gate: row.pass_gate,
      downgrade_or_kill_gate: row.downgrade_or_kill_gate,
      status: 'not_started',
      workspace_dir: dir,
      output_file_to_update: row.output_file_to_update
    };
  });

writeCsv(OUT, rows, [
  'batch_id', 'batch_rank', 'command_id', 'priority', 'lane', 'target', 'linked_hypotheses',
  'note_path', 'source_url', 'pass_gate', 'downgrade_or_kill_gate', 'status', 'workspace_dir',
  'output_file_to_update'
]);

const lines = [];
lines.push('# Validation Batch 03 V1');
lines.push('');
lines.push(`Generated: ${new Date().toISOString()}`);
lines.push('');
lines.push('## Purpose');
lines.push('');
lines.push('Batch 03 pre-creates evidence notes for every P1_context command. In the current command center, these are paid-flow context checks that should not block H1-H6 decisions, but they improve monetization confidence and prevent weak public paywall signals from leaking into stronger claims.');
lines.push('');
lines.push('## Summary');
lines.push('');
lines.push(`- Batch rows: ${rows.length}`);
lines.push(`- Workspace lanes available: ${workspace.length}`);
lines.push(`- Note files created: ${rows.length}`);
lines.push(`- Batch index: \`${OUT}\``);
lines.push('');
lines.push('Rows by lane:');
lines.push('');
const byLane = rows.reduce((acc, row) => {
  acc[row.lane] = (acc[row.lane] || 0) + 1;
  return acc;
}, {});
for (const [lane, count] of Object.entries(byLane).sort((a, b) => b[1] - a[1])) {
  lines.push(`- ${lane}: ${count}`);
}
lines.push('');
lines.push('## Batch Rows');
lines.push('');
lines.push(mdTable(rows, [
  { key: 'batch_rank', label: '#', align: 'right' },
  { key: 'command_id', label: 'Command' },
  { key: 'lane', label: 'Lane' },
  { key: 'target', label: 'Target' },
  { key: 'note_path', label: 'Note Path' }
], rows.length));
lines.push('');
lines.push('## Execution Rule');
lines.push('');
lines.push('- Treat Batch 03 as context enrichment after Batch 01 blockers and Batch 02 P0 rows.');
lines.push('- Use these notes to downgrade weak paid-flow signals, confirm partial product-match pricing evidence, or keep claims conservative.');
lines.push('- Do not upgrade market-money claims from Batch 03 alone unless the evidence is product-matched and source CSVs are updated.');
lines.push('- If a signal is unrelated, login-gated, parent-company-only, or OCR noise, record a reject/weakening note.');
lines.push('');
lines.push('## Files');
lines.push('');
lines.push(`- \`${OUT}\``);
for (const row of rows) lines.push(`- \`${row.note_path}\``);

fs.writeFileSync(OUT_DOC, `${lines.join('\n')}\n`);

console.log(`batch_index=${OUT}`);
console.log(`doc=${OUT_DOC}`);
console.log(`batch_rows=${rows.length}`);
