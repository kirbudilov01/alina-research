import fs from 'fs';

const OUT = 'data_processed/russian_market_sizing_playbook.csv';
const DOC = 'docs/market/russian-market-sizing-playbook-v1.md';

for (const dir of ['data_processed', 'docs/market']) fs.mkdirSync(dir, { recursive: true });

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

function money(value) {
  const n = Number(String(value ?? '').replace(/[^\d.-]/g, ''));
  if (!Number.isFinite(n)) return clean(value) || 'n/a';
  return `$${Math.round(n).toLocaleString('en-US')}`;
}

function pct(value) {
  const n = Number(value);
  if (!Number.isFinite(n)) return clean(value) || 'n/a';
  return `${(n * 100).toFixed(n < 0.01 ? 2 : 1)}%`;
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

function ruDirectness(value) {
  const map = {
    mechanic_benchmark: 'benchmark: деньги и retention-паттерны видны, но это не прямой TAM Alina',
    direct_adjacent: 'direct adjacent: можно использовать как рыночный якорь с caveats',
    broad_adjacent: 'broad adjacent: нужен сильный consumer/self-improvement discount',
    intersection_model: 'intersection model: расчетная зона Alina, не внешний market report'
  };
  return map[value] || value;
}

function ruDecision(row, triangulation) {
  if (row.pillar === 'intersection') {
    return 'Читать только как modeled SAM для проверки гипотезы. Нельзя использовать как revenue forecast без ICP/WTP и paid-flow validation.';
  }
  if (row.pillar === 'gaming') {
    return 'Держать вне прямого TAM. Использовать как benchmark механик прогресса, retention и monetization patterns.';
  }
  if (triangulation.money_triangulation_verdict === 'strong_directional_money_case') {
    return 'Деньги видны направленно: можно использовать для приоритизации validation, но не как финальную выручку Alina.';
  }
  return 'Использовать осторожно как range/context до ручного paywall/product-match evidence.';
}

const tam = csv('data_processed/tam_sam_som_model.csv');
const audit = csv('data_processed/market_sizing_assumption_audit.csv');
const triangulation = csv('data_processed/market_money_triangulation.csv');
const stress = csv('data_processed/market_sizing_stress_test.csv');
const sources = csv('data_processed/market_source_confidence_review.csv');

const auditByPillar = new Map(audit.map(row => [row.pillar, row]));
const moneyByPillar = new Map(triangulation.map(row => [row.pillar, row]));

const rows = tam.map(row => {
  const auditRow = auditByPillar.get(row.pillar) || {};
  const moneyRow = moneyByPillar.get(row.pillar) || {};
  const sourceRows = sources.filter(source => source.niche === row.pillar || source.model_role.includes(row.pillar));
  return {
    pillar: row.pillar,
    market: row.market,
    directness_ru: ruDirectness(row.directness),
    tam_low_usd: money(row.tamLow),
    tam_base_usd: money(row.tamBase),
    tam_high_usd: money(row.tamHigh),
    sam_base_pct: pct(row.samBasePct),
    sam_base_usd: money(row.samBase),
    weighted_sam_base_usd: money(auditRow.weighted_sam_base || moneyRow.weighted_sam_base_usd),
    confidence: row.confidence,
    confidence_weight: auditRow.confidence_weight || '',
    source_count: auditRow.source_count || sourceRows.length,
    money_verdict: moneyRow.money_triangulation_verdict || '',
    total_money_evidence_score: moneyRow.total_money_evidence_score || '',
    risk_penalty: moneyRow.risk_penalty || '',
    model_risk_ru: auditRow.model_risk || '',
    formula_read_ru: `SAM base = TAM base ${money(row.tamBase)} * serviceable share ${pct(row.samBasePct)} = ${money(row.samBase)}. Weighted SAM applies confidence/directness weight ${auditRow.confidence_weight || 'n/a'} -> ${money(auditRow.weighted_sam_base || moneyRow.weighted_sam_base_usd)}.`,
    decision_rule_ru: ruDecision(row, moneyRow),
    caveat_ru: moneyRow.main_caveat || row.notes,
    next_proof_ru: moneyRow.recommended_next_proof || auditRow.recommended_action,
    sources: row.sources
  };
});

const headers = [
  'pillar', 'market', 'directness_ru', 'tam_low_usd', 'tam_base_usd', 'tam_high_usd',
  'sam_base_pct', 'sam_base_usd', 'weighted_sam_base_usd', 'confidence',
  'confidence_weight', 'source_count', 'money_verdict', 'total_money_evidence_score',
  'risk_penalty', 'model_risk_ru', 'formula_read_ru', 'decision_rule_ru',
  'caveat_ru', 'next_proof_ru', 'sources'
];

writeCsv(OUT, rows, headers);

const lines = [];
lines.push('# Русский market sizing playbook V1');
lines.push('');
lines.push(`Собрано: ${new Date().toISOString()}`);
lines.push('');
lines.push('## Зачем нужен этот файл');
lines.push('');
lines.push('Этот слой переводит TAM/SAM/SOM модель в русскую методологию. Его задача - объяснить, как читать рынок Alina без ложной точности: где широкий TAM, где serviceable SAM, где confidence weight, где bottom-up money proxy, где стресс-сценарий, а где только гипотеза до paid-flow и WTP evidence.');
lines.push('');
lines.push('## Формулы');
lines.push('');
lines.push('**Top-down:** TAM category -> serviceable share -> SAM -> confidence/directness weighted SAM.');
lines.push('');
lines.push('**Bottom-up stress:** reachable users * activation rate * paid conversion * ARPPU = annual revenue scenario.');
lines.push('');
lines.push('**Competitor proxy:** competitor paid behavior + IAP/paywall/review signals показывают наличие платной привычки, но не доказывают выручку Alina.');
lines.push('');
lines.push('## Market-by-market read');
lines.push('');
lines.push(mdTable(rows, [
  { key: 'pillar', label: 'Pillar' },
  { key: 'directness_ru', label: 'Directness' },
  { key: 'sam_base_usd', label: 'SAM base', align: 'right' },
  { key: 'weighted_sam_base_usd', label: 'Weighted SAM', align: 'right' },
  { key: 'money_verdict', label: 'Money verdict' },
  { key: 'decision_rule_ru', label: 'Как читать' }
], rows.length));
lines.push('');
for (const row of rows) {
  lines.push(`## ${row.pillar}: ${row.market}`);
  lines.push('');
  lines.push(`**Формула:** ${row.formula_read_ru}`);
  lines.push('');
  lines.push(`**Денежный verdict:** ${row.money_verdict || 'n/a'}, score ${row.total_money_evidence_score || 'n/a'}, risk penalty ${row.risk_penalty || 'n/a'}.`);
  lines.push('');
  lines.push(`**Как использовать:** ${row.decision_rule_ru}`);
  lines.push('');
  lines.push(`**Caveat:** ${row.caveat_ru}`);
  lines.push('');
  lines.push(`**Следующий proof:** ${row.next_proof_ru}`);
  lines.push('');
}
lines.push('## Stress scenarios');
lines.push('');
lines.push(mdTable(stress, [
  { key: 'scenario_family', label: 'Scenario' },
  { key: 'reachable_users', label: 'Reachable', align: 'right' },
  { key: 'activation_rate', label: 'Activation' },
  { key: 'paid_conversion', label: 'Paid conv' },
  { key: 'arppu_year', label: 'ARPPU' },
  { key: 'annual_revenue', label: 'Annual revenue', align: 'right' },
  { key: 'stress_read', label: 'Read' }
], stress.length));
lines.push('');
lines.push('## H2 boundary');
lines.push('');
lines.push('H2 нельзя закрывать одной TAM/SAM/SOM таблицей. Для апгрейда нужны paid-flow signoff, product-matched pricing/paywall evidence, ICP willingness-to-pay и прототипный paid-depth signal. До этого все цифры являются range-based prioritization, а не прогнозом выручки.');
lines.push('');
lines.push('## Файлы');
lines.push('');
lines.push(`- \`${OUT}\``);
lines.push(`- \`${DOC}\``);
lines.push('- `data_processed/tam_sam_som_model.csv`');
lines.push('- `data_processed/market_sizing_assumption_audit.csv`');
lines.push('- `data_processed/market_money_triangulation.csv`');
lines.push('- `data_processed/market_sizing_stress_test.csv`');
lines.push('- `data_processed/market_source_confidence_review.csv`');

fs.writeFileSync(DOC, `${lines.join('\n')}\n`);

console.log(`russian_market_sizing_playbook_rows=${rows.length}`);
console.log(`doc=${DOC}`);
