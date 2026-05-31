import fs from 'fs';

const OUT = 'data_processed/russian_paid_flow_dossiers.csv';
const DOC = 'docs/market/russian-paid-flow-dossiers-v1.md';

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

function slugIndex(captureId) {
  const match = clean(captureId).match(/^PF_(\d+)/);
  return match ? match[1] : '00';
}

function moneyRisk(row) {
  if (row.visual_adjudication_prefill === 'confirmed_visible_public_pricing') {
    return 'сильный public-pricing сигнал, но нужен human product-match и paid-boundary signoff';
  }
  if (/manual_review|required|prior/i.test(row.visual_adjudication_prefill)) {
    return 'сигнал требует ручного review: публичная страница не дает чистый price/prod-match';
  }
  return 'слабый или смешанный public signal: использовать только как очередь для проверки, не как proof денег';
}

function claimRule(row) {
  if (row.visual_adjudication_prefill === 'confirmed_visible_public_pricing') {
    return 'если price, product-match и paid-boundary подтверждены человеком, H2 получает stronger paid-surface support; если нет, сигнал остается public-pricing proxy.';
  }
  return 'если human review не подтверждает product-match, убрать этот источник из H2 support или понизить до context-only.';
}

function slotPlan(slots) {
  return slots
    .sort((a, b) => clean(a.capture_id).localeCompare(clean(b.capture_id)))
    .map(row => `${row.capture_slot}: ${row.capture_question} -> ${row.required_filename_stub}`)
    .join(' | ');
}

const captureRows = csv('data_processed/paid_flow_capture_sheet.csv');
const visualRows = csv('data_processed/web_paywall_visual_adjudication.csv');
const revenueRows = csv('data_processed/competitor_revenue_proxy_review.csv');

const groups = new Map();
for (const row of captureRows) {
  const key = `${slugIndex(row.capture_id)}:${row.app_name}`;
  if (!groups.has(key)) groups.set(key, []);
  groups.get(key).push(row);
}

const rows = Array.from(groups.entries()).map(([key, slots]) => {
  const first = slots[0] || {};
  const rank = key.split(':')[0];
  const visual = visualRows.find(row => row.app_name === first.app_name) || {};
  const revenue = revenueRows.find(row => row.app_name === first.app_name) || {};
  const completed = slots.filter(row => !['', 'not_started'].includes(clean(row.capture_status))).length;
  return {
    dossier_rank: String(Number(rank)),
    app_name: first.app_name,
    market: first.market || revenue.market || visual.niche || '',
    revenue_proxy_band: first.revenue_proxy_band || revenue.revenue_proxy_band || '',
    visual_adjudication_prefill: first.visual_adjudication_prefill || visual.visual_adjudication || '',
    adjudication_confidence: visual.adjudication_confidence || '',
    price_evidence: visual.price_evidence || revenue.web_price_points || '',
    observed_iap_price_range: revenue.observed_min_price_usd || revenue.observed_max_price_usd
      ? `$${revenue.observed_min_price_usd || '?'}-$${revenue.observed_max_price_usd || '?'}`
      : '',
    review_signal_rows: revenue.review_signal_rows || '',
    top_review_signals: revenue.top_review_signals || '',
    paid_signal_risk_ru: moneyRisk(first),
    required_slots_count: slots.length,
    completed_slots_count: completed,
    paid_flow_slot_plan_ru: slotPlan(slots),
    required_filename_stubs: slots.map(row => row.required_filename_stub).join('|'),
    decisive_questions_ru: 'Видна ли цена или trial? Принадлежит ли paid surface тому же продукту? Появляется ли paywall до или после first meaningful value? Что именно unlocks paid tier? Похожа ли paid depth на Alina logic или это unrelated monetization?',
    upgrade_rule_ru: claimRule(first),
    downgrade_rule_ru: 'если price относится к parent page, B2B offer, unrelated product, login-only flow или не совпадает с user-facing product, H2 claim надо ослабить и убрать источник из сильной опоры.',
    source_url: first.source_url || visual.source_url || revenue.source_urls || '',
    output_target: 'data_processed/paid_flow_capture_sheet.csv;data_processed/web_paywall_visual_adjudication.csv;data_processed/hypothesis_decision_matrix.csv',
    operator_note_ru: 'Сначала сохранить 4 скрина по filename stubs, затем заполнить observed_price_or_trial, paid_flow_label, product_match_label и human_notes. Не усиливать H2 без product-match.'
  };
});

const headers = [
  'dossier_rank', 'app_name', 'market', 'revenue_proxy_band', 'visual_adjudication_prefill',
  'adjudication_confidence', 'price_evidence', 'observed_iap_price_range',
  'review_signal_rows', 'top_review_signals', 'paid_signal_risk_ru',
  'required_slots_count', 'completed_slots_count', 'paid_flow_slot_plan_ru',
  'required_filename_stubs', 'decisive_questions_ru', 'upgrade_rule_ru',
  'downgrade_rule_ru', 'source_url', 'output_target', 'operator_note_ru'
];

writeCsv(OUT, rows, headers);

const confirmed = rows.filter(row => row.visual_adjudication_prefill === 'confirmed_visible_public_pricing');
const totalSlots = rows.reduce((sum, row) => sum + Number(row.required_slots_count || 0), 0);
const completedSlots = rows.reduce((sum, row) => sum + Number(row.completed_slots_count || 0), 0);

const lines = [];
lines.push('# Русские paid-flow dossiers V1');
lines.push('');
lines.push(`Собрано: ${new Date().toISOString()}`);
lines.push('');
lines.push('## Зачем нужен этот слой');
lines.push('');
lines.push('Этот dossier переводит H2 из рыночной модели и pricing proxy в конкретную ручную проверку paid surfaces. Он не доказывает выручку и не заменяет paid intelligence. Его задача - показать, какие страницы и продукты надо проверить человеком, где есть видимая цена, где нужен product-match, где paywall boundary и что должно произойти с H2 после signoff.');
lines.push('');
lines.push(`Всего paid-flow dossiers: ${rows.length}. Required slots: ${totalSlots}. Completed slots: ${completedSlots}. Confirmed public-pricing prefill: ${confirmed.length}. Пока completed slots равны нулю, H2 остается range/proxy-supported, но не final investor-grade.`);
lines.push('');
lines.push('## Очередь paid-flow проверки');
lines.push('');
lines.push(mdTable(rows, [
  { key: 'dossier_rank', label: '#' },
  { key: 'app_name', label: 'Product' },
  { key: 'market', label: 'Market' },
  { key: 'visual_adjudication_prefill', label: 'Prefill' },
  { key: 'price_evidence', label: 'Price evidence' },
  { key: 'required_slots_count', label: 'Slots', align: 'right' },
  { key: 'completed_slots_count', label: 'Done', align: 'right' }
], rows.length));
lines.push('');
for (const row of rows) {
  lines.push(`## ${row.dossier_rank}. ${row.app_name}`);
  lines.push('');
  lines.push(`**Риск чтения:** ${row.paid_signal_risk_ru}`);
  lines.push('');
  lines.push(`**Цена / IAP:** public=${row.price_evidence || 'нет чистой public price'}; store=${row.observed_iap_price_range || 'нет данных'}.`);
  lines.push('');
  lines.push(`**Скрин-слоты:** ${row.paid_flow_slot_plan_ru}`);
  lines.push('');
  lines.push(`**Решающие вопросы:** ${row.decisive_questions_ru}`);
  lines.push('');
  lines.push(`**Upgrade:** ${row.upgrade_rule_ru}`);
  lines.push('');
  lines.push(`**Downgrade:** ${row.downgrade_rule_ru}`);
  lines.push('');
  lines.push(`**URL:** ${row.source_url}`);
  lines.push('');
}
lines.push('## Файлы');
lines.push('');
lines.push(`- \`${OUT}\``);
lines.push(`- \`${DOC}\``);
lines.push('- `data_processed/paid_flow_capture_sheet.csv`');
lines.push('- `data_processed/web_paywall_visual_adjudication.csv`');
lines.push('- `data_processed/competitor_revenue_proxy_review.csv`');

fs.writeFileSync(DOC, `${lines.join('\n')}\n`);

console.log(`russian_paid_flow_dossiers=${rows.length}`);
console.log(`required_paid_flow_slots=${totalSlots}`);
console.log(`completed_paid_flow_slots=${completedSlots}`);
console.log(`confirmed_public_pricing_prefill=${confirmed.length}`);
console.log(`doc=${DOC}`);
