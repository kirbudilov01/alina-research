# ICP Validation Packet V1

Generated: 2026-05-31T04:32:14.494Z

## Purpose

This packet turns the directional ICP segment matrix into a validation workflow. It is designed to close the P0 ICP gate without adding new search-engine collection: recruit or manually source participants, run the same protocol across segments, and update the CSV with results.

## Primary Validation Decision

Start with the top two current segments: **Spiritual self-improvers** and **Habit and progress users**. The goal is not to prove both; the goal is to choose one primary ICP, one secondary ICP, or reject the current framing.

## Segment Priority

| Segment | Priority | Score | Sample Target | Core Job | Gate |
| --- | --- | ---: | --- | --- | --- |
| Spiritual self-improvers | P0_top_two | 10 | 8 interviews + 5 prototype sessions | Turn symbolic/personal meaning into one grounded action today. | 5 interviews or manual sessions show users trust the daily guidance enough to act on it. |
| Habit and progress users | P0_top_two | 10 | 8 interviews + 5 prototype sessions | Make vague growth concrete and keep momentum without streak anxiety. | Users prefer action-tied progress/identity feedback over a plain checklist or streak counter. |
| Anxious daily reset users | P1_compare | 9 | 4 interviews + 3 prototype sessions | Calm down quickly and return to the day with one manageable next step. | Prototype users complete the reset without feeling gamified, pressured, or clinically generic. |
| Cozy/casual progression users | P1_compare | 9 | 4 interviews + 3 prototype sessions | Return because progress feels gentle, visible, and emotionally rewarding. | Users read progression as self-growth feedback, not game chores or retention tricks. |
| Coaching professionals and structured growth users | P2_backstop | 9 | 2 interviews if early data is contradictory | Get structured guidance that turns intention into accountable practice. | Evidence separates consumer daily ritual use from B2B/career coaching demand. |
| Avatar identity builders | P2_backstop | 8 | 2 interviews if early data is contradictory | See a version of myself change as I make progress. | Manual inspection confirms avatar/identity products rarely make the visual self causally respond to a daily action. |

## Interview Protocol

Run 30 to 40 minutes per participant:

1. Screener and recent behavior: confirm the participant has used a relevant adjacent tool recently.
2. Last real episode: ask for a specific moment, trigger, workaround, and emotional stakes before showing Alina.
3. Prototype loop: show the two-minute flow and ask the participant to narrate it back.
4. Differentiation: compare Alina against the current tool and a generic habit/coach app.
5. Willingness to pay: ask about current paid behavior and rank paid-depth features.
6. Disconfirmation: actively ask what feels unsafe, generic, childish, manipulative, or not for them.

## Success Gates

- Primary ICP candidate: at least 6 of 8 top-segment participants match recent behavior, 5 of 8 recall a specific episode, and 4 of 5 prototype users understand the action-to-progress causality.
- Secondary ICP candidate: smaller but clear pull, with differentiated language and no fatal objections.
- Kill or pivot signal: participants like the concept only abstractly, cannot describe a real recent job, or interpret the loop as generic streak/gamification.

## Test Plan Matrix

| Test | Segment | Priority | Type | Metric | Success Signal |
| --- | --- | --- | --- | --- | --- |
| ICP_A_T01 | Spiritual self-improvers | P0_top_two | screener | recent_behavior_match=yes/no | Participant names recent behavior without being led and describes a recurring trigger. |
| ICP_A_T02 | Spiritual self-improvers | P0_top_two | problem_interview | specific_episode + workaround + pain_intensity_1_5 | Participant recalls a specific recent episode, existing workaround, and meaningful frustration or desire. |
| ICP_A_T03 | Spiritual self-improvers | P0_top_two | prototype_loop | comprehension=yes/no; meaning_lift_1_5; loop_completion | Participant understands causal action-to-progress link and says the feedback makes the action feel more meaningful. |
| ICP_A_T04 | Spiritual self-improvers | P0_top_two | positioning_test | preferred_concept; differentiation_1_5 | Alina angle wins or is clearly differentiated for the target job. |
| ICP_A_T05 | Spiritual self-improvers | P0_top_two | willingness_to_pay | current_paid_behavior=yes/no; acceptable_price_range; paid_feature_rank | Participant has paid recently or names a concrete paid upgrade that would be worth testing. |
| ICP_A_T06 | Spiritual self-improvers | P0_top_two | disconfirmation | fatal_objection=yes/no; top_objection | Risks are addressable through framing, control, recovery, or product boundaries. |
| ICP_D_T01 | Habit and progress users | P0_top_two | screener | recent_behavior_match=yes/no | Participant names recent behavior without being led and describes a recurring trigger. |
| ICP_D_T02 | Habit and progress users | P0_top_two | problem_interview | specific_episode + workaround + pain_intensity_1_5 | Participant recalls a specific recent episode, existing workaround, and meaningful frustration or desire. |
| ICP_D_T03 | Habit and progress users | P0_top_two | prototype_loop | comprehension=yes/no; meaning_lift_1_5; loop_completion | Participant understands causal action-to-progress link and says the feedback makes the action feel more meaningful. |
| ICP_D_T04 | Habit and progress users | P0_top_two | positioning_test | preferred_concept; differentiation_1_5 | Alina angle wins or is clearly differentiated for the target job. |
| ICP_D_T05 | Habit and progress users | P0_top_two | willingness_to_pay | current_paid_behavior=yes/no; acceptable_price_range; paid_feature_rank | Participant has paid recently or names a concrete paid upgrade that would be worth testing. |
| ICP_D_T06 | Habit and progress users | P0_top_two | disconfirmation | fatal_objection=yes/no; top_objection | Risks are addressable through framing, control, recovery, or product boundaries. |
| ICP_C_T01 | Anxious daily reset users | P1_compare | screener | recent_behavior_match=yes/no | Participant names recent behavior without being led and describes a recurring trigger. |
| ICP_C_T02 | Anxious daily reset users | P1_compare | problem_interview | specific_episode + workaround + pain_intensity_1_5 | Participant recalls a specific recent episode, existing workaround, and meaningful frustration or desire. |
| ICP_C_T03 | Anxious daily reset users | P1_compare | prototype_loop | comprehension=yes/no; meaning_lift_1_5; loop_completion | Participant understands causal action-to-progress link and says the feedback makes the action feel more meaningful. |
| ICP_C_T04 | Anxious daily reset users | P1_compare | positioning_test | preferred_concept; differentiation_1_5 | Alina angle wins or is clearly differentiated for the target job. |
| ICP_C_T05 | Anxious daily reset users | P1_compare | willingness_to_pay | current_paid_behavior=yes/no; acceptable_price_range; paid_feature_rank | Participant has paid recently or names a concrete paid upgrade that would be worth testing. |
| ICP_C_T06 | Anxious daily reset users | P1_compare | disconfirmation | fatal_objection=yes/no; top_objection | Risks are addressable through framing, control, recovery, or product boundaries. |
| ICP_E_T01 | Cozy/casual progression users | P1_compare | screener | recent_behavior_match=yes/no | Participant names recent behavior without being led and describes a recurring trigger. |
| ICP_E_T02 | Cozy/casual progression users | P1_compare | problem_interview | specific_episode + workaround + pain_intensity_1_5 | Participant recalls a specific recent episode, existing workaround, and meaningful frustration or desire. |
| ICP_E_T03 | Cozy/casual progression users | P1_compare | prototype_loop | comprehension=yes/no; meaning_lift_1_5; loop_completion | Participant understands causal action-to-progress link and says the feedback makes the action feel more meaningful. |
| ICP_E_T04 | Cozy/casual progression users | P1_compare | positioning_test | preferred_concept; differentiation_1_5 | Alina angle wins or is clearly differentiated for the target job. |
| ICP_E_T05 | Cozy/casual progression users | P1_compare | willingness_to_pay | current_paid_behavior=yes/no; acceptable_price_range; paid_feature_rank | Participant has paid recently or names a concrete paid upgrade that would be worth testing. |
| ICP_E_T06 | Cozy/casual progression users | P1_compare | disconfirmation | fatal_objection=yes/no; top_objection | Risks are addressable through framing, control, recovery, or product boundaries. |
| ICP_F_T01 | Coaching professionals and structured growth users | P2_backstop | screener | recent_behavior_match=yes/no | Participant names recent behavior without being led and describes a recurring trigger. |
| ICP_F_T02 | Coaching professionals and structured growth users | P2_backstop | problem_interview | specific_episode + workaround + pain_intensity_1_5 | Participant recalls a specific recent episode, existing workaround, and meaningful frustration or desire. |
| ICP_F_T03 | Coaching professionals and structured growth users | P2_backstop | prototype_loop | comprehension=yes/no; meaning_lift_1_5; loop_completion | Participant understands causal action-to-progress link and says the feedback makes the action feel more meaningful. |
| ICP_F_T04 | Coaching professionals and structured growth users | P2_backstop | positioning_test | preferred_concept; differentiation_1_5 | Alina angle wins or is clearly differentiated for the target job. |
| ICP_F_T05 | Coaching professionals and structured growth users | P2_backstop | willingness_to_pay | current_paid_behavior=yes/no; acceptable_price_range; paid_feature_rank | Participant has paid recently or names a concrete paid upgrade that would be worth testing. |
| ICP_F_T06 | Coaching professionals and structured growth users | P2_backstop | disconfirmation | fatal_objection=yes/no; top_objection | Risks are addressable through framing, control, recovery, or product boundaries. |
| ICP_B_T01 | Avatar identity builders | P2_backstop | screener | recent_behavior_match=yes/no | Participant names recent behavior without being led and describes a recurring trigger. |
| ICP_B_T02 | Avatar identity builders | P2_backstop | problem_interview | specific_episode + workaround + pain_intensity_1_5 | Participant recalls a specific recent episode, existing workaround, and meaningful frustration or desire. |
| ICP_B_T03 | Avatar identity builders | P2_backstop | prototype_loop | comprehension=yes/no; meaning_lift_1_5; loop_completion | Participant understands causal action-to-progress link and says the feedback makes the action feel more meaningful. |
| ICP_B_T04 | Avatar identity builders | P2_backstop | positioning_test | preferred_concept; differentiation_1_5 | Alina angle wins or is clearly differentiated for the target job. |
| ICP_B_T05 | Avatar identity builders | P2_backstop | willingness_to_pay | current_paid_behavior=yes/no; acceptable_price_range; paid_feature_rank | Participant has paid recently or names a concrete paid upgrade that would be worth testing. |
| ICP_B_T06 | Avatar identity builders | P2_backstop | disconfirmation | fatal_objection=yes/no; top_objection | Risks are addressable through framing, control, recovery, or product boundaries. |

## Files

- `data_processed/icp_validation_test_plan.csv`
- `data_processed/icp_segment_matrix.csv`
