import fs from 'fs';

const OUT = 'data_processed/russian_validation_fieldbook.csv';
const DOC = 'docs/decision/russian-validation-fieldbook-v1.md';

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

function countBy(rows, key) {
  const out = {};
  for (const row of rows) out[row[key] || 'unknown'] = (out[row[key] || 'unknown'] || 0) + 1;
  return out;
}

function laneRows(commands, lane) {
  return commands.filter(row => row.lane === lane);
}

const commands = csv('data_processed/p0_validation_command_center.csv');
const dashboard = csv('data_processed/validation_execution_dashboard.csv');
const hypothesis = csv('data_processed/hypothesis_decision_matrix.csv');
const fieldGuide = csv('data_processed/p0_validation_field_guide.csv');
const workspace = csv('data_processed/validation_evidence_workspace_index.csv');
const gates = csv('data_processed/validation_gate_calculator.csv');
const manualCapture = csv('data_processed/manual_walkthrough_capture_sheet.csv');
const paidCapture = csv('data_processed/paid_flow_capture_sheet.csv');
const icpCapture = csv('data_processed/icp_interview_capture_sheet.csv');
const prototypeCapture = csv('data_processed/prototype_session_capture_sheet.csv');
const redditCapture = csv('data_processed/reddit_manual_reading_capture_sheet.csv');

const manualRows = laneRows(commands, 'manual_competitor_walkthrough');
const paidRows = laneRows(commands, 'paid_flow_validation');
const icpRows = laneRows(commands, 'icp_interviews');
const protoRows = laneRows(commands, 'prototype_user_validation');
const scoreRows = laneRows(commands, 'prototype_scorecard_gate');
const captureTotal = manualCapture.length + paidCapture.length + icpCapture.length + prototypeCapture.length + redditCapture.length;
const blockerRows = commands.filter(row => row.priority === 'P0_blocker');
const holdHypotheses = hypothesis.filter(row => row.current_decision === 'hold_validate');
const notStartedGates = gates.filter(row => row.gate_status === 'not_started');
const workspaceDirs = workspace.map(row => row.workspace_dir).filter(Boolean).join(' | ');

const rows = [
  {
    phase_id: 'RU_FIELD_01',
    phase_title_ru: 'Начать не с красивого вывода, а с evidence discipline',
    narrative_ru: 'Перед полевой работой мы фиксируем простое правило: ни одна гипотеза H1-H6 не усиливается из ощущения, памяти или красивой формулировки. Сначала появляется сырой след: скриншот, заметка, цитата, числовая оценка или human signoff. Потом заполняется capture row. Только после этого обновляются claim register, hypothesis decisions, отчет и PDF.',
    command_scope: `command_rows=${commands.length}; p0_blockers=${blockerRows.length}; dashboard_rows=${dashboard.length}; field_guide_sections=${fieldGuide.length}`,
    evidence_to_collect_ru: 'raw screenshot path | notes path | participant quote | observed score | human signoff note | final verdict',
    decision_rule_ru: 'Если evidence не связан с конкретным локальным файлом или строкой capture sheet, он не может усиливать внешний claim.',
    output_files_to_touch: 'data_processed/p0_validation_command_center.csv;data_processed/evidence_claim_register.csv;data_processed/hypothesis_decision_matrix.csv'
  },
  {
    phase_id: 'RU_FIELD_02',
    phase_title_ru: 'Ручной walkthrough конкурентов: проверить, нет ли скрытого прямого клона',
    narrative_ru: 'Первый фактический удар по H1/H3 - пройти P0 конкурентов руками. Публичные листинги уже подсветили риск, но листинг не показывает реальную петлю. Нужно открыть продукт или доступный demo/listing, зафиксировать onboarding, первое ценное действие, экран после действия, progress/avatar/identity feedback и первую границу paywall. Главный вопрос: конкурент действительно связывает личный смысл, действие и причинное изменение прогресса, или просто говорит похожими словами?',
    command_scope: `manual_commands=${manualRows.length}; manual_capture_rows=${manualCapture.length}; first_manual_target=${manualRows[0]?.target || 'n/a'}`,
    evidence_to_collect_ru: 'listing screenshot | onboarding first value | first action/task | progress/avatar/identity feedback | paywall/free boundary | final directness verdict',
    decision_rule_ru: 'Если хотя бы один P0 конкурент полноценно владеет петлей meaning -> action -> reset -> visible identity/progress -> return, whitespace нужно резко сузить или downgrade.',
    output_files_to_touch: 'data_processed/manual_competitor_inspection_packet.csv;data_processed/manual_walkthrough_capture_sheet.csv;data_processed/public_listing_inspection_results.csv'
  },
  {
    phase_id: 'RU_FIELD_03',
    phase_title_ru: 'Paid-flow signoff: отделить реальные деньги от proxy-шумов',
    narrative_ru: 'Рыночная часть уже показывает деньги в соседних рынках, но инвесторский или продуктовый вывод нельзя строить только на proxy. Нужно взять сильнейшие money-прокси, проверить соответствие продукта, видимые цены, trial terms, paywall boundary и пометить каждую строку как confirm, partial, reject, login-gated или unrelated. Здесь важна консервативность: лучше оставить меньше сильных claims, чем протащить случайную цену с parent-company страницы.',
    command_scope: `paid_commands=${paidRows.length}; paid_capture_rows=${paidCapture.length}`,
    evidence_to_collect_ru: 'pricing screenshot | product match | monthly/annual/trial price | first meaningful paywall boundary | human signoff',
    decision_rule_ru: 'H2 можно усиливать только там, где paid evidence совпадает с конкретным продуктом или честно помечено как partial proxy.',
    output_files_to_touch: 'data_processed/web_paywall_visual_adjudication.csv;data_processed/paid_flow_capture_sheet.csv;data_processed/market_money_triangulation.csv'
  },
  {
    phase_id: 'RU_FIELD_04',
    phase_title_ru: 'ICP interviews: выбрать аудиторию через недавнее поведение, а не через демографию',
    narrative_ru: 'Аудитория Alina сейчас формулируется как digital ritual users, но это еще directional тезис. Интервью должны доказать не то, что человеку "нравится идея", а что у него был недавний эпизод: он уже использовал приложение, ритуал, дневник, AI coach, habit tracker, astrology/tarot guidance или похожий инструмент, чтобы справиться с состоянием, прогрессом или личным смыслом. Без recent behavior сегмент остается красивой персоной, а не ICP.',
    command_scope: `icp_commands=${icpRows.length}; icp_capture_rows=${icpCapture.length}; hold_hypotheses=${holdHypotheses.length}`,
    evidence_to_collect_ru: 'recent behavior | last episode | current workaround | pain intensity | language resonance | trust/safety objection | acceptable price range | quote',
    decision_rule_ru: 'Primary ICP выбирается только если есть concrete recent behavior, понятная боль, резонанс языка, activation trigger и хотя бы directional WTP.',
    output_files_to_touch: 'data_processed/icp_interview_capture_sheet.csv;data_processed/icp_segment_matrix.csv;data_processed/icp_validation_test_plan.csv'
  },
  {
    phase_id: 'RU_FIELD_05',
    phase_title_ru: 'Prototype sessions: проверить, понимают ли люди причинность петли',
    narrative_ru: 'Прототип нужен не для презентационной красоты, а для проверки H4/H6. Участник должен сам объяснить, что происходит: персональное отражение превращается в одно действие, действие завершается, а progress/avatar/identity feedback меняется именно из-за действия. Если люди видят просто декор, мотивационную фразу или очередной habit tracker, конкурентное преимущество не доказано.',
    command_scope: `prototype_commands=${protoRows.length}; score_commands=${scoreRows.length}; prototype_capture_rows=${prototypeCapture.length}`,
    evidence_to_collect_ru: 'completion time | comprehension yes/no | meaning lift 1-5 | differentiation 1-5 | return intent 1-5 | trust objection | verbatim quote',
    decision_rule_ru: 'H4/H6 остаются hold, пока ключевые scorecard metrics не получают observed participant evidence.',
    output_files_to_touch: 'data_processed/prototype_session_capture_sheet.csv;data_processed/prototype_validation_scorecard.csv;data_processed/validation_gate_calculator.csv'
  },
  {
    phase_id: 'RU_FIELD_06',
    phase_title_ru: 'Reddit/manual reading: читать как язык боли, а не как количественный спрос',
    narrative_ru: 'Reddit слой уже большой, но пока большинство строк специально стоят в unread_do_not_upgrade. Его задача - дать язык боли, альтернатив и возражений. После чтения P0 тредов нужно выписывать job, rejected patterns, paid/WTP signals, safety boundaries и Alina implication. До ручного чтения нельзя цитировать треды как внешнее доказательство и нельзя усиливать claims.',
    command_scope: `reddit_capture_rows=${redditCapture.length}; capture_total=${captureTotal}`,
    evidence_to_collect_ru: 'source thread | user job | alternative used | rejected pattern | paid signal | safety boundary | Alina implication | quote approved for external use',
    decision_rule_ru: 'Forum/Reddit evidence усиливает только language and pain claims, если нет репрезентативной выборки или подтверждения в интервью.',
    output_files_to_touch: 'data_processed/reddit_manual_reading_capture_sheet.csv;data_processed/reddit_mention_signal_matrix.csv;docs/audience/reddit-manual-reading-capture-sheet-v1.md'
  },
  {
    phase_id: 'RU_FIELD_07',
    phase_title_ru: 'Обновить gates и отчет: evidence меняет документ, а не живет рядом',
    narrative_ru: 'После каждой партии валидации нельзя оставлять результаты отдельными заметками. Нужно пересобрать gate calculator, hypothesis decision matrix, completion audit, русский narrative report, polished PDF и manifest. Если результат противоречит старому тезису, текст должен стать слабее или точнее. В этом и есть evidence-first логика: отчет не защищает идею, а показывает, что мы честно узнали.',
    command_scope: `validation_gates=${gates.length}; not_started_gates=${notStartedGates.length}; workspace_dirs=${workspaceDirs}`,
    evidence_to_collect_ru: 'updated gate status | updated hypothesis decision | changed claim boundary | regenerated PDF | git commit hash',
    decision_rule_ru: 'Любой validation result должен завершаться rebuild -> audit -> commit -> push, иначе research package считается рассинхронизированным.',
    output_files_to_touch: 'data_processed/validation_gate_calculator.csv;data_processed/hypothesis_decision_matrix.csv;reports/alina-russian-narrative-report-v1.md;output/pdf/alina-russian-narrative-report-v1.pdf;data_processed/evidence_artifact_manifest.csv'
  }
];

writeCsv(OUT, rows, [
  'phase_id',
  'phase_title_ru',
  'narrative_ru',
  'command_scope',
  'evidence_to_collect_ru',
  'decision_rule_ru',
  'output_files_to_touch'
]);

const byLane = countBy(commands, 'lane');
const lines = [];
lines.push('# Русский полевой протокол валидации V1');
lines.push('');
lines.push(`Собрано: ${new Date().toISOString()}`);
lines.push('');
lines.push('## Как читать этот документ');
lines.push('');
lines.push('Это не еще одна матрица и не финальный вывод. Это русскоязычный маршрут исполнения валидации: что делать первым, что считать доказательством, когда понижать claim, как обновлять отчет и что обязательно коммитить. Документ специально написан последовательным языком, чтобы им можно было пользоваться во время ручной работы, а не только смотреть на него как на таблицу.');
lines.push('');
lines.push(`Сейчас в command center ${commands.length} строк, из них ${blockerRows.length} P0 blocker. Capture-подготовка покрывает ${captureTotal} строк: manual walkthrough ${manualCapture.length}, paid flow ${paidCapture.length}, ICP interviews ${icpCapture.length}, prototype sessions ${prototypeCapture.length}, Reddit/manual reading ${redditCapture.length}. Все ${gates.length} validation gates пока не имеют pass evidence, поэтому этот протокол не закрывает гипотезы, а задает дисциплину их проверки.`);
lines.push('');
lines.push('Команды по lane:');
lines.push('');
lines.push(Object.entries(byLane).sort((a, b) => b[1] - a[1]).map(([lane, count]) => `- ${lane}: ${count}`).join('\n'));
lines.push('');
lines.push('## Короткая карта фаз');
lines.push('');
lines.push(mdTable(rows, [
  { key: 'phase_id', label: 'Фаза' },
  { key: 'phase_title_ru', label: 'Название' },
  { key: 'evidence_to_collect_ru', label: 'Что собрать' },
  { key: 'decision_rule_ru', label: 'Правило решения' }
]));
lines.push('');
for (const row of rows) {
  lines.push(`## ${row.phase_id}. ${row.phase_title_ru}`);
  lines.push('');
  lines.push(row.narrative_ru);
  lines.push('');
  lines.push(`- Scope: ${row.command_scope}`);
  lines.push(`- Evidence: ${row.evidence_to_collect_ru}`);
  lines.push(`- Decision rule: ${row.decision_rule_ru}`);
  lines.push(`- Update files: ${row.output_files_to_touch}`);
  lines.push('');
}
lines.push('## Граница утверждений');
lines.push('');
lines.push('Этот fieldbook является execution asset. Он не доказывает H1-H6 и не заменяет людей, скриншоты, интервью или прототипные сессии. Его задача - сделать следующий ручной этап настолько конкретным, чтобы после него можно было честно обновить claims: усилить, оставить hold, сузить или убить.');
lines.push('');
lines.push('## Файлы');
lines.push('');
lines.push(`- \`${OUT}\``);
lines.push(`- \`${DOC}\``);

fs.writeFileSync(DOC, `${lines.join('\n')}\n`);

console.log(`russian_validation_fieldbook_rows=${rows.length}`);
console.log(`doc=${DOC}`);
