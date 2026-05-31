# Alina Research. Мировой рынок и логика гипотез

Собрано: 2026-05-31T14:58:04.771Z

## ОПИСАНИЕ ПРОЕКТА И ГИПОТЕЗА #1

Проект Alina рассматривается не как отдельный трекер привычек, не как очередная библиотека медитаций и не как декоративный avatar app. Базовая идея шире: создать ежедневный цифровой ритуал, в котором пользователь получает личное отражение дня, выбирает одно маленькое действие, проходит короткий reset и видит, что его прогресс или образ себя изменился именно из-за сделанного шага.

Логика продукта строится вокруг связки meaning -> action -> reset -> visible progress. В этой связке смысл не остается абстрактной интерпретацией, действие не превращается в тяжелую productivity-систему, reset не живет как отдельная медитация, а avatar/progress не является случайной косметикой. Ценность появляется только тогда, когда пользователь понимает причинность: я сделал маленький шаг, и поэтому мой образ прогресса изменился.

Гипотеза №1: на мировом consumer-app рынке есть место для приложения, которое объединяет личный смысл, короткое действие, reset и причинно видимый прогресс в одну ежедневную петлю. Эта гипотеза пока не доказана как product-market fit, но уже поддержана масштабной картой соседних рынков и конкурентных сигналов.

На текущем этапе собрано 67,525 raw source rows, 36,694 dedup rows и 454 локальных артефактов. Эти данные нужны не для того, чтобы объявить продукт доказанным, а для последовательной проверки: существует ли рынок, есть ли деньги, насколько плотна конкуренция, где может быть белое пятно, кто аудитория и какую MVP-петлю надо тестировать.

## ОПРЕДЕЛЕНИЕ МИРОВЫХ ЦЕЛЕВЫХ РЫНКОВ И ГИПОТЕЗА #2

Для проверки первой гипотезы исследование выделяет пять мировых направлений. Они не равны пяти отдельным продуктам: каждое направление отвечает за один слой будущей ценности Alina. Mindfulness дает reset и привычку платить за эмоциональное состояние. Coaching/self-improvement дает действие, структуру роста и язык прогресса. Astrology/esoterics дает личный смысл, символический контекст и willingness-to-pay за персональные интерпретации. Avatar/identity дает видимое отражение изменения. Gaming/progression используется как benchmark механик возврата, награды и прогресса, но не как прямой рынок Alina.

| Направление | Direct app/store dedup | Total dedup | Top-100 apps | Роль в гипотезе |
| --- | ---: | ---: | ---: | --- |
| Mindfulness / reset | 2,550 | 9,723 | 21 | adjacent рынок для конкурентной карты |
| Avatar / identity | 2,506 | 7,944 | 49 | adjacent рынок для конкурентной карты |
| Astrology / esoterics | 2,206 | 2,657 | 59 | adjacent рынок для конкурентной карты |
| Coaching / self-improvement | 2,651 | 3,857 | 50 | adjacent рынок для конкурентной карты |
| Gaming / progression benchmark | 3,204 | 14,304 | 8 | benchmark механик, не прямой TAM |

Гипотеза №2: мировые adjacent-рынки достаточно велики и монетизируемы, чтобы продолжать проверку Alina, но рыночные цифры должны читаться как sizing для направления, а не как прогноз выручки самого продукта.

| Рынок | SAM base | Money verdict | Score | Граница |
| --- | ---: | --- | ---: | --- |
| Mindfulness / reset | $252M | strong_directional_money_case | 9 | Можно использовать как directional evidence, но нельзя усиливать claim до product-market proof без walkthrough, paywall signoff и пользовательских сессий. |
| Avatar / identity | $420M | strong_directional_money_case | 10 | Можно использовать как directional evidence, но нельзя усиливать claim до product-market proof без walkthrough, paywall signoff и пользовательских сессий. |
| Astrology / esoterics | $374M | strong_directional_money_case | 9 | Можно использовать как directional evidence, но нельзя усиливать claim до product-market proof без walkthrough, paywall signoff и пользовательских сессий. |
| Coaching / self-improvement | $300M | medium_directional_money_case | 8 | Можно использовать как directional evidence, но нельзя усиливать claim до product-market proof без walkthrough, paywall signoff и пользовательских сессий. |
| Gaming / progression benchmark | $671M | benchmark_money_visible_not_direct_tam | 7 | Нельзя считать прямым рынком Alina без доказанного ritual/self-improvement overlap; использовать как механику прогресса и retention. |

Intersection SAM в текущей модели равен $202M. Это рабочая мировая рамка для дальнейшей проверки, а не обещание revenue. Локальный paid-flow signoff сейчас заполнен на 8 строках; H2 gate имеет статус in_progress_insufficient_evidence, потому что нужны еще in-app paywall walkthrough и willingness-to-pay evidence.

## СЦЕНАРИИ ВХОДА КАК СВЯЗУЮЩЕЕ ЗВЕНО

В отличие от образца по Telegram-mini-app, здесь сценарии входа не завязаны на один канал. Для Alina логичнее рассматривать несколько мировых consumer-entry сценариев. Первый сценарий - пользователь приходит из состояния тревоги, усталости или перегруза и ищет короткий reset. Второй сценарий - пользователь приходит из self-improvement контекста: он хочет двигаться вперед, но устал от жестких streak и сложных систем. Третий сценарий - пользователь приходит из spiritual/meaning контекста и хочет не просто читать интерпретацию, а превратить ее в действие. Четвертый сценарий - пользователь приходит через avatar/identity интерес и хочет видеть, что версия себя меняется. Пятый сценарий - пользователь возвращается через мягкую progression-механику, если она не выглядит как манипулятивная игра.

Таким образом, рынок Alina должен рассматриваться не по одному каналу входа, а как пересечение потребностей: состояние, смысл, действие, видимость прогресса и возвращаемость.

## ОПРЕДЕЛЕНИЕ КОНКУРЕНТОВ И ГИПОТЕЗА #3

Конкурентная среда подтверждает, что пользователь уже решает части задачи через существующие приложения. В top-100 review сейчас есть meditation apps, habit trackers, AI journals, spiritual guidance apps, avatar/identity apps и progression products. Рынок не пустой, поэтому сильная ставка Alina не может звучать как “конкурентов нет”. Ставка должна быть точнее: конкуренты закрывают отдельные части петли, но полная причинная связка meaning -> action -> reset -> visible identity/progress встречается редко и требует ручной проверки.

| Конкурент | Риск | Priority | Money proxy | Что проверить |
| --- | --- | ---: | --- | --- |
| Shepherd: Spiritual Bible BFF | прямой reference-риск | 162.8 | strong_bottom_up_money_proxy | проверить full-loop первым |
| Zing AI: Home & Gym Workouts | сильный платный close substitute | 112 | strong_bottom_up_money_proxy | проверить action -> progress causality |
| Miracle Morning Routine | сильный платный close substitute | 111.4 | strong_bottom_up_money_proxy | проверить action -> progress causality |
| EVOLVE: Transform Your Life | сильный платный close substitute | 106 | strong_bottom_up_money_proxy | проверить action -> progress causality |
| Daily Yoga: Yoga for Fitness® | сильный платный close substitute | 99.2 | strong_bottom_up_money_proxy | проверить action -> progress causality |
| Daily Burn: Workout Coach | сильный платный close substitute | 98 | strong_bottom_up_money_proxy | проверить action -> progress causality |
| Myla : Manifest & Vision Board | высокий close-substitute риск | 97.6 | medium_bottom_up_money_proxy | проверить action -> progress causality |
| Rosebud: AI Journal & Diary | высокий close-substitute риск | 97 | medium_bottom_up_money_proxy | проверить action -> progress causality |
| Habit Tracker : Haby | высокий close-substitute риск | 95.8 | medium_bottom_up_money_proxy | проверить action -> progress causality |
| Goddess・Women's Wellness Coach | высокий close-substitute риск | 95.8 | medium_bottom_up_money_proxy | проверить action -> progress causality |
| LifeWheel Goal Habit Tracker | высокий close-substitute риск | 95.4 | medium_bottom_up_money_proxy | проверить action -> progress causality |
| Habit Tracker | сильный платный close substitute | 94 | strong_bottom_up_money_proxy | проверить action -> progress causality |

Гипотеза №3: востребованным может стать не отдельный mindfulness, habit, astrology или avatar product, а связанная система, где смысл быстро превращается в действие, а действие становится видимым. Главный риск для этой гипотезы - скрытый прямой клон внутри onboarding P0-конкурентов, прежде всего Shepherd: Spiritual Bible BFF.

## ГДЕ ДЫРЫ И ВОЗМОЖНОСТЬ ОТЛИЧИТЬСЯ

| Направление | Full-loop rate | Opportunity | Как читать |
| --- | ---: | --- | --- |
| Mindfulness / reset | 3.82% | возможность есть, но нужна выборочная ручная проверка | H3 можно держать как narrow directional whitespace: full-loop-like кандидаты редки, но sampling обязателен. |
| Avatar / identity | 2.83% | возможность есть, но нужна выборочная ручная проверка | H3 можно держать как narrow directional whitespace: full-loop-like кандидаты редки, но sampling обязателен. |
| Astrology / esoterics | 13.70% | рынок видим, но claim о whitespace слабый без нового evidence | H3 не усиливать: плотность/контекст/прямота пока слишком неоднозначны. |
| Coaching / self-improvement | 13.02% | рынок видим, но claim о whitespace слабый без нового evidence | H3 не усиливать: плотность/контекст/прямота пока слишком неоднозначны. |
| Gaming / progression benchmark | 1.03% | механический benchmark, не основной whitespace | Не использовать как H3 proof. Это источник механик, а не доказательство рынка Alina. |

Наиболее перспективная формулировка белого пятна: не “новый wellness app”, а короткая трансформационная петля с причинным visual feedback. Если прогресс меняется произвольно, продукт станет декоративным avatar toy. Если действие никак не связано со смыслом, продукт станет обычным habit tracker. Если reset живет отдельно, продукт станет библиотекой практик. Поэтому отличие должно проверяться именно на связке, а не на отдельных функциях.

## АУДИТОРИЯ, ИНТЕРВЬЮ И ГИПОТЕЗА #4

На текущем этапе аудитория описывается не демографией, а поведением. Рабочее название - digital ritual users: люди, которые уже используют приложения, чтобы регулировать состояние, видеть движение вперед, получать личный смысл, возвращаться к практике и иногда платить за персонализацию, глубину или поддержку.

| Сегмент | Приоритет | Score | Core job |
| --- | --- | ---: | --- |
| Spiritual self-improvers | P0: начинать интервью и прототип с этого сегмента | 10 | Turn symbolic/personal meaning into one grounded action today. |
| Habit and progress users | P0: начинать интервью и прототип с этого сегмента | 10 | Make vague growth concrete and keep momentum without streak anxiety. |
| Anxious daily reset users | P1: использовать как сравнение после P0 | 9 | Calm down quickly and return to the day with one manageable next step. |
| Cozy/casual progression users | P1: использовать как сравнение после P0 | 9 | Return because progress feels gentle, visible, and emotionally rewarding. |
| Coaching professionals and structured growth users | P1: использовать как сравнение после P0 | 9 | Get structured guidance that turns intention into accountable practice. |
| Avatar identity builders | P1: использовать как сравнение после P0 | 8 | See a version of myself change as I make progress. |

Первые интервью и прототипные сессии нужно начинать с двух P0-сегментов: Spiritual self-improvers и Habit and progress users. Первый проверяет, доверяет ли пользователь personal meaning enough to act. Второй проверяет, может ли action-tied progress заменить обычный checklist или streak pressure.

Гипотеза №4: primary-аудитория Alina находится среди людей, которые уже имеют recent behavior вокруг daily ritual, progress, reset или personal meaning, и которым нужна не новая функция, а более короткий и связанный цикл изменения.

## КЛЮЧЕВЫЕ НАБЛЮДЕНИЯ И ВОПРОСЫ ДЛЯ ПРОВЕРКИ

| Тема | Signals | Вопрос для интервью |
| --- | ---: | --- |
| Ежедневный якорь и повторяемый ритуал | 3,234 | Расскажи про последний цифровой ритуал, к которому ты возвращался несколько дней подряд. Что именно заставляло открыть его снова? |
| Видимый прогресс и доказательство, что действие помогает | 5,931 | Когда ты в последний раз бросил практику, потому что не видел, что она реально работает? |
| Перегруз, streak anxiety и тяжелые productivity-системы | 2,301 | Что в последнем self-improvement/productivity app стало слишком тяжелым или давящим? |
| Персонализация и ощущение “меня увидели” | 4,743 | Какая персональная подсказка за последний месяц попала в точку, а какая показалась пустой или манипулятивной? |
| Доверие, безопасность и граница мягкого guidance | 1,263 | Что сделало бы такой продукт небезопасным, cringe, манипулятивным или не для тебя? |
| Глубина, свежесть и кастомизация после первого value moment | 1,544 | За какую глубину в похожем продукте тебе было бы не жалко платить после первой бесплатной пользы? |
| Цена, подписка и доказательство ценности | 1,312 | За что ты уже платишь в этой зоне и что должно случиться бесплатно, чтобы подписка стала честной? |
| Рекомендации, принадлежность и легкость рассказа другу | 2,431 | Как бы ты одним предложением объяснил другу, зачем это открыть завтра? |

Вопросы для следующей проверки должны быть прикладными, как в образце: какой последний цифровой ритуал человек реально использовал; что стало слишком тяжелым или давящим; за какую глубину он уже платит; какая персональная подсказка показалась точной; как он объяснил бы продукт другу; что сделало бы продукт небезопасным, cringe или манипулятивным.

## ИТОГОВАЯ МОДЕЛЬ ПРОДУКТА И ГИПОТЕЗА #5

По текущим данным продуктовая модель должна опираться на несколько столпов. Первый столп - персональное отражение дня, которое не выглядит generic motivation. Второй - одно маленькое действие, связанное со смыслом. Третий - короткий reset, который снижает трение перед действием. Четвертый - visible progress или avatar/identity feedback, который меняется причинно. Пятый - мягкий next-day hook без наказания и streak anxiety.

| Шаг | Экран | Роль | Что должно сработать |
| --- | --- | --- | --- |
| 1 | Daily meaning entry | Вход в личный смысл: пользователь должен почувствовать, что это не generic motivation и не жесткое предсказание. | Participant can explain why this is personal rather than generic content. |
| 2 | Tiny context prompt | Минимальный контекст: петля получает живую точку дня, но не превращается в длинный onboarding. | Participant supplies a concrete lived moment or emotional target. |
| 3 | One grounded action | Перевод смысла в действие: центральная проверка, что Alina не остается чтением или дневником. | Participant sees the action as doable and causally linked to the chosen theme. |
| 4 | Short reset | Снижение трения: reset должен помогать начать действие, а не выглядеть как отдельная медитация ради медитации. | Participant feels the reset makes action easier without feeling clinical. |
| 5 | Action evidence | Легкое доказательство действия: self-report должен быть достаточным и не ощущаться как контроль. | Participant accepts lightweight self-report as enough evidence. |
| 6 | Identity/avatar feedback | Причинная видимость прогресса: ключевой момент H4/H6, где действие должно объяснять изменение identity/avatar. | Participant understands action -> identity/avatar causality. |
| 7 | Next-day hook | Возврат без наказания: continuity должен поддерживать привычку без streak anxiety. | Participant wants to return and understands continuity. |
| 8 | Immediate value check | Проверка понимания: пользователь должен назвать интегрированную петлю своими словами. | Participant names the integrated loop in their own words. |

Гипотеза №5: устойчивый MVP возможен, если пользователь за одну короткую сессию понимает причинность петли, чувствует отличие от обычного tracker/meditation/reading app и может объяснить, зачем вернуться завтра. Пока это не доказано: нужны prototype sessions, scorecard и WTP-вопросы.

## СТОЛПЫ УВЕРЕННОСТИ И ОТКРЫТЫЕ РИСКИ

Первый столп уверенности - масштаб мирового adjacent landscape: база уже достаточно велика, чтобы видеть рынки и конкурентов. Второй - money proxy: в соседних категориях видны платные привычки. Третий - повторяющиеся pain themes: пользователи говорят о visible progress, personalization, daily anchor, subscription value и trust/safety. Четвертый - narrow whitespace: полная петля выглядит редкой, но только до ручной проверки.

Главные риски остаются открытыми. P0-конкуренты могут закрывать петлю внутри onboarding. Пользователи могут прочитать avatar/progress как детскую декорацию. Spiritual/meaning layer может вызвать недоверие или safety objection. Paywall может быть понятен в соседних рынках, но не в Alina. Поэтому следующий этап должен не украшать отчет, а собирать observed evidence.

## ИСТОЧНИКИ И ГРАНИЦЫ ДОКАЗАТЕЛЬСТВ

Ниже зафиксирована короткая связка claim -> evidence -> boundary для этой мировой версии отчета. Это не полный manifest всех файлов, а читательский слой: он показывает, какие утверждения можно читать как desk/source support, а какие нельзя усиливать без ручных walkthrough, интервью, прототипных сессий или WTP-проверки.

| Claim | Раздел | Статус | Метрика | Граница |
| --- | --- | --- | --- | --- |
| SRC_01_PROJECT_AND_SCALE | Описание проекта и гипотеза #1 | доказано как исследовательский слой | 67525 cross-source raw rows; 36694 cross-source dedup rows; 39 coverage cells; 11 strong and 12 medium source/market cells | Это source/discovery coverage, а не ручная проверка каждого конкурента и не proof спроса. |
| SRC_02_MARKET_SIZING | Определение мировых целевых рынков и гипотеза #2 | поддержано направленно, но не финальный revenue/WTP proof | 6 market rows; 3 strong and 1 medium directional money cases | Market reports часто broad-category/paywalled; использовать как range-based sizing, не как прогноз выручки Alina. |
| SRC_03_COMPETITORS | Определение конкурентов и гипотеза #3 | готово к проверке, gate открыт | 100 top-candidate rows; 90 primary apps; 12 P0 inspection targets; 12 public listings inspected | Public listings и scorecards не заменяют app/onboarding walkthrough screenshots. |
| SRC_04_WHITESPACE | Где дыры и возможность отличиться | поддержано направленно, но не финально доказано | 1/100 strict behavior-tied progression signals; 6 cross-source saturation markets; 2 benchmark-only markets; 12 P0 apps queued | Whitespace нельзя апгрейдить без manual walkthrough и final verdict_after_inspection. |
| SRC_05_AUDIENCE | Аудитория, интервью и гипотеза #4 | поддержано направленно, но не финально доказано | 20492 audience signal rows; 294 community/referral rows; 2339 coded Reddit mention rows; 1852 Reddit manual-read queue rows; 574 Reddit capture rows; 6 ICP segment hypotheses; 36 ICP validation tests; 24 ICP recruiting bridge rows | Audience rows и Reddit/forum signals не являются representative survey и не заменяют recent-behavior interviews. |
| SRC_06_PRODUCT_CORE | Итоговая модель продукта и гипотеза #5 | поддержано направленно, но не финально доказано | 12552 feature matrix rows; 100 product-core rows; 8 prototype screens | Product core не считается доказанным без заполненных prototype_session_capture_sheet и scorecard. |
| SRC_07_PROVENANCE | Источники и границы доказательств | доказано как исследовательский слой | 454 manifest artifacts; missing=0 | Manifest доказывает наличие файлов и хэши, но не заменяет содержательную валидацию claims. |

## БЫСТРЫЕ ВЫВОДЫ ДЛЯ СТРАТЕГИИ

1. Мировой рынок вокруг Alina есть, но его нельзя сводить к одному TAM: это пересечение mindfulness, coaching, astrology/spiritual guidance, avatar/identity и progression mechanics.
2. Продуктовая ставка должна быть узкой: ежедневная причинная петля, а не комбайн функций.
3. Самые важные проверки - hidden-clone walkthrough, paid-flow signoff, P0 ICP interviews и prototype sessions.
4. Отчет должен оставаться на русском языке, но описывать мировой рынок и глобальные consumer-app категории.
5. Финальный документ можно собирать в стиле предоставленного образца: гипотеза -> рынки -> конкуренты -> интервью -> уточнение гипотезы -> MVP -> вопросы -> вывод.

## Локальные файлы

- `reports/alina-global-hypothesis-report-v1.md`
- `output/pdf/alina-global-hypothesis-report-v1.pdf`
- `data_processed/global_hypothesis_source_appendix.csv`
- `reports/alina-russian-readable-report-v2.md`
- `data_processed/russian_readable_niche_summary.csv`
- `data_processed/validation_gate_calculator.csv`
