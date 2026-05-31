# Evidence Audit V1

Generated: 2026-05-31T06:51:15.945Z

## Purpose

This register turns the large research corpus into an auditable claim map. Each row states what is currently proved, what is only directional, what evidence files support it, and what remains to validate.

## Status Mix

- proved_v1: 2
- proved_v1_open_requirements: 1
- substantial_v1_not_50k_dedup: 1
- public_listing_inspected_walkthrough_open: 1
- supported_with_ranges_stress_test_and_bottom_up_proxy: 1
- supported_narrowly_with_visual_adjudication: 1
- narrow_supported_public_listing_inspected_walkthrough_open: 1
- prototype_stimulus_ready_unvalidated: 1
- directionally_supported: 1
- supported_for_mvp_framing: 1
- proved_active: 1

## Confidence Mix

- medium: 6
- high: 4
- medium_high: 1
- medium_low: 1

## Claim Register

| Claim ID | Status | Confidence | Primary Metric | Key Gap |
| --- | --- | --- | --- | --- |
| REQ_plan | proved_v1 | high | master plan exists; 16 validation roadmap rows; 11 execution tasks | Needs periodic refresh as validation findings change. |
| REQ_evidence_package_traceability | proved_v1 | high | 185 manifest rows; 0 missing artifacts | Manifest is a reproducibility layer, not a substitute for human validation of claims. |
| REQ_completion_readiness_audit | proved_v1_open_requirements | high | 10 completion requirements; 5 not fully proved/final | Several objective requirements remain partial, directional, draft, or validation-ready rather than fully complete. |
| REQ_competitor_universe | substantial_v1_not_50k_dedup | medium_high | 12552 dedup rows; 17490 raw expanded rows; 6973 usable itch rows; 6000 usable Steam tag rows; 251 usable Chrome Web Store rows; 251 Chrome detail pages | Deduped universe is below the aspirational 30k-50k app target; Product Hunt/AlternativeTo, desktop stores, B2B directories, Reddit mentions, and deeper source-native expansion remain backlog. |
| H1_product_shape_exists | public_listing_inspected_walkthrough_open | medium | 100 top-candidate rows; 90 primary apps; 12 P0 inspection targets; 12 public listings inspected | Strict full loop is rare and still needs actual app/onboarding screenshots to confirm or downgrade public listing claims. |
| H2_markets_have_money | supported_with_ranges_stress_test_and_bottom_up_proxy | medium | intersection SAM base USD 201960000; 12 market sources confidence-reviewed; 6 assumption rows; 6 stress scenarios; 22 strong competitor money proxies | Market sizing still needs actual revenue estimates, paid intelligence, manual in-app paywall validation, and willingness-to-pay prototype evidence for final investor-grade claims. |
| H2_paywall_visible_evidence | supported_narrowly_with_visual_adjudication | medium_low | 2/29 screenshots confirm visible public pricing; 8 partial paid-surface examples | Most web signals remain ambiguous, not found, parent-company pages, login-gated, or require human sign-off/in-app inspection. |
| H3_whitespace_exists | narrow_supported_public_listing_inspected_walkthrough_open | medium | 1/100 strict behavior-tied progression signals; 12 P0 apps queued; 1 public listing visible causality case | Actual app/onboarding inspection results are still missing; public listings can overstate or hide in-app loops. |
| H4_competitive_advantage_plausible | prototype_stimulus_ready_unvalidated | medium | 1 direct reference competitor; 45 high-threat competitors; 8 prototype screens; 6 success/kill metrics | No human prototype session yet proves users understand, prefer, or value the integrated loop. |
| H5_shared_audience_exists | directionally_supported | medium | 20492 audience signal rows; 6 ICP segment hypotheses; 36 ICP validation tests | Keyword/OCR/forum coding and directional ICP segments need human validation, interviews, and prototype tests. |
| H6_product_core_defined | supported_for_mvp_framing | medium | 12552 feature matrix rows; 100 product-core rows; 8 prototype screens | No user prototype evidence yet confirms comprehension, emotional value, or retention impact. |
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
