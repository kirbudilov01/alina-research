# Paid Flow Local Signoff V1

Generated: 2026-05-31T14:26:08.669Z

## Purpose

This artifact records local visual review for the first paid-flow spike. It uses already captured screenshots rather than new broad search. The goal is to move H2 from zero observed rows to partial observed evidence while keeping the claim boundary conservative.

## Signoff Rows

| Capture | App | Strength | Observed | Product Match | Claim Limit |
| --- | --- | --- | --- | --- | --- |
| PF_01_PF_S01 | Character AI: Chat, Talk, Text | confirmed_public_web | $9.99/month; $94.99/year; annual page also shows $119.88 struck-through reference price | confirmed_same_product_public_pricing | Supports adjacent paid-behavior / paid-depth proxy for AI companion/avatar-identity market; does not prove Alina WTP or in-app conversion. |
| PF_01_PF_S02 | Character AI: Chat, Talk, Text | partial_boundary_unknown | Public subscribe page is visible independently; first meaningful in-app value boundary was not inspected. | confirmed_same_product_public_pricing | Use as public paid-surface evidence only, not as first-value/paywall-timing proof. |
| PF_01_PF_S03 | Character AI: Chat, Talk, Text | confirmed_public_web | Paid tier unlocks: better memory, ad-free chats, bonus Charms, latest/best models, no slow mode, unlimited voice calls, more muted words/voice memos/go-ons/swipes, customization. | confirmed_same_product_public_pricing | Useful for paid-depth analogs around memory, personalization, voice, and premium model access. |
| PF_01_PF_S04 | Character AI: Chat, Talk, Text | confirmed_public_web | Same public page brands the paid tier as c.ai+ and includes Character AI site footer links. | confirmed_same_product_public_pricing | Product-match support for public pricing row; still not a substitute for in-app subscription confirmation. |
| PF_02_PF_S01 | Meditopia: Sleep & Meditation | partial_b2b_price | $3.50 per user per month (PUPM) average price shown for Essential Care on Meditopia business pricing page. | partial_same_brand_b2b_not_consumer_app | Supports enterprise wellness monetization proxy only; do not use as direct consumer app WTP proof. |
| PF_02_PF_S02 | Meditopia: Sleep & Meditation | partial_boundary_unknown | Business pricing page with Calculate Pricing / Book a Demo CTAs; consumer first meaningful paywall boundary not inspected. | partial_same_brand_b2b_not_consumer_app | Use only as B2B paid-surface evidence; keep consumer paywall boundary open. |
| PF_02_PF_S03 | Meditopia: Sleep & Meditation | partial_b2b_feature_depth | Essential Care includes personalized wellbeing library with AI support, 10,000+ resources, web/mobile/smartwatch access; Total Care adds 1:1 expert sessions, integrations, social features. | partial_same_brand_b2b_not_consumer_app | Use as wellness/EAP paid-depth benchmark; do not treat as direct Alina consumer subscription analog. |
| PF_02_PF_S04 | Meditopia: Sleep & Meditation | partial_b2b_product_match | Same Meditopia brand, business navigation, and EAP pricing page; product family matches, consumer app plan does not. | partial_same_brand_b2b_not_consumer_app | Use as same-brand enterprise monetization context; keep consumer product-match and WTP open. |

## Decision Read

- Character AI/c.ai+ is confirmed as a product-matched public web subscription page with visible monthly and annual pricing.
- Meditopia is confirmed only as a Meditopia-branded B2B/EAP paid surface; it should not be upgraded into direct consumer subscription proof.
- H2 should move to in-progress/partial observed evidence after the gate calculator rebuild, not to pass-ready: the gate requires more completed paid-flow rows and WTP/prototype evidence.

## Files

- `data_processed/paid_flow_local_signoff.csv`
- `data_processed/paid_flow_capture_sheet.csv`
- `data_processed/web_paywall_visual_adjudication.csv`
