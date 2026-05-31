# Market Sizing Pass 1

Date: 2026-05-31

## Status

This is an initial anchor pass, not the final TAM/SAM/SOM answer.

The goal is to establish first credible ranges and identify where the evidence is strong, weak, or too broad for direct use.

## Key Principle

Alina's market cannot be estimated by adding five category TAMs together.

The correct approach is:

1. Use category markets as ceilings and benchmark pools.
2. Discount each category to consumer mobile/web subscription behavior.
3. Estimate intersection SAM separately.
4. Use bottom-up paid-user scenarios for SOM.

## First Anchors

| Pillar | First broad anchor | Directness for Alina | Confidence | Notes |
|---|---:|---|---|---|
| Gaming | Mobile gaming is a very large market; BCG shows mobile game IAP around USD 113B in 2025 and USD 166B in 2030 in its market breakdown | Low directness, high benchmark value | High | Useful for retention, monetization, and platform strategy, not direct spend intent. |
| Astrology / Esoterics | Public report pages show rapid astrology-app growth, but definitions vary and many pages are SEO-heavy | Medium | Low/Medium | Needs at least 5 triangulated sources and app revenue proxies. |
| Avatar / Identity | Global Market Insights states AI avatars market at USD 8.4B in 2026 and USD 93.4B by 2035 | Medium/Low | Medium | Broad enterprise + consumer market. Consumer identity/self-improvement subsegment must be discounted. |
| Coaching | ICF describes online/virtual coaching as dominant and AI as transforming delivery | Medium | High for trend, low for size | Need direct coaching-app and AI-coaching revenue sources. |
| Mindfulness | Stratistics MRC states meditation/mindfulness apps market at USD 1.68B in 2026 and USD 4.62B by 2034 | High | Medium | Strong direct anchor for the mindfulness pillar. |

## Early SAM Logic

The strongest direct spend pools for Alina are likely:

1. Astrology/spiritual guidance subscriptions.
2. Mindfulness/mental wellness subscriptions.
3. AI coaching/self-improvement subscriptions.
4. AI companion/avatar identity spend.

Gaming should be treated as a mechanic and retention benchmark first, not the core direct TAM.

## Draft Scenario Model

### Conservative SOM

```text
reachable_users = 100,000
activation_rate = 35%
paid_conversion = 3%
ARPPU_year = 60 USD
annual_revenue = 63,000 USD
```

### Base SOM

```text
reachable_users = 1,000,000
activation_rate = 40%
paid_conversion = 5%
ARPPU_year = 80 USD
annual_revenue = 1,600,000 USD
```

### Upside SOM

```text
reachable_users = 5,000,000
activation_rate = 45%
paid_conversion = 8%
ARPPU_year = 100 USD
annual_revenue = 18,000,000 USD
```

These are not final forecasts. They are placeholders for sensitivity analysis until competitor ARPPU, CAC, conversion, and retention benchmarks are extracted.

## Evidence Gaps

1. Astrology app revenue and paid conversion benchmarks.
2. AI coaching consumer subscription revenue.
3. Avatar app split between enterprise video/avatar tools and consumer identity tools.
4. App-level revenue estimates for top 50 competitors.
5. Country-level launch assumptions.
6. CAC benchmarks for spirituality/wellness/self-improvement apps.
7. Retention benchmarks for daily-use wellness and astrology products.

## Next Step

Build `data_processed/market_claims.csv` with one row per extracted claim and use it to produce low/base/high TAM, SAM, and SOM tables.

