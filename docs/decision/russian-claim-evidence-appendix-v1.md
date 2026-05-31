# Русское приложение Claim -> Evidence -> Boundary V1

Собрано: 2026-05-31T11:36:22.577Z

## Зачем нужен этот файл

Этот appendix переводит evidence claim register в русскую проверочную карту. Его задача - не усилить claims, а сделать каждый сильный тезис проверяемым: что утверждается, какой статус evidence, какая метрика, где файлы-источники, какая граница и какое следующее действие.

## Сводка

- Claim rows: 22
- Manifest artifacts at build time: 384
- доказано как исследовательский слой: 15
- готово к проверке, gate открыт: 2
- поддержано направленно, но не финально доказано: 5

## Главная таблица

| Claim | Статус | Confidence | Метрика | Граница | Файлы |
| --- | --- | --- | --- | --- | ---: |
| REQ_plan | доказано как исследовательский слой | high | master plan exists; 16 validation roadmap rows; 11 execution tasks | Needs periodic refresh as validation findings change. | 7 |
| REQ_evidence_package_traceability | доказано как исследовательский слой | high | 384 manifest rows; 0 missing artifacts | Это provenance proof, а не содержательное доказательство спроса. | 2 |
| REQ_completion_readiness_audit | доказано как исследовательский слой | high | 10 completion requirements; 6 not fully proved/final | Several objective requirements remain partial, directional, draft, or validation-ready rather than fully complete. | 2 |
| REQ_hypothesis_decision_matrix | доказано как исследовательский слой | high | 6 hypothesis decision rows; 6 hold/validate; 0 go; 0 stop/pivot | Decision rows remain validation gates, not final proof: competitor walkthroughs, paywall sign-off, ICP interviews, and prototype sessions are still open. | 2 |
| REQ_market_money_triangulation | доказано как исследовательский слой | medium_high | 6 market rows; 3 strong and 1 medium directional money cases | Нельзя читать proxy как выручку Alina; нужны paid-flow signoff и WTP evidence. | 9 |
| REQ_p0_validation_command_center | доказано как исследовательский слой | high | 75 command rows; 6 blocker rows; 52 P0 rows | Это операционная готовность, не observed validation evidence. | 4 |
| REQ_p0_validation_field_guide | доказано как исследовательский слой | high | 8 field guide sections; 75 command rows referenced | Это операционная готовность, не observed validation evidence. | 4 |
| REQ_validation_evidence_workspace | доказано как исследовательский слой | high | 5 workspace lanes; output/validation README and templates generated | Это операционная готовность, не observed validation evidence. | 4 |
| REQ_validation_batch_01 | доказано как исследовательский слой | high | 6 batch rows; 6 not started; 0 local artifacts linked | Это операционная готовность, не observed validation evidence. | 3 |
| REQ_validation_batch_02 | доказано как исследовательский слой | high | 52 batch rows; 52 not started; 12 local artifacts linked | Это операционная готовность, не observed validation evidence. | 3 |
| REQ_validation_batch_03 | доказано как исследовательский слой | high | 17 batch rows; 17 not started; 17 local artifacts linked | Это операционная готовность, не observed validation evidence. | 3 |
| REQ_validation_evidence_rollup | доказано как исследовательский слой | high | 75 command rows; 75 notes present; 29 local artifacts linked | Это операционная готовность, не observed validation evidence. | 5 |
| REQ_validation_gate_calculator | доказано как исследовательский слой | high | 6 gate rows; 0 pass-ready; 0 in-progress; 6 not started; 0 downgrade/kill triggered | Это операционная готовность, не observed validation evidence. | 7 |
| REQ_competitor_universe | доказано как исследовательский слой | medium_high | 61345 cross-source raw rows; 33718 cross-source dedup rows; 39 coverage cells; 11 strong and 12 medium source/market cells | The 30k lower-bound dedup target is met; upper-bound 50k expansion and Product Hunt/AlternativeTo, Microsoft Store, B2B directories, Reddit mentions, and additional source-native coverage remain backlog. | 42 |
| H1_product_shape_exists | готово к проверке, gate открыт | medium | 100 top-candidate rows; 90 primary apps; 12 P0 inspection targets; 12 public listings inspected | Нельзя усиливать claim без app/onboarding walkthrough и скриншотов причинной петли. | 8 |
| H2_markets_have_money | поддержано направленно, но не финально доказано | medium | intersection SAM base USD 201960000; 12 market sources confidence-reviewed; 6 assumption rows; 6 stress scenarios; 22 strong competitor money proxies | Нельзя читать proxy как выручку Alina; нужны paid-flow signoff и WTP evidence. | 18 |
| H2_paywall_visible_evidence | поддержано направленно, но не финально доказано | medium_low | 2/29 screenshots confirm visible public pricing; 8 partial paid-surface examples | Нельзя читать proxy как выручку Alina; нужны paid-flow signoff и WTP evidence. | 8 |
| H3_whitespace_exists | поддержано направленно, но не финально доказано | medium | 1/100 strict behavior-tied progression signals; 6 cross-source saturation markets; 2 benchmark-only markets; 12 P0 apps queued | Нельзя усиливать claim без app/onboarding walkthrough и скриншотов причинной петли. | 13 |
| H4_competitive_advantage_plausible | готово к проверке, gate открыт | medium | 1 direct reference competitor; 45 high-threat competitors; 8 prototype screens; 6 success/kill metrics | Нельзя считать продуктовое преимущество доказанным без prototype sessions и observed scorecard. | 9 |
| H5_shared_audience_exists | поддержано направленно, но не финально доказано | medium | 20492 audience signal rows; 294 community/referral rows; 2339 coded Reddit mention rows; 1852 Reddit manual-read queue rows; 574 Reddit capture rows; 6 ICP segment hypotheses; 36 ICP validation tests; 24 ICP recruiting bridge rows | Нельзя превращать directional language signals в финальную персону без интервью. | 25 |
| H6_product_core_defined | поддержано направленно, но не финально доказано | medium | 12552 feature matrix rows; 100 product-core rows; 8 prototype screens | Нельзя считать продуктовое преимущество доказанным без prototype sessions и observed scorecard. | 7 |
| REQ_final_artifacts_versioned | доказано как исследовательский слой | high | current branch pushed through latest commit | Это provenance proof, а не содержательное доказательство спроса. | 4 |

## Файлы

- `data_processed/russian_claim_evidence_appendix.csv`
- `docs/decision/russian-claim-evidence-appendix-v1.md`
- `data_processed/evidence_claim_register.csv`
- `data_processed/evidence_artifact_manifest.csv`
