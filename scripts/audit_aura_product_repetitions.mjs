import fs from 'fs';
import path from 'path';

const ROOT = process.cwd();
const SOURCE = path.join(ROOT, 'reports', 'aura-product-master-plan-final.md');
const OUT = path.join(ROOT, 'reports', 'aura-product-master-plan-repetition-audit.md');

const text = fs.readFileSync(SOURCE, 'utf8');
const lines = text.split('\n');

const ideaDefs = [
  {
    key: 'Life Canvas',
    title: 'Повторяющиеся объяснения Life Canvas',
    pattern: /Life Canvas/i,
    keep: [
      'Вся логика AURA держится на одной проверке: человек должен понять, что Life Canvas изменился из-за его действия.',
      'Центральный visual moment должен показывать не новую картинку, а след действия.',
    ],
    cutRule: 'Оставить сильное определение в Главе 1 и операциональное объяснение в Главе 2. В дальнейших главах заменять длинные объяснения короткой ссылкой: “см. логику Life Canvas в Главе 2”.',
  },
  {
    key: 'Причинность',
    title: 'Повторяющиеся объяснения причинности',
    pattern: /причин|causal|из-за|сделал.*измен|action.*avatar|действие ->/i,
    keep: [
      'Если он видит случайную AI-картинку, продукт теряет смысл. Если он видит след собственного шага, появляется новая категория: личный сериал изменений.',
      'Человек сделал шаг, система запомнила его и показала видимый след.',
    ],
    cutRule: 'Повторять причинность только там, где меняется смысл раздела: продукт, конкуренты, MVP, kill criteria. В остальных местах заменять на короткую ссылку “это проверяет причинность Life Canvas”.',
  },
  {
    key: 'Центральная петля',
    title: 'Повторяющиеся объяснения центральной петли',
    pattern: /Episode|Action|Reset|Reflection|Tomorrow Hook|центральн.*петл|петл|completed loop|смысл -> действие/i,
    keep: [
      'Episode -> Action -> Reset -> Reflection -> Life Canvas -> Tomorrow Hook.',
      'Первый продукт должен проверять не весь возможный продукт, а одну причинную петлю: личный смысл -> маленькое действие -> короткий reset -> видимый прогресс -> причина вернуться завтра.',
    ],
    cutRule: 'Полную схему держать на обложке/Главе 1/начале Главы 2. После этого использовать короткие отсылки “центральная петля” или “completed loop”, если нет новой информации.',
  },
  {
    key: 'Why Not Astrology',
    title: 'Повторяющиеся объяснения why not astrology',
    pattern: /астрол|гороскоп|horoscope|tarot|esoteric/i,
    keep: [
      'Это не гороскоп. Это сценарий маленького шага на сегодня.',
      'Если конкурентное преимущество строить только на avatar или astrology, продукт попадет в занятые категории.',
    ],
    cutRule: 'Оставить objection в позиционировании и kill criteria. В рыночных таблицах оставить категорию как доказательство спроса, но не повторять “не гороскоп” после каждой таблицы.',
  },
  {
    key: 'Why Not Avatar App',
    title: 'Повторяющиеся объяснения why not avatar app',
    pattern: /avatar app|аватар|avatar|AI-картин|AI картин|картинк|декоратив/i,
    keep: [
      'Самое важное в avatar app - не avatar.',
      'Если пользователь говорит “ИИ просто нарисовал новую картинку”, продукт мертв.',
    ],
    cutRule: 'Оставить avatar как ключевую ставку в Главе 2 и конкурентное отличие в Главе 3. В продуктовых таблицах не объяснять каждый раз, что avatar не декоративный, если это уже сказано в заголовке/выводе.',
  },
  {
    key: 'Why Not Habit Tracker',
    title: 'Повторяющиеся объяснения why not habit tracker',
    pattern: /habit tracker|tracker|привыч|streak|productivity|задач/i,
    keep: [
      'Почему habit trackers не дают ощущения истории.',
      'Смысл не остается абстрактной интерпретацией, действие не превращается в тяжелую productivity-систему.',
    ],
    cutRule: 'Оставить контраст с habit tracker в Главе 3 и GTM/hook bank. Убрать повторные объяснения в местах, где уже достаточно слова “не tracker, а life-series”.',
  },
];

function headingAt(lineIndex) {
  for (let i = lineIndex; i >= 0; i -= 1) {
    if (/^#{1,4}\s+/.test(lines[i])) return lines[i].replace(/^#+\s*/, '').trim();
  }
  return 'Без заголовка';
}

function chapterAt(lineIndex) {
  for (let i = lineIndex; i >= 0; i -= 1) {
    if (/^# ГЛАВА /.test(lines[i])) return lines[i].replace(/^#\s*/, '').trim();
  }
  return 'Вступление';
}

function snippet(line) {
  return line
    .replace(/\s+/g, ' ')
    .replace(/^\|/, '')
    .replace(/\|$/, '')
    .trim()
    .slice(0, 220);
}

function occurrences(pattern) {
  return lines
    .map((line, index) => ({ line, index }))
    .filter(({ line }) => pattern.test(line))
    .map(({ line, index }) => ({
      lineNo: index + 1,
      chapter: chapterAt(index),
      section: headingAt(index),
      snippet: snippet(line),
    }));
}

function compactOccurrences(items) {
  const bySection = new Map();
  for (const item of items) {
    const key = `${item.chapter} / ${item.section}`;
    const group = bySection.get(key) ?? [];
    group.push(item);
    bySection.set(key, group);
  }

  const rows = [...bySection.entries()].map(([place, group]) => ({
    place,
    count: group.length,
    lines: group.map(item => item.lineNo).join(', '),
    example: group[0].snippet,
  }));

  return {
    rows,
    visibleRows: rows,
    hiddenCount: 0,
  };
}

function auraBlocks() {
  const blocks = [];
  for (let i = 0; i < lines.length; i += 1) {
    if (lines[i].trim() !== '### Что это значит для AURA' && lines[i].trim() !== '## Что это значит для AURA') continue;
    let end = lines.length;
    for (let j = i + 1; j < lines.length; j += 1) {
      if (/^#{1,3}\s+/.test(lines[j]) && lines[j].trim() !== '### Что это значит для AURA') {
        end = j;
        break;
      }
    }
    const block = lines.slice(i, end).join('\n').trim();
    blocks.push({
      lineNo: i + 1,
      chapter: chapterAt(i),
      section: headingAt(i - 1),
      block,
      hasGenericFormula: /AURA нельзя оценивать как набор функций/.test(block),
      hasLoopFormula: /Episode -> Action -> Reset -> Reflection -> Life Canvas -> Tomorrow Hook/.test(block),
    });
  }
  return blocks;
}

function writeTable(rows, headers) {
  const out = [];
  out.push(`| ${headers.join(' | ')} |`);
  out.push(`| ${headers.map(() => '---').join(' | ')} |`);
  for (const row of rows) {
    out.push(`| ${headers.map(header => String(row[header] ?? '').replace(/\n/g, ' ').replace(/\|/g, '/')).join(' | ')} |`);
  }
  return out.join('\n');
}

const output = [];
output.push('# AURA Product Master Plan Final: аудит повторов');
output.push('');
output.push('Задача аудита - не менять структуру книги, не удалять доказательства и не переписывать главы, а показать, где повторяющиеся объяснения можно сократить на 20-30% без потери выводов.');
output.push('');

output.push('## Executive Summary');
output.push('');
const aura = auraBlocks();
const ideaRows = ideaDefs.map(idea => {
  const count = occurrences(idea.pattern).length;
  return {
    Идея: idea.key,
    Упоминаний: count,
    Риск: count > 80 ? 'Высокий' : count > 35 ? 'Средний' : 'Низкий',
    Решение: idea.cutRule,
  };
});
output.push(writeTable(ideaRows, ['Идея', 'Упоминаний', 'Риск', 'Решение']));
output.push('');
output.push(`Блоков "Что это значит для AURA": ${aura.length}. Из них ${aura.filter(block => block.hasGenericFormula).length} содержат почти одинаковую формулу "AURA нельзя оценивать как набор функций", а ${aura.filter(block => block.hasLoopFormula).length} повторяют полную петлю.`);
output.push('');
output.push('Главный вывод: структура уже работает, но тексту нужна редактура повторов. Самое безопасное сокращение - не трогать рыночные, продуктовые и GTM-данные, а заменить повторные объяснения центральной идеи на короткие ссылки к Главам 1-2.');
output.push('');

for (const idea of ideaDefs) {
  const items = occurrences(idea.pattern);
  const grouped = compactOccurrences(items);
  output.push(`## ${idea.title}`);
  output.push('');
  output.push(`Всего найдено строк: ${items.length}. Уникальных зон документа: ${grouped.rows.length}.`);
  output.push('');
  output.push('### Самая сильная формулировка');
  output.push('');
  for (const line of idea.keep) output.push(`- ${line}`);
  output.push('');
  output.push('### Что можно сократить');
  output.push('');
  output.push(idea.cutRule);
  output.push('');
  output.push('### Все зоны, где идея встречается');
  output.push('');
  output.push(writeTable(grouped.visibleRows.map(row => ({
    Место: row.place,
    Количество: row.count,
    Строки: row.lines,
    Пример: row.example,
  })), ['Место', 'Количество', 'Строки', 'Пример']));
  output.push('');
}

output.push('## Повторяющиеся блоки "Что это значит для AURA"');
output.push('');
output.push(`Всего блоков: ${aura.length}.`);
output.push('');
output.push('### Диагностика');
output.push('');
output.push(writeTable([
  {
    Паттерн: 'Одинаковая причинная формула',
    Количество: aura.filter(block => block.hasGenericFormula).length,
    Что_делать: 'Оставить в конце глав 1, 2, 5 и 8. Внутри мелких подразделов заменить на 1-2 строки, привязанные к конкретному разделу.',
  },
  {
    Паттерн: 'Полная петля Episode -> Action -> Reset...',
    Количество: aura.filter(block => block.hasLoopFormula).length,
    Что_делать: 'Полностью писать только в начале книги и в продуктовой главе. В остальных местах писать “центральная петля AURA”.',
  },
  {
    Паттерн: 'Слишком общий вывод “этот блок сохраняет фокус”',
    Количество: aura.filter(block => /Этот блок сохраняет фокус/.test(block.block)).length,
    Что_делать: 'Заменить на вывод, специфичный для раздела: рынок, аудитория, MVP, GTM, validation.',
  },
], ['Паттерн', 'Количество', 'Что_делать']));
output.push('');
output.push('### Где стоят блоки');
output.push('');
output.push(writeTable(aura.map(block => ({
  Строка: block.lineNo,
  Глава: block.chapter,
  Контекст: block.section,
  Повторяет_общую_формулу: block.hasGenericFormula ? 'да' : 'нет',
  Повторяет_петлю: block.hasLoopFormula ? 'да' : 'нет',
})), ['Строка', 'Глава', 'Контекст', 'Повторяет_общую_формулу', 'Повторяет_петлю']));
output.push('');

output.push('## Конкретный план сокращения на 20-30% без изменения структуры');
output.push('');
output.push(writeTable([
  {
    Шаг: '1',
    Действие: 'Сделать канонические определения в Главе 1-2',
    Эффект: 'Все последующие повторы можно заменять ссылкой на уже установленную логику.',
  },
  {
    Шаг: '2',
    Действие: 'Сократить мелкие “Что это значит для AURA” до 1 специфичного вывода',
    Эффект: 'Снимает главный источник повторов, не удаляя разделы.',
  },
  {
    Шаг: '3',
    Действие: 'В Appendix оставить доказательства, но убрать повторные объяснения “почему avatar причинный” из каждой строки',
    Эффект: 'Сохраняет таблицы, но снижает текстовый шум.',
  },
  {
    Шаг: '4',
    Действие: 'В GTM оставить повтор петли только там, где он становится оффером или CTA',
    Эффект: 'Маркетинговая глава перестает повторять продуктовую главу.',
  },
  {
    Шаг: '5',
    Действие: 'Вместо “why not astrology/avatar/habit tracker” писать короткие labels: not horoscope, not AI toy, not tracker',
    Эффект: 'Сохраняет positioning, но не перегружает каждую главу объяснением.',
  },
], ['Шаг', 'Действие', 'Эффект']));
output.push('');

fs.writeFileSync(OUT, `${output.join('\n').replace(/\n{3,}/g, '\n\n').trimEnd()}\n`);
console.log(`wrote ${OUT}`);
