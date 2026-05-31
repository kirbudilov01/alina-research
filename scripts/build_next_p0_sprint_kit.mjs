import fs from 'fs';
import path from 'path';

const CSV_OUT = 'data_processed/next_p0_sprint_kit.csv';
const DOC_OUT = 'docs/decision/next-p0-sprint-kit-v1.md';
const ROOT = 'output/validation/next_p0_sprint';

for (const dir of ['data_processed', 'docs/decision', ROOT]) fs.mkdirSync(dir, { recursive: true });

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

function mdTable(rows, columns) {
  const header = `| ${columns.map(c => c.label).join(' | ')} |`;
  const sep = `| ${columns.map(c => c.align === 'right' ? '---:' : '---').join(' | ')} |`;
  const body = rows.map(row => `| ${columns.map(c => clean(row[c.key]).replace(/\|/g, '<br>')).join(' | ')} |`);
  return [header, sep, ...body].join('\n');
}

function slug(value) {
  return clean(value).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'untitled';
}

function writeFile(file, text) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, `${text.trim()}\n`);
}

function checklistFromPipe(value) {
  const parts = clean(value).split('|').map(clean).filter(Boolean);
  return parts.length ? parts.map(part => `- [ ] ${part}`).join('\n') : '- [ ] observed evidence captured';
}

function prompts(value) {
  return clean(value)
    .split('||')
    .map(clean)
    .filter(Boolean)
    .map(item => `- ${item}`)
    .join('\n') || '- Record what was observed without upgrading claims.';
}

const intake = csv('data_processed/p0_observed_evidence_intake.csv');
const p0Slice = csv('data_processed/p0_validation_execution_slice.csv');
const gates = csv('data_processed/global_hypothesis_gate_snapshot.csv');

const rows = intake
  .slice()
  .sort((a, b) => Number(a.slice_rank || 0) - Number(b.slice_rank || 0))
  .map(row => {
    const cardFile = `${ROOT}/${String(row.slice_rank).padStart(2, '0')}__${row.command_id}__${slug(row.target)}.md`;
    const slice = p0Slice.find(item => item.command_id === row.command_id) || {};
    return {
      sprint_rank: row.slice_rank,
      command_id: row.command_id,
      execution_block_ru: row.execution_block_ru,
      target: row.target,
      linked_hypotheses: row.linked_hypotheses,
      timebox_ru: row.timebox_ru,
      source_capture_file: row.source_capture_file,
      rows_to_update_count: row.rows_to_update_count,
      linked_capture_ids: row.linked_capture_ids,
      linked_capture_status_mix: row.linked_capture_status_mix,
      card_file: cardFile,
      source_url: row.source_url,
      first_operator_prompt_ru: row.first_operator_prompt_ru,
      minimum_evidence_ru: row.minimum_evidence_ru,
      pass_signal_ru: row.pass_signal_ru,
      downgrade_signal_ru: row.downgrade_signal_ru,
      intake_gap_ru: row.intake_gap_ru,
      claim_boundary_ru: row.claim_boundary_ru,
      operator_action_ru: slice.operator_action_ru || '',
      output_file_to_update: row.source_capture_file,
      downstream_reference_file: slice.output_file_to_update || row.source_capture_file
    };
  });

writeCsv(CSV_OUT, rows, [
  'sprint_rank',
  'command_id',
  'execution_block_ru',
  'target',
  'linked_hypotheses',
  'timebox_ru',
  'source_capture_file',
  'rows_to_update_count',
  'linked_capture_ids',
  'linked_capture_status_mix',
  'card_file',
  'source_url',
  'first_operator_prompt_ru',
  'minimum_evidence_ru',
  'pass_signal_ru',
  'downgrade_signal_ru',
  'intake_gap_ru',
  'claim_boundary_ru',
  'operator_action_ru',
  'output_file_to_update',
  'downstream_reference_file'
]);

for (const row of rows) {
  writeFile(row.card_file, `
# ${row.command_id}: ${row.target}

## Что это проверяет

- Блок: ${row.execution_block_ru}
- Гипотезы: ${row.linked_hypotheses}
- Timebox: ${row.timebox_ru}
- Source URL: ${row.source_url || 'нет внешнего URL; использовать участника/прототипный стимул'}
- Capture file: \`${row.source_capture_file}\`
- Capture rows: \`${row.linked_capture_ids}\`
- Current status mix: ${row.linked_capture_status_mix}

## Действие оператора

${row.operator_action_ru || 'Провести проверку по prompt ниже и перенести результат в capture sheet.'}

## Вопросы / prompts

${prompts(row.first_operator_prompt_ru)}

## Минимальное evidence

${checklistFromPipe(row.minimum_evidence_ru)}

## Что записать в source CSV

- [ ] \`capture_status\`
- [ ] observed answer / visible text / behavior
- [ ] exact quote or screenshot/source path
- [ ] success/pass signal
- [ ] downgrade/kill signal
- [ ] researcher notes

Primary source file to update: \`${row.output_file_to_update}\`

Downstream reference file: \`${row.downstream_reference_file}\`

## Pass / Downgrade

Pass signal: ${row.pass_signal_ru}

Downgrade signal: ${row.downgrade_signal_ru}

## Boundary

${row.claim_boundary_ru}

Эта карточка не является observed evidence. Она становится доказательной только после заполнения capture rows, скриншотов, цитат, цен, session notes или scorecard values.
`);
}

const blockRows = Object.entries(rows.reduce((acc, row) => {
  acc[row.execution_block_ru] = acc[row.execution_block_ru] || { block: row.execution_block_ru, tasks: 0, rowsToUpdate: 0, hypotheses: new Set() };
  acc[row.execution_block_ru].tasks += 1;
  acc[row.execution_block_ru].rowsToUpdate += Number(row.rows_to_update_count || 0);
  for (const h of clean(row.linked_hypotheses).split('|').filter(Boolean)) acc[row.execution_block_ru].hypotheses.add(h);
  return acc;
}, {})).map(([, value]) => ({
  block: value.block,
  tasks: value.tasks,
  rowsToUpdate: value.rowsToUpdate,
  hypotheses: Array.from(value.hypotheses).join('|')
}));

const lines = [];
lines.push('# Next P0 Sprint Kit V1');
lines.push('');
lines.push(`Generated: ${new Date().toISOString()}`);
lines.push('');
lines.push('## Что это');
lines.push('');
lines.push('Это операторский набор для первой observed-validation сессии. Он берет 18 P0 задач из intake и превращает их в отдельные карточки, чтобы walkthrough, paid-flow, ICP interview и prototype session можно было провести без блуждания по большому evidence pack.');
lines.push('');
lines.push('Важно: kit не апгрейдит H1-H6. Он только снижает трение перед сбором наблюдаемого evidence. Гипотезы можно усиливать только после заполненных capture rows.');
lines.push('');
lines.push('## Sprint Summary');
lines.push('');
lines.push(`- P0 cards: ${rows.length}`);
lines.push(`- Blocks: ${blockRows.length}`);
lines.push(`- Capture rows routed: ${rows.reduce((sum, row) => sum + Number(row.rows_to_update_count || 0), 0)}`);
lines.push(`- Gates still hold: ${gates.filter(row => clean(row.current_decision) === 'hold_validate' || clean(row.decision_ru) === 'оставить hold_validate').length}/${gates.length}`);
lines.push('');
lines.push(mdTable(blockRows, [
  { key: 'block', label: 'Блок' },
  { key: 'tasks', label: 'P0 tasks', align: 'right' },
  { key: 'rowsToUpdate', label: 'Capture rows', align: 'right' },
  { key: 'hypotheses', label: 'Гипотезы' }
]));
lines.push('');
lines.push('## Карточки');
lines.push('');
lines.push(mdTable(rows.map(row => ({
  rank: row.sprint_rank,
  command: row.command_id,
  block: row.execution_block_ru,
  target: row.target,
  capture: row.source_capture_file,
  card: row.card_file
})), [
  { key: 'rank', label: '#', align: 'right' },
  { key: 'command', label: 'Command' },
  { key: 'block', label: 'Блок' },
  { key: 'target', label: 'Target' },
  { key: 'capture', label: 'Capture file' },
  { key: 'card', label: 'Card' }
]));
lines.push('');
lines.push('## Правило пересборки');
lines.push('');
lines.push('После заполнения карточек и source capture rows пересобрать validation gates, reports/PDF/DOCX, manifest и сделать commit/push. Не править финальные выводы вручную поверх старых CSV.');
lines.push('');
lines.push('## Files');
lines.push('');
lines.push(`- \`${CSV_OUT}\``);
lines.push(`- \`${ROOT}/README.md\``);
lines.push('- `data_processed/p0_observed_evidence_intake.csv`');
lines.push('- `data_processed/p0_validation_execution_slice.csv`');

const docText = `${lines.join('\n')}\n`;
fs.writeFileSync(DOC_OUT, docText);
writeFile(`${ROOT}/README.md`, docText);

console.log(`next_p0_sprint_kit=${CSV_OUT}`);
console.log(`doc=${DOC_OUT}`);
console.log(`root=${ROOT}`);
console.log(`cards=${rows.length}`);
