# Cross-Source Universe V1

Generated: 2026-05-31T07:18:48.075Z

## Purpose

This layer normalizes the major source-native collections into one auditable universe. It keeps raw provenance while producing a cross-source deduplicated view across core app-store rows, itch.io, Steam, Mac desktop store, Chrome Web Store search, and Chrome detail pages.

## Summary

- Cross-source raw rows: 38240
- Cross-source dedup rows: 22769
- Source groups: 8
- Niches represented: 6
- Rows with source URLs: 38240

Raw rows by source group:

- mobile_app_store: 12000
- steam_pc: 9151
- itch_web_game: 7047
- desktop_store: 6942
- google_play_or_android: 2527
- browser_extension: 252
- unknown_source: 251
- duckduckgo_search: 70

Dedup rows by primary source group:

- mobile_app_store: 6958
- steam_pc: 6384
- itch_web_game: 5696
- google_play_or_android: 1646
- desktop_store: 1526
- browser_extension: 252
- unknown_source: 251
- duckduckgo_search: 56

## Source Group Summary

| Source Group | Raw Rows | Dedup Rows | OK Rows | Top Niches |
| --- | ---: | ---: | ---: | --- |
| mobile_app_store | 12000 | 6958 | 12000 | gaming:2400<br>astrology_esoterics:2400<br>avatar_identity:2400<br>coaching:2400<br>mindfulness:2400 |
| google_play_or_android | 2527 | 1646 | 2527 | astrology_esoterics:577<br>avatar_identity:559<br>gaming:478<br>coaching:475<br>mindfulness:438 |
| duckduckgo_search | 70 | 56 | 70 | gaming:70 |
| steam_pc | 9151 | 6384 | 8893 | gaming:4285<br>mindfulness:3347<br>avatar_identity:589<br>coaching:534<br>astrology_esoterics:396 |
| itch_web_game | 7047 | 5696 | 6973 | gaming:3816<br>avatar_identity:1721<br>mindfulness:1510 |
| desktop_store | 6942 | 1526 | 6938 | mindfulness:1645<br>coaching:1406<br>gaming_progression:1377<br>avatar_identity:1322<br>astrology_esoterics:1192 |
| browser_extension | 252 | 252 | 251 | astrology_esoterics:55<br>avatar_identity:52<br>coaching:51<br>mindfulness:50<br>gaming_progression:44 |
| unknown_source | 251 | 251 | 251 | astrology_esoterics:55<br>avatar_identity:52<br>coaching:51<br>mindfulness:50<br>gaming_progression:43 |

## Claim Boundary

- This is a normalization/provenance layer, not new market-share proof.
- Cross-source dedup protects the project from double-counting repeated country/query/tag results.
- Source-specific interpretation caveats still apply: Steam/itch are mechanic discovery, desktop store is discovery, Chrome is browser-mechanic evidence, and mobile app-store rows remain the strongest direct consumer-app competitor base.

## Files

- `data_processed/cross_source_universe_raw.csv`
- `data_processed/cross_source_universe_dedup.csv`
- `data_processed/cross_source_universe_summary.csv`
