# Web Paywall Visual Adjudication V1

Generated: 2026-05-31T05:21:03.637Z

## Purpose

This layer turns the screenshot/OCR paywall queue into conservative evidence categories. It is not human sign-off and it does not inspect in-app paywalls; it decides what the captured public website screenshots can and cannot support.

## Summary

- Screenshots adjudicated: 29
- Confirmed visible public pricing: 2
- Partial paid-surface language or uncertain visible price: 8
- Weakened/rejected public page signal: 3
- Login/high-priority manual review required: 5

Visual adjudication mix:

- weak_or_unconfirmed_public_signal: 11
- partial_paid_surface_language: 5
- reject_or_weaken_public_page_signal: 3
- login_gate_or_app_store_redirect: 3
- visible_price_context_uncertain: 3
- confirmed_visible_public_pricing: 2
- manual_review_required_high_prior: 2

## Market Summary

| Market | Screenshots | Confirmed | Partial | Weakened | Manual/Login | Read |
| --- | ---: | ---: | ---: | ---: | ---: | --- |
| astrology_esoterics | 3 | 0 | 1 | 1 | 1 | mostly_unconfirmed_public_web_pricing |
| avatar_identity | 7 | 1 | 4 | 0 | 0 | visible_public_pricing_confirmed_for_some_examples |
| coaching | 1 | 0 | 0 | 1 | 0 | mostly_unconfirmed_public_web_pricing |
| gaming | 12 | 0 | 2 | 1 | 1 | paid_surface_language_directional |
| mindfulness | 6 | 1 | 1 | 0 | 3 | visible_public_pricing_confirmed_for_some_examples |

## Confirmed And Partial Examples

| Rank | App | Market | Adjudication | Price Evidence | Screenshot |
| ---: | --- | --- | --- | --- | --- |
| 2 | Character AI: Chat, Talk, Text | avatar_identity | confirmed_visible_public_pricing | $9.99/$94.99 | output/paywall_screenshots/02-character-ai-chat-talk-text-high.png |
| 4 | Meditopia: Sleep & Meditation | mindfulness | confirmed_visible_public_pricing | $3.50 | output/paywall_screenshots/04-meditopia-sleep-meditation-high.png |
| 8 | Carrom Pool: Disc Game | gaming | partial_paid_surface_language |  | output/paywall_screenshots/08-carrom-pool-disc-game-medium.png |
| 13 | Avatar World ® | avatar_identity | partial_paid_surface_language |  | output/paywall_screenshots/13-avatar-world-medium.png |
| 15 | AstroSage Kundli: AI Astrology | astrology_esoterics | partial_paid_surface_language |  | output/paywall_screenshots/15-astrosage-kundli-ai-astrology-medium.png |
| 17 | NBA 2K Mobile Basketball Game | gaming | visible_price_context_uncertain | $20 | output/paywall_screenshots/17-nba-2k-mobile-basketball-game-medium.png |
| 21 | Everskies: Virtual Dress up | avatar_identity | partial_paid_surface_language |  | output/paywall_screenshots/21-everskies-virtual-dress-up-medium.png |
| 25 | Mindfulness with Petit BamBou | mindfulness | partial_paid_surface_language |  | output/paywall_screenshots/25-mindfulness-with-petit-bambou-medium.png |
| 28 | Monster Girl Maker 2 | avatar_identity | visible_price_context_uncertain | $9 | output/paywall_screenshots/28-monster-girl-maker-2-medium.png |
| 29 | Monster Girl Maker | avatar_identity | visible_price_context_uncertain | $9 | output/paywall_screenshots/29-monster-girl-maker-medium.png |

## Claim Limits

- Confirmed visible public pricing means the public screenshot/OCR supports a pricing-surface claim for that URL.
- Partial paid-surface language means the page hints at paid plans/subscription/commerce but does not show enough price/terms to be final.
- Weakened/rejected means the earlier crawler signal should not be used as paywall proof without a better URL.
- Human sign-off and in-app paywall inspection remain required for final investor/user-facing claims.

## Files

- `data_processed/web_paywall_visual_adjudication.csv`
- `data_processed/web_paywall_visual_adjudication_summary.csv`
