# Manual Competitor Inspection Packet V1

Generated: 2026-05-31T06:06:24.922Z

## Purpose

This packet turns the P0 human validation queue into a concrete inspection workflow for the highest-risk competitors. It does not claim the inspections have been completed. It defines which apps to inspect, what evidence to capture, and how the result should update whitespace and competitive-advantage claims.

## Packet Summary

- P0 apps selected for first inspection wave: 12
- Rubric dimensions: 6
- Apps with strong money proxy in selected set: 7
- Apps with prefilled behavior-tied progression claim: 1

Priority reasons:

- deep_review_language: 9
- strong_money_proxy: 7
- top_p0_validation_score: 4
- p0_queue_priority: 2
- only_current_direct_reference: 1
- metadata_claims_behavior_tied_progression: 1

## First Inspection Wave

| Rank | App | Prefill Verdict | Money Proxy | Behavior-Tied? | Why Inspect |
| ---: | --- | --- | --- | --- | --- |
| 1 | Shepherd: Spiritual Bible BFF | direct_reference_competitor | strong_bottom_up_money_proxy | yes | only_current_direct_reference/top_p0_validation_score/strong_money_proxy/metadata_claims_behavior_tied_progression/deep_review_language |
| 2 | Zing AI: Home & Gym Workouts | high_priority_close_substitute | strong_bottom_up_money_proxy | no | top_p0_validation_score/strong_money_proxy/deep_review_language |
| 3 | Miracle Morning Routine | high_priority_close_substitute | strong_bottom_up_money_proxy | no | top_p0_validation_score/strong_money_proxy/deep_review_language |
| 4 | EVOLVE: Transform Your Life | high_priority_close_substitute | strong_bottom_up_money_proxy | no | top_p0_validation_score/strong_money_proxy/deep_review_language |
| 5 | Daily Yoga: Yoga for Fitness® | high_priority_close_substitute | strong_bottom_up_money_proxy | no | strong_money_proxy |
| 6 | Daily Burn: Workout Coach | high_priority_close_substitute | strong_bottom_up_money_proxy | no | strong_money_proxy/deep_review_language |
| 7 | Myla : Manifest & Vision Board | high_priority_close_substitute | medium_bottom_up_money_proxy | no | deep_review_language |
| 8 | Rosebud: AI Journal & Diary | high_priority_close_substitute | medium_bottom_up_money_proxy | no | deep_review_language |
| 9 | Habit Tracker : Haby | high_priority_close_substitute | medium_bottom_up_money_proxy | no | p0_queue_priority |
| 10 | Goddess・Women's Wellness Coach | high_priority_close_substitute | medium_bottom_up_money_proxy | no | deep_review_language |
| 11 | LifeWheel Goal Habit Tracker | high_priority_close_substitute | medium_bottom_up_money_proxy | no | p0_queue_priority |
| 12 | Habit Tracker | high_priority_close_substitute | strong_bottom_up_money_proxy | no | strong_money_proxy/deep_review_language |

## Rubric

| ID | Dimension | Pass Definition | Downgrade Trigger | Claim Effect |
| --- | --- | --- | --- | --- |
| MCI_R01 | directness | App clearly combines personal meaning, one daily action, short reset/reflection, progress or identity feedback, and next-day hook. | Only one or two primitives are visible, or the loop is scattered across unrelated features. | Confirming directness strengthens H1/H3; downgrading protects whitespace from overclaim. |
| MCI_R02 | action_to_avatar_causality | Completed user action visibly changes avatar, identity object, future-self state, or progress representation. | Avatar/progress is decorative, static, generic, or only a profile asset. | This is the core whitespace test for behavior-tied avatar progression. |
| MCI_R03 | first_value_before_paywall | User can experience meaningful loop value before subscription, credits, trial wall, or account lock. | Paywall blocks first meaningful output or hides the loop. | Feeds monetization/readiness risk and prototype pricing strategy. |
| MCI_R04 | positioning_overlap | Public/onboarding copy directly targets daily transformation, identity, ritual, emotional reset, or guided action. | Copy is generic wellness, content library, one-off avatar generation, or broad coaching without daily ritual. | Refines competitive messaging and ICP fit. |
| MCI_R05 | safety_and_trust | Claims are framed softly with user agency and no deterministic/clinical overclaim. | Manipulative streak pressure, spiritual certainty, unsafe advice, or deceptive pricing. | Feeds product safety boundaries and differentiation. |
| MCI_R06 | hidden_clone_risk | No inspected P0 app fully owns the same integrated loop with strong execution. | A competitor already delivers the full Alina loop with clear action->identity feedback. | If triggered, H3/H4 must be downgraded and positioning/product core revised. |

## Required Evidence

- Capture 3-5 screenshots per app: listing/positioning, onboarding, first action, avatar/progress feedback, and paywall/free-boundary when visible.
- Record whether action -> avatar/identity causality is visible, inferred, absent, or blocked.
- Update `inspection_status`, `captured_screenshot_paths`, `inspector_notes`, and `final_verdict_after_inspection` in the packet CSV after review.
- If any app is a hidden direct clone, downgrade the whitespace claim and revise Alina positioning before final PDF.

## Files

- `data_processed/manual_competitor_inspection_packet.csv`
- `data_processed/manual_competitor_inspection_rubric.csv`
