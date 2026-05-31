# Market Model Update

Date: 2026-05-31

## Added

Generated:

- `data_processed/tam_sam_som_model.csv`
- `data_processed/som_sensitivity_scenarios.csv`
- `data_processed/top_intersection_review_candidates.csv`
- `docs/market/tam-sam-som-model-v1.md`

Added script:

- `scripts/build_market_model.mjs`

Updated:

- `data_processed/market_source_registry.csv`
- `data_processed/market_claims.csv`

## First Modeled Result

The model estimates Alina's direct intersection SAM as:

| Scenario | Modeled SAM |
|---|---:|
| Low | USD 37.6M |
| Base | USD 202.0M |
| High | USD 1.14B |

This is not a final forecast. It is a transparent range based on discounted adjacent markets.

## SOM Scenarios

| Scenario | Annual Revenue |
|---|---:|
| Conservative 12m | USD 63K |
| Base 24m | USD 1.6M |
| Upside 36m | USD 18.0M |
| Breakout 36m | USD 60.0M |

## Interpretation

The evidence supports that the surrounding markets have money. It does not yet prove Alina can capture that money.

The next evidence that matters most:

1. Pricing/paywall extraction from top competitors.
2. App revenue proxy collection.
3. Manual review of the top 100 intersection candidates.
4. Review/forum language showing shared audience and willingness to pay.
5. Acquisition and conversion assumptions by segment.

## Source Notes

Astrology estimates vary widely across public report pages, from roughly USD 5.69B to USD 16.07B for 2026 depending on source and definition. The model keeps this as a range rather than collapsing it into a single number.

Gaming is intentionally treated as a mechanic benchmark rather than direct TAM.

