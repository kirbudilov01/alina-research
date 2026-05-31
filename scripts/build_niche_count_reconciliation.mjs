import fs from 'fs';

const OUT = 'data_processed/niche_count_reconciliation.csv';
const DOC = 'docs/competitive/niche-count-reconciliation-v1.md';

for (const dir of ['data_processed', 'docs/competitive']) fs.mkdirSync(dir, { recursive: true });

function clean(value) {
  return String(value ?? '').replace(/\s+/g, ' ').trim();
}

function csvEscape(value) {
  return `"${clean(value).replace(/"/g, '""')}"`;
}

function parseCsv(text) {
  const rows = [];
  let row = [];
  let field = '';
  let quoted = false;
  for (let i = 0; i < text.length; i += 1) {
    const ch = text[i];
    const next = text[i + 1];
    if (quoted) {
      if (ch === '"' && next === '"') {
        field += '"';
        i += 1;
      } else if (ch === '"') {
        quoted = false;
      } else {
        field += ch;
      }
    } else if (ch === '"') {
      quoted = true;
    } else if (ch === ',') {
      row.push(field);
      field = '';
    } else if (ch === '\n') {
      row.push(field);
      rows.push(row);
      row = [];
      field = '';
    } else if (ch !== '\r') {
      field += ch;
    }
  }
  if (field || row.length) {
    row.push(field);
    rows.push(row);
  }
  const header = rows.shift();
  if (!header) return [];
  return rows
    .filter(r => r.some(Boolean))
    .map(r => Object.fromEntries(header.map((h, i) => [h, r[i] ?? ''])));
}

function csv(file) {
  if (!fs.existsSync(file) && file === 'data_processed/cross_source_universe_raw.csv') {
    return csv('data_processed/cross_source_universe_raw_index.csv')
      .flatMap(row => fs.existsSync(row.file_path) ? csv(row.file_path) : []);
  }
  return fs.existsSync(file) ? parseCsv(fs.readFileSync(file, 'utf8')) : [];
}

function writeCsv(file, rows, headers) {
  fs.writeFileSync(file, `${[headers.join(','), ...rows.map(row => headers.map(h => csvEscape(row[h])).join(','))].join('\n')}\n`);
}

function mdTable(rows, columns, limit = rows.length) {
  const limited = rows.slice(0, limit);
  const header = `| ${columns.map(c => c.label).join(' | ')} |`;
  const sep = `| ${columns.map(c => c.align === 'right' ? '---:' : '---').join(' | ')} |`;
  const body = limited.map(row => `| ${columns.map(c => clean(row[c.key]).replace(/\|/g, '/')).join(' | ')} |`);
  return [header, sep, ...body].join('\n');
}

function num(value) {
  const n = Number(String(value ?? '').replace(/[^\d.-]/g, ''));
  return Number.isFinite(n) ? n : 0;
}

function fmt(value) {
  return Math.round(num(value)).toLocaleString('en-US');
}

function pct(value, base) {
  const v = num(value);
  const b = num(base);
  return b ? `${((v / b) * 100).toFixed(1)}%` : 'n/a';
}

const nicheRows = csv('data_processed/global_niche_count_rollup.csv');
const rawRows = csv('data_processed/cross_source_universe_raw.csv');
const globalDedup = csv('data_processed/cross_source_universe_dedup.csv');

const sumAllRaw = nicheRows.reduce((sum, row) => sum + num(row.all_source_raw_rows), 0);
const sumAllDedup = nicheRows.reduce((sum, row) => sum + num(row.all_source_dedup_rows), 0);
const sumCrossSourceDedup = nicheRows.reduce((sum, row) => sum + num(row.total_cross_source_dedup_rows), 0);
const sumDirectDedup = nicheRows.reduce((sum, row) => sum + num(row.direct_app_store_dedup_rows), 0);
const sumTop100 = nicheRows.reduce((sum, row) => sum + num(row.top100_primary_competitors), 0);
const sumManualTargets = nicheRows.reduce((sum, row) => sum + num(row.manual_validation_targets), 0);

const rows = [
  {
    row_id: 'COUNT_01_GLOBAL_RAW',
    layer_ru: 'Глобальный пакет',
    market_ru: 'Все рынки',
    count_type_ru: 'raw source rows',
    count_value: rawRows.length,
    share_of_global_dedup: '',
    plain_meaning_ru: 'Все собранные строки до глобальной дедупликации: app/store listings, source rows, benchmarks, forum/context rows и другие discovery-строки.',
    what_it_can_prove_ru: 'Показывает масштаб сбора и ширину карты источников.',
    what_it_cannot_prove_ru: 'Не доказывает количество уникальных приложений, спрос, WTP или отсутствие конкурента.',
    reconciliation_note_ru: 'Raw rows всегда больше или иначе устроены, чем dedup rows; их нельзя читать как число приложений.'
  },
  {
    row_id: 'COUNT_02_GLOBAL_DEDUP',
    layer_ru: 'Глобальный пакет',
    market_ru: 'Все рынки',
    count_type_ru: 'global dedup rows',
    count_value: globalDedup.length,
    share_of_global_dedup: '100.0%',
    plain_meaning_ru: 'Уникализированные строки всего пакета после глобальной дедупликации.',
    what_it_can_prove_ru: 'Показывает общий размер dedup-карты, на которую опирается исследование.',
    what_it_cannot_prove_ru: 'Не равно сумме нишевых dedup, потому что один продукт может относиться к нескольким направлениям.',
    reconciliation_note_ru: `Глобальный dedup сейчас ${fmt(globalDedup.length)}, а сумма нишевых all-source dedup ${fmt(sumAllDedup)}; разница объясняется пересечениями и разными scope.`
  },
  {
    row_id: 'COUNT_03_NICHE_DEDUP_SUM',
    layer_ru: 'Сумма по нишам',
    market_ru: 'Пять направлений',
    count_type_ru: 'sum of all-source niche dedup rows',
    count_value: sumAllDedup,
    share_of_global_dedup: pct(sumAllDedup, globalDedup.length),
    plain_meaning_ru: 'Сумма dedup-строк внутри каждой ниши, если читать рынки как тематические корзины.',
    what_it_can_prove_ru: 'Показывает, насколько широким получился coverage внутри пяти направлений.',
    what_it_cannot_prove_ru: 'Не является числом уникальных приложений во всем пакете.',
    reconciliation_note_ru: 'Это тематическая сумма, а не глобальная уникальность: пересекающиеся продукты могут встречаться в нескольких корзинах.'
  },
  {
    row_id: 'COUNT_04_DIRECT_APP_SUM',
    layer_ru: 'Сумма по нишам',
    market_ru: 'Пять направлений',
    count_type_ru: 'sum of direct app-store dedup rows by niche',
    count_value: sumDirectDedup,
    share_of_global_dedup: pct(sumDirectDedup, globalDedup.length),
    plain_meaning_ru: 'Ближнее consumer-app поле: App Store / Google Play / похожие app-store rows после нишевой дедупликации.',
    what_it_can_prove_ru: 'Лучше всего отвечает на вопрос “сколько близких приложений видно в каждой нише”.',
    what_it_cannot_prove_ru: 'Не доказывает, что все эти приложения являются прямыми клонами Alina.',
    reconciliation_note_ru: 'Это более близкий к конкурентному анализу слой, чем all-source dedup, но он тоже тематический и требует ручного sampling.'
  },
  {
    row_id: 'COUNT_05_TOP100_REVIEW',
    layer_ru: 'Review layer',
    market_ru: 'Пять направлений',
    count_type_ru: 'top100 primary competitors',
    count_value: sumTop100,
    share_of_global_dedup: pct(sumTop100, globalDedup.length),
    plain_meaning_ru: 'Кандидаты, вынесенные в более внимательный scorecard/review слой.',
    what_it_can_prove_ru: 'Показывает, какие строки уже приоритизированы для конкурентной оценки.',
    what_it_cannot_prove_ru: 'Не заменяет реальный app walkthrough и не закрывает H1/H3.',
    reconciliation_note_ru: `Top-100 layer сейчас суммарно ${fmt(sumTop100)} строк по нишам; manual targets еще уже: ${fmt(sumManualTargets)}.`
  },
  ...nicheRows.map((row, idx) => ({
    row_id: `COUNT_NICHE_${String(idx + 1).padStart(2, '0')}`,
    layer_ru: 'Ниша',
    market_ru: row.market_ru,
    count_type_ru: 'niche count stack',
    count_value: row.all_source_dedup_rows,
    share_of_global_dedup: pct(row.all_source_dedup_rows, globalDedup.length),
    plain_meaning_ru: `В ${row.market_ru}: raw=${fmt(row.all_source_raw_rows)}, all-source dedup=${fmt(row.all_source_dedup_rows)}, cross-source total dedup=${fmt(row.total_cross_source_dedup_rows)}, direct app-store dedup=${fmt(row.direct_app_store_dedup_rows)}, top100=${fmt(row.top100_primary_competitors)}, manual targets=${fmt(row.manual_validation_targets)}.`,
    what_it_can_prove_ru: row.what_counts_prove_ru,
    what_it_cannot_prove_ru: row.claim_boundary_ru,
    reconciliation_note_ru: row.market_id === 'gaming_progression'
      ? 'Gaming/progression читается как benchmark mechanics, не как прямой рынок Alina.'
      : 'Для этой ниши direct app-store dedup является самым понятным счетчиком близкого consumer-app поля, но claim upgrade требует manual walkthrough.'
  }))
];

writeCsv(OUT, rows, [
  'row_id',
  'layer_ru',
  'market_ru',
  'count_type_ru',
  'count_value',
  'share_of_global_dedup',
  'plain_meaning_ru',
  'what_it_can_prove_ru',
  'what_it_cannot_prove_ru',
  'reconciliation_note_ru'
]);

const lines = [];
lines.push('# Niche Count Reconciliation V1');
lines.push('');
lines.push(`Generated: ${new Date().toISOString().slice(0, 10)}`);
lines.push('');
lines.push('## Зачем нужен этот слой');
lines.push('');
lines.push('Этот слой объясняет, как читать счетчики по пяти направлениям Alina. Он нужен, чтобы не путать raw source rows, global dedup, all-source niche dedup, direct app-store dedup, top100 review и manual targets. Главная идея простая: большие числа показывают coverage, а не доказанный спрос и не количество прямых клонов.');
lines.push('');
lines.push('## Главная сверка');
lines.push('');
lines.push(`Глобальный dedup пакета сейчас равен ${fmt(globalDedup.length)}. Сумма all-source niche dedup равна ${fmt(sumAllDedup)}, а сумма direct app-store dedup по нишам равна ${fmt(sumDirectDedup)}. Эти числа не обязаны совпадать: ниши являются тематическими корзинами, и один продукт может попадать в несколько контекстов. Поэтому для текста отчета нужно писать не “у нас столько уникальных приложений в мире”, а “у нас такой объем source coverage и такой ближний direct app-store слой по каждой нише”.`);
lines.push('');
lines.push('## Reconciliation Table');
lines.push('');
lines.push(mdTable(rows, [
  { key: 'row_id', label: 'ID' },
  { key: 'layer_ru', label: 'Слой' },
  { key: 'market_ru', label: 'Рынок' },
  { key: 'count_type_ru', label: 'Тип числа' },
  { key: 'count_value', label: 'Значение', align: 'right' },
  { key: 'share_of_global_dedup', label: 'Доля от global dedup' },
  { key: 'plain_meaning_ru', label: 'Простое значение' },
  { key: 'reconciliation_note_ru', label: 'Как сверять' }
]));
lines.push('');
lines.push('## Правило для отчета');
lines.push('');
lines.push('1. Для масштаба пакета использовать global raw и global dedup.');
lines.push('2. Для ответа “сколько данных по нише” использовать raw/all-source dedup/direct app-store dedup вместе.');
lines.push('3. Для близких consumer-app конкурентов смотреть direct app-store dedup и top100/manual targets.');
lines.push('4. Для claims H1/H3 не использовать счетчики как proof: нужен manual walkthrough.');
lines.push('5. Для H2 не использовать счетчики как revenue proof: нужны paid-flow/WTP и prototype paid-depth signals.');
lines.push('');
lines.push('## Files');
lines.push('');
lines.push(`- \`${OUT}\``);
lines.push('- `data_processed/global_niche_count_rollup.csv`');
lines.push('- `data_processed/cross_source_universe_dedup.csv`');

fs.writeFileSync(DOC, `${lines.join('\n')}\n`);

console.log(`niche_count_reconciliation=${OUT}`);
console.log(`doc=${DOC}`);
console.log(`rows=${rows.length}`);
console.log(`global_dedup=${globalDedup.length}`);
console.log(`sum_niche_dedup=${sumAllDedup}`);
console.log(`sum_direct_app_dedup=${sumDirectDedup}`);
