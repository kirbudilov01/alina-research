# Global Niche Count Rollup V1

Generated: 2026-05-31T16:19:29.788Z

## Зачем нужен этот слой

Этот rollup отвечает на простой вопрос: сколько именно источников и приложений взято в каждой из пяти ниш мирового исследования Alina. Он нужен как читательский мост между большим source universe и выводами по рынку, конкурентам, whitespace и validation.

## Общий счет

- Ниш: 5
- All-source raw rows по пяти нишам: 67,525
- All-source dedup rows по нишам, суммарно: 43,144
- Global cross-source dedup без повторного сложения ниш: 36,694
- Direct app-store dedup rows: 13,117
- Top-100 primary competitor placements across niches: 187
- Manual validation targets: 18

## Таблица по нишам

| Ниша | All raw | All dedup | Direct app dedup | Direct share | Top-100 | Manual targets | Coverage | Как читать |
| --- | ---: | ---: | ---: | --- | ---: | ---: | --- | --- |
| Mindfulness / reset | 15,109 | 9,803 | 2,550 | 26.0% | 21 | 0 | 8 groups; strong 3; medium 2 | сильный money proxy; возможность есть, нужен ручной sampling |
| Avatar / identity | 14,872 | 9,952 | 2,506 | 25.2% | 49 | 3 | 8 groups; strong 3; medium 2 | сильный money proxy; возможность есть, нужен ручной sampling |
| Astrology / esoterics | 5,427 | 2,657 | 2,206 | 83.0% | 59 | 7 | 7 groups; strong 1; medium 3 | сильный money proxy; рынок плотный или контекст неясен |
| Coaching / self-improvement | 7,671 | 3,857 | 2,651 | 68.7% | 50 | 8 | 7 groups; strong 1; medium 3 | средний money proxy; рынок плотный или контекст неясен |
| Gaming / progression benchmark | 24,446 | 16,875 | 3,204 | 19.0% | 8 | 0 | 9 groups; strong 3; medium 2 | деньги видны, но это benchmark; benchmark механик, не primary market |

## Граница вывода

Эти числа показывают масштаб и распределение desk/source discovery. Они не означают, что все строки являются уникальными прямыми конкурентами Alina, и не закрывают validation-гейты. Для апгрейда гипотез нужны walkthrough конкурентов, paid-flow/WTP evidence, ICP-интервью и прототипные сессии.

Важная арифметическая граница: 43,144 all-source dedup в этом документе - это сумма dedup по пяти нишам. Она может быть выше глобального cross-source dedup 36,694, потому что один источник/продукт может попадать в несколько тематических контекстов. Для общего масштаба пакета использовать 36,694, для сравнения ниш между собой - построчные нишевые счетчики.

## Files

- `data_processed/global_niche_count_rollup.csv`
- `data_processed/russian_readable_niche_summary.csv`
- `data_processed/cross_source_coverage_matrix.csv`
