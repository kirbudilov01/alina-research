# Evidence Package Manifest V1

Generated: 2026-05-31T15:04:33.635Z

## Purpose

This manifest makes the research package auditable. It lists key raw data, processed data, docs, reports, charts, PDFs, and generator scripts with row counts, file sizes, source-reference coverage, and short SHA-256 hashes.

## Package Summary

- Manifest rows: 455
- Missing required artifacts: 0
- CSV artifacts: 113
- Total CSV data rows tracked: 241455
- CSV rows with source-like identifiers/URLs/domains/packages: 239809

Artifact types:

- research_doc: 110
- processed_data: 98
- generator_script: 97
- validation_workspace: 95
- report: 19
- raw_data: 15
- chart: 14
- pdf: 6
- docx: 1

Evidence roles:

- decision_artifact: 192
- supporting: 73
- market_money: 58
- audience_icp: 57
- source_claim: 35
- competitive_whitespace: 22
- competitor_universe: 18

## Key Data Artifacts

| File | Role | Rows | Source Ref Rows | Hash |
| --- | --- | ---: | ---: | --- |
| data_processed/audience_signal_matrix.csv | audience_icp | 20492 | 20492 | 865f8a0de8b075d7 |
| data_processed/chrome_webstore_source_expansion_summary.csv | source_claim | 7 | 0 | 67e9e02467d33083 |
| data_processed/community_referral_signal_rows.csv | supporting | 294 | 294 | d704b257e5129880 |
| data_processed/community_referral_summary.csv | supporting | 6 | 6 | eb7826856475f117 |
| data_processed/competitor_feature_matrix.csv | supporting | 12552 | 12552 | b285aff3873487bc |
| data_processed/competitor_revenue_proxy_market_summary.csv | market_money | 5 | 0 | bb80578db00af2cd |
| data_processed/competitor_revenue_proxy_review.csv | audience_icp | 90 | 90 | 168d799198a9e0de |
| data_processed/cross_source_coverage_matrix.csv | source_claim | 39 | 39 | de2c09c904b8fb8c |
| data_processed/cross_source_market_saturation_matrix.csv | market_money | 6 | 6 | 5e601d3678752cf9 |
| data_processed/cross_source_universe_dedup.csv | source_claim | 36694 | 36694 | 3dd03d0c52c61358 |
| data_processed/cross_source_universe_raw_index.csv | source_claim | 5 | 0 | 4cf92614b5562c99 |
| data_processed/cross_source_universe_raw_parts/part_001.csv | source_claim | 15000 | 15000 | 388be0deca7a34ae |
| data_processed/cross_source_universe_raw_parts/part_002.csv | source_claim | 15000 | 15000 | 5e1e76d633a2922b |
| data_processed/cross_source_universe_raw_parts/part_003.csv | source_claim | 15000 | 15000 | f64319055c9d332c |
| data_processed/cross_source_universe_raw_parts/part_004.csv | source_claim | 15000 | 15000 | bf637e577469a346 |
| data_processed/cross_source_universe_raw_parts/part_005.csv | source_claim | 7525 | 7525 | 7433cde78070fc6f |
| data_processed/cross_source_universe_summary.csv | source_claim | 15 | 0 | 6d63bbc5e2033271 |
| data_processed/desktop_store_source_summary.csv | source_claim | 5 | 5 | c5d367149f6ca29e |
| data_processed/evidence_claim_register.csv | decision_artifact | 22 | 0 | f53166925164b33a |
| data_processed/forum_quote_coding_matrix.csv | audience_icp | 72 | 72 | f2fb0ab869195b97 |
| data_processed/global_hypothesis_source_appendix.csv | decision_artifact | 7 | 7 | 7b7fd8250d617c52 |
| data_processed/global_hypothesis_validation_questionnaire.csv | decision_artifact | 9 | 0 | e9cb87d734d19bbe |
| data_processed/hypothesis_decision_matrix.csv | decision_artifact | 6 | 0 | f9b1766fdd7c6809 |
| data_processed/icp_interview_capture_sheet.csv | audience_icp | 96 | 0 | 4494d5bf481075e5 |
| data_processed/icp_recruiting_bridge.csv | audience_icp | 24 | 24 | 5253628a9b650cff |
| data_processed/icp_recruiting_message_bank.csv | audience_icp | 24 | 24 | 1434b751d9085893 |
| data_processed/icp_segment_matrix.csv | audience_icp | 6 | 0 | da930b6880a1c41e |
| data_processed/icp_validation_test_plan.csv | audience_icp | 36 | 36 | 403bffc6be3783b4 |
| data_processed/itch_source_summary.csv | source_claim | 3 | 3 | cebb7999a5443c22 |
| data_processed/manual_competitor_inspection_packet.csv | supporting | 12 | 12 | f0c2f4b26215239b |
| data_processed/manual_competitor_inspection_rubric.csv | supporting | 6 | 0 | ab64b80495811281 |
| data_processed/manual_walkthrough_capture_sheet.csv | supporting | 60 | 60 | 5c29a345cad6534e |
| data_processed/market_claims.csv | market_money | 14 | 14 | ea4d24d882cdef0e |
| data_processed/market_monetization_proxy_matrix.csv | market_money | 5 | 5 | a252897e3d0641c6 |
| data_processed/market_money_triangulation.csv | market_money | 6 | 6 | 3449eec6a0215fb4 |
| data_processed/market_money_triangulation_summary.csv | market_money | 4 | 0 | c69ae58664ce660a |
| data_processed/market_sizing_assumption_audit.csv | market_money | 6 | 6 | e05c2e764989ea84 |
| data_processed/market_sizing_stress_test.csv | market_money | 6 | 0 | 57e7579a20a091ee |
| data_processed/market_source_confidence_review.csv | market_money | 12 | 12 | 0a05c8ffb35c22cf |
| data_processed/p0_validation_command_center.csv | decision_artifact | 75 | 75 | 6a62ed6938ae528d |

## Decision Artifacts

| File | Type | Lines | Bytes | Hash |
| --- | --- | ---: | ---: | --- |
| docs/competitive/human-validation-guide-v1.md | research_doc | 91 | 12102 | b85e6b5dd29fcb2f |
| docs/decision/evidence-audit-v1.md | research_doc | 87 | 9756 | ee273e9aa8578be7 |
| docs/decision/evidence-package-manifest-v1.md | research_doc | 131 | 8847 | 20076421f6150417 |
| docs/decision/hypothesis-decision-matrix-v1.md | research_doc | 51 | 4817 | baa9668809d8dc7f |
| docs/decision/p0-validation-command-center-v1.md | research_doc | 69 | 7260 | 51d22a2990e6aaf3 |
| docs/decision/p0-validation-field-guide-v1.md | research_doc | 136 | 12679 | 839df92dd885c73b |
| docs/decision/polished-evidence-pack-v1.md | research_doc | 38 | 1155 | 8e64c35a31b4c6cd |
| docs/decision/russian-claim-evidence-appendix-v1.md | research_doc | 49 | 8172 | 1de1f6b3bd7b24e1 |
| docs/decision/russian-narrative-evidence-map-v1.md | research_doc | 28 | 8231 | 277ee8df9109e3f8 |
| docs/decision/russian-observed-evidence-ladder-v1.md | research_doc | 137 | 13623 | 78df66e230299567 |
| docs/decision/russian-validation-fieldbook-v1.md | research_doc | 101 | 15509 | 5d779ba6c6fcac7b |
| docs/decision/russian-validation-gate-cards-v1.md | research_doc | 148 | 11346 | 582bf32d9221e72c |
| docs/decision/russian-validation-runway-v1.md | research_doc | 74 | 5304 | 27b2aac7848b60ce |
| docs/decision/validation-batch-01-v1.md | research_doc | 42 | 2909 | 92f524f2d31bc387 |
| docs/decision/validation-batch-02-v1.md | research_doc | 143 | 19194 | aeadb19f7ba53a8a |
| docs/decision/validation-batch-03-v1.md | research_doc | 69 | 6280 | 7ece8ef9641045d8 |
| docs/decision/validation-capture-sheets-v1.md | research_doc | 54 | 2585 | ea9824f1bddab6e5 |
| docs/decision/validation-evidence-rollup-v1.md | research_doc | 86 | 5669 | 88bc02b620427f58 |
| docs/decision/validation-evidence-workspace-v1.md | research_doc | 46 | 2086 | d946096f64152ce4 |
| docs/decision/validation-execution-dashboard-v1.md | research_doc | 50 | 4779 | b496bcc7698e4711 |
| docs/decision/validation-gap-roadmap-v1.md | research_doc | 72 | 6850 | 677d44153f8f7a21 |
| docs/decision/validation-gate-calculator-v1.md | research_doc | 41 | 2285 | 9dc6d389b57a888f |
| docs/decision/validation-tranche-briefings-v1.md | research_doc | 34 | 2557 | 8612369dbb3ace0a |
| docs/decision/validation-tranche-planner-v1.md | research_doc | 183 | 16693 | 9aec9c4fd321f0b8 |
| docs/final-report-outline.md | research_doc | 120 | 2462 | c1f32c179799ccf1 |
| docs/product/product-core-evidence-v1.md | research_doc | 26 | 1444 | 38d7eb6669cbc2a0 |
| docs/product/prototype-validation-stimulus-v1.md | research_doc | 57 | 6109 | 0faba89f050d2b06 |
| docs/strategy/validation-falsification-criteria.md | research_doc | 38 | 1152 | 310c8c3044a11540 |
| docs/visuals/chart-index-v1.md | research_doc | 25 | 886 | 77cba8f26318bcae |
| output/pdf/alina-evidence-first-report-draft.pdf | pdf | 1423 | 194961 | 30a3025c4818d99e |
| output/pdf/alina-evidence-visual-report-v1.pdf | pdf | 322 | 34684 | 3fca188b99b4541c |
| output/pdf/alina-global-hypothesis-report-v1.pdf | pdf | 576 | 110443 | ac0c069279634afa |
| output/pdf/alina-polished-evidence-pack-v1.pdf | pdf | 328 | 44200 | 12a59927174ba750 |
| output/pdf/alina-russian-narrative-report-v1.pdf | pdf | 1142 | 213893 | 37c3bffb98f7cb48 |
| output/pdf/alina-russian-readable-report-v2.pdf | pdf | 542 | 100974 | 3b8f040fba081d4e |
| reports/alina-evidence-first-report-draft.md | report | 1888 | 178806 | 6f03de0bc531a886 |
| reports/alina-global-hypothesis-report-v1.md | report | 181 | 37929 | c66e7e9a1065ba2d |
| reports/alina-russian-narrative-report-v1.md | report | 725 | 148369 | c7b48f1268dcc255 |
| reports/alina-russian-readable-report-v2.md | report | 165 | 27282 | d8324736d0a83348 |
| reports/competitor-universe-expansion-2026-05-21.md | report | 17 | 371 | 6f085c07c40f01e7 |

## Files

- `data_processed/evidence_artifact_manifest.csv`
