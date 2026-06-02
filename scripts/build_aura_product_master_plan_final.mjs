import fs from 'fs';
import path from 'path';

const ROOT = process.cwd();
const SOURCE = path.join(ROOT, 'reports', 'aura-master-book.md');
const OUT = path.join(ROOT, 'reports', 'aura-product-master-plan-final.md');

const source = fs.readFileSync(SOURCE, 'utf8');

function normalize(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function h2(title) {
  const marker = `## ${title}`;
  const start = source.indexOf(marker);
  if (start === -1) throw new Error(`Missing H2: ${title}`);
  const nextH2 = source.indexOf('\n## ', start + marker.length);
  const nextChapter = source.indexOf('\n# ГЛАВА ', start + marker.length);
  const candidates = [nextH2, nextChapter].filter(index => index !== -1);
  const end = candidates.length ? Math.min(...candidates) : source.length;
  return source.slice(start, end).trim();
}

function introBlock() {
  return source
    .slice(0, source.indexOf('<!-- PAGEBREAK -->'))
    .replace(/^# AURA\s*\n+/m, '')
    .replace(/^# Product Master Plan\s*\n+/m, '')
    .trim();
}

function h3ChunksFromH2(title) {
  const block = h2(title);
  const starts = [...block.matchAll(/^### .+$/gm)].map(match => ({ index: match.index, title: match[0].replace(/^### /, '').trim() }));
  const chunks = new Map();
  const first = starts[0]?.index ?? block.length;
  const preface = block.slice(0, first).trim();
  if (preface) chunks.set('__preface__', preface);
  for (let i = 0; i < starts.length; i += 1) {
    const start = starts[i].index;
    const end = starts[i + 1]?.index ?? block.length;
    chunks.set(starts[i].title, block.slice(start, end).trim());
  }
  return chunks;
}

function pick(chunks, names) {
  return names.map(name => {
    if (!chunks.has(name)) throw new Error(`Missing H3: ${name}`);
    return cleanChunk(chunks.get(name));
  });
}

function removeFrom(chunk, marker) {
  const index = chunk.indexOf(marker);
  return (index === -1 ? chunk : chunk.slice(0, index)).trim();
}

function pageBreak() {
  return '<!-- PAGEBREAK -->';
}

const layerCards = {
  'Что такое AURA': {
    main: 'Определение AURA, центральная петля, Life Canvas как причинный след.',
    evidence: 'Карта гипотез, логика проверки, быстрые стратегические выводы.',
    appendix: 'Не требуется: глава должна оставаться коротким входом.',
  },
  'Как работает AURA': {
    main: 'Episode -> Action -> Reset -> Reflection -> Life Canvas -> Tomorrow Hook.',
    evidence: 'Journey map, service blueprint, рабочие концепции, product verdict.',
    appendix: 'Подробные экранные спецификации, states, API и acceptance details.',
  },
  'Почему это может работать': {
    main: 'Рынок есть, деньги есть, конкуренты подтверждают спрос, белое пятно находится в причинной петле.',
    evidence: 'Категории, TAM/SAM/SOM summary, конкурентная карта, whitespace summary.',
    appendix: 'Полные market inventories, списки приложений, конкурентные таблицы, источники.',
  },
  'Для кого это': {
    main: 'Первые ICP-сегменты и почему у них уже есть близкое поведение.',
    evidence: 'Сценарии входа, interview logic, audience segments, behavioral signals.',
    appendix: 'Полные interview/capture sheets, VOC-таблицы, дополнительные сегментные материалы.',
  },
  'Что мы строим': {
    main: 'MVP scope, journey, функции, механики, что делаем и что запрещено добавлять.',
    evidence: 'Screen map, user stories, function-level specification, product copy principles.',
    appendix: 'Detailed screen specs, API payloads, acceptance criteria, edge cases.',
  },
  'Как монетизируем и проверяем экономику': {
    main: 'Монетизация, paywall after value, cost-control principles, no free daily video.',
    evidence: 'Лестница монетизации, unit economics summary, pricing logic, paid intent.',
    appendix: 'Полные cost tables, providers, architecture и sprint budget вынесены в AURA Build Plan.',
  },
  'Как это продаем': {
    main: 'GTM logic: первые 100/1000 пользователей, positioning, channels, content, experiments.',
    evidence: 'Channel playbooks, creator outreach, landing variants, messaging, budget.',
    appendix: 'Hook bank, 30-day content calendar, retention tables, objection library.',
  },
  'Как принимаем решение': {
    main: 'Go/no-go, риски, kill criteria, метрики loop, следующий шаг.',
    evidence: 'Validation summary, dashboard, decision tree, точки верификации.',
    appendix: 'Полный validation plan, retention/virality tables, investment memo skeleton.',
  },
  'Appendix / Evidence Layer': {
    main: 'Не является обязательным последовательным чтением.',
    evidence: 'Полные доказательства, таблицы, рабочие детали и технические приложения.',
    appendix: 'Это и есть appendix.',
  },
};

function chapter(no, title, promise) {
  const layers = layerCards[title] ?? {
    main: 'Основной вывод главы.',
    evidence: 'Короткое подтверждение вывода.',
    appendix: 'Детализация при необходимости.',
  };
  return [
    pageBreak(),
    `# ГЛАВА ${no}`,
    '',
    `# ${title}`,
    '',
    promise,
    '',
    '## Что читатель должен понять',
    '',
    `После этой главы читатель должен понимать: ${promise}`,
    '',
    '## Уровни информации в этой главе',
    '',
    '| Уровень | Что внутри | Как читать |',
    '| --- | --- | --- |',
    `| Main Narrative | ${layers.main} | Читать обязательно. |`,
    `| Supporting Evidence | ${layers.evidence} | Читать для проверки вывода. |`,
    `| Appendix | ${layers.appendix} | Открывать при глубокой проверке или подготовке работы. |`,
  ].join('\n');
}

function block(title, chunks) {
  return [
    '',
    `## ${title}`,
    '',
    ...chunks,
  ].filter(Boolean).join('\n');
}

const auraMeaningRules = [
  {
    test: /User Stories/i,
    text: 'Вывод для AURA: user stories фиксируют роли вокруг продукта. Пользователь, дизайнер, маркетолог и команда должны видеть один и тот же value moment, иначе первый продукт разъедется по разным трактовкам.',
  },
  {
    test: /Core Scenarios/i,
    text: 'Вывод для AURA: сценарии показывают, где продукт живет в реальном дне человека. Если сценарий не приводит к действию или возврату завтра, он не должен перегружать первый продукт.',
  },
  {
    test: /Scope/i,
    text: 'Вывод для AURA: scope защищает первый продукт от расползания. Все, что не проверяет первый completed loop, должно ждать следующего этапа.',
  },
  {
    test: /Product Mechanics/i,
    text: 'Вывод для AURA: механики нужны не ради богатого интерфейса, а ради трех проверок: понял ли человек эпизод, сделал ли шаг, захотел ли увидеть продолжение.',
  },
  {
    test: /Function-Level|будет, если убрать/i,
    text: 'Вывод для AURA: функция остается в MVP только если без нее ломается смысл, действие, память, возврат или платный value moment.',
  },
  {
    test: /User States|State Machine/i,
    text: 'Вывод для AURA: состояния пользователя нужны, чтобы не потерять причинность в реализации. Каждый переход должен сохранять связь между эпизодом, действием и результатом.',
  },
  {
    test: /Product Copy/i,
    text: 'Вывод для AURA: язык продукта должен быть теплым и точным: без фатальных обещаний, без стыда за пропуски и без ощущения generic AI-текста.',
  },
  {
    test: /Budget For First 30 Days/i,
    text: 'Вывод для AURA: первые 30 дней должны покупать не масштаб, а обучение. Бюджет нужен для проверки спроса, а не для имитации большого запуска.',
  },
  {
    test: /Objection Handling/i,
    text: 'Вывод для AURA: objection handling должен заранее снять три риска восприятия: “это гороскоп”, “это игрушка с аватаром”, “это еще один трекер”.',
  },
  {
    test: /Operating Rhythm/i,
    text: 'Вывод для AURA: запуск требует недельного ритма решений. Без регулярного разбора метрик команда быстро начнет спорить о вкусе вместо поведения пользователей.',
  },
  {
    test: /рынк|TAM|SAM|SOM|категор|деньг|market/i,
    text: 'Вывод для AURA: рынок подтверждает право на проверку, но не заменяет прототип. Главная ставка остается в том, сможет ли пользователь пройти личный эпизод, действие и увидеть понятный результат.',
  },
  {
    test: /конкур|бел(ое|ого) пятн|паттерн|whitespace/i,
    text: 'Вывод для AURA: конкуренты подтверждают спрос на части системы, но преимущество появляется только там, где смысл, действие и визуальный прогресс соединены в один опыт.',
  },
  {
    test: /аудитор|интерв|сегмент|ICP/i,
    text: 'Вывод для AURA: первая аудитория должна уже иметь похожие ритуалы, но чувствовать, что текущие решения не собирают личную траекторию в понятную историю.',
  },
  {
    test: /Journey|Screen|User Stories|Scope|Mechanics|Function|States|State Machine|Product Copy|blueprint|спецификац|экран|пользователь|MVP|первый продукт/i,
    text: 'Вывод для AURA: этот раздел переводит идею в поведение пользователя. Важен не список функций, а то, проходит ли человек путь от первого эпизода к завершенному действию и понятному изменению Life Canvas.',
  },
  {
    test: /монетизац|эконом|cost|paywall|цен|подпис|плат/i,
    text: 'Вывод для AURA: монетизация должна появляться после первого value moment. Дорогие визуальные механики можно добавлять только там, где они усиливают оплату или удержание.',
  },
  {
    test: /GTM|канал|launch|content|creator|landing|messaging|hook|objection|запуск|маркет/i,
    text: 'Вывод для AURA: запуск должен продавать не абстрактный AI/wellness-продукт, а простую обещанную трансформацию: один день становится эпизодом, действием и видимым следом.',
  },
  {
    test: /risk|criteria|decision|решени|провер|метрик|validation|верификац/i,
    text: 'Вывод для AURA: решение о запуске принимается не по красоте идеи, а по проверке понимания, возврата, платного намерения и способности пользователя объяснить изменение Life Canvas.',
  },
  {
    test: /avatar|Life Canvas|canvas/i,
    text: 'Вывод для AURA: Life Canvas должен быть не украшением, а видимым следом действия. Если связь не считывается, визуальный слой превращается в обычную AI-картинку.',
  },
];

function auraMeaningFor(context) {
  const rule = auraMeaningRules.find(item => item.test.test(context));
  return rule?.text ?? 'Вывод для AURA: этот раздел важен только в той мере, в какой он помогает проверить продуктовую ставку: личный смысл должен перейти в действие, а действие - в видимый и понятный результат.';
}

function replaceAuraMeaningBlocks(chunk) {
  const lines = chunk.split('\n');
  const out = [];
  for (let i = 0; i < lines.length; i += 1) {
    const line = lines[i];
    if (!/^#{2,3} Что это значит для AURA\s*$/.test(line.trim())) {
      out.push(line);
      continue;
    }

    const context = out
      .slice()
      .reverse()
      .find(prev => /^#{1,4}\s+/.test(prev)) ?? '';

    out.push(line.trim());
    out.push('');
    out.push(auraMeaningFor(context.replace(/^#+\s*/, '')));

    while (i + 1 < lines.length) {
      const next = lines[i + 1];
      if (/^#{1,3}\s+/.test(next) && !/^#{2,3} Что это значит для AURA\s*$/.test(next.trim())) break;
      i += 1;
    }
  }
  return out.join('\n');
}

function cleanChunk(chunk) {
  return replaceAuraMeaningBlocks(chunk)
    .replace(/^## Зачем нужна эта глава[\s\S]*?(?=^## |^# ГЛАВА |\z)/gm, '')
    .replace(/^## Центральная петля остается на экране[\s\S]*?(?=^## |^# ГЛАВА |\z)/gm, '')
    .replace('RevenueCat entitlement', 'paid entitlement')
    .replace(/^\*\*Почему этот блок здесь\.\*\*[^\n]*(?:\n|$)/gm, '')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

function summaryOnly(title, summary, movedTo = 'Appendix / Evidence Layer') {
  return [
    `## ${title}`,
    '',
    summary,
    '',
    `Полная доказательная детализация этого блока перенесена в ${movedTo}, чтобы основной narrative не превращался в таблицу и сохранял product-first чтение.`,
  ].join('\n');
}

function compactH2(title, summary) {
  return summaryOnly(title, summary);
}

const productModel = h3ChunksFromH2('ИТОГОВАЯ МОДЕЛЬ ПРОДУКТА И ГИПОТЕЗА #6');
const decisionVersion = h3ChunksFromH2('ВЕРСИЯ ДЛЯ РЕШЕНИЯ: ЧТО НУЖНО ДЛЯ ЗАПУСКА, ТЗ, БЮДЖЕТА И первый продукт');

const lines = [];

lines.push('# AURA');
lines.push('');
lines.push('# Product Master Plan Final');
lines.push('');
lines.push('Эта версия собирает существующий материал AURA в product-first структуру. Текстовые блоки не переписываются заново: они переупорядочены так, чтобы читатель сначала понял продукт, затем доказательства, аудиторию, MVP, технологию, запуск и критерии решения.');
lines.push('');
lines.push('## Новая логика чтения');
lines.push('');
lines.push('| Шаг | Вопрос | Где ответ |');
lines.push('| --- | --- | --- |');
lines.push('| 1 | Что такое AURA? | Главы 1-2 |');
lines.push('| 2 | Почему это может работать? | Главы 3-4 |');
lines.push('| 3 | Что именно строим? | Глава 5 |');
lines.push('| 4 | Как строим и продаем? | Главы 6-7 |');
lines.push('| 5 | Как принимаем решение? | Глава 8 |');
lines.push('| 6 | Где вся детализация? | Appendix |');
lines.push('');
lines.push('## Уровни информации');
lines.push('');
lines.push('| Уровень | Как читать | Что делать читателю |');
lines.push('| --- | --- | --- |');
lines.push('| Main Narrative | Обязательное последовательное чтение | Читать подряд, чтобы понять продукт и решение. |');
lines.push('| Supporting Evidence | Короткие доказательства внутри главы | Смотреть, чтобы понять, на чем держится вывод. |');
lines.push('| Appendix | Полные таблицы, списки, backlog, API, event taxonomy, источники | Открывать при проверке цифр, подготовке ТЗ или глубокой работе команды. |');
lines.push('');
lines.push('В каждой главе основной текст должен отвечать на вопрос “что важно запомнить”, а appendix - на вопрос “чем это подтверждается”.');

lines.push(chapter(1, 'Что такое AURA', 'AURA - это daily life-series product, где личный контекст превращается в эпизод, действие, reset, reflection и причинное изменение Life Canvas.'));
lines.push(introBlock());
lines.push(cleanChunk(h2('Карта проверки гипотез')));
lines.push(cleanChunk(h2('ОПИСАНИЕ ПРОЕКТА И ГИПОТЕЗА #1')));
lines.push(cleanChunk(h2('БЫСТРЫЕ ВЫВОДЫ ДЛЯ СТРАТЕГИИ')));

lines.push(chapter(2, 'Как работает AURA', 'Центральная ценность продукта находится в петле Episode -> Action -> Reset -> Reflection -> Life Canvas -> Tomorrow Hook.'));
lines.push(cleanChunk(h2('Journey Map первого дня')));
lines.push(cleanChunk(h2('Накопление ценности')));
lines.push(cleanChunk(h2('Life Canvas как причинная система')));
lines.push(cleanChunk(h2('Service blueprint первого loop')));
lines.push(cleanChunk(h2('1. Product Blueprint / Решение о первом продукте')));
lines.push(cleanChunk(h2('2. User Journey')));
lines.push(cleanChunk(h2('3. Screen Map')));
lines.push(...pick(productModel, [
  '__preface__',
  'Рабочие концепции приложения',
  'Сравнение концепций: почему выбираем не одну красивую идею, а связку',
  'Продуктовый вердикт: какое приложение стоит делать',
  'Avatar / Life Canvas: что именно должно меняться',
]));

lines.push(chapter(3, 'Почему это может работать', 'Сначала продуктовая механика, затем доказательство: рынки, деньги, конкуренты, паттерны и белое пятно.'));
lines.push(cleanChunk(h2('Карта категорий')));
lines.push(cleanChunk(h2('Категории как слои продукта')));
lines.push(cleanChunk(h2('Карта конкурентного поля')));
lines.push(compactH2('ОПРЕДЕЛЕНИЕ МИРОВЫХ ЦЕЛЕВЫХ РЫНКОВ И ГИПОТЕЗА #2', 'Для AURA важны пять соседних направлений: mindfulness/reset, avatar/identity, astrology/self-discovery, coaching/self-improvement и gaming/progression как источник механик возврата. Смысл этого блока не в том, чтобы перечислить все найденные приложения, а в том, чтобы показать: у продукта есть несколько уже существующих платных поведенческих рынков.'));
lines.push(compactH2('ОЦЕНКА РАЗМЕРА РЫНКА: TAM/SAM/SOM', 'AURA не должна считаться как один узкий horoscope или avatar TAM. Более честная рамка - пересечение мобильного self-care, персонального смысла, AI identity, coaching/habits и progression mechanics. В основной книге оставляем вывод: рынок достаточно большой для проверки, но деньги AURA доказываются не TAM, а платным поведением в MVP.'));
lines.push(compactH2('ОПРЕДЕЛЕНИЕ КОНКУРЕНТОВ И ГИПОТЕЗА #3', 'Конкурентов много, и это хороший сигнал. Белое пятно не в отсутствии продуктов, а в том, что существующие решения часто разрывают цепочку: смысл без действия, действие без образа, avatar без причинности, progress без эмоционального контекста.'));
lines.push(cleanChunk(h2('КОНКУРЕНТНОЕ ПРЕИМУЩЕСТВО И ГИПОТЕЗА #4')));
lines.push(cleanChunk(h2('СВЯЗКА БЕЛОГО ПЯТНА И АУДИТОРИИ')));
lines.push(cleanChunk(h2('ИСТОЧНИКИ И ГРАНИЦЫ ДОКАЗАТЕЛЬСТВ')));

lines.push(chapter(4, 'Для кого это', 'AURA должна стартовать не с абстрактного рынка, а с конкретных сегментов, у которых уже есть близкое поведение.'));
lines.push(cleanChunk(h2('Карта первых аудиторий')));
lines.push(cleanChunk(h2('СЦЕНАРИИ ВХОДА КАК СВЯЗУЮЩЕЕ ЗВЕНО')));
lines.push(cleanChunk(h2('АУДИТОРИЯ, ИНТЕРВЬЮ И ГИПОТЕЗА #5')));
lines.push(cleanChunk(h2('КЛЮЧЕВЫЕ НАБЛЮДЕНИЯ И ВОПРОСЫ ДЛЯ ПРОВЕРКИ')));
lines.push(cleanChunk(h2('3. Audience Segments')));
lines.push(cleanChunk(h2('15. Interview Script For GTM')));

lines.push(chapter(5, 'Что мы строим', 'MVP AURA должен проверять не весь будущий продукт, а причинную петлю и первый Life Canvas moment.'));
lines.push(...pick(productModel, [
  'Детальная комплектация продукта',
  'Рекомендуемые тарифы и упаковка ценности',
  'Первый релиз: что именно должно быть в приложении',
  'Продуктовая спецификация: путь пользователя по дням',
  'Что точно не делать в первый продукт',
  'Прототипы как гипотезы',
  'Функциональная карта первый продукт',
]));
lines.push(summaryOnly('4. Detailed Screen Specifications', 'В основном narrative достаточно зафиксировать экранную логику: Welcome -> Consent -> Profile -> Season -> Episode -> Action -> Reset -> Reflection -> Life Canvas -> Tomorrow Hook -> Paywall after value. Полные экранные спецификации нужны дизайнеру и разработчику, поэтому уходят в appendix.'));
lines.push(cleanChunk(h2('5. User Stories')));
lines.push(cleanChunk(h2('6. Core Scenarios')));
lines.push(cleanChunk(h2('7. первый продукт Scope')));
lines.push(cleanChunk(h2('8. Product Mechanics')));
lines.push(cleanChunk(h2('9. Function-Level Specification')));
lines.push(cleanChunk(h2('12. User States')));
lines.push(cleanChunk(h2('13. State Machine Logic')));
lines.push(cleanChunk(h2('18. Product Copy Principles')));
lines.push(cleanChunk(h2('27. Итоговое определение продукта')));
lines.push(...pick(decisionVersion, [
  '1. Продуктовый blueprint: полный путь пользователя',
  '2. Продуктовая спецификация: функции и приоритеты',
]));

lines.push(chapter(6, 'Как монетизируем и проверяем экономику', 'В основном продуктово-стратегическом документе важна не архитектура, а логика: за что человек платит, почему экономика может сойтись и какие дорогие решения нельзя тащить в MVP.'));
lines.push(cleanChunk(h2('Экономика петли')));
lines.push(cleanChunk(h2('Cost stack')));
lines.push(cleanChunk(h2('Лестница монетизации')));
lines.push(...pick(productModel, [
  'Монетизация: что проверять у конкурентов',
  'Монетизационная матрица: что именно продавать',
  'Почему люди платят соседним продуктам и что забирает АУРА',
]));
lines.push(summaryOnly('Техническая реализуемость и себестоимость', 'В Product Master Plan оставляем только принцип: AURA нужно запускать image-first, без бесплатного ежедневного видео, с учетом cost per completed loop и paid intent. Подробная архитектура, стек, провайдеры, API, unit economics by scale и budget находятся в отдельном AURA Build Plan.'));
lines.push(summaryOnly('5. Юнит-экономика: рабочая модель расходов', 'Основной вывод: экономика AURA бьется только при контроле image/video cost, paywall after value и учете cost per completed loop. Детальные сценарии по масштабам и sensitivity analysis вынесены в AURA Build Plan.'));
lines.push(summaryOnly('6. Монетизация: конкуренты и итоговая модель АУРЫ', 'В main narrative оставляем итоговую модель: free first loop, paid season/memory/recap/styles, premium/video moments как отдельная проверка. Таблицы по конкурентам и гипотезам монетизации уходят в appendix.'));

lines.push(chapter(7, 'Как это продаем', 'GTM должен продавать не абстрактный AI-продукт, а конкретный loop: действие сегодня меняет Life Canvas завтра.'));
lines.push(cleanChunk(h2('Воронка первых пользователей')));
lines.push(cleanChunk(h2('Карта каналов')));
lines.push(cleanChunk(h2('Контент-пиллары')));
lines.push(cleanChunk(h2('Таймлайн первых 30 дней')));
lines.push(cleanChunk(h2('Доска экспериментов')));
lines.push(cleanChunk(h2('1. GTM Decision Summary')));
lines.push(cleanChunk(h2('2. Positioning')));
lines.push(cleanChunk(h2('4. First 100 Users')));
lines.push(cleanChunk(h2('5. First 1000 Users')));
lines.push(cleanChunk(h2('6. Content Pillars')));
lines.push(cleanChunk(h2('7. Channel Playbooks')));
lines.push(cleanChunk(h2('8. 30-Day Launch Plan')));
lines.push(summaryOnly('9. 30-Day Content Calendar', 'В основной книге достаточно логики: первые 30 дней должны проверять positioning, loop comprehension, creator/content pull и paid intent. Полный календарь публикаций остается как рабочее приложение.'));
lines.push(cleanChunk(h2('10. Experiment Backlog')));
lines.push(cleanChunk(h2('11. Creator Outreach')));
lines.push(cleanChunk(h2('12. Landing Page Variants')));
lines.push(cleanChunk(h2('13. Messaging Matrix')));
lines.push(cleanChunk(h2('16. Budget For First 30 Days')));
lines.push(summaryOnly('17. Hook Bank', 'В main narrative оставляем роль hook bank: маркетинг AURA должен объяснять life-series, future self, causal Life Canvas и маленькое действие. Полный банк формулировок лучше читать как рабочий appendix для контента.'));
lines.push(cleanChunk(h2('18. Objection Handling')));
lines.push(cleanChunk(h2('19. Operating Rhythm')));
lines.push(cleanChunk(h2('21. Итоговое решение по запуску')));
lines.push(summaryOnly('7. Исследование удержания: возврат и отток', 'Главная retention-гипотеза: пользователь возвращается, если Day 2 помнит Day 1, а Life Canvas объясняет накопление изменений. Полные таблицы причин возврата, удаления, покупки и отказа от подписки выносятся в appendix.'));
lines.push(...pick(decisionVersion, [
  '8. Go-to-market: каналы и план запуска',
  '9. Система интервью: сегменты и вопросы',
  '10. План проверки первый продукт: 6 недель',
]));

lines.push(chapter(8, 'Как принимаем решение', 'Финал должен отвечать не “понравилась ли идея”, а прошла ли AURA проверку loop, экономики, retention и paid intent.'));
lines.push(cleanChunk(h2('СТОЛПЫ УВЕРЕННОСТИ И ОТКРЫТЫЕ РИСКИ')));
lines.push(summaryOnly('ПЛАН ПРОВЕРКИ САМЫХ ВАЖНЫХ РИСКОВ', 'В main narrative оставляем управленческий смысл: сначала проверяем causality Life Canvas, затем retention, paid intent, technical feasibility и GTM pull. Полные таблицы retention, virality, validation и investment memo уходят в appendix.'));
lines.push(cleanChunk(h2('БЛИЖАЙШАЯ ЛОГИКА ПРОВЕРКИ')));
lines.push(cleanChunk(h2('Dashboard решения')));
lines.push(cleanChunk(h2('Дерево решения')));
lines.push(cleanChunk(h2('Карта решений')));
lines.push(cleanChunk(h2('Что это значит для AURA')));
lines.push(...pick(productModel, [
  'Точки верификации с автором приложения',
  'Итог по продуктовой модели',
]));
lines.push(...pick(decisionVersion, [
  '11. Инвестиционная записка: инвесторская версия',
  '12. Финальное продуктовое решение',
]));

lines.push(chapter(9, 'Appendix / Evidence Layer', 'Appendix сохраняет продуктовую и рыночную доказательную базу, но техническая реализация вынесена в отдельный AURA Build Plan.'));
lines.push(block('Доказательная база рынка и конкурентов', [
  cleanChunk(h2('ОПРЕДЕЛЕНИЕ МИРОВЫХ ЦЕЛЕВЫХ РЫНКОВ И ГИПОТЕЗА #2')),
  cleanChunk(h2('ОЦЕНКА РАЗМЕРА РЫНКА: TAM/SAM/SOM')),
  cleanChunk(h2('ОПРЕДЕЛЕНИЕ КОНКУРЕНТОВ И ГИПОТЕЗА #3')),
]));
lines.push(block('Retention и маркетинговые приложения', [
  cleanChunk(h2('ПЛАН ПРОВЕРКИ САМЫХ ВАЖНЫХ РИСКОВ')),
  ...pick(decisionVersion, ['7. Исследование удержания: возврат и отток']),
  cleanChunk(h2('9. 30-Day Content Calendar')),
  cleanChunk(h2('17. Hook Bank')),
]));
lines.push(block('Расширенная продуктовая детализация решения', [
  removeFrom(
    pick(decisionVersion, ['13. Финальная детализация: День 90, экранная карта, первый продукт scope и roadmap'])[0],
    '#### Tech stack decision: выбранные решения по слоям'
  ),
  cleanChunk(h2('20. Kill Criteria')),
]));
lines.push(block('Где техническая реализация', [
  'Архитектура, стек, database, providers, API, unit economics by scale, sprint planning, backlog, budget, implementation details и engineering roadmap вынесены в отдельный документ: `AURA_BUILD_PLAN.pdf`.',
]));

fs.writeFileSync(OUT, `${lines.join('\n').replace(/\n{3,}/g, '\n\n').trimEnd()}\n`);
console.log(`wrote ${OUT}`);
