# Global Source Quality Gap Audit V1

Generated: 2026-05-31

## Зачем нужен этот слой

Этот аудит отвечает на вопрос: где source base по пяти рынкам уже достаточно сильный для desk map, а где следующий добор должен идти source-native/direct lanes без тяжелого поискового crawl. Он отделяет масштаб базы от качества claim.

## Scale Boundary

- Raw source scale: 67525 rows; status=proved
- Dedup 50k aspiration: 36694 rows; status=open

## Market Source Quality

| Рынок | Direct dedup | Direct share | Benchmark dedup | Strong/Med/Sup | Как читать | Следующие lanes |
| --- | ---: | ---: | ---: | --- | --- | --- |
| Mindfulness / reset | 2,550 | 26.0% | 6,608 | 3/2/0 | coverage пригоден для directionality, но требует ручного sampling перед claim upgrade | P0 Product Hunt <br> P0 AlternativeTo <br> P0 Chrome Web Store / browser extensions |
| Avatar / identity | 2,506 | 25.2% | 6,867 | 3/2/0 | coverage пригоден для directionality, но требует ручного sampling перед claim upgrade | P0 Product Hunt <br> P0 AlternativeTo <br> P0 Chrome Web Store / browser extensions |
| Astrology / esoterics | 2,206 | 83.0% | 366 | 1/3/0 | direct consumer-app coverage достаточно заметный для desk map | P0 Product Hunt <br> P1 Reddit/subreddit discovery as competitor source <br> P2 Public website/pricing pages for top candidates |
| Coaching / self-improvement | 2,651 | 68.7% | 485 | 1/3/0 | direct consumer-app coverage достаточно заметный для desk map | P0 Product Hunt <br> P0 AlternativeTo <br> P0 Chrome Web Store / browser extensions |
| Gaming / progression benchmark | 3,204 | 19.0% | 13,542 | 3/2/0 | coverage сильный по масштабу, но сильно benchmark/mechanics-heavy | P1 Microsoft Store / Mac App Store web <br> P1 itch.io / indie game directories <br> P1 Reddit/subreddit discovery as competitor source |

## Reading Rule

Direct consumer-app coverage ближе к конкурентным claims. Steam/itch полезны как mechanics/benchmark, но не должны автоматически усиливать прямой TAM или H1/H3. Reddit/forum дают язык боли и alternatives, но требуют manual reading. Следующий source growth лучше делать через конкретные source-native lanes из backlog, а не через широкий поисковый crawl.

## Files

- `data_processed/global_source_quality_gap_audit.csv`
- `data_processed/cross_source_coverage_matrix.csv`
- `data_processed/source_expansion_backlog.csv`
