# TRANCHE_04_ICP_PILOT Briefing

Generated: 2026-05-31T11:10:19.479Z

## Operator Goal

Провести маленький pilot по двум сегментам до массового интервью, чтобы проверить язык, recent behavior и fatal objections.

## Scope

- Priority: P0
- Workstream: icp_interviews
- Target scope: ICP_A and ICP_D / participants P01-P02
- Capture rows in this briefing: 24
- Estimated operator time: 120-180 minutes
- Source files: data_processed/icp_interview_capture_sheet.csv;data_processed/icp_validation_test_plan.csv;data_processed/icp_segment_matrix.csv

## Success And Stop Rules

- Success threshold: Хотя бы один участник в каждом сегменте дает concrete recent behavior и понятный language resonance.
- Stop/downgrade rule: Если оба сегмента говорят только абстрактно или отвергают action-tied identity/progress, ICP claim не усиливается.
- Rebuild after tranche: build:icp-segments|build:hypothesis-decision|build:completion-audit|build:ru-report|build:ru-pdf

## Linked Gates

| Gate | Hypotheses | Status | Success | Kill / Downgrade |
| --- | --- | --- | --- | --- |
| GATE_H5_ICP_RECENT_BEHAVIOR | H5 | not_started | Top two ICP segments produce recent-behavior, language resonance, return-intent, and WTP signals. | No segment recalls a concrete use episode or all reject the action-tied identity/progress premise. |

## Capture Rows

| Capture ID | Segment | Participant | Test | Metric |
| --- | --- | --- | --- | --- |
| ICP_A_T01_P01 | Spiritual self-improvers | P01 | screener | recent_behavior_match=yes/no |
| ICP_A_T02_P01 | Spiritual self-improvers | P01 | problem_interview | specific_episode + workaround + pain_intensity_1_5 |
| ICP_A_T03_P01 | Spiritual self-improvers | P01 | prototype_loop | comprehension=yes/no; meaning_lift_1_5; loop_completion |
| ICP_A_T04_P01 | Spiritual self-improvers | P01 | positioning_test | preferred_concept; differentiation_1_5 |
| ICP_A_T05_P01 | Spiritual self-improvers | P01 | willingness_to_pay | current_paid_behavior=yes/no; acceptable_price_range; paid_feature_rank |
| ICP_A_T06_P01 | Spiritual self-improvers | P01 | disconfirmation | fatal_objection=yes/no; top_objection |
| ICP_A_T01_P02 | Spiritual self-improvers | P02 | screener | recent_behavior_match=yes/no |
| ICP_A_T02_P02 | Spiritual self-improvers | P02 | problem_interview | specific_episode + workaround + pain_intensity_1_5 |
| ICP_A_T03_P02 | Spiritual self-improvers | P02 | prototype_loop | comprehension=yes/no; meaning_lift_1_5; loop_completion |
| ICP_A_T04_P02 | Spiritual self-improvers | P02 | positioning_test | preferred_concept; differentiation_1_5 |
| ICP_A_T05_P02 | Spiritual self-improvers | P02 | willingness_to_pay | current_paid_behavior=yes/no; acceptable_price_range; paid_feature_rank |
| ICP_A_T06_P02 | Spiritual self-improvers | P02 | disconfirmation | fatal_objection=yes/no; top_objection |
| ICP_D_T01_P01 | Habit and progress users | P01 | screener | recent_behavior_match=yes/no |
| ICP_D_T02_P01 | Habit and progress users | P01 | problem_interview | specific_episode + workaround + pain_intensity_1_5 |
| ICP_D_T03_P01 | Habit and progress users | P01 | prototype_loop | comprehension=yes/no; meaning_lift_1_5; loop_completion |
| ICP_D_T04_P01 | Habit and progress users | P01 | positioning_test | preferred_concept; differentiation_1_5 |
| ICP_D_T05_P01 | Habit and progress users | P01 | willingness_to_pay | current_paid_behavior=yes/no; acceptable_price_range; paid_feature_rank |
| ICP_D_T06_P01 | Habit and progress users | P01 | disconfirmation | fatal_objection=yes/no; top_objection |
| ICP_D_T01_P02 | Habit and progress users | P02 | screener | recent_behavior_match=yes/no |
| ICP_D_T02_P02 | Habit and progress users | P02 | problem_interview | specific_episode + workaround + pain_intensity_1_5 |
| ICP_D_T03_P02 | Habit and progress users | P02 | prototype_loop | comprehension=yes/no; meaning_lift_1_5; loop_completion |
| ICP_D_T04_P02 | Habit and progress users | P02 | positioning_test | preferred_concept; differentiation_1_5 |
| ICP_D_T05_P02 | Habit and progress users | P02 | willingness_to_pay | current_paid_behavior=yes/no; acceptable_price_range; paid_feature_rank |
| ICP_D_T06_P02 | Habit and progress users | P02 | disconfirmation | fatal_objection=yes/no; top_objection |

## Fields To Fill

- capture_status
- observed_answer_or_score / observed_behavior / observed_price_or_trial
- success_flag or final label
- fatal_objection_flag or downgrade trigger
- exact_quote or visible text where relevant
- researcher_notes / inspector_notes / human_notes
- local screenshot or notes paths

## Claim Boundary

This briefing is not validation evidence. It only routes the operator to the right rows. Claims change only after the source capture rows are filled, linked to saved evidence, and rebuilt into gate/audit/report artifacts.

## File

- `output/validation/2026-05-31/tranche_briefings/04__tranche-04-icp-pilot__briefing.md`
