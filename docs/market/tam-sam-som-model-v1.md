# TAM/SAM/SOM Model V1

Generated: 2026-05-31T04:15:38.144Z

## Status

This is a structured sizing model, not a final investment-grade forecast. It turns public market anchors into explicit ranges and makes the assumptions visible.

## Category TAM and Discounted SAM

| Pillar | TAM Low | TAM Base | TAM High | SAM Low | SAM Base | SAM High | Confidence |
|---|---:|---:|---:|---:|---:|---:|---|
| gaming | 113000000000 | 134220000000 | 166000000000 | 226000000 | 671100000 | 1660000000 | medium |
| astrology_esoterics | 5690000000 | 6240000000 | 16070000000 | 170700000 | 374400000 | 1607000000 | low_medium |
| avatar_identity | 1920000000 | 8400000000 | 14130000000 | 38400000 | 420000000 | 1130400000 | medium |
| coaching | 4220000000 | 5000000000 | 6690000000 | 126600000 | 300000000 | 669000000 | medium |
| mindfulness | 1680000000 | 1680000000 | 4620000000 | 134400000 | 252000000 | 1155000000 | medium |
| intersection | 470100000 | 1346400000 | 4561400000 | 37608000 | 201960000 | 1140350000 | low |

## Modeled Intersection

Modeled direct intersection SAM: low 37608000, base 201960000, high 1140350000 USD.

This is intentionally conservative relative to broad category TAMs because Alina is a consumer daily companion, not the entire gaming, coaching, avatar, astrology, or mindfulness market.

## Source Confidence Review

A separate confidence review grades the source base behind the model. It does not change the TAM/SAM math by itself; it tells us how much trust to place in each market range and what needs triangulation.

| Market | Sources | Claims | Confidence Summary | Source Mix | Interpretation |
|---|---:|---:|---|---|---|
| gaming | 2 | 2 | thin_or_contextual | high=1;medium=0;low=0;context=1 | Strong monetization benchmark but weak directness; keep outside direct Alina TAM. |
| mindfulness | 1 | 2 | thin_or_contextual | high=1;medium=0;low=0;context=0 | Closest reset-market anchor, but source base is thin and should be triangulated. |
| avatar_identity | 1 | 2 | thin_but_usable | high=0;medium=1;low=0;context=0 | Large broad TAM with consumer-recurring-use uncertainty; discount heavily. |
| coaching | 4 | 5 | thin_or_contextual | high=1;medium=0;low=3;context=0 | Several sources support coaching demand, but enterprise/career definitions need consumer filtering. |
| astrology_esoterics | 4 | 3 | moderate_source_base | high=0;medium=4;low=0;context=0 | Direct adjacent app category but public values vary widely; range-only until triangulated. |

Source review rows: 12. See `docs/market/market-source-confidence-review-v1.md`.

## SOM Scenarios

| Scenario | Reachable users | Activation | Paid conversion | ARPPU/year | Paid users | Annual revenue | Share of base SAM |
|---|---:|---:|---:|---:|---:|---:|---:|
| conservative_12m | 100000 | 0.35 | 0.03 | 60 | 1050 | 63000 | 0.000312 |
| base_24m | 1000000 | 0.4 | 0.05 | 80 | 20000 | 1600000 | 0.007922 |
| upside_36m | 5000000 | 0.45 | 0.08 | 100 | 180000 | 18000000 | 0.089127 |
| breakout_36m | 10000000 | 0.5 | 0.1 | 120 | 500000 | 60000000 | 0.297089 |

## Interpretation

The market exists, but the current evidence is stronger for adjacent demand than for Alina-specific capture. The next proof layer is not another broad TAM number; it is competitor revenue/pricing enrichment and user-language evidence from reviews/forums.

## Files

- `data_processed/tam_sam_som_model.csv`
- `data_processed/som_sensitivity_scenarios.csv`
- `data_processed/top_intersection_review_candidates.csv`
- `data_processed/market_confidence_summary.csv`
- `data_processed/market_source_confidence_review.csv`

## Caveats

- Astrology app market estimates vary widely across public report pages.
- AI avatar TAM includes enterprise digital humans and must be discounted heavily for consumer identity use.
- Gaming is treated as a mechanic benchmark, not direct TAM.
- SOM scenarios require validation through acquisition, activation, paid conversion, and retention tests.
