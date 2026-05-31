import fs from 'fs';

const OUT = 'data_processed/russian_whitespace_decision_map.csv';
const DOC = 'docs/intersections/russian-whitespace-decision-map-v1.md';

for (const dir of ['data_processed', 'docs/intersections']) fs.mkdirSync(dir, { recursive: true });

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
  return fs.existsSync(file) ? parseCsv(fs.readFileSync(file, 'utf8')) : [];
}

function clean(value) {
  return String(value ?? '').replace(/\s+/g, ' ').trim();
}

function csvEscape(value) {
  return `"${clean(value).replace(/"/g, '""')}"`;
}

function writeCsv(file, rows, headers) {
  fs.writeFileSync(file, [headers.join(','), ...rows.map(row => headers.map(h => csvEscape(row[h])).join(','))].join('\n'));
}

function mdTable(rows, columns, limit = rows.length) {
  const limited = rows.slice(0, limit);
  const header = `| ${columns.map(c => c.label).join(' | ')} |`;
  const sep = `| ${columns.map(c => c.align === 'right' ? '---:' : '---').join(' | ')} |`;
  const body = limited.map(row => `| ${columns.map(c => clean(row[c.key]).replace(/\|/g, '/')).join(' | ')} |`);
  return [header, sep, ...body].join('\n');
}

function countBy(rows, key) {
  const out = {};
  for (const row of rows) out[row[key] || 'unknown'] = (out[row[key] || 'unknown'] || 0) + 1;
  return out;
}

function topCounts(rows, key, limit = 5) {
  return Object.entries(countBy(rows, key))
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .slice(0, limit)
    .map(([k, v]) => `${k}:${v}`)
    .join('|');
}

function ruOpportunity(row) {
  if (row.opportunity_band === 'mechanic_benchmark_not_primary_market') return 'механический benchmark, не основной whitespace';
  if (row.opportunity_band === 'medium_opportunity_needs_sampling') return 'возможность есть, но нужна выборочная ручная проверка';
  if (row.opportunity_band === 'crowded_or_unclear_context') return 'рынок видим, но claim о whitespace слабый без нового evidence';
  return row.opportunity_band || 'нужна интерпретация';
}

function h3Read(row) {
  if (row.full_loop_rate_pct && Number(row.full_loop_rate_pct) <= 4 && row.opportunity_band === 'medium_opportunity_needs_sampling') {
    return 'H3 можно держать как narrow directional whitespace: full-loop-like кандидаты редки, но sampling обязателен.';
  }
  if (row.opportunity_band === 'mechanic_benchmark_not_primary_market') {
    return 'Не использовать как H3 proof. Это источник механик, а не доказательство рынка Alina.';
  }
  return 'H3 не усиливать: плотность/контекст/прямота пока слишком неоднозначны.';
}

function inspectionRisk(rows) {
  const high = rows.filter(row => row.hidden_clone_risk_public_read === 'high_hidden_clone_risk_requires_app_walkthrough');
  const visible = rows.filter(row => row.action_to_avatar_causality_public_read === 'visible_in_public_copy');
  const strict = rows.filter(row => row.public_listing_verdict === 'public_listing_supports_strict_loop_claim');
  return { high, visible, strict };
}

const whitespace = csv('data_processed/whitespace_signal_matrix.csv');
const saturation = csv('data_processed/cross_source_market_saturation_matrix.csv');
const publicInspection = csv('data_processed/public_listing_inspection_results.csv');
const productCore = csv('data_processed/product_core_evidence_matrix.csv');
const top100 = csv('data_processed/top100_competitor_review_scorecard.csv');

const inspection = inspectionRisk(publicInspection);

const rows = saturation.map(row => {
  const nicheRows = whitespace.filter(w => w.niche === row.niche);
  const topRiskApps = publicInspection
    .filter(p => ['high_hidden_clone_risk_requires_app_walkthrough', 'medium_adjacency_risk'].includes(p.hidden_clone_risk_public_read))
    .slice(0, 5)
    .map(p => `${p.app_name}:${p.hidden_clone_risk_public_read}`)
    .join('|');
  return {
    niche: row.niche,
    cross_source_dedup_rows: row.cross_source_dedup_rows,
    source_group_count: row.source_group_count,
    saturation_score_0_100: row.saturation_score_0_100,
    high_intersection_candidates: row.high_intersection_candidates,
    full_loop_like_candidates: row.full_loop_like_candidates,
    full_loop_rate_pct: row.full_loop_rate_pct,
    full_loop_scarcity_score: row.full_loop_scarcity_score,
    behavior_identity_or_progress_signals: row.behavior_identity_or_progress_signals,
    money_signal_rows: row.money_signal_rows,
    opportunity_read_ru: ruOpportunity(row),
    h3_decision_read_ru: h3Read(row),
    top_feature_tags: row.top_feature_tags,
    whitespace_band_mix: topCounts(nicheRows, 'whitespace_band', 4),
    public_listing_hidden_clone_risks: inspection.high.length,
    public_listing_visible_causality: inspection.visible.length,
    public_listing_strict_loop_claims: inspection.strict.length,
    top_public_risk_apps: topRiskApps,
    boundary_ru: 'Это desk/public-listing decision map. H3 нельзя апгрейдить до ручного walkthrough с screenshots и final verdict_after_inspection.',
    next_validation_move_ru: row.next_validation_move
  };
});

const headers = [
  'niche', 'cross_source_dedup_rows', 'source_group_count', 'saturation_score_0_100',
  'high_intersection_candidates', 'full_loop_like_candidates', 'full_loop_rate_pct',
  'full_loop_scarcity_score', 'behavior_identity_or_progress_signals', 'money_signal_rows',
  'opportunity_read_ru', 'h3_decision_read_ru', 'top_feature_tags', 'whitespace_band_mix',
  'public_listing_hidden_clone_risks', 'public_listing_visible_causality',
  'public_listing_strict_loop_claims', 'top_public_risk_apps', 'boundary_ru',
  'next_validation_move_ru'
];

writeCsv(OUT, rows, headers);

const lines = [];
lines.push('# Русская whitespace decision map V1');
lines.push('');
lines.push(`Собрано: ${new Date().toISOString()}`);
lines.push('');
lines.push('## Зачем нужен этот файл');
lines.push('');
lines.push('Этот слой переводит whitespace analysis в решение по H3. Он отделяет три вещи: где есть реальная узкая возможность, где рынок полезен только как benchmark, и где рынок слишком crowded/unclear, чтобы усиливать claim. Карта намеренно консервативна: public listing и cross-source counts помогают выбрать, что проверять, но не закрывают H3.');
lines.push('');
lines.push(`Контекст: whitespace rows=${whitespace.length}, saturation markets=${saturation.length}, product-core rows=${productCore.length}, top100 rows=${top100.length}, public listing inspected=${publicInspection.length}.`);
lines.push('');
lines.push('## Market Read');
lines.push('');
lines.push(mdTable(rows, [
  { key: 'niche', label: 'Niche' },
  { key: 'cross_source_dedup_rows', label: 'Dedup', align: 'right' },
  { key: 'full_loop_rate_pct', label: 'Full-loop %', align: 'right' },
  { key: 'opportunity_read_ru', label: 'Opportunity' },
  { key: 'h3_decision_read_ru', label: 'H3 read' }
], rows.length));
lines.push('');
for (const row of rows) {
  lines.push(`## ${row.niche}`);
  lines.push('');
  lines.push(`**Сигнал:** ${row.cross_source_dedup_rows} dedup rows, ${row.high_intersection_candidates} high-intersection candidates, ${row.full_loop_like_candidates} full-loop-like candidates, full-loop rate ${row.full_loop_rate_pct}%.`);
  lines.push('');
  lines.push(`**Решение:** ${row.h3_decision_read_ru}`);
  lines.push('');
  lines.push(`**Риск:** public-listing high hidden-clone risks=${row.public_listing_hidden_clone_risks}, visible causality=${row.public_listing_visible_causality}, strict loop claims=${row.public_listing_strict_loop_claims}. Top risk apps: ${row.top_public_risk_apps || 'n/a'}.`);
  lines.push('');
  lines.push(`**Следующая проверка:** ${row.next_validation_move_ru}`);
  lines.push('');
}
lines.push('## H3 Boundary');
lines.push('');
lines.push('Нельзя утверждать, что белое пятно доказано, пока P0 competitors не пройдены вручную. Самый опасный ранний риск - Shepherd: Spiritual Bible BFF: public listing уже показывает visible action -> avatar/progress causality и требует hidden-clone walkthrough до любого усиления H3.');
lines.push('');
lines.push('## Файлы');
lines.push('');
lines.push(`- \`${OUT}\``);
lines.push(`- \`${DOC}\``);
lines.push('- `data_processed/whitespace_signal_matrix.csv`');
lines.push('- `data_processed/cross_source_market_saturation_matrix.csv`');
lines.push('- `data_processed/public_listing_inspection_results.csv`');
lines.push('- `data_processed/product_core_evidence_matrix.csv`');

fs.writeFileSync(DOC, `${lines.join('\n')}\n`);

console.log(`russian_whitespace_decision_map_rows=${rows.length}`);
console.log(`doc=${DOC}`);
