import fs from 'fs';

const OUT = 'data_processed/russian_p0_walkthrough_dossiers.csv';
const DOC = 'docs/competitive/russian-p0-walkthrough-dossiers-v1.md';

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

function riskRu(row) {
  if (row.hidden_clone_risk_public_read === 'high_hidden_clone_risk_requires_app_walkthrough') {
    return 'красный риск: возможный скрытый прямой клон полной петли';
  }
  if (row.public_listing_verdict === 'public_listing_supports_strict_loop_claim') {
    return 'желтый риск: публичный текст похож на строгую петлю, но причинность надо увидеть в приложении';
  }
  if (row.hidden_clone_risk_public_read === 'medium_adjacency_risk') {
    return 'средний риск: adjacent loop может оказаться близким после onboarding';
  }
  return 'низкий публичный риск: листинг поддерживает adjacency, но не доказывает full-loop clone';
}

function nextClaim(row) {
  if (row.hidden_clone_risk_public_read === 'high_hidden_clone_risk_requires_app_walkthrough') {
    return 'если walkthrough подтверждает полный цикл, H3 надо ослабить и явно признать direct clone risk; если нет, Shepherd остается важным reference competitor, но whitespace survives narrower.';
  }
  if (row.public_listing_verdict === 'public_listing_supports_strict_loop_claim') {
    return 'если causality видна в first session, H1/H3 получают сильный competitor boundary; если нет, downgrade public-listing claim до adjacent/progression only.';
  }
  return 'если onboarding не показывает causality, использовать как adjacent benchmark; если неожиданно есть action -> identity/progress, поднять в hidden-clone review.';
}

function slotPlan(slots) {
  return slots
    .sort((a, b) => clean(a.capture_id).localeCompare(clean(b.capture_id)))
    .map(row => `${row.screenshot_slot}: ${row.capture_question} -> ${row.required_filename_stub}`)
    .join(' | ');
}

const inspection = csv('data_processed/manual_competitor_inspection_packet.csv');
const captures = csv('data_processed/manual_walkthrough_capture_sheet.csv');
const publicRows = csv('data_processed/public_listing_inspection_results.csv');
const validationQueue = csv('data_processed/top100_human_validation_queue.csv');

const rows = inspection.map(row => {
  const rank = clean(row.inspection_rank);
  const publicRow = publicRows.find(p => clean(p.inspection_rank) === rank) || {};
  const queueRow = validationQueue.find(q => clean(q.app_store_id) === clean(row.app_store_id)) || {};
  const slots = captures.filter(c => clean(c.inspection_rank) === rank);
  const requiredFiles = slots.map(s => s.required_filename_stub).join('|');
  const completedSlots = slots.filter(s => !['', 'not_started'].includes(clean(s.capture_status))).length;
  return {
    dossier_rank: rank,
    app_name: row.app_name,
    seller_name: row.seller_name,
    archetype: row.archetype,
    competitive_verdict_prefill: row.competitive_verdict_prefill,
    validation_priority_score: row.validation_priority_score,
    risk_read_ru: riskRu(publicRow),
    public_listing_verdict: publicRow.public_listing_verdict || '',
    hidden_clone_risk_public_read: publicRow.hidden_clone_risk_public_read || '',
    action_to_avatar_causality_public_read: publicRow.action_to_avatar_causality_public_read || '',
    revenue_proxy_band: row.revenue_proxy_band,
    observed_iap_price_range: row.observed_iap_price_range,
    top_review_signals: row.top_review_signals || queueRow.top_review_signals || '',
    public_evidence_excerpt: publicRow.public_evidence_excerpt || '',
    required_slots_count: slots.length,
    completed_slots_count: completedSlots,
    screenshot_slot_plan_ru: slotPlan(slots),
    required_filename_stubs: requiredFiles,
    decisive_questions_ru: row.core_inspection_questions,
    pass_condition_ru: row.pass_condition,
    downgrade_or_kill_condition_ru: row.fail_condition,
    claim_update_after_walkthrough_ru: nextClaim(publicRow),
    app_store_url: row.app_store_url || publicRow.source_url || queueRow.app_store_url || '',
    output_target: 'data_processed/manual_competitor_inspection_packet.csv;data_processed/manual_walkthrough_capture_sheet.csv;data_processed/hypothesis_decision_matrix.csv',
    operator_note_ru: 'Сначала сохранить скриншоты по filename stubs, затем заполнить observed_answer/directness_label/action_to_avatar_causality_label/paywall_boundary_label и только после этого обновлять H1/H3/H2.'
  };
});

const headers = [
  'dossier_rank', 'app_name', 'seller_name', 'archetype', 'competitive_verdict_prefill',
  'validation_priority_score', 'risk_read_ru', 'public_listing_verdict',
  'hidden_clone_risk_public_read', 'action_to_avatar_causality_public_read',
  'revenue_proxy_band', 'observed_iap_price_range', 'top_review_signals',
  'public_evidence_excerpt', 'required_slots_count', 'completed_slots_count',
  'screenshot_slot_plan_ru', 'required_filename_stubs', 'decisive_questions_ru',
  'pass_condition_ru', 'downgrade_or_kill_condition_ru', 'claim_update_after_walkthrough_ru',
  'app_store_url', 'output_target', 'operator_note_ru'
];

writeCsv(OUT, rows, headers);

const redRows = rows.filter(row => row.risk_read_ru.startsWith('красный'));
const yellowRows = rows.filter(row => row.risk_read_ru.startsWith('желтый'));
const totalSlots = rows.reduce((sum, row) => sum + Number(row.required_slots_count || 0), 0);
const completedSlots = rows.reduce((sum, row) => sum + Number(row.completed_slots_count || 0), 0);

const lines = [];
lines.push('# Русские P0 walkthrough dossiers V1');
lines.push('');
lines.push(`Собрано: ${new Date().toISOString()}`);
lines.push('');
lines.push('## Зачем нужен этот слой');
lines.push('');
lines.push('Этот dossier превращает P0 competitor walkthrough из набора CSV в исполнимую операторскую очередь. По каждому конкуренту видно, почему он опасен, какой публичный evidence уже найден, какие пять скриншотов надо сохранить, какие labels заполнить и как результат должен изменить H1/H3/H2.');
lines.push('');
lines.push(`Всего dossiers: ${rows.length}. Required screenshot slots: ${totalSlots}. Completed slots: ${completedSlots}. Красный hidden-clone риск: ${redRows.length}. Желтый strict-loop риск: ${yellowRows.length}. Пока completed slots равны нулю, этот слой не закрывает validation; он делает первый observed-evidence проход воспроизводимым.`);
lines.push('');
lines.push('## P0 очередь');
lines.push('');
lines.push(mdTable(rows, [
  { key: 'dossier_rank', label: '#' },
  { key: 'app_name', label: 'Конкурент' },
  { key: 'risk_read_ru', label: 'Риск' },
  { key: 'required_slots_count', label: 'Slots', align: 'right' },
  { key: 'completed_slots_count', label: 'Done', align: 'right' },
  { key: 'claim_update_after_walkthrough_ru', label: 'Как меняет claim' }
], rows.length));
lines.push('');
for (const row of rows) {
  lines.push(`## ${row.dossier_rank}. ${row.app_name}`);
  lines.push('');
  lines.push(`**Риск:** ${row.risk_read_ru}`);
  lines.push('');
  lines.push(`**Публичный read:** ${row.public_listing_verdict}; causality=${row.action_to_avatar_causality_public_read}; hidden_clone=${row.hidden_clone_risk_public_read}.`);
  lines.push('');
  lines.push(`**Деньги:** ${row.revenue_proxy_band}; IAP=${row.observed_iap_price_range || 'нет данных'}.`);
  lines.push('');
  lines.push(`**Review signals:** ${row.top_review_signals}`);
  lines.push('');
  lines.push(`**Скрин-слоты:** ${row.screenshot_slot_plan_ru}`);
  lines.push('');
  lines.push(`**Решающие вопросы:** ${row.decisive_questions_ru}`);
  lines.push('');
  lines.push(`**Pass:** ${row.pass_condition_ru}`);
  lines.push('');
  lines.push(`**Downgrade/kill:** ${row.downgrade_or_kill_condition_ru}`);
  lines.push('');
  lines.push(`**После walkthrough:** ${row.claim_update_after_walkthrough_ru}`);
  lines.push('');
  lines.push(`**URL:** ${row.app_store_url}`);
  lines.push('');
}
lines.push('## Файлы');
lines.push('');
lines.push(`- \`${OUT}\``);
lines.push(`- \`${DOC}\``);
lines.push('- `data_processed/manual_competitor_inspection_packet.csv`');
lines.push('- `data_processed/manual_walkthrough_capture_sheet.csv`');
lines.push('- `data_processed/public_listing_inspection_results.csv`');
lines.push('- `data_processed/top100_human_validation_queue.csv`');

fs.writeFileSync(DOC, `${lines.join('\n')}\n`);

console.log(`russian_p0_walkthrough_dossiers=${rows.length}`);
console.log(`required_screenshot_slots=${totalSlots}`);
console.log(`completed_screenshot_slots=${completedSlots}`);
console.log(`red_hidden_clone_risk=${redRows.length}`);
console.log(`yellow_strict_loop_risk=${yellowRows.length}`);
console.log(`doc=${DOC}`);
