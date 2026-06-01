# AURA MVP Specification v1

Документ для дизайнера, разработчика и продакта. Его задача - не доказывать рынок, а описать, что именно пользователь видит, какие сценарии проходят через MVP, какие сущности нужны в системе, какие API должны существовать и какие состояния пользователя считаются ключевыми.

Версия MVP не строит всю АУРУ. Она проверяет одну причинную петлю: личный контекст -> эпизод дня -> маленькое действие -> reset -> reflection -> avatar / Life Canvas shift -> причина вернуться завтра.

## 1. Product Blueprint / MVP Decision Summary

| Пункт | Решение |
| --- | --- |
| Что строим | Mobile-first MVP приложения АУРА: личный 7-дневный сезон, daily episode, daily action, reset, reflection, Life Canvas/avatar shift и memory. |
| Что не строим | Видео-avatar каждый день, социальная сеть, marketplace, сообщества, глубокая кастомизация, AI-друзья, коуч-маркетплейс, AR/метавселенная. |
| Первичный сегмент | Spiritual self-improvers и habit/progress users, которые уже используют self-care, astrology, journaling, habit или AI tools. |
| Критический тест MVP | Пользователь за одну короткую сессию понимает причинность: я сделал действие, поэтому мой avatar/Life Canvas изменился. |
| Первая платная гипотеза | Подписка Aura Plus за продолжение сезона, память, weekly recap и avatar evolution; video/animation только как premium/token позже. |
| Главные метрики | Activation to first episode, completed loop, D1 return, D7 season completion, avatar causality comprehension, trial intent, first paid conversion. |

## 2. User Journey

### 2.1 До установки

| Слой | Описание |
| --- | --- |
| Ситуация | Пользователь чувствует, что у него есть внутренний запрос: тревога, неопределенность, желание изменений, желание понять себя или собрать фокус. |
| Текущие решения | Гороскопы, tarot/astrology контент, дневник, заметки, habit tracker, Calm/Headspace, Finch, Replika/AI-chat, мотивационные ролики. |
| Почему не хватает | Одни продукты дают смысл без действия, другие действие без личного смысла, третьи avatar без причинности, четвертые reset без траектории. |
| Триггер установки | Пользователь видит обещание: “собери сериал о себе”, “получи первый эпизод дня”, “увидь, как меняется твоя будущая версия после маленького шага”. |
| Главное ожидание | Не просто картинка и не просто совет. Пользователь хочет почувствовать: “это про меня сейчас, и я понимаю, что сделать дальше”. |

### 2.2 Первый запуск

| Шаг | Экран | Что видит | Что чувствует | Сомнения | Вау / причина продолжить |
| --- | --- | --- | --- | --- | --- |
| 1 | Welcome / Promise | Короткое обещание: “АУРА - сериал о тебе, где день превращается в эпизод, действие и видимый след”. | Любопытство, осторожность. | Это гороскоп? Это кринж? Это безопасно? | Категория звучит не как привычный tracker или horoscope. |
| 2 | Privacy / Consent | Зачем нужна дата рождения, что хранится, что не обещаем: не диагноз, не жесткое предсказание. | Больше доверия. | Зачем дата рождения? Что будет с данными? | Продукт честно ограничивает обещания. |
| 3 | Birth + Current State | Дата рождения, имя, состояние, текущий запрос, тема дня. | Участие. | Не слишком много вопросов? | Вопросы короткие и связаны с сегодняшним днем. |
| 4 | Season Choice | 7-дневные сезоны: Спокойствие, Уверенность, Фокус, Отношения, Тело, Деньги, Творчество. | Выбор траектории. | А если ошибусь с темой? | Это не одноразовая выдача, а история на неделю. |
| 5 | First Episode | Название серии, смысл дня, внутренний конфликт, ресурс, риск. | Первый инсайт. | Это слишком общее? | Фраза должна звучать достаточно лично и применимо сегодня. |
| 6 | Daily Action | Три действия: мягкое на 2 минуты, обычное на 10 минут, смелый шаг. | Контроль и посильность. | Смогу ли сделать? | Можно выбрать маленький шаг, а не героический план. |
| 7 | Reset | 30-60 секунд дыхания, фразы или заземления под выбранное действие. | Снижение сопротивления. | Не будет ли это скучно? | Reset короткий и ведет к действию. |
| 8 | Done / Reflection | Отметка выполнения, эмоция после, одна строка заметки. | Я сделал шаг. | Зачем писать? | Нужно только одно короткое доказательство. |
| 9 | Avatar / Life Canvas Shift | Образ получает свет, предмет, цвет, позу, знак или слой, связанный с действием. | Видимый прогресс. | Почему это изменилось? | Изменение объяснено через действие. |
| 10 | Tomorrow Hook / Paywall | Завтра откроется следующая серия; подписка открывает полный сезон и память. | Любопытство. | Стоит ли платить? | Платный экран появляется после первого completed loop. |

### 2.3 После первого дня

| Момент | Что происходит в продукте | Сигнал успеха |
| --- | --- | --- |
| Первый инсайт | Пользователь читает эпизод и видит связку между датой рождения, состоянием и текущим запросом. | Он может пересказать смысл своими словами и сказать “это похоже на мой день”. |
| Первое действие | Пользователь выбирает действие по уровню сложности. | Он не спорит с действием и понимает, как выполнить его сегодня. |
| Первый avatar shift | Life Canvas меняется после completed loop. | Пользователь понимает, почему именно это изменение произошло. |
| День 2 | Новая серия ссылается на вчерашний шаг. | Пользователь чувствует продолжение, а не случайный новый совет. |
| День 7 | Weekly recap собирает действия, темы и canvas shifts. | Пользователь видит первый результат недели. |
| День 30 | Архив сезонов показывает траекторию и повторяющиеся темы. | Пользователь может объяснить другу: “это помогает мне видеть свои изменения”. |
| День 90 | 3-8 сезонов, архив, стиль Life Canvas, paid/premium moments. | Пользователь считает АУРУ личной системой, а не AI-картинкой. |

## 3. Screen Map

| Экран | Цель | Входящие данные | Выходящие действия | Связь с удержанием | Связь с монетизацией | Связь с гипотезой |
| --- | --- | --- | --- | --- | --- | --- |
| 01 Welcome | Объяснить продукт за 5 секунд. | Нет. | Start onboarding. | Снижает первый отвал. | Формирует доверие. | Пользователь понимает новую категорию. |
| 02 Privacy | Снять страх данных и обещаний. | Privacy copy. | Consent accepted. | Доверие к возвращению. | Без доверия нет оплаты. | Дата рождения не блокирует вход. |
| 03 Birth + State | Собрать минимальный контекст. | Дата рождения, имя, состояние, запрос. | Profile context. | Персонализация. | Основа paid depth. | Пользователь готов дать данные. |
| 04 Season Select | Дать недельную траекторию. | Запрос, suggested seasons. | Season started. | Причина вернуться. | Сезон как подписочная ценность. | Season > one-off reading. |
| 05 Episode | Создать первый инсайт. | Profile, season, memory. | Episode read. | Daily hook. | Продолжение эпизодов. | Meaning feels personal. |
| 06 Action Select | Выбрать одно действие. | Episode insight. | Action selected. | Действие усиливает привязку. | Value before paywall. | Meaning -> action works. |
| 07 Reset | Подготовить к действию. | Action, mood. | Reset completed. | Daily ritual. | Premium reset later. | Reset improves completion. |
| 08 Complete Action | Зафиксировать выполнение. | Action status. | Action completed. | Memory evidence. | Paid archive later. | User completes tiny action. |
| 09 Reflection | Собрать короткую заметку. | Emotion, one-line note. | Reflection saved. | Personal memory. | Weekly recap depth. | Reflection can be low-friction. |
| 10 Avatar Shift | Показать причинное изменение. | Episode, action, reflection. | Avatar state generated. | Visible progress. | Visual premium. | Avatar is causal, not decoration. |
| 11 Tomorrow Hook | Открыть ожидание следующей серии. | Completed loop. | Reminder opt-in / next unlock. | D1 return. | Paywall after value. | Story drives return. |
| 12 Paywall | Продать продолжение сезона. | Completed first loop. | Trial/subscription/token intent. | Paid users retain better. | Core revenue. | Paid depth is legible. |
| 13 Weekly Recap | Собрать 7 дней в результат. | Episodes, actions, reflections, avatar states. | Recap saved/shared. | D7 reward. | Upsell moment. | Season completion matters. |
| 14 Memory Archive | Показать историю изменений. | Past seasons. | Open season / premium archive. | D30/D90 value. | Premium memory. | Trajectory becomes product value. |
| 15 Settings | Управлять данными, reminders, subscription. | User account. | Preferences updated. | Trust and control. | Restore/manage plan. | Control reduces churn. |

## 4. Detailed Screen Specifications

Ниже не дизайн-макеты, а продуктовые карточки экранов. Их можно отдавать дизайнеру как основу Figma, а разработчику - как основу API и состояний.

### 01 Welcome / Promise

| Слой | Спецификация |
| --- | --- |
| Что видит пользователь | Пользователь видит не маркетинговый лендинг, а короткое обещание продукта: АУРА превращает день в личный эпизод, маленькое действие и видимый след в Life Canvas. |
| Действия пользователя | Start, открыть privacy, закрыть приложение. |
| Данные | source, campaign, install timestamp, locale. |
| Backend / API | Создание anonymous/session id, запись app_opened/onboarding_started. |
| Empty / error state | Если сеть недоступна, экран все равно открывается локально; данные отправляются позже. |
| Acceptance criteria | За 5 секунд понятно, что это не просто horoscope, не просто habit tracker и не просто avatar generator. |

### 02 Privacy / Consent

| Слой | Спецификация |
| --- | --- |
| Что видит пользователь | Пользователь получает честное объяснение: дата рождения и текущий запрос нужны для символического и персонального контекста, АУРА не ставит диагнозы и не обещает точных предсказаний. |
| Действия пользователя | Accept, read details, decline/exit. |
| Данные | consent_status, policy_version, accepted_at. |
| Backend / API | POST consent, сохранение версии политики. |
| Empty / error state | Без consent продукт не продолжает персонализацию. |
| Acceptance criteria | Пользователь понимает, какие данные нужны и почему; текст не звучит как юридическая стена. |

### 03 Birth + Current State

| Слой | Спецификация |
| --- | --- |
| Что видит пользователь | Короткая анкета: имя, дата рождения, “что сейчас больше всего занимает”, настроение, тема дня. Не длинная психодиагностика. |
| Действия пользователя | Заполнить, пропустить необязательные поля, выбрать состояние. |
| Данные | name, birth_date, mood, current_goal, optional context. |
| Backend / API | PATCH /profile, validation, analytics profile_completed. |
| Empty / error state | Если пользователь пропускает часть полей, продукт показывает предупреждение: персональность будет мягче. |
| Acceptance criteria | Анкета занимает меньше 90 секунд и не вызывает ощущения “меня сейчас будут тестировать”. |

### 04 Season Select

| Слой | Спецификация |
| --- | --- |
| Что видит пользователь | Пользователь выбирает первый 7-дневный сезон: спокойствие, уверенность, фокус, отношения, тело, деньги, творчество. Рекомендованный сезон подсвечивается по анкете. |
| Действия пользователя | Выбрать сезон, посмотреть краткое описание, начать. |
| Данные | season_template_id, recommendation_reason. |
| Backend / API | GET /seasons/templates, POST /seasons. |
| Empty / error state | Если AI-рекомендация недоступна, показываются базовые сезоны. |
| Acceptance criteria | Пользователь понимает, что это история на неделю, а не одноразовая выдача. |

### 05 Daily Episode

| Слой | Спецификация |
| --- | --- |
| Что видит пользователь | Первый эпизод дня: название, смысл, внутренний конфликт, ресурс, риск дня, короткая фраза “что сегодня важно”. |
| Действия пользователя | Прочитать, сохранить, перейти к действию, отметить “не попало”. |
| Данные | profile, season, day_index, previous memory, prompt_version. |
| Backend / API | POST /episodes/generate, moderation, fallback template. |
| Empty / error state | Если генерация не готова, показывается skeleton и безопасный fallback. |
| Acceptance criteria | Эпизод звучит лично, но не магически-абсолютно; пользователь может сказать “это применимо сегодня”. |

### 06 Daily Action

| Слой | Спецификация |
| --- | --- |
| Что видит пользователь | Три варианта действия: мягкий на 2 минуты, базовый на 10 минут, смелый. Все связаны с эпизодом, а не случайным self-care списком. |
| Действия пользователя | Выбрать сложность, заменить действие, поставить напоминание. |
| Данные | episode_id, action_options, difficulty. |
| Backend / API | POST /actions/select, optional action regeneration. |
| Empty / error state | Если ни одно действие не подходит, дать “сделать мягче” вместо полного провала. |
| Acceptance criteria | Действие можно выполнить сегодня без покупки предметов, звонков незнакомым людям и сильного социального риска. |

### 07 Reset

| Слой | Спецификация |
| --- | --- |
| Что видит пользователь | Короткий ritual bridge: дыхание, фраза, заземление, визуальная пауза. Задача не meditation app, а снятие сопротивления перед действием. |
| Действия пользователя | Start, pause, complete, skip. |
| Данные | action_id, reset_type, duration. |
| Backend / API | POST /reset/start, POST /reset/complete. |
| Empty / error state | Если пользователь skip, flow не ломается, но reset_completed не засчитывается. |
| Acceptance criteria | Reset занимает 30-60 секунд и не выглядит как отдельный большой продукт. |

### 08 Action Done / Reflection

| Слой | Спецификация |
| --- | --- |
| Что видит пользователь | Пользователь отмечает выполнение, выбирает эмоцию после и пишет одну строку. Это не дневник на страницу. |
| Действия пользователя | Done, partial, not done, save reflection. |
| Данные | action_status, emotion_after, note. |
| Backend / API | POST /actions/complete, POST /reflections. |
| Empty / error state | Если не сделал, показать меньший шаг и сохранить честное состояние. |
| Acceptance criteria | Пользователь не чувствует вины; даже partial completion превращается в данные для следующего дня. |

### 09 Avatar / Life Canvas Shift

| Слой | Спецификация |
| --- | --- |
| Что видит пользователь | Визуальный слой меняется из-за действия: свет, цвет, предмет, поза, фон, символ или “след”. Важно объяснение причинности рядом с картинкой. |
| Действия пользователя | Посмотреть shift, открыть explanation, save/share, continue. |
| Данные | episode, action, reflection, visual_style, previous_avatar_state. |
| Backend / API | POST /avatar/generate, asset storage, provider cost logging. |
| Empty / error state | Pending state, fallback layered image, retry queue. |
| Acceptance criteria | Пользователь понимает: “картинка изменилась потому, что я сделал X”, а не “AI выдал случайную красоту”. |

### 10 Tomorrow Hook

| Слой | Спецификация |
| --- | --- |
| Что видит пользователь | Короткий teaser следующего эпизода: “завтра история продолжится через тему…” и предложение включить мягкое напоминание. |
| Действия пользователя | Enable reminder, skip, open paywall. |
| Данные | day_index, next_episode_teaser, notification_preference. |
| Backend / API | POST notification preference, schedule push. |
| Empty / error state | Если push запрещен системой, предложить календарный или in-app hook. |
| Acceptance criteria | Пользователь получает причину вернуться, не ощущая давления и спама. |

### 11 Paywall After Value

| Слой | Спецификация |
| --- | --- |
| Что видит пользователь | Платный экран появляется после completed loop. Он продает не “AI магию”, а продолжение сезона, память, weekly recap, стили Life Canvas и глубину. |
| Действия пользователя | Start trial, subscribe, close, restore. |
| Данные | placement, offer_id, plan, entitlement. |
| Backend / API | GET /paywall, RevenueCat/StoreKit, POST /billing/webhook. |
| Empty / error state | Если цены не загрузились, показать free continuation without purchase. |
| Acceptance criteria | Пользователь видел ценность до оплаты; paywall не блокирует первый инсайт. |

### 12 Day 2 Episode

| Слой | Спецификация |
| --- | --- |
| Что видит пользователь | Новая серия не начинается с нуля: она ссылается на вчерашний шаг, emotion/reflection и avatar shift. |
| Действия пользователя | Read, compare yesterday/today, choose next action. |
| Данные | previous episode/action/reflection/avatar_state. |
| Backend / API | Episode generation with memory context. |
| Empty / error state | Если вчера действие не сделано, эпизод мягко строит comeback bridge. |
| Acceptance criteria | Пользователь чувствует сериал, а не набор случайных карточек. |

### 13 Weekly Recap

| Слой | Спецификация |
| --- | --- |
| Что видит пользователь | После 7 дней пользователь видит карту недели: темы, действия, сдвиги, повторяющиеся паттерны, один главный вывод и предложение следующего сезона. |
| Действия пользователя | Save, share, start next season, upgrade. |
| Данные | 7 episodes, action completions, reflections, avatar states. |
| Backend / API | GET/POST weekly recap generation. |
| Empty / error state | Если неделя неполная, показывать честный recap “что уже видно”. |
| Acceptance criteria | Recap ощущается как результат, который жалко потерять. |

### 14 Memory Archive

| Слой | Спецификация |
| --- | --- |
| Что видит пользователь | Архив сезонов, эпизодов, действий и Life Canvas states. Free видит ограниченно, paid видит глубину и историю. |
| Действия пользователя | Open season, compare states, export/delete data. |
| Данные | season history, assets, subscription entitlement. |
| Backend / API | GET /memory, entitlement checks. |
| Empty / error state | Если архив пустой, показать путь к первому сезону. |
| Acceptance criteria | Memory объясняет, почему продукт становится ценнее через месяц. |

### 15 Settings / Trust

| Слой | Спецификация |
| --- | --- |
| Что видит пользователь | Данные, приватность, уведомления, подписка, export/delete, language, support. |
| Действия пользователя | Edit, export, delete, manage plan, contact support. |
| Данные | preferences, subscription, privacy settings. |
| Backend / API | Profile/privacy/billing endpoints. |
| Empty / error state | Не применимо. |
| Acceptance criteria | Пользователь чувствует контроль; это особенно важно из-за даты рождения и avatar/AI слоя. |

### 4.16 Как читать эти экраны как один продукт

Главная ошибка, которую нельзя допустить в MVP: собрать набор красивых экранов, но потерять причинность. Welcome должен обещать не “красивую картинку”, а личную историю изменений. Profile должен собирать не максимум данных, а минимальный контекст, достаточный для первого эпизода. Episode должен не просто звучать умно, а выводить пользователя к действию. Action должен быть настолько маленьким, чтобы человек мог выполнить его сегодня. Reset нужен не как отдельная медитация, а как короткий мост через сопротивление. Reflection нужна не как тяжелый дневник, а как доказательство. Avatar нужен не как генератор красоты, а как визуальная фиксация: “я сделал шаг, поэтому моя история изменилась”.

Если дизайнер будет рисовать экраны, он должен держать эту цепочку как единый сценарий. Нельзя, чтобы avatar стал главным экраном до того, как пользователь сделал действие. Нельзя, чтобы paywall появился раньше первого completed loop. Нельзя, чтобы weekly recap выглядел как декоративный отчет, если в нем нет реальных действий пользователя. Нельзя, чтобы AI Companion перетянул внимание на чат до того, как доказана daily episode loop. В MVP каждый экран должен отвечать на один вопрос: помогает ли он пользователю завершить причинную петлю и захотеть вернуться завтра.

Для разработки это означает простое правило: все ключевые сущности должны ссылаться друг на друга. Episode ссылается на Season и PromptVersion. Action ссылается на Episode. Reset ссылается на Action. Reflection ссылается на Action. AvatarState ссылается на Episode, Action и Reflection. WeeklyRecap ссылается на семь дней истории. Если эти связи не заложить в данные сразу, продукт быстро превратится в набор несвязанных AI-ответов, которые сложно анализировать, монетизировать и улучшать.

## 5. User Stories

| Кто | User story | Приоритет | Acceptance |
| --- | --- | --- | --- |
| Новый пользователь | Я хочу за одну минуту понять, что делает АУРА, чтобы решить, стоит ли вводить личные данные. | Must Have | Welcome и privacy объясняют продукт без рынка, стека и сложной терминологии. |
| Осторожный пользователь | Я хочу понимать, зачем нужна дата рождения и что с ней будет, чтобы не чувствовать манипуляции. | Must Have | Privacy экран говорит о данных до ввода даты. |
| Пользователь с запросом | Я хочу выбрать текущую тему, а не получать случайный прогноз. | Must Have | Profile сохраняет current_goal и mood. |
| Пользователь без энергии | Я хочу получить маленькое действие, которое реально можно сделать сегодня. | Must Have | Каждый episode дает 3 действия разной сложности. |
| Пользователь, который сомневается | Я хочу иметь возможность сделать действие мягче, чтобы не бросить flow. | Should Have | Action screen имеет “сделать мягче” или замену действия. |
| Пользователь после действия | Я хочу увидеть, что мой шаг что-то изменил, чтобы почувствовать смысл. | Must Have | Avatar/Life Canvas объясняет конкретную связь с action. |
| Возвращающийся пользователь | Я хочу, чтобы второй день помнил первый, иначе продукт кажется случайным. | Must Have | Day 2 episode использует previous action/reflection/avatar state. |
| Пользователь, пропустивший день | Я хочу вернуться без чувства вины, чтобы не удалить приложение. | Should Have | Comeback copy не стыдит и не ломает season. |
| Платящий пользователь | Я хочу понимать, за что плачу: продолжение сезона, память, recap, visual evolution. | Must Have | Paywall продает конкретные unlocked outcomes, а не абстрактный premium. |
| Дизайнер | Я хочу видеть карту экранов и состояний, чтобы не придумывать продукт заново. | Must Have | Screen Map покрывает первый loop и post-loop states. |
| Backend developer | Я хочу знать сущности и API, чтобы оценить объем разработки. | Must Have | Data Model и API Specification покрывают core loop. |
| Продакт | Я хочу видеть метрики успеха и провала, чтобы не спорить вкусовщиной. | Must Have | Analytics events привязаны к решениям. |
| Основатель | Я хочу понимать, что нельзя делать в MVP, чтобы не раздуть бюджет. | Must Have | Not MVP список зафиксирован и объяснен. |
| AI engineer | Я хочу знать, какие output нужны от модели, чтобы проектировать prompts. | Must Have | Episode/action/avatar generation имеют входы, выходы, safety и fallback. |
| Маркетолог | Я хочу видеть первый value moment, чтобы строить офферы и креативы. | Should Have | Главный оффер: личный сериал изменений, не просто horoscope/avatar. |

## 6. Core Scenarios

| Сценарий | Путь | Сигнал успеха |
| --- | --- | --- |
| Activation path | Welcome -> Privacy -> Birth + State -> Season Select -> Episode -> Action -> Reset -> Complete -> Avatar Shift -> Tomorrow Hook | Пользователь завершает loop и понимает причинность. |
| Day 2 return | Push -> Episode with yesterday memory -> New action -> Avatar comparison -> Next hook | Пользователь видит изменение относительно вчера. |
| Missed day comeback | Soft push -> Comeback episode -> no shame copy -> small action -> recover season thread | Пропуск не разрушает сезон. |
| Paywall after value | Completed loop -> Paywall -> trial/subscribe -> unlock season memory | Платный экран воспринимается честно. |
| Generation delay | Avatar pending -> skeleton state -> notification when ready -> save/share | Задержка не ломает доверие. |
| Unsafe/generic AI output | Moderation flag -> fallback template -> report issue -> admin review | Пользователь не видит вредный или странный текст. |
| Weekly recap | Day 7 complete -> Recap generated -> save/share -> next season suggestion -> upsell | Пользователь видит первый результат. |

## 7. MVP Scope

| Группа | Функции | Почему |
| --- | --- | --- |
| Must Have | Welcome, privacy, birth/state profile, season select, daily episode, daily action, reset, reflection, avatar shift, memory, tomorrow hook, analytics, basic paywall. | Без этого нельзя проверить причинную петлю. |
| Should Have | Weekly recap, notifications, comeback episode, basic style presets, subscription restore, admin prompt controls. | Сильно повышает D7, trust и операционную управляемость. |
| Could Have | Voice reset, share card, achievements, premium episode mock, visual token mock. | Полезно после первых сигналов, но не должно блокировать MVP. |
| Not MVP | Daily video avatars, social network, communities, marketplace, multiplayer, coach marketplace, deep customization, user-generated public content, AI friends. | Эти функции увеличивают budget, moderation, privacy и cost до доказательства PMF. |

## 8. Product Mechanics

| Механика | Что делает | Проблема | Удержание | Монетизация | Риск | Как проверить |
| --- | --- | --- | --- | --- | --- | --- |
| Daily Episode | Генерирует личный смысл дня. | Пользователь не знает, с чего начать. | Daily hook. | Продолжение сезона. | Generic text. | 70% пользователей пересказывают смысл своими словами. |
| Daily Action | Дает один маленький шаг. | Инсайт не становится поведением. | Action completion. | Value before paywall. | Действие слишком сложное. | 50%+ выбирают и завершают действие. |
| Reset | Готовит к действию. | Сопротивление и тревога. | Ritual loop. | Premium reset packs later. | Скучно или клинически. | Reset повышает completion. |
| Avatar Shift | Показывает визуальный след действия. | Рост невидим. | Emotional anchor. | Visual premium. | Декоративность. | 70% объясняют, почему avatar изменился. |
| Future Self | Дает образ направления. | Нет траектории. | Хочется увидеть развитие. | Premium future-self reads. | Токсичная “лучшая версия”. | Пользователь описывает future self как поддержку, не давление. |
| Memory | Хранит episodes/actions/reflections/avatar states. | Нет накопления. | D7/D30 value. | Paid archive. | Слишком тяжелый дневник. | Пользователь открывает recap/archive. |
| Life Series / Seasons | Связывает дни в историю. | One-off content не удерживает. | Season completion. | Subscription depth. | Контентная фабрика. | D7 completion >10-15%. |
| Achievements | Мягко отмечает milestones. | Нужно подкрепление. | Completion boost. | Косвенно. | Детскость. | Не снижает trust у взрослой аудитории. |
| Reflection | Одна строка доказательства. | Память без контекста пустая. | Personal archive. | Recap quality. | Трение письма. | 40%+ сохраняют reflection. |
| Notifications | Возвращает завтра. | Пользователь забывает. | D1/D7. | Косвенно. | Спам. | Push opt-in и reactivation без жалоб. |
| Premium Content | Deep reads, styles, recaps. | Нужна платная глубина. | Post-D7 motivation. | Core paid layer. | Не отличается от free. | Trial intent >5-10%. |
| AI Companion | Диалоговая поддержка и память. | Пользователь хочет быть услышанным. | Может усилить relationship. | Premium mode later. | Зависимость/safety/размытие ядра. | Не MVP; тестировать после episode/action loop. |

## 9. Function-Level Specification

| Функция | Правило продукта | Input | Output | Failure / fallback | Owner |
| --- | --- | --- | --- | --- | --- |
| Daily Episode | Один главный смысл дня, не больше 3 смысловых блоков. | profile, season theme, day index, memory. | title, insight, conflict, resource, risk, action seeds. | Fallback template по теме сезона. | AI/backend/product. |
| Daily Action | Действие должно быть маленьким, наблюдаемым и выполнимым сегодня. | episode, mood, user energy. | easy/normal/brave action options. | Пользователь может сделать действие мягче. | AI/product. |
| Reset | Reset длится 30-60 секунд и подводит к выбранному action. | action, mood. | reset script, duration, completion state. | Skip allowed without breaking flow. | Frontend/product. |
| Reflection | Одна эмоция и одна короткая строка; не длинный дневник. | action completion. | emotion_after, note. | Можно сохранить только emotion. | Frontend/backend. |
| Avatar Shift | Каждое изменение объяснено через действие или reflection. | episode, action, reflection, previous avatar state. | visual traits, prompt, asset, explanation. | Pending/fallback asset. | AI/image/backend. |
| Memory | Архив показывает траекторию, а не просто список дней. | episodes, actions, reflections, avatar states. | season timeline, recap seeds. | Empty state ведет к первому сезону. | Backend/frontend. |
| Paywall | Paywall после value moment, не до него. | user_state, completed_loop, entitlement. | offer, plan, trial, restore. | Если store недоступен, продолжить free flow. | Product/mobile. |
| Notifications | Push говорит о продолжении истории, не о вине. | day index, last action, reminder preference. | scheduled push. | No push fallback через in-app hook. | Mobile/product. |
| Admin Prompts | Команда может менять prompts и templates без релиза. | prompt template, safety rules. | active prompt version. | Rollback to previous version. | Backend/admin. |
| Analytics | Каждый ключевой переход имеет event. | screen actions, backend events. | funnels and cohorts. | Offline batch retry. | Data/mobile/backend. |

### 9.1 Что будет, если убрать функцию

| Если убрать | Что сломается | Решение |
| --- | --- | --- |
| Daily Episode | Остается habit/avatar app без личного смысла. Главная категория продукта теряется. | Нельзя убирать. |
| Daily Action | Пользователь получает insight, но нет поведения. Avatar shift становится декоративным. | Нельзя убирать. |
| Reset | Loop станет короче, но completion может просесть. Можно оставить минимальный текстовый reset. | Можно упростить, но не выкидывать полностью до теста. |
| Reflection | Memory и recap становятся беднее. Пользователь хуже видит траекторию. | Оставить ultra-light reflection. |
| Avatar Shift | Продукт становится AI journaling/habit app. Центральная идея Life Canvas пропадает. | Нельзя убирать; видео можно убрать, image shift нельзя. |
| Memory | Нет накопления, D7/D30 value падает. | Нужна хотя бы базовая память. |
| Paywall | Нельзя проверить willingness to pay. | Нужен sandbox/paywall even if no aggressive monetization. |
| Notifications | D1/D7 может быть искусственно низким. | Нужны мягкие reminders. |
| Analytics | Нельзя принять решение по MVP. | Нельзя убирать. |

## 10. Data Model

| Сущность | Поля | Зачем нужна |
| --- | --- | --- |
| User | id, email/apple_id/google_id, created_at, locale, consent_status, subscription_status | Аккаунт и права доступа. |
| UserProfile | user_id, name, birth_date, timezone, current_goal, privacy_flags | Минимальный персональный контекст. |
| Season | id, user_id, theme, status, day_index, started_at, completed_at | 7-дневная история. |
| Episode | id, season_id, day, title, insight, conflict, resource, risk, prompt_version | Daily content. |
| Action | id, episode_id, difficulty, text, selected_at, completed_at, status | Поведенческий шаг. |
| ResetSession | id, action_id, type, duration, started_at, completed_at | Мост к действию. |
| Reflection | id, action_id, emotion_before, emotion_after, note, created_at | Память и recap. |
| AvatarState | id, user_id, season_id, episode_id, visual_traits, cause_action_id, asset_id | Причинный visual progress. |
| CanvasAsset | id, user_id, type, url, provider, generation_cost, status, created_at | Изображения/recaps. |
| Subscription | user_id, plan, store, status, trial_start, renewal_at, revenuecat_id | Платный доступ. |
| Notification | id, user_id, type, scheduled_at, sent_at, opened_at | Возврат. |
| AnalyticsEvent | id, user_id, event_name, properties, created_at | Измерение MVP. |
| PromptVersion | id, name, version, template, safety_rules, active | Контроль AI-качества. |

## 11. API Specification

| Метод | Endpoint | Задача | Input | Output | Примечание |
| --- | --- | --- | --- | --- | --- |
| POST | /auth/session | Создать/обновить сессию. | provider_token | user, session | Apple/Google/email magic link. |
| PATCH | /profile | Сохранить дату рождения, имя, состояние, запрос. | name, birth_date, mood, goal | profile | Валидация consent. |
| GET | /seasons/templates | Получить темы сезонов. | profile_context | season_templates | Можно персонализировать. |
| POST | /seasons | Стартовать сезон. | theme_id | season | Создать day_index=1. |
| POST | /episodes/generate | Создать daily episode. | season_id, day, profile, memory | episode | LLM + safety + prompt version. |
| POST | /actions/select | Выбрать действие. | episode_id, difficulty | action | Action может быть generated или template. |
| POST | /reset/start | Начать reset. | action_id, reset_type | reset_session | Логировать start. |
| POST | /actions/complete | Завершить действие. | action_id, status | action | Триггер reflection/avatar. |
| POST | /reflections | Сохранить reflection. | action_id, emotion_after, note | reflection | Одна строка, low friction. |
| POST | /avatar/generate | Создать avatar shift. | episode_id, action_id, reflection_id | avatar_state, asset | Async если генерация долгая. |
| GET | /memory | Получить историю сезонов. | user_id | episodes, actions, assets | Ограничить free archive. |
| GET | /paywall | Получить paywall config. | user_state, experiment_id | plans, copy, trial | RevenueCat config. |
| POST | /billing/webhook | Обновить подписку. | store/revenuecat event | subscription_status | Idempotent. |
| POST | /events | Записать аналитику. | event_name, properties | ok | Batch on mobile. |
| POST | /admin/prompts/publish | Опубликовать prompt version. | template, rules | prompt_version | Admin-only. |

### 11.1 API Payload Examples

| Endpoint | Payload | Response | QA rule |
| --- | --- | --- | --- |
| PATCH /profile | name, birth_date, timezone, mood, current_goal, optional_context | profile_id, personalization_readiness, missing_fields | Если birth_date пропущена, personalization_readiness ниже и copy честно объясняет ограничение. |
| POST /episodes/generate | user_id, season_id, day_index, profile_snapshot, memory_summary, prompt_version | episode_id, title, insight, conflict, resource, risk, action_seeds, safety_status | Episode не содержит deterministic predictions, diagnosis, medical claims. |
| POST /actions/select | episode_id, action_option_id, difficulty, reminder_time | action_id, action_text, estimated_duration, reset_suggestion | Action всегда имеет estimated_duration и can_make_easier=true. |
| POST /avatar/generate | episode_id, action_id, reflection_id, previous_avatar_state_id, style_id | avatar_state_id, asset_status, explanation, estimated_cost | Explanation обязательно связывает visual trait с action. |
| GET /memory | user_id, season_id optional, entitlement | season_timeline, episodes, actions, reflections, avatar_states, locked_sections | Free user видит понятные locked sections, paid user видит полную историю. |
| GET /paywall | user_id, placement, completed_loop, experiment_id | plans, trial, copy_variant, entitlement_preview | Если completed_loop=false, paywall не должен быть агрессивным. |
| POST /events | event_name, user_state, screen, properties, client_timestamp | ok, server_timestamp | Offline events отправляются batch, дубликаты не ломают воронку. |

## 12. User States

| State | Что значит | Вход | Выход | Что показываем |
| --- | --- | --- | --- | --- |
| new_user | Открыл приложение впервые. | Install/open. | consent_accepted. | Welcome + privacy. |
| consent_accepted | Доверие минимально получено. | Accepted privacy. | profile_created. | Birth + state. |
| profile_created | Есть персональный контекст. | Profile saved. | season_started. | Season select. |
| season_started | Есть активный сезон. | Season created. | episode_generated. | Generate episode. |
| episode_generated | Пользователь может получить insight. | Episode ready. | action_selected. | Episode screen. |
| action_selected | Пользователь выбрал поведение. | Action selected. | reset_completed/action_completed. | Reset/action flow. |
| action_completed | Есть доказательство действия. | Complete action. | reflection_saved/avatar_pending. | Reflection/avatar trigger. |
| avatar_pending | Генерация идет. | Avatar request queued. | avatar_generated/avatar_failed. | Loading and fallback. |
| avatar_generated | Пользователь увидел visible progress. | Asset ready. | tomorrow_hook/paywall_seen. | Avatar shift. |
| paywall_seen | Показана платная глубина. | Completed loop. | trial_started/skipped. | Paywall. |
| subscribed | Есть paid access. | RevenueCat entitlement. | canceled/expired. | Full season/memory. |
| dormant | Пропустил день или больше. | No activity. | comeback_started. | Soft reactivation. |
| season_completed | Завершил 7 дней. | Day 7 complete. | next_season_started. | Weekly recap. |

## 13. State Machine Logic

| From | Event | To | Правило |
| --- | --- | --- | --- |
| new_user | onboarding_started | consent_accepted | Нельзя идти к персонализации без consent. |
| consent_accepted | profile_completed | profile_created | Минимум: дата рождения или явный skip, текущий запрос, язык. |
| profile_created | season_started | season_started | Один активный сезон в MVP. |
| season_started | episode_generated | episode_generated | Episode хранит prompt_version и safety_status. |
| episode_generated | action_selected | action_selected | Action обязан ссылаться на episode. |
| action_selected | reset_completed | reset_completed | Reset не обязателен, но влияет на аналитику completion. |
| reset_completed/action_selected | action_completed | action_completed | Partial completion допустим; guilt copy запрещен. |
| action_completed | reflection_saved | reflection_saved | Reflection может быть пустой, если emotion_after выбран. |
| reflection_saved/action_completed | avatar_requested | avatar_pending | Avatar generation async; пользователь не должен ждать на заблокированном экране. |
| avatar_pending | avatar_generated | avatar_generated | Каждый asset хранит provider, cost, latency. |
| avatar_generated | tomorrow_hook_seen | tomorrow_hook_seen | Hook показывается только после visual progress. |
| tomorrow_hook_seen | paywall_viewed | paywall_seen | Paywall после value moment. |
| paywall_seen | trial_started/subscribed | subscribed | Entitlement приходит из billing webhook. |
| any active state | no_activity_24h+ | dormant | Dormant не сбрасывает сезон, а включает comeback flow. |
| dormant | push_opened/app_opened | comeback_started | Возврат без shame/guilt. |
| season day 7 completed | season_completed | season_completed | Weekly recap генерируется из фактических действий. |

## 14. Analytics Events

| Event | Когда | Properties | Какое решение помогает принять |
| --- | --- | --- | --- |
| app_opened | Открытие приложения. | source, user_state, app_version | Базовая активность. |
| onboarding_started | Welcome start. | source | Понять drop-off. |
| consent_accepted | Privacy accepted. | copy_version | Trust barrier. |
| profile_completed | Дата/состояние сохранены. | fields_count, skipped_fields | Тяжесть входа. |
| season_started | Выбран сезон. | theme, source | Темы спроса. |
| episode_generated | Episode ready. | model, prompt_version, latency, cost | AI cost/quality. |
| episode_read | Пользователь дочитал. | read_time, scroll_depth | Insight engagement. |
| action_selected | Выбор действия. | difficulty, action_type | Action fit. |
| reset_completed | Reset завершен. | duration, type | Reset value. |
| action_completed | Действие выполнено. | time_to_complete, difficulty | Core loop. |
| reflection_saved | Заметка сохранена. | emotion_after, note_length | Memory friction. |
| avatar_generated | Avatar ready. | provider, latency, cost, style | Visual cost/quality. |
| avatar_causality_understood | Пользователь ответил/кликнул объяснение. | yes_no | Главная гипотеза. |
| paywall_viewed | Paywall shown. | placement, offer, price | Monetization timing. |
| trial_started | Trial started. | plan, price | WTP. |
| subscription_started | Paid. | plan, store, revenue | Revenue. |
| push_opened | Push click. | push_type, day_index | Return loop. |
| season_completed | Day 7 complete. | completed_actions, recaps_saved | D7 success. |

## 15. Metrics Dashboard

| Метрика | Формула | Цель | Какое решение принимает |
| --- | --- | --- | --- |
| Activation to episode | episode_generated / onboarding_started | 45%+ early target | Если ниже, onboarding/profile слишком тяжелые или promise непонятен. |
| Episode relevance | positive relevance answers / tested users | 60%+ | Если ниже, prompt/profile context не работают. |
| Action selected | action_selected / episode_read | 50%+ | Если ниже, actions не кажутся посильными. |
| Completed first loop | avatar_generated / episode_generated | 25-35%+ | Если ниже, action/reset/reflection слишком тяжелые. |
| Avatar causality | users who correctly explain shift / avatar viewers | 70%+ | Если ниже, центральная идея не считывается. |
| D1 return | users active next day / activated users | 20-30%+ | Если ниже, story hook слабый. |
| D7 completion | season_completed / season_started | 10-15%+ | Если ниже, season loop не удерживает. |
| Trial intent | trial_started or paywall positive intent / paywall_viewed | 5-10%+ | Если ниже, платная ценность не ясна. |
| Cost per completed loop | AI + image + infra cost / completed loops | Должен быть кратно ниже paid ARPU | Если растет, урезать video/expensive generation. |
| Safety incidents | critical flags / generated outputs | 0 critical | Если есть critical, остановить public testing. |

## 16. Acceptance Criteria

| Область | Критерий приемки | Метрика / проверка |
| --- | --- | --- |
| Activation | Пользователь проходит Welcome -> Profile -> Season -> Episode без ручной помощи. | onboarding_start_to_episode_generated >= 45% на первых тестах. |
| Personal relevance | Эпизод звучит достаточно лично, но не делает опасных обещаний. | >= 60% интервьюируемых говорят “это похоже на мой день”. |
| Action fit | Каждый episode имеет 3 действия разной сложности. | >= 50% activated users select an action. |
| Loop completion | Пользователь может выполнить action, reset/reflection и увидеть avatar shift. | >= 25-35% activated users complete first loop. |
| Avatar causality | Изменение Life Canvas явно связано с действием. | >= 70% completed-loop users правильно объясняют причинность. |
| Return | День 2 ссылается на вчерашний шаг. | D1 return >= 20-30% в concierge/early cohort. |
| Season | 7-дневный сезон можно пройти полностью. | D7 season completion >= 10-15% early target. |
| Paywall | Paywall появляется после value moment. | trial_start_intent >= 5-10% среди completed-loop users. |
| Safety | Нет медицинских, психологических или судьбоносных обещаний. | 0 критических safety incidents в manual QA. |
| Cost | Каждый AI/image/video вызов логирует стоимость. | unit cost считается по пользователю и дню. |
| Privacy | Пользователь может удалить/export данные. | Privacy actions работают в тестовом окружении. |
| Operational control | Prompt/version можно менять без релиза приложения. | Admin prompt publish проверен на staging. |

## 17. Edge Cases And Empty States

| Случай | Поведение системы | Тон сообщения пользователю |
| --- | --- | --- |
| Дата рождения не введена | Разрешить пропуск только для exploration или объяснить, зачем нужна дата. | Можно начать мягко, но персональность будет слабее. |
| AI episode failed | Показать fallback episode из template, логировать error. | Сегодняшний эпизод собран в безопасном режиме. |
| Avatar generation slow | Показать pending state и уведомить, когда готово. | Твой Life Canvas собирается, это может занять минуту. |
| Avatar generation failed | Fallback layered avatar state. | Мы сохранили твой прогресс и покажем визуальный след чуть позже. |
| Пользователь не сделал действие | Предложить меньший шаг или comeback episode. | Можно выбрать мягкую версию на 2 минуты. |
| Пропущен день | Не ломать сезон; добавить comeback bridge. | История не потеряна. Продолжим с маленького шага. |
| Paywall dismissed | Оставить tomorrow hook и ограниченный free доступ. | Следующая серия будет доступна в базовом формате. |
| Subscription canceled | Сохранить данные, ограничить premium features. | Твоя история сохранена, premium-сцены можно вернуть позже. |
| Unsafe content flag | Не показывать output, заменить safe template, отправить в review. | Мы переформулировали эпизод в более безопасной рамке. |

## 18. Product Copy Principles

| Принцип | Так говорить | Так не говорить |
| --- | --- | --- |
| Не обещать судьбу | “Сегодняшний эпизод предлагает фокус дня”. | “Сегодня точно произойдет X”. |
| Не давить лучшей версией | “Мягкий следующий шаг”. | “Стань идеальной версией себя”. |
| Объяснять причинность | “Canvas изменился, потому что ты выбрал и сделал шаг про границы”. | “AI создал красивый образ”. |
| Не стыдить за пропуски | “История не потеряна, продолжим с маленького шага”. | “Ты потерял streak”. |
| Сначала ценность, потом оплата | “Продолжить сезон и сохранить историю”. | “Оплати, чтобы понять себя”. |
| Взрослый тон | Коротко, тепло, без инфоцыганского пафоса. | Слишком эзотерично, слишком терапевтично или слишком игрово. |

## 19. Technical Non-Functional Requirements

| Область | Требование | Зачем |
| --- | --- | --- |
| Performance | Core screens open instantly after app start; AI/image generation can be async. | Пользователь не должен ждать “магии” на пустом экране. |
| Reliability | Episode and avatar generation have fallback templates and retry queue. | Один сбой AI не должен ломать доверие. |
| Cost control | Every provider call logs cost estimate, latency and provider. | Без этого невозможно unit economics. |
| Privacy | Consent version, data export and deletion path are mandatory. | Дата рождения и avatar слой требуют доверия. |
| Safety | No diagnosis, medical advice, deterministic predictions or dependency-oriented companion language. | Продукт рядом с wellbeing и spirituality, риски выше обычного entertainment. |
| Experimentation | Paywall copy, season themes, prompt versions and avatar styles must be configurable. | MVP проверяет гипотезы, а не один вкус команды. |
| Observability | Generation failures, safety flags and funnel drops visible in dashboard. | Команда должна быстро понимать, где ломается loop. |
| Moderation | Report issue and admin review queue for strange outputs. | AI outputs будут ошибаться; нужен операционный контур. |
| Localization | MVP copy must support Russian and English copy structure even if launch language one. | Рынок мировой, но отчет и первый артефакт на русском. |

## 20. API And Backend Work Packages

| Пакет | Backend | Frontend | Definition of Done |
| --- | --- | --- | --- |
| Auth/Profile | Auth provider, consent, profile table, profile API. | Welcome, Privacy, Birth + State. | User can create profile and edit/delete personal data. |
| Season/Episode | Season table, episode generation endpoint, prompt versioning. | Season select, episode screen. | User starts season and receives Day 1 episode. |
| Action/Reset/Reflection | Action, reset_session, reflection APIs. | Action select, reset, done/reflection. | Completed loop is persisted. |
| Avatar/Life Canvas | Avatar generation queue, asset storage, provider logging. | Avatar pending/success/failure. | User sees causal avatar shift. |
| Memory/Recap | Archive endpoint, weekly recap generation. | Memory, weekly recap. | Day 7 recap generated from history. |
| Billing | RevenueCat integration, entitlement sync, paywall config. | Paywall, restore purchase, subscription state. | Trial/subscription unlocks paid features. |
| Analytics | Event collector or SDK config, event taxonomy. | Track all core events. | Funnels visible for activation, D1, D7, paywall. |
| Admin | Prompt editor, season templates, moderation queue. | Internal only. | Team can change prompts without app release. |

## 21. MVP Build Plan

| Период | Фокус | Что должно быть готово | Главный риск недели |
| --- | --- | --- | --- |
| Week 1 | Product/Figma/API foundation | Screen map, clickable Figma, entities, API contract, event taxonomy. | Слишком быстро уйти в красивый UI без causal loop. |
| Week 2 | Auth/Profile/Season | Onboarding, consent, profile, season templates, first backend schema. | Дата рождения и privacy могут стать friction point. |
| Week 3 | Episode/Action/Reset | Prompt v1, episode generation, action select, reset flow, reflection. | AI output слишком общий; нужен prompt QA. |
| Week 4 | Life Canvas / Avatar | Image-first avatar shift, asset storage, pending/failure states, cost logging. | Визуал красивый, но не причинный. |
| Week 5 | Paywall/Memory/Notifications | RevenueCat sandbox, memory archive, tomorrow hook, basic push. | Paywall рано или непонятно продает ценность. |
| Week 6 | QA/Concierge launch | Analytics dashboard, safety review, 30-50 test users, interview scripts. | Без ручных интервью цифры будут сложно интерпретировать. |

## 22. MVP Release Checklist

| Область | Проверка перед запуском |
| --- | --- |
| Product | 10-screen first loop implemented; Day 1 and Day 2 paths work; weekly recap can be mocked or generated. |
| Design | Figma covers all core screens, empty states, loading states, paywall, settings and error states. |
| Backend | Core entities and APIs exist; data deletion path exists; AI outputs versioned. |
| AI | Prompt versions, safety rules, fallback templates and provider costs logged. |
| Avatar | Image-first Life Canvas works with pending/success/failure states. |
| Analytics | Activation, action, reset, avatar, paywall and D1/D7 events tracked. |
| Billing | RevenueCat sandbox purchase, restore and entitlement work. |
| Validation | 20 interviews, 30-50 concierge users, first WTP test ready. |
| Not MVP | No daily video avatar, no social network, no marketplace, no public UGC. |

## 23. What Designer Needs Next

| Что нужно | Зачем |
| --- | --- |
| Clickable prototype | Собрать 15 экранов из Screen Map в Figma без финальной графики, но с реальными текстами и состояниями. |
| Life Canvas style directions | 3 визуальные системы: symbolic portrait, abstract canvas, cinematic self-scene. Выбрать через интервью. |
| Paywall copy variants | 3 варианта: season continuation, memory/archive, future-self visual evolution. |
| Empty/error states | Отрисовать pending avatar, failed generation, skipped day, no reflection, canceled subscription. |
| Trust layer | Privacy, data deletion, “not medical/psychological advice”, consent before date of birth. |
| Interview prototype | Версия, где респондент проходит Day 1 и объясняет, понял ли он ценность. |

## 24. What Engineering Needs Next

| Что нужно | Зачем |
| --- | --- |
| Architecture decision | React Native или Flutter; backend NestJS/FastAPI/Supabase; RevenueCat; Postgres; S3-compatible storage; analytics. |
| Provider decision | LLM для episode/action, image provider для Life Canvas, fallback templates, async queue. |
| Cost logging | Каждый AI/image call пишет provider, tokens/images, latency, estimated_cost. |
| Prompt registry | PromptVersion entity и admin-only publish, чтобы править качество без релиза. |
| Safety filters | Запрет diagnosis, medical claims, deterministic predictions, harmful advice, dependency-oriented companion behavior. |
| MVP dashboard | Activation, loop completion, avatar causality, D1, D7, trial intent, cost per active user. |

## 25. Interview And Prototype Validation Script

| Этап | Вопрос | Сигнал подтверждения | Что убивает гипотезу |
| --- | --- | --- | --- |
| Before prototype | Какие приложения или практики вы используете, когда хотите понять себя, успокоиться или собрать фокус? | Называет astrology/self-care/journaling/habit/AI tools. | Нет привычки искать такие решения вообще. |
| Before prototype | Когда вы в последний раз платили за похожий продукт и за что именно? | Платил за подписку, content depth, personalization, coach, meditation, AI. | Категорически не платит за digital self-care. |
| Welcome | Что вы ожидаете увидеть дальше? | Описывает сериал/эпизод/личный путь. | Думает, что это просто генератор картинок. |
| Profile | Какие поля вызывают доверие, а какие лишние? | Дата рождения допустима при объяснении. | Дата рождения блокирует вход даже после privacy. |
| Episode | Что в эпизоде звучит про вас, а что слишком общее? | Находит 1-2 личных попадания. | Все звучит как generic horoscope. |
| Action | Какое действие вы бы реально сделали сегодня? | Выбирает easy/normal action. | Все действия кажутся абстрактными или неловкими. |
| Avatar Shift | Почему, по-вашему, изменилась картинка? | Связывает с action/reflection. | Говорит “AI просто нарисовал”. |
| Paywall | За что здесь можно было бы платить? | Называет season, memory, recap, visual evolution. | Не видит платной ценности после completed loop. |
| After prototype | Что должно произойти завтра, чтобы вы вернулись? | Ждет продолжение истории. | Не понимает, зачем второй день. |
| After prototype | Кому бы вы это отправили и какими словами? | Может сформулировать оффер другу. | Не может объяснить продукт без помощи. |

## 26. Open Questions For Design And Engineering

| Вопрос | Решение v1 |
| --- | --- |
| Насколько явно показывать astrology/date-of-birth layer? | В прототипе держать мягко: дата рождения как symbolic input, не судьба. |
| Нужен ли face upload в MVP? | Нет. Начать с stylized future-self/Life Canvas без пользовательского лица, чтобы снизить privacy/deepfake risk. |
| Делать ли voice reset? | Could Have. Текстовый reset достаточно для MVP; voice можно добавить как premium/engagement test. |
| Когда показывать paywall? | Только после completed first loop или на Day 7 recap. Не до первого value moment. |
| Какой первый тариф? | Aura Plus $7.99-9.99/month или annual $39.99-59.99 как тест; visual tokens отдельно позже. |
| Какой главный go/no-go критерий? | Понимание causal loop + D1 return + WTP. Если avatar не считывается как причинный, продукт пересобирать. |

## 27. Final MVP Definition

AURA MVP - это не приложение “про астрологию” и не приложение “про аватары” отдельно. MVP должен проверить новую связку: пользователь дает минимальный личный контекст, получает эпизод дня, выбирает маленькое действие, проходит короткий reset, фиксирует результат и видит, как его Life Canvas/avatar меняется из-за выполненного действия.

Если эта причинность не считывается, продукт распадается на обычный AI horoscope, habit tracker или image generator. Если причинность считывается, появляется категория: личный сериал изменений, где смысл, действие, память и визуальный образ работают вместе.

Поэтому первый прототип должен быть жестко ограничен. Нужны 15 экранов, одна 7-дневная season loop, image-first Life Canvas, простая подписочная гипотеза и полный analytics layer. Видеоаватар, marketplace, community, AI companion и социальные механики должны ждать до тех пор, пока не доказаны activation, D1 return, D7 season completion и willingness to pay.
