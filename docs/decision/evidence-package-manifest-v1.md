# Evidence Package Manifest V1

Generated: 2026-06-01T03:15:24.425Z

## Purpose

This manifest makes the research package auditable. It lists key raw data, processed data, docs, reports, charts, PDFs, and generator scripts with row counts, file sizes, source-reference coverage, and short SHA-256 hashes.

## Package Summary

- Manifest rows: 557
- Missing required artifacts: 0
- CSV artifacts: 137
- Total CSV data rows tracked: 243428
- CSV rows with source-like identifiers/URLs/domains/packages: 241678

Artifact types:

- research_doc: 136
- generator_script: 123
- processed_data: 121
- validation_workspace: 114
- report: 22
- raw_data: 16
- chart: 14
- pdf: 10
- docx: 1

Evidence roles:

- decision_artifact: 240
- supporting: 108
- market_money: 64
- audience_icp: 57
- source_claim: 38
- competitive_whitespace: 32
- competitor_universe: 18

## Key Data Artifacts

| File | Role | Rows | Source Ref Rows | Hash |
| --- | --- | ---: | ---: | --- |
| data_processed/alina_sample_style_gap_map.csv | supporting | 9 | 5 | 58729260575f0b05 |
| data_processed/alina_sample_style_profile.csv | supporting | 42 | 42 | d2152d96ac43f8bb |
| data_processed/audience_signal_matrix.csv | audience_icp | 20492 | 20492 | 865f8a0de8b075d7 |
| data_processed/chrome_webstore_source_expansion_summary.csv | source_claim | 7 | 0 | 67e9e02467d33083 |
| data_processed/community_referral_signal_rows.csv | supporting | 294 | 294 | d704b257e5129880 |
| data_processed/community_referral_summary.csv | supporting | 6 | 6 | eb7826856475f117 |
| data_processed/company_positioning_matrix.csv | competitive_whitespace | 70 | 70 | a3271779e9cd3332 |
| data_processed/competitor_feature_matrix.csv | supporting | 12552 | 12552 | b285aff3873487bc |
| data_processed/competitor_revenue_proxy_market_summary.csv | market_money | 5 | 0 | bb80578db00af2cd |
| data_processed/competitor_revenue_proxy_review.csv | audience_icp | 90 | 90 | 168d799198a9e0de |
| data_processed/competitor_taxonomy_cleanup_queue.csv | supporting | 8 | 8 | d488f015a2d8789e |
| data_processed/cross_source_coverage_matrix.csv | source_claim | 44 | 44 | 789ee9f633a992a8 |
| data_processed/cross_source_market_saturation_matrix.csv | market_money | 6 | 6 | 955a85abc4872e35 |
| data_processed/cross_source_universe_dedup.csv | source_claim | 37176 | 37176 | 28638b8a04824c81 |
| data_processed/cross_source_universe_raw_index.csv | source_claim | 5 | 0 | 01877995baca77ac |
| data_processed/cross_source_universe_raw_parts/part_001.csv | source_claim | 15000 | 15000 | 388be0deca7a34ae |
| data_processed/cross_source_universe_raw_parts/part_002.csv | source_claim | 15000 | 15000 | 5e1e76d633a2922b |
| data_processed/cross_source_universe_raw_parts/part_003.csv | source_claim | 15000 | 15000 | f64319055c9d332c |
| data_processed/cross_source_universe_raw_parts/part_004.csv | source_claim | 15000 | 15000 | bf637e577469a346 |
| data_processed/cross_source_universe_raw_parts/part_005.csv | source_claim | 8085 | 8085 | 15dfaa55c28e6b56 |
| data_processed/cross_source_universe_summary.csv | source_claim | 16 | 0 | 5301b0b204e64c89 |
| data_processed/desktop_store_source_summary.csv | source_claim | 5 | 5 | c5d367149f6ca29e |
| data_processed/evidence_claim_register.csv | decision_artifact | 22 | 0 | 6e2b3efe46b2e189 |
| data_processed/forum_quote_coding_matrix.csv | audience_icp | 72 | 72 | f2fb0ab869195b97 |
| data_processed/global_competitor_archetype_rollup.csv | supporting | 7 | 0 | 48cb0525926238b5 |
| data_processed/global_goal_evidence_coverage.csv | decision_artifact | 8 | 0 | 9a2d8d695c180daa |
| data_processed/global_hypothesis_gate_snapshot.csv | decision_artifact | 6 | 0 | 93be1bc96ec5e946 |
| data_processed/global_hypothesis_source_appendix.csv | decision_artifact | 18 | 18 | d32db009ea437355 |
| data_processed/global_hypothesis_validation_questionnaire.csv | decision_artifact | 9 | 0 | e9cb87d734d19bbe |
| data_processed/global_market_sizing_methodology.csv | market_money | 6 | 6 | 375ece2e2328fd3f |
| data_processed/global_next_validation_backlog.csv | decision_artifact | 22 | 22 | 3d5175a0d7c04e56 |
| data_processed/global_niche_count_rollup.csv | supporting | 5 | 5 | f10b77fd8c52c99a |
| data_processed/global_report_readability_audit.csv | decision_artifact | 10 | 0 | a138425428c3a20f |
| data_processed/global_source_quality_gap_audit.csv | source_claim | 5 | 5 | 1432921baf556169 |
| data_processed/global_whitespace_audience_synthesis.csv | competitive_whitespace | 5 | 5 | 893cbe4acd1c6909 |
| data_processed/hypothesis_decision_matrix.csv | decision_artifact | 6 | 0 | f9b1766fdd7c6809 |
| data_processed/icp_interview_capture_sheet.csv | audience_icp | 96 | 0 | 9c647ffac5412ef0 |
| data_processed/icp_recruiting_bridge.csv | audience_icp | 24 | 24 | 5253628a9b650cff |
| data_processed/icp_recruiting_message_bank.csv | audience_icp | 24 | 24 | 1434b751d9085893 |
| data_processed/icp_segment_matrix.csv | audience_icp | 6 | 0 | da930b6880a1c41e |

## Decision Artifacts

| File | Type | Lines | Bytes | Hash |
| --- | --- | ---: | ---: | --- |
| docs/competitive/human-validation-guide-v1.md | research_doc | 91 | 12102 | b85e6b5dd29fcb2f |
| docs/decision/evidence-audit-v1.md | research_doc | 87 | 9758 | 28cfc31515e5905e |
| docs/decision/evidence-package-manifest-v1.md | research_doc | 131 | 8954 | 4f09b28298779cd9 |
| docs/decision/global-goal-evidence-coverage-v1.md | research_doc | 31 | 6149 | d32e797b63ba8926 |
| docs/decision/global-next-validation-backlog-v1.md | research_doc | 62 | 11960 | 2112606516152be7 |
| docs/decision/global-report-readability-audit-v1.md | research_doc | 31 | 5768 | fd9fcd8f80a04b98 |
| docs/decision/global-validation-executive-rollup-v1.md | research_doc | 31 | 3880 | 46476652018afc06 |
| docs/decision/hypothesis-decision-matrix-v1.md | research_doc | 51 | 4817 | baa9668809d8dc7f |
| docs/decision/p0-observed-evidence-intake-v1.md | research_doc | 55 | 9100 | 34de89d985279897 |
| docs/decision/p0-validation-command-center-v1.md | research_doc | 69 | 7260 | 51d22a2990e6aaf3 |
| docs/decision/p0-validation-execution-slice-v1.md | research_doc | 48 | 9321 | 0ec66bbe016d070f |
| docs/decision/p0-validation-field-guide-v1.md | research_doc | 136 | 12679 | 839df92dd885c73b |
| docs/decision/polished-evidence-pack-v1.md | research_doc | 38 | 1155 | 8e64c35a31b4c6cd |
| docs/decision/russian-claim-evidence-appendix-v1.md | research_doc | 49 | 8174 | ff710e5c3c64f16b |
| docs/decision/russian-narrative-evidence-map-v1.md | research_doc | 28 | 8231 | 277ee8df9109e3f8 |
| docs/decision/russian-observed-evidence-ladder-v1.md | research_doc | 137 | 13623 | 78df66e230299567 |
| docs/decision/russian-report-steering-brief-v1.md | research_doc | 46 | 10397 | 67938c88a6354e0a |
| docs/decision/russian-validation-fieldbook-v1.md | research_doc | 101 | 15509 | 5d779ba6c6fcac7b |
| docs/decision/russian-validation-gate-cards-v1.md | research_doc | 148 | 11346 | 582bf32d9221e72c |
| docs/decision/russian-validation-runway-v1.md | research_doc | 74 | 5304 | 27b2aac7848b60ce |
| docs/decision/validation-batch-01-v1.md | research_doc | 42 | 2909 | 92f524f2d31bc387 |
| docs/decision/validation-batch-02-v1.md | research_doc | 143 | 19194 | aeadb19f7ba53a8a |
| docs/decision/validation-batch-03-v1.md | research_doc | 69 | 6280 | 7ece8ef9641045d8 |
| docs/decision/validation-capture-sheets-v1.md | research_doc | 54 | 2585 | ede0f3473869dfb4 |
| docs/decision/validation-evidence-rollup-v1.md | research_doc | 86 | 5669 | 88bc02b620427f58 |
| docs/decision/validation-evidence-workspace-v1.md | research_doc | 46 | 2086 | d946096f64152ce4 |
| docs/decision/validation-execution-dashboard-v1.md | research_doc | 50 | 4779 | b496bcc7698e4711 |
| docs/decision/validation-gap-roadmap-v1.md | research_doc | 72 | 6850 | 677d44153f8f7a21 |
| docs/decision/validation-gate-calculator-v1.md | research_doc | 40 | 2371 | 80aeb8d5c29b3c04 |
| docs/decision/validation-tranche-briefings-v1.md | research_doc | 34 | 2557 | 8612369dbb3ace0a |
| docs/decision/validation-tranche-planner-v1.md | research_doc | 183 | 16693 | 9aec9c4fd321f0b8 |
| docs/final-report-outline.md | research_doc | 120 | 2462 | c1f32c179799ccf1 |
| docs/product/product-core-evidence-v1.md | research_doc | 26 | 1444 | 38d7eb6669cbc2a0 |
| docs/product/prototype-validation-stimulus-v1.md | research_doc | 57 | 6109 | 0faba89f050d2b06 |
| docs/strategy/validation-falsification-criteria.md | research_doc | 38 | 1152 | 310c8c3044a11540 |
| docs/visuals/chart-index-v1.md | research_doc | 25 | 886 | 77cba8f26318bcae |
| output/pdf/ALINA_RESEARCH_FULL_RU.pdf | pdf | 1455 | 282244 | f7e90c4cc83fb6be |
| output/pdf/ALINA_RESEARCH_SEND_NOW_RU.pdf | pdf | 1455 | 282244 | f7e90c4cc83fb6be |
| output/pdf/alina-evidence-first-report-draft.pdf | pdf | 1423 | 194961 | 30a3025c4818d99e |
| output/pdf/alina-evidence-visual-report-v1.pdf | pdf | 322 | 34684 | 3fca188b99b4541c |

## Files

- `data_processed/evidence_artifact_manifest.csv`
