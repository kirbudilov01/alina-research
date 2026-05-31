import fs from 'fs';

const OUT_AUDIT = 'data_processed/market_sizing_assumption_audit.csv';
const OUT_STRESS = 'data_processed/market_sizing_stress_test.csv';
const OUT_DOC = 'docs/market/market-sizing-stress-test-v1.md';

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
  fs.writeFileSync(file, [headers.join(','), ...rows.map(row => headers.map(h => csvEscape(row[h])).join(','))].join('\n'));
}

function mdTable(rows, columns, limit = rows.length) {
  const slice = rows.slice(0, limit);
  const header = `| ${columns.map(c => c.label).join(' | ')} |`;
  const sep = `| ${columns.map(c => c.align === 'right' ? '---:' : '---').join(' | ')} |`;
  const body = slice.map(row => `| ${columns.map(c => clean(row[c.key]).replace(/\|/g, '/')).join(' | ')} |`);
  return [header, sep, ...body].join('\n');
}

function countBy(rows, key) {
  const out = {};
  for (const row of rows) out[row[key] || 'unknown'] = (out[row[key] || 'unknown'] || 0) + 1;
  return out;
}

function bulletCounts(counts) {
  return Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .map(([key, value]) => `- ${key}: ${value}`)
    .join('\n');
}

function money(value) {
  const n = Number(value || 0);
  if (!Number.isFinite(n)) return '';
  return String(Math.round(n));
}

function pct(value) {
  const n = Number(value || 0);
  if (!Number.isFinite(n)) return '';
  return String(Math.round(n * 10000) / 100);
}

function confidenceWeight(confidence) {
  if (/high/i.test(confidence)) return 1;
  if (/medium/i.test(confidence)) return 0.7;
  if (/low_medium/i.test(confidence)) return 0.55;
  if (/low/i.test(confidence)) return 0.4;
  return 0.5;
}

function modelRisk(row, sourceRows, monetizationRow, revenueSummary) {
  const directness = row.directness;
  const sources = sourceRows.length;
  const highUseSources = sourceRows.filter(s => s.confidence_review_band === 'high_use').length;
  const rangeOnlySources = sourceRows.filter(s => ['low_use_range_only', 'context_only'].includes(s.confidence_review_band)).length;
  const strongProxy = monetizationRow?.monetization_proxy_band === 'strong_paid_behavior_proxy';
  const mediumProxy = monetizationRow?.monetization_proxy_band === 'medium_paid_behavior_proxy';
  const strongCompetitors = Number(revenueSummary?.strong_proxy_competitors || 0);
  if (directness === 'mechanic_benchmark') return 'benchmark_only_not_direct_tam';
  if (sources <= 1 && !strongProxy) return 'high_source_and_monetization_risk';
  if (rangeOnlySources > highUseSources && strongCompetitors < 3) return 'high_range_variance_risk';
  if (strongProxy && strongCompetitors >= 5 && highUseSources >= 1) return 'moderate_validated_proxy_risk';
  if ((strongProxy || mediumProxy) && strongCompetitors >= 2) return 'medium_proxy_supported_risk';
  return 'medium_needs_more_triangulation';
}

function recommendedAction(risk) {
  if (risk === 'benchmark_only_not_direct_tam') return 'Keep outside direct TAM; use only for retention/progression mechanics and monetization benchmarks.';
  if (risk === 'high_source_and_monetization_risk') return 'Add credible source anchors and competitor revenue/pricing proxies before using in final market claim.';
  if (risk === 'high_range_variance_risk') return 'Keep as wide range only; prioritize source-confidence refresh and bottom-up competitor triangulation.';
  if (risk === 'moderate_validated_proxy_risk') return 'Use in model with explicit caveat; next step is manual paid-flow validation.';
  if (risk === 'medium_proxy_supported_risk') return 'Use directionally; expand competitor proxy review for final investor-grade claim.';
  return 'Keep directional; add one more independent source and manual pricing/paywall validation.';
}

const tam = csv('data_processed/tam_sam_som_model.csv');
const sourceConfidence = csv('data_processed/market_source_confidence_review.csv');
const monetizationProxy = csv('data_processed/market_monetization_proxy_matrix.csv');
const revenueSummary = csv('data_processed/competitor_revenue_proxy_market_summary.csv');

const sourcesByPillar = new Map();
for (const row of sourceConfidence) {
  const key = row.niche || row.market || 'unknown';
  if (!sourcesByPillar.has(key)) sourcesByPillar.set(key, []);
  sourcesByPillar.get(key).push(row);
}
const monetizationByMarket = new Map(monetizationProxy.map(row => [row.market, row]));
const revenueByMarket = new Map(revenueSummary.map(row => [row.market, row]));

const assumptionRows = tam.map(row => {
  const sourceRows = sourcesByPillar.get(row.pillar) || [];
  const monetization = monetizationByMarket.get(row.pillar) || {};
  const revenue = revenueByMarket.get(row.pillar) || {};
  const risk = modelRisk(row, sourceRows, monetization, revenue);
  const weightedSamBase = Number(row.samBase || 0) * confidenceWeight(row.confidence);
  const samSpreadRatio = Number(row.samHigh || 0) / Math.max(1, Number(row.samLow || 0));
  return {
    pillar: row.pillar,
    market: row.market,
    directness: row.directness,
    tam_base: row.tamBase,
    sam_base: row.samBase,
    sam_spread_ratio: samSpreadRatio.toFixed(2),
    model_confidence: row.confidence,
    confidence_weight: confidenceWeight(row.confidence),
    weighted_sam_base: money(weightedSamBase),
    source_count: sourceRows.length,
    high_use_sources: sourceRows.filter(s => s.confidence_review_band === 'high_use').length,
    range_only_or_context_sources: sourceRows.filter(s => ['low_use_range_only', 'context_only'].includes(s.confidence_review_band)).length,
    monetization_proxy_band: monetization.monetization_proxy_band || '',
    competitor_proxy_rows: revenue.reviewed_competitors || '',
    strong_competitor_money_proxy: revenue.strong_proxy_competitors || '',
    medium_plus_competitor_money_proxy: revenue.medium_or_stronger_proxy_competitors || '',
    model_risk: risk,
    recommended_action: recommendedAction(risk),
    notes: row.notes
  };
});

const intersection = tam.find(row => row.pillar === 'intersection') || {};
const directSamBase = Number(intersection.tamBase || 0);
const stressLevers = [
  { scenario_family: 'defensive', intersection_discount: 0.05, reachable_users: 100_000, activation_rate: 0.25, paid_conversion: 0.02, arppu_year: 50 },
  { scenario_family: 'conservative', intersection_discount: 0.08, reachable_users: 250_000, activation_rate: 0.32, paid_conversion: 0.03, arppu_year: 60 },
  { scenario_family: 'base', intersection_discount: 0.15, reachable_users: 1_000_000, activation_rate: 0.40, paid_conversion: 0.05, arppu_year: 80 },
  { scenario_family: 'strong_niche', intersection_discount: 0.20, reachable_users: 2_500_000, activation_rate: 0.45, paid_conversion: 0.07, arppu_year: 95 },
  { scenario_family: 'upside', intersection_discount: 0.25, reachable_users: 5_000_000, activation_rate: 0.50, paid_conversion: 0.09, arppu_year: 110 },
  { scenario_family: 'breakout', intersection_discount: 0.30, reachable_users: 10_000_000, activation_rate: 0.55, paid_conversion: 0.11, arppu_year: 125 }
];

const stressRows = stressLevers.map(row => {
  const modeledSam = directSamBase * row.intersection_discount;
  const paidUsers = row.reachable_users * row.activation_rate * row.paid_conversion;
  const annualRevenue = paidUsers * row.arppu_year;
  return {
    ...row,
    modeled_intersection_sam: money(modeledSam),
    paid_users: money(paidUsers),
    annual_revenue: money(annualRevenue),
    share_of_modeled_sam: (annualRevenue / Math.max(1, modeledSam)).toFixed(6),
    stress_read: annualRevenue < 100_000
      ? 'tiny_validation_business'
      : annualRevenue < 2_000_000
        ? 'niche_early_business'
        : annualRevenue < 20_000_000
          ? 'venture_relevant_if_retention_works'
          : 'large_outcome_requires_distribution_and_retention_proof'
  };
});

writeCsv(OUT_AUDIT, assumptionRows, [
  'pillar', 'market', 'directness', 'tam_base', 'sam_base', 'sam_spread_ratio',
  'model_confidence', 'confidence_weight', 'weighted_sam_base', 'source_count',
  'high_use_sources', 'range_only_or_context_sources', 'monetization_proxy_band',
  'competitor_proxy_rows', 'strong_competitor_money_proxy',
  'medium_plus_competitor_money_proxy', 'model_risk', 'recommended_action', 'notes'
]);

writeCsv(OUT_STRESS, stressRows, [
  'scenario_family', 'intersection_discount', 'reachable_users', 'activation_rate',
  'paid_conversion', 'arppu_year', 'modeled_intersection_sam', 'paid_users',
  'annual_revenue', 'share_of_modeled_sam', 'stress_read'
]);

const lines = [];
lines.push('# Market Sizing Stress Test V1');
lines.push('');
lines.push(`Generated: ${new Date().toISOString()}`);
lines.push('');
lines.push('## Purpose');
lines.push('');
lines.push('This layer stress-tests the existing TAM/SAM/SOM model. It does not add new external market claims. Instead, it makes assumptions, confidence discounts, source risk, monetization proxy support, and bottom-up outcome scenarios explicit.');
lines.push('');
lines.push('## Assumption Audit Summary');
lines.push('');
lines.push(`- Assumption rows: ${assumptionRows.length}`);
lines.push(`- Stress scenarios: ${stressRows.length}`);
lines.push(`- Highest modeled intersection SAM stress case: USD ${Math.max(...stressRows.map(row => Number(row.modeled_intersection_sam))).toLocaleString('en-US')}`);
lines.push(`- Highest annual revenue stress case: USD ${Math.max(...stressRows.map(row => Number(row.annual_revenue))).toLocaleString('en-US')}`);
lines.push('');
lines.push('Model risk mix:');
lines.push('');
lines.push(bulletCounts(countBy(assumptionRows, 'model_risk')));
lines.push('');
lines.push('Stress read mix:');
lines.push('');
lines.push(bulletCounts(countBy(stressRows, 'stress_read')));
lines.push('');
lines.push('## Assumption Audit');
lines.push('');
lines.push(mdTable(assumptionRows, [
  { key: 'pillar', label: 'Pillar' },
  { key: 'sam_base', label: 'SAM Base', align: 'right' },
  { key: 'model_confidence', label: 'Confidence' },
  { key: 'source_count', label: 'Sources', align: 'right' },
  { key: 'monetization_proxy_band', label: 'Money Proxy' },
  { key: 'strong_competitor_money_proxy', label: 'Strong Competitors', align: 'right' },
  { key: 'model_risk', label: 'Risk' }
]));
lines.push('');
lines.push('## Stress Scenarios');
lines.push('');
lines.push(mdTable(stressRows, [
  { key: 'scenario_family', label: 'Scenario' },
  { key: 'intersection_discount', label: 'Intersection Discount', align: 'right' },
  { key: 'reachable_users', label: 'Reachable Users', align: 'right' },
  { key: 'paid_conversion', label: 'Paid Conv.', align: 'right' },
  { key: 'arppu_year', label: 'ARPPU', align: 'right' },
  { key: 'annual_revenue', label: 'Annual Revenue', align: 'right' },
  { key: 'share_of_modeled_sam', label: 'Share of SAM', align: 'right' },
  { key: 'stress_read', label: 'Read' }
]));
lines.push('');
lines.push('## Interpretation');
lines.push('');
lines.push('- The market-money case is supported directionally, but not final: the strongest proof is paid behavior across adjacent competitors, not exact category revenue.');
lines.push('- The intersection SAM should remain a discounted subset of direct-adjacent SAM, never a sum of all five category TAMs.');
lines.push('- Defensive and conservative cases are small unless activation and paid conversion work; the upside cases require distribution, retention, and willingness-to-pay proof.');
lines.push('- Next validation should prioritize paid-flow inspection and prototype willingness-to-pay signals, not more unqualified TAM expansion.');
lines.push('');
lines.push('## Files');
lines.push('');
lines.push(`- \`${OUT_AUDIT}\``);
lines.push(`- \`${OUT_STRESS}\``);

fs.writeFileSync(OUT_DOC, `${lines.join('\n')}\n`);

console.log(`audit=${OUT_AUDIT}`);
console.log(`stress=${OUT_STRESS}`);
console.log(`doc=${OUT_DOC}`);
console.log(`assumption_rows=${assumptionRows.length}`);
console.log(`stress_rows=${stressRows.length}`);
