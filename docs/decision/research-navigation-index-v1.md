# Research Navigation Index V1

Generated: 2026-05-31T18:55:20.893Z

## Что это

Это навигационная карта всего evidence package. Она связывает требования, claims, validation gates, tranches, briefing-файлы, source-файлы, следующие действия и границы утверждений, чтобы исследование можно было вести ночью без ручного поиска по десяткам CSV.

## Снимок пакета

- Navigation rows: 38
- Claim rows: 22
- Requirement rows: 10
- Gate rows: 6
- Manifest artifacts currently tracked: 557
- Validation tranches: 9
- Tranche briefings: 6

Navigation tiers:

- needs_validation: 21
- reference_anchor: 7
- review_ready: 6
- directional_claim: 3
- supporting: 1

## Рабочий маршрут validation

| Gate | Hypothesis | Status | Progress | Decision | Tranche | Briefing | Next Action |
| --- | --- | --- | --- | --- | --- | --- | --- |
| GATE_H1_MANUAL_PRODUCT_SHAPE | H1 | in_progress_insufficient_evidence | 12/60; success 0/25 | keeps_hold_validate | TRANCHE_01_HIDDEN_CLONE_SPIKE | output/validation/2026-05-31/tranche_briefings/01__tranche-01-hidden-clone-spike__briefing.md | Capture onboarding, first action, progress/avatar feedback, and paywall screenshots for the highest-risk public-listing rows. |
| GATE_H3_MANUAL_WHITESPACE | H3 | in_progress_insufficient_evidence | 12/60; success 0/25 | keeps_hold_validate | TRANCHE_01_HIDDEN_CLONE_SPIKE | output/validation/2026-05-31/tranche_briefings/01__tranche-01-hidden-clone-spike__briefing.md | Use the public-listing risk read to classify action->avatar causality in walkthrough as visible, inferred, absent, or blocked. |
| GATE_H2_PAID_FLOW | H2 | in_progress_insufficient_evidence | 28/48; success 8/12 | keeps_hold_validate | TRANCHE_03_PAID_CONFIRMED_SPIKE | output/validation/2026-05-31/tranche_briefings/03__tranche-03-paid-confirmed-spike__briefing.md | Use stress-test risk rows to prioritize paid-flow inspection and prototype willingness-to-pay questions. |
| GATE_H5_ICP_RECENT_BEHAVIOR | H5 | in_progress_insufficient_evidence | 12/96; success 0/30 | keeps_hold_validate | TRANCHE_04_ICP_PILOT | output/validation/2026-05-31/tranche_briefings/04__tranche-04-icp-pilot__briefing.md | Use the ICP recruiting bridge to source top-two segment participants, execute the ICP validation packet, then update segment status and selected primary ICP. |
| GATE_H4_PROTOTYPE_ADVANTAGE | H4 | in_progress_insufficient_evidence | 16/80; success 0/32 | keeps_hold_validate | TRANCHE_05_PROTOTYPE_PILOT | output/validation/2026-05-31/tranche_briefings/05__tranche-05-prototype-pilot__briefing.md | Run prototype sessions with the top two ICP segments and fill the scorecard with observed results. |
| GATE_H6_PRODUCT_CORE | H6 | in_progress_insufficient_evidence | 16/80; success 0/32 | keeps_hold_validate | TRANCHE_05_PROTOTYPE_PILOT | output/validation/2026-05-31/tranche_briefings/05__tranche-05-prototype-pilot__briefing.md | Run prototype sessions and measure loop completion, comprehension, meaning lift, return intent, and paid-depth interest. |

## Очередь на ближайшие 12 часов

Эта очередь не усиливает claims сама по себе. Она показывает, какие рабочие tranches надо выполнять первыми, чтобы перевести отчет из desk/source evidence в observed validation: screenshots, notes, interview quotes, paywall checks и prototype scores.

| Tranche | Priority | Scope | Цель оператора | Что сохранить | Куда писать | Briefing |
| --- | --- | --- | --- | --- | --- | --- |
| TRANCHE_01_HIDDEN_CLONE_SPIKE | P0_blocker | Shepherd: Spiritual Bible BFF | Сначала проверить самый опасный public-listing сигнал: Shepherd выглядит как потенциальный hidden direct clone, поэтому его нужно разобрать до других приложений. | 5 screenshots: listing, onboarding, first action, progress/avatar feedback, paywall boundary; final verdict | data_processed/manual_walkthrough_capture_sheet.csv;data_processed/manual_competitor_inspection_packet.csv;data_processed/hypothesis_decision_matrix.csv | output/validation/2026-05-31/tranche_briefings/01__tranche-01-hidden-clone-spike__briefing.md |
| TRANCHE_02_MANUAL_TOP5 | P0 | Shepherd: Spiritual Bible BFF<br>Zing AI: Home & Gym Workouts<br>Miracle Morning Routine<br>EVOLVE: Transform Your Life<br>Daily Yoga: Yoga for Fitness® | Закрыть первые 5 P0 конкурентов, потому что gate требует минимум 5 приложений с полным walkthrough. | 25 capture rows across five apps and five slots each | data_processed/manual_walkthrough_capture_sheet.csv;data_processed/manual_competitor_inspection_packet.csv;data_processed/validation_gate_calculator.csv | output/validation/2026-05-31/tranche_briefings/02__tranche-02-manual-top5__briefing.md |
| TRANCHE_03_PAID_CONFIRMED_SPIKE | P0 | Character AI: Chat, Talk, Text<br>Meditopia: Sleep & Meditation | Сначала проверить подтвержденные visible pricing rows, чтобы быстро отделить real paid surfaces от proxy noise. | pricing screenshot, product match, trial/price/plan depth, first paywall boundary | data_processed/paid_flow_capture_sheet.csv;data_processed/web_paywall_visual_adjudication.csv;data_processed/market_money_triangulation.csv | output/validation/2026-05-31/tranche_briefings/03__tranche-03-paid-confirmed-spike__briefing.md |
| TRANCHE_04_ICP_PILOT | P0 | ICP_A and ICP_D / participants P01-P02 | Провести маленький pilot по двум сегментам до массового интервью, чтобы проверить язык, recent behavior и fatal objections. | recent behavior, last episode, workaround, pain score, concept preference, WTP, fatal objection, exact quote | data_processed/icp_interview_capture_sheet.csv;data_processed/icp_segment_matrix.csv;data_processed/icp_validation_test_plan.csv | output/validation/2026-05-31/tranche_briefings/04__tranche-04-icp-pilot__briefing.md |
| TRANCHE_05_PROTOTYPE_PILOT | P0_blocker | ICP_A and ICP_D / participants P01-P02 / screens S01-S08 | Проверить самое хрупкое место: понимают ли люди causality между действием и avatar/progress feedback. | screen-by-screen paraphrase, completion time, comprehension, meaning lift, differentiation, return intent, trust objection | data_processed/prototype_session_capture_sheet.csv;data_processed/prototype_validation_scorecard.csv | output/validation/2026-05-31/tranche_briefings/05__tranche-05-prototype-pilot__briefing.md |
| TRANCHE_06_REDDIT_TOP25_LANGUAGE | P0 | Top 25 P0 Reddit/manual reading rows | Быстро получить живой язык rejected patterns и alternatives, не превращая Reddit в ложный количественный спрос. | user job, named alternatives, rejected patterns, paid/WTP signal, safety boundary, Alina implication, quote permission | data_processed/reddit_manual_reading_capture_sheet.csv;data_processed/evidence_claim_register.csv | output/validation/2026-05-31/tranche_briefings/06__tranche-06-reddit-top25-language__briefing.md |
| TRANCHE_07_EXPAND_AFTER_SPIKES | P1_after_spikes | Only after Tranche 01-06 do not trigger downgrade/pivot | Расширять объем только после первых spikes. Если первые партии противоречат гипотезам, сначала обновить позиционирование и вопросы. | remaining high-value capture rows across lanes | all capture sheets;data_processed/validation_gate_calculator.csv;data_processed/research_completion_audit.csv |  |
| TRANCHE_08_PUBLICATION_REBUILD | P0_after_observed_evidence | After any observed validation tranche | Закрыть цикл evidence-first: результаты должны попасть в claims, русский отчет, PDF, manifest и GitHub. | updated claims, gate status, PDF readback, git commit hash | data_processed/evidence_claim_register.csv;data_processed/research_completion_audit.csv;reports/alina-russian-narrative-report-v1.md;output/pdf/alina-russian-narrative-report-v1.pdf;data_processed/evidence_artifact_manifest.csv |  |

## Главные claims, которые нельзя апгрейдить без evidence

| Claim | Status | Confidence | Gate | Gate progress | Tranche | Primary File | Boundary |
| --- | --- | --- | --- | --- | --- | --- | --- |
| REQ_completion_readiness_audit | proved_v1_open_requirements | high |  |  |  | data_processed/research_completion_audit.csv | Several objective requirements remain partial, directional, draft, or validation-ready rather than fully complete. |
| REQ_hypothesis_decision_matrix | proved_v1_open_validation_decisions | high |  |  |  | data_processed/hypothesis_decision_matrix.csv | Decision rows remain validation gates, not final proof: competitor walkthroughs, paywall sign-off, ICP interviews, and prototype sessions are still open. |
| REQ_market_money_triangulation | proved_v1_triangulated_proxy_not_final | medium_high |  |  |  | data_processed/market_money_triangulation.csv | This is public-evidence triangulation, not final revenue proof. H2 still needs paid-flow human signoff, product-match notes, and WTP evidence from prototype/ICP sessions. |
| REQ_p0_validation_command_center | proved_v1_operator_ready_open_gates | high |  |  |  | data_processed/p0_validation_command_center.csv | The command center is operational scaffolding; it still requires actual screenshots, participant evidence, paywall signoff, and updated verdicts. |
| REQ_p0_validation_field_guide | proved_v1_execution_scripts_ready_open_gates | high |  |  |  | data_processed/p0_validation_field_guide.csv | Field guide is still an execution artifact, not observed validation evidence. |
| REQ_validation_evidence_workspace | proved_v1_intake_workspace_ready_open_gates | high |  |  |  | data_processed/validation_evidence_workspace_index.csv | Workspace is empty until real screenshots, notes, quotes, and calculations are captured. |
| REQ_validation_batch_01 | proved_v1_batch_ready_open_gates | high |  |  |  | data_processed/validation_batch_01_index.csv | Batch files are prefilled intake notes; they still need observed screenshots, quotes, measured values, and final verdicts. |
| REQ_validation_batch_02 | proved_v1_p0_breadth_batch_ready_open_gates | high |  |  |  | data_processed/validation_batch_02_index.csv | Batch files are prefilled intake notes; they still need observed screenshots, quotes, measured values, and final verdicts. |
| REQ_validation_batch_03 | proved_v1_context_batch_ready_open_gates | high |  |  |  | data_processed/validation_batch_03_index.csv | Batch files are prefilled context notes; they still need observed pricing/paywall checks and conservative signoff decisions. |
| REQ_validation_evidence_rollup | proved_v1_command_level_rollup_open_gates | high |  |  |  | data_processed/validation_evidence_rollup.csv | Rollup is an intake audit, not a validation result: most rows still need observed screenshots, quotes, calculations, or human signoff. |
| REQ_validation_gate_calculator | proved_v1_calculator_ready_open_gates | high |  |  |  | data_processed/validation_gate_calculator.csv | The calculator is ready, but current capture rows are still unobserved; it deliberately keeps gates in hold/validate until screenshots, quotes, scores, and human signoff are entered. |
| REQ_competitor_universe | proved_raw_50k_and_dedup_30k_plus_dedup_50k_open | medium_high |  |  |  | data_raw/expanded/all_expanded_raw.csv | Raw 50k source scale is met; dedup 30k+ and the 30k-40k working band are met; dedup 50k remains open and should not be overclaimed. |
| H1_product_shape_exists | public_listing_inspected_walkthrough_open | medium | GATE_H1_MANUAL_PRODUCT_SHAPE | 12/60; success 0/25 | TRANCHE_01_HIDDEN_CLONE_SPIKE | data_processed/top100_competitor_review_scorecard.csv | Strict full loop is rare and still needs actual app/onboarding screenshots to confirm or downgrade public listing claims. |
| H2_markets_have_money | supported_with_ranges_stress_test_and_bottom_up_proxy | medium | GATE_H2_PAID_FLOW | 28/48; success 8/12 | TRANCHE_03_PAID_CONFIRMED_SPIKE | data_processed/tam_sam_som_model.csv | Market sizing still needs actual revenue estimates, paid intelligence, manual in-app paywall validation, and willingness-to-pay prototype evidence for final investor-grade claims. |
| H2_paywall_visible_evidence | supported_narrowly_with_visual_adjudication | medium_low | GATE_H2_PAID_FLOW | 28/48; success 8/12 | TRANCHE_03_PAID_CONFIRMED_SPIKE | data_processed/web_paywall_signal_matrix.csv | Most web signals remain ambiguous, not found, parent-company pages, login-gated, or require broader human/in-app inspection; current local signoff covers only the first two confirmed/partial products. |
| H3_whitespace_exists | narrow_supported_public_listing_inspected_walkthrough_open | medium | GATE_H3_MANUAL_WHITESPACE | 12/60; success 0/25 | TRANCHE_01_HIDDEN_CLONE_SPIKE | data_processed/whitespace_signal_matrix.csv | Actual app/onboarding inspection results are still missing; public listings and cross-source text rules can overstate or hide in-app loops. |
| H4_competitive_advantage_plausible | prototype_stimulus_ready_unvalidated | medium | GATE_H4_PROTOTYPE_ADVANTAGE | 16/80; success 0/32 | TRANCHE_05_PROTOTYPE_PILOT | data_processed/top100_competitor_review_scorecard.csv | No human prototype session yet proves users understand, prefer, or value the integrated loop. |
| H5_shared_audience_exists | directionally_supported | medium | GATE_H5_ICP_RECENT_BEHAVIOR | 12/96; success 0/30 | TRANCHE_04_ICP_PILOT | data_processed/audience_signal_matrix.csv | Keyword/OCR/forum coding and directional ICP recruiting assets need human validation, interviews, and prototype tests. |
| H6_product_core_defined | supported_for_mvp_framing | medium | GATE_H6_PRODUCT_CORE | 16/80; success 0/32 | TRANCHE_05_PROTOTYPE_PILOT | data_processed/product_core_evidence_matrix.csv | No user prototype evidence yet confirms comprehension, emotional value, or retention impact. |

## Карта требований

| Requirement | Status | Strength | Primary File | Next Action |
| --- | --- | --- | --- | --- |
| REQ_01_MASTER_PLAN | proved_v1 | strong | docs/research-expansion-master-plan.md | Update after any manual validation/prototype result. |
| REQ_02_COMPETITOR_UNIVERSE | proved_raw_50k_and_dedup_30k_plus_dedup_50k_open | medium_high | data_raw/expanded/all_expanded_raw.csv | Run next non-search-heavy collectors from source expansion backlog, prioritizing sources that return public HTML without Cloudflare/search-engine dependency. |
| REQ_03_FIVE_MARKET_COVERAGE | proved_v1 | strong | data_raw/expanded/all_expanded_dedup.csv | Keep market-specific validation gates explicit. |
| REQ_04_MARKET_MONEY | supported_with_triangulated_proxy_not_final | medium_high | docs/market/market-sizing-methodology.md | Use stress-test risk rows to prioritize manual paid-flow inspection and willingness-to-pay prototype questions. |
| REQ_05_WHITESPACE | narrow_supported_public_listing_signed_off_walkthrough_open | medium | data_processed/whitespace_signal_matrix.csv | Use the public-listing risk reads to prioritize walkthrough screenshots for onboarding, first action, progress/avatar feedback, and paywall boundary. |
| REQ_06_AUDIENCE_ICP | directionally_supported_secondary_voc_signed_off_interviews_open | medium | data_processed/audience_signal_matrix.csv | Use the ICP recruiting bridge to recruit the top two segments, then run the validation packet and update capture sheets. |
| REQ_07_COMPETITIVE_ADVANTAGE | prototype_readiness_signed_off_user_sessions_open | medium | data_processed/product_core_evidence_matrix.csv | Run prototype sessions with the top two ICP segments and record comprehension, meaning lift, differentiation, return intent, and paid-depth signals. |
| REQ_08_REPORT_PDF | global_russian_report_pdf_docx_done_not_validated_final | medium_high | reports/alina-evidence-first-report-draft.md | After manual inspection and prototype sessions, update the pack with validated screenshots, scorecards, and final claim statuses. |
| REQ_09_VERSIONING_PROVENANCE | proved_active | high | data_processed/evidence_artifact_manifest.csv | Regenerate manifest and commit after each major layer. |
| REQ_10_VALIDATION_GATES | all_gates_started_none_passed_validation_open | strong | data_processed/research_navigation_index.csv | Execute P0 rows in the validation execution dashboard, then update source CSVs and final verdicts. |

## Граница claims

Это навигационный артефакт, а не новое рыночное доказательство. Он не апгрейдит ни одну гипотезу. Его задача - показать, где лежит evidence, что остается открытым и какой tranche/briefing нужно выполнить перед усилением любого вывода.

## Files

- `data_processed/research_navigation_index.csv`
- `docs/decision/research-navigation-index-v1.md`
