import fs from 'fs';

const OUT = 'data_processed/validation_tranche_planner.csv';
const DOC = 'docs/decision/validation-tranche-planner-v1.md';

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
  const body = limited.map(row => `| ${columns.map(c => clean(row[c.key]).replace(/\|/g, '<br>')).join(' | ')} |`);
  return [header, sep, ...body].join('\n');
}

function ids(rows, key = 'capture_id', limit = 10) {
  return rows.slice(0, limit).map(row => row[key]).filter(Boolean).join('|');
}

function appNames(rows, limit = 5) {
  return [...new Set(rows.map(row => row.app_name).filter(Boolean))].slice(0, limit).join('|');
}

function filterRows(rows, predicate, limit) {
  const out = rows.filter(predicate);
  return Number.isFinite(limit) ? out.slice(0, limit) : out;
}

const gates = csv('data_processed/validation_gate_calculator.csv');
const manual = csv('data_processed/manual_walkthrough_capture_sheet.csv');
const paid = csv('data_processed/paid_flow_capture_sheet.csv');
const icp = csv('data_processed/icp_interview_capture_sheet.csv');
const prototype = csv('data_processed/prototype_session_capture_sheet.csv');
const reddit = csv('data_processed/reddit_manual_reading_capture_sheet.csv');
const scorecard = csv('data_processed/prototype_validation_scorecard.csv');

const shepherdManual = filterRows(manual, row => row.inspection_rank === '1', 5);
const firstFiveManual = filterRows(manual, row => Number(row.inspection_rank || 0) <= 5, 25);
const strongPaid = filterRows(paid, row => row.visual_adjudication_prefill === 'confirmed_visible_public_pricing', 8);
const partialPaid = filterRows(paid, row => row.visual_adjudication_prefill !== 'confirmed_visible_public_pricing', 16);
const icpPilot = filterRows(icp, row => ['P01', 'P02'].includes(row.participant_slot), 24);
const icpFull = filterRows(icp, row => ['P03', 'P04', 'P05', 'P06', 'P07', 'P08'].includes(row.participant_slot), 72);
const prototypePilot = filterRows(prototype, row => ['P01', 'P02'].includes(row.participant_slot), 32);
const prototypeFull = filterRows(prototype, row => ['P03', 'P04', 'P05'].includes(row.participant_slot), 48);
const redditP0Top25 = filterRows(reddit, row => row.priority_band === 'P0_read_first' && Number(row.priority_rank || 0) <= 25, 25);
const redditP0Next75 = filterRows(reddit, row => row.priority_band === 'P0_read_first' && Number(row.priority_rank || 0) > 25 && Number(row.priority_rank || 0) <= 100, 75);

const rows = [
  {
    tranche_id: 'TRANCHE_00_STOP_RULES',
    sequence: '0',
    priority: 'P0_guardrail',
    workstream_mix: 'all',
    linked_gates: gates.map(row => row.gate_id).join('|'),
    row_count: '0',
    row_ids_sample: '',
    target_scope: 'Before any field execution',
    operator_goal_ru: 'Зафиксировать, что validation tranche может не только усиливать идею, но и сузить, downgrade или kill claims.',
    evidence_to_capture_ru: 'stop/downgrade rules accepted before execution',
    success_threshold_ru: 'Каждый оператор знает: противоречащий evidence обновляет claim до следующего PDF.',
    stop_or_downgrade_rule_ru: 'Если результат показывает скрытого full-loop clone, отсутствие WTP, непонимание causality или fatal trust objection, отчет должен стать слабее.',
    output_files_to_update: 'data_processed/evidence_claim_register.csv;data_processed/hypothesis_decision_matrix.csv;reports/alina-russian-narrative-report-v1.md',
    rebuild_after_tranche: 'no_rebuild_needed_until_observed_evidence'
  },
  {
    tranche_id: 'TRANCHE_01_HIDDEN_CLONE_SPIKE',
    sequence: '1',
    priority: 'P0_blocker',
    workstream_mix: 'manual_competitor_walkthrough',
    linked_gates: 'GATE_H1_MANUAL_PRODUCT_SHAPE|GATE_H3_MANUAL_WHITESPACE',
    row_count: String(shepherdManual.length),
    row_ids_sample: ids(shepherdManual),
    target_scope: appNames(shepherdManual),
    operator_goal_ru: 'Сначала проверить самый опасный public-listing сигнал: Shepherd выглядит как потенциальный hidden direct clone, поэтому его нужно разобрать до других приложений.',
    evidence_to_capture_ru: '5 screenshots: listing, onboarding, first action, progress/avatar feedback, paywall boundary; final verdict',
    success_threshold_ru: 'Shepherd классифицирован как full loop, adjacent loop, weak adjacency, blocked или hidden direct clone.',
    stop_or_downgrade_rule_ru: 'Если Shepherd полностью владеет Alina loop с action->identity/avatar causality, H1/H3 немедленно downgrade до narrow/pivot wording.',
    output_files_to_update: 'data_processed/manual_walkthrough_capture_sheet.csv;data_processed/manual_competitor_inspection_packet.csv;data_processed/hypothesis_decision_matrix.csv',
    rebuild_after_tranche: 'build:hypothesis-decision|build:completion-audit|build:ru-report|build:ru-pdf|build:evidence-manifest'
  },
  {
    tranche_id: 'TRANCHE_02_MANUAL_TOP5',
    sequence: '2',
    priority: 'P0',
    workstream_mix: 'manual_competitor_walkthrough',
    linked_gates: 'GATE_H1_MANUAL_PRODUCT_SHAPE|GATE_H3_MANUAL_WHITESPACE',
    row_count: String(firstFiveManual.length),
    row_ids_sample: ids(firstFiveManual),
    target_scope: appNames(firstFiveManual),
    operator_goal_ru: 'Закрыть первые 5 P0 конкурентов, потому что gate требует минимум 5 приложений с полным walkthrough.',
    evidence_to_capture_ru: '25 capture rows across five apps and five slots each',
    success_threshold_ru: 'Все 25 строк имеют observed answer, directness label, causality label, paywall label и notes.',
    stop_or_downgrade_rule_ru: 'Любой full-loop competitor переводит whitespace claim в narrower/pivot language.',
    output_files_to_update: 'data_processed/manual_walkthrough_capture_sheet.csv;data_processed/manual_competitor_inspection_packet.csv;data_processed/validation_gate_calculator.csv',
    rebuild_after_tranche: 'build:validation-gate-calculator|build:hypothesis-decision|build:completion-audit|build:report-draft|build:ru-report|build:ru-pdf'
  },
  {
    tranche_id: 'TRANCHE_03_PAID_CONFIRMED_SPIKE',
    sequence: '3',
    priority: 'P0',
    workstream_mix: 'paid_flow_validation',
    linked_gates: 'GATE_H2_PAID_FLOW',
    row_count: String(strongPaid.length),
    row_ids_sample: ids(strongPaid),
    target_scope: appNames(strongPaid),
    operator_goal_ru: 'Сначала проверить подтвержденные visible pricing rows, чтобы быстро отделить real paid surfaces от proxy noise.',
    evidence_to_capture_ru: 'pricing screenshot, product match, trial/price/plan depth, first paywall boundary',
    success_threshold_ru: 'Не меньше 6/8 строк получают confirm или conservative partial с human notes.',
    stop_or_downgrade_rule_ru: 'Если confirmed rows оказываются unrelated/parent-only/OCR noise, H2 остается proxy-only и market-money wording сужается.',
    output_files_to_update: 'data_processed/paid_flow_capture_sheet.csv;data_processed/web_paywall_visual_adjudication.csv;data_processed/market_money_triangulation.csv',
    rebuild_after_tranche: 'build:completion-audit|build:report-draft|build:ru-report|build:ru-pdf|build:evidence-manifest'
  },
  {
    tranche_id: 'TRANCHE_04_ICP_PILOT',
    sequence: '4',
    priority: 'P0',
    workstream_mix: 'icp_interviews',
    linked_gates: 'GATE_H5_ICP_RECENT_BEHAVIOR',
    row_count: String(icpPilot.length),
    row_ids_sample: ids(icpPilot),
    target_scope: 'ICP_A and ICP_D / participants P01-P02',
    operator_goal_ru: 'Провести маленький pilot по двум сегментам до массового интервью, чтобы проверить язык, recent behavior и fatal objections.',
    evidence_to_capture_ru: 'recent behavior, last episode, workaround, pain score, concept preference, WTP, fatal objection, exact quote',
    success_threshold_ru: 'Хотя бы один участник в каждом сегменте дает concrete recent behavior и понятный language resonance.',
    stop_or_downgrade_rule_ru: 'Если оба сегмента говорят только абстрактно или отвергают action-tied identity/progress, ICP claim не усиливается.',
    output_files_to_update: 'data_processed/icp_interview_capture_sheet.csv;data_processed/icp_segment_matrix.csv;data_processed/icp_validation_test_plan.csv',
    rebuild_after_tranche: 'build:icp-segments|build:hypothesis-decision|build:completion-audit|build:ru-report|build:ru-pdf'
  },
  {
    tranche_id: 'TRANCHE_05_PROTOTYPE_PILOT',
    sequence: '5',
    priority: 'P0_blocker',
    workstream_mix: 'prototype_user_validation|prototype_scorecard_gate',
    linked_gates: 'GATE_H4_PROTOTYPE_ADVANTAGE|GATE_H6_PRODUCT_CORE',
    row_count: String(prototypePilot.length),
    row_ids_sample: ids(prototypePilot),
    target_scope: 'ICP_A and ICP_D / participants P01-P02 / screens S01-S08',
    operator_goal_ru: 'Проверить самое хрупкое место: понимают ли люди causality между действием и avatar/progress feedback.',
    evidence_to_capture_ru: 'screen-by-screen paraphrase, completion time, comprehension, meaning lift, differentiation, return intent, trust objection',
    success_threshold_ru: 'PVS_M01/PVS_M04/PVS_M05 не получают kill evidence; участники понимают S06 causality без объяснения.',
    stop_or_downgrade_rule_ru: 'Если avatar/progress читается как декоративная игра или манипуляция, H4/H6 остаются hold или pivot.',
    output_files_to_update: 'data_processed/prototype_session_capture_sheet.csv;data_processed/prototype_validation_scorecard.csv',
    rebuild_after_tranche: 'build:validation-gate-calculator|build:hypothesis-decision|build:completion-audit|build:ru-report|build:ru-pdf'
  },
  {
    tranche_id: 'TRANCHE_06_REDDIT_TOP25_LANGUAGE',
    sequence: '6',
    priority: 'P0',
    workstream_mix: 'reddit_manual_reading',
    linked_gates: 'GATE_H5_ICP_RECENT_BEHAVIOR|GATE_H3_MANUAL_WHITESPACE',
    row_count: String(redditP0Top25.length),
    row_ids_sample: ids(redditP0Top25),
    target_scope: 'Top 25 P0 Reddit/manual reading rows',
    operator_goal_ru: 'Быстро получить живой язык rejected patterns и alternatives, не превращая Reddit в ложный количественный спрос.',
    evidence_to_capture_ru: 'user job, named alternatives, rejected patterns, paid/WTP signal, safety boundary, Alina implication, quote permission',
    success_threshold_ru: '25 rows read; at least 10 useful language/pain insights with quote-use status explicitly set.',
    stop_or_downgrade_rule_ru: 'Если top threads показывают, что users reject gamified identity/progress, prototype positioning must change before more sessions.',
    output_files_to_update: 'data_processed/reddit_manual_reading_capture_sheet.csv;data_processed/evidence_claim_register.csv',
    rebuild_after_tranche: 'build:evidence-audit|build:completion-audit|build:report-draft|build:ru-report|build:ru-pdf'
  },
  {
    tranche_id: 'TRANCHE_07_EXPAND_AFTER_SPIKES',
    sequence: '7',
    priority: 'P1_after_spikes',
    workstream_mix: 'manual|paid|icp|prototype|reddit',
    linked_gates: gates.map(row => row.gate_id).join('|'),
    row_count: String(firstFiveManual.length + partialPaid.length + icpFull.length + prototypeFull.length + redditP0Next75.length),
    row_ids_sample: `${ids(partialPaid, 'capture_id', 4)}|${ids(icpFull, 'capture_id', 4)}|${ids(prototypeFull, 'capture_id', 4)}|${ids(redditP0Next75, 'capture_id', 4)}`,
    target_scope: 'Only after Tranche 01-06 do not trigger downgrade/pivot',
    operator_goal_ru: 'Расширять объем только после первых spikes. Если первые партии противоречат гипотезам, сначала обновить позиционирование и вопросы.',
    evidence_to_capture_ru: 'remaining high-value capture rows across lanes',
    success_threshold_ru: 'Gates move from not_started to pass_ready_for_review, hold_with_evidence, downgrade, or pivot with linked evidence.',
    stop_or_downgrade_rule_ru: 'Do not continue broad capture if early evidence shows the core loop is misunderstood or already owned.',
    output_files_to_update: 'all capture sheets;data_processed/validation_gate_calculator.csv;data_processed/research_completion_audit.csv',
    rebuild_after_tranche: 'full_rebuild_and_commit'
  },
  {
    tranche_id: 'TRANCHE_08_PUBLICATION_REBUILD',
    sequence: '8',
    priority: 'P0_after_observed_evidence',
    workstream_mix: 'reporting|provenance',
    linked_gates: gates.map(row => row.gate_id).join('|'),
    row_count: '0',
    row_ids_sample: '',
    target_scope: 'After any observed validation tranche',
    operator_goal_ru: 'Закрыть цикл evidence-first: результаты должны попасть в claims, русский отчет, PDF, manifest и GitHub.',
    evidence_to_capture_ru: 'updated claims, gate status, PDF readback, git commit hash',
    success_threshold_ru: 'Repo clean after commit/push; report language matches observed evidence and boundaries.',
    stop_or_downgrade_rule_ru: 'If reports do not reflect changed evidence, publication is stale and cannot be used externally.',
    output_files_to_update: 'data_processed/evidence_claim_register.csv;data_processed/research_completion_audit.csv;reports/alina-russian-narrative-report-v1.md;output/pdf/alina-russian-narrative-report-v1.pdf;data_processed/evidence_artifact_manifest.csv',
    rebuild_after_tranche: 'npm test|diff check|pdf readback|git commit|git push'
  }
];

writeCsv(OUT, rows, [
  'tranche_id',
  'sequence',
  'priority',
  'workstream_mix',
  'linked_gates',
  'row_count',
  'row_ids_sample',
  'target_scope',
  'operator_goal_ru',
  'evidence_to_capture_ru',
  'success_threshold_ru',
  'stop_or_downgrade_rule_ru',
  'output_files_to_update',
  'rebuild_after_tranche'
]);

const totalRows = manual.length + paid.length + icp.length + prototype.length + reddit.length;
const lines = [];
lines.push('# Validation Tranche Planner V1');
lines.push('');
lines.push(`Generated: ${new Date().toISOString()}`);
lines.push('');
lines.push('## Purpose');
lines.push('');
lines.push('This planner turns the 850 prepared capture rows into an execution sequence. It is deliberately conservative: it starts with the highest-risk blockers, uses small spikes before broad capture, and requires claim/report rebuilds after observed evidence.');
lines.push('');
lines.push('## Capture Universe');
lines.push('');
lines.push(`- Manual walkthrough capture rows: ${manual.length}`);
lines.push(`- Paid-flow capture rows: ${paid.length}`);
lines.push(`- ICP interview capture rows: ${icp.length}`);
lines.push(`- Prototype session capture rows: ${prototype.length}`);
lines.push(`- Reddit/manual reading capture rows: ${reddit.length}`);
lines.push(`- Total capture rows: ${totalRows}`);
lines.push(`- Scorecard metrics: ${scorecard.length}`);
lines.push(`- Validation gates: ${gates.length}`);
lines.push('');
lines.push('## Tranche Sequence');
lines.push('');
lines.push(mdTable(rows, [
  { key: 'sequence', label: 'Seq', align: 'right' },
  { key: 'tranche_id', label: 'Tranche' },
  { key: 'priority', label: 'Priority' },
  { key: 'workstream_mix', label: 'Workstream' },
  { key: 'row_count', label: 'Rows', align: 'right' },
  { key: 'operator_goal_ru', label: 'Operator goal' },
  { key: 'stop_or_downgrade_rule_ru', label: 'Stop / downgrade rule' }
]));
lines.push('');
for (const row of rows) {
  lines.push(`## ${row.tranche_id}`);
  lines.push('');
  lines.push(`- Sequence: ${row.sequence}`);
  lines.push(`- Priority: ${row.priority}`);
  lines.push(`- Workstream: ${row.workstream_mix}`);
  lines.push(`- Linked gates: ${row.linked_gates}`);
  lines.push(`- Row count: ${row.row_count}`);
  if (row.row_ids_sample) lines.push(`- Row ids sample: ${row.row_ids_sample}`);
  lines.push(`- Target scope: ${row.target_scope}`);
  lines.push(`- Operator goal: ${row.operator_goal_ru}`);
  lines.push(`- Evidence to capture: ${row.evidence_to_capture_ru}`);
  lines.push(`- Success threshold: ${row.success_threshold_ru}`);
  lines.push(`- Stop/downgrade rule: ${row.stop_or_downgrade_rule_ru}`);
  lines.push(`- Output files to update: ${row.output_files_to_update}`);
  lines.push(`- Rebuild after tranche: ${row.rebuild_after_tranche}`);
  lines.push('');
}
lines.push('## Claim Boundary');
lines.push('');
lines.push('This is an execution planner, not validation evidence. It does not upgrade any hypothesis by itself. Only filled capture rows, saved screenshots, participant quotes, human signoff notes, and updated gate calculations can change H1-H6.');
lines.push('');
lines.push('## Files');
lines.push('');
lines.push(`- \`${OUT}\``);
lines.push(`- \`${DOC}\``);

fs.writeFileSync(DOC, `${lines.join('\n')}\n`);

console.log(`validation_tranche_planner_rows=${rows.length}`);
console.log(`capture_rows_total=${totalRows}`);
console.log(`doc=${DOC}`);
