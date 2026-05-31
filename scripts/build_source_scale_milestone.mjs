import fs from 'fs';

const OUT = 'data_processed/source_scale_milestone.csv';
const OUT_DOC = 'docs/competitive/source-scale-milestone-v1.md';

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
  const [headers, ...body] = rows;
  if (!headers) return [];
  return body.filter(r => r.some(Boolean)).map(r => Object.fromEntries(headers.map((h, i) => [h, r[i] ?? ''])));
}

function csv(file) {
  if (!fs.existsSync(file) && file === 'data_processed/cross_source_universe_raw.csv') {
    return csv('data_processed/cross_source_universe_raw_index.csv')
      .flatMap(row => fs.existsSync(row.file_path) ? csv(row.file_path) : []);
  }
  return fs.existsSync(file) ? parseCsv(fs.readFileSync(file, 'utf8')) : [];
}

function writeCsv(file, rows, headers) {
  fs.writeFileSync(file, [headers.join(','), ...rows.map(row => headers.map(h => csvEscape(row[h])).join(','))].join('\n'));
}

function mdTable(rows, columns) {
  const header = `| ${columns.map(c => c.label).join(' | ')} |`;
  const sep = `| ${columns.map(c => c.align === 'right' ? '---:' : '---').join(' | ')} |`;
  const body = rows.map(row => `| ${columns.map(c => clean(row[c.key]).replace(/\|/g, '/')).join(' | ')} |`);
  return [header, sep, ...body].join('\n');
}

function fmt(value) {
  return Number(value || 0).toLocaleString('en-US');
}

const rawRows = csv('data_processed/cross_source_universe_raw.csv');
const dedupRows = csv('data_processed/cross_source_universe_dedup.csv');
const summary = csv('data_processed/cross_source_universe_summary.csv');
const coverage = csv('data_processed/cross_source_coverage_matrix.csv');
const backlog = csv('data_processed/source_expansion_backlog.csv');

const rawCount = rawRows.length;
const dedupCount = dedupRows.length;
const strongCoverage = coverage.filter(row => row.coverage_band === 'strong_coverage').length;
const mediumCoverage = coverage.filter(row => row.coverage_band === 'medium_coverage').length;
const dedup50Gap = Math.max(0, 50000 - dedupCount);

const rows = [
  {
    milestone_id: 'RAW_50K_SOURCE_SCALE',
    status: rawCount >= 50000 ? 'proved' : 'open',
    metric_value: rawCount,
    threshold_read: '>= 50000 raw normalized source rows',
    decision_ru: rawCount >= 50000
      ? `Raw cross-source universe уже прошел 50k: ${fmt(rawCount)} строк. Это закрывает масштаб discovery/source-map, но не означает ${fmt(rawCount)} уникальных прямых конкурентов.`
      : `Raw cross-source universe пока ниже 50k: ${fmt(rawCount)} строк.`,
    boundary_ru: 'Raw rows сохраняют повторы по источникам, странам, запросам, тегам и форумным упоминаниям; это слой покрытия, а не dedup competitor proof.',
    evidence_files: 'data_processed/cross_source_universe_raw_index.csv;data_processed/cross_source_universe_raw_parts/part_*.csv;docs/competitive/cross-source-universe-v1.md'
  },
  {
    milestone_id: 'DEDUP_30K_LOWER_BOUND',
    status: dedupCount >= 30000 ? 'proved' : 'open',
    metric_value: dedupCount,
    threshold_read: '>= 30000 dedup competitor/source rows',
    decision_ru: dedupCount >= 30000
      ? `Dedup cross-source universe закрыл нижнюю границу 30k: ${fmt(dedupCount)} строк.`
      : `Dedup cross-source universe пока ниже 30k: ${fmt(dedupCount)} строк.`,
    boundary_ru: 'Dedup снижает дубли, но часть строк остается benchmark/context evidence, особенно Steam/itch/gaming mechanics и Reddit mentions.',
    evidence_files: 'data_processed/cross_source_universe_dedup.csv;data_processed/cross_source_universe_summary.csv;docs/competitive/cross-source-universe-v1.md'
  },
  {
    milestone_id: 'DEDUP_30_40K_BAND',
    status: dedupCount >= 30000 && dedupCount < 40000 ? 'proved_inside_band' : (dedupCount >= 40000 ? 'exceeded' : 'open'),
    metric_value: dedupCount,
    threshold_read: '30000-40000 dedup competitor/source rows',
    decision_ru: dedupCount >= 30000 && dedupCount < 40000
      ? `Dedup universe сейчас находится внутри рабочей зоны 30k-40k: ${fmt(dedupCount)} строк.`
      : (dedupCount >= 40000 ? `Dedup universe уже выше 40k: ${fmt(dedupCount)} строк.` : `Dedup universe пока не дошел до 30k-40k зоны: ${fmt(dedupCount)} строк.`),
    boundary_ru: 'Это достаточный масштаб для картирования соседних рынков, но не финальный validation proof по H1-H6.',
    evidence_files: 'data_processed/cross_source_universe_dedup.csv;data_processed/cross_source_coverage_matrix.csv;docs/competitive/cross-source-coverage-matrix-v1.md'
  },
  {
    milestone_id: 'DEDUP_50K_UPPER_ASPIRATION',
    status: dedupCount >= 50000 ? 'proved' : 'open',
    metric_value: dedupCount,
    threshold_read: '>= 50000 dedup competitor/source rows',
    decision_ru: dedupCount >= 50000
      ? `Dedup 50k aspiration закрыт: ${fmt(dedupCount)} строк.`
      : `Dedup 50k aspiration еще открыт: ${fmt(dedupCount)} строк, gap ${fmt(dedup50Gap)} строк.`,
    boundary_ru: 'Нельзя писать, что 50k уникальных/dedup конкурентов уже доказаны; доказаны raw 50k и dedup 30k+.',
    evidence_files: 'data_processed/cross_source_universe_dedup.csv;data_processed/source_expansion_backlog.csv;docs/competitive/source-expansion-backlog-v1.md'
  },
  {
    milestone_id: 'SOURCE_QUALITY_BOUNDARY',
    status: 'explicit',
    metric_value: `${summary.length} summary rows; ${coverage.length} coverage cells; ${strongCoverage} strong; ${mediumCoverage} medium`,
    threshold_read: 'quality boundary stated',
    decision_ru: 'Масштаб источников полезен для discovery, saturation и поиска белого пятна, но качество claim зависит от типа источника.',
    boundary_ru: 'App Store/Google Play/desktop/web extensions ближе к конкурентам; Steam/itch часто benchmark/mechanic; Reddit/forum чаще VOC/context до manual read.',
    evidence_files: 'data_processed/cross_source_universe_summary.csv;data_processed/cross_source_coverage_matrix.csv;data_processed/reddit_manual_reading_capture_sheet.csv'
  },
  {
    milestone_id: 'NEXT_SOURCE_LANES',
    status: 'prioritized',
    metric_value: `${backlog.length} backlog lanes`,
    threshold_read: 'non-search-heavy next expansion lanes',
    decision_ru: 'Следующий рост лучше делать не через широкие поисковики, а через source-native/direct lanes: B2B directories, company positioning pages, дополнительные desktop/browser stores, curated Product Hunt/AlternativeTo exports если доступны без Cloudflare-блокировки.',
    boundary_ru: 'Product Hunt и AlternativeTo direct/sitemap попытки ранее уперлись в Cloudflare 403; этот факт не надо обходить тяжелым search-engine crawl без отдельного решения.',
    evidence_files: 'data_processed/source_expansion_backlog.csv;docs/competitive/source-expansion-backlog-v1.md'
  }
];

writeCsv(OUT, rows, [
  'milestone_id', 'status', 'metric_value', 'threshold_read',
  'decision_ru', 'boundary_ru', 'evidence_files'
]);

const lines = [];
lines.push('# Source Scale Milestone V1');
lines.push('');
lines.push(`Generated: ${new Date().toISOString()}`);
lines.push('');
lines.push('## Purpose');
lines.push('');
lines.push('This artifact separates source-scale proof from validation proof. It makes the current scale claim precise: raw 50k is proved, dedup 30k+ and the 30k-40k working band are proved, while dedup 50k remains an open upper aspiration.');
lines.push('');
lines.push('## Milestones');
lines.push('');
lines.push(mdTable(rows, [
  { key: 'milestone_id', label: 'Milestone' },
  { key: 'status', label: 'Status' },
  { key: 'metric_value', label: 'Metric', align: 'right' },
  { key: 'threshold_read', label: 'Threshold' },
  { key: 'decision_ru', label: 'Decision RU' },
  { key: 'boundary_ru', label: 'Boundary RU' }
]));
lines.push('');
lines.push('## Reading Rule');
lines.push('');
lines.push('- It is fair to say the research has passed raw 50k source scale and dedup 30k+ competitor/source scale.');
lines.push('- It is not fair to say the research has already proved 50k dedup unique competitors.');
lines.push('- Scale does not close H1-H6: manual competitor walkthrough, paid-flow signoff, ICP interviews, and prototype sessions remain required.');
lines.push('');
lines.push('## Files');
lines.push('');
lines.push(`- \`${OUT}\``);

fs.writeFileSync(OUT_DOC, `${lines.join('\n')}\n`);

console.log(`source_scale_milestone=${OUT}`);
console.log(`doc=${OUT_DOC}`);
console.log(`raw_rows=${rawCount}`);
console.log(`dedup_rows=${dedupCount}`);
console.log(`dedup_50k_gap=${dedup50Gap}`);
