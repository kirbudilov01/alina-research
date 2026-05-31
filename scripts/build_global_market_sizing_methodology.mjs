import fs from 'fs';

const OUT = 'data_processed/global_market_sizing_methodology.csv';
const DOC = 'docs/market/global-market-sizing-methodology-v1.md';

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
  const header = rows.shift();
  if (!header) return [];
  return rows
    .filter(r => r.some(Boolean))
    .map(r => Object.fromEntries(header.map((h, i) => [h, r[i] ?? ''])));
}

function csv(file) {
  return fs.existsSync(file) ? parseCsv(fs.readFileSync(file, 'utf8')) : [];
}

function writeCsv(file, rows, headers) {
  fs.writeFileSync(file, `${[headers.join(','), ...rows.map(row => headers.map(h => csvEscape(row[h])).join(','))].join('\n')}\n`);
}

function mdTable(rows, columns, limit = rows.length) {
  const limited = rows.slice(0, limit);
  const header = `| ${columns.map(c => c.label).join(' | ')} |`;
  const sep = `| ${columns.map(c => c.align === 'right' ? '---:' : '---').join(' | ') } |`;
  const body = limited.map(row => `| ${columns.map(c => clean(row[c.key]).replace(/\|/g, '<br>')).join(' | ')} |`);
  return [header, sep, ...body].join('\n');
}

function num(value) {
  const n = Number(String(value ?? '').replace(/[^\d.-]/g, ''));
  return Number.isFinite(n) ? n : 0;
}

function money(value) {
  const n = num(value);
  if (!n) return '$0';
  if (n >= 1_000_000_000) return `$${(n / 1_000_000_000).toFixed(n >= 10_000_000_000 ? 1 : 2)}B`;
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(n >= 100_000_000 ? 0 : 1)}M`;
  return `$${Math.round(n).toLocaleString('en-US')}`;
}

function pct(value) {
  const n = num(value);
  return `${(n * 100).toFixed(n * 100 >= 10 ? 1 : 2)}%`;
}

function directnessRu(value) {
  return ({
    direct_adjacent: 'прямой adjacent-рынок',
    broad_adjacent: 'широкий adjacent-рынок с сильным consumer-discount',
    mechanic_benchmark: 'benchmark механик, не прямой TAM',
    intersection_model: 'расчетное пересечение Alina'
  })[clean(value)] || clean(value);
}

function confidenceRu(value) {
  return ({
    medium: 'средняя',
    low_medium: 'низко-средняя',
    low: 'низкая',
    high: 'высокая'
  })[clean(value)] || clean(value);
}

function riskRu(value) {
  return ({
    benchmark_only_not_direct_tam: 'не считать прямым рынком Alina',
    medium_proxy_supported_risk: 'поддержано proxy, но нужен ручной paid-flow/WTP',
    high_range_variance_risk: 'широкий диапазон источников, нужен conservative range',
    high_source_and_monetization_risk: 'модельное пересечение, высокий риск завысить claim'
  })[clean(value)] || clean(value);
}

function stressReadRu(value) {
  return ({
    tiny_validation_business: 'маленький validation business, полезен для проверки, но не для venture claim',
    niche_early_business: 'ранний нишевый бизнес, имеет смысл при сильной удерживаемости',
    venture_relevant_if_retention_works: 'venture-relevant только если retention и paid depth реально работают',
    large_outcome_requires_distribution_and_retention_proof: 'крупный outcome требует доказанного distribution, retention и WTP'
  })[clean(value)] || clean(value);
}

function readRule(row) {
  const pillar = clean(row.pillar);
  if (pillar === 'intersection') {
    return 'читать как рабочий modeled SAM для проверки, а не как прогноз выручки или investor-grade market claim';
  }
  if (pillar === 'gaming') {
    return 'использовать только как benchmark retention/progression/monetization mechanics, не включать в прямой TAM Alina';
  }
  if (clean(row.directness) === 'broad_adjacent') {
    return 'использовать как money context с сильным consumer/self-improvement discount';
  }
  return 'использовать как directional market-money anchor до ручного paywall, ICP и WTP evidence';
}

const tam = csv('data_processed/tam_sam_som_model.csv');
const audit = csv('data_processed/market_sizing_assumption_audit.csv');
const stress = csv('data_processed/market_sizing_stress_test.csv');

const auditByPillar = new Map(audit.map(row => [row.pillar, row]));

const methodologyRows = tam.map(row => {
  const a = auditByPillar.get(row.pillar) || {};
  return {
    pillar: row.pillar,
    market_ru: row.market,
    directness_ru: directnessRu(row.directness),
    tam_base: money(row.tamBase),
    serviceable_share_base: pct(row.samBasePct),
    sam_base: money(row.samBase),
    confidence_ru: confidenceRu(row.confidence),
    confidence_weight: a.confidence_weight || '',
    weighted_sam_base: money(a.weighted_sam_base),
    source_count: a.source_count || '',
    model_risk_ru: riskRu(a.model_risk),
    read_rule_ru: readRule(row),
    next_proof_ru: clean(a.recommended_action) || 'добавить observed evidence перед усилением claim',
    formula_ru: `SAM = TAM base ${money(row.tamBase)} * serviceable share ${pct(row.samBasePct)} = ${money(row.samBase)}; weighted SAM = ${money(a.weighted_sam_base)}`
  };
});

const stressRows = stress.map(row => ({
  ...row,
  reachable_users_fmt: Number(row.reachable_users || 0).toLocaleString('en-US'),
  activation_rate_fmt: `${(num(row.activation_rate) * 100).toFixed(0)}%`,
  paid_conversion_fmt: `${(num(row.paid_conversion) * 100).toFixed(0)}%`,
  arppu_year_fmt: money(row.arppu_year),
  annual_revenue_fmt: money(row.annual_revenue),
  stress_read_ru: stressReadRu(row.stress_read)
}));

writeCsv(OUT, methodologyRows, [
  'pillar',
  'market_ru',
  'directness_ru',
  'tam_base',
  'serviceable_share_base',
  'sam_base',
  'confidence_ru',
  'confidence_weight',
  'weighted_sam_base',
  'source_count',
  'model_risk_ru',
  'read_rule_ru',
  'next_proof_ru',
  'formula_ru'
]);

const lines = [];
lines.push('# Global Market Sizing Methodology V1');
lines.push('');
lines.push(`Generated: ${new Date().toISOString()}`);
lines.push('');
lines.push('## Что доказывает этот слой');
lines.push('');
lines.push('Этот слой объясняет, как читать TAM/SAM/SOM для мирового Alina Research. Он не пытается дать одну “твердую” цифру рынка. Вместо этого он показывает диапазон adjacent-рынков, conservative serviceable share, confidence weight и границы, после которых claim нельзя усиливать без observed evidence.');
lines.push('');
lines.push('## Формулы');
lines.push('');
lines.push('- Top-down SAM: `TAM base * serviceable share = SAM base`.');
lines.push('- Weighted SAM: `SAM base * confidence/directness weight = weighted SAM`.');
lines.push('- Bottom-up stress: `reachable users * activation rate * paid conversion * ARPPU = annual revenue scenario`.');
lines.push('- H2 upgrade rule: market reports и public pricing дают только directional support; H2 усиливается только после paid-flow signoff, ICP willingness-to-pay и prototype paid-depth signal.');
lines.push('');
lines.push('## Таблица методологии');
lines.push('');
lines.push(mdTable(methodologyRows, [
  { key: 'pillar', label: 'Pillar' },
  { key: 'directness_ru', label: 'Тип рынка' },
  { key: 'tam_base', label: 'TAM base', align: 'right' },
  { key: 'serviceable_share_base', label: 'Share' },
  { key: 'sam_base', label: 'SAM base', align: 'right' },
  { key: 'weighted_sam_base', label: 'Weighted SAM', align: 'right' },
  { key: 'model_risk_ru', label: 'Риск' },
  { key: 'read_rule_ru', label: 'Как читать' }
]));
lines.push('');
lines.push('## Stress-сценарии');
lines.push('');
lines.push(mdTable(stressRows, [
  { key: 'scenario_family', label: 'Сценарий' },
  { key: 'reachable_users_fmt', label: 'Reachable', align: 'right' },
  { key: 'activation_rate_fmt', label: 'Activation' },
  { key: 'paid_conversion_fmt', label: 'Paid conv' },
  { key: 'arppu_year_fmt', label: 'ARPPU' },
  { key: 'annual_revenue_fmt', label: 'Annual revenue', align: 'right' },
  { key: 'stress_read_ru', label: 'Как читать' }
]));
lines.push('');
lines.push('## Файлы');
lines.push('');
lines.push(`- \`${OUT}\``);
lines.push('- `data_processed/tam_sam_som_model.csv`');
lines.push('- `data_processed/market_sizing_assumption_audit.csv`');
lines.push('- `data_processed/market_sizing_stress_test.csv`');
lines.push('- `data_processed/market_money_triangulation.csv`');

fs.writeFileSync(DOC, `${lines.join('\n')}\n`);

console.log(`global_market_sizing_methodology=${OUT}`);
console.log(`doc=${DOC}`);
console.log(`rows=${methodologyRows.length}`);
