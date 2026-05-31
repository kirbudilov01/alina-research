# Expanded Research Kickoff

Date: 2026-05-31

## What Changed

The project has been converted from a compact competitor scan into a scalable research operating system.

Added:

- `docs/research-expansion-master-plan.md`
- `docs/competitive/expanded-source-map.md`
- `docs/market/market-sizing-methodology.md`
- `docs/sources/claim-schema.md`
- `data_processed/market_source_registry.csv`
- `scripts/expand_competitor_universe.mjs`

Updated:

- `package.json` scripts for expanded collection and validation.
- `.gitignore` to prevent `node_modules/` from being committed.

## Smoke Run

Command:

```bash
npm run collect:expanded:smoke
```

Result:

- Raw rows: 320
- Deduplicated rows: 310
- Output directory: `data_raw/expanded`

Observed limitation:

- Initial Google Play library scraping returned zero rows in the smoke run, so a direct Google Play search fallback was added.

## Full Expanded Run 1

Command:

```bash
MAX_PER_KEYWORD=120 npm run collect:expanded
```

Result:

- Raw rows: 17,490
- Deduplicated rows: 12,552
- Output directory: `data_raw/expanded`

Deduplicated rows by niche:

| Niche | Rows |
|---|---:|
| Gaming | 3,137 |
| Astrology / Esoterics | 2,201 |
| Avatar / Identity | 2,281 |
| Coaching | 2,534 |
| Mindfulness | 2,399 |

Deduplicated rows by source:

| Source | Rows |
|---|---:|
| App Store search | 8,103 |
| Google Play search fallback | 1,808 |
| Steam search | 2,585 |
| DuckDuckGo search | 56 |

Interpretation:

- The project now has a second, broader competitor universe beyond the original 5,000-row matrix.
- Combining existing raw tables and this expanded raw run crosses 30,000 raw collected rows.
- The current bottleneck is web/forum discovery depth, not app-store volume.
- The next collection layer should add Product Hunt, AlternativeTo, Reddit/forum registries, pricing pages, and market report discovery.

## First Market Source Anchors

The first source registry now includes anchors for:

- Mobile gaming: BCG and Statista.
- Mindfulness apps: Stratistics MRC.
- AI avatars: Global Market Insights.
- Coaching: International Coaching Federation.
- Astrology apps: ResearchAndMarkets placeholder requiring more triangulation.

## Next Runs

1. Run expanded collection with all keywords.
2. Add source-specific collectors for Product Hunt, AlternativeTo, Reddit/forum registry, and market report discovery.
3. Build market-size claim extraction table.
4. Build competitor feature tagging pipeline.
