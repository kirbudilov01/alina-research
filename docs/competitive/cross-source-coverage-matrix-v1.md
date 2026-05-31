# Cross-Source Coverage Matrix V1

Generated: 2026-05-31T18:18:32.662Z

## Purpose

This matrix converts the cross-source universe into a market/source coverage read. It identifies which source groups are strong enough for discovery and triangulation, which are only directional, and which should remain context-only until expanded or manually validated.

## Summary

- Coverage cells: 44
- Strong coverage cells: 11
- Medium coverage cells: 12
- Thin but usable cells: 15
- Weak/context-only cells: 6

Coverage band mix:

- thin_but_usable: 15
- medium_coverage: 12
- strong_coverage: 11
- weak_or_context_only: 6

Market role mix:

- supporting_discovery: 9
- pc_progression_and_mechanic_benchmark: 5
- direct_consumer_app_competitor_base: 5
- desktop_web_productivity_and_wellness_discovery: 5
- android_cross_check_and_pricing_path: 5
- forum_competitor_and_need_discovery: 5
- browser_mechanic_reference: 5
- indie_mechanic_and_experiment_discovery: 3
- legacy_smoke_discovery_low_weight: 1
- progression_benchmark: 1

## Source Summary

| Source Group | Cells | Raw Rows | Dedup Rows | Strong/Medium Cells | Weak Cells |
| --- | ---: | ---: | ---: | ---: | ---: |
| steam_pc | 5 | 27642 | 21473 | 5 | 0 |
| mobile_app_store | 5 | 12000 | 8103 | 5 | 0 |
| itch_web_game | 3 | 7047 | 6395 | 3 | 0 |
| desktop_store | 5 | 15397 | 2954 | 5 | 0 |
| community_forum | 5 | 2339 | 1852 | 0 | 2 |
| google_play_or_android | 5 | 2527 | 1808 | 5 | 0 |
| company_positioning | 5 | 560 | 482 | 0 | 2 |
| browser_extension | 5 | 252 | 252 | 0 | 1 |
| unknown_source | 5 | 251 | 251 | 0 | 1 |
| duckduckgo_search | 1 | 70 | 56 | 0 | 0 |

## Strongest Cells

| Source | Market | Dedup | OK % | Role | Use |
| --- | --- | ---: | ---: | --- | --- |
| steam_pc | gaming | 10250 | 97.2 | pc_progression_and_mechanic_benchmark | Use for market saturation, competitor discovery, and source-triangulation; sample manually before final claims. |
| steam_pc | avatar_identity | 5244 | 97.1 | pc_progression_and_mechanic_benchmark | Use for market saturation, competitor discovery, and source-triangulation; sample manually before final claims. |
| steam_pc | mindfulness | 5128 | 96.5 | pc_progression_and_mechanic_benchmark | Use for market saturation, competitor discovery, and source-triangulation; sample manually before final claims. |
| itch_web_game | gaming | 3292 | 100.0 | indie_mechanic_and_experiment_discovery | Use for market saturation, competitor discovery, and source-triangulation; sample manually before final claims. |
| mobile_app_store | gaming | 1931 | 100.0 | direct_consumer_app_competitor_base | Use for market saturation, competitor discovery, and source-triangulation; sample manually before final claims. |
| mobile_app_store | coaching | 1679 | 100.0 | direct_consumer_app_competitor_base | Use for market saturation, competitor discovery, and source-triangulation; sample manually before final claims. |
| itch_web_game | avatar_identity | 1623 | 98.4 | indie_mechanic_and_experiment_discovery | Use for market saturation, competitor discovery, and source-triangulation; sample manually before final claims. |
| mobile_app_store | mindfulness | 1584 | 100.0 | direct_consumer_app_competitor_base | Use for market saturation, competitor discovery, and source-triangulation; sample manually before final claims. |
| itch_web_game | mindfulness | 1480 | 96.9 | indie_mechanic_and_experiment_discovery | Use for market saturation, competitor discovery, and source-triangulation; sample manually before final claims. |
| mobile_app_store | avatar_identity | 1461 | 100.0 | direct_consumer_app_competitor_base | Use for market saturation, competitor discovery, and source-triangulation; sample manually before final claims. |
| mobile_app_store | astrology_esoterics | 1448 | 100.0 | direct_consumer_app_competitor_base | Use for market saturation, competitor discovery, and source-triangulation; sample manually before final claims. |

## Claim Boundary

- Strong coverage does not prove market share or product-market fit.
- Strong coverage means the source/market cell has enough public rows and provenance to support discovery, saturation mapping, and manual sampling.
- Thin or weak cells should not support investor-grade claims without expansion or direct validation.

## Files

- `data_processed/cross_source_coverage_matrix.csv`
