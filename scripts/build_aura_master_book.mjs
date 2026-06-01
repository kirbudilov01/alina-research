import fs from 'fs';
import path from 'path';

const OUT = 'reports/aura-master-book.md';

function read(file) {
  return fs.readFileSync(file, 'utf8').trim();
}

function stripFirstTitle(markdown) {
  return markdown.replace(/^# .+\n+/, '').trim();
}

function mdTable(rows, columns) {
  const header = `| ${columns.map(c => c.label).join(' | ')} |`;
  const sep = `| ${columns.map(() => '---').join(' | ')} |`;
  const body = rows.map(row => `| ${columns.map(c => String(row[c.key] ?? '').replace(/\n/g, '<br>').replace(/\|/g, '/')).join(' | ')} |`);
  return [header, sep, ...body].join('\n');
}

function pageBreak() {
  return '<!-- PAGEBREAK -->';
}

function visualLoop() {
  return mdTable([
    { stage: '01', name: 'Episode', role: 'Смысл дня', test: 'Пользователь чувствует: “это про меня сейчас”.' },
    { stage: '02', name: 'Action', role: 'Маленький шаг', test: 'Пользователь может сделать это сегодня.' },
    { stage: '03', name: 'Reset', role: 'Снятие сопротивления', test: 'Переход к действию становится легче.' },
    { stage: '04', name: 'Reflection', role: 'Доказательство', test: 'Одна эмоция или строка фиксирует реальный опыт.' },
    { stage: '05', name: 'Life Canvas', role: 'Видимый след', test: 'Пользователь понимает, почему образ изменился.' },
    { stage: '06', name: 'Tomorrow Hook', role: 'Возврат', test: 'Завтра воспринимается как продолжение истории.' }
  ], [
    { key: 'stage', label: 'Шаг' },
    { key: 'name', label: 'Элемент петли' },
    { key: 'role', label: 'Роль в продукте' },
    { key: 'test', label: 'Что должно быть доказано' }
  ]);
}

function sanitize(markdown) {
  let text = markdown;
  const replacements = [
    [/AURA MVP Specification v1/g, 'AURA'],
    [/AURA Technical Blueprint v1/g, 'AURA'],
    [/AURA GTM Plan v1/g, 'AURA'],
    [/AURA PRD \/ Sprint Backlog v1/g, 'AURA'],
    [/MVP Specification/gi, 'продуктовая спецификация'],
    [/Technical Blueprint/gi, 'техническая архитектура'],
    [/GTM Plan/gi, 'план запуска'],
    [/PRD \/ Sprint Backlog/gi, 'план разработки'],
    [/Sprint Backlog/gi, 'план спринтов'],
    [/Research Package/gi, 'система решений'],
    [/Research v\d+/gi, 'исследование'],
    [/Version:\s*v\d+/gi, ''],
    [/Версия:\s*v\d+/gi, ''],
    [/\bv\d+\b/g, ''],
    [/\bV1\.5\b/g, 'следующий этап'],
    [/\bV1\b/g, 'первый этап'],
    [/В этом документе/gi, 'В этой книге'],
    [/В данном документе/gi, 'В этой книге'],
    [/В этом отчете/gi, 'В этой главе'],
    [/В данном отчете/gi, 'В этой главе'],
    [/В данном исследовании/gi, 'В этой главе'],
    [/Следующий документ/gi, 'Следующий слой работы'],
    [/Далее в GTM/gi, 'Дальше в запуске'],
    [/Согласно продуктовая спецификация/gi, 'По логике продукта'],
    [/Согласно MVP Specification/gi, 'По логике продукта'],
    [/Документ для дизайнера, разработчика и продакта\./gi, 'AURA должна быть понятна дизайнеру, разработчику и продакту одновременно.'],
    [/Этот документ отвечает не на вопрос/gi, 'Эта глава отвечает не на вопрос'],
    [/Этот документ отвечает на вопрос/gi, 'Эта глава отвечает на вопрос'],
    [/Этот документ переводит/gi, 'Эта часть переводит'],
    [/Он не заменяет финальное ТЗ/gi, 'Этот слой не заменяет финальное ТЗ'],
    [/Его задача -/gi, 'Задача этого слоя -'],
    [/MVP Decision Summary/gi, 'Решение о первом продукте'],
    [/Product Requirement Summary/gi, 'Требования к первому продукту'],
    [/API Specification/gi, 'API и системные контракты'],
    [/Source Notes/gi, 'Источники и допущения'],
    [/Final Technical Decision/gi, 'Итоговое техническое решение'],
    [/Final GTM Decision/gi, 'Итоговое решение по запуску'],
    [/Final PRD Decision/gi, 'Итоговое решение по разработке'],
    [/Final MVP Definition/gi, 'Итоговое определение продукта'],
    [/MVP /g, 'первый продукт '],
    [/ MVP/g, ' первый продукт'],
  ];
  for (const [pattern, replacement] of replacements) {
    text = text.replace(pattern, replacement);
  }
  return text
    .split('\n')
    .filter(line => !/^#\s*AURA\s*$/i.test(line.trim()))
    .join('\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

function bridgeFor(title) {
  const t = title.toLowerCase();
  if (t.includes('market') || t.includes('рын') || t.includes('competitor') || t.includes('конкур')) {
    return 'Здесь важен не сам объем рынка, а вывод для формы продукта: AURA должна занять место между смыслом, действием, памятью и визуальным прогрессом.';
  }
  if (t.includes('screen') || t.includes('journey') || t.includes('user') || t.includes('путь')) {
    return 'Этот фрагмент нужен, чтобы перестать говорить об идее абстрактно и увидеть конкретный путь человека внутри AURA.';
  }
  if (t.includes('api') || t.includes('data') || t.includes('state') || t.includes('architecture') || t.includes('stack')) {
    return 'Технический смысл здесь простой: все сущности должны сохранять причинную цепочку от эпизода до Life Canvas.';
  }
  if (t.includes('unit') || t.includes('cost') || t.includes('economics') || t.includes('стоим')) {
    return 'Экономика нужна не ради таблиц. Она защищает продукт от дорогих решений, которые могут убить запуск раньше, чем появится retention.';
  }
  if (t.includes('gtm') || t.includes('launch') || t.includes('users') || t.includes('канал')) {
    return 'Запуск должен приводить не просто регистрации, а людей, которые проходят петлю и могут объяснить, почему изменился Life Canvas.';
  }
  if (t.includes('sprint') || t.includes('backlog') || t.includes('budget')) {
    return 'План разработки держит команду в границах: сначала доказываем центральную петлю, потом расширяем продукт.';
  }
  return 'Этот блок сохраняет фокус: любая деталь важна только тогда, когда помогает доказать центральную петлю AURA.';
}

function sectionConclusion(title) {
  return [
    '',
    '### Что это значит для AURA',
    '',
    mdTable([
      { field: 'Что мы узнали', value: bridgeFor(title) },
      { field: 'Что это означает', value: 'AURA нельзя оценивать как набор функций. Ее нужно оценивать как систему причинности: человек сделал шаг, система запомнила его и показала видимый след.' },
      { field: 'Какое решение приняли', value: 'Сохраняем этот блок как часть единой логики продукта, но не позволяем ему размыть главный loop.' },
      { field: 'Как это влияет на продукт', value: 'Следующий слой работы должен усиливать Episode -> Action -> Reset -> Reflection -> Life Canvas -> Tomorrow Hook.' }
    ], [
      { key: 'field', label: 'Слой' },
      { key: 'value', label: 'Ответ' }
    ])
  ].join('\n');
}

function reshapeSource(markdown) {
  const clean = sanitize(markdown);
  const chunks = clean.split(/\n(?=##\s+)/g);
  const out = [];
  for (const chunk of chunks) {
    const title = (chunk.match(/^##\s+(.+)$/m) || [null, ''])[1];
    if (!title) {
      out.push(chunk);
      continue;
    }
    out.push('');
    out.push(`**Почему этот блок здесь.** ${bridgeFor(title)}`);
    out.push('');
    out.push(chunk);
    out.push(sectionConclusion(title));
  }
  return out.join('\n').replace(/\n{3,}/g, '\n\n').trim();
}

function chapter(number, title, subtitle, promise) {
  return [
    pageBreak(),
    `# ГЛАВА ${number}`,
    '',
    `# ${title}`,
    '',
    subtitle,
    '',
    '## Зачем нужна эта глава',
    '',
    mdTable([
      { field: 'Что будет разобрано', value: promise.what },
      { field: 'Какой вопрос решает', value: promise.question },
      { field: 'Какой вывод должен сделать читатель', value: promise.takeaway },
      { field: 'Как глава влияет на AURA', value: promise.impact }
    ], [
      { key: 'field', label: 'Слой' },
      { key: 'value', label: 'Смысл' }
    ]),
    '',
    '## Центральная петля остается на экране',
    '',
    visualLoop()
  ].join('\n');
}

function chapterClose(nextStep) {
  return [
    '',
    '## Ключевые выводы главы',
    '',
    mdTable([
      { field: 'Что мы узнали', value: 'Смысл главы сводится к тому, как конкретный слой помогает доказать центральную петлю AURA.' },
      { field: 'Принятые решения', value: 'Не расширять продукт ради полноты. Сохранять только то, что помогает пройти путь от Episode до Tomorrow Hook.' },
      { field: 'Следующий шаг', value: nextStep },
      { field: 'Проверка качества', value: 'После чтения должно быть понятно не только “что написано”, но и “что с этим делать”.' }
    ], [
      { key: 'field', label: 'Итог' },
      { key: 'value', label: 'Смысл для AURA' }
    ])
  ].join('\n');
}

const sources = {
  market: reshapeSource(stripFirstTitle(read('reports/alina-global-hypothesis-report-v1.md'))),
  product: reshapeSource(stripFirstTitle(read('reports/aura-mvp-spec-v1.md'))),
  technology: reshapeSource(stripFirstTitle(read('reports/aura-technical-blueprint-v1.md'))),
  launch: reshapeSource(stripFirstTitle(read('reports/aura-gtm-plan-v1.md'))),
  build: reshapeSource(stripFirstTitle(read('reports/aura-prd-sprint-backlog-v1.md'))),
};

const lines = [];

lines.push('# AURA');
lines.push('');
lines.push('# Product Master Plan');
lines.push('');
lines.push('AURA - это не набор экранов и не генератор красивых образов. Это продуктовая система, где личный контекст превращается в эпизод дня, маленькое действие, короткий reset, reflection и видимый след в Life Canvas.');
lines.push('');
lines.push('Вся логика AURA держится на одной проверке: человек должен понять, что Life Canvas изменился из-за его действия. Если он видит случайную AI-картинку, продукт теряет смысл. Если он видит след собственного шага, появляется новая категория: личный сериал изменений.');
lines.push('');
lines.push('## Главная схема книги');
lines.push('');
lines.push(visualLoop());
lines.push('');
lines.push('## Как читать AURA');
lines.push('');
lines.push(mdTable([
  { time: 'Через 10 минут', outcome: 'Понятно, что такое AURA и почему Life Canvas не должен быть случайной картинкой.' },
  { time: 'Через 30 минут', outcome: 'Понятно, как человек проходит путь от первого эпизода до возвращения завтра.' },
  { time: 'Через 60 минут', outcome: 'Понятно, почему вокруг продукта есть рынок, аудитория и белое пятно.' },
  { time: 'Через 90 минут', outcome: 'Понятно, как строить: архитектура, экономика, запуск, команда и спринты.' }
], [
  { key: 'time', label: 'Горизонт чтения' },
  { key: 'outcome', label: 'Что должно стать ясным' }
]));

lines.push(chapter('1', 'Почему AURA должна существовать', 'Сначала нужно понять не размер рынка ради рынка, а напряжение, из которого рождается продукт.', {
  what: 'Соседние категории, конкуренты, аудитории, деньги, паттерны функций и белое пятно.',
  question: 'Почему AURA имеет право на существование и чем она не является?',
  takeaway: 'AURA не должна копировать одну категорию. Она должна соединить смысл, действие, память и визуальный прогресс.',
  impact: 'Глава задает стратегическую рамку: рынок важен только потому, что помогает выбрать форму продукта.'
}));
lines.push(sources.market);
lines.push(chapterClose('Перейти от рыночной логики к конкретному пути пользователя внутри AURA.'));

lines.push(chapter('2', 'Как работает продукт', 'Идея становится продуктом только тогда, когда можно пройти ее глазами пользователя.', {
  what: 'Путь пользователя, экраны, состояния, функции, API, критерии приемки и границы первого продукта.',
  question: 'Что именно человек видит и делает в первые минуты, дни и недели?',
  takeaway: 'Центр продукта - не экран avatar, а причинная петля от episode к Life Canvas.',
  impact: 'Глава превращает AURA из концепции в систему решений для дизайна и разработки.'
}));
lines.push(sources.product);
lines.push(chapterClose('Нарисовать low-fi wireframes для ключевых экранов и проверить, считывается ли причинность.'));

lines.push(chapter('3', 'Как это собрать и не сломать экономику', 'Технология должна обслуживать продуктовую петлю, а не превращать AURA в дорогую AI-игрушку.', {
  what: 'Frontend, backend, база, storage, AI, image generation, payments, analytics, admin, себестоимость и риски.',
  question: 'Какая архитектура позволит быстро проверить продукт и не сжечь бюджет?',
  takeaway: 'AURA должна быть mobile-first, image-first и analytics-first; бесплатное ежедневное видео запрещено.',
  impact: 'Глава защищает запуск от решений, которые выглядят красиво, но делают продукт экономически нежизнеспособным.'
}));
lines.push(sources.technology);
lines.push(chapterClose('Закрепить стек, провайдеров, cost logging и границы дорогих AI/video функций до начала разработки.'));

lines.push(chapter('4', 'Как найти первых людей', 'Запуск AURA начинается не с рекламы, а с людей, которые способны пройти петлю и объяснить ее своими словами.', {
  what: 'Первые 100 пользователей, первые 1000, positioning, каналы, контент, creators, hooks, objections и kill criteria.',
  question: 'Как получить не шум, а пользователей, которые помогут проверить продукт?',
  takeaway: 'Первые пользователи добываются вручную; масштабирование начинается только после сигналов по петле.',
  impact: 'Глава переводит маркетинг из “купить трафик” в “найти людей для проверки главной гипотезы”.'
}));
lines.push(sources.launch);
lines.push(chapterClose('Собрать первый cohort plan: 20 интервью, 30 concierge users, 100 warm users, затем первые публичные каналы.'));

lines.push(chapter('5', 'Как превратить AURA в работу команды', 'Когда продуктовая логика ясна, команда должна получить последовательный план сборки.', {
  what: 'Спринты, задачи, часы, стоимость, зависимости, Definition of Done и team plan.',
  question: 'Что делать команде по неделям, чтобы дойти до soft launch?',
  takeaway: 'Пять спринтов должны строить не “все приложение”, а доказательство центральной петли.',
  impact: 'Глава превращает стратегию в операционный backlog без потери фокуса.'
}));
lines.push(sources.build);
lines.push(chapterClose('После wireframes начинать первый спринт и держать scope вокруг центральной петли.'));

lines.push(chapter('6', 'Финальное решение', 'AURA готова выйти из режима исследования и перейти в режим прототипа.', {
  what: 'Финальная рамка решений, метрики успеха, kill criteria и следующий шаг.',
  question: 'Что должно произойти дальше, чтобы проект не застрял в документах?',
  takeaway: 'Следующий риск живет внутри прототипа: понимает ли человек, почему изменился Life Canvas.',
  impact: 'Глава закрывает книгу и переводит проект в дизайн, интервью и первую cohort.'
}));
lines.push('');
lines.push('## Карта решений');
lines.push('');
lines.push(mdTable([
  { question: 'Что строим?', decision: 'Мобильный продукт, где день превращается в episode, action, reset, reflection, Life Canvas и tomorrow hook.' },
  { question: 'Что является ядром?', decision: 'Причинность: образ меняется из-за действия.' },
  { question: 'Для кого?', decision: 'Люди, которым уже близки self-care, reflection, habits, future self, AI personalization и визуальная память.' },
  { question: 'Почему может выстрелить?', decision: 'AURA соединяет категории, которые обычно существуют отдельно: смысл, действие, память и visual progress.' },
  { question: 'Почему может провалиться?', decision: 'Если пользователь воспринимает Life Canvas как random AI image.' },
  { question: 'Что проверяем первым?', decision: 'Completed loop, avatar causality, D1 return, D7 completion, paid intent.' },
  { question: 'Что запрещено сейчас?', decision: 'Бесплатное ежедневное видео, marketplace, community, social network, heavy AI friend, AR/metaverse.' },
  { question: 'Следующий шаг', decision: 'Low-fi wireframes, clickable prototype, 20 interviews, 30 concierge users.' }
], [
  { key: 'question', label: 'Вопрос' },
  { key: 'decision', label: 'Решение' }
]));
lines.push('');
lines.push('## Что это значит для AURA');
lines.push('');
lines.push(mdTable([
  { field: 'Что мы узнали', value: 'AURA уже не находится на уровне “а есть ли рынок?”. Проект перешел в фазу проверки пользовательского поведения.' },
  { field: 'Что это означает', value: 'Нельзя продолжать бесконечно расширять анализ. Нужно создавать прототип и смотреть, проходит ли человек центральную петлю.' },
  { field: 'Какое решение приняли', value: 'Следующий слой работы - дизайн ключевых экранов и интервью, а не новый исследовательский том.' },
  { field: 'Как это влияет на продукт', value: 'Каждый экран, prompt, тариф, канал и sprint должен обслуживать одну проверку: Life Canvas changed because I acted.' }
], [
  { key: 'field', label: 'Итог' },
  { key: 'value', label: 'Смысл' }
]));

const finalText = lines.join('\n').trimEnd()
  .replace(/В этом документе/gi, 'В этой книге')
  .replace(/В данном документе/gi, 'В этой книге')
  .replace(/В этом отчете/gi, 'В этой главе')
  .replace(/В данном отчете/gi, 'В этой главе')
  .replace(/MVP Specification/gi, 'продуктовая спецификация')
  .replace(/Technical Blueprint/gi, 'техническая архитектура')
  .replace(/GTM Plan/gi, 'план запуска')
  .replace(/PRD \/ Sprint Backlog/gi, 'план разработки')
  .replace(/\bv\d+\b/g, '')
  .replace(/\bV1\.5\b/g, 'следующий этап')
  .replace(/\bV1\b/g, 'первый этап')
  .replace(/\n{3,}/g, '\n\n');

fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(OUT, `${finalText}\n`);
console.log(`aura_master_book=${OUT}`);
