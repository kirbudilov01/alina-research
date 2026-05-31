# Manual Competitor Review Protocol V1

Date: 2026-05-31
Input: `data_processed/top_intersection_review_candidates.csv`

## Purpose

The rules-based matrices are useful for triage, but they cannot prove whitespace. The top 100 intersection candidates must be manually reviewed to determine whether they are real substitutes for Alina or only keyword-adjacent.

## Review Priority

Start with:

1. Top 30 by whitespace score.
2. Duplicate candidates across niches.
3. Apps with high review counts.
4. Apps with direct spiritual/coaching/avatar language.
5. Apps that claim daily guidance, habit progress, AI companion, or transformation.

## Required Fields

The review CSV already includes empty manual columns:

- `manual_status`
- `direct_threat_level`
- `has_birthdate_or_spiritual_context`
- `has_daily_action`
- `has_reset_practice`
- `has_avatar_progression`
- `has_visible_progression`
- `pricing_notes`
- `review_notes`

## Status Values

Use these values:

- `pending`
- `reviewed`
- `needs_deeper_review`
- `not_relevant`
- `duplicate`

## Threat Level

Use:

- `high`: product solves a similar daily loop and could directly block Alina positioning.
- `medium`: product owns one or two important pillars but lacks the integrated loop.
- `low`: product is adjacent but not a serious substitute.
- `unclear`: source data is insufficient.

## Binary Feature Values

Use:

- `yes`
- `partial`
- `no`
- `unclear`

## Review Questions

For each candidate, answer:

1. Does it use birth date, astrology, tarot, manifestation, spiritual guidance, or similar meaning layer?
2. Does it produce one concrete daily action?
3. Does it include a short reset practice such as meditation, breathing, reflection, or grounding?
4. Does it create an avatar or identity object?
5. Does that avatar visibly progress because of user behavior?
6. Does it show streaks, levels, XP, progress, milestones, or another return mechanic?
7. What is the paywall?
8. What is the user complaint pattern?
9. Is the product emotional/spiritual, productivity-oriented, entertainment-oriented, or clinical?
10. What exact positioning can Alina avoid or beat?

## Evidence Sources Per Candidate

Minimum:

- App Store / Google Play page.
- Official website if available.
- Pricing page or in-app purchase listing if visible.

Preferred:

- Recent app reviews.
- Reddit/forum mentions.
- SimilarWeb/SensorTower/AppMagic-style public snippets if available.
- Product Hunt or launch page.

## Decision Output

After 100 reviews, produce:

- `docs/competitive/top-intersection-review-synthesis-v1.md`
- `data_processed/top_intersection_review_completed.csv`
- updated `docs/intersections/whitespace-map-v3.md`

## What Would Strengthen the Whitespace Claim

The claim gets stronger if:

- Many candidates have spiritual meaning but no concrete action.
- Many candidates have avatar generation but no behavior-tied progression.
- Many candidates have habits/progress but no emotional/spiritual personalization.
- Many candidates have mindfulness but no identity reinforcement.
- Very few candidates combine all pieces into a single daily flow.

## What Would Weaken the Whitespace Claim

The claim gets weaker if:

- Several high-review apps already have birth-date/spiritual guidance, daily action, reset, avatar progression, and paid subscription.
- Users describe those products with the same job Alina wants to own.
- Competitors already use "best self", "daily transformation", or equivalent positioning with strong execution.

