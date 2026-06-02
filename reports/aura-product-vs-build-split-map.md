# AURA Product Master Plan vs Build Plan Split Map

Эта карта не переписывает документы. Она фиксирует издательское решение: основной AURA Product Master Plan должен быть продуктово-стратегическим, а техническая реализация должна жить в отдельном AURA Build Plan.

## Два Будущих Документа

| Документ | Для чего | На какие вопросы отвечает | Что не должно быть внутри |
| --- | --- | --- | --- |
| AURA Product Master Plan | Продуктово-стратегический документ для Алины, партнера, инвестора, дизайнера, клиента и новой команды. | Что это? Почему существует? Для кого? Как работает? Что в MVP? Как монетизируем? Как проверяем? Какие риски? | Sprint hours, backlog rows, API payloads, database schema, provider-by-provider technical tables, implementation budget detail. |
| AURA Build Plan | Рабочий документ для CTO, PM, engineering и оценки разработки. | Как строим? На каком стеке? Какие сервисы? Какие API? Сколько стоит? Какие спринты? Какой backlog? Какие риски реализации? | Длинное объяснение рынка, философия продукта, investor-style market proof, narrative-повторение Life Canvas. |

## Что Остается В AURA Product Master Plan

| Раздел / материал | Куда | Почему |
| --- | --- | --- |
| Что такое AURA | Product Master Plan | Это центральное определение продукта: без него документ не отвечает на вопрос “что это”. |
| Главная схема книги / центральная петля | Product Master Plan | Episode -> Action -> Reset -> Reflection -> Life Canvas -> Tomorrow Hook является главным продуктовым ядром. |
| Описание проекта и гипотеза #1 | Product Master Plan | Нужно для объяснения, почему AURA вообще может быть отдельной категорией. |
| Как работает AURA / Journey Map / Life Canvas | Product Master Plan | Это продуктовая логика, важная для инвестора, партнера, клиента, дизайнера и команды. |
| Рынки, деньги, конкуренты, белое пятно | Product Master Plan | Дает ответ “почему это может работать”, но только в summary-слое; длинные таблицы остаются evidence appendix. |
| ICP / аудитория / интервью / боли | Product Master Plan | Объясняет, для кого делается продукт и кого проверять первым. |
| MVP scope / user journey / функции / product mechanics | Product Master Plan | Отвечает на вопрос “что строим” без превращения в Jira или ТЗ. |
| Монетизация как продуктовая модель | Product Master Plan | Нужна на уровне “за что платят и почему”, без детальной юнит-экономики и provider cost. |
| GTM / первые 100 / первые 1000 / каналы / content logic | Product Master Plan | Объясняет, как проверить спрос и вывести продукт к первым пользователям. |
| Риски / validation / go-no-go / decision tree | Product Master Plan | Закрывает решение о запуске, продолжении, изменении или остановке. |

## Что Переезжает В AURA Build Plan

| Раздел / материал | Куда | Почему |
| --- | --- | --- |
| Техническая архитектура | Build Plan | Это документ для CTO/engineering, не для основного продуктово-стратегического чтения. |
| React Native / frontend stack | Build Plan | Стек реализации важен команде, но перегружает investor/partner/client version. |
| NestJS / backend stack | Build Plan | Это engineering decision, а не часть продуктовой истории. |
| Supabase / Postgres / database schema | Build Plan | Схемы БД нужны для реализации и ТЗ, но не для понимания AURA. |
| RevenueCat / billing implementation | Build Plan | В master plan важна логика монетизации; конкретный billing provider должен быть в build plan. |
| API groups / API payload examples | Build Plan | Это интерфейсы реализации, не narrative продукта. |
| Provider comparison / AI image services | Build Plan | В master plan достаточно принципа image-first/no free daily video; сравнение провайдеров - техническое приложение. |
| Unit economics by scale / cost tables | Build Plan | В основном документе нужна экономическая логика; detailed COGS scenarios и sensitivity лучше держать отдельно. |
| Sprint planning / Sprint 1-5 | Build Plan | Спринты превращают книгу в Jira; их нужно вынести в рабочий документ команды. |
| Backlog / epics / definition of done | Build Plan | Это delivery material, не стратегический master plan. |
| Budget / hours / implementation estimates | Build Plan | Бюджет и часы нужны для планирования разработки, но не должны ломать продуктовую книгу. |
| Engineering roadmap / QA checklist / event taxonomy | Build Plan | Рабочая техническая детализация должна жить отдельно и быть доступна CTO/PM. |

## Пограничные Разделы

| Раздел | Решение | Почему |
| --- | --- | --- |
| Unit economics summary | Оставить summary в Product Master Plan; полные таблицы в Build Plan | Фаундеру и инвестору нужна маржинальная логика, но не все сценарии расходов. |
| Monetization matrix | Оставить продуктовые тарифы в Product Master Plan; implementation/billing в Build Plan | Платная модель - часть стратегии, provider setup - часть реализации. |
| Analytics / metrics | Оставить go/no-go метрики в Product Master Plan; event taxonomy в Build Plan | Метрики решения нужны всем, события и payloads нужны команде. |
| Technical feasibility | Оставить короткое “можно собрать” в Product Master Plan; подробности в Build Plan | Риск реализуемости важен, но стек не должен быть главным повествованием. |
| MVP screen map | Оставить в Product Master Plan; detailed specs в Build Plan или Design Spec | Screen map отвечает “что строим”, detailed behavior - уже delivery. |

## Итог

- AURA Product Master Plan должен перестать быть техническим delivery-документом.
- В нем должны остаться продукт, рынок, аудитория, MVP, монетизация, GTM и критерии решения.
- Все, что звучит как Jira, CTO handoff, API spec, sprint planning, budget estimate или provider setup, должно переехать в AURA Build Plan.
- Ничего не удаляется: меняется только граница между стратегическим документом и рабочим документом команды.
