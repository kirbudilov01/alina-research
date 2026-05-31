# P0 Observed Evidence Intake V1

Generated: 2026-05-31

## Зачем нужен этот слой

P0 execution slice показывает, что делать первым. Этот intake layer добавляет недостающий мост: какие именно source capture rows открыть, какие поля заполнить, какие локальные артефакты сохранить и какой rebuild сделать после observed evidence. Это не доказательство, а операторский вход в доказательство.

## Короткий статус

- P0 задач: 18
- Задач с привязанными capture IDs: 16
- Задач, где нужно сначала создать/добавить source capture row: 2
- Source rows to update в первой сессии: 51
- Manual walkthrough задач: 5
- Paid-flow задач: 5
- ICP interview задач: 4
- Prototype/scorecard задач: 4

## Intake Table

| # | P0 ID | Что проверяем | H | Source capture file | Capture IDs | Поля | Что еще не доказано |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | P0_MANUAL_01 | Shepherd: Spiritual Bible BFF | H1<br>H3 | data_processed/manual_walkthrough_capture_sheet.csv | MCI_01_MCI_S01<br>MCI_01_MCI_S02<br>MCI_01_MCI_S03<br>MCI_01_MCI_S04<br>MCI_01_MCI_S05 | capture_status; observed_answer; directness_label; action_to_avatar_causality_label; paywall_boundary_label; inspector_notes; screenshot file paths | есть незаполненные app/onboarding walkthrough слоты |
| 2 | P0_MANUAL_02 | Zing AI: Home & Gym Workouts | H1<br>H3 | data_processed/manual_walkthrough_capture_sheet.csv | MCI_02_MCI_S01<br>MCI_02_MCI_S02<br>MCI_02_MCI_S03<br>MCI_02_MCI_S04<br>MCI_02_MCI_S05 | capture_status; observed_answer; directness_label; action_to_avatar_causality_label; paywall_boundary_label; inspector_notes; screenshot file paths | есть незаполненные app/onboarding walkthrough слоты |
| 3 | P0_MANUAL_03 | Miracle Morning Routine | H1<br>H3 | data_processed/manual_walkthrough_capture_sheet.csv | MCI_03_MCI_S01<br>MCI_03_MCI_S02<br>MCI_03_MCI_S03<br>MCI_03_MCI_S04<br>MCI_03_MCI_S05 | capture_status; observed_answer; directness_label; action_to_avatar_causality_label; paywall_boundary_label; inspector_notes; screenshot file paths | есть незаполненные app/onboarding walkthrough слоты |
| 4 | P0_MANUAL_04 | EVOLVE: Transform Your Life | H1<br>H3 | data_processed/manual_walkthrough_capture_sheet.csv | MCI_04_MCI_S01<br>MCI_04_MCI_S02<br>MCI_04_MCI_S03<br>MCI_04_MCI_S04<br>MCI_04_MCI_S05 | capture_status; observed_answer; directness_label; action_to_avatar_causality_label; paywall_boundary_label; inspector_notes; screenshot file paths | есть незаполненные app/onboarding walkthrough слоты |
| 5 | P0_MANUAL_05 | Daily Yoga: Yoga for Fitness® | H1<br>H3 | data_processed/manual_walkthrough_capture_sheet.csv | MCI_05_MCI_S01<br>MCI_05_MCI_S02<br>MCI_05_MCI_S03<br>MCI_05_MCI_S04<br>MCI_05_MCI_S05 | capture_status; observed_answer; directness_label; action_to_avatar_causality_label; paywall_boundary_label; inspector_notes; screenshot file paths | есть незаполненные app/onboarding walkthrough слоты |
| 6 | P0_PAYWALL_02 | Character AI: Chat, Talk, Text | H2 | data_processed/paid_flow_capture_sheet.csv | PF_01_PF_S01<br>PF_01_PF_S02<br>PF_01_PF_S03<br>PF_01_PF_S04 | capture_status; observed_price_or_trial; paid_flow_label; product_match_label; human_notes; screenshot/source path | есть local/public signoff; остается проверить first-value boundary и WTP |
| 7 | P0_PAYWALL_03 | Headspace: Sleep & Meditate | H2 | data_processed/paid_flow_capture_sheet.csv |  | capture_status; observed_price_or_trial; paid_flow_label; product_match_label; human_notes; screenshot/source path | есть local/public signoff; остается проверить first-value boundary и WTP |
| 8 | P0_PAYWALL_04 | Meditopia: Sleep & Meditation | H2 | data_processed/paid_flow_capture_sheet.csv | PF_02_PF_S01<br>PF_02_PF_S02<br>PF_02_PF_S03<br>PF_02_PF_S04 | capture_status; observed_price_or_trial; paid_flow_label; product_match_label; human_notes; screenshot/source path | есть local/public signoff; остается проверить first-value boundary и WTP |
| 9 | P0_PAYWALL_05 | Nebula: Spiritual Guidance | H2 | data_processed/paid_flow_capture_sheet.csv |  | capture_status; observed_price_or_trial; paid_flow_label; product_match_label; human_notes; screenshot/source path | есть local/public signoff; остается проверить first-value boundary и WTP |
| 10 | P0_PAYWALL_08 | Carrom Pool: Disc Game | H2 | data_processed/paid_flow_capture_sheet.csv | PF_03_PF_S01<br>PF_03_PF_S02<br>PF_03_PF_S03<br>PF_03_PF_S04 | capture_status; observed_price_or_trial; paid_flow_label; product_match_label; human_notes; screenshot/source path | есть local/public signoff; остается проверить first-value boundary и WTP |
| 11 | P0_ICP_ICP_A_T01 | Spiritual self-improvers / screener | H5<br>H6 | data_processed/icp_interview_capture_sheet.csv | ICP_A_T01_P01<br>ICP_A_T01_P02 | capture_status; observed_answer_or_score; success_flag; fatal_objection_flag; exact_quote; researcher_notes | нужны реальные participant answers; secondary VOC не апгрейдит H5/H6 |
| 12 | P0_ICP_ICP_A_T02 | Spiritual self-improvers / problem_interview | H5<br>H6 | data_processed/icp_interview_capture_sheet.csv | ICP_A_T02_P01<br>ICP_A_T02_P02 | capture_status; observed_answer_or_score; success_flag; fatal_objection_flag; exact_quote; researcher_notes | нужны реальные participant answers; secondary VOC не апгрейдит H5/H6 |
| 13 | P0_ICP_ICP_A_T03 | Spiritual self-improvers / prototype_loop | H5<br>H6 | data_processed/icp_interview_capture_sheet.csv | ICP_A_T03_P01<br>ICP_A_T03_P02 | capture_status; observed_answer_or_score; success_flag; fatal_objection_flag; exact_quote; researcher_notes | нужны реальные participant answers; secondary VOC не апгрейдит H5/H6 |
| 14 | P0_ICP_ICP_A_T04 | Spiritual self-improvers / positioning_test | H5<br>H6 | data_processed/icp_interview_capture_sheet.csv | ICP_A_T04_P01<br>ICP_A_T04_P02 | capture_status; observed_answer_or_score; success_flag; fatal_objection_flag; exact_quote; researcher_notes | нужны реальные participant answers; secondary VOC не апгрейдит H5/H6 |
| 15 | P0_PROTO_ICP_A_S06_AVATAR_CHANGE | Spiritual self-improvers / S06_AVATAR_CHANGE | H4<br>H6 | data_processed/prototype_session_capture_sheet.csv | PVS_ICP_A_P01_S06_AVATAR_CHANGE<br>PVS_ICP_A_P02_S06_AVATAR_CHANGE | capture_status; observed_behavior; participant_paraphrase; success_signal_seen; failure_signal_seen; researcher_notes | нужна реальная prototype session; readiness signoff не апгрейдит H4/H6 |
| 16 | P0_PROTO_ICP_D_S06_AVATAR_CHANGE | Habit and progress users / S06_AVATAR_CHANGE | H4<br>H6 | data_processed/prototype_session_capture_sheet.csv | PVS_ICP_D_P01_S06_AVATAR_CHANGE<br>PVS_ICP_D_P02_S06_AVATAR_CHANGE | capture_status; observed_behavior; participant_paraphrase; success_signal_seen; failure_signal_seen; researcher_notes | нужна реальная prototype session; readiness signoff не апгрейдит H4/H6 |
| 17 | P0_SCORE_PVS_M01 | comprehension | H4<br>H6 | data_processed/prototype_validation_scorecard.csv | PVS_M01 | observed metric value; pass/hold/kill interpretation; participant count; notes linking back to prototype_session_capture_sheet.csv | считать только после prototype sessions, не до них |
| 18 | P0_SCORE_PVS_M02 | two_minute_completion | H4<br>H6 | data_processed/prototype_validation_scorecard.csv | PVS_M02 | observed metric value; pass/hold/kill interpretation; participant count; notes linking back to prototype_session_capture_sheet.csv | считать только после prototype sessions, не до них |

## Правило обновления

После заполнения любой intake-строки нельзя вручную переписать выводы в отчете. Сначала нужно обновить исходный capture sheet, затем пересчитать validation gates, completion audit, full report, reader/executive PDF, manifest, и только потом делать commit/push. Если evidence противоречит прежнему desk claim, claim ослабляется.

## Files

- `data_processed/p0_observed_evidence_intake.csv`
- `data_processed/p0_validation_execution_slice.csv`
- `data_processed/manual_walkthrough_capture_sheet.csv`
- `data_processed/paid_flow_capture_sheet.csv`
- `data_processed/icp_interview_capture_sheet.csv`
- `data_processed/prototype_session_capture_sheet.csv`
- `data_processed/prototype_validation_scorecard.csv`
