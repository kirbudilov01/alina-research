# Reddit Mention Signal Matrix V1

Generated: 2026-05-31T10:13:35.278Z

## Purpose

This layer turns the source-native old.reddit mention collection into coded competitor, audience, ICP, and whitespace signals. It uses only already collected local Reddit rows and does not make a representative market-size claim.

## Evidence Boundary

- Use this as qualitative discovery evidence: language, alternatives, pain, objections, and manual-review routing.
- Do not use this as demand volume, market share, conversion, retention, or willingness-to-pay proof.
- Rows with useful snippets still need human reading before they appear in external-facing claims.

## Summary

- Reddit raw rows coded: 2339
- App summary rows: 1202
- Known-app ok rows: 940
- Signal groups: 9
- Subreddits covered: 25

## Signal Groups

| Signal Group | Rows | Top Niches | Top ICP | Interpretation |
| --- | ---: | --- | --- | --- |
| alternative_or_tool_switching_request | 875 | coaching:375/mindfulness:331/avatar_identity:164/gaming_progression:5 | ICP_D:875/ICP_F:875/ICP_A:375/ICP_C:331/ICP_B:169 | The thread is actively comparing tools or asking for alternatives, so it can inform competitor substitution and switching friction. |
| habit_accountability_and_progress_need | 388 | coaching:297/mindfulness:69/gaming_progression:15/avatar_identity:7 | ICP_D:388/ICP_F:388/ICP_A:297/ICP_C:69/ICP_B:22 | The thread points to concrete habit/progress needs; useful for testing action-tied avatar progress against plain trackers. |
| identity_companion_or_avatar_need | 385 | avatar_identity:372/mindfulness:8/coaching:5 | ICP_B:385/ICP_E:385/ICP_D:13/ICP_C:8/ICP_A:5 | Identity, companion, or avatar language appears; useful for testing whether Alina is read as growth feedback rather than generic chat or avatar generation. |
| pain_or_rejection_of_overbuilt_systems | 373 | coaching:179/mindfulness:159/avatar_identity:35 | ICP_C:373/ICP_D:373/ICP_A:179/ICP_F:179/ICP_B:35 | Users reject heavy systems, notification pressure, or maintenance overhead; the product loop should feel small, forgiving, and immediately useful. |
| reset_mindfulness_or_emotional_regulation_need | 207 | mindfulness:191/coaching:14/avatar_identity:2 | ICP_C:207/ICP_D:207/ICP_A:14/ICP_F:14/ICP_B:2 | The thread signals short emotional-regulation jobs; useful for validating a two-minute reset plus one next action. |
| unclassified_context_language | 63 | avatar_identity:36/mindfulness:12/coaching:10/gaming_progression:5 | ICP_B:41/ICP_E:41/ICP_D:22/ICP_C:12/ICP_A:10 | Unclassified context language should be treated as a source for manual reading and prompt design, not as a claim by itself. |
| spiritual_guidance_or_meaning_need | 32 | astrology_esoterics:30/coaching:1/mindfulness:1 | ICP_A:32/ICP_D:2/ICP_C:1/ICP_F:1 | Spiritual or symbolic guidance language appears; useful for testing trust, safety boundaries, and whether guidance becomes grounded action. |
| pricing_or_subscription_sensitivity | 8 | avatar_identity:4/coaching:3/mindfulness:1 | ICP_A:8/ICP_C:8/ICP_D:8/ICP_B:4/ICP_E:4 | The thread surfaces price sensitivity; useful for paid-loop validation and free-first value sequencing. |
| gamified_progression_or_reward_need | 8 | gaming_progression:5/coaching:2/mindfulness:1 | ICP_E:8/ICP_B:5/ICP_D:3/ICP_A:2/ICP_F:2 | Progression or reward language appears; useful for borrowing gentle game mechanics without making growth feel manipulative. |

## Top App Mention Summaries

| App | Rows | Subreddits | Top Signals | Evidence Strength |
| --- | ---: | ---: | --- | --- |
| Habit Tracker | 323 | 10 | alternative_or_tool_switching_request:151/habit_accountability_and_progress_need:119/pain_or_rejection_of_overbuilt_systems:52/reset_mindfulness_or_emotional_regulation_need:1 | strong_qualitative_attention |
| Replika | 103 | 3 | identity_companion_or_avatar_need:67/alternative_or_tool_switching_request:28/pain_or_rejection_of_overbuilt_systems:6/pricing_or_subscription_sensitivity:1/reset_mindfulness_or_emotional_regulation_need:1 | strong_qualitative_attention |
| Calm | 86 | 7 | alternative_or_tool_switching_request:35/pain_or_rejection_of_overbuilt_systems:27/reset_mindfulness_or_emotional_regulation_need:21/habit_accountability_and_progress_need:2/identity_companion_or_avatar_need:1 | strong_qualitative_attention |
| Journey | 75 | 13 | alternative_or_tool_switching_request:28/habit_accountability_and_progress_need:20/pain_or_rejection_of_overbuilt_systems:10/reset_mindfulness_or_emotional_regulation_need:9/identity_companion_or_avatar_need:7 | strong_qualitative_attention |
| Headspace | 67 | 6 | alternative_or_tool_switching_request:36/pain_or_rejection_of_overbuilt_systems:15/reset_mindfulness_or_emotional_regulation_need:11/habit_accountability_and_progress_need:4/identity_companion_or_avatar_need:1 | strong_qualitative_attention |
| Waking Up | 50 | 8 | alternative_or_tool_switching_request:23/pain_or_rejection_of_overbuilt_systems:13/habit_accountability_and_progress_need:9/reset_mindfulness_or_emotional_regulation_need:5 | strong_qualitative_attention |
| Streaks | 48 | 7 | pain_or_rejection_of_overbuilt_systems:18/alternative_or_tool_switching_request:17/habit_accountability_and_progress_need:13 | strong_qualitative_attention |
| Character AI | 32 | 2 | identity_companion_or_avatar_need:17/alternative_or_tool_switching_request:11/pain_or_rejection_of_overbuilt_systems:4 | strong_qualitative_attention |
| Notion | 24 | 7 | pain_or_rejection_of_overbuilt_systems:8/alternative_or_tool_switching_request:7/habit_accountability_and_progress_need:6/identity_companion_or_avatar_need:1/reset_mindfulness_or_emotional_regulation_need:1 | strong_qualitative_attention |
| Habitica | 19 | 5 | habit_accountability_and_progress_need:7/alternative_or_tool_switching_request:6/pain_or_rejection_of_overbuilt_systems:6 | strong_qualitative_attention |
| Insight Timer | 19 | 6 | alternative_or_tool_switching_request:12/reset_mindfulness_or_emotional_regulation_need:4/pain_or_rejection_of_overbuilt_systems:3 | strong_qualitative_attention |
| Motivate | 16 | 5 | alternative_or_tool_switching_request:8/habit_accountability_and_progress_need:7/pain_or_rejection_of_overbuilt_systems:1 | strong_qualitative_attention |
| Balance | 14 | 8 | pain_or_rejection_of_overbuilt_systems:6/alternative_or_tool_switching_request:4/habit_accountability_and_progress_need:1/identity_companion_or_avatar_need:1/pricing_or_subscription_sensitivity:1 | strong_qualitative_attention |
| Finch | 14 | 4 | alternative_or_tool_switching_request:7/habit_accountability_and_progress_need:5/pain_or_rejection_of_overbuilt_systems:2 | strong_qualitative_attention |
| Todoist | 9 | 4 | alternative_or_tool_switching_request:4/habit_accountability_and_progress_need:2/pain_or_rejection_of_overbuilt_systems:2/unclassified_context_language:1 | medium_qualitative_attention |
| Medito | 8 | 2 | alternative_or_tool_switching_request:5/pain_or_rejection_of_overbuilt_systems:2/reset_mindfulness_or_emotional_regulation_need:1 | medium_qualitative_attention |
| Stoic | 8 | 3 | alternative_or_tool_switching_request:6/habit_accountability_and_progress_need:1/pain_or_rejection_of_overbuilt_systems:1 | medium_qualitative_attention |
| The Pattern | 8 | 2 | habit_accountability_and_progress_need:3/pain_or_rejection_of_overbuilt_systems:3/alternative_or_tool_switching_request:2 | medium_qualitative_attention |
| Reddit r/astrology: no extracted results | 6 | 1 | spiritual_guidance_or_meaning_need:6 | manual_check_needed |
| Reddit r/cozygamers: no extracted results | 6 | 1 | habit_accountability_and_progress_need:3/alternative_or_tool_switching_request:1/gamified_progression_or_reward_need:1/unclassified_context_language:1 | manual_check_needed |
| Reddit r/gamification: no extracted results | 6 | 1 | habit_accountability_and_progress_need:3/alternative_or_tool_switching_request:1/gamified_progression_or_reward_need:1/unclassified_context_language:1 | manual_check_needed |
| Reddit r/Habitica: no extracted results | 6 | 1 | habit_accountability_and_progress_need:3/alternative_or_tool_switching_request:1/gamified_progression_or_reward_need:1/unclassified_context_language:1 | manual_check_needed |
| Reddit r/incremental_games: no extracted results | 6 | 1 | habit_accountability_and_progress_need:3/alternative_or_tool_switching_request:1/gamified_progression_or_reward_need:1/unclassified_context_language:1 | manual_check_needed |
| Reddit r/lawofattraction: no extracted results | 6 | 1 | spiritual_guidance_or_meaning_need:6 | manual_check_needed |
| Reddit r/manifestation: no extracted results | 6 | 1 | spiritual_guidance_or_meaning_need:6 | manual_check_needed |

## Files

- `data_processed/reddit_mention_signal_matrix.csv`
- `data_processed/reddit_mention_app_summary.csv`
- `docs/audience/reddit-mention-signal-matrix-v1.md`
