# P0 Validation Execution Slice V1

Generated: 2026-05-31

## Зачем нужен этот слой

Этот слой превращает большую P0 очередь в исполнимую рабочую сессию. Он отвечает на вопрос: что делать первым, какой gate это двигает, какой минимум evidence нужно зафиксировать и когда можно апгрейдить или ослаблять claim. Это не новое доказательство, а маршрут к observed evidence.

## Порядок

1. Сначала закрыть hidden-clone риск через первые 5 manual walkthrough: без этого H1/H3 нельзя усиливать.
2. Потом добрать paid-flow signoff: H2 не должен опираться только на market size и proxy.
3. Затем провести P0 ICP recent-behavior вопросы: H5 требует реального поведения, а не демографии.
4. После этого запускать prototype loop: H4/H6 зависят от понимания причинности action -> progress/avatar.

## Execution Slice

| # | Блок | ID | Что проверяем | H | Timebox | Действие | Что сдвигает | Куда писать |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | Сначала hidden-clone walkthrough | P0_MANUAL_01 | Shepherd: Spiritual Bible BFF | H1<br>H3 | 25-35 min | открыть listing/app, сохранить 5 слотов скриншотов, записать full-loop/directness/causality verdict | двигает H1/H3: directness, hidden clone risk, action -> avatar/progress causality | data_processed/manual_competitor_inspection_packet.csv |
| 2 | Сначала hidden-clone walkthrough | P0_MANUAL_02 | Zing AI: Home & Gym Workouts | H1<br>H3 | 25-35 min | открыть listing/app, сохранить 5 слотов скриншотов, записать full-loop/directness/causality verdict | двигает H1/H3: directness, hidden clone risk, action -> avatar/progress causality | data_processed/manual_competitor_inspection_packet.csv |
| 3 | Сначала hidden-clone walkthrough | P0_MANUAL_03 | Miracle Morning Routine | H1<br>H3 | 25-35 min | открыть listing/app, сохранить 5 слотов скриншотов, записать full-loop/directness/causality verdict | двигает H1/H3: directness, hidden clone risk, action -> avatar/progress causality | data_processed/manual_competitor_inspection_packet.csv |
| 4 | Сначала hidden-clone walkthrough | P0_MANUAL_04 | EVOLVE: Transform Your Life | H1<br>H3 | 25-35 min | открыть listing/app, сохранить 5 слотов скриншотов, записать full-loop/directness/causality verdict | двигает H1/H3: directness, hidden clone risk, action -> avatar/progress causality | data_processed/manual_competitor_inspection_packet.csv |
| 5 | Сначала hidden-clone walkthrough | P0_MANUAL_05 | Daily Yoga: Yoga for Fitness® | H1<br>H3 | 25-35 min | открыть listing/app, сохранить 5 слотов скриншотов, записать full-loop/directness/causality verdict | двигает H1/H3: directness, hidden clone risk, action -> avatar/progress causality | data_processed/manual_competitor_inspection_packet.csv |
| 6 | Потом paid-flow/WTP evidence | P0_PAYWALL_02 | Character AI: Chat, Talk, Text | H2 | 10-15 min | проверить screenshot/source, подтвердить цену, trial, product-match и границу первого paywall | двигает H2: product-matched paid evidence, price/trial/paywall boundary | data_processed/web_paywall_visual_adjudication.csv |
| 7 | Потом paid-flow/WTP evidence | P0_PAYWALL_03 | Headspace: Sleep & Meditate | H2 | 10-15 min | проверить screenshot/source, подтвердить цену, trial, product-match и границу первого paywall | двигает H2: product-matched paid evidence, price/trial/paywall boundary | data_processed/web_paywall_visual_adjudication.csv |
| 8 | Потом paid-flow/WTP evidence | P0_PAYWALL_04 | Meditopia: Sleep & Meditation | H2 | 10-15 min | проверить screenshot/source, подтвердить цену, trial, product-match и границу первого paywall | двигает H2: product-matched paid evidence, price/trial/paywall boundary | data_processed/web_paywall_visual_adjudication.csv |
| 9 | Потом paid-flow/WTP evidence | P0_PAYWALL_05 | Nebula: Spiritual Guidance | H2 | 10-15 min | проверить screenshot/source, подтвердить цену, trial, product-match и границу первого paywall | двигает H2: product-matched paid evidence, price/trial/paywall boundary | data_processed/web_paywall_visual_adjudication.csv |
| 10 | Потом paid-flow/WTP evidence | P0_PAYWALL_08 | Carrom Pool: Disc Game | H2 | 10-15 min | проверить screenshot/source, подтвердить цену, trial, product-match и границу первого paywall | двигает H2: product-matched paid evidence, price/trial/paywall boundary | data_processed/web_paywall_visual_adjudication.csv |
| 11 | Затем ICP recent behavior | P0_ICP_ICP_A_T01 | Spiritual self-improvers / screener | H5<br>H6 | 20-30 min | спросить, какие приложения/ритуалы/дневники/коучи/avatar-tools участник использовал за 30 дней и что запустило последнее использование | двигает H5/H6: recent behavior, workaround, language, WTP, loop comprehension | data_processed/icp_validation_test_plan.csv |
| 12 | Затем ICP recent behavior | P0_ICP_ICP_A_T02 | Spiritual self-improvers / problem_interview | H5<br>H6 | 20-30 min | разобрать последний реальный эпизод, current workaround, эмоциональную ставку и точный язык боли | двигает H5/H6: recent behavior, workaround, language, WTP, loop comprehension | data_processed/icp_validation_test_plan.csv |
| 13 | Затем ICP recent behavior | P0_ICP_ICP_A_T03 | Spiritual self-improvers / prototype_loop | H5<br>H6 | 20-30 min | показать простую петлю meaning -> action -> reset -> avatar/progress -> tomorrow hook и попросить участника narrate flow | двигает H5/H6: recent behavior, workaround, language, WTP, loop comprehension | data_processed/icp_validation_test_plan.csv |
| 14 | Затем ICP recent behavior | P0_ICP_ICP_A_T04 | Spiritual self-improvers / positioning_test | H5<br>H6 | 20-30 min | сравнить current tool, generic habit/coach и Alina angle; записать, что участник выбрал бы первым и почему | двигает H5/H6: recent behavior, workaround, language, WTP, loop comprehension | data_processed/icp_validation_test_plan.csv |
| 15 | После этого prototype loop | P0_PROTO_ICP_A_S06_AVATAR_CHANGE | Spiritual self-improvers / S06_AVATAR_CHANGE | H4<br>H6 | 10-15 min | показать S01-S08 без объяснения, записать время, понимание, цитаты, trust objection и return intent | двигает H4/H6: comprehension, differentiation, trust, return intent | data_processed/prototype_validation_scorecard.csv |
| 16 | После этого prototype loop | P0_PROTO_ICP_D_S06_AVATAR_CHANGE | Habit and progress users / S06_AVATAR_CHANGE | H4<br>H6 | 10-15 min | показать S01-S08 без объяснения, записать время, понимание, цитаты, trust objection и return intent | двигает H4/H6: comprehension, differentiation, trust, return intent | data_processed/prototype_validation_scorecard.csv |
| 17 | После этого prototype loop | P0_SCORE_PVS_M01 | comprehension | H4<br>H6 | 5-10 min after sessions | после сессий посчитать observed value и gate status по этой метрике | двигает H4/H6: comprehension, differentiation, trust, return intent | data_processed/prototype_validation_scorecard.csv |
| 18 | После этого prototype loop | P0_SCORE_PVS_M02 | two_minute_completion | H4<br>H6 | 5-10 min after sessions | после сессий посчитать observed value и gate status по этой метрике | двигает H4/H6: comprehension, differentiation, trust, return intent | data_processed/prototype_validation_scorecard.csv |

## Правило апдейта

После каждой заполненной пачки observed rows нужно обновить capture sheets, пересчитать validation gates, пересобрать основной отчет/PDF/DOCX, затем обновить manifest и сделать commit/push. До этого все строки в этом slice являются задачами, а не доказанными claims.

## Files

- `data_processed/p0_validation_execution_slice.csv`
- `data_processed/global_next_validation_backlog.csv`
- `data_processed/p0_validation_command_center.csv`
