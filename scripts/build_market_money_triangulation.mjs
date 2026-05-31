import fs from 'fs';

const OUT = 'data_processed/market_money_triangulation.csv';
const OUT_SUMMARY = 'data_processed/market_money_triangulation_summary.csv';
const OUT_DOC = 'docs/market/market-money-triangulation-v1.md';

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
  const limited = rows.slice(0, limit);
  const header = `| ${columns.map(c => c.label).join(' | ')} |`;
  const sep = `| ${columns.map(c => c.align === 'right' ? '---:' : '---').join(' | ')} |`;
  const body = limited.map(row => `| ${columns.map(c => clean(row[c.key]).replace(/\|/g, '/')).join(' | ')} |`);
  return [header, sep, ...body].join('\n');
}

function n(value) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function normalizeMarket(value) {
  const v = clean(value);
  if (v === 'coaching_self_improvement') return 'coaching';
  if (v === 'gaming_progression') return 'gaming';
  return v;
}

function indexBy(rows, key) {
  return new Map(rows.map(row => [normalizeMarket(row[key]), row]));
}

function moneyBandScore(band) {
  if (band === 'strong_paid_behavior_proxy') return 3;
  if (band === 'medium_paid_behavior_proxy') return 2;
  if (band) return 1;
  return 0;
}

function sourceScore(row) {
  if (!row) return 0;
  const confidence = row.model_confidence || row.confidence;
  if (confidence === 'high') return 3;
  if (confidence === 'medium' || confidence === 'low_medium') return 2;
  if (confidence) return 1;
  return 0;
}

function revenueScore(row) {
  if (!row) return 0;
  const strong = n(row.strong_proxy_competitors);
  const mediumPlus = n(row.medium_or_stronger_proxy_competitors);
  if (strong >= 5 && mediumPlus >= 10) return 3;
  if (strong >= 2 || mediumPlus >= 4) return 2;
  if (mediumPlus > 0 || n(row.observed_iap_competitors) > 0) return 1;
  return 0;
}

function paywallScore(row) {
  if (!row) return 0;
  if (n(row.confirmed_visible_pricing) >= 1) return 2;
  if (n(row.partial_paid_surface) >= 1) return 1;
  return 0;
}

function riskPenalty(row, tamRow) {
  let penalty = 0;
  const risk = clean(row?.model_risk).toLowerCase();
  const directness = clean(tamRow?.directness).toLowerCase();
  if (risk.includes('high')) penalty += 2;
  if (risk.includes('range')) penalty += 1;
  if (directness.includes('benchmark')) penalty += 3;
  if (directness.includes('broad')) penalty += 1;
  if (directness.includes('intersection')) penalty += 2;
  return penalty;
}

function verdict(score, penalty, tamRow) {
  const directness = clean(tamRow?.directness);
  if (directness === 'mechanic_benchmark') return 'benchmark_money_visible_not_direct_tam';
  if (score >= 8 && penalty <= 2) return 'strong_directional_money_case';
  if (score >= 6 && penalty <= 4) return 'medium_directional_money_case';
  if (score >= 4) return 'weak_or_range_only_money_case';
  return 'insufficient_money_case';
}

function recommendedProof(verdictValue, tamRow) {
  if (verdictValue === 'strong_directional_money_case') {
    return 'Run paid-flow signoff and WTP prototype probes before using as final product-level money proof.';
  }
  if (verdictValue === 'medium_directional_money_case') {
    return 'Add manual paywall/product-match evidence and competitor revenue/intelligence before investor-grade claims.';
  }
  if (verdictValue === 'benchmark_money_visible_not_direct_tam') {
    return 'Keep as monetization/retention benchmark; do not count as direct Alina TAM unless direct audience overlap is validated.';
  }
  if (clean(tamRow?.directness) === 'intersection_model') {
    return 'Validate intersection through ICP/WTP and competitor bottom-up proxies; keep modeled SAM as range-only.';
  }
  return 'Treat as context until stronger source, paid-flow, and competitor proxy evidence is added.';
}

const tamRows = csv('data_processed/tam_sam_som_model.csv');
const stressRows = csv('data_processed/market_sizing_stress_test.csv');
const confidenceRows = csv('data_processed/market_sizing_assumption_audit.csv');
const monetizationRows = csv('data_processed/market_monetization_proxy_matrix.csv');
const revenueSummaryRows = csv('data_processed/competitor_revenue_proxy_market_summary.csv');
const paywallSummaryRows = csv('data_processed/web_paywall_visual_adjudication_summary.csv');
const gateRows = csv('data_processed/validation_gate_calculator.csv');

const monetizationByMarket = indexBy(monetizationRows, 'market');
const revenueByMarket = indexBy(revenueSummaryRows, 'market');
const paywallByMarket = indexBy(paywallSummaryRows, 'niche');
const auditByMarket = indexBy(confidenceRows, 'pillar');
const h2Gate = gateRows.find(row => row.linked_hypotheses === 'H2') || {};
const baseStress = stressRows.find(row => row.scenario_family === 'base') || {};
const strongStress = stressRows.find(row => row.scenario_family === 'strong_niche') || {};

const rows = tamRows.map(tamRow => {
  const market = normalizeMarket(tamRow.pillar);
  const monetization = monetizationByMarket.get(market) || {};
  const revenue = revenueByMarket.get(market) || {};
  const paywall = paywallByMarket.get(market) || {};
  const audit = auditByMarket.get(market) || {};
  const scores = {
    source_quality_score: sourceScore(audit) || sourceScore(tamRow),
    monetization_proxy_score: moneyBandScore(monetization.monetization_proxy_band),
    competitor_revenue_proxy_score: revenueScore(revenue),
    paywall_visibility_score: paywallScore(paywall)
  };
  const totalScore = Object.values(scores).reduce((sum, value) => sum + value, 0);
  const penalty = riskPenalty(audit, tamRow);
  const verdictValue = verdict(totalScore, penalty, tamRow);
  return {
    pillar: market,
    market: tamRow.market,
    directness: tamRow.directness,
    sam_base_usd: tamRow.samBase,
    weighted_sam_base_usd: audit.weighted_sam_base || '',
    model_confidence: tamRow.confidence,
    monetization_proxy_band: monetization.monetization_proxy_band || '',
    competitor_market_money_read: revenue.market_money_read || '',
    reviewed_competitors: revenue.reviewed_competitors || 0,
    strong_proxy_competitors: revenue.strong_proxy_competitors || 0,
    medium_or_stronger_proxy_competitors: revenue.medium_or_stronger_proxy_competitors || 0,
    max_observed_price_usd: revenue.max_observed_price_usd || monetization.max_observed_price_usd || '',
    screenshot_confirmed_public_pricing: paywall.confirmed_visible_pricing || monetization.screenshot_confirmed_public_pricing || 0,
    screenshot_partial_paid_surface: paywall.partial_paid_surface || monetization.screenshot_partial_paywall_language || 0,
    source_quality_score: scores.source_quality_score,
    monetization_proxy_score: scores.monetization_proxy_score,
    competitor_revenue_proxy_score: scores.competitor_revenue_proxy_score,
    paywall_visibility_score: scores.paywall_visibility_score,
    total_money_evidence_score: totalScore,
    risk_penalty: penalty,
    money_triangulation_verdict: verdictValue,
    h2_gate_status: h2Gate.gate_status || 'missing_gate',
    h2_gate_decision_effect: h2Gate.current_decision_effect || '',
    base_stress_annual_revenue_usd: market === 'intersection' ? baseStress.annual_revenue : '',
    strong_niche_stress_annual_revenue_usd: market === 'intersection' ? strongStress.annual_revenue : '',
    main_caveat: revenue.main_caveat || paywall.caveat || audit.notes || tamRow.notes,
    recommended_next_proof: recommendedProof(verdictValue, tamRow),
    source_files: 'data_processed/tam_sam_som_model.csv;data_processed/market_sizing_assumption_audit.csv;data_processed/market_monetization_proxy_matrix.csv;data_processed/competitor_revenue_proxy_market_summary.csv;data_processed/web_paywall_visual_adjudication_summary.csv;data_processed/validation_gate_calculator.csv'
  };
});

const summary = Object.entries(rows.reduce((acc, row) => {
  acc[row.money_triangulation_verdict] = (acc[row.money_triangulation_verdict] || 0) + 1;
  return acc;
}, {})).map(([money_triangulation_verdict, row_count]) => ({
  money_triangulation_verdict,
  row_count,
  markets: rows.filter(row => row.money_triangulation_verdict === money_triangulation_verdict).map(row => row.pillar).join('|'),
  avg_money_evidence_score: Math.round((rows
    .filter(row => row.money_triangulation_verdict === money_triangulation_verdict)
    .reduce((sum, row) => sum + n(row.total_money_evidence_score), 0) / row_count) * 10) / 10
}));

writeCsv(OUT, rows, [
  'pillar', 'market', 'directness', 'sam_base_usd', 'weighted_sam_base_usd',
  'model_confidence', 'monetization_proxy_band', 'competitor_market_money_read',
  'reviewed_competitors', 'strong_proxy_competitors', 'medium_or_stronger_proxy_competitors',
  'max_observed_price_usd', 'screenshot_confirmed_public_pricing',
  'screenshot_partial_paid_surface', 'source_quality_score', 'monetization_proxy_score',
  'competitor_revenue_proxy_score', 'paywall_visibility_score', 'total_money_evidence_score',
  'risk_penalty', 'money_triangulation_verdict', 'h2_gate_status', 'h2_gate_decision_effect',
  'base_stress_annual_revenue_usd', 'strong_niche_stress_annual_revenue_usd',
  'main_caveat', 'recommended_next_proof', 'source_files'
]);

writeCsv(OUT_SUMMARY, summary, [
  'money_triangulation_verdict', 'row_count', 'markets', 'avg_money_evidence_score'
]);

const lines = [];
lines.push('# Market Money Triangulation V1');
lines.push('');
lines.push(`Generated: ${new Date().toISOString()}`);
lines.push('');
lines.push('## Purpose');
lines.push('');
lines.push('This layer triangulates market-money evidence across TAM/SAM/SOM, source-confidence review, stress tests, monetization proxies, competitor revenue proxies, public paywall screenshots, and the H2 validation gate. It is intentionally not a revenue estimate.');
lines.push('');
lines.push('## Verdict Matrix');
lines.push('');
lines.push(mdTable(rows, [
  { key: 'pillar', label: 'Pillar' },
  { key: 'directness', label: 'Directness' },
  { key: 'sam_base_usd', label: 'SAM Base', align: 'right' },
  { key: 'total_money_evidence_score', label: 'Score', align: 'right' },
  { key: 'risk_penalty', label: 'Risk Penalty', align: 'right' },
  { key: 'money_triangulation_verdict', label: 'Verdict' },
  { key: 'h2_gate_status', label: 'H2 Gate' },
  { key: 'recommended_next_proof', label: 'Next Proof' }
]));
lines.push('');
lines.push('## Summary');
lines.push('');
lines.push(mdTable(summary, [
  { key: 'money_triangulation_verdict', label: 'Verdict' },
  { key: 'row_count', label: 'Markets', align: 'right' },
  { key: 'markets', label: 'Pillars' },
  { key: 'avg_money_evidence_score', label: 'Avg Score', align: 'right' }
]));
lines.push('');
lines.push('## Read');
lines.push('');
lines.push('- Strong/medium verdicts mean public evidence supports continued paid-flow and WTP validation, not final revenue proof.');
lines.push('- Gaming is kept as a benchmark even when monetization evidence is strong.');
lines.push('- The intersection model remains range-only until ICP/WTP and competitor bottom-up evidence are observed.');
lines.push('- H2 remains gated by paid-flow human signoff and prototype willingness-to-pay evidence.');
lines.push('');
lines.push('## Files');
lines.push('');
lines.push(`- \`${OUT}\``);
lines.push(`- \`${OUT_SUMMARY}\``);

fs.writeFileSync(OUT_DOC, `${lines.join('\n')}\n`);

console.log(`triangulation=${OUT}`);
console.log(`summary=${OUT_SUMMARY}`);
console.log(`doc=${OUT_DOC}`);
console.log(`markets=${rows.length}`);
console.log(`verdicts=${summary.length}`);
