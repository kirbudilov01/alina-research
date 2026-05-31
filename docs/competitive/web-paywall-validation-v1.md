# Web Paywall Validation V1

Generated: 2026-05-31T03:24:18.046Z

## Scope

This pass fetched developer websites from Google Play metadata for 70 unique domains, prioritizing apps with IAP and high install counts. It checks home/pricing/plan/premium/subscribe/upgrade URLs for public pricing, trial, subscription, checkout, and paywall language.

This is **not** final screenshot validation. It is a reproducible discovery layer that says where manual screenshots and trial-term verification should happen next.

## Coverage

- Fetched URL rows: 560
- Successful pages: 188
- Aggregated app/domain rows: 70
- Domains needing screenshot validation: 29

Signal strength counts:

- low: 41
- medium: 24
- high: 5

Markets covered:

- gaming: 38
- avatar_identity: 16
- mindfulness: 9
- astrology_esoterics: 6
- coaching: 1

## Highest Priority Screenshot Queue

| App | Market | Signal | Best URL | Tags | Price Points |
| --- | --- | --- | --- | --- | --- |
| Lords Mobile: Kingdom Wars | gaming | medium | https://www.igg.com/ | no_pricing_signal:6<br>paywall_language:2 |  |
| Clash of Clans | gaming | medium | https://support.supercell.com/en/index.html | pricing_page:6<br>no_pricing_signal:2 |  |
| Carrom Pool: Disc Game | gaming | medium | https://www.miniclip.com/pricing | pricing_page:6<br>no_pricing_signal:2 |  |
| Pokémon GO | gaming | medium | https://pokemongo.com/ | no_pricing_signal:6<br>pricing_page:2<br>app_store_redirect:2 |  |
| Tennis Clash: Multiplayer Game | gaming | medium | https://wildlifestudios.com/ | no_pricing_signal:6<br>pricing_page:2<br>subscription_terms:2 |  |
| Mob Control | gaming | medium | https://voodoo.io/ | no_pricing_signal:6<br>price_points_detected:2 | $670 |
| The Sims™ FreePlay | gaming | high | https://www.ea.com/ea-play | no_pricing_signal:5<br>pricing_page:3<br>subscription_terms:3<br>paywall_language:2<br>checkout_language:1<br>price_points_detected:1 | $5.99<br>$39.99<br>$16.99<br>$119.99 |
| Modern Strike Online: War FPS | gaming | medium | https://azurgames.com/ | no_pricing_signal:6<br>subscription_terms:2<br>app_store_redirect:2 |  |
| Avatar World ® | avatar_identity | medium | https://pazugames.com/ | no_pricing_signal:6<br>pricing_page:2<br>subscription_terms:2<br>paywall_language:2<br>checkout_language:2 |  |
| Call of Duty®: Mobile - Garena | gaming | medium | https://codm.garena.tw/ | no_pricing_signal:6<br>price_points_detected:2 | $5,00 |
| AstroSage Kundli: AI Astrology | astrology_esoterics | medium | https://www.astrosage.com/ | no_pricing_signal:6<br>subscription_terms:2 |  |
| Character AI: Chat, Talk, Text | avatar_identity | high | https://character.ai/subscribe | no_pricing_signal:7<br>pricing_page:1<br>subscription_terms:1<br>paywall_language:1<br>price_points_detected:1 | $9.99<br>$94.99<br>$119.88 |
| Calm - Sleep, Meditate, Relax | mindfulness | medium | https://www.calm.com/ | pricing_page:4<br>no_pricing_signal:4<br>subscription_terms:2<br>trial_terms:2<br>app_store_redirect:2<br>paywall_language:1 |  |
| NBA 2K Mobile Basketball Game | gaming | medium | https://www.nba2kmobile.com/ | no_pricing_signal:6<br>pricing_page:2<br>paywall_language:2<br>checkout_language:2 |  |
| Rainbow Six Mobile | gaming | medium | https://ubisoft-mobile.helpshift.com/hc/en/45-rainbow-six-mobile/ | pricing_page:5<br>no_pricing_signal:2<br>paywall_language:1 |  |
| WWE Mayhem | gaming | medium | https://www.reliancegames.com/ | no_pricing_signal:6<br>paywall_language:2<br>app_store_redirect:2 |  |
| Mirror: Emoji maker, Stickers | avatar_identity | medium | https://www.mirror-ai.com/business | no_pricing_signal:5<br>pricing_page:3<br>paywall_language:2<br>app_store_redirect:2<br>price_points_detected:1 | $0<br>$0.01<br>$399<br>$0.05<br>$999 |
| Everskies: Virtual Dress up | avatar_identity | medium | https://everskies.com/pricing | pricing_page:6<br>no_pricing_signal:2 |  |
| PRISM Live Studio: Games & IRL | avatar_identity | medium | https://prismlive.com/en_us/ | no_pricing_signal:6<br>pricing_page:2<br>subscription_terms:2 |  |
| BetterMe: Health Coaching | coaching | medium | https://betterme.world/pricing | pricing_page:6<br>no_pricing_signal:2 |  |
| Insight Timer - Meditation App | mindfulness | medium | https://insighttimer.com/pricing | pricing_page:6<br>no_pricing_signal:2 |  |
| Headspace: Sleep & Meditate | mindfulness | high | https://www.headspace.com/ | no_pricing_signal:5<br>pricing_page:3<br>subscription_terms:3<br>price_points_detected:2<br>trial_terms:1<br>app_store_redirect:1 | $0 |
| Mindfulness with Petit BamBou | mindfulness | medium | https://www.petitbambou.com/en | pricing_page:5<br>subscription_terms:5<br>checkout_language:4<br>no_pricing_signal:3<br>paywall_language:2 |  |
| Meditopia: Sleep & Meditation | mindfulness | high | https://meditopia.com/en/plans | no_pricing_signal:7<br>pricing_page:1<br>subscription_terms:1<br>checkout_language:1<br>price_points_detected:1 | $3.50 |
| Hallow: Prayer & Meditation | mindfulness | medium | https://hallow.com/login/?redirect=%2Fsubscribe%2F | no_pricing_signal:7<br>pricing_page:1 |  |

## Interpretation

- Web pricing pages are noisy: many developer links go to support, corporate, or app landing pages rather than a clean checkout.
- Strong public web paywall signals are useful for monetization packaging evidence, but absence of a signal does not mean the app has no paywall because many mobile apps gate pricing inside the native app.
- Best next step: capture screenshots for high/medium rows, verify trial length, monthly/annual pricing, free-tier behavior, and whether the first meaningful action is paywalled.

## Files

- `data_raw/web_paywall_discovery_raw.csv`
- `data_processed/web_paywall_signal_matrix.csv`
