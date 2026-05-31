# Web Paywall Screenshot Interpretation V1

Generated: 2026-05-31T03:36:58.461Z

## Scope

This layer OCRs the captured paywall screenshots and applies conservative heuristics to separate visible pricing evidence from weak, ambiguous, login-gated, or not-found pages.

This is still not final human validation. OCR can miss text and cannot fully judge whether a page belongs to the same mobile app, but it is a stronger triage layer than HTML keywords alone.

## Coverage

- Screenshots interpreted: 29
- OCR success rows: 29

Interpretation verdict counts:

- weak_or_unconfirmed: 17
- partially_confirms_paywall_language: 5
- weakens_signal_not_found: 3
- confirms_public_pricing_signal: 2
- needs_manual_review_high_signal_no_visible_price: 2

OCR tag counts:

- no_ocr_paywall_terms: 12
- visible_subscription: 7
- visible_login_gate: 7
- visible_price: 5
- visible_not_found: 3
- visible_checkout: 2

## Priority Review Table

| Rank | App | Signal | Verdict | OCR Prices | Screenshot |
| ---: | --- | --- | --- | --- | --- |
| 1 | The Sims™ FreePlay | high | weakens_signal_not_found |  | `output/paywall_screenshots/01-the-sims-freeplay-high.png` |
| 2 | Character AI: Chat, Talk, Text | high | confirms_public_pricing_signal | $9.99<br>$94.99 | `output/paywall_screenshots/02-character-ai-chat-talk-text-high.png` |
| 3 | Headspace: Sleep & Meditate | high | needs_manual_review_high_signal_no_visible_price |  | `output/paywall_screenshots/03-headspace-sleep-meditate-high.png` |
| 4 | Meditopia: Sleep & Meditation | high | confirms_public_pricing_signal | $3.50 | `output/paywall_screenshots/04-meditopia-sleep-meditation-high.png` |
| 5 | Nebula: Spiritual Guidance | high | needs_manual_review_high_signal_no_visible_price |  | `output/paywall_screenshots/05-nebula-spiritual-guidance-high.png` |
| 6 | Lords Mobile: Kingdom Wars | medium | weak_or_unconfirmed |  | `output/paywall_screenshots/06-lords-mobile-kingdom-wars-medium.png` |
| 7 | Clash of Clans | medium | weak_or_unconfirmed |  | `output/paywall_screenshots/07-clash-of-clans-medium.png` |
| 8 | Carrom Pool: Disc Game | medium | partially_confirms_paywall_language |  | `output/paywall_screenshots/08-carrom-pool-disc-game-medium.png` |
| 9 | Pokémon GO | medium | weak_or_unconfirmed |  | `output/paywall_screenshots/09-pok-mon-go-medium.png` |
| 10 | Tennis Clash: Multiplayer Game | medium | weak_or_unconfirmed |  | `output/paywall_screenshots/10-tennis-clash-multiplayer-game-medium.png` |
| 11 | Mob Control | medium | weak_or_unconfirmed |  | `output/paywall_screenshots/11-mob-control-medium.png` |
| 12 | Modern Strike Online: War FPS | medium | weak_or_unconfirmed |  | `output/paywall_screenshots/12-modern-strike-online-war-fps-medium.png` |
| 13 | Avatar World ® | medium | partially_confirms_paywall_language |  | `output/paywall_screenshots/13-avatar-world-medium.png` |
| 14 | Call of Duty®: Mobile - Garena | medium | weak_or_unconfirmed |  | `output/paywall_screenshots/14-call-of-duty-mobile-garena-medium.png` |
| 15 | AstroSage Kundli: AI Astrology | medium | partially_confirms_paywall_language |  | `output/paywall_screenshots/15-astrosage-kundli-ai-astrology-medium.png` |
| 16 | Calm - Sleep, Meditate, Relax | medium | weak_or_unconfirmed |  | `output/paywall_screenshots/16-calm-sleep-meditate-relax-medium.png` |
| 17 | NBA 2K Mobile Basketball Game | medium | weak_or_unconfirmed | $20 | `output/paywall_screenshots/17-nba-2k-mobile-basketball-game-medium.png` |
| 18 | Rainbow Six Mobile | medium | weak_or_unconfirmed |  | `output/paywall_screenshots/18-rainbow-six-mobile-medium.png` |
| 19 | WWE Mayhem | medium | weak_or_unconfirmed |  | `output/paywall_screenshots/19-wwe-mayhem-medium.png` |
| 20 | Mirror: Emoji maker, Stickers | medium | weak_or_unconfirmed |  | `output/paywall_screenshots/20-mirror-emoji-maker-stickers-medium.png` |
| 21 | Everskies: Virtual Dress up | medium | partially_confirms_paywall_language |  | `output/paywall_screenshots/21-everskies-virtual-dress-up-medium.png` |
| 22 | PRISM Live Studio: Games & IRL | medium | weak_or_unconfirmed |  | `output/paywall_screenshots/22-prism-live-studio-games-irl-medium.png` |
| 23 | BetterMe: Health Coaching | medium | weakens_signal_not_found |  | `output/paywall_screenshots/23-betterme-health-coaching-medium.png` |
| 24 | Insight Timer - Meditation App | medium | weak_or_unconfirmed |  | `output/paywall_screenshots/24-insight-timer-meditation-app-medium.png` |
| 25 | Mindfulness with Petit BamBou | medium | partially_confirms_paywall_language |  | `output/paywall_screenshots/25-mindfulness-with-petit-bambou-medium.png` |
| 26 | Hallow: Prayer & Meditation | medium | weak_or_unconfirmed |  | `output/paywall_screenshots/26-hallow-prayer-meditation-medium.png` |
| 27 | Co–Star Personalized Astrology | medium | weakens_signal_not_found |  | `output/paywall_screenshots/27-co-star-personalized-astrology-medium.png` |
| 28 | Monster Girl Maker 2 | medium | weak_or_unconfirmed | $9 | `output/paywall_screenshots/28-monster-girl-maker-2-medium.png` |
| 29 | Monster Girl Maker | medium | weak_or_unconfirmed | $9 | `output/paywall_screenshots/29-monster-girl-maker-medium.png` |

## Interpretation

- Treat `confirms_public_pricing_signal` as the strongest evidence for visible public pricing.
- Treat `partially_confirms_paywall_language` as evidence of packaging/paywall language, but still verify exact product and terms.
- Treat `weakens_signal_not_found` as a reason to downgrade the web-paywall claim for that row unless another URL confirms pricing.
- Keep all rows as `needs_human_review` until screenshots are inspected by a person.

## Files

- `data_processed/web_paywall_screenshot_interpretation.csv`
