# Global Niche Count Rollup V1

Generated: 2026-05-31T18:26:44.624Z

## Зачем нужен этот слой

Этот rollup отвечает на простой вопрос: сколько именно источников и приложений взято в каждой из пяти ниш мирового исследования Alina. Он нужен как читательский мост между большим source universe и выводами по рынку, конкурентам, whitespace и validation.

## Общий счет

- Ниш: 5
- Global raw source rows без повторного сложения ниш: 68,085
- Five-niche rollup raw rows без company-positioning lane: 68,085
- All-source dedup rows по нишам, суммарно: 43,626
- Global cross-source dedup без повторного сложения ниш: 37,176
- Direct app-store dedup rows: 13,117
- Top-100 primary competitor placements across niches: 187
- Manual validation targets: 18

## Таблица по нишам

| Ниша | All raw | All dedup | Direct app dedup | Direct share | Top-100 | Manual targets | Coverage | Как читать |
| --- | ---: | ---: | ---: | --- | ---: | ---: | --- | --- |
| Mindfulness / reset | 15,181 | 9,865 | 2,550 | 25.8% | 21 | 0 | 9 groups; strong 3; medium 2 | сильный money proxy; возможность есть, нужен ручной sampling |
| Avatar / identity | 15,000 | 10,058 | 2,506 | 24.9% | 49 | 3 | 9 groups; strong 3; medium 2 | сильный money proxy; возможность есть, нужен ручной sampling |
| Astrology / esoterics | 5,475 | 2,700 | 2,206 | 81.7% | 59 | 7 | 8 groups; strong 1; medium 3 | сильный money proxy; рынок плотный или контекст неясен |
| Coaching / self-improvement | 7,679 | 3,864 | 2,651 | 68.6% | 50 | 8 | 8 groups; strong 1; medium 3 | средний money proxy; рынок плотный или контекст неясен |
| Gaming / progression benchmark | 24,750 | 17,139 | 3,204 | 18.7% | 8 | 0 | 10 groups; strong 3; medium 2 | деньги видны, но это benchmark; benchmark механик, не primary market |

## Граница вывода

Эти числа показывают масштаб и распределение desk/source discovery. Они не означают, что все строки являются уникальными прямыми конкурентами Alina, и не закрывают validation-гейты. Для апгрейда гипотез нужны walkthrough конкурентов, paid-flow/WTP evidence, ICP-интервью и прототипные сессии.

Важная арифметическая граница: 43,626 all-source dedup в этом документе - это сумма dedup по пяти нишам. Она может быть выше глобального cross-source dedup 37,176, потому что один источник/продукт может попадать в несколько тематических контекстов. Для общего масштаба пакета использовать 37,176, для сравнения ниш между собой - построчные нишевые счетчики.

## Files

- `data_processed/global_niche_count_rollup.csv`
- `data_processed/russian_readable_niche_summary.csv`
- `data_processed/cross_source_coverage_matrix.csv`
