# Русская observed-evidence ladder V1

Собрано: 2026-05-31T12:32:38.673Z

## Зачем нужен этот слой

Этот файл переводит H1-H6 из набора гипотез в последовательную доказательную лестницу. Он отделяет desk evidence от observed evidence: локальные матрицы могут поддерживать направление, но claim усиливается только после заполненных capture rows, скриншотов, интервью или прототипных метрик.

Сейчас по шести гипотезам нужно 416 capture rows, завершено 0. Поэтому все сильные формулировки должны оставаться в режиме hold_validate, пока не появится наблюдаемое evidence.

## Ladder

| H | Гипотеза | Observed mode | Need | Done | Почему еще не go |
| --- | --- | --- | ---: | ---: | --- |
| H1 | форма продукта существует | ручной walkthrough конкурентов | 60 | 0 | Наблюдаемых rows пока нет: desk evidence не переводит гипотезу из hold_validate в go. Главная дырка: No observed capture rows yet. Strict full loop is rare and still needs actual app/onboarding screenshots to confirm or downgrade public listing claims. |
| H2 | в соседних рынках есть деньги | ручная проверка paywall/paid-flow | 40 | 0 | Наблюдаемых rows пока нет: desk evidence не переводит гипотезу из hold_validate в go. Главная дырка: No observed capture rows yet. Market sizing still needs actual revenue estimates, paid intelligence, manual in-app paywall validation, and willingness-to-pay prototype evidence for final investor-grade claims. |
| H3 | есть узкое белое пятно | ручной walkthrough конкурентов | 60 | 0 | Наблюдаемых rows пока нет: desk evidence не переводит гипотезу из hold_validate в go. Главная дырка: No observed capture rows yet. Actual app/onboarding inspection results are still missing; public listings and cross-source text rules can overstate or hide in-app loops. |
| H4 | конкурентное преимущество правдоподобно | прототипные сессии | 80 | 0 | Наблюдаемых rows пока нет: desk evidence не переводит гипотезу из hold_validate в go. Главная дырка: No observed capture rows yet. No human prototype session yet proves users understand, prefer, or value the integrated loop. |
| H5 | общая аудитория существует | интервью ICP | 96 | 0 | Наблюдаемых rows пока нет: desk evidence не переводит гипотезу из hold_validate в go. Главная дырка: No observed capture rows yet. Keyword/OCR/forum coding and directional ICP segments need human validation, interviews, and prototype tests. |
| H6 | продуктовое ядро можно определить | прототипные сессии | 80 | 0 | Наблюдаемых rows пока нет: desk evidence не переводит гипотезу из hold_validate в go. Главная дырка: No observed capture rows yet. No user prototype evidence yet confirms comprehension, emotional value, or retention impact. |

## H1. форма продукта существует

**Текущий статус:** hold_validate, confidence=medium.

**Desk support:** Top-100 scorecard shows adjacent products combining required primitives; the P0 packet defines the inspection workflow; the public-listing layer has now inspected all 12 P0 listing excerpts and found the highest-risk visible causality cases for walkthrough.

**Observed gap:** Наблюдаемых rows пока нет: desk evidence не переводит гипотезу из hold_validate в go. Главная дырка: No observed capture rows yet. Strict full loop is rare and still needs actual app/onboarding screenshots to confirm or downgrade public listing claims.

**Сначала сделать:** P0_MANUAL_01: Shepherd: Spiritual Bible BFF | P0_MANUAL_02: Zing AI: Home & Gym Workouts | P0_MANUAL_03: Miracle Morning Routine | P0_MANUAL_04: EVOLVE: Transform Your Life

**Заполнить:** manual_walkthrough_capture_sheet.csv + screenshot paths + inspector_notes

**Upgrade rule:** At least five P0 apps have all five walkthrough slots classified without confirming a hidden full-loop clone.

**Downgrade rule:** Any P0 competitor clearly owns the full Alina loop with action->identity/avatar causality.

**Фраза для отчета:** Мы видим рядом продукты с похожими примитивами, но форму Alina нельзя считать доказанной, пока первые P0 walkthrough не покажут, что полный цикл не занят скрытым прямым клоном.

## H2. в соседних рынках есть деньги

**Текущий статус:** hold_validate, confidence=medium.

**Desk support:** TAM/SAM/SOM model, source confidence review, assumption stress-test, observed IAP metadata, Google Play IAP metadata, web paywall signals, and competitor-level revenue proxy review show paid depth while preserving range and source-quality caveats.

**Observed gap:** Наблюдаемых rows пока нет: desk evidence не переводит гипотезу из hold_validate в go. Главная дырка: No observed capture rows yet. Market sizing still needs actual revenue estimates, paid intelligence, manual in-app paywall validation, and willingness-to-pay prototype evidence for final investor-grade claims.

**Сначала сделать:** P0_PAYWALL_01: The Sims™ FreePlay | P0_PAYWALL_02: Character AI: Chat, Talk, Text | P0_PAYWALL_03: Headspace: Sleep & Meditate | P0_PAYWALL_04: Meditopia: Sleep & Meditation

**Заполнить:** paid_flow_capture_sheet.csv + public pricing screenshot + product-match verdict

**Upgrade rule:** Highest-money competitors receive confirm/partial/reject paid-flow labels with human product-match notes.

**Downgrade rule:** Paid signals mostly belong to parent pages, unrelated products, or login-gated pages that cannot support market-money claims.

**Фраза для отчета:** Деньги в соседних категориях подтверждаются proxy-слоями, но инвестиционный claim по рынку должен оставаться range-based до ручной проверки платных поверхностей и willingness-to-pay.

## H3. есть узкое белое пятно

**Текущий статус:** hold_validate, confidence=medium.

**Desk support:** Broad adjacent market is crowded; strict behavior-tied avatar progression appears rare in metadata; cross-source saturation keeps gaming/progression as benchmark-only and avoids upgrading primary-market whitespace without walkthrough evidence.

**Observed gap:** Наблюдаемых rows пока нет: desk evidence не переводит гипотезу из hold_validate в go. Главная дырка: No observed capture rows yet. Actual app/onboarding inspection results are still missing; public listings and cross-source text rules can overstate or hide in-app loops.

**Сначала сделать:** P0_MANUAL_01: Shepherd: Spiritual Bible BFF | P0_MANUAL_02: Zing AI: Home & Gym Workouts | P0_MANUAL_03: Miracle Morning Routine | P0_MANUAL_04: EVOLVE: Transform Your Life

**Заполнить:** manual_walkthrough_capture_sheet.csv + screenshot paths + inspector_notes

**Upgrade rule:** Manual walkthrough confirms behavior-tied identity/avatar progression remains rare among high-risk substitutes.

**Downgrade rule:** Walkthrough reveals common full-loop substitutes or hidden clone risk is confirmed.

**Фраза для отчета:** Белое пятно формулируется узко: не просто wellness, coaching или avatar, а причинная петля meaning -> action -> reset -> visible identity/progress; до walkthrough это directional, не финальный вывод.

## H4. конкурентное преимущество правдоподобно

**Текущий статус:** hold_validate, confidence=medium.

**Desk support:** Scorecard separates close substitutes from the one current direct reference; Chrome battlecards identify table-stakes mechanics; prototype stimulus pack now defines the two-minute loop and measurable success/kill gates.

**Observed gap:** Наблюдаемых rows пока нет: desk evidence не переводит гипотезу из hold_validate в go. Главная дырка: No observed capture rows yet. No human prototype session yet proves users understand, prefer, or value the integrated loop.

**Сначала сделать:** P0_PROTO_ICP_A_S01_ENTRY: Spiritual self-improvers / S01_ENTRY | P0_PROTO_ICP_A_S02_REFLECTION: Spiritual self-improvers / S02_REFLECTION | P0_PROTO_ICP_A_S03_ACTION_CARD: Spiritual self-improvers / S03_ACTION_CARD | P0_PROTO_ICP_A_S04_RESET: Spiritual self-improvers / S04_RESET

**Заполнить:** prototype_session_capture_sheet.csv + prototype_validation_scorecard.csv + observed metrics

**Upgrade rule:** Prototype users understand and prefer the integrated loop over generic alternatives.

**Downgrade rule:** Participants read the loop as generic, unsafe, childish, manipulative, or not worth returning to.

**Фраза для отчета:** Преимущество Alina пока является проверяемой ставкой на интегрированную петлю, а не доказанным moat: оно должно пройти prototype comprehension, differentiation и trust gates.

## H5. общая аудитория существует

**Текущий статус:** hold_validate, confidence=medium.

**Desk support:** Reviews and forum snippets converge on daily anchors, visible progress, emotional support, pricing sensitivity, and safety boundaries; the ICP segment matrix converts those signals into testable primary-segment hypotheses.

**Observed gap:** Наблюдаемых rows пока нет: desk evidence не переводит гипотезу из hold_validate в go. Главная дырка: No observed capture rows yet. Keyword/OCR/forum coding and directional ICP segments need human validation, interviews, and prototype tests.

**Сначала сделать:** P0_ICP_ICP_A_T01: Spiritual self-improvers / screener | P0_ICP_ICP_A_T02: Spiritual self-improvers / problem_interview | P0_ICP_ICP_A_T03: Spiritual self-improvers / prototype_loop | P0_ICP_ICP_A_T04: Spiritual self-improvers / positioning_test

**Заполнить:** icp_interview_capture_sheet.csv + recent behavior + verbatim quote + segment status

**Upgrade rule:** Top two ICP segments produce recent-behavior, language resonance, return-intent, and WTP signals.

**Downgrade rule:** No segment recalls a concrete use episode or all reject the action-tied identity/progress premise.

**Фраза для отчета:** Аудитория видна через повторяющийся язык ritual/progress/support, но ICP нельзя выбирать окончательно без recent-behavior интервью и проверки готовности возвращаться.

## H6. продуктовое ядро можно определить

**Текущий статус:** hold_validate, confidence=medium.

**Desk support:** Product-core matrix, strategy docs, and prototype stimulus pack converge on a testable MVP loop.

**Observed gap:** Наблюдаемых rows пока нет: desk evidence не переводит гипотезу из hold_validate в go. Главная дырка: No observed capture rows yet. No user prototype evidence yet confirms comprehension, emotional value, or retention impact.

**Сначала сделать:** P0_PROTO_ICP_A_S01_ENTRY: Spiritual self-improvers / S01_ENTRY | P0_PROTO_ICP_A_S02_REFLECTION: Spiritual self-improvers / S02_REFLECTION | P0_PROTO_ICP_A_S03_ACTION_CARD: Spiritual self-improvers / S03_ACTION_CARD | P0_PROTO_ICP_A_S04_RESET: Spiritual self-improvers / S04_RESET

**Заполнить:** prototype_session_capture_sheet.csv + prototype_validation_scorecard.csv + observed metrics

**Upgrade rule:** MVP loop remains coherent after prototype sessions and competitor walkthrough updates.

**Downgrade rule:** The loop requires too much friction/content cost or users cannot explain causality.

**Фраза для отчета:** Продуктовое ядро уже собрано в MVP framing, но оно станет настоящим core только если пользователи поймут причинность петли и смогут объяснить, зачем вернуться завтра.

## Файлы

- `data_processed/russian_observed_evidence_ladder.csv`
- `docs/decision/russian-observed-evidence-ladder-v1.md`
- `data_processed/hypothesis_decision_matrix.csv`
- `data_processed/validation_gate_calculator.csv`
- `data_processed/p0_validation_command_center.csv`
- `data_processed/russian_validation_gate_cards.csv`
