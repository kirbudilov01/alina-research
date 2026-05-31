# Source Expansion Backlog V1

Generated: 2026-05-31T07:11:10.077Z

## Purpose

The current universe is substantial, but still too mobile-store-heavy and below the aspirational 30k-50k raw collection target. This backlog turns the next expansion into concrete collector work, with priorities, outputs, risks, and expected evidence quality.

## Priority Mix

- P1: 4
- P0: 3
- P2: 3

## Source Backlog

| ID | Priority | Source | Markets | Expected Rows | Output | Main Risk |
| --- | --- | --- | --- | ---: | --- | --- |
| SRC-001 | P0 | Product Hunt | coaching<br>mindfulness<br>avatar_identity<br>astrology_esoterics | 1500-4000 | `data_raw/expanded_product_hunt_raw.csv` | Search pages may rate-limit or require JS; fallback to web search site:producthunt.com/posts. |
| SRC-002 | P0 | AlternativeTo | coaching<br>mindfulness<br>avatar_identity | 1000-2500 | `data_raw/expanded_alternativeto_raw.csv` | Some pages may block automated HTML; keep URL registry even if details are partial. |
| SRC-003 | P0 | Chrome Web Store / browser extensions | coaching<br>mindfulness<br>avatar_identity | 1000-3000 | `data_raw/expanded_chrome_extensions_raw.csv` | Chrome Web Store native search is dynamic; keep batches small and avoid search-engine-heavy expansion unless explicitly needed. |
| SRC-004 | P1 | Microsoft Store / Mac App Store web | coaching<br>mindfulness<br>avatar_identity<br>gaming | 1000-7000 | `data_raw/expanded_desktop_store_raw.csv` | Mac App Store API is source-native but overlaps Apple software search; dedupe carefully by bundle/name/source and treat as discovery evidence. |
| SRC-005 | P1 | itch.io / indie game directories | gaming<br>mindfulness<br>avatar_identity | 2000-6000 | `data_raw/expanded_itch_raw.csv` | Large noisy corpus; useful for mechanic inspiration more than monetization proof. |
| SRC-006 | P1 | G2 / Capterra / GetApp style directories | coaching<br>mindfulness | 500-1500 | `data_raw/expanded_b2b_review_directories_raw.csv` | Anti-bot and commercial pages; store only source URLs and visible public metadata. |
| SRC-007 | P1 | Reddit/subreddit discovery as competitor source | all | 500-2000 mentions | `data_raw/expanded_reddit_competitor_mentions_raw.csv` | Mentions are noisy and must be coded as qualitative evidence, not ranked market share. |
| SRC-008 | P2 | Public website/pricing pages for top candidates | all | 500-1200 pages | `data_raw/company_positioning_raw.csv;data_processed/company_positioning_matrix.csv` | Requires careful domain matching; parent-company pages can mislead. |
| SRC-009 | P2 | Steam deep tag expansion | gaming<br>mindfulness<br>avatar_identity | 3000-8000 | `data_raw/expanded_steam_tags_raw.csv` | High noise; use for mechanics and saturation, not direct mobile competitor claims. |
| SRC-010 | P2 | Market reports and PDF source expansion | all | 50-150 claims | `data_processed/market_source_registry_v2.csv;data_processed/market_claims_v2.csv` | Many market reports are paywalled; cite only public claims and confidence-tag them. |

## Recommended Next Run Order

1. Detail-fetch the controlled Chrome Web Store smoke-pass candidates and use them as browser-mechanic references.
2. Product Hunt + AlternativeTo via source-native/curated-list approaches to add web app / AI tool competitors.
3. Reddit competitor mentions to capture user-named alternatives and pain language.
4. Company positioning pages for P0/P1 competitors to improve moat and paywall evidence.
5. Market report source expansion to strengthen TAM/SAM/SOM confidence.

## Guardrails

- Keep raw rows even when noisy, but mark evidence quality explicitly.
- Do not merge qualitative mentions with app-store competitors without source_kind and confidence tags.
- Treat Product Hunt, Reddit, itch.io, and Steam tags as discovery/mechanic sources until manually validated.
- Preserve every source URL and query string so the final PDF can defend provenance.

## Files

- `data_processed/source_expansion_backlog.csv`
