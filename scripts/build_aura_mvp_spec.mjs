import fs from 'fs';

const OUT = 'reports/aura-mvp-spec-v1.md';

function mdTable(rows, columns) {
  const header = `| ${columns.map(c => c.label).join(' | ')} |`;
  const sep = `| ${columns.map(() => '---').join(' | ')} |`;
  const body = rows.map(row => `| ${columns.map(c => String(row[c.key] ?? '').replace(/\n/g, '<br>').replace(/\|/g, '/')).join(' | ')} |`);
  return [header, sep, ...body].join('\n');
}

const lines = [];

const screenDetails = [
  {
    screen: '01 Welcome / Promise',
    user: 'Пользователь видит не маркетинговый лендинг, а короткое обещание продукта: АУРА превращает день в личный эпизод, маленькое действие и видимый след в Life Canvas.',
    actions: 'Start, открыть privacy, закрыть приложение.',
    data: 'source, campaign, install timestamp, locale.',
    backend: 'Создание anonymous/session id, запись app_opened/onboarding_started.',
    empty: 'Если сеть недоступна, экран все равно открывается локально; данные отправляются позже.',
    acceptance: 'За 5 секунд понятно, что это не просто horoscope, не просто habit tracker и не просто avatar generator.'
  },
  {
    screen: '02 Privacy / Consent',
    user: 'Пользователь получает честное объяснение: дата рождения и текущий запрос нужны для символического и персонального контекста, АУРА не ставит диагнозы и не обещает точных предсказаний.',
    actions: 'Accept, read details, decline/exit.',
    data: 'consent_status, policy_version, accepted_at.',
    backend: 'POST consent, сохранение версии политики.',
    empty: 'Без consent продукт не продолжает персонализацию.',
    acceptance: 'Пользователь понимает, какие данные нужны и почему; текст не звучит как юридическая стена.'
  },
  {
    screen: '03 Birth + Current State',
    user: 'Короткая анкета: имя, дата рождения, “что сейчас больше всего занимает”, настроение, тема дня. Не длинная психодиагностика.',
    actions: 'Заполнить, пропустить необязательные поля, выбрать состояние.',
    data: 'name, birth_date, mood, current_goal, optional context.',
    backend: 'PATCH /profile, validation, analytics profile_completed.',
    empty: 'Если пользователь пропускает часть полей, продукт показывает предупреждение: персональность будет мягче.',
    acceptance: 'Анкета занимает меньше 90 секунд и не вызывает ощущения “меня сейчас будут тестировать”.'
  },
  {
    screen: '04 Season Select',
    user: 'Пользователь выбирает первый 7-дневный сезон: спокойствие, уверенность, фокус, отношения, тело, деньги, творчество. Рекомендованный сезон подсвечивается по анкете.',
    actions: 'Выбрать сезон, посмотреть краткое описание, начать.',
    data: 'season_template_id, recommendation_reason.',
    backend: 'GET /seasons/templates, POST /seasons.',
    empty: 'Если AI-рекомендация недоступна, показываются базовые сезоны.',
    acceptance: 'Пользователь понимает, что это история на неделю, а не одноразовая выдача.'
  },
  {
    screen: '05 Daily Episode',
    user: 'Первый эпизод дня: название, смысл, внутренний конфликт, ресурс, риск дня, короткая фраза “что сегодня важно”.',
    actions: 'Прочитать, сохранить, перейти к действию, отметить “не попало”.',
    data: 'profile, season, day_index, previous memory, prompt_version.',
    backend: 'POST /episodes/generate, moderation, fallback template.',
    empty: 'Если генерация не готова, показывается skeleton и безопасный fallback.',
    acceptance: 'Эпизод звучит лично, но не магически-абсолютно; пользователь может сказать “это применимо сегодня”.'
  },
  {
    screen: '06 Daily Action',
    user: 'Три варианта действия: мягкий на 2 минуты, базовый на 10 минут, смелый. Все связаны с эпизодом, а не случайным self-care списком.',
    actions: 'Выбрать сложность, заменить действие, поставить напоминание.',
    data: 'episode_id, action_options, difficulty.',
    backend: 'POST /actions/select, optional action regeneration.',
    empty: 'Если ни одно действие не подходит, дать “сделать мягче” вместо полного провала.',
    acceptance: 'Действие можно выполнить сегодня без покупки предметов, звонков незнакомым людям и сильного социального риска.'
  },
  {
    screen: '07 Reset',
    user: 'Короткий ritual bridge: дыхание, фраза, заземление, визуальная пауза. Задача не meditation app, а снятие сопротивления перед действием.',
    actions: 'Start, pause, complete, skip.',
    data: 'action_id, reset_type, duration.',
    backend: 'POST /reset/start, POST /reset/complete.',
    empty: 'Если пользователь skip, flow не ломается, но reset_completed не засчитывается.',
    acceptance: 'Reset занимает 30-60 секунд и не выглядит как отдельный большой продукт.'
  },
  {
    screen: '08 Action Done / Reflection',
    user: 'Пользователь отмечает выполнение, выбирает эмоцию после и пишет одну строку. Это не дневник на страницу.',
    actions: 'Done, partial, not done, save reflection.',
    data: 'action_status, emotion_after, note.',
    backend: 'POST /actions/complete, POST /reflections.',
    empty: 'Если не сделал, показать меньший шаг и сохранить честное состояние.',
    acceptance: 'Пользователь не чувствует вины; даже partial completion превращается в данные для следующего дня.'
  },
  {
    screen: '09 Avatar / Life Canvas Shift',
    user: 'Визуальный слой меняется из-за действия: свет, цвет, предмет, поза, фон, символ или “след”. Важно объяснение причинности рядом с картинкой.',
    actions: 'Посмотреть shift, открыть explanation, save/share, continue.',
    data: 'episode, action, reflection, visual_style, previous_avatar_state.',
    backend: 'POST /avatar/generate, asset storage, provider cost logging.',
    empty: 'Pending state, fallback layered image, retry queue.',
    acceptance: 'Пользователь понимает: “картинка изменилась потому, что я сделал X”, а не “AI выдал случайную красоту”.'
  },
  {
    screen: '10 Tomorrow Hook',
    user: 'Короткий teaser следующего эпизода: “завтра история продолжится через тему…” и предложение включить мягкое напоминание.',
    actions: 'Enable reminder, skip, open paywall.',
    data: 'day_index, next_episode_teaser, notification_preference.',
    backend: 'POST notification preference, schedule push.',
    empty: 'Если push запрещен системой, предложить календарный или in-app hook.',
    acceptance: 'Пользователь получает причину вернуться, не ощущая давления и спама.'
  },
  {
    screen: '11 Paywall After Value',
    user: 'Платный экран появляется после completed loop. Он продает не “AI магию”, а продолжение сезона, память, weekly recap, стили Life Canvas и глубину.',
    actions: 'Start trial, subscribe, close, restore.',
    data: 'placement, offer_id, plan, entitlement.',
    backend: 'GET /paywall, RevenueCat/StoreKit, POST /billing/webhook.',
    empty: 'Если цены не загрузились, показать free continuation without purchase.',
    acceptance: 'Пользователь видел ценность до оплаты; paywall не блокирует первый инсайт.'
  },
  {
    screen: '12 Day 2 Episode',
    user: 'Новая серия не начинается с нуля: она ссылается на вчерашний шаг, emotion/reflection и avatar shift.',
    actions: 'Read, compare yesterday/today, choose next action.',
    data: 'previous episode/action/reflection/avatar_state.',
    backend: 'Episode generation with memory context.',
    empty: 'Если вчера действие не сделано, эпизод мягко строит comeback bridge.',
    acceptance: 'Пользователь чувствует сериал, а не набор случайных карточек.'
  },
  {
    screen: '13 Weekly Recap',
    user: 'После 7 дней пользователь видит карту недели: темы, действия, сдвиги, повторяющиеся паттерны, один главный вывод и предложение следующего сезона.',
    actions: 'Save, share, start next season, upgrade.',
    data: '7 episodes, action completions, reflections, avatar states.',
    backend: 'GET/POST weekly recap generation.',
    empty: 'Если неделя неполная, показывать честный recap “что уже видно”.',
    acceptance: 'Recap ощущается как результат, который жалко потерять.'
  },
  {
    screen: '14 Memory Archive',
    user: 'Архив сезонов, эпизодов, действий и Life Canvas states. Free видит ограниченно, paid видит глубину и историю.',
    actions: 'Open season, compare states, export/delete data.',
    data: 'season history, assets, subscription entitlement.',
    backend: 'GET /memory, entitlement checks.',
    empty: 'Если архив пустой, показать путь к первому сезону.',
    acceptance: 'Memory объясняет, почему продукт становится ценнее через месяц.'
  },
  {
    screen: '15 Settings / Trust',
    user: 'Данные, приватность, уведомления, подписка, export/delete, language, support.',
    actions: 'Edit, export, delete, manage plan, contact support.',
    data: 'preferences, subscription, privacy settings.',
    backend: 'Profile/privacy/billing endpoints.',
    empty: 'Не применимо.',
    acceptance: 'Пользователь чувствует контроль; это особенно важно из-за даты рождения и avatar/AI слоя.'
  }
];

lines.push('# AURA MVP Specification v1');
lines.push('');
lines.push('Документ для дизайнера, разработчика и продакта. Его задача - не доказывать рынок, а описать, что именно пользователь видит, какие сценарии проходят через MVP, какие сущности нужны в системе, какие API должны существовать и какие состояния пользователя считаются ключевыми.');
lines.push('');
lines.push('Версия MVP не строит всю АУРУ. Она проверяет одну причинную петлю: личный контекст -> эпизод дня -> маленькое действие -> reset -> reflection -> avatar / Life Canvas shift -> причина вернуться завтра.');
lines.push('');

lines.push('## 1. Product Blueprint / MVP Decision Summary');
lines.push('');
lines.push(mdTable([
  { field: 'Что строим', value: 'Mobile-first MVP приложения АУРА: личный 7-дневный сезон, daily episode, daily action, reset, reflection, Life Canvas/avatar shift и memory.' },
  { field: 'Что не строим', value: 'Видео-avatar каждый день, социальная сеть, marketplace, сообщества, глубокая кастомизация, AI-друзья, коуч-маркетплейс, AR/метавселенная.' },
  { field: 'Первичный сегмент', value: 'Spiritual self-improvers и habit/progress users, которые уже используют self-care, astrology, journaling, habit или AI tools.' },
  { field: 'Критический тест MVP', value: 'Пользователь за одну короткую сессию понимает причинность: я сделал действие, поэтому мой avatar/Life Canvas изменился.' },
  { field: 'Первая платная гипотеза', value: 'Подписка Aura Plus за продолжение сезона, память, weekly recap и avatar evolution; video/animation только как premium/token позже.' },
  { field: 'Главные метрики', value: 'Activation to first episode, completed loop, D1 return, D7 season completion, avatar causality comprehension, trial intent, first paid conversion.' }
], [
  { key: 'field', label: 'Пункт' },
  { key: 'value', label: 'Решение' }
]));
lines.push('');

lines.push('## 2. User Journey');
lines.push('');
lines.push('### 2.1 До установки');
lines.push('');
lines.push(mdTable([
  { layer: 'Ситуация', detail: 'Пользователь чувствует, что у него есть внутренний запрос: тревога, неопределенность, желание изменений, желание понять себя или собрать фокус.' },
  { layer: 'Текущие решения', detail: 'Гороскопы, tarot/astrology контент, дневник, заметки, habit tracker, Calm/Headspace, Finch, Replika/AI-chat, мотивационные ролики.' },
  { layer: 'Почему не хватает', detail: 'Одни продукты дают смысл без действия, другие действие без личного смысла, третьи avatar без причинности, четвертые reset без траектории.' },
  { layer: 'Триггер установки', detail: 'Пользователь видит обещание: “собери сериал о себе”, “получи первый эпизод дня”, “увидь, как меняется твоя будущая версия после маленького шага”.' },
  { layer: 'Главное ожидание', detail: 'Не просто картинка и не просто совет. Пользователь хочет почувствовать: “это про меня сейчас, и я понимаю, что сделать дальше”.' }
], [
  { key: 'layer', label: 'Слой' },
  { key: 'detail', label: 'Описание' }
]));
lines.push('');

lines.push('### 2.2 Первый запуск');
lines.push('');
lines.push(mdTable([
  { step: '1', screen: 'Welcome / Promise', sees: 'Короткое обещание: “АУРА - сериал о тебе, где день превращается в эпизод, действие и видимый след”.', feels: 'Любопытство, осторожность.', doubts: 'Это гороскоп? Это кринж? Это безопасно?', wow: 'Категория звучит не как привычный tracker или horoscope.' },
  { step: '2', screen: 'Privacy / Consent', sees: 'Зачем нужна дата рождения, что хранится, что не обещаем: не диагноз, не жесткое предсказание.', feels: 'Больше доверия.', doubts: 'Зачем дата рождения? Что будет с данными?', wow: 'Продукт честно ограничивает обещания.' },
  { step: '3', screen: 'Birth + Current State', sees: 'Дата рождения, имя, состояние, текущий запрос, тема дня.', feels: 'Участие.', doubts: 'Не слишком много вопросов?', wow: 'Вопросы короткие и связаны с сегодняшним днем.' },
  { step: '4', screen: 'Season Choice', sees: '7-дневные сезоны: Спокойствие, Уверенность, Фокус, Отношения, Тело, Деньги, Творчество.', feels: 'Выбор траектории.', doubts: 'А если ошибусь с темой?', wow: 'Это не одноразовая выдача, а история на неделю.' },
  { step: '5', screen: 'First Episode', sees: 'Название серии, смысл дня, внутренний конфликт, ресурс, риск.', feels: 'Первый инсайт.', doubts: 'Это слишком общее?', wow: 'Фраза должна звучать достаточно лично и применимо сегодня.' },
  { step: '6', screen: 'Daily Action', sees: 'Три действия: мягкое на 2 минуты, обычное на 10 минут, смелый шаг.', feels: 'Контроль и посильность.', doubts: 'Смогу ли сделать?', wow: 'Можно выбрать маленький шаг, а не героический план.' },
  { step: '7', screen: 'Reset', sees: '30-60 секунд дыхания, фразы или заземления под выбранное действие.', feels: 'Снижение сопротивления.', doubts: 'Не будет ли это скучно?', wow: 'Reset короткий и ведет к действию.' },
  { step: '8', screen: 'Done / Reflection', sees: 'Отметка выполнения, эмоция после, одна строка заметки.', feels: 'Я сделал шаг.', doubts: 'Зачем писать?', wow: 'Нужно только одно короткое доказательство.' },
  { step: '9', screen: 'Avatar / Life Canvas Shift', sees: 'Образ получает свет, предмет, цвет, позу, знак или слой, связанный с действием.', feels: 'Видимый прогресс.', doubts: 'Почему это изменилось?', wow: 'Изменение объяснено через действие.' },
  { step: '10', screen: 'Tomorrow Hook / Paywall', sees: 'Завтра откроется следующая серия; подписка открывает полный сезон и память.', feels: 'Любопытство.', doubts: 'Стоит ли платить?', wow: 'Платный экран появляется после первого completed loop.' }
], [
  { key: 'step', label: 'Шаг' },
  { key: 'screen', label: 'Экран' },
  { key: 'sees', label: 'Что видит' },
  { key: 'feels', label: 'Что чувствует' },
  { key: 'doubts', label: 'Сомнения' },
  { key: 'wow', label: 'Вау / причина продолжить' }
]));
lines.push('');

lines.push('### 2.3 После первого дня');
lines.push('');
lines.push(mdTable([
  { moment: 'Первый инсайт', product: 'Пользователь читает эпизод и видит связку между датой рождения, состоянием и текущим запросом.', success: 'Он может пересказать смысл своими словами и сказать “это похоже на мой день”.' },
  { moment: 'Первое действие', product: 'Пользователь выбирает действие по уровню сложности.', success: 'Он не спорит с действием и понимает, как выполнить его сегодня.' },
  { moment: 'Первый avatar shift', product: 'Life Canvas меняется после completed loop.', success: 'Пользователь понимает, почему именно это изменение произошло.' },
  { moment: 'День 2', product: 'Новая серия ссылается на вчерашний шаг.', success: 'Пользователь чувствует продолжение, а не случайный новый совет.' },
  { moment: 'День 7', product: 'Weekly recap собирает действия, темы и canvas shifts.', success: 'Пользователь видит первый результат недели.' },
  { moment: 'День 30', product: 'Архив сезонов показывает траекторию и повторяющиеся темы.', success: 'Пользователь может объяснить другу: “это помогает мне видеть свои изменения”.' },
  { moment: 'День 90', product: '3-8 сезонов, архив, стиль Life Canvas, paid/premium moments.', success: 'Пользователь считает АУРУ личной системой, а не AI-картинкой.' }
], [
  { key: 'moment', label: 'Момент' },
  { key: 'product', label: 'Что происходит в продукте' },
  { key: 'success', label: 'Сигнал успеха' }
]));
lines.push('');

lines.push('## 3. Screen Map');
lines.push('');
lines.push(mdTable([
  { screen: '01 Welcome', goal: 'Объяснить продукт за 5 секунд.', input: 'Нет.', output: 'Start onboarding.', retention: 'Снижает первый отвал.', monetization: 'Формирует доверие.', hypothesis: 'Пользователь понимает новую категорию.' },
  { screen: '02 Privacy', goal: 'Снять страх данных и обещаний.', input: 'Privacy copy.', output: 'Consent accepted.', retention: 'Доверие к возвращению.', monetization: 'Без доверия нет оплаты.', hypothesis: 'Дата рождения не блокирует вход.' },
  { screen: '03 Birth + State', goal: 'Собрать минимальный контекст.', input: 'Дата рождения, имя, состояние, запрос.', output: 'Profile context.', retention: 'Персонализация.', monetization: 'Основа paid depth.', hypothesis: 'Пользователь готов дать данные.' },
  { screen: '04 Season Select', goal: 'Дать недельную траекторию.', input: 'Запрос, suggested seasons.', output: 'Season started.', retention: 'Причина вернуться.', monetization: 'Сезон как подписочная ценность.', hypothesis: 'Season > one-off reading.' },
  { screen: '05 Episode', goal: 'Создать первый инсайт.', input: 'Profile, season, memory.', output: 'Episode read.', retention: 'Daily hook.', monetization: 'Продолжение эпизодов.', hypothesis: 'Meaning feels personal.' },
  { screen: '06 Action Select', goal: 'Выбрать одно действие.', input: 'Episode insight.', output: 'Action selected.', retention: 'Действие усиливает привязку.', monetization: 'Value before paywall.', hypothesis: 'Meaning -> action works.' },
  { screen: '07 Reset', goal: 'Подготовить к действию.', input: 'Action, mood.', output: 'Reset completed.', retention: 'Daily ritual.', monetization: 'Premium reset later.', hypothesis: 'Reset improves completion.' },
  { screen: '08 Complete Action', goal: 'Зафиксировать выполнение.', input: 'Action status.', output: 'Action completed.', retention: 'Memory evidence.', monetization: 'Paid archive later.', hypothesis: 'User completes tiny action.' },
  { screen: '09 Reflection', goal: 'Собрать короткую заметку.', input: 'Emotion, one-line note.', output: 'Reflection saved.', retention: 'Personal memory.', monetization: 'Weekly recap depth.', hypothesis: 'Reflection can be low-friction.' },
  { screen: '10 Avatar Shift', goal: 'Показать причинное изменение.', input: 'Episode, action, reflection.', output: 'Avatar state generated.', retention: 'Visible progress.', monetization: 'Visual premium.', hypothesis: 'Avatar is causal, not decoration.' },
  { screen: '11 Tomorrow Hook', goal: 'Открыть ожидание следующей серии.', input: 'Completed loop.', output: 'Reminder opt-in / next unlock.', retention: 'D1 return.', monetization: 'Paywall after value.', hypothesis: 'Story drives return.' },
  { screen: '12 Paywall', goal: 'Продать продолжение сезона.', input: 'Completed first loop.', output: 'Trial/subscription/token intent.', retention: 'Paid users retain better.', monetization: 'Core revenue.', hypothesis: 'Paid depth is legible.' },
  { screen: '13 Weekly Recap', goal: 'Собрать 7 дней в результат.', input: 'Episodes, actions, reflections, avatar states.', output: 'Recap saved/shared.', retention: 'D7 reward.', monetization: 'Upsell moment.', hypothesis: 'Season completion matters.' },
  { screen: '14 Memory Archive', goal: 'Показать историю изменений.', input: 'Past seasons.', output: 'Open season / premium archive.', retention: 'D30/D90 value.', monetization: 'Premium memory.', hypothesis: 'Trajectory becomes product value.' },
  { screen: '15 Settings', goal: 'Управлять данными, reminders, subscription.', input: 'User account.', output: 'Preferences updated.', retention: 'Trust and control.', monetization: 'Restore/manage plan.', hypothesis: 'Control reduces churn.' }
], [
  { key: 'screen', label: 'Экран' },
  { key: 'goal', label: 'Цель' },
  { key: 'input', label: 'Входящие данные' },
  { key: 'output', label: 'Выходящие действия' },
  { key: 'retention', label: 'Связь с удержанием' },
  { key: 'monetization', label: 'Связь с монетизацией' },
  { key: 'hypothesis', label: 'Связь с гипотезой' }
]));
lines.push('');

lines.push('## 4. Detailed Screen Specifications');
lines.push('');
lines.push('Ниже не дизайн-макеты, а продуктовые карточки экранов. Их можно отдавать дизайнеру как основу Figma, а разработчику - как основу API и состояний.');
lines.push('');
for (const detail of screenDetails) {
  lines.push(`### ${detail.screen}`);
  lines.push('');
  lines.push(mdTable([
    { field: 'Что видит пользователь', value: detail.user },
    { field: 'Действия пользователя', value: detail.actions },
    { field: 'Данные', value: detail.data },
    { field: 'Backend / API', value: detail.backend },
    { field: 'Empty / error state', value: detail.empty },
    { field: 'Acceptance criteria', value: detail.acceptance }
  ], [
    { key: 'field', label: 'Слой' },
    { key: 'value', label: 'Спецификация' }
  ]));
  lines.push('');
}

lines.push('### 4.16 Как читать эти экраны как один продукт');
lines.push('');
lines.push('Главная ошибка, которую нельзя допустить в MVP: собрать набор красивых экранов, но потерять причинность. Welcome должен обещать не “красивую картинку”, а личную историю изменений. Profile должен собирать не максимум данных, а минимальный контекст, достаточный для первого эпизода. Episode должен не просто звучать умно, а выводить пользователя к действию. Action должен быть настолько маленьким, чтобы человек мог выполнить его сегодня. Reset нужен не как отдельная медитация, а как короткий мост через сопротивление. Reflection нужна не как тяжелый дневник, а как доказательство. Avatar нужен не как генератор красоты, а как визуальная фиксация: “я сделал шаг, поэтому моя история изменилась”.');
lines.push('');
lines.push('Если дизайнер будет рисовать экраны, он должен держать эту цепочку как единый сценарий. Нельзя, чтобы avatar стал главным экраном до того, как пользователь сделал действие. Нельзя, чтобы paywall появился раньше первого completed loop. Нельзя, чтобы weekly recap выглядел как декоративный отчет, если в нем нет реальных действий пользователя. Нельзя, чтобы AI Companion перетянул внимание на чат до того, как доказана daily episode loop. В MVP каждый экран должен отвечать на один вопрос: помогает ли он пользователю завершить причинную петлю и захотеть вернуться завтра.');
lines.push('');
lines.push('Для разработки это означает простое правило: все ключевые сущности должны ссылаться друг на друга. Episode ссылается на Season и PromptVersion. Action ссылается на Episode. Reset ссылается на Action. Reflection ссылается на Action. AvatarState ссылается на Episode, Action и Reflection. WeeklyRecap ссылается на семь дней истории. Если эти связи не заложить в данные сразу, продукт быстро превратится в набор несвязанных AI-ответов, которые сложно анализировать, монетизировать и улучшать.');
lines.push('');

lines.push('## 5. User Stories');
lines.push('');
lines.push(mdTable([
  { role: 'Новый пользователь', story: 'Я хочу за одну минуту понять, что делает АУРА, чтобы решить, стоит ли вводить личные данные.', priority: 'Must Have', acceptance: 'Welcome и privacy объясняют продукт без рынка, стека и сложной терминологии.' },
  { role: 'Осторожный пользователь', story: 'Я хочу понимать, зачем нужна дата рождения и что с ней будет, чтобы не чувствовать манипуляции.', priority: 'Must Have', acceptance: 'Privacy экран говорит о данных до ввода даты.' },
  { role: 'Пользователь с запросом', story: 'Я хочу выбрать текущую тему, а не получать случайный прогноз.', priority: 'Must Have', acceptance: 'Profile сохраняет current_goal и mood.' },
  { role: 'Пользователь без энергии', story: 'Я хочу получить маленькое действие, которое реально можно сделать сегодня.', priority: 'Must Have', acceptance: 'Каждый episode дает 3 действия разной сложности.' },
  { role: 'Пользователь, который сомневается', story: 'Я хочу иметь возможность сделать действие мягче, чтобы не бросить flow.', priority: 'Should Have', acceptance: 'Action screen имеет “сделать мягче” или замену действия.' },
  { role: 'Пользователь после действия', story: 'Я хочу увидеть, что мой шаг что-то изменил, чтобы почувствовать смысл.', priority: 'Must Have', acceptance: 'Avatar/Life Canvas объясняет конкретную связь с action.' },
  { role: 'Возвращающийся пользователь', story: 'Я хочу, чтобы второй день помнил первый, иначе продукт кажется случайным.', priority: 'Must Have', acceptance: 'Day 2 episode использует previous action/reflection/avatar state.' },
  { role: 'Пользователь, пропустивший день', story: 'Я хочу вернуться без чувства вины, чтобы не удалить приложение.', priority: 'Should Have', acceptance: 'Comeback copy не стыдит и не ломает season.' },
  { role: 'Платящий пользователь', story: 'Я хочу понимать, за что плачу: продолжение сезона, память, recap, visual evolution.', priority: 'Must Have', acceptance: 'Paywall продает конкретные unlocked outcomes, а не абстрактный premium.' },
  { role: 'Дизайнер', story: 'Я хочу видеть карту экранов и состояний, чтобы не придумывать продукт заново.', priority: 'Must Have', acceptance: 'Screen Map покрывает первый loop и post-loop states.' },
  { role: 'Backend developer', story: 'Я хочу знать сущности и API, чтобы оценить объем разработки.', priority: 'Must Have', acceptance: 'Data Model и API Specification покрывают core loop.' },
  { role: 'Продакт', story: 'Я хочу видеть метрики успеха и провала, чтобы не спорить вкусовщиной.', priority: 'Must Have', acceptance: 'Analytics events привязаны к решениям.' },
  { role: 'Основатель', story: 'Я хочу понимать, что нельзя делать в MVP, чтобы не раздуть бюджет.', priority: 'Must Have', acceptance: 'Not MVP список зафиксирован и объяснен.' },
  { role: 'AI engineer', story: 'Я хочу знать, какие output нужны от модели, чтобы проектировать prompts.', priority: 'Must Have', acceptance: 'Episode/action/avatar generation имеют входы, выходы, safety и fallback.' },
  { role: 'Маркетолог', story: 'Я хочу видеть первый value moment, чтобы строить офферы и креативы.', priority: 'Should Have', acceptance: 'Главный оффер: личный сериал изменений, не просто horoscope/avatar.' }
], [
  { key: 'role', label: 'Кто' },
  { key: 'story', label: 'User story' },
  { key: 'priority', label: 'Приоритет' },
  { key: 'acceptance', label: 'Acceptance' }
]));
lines.push('');

lines.push('## 6. Core Scenarios');
lines.push('');
lines.push(mdTable([
  { scenario: 'Activation path', steps: 'Welcome -> Privacy -> Birth + State -> Season Select -> Episode -> Action -> Reset -> Complete -> Avatar Shift -> Tomorrow Hook', success: 'Пользователь завершает loop и понимает причинность.' },
  { scenario: 'Day 2 return', steps: 'Push -> Episode with yesterday memory -> New action -> Avatar comparison -> Next hook', success: 'Пользователь видит изменение относительно вчера.' },
  { scenario: 'Missed day comeback', steps: 'Soft push -> Comeback episode -> no shame copy -> small action -> recover season thread', success: 'Пропуск не разрушает сезон.' },
  { scenario: 'Paywall after value', steps: 'Completed loop -> Paywall -> trial/subscribe -> unlock season memory', success: 'Платный экран воспринимается честно.' },
  { scenario: 'Generation delay', steps: 'Avatar pending -> skeleton state -> notification when ready -> save/share', success: 'Задержка не ломает доверие.' },
  { scenario: 'Unsafe/generic AI output', steps: 'Moderation flag -> fallback template -> report issue -> admin review', success: 'Пользователь не видит вредный или странный текст.' },
  { scenario: 'Weekly recap', steps: 'Day 7 complete -> Recap generated -> save/share -> next season suggestion -> upsell', success: 'Пользователь видит первый результат.' }
], [
  { key: 'scenario', label: 'Сценарий' },
  { key: 'steps', label: 'Путь' },
  { key: 'success', label: 'Сигнал успеха' }
]));
lines.push('');

lines.push('## 7. MVP Scope');
lines.push('');
lines.push(mdTable([
  { group: 'Must Have', items: 'Welcome, privacy, birth/state profile, season select, daily episode, daily action, reset, reflection, avatar shift, memory, tomorrow hook, analytics, basic paywall.', why: 'Без этого нельзя проверить причинную петлю.' },
  { group: 'Should Have', items: 'Weekly recap, notifications, comeback episode, basic style presets, subscription restore, admin prompt controls.', why: 'Сильно повышает D7, trust и операционную управляемость.' },
  { group: 'Could Have', items: 'Voice reset, share card, achievements, premium episode mock, visual token mock.', why: 'Полезно после первых сигналов, но не должно блокировать MVP.' },
  { group: 'Not MVP', items: 'Daily video avatars, social network, communities, marketplace, multiplayer, coach marketplace, deep customization, user-generated public content, AI friends.', why: 'Эти функции увеличивают budget, moderation, privacy и cost до доказательства PMF.' }
], [
  { key: 'group', label: 'Группа' },
  { key: 'items', label: 'Функции' },
  { key: 'why', label: 'Почему' }
]));
lines.push('');

lines.push('## 8. Product Mechanics');
lines.push('');
lines.push(mdTable([
  { feature: 'Daily Episode', does: 'Генерирует личный смысл дня.', problem: 'Пользователь не знает, с чего начать.', retention: 'Daily hook.', monetization: 'Продолжение сезона.', risk: 'Generic text.', check: '70% пользователей пересказывают смысл своими словами.' },
  { feature: 'Daily Action', does: 'Дает один маленький шаг.', problem: 'Инсайт не становится поведением.', retention: 'Action completion.', monetization: 'Value before paywall.', risk: 'Действие слишком сложное.', check: '50%+ выбирают и завершают действие.' },
  { feature: 'Reset', does: 'Готовит к действию.', problem: 'Сопротивление и тревога.', retention: 'Ritual loop.', monetization: 'Premium reset packs later.', risk: 'Скучно или клинически.', check: 'Reset повышает completion.' },
  { feature: 'Avatar Shift', does: 'Показывает визуальный след действия.', problem: 'Рост невидим.', retention: 'Emotional anchor.', monetization: 'Visual premium.', risk: 'Декоративность.', check: '70% объясняют, почему avatar изменился.' },
  { feature: 'Future Self', does: 'Дает образ направления.', problem: 'Нет траектории.', retention: 'Хочется увидеть развитие.', monetization: 'Premium future-self reads.', risk: 'Токсичная “лучшая версия”.', check: 'Пользователь описывает future self как поддержку, не давление.' },
  { feature: 'Memory', does: 'Хранит episodes/actions/reflections/avatar states.', problem: 'Нет накопления.', retention: 'D7/D30 value.', monetization: 'Paid archive.', risk: 'Слишком тяжелый дневник.', check: 'Пользователь открывает recap/archive.' },
  { feature: 'Life Series / Seasons', does: 'Связывает дни в историю.', problem: 'One-off content не удерживает.', retention: 'Season completion.', monetization: 'Subscription depth.', risk: 'Контентная фабрика.', check: 'D7 completion >10-15%.' },
  { feature: 'Achievements', does: 'Мягко отмечает milestones.', problem: 'Нужно подкрепление.', retention: 'Completion boost.', monetization: 'Косвенно.', risk: 'Детскость.', check: 'Не снижает trust у взрослой аудитории.' },
  { feature: 'Reflection', does: 'Одна строка доказательства.', problem: 'Память без контекста пустая.', retention: 'Personal archive.', monetization: 'Recap quality.', risk: 'Трение письма.', check: '40%+ сохраняют reflection.' },
  { feature: 'Notifications', does: 'Возвращает завтра.', problem: 'Пользователь забывает.', retention: 'D1/D7.', monetization: 'Косвенно.', risk: 'Спам.', check: 'Push opt-in и reactivation без жалоб.' },
  { feature: 'Premium Content', does: 'Deep reads, styles, recaps.', problem: 'Нужна платная глубина.', retention: 'Post-D7 motivation.', monetization: 'Core paid layer.', risk: 'Не отличается от free.', check: 'Trial intent >5-10%.' },
  { feature: 'AI Companion', does: 'Диалоговая поддержка и память.', problem: 'Пользователь хочет быть услышанным.', retention: 'Может усилить relationship.', monetization: 'Premium mode later.', risk: 'Зависимость/safety/размытие ядра.', check: 'Не MVP; тестировать после episode/action loop.' }
], [
  { key: 'feature', label: 'Механика' },
  { key: 'does', label: 'Что делает' },
  { key: 'problem', label: 'Проблема' },
  { key: 'retention', label: 'Удержание' },
  { key: 'monetization', label: 'Монетизация' },
  { key: 'risk', label: 'Риск' },
  { key: 'check', label: 'Как проверить' }
]));
lines.push('');

lines.push('## 9. Function-Level Specification');
lines.push('');
lines.push(mdTable([
  { function_name: 'Daily Episode', rule: 'Один главный смысл дня, не больше 3 смысловых блоков.', input: 'profile, season theme, day index, memory.', output: 'title, insight, conflict, resource, risk, action seeds.', failure: 'Fallback template по теме сезона.', owner: 'AI/backend/product.' },
  { function_name: 'Daily Action', rule: 'Действие должно быть маленьким, наблюдаемым и выполнимым сегодня.', input: 'episode, mood, user energy.', output: 'easy/normal/brave action options.', failure: 'Пользователь может сделать действие мягче.', owner: 'AI/product.' },
  { function_name: 'Reset', rule: 'Reset длится 30-60 секунд и подводит к выбранному action.', input: 'action, mood.', output: 'reset script, duration, completion state.', failure: 'Skip allowed without breaking flow.', owner: 'Frontend/product.' },
  { function_name: 'Reflection', rule: 'Одна эмоция и одна короткая строка; не длинный дневник.', input: 'action completion.', output: 'emotion_after, note.', failure: 'Можно сохранить только emotion.', owner: 'Frontend/backend.' },
  { function_name: 'Avatar Shift', rule: 'Каждое изменение объяснено через действие или reflection.', input: 'episode, action, reflection, previous avatar state.', output: 'visual traits, prompt, asset, explanation.', failure: 'Pending/fallback asset.', owner: 'AI/image/backend.' },
  { function_name: 'Memory', rule: 'Архив показывает траекторию, а не просто список дней.', input: 'episodes, actions, reflections, avatar states.', output: 'season timeline, recap seeds.', failure: 'Empty state ведет к первому сезону.', owner: 'Backend/frontend.' },
  { function_name: 'Paywall', rule: 'Paywall после value moment, не до него.', input: 'user_state, completed_loop, entitlement.', output: 'offer, plan, trial, restore.', failure: 'Если store недоступен, продолжить free flow.', owner: 'Product/mobile.' },
  { function_name: 'Notifications', rule: 'Push говорит о продолжении истории, не о вине.', input: 'day index, last action, reminder preference.', output: 'scheduled push.', failure: 'No push fallback через in-app hook.', owner: 'Mobile/product.' },
  { function_name: 'Admin Prompts', rule: 'Команда может менять prompts и templates без релиза.', input: 'prompt template, safety rules.', output: 'active prompt version.', failure: 'Rollback to previous version.', owner: 'Backend/admin.' },
  { function_name: 'Analytics', rule: 'Каждый ключевой переход имеет event.', input: 'screen actions, backend events.', output: 'funnels and cohorts.', failure: 'Offline batch retry.', owner: 'Data/mobile/backend.' }
], [
  { key: 'function_name', label: 'Функция' },
  { key: 'rule', label: 'Правило продукта' },
  { key: 'input', label: 'Input' },
  { key: 'output', label: 'Output' },
  { key: 'failure', label: 'Failure / fallback' },
  { key: 'owner', label: 'Owner' }
]));
lines.push('');

lines.push('### 9.1 Что будет, если убрать функцию');
lines.push('');
lines.push(mdTable([
  { removed: 'Daily Episode', result: 'Остается habit/avatar app без личного смысла. Главная категория продукта теряется.', decision: 'Нельзя убирать.' },
  { removed: 'Daily Action', result: 'Пользователь получает insight, но нет поведения. Avatar shift становится декоративным.', decision: 'Нельзя убирать.' },
  { removed: 'Reset', result: 'Loop станет короче, но completion может просесть. Можно оставить минимальный текстовый reset.', decision: 'Можно упростить, но не выкидывать полностью до теста.' },
  { removed: 'Reflection', result: 'Memory и recap становятся беднее. Пользователь хуже видит траекторию.', decision: 'Оставить ultra-light reflection.' },
  { removed: 'Avatar Shift', result: 'Продукт становится AI journaling/habit app. Центральная идея Life Canvas пропадает.', decision: 'Нельзя убирать; видео можно убрать, image shift нельзя.' },
  { removed: 'Memory', result: 'Нет накопления, D7/D30 value падает.', decision: 'Нужна хотя бы базовая память.' },
  { removed: 'Paywall', result: 'Нельзя проверить willingness to pay.', decision: 'Нужен sandbox/paywall even if no aggressive monetization.' },
  { removed: 'Notifications', result: 'D1/D7 может быть искусственно низким.', decision: 'Нужны мягкие reminders.' },
  { removed: 'Analytics', result: 'Нельзя принять решение по MVP.', decision: 'Нельзя убирать.' }
], [
  { key: 'removed', label: 'Если убрать' },
  { key: 'result', label: 'Что сломается' },
  { key: 'decision', label: 'Решение' }
]));
lines.push('');

lines.push('## 10. Data Model');
lines.push('');
lines.push(mdTable([
  { entity: 'User', fields: 'id, email/apple_id/google_id, created_at, locale, consent_status, subscription_status', purpose: 'Аккаунт и права доступа.' },
  { entity: 'UserProfile', fields: 'user_id, name, birth_date, timezone, current_goal, privacy_flags', purpose: 'Минимальный персональный контекст.' },
  { entity: 'Season', fields: 'id, user_id, theme, status, day_index, started_at, completed_at', purpose: '7-дневная история.' },
  { entity: 'Episode', fields: 'id, season_id, day, title, insight, conflict, resource, risk, prompt_version', purpose: 'Daily content.' },
  { entity: 'Action', fields: 'id, episode_id, difficulty, text, selected_at, completed_at, status', purpose: 'Поведенческий шаг.' },
  { entity: 'ResetSession', fields: 'id, action_id, type, duration, started_at, completed_at', purpose: 'Мост к действию.' },
  { entity: 'Reflection', fields: 'id, action_id, emotion_before, emotion_after, note, created_at', purpose: 'Память и recap.' },
  { entity: 'AvatarState', fields: 'id, user_id, season_id, episode_id, visual_traits, cause_action_id, asset_id', purpose: 'Причинный visual progress.' },
  { entity: 'CanvasAsset', fields: 'id, user_id, type, url, provider, generation_cost, status, created_at', purpose: 'Изображения/recaps.' },
  { entity: 'Subscription', fields: 'user_id, plan, store, status, trial_start, renewal_at, revenuecat_id', purpose: 'Платный доступ.' },
  { entity: 'Notification', fields: 'id, user_id, type, scheduled_at, sent_at, opened_at', purpose: 'Возврат.' },
  { entity: 'AnalyticsEvent', fields: 'id, user_id, event_name, properties, created_at', purpose: 'Измерение MVP.' },
  { entity: 'PromptVersion', fields: 'id, name, version, template, safety_rules, active', purpose: 'Контроль AI-качества.' }
], [
  { key: 'entity', label: 'Сущность' },
  { key: 'fields', label: 'Поля' },
  { key: 'purpose', label: 'Зачем нужна' }
]));
lines.push('');

lines.push('## 11. API Specification');
lines.push('');
lines.push(mdTable([
  { method: 'POST', path: '/auth/session', job: 'Создать/обновить сессию.', input: 'provider_token', output: 'user, session', notes: 'Apple/Google/email magic link.' },
  { method: 'PATCH', path: '/profile', job: 'Сохранить дату рождения, имя, состояние, запрос.', input: 'name, birth_date, mood, goal', output: 'profile', notes: 'Валидация consent.' },
  { method: 'GET', path: '/seasons/templates', job: 'Получить темы сезонов.', input: 'profile_context', output: 'season_templates', notes: 'Можно персонализировать.' },
  { method: 'POST', path: '/seasons', job: 'Стартовать сезон.', input: 'theme_id', output: 'season', notes: 'Создать day_index=1.' },
  { method: 'POST', path: '/episodes/generate', job: 'Создать daily episode.', input: 'season_id, day, profile, memory', output: 'episode', notes: 'LLM + safety + prompt version.' },
  { method: 'POST', path: '/actions/select', job: 'Выбрать действие.', input: 'episode_id, difficulty', output: 'action', notes: 'Action может быть generated или template.' },
  { method: 'POST', path: '/reset/start', job: 'Начать reset.', input: 'action_id, reset_type', output: 'reset_session', notes: 'Логировать start.' },
  { method: 'POST', path: '/actions/complete', job: 'Завершить действие.', input: 'action_id, status', output: 'action', notes: 'Триггер reflection/avatar.' },
  { method: 'POST', path: '/reflections', job: 'Сохранить reflection.', input: 'action_id, emotion_after, note', output: 'reflection', notes: 'Одна строка, low friction.' },
  { method: 'POST', path: '/avatar/generate', job: 'Создать avatar shift.', input: 'episode_id, action_id, reflection_id', output: 'avatar_state, asset', notes: 'Async если генерация долгая.' },
  { method: 'GET', path: '/memory', job: 'Получить историю сезонов.', input: 'user_id', output: 'episodes, actions, assets', notes: 'Ограничить free archive.' },
  { method: 'GET', path: '/paywall', job: 'Получить paywall config.', input: 'user_state, experiment_id', output: 'plans, copy, trial', notes: 'RevenueCat config.' },
  { method: 'POST', path: '/billing/webhook', job: 'Обновить подписку.', input: 'store/revenuecat event', output: 'subscription_status', notes: 'Idempotent.' },
  { method: 'POST', path: '/events', job: 'Записать аналитику.', input: 'event_name, properties', output: 'ok', notes: 'Batch on mobile.' },
  { method: 'POST', path: '/admin/prompts/publish', job: 'Опубликовать prompt version.', input: 'template, rules', output: 'prompt_version', notes: 'Admin-only.' }
], [
  { key: 'method', label: 'Метод' },
  { key: 'path', label: 'Endpoint' },
  { key: 'job', label: 'Задача' },
  { key: 'input', label: 'Input' },
  { key: 'output', label: 'Output' },
  { key: 'notes', label: 'Примечание' }
]));
lines.push('');

lines.push('### 11.1 API Payload Examples');
lines.push('');
lines.push(mdTable([
  { endpoint: 'PATCH /profile', payload: 'name, birth_date, timezone, mood, current_goal, optional_context', response: 'profile_id, personalization_readiness, missing_fields', qa: 'Если birth_date пропущена, personalization_readiness ниже и copy честно объясняет ограничение.' },
  { endpoint: 'POST /episodes/generate', payload: 'user_id, season_id, day_index, profile_snapshot, memory_summary, prompt_version', response: 'episode_id, title, insight, conflict, resource, risk, action_seeds, safety_status', qa: 'Episode не содержит deterministic predictions, diagnosis, medical claims.' },
  { endpoint: 'POST /actions/select', payload: 'episode_id, action_option_id, difficulty, reminder_time', response: 'action_id, action_text, estimated_duration, reset_suggestion', qa: 'Action всегда имеет estimated_duration и can_make_easier=true.' },
  { endpoint: 'POST /avatar/generate', payload: 'episode_id, action_id, reflection_id, previous_avatar_state_id, style_id', response: 'avatar_state_id, asset_status, explanation, estimated_cost', qa: 'Explanation обязательно связывает visual trait с action.' },
  { endpoint: 'GET /memory', payload: 'user_id, season_id optional, entitlement', response: 'season_timeline, episodes, actions, reflections, avatar_states, locked_sections', qa: 'Free user видит понятные locked sections, paid user видит полную историю.' },
  { endpoint: 'GET /paywall', payload: 'user_id, placement, completed_loop, experiment_id', response: 'plans, trial, copy_variant, entitlement_preview', qa: 'Если completed_loop=false, paywall не должен быть агрессивным.' },
  { endpoint: 'POST /events', payload: 'event_name, user_state, screen, properties, client_timestamp', response: 'ok, server_timestamp', qa: 'Offline events отправляются batch, дубликаты не ломают воронку.' }
], [
  { key: 'endpoint', label: 'Endpoint' },
  { key: 'payload', label: 'Payload' },
  { key: 'response', label: 'Response' },
  { key: 'qa', label: 'QA rule' }
]));
lines.push('');

lines.push('## 12. User States');
lines.push('');
lines.push(mdTable([
  { state: 'new_user', meaning: 'Открыл приложение впервые.', entry: 'Install/open.', exit: 'consent_accepted.', product: 'Welcome + privacy.' },
  { state: 'consent_accepted', meaning: 'Доверие минимально получено.', entry: 'Accepted privacy.', exit: 'profile_created.', product: 'Birth + state.' },
  { state: 'profile_created', meaning: 'Есть персональный контекст.', entry: 'Profile saved.', exit: 'season_started.', product: 'Season select.' },
  { state: 'season_started', meaning: 'Есть активный сезон.', entry: 'Season created.', exit: 'episode_generated.', product: 'Generate episode.' },
  { state: 'episode_generated', meaning: 'Пользователь может получить insight.', entry: 'Episode ready.', exit: 'action_selected.', product: 'Episode screen.' },
  { state: 'action_selected', meaning: 'Пользователь выбрал поведение.', entry: 'Action selected.', exit: 'reset_completed/action_completed.', product: 'Reset/action flow.' },
  { state: 'action_completed', meaning: 'Есть доказательство действия.', entry: 'Complete action.', exit: 'reflection_saved/avatar_pending.', product: 'Reflection/avatar trigger.' },
  { state: 'avatar_pending', meaning: 'Генерация идет.', entry: 'Avatar request queued.', exit: 'avatar_generated/avatar_failed.', product: 'Loading and fallback.' },
  { state: 'avatar_generated', meaning: 'Пользователь увидел visible progress.', entry: 'Asset ready.', exit: 'tomorrow_hook/paywall_seen.', product: 'Avatar shift.' },
  { state: 'paywall_seen', meaning: 'Показана платная глубина.', entry: 'Completed loop.', exit: 'trial_started/skipped.', product: 'Paywall.' },
  { state: 'subscribed', meaning: 'Есть paid access.', entry: 'RevenueCat entitlement.', exit: 'canceled/expired.', product: 'Full season/memory.' },
  { state: 'dormant', meaning: 'Пропустил день или больше.', entry: 'No activity.', exit: 'comeback_started.', product: 'Soft reactivation.' },
  { state: 'season_completed', meaning: 'Завершил 7 дней.', entry: 'Day 7 complete.', exit: 'next_season_started.', product: 'Weekly recap.' }
], [
  { key: 'state', label: 'State' },
  { key: 'meaning', label: 'Что значит' },
  { key: 'entry', label: 'Вход' },
  { key: 'exit', label: 'Выход' },
  { key: 'product', label: 'Что показываем' }
]));
lines.push('');

lines.push('## 13. State Machine Logic');
lines.push('');
lines.push(mdTable([
  { from: 'new_user', event: 'onboarding_started', to: 'consent_accepted', rule: 'Нельзя идти к персонализации без consent.' },
  { from: 'consent_accepted', event: 'profile_completed', to: 'profile_created', rule: 'Минимум: дата рождения или явный skip, текущий запрос, язык.' },
  { from: 'profile_created', event: 'season_started', to: 'season_started', rule: 'Один активный сезон в MVP.' },
  { from: 'season_started', event: 'episode_generated', to: 'episode_generated', rule: 'Episode хранит prompt_version и safety_status.' },
  { from: 'episode_generated', event: 'action_selected', to: 'action_selected', rule: 'Action обязан ссылаться на episode.' },
  { from: 'action_selected', event: 'reset_completed', to: 'reset_completed', rule: 'Reset не обязателен, но влияет на аналитику completion.' },
  { from: 'reset_completed/action_selected', event: 'action_completed', to: 'action_completed', rule: 'Partial completion допустим; guilt copy запрещен.' },
  { from: 'action_completed', event: 'reflection_saved', to: 'reflection_saved', rule: 'Reflection может быть пустой, если emotion_after выбран.' },
  { from: 'reflection_saved/action_completed', event: 'avatar_requested', to: 'avatar_pending', rule: 'Avatar generation async; пользователь не должен ждать на заблокированном экране.' },
  { from: 'avatar_pending', event: 'avatar_generated', to: 'avatar_generated', rule: 'Каждый asset хранит provider, cost, latency.' },
  { from: 'avatar_generated', event: 'tomorrow_hook_seen', to: 'tomorrow_hook_seen', rule: 'Hook показывается только после visual progress.' },
  { from: 'tomorrow_hook_seen', event: 'paywall_viewed', to: 'paywall_seen', rule: 'Paywall после value moment.' },
  { from: 'paywall_seen', event: 'trial_started/subscribed', to: 'subscribed', rule: 'Entitlement приходит из billing webhook.' },
  { from: 'any active state', event: 'no_activity_24h+', to: 'dormant', rule: 'Dormant не сбрасывает сезон, а включает comeback flow.' },
  { from: 'dormant', event: 'push_opened/app_opened', to: 'comeback_started', rule: 'Возврат без shame/guilt.' },
  { from: 'season day 7 completed', event: 'season_completed', to: 'season_completed', rule: 'Weekly recap генерируется из фактических действий.' }
], [
  { key: 'from', label: 'From' },
  { key: 'event', label: 'Event' },
  { key: 'to', label: 'To' },
  { key: 'rule', label: 'Правило' }
]));
lines.push('');

lines.push('## 14. Analytics Events');
lines.push('');
lines.push(mdTable([
  { event: 'app_opened', trigger: 'Открытие приложения.', props: 'source, user_state, app_version', decision: 'Базовая активность.' },
  { event: 'onboarding_started', trigger: 'Welcome start.', props: 'source', decision: 'Понять drop-off.' },
  { event: 'consent_accepted', trigger: 'Privacy accepted.', props: 'copy_version', decision: 'Trust barrier.' },
  { event: 'profile_completed', trigger: 'Дата/состояние сохранены.', props: 'fields_count, skipped_fields', decision: 'Тяжесть входа.' },
  { event: 'season_started', trigger: 'Выбран сезон.', props: 'theme, source', decision: 'Темы спроса.' },
  { event: 'episode_generated', trigger: 'Episode ready.', props: 'model, prompt_version, latency, cost', decision: 'AI cost/quality.' },
  { event: 'episode_read', trigger: 'Пользователь дочитал.', props: 'read_time, scroll_depth', decision: 'Insight engagement.' },
  { event: 'action_selected', trigger: 'Выбор действия.', props: 'difficulty, action_type', decision: 'Action fit.' },
  { event: 'reset_completed', trigger: 'Reset завершен.', props: 'duration, type', decision: 'Reset value.' },
  { event: 'action_completed', trigger: 'Действие выполнено.', props: 'time_to_complete, difficulty', decision: 'Core loop.' },
  { event: 'reflection_saved', trigger: 'Заметка сохранена.', props: 'emotion_after, note_length', decision: 'Memory friction.' },
  { event: 'avatar_generated', trigger: 'Avatar ready.', props: 'provider, latency, cost, style', decision: 'Visual cost/quality.' },
  { event: 'avatar_causality_understood', trigger: 'Пользователь ответил/кликнул объяснение.', props: 'yes_no', decision: 'Главная гипотеза.' },
  { event: 'paywall_viewed', trigger: 'Paywall shown.', props: 'placement, offer, price', decision: 'Monetization timing.' },
  { event: 'trial_started', trigger: 'Trial started.', props: 'plan, price', decision: 'WTP.' },
  { event: 'subscription_started', trigger: 'Paid.', props: 'plan, store, revenue', decision: 'Revenue.' },
  { event: 'push_opened', trigger: 'Push click.', props: 'push_type, day_index', decision: 'Return loop.' },
  { event: 'season_completed', trigger: 'Day 7 complete.', props: 'completed_actions, recaps_saved', decision: 'D7 success.' }
], [
  { key: 'event', label: 'Event' },
  { key: 'trigger', label: 'Когда' },
  { key: 'props', label: 'Properties' },
  { key: 'decision', label: 'Какое решение помогает принять' }
]));
lines.push('');

lines.push('## 15. Metrics Dashboard');
lines.push('');
lines.push(mdTable([
  { metric: 'Activation to episode', formula: 'episode_generated / onboarding_started', target: '45%+ early target', decision: 'Если ниже, onboarding/profile слишком тяжелые или promise непонятен.' },
  { metric: 'Episode relevance', formula: 'positive relevance answers / tested users', target: '60%+', decision: 'Если ниже, prompt/profile context не работают.' },
  { metric: 'Action selected', formula: 'action_selected / episode_read', target: '50%+', decision: 'Если ниже, actions не кажутся посильными.' },
  { metric: 'Completed first loop', formula: 'avatar_generated / episode_generated', target: '25-35%+', decision: 'Если ниже, action/reset/reflection слишком тяжелые.' },
  { metric: 'Avatar causality', formula: 'users who correctly explain shift / avatar viewers', target: '70%+', decision: 'Если ниже, центральная идея не считывается.' },
  { metric: 'D1 return', formula: 'users active next day / activated users', target: '20-30%+', decision: 'Если ниже, story hook слабый.' },
  { metric: 'D7 completion', formula: 'season_completed / season_started', target: '10-15%+', decision: 'Если ниже, season loop не удерживает.' },
  { metric: 'Trial intent', formula: 'trial_started or paywall positive intent / paywall_viewed', target: '5-10%+', decision: 'Если ниже, платная ценность не ясна.' },
  { metric: 'Cost per completed loop', formula: 'AI + image + infra cost / completed loops', target: 'Должен быть кратно ниже paid ARPU', decision: 'Если растет, урезать video/expensive generation.' },
  { metric: 'Safety incidents', formula: 'critical flags / generated outputs', target: '0 critical', decision: 'Если есть critical, остановить public testing.' }
], [
  { key: 'metric', label: 'Метрика' },
  { key: 'formula', label: 'Формула' },
  { key: 'target', label: 'Цель' },
  { key: 'decision', label: 'Какое решение принимает' }
]));
lines.push('');

lines.push('## 16. Acceptance Criteria');
lines.push('');
lines.push(mdTable([
  { area: 'Activation', criterion: 'Пользователь проходит Welcome -> Profile -> Season -> Episode без ручной помощи.', metric: 'onboarding_start_to_episode_generated >= 45% на первых тестах.' },
  { area: 'Personal relevance', criterion: 'Эпизод звучит достаточно лично, но не делает опасных обещаний.', metric: '>= 60% интервьюируемых говорят “это похоже на мой день”.' },
  { area: 'Action fit', criterion: 'Каждый episode имеет 3 действия разной сложности.', metric: '>= 50% activated users select an action.' },
  { area: 'Loop completion', criterion: 'Пользователь может выполнить action, reset/reflection и увидеть avatar shift.', metric: '>= 25-35% activated users complete first loop.' },
  { area: 'Avatar causality', criterion: 'Изменение Life Canvas явно связано с действием.', metric: '>= 70% completed-loop users правильно объясняют причинность.' },
  { area: 'Return', criterion: 'День 2 ссылается на вчерашний шаг.', metric: 'D1 return >= 20-30% в concierge/early cohort.' },
  { area: 'Season', criterion: '7-дневный сезон можно пройти полностью.', metric: 'D7 season completion >= 10-15% early target.' },
  { area: 'Paywall', criterion: 'Paywall появляется после value moment.', metric: 'trial_start_intent >= 5-10% среди completed-loop users.' },
  { area: 'Safety', criterion: 'Нет медицинских, психологических или судьбоносных обещаний.', metric: '0 критических safety incidents в manual QA.' },
  { area: 'Cost', criterion: 'Каждый AI/image/video вызов логирует стоимость.', metric: 'unit cost считается по пользователю и дню.' },
  { area: 'Privacy', criterion: 'Пользователь может удалить/export данные.', metric: 'Privacy actions работают в тестовом окружении.' },
  { area: 'Operational control', criterion: 'Prompt/version можно менять без релиза приложения.', metric: 'Admin prompt publish проверен на staging.' }
], [
  { key: 'area', label: 'Область' },
  { key: 'criterion', label: 'Критерий приемки' },
  { key: 'metric', label: 'Метрика / проверка' }
]));
lines.push('');

lines.push('## 17. Edge Cases And Empty States');
lines.push('');
lines.push(mdTable([
  { case: 'Дата рождения не введена', behavior: 'Разрешить пропуск только для exploration или объяснить, зачем нужна дата.', message: 'Можно начать мягко, но персональность будет слабее.' },
  { case: 'AI episode failed', behavior: 'Показать fallback episode из template, логировать error.', message: 'Сегодняшний эпизод собран в безопасном режиме.' },
  { case: 'Avatar generation slow', behavior: 'Показать pending state и уведомить, когда готово.', message: 'Твой Life Canvas собирается, это может занять минуту.' },
  { case: 'Avatar generation failed', behavior: 'Fallback layered avatar state.', message: 'Мы сохранили твой прогресс и покажем визуальный след чуть позже.' },
  { case: 'Пользователь не сделал действие', behavior: 'Предложить меньший шаг или comeback episode.', message: 'Можно выбрать мягкую версию на 2 минуты.' },
  { case: 'Пропущен день', behavior: 'Не ломать сезон; добавить comeback bridge.', message: 'История не потеряна. Продолжим с маленького шага.' },
  { case: 'Paywall dismissed', behavior: 'Оставить tomorrow hook и ограниченный free доступ.', message: 'Следующая серия будет доступна в базовом формате.' },
  { case: 'Subscription canceled', behavior: 'Сохранить данные, ограничить premium features.', message: 'Твоя история сохранена, premium-сцены можно вернуть позже.' },
  { case: 'Unsafe content flag', behavior: 'Не показывать output, заменить safe template, отправить в review.', message: 'Мы переформулировали эпизод в более безопасной рамке.' }
], [
  { key: 'case', label: 'Случай' },
  { key: 'behavior', label: 'Поведение системы' },
  { key: 'message', label: 'Тон сообщения пользователю' }
]));
lines.push('');

lines.push('## 18. Product Copy Principles');
lines.push('');
lines.push(mdTable([
  { principle: 'Не обещать судьбу', good: '“Сегодняшний эпизод предлагает фокус дня”.', bad: '“Сегодня точно произойдет X”.' },
  { principle: 'Не давить лучшей версией', good: '“Мягкий следующий шаг”.', bad: '“Стань идеальной версией себя”.' },
  { principle: 'Объяснять причинность', good: '“Canvas изменился, потому что ты выбрал и сделал шаг про границы”.', bad: '“AI создал красивый образ”.' },
  { principle: 'Не стыдить за пропуски', good: '“История не потеряна, продолжим с маленького шага”.', bad: '“Ты потерял streak”.' },
  { principle: 'Сначала ценность, потом оплата', good: '“Продолжить сезон и сохранить историю”.', bad: '“Оплати, чтобы понять себя”.' },
  { principle: 'Взрослый тон', good: 'Коротко, тепло, без инфоцыганского пафоса.', bad: 'Слишком эзотерично, слишком терапевтично или слишком игрово.' }
], [
  { key: 'principle', label: 'Принцип' },
  { key: 'good', label: 'Так говорить' },
  { key: 'bad', label: 'Так не говорить' }
]));
lines.push('');

lines.push('## 19. Technical Non-Functional Requirements');
lines.push('');
lines.push(mdTable([
  { area: 'Performance', requirement: 'Core screens open instantly after app start; AI/image generation can be async.', reason: 'Пользователь не должен ждать “магии” на пустом экране.' },
  { area: 'Reliability', requirement: 'Episode and avatar generation have fallback templates and retry queue.', reason: 'Один сбой AI не должен ломать доверие.' },
  { area: 'Cost control', requirement: 'Every provider call logs cost estimate, latency and provider.', reason: 'Без этого невозможно unit economics.' },
  { area: 'Privacy', requirement: 'Consent version, data export and deletion path are mandatory.', reason: 'Дата рождения и avatar слой требуют доверия.' },
  { area: 'Safety', requirement: 'No diagnosis, medical advice, deterministic predictions or dependency-oriented companion language.', reason: 'Продукт рядом с wellbeing и spirituality, риски выше обычного entertainment.' },
  { area: 'Experimentation', requirement: 'Paywall copy, season themes, prompt versions and avatar styles must be configurable.', reason: 'MVP проверяет гипотезы, а не один вкус команды.' },
  { area: 'Observability', requirement: 'Generation failures, safety flags and funnel drops visible in dashboard.', reason: 'Команда должна быстро понимать, где ломается loop.' },
  { area: 'Moderation', requirement: 'Report issue and admin review queue for strange outputs.', reason: 'AI outputs будут ошибаться; нужен операционный контур.' },
  { area: 'Localization', requirement: 'MVP copy must support Russian and English copy structure even if launch language one.', reason: 'Рынок мировой, но отчет и первый артефакт на русском.' }
], [
  { key: 'area', label: 'Область' },
  { key: 'requirement', label: 'Требование' },
  { key: 'reason', label: 'Зачем' }
]));
lines.push('');

lines.push('## 20. API And Backend Work Packages');
lines.push('');
lines.push(mdTable([
  { package: 'Auth/Profile', backend: 'Auth provider, consent, profile table, profile API.', frontend: 'Welcome, Privacy, Birth + State.', done: 'User can create profile and edit/delete personal data.' },
  { package: 'Season/Episode', backend: 'Season table, episode generation endpoint, prompt versioning.', frontend: 'Season select, episode screen.', done: 'User starts season and receives Day 1 episode.' },
  { package: 'Action/Reset/Reflection', backend: 'Action, reset_session, reflection APIs.', frontend: 'Action select, reset, done/reflection.', done: 'Completed loop is persisted.' },
  { package: 'Avatar/Life Canvas', backend: 'Avatar generation queue, asset storage, provider logging.', frontend: 'Avatar pending/success/failure.', done: 'User sees causal avatar shift.' },
  { package: 'Memory/Recap', backend: 'Archive endpoint, weekly recap generation.', frontend: 'Memory, weekly recap.', done: 'Day 7 recap generated from history.' },
  { package: 'Billing', backend: 'RevenueCat integration, entitlement sync, paywall config.', frontend: 'Paywall, restore purchase, subscription state.', done: 'Trial/subscription unlocks paid features.' },
  { package: 'Analytics', backend: 'Event collector or SDK config, event taxonomy.', frontend: 'Track all core events.', done: 'Funnels visible for activation, D1, D7, paywall.' },
  { package: 'Admin', backend: 'Prompt editor, season templates, moderation queue.', frontend: 'Internal only.', done: 'Team can change prompts without app release.' }
], [
  { key: 'package', label: 'Пакет' },
  { key: 'backend', label: 'Backend' },
  { key: 'frontend', label: 'Frontend' },
  { key: 'done', label: 'Definition of Done' }
]));
lines.push('');

lines.push('## 21. MVP Build Plan');
lines.push('');
lines.push(mdTable([
  { week: 'Week 1', focus: 'Product/Figma/API foundation', deliverables: 'Screen map, clickable Figma, entities, API contract, event taxonomy.', risk: 'Слишком быстро уйти в красивый UI без causal loop.' },
  { week: 'Week 2', focus: 'Auth/Profile/Season', deliverables: 'Onboarding, consent, profile, season templates, first backend schema.', risk: 'Дата рождения и privacy могут стать friction point.' },
  { week: 'Week 3', focus: 'Episode/Action/Reset', deliverables: 'Prompt v1, episode generation, action select, reset flow, reflection.', risk: 'AI output слишком общий; нужен prompt QA.' },
  { week: 'Week 4', focus: 'Life Canvas / Avatar', deliverables: 'Image-first avatar shift, asset storage, pending/failure states, cost logging.', risk: 'Визуал красивый, но не причинный.' },
  { week: 'Week 5', focus: 'Paywall/Memory/Notifications', deliverables: 'RevenueCat sandbox, memory archive, tomorrow hook, basic push.', risk: 'Paywall рано или непонятно продает ценность.' },
  { week: 'Week 6', focus: 'QA/Concierge launch', deliverables: 'Analytics dashboard, safety review, 30-50 test users, interview scripts.', risk: 'Без ручных интервью цифры будут сложно интерпретировать.' }
], [
  { key: 'week', label: 'Период' },
  { key: 'focus', label: 'Фокус' },
  { key: 'deliverables', label: 'Что должно быть готово' },
  { key: 'risk', label: 'Главный риск недели' }
]));
lines.push('');

lines.push('## 22. MVP Release Checklist');
lines.push('');
lines.push(mdTable([
  { area: 'Product', check: '10-screen first loop implemented; Day 1 and Day 2 paths work; weekly recap can be mocked or generated.' },
  { area: 'Design', check: 'Figma covers all core screens, empty states, loading states, paywall, settings and error states.' },
  { area: 'Backend', check: 'Core entities and APIs exist; data deletion path exists; AI outputs versioned.' },
  { area: 'AI', check: 'Prompt versions, safety rules, fallback templates and provider costs logged.' },
  { area: 'Avatar', check: 'Image-first Life Canvas works with pending/success/failure states.' },
  { area: 'Analytics', check: 'Activation, action, reset, avatar, paywall and D1/D7 events tracked.' },
  { area: 'Billing', check: 'RevenueCat sandbox purchase, restore and entitlement work.' },
  { area: 'Validation', check: '20 interviews, 30-50 concierge users, first WTP test ready.' },
  { area: 'Not MVP', check: 'No daily video avatar, no social network, no marketplace, no public UGC.' }
], [
  { key: 'area', label: 'Область' },
  { key: 'check', label: 'Проверка перед запуском' }
]));
lines.push('');

lines.push('## 23. What Designer Needs Next');
lines.push('');
lines.push(mdTable([
  { item: 'Clickable prototype', detail: 'Собрать 15 экранов из Screen Map в Figma без финальной графики, но с реальными текстами и состояниями.' },
  { item: 'Life Canvas style directions', detail: '3 визуальные системы: symbolic portrait, abstract canvas, cinematic self-scene. Выбрать через интервью.' },
  { item: 'Paywall copy variants', detail: '3 варианта: season continuation, memory/archive, future-self visual evolution.' },
  { item: 'Empty/error states', detail: 'Отрисовать pending avatar, failed generation, skipped day, no reflection, canceled subscription.' },
  { item: 'Trust layer', detail: 'Privacy, data deletion, “not medical/psychological advice”, consent before date of birth.' },
  { item: 'Interview prototype', detail: 'Версия, где респондент проходит Day 1 и объясняет, понял ли он ценность.' }
], [
  { key: 'item', label: 'Что нужно' },
  { key: 'detail', label: 'Зачем' }
]));
lines.push('');

lines.push('## 24. What Engineering Needs Next');
lines.push('');
lines.push(mdTable([
  { item: 'Architecture decision', detail: 'React Native или Flutter; backend NestJS/FastAPI/Supabase; RevenueCat; Postgres; S3-compatible storage; analytics.' },
  { item: 'Provider decision', detail: 'LLM для episode/action, image provider для Life Canvas, fallback templates, async queue.' },
  { item: 'Cost logging', detail: 'Каждый AI/image call пишет provider, tokens/images, latency, estimated_cost.' },
  { item: 'Prompt registry', detail: 'PromptVersion entity и admin-only publish, чтобы править качество без релиза.' },
  { item: 'Safety filters', detail: 'Запрет diagnosis, medical claims, deterministic predictions, harmful advice, dependency-oriented companion behavior.' },
  { item: 'MVP dashboard', detail: 'Activation, loop completion, avatar causality, D1, D7, trial intent, cost per active user.' }
], [
  { key: 'item', label: 'Что нужно' },
  { key: 'detail', label: 'Зачем' }
]));
lines.push('');

lines.push('## 25. Interview And Prototype Validation Script');
lines.push('');
lines.push(mdTable([
  { stage: 'Before prototype', question: 'Какие приложения или практики вы используете, когда хотите понять себя, успокоиться или собрать фокус?', signal: 'Называет astrology/self-care/journaling/habit/AI tools.', kill: 'Нет привычки искать такие решения вообще.' },
  { stage: 'Before prototype', question: 'Когда вы в последний раз платили за похожий продукт и за что именно?', signal: 'Платил за подписку, content depth, personalization, coach, meditation, AI.', kill: 'Категорически не платит за digital self-care.' },
  { stage: 'Welcome', question: 'Что вы ожидаете увидеть дальше?', signal: 'Описывает сериал/эпизод/личный путь.', kill: 'Думает, что это просто генератор картинок.' },
  { stage: 'Profile', question: 'Какие поля вызывают доверие, а какие лишние?', signal: 'Дата рождения допустима при объяснении.', kill: 'Дата рождения блокирует вход даже после privacy.' },
  { stage: 'Episode', question: 'Что в эпизоде звучит про вас, а что слишком общее?', signal: 'Находит 1-2 личных попадания.', kill: 'Все звучит как generic horoscope.' },
  { stage: 'Action', question: 'Какое действие вы бы реально сделали сегодня?', signal: 'Выбирает easy/normal action.', kill: 'Все действия кажутся абстрактными или неловкими.' },
  { stage: 'Avatar Shift', question: 'Почему, по-вашему, изменилась картинка?', signal: 'Связывает с action/reflection.', kill: 'Говорит “AI просто нарисовал”.' },
  { stage: 'Paywall', question: 'За что здесь можно было бы платить?', signal: 'Называет season, memory, recap, visual evolution.', kill: 'Не видит платной ценности после completed loop.' },
  { stage: 'After prototype', question: 'Что должно произойти завтра, чтобы вы вернулись?', signal: 'Ждет продолжение истории.', kill: 'Не понимает, зачем второй день.' },
  { stage: 'After prototype', question: 'Кому бы вы это отправили и какими словами?', signal: 'Может сформулировать оффер другу.', kill: 'Не может объяснить продукт без помощи.' }
], [
  { key: 'stage', label: 'Этап' },
  { key: 'question', label: 'Вопрос' },
  { key: 'signal', label: 'Сигнал подтверждения' },
  { key: 'kill', label: 'Что убивает гипотезу' }
]));
lines.push('');

lines.push('## 26. Open Questions For Design And Engineering');
lines.push('');
lines.push(mdTable([
  { question: 'Насколько явно показывать astrology/date-of-birth layer?', decision: 'В прототипе держать мягко: дата рождения как symbolic input, не судьба.' },
  { question: 'Нужен ли face upload в MVP?', decision: 'Нет. Начать с stylized future-self/Life Canvas без пользовательского лица, чтобы снизить privacy/deepfake risk.' },
  { question: 'Делать ли voice reset?', decision: 'Could Have. Текстовый reset достаточно для MVP; voice можно добавить как premium/engagement test.' },
  { question: 'Когда показывать paywall?', decision: 'Только после completed first loop или на Day 7 recap. Не до первого value moment.' },
  { question: 'Какой первый тариф?', decision: 'Aura Plus $7.99-9.99/month или annual $39.99-59.99 как тест; visual tokens отдельно позже.' },
  { question: 'Какой главный go/no-go критерий?', decision: 'Понимание causal loop + D1 return + WTP. Если avatar не считывается как причинный, продукт пересобирать.' }
], [
  { key: 'question', label: 'Вопрос' },
  { key: 'decision', label: 'Решение v1' }
]));
lines.push('');

lines.push('## 27. Final MVP Definition');
lines.push('');
lines.push('AURA MVP - это не приложение “про астрологию” и не приложение “про аватары” отдельно. MVP должен проверить новую связку: пользователь дает минимальный личный контекст, получает эпизод дня, выбирает маленькое действие, проходит короткий reset, фиксирует результат и видит, как его Life Canvas/avatar меняется из-за выполненного действия.');
lines.push('');
lines.push('Если эта причинность не считывается, продукт распадается на обычный AI horoscope, habit tracker или image generator. Если причинность считывается, появляется категория: личный сериал изменений, где смысл, действие, память и визуальный образ работают вместе.');
lines.push('');
lines.push('Поэтому первый прототип должен быть жестко ограничен. Нужны 15 экранов, одна 7-дневная season loop, image-first Life Canvas, простая подписочная гипотеза и полный analytics layer. Видеоаватар, marketplace, community, AI companion и социальные механики должны ждать до тех пор, пока не доказаны activation, D1 return, D7 season completion и willingness to pay.');
lines.push('');

fs.mkdirSync('reports', { recursive: true });
fs.writeFileSync(OUT, `${lines.join('\n').trimEnd()}\n`);
console.log(`aura_mvp_spec=${OUT}`);
