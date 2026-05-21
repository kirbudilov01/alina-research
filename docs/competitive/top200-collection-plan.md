# Top-200 Collection Plan (Phase 2)

## Objective

Collect and normalize top applications per niche to validate demand signals,
feature overlap, and whitespace opportunities.

## Streams

1. Gaming (RES-7)
2. Astrology/Esoterics (RES-8)
3. Avatar/Identity (RES-9)
4. Coaching (RES-10)
5. Mindfulness (RES-11)

## Collection Fields (minimum)

- app_name
- publisher
- platform
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
- source_url
- collected_at

## Quality Rules

1. Do not keep entries without source_url.
2. Keep one canonical row per app per platform.
3. Mark uncertain fields as unknown, not empty.

## Output

Raw CSV per niche in data_raw/, then normalized merge in data_processed/.
