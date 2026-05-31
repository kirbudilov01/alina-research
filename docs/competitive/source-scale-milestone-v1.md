# Source Scale Milestone V1

Generated: 2026-05-31T18:18:40.786Z

## Purpose

This artifact separates source-scale proof from validation proof. It makes the current scale claim precise: raw 50k is proved, dedup 30k+ and the 30k-40k working band are proved, while dedup 50k remains an open upper aspiration.

## Milestones

| Milestone | Status | Metric | Threshold | Decision RU | Boundary RU |
| --- | --- | ---: | --- | --- | --- |
| RAW_50K_SOURCE_SCALE | proved | 68085 | >= 50000 raw normalized source rows | Raw cross-source universe уже прошел 50k: 68,085 строк. Это закрывает масштаб discovery/source-map, но не означает 68,085 уникальных прямых конкурентов. | Raw rows сохраняют повторы по источникам, странам, запросам, тегам и форумным упоминаниям; это слой покрытия, а не dedup competitor proof. |
| DEDUP_30K_LOWER_BOUND | proved | 37176 | >= 30000 dedup competitor/source rows | Dedup cross-source universe закрыл нижнюю границу 30k: 37,176 строк. | Dedup снижает дубли, но часть строк остается benchmark/context evidence, особенно Steam/itch/gaming mechanics и Reddit mentions. |
| DEDUP_30_40K_BAND | proved_inside_band | 37176 | 30000-40000 dedup competitor/source rows | Dedup universe сейчас находится внутри рабочей зоны 30k-40k: 37,176 строк. | Это достаточный масштаб для картирования соседних рынков, но не финальный validation proof по H1-H6. |
| DEDUP_50K_UPPER_ASPIRATION | open | 37176 | >= 50000 dedup competitor/source rows | Dedup 50k aspiration еще открыт: 37,176 строк, gap 12,824 строк. | Нельзя писать, что 50k уникальных/dedup конкурентов уже доказаны; доказаны raw 50k и dedup 30k+. |
| SOURCE_QUALITY_BOUNDARY | explicit | 16 summary rows; 44 coverage cells; 11 strong; 12 medium | quality boundary stated | Масштаб источников полезен для discovery, saturation и поиска белого пятна, но качество claim зависит от типа источника. | App Store/Google Play/desktop/web extensions ближе к конкурентам; Steam/itch часто benchmark/mechanic; Reddit/forum чаще VOC/context до manual read. |
| NEXT_SOURCE_LANES | prioritized | 10 backlog lanes | non-search-heavy next expansion lanes | Следующий рост лучше делать не через широкие поисковики, а через source-native/direct lanes: B2B directories, company positioning pages, дополнительные desktop/browser stores, curated Product Hunt/AlternativeTo exports если доступны без Cloudflare-блокировки. | Product Hunt и AlternativeTo direct/sitemap попытки ранее уперлись в Cloudflare 403; этот факт не надо обходить тяжелым search-engine crawl без отдельного решения. |

## Reading Rule

- It is fair to say the research has passed raw 50k source scale and dedup 30k+ competitor/source scale.
- It is not fair to say the research has already proved 50k dedup unique competitors.
- Scale does not close H1-H6: manual competitor walkthrough, paid-flow signoff, ICP interviews, and prototype sessions remain required.

## Files

- `data_processed/source_scale_milestone.csv`
