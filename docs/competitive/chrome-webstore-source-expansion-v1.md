# Chrome Web Store Source Expansion V1

Generated: 2026-05-31T06:29:24.731Z

## Purpose

This source-native collector expands browser-extension evidence without using broad search engines. It queries public Chrome Web Store search pages across the five research markets and deduplicates by source URL.

## Summary

- Query pairs attempted: 40
- Raw extracted rows after dedupe: 252
- OK rows: 251
- Max results per query: 20

Rows by market:

- astrology_esoterics: 55
- avatar_identity: 52
- coaching: 51
- mindfulness: 50
- gaming_progression: 44

Collection statuses:

- ok: 251
- empty_result: 1

## Interpretation

- Browser extensions are not the main consumer-mobile competitor set, but they are useful evidence for lightweight coaching, habit capture, accountability, progress, and AI feedback mechanics.
- Treat this as source-universe and mechanic evidence, not market-size or revenue proof.
- The detail enrichment script classifies fit bands and mechanic battlecards after this raw expansion.

## Files

- `data_raw/expanded_chrome_extensions_raw.csv`
- `data_processed/chrome_webstore_source_expansion_summary.csv`
