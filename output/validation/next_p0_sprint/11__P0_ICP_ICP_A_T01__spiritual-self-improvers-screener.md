# P0_ICP_ICP_A_T01: Spiritual self-improvers / screener

## Что это проверяет

- Блок: Затем ICP recent behavior
- Гипотезы: H5|H6
- Timebox: 20-30 min
- Source URL: нет внешнего URL; использовать участника/прототипный стимул
- Capture file: `data_processed/icp_interview_capture_sheet.csv`
- Capture rows: `ICP_A_T01_P01|ICP_A_T01_P02`
- Current status mix: secondary_voc_signoff_completed_not_interview:1|not_started:1

## Действие оператора

спросить, какие приложения/ритуалы/дневники/коучи/avatar-tools участник использовал за 30 дней и что запустило последнее использование

## Вопросы / prompts

- Ask: "Which apps, rituals, games, journals, coaches, avatars, or guidance tools did you use in the last 30 days, and what triggered the last use?" Match against: Uses astrology, tarot, manifestation, devotional, journaling, or guidance apps to make today feel meaningful.
- Ask: "Which apps, rituals, games, journals, coaches, avatars, or guidance tools did you use in the last 30 days, and what triggered the last use?" Match against: Uses astrology, tarot, manifestation, devotional, journaling, or guidance apps to make today feel meaningful.

## Минимальное evidence

- [ ] recent_behavior_match=yes/no

## Что записать в source CSV

- [ ] `capture_status`
- [ ] observed answer / visible text / behavior
- [ ] exact quote or screenshot/source path
- [ ] success/pass signal
- [ ] downgrade/kill signal
- [ ] researcher notes

Primary source file to update: `data_processed/icp_interview_capture_sheet.csv`

Downstream reference file: `data_processed/icp_validation_test_plan.csv`

## Pass / Downgrade

Pass signal: Participant names recent behavior without being led and describes a recurring trigger.

Downgrade signal: Participant only likes the idea abstractly or cannot name a recent behavior.

## Boundary

intake routing не является observed evidence и не апгрейдит H1-H6 без заполненных capture rows

Эта карточка не является observed evidence. Она становится доказательной только после заполнения capture rows, скриншотов, цитат, цен, session notes или scorecard values.
