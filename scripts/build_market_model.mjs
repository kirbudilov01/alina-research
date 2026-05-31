import fs from 'fs';

const OUT_TAM = 'data_processed/tam_sam_som_model.csv';
const OUT_SCENARIOS = 'data_processed/som_sensitivity_scenarios.csv';
const OUT_REVIEW = 'data_processed/top_intersection_review_candidates.csv';
const OUT_SUMMARY = 'docs/market/tam-sam-som-model-v1.md';
const MARKET_CONFIDENCE = 'data_processed/market_confidence_summary.csv';
const MARKET_SOURCE_CONFIDENCE = 'data_processed/market_source_confidence_review.csv';

const CATEGORY_MARKETS = [
  {
    pillar: 'gaming',
    market: 'mobile gaming',
    directness: 'mechanic_benchmark',
    tamLow: 113_000_000_000,
    tamBase: 134_220_000_000,
    tamHigh: 166_000_000_000,
    samLowPct: 0.002,
    samBasePct: 0.005,
    samHighPct: 0.01,
    confidence: 'medium',
    sources: 'SRC-MKT-0001|SRC-MKT-0002',
    notes: 'Gaming is primarily a retention and monetization benchmark for Alina, not direct direct-spend TAM.'
  },
  {
    pillar: 'astrology_esoterics',
    market: 'astrology apps',
    directness: 'direct_adjacent',
    tamLow: 5_690_000_000,
    tamBase: 6_240_000_000,
    tamHigh: 16_070_000_000,
    samLowPct: 0.03,
    samBasePct: 0.06,
    samHighPct: 0.10,
    confidence: 'low_medium',
    sources: 'SRC-MKT-0006|SRC-MKT-0007|SRC-MKT-0008|SRC-MKT-0009',
    notes: 'Public astrology market pages vary widely; use as range only until app-revenue proxies are added.'
  },
  {
    pillar: 'avatar_identity',
    market: 'AI avatars',
    directness: 'broad_adjacent',
    tamLow: 1_920_000_000,
    tamBase: 8_400_000_000,
    tamHigh: 14_130_000_000,
    samLowPct: 0.02,
    samBasePct: 0.05,
    samHighPct: 0.08,
    confidence: 'medium',
    sources: 'SRC-MKT-0004',
    notes: 'Broad avatar TAM includes enterprise digital humans; consumer identity/self-improvement share is much smaller.'
  },
  {
    pillar: 'coaching',
    market: 'digital coaching and AI coaching',
    directness: 'direct_adjacent',
    tamLow: 4_220_000_000,
    tamBase: 5_000_000_000,
    tamHigh: 6_690_000_000,
    samLowPct: 0.03,
    samBasePct: 0.06,
    samHighPct: 0.10,
    confidence: 'medium',
    sources: 'SRC-MKT-0005|SRC-MKT-0010|SRC-MKT-0011|SRC-MKT-0012',
    notes: 'Includes coaching platforms and AI career coaching; consumer daily self-improvement subset needs discounting.'
  },
  {
    pillar: 'mindfulness',
    market: 'meditation and mindfulness apps',
    directness: 'direct_adjacent',
    tamLow: 1_680_000_000,
    tamBase: 1_680_000_000,
    tamHigh: 4_620_000_000,
    samLowPct: 0.08,
    samBasePct: 0.15,
    samHighPct: 0.25,
    confidence: 'medium',
    sources: 'SRC-MKT-0003',
    notes: 'Most direct app-market anchor for Alina reset/mindfulness layer.'
  }
];

const SOM_SCENARIOS = [
  { scenario: 'conservative_12m', reachableUsers: 100_000, activationRate: 0.35, paidConversion: 0.03, arppuYear: 60 },
  { scenario: 'base_24m', reachableUsers: 1_000_000, activationRate: 0.40, paidConversion: 0.05, arppuYear: 80 },
  { scenario: 'upside_36m', reachableUsers: 5_000_000, activationRate: 0.45, paidConversion: 0.08, arppuYear: 100 },
  { scenario: 'breakout_36m', reachableUsers: 10_000_000, activationRate: 0.50, paidConversion: 0.10, arppuYear: 120 }
];

function money(n) {
  return Math.round(n);
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

function parseCsv(text) {
  const rows = [];
  let row = [];
  let cell = '';
  let quoted = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    const n = text[i + 1];
    if (quoted) {
      if (c === '"' && n === '"') {
        cell += '"';
        i++;
      } else if (c === '"') {
        quoted = false;
      } else {
        cell += c;
      }
    } else if (c === '"') {
      quoted = true;
    } else if (c === ',') {
      row.push(cell);
      cell = '';
    } else if (c === '\n') {
      row.push(cell);
      rows.push(row);
      row = [];
      cell = '';
    } else if (c !== '\r') {
      cell += c;
    }
  }
  if (cell || row.length) {
    row.push(cell);
    rows.push(row);
  }
  const header = rows.shift();
  return rows.filter(r => r.length === header.length).map(r => Object.fromEntries(header.map((h, i) => [h, r[i] || ''])));
}

function csvIfExists(file) {
  return fs.existsSync(file) ? parseCsv(fs.readFileSync(file, 'utf8')) : [];
}

const tamRows = CATEGORY_MARKETS.map(row => ({
  ...row,
  samLow: money(row.tamLow * row.samLowPct),
  samBase: money(row.tamBase * row.samBasePct),
  samHigh: money(row.tamHigh * row.samHighPct)
}));

const directSamLow = tamRows.filter(r => r.directness !== 'mechanic_benchmark').reduce((sum, r) => sum + r.samLow, 0);
const directSamBase = tamRows.filter(r => r.directness !== 'mechanic_benchmark').reduce((sum, r) => sum + r.samBase, 0);
const directSamHigh = tamRows.filter(r => r.directness !== 'mechanic_benchmark').reduce((sum, r) => sum + r.samHigh, 0);

const intersectionDiscounts = { low: 0.08, base: 0.15, high: 0.25 };
const intersection = {
  pillar: 'intersection',
  market: 'Alina direct intersection SAM',
  directness: 'intersection_model',
  tamLow: directSamLow,
  tamBase: directSamBase,
  tamHigh: directSamHigh,
  samLowPct: intersectionDiscounts.low,
  samBasePct: intersectionDiscounts.base,
  samHighPct: intersectionDiscounts.high,
  samLow: money(directSamLow * intersectionDiscounts.low),
  samBase: money(directSamBase * intersectionDiscounts.base),
  samHigh: money(directSamHigh * intersectionDiscounts.high),
  confidence: 'low',
  sources: 'model_from_direct_adjacent_SAM',
  notes: 'Range-based modeled intersection. Must be validated with competitor revenue, user interviews, and conversion tests.'
};

const allTamRows = [...tamRows, intersection];

writeCsv(OUT_TAM, allTamRows, [
  'pillar', 'market', 'directness', 'tamLow', 'tamBase', 'tamHigh',
  'samLowPct', 'samBasePct', 'samHighPct', 'samLow', 'samBase', 'samHigh',
  'confidence', 'sources', 'notes'
]);

const scenarioRows = SOM_SCENARIOS.map(s => ({
  ...s,
  paidUsers: money(s.reachableUsers * s.activationRate * s.paidConversion),
  annualRevenue: money(s.reachableUsers * s.activationRate * s.paidConversion * s.arppuYear),
  shareOfModeledSamBase: ((s.reachableUsers * s.activationRate * s.paidConversion * s.arppuYear) / intersection.samBase).toFixed(6)
}));

writeCsv(OUT_SCENARIOS, scenarioRows, [
  'scenario', 'reachableUsers', 'activationRate', 'paidConversion', 'arppuYear', 'paidUsers', 'annualRevenue', 'shareOfModeledSamBase'
]);

const marketConfidence = csvIfExists(MARKET_CONFIDENCE);
const marketSourceConfidence = csvIfExists(MARKET_SOURCE_CONFIDENCE);

const whitespaceRows = parseCsv(fs.readFileSync('data_processed/whitespace_signal_matrix.csv', 'utf8'));
const featureRows = parseCsv(fs.readFileSync('data_processed/competitor_feature_matrix.csv', 'utf8'));
const featureById = new Map(featureRows.map(row => [row.record_id, row]));
const reviewRows = whitespaceRows
  .filter(row => Number(row.whitespace_score) >= 7)
  .sort((a, b) => Number(b.whitespace_score) - Number(a.whitespace_score) || Number(b.pillar_count) - Number(a.pillar_count))
  .slice(0, 100)
  .map((row, i) => {
    const feature = featureById.get(row.record_id) || {};
    return {
      review_rank: i + 1,
      record_id: row.record_id,
      app_name: row.app_name,
      niche: row.niche,
      platform: row.platform,
      source_kind: row.source_kind,
      keyword: row.keyword,
      rating: feature.rating,
      review_count: feature.review_count,
      pricing_type: feature.pricing_type,
      feature_tags: row.feature_tags,
      audience_tags: row.audience_tags,
      pillar_count: row.pillar_count,
      whitespace_score: row.whitespace_score,
      source_url: row.source_url,
      manual_status: 'pending',
      direct_threat_level: '',
      has_birthdate_or_spiritual_context: '',
      has_daily_action: '',
      has_reset_practice: '',
      has_avatar_progression: '',
      has_visible_progression: '',
      pricing_notes: '',
      review_notes: ''
    };
  });

writeCsv(OUT_REVIEW, reviewRows, [
  'review_rank', 'record_id', 'app_name', 'niche', 'platform', 'source_kind', 'keyword',
  'rating', 'review_count', 'pricing_type', 'feature_tags', 'audience_tags', 'pillar_count',
  'whitespace_score', 'source_url', 'manual_status', 'direct_threat_level',
  'has_birthdate_or_spiritual_context', 'has_daily_action', 'has_reset_practice',
  'has_avatar_progression', 'has_visible_progression', 'pricing_notes', 'review_notes'
]);

const lines = [];
lines.push('# TAM/SAM/SOM Model V1');
lines.push('');
lines.push(`Generated: ${new Date().toISOString()}`);
lines.push('');
lines.push('## Status');
lines.push('');
lines.push('This is a structured sizing model, not a final investment-grade forecast. It turns public market anchors into explicit ranges and makes the assumptions visible.');
lines.push('');
lines.push('## Category TAM and Discounted SAM');
lines.push('');
lines.push('| Pillar | TAM Low | TAM Base | TAM High | SAM Low | SAM Base | SAM High | Confidence |');
lines.push('|---|---:|---:|---:|---:|---:|---:|---|');
for (const r of allTamRows) {
  lines.push(`| ${r.pillar} | ${r.tamLow} | ${r.tamBase} | ${r.tamHigh} | ${r.samLow} | ${r.samBase} | ${r.samHigh} | ${r.confidence} |`);
}
lines.push('');
lines.push('## Modeled Intersection');
lines.push('');
lines.push(`Modeled direct intersection SAM: low ${intersection.samLow}, base ${intersection.samBase}, high ${intersection.samHigh} USD.`);
lines.push('');
lines.push('This is intentionally conservative relative to broad category TAMs because Alina is a consumer daily companion, not the entire gaming, coaching, avatar, astrology, or mindfulness market.');
lines.push('');
if (marketConfidence.length) {
  lines.push('## Source Confidence Review');
  lines.push('');
  lines.push('A separate confidence review grades the source base behind the model. It does not change the TAM/SAM math by itself; it tells us how much trust to place in each market range and what needs triangulation.');
  lines.push('');
  lines.push('| Market | Sources | Claims | Confidence Summary | Source Mix | Interpretation |');
  lines.push('|---|---:|---:|---|---|---|');
  for (const r of marketConfidence) {
    lines.push(`| ${r.niche} | ${r.source_count} | ${r.claim_count} | ${r.market_confidence_summary} | ${r.confidence_band_mix} | ${r.key_interpretation} |`);
  }
  lines.push('');
  lines.push(`Source review rows: ${marketSourceConfidence.length}. See \`docs/market/market-source-confidence-review-v1.md\`.`);
  lines.push('');
}
lines.push('## SOM Scenarios');
lines.push('');
lines.push('| Scenario | Reachable users | Activation | Paid conversion | ARPPU/year | Paid users | Annual revenue | Share of base SAM |');
lines.push('|---|---:|---:|---:|---:|---:|---:|---:|');
for (const s of scenarioRows) {
  lines.push(`| ${s.scenario} | ${s.reachableUsers} | ${s.activationRate} | ${s.paidConversion} | ${s.arppuYear} | ${s.paidUsers} | ${s.annualRevenue} | ${s.shareOfModeledSamBase} |`);
}
lines.push('');
lines.push('## Interpretation');
lines.push('');
lines.push('The market exists, but the current evidence is stronger for adjacent demand than for Alina-specific capture. The next proof layer is not another broad TAM number; it is competitor revenue/pricing enrichment and user-language evidence from reviews/forums.');
lines.push('');
lines.push('## Files');
lines.push('');
lines.push(`- \`${OUT_TAM}\``);
lines.push(`- \`${OUT_SCENARIOS}\``);
lines.push(`- \`${OUT_REVIEW}\``);
if (marketConfidence.length) lines.push(`- \`${MARKET_CONFIDENCE}\``);
if (marketSourceConfidence.length) lines.push(`- \`${MARKET_SOURCE_CONFIDENCE}\``);
lines.push('');
lines.push('## Caveats');
lines.push('');
lines.push('- Astrology app market estimates vary widely across public report pages.');
lines.push('- AI avatar TAM includes enterprise digital humans and must be discounted heavily for consumer identity use.');
lines.push('- Gaming is treated as a mechanic benchmark, not direct TAM.');
lines.push('- SOM scenarios require validation through acquisition, activation, paid conversion, and retention tests.');

fs.writeFileSync(OUT_SUMMARY, `${lines.join('\n')}\n`);

console.log(`tam_rows=${allTamRows.length}`);
console.log(`scenario_rows=${scenarioRows.length}`);
console.log(`review_candidates=${reviewRows.length}`);
console.log(`outputs=${[OUT_TAM, OUT_SCENARIOS, OUT_REVIEW, OUT_SUMMARY].join(',')}`);
