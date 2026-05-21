# Research Report: Multi-Source Top 300 Collection
**Date:** 2026-05-21

## Overview
Collected top 300 records for 5 target niches: Gaming, Astrology & Esoterics, Avatar & Identity, Coaching, and Mindfulness. Data was sourced from Google Play, App Store (iTunes API), and Web Search (DuckDuckGo).

## Collection Summary
| Niche | App Store | Web Search | Total |
|-------|-----------|------------|-------|
| Gaming | 250 | 50 | 300 |
| Astrology & Esoterics | 224 | 67 | 291 |
| Avatar & Identity | 235 | 61 | 296 |
| Coaching | 243 | 57 | 300 |
| Mindfulness | 245 | 55 | 300 |

*Note: Google Play results were skipped or failed in this run due to network/scraping limitations, falling back to other sources.*

## Per-Niche Row Counts (CSV Line Counts)
- data_raw/top300_gaming_multi_source.csv: 301 lines
- data_raw/top300_astrology_esoterics_multi_source.csv: 292 lines
- data_raw/top300_avatar_identity_multi_source.csv: 297 lines
- data_raw/top300_coaching_multi_source.csv: 301 lines
- data_raw/top300_mindfulness_multi_source.csv: 301 lines

## Known Quality Caveats
- **Source Imbalance**: Google Play scraper failed to return data in the current session, results are dominated by App Store and Web Search.
- **Web Search Noise**: Web search results (DuckDuckGo) provide app names and snippets but lack structured fields like rating or publisher in many cases.
- **Deduplication**: Deduplication performed on (app_name, platform, source_kind). Some near-duplicates (e.g., "App Name" vs "App Name - Pro") might still exist.
- **Missing Fields**: Fields like `iap_present` and `subscription_present` are sparsely populated for non-store sources.
