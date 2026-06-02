import fs from 'fs';
import path from 'path';

const ROOT = process.cwd();
const SOURCE = path.join(ROOT, 'reports', 'aura-master-book.md');
const OUT = path.join(ROOT, 'reports', 'aura-future-structure-map.md');
const SOURCE_PDF_PAGES = 203;

function mdTable(rows, columns) {
  const header = `| ${columns.map(c => c.label).join(' | ')} |`;
  const sep = `| ${columns.map(() => '---').join(' | ')} |`;
  const body = rows.map(row => `| ${columns.map(c => String(row[c.key] ?? '').replace(/\n/g, '<br>').replace(/\|/g, '/')).join(' | ')} |`);
  return [header, sep, ...body].join('\n');
}

function bullets(items) {
  return items.map(item => `- ${item}`).join('\n');
}

function fmt(n) {
  return `${Math.round(n * 10) / 10}`;
}

const sourceSections = {
  intro: { title: 'Вступление: AURA / Product Master Plan / главная схема / как читать', current: 'Вступление', pages: 0.7 },
  chapterIntro: { title: 'Зачем нужна глава + центральная петля', current: 'Повторяющиеся вводные блоки глав', pages: 2.8 },
  hypothesisMap: { title: 'Карта проверки гипотез', current: 'Глава 1', pages: 0.1 },
  categoryVisuals: { title: 'Карта категорий / категории как слои продукта', current: 'Глава 1', pages: 0.2 },
  competitorVisual: { title: 'Карта конкурентного поля', current: 'Глава 1', pages: 0.1 },
  audienceVisual: { title: 'Карта первых аудиторий', current: 'Глава 1', pages: 0.2 },
  hypothesis1: { title: 'ОПИСАНИЕ ПРОЕКТА И ГИПОТЕЗА #1', current: 'Глава 1', pages: 3.3 },
  markets: { title: 'ОПРЕДЕЛЕНИЕ МИРОВЫХ ЦЕЛЕВЫХ РЫНКОВ И ГИПОТЕЗА #2', current: 'Глава 1', pages: 12.5 },
  tam: { title: 'ОЦЕНКА РАЗМЕРА РЫНКА: TAM/SAM/SOM', current: 'Глава 1', pages: 3.3 },
  entryScenarios: { title: 'СЦЕНАРИИ ВХОДА КАК СВЯЗУЮЩЕЕ ЗВЕНО', current: 'Глава 1', pages: 3.2 },
  competitors: { title: 'ОПРЕДЕЛЕНИЕ КОНКУРЕНТОВ И ГИПОТЕЗА #3', current: 'Глава 1', pages: 5.3 },
  advantage: { title: 'КОНКУРЕНТНОЕ ПРЕИМУЩЕСТВО И ГИПОТЕЗА #4', current: 'Глава 1', pages: 1.1 },
  whitespaceAudience: { title: 'СВЯЗКА БЕЛОГО ПЯТНА И АУДИТОРИИ', current: 'Глава 1', pages: 1.7 },
  audienceHypothesis: { title: 'АУДИТОРИЯ, ИНТЕРВЬЮ И ГИПОТЕЗА #5', current: 'Глава 1', pages: 1.3 },
  observations: { title: 'КЛЮЧЕВЫЕ НАБЛЮДЕНИЯ И ВОПРОСЫ ДЛЯ ПРОВЕРКИ', current: 'Глава 1', pages: 1.3 },
  productModel: { title: 'ИТОГОВАЯ МОДЕЛЬ ПРОДУКТА И ГИПОТЕЗА #6', current: 'Глава 1', pages: 38.6 },
  risksPillars: { title: 'СТОЛПЫ УВЕРЕННОСТИ И ОТКРЫТЫЕ РИСКИ', current: 'Глава 1', pages: 0.9 },
  validationPlan: { title: 'ПЛАН ПРОВЕРКИ САМЫХ ВАЖНЫХ РИСКОВ', current: 'Глава 1', pages: 10.9 },
  decisionVersion: { title: 'ВЕРСИЯ ДЛЯ РЕШЕНИЯ: запуск, ТЗ, бюджет, MVP', current: 'Глава 1', pages: 26.4 },
  nextLogic: { title: 'БЛИЖАЙШАЯ ЛОГИКА ПРОВЕРКИ', current: 'Глава 1', pages: 0.9 },
  sourcesLimits: { title: 'ИСТОЧНИКИ И ГРАНИЦЫ ДОКАЗАТЕЛЬСТВ', current: 'Глава 1', pages: 1.4 },
  strategyFast: { title: 'БЫСТРЫЕ ВЫВОДЫ ДЛЯ СТРАТЕГИИ', current: 'Глава 1', pages: 0.6 },
  productBlueprint: { title: 'Product Blueprint / User Journey / Screen Map', current: 'Глава 2', pages: 4.4 },
  screenSpecs: { title: 'Detailed Screen Specifications', current: 'Глава 2', pages: 5.3 },
  productSpec: { title: 'User Stories / Core Scenarios / Scope / Mechanics / Function-Level Specification', current: 'Глава 2', pages: 6.2 },
  productSystem: { title: 'Data Model / API / User States / State Machine / Analytics / Metrics / Acceptance / Edge Cases', current: 'Глава 2', pages: 8.9 },
  productExecution: { title: 'Build Plan / Release Checklist / Designer & Engineering Needs / Interview Script / Open Questions', current: 'Глава 2', pages: 5.5 },
  productFinal: { title: 'Итоговое определение продукта', current: 'Глава 2', pages: 0.7 },
  techVisuals: { title: 'Архитектура, поток данных, экономика, cost stack, монетизация - визуальные страницы', current: 'Глава 3', pages: 0.9 },
  techArchitecture: { title: 'Architecture Decision / System Architecture / Stack / Component Responsibilities', current: 'Глава 3', pages: 4.7 },
  techDataApi: { title: 'Database Schema Draft / API Groups / Provider Comparison', current: 'Глава 3', pages: 3.3 },
  unitEconomics: { title: 'Unit Economics / Sensitivity / Revenue / Cost Rules', current: 'Глава 3', pages: 3.1 },
  techOps: { title: 'Security / Build Phases / Engineering Roadmap / Technical Risks / Backlog / Event Taxonomy / QA', current: 'Глава 3', pages: 6.4 },
  techFinal: { title: 'Источники и допущения / Итоговое техническое решение', current: 'Глава 3', pages: 1.3 },
  gtmVisuals: { title: 'Воронка, каналы, контент, таймлайн, доска экспериментов - визуальные страницы', current: 'Глава 4', pages: 0.8 },
  gtmCore: { title: 'GTM Decision / Positioning / Audience Segments / First 100 / First 1000', current: 'Глава 4', pages: 4.0 },
  gtmChannels: { title: 'Content Pillars / Channel Playbooks / Launch Plan / Content Calendar / Experiments', current: 'Глава 4', pages: 4.7 },
  gtmExecution: { title: 'Creator Outreach / Landing / Messaging / Metrics / Interview Script / Budget / Hook Bank / Objections / Rhythm / Kill Criteria', current: 'Глава 4', pages: 8.9 },
  gtmFinal: { title: 'Итоговое решение по запуску', current: 'Глава 4', pages: 0.5 },
  buildVisuals: { title: 'Roadmap сборки / карта зависимостей / бюджет по спринтам', current: 'Глава 5', pages: 0.5 },
  buildPlan: { title: 'Requirements / Sprint Plan / Budget / Backlog / Epics / Dependencies / Definition of Done / Team Plan', current: 'Глава 5', pages: 9.9 },
  buildFinal: { title: 'Итоговое решение по разработке', current: 'Глава 5', pages: 0.6 },
  finalDecision: { title: 'Финальное решение / dashboard / decision tree / карта решений', current: 'Глава 6', pages: 1.4 },
};

const futureChapters = [
  {
    no: 1,
    title: 'Что такое AURA',
    targetPages: '6-8',
    reason: 'Сначала читатель должен за 3 минуты понять не рынок и не стек, а саму форму продукта.',
    subchapters: ['Короткое определение AURA', 'Центральная петля', 'Life Canvas как причинный след', 'Почему это не просто AI-картинка', 'Как читать книгу дальше'],
    sections: ['intro', 'hypothesis1', 'hypothesisMap', 'strategyFast'],
  },
  {
    no: 2,
    title: 'Как работает AURA',
    targetPages: '12-16',
    reason: 'После определения сразу показываем механизм: пользовательский loop должен стать опорой всей книги.',
    subchapters: ['Episode', 'Action', 'Reset', 'Reflection', 'Life Canvas', 'Tomorrow Hook', 'Накопление ценности Day 1 / Day 2 / Day 7 / Day 30', 'Service blueprint первого loop'],
    sections: ['productBlueprint', 'entryScenarios', 'productModel'],
  },
  {
    no: 3,
    title: 'Почему это может работать',
    targetPages: '30-38',
    reason: 'Только после понимания продукта доказываем, что вокруг него есть рынок, деньги, конкуренты и белое пятно.',
    subchapters: ['Пять категорий спроса', 'Размер рынка и деньги', 'Конкурентное поле', 'Повторяющиеся паттерны', 'Белое пятно', 'Границы доказательств'],
    sections: ['categoryVisuals', 'markets', 'tam', 'competitors', 'advantage', 'whitespaceAudience', 'sourcesLimits'],
  },
  {
    no: 4,
    title: 'Для кого это',
    targetPages: '10-14',
    reason: 'После market proof нужно сузить “рынок” до людей, у которых уже есть близкое поведение.',
    subchapters: ['Первые аудитории', 'ICP-сегменты', 'Пользовательские боли', 'Интервью и вопросы проверки', 'Что подтверждает / убивает гипотезу'],
    sections: ['audienceVisual', 'audienceHypothesis', 'observations', 'whitespaceAudience', 'gtmCore'],
  },
  {
    no: 5,
    title: 'Что мы строим',
    targetPages: '28-36',
    reason: 'Здесь книга превращает идею в MVP: функции, экраны, states, scope, продуктовые механики.',
    subchapters: ['MVP definition', 'User journey', 'Screen map', 'Detailed screen specs', 'Function-level specification', 'Scope: что делаем и что запрещено', 'Product copy principles', 'Validation script для прототипа'],
    sections: ['productModel', 'decisionVersion', 'screenSpecs', 'productSpec', 'productSystem', 'productExecution', 'productFinal'],
  },
  {
    no: 6,
    title: 'Как это строим',
    targetPages: '24-30',
    reason: 'После MVP показываем, как собрать продукт технически и не убить экономику генерацией.',
    subchapters: ['Architecture decision', 'System architecture', 'AI/image layer', 'Provider comparison', 'Data/API слой', 'Unit economics', 'Cost-control rules', 'Technical risks'],
    sections: ['techVisuals', 'techArchitecture', 'techDataApi', 'unitEconomics', 'techOps', 'techFinal'],
  },
  {
    no: 7,
    title: 'Как это продаем',
    targetPages: '20-26',
    reason: 'GTM должен идти после MVP и экономики: продаем не абстрактную идею, а конкретный loop и Life Canvas.',
    subchapters: ['Positioning', 'Первые 100 пользователей', 'Первые 1000 пользователей', 'Каналы', 'Контент-пиллары', 'Hook bank', 'Landing variants', 'Budget and operating rhythm'],
    sections: ['gtmVisuals', 'gtmCore', 'gtmChannels', 'gtmExecution', 'gtmFinal'],
  },
  {
    no: 8,
    title: 'Как принимаем решение',
    targetPages: '8-12',
    reason: 'Финал должен быть сильнее текущего: читатель должен понять критерии продолжения, изменения или остановки.',
    subchapters: ['Главные риски', 'Метрики петли', 'Kill criteria', 'Go / No-Go dashboard', 'Decision tree', 'Следующий шаг'],
    sections: ['risksPillars', 'validationPlan', 'nextLogic', 'finalDecision'],
  },
  {
    no: 9,
    title: 'Appendix / Evidence Layer',
    targetPages: '40-60',
    reason: 'Длинные таблицы и техническая детализация должны сохраняться, но не ломать основное чтение.',
    subchapters: ['Полные таблицы конкурентов', 'Расширенная база источников', 'Detailed backlog', 'API payload examples', 'Event taxonomy', 'QA checklist', 'Дополнительные capture sheets'],
    sections: ['markets', 'competitors', 'screenSpecs', 'productSystem', 'techDataApi', 'techOps', 'buildPlan'],
  },
];

const migrationRows = futureChapters.flatMap(chapter =>
  chapter.sections.map(key => ({
    current: sourceSections[key].title,
    from: sourceSections[key].current,
    to: `Глава ${chapter.no}. ${chapter.title}`,
    pages: sourceSections[key].pages,
    why: chapter.reason,
  }))
);

const volumeRows = [
  { area: 'Глава 1 текущей книги', current: '~114 стр', future: 'Разобрать на главы 1-5 и appendix', diagnosis: 'Главный перегруз: рынок, продукт, MVP, техчасть, GTM и validation живут вместе.' },
  { area: 'Product narrative', current: '~34 стр отдельно + ~39 стр внутри Главы 1', future: '~46-58 стр в главах 1,2,5', diagnosis: 'Должен стать первым слоем чтения, а не появляться после длинного market proof.' },
  { area: 'Market / competitors', current: '~30-40 стр в основном narrative + длинные таблицы', future: '~30-38 стр narrative + appendix', diagnosis: 'Доказательства нужны, но длинные таблицы лучше отделить от основного повествования.' },
  { area: 'Tech / economics', current: '~22 стр + куски в Главе 1', future: '~24-30 стр', diagnosis: 'Объем нормальный, но нужно собрать в одну главу после MVP.' },
  { area: 'GTM', current: '~19 стр + validation в Главе 1', future: '~20-26 стр', diagnosis: 'Хороший блок, но должен опираться на сформулированный MVP и unit economics.' },
  { area: 'Decision / risks', current: '~1-2 стр финала + риски размазаны', future: '~8-12 стр', diagnosis: 'Финальное решение сейчас слишком короткое относительно веса всей книги.' },
  { area: 'Appendix', current: 'Отдельно не выделен', future: '~40-60 стр', diagnosis: 'Нужен как слой сохранения данных без перегруза основного чтения.' },
];

const readerRows = [
  { time: '3 минуты', should: 'Понимает, что AURA - это daily life-series loop, где действие меняет Life Canvas.', chapters: 'Глава 1' },
  { time: '15 минут', should: 'Понимает, как работает Episode -> Action -> Reset -> Reflection -> Life Canvas -> Tomorrow Hook.', chapters: 'Главы 1-2' },
  { time: '45 минут', should: 'Понимает, почему вокруг продукта есть рынок, деньги, конкуренты и белое пятно.', chapters: 'Главы 1-4' },
  { time: '90 минут', should: 'Понимает MVP, стек, GTM, метрики, риски и следующий шаг к прототипу.', chapters: 'Главы 1-8' },
];

const testRows = [
  { criterion: 'Новый человек за 3 минуты понимает, что такое AURA', check: 'Глава 1 должна быть короткой, продуктовой и не начинаться с рынка.', status: 'Покрыто будущими главами 1 и 2' },
  { criterion: 'Продакт за 30 минут понимает, какой MVP строится', check: 'До технической части должны быть loop, journey, screen map, scope и функции.', status: 'Покрыто будущими главами 2 и 5' },
  { criterion: 'Инвестор за 45 минут понимает рынок, деньги и белое пятно', check: 'Market proof должен идти после продуктовой рамки, но до deep tech.', status: 'Покрыто будущими главами 1, 3, 4 и 8' },
  { criterion: 'Команда за 90 минут понимает путь к прототипу, стеку, GTM и go/no-go', check: 'После MVP должны идти tech, GTM, build/decision criteria и appendix.', status: 'Покрыто будущими главами 5-9' },
];

const audienceRows = [
  { audience: 'Инвестор', first: 'Главы 1,3,6,7,8', why: 'Быстро видит продукт, рынок, экономику, GTM и go/no-go.' },
  { audience: 'Фаундер', first: 'Главы 1-8', why: 'Получает полный путь от идеи до решения о запуске.' },
  { audience: 'Продакт', first: 'Главы 1,2,5,8', why: 'Видит loop, MVP, scope, метрики и критерии остановки.' },
  { audience: 'CTO', first: 'Главы 5,6,8 + appendix', why: 'Получает продуктовые границы, архитектуру, экономику и технические риски.' },
  { audience: 'Дизайнер', first: 'Главы 1,2,5', why: 'Понимает центральную петлю, экранную карту и эмоциональную механику Life Canvas.' },
  { audience: 'Маркетолог', first: 'Главы 1,3,4,7', why: 'Понимает позиционирование, аудиторию, белое пятно и каналы.' },
  { audience: 'Новый сотрудник', first: 'Главы 1,2,5,8', why: 'Быстро понимает продукт, что строится и как принимаются решения.' },
];

const lines = [];

lines.push('# AURA Future Structure Map');
lines.push('');
lines.push('## Цель');
lines.push('');
lines.push('Это не новая версия `AURA Product Master Plan` и не переписывание текста. Это структурная карта будущей книги: куда должен переехать текущий материал, если собирать AURA в product-first логике.');
lines.push('');
lines.push('Источник анализа: `reports/aura-master-book.md`. Текущий PDF: 203 страницы. Главный подтвержденный перекос: текущая Глава 1 занимает примерно 114 страниц и содержит материалы нескольких будущих глав.');
lines.push('');
lines.push('## Принцип будущей структуры');
lines.push('');
lines.push(bullets([
  'Сначала продукт: что такое AURA и как работает центральная петля.',
  'Потом доказательство: рынок, деньги, конкуренты, белое пятно.',
  'Потом пользователь: ICP, сегменты, интервью, боли.',
  'Потом решение: MVP, tech, GTM, метрики и go/no-go.',
  'Длинные таблицы не удаляются, а переезжают в evidence layer / appendix.',
]));
lines.push('');

lines.push('## Идеальное оглавление AURA');
lines.push('');
lines.push('Важно: если один текущий крупный раздел указан в нескольких будущих главах, это означает не дублирование текста, а разбор раздела на внутренние смысловые фрагменты. Например, текущая “Итоговая модель продукта” содержит и объяснение loop, и MVP, и монетизацию, и техническую реализуемость; в будущей книге эти части должны разъехаться по разным главам.');
lines.push('');
lines.push(mdTable(futureChapters.map(chapter => {
  const sourcePages = chapter.sections.reduce((sum, key) => sum + sourceSections[key].pages, 0);
  return {
    chapter: `Глава ${chapter.no}. ${chapter.title}`,
    subchapters: chapter.subchapters.join('; '),
    moved: chapter.sections.map(key => sourceSections[key].title).join('; '),
    sourcePages: `~${fmt(sourcePages)} стр текущего материала`,
    targetPages: chapter.targetPages,
    reason: chapter.reason,
  };
}), [
  { key: 'chapter', label: 'Будущая глава' },
  { key: 'subchapters', label: 'Подглавы' },
  { key: 'moved', label: 'Какие текущие разделы переезжают' },
  { key: 'sourcePages', label: 'Материал сейчас' },
  { key: 'targetPages', label: 'Целевой объем' },
  { key: 'reason', label: 'Почему такой порядок' },
]));
lines.push('');

lines.push('## Migration Map');
lines.push('');
lines.push(mdTable(migrationRows, [
  { key: 'current', label: 'Текущий раздел' },
  { key: 'from', label: 'Где сейчас' },
  { key: 'to', label: 'Куда переезжает' },
  { key: 'pages', label: 'Примерно страниц' },
  { key: 'why', label: 'Зачем переносится' },
]));
lines.push('');

lines.push('## Volume Map');
lines.push('');
lines.push(mdTable(volumeRows, [
  { key: 'area', label: 'Зона' },
  { key: 'current', label: 'Сейчас' },
  { key: 'future', label: 'Будущее распределение' },
  { key: 'diagnosis', label: 'Диагноз' },
]));
lines.push('');

lines.push('## Main Narrative vs Appendix');
lines.push('');
lines.push(mdTable([
  { layer: 'Основной narrative', content: 'Главы 1-8', role: 'Читатель проходит продуктовую историю от идеи до решения.', pages: '~130-170 стр' },
  { layer: 'Evidence appendix', content: 'Полные таблицы, источники, backlog/API/event/QA детали', role: 'Сохраняет доказательность без перегруза чтения.', pages: '~40-60 стр' },
  { layer: 'Deck / companion artifact', content: 'AURA Product Deck', role: 'Отвечает на вопрос “что строим” без всей доказательной базы.', pages: '25-30 слайдов' },
], [
  { key: 'layer', label: 'Слой' },
  { key: 'content', label: 'Что внутри' },
  { key: 'role', label: 'Роль' },
  { key: 'pages', label: 'Ориентир объема' },
]));
lines.push('');

lines.push('## Reader Journey');
lines.push('');
lines.push(mdTable(readerRows, [
  { key: 'time', label: 'Горизонт чтения' },
  { key: 'should', label: 'Что читатель должен понять' },
  { key: 'chapters', label: 'Какие главы это дают' },
]));
lines.push('');

lines.push('## Test Plan Для Будущей Структуры');
lines.push('');
lines.push(mdTable(testRows, [
  { key: 'criterion', label: 'Критерий' },
  { key: 'check', label: 'Как проверять' },
  { key: 'status', label: 'Где покрыто' },
]));
lines.push('');

lines.push('## Карта Для Аудиторий');
lines.push('');
lines.push(mdTable(audienceRows, [
  { key: 'audience', label: 'Аудитория' },
  { key: 'first', label: 'Главы первого чтения' },
  { key: 'why', label: 'Почему' },
]));
lines.push('');

lines.push('## Итоговое Решение По Структуре');
lines.push('');
lines.push(bullets([
  'Не делать инвесторское оглавление первым слоем. Для AURA лучше product-first структура.',
  'Текущую Главу 1 нужно не сокращать, а разложить между будущими главами 1-5 и appendix.',
  'Глава “Что такое AURA” должна появиться до market proof, иначе читатель долго читает доказательства до понимания продукта.',
  'Глава “Как работает AURA” должна закрепить loop до конкурентов, MVP и GTM.',
  'Финальное решение должно быть отдельной сильной главой, а не коротким завершением.',
  'Appendix обязателен: иначе основной narrative снова станет тяжелым и табличным.',
]));

fs.writeFileSync(OUT, `${lines.join('\n').trimEnd()}\n`);
console.log(`wrote ${OUT}`);
