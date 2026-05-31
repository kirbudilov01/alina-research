# Alina Research. Executive narrative

Собрано: 2026-05-31

## Короткий ответ

Alina стоит дальше проверять как мировую consumer-app гипотезу на пересечении personal meaning, tiny action, short reset и visible progress. Сейчас это не доказанный продукт и не финальный инвестиционный claim. Это большой evidence-first пакет, который показывает: вокруг идеи есть пять платежеспособных adjacent-направлений, заметная конкурентная плотность, рабочая TAM/SAM/SOM методология, предварительное whitespace-окно и понятная P0-очередь валидации.

Масштаб базы сейчас: 67,525 сырьевых source-строк, 36,694 уникализированных строк и 495 локальных артефактов в manifest. Главная граница: все шесть гипотез остаются в hold_validate, потому что observed evidence еще не закрыло walkthrough, интервью, prototype sessions и WTP.

## Логика продукта

Базовая ставка Alina не в том, чтобы сделать еще один habit tracker, meditation library, astrology app или avatar toy. Ставка уже иная: короткая ежедневная петля, где личный смысл превращается в маленькое действие, действие поддерживается reset, а потом пользователь видит причинный progress или identity feedback. Если причинность не видна, продукт разваливается на красивую декорацию. Если действия нет, он превращается в чтение. Если reset живет отдельно, это просто meditation content.

Поэтому главный вопрос не “есть ли большой wellness рынок”. Главный вопрос: можно ли доказать, что пользователю нужна именно связанная петля meaning -> action -> reset -> visible progress, и что конкуренты не закрывают ее уже внутри onboarding.

## Пять рынков

Рынок Alina нельзя честно свести к одной категории. Mindfulness дает reset и привычку платить за состояние. Coaching/self-improvement дает действие и язык роста. Astrology/esoterics дает personal meaning и willingness-to-pay за персональные интерпретации. Avatar/identity дает visible self-change. Gaming/progression нужен как benchmark механик возврата, но не как прямой TAM.

| Направление | Direct app dedup | All-source dedup | Top-100 apps | Как читать |
| --- | ---: | ---: | ---: | --- |
| Mindfulness / reset | 2,550 | 9,803 | 21 | сильный money proxy |
| Avatar / identity | 2,506 | 9,952 | 49 | сильный money proxy |
| Astrology / esoterics | 2,206 | 2,657 | 59 | сильный money proxy |
| Coaching / self-improvement | 2,651 | 3,857 | 50 | средний money proxy |
| Gaming / progression benchmark | 3,204 | 16,875 | 8 | benchmark, не прямой TAM |

Текущая intersection SAM-модель дает $202M base SAM и $80.8M confidence-weighted SAM. Это рамка для проверки, а не forecast выручки Alina. Gaming показывает большой money context, но остается benchmark mechanics, пока нет доказанного ritual/self-improvement overlap.

## Что видно по конкурентам

Конкурентная карта подтверждает не пустоту рынка, а обратное: пользователь уже решает части задачи через существующие приложения. Сильные группы сейчас: manifestation_tool: 27 close/direct, 14 paid signals; avatar_identity_coaching: 17 close/direct, 6 paid signals; gamified_self_improvement: 12 close/direct, 8 paid signals; astrology_guidance: 6 close/direct, 4 paid signals. Главная продуктовая возможность формулируется узко: не “конкурентов нет”, а “конкуренты часто закрывают части петли, но не доказывают полную причинную связку personal meaning -> action -> reset -> visible identity/progress”.

Одновременно competitor map нельзя читать механически. В taxonomy cleanup queue сейчас 8 строк, из них 6 suggested changes. Это значит, что часть AI companion / roleplay / tarot-oracle / habit-tracking классификаций требует ручного pass перед сильными конкурентными выводами.

## Где может быть whitespace

Самое полезное белое пятно сейчас не широкое, а причинное: короткая трансформационная петля с visible feedback. Mindfulness и avatar/identity выглядят чище по редкости full-loop candidates, но все равно требуют walkthrough. Astrology/esoterics и coaching выглядят сильнее по аудитории и деньгам, но там выше плотность конкурентов, поэтому claim о whitespace слабее без ручной проверки.

| Рынок | Full-loop rate | Whitespace read | ICP fit | Первый ход |
| --- | ---: | --- | --- | --- |
| Mindfulness / reset | 3.82% | узкое белое пятно выглядит правдоподобно: full-loop candidates редки, но нужен P0 walkthrough | ICP_D: Habit and progress users / ICP_C: Anxious daily reset users | сначала проверить P0-аудиторию через recent behavior интервью, затем walkthrough high-risk конкурентов |
| Avatar / identity | 2.83% | узкое белое пятно выглядит правдоподобно: full-loop candidates редки, но нужен P0 walkthrough | ICP_E: Cozy/casual progression users / ICP_B: Avatar identity builders | использовать как compare-сегмент после P0 ICP и high-risk competitor walkthrough |
| Gaming / progression benchmark | 1.03% | использовать как источник механик прогресса и возврата, но не как прямое доказательство whitespace Alina | ICP_E: Cozy/casual progression users | взять progression/avatar/retention паттерны в прототип, но не использовать gaming как H3 proof |
| Coaching / self-improvement | 13.02% | рынок видим и плотен; whitespace claim слабый без нового ручного evidence | ICP_A: Spiritual self-improvers / ICP_D: Habit and progress users | сначала проверить P0-аудиторию через recent behavior интервью, затем walkthrough high-risk конкурентов |
| Astrology / esoterics | 13.70% | рынок видим и плотен; whitespace claim слабый без нового ручного evidence | ICP_A: Spiritual self-improvers | сначала проверить P0-аудиторию через recent behavior интервью, затем walkthrough high-risk конкурентов |

## Аудитория и MVP

Рабочая аудитория пока описывается поведением, а не демографией: digital ritual users. Это люди, которые уже используют приложения, чтобы регулировать состояние, получать personal meaning, видеть прогресс, возвращаться к практике и иногда платить за depth или personalization. Два P0-сегмента для старта: Spiritual self-improvers и Habit and progress users. Первый проверяет доверие к personal meaning, второй - может ли action-tied progress заменить тяжелый checklist/streak pressure.

MVP не должен проверять весь будущий продукт. Он должен проверить одну причинную петлю: daily meaning entry -> tiny context prompt -> one grounded action -> short reset -> action evidence -> identity/avatar feedback -> next-day hook. Если участник не может своими словами объяснить, что изменилось и почему, H4/H6 нельзя усиливать.

## Статус доказательств

Текущий статус жесткий и честный: 6 / 6 gates остаются hold_validate. H1: 12 / 60 completed и 0 / 25 success; H3: 12 / 60 и 0 / 25; H2: 28 / 40 и 8 / 12; H5: 12 / 96 и 0 / 30; H4: 16 / 80 и 0 / 32; H6: 16 / 80 и 0 / 32.

Observed validation пока не закрывает claims: listing-only, secondary VOC и prototype-readiness помогают запустить проверку, но не заменяют app walkthrough, recent-behavior interviews, prototype sessions и willingness-to-pay evidence.

## Что делать дальше

Следующий скачок качества должен прийти не от бесконечного расширения desk research, а от observed rows. Правильный порядок: сначала hidden-clone walkthrough P0-конкурентов, затем paid-flow/WTP, затем P0 ICP interviews, затем prototype sessions. После каждого блока нужно обновлять capture sheets, gates, отчет, PDF и Git history.

| ID | H | Следующий шаг | Куда писать evidence |
| --- | --- | --- | --- |
| P0_MANUAL_01 | H1/H3 | открыть listing/app, сохранить 5 слотов скриншотов, записать full-loop/directness/causality verdict | data_processed/manual_competitor_inspection_packet.csv |
| P0_MANUAL_02 | H1/H3 | открыть listing/app, сохранить 5 слотов скриншотов, записать full-loop/directness/causality verdict | data_processed/manual_competitor_inspection_packet.csv |
| P0_MANUAL_03 | H1/H3 | открыть listing/app, сохранить 5 слотов скриншотов, записать full-loop/directness/causality verdict | data_processed/manual_competitor_inspection_packet.csv |
| P0_MANUAL_04 | H1/H3 | открыть listing/app, сохранить 5 слотов скриншотов, записать full-loop/directness/causality verdict | data_processed/manual_competitor_inspection_packet.csv |
| P0_MANUAL_05 | H1/H3 | открыть listing/app, сохранить 5 слотов скриншотов, записать full-loop/directness/causality verdict | data_processed/manual_competitor_inspection_packet.csv |
| P0_PAYWALL_02 | H2 | проверить screenshot/source, подтвердить цену, trial, product-match и границу первого paywall | data_processed/web_paywall_visual_adjudication.csv |
| P0_PAYWALL_03 | H2 | проверить screenshot/source, подтвердить цену, trial, product-match и границу первого paywall | data_processed/web_paywall_visual_adjudication.csv |
| P0_PAYWALL_04 | H2 | проверить screenshot/source, подтвердить цену, trial, product-match и границу первого paywall | data_processed/web_paywall_visual_adjudication.csv |

## Как читать этот документ

Это executive narrative поверх полного evidence pack. Он специально короче основного отчета, потому что readability audit показал: полный документ логичен, но перегружен таблицами (markdown_table_rows=186). Для решений использовать эту версию как входную историю, а полный отчет, manifest, source appendix и capture sheets - как доказательную базу.

## Файлы

- `reports/alina-global-executive-narrative-v1.md`
- `reports/alina-global-hypothesis-report-v1.md`
- `output/pdf/alina-global-executive-narrative-v1.pdf`
- `data_processed/evidence_artifact_manifest.csv`
- `data_processed/global_report_readability_audit.csv`
