# Русские карточки validation gates V1

Собрано: 2026-05-31T12:06:58.512Z

## Зачем нужен этот файл

Этот слой превращает H1-H6 из набора технических статусов в операторские карточки решения. Для каждой гипотезы указано, что уже поддерживает claim, почему claim нельзя апгрейдить сейчас, какой evidence надо собрать руками, какой критерий даст GO и какой результат заставит downgradе/kill.

Ключевой принцип: desk research может подготовить gate, но не закрыть его. Пока capture rows не заполнены наблюдаемым evidence, статус остается hold_validate.

## Сводка

| H | Гипотеза | Workstream | Gate status | Required | Completed | Success min |
| --- | --- | --- | --- | ---: | ---: | ---: |
| H1 | Product shape exists | ручной walkthrough конкурентов | not_started | 60 | 0 | 25 |
| H2 | Markets have money | ручная проверка paywall/paid-flow | not_started | 40 | 0 | 12 |
| H3 | Whitespace exists | ручной walkthrough конкурентов | not_started | 60 | 0 | 25 |
| H4 | Competitive advantage is plausible | прототипные сессии и scorecard | not_started | 80 | 0 | 32 |
| H5 | Shared audience exists | интервью ICP и проверка recent behavior | not_started | 96 | 0 | 30 |
| H6 | Product core can be defined | прототипные сессии и scorecard | not_started | 80 | 0 | 32 |

## H1. Product shape exists

**Текущий статус:** hold_validate; evidence: public_listing_inspected_walkthrough_open; confidence: medium.

**Что уже поддерживает гипотезу:** Top-100 scorecard shows adjacent products combining required primitives; the P0 packet defines the inspection workflow; the public-listing layer has now inspected all 12 P0 listing excerpts and found the highest-risk visible causality cases for walkthrough.

**Почему нельзя апгрейдить:** No observed capture rows yet. Strict full loop is rare and still needs actual app/onboarding screenshots to confirm or downgrade public listing claims.

**Что собрать руками:** listing screenshot | onboarding first value | first action | progress/avatar feedback | paywall/free boundary | inspector notes

**GO rule:** At least five P0 apps have all five walkthrough slots classified without confirming a hidden full-loop clone.

**Kill/downgrade rule:** Any P0 competitor clearly owns the full Alina loop with action->identity/avatar causality.

**Следующее действие:** Capture onboarding, first action, progress/avatar feedback, and paywall screenshots for the highest-risk public-listing rows.

**Связанные execution tasks:** 1:Inspect public high-risk directness apps: Shepherd: Spiritual Bible BFF

**Граница claim:** Пока completed_rows и success_rows равны нулю, gate нельзя считать закрытым; claim остается hold_validate независимо от объема desk research.

## H2. Markets have money

**Текущий статус:** hold_validate; evidence: supported_with_ranges_stress_test_and_bottom_up_proxy; confidence: medium.

**Что уже поддерживает гипотезу:** TAM/SAM/SOM model, source confidence review, assumption stress-test, observed IAP metadata, Google Play IAP metadata, web paywall signals, and competitor-level revenue proxy review show paid depth while preserving range and source-quality caveats.

**Почему нельзя апгрейдить:** No observed capture rows yet. Market sizing still needs actual revenue estimates, paid intelligence, manual in-app paywall validation, and willingness-to-pay prototype evidence for final investor-grade claims.

**Что собрать руками:** public pricing screenshot | app/product match | trial length | monthly/annual price | first meaningful paywall boundary

**GO rule:** Highest-money competitors receive confirm/partial/reject paid-flow labels with human product-match notes.

**Kill/downgrade rule:** Paid signals mostly belong to parent pages, unrelated products, or login-gated pages that cannot support market-money claims.

**Следующее действие:** Use stress-test risk rows to prioritize paid-flow inspection and prototype willingness-to-pay questions.

**Связанные execution tasks:** 4:Human-signoff paid-surface evidence: Character AI: Chat, Talk, Text | Meditopia: Sleep & Meditation | Carrom Pool: Disc Game | Avatar World ® | AstroSage Kundli: AI Astrology | NBA 2K Mobile Basketball Game | Everskies: Virtual Dress up | Mindfulness with Petit BamBou

**Граница claim:** Пока completed_rows и success_rows равны нулю, gate нельзя считать закрытым; claim остается hold_validate независимо от объема desk research.

## H3. Whitespace exists

**Текущий статус:** hold_validate; evidence: narrow_supported_public_listing_inspected_walkthrough_open; confidence: medium.

**Что уже поддерживает гипотезу:** Broad adjacent market is crowded; strict behavior-tied avatar progression appears rare in metadata; cross-source saturation keeps gaming/progression as benchmark-only and avoids upgrading primary-market whitespace without walkthrough evidence.

**Почему нельзя апгрейдить:** No observed capture rows yet. Actual app/onboarding inspection results are still missing; public listings and cross-source text rules can overstate or hide in-app loops.

**Что собрать руками:** listing screenshot | onboarding first value | first action | progress/avatar feedback | paywall/free boundary | inspector notes

**GO rule:** Manual walkthrough confirms behavior-tied identity/avatar progression remains rare among high-risk substitutes.

**Kill/downgrade rule:** Walkthrough reveals common full-loop substitutes or hidden clone risk is confirmed.

**Следующее действие:** Use the public-listing risk read to classify action->avatar causality in walkthrough as visible, inferred, absent, or blocked.

**Связанные execution tasks:** 1:Inspect public high-risk directness apps: Shepherd: Spiritual Bible BFF

**Граница claim:** Пока completed_rows и success_rows равны нулю, gate нельзя считать закрытым; claim остается hold_validate независимо от объема desk research.

## H4. Competitive advantage is plausible

**Текущий статус:** hold_validate; evidence: prototype_stimulus_ready_unvalidated; confidence: medium.

**Что уже поддерживает гипотезу:** Scorecard separates close substitutes from the one current direct reference; Chrome battlecards identify table-stakes mechanics; prototype stimulus pack now defines the two-minute loop and measurable success/kill gates.

**Почему нельзя апгрейдить:** No observed capture rows yet. No human prototype session yet proves users understand, prefer, or value the integrated loop.

**Что собрать руками:** PVS_M01 | PVS_M02 | PVS_M03 | PVS_M04 | PVS_M05 | PVS_M06

**GO rule:** Prototype users understand and prefer the integrated loop over generic alternatives.

**Kill/downgrade rule:** Participants read the loop as generic, unsafe, childish, manipulative, or not worth returning to.

**Следующее действие:** Run prototype sessions with the top two ICP segments and fill the scorecard with observed results.

**Связанные execution tasks:** 2:Run two-minute prototype sessions for Spiritual self-improvers and Habit and progress users

**Граница claim:** Пока completed_rows и success_rows равны нулю, gate нельзя считать закрытым; claim остается hold_validate независимо от объема desk research.

## H5. Shared audience exists

**Текущий статус:** hold_validate; evidence: directionally_supported; confidence: medium.

**Что уже поддерживает гипотезу:** Reviews and forum snippets converge on daily anchors, visible progress, emotional support, pricing sensitivity, and safety boundaries; the ICP segment matrix converts those signals into testable primary-segment hypotheses.

**Почему нельзя апгрейдить:** No observed capture rows yet. Keyword/OCR/forum coding and directional ICP segments need human validation, interviews, and prototype tests.

**Что собрать руками:** recent episode | current workaround | pain intensity | language resonance | trust/safety concerns | acceptable price range

**GO rule:** Top two ICP segments produce recent-behavior, language resonance, return-intent, and WTP signals.

**Kill/downgrade rule:** No segment recalls a concrete use episode or all reject the action-tied identity/progress premise.

**Следующее действие:** Execute the ICP validation packet for the top two segments, then update segment status and selected primary ICP.

**Связанные execution tasks:** 3:Run ICP validation packet for Spiritual self-improvers and Habit and progress users

**Граница claim:** Пока completed_rows и success_rows равны нулю, gate нельзя считать закрытым; claim остается hold_validate независимо от объема desk research.

## H6. Product core can be defined

**Текущий статус:** hold_validate; evidence: supported_for_mvp_framing; confidence: medium.

**Что уже поддерживает гипотезу:** Product-core matrix, strategy docs, and prototype stimulus pack converge on a testable MVP loop.

**Почему нельзя апгрейдить:** No observed capture rows yet. No user prototype evidence yet confirms comprehension, emotional value, or retention impact.

**Что собрать руками:** PVS_M01 | PVS_M02 | PVS_M03 | PVS_M04 | PVS_M05 | PVS_M06

**GO rule:** MVP loop remains coherent after prototype sessions and competitor walkthrough updates.

**Kill/downgrade rule:** The loop requires too much friction/content cost or users cannot explain causality.

**Следующее действие:** Run prototype sessions and measure loop completion, comprehension, meaning lift, return intent, and paid-depth interest.

**Связанные execution tasks:** 2:Run two-minute prototype sessions for Spiritual self-improvers and Habit and progress users

**Граница claim:** Пока completed_rows и success_rows равны нулю, gate нельзя считать закрытым; claim остается hold_validate независимо от объема desk research.

## Файлы

- `data_processed/russian_validation_gate_cards.csv`
- `docs/decision/russian-validation-gate-cards-v1.md`
- `data_processed/validation_gate_calculator.csv`
- `data_processed/hypothesis_decision_matrix.csv`
- `data_processed/validation_execution_dashboard.csv`
