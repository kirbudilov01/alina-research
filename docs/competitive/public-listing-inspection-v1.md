# Public Listing Inspection V1

Generated: 2026-05-31T06:23:36.521Z

## Purpose

This is a no-broad-search inspection layer for the 12 P0 competitors already selected in the manual inspection packet. It reviews existing App Store public listing excerpts, pricing rows, scorecard fields, and source URLs. It does not claim the app/onboarding walkthrough is complete.

## Summary

- Public listing rows inspected: 12
- Rows with public listing excerpts: 12
- App walkthroughs completed: 0
- Visible public-copy action-to-avatar causality reads: 1
- High hidden clone risk from public listing: 1

Public listing verdict mix:

- public_listing_supports_adjacent_loop_not_causality: 9
- public_listing_supports_strict_loop_claim: 3

Causality public-read mix:

- decorative_or_progress_only_possible: 6
- not_visible_public_listing: 3
- inferred_from_public_copy_not_causal: 2
- visible_in_public_copy: 1

## Inspection Rows

| Rank | App | Public Verdict | Causality Read | Clone Risk | H3 Implication |
| ---: | --- | --- | --- | --- | --- |
| 1 | Shepherd: Spiritual Bible BFF | public_listing_supports_strict_loop_claim | visible_in_public_copy | high_hidden_clone_risk_requires_app_walkthrough | downgrade_whitespace_if_walkthrough_confirms_full_loop |
| 2 | Zing AI: Home & Gym Workouts | public_listing_supports_adjacent_loop_not_causality | inferred_from_public_copy_not_causal | medium_adjacency_risk | whitespace_survives_public_listing_but_requires_walkthrough |
| 3 | Miracle Morning Routine | public_listing_supports_adjacent_loop_not_causality | not_visible_public_listing | low_public_listing_directness_risk | whitespace_survives_public_listing_but_requires_walkthrough |
| 4 | EVOLVE: Transform Your Life | public_listing_supports_strict_loop_claim | decorative_or_progress_only_possible | medium_adjacency_risk | whitespace_survives_public_listing_but_requires_walkthrough |
| 5 | Daily Yoga: Yoga for Fitness® | public_listing_supports_adjacent_loop_not_causality | not_visible_public_listing | low_public_listing_directness_risk | whitespace_survives_public_listing_but_requires_walkthrough |
| 6 | Daily Burn: Workout Coach | public_listing_supports_strict_loop_claim | decorative_or_progress_only_possible | medium_adjacency_risk | whitespace_survives_public_listing_but_requires_walkthrough |
| 7 | Myla : Manifest & Vision Board | public_listing_supports_adjacent_loop_not_causality | inferred_from_public_copy_not_causal | medium_adjacency_risk | whitespace_survives_public_listing_but_requires_walkthrough |
| 8 | Rosebud: AI Journal & Diary | public_listing_supports_adjacent_loop_not_causality | decorative_or_progress_only_possible | medium_adjacency_risk | whitespace_survives_public_listing_but_requires_walkthrough |
| 9 | Habit Tracker : Haby | public_listing_supports_adjacent_loop_not_causality | decorative_or_progress_only_possible | medium_adjacency_risk | whitespace_survives_public_listing_but_requires_walkthrough |
| 10 | Goddess・Women's Wellness Coach | public_listing_supports_adjacent_loop_not_causality | not_visible_public_listing | low_public_listing_directness_risk | whitespace_survives_public_listing_but_requires_walkthrough |
| 11 | LifeWheel Goal Habit Tracker | public_listing_supports_adjacent_loop_not_causality | decorative_or_progress_only_possible | medium_adjacency_risk | whitespace_survives_public_listing_but_requires_walkthrough |
| 12 | Habit Tracker | public_listing_supports_adjacent_loop_not_causality | decorative_or_progress_only_possible | medium_adjacency_risk | whitespace_survives_public_listing_but_requires_walkthrough |

## Interpretation

- This layer reduces ambiguity in public positioning, but it cannot prove in-app mechanics.
- Any row with visible or metadata-implied action-to-avatar causality remains P0 for walkthrough screenshots.
- The H3 whitespace claim should remain narrow and conditional until onboarding, first action, progress feedback, and paywall screenshots are captured.

## Files

- `data_processed/public_listing_inspection_results.csv`
- `data_processed/public_listing_inspection_summary.csv`
