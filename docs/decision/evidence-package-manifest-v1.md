# Evidence Package Manifest V1

Generated: 2026-05-31T08:40:56.477Z

## Purpose

This manifest makes the research package auditable. It lists key raw data, processed data, docs, reports, charts, PDFs, and generator scripts with row counts, file sizes, source-reference coverage, and short SHA-256 hashes.

## Package Summary

- Manifest rows: 314
- Missing required artifacts: 0
- CSV artifacts: 62
- Total CSV data rows tracked: 162222
- CSV rows with source-like identifiers/URLs/domains/packages: 161920

Artifact types:

- validation_workspace: 87
- research_doc: 75
- generator_script: 57
- processed_data: 49
- report: 16
- chart: 14
- raw_data: 13
- pdf: 3

Evidence roles:

- decision_artifact: 140
- market_money: 46
- audience_icp: 42
- supporting: 34
- source_claim: 23
- competitor_universe: 16
- competitive_whitespace: 13

## Key Data Artifacts

| File | Role | Rows | Source Ref Rows | Hash |
| --- | --- | ---: | ---: | --- |
| data_processed/audience_signal_matrix.csv | audience_icp | 20492 | 20492 | 865f8a0de8b075d7 |
| data_processed/chrome_webstore_source_expansion_summary.csv | source_claim | 7 | 0 | 67e9e02467d33083 |
| data_processed/competitor_feature_matrix.csv | supporting | 12552 | 12552 | b285aff3873487bc |
| data_processed/competitor_revenue_proxy_market_summary.csv | market_money | 5 | 0 | bb80578db00af2cd |
| data_processed/competitor_revenue_proxy_review.csv | audience_icp | 90 | 90 | 168d799198a9e0de |
| data_processed/cross_source_coverage_matrix.csv | source_claim | 34 | 34 | 602afaf59f473f99 |
| data_processed/cross_source_market_saturation_matrix.csv | market_money | 6 | 6 | 7398368ca9afbceb |
| data_processed/cross_source_universe_dedup.csv | source_claim | 22769 | 22769 | cc877179565ccd3b |
| data_processed/cross_source_universe_raw.csv | source_claim | 38240 | 38240 | c6683592db0a1aa8 |
| data_processed/cross_source_universe_summary.csv | source_claim | 14 | 0 | eb7977c4bf966bd6 |
| data_processed/desktop_store_source_summary.csv | source_claim | 5 | 5 | fd23b13384383815 |
| data_processed/evidence_claim_register.csv | decision_artifact | 19 | 0 | 9f459e71ef92e2bf |
| data_processed/forum_quote_coding_matrix.csv | audience_icp | 72 | 72 | f2fb0ab869195b97 |
| data_processed/hypothesis_decision_matrix.csv | decision_artifact | 6 | 0 | 4c5dc584cfbdd789 |
| data_processed/icp_interview_capture_sheet.csv | audience_icp | 96 | 0 | 4494d5bf481075e5 |
| data_processed/icp_segment_matrix.csv | audience_icp | 6 | 0 | da930b6880a1c41e |
| data_processed/icp_validation_test_plan.csv | audience_icp | 36 | 36 | 403bffc6be3783b4 |
| data_processed/itch_source_summary.csv | source_claim | 3 | 3 | cebb7999a5443c22 |
| data_processed/manual_competitor_inspection_packet.csv | supporting | 12 | 12 | f0c2f4b26215239b |
| data_processed/manual_competitor_inspection_rubric.csv | supporting | 6 | 0 | ab64b80495811281 |
| data_processed/manual_walkthrough_capture_sheet.csv | supporting | 60 | 60 | 5c29a345cad6534e |
| data_processed/market_claims.csv | market_money | 14 | 14 | ea4d24d882cdef0e |
| data_processed/market_monetization_proxy_matrix.csv | market_money | 5 | 5 | a252897e3d0641c6 |
| data_processed/market_sizing_assumption_audit.csv | market_money | 6 | 6 | e05c2e764989ea84 |
| data_processed/market_sizing_stress_test.csv | market_money | 6 | 0 | 57e7579a20a091ee |
| data_processed/market_source_confidence_review.csv | market_money | 12 | 12 | 0a05c8ffb35c22cf |
| data_processed/p0_validation_command_center.csv | decision_artifact | 75 | 75 | 6a62ed6938ae528d |
| data_processed/p0_validation_field_guide.csv | decision_artifact | 8 | 8 | 875481ac096f5ef7 |
| data_processed/paid_flow_capture_sheet.csv | supporting | 40 | 40 | c6b4feccce64ccea |
| data_processed/prototype_session_capture_sheet.csv | supporting | 80 | 0 | d0f67d5fcb8a6703 |
| data_processed/prototype_validation_scorecard.csv | decision_artifact | 6 | 0 | 50edbcf4d650b787 |
| data_processed/prototype_validation_stimulus_flow.csv | decision_artifact | 16 | 0 | 2624eb570e1ae17c |
| data_processed/public_listing_inspection_results.csv | supporting | 12 | 12 | 76aa4b78c8d8f86e |
| data_processed/public_listing_inspection_summary.csv | supporting | 9 | 0 | 479fa73ca572d016 |
| data_processed/review_jtbd_cluster_summary.csv | audience_icp | 12 | 0 | 20c2532c7dbe934c |
| data_processed/som_sensitivity_scenarios.csv | market_money | 4 | 0 | d115eaaed5cb3234 |
| data_processed/steam_tag_source_summary.csv | source_claim | 3 | 3 | 43428c6592c78c39 |
| data_processed/tam_sam_som_model.csv | market_money | 6 | 6 | d311e9e145d23a90 |
| data_processed/top100_competitor_review_scorecard.csv | competitive_whitespace | 100 | 100 | 925db07b8f5323d7 |
| data_processed/top100_human_validation_queue.csv | competitive_whitespace | 90 | 90 | 91356a9f07233a37 |

## Decision Artifacts

| File | Type | Lines | Bytes | Hash |
| --- | --- | ---: | ---: | --- |
| docs/competitive/human-validation-guide-v1.md | research_doc | 91 | 12102 | b85e6b5dd29fcb2f |
| docs/decision/evidence-audit-v1.md | research_doc | 80 | 8305 | a78710c8934d0558 |
| docs/decision/evidence-package-manifest-v1.md | research_doc | 124 | 8054 | 7adcdd9c463625c2 |
| docs/decision/hypothesis-decision-matrix-v1.md | research_doc | 51 | 4655 | e4735e2f5779981a |
| docs/decision/p0-validation-command-center-v1.md | research_doc | 69 | 7260 | 51d22a2990e6aaf3 |
| docs/decision/p0-validation-field-guide-v1.md | research_doc | 136 | 12679 | 839df92dd885c73b |
| docs/decision/polished-evidence-pack-v1.md | research_doc | 33 | 996 | dd3dbb4a58a9edb3 |
| docs/decision/validation-batch-01-v1.md | research_doc | 42 | 2909 | 92f524f2d31bc387 |
| docs/decision/validation-batch-02-v1.md | research_doc | 143 | 19194 | aeadb19f7ba53a8a |
| docs/decision/validation-batch-03-v1.md | research_doc | 69 | 6280 | 7ece8ef9641045d8 |
| docs/decision/validation-capture-sheets-v1.md | research_doc | 54 | 2585 | ea9824f1bddab6e5 |
| docs/decision/validation-evidence-workspace-v1.md | research_doc | 46 | 2086 | d946096f64152ce4 |
| docs/decision/validation-execution-dashboard-v1.md | research_doc | 50 | 4779 | b496bcc7698e4711 |
| docs/decision/validation-gap-roadmap-v1.md | research_doc | 72 | 6850 | 677d44153f8f7a21 |
| docs/final-report-outline.md | research_doc | 120 | 2462 | c1f32c179799ccf1 |
| docs/product/product-core-evidence-v1.md | research_doc | 26 | 1444 | 38d7eb6669cbc2a0 |
| docs/product/prototype-validation-stimulus-v1.md | research_doc | 57 | 6109 | 0faba89f050d2b06 |
| docs/strategy/validation-falsification-criteria.md | research_doc | 38 | 1152 | 310c8c3044a11540 |
| docs/visuals/chart-index-v1.md | research_doc | 25 | 886 | 77cba8f26318bcae |
| output/pdf/alina-evidence-first-report-draft.pdf | pdf | 1174 | 160341 | 248cba82f22d59be |
| output/pdf/alina-evidence-visual-report-v1.pdf | pdf | 226 | 23504 | 9e0c4c8fbeb98013 |
| output/pdf/alina-polished-evidence-pack-v1.pdf | pdf | 290 | 38303 | d43bd1200a4b235e |
| reports/alina-evidence-first-report-draft.md | report | 1502 | 132872 | 38d5f1c790738170 |
| reports/competitor-universe-expansion-2026-05-21.md | report | 17 | 371 | 6f085c07c40f01e7 |
| reports/daily-update-template.md | report | 30 | 199 | 3f49329cf740df70 |
| reports/evidence-status-2026-05-31.md | report | 42 | 10241 | 0e1caf4fadc179e8 |
| reports/google-play-enrichment-block-2026-05-21.md | report | 13 | 471 | 8cc4d72b1b4c2a18 |
| reports/matrix-synthesis-2026-05-31.md | report | 43 | 1009 | 939c826c2c1f40db |
| reports/pdf-render-check-2026-05-31.md | report | 51 | 1578 | 35abeb7833564f14 |
| reports/phase1-execution-report-2026-05-21.md | report | 32 | 785 | 67137b3722162884 |
| reports/phase2-progress-20x5-2026-05-21.md | report | 19 | 507 | 97c1bd587d819a0f |
| reports/phase2-progress-50x5-2026-05-21.md | report | 16 | 784 | d167dcd3b0d42620 |
| reports/phase2-seed-progress-2026-05-21.md | report | 30 | 735 | 86b621862a5dd561 |
| reports/visual-pdf-render-check-2026-05-31.md | report | 37 | 907 | a93c5ac089504184 |

## Files

- `data_processed/evidence_artifact_manifest.csv`
