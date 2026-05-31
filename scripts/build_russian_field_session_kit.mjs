import fs from 'fs';

const OUT = 'data_processed/russian_field_session_kit.csv';
const DOC = 'docs/audience/russian-field-session-kit-v1.md';
const KIT_DIR = 'output/validation/ru_session_kits';

for (const dir of ['data_processed', 'docs/audience', KIT_DIR]) fs.mkdirSync(dir, { recursive: true });

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

function sampleIds(rows, limit = 8) {
  return rows.slice(0, limit).map(row => row.capture_id || row.metric_id || row.theme_id).filter(Boolean).join('|');
}

const icpDossiers = csv('data_processed/russian_icp_interview_dossiers.csv');
const prototypeDossiers = csv('data_processed/russian_prototype_session_dossiers.csv');
const vocMap = csv('data_processed/russian_voc_objection_map.csv');
const icpCapture = csv('data_processed/icp_interview_capture_sheet.csv');
const prototypeCapture = csv('data_processed/prototype_session_capture_sheet.csv');
const scorecard = csv('data_processed/prototype_validation_scorecard.csv');

const p0Segments = icpDossiers.filter(row => row.priority === 'P0_top_two');

function segmentVoc(segmentId) {
  return vocMap.filter(row => clean(row.linked_icp_segments).includes(segmentId)).slice(0, 6);
}

function kitRowsFor(segment) {
  const proto = prototypeDossiers.find(row => row.segment_id === segment.segment_id) || {};
  const icpRows = icpCapture.filter(row => clean(row.capture_id).startsWith(`${segment.segment_id}_`));
  const protoRows = prototypeCapture.filter(row => row.segment_id === segment.segment_id);
  const vocRows = segmentVoc(segment.segment_id);
  return [
    {
      step_order: 1,
      step_id: `${segment.segment_id}_CONSENT`,
      segment_id: segment.segment_id,
      segment_name: segment.segment_name,
      phase_ru: 'Consent и рамка безопасности',
      minutes: 3,
      operator_script_ru: 'Объяснить: это исследовательская сессия, не терапия и не медицинский/духовный совет; можно пропускать вопросы; запись/цитаты только с явного согласия; задача - понять поведение, а не продать продукт.',
      evidence_to_capture_ru: 'consent_yes_no|recording_permission|quote_permission|participant_boundaries',
      source_capture_rows: '',
      linked_hypotheses: 'H5|H6',
      pass_signal_ru: 'участник понимает формат, дает согласие и спокойно обозначает границы',
      downgrade_signal_ru: 'участник чувствует манипуляцию, небезопасность или не понимает, что это исследование',
      output_target: 'researcher_notes;data_processed/icp_interview_capture_sheet.csv'
    },
    {
      step_order: 2,
      step_id: `${segment.segment_id}_SCREENER`,
      segment_id: segment.segment_id,
      segment_name: segment.segment_name,
      phase_ru: 'Recent behavior screener',
      minutes: 7,
      operator_script_ru: segment.prompt_pack_ru.split(' | ').find(part => part.startsWith('screener:')) || 'Спросить, какие приложения, ритуалы, игры, дневники, коучи, аватары или guidance tools участник использовал за последние 30 дней.',
      evidence_to_capture_ru: 'recent_behavior_match|current_tool|trigger_of_last_use|segment_fit_yes_no',
      source_capture_rows: sampleIds(icpRows.filter(row => row.test_type === 'screener')),
      linked_hypotheses: 'H5',
      pass_signal_ru: 'есть recent behavior и конкретный триггер последнего использования',
      downgrade_signal_ru: 'поведение абстрактное, давно не было, или сегмент выбран по вкусу исследователя',
      output_target: 'data_processed/icp_interview_capture_sheet.csv'
    },
    {
      step_order: 3,
      step_id: `${segment.segment_id}_PROBLEM_STORY`,
      segment_id: segment.segment_id,
      segment_name: segment.segment_name,
      phase_ru: 'Problem story и current workaround',
      minutes: 12,
      operator_script_ru: segment.prompt_pack_ru.split(' | ').find(part => part.startsWith('problem_interview:')) || `Попросить последний реальный эпизод вокруг job: ${segment.core_job_ru}`,
      evidence_to_capture_ru: 'specific_episode|workaround|pain_intensity_1_5|verbatim_language|rejected_patterns',
      source_capture_rows: sampleIds(icpRows.filter(row => row.test_type === 'problem_interview')),
      linked_hypotheses: 'H5|H3',
      pass_signal_ru: 'участник рассказывает конкретный эпизод, current workaround и язык боли без наводки',
      downgrade_signal_ru: 'участник рассуждает теоретически или проблема оказывается слабее текущих альтернатив',
      output_target: 'data_processed/icp_interview_capture_sheet.csv;data_processed/russian_voc_objection_map.csv'
    },
    {
      step_order: 4,
      step_id: `${segment.segment_id}_VOC_OBJECTIONS`,
      segment_id: segment.segment_id,
      segment_name: segment.segment_name,
      phase_ru: 'VOC objections и disconfirmation',
      minutes: 10,
      operator_script_ru: vocRows.map(row => row.interview_probe_ru).join(' | '),
      evidence_to_capture_ru: 'top_objection|trust_boundary|streak_or_pressure_reaction|personalization_reaction|paid_depth_reaction',
      source_capture_rows: vocRows.map(row => row.theme_id).join('|'),
      linked_hypotheses: 'H2|H4|H5|H6',
      pass_signal_ru: 'возражения конкретные и addressable copy/control/design changes',
      downgrade_signal_ru: 'fatal objection повторяется: unsafe, manipulative, generic, childish, pressure, paywall-before-value',
      output_target: 'data_processed/russian_voc_objection_map.csv;data_processed/icp_interview_capture_sheet.csv'
    },
    {
      step_order: 5,
      step_id: `${segment.segment_id}_PROTOTYPE_WALKTHROUGH`,
      segment_id: segment.segment_id,
      segment_name: segment.segment_name,
      phase_ru: 'Prototype walkthrough',
      minutes: 15,
      operator_script_ru: proto.session_flow_ru || 'Провести участника через meaning -> action -> reset -> completion -> avatar/progress change -> tomorrow hook.',
      evidence_to_capture_ru: proto.required_evidence_ru || 'completion_time_seconds|comprehension_yes_no|meaning_lift_1_5|differentiation_1_5|return_intent_1_5|fatal_objection',
      source_capture_rows: sampleIds(protoRows),
      linked_hypotheses: 'H4|H6|H5',
      pass_signal_ru: 'участник понимает причинность, проходит flow примерно за две минуты и формулирует отличие от generic alternatives',
      downgrade_signal_ru: 'flow читается как generic habit tracker, vague reading, pressure system или декоративный avatar toy',
      output_target: 'data_processed/prototype_session_capture_sheet.csv'
    },
    {
      step_order: 6,
      step_id: `${segment.segment_id}_VALUE_WTP`,
      segment_id: segment.segment_id,
      segment_name: segment.segment_name,
      phase_ru: 'Value, paid depth и referral language',
      minutes: 8,
      operator_script_ru: 'Спросить: что здесь должно остаться бесплатным, за какую глубину было бы честно платить, как бы ты описал продукт другу, кому бы ты его посоветовал и что должно случиться завтра, чтобы ты вернулся?',
      evidence_to_capture_ru: 'free_value_moment|paid_depth_feature|acceptable_price_range|friend_explanation|return_trigger',
      source_capture_rows: sampleIds(icpRows.filter(row => row.test_type === 'willingness_to_pay')),
      linked_hypotheses: 'H2|H5|H6',
      pass_signal_ru: 'участник называет paid depth после free value moment и может объяснить продукт своими словами',
      downgrade_signal_ru: 'вся ценность ожидается бесплатно, paid depth не связана с loop, или продукт невозможно пересказать',
      output_target: 'data_processed/icp_interview_capture_sheet.csv;data_processed/paid_flow_capture_sheet.csv'
    },
    {
      step_order: 7,
      step_id: `${segment.segment_id}_SCORE_REBUILD`,
      segment_id: segment.segment_id,
      segment_name: segment.segment_name,
      phase_ru: 'Scorecard и rebuild hygiene',
      minutes: 5,
      operator_script_ru: `Заполнить scorecard metrics: ${scorecard.map(row => `${row.metric_id}:${row.gate}`).join(' | ')}. Затем пересобрать validation gates, hypothesis decisions, completion audit, русский report/PDF и manifest.`,
      evidence_to_capture_ru: 'scorecard_metric_values|claim_update_needed|source_file_updated|rebuild_commit_hash',
      source_capture_rows: sampleIds(scorecard),
      linked_hypotheses: 'H1|H2|H3|H4|H5|H6',
      pass_signal_ru: 'все capture rows заполнены, scorecard посчитан, claim status обновлен только после evidence',
      downgrade_signal_ru: 'исследователь пытается обновить narrative без заполненных строк, цитат, скриншотов или scorecard values',
      output_target: 'data_processed/validation_gate_calculator.csv;data_processed/hypothesis_decision_matrix.csv;reports/alina-russian-narrative-report-v1.md;output/pdf/alina-russian-narrative-report-v1.pdf'
    }
  ];
}

const rows = p0Segments.flatMap(kitRowsFor);
const headers = [
  'step_order', 'step_id', 'segment_id', 'segment_name', 'phase_ru', 'minutes',
  'operator_script_ru', 'evidence_to_capture_ru', 'source_capture_rows',
  'linked_hypotheses', 'pass_signal_ru', 'downgrade_signal_ru', 'output_target'
];

writeCsv(OUT, rows, headers);

for (const segment of p0Segments) {
  const segmentRows = rows.filter(row => row.segment_id === segment.segment_id);
  const lines = [];
  lines.push(`# ${segment.segment_id}. Русский field session kit`);
  lines.push('');
  lines.push(`Segment: ${segment.segment_name}`);
  lines.push('');
  lines.push(`Core job: ${segment.core_job_ru}`);
  lines.push('');
  lines.push(`Main risk: ${segment.main_risk_ru}`);
  lines.push('');
  lines.push('## Session flow');
  lines.push('');
  lines.push(mdTable(segmentRows, [
    { key: 'step_order', label: '#' },
    { key: 'phase_ru', label: 'Phase' },
    { key: 'minutes', label: 'Min', align: 'right' },
    { key: 'linked_hypotheses', label: 'H' },
    { key: 'evidence_to_capture_ru', label: 'Evidence' }
  ], segmentRows.length));
  lines.push('');
  for (const row of segmentRows) {
    lines.push(`## ${row.step_order}. ${row.phase_ru}`);
    lines.push('');
    lines.push(`**Script:** ${row.operator_script_ru}`);
    lines.push('');
    lines.push(`**Pass:** ${row.pass_signal_ru}`);
    lines.push('');
    lines.push(`**Downgrade:** ${row.downgrade_signal_ru}`);
    lines.push('');
    lines.push(`**Update:** ${row.output_target}`);
    lines.push('');
  }
  lines.push('## Claim boundary');
  lines.push('');
  lines.push('Этот kit не является validation evidence. Он становится evidence только после заполнения source capture rows, сохранения цитат/скриншотов/scorecard values, пересборки gates/report/PDF/manifest и commit/push.');
  fs.writeFileSync(`${KIT_DIR}/${segment.segment_id}_field_session_kit.md`, `${lines.join('\n')}\n`);
}

const totalMinutes = rows.reduce((sum, row) => sum + Number(row.minutes || 0), 0);

const lines = [];
lines.push('# Русский field session kit V1');
lines.push('');
lines.push(`Собрано: ${new Date().toISOString()}`);
lines.push('');
lines.push('## Зачем нужен этот слой');
lines.push('');
lines.push('Этот слой превращает ICP dossiers, VOC/objection map и prototype dossiers в исполнимую сессию. Он дает оператору последовательный сценарий: consent, recent-behavior screener, problem story, disconfirmation, prototype walkthrough, WTP/referral language, scorecard и rebuild hygiene.');
lines.push('');
lines.push(`P0 segments: ${p0Segments.map(row => row.segment_id).join(', ')}. Session steps: ${rows.length}. Estimated total operator minutes across all P0 kits: ${totalMinutes}. Этот слой не закрывает H1-H6: он только делает сбор observed evidence достаточно строгим и повторяемым.`);
lines.push('');
lines.push('## Session kit index');
lines.push('');
lines.push(mdTable(rows, [
  { key: 'step_id', label: 'Step ID' },
  { key: 'segment_id', label: 'ICP' },
  { key: 'phase_ru', label: 'Phase' },
  { key: 'minutes', label: 'Min', align: 'right' },
  { key: 'linked_hypotheses', label: 'H' },
  { key: 'source_capture_rows', label: 'Source rows' }
], rows.length));
lines.push('');
lines.push('## Файлы');
lines.push('');
lines.push(`- \`${OUT}\``);
lines.push(`- \`${DOC}\``);
for (const segment of p0Segments) {
  lines.push(`- \`${KIT_DIR}/${segment.segment_id}_field_session_kit.md\``);
}

fs.writeFileSync(DOC, `${lines.join('\n')}\n`);

console.log(`russian_field_session_kit=${rows.length}`);
console.log(`p0_segments=${p0Segments.length}`);
console.log(`estimated_minutes=${totalMinutes}`);
console.log(`doc=${DOC}`);
