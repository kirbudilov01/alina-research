# Русские prototype session dossiers V1

Собрано: 2026-05-31T13:03:29.359Z

## Зачем нужен этот слой

Этот dossier переводит H4/H6 из красивого описания продуктовой петли в исполнимую программу прототипных сессий. Он показывает, какие экраны проходят участники, какие моменты являются критическими, какие scorecard metrics решают конкурентное преимущество и продуктовое ядро, и какие ответы заставляют усилить или ослабить claims.

Всего prototype dossiers: 2. Capture rows: 80. Completed rows: 0. Scorecard metrics: 6. Пока completed rows равны нулю, H4/H6 остаются prototype-stimulus-ready, но не validated.

## Prototype session очередь

| ICP | Segment | Screens | Rows | Done | Critical screens |
| --- | --- | ---: | ---: | ---: | --- |
| ICP_A | Spiritual self-improvers | 8 | 40 | 0 | S03_ACTION_CARD: Participant sees the action as doable and causally linked to the chosen theme. / S06_AVATAR_CHANGE: Participant understands action -> identity/avatar causality. / S08_VALUE_CHECK: Participant names the integrated loop in their own words. |
| ICP_D | Habit and progress users | 8 | 40 | 0 | S03_ACTION_CARD: Participant sees the action as doable and causally linked to the chosen theme. / S06_AVATAR_CHANGE: Participant understands action -> identity/avatar causality. / S08_VALUE_CHECK: Participant names the integrated loop in their own words. |

## ICP_A. Spiritual self-improvers

**Core job:** Turn symbolic/personal meaning into one grounded action today.

**Flow:** S01_ENTRY: Daily meaning entry -> Narrate what you think is happening on this screen. | S02_REFLECTION: Tiny context prompt -> Narrate what you think is happening on this screen. | S03_ACTION_CARD: One grounded action -> Narrate what you think is happening on this screen. | S04_RESET: Short reset -> Narrate what you think is happening on this screen. | S05_COMPLETION: Action evidence -> Narrate what you think is happening on this screen. | S06_AVATAR_CHANGE: Identity/avatar feedback -> What changed, and what caused the change? | S07_TOMORROW_HOOK: Next-day hook -> Narrate what you think is happening on this screen. | S08_VALUE_CHECK: Immediate value check -> What would you call this product after using this loop once?

**Critical screens:** S03_ACTION_CARD: Participant sees the action as doable and causally linked to the chosen theme. | S06_AVATAR_CHANGE: Participant understands action -> identity/avatar causality. | S08_VALUE_CHECK: Participant names the integrated loop in their own words.

**Scorecard:** PVS_M01/comprehension: success >=80% of prototype participants correctly explain personal meaning -> action -> avatar/progress causality; kill <50% can explain the causal loop without prompting | PVS_M02/two_minute_completion: success >=70% complete simulated loop in under 120 seconds; kill <40% complete or flow feels too fragmented | PVS_M03/meaning_lift: success Average meaning_lift >=4/5 among target ICP participants; kill Average meaning_lift <=2.5/5 | PVS_M04/differentiation: success >=60% prefer Alina framing over generic habit/coach alternative; kill Generic habit/coach/meditation alternative wins by clear margin | PVS_M05/trust_safety: success No fatal safety/trust objection from target participants; objections are addressable by copy/control; kill Recurring fatal objections: manipulative, spiritual overclaim, childish, clinical, or unsafe guidance | PVS_M06/paid_depth: success >=40% name a plausible paid depth feature after free loop value is clear; kill Users expect all value free or reject paid depth after seeing loop

**Capture:** completion_time_seconds|comprehension_yes_no|meaning_lift_1_5|differentiation_1_5|return_intent_1_5|verbatim_quote|fatal_objection

**Upgrade:** усилить H4/H6 только если участники понимают причинность meaning -> action -> avatar/progress, проходят петлю примерно за две минуты, видят отличие от habit/coach/meditation альтернатив и не дают fatal trust/safety objection.

**Downgrade:** ослабить H4/H6, если пользователи читают петлю как generic habit tracker, vague reading, manipulative gamification, childish avatar toy или unsafe guidance. Segment risk: Alina needs careful framing: soft guidance, no deterministic claims, visible limits, and clear safety posture.

## ICP_D. Habit and progress users

**Core job:** Make vague growth concrete and keep momentum without streak anxiety.

**Flow:** S01_ENTRY: Daily meaning entry -> Narrate what you think is happening on this screen. | S02_REFLECTION: Tiny context prompt -> Narrate what you think is happening on this screen. | S03_ACTION_CARD: One grounded action -> Narrate what you think is happening on this screen. | S04_RESET: Short reset -> Narrate what you think is happening on this screen. | S05_COMPLETION: Action evidence -> Narrate what you think is happening on this screen. | S06_AVATAR_CHANGE: Identity/avatar feedback -> What changed, and what caused the change? | S07_TOMORROW_HOOK: Next-day hook -> Narrate what you think is happening on this screen. | S08_VALUE_CHECK: Immediate value check -> What would you call this product after using this loop once?

**Critical screens:** S03_ACTION_CARD: Participant sees the action as doable and causally linked to the chosen theme. | S06_AVATAR_CHANGE: Participant understands action -> identity/avatar causality. | S08_VALUE_CHECK: Participant names the integrated loop in their own words.

**Scorecard:** PVS_M01/comprehension: success >=80% of prototype participants correctly explain personal meaning -> action -> avatar/progress causality; kill <50% can explain the causal loop without prompting | PVS_M02/two_minute_completion: success >=70% complete simulated loop in under 120 seconds; kill <40% complete or flow feels too fragmented | PVS_M03/meaning_lift: success Average meaning_lift >=4/5 among target ICP participants; kill Average meaning_lift <=2.5/5 | PVS_M04/differentiation: success >=60% prefer Alina framing over generic habit/coach alternative; kill Generic habit/coach/meditation alternative wins by clear margin | PVS_M05/trust_safety: success No fatal safety/trust objection from target participants; objections are addressable by copy/control; kill Recurring fatal objections: manipulative, spiritual overclaim, childish, clinical, or unsafe guidance | PVS_M06/paid_depth: success >=40% name a plausible paid depth feature after free loop value is clear; kill Users expect all value free or reject paid depth after seeing loop

**Capture:** completion_time_seconds|comprehension_yes_no|meaning_lift_1_5|differentiation_1_5|return_intent_1_5|verbatim_quote|fatal_objection

**Upgrade:** усилить H4/H6 только если участники понимают причинность meaning -> action -> avatar/progress, проходят петлю примерно за две минуты, видят отличие от habit/coach/meditation альтернатив и не дают fatal trust/safety objection.

**Downgrade:** ослабить H4/H6, если пользователи читают петлю как generic habit tracker, vague reading, manipulative gamification, childish avatar toy или unsafe guidance. Segment risk: The free loop must demonstrate value before asking for deeper paid analysis or personalization.

## Файлы

- `data_processed/russian_prototype_session_dossiers.csv`
- `docs/product/russian-prototype-session-dossiers-v1.md`
- `data_processed/prototype_validation_stimulus_flow.csv`
- `data_processed/prototype_validation_scorecard.csv`
- `data_processed/prototype_session_capture_sheet.csv`
- `data_processed/russian_product_loop_cards.csv`
