# App Store IAP Pricing V1

Generated: 2026-05-31T02:41:22.333Z

## Scope

Collected publicly visible In-App Purchase name/price pairs from App Store web pages for 100 top intersection candidates. This is observed web-page pricing, not guaranteed complete backend IAP catalog data.

## Coverage

- Apps requested: 100
- Apps with observed IAP rows: 89
- Raw IAP rows: 498
- Lowest observed price: $0.00
- Highest observed price: $549.99

## Price Bands

- 15_to_49_99: 191
- 5_to_14_99: 132
- 50_to_99_99: 81
- under_5: 74
- 100_plus: 20

## Product Tag Counts

- subscription_like: 287
- unclear_iap: 161
- consumable_or_unlock: 34
- lifetime_like: 27
- trial_like: 10

## Highest IAP Ceilings

| App | IAP Count | Min | Max | Sample Products |
| --- | ---: | ---: | ---: | --- |
| Awaken: AI Coach & Inner Guide | 9 | 4.99 | 549.99 | Essence Medium $24.99; Awaken Beyond $28.99; Essence XS $4.99; Awaken Boundless $57.99; Essence Large $49.99; Essence Small $9.99 |
| Ask Nithyananda AI | 3 | 54.00 | 509.00 | Bronze $54.00; Gold $509.00; Silver $107.99 |
| Motivate: Daily Motivation | 4 | 11.99 | 399.99 | Motivate Pro - Monthly $11.99; Motivate Pro - Annual $95.99; Motivate Pro - Annual $47.99; Motivate Pro - Lifetime $399.99 |
| Mindvalley: Self Improvement | 8 | 19.99 | 399.00 | Mindvalley Membership $49.99; Mindvalley Membership $99.99; Mindvalley Membership $49.00; Mindvalley Mentoring Yearly $99.99; Mindvalley Membership $19.99; Mindvalley Membership $59.99 |
| Mia Adora | 10 | 1.00 | 334.99 | Time To Start $1.00; GET SNATCHED $40.00; The Ultimate Mind & Body $334.99; Hot Mama $55.00; Cortisol Detox $55.00; Karen's Plan $1.00 |
| Eylo: AI Weight Loss Coach | 5 | 4.99 | 179.99 | Champion Plan $17.99; Achiever Plan $9.99; Starter Plan $4.99; Champion Yearly $179.99; Achiever Yearly $89.99 |
| MindFi: Mind Fitness for All | 3 | 5.99 | 174.99 | Monthly Subscription $5.99; Annual Subscription $44.99; Lifetime $174.99 |
| Yoga International | 2 | 19.99 | 169.00 | Monthly Membership $19.99; Annual Membership $169.00 |
| Daily Burn: Workout Coach | 8 | 9.99 | 149.99 | Daily Burn Basic $12.99; Daily Burn Basic $14.99; At Home Workouts Premium $19.99; Daily Burn Premium $19.99; Monthly Basic $14.99; DailyBurn All Access $9.99 |
| Magnetic - Manifestation App | 10 | 1.99 | 132.99 | Premium+ $18.99; A Song (Premium) $4.99; Become His Only Option $5.99; Magnetic Premium $9.99; Premium+ Annual $132.99; Premium Annual $69.99 |
| Habit Tracker - Statz | 3 | 5.99 | 129.99 | All Access $5.99; All Access $49.99; Lifetime ($129.99) $129.99 |
| HootieLife: AI Wellness Coach | 4 | 12.99 | 119.99 | Premium Monthly $12.99; Premium Yearly $119.99; Premium Monthly $12.99; Premium Yearly $119.99 |
| Growth Spiral / Self evolution | 7 | 10.00 | 119.99 | Growth mindset $30.00; Pilot Plan $15.00; Annual Yoga $119.99; SOUL SPARK REVIVAL $49.00; Meditation $10.00; Payment Plan $20.00 |
| HootieLife: AI Wellness Coach | 4 | 12.99 | 119.99 | Premium Monthly $12.99; Premium Yearly $119.99; Premium Monthly $12.99; Premium Yearly $119.99 |
| Sol - Inner Life & Wellbeing | 4 | 1.99 | 119.99 | Monthly subscription $7.99; Weekly subscription $1.99; Yearly subscription $51.99; Lifetime $119.99 |
| Rosebud: AI Journal & Diary | 4 | 11.00 | 107.99 | Rosebud Bloom $12.99; Rosebud Bloom $107.99; Rosebud Bloom Affiliate $11.00; Rosebud Bloom Affiliate $92.00 |
| Pitstop: Scale Human Potential | 4 | 14.99 | 99.99 | AI Coaching - Yearly $99.99; AI Coaching - Monthly $14.99; AI Coaching - Yearly $99.99; AI Coaching - Monthly $14.99 |
| Pitstop: Scale Human Potential | 4 | 14.99 | 99.99 | AI Coaching - Yearly $99.99; AI Coaching - Monthly $14.99; AI Coaching - Yearly $99.99; AI Coaching - Monthly $14.99 |
| Muna: Astrology & Horoscope | 10 | 0.99 | 99.99 | AI Astrology $4.99; AI Astrology $6.99; Credit pack welcome $0.99; AI Astrology $13.99; Your Magic 2025 $11.99; AI Astrology $0.99 |
| yap: astrology & dream journal | 8 | 1.99 | 99.99 | Weekly Special Promo $8.00; Weekly Subscription $3.99; Monthly Special Promo $28.00; Yearly Holiday Sale $69.99; Monthly Subscription $14.99; Weekly Holiday Sale $1.99 |

## Interpretation

- Public App Store pages expose enough IAP information to benchmark price ladders for many top candidates.
- The observed set mixes subscription-like products, unlocks, credits/gems, trials, and ambiguous premium products.
- Alina should avoid forcing payment before the daily loop demonstrates value; paid depth can be benchmarked against observed subscription and unlock ladders.

## Files

- `data_raw/app_store_iap_pricing_raw.csv`
- `data_processed/app_store_iap_pricing_summary.csv`
