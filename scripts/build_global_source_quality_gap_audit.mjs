import fs from 'fs';

const OUT = 'data_processed/global_source_quality_gap_audit.csv';
const DOC = 'docs/competitive/global-source-quality-gap-audit-v1.md';

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
  return fs.existsSync(file) ? parseCsv(fs.readFileSync(file, 'utf8')) : [];
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

function num(value) {
  const n = Number(String(value ?? '').replace(/[^\d.-]/g, ''));
  return Number.isFinite(n) ? n : 0;
}

function fmt(value) {
  return Math.round(num(value)).toLocaleString('en-US');
}

function pct(part, total) {
  const p = num(part);
  const t = num(total);
  if (!t) return '0.0%';
  return `${((p / t) * 100).toFixed(1)}%`;
}

function normalizeMarket(id) {
  return id === 'gaming_progression' ? 'gaming' : id;
}

function includesMarket(markets, market) {
  const normalized = normalizeMarket(market);
  if (clean(markets) === 'all') return true;
  return clean(markets).split('|').map(normalizeMarket).includes(normalized);
}

function topItems(items, limit = 4) {
  return items.slice(0, limit).join(' | ');
}

function riskRead({ directDedup, benchmarkDedup, medium, supporting, totalDedup }) {
  const directShare = totalDedup ? directDedup / totalDedup : 0;
  const benchmarkShare = totalDedup ? benchmarkDedup / totalDedup : 0;
  if (directShare < 0.25 && benchmarkShare > 0.55) return 'coverage сильный по масштабу, но сильно benchmark/mechanics-heavy';
  if (medium + supporting >= 4) return 'есть несколько medium/supporting source cells; нужен selective source-native добор';
  if (directShare >= 0.45) return 'direct consumer-app coverage достаточно заметный для desk map';
  return 'coverage пригоден для directionality, но требует ручного sampling перед claim upgrade';
}

function nextLane(backlogRows, market) {
  const rows = backlogRows
    .filter(row => includesMarket(row.markets, market))
    .sort((a, b) => {
      const order = { P0: 0, P1: 1, P2: 2 };
      return (order[a.priority] ?? 9) - (order[b.priority] ?? 9);
    })
    .slice(0, 3);
  return rows.map(row => `${row.priority} ${row.source_bucket}`).join(' | ');
}

const coverage = csv('data_processed/cross_source_coverage_matrix.csv');
const nicheRollup = csv('data_processed/global_niche_count_rollup.csv');
const backlog = csv('data_processed/source_expansion_backlog.csv');
const sourceScale = csv('data_processed/source_scale_milestone.csv');

const directGroups = new Set(['mobile_app_store', 'google_play_or_android', 'desktop_store', 'browser_extension']);
const benchmarkGroups = new Set(['steam_pc', 'itch_web_game']);
const vocGroups = new Set(['reddit_mentions', 'forum_quote']);

const rows = nicheRollup.map(niche => {
  const market = normalizeMarket(niche.market_id);
  const cells = coverage.filter(row => normalizeMarket(row.niche) === market);
  const directCells = cells.filter(row => directGroups.has(row.source_group));
  const benchmarkCells = cells.filter(row => benchmarkGroups.has(row.source_group));
  const vocCells = cells.filter(row => vocGroups.has(row.source_group));
  const directDedup = directCells.reduce((sum, row) => sum + num(row.dedup_rows), 0);
  const benchmarkDedup = benchmarkCells.reduce((sum, row) => sum + num(row.dedup_rows), 0);
  const vocDedup = vocCells.reduce((sum, row) => sum + num(row.dedup_rows), 0);
  const totalDedup = cells.reduce((sum, row) => sum + num(row.dedup_rows), 0);
  const strong = cells.filter(row => row.coverage_band === 'strong_coverage').length;
  const medium = cells.filter(row => row.coverage_band === 'medium_coverage').length;
  const supporting = cells.filter(row => row.coverage_band === 'supporting_coverage').length;
  const topSourceCells = cells
    .slice()
    .sort((a, b) => num(b.dedup_rows) - num(a.dedup_rows))
    .slice(0, 4)
    .map(row => `${row.source_group}:${fmt(row.dedup_rows)} ${row.coverage_band}`);
  const p0Lanes = backlog.filter(row => row.priority === 'P0' && includesMarket(row.markets, market)).length;

  return {
    market_id: niche.market_id,
    market_ru: niche.market_ru,
    total_dedup_from_coverage_cells: fmt(totalDedup),
    direct_consumer_app_dedup: fmt(directDedup),
    direct_share_of_coverage: pct(directDedup, totalDedup),
    benchmark_mechanics_dedup: fmt(benchmarkDedup),
    benchmark_share_of_coverage: pct(benchmarkDedup, totalDedup),
    voc_context_dedup: fmt(vocDedup),
    strong_coverage_cells: fmt(strong),
    medium_coverage_cells: fmt(medium),
    supporting_coverage_cells: fmt(supporting),
    p0_expansion_lanes: fmt(p0Lanes),
    strongest_source_cells: topItems(topSourceCells),
    quality_read_ru: riskRead({ directDedup, benchmarkDedup, medium, supporting, totalDedup }),
    next_source_lanes_ru: nextLane(backlog, market),
    claim_boundary_ru: 'Source quality audit показывает, где coverage достаточно сильный для desk map, но не заменяет manual walkthrough/interviews/WTP proof.'
  };
});

writeCsv(OUT, rows, [
  'market_id',
  'market_ru',
  'total_dedup_from_coverage_cells',
  'direct_consumer_app_dedup',
  'direct_share_of_coverage',
  'benchmark_mechanics_dedup',
  'benchmark_share_of_coverage',
  'voc_context_dedup',
  'strong_coverage_cells',
  'medium_coverage_cells',
  'supporting_coverage_cells',
  'p0_expansion_lanes',
  'strongest_source_cells',
  'quality_read_ru',
  'next_source_lanes_ru',
  'claim_boundary_ru'
]);

const raw50 = sourceScale.find(row => row.milestone_id === 'RAW_50K_SOURCE_SCALE') || {};
const dedup50 = sourceScale.find(row => row.milestone_id === 'DEDUP_50K_UPPER_ASPIRATION') || {};

const lines = [];
lines.push('# Global Source Quality Gap Audit V1');
lines.push('');
lines.push(`Generated: ${new Date().toISOString().slice(0, 10)}`);
lines.push('');
lines.push('## Зачем нужен этот слой');
lines.push('');
lines.push('Этот аудит отвечает на вопрос: где source base по пяти рынкам уже достаточно сильный для desk map, а где следующий добор должен идти source-native/direct lanes без тяжелого поискового crawl. Он отделяет масштаб базы от качества claim.');
lines.push('');
lines.push('## Scale Boundary');
lines.push('');
lines.push(`- Raw source scale: ${raw50.metric_value || 'n/a'} rows; status=${raw50.status || 'n/a'}`);
lines.push(`- Dedup 50k aspiration: ${dedup50.metric_value || 'n/a'} rows; status=${dedup50.status || 'n/a'}`);
lines.push('');
lines.push('## Market Source Quality');
lines.push('');
lines.push(mdTable(rows.map(row => ({
  market: row.market_ru,
  direct: row.direct_consumer_app_dedup,
  directShare: row.direct_share_of_coverage,
  benchmark: row.benchmark_mechanics_dedup,
  cells: `${row.strong_coverage_cells}/${row.medium_coverage_cells}/${row.supporting_coverage_cells}`,
  quality: row.quality_read_ru,
  next: row.next_source_lanes_ru
})), [
  { key: 'market', label: 'Рынок' },
  { key: 'direct', label: 'Direct dedup', align: 'right' },
  { key: 'directShare', label: 'Direct share', align: 'right' },
  { key: 'benchmark', label: 'Benchmark dedup', align: 'right' },
  { key: 'cells', label: 'Strong/Med/Sup' },
  { key: 'quality', label: 'Как читать' },
  { key: 'next', label: 'Следующие lanes' }
]));
lines.push('');
lines.push('## Reading Rule');
lines.push('');
lines.push('Direct consumer-app coverage ближе к конкурентным claims. Steam/itch полезны как mechanics/benchmark, но не должны автоматически усиливать прямой TAM или H1/H3. Reddit/forum дают язык боли и alternatives, но требуют manual reading. Следующий source growth лучше делать через конкретные source-native lanes из backlog, а не через широкий поисковый crawl.');
lines.push('');
lines.push('## Files');
lines.push('');
lines.push(`- \`${OUT}\``);
lines.push('- `data_processed/cross_source_coverage_matrix.csv`');
lines.push('- `data_processed/source_expansion_backlog.csv`');

fs.writeFileSync(DOC, `${lines.join('\n')}\n`);

console.log(`global_source_quality_gap_audit=${OUT}`);
console.log(`doc=${DOC}`);
console.log(`rows=${rows.length}`);
