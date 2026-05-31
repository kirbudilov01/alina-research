import fs from 'fs';

const OUT = 'data_processed/russian_p0_execution_packet.csv';
const DOC = 'docs/decision/russian-p0-execution-packet-v1.md';

for (const dir of ['data_processed', 'docs/decision']) fs.mkdirSync(dir, { recursive: true });

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

function mdTable(rows, columns, limit = rows.length) {
  const limited = rows.slice(0, limit);
  const header = `| ${columns.map(c => c.label).join(' | ')} |`;
  const sep = `| ${columns.map(c => c.align === 'right' ? '---:' : '---').join(' | ')} |`;
  const body = limited.map(row => `| ${columns.map(c => clean(row[c.key]).replace(/\|/g, '/')).join(' | ')} |`);
  return [header, sep, ...body].join('\n');
}

function taskSummary(tasks, limit = 5) {
  return tasks
    .slice()
    .sort((a, b) => Number(a.sequence || a.execution_rank || 0) - Number(b.sequence || b.execution_rank || 0))
    .slice(0, limit)
    .map(row => `${row.command_id || row.execution_rank}: ${row.target || row.task}`)
    .join(' | ');
}

function nextDeskAction(tranche) {
  if (tranche.tranche_id === 'TRANCHE_01_HIDDEN_CLONE_SPIKE') return 'Открыть Shepherd первым и заполнить 5 walkthrough slots до любых расширений.';
  if (tranche.tranche_id === 'TRANCHE_02_MANUAL_TOP5') return 'После Shepherd закрыть top-5 конкурентов одинаковой рубрикой, чтобы H1/H3 получили сопоставимый evidence.';
  if (tranche.tranche_id === 'TRANCHE_03_PAID_CONFIRMED_SPIKE') return 'Проверить только product-matched paid surfaces; не усиливать H2 по parent/OCR/noise pages.';
  if (tranche.tranche_id === 'TRANCHE_04_ICP_PILOT') return 'Провести по 2 участника в ICP_A и ICP_D, записывая recent behavior и exact language.';
  if (tranche.tranche_id === 'TRANCHE_05_PROTOTYPE_PILOT') return 'Показать 8 экранов петли и особенно проверить S06 action -> avatar/progress causality.';
  if (tranche.tranche_id === 'TRANCHE_06_REDDIT_TOP25_LANGUAGE') return 'Прочитать top-25 тредов как словарь проблем, не как количественное доказательство спроса.';
  return tranche.operator_goal_ru || 'Выполнить tranche только после предыдущих P0 checks.';
}

const tranches = csv('data_processed/validation_tranche_planner.csv');
const briefings = csv('data_processed/validation_tranche_briefing_index.csv');
const commands = csv('data_processed/p0_validation_command_center.csv');
const gates = csv('data_processed/russian_validation_gate_cards.csv');

const rows = tranches
  .filter(row => /^TRANCHE_0[1-6]_/.test(row.tranche_id))
  .sort((a, b) => Number(a.sequence || 0) - Number(b.sequence || 0))
  .map(tranche => {
    const briefing = briefings.find(row => row.tranche_id === tranche.tranche_id) || {};
    const linkedGateIds = clean(tranche.linked_gates).split('|').filter(Boolean);
    const linkedGateCards = gates.filter(row => linkedGateIds.includes(row.gate_id));
    const trancheCommands = commands.filter(row => {
      if (!clean(row.linked_hypotheses)) return false;
      const rowHypotheses = clean(row.linked_hypotheses).split('|');
      const gateHypotheses = linkedGateCards.map(g => g.hypothesis_id);
      return rowHypotheses.some(h => gateHypotheses.includes(h)) && clean(row.lane).includes(clean(tranche.workstream_mix).split('|')[0]);
    });
    return {
      sequence: tranche.sequence,
      tranche_id: tranche.tranche_id,
      priority: tranche.priority,
      workstream_mix: tranche.workstream_mix,
      linked_gates: tranche.linked_gates,
      row_count: tranche.row_count,
      operator_minutes: briefing.operator_minutes || '',
      target_scope: tranche.target_scope,
      morning_goal_ru: tranche.operator_goal_ru,
      next_action_ru: nextDeskAction(tranche),
      evidence_to_capture_ru: tranche.evidence_to_capture_ru,
      success_threshold_ru: tranche.success_threshold_ru,
      stop_or_downgrade_rule_ru: tranche.stop_or_downgrade_rule_ru,
      briefing_path: briefing.briefing_path || '',
      command_sample_ru: taskSummary(trancheCommands.length ? trancheCommands : commands.filter(row => tranche.row_ids_sample.includes(row.command_id)), 6),
      output_files_to_update: tranche.output_files_to_update,
      rebuild_after_tranche: tranche.rebuild_after_tranche,
      claim_boundary_ru: 'Execution packet routes manual work only. Claim status changes only after capture rows are filled, generators rerun, PDF readback passes, and changes are committed.'
    };
  });

const headers = [
  'sequence', 'tranche_id', 'priority', 'workstream_mix', 'linked_gates', 'row_count',
  'operator_minutes', 'target_scope', 'morning_goal_ru', 'next_action_ru',
  'evidence_to_capture_ru', 'success_threshold_ru', 'stop_or_downgrade_rule_ru',
  'briefing_path', 'command_sample_ru', 'output_files_to_update', 'rebuild_after_tranche',
  'claim_boundary_ru'
];

writeCsv(OUT, rows, headers);

const lines = [];
lines.push('# Русский P0 execution packet V1');
lines.push('');
lines.push(`Собрано: ${new Date().toISOString()}`);
lines.push('');
lines.push('## Зачем нужен этот файл');
lines.push('');
lines.push('Этот packet превращает validation OS в утренний порядок действий. Он не добавляет новых claims и не закрывает H1-H6. Его задача - показать, в какой последовательности выполнять ручную работу, какие evidence fields заполнять, где остановиться, что пересобрать и какие файлы обновить после наблюдаемого результата.');
lines.push('');
lines.push('Главный принцип: сначала опасные blocker-spikes, потом расширение. Если ранний evidence противоречит гипотезе, отчет должен стать слабее, а не красивее.');
lines.push('');
lines.push('## P0 порядок');
lines.push('');
lines.push(mdTable(rows, [
  { key: 'sequence', label: 'Seq', align: 'right' },
  { key: 'tranche_id', label: 'Tranche' },
  { key: 'priority', label: 'Priority' },
  { key: 'target_scope', label: 'Target' },
  { key: 'row_count', label: 'Rows', align: 'right' },
  { key: 'operator_minutes', label: 'Minutes' },
  { key: 'next_action_ru', label: 'Следующее действие' }
], rows.length));
lines.push('');
for (const row of rows) {
  lines.push(`## ${row.sequence}. ${row.tranche_id}`);
  lines.push('');
  lines.push(`**Цель:** ${row.morning_goal_ru}`);
  lines.push('');
  lines.push(`**Сделать сейчас:** ${row.next_action_ru}`);
  lines.push('');
  lines.push(`**Evidence:** ${row.evidence_to_capture_ru}`);
  lines.push('');
  lines.push(`**Success:** ${row.success_threshold_ru}`);
  lines.push('');
  lines.push(`**Stop/downgrade:** ${row.stop_or_downgrade_rule_ru}`);
  lines.push('');
  lines.push(`**Briefing:** ${row.briefing_path || 'n/a'}`);
  lines.push('');
  lines.push(`**Команды/строки:** ${row.command_sample_ru || 'см. briefing и capture sheets'}`);
  lines.push('');
  lines.push(`**После tranche обновить:** ${row.output_files_to_update}. Rebuild: ${row.rebuild_after_tranche}`);
  lines.push('');
}
lines.push('## Файлы');
lines.push('');
lines.push(`- \`${OUT}\``);
lines.push(`- \`${DOC}\``);
lines.push('- `data_processed/validation_tranche_planner.csv`');
lines.push('- `data_processed/validation_tranche_briefing_index.csv`');
lines.push('- `data_processed/p0_validation_command_center.csv`');
lines.push('- `data_processed/russian_validation_gate_cards.csv`');

fs.writeFileSync(DOC, `${lines.join('\n')}\n`);

console.log(`russian_p0_execution_packet_rows=${rows.length}`);
console.log(`doc=${DOC}`);
