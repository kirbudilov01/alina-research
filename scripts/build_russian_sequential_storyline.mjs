import fs from 'fs';

const OUT = 'data_processed/russian_sequential_storyline.csv';
const DOC = 'docs/decision/russian-sequential-storyline-v1.md';

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
  if (!fs.existsSync(file) && file === 'data_processed/cross_source_universe_raw.csv') {
    return csv('data_processed/cross_source_universe_raw_index.csv')
      .flatMap(row => fs.existsSync(row.file_path) ? csv(row.file_path) : []);
  }
  return fs.existsSync(file) ? parseCsv(fs.readFileSync(file, 'utf8')) : [];
}

function writeCsv(file, rows, headers) {
  fs.writeFileSync(file, `${[headers.join(','), ...rows.map(row => headers.map(h => csvEscape(row[h])).join(','))].join('\n')}\n`);
}

function mdTable(rows, columns, limit = rows.length) {
  const limited = rows.slice(0, limit);
  const header = `| ${columns.map(c => c.label).join(' | ')} |`;
  const sep = `| ${columns.map(c => c.align === 'right' ? '---:' : '---').join(' | ')} |`;
  const body = limited.map(row => `| ${columns.map(c => clean(row[c.key]).replace(/\|/g, '/')).join(' | ')} |`);
  return [header, sep, ...body].join('\n');
}

function num(value) {
  const n = Number(String(value ?? '').replace(/[^\d.-]/g, ''));
  return Number.isFinite(n) ? n : 0;
}

function fmt(value) {
  return Math.round(num(value)).toLocaleString('en-US');
}

function by(rows, key, value) {
  return rows.find(row => row[key] === value) || {};
}

const rawRows = csv('data_processed/cross_source_universe_raw.csv');
const dedupRows = csv('data_processed/cross_source_universe_dedup.csv');
const manifest = csv('data_processed/evidence_artifact_manifest.csv');
const nicheRollup = csv('data_processed/global_niche_count_rollup.csv');
const gates = csv('data_processed/global_hypothesis_gate_snapshot.csv');
const tam = csv('data_processed/tam_sam_som_model.csv');
const sensitivity = csv('data_processed/market_model_sensitivity_audit.csv');
const archetypes = csv('data_processed/global_competitor_archetype_rollup.csv');
const whitespaceAudience = csv('data_processed/global_whitespace_audience_synthesis.csv');
const icp = csv('data_processed/russian_icp_battlecards.csv');
const productLoop = csv('data_processed/russian_product_loop_cards.csv');
const validationBacklog = csv('data_processed/global_next_validation_backlog.csv');
const readability = csv('data_processed/global_report_readability_audit.csv');
const sampleStyleExists = fs.existsSync('docs/decision/alina-sample-style-benchmark-v1.md') ? 'yes' : 'no';
const gateHold = gates.filter(row => row.decision_ru === 'оставить hold_validate').length;
const intersection = by(tam, 'pillar', 'intersection');

const rows = [
  {
    storyline_id: 'STORY_01_PRODUCT_THESIS',
    report_section_ru: 'Описание проекта и гипотеза #1',
    reader_question_ru: 'Что такое Alina и почему это не просто еще один tracker, meditation app или avatar toy?',
    narrative_move_ru: 'Сначала дать продуктовую ставку человеческим языком: daily meaning превращается в маленькое действие, reset снижает трение, progress/avatar показывает причинное изменение.',
    evidence_anchor_ru: `source_base=${fmt(rawRows.length)} raw; dedup=${fmt(dedupRows.length)}; manifest=${fmt(manifest.length)}; sample_style=${sampleStyleExists}`,
    allowed_conclusion_ru: 'Есть достаточно широкий контекст для проверки продуктовой формы.',
    boundary_ru: 'Это не PMF proof и не доказательство спроса; это стартовая рамка H1.',
    transition_to_next_ru: 'Если форма продукта звучит правдоподобно, следующий вопрос - есть ли вокруг нее большие и платежеспособные мировые рынки.',
    style_instruction_ru: 'Писать как связный русский рассказ: сначала смысл, затем цифры.'
  },
  {
    storyline_id: 'STORY_02_EVIDENCE_STATUS',
    report_section_ru: 'Текущий статус доказательств',
    reader_question_ru: 'Можно ли уже говорить, что гипотезы доказаны?',
    narrative_move_ru: 'Сразу поставить защитную рамку: все гипотезы идут через gates, а desk research не заменяет observed evidence.',
    evidence_anchor_ru: `gates=${gates.length}; hold_validate=${gateHold}; H2=${by(gates, 'hypothesis_id', 'H2').completed_vs_required || 'n/a'} completed`,
    allowed_conclusion_ru: 'Исследование достаточно большое, чтобы выбирать следующие проверки, но не достаточно наблюдаемое, чтобы закрывать gates.',
    boundary_ru: 'Не усиливать формулировки до go, пока нет walkthrough, интервью, prototype sessions и WTP.',
    transition_to_next_ru: 'После фиксации границ можно смотреть на рынки без риска перепутать market size и product proof.',
    style_instruction_ru: 'Не объяснять читателю, как читать research слишком долго; дать короткий статус и идти дальше.'
  },
  {
    storyline_id: 'STORY_03_MARKET_MAP',
    report_section_ru: 'Определение мировых целевых рынков и гипотеза #2',
    reader_question_ru: 'Какие именно пять мировых направлений проверяются и сколько данных взято в каждой нише?',
    narrative_move_ru: 'Показать пять направлений как роли в будущей ценности Alina: reset, action, meaning, visible identity, progression mechanics.',
    evidence_anchor_ru: `${nicheRollup.length} market rows; direct_app_dedup=${fmt(nicheRollup.reduce((sum, row) => sum + num(row.direct_app_store_dedup_rows), 0))}; all_source_dedup_rows_by_niche=${fmt(nicheRollup.reduce((sum, row) => sum + num(row.all_source_dedup_rows), 0))}`,
    allowed_conclusion_ru: 'Пять направлений покрыты как global competitor/source map.',
    boundary_ru: 'Построчные niche dedup нельзя складывать как уникальных конкурентов; gaming остается benchmark, не прямой TAM.',
    transition_to_next_ru: 'Когда направления определены, нужно оценить деньги через range-based TAM/SAM/SOM, а не через одну красивую цифру.',
    style_instruction_ru: 'Перед таблицей явно сказать, что числа показывают coverage, а не количество прямых клонов.'
  },
  {
    storyline_id: 'STORY_04_MARKET_MONEY',
    report_section_ru: 'Методология TAM/SAM/SOM',
    reader_question_ru: 'Есть ли там деньги и насколько хрупка рыночная модель?',
    narrative_move_ru: 'Разделить TAM, SAM, confidence-weighted SAM и stress scenarios; отдельно назвать чувствительные assumptions.',
    evidence_anchor_ru: `tam_rows=${tam.length}; intersection_sam=${intersection.samBase || 'n/a'}; sensitivity_rows=${sensitivity.length}`,
    allowed_conclusion_ru: 'H2 получает directional money case для продолжения проверки.',
    boundary_ru: 'Рыночная модель не является revenue forecast и не закрывает paid-flow/WTP gate.',
    transition_to_next_ru: 'Если деньги вокруг есть, следующий риск - конкурентная плотность и hidden clones.',
    style_instruction_ru: 'Вывод перед формулами: что можно решить по рынку уже сейчас, а что нельзя.'
  },
  {
    storyline_id: 'STORY_05_COMPETITOR_FIELD',
    report_section_ru: 'Определение конкурентов и гипотеза #3',
    reader_question_ru: 'Кто уже борется за похожее поведение пользователя?',
    narrative_move_ru: 'Показывать конкурентов как карту соседних способов решения задачи, а не как список приложений ради списка.',
    evidence_anchor_ru: `archetype_rows=${archetypes.length}; close_or_direct_total=${fmt(archetypes.reduce((sum, row) => sum + num(row.close_or_direct_apps), 0))}`,
    allowed_conclusion_ru: 'Конкурентное поле плотное, и это подтверждает market activity.',
    boundary_ru: 'Плотность конкурентов не доказывает Alina; taxonomy noise и hidden-clone риск остаются.',
    transition_to_next_ru: 'После поля конкурентов надо сузить вопрос: где именно петля Alina не закрыта полностью.',
    style_instruction_ru: 'Не писать “конкурентов нет”; писать “конкуренты закрывают части петли”.'
  },
  {
    storyline_id: 'STORY_06_WHITESPACE',
    report_section_ru: 'Где дыры и возможность отличиться',
    reader_question_ru: 'Где может быть белое пятно и почему оно не слишком широкое?',
    narrative_move_ru: 'Формулировать whitespace как причинную дыру: meaning -> action -> reset -> visible progress, а не как отсутствие wellness apps.',
    evidence_anchor_ru: `${whitespaceAudience.length} whitespace/audience rows; best_directional_fields=mindfulness, avatar_identity`,
    allowed_conclusion_ru: 'Узкое directional whitespace выглядит проверяемым, особенно в mindfulness/avatar слоях.',
    boundary_ru: 'H3 нельзя усиливать без ручного walkthrough P0-конкурентов.',
    transition_to_next_ru: 'Белое пятно имеет смысл только если есть аудитория с recent behavior и current workaround.',
    style_instruction_ru: 'Давать мини-вывод после каждой группы: что это значит для продукта.'
  },
  {
    storyline_id: 'STORY_07_AUDIENCE',
    report_section_ru: 'Аудитория, интервью и гипотеза #4',
    reader_question_ru: 'Кто потенциальный пользователь и почему это не демография?',
    narrative_move_ru: 'Описывать audience через поведение: digital ritual users, recent behavior, paid depth, trust boundary и язык боли.',
    evidence_anchor_ru: `icp_rows=${icp.length}; p0_segments=Spiritual self-improvers + Habit and progress users`,
    allowed_conclusion_ru: 'Есть два P0-сегмента для первых интервью и прототипа.',
    boundary_ru: 'Secondary VOC и review language не заменяют живые интервью.',
    transition_to_next_ru: 'После аудитории можно определить MVP не как набор функций, а как проверку одной петли.',
    style_instruction_ru: 'Каждый сегмент связывать с конкретным вопросом интервью.'
  },
  {
    storyline_id: 'STORY_08_PRODUCT_LOOP',
    report_section_ru: 'Итоговая модель продукта и гипотеза #5',
    reader_question_ru: 'Что именно должен проверить MVP?',
    narrative_move_ru: 'Сжать продукт до одной причинной сессии: вход в смысл, контекст, действие, reset, evidence, avatar/progress feedback, next-day hook.',
    evidence_anchor_ru: `product_loop_screens=${productLoop.length}; prototype_scorecard_file=data_processed/prototype_validation_scorecard.csv`,
    allowed_conclusion_ru: 'MVP можно проектировать вокруг loop comprehension, differentiation, trust и return intent.',
    boundary_ru: 'H4/H6 не закрыты, пока участники не объясняют петлю своими словами.',
    transition_to_next_ru: 'Дальше нужна очередь валидации, которая превращает desk research в observed rows.',
    style_instruction_ru: 'Писать “какую причинность проверяет экран”, а не только “какой экран есть”.'
  },
  {
    storyline_id: 'STORY_09_VALIDATION_QUEUE',
    report_section_ru: 'Ближайшая очередь валидации',
    reader_question_ru: 'Что делать следующим шагом, чтобы отчет стал сильнее?',
    narrative_move_ru: 'Дать порядок работ: hidden-clone walkthrough, paid-flow/WTP, ICP interviews, prototype sessions.',
    evidence_anchor_ru: `next_validation_tasks=${validationBacklog.length}; first_workstreams=manual walkthrough + paid-flow`,
    allowed_conclusion_ru: 'Следующий прирост качества должен прийти от observed rows, а не от бесконечного расширения desk research.',
    boundary_ru: 'Очередь задач не равна выполненной валидации.',
    transition_to_next_ru: 'После этого читателю нужно показать traceability: откуда взяты claims и где лежат файлы.',
    style_instruction_ru: 'Держать список коротким в narrative, тяжелые capture sheets оставлять в приложениях.'
  },
  {
    storyline_id: 'STORY_10_TRACEABILITY',
    report_section_ru: 'Источники и границы доказательств',
    reader_question_ru: 'Можно ли проверить, откуда взялись утверждения?',
    narrative_move_ru: 'Закрыть рассказ source appendix, manifest и границами claims, чтобы отчет был красивым, но не бездоказательным.',
    evidence_anchor_ru: `manifest=${fmt(manifest.length)}; readability_rows=${readability.length}; source_appendix=data_processed/global_hypothesis_source_appendix.csv`,
    allowed_conclusion_ru: 'Пакет трассируем локально и готов к следующему validation pass.',
    boundary_ru: 'Traceability доказывает наличие и связность артефактов, но не доказывает продуктовый outcome.',
    transition_to_next_ru: 'После новых observed rows нужно пересобрать отчет, PDF/DOCX, manifest и git history.',
    style_instruction_ru: 'Финал должен оставлять читателю решение и следующий шаг, а не утопать в методологии.'
  }
];

writeCsv(OUT, rows, [
  'storyline_id',
  'report_section_ru',
  'reader_question_ru',
  'narrative_move_ru',
  'evidence_anchor_ru',
  'allowed_conclusion_ru',
  'boundary_ru',
  'transition_to_next_ru',
  'style_instruction_ru'
]);

const lines = [];
lines.push('# Russian Sequential Storyline V1');
lines.push('');
lines.push(`Generated: ${new Date().toISOString().slice(0, 10)}`);
lines.push('');
lines.push('## Зачем нужен этот слой');
lines.push('');
lines.push('Этот документ фиксирует русскую повествовательную ось отчета Alina. Его задача - ответить на претензию “данных много, но как это читать?” и превратить evidence pack в последовательный рассказ: идея -> статус доказательств -> рынки -> деньги -> конкуренты -> whitespace -> аудитория -> MVP -> validation -> источники.');
lines.push('');
lines.push('Он опирается на образец Alina как на форму, но остается мировым research: рынок, конкуренты и источники глобальные, русский язык используется только как язык отчета.');
lines.push('');
lines.push('## Короткий вывод');
lines.push('');
lines.push('Текущий отчет должен читаться не как инструкция “как читать ресерч”, а как цепочка гипотез. Каждый раздел обязан закрывать один читательский вопрос, показывать evidence, называть допустимый вывод и сразу объяснять, почему следующий раздел нужен. Именно это делает отчет похожим на исследование, а не на выгрузку таблиц.');
lines.push('');
lines.push('## Storyline Table');
lines.push('');
lines.push(mdTable(rows, [
  { key: 'storyline_id', label: 'ID' },
  { key: 'report_section_ru', label: 'Раздел' },
  { key: 'reader_question_ru', label: 'Вопрос читателя' },
  { key: 'narrative_move_ru', label: 'Ход повествования' },
  { key: 'evidence_anchor_ru', label: 'Evidence anchor' },
  { key: 'allowed_conclusion_ru', label: 'Допустимый вывод' },
  { key: 'boundary_ru', label: 'Граница' },
  { key: 'transition_to_next_ru', label: 'Переход дальше' }
]));
lines.push('');
lines.push('## Редакторские правила');
lines.push('');
lines.push('1. Сначала человеческий вывод, потом таблица.');
lines.push('2. Каждая цифра должна отвечать на вопрос раздела, а не просто демонстрировать масштаб.');
lines.push('3. Coverage, money proxy и source volume нельзя писать как доказательство спроса.');
lines.push('4. Внешняя версия должна оставлять тяжелые таблицы в appendix, а основное чтение вести через STORY_01-STORY_10.');
lines.push('5. После каждой новой observed validation строки надо обновлять gates и менять силу формулировок.');
lines.push('');
lines.push('## Files');
lines.push('');
lines.push(`- \`${OUT}\``);
lines.push('- `reports/alina-global-hypothesis-report-v1.md`');
lines.push('- `reports/alina-global-executive-narrative-v1.md`');
lines.push('- `docs/decision/alina-sample-style-benchmark-v1.md`');

fs.writeFileSync(DOC, `${lines.join('\n')}\n`);

console.log(`russian_sequential_storyline=${OUT}`);
console.log(`doc=${DOC}`);
console.log(`storyline_rows=${rows.length}`);
