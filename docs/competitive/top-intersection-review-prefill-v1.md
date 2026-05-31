# Top Intersection Review Prefill V1

Generated: 2026-05-31T02:06:45.946Z

## Purpose

This file pre-fills the top-100 manual competitor review with App Store metadata and heuristic fields. It is not a substitute for manual review; it is a triage accelerator.

## Output

- `data_processed/top_intersection_review_prefill.csv`

## Coverage

- app_store_lookup_enriched: 100

## Threat Levels

- medium_high: 68
- high: 20
- medium: 12

## Archetypes

- manifestation_tool: 30
- avatar_identity_coaching: 23
- gamified_self_improvement: 16
- astrology_guidance: 12
- tarot_or_oracle_guidance: 9
- faith_devotional_habit: 8
- ai_companion_roleplay: 2

## Heuristic Feature Coverage

| Field | Counts |
|---|---|
| Spiritual / birth-date context | yes: 100 |
| Daily action | yes: 99, partial: 1 |
| Reset practice | yes: 89, no: 11 |
| Avatar progression | partial: 77, yes: 23 |
| Visible progression | yes: 100 |

## Highest-Priority Manual Checks

| Rank | App | Threat | Archetype | Spiritual | Action | Reset | Avatar Progression | Visible Progression |
|---:|---|---|---|---|---|---|---|---|
| 1 | Shepherd: Spiritual Bible BFF | medium_high | faith_devotional_habit | yes | yes | yes | partial | yes |
| 2 | Pitstop: Scale Human Potential | medium_high | gamified_self_improvement | yes | yes | yes | partial | yes |
| 3 | Pitstop: Scale Human Potential | medium_high | gamified_self_improvement | yes | yes | yes | partial | yes |
| 4 | ModernSam: LVL up your life | medium_high | manifestation_tool | yes | yes | yes | partial | yes |
| 5 | Muna: Astrology & Horoscope | medium_high | astrology_guidance | yes | yes | yes | partial | yes |
| 6 | yap: astrology & dream journal | medium_high | astrology_guidance | yes | yes | yes | partial | yes |
| 7 | Lunaria AI - Soulmate Drawing | high | astrology_guidance | yes | yes | yes | yes | yes |
| 8 | Law of Attraction Toolbox | medium_high | manifestation_tool | yes | yes | yes | partial | yes |
| 10 | 369 Manifestation & Meditation | medium_high | manifestation_tool | yes | yes | yes | partial | yes |
| 11 | Zodya Tarot Coffee Reading AI | medium_high | astrology_guidance | yes | yes | yes | partial | yes |
| 12 | LunaMate: AI Fanstasy Roleplay | high | tarot_or_oracle_guidance | yes | yes | yes | yes | yes |
| 13 | Kokoa AI: Roleplay AI Chat | high | tarot_or_oracle_guidance | yes | yes | yes | yes | yes |
| 14 | Harem AI - Chat & Talk & Crush | medium_high | tarot_or_oracle_guidance | yes | yes | yes | partial | yes |
| 15 | Spark AI: Chat with Characters | high | tarot_or_oracle_guidance | yes | yes | yes | yes | yes |
| 17 | Soulful Navigation | medium_high | avatar_identity_coaching | yes | yes | yes | partial | yes |
| 18 | Youiee: Come back to YOU | high | gamified_self_improvement | yes | yes | yes | yes | yes |
| 19 | Habit Tracker - AI Planner | high | gamified_self_improvement | yes | yes | yes | yes | yes |
| 20 | OtterLife: AI Health Tracker | medium_high | gamified_self_improvement | yes | yes | yes | partial | yes |
| 21 | Mindvalley: Self Improvement | medium_high | manifestation_tool | yes | yes | yes | partial | yes |
| 22 | Cultivate Personal Development | medium_high | manifestation_tool | yes | yes | yes | partial | yes |
| 23 | LifeWheel Goal Habit Tracker | medium_high | gamified_self_improvement | yes | yes | yes | partial | yes |
| 25 | InfluAI: Be an influencer | medium_high | avatar_identity_coaching | yes | yes | yes | partial | yes |
| 26 | QuitBuddy: Quit Addiction | medium_high | gamified_self_improvement | yes | yes | yes | partial | yes |
| 28 | Ask Nithyananda AI | medium_high | avatar_identity_coaching | yes | yes | yes | partial | yes |
| 29 | AI Chatbot - Chat Companion | medium_high | astrology_guidance | yes | yes | yes | partial | yes |

## Caveats

- App Store lookup does not reliably expose subscription price or full IAP menus.
- `has_avatar_progression=partial` often means avatar/photo/identity is present, not that behavior-tied progression is proven.
- `direct_threat_level` is heuristic and should be overwritten during manual review.
- Duplicate apps across niches should be merged or marked duplicate in the completed review file.
