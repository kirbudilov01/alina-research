# ICP_D. Русский field session kit

Segment: Habit and progress users

Core job: Make vague growth concrete and keep momentum without streak anxiety.

Main risk: The free loop must demonstrate value before asking for deeper paid analysis or personalization.

## Session flow

| # | Phase | Min | H | Evidence |
| --- | --- | ---: | --- | --- |
| 1 | Consent и рамка безопасности | 3 | H5/H6 | consent_yes_no/recording_permission/quote_permission/participant_boundaries |
| 2 | Recent behavior screener | 7 | H5 | recent_behavior_match/current_tool/trigger_of_last_use/segment_fit_yes_no |
| 3 | Problem story и current workaround | 12 | H5/H3 | specific_episode/workaround/pain_intensity_1_5/verbatim_language/rejected_patterns |
| 4 | VOC objections и disconfirmation | 10 | H2/H4/H5/H6 | top_objection/trust_boundary/streak_or_pressure_reaction/personalization_reaction/paid_depth_reaction |
| 5 | Prototype walkthrough | 15 | H4/H6/H5 | completion_time_seconds/comprehension_yes_no/meaning_lift_1_5/differentiation_1_5/return_intent_1_5/verbatim_quote/fatal_objection |
| 6 | Value, paid depth и referral language | 8 | H2/H5/H6 | free_value_moment/paid_depth_feature/acceptable_price_range/friend_explanation/return_trigger |
| 7 | Scorecard и rebuild hygiene | 5 | H1/H2/H3/H4/H5/H6 | scorecard_metric_values/claim_update_needed/source_file_updated/rebuild_commit_hash |

## 1. Consent и рамка безопасности

**Script:** Объяснить: это исследовательская сессия, не терапия и не медицинский/духовный совет; можно пропускать вопросы; запись/цитаты только с явного согласия; задача - понять поведение, а не продать продукт.

**Pass:** участник понимает формат, дает согласие и спокойно обозначает границы

**Downgrade:** участник чувствует манипуляцию, небезопасность или не понимает, что это исследование

**Update:** researcher_notes;data_processed/icp_interview_capture_sheet.csv

## 2. Recent behavior screener

**Script:** screener: Ask: "Which apps, rituals, games, journals, coaches, avatars, or guidance tools did you use in the last 30 days, and what triggered the last use?" Match against: Uses habit trackers, planners, streaks, routines, journals, or AI coaches to stay consistent.

**Pass:** есть recent behavior и конкретный триггер последнего использования

**Downgrade:** поведение абстрактное, давно не было, или сегмент выбран по вкусу исследователя

**Update:** data_processed/icp_interview_capture_sheet.csv

## 3. Problem story и current workaround

**Script:** problem_interview: Ask for the last real moment when they needed this job: Make vague growth concrete and keep momentum without streak anxiety.. Capture exact language, workaround, emotional stakes, and what they tried instead.

**Pass:** участник рассказывает конкретный эпизод, current workaround и язык боли без наводки

**Downgrade:** участник рассуждает теоретически или проблема оказывается слабее текущих альтернатив

**Update:** data_processed/icp_interview_capture_sheet.csv;data_processed/russian_voc_objection_map.csv

## 4. VOC objections и disconfirmation

**Script:** Расскажи про последний цифровой ритуал, к которому ты возвращался несколько дней подряд. Что именно заставляло открыть его снова? | Когда ты в последний раз бросил практику, потому что не видел, что она реально работает? | Что в последнем self-improvement/productivity app стало слишком тяжелым или давящим? | Какая персональная подсказка за последний месяц попала в точку, а какая показалась пустой или манипулятивной? | Что сделало бы такой продукт небезопасным, cringe, манипулятивным или не для тебя? | За какую глубину в похожем продукте тебе было бы не жалко платить после первой бесплатной пользы?

**Pass:** возражения конкретные и addressable copy/control/design changes

**Downgrade:** fatal objection повторяется: unsafe, manipulative, generic, childish, pressure, paywall-before-value

**Update:** data_processed/russian_voc_objection_map.csv;data_processed/icp_interview_capture_sheet.csv

## 5. Prototype walkthrough

**Script:** S01_ENTRY: Daily meaning entry -> Narrate what you think is happening on this screen. | S02_REFLECTION: Tiny context prompt -> Narrate what you think is happening on this screen. | S03_ACTION_CARD: One grounded action -> Narrate what you think is happening on this screen. | S04_RESET: Short reset -> Narrate what you think is happening on this screen. | S05_COMPLETION: Action evidence -> Narrate what you think is happening on this screen. | S06_AVATAR_CHANGE: Identity/avatar feedback -> What changed, and what caused the change? | S07_TOMORROW_HOOK: Next-day hook -> Narrate what you think is happening on this screen. | S08_VALUE_CHECK: Immediate value check -> What would you call this product after using this loop once?

**Pass:** участник понимает причинность, проходит flow примерно за две минуты и формулирует отличие от generic alternatives

**Downgrade:** flow читается как generic habit tracker, vague reading, pressure system или декоративный avatar toy

**Update:** data_processed/prototype_session_capture_sheet.csv

## 6. Value, paid depth и referral language

**Script:** Спросить: что здесь должно остаться бесплатным, за какую глубину было бы честно платить, как бы ты описал продукт другу, кому бы ты его посоветовал и что должно случиться завтра, чтобы ты вернулся?

**Pass:** участник называет paid depth после free value moment и может объяснить продукт своими словами

**Downgrade:** вся ценность ожидается бесплатно, paid depth не связана с loop, или продукт невозможно пересказать

**Update:** data_processed/icp_interview_capture_sheet.csv;data_processed/paid_flow_capture_sheet.csv

## 7. Scorecard и rebuild hygiene

**Script:** Заполнить scorecard metrics: PVS_M01:comprehension | PVS_M02:two_minute_completion | PVS_M03:meaning_lift | PVS_M04:differentiation | PVS_M05:trust_safety | PVS_M06:paid_depth. Затем пересобрать validation gates, hypothesis decisions, completion audit, русский report/PDF и manifest.

**Pass:** все capture rows заполнены, scorecard посчитан, claim status обновлен только после evidence

**Downgrade:** исследователь пытается обновить narrative без заполненных строк, цитат, скриншотов или scorecard values

**Update:** data_processed/validation_gate_calculator.csv;data_processed/hypothesis_decision_matrix.csv;reports/alina-russian-narrative-report-v1.md;output/pdf/alina-russian-narrative-report-v1.pdf

## Claim boundary

Этот kit не является validation evidence. Он становится evidence только после заполнения source capture rows, сохранения цитат/скриншотов/scorecard values, пересборки gates/report/PDF/manifest и commit/push.
