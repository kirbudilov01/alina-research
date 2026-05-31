# P0 External Source Collection V1

Generated: 2026-05-31T03:56:25.196Z

## Scope

This collector executes a controlled P0 source-expansion smoke pass using indexed search pages for Product Hunt and AlternativeTo plus direct Chrome Web Store search pages. It is intentionally small by default and is a discovery layer, not a final detail-page parser.

## Coverage

- Deduplicated P0 external rows: 29
- Usable rows: 23

Rows by source bucket:

- Chrome Web Store: 23
- Product Hunt: 3
- AlternativeTo: 3

Rows by market:

- coaching: 29

## Source Summary

| Source | Raw Rows | Usable | Output | Examples |
| --- | ---: | ---: | --- | --- |
| Product Hunt | 3 | 0 | `data_raw/expanded_product_hunt_raw.csv` |  |
| AlternativeTo | 3 | 0 | `data_raw/expanded_alternativeto_raw.csv` |  |
| Chrome Web Store | 23 | 23 | `data_raw/expanded_chrome_extensions_raw.csv` | COACH by Dropzone AI<br>Lichess AI Coach<br>Made That AI Coach<br>Spekit — AI Sidekick: Your AI Sales Coach and Assistant<br>Hinty - AI Meeting Coach<br>Mindstone AI Coach<br>Reply Coach AI<br>AI Prompt Coach by LeadWithAI.co |

## Interpretation

- This pass should be read as a controlled method test, not a heavy search-engine crawl.
- Chrome Web Store returned usable browser-extension candidates and reduces mobile-store bias.
- Product Hunt and AlternativeTo returned empty indexed-search attempts in this smoke pass; those rows are retained as source-attempt evidence, not competitor evidence.
- The next pass should detail-fetch top Chrome candidates and use source-native or curated exports for Product Hunt/AlternativeTo rather than relying only on search result pages.

## Files

- `data_raw/expanded_product_hunt_raw.csv`
- `data_raw/expanded_alternativeto_raw.csv`
- `data_raw/expanded_chrome_extensions_raw.csv`
- `data_raw/expanded/p0_external_sources_raw.csv`
- `data_processed/p0_external_source_summary.csv`
