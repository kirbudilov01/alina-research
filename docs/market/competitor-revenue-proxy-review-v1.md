# Competitor Revenue Proxy Review V1

Generated: 2026-05-31T05:15:08.167Z

## Purpose

This layer adds bottom-up monetization triangulation without broad search-engine crawling. It combines already collected App Store IAP rows, top-100 competitor scorecards, Google Play pricing/install metadata, review depth, and public web-paywall signals.

It does not estimate actual competitor revenue. It ranks public paid-surface evidence so the TAM/SAM/SOM model has a stronger sanity check and so manual validation can focus on the highest-money competitors.

## Summary

- Competitors reviewed: 90
- Strong bottom-up money proxies: 22
- Medium-or-stronger money proxies: 70
- Competitors with observed App Store IAP: 80
- Google Play pricing rows used as market context: 247

Revenue proxy bands:

- medium_bottom_up_money_proxy: 48
- strong_bottom_up_money_proxy: 22
- weak_to_medium_money_proxy: 12
- weak_public_money_proxy: 8

## Market Summary

| Market | Reviewed | Strong | Medium+ | IAP Apps | Max Price | Read |
| --- | ---: | ---: | ---: | ---: | ---: | --- |
| astrology_esoterics | 44 | 8 | 35 | 39 | 549.99 | bottom_up_paid_behavior_visible |
| avatar_identity | 22 | 7 | 16 | 18 | 509 | bottom_up_paid_behavior_visible |
| coaching_self_improvement | 14 | 5 | 11 | 13 | 119.99 | bottom_up_paid_behavior_visible |
| mindfulness | 5 | 2 | 4 | 5 | 174.99 | bottom_up_paid_behavior_directional |
| gaming_progression | 5 | 0 | 4 | 5 | 129.99 | bottom_up_paid_behavior_directional |

## Highest-Signal Competitors

| App | Market | Verdict | Reviews | IAP | Max Price | Score | Band |
| --- | --- | --- | ---: | ---: | ---: | ---: | --- |
| Shepherd: Spiritual Bible BFF | astrology_esoterics | direct_reference_competitor | 8248 | 6 | 59.99 | 90 | strong_bottom_up_money_proxy |
| Mindvalley: Self Improvement | astrology_esoterics | high_priority_close_substitute | 6863 | 8 | 399.00 | 86 | strong_bottom_up_money_proxy |
| Yoga International | avatar_identity | high_priority_close_substitute | 5989 | 2 | 169.00 | 86 | strong_bottom_up_money_proxy |
| Daily Burn: Workout Coach | avatar_identity | high_priority_close_substitute | 14226 | 8 | 149.99 | 84 | strong_bottom_up_money_proxy |
| stoic. journal & mental health | astrology_esoterics | high_priority_close_substitute | 34617 | 8 | 99.99 | 84 | strong_bottom_up_money_proxy |
| Day One: Daily Journal & Diary | coaching_self_improvement | high_priority_close_substitute | 116607 | 6 | 74.99 | 80 | strong_bottom_up_money_proxy |
| Law of Attraction Toolbox | astrology_esoterics | high_priority_close_substitute | 2935 | 6 | 99.99 | 78 | strong_bottom_up_money_proxy |
| 5 Minute Journal・Daily Diary | astrology_esoterics | monetization_risk_benchmark | 17397 | 8 | 39.99 | 78 | strong_bottom_up_money_proxy |
| ZOE Health: AI Meal Tracker | avatar_identity | high_priority_close_substitute | 6577 | 2 | 99.99 | 78 | strong_bottom_up_money_proxy |
| Motivate: Daily Motivation | avatar_identity | high_priority_close_substitute | 8307 | 4 | 399.99 | 78 | strong_bottom_up_money_proxy |
| Daily Yoga: Yoga for Fitness® | avatar_identity | high_priority_close_substitute | 4320 | 10 | 69.99 | 78 | strong_bottom_up_money_proxy |
| Pregnancy Tracker 3D by Sprout | coaching_self_improvement | monetization_risk_benchmark | 23429 | 10 | 59.99 | 76 | strong_bottom_up_money_proxy |
| Kindara: Fertility Tracker | coaching_self_improvement | adjacent_benchmark | 10147 | 3 | 49.99 | 76 | strong_bottom_up_money_proxy |
| Daily Habit List: Goal Tracker | coaching_self_improvement | high_priority_close_substitute | 344 | 10 | 49.99 | 76 | strong_bottom_up_money_proxy |
| Flow Lab: Growth Mindset Coach | astrology_esoterics | high_priority_close_substitute | 894 | 9 | 69.99 | 76 | strong_bottom_up_money_proxy |
| Zing AI: Home & Gym Workouts | avatar_identity | high_priority_close_substitute | 30671 | 6 | 59.99 | 76 | strong_bottom_up_money_proxy |
| Harem AI - Chat & Talk & Crush | avatar_identity | high_priority_close_substitute | 129 | 10 | 99.99 | 74 | strong_bottom_up_money_proxy |
| OtterLife: AI Health Tracker | mindfulness | high_priority_close_substitute | 1108 | 24 | 74.99 | 74 | strong_bottom_up_money_proxy |
| EVOLVE: Transform Your Life | astrology_esoterics | high_priority_close_substitute | 1006 | 9 | 99.99 | 74 | strong_bottom_up_money_proxy |
| Miracle Morning Routine | astrology_esoterics | high_priority_close_substitute | 4982 | 8 | 99.99 | 74 | strong_bottom_up_money_proxy |
| Sol - Inner Life & Wellbeing | coaching_self_improvement | high_priority_close_substitute | 1234 | 4 | 119.99 | 74 | strong_bottom_up_money_proxy |
| Habit Tracker | mindfulness | high_priority_close_substitute | 141431 | 6 | 12.99 | 70 | strong_bottom_up_money_proxy |
| Pitstop: Scale Human Potential | gaming_progression | high_priority_close_substitute | 14 | 4 | 99.99 | 68 | medium_bottom_up_money_proxy |
| Soulful Navigation | avatar_identity | close_substitute | 5 | 4 | 99.99 | 68 | medium_bottom_up_money_proxy |
| LifeWheel Goal Habit Tracker | coaching_self_improvement | high_priority_close_substitute | 512 | 9 | 79.99 | 68 | medium_bottom_up_money_proxy |

## Interpretation Rules

- Strong proxy: visible IAP/pricing ladder, subscription-like or high-price signal, meaningful review depth, and adjacency to the Alina product loop.
- Medium proxy: paid surface is visible but review scale, web confirmation, or product adjacency is weaker.
- Weak proxy: useful for competitor context but not enough for market-money claims.
- Revenue claim limit: these rows prove public monetization surfaces and demand-depth proxies, not actual revenue.

## Files

- `data_processed/competitor_revenue_proxy_review.csv`
- `data_processed/competitor_revenue_proxy_market_summary.csv`
