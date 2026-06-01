import fs from 'fs';
import path from 'path';

const OUT = 'reports/aura-master-book-v1.md';

function read(file) {
  return fs.readFileSync(file, 'utf8').trim();
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

const sources = {
  research: stripFirstTitle(read('reports/alina-global-hypothesis-report-v1.md')),
  mvp: stripFirstTitle(read('reports/aura-mvp-spec-v1.md')),
  tech: stripFirstTitle(read('reports/aura-technical-blueprint-v1.md')),
  gtm: stripFirstTitle(read('reports/aura-gtm-plan-v1.md')),
  prd: stripFirstTitle(read('reports/aura-prd-sprint-backlog-v1.md')),
};

function pageBreak() {
  return '<!-- PAGEBREAK -->';
}

function chapterDivider(number, title, subtitle) {
  return [
    pageBreak(),
    `# ГЛАВА ${number}`,
    '',
    `# ${title}`,
    '',
    subtitle,
    '',
    mdTable([
      { label: 'Центральный вопрос главы', value: subtitle },
      { label: 'Красная нить', value: 'AURA существует только если пользователь понимает причинность: Life Canvas меняется из-за действия, а не потому что AI случайно нарисовал новую картинку.' },
      { label: 'Как читать', value: 'Сначала смотрим, зачем это важно, затем читаем содержательный блок, затем фиксируем решения.' }
    ], [
      { key: 'label', label: 'Слой' },
      { key: 'value', label: 'Смысл' }
    ])
  ].join('\n');
}

function intro(title, rows) {
  return [
    pageBreak(),
    `## Вводная страница: ${title}`,
    '',
    mdTable(rows, [
      { key: 'field', label: 'Вопрос' },
      { key: 'value', label: 'Ответ' }
    ])
  ].join('\n');
}

function conclusion(title, rows) {
  return [
    '',
    `## Вывод раздела: ${title}`,
    '',
    mdTable(rows, [
      { key: 'field', label: 'Что фиксируем' },
      { key: 'value', label: 'Решение / влияние на продукт' }
    ])
  ].join('\n');
}

const lines = [];

lines.push('# AURA MASTER BOOK');
lines.push('');
lines.push('AURA Product Master Plan');
lines.push('');
lines.push('Единая книга проекта: стратегия, исследование, продуктовая спецификация, технический план, unit economics, GTM и sprint backlog.');
lines.push('');
lines.push('Версия: v1');
lines.push('Проект: AURA');
lines.push('Центральная гипотеза: пользователь должен пройти петлю Episode -> Action -> Reset -> Reflection -> Avatar -> Tomorrow Hook и понять, что Life Canvas изменился из-за его действия.');
lines.push('');
lines.push(mdTable([
  { item: 'Что такое AURA', value: 'Mobile-first продукт, где личный контекст превращается в ежедневный эпизод, маленькое действие, reset, reflection и визуальный след в Life Canvas.' },
  { item: 'Главный риск', value: 'Не рынок, а понимание причинности Life Canvas. Если пользователь видит random AI image, продукт мертв. Если видит след своего действия, продукт жив.' },
  { item: 'Что входит в книгу', value: 'Исследование рынка и гипотез, MVP Specification, Technical Blueprint, Unit Economics, GTM Plan, PRD/Sprint Backlog.' },
  { item: 'Что не делаем сейчас', value: 'Не продолжаем бесконечный research. Следующий практический слой после master book: Figma wireframes и prototype interviews.' }
], [
  { key: 'item', label: 'Пункт' },
  { key: 'value', label: 'Смысл' }
]));
lines.push('');

lines.push('## Как читать эту книгу');
lines.push('');
lines.push(mdTable([
  { time: '10 минут', outcome: 'Понять, что такое AURA и почему центральная петля важнее красивой AI-картинки.' },
  { time: '30 минут', outcome: 'Понять, как работает продукт: onboarding, season, episode, action, reset, reflection, avatar, paywall.' },
  { time: '60 минут', outcome: 'Понять, почему проект существует: рынок, соседние категории, конкуренты, белое пятно, аудитория.' },
  { time: '90 минут', outcome: 'Понять, как строить: архитектура, unit economics, GTM, sprint backlog, team plan.' }
], [
  { key: 'time', label: 'Если есть' },
  { key: 'outcome', label: 'Читатель должен понять' }
]));
lines.push('');

lines.push('## Визуальный фреймворк проекта');
lines.push('');
lines.push(mdTable([
  { step: '1', block: 'Context', meaning: 'Дата рождения, состояние, запрос, тема сезона.', risk: 'Если контекст слабый, episode звучит generic.' },
  { step: '2', block: 'Episode', meaning: 'Смысл дня, конфликт, ресурс, риск.', risk: 'Если episode не личный, пользователь не идет дальше.' },
  { step: '3', block: 'Action', meaning: 'Маленький наблюдаемый шаг.', risk: 'Если действие слишком тяжелое, loop не завершается.' },
  { step: '4', block: 'Reset', meaning: 'Короткий мост через сопротивление.', risk: 'Если reset отдельный и длинный, он мешает действию.' },
  { step: '5', block: 'Reflection', meaning: 'Одна эмоция и одна строка доказательства.', risk: 'Если reflection тяжела, пользователь не пишет.' },
  { step: '6', block: 'Life Canvas', meaning: 'Визуальный след действия.', risk: 'Если причинность не ясна, продукт становится image generator.' },
  { step: '7', block: 'Tomorrow Hook', meaning: 'Причина вернуться завтра.', risk: 'Если Day 2 не помнит Day 1, season распадается.' }
], [
  { key: 'step', label: 'Шаг' },
  { key: 'block', label: 'Блок' },
  { key: 'meaning', label: 'Что происходит' },
  { key: 'risk', label: 'Что может сломаться' }
]));
lines.push('');

lines.push(chapterDivider('1', 'Почему AURA должна существовать', 'Здесь мы разбираем рынок, соседние категории, конкурентов, гипотезы и причину, почему проект не нужно сводить к гороскопу, habit tracker или AI avatar generator.'));
lines.push(intro('рынок, гипотезы и белое пятно', [
  { field: 'Что разбираем', value: 'Мировой контекст, категории, конкуренты, аудитории, паттерны функций, деньги и стратегическое белое пятно.' },
  { field: 'Почему важно', value: 'До продукта нужно понять, не является ли AURA фантазией без рынка. Этот раздел отвечает: рынок и соседние спросы существуют.' },
  { field: 'Как влияет на продукт', value: 'Показывает, что AURA должна быть на пересечении meaning, action, memory and visual progress, а не копией одной категории.' },
  { field: 'Какой вывод должен быть сделан', value: 'Рынок достаточно живой, чтобы идти в прототип. Главный риск переезжает из research в product loop.' }
]));
lines.push('');
lines.push(sources.research);
lines.push(conclusion('рынок и стратегическая логика', [
  { field: 'Что узнали', value: 'Вокруг AURA есть большие соседние рынки: mobile apps, wellbeing, mindfulness, habit, AI companion, avatar/visual generation, astrology/self-discovery.' },
  { field: 'Что это значит', value: 'AURA не должна доказывать рынок с нуля; она должна доказать новую связку между смыслом, действием и визуальным следом.' },
  { field: 'Как влияет на продукт', value: 'Продуктовое ядро должно быть не “AI horoscope” и не “avatar app”, а personal life series.' },
  { field: 'Какие решения приняты', value: 'Остановить бесконечный research; перейти к MVP, прототипу, интервью и проверке Life Canvas causality.' }
]));

lines.push(chapterDivider('2', 'Продуктовая петля и MVP', 'Здесь идея становится продуктом: что пользователь видит, какие экраны проходит, какие состояния меняются и что именно нужно проверить в первом MVP.'));
lines.push(intro('MVP Specification', [
  { field: 'Что разбираем', value: 'Полный путь пользователя, экраны, функции, состояния, сущности, API, acceptance criteria и границы MVP.' },
  { field: 'Почему важно', value: 'Инвестор и команда уже не спрашивают “есть ли рынок”. Они спрашивают “что конкретно строим”.' },
  { field: 'Как влияет на продукт', value: 'Фиксирует главный flow: Episode -> Action -> Reset -> Reflection -> Avatar -> Tomorrow Hook.' },
  { field: 'Какой вывод должен быть сделан', value: 'MVP должен проверять причинность Life Canvas и возврат на следующий день, а не весь большой vision.' }
]));
lines.push('');
lines.push(sources.mvp);
lines.push(conclusion('MVP и пользовательский путь', [
  { field: 'Что узнали', value: 'AURA уже можно описать как продукт: есть экраны, состояния, функции, API и критерии успеха.' },
  { field: 'Что это значит', value: 'Следующий практический шаг - low-fi Figma wireframes, не новый market research.' },
  { field: 'Как влияет на продукт', value: 'Все спорные функции проверяются вопросом: помогает ли это пользователю понять причинный avatar shift.' },
  { field: 'Какие решения приняты', value: 'No free daily video, no marketplace, no community, no AI friend in MVP; image-first Life Canvas обязателен.' }
]));

lines.push(chapterDivider('3', 'Как AURA строить технически', 'Здесь продукт превращается в архитектуру: стек, сервисы, данные, AI, image generation, платежи, аналитика, admin и себестоимость.'));
lines.push(intro('Technical Blueprint и Unit Economics', [
  { field: 'Что разбираем', value: 'Frontend, backend, DB, storage, AI, image, payments, analytics, admin, unit economics, cost controls, risks.' },
  { field: 'Почему важно', value: 'Видео, AI и генерация могут быстро убить экономику продукта, если не задать ограничения до разработки.' },
  { field: 'Как влияет на продукт', value: 'Архитектура должна поддерживать быстрый MVP, cost logging и безопасные AI outputs.' },
  { field: 'Какой вывод должен быть сделан', value: 'Строим mobile-first, image-first, analytics-first. Видео только later/premium/token.' }
]));
lines.push('');
lines.push(sources.tech);
lines.push(conclusion('технологии и экономика', [
  { field: 'Что узнали', value: 'MVP технически реализуем, но экономика требует жесткого контроля изображений и запрета бесплатного ежедневного видео.' },
  { field: 'Что это значит', value: 'Нужно считать cost per completed loop и cost per returned user, а не только стоимость разработки.' },
  { field: 'Как влияет на продукт', value: 'Архитектурные решения должны фиксировать события, стоимость генераций, prompt versions и safety status.' },
  { field: 'Какие решения приняты', value: 'React Native/Expo, NestJS, Postgres/Supabase, OpenAI GPT-4.1 mini, FLUX image layer, RevenueCat, analytics and admin controls.' }
]));

lines.push(chapterDivider('4', 'Как получить первых пользователей', 'Здесь мы перестаем думать про абстрактный маркетинг и описываем конкретный путь к первым 100 и 1000 пользователям.'));
lines.push(intro('GTM Plan', [
  { field: 'Что разбираем', value: 'Positioning, первые 100 пользователей, первые 1000, каналы, контент, creator outreach, landing variants, hooks, objections.' },
  { field: 'Почему важно', value: 'MVP понятен, но без правильного GTM мы не узнаем, кому продукт действительно нужен.' },
  { field: 'Как влияет на продукт', value: 'Первые пользователи должны не просто скачать, а пройти loop и объяснить Life Canvas causality.' },
  { field: 'Какой вывод должен быть сделан', value: 'Первые 100 пользователей не покупаются рекламой; они добываются вручную через интервью, прототип и concierge.' }
]));
lines.push('');
lines.push(sources.gtm);
lines.push(conclusion('GTM и запуск', [
  { field: 'Что узнали', value: 'Запуск должен быть founder-led, cohort-based and learning-first.' },
  { field: 'Что это значит', value: 'Реклама до retention и causality comprehension опасна: можно купить шум и не понять продукт.' },
  { field: 'Как влияет на продукт', value: 'Контент и onboarding должны объяснять новую категорию: personal life series, not horoscope, not random avatar.' },
  { field: 'Какие решения приняты', value: '20 interviews, 30 concierge users, 100 warm users, 1000 через short video/micro creators only after core signals.' }
]));

lines.push(chapterDivider('5', 'Как превратить план в работу команды', 'Здесь master book становится операционным документом: спринты, задачи, часы, стоимость, зависимости и критерии приемки.'));
lines.push(intro('PRD / Sprint Backlog', [
  { field: 'Что разбираем', value: 'Пять спринтов, backlog, часы, стоимость, зависимости, critical path, Definition of Done, team plan.' },
  { field: 'Почему важно', value: 'Команде нужен не вдохновляющий текст, а понятный план сборки MVP.' },
  { field: 'Как влияет на продукт', value: 'Каждая задача привязана к центральной петле и не расширяет MVP за пределы проверки.' },
  { field: 'Какой вывод должен быть сделан', value: 'После wireframes можно начинать Sprint 1; research свою работу выполнил.' }
]));
lines.push('');
lines.push(sources.prd);
lines.push(conclusion('план разработки', [
  { field: 'Что узнали', value: 'Есть реалистичный путь из пяти спринтов к soft-launch MVP.' },
  { field: 'Что это значит', value: 'Проект можно переводить в дизайн и разработку без нового research loop.' },
  { field: 'Как влияет на продукт', value: 'Scope остается защищенным: никакого marketplace/community/video-first до проверки Day 1/Day 2.' },
  { field: 'Какие решения приняты', value: 'Следующий обязательный артефакт - Figma wireframes для 10 ключевых экранов.' }
]));

lines.push(chapterDivider('6', 'Финальная рамка принятия решений', 'Здесь фиксируем, что считать успехом, что считать провалом и что делать сразу после master book.'));
lines.push(intro('финальная система решений', [
  { field: 'Что разбираем', value: 'Go/no-go logic, metrics, kill criteria, immediate next steps.' },
  { field: 'Почему важно', value: 'Большой документ бесполезен, если после него команда снова начинает спорить о рынке вместо проверки прототипа.' },
  { field: 'Как влияет на продукт', value: 'Все решения должны вести к проверке: понимает ли пользователь причинный Life Canvas.' },
  { field: 'Какой вывод должен быть сделан', value: 'AURA готова к wireframes, prototype, interviews and first cohort.' }
]));
lines.push('');
lines.push('## Финальный decision framework');
lines.push('');
lines.push(mdTable([
  { question: 'Что строим?', decision: 'Mobile-first MVP personal life series: episode, action, reset, reflection, Life Canvas, tomorrow hook.' },
  { question: 'Для кого?', decision: 'Spiritual self-improvers, habit/progress users, avatar/future-self users, journaling/reset users.' },
  { question: 'Почему может выстрелить?', decision: 'AURA соединяет смысл, действие, память и визуальный прогресс в одну петлю.' },
  { question: 'Почему может провалиться?', decision: 'Если Life Canvas воспринимается как случайная AI-картинка, а не след действия.' },
  { question: 'Что проверяем первым?', decision: 'Avatar causality comprehension, completed first loop, D1 return, D7 season completion, paid intent.' },
  { question: 'Что запрещено в MVP?', decision: 'Free daily video, marketplace, community, social network, AR/metaverse, public UGC, heavy AI friend.' },
  { question: 'Что делать дальше?', decision: 'Figma low-fi wireframes -> clickable prototype -> 20 interviews -> 30 concierge users -> first cohort readout.' }
], [
  { key: 'question', label: 'Вопрос' },
  { key: 'decision', label: 'Решение' }
]));
lines.push('');
lines.push(conclusion('вся книга', [
  { field: 'Что узнали', value: 'AURA прошла путь от идеи к системе: рынок понятен, продукт описан, технология рассчитана, GTM собран, разработка разложена.' },
  { field: 'Что это значит', value: 'Research package выполнил свою работу. Следующий риск находится внутри прототипа.' },
  { field: 'Как влияет на продукт', value: 'Все дальнейшие обсуждения должны возвращаться к одной проверке: понимает ли пользователь, почему изменился Life Canvas.' },
  { field: 'Какие решения приняты', value: 'Начинаем с Figma wireframes и prototype interviews. Не продолжаем расширять research без пользовательских сигналов.' }
]));

fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(OUT, `${lines.join('\n').trimEnd()}\n`);
console.log(`aura_master_book=${OUT}`);
