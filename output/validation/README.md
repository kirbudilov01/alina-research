# Alina Validation Evidence Workspace

Generated: 2026-05-31T08:06:48.762Z

This folder is the intake area for observed validation evidence. It supports the P0 command center and field guide.

Current intake date folder: `2026-05-31`

## How To Use

1. Pick a row from `data_processed/p0_validation_command_center.csv`.
2. Copy the matching template from `output/validation/templates/`.
3. Save screenshots and notes under `output/validation/2026-05-31/<lane>/`.
4. Fill the linked capture sheet or source CSV.
5. Rebuild: `npm run build:p0-command-center && npm run build:hypothesis-decision && npm run build:evidence-manifest && npm run build:evidence-audit && npm run build:completion-audit && npm run build:report-draft && npm run build:polished-pdf && npm test`.
6. Commit and push.

## Non-Negotiable Rule

Unlinked evidence cannot upgrade claims. Every screenshot, note, quote, and verdict must include a command_id.
