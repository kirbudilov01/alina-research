# Reddit Manual Reading Queue V1

Generated: 2026-05-31T10:18:57.616Z

## Purpose

This artifact turns coded Reddit signal rows into a human reading queue. It prioritizes unique threads by qualitative strength, signal group, market coverage, known-app attention, and snippet usefulness. It does not fetch new sources and does not convert Reddit volume into demand proof.

## Evidence Boundary

- Use this queue to decide what a human should read first.
- Use prompt seeds for ICP interviews, prototype objections, and whitespace review.
- Do not quote, cite, or upgrade claims from a queued row until the thread has been manually read and captured.

## Summary

- Unique Reddit threads queued: 1852
- P0 read-first rows: 336
- P1 read-next rows: 238
- Queue lanes: 9
- Source signal rows covered: 2339

## Prompt Bank

| Lane | Rows | P0 | Top ICP | Interview Prompt Seed |
| --- | ---: | ---: | --- | --- |
| competitor_alternative_read | 677 | 238 | ICP_D:677/ICP_F:677/ICP_A:302/ICP_C:233/ICP_B:142/ICP_E:142 | When you ask people for app recommendations, what are you hoping the next app will fix that the current one does not? |
| whitespace_objection_read | 264 | 98 | ICP_C:264/ICP_D:264/ICP_A:120/ICP_F:120/ICP_B:30/ICP_E:30 | Tell me about the last self-improvement/productivity/wellness app you stopped using. What made it feel too heavy, vague, or pressuring? |
| avatar_identity_positioning_read | 326 | 0 | ICP_B:326/ICP_E:326/ICP_D:12/ICP_C:7/ICP_A:5/ICP_F:5 | Would seeing a version of yourself change after a completed action feel motivating, silly, or invasive? Why? |
| habit_progress_read | 298 | 0 | ICP_D:298/ICP_F:298/ICP_A:216/ICP_C:62/ICP_B:20/ICP_E:20 | What helps you recover after missing a day without abandoning the habit? |
| reset_safety_language_read | 179 | 0 | ICP_C:179/ICP_D:179/ICP_F:14/ICP_A:12/ICP_E:3/ICP_B:2 | In a stressful moment, what kind of app help feels safe and useful, and what wording would make you close it? |
| context_language_read | 62 | 0 | ICP_B:41/ICP_E:41/ICP_D:21/ICP_C:12/ICP_A:9/ICP_F:9 | What words would you use to describe the problem this thread is circling around? |
| spiritual_guidance_trust_read | 32 | 0 | ICP_A:32/ICP_D:2/ICP_C:1/ICP_F:1 | What makes personal/spiritual guidance feel trustworthy and useful rather than generic or manipulative? |
| paid_value_objection_read | 7 | 0 | ICP_A:7/ICP_C:7/ICP_D:7/ICP_B:3/ICP_E:3/ICP_F:3 | What would you need to experience for free before a daily guidance/progress app felt worth paying for? |
| progression_mechanics_read | 7 | 0 | ICP_E:7/ICP_B:5/ICP_A:2/ICP_D:2/ICP_F:2 | Which progress/reward mechanics feel encouraging, and which feel like chores or manipulation? |

## Top Read-First Threads

| Rank | Band | Lane | Apps | Signals | Thread |
| ---: | --- | --- | --- | --- | --- |
| 1 | P0_read_first | whitespace_objection_read | The Pattern/Headspace/Habitica/Streaks/Habit Tracker/Calm | pain_or_rejection_of_overbuilt_systems | Would you use an app that holds you accountable to your daily routine and shows if it’s working? |
| 2 | P0_read_first | whitespace_objection_read | Insight Timer/Headspace/Waking Up/Balance | pain_or_rejection_of_overbuilt_systems | Good Meditation Apps? |
| 3 | P0_read_first | whitespace_objection_read | Insight Timer/Headspace/Balance/Calm | pain_or_rejection_of_overbuilt_systems | How I took control of my life as a Tech worker and as a Father. |
| 4 | P0_read_first | whitespace_objection_read | Habitica/Fabulous/Streaks/Habit Tracker | pain_or_rejection_of_overbuilt_systems | I built my own habit tracker after failing with every app out there — here's what I learned |
| 5 | P0_read_first | whitespace_objection_read | Habitica/Streaks/Habit Tracker/Finch | pain_or_rejection_of_overbuilt_systems | i tested every type of habit tracker for 18 months here's what actually changes behavior |
| 6 | P0_read_first | competitor_alternative_read | Insight Timer/Headspace/Waking Up/Journey/Calm | alternative_or_tool_switching_request | Calm and Headspace Don't Quite Work for Me—What Apps Do You Use? |
| 7 | P0_read_first | competitor_alternative_read | Insight Timer/Headspace/Streaks/Journey/Calm | alternative_or_tool_switching_request | Meditation apps are overwhelming me - looking for something truly minimal |
| 8 | P0_read_first | whitespace_objection_read | Headspace/Stoic/Calm | pain_or_rejection_of_overbuilt_systems | What’s Missing in Mindfulness Apps? |
| 9 | P0_read_first | competitor_alternative_read | Insight Timer/Medito/Habit Tracker/Calm | alternative_or_tool_switching_request | 5 minute sleep meditation apps |
| 10 | P0_read_first | competitor_alternative_read | Habitica/Fabulous/Habit Tracker/Finch | alternative_or_tool_switching_request | Good apps for routines, habit tracking, and to-do lists? |
| 11 | P0_read_first | competitor_alternative_read | Headspace/Waking Up/Medito/Calm | alternative_or_tool_switching_request | Looking for some honest meditation app recs - what are you guys actually using? |
| 12 | P0_read_first | competitor_alternative_read | Insight Timer/Headspace/Waking Up/Calm | alternative_or_tool_switching_request | Vipassana vs. mindfulness apps — how a traditional technique compares after 880+ days of practice |
| 13 | P0_read_first | whitespace_objection_read | Headspace/Calm | pain_or_rejection_of_overbuilt_systems | 9 Tips to Help You Meditate Like A Pro |
| 14 | P0_read_first | whitespace_objection_read | Headspace/Calm | pain_or_rejection_of_overbuilt_systems | Are meditation apps getting worse? |
| 15 | P0_read_first | whitespace_objection_read | Headspace/Waking Up | pain_or_rejection_of_overbuilt_systems | Building a free meditation app - Looking for help |
| 16 | P0_read_first | whitespace_objection_read | Headspace/Calm | pain_or_rejection_of_overbuilt_systems | Does anyone else feel like meditation apps don't actually know what you're going through? |
| 17 | P0_read_first | whitespace_objection_read | Notion/Habit Tracker | pain_or_rejection_of_overbuilt_systems | F*ck your productivity system. Seriously. |
| 18 | P0_read_first | whitespace_objection_read | Streaks/Habit Tracker | pain_or_rejection_of_overbuilt_systems | Habit trackers always work for me until I miss one day. Does this happen to anyone else? |
| 19 | P0_read_first | whitespace_objection_read | Streaks/Habit Tracker | pain_or_rejection_of_overbuilt_systems | Habit trackers are a habit itself |
| 20 | P0_read_first | whitespace_objection_read | Headspace/Calm | pain_or_rejection_of_overbuilt_systems | headspace.com - truly wonderful web app to bring some calm into your day and reduce anxiety. Just signed up and did my first ten minutes, cooled my mind right down. Seriously, try this. |
| 21 | P0_read_first | whitespace_objection_read | Waking Up/Calm | pain_or_rejection_of_overbuilt_systems | How to handle anxiety before sleeping? |
| 22 | P0_read_first | whitespace_objection_read | Notion/Habit Tracker | pain_or_rejection_of_overbuilt_systems | I built a self-improvement app that gamifies your real life — avatars, AI coach, XP, level ups. I’m the dev. Be honest with me. |
| 23 | P0_read_first | whitespace_objection_read | Streaks/Habit Tracker | pain_or_rejection_of_overbuilt_systems | I kept quitting habits after 2–3 weeks, so I spent months building an app that actually keeps me going. Here's what I learned. |
| 24 | P0_read_first | whitespace_objection_read | Streaks/Habit Tracker | pain_or_rejection_of_overbuilt_systems | I realized my problem isn’t motivation, It’s broken commitments (experimenting with a fix) |
| 25 | P0_read_first | whitespace_objection_read | Habitica/Notion | pain_or_rejection_of_overbuilt_systems | I’m building a ‘scoreboard’ for gym discipline (anti-Habitica). Roast my concept or tell me I’m onto something |
| 26 | P0_read_first | whitespace_objection_read | Waking Up/Calm | pain_or_rejection_of_overbuilt_systems | I've been trying out Sam Harris' Waking Up app and he said something in one of his lessons that really shook me and my perception of the 'goal' of meditation. |
| 27 | P0_read_first | whitespace_objection_read | Todoist/Habit Tracker | pain_or_rejection_of_overbuilt_systems | Looking for a task/routine app with automatic timers (iOS/Apple Watch) |
| 28 | P0_read_first | whitespace_objection_read | Todoist/Habit Tracker | pain_or_rejection_of_overbuilt_systems | Looking for a task/routine app with automatic timers (iOS/Apple Watch) |
| 29 | P0_read_first | whitespace_objection_read | Headspace/Balance | pain_or_rejection_of_overbuilt_systems | Meditation apps—-find any helpful? |
| 30 | P0_read_first | whitespace_objection_read | Notion/Habit Tracker | pain_or_rejection_of_overbuilt_systems | My roommate said "you've been getting ready to start for 3 years" and I couldn't argue |

## Files

- `data_processed/reddit_manual_reading_queue.csv`
- `data_processed/reddit_manual_reading_prompt_bank.csv`
- `docs/audience/reddit-manual-reading-queue-v1.md`
