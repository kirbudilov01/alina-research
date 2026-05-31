# Русский P0 execution packet V1

Собрано: 2026-05-31T12:12:23.791Z

## Зачем нужен этот файл

Этот packet превращает validation OS в утренний порядок действий. Он не добавляет новых claims и не закрывает H1-H6. Его задача - показать, в какой последовательности выполнять ручную работу, какие evidence fields заполнять, где остановиться, что пересобрать и какие файлы обновить после наблюдаемого результата.

Главный принцип: сначала опасные blocker-spikes, потом расширение. Если ранний evidence противоречит гипотезе, отчет должен стать слабее, а не красивее.

## P0 порядок

| Seq | Tranche | Priority | Target | Rows | Minutes | Следующее действие |
| ---: | --- | --- | --- | ---: | --- | --- |
| 1 | TRANCHE_01_HIDDEN_CLONE_SPIKE | P0_blocker | Shepherd: Spiritual Bible BFF | 5 | 45-75 | Открыть Shepherd первым и заполнить 5 walkthrough slots до любых расширений. |
| 2 | TRANCHE_02_MANUAL_TOP5 | P0 | Shepherd: Spiritual Bible BFF/Zing AI: Home & Gym Workouts/Miracle Morning Routine/EVOLVE: Transform Your Life/Daily Yoga: Yoga for Fitness® | 25 | 180-300 | После Shepherd закрыть top-5 конкурентов одинаковой рубрикой, чтобы H1/H3 получили сопоставимый evidence. |
| 3 | TRANCHE_03_PAID_CONFIRMED_SPIKE | P0 | Character AI: Chat, Talk, Text/Meditopia: Sleep & Meditation | 8 | 60-90 | Проверить только product-matched paid surfaces; не усиливать H2 по parent/OCR/noise pages. |
| 4 | TRANCHE_04_ICP_PILOT | P0 | ICP_A and ICP_D / participants P01-P02 | 24 | 120-180 | Провести по 2 участника в ICP_A и ICP_D, записывая recent behavior и exact language. |
| 5 | TRANCHE_05_PROTOTYPE_PILOT | P0_blocker | ICP_A and ICP_D / participants P01-P02 / screens S01-S08 | 32 | 90-150 | Показать 8 экранов петли и особенно проверить S06 action -> avatar/progress causality. |
| 6 | TRANCHE_06_REDDIT_TOP25_LANGUAGE | P0 | Top 25 P0 Reddit/manual reading rows | 25 | 150-240 | Прочитать top-25 тредов как словарь проблем, не как количественное доказательство спроса. |

## 1. TRANCHE_01_HIDDEN_CLONE_SPIKE

**Цель:** Сначала проверить самый опасный public-listing сигнал: Shepherd выглядит как потенциальный hidden direct clone, поэтому его нужно разобрать до других приложений.

**Сделать сейчас:** Открыть Shepherd первым и заполнить 5 walkthrough slots до любых расширений.

**Evidence:** 5 screenshots: listing, onboarding, first action, progress/avatar feedback, paywall boundary; final verdict

**Success:** Shepherd классифицирован как full loop, adjacent loop, weak adjacency, blocked или hidden direct clone.

**Stop/downgrade:** Если Shepherd полностью владеет Alina loop с action->identity/avatar causality, H1/H3 немедленно downgrade до narrow/pivot wording.

**Briefing:** output/validation/2026-05-31/tranche_briefings/01__tranche-01-hidden-clone-spike__briefing.md

**Команды/строки:** P0_MANUAL_01: Shepherd: Spiritual Bible BFF | P0_MANUAL_02: Zing AI: Home & Gym Workouts | P0_MANUAL_03: Miracle Morning Routine | P0_MANUAL_04: EVOLVE: Transform Your Life | P0_MANUAL_05: Daily Yoga: Yoga for Fitness® | P0_MANUAL_06: Daily Burn: Workout Coach

**После tranche обновить:** data_processed/manual_walkthrough_capture_sheet.csv;data_processed/manual_competitor_inspection_packet.csv;data_processed/hypothesis_decision_matrix.csv. Rebuild: build:hypothesis-decision|build:completion-audit|build:ru-report|build:ru-pdf|build:evidence-manifest

## 2. TRANCHE_02_MANUAL_TOP5

**Цель:** Закрыть первые 5 P0 конкурентов, потому что gate требует минимум 5 приложений с полным walkthrough.

**Сделать сейчас:** После Shepherd закрыть top-5 конкурентов одинаковой рубрикой, чтобы H1/H3 получили сопоставимый evidence.

**Evidence:** 25 capture rows across five apps and five slots each

**Success:** Все 25 строк имеют observed answer, directness label, causality label, paywall label и notes.

**Stop/downgrade:** Любой full-loop competitor переводит whitespace claim в narrower/pivot language.

**Briefing:** output/validation/2026-05-31/tranche_briefings/02__tranche-02-manual-top5__briefing.md

**Команды/строки:** P0_MANUAL_01: Shepherd: Spiritual Bible BFF | P0_MANUAL_02: Zing AI: Home & Gym Workouts | P0_MANUAL_03: Miracle Morning Routine | P0_MANUAL_04: EVOLVE: Transform Your Life | P0_MANUAL_05: Daily Yoga: Yoga for Fitness® | P0_MANUAL_06: Daily Burn: Workout Coach

**После tranche обновить:** data_processed/manual_walkthrough_capture_sheet.csv;data_processed/manual_competitor_inspection_packet.csv;data_processed/validation_gate_calculator.csv. Rebuild: build:validation-gate-calculator|build:hypothesis-decision|build:completion-audit|build:report-draft|build:ru-report|build:ru-pdf

## 3. TRANCHE_03_PAID_CONFIRMED_SPIKE

**Цель:** Сначала проверить подтвержденные visible pricing rows, чтобы быстро отделить real paid surfaces от proxy noise.

**Сделать сейчас:** Проверить только product-matched paid surfaces; не усиливать H2 по parent/OCR/noise pages.

**Evidence:** pricing screenshot, product match, trial/price/plan depth, first paywall boundary

**Success:** Не меньше 6/8 строк получают confirm или conservative partial с human notes.

**Stop/downgrade:** Если confirmed rows оказываются unrelated/parent-only/OCR noise, H2 остается proxy-only и market-money wording сужается.

**Briefing:** output/validation/2026-05-31/tranche_briefings/03__tranche-03-paid-confirmed-spike__briefing.md

**Команды/строки:** P0_PAYWALL_01: The Sims™ FreePlay | P0_PAYWALL_02: Character AI: Chat, Talk, Text | P0_PAYWALL_03: Headspace: Sleep & Meditate | P0_PAYWALL_04: Meditopia: Sleep & Meditation | P0_PAYWALL_05: Nebula: Spiritual Guidance | P0_PAYWALL_06: Lords Mobile: Kingdom Wars

**После tranche обновить:** data_processed/paid_flow_capture_sheet.csv;data_processed/web_paywall_visual_adjudication.csv;data_processed/market_money_triangulation.csv. Rebuild: build:completion-audit|build:report-draft|build:ru-report|build:ru-pdf|build:evidence-manifest

## 4. TRANCHE_04_ICP_PILOT

**Цель:** Провести маленький pilot по двум сегментам до массового интервью, чтобы проверить язык, recent behavior и fatal objections.

**Сделать сейчас:** Провести по 2 участника в ICP_A и ICP_D, записывая recent behavior и exact language.

**Evidence:** recent behavior, last episode, workaround, pain score, concept preference, WTP, fatal objection, exact quote

**Success:** Хотя бы один участник в каждом сегменте дает concrete recent behavior и понятный language resonance.

**Stop/downgrade:** Если оба сегмента говорят только абстрактно или отвергают action-tied identity/progress, ICP claim не усиливается.

**Briefing:** output/validation/2026-05-31/tranche_briefings/04__tranche-04-icp-pilot__briefing.md

**Команды/строки:** P0_ICP_ICP_A_T01: Spiritual self-improvers / screener | P0_ICP_ICP_A_T02: Spiritual self-improvers / problem_interview | P0_ICP_ICP_A_T03: Spiritual self-improvers / prototype_loop | P0_ICP_ICP_A_T04: Spiritual self-improvers / positioning_test | P0_ICP_ICP_A_T05: Spiritual self-improvers / willingness_to_pay | P0_ICP_ICP_A_T06: Spiritual self-improvers / disconfirmation

**После tranche обновить:** data_processed/icp_interview_capture_sheet.csv;data_processed/icp_segment_matrix.csv;data_processed/icp_validation_test_plan.csv. Rebuild: build:icp-segments|build:hypothesis-decision|build:completion-audit|build:ru-report|build:ru-pdf

## 5. TRANCHE_05_PROTOTYPE_PILOT

**Цель:** Проверить самое хрупкое место: понимают ли люди causality между действием и avatar/progress feedback.

**Сделать сейчас:** Показать 8 экранов петли и особенно проверить S06 action -> avatar/progress causality.

**Evidence:** screen-by-screen paraphrase, completion time, comprehension, meaning lift, differentiation, return intent, trust objection

**Success:** PVS_M01/PVS_M04/PVS_M05 не получают kill evidence; участники понимают S06 causality без объяснения.

**Stop/downgrade:** Если avatar/progress читается как декоративная игра или манипуляция, H4/H6 остаются hold или pivot.

**Briefing:** output/validation/2026-05-31/tranche_briefings/05__tranche-05-prototype-pilot__briefing.md

**Команды/строки:** P0_PROTO_ICP_A_S01_ENTRY: Spiritual self-improvers / S01_ENTRY | P0_PROTO_ICP_A_S02_REFLECTION: Spiritual self-improvers / S02_REFLECTION | P0_PROTO_ICP_A_S03_ACTION_CARD: Spiritual self-improvers / S03_ACTION_CARD | P0_PROTO_ICP_A_S04_RESET: Spiritual self-improvers / S04_RESET | P0_PROTO_ICP_A_S05_COMPLETION: Spiritual self-improvers / S05_COMPLETION | P0_PROTO_ICP_A_S06_AVATAR_CHANGE: Spiritual self-improvers / S06_AVATAR_CHANGE

**После tranche обновить:** data_processed/prototype_session_capture_sheet.csv;data_processed/prototype_validation_scorecard.csv. Rebuild: build:validation-gate-calculator|build:hypothesis-decision|build:completion-audit|build:ru-report|build:ru-pdf

## 6. TRANCHE_06_REDDIT_TOP25_LANGUAGE

**Цель:** Быстро получить живой язык rejected patterns и alternatives, не превращая Reddit в ложный количественный спрос.

**Сделать сейчас:** Прочитать top-25 тредов как словарь проблем, не как количественное доказательство спроса.

**Evidence:** user job, named alternatives, rejected patterns, paid/WTP signal, safety boundary, Alina implication, quote permission

**Success:** 25 rows read; at least 10 useful language/pain insights with quote-use status explicitly set.

**Stop/downgrade:** Если top threads показывают, что users reject gamified identity/progress, prototype positioning must change before more sessions.

**Briefing:** output/validation/2026-05-31/tranche_briefings/06__tranche-06-reddit-top25-language__briefing.md

**Команды/строки:** см. briefing и capture sheets

**После tranche обновить:** data_processed/reddit_manual_reading_capture_sheet.csv;data_processed/evidence_claim_register.csv. Rebuild: build:evidence-audit|build:completion-audit|build:report-draft|build:ru-report|build:ru-pdf

## Файлы

- `data_processed/russian_p0_execution_packet.csv`
- `docs/decision/russian-p0-execution-packet-v1.md`
- `data_processed/validation_tranche_planner.csv`
- `data_processed/validation_tranche_briefing_index.csv`
- `data_processed/p0_validation_command_center.csv`
- `data_processed/russian_validation_gate_cards.csv`
