# Human Validation Guide V1

Generated: 2026-05-31T03:27:17.871Z

## Purpose

The top-100 competitor review is intentionally labeled AI-assisted. This packet turns it into a human validation workflow so final claims do not rest on metadata heuristics alone.

## Outputs

- `data_processed/top100_human_validation_queue.csv`: ranked validation queue for 90 primary app entries.
- Suggested status values: `not_started`, `confirmed`, `partially_confirmed`, `rejected`, `needs_more_evidence`.

## Priority Mix

- P3_backlog: 35
- P1_high: 24
- P0_validate_first: 21
- P2_medium: 10

## Validation Protocol

For each P0/P1 app, capture evidence before changing the final report:

1. Open App Store page and confirm description, screenshots, rating count, seller, and visible IAP terms.
2. If install/access is available, inspect onboarding, first meaningful action, free/paywall boundary, and progression feedback.
3. Decide whether avatar/identity/progression is decorative or causally tied to completed action.
4. Sample recent reviews for the exact user language behind love/pain signals.
5. If a web paywall URL exists, capture screenshot and verify trial length, monthly/annual price, and cancellation/renewal framing.
6. Mark `validation_status` and write short `human_notes` with evidence links or screenshot filenames.

## P0 Validate First

| Rank | App | Verdict | Priority | Behavior Claim | IAP | Web Signal | Key Question |
| ---: | --- | --- | ---: | --- | ---: | --- | --- |
| 1 | Shepherd: Spiritual Bible BFF | direct_reference_competitor | 162.8 | yes | 6 | n/a | Is this truly a direct reference competitor under the strict Alina loop, or only a faith-specific adjacent example? |
| 2 | Zing AI: Home & Gym Workouts | high_priority_close_substitute | 112 | no | 6 | n/a | Does the product actually solve a daily ritual / self-improvement / guidance job, or is the metadata overstating it? |
| 3 | Miracle Morning Routine | high_priority_close_substitute | 111.4 | no | 8 | n/a | Does the product actually solve a daily ritual / self-improvement / guidance job, or is the metadata overstating it? |
| 4 | EVOLVE: Transform Your Life | high_priority_close_substitute | 106 | no | 9 | n/a | Does the product actually solve a daily ritual / self-improvement / guidance job, or is the metadata overstating it? |
| 5 | Daily Yoga: Yoga for Fitness® | high_priority_close_substitute | 99.2 | no | 10 | n/a | Does the product actually solve a daily ritual / self-improvement / guidance job, or is the metadata overstating it? |
| 6 | Daily Burn: Workout Coach | high_priority_close_substitute | 98 | no | 8 | n/a | Does the product actually solve a daily ritual / self-improvement / guidance job, or is the metadata overstating it? |
| 7 | Myla : Manifest & Vision Board | high_priority_close_substitute | 97.6 | no | 10 | n/a | Does the product actually solve a daily ritual / self-improvement / guidance job, or is the metadata overstating it? |
| 8 | Rosebud: AI Journal & Diary | high_priority_close_substitute | 97 | no | 4 | n/a | Does the product actually solve a daily ritual / self-improvement / guidance job, or is the metadata overstating it? |
| 9 | Habit Tracker : Haby | high_priority_close_substitute | 95.8 | no | 8 | n/a | Does the product actually solve a daily ritual / self-improvement / guidance job, or is the metadata overstating it? |
| 10 | Goddess・Women's Wellness Coach | high_priority_close_substitute | 95.8 | no | 10 | n/a | Does the product actually solve a daily ritual / self-improvement / guidance job, or is the metadata overstating it? |
| 11 | LifeWheel Goal Habit Tracker | high_priority_close_substitute | 95.4 | no | 9 | n/a | Does the product actually solve a daily ritual / self-improvement / guidance job, or is the metadata overstating it? |
| 12 | Habit Tracker | high_priority_close_substitute | 94 | no | 6 | n/a | Does the product actually solve a daily ritual / self-improvement / guidance job, or is the metadata overstating it? |
| 13 | ModernSam: LVL up your life | high_priority_close_substitute | 93.8 | no | 7 | n/a | Does the product actually solve a daily ritual / self-improvement / guidance job, or is the metadata overstating it? |
| 14 | Mindvalley: Self Improvement | high_priority_close_substitute | 93.6 | no | 8 | n/a | Does the product actually solve a daily ritual / self-improvement / guidance job, or is the metadata overstating it? |
| 15 | OtterLife: AI Health Tracker | high_priority_close_substitute | 92 | no | 24 | n/a | Does the product actually solve a daily ritual / self-improvement / guidance job, or is the metadata overstating it? |
| 16 | Kokoa AI: Roleplay AI Chat | high_priority_close_substitute | 91.6 | no | 9 | n/a | Does the product actually solve a daily ritual / self-improvement / guidance job, or is the metadata overstating it? |
| 17 | Growth Spiral / Self evolution | high_priority_close_substitute | 91.4 | no | 7 | n/a | Does the product actually solve a daily ritual / self-improvement / guidance job, or is the metadata overstating it? |
| 18 | Law of Attraction Toolbox | high_priority_close_substitute | 91 | no | 6 | n/a | Does the product actually solve a daily ritual / self-improvement / guidance job, or is the metadata overstating it? |
| 19 | Spark AI: Chat with Characters | high_priority_close_substitute | 90 | no | 16 | n/a | Does the product actually solve a daily ritual / self-improvement / guidance job, or is the metadata overstating it? |
| 20 | Vida Health | high_priority_close_substitute | 90 | no | 0 | n/a | Does the product actually solve a daily ritual / self-improvement / guidance job, or is the metadata overstating it? |

## P1 High Priority

| Rank | App | Verdict | Priority | Checks |
| ---: | --- | --- | ---: | --- |
| 22 | Motivate: Daily Motivation | high_priority_close_substitute | 89.8 | confirm_app_store_metadata<br>inspect_onboarding_and_first_session<br>verify_core_feature_claims<br>verify_pricing_iap_and_trial_terms<br>capture_3_to_5_screenshots |
| 23 | Yoga International | high_priority_close_substitute | 89.6 | confirm_app_store_metadata<br>inspect_onboarding_and_first_session<br>verify_core_feature_claims<br>verify_pricing_iap_and_trial_terms<br>capture_3_to_5_screenshots |
| 24 | Sol - Inner Life & Wellbeing | high_priority_close_substitute | 88.2 | confirm_app_store_metadata<br>inspect_onboarding_and_first_session<br>verify_core_feature_claims<br>verify_pricing_iap_and_trial_terms<br>capture_3_to_5_screenshots |
| 25 | stoic. journal & mental health | high_priority_close_substitute | 88 | confirm_app_store_metadata<br>inspect_onboarding_and_first_session<br>verify_core_feature_claims<br>verify_pricing_iap_and_trial_terms<br>capture_3_to_5_screenshots |
| 26 | Day One: Daily Journal & Diary | high_priority_close_substitute | 88 | confirm_app_store_metadata<br>inspect_onboarding_and_first_session<br>verify_core_feature_claims<br>verify_pricing_iap_and_trial_terms<br>capture_3_to_5_screenshots |
| 27 | LunaMate: AI Fanstasy Roleplay | high_priority_close_substitute | 87.2 | confirm_app_store_metadata<br>inspect_onboarding_and_first_session<br>verify_core_feature_claims<br>verify_pricing_iap_and_trial_terms<br>capture_3_to_5_screenshots |
| 28 | Cozy Mahjong | high_priority_close_substitute | 86.8 | confirm_app_store_metadata<br>inspect_onboarding_and_first_session<br>verify_core_feature_claims<br>verify_pricing_iap_and_trial_terms<br>capture_3_to_5_screenshots |
| 29 | Harem AI - Chat & Talk & Crush | high_priority_close_substitute | 86.2 | confirm_app_store_metadata<br>inspect_onboarding_and_first_session<br>verify_core_feature_claims<br>verify_pricing_iap_and_trial_terms<br>capture_3_to_5_screenshots |
| 30 | ZOE Health: AI Meal Tracker | high_priority_close_substitute | 85.6 | confirm_app_store_metadata<br>inspect_onboarding_and_first_session<br>verify_core_feature_claims<br>verify_pricing_iap_and_trial_terms<br>capture_3_to_5_screenshots |
| 31 | Essence 360 | high_priority_close_substitute | 84.8 | confirm_app_store_metadata<br>inspect_onboarding_and_first_session<br>verify_core_feature_claims<br>verify_pricing_iap_and_trial_terms<br>capture_3_to_5_screenshots |
| 32 | Pocket Insight Psychic Reading | high_priority_close_substitute | 83.4 | confirm_app_store_metadata<br>inspect_onboarding_and_first_session<br>verify_core_feature_claims<br>verify_pricing_iap_and_trial_terms<br>capture_3_to_5_screenshots |
| 33 | Good Morning Messages & Images | high_priority_close_substitute | 83.2 | confirm_app_store_metadata<br>inspect_onboarding_and_first_session<br>verify_core_feature_claims<br>verify_pricing_iap_and_trial_terms<br>capture_3_to_5_screenshots |
| 34 | Unplug: Meditation | high_priority_close_substitute | 81.6 | confirm_app_store_metadata<br>inspect_onboarding_and_first_session<br>verify_core_feature_claims<br>verify_pricing_iap_and_trial_terms<br>capture_3_to_5_screenshots |
| 35 | Ricky Kalmon | high_priority_close_substitute | 81.2 | confirm_app_store_metadata<br>inspect_onboarding_and_first_session<br>verify_core_feature_claims<br>verify_pricing_iap_and_trial_terms<br>capture_3_to_5_screenshots |
| 36 | Eylo: AI Weight Loss Coach | high_priority_close_substitute | 81 | confirm_app_store_metadata<br>inspect_onboarding_and_first_session<br>verify_core_feature_claims<br>verify_pricing_iap_and_trial_terms<br>capture_3_to_5_screenshots |
| 37 | MINDTRX: Self Help & Mindset | high_priority_close_substitute | 80 | confirm_app_store_metadata<br>inspect_onboarding_and_first_session<br>verify_core_feature_claims<br>verify_pricing_iap_and_trial_terms<br>capture_3_to_5_screenshots |
| 38 | Daily Habit List: Goal Tracker | high_priority_close_substitute | 79 | confirm_app_store_metadata<br>inspect_onboarding_and_first_session<br>verify_core_feature_claims<br>verify_pricing_iap_and_trial_terms<br>capture_3_to_5_screenshots |
| 39 | MindFi: Mind Fitness for All | high_priority_close_substitute | 78.4 | confirm_app_store_metadata<br>inspect_onboarding_and_first_session<br>verify_core_feature_claims<br>verify_pricing_iap_and_trial_terms<br>capture_3_to_5_screenshots |
| 40 | Habit Tracker - Statz | high_priority_close_substitute | 77.2 | confirm_app_store_metadata<br>inspect_onboarding_and_first_session<br>verify_core_feature_claims<br>verify_pricing_iap_and_trial_terms<br>capture_3_to_5_screenshots |
| 41 | Affirmations - Mood Mantra | high_priority_close_substitute | 72 | confirm_app_store_metadata<br>inspect_onboarding_and_first_session<br>verify_core_feature_claims<br>verify_pricing_iap_and_trial_terms<br>capture_3_to_5_screenshots |
| 42 | Cultivate Personal Development | high_priority_close_substitute | 71.4 | confirm_app_store_metadata<br>inspect_onboarding_and_first_session<br>verify_core_feature_claims<br>verify_pricing_iap_and_trial_terms<br>capture_3_to_5_screenshots |
| 43 | Lifeline Wellness | high_priority_close_substitute | 70.8 | confirm_app_store_metadata<br>inspect_onboarding_and_first_session<br>verify_core_feature_claims<br>verify_pricing_iap_and_trial_terms<br>capture_3_to_5_screenshots |
| 44 | Pitstop: Scale Human Potential | high_priority_close_substitute | 70.4 | confirm_app_store_metadata<br>inspect_onboarding_and_first_session<br>verify_core_feature_claims<br>verify_pricing_iap_and_trial_terms<br>capture_3_to_5_screenshots |
| 45 | Bodhi: Astrology & Horoscope | high_priority_close_substitute | 70.4 | confirm_app_store_metadata<br>inspect_onboarding_and_first_session<br>verify_core_feature_claims<br>verify_pricing_iap_and_trial_terms<br>capture_3_to_5_screenshots |

## Rules For Updating Claims

- If behavior-tied progression is not visible after manual review, downgrade the directness claim even if metadata sounded close.
- If the paywall appears before the first meaningful action, treat it as a subscription-risk benchmark.
- If reviews complain about generic content, bugs, safety, or trust, keep those as product risks rather than marketing opportunities.
- If a competitor has a strong daily action -> visible identity feedback loop, promote it into the battlecard set and revisit the whitespace claim.
