import fs from 'fs';

const OUT = 'data_processed/cross_source_coverage_matrix.csv';
const OUT_DOC = 'docs/competitive/cross-source-coverage-matrix-v1.md';

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
  return body
    .filter(r => r.some(Boolean))
    .map(r => Object.fromEntries(headers.map((h, i) => [h, r[i] ?? ''])));
}

function csv(file) {
  if (!fs.existsSync(file) && file === 'data_processed/cross_source_universe_raw.csv') {
    return csvShards('data_processed/cross_source_universe_raw_index.csv');
  }
  return fs.existsSync(file) ? parseCsv(fs.readFileSync(file, 'utf8')) : [];
}

function csvShards(indexFile) {
  if (!fs.existsSync(indexFile)) return [];
  return parseCsv(fs.readFileSync(indexFile, 'utf8'))
    .flatMap(row => fs.existsSync(row.file_path) ? parseCsv(fs.readFileSync(row.file_path, 'utf8')) : []);
}

function writeCsv(file, rows, headers) {
  fs.writeFileSync(file, [headers.join(','), ...rows.map(row => headers.map(h => csvEscape(row[h])).join(','))].join('\n'));
}

function countBy(rows, key) {
  const out = {};
  for (const row of rows) out[row[key] || 'unknown'] = (out[row[key] || 'unknown'] || 0) + 1;
  return out;
}

function mdTable(rows, columns, limit = rows.length) {
  const slice = rows.slice(0, limit);
  const header = `| ${columns.map(c => c.label).join(' | ')} |`;
  const sep = `| ${columns.map(c => c.align === 'right' ? '---:' : '---').join(' | ')} |`;
  const body = slice.map(row => `| ${columns.map(c => clean(row[c.key]).replace(/\|/g, '<br>')).join(' | ')} |`);
  return [header, sep, ...body].join('\n');
}

function pct(n, d) {
  if (!d) return '0.0';
  return ((n / d) * 100).toFixed(1);
}

function marketRole(sourceGroup, niche) {
  if (sourceGroup === 'mobile_app_store') return 'direct_consumer_app_competitor_base';
  if (sourceGroup === 'google_play_or_android') return 'android_cross_check_and_pricing_path';
  if (sourceGroup === 'desktop_store') return 'desktop_web_productivity_and_wellness_discovery';
  if (sourceGroup === 'browser_extension') return 'browser_mechanic_reference';
  if (sourceGroup === 'steam_pc') return 'pc_progression_and_mechanic_benchmark';
  if (sourceGroup === 'itch_web_game') return 'indie_mechanic_and_experiment_discovery';
  if (sourceGroup === 'duckduckgo_search') return 'legacy_smoke_discovery_low_weight';
  if (niche === 'gaming_progression') return 'progression_benchmark';
  return 'supporting_discovery';
}

function evidenceBand(row) {
  const dedupRows = Number(row.dedup_rows || 0);
  const okRate = Number(row.ok_rate_pct || 0);
  const urlRate = Number(row.url_coverage_pct || 0);
  const highRate = Number(row.high_or_medium_quality_pct || 0);
  if (dedupRows >= 1000 && okRate >= 90 && urlRate >= 90 && highRate >= 80) return 'strong_coverage';
  if (dedupRows >= 250 && okRate >= 80 && urlRate >= 80) return 'medium_coverage';
  if (dedupRows >= 50) return 'thin_but_usable';
  return 'weak_or_context_only';
}

function nextAction(row) {
  if (row.coverage_band === 'strong_coverage') return 'Use for market saturation, competitor discovery, and source-triangulation; sample manually before final claims.';
  if (row.coverage_band === 'medium_coverage') return 'Use as supporting evidence and prioritize manual review of top rows before claim upgrades.';
  if (row.coverage_band === 'thin_but_usable') return 'Keep as directional coverage; expand or treat as context-only.';
  return 'Do not use for market claims; retain only as provenance/context unless expanded.';
}

const rawRows = csv('data_processed/cross_source_universe_raw.csv');
const dedupRows = csv('data_processed/cross_source_universe_dedup.csv');

const matrixRows = [];
const sourceGroups = Array.from(new Set(rawRows.map(row => row.source_group).filter(Boolean))).sort();
const niches = Array.from(new Set(rawRows.flatMap(row => clean(row.niche).split('|')).filter(Boolean))).sort();

for (const sourceGroup of sourceGroups) {
  for (const niche of niches) {
    const raw = rawRows.filter(row => row.source_group === sourceGroup && clean(row.niche).split('|').includes(niche));
    const dedup = dedupRows.filter(row => row.merged_source_groups.split('|').includes(sourceGroup) && clean(row.niche).split('|').includes(niche));
    if (!raw.length && !dedup.length) continue;
    const ok = raw.filter(row => row.collection_status === 'ok');
    const withUrl = raw.filter(row => row.source_url);
    const withRating = raw.filter(row => row.rating || row.review_count);
    const highMedium = raw.filter(row => /high|medium/.test(row.evidence_quality));
    const paid = raw.filter(row => row.pricing_type === 'paid' || row.price_usd || /paid|price|subscription|\$|€|£|฿/.test(row.monetization_notes));
    const categories = Object.entries(countBy(raw, 'category')).sort((a, b) => b[1] - a[1]).slice(0, 4).map(([k, v]) => `${k}:${v}`).join('|');
    const row = {
      matrix_id: `${sourceGroup}__${niche}`,
      source_group: sourceGroup,
      niche,
      raw_rows: raw.length,
      dedup_rows: dedup.length,
      ok_rows: ok.length,
      ok_rate_pct: pct(ok.length, raw.length),
      url_rows: withUrl.length,
      url_coverage_pct: pct(withUrl.length, raw.length),
      rating_or_review_rows: withRating.length,
      rating_or_review_pct: pct(withRating.length, raw.length),
      paid_signal_rows: paid.length,
      paid_signal_pct: pct(paid.length, raw.length),
      high_or_medium_quality_rows: highMedium.length,
      high_or_medium_quality_pct: pct(highMedium.length, raw.length),
      top_categories: categories,
      market_role: marketRole(sourceGroup, niche),
      coverage_band: '',
      recommended_use: ''
    };
    row.coverage_band = evidenceBand(row);
    row.recommended_use = nextAction(row);
    matrixRows.push(row);
  }
}

matrixRows.sort((a, b) => {
  const bandOrder = { strong_coverage: 0, medium_coverage: 1, thin_but_usable: 2, weak_or_context_only: 3 };
  return (bandOrder[a.coverage_band] - bandOrder[b.coverage_band])
    || Number(b.dedup_rows) - Number(a.dedup_rows)
    || a.source_group.localeCompare(b.source_group);
});

const headers = [
  'matrix_id', 'source_group', 'niche', 'raw_rows', 'dedup_rows', 'ok_rows',
  'ok_rate_pct', 'url_rows', 'url_coverage_pct', 'rating_or_review_rows',
  'rating_or_review_pct', 'paid_signal_rows', 'paid_signal_pct',
  'high_or_medium_quality_rows', 'high_or_medium_quality_pct', 'top_categories',
  'market_role', 'coverage_band', 'recommended_use'
];

writeCsv(OUT, matrixRows, headers);

const byBand = countBy(matrixRows, 'coverage_band');
const byRole = countBy(matrixRows, 'market_role');
const bySource = sourceGroups.map(sourceGroup => {
  const rows = matrixRows.filter(row => row.source_group === sourceGroup);
  return {
    source_group: sourceGroup,
    market_cells: rows.length,
    raw_rows: rows.reduce((sum, row) => sum + Number(row.raw_rows), 0),
    dedup_rows: rows.reduce((sum, row) => sum + Number(row.dedup_rows), 0),
    strong_or_medium_cells: rows.filter(row => ['strong_coverage', 'medium_coverage'].includes(row.coverage_band)).length,
    weakest_cells: rows.filter(row => row.coverage_band === 'weak_or_context_only').length
  };
}).sort((a, b) => b.dedup_rows - a.dedup_rows);

const lines = [];
lines.push('# Cross-Source Coverage Matrix V1');
lines.push('');
lines.push(`Generated: ${new Date().toISOString()}`);
lines.push('');
lines.push('## Purpose');
lines.push('');
lines.push('This matrix converts the cross-source universe into a market/source coverage read. It identifies which source groups are strong enough for discovery and triangulation, which are only directional, and which should remain context-only until expanded or manually validated.');
lines.push('');
lines.push('## Summary');
lines.push('');
lines.push(`- Coverage cells: ${matrixRows.length}`);
lines.push(`- Strong coverage cells: ${byBand.strong_coverage || 0}`);
lines.push(`- Medium coverage cells: ${byBand.medium_coverage || 0}`);
lines.push(`- Thin but usable cells: ${byBand.thin_but_usable || 0}`);
lines.push(`- Weak/context-only cells: ${byBand.weak_or_context_only || 0}`);
lines.push('');
lines.push('Coverage band mix:');
lines.push('');
lines.push(Object.entries(byBand).sort((a, b) => b[1] - a[1]).map(([key, value]) => `- ${key}: ${value}`).join('\n'));
lines.push('');
lines.push('Market role mix:');
lines.push('');
lines.push(Object.entries(byRole).sort((a, b) => b[1] - a[1]).map(([key, value]) => `- ${key}: ${value}`).join('\n'));
lines.push('');
lines.push('## Source Summary');
lines.push('');
lines.push(mdTable(bySource, [
  { key: 'source_group', label: 'Source Group' },
  { key: 'market_cells', label: 'Cells', align: 'right' },
  { key: 'raw_rows', label: 'Raw Rows', align: 'right' },
  { key: 'dedup_rows', label: 'Dedup Rows', align: 'right' },
  { key: 'strong_or_medium_cells', label: 'Strong/Medium Cells', align: 'right' },
  { key: 'weakest_cells', label: 'Weak Cells', align: 'right' }
]));
lines.push('');
lines.push('## Strongest Cells');
lines.push('');
lines.push(mdTable(matrixRows.filter(row => row.coverage_band === 'strong_coverage').slice(0, 12), [
  { key: 'source_group', label: 'Source' },
  { key: 'niche', label: 'Market' },
  { key: 'dedup_rows', label: 'Dedup', align: 'right' },
  { key: 'ok_rate_pct', label: 'OK %', align: 'right' },
  { key: 'market_role', label: 'Role' },
  { key: 'recommended_use', label: 'Use' }
], 12));
lines.push('');
lines.push('## Claim Boundary');
lines.push('');
lines.push('- Strong coverage does not prove market share or product-market fit.');
lines.push('- Strong coverage means the source/market cell has enough public rows and provenance to support discovery, saturation mapping, and manual sampling.');
lines.push('- Thin or weak cells should not support investor-grade claims without expansion or direct validation.');
lines.push('');
lines.push('## Files');
lines.push('');
lines.push(`- \`${OUT}\``);

fs.writeFileSync(OUT_DOC, `${lines.join('\n')}\n`);

console.log(`matrix=${OUT}`);
console.log(`doc=${OUT_DOC}`);
console.log(`coverage_cells=${matrixRows.length}`);
console.log(`strong=${byBand.strong_coverage || 0}`);
console.log(`medium=${byBand.medium_coverage || 0}`);
