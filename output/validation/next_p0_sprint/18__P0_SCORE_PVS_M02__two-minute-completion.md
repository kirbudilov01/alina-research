# P0_SCORE_PVS_M02: two_minute_completion

## Что это проверяет

- Блок: После этого prototype loop
- Гипотезы: H4|H6
- Timebox: 5-10 min after sessions
- Source URL: нет внешнего URL; использовать участника/прототипный стимул
- Capture file: `data_processed/prototype_validation_scorecard.csv`
- Capture rows: `PVS_M02`
- Current status mix: metric_defined:1

## Действие оператора

после сессий посчитать observed value и gate status по этой метрике

## Вопросы / prompts

- two_minute_completion: success >=70% complete simulated loop in under 120 seconds; kill <40% complete or flow feels too fragmented

## Минимальное evidence

- [ ] two_minute_completion

## Что записать в source CSV

- [ ] `capture_status`
- [ ] observed answer / visible text / behavior
- [ ] exact quote or screenshot/source path
- [ ] success/pass signal
- [ ] downgrade/kill signal
- [ ] researcher notes

Primary source file to update: `data_processed/prototype_validation_scorecard.csv`

Downstream reference file: `data_processed/prototype_validation_scorecard.csv`

## Pass / Downgrade

Pass signal: >=70% complete simulated loop in under 120 seconds

Downgrade signal: <40% complete or flow feels too fragmented

## Boundary

intake routing не является observed evidence и не апгрейдит H1-H6 без заполненных capture rows

Эта карточка не является observed evidence. Она становится доказательной только после заполнения capture rows, скриншотов, цитат, цен, session notes или scorecard values.
