import fs from 'fs';

const OUT = 'data_processed/russian_validation_gate_cards.csv';
const DOC = 'docs/decision/russian-validation-gate-cards-v1.md';

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

function ruWorkstream(workstream) {
  const map = {
    manual_competitor_walkthrough: 'ручной walkthrough конкурентов',
    paid_flow_validation: 'ручная проверка paywall/paid-flow',
    icp_interviews: 'интервью ICP и проверка recent behavior',
    prototype_user_validation: 'прототипные сессии и scorecard'
  };
  return map[workstream] || workstream;
}

function ruWhyBlocked(gate, hypothesis) {
  const blocker = clean(gate.current_blocker);
  const gap = clean(hypothesis.key_gap);
  return `${blocker || 'Нет наблюдаемого evidence.'} ${gap || ''}`.trim();
}

function ruOperatorMove(gate, tasks) {
  const exact = tasks.map(row => clean(row.exact_evidence_to_capture)).filter(Boolean).join(' | ');
  if (exact) return exact;
  return clean(gate.next_action);
}

function linkedTasks(gate, tasks) {
  const workstreamTasks = tasks.filter(row => row.workstream === gate.workstream || row.task.includes(gate.linked_hypotheses));
  return workstreamTasks
    .slice()
    .sort((a, b) => Number(a.execution_rank || 0) - Number(b.execution_rank || 0))
    .map(row => `${row.execution_rank}:${row.task}`)
    .join(' | ');
}

const gates = csv('data_processed/validation_gate_calculator.csv');
const hypotheses = csv('data_processed/hypothesis_decision_matrix.csv');
const execution = csv('data_processed/validation_execution_dashboard.csv');

const rows = gates
  .slice()
  .sort((a, b) => a.linked_hypotheses.localeCompare(b.linked_hypotheses))
  .map(gate => {
    const hypothesis = hypotheses.find(row => row.hypothesis_id === gate.linked_hypotheses) || {};
    const tasks = execution.filter(row => row.workstream === gate.workstream || clean(row.task).includes(gate.linked_hypotheses));
    return {
      gate_id: gate.gate_id,
      hypothesis_id: gate.linked_hypotheses,
      hypothesis_ru: hypothesis.hypothesis || gate.linked_hypotheses,
      current_decision: hypothesis.current_decision || gate.current_decision_effect,
      evidence_status: hypothesis.evidence_status || gate.evidence_state,
      confidence: hypothesis.confidence || '',
      workstream_ru: ruWorkstream(gate.workstream),
      gate_status: gate.gate_status,
      required_capture_rows: gate.required_capture_rows,
      completed_rows: gate.completed_rows,
      success_rows: gate.success_rows,
      min_completed_threshold: gate.min_completed_threshold,
      min_success_threshold: gate.min_success_threshold,
      max_fail_threshold: gate.max_fail_threshold,
      strongest_support_ru: hypothesis.strongest_support || '',
      why_not_upgrade_ru: ruWhyBlocked(gate, hypothesis),
      exact_evidence_to_collect_ru: ruOperatorMove(gate, tasks),
      go_rule_ru: gate.success_gate || hypothesis.go_gate,
      kill_or_downgrade_rule_ru: gate.kill_or_downgrade_gate || hypothesis.kill_gate,
      next_action_ru: gate.next_action || hypothesis.next_action,
      linked_execution_tasks: linkedTasks(gate, execution),
      source_files: gate.source_files || hypothesis.evidence_files,
      output_file_to_update: gate.output_file_to_update || '',
      claim_boundary_ru: 'Пока completed_rows и success_rows равны нулю, gate нельзя считать закрытым; claim остается hold_validate независимо от объема desk research.'
    };
  });

const headers = [
  'gate_id', 'hypothesis_id', 'hypothesis_ru', 'current_decision', 'evidence_status',
  'confidence', 'workstream_ru', 'gate_status', 'required_capture_rows', 'completed_rows',
  'success_rows', 'min_completed_threshold', 'min_success_threshold', 'max_fail_threshold',
  'strongest_support_ru', 'why_not_upgrade_ru', 'exact_evidence_to_collect_ru',
  'go_rule_ru', 'kill_or_downgrade_rule_ru', 'next_action_ru', 'linked_execution_tasks',
  'source_files', 'output_file_to_update', 'claim_boundary_ru'
];

writeCsv(OUT, rows, headers);

const lines = [];
lines.push('# Русские карточки validation gates V1');
lines.push('');
lines.push(`Собрано: ${new Date().toISOString()}`);
lines.push('');
lines.push('## Зачем нужен этот файл');
lines.push('');
lines.push('Этот слой превращает H1-H6 из набора технических статусов в операторские карточки решения. Для каждой гипотезы указано, что уже поддерживает claim, почему claim нельзя апгрейдить сейчас, какой evidence надо собрать руками, какой критерий даст GO и какой результат заставит downgradе/kill.');
lines.push('');
lines.push('Ключевой принцип: desk research может подготовить gate, но не закрыть его. Пока capture rows не заполнены наблюдаемым evidence, статус остается hold_validate.');
lines.push('');
lines.push('## Сводка');
lines.push('');
lines.push(mdTable(rows, [
  { key: 'hypothesis_id', label: 'H' },
  { key: 'hypothesis_ru', label: 'Гипотеза' },
  { key: 'workstream_ru', label: 'Workstream' },
  { key: 'gate_status', label: 'Gate status' },
  { key: 'required_capture_rows', label: 'Required', align: 'right' },
  { key: 'completed_rows', label: 'Completed', align: 'right' },
  { key: 'min_success_threshold', label: 'Success min', align: 'right' }
], rows.length));
lines.push('');
for (const row of rows) {
  lines.push(`## ${row.hypothesis_id}. ${row.hypothesis_ru}`);
  lines.push('');
  lines.push(`**Текущий статус:** ${row.current_decision}; evidence: ${row.evidence_status}; confidence: ${row.confidence || 'n/a'}.`);
  lines.push('');
  lines.push(`**Что уже поддерживает гипотезу:** ${row.strongest_support_ru || 'n/a'}`);
  lines.push('');
  lines.push(`**Почему нельзя апгрейдить:** ${row.why_not_upgrade_ru}`);
  lines.push('');
  lines.push(`**Что собрать руками:** ${row.exact_evidence_to_collect_ru}`);
  lines.push('');
  lines.push(`**GO rule:** ${row.go_rule_ru}`);
  lines.push('');
  lines.push(`**Kill/downgrade rule:** ${row.kill_or_downgrade_rule_ru}`);
  lines.push('');
  lines.push(`**Следующее действие:** ${row.next_action_ru}`);
  lines.push('');
  lines.push(`**Связанные execution tasks:** ${row.linked_execution_tasks || 'n/a'}`);
  lines.push('');
  lines.push(`**Граница claim:** ${row.claim_boundary_ru}`);
  lines.push('');
}
lines.push('## Файлы');
lines.push('');
lines.push(`- \`${OUT}\``);
lines.push(`- \`${DOC}\``);
lines.push('- `data_processed/validation_gate_calculator.csv`');
lines.push('- `data_processed/hypothesis_decision_matrix.csv`');
lines.push('- `data_processed/validation_execution_dashboard.csv`');

fs.writeFileSync(DOC, `${lines.join('\n')}\n`);

console.log(`russian_validation_gate_cards_rows=${rows.length}`);
console.log(`doc=${DOC}`);
