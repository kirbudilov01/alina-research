import fs from 'fs';

const OUT = 'data_processed/russian_competitor_battlecards.csv';
const DOC = 'docs/competitive/russian-competitor-battlecards-v1.md';

for (const dir of ['data_processed', 'docs/competitive']) fs.mkdirSync(dir, { recursive: true });

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

function moneyRange(row) {
  const direct = clean(row.observed_iap_price_range);
  if (direct) return direct;
  const min = clean(row.observed_min_iap_price_usd);
  const max = clean(row.observed_max_iap_price_usd);
  if (min || max) return `$${min || '?'}-$${max || '?'}`;
  return 'нет публичного IAP range';
}

function ruThreat(row) {
  if (row.competitive_verdict_prefill === 'direct_reference_competitor') return 'прямой reference-риск';
  if (row.revenue_proxy_band === 'strong_bottom_up_money_proxy' && row.behavior_tied_progression_prefill === 'yes') return 'P0 hidden-clone риск';
  if (row.revenue_proxy_band === 'strong_bottom_up_money_proxy') return 'сильный платный close substitute';
  if (/high_priority/.test(row.competitive_verdict_prefill)) return 'высокий close-substitute риск';
  return 'важный adjacent benchmark';
}

function ruInspectionRead(row) {
  if (row.behavior_tied_progression_prefill === 'yes') {
    return 'Публичные данные уже намекают на behavior-tied progression; это нужно проверять первым, потому что такой конкурент может сузить whitespace.';
  }
  return 'Публичные данные показывают близкие primitives, но не подтверждают причинную связку action -> identity/avatar/progress.';
}

const packet = csv('data_processed/manual_competitor_inspection_packet.csv');
const top100 = csv('data_processed/top100_competitor_review_scorecard.csv');
const topById = new Map(top100.map(row => [row.app_store_id, row]));

const rows = packet
  .slice()
  .sort((a, b) => Number(a.inspection_rank || 0) - Number(b.inspection_rank || 0))
  .map(row => {
    const top = topById.get(row.app_store_id) || {};
    return {
      battlecard_rank: row.inspection_rank,
      app_name: row.app_name,
      seller_name: row.seller_name,
      archetype: row.archetype,
      threat_ru: ruThreat(row),
      validation_priority_score: row.validation_priority_score,
      competitive_verdict_prefill: row.competitive_verdict_prefill,
      revenue_proxy_band: row.revenue_proxy_band,
      observed_iap_price_range: moneyRange(row),
      review_signal_rows: row.review_signal_rows,
      top_review_signals: row.top_review_signals,
      behavior_tied_progression_prefill: row.behavior_tied_progression_prefill,
      retention_tags: top.retention_tags || '',
      top_review_jtbd: top.top_review_jtbd || '',
      top_review_pains: top.top_review_pains || '',
      alina_opening_ru: row.alina_opening_prefill,
      inspection_read_ru: ruInspectionRead(row),
      required_screenshot_slots: row.required_screenshot_slots,
      core_inspection_questions_ru: row.core_inspection_questions,
      pass_condition_ru: row.pass_condition,
      fail_condition_ru: row.fail_condition,
      expected_claim_update: row.expected_claim_update,
      app_store_url: row.app_store_url,
      status_boundary_ru: 'AI/public-metadata battlecard only: нельзя усиливать H1/H3/H4/H6 без реального walkthrough, screenshots и финального verdict_after_inspection.'
    };
  });

const headers = [
  'battlecard_rank', 'app_name', 'seller_name', 'archetype', 'threat_ru',
  'validation_priority_score', 'competitive_verdict_prefill', 'revenue_proxy_band',
  'observed_iap_price_range', 'review_signal_rows', 'top_review_signals',
  'behavior_tied_progression_prefill', 'retention_tags', 'top_review_jtbd', 'top_review_pains',
  'alina_opening_ru', 'inspection_read_ru', 'required_screenshot_slots',
  'core_inspection_questions_ru', 'pass_condition_ru', 'fail_condition_ru',
  'expected_claim_update', 'app_store_url', 'status_boundary_ru'
];
writeCsv(OUT, rows, headers);

const lines = [];
lines.push('# Русские battlecards P0 конкурентов V1');
lines.push('');
lines.push(`Собрано: ${new Date().toISOString()}`);
lines.push('');
lines.push('## Зачем нужен этот файл');
lines.push('');
lines.push('Этот слой переводит P0 manual inspection packet в русские карточки конкурентов. Он помогает быстро понять, кто угрожает Alina, какая гипотеза под риском, что уже видно из публичных данных и что нужно проверить в приложении. Это не ручной walkthrough и не финальное доказательство whitespace.');
lines.push('');
lines.push('## Сводка');
lines.push('');
lines.push(mdTable(rows, [
  { key: 'battlecard_rank', label: '#' },
  { key: 'app_name', label: 'Конкурент' },
  { key: 'threat_ru', label: 'Риск' },
  { key: 'validation_priority_score', label: 'Priority', align: 'right' },
  { key: 'revenue_proxy_band', label: 'Money proxy' },
  { key: 'behavior_tied_progression_prefill', label: 'Behavior-tied' }
], rows.length));
lines.push('');
for (const row of rows) {
  lines.push(`## ${row.battlecard_rank}. ${row.app_name}`);
  lines.push('');
  lines.push(`**Риск:** ${row.threat_ru}. **Archetype:** ${row.archetype}. **IAP range:** ${row.observed_iap_price_range}.`);
  lines.push('');
  lines.push(`**Что уже видно:** ${row.inspection_read_ru} Review signals: ${row.top_review_signals || 'n/a'}. JTBD: ${row.top_review_jtbd || 'n/a'}. Pains: ${row.top_review_pains || 'n/a'}.`);
  lines.push('');
  lines.push(`**Открытие для Alina:** ${row.alina_opening_ru}`);
  lines.push('');
  lines.push(`**Что проверить вручную:** ${row.required_screenshot_slots}. Questions: ${row.core_inspection_questions_ru}`);
  lines.push('');
  lines.push(`**Граница:** ${row.status_boundary_ru}`);
  lines.push('');
}
lines.push('## Файлы');
lines.push('');
lines.push(`- \`${OUT}\``);
lines.push(`- \`${DOC}\``);
lines.push('- `data_processed/manual_competitor_inspection_packet.csv`');
lines.push('- `data_processed/top100_competitor_review_scorecard.csv`');

fs.writeFileSync(DOC, `${lines.join('\n')}\n`);

console.log(`russian_competitor_battlecards_rows=${rows.length}`);
console.log(`doc=${DOC}`);
