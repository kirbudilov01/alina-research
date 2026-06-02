import fs from 'fs';
import path from 'path';

const ROOT = process.cwd();
const OUT = path.join(ROOT, 'reports', 'aura-research-final.md');

function read(file) {
  return fs.readFileSync(path.join(ROOT, file), 'utf8').trim();
}

function stripFirstTitle(markdown) {
  return markdown.replace(/^# .+\n+/, '').trim();
}

function mdTable(rows, columns) {
  const header = `| ${columns.map(c => c.label).join(' | ')} |`;
  const sep = `| ${columns.map(() => '---').join(' | ')} |`;
  const body = rows.map(row => `| ${columns.map(c => String(row[c.key] ?? '').replace(/\n/g, '<br>').replace(/\|/g, '/')).join(' | ')} |`);
  return [header, sep, ...body].join('\n');
}

function pageBreak() {
  return '<!-- PAGEBREAK -->';
}

function sanitize(markdown) {
  const replacements = [
    [/AURA MVP Specification v1/g, 'AURA Product Specification'],
    [/AURA Technical Blueprint v1/g, 'AURA Technical Blueprint'],
    [/AURA GTM Plan v1/g, 'AURA GTM Plan'],
    [/AURA PRD \/ Sprint Backlog v1/g, 'AURA Build Plan'],
    [/MVP Specification/gi, 'Product Specification'],
    [/PRD \/ Sprint Backlog/gi, 'Build Plan'],
    [/Sprint Backlog/gi, 'Sprint Plan'],
    [/Version:\s*v\d+/gi, ''],
    [/Версия:\s*v\d+/gi, ''],
    [/\bV1\.5\b/g, 'следующий этап'],
    [/\bV1\b/g, 'первый этап'],
    [/MVP /g, 'MVP '],
  ];
  let text = markdown;
  for (const [pattern, replacement] of replacements) text = text.replace(pattern, replacement);
  return text.replace(/\n{3,}/g, '\n\n').trim();
}

function dropSection(markdown, heading) {
  const escaped = heading.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const pattern = new RegExp(`\\n#{2,4} ${escaped}[\\s\\S]*?(?=\\n#{2,4} \\d+\\.|\\n# |$)`, 'g');
  return markdown.replace(pattern, '\n');
}

function researchScope(markdown, headings) {
  return headings.reduce((text, heading) => dropSection(text, heading), markdown).replace(/\n{3,}/g, '\n\n').trim();
}

function chapterIntro(title, question, why, decision) {
  return [
    '',
    '## Executive summary раздела',
    '',
    mdTable([
      { field: 'Что доказываем', value: question },
      { field: 'Почему это важно', value: why },
      { field: 'Какой вывод нужен', value: decision },
    ], [
      { key: 'field', label: 'Логика' },
      { key: 'value', label: 'Смысл' },
    ]),
  ].join('\n');
}

function conclusion(learned, decision, implication) {
  return [
    '',
    '## Вывод раздела',
    '',
    mdTable([
      { field: 'Что узнали', value: learned },
      { field: 'Какое решение приняли', value: decision },
      { field: 'Что это меняет в продукте', value: implication },
    ], [
      { key: 'field', label: 'Итог' },
      { key: 'value', label: 'Ответ' },
    ]),
  ].join('\n');
}

function coreLoopTable() {
  return mdTable([
    { step: '01', element: 'Episode', role: 'Смысл дня', risk: 'Пользователь не чувствует персональности.' },
    { step: '02', element: 'Action', role: 'Маленький шаг', risk: 'Инсайт остается пассивным контентом.' },
    { step: '03', element: 'Reset', role: 'Снятие сопротивления', risk: 'Переход к действию становится слишком тяжелым.' },
    { step: '04', element: 'Reflection', role: 'Доказательство опыта', risk: 'Нет связки между действием и памятью.' },
    { step: '05', element: 'Life Canvas', role: 'Видимый след', risk: 'Образ воспринимается как случайная AI-картинка.' },
    { step: '06', element: 'Tomorrow Hook', role: 'Возврат', risk: 'Нет причины вернуться завтра.' },
  ], [
    { key: 'step', label: 'Шаг' },
    { key: 'element', label: 'Элемент' },
    { key: 'role', label: 'Роль' },
    { key: 'risk', label: 'Что ломается без него' },
  ]);
}

const sources = {
  market: sanitize(stripFirstTitle(read('reports/alina-global-hypothesis-report-v1.md'))),
  product: researchScope(sanitize(stripFirstTitle(read('reports/aura-mvp-spec-v1.md'))), [
    '4. Detailed Screen Specifications',
    '11.1 API Payload Examples',
    '14. Analytics Events',
    '17. Edge Cases And Empty States',
    '16. Acceptance Criteria',
    '20. API And Backend Work Packages',
    '22. MVP Release Checklist',
    '23. What Designer Needs Next',
    '24. What Engineering Needs Next',
    '26. Open Questions For Design And Engineering',
  ]),
  tech: researchScope(sanitize(stripFirstTitle(read('reports/aura-technical-blueprint-v1.md'))), [
    '5. Database Schema Draft',
    '17. Implementation Backlog',
    '18. Event Taxonomy',
    '19. QA Checklist Before First Cohort',
  ]),
  gtm: sanitize(stripFirstTitle(read('reports/aura-gtm-plan-v1.md'))),
  build: researchScope(sanitize(stripFirstTitle(read('reports/aura-prd-sprint-backlog-v1.md'))), [
    '4. Detailed Backlog',
    '5. Epic Requirements',
    '7. Definition Of Done',
  ]),
};

const lines = [];

lines.push('# AURA Research Final');
lines.push('');
lines.push('## Startup Whitepaper + Evidence Report');
lines.push('');
lines.push('AURA - это потребительский AI-продукт на пересечении self-care, личного смысла, маленьких действий, визуального прогресса и возвращаемости. Главная ставка продукта: пользователь проходит короткую ежедневную петлю и видит, что его Life Canvas изменился не случайно, а как след собственного действия.');
lines.push('');
lines.push('Этот PDF нужен не для презентационного вау-эффекта, а для доказательства. Он отвечает на вопросы: почему рынок существует, почему в нем есть деньги, почему есть аудитория, где белое пятно, почему выбран именно такой MVP, почему GTM должен начинаться с ручной проверки и почему технический стек должен быть image-first, cost-controlled и analytics-first.');
lines.push('');
lines.push('## Центральная гипотеза');
lines.push('');
lines.push('[[DIAGRAM:core_loop]]');
lines.push('');
lines.push(coreLoopTable());
lines.push('');
lines.push('## Executive summary');
lines.push('');
lines.push(mdTable([
  { question: 'Почему рынок существует', answer: 'AURA опирается не на один рынок, а на пересечение mindfulness/reset, astrology/self-discovery, coaching/habits, avatar/identity и gaming/progression. Каждый рынок уже содержит платное поведение и привычные сценарии.' },
  { question: 'Почему есть деньги', answer: 'Соседние категории монетизируют подписки, premium-контент, персональные интерпретации, avatars, progression и digital identity. Для AURA это не гарантия выручки, но сильный направленный сигнал.' },
  { question: 'Почему есть аудитория', answer: 'Первые сегменты уже используют ритуалы саморефлексии, привычки, reset-практики, avatars/future-self и персональный контент. Это не холодный рынок.' },
  { question: 'Где белое пятно', answer: 'Белое пятно не в отсутствии конкурентов. Оно в разорванной причинной петле: смысл без действия, действие без образа, avatar без причины, progress без эмоционального контекста.' },
  { question: 'Почему такой MVP', answer: 'Первый продукт должен доказать одну цепочку: Episode -> Action -> Reset -> Reflection -> Life Canvas -> Tomorrow Hook. Все остальное вторично.' },
  { question: 'Почему такой GTM', answer: 'Первые пользователи нужны не как трафик, а как доказательство поведения. Поэтому старт идет через interviews, concierge cohort, прототип и только затем публичные каналы.' },
  { question: 'Почему такой стек', answer: 'Стек должен сохранять причинность, контролировать себестоимость и давать аналитику loop. Поэтому image-first, no free daily video, backend state machine, cost logs, analytics и admin-control.' },
], [
  { key: 'question', label: 'Вопрос' },
  { key: 'answer', label: 'Ответ' },
]));

lines.push(pageBreak());
lines.push('# ЧАСТЬ 1. Рынок, деньги и белое пятно');
lines.push(chapterIntro(
  'Рынок, деньги и белое пятно',
  'Есть ли вокруг AURA реальный мировой спрос, платное поведение и незанятая форма продукта?',
  'Без этого AURA останется красивой идеей без доказательной базы.',
  'Нужно понять, какие категории дают продуктовые слои, а не просто собрать большой список конкурентов.'
));
lines.push('');
lines.push('[[DIAGRAM:hypothesis_map]]');
lines.push('');
lines.push('[[DIAGRAM:category_intersection]]');
lines.push('');
lines.push('[[DIAGRAM:category_layers]]');
lines.push('');
lines.push('[[DIAGRAM:competitor_matrix]]');
lines.push('');
lines.push('[[DIAGRAM:segment_map]]');
lines.push('');
lines.push(sources.market);
lines.push(conclusion(
  'Рынок вокруг AURA существует как совокупность пяти соседних категорий, а не как уже готовая отдельная категория.',
  'Позиционировать AURA как causal life-series/self-change product, а не как horoscope app, avatar app или habit tracker.',
  'MVP должен проверять белое пятно через причинную петлю, а не через количество функций.'
));

lines.push(pageBreak());
lines.push('# ЧАСТЬ 2. Продукт и MVP');
lines.push(chapterIntro(
  'Продукт и MVP',
  'Что именно строим и как пользователь должен пройти первый причинный опыт?',
  'Самая большая недостающая информация после market research - не еще один рынок, а конкретный пользовательский путь.',
  'MVP должен быть не маленькой версией большого приложения, а точным тестом центральной петли.'
));
lines.push('');
lines.push('[[DIAGRAM:journey_map]]');
lines.push('');
lines.push('[[DIAGRAM:timeline_30]]');
lines.push('');
lines.push('[[DIAGRAM:life_canvas_cause]]');
lines.push('');
lines.push('[[DIAGRAM:service_blueprint]]');
lines.push('');
lines.push(sources.product);
lines.push(conclusion(
  'AURA становится продуктом, когда пользователь может объяснить, почему изменился Life Canvas.',
  'Первый релиз строится вокруг Episode, Action, Reset, Reflection, Life Canvas и Tomorrow Hook.',
  'Видео, маркетплейс, сообщество и социальная сеть исключаются из первого продукта, пока не доказана базовая петля.'
));

lines.push(pageBreak());
lines.push('# ЧАСТЬ 3. Технологии, архитектура и экономика');
lines.push(chapterIntro(
  'Технологии, архитектура и экономика',
  'Можно ли это собрать технически и не сломать себестоимость?',
  'AURA легко превратить в дорогую AI-игрушку. Архитектура должна защищать продукт от этой ошибки.',
  'Выбрать стек, который быстро проверяет петлю, хранит память, контролирует cost и не обещает ежедневное бесплатное видео.'
));
lines.push('');
lines.push('[[DIAGRAM:architecture_stack]]');
lines.push('');
lines.push('[[DIAGRAM:data_flow]]');
lines.push('');
lines.push('[[DIAGRAM:unit_economics]]');
lines.push('');
lines.push('[[DIAGRAM:cost_stack]]');
lines.push('');
lines.push('[[DIAGRAM:monetization_ladder]]');
lines.push('');
lines.push(sources.tech);
lines.push(conclusion(
  'Технически продукт реалистичен, если держать MVP image-first и считать стоимость каждого completed loop.',
  'В первом продукте нужны mobile app, backend state machine, Postgres, storage, AI/image layer, billing, analytics и admin.',
  'Самое важное ограничение: no free daily video. Видео можно тестировать позже как premium/token-момент.'
));

lines.push(pageBreak());
lines.push('# ЧАСТЬ 4. Монетизация и выход на рынок');
lines.push(chapterIntro(
  'Монетизация и выход на рынок',
  'Почему люди вернутся, почему заплатят и как получить первых пользователей?',
  'Даже сильный продукт провалится, если команда начнет с рекламы вместо проверки поведения.',
  'Запуск должен искать не просмотры, а доказательства: loop completion, causality comprehension, retention и paid intent.'
));
lines.push('');
lines.push('[[DIAGRAM:gtm_funnel]]');
lines.push('');
lines.push('[[DIAGRAM:channel_map]]');
lines.push('');
lines.push('[[DIAGRAM:content_wheel]]');
lines.push('');
lines.push('[[DIAGRAM:launch_timeline]]');
lines.push('');
lines.push('[[DIAGRAM:experiment_board]]');
lines.push('');
lines.push(sources.gtm);
lines.push(conclusion(
  'Первые 100 пользователей не покупаются рекламой: они нужны как проверка языка, доверия, причинности и повторного использования.',
  'GTM начинается с warm contacts, interviews, concierge cohort и content tests; публичное масштабирование идет позже.',
  'Маркетинг должен продавать не AI-картинку, а понятную трансформацию: действие сегодня меняет Life Canvas завтра.'
));

lines.push(pageBreak());
lines.push('# ЧАСТЬ 5. План сборки и решение о запуске');
lines.push(chapterIntro(
  'План сборки и решение о запуске',
  'Как превратить research в работу команды, бюджет и go/no-go решение?',
  'После доказательной базы нельзя уходить в бесконечное документирование. Нужно перейти к Figma, прототипу, интервью и первой когорте.',
  'Команда должна строить именно проверку loop, а не весь возможный продукт.'
));
lines.push('');
lines.push('[[DIAGRAM:sprint_roadmap]]');
lines.push('');
lines.push('[[DIAGRAM:dependency_map]]');
lines.push('');
lines.push('[[DIAGRAM:budget_chart]]');
lines.push('');
lines.push('[[DIAGRAM:go_no_go]]');
lines.push('');
lines.push('[[DIAGRAM:decision_tree]]');
lines.push('');
lines.push(sources.build);
lines.push(conclusion(
  'Research уже достаточно силен, чтобы перестать спорить о рынке и начать спорить о прототипе.',
  'Следующий шаг: Figma wireframes, low-fi prototype, 20 интервью и 30 concierge users.',
  'Главный риск проекта теперь внутри прототипа: сможет ли пользователь объяснить изменение Life Canvas как след собственного действия.'
));

lines.push(pageBreak());
lines.push('# Финальное решение');
lines.push('');
lines.push(mdTable([
  { field: 'Что строим', value: 'Мобильное приложение AURA: персональный daily life-series loop, где пользователь получает Episode, делает маленький Action, проходит Reset, фиксирует Reflection и видит причинное изменение Life Canvas.' },
  { field: 'Для кого', value: 'Первые сегменты: spiritual self-improvers, habit/progress users, reset users и avatar/future-self users. Приоритет - люди, у которых уже есть недавнее поведение вокруг self-work.' },
  { field: 'Почему может выстрелить', value: 'AURA соединяет существующие платные спросы в новый causal loop: смысл + действие + память + визуальный след + возврат.' },
  { field: 'Почему может провалиться', value: 'Если Life Canvas будет восприниматься как случайная AI-картинка, если действие не будет выполняться, если себестоимость image/video станет выше монетизации или если onboarding вызовет недоверие.' },
  { field: 'Что должно быть в MVP', value: 'Onboarding, consent, profile, season, daily episode, daily action, reset, reflection, Life Canvas, tomorrow hook, basic memory, analytics, paywall after value.' },
  { field: 'Что запрещено в MVP', value: 'Free daily video, marketplace, community, social network, AR, complex coaching platform, heavy avatar studio, endless content library.' },
  { field: 'Метрики успеха', value: 'Activation, completed loop, causality comprehension, D1/D7 retention, paid intent, cost per completed loop.' },
  { field: 'Метрики остановки', value: 'Пользователь не понимает causal link, не делает действие, не возвращается на Day 2, не доверяет персональным данным или не видит ценности в paywall.' },
], [
  { key: 'field', label: 'Вопрос' },
  { key: 'value', label: 'Решение' },
]));

fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(OUT, `${lines.join('\n').replace(/\n{3,}/g, '\n\n').trimEnd()}\n`);
console.log(`wrote ${OUT}`);
