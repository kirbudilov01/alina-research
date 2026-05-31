# Evidence Audit V1

Generated: 2026-05-31T04:53:54.378Z

## Purpose

This register turns the large research corpus into an auditable claim map. Each row states what is currently proved, what is only directional, what evidence files support it, and what remains to validate.

## Status Mix

- proved_v1: 2
- proved_v1_open_requirements: 1
- substantial_v1_not_50k_dedup: 1
- partially_supported: 1
- supported_with_ranges: 1
- supported_narrowly: 1
- narrow_supported_not_final: 1
- plausible_unproven: 1
- directionally_supported: 1
- supported_for_mvp_framing: 1
- proved_active: 1

## Confidence Mix

- medium: 5
- high: 4
- medium_low: 2
- medium_high: 1

## Claim Register

| Claim ID | Status | Confidence | Primary Metric | Key Gap |
| --- | --- | --- | --- | --- |
| REQ_plan | proved_v1 | high | master plan exists; 14 validation roadmap rows | Needs periodic refresh as validation findings change. |
| REQ_evidence_package_traceability | proved_v1 | high | 147 manifest rows; 0 missing artifacts | Manifest is a reproducibility layer, not a substitute for human validation of claims. |
| REQ_completion_readiness_audit | proved_v1_open_requirements | high | 10 completion requirements; 6 not fully proved/final | Several objective requirements remain partial, directional, draft, or validation-ready rather than fully complete. |
| REQ_competitor_universe | substantial_v1_not_50k_dedup | medium_high | 12552 dedup rows; 17490 raw expanded rows; 1643 usable itch rows; 3000 usable Steam tag rows; 23 usable P0 external smoke rows; 23 Chrome detail pages | Deduped universe is below the aspirational 30k-50k app target; Product Hunt/AlternativeTo, desktop stores, B2B directories, Reddit mentions, and deeper source-native expansion remain backlog. |
| H1_product_shape_exists | partially_supported | medium | 100 top-candidate rows; 90 primary apps | Strict full loop is rare and needs manual product/onboarding validation. |
| H2_markets_have_money | supported_with_ranges | medium | intersection SAM base USD 201960000; 12 market sources confidence-reviewed; 4/5 strong monetization proxy markets | Market sizing still needs competitor revenue/proxy review and additional triangulation for thin/contextual markets. |
| H2_paywall_visible_evidence | supported_narrowly | medium_low | 2/29 screenshots confirm visible public pricing | Most web signals are ambiguous, not found, parent-company pages, or require human interpretation. |
| H3_whitespace_exists | narrow_supported_not_final | medium | 1/100 strict behavior-tied progression signals; 9 Chrome mechanic references to inspect | Metadata can under-detect in-app mechanics; Chrome battlecards explicitly require screenshot/onboarding inspection for hidden identity metaphors. |
| H4_competitive_advantage_plausible | plausible_unproven | medium_low | 1 direct reference competitor; 45 high-threat competitors; 23 Chrome mechanic battlecards | No human validation or prototype test yet proves users value the loop. |
| H5_shared_audience_exists | directionally_supported | medium | 20492 audience signal rows; 6 ICP segment hypotheses; 36 ICP validation tests | Keyword/OCR/forum coding and directional ICP segments need human validation, interviews, and prototype tests. |
| H6_product_core_defined | supported_for_mvp_framing | medium | 12552 feature matrix rows; 100 product-core rows | No user prototype evidence yet confirms comprehension, emotional value, or retention impact. |
| REQ_final_artifacts_versioned | proved_active | high | current branch pushed through latest commit | Final polished investor/user-facing PDF is still draft-level, not final designed publication. |

## Audit Read

- Strongest proved project layers: plan/backlog, TAM/SAM/SOM v1, matrices, saved artifacts, PDF rendering, and GitHub versioning.
- Traceability layer: evidence package manifest tracks raw/processed data, docs, reports, charts, PDFs, and generator scripts with row counts and short hashes.
- Readiness layer: completion audit maps the original objective to proved, partial, draft, and validation-ready requirements.
- Strongest product evidence: adjacent markets are monetized; the user language around daily ritual/progress is real; strict behavior-tied avatar progression remains narrow in current metadata.
- Weakest remaining proof: human validation of competitors, actual in-app paywall/onboarding flows, real user prototype response, and final source-by-source market sizing review.
- Current decision should remain conditional-go for validation, not full product-build go.

## Files

- `data_processed/evidence_claim_register.csv`
