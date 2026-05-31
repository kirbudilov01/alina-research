# Validation Evidence Rollup V1

Generated: 2026-05-31T08:46:00.718Z

## Purpose

This rollup audits the validation intake layer at command level. It verifies that every command has a batch note, identifies notes that already point to existing local artifacts, and keeps those links clearly below human signoff or final validation proof.

## Summary

- Command rows: 75
- Batch rows: 75
- Note files present: 75
- Local artifact links present: 29
- Notes ready without local artifact: 46
- Missing batch notes: 0

Evidence state mix:

- note_ready_no_local_artifact: 46
- local_artifact_linked_not_signed_off: 29

Rows by lane:

- paid_flow_validation: 29
- prototype_user_validation: 16
- manual_competitor_walkthrough: 12
- icp_interviews: 12
- prototype_scorecard_gate: 6

## Lane Summary

| Lane | Total | Local Artifact Linked | Note Ready Only | Missing |
| --- | ---: | ---: | ---: | ---: |
| manual_competitor_walkthrough | 12 | 0 | 12 | 0 |
| prototype_scorecard_gate | 6 | 0 | 6 | 0 |
| prototype_user_validation | 16 | 0 | 16 | 0 |
| icp_interviews | 12 | 0 | 12 | 0 |
| paid_flow_validation | 29 | 29 | 0 | 0 |

## Local Artifact Links

| Command | Batch | Priority | Target | Local Artifact |
| --- | --- | --- | --- | --- |
| P0_PAYWALL_02 | BATCH_02 | P0 | Character AI: Chat, Talk, Text | output/paywall_screenshots/02-character-ai-chat-talk-text-high.png |
| P0_PAYWALL_03 | BATCH_02 | P0 | Headspace: Sleep & Meditate | output/paywall_screenshots/03-headspace-sleep-meditate-high.png |
| P0_PAYWALL_04 | BATCH_02 | P0 | Meditopia: Sleep & Meditation | output/paywall_screenshots/04-meditopia-sleep-meditation-high.png |
| P0_PAYWALL_05 | BATCH_02 | P0 | Nebula: Spiritual Guidance | output/paywall_screenshots/05-nebula-spiritual-guidance-high.png |
| P0_PAYWALL_08 | BATCH_02 | P0 | Carrom Pool: Disc Game | output/paywall_screenshots/08-carrom-pool-disc-game-medium.png |
| P0_PAYWALL_13 | BATCH_02 | P0 | Avatar World ® | output/paywall_screenshots/13-avatar-world-medium.png |
| P0_PAYWALL_15 | BATCH_02 | P0 | AstroSage Kundli: AI Astrology | output/paywall_screenshots/15-astrosage-kundli-ai-astrology-medium.png |
| P0_PAYWALL_17 | BATCH_02 | P0 | NBA 2K Mobile Basketball Game | output/paywall_screenshots/17-nba-2k-mobile-basketball-game-medium.png |
| P0_PAYWALL_21 | BATCH_02 | P0 | Everskies: Virtual Dress up | output/paywall_screenshots/21-everskies-virtual-dress-up-medium.png |
| P0_PAYWALL_25 | BATCH_02 | P0 | Mindfulness with Petit BamBou | output/paywall_screenshots/25-mindfulness-with-petit-bambou-medium.png |
| P0_PAYWALL_28 | BATCH_02 | P0 | Monster Girl Maker 2 | output/paywall_screenshots/28-monster-girl-maker-2-medium.png |
| P0_PAYWALL_29 | BATCH_02 | P0 | Monster Girl Maker | output/paywall_screenshots/29-monster-girl-maker-medium.png |
| P0_PAYWALL_01 | BATCH_03 | P1_context | The Sims™ FreePlay | output/paywall_screenshots/01-the-sims-freeplay-high.png |
| P0_PAYWALL_06 | BATCH_03 | P1_context | Lords Mobile: Kingdom Wars | output/paywall_screenshots/06-lords-mobile-kingdom-wars-medium.png |
| P0_PAYWALL_07 | BATCH_03 | P1_context | Clash of Clans | output/paywall_screenshots/07-clash-of-clans-medium.png |
| P0_PAYWALL_09 | BATCH_03 | P1_context | Pokémon GO | output/paywall_screenshots/09-pok-mon-go-medium.png |
| P0_PAYWALL_10 | BATCH_03 | P1_context | Tennis Clash: Multiplayer Game | output/paywall_screenshots/10-tennis-clash-multiplayer-game-medium.png |
| P0_PAYWALL_11 | BATCH_03 | P1_context | Mob Control | output/paywall_screenshots/11-mob-control-medium.png |
| P0_PAYWALL_12 | BATCH_03 | P1_context | Modern Strike Online: War FPS | output/paywall_screenshots/12-modern-strike-online-war-fps-medium.png |
| P0_PAYWALL_14 | BATCH_03 | P1_context | Call of Duty®: Mobile - Garena | output/paywall_screenshots/14-call-of-duty-mobile-garena-medium.png |
| P0_PAYWALL_16 | BATCH_03 | P1_context | Calm - Sleep, Meditate, Relax | output/paywall_screenshots/16-calm-sleep-meditate-relax-medium.png |
| P0_PAYWALL_18 | BATCH_03 | P1_context | Rainbow Six Mobile | output/paywall_screenshots/18-rainbow-six-mobile-medium.png |
| P0_PAYWALL_19 | BATCH_03 | P1_context | WWE Mayhem | output/paywall_screenshots/19-wwe-mayhem-medium.png |
| P0_PAYWALL_20 | BATCH_03 | P1_context | Mirror: Emoji maker, Stickers | output/paywall_screenshots/20-mirror-emoji-maker-stickers-medium.png |
| P0_PAYWALL_22 | BATCH_03 | P1_context | PRISM Live Studio: Games & IRL | output/paywall_screenshots/22-prism-live-studio-games-irl-medium.png |
| P0_PAYWALL_23 | BATCH_03 | P1_context | BetterMe: Health Coaching | output/paywall_screenshots/23-betterme-health-coaching-medium.png |
| P0_PAYWALL_24 | BATCH_03 | P1_context | Insight Timer - Meditation App | output/paywall_screenshots/24-insight-timer-meditation-app-medium.png |
| P0_PAYWALL_26 | BATCH_03 | P1_context | Hallow: Prayer & Meditation | output/paywall_screenshots/26-hallow-prayer-meditation-medium.png |
| P0_PAYWALL_27 | BATCH_03 | P1_context | Co–Star Personalized Astrology | output/paywall_screenshots/27-co-star-personalized-astrology-medium.png |

## Operating Rule

- Treat `local_artifact_linked_not_signed_off` as existing local evidence only; it is not a confirmed human verdict.
- Upgrade or downgrade claims only after the linked note, source CSV, and relevant capture sheet agree.
- Keep `note_ready_no_local_artifact` rows in the validation queue until screenshots, quotes, observed values, or scorecard calculations exist.

## Files

- `data_processed/validation_evidence_rollup.csv`
- `data_processed/validation_batch_01_index.csv`
- `data_processed/validation_batch_02_index.csv`
- `data_processed/validation_batch_03_index.csv`
