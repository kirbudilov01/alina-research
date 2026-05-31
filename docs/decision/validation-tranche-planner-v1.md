# Validation Tranche Planner V1

Generated: 2026-05-31T11:03:58.475Z

## Purpose

This planner turns the 850 prepared capture rows into an execution sequence. It is deliberately conservative: it starts with the highest-risk blockers, uses small spikes before broad capture, and requires claim/report rebuilds after observed evidence.

## Capture Universe

- Manual walkthrough capture rows: 60
- Paid-flow capture rows: 40
- ICP interview capture rows: 96
- Prototype session capture rows: 80
- Reddit/manual reading capture rows: 574
- Total capture rows: 850
- Scorecard metrics: 6
- Validation gates: 6

## Tranche Sequence

| Seq | Tranche | Priority | Workstream | Rows | Operator goal | Stop / downgrade rule |
| ---: | --- | --- | --- | ---: | --- | --- |
| 0 | TRANCHE_00_STOP_RULES | P0_guardrail | all | 0 | Зафиксировать, что validation tranche может не только усиливать идею, но и сузить, downgrade или kill claims. | Если результат показывает скрытого full-loop clone, отсутствие WTP, непонимание causality или fatal trust objection, отчет должен стать слабее. |
| 1 | TRANCHE_01_HIDDEN_CLONE_SPIKE | P0_blocker | manual_competitor_walkthrough | 5 | Сначала проверить самый опасный public-listing сигнал: Shepherd выглядит как потенциальный hidden direct clone, поэтому его нужно разобрать до других приложений. | Если Shepherd полностью владеет Alina loop с action->identity/avatar causality, H1/H3 немедленно downgrade до narrow/pivot wording. |
| 2 | TRANCHE_02_MANUAL_TOP5 | P0 | manual_competitor_walkthrough | 25 | Закрыть первые 5 P0 конкурентов, потому что gate требует минимум 5 приложений с полным walkthrough. | Любой full-loop competitor переводит whitespace claim в narrower/pivot language. |
| 3 | TRANCHE_03_PAID_CONFIRMED_SPIKE | P0 | paid_flow_validation | 8 | Сначала проверить подтвержденные visible pricing rows, чтобы быстро отделить real paid surfaces от proxy noise. | Если confirmed rows оказываются unrelated/parent-only/OCR noise, H2 остается proxy-only и market-money wording сужается. |
| 4 | TRANCHE_04_ICP_PILOT | P0 | icp_interviews | 24 | Провести маленький pilot по двум сегментам до массового интервью, чтобы проверить язык, recent behavior и fatal objections. | Если оба сегмента говорят только абстрактно или отвергают action-tied identity/progress, ICP claim не усиливается. |
| 5 | TRANCHE_05_PROTOTYPE_PILOT | P0_blocker | prototype_user_validation<br>prototype_scorecard_gate | 32 | Проверить самое хрупкое место: понимают ли люди causality между действием и avatar/progress feedback. | Если avatar/progress читается как декоративная игра или манипуляция, H4/H6 остаются hold или pivot. |
| 6 | TRANCHE_06_REDDIT_TOP25_LANGUAGE | P0 | reddit_manual_reading | 25 | Быстро получить живой язык rejected patterns и alternatives, не превращая Reddit в ложный количественный спрос. | Если top threads показывают, что users reject gamified identity/progress, prototype positioning must change before more sessions. |
| 7 | TRANCHE_07_EXPAND_AFTER_SPIKES | P1_after_spikes | manual<br>paid<br>icp<br>prototype<br>reddit | 236 | Расширять объем только после первых spikes. Если первые партии противоречат гипотезам, сначала обновить позиционирование и вопросы. | Do not continue broad capture if early evidence shows the core loop is misunderstood or already owned. |
| 8 | TRANCHE_08_PUBLICATION_REBUILD | P0_after_observed_evidence | reporting<br>provenance | 0 | Закрыть цикл evidence-first: результаты должны попасть в claims, русский отчет, PDF, manifest и GitHub. | If reports do not reflect changed evidence, publication is stale and cannot be used externally. |

## TRANCHE_00_STOP_RULES

- Sequence: 0
- Priority: P0_guardrail
- Workstream: all
- Linked gates: GATE_H1_MANUAL_PRODUCT_SHAPE|GATE_H3_MANUAL_WHITESPACE|GATE_H2_PAID_FLOW|GATE_H5_ICP_RECENT_BEHAVIOR|GATE_H4_PROTOTYPE_ADVANTAGE|GATE_H6_PRODUCT_CORE
- Row count: 0
- Target scope: Before any field execution
- Operator goal: Зафиксировать, что validation tranche может не только усиливать идею, но и сузить, downgrade или kill claims.
- Evidence to capture: stop/downgrade rules accepted before execution
- Success threshold: Каждый оператор знает: противоречащий evidence обновляет claim до следующего PDF.
- Stop/downgrade rule: Если результат показывает скрытого full-loop clone, отсутствие WTP, непонимание causality или fatal trust objection, отчет должен стать слабее.
- Output files to update: data_processed/evidence_claim_register.csv;data_processed/hypothesis_decision_matrix.csv;reports/alina-russian-narrative-report-v1.md
- Rebuild after tranche: no_rebuild_needed_until_observed_evidence

## TRANCHE_01_HIDDEN_CLONE_SPIKE

- Sequence: 1
- Priority: P0_blocker
- Workstream: manual_competitor_walkthrough
- Linked gates: GATE_H1_MANUAL_PRODUCT_SHAPE|GATE_H3_MANUAL_WHITESPACE
- Row count: 5
- Row ids sample: MCI_01_MCI_S01|MCI_01_MCI_S02|MCI_01_MCI_S03|MCI_01_MCI_S04|MCI_01_MCI_S05
- Target scope: Shepherd: Spiritual Bible BFF
- Operator goal: Сначала проверить самый опасный public-listing сигнал: Shepherd выглядит как потенциальный hidden direct clone, поэтому его нужно разобрать до других приложений.
- Evidence to capture: 5 screenshots: listing, onboarding, first action, progress/avatar feedback, paywall boundary; final verdict
- Success threshold: Shepherd классифицирован как full loop, adjacent loop, weak adjacency, blocked или hidden direct clone.
- Stop/downgrade rule: Если Shepherd полностью владеет Alina loop с action->identity/avatar causality, H1/H3 немедленно downgrade до narrow/pivot wording.
- Output files to update: data_processed/manual_walkthrough_capture_sheet.csv;data_processed/manual_competitor_inspection_packet.csv;data_processed/hypothesis_decision_matrix.csv
- Rebuild after tranche: build:hypothesis-decision|build:completion-audit|build:ru-report|build:ru-pdf|build:evidence-manifest

## TRANCHE_02_MANUAL_TOP5

- Sequence: 2
- Priority: P0
- Workstream: manual_competitor_walkthrough
- Linked gates: GATE_H1_MANUAL_PRODUCT_SHAPE|GATE_H3_MANUAL_WHITESPACE
- Row count: 25
- Row ids sample: MCI_01_MCI_S01|MCI_01_MCI_S02|MCI_01_MCI_S03|MCI_01_MCI_S04|MCI_01_MCI_S05|MCI_02_MCI_S01|MCI_02_MCI_S02|MCI_02_MCI_S03|MCI_02_MCI_S04|MCI_02_MCI_S05
- Target scope: Shepherd: Spiritual Bible BFF|Zing AI: Home & Gym Workouts|Miracle Morning Routine|EVOLVE: Transform Your Life|Daily Yoga: Yoga for Fitness®
- Operator goal: Закрыть первые 5 P0 конкурентов, потому что gate требует минимум 5 приложений с полным walkthrough.
- Evidence to capture: 25 capture rows across five apps and five slots each
- Success threshold: Все 25 строк имеют observed answer, directness label, causality label, paywall label и notes.
- Stop/downgrade rule: Любой full-loop competitor переводит whitespace claim в narrower/pivot language.
- Output files to update: data_processed/manual_walkthrough_capture_sheet.csv;data_processed/manual_competitor_inspection_packet.csv;data_processed/validation_gate_calculator.csv
- Rebuild after tranche: build:validation-gate-calculator|build:hypothesis-decision|build:completion-audit|build:report-draft|build:ru-report|build:ru-pdf

## TRANCHE_03_PAID_CONFIRMED_SPIKE

- Sequence: 3
- Priority: P0
- Workstream: paid_flow_validation
- Linked gates: GATE_H2_PAID_FLOW
- Row count: 8
- Row ids sample: PF_01_PF_S01|PF_01_PF_S02|PF_01_PF_S03|PF_01_PF_S04|PF_02_PF_S01|PF_02_PF_S02|PF_02_PF_S03|PF_02_PF_S04
- Target scope: Character AI: Chat, Talk, Text|Meditopia: Sleep & Meditation
- Operator goal: Сначала проверить подтвержденные visible pricing rows, чтобы быстро отделить real paid surfaces от proxy noise.
- Evidence to capture: pricing screenshot, product match, trial/price/plan depth, first paywall boundary
- Success threshold: Не меньше 6/8 строк получают confirm или conservative partial с human notes.
- Stop/downgrade rule: Если confirmed rows оказываются unrelated/parent-only/OCR noise, H2 остается proxy-only и market-money wording сужается.
- Output files to update: data_processed/paid_flow_capture_sheet.csv;data_processed/web_paywall_visual_adjudication.csv;data_processed/market_money_triangulation.csv
- Rebuild after tranche: build:completion-audit|build:report-draft|build:ru-report|build:ru-pdf|build:evidence-manifest

## TRANCHE_04_ICP_PILOT

- Sequence: 4
- Priority: P0
- Workstream: icp_interviews
- Linked gates: GATE_H5_ICP_RECENT_BEHAVIOR
- Row count: 24
- Row ids sample: ICP_A_T01_P01|ICP_A_T02_P01|ICP_A_T03_P01|ICP_A_T04_P01|ICP_A_T05_P01|ICP_A_T06_P01|ICP_A_T01_P02|ICP_A_T02_P02|ICP_A_T03_P02|ICP_A_T04_P02
- Target scope: ICP_A and ICP_D / participants P01-P02
- Operator goal: Провести маленький pilot по двум сегментам до массового интервью, чтобы проверить язык, recent behavior и fatal objections.
- Evidence to capture: recent behavior, last episode, workaround, pain score, concept preference, WTP, fatal objection, exact quote
- Success threshold: Хотя бы один участник в каждом сегменте дает concrete recent behavior и понятный language resonance.
- Stop/downgrade rule: Если оба сегмента говорят только абстрактно или отвергают action-tied identity/progress, ICP claim не усиливается.
- Output files to update: data_processed/icp_interview_capture_sheet.csv;data_processed/icp_segment_matrix.csv;data_processed/icp_validation_test_plan.csv
- Rebuild after tranche: build:icp-segments|build:hypothesis-decision|build:completion-audit|build:ru-report|build:ru-pdf

## TRANCHE_05_PROTOTYPE_PILOT

- Sequence: 5
- Priority: P0_blocker
- Workstream: prototype_user_validation|prototype_scorecard_gate
- Linked gates: GATE_H4_PROTOTYPE_ADVANTAGE|GATE_H6_PRODUCT_CORE
- Row count: 32
- Row ids sample: PVS_ICP_A_P01_S01_ENTRY|PVS_ICP_A_P01_S02_REFLECTION|PVS_ICP_A_P01_S03_ACTION_CARD|PVS_ICP_A_P01_S04_RESET|PVS_ICP_A_P01_S05_COMPLETION|PVS_ICP_A_P01_S06_AVATAR_CHANGE|PVS_ICP_A_P01_S07_TOMORROW_HOOK|PVS_ICP_A_P01_S08_VALUE_CHECK|PVS_ICP_A_P02_S01_ENTRY|PVS_ICP_A_P02_S02_REFLECTION
- Target scope: ICP_A and ICP_D / participants P01-P02 / screens S01-S08
- Operator goal: Проверить самое хрупкое место: понимают ли люди causality между действием и avatar/progress feedback.
- Evidence to capture: screen-by-screen paraphrase, completion time, comprehension, meaning lift, differentiation, return intent, trust objection
- Success threshold: PVS_M01/PVS_M04/PVS_M05 не получают kill evidence; участники понимают S06 causality без объяснения.
- Stop/downgrade rule: Если avatar/progress читается как декоративная игра или манипуляция, H4/H6 остаются hold или pivot.
- Output files to update: data_processed/prototype_session_capture_sheet.csv;data_processed/prototype_validation_scorecard.csv
- Rebuild after tranche: build:validation-gate-calculator|build:hypothesis-decision|build:completion-audit|build:ru-report|build:ru-pdf

## TRANCHE_06_REDDIT_TOP25_LANGUAGE

- Sequence: 6
- Priority: P0
- Workstream: reddit_manual_reading
- Linked gates: GATE_H5_ICP_RECENT_BEHAVIOR|GATE_H3_MANUAL_WHITESPACE
- Row count: 25
- Row ids sample: RRC_0001|RRC_0002|RRC_0003|RRC_0004|RRC_0005|RRC_0006|RRC_0007|RRC_0008|RRC_0009|RRC_0010
- Target scope: Top 25 P0 Reddit/manual reading rows
- Operator goal: Быстро получить живой язык rejected patterns и alternatives, не превращая Reddit в ложный количественный спрос.
- Evidence to capture: user job, named alternatives, rejected patterns, paid/WTP signal, safety boundary, Alina implication, quote permission
- Success threshold: 25 rows read; at least 10 useful language/pain insights with quote-use status explicitly set.
- Stop/downgrade rule: Если top threads показывают, что users reject gamified identity/progress, prototype positioning must change before more sessions.
- Output files to update: data_processed/reddit_manual_reading_capture_sheet.csv;data_processed/evidence_claim_register.csv
- Rebuild after tranche: build:evidence-audit|build:completion-audit|build:report-draft|build:ru-report|build:ru-pdf

## TRANCHE_07_EXPAND_AFTER_SPIKES

- Sequence: 7
- Priority: P1_after_spikes
- Workstream: manual|paid|icp|prototype|reddit
- Linked gates: GATE_H1_MANUAL_PRODUCT_SHAPE|GATE_H3_MANUAL_WHITESPACE|GATE_H2_PAID_FLOW|GATE_H5_ICP_RECENT_BEHAVIOR|GATE_H4_PROTOTYPE_ADVANTAGE|GATE_H6_PRODUCT_CORE
- Row count: 236
- Row ids sample: PF_03_PF_S01|PF_03_PF_S02|PF_03_PF_S03|PF_03_PF_S04|ICP_A_T01_P03|ICP_A_T02_P03|ICP_A_T03_P03|ICP_A_T04_P03|PVS_ICP_A_P03_S01_ENTRY|PVS_ICP_A_P03_S02_REFLECTION|PVS_ICP_A_P03_S03_ACTION_CARD|PVS_ICP_A_P03_S04_RESET|RRC_0026|RRC_0027|RRC_0028|RRC_0029
- Target scope: Only after Tranche 01-06 do not trigger downgrade/pivot
- Operator goal: Расширять объем только после первых spikes. Если первые партии противоречат гипотезам, сначала обновить позиционирование и вопросы.
- Evidence to capture: remaining high-value capture rows across lanes
- Success threshold: Gates move from not_started to pass_ready_for_review, hold_with_evidence, downgrade, or pivot with linked evidence.
- Stop/downgrade rule: Do not continue broad capture if early evidence shows the core loop is misunderstood or already owned.
- Output files to update: all capture sheets;data_processed/validation_gate_calculator.csv;data_processed/research_completion_audit.csv
- Rebuild after tranche: full_rebuild_and_commit

## TRANCHE_08_PUBLICATION_REBUILD

- Sequence: 8
- Priority: P0_after_observed_evidence
- Workstream: reporting|provenance
- Linked gates: GATE_H1_MANUAL_PRODUCT_SHAPE|GATE_H3_MANUAL_WHITESPACE|GATE_H2_PAID_FLOW|GATE_H5_ICP_RECENT_BEHAVIOR|GATE_H4_PROTOTYPE_ADVANTAGE|GATE_H6_PRODUCT_CORE
- Row count: 0
- Target scope: After any observed validation tranche
- Operator goal: Закрыть цикл evidence-first: результаты должны попасть в claims, русский отчет, PDF, manifest и GitHub.
- Evidence to capture: updated claims, gate status, PDF readback, git commit hash
- Success threshold: Repo clean after commit/push; report language matches observed evidence and boundaries.
- Stop/downgrade rule: If reports do not reflect changed evidence, publication is stale and cannot be used externally.
- Output files to update: data_processed/evidence_claim_register.csv;data_processed/research_completion_audit.csv;reports/alina-russian-narrative-report-v1.md;output/pdf/alina-russian-narrative-report-v1.pdf;data_processed/evidence_artifact_manifest.csv
- Rebuild after tranche: npm test|diff check|pdf readback|git commit|git push

## Claim Boundary

This is an execution planner, not validation evidence. It does not upgrade any hypothesis by itself. Only filled capture rows, saved screenshots, participant quotes, human signoff notes, and updated gate calculations can change H1-H6.

## Files

- `data_processed/validation_tranche_planner.csv`
- `docs/decision/validation-tranche-planner-v1.md`
