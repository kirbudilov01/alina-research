# Global Report Readability Audit V1

Generated: 2026-05-31

## Зачем нужен этот слой

Этот аудит отвечает на вопрос: складно ли читается текущий русский мировой отчет, где он перегружен и какие правки нужны до внешней версии. Он не проверяет истинность рыночных claims, а проверяет форму повествования, видимость счетчиков, границы доказательств и понятность следующего шага.

## Краткий вывод

Текущая версия читается последовательно: продуктовая идея ведет к рынкам, рынки к конкурентам, конкуренты к whitespace, затем к аудитории, MVP и validation queue. Narrative-spine слой фиксирует вопрос читателя и переход для каждого крупного блока, а frontmatter dashboard выносит ключевые счетчики до длинных таблиц. Главная слабость остается в плотности таблиц и большом количестве технических EN labels. Для рабочего evidence pack это допустимо; для внешнего чтения добавляется отдельный reader/glossary layer, а тяжелые таблицы остаются приложением.

## Audit Table

| ID | Блок | Статус | Риск | Что видно | Что делать |
| --- | --- | --- | --- | --- | --- |
| READ_01_SEQUENCE | Порядок повествования | складно | низкая | 20 крупных разделов; expected_sequence_breaks=0 | Сохранять этот порядок при следующих расширениях и не вставлять новые тяжелые таблицы до объясняющего абзаца. |
| READ_02_COUNTS | Видимость счетчиков по нишам | складно | средняя | в отчете есть таблицы Direct app/store dedup, Total dedup, Top-100 apps и niche rollup | Оставить счетчики в основном тексте; если добавлять новые источники, обновлять niche rollup до PDF/DOCX. |
| READ_03_TABLE_DENSITY | Плотность таблиц | перегружено | высокая | markdown_table_rows=279 | В следующей итерации сделать два режима: executive narrative в основном PDF и heavy appendix для широких таблиц, сохранив текущий полный отчет как evidence pack. |
| READ_04_COMPETITOR_TAXONOMY | Логичность competitor map | складно с оговоркой | средняя | competitor archetype rollup дополнен cleanup queue и прямой оговоркой queued_not_applied | После ручного taxonomy pass обновить top100 scorecard или оставить queue как documented limitation, если правки не подтверждены. |
| READ_05_LANGUAGE_MIX | Русский текст и технические EN-термины | понятно, но много терминов | средняя | technical_english_hits=515 | Для внешней версии сделать отдельный glossary или заменить часть table headers на русские подписи; для рабочей версии оставить EN labels там, где они являются ID/полями данных. |
| READ_06_CLAIM_BOUNDARIES | Границы доказательств | складно | низкая | в тексте повторяются hold_validate, not final proof, source boundaries и запрет на claim upgrade без observed evidence | Не убирать эти границы ради красоты; лучше вынести краткий executive summary поверх них, если нужен более легкий PDF. |
| READ_07_NEXT_ACTION | Ясность следующего шага | складно | низкая | есть P0 очередь: competitor walkthrough -> paid-flow -> ICP interview -> prototype session | Следующим рабочим ходом закрывать первые P0 walkthrough и paid-flow tasks, а не расширять desk research бесконечно. |
| READ_08_NARRATIVE_SPINE | Повествовательная склейка по образцу | складно | низкая | storyline_rows=10; section_present=yes | Держать STORY_01-STORY_10 как редакционный каркас перед каждой внешней сборкой PDF/DOCX. |
| READ_09_FRONTMATTER_DASHBOARD | Первые управленческие числа | складно | низкая | dashboard_rows=16; section_present=yes | Оставлять frontmatter dashboard в начале полного отчета и executive narrative; тяжелые детализации держать ниже. |
| READ_10_READER_LAYER | Легкая reader-версия и glossary | смягчено отдельным reader layer | низкая | reader_report=yes; glossary_rows=12 | Использовать reader report как первый документ для чтения, а полный hypothesis report и manifest как доказательное приложение. |

## Files

- `data_processed/global_report_readability_audit.csv`
- `reports/alina-global-hypothesis-report-v1.md`
