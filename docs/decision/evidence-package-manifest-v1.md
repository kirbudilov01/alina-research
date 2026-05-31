# Evidence Package Manifest V1

Generated: 2026-05-31T07:11:30.405Z

## Purpose

This manifest makes the research package auditable. It lists key raw data, processed data, docs, reports, charts, PDFs, and generator scripts with row counts, file sizes, source-reference coverage, and short SHA-256 hashes.

## Package Summary

- Manifest rows: 195
- Missing required artifacts: 0
- CSV artifacts: 50
- Total CSV data rows tracked: 100983
- CSV rows with source-like identifiers/URLs/domains/packages: 100713

Artifact types:

- research_doc: 65
- generator_script: 47
- processed_data: 37
- report: 16
- chart: 14
- raw_data: 13
- pdf: 3

Evidence roles:

- decision_artifact: 46
- market_money: 45
- supporting: 34
- audience_icp: 28
- competitor_universe: 16
- source_claim: 14
- competitive_whitespace: 12

## Key Data Artifacts

| File | Role | Rows | Source Ref Rows | Hash |
| --- | --- | ---: | ---: | --- |
| data_processed/audience_signal_matrix.csv | audience_icp | 20492 | 20492 | 865f8a0de8b075d7 |
| data_processed/chrome_webstore_source_expansion_summary.csv | source_claim | 7 | 0 | 67e9e02467d33083 |
| data_processed/competitor_feature_matrix.csv | supporting | 12552 | 12552 | b285aff3873487bc |
| data_processed/competitor_revenue_proxy_market_summary.csv | market_money | 5 | 0 | bb80578db00af2cd |
| data_processed/competitor_revenue_proxy_review.csv | audience_icp | 90 | 90 | 168d799198a9e0de |
| data_processed/desktop_store_source_summary.csv | source_claim | 5 | 5 | fd23b13384383815 |
| data_processed/evidence_claim_register.csv | decision_artifact | 12 | 0 | e55b97dbbafcb571 |
| data_processed/forum_quote_coding_matrix.csv | audience_icp | 72 | 72 | f2fb0ab869195b97 |
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
| data_processed/validation_execution_dashboard.csv | decision_artifact | 11 | 11 | c9135afe2340bda2 |
| data_processed/validation_gap_roadmap.csv | decision_artifact | 16 | 16 | 5562d75dab61c9d3 |
| data_processed/web_paywall_visual_adjudication.csv | market_money | 29 | 29 | 7d73ec71759c929b |
| data_processed/web_paywall_visual_adjudication_summary.csv | market_money | 5 | 0 | a3b2ea62e4164ac1 |
| data_processed/whitespace_signal_matrix.csv | competitive_whitespace | 12552 | 12552 | d12826260e643b15 |
| data_raw/app_store_iap_pricing_raw.csv | market_money | 498 | 498 | 37f37b15c4554c62 |
| data_raw/app_store_top_candidate_reviews.csv | audience_icp | 2294 | 2294 | 3fb11211b91b48b3 |
| data_raw/chrome_extension_detail_raw.csv | competitor_universe | 251 | 251 | 65eb6815dab5c29b |

## Decision Artifacts

| File | Type | Lines | Bytes | Hash |
| --- | --- | ---: | ---: | --- |
| docs/competitive/human-validation-guide-v1.md | research_doc | 91 | 12102 | b85e6b5dd29fcb2f |
| docs/decision/evidence-audit-v1.md | research_doc | 58 | 5220 | 871c43801e3a621f |
| docs/decision/evidence-package-manifest-v1.md | research_doc | 116 | 7362 | 98db37b79f34b80b |
| docs/decision/polished-evidence-pack-v1.md | research_doc | 22 | 669 | b43efcd8805778f1 |
| docs/decision/validation-capture-sheets-v1.md | research_doc | 54 | 2585 | ea9824f1bddab6e5 |
| docs/decision/validation-execution-dashboard-v1.md | research_doc | 50 | 4779 | b496bcc7698e4711 |
| docs/decision/validation-gap-roadmap-v1.md | research_doc | 72 | 6850 | 677d44153f8f7a21 |
| docs/final-report-outline.md | research_doc | 120 | 2462 | c1f32c179799ccf1 |
| docs/product/product-core-evidence-v1.md | research_doc | 26 | 1444 | 38d7eb6669cbc2a0 |
| docs/product/prototype-validation-stimulus-v1.md | research_doc | 57 | 6109 | 0faba89f050d2b06 |
| docs/strategy/validation-falsification-criteria.md | research_doc | 38 | 1152 | 310c8c3044a11540 |
| docs/visuals/chart-index-v1.md | research_doc | 25 | 886 | 77cba8f26318bcae |
| output/pdf/alina-evidence-first-report-draft.pdf | pdf | 869 | 120161 | 61107230b508905b |
| output/pdf/alina-evidence-visual-report-v1.pdf | pdf | 226 | 23504 | ab0ead6ca34c8ce0 |
| output/pdf/alina-polished-evidence-pack-v1.pdf | pdf | 194 | 25298 | 9585b45ee2d08acb |
| reports/alina-evidence-first-report-draft.md | report | 1190 | 94774 | 5ff77907902d0e64 |
| reports/competitor-universe-expansion-2026-05-21.md | report | 17 | 371 | 6f085c07c40f01e7 |
| reports/daily-update-template.md | report | 30 | 199 | 3f49329cf740df70 |
| reports/evidence-status-2026-05-31.md | report | 32 | 7703 | 113cc2744498e7ba |
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
