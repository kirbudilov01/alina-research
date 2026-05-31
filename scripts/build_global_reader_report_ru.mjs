import fs from 'fs';

const REPORT_OUT = 'reports/alina-global-reader-report-v1.md';
const GLOSSARY_OUT = 'data_processed/russian_reader_glossary.csv';
const GUIDE_OUT = 'docs/decision/russian-reader-glossary-v1.md';

for (const dir of ['reports', 'data_processed', 'docs/decision']) fs.mkdirSync(dir, { recursive: true });

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
  if (!fs.existsSync(file)) return [];
  return parseCsv(fs.readFileSync(file, 'utf8'));
}

function clean(value) {
  return String(value ?? '').replace(/\s+/g, ' ').trim();
}

function num(value) {
  const n = Number(String(value ?? '').replace(/[^\d.-]/g, ''));
  return Number.isFinite(n) ? n : 0;
}

function fmt(value) {
  return Math.round(num(value)).toLocaleString('en-US');
}

function money(value) {
  const n = num(value);
  if (!n) return 'нет данных';
  if (n >= 1_000_000_000) return `$${(n / 1_000_000_000).toFixed(1)}B`;
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(n >= 100_000_000 ? 0 : 1)}M`;
  return `$${Math.round(n).toLocaleString('en-US')}`;
}

function firstNumber(...values) {
  for (const value of values) {
    const n = num(value);
    if (n) return n;
  }
  return 0;
}

function csvEscape(value) {
  return `"${clean(value).replace(/"/g, '""')}"`;
}

function writeCsv(file, rows, headers) {
  fs.writeFileSync(file, `${[headers.join(','), ...rows.map(row => headers.map(h => csvEscape(row[h])).join(','))].join('\n')}\n`);
}

function mdTable(rows, columns) {
  const header = `| ${columns.map(c => c.label).join(' | ')} |`;
  const sep = `| ${columns.map(c => c.align === 'right' ? '---:' : '---').join(' | ')} |`;
  const body = rows.map(row => `| ${columns.map(c => clean(row[c.key]).replace(/\|/g, '/')).join(' | ')} |`);
  return [header, sep, ...body].join('\n');
}

function by(rows, key, value) {
  return rows.find(row => row[key] === value) || {};
}

const rawRows = csv('data_processed/cross_source_universe_raw.csv');
const dedupRows = csv('data_processed/cross_source_universe_dedup.csv');
const manifest = csv('data_processed/evidence_artifact_manifest.csv');
const frontmatter = csv('data_processed/russian_frontmatter_dashboard.csv');
const nicheRollup = csv('data_processed/global_niche_count_rollup.csv');
const nicheReconciliation = csv('data_processed/niche_count_reconciliation.csv');
const tam = csv('data_processed/tam_sam_som_model.csv');
const gates = csv('data_processed/global_hypothesis_gate_snapshot.csv');
const sourceAppendix = csv('data_processed/global_hypothesis_source_appendix.csv');
const readability = csv('data_processed/global_report_readability_audit.csv');
const p0Slice = csv('data_processed/p0_validation_execution_slice.csv');
const whitespaceAudience = csv('data_processed/global_whitespace_audience_synthesis.csv');
const archetypes = csv('data_processed/global_competitor_archetype_rollup.csv');

const intersection = by(tam, 'pillar', 'intersection');
const weighted = by(tam, 'pillar', 'confidence_weighted_intersection');
const h1 = by(gates, 'hypothesis_id', 'H1');
const h2 = by(gates, 'hypothesis_id', 'H2');
const h3 = by(gates, 'hypothesis_id', 'H3');
const h4 = by(gates, 'hypothesis_id', 'H4');
const h5 = by(gates, 'hypothesis_id', 'H5');
const h6 = by(gates, 'hypothesis_id', 'H6');

const glossaryRows = [
  {
    term: 'evidence-first',
    russian_label: 'сначала доказательства, потом вывод',
    plain_explanation_ru: 'Каждый сильный вывод должен иметь файл, строку, источник, capture row или наблюдение, а не только красивую гипотезу.',
    how_to_read_in_report_ru: 'Если evidence еще не наблюдаемое, отчет оставляет гипотезу в hold_validate.',
    common_misread_ru: 'Не читать большой объем таблиц как доказанный спрос.'
  },
  {
    term: 'raw source rows',
    russian_label: 'сырьевые строки источников',
    plain_explanation_ru: 'Все собранные строки до строгого удаления дублей: приложения, страницы, reviews, forum mentions и другие source records.',
    how_to_read_in_report_ru: 'Это масштаб сбора, а не количество уникальных конкурентов.',
    common_misread_ru: 'Не складывать raw rows как число приложений.'
  },
  {
    term: 'dedup',
    russian_label: 'уникализация',
    plain_explanation_ru: 'Попытка убрать повторы одного и того же продукта или source-record в рамках выбранного scope.',
    how_to_read_in_report_ru: 'Global dedup отвечает за весь пакет, niche dedup отвечает за корзину ниши.',
    common_misread_ru: 'Niche dedup по пяти рынкам нельзя складывать как уникальные продукты.'
  },
  {
    term: 'TAM/SAM/SOM',
    russian_label: 'рыночная рамка',
    plain_explanation_ru: 'TAM показывает большой рынок, SAM - достижимую часть вокруг идеи, SOM - осторожный сценарий возможной доли.',
    how_to_read_in_report_ru: 'В этом отчете это range-based методология и stress-test, а не прогноз выручки Alina.',
    common_misread_ru: 'Не читать TAM/SAM/SOM как обещание revenue.'
  },
  {
    term: 'whitespace',
    russian_label: 'белое пятно',
    plain_explanation_ru: 'Не пустой рынок, а место, где конкуренты могут не закрывать конкретную причинную петлю продукта.',
    how_to_read_in_report_ru: 'Для Alina белое пятно проверяется как meaning -> action -> reset -> visible progress.',
    common_misread_ru: 'Не писать “конкурентов нет”: конкуренты есть, вопрос в незакрытой связке.'
  },
  {
    term: 'gate / hold_validate',
    russian_label: 'ворота решения / держать на проверке',
    plain_explanation_ru: 'Gate показывает, можно ли усиливать гипотезу. Hold_validate значит: данных достаточно для следующего теста, но не для финального go.',
    how_to_read_in_report_ru: 'Все H1-H6 сейчас остаются hold_validate.',
    common_misread_ru: 'Hold_validate не равно провал; это честная пауза до observed evidence.'
  },
  {
    term: 'observed evidence',
    russian_label: 'наблюдаемое доказательство',
    plain_explanation_ru: 'То, что реально зафиксировано руками: walkthrough, скриншот, интервью, цитата, prototype session, paywall boundary.',
    how_to_read_in_report_ru: 'Без observed evidence нельзя закрывать H1/H3/H4/H5/H6.',
    common_misread_ru: 'Secondary VOC и listing-only данные помогают, но не заменяют живую проверку.'
  },
  {
    term: 'walkthrough',
    russian_label: 'ручной проход продукта',
    plain_explanation_ru: 'Проверка приложения от первого экрана до первого value moment, действия, progress/avatar feedback и paywall.',
    how_to_read_in_report_ru: 'Нужен, чтобы убрать риск скрытого клона Alina.',
    common_misread_ru: 'Public listing не равен walkthrough внутри продукта.'
  },
  {
    term: 'paywall / WTP',
    russian_label: 'платная граница / готовность платить',
    plain_explanation_ru: 'Где продукт просит деньги, за какую глубину и готов ли пользователь воспринимать это как честную платную ценность.',
    how_to_read_in_report_ru: 'H2 пока поддержан proxy и paid-flow signoff, но не закрыт финально.',
    common_misread_ru: 'Наличие подписки у конкурента не доказывает willingness-to-pay за Alina.'
  },
  {
    term: 'ICP',
    russian_label: 'первичный пользовательский сегмент',
    plain_explanation_ru: 'Не демография, а группа с похожим поведением, болью, workaround и языком покупки.',
    how_to_read_in_report_ru: 'Первые сегменты: Spiritual self-improvers и Habit and progress users.',
    common_misread_ru: 'Не выбирать ICP по вкусу команды без recent-behavior интервью.'
  },
  {
    term: 'prototype scorecard',
    russian_label: 'карта проверки прототипа',
    plain_explanation_ru: 'Набор метрик, которые показывают, понял ли пользователь петлю и захотел ли вернуться.',
    how_to_read_in_report_ru: 'H4/H6 нельзя усиливать до prototype sessions и scorecard rows.',
    common_misread_ru: 'Готовый прототипный стимул не равен доказанному конкурентному преимуществу.'
  },
  {
    term: 'benchmark-only',
    russian_label: 'только как ориентир механик',
    plain_explanation_ru: 'Рынок полезен для изучения паттернов, но не считается прямым доказательством спроса на Alina.',
    how_to_read_in_report_ru: 'Gaming/progression остается benchmark-only до доказанного overlap с пользовательской задачей.',
    common_misread_ru: 'Не включать gaming напрямую в claim о TAM или whitespace Alina.'
  }
];

writeCsv(GLOSSARY_OUT, glossaryRows, [
  'term',
  'russian_label',
  'plain_explanation_ru',
  'how_to_read_in_report_ru',
  'common_misread_ru'
]);

const nicheRows = nicheRollup.map(row => ({
  market: row.market_ru,
  role: ({
    mindfulness: 'состояние и reset',
    mindfulness_reset: 'состояние и reset',
    coaching: 'действие и язык роста',
    astrology_esoterics: 'личный смысл и персональные интерпретации',
    avatar_identity: 'видимый образ изменения',
    gaming_progression: 'механики прогресса и возврата'
  })[row.market_id] || row.market_id,
  counts: `${fmt(row.direct_app_store_dedup_rows)} direct app dedup; ${fmt(row.all_source_dedup_rows)} all-source dedup`,
  boundary: row.market_id === 'gaming_progression'
    ? 'benchmark-only, не прямой TAM'
    : 'directional market evidence, не proof спроса'
}));

const directAppSum = by(nicheReconciliation, 'count_type_ru', 'sum of direct app-store dedup rows by niche');
const allSourceNicheSum = by(nicheReconciliation, 'count_type_ru', 'sum of all-source niche dedup rows');
const intersectionSam = firstNumber(intersection.samBase, intersection.sam_base, intersection.sam_usd, intersection.confidence_weighted_sam_usd);
const weightedSam = firstNumber(weighted.samBase, weighted.sam_base, weighted.sam_usd, intersection.confidence_weighted_sam_usd, intersectionSam * 0.4);

const p0Blocks = [...new Set(p0Slice.map(row => row.execution_block_ru).filter(Boolean))];
const topArchetypes = archetypes
  .slice()
  .sort((a, b) => num(b.close_or_direct_apps) - num(a.close_or_direct_apps))
  .slice(0, 5)
  .map(row => ({
    archetype: row.archetype,
    signal: `${row.close_or_direct_apps} close/direct; ${row.paid_signal_apps} paid signals`,
    read: 'карта соседних решений, не proof Alina'
  }));

const reportLines = [];
reportLines.push('# Alina Research. Русская reader version');
reportLines.push('');
reportLines.push(`Собрано: ${new Date().toISOString().slice(0, 10)}`);
reportLines.push('');
reportLines.push('## Что это за версия');
reportLines.push('');
reportLines.push('Это читательская версия поверх большого evidence pack. Она нужна, чтобы пройти исследование как последовательный русский рассказ: идея, рынки, деньги, конкуренты, белое пятно, аудитория, продуктовая петля и следующий validation step. Тяжелые таблицы остаются в полном отчете и приложениях; здесь оставлены только числа, без которых выводы нельзя читать честно.');
reportLines.push('');
reportLines.push('Короткий вывод: Alina стоит дальше проверять как мировую consumer-app гипотезу, но еще нельзя объявлять доказанным продуктом. Сейчас доказано не “мы нашли PMF”, а “у нас есть большая карта рынка, денег, конкурентов, аудитории и понятная очередь наблюдаемой проверки”.');
reportLines.push('');
reportLines.push('## Сначала числа, чтобы не потеряться');
reportLines.push('');
reportLines.push(`Собрано ${fmt(rawRows.length)} сырьевых строк и ${fmt(dedupRows.length)} global dedup строк. В manifest сейчас ${fmt(manifest.length)} локальных артефактов; missing=0. По пяти нишам direct app-store слой дает ${fmt(directAppSum.count_value)} строк, а all-source niche слой дает ${fmt(allSourceNicheSum.count_value)} строк. Эти числа отвечают на разные вопросы и не складываются в одно “количество приложений”.`);
reportLines.push('');
reportLines.push(mdTable(nicheRows, [
  { key: 'market', label: 'Направление' },
  { key: 'role', label: 'Роль в гипотезе Alina' },
  { key: 'counts', label: 'Сколько данных' },
  { key: 'boundary', label: 'Как читать осторожно' }
]));
reportLines.push('');
reportLines.push('## Какая продуктовая ставка проверяется');
reportLines.push('');
reportLines.push('Alina не должна быть еще одним habit tracker, meditation library, astrology feed или avatar toy. Рабочая ставка уже: короткая ежедневная петля, где личный смысл превращается в маленькое действие, действие поддерживается reset, а пользователь видит понятный progress или изменение образа себя. Ценность появляется только если человек понимает причинность: “я сделал маленький шаг, поэтому мой progress/avatar изменился”.');
reportLines.push('');
reportLines.push('Поэтому главный риск не в том, что wellness рынок маленький. Он большой. Главный риск в другом: может оказаться, что нужная петля уже закрыта конкурентами, или что пользователю не нужна связка meaning -> action -> reset -> visible progress как единый продукт.');
reportLines.push('');
reportLines.push('## Есть ли рынок и деньги');
reportLines.push('');
reportLines.push(`Денежная рамка поддерживает продолжение проверки: intersection SAM сейчас ${money(intersectionSam)}, confidence-weighted SAM ${money(weightedSam)}. Это не forecast выручки Alina, а способ не спорить вслепую о масштабе. H2 сейчас ближе остальных к доказательному состоянию, но тоже не закрыта: ${clean(h2.completed_count) || '28'} / ${clean(h2.required_count) || '40'} completed и ${clean(h2.success_count) || '8'} / ${clean(h2.success_threshold) || '12'} success.`);
reportLines.push('');
reportLines.push('Что можно сказать: в adjacent-рынках есть платные привычки, подписки и персональная глубина. Что нельзя сказать: “Alina точно заработает”, пока не проверены paid-flow границы и willingness-to-pay на самой продуктовой петле.');
reportLines.push('');
reportLines.push('## Что видно по конкурентам');
reportLines.push('');
reportLines.push('Конкуренты не опровергают идею, но и не доказывают ее. Они показывают, что пользователь уже решает куски задачи в разных категориях: reset отдельно, self-improvement отдельно, spiritual meaning отдельно, avatar/progress отдельно. Возможность Alina формулируется не как пустой рынок, а как проверяемая причинная связка.');
reportLines.push('');
reportLines.push(mdTable(topArchetypes, [
  { key: 'archetype', label: 'Архетип конкурентов' },
  { key: 'signal', label: 'Сигнал в базе' },
  { key: 'read', label: 'Как читать' }
]));
reportLines.push('');
reportLines.push('## Где может быть белое пятно');
reportLines.push('');
reportLines.push('Белое пятно сейчас узкое: daily meaning -> tiny action -> reset -> visible identity/progress. Mindfulness и avatar/identity выглядят чище как зоны для проверки редкой full-loop связки. Astrology/esoterics и coaching дают сильный язык аудитории и деньги, но там выше риск плотной конкуренции. Gaming/progression полезен как benchmark механик, но не как прямой рынок Alina.');
reportLines.push('');
reportLines.push(mdTable(whitespaceAudience.slice(0, 5).map(row => ({
  market: row.market_ru,
  whitespace: row.whitespace_read_ru,
  audience: row.primary_icp_segments_ru,
  first: row.first_validation_move_ru
})), [
  { key: 'market', label: 'Рынок' },
  { key: 'whitespace', label: 'Что видно' },
  { key: 'audience', label: 'Кто ближе' },
  { key: 'first', label: 'Первый ход' }
]));
reportLines.push('');
reportLines.push('## Кто может быть первым пользователем');
reportLines.push('');
reportLines.push('Рабочая аудитория описывается не возрастом и страной, а поведением: digital ritual users. Это люди, которые уже используют приложения, чтобы регулировать состояние, получать персональный смысл, возвращаться к практике, видеть прогресс и иногда платить за глубину. Первые два сегмента для проверки: Spiritual self-improvers и Habit and progress users.');
reportLines.push('');
reportLines.push('У этого вывода жесткая граница: secondary VOC и Reddit/forum signals помогают говорить языком пользователя, но не заменяют recent-behavior интервью. H5 пока не доказана: ' + `${clean(h5.completed_count) || '12'} / ${clean(h5.required_count) || '96'} completed и ${clean(h5.success_count) || '0'} / ${clean(h5.success_threshold) || '30'} success.`);
reportLines.push('');
reportLines.push('## Что должен проверить MVP');
reportLines.push('');
reportLines.push('MVP должен проверить не весь будущий продукт, а одну причинную сессию: entry в личный смысл, короткий контекстный prompt, одно приземленное действие, короткий reset, evidence сделанного шага, visible progress/avatar feedback и hook на завтра. Если участник не может своими словами объяснить, что изменилось и почему, H4/H6 нельзя усиливать.');
reportLines.push('');
reportLines.push(`Сейчас H4: ${clean(h4.completed_count) || '16'} / ${clean(h4.required_count) || '80'} completed, ${clean(h4.success_count) || '0'} / ${clean(h4.success_threshold) || '32'} success. H6: ${clean(h6.completed_count) || '16'} / ${clean(h6.required_count) || '80'} completed, ${clean(h6.success_count) || '0'} / ${clean(h6.success_threshold) || '32'} success. Это значит, что прототип готов к проверке, но не доказан пользователями.`);
reportLines.push('');
reportLines.push('## Текущий статус гипотез');
reportLines.push('');
reportLines.push('Все шесть gates остаются в hold_validate. Это важная честность отчета: рынок, конкуренты, деньги и аудитория уже разложены, но observed validation еще не закрыла walkthrough, интервью, prototype sessions и WTP.');
reportLines.push('');
reportLines.push(mdTable([
  { h: 'H1/H3', status: 'форма продукта и whitespace', progress: `${clean(h1.completed_count) || '12'} / ${clean(h1.required_count) || '60'}; ${clean(h3.completed_count) || '12'} / ${clean(h3.required_count) || '60'}`, next: 'manual app walkthrough P0 конкурентов' },
  { h: 'H2', status: 'деньги и WTP', progress: `${clean(h2.completed_count) || '28'} / ${clean(h2.required_count) || '40'}; success ${clean(h2.success_count) || '8'} / ${clean(h2.success_threshold) || '12'}`, next: 'paid-flow boundary и WTP questions' },
  { h: 'H5', status: 'аудитория', progress: `${clean(h5.completed_count) || '12'} / ${clean(h5.required_count) || '96'}`, next: 'recent-behavior interviews' },
  { h: 'H4/H6', status: 'преимущество и MVP-петля', progress: `${clean(h4.completed_count) || '16'} / ${clean(h4.required_count) || '80'}; ${clean(h6.completed_count) || '16'} / ${clean(h6.required_count) || '80'}`, next: 'prototype sessions и scorecard' }
], [
  { key: 'h', label: 'Гипотеза' },
  { key: 'status', label: 'Что проверяет' },
  { key: 'progress', label: 'Где сейчас' },
  { key: 'next', label: 'Что нужно дальше' }
]));
reportLines.push('');
reportLines.push('## Что делать первым');
reportLines.push('');
reportLines.push(`Первая рабочая сессия уже сведена в P0 execution slice: ${p0Slice.length} задач. Порядок: ${p0Blocks.join(' -> ')}. Это не новый proof, а маршрут к proof.`);
reportLines.push('');
reportLines.push(mdTable(p0Slice.slice(0, 8).map(row => ({
  rank: row.slice_rank,
  target: row.target,
  h: row.linked_hypotheses,
  action: row.operator_action_ru,
  file: row.output_file_to_update
})), [
  { key: 'rank', label: '#' },
  { key: 'target', label: 'Что проверить' },
  { key: 'h', label: 'H' },
  { key: 'action', label: 'Действие' },
  { key: 'file', label: 'Куда писать' }
]));
reportLines.push('');
reportLines.push('## Как читать термины');
reportLines.push('');
reportLines.push('Ниже короткий словарь терминов, которые оставлены в отчете как рабочие labels. Полный словарь лежит отдельным CSV/MD, чтобы внешний читатель не спотыкался о технический язык.');
reportLines.push('');
reportLines.push(mdTable(glossaryRows.slice(0, 8).map(row => ({
  term: row.term,
  ru: row.russian_label,
  read: row.plain_explanation_ru
})), [
  { key: 'term', label: 'Термин' },
  { key: 'ru', label: 'По-русски' },
  { key: 'read', label: 'Смысл' }
]));
reportLines.push('');
reportLines.push('## Где лежит доказательная база');
reportLines.push('');
reportLines.push('Эта reader version не заменяет полный evidence pack. Для проверки источников использовать полный отчет, source appendix, manifest, capture sheets и P0 execution slice. Самое важное правило: если в capture sheet нет строки наблюдения, скриншота, цитаты, цены или scorecard-метрики, claim не усиливается.');
reportLines.push('');
reportLines.push('- `reports/alina-global-reader-report-v1.md`');
reportLines.push('- `reports/alina-global-hypothesis-report-v1.md`');
reportLines.push('- `reports/alina-global-executive-narrative-v1.md`');
reportLines.push('- `data_processed/russian_reader_glossary.csv`');
reportLines.push('- `docs/decision/russian-reader-glossary-v1.md`');
reportLines.push('- `data_processed/evidence_artifact_manifest.csv`');
reportLines.push('- `data_processed/p0_validation_execution_slice.csv`');
reportLines.push('- `data_processed/p0_observed_evidence_intake.csv`');

fs.writeFileSync(REPORT_OUT, `${reportLines.join('\n')}\n`);

const guideLines = [];
guideLines.push('# Russian Reader Glossary V1');
guideLines.push('');
guideLines.push(`Generated: ${new Date().toISOString().slice(0, 10)}`);
guideLines.push('');
guideLines.push('## Зачем нужен этот слой');
guideLines.push('');
guideLines.push('Этот слой снижает главный редакционный риск текущего отчета: русский текст местами перегружен техническими английскими labels. Словарь не меняет доказательства и не апгрейдит гипотезы; он объясняет, как читать рабочие термины без потери claim boundaries.');
guideLines.push('');
guideLines.push('## Словарь');
guideLines.push('');
guideLines.push(mdTable(glossaryRows.map(row => ({
  term: row.term,
  ru: row.russian_label,
  meaning: row.plain_explanation_ru,
  read: row.how_to_read_in_report_ru,
  avoid: row.common_misread_ru
})), [
  { key: 'term', label: 'Термин' },
  { key: 'ru', label: 'Русская рамка' },
  { key: 'meaning', label: 'Что значит' },
  { key: 'read', label: 'Как читать в отчете' },
  { key: 'avoid', label: 'Как не читать' }
]));
guideLines.push('');
guideLines.push('## Reader Report');
guideLines.push('');
guideLines.push(`- \`${REPORT_OUT}\``);
guideLines.push(`- \`${GLOSSARY_OUT}\``);
guideLines.push('- `reports/alina-global-hypothesis-report-v1.md`');
guideLines.push('- `reports/alina-global-executive-narrative-v1.md`');
guideLines.push('');
guideLines.push('## Boundary');
guideLines.push('');
guideLines.push('Reader/glossary слой улучшает форму подачи. Он не заменяет manual walkthrough, ICP interviews, prototype sessions и WTP validation.');

fs.writeFileSync(GUIDE_OUT, `${guideLines.join('\n')}\n`);

console.log(`reader_report=${REPORT_OUT}`);
console.log(`reader_glossary=${GLOSSARY_OUT}`);
console.log(`reader_guide=${GUIDE_OUT}`);
console.log(`glossary_rows=${glossaryRows.length}`);
console.log(`p0_rows=${p0Slice.length}`);
console.log(`readability_rows=${readability.length}`);
console.log(`source_appendix_rows=${sourceAppendix.length}`);
