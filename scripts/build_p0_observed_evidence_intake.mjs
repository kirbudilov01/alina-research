import fs from 'fs';

const OUT = 'data_processed/p0_observed_evidence_intake.csv';
const DOC = 'docs/decision/p0-observed-evidence-intake-v1.md';

for (const dir of ['data_processed', 'docs/decision']) fs.mkdirSync(dir, { recursive: true });

function parseCsv(text) {
  const rows = [];
  let row = [];
  let cell = '';
  let quoted = false;
  for (let i = 0; i < text.length; i += 1) {
    const c = text[i];
    const n = text[i + 1];
    if (quoted) {
      if (c === '"' && n === '"') {
        cell += '"';
        i += 1;
      } else if (c === '"') {
        quoted = false;
      } else {
        cell += c;
      }
    } else if (c === '"') {
      quoted = true;
    } else if (c === ',') {
      row.push(cell);
      cell = '';
    } else if (c === '\n') {
      row.push(cell);
      rows.push(row);
      row = [];
      cell = '';
    } else if (c !== '\r') {
      cell += c;
    }
  }
  if (cell || row.length) {
    row.push(cell);
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
  fs.writeFileSync(file, `${[headers.join(','), ...rows.map(row => headers.map(h => csvEscape(row[h])).join(','))].join('\n')}\n`);
}

function mdTable(rows, columns, limit = rows.length) {
  const visible = rows.slice(0, limit);
  const header = `| ${columns.map(c => c.label).join(' | ')} |`;
  const sep = `| ${columns.map(c => c.align === 'right' ? '---:' : '---').join(' | ')} |`;
  const body = visible.map(row => `| ${columns.map(c => clean(row[c.key]).replace(/\|/g, '<br>')).join(' | ')} |`);
  return [header, sep, ...body].join('\n');
}

function normalize(value) {
  return clean(value)
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function ids(rows, field = 'capture_id') {
  return rows.map(row => row[field]).filter(Boolean).join('|');
}

function statuses(rows) {
  const counts = {};
  for (const row of rows) {
    const status = clean(row.capture_status || row.status || row.metric_id || 'unknown');
    counts[status] = (counts[status] || 0) + 1;
  }
  return Object.entries(counts).map(([key, value]) => `${key}:${value}`).join('|');
}

function requiredFiles(rows) {
  return rows.map(row => row.required_filename_stub).filter(Boolean).join('|');
}

function questionSample(rows) {
  return rows.map(row => clean(row.capture_question || row.prompt_to_run || row.screen_name || row.metric_id)).filter(Boolean).slice(0, 3).join(' || ');
}

function matchByTarget(rows, target, limit = rows.length) {
  const targetNorm = normalize(target);
  return rows
    .filter(row => {
      const name = normalize(row.app_name || row.target || row.segment_name || '');
      return name && (name === targetNorm || targetNorm.includes(name) || name.includes(targetNorm.split(' ')[0]));
    })
    .slice(0, limit);
}

function icpTestId(commandId) {
  const match = commandId.match(/P0_ICP_(ICP_[A-Z]_T\d+)/);
  return match ? match[1] : '';
}

function prototypeRoute(commandId) {
  const match = commandId.match(/P0_PROTO_(ICP_[A-Z])_(.+)$/);
  return match ? { segment_id: match[1], screen_id: match[2] } : {};
}

function scoreMetric(commandId) {
  const match = commandId.match(/P0_SCORE_(PVS_M\d+)/);
  return match ? match[1] : '';
}

const p0Slice = csv('data_processed/p0_validation_execution_slice.csv');
const manualCapture = csv('data_processed/manual_walkthrough_capture_sheet.csv');
const paidCapture = csv('data_processed/paid_flow_capture_sheet.csv');
const icpCapture = csv('data_processed/icp_interview_capture_sheet.csv');
const prototypeCapture = csv('data_processed/prototype_session_capture_sheet.csv');
const scorecard = csv('data_processed/prototype_validation_scorecard.csv');

function route(row) {
  const commandId = clean(row.command_id);
  if (commandId.startsWith('P0_MANUAL_')) {
    const captureRows = matchByTarget(manualCapture, row.target, 5);
    return {
      source_capture_file: 'data_processed/manual_walkthrough_capture_sheet.csv',
      linked_capture_ids: ids(captureRows),
      linked_capture_status_mix: statuses(captureRows),
      required_local_artifacts: requiredFiles(captureRows),
      fields_to_fill_ru: 'capture_status; observed_answer; directness_label; action_to_avatar_causality_label; paywall_boundary_label; inspector_notes; screenshot file paths',
      first_operator_prompt_ru: questionSample(captureRows),
      rows_to_update_count: captureRows.length,
      intake_gap_ru: captureRows.some(item => item.capture_status === 'not_started')
        ? 'есть незаполненные app/onboarding walkthrough слоты'
        : 'public listing signoff есть, но проверить, не остались ли app walkthrough поля пустыми'
    };
  }
  if (commandId.startsWith('P0_PAYWALL_')) {
    const captureRows = matchByTarget(paidCapture, row.target, 4);
    return {
      source_capture_file: 'data_processed/paid_flow_capture_sheet.csv',
      linked_capture_ids: ids(captureRows),
      linked_capture_status_mix: statuses(captureRows),
      required_local_artifacts: requiredFiles(captureRows),
      fields_to_fill_ru: 'capture_status; observed_price_or_trial; paid_flow_label; product_match_label; human_notes; screenshot/source path',
      first_operator_prompt_ru: questionSample(captureRows),
      rows_to_update_count: captureRows.length,
      intake_gap_ru: captureRows.some(item => item.capture_status === 'not_started')
        ? 'paid-flow rows еще не заполнены человеком'
        : 'есть local/public signoff; остается проверить first-value boundary и WTP'
    };
  }
  if (commandId.startsWith('P0_ICP_')) {
    const testId = icpTestId(commandId);
    const captureRows = icpCapture.filter(item => item.test_id === testId).slice(0, 2);
    return {
      source_capture_file: 'data_processed/icp_interview_capture_sheet.csv',
      linked_capture_ids: ids(captureRows),
      linked_capture_status_mix: statuses(captureRows),
      required_local_artifacts: '',
      fields_to_fill_ru: 'capture_status; observed_answer_or_score; success_flag; fatal_objection_flag; exact_quote; researcher_notes',
      first_operator_prompt_ru: questionSample(captureRows),
      rows_to_update_count: captureRows.length,
      intake_gap_ru: 'нужны реальные participant answers; secondary VOC не апгрейдит H5/H6'
    };
  }
  if (commandId.startsWith('P0_PROTO_')) {
    const { segment_id: segmentId, screen_id: screenId } = prototypeRoute(commandId);
    const captureRows = prototypeCapture
      .filter(item => item.segment_id === segmentId && item.screen_id === screenId)
      .slice(0, 2);
    return {
      source_capture_file: 'data_processed/prototype_session_capture_sheet.csv',
      linked_capture_ids: ids(captureRows),
      linked_capture_status_mix: statuses(captureRows),
      required_local_artifacts: '',
      fields_to_fill_ru: 'capture_status; observed_behavior; participant_paraphrase; success_signal_seen; failure_signal_seen; researcher_notes',
      first_operator_prompt_ru: questionSample(captureRows),
      rows_to_update_count: captureRows.length,
      intake_gap_ru: 'нужна реальная prototype session; readiness signoff не апгрейдит H4/H6'
    };
  }
  if (commandId.startsWith('P0_SCORE_')) {
    const metricId = scoreMetric(commandId);
    const metric = scorecard.find(item => item.metric_id === metricId);
    return {
      source_capture_file: 'data_processed/prototype_validation_scorecard.csv',
      linked_capture_ids: metricId,
      linked_capture_status_mix: metric ? 'metric_defined:1' : 'missing_metric:1',
      required_local_artifacts: '',
      fields_to_fill_ru: 'observed metric value; pass/hold/kill interpretation; participant count; notes linking back to prototype_session_capture_sheet.csv',
      first_operator_prompt_ru: metric ? `${metric.gate}: success ${metric.success_threshold}; kill ${metric.kill_threshold}` : '',
      rows_to_update_count: metric ? 1 : 0,
      intake_gap_ru: 'считать только после prototype sessions, не до них'
    };
  }
  return {
    source_capture_file: row.output_file_to_update,
    linked_capture_ids: '',
    linked_capture_status_mix: 'unrouted',
    required_local_artifacts: '',
    fields_to_fill_ru: '',
    first_operator_prompt_ru: '',
    rows_to_update_count: 0,
    intake_gap_ru: 'route missing'
  };
}

const intakeRows = p0Slice.map(row => {
  const routed = route(row);
  return {
    slice_rank: row.slice_rank,
    command_id: row.command_id,
    execution_block_ru: row.execution_block_ru,
    target: row.target,
    linked_hypotheses: row.linked_hypotheses,
    timebox_ru: row.timebox_ru,
    source_capture_file: routed.source_capture_file,
    rows_to_update_count: routed.rows_to_update_count,
    linked_capture_ids: routed.linked_capture_ids,
    linked_capture_status_mix: routed.linked_capture_status_mix,
    required_local_artifacts: routed.required_local_artifacts,
    fields_to_fill_ru: routed.fields_to_fill_ru,
    first_operator_prompt_ru: routed.first_operator_prompt_ru,
    minimum_evidence_ru: row.minimum_evidence_ru,
    pass_signal_ru: row.pass_signal_ru,
    downgrade_signal_ru: row.downgrade_signal_ru,
    intake_gap_ru: routed.intake_gap_ru,
    rebuild_rule_ru: 'после заполнения source capture rows пересобрать validation gates, reports/PDF/DOCX, manifest и сделать commit/push',
    claim_boundary_ru: 'intake routing не является observed evidence и не апгрейдит H1-H6 без заполненных capture rows',
    source_url: row.source_url
  };
});

writeCsv(OUT, intakeRows, [
  'slice_rank',
  'command_id',
  'execution_block_ru',
  'target',
  'linked_hypotheses',
  'timebox_ru',
  'source_capture_file',
  'rows_to_update_count',
  'linked_capture_ids',
  'linked_capture_status_mix',
  'required_local_artifacts',
  'fields_to_fill_ru',
  'first_operator_prompt_ru',
  'minimum_evidence_ru',
  'pass_signal_ru',
  'downgrade_signal_ru',
  'intake_gap_ru',
  'rebuild_rule_ru',
  'claim_boundary_ru',
  'source_url'
]);

const totalRowsToUpdate = intakeRows.reduce((sum, row) => sum + Number(row.rows_to_update_count || 0), 0);
const routedRows = intakeRows.filter(row => row.linked_capture_ids).length;
const missingCaptureRoutes = intakeRows.length - routedRows;
const manualRows = intakeRows.filter(row => row.source_capture_file.includes('manual_walkthrough')).length;
const paidRows = intakeRows.filter(row => row.source_capture_file.includes('paid_flow')).length;
const icpRows = intakeRows.filter(row => row.source_capture_file.includes('icp_interview')).length;
const prototypeRows = intakeRows.filter(row => row.source_capture_file.includes('prototype_session') || row.source_capture_file.includes('prototype_validation_scorecard')).length;

const lines = [];
lines.push('# P0 Observed Evidence Intake V1');
lines.push('');
lines.push(`Generated: ${new Date().toISOString().slice(0, 10)}`);
lines.push('');
lines.push('## Зачем нужен этот слой');
lines.push('');
lines.push('P0 execution slice показывает, что делать первым. Этот intake layer добавляет недостающий мост: какие именно source capture rows открыть, какие поля заполнить, какие локальные артефакты сохранить и какой rebuild сделать после observed evidence. Это не доказательство, а операторский вход в доказательство.');
lines.push('');
lines.push('## Короткий статус');
lines.push('');
lines.push(`- P0 задач: ${intakeRows.length}`);
lines.push(`- Задач с привязанными capture IDs: ${routedRows}`);
lines.push(`- Задач, где нужно сначала создать/добавить source capture row: ${missingCaptureRoutes}`);
lines.push(`- Source rows to update в первой сессии: ${totalRowsToUpdate}`);
lines.push(`- Manual walkthrough задач: ${manualRows}`);
lines.push(`- Paid-flow задач: ${paidRows}`);
lines.push(`- ICP interview задач: ${icpRows}`);
lines.push(`- Prototype/scorecard задач: ${prototypeRows}`);
lines.push('');
lines.push('## Intake Table');
lines.push('');
lines.push(mdTable(intakeRows.map(row => ({
  rank: row.slice_rank,
  id: row.command_id,
  target: row.target,
  h: row.linked_hypotheses,
  file: row.source_capture_file,
  ids: row.linked_capture_ids,
  fields: row.fields_to_fill_ru,
  gap: row.intake_gap_ru
})), [
  { key: 'rank', label: '#' },
  { key: 'id', label: 'P0 ID' },
  { key: 'target', label: 'Что проверяем' },
  { key: 'h', label: 'H' },
  { key: 'file', label: 'Source capture file' },
  { key: 'ids', label: 'Capture IDs' },
  { key: 'fields', label: 'Поля' },
  { key: 'gap', label: 'Что еще не доказано' }
]));
lines.push('');
lines.push('## Правило обновления');
lines.push('');
lines.push('После заполнения любой intake-строки нельзя вручную переписать выводы в отчете. Сначала нужно обновить исходный capture sheet, затем пересчитать validation gates, completion audit, full report, reader/executive PDF, manifest, и только потом делать commit/push. Если evidence противоречит прежнему desk claim, claim ослабляется.');
lines.push('');
lines.push('## Files');
lines.push('');
lines.push(`- \`${OUT}\``);
lines.push('- `data_processed/p0_validation_execution_slice.csv`');
lines.push('- `data_processed/manual_walkthrough_capture_sheet.csv`');
lines.push('- `data_processed/paid_flow_capture_sheet.csv`');
lines.push('- `data_processed/icp_interview_capture_sheet.csv`');
lines.push('- `data_processed/prototype_session_capture_sheet.csv`');
lines.push('- `data_processed/prototype_validation_scorecard.csv`');

fs.writeFileSync(DOC, `${lines.join('\n')}\n`);

console.log(`p0_observed_evidence_intake=${OUT}`);
console.log(`doc=${DOC}`);
console.log(`rows=${intakeRows.length}`);
console.log(`routed_rows=${routedRows}`);
console.log(`source_rows_to_update=${totalRowsToUpdate}`);
