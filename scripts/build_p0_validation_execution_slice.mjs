import fs from 'fs';

const OUT = 'data_processed/p0_validation_execution_slice.csv';
const DOC = 'docs/decision/p0-validation-execution-slice-v1.md';

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

function first(value) {
  return clean(value).split(';').map(clean).find(Boolean) || '';
}

function gateImpact(row) {
  const h = clean(row.linked_hypotheses);
  if (h.includes('H1') || h.includes('H3')) return 'двигает H1/H3: directness, hidden clone risk, action -> avatar/progress causality';
  if (h.includes('H2')) return 'двигает H2: product-matched paid evidence, price/trial/paywall boundary';
  if (h.includes('H5')) return 'двигает H5/H6: recent behavior, workaround, language, WTP, loop comprehension';
  if (h.includes('H4')) return 'двигает H4/H6: comprehension, differentiation, trust, return intent';
  return 'двигает открытый validation gate';
}

function blockFor(row) {
  const lane = clean(row.lane);
  if (lane === 'manual_competitor_walkthrough') return 'BLOCK_01_hidden_clone';
  if (lane === 'paid_flow_validation') return 'BLOCK_02_paid_flow';
  if (lane === 'icp_interviews') return 'BLOCK_03_icp_recent_behavior';
  if (lane === 'prototype_user_validation' || lane === 'prototype_scorecard_gate') return 'BLOCK_04_prototype_loop';
  return 'BLOCK_05_support';
}

function timebox(row) {
  const lane = clean(row.lane);
  if (lane === 'manual_competitor_walkthrough') return '25-35 min';
  if (lane === 'paid_flow_validation') return '10-15 min';
  if (lane === 'icp_interviews') return '20-30 min';
  if (lane === 'prototype_user_validation') return '10-15 min';
  if (lane === 'prototype_scorecard_gate') return '5-10 min after sessions';
  return '10-20 min';
}

function blockRu(block) {
  return ({
    BLOCK_01_hidden_clone: 'Сначала hidden-clone walkthrough',
    BLOCK_02_paid_flow: 'Потом paid-flow/WTP evidence',
    BLOCK_03_icp_recent_behavior: 'Затем ICP recent behavior',
    BLOCK_04_prototype_loop: 'После этого prototype loop',
    BLOCK_05_support: 'Поддерживающие задачи'
  })[block] || block;
}

const backlog = csv('data_processed/global_next_validation_backlog.csv');
const gates = csv('data_processed/global_hypothesis_gate_snapshot.csv');
const gateById = new Map(gates.map(row => [row.hypothesis_id, row]));

function pick(lane, limit) {
  return backlog
    .filter(row => row.lane === lane)
    .slice(0, limit);
}

const selected = [
  ...pick('manual_competitor_walkthrough', 5),
  ...pick('paid_flow_validation', 5),
  ...pick('icp_interviews', 4),
  ...pick('prototype_user_validation', 2),
  ...pick('prototype_scorecard_gate', 2)
];

const rows = selected.map((row, index) => {
  const primaryHypothesis = clean(row.linked_hypotheses).split('|')[0];
  const gate = gateById.get(primaryHypothesis) || {};
  const block = blockFor(row);
  return {
    slice_rank: String(index + 1),
    execution_block: block,
    execution_block_ru: blockRu(block),
    command_id: row.command_id,
    target: row.target,
    linked_hypotheses: row.linked_hypotheses,
    current_gate_status_ru: gate.gate_status_ru || row.gate_status_ru || '',
    timebox_ru: timebox(row),
    why_first_ru: row.why_now_ru,
    operator_action_ru: row.operator_action_ru,
    minimum_evidence_ru: row.evidence_to_capture_ru,
    pass_signal_ru: row.pass_signal_ru,
    downgrade_signal_ru: row.downgrade_signal_ru,
    gate_impact_ru: gateImpact(row),
    source_file: row.source_file,
    output_file_to_update: first(row.output_file_to_update || row.source_file),
    report_update_rule_ru: 'после заполнения observed rows пересобрать validation gates, global report, PDF/DOCX, manifest и git commit/push',
    source_url: row.source_url
  };
});

writeCsv(OUT, rows, [
  'slice_rank',
  'execution_block',
  'execution_block_ru',
  'command_id',
  'target',
  'linked_hypotheses',
  'current_gate_status_ru',
  'timebox_ru',
  'why_first_ru',
  'operator_action_ru',
  'minimum_evidence_ru',
  'pass_signal_ru',
  'downgrade_signal_ru',
  'gate_impact_ru',
  'source_file',
  'output_file_to_update',
  'report_update_rule_ru',
  'source_url'
]);

const lines = [];
lines.push('# P0 Validation Execution Slice V1');
lines.push('');
lines.push(`Generated: ${new Date().toISOString().slice(0, 10)}`);
lines.push('');
lines.push('## Зачем нужен этот слой');
lines.push('');
lines.push('Этот слой превращает большую P0 очередь в исполнимую рабочую сессию. Он отвечает на вопрос: что делать первым, какой gate это двигает, какой минимум evidence нужно зафиксировать и когда можно апгрейдить или ослаблять claim. Это не новое доказательство, а маршрут к observed evidence.');
lines.push('');
lines.push('## Порядок');
lines.push('');
lines.push('1. Сначала закрыть hidden-clone риск через первые 5 manual walkthrough: без этого H1/H3 нельзя усиливать.');
lines.push('2. Потом добрать paid-flow signoff: H2 не должен опираться только на market size и proxy.');
lines.push('3. Затем провести P0 ICP recent-behavior вопросы: H5 требует реального поведения, а не демографии.');
lines.push('4. После этого запускать prototype loop: H4/H6 зависят от понимания причинности action -> progress/avatar.');
lines.push('');
lines.push('## Execution Slice');
lines.push('');
lines.push(mdTable(rows, [
  { key: 'slice_rank', label: '#' },
  { key: 'execution_block_ru', label: 'Блок' },
  { key: 'command_id', label: 'ID' },
  { key: 'target', label: 'Что проверяем' },
  { key: 'linked_hypotheses', label: 'H' },
  { key: 'timebox_ru', label: 'Timebox' },
  { key: 'operator_action_ru', label: 'Действие' },
  { key: 'gate_impact_ru', label: 'Что сдвигает' },
  { key: 'output_file_to_update', label: 'Куда писать' }
]));
lines.push('');
lines.push('## Правило апдейта');
lines.push('');
lines.push('После каждой заполненной пачки observed rows нужно обновить capture sheets, пересчитать validation gates, пересобрать основной отчет/PDF/DOCX, затем обновить manifest и сделать commit/push. До этого все строки в этом slice являются задачами, а не доказанными claims.');
lines.push('');
lines.push('## Files');
lines.push('');
lines.push(`- \`${OUT}\``);
lines.push('- `data_processed/global_next_validation_backlog.csv`');
lines.push('- `data_processed/p0_validation_command_center.csv`');

fs.writeFileSync(DOC, `${lines.join('\n')}\n`);

console.log(`p0_validation_execution_slice=${OUT}`);
console.log(`doc=${DOC}`);
console.log(`rows=${rows.length}`);
