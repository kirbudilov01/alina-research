# Chrome Extension Detail Enrichment V1

Generated: 2026-05-31T04:00:19.182Z

## Scope

This is a detail-page enrichment pass over the already collected P0 Chrome Web Store candidates. It does not perform broad search; it only reads known candidate URLs from the controlled smoke pass.

## Coverage

- Detail candidates attempted: 23
- Successful detail pages: 23
- Strong adjacent candidates: 3
- Useful adjacent candidates: 10

Fit bands:

- useful_adjacent: 10
- weak_adjacent: 6
- out_of_scope_or_b2b: 4
- strong_adjacent: 3

Feature tags:

- ai_coaching: 11
- habit_tracking: 10
- progress_feedback: 9
- accountability: 4
- developer_or_learning_coach: 3
- meeting_or_sales_coach: 2
- mood_or_reflection: 2
- security_or_workflow: 1

## Highest-Fit Candidates

| Candidate | Fit | Score | Tags | Why It Matters |
| --- | --- | ---: | --- | --- |
| Ritual — Habit Tracker | strong_adjacent | 8 | habit_tracking<br>progress_feedback<br>mood_or_reflection | Useful for browser-extension habit/progress mechanics comparison. |
| Accountability Shield - Free Website Blocker | strong_adjacent | 7 | ai_coaching<br>accountability<br>progress_feedback | Useful for browser-extension habit/progress mechanics comparison. |
| Habit Tracker - Track My Habit | strong_adjacent | 6 | habit_tracking<br>progress_feedback | Useful for browser-extension habit/progress mechanics comparison. |
| Habit Tracker | useful_adjacent | 5 | habit_tracking | Useful for browser-extension habit/progress mechanics comparison. |
| Habit Tracker | useful_adjacent | 5 | habit_tracking<br>progress_feedback | Useful for browser-extension habit/progress mechanics comparison. |
| Time Tracker - Web Habit Builder | useful_adjacent | 5 | habit_tracking<br>accountability | Useful for browser-extension habit/progress mechanics comparison. |
| Habit Squares: Bullet Journal Habit Tracker | useful_adjacent | 5 | habit_tracking<br>mood_or_reflection | Useful for browser-extension habit/progress mechanics comparison. |
| Ora - New Tab: Habit Tracker & Time Progress | useful_adjacent | 5 | habit_tracking<br>progress_feedback | Useful for browser-extension habit/progress mechanics comparison. |
| Habit Tracker – Progress & Stats on New Tab | useful_adjacent | 5 | habit_tracking<br>progress_feedback | Useful for browser-extension habit/progress mechanics comparison. |
| AI Prompt Coach by LeadWithAI.co | useful_adjacent | 4 | ai_coaching<br>progress_feedback | Useful for browser-extension habit/progress mechanics comparison. |
| LeetCode AI Coach | useful_adjacent | 4 | ai_coaching<br>progress_feedback<br>developer_or_learning_coach | Useful for browser-extension habit/progress mechanics comparison. |
| Daily Habit Tracker | useful_adjacent | 3 | habit_tracking | Useful for browser-extension habit/progress mechanics comparison. |

## Interpretation

- Browser extensions are not the core target market, but they are useful evidence for lightweight daily habit/progress loops and accountability mechanics.
- Strong/useful adjacent rows should be used as mechanic references, not as proof of a complete Alina-like direct competitor.
- Out-of-scope/B2B rows are still helpful boundary evidence because they show where AI coaching language is used for narrow work tasks.

## Files

- `data_raw/chrome_extension_detail_raw.csv`
- `data_processed/chrome_extension_fit_matrix.csv`
