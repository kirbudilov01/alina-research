# Market Source Confidence Review V1

Generated: 2026-05-31T04:15:37.993Z

## Purpose

This review grades the existing TAM/SAM/SOM source base without adding a new search layer. It separates direct market anchors from broad benchmarks and flags sources that should only be used as range inputs.

## Source Confidence Bands

- medium_use: 5
- high_use: 3
- low_use_range_only: 3
- context_only: 1

## Market Confidence Summary

| Market | Sources | Claims | Market-Size Claims | Confidence | SAM Base | Interpretation |
| --- | ---: | ---: | ---: | --- | ---: | --- |
| gaming | 2 | 2 | 2 | thin_or_contextual | 671100000 | Strong monetization benchmark but weak directness; keep outside direct Alina TAM. |
| mindfulness | 1 | 2 | 2 | thin_or_contextual | 252000000 | Closest reset-market anchor, but source base is thin and should be triangulated. |
| avatar_identity | 1 | 2 | 2 | thin_but_usable | 420000000 | Large broad TAM with consumer-recurring-use uncertainty; discount heavily. |
| coaching | 4 | 5 | 3 | thin_or_contextual | 300000000 | Several sources support coaching demand, but enterprise/career definitions need consumer filtering. |
| astrology_esoterics | 4 | 3 | 3 | moderate_source_base | 374400000 | Direct adjacent app category but public values vary widely; range-only until triangulated. |

## Source Review Table

| Source | Market | Band | Score | Role | Recommended Action |
| --- | --- | --- | ---: | --- | --- |
| SRC-MKT-0005 / International Coaching Federation | coaching | high_use | 9.5 | supporting_context | Separate enterprise/career coaching from consumer daily ritual coaching before final sizing. |
| SRC-MKT-0002 / Boston Consulting Group | gaming | high_use | 8.5 | mechanic_and_monetization_benchmark_not_direct_tam | Keep outside direct TAM; use for monetization/progression benchmark only. |
| SRC-MKT-0003 / Stratistics MRC | mindfulness | high_use | 8 | direct_adjacent_reset_tam_anchor | Retain as model input; add competitor pricing/revenue proxy review before final claim. |
| SRC-MKT-0009 / Research and Markets | astrology_esoterics | medium_use | 7 | direct_adjacent_tam_anchor_requires_variance_review | Retain as model input; add competitor pricing/revenue proxy review before final claim. |
| SRC-MKT-0004 / Global Market Insights | avatar_identity | medium_use | 6 | broad_avatar_ceiling_requires_consumer_discount | Use as low/base/high range input only; require triangulation before final PDF claim. |
| SRC-MKT-0006 / Research and Markets | astrology_esoterics | medium_use | 6 | direct_adjacent_tam_anchor_requires_variance_review | Retain as model input; add competitor pricing/revenue proxy review before final claim. |
| SRC-MKT-0007 / Econ Market Research | astrology_esoterics | medium_use | 6 | direct_adjacent_tam_anchor_requires_variance_review | Retain as model input; add competitor pricing/revenue proxy review before final claim. |
| SRC-MKT-0008 / Global Growth Insights | astrology_esoterics | medium_use | 6 | direct_adjacent_tam_anchor_requires_variance_review | Retain as model input; add competitor pricing/revenue proxy review before final claim. |
| SRC-MKT-0010 / Research and Markets via GlobeNewswire | coaching | low_use_range_only | 5.5 | adjacent_coaching_benchmark_requires_consumer_discount | Separate enterprise/career coaching from consumer daily ritual coaching before final sizing. |
| SRC-MKT-0011 / Future Market Insights | coaching | low_use_range_only | 5 | adjacent_coaching_benchmark_requires_consumer_discount | Separate enterprise/career coaching from consumer daily ritual coaching before final sizing. |
| SRC-MKT-0012 / Persistence Market Research | coaching | low_use_range_only | 5 | adjacent_coaching_benchmark_requires_consumer_discount | Separate enterprise/career coaching from consumer daily ritual coaching before final sizing. |
| SRC-MKT-0001 / Statista | gaming | context_only | 3 | mechanic_and_monetization_benchmark_not_direct_tam | Keep as context only; do not anchor TAM/SAM without stronger source. |

## Implications for TAM/SAM/SOM

- The intersection SAM should remain range-based and low-confidence until source confidence review is paired with competitor revenue/pricing proxies.
- Gaming remains a retention and monetization benchmark, not direct spend TAM.
- Avatar identity and coaching require the heaviest consumer-use-case discount because several sources are broad, enterprise, platform, or career-oriented.
- Astrology has direct category sources, but public market values vary enough that the model should keep low/base/high ranges visible.
- Mindfulness is the cleanest direct reset-market anchor, but still needs at least two additional credible public sources before a final PDF claim.

## Files

- `data_processed/market_source_confidence_review.csv`
- `data_processed/market_confidence_summary.csv`
