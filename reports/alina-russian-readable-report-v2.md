# Alina Research. Читаемая русская версия V2

Собрано: 2026-05-31T18:23:19.241Z

## Короткий вывод

Alina пока нельзя честно называть доказанным продуктом, но ее стоит продолжать исследовать. Вокруг идеи уже виден большой соседний рынок: люди платят за mindfulness, коучинг, astrology/spiritual guidance, аватары/AI companions и игровые механики прогресса. При этом сама возможность для Alina находится не в одной из этих категорий, а на пересечении: короткая ежедневная петля, где личный смысл превращается в одно действие, действие дает reset, а результат становится видимым через прогресс, идентичность или аватар.

Главное, что сейчас есть: 68,085 raw source rows, 37,176 dedup rows, 525 локальных артефакта в manifest и 90 первичных приложений в top-100 конкурентном разборе. Это уже не маленький ресерч на несколько тысяч строк. Но это все еще desk/source evidence, а не финальная пользовательская валидация. Поэтому вывод аккуратный: идея выглядит перспективной, но следующие решения должны приниматься после ручного walkthrough конкурентов, проверки paywall и коротких прототипных сессий.

## 1. Что мы проверяем

Исходная гипотеза простая: пользователю может быть нужен не отдельный трекер, не библиотека медитаций и не очередной аватар-генератор, а ежедневный цифровой ритуал изменения. В идеальном сценарии человек открывает приложение, получает персональное отражение дня, выбирает одно маленькое действие, быстро возвращает себя в рабочее состояние и видит, что прогресс или образ себя изменился именно из-за сделанного шага.

Поэтому исследование разложено на пять основных направлений. Mindfulness отвечает за reset и calm. Coaching/self-improvement отвечает за действие и структуру роста. Astrology/esoterics отвечает за личный смысл и символический язык. Avatar/identity отвечает за видимый образ изменения. Gaming/progression не считается прямым рынком Alina, но нужен как источник retention и прогресс-механик.

## 2. Сколько приложений и источников взяли по пяти направлениям

Ниже - самая важная таблица для ориентации. Здесь ровно пять рабочих направлений, а не технические подниши. Direct app/store rows показывают более близкий к конкурентам слой: App Store, Google Play/Android, desktop stores и browser extensions. Total dedup показывает весь cross-source слой, включая Steam/itch как benchmark механик и Reddit/forum как язык боли и контекст.

| Ниша | Direct app/store raw | Direct app/store dedup | Total dedup | Top-100 apps | Как читать |
| --- | ---: | ---: | ---: | ---: | --- |
| Mindfulness / reset | 6,766 | 2,550 | 9,723 | 21 | adjacent рынок для конкурентной карты |
| Avatar / identity | 5,770 | 2,506 | 7,944 | 49 | adjacent рынок для конкурентной карты |
| Astrology / esoterics | 4,946 | 2,206 | 2,657 | 59 | adjacent рынок для конкурентной карты |
| Coaching / self-improvement | 6,200 | 2,651 | 3,857 | 50 | adjacent рынок для конкурентной карты |
| Gaming / progression benchmark | 6,494 | 3,204 | 14,304 | 8 | benchmark механик, не прямой TAM |

Если смотреть только на более прямые source-native каналы приложений и витрин, там сейчас 30,176 raw rows и 11,334 dedup rows. Важно: direct app/store слой нужен для карты конкурентов, а общий total dedup нужен для насыщения discovery и поиска белого пятна. Эти два слоя нельзя смешивать в один claim.

По масштабу граница такая: raw 50k уже закрыт (68,085 строк), dedup 30k+ закрыт (37,176 строк), а dedup 50k остается целью следующего расширения (open, gap сохраняется). Поэтому правильная формулировка: у нас есть большая карта источников, но не 50k вручную проверенных прямых конкурентов.

## 3. Что видно по рынкам и деньгам

Деньги в соседних рынках видны, но пока как направленный сигнал. Сильнее всего выглядят astrology apps, AI/avatar identity и meditation/mindfulness. Digital coaching тоже важен, но требует более аккуратной проверки, потому что часть рынка уходит в B2B, human coaching и broad productivity.

| Рынок | SAM base | Dedup rows | Деньги | Top-100 apps | Вывод |
| --- | ---: | ---: | --- | ---: | --- |
| Mindfulness / reset | $252M | 9,723 | strong_directional_money_case | 21 | приоритетный adjacent рынок для manual sampling |
| Avatar / identity | $420M | 7,944 | strong_directional_money_case | 49 | приоритетный adjacent рынок для manual sampling |
| Astrology / esoterics | $374M | 2,657 | strong_directional_money_case | 59 | рынок важен, но crowded/unclear без walkthrough |
| Coaching / self-improvement | $300M | 3,857 | medium_directional_money_case | 50 | рынок важен, но crowded/unclear без walkthrough |
| Gaming / progression benchmark | $671M | 14,304 | benchmark_money_visible_not_direct_tam | 8 | mechanic benchmark, не direct TAM |

В текущей модели intersection SAM равен $202M. Это не прогноз выручки Alina. Это рабочая рамка: рядом есть достаточно большой платежный контекст, чтобы проверять продукт дальше. Сейчас 3 рынков имеют strong directional money case, 1 рынок имеет medium directional money case, а локальный paid-flow signoff заполнен на 28 строках. Самый важный нюанс: Character AI/c.ai+ подтверждает публичную платную поверхность в AI companion/avatar-identity зоне, а Meditopia подтверждает скорее B2B/EAP wellness pricing, не прямой consumer paywall.

## 4. Что видно по конкурентам

Конкурентная среда не пустая. В top-100 review сейчас 90 primary apps, из них 45 выглядят high-threat. Это значит, что пользователь уже решает части задачи через существующие приложения: медитации, привычки, коучинг, дневники, AI companions, astrology apps, avatar tools и игровые progress loops.

Но строгий сигнал полной петли Alina пока редкий: behavior-tied progression найден в 1/100 top-candidate rows. Это важный, но не финальный аргумент. Публичные листинги могут скрывать настоящую логику продукта внутри onboarding, первого действия или paywall, поэтому 12 P0 конкурентов вынесены в ручной walkthrough.

| Конкурент | Риск | Priority | Money proxy | Что проверить |
| --- | --- | ---: | --- | --- |
| Shepherd: Spiritual Bible BFF | прямой reference-риск | 162.8 | strong_bottom_up_money_proxy | проверить первым |
| Zing AI: Home & Gym Workouts | сильный платный close substitute | 112 | strong_bottom_up_money_proxy | проверить causality |
| Miracle Morning Routine | сильный платный close substitute | 111.4 | strong_bottom_up_money_proxy | проверить causality |
| EVOLVE: Transform Your Life | сильный платный close substitute | 106 | strong_bottom_up_money_proxy | проверить causality |
| Daily Yoga: Yoga for Fitness® | сильный платный close substitute | 99.2 | strong_bottom_up_money_proxy | проверить causality |
| Daily Burn: Workout Coach | сильный платный close substitute | 98 | strong_bottom_up_money_proxy | проверить causality |
| Myla : Manifest & Vision Board | высокий close-substitute риск | 97.6 | medium_bottom_up_money_proxy | проверить causality |
| Rosebud: AI Journal & Diary | высокий close-substitute риск | 97 | medium_bottom_up_money_proxy | проверить causality |
| Habit Tracker : Haby | высокий close-substitute риск | 95.8 | medium_bottom_up_money_proxy | проверить causality |
| Goddess・Women's Wellness Coach | высокий close-substitute риск | 95.8 | medium_bottom_up_money_proxy | проверить causality |
| LifeWheel Goal Habit Tracker | высокий close-substitute риск | 95.4 | medium_bottom_up_money_proxy | проверить causality |
| Habit Tracker | сильный платный close substitute | 94 | strong_bottom_up_money_proxy | проверить causality |

Самый опасный ранний конкурент - Shepherd: Spiritual Bible BFF. Если ручной walkthrough покажет, что он уже закрывает петлю meaning -> action -> reset -> visible identity/progress -> return, белое пятно придется резко сузить. Если нет, он останется важным reference competitor, но не убьет гипотезу.

## 5. Где может быть белое пятно

Белое пятно не в том, что на рынке нет медитаций, привычек, коучинга или аватаров. Они есть, и их много. Возможность появляется только в узкой комбинации: личное отражение дня должно превращаться в одно действие, действие должно быть достаточно маленьким, reset должен снижать трение, а avatar/progress должен меняться причинно, не декоративно.

| Ниша | Dedup rows | Full-loop rate | Opportunity | Как читать |
| --- | ---: | ---: | --- | --- |
| Mindfulness / reset | 9,723 | 3.82% | возможность есть, но нужна выборочная ручная проверка | H3 можно держать как narrow directional whitespace: full-loop-like кандидаты редки, но sampling обязателен. |
| Avatar / identity | 7,944 | 2.83% | возможность есть, но нужна выборочная ручная проверка | H3 можно держать как narrow directional whitespace: full-loop-like кандидаты редки, но sampling обязателен. |
| Astrology / esoterics | 2,657 | 13.70% | рынок видим, но claim о whitespace слабый без нового evidence | H3 не усиливать: плотность/контекст/прямота пока слишком неоднозначны. |
| Coaching / self-improvement | 3,857 | 13.02% | рынок видим, но claim о whitespace слабый без нового evidence | H3 не усиливать: плотность/контекст/прямота пока слишком неоднозначны. |
| Gaming / progression benchmark | 14,304 | 1.03% | механический benchmark, не основной whitespace | Не использовать как H3 proof. Это источник механик, а не доказательство рынка Alina. |

Пока сильнее всего выглядит не широкий claim “рынок пустой”, а более точная формулировка: полный цикл Alina в публичных данных встречается редко, особенно в mindfulness и avatar/identity, но это нужно подтвердить экранами. Gaming дает полезный язык прогресса, но его нельзя использовать как прямое доказательство рынка Alina.

## 6. Кто может быть аудиторией

Самая полезная аудитория сейчас описывается не демографией, а поведением: digital ritual users. Это люди, которые уже используют приложения, чтобы регулировать состояние, видеть движение вперед, чувствовать личный смысл, возвращаться к практике и иногда платить за глубину, персонализацию или поддержку.

| Сегмент | Приоритет | Score | Audience rows | Reddit rows | Core job |
| --- | --- | ---: | ---: | ---: | --- |
| Spiritual self-improvers | P0: начинать интервью и прототип с этого сегмента | 10 | 9,045 | 922 | Turn symbolic/personal meaning into one grounded action today. |
| Habit and progress users | P0: начинать интервью и прототип с этого сегмента | 10 | 8,444 | 1,891 | Make vague growth concrete and keep momentum without streak anxiety. |
| Anxious daily reset users | P1: использовать как сравнение после P0 | 9 | 8,444 | 1,010 | Calm down quickly and return to the day with one manageable next step. |
| Cozy/casual progression users | P1: использовать как сравнение после P0 | 9 | 7,426 | 666 | Return because progress feels gentle, visible, and emotionally rewarding. |
| Coaching professionals and structured growth users | P1: использовать как сравнение после P0 | 9 | 4,423 | 1,477 | Get structured guidance that turns intention into accountable practice. |
| Avatar identity builders | P1: использовать как сравнение после P0 | 8 | 7,794 | 663 | See a version of myself change as I make progress. |

Первые два сегмента для проверки: Spiritual self-improvers и Habit and progress users. Первый нужен, чтобы проверить personal meaning -> action. Второй нужен, чтобы проверить, может ли мягкий видимый прогресс заменить обычный checklist/streak pressure. Остальные сегменты полезны как сравнение, но выбирать primary ICP без интервью пока нельзя.

## 7. Как звучат боли пользователей

Reddit/forum слой сейчас дает 2,339 coded signal rows и 1,852 треда в manual reading queue. Это не репрезентативный опрос и не доказательство спроса. Его роль другая: дать язык проблем, альтернатив и возражений, чтобы интервью не были абстрактными.

| Тема | Signals | Вопрос для интервью |
| --- | ---: | --- |
| Видимый прогресс и доказательство, что действие помогает | 5,931 | Когда ты в последний раз бросил практику, потому что не видел, что она реально работает? |
| Персонализация и ощущение “меня увидели” | 4,743 | Какая персональная подсказка за последний месяц попала в точку, а какая показалась пустой или манипулятивной? |
| Ежедневный якорь и повторяемый ритуал | 3,234 | Расскажи про последний цифровой ритуал, к которому ты возвращался несколько дней подряд. Что именно заставляло открыть его снова? |
| Рекомендации, принадлежность и легкость рассказа другу | 2,431 | Как бы ты одним предложением объяснил другу, зачем это открыть завтра? |
| Перегруз, streak anxiety и тяжелые productivity-системы | 2,301 | Что в последнем self-improvement/productivity app стало слишком тяжелым или давящим? |
| Глубина, свежесть и кастомизация после первого value moment | 1,544 | За какую глубину в похожем продукте тебе было бы не жалко платить после первой бесплатной пользы? |
| Цена, подписка и доказательство ценности | 1,312 | За что ты уже платишь в этой зоне и что должно случиться бесплатно, чтобы подписка стала честной? |
| Доверие, безопасность и граница мягкого guidance | 1,263 | Что сделало бы такой продукт небезопасным, cringe, манипулятивным или не для тебя? |

Главный риск из этого слоя: пользователи могут отвергнуть продукт, если он покажется манипулятивным, слишком эзотерическим, слишком игровым или просто еще одним тяжелым self-improvement инструментом. Поэтому в прототипе надо проверять не только “понравилось ли”, а понял ли человек причинность петли и захотел ли бы вернуться завтра.

## 8. Каким сейчас выглядит продуктовое ядро

Рабочее ядро Alina сейчас можно описать так: “одно персональное отражение, одно маленькое действие, короткий reset, видимый причинный прогресс и мягкий следующий шаг”. Это достаточно узко, чтобы тестировать, и достаточно отличается от обычной библиотеки контента.

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

Слабое место этой петли - avatar/progress feedback. Если пользователь не понимает, что изменение связано с действием, это станет декоративной игрушкой. Если понимает и чувствует, что действие стало видимым, это может стать главным отличием Alina от meditation app, habit tracker и vague spiritual reading.

## 9. Что доказано и что еще открыто

На сегодня доказано как исследовательский слой: большая база источников, пять направлений, рыночная модель, конкурентные матрицы, whitespace map, ICP hypotheses, продуктовая петля и локальная трассируемость файлов. Не доказано как validation proof: что пользователи выберут Alina, что они поймут причинность avatar/progress, что готовы платить, и что конкуренты не закрывают этот цикл внутри приложения.

| Gate | Status | Need | Done | Success | Следующий шаг |
| --- | --- | ---: | ---: | ---: | --- |
| GATE_H1_MANUAL_PRODUCT_SHAPE | in_progress_insufficient_evidence | 60 | 12 | 0 | Capture onboarding, first action, progress/avatar feedback, and paywall screenshots for the highest-risk public-listing rows. |
| GATE_H3_MANUAL_WHITESPACE | in_progress_insufficient_evidence | 60 | 12 | 0 | Use the public-listing risk read to classify action->avatar causality in walkthrough as visible, inferred, absent, or blocked. |
| GATE_H2_PAID_FLOW | in_progress_insufficient_evidence | 48 | 28 | 8 | Use stress-test risk rows to prioritize paid-flow inspection and prototype willingness-to-pay questions. |
| GATE_H5_ICP_RECENT_BEHAVIOR | in_progress_insufficient_evidence | 96 | 12 | 0 | Use the ICP recruiting bridge to source top-two segment participants, execute the ICP validation packet, then update segment status and selected primary ICP. |
| GATE_H4_PROTOTYPE_ADVANTAGE | in_progress_insufficient_evidence | 80 | 16 | 0 | Run prototype sessions with the top two ICP segments and fill the scorecard with observed results. |
| GATE_H6_PRODUCT_CORE | in_progress_insufficient_evidence | 80 | 16 | 0 | Run prototype sessions and measure loop completion, comprehension, meaning lift, return intent, and paid-depth interest. |

Технический статус gates: GATE_H1_MANUAL_PRODUCT_SHAPE: in_progress_insufficient_evidence; GATE_H3_MANUAL_WHITESPACE: in_progress_insufficient_evidence; GATE_H2_PAID_FLOW: in_progress_insufficient_evidence; GATE_H5_ICP_RECENT_BEHAVIOR: in_progress_insufficient_evidence; GATE_H4_PROTOTYPE_ADVANTAGE: in_progress_insufficient_evidence; GATE_H6_PRODUCT_CORE: in_progress_insufficient_evidence. Если где-то уже есть локальные observed rows, это нужно читать как in-progress, а не как финальный pass. Для финального решения нужны одинаково заполненные capture rows, screenshots/quotes/scorecard values, пересборка отчета и сохранение в Git.

## 10. Что делать дальше

Следующий этап лучше не расширять бесконечно, а закрыть самые опасные проверки. Сначала пройти Shepherd и top-5 конкурентов: listing, onboarding, first action, progress/avatar feedback, paywall. Затем расширить paid-flow signoff по самым сильным money proxy. Затем провести короткий ICP pilot по Spiritual self-improvers и Habit/progress users. После этого показать прототипную петлю и проверить, понимают ли люди action -> avatar/progress causality.

Если первые проверки усиливают гипотезу, можно расширять sampling и делать PDF более внешним. Если Shepherd или другой P0 конкурент уже владеет полной петлей, отчет должен стать слабее и точнее. Если пользователи читают аватар как детскую декорацию или манипуляцию, продуктовую ставку нужно менять до дальнейшего масштабирования.

## Локальные файлы

- `reports/alina-russian-readable-report-v2.md`
- `output/pdf/alina-russian-readable-report-v2.pdf`
- `reports/alina-russian-narrative-report-v1.md`
- `output/pdf/alina-russian-narrative-report-v1.pdf`
- `data_processed/cross_source_universe_summary.csv`
- `data_processed/russian_readable_niche_summary.csv`
- `data_processed/russian_market_deep_dives.csv`
- `data_processed/russian_whitespace_decision_map.csv`
- `data_processed/russian_icp_battlecards.csv`
- `data_processed/validation_gate_calculator.csv`
