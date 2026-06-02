import fs from 'fs';
import path from 'path';

const ROOT = process.cwd();
const OUT = path.join(ROOT, 'reports', 'aura-product-vs-build-split-map.md');

function mdTable(rows, columns) {
  const header = `| ${columns.map(c => c.label).join(' | ')} |`;
  const sep = `| ${columns.map(() => '---').join(' | ')} |`;
  const body = rows.map(row => `| ${columns.map(c => String(row[c.key] ?? '').replace(/\n/g, '<br>').replace(/\|/g, '/')).join(' | ')} |`);
  return [header, sep, ...body].join('\n');
}

const productSections = [
  ['Что такое AURA', 'Product Master Plan', 'Это центральное определение продукта: без него документ не отвечает на вопрос “что это”.'],
  ['Главная схема книги / центральная петля', 'Product Master Plan', 'Episode -> Action -> Reset -> Reflection -> Life Canvas -> Tomorrow Hook является главным продуктовым ядром.'],
  ['Описание проекта и гипотеза #1', 'Product Master Plan', 'Нужно для объяснения, почему AURA вообще может быть отдельной категорией.'],
  ['Как работает AURA / Journey Map / Life Canvas', 'Product Master Plan', 'Это продуктовая логика, важная для инвестора, партнера, клиента, дизайнера и команды.'],
  ['Рынки, деньги, конкуренты, белое пятно', 'Product Master Plan', 'Дает ответ “почему это может работать”, но только в summary-слое; длинные таблицы остаются evidence appendix.'],
  ['ICP / аудитория / интервью / боли', 'Product Master Plan', 'Объясняет, для кого делается продукт и кого проверять первым.'],
  ['MVP scope / user journey / функции / product mechanics', 'Product Master Plan', 'Отвечает на вопрос “что строим” без превращения в Jira или ТЗ.'],
  ['Монетизация как продуктовая модель', 'Product Master Plan', 'Нужна на уровне “за что платят и почему”, без детальной юнит-экономики и provider cost.'],
  ['GTM / первые 100 / первые 1000 / каналы / content logic', 'Product Master Plan', 'Объясняет, как проверить спрос и вывести продукт к первым пользователям.'],
  ['Риски / validation / go-no-go / decision tree', 'Product Master Plan', 'Закрывает решение о запуске, продолжении, изменении или остановке.'],
];

const buildSections = [
  ['Техническая архитектура', 'Build Plan', 'Это документ для CTO/engineering, не для основного продуктово-стратегического чтения.'],
  ['React Native / frontend stack', 'Build Plan', 'Стек реализации важен команде, но перегружает investor/partner/client version.'],
  ['NestJS / backend stack', 'Build Plan', 'Это engineering decision, а не часть продуктовой истории.'],
  ['Supabase / Postgres / database schema', 'Build Plan', 'Схемы БД нужны для реализации и ТЗ, но не для понимания AURA.'],
  ['RevenueCat / billing implementation', 'Build Plan', 'В master plan важна логика монетизации; конкретный billing provider должен быть в build plan.'],
  ['API groups / API payload examples', 'Build Plan', 'Это интерфейсы реализации, не narrative продукта.'],
  ['Provider comparison / AI image services', 'Build Plan', 'В master plan достаточно принципа image-first/no free daily video; сравнение провайдеров - техническое приложение.'],
  ['Unit economics by scale / cost tables', 'Build Plan', 'В основном документе нужна экономическая логика; detailed COGS scenarios и sensitivity лучше держать отдельно.'],
  ['Sprint planning / Sprint 1-5', 'Build Plan', 'Спринты превращают книгу в Jira; их нужно вынести в рабочий документ команды.'],
  ['Backlog / epics / definition of done', 'Build Plan', 'Это delivery material, не стратегический master plan.'],
  ['Budget / hours / implementation estimates', 'Build Plan', 'Бюджет и часы нужны для планирования разработки, но не должны ломать продуктовую книгу.'],
  ['Engineering roadmap / QA checklist / event taxonomy', 'Build Plan', 'Рабочая техническая детализация должна жить отдельно и быть доступна CTO/PM.'],
];

const ambiguousSections = [
  ['Unit economics summary', 'Оставить summary в Product Master Plan; полные таблицы в Build Plan', 'Фаундеру и инвестору нужна маржинальная логика, но не все сценарии расходов.'],
  ['Monetization matrix', 'Оставить продуктовые тарифы в Product Master Plan; implementation/billing в Build Plan', 'Платная модель - часть стратегии, provider setup - часть реализации.'],
  ['Analytics / metrics', 'Оставить go/no-go метрики в Product Master Plan; event taxonomy в Build Plan', 'Метрики решения нужны всем, события и payloads нужны команде.'],
  ['Technical feasibility', 'Оставить короткое “можно собрать” в Product Master Plan; подробности в Build Plan', 'Риск реализуемости важен, но стек не должен быть главным повествованием.'],
  ['MVP screen map', 'Оставить в Product Master Plan; detailed specs в Build Plan или Design Spec', 'Screen map отвечает “что строим”, detailed behavior - уже delivery.'],
];

const futureDocs = [
  {
    doc: 'AURA Product Master Plan',
    purpose: 'Продуктово-стратегический документ для Алины, партнера, инвестора, дизайнера, клиента и новой команды.',
    questions: 'Что это? Почему существует? Для кого? Как работает? Что в MVP? Как монетизируем? Как проверяем? Какие риски?',
    shouldNotContain: 'Sprint hours, backlog rows, API payloads, database schema, provider-by-provider technical tables, implementation budget detail.',
  },
  {
    doc: 'AURA Build Plan',
    purpose: 'Рабочий документ для CTO, PM, engineering и оценки разработки.',
    questions: 'Как строим? На каком стеке? Какие сервисы? Какие API? Сколько стоит? Какие спринты? Какой backlog? Какие риски реализации?',
    shouldNotContain: 'Длинное объяснение рынка, философия продукта, investor-style market proof, narrative-повторение Life Canvas.',
  },
];

const lines = [];
lines.push('# AURA Product Master Plan vs Build Plan Split Map');
lines.push('');
lines.push('Эта карта не переписывает документы. Она фиксирует издательское решение: основной AURA Product Master Plan должен быть продуктово-стратегическим, а техническая реализация должна жить в отдельном AURA Build Plan.');
lines.push('');
lines.push('## Два Будущих Документа');
lines.push('');
lines.push(mdTable(futureDocs, [
  { key: 'doc', label: 'Документ' },
  { key: 'purpose', label: 'Для чего' },
  { key: 'questions', label: 'На какие вопросы отвечает' },
  { key: 'shouldNotContain', label: 'Что не должно быть внутри' },
]));
lines.push('');
lines.push('## Что Остается В AURA Product Master Plan');
lines.push('');
lines.push(mdTable(productSections.map(([section, target, why]) => ({ section, target, why })), [
  { key: 'section', label: 'Раздел / материал' },
  { key: 'target', label: 'Куда' },
  { key: 'why', label: 'Почему' },
]));
lines.push('');
lines.push('## Что Переезжает В AURA Build Plan');
lines.push('');
lines.push(mdTable(buildSections.map(([section, target, why]) => ({ section, target, why })), [
  { key: 'section', label: 'Раздел / материал' },
  { key: 'target', label: 'Куда' },
  { key: 'why', label: 'Почему' },
]));
lines.push('');
lines.push('## Пограничные Разделы');
lines.push('');
lines.push(mdTable(ambiguousSections.map(([section, decision, why]) => ({ section, decision, why })), [
  { key: 'section', label: 'Раздел' },
  { key: 'decision', label: 'Решение' },
  { key: 'why', label: 'Почему' },
]));
lines.push('');
lines.push('## Итог');
lines.push('');
lines.push('- AURA Product Master Plan должен перестать быть техническим delivery-документом.');
lines.push('- В нем должны остаться продукт, рынок, аудитория, MVP, монетизация, GTM и критерии решения.');
lines.push('- Все, что звучит как Jira, CTO handoff, API spec, sprint planning, budget estimate или provider setup, должно переехать в AURA Build Plan.');
lines.push('- Ничего не удаляется: меняется только граница между стратегическим документом и рабочим документом команды.');

fs.writeFileSync(OUT, `${lines.join('\n').trimEnd()}\n`);
console.log(`wrote ${OUT}`);
