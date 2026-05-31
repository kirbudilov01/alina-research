# Alina Research Expansion Master Plan

Date: 2026-05-31
Owner: Codex + Kirill
Mode: evidence-first, source-preserving, hypothesis-driven research OS

## North Star

Turn Alina Research from a 5,000-row directional competitor scan into a large-scale decision package that can support:

1. Go/No-Go on the product opportunity.
2. TAM/SAM/SOM ranges across five markets and their intersections.
3. Evidence-backed whitespace claim.
4. Clear ICP and common audience hypothesis.
5. MVP product core, competitive moat, and validation plan.
6. Final long-form PDF report with appendices, source registry, and raw data references.

## Current Baseline

Existing dataset:

- 5,000 deduplicated competitor rows.
- 5 niches, 1,000 rows each:
  - gaming
  - astrology_esoterics
  - avatar_identity
  - coaching
  - mindfulness
- Platforms currently covered:
  - App Store
  - Google Play
  - Web search

Main current limitation:

- The dataset is useful for directional synthesis, but too small and too mobile-store-heavy for a serious market landscape.
- The project needs forums, websites, web apps, desktop apps, Steam/PC ecosystems, Reddit/Product Hunt/G2/Capterra/SaaS catalogs, browser tools, Discord/community signals, and open market research reports.

## Research Logic

The project must remain hypothesis-driven. Every major block should either strengthen, weaken, or refine a hypothesis.

### H1. Product Shape Exists

Initial claim:

Alina can combine birth-date personalization, avatar identity, daily coaching, mindfulness, and gaming retention into one coherent daily companion.

Evidence needed:

- Comparable products already monetize at least 3 of 5 pillars.
- Users already accept emotional/spiritual guidance apps.
- Avatar mechanics can support identity reinforcement rather than only novelty.
- Daily loops are proven in adjacent markets.

### H2. Markets Have Money

Initial claim:

Each pillar has a real market with enough revenue, growth, and willingness to pay to support a combined product.

Evidence needed:

- TAM/SAM/SOM range per pillar.
- Adjacent benchmark revenue by category.
- Paid subscription and IAP patterns.
- Top-player revenue proxies.
- Growth drivers and constraints.
- Geographic split and likely launch geos.

Output:

- `docs/market/market-sizing-methodology.md`
- `data_processed/market_source_registry.csv`
- `docs/market/market-sizing-pass-1.md`

### H3. White Space Exists

Initial claim:

There is an under-served intersection between AI spiritual coaching, avatar-based identity reinforcement, and gamified daily mindfulness.

Evidence needed:

- Competitor feature matrix with intersection tags.
- "No one owns this exact job" evidence.
- Saturation map by feature cluster.
- Pricing and retention loop comparison.
- Negative evidence: competitors that are close and may already occupy the space.

Output:

- `docs/intersections/whitespace-map-v2.md`
- `data_processed/competitor_feature_matrix.csv`
- `reports/whitespace-evidence-pack.md`

### H4. Competitive Advantage Is Plausible

Initial claim:

Alina can differentiate through a unified daily loop where personal meaning, one action, emotional reset, and avatar progression are one path.

Evidence needed:

- Competitor moat analysis.
- Feature gaps.
- UX loop comparison.
- Trust/compliance risk analysis.
- Monetization model comparison.
- AI defensibility vs commodity risk.

Output:

- `docs/competitive/moat-analysis-v1.md`
- `docs/competitive/competitor-archetypes-v1.md`
- `data_processed/pricing_retention_matrix.csv`

### H5. Shared Audience Exists

Initial claim:

There is a common audience segment across spirituality, self-improvement, mindfulness, identity tools, and light gamification.

Evidence needed:

- Audience descriptions from app reviews, Reddit/forum posts, reviews, app store copy, reports.
- Segment overlap matrix.
- Persona hypotheses.
- JTBD and pain-point clustering.
- Willingness-to-pay indicators.

Output:

- `docs/audience/audience-segmentation-v1.md`
- `docs/audience/icp-v1.md`
- `data_processed/audience_signal_matrix.csv`

### H6. Product Core Can Be Defined

Initial claim:

The MVP should center on a daily flow: personal reading -> one action -> short reset -> avatar progression -> next-day hook.

Evidence needed:

- Activation benchmark assumptions.
- Retention loop benchmark assumptions.
- UX pattern library.
- Feature priority matrix.
- MVP/non-MVP boundary.

Output:

- `docs/product/product-core-v1.md`
- `docs/product/mvp-scope-v1.md`
- `docs/product/validation-roadmap-v1.md`

## 12-Hour Execution Plan

### Block A. Research OS Hardening

Status: in progress

Tasks:

- Create master plan.
- Create expanded source map.
- Create market sizing methodology.
- Create source and claim schemas.
- Add scripts for large-scale competitor expansion.
- Initialize or reconnect Git repository.

### Block B. Source Expansion

Status: pending

Target sources:

- App Store Search API.
- Google Play search/details.
- Steam search and tag pages.
- Product Hunt search pages.
- AlternativeTo categories.
- G2/Capterra/Trustpilot style SaaS/review directories where accessible.
- Reddit search pages and subreddit discovery.
- Web search via DuckDuckGo HTML.
- Company websites and pricing pages.
- Public market research pages and PDFs.

Target scale:

- Short-term: 10,000 to 15,000 raw rows.
- Overnight target: 30,000 to 50,000 raw rows if rate limits allow.
- Deduplicated useful universe target: 15,000 to 25,000 rows.

### Block C. Market Sizing

Status: pending

Tasks:

- Build source registry for market estimates.
- Extract market-size claims.
- Normalize claim fields: market, year, metric, value, currency, geography, source, confidence.
- Build low/base/high TAM ranges.
- Define SAM by addressable platforms/geographies.
- Define SOM by launch assumptions and capture scenarios.

### Block D. Competitor Intelligence

Status: pending

Tasks:

- Add feature tags.
- Add monetization tags.
- Add retention tags.
- Add audience tags.
- Identify top 50 competitors per niche.
- Identify top 100 intersection competitors.
- Create competitor archetypes.

### Block E. Audience and Forum Research

Status: pending

Tasks:

- Collect Reddit/forum/community signals.
- Cluster pains and jobs.
- Extract language users use.
- Build shared-audience hypothesis.
- Create persona and ICP docs.

### Block F. Synthesis and PDF

Status: pending

Tasks:

- Build long-form report markdown.
- Add charts and matrices.
- Render PDF.
- Add appendices with source registry and methodology.

## Data Rules

1. Preserve source URLs for every row.
2. Never collapse claims into a single number when the source base is weak; use low/base/high ranges.
3. Mark confidence explicitly.
4. Keep raw data separate from processed data.
5. Do not overstate astrology or mental-health claims; trust and compliance risk must be visible.
6. Track negative evidence as carefully as positive evidence.

## Critical Risks

1. Dataset bloat without analytical value.
2. App-store search duplication and low-quality rows.
3. Paywalled market reports with unverifiable summaries.
4. Category definitions that double-count TAM.
5. A product concept that becomes five separate modules instead of one loop.
6. AI/avatar novelty that does not translate into retention.
7. Mental-health adjacent positioning creating compliance and trust risk.

## Immediate Next Files

- `docs/competitive/expanded-source-map.md`
- `docs/market/market-sizing-methodology.md`
- `data_processed/market_source_registry.csv`
- `docs/sources/claim-schema.md`
- `scripts/expand_competitor_universe.mjs`

