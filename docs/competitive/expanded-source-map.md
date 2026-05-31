# Expanded Source Map

Date: 2026-05-31

## Purpose

The first competitor universe was intentionally simple: app stores plus web search. The next version must capture the wider reality of the Alina opportunity:

- mobile apps
- web apps
- desktop apps
- games and PC ecosystems
- AI tools
- coaching platforms
- meditation/wellness products
- astrology and esoteric content businesses
- avatar and identity tools
- communities and forums
- pricing pages and monetization signals

## Source Buckets

| Bucket | Why it matters | Initial method | Output |
|---|---|---|---|
| App Store | iOS monetization and subscription benchmarks | iTunes Search API by keyword | `data_raw/expanded_app_store_*.csv` |
| Google Play | Android supply, ratings, review volume, IAP | `google-play-scraper` and fallback search | `data_raw/expanded_google_play_*.csv` |
| Steam | PC games, cozy RPG, avatar, life sim, ritual loops | Steam search pages by tag/query | `data_raw/expanded_steam_*.csv` |
| Web search | Web apps, SEO competitors, blogs, tools | DuckDuckGo HTML by query | `data_raw/expanded_web_*.csv` |
| Product Hunt | Early-stage web/mobile/AI tools | Search pages by query | `data_raw/expanded_product_hunt_*.csv` |
| AlternativeTo | Tool substitutes and long-tail software | Search/category pages | `data_raw/expanded_alternativeto_*.csv` |
| Review directories | SaaS/coaching/wellness platform evidence | G2/Capterra/Trustpilot style pages where accessible | `data_raw/expanded_reviews_*.csv` |
| Reddit/forums | Pain language, audience overlap, unmet needs | subreddit/search URL registry first, extraction later | `data_raw/forum_signal_registry.csv` |
| Market reports | TAM/SAM/SOM inputs | public report pages, PDFs, analyst summaries | `data_processed/market_source_registry.csv` |
| Company sites | Positioning, pricing, feature depth | pricing and homepage extraction | `data_processed/company_positioning_matrix.csv` |

## Keyword Expansion Strategy

Each niche uses three layers:

1. Core category keywords.
2. Adjacent intent keywords.
3. Intersection keywords.

### Gaming

Core:

- mobile games
- casual games
- cozy games
- idle games
- simulation games
- life simulation
- RPG mobile
- habit game
- wellness game
- mindfulness game

Intersections:

- gamified self improvement
- gamified wellness
- meditation RPG
- habit RPG
- avatar progression game
- daily quest app
- streak app game

### Astrology and Esoterics

Core:

- astrology
- horoscope
- tarot
- birth chart
- zodiac
- numerology
- moon phase
- manifestation
- spiritual guidance
- human design

Intersections:

- AI astrologer
- astrology coach
- daily spiritual guidance
- tarot AI chat
- birth chart compatibility
- spiritual companion app
- manifestation coach

### Avatar and Identity

Core:

- avatar maker
- AI avatar
- digital identity
- character creator
- profile picture generator
- virtual persona
- vtuber
- AI companion avatar

Intersections:

- best self avatar
- avatar habit tracker
- identity transformation app
- AI self portrait
- personal growth avatar
- avatar coaching

### Coaching

Core:

- life coaching
- AI coach
- habit coach
- accountability app
- goal tracker
- personal development
- confidence coach
- mindset coach

Intersections:

- spiritual coach
- AI life companion
- daily coaching action
- micro coaching app
- self improvement AI
- values coach

### Mindfulness

Core:

- meditation
- mindfulness
- breathwork
- sleep meditation
- stress relief
- anxiety relief
- guided meditation
- journaling
- gratitude

Intersections:

- mindful habit tracker
- gamified meditation
- meditation streaks
- mindfulness companion
- emotional reset app
- daily calm challenge

## Minimum Fields

All raw rows should use a superset of the current schema:

- app_name
- publisher
- platform
- source_kind
- source_url
- niche
- keyword
- rank_position
- category
- rating
- review_count
- pricing_type
- iap_present
- subscription_present
- core_features
- retention_mechanics
- personalization_tags
- audience_tags
- monetization_notes
- collected_at
- evidence_quality

## Quality Rules

- Keep low-quality rows, but mark them as `low` evidence quality.
- Prefer source URL and title over inferred category.
- Do not deduplicate across niches too early; cross-niche recurrence is itself useful evidence.
- Deduplicate into a processed table after raw collection.

