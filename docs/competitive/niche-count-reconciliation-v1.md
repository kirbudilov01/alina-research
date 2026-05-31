# Niche Count Reconciliation V1

Generated: 2026-05-31

## Зачем нужен этот слой

Этот слой объясняет, как читать счетчики по пяти направлениям Alina. Он нужен, чтобы не путать raw source rows, global dedup, all-source niche dedup, direct app-store dedup, top100 review и manual targets. Главная идея простая: большие числа показывают coverage, а не доказанный спрос и не количество прямых клонов.

## Главная сверка

Глобальный dedup пакета сейчас равен 37,176. Сумма all-source niche dedup равна 43,144, а сумма direct app-store dedup по нишам равна 13,117. Эти числа не обязаны совпадать: ниши являются тематическими корзинами, и один продукт может попадать в несколько контекстов. Поэтому для текста отчета нужно писать не “у нас столько уникальных приложений в мире”, а “у нас такой объем source coverage и такой ближний direct app-store слой по каждой нише”.

## Reconciliation Table

| ID | Слой | Рынок | Тип числа | Значение | Доля от global dedup | Простое значение | Как сверять |
| --- | --- | --- | --- | ---: | --- | --- | --- |
| COUNT_01_GLOBAL_RAW | Глобальный пакет | Все рынки | raw source rows | 68085 |  | Все собранные строки до глобальной дедупликации: app/store listings, source rows, benchmarks, forum/context rows и другие discovery-строки. | Raw rows всегда больше или иначе устроены, чем dedup rows; их нельзя читать как число приложений. |
| COUNT_02_GLOBAL_DEDUP | Глобальный пакет | Все рынки | global dedup rows | 37176 | 100.0% | Уникализированные строки всего пакета после глобальной дедупликации. | Глобальный dedup сейчас 37,176, а сумма нишевых all-source dedup 43,144; разница объясняется пересечениями и разными scope. |
| COUNT_03_NICHE_DEDUP_SUM | Сумма по нишам | Пять направлений | sum of all-source niche dedup rows | 43144 | 116.1% | Сумма dedup-строк внутри каждой ниши, если читать рынки как тематические корзины. | Это тематическая сумма, а не глобальная уникальность: пересекающиеся продукты могут встречаться в нескольких корзинах. |
| COUNT_04_DIRECT_APP_SUM | Сумма по нишам | Пять направлений | sum of direct app-store dedup rows by niche | 13117 | 35.3% | Ближнее consumer-app поле: App Store / Google Play / похожие app-store rows после нишевой дедупликации. | Это более близкий к конкурентному анализу слой, чем all-source dedup, но он тоже тематический и требует ручного sampling. |
| COUNT_05_TOP100_REVIEW | Review layer | Пять направлений | top100 primary competitors | 187 | 0.5% | Кандидаты, вынесенные в более внимательный scorecard/review слой. | Top-100 layer сейчас суммарно 187 строк по нишам; manual targets еще уже: 18. |
| COUNT_NICHE_01 | Ниша | Mindfulness / reset | niche count stack | 9,803 | 26.4% | В Mindfulness / reset: raw=15,109, all-source dedup=9,803, cross-source total dedup=9,723, direct app-store dedup=2,550, top100=21, manual targets=0. | Для этой ниши direct app-store dedup является самым понятным счетчиком близкого consumer-app поля, но claim upgrade требует manual walkthrough. |
| COUNT_NICHE_02 | Ниша | Avatar / identity | niche count stack | 9,952 | 26.8% | В Avatar / identity: raw=14,872, all-source dedup=9,952, cross-source total dedup=7,944, direct app-store dedup=2,506, top100=49, manual targets=3. | Для этой ниши direct app-store dedup является самым понятным счетчиком близкого consumer-app поля, но claim upgrade требует manual walkthrough. |
| COUNT_NICHE_03 | Ниша | Astrology / esoterics | niche count stack | 2,657 | 7.1% | В Astrology / esoterics: raw=5,427, all-source dedup=2,657, cross-source total dedup=2,657, direct app-store dedup=2,206, top100=59, manual targets=7. | Для этой ниши direct app-store dedup является самым понятным счетчиком близкого consumer-app поля, но claim upgrade требует manual walkthrough. |
| COUNT_NICHE_04 | Ниша | Coaching / self-improvement | niche count stack | 3,857 | 10.4% | В Coaching / self-improvement: raw=7,671, all-source dedup=3,857, cross-source total dedup=3,857, direct app-store dedup=2,651, top100=50, manual targets=8. | Для этой ниши direct app-store dedup является самым понятным счетчиком близкого consumer-app поля, но claim upgrade требует manual walkthrough. |
| COUNT_NICHE_05 | Ниша | Gaming / progression benchmark | niche count stack | 16,875 | 45.4% | В Gaming / progression benchmark: raw=24,446, all-source dedup=16,875, cross-source total dedup=14,304, direct app-store dedup=3,204, top100=8, manual targets=0. | Gaming/progression читается как benchmark mechanics, не как прямой рынок Alina. |

## Правило для отчета

1. Для масштаба пакета использовать global raw и global dedup.
2. Для ответа “сколько данных по нише” использовать raw/all-source dedup/direct app-store dedup вместе.
3. Для близких consumer-app конкурентов смотреть direct app-store dedup и top100/manual targets.
4. Для claims H1/H3 не использовать счетчики как proof: нужен manual walkthrough.
5. Для H2 не использовать счетчики как revenue proof: нужны paid-flow/WTP и prototype paid-depth signals.

## Files

- `data_processed/niche_count_reconciliation.csv`
- `data_processed/global_niche_count_rollup.csv`
- `data_processed/cross_source_universe_dedup.csv`
