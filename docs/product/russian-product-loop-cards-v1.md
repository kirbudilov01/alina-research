# Русские карточки продуктовой петли V1

Собрано: 2026-05-31T12:01:25.834Z

## Зачем нужен этот файл

Этот слой переводит prototype stimulus в русское последовательное повествование. Его задача - показать, не просто какие экраны есть в прототипе, а зачем каждый экран существует в доказательной логике Alina: какой риск он закрывает, какой сигнал должен дать пользователь, где петля может сломаться и какой validation gate нельзя усиливать без наблюдаемого evidence.

Главная граница: это не пользовательская валидация. Пока нет заполненных prototype_session_capture_sheet, H4 и H6 остаются hold_validate.

## Сводка петли

| Шаг | Экран | Роль в петле | Gate | Sec |
| ---: | --- | --- | --- | ---: |
| 1 | Daily meaning entry | Вход в личный смысл: пользователь должен почувствовать, что это не generic motivation и не жесткое предсказание. | H6: coherence of MVP loop | 20 |
| 2 | Tiny context prompt | Минимальный контекст: петля получает живую точку дня, но не превращается в длинный onboarding. | H6: coherence of MVP loop | 20 |
| 3 | One grounded action | Перевод смысла в действие: центральная проверка, что Alina не остается чтением или дневником. | H6: coherence of MVP loop | 20 |
| 4 | Short reset | Снижение трения: reset должен помогать начать действие, а не выглядеть как отдельная медитация ради медитации. | H6: coherence of MVP loop | 20 |
| 5 | Action evidence | Легкое доказательство действия: self-report должен быть достаточным и не ощущаться как контроль. | H6/H2: доказательство действия и paid-depth boundary | 20 |
| 6 | Identity/avatar feedback | Причинная видимость прогресса: ключевой момент H4/H6, где действие должно объяснять изменение identity/avatar. | H4/H6: конкурентное преимущество и продуктовая причинность | 20 |
| 7 | Next-day hook | Возврат без наказания: continuity должен поддерживать привычку без streak anxiety. | H6: return intent без punitive streak | 15 |
| 8 | Immediate value check | Проверка понимания: пользователь должен назвать интегрированную петлю своими словами. | H4/H5/H6: понимание, ICP resonance и итоговая ценность | 25 |

## 1. Daily meaning entry

**Роль:** Вход в личный смысл: пользователь должен почувствовать, что это не generic motivation и не жесткое предсказание.

**Что видит пользователь:** Today is for turning one real feeling into one small proof. Pick the theme that feels alive right now.

**Действие:** Choose one theme: courage, repair, clarity, softness, momentum.

**Сигнал успеха:** Participant can explain why this is personal rather than generic content.

**Сигнал провала:** Participant reads it as vague astrology, generic motivation, or unsafe certainty.

**Как это влияет на решение:** Экран можно оставлять в MVP только если он помогает пройти двухминутную петлю быстрее и понятнее.

## 2. Tiny context prompt

**Роль:** Минимальный контекст: петля получает живую точку дня, но не превращается в длинный onboarding.

**Что видит пользователь:** One sentence only: what do you want to feel different by tonight?

**Действие:** Type or speak one short sentence.

**Сигнал успеха:** Participant supplies a concrete lived moment or emotional target.

**Сигнал провала:** Participant skips because the prompt feels too broad, exposing, or irrelevant.

**Как это влияет на решение:** Экран можно оставлять в MVP только если он помогает пройти двухминутную петлю быстрее и понятнее.

## 3. One grounded action

**Роль:** Перевод смысла в действие: центральная проверка, что Alina не остается чтением или дневником.

**Что видит пользователь:** Your action: send one honest message, tidy one visible surface, or take a two-minute walk. Pick the one that proves your theme.

**Действие:** Pick one action and mark intent.

**Сигнал успеха:** Participant sees the action as doable and causally linked to the chosen theme.

**Сигнал провала:** Participant sees it as a random task, chore list, or generic habit tracker.

**Как это влияет на решение:** Если действие читается как случайная задача, Alina должна менять механику action selection до следующего теста.

## 4. Short reset

**Роль:** Снижение трения: reset должен помогать начать действие, а не выглядеть как отдельная медитация ради медитации.

**Что видит пользователь:** Before you do it: breathe out once, unclench your jaw, name the smallest next move.

**Действие:** Complete a simulated 15-second reset.

**Сигнал успеха:** Participant feels the reset makes action easier without feeling clinical.

**Сигнал провала:** Participant thinks the reset is filler or clashes with the progress mechanic.

**Как это влияет на решение:** Экран можно оставлять в MVP только если он помогает пройти двухминутную петлю быстрее и понятнее.

## 5. Action evidence

**Роль:** Легкое доказательство действия: self-report должен быть достаточным и не ощущаться как контроль.

**Что видит пользователь:** Proof, not perfection: tap Done and choose how it felt: lighter, clearer, braver, steadier, no change.

**Действие:** Tap Done and select one felt-state tag.

**Сигнал успеха:** Participant accepts lightweight self-report as enough evidence.

**Сигнал провала:** Participant wants objective tracking, rejects proof language, or feels judged.

**Как это влияет на решение:** Экран можно оставлять в MVP только если он помогает пройти двухминутную петлю быстрее и понятнее.

## 6. Identity/avatar feedback

**Роль:** Причинная видимость прогресса: ключевой момент H4/H6, где действие должно объяснять изменение identity/avatar.

**Что видит пользователь:** Your future-self signal brightened because you acted. Today added one visible layer: clarity.

**Действие:** Observe avatar/progress change and explain what caused it.

**Сигнал успеха:** Participant understands action -> identity/avatar causality.

**Сигнал провала:** Participant sees avatar as decoration, reward spam, or unrelated game skin.

**Как это влияет на решение:** Если пользователь не может объяснить, что изменение вызвано действием, петля теряет главное отличие от avatar toy или habit tracker.

## 7. Next-day hook

**Роль:** Возврат без наказания: continuity должен поддерживать привычку без streak anxiety.

**Что видит пользователь:** Tomorrow, we will build on this gently. No streak punishment. Just one more proof.

**Действие:** Choose reminder tone: quiet, encouraging, playful, direct.

**Сигнал успеха:** Participant wants to return and understands continuity.

**Сигнал провала:** Participant feels manipulated, infantilized, or indifferent.

**Как это влияет на решение:** Если hook ощущается как манипуляция, retention-логику нужно смягчить до повторного теста.

## 8. Immediate value check

**Роль:** Проверка понимания: пользователь должен назвать интегрированную петлю своими словами.

**Что видит пользователь:** What did Alina help you do: understand yourself, pick an action, calm down, see progress, or none?

**Действие:** Answer one choice and one open text question.

**Сигнал успеха:** Participant names the integrated loop in their own words.

**Сигнал провала:** Participant cannot distinguish it from a generic habit tracker, meditation app, or horoscope.

**Как это влияет на решение:** Если пользователь не может назвать интегрированную пользу, нельзя усиливать H4 даже при приятной реакции на отдельные экраны.

## Scorecard

| Metric | Gate | Success | Kill/Downgrade |
| --- | --- | --- | --- |
| PVS_M01 | comprehension | >=80% of prototype participants correctly explain personal meaning -> action -> avatar/progress causality | <50% can explain the causal loop without prompting |
| PVS_M02 | two_minute_completion | >=70% complete simulated loop in under 120 seconds | <40% complete or flow feels too fragmented |
| PVS_M03 | meaning_lift | Average meaning_lift >=4/5 among target ICP participants | Average meaning_lift <=2.5/5 |
| PVS_M04 | differentiation | >=60% prefer Alina framing over generic habit/coach alternative | Generic habit/coach/meditation alternative wins by clear margin |
| PVS_M05 | trust_safety | No fatal safety/trust objection from target participants; objections are addressable by copy/control | Recurring fatal objections: manipulative, spiritual overclaim, childish, clinical, or unsafe guidance |
| PVS_M06 | paid_depth | >=40% name a plausible paid depth feature after free loop value is clear | Users expect all value free or reject paid depth after seeing loop |

## Связь с H4/H6

H4 сейчас: hold_validate; evidence status: prototype_stimulus_ready_unvalidated; gap: No human prototype session yet proves users understand, prefer, or value the integrated loop.

H6 сейчас: hold_validate; evidence status: supported_for_mvp_framing; gap: No user prototype evidence yet confirms comprehension, emotional value, or retention impact.

H2 paid-depth boundary также остается открытым: Market sizing still needs actual revenue estimates, paid intelligence, manual in-app paywall validation, and willingness-to-pay prototype evidence for final investor-grade claims.

Prototype gates:

| Gate | Status | Required | Completed | Success Gate | Kill/Downgrade |
| --- | --- | ---: | ---: | --- | --- |
| GATE_H4_PROTOTYPE_ADVANTAGE | not_started | 80 | 0 | Prototype users understand and prefer the integrated loop over generic alternatives. | Participants read the loop as generic, unsafe, childish, manipulative, or not worth returning to. |
| GATE_H6_PRODUCT_CORE | not_started | 80 | 0 | MVP loop remains coherent after prototype sessions and competitor walkthrough updates. | The loop requires too much friction/content cost or users cannot explain causality. |

## Файлы

- `data_processed/russian_product_loop_cards.csv`
- `docs/product/russian-product-loop-cards-v1.md`
- `data_processed/prototype_validation_stimulus_flow.csv`
- `data_processed/prototype_validation_scorecard.csv`
- `data_processed/validation_gate_calculator.csv`
- `data_processed/hypothesis_decision_matrix.csv`
