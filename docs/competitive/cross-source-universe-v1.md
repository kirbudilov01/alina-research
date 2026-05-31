# Cross-Source Universe V1

Generated: 2026-05-31T09:18:11.907Z

## Purpose

This layer normalizes the major source-native collections into one auditable universe. It keeps raw provenance while producing a cross-source deduplicated view across core app-store rows, itch.io, Steam, Mac desktop store, Chrome Web Store search, and Chrome detail pages.

## Summary

- Cross-source raw rows: 59006
- Cross-source dedup rows: 31866
- Raw shard files: 4
- Source groups: 8
- Niches represented: 6
- Rows with source URLs: 59006

Raw rows by source group:

- steam_pc: 21462
- desktop_store: 15397
- mobile_app_store: 12000
- itch_web_game: 7047
- google_play_or_android: 2527
- browser_extension: 252
- unknown_source: 251
- duckduckgo_search: 70

Dedup rows by primary source group:

- steam_pc: 14529
- mobile_app_store: 6958
- itch_web_game: 5696
- desktop_store: 2478
- google_play_or_android: 1646
- browser_extension: 252
- unknown_source: 251
- duckduckgo_search: 56

## Source Group Summary

| Source Group | Raw Rows | Dedup Rows | OK Rows | Top Niches |
| --- | ---: | ---: | ---: | --- |
| mobile_app_store | 12000 | 6958 | 12000 | gaming:2400<br>astrology_esoterics:2400<br>avatar_identity:2400<br>coaching:2400<br>mindfulness:2400 |
| google_play_or_android | 2527 | 1646 | 2527 | astrology_esoterics:577<br>avatar_identity:559<br>gaming:478<br>coaching:475<br>mindfulness:438 |
| duckduckgo_search | 70 | 56 | 70 | gaming:70 |
| steam_pc | 21462 | 14529 | 20847 | gaming:10935<br>mindfulness:5930<br>avatar_identity:3667<br>coaching:534<br>astrology_esoterics:396 |
| itch_web_game | 7047 | 5696 | 6973 | gaming:3816<br>avatar_identity:1721<br>mindfulness:1510 |
| desktop_store | 15397 | 2478 | 15394 | mindfulness:3878<br>gaming_progression:3572<br>coaching:3274<br>avatar_identity:2759<br>astrology_esoterics:1914 |
| browser_extension | 252 | 252 | 251 | astrology_esoterics:55<br>avatar_identity:52<br>coaching:51<br>mindfulness:50<br>gaming_progression:44 |
| unknown_source | 251 | 251 | 251 | astrology_esoterics:55<br>avatar_identity:52<br>coaching:51<br>mindfulness:50<br>gaming_progression:43 |

## Claim Boundary

- This is a normalization/provenance layer, not new market-share proof.
- Cross-source dedup protects the project from double-counting repeated country/query/tag results.
- Source-specific interpretation caveats still apply: Steam/itch are mechanic discovery, desktop store is discovery, Chrome is browser-mechanic evidence, and mobile app-store rows remain the strongest direct consumer-app competitor base.

## Files

- `data_processed/cross_source_universe_raw_index.csv`
- `data_processed/cross_source_universe_raw_parts/part_*.csv`
- `data_processed/cross_source_universe_raw.csv` (local generated full file; ignored by Git to avoid large-file warnings)
- `data_processed/cross_source_universe_dedup.csv`
- `data_processed/cross_source_universe_summary.csv`
