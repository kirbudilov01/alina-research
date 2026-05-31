# Validation Gate Calculator V1

Generated: 2026-05-31T09:42:19.932Z

## Purpose

This calculator reads the manual walkthrough, paid-flow, ICP interview, and prototype session capture sheets and turns them into gate-level status for H1-H6. It prevents the research from upgrading a hypothesis because a checklist exists; only observed capture rows can move a gate out of hold/validate.

## Current Gate Status

| Gate | Hypotheses | Workstream | Status | Required Rows | Completed Rows | Success Rows | Decision Effect |
| --- | --- | --- | --- | ---: | ---: | ---: | --- |
| GATE_H1_MANUAL_PRODUCT_SHAPE | H1 | manual_competitor_walkthrough | not_started | 60 | 0 | 0 | keeps_hold_validate |
| GATE_H3_MANUAL_WHITESPACE | H3 | manual_competitor_walkthrough | not_started | 60 | 0 | 0 | keeps_hold_validate |
| GATE_H2_PAID_FLOW | H2 | paid_flow_validation | not_started | 40 | 0 | 0 | keeps_hold_validate |
| GATE_H5_ICP_RECENT_BEHAVIOR | H5 | icp_interviews | not_started | 96 | 0 | 0 | keeps_hold_validate |
| GATE_H4_PROTOTYPE_ADVANTAGE | H4 | prototype_user_validation | not_started | 80 | 0 | 0 | keeps_hold_validate |
| GATE_H6_PRODUCT_CORE | H6 | prototype_user_validation | not_started | 80 | 0 | 0 | keeps_hold_validate |

## Status Summary

| Status | Gates | Hypotheses | Required Capture Rows | Completed Capture Rows |
| --- | ---: | --- | ---: | ---: |
| not_started | 6 | H1/H3/H2/H5/H4/H6 | 416 | 0 |

## Interpretation

- `not_started` means the capture sheet is ready but no observed evidence has been entered.
- `in_progress_insufficient_evidence` means at least one row has started, but the gate is below threshold.
- `pass_ready_for_review` means observed rows meet the numeric threshold, but a human still needs to review the claim upgrade.
- `kill_or_downgrade_triggered` means observed evidence may contradict the hypothesis and should force a decision review.

## Files

- `data_processed/validation_gate_calculator.csv`
- `data_processed/validation_gate_status_summary.csv`
- `data_processed/manual_walkthrough_capture_sheet.csv`
- `data_processed/paid_flow_capture_sheet.csv`
- `data_processed/icp_interview_capture_sheet.csv`
- `data_processed/prototype_session_capture_sheet.csv`
