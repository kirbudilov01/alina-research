# Monetization Proxy Matrix V1

Generated: 2026-05-31T04:21:02.115Z

## Purpose

This matrix strengthens H2 using observed monetization proxies from existing competitor evidence: App Store IAP metadata, Google Play pricing/IAP metadata, and public web paywall screenshots. It does not estimate competitor revenue; it proves that paid behavior and monetization surfaces exist across adjacent markets.

## Market Summary

| Market | Proxy Band | App Store IAP Apps | Subscription-like Apps | Google Play IAP Apps | Web Medium/High Domains | Confirmed Web Pricing | Max Observed Price | Interpretation |
| --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | --- |
| coaching | strong_paid_behavior_proxy | 10 | 9 | 24 | 1 | 0 | 129.99 | Paid behavior exists in coaching/habit/self-improvement apps, but consumer daily ritual overlap needs manual validation. |
| mindfulness | strong_paid_behavior_proxy | 8 | 5 | 40 | 6 | 1 | 169 | Subscription willingness exists in reset/wellness apps; calm UX and paywall timing remain validation risks. |
| avatar_identity | strong_paid_behavior_proxy | 22 | 19 | 36 | 7 | 1 | 509 | Paid behavior exists across avatar/companion/identity tools, but recurring identity value must be separated from novelty generation. |
| astrology_esoterics | strong_paid_behavior_proxy | 39 | 32 | 43 | 3 | 0 | 549.99 | Strong subscription/IAP proxy for spiritual and manifestation categories; paywall screenshots still need human review. |
| gaming | medium_paid_behavior_proxy | 1 | 1 | 48 | 12 | 0 | 1.99 | Very strong IAP monetization proxy, but use as retention/payment benchmark rather than direct Alina spend. |

## Strongest Price Examples

| Market | Examples |
| --- | --- |
| coaching | Habit Tracker - Statz max $129.99<br>Pitstop: Scale Human Potential max $99.99<br>Pitstop: Scale Human Potential max $99.99<br>LifeWheel Goal Habit Tracker max $79.99<br>Day One: Daily Journal & Diary max $74.99 |
| mindfulness | Yoga International max $169.00<br>Haute Hypnosis - Mind Manifest max $99.00<br>Mind Power: Guided Meditations max $69.99<br>Unplug: Meditation max $69.99<br>Daily Yoga: Yoga for Fitness® max $69.99 |
| avatar_identity | Ask Nithyananda AI max $509.00<br>Motivate: Daily Motivation max $399.99<br>Mia Adora max $334.99<br>Eylo: AI Weight Loss Coach max $179.99<br>MindFi: Mind Fitness for All max $174.99 |
| astrology_esoterics | Awaken: AI Coach & Inner Guide max $549.99<br>Mindvalley: Self Improvement max $399.00<br>Magnetic - Manifestation App max $132.99<br>Sol - Inner Life & Wellbeing max $119.99<br>Rosebud: AI Journal & Diary max $107.99 |
| gaming | Cozy Mahjong max $1.99 |

## Interpretation

- Paid behavior is visible in every target market through IAP or Google Play pricing metadata.
- App Store IAP metadata is the strongest monetization proxy layer because it is app-specific and price-bearing.
- Google Play reinforces free-download plus IAP behavior across all five markets, but it is broader and includes high-noise gaming benchmarks.
- Web paywall screenshots are valuable but conservative: most require human interpretation, and only confirmed screenshots should be used as public-pricing proof.
- This layer supports market existence, not Alina-specific willingness to pay; that still needs prototype and user validation.

## Files

- `data_processed/market_monetization_proxy_matrix.csv`
- `data_processed/monetization_proxy_examples.csv`
