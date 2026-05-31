# Market Sizing Stress Test V1

Generated: 2026-05-31T06:42:55.523Z

## Purpose

This layer stress-tests the existing TAM/SAM/SOM model. It does not add new external market claims. Instead, it makes assumptions, confidence discounts, source risk, monetization proxy support, and bottom-up outcome scenarios explicit.

## Assumption Audit Summary

- Assumption rows: 6
- Stress scenarios: 6
- Highest modeled intersection SAM stress case: USD 403,920,000
- Highest annual revenue stress case: USD 75,625,000

Model risk mix:

- medium_proxy_supported_risk: 3
- benchmark_only_not_direct_tam: 1
- high_range_variance_risk: 1
- high_source_and_monetization_risk: 1

Stress read mix:

- niche_early_business: 2
- large_outcome_requires_distribution_and_retention_proof: 2
- tiny_validation_business: 1
- venture_relevant_if_retention_works: 1

## Assumption Audit

| Pillar | SAM Base | Confidence | Sources | Money Proxy | Strong Competitors | Risk |
| --- | ---: | --- | ---: | --- | ---: | --- |
| gaming | 671100000 | medium | 2 | medium_paid_behavior_proxy |  | benchmark_only_not_direct_tam |
| astrology_esoterics | 374400000 | low_medium | 4 | strong_paid_behavior_proxy | 8 | medium_proxy_supported_risk |
| avatar_identity | 420000000 | medium | 1 | strong_paid_behavior_proxy | 7 | medium_proxy_supported_risk |
| coaching | 300000000 | medium | 4 | strong_paid_behavior_proxy |  | high_range_variance_risk |
| mindfulness | 252000000 | medium | 1 | strong_paid_behavior_proxy | 2 | medium_proxy_supported_risk |
| intersection | 201960000 | low | 0 |  |  | high_source_and_monetization_risk |

## Stress Scenarios

| Scenario | Intersection Discount | Reachable Users | Paid Conv. | ARPPU | Annual Revenue | Share of SAM | Read |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | --- |
| defensive | 0.05 | 100000 | 0.02 | 50 | 25000 | 0.000371 | tiny_validation_business |
| conservative | 0.08 | 250000 | 0.03 | 60 | 144000 | 0.001337 | niche_early_business |
| base | 0.15 | 1000000 | 0.05 | 80 | 1600000 | 0.007922 | niche_early_business |
| strong_niche | 0.2 | 2500000 | 0.07 | 95 | 7481250 | 0.027782 | venture_relevant_if_retention_works |
| upside | 0.25 | 5000000 | 0.09 | 110 | 24750000 | 0.073529 | large_outcome_requires_distribution_and_retention_proof |
| breakout | 0.3 | 10000000 | 0.11 | 125 | 75625000 | 0.187228 | large_outcome_requires_distribution_and_retention_proof |

## Interpretation

- The market-money case is supported directionally, but not final: the strongest proof is paid behavior across adjacent competitors, not exact category revenue.
- The intersection SAM should remain a discounted subset of direct-adjacent SAM, never a sum of all five category TAMs.
- Defensive and conservative cases are small unless activation and paid conversion work; the upside cases require distribution, retention, and willingness-to-pay proof.
- Next validation should prioritize paid-flow inspection and prototype willingness-to-pay signals, not more unqualified TAM expansion.

## Files

- `data_processed/market_sizing_assumption_audit.csv`
- `data_processed/market_sizing_stress_test.csv`
