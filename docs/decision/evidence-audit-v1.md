# Evidence Audit V1

Generated: 2026-05-31T08:07:56.796Z

## Purpose

This register turns the large research corpus into an auditable claim map. Each row states what is currently proved, what is only directional, what evidence files support it, and what remains to validate.

## Status Mix

- proved_v1: 2
- proved_v1_open_requirements: 1
- proved_v1_open_validation_decisions: 1
- proved_v1_operator_ready_open_gates: 1
- proved_v1_execution_scripts_ready_open_gates: 1
- proved_v1_intake_workspace_ready_open_gates: 1
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

- high: 8
- medium: 6
- medium_high: 1
- medium_low: 1

## Claim Register

| Claim ID | Status | Confidence | Primary Metric | Key Gap |
| --- | --- | --- | --- | --- |
| REQ_plan | proved_v1 | high | master plan exists; 16 validation roadmap rows; 11 execution tasks | Needs periodic refresh as validation findings change. |
| REQ_evidence_package_traceability | proved_v1 | high | 230 manifest rows; 0 missing artifacts | Manifest is a reproducibility layer, not a substitute for human validation of claims. |
| REQ_completion_readiness_audit | proved_v1_open_requirements | high | 10 completion requirements; 5 not fully proved/final | Several objective requirements remain partial, directional, draft, or validation-ready rather than fully complete. |
| REQ_hypothesis_decision_matrix | proved_v1_open_validation_decisions | high | 6 hypothesis decision rows; 6 hold/validate; 0 go; 0 stop/pivot | Decision rows remain validation gates, not final proof: competitor walkthroughs, paywall sign-off, ICP interviews, and prototype sessions are still open. |
| REQ_p0_validation_command_center | proved_v1_operator_ready_open_gates | high | 75 command rows; 6 blocker rows; 52 P0 rows | The command center is operational scaffolding; it still requires actual screenshots, participant evidence, paywall signoff, and updated verdicts. |
| REQ_p0_validation_field_guide | proved_v1_execution_scripts_ready_open_gates | high | 8 field guide sections; 75 command rows referenced | Field guide is still an execution artifact, not observed validation evidence. |
| REQ_validation_evidence_workspace | proved_v1_intake_workspace_ready_open_gates | high | 5 workspace lanes; output/validation README and templates generated | Workspace is empty until real screenshots, notes, quotes, and calculations are captured. |
| REQ_competitor_universe | substantial_v1_not_50k_dedup | medium_high | 38240 cross-source raw rows; 22769 cross-source dedup rows; 34 coverage cells; 10 strong and 12 medium source/market cells | Cross-source dedup universe is substantial but still below the aspirational 30k-50k app target; Product Hunt/AlternativeTo, Microsoft Store, B2B directories, Reddit mentions, and deeper source-native expansion remain backlog. |
| H1_product_shape_exists | public_listing_inspected_walkthrough_open | medium | 100 top-candidate rows; 90 primary apps; 12 P0 inspection targets; 12 public listings inspected | Strict full loop is rare and still needs actual app/onboarding screenshots to confirm or downgrade public listing claims. |
| H2_markets_have_money | supported_with_ranges_stress_test_and_bottom_up_proxy | medium | intersection SAM base USD 201960000; 12 market sources confidence-reviewed; 6 assumption rows; 6 stress scenarios; 22 strong competitor money proxies | Market sizing still needs actual revenue estimates, paid intelligence, manual in-app paywall validation, and willingness-to-pay prototype evidence for final investor-grade claims. |
| H2_paywall_visible_evidence | supported_narrowly_with_visual_adjudication | medium_low | 2/29 screenshots confirm visible public pricing; 8 partial paid-surface examples | Most web signals remain ambiguous, not found, parent-company pages, login-gated, or require human sign-off/in-app inspection. |
| H3_whitespace_exists | narrow_supported_public_listing_inspected_walkthrough_open | medium | 1/100 strict behavior-tied progression signals; 6 cross-source saturation markets; 2 benchmark-only markets; 12 P0 apps queued | Actual app/onboarding inspection results are still missing; public listings and cross-source text rules can overstate or hide in-app loops. |
| H4_competitive_advantage_plausible | prototype_stimulus_ready_unvalidated | medium | 1 direct reference competitor; 45 high-threat competitors; 8 prototype screens; 6 success/kill metrics | No human prototype session yet proves users understand, prefer, or value the integrated loop. |
| H5_shared_audience_exists | directionally_supported | medium | 20492 audience signal rows; 6 ICP segment hypotheses; 36 ICP validation tests | Keyword/OCR/forum coding and directional ICP segments need human validation, interviews, and prototype tests. |
| H6_product_core_defined | supported_for_mvp_framing | medium | 12552 feature matrix rows; 100 product-core rows; 8 prototype screens | No user prototype evidence yet confirms comprehension, emotional value, or retention impact. |
| REQ_final_artifacts_versioned | proved_active | high | current branch pushed through latest commit | Final polished investor/user-facing PDF is still draft-level, not final designed publication. |

## Audit Read

- Strongest proved project layers: plan/backlog, TAM/SAM/SOM v1, matrices, saved artifacts, PDF rendering, and GitHub versioning.
- Traceability layer: evidence package manifest tracks raw/processed data, docs, reports, charts, PDFs, and generator scripts with row counts and short hashes.
- Readiness layer: completion audit maps the original objective to proved, partial, draft, and validation-ready requirements.
- Decision layer: hypothesis decision matrix converts H1-H6 into go/hold/kill gates and keeps open validation burden visible.
- Execution layer: P0 validation command center translates open gates into operator-ready evidence capture rows.
- Field layer: P0 validation field guide provides scripts, evidence naming, and post-validation rebuild protocol.
- Intake layer: validation evidence workspace creates local folders and templates for screenshots, notes, quotes, and scorecard calculations.
- Strongest product evidence: adjacent markets are monetized; the user language around daily ritual/progress is real; strict behavior-tied avatar progression remains narrow in current metadata.
- Weakest remaining proof: human validation of competitors, actual in-app paywall/onboarding flows, real user prototype response, and final source-by-source market sizing review.
- Current decision should remain conditional-go for validation, not full product-build go.

## Files

- `data_processed/evidence_claim_register.csv`
