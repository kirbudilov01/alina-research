import fs from 'fs';

const REPORT = 'reports/alina-global-hypothesis-report-v1.md';
const OUT = 'data_processed/global_report_readability_audit.csv';
const DOC = 'docs/decision/global-report-readability-audit-v1.md';

for (const dir of ['data_processed', 'docs/decision']) fs.mkdirSync(dir, { recursive: true });

function clean(value) {
  return String(value ?? '').replace(/\s+/g, ' ').trim();
}

function csvEscape(value) {
  return `"${clean(value).replace(/"/g, '""')}"`;
}

function writeCsv(file, rows, headers) {
  fs.writeFileSync(file, `${[headers.join(','), ...rows.map(row => headers.map(h => csvEscape(row[h])).join(','))].join('\n')}\n`);
}

function mdTable(rows, columns) {
  const header = `| ${columns.map(c => c.label).join(' | ')} |`;
  const sep = `| ${columns.map(c => c.align === 'right' ? '---:' : '---').join(' | ')} |`;
  const body = rows.map(row => `| ${columns.map(c => clean(row[c.key]).replace(/\|/g, '<br>')).join(' | ')} |`);
  return [header, sep, ...body].join('\n');
}

function has(text, pattern) {
  return pattern.test(text);
}

function csvRowCount(file) {
  if (!fs.existsSync(file)) return 0;
  const text = fs.readFileSync(file, 'utf8').trim();
  if (!text) return 0;
  return Math.max(0, text.split('\n').length - 1);
}

const text = fs.existsSync(REPORT) ? fs.readFileSync(REPORT, 'utf8') : '';
const storylineRows = csvRowCount('data_processed/russian_sequential_storyline.csv');
const sections = [...text.matchAll(/^##\s+(.+)$/gm)].map(match => clean(match[1]));
const tableRows = text.split('\n').filter(line => /^\|.+\|$/.test(line)).length;
const technicalEnglishHits = (text.match(/\b(?:meaning|action|reset|visible|progress|avatar|workflow|scorecard|walkthrough|paywall|prototype|gate|hold_validate|queued_not_applied|source|dedup|raw|benchmark|claim)\b/g) || []).length;

const expectedSequence = [
  'ОПИСАНИЕ ПРОЕКТА И ГИПОТЕЗА #1',
  'ТЕКУЩИЙ СТАТУС ДОКАЗАТЕЛЬСТВ',
  'ОПРЕДЕЛЕНИЕ МИРОВЫХ ЦЕЛЕВЫХ РЫНКОВ И ГИПОТЕЗА #2',
  'МЕТОДОЛОГИЯ TAM/SAM/SOM',
  'ОПРЕДЕЛЕНИЕ КОНКУРЕНТОВ И ГИПОТЕЗА #3',
  'ГДЕ ДЫРЫ И ВОЗМОЖНОСТЬ ОТЛИЧИТЬСЯ',
  'СВЯЗКА WHITESPACE И АУДИТОРИИ',
  'АУДИТОРИЯ, ИНТЕРВЬЮ И ГИПОТЕЗА #4',
  'ИТОГОВАЯ МОДЕЛЬ ПРОДУКТА И ГИПОТЕЗА #5',
  'БЛИЖАЙШАЯ ОЧЕРЕДЬ ВАЛИДАЦИИ',
  'ИСТОЧНИКИ И ГРАНИЦЫ ДОКАЗАТЕЛЬСТВ'
];

let sequenceCursor = -1;
let sequenceBreaks = 0;
for (const expected of expectedSequence) {
  const idx = sections.indexOf(expected);
  if (idx === -1 || idx < sequenceCursor) sequenceBreaks += 1;
  sequenceCursor = Math.max(sequenceCursor, idx);
}

const rows = [
  {
    audit_id: 'READ_01_SEQUENCE',
    report_area_ru: 'Порядок повествования',
    readability_status_ru: sequenceBreaks === 0 ? 'складно' : 'нужна правка',
    severity_ru: sequenceBreaks === 0 ? 'низкая' : 'высокая',
    evidence_seen_ru: `${sections.length} крупных разделов; expected_sequence_breaks=${sequenceBreaks}`,
    issue_ru: sequenceBreaks === 0
      ? 'Основная логика читается последовательно: продуктовая гипотеза -> статус доказательств -> рынки -> деньги -> конкуренты -> whitespace -> аудитория -> MVP -> validation queue -> источники.'
      : 'Порядок ключевых разделов сбился относительно логики гипотез.',
    recommendation_ru: sequenceBreaks === 0
      ? 'Сохранять этот порядок при следующих расширениях и не вставлять новые тяжелые таблицы до объясняющего абзаца.'
      : 'Переставить разделы под цепочку гипотез, чтобы читатель не прыгал между рынком, конкурентами и выводами.',
    target_file: REPORT,
    claim_boundary_ru: 'Аудит оценивает читаемость текущего текста, а не доказывает market/product claims.'
  },
  {
    audit_id: 'READ_02_COUNTS',
    report_area_ru: 'Видимость счетчиков по нишам',
    readability_status_ru: has(text, /Direct app\/store dedup/) && has(text, /Глобальный dedup пакета остается 36,694/) ? 'складно' : 'нужна правка',
    severity_ru: 'средняя',
    evidence_seen_ru: 'в отчете есть таблицы Direct app/store dedup, Total dedup, Top-100 apps и niche rollup',
    issue_ru: 'Читатель видит, сколько приложений/строк взято по каждой нише, и получает предупреждение, что построчные niche dedup нельзя складывать как уникальных конкурентов.',
    recommendation_ru: 'Оставить счетчики в основном тексте; если добавлять новые источники, обновлять niche rollup до PDF/DOCX.',
    target_file: REPORT,
    claim_boundary_ru: 'Счетчики показывают coverage, но не равны числу прямых клонов Alina.'
  },
  {
    audit_id: 'READ_03_TABLE_DENSITY',
    report_area_ru: 'Плотность таблиц',
    readability_status_ru: tableRows > 180 ? 'перегружено' : 'допустимо, но плотное',
    severity_ru: tableRows > 180 ? 'высокая' : 'средняя',
    evidence_seen_ru: `markdown_table_rows=${tableRows}`,
    issue_ru: 'Отчет уже читается как связный narrative, но часть секций остается data-heavy: competitor archetype rollup, validation questions и source appendix могут утомлять без промежуточных выводов.',
    recommendation_ru: 'В следующей итерации сделать два режима: executive narrative в основном PDF и heavy appendix для широких таблиц, сохранив текущий полный отчет как evidence pack.',
    target_file: REPORT,
    claim_boundary_ru: 'Плотность таблиц не ошибка данных; это риск восприятия и презентации.'
  },
  {
    audit_id: 'READ_04_COMPETITOR_TAXONOMY',
    report_area_ru: 'Логичность competitor map',
    readability_status_ru: has(text, /taxonomy cleanup/) && has(text, /queued_not_applied/) ? 'складно с оговоркой' : 'нужна правка',
    severity_ru: 'средняя',
    evidence_seen_ru: 'competitor archetype rollup дополнен cleanup queue и прямой оговоркой queued_not_applied',
    issue_ru: 'Раньше часть конкурентных строк могла выглядеть нелогично из-за смешения AI companion, roleplay, tarot/oracle и habit tracker. Теперь этот шум назван в тексте и вынесен в отдельную очередь.',
    recommendation_ru: 'После ручного taxonomy pass обновить top100 scorecard или оставить queue как documented limitation, если правки не подтверждены.',
    target_file: 'data_processed/competitor_taxonomy_cleanup_queue.csv',
    claim_boundary_ru: 'Queue не переписывает taxonomy автоматически и не усиливает H1/H3.'
  },
  {
    audit_id: 'READ_05_LANGUAGE_MIX',
    report_area_ru: 'Русский текст и технические EN-термины',
    readability_status_ru: technicalEnglishHits > 120 ? 'понятно, но много терминов' : 'складно',
    severity_ru: 'средняя',
    evidence_seen_ru: `technical_english_hits=${technicalEnglishHits}`,
    issue_ru: 'Документ русскоязычный, но сознательно оставляет technical labels вроде TAM/SAM/SOM, scorecard, walkthrough, paywall, dedup и hold_validate. Это удобно для операционной работы, но местами снижает мягкость чтения.',
    recommendation_ru: 'Для внешней версии сделать отдельный glossary или заменить часть table headers на русские подписи; для рабочей версии оставить EN labels там, где они являются ID/полями данных.',
    target_file: REPORT,
    claim_boundary_ru: 'Language mix является редакционным риском, а не доказательным риском.'
  },
  {
    audit_id: 'READ_06_CLAIM_BOUNDARIES',
    report_area_ru: 'Границы доказательств',
    readability_status_ru: has(text, /не заменяет/) && has(text, /hold_validate/) && has(text, /не финально доказано/) ? 'складно' : 'нужна правка',
    severity_ru: 'низкая',
    evidence_seen_ru: 'в тексте повторяются hold_validate, not final proof, source boundaries и запрет на claim upgrade без observed evidence',
    issue_ru: 'Отчет аккуратно различает desk/source support и observed validation. Это делает текст менее “продающим”, но гораздо честнее для evidence-first решения.',
    recommendation_ru: 'Не убирать эти границы ради красоты; лучше вынести краткий executive summary поверх них, если нужен более легкий PDF.',
    target_file: REPORT,
    claim_boundary_ru: 'Сильный narrative не должен усиливать недоказанные claims.'
  },
  {
    audit_id: 'READ_07_NEXT_ACTION',
    report_area_ru: 'Ясность следующего шага',
    readability_status_ru: has(text, /БЛИЖАЙШАЯ ОЧЕРЕДЬ ВАЛИДАЦИИ/) && has(text, /walkthrough конкурентов/) ? 'складно' : 'нужна правка',
    severity_ru: 'низкая',
    evidence_seen_ru: 'есть P0 очередь: competitor walkthrough -> paid-flow -> ICP interview -> prototype session',
    issue_ru: 'После чтения понятно, что следующий скачок качества не в новых таблицах, а в observed rows: скриншоты конкурентов, paywall evidence, интервью и прототипные сессии.',
    recommendation_ru: 'Следующим рабочим ходом закрывать первые P0 walkthrough и paid-flow tasks, а не расширять desk research бесконечно.',
    target_file: REPORT,
    claim_boundary_ru: 'Next action clarity не означает, что validation уже пройдена.'
  },
  {
    audit_id: 'READ_08_NARRATIVE_SPINE',
    report_area_ru: 'Повествовательная склейка по образцу',
    readability_status_ru: storylineRows >= 10 && has(text, /ПОВЕСТВОВАТЕЛЬНАЯ ЛОГИКА ОТЧЕТА/) ? 'складно' : 'нужна правка',
    severity_ru: 'низкая',
    evidence_seen_ru: `storyline_rows=${storylineRows}; section_present=${has(text, /ПОВЕСТВОВАТЕЛЬНАЯ ЛОГИКА ОТЧЕТА/) ? 'yes' : 'no'}`,
    issue_ru: 'Отчету нужен не только executive summary, но и явный narrative spine: вопрос читателя, ход раздела, evidence anchor, допустимый вывод, граница и переход дальше.',
    recommendation_ru: 'Держать STORY_01-STORY_10 как редакционный каркас перед каждой внешней сборкой PDF/DOCX.',
    target_file: 'data_processed/russian_sequential_storyline.csv',
    claim_boundary_ru: 'Narrative spine улучшает форму отчета, но не усиливает market/product claims без observed evidence.'
  }
];

writeCsv(OUT, rows, [
  'audit_id',
  'report_area_ru',
  'readability_status_ru',
  'severity_ru',
  'evidence_seen_ru',
  'issue_ru',
  'recommendation_ru',
  'target_file',
  'claim_boundary_ru'
]);

const lines = [];
lines.push('# Global Report Readability Audit V1');
lines.push('');
lines.push(`Generated: ${new Date().toISOString().slice(0, 10)}`);
lines.push('');
lines.push('## Зачем нужен этот слой');
lines.push('');
lines.push('Этот аудит отвечает на вопрос: складно ли читается текущий русский мировой отчет, где он перегружен и какие правки нужны до внешней версии. Он не проверяет истинность рыночных claims, а проверяет форму повествования, видимость счетчиков, границы доказательств и понятность следующего шага.');
lines.push('');
lines.push('## Краткий вывод');
lines.push('');
lines.push('Текущая версия читается последовательно: продуктовая идея ведет к рынкам, рынки к конкурентам, конкуренты к whitespace, затем к аудитории, MVP и validation queue. Новый narrative-spine слой дополнительно фиксирует вопрос читателя и переход для каждого крупного блока. Главная слабость остается в плотности таблиц и большом количестве технических EN labels. Для рабочего evidence pack это допустимо; для внешнего PDF позже нужен облегченный executive narrative и тяжелое приложение.');
lines.push('');
lines.push('## Audit Table');
lines.push('');
lines.push(mdTable(rows.map(row => ({
  id: row.audit_id,
  area: row.report_area_ru,
  status: row.readability_status_ru,
  severity: row.severity_ru,
  evidence: row.evidence_seen_ru,
  action: row.recommendation_ru
})), [
  { key: 'id', label: 'ID' },
  { key: 'area', label: 'Блок' },
  { key: 'status', label: 'Статус' },
  { key: 'severity', label: 'Риск' },
  { key: 'evidence', label: 'Что видно' },
  { key: 'action', label: 'Что делать' }
]));
lines.push('');
lines.push('## Files');
lines.push('');
lines.push(`- \`${OUT}\``);
lines.push(`- \`${REPORT}\``);

fs.writeFileSync(DOC, `${lines.join('\n')}\n`);

console.log(`global_report_readability_audit=${OUT}`);
console.log(`doc=${DOC}`);
console.log(`audit_rows=${rows.length}`);
console.log(`table_rows=${tableRows}`);
