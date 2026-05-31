import fs from 'fs';

const OUT = 'data_processed/global_next_validation_backlog.csv';
const DOC = 'docs/decision/global-next-validation-backlog-v1.md';

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
  const header = rows.shift();
  if (!header) return [];
  return rows
    .filter(r => r.some(Boolean))
    .map(r => Object.fromEntries(header.map((h, i) => [h, r[i] ?? ''])));
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

function firstFile(value) {
  return clean(value).split(';').map(clean).find(Boolean) || '';
}

function short(value, limit = 180) {
  const text = clean(value);
  return text.length > limit ? `${text.slice(0, limit - 1).trim()}...` : text;
}

function laneRu(value) {
  return ({
    manual_competitor_walkthrough: 'walkthrough конкурентов',
    paid_flow_validation: 'paywall и деньги',
    icp_interviews: 'ICP интервью',
    prototype_user_validation: 'прототип',
    prototype_scorecard_gate: 'scorecard прототипа'
  })[clean(value)] || clean(value);
}

function whyNow(row) {
  const lane = clean(row.lane);
  if (lane === 'manual_competitor_walkthrough') {
    return 'сначала закрывает риск скрытого клона и проверяет H1/H3 до усиления whitespace';
  }
  if (lane === 'paid_flow_validation') {
    return 'переводит H2 из broad market money в product-matched paid evidence';
  }
  if (lane === 'icp_interviews') {
    return 'проверяет, есть ли у сегмента recent behavior, current workaround и язык боли';
  }
  if (lane === 'prototype_user_validation') {
    return 'проверяет, понимается ли причинная петля и есть ли отличие от generic alternatives';
  }
  if (lane === 'prototype_scorecard_gate') {
    return 'переводит наблюдения прототипа в измеримые pass/kill правила H4/H6';
  }
  return 'двигает открытый validation gate';
}

function operatorActionRu(row) {
  const lane = clean(row.lane);
  const target = clean(row.target);
  if (lane === 'manual_competitor_walkthrough') {
    return 'открыть listing/app, сохранить 5 слотов скриншотов, записать full-loop/directness/causality verdict';
  }
  if (lane === 'paid_flow_validation') {
    return 'проверить screenshot/source, подтвердить цену, trial, product-match и границу первого paywall';
  }
  if (lane === 'icp_interviews') {
    if (target.includes('screener')) {
      return 'спросить, какие приложения/ритуалы/дневники/коучи/avatar-tools участник использовал за 30 дней и что запустило последнее использование';
    }
    if (target.includes('problem_interview')) {
      return 'разобрать последний реальный эпизод, current workaround, эмоциональную ставку и точный язык боли';
    }
    if (target.includes('prototype_loop')) {
      return 'показать простую петлю meaning -> action -> reset -> avatar/progress -> tomorrow hook и попросить участника narrate flow';
    }
    if (target.includes('positioning_test')) {
      return 'сравнить current tool, generic habit/coach и Alina angle; записать, что участник выбрал бы первым и почему';
    }
    if (target.includes('willingness_to_pay')) {
      return 'спросить, за что участник уже платит, и проверить paid depth: richer analysis, custom rituals, history, coaching-style review';
    }
    if (target.includes('disconfirmation')) {
      return 'прямо спросить, что делает продукт unsafe, cringe, manipulative, generic или не для участника';
    }
    return short(row.next_operator_action, 220);
  }
  if (lane === 'prototype_user_validation') {
    return 'показать S01-S08 без объяснения, записать время, понимание, цитаты, trust objection и return intent';
  }
  if (lane === 'prototype_scorecard_gate') {
    return 'после сессий посчитать observed value и gate status по этой метрике';
  }
  return short(row.next_operator_action, 220);
}

const commands = csv('data_processed/p0_validation_command_center.csv');
const gates = csv('data_processed/global_hypothesis_gate_snapshot.csv');
const runway = csv('data_processed/russian_validation_runway.csv');

const gateByHypothesis = new Map(gates.map(row => [row.hypothesis_id, row]));
const laneOrder = new Map([
  ['manual_competitor_walkthrough', 1],
  ['paid_flow_validation', 2],
  ['icp_interviews', 3],
  ['prototype_user_validation', 4],
  ['prototype_scorecard_gate', 5]
]);

function take(lane, predicate, limit) {
  return commands
    .filter(row => clean(row.lane) === lane && (!predicate || predicate(row)))
    .sort((a, b) => Number(a.sequence || 0) - Number(b.sequence || 0))
    .slice(0, limit);
}

const selected = [
  ...take('manual_competitor_walkthrough', row => ['P0_blocker', 'P0'].includes(row.priority), 5),
  ...take('paid_flow_validation', row => ['P0_blocker', 'P0'].includes(row.priority), 5),
  ...take('icp_interviews', row => row.priority === 'P0', 6),
  ...take('prototype_user_validation', row => row.priority === 'P0_blocker', 2),
  ...take('prototype_scorecard_gate', row => ['P0_blocker', 'P0'].includes(row.priority), 4)
];

const rows = selected
  .map((row, index) => {
    const hypothesis = clean(row.linked_hypotheses).split('|')[0];
    const gate = gateByHypothesis.get(hypothesis) || {};
    const lane = clean(row.lane);
    const sourceFile = firstFile(row.source_files);
    const outputFile = firstFile(row.output_file_to_update);
    return {
      backlog_rank: String(index + 1),
      command_id: row.command_id,
      lane,
      lane_ru: laneRu(lane),
      target: row.target,
      linked_hypotheses: row.linked_hypotheses,
      gate_status_ru: gate.gate_status_ru || '',
      why_now_ru: whyNow(row),
      operator_action_ru: operatorActionRu(row),
      evidence_to_capture_ru: row.evidence_to_capture,
      pass_signal_ru: row.pass_gate,
      downgrade_signal_ru: row.downgrade_or_kill_gate,
      source_file: sourceFile,
      output_file_to_update: outputFile,
      report_impact_ru: `после заполнения обновить ${outputFile || 'capture sheet'}, затем пересобрать gates, отчет, PDF/DOCX и manifest`,
      capture_slot_or_metric: row.capture_slot_or_metric,
      source_url: row.source_url
    };
  })
  .sort((a, b) => {
    const laneDelta = (laneOrder.get(a.lane) || 99) - (laneOrder.get(b.lane) || 99);
    return laneDelta || Number(a.backlog_rank) - Number(b.backlog_rank);
  })
  .map((row, index) => ({ ...row, backlog_rank: String(index + 1) }));

writeCsv(OUT, rows, [
  'backlog_rank',
  'command_id',
  'lane',
  'lane_ru',
  'target',
  'linked_hypotheses',
  'gate_status_ru',
  'why_now_ru',
  'operator_action_ru',
  'evidence_to_capture_ru',
  'pass_signal_ru',
  'downgrade_signal_ru',
  'source_file',
  'output_file_to_update',
  'report_impact_ru',
  'capture_slot_or_metric',
  'source_url'
]);

const lines = [];
lines.push('# Global Next Validation Backlog V1');
lines.push('');
lines.push(`Generated: ${new Date().toISOString()}`);
lines.push('');
lines.push('## Purpose');
lines.push('');
lines.push('Этот файл переводит текущий мировой hypothesis report Alina в исполнимую очередь evidence-задач. Он намеренно уже полного command center: здесь только первые P0-задачи, которые двигают H1-H6 от desk support к observed validation.');
lines.push('');
lines.push('## Gate Context');
lines.push('');
lines.push(mdTable(gates, [
  { key: 'hypothesis_id', label: 'Hypothesis' },
  { key: 'hypothesis_ru', label: 'What' },
  { key: 'gate_status_ru', label: 'Status' },
  { key: 'completed_vs_required', label: 'Completed / Required' },
  { key: 'next_action_ru', label: 'Next action' }
]));
lines.push('');
lines.push('## Runway');
lines.push('');
lines.push(mdTable(runway, [
  { key: 'runway_order', label: '#' },
  { key: 'workstream_ru', label: 'Workstream' },
  { key: 'linked_hypotheses', label: 'Hypotheses' },
  { key: 'p0_focus_ru', label: 'P0 focus' }
]));
lines.push('');
lines.push('## P0 Backlog');
lines.push('');
lines.push(mdTable(rows, [
  { key: 'backlog_rank', label: '#' },
  { key: 'lane_ru', label: 'Lane' },
  { key: 'target', label: 'Target' },
  { key: 'linked_hypotheses', label: 'H' },
  { key: 'why_now_ru', label: 'Why now' },
  { key: 'operator_action_ru', label: 'Operator action' },
  { key: 'output_file_to_update', label: 'Update file' }
]));
lines.push('');
lines.push('## Files');
lines.push('');
lines.push(`- \`${OUT}\``);
lines.push('- `data_processed/p0_validation_command_center.csv`');
lines.push('- `data_processed/global_hypothesis_gate_snapshot.csv`');
lines.push('- `data_processed/russian_validation_runway.csv`');

fs.writeFileSync(DOC, `${lines.join('\n')}\n`);

console.log(`global_next_validation_backlog=${OUT}`);
console.log(`doc=${DOC}`);
console.log(`rows=${rows.length}`);
