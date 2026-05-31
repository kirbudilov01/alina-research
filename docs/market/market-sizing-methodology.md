# Market Sizing Methodology

Date: 2026-05-31

## Goal

Build a defensible market-size view for Alina without pretending that one exact number is available.

The output should be range-based:

- Low estimate
- Base estimate
- High estimate

Every number must preserve:

- source URL
- source type
- source year
- market definition
- geography
- confidence
- inclusion/exclusion notes

## Markets

Alina touches five primary markets:

1. Mobile and casual gaming.
2. Astrology, esoterics, and spiritual guidance apps.
3. Avatar, AI avatar, and digital identity tools.
4. Coaching, AI coaching, and self-improvement apps.
5. Mindfulness, meditation, and mental wellness apps.

It also touches intersection markets:

1. AI spiritual coach.
2. Gamified mindfulness.
3. Avatar-based self-improvement.
4. AI companion for daily guidance.
5. Personalized wellness subscription.

## Definitions

### TAM

Total annual spend in the broad category that could theoretically include Alina-like use cases.

Example:

- Mobile games revenue is broad TAM for game-like retention, not direct TAM for Alina.
- Meditation app revenue is closer to direct TAM for mindfulness features.
- AI avatar market includes enterprise avatars, so only a subsegment is relevant.

### SAM

Serviceable available market: portion of TAM relevant to consumer mobile/web subscription products in launch geographies.

Filters:

- Consumer, not pure enterprise.
- Mobile/web accessible.
- Subscription/IAP compatible.
- Relevant age and behavior segment.
- English/Russian/priority-language launch scope.

### SOM

Serviceable obtainable market: plausible captured revenue over 12, 24, and 36 months.

Scenarios:

- Conservative: small niche app, low paid conversion.
- Base: successful niche subscription app.
- Upside: strong AI/avatar loop with viral or paid acquisition efficiency.

## Formula Layer

### Top-Down Formula

```text
TAM_category = market_report_revenue_range
SAM = TAM_category * consumer_share * mobile_or_web_share * relevant_use_case_share * launch_geo_share
SOM_year_n = SAM * reachable_distribution_share * conversion_capture_share
```

### Bottom-Up Formula

```text
Annual_revenue = reachable_users * activation_rate * paid_conversion * ARPPU
SOM = annual_revenue by scenario
```

### Competitor Proxy Formula

```text
Category_revenue_proxy = sum(top_competitor_estimated_revenue) / top_competitor_market_share
Alina_capture = category_revenue_proxy * plausible_share
```

## Confidence Levels

High:

- Primary source, public company filing, platform data, or credible analyst page with clear definition.

Medium:

- Public market research summary with market definition and dates, but limited methodology detail.

Low:

- SEO report pages, unsourced blog claims, AI-generated summaries, forum estimates.

## Source Confidence Review Layer

The TAM/SAM/SOM model now has a separate source-confidence review:

- `docs/market/market-source-confidence-review-v1.md`
- `data_processed/market_source_confidence_review.csv`
- `data_processed/market_confidence_summary.csv`

This layer does not turn the model into a final forecast. It grades each existing source by source type, directness to Alina, methodology visibility, variance risk, and recommended model role. Broad or indirect sources can support ranges and context, but should not become precise final claims without competitor revenue proxies and human validation.

## Monetization Proxy Layer

The model also has a bottom-up monetization proxy layer:

- `docs/market/monetization-proxy-matrix-v1.md`
- `data_processed/market_monetization_proxy_matrix.csv`
- `data_processed/monetization_proxy_examples.csv`

This layer uses observed App Store IAP metadata, Google Play IAP metadata, and public web paywall/screenshot signals. It supports the claim that adjacent markets have paid behavior, but it does not estimate competitor revenue and does not prove Alina-specific willingness to pay.

## First Public Source Anchors

These are starting anchors, not final answers.

| Market | Source | Public claim | Use | Confidence |
|---|---|---|---|---|
| Mobile gaming | BCG Video Gaming Report 2026 | Mobile game IAP revenue shown as roughly flat/modest growth into 2030, with new webstore/payment channels taking share | Gaming monetization and distribution trend anchor | High |
| Mobile gaming | Statista Mobile Games Worldwide | Search snippet reports 2026 worldwide mobile games revenue projection of USD 134.22B and 2026-2030 CAGR of 5.13% | Broad TAM cross-check | Medium |
| Mindfulness apps | Stratistics MRC, Meditation and Mindfulness Apps Market 2026 | Public page states USD 1.68B in 2026, USD 4.62B by 2034, CAGR 13.4% | Mindfulness direct TAM anchor | Medium |
| AI avatars | Global Market Insights, AI Avatars Market 2026 | Public page states USD 8.4B in 2026, USD 93.4B by 2035, CAGR 30.6% | Avatar broad TAM; needs consumer subsegment discount | Medium |
| Coaching | ICF Coaching Futures Report 2026 | Describes online/virtual coaching as dominant and AI as transforming delivery and personalization | Market structure and trend anchor, not direct TAM | High |
| Astrology apps | ResearchAndMarkets / other public report pages | Public summaries indicate rapid growth but definitions vary widely | Astrology TAM range; needs triangulation | Low/Medium |

## Required Next Extraction

For each market, collect at least:

- 5 market-size sources.
- 5 trend sources.
- 10 competitor revenue/pricing proxies.
- 20 top competitor examples.
- 20 audience/review/forum signals.

## Anti-Double-Counting Rules

1. Do not add five TAMs together as Alina TAM.
2. Use the largest relevant behavioral market as the broad ceiling.
3. Use intersection TAM as a discounted subset, not a sum.
4. When two markets overlap heavily, document the overlap.
5. Keep "broad ecosystem TAM" separate from "direct spend TAM".
