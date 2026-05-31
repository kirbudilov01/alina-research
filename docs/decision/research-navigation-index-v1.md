# Research Navigation Index V1

Generated: 2026-05-31T11:17:15.754Z

## Purpose

This index is the map for the whole evidence package. It links requirements, claims, gates, tranches, briefing files, source files, next actions, and claim boundaries so the research can be navigated without opening dozens of CSVs first.

## Package Snapshot

- Navigation rows: 38
- Claim rows: 22
- Requirement rows: 10
- Gate rows: 6
- Manifest artifacts currently tracked: 375
- Validation tranches: 9
- Tranche briefings: 6

Navigation tiers:

- needs_validation: 20
- reference_anchor: 8
- needs_observed_evidence: 6
- directional_claim: 3
- supporting: 1

## Open Validation Route

| Gate | Hypothesis | Status | Tranche | Briefing | Next Action |
| --- | --- | --- | --- | --- | --- |
| GATE_H1_MANUAL_PRODUCT_SHAPE | H1 | not_started | TRANCHE_00_STOP_RULES |  | Capture onboarding, first action, progress/avatar feedback, and paywall screenshots for the highest-risk public-listing rows. |
| GATE_H3_MANUAL_WHITESPACE | H3 | not_started | TRANCHE_00_STOP_RULES |  | Use the public-listing risk read to classify action->avatar causality in walkthrough as visible, inferred, absent, or blocked. |
| GATE_H2_PAID_FLOW | H2 | not_started | TRANCHE_00_STOP_RULES |  | Use stress-test risk rows to prioritize paid-flow inspection and prototype willingness-to-pay questions. |
| GATE_H5_ICP_RECENT_BEHAVIOR | H5 | not_started | TRANCHE_00_STOP_RULES |  | Execute the ICP validation packet for the top two segments, then update segment status and selected primary ICP. |
| GATE_H4_PROTOTYPE_ADVANTAGE | H4 | not_started | TRANCHE_00_STOP_RULES |  | Run prototype sessions with the top two ICP segments and fill the scorecard with observed results. |
| GATE_H6_PRODUCT_CORE | H6 | not_started | TRANCHE_00_STOP_RULES |  | Run prototype sessions and measure loop completion, comprehension, meaning lift, return intent, and paid-depth interest. |

## Highest-Leverage Claims

| Claim | Status | Confidence | Gate | Tranche | Primary File | Boundary |
| --- | --- | --- | --- | --- | --- | --- |
| REQ_completion_readiness_audit | proved_v1_open_requirements | high |  |  | data_processed/research_completion_audit.csv | Several objective requirements remain partial, directional, draft, or validation-ready rather than fully complete. |
| REQ_hypothesis_decision_matrix | proved_v1_open_validation_decisions | high |  |  | data_processed/hypothesis_decision_matrix.csv | Decision rows remain validation gates, not final proof: competitor walkthroughs, paywall sign-off, ICP interviews, and prototype sessions are still open. |
| REQ_market_money_triangulation | proved_v1_triangulated_proxy_not_final | medium_high |  |  | data_processed/market_money_triangulation.csv | This is public-evidence triangulation, not final revenue proof. H2 still needs paid-flow human signoff, product-match notes, and WTP evidence from prototype/ICP sessions. |
| REQ_p0_validation_command_center | proved_v1_operator_ready_open_gates | high |  |  | data_processed/p0_validation_command_center.csv | The command center is operational scaffolding; it still requires actual screenshots, participant evidence, paywall signoff, and updated verdicts. |
| REQ_p0_validation_field_guide | proved_v1_execution_scripts_ready_open_gates | high |  |  | data_processed/p0_validation_field_guide.csv | Field guide is still an execution artifact, not observed validation evidence. |
| REQ_validation_evidence_workspace | proved_v1_intake_workspace_ready_open_gates | high |  |  | data_processed/validation_evidence_workspace_index.csv | Workspace is empty until real screenshots, notes, quotes, and calculations are captured. |
| REQ_validation_batch_01 | proved_v1_batch_ready_open_gates | high |  |  | data_processed/validation_batch_01_index.csv | Batch files are prefilled intake notes; they still need observed screenshots, quotes, measured values, and final verdicts. |
| REQ_validation_batch_02 | proved_v1_p0_breadth_batch_ready_open_gates | high |  |  | data_processed/validation_batch_02_index.csv | Batch files are prefilled intake notes; they still need observed screenshots, quotes, measured values, and final verdicts. |
| REQ_validation_batch_03 | proved_v1_context_batch_ready_open_gates | high |  |  | data_processed/validation_batch_03_index.csv | Batch files are prefilled context notes; they still need observed pricing/paywall checks and conservative signoff decisions. |
| REQ_validation_evidence_rollup | proved_v1_command_level_rollup_open_gates | high |  |  | data_processed/validation_evidence_rollup.csv | Rollup is an intake audit, not a validation result: most rows still need observed screenshots, quotes, calculations, or human signoff. |
| REQ_validation_gate_calculator | proved_v1_calculator_ready_open_gates | high |  |  | data_processed/validation_gate_calculator.csv | The calculator is ready, but current capture rows are still unobserved; it deliberately keeps gates in hold/validate until screenshots, quotes, scores, and human signoff are entered. |
| REQ_competitor_universe | proved_30k_plus_cross_source_dedup_upper_bound_open | medium_high |  |  | data_raw/expanded/all_expanded_raw.csv | The 30k lower-bound dedup target is met; upper-bound 50k expansion and Product Hunt/AlternativeTo, Microsoft Store, B2B directories, Reddit mentions, and additional source-native coverage remain backlog. |
| H1_product_shape_exists | public_listing_inspected_walkthrough_open | medium | GATE_H1_MANUAL_PRODUCT_SHAPE | TRANCHE_00_STOP_RULES | data_processed/top100_competitor_review_scorecard.csv | Strict full loop is rare and still needs actual app/onboarding screenshots to confirm or downgrade public listing claims. |
| H2_markets_have_money | supported_with_ranges_stress_test_and_bottom_up_proxy | medium | GATE_H2_PAID_FLOW | TRANCHE_00_STOP_RULES | data_processed/tam_sam_som_model.csv | Market sizing still needs actual revenue estimates, paid intelligence, manual in-app paywall validation, and willingness-to-pay prototype evidence for final investor-grade claims. |
| H2_paywall_visible_evidence | supported_narrowly_with_visual_adjudication | medium_low | GATE_H2_PAID_FLOW | TRANCHE_00_STOP_RULES | data_processed/web_paywall_signal_matrix.csv | Most web signals remain ambiguous, not found, parent-company pages, login-gated, or require human sign-off/in-app inspection. |
| H3_whitespace_exists | narrow_supported_public_listing_inspected_walkthrough_open | medium | GATE_H3_MANUAL_WHITESPACE | TRANCHE_00_STOP_RULES | data_processed/whitespace_signal_matrix.csv | Actual app/onboarding inspection results are still missing; public listings and cross-source text rules can overstate or hide in-app loops. |
| H4_competitive_advantage_plausible | prototype_stimulus_ready_unvalidated | medium | GATE_H4_PROTOTYPE_ADVANTAGE | TRANCHE_00_STOP_RULES | data_processed/top100_competitor_review_scorecard.csv | No human prototype session yet proves users understand, prefer, or value the integrated loop. |
| H5_shared_audience_exists | directionally_supported | medium | GATE_H5_ICP_RECENT_BEHAVIOR | TRANCHE_00_STOP_RULES | data_processed/audience_signal_matrix.csv | Keyword/OCR/forum coding and directional ICP recruiting assets need human validation, interviews, and prototype tests. |
| H6_product_core_defined | supported_for_mvp_framing | medium | GATE_H6_PRODUCT_CORE | TRANCHE_00_STOP_RULES | data_processed/product_core_evidence_matrix.csv | No user prototype evidence yet confirms comprehension, emotional value, or retention impact. |

## Requirement Map

| Requirement | Status | Strength | Primary File | Next Action |
| --- | --- | --- | --- | --- |
| REQ_01_MASTER_PLAN | proved_v1 | strong | docs/research-expansion-master-plan.md | Update after any manual validation/prototype result. |
| REQ_02_COMPETITOR_UNIVERSE | proved_30k_plus_cross_source_dedup | medium_high | data_raw/expanded/all_expanded_raw.csv | Run next non-search-heavy collectors from source expansion backlog, prioritizing sources that return public HTML without Cloudflare/search-engine dependency. |
| REQ_03_FIVE_MARKET_COVERAGE | proved_v1 | strong | data_raw/expanded/all_expanded_dedup.csv | Keep market-specific validation gates explicit. |
| REQ_04_MARKET_MONEY | supported_with_triangulated_proxy_not_final | medium_high | docs/market/market-sizing-methodology.md | Use stress-test risk rows to prioritize manual paid-flow inspection and willingness-to-pay prototype questions. |
| REQ_05_WHITESPACE | narrow_supported_public_listing_inspected_walkthrough_open | medium | data_processed/whitespace_signal_matrix.csv | Use the public-listing risk reads to prioritize walkthrough screenshots for onboarding, first action, progress/avatar feedback, and paywall boundary. |
| REQ_06_AUDIENCE_ICP | directionally_supported_recruiting_ready | medium | data_processed/audience_signal_matrix.csv | Use the ICP recruiting bridge to recruit the top two segments, then run the validation packet and update capture sheets. |
| REQ_07_COMPETITIVE_ADVANTAGE | prototype_stimulus_ready_not_validated | medium | data_processed/product_core_evidence_matrix.csv | Run prototype sessions with the top two ICP segments and record comprehension, meaning lift, differentiation, return intent, and paid-depth signals. |
| REQ_08_REPORT_PDF | polished_and_russian_narrative_argument_map_done_not_validated_final | medium_high | reports/alina-evidence-first-report-draft.md | After manual inspection and prototype sessions, update the pack with validated screenshots, scorecards, and final claim statuses. |
| REQ_09_VERSIONING_PROVENANCE | proved_active | high | data_processed/evidence_artifact_manifest.csv | Regenerate manifest and commit after each major layer. |
| REQ_10_VALIDATION_GATES | proved_v1_open_gates_capture_ready | strong | data_processed/validation_gap_roadmap.csv | Execute P0 rows in the validation execution dashboard, then update source CSVs and final verdicts. |

## Claim Boundary

This is a navigation artifact, not new evidence. It must not upgrade a claim. It tells the operator where evidence lives, what remains open, and which tranche or briefing should be executed before any claim is strengthened.

## Files

- `data_processed/research_navigation_index.csv`
- `docs/decision/research-navigation-index-v1.md`
