import fs from 'fs';

const OUT = 'data_processed/global_niche_count_rollup.csv';
const DOC = 'docs/competitive/global-niche-count-rollup-v1.md';

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
  if (!t) return '0%';
  return `${((p / t) * 100).toFixed(1)}%`;
}

function moneyRu(value) {
  return ({
    strong_directional_money_case: 'сильный money proxy',
    medium_directional_money_case: 'средний money proxy',
    benchmark_money_visible_not_direct_tam: 'деньги видны, но это benchmark'
  })[clean(value)] || clean(value);
}

function opportunityRu(value) {
  return ({
    medium_opportunity_needs_sampling: 'возможность есть, нужен ручной sampling',
    crowded_or_unclear_context: 'рынок плотный или контекст неясен',
    mechanic_benchmark_not_primary_market: 'benchmark механик, не primary market'
  })[clean(value)] || clean(value);
}

function normalizeNiche(value) {
  const v = clean(value);
  return v === 'gaming' ? 'gaming_progression' : v;
}

function topGroups(rows, countKey, limit = 4) {
  return rows
    .map(row => ({
      source_group: row.source_group,
      raw: num(row.raw_rows),
      dedup: num(row.dedup_rows),
      coverage: row.coverage_band
    }))
    .sort((a, b) => num(b[countKey]) - num(a[countKey]))
    .slice(0, limit)
    .map(row => `${row.source_group}: raw ${fmt(row.raw)}, dedup ${fmt(row.dedup)}, ${row.coverage}`)
    .join(' | ');
}

const nicheSummary = csv('data_processed/russian_readable_niche_summary.csv');
const coverage = csv('data_processed/cross_source_coverage_matrix.csv');
const sourceScale = csv('data_processed/source_scale_milestone.csv');
const globalRaw = sourceScale.find(row => row.milestone_id === 'RAW_50K_SOURCE_SCALE')?.metric_value || '';
const globalDedup = sourceScale.find(row => row.milestone_id === 'DEDUP_30_40K_BAND')?.metric_value || '';

const rows = nicheSummary.map(row => {
  const marketId = clean(row.market_id);
  const coverageRows = coverage.filter(item => normalizeNiche(item.niche) === marketId);
  const strongCoverage = coverageRows.filter(item => item.coverage_band === 'strong_coverage').length;
  const mediumCoverage = coverageRows.filter(item => item.coverage_band === 'medium_coverage').length;
  const supportCoverage = coverageRows.filter(item => item.coverage_band === 'supporting_coverage').length;
  const sourceGroups = [...new Set(coverageRows.map(item => item.source_group).filter(Boolean))];
  const rawTotal = coverageRows.reduce((sum, item) => sum + num(item.raw_rows), 0);
  const dedupTotal = coverageRows.reduce((sum, item) => sum + num(item.dedup_rows), 0);
  const directDedup = num(row.direct_app_store_dedup_rows);
  const allDedup = num(row.all_source_dedup_rows);
  const totalCrossDedup = num(row.total_cross_source_dedup_rows);
  const directShare = pct(directDedup, allDedup || totalCrossDedup);
  const top100 = num(row.top100_primary_competitors);
  const manualTargets = num(row.manual_validation_targets);

  return {
    market_id: marketId,
    market_ru: row.ru_name,
    role_ru: row.role_ru,
    raw_rows_from_coverage_matrix: fmt(rawTotal),
    dedup_rows_from_coverage_matrix: fmt(dedupTotal),
    all_source_raw_rows: fmt(row.all_source_raw_rows),
    all_source_dedup_rows: fmt(row.all_source_dedup_rows),
    total_cross_source_dedup_rows: fmt(row.total_cross_source_dedup_rows),
    direct_app_store_raw_rows: fmt(row.direct_app_store_raw_rows),
    direct_app_store_dedup_rows: fmt(directDedup),
    direct_app_store_dedup_share: directShare,
    top100_primary_competitors: fmt(top100),
    manual_validation_targets: fmt(manualTargets),
    coverage_groups: fmt(sourceGroups.length),
    strong_coverage_groups: fmt(strongCoverage),
    medium_coverage_groups: fmt(mediumCoverage),
    supporting_coverage_groups: fmt(supportCoverage),
    largest_source_groups: topGroups(coverageRows, 'dedup'),
    money_verdict_ru: moneyRu(row.money_verdict),
    opportunity_ru: opportunityRu(row.opportunity_band),
    what_counts_prove_ru: `Для ${row.ru_name} доказан масштаб source discovery: ${fmt(row.all_source_raw_rows)} raw rows, ${fmt(row.all_source_dedup_rows)} all-source dedup rows и ${fmt(directDedup)} direct app-store dedup rows.`,
    claim_boundary_ru: 'Эти счетчики доказывают масштаб карты рынка и плотность source coverage, но не доказывают PMF, willingness-to-pay или отсутствие hidden full-loop clone без manual walkthrough/interviews.'
  };
});

writeCsv(OUT, rows, [
  'market_id',
  'market_ru',
  'role_ru',
  'raw_rows_from_coverage_matrix',
  'dedup_rows_from_coverage_matrix',
  'all_source_raw_rows',
  'all_source_dedup_rows',
  'total_cross_source_dedup_rows',
  'direct_app_store_raw_rows',
  'direct_app_store_dedup_rows',
  'direct_app_store_dedup_share',
  'top100_primary_competitors',
  'manual_validation_targets',
  'coverage_groups',
  'strong_coverage_groups',
  'medium_coverage_groups',
  'supporting_coverage_groups',
  'largest_source_groups',
  'money_verdict_ru',
  'opportunity_ru',
  'what_counts_prove_ru',
  'claim_boundary_ru'
]);

const totals = rows.reduce((acc, row) => {
  acc.raw += num(row.all_source_raw_rows);
  acc.dedup += num(row.all_source_dedup_rows);
  acc.direct += num(row.direct_app_store_dedup_rows);
  acc.top100 += num(row.top100_primary_competitors);
  acc.manual += num(row.manual_validation_targets);
  return acc;
}, { raw: 0, dedup: 0, direct: 0, top100: 0, manual: 0 });

const lines = [];
lines.push('# Global Niche Count Rollup V1');
lines.push('');
lines.push(`Generated: ${new Date().toISOString()}`);
lines.push('');
lines.push('## Зачем нужен этот слой');
lines.push('');
lines.push('Этот rollup отвечает на простой вопрос: сколько именно источников и приложений взято в каждой из пяти ниш мирового исследования Alina. Он нужен как читательский мост между большим source universe и выводами по рынку, конкурентам, whitespace и validation.');
lines.push('');
lines.push('## Общий счет');
lines.push('');
lines.push(`- Ниш: ${rows.length}`);
lines.push(`- Global raw source rows без повторного сложения ниш: ${fmt(globalRaw)}`);
lines.push(`- Five-niche rollup raw rows без company-positioning lane: ${fmt(totals.raw)}`);
lines.push(`- All-source dedup rows по нишам, суммарно: ${fmt(totals.dedup)}`);
lines.push(`- Global cross-source dedup без повторного сложения ниш: ${fmt(globalDedup)}`);
lines.push(`- Direct app-store dedup rows: ${fmt(totals.direct)}`);
lines.push(`- Top-100 primary competitor placements across niches: ${fmt(totals.top100)}`);
lines.push(`- Manual validation targets: ${fmt(totals.manual)}`);
lines.push('');
lines.push('## Таблица по нишам');
lines.push('');
lines.push(mdTable(rows.map(row => ({
  market: row.market_ru,
  all_raw: row.all_source_raw_rows,
  all_dedup: row.all_source_dedup_rows,
  direct: row.direct_app_store_dedup_rows,
  direct_share: row.direct_app_store_dedup_share,
  top100: row.top100_primary_competitors,
  manual: row.manual_validation_targets,
  coverage: `${row.coverage_groups} groups; strong ${row.strong_coverage_groups}; medium ${row.medium_coverage_groups}`,
  verdict: `${row.money_verdict_ru}; ${row.opportunity_ru}`
})), [
  { key: 'market', label: 'Ниша' },
  { key: 'all_raw', label: 'All raw', align: 'right' },
  { key: 'all_dedup', label: 'All dedup', align: 'right' },
  { key: 'direct', label: 'Direct app dedup', align: 'right' },
  { key: 'direct_share', label: 'Direct share' },
  { key: 'top100', label: 'Top-100', align: 'right' },
  { key: 'manual', label: 'Manual targets', align: 'right' },
  { key: 'coverage', label: 'Coverage' },
  { key: 'verdict', label: 'Как читать' }
]));
lines.push('');
lines.push('## Граница вывода');
lines.push('');
lines.push('Эти числа показывают масштаб и распределение desk/source discovery. Они не означают, что все строки являются уникальными прямыми конкурентами Alina, и не закрывают validation-гейты. Для апгрейда гипотез нужны walkthrough конкурентов, paid-flow/WTP evidence, ICP-интервью и прототипные сессии.');
lines.push('');
lines.push(`Важная арифметическая граница: ${fmt(totals.dedup)} all-source dedup в этом документе - это сумма dedup по пяти нишам. Она может быть выше глобального cross-source dedup ${fmt(globalDedup)}, потому что один источник/продукт может попадать в несколько тематических контекстов. Для общего масштаба пакета использовать ${fmt(globalDedup)}, для сравнения ниш между собой - построчные нишевые счетчики.`);
lines.push('');
lines.push('## Files');
lines.push('');
lines.push(`- \`${OUT}\``);
lines.push('- `data_processed/russian_readable_niche_summary.csv`');
lines.push('- `data_processed/cross_source_coverage_matrix.csv`');

fs.writeFileSync(DOC, `${lines.join('\n')}\n`);

console.log(`global_niche_count_rollup=${OUT}`);
console.log(`doc=${DOC}`);
console.log(`markets=${rows.length}`);
console.log(`all_source_raw=${fmt(totals.raw)}`);
console.log(`all_source_dedup=${fmt(totals.dedup)}`);
