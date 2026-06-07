import fs from 'fs';
import path from 'path';
import { spawnSync } from 'child_process';

const ROOT = process.cwd();
const THREAD_ID = process.env.CODEX_THREAD_ID || `manual-${Date.now().toString(36)}`;
const WORKSPACE = path.join(ROOT, 'tmp', 'presentations', THREAD_ID, 'aura-trendvi-style-deck-v6');
const SLIDES_DIR = path.join(WORKSPACE, 'slides');
const PREVIEW_DIR = path.join(WORKSPACE, 'preview');
const LAYOUT_DIR = path.join(WORKSPACE, 'layout');
const OUTPUT_DIR = path.join(ROOT, 'output', 'pptx');
const PLAN_OUT = path.join(ROOT, 'reports', 'aura-trendvi-style-deck-v6.md');
const SOURCE_NOTES = path.join(ROOT, 'reports', 'aura-trendvi-style-deck-v6-sources.md');
const PPTX_OUT = path.join(OUTPUT_DIR, 'AURA_TRENDVI_STYLE_DECK_V6.pptx');
const CONTACT_SHEET = path.join(OUTPUT_DIR, 'AURA_TRENDVI_STYLE_DECK_V6_CONTACT_SHEET.png');

const BUILDER = '/Users/kirill/.codex/plugins/cache/openai-primary-runtime/presentations/26.601.10930/skills/presentations/scripts/build_artifact_deck.mjs';
const NODE = '/Users/kirill/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node';

const allSlides = [
  { title: 'AURA', type: 'cover' },
  {
    title: 'Короткий ответ: что мы строим',
    type: 'executiveOnePage',
    thesis: 'AURA — это персональный weekly visual self-guidance продукт: пользователь вводит дату рождения и текущий запрос, получает прогноз недели, проходит daily episodes и видит, как меняется Life Canvas.',
    cards: [
      ['Что продаем', 'не “астрологию”, а понятную неделю: смысл → действие → визуальное изменение'],
      ['Почему сейчас', 'рынок уже платит за personal guidance, daily wellness, AI companion и visual AI'],
      ['Что в MVP', 'weekly forecast, daily card, action/reset, Life Canvas, Plus paywall, один video-token test'],
      ['Главный риск', 'пользователь должен понимать: Canvas изменился из-за моего действия, а не случайной генерации']
    ],
    decision: 'Следующий шаг: не спорить о рынке, а проверить loop на 30-50 пользователях.'
  },
  {
    title: 'Как читать презентацию',
    type: 'clarityMap',
    lanes: [
      ['1', 'Возможность', 'лидеры рынка и белое пятно'],
      ['2', 'Продукт', 'петля, Canvas, экраны, MVP'],
      ['3', 'Деньги', 'цена, себестоимость, free user, break-even'],
      ['4', 'Запуск', 'маркетинг, roadmap, go/no-go']
    ],
    question: 'После просмотра должно быть понятно: что строим, почему это может заработать, сколько стоит проверить и по каким метрикам остановиться.'
  },
  {
    title: 'Компас показателей',
    type: 'metricCompass',
    groups: [
      ['Продукт', 'Активация', 'Возврат D1/D7', 'Понимание Canvas', 'понимает ли человек ценность'],
      ['Деньги', 'Платный интерес', 'Конверсия в оплату', 'Выручка на пользователя', 'есть ли платная модель'],
      ['Себестоимость', 'Расход free-user', 'Расход платящего', 'Стоимость видео', 'не съедает ли AI маржу'],
      ['Рост', 'CAC регистрации', 'CAC активации', 'Доказательство от авторов', 'можно ли приводить людей']
    ],
    rule: 'Каждый блок ниже читается через один вопрос: какой показатель меняет решение по продукту?'
  },
  {
    title: 'Словарь метрик простым языком',
    type: 'metricGlossaryRu',
    rows: [
      ['Метрика', 'Простое объяснение', 'Почему важно для AURA'],
      ['D1 / D7', 'сколько людей вернулось на следующий день / через неделю', 'показывает, есть ли ежедневная привычка'],
      ['Canvas causality', 'понимает ли человек, почему изменилась картинка Life Canvas', 'главная проверка: это продукт или просто AI-картинка'],
      ['Paid intent', 'сколько людей готовы платить или оставляют явный сигнал интереса', 'до разработки нужно понять, есть ли деньги'],
      ['Conversion', 'какая доля пользователей становится платящей', 'определяет, может ли подписка окупить продукт'],
      ['COGS', 'переменная себестоимость AI, картинок, видео и поддержки', 'если COGS высокий, подписка не держит маржу'],
      ['CAC', 'стоимость привлечения пользователя', 'маркетинг можно масштабировать только если CAC ниже LTV'],
      ['Runway', 'сколько денег нужно, чтобы дойти до следующего решения', 'не путать первую проверку и год масштабирования']
    ],
    note: 'Все сокращения нужны только как индустриальный язык. Для решения читаем русскую колонку: что проверяем и почему это важно.'
  },
  {
    title: 'Цветовая логика решений',
    type: 'decisionLegend',
    items: [
      ['Фиолетовый', 'стратегическая возможность', 'рынок, позиционирование, белое пятно'],
      ['Зеленый', 'решение / хороший сигнал', 'что берем в MVP или считаем рабочим'],
      ['Серый', 'доказательная база', 'таблицы, источники, бенчмарки, raw proof'],
      ['Контур', 'условие / gate', 'метрика, без которой нельзя идти дальше']
    ],
    note: 'Так презентация перестает быть набором таблиц: каждый цвет показывает статус информации.'
  },
  {
    title: 'Что уже доказали лидеры',
    type: 'leaderGrid',
    leaders: [
      ['Nebula / Co-Star', 'личная навигация', 'дата рождения, недельный смысл, совместимость, платные разборы', 'оценка iOS: $718K-$797K/мес'],
      ['Calm / Headspace', 'ежедневный ритуал', 'доверие к подписке, годовые планы, wellness-привычка', 'Calm proxy: около $300M/год'],
      ['Finch / Replika', 'петля помощника', 'память, аватар, мягкий возврат, эмоциональная непрерывность', 'оценки: $1.5M-$2.36M/мес'],
      ['Runway / HeyGen', 'визуальный AI-слой', 'видео/аватар как premium-результат, не дешевый daily commodity', 'Runway 8s Gen-4 Turbo ~= $0.40']
    ],
    note: 'На рынке уже есть все ингредиенты. AURA собирает их в один причинный недельный опыт.'
  },
  {
    title: 'Новый формат находится на пересечении',
    type: 'intersectionThesis',
    pieces: [
      ['Астрология', 'личный смысл'],
      ['Mindfulness', 'ежедневный ритуал'],
      ['AI-помощник', 'память / ассистент'],
      ['Visual AI', 'Life Canvas / видео'],
      ['AURA', 'визуальная навигация недели']
    ],
    note: 'AURA — не “еще одно приложение с гороскопами”. Это сериал о своей неделе, где смысл приводит к действию, а действие меняет визуальное состояние.'
  },
  {
    title: 'Как мы выводим продукт',
    type: 'numberLogic',
    steps: [
      ['1', 'Смотрим лидеров', 'Nebula / Calm / Finch / Runway', 'рынок уже платит за смысл, ритуал, память и визуальный AI'],
      ['2', 'Находим разрыв', 'приложения дают куски опыта', 'нет формата, где смысл превращается в действие и видимое изменение'],
      ['3', 'Формулируем AURA', 'weekly visual self-guidance', 'неделя становится личным сериалом, а Life Canvas показывает причинность'],
      ['4', 'Собираем MVP', 'Episode → Action → Canvas', 'проверяем не рынок вообще, а понятна ли пользователю причинная петля']
    ],
    note: 'Логика презентации: не “мы придумали приложение”, а “из существующих платных паттернов появляется новый формат”.'
  },
  {
    title: 'Пользовательская проблема → ответ AURA',
    type: 'solution',
    leftTitle: 'Что сейчас болит',
    left: [
      'Гороскопы дают смысл, но часто звучат общо и не ведут к действию.',
      'Mindfulness дает ритуал, но не объясняет личную неделю пользователя.',
      'AI companion умеет помнить, но не превращает неделю в понятную структуру.',
      'Avatar/video tools дают вау-картинку, но она часто не связана с поведением.'
    ],
    rightTitle: 'Что должна дать AURA',
    right: [
      'Личный прогноз недели на основе birth data и текущего запроса.',
      'Daily episode: один фокус дня, одно маленькое действие, один reset.',
      'Life Canvas: визуальная картинка меняется не случайно, а по причине.',
      'Weekly recap/video: неделя ощущается как серия жизни, а не набор карточек.',
      'Ассистент с памятью: пользователь чувствует продолжение, а не новый чат с нуля.'
    ]
  },
  {
    title: '3 рабочие продуктовые концепции',
    type: 'pricingTable',
    rows: [
      ['Концепция', 'Как выглядит для пользователя', 'Вау-момент', 'Что проверяет'],
      ['Weekly Life Trailer', 'раз в неделю пользователь получает визуальный трейлер своей недели', '“моя неделя выглядит как фильм обо мне”', 'готов ли пользователь платить за premium visual moment'],
      ['Future Self Canvas', 'ежедневные действия меняют образ будущей версии себя', '“картинка изменилась, потому что я сделал действие”', 'понятна ли причинность Life Canvas'],
      ['Pocket Forecastist', 'карманный прогнозист помнит контекст и ведет через неделю', '“он понимает мою ситуацию, а не просто пишет гороскоп”', 'работает ли trust + memory + weekly guidance']
    ]
  },
  {
    title: 'Финальная формула AURA',
    type: 'overview',
    blocks: [
      ['Финальная формула', 'AURA — weekly visual self-guidance app: пользователь вводит birth data и текущий запрос, получает прогноз недели, проходит daily episodes и видит изменение Life Canvas.'],
      ['Главный принцип', 'Продукт не продает “предсказание судьбы”. Он продает структуру недели: понять состояние → сделать действие → увидеть изменение → вернуться завтра.'],
      ['Что внутри', 'Карманный прогнозист/ассистент с памятью, weekly season, daily action/reset, image-first Life Canvas и редкими premium video moments.'],
      ['Что отличает', 'У конкурентов смысл, ритуал, AI-память и визуал часто живут отдельно. AURA соединяет их в причинную петлю.'],
      ['Что не делаем', 'Не строим безлимитный AI-video generator, социальную сеть или marketplace экспертов в MVP. Сначала доказываем loop.'],
      ['Критерий жизни продукта', 'Если пользователь может объяснить, почему Canvas изменился, AURA имеет шанс. Если нет — это просто генератор красивых картинок.']
    ]
  },
  {
    title: 'Продуктовая петля',
    type: 'pipeline',
    items: [
      ['Дата рождения + запрос', 'личный контекст'],
      ['Прогноз недели', 'арка сезона'],
      ['Daily episode', 'фокус дня'],
      ['Action / Reset', 'маленькое действие'],
      ['Life Canvas', 'видимая причинность']
    ],
    note: 'Петля и есть продукт: Episode → Action → Reset → Reflection → Life Canvas → Tomorrow Hook.'
  },
  {
    title: 'Путь пользователя: первые 30 дней',
    type: 'dayJourney',
    stages: [
      ['День 0', 'Момент поиска', 'Пользователь хочет смысл на неделю, мягкий reset или визуальный образ будущей версии себя.'],
      ['День 1', 'Первая петля', 'Дата рождения + контекст → первый прогноз → одно действие → первый сдвиг Life Canvas.'],
      ['День 7', 'Первый сезон', 'Пользователь видит недельную арку, помнит действия и получает recap/визуальный артефакт.'],
      ['День 30', 'Личная система', 'AURA становится ритуалом: память ассистента, сезоны, premium-визуалы, годовой путь.']
    ],
    note: 'AURA работает только если пользователь понимает цепочку: ввод → смысл → действие → видимое изменение → возврат завтра.'
  },
  {
    title: 'Ключевые экраны',
    type: 'appScreens',
    screens: [
      ['01', 'Данные рождения', 'дата / время / место\nтекущий вопрос'],
      ['02', 'Прогноз недели', 'тема сезона\n3 напряжения\nпервое обещание'],
      ['03', 'Daily episode', 'фокус дня\nсообщение ассистента\nкарточка действия'],
      ['04', 'Reset', '2-мин практика\nрефлексия\nзавершение'],
      ['05', 'Life Canvas', 'до / после\nчто изменилось\nпочему изменилось'],
      ['06', 'Paywall', 'продолжить сезон\nPlus / annual\nvideo token']
    ],
    note: 'Это не финальный UI-дизайн. Это логика того, что дизайнер должен сделать видимым на экране.'
  },
  {
    title: 'Life Canvas должен объяснять причинность',
    type: 'lifeCanvasDemo',
    leftLabel: 'До действия',
    rightLabel: 'После действия',
    cause: 'Пользователь сделал reset и reflection, поэтому Canvas меняется из “туман / давление” в “понятный маршрут / собранное состояние”.',
    rule: 'Если пользователь говорит “ИИ просто нарисовал другую картинку” — продукт провалился. Если говорит “картинка изменилась, потому что я действовал” — AURA жива.'
  },
  {
    title: 'Premium-видео — это момент магии',
    type: 'premiumMoment',
    claim: 'Видео можно включать в подписку только если модель дешевая и жестко лимитирована: один 8s ролик в неделю, а не безлимитная генерация.',
    economics: [
      ['Runway 8 sec', '~$0.40 себестоимость'],
      ['4 видео/мес', '~$1.60 себестоимость'],
      ['30 daily images', '~$0.60-$1.20 себестоимость'],
      ['Итого media', '~$2.20-$3.80/мес до буфера']
    ],
    note: 'Бизнес-ход: продавать визуальную подписку, но жестко лимитировать генерации и считать каждый asset.'
  },
  {
    title: 'Архитектура paywall',
    type: 'paywallArchitecture',
    tiers: [
      ['Free', '$0', 'первый прогноз\n3-7 daily cards\nлимит картинок\nбез weekly video', 'активация'],
      ['Plus test', '$9.99-$12.99', 'daily cards\n30 images/mo\n0-2 видео/мес\nmemory + recap', 'стартовый тест'],
      ['Visual Plus', '$14.99', '30 images/mo\n4 weekly videos\nmemory + recap', 'пакет с видео'],
      ['Annual', '$79-$89/год', 'тот же пакет\nниже churn\nденьги вперед', 'cashflow']
    ],
    note: '$14.99 — не внезапное повышение, а верхний тест для пакета с 4 видео/мес. Базовую цену нужно тестировать.'
  },
  {
    title: 'Почему это не просто астрология',
    type: 'solution',
    leftTitle: 'Что дают существующие приложения',
    left: ['Astrology: смысл, но часто слишком общий и пассивный.', 'Mindfulness: ритуал, но часто недостаточно персональный.', 'AI companion: разговор, но не структурированная неделя.', 'Avatar tools: визуал, но слабая причинность.'],
    rightTitle: 'Что соединяет AURA',
    right: ['Контекст даты рождения без фаталистичного позиционирования.', 'Недельный сезон, который дает структуру.', 'Daily micro-action, который возвращает agency.', 'Life Canvas, который меняется по причине.', 'Premium-видео как редкий proof-of-magic, а не ежедневная утечка COGS.']
  },
  {
    title: 'Карта рынка',
    type: 'marketSize',
    items: [
      ['PAM', 'consumer mobile apps', 'AURA конкурирует за ежедневную привычку открывать приложение ради смысла, reset и самонавигации.'],
      ['TAM', '4 платных поведения', 'личная навигация, wellness-ритуал, память AI-companion, визуальная идентичность/avatar progression.'],
      ['SAM', 'apps + web + AI tools', 'исследование покрывает app stores, web apps, paywalls, соседние инструменты и ручной competitor walkthrough.'],
      ['SOM', '100k-300k users', 'достижимый первый масштаб, если creator-led GTM, недельные сезоны и premium-визуалы работают.'],
      ['UP', '$30-80M ARR path', 'подписка + annual + premium tokens + creator seasons могут дать venture-relevant upside.']
    ],
    note: 'Рынок — это не один horoscope TAM. Это пересечение paid personal meaning, daily ritual и AI visual identity.'
  },
  {
    title: 'Как работают цифры',
    type: 'numberLogic',
    steps: [
      ['1', 'Внешние сигналы', 'Rev.now / Sacra / press / API pricing', 'Revenue, MAU, payers, price, public COGS'],
      ['2', 'Производные бенчмарки', 'расчет из открытых сигналов', 'ARPMAU, paid conversion, CAC bands, COGS per user'],
      ['3', 'Гипотезы AURA', 'conservative / base / strong', 'pricing, conversion, token attach, no-free-video rule'],
      ['4', 'Продуктовые решения', 'что реально строим', 'Plus, annual, token video, image-first Life Canvas']
    ],
    note: 'Презентация не считает оценки конкурентов абсолютной правдой. Она использует их как рамки для гипотез AURA.'
  },
  {
    title: 'Четыре главные цифры',
    type: 'bigNumbers',
    numbers: [
      ['2.5-3.0%', 'base paid conversion', 'из Co-Star / Nebula / The Pattern style subscription apps'],
      ['$0.35-$0.50', 'base ARPMAU target', 'AURA нужна подписка + visual/token uplift, чтобы быть сильнее long-tail astrology'],
      ['$0.80-$1.50', 'strong ARPMAU target', 'если работают high-intent premium moments: future-self, relationship, video'],
      ['<$1.50', 'daily AI/image COGS target', 'ежедневная петля без видео должна быть достаточно дешевой для подписки $9.99-$14.99']
    ],
    note: 'Если ломается хотя бы одна из этих цифр, продуктовую модель нужно менять до масштабирования.'
  },
  {
    title: 'Пороговые показатели запуска',
    type: 'metricScorecard',
    rows: [
      ['Метрика', 'Минимум', 'Хороший сигнал', 'Решение'],
      ['Понимание категории', '>70%', '>85%', 'можно объяснять продукт без длинной продажи'],
      ['Canvas causality', '>50%', '>65%', 'Life Canvas работает как ядро, не как случайная картинка'],
      ['Возврат D1', '>20%', '>30%', 'daily episode вызывает возврат'],
      ['Платный интерес', '>5%', '>8-10%', 'можно переходить к paywall / pricing test'],
      ['COGS платящего', '<$4/мес', '<$3/мес', 'Visual Plus не убивает маржу'],
      ['CAC активированного', '<$1.00', '<$2.00 при сильном LTV', 'можно начинать маленькие paid tests']
    ],
    note: 'Эти пороги превращают презентацию в систему решений: не “верим в идею”, а проверяем конкретные условия перехода дальше.'
  },
  {
    title: 'Экономика конкурентов: главный вывод',
    type: 'proofMatrix',
    rows: [
      ['Вопрос', 'Сигнал конкурента', 'Что это доказывает', 'Решение для AURA'],
      ['Люди платят за личный смысл?', 'Co-Star iOS: $797.5K/мес, 2.7M MAU, 64K payers', 'да, но conversion ближе к 2-3%', 'base conversion: 2.5-3.0%'],
      ['Spiritual guidance монетизируется?', 'Nebula iOS: $718K/мес, 52K payers, $0.33 ARPMAU', 'да, но агрессивный paywall ломает доверие', 'продавать causality + season, не vague psychic pressure'],
      ['Daily ritual может стать большим?', 'Calm: proxy $300M/год, 4M+ subscribers', 'да, если есть доверие и annual habit', 'annual plan после первой завершенной недели'],
      ['AI/avatar создает paid intent?', 'Replika Android: оценка $2.36M/мес, 99K payers proxy', 'да, пользователи платят за memory/avatar/voice', 'память ассистента + visual identity layer'],
      ['Urgent guidance повышает ARPMAU?', 'AstroTime Android: $1.82 ARPMAU, 4.5% conversion', 'да, high-intent moments монетизируются лучше', 'future-self / relationship / video tokens']
    ],
    conclusion: 'Base-case AURA должен считаться как subscription self-discovery, upside — как premium visual/guidance moments.'
  },
  {
    title: 'Unit-экономика astrology-приложений',
    type: 'competitorEconomics',
    rows: [
      ['Продукт', 'Revenue / scale signal', 'Видимая экономика', 'Вывод для AURA'],
      ['Co-Star iOS', '$797.5K/мес; 2.7M MAU; 64K payers', 'ARPMAU ~$0.30; conversion ~2.4%; $8.99/мес + IAP', 'base paid conversion должен быть 2-3%, не fantasy 8-10%'],
      ['Nebula iOS', '$718K/мес; 2.2M MAU; 52K payers', 'ARPMAU ~$0.33; conversion ~2.4%; $9.99/мес + weekly IAPs', 'personal guidance монетизируется, но trust paywall хрупкий'],
      ['The Pattern iOS', '$36.1K/мес; 160K MAU; 4K payers', 'ARPMAU ~$0.23; conversion ~2.5%', 'relationship/self-insight работает, но depth сам по себе не гарантирует scale'],
      ['AstroSage Android', '$547.8K/мес; 2.4M MAU; 34K payers', 'ARPMAU ~$0.23; conversion ~1.4%', 'birth-data utility дает большой reach при более низкой conversion'],
      ['AstroTime Android', '$440.8K/мес; 242K MAU; 11K payers', 'ARPMAU ~$1.82; conversion ~4.5%', 'urgent guidance mechanics могут поднять conversion и ARPMAU'],
      ['Astrotalk company', 'Rs 1,214 crore FY25 total revenue reported', 'consultation marketplace, не pure app subscription', 'human/expert layer — upside later, не MVP core']
    ],
    note: 'Источник: оценки Rev.now и публичные отчеты/пресса. Это directional benchmarks, не audited internal P&L.'
  },
  {
    title: 'Unit-экономика mindfulness-приложений',
    type: 'competitorEconomics',
    rows: [
      ['Продукт', 'Revenue / scale signal', 'Видимая экономика', 'Вывод для AURA'],
      ['Calm brand', 'proxy $300M/год; 4M+ paying subscribers', '$70/год и $14.99/мес price anchors', 'annual wellness subscription может быть большой при доверии и routine'],
      ['Calm Android', '$2.35M/мес; 3.6M MAU; 85K payers', 'ARPMAU ~$0.65; conversion ~2.4%', 'wellness может монетизироваться выше astrology ARPMAU, но нужна retention'],
      ['Headspace', '~$200M/год brand proxy; app-store proxy ~$39-40M/год', '$12.99/мес price signal', 'off-store/B2B revenue может занижать видимую app economics'],
      ['Waking Up', '$492.7K/мес iOS leaderboard estimate', '$19.99/мес; $129.99/год', 'trusted teacher voice может оправдать premium pricing'],
      ['Balance Android', '$180K/мес; ~317K MAU; 11K payers', 'ARPMAU ~$0.57; conversion ~3.5%', 'personalization может outperform generic meditation libraries'],
      ['Meditopia iOS', '$118.4K/мес; 629K MAU', 'ARPMAU ~$0.19', 'большой MAU без сильной monetization все еще может быть тонким']
    ],
    note: 'AURA должна взять daily ritual и annual plan logic, а не строить гигантскую meditation library.'
  },
  {
    title: 'Экономика AI companion / avatar',
    type: 'competitorEconomics',
    rows: [
      ['Продукт', 'Revenue / scale signal', 'За что платят', 'Вывод для AURA'],
      ['Character.AI', '$30M-$32M ARR proxy; c.ai+ $9.99/мес', 'priority, memory, engagement, chat volume', 'AI может монетизировать engagement, но inference cost и safety доминируют'],
      ['Replika Android', 'оценка $2.36M/мес; 99K payers proxy', 'AI companion, avatar, memory, voice/video features', 'пользователи платят за emotional continuity, не raw text chat'],
      ['Finch iOS', '$1.5M-$2.0M/мес public estimate range', 'self-care pet, soft progression, daily loop, Plus features', 'daily companion mechanics могут монетизироваться без scary “therapy” positioning'],
      ['HeyGen / D-ID', 'API pricing показывает, что avatar video — paid compute', '$0.05-$0.0667/sec или plan/credit based pricing', 'talking avatar — premium event, не free habit content'],
      ['AURA', '$9.99-$14.99/мес + tokens target', 'season, assistant memory, Life Canvas, rare video', 'должна быть cost-controlled AI product под premium visual wrapper']
    ],
    note: 'Аватар — не декорация. Он должен помогать пользователю понять, почему изменилась неделя.'
  },
  {
    title: 'За что люди реально платят',
    type: 'pricingTable',
    rows: [
      ['Платный объект', 'Где видно у конкурентов', 'Почему платят', 'Эквивалент в AURA'],
      ['Месячная подписка', 'Co-Star, Nebula, CHANI, Calm, Balance', 'регулярная личная ценность и низкое трение', 'AURA Plus: weekly season + memory + Life Canvas'],
      ['Годовая подписка', 'Calm, Headspace, Waking Up, CHANI', 'commitment и cashflow, когда доверие уже сформировано', '$79-$89 annual после первой завершенной недели'],
      ['Compatibility / relationship report', 'Co-Star, The Pattern, Nebula', 'эмоционально важный personal insight', 'relationship / future-self special episode'],
      ['Live или urgent guidance', 'Astrotalk, AstroTime, Astroyogi', 'момент тревоги: “ответь мне сейчас”', 'сначала AI assistant; human/creator layer позже'],
      ['Special visual asset', 'soulmate sketch, aura reading, avatar/video tools', 'ownable image себя/будущего/периода', 'Life Canvas trailer или future-self video token']
    ]
  },
  {
    title: 'Решение по pricing',
    type: 'auraMath',
    rows: [
      ['План', 'Цена', 'Что входит по генерации', 'Логика маржи'],
      ['Free', '$0', 'первый прогноз + Day 1 loop + один medium Life Canvas', 'COGS target <$0.20; цель — activation, не щедрость'],
      ['Plus test', '$9.99', 'daily loop, memory, weekly recap, 30 images/mo, без обязательных 4 видео', 'нижний price test; проверяем willingness-to-pay'],
      ['Visual Plus', '$12.99-$14.99', '30 images/mo + 4 weekly Runway 8s videos + recap', '$14.99 — верхний тест для полного video bundle'],
      ['Plus annual', '$79-$89/year', 'тот же loop + annual season framing', 'cashflow и ниже churn pressure'],
      ['Premium video token', '$4.99-$9.99', 'Veo/Replicate/HeyGen high-quality moment', 'нужен, если COGS $2-$4+ или нужен “wow” выше подписки'],
      ['Creator season', '$14.99-$29.99', 'limited guided pack / custom assistant style', 'монетизирует content leverage, не только compute']
    ],
    conclusion: 'AURA не должна продавать unlimited AI. Она продает season, memory, causality и лимитированные visual events.'
  },
  {
    title: 'Гипотезы conversion / ARPMAU',
    type: 'finance',
    rows: [
      ['Метрика', 'Conservative', 'Base', 'Strong'],
      ['Paid conversion', '1.5%', '2.5-3.0%', '4.0-5.0%'],
      ['Monthly ARPMAU', '$0.20', '$0.35-$0.50', '$0.80-$1.50'],
      ['Monthly price', '$9.99', '$11.99-$12.99 blended', '$14.99'],
      ['Token buyer share', '3%', '8-12%', '15-20%'],
      ['CAC payer', '$300-$800', '$100-$250', '$30-$100'],
      ['Вердикт', 'content app risk', 'работает, если понятна causality', 'работает только с high-intent moments']
    ],
    note: 'Гипотезы построены из оценок конкурентов: Co-Star, Nebula, The Pattern, AstroSage, AstroTime, Calm и Balance.'
  },
  {
    title: 'От бенчмарков к модели AURA',
    type: 'assumptionBridge',
    rows: [
      ['Вводная', 'Диапазон бенчмарков', 'Гипотеза AURA', 'Почему это разумно'],
      ['Paid conversion', '1.4-2.5% subscription astrology; 3.5% Balance; 4.5% AstroTime', '2.5-3.0%', 'base case предполагает, что value доказана до paywall'],
      ['ARPMAU', '$0.19-$0.37 subscription astrology; $0.57-$0.65 wellness; $1.82+ urgent guidance', '$0.35-$0.50', 'AURA должна быть сильнее generic astrology за счет visual/token uplift'],
      ['Monthly price', '$8.99-$14.99 common paid band; $19.99+ premium teacher apps', '$9.99-$12.99 base; $14.99 visual test', '$14.99 появляется только как верхний тест для video bundle'],
      ['Video COGS', 'Runway ~$0.40 / 8s; Veo ~$4 / 8s; HeyGen ~$1.50-$2 / 30s', '4 Runway clips / paid month; no free video', 'weekly video можно держать в Plus только при лимитах и capped retries'],
      ['CAC payer', '$50-$150 organic/social; $150-$500+ paid web2app', '$100-$250 base', 'paid acquisition только после retention и paywall data']
    ],
    note: 'Это важный мост: данные конкурентов — не готовая модель, а guardrail для модели AURA.'
  },
  {
    title: 'Подписка на генерации',
    type: 'generationPackage',
    rows: [
      ['Asset', 'Частота / месяц', 'Модель', 'Unit COGS', 'Monthly COGS'],
      ['Текст daily card', '30', 'LLM mini / structured prompt', '$0.003-$0.008', '$0.10-$0.25'],
      ['Daily image / Life Canvas frame', '30', 'Runway gen4_image_turbo или low-cost image model', '$0.02-$0.04', '$0.60-$1.20'],
      ['Weekly 8s video', '4', 'Runway Gen-4 Turbo, 5 credits/sec', '~$0.40', '~$1.60'],
      ['Retry / failed generation buffer', '20-30%', 'media retry reserve', 'n/a', '$0.50-$1.10'],
      ['Storage / infra / analytics', 'месяц', 'S3 + backend + events', 'n/a', '$0.20-$0.50'],
      ['Total paid user COGS', 'Visual Plus package', 'subscription generation bundle', 'n/a', '~$2.40-$4.05/мес']
    ],
    note: 'Рекомендуемый Visual Plus bundle: 30 daily visual cards + 4 weekly videos, жестко лимитировано.'
  },
  {
    title: 'Стоимость free user и break-even conversion',
    type: 'freeUserModel',
    rows: [
      ['Free-сценарий', 'Что входит', 'Free COGS / activated user', 'Что должно случиться'],
      ['Light free trial', 'первый прогноз + 3 cards + 1 image', '$0.08-$0.18', 'безопасно для broad acquisition tests'],
      ['7-day free loop', '7 daily cards + 7 images + no video', '$0.25-$0.55', 'работает только если видны D1/D7 и paywall intent'],
      ['Free video trial', '1 free 8s Runway video', '+$0.40-$0.60', 'рискованно, если не поднимает conversion резко'],
      ['Plus contribution', '$12.99 blended price, 15% fee, $2.40-$4.05 COGS', '$6.99-$8.64 / month', 'базовая subscription margin per payer'],
      ['Break-even CAC activated', '3% conversion, 3-month payer life', '~$0.42-$0.78', 'paid ads пока нельзя масштабировать без лучшего LTV'],
      ['Strong CAC activated', '5% conversion, 4-month payer life', '~$1.40-$1.73', 'возможно только при сильной retention и visual proof']
    ],
    note: 'Free users не бесплатны. AURA должна тестировать paid acquisition только после замера free COGS и paywall conversion.'
  },
  {
    title: 'Бенчмарки стоимости генерации',
    type: 'costBenchmarks',
    rows: [
      ['Layer', 'Provider / model', 'Public price signal', 'Вывод для AURA'],
      ['LLM', 'OpenAI GPT-4.1 mini', '$0.40 / 1M input tokens; $1.60 / 1M output tokens', 'daily text loop дешевый, если prompts структурированы'],
      ['Image', 'OpenAI Images', '~$0.01 low / $0.04 medium / $0.17 high per square image', 'Life Canvas можно включать, если image count capped'],
      ['Cinematic video', 'Google Veo 2 / Vertex AI', '~$0.50 per generated second', '8 sec ~= $4.00; нельзя делать free daily content'],
      ['Cinematic video', 'Runway API', '$0.25 per 5 sec API example', '8 sec ~= $0.40; подходит для тестов, но нужен retry budget'],
      ['Video model', 'Replicate Wan 2.1 720p', '$0.24 per output second', '8 sec ~= $1.92; лучше как paid token / milestone'],
      ['Talking avatar', 'HeyGen API Avatar IV/V', '$0.05/sec photo avatar; $0.0667/sec digital twin', '30 sec ~= $1.50-$2.00; не default daily loop'],
      ['Avatar API', 'D-ID Build plan', '$14.4/mo annual plan; up to 16 offline video min', '~$0.90/min plan math, но limits/watermark/credits важны']
    ],
    note: 'Все цены — public API/pricing-page signals на июнь 2026; exact billing нужно перепроверить перед закупкой.'
  },
  {
    title: 'Стоимость пользователя / месяц',
    type: 'unitCost',
    rows: [
      ['Тип пользователя', 'Usage assumption', 'Variable AI cost', 'Бизнес-смысл'],
      ['Free active user', '8 text loops + 1 medium image + no video', '$0.10-$0.20 / MAU', 'безопасно, если onboarding capped и нет free video'],
      ['Engaged free user', '20 text loops + 2 images + no video', '$0.25-$0.45 / MAU', 'допустимо только если видны retention и conversion'],
      ['Visual Plus с Runway video', '30 cards + 30 images + 4 weekly 8s videos', '$2.40-$4.05 / payer', '$12.99-$14.99 может держать margin при capped retries'],
      ['Plus с Veo video', '+ four weekly 8s Veo clips', '+$16.00 before retries', 'слишком дорого для базовой подписки'],
      ['Premium avatar token', 'HeyGen / talking-avatar moment', '$1.50-$2.00 per 30 sec', 'продавать отдельным pack или milestone'],
      ['High-quality video token', 'Replicate / Veo / premium model', '$1.92-$4.00 per 8 sec', 'price token by model quality']
    ],
    formula: 'COGS = LLM tokens + images + video seconds × provider price + storage + support + failed-generation buffer.',
    conclusion: 'Daily product может быть дешевым. Weekly video жизнеспособно только как capped paid subscription benefit или token.'
  },
  {
    title: 'Stress-test стоимости видео',
    type: 'videoStress',
    rows: [
      ['Сценарий', '100 users', '1,000 users', '10,000 users', 'Вывод'],
      ['4 weekly Runway clips / payer', '$160', '$1,600', '$16,000', 'жизнеспособно внутри $12.99-$14.99, если paid cohort реальный'],
      ['4 weekly Veo clips / payer', '$1,600', '$16,000', '$160,000', 'не жизнеспособно как base subscription bundle'],
      ['1 free Runway trial clip', '$40 COGS', '$400 COGS', '$4,000 COGS', 'только если резко поднимает paid conversion'],
      ['1 premium Replicate/Wan clip', '$192 COGS', '$1,920 COGS', '$19,200 COGS', 'нужен $4.99-$9.99 token или bundle'],
      ['1 paid 30s HeyGen avatar', '$150-$200 COGS', '$1,500-$2,000', '$15,000-$20,000', 'работает для premium forecast / assistant moment'],
      ['30 daily Life Canvas images', '$60-$120 COGS', '$600-$1,200', '$6,000-$12,000', 'безопасно только для paid users, capped retries']
    ],
    note: 'Решение: Runway может быть weekly subscription video; Veo/avatars остаются premium или later.'
  },
  {
    title: 'Базовая финансовая модель AURA',
    type: 'finance',
    rows: [
      ['Сценарий', '10k MAU', '50k MAU', '150k MAU'],
      ['Paid conversion', '1.5%', '3.0%', '4.5%'],
      ['Payers', '150', '1,500', '6,750'],
      ['Gross subscription @ $12.99 blended', '$1.9K/мес', '$19.5K/мес', '$87.7K/мес'],
      ['Net после 15% fee', '$1.7K/мес', '$16.6K/мес', '$74.5K/мес'],
      ['COGS генерации paid users', '$0.4K-$0.6K', '$3.6K-$6.1K', '$16.2K-$27.3K'],
      ['Вердикт', 'тонко, пока не доказана retention', 'работает при capped free COGS', 'сильно, если annual + token upsell работают']
    ],
    note: 'Base model считает blended price $12.99. $14.99 — верхний тест для полного Visual Plus с 4 видео/мес.'
  },
  {
    title: 'Как читать финансовую модель',
    type: 'financialGlossary',
    terms: [
      ['MAU', 'активные пользователи в месяц', 'сколько людей реально пользуются продуктом'],
      ['Платящие', 'часть MAU, которая купила подписку или токен', 'главный источник выручки'],
      ['Выручка', 'деньги от подписок и платных генераций до/после комиссий', 'показывает потенциал бизнеса'],
      ['COGS', 'переменные расходы на AI, картинки, видео, storage и ошибки генерации', 'чем выше COGS, тем быстрее съедается маржа'],
      ['CAC', 'стоимость привлечения одного пользователя или платящего клиента', 'если CAC выше LTV, масштабировать нельзя'],
      ['Runway', 'сколько денег нужно до следующей проверки', 'это бюджет риска, а не обещание прибыли']
    ],
    note: 'Финмодель ниже — не обещание результата. Это рамка принятия решения: сколько нужно вложить, какие метрики должны сойтись и когда проект может стать денежным.'
  },
  {
    title: 'Сколько может стоить проект по стадиям',
    type: 'pricingTable',
    rows: [
      ['Стадия', 'Бюджет', 'Что входит', 'Что покупаем этим бюджетом'],
      ['Фаза 1: проверка', '€4k-€10k', 'прототип, visual examples, лендинг, микро-маркетинг, когорта 30 пользователей', 'ответ: есть ли спрос, платное намерение и понятная причинность'],
      ['Фаза 2: MVP', '€25k-€60k', 'mobile/web MVP, вход, onboarding, daily cards, Life Canvas, paywall, аналитика', 'ответ: может ли пользователь пройти петлю без ручного сопровождения'],
      ['Фаза 3: запуск', '€40k-€120k', 'generation pipeline, billing, CRM/admin, creator pack, paid/creator tests', 'ответ: сходятся ли удержание, CAC и себестоимость генерации'],
      ['Фаза 4: масштаб', '€150k-€500k+', 'native app polish, backend scale, content ops, creator network, paid acquisition', 'ответ: можно ли идти к $50k-$100k MRR без разрушения маржи']
    ]
  },
  {
    title: 'Операционная экономика при росте пользователей',
    type: 'pricingTable',
    rows: [
      ['Показатель', '1k MAU', '10k MAU', '50k MAU'],
      ['Платная конверсия', '2.0%', '3.0%', '3.5%'],
      ['Платящих пользователей', '20', '300', '1,750'],
      ['Подписка после комиссии', '~$220/мес', '~$3.3k/мес', '~$19.3k/мес'],
      ['COGS генерации paid users', '$50-$80', '$0.7k-$1.2k', '$4.2k-$7.1k'],
      ['COGS free users', '$100-$300', '$1k-$3k', '$5k-$15k'],
      ['Инфраструктура / support / tools', '$100-$300', '$500-$1.5k', '$2k-$6k'],
      ['Вердикт', 'только обучение', 'первые revenue-сигналы', 'может стать small business, если CAC низкий']
    ]
  },
  {
    title: 'Финансовый путь: от проверки до cash-out',
    type: 'pricingTable',
    rows: [
      ['Этап', 'Цель', 'Финансовый смысл', 'Решение'],
      ['Проверка', '30 users, paid intent >5%, Canvas causality >50%', 'не выручка, а снятие главного product risk', 'делать / не делать MVP'],
      ['Первая выручка', '100 payers, ~$1.3k MRR gross', 'подтверждение, что люди платят за формат', 'оставить price / поменять bundle'],
      ['Путь к break-even', '1k-2k payers, ~$13k-$26k MRR gross', 'покрывает небольшой продуктовый/ops костяк', 'нанимать аккуратно, не раздувать burn'],
      ['Seed / стратегический рост', '5k-10k payers, ~$65k-$130k MRR gross', 'появляется инвестиционный или acquisition narrative', 'масштабировать GTM и creator layer'],
      ['Cash-out опция', '$1M+ ARR, удержание и CAC доказаны', 'можно обсуждать продажу, revenue-share или рост как standalone', 'выбор: cashflow business / seed / strategic exit']
    ]
  },
  {
    title: 'Финансовая модель: главный dashboard',
    type: 'financeDashboardV2',
    tiles: [
      ['Фаза 1', '€4k-€10k', 'прототип, визуалы, лендинг, 30-user cohort'],
      ['Pre-scale runway', '€80k-€150k', 'бережливый бюджет до сильной MVP-проверки, не весь путь к 150k MAU'],
      ['Base price', '$9.99-$12.99', 'основной тест подписки без перегруза видео'],
      ['Visual Plus', '$14.99', 'только если 4 видео/мес держат COGS'],
      ['Paid COGS', '$2.40-$4.05', '30 images + 4 Runway videos + retry buffer'],
      ['Go/No-Go', 'D1 >20%\nintent >5%', 'иначе режем scope или останавливаем']
    ],
    flow: [
      ['M1-M2', 'proof of desire'],
      ['M3-M6', 'MVP loop'],
      ['M7-M12', 'paid scale test'],
      ['Q4+', 'break-even attempt']
    ],
    note: 'Фаза 1 — не “сделать весь продукт”, а купить право принять решение о MVP.'
  },
  {
    title: 'Помесячная финмодель: M1-M6',
    type: 'pricingTable',
    widths: [92, 250, 170, 165, 165, 228],
    tableY: 142,
    rowH: 58,
    rows: [
      ['Месяц', 'Фокус', 'MAU / платящие', 'Выручка', 'Расходы', 'Нужно денег'],
      ['M1', 'validation sprint: визуалы, лендинг, интервью', '0.1k / 0', '$0', '€5k-€8k', '€5k-€8k'],
      ['M2', 'clickable prototype + first cohort', '0.5k / 10', '$0-$0.1k', '€5k-€8k', '€10k-€16k'],
      ['M3', 'MVP build: weekly loop + paywall', '1k / 30', '$0.3k-$0.5k', '€10k-€16k', '€20k-€31k'],
      ['M4', 'private beta + manual generation', '3k / 80', '$0.8k-$1.5k', '€12k-€20k', '€31k-€50k'],
      ['M5', 'creator tests + COGS tracking', '6k / 150', '$1.5k-$3k', '€15k-€25k', '€44k-€73k'],
      ['M6', 'first paywall iteration', '10k / 300', '$3k-$6k', '€18k-€30k', '€59k-€97k']
    ],
    note: 'Первые 6 месяцев — это не cash-out, а поиск петли: paid intent, retention, COGS и понятность Life Canvas.'
  },
  {
    title: 'Помесячная финмодель: M7-M12',
    type: 'pricingTable',
    widths: [92, 250, 170, 165, 165, 228],
    tableY: 142,
    rowH: 58,
    rows: [
      ['Месяц', 'Фокус', 'MAU / платящие', 'Выручка', 'Расходы', 'Нужно денег'],
      ['M7', 'public beta + paid creative tests', '15k / 450', '$5k-$9k', '€20k-€35k', '€74k-€123k'],
      ['M8', 'annual/token experiment', '25k / 750', '$8k-$15k', '€22k-€40k', '€88k-€148k'],
      ['M9', 'retention cohorts + creator pack', '40k / 1,200', '$12k-$25k', '€25k-€45k', '€101k-€168k'],
      ['M10', 'launch system + careful CAC tests', '60k / 1,800', '$18k-$40k', '€30k-€55k', '€113k-€183k'],
      ['M11', 'scale only if CAC/COGS сходятся', '90k / 3,000', '$30k-$65k', '€35k-€65k', '€118k-€183k'],
      ['M12', 'break-even attempt / seed story', '150k / 6,750', '$60k-$100k', '€45k-€80k', 'peak €500k+ при полном scale-пути']
    ],
    note: 'Важно: €4k-€10k — первая проверка; €80k-€150k — pre-scale runway; путь к 150k MAU требует отдельного scale-бюджета.'
  },
  {
    title: 'Квартальная модель: выручка, расходы, runway',
    type: 'pricingTable',
    widths: [190, 170, 170, 170, 170, 190],
    tableY: 142,
    rowH: 54,
    rows: [
      ['Показатель', 'Q1', 'Q2', 'Q3', 'Q4', 'Year 1'],
      ['MAU на конец периода', '0.5k-2k', '5k-15k', '20k-60k', '50k-150k', 'цель: доказать scale'],
      ['Платящих на конец периода', '30-100', '150-500', '600-2,000', '1,500-6,750', 'конверсия 2-4.5%'],
      ['Валовая выручка', '$0.5k-$2k', '$3k-$10k', '$18k-$47k', '$60k-$150k', '$80k-$210k'],
      ['Product + AI + infra', '€12k-€22k', '€30k-€55k', '€45k-€80k', '€55k-€100k', '€140k-€257k'],
      ['Marketing / launch', '€3k-€8k', '€8k-€18k', '€15k-€35k', '€25k-€60k', '€51k-€121k'],
      ['Чистый cashflow', '-€15k…-€28k', '-€35k…-€60k', '-€40k…-€120k', '-€10k…-€350k', 'cash need: €80k-€150k до scale; €500k+ при 150k MAU']
    ],
    note: 'Break-even в base-case не гарантирован в первый год. При агрессивном росте к 150k MAU нужен отдельный scale-бюджет.'
  },
  {
    title: 'Годовые сценарии: сколько может приносить',
    type: 'pricingTable',
    widths: [210, 200, 200, 200, 260],
    tableY: 146,
    rowH: 62,
    rows: [
      ['Сценарий', 'Год 1', 'Год 2', 'Год 3', 'Что это значит'],
      ['Conservative', '$40k-$120k ARR run-rate', '$250k-$600k ARR', '$0.8M-$1.5M ARR', 'маленький cashflow-продукт, если CAC низкий и команда компактная'],
      ['Base', '$150k-$400k ARR run-rate', '$0.8M-$2M ARR', '$3M-$6M ARR', 'можно строить standalone business или поднимать seed под рост'],
      ['Strong', '$0.5M-$1M ARR run-rate', '$3M-$6M ARR', '$8M-$15M ARR', 'появляется стратегический интерес: wellness, astrology, AI companion, creator platform'],
      ['Главный драйвер', 'paid intent и понятность Canvas', 'retention + annual + CAC', 'creator layer + paid scale', 'рост держится не на “красивых видео”, а на повторяемой петле'],
      ['Главный stop-signal', 'D1 <20%, paid intent <5%', 'CAC > LTV, video COGS ест маржу', 'нет retention после novelty', 'тогда проект останавливаем или режем visual scope']
    ],
    note: 'Это не прогноз продаж, а рамка: сколько AURA может приносить при разных уровнях retention, CAC и paid conversion.'
  },
  {
    title: 'Маркетинговые бенчмарки',
    type: 'competitorEconomics',
    rows: [
      ['Конкурент / архетип', 'Public marketing signal', 'Риск', 'Как использовать в AURA'],
      ['Nebula', '$6.8M/мес estimated YouTube ad spend; 620 creatives; 18.6M visits Jan 2026; 50 landing pages', 'paid scale требует высокий LTV и агрессивную funnel', 'использовать как paid-test inspiration, не MVP operating model'],
      ['Nebula prelands', 'soulmate sketch 10% ad traffic; marriage compatibility 8.2%; aura reading 8%', 'curiosity hooks могут выглядеть scammy', 'аккуратно тестировать future-self / visual week / relationship hooks'],
      ['Co-Star', '20M+ downloads без real marketing spend; 25% young US women 18-25 downloaded historically', 'virality сложно повторить искусственно', 'строить shareable identity language и relationship/social hooks'],
      ['Astrotalk', 'FY25 total expenses Rs 1,129 crore; marketing/tech/ops/talent growth cited', 'marketplace growth дорогой операционно', 'не начинать с marketplace/expert model'],
      ['CHANI / Waking Up', 'trusted founder/teacher voice', 'требует настоящей authority', 'использовать экспертизу Алины без guru tone']
    ],
    note: 'Sources: Web2App World, Axios/TIME, Moneycontrol/ET-style reporting и qualitative product observations.'
  },
  {
    title: 'Модель маркетинговой воронки AURA',
    type: 'marketingModel',
    rows: [
      ['Этап', 'Conservative', 'Base', 'Strong', 'Решение'],
      ['Visitor -> signup', '8%', '15%', '25%', 'landing нужно тестировать до ad scale'],
      ['Signup -> activated', '35%', '50%', '65%', 'activation = first completed loop'],
      ['Activated -> paid', '1.5%', '3.0%', '5.0%', 'paywall после value moment'],
      ['CAC activated target', '<$0.50', '<$1.00', '<$2.00', 'на основе COGS + contribution margin'],
      ['First test budget', '$500', '$1,500-$3,000', '$5,000', 'маленькие тесты до scaling'],
      ['First 1,000 users', 'warm/interviews', 'creator + organic', 'creator + paid test', 'маркетинговый слой Алины ложится сверху']
    ],
    note: 'Маркетинг нельзя считать отдельно от free COGS. Чем щедрее free usage, тем ниже должен быть CAC.'
  },
  {
    title: 'Маркетинг в Фазе 1: что проверяем',
    type: 'pricingTable',
    rows: [
      ['Блок', 'Диапазон', 'Что делаем', 'Что должно стать понятно'],
      ['Visual examples', '€700-€1.5k', '3-5 примеров Life Canvas, future-self и week trailer', 'есть ли визуальный вау и понятна ли причинность'],
      ['Landing + analytics', '€500-€1.2k', 'лендинг, price test, lead capture, события activation/paid intent', 'какая цена и формулировка дают signup'],
      ['Creator micro-tests', '€1k-€3k', '5-10 micro creators / warm audiences / сторис-форматы', 'какие hooks вызывают интерес без тяжелой рекламы'],
      ['Paid creative tests', '€500-€2k', 'маленькие Meta/TikTok tests по 3-5 hooks', 'CAC visitor/signup и первичная конверсия'],
      ['Concierge cohort', '€800-€2k', '30 users, ручной forecast, интервью, paid-intent follow-up', 'понимают ли users продукт и готовы ли платить']
    ]
  },
  {
    title: 'Матрица маркетинговых hooks',
    type: 'pricingTable',
    rows: [
      ['Hook', 'Кому', 'Формат', 'CTA'],
      ['“Твоя неделя как трейлер”', 'visual AI / self-growth audience', 'short video before/after week trailer', 'получить свой week trailer'],
      ['“Не гороскоп, а план недели”', 'астро-аудитория с усталостью от generic прогнозов', 'creator explanation + example Canvas', 'пройти 7-day season'],
      ['“Future self изменился”', 'women 20-35, self-improvement', 'до/после Life Canvas + действие дня', 'увидеть future-self'],
      ['“Карманный прогнозист”', 'люди, которым нужен личный ориентир', 'screen walkthrough assistant memory', 'получить прогноз недели'],
      ['“Relationship / decision week”', 'high-intent emotional moments', 'тема недели + персональный вопрос', 'получить разбор недели']
    ]
  },
  {
    title: 'Go-to-Market стратегия',
    type: 'gtm',
    blocks: [
      ['1. Первые 100 не покупаются рекламой', 'warm users, interviews, ручные weekly forecasts и concierge cohort. Цель: понять loop, а не installs.'],
      ['2. Creator-led proof', 'micro creators в astrology/self-growth/visual AI проходят 7-day season и показывают опыт, не generic ad.'],
      ['3. Short-form hooks', 'future-self, weekly forecast, avatar transformation, “not horoscope”, before/after Life Canvas и paid-intent CTA.'],
      ['4. Shareable artifacts', 'Life Canvas card, season recap, future-self poster и trailer week как viral layer после value moment.']
    ]
  },
  {
    title: '30-дневный план проверки',
    type: 'validation',
    weeks: [
      ['Неделя 1', '20-30 interviews + ручной weekly forecast concierge'],
      ['Неделя 2', '10-screen prototype + 2 visual styles для Life Canvas'],
      ['Неделя 3', 'landing + price test $9.99 / $12.99 / $14.99'],
      ['Неделя 4', '30-50 users через 3-7 дней + paid-intent test']
    ],
    metrics: ['>70% понимают категорию', '>50% объясняют Canvas change', 'D1 >20%', 'paid intent >5%']
  },
  {
    title: 'Roadmap Фазы 1: 30 дней',
    type: 'pricingTable',
    rows: [
      ['Период', 'Deliverables', 'Метрики', 'Решение'],
      ['Дни 1-7', '3 концепта, 5 visual examples, landing structure, сценарий интервью', 'понятность идеи, сила visual hook', 'какие 1-2 концепции оставляем'],
      ['Дни 8-14', 'clickable prototype 8-10 screens, prompt logic, first Life Canvas styles', 'можно ли пройти loop без объяснений', 'что входит в MVP, что выкидываем'],
      ['Дни 15-21', '30-user concierge cohort, ручные forecasts, first creator tests', 'D1, понимание Canvas, качественная обратная связь', 'есть ли продуктовая петля'],
      ['Дни 22-30', 'price test $9.99/$12.99/$14.99, paid intent, CAC signup proxy', 'paid intent >5%, D1 >20%, Canvas causality >50%', 'go/no-go на MVP build']
    ]
  },
  {
    title: 'Roadmap Фазы 2: если Фаза 1 проходит',
    type: 'pricingTable',
    rows: [
      ['Этап', 'Что строим', 'Зачем', 'Gate'],
      ['MVP build', 'mobile/web prototype, auth, onboarding, weekly season, daily cards', 'дать пользователю пройти loop без ручного сопровождения', '30-100 активных пользователей'],
      ['Generation system', 'image prompts, Runway workflow, retry limits, COGS logging', 'контролировать стоимость каждого generated asset', 'COGS paid user <$4/мес'],
      ['Paywall test', 'Plus test, Visual Plus, annual, premium token', 'найти рабочую цену до масштабного маркетинга', 'paid conversion 2.5-3%+'],
      ['GTM scale test', 'creator pack, 10-20 hooks, small paid budget', 'понять, можно ли привлекать не только warm users', 'CAC activated в допустимом диапазоне'],
      ['Build decision', 'native app / backend / analytics / billing roadmap', 'переходить от проверки к разработке', 'только если retention + paid intent сходятся']
    ]
  },
  {
    title: 'Roadmap принятия решения',
    type: 'decisionRoadmapV2',
    steps: [
      ['01', 'Visual proof', '3-5 примеров Life Canvas и week trailer', 'есть вау + понятна причинность'],
      ['02', 'Prototype', '8-10 экранов и первый сценарий недели', 'пользователь проходит loop без объяснений'],
      ['03', 'Cohort', '30-50 users, интервью, paid-intent follow-up', 'D1 >20%, paid intent >5%'],
      ['04', 'MVP build', 'billing, analytics, generation logs, paywall', 'COGS paid user <$4/мес'],
      ['05', 'GTM test', 'creator hooks + маленький paid budget', 'CAC activated в допустимом диапазоне']
    ],
    rule: 'Каждая фаза заканчивается решением: продолжаем, режем scope или останавливаем.'
  },
  {
    title: 'Scope продукта: MVP vs Later',
    type: 'pricingTable',
    rows: [
      ['Layer', 'MVP', 'Later', 'Почему'],
      ['Core loop', 'Episode → Action → Reset → Reflection → Life Canvas', 'season branching и deeper memory', 'сначала нужно доказать causality'],
      ['Assistant', 'chosen tone + weekly context + memory summary', 'voice/video assistant, creator voices', 'text memory дешевле и быстрее валидировать'],
      ['Visual layer', 'image-first Life Canvas + avatar style', 'cinematic video, talking avatar', 'video — premium COGS'],
      ['Monetization', 'Plus + annual + one token test', 'creator seasons, expert layer, marketplace', 'избегаем complexity до retention'],
      ['Community', 'нет в MVP', 'sharing, social, cohorts', 'не строим social network до доказанной core value']
    ]
  },
  {
    title: 'Риски',
    type: 'risks',
    rows: [
      ['Риск', 'Как ломает продукт', 'Митигация'],
      ['Похоже на гороскоп', 'user thinks it is generic astrology', 'позиционировать как weekly life-series и action, не fate'],
      ['Avatar feels random', 'user cannot explain visual change', 'показывать cause рядом с Canvas и связывать с action/reflection'],
      ['Video cost kills margin', 'free users generate expensive clips', 'premium/token video only; log COGS per asset'],
      ['AI sounds generic', 'low trust and no return', 'prompt QA, user feedback и memory guardrails'],
      ['No paid intent', 'users like it but do not pay', 'paywall after first completed loop и price tests by cohort']
    ]
  },
  {
    title: 'Условия перехода к запуску',
    type: 'readinessCheck',
    rows: [
      ['Блок', 'Что уже понятно', 'Что остается допущением', 'Как проверяем'],
      ['Продуктовая логика', 'понятная петля: эпизод → действие → сброс → Canvas', 'насколько сильно пользователь почувствует причинность Canvas', '3-5 визуальных примеров + кликабельный прототип'],
      ['Финансовая модель', 'цена, себестоимость, бесплатный пользователь, привлечение и сценарии разделены', 'точная себестоимость зависит от провайдеров и фактического использования', 'логировать каждую генерацию и пересчитать после первой группы пользователей'],
      ['GTM', 'лучший старт — авторский контент и теплая аудитория, не закупка трафика', 'стоимость привлечения неизвестна до тестов креативов и лендинга', '10-20 креативных hooks + маленький платный тест после сигнала оплаты'],
      ['Технологии', 'MVP должен начинаться с изображений и лимитированного видео', 'выбор провайдера влияет на маржу', 'сравнить провайдеров перед разработкой и поставить лимиты'],
      ['Следующее решение', 'можно начинать фазу проверки', 'это еще не доказанный бизнес', 'решение по возврату, готовности платить, причинности Canvas и себестоимости']
    ],
    note: 'Вывод: следующая фаза должна не масштабировать идею, а быстро проверить петлю, цену и себестоимость на реальных пользователях.'
  },
  {
    title: 'Roadmap роста',
    type: 'roadmap',
    steps: [
      ['ИДЕЯ', 'прогноз + аватары'],
      ['MVP', 'недельный сезон + Canvas'],
      ['ОПЛАТА', 'Plus + первый токен'],
      ['УДЕРЖАНИЕ', 'возврат и итоги сезона'],
      ['РОСТ', 'авторы + платные тесты'],
      ['$1M ARR', 'визуальный движок + годовой план']
    ]
  },
  {
    title: 'Что нужно строить',
    type: 'overview',
    blocks: [
      ['Продукт', 'Персональная визуальная навигация недели: пользователь вводит данные рождения и контекст, получает прогноз, делает ежедневные микро-действия и видит, как развивается Life Canvas.'],
      ['MVP', 'Текстовый помощник, недельный сезон, ежедневный эпизод, действие/сброс/рефлексия, Life Canvas через изображения, платный Plus и один тест premium-видео.'],
      ['Цена', '$9.99 стартовый тест, $12.99 базовая подписка, $14.99 визуальный пакет с 4 видео/мес, $4.99-$9.99 premium-токены, без безлимитной генерации.'],
      ['Запуск', 'Начать с интервью и ручной проверки на небольшой группе, затем авторский контент, затем маленькие платные тесты вокруг “визуальной недели” и Future Self.'],
      ['Стоп-критерии', 'Останавливаемся или меняем продукт, если пользователи не понимают причинность Canvas, возврат на следующий день ниже 20%, готовность платить ниже 5% или себестоимость видео нельзя контролировать.'],
      ['Следующий шаг', 'Сделать 3-5 визуальных примеров, кликабельный прототип, группу из 30 пользователей и один тест цены / premium-токена.']
    ]
  },
  {
    title: 'Контакты / следующий шаг',
    type: 'contacts',
    name: 'AURA',
    cta: 'Следующий шаг: сгенерировать визуальные примеры, собрать кликабельный прототип, протестировать первых 30 пользователей и проверить, понимают ли они причинность Life Canvas.'
  }
];

const removedAsDuplicates = [
  ['Как читать презентацию', 'мета-слайд: маршрут уже понятен из структуры и компаса показателей'],
  ['Цветовая логика решений', 'служебная легенда, не влияет на решение клиента'],
  ['Как работают цифры', 'повторяет “Компас показателей” и “Четыре главные цифры”'],
  ['От бенчмарков к модели AURA', 'мост уже читается через конкурентов, pricing и финансовую модель'],
  ['Как читать финансовую модель', 'пояснения перенесены в слайды со словарем и dashboard'],
  ['Финансовый путь: от проверки до cash-out', 'дублирует помесячную, квартальную и годовую финмодель'],
  ['Go-to-Market стратегия', 'дублирует маркетинговую воронку, hooks и 30-дневный план'],
  ['Roadmap принятия решения', 'дублирует 30-дневный план, roadmap фаз и условия запуска'],
  ['Roadmap роста', 'повторяет стадии финмодели и roadmap фаз'],
  ['Что нужно строить', 'повторяет executive summary, “Что такое AURA” и Scope продукта']
];

const removedDuplicateTitles = new Set(removedAsDuplicates.map(([title]) => title));
const slides = allSlides.filter(slide => !removedDuplicateTitles.has(slide.title));

const sources = [
  ['AURA Competitor Economics Report', 'Internal sourcebook created 2026-06-03', 'Astrology, mindfulness, AI companion/avatar revenue proxies, ARPMAU, paid conversion, pricing, CAC, marketing benchmarks and AI generation costs.', 'reports/aura-competitor-economics-report.md'],
  ['Calm', 'Sacra', 'Revenue $300M in 2023; $70/year subscription; 4M+ paying subscribers; 2-7% paid conversion commentary.', 'https://sacra.com/c/calm/'],
  ['Headspace', 'Udonis statistics / public app-store proxy', 'Headspace estimated at roughly $39-40M/year app-store revenue and ~1.7M monthly users; directional public estimate.', 'https://www.blog.udonis.co/statistics/headspace'],
  ['Character.AI', 'Sacra / Character.AI pricing page', '$30M annualized revenue in July 2025; $50M projected end-2025; c.ai+ $9.99/month; 20M MAU early 2024.', 'https://sacra.com/c/character-ai/ and https://character.ai/subscribe'],
  ['Character.AI', 'AI Wiki / public research proxy', 'Revenue grew from roughly $15.2M to $32.2M; user engagement remains high; safety/inference cost risk noted.', 'https://aiwiki.ai/wiki/character_ai'],
  ['Co-Star', 'Adapty / Trend Apps / Axios', '$300k-$500k/month public estimates; 200k+ monthly downloads estimate; $15M Series A and 20M+ downloads reported by Axios.', 'https://adapty.io/paywall-library/co-star-personalized-astrology/ and https://trendapps.dev/app/ios/1264782561/ and https://www.axios.com/2021/04/14/astrology-app-co-star-raises-15-million-funding'],
  ['Replika', 'Rev.now Android estimate', '$2.36M/month Play Store estimate; $28.35M/year; 99K paying users estimate; ~$17.23/month proxy.', 'https://rev.now/app/android/replika-my-ai-friend-ux7ec/'],
  ['Replika pricing', 'CompanionWise pricing guide', 'Replika Pro price ranges and paid features: voice/video/AR/avatar customization/memory.', 'https://companionwise.com/faqs/replika-pricing/'],
  ['Finch', 'Rev.now / SensorTower snippet / ScreensDesign', '$1.5-2.0M/month public estimates; Finch Plus monthly price around $9.99.', 'https://rev.now/app/ios/finch-self-care-pet-95748/ and https://app.sensortower.com/overview/1528595748 and https://screensdesign.com/showcase/finch-self-care-pet'],
  ['Nebula', 'Rev.now iOS/Android estimates', '$718k/month App Store estimate; $125.9k/month Play Store estimate; iOS estimate includes 52K paying users; IAP tiers include $7.99 weekly, $9.99 monthly, $24.99 monthly / $29.99 three-month signals.', 'https://rev.now/app/ios/nebula-spiritual-guidance-69523/ and https://rev.now/app/android/nebula-spiritual-guidance-4a0ag/'],
  ['CHANI', 'Rev.now / Appark / Statista snippets', 'CHANI appears as top-grossing astrology/wellness app in public rankings; estimates range around $674K-$832K/month.', 'https://rev.now/best/astrology-apps/ and https://appark.ai/en/blog/market-insights-best-astrology-app-2026-growth-analysis and https://www.statista.com/statistics/1451664/top-horoscope-apps-us-market-revenue/'],
  ['The Pattern', 'Adapty paywall library', 'Last-month estimates around 90K downloads and $400K revenue; paywall reference.', 'https://adapty.io/paywall-library/the-pattern/'],
  ['OpenAI pricing', 'OpenAI official pricing', 'GPT Image pricing is token-based; pricing calculator and token rates used as source for image-cost assumptions.', 'https://openai.com/api/pricing/'],
  ['Veo pricing', 'Google Vertex AI pricing / public reporting', 'Veo-class video remains materially more expensive than Runway Gen-4 Turbo and is treated as premium/high-cost option.', 'https://cloud.google.com/vertex-ai/generative-ai/pricing and https://www.gadgets360.com/ai/news/google-veo-2-video-generation-ai-model-pricing-vertex-ai-platform-7783807/amp'],
  ['Runway API pricing', 'Runway developer docs', 'Credits cost $0.01; Gen-4 Turbo is 5 credits/sec; an 8s clip is about 40 credits / $0.40; gen4_image_turbo is 2 credits per image.', 'https://docs.dev.runwayml.com/guides/pricing/'],
  ['Replicate Wan 2.1 pricing', 'Replicate model page', 'Wan 2.1 720p price around $0.24 per output second.', 'https://replicate.com/wavespeedai/wan-2.1-t2v-720p/api'],
  ['Luma pricing', 'APIs.io / Luma pricing profile', 'Ray-2 public API pricing proxy around $0.08/second; official Luma page uses credits/plans and should be rechecked before build.', 'https://plans.apis.io/plans/luma-ai/luma-ai-plans-pricing/ and https://lumalabs.ai/pricing'],
  ['HeyGen API pricing', 'HeyGen help/API docs', 'API pay-as-you-go: standard avatar video around $1/min, Avatar IV $3-$4/min depending avatar type and resolution.', 'https://help.heygen.com/en/articles/10060327-heygen-api-pricing-explained'],
  ['D-ID API pricing', 'D-ID official pricing page', 'Build plan at $14.4/month annual with up to 16 min offline video; trial includes 3 min video.', 'https://www.d-id.com/pricing/api?from=studio_settings'],
];

function esc(s) {
  return String(s).replace(/`/g, '\\`').replace(/\$/g, '\\$').replace(/\n/g, '\\n');
}

function writePlan() {
  const lines = ['# AURA Trendvi-Style Product Deck V6', '', 'Deck mode: optimized client-facing AURA product deck. V6 keeps the evidence base, but removes repeated meta, finance-bridge and roadmap slides so each slide has one job.', ''];
  lines.push('## Dedupe pass');
  lines.push('');
  removedAsDuplicates.forEach(([title, reason]) => {
    lines.push(`- Removed: ${title} — ${reason}.`);
  });
  lines.push('');
  slides.forEach((slide, i) => {
    lines.push(`## ${String(i + 1).padStart(2, '0')}. ${slide.title}`);
    lines.push('');
    lines.push(`Type: ${slide.type}`);
    lines.push('');
  });
  fs.mkdirSync(path.dirname(PLAN_OUT), { recursive: true });
  fs.writeFileSync(PLAN_OUT, `${lines.join('\n').trimEnd()}\n`);

  const src = ['# AURA Trendvi-Style Deck Sources', '', '| Topic | Source | What is used | URL |', '| --- | --- | --- | --- |'];
  for (const row of sources) src.push(`| ${row.map(v => String(v).replace(/\|/g, '/')).join(' | ')} |`);
  fs.writeFileSync(SOURCE_NOTES, `${src.join('\n').trimEnd()}\n`);
}

function sharedModule() {
  return `
const C = {
  purple: '#9B85E4',
  purpleDark: '#7B61D1',
  purpleLight: '#F0ECFF',
  green: '#98C484',
  greenLight: '#DCEFD4',
  grey: '#E8E8E8',
  line: '#4D5563',
  ink: '#111111',
  muted: '#555555',
  white: '#FFFFFF'
};

export function bg(slide, ctx) {
  ctx.addShape(slide, { left: 0, top: 0, width: ctx.W, height: ctx.H, fill: C.white, line: { style: 'solid', fill: C.white, width: 0 } });
}

export function mark(slide, ctx, x = 48, y = 30, size = 58) {
  ctx.addShape(slide, { left: x, top: y, width: size, height: size, fill: C.purpleLight, line: { style: 'solid', fill: C.purpleLight, width: 0 } });
  ctx.addShape(slide, { left: x + 17, top: y + 10, width: size - 34, height: size - 20, fill: C.purple, line: { style: 'solid', fill: C.purple, width: 0 } });
  ctx.addText(slide, { text: 'A', left: x + 19, top: y + 17, width: size - 38, height: size - 34, fontSize: 25, bold: true, fontFace: 'Montserrat', color: C.white, align: 'center' });
}

export function title(slide, ctx, text) {
  mark(slide, ctx, 48, 22, 58);
  ctx.addText(slide, { text, left: 128, top: 34, width: 990, height: 44, fontSize: 34, bold: true, fontFace: 'Montserrat', color: C.purple, fit: 'shrink' });
  ctx.addShape(slide, { left: 50, top: 94, width: 1080, height: 1.5, fill: C.purpleLight, line: { style: 'solid', fill: C.purpleLight, width: 0 } });
}

export function footer(slide, ctx, n) {
  ctx.addText(slide, { text: String(n).padStart(2, '0'), left: 1130, top: 655, width: 50, height: 20, fontSize: 14, fontFace: 'Arial', color: C.ink, align: 'right' });
}

export function para(slide, ctx, label, text, x, y, w, h = 46) {
  ctx.addText(slide, { text: label + ' —', left: x, top: y, width: 185, height: 24, fontSize: 17, bold: true, fontFace: 'Arial', color: C.ink, fit: 'shrink' });
  ctx.addText(slide, { text, left: x + 205, top: y, width: w - 205, height: h, fontSize: 17, fontFace: 'Arial', color: C.ink, fit: 'shrink' });
}

export function bullet(slide, ctx, text, x, y, w, size = 18) {
  ctx.addText(slide, { text: '•', left: x, top: y - 2, width: 24, height: 22, fontSize: size + 6, fontFace: 'Arial', color: C.ink });
  ctx.addText(slide, { text, left: x + 38, top: y, width: w - 38, height: 46, fontSize: size, fontFace: 'Arial', color: C.ink, fit: 'shrink' });
}

export function cell(slide, ctx, text, x, y, w, h, fill = C.white, bold = false, size = 15, color = C.ink) {
  ctx.addShape(slide, { left: x, top: y, width: w, height: h, fill, line: { style: 'solid', fill: C.line, width: 1 } });
  ctx.addText(slide, { text, left: x + 8, top: y + 7, width: w - 16, height: h - 12, fontSize: size, bold, fontFace: 'Arial', color, fit: 'shrink' });
}

export function metricBar(slide, ctx, text, color = C.purpleLight) {
  ctx.addShape(slide, { left: 54, top: 102, width: 1070, height: 24, fill: color, line: { style: 'solid', fill: C.line, width: 0.7 } });
  ctx.addText(slide, { text, left: 72, top: 108, width: 1034, height: 12, fontSize: 11.2, bold: true, fontFace: 'Arial', color: C.ink, align: 'center', fit: 'shrink' });
}

export function pill(slide, ctx, text, x, y, w, h = 62, fill = C.purpleLight, line = C.line, size = 18) {
  ctx.addShape(slide, { geometry: 'ellipse', left: x, top: y, width: w, height: h, fill, line: { style: 'solid', fill: line, width: 1.4 } });
  ctx.addText(slide, { text, left: x + 8, top: y + h / 2 - 14, width: w - 16, height: 30, fontSize: size, fontFace: 'Arial', bold: true, color: C.ink, align: 'center', fit: 'shrink' });
}

export function source(slide, ctx, text) {
  ctx.addText(slide, { text, left: 54, top: 662, width: 880, height: 16, fontSize: 9, fontFace: 'Arial', color: '#777777' });
}

export { C };
`;
}

function moduleFor(slide, n) {
  return `import { bg, title, footer, para, bullet, cell, pill, source, metricBar, C } from './_shared.mjs';

export async function slide${String(n).padStart(2, '0')}(presentation, ctx) {
  const slide = presentation.slides.add();
  bg(slide, ctx);
  ${bodyFor(slide, n)}
  footer(slide, ctx, ${n});
  return slide;
}
`;
}

function bodyFor(slide, n) {
  if (slide.type === 'cover') {
    return `
  ctx.addShape(slide, { left: 470, top: 245, width: 130, height: 130, fill: C.purple, line: { style: 'solid', fill: C.purple, width: 0 } });
  ctx.addText(slide, { text: 'A', left: 492, top: 268, width: 86, height: 86, fontSize: 76, bold: true, fontFace: 'Montserrat', color: C.white, align: 'center' });
  ctx.addText(slide, { text: 'AURA', left: 620, top: 282, width: 320, height: 68, fontSize: 58, bold: true, fontFace: 'Montserrat', color: C.purple });
  ctx.addText(slide, { text: 'Продуктовая презентация для обсуждения запуска', left: 390, top: 382, width: 650, height: 34, fontSize: 24, fontFace: 'Arial', color: C.muted, align: 'center' });
`;
  }

  if (slide.type === 'executiveOnePage') {
    return `
  title(slide, ctx, '${esc(slide.title)}');
  ctx.addShape(slide, { left: 64, top: 124, width: 1056, height: 110, fill: C.purple, line: { style: 'solid', fill: C.purple, width: 0 } });
  ctx.addText(slide, { text: '${esc(slide.thesis)}', left: 92, top: 146, width: 1000, height: 66, fontSize: 20, bold: true, fontFace: 'Arial', color: C.white, align: 'center', fit: 'shrink' });
  ${slide.cards.map((c, i) => {
    const x = 78 + (i % 2) * 545;
    const y = 260 + Math.floor(i / 2) * 145;
    return `
  ctx.addShape(slide, { left: ${x}, top: ${y}, width: 492, height: 112, fill: ${i === 3 ? 'C.greenLight' : 'C.purpleLight'}, line: { style: 'solid', fill: C.line, width: 1 } });
  ctx.addText(slide, { text: '${esc(c[0])}', left: ${x + 22}, top: ${y + 18}, width: 170, height: 28, fontSize: 22, bold: true, fontFace: 'Arial', color: C.purpleDark, fit: 'shrink' });
  ctx.addText(slide, { text: '${esc(c[1])}', left: ${x + 205}, top: ${y + 18}, width: 262, height: 58, fontSize: 18, fontFace: 'Arial', color: C.ink, fit: 'shrink' });`;
  }).join('\n')}
  ctx.addShape(slide, { left: 178, top: 574, width: 828, height: 46, fill: C.white, line: { style: 'solid', fill: C.purple, width: 1.5 } });
  ctx.addText(slide, { text: '${esc(slide.decision)}', left: 195, top: 586, width: 794, height: 22, fontSize: 19, bold: true, fontFace: 'Arial', color: C.ink, align: 'center', fit: 'shrink' });
`;
  }

  if (slide.type === 'clarityMap') {
    return `
  title(slide, ctx, '${esc(slide.title)}');
  ctx.addText(slide, { text: '${esc(slide.question)}', left: 110, top: 132, width: 960, height: 42, fontSize: 22, bold: true, fontFace: 'Arial', color: C.ink, align: 'center', fit: 'shrink' });
  ctx.addShape(slide, { left: 112, top: 342, width: 960, height: 3, fill: C.purple, line: { style: 'solid', fill: C.purple, width: 0 } });
  ${slide.lanes.map((l, i) => `
  ctx.addShape(slide, { geometry: 'ellipse', left: ${120 + i * 250}, top: 245, width: 116, height: 116, fill: ${i === 2 ? 'C.greenLight' : 'C.purpleLight'}, line: { style: 'solid', fill: C.line, width: 1.1 } });
  ctx.addText(slide, { text: '${esc(l[0])}', left: ${150 + i * 250}, top: 275, width: 56, height: 28, fontSize: 24, bold: true, fontFace: 'Montserrat', color: C.purpleDark, align: 'center' });
  ctx.addText(slide, { text: '${esc(l[1])}', left: ${82 + i * 250}, top: 394, width: 196, height: 30, fontSize: 22, bold: true, fontFace: 'Arial', color: C.ink, align: 'center', fit: 'shrink' });
  ctx.addText(slide, { text: '${esc(l[2])}', left: ${70 + i * 250}, top: 435, width: 220, height: 58, fontSize: 17, fontFace: 'Arial', color: C.ink, align: 'center', fit: 'shrink' });`).join('\n')}
  ctx.addShape(slide, { left: 210, top: 565, width: 760, height: 48, fill: C.purpleLight, line: { style: 'solid', fill: C.line, width: 1 } });
  ctx.addText(slide, { text: 'Принцип: сначала смысл и решение, потом доказательства, таблицы и условия go/no-go.', left: 230, top: 578, width: 720, height: 22, fontSize: 19, bold: true, fontFace: 'Arial', color: C.ink, align: 'center', fit: 'shrink' });
`;
  }

  if (slide.type === 'metricCompass') {
    return `
  title(slide, ctx, '${esc(slide.title)}');
  ctx.addText(slide, { text: 'На каждом финансовом или рыночном слайде важна не сама таблица, а показатель, который меняет решение.', left: 112, top: 124, width: 960, height: 42, fontSize: 22, bold: true, fontFace: 'Arial', color: C.ink, align: 'center', fit: 'shrink' });
  ${slide.groups.map((g, i) => {
    const x = 76 + (i % 2) * 550;
    const y = 200 + Math.floor(i / 2) * 190;
    const fill = i === 2 ? 'C.greenLight' : 'C.purpleLight';
    return `
  ctx.addShape(slide, { left: ${x}, top: ${y}, width: 488, height: 142, fill: ${fill}, line: { style: 'solid', fill: C.line, width: 1.1 } });
  ctx.addText(slide, { text: '${esc(g[0])}', left: ${x + 22}, top: ${y + 16}, width: 170, height: 28, fontSize: 24, bold: true, fontFace: 'Montserrat', color: C.purpleDark, fit: 'shrink' });
  ctx.addText(slide, { text: '${esc(g[1])}\\n${esc(g[2])}\\n${esc(g[3])}', left: ${x + 218}, top: ${y + 18}, width: 210, height: 72, fontSize: 18, bold: true, fontFace: 'Arial', color: C.ink, fit: 'shrink' });
  ctx.addText(slide, { text: '${esc(g[4])}', left: ${x + 22}, top: ${y + 98}, width: 430, height: 24, fontSize: 17, fontFace: 'Arial', color: C.ink, align: 'center', fit: 'shrink' });`;
  }).join('\n')}
  ctx.addShape(slide, { left: 190, top: 590, width: 800, height: 44, fill: C.white, line: { style: 'solid', fill: C.purple, width: 1.3 } });
  ctx.addText(slide, { text: '${esc(slide.rule)}', left: 215, top: 602, width: 750, height: 20, fontSize: 18, bold: true, fontFace: 'Arial', color: C.ink, align: 'center', fit: 'shrink' });
`;
  }

  if (slide.type === 'decisionLegend') {
    return `
  title(slide, ctx, '${esc(slide.title)}');
  ctx.addText(slide, { text: 'Чтобы презентация читалась быстрее, каждый визуальный тип имеет свой смысл: возможность, решение, доказательство или gate.', left: 100, top: 122, width: 980, height: 44, fontSize: 22, bold: true, fontFace: 'Arial', color: C.ink, align: 'center', fit: 'shrink' });
  ${slide.items.map((it, i) => {
    const x = 84 + (i % 2) * 540;
    const y = 210 + Math.floor(i / 2) * 170;
    const fills = ['C.purpleLight', 'C.greenLight', 'C.grey', 'C.white'];
    const line = i === 3 ? 'C.purple' : 'C.line';
    return `
  ctx.addShape(slide, { left: ${x}, top: ${y}, width: 465, height: 118, fill: ${fills[i]}, line: { style: 'solid', fill: ${line}, width: ${i === 3 ? 2 : 1} } });
  ctx.addShape(slide, { left: ${x + 22}, top: ${y + 26}, width: 74, height: 48, fill: ${fills[i]}, line: { style: 'solid', fill: ${line}, width: ${i === 3 ? 2 : 1} } });
  ctx.addText(slide, { text: '${esc(it[0])}', left: ${x + 116}, top: ${y + 18}, width: 160, height: 24, fontSize: 20, bold: true, fontFace: 'Arial', color: C.purpleDark, fit: 'shrink' });
  ctx.addText(slide, { text: '${esc(it[1])}', left: ${x + 116}, top: ${y + 48}, width: 300, height: 24, fontSize: 17, bold: true, fontFace: 'Arial', color: C.ink, fit: 'shrink' });
  ctx.addText(slide, { text: '${esc(it[2])}', left: ${x + 116}, top: ${y + 78}, width: 320, height: 22, fontSize: 14.5, fontFace: 'Arial', color: C.ink, fit: 'shrink' });`;
  }).join('\n')}
  ctx.addText(slide, { text: '${esc(slide.note)}', left: 150, top: 585, width: 880, height: 34, fontSize: 20, bold: true, fontFace: 'Arial', color: C.ink, align: 'center', fit: 'shrink' });
`;
  }

  if (slide.type === 'metricScorecard') {
    return `
  title(slide, ctx, '${esc(slide.title)}');
  ctx.addText(slide, { text: 'Это не KPI “на вырост”, а gates для решения: продолжаем, режем scope или останавливаем.', left: 120, top: 118, width: 940, height: 34, fontSize: 21, bold: true, fontFace: 'Arial', color: C.ink, align: 'center', fit: 'shrink' });
  ${table(slide.rows, [210, 170, 220, 460], 70, 170, 56)}
  ctx.addShape(slide, { left: 115, top: 620, width: 950, height: 34, fill: C.greenLight, line: { style: 'solid', fill: C.line, width: 1 } });
  ctx.addText(slide, { text: '${esc(slide.note)}', left: 135, top: 628, width: 910, height: 16, fontSize: 15, bold: true, fontFace: 'Arial', color: C.ink, align: 'center', fit: 'shrink' });
`;
  }

  if (slide.type === 'metricGlossaryRu') {
    return `
  title(slide, ctx, '${esc(slide.title)}');
  ctx.addText(slide, { text: 'Этот слайд нужен, чтобы Алина и клиент читали финмодель без финансового жаргона.', left: 112, top: 116, width: 960, height: 30, fontSize: 20, bold: true, fontFace: 'Arial', color: C.ink, align: 'center', fit: 'shrink' });
  ${table(slide.rows, [190, 400, 480], 54, 162, 55)}
  ctx.addShape(slide, { left: 100, top: 620, width: 980, height: 42, fill: C.greenLight, line: { style: 'solid', fill: C.line, width: 1 } });
  ctx.addText(slide, { text: '${esc(slide.note)}', left: 120, top: 629, width: 940, height: 24, fontSize: 12.2, bold: true, fontFace: 'Arial', color: C.ink, align: 'center', fit: 'shrink' });
`;
  }

  if (slide.type === 'overview') {
    return `
  title(slide, ctx, '${esc(slide.title)}');
  ${slide.blocks.map((b, i) => `para(slide, ctx, '${esc(b[0])}', '${esc(b[1])}', 52, ${182 + i * 71}, 1068, 58);`).join('\n  ')}
`;
  }

  if (slide.type === 'leaderGrid') {
    return `
  title(slide, ctx, '${esc(slide.title)}');
  ${slide.leaders.map((l, i) => {
    const x = 70 + (i % 2) * 545;
    const y = 150 + Math.floor(i / 2) * 205;
    return `
  ctx.addShape(slide, { left: ${x}, top: ${y}, width: 485, height: 165, fill: ${i === 3 ? 'C.greenLight' : 'C.purpleLight'}, line: { style: 'solid', fill: C.line, width: 1.1 } });
  ctx.addText(slide, { text: '${esc(l[0])}', left: ${x + 22}, top: ${y + 18}, width: 220, height: 28, fontSize: 23, bold: true, fontFace: 'Arial', color: C.ink, fit: 'shrink' });
  ctx.addText(slide, { text: '${esc(l[1])}', left: ${x + 265}, top: ${y + 20}, width: 190, height: 24, fontSize: 17, bold: true, fontFace: 'Arial', color: C.purpleDark, align: 'right', fit: 'shrink' });
  ctx.addText(slide, { text: '${esc(l[2])}', left: ${x + 24}, top: ${y + 66}, width: 440, height: 42, fontSize: 16, fontFace: 'Arial', color: C.ink, fit: 'shrink' });
  ctx.addText(slide, { text: '${esc(l[3])}', left: ${x + 24}, top: ${y + 120}, width: 440, height: 24, fontSize: 18, bold: true, fontFace: 'Arial', color: C.ink, fit: 'shrink' });`;
  }).join('\n')}
  ctx.addText(slide, { text: '${esc(slide.note)}', left: 150, top: 610, width: 850, height: 34, fontSize: 20, bold: true, fontFace: 'Arial', color: C.ink, align: 'center', fit: 'shrink' });
`;
  }

  if (slide.type === 'intersectionThesis') {
    return `
  title(slide, ctx, '${esc(slide.title)}');
  ${slide.pieces.slice(0, 4).map((p, i) => {
    const x = i < 2 ? 105 + i * 290 : 105 + (i - 2) * 290;
    const y = i < 2 ? 185 : 405;
    return `
  pill(slide, ctx, '${esc(p[0])}', ${x}, ${y}, 220, 78, ${i === 3 ? 'C.greenLight' : 'C.purpleLight'}, C.line, 19);
  ctx.addText(slide, { text: '${esc(p[1])}', left: ${x}, top: ${y + 92}, width: 220, height: 28, fontSize: 16, fontFace: 'Arial', color: C.ink, align: 'center', fit: 'shrink' });`;
  }).join('\n')}
  ctx.addShape(slide, { left: 720, top: 205, width: 300, height: 250, fill: C.purple, line: { style: 'solid', fill: C.line, width: 1.2 } });
  ctx.addText(slide, { text: '${esc(slide.pieces[4][0])}', left: 740, top: 252, width: 260, height: 52, fontSize: 46, bold: true, fontFace: 'Montserrat', color: C.white, align: 'center' });
  ctx.addText(slide, { text: '${esc(slide.pieces[4][1])}', left: 758, top: 330, width: 224, height: 46, fontSize: 23, bold: true, fontFace: 'Arial', color: C.white, align: 'center', fit: 'shrink' });
  ctx.addText(slide, { text: '${esc(slide.note)}', left: 145, top: 590, width: 880, height: 42, fontSize: 21, bold: true, fontFace: 'Arial', color: C.ink, align: 'center', fit: 'shrink' });
`;
  }

  if (slide.type === 'solution') {
    return `
  title(slide, ctx, '${esc(slide.title)}');
  ctx.addText(slide, { text: '${esc(slide.leftTitle)}', left: 70, top: 180, width: 450, height: 34, fontSize: 24, bold: true, fontFace: 'Arial', color: C.ink });
  ${slide.left.map((t, i) => `bullet(slide, ctx, '${esc(t)}', 70, ${240 + i * 58}, 470, 18);`).join('\n  ')}
  ctx.addText(slide, { text: '${esc(slide.rightTitle)}', left: 670, top: 180, width: 430, height: 34, fontSize: 24, bold: true, fontFace: 'Arial', color: C.ink });
  ${slide.right.map((t, i) => `bullet(slide, ctx, '${esc(t)}', 670, ${240 + i * 48}, 450, 17);`).join('\n  ')}
  ctx.addShape(slide, { left: 575, top: 175, width: 2, height: 360, fill: C.purple, line: { style: 'solid', fill: C.purple, width: 0 } });
`;
  }

  if (slide.type === 'dayJourney') {
    return `
  title(slide, ctx, '${esc(slide.title)}');
  ctx.addShape(slide, { left: 92, top: 330, width: 960, height: 3, fill: C.purple, line: { style: 'solid', fill: C.purple, width: 0 } });
  ${slide.stages.map((s, i) => `
  ctx.addShape(slide, { geometry: 'ellipse', left: ${84 + i * 300}, top: 280, width: 112, height: 112, fill: ${i === 1 ? 'C.purple' : i === 3 ? 'C.greenLight' : 'C.purpleLight'}, line: { style: 'solid', fill: C.line, width: 1.2 } });
  ctx.addText(slide, { text: '${esc(s[0])}', left: ${96 + i * 300}, top: 318, width: 88, height: 25, fontSize: 20, bold: true, fontFace: 'Arial', color: ${i === 1 ? 'C.white' : 'C.ink'}, align: 'center', fit: 'shrink' });
  ctx.addText(slide, { text: '${esc(s[1])}', left: ${40 + i * 300}, top: 430, width: 200, height: 26, fontSize: 21, bold: true, fontFace: 'Arial', color: C.ink, align: 'center', fit: 'shrink' });
  ctx.addText(slide, { text: '${esc(s[2])}', left: ${35 + i * 300}, top: 468, width: 210, height: 85, fontSize: 16, fontFace: 'Arial', color: C.ink, align: 'center', fit: 'shrink' });`).join('\n')}
  ctx.addText(slide, { text: '${esc(slide.note)}', left: 142, top: 600, width: 860, height: 34, fontSize: 20, bold: true, fontFace: 'Arial', color: C.ink, align: 'center', fit: 'shrink' });
`;
  }

  if (slide.type === 'appScreens') {
    return `
  title(slide, ctx, '${esc(slide.title)}');
  ${slide.screens.map((s, i) => {
    const x = 58 + (i % 6) * 185;
    const y = 165;
    return `
  ctx.addShape(slide, { left: ${x}, top: ${y}, width: 138, height: 330, fill: C.white, line: { style: 'solid', fill: C.line, width: 1.3 } });
  ctx.addShape(slide, { left: ${x + 11}, top: ${y + 14}, width: 116, height: 45, fill: C.purpleLight, line: { style: 'solid', fill: C.purpleLight, width: 0 } });
  ctx.addText(slide, { text: '${esc(s[0])}', left: ${x + 20}, top: ${y + 24}, width: 34, height: 20, fontSize: 16, bold: true, fontFace: 'Arial', color: C.purpleDark, align: 'center' });
  ctx.addText(slide, { text: '${esc(s[1])}', left: ${x + 48}, top: ${y + 23}, width: 72, height: 22, fontSize: 12, bold: true, fontFace: 'Arial', color: C.ink, fit: 'shrink' });
  ctx.addShape(slide, { geometry: 'ellipse', left: ${x + 43}, top: ${y + 86}, width: 52, height: 52, fill: ${i === 4 ? 'C.greenLight' : 'C.purpleLight'}, line: { style: 'solid', fill: C.line, width: 0.8 } });
  ctx.addText(slide, { text: '${esc(s[2])}', left: ${x + 16}, top: ${y + 166}, width: 106, height: 82, fontSize: 12, fontFace: 'Arial', color: C.ink, align: 'center', fit: 'shrink' });
  ctx.addShape(slide, { left: ${x + 24}, top: ${y + 274}, width: 90, height: 24, fill: ${i === 5 ? 'C.greenLight' : 'C.purpleLight'}, line: { style: 'solid', fill: C.line, width: 0.6 } });
  ctx.addText(slide, { text: '${i === 5 ? 'выбрать' : 'дальше'}', left: ${x + 28}, top: ${y + 279}, width: 82, height: 12, fontSize: 10, bold: true, fontFace: 'Arial', color: C.ink, align: 'center', fit: 'shrink' });`;
  }).join('\n')}
  ctx.addText(slide, { text: '${esc(slide.note)}', left: 174, top: 570, width: 820, height: 34, fontSize: 20, bold: true, fontFace: 'Arial', color: C.ink, align: 'center', fit: 'shrink' });
`;
  }

  if (slide.type === 'lifeCanvasDemo') {
    return `
  title(slide, ctx, '${esc(slide.title)}');
  ctx.addText(slide, { text: '${esc(slide.leftLabel)}', left: 160, top: 166, width: 260, height: 30, fontSize: 23, bold: true, fontFace: 'Arial', color: C.ink, align: 'center' });
  ctx.addText(slide, { text: '${esc(slide.rightLabel)}', left: 650, top: 166, width: 260, height: 30, fontSize: 23, bold: true, fontFace: 'Arial', color: C.ink, align: 'center' });
  ctx.addShape(slide, { left: 112, top: 210, width: 360, height: 250, fill: C.purpleLight, line: { style: 'solid', fill: C.line, width: 1.2 } });
  ctx.addShape(slide, { geometry: 'ellipse', left: 165, top: 260, width: 120, height: 120, fill: '#D8D5E6', line: { style: 'solid', fill: '#D8D5E6', width: 0 } });
  ctx.addShape(slide, { geometry: 'ellipse', left: 262, top: 235, width: 145, height: 145, fill: '#C4B7F5', line: { style: 'solid', fill: '#C4B7F5', width: 0 } });
  ctx.addText(slide, { text: 'туман / давление\\nнеясная неделя', left: 158, top: 405, width: 270, height: 42, fontSize: 20, bold: true, fontFace: 'Arial', color: C.ink, align: 'center', fit: 'shrink' });
  ctx.addShape(slide, { left: 605, top: 210, width: 360, height: 250, fill: '#F4FFF0', line: { style: 'solid', fill: C.line, width: 1.2 } });
  ctx.addShape(slide, { geometry: 'ellipse', left: 668, top: 258, width: 120, height: 120, fill: C.greenLight, line: { style: 'solid', fill: C.greenLight, width: 0 } });
  ctx.addShape(slide, { left: 780, top: 268, width: 125, height: 28, fill: C.purple, line: { style: 'solid', fill: C.purple, width: 0 } });
  ctx.addShape(slide, { left: 780, top: 318, width: 90, height: 28, fill: C.purpleDark, line: { style: 'solid', fill: C.purpleDark, width: 0 } });
  ctx.addText(slide, { text: 'ясный маршрут\\nсобранное состояние', left: 650, top: 405, width: 270, height: 42, fontSize: 20, bold: true, fontFace: 'Arial', color: C.ink, align: 'center', fit: 'shrink' });
  ctx.addText(slide, { text: '→', left: 512, top: 300, width: 50, height: 44, fontSize: 40, bold: true, fontFace: 'Arial', color: C.purple, align: 'center' });
  ctx.addShape(slide, { left: 180, top: 498, width: 790, height: 56, fill: C.purpleLight, line: { style: 'solid', fill: C.line, width: 1 } });
  ctx.addText(slide, { text: '${esc(slide.cause)}', left: 200, top: 510, width: 750, height: 30, fontSize: 18, bold: true, fontFace: 'Arial', color: C.ink, align: 'center', fit: 'shrink' });
  ctx.addText(slide, { text: '${esc(slide.rule)}', left: 145, top: 596, width: 860, height: 34, fontSize: 18, italic: true, fontFace: 'Arial', color: C.ink, align: 'center', fit: 'shrink' });
`;
  }

  if (slide.type === 'premiumMoment') {
    return `
  title(slide, ctx, '${esc(slide.title)}');
  ctx.addShape(slide, { left: 80, top: 160, width: 590, height: 360, fill: '#121022', line: { style: 'solid', fill: C.line, width: 1.2 } });
  ctx.addShape(slide, { geometry: 'ellipse', left: 250, top: 230, width: 210, height: 210, fill: C.purple, line: { style: 'solid', fill: C.purple, width: 0 } });
  ctx.addText(slide, { text: 'WEEK\\nTRAILER', left: 270, top: 287, width: 170, height: 86, fontSize: 34, bold: true, fontFace: 'Montserrat', color: C.white, align: 'center', fit: 'shrink' });
  ctx.addText(slide, { text: 'Premium video moment', left: 210, top: 462, width: 250, height: 30, fontSize: 22, bold: true, fontFace: 'Arial', color: C.white, align: 'center' });
  ctx.addText(slide, { text: '${esc(slide.claim)}', left: 750, top: 170, width: 330, height: 78, fontSize: 25, bold: true, fontFace: 'Arial', color: C.ink, fit: 'shrink' });
  ${slide.economics.map((r, i) => `
  cell(slide, ctx, '${esc(r[0])}', 740, ${285 + i * 50}, 170, 48, ${i === 3 ? 'C.greenLight' : 'C.white'}, true, 15);
  cell(slide, ctx, '${esc(r[1])}', 910, ${285 + i * 50}, 210, 48, ${i === 3 ? 'C.greenLight' : 'C.white'}, false, 15);`).join('\n')}
  ctx.addText(slide, { text: '${esc(slide.note)}', left: 140, top: 580, width: 940, height: 44, fontSize: 20, bold: true, fontFace: 'Arial', color: C.ink, align: 'center', fit: 'shrink' });
`;
  }

  if (slide.type === 'paywallArchitecture') {
    return `
  title(slide, ctx, '${esc(slide.title)}');
  ${slide.tiers.map((t, i) => {
    const x = 72 + i * 275;
    return `
  ctx.addShape(slide, { left: ${x}, top: 170, width: 235, height: 330, fill: ${i === 1 ? 'C.purpleLight' : i === 3 ? 'C.greenLight' : 'C.white'}, line: { style: 'solid', fill: C.line, width: 1.2 } });
  ctx.addText(slide, { text: '${esc(t[0])}', left: ${x + 20}, top: 196, width: 195, height: 30, fontSize: 26, bold: true, fontFace: 'Arial', color: C.purpleDark, align: 'center', fit: 'shrink' });
  ctx.addText(slide, { text: '${esc(t[1])}', left: ${x + 20}, top: 245, width: 195, height: 34, fontSize: 24, bold: true, fontFace: 'Arial', color: C.ink, align: 'center', fit: 'shrink' });
  ctx.addText(slide, { text: '${esc(t[2])}', left: ${x + 24}, top: 314, width: 187, height: 92, fontSize: 17, fontFace: 'Arial', color: C.ink, align: 'center', fit: 'shrink' });
  ctx.addShape(slide, { left: ${x + 45}, top: 438, width: 145, height: 34, fill: C.purpleLight, line: { style: 'solid', fill: C.line, width: 0.8 } });
  ctx.addText(slide, { text: '${esc(t[3])}', left: ${x + 52}, top: 446, width: 132, height: 16, fontSize: 13, bold: true, fontFace: 'Arial', color: C.ink, align: 'center', fit: 'shrink' });`;
  }).join('\n')}
  ctx.addText(slide, { text: '${esc(slide.note)}', left: 170, top: 575, width: 840, height: 40, fontSize: 22, bold: true, fontFace: 'Arial', color: C.ink, align: 'center', fit: 'shrink' });
`;
  }

  if (slide.type === 'marketSize') {
    return `
  title(slide, ctx, '${esc(slide.title)}');
  ${slide.items.slice(0, 3).map((it, i) => `
  pill(slide, ctx, '${it[0]}', 50, ${185 + i * 135}, 105, 105, ${i === 2 ? 'C.purpleLight' : 'C.grey'});
  ctx.addText(slide, { text: '${esc(it[1])}', left: 180, top: ${198 + i * 135}, width: 160, height: 26, fontSize: 20, bold: true, fontFace: 'Arial', color: C.ink });
  ctx.addText(slide, { text: '${esc(it[2])}', left: 180, top: ${230 + i * 135}, width: 430, height: 52, fontSize: 17, fontFace: 'Arial', color: C.ink, fit: 'shrink' });`).join('\n')}
  ${slide.items.slice(3).map((it, i) => `
  pill(slide, ctx, '${it[0]}', 720, ${200 + i * 150}, 120, 100, ${i === 1 ? 'C.purple' : 'C.purpleLight'}, C.line, 18);
  ctx.addText(slide, { text: '${esc(it[1])}', left: 875, top: ${208 + i * 150}, width: 240, height: 28, fontSize: 20, bold: true, fontFace: 'Arial', color: C.ink });
  ctx.addText(slide, { text: '${esc(it[2])}', left: 875, top: ${242 + i * 150}, width: 290, height: 60, fontSize: 17, fontFace: 'Arial', color: C.ink, fit: 'shrink' });`).join('\n')}
  ctx.addText(slide, { text: '${esc(slide.note)}', left: 690, top: 530, width: 430, height: 44, fontSize: 18, bold: true, fontFace: 'Arial', color: C.ink });
`;
  }

  if (slide.type === 'numberLogic') {
    return `
  title(slide, ctx, '${esc(slide.title)}');
  ctx.addShape(slide, { left: 95, top: 330, width: 955, height: 3, fill: C.purple, line: { style: 'solid', fill: C.purple, width: 0 } });
  ${slide.steps.map((s, i) => {
    const x = 58 + i * 292;
    return `
  ctx.addShape(slide, { geometry: 'ellipse', left: ${x + 60}, top: 210, width: 108, height: 108, fill: ${i === 2 ? 'C.purple' : i === 3 ? 'C.greenLight' : 'C.purpleLight'}, line: { style: 'solid', fill: C.line, width: 1.1 } });
  ctx.addText(slide, { text: '${esc(s[0])}', left: ${x + 82}, top: 238, width: 64, height: 44, fontSize: 38, bold: true, fontFace: 'Montserrat', color: ${i === 2 ? 'C.white' : 'C.purpleDark'}, align: 'center' });
  ctx.addText(slide, { text: '${esc(s[1])}', left: ${x}, top: 362, width: 230, height: 44, fontSize: 19, bold: true, fontFace: 'Arial', color: C.ink, align: 'center', fit: 'shrink' });
  ctx.addText(slide, { text: '${esc(s[2])}', left: ${x}, top: 418, width: 230, height: 42, fontSize: 15, fontFace: 'Arial', color: C.muted, align: 'center', fit: 'shrink' });
  ctx.addText(slide, { text: '${esc(s[3])}', left: ${x}, top: 482, width: 230, height: 64, fontSize: 15, bold: true, fontFace: 'Arial', color: C.ink, align: 'center', fit: 'shrink' });`;
  }).join('\n')}
  ctx.addText(slide, { text: '${esc(slide.note)}', left: 145, top: 600, width: 880, height: 36, fontSize: 20, bold: true, fontFace: 'Arial', color: C.ink, align: 'center', fit: 'shrink' });
`;
  }

  if (slide.type === 'bigNumbers') {
    return `
  title(slide, ctx, '${esc(slide.title)}');
  ${slide.numbers.map((n, i) => {
    const x = 74 + (i % 2) * 560;
    const y = 175 + Math.floor(i / 2) * 210;
    return `
  ctx.addShape(slide, { left: ${x}, top: ${y}, width: 485, height: 160, fill: ${i === 2 ? 'C.greenLight' : 'C.purpleLight'}, line: { style: 'solid', fill: C.line, width: 1.1 } });
  ctx.addText(slide, { text: '${esc(n[0])}', left: ${x + 24}, top: ${y + 22}, width: 190, height: 46, fontSize: 34, bold: true, fontFace: 'Montserrat', color: C.purpleDark, fit: 'shrink' });
  ctx.addText(slide, { text: '${esc(n[1])}', left: ${x + 230}, top: ${y + 29}, width: 225, height: 35, fontSize: 22, bold: true, fontFace: 'Arial', color: C.ink, fit: 'shrink' });
  ctx.addText(slide, { text: '${esc(n[2])}', left: ${x + 28}, top: ${y + 88}, width: 430, height: 48, fontSize: 16, fontFace: 'Arial', color: C.ink, fit: 'shrink' });`;
  }).join('\n')}
  ctx.addText(slide, { text: '${esc(slide.note)}', left: 150, top: 615, width: 850, height: 28, fontSize: 19, bold: true, fontFace: 'Arial', color: C.ink, align: 'center', fit: 'shrink' });
`;
  }

  if (slide.type === 'proofMatrix' || slide.type === 'assumptionBridge') {
    const widths = slide.type === 'proofMatrix' ? [205, 315, 285, 270] : [190, 350, 235, 290];
    return `
  title(slide, ctx, '${esc(slide.title)}');
  ${table(slide.rows, widths, 54, 148, slide.type === 'proofMatrix' ? 74 : 68)}
  ctx.addText(slide, { text: '${esc(slide.conclusion || slide.note)}', left: 90, top: 620, width: 1000, height: 30, fontSize: 18, bold: true, fontFace: 'Arial', color: C.ink, align: 'center', fit: 'shrink' });
`;
  }

  if (slide.type === 'generationPackage') {
    return `
  title(slide, ctx, '${esc(slide.title)}');
  ${metricBand(slide)}
  ctx.addShape(slide, { left: 70, top: 145, width: 265, height: 445, fill: C.purpleLight, line: { style: 'solid', fill: C.line, width: 1.1 } });
  ctx.addText(slide, { text: 'VISUAL PLUS', left: 95, top: 174, width: 215, height: 30, fontSize: 25, bold: true, fontFace: 'Montserrat', color: C.purpleDark, align: 'center', fit: 'shrink' });
  ctx.addText(slide, { text: '30 daily cards\\n30 images\\n4 weekly 8s videos\\nmemory + recap', left: 105, top: 245, width: 195, height: 145, fontSize: 22, bold: true, fontFace: 'Arial', color: C.ink, align: 'center', fit: 'shrink' });
  ctx.addText(slide, { text: '~$2.40-$4.05', left: 88, top: 440, width: 230, height: 42, fontSize: 33, bold: true, fontFace: 'Montserrat', color: C.purpleDark, align: 'center', fit: 'shrink' });
  ctx.addText(slide, { text: 'COGS / paid user / month', left: 100, top: 492, width: 205, height: 28, fontSize: 17, bold: true, fontFace: 'Arial', color: C.ink, align: 'center', fit: 'shrink' });
  ${table(slide.rows, [155, 145, 250, 118, 130], 365, 145, 54)}
  ctx.addText(slide, { text: '${esc(slide.note)}', left: 155, top: 628, width: 860, height: 28, fontSize: 18, bold: true, fontFace: 'Arial', color: C.ink, align: 'center', fit: 'shrink' });
`;
  }

  if (slide.type === 'freeUserModel') {
    return `
  title(slide, ctx, '${esc(slide.title)}');
  ${metricBand(slide)}
  ${table(slide.rows, [210, 300, 230, 330], 54, 148, 60)}
  ctx.addShape(slide, { left: 90, top: 594, width: 980, height: 38, fill: C.greenLight, line: { style: 'solid', fill: C.line, width: 1 } });
  ctx.addText(slide, { text: '${esc(slide.note)}', left: 110, top: 604, width: 940, height: 18, fontSize: 14.5, bold: true, fontFace: 'Arial', color: C.ink, align: 'center', fit: 'shrink' });
`;
  }

  if (slide.type === 'marketingModel') {
    return `
  title(slide, ctx, '${esc(slide.title)}');
  ${metricBand(slide)}
  ${table(slide.rows, [190, 190, 190, 190, 310], 54, 150, 56)}
  ctx.addText(slide, { text: '${esc(slide.note)}', left: 150, top: 620, width: 850, height: 30, fontSize: 18, bold: true, fontFace: 'Arial', color: C.ink, align: 'center', fit: 'shrink' });
`;
  }

  if (slide.type === 'money') {
    return `
  title(slide, ctx, '${esc(slide.title)}');
  ${table(slide.rows, [210, 225, 230, 420], 54, 176, 58)}
  ctx.addText(slide, { text: '${esc(slide.conclusion)}', left: 610, top: 535, width: 500, height: 56, fontSize: 20, fontFace: 'Arial', color: C.ink, fit: 'shrink' });
  source(slide, ctx, 'Источники: Sacra, Adapty, Rev.now public estimates. Цифры являются directional public proxies, не private company P&L.');
`;
  }

  if (slide.type === 'segments') {
    return `
  title(slide, ctx, '${esc(slide.title)}');
  ${slide.segments.map((s, i) => `
  cell(slide, ctx, '${esc(s[0])}', 70, ${178 + i * 100}, 285, 76, C.purpleLight, true, 17);
  cell(slide, ctx, '${esc(s[1])}', 355, ${178 + i * 100}, 450, 76, C.white, false, 16);
  cell(slide, ctx, '${esc(s[2])}', 805, ${178 + i * 100}, 300, 76, C.greenLight, true, 16);`).join('\n')}
`;
  }

  if (slide.type === 'why') {
    return `
  title(slide, ctx, '${esc(slide.title)}');
  ${slide.bullets.map((t, i) => `bullet(slide, ctx, '${esc(t)}', 90, ${190 + i * 72}, 660, 20);`).join('\n  ')}
  ctx.addText(slide, { text: 'Вывод', left: 760, top: 210, width: 250, height: 28, fontSize: 24, bold: true, fontFace: 'Arial', color: C.ink });
  ctx.addText(slide, { text: '${esc(slide.conclusion)}', left: 760, top: 255, width: 330, height: 180, fontSize: 22, fontFace: 'Arial', color: C.ink, fit: 'shrink' });
`;
  }

  if (slide.type === 'competitorsMap') {
    return `
  title(slide, ctx, '${esc(slide.title)}');
  ctx.addShape(slide, { left: 520, top: 135, width: 2, height: 470, fill: C.line });
  ctx.addShape(slide, { left: 135, top: 395, width: 820, height: 2, fill: C.line });
  ctx.addText(slide, { text: 'Глубина личного смысла', left: 38, top: 355, width: 130, height: 70, fontSize: 18, bold: true, fontFace: 'Arial', color: C.ink });
  ctx.addText(slide, { text: 'Визуальный / companion experience', left: 760, top: 610, width: 260, height: 24, fontSize: 18, italic: true, fontFace: 'Arial', color: C.ink });
  pill(slide, ctx, 'Calm', 220, 458, 150, 70, C.grey);
  pill(slide, ctx, 'Co-Star', 610, 455, 160, 70, C.purpleLight);
  pill(slide, ctx, 'Replika', 615, 250, 170, 70, C.grey);
  pill(slide, ctx, 'Finch', 360, 310, 145, 70, C.greenLight);
  cell(slide, ctx, 'AURA', 535, 245, 260, 96, C.purpleLight, true, 34, C.purpleDark);
  ctx.addText(slide, { text: 'weekly forecast + assistant + Life Canvas', left: 548, top: 315, width: 234, height: 20, fontSize: 13, fontFace: 'Arial', color: C.ink, align: 'center' });
  ctx.addShape(slide, { left: 865, top: 80, width: 285, height: 155, fill: C.purple, line: { style: 'solid', fill: C.line, width: 1.4 } });
  ctx.addText(slide, { text: '${esc(slide.quote)}', left: 882, top: 100, width: 250, height: 120, fontSize: 18, bold: true, fontFace: 'Arial', color: C.white, fit: 'shrink' });
`;
  }

  if (slide.type === 'compTable' || slide.type === 'pricingTable') {
    const cols = slide.widths || (slide.type === 'compTable' ? [220, 220, 260, 370] : [220, 220, 260, 370]);
    const tableY = slide.tableY || 176;
    const rowH = slide.rowH || 72;
    return `
  title(slide, ctx, '${esc(slide.title)}');
  ${metricBand(slide)}
  ${table(slide.rows, cols, 54, tableY, rowH)}
  ${slide.note ? `ctx.addText(slide, { text: '${esc(slide.note)}', left: 110, top: 620, width: 940, height: 28, fontSize: 17, bold: true, fontFace: 'Arial', color: C.ink, align: 'center', fit: 'shrink' });` : ''}
`;
  }

  if (slide.type === 'pricingNarrative') {
    return `
  title(slide, ctx, '${esc(slide.title)}');
  ${metricBand(slide)}
  ctx.addText(slide, { text: 'AURA is not sold before the first value moment.', left: 78, top: 184, width: 640, height: 38, fontSize: 26, bold: true, fontFace: 'Arial', color: C.ink });
  ${slide.points.map((p, i) => `bullet(slide, ctx, '${esc(p)}', 80, ${250 + i * 72}, 680, 19);`).join('\n  ')}
  pill(slide, ctx, 'Free first loop', 810, 210, 250, 74, C.grey, C.line, 20);
  pill(slide, ctx, 'Plus subscription', 810, 320, 300, 80, C.purpleLight, C.line, 21);
  pill(slide, ctx, 'Premium video / tokens', 810, 445, 330, 86, C.greenLight, C.line, 21);
`;
  }

  if (slide.type === 'finance') {
    return `
  title(slide, ctx, '${esc(slide.title)}');
  ${metricBand(slide)}
  ${table(slide.rows, [240, 260, 260, 260], 70, 180, 50)}
  ctx.addText(slide, { text: '${esc(slide.note)}', left: 112, top: 555, width: 940, height: 40, fontSize: 17, italic: true, fontFace: 'Arial', color: C.ink, align: 'center' });
  source(slide, ctx, 'Assumptions: $10-14 ARPPU, image-first cost control, premium video gated. Нужно пересчитать после prototype telemetry.');
`;
  }

  if (slide.type === 'financialGlossary') {
    return `
  title(slide, ctx, '${esc(slide.title)}');
  ${slide.terms.map((t, i) => {
    const x = i % 2 === 0 ? 80 : 620;
    const y = 122 + Math.floor(i / 2) * 126;
    return `
  ctx.addShape(slide, { left: ${x}, top: ${y}, width: 470, height: 112, fill: ${i === 2 || i === 5 ? 'C.greenLight' : 'C.purpleLight'}, line: { style: 'solid', fill: C.line, width: 1 } });
  ctx.addText(slide, { text: '${esc(t[0])}', left: ${x + 18}, top: ${y + 12}, width: 126, height: 30, fontSize: 20, bold: true, fontFace: 'Montserrat', color: C.purpleDark, fit: 'shrink' });
  ctx.addText(slide, { text: '${esc(t[1])}', left: ${x + 158}, top: ${y + 12}, width: 285, height: 40, fontSize: 15, bold: true, fontFace: 'Arial', color: C.ink, fit: 'shrink' });
  ctx.addText(slide, { text: '${esc(t[2])}', left: ${x + 18}, top: ${y + 62}, width: 425, height: 34, fontSize: 13.5, fontFace: 'Arial', color: C.ink, fit: 'shrink' });`;
  }).join('\n')}
  ctx.addText(slide, { text: '${esc(slide.note)}', left: 110, top: 535, width: 940, height: 70, fontSize: 20, bold: true, fontFace: 'Arial', color: C.ink, align: 'center', fit: 'shrink' });
`;
  }

  if (slide.type === 'financeDashboardV2') {
    return `
  title(slide, ctx, '${esc(slide.title)}');
  ${metricBand(slide)}
  ${slide.tiles.map((t, i) => {
    const x = 62 + (i % 3) * 370;
    const y = 132 + Math.floor(i / 3) * 152;
    const multi = String(t[1]).includes('\n');
    return `
  ctx.addShape(slide, { left: ${x}, top: ${y}, width: 320, height: 116, fill: ${i === 1 || i === 4 ? 'C.greenLight' : 'C.purpleLight'}, line: { style: 'solid', fill: C.line, width: 1 } });
  ctx.addText(slide, { text: '${esc(t[0])}', left: ${x + 18}, top: ${y + 14}, width: 110, height: 22, fontSize: 16, bold: true, fontFace: 'Arial', color: C.purpleDark, fit: 'shrink' });
  ctx.addText(slide, { text: '${esc(t[1])}', left: ${x + 140}, top: ${multi ? y + 7 : y + 12}, width: 150, height: ${multi ? 52 : 32}, fontSize: ${multi ? 18 : 25}, bold: true, fontFace: 'Montserrat', color: C.ink, align: 'right', fit: 'shrink' });
  ctx.addText(slide, { text: '${esc(t[2])}', left: ${x + 18}, top: ${multi ? y + 70 : y + 58}, width: 284, height: ${multi ? 30 : 40}, fontSize: ${multi ? 13.5 : 15}, fontFace: 'Arial', color: C.ink, fit: 'shrink' });`;
  }).join('\n')}
  ctx.addShape(slide, { left: 92, top: 462, width: 1000, height: 3, fill: C.purple, line: { style: 'solid', fill: C.purple, width: 0 } });
  ${slide.flow.map((f, i) => `
  pill(slide, ctx, '${esc(f[0])}', ${98 + i * 250}, 432, 132, 66, ${i === 3 ? 'C.greenLight' : 'C.white'}, C.line, 18);
  ctx.addText(slide, { text: '${esc(f[1])}', left: ${66 + i * 250}, top: 518, width: 196, height: 36, fontSize: 17, fontFace: 'Arial', color: C.ink, align: 'center', fit: 'shrink' });`).join('\n')}
  ctx.addText(slide, { text: '${esc(slide.note)}', left: 150, top: 604, width: 880, height: 32, fontSize: 21, bold: true, fontFace: 'Arial', color: C.ink, align: 'center', fit: 'shrink' });
`;
  }

  if (slide.type === 'costBenchmarks') {
    return `
  title(slide, ctx, '${esc(slide.title)}');
  ${metricBand(slide)}
  ${table(slide.rows, [155, 245, 310, 360], 54, 150, 54)}
  ctx.addText(slide, { text: '${esc(slide.note)}', left: 80, top: 610, width: 990, height: 34, fontSize: 15, italic: true, fontFace: 'Arial', color: C.ink, align: 'center', fit: 'shrink' });
  source(slide, ctx, 'Источники: OpenAI, Google Vertex AI, Runway, Replicate, HeyGen, D-ID, Luma public pricing pages.');
`;
  }

  if (slide.type === 'unitCost') {
    return `
  title(slide, ctx, '${esc(slide.title)}');
  ${metricBand(slide)}
  ${table(slide.rows, [190, 345, 215, 320], 54, 154, 58)}
  ctx.addShape(slide, { left: 72, top: 558, width: 1030, height: 42, fill: C.purpleLight, line: { style: 'solid', fill: C.line, width: 1 } });
  ctx.addText(slide, { text: '${esc(slide.formula)}', left: 88, top: 568, width: 998, height: 22, fontSize: 15, bold: true, fontFace: 'Arial', color: C.ink, fit: 'shrink' });
  ctx.addText(slide, { text: '${esc(slide.conclusion)}', left: 110, top: 615, width: 940, height: 28, fontSize: 18, italic: true, fontFace: 'Arial', color: C.ink, align: 'center', fit: 'shrink' });
`;
  }

  if (slide.type === 'videoStress') {
    return `
  title(slide, ctx, '${esc(slide.title)}');
  ${metricBand(slide)}
  ${table(slide.rows, [265, 155, 170, 180, 300], 54, 158, 58)}
  ctx.addText(slide, { text: '${esc(slide.note)}', left: 120, top: 610, width: 900, height: 34, fontSize: 20, bold: true, fontFace: 'Arial', color: C.ink, align: 'center', fit: 'shrink' });
`;
  }

  if (slide.type === 'competitorEconomics') {
    return `
  title(slide, ctx, '${esc(slide.title)}');
  ${metricBand(slide)}
  ${table(slide.rows, [155, 190, 375, 350], 54, 128, 48)}
  ctx.addText(slide, { text: '${esc(slide.note)}', left: 82, top: 610, width: 990, height: 34, fontSize: 14, italic: true, fontFace: 'Arial', color: C.ink, align: 'center', fit: 'shrink' });
`;
  }

  if (slide.type === 'auraMath') {
    return `
  title(slide, ctx, '${esc(slide.title)}');
  ${metricBand(slide)}
  ${table(slide.rows, [190, 160, 395, 325], 54, 150, 58)}
  ctx.addShape(slide, { left: 140, top: 610, width: 870, height: 42, fill: C.greenLight, line: { style: 'solid', fill: C.line, width: 1 } });
  ctx.addText(slide, { text: '${esc(slide.conclusion)}', left: 160, top: 620, width: 830, height: 22, fontSize: 17, bold: true, fontFace: 'Arial', color: C.ink, align: 'center', fit: 'shrink' });
`;
  }

  if (slide.type === 'gtm') {
    return `
  title(slide, ctx, '${esc(slide.title)}');
  ${metricBand(slide)}
  ${slide.blocks.map((b, i) => `
  ctx.addText(slide, { text: '${esc(b[0])}', left: 78, top: ${180 + i * 98}, width: 350, height: 28, fontSize: 21, bold: true, fontFace: 'Arial', color: C.ink });
  ctx.addText(slide, { text: '${esc(b[1])}', left: 438, top: ${180 + i * 98}, width: 630, height: 60, fontSize: 18, fontFace: 'Arial', color: C.ink, fit: 'shrink' });`).join('\n')}
`;
  }

  if (slide.type === 'roadmap') {
    return `
  title(slide, ctx, '${esc(slide.title)}');
  ${metricBand(slide)}
  ctx.addShape(slide, { left: 88, top: 360, width: 1000, height: 3, fill: C.purple, line: { style: 'solid', fill: C.purple, width: 0 } });
  ${slide.steps.map((s, i) => `
  pill(slide, ctx, '${esc(s[0])}', ${55 + i * 185}, 320, 130, 58, ${i === 2 || i === 5 ? 'C.greenLight' : i === 3 ? 'C.purple' : 'C.grey'}, C.line, 17);
  ctx.addText(slide, { text: '${esc(s[1])}', left: ${45 + i * 185}, top: 402, width: 150, height: 54, fontSize: 16, fontFace: 'Arial', color: C.ink, align: 'center', fit: 'shrink' });`).join('\n')}
  ctx.addText(slide, { text: 'Roadmap остается узким, пока петля не доказана: сначала причинность Canvas, затем удержание, затем платное масштабирование.', left: 178, top: 520, width: 820, height: 42, fontSize: 22, bold: true, fontFace: 'Arial', color: C.ink, align: 'center', fit: 'shrink' });
`;
  }

  if (slide.type === 'decisionRoadmapV2') {
    return `
  title(slide, ctx, '${esc(slide.title)}');
  ${metricBand(slide)}
  ctx.addShape(slide, { left: 80, top: 278, width: 1010, height: 3, fill: C.purple, line: { style: 'solid', fill: C.purple, width: 0 } });
  ${slide.steps.map((s, i) => `
  ctx.addShape(slide, { left: ${55 + i * 220}, top: 160, width: 175, height: 252, fill: ${i === 3 ? 'C.greenLight' : i === 4 ? 'C.purpleLight' : 'C.white'}, line: { style: 'solid', fill: C.line, width: 1 } });
  ctx.addText(slide, { text: '${esc(s[0])}', left: ${72 + i * 220}, top: 178, width: 48, height: 28, fontSize: 24, bold: true, fontFace: 'Montserrat', color: C.purpleDark, align: 'center' });
  ctx.addText(slide, { text: '${esc(s[1])}', left: ${124 + i * 220}, top: 180, width: 90, height: 26, fontSize: 17, bold: true, fontFace: 'Arial', color: C.ink, fit: 'shrink' });
  ctx.addText(slide, { text: '${esc(s[2])}', left: ${72 + i * 220}, top: 232, width: 138, height: 70, fontSize: 14.5, fontFace: 'Arial', color: C.ink, fit: 'shrink' });
  ctx.addShape(slide, { left: ${72 + i * 220}, top: 322, width: 138, height: 1.3, fill: C.purpleLight, line: { style: 'solid', fill: C.purpleLight, width: 0 } });
  ctx.addText(slide, { text: '${esc(s[3])}', left: ${72 + i * 220}, top: 338, width: 138, height: 50, fontSize: 14.5, bold: true, fontFace: 'Arial', color: C.ink, fit: 'shrink' });`).join('\n')}
  ctx.addShape(slide, { left: 178, top: 505, width: 825, height: 58, fill: C.purple, line: { style: 'solid', fill: C.purple, width: 0 } });
  ctx.addText(slide, { text: '${esc(slide.rule)}', left: 205, top: 522, width: 770, height: 26, fontSize: 22, bold: true, fontFace: 'Arial', color: C.white, align: 'center', fit: 'shrink' });
`;
  }

  if (slide.type === 'background') {
    return `
  title(slide, ctx, '${esc(slide.title)}');
  ${slide.bullets.map((t, i) => `bullet(slide, ctx, '${esc(t)}', 76, ${190 + i * 82}, 570, 19);`).join('\n  ')}
  ctx.addText(slide, { text: 'Эволюция продукта', left: 705, top: 220, width: 360, height: 38, fontSize: 28, bold: true, fontFace: 'Arial', color: C.ink });
  ${slide.stages.map((s, i) => `bullet(slide, ctx, '${esc(s)}', 720, ${282 + i * 44}, 360, 18);`).join('\n  ')}
`;
  }

  if (slide.type === 'pipeline') {
    return `
  title(slide, ctx, '${esc(slide.title)}');
  ${slide.items.map((it, i) => `
  pill(slide, ctx, '${esc(it[0])}', ${80 + i * 205}, 270, 170, 76, ${i >= 3 ? 'C.greenLight' : 'C.purpleLight'}, C.line, 17);
  ctx.addText(slide, { text: '${esc(it[1])}', left: ${85 + i * 205}, top: 360, width: 160, height: 36, fontSize: 15, fontFace: 'Arial', color: C.ink, align: 'center', fit: 'shrink' });`).join('\n')}
  ctx.addText(slide, { text: '${esc(slide.note)}', left: 150, top: 480, width: 850, height: 52, fontSize: 22, bold: true, fontFace: 'Arial', color: C.ink, align: 'center', fit: 'shrink' });
  source(slide, ctx, 'Источник: Google Vertex AI pricing page for Veo 2; exact video model pricing нужно перепроверить перед build.');
`;
  }

  if (slide.type === 'risks') {
    return `
  title(slide, ctx, '${esc(slide.title)}');
  ${metricBand(slide)}
  ${table(slide.rows, [245, 390, 430], 70, 180, 72)}
`;
  }

  if (slide.type === 'readinessCheck') {
    return `
  title(slide, ctx, '${esc(slide.title)}');
  ctx.addShape(slide, { left: 80, top: 112, width: 1040, height: 62, fill: C.purpleLight, line: { style: 'solid', fill: C.line, width: 1 } });
  ctx.addText(slide, { text: 'Вердикт: можно использовать как план проверки и основу следующей фазы, но не как доказанный бизнес без данных первой группы пользователей.', left: 105, top: 126, width: 990, height: 34, fontSize: 18, bold: true, fontFace: 'Arial', color: C.ink, align: 'center', fit: 'shrink' });
  ${table(slide.rows, [175, 190, 335, 360], 54, 195, 56)}
  ctx.addShape(slide, { left: 105, top: 636, width: 970, height: 28, fill: C.greenLight, line: { style: 'solid', fill: C.line, width: 1 } });
  ctx.addText(slide, { text: '${esc(slide.note)}', left: 122, top: 643, width: 934, height: 13, fontSize: 12.5, bold: true, fontFace: 'Arial', color: C.ink, align: 'center', fit: 'shrink' });
`;
  }

  if (slide.type === 'validation') {
    return `
  title(slide, ctx, '${esc(slide.title)}');
  ${metricBand(slide)}
  ${slide.weeks.map((w, i) => `
  pill(slide, ctx, '${esc(w[0])}', ${90 + i * 260}, 230, 150, 70, ${i === 3 ? 'C.greenLight' : 'C.purpleLight'}, C.line, 20);
  ctx.addText(slide, { text: '${esc(w[1])}', left: ${70 + i * 260}, top: 325, width: 190, height: 70, fontSize: 17, fontFace: 'Arial', color: C.ink, align: 'center', fit: 'shrink' });`).join('\n')}
  ctx.addText(slide, { text: 'Метрики успеха', left: 105, top: 480, width: 240, height: 30, fontSize: 24, bold: true, fontFace: 'Arial', color: C.ink });
  ctx.addText(slide, { text: '${esc(slide.metrics.join('  /  '))}', left: 105, top: 522, width: 940, height: 40, fontSize: 20, fontFace: 'Arial', color: C.ink, align: 'center', fit: 'shrink' });
`;
  }

  if (slide.type === 'contacts') {
    return `
  title(slide, ctx, '${esc(slide.title)}');
  ctx.addText(slide, { text: '${esc(slide.name)}', left: 430, top: 235, width: 360, height: 70, fontSize: 56, bold: true, fontFace: 'Montserrat', color: C.purple, align: 'center' });
  ctx.addText(slide, { text: '${esc(slide.cta)}', left: 265, top: 350, width: 700, height: 96, fontSize: 26, fontFace: 'Arial', color: C.ink, align: 'center', fit: 'shrink' });
  ctx.addText(slide, { text: 'Прототип → интервью → ручная группа → готовность платить', left: 240, top: 500, width: 760, height: 40, fontSize: 24, bold: true, fontFace: 'Arial', color: C.ink, align: 'center' });
`;
  }

  return `title(slide, ctx, '${esc(slide.title)}');`;
}

function table(rows, widths, x, y, h) {
  return rows.map((row, r) => {
    let xx = x;
    const parts = row.map((value, c) => {
      const fill = r === 0 ? 'C.purpleLight' : 'C.white';
      const bold = r === 0 || c === 0;
      const out = `cell(slide, ctx, '${esc(value)}', ${xx}, ${y + r * h}, ${widths[c]}, ${h}, ${fill}, ${bold}, ${r === 0 ? 15 : 14});`;
      xx += widths[c];
      return out;
    });
    return parts.join('\n  ');
  }).join('\n  ');
}

function metricText(slide) {
  const title = slide.title || '';
  if (/конкурент|astrology|mindfulness|companion|avatar|лидер/i.test(title)) return 'Смотреть на: выручка, MAU, платящие, конверсия. Смысл: какие платные поведения уже доказаны рынком.';
  if (/pricing|paywall|платят|подписк/i.test(title)) return 'Смотреть на: цена, что бесплатно, что платно, где появляется premium. Смысл: за какой момент ценности пользователь платит.';
  if (/COGS|стоим|генерац|видео|free user|пользователя/i.test(title)) return 'Смотреть на: себестоимость free и paid users. Смысл: не должна ли генерация съесть маржу подписки.';
  if (/финансов|помесяч|кварталь|годов|cash|runway|break-even|экономик/i.test(title)) return 'Смотреть на: выручка, расходы, запас денег, break-even. Смысл: сколько денег нужно до решения go/no-go.';
  if (/маркет|воронк|hooks|GTM/i.test(title)) return 'Смотреть на: CAC, активация, платный интерес, creator proof. Смысл: можно ли привлекать пользователей без сжигания бюджета.';
  if (/Roadmap|план|Scope|Риски/i.test(title)) return 'Смотреть на: условие перехода, риск, решение. Смысл: что делаем сейчас, что запрещено тащить в MVP.';
  if (/гипотез|бенчмарк|модель/i.test(title)) return 'Смотреть на: диапазоны conservative / base / strong. Смысл: какие предположения должны подтвердиться.';
  return '';
}

function metricBand(slide) {
  const text = metricText(slide);
  if (!text) return '';
  const color = /COGS|стоим|генерац|видео|free user|пользователя|финансов|помесяч|кварталь|годов|cash|runway|break-even|экономик/i.test(slide.title || '') ? 'C.greenLight' : 'C.purpleLight';
  return `metricBar(slide, ctx, '${esc(text)}', ${color});`;
}

function writeSlides() {
  fs.rmSync(WORKSPACE, { recursive: true, force: true });
  fs.mkdirSync(SLIDES_DIR, { recursive: true });
  fs.writeFileSync(path.join(SLIDES_DIR, '_shared.mjs'), sharedModule());
  slides.forEach((slide, idx) => {
    fs.writeFileSync(path.join(SLIDES_DIR, `slide-${String(idx + 1).padStart(2, '0')}.mjs`), moduleFor(slide, idx + 1));
  });
}

function buildDeck() {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  const result = spawnSync(NODE, [
    BUILDER,
    '--slides-dir', SLIDES_DIR,
    '--out', PPTX_OUT,
    '--preview-dir', PREVIEW_DIR,
    '--layout-dir', LAYOUT_DIR,
    '--contact-sheet', CONTACT_SHEET,
    '--slide-count', String(slides.length),
    '--workspace', WORKSPACE,
    '--slide-size', '1280x720',
    '--scale', '0.8',
  ], { stdio: 'inherit', env: { ...process.env, NODE_PATH: '/Users/kirill/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules' } });
  if (result.status !== 0) throw new Error(`Deck build failed with status ${result.status}`);
}

writePlan();
writeSlides();
buildDeck();
console.log(`plan=${PLAN_OUT}`);
console.log(`sources=${SOURCE_NOTES}`);
console.log(`pptx=${PPTX_OUT}`);
console.log(`contact_sheet=${CONTACT_SHEET}`);
