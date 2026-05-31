# Russian Frontmatter Dashboard V1

Generated: 2026-05-31

## Зачем нужен этот слой

Этот dashboard ставится в начало русской версии отчета, чтобы читатель сразу увидел масштаб пакета, счетчики по пяти нишам, денежную рамку, статус gates и главный следующий ход. Он нужен не как новая гипотеза, а как навигационная панель перед длинным evidence pack.

## Главные числа

| Метрика | Значение | Как читать | Граница |
| --- | --- | --- | --- |
| Масштаб evidence base | 67,525 raw source-строк; 36,694 global dedup; 504 manifest artifacts | Пакет уже большой как карта рынка и конкурентов. | Масштаб строк не равен доказанному спросу или числу прямых клонов. |
| Покрытие пяти направлений | 5 market rows; 13,117 direct app dedup rows by niche; 43,144 all-source dedup rows by niche | По каждой нише видно, сколько данных лежит под выводами. | Niche dedup rows нельзя складывать как уникальные продукты: один продукт может жить в нескольких контекстах. |
| Денежная рамка H2 | intersection SAM $202M; weighted SAM $80.8M; sensitivity high-or-above 4/6 | Денежная зона выглядит достаточно большой, чтобы продолжать проверку. | Это range-based sizing, не revenue forecast и не закрытый H2 gate. |
| Статус гипотез | 6/6 gates hold_validate; H1 12 / 60; success 0 / 25; H2 28 / 40; success 8 / 12; H5 12 / 96; success 0 / 30 | Исследование готово к ручной проверке, но еще не готово к claim upgrade. | Listing-only, secondary VOC и prototype-readiness не заменяют observed walkthrough/interview/session evidence. |
| Следующий рабочий фокус | 22 next-validation tasks; readability rows=9; source-quality rows=5 | Следующий прирост качества должен прийти от observed rows, а не от бесконечного расширения desk research. | Backlog описывает работу, но не считается выполненным evidence. |

## Пять ниш

| Ниша | Сколько данных | Как читать | Граница |
| --- | --- | --- | --- |
| Mindfulness / reset | raw=15,109; all dedup=9,803; direct app dedup=2,550; top100=21; manual targets=0 | сильный money proxy | Счетчики показывают coverage, но не доказывают demand, WTP или отсутствие hidden clone. |
| Avatar / identity | raw=14,872; all dedup=9,952; direct app dedup=2,506; top100=49; manual targets=3 | сильный money proxy | Счетчики показывают coverage, но не доказывают demand, WTP или отсутствие hidden clone. |
| Astrology / esoterics | raw=5,427; all dedup=2,657; direct app dedup=2,206; top100=59; manual targets=7 | сильный money proxy | Счетчики показывают coverage, но не доказывают demand, WTP или отсутствие hidden clone. |
| Coaching / self-improvement | raw=7,671; all dedup=3,857; direct app dedup=2,651; top100=50; manual targets=8 | средний money proxy | Счетчики показывают coverage, но не доказывают demand, WTP или отсутствие hidden clone. |
| Gaming / progression benchmark | raw=24,446; all dedup=16,875; direct app dedup=3,204; top100=8; manual targets=0 | Использовать как benchmark механик прогресса, возврата и монетизации. | Gaming не считать прямым TAM Alina до доказанного ritual/self-improvement overlap. |

## Gates

| Гипотеза | Статус | Следующий шаг | Решение сейчас |
| --- | --- | --- | --- |
| H1: форма продукта существует | начато, но доказательств недостаточно; completed 12 / 60; success 0 / 25 | Нужна observed validation строка. | оставить hold_validate |
| H3: есть узкое белое пятно | начато, но доказательств недостаточно; completed 12 / 60; success 0 / 25 | Нужна observed validation строка. | оставить hold_validate |
| H2: в рынках есть деньги | начато, но доказательств недостаточно; completed 28 / 40; success 8 / 12 | Нужна observed validation строка. | оставить hold_validate |
| H5: общая аудитория существует | начато, но доказательств недостаточно; completed 12 / 96; success 0 / 30 | Нужна observed validation строка. | оставить hold_validate |
| H4: конкурентное преимущество правдоподобно | начато, но доказательств недостаточно; completed 16 / 80; success 0 / 32 | Нужна observed validation строка. | оставить hold_validate |
| H6: продуктовое ядро можно определить | начато, но доказательств недостаточно; completed 16 / 80; success 0 / 32 | Нужна observed validation строка. | оставить hold_validate |

## Files

- `data_processed/russian_frontmatter_dashboard.csv`
- `reports/alina-global-hypothesis-report-v1.md`
- `reports/alina-global-executive-narrative-v1.md`
