# P0 Validation Field Guide V1

Generated: 2026-05-31T07:59:49.592Z

## Purpose

This field guide turns the P0 command center into executable operator scripts. It is designed for the first validation tranche: competitor walkthroughs, paid-flow signoff, ICP interviews, prototype sessions, and scorecard updates. It does not close validation by itself.

## Summary

- Guide sections: 8
- Command center rows referenced: 75
- P0 blockers referenced: 6
- P0 rows referenced: 52

Sections by lane:

- all: 3
- manual_competitor_walkthrough: 1
- paid_flow_validation: 1
- icp_interviews: 1
- prototype_user_validation: 1
- prototype_scorecard_gate: 1

## Field Guide

| ID | Lane | Title | Objective | Evidence |
| --- | --- | --- | --- | --- |
| FG_01 | all | Evidence handling rules | Prevent claim inflation while validation is being executed. | screenshot_paths<br>participant_quote<br>observed_value<br>human_signoff_note<br>final_verdict |
| FG_02 | all | Evidence file naming | Make screenshots and session notes auditable without opening the whole repo. | raw screenshot path<br>notes path<br>command_id<br>slot |
| FG_03 | manual_competitor_walkthrough | Competitor walkthrough script | Decide whether P0 competitors secretly own the Alina loop. | app_store_listing_or_public_positioning<br>onboarding_first_value_screen<br>first_daily_action_or_task_screen<br>progress_avatar_identity_feedback_screen<br>first_paywall_or_iap_terms_screen |
| FG_04 | paid_flow_validation | Paid-flow signoff script | Turn proxy market-money evidence into human-signed conservative labels. | public pricing screenshot<br>app/product match<br>trial length<br>monthly price<br>annual price<br>first meaningful paywall boundary<br>human signoff note |
| FG_05 | icp_interviews | ICP interview script | Select a primary and secondary ICP from observed recent behavior, language resonance, and paid depth. | recent_behavior_match<br>specific_episode<br>workaround<br>pain_intensity_1_5<br>preferred_concept<br>differentiation_1_5<br>acceptable_price_range<br>fatal_objection<br>verbatim_quote |
| FG_06 | prototype_user_validation | Two-minute prototype session script | Validate whether the integrated loop is understood, differentiated, emotionally meaningful, and safe. | completion_time_seconds<br>comprehension_yes_no<br>meaning_lift_1_5<br>differentiation_1_5<br>return_intent_1_5<br>trust_objection<br>verbatim_quote |
| FG_07 | prototype_scorecard_gate | Prototype scorecard calculation | Translate session observations into H4/H6 go, hold, pivot, or stop evidence. | observed_value<br>gate_status<br>supporting_quotes<br>sample_size |
| FG_08 | all | Post-validation rebuild protocol | Keep local evidence, report, PDF, manifest, and GitHub in sync after validation. | terminal output<br>git commit hash<br>updated manifest rows<br>updated PDF readback |

## Scripts

### FG_01. Evidence handling rules

- Lane: all
- Objective: Prevent claim inflation while validation is being executed.
- Checklist/script: Capture raw evidence first; then write notes; then assign verdict; then update downstream CSV/docs/PDF in the same commit. Never upgrade H1-H6 from hold_validate from memory or vibe.
- Evidence to capture: screenshot_paths|participant_quote|observed_value|human_signoff_note|final_verdict
- Pass/success gate: Every changed claim links back to a saved evidence artifact or filled capture row.
- Downgrade/kill gate: Any result that contradicts the current claim updates the claim language before report/PDF regeneration.
- Source rows: commands=75; blockers=6; p0=52
- Output update protocol: Update source capture CSV -> rebuild p0 command center -> rebuild hypothesis decisions -> rebuild audits/report/PDF -> commit/push.

### FG_02. Evidence file naming

- Lane: all
- Objective: Make screenshots and session notes auditable without opening the whole repo.
- Checklist/script: Use output/validation/YYYY-MM-DD/<lane>/<command_id>__<target_slug>__<slot>.png for screenshots and .md for notes. Keep raw screenshots unchanged; add interpretation in CSV notes fields.
- Evidence to capture: raw screenshot path|notes path|command_id|slot
- Pass/success gate: Every capture path can be joined back to command_id and source file row.
- Downgrade/kill gate: Unlinked screenshots or notes cannot support final claims.
- Source rows: data_processed/p0_validation_command_center.csv
- Output update protocol: Fill captured_screenshot_paths or relevant capture sheet fields with exact local paths.

### FG_03. Competitor walkthrough script

- Lane: manual_competitor_walkthrough
- Objective: Decide whether P0 competitors secretly own the Alina loop.
- Checklist/script: 1. Open listing/source URL and save public positioning screenshot. | 2. Start onboarding or public demo and capture first value screen. | 3. Locate first action/task a user can complete. | 4. Capture progress/avatar/identity feedback immediately after action. | 5. Capture first paywall or free boundary. | 6. Answer: full loop, adjacent loop, weak adjacency, blocked, or hidden direct clone.
- Evidence to capture: app_store_listing_or_public_positioning|onboarding_first_value_screen|first_daily_action_or_task_screen|progress_avatar_identity_feedback_screen|first_paywall_or_iap_terms_screen
- Pass/success gate: At least 5 P0 apps receive final directness, causality, hidden clone risk, and paywall-boundary verdicts.
- Downgrade/kill gate: Any app fully owns personal meaning -> action -> reset -> causally changing identity/avatar/progress -> next-day hook.
- Source rows: manual_targets=12; first_targets=Shepherd: Spiritual Bible BFF | Zing AI: Home & Gym Workouts | Miracle Morning Routine | EVOLVE: Transform Your Life | Daily Yoga: Yoga for Fitness®
- Output update protocol: Update data_processed/manual_competitor_inspection_packet.csv and data_processed/manual_walkthrough_capture_sheet.csv.

### FG_04. Paid-flow signoff script

- Lane: paid_flow_validation
- Objective: Turn proxy market-money evidence into human-signed conservative labels.
- Checklist/script: 1. Open existing screenshot_path and source_url. | 2. Confirm product match: same app, same brand, or parent-company-only. | 3. Record visible monthly, annual, trial, or bundle price. | 4. Mark confirm, partial, reject, login-gated, or unrelated. | 5. Capture in-app paywall boundary only when available without unsafe account/payment steps.
- Evidence to capture: public pricing screenshot|app/product match|trial length|monthly price|annual price|first meaningful paywall boundary|human signoff note
- Pass/success gate: Highest-money competitors receive confirm/partial/reject paid-flow labels with notes.
- Downgrade/kill gate: Signals mostly belong to parent pages, unrelated products, OCR artifacts, or login-gated pages.
- Source rows: paywall_rows=29; high_priority=Character AI: Chat, Talk, Text | Headspace: Sleep & Meditate | Meditopia: Sleep & Meditation | Nebula: Spiritual Guidance | Carrom Pool: Disc Game | Avatar World ® | AstroSage Kundli: AI Astrology | NBA 2K Mobile Basketball Game | Everskies: Virtual Dress up | Mindfulness with Petit BamBou
- Output update protocol: Update data_processed/web_paywall_visual_adjudication.csv and paid_flow_capture_sheet.csv.

### FG_05. ICP interview script

- Lane: icp_interviews
- Objective: Select a primary and secondary ICP from observed recent behavior, language resonance, and paid depth.
- Checklist/script: 1. Screener: which apps/rituals/tools did you use in the last 30 days and what triggered last use? | 2. Last episode: tell me the last moment when you needed this job. | 3. Workaround: what did you use instead and what was missing? | 4. Prototype loop narration: what do you think is happening? | 5. Positioning comparison: current tool vs generic habit/coach vs Alina angle. | 6. WTP: what do you pay for now and what paid depth would be worth testing? | 7. Disconfirmation: what feels unsafe, cringe, manipulative, generic, or not for you?
- Evidence to capture: recent_behavior_match|specific_episode|workaround|pain_intensity_1_5|preferred_concept|differentiation_1_5|acceptable_price_range|fatal_objection|verbatim_quote
- Pass/success gate: One primary and one secondary ICP selected with recent behavior, shared language, activation trigger, and WTP signal.
- Downgrade/kill gate: No segment recalls concrete use episodes or all reject action-tied identity/progress premise.
- Source rows: p0_icp_tests=12; segments=ICP_A|ICP_D
- Output update protocol: Update data_processed/icp_validation_test_plan.csv, icp_interview_capture_sheet.csv, and icp_segment_matrix.csv.

### FG_06. Two-minute prototype session script

- Lane: prototype_user_validation
- Objective: Validate whether the integrated loop is understood, differentiated, emotionally meaningful, and safe.
- Checklist/script: Show S01-S08 in order. | Ask participant to narrate each screen. | Do not explain the product until after S08. | On S06 ask: what changed, and what caused the change? | After S08 ask what they would call the product and whether they would return tomorrow. | Record completion time and verbatim confusion/trust/differentiation language.
- Evidence to capture: completion_time_seconds|comprehension_yes_no|meaning_lift_1_5|differentiation_1_5|return_intent_1_5|trust_objection|verbatim_quote
- Pass/success gate: Participants understand action -> avatar/progress causality and prefer the integrated loop over generic alternatives.
- Downgrade/kill gate: Participants read the loop as generic, unsafe, childish, manipulative, decorative, or not worth returning to.
- Source rows: prototype_rows=16; scorecard_metrics=6
- Output update protocol: Update prototype_session_capture_sheet.csv and prototype_validation_scorecard.csv.

### FG_07. Prototype scorecard calculation

- Lane: prototype_scorecard_gate
- Objective: Translate session observations into H4/H6 go, hold, pivot, or stop evidence.
- Checklist/script: PVS_M01: success >=80% of prototype participants correctly explain personal meaning -> action -> avatar/progress causality; kill <50% can explain the causal loop without prompting | PVS_M02: success >=70% complete simulated loop in under 120 seconds; kill <40% complete or flow feels too fragmented | PVS_M03: success Average meaning_lift >=4/5 among target ICP participants; kill Average meaning_lift <=2.5/5 | PVS_M04: success >=60% prefer Alina framing over generic habit/coach alternative; kill Generic habit/coach/meditation alternative wins by clear margin | PVS_M05: success No fatal safety/trust objection from target participants; objections are addressable by copy/control; kill Recurring fatal objections: manipulative, spiritual overclaim, childish, clinical, or unsafe guidance | PVS_M06: success >=40% name a plausible paid depth feature after free loop value is clear; kill Users expect all value free or reject paid depth after seeing loop
- Evidence to capture: observed_value|gate_status|supporting_quotes|sample_size
- Pass/success gate: PVS_M01, PVS_M04, and PVS_M05 pass without fatal objections; remaining metrics are directionally positive.
- Downgrade/kill gate: Any blocker metric hits its kill threshold or exposes a repeated fatal trust/safety objection.
- Source rows: scorecard_metrics=6
- Output update protocol: Update prototype_validation_scorecard.csv, hypothesis_decision_matrix.csv, evidence_claim_register.csv, and completion audit.

### FG_08. Post-validation rebuild protocol

- Lane: all
- Objective: Keep local evidence, report, PDF, manifest, and GitHub in sync after validation.
- Checklist/script: Run: npm run build:p0-command-center && npm run build:hypothesis-decision && npm run build:evidence-manifest && npm run build:evidence-audit && npm run build:completion-audit && npm run build:report-draft && npm run build:polished-pdf && npm test. Then commit and push.
- Evidence to capture: terminal output|git commit hash|updated manifest rows|updated PDF readback
- Pass/success gate: Repo is clean after commit/push and report/PDF reflect changed verdicts.
- Downgrade/kill gate: Validation evidence exists locally but is not committed, not linked, or not reflected in report/PDF.
- Source rows: package.json scripts and generated artifacts
- Output update protocol: Commit every validation tranche with source CSVs, docs, reports, PDFs, and manifest.

## Claim Boundary

- This guide is an execution asset, not validation evidence.
- Only filled capture rows, screenshots, participant quotes, human signoff notes, and updated verdicts can upgrade or downgrade H1-H6.
- After each validation tranche, rebuild the evidence package and push to GitHub.

## Files

- `data_processed/p0_validation_field_guide.csv`
