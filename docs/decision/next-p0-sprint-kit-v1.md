# Next P0 Sprint Kit V1

Generated: 2026-05-31T18:41:48.115Z

## Что это

Это операторский набор для первой observed-validation сессии. Он берет 18 P0 задач из intake и превращает их в отдельные карточки, чтобы walkthrough, paid-flow, ICP interview и prototype session можно было провести без блуждания по большому evidence pack.

Важно: kit не апгрейдит H1-H6. Он только снижает трение перед сбором наблюдаемого evidence. Гипотезы можно усиливать только после заполненных capture rows.

## Sprint Summary

- P0 cards: 18
- Blocks: 4
- Capture rows routed: 59
- Gates still hold: 6/6

| Блок | P0 tasks | Capture rows | Гипотезы |
| --- | ---: | ---: | --- |
| Сначала hidden-clone walkthrough | 5 | 25 | H1<br>H3 |
| Потом paid-flow/WTP evidence | 5 | 20 | H2 |
| Затем ICP recent behavior | 4 | 8 | H5<br>H6 |
| После этого prototype loop | 4 | 6 | H4<br>H6 |

## Карточки

| # | Command | Блок | Target | Capture file | Card |
| ---: | --- | --- | --- | --- | --- |
| 1 | P0_MANUAL_01 | Сначала hidden-clone walkthrough | Shepherd: Spiritual Bible BFF | data_processed/manual_walkthrough_capture_sheet.csv | output/validation/next_p0_sprint/01__P0_MANUAL_01__shepherd-spiritual-bible-bff.md |
| 2 | P0_MANUAL_02 | Сначала hidden-clone walkthrough | Zing AI: Home & Gym Workouts | data_processed/manual_walkthrough_capture_sheet.csv | output/validation/next_p0_sprint/02__P0_MANUAL_02__zing-ai-home-gym-workouts.md |
| 3 | P0_MANUAL_03 | Сначала hidden-clone walkthrough | Miracle Morning Routine | data_processed/manual_walkthrough_capture_sheet.csv | output/validation/next_p0_sprint/03__P0_MANUAL_03__miracle-morning-routine.md |
| 4 | P0_MANUAL_04 | Сначала hidden-clone walkthrough | EVOLVE: Transform Your Life | data_processed/manual_walkthrough_capture_sheet.csv | output/validation/next_p0_sprint/04__P0_MANUAL_04__evolve-transform-your-life.md |
| 5 | P0_MANUAL_05 | Сначала hidden-clone walkthrough | Daily Yoga: Yoga for Fitness® | data_processed/manual_walkthrough_capture_sheet.csv | output/validation/next_p0_sprint/05__P0_MANUAL_05__daily-yoga-yoga-for-fitness.md |
| 6 | P0_PAYWALL_02 | Потом paid-flow/WTP evidence | Character AI: Chat, Talk, Text | data_processed/paid_flow_capture_sheet.csv | output/validation/next_p0_sprint/06__P0_PAYWALL_02__character-ai-chat-talk-text.md |
| 7 | P0_PAYWALL_03 | Потом paid-flow/WTP evidence | Headspace: Sleep & Meditate | data_processed/paid_flow_capture_sheet.csv | output/validation/next_p0_sprint/07__P0_PAYWALL_03__headspace-sleep-meditate.md |
| 8 | P0_PAYWALL_04 | Потом paid-flow/WTP evidence | Meditopia: Sleep & Meditation | data_processed/paid_flow_capture_sheet.csv | output/validation/next_p0_sprint/08__P0_PAYWALL_04__meditopia-sleep-meditation.md |
| 9 | P0_PAYWALL_05 | Потом paid-flow/WTP evidence | Nebula: Spiritual Guidance | data_processed/paid_flow_capture_sheet.csv | output/validation/next_p0_sprint/09__P0_PAYWALL_05__nebula-spiritual-guidance.md |
| 10 | P0_PAYWALL_08 | Потом paid-flow/WTP evidence | Carrom Pool: Disc Game | data_processed/paid_flow_capture_sheet.csv | output/validation/next_p0_sprint/10__P0_PAYWALL_08__carrom-pool-disc-game.md |
| 11 | P0_ICP_ICP_A_T01 | Затем ICP recent behavior | Spiritual self-improvers / screener | data_processed/icp_interview_capture_sheet.csv | output/validation/next_p0_sprint/11__P0_ICP_ICP_A_T01__spiritual-self-improvers-screener.md |
| 12 | P0_ICP_ICP_A_T02 | Затем ICP recent behavior | Spiritual self-improvers / problem_interview | data_processed/icp_interview_capture_sheet.csv | output/validation/next_p0_sprint/12__P0_ICP_ICP_A_T02__spiritual-self-improvers-problem-interview.md |
| 13 | P0_ICP_ICP_A_T03 | Затем ICP recent behavior | Spiritual self-improvers / prototype_loop | data_processed/icp_interview_capture_sheet.csv | output/validation/next_p0_sprint/13__P0_ICP_ICP_A_T03__spiritual-self-improvers-prototype-loop.md |
| 14 | P0_ICP_ICP_A_T04 | Затем ICP recent behavior | Spiritual self-improvers / positioning_test | data_processed/icp_interview_capture_sheet.csv | output/validation/next_p0_sprint/14__P0_ICP_ICP_A_T04__spiritual-self-improvers-positioning-test.md |
| 15 | P0_PROTO_ICP_A_S06_AVATAR_CHANGE | После этого prototype loop | Spiritual self-improvers / S06_AVATAR_CHANGE | data_processed/prototype_session_capture_sheet.csv | output/validation/next_p0_sprint/15__P0_PROTO_ICP_A_S06_AVATAR_CHANGE__spiritual-self-improvers-s06-avatar-change.md |
| 16 | P0_PROTO_ICP_D_S06_AVATAR_CHANGE | После этого prototype loop | Habit and progress users / S06_AVATAR_CHANGE | data_processed/prototype_session_capture_sheet.csv | output/validation/next_p0_sprint/16__P0_PROTO_ICP_D_S06_AVATAR_CHANGE__habit-and-progress-users-s06-avatar-change.md |
| 17 | P0_SCORE_PVS_M01 | После этого prototype loop | comprehension | data_processed/prototype_validation_scorecard.csv | output/validation/next_p0_sprint/17__P0_SCORE_PVS_M01__comprehension.md |
| 18 | P0_SCORE_PVS_M02 | После этого prototype loop | two_minute_completion | data_processed/prototype_validation_scorecard.csv | output/validation/next_p0_sprint/18__P0_SCORE_PVS_M02__two-minute-completion.md |

## Правило пересборки

После заполнения карточек и source capture rows пересобрать validation gates, reports/PDF/DOCX, manifest и сделать commit/push. Не править финальные выводы вручную поверх старых CSV.

## Files

- `data_processed/next_p0_sprint_kit.csv`
- `output/validation/next_p0_sprint/README.md`
- `data_processed/p0_observed_evidence_intake.csv`
- `data_processed/p0_validation_execution_slice.csv`
