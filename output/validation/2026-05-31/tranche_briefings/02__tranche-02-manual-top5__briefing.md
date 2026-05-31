# TRANCHE_02_MANUAL_TOP5 Briefing

Generated: 2026-05-31T11:10:19.479Z

## Operator Goal

Закрыть первые 5 P0 конкурентов, потому что gate требует минимум 5 приложений с полным walkthrough.

## Scope

- Priority: P0
- Workstream: manual_competitor_walkthrough
- Target scope: Shepherd: Spiritual Bible BFF|Zing AI: Home & Gym Workouts|Miracle Morning Routine|EVOLVE: Transform Your Life|Daily Yoga: Yoga for Fitness®
- Capture rows in this briefing: 25
- Estimated operator time: 180-300 minutes
- Source files: data_processed/manual_walkthrough_capture_sheet.csv;data_processed/manual_competitor_inspection_packet.csv

## Success And Stop Rules

- Success threshold: Все 25 строк имеют observed answer, directness label, causality label, paywall label и notes.
- Stop/downgrade rule: Любой full-loop competitor переводит whitespace claim в narrower/pivot language.
- Rebuild after tranche: build:validation-gate-calculator|build:hypothesis-decision|build:completion-audit|build:report-draft|build:ru-report|build:ru-pdf

## Linked Gates

| Gate | Hypotheses | Status | Success | Kill / Downgrade |
| --- | --- | --- | --- | --- |
| GATE_H1_MANUAL_PRODUCT_SHAPE | H1 | not_started | At least five P0 apps have all five walkthrough slots classified without confirming a hidden full-loop clone. | Any P0 competitor clearly owns the full Alina loop with action->identity/avatar causality. |
| GATE_H3_MANUAL_WHITESPACE | H3 | not_started | Manual walkthrough confirms behavior-tied identity/avatar progression remains rare among high-risk substitutes. | Walkthrough reveals common full-loop substitutes or hidden clone risk is confirmed. |

## Capture Rows

| Capture ID | App | Slot | Question |
| --- | --- | --- | --- |
| MCI_01_MCI_S01 | Shepherd: Spiritual Bible BFF | app_store_listing_or_public_positioning | What promise, audience, and daily loop does the public listing imply? |
| MCI_01_MCI_S02 | Shepherd: Spiritual Bible BFF | onboarding_first_value_screen | Does onboarding show one coherent loop or separate feature shelves? |
| MCI_01_MCI_S03 | Shepherd: Spiritual Bible BFF | first_daily_action_or_task_screen | Is there a concrete action that can be completed in under two minutes? |
| MCI_01_MCI_S04 | Shepherd: Spiritual Bible BFF | progress_avatar_identity_feedback_screen | Does completion visibly change avatar, identity, or progress feedback? |
| MCI_01_MCI_S05 | Shepherd: Spiritual Bible BFF | first_paywall_or_iap_terms_screen | Is the first meaningful value before or after a subscription/trial wall? |
| MCI_02_MCI_S01 | Zing AI: Home & Gym Workouts | app_store_listing_or_public_positioning | What promise, audience, and daily loop does the public listing imply? |
| MCI_02_MCI_S02 | Zing AI: Home & Gym Workouts | onboarding_first_value_screen | Does onboarding show one coherent loop or separate feature shelves? |
| MCI_02_MCI_S03 | Zing AI: Home & Gym Workouts | first_daily_action_or_task_screen | Is there a concrete action that can be completed in under two minutes? |
| MCI_02_MCI_S04 | Zing AI: Home & Gym Workouts | progress_avatar_identity_feedback_screen | Does completion visibly change avatar, identity, or progress feedback? |
| MCI_02_MCI_S05 | Zing AI: Home & Gym Workouts | first_paywall_or_iap_terms_screen | Is the first meaningful value before or after a subscription/trial wall? |
| MCI_03_MCI_S01 | Miracle Morning Routine | app_store_listing_or_public_positioning | What promise, audience, and daily loop does the public listing imply? |
| MCI_03_MCI_S02 | Miracle Morning Routine | onboarding_first_value_screen | Does onboarding show one coherent loop or separate feature shelves? |
| MCI_03_MCI_S03 | Miracle Morning Routine | first_daily_action_or_task_screen | Is there a concrete action that can be completed in under two minutes? |
| MCI_03_MCI_S04 | Miracle Morning Routine | progress_avatar_identity_feedback_screen | Does completion visibly change avatar, identity, or progress feedback? |
| MCI_03_MCI_S05 | Miracle Morning Routine | first_paywall_or_iap_terms_screen | Is the first meaningful value before or after a subscription/trial wall? |
| MCI_04_MCI_S01 | EVOLVE: Transform Your Life | app_store_listing_or_public_positioning | What promise, audience, and daily loop does the public listing imply? |
| MCI_04_MCI_S02 | EVOLVE: Transform Your Life | onboarding_first_value_screen | Does onboarding show one coherent loop or separate feature shelves? |
| MCI_04_MCI_S03 | EVOLVE: Transform Your Life | first_daily_action_or_task_screen | Is there a concrete action that can be completed in under two minutes? |
| MCI_04_MCI_S04 | EVOLVE: Transform Your Life | progress_avatar_identity_feedback_screen | Does completion visibly change avatar, identity, or progress feedback? |
| MCI_04_MCI_S05 | EVOLVE: Transform Your Life | first_paywall_or_iap_terms_screen | Is the first meaningful value before or after a subscription/trial wall? |
| MCI_05_MCI_S01 | Daily Yoga: Yoga for Fitness® | app_store_listing_or_public_positioning | What promise, audience, and daily loop does the public listing imply? |
| MCI_05_MCI_S02 | Daily Yoga: Yoga for Fitness® | onboarding_first_value_screen | Does onboarding show one coherent loop or separate feature shelves? |
| MCI_05_MCI_S03 | Daily Yoga: Yoga for Fitness® | first_daily_action_or_task_screen | Is there a concrete action that can be completed in under two minutes? |
| MCI_05_MCI_S04 | Daily Yoga: Yoga for Fitness® | progress_avatar_identity_feedback_screen | Does completion visibly change avatar, identity, or progress feedback? |
| MCI_05_MCI_S05 | Daily Yoga: Yoga for Fitness® | first_paywall_or_iap_terms_screen | Is the first meaningful value before or after a subscription/trial wall? |

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

- `output/validation/2026-05-31/tranche_briefings/02__tranche-02-manual-top5__briefing.md`
