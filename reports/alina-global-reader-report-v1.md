# Alina Research. Русская reader version

Собрано: 2026-05-31

## Что это за версия

Это читательская версия поверх большого evidence pack. Она нужна, чтобы пройти исследование как последовательный русский рассказ: идея, рынки, деньги, конкуренты, белое пятно, аудитория, продуктовая петля и следующий validation step. Тяжелые таблицы остаются в полном отчете и приложениях; здесь оставлены только числа, без которых выводы нельзя читать честно.

Короткий вывод: Alina стоит дальше проверять как мировую consumer-app гипотезу, но еще нельзя объявлять доказанным продуктом. Сейчас доказано не “мы нашли PMF”, а “у нас есть большая карта рынка, денег, конкурентов, аудитории и понятная очередь наблюдаемой проверки”.

## Сначала числа, чтобы не потеряться

Собрано 67,525 сырьевых строк и 36,694 global dedup строк. В manifest сейчас 518 локальных артефактов; missing=0. По пяти нишам direct app-store слой дает 13,117 строк, а all-source niche слой дает 43,144 строк. Эти числа отвечают на разные вопросы и не складываются в одно “количество приложений”.

| Направление | Роль в гипотезе Alina | Сколько данных | Как читать осторожно |
| --- | --- | --- | --- |
| Mindfulness / reset | состояние и reset | 2,550 direct app dedup; 9,803 all-source dedup | directional market evidence, не proof спроса |
| Avatar / identity | видимый образ изменения | 2,506 direct app dedup; 9,952 all-source dedup | directional market evidence, не proof спроса |
| Astrology / esoterics | личный смысл и персональные интерпретации | 2,206 direct app dedup; 2,657 all-source dedup | directional market evidence, не proof спроса |
| Coaching / self-improvement | действие и язык роста | 2,651 direct app dedup; 3,857 all-source dedup | directional market evidence, не proof спроса |
| Gaming / progression benchmark | механики прогресса и возврата | 3,204 direct app dedup; 16,875 all-source dedup | benchmark-only, не прямой TAM |

## Какая продуктовая ставка проверяется

Alina не должна быть еще одним habit tracker, meditation library, astrology feed или avatar toy. Рабочая ставка уже: короткая ежедневная петля, где личный смысл превращается в маленькое действие, действие поддерживается reset, а пользователь видит понятный progress или изменение образа себя. Ценность появляется только если человек понимает причинность: “я сделал маленький шаг, поэтому мой progress/avatar изменился”.

Поэтому главный риск не в том, что wellness рынок маленький. Он большой. Главный риск в другом: может оказаться, что нужная петля уже закрыта конкурентами, или что пользователю не нужна связка meaning -> action -> reset -> visible progress как единый продукт.

## Есть ли рынок и деньги

Денежная рамка поддерживает продолжение проверки: intersection SAM сейчас $202M, confidence-weighted SAM $80.8M. Это не forecast выручки Alina, а способ не спорить вслепую о масштабе. H2 сейчас ближе остальных к доказательному состоянию, но тоже не закрыта: 28 / 40 completed и 8 / 12 success.

Что можно сказать: в adjacent-рынках есть платные привычки, подписки и персональная глубина. Что нельзя сказать: “Alina точно заработает”, пока не проверены paid-flow границы и willingness-to-pay на самой продуктовой петле.

## Что видно по конкурентам

Конкуренты не опровергают идею, но и не доказывают ее. Они показывают, что пользователь уже решает куски задачи в разных категориях: reset отдельно, self-improvement отдельно, spiritual meaning отдельно, avatar/progress отдельно. Возможность Alina формулируется не как пустой рынок, а как проверяемая причинная связка.

| Архетип конкурентов | Сигнал в базе | Как читать |
| --- | --- | --- |
| manifestation_tool | 27 close/direct; 14 paid signals | карта соседних решений, не proof Alina |
| avatar_identity_coaching | 17 close/direct; 6 paid signals | карта соседних решений, не proof Alina |
| gamified_self_improvement | 12 close/direct; 8 paid signals | карта соседних решений, не proof Alina |
| astrology_guidance | 6 close/direct; 4 paid signals | карта соседних решений, не proof Alina |
| faith_devotional_habit | 6 close/direct; 3 paid signals | карта соседних решений, не proof Alina |

## Где может быть белое пятно

Белое пятно сейчас узкое: daily meaning -> tiny action -> reset -> visible identity/progress. Mindfulness и avatar/identity выглядят чище как зоны для проверки редкой full-loop связки. Astrology/esoterics и coaching дают сильный язык аудитории и деньги, но там выше риск плотной конкуренции. Gaming/progression полезен как benchmark механик, но не как прямой рынок Alina.

| Рынок | Что видно | Кто ближе | Первый ход |
| --- | --- | --- | --- |
| Mindfulness / reset | узкое белое пятно выглядит правдоподобно: full-loop candidates редки, но нужен P0 walkthrough | ICP_D: Habit and progress users / ICP_C: Anxious daily reset users | сначала проверить P0-аудиторию через recent behavior интервью, затем walkthrough high-risk конкурентов |
| Avatar / identity | узкое белое пятно выглядит правдоподобно: full-loop candidates редки, но нужен P0 walkthrough | ICP_E: Cozy/casual progression users / ICP_B: Avatar identity builders | использовать как compare-сегмент после P0 ICP и high-risk competitor walkthrough |
| Gaming / progression benchmark | использовать как источник механик прогресса и возврата, но не как прямое доказательство whitespace Alina | ICP_E: Cozy/casual progression users | взять progression/avatar/retention паттерны в прототип, но не использовать gaming как H3 proof |
| Coaching / self-improvement | рынок видим и плотен; whitespace claim слабый без нового ручного evidence | ICP_A: Spiritual self-improvers / ICP_D: Habit and progress users | сначала проверить P0-аудиторию через recent behavior интервью, затем walkthrough high-risk конкурентов |
| Astrology / esoterics | рынок видим и плотен; whitespace claim слабый без нового ручного evidence | ICP_A: Spiritual self-improvers | сначала проверить P0-аудиторию через recent behavior интервью, затем walkthrough high-risk конкурентов |

## Кто может быть первым пользователем

Рабочая аудитория описывается не возрастом и страной, а поведением: digital ritual users. Это люди, которые уже используют приложения, чтобы регулировать состояние, получать персональный смысл, возвращаться к практике, видеть прогресс и иногда платить за глубину. Первые два сегмента для проверки: Spiritual self-improvers и Habit and progress users.

У этого вывода жесткая граница: secondary VOC и Reddit/forum signals помогают говорить языком пользователя, но не заменяют recent-behavior интервью. H5 пока не доказана: 12 / 96 completed и 0 / 30 success.

## Что должен проверить MVP

MVP должен проверить не весь будущий продукт, а одну причинную сессию: entry в личный смысл, короткий контекстный prompt, одно приземленное действие, короткий reset, evidence сделанного шага, visible progress/avatar feedback и hook на завтра. Если участник не может своими словами объяснить, что изменилось и почему, H4/H6 нельзя усиливать.

Сейчас H4: 16 / 80 completed, 0 / 32 success. H6: 16 / 80 completed, 0 / 32 success. Это значит, что прототип готов к проверке, но не доказан пользователями.

## Текущий статус гипотез

Все шесть gates остаются в hold_validate. Это важная честность отчета: рынок, конкуренты, деньги и аудитория уже разложены, но observed validation еще не закрыла walkthrough, интервью, prototype sessions и WTP.

| Гипотеза | Что проверяет | Где сейчас | Что нужно дальше |
| --- | --- | --- | --- |
| H1/H3 | форма продукта и whitespace | 12 / 60; 12 / 60 | manual app walkthrough P0 конкурентов |
| H2 | деньги и WTP | 28 / 40; success 8 / 12 | paid-flow boundary и WTP questions |
| H5 | аудитория | 12 / 96 | recent-behavior interviews |
| H4/H6 | преимущество и MVP-петля | 16 / 80; 16 / 80 | prototype sessions и scorecard |

## Что делать первым

Первая рабочая сессия уже сведена в P0 execution slice: 18 задач. Порядок: Сначала hidden-clone walkthrough -> Потом paid-flow/WTP evidence -> Затем ICP recent behavior -> После этого prototype loop. Это не новый proof, а маршрут к proof.

| # | Что проверить | H | Действие | Куда писать |
| --- | --- | --- | --- | --- |
| 1 | Shepherd: Spiritual Bible BFF | H1/H3 | открыть listing/app, сохранить 5 слотов скриншотов, записать full-loop/directness/causality verdict | data_processed/manual_competitor_inspection_packet.csv |
| 2 | Zing AI: Home & Gym Workouts | H1/H3 | открыть listing/app, сохранить 5 слотов скриншотов, записать full-loop/directness/causality verdict | data_processed/manual_competitor_inspection_packet.csv |
| 3 | Miracle Morning Routine | H1/H3 | открыть listing/app, сохранить 5 слотов скриншотов, записать full-loop/directness/causality verdict | data_processed/manual_competitor_inspection_packet.csv |
| 4 | EVOLVE: Transform Your Life | H1/H3 | открыть listing/app, сохранить 5 слотов скриншотов, записать full-loop/directness/causality verdict | data_processed/manual_competitor_inspection_packet.csv |
| 5 | Daily Yoga: Yoga for Fitness® | H1/H3 | открыть listing/app, сохранить 5 слотов скриншотов, записать full-loop/directness/causality verdict | data_processed/manual_competitor_inspection_packet.csv |
| 6 | Character AI: Chat, Talk, Text | H2 | проверить screenshot/source, подтвердить цену, trial, product-match и границу первого paywall | data_processed/web_paywall_visual_adjudication.csv |
| 7 | Headspace: Sleep & Meditate | H2 | проверить screenshot/source, подтвердить цену, trial, product-match и границу первого paywall | data_processed/web_paywall_visual_adjudication.csv |
| 8 | Meditopia: Sleep & Meditation | H2 | проверить screenshot/source, подтвердить цену, trial, product-match и границу первого paywall | data_processed/web_paywall_visual_adjudication.csv |

## Как читать термины

Ниже короткий словарь терминов, которые оставлены в отчете как рабочие labels. Полный словарь лежит отдельным CSV/MD, чтобы внешний читатель не спотыкался о технический язык.

| Термин | По-русски | Смысл |
| --- | --- | --- |
| evidence-first | сначала доказательства, потом вывод | Каждый сильный вывод должен иметь файл, строку, источник, capture row или наблюдение, а не только красивую гипотезу. |
| raw source rows | сырьевые строки источников | Все собранные строки до строгого удаления дублей: приложения, страницы, reviews, forum mentions и другие source records. |
| dedup | уникализация | Попытка убрать повторы одного и того же продукта или source-record в рамках выбранного scope. |
| TAM/SAM/SOM | рыночная рамка | TAM показывает большой рынок, SAM - достижимую часть вокруг идеи, SOM - осторожный сценарий возможной доли. |
| whitespace | белое пятно | Не пустой рынок, а место, где конкуренты могут не закрывать конкретную причинную петлю продукта. |
| gate / hold_validate | ворота решения / держать на проверке | Gate показывает, можно ли усиливать гипотезу. Hold_validate значит: данных достаточно для следующего теста, но не для финального go. |
| observed evidence | наблюдаемое доказательство | То, что реально зафиксировано руками: walkthrough, скриншот, интервью, цитата, prototype session, paywall boundary. |
| walkthrough | ручной проход продукта | Проверка приложения от первого экрана до первого value moment, действия, progress/avatar feedback и paywall. |

## Где лежит доказательная база

Эта reader version не заменяет полный evidence pack. Для проверки источников использовать полный отчет, source appendix, manifest, capture sheets и P0 execution slice. Самое важное правило: если в capture sheet нет строки наблюдения, скриншота, цитаты, цены или scorecard-метрики, claim не усиливается.

- `reports/alina-global-reader-report-v1.md`
- `reports/alina-global-hypothesis-report-v1.md`
- `reports/alina-global-executive-narrative-v1.md`
- `data_processed/russian_reader_glossary.csv`
- `docs/decision/russian-reader-glossary-v1.md`
- `data_processed/evidence_artifact_manifest.csv`
- `data_processed/p0_validation_execution_slice.csv`
- `data_processed/p0_observed_evidence_intake.csv`
