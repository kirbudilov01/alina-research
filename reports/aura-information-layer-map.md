# AURA Information Layer Map

Эта карта не переписывает AURA Product Master Plan. Она показывает, как разделять информацию по уровням зрелого whitepaper: что читать обязательно, что доказывает выводы и что должно жить в appendix.

## Правила Уровней

| Уровень | Что это значит | Как должно выглядеть |
| --- | --- | --- |
| Main Narrative | То, что читатель обязан прочитать подряд. | Короткие выводы, схемы, 5-10 фактов, решения. |
| Supporting Evidence | То, что подтверждает выводы прямо внутри главы. | Компактные таблицы, карты, summary-матрицы. |
| Appendix | То, что нужно для проверки, команды или глубокой работы. | Длинные таблицы, списки, сырые данные, backlog, API, event taxonomy. |

## Карта Глав

| Глава | Main Narrative | Supporting Evidence | Appendix | Почему так |
| --- | --- | --- | --- | --- |
| Глава 1. Что такое AURA | Определение AURA, центральная петля, Life Canvas как причинный след, гипотеза существования продукта. | Карта гипотез, логика исследования, быстрые стратегические выводы. | Не требуется: глава должна оставаться коротким входом. | Это слой ориентации. Его нельзя перегружать доказательствами. |
| Глава 2. Как работает AURA | Episode -> Action -> Reset -> Reflection -> Life Canvas -> Tomorrow Hook; journey первого дня; накопление ценности. | Service blueprint, рабочие концепции, сравнение концепций, product verdict. | Подробные экранные спецификации и state/API детали. | Читатель должен понять механику до рынка, конкурентов и стека. |
| Глава 3. Почему это может работать | Пять категорий спроса, рынок есть, деньги есть, конкуренты подтверждают спрос, белое пятно находится в причинной петле. | Категории как слои продукта, TAM/SAM/SOM summary, competitor/whitespace summary. | Полные market inventories, списки приложений, конкурентные таблицы, источники. | В main нужны выводы и 5-10 фактов, а не десятки страниц списков. |
| Глава 4. Для кого это | Первые сегменты и ICP: кто уже имеет близкое поведение и почему именно они подходят для проверки. | Сценарии входа, вопросы интервью, audience segments, сигналы поведения. | Полные capture sheets, вопросы интервью по сегментам, дополнительные VOC-таблицы. | Аудитория должна читаться как выбор первых людей, не как демографический справочник. |
| Глава 5. Что мы строим | MVP scope, user journey, функции, product mechanics, что делать и что запрещено добавлять. | Screen map, user stories, function-level specification, product copy principles. | Detailed screen specs, API payloads, full acceptance criteria, edge cases. | Основная глава должна помочь принять продуктовые решения, а не заменить ТЗ. |
| Глава 6. Как это строим | Архитектура, image-first Life Canvas, no free daily video, cost-control, unit economics principles. | Architecture decision, stack, provider logic, revenue/margin scenarios, security. | Provider comparison, full cost tables, database schema, event taxonomy, QA checklist. | CTO должен видеть решение быстро, а детализация должна быть доступна ниже. |
| Глава 7. Как это продаем | GTM logic: первые 100/1000 пользователей, позиционирование, каналы, контент, experiments. | Channel playbooks, creator outreach, landing variants, messaging matrix, budget. | Hook bank, 30-day content calendar, retention research tables, objection library. | Маркетинг должен объяснять loop, а не утонуть в банке формулировок. |
| Глава 8. Как принимаем решение | Go/no-go, риски, kill criteria, метрики loop, следующий шаг. | Validation plan summary, dashboard, decision tree, точки верификации. | Полный validation plan, retention/virality tables, investment memo skeleton. | Финал должен быть решением, а не еще одним исследовательским разделом. |
| Глава 9. Appendix / Evidence Layer | Не является обязательным непрерывным чтением. | Все доказательства и рабочие детали. | Это и есть appendix. | Сохраняет полноту без перегруза основного narrative. |

## Практическое Решение

- В начале каждой главы добавить короткий navigation block: Main Narrative / Supporting Evidence / Appendix.
- Внутри main narrative не держать таблицы длиннее 10-12 строк без явной причины.
- Если таблица нужна как доказательство, оставлять summary на 5-10 фактов и давать ссылку на appendix.
- Повторяющийся блок “Что это значит для AURA” заменить на chapter-specific выводы: решение, доказательство, следующий шаг.
- Appendix должен восприниматься как рабочая база, а не как продолжение обязательного чтения.
