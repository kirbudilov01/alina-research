import fs from 'fs';

const OUT = 'data_processed/market_model_sensitivity_audit.csv';
const DOC = 'docs/market/market-model-sensitivity-audit-v1.md';

for (const dir of ['data_processed', 'docs/market']) fs.mkdirSync(dir, { recursive: true });

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

function money(value) {
  const n = num(value);
  if (!n) return 'n/a';
  if (n >= 1_000_000_000) return `$${(n / 1_000_000_000).toFixed(n >= 10_000_000_000 ? 1 : 2)}B`;
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(n >= 100_000_000 ? 0 : 1)}M`;
  return `$${Math.round(n).toLocaleString('en-US')}`;
}

function ratio(high, low) {
  const h = num(high);
  const l = num(low);
  if (!h || !l) return 0;
  return h / l;
}

function fixed(value, digits = 1) {
  const n = num(value);
  return Number.isFinite(n) ? n.toFixed(digits) : '0.0';
}

function riskLevel(row) {
  const spread = ratio(row.samHigh, row.samLow);
  const sourceCount = num(row.source_count);
  const confidence = clean(row.confidence);
  if (row.pillar === 'intersection') return 'очень высокий';
  if (spread >= 20 || sourceCount <= 1 || confidence === 'low') return 'высокий';
  if (spread >= 8 || confidence.includes('low')) return 'средне-высокий';
  return 'средний';
}

function mainDriver(row, auditRow) {
  if (row.pillar === 'intersection') return 'intersection discount + отсутствующие прямые источники';
  if (row.directness === 'mechanic_benchmark') return 'directness: benchmark нельзя считать прямым TAM';
  if (num(auditRow.sam_spread_ratio) >= 20) return 'ширина диапазона SAM';
  if (num(auditRow.source_count) <= 1) return 'малое число market anchors';
  if (clean(auditRow.model_risk).includes('range')) return 'range variance источников';
  return 'paid-flow/WTP still unobserved';
}

function nextProof(row, auditRow) {
  if (row.pillar === 'intersection') return 'ICP/WTP + product-matched paid-flow + bottom-up competitor revenue proxy';
  if (row.directness === 'mechanic_benchmark') return 'оставить как mechanics benchmark; не включать в прямой H2 proof';
  if (num(auditRow.source_count) <= 1) return 'добавить credible market anchors и source-confidence refresh';
  if (num(auditRow.strong_competitor_money_proxy) || num(auditRow.medium_plus_competitor_money_proxy)) return 'добрать paid-flow screenshots и WTP/prototype paid-depth signals';
  return 'добрать bottom-up competitor pricing/revenue proxy и WTP signals';
}

const tam = csv('data_processed/tam_sam_som_model.csv');
const audit = csv('data_processed/market_sizing_assumption_audit.csv');
const moneyRows = csv('data_processed/market_money_triangulation.csv');
const stress = csv('data_processed/market_sizing_stress_test.csv');

const auditByPillar = Object.fromEntries(audit.map(row => [row.pillar, row]));
const moneyByPillar = Object.fromEntries(moneyRows.map(row => [row.pillar, row]));

const rows = tam.map(row => {
  const a = auditByPillar[row.pillar] || {};
  const m = moneyByPillar[row.pillar] || {};
  const samSpread = ratio(row.samHigh, row.samLow);
  const tamSpread = ratio(row.tamHigh, row.tamLow);
  const weighted = a.weighted_sam_base || m.weighted_sam_base_usd || '';
  const weightedDiscount = num(row.samBase) ? num(weighted) / num(row.samBase) : 0;
  return {
    pillar: row.pillar,
    market: row.market,
    directness: row.directness,
    sam_base: money(row.samBase),
    weighted_sam_base: money(weighted),
    tam_spread_ratio: fixed(tamSpread),
    sam_spread_ratio: fixed(samSpread),
    confidence: row.confidence,
    confidence_weight: a.confidence_weight || '',
    weighted_discount_pct: `${(weightedDiscount * 100).toFixed(0)}%`,
    source_count: a.source_count || '',
    monetization_proxy_band: a.monetization_proxy_band || m.monetization_proxy_band || '',
    competitor_proxy_rows: a.competitor_proxy_rows || m.reviewed_competitors || '',
    sensitivity_risk_ru: riskLevel({ ...row, ...a }),
    main_sensitivity_driver_ru: mainDriver(row, a),
    next_evidence_to_reduce_risk_ru: nextProof(row, a),
    claim_boundary_ru: 'Sensitivity audit не меняет TAM/SAM/SOM; он показывает, какие assumptions двигают модель и какое evidence нужно до H2 upgrade.'
  };
});

writeCsv(OUT, rows, [
  'pillar',
  'market',
  'directness',
  'sam_base',
  'weighted_sam_base',
  'tam_spread_ratio',
  'sam_spread_ratio',
  'confidence',
  'confidence_weight',
  'weighted_discount_pct',
  'source_count',
  'monetization_proxy_band',
  'competitor_proxy_rows',
  'sensitivity_risk_ru',
  'main_sensitivity_driver_ru',
  'next_evidence_to_reduce_risk_ru',
  'claim_boundary_ru'
]);

const highRiskRows = rows.filter(row => ['высокий', 'очень высокий', 'средне-высокий'].includes(row.sensitivity_risk_ru));
const breakout = stress.find(row => row.scenario_family === 'breakout') || {};
const base = stress.find(row => row.scenario_family === 'base') || {};

const lines = [];
lines.push('# Market Model Sensitivity Audit V1');
lines.push('');
lines.push(`Generated: ${new Date().toISOString().slice(0, 10)}`);
lines.push('');
lines.push('## Зачем нужен этот слой');
lines.push('');
lines.push('Этот аудит проверяет, где TAM/SAM/SOM модель наиболее чувствительна к assumptions. Он не добавляет новые market claims и не меняет базовую модель; он показывает, какие рычаги делают H2 хрупкой и какое evidence нужно собрать перед claim upgrade.');
lines.push('');
lines.push('## Summary');
lines.push('');
lines.push(`- Rows: ${rows.length}`);
lines.push(`- Medium-high/high/very-high sensitivity rows: ${highRiskRows.length}`);
lines.push(`- Base stress annual revenue: ${money(base.annual_revenue)}`);
lines.push(`- Breakout stress annual revenue: ${money(breakout.annual_revenue)}`);
lines.push('');
lines.push('## Sensitivity Table');
lines.push('');
lines.push(mdTable(rows.map(row => ({
  pillar: row.pillar,
  sam: row.sam_base,
  weighted: row.weighted_sam_base,
  spread: row.sam_spread_ratio,
  risk: row.sensitivity_risk_ru,
  driver: row.main_sensitivity_driver_ru,
  next: row.next_evidence_to_reduce_risk_ru
})), [
  { key: 'pillar', label: 'Pillar' },
  { key: 'sam', label: 'SAM base', align: 'right' },
  { key: 'weighted', label: 'Weighted SAM', align: 'right' },
  { key: 'spread', label: 'SAM spread', align: 'right' },
  { key: 'risk', label: 'Risk' },
  { key: 'driver', label: 'Main driver' },
  { key: 'next', label: 'Next proof' }
]));
lines.push('');
lines.push('## Reading Rule');
lines.push('');
lines.push('H2 нельзя усиливать из-за одной market-size таблицы. Самые важные рычаги сейчас: intersection discount, ширина SAM диапазона, directness рынка, количество источников и paid-flow/WTP evidence. До observed paid-flow и user WTP цифры остаются prioritization model, а не revenue forecast.');
lines.push('');
lines.push('## Files');
lines.push('');
lines.push(`- \`${OUT}\``);
lines.push('- `data_processed/tam_sam_som_model.csv`');
lines.push('- `data_processed/market_sizing_assumption_audit.csv`');
lines.push('- `data_processed/market_sizing_stress_test.csv`');

fs.writeFileSync(DOC, `${lines.join('\n')}\n`);

console.log(`market_model_sensitivity_audit=${OUT}`);
console.log(`doc=${DOC}`);
console.log(`rows=${rows.length}`);
