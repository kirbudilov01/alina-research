import fs from 'fs';

const SOURCES = 'data_processed/market_source_registry.csv';
const CLAIMS = 'data_processed/market_claims.csv';
const TAM = 'data_processed/tam_sam_som_model.csv';
const OUT_MATRIX = 'data_processed/market_source_confidence_review.csv';
const OUT_MARKET = 'data_processed/market_confidence_summary.csv';
const OUT_DOC = 'docs/market/market-source-confidence-review-v1.md';

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
  return body.filter(r => r.some(Boolean)).map(r => Object.fromEntries(headers.map((h, i) => [h, r[i] ?? ''])));
}

function csv(file) {
  return fs.existsSync(file) ? parseCsv(fs.readFileSync(file, 'utf8')) : [];
}

function writeCsv(file, rows, headers) {
  fs.writeFileSync(file, [headers.join(','), ...rows.map(row => headers.map(h => csvEscape(row[h])).join(','))].join('\n'));
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

function sourceTypeScore(source) {
  const type = clean(source.source_type).toLowerCase();
  const publisher = clean(source.publisher).toLowerCase();
  if (type.includes('analyst_pdf') || publisher.includes('boston consulting') || publisher.includes('international coaching federation')) return 3;
  if (type.includes('industry_pdf')) return 3;
  if (type.includes('market_report_page')) return 2;
  if (type.includes('press_release')) return 1.5;
  if (type.includes('market_forecast_page')) return 1.5;
  return 1;
}

function sourceDirectnessScore(source) {
  const niche = clean(source.niche);
  const market = clean(source.market).toLowerCase();
  if (['mindfulness', 'astrology_esoterics'].includes(niche)) return 3;
  if (niche === 'coaching' && /career|platform/.test(market)) return 1.5;
  if (niche === 'coaching') return 2;
  if (niche === 'avatar_identity') return 1.5;
  if (niche === 'gaming') return 1;
  return 1;
}

function methodologyScore(source) {
  const notes = clean(`${source.claim_summary} ${source.notes}`).toLowerCase();
  const type = clean(source.source_type).toLowerCase();
  if (type.includes('pdf') && !notes.includes('search result')) return 2.5;
  if (notes.includes('methodology paywalled') || notes.includes('limited methodology')) return 1.5;
  if (notes.includes('search result') || notes.includes('direct open returned')) return 0.5;
  return 1.5;
}

function varianceRisk(source, claims) {
  const niche = clean(source.niche);
  const values = claims
    .filter(row => row.niche === niche && row.claim_type === 'market_size' && row.value)
    .map(row => Number(row.value))
    .filter(Number.isFinite);
  if (values.length < 2) return ['unknown_single_or_thin_anchor', 0.75];
  const min = Math.min(...values);
  const max = Math.max(...values);
  const ratio = min > 0 ? max / min : Infinity;
  if (ratio >= 4) return ['high_variance', -1];
  if (ratio >= 2) return ['medium_variance', -0.5];
  return ['low_variance', 0];
}

function modelRole(source) {
  const niche = clean(source.niche);
  const notes = clean(source.notes).toLowerCase();
  if (niche === 'gaming') return 'mechanic_and_monetization_benchmark_not_direct_tam';
  if (niche === 'avatar_identity') return 'broad_avatar_ceiling_requires_consumer_discount';
  if (niche === 'coaching' && /career|platform|enterprise/.test(`${source.market} ${notes}`.toLowerCase())) return 'adjacent_coaching_benchmark_requires_consumer_discount';
  if (niche === 'astrology_esoterics') return 'direct_adjacent_tam_anchor_requires_variance_review';
  if (niche === 'mindfulness') return 'direct_adjacent_reset_tam_anchor';
  return 'supporting_context';
}

function confidenceBand(score) {
  if (score >= 8) return 'high_use';
  if (score >= 6) return 'medium_use';
  if (score >= 4) return 'low_use_range_only';
  return 'context_only';
}

function actionFor(source, band, variance) {
  const niche = clean(source.niche);
  if (band === 'context_only') return 'Keep as context only; do not anchor TAM/SAM without stronger source.';
  if (variance === 'high_variance') return 'Use as low/base/high range input only; require triangulation before final PDF claim.';
  if (niche === 'gaming') return 'Keep outside direct TAM; use for monetization/progression benchmark only.';
  if (niche === 'avatar_identity') return 'Apply heavy consumer self-improvement discount and validate recurring avatar identity usage.';
  if (niche === 'coaching') return 'Separate enterprise/career coaching from consumer daily ritual coaching before final sizing.';
  return 'Retain as model input; add competitor pricing/revenue proxy review before final claim.';
}

const sources = csv(SOURCES);
const claims = csv(CLAIMS);
const tam = csv(TAM);
const claimsBySource = new Map();
for (const claim of claims) {
  if (!claimsBySource.has(claim.source_id)) claimsBySource.set(claim.source_id, []);
  claimsBySource.get(claim.source_id).push(claim);
}

const reviewRows = sources.map(source => {
  const sourceClaims = claimsBySource.get(source.source_id) || [];
  const [variance, varianceAdj] = varianceRisk(source, claims);
  const typeScore = sourceTypeScore(source);
  const directness = sourceDirectnessScore(source);
  const methodology = methodologyScore(source);
  const claimDepth = Math.min(2, sourceClaims.length);
  const score = Math.round((typeScore + directness + methodology + claimDepth + varianceAdj) * 10) / 10;
  const band = confidenceBand(score);
  return {
    source_id: source.source_id,
    niche: source.niche,
    market: source.market,
    publisher: source.publisher,
    source_title: source.source_title,
    source_type: source.source_type,
    source_url: source.source_url,
    source_confidence_original: source.confidence,
    claim_count: sourceClaims.length,
    source_type_score: typeScore,
    directness_score: directness,
    methodology_score: methodology,
    variance_risk: variance,
    model_role: modelRole(source),
    confidence_review_score: score,
    confidence_review_band: band,
    recommended_model_action: actionFor(source, band, variance)
  };
});

const marketRows = Object.entries(countBy(reviewRows, 'niche')).map(([niche]) => {
  const rows = reviewRows.filter(row => row.niche === niche);
  const marketClaims = claims.filter(row => row.niche === niche);
  const marketSizes = marketClaims.filter(row => row.claim_type === 'market_size' && row.value).map(row => Number(row.value)).filter(Number.isFinite);
  const tamRow = tam.find(row => row.pillar === niche) || {};
  const avgScore = rows.reduce((sum, row) => sum + Number(row.confidence_review_score || 0), 0) / rows.length;
  const highUse = rows.filter(row => row.confidence_review_band === 'high_use').length;
  const mediumUse = rows.filter(row => row.confidence_review_band === 'medium_use').length;
  const lowUse = rows.filter(row => row.confidence_review_band === 'low_use_range_only').length;
  const band = highUse >= 1 && mediumUse >= 1 ? 'stronger_source_base' : mediumUse >= 2 ? 'moderate_source_base' : mediumUse >= 1 ? 'thin_but_usable' : 'thin_or_contextual';
  return {
    niche,
    source_count: rows.length,
    claim_count: marketClaims.length,
    market_size_claims: marketSizes.length,
    min_market_size_claim: marketSizes.length ? Math.min(...marketSizes) : '',
    max_market_size_claim: marketSizes.length ? Math.max(...marketSizes) : '',
    avg_confidence_score: Math.round(avgScore * 10) / 10,
    confidence_band_mix: `high=${highUse};medium=${mediumUse};low=${lowUse};context=${rows.length - highUse - mediumUse - lowUse}`,
    market_confidence_summary: band,
    sam_base: tamRow.samBase || '',
    key_interpretation: marketInterpretation(niche, band)
  };
});

function marketInterpretation(niche, band) {
  if (niche === 'gaming') return 'Strong monetization benchmark but weak directness; keep outside direct Alina TAM.';
  if (niche === 'avatar_identity') return 'Large broad TAM with consumer-recurring-use uncertainty; discount heavily.';
  if (niche === 'astrology_esoterics') return 'Direct adjacent app category but public values vary widely; range-only until triangulated.';
  if (niche === 'coaching') return 'Several sources support coaching demand, but enterprise/career definitions need consumer filtering.';
  if (niche === 'mindfulness') return 'Closest reset-market anchor, but source base is thin and should be triangulated.';
  return `Market confidence: ${band}.`;
}

writeCsv(OUT_MATRIX, reviewRows, [
  'source_id', 'niche', 'market', 'publisher', 'source_title', 'source_type', 'source_url',
  'source_confidence_original', 'claim_count', 'source_type_score', 'directness_score',
  'methodology_score', 'variance_risk', 'model_role', 'confidence_review_score',
  'confidence_review_band', 'recommended_model_action'
]);

writeCsv(OUT_MARKET, marketRows, [
  'niche', 'source_count', 'claim_count', 'market_size_claims', 'min_market_size_claim',
  'max_market_size_claim', 'avg_confidence_score', 'confidence_band_mix',
  'market_confidence_summary', 'sam_base', 'key_interpretation'
]);

const lines = [];
lines.push('# Market Source Confidence Review V1');
lines.push('');
lines.push(`Generated: ${new Date().toISOString()}`);
lines.push('');
lines.push('## Purpose');
lines.push('');
lines.push('This review grades the existing TAM/SAM/SOM source base without adding a new search layer. It separates direct market anchors from broad benchmarks and flags sources that should only be used as range inputs.');
lines.push('');
lines.push('## Source Confidence Bands');
lines.push('');
lines.push(bulletCounts(countBy(reviewRows, 'confidence_review_band')));
lines.push('');
lines.push('## Market Confidence Summary');
lines.push('');
lines.push('| Market | Sources | Claims | Market-Size Claims | Confidence | SAM Base | Interpretation |');
lines.push('| --- | ---: | ---: | ---: | --- | ---: | --- |');
for (const row of marketRows) {
  lines.push(`| ${row.niche} | ${row.source_count} | ${row.claim_count} | ${row.market_size_claims} | ${row.market_confidence_summary} | ${row.sam_base} | ${row.key_interpretation} |`);
}
lines.push('');
lines.push('## Source Review Table');
lines.push('');
lines.push('| Source | Market | Band | Score | Role | Recommended Action |');
lines.push('| --- | --- | --- | ---: | --- | --- |');
for (const row of reviewRows.sort((a, b) => Number(b.confidence_review_score) - Number(a.confidence_review_score))) {
  lines.push(`| ${row.source_id} / ${row.publisher} | ${row.niche} | ${row.confidence_review_band} | ${row.confidence_review_score} | ${row.model_role} | ${row.recommended_model_action} |`);
}
lines.push('');
lines.push('## Implications for TAM/SAM/SOM');
lines.push('');
lines.push('- The intersection SAM should remain range-based and low-confidence until source confidence review is paired with competitor revenue/pricing proxies.');
lines.push('- Gaming remains a retention and monetization benchmark, not direct spend TAM.');
lines.push('- Avatar identity and coaching require the heaviest consumer-use-case discount because several sources are broad, enterprise, platform, or career-oriented.');
lines.push('- Astrology has direct category sources, but public market values vary enough that the model should keep low/base/high ranges visible.');
lines.push('- Mindfulness is the cleanest direct reset-market anchor, but still needs at least two additional credible public sources before a final PDF claim.');
lines.push('');
lines.push('## Files');
lines.push('');
lines.push(`- \`${OUT_MATRIX}\``);
lines.push(`- \`${OUT_MARKET}\``);
fs.writeFileSync(OUT_DOC, `${lines.join('\n')}\n`);

console.log(`matrix=${OUT_MATRIX}`);
console.log(`summary=${OUT_MARKET}`);
console.log(`doc=${OUT_DOC}`);
console.log(`sources=${reviewRows.length}`);
console.log(`markets=${marketRows.length}`);
