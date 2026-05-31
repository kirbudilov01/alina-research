# Reddit Competitor Mentions V1

Generated: 2026-05-31T09:58:23.885Z

## Purpose

This source-native collector expands forum evidence through old.reddit public search pages. It captures user-named tools and unmet-needs threads across the five research markets. Mentions are qualitative discovery evidence, not ranking, market share, or demand proof.

## Summary

- Query pairs attempted: 150
- Raw rows after dedupe: 2339
- Known-app mention rows: 940
- Max results per query: 25

Rows by market:

- coaching: 886
- mindfulness: 773
- avatar_identity: 620
- astrology_esoterics: 30
- gaming_progression: 30

Rows by mention type:

- recommendation_request: 612
- identity_companion_need: 379
- pain_or_rejection: 369
- habit_accountability_need: 342
- alternative_request: 258
- reset_mindfulness_need: 196
- general_tool_discussion: 117
- unknown: 66

Collection statuses:

- ok_thread_without_known_app_extract: 1333
- ok: 940
- http_429: 64
- empty_result: 2

## Claim Boundary

- Reddit rows are forum-language and competitor-discovery evidence.
- They should not be used as market share, revenue, or broad audience-size claims.
- Thread rows without a known-app extraction are retained because they preserve unmet-need language for ICP and product positioning.

## Files

- `data_raw/expanded_reddit_competitor_mentions_raw.csv`
- `data_processed/reddit_competitor_mentions_summary.csv`
