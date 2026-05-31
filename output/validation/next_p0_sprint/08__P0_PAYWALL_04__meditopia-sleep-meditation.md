# P0_PAYWALL_04: Meditopia: Sleep & Meditation

## Что это проверяет

- Блок: Потом paid-flow/WTP evidence
- Гипотезы: H2
- Timebox: 10-15 min
- Source URL: https://meditopia.com/en/plans
- Capture file: `data_processed/paid_flow_capture_sheet.csv`
- Capture rows: `PF_02_PF_S01|PF_02_PF_S02|PF_02_PF_S03|PF_02_PF_S04`
- Current status mix: local_visual_signoff_completed:4

## Действие оператора

проверить screenshot/source, подтвердить цену, trial, product-match и границу первого paywall

## Вопросы / prompts

- Capture visible price, trial, subscription term, or IAP list.
- Capture whether the paywall appears before or after first meaningful loop value.
- Capture what paid tier unlocks and whether it matches Alina paid-depth logic.

## Минимальное evidence

- [ ] public pricing screenshot
- [ ] app/product match
- [ ] trial length
- [ ] monthly price
- [ ] annual price
- [ ] first meaningful paywall boundary
- [ ] human signoff note

## Что записать в source CSV

- [ ] `capture_status`
- [ ] observed answer / visible text / behavior
- [ ] exact quote or screenshot/source path
- [ ] success/pass signal
- [ ] downgrade/kill signal
- [ ] researcher notes

Primary source file to update: `data_processed/paid_flow_capture_sheet.csv`

Downstream reference file: `data_processed/web_paywall_visual_adjudication.csv`

## Pass / Downgrade

Pass signal: Human review confirms product-matched pricing/paywall evidence or records a conservative partial label.

Downgrade signal: Signal is parent-company only, unrelated, login-gated, OCR artifact, or not useful for Alina market-money claims.

## Boundary

intake routing не является observed evidence и не апгрейдит H1-H6 без заполненных capture rows

Эта карточка не является observed evidence. Она становится доказательной только после заполнения capture rows, скриншотов, цитат, цен, session notes или scorecard values.
