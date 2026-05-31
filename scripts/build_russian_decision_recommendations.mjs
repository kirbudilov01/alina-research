import fs from 'fs';

const CSV_OUT = 'data_processed/russian_decision_recommendations.csv';
const DOC_OUT = 'docs/decision/russian-decision-recommendations-v1.md';

for (const dir of ['data_processed', 'docs/decision']) fs.mkdirSync(dir, { recursive: true });

function parseCsv(text) {
  const rows = [];
  let row = [];
  let cell = '';
  let quoted = false;
  for (let i = 0; i < text.length; i += 1) {
    const c = text[i];
    const n = text[i + 1];
    if (quoted) {
      if (c === '"' && n === '"') {
        cell += '"';
        i += 1;
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
  const [headers, ...body] = rows;
  if (!headers) return [];
  return body
    .filter(r => r.some(Boolean))
    .map(r => Object.fromEntries(headers.map((h, i) => [h, r[i] ?? ''])));
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
  fs.writeFileSync(file, `${[headers.join(','), ...rows.map(row => headers.map(h => csvEscape(row[h])).join(','))].join('\n')}\n`);
}

function mdTable(rows, columns) {
  const header = `| ${columns.map(c => c.label).join(' | ')} |`;
  const sep = `| ${columns.map(c => c.align === 'right' ? '---:' : '---').join(' | ')} |`;
  const body = rows.map(row => `| ${columns.map(c => clean(row[c.key]).replace(/\|/g, '/')).join(' | ')} |`);
  return [header, sep, ...body].join('\n');
}

function by(rows, key, value) {
  return rows.find(row => row[key] === value) || {};
}

function firstBy(rows, key, values) {
  return values.map(value => by(rows, key, value)).find(row => Object.keys(row).length) || {};
}

const gates = csv('data_processed/global_hypothesis_gate_snapshot.csv');
const nicheRollup = csv('data_processed/global_niche_count_rollup.csv');
const whitespace = csv('data_processed/global_whitespace_audience_synthesis.csv');
const p0Slice = csv('data_processed/p0_validation_execution_slice.csv');
const intake = csv('data_processed/p0_observed_evidence_intake.csv');

const h1 = by(gates, 'hypothesis_id', 'H1');
const h2 = by(gates, 'hypothesis_id', 'H2');
const h3 = by(gates, 'hypothesis_id', 'H3');
const h4 = by(gates, 'hypothesis_id', 'H4');
const h5 = by(gates, 'hypothesis_id', 'H5');
const h6 = by(gates, 'hypothesis_id', 'H6');
const allHold = gates.length > 0 && gates.every(row => clean(row.decision_ru) === 'оставить hold_validate');
const p0Blocks = [...new Set(p0Slice.map(row => clean(row.execution_block_ru)).filter(Boolean))];

const mindfulness = firstBy(nicheRollup, 'market_id', ['mindfulness_reset', 'mindfulness']);
const avatar = by(nicheRollup, 'market_id', 'avatar_identity');
const astrology = by(nicheRollup, 'market_id', 'astrology_esoterics');
const coaching = firstBy(nicheRollup, 'market_id', ['coaching_self_improvement', 'coaching']);
const gaming = by(nicheRollup, 'market_id', 'gaming_progression');

const rows = [
  {
    recommendation_id: 'REC_01_DECISION_POSTURE',
    block_ru: 'Решение сейчас',
    recommendation_ru: allHold
      ? 'Продолжать как validation-first проект, но не объявлять go/PMF и не продавать отчет как финальное доказательство продукта.'
      : 'Пересмотреть решение по гипотезам после обновления gates.',
    why_ru: `Все gates сейчас: ${gates.map(row => `${row.hypothesis_id}=${row.completed_vs_required}, success ${row.success_vs_threshold}`).join('; ')}.`,
    do_now_ru: 'Использовать отчет как карту рынка и план проверки; в питче говорить “мы проверяем связку”, а не “мы доказали рынок Alina”.',
    do_not_do_ru: 'Не усиливать формулировки до “PMF найден”, “конкурентов нет”, “выручка доказана” или “аудитория подтверждена”.',
    evidence_refs: 'data_processed/global_hypothesis_gate_snapshot.csv;data_processed/validation_gate_calculator.csv'
  },
  {
    recommendation_id: 'REC_02_PRODUCT_SCOPE',
    block_ru: 'MVP',
    recommendation_ru: 'Сузить MVP до одной причинной сессии: personal meaning -> tiny action -> reset -> visible progress/avatar feedback -> next-day hook.',
    why_ru: `H4=${h4.completed_vs_required}, success ${h4.success_vs_threshold}; H6=${h6.completed_vs_required}, success ${h6.success_vs_threshold}. Прототип готов к проверке, но пользовательские сессии еще не доказали петлю.`,
    do_now_ru: 'Сценарий прототипа должен проверять, понял ли человек причинность между действием и изменением progress/avatar.',
    do_not_do_ru: 'Не строить большой feature set, социальные механики, сложную персонализацию или длинный контент до проверки базовой петли.',
    evidence_refs: 'data_processed/prototype_validation_stimulus_flow.csv;data_processed/prototype_validation_scorecard.csv;data_processed/prototype_session_capture_sheet.csv'
  },
  {
    recommendation_id: 'REC_03_MARKET_PRIORITY',
    block_ru: 'Приоритет рынков',
    recommendation_ru: 'Первые product/validation гипотезы держать вокруг Mindfulness/reset + Avatar/identity; Astrology и Coaching использовать как язык аудитории и paid-depth контекст; Gaming оставить benchmark-only.',
    why_ru: `Mindfulness direct=${mindfulness.direct_app_store_dedup_rows || ''}, all=${mindfulness.all_source_dedup_rows || ''}; Avatar direct=${avatar.direct_app_store_dedup_rows || ''}, all=${avatar.all_source_dedup_rows || ''}; Astrology direct=${astrology.direct_app_store_dedup_rows || ''}; Coaching direct=${coaching.direct_app_store_dedup_rows || ''}; Gaming direct=${gaming.direct_app_store_dedup_rows || ''}.`,
    do_now_ru: 'В отчете и прототипе объяснять Alina как трансформационную daily loop, а не как игру, трекер или astrology feed.',
    do_not_do_ru: 'Не включать gaming напрямую в TAM/whitespace claim до доказанного overlap с ritual/self-improvement поведением.',
    evidence_refs: 'data_processed/global_niche_count_rollup.csv;data_processed/global_whitespace_audience_synthesis.csv;data_processed/niche_count_reconciliation.csv'
  },
  {
    recommendation_id: 'REC_04_WHITESPACE_CLAIM',
    block_ru: 'Белое пятно',
    recommendation_ru: 'Формулировать whitespace узко: редкая связка meaning -> action -> reset -> visible identity/progress, а не отсутствие конкурентов.',
    why_ru: `H1=${h1.completed_vs_required}, success ${h1.success_vs_threshold}; H3=${h3.completed_vs_required}, success ${h3.success_vs_threshold}. Public listing signoff есть, но walkthrough внутри приложений еще не выполнен.`,
    do_now_ru: 'Первые 5 walkthrough должны искать hidden clone risk: onboarding, первое действие, progress/avatar feedback и paywall boundary.',
    do_not_do_ru: 'Не писать “рынок пустой” и не считать listing screenshots заменой реального первого опыта продукта.',
    evidence_refs: 'data_processed/manual_walkthrough_capture_sheet.csv;data_processed/manual_competitor_inspection_packet.csv;data_processed/public_listing_inspection_results.csv'
  },
  {
    recommendation_id: 'REC_05_AUDIENCE',
    block_ru: 'Аудитория',
    recommendation_ru: 'Первым ICP считать не демографию, а digital ritual users; стартовые сегменты для проверки: Spiritual self-improvers и Habit and progress users.',
    why_ru: `H5=${h5.completed_vs_required}, success ${h5.success_vs_threshold}. Secondary VOC есть, но recent-behavior интервью еще не закрыты.`,
    do_now_ru: 'В интервью спрашивать последние реальные эпизоды: какие приложения открывали, зачем, что заменяли, где платили, что заставило вернуться.',
    do_not_do_ru: 'Не выбирать ICP по тому, кому “нравится идея”; без recent behavior это слабый сигнал.',
    evidence_refs: 'data_processed/icp_segment_matrix.csv;data_processed/icp_validation_test_plan.csv;data_processed/icp_interview_capture_sheet.csv'
  },
  {
    recommendation_id: 'REC_06_PAID_FLOW',
    block_ru: 'Деньги и WTP',
    recommendation_ru: 'Использовать H2 как strongest directional gate, но добрать paid-flow boundary и WTP на самой петле Alina.',
    why_ru: `H2=${h2.completed_vs_required}, success ${h2.success_vs_threshold}. Есть paid proxy и local signoff, но не доказана готовность платить за Alina loop.`,
    do_now_ru: 'Закрыть P0 paid-flow строки по Character AI, Headspace, Meditopia, Nebula и Carrom Pool; в prototype sessions добавить вопрос о честной платной глубине.',
    do_not_do_ru: 'Не переносить подписочную выручку конкурентов напрямую на Alina без product-match и WTP evidence.',
    evidence_refs: 'data_processed/paid_flow_capture_sheet.csv;data_processed/web_paywall_visual_adjudication.csv;data_processed/market_money_triangulation.csv'
  },
  {
    recommendation_id: 'REC_07_NEXT_SPRINT',
    block_ru: 'Следующий sprint',
    recommendation_ru: `Следующий sprint должен идти в порядке: ${p0Blocks.join(' -> ')}.`,
    why_ru: `P0 intake rows=${intake.length}; routed=${intake.filter(row => clean(row.linked_capture_ids)).length}. Теперь для каждой P0-задачи есть место, куда заносить observed evidence.`,
    do_now_ru: 'Сначала заполнить первые 5 manual walkthrough, затем 5 paid-flow/WTP, затем ICP recent behavior, затем prototype sessions.',
    do_not_do_ru: 'Не расширять desk research новым большим парсингом, пока P0 observed rows пустые: прирост качества сейчас в наблюдениях.',
    evidence_refs: 'data_processed/p0_validation_execution_slice.csv;data_processed/p0_observed_evidence_intake.csv'
  },
  {
    recommendation_id: 'REC_08_UPGRADE_KILL_RULES',
    block_ru: 'Правила решения',
    recommendation_ru: 'Заранее держать upgrade/kill правила: усиливать claim только после наблюдаемых строк, ослаблять сразу при hidden clone, непонятной петле или отказе платить.',
    why_ru: 'Это защищает отчет от красивого, но недоказанного нарратива.',
    do_now_ru: 'После каждого validation блока пересчитать gates, reader/executive PDF, manifest и commit/push.',
    do_not_do_ru: 'Не править выводы руками поверх старых CSV: сначала source/capture rows, потом генераторы.',
    evidence_refs: 'data_processed/validation_gate_calculator.csv;data_processed/research_completion_audit.csv;data_processed/evidence_artifact_manifest.csv'
  }
];

writeCsv(CSV_OUT, rows, [
  'recommendation_id', 'block_ru', 'recommendation_ru', 'why_ru',
  'do_now_ru', 'do_not_do_ru', 'evidence_refs'
]);

const lines = [];
lines.push('# Russian Decision Recommendations V1');
lines.push('');
lines.push(`Generated: ${new Date().toISOString()}`);
lines.push('');
lines.push('## Зачем нужен этот слой');
lines.push('');
lines.push('Этот слой переводит evidence pack в практические рекомендации. Он не усиливает гипотезы сам по себе: каждая рекомендация сохраняет границу между directional desk evidence и observed validation.');
lines.push('');
lines.push('## Рекомендации');
lines.push('');
lines.push(mdTable(rows, [
  { key: 'block_ru', label: 'Блок' },
  { key: 'recommendation_ru', label: 'Рекомендация' },
  { key: 'why_ru', label: 'Почему' },
  { key: 'do_now_ru', label: 'Делать сейчас' },
  { key: 'do_not_do_ru', label: 'Не делать' }
]));
lines.push('');
lines.push('## Evidence refs');
lines.push('');
for (const row of rows) lines.push(`- ${row.recommendation_id}: \`${row.evidence_refs}\``);

fs.writeFileSync(DOC_OUT, `${lines.join('\n')}\n`);

console.log(`decision_recommendations=${CSV_OUT}`);
console.log(`doc=${DOC_OUT}`);
console.log(`rows=${rows.length}`);
