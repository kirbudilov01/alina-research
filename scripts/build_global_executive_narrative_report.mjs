import fs from 'fs';

const OUT = 'reports/alina-global-executive-narrative-v1.md';

for (const dir of ['reports']) fs.mkdirSync(dir, { recursive: true });

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
  if (!fs.existsSync(file) && file === 'data_processed/cross_source_universe_raw.csv') {
    return csv('data_processed/cross_source_universe_raw_index.csv')
      .flatMap(row => fs.existsSync(row.file_path) ? csv(row.file_path) : []);
  }
  return fs.existsSync(file) ? parseCsv(fs.readFileSync(file, 'utf8')) : [];
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

function mdTable(rows, columns) {
  const header = `| ${columns.map(c => c.label).join(' | ')} |`;
  const sep = `| ${columns.map(c => c.align === 'right' ? '---:' : '---').join(' | ')} |`;
  const body = rows.map(row => `| ${columns.map(c => clean(row[c.key]).replace(/\|/g, '/')).join(' | ')} |`);
  return [header, sep, ...body].join('\n');
}

function by(rows, key, value) {
  return rows.find(row => row[key] === value) || {};
}

function ratioText(value) {
  return clean(value).replace(/\s*\/\s*/g, ' / ');
}

function verdictRu(value) {
  return ({
    strong_directional_money_case: 'сильный money context',
    medium_directional_money_case: 'средний money context',
    benchmark_money_visible_not_direct_tam: 'деньги видны, но это benchmark'
  })[clean(value)] || clean(value);
}

const rawRows = csv('data_processed/cross_source_universe_raw.csv');
const dedupRows = csv('data_processed/cross_source_universe_dedup.csv');
const manifest = csv('data_processed/evidence_artifact_manifest.csv');
const nicheRollup = csv('data_processed/global_niche_count_rollup.csv');
const marketMoney = csv('data_processed/market_money_triangulation.csv');
const tam = csv('data_processed/tam_sam_som_model.csv');
const gates = csv('data_processed/global_hypothesis_gate_snapshot.csv');
const goalCoverage = csv('data_processed/global_goal_evidence_coverage.csv');
const readability = csv('data_processed/global_report_readability_audit.csv');
const taxonomyQueue = csv('data_processed/competitor_taxonomy_cleanup_queue.csv');
const archetypes = csv('data_processed/global_competitor_archetype_rollup.csv');
const whitespaceAudience = csv('data_processed/global_whitespace_audience_synthesis.csv');
const nextBacklog = csv('data_processed/global_next_validation_backlog.csv');
const validationRollup = csv('data_processed/global_validation_executive_rollup.csv');
const russianStoryline = csv('data_processed/russian_sequential_storyline.csv');
const frontmatterDashboard = csv('data_processed/russian_frontmatter_dashboard.csv');

const intersection = by(tam, 'pillar', 'intersection');
const holdGates = gates.filter(row => clean(row.decision_ru) === 'оставить hold_validate');
const h1 = by(gates, 'hypothesis_id', 'H1');
const h2 = by(gates, 'hypothesis_id', 'H2');
const h3 = by(gates, 'hypothesis_id', 'H3');
const h4 = by(gates, 'hypothesis_id', 'H4');
const h5 = by(gates, 'hypothesis_id', 'H5');
const h6 = by(gates, 'hypothesis_id', 'H6');
const tableDensity = readability.find(row => row.audit_id === 'READ_03_TABLE_DENSITY') || {};

const marketRows = nicheRollup.map(row => ({
  market: row.market_ru,
  direct: row.direct_app_store_dedup_rows,
  total: row.all_source_dedup_rows,
  top100: row.top100_primary_competitors,
  read: row.market_id === 'gaming_progression'
    ? 'benchmark, не прямой TAM'
    : (row.money_verdict_ru || verdictRu(by(marketMoney, 'pillar', row.market_id)?.money_triangulation_verdict))
}));

const strongestArchetypes = archetypes
  .slice()
  .sort((a, b) => num(b.close_or_direct_apps) - num(a.close_or_direct_apps))
  .slice(0, 4)
  .map(row => `${row.archetype}: ${row.close_or_direct_apps} close/direct, ${row.paid_signal_apps} paid signals`)
  .join('; ');

const lines = [];
lines.push('# Alina Research. Executive narrative');
lines.push('');
lines.push(`Собрано: ${new Date().toISOString().slice(0, 10)}`);
lines.push('');
lines.push('## Короткий ответ');
lines.push('');
lines.push('Alina стоит дальше проверять как мировую consumer-app гипотезу на пересечении personal meaning, tiny action, short reset и visible progress. Сейчас это не доказанный продукт и не финальный инвестиционный claim. Это большой evidence-first пакет, который показывает: вокруг идеи есть пять платежеспособных adjacent-направлений, заметная конкурентная плотность, рабочая TAM/SAM/SOM методология, предварительное whitespace-окно и понятная P0-очередь валидации.');
lines.push('');
lines.push(`Масштаб базы сейчас: ${fmt(rawRows.length)} сырьевых source-строк, ${fmt(dedupRows.length)} уникализированных строк и ${fmt(manifest.length)} локальных артефактов в manifest. Главная граница: все шесть гипотез остаются в hold_validate, потому что observed evidence еще не закрыло walkthrough, интервью, prototype sessions и WTP.`);
lines.push('');
if (frontmatterDashboard.length) {
  const summaryRows = frontmatterDashboard.filter(row => row.block_ru === 'Сводка пакета');
  const nicheRows = frontmatterDashboard.filter(row => row.block_ru === 'Ниши');
  lines.push('## Главные числа');
  lines.push('');
  lines.push('Коротко перед чтением: это большой мировой desk/source пакет с понятными счетчиками по пяти направлениям, но не финальная validated версия продукта. Числа ниже нужны для ориентации в масштабе и границах evidence.');
  lines.push('');
  lines.push(mdTable(summaryRows.map(row => ({
    metric: row.metric_ru,
    value: row.value_ru,
    read: row.interpretation_ru,
    boundary: row.boundary_ru
  })), [
    { key: 'metric', label: 'Метрика' },
    { key: 'value', label: 'Значение' },
    { key: 'read', label: 'Как читать' },
    { key: 'boundary', label: 'Граница' }
  ]));
  lines.push('');
  lines.push(mdTable(nicheRows.map(row => ({
    niche: row.metric_ru,
    count: row.value_ru,
    read: row.interpretation_ru
  })), [
    { key: 'niche', label: 'Ниша' },
    { key: 'count', label: 'Сколько данных' },
    { key: 'read', label: 'Как читать' }
  ]));
  lines.push('');
}
if (russianStoryline.length) {
  lines.push('## Как устроен рассказ');
  lines.push('');
  lines.push('Эта версия специально идет не от таблиц, а от цепочки вопросов. Сначала фиксируется продуктовая ставка, затем статус доказательств, потом пять рынков и деньги, затем конкуренты, whitespace, аудитория, MVP и очередь валидации. Такой порядок взят из образца Alina как форма, но применен к мировому рынку.');
  lines.push('');
  lines.push(mdTable(russianStoryline.slice(0, 10).map(row => ({
    step: row.storyline_id,
    question: row.reader_question_ru,
    conclusion: row.allowed_conclusion_ru,
    boundary: row.boundary_ru
  })), [
    { key: 'step', label: 'Шаг' },
    { key: 'question', label: 'Вопрос' },
    { key: 'conclusion', label: 'Что можно выводить' },
    { key: 'boundary', label: 'Что нельзя усиливать' }
  ]));
  lines.push('');
}
lines.push('## Логика продукта');
lines.push('');
lines.push('Базовая ставка Alina не в том, чтобы сделать еще один habit tracker, meditation library, astrology app или avatar toy. Ставка уже иная: короткая ежедневная петля, где личный смысл превращается в маленькое действие, действие поддерживается reset, а потом пользователь видит причинный progress или identity feedback. Если причинность не видна, продукт разваливается на красивую декорацию. Если действия нет, он превращается в чтение. Если reset живет отдельно, это просто meditation content.');
lines.push('');
lines.push('Поэтому главный вопрос не “есть ли большой wellness рынок”. Главный вопрос: можно ли доказать, что пользователю нужна именно связанная петля meaning -> action -> reset -> visible progress, и что конкуренты не закрывают ее уже внутри onboarding.');
lines.push('');
lines.push('## Пять рынков');
lines.push('');
lines.push('Рынок Alina нельзя честно свести к одной категории. Mindfulness дает reset и привычку платить за состояние. Coaching/self-improvement дает действие и язык роста. Astrology/esoterics дает personal meaning и willingness-to-pay за персональные интерпретации. Avatar/identity дает visible self-change. Gaming/progression нужен как benchmark механик возврата, но не как прямой TAM.');
lines.push('');
lines.push(mdTable(marketRows, [
  { key: 'market', label: 'Направление' },
  { key: 'direct', label: 'Direct app dedup', align: 'right' },
  { key: 'total', label: 'All-source dedup', align: 'right' },
  { key: 'top100', label: 'Top-100 apps', align: 'right' },
  { key: 'read', label: 'Как читать' }
]));
lines.push('');
lines.push(`Текущая intersection SAM-модель дает ${money(intersection.samBase)} base SAM и ${money(by(marketMoney, 'pillar', 'intersection').weighted_sam_base_usd)} confidence-weighted SAM. Это рамка для проверки, а не forecast выручки Alina. Gaming показывает большой money context, но остается benchmark mechanics, пока нет доказанного ritual/self-improvement overlap.`);
lines.push('');
lines.push('## Что видно по конкурентам');
lines.push('');
lines.push(`Конкурентная карта подтверждает не пустоту рынка, а обратное: пользователь уже решает части задачи через существующие приложения. Сильные группы сейчас: ${strongestArchetypes}. Главная продуктовая возможность формулируется узко: не “конкурентов нет”, а “конкуренты часто закрывают части петли, но не доказывают полную причинную связку personal meaning -> action -> reset -> visible identity/progress”.`);
lines.push('');
lines.push(`Одновременно competitor map нельзя читать механически. В taxonomy cleanup queue сейчас ${taxonomyQueue.length} строк, из них ${taxonomyQueue.filter(row => row.change_needed === 'suggested_change').length} suggested changes. Это значит, что часть AI companion / roleplay / tarot-oracle / habit-tracking классификаций требует ручного pass перед сильными конкурентными выводами.`);
lines.push('');
lines.push('## Где может быть whitespace');
lines.push('');
lines.push('Самое полезное белое пятно сейчас не широкое, а причинное: короткая трансформационная петля с visible feedback. Mindfulness и avatar/identity выглядят чище по редкости full-loop candidates, но все равно требуют walkthrough. Astrology/esoterics и coaching выглядят сильнее по аудитории и деньгам, но там выше плотность конкурентов, поэтому claim о whitespace слабее без ручной проверки.');
lines.push('');
lines.push(mdTable(whitespaceAudience.map(row => ({
  market: row.market_ru,
  loop: row.full_loop_rate_pct,
  read: row.whitespace_read_ru,
  icp: row.primary_icp_segments_ru || row.audience_fit_ru,
  move: row.first_validation_move_ru
})), [
  { key: 'market', label: 'Рынок' },
  { key: 'loop', label: 'Full-loop rate', align: 'right' },
  { key: 'read', label: 'Whitespace read' },
  { key: 'icp', label: 'ICP fit' },
  { key: 'move', label: 'Первый ход' }
]));
lines.push('');
lines.push('## Аудитория и MVP');
lines.push('');
lines.push('Рабочая аудитория пока описывается поведением, а не демографией: digital ritual users. Это люди, которые уже используют приложения, чтобы регулировать состояние, получать personal meaning, видеть прогресс, возвращаться к практике и иногда платить за depth или personalization. Два P0-сегмента для старта: Spiritual self-improvers и Habit and progress users. Первый проверяет доверие к personal meaning, второй - может ли action-tied progress заменить тяжелый checklist/streak pressure.');
lines.push('');
lines.push('MVP не должен проверять весь будущий продукт. Он должен проверить одну причинную петлю: daily meaning entry -> tiny context prompt -> one grounded action -> short reset -> action evidence -> identity/avatar feedback -> next-day hook. Если участник не может своими словами объяснить, что изменилось и почему, H4/H6 нельзя усиливать.');
lines.push('');
lines.push('## Статус доказательств');
lines.push('');
lines.push(`Текущий статус жесткий и честный: ${holdGates.length} / ${gates.length} gates остаются hold_validate. H1: ${ratioText(h1.completed_vs_required)} completed и ${ratioText(h1.success_vs_threshold)} success; H3: ${ratioText(h3.completed_vs_required)} и ${ratioText(h3.success_vs_threshold)}; H2: ${ratioText(h2.completed_vs_required)} и ${ratioText(h2.success_vs_threshold)}; H5: ${ratioText(h5.completed_vs_required)} и ${ratioText(h5.success_vs_threshold)}; H4: ${ratioText(h4.completed_vs_required)} и ${ratioText(h4.success_vs_threshold)}; H6: ${ratioText(h6.completed_vs_required)} и ${ratioText(h6.success_vs_threshold)}.`);
lines.push('');
if (validationRollup.length) {
  lines.push('Observed validation пока не закрывает claims: listing-only, secondary VOC и prototype-readiness помогают запустить проверку, но не заменяют app walkthrough, recent-behavior interviews, prototype sessions и willingness-to-pay evidence.');
  lines.push('');
}
lines.push('## Что делать дальше');
lines.push('');
lines.push('Следующий скачок качества должен прийти не от бесконечного расширения desk research, а от observed rows. Правильный порядок: сначала hidden-clone walkthrough P0-конкурентов, затем paid-flow/WTP, затем P0 ICP interviews, затем prototype sessions. После каждого блока нужно обновлять capture sheets, gates, отчет, PDF и Git history.');
lines.push('');
lines.push(mdTable(nextBacklog.slice(0, 8).map(row => ({
  id: row.command_id || row.task_id || row.backlog_id,
  h: row.linked_hypotheses || row.hypothesis_id,
  step: row.operator_action_ru || row.next_action_ru || row.task_ru || row.action_ru,
  evidence: row.output_file_to_update || row.evidence_file || row.target_file || row.output_file
})), [
  { key: 'id', label: 'ID' },
  { key: 'h', label: 'H' },
  { key: 'step', label: 'Следующий шаг' },
  { key: 'evidence', label: 'Куда писать evidence' }
]));
lines.push('');
lines.push('## Как читать этот документ');
lines.push('');
lines.push(`Это executive narrative поверх полного evidence pack. Он специально короче основного отчета, потому что readability audit показал: полный документ логичен, но перегружен таблицами (${tableDensity.evidence_seen_ru || 'table density high'}). Для решений использовать эту версию как входную историю, а полный отчет, manifest, source appendix и capture sheets - как доказательную базу.`);
lines.push('');
lines.push('## Файлы');
lines.push('');
lines.push('- `reports/alina-global-executive-narrative-v1.md`');
lines.push('- `reports/alina-global-hypothesis-report-v1.md`');
lines.push('- `output/pdf/alina-global-executive-narrative-v1.pdf`');
lines.push('- `data_processed/evidence_artifact_manifest.csv`');
lines.push('- `data_processed/global_report_readability_audit.csv`');
lines.push('- `data_processed/russian_sequential_storyline.csv`');
lines.push('- `data_processed/russian_frontmatter_dashboard.csv`');

fs.writeFileSync(OUT, `${lines.join('\n')}\n`);

console.log(`global_executive_narrative=${OUT}`);
console.log(`raw_rows=${rawRows.length}`);
console.log(`dedup_rows=${dedupRows.length}`);
console.log(`manifest_rows=${manifest.length}`);
