# Chrome Extension Detail Enrichment V1

Generated: 2026-05-31T06:34:04.399Z

## Scope

This is a detail-page enrichment pass over the already collected P0 Chrome Web Store candidates. It does not perform broad search; it only reads known candidate URLs from the controlled smoke pass.

## Coverage

- Detail candidates attempted: 251
- Successful detail pages: 251
- Strong adjacent candidates: 9
- Useful adjacent candidates: 86

Fit bands:

- useful_adjacent: 86
- weak_adjacent: 79
- out_of_scope_or_b2b: 77
- strong_adjacent: 9

Feature tags:

- habit_tracking: 75
- ai_coaching: 50
- progress_feedback: 32
- accountability: 28
- mood_or_reflection: 26
- meeting_or_sales_coach: 10
- developer_or_learning_coach: 5
- security_or_workflow: 4

## Highest-Fit Candidates

| Candidate | Fit | Score | Tags | Why It Matters |
| --- | --- | ---: | --- | --- |
| ChartLense: AI Chart Analysis & Journaling | strong_adjacent | 9 | ai_coaching<br>habit_tracking<br>progress_feedback<br>mood_or_reflection | Useful for browser-extension habit/progress mechanics comparison. |
| Ritual — Habit Tracker | strong_adjacent | 8 | habit_tracking<br>progress_feedback<br>mood_or_reflection | Useful for browser-extension habit/progress mechanics comparison. |
| MyndGuard – Family Wellness Monitor | strong_adjacent | 8 | ai_coaching<br>accountability<br>progress_feedback | Useful for browser-extension habit/progress mechanics comparison. |
| Accountability Shield - Free Website Blocker | strong_adjacent | 7 | ai_coaching<br>accountability<br>progress_feedback | Useful for browser-extension habit/progress mechanics comparison. |
| Aura - Daily Mindfulness | strong_adjacent | 7 | habit_tracking<br>mood_or_reflection | Useful for browser-extension habit/progress mechanics comparison. |
| KundliShastra – Daily Kundli, Panchang & Personal Astrology Insights | strong_adjacent | 7 | habit_tracking<br>progress_feedback | Useful for browser-extension habit/progress mechanics comparison. |
| LifeHack Daily Affirmation | strong_adjacent | 7 | ai_coaching<br>habit_tracking | Useful for browser-extension habit/progress mechanics comparison. |
| AI Habit Tracker | strong_adjacent | 7 | ai_coaching<br>habit_tracking<br>progress_feedback | Useful for browser-extension habit/progress mechanics comparison. |
| Habit Tracker - Track My Habit | strong_adjacent | 6 | habit_tracking<br>progress_feedback | Useful for browser-extension habit/progress mechanics comparison. |
| Habit Tracker | useful_adjacent | 5 | habit_tracking | Useful for browser-extension habit/progress mechanics comparison. |
| Habit Tracker | useful_adjacent | 5 | habit_tracking<br>progress_feedback | Useful for browser-extension habit/progress mechanics comparison. |
| Time Tracker - Web Habit Builder | useful_adjacent | 5 | habit_tracking<br>accountability | Useful for browser-extension habit/progress mechanics comparison. |

## Interpretation

- Browser extensions are not the core target market, but they are useful evidence for lightweight daily habit/progress loops and accountability mechanics.
- Strong/useful adjacent rows should be used as mechanic references, not as proof of a complete Alina-like direct competitor.
- Out-of-scope/B2B rows are still helpful boundary evidence because they show where AI coaching language is used for narrow work tasks.

## Files

- `data_raw/chrome_extension_detail_raw.csv`
- `data_processed/chrome_extension_fit_matrix.csv`
