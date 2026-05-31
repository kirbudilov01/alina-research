# Validation Capture Sheets V1

Generated: 2026-05-31T06:58:43.490Z

## Purpose

These capture sheets turn the validation execution dashboard into fillable evidence rows. They do not claim validation has happened. They define exactly which screenshot, interview, prototype, and paid-flow observations must be collected before any P0 gate can graduate.

## Summary

- Manual walkthrough rows: 60
- Paid-flow rows: 40
- ICP interview rows: 96
- Prototype session rows: 80
- Total capture rows: 276

## Sheets

| Sheet | Rows | Purpose |
| --- | ---: | --- |
| data_processed/manual_walkthrough_capture_sheet.csv | 60 | P0 app/onboarding screenshot capture by app and slot. |
| data_processed/paid_flow_capture_sheet.csv | 40 | Human paid-flow signoff by app and evidence slot. |
| data_processed/icp_interview_capture_sheet.csv | 96 | Top-two ICP interview capture by participant and test. |
| data_processed/prototype_session_capture_sheet.csv | 80 | Two-minute prototype session observations by segment, participant, and screen. |

## Manual Walkthrough Slots

| Slot | Screenshot Slot | Capture Question |
| --- | --- | --- |
| MCI_S01 | app_store_listing_or_public_positioning | What promise, audience, and daily loop does the public listing imply? |
| MCI_S02 | onboarding_first_value_screen | Does onboarding show one coherent loop or separate feature shelves? |
| MCI_S03 | first_daily_action_or_task_screen | Is there a concrete action that can be completed in under two minutes? |
| MCI_S04 | progress_avatar_identity_feedback_screen | Does completion visibly change avatar, identity, or progress feedback? |
| MCI_S05 | first_paywall_or_iap_terms_screen | Is the first meaningful value before or after a subscription/trial wall? |

## ICP Segments Queued

| Segment ID | Segment | Score | Core Job |
| --- | --- | ---: | --- |
| ICP_A | Spiritual self-improvers | 10 | Turn symbolic/personal meaning into one grounded action today. |
| ICP_D | Habit and progress users | 10 | Make vague growth concrete and keep momentum without streak anxiety. |

## Operating Rule

- Leave `capture_status=not_started` until direct observed evidence exists.
- Fill exact screenshot paths, quotes, participant notes, and final labels before updating claim status.
- If any row triggers a downgrade condition, update the relevant claim/register before regenerating the PDF.

## Files

- `data_processed/manual_walkthrough_capture_sheet.csv`
- `data_processed/paid_flow_capture_sheet.csv`
- `data_processed/icp_interview_capture_sheet.csv`
- `data_processed/prototype_session_capture_sheet.csv`
