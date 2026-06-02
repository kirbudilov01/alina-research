import fs from 'fs';
import path from 'path';

const ROOT = process.cwd();
const OUT = path.join(ROOT, 'reports', 'aura-information-layer-map.md');

function mdTable(rows, columns) {
  const header = `| ${columns.map(c => c.label).join(' | ')} |`;
  const sep = `| ${columns.map(() => '---').join(' | ')} |`;
  const body = rows.map(row => `| ${columns.map(c => String(row[c.key] ?? '').replace(/\n/g, '<br>').replace(/\|/g, '/')).join(' | ')} |`);
  return [header, sep, ...body].join('\n');
}

const chapters = [
  {
    chapter: 'Глава 1. Что такое AURA',
    main: 'Определение AURA, центральная петля, Life Canvas как причинный след, гипотеза существования продукта.',
    evidence: 'Карта гипотез, логика исследования, быстрые стратегические выводы.',
    appendix: 'Не требуется: глава должна оставаться коротким входом.',
    why: 'Это слой ориентации. Его нельзя перегружать доказательствами.',
  },
  {
    chapter: 'Глава 2. Как работает AURA',
    main: 'Episode -> Action -> Reset -> Reflection -> Life Canvas -> Tomorrow Hook; journey первого дня; накопление ценности.',
    evidence: 'Service blueprint, рабочие концепции, сравнение концепций, product verdict.',
    appendix: 'Подробные экранные спецификации и state/API детали.',
    why: 'Читатель должен понять механику до рынка, конкурентов и стека.',
  },
  {
    chapter: 'Глава 3. Почему это может работать',
    main: 'Пять категорий спроса, рынок есть, деньги есть, конкуренты подтверждают спрос, белое пятно находится в причинной петле.',
    evidence: 'Категории как слои продукта, TAM/SAM/SOM summary, competitor/whitespace summary.',
    appendix: 'Полные market inventories, списки приложений, конкурентные таблицы, источники.',
    why: 'В main нужны выводы и 5-10 фактов, а не десятки страниц списков.',
  },
  {
    chapter: 'Глава 4. Для кого это',
    main: 'Первые сегменты и ICP: кто уже имеет близкое поведение и почему именно они подходят для проверки.',
    evidence: 'Сценарии входа, вопросы интервью, audience segments, сигналы поведения.',
    appendix: 'Полные capture sheets, вопросы интервью по сегментам, дополнительные VOC-таблицы.',
    why: 'Аудитория должна читаться как выбор первых людей, не как демографический справочник.',
  },
  {
    chapter: 'Глава 5. Что мы строим',
    main: 'MVP scope, user journey, функции, product mechanics, что делать и что запрещено добавлять.',
    evidence: 'Screen map, user stories, function-level specification, product copy principles.',
    appendix: 'Detailed screen specs, API payloads, full acceptance criteria, edge cases.',
    why: 'Основная глава должна помочь принять продуктовые решения, а не заменить ТЗ.',
  },
  {
    chapter: 'Глава 6. Как это строим',
    main: 'Архитектура, image-first Life Canvas, no free daily video, cost-control, unit economics principles.',
    evidence: 'Architecture decision, stack, provider logic, revenue/margin scenarios, security.',
    appendix: 'Provider comparison, full cost tables, database schema, event taxonomy, QA checklist.',
    why: 'CTO должен видеть решение быстро, а детализация должна быть доступна ниже.',
  },
  {
    chapter: 'Глава 7. Как это продаем',
    main: 'GTM logic: первые 100/1000 пользователей, позиционирование, каналы, контент, experiments.',
    evidence: 'Channel playbooks, creator outreach, landing variants, messaging matrix, budget.',
    appendix: 'Hook bank, 30-day content calendar, retention research tables, objection library.',
    why: 'Маркетинг должен объяснять loop, а не утонуть в банке формулировок.',
  },
  {
    chapter: 'Глава 8. Как принимаем решение',
    main: 'Go/no-go, риски, kill criteria, метрики loop, следующий шаг.',
    evidence: 'Validation plan summary, dashboard, decision tree, точки верификации.',
    appendix: 'Полный validation plan, retention/virality tables, investment memo skeleton.',
    why: 'Финал должен быть решением, а не еще одним исследовательским разделом.',
  },
  {
    chapter: 'Глава 9. Appendix / Evidence Layer',
    main: 'Не является обязательным непрерывным чтением.',
    evidence: 'Все доказательства и рабочие детали.',
    appendix: 'Это и есть appendix.',
    why: 'Сохраняет полноту без перегруза основного narrative.',
  },
];

const rules = [
  { rule: 'Main Narrative', meaning: 'То, что читатель обязан прочитать подряд.', length: 'Короткие выводы, схемы, 5-10 фактов, решения.' },
  { rule: 'Supporting Evidence', meaning: 'То, что подтверждает выводы прямо внутри главы.', length: 'Компактные таблицы, карты, summary-матрицы.' },
  { rule: 'Appendix', meaning: 'То, что нужно для проверки, команды или глубокой работы.', length: 'Длинные таблицы, списки, сырые данные, backlog, API, event taxonomy.' },
];

const chapterCards = chapters.map(row => ({
  chapter: row.chapter,
  main: row.main,
  evidence: row.evidence,
  appendix: row.appendix,
  why: row.why,
}));

const lines = [];
lines.push('# AURA Information Layer Map');
lines.push('');
lines.push('Эта карта не переписывает AURA Product Master Plan. Она показывает, как разделять информацию по уровням зрелого whitepaper: что читать обязательно, что доказывает выводы и что должно жить в appendix.');
lines.push('');
lines.push('## Правила Уровней');
lines.push('');
lines.push(mdTable(rules, [
  { key: 'rule', label: 'Уровень' },
  { key: 'meaning', label: 'Что это значит' },
  { key: 'length', label: 'Как должно выглядеть' },
]));
lines.push('');
lines.push('## Карта Глав');
lines.push('');
lines.push(mdTable(chapterCards, [
  { key: 'chapter', label: 'Глава' },
  { key: 'main', label: 'Main Narrative' },
  { key: 'evidence', label: 'Supporting Evidence' },
  { key: 'appendix', label: 'Appendix' },
  { key: 'why', label: 'Почему так' },
]));
lines.push('');
lines.push('## Практическое Решение');
lines.push('');
lines.push('- В начале каждой главы добавить короткий navigation block: Main Narrative / Supporting Evidence / Appendix.');
lines.push('- Внутри main narrative не держать таблицы длиннее 10-12 строк без явной причины.');
lines.push('- Если таблица нужна как доказательство, оставлять summary на 5-10 фактов и давать ссылку на appendix.');
lines.push('- Повторяющийся блок “Что это значит для AURA” заменить на chapter-specific выводы: решение, доказательство, следующий шаг.');
lines.push('- Appendix должен восприниматься как рабочая база, а не как продолжение обязательного чтения.');

fs.writeFileSync(OUT, `${lines.join('\n').trimEnd()}\n`);
console.log(`wrote ${OUT}`);
