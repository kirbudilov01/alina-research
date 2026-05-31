# P0_MANUAL_03: Miracle Morning Routine

## Что это проверяет

- Блок: Сначала hidden-clone walkthrough
- Гипотезы: H1|H3
- Timebox: 25-35 min
- Source URL: https://apps.apple.com/us/app/miracle-morning-routine/id1581511740?uo=4
- Capture file: `data_processed/manual_walkthrough_capture_sheet.csv`
- Capture rows: `MCI_03_MCI_S01|MCI_03_MCI_S02|MCI_03_MCI_S03|MCI_03_MCI_S04|MCI_03_MCI_S05`
- Current status mix: public_listing_signoff_completed_not_app_walkthrough:1|not_started:4

## Действие оператора

открыть listing/app, сохранить 5 слотов скриншотов, записать full-loop/directness/causality verdict

## Вопросы / prompts

- What promise, audience, and daily loop does the public listing imply?
- Does onboarding show one coherent loop or separate feature shelves?
- Is there a concrete action that can be completed in under two minutes?

## Минимальное evidence

- [ ] app_store_listing_or_public_positioning
- [ ] onboarding_first_value_screen
- [ ] first_daily_action_or_task_screen
- [ ] progress_avatar_identity_feedback_screen
- [ ] first_paywall_or_iap_terms_screen

## Что записать в source CSV

- [ ] `capture_status`
- [ ] observed answer / visible text / behavior
- [ ] exact quote or screenshot/source path
- [ ] success/pass signal
- [ ] downgrade/kill signal
- [ ] researcher notes

Primary source file to update: `data_processed/manual_walkthrough_capture_sheet.csv`

Downstream reference file: `data_processed/manual_competitor_inspection_packet.csv`

## Pass / Downgrade

Pass signal: evidence supports close substitute/directness classification and clarifies whether action->identity/avatar causality exists

Downgrade signal: metadata claim is not visible, flow is unrelated, or app is only decorative/generic without daily transformation loop

## Boundary

intake routing не является observed evidence и не апгрейдит H1-H6 без заполненных capture rows

Эта карточка не является observed evidence. Она становится доказательной только после заполнения capture rows, скриншотов, цитат, цен, session notes или scorecard values.
