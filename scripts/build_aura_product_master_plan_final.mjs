import fs from 'fs';
import path from 'path';

const ROOT = process.cwd();
const SOURCE = path.join(ROOT, 'reports', 'aura-master-book.md');
const OUT = path.join(ROOT, 'reports', 'aura-product-master-plan-final.md');

const source = fs.readFileSync(SOURCE, 'utf8');

function normalize(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function h2(title) {
  const marker = `## ${title}`;
  const start = source.indexOf(marker);
  if (start === -1) throw new Error(`Missing H2: ${title}`);
  const nextH2 = source.indexOf('\n## ', start + marker.length);
  const nextChapter = source.indexOf('\n# ГЛАВА ', start + marker.length);
  const candidates = [nextH2, nextChapter].filter(index => index !== -1);
  const end = candidates.length ? Math.min(...candidates) : source.length;
  return source.slice(start, end).trim();
}

function introBlock() {
  return source
    .slice(0, source.indexOf('<!-- PAGEBREAK -->'))
    .replace(/^# AURA\s*\n+/m, '')
    .replace(/^# Product Master Plan\s*\n+/m, '')
    .trim();
}

function h3ChunksFromH2(title) {
  const block = h2(title);
  const starts = [...block.matchAll(/^### .+$/gm)].map(match => ({ index: match.index, title: match[0].replace(/^### /, '').trim() }));
  const chunks = new Map();
  const first = starts[0]?.index ?? block.length;
  const preface = block.slice(0, first).trim();
  if (preface) chunks.set('__preface__', preface);
  for (let i = 0; i < starts.length; i += 1) {
    const start = starts[i].index;
    const end = starts[i + 1]?.index ?? block.length;
    chunks.set(starts[i].title, block.slice(start, end).trim());
  }
  return chunks;
}

function pick(chunks, names) {
  return names.map(name => {
    if (!chunks.has(name)) throw new Error(`Missing H3: ${name}`);
    return chunks.get(name);
  });
}

function pageBreak() {
  return '<!-- PAGEBREAK -->';
}

function chapter(no, title, promise) {
  return [
    pageBreak(),
    `# ГЛАВА ${no}`,
    '',
    `# ${title}`,
    '',
    promise,
    '',
    '## Что читатель должен понять',
    '',
    `После этой главы читатель должен понимать: ${promise}`,
  ].join('\n');
}

function block(title, chunks) {
  return [
    '',
    `## ${title}`,
    '',
    ...chunks,
  ].filter(Boolean).join('\n');
}

function cleanChunk(chunk) {
  return chunk
    .replace(/^## Зачем нужна эта глава[\s\S]*?(?=^## |^# ГЛАВА |\z)/gm, '')
    .replace(/^## Центральная петля остается на экране[\s\S]*?(?=^## |^# ГЛАВА |\z)/gm, '')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

function summaryOnly(title, summary, movedTo = 'Appendix / Evidence Layer') {
  return [
    `## ${title}`,
    '',
    summary,
    '',
    `Полная доказательная детализация этого блока перенесена в ${movedTo}, чтобы основной narrative не превращался в таблицу и сохранял product-first чтение.`,
  ].join('\n');
}

function compactH2(title, summary) {
  return summaryOnly(title, summary);
}

const productModel = h3ChunksFromH2('ИТОГОВАЯ МОДЕЛЬ ПРОДУКТА И ГИПОТЕЗА #6');
const decisionVersion = h3ChunksFromH2('ВЕРСИЯ ДЛЯ РЕШЕНИЯ: ЧТО НУЖНО ДЛЯ ЗАПУСКА, ТЗ, БЮДЖЕТА И первый продукт');

const lines = [];

lines.push('# AURA');
lines.push('');
lines.push('# Product Master Plan Final');
lines.push('');
lines.push('Эта версия собирает существующий материал AURA в product-first структуру. Текстовые блоки не переписываются заново: они переупорядочены так, чтобы читатель сначала понял продукт, затем доказательства, аудиторию, MVP, технологию, запуск и критерии решения.');
lines.push('');
lines.push('## Новая логика чтения');
lines.push('');
lines.push('| Шаг | Вопрос | Где ответ |');
lines.push('| --- | --- | --- |');
lines.push('| 1 | Что такое AURA? | Главы 1-2 |');
lines.push('| 2 | Почему это может работать? | Главы 3-4 |');
lines.push('| 3 | Что именно строим? | Глава 5 |');
lines.push('| 4 | Как строим и продаем? | Главы 6-7 |');
lines.push('| 5 | Как принимаем решение? | Глава 8 |');
lines.push('| 6 | Где вся детализация? | Appendix |');

lines.push(chapter(1, 'Что такое AURA', 'AURA - это daily life-series product, где личный контекст превращается в эпизод, действие, reset, reflection и причинное изменение Life Canvas.'));
lines.push(introBlock());
lines.push(cleanChunk(h2('Карта проверки гипотез')));
lines.push(cleanChunk(h2('ОПИСАНИЕ ПРОЕКТА И ГИПОТЕЗА #1')));
lines.push(cleanChunk(h2('БЫСТРЫЕ ВЫВОДЫ ДЛЯ СТРАТЕГИИ')));

lines.push(chapter(2, 'Как работает AURA', 'Центральная ценность продукта находится в петле Episode -> Action -> Reset -> Reflection -> Life Canvas -> Tomorrow Hook.'));
lines.push(cleanChunk(h2('Journey Map первого дня')));
lines.push(cleanChunk(h2('Накопление ценности')));
lines.push(cleanChunk(h2('Life Canvas как причинная система')));
lines.push(cleanChunk(h2('Service blueprint первого loop')));
lines.push(cleanChunk(h2('1. Product Blueprint / Решение о первом продукте')));
lines.push(cleanChunk(h2('2. User Journey')));
lines.push(cleanChunk(h2('3. Screen Map')));
lines.push(...pick(productModel, [
  '__preface__',
  'Рабочие концепции приложения',
  'Сравнение концепций: почему выбираем не одну красивую идею, а связку',
  'Продуктовый вердикт: какое приложение стоит делать',
  'Avatar / Life Canvas: что именно должно меняться',
]));

lines.push(chapter(3, 'Почему это может работать', 'Сначала продуктовая механика, затем доказательство: рынки, деньги, конкуренты, паттерны и белое пятно.'));
lines.push(cleanChunk(h2('Карта категорий')));
lines.push(cleanChunk(h2('Категории как слои продукта')));
lines.push(cleanChunk(h2('Карта конкурентного поля')));
lines.push(compactH2('ОПРЕДЕЛЕНИЕ МИРОВЫХ ЦЕЛЕВЫХ РЫНКОВ И ГИПОТЕЗА #2', 'Для AURA важны пять соседних направлений: mindfulness/reset, avatar/identity, astrology/self-discovery, coaching/self-improvement и gaming/progression как источник механик возврата. Смысл этого блока не в том, чтобы перечислить все найденные приложения, а в том, чтобы показать: у продукта есть несколько уже существующих платных поведенческих рынков.'));
lines.push(compactH2('ОЦЕНКА РАЗМЕРА РЫНКА: TAM/SAM/SOM', 'AURA не должна считаться как один узкий horoscope или avatar TAM. Более честная рамка - пересечение мобильного self-care, персонального смысла, AI identity, coaching/habits и progression mechanics. В основной книге оставляем вывод: рынок достаточно большой для проверки, но деньги AURA доказываются не TAM, а платным поведением в MVP.'));
lines.push(compactH2('ОПРЕДЕЛЕНИЕ КОНКУРЕНТОВ И ГИПОТЕЗА #3', 'Конкурентов много, и это хороший сигнал. Белое пятно не в отсутствии продуктов, а в том, что существующие решения часто разрывают цепочку: смысл без действия, действие без образа, avatar без причинности, progress без эмоционального контекста.'));
lines.push(cleanChunk(h2('КОНКУРЕНТНОЕ ПРЕИМУЩЕСТВО И ГИПОТЕЗА #4')));
lines.push(cleanChunk(h2('СВЯЗКА БЕЛОГО ПЯТНА И АУДИТОРИИ')));
lines.push(cleanChunk(h2('ИСТОЧНИКИ И ГРАНИЦЫ ДОКАЗАТЕЛЬСТВ')));

lines.push(chapter(4, 'Для кого это', 'AURA должна стартовать не с абстрактного рынка, а с конкретных сегментов, у которых уже есть близкое поведение.'));
lines.push(cleanChunk(h2('Карта первых аудиторий')));
lines.push(cleanChunk(h2('СЦЕНАРИИ ВХОДА КАК СВЯЗУЮЩЕЕ ЗВЕНО')));
lines.push(cleanChunk(h2('АУДИТОРИЯ, ИНТЕРВЬЮ И ГИПОТЕЗА #5')));
lines.push(cleanChunk(h2('КЛЮЧЕВЫЕ НАБЛЮДЕНИЯ И ВОПРОСЫ ДЛЯ ПРОВЕРКИ')));
lines.push(cleanChunk(h2('3. Audience Segments')));
lines.push(cleanChunk(h2('15. Interview Script For GTM')));

lines.push(chapter(5, 'Что мы строим', 'MVP AURA должен проверять не весь будущий продукт, а причинную петлю и первый Life Canvas moment.'));
lines.push(...pick(productModel, [
  'Детальная комплектация продукта',
  'Рекомендуемые тарифы и упаковка ценности',
  'Первый релиз: что именно должно быть в приложении',
  'Продуктовая спецификация: путь пользователя по дням',
  'Что точно не делать в первый продукт',
  'Прототипы как гипотезы',
  'Функциональная карта первый продукт',
]));
lines.push(summaryOnly('4. Detailed Screen Specifications', 'В основном narrative достаточно зафиксировать экранную логику: Welcome -> Consent -> Profile -> Season -> Episode -> Action -> Reset -> Reflection -> Life Canvas -> Tomorrow Hook -> Paywall after value. Полные экранные спецификации нужны дизайнеру и разработчику, поэтому уходят в appendix.'));
lines.push(cleanChunk(h2('5. User Stories')));
lines.push(cleanChunk(h2('6. Core Scenarios')));
lines.push(cleanChunk(h2('7. первый продукт Scope')));
lines.push(cleanChunk(h2('8. Product Mechanics')));
lines.push(cleanChunk(h2('9. Function-Level Specification')));
lines.push(cleanChunk(h2('12. User States')));
lines.push(cleanChunk(h2('13. State Machine Logic')));
lines.push(cleanChunk(h2('18. Product Copy Principles')));
lines.push(cleanChunk(h2('27. Итоговое определение продукта')));
lines.push(...pick(decisionVersion, [
  '1. Продуктовый blueprint: полный путь пользователя',
  '2. Продуктовая спецификация: функции и приоритеты',
]));

lines.push(chapter(6, 'Как это строим', 'Техническая архитектура должна сохранять причинность, контролировать себестоимость и не допустить бесплатное ежедневное видео в MVP.'));
lines.push(cleanChunk(h2('Архитектура как продуктовая система')));
lines.push(cleanChunk(h2('Поток данных')));
lines.push(cleanChunk(h2('Экономика петли')));
lines.push(cleanChunk(h2('Cost stack')));
lines.push(cleanChunk(h2('Лестница монетизации')));
lines.push(...pick(productModel, [
  'Техническая реализуемость и себестоимость',
  'Рекомендуемый технологический стек и архитектура',
  'Монетизация: что проверять у конкурентов',
  'Монетизационная матрица: что именно продавать',
  'Почему люди платят соседним продуктам и что забирает АУРА',
]));
lines.push(summaryOnly('Что технически нужно подключать для avatar и Life Series', 'В основном narrative фиксируем решение: image-first Life Canvas, controlled AI/image providers, backend state machine, storage, analytics, billing и admin-control. Полная таблица сервисов, цен и вариантов реализации остается в appendix.'));
lines.push(summaryOnly('Модель себестоимости: сколько может стоить продукт на разных масштабах', 'Главный вывод для основной книги: text AI относительно дешевый, image generation становится ключевой переменной статьей, а free daily video нельзя включать в MVP. Полные сценарии на 100 / 1 000 / 10 000 / 100 000 пользователей уходят в appendix.'));
lines.push(summaryOnly('Аналитика, платный экран и финмодель: что нужно доказать до ТЗ', 'В основном narrative оставляем управленческий вывод: считать нужно не абстрактный MAU, а completed loop, returned user, cost per completed loop и paid intent after value. Подробная финмодель и список аналитических событий находятся в appendix.'));
lines.push(cleanChunk(h2('1. Architecture Decision')));
lines.push(cleanChunk(h2('2. System Architecture')));
lines.push(cleanChunk(h2('3. Recommended Stack For первый продукт')));
lines.push(cleanChunk(h2('4. Component Responsibilities')));
lines.push(summaryOnly('7. Provider Comparison', 'В основной книге достаточно выбора принципа: провайдеры должны быть быстрыми, управляемыми по стоимости, безопасными для персонального контекста и пригодными для image-first MVP. Полное сравнение GPT/Claude/Gemini/DeepSeek/OpenRouter, image и avatar providers переносится в appendix.'));
lines.push(cleanChunk(h2('8. Unit Economics Assumptions')));
lines.push(cleanChunk(h2('9. Unit Economics By Scale')));
lines.push(cleanChunk(h2('10. Sensitivity Analysis')));
lines.push(cleanChunk(h2('11. Revenue And Margin Scenarios')));
lines.push(cleanChunk(h2('12. Cost Control Rules')));
lines.push(cleanChunk(h2('13. Security And Privacy Requirements')));
lines.push(cleanChunk(h2('21. Итоговое техническое решение')));
lines.push(summaryOnly('3. Технологическое исследование: сравнение и выбор', 'В main narrative фиксируем не всю сравнительную таблицу, а решение: для MVP нужен управляемый AI brain, image-first avatar/Life Canvas layer, mobile stack, backend, storage, billing и analytics. Полная технологическая матрица остается в appendix.'));
lines.push(...pick(decisionVersion, ['4. Техническая архитектура: схема системы']));
lines.push(summaryOnly('5. Юнит-экономика: рабочая модель расходов', 'Основной вывод: экономика AURA бьется только при контроле image/video cost, paywall after value и учете cost per completed loop. Детальные сценарии по масштабам переносятся в appendix.'));
lines.push(summaryOnly('6. Монетизация: конкуренты и итоговая модель АУРЫ', 'В main narrative оставляем итоговую модель: free first loop, paid season/memory/recap/styles, premium/video moments как отдельная проверка. Таблицы по конкурентам и гипотезам монетизации уходят в appendix.'));

lines.push(chapter(7, 'Как это продаем', 'GTM должен продавать не абстрактный AI-продукт, а конкретный loop: действие сегодня меняет Life Canvas завтра.'));
lines.push(cleanChunk(h2('Воронка первых пользователей')));
lines.push(cleanChunk(h2('Карта каналов')));
lines.push(cleanChunk(h2('Контент-пиллары')));
lines.push(cleanChunk(h2('Таймлайн первых 30 дней')));
lines.push(cleanChunk(h2('Доска экспериментов')));
lines.push(cleanChunk(h2('1. GTM Decision Summary')));
lines.push(cleanChunk(h2('2. Positioning')));
lines.push(cleanChunk(h2('4. First 100 Users')));
lines.push(cleanChunk(h2('5. First 1000 Users')));
lines.push(cleanChunk(h2('6. Content Pillars')));
lines.push(cleanChunk(h2('7. Channel Playbooks')));
lines.push(cleanChunk(h2('8. 30-Day Launch Plan')));
lines.push(summaryOnly('9. 30-Day Content Calendar', 'В основной книге достаточно логики: первые 30 дней должны проверять positioning, loop comprehension, creator/content pull и paid intent. Полный календарь публикаций остается как рабочее приложение.'));
lines.push(cleanChunk(h2('10. Experiment Backlog')));
lines.push(cleanChunk(h2('11. Creator Outreach')));
lines.push(cleanChunk(h2('12. Landing Page Variants')));
lines.push(cleanChunk(h2('13. Messaging Matrix')));
lines.push(cleanChunk(h2('16. Budget For First 30 Days')));
lines.push(summaryOnly('17. Hook Bank', 'В main narrative оставляем роль hook bank: маркетинг AURA должен объяснять life-series, future self, causal Life Canvas и маленькое действие. Полный банк формулировок лучше читать как рабочий appendix для контента.'));
lines.push(cleanChunk(h2('18. Objection Handling')));
lines.push(cleanChunk(h2('19. Operating Rhythm')));
lines.push(cleanChunk(h2('21. Итоговое решение по запуску')));
lines.push(summaryOnly('7. Исследование удержания: возврат и отток', 'Главная retention-гипотеза: пользователь возвращается, если Day 2 помнит Day 1, а Life Canvas объясняет накопление изменений. Полные таблицы причин возврата, удаления, покупки и отказа от подписки выносятся в appendix.'));
lines.push(...pick(decisionVersion, [
  '8. Go-to-market: каналы и план запуска',
  '9. Система интервью: сегменты и вопросы',
  '10. План проверки первый продукт: 6 недель',
]));

lines.push(chapter(8, 'Как принимаем решение', 'Финал должен отвечать не “понравилась ли идея”, а прошла ли AURA проверку loop, экономики, retention и paid intent.'));
lines.push(cleanChunk(h2('СТОЛПЫ УВЕРЕННОСТИ И ОТКРЫТЫЕ РИСКИ')));
lines.push(summaryOnly('ПЛАН ПРОВЕРКИ САМЫХ ВАЖНЫХ РИСКОВ', 'В main narrative оставляем управленческий смысл: сначала проверяем causality Life Canvas, затем retention, paid intent, technical feasibility и GTM pull. Полные таблицы retention, virality, validation и investment memo уходят в appendix.'));
lines.push(cleanChunk(h2('БЛИЖАЙШАЯ ЛОГИКА ПРОВЕРКИ')));
lines.push(cleanChunk(h2('Dashboard решения')));
lines.push(cleanChunk(h2('Дерево решения')));
lines.push(cleanChunk(h2('Карта решений')));
lines.push(cleanChunk(h2('Что это значит для AURA')));
lines.push(...pick(productModel, [
  'Точки верификации с автором приложения',
  'Итог по продуктовой модели',
]));
lines.push(...pick(decisionVersion, [
  '11. Инвестиционная записка: инвесторская версия',
  '12. Финальное продуктовое решение',
]));

lines.push(chapter(9, 'Appendix / Evidence Layer', 'Appendix сохраняет детальность и доказательную базу, но не ломает основное product-first чтение.'));
lines.push(block('Технические приложения', [
  cleanChunk(h2('4. Detailed Screen Specifications')),
  cleanChunk(h2('10. Data Model')),
  cleanChunk(h2('11. API и системные контракты')),
  cleanChunk(h2('14. Analytics Events')),
  cleanChunk(h2('15. Metrics Dashboard')),
  cleanChunk(h2('16. Acceptance Criteria')),
  cleanChunk(h2('17. Edge Cases And Empty States')),
  cleanChunk(h2('19. Technical Non-Functional Requirements')),
  cleanChunk(h2('20. API And Backend Work Packages')),
  cleanChunk(h2('5. Database Schema Draft')),
  cleanChunk(h2('6. API Groups')),
  cleanChunk(h2('17. Implementation Backlog')),
  cleanChunk(h2('18. Event Taxonomy')),
  cleanChunk(h2('19. QA Checklist Before First Cohort')),
]));
lines.push(block('Доказательная база рынка и конкурентов', [
  cleanChunk(h2('ОПРЕДЕЛЕНИЕ МИРОВЫХ ЦЕЛЕВЫХ РЫНКОВ И ГИПОТЕЗА #2')),
  cleanChunk(h2('ОЦЕНКА РАЗМЕРА РЫНКА: TAM/SAM/SOM')),
  cleanChunk(h2('ОПРЕДЕЛЕНИЕ КОНКУРЕНТОВ И ГИПОТЕЗА #3')),
]));
lines.push(block('Экономика, провайдеры и финмодель', [
  ...pick(productModel, [
    'Что технически нужно подключать для avatar и Life Series',
    'Модель себестоимости: сколько может стоить продукт на разных масштабах',
    'Аналитика, платный экран и финмодель: что нужно доказать до ТЗ',
  ]),
  cleanChunk(h2('7. Provider Comparison')),
  ...pick(decisionVersion, [
    '3. Технологическое исследование: сравнение и выбор',
    '5. Юнит-экономика: рабочая модель расходов',
    '6. Монетизация: конкуренты и итоговая модель АУРЫ',
  ]),
]));
lines.push(block('Retention и маркетинговые приложения', [
  cleanChunk(h2('ПЛАН ПРОВЕРКИ САМЫХ ВАЖНЫХ РИСКОВ')),
  ...pick(decisionVersion, ['7. Исследование удержания: возврат и отток']),
  cleanChunk(h2('9. 30-Day Content Calendar')),
  cleanChunk(h2('17. Hook Bank')),
]));
lines.push(block('План сборки и команда', [
  cleanChunk(h2('Roadmap сборки')),
  cleanChunk(h2('Карта зависимостей')),
  cleanChunk(h2('Бюджет по спринтам')),
  cleanChunk(h2('1. Требования к первому продукту')),
  cleanChunk(h2('2. Sprint Plan')),
  cleanChunk(h2('3. Budget Summary')),
  cleanChunk(h2('4. Detailed Backlog')),
  cleanChunk(h2('5. Epic Requirements')),
  cleanChunk(h2('6. Dependencies And Critical Path')),
  cleanChunk(h2('7. Definition Of Done')),
  cleanChunk(h2('8. Open Questions Before Build')),
  cleanChunk(h2('9. Team Plan')),
  cleanChunk(h2('10. Итоговое решение по разработке')),
]));
lines.push(block('Расширенная детализация решения', [
  ...pick(decisionVersion, ['13. Финальная детализация: День 90, экранная карта, первый продукт scope и roadmap']),
  cleanChunk(h2('14. Build Phases')),
  cleanChunk(h2('15. Engineering Roadmap')),
  cleanChunk(h2('16. Technical Risk Register')),
  cleanChunk(h2('20. Источники и допущения')),
  cleanChunk(h2('20. Kill Criteria')),
]));

fs.writeFileSync(OUT, `${lines.join('\n').replace(/\n{3,}/g, '\n\n').trimEnd()}\n`);
console.log(`wrote ${OUT}`);
