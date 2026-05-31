# ICP Secondary VOC Signoff V1

Generated: 2026-05-31T15:52:29.107Z

## Purpose

This artifact adds secondary voice-of-customer context to the first ICP capture slots for the two top interview segments. It intentionally does not count as interview success: no participant was interviewed, no recent behavior was observed live, and no willingness-to-pay answer was collected.

## Gate Read

- Secondary VOC rows filled: 12.
- H5 should move to in-progress/partial observed context, but success must remain 0 until real interviews are filled.
- H6 can use this as prompt/context input only; product-core validation still requires prototype sessions.

## Signoff Rows

| Capture | Segment | Test | Audience Rows | Review Rows | VOC Themes | Claim Limit |
| --- | --- | --- | ---: | ---: | --- | --- |
| ICP_A_T01_P01 | Spiritual self-improvers | screener | 6636 | 1951 | VOC_VISIBLE_PROGRESS/VOC_PERSONALIZATION_FEEL_SEEN/VOC_DAILY_ANCHOR | Secondary VOC evidence only; not an interview, not representative demand proof, not success evidence for H5/H6. |
| ICP_A_T02_P01 | Spiritual self-improvers | problem_interview | 6636 | 1951 | VOC_VISIBLE_PROGRESS/VOC_PERSONALIZATION_FEEL_SEEN/VOC_DAILY_ANCHOR | Secondary VOC evidence only; not an interview, not representative demand proof, not success evidence for H5/H6. |
| ICP_A_T03_P01 | Spiritual self-improvers | prototype_loop | 6636 | 1951 | VOC_VISIBLE_PROGRESS/VOC_PERSONALIZATION_FEEL_SEEN/VOC_DAILY_ANCHOR | Secondary VOC evidence only; not an interview, not representative demand proof, not success evidence for H5/H6. |
| ICP_A_T04_P01 | Spiritual self-improvers | positioning_test | 6636 | 1951 | VOC_VISIBLE_PROGRESS/VOC_PERSONALIZATION_FEEL_SEEN/VOC_DAILY_ANCHOR | Secondary VOC evidence only; not an interview, not representative demand proof, not success evidence for H5/H6. |
| ICP_A_T05_P01 | Spiritual self-improvers | willingness_to_pay | 6636 | 1951 | VOC_VISIBLE_PROGRESS/VOC_PERSONALIZATION_FEEL_SEEN/VOC_DAILY_ANCHOR | Secondary VOC evidence only; not an interview, not representative demand proof, not success evidence for H5/H6. |
| ICP_A_T06_P01 | Spiritual self-improvers | disconfirmation | 6636 | 1951 | VOC_VISIBLE_PROGRESS/VOC_PERSONALIZATION_FEEL_SEEN/VOC_DAILY_ANCHOR | Secondary VOC evidence only; not an interview, not representative demand proof, not success evidence for H5/H6. |
| ICP_D_T01_P01 | Habit and progress users | screener | 7139 | 1653 | VOC_VISIBLE_PROGRESS/VOC_PERSONALIZATION_FEEL_SEEN/VOC_DAILY_ANCHOR | Secondary VOC evidence only; not an interview, not representative demand proof, not success evidence for H5/H6. |
| ICP_D_T02_P01 | Habit and progress users | problem_interview | 7139 | 1653 | VOC_VISIBLE_PROGRESS/VOC_PERSONALIZATION_FEEL_SEEN/VOC_DAILY_ANCHOR | Secondary VOC evidence only; not an interview, not representative demand proof, not success evidence for H5/H6. |
| ICP_D_T03_P01 | Habit and progress users | prototype_loop | 7139 | 1653 | VOC_VISIBLE_PROGRESS/VOC_PERSONALIZATION_FEEL_SEEN/VOC_DAILY_ANCHOR | Secondary VOC evidence only; not an interview, not representative demand proof, not success evidence for H5/H6. |
| ICP_D_T04_P01 | Habit and progress users | positioning_test | 7139 | 1653 | VOC_VISIBLE_PROGRESS/VOC_PERSONALIZATION_FEEL_SEEN/VOC_DAILY_ANCHOR | Secondary VOC evidence only; not an interview, not representative demand proof, not success evidence for H5/H6. |
| ICP_D_T05_P01 | Habit and progress users | willingness_to_pay | 7139 | 1653 | VOC_VISIBLE_PROGRESS/VOC_PERSONALIZATION_FEEL_SEEN/VOC_DAILY_ANCHOR | Secondary VOC evidence only; not an interview, not representative demand proof, not success evidence for H5/H6. |
| ICP_D_T06_P01 | Habit and progress users | disconfirmation | 7139 | 1653 | VOC_VISIBLE_PROGRESS/VOC_PERSONALIZATION_FEEL_SEEN/VOC_DAILY_ANCHOR | Secondary VOC evidence only; not an interview, not representative demand proof, not success evidence for H5/H6. |

## Files

- `data_processed/icp_secondary_voc_signoff.csv`
- `data_processed/icp_interview_capture_sheet.csv`
- `data_processed/icp_segment_matrix.csv`
- `data_processed/russian_voc_objection_map.csv`
- `data_processed/review_jtbd_cluster_summary.csv`
