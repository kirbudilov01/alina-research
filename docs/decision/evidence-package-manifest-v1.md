# Evidence Package Manifest V1

Generated: 2026-05-31T05:23:05.834Z

## Purpose

This manifest makes the research package auditable. It lists key raw data, processed data, docs, reports, charts, PDFs, and generator scripts with row counts, file sizes, source-reference coverage, and short SHA-256 hashes.

## Package Summary

- Manifest rows: 159
- Missing required artifacts: 0
- CSV artifacts: 33
- Total CSV data rows tracked: 93187
- CSV rows with source-like identifiers/URLs/domains/packages: 93143

Artifact types:

- research_doc: 56
- generator_script: 38
- processed_data: 22
- report: 16
- chart: 14
- raw_data: 11
- pdf: 2

Evidence roles:

- market_money: 41
- decision_artifact: 34
- audience_icp: 27
- supporting: 21
- competitor_universe: 14
- competitive_whitespace: 12
- source_claim: 10

## Key Data Artifacts

| File | Role | Rows | Source Ref Rows | Hash |
| --- | --- | ---: | ---: | --- |
| data_processed/audience_signal_matrix.csv | audience_icp | 20492 | 20492 | 865f8a0de8b075d7 |
| data_processed/competitor_feature_matrix.csv | supporting | 12552 | 12552 | b285aff3873487bc |
| data_processed/competitor_revenue_proxy_market_summary.csv | market_money | 5 | 0 | bb80578db00af2cd |
| data_processed/competitor_revenue_proxy_review.csv | audience_icp | 90 | 90 | 168d799198a9e0de |
| data_processed/evidence_claim_register.csv | decision_artifact | 12 | 0 | dee0d67790f7cb1c |
| data_processed/forum_quote_coding_matrix.csv | audience_icp | 72 | 72 | f2fb0ab869195b97 |
| data_processed/icp_segment_matrix.csv | audience_icp | 6 | 0 | da930b6880a1c41e |
| data_processed/icp_validation_test_plan.csv | audience_icp | 36 | 36 | 403bffc6be3783b4 |
| data_processed/itch_source_summary.csv | source_claim | 3 | 3 | cebb7999a5443c22 |
| data_processed/market_claims.csv | market_money | 14 | 14 | ea4d24d882cdef0e |
| data_processed/market_monetization_proxy_matrix.csv | market_money | 5 | 5 | a252897e3d0641c6 |
| data_processed/market_source_confidence_review.csv | market_money | 12 | 12 | 0a05c8ffb35c22cf |
| data_processed/review_jtbd_cluster_summary.csv | audience_icp | 12 | 0 | 20c2532c7dbe934c |
| data_processed/som_sensitivity_scenarios.csv | market_money | 4 | 0 | d115eaaed5cb3234 |
| data_processed/steam_tag_source_summary.csv | source_claim | 3 | 3 | 43428c6592c78c39 |
| data_processed/tam_sam_som_model.csv | market_money | 6 | 6 | d311e9e145d23a90 |
| data_processed/top100_competitor_review_scorecard.csv | competitive_whitespace | 100 | 100 | 925db07b8f5323d7 |
| data_processed/top100_human_validation_queue.csv | competitive_whitespace | 90 | 90 | 91356a9f07233a37 |
| data_processed/validation_gap_roadmap.csv | decision_artifact | 14 | 14 | a6e4e0210a864a7b |
| data_processed/web_paywall_visual_adjudication.csv | market_money | 29 | 29 | 7d73ec71759c929b |
| data_processed/web_paywall_visual_adjudication_summary.csv | market_money | 5 | 0 | a3b2ea62e4164ac1 |
| data_processed/whitespace_signal_matrix.csv | competitive_whitespace | 12552 | 12552 | d12826260e643b15 |
| data_raw/app_store_iap_pricing_raw.csv | market_money | 498 | 498 | 37f37b15c4554c62 |
| data_raw/app_store_top_candidate_reviews.csv | audience_icp | 2294 | 2294 | 3fb11211b91b48b3 |
| data_raw/chrome_extension_detail_raw.csv | competitor_universe | 23 | 23 | c3798e63b7bc57ab |
| data_raw/expanded/all_expanded_dedup.csv | competitor_universe | 12552 | 12552 | db5e87665dbf3b53 |
| data_raw/expanded/all_expanded_raw.csv | competitor_universe | 17490 | 17490 | 8479ff977b44a132 |
| data_raw/expanded/p0_external_sources_raw.csv | competitor_universe | 29 | 29 | bd55a036332668bb |
| data_raw/expanded_itch_raw.csv | competitor_universe | 7047 | 7047 | e1a25dd31f49cc5e |
| data_raw/expanded_steam_tags_raw.csv | competitor_universe | 6258 | 6258 | cd2157e8d1eb5c87 |
| data_raw/forum_quote_evidence_raw.csv | audience_icp | 72 | 72 | 38e7492d350c2433 |
| data_raw/google_play_pricing_raw.csv | market_money | 250 | 250 | 268def050a974daa |
| data_raw/web_paywall_discovery_raw.csv | market_money | 560 | 560 | 3416403392840293 |

## Decision Artifacts

| File | Type | Lines | Bytes | Hash |
| --- | --- | ---: | ---: | --- |
| docs/competitive/human-validation-guide-v1.md | research_doc | 91 | 12102 | b85e6b5dd29fcb2f |
| docs/decision/evidence-audit-v1.md | research_doc | 58 | 4823 | 955ad044a9b5bc7a |
| docs/decision/evidence-package-manifest-v1.md | research_doc | 104 | 6159 | 72d0ce1c5cf78976 |
| docs/decision/validation-gap-roadmap-v1.md | research_doc | 56 | 5654 | db39dd05e7ed6d6a |
| docs/final-report-outline.md | research_doc | 120 | 2462 | c1f32c179799ccf1 |
| docs/product/product-core-evidence-v1.md | research_doc | 26 | 1444 | 38d7eb6669cbc2a0 |
| docs/strategy/validation-falsification-criteria.md | research_doc | 38 | 1152 | 310c8c3044a11540 |
| docs/visuals/chart-index-v1.md | research_doc | 25 | 886 | 77cba8f26318bcae |
| output/pdf/alina-evidence-first-report-draft.pdf | pdf | 716 | 92562 | e90701b486a4fc6f |
| output/pdf/alina-evidence-visual-report-v1.pdf | pdf | 226 | 23504 | 0ec6efe92a69fa00 |
| reports/alina-evidence-first-report-draft.md | report | 1018 | 72002 | 2ab76d3385e72bd7 |
| reports/competitor-universe-expansion-2026-05-21.md | report | 17 | 371 | 6f085c07c40f01e7 |
| reports/daily-update-template.md | report | 30 | 199 | 3f49329cf740df70 |
| reports/evidence-status-2026-05-31.md | report | 29 | 6599 | c5b9ccab19fce7b3 |
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
