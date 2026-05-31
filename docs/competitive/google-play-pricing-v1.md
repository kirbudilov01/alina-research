# Google Play Pricing V1

Generated: 2026-05-31T02:53:46.604Z

## Scope

Collected Google Play metadata for up to 50 Android apps per market pillar from existing top300 multi-source files. This validates Android-side pricing signals: free/paid download, IAP availability, ads, Play Pass, developer website, and install/review scale.

## Coverage

- Requested package rows: 250
- Successful lookups: 247
- Failed lookups: 3
- Apps offering IAP: 191
- Ad-supported apps: 85
- Paid download apps: 3

## Summary by Market

| Market | Requested | OK | Free | Paid | IAP | Ads | Play Pass | Dev Website |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| gaming | 50 | 48 | 48 | 0 | 48 | 31 | 0 | 46 |
| astrology_esoterics | 50 | 50 | 48 | 2 | 43 | 15 | 0 | 49 |
| avatar_identity | 50 | 50 | 49 | 1 | 36 | 32 | 0 | 48 |
| coaching | 50 | 49 | 49 | 0 | 24 | 1 | 0 | 42 |
| mindfulness | 50 | 50 | 50 | 0 | 40 | 6 | 2 | 45 |

## Pricing Models

- free_download|offers_iap: 114
- free_download|offers_iap|ad_supported: 72
- free_download: 45
- free_download|ad_supported: 11
- paid_download|offers_iap: 3
- free_download|offers_iap|ad_supported|play_pass: 2

## Interpretation

- Android-side metadata confirms that free download plus IAP is common across the adjacent markets.
- Ads are a meaningful monetization layer in games/avatar apps but less central for premium coaching/mindfulness positioning.
- Developer websites are available for many Android apps and can support a later web/paywall screenshot pass.
- Google Play exposes IAP availability but not detailed IAP price ladders as cleanly as App Store web pages; treat this as validation, not full price extraction.

## Files

- `data_raw/google_play_pricing_raw.csv`
- `data_processed/google_play_pricing_summary.csv`
