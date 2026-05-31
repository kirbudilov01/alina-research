# Русский provenance index источников V1

Собрано: 2026-05-31T11:42:49.022Z

## Зачем нужен этот файл

Этот слой объясняет, откуда берется evidence в большом пакете Alina Research. Он соединяет manifest, source refs, market source registry и discovery/backlog, чтобы в русском PDF было ясно: какие источники являются raw data, какие - обработанными матрицами, какие - рыночными report anchors, и какие claims нельзя усиливать без ручной проверки.

## Сводка provenance

- Manifest artifacts: 387
- Artifacts with source refs: 67
- Source-reference rows across manifest: 224356
- Market source registry rows: 12
- Source discovery rows: 12

## Artifact Type Summary

| Artifact type | Count |
| --- | ---: |
| processed_data | 77 |
| raw_data | 14 |
| research_doc | 92 |
| chart | 14 |
| pdf | 4 |
| validation_workspace | 93 |
| report | 17 |
| generator_script | 76 |

## Evidence Role Summary

| Evidence role | Count |
| --- | ---: |
| audience_icp | 52 |
| source_claim | 31 |
| supporting | 50 |
| market_money | 53 |
| decision_artifact | 171 |
| competitive_whitespace | 13 |
| competitor_universe | 17 |

## Provenance Rows

| ID | Слой / источник | Rows | Source refs | Граница |
| --- | --- | ---: | ---: | --- |
| PROV_001 | Локальный манифест артефактов | 387 | 224356 | Manifest доказывает наличие и форму файлов, но не доказывает, что рынок купит продукт или что гипотеза валидирована. |
| PROV_002 | Raw/processed source-reference слой | 67 | 224356 | Source refs показывают provenance, но не заменяют ручную проверку качества страницы, скриншота, onboarding flow или participant quote. |
| PROV_003 | Market source registry для TAM/SAM/SOM | 12 | 12 | Часть market report pages paywalled или broad-category; использовать как диапазоны и proxy, не как прогноз выручки Alina. |
| PROV_004 | Research source discovery | 12 | 12 | Discovery row не равен подтвержденному источнику; claim можно усиливать только после extraction/confidence review. |
| SRC_SRC-MKT-0001 | gaming / market_forecast_page | 1 | 1 | Use as cross-check, not sole source. |
| SRC_SRC-MKT-0002 | gaming / analyst_pdf | 1 | 1 | Useful for monetization and distribution, not full Alina direct TAM. |
| SRC_SRC-MKT-0003 | mindfulness / market_report_page | 1 | 1 | Good direct category anchor; methodology paywalled. |
| SRC_SRC-MKT-0004 | avatar_identity / market_report_page | 1 | 1 | Broad enterprise+consumer market; must discount for consumer self-improvement/avatar app use case. |
| SRC_SRC-MKT-0005 | coaching / industry_pdf | 1 | 1 | Trend anchor; needs separate TAM/revenue source. |
| SRC_SRC-MKT-0006 | astrology_esoterics / market_report_page | 1 | 1 | Need direct values and cross-checks from multiple astrology sources. |
| SRC_SRC-MKT-0007 | astrology_esoterics / market_report_page | 1 | 1 | High estimate anchor; likely broad definition. |
| SRC_SRC-MKT-0008 | astrology_esoterics / market_report_page | 1 | 1 | Large CAGR; use for range only. |
| SRC_SRC-MKT-0009 | astrology_esoterics / market_report_page | 1 | 1 | Direct category anchor, but public page has limited methodology. |
| SRC_SRC-MKT-0010 | coaching / press_release | 1 | 1 | Career coaching is adjacent, not identical to Alina. |
| SRC_SRC-MKT-0011 | coaching / market_report_page | 1 | 1 | Enterprise-heavy; use as digital coaching benchmark. |
| SRC_SRC-MKT-0012 | coaching / market_report_page | 1 | 1 | Good cross-check for coaching platform range. |

## Файлы

- `data_processed/russian_source_provenance_index.csv`
- `docs/decision/russian-source-provenance-index-v1.md`
- `data_processed/evidence_artifact_manifest.csv`
- `data_processed/market_source_registry.csv`
- `data_raw/research_source_discovery.csv`
