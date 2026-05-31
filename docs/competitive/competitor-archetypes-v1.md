# Competitor Archetypes V1

Date: 2026-05-31
Inputs:

- `data_raw/expanded/all_expanded_dedup.csv`
- `data_processed/competitor_feature_matrix.csv`
- `data_processed/whitespace_signal_matrix.csv`

## Why Archetypes Matter

The expanded dataset is now too large to reason about app-by-app. Archetypes let us compare Alina against market patterns:

- what users already understand
- what competitors monetize
- where products are crowded
- where the integrated loop may still be defensible

## Archetype 1. Content-First Astrology Apps

Typical promise:

- Daily horoscope.
- Birth chart.
- Compatibility.
- Tarot or zodiac readings.

Strengths:

- Immediate personal relevance.
- Familiar onboarding.
- Strong daily content cadence.

Weaknesses:

- Often content-heavy and action-light.
- Personalization may feel decorative.
- Trust risk if claims are deterministic.

Alina implication:

- Do not compete on horoscope volume. Compete on converting meaning into one action and visible identity progress.

## Archetype 2. AI Spiritual Companions

Typical promise:

- Chat with an AI astrologer, tarot reader, spiritual guide, or companion.

Strengths:

- Feels personal.
- High engagement potential.
- Strong AI trend alignment.

Weaknesses:

- Can become generic chat.
- Advice quality and hallucination risk.
- Hard to build trust boundaries.

Alina implication:

- AI should be constrained by the daily loop and source/tone guardrails.

## Archetype 3. Avatar and Identity Generators

Typical promise:

- Create an AI avatar, profile picture, anime image, video avatar, or digital persona.

Strengths:

- Fast wow moment.
- Strong visual shareability.
- Clear creator/identity appeal.

Weaknesses:

- Novelty churn.
- Crowded AI image/video market.
- Weak retention unless tied to ongoing identity or social use.

Alina implication:

- The avatar must be a living progress object. Static generation is not enough.

## Archetype 4. Habit, Goal, and AI Planner Apps

Typical promise:

- Track habits.
- Set goals.
- Get AI plans.
- Maintain streaks.

Strengths:

- Clear utility.
- Measurable progress.
- Strong action orientation.

Weaknesses:

- Motivation fatigue.
- Generic productivity language.
- Emotional meaning often weak.

Alina implication:

- Use action mechanics, but wrap them in emotional/spiritual meaning so the daily task feels less generic.

## Archetype 5. Meditation and Mental Wellness Apps

Typical promise:

- Calm down.
- Sleep better.
- Reduce stress.
- Meditate or breathe daily.

Strengths:

- Clear emotional job.
- Strong subscription benchmarks.
- Established trust patterns.

Weaknesses:

- Content libraries are expensive and crowded.
- Long programs can create friction.
- Clinical adjacency creates compliance/trust constraints.

Alina implication:

- Use a short reset block, not a giant meditation library in MVP.

## Archetype 6. Gamified Wellness and Cozy Progression Apps

Typical promise:

- Make self-care, habits, or mindfulness more playful through quests, rewards, levels, or cozy progression.

Strengths:

- Strong retention mechanics.
- Low-pressure engagement.
- Clear progress feeling.

Weaknesses:

- Can feel gimmicky.
- Game systems may overpower emotional sincerity.
- Rewards can become extrinsic noise.

Alina implication:

- Gamification should be quiet and identity-centered: progress the avatar, streak, and narrative rather than adding a separate game.

## Competitive Map

| Archetype | Meaning | Action | Reset | Avatar | Progression | Alina Risk |
|---|---:|---:|---:|---:|---:|---|
| Content astrology | High | Low | Low | Low | Medium | Becomes another horoscope app |
| AI spiritual companion | High | Medium | Low | Medium | Low/Medium | Becomes generic chat |
| Avatar generator | Low/Medium | Low | Low | High | Low | Novelty churn |
| Habit/AI planner | Low | High | Low/Medium | Low | High | Feels generic/productivity-coded |
| Meditation app | Low/Medium | Medium | High | Low | Medium | Competes with large content libraries |
| Gamified wellness | Medium | Medium | Medium | Medium | High | Feels gimmicky |
| Alina target | High | High | Medium/High | High | High | Must integrate all pieces into one loop |

## Manual Review Priority

Prioritize products that are closest to the Alina target:

1. Full Alina-like signal rows from `whitespace_signal_matrix.csv`.
2. AI spiritual + coaching products.
3. Avatar coaching products.
4. Gamified mindfulness products.
5. High-review-count apps in each pillar.

## Next Matrix Columns

For the top 100 intersection competitors, manually enrich:

- one-line positioning
- onboarding inputs
- birth date usage
- avatar creation flow
- AI chat presence
- daily action card
- meditation/reset feature
- streak/progress system
- social/community layer
- pricing model
- subscription price
- trial length
- primary paywall trigger
- trust/compliance language
- review pain points
- likely target segment
- Alina threat level
- Alina differentiation angle

