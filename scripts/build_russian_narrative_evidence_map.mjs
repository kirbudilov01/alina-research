import fs from 'fs';

const OUT = 'data_processed/russian_narrative_evidence_map.csv';
const DOC = 'docs/decision/russian-narrative-evidence-map-v1.md';

for (const dir of ['data_processed', 'docs/decision']) fs.mkdirSync(dir, { recursive: true });

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
  if (!fs.existsSync(file) && file === 'data_processed/cross_source_universe_raw.csv') {
    return csv('data_processed/cross_source_universe_raw_index.csv')
      .flatMap(row => fs.existsSync(row.file_path) ? csv(row.file_path) : []);
  }
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

const crossSourceRaw = csv('data_processed/cross_source_universe_raw.csv');
const crossSourceDedup = csv('data_processed/cross_source_universe_dedup.csv');
const marketMoney = csv('data_processed/market_money_triangulation.csv');
const revenueProxy = csv('data_processed/competitor_revenue_proxy_review.csv');
const top100 = csv('data_processed/top100_competitor_review_scorecard.csv');
const whitespace = csv('data_processed/whitespace_signal_matrix.csv');
const saturation = csv('data_processed/cross_source_market_saturation_matrix.csv');
const audience = csv('data_processed/audience_signal_matrix.csv');
const icp = csv('data_processed/icp_segment_matrix.csv');
const redditSignals = csv('data_processed/reddit_mention_signal_matrix.csv');
const redditQueue = csv('data_processed/reddit_manual_reading_queue.csv');
const redditCapture = csv('data_processed/reddit_manual_reading_capture_sheet.csv');
const prototypeFlow = csv('data_processed/prototype_validation_stimulus_flow.csv');
const prototypeScorecard = csv('data_processed/prototype_validation_scorecard.csv');
const completion = csv('data_processed/research_completion_audit.csv');
const gates = csv('data_processed/validation_gate_calculator.csv');
const manifest = csv('data_processed/evidence_artifact_manifest.csv');

const primaryTop100 = top100.filter(row => row.duplicate_flag === 'primary_app_entry');
const behaviorTied = top100.filter(row => row.behavior_tied_progression === 'yes');
const strongMoney = marketMoney.filter(row => row.money_triangulation_verdict === 'strong_directional_money_case');
const mediumMoney = marketMoney.filter(row => row.money_triangulation_verdict === 'medium_directional_money_case');
const strongRevenue = revenueProxy.filter(row => row.revenue_proxy_band === 'strong_bottom_up_money_proxy');
const mediumPlusRevenue = revenueProxy.filter(row => ['strong_bottom_up_money_proxy', 'medium_bottom_up_money_proxy'].includes(row.revenue_proxy_band));
const highWhitespace = whitespace.filter(row => row.whitespace_band === 'high');
const p0Reddit = redditQueue.filter(row => row.priority_band === 'P0_read_first');
const p1Reddit = redditQueue.filter(row => row.priority_band === 'P1_read_next');
const gatesNotStarted = gates.filter(row => row.gate_status === 'not_started');
const openRequirements = completion.filter(row => !/^proved/.test(row.status));

const rows = [
  {
    narrative_step: '01_problem_frame',
    russian_thesis: 'Alina нужно рассматривать не как еще один трекер, медитацию или эзотерическое приложение, а как гипотезу о ежедневной петле личного смысла, действия, reset и видимого прогресса.',
    evidence_summary: `${crossSourceDedup.length} cross-source dedup rows across five markets; ${audience.length} audience signal rows; ${icp.length} ICP hypotheses`,
    proof_files: 'data_processed/cross_source_universe_dedup.csv;data_processed/audience_signal_matrix.csv;data_processed/icp_segment_matrix.csv;reports/alina-russian-narrative-report-v1.md',
    claim_boundary_ru: 'Это формулировка исследовательской рамки, а не доказательство product-market fit.',
    next_validation_step_ru: 'Проверять центральную петлю на конкурентных экранах и прототипных сессиях, а не расширять features бесконечно.',
    report_section: 'Как читать этот документ; 1. Откуда мы начали'
  },
  {
    narrative_step: '02_market_money',
    russian_thesis: 'В соседних рынках видны деньги и платное поведение, но это пока directional proxy, а не доказанная выручка Alina.',
    evidence_summary: `${marketMoney.length} market-money rows; ${strongMoney.length} strong and ${mediumMoney.length} medium directional money cases; ${strongRevenue.length} strong competitor revenue proxies; ${mediumPlusRevenue.length} medium+ competitor revenue proxies`,
    proof_files: 'data_processed/market_money_triangulation.csv;data_processed/competitor_revenue_proxy_review.csv;data_processed/tam_sam_som_model.csv;docs/market/market-money-triangulation-v1.md',
    claim_boundary_ru: 'Нельзя подавать TAM/SAM/SOM как прогноз revenue; H2 остается gated до paid-flow signoff и WTP evidence.',
    next_validation_step_ru: 'Пройти paid-flow capture rows и willingness-to-pay вопросы в ICP/prototype sessions.',
    report_section: '2. Рынки и деньги'
  },
  {
    narrative_step: '03_competitive_density',
    russian_thesis: 'Рынок не пустой: пользователи уже решают куски задачи соседними приложениями, поэтому искать нужно узкую комбинацию, а не широкую категорию.',
    evidence_summary: `${top100.length} top-candidate review rows; ${primaryTop100.length} primary apps; ${behaviorTied.length}/100 behavior-tied progression signal rows`,
    proof_files: 'data_processed/top100_competitor_review_scorecard.csv;data_processed/manual_competitor_inspection_packet.csv;data_processed/public_listing_inspection_results.csv',
    claim_boundary_ru: 'Публичные листинги и metadata могут скрывать реальные onboarding loops; нельзя объявлять whitespace финальным без walkthrough.',
    next_validation_step_ru: 'Закрыть P0 manual walkthrough: onboarding, first action, progress/avatar feedback, first paywall.',
    report_section: '3. Конкурентная плотность'
  },
  {
    narrative_step: '04_whitespace',
    russian_thesis: 'Потенциальное белое пятно - не отдельная функция, а причинная петля meaning -> action -> reset -> visible identity/progress feedback -> return.',
    evidence_summary: `${whitespace.length} whitespace rows; ${highWhitespace.length} high whitespace candidates; ${saturation.length} cross-source saturation markets`,
    proof_files: 'data_processed/whitespace_signal_matrix.csv;data_processed/cross_source_market_saturation_matrix.csv;docs/intersections/cross-source-saturation-whitespace-v1.md',
    claim_boundary_ru: 'Это narrow opportunity hypothesis; gaming/progression остается benchmark-only, пока не доказан прямой consumer overlap.',
    next_validation_step_ru: 'Сравнить Alina loop с P0 конкурентами по causality: действие действительно меняет identity/progress или это декор.',
    report_section: '4. Белое пятно'
  },
  {
    narrative_step: '05_audience_icp',
    russian_thesis: 'Общая аудитория - digital ritual users: люди, которые используют приложения для состояния, идентичности, прогресса и надежды на изменение.',
    evidence_summary: `${audience.length} audience rows; ${icp.length} ICP segments; ${redditSignals.length} coded Reddit rows; ${redditCapture.length} Reddit capture rows`,
    proof_files: 'data_processed/audience_signal_matrix.csv;data_processed/icp_segment_matrix.csv;data_processed/reddit_mention_signal_matrix.csv;data_processed/reddit_manual_reading_capture_sheet.csv',
    claim_boundary_ru: 'Это directional ICP, не финальная персона; Reddit rows не являются representative survey.',
    next_validation_step_ru: 'Провести интервью по двум верхним ICP и заполнить capture sheets с exact quotes и disconfirmation flags.',
    report_section: '5. Аудитория; 6. Reddit/forum слой'
  },
  {
    narrative_step: '06_reddit_language',
    russian_thesis: 'Reddit/forum слой нужен как язык боли и альтернатив: overload, streak anxiety, repetitive content, weak personalization, unclear value before paid.',
    evidence_summary: `${redditSignals.length} coded signals; ${redditQueue.length} unique thread reads; ${p0Reddit.length} P0 and ${p1Reddit.length} P1 reads; ${redditCapture.length} unread/do-not-upgrade capture rows`,
    proof_files: 'data_processed/reddit_mention_signal_matrix.csv;data_processed/reddit_manual_reading_queue.csv;data_processed/reddit_manual_reading_capture_sheet.csv;docs/audience/reddit-manual-reading-capture-sheet-v1.md',
    claim_boundary_ru: 'Пока capture_status=not_started, нельзя цитировать треды во внешнем документе и нельзя усиливать claims.',
    next_validation_step_ru: 'Прочитать P0 треды и заполнить user job, alternatives, rejected patterns, paid/WTP signal, safety boundary, Alina implication.',
    report_section: '6. Что говорит Reddit/forum слой'
  },
  {
    narrative_step: '07_product_core',
    russian_thesis: 'Проверяемая MVP-петля: персональное отражение дня, одно действие, короткий reset, завершение, причинное изменение прогресса/аватара и мягкий next-day hook.',
    evidence_summary: `${prototypeFlow.length} prototype stimulus rows; ${prototypeScorecard.length} scorecard metrics`,
    proof_files: 'data_processed/prototype_validation_stimulus_flow.csv;data_processed/prototype_validation_scorecard.csv;docs/product/prototype-validation-stimulus-v1.md',
    claim_boundary_ru: 'Петля описана и подготовлена к тесту, но нет completed participant evidence.',
    next_validation_step_ru: 'Провести prototype sessions и обновить comprehension, meaning lift, differentiation, return intent и paid-depth signals.',
    report_section: '7. Продуктовое ядро'
  },
  {
    narrative_step: '08_claim_status',
    russian_thesis: 'Текущий честный verdict: продолжать исследование, но не переобещать. Evidence base сильная как подготовка, но не финальная validation proof.',
    evidence_summary: `${completion.length} completion requirements; ${openRequirements.length} not fully proved/final; ${gates.length} validation gates; ${gatesNotStarted.length} not started gates; ${manifest.length} manifest artifacts`,
    proof_files: 'data_processed/research_completion_audit.csv;data_processed/validation_gate_calculator.csv;data_processed/evidence_artifact_manifest.csv',
    claim_boundary_ru: 'Не отмечать цель complete: manual competitor walkthroughs, paid signoff, ICP interviews and prototype sessions remain open.',
    next_validation_step_ru: 'Исполнять P0 validation dashboard, затем пересобрать claims, русский отчет, PDFs, manifest и git commit.',
    report_section: '8. Что доказано; 9. Следующие действия; 10. Verdict'
  },
  {
    narrative_step: '09_validation_operating_system',
    russian_thesis: 'Исследование уже превращено в операционную систему проверки: гипотезы, gates, capture sheets и dashboard показывают, какие claims можно усиливать, а какие нужно держать.',
    evidence_summary: `${gates.length} validation gates; ${gatesNotStarted.length} not-started gates; ${completion.length} completion audit rows`,
    proof_files: 'data_processed/validation_gate_calculator.csv;data_processed/hypothesis_decision_matrix.csv;data_processed/validation_execution_dashboard.csv;data_processed/research_completion_audit.csv',
    claim_boundary_ru: 'Наличие validation OS не равно завершенной валидации; это подготовка к disciplined execution.',
    next_validation_step_ru: 'После каждого ручного evidence capture обновлять gate_status, hypothesis decisions и claim register перед новым PDF.',
    report_section: '9. Следующие действия'
  },
  {
    narrative_step: '10_provenance_and_versioning',
    russian_thesis: 'Все ключевые данные должны оставаться локально воспроизводимыми и версионированными, иначе большой ресерч быстро превращается в набор непроверяемых утверждений.',
    evidence_summary: `${manifest.length} manifest rows; local artifact hashes and row counts tracked; GitHub push used as persistence layer`,
    proof_files: 'data_processed/evidence_artifact_manifest.csv;docs/decision/evidence-package-manifest-v1.md;git remote origin',
    claim_boundary_ru: 'Manifest подтверждает наличие и форму артефактов, но не заменяет human validation содержательных выводов.',
    next_validation_step_ru: 'После каждой партии генерации запускать npm test, diff check, manifest rebuild, commit и push.',
    report_section: 'Ключевые локальные файлы'
  },
  {
    narrative_step: '11_report_style',
    russian_thesis: 'Финальный документ должен читаться как русское последовательное повествование: данные идут внутри рассказа, а не заменяют его.',
    evidence_summary: 'Russian narrative report generated; evidence map is used as the chapter-level argument backbone; PDF output exists through the report pipeline',
    proof_files: 'reports/alina-russian-narrative-report-v1.md;output/pdf/alina-russian-narrative-report-v1.pdf;data_processed/russian_narrative_evidence_map.csv',
    claim_boundary_ru: 'Красивый русский текст не должен усиливать недоказанные claims; каждое сильное утверждение остается связано с boundary.',
    next_validation_step_ru: 'Редактировать будущие главы по схеме: тезис -> доказательство -> ограничение -> следующий validation step.',
    report_section: 'Как читать этот документ; Карта аргумента'
  }
];

writeCsv(OUT, rows, [
  'narrative_step', 'russian_thesis', 'evidence_summary', 'proof_files',
  'claim_boundary_ru', 'next_validation_step_ru', 'report_section'
]);

const lines = [];
lines.push('# Карта доказательного повествования V1');
lines.push('');
lines.push(`Собрано: ${new Date().toISOString()}`);
lines.push('');
lines.push('## Зачем нужен этот файл');
lines.push('');
lines.push('Этот файл связывает evidence warehouse с русским повествовательным отчетом. Он заставляет каждую главу иметь тезис, доказательную опору, границу утверждения, следующий шаг проверки и место в итоговом документе.');
lines.push('');
lines.push('## Карта');
lines.push('');
lines.push(mdTable(rows, [
  { key: 'narrative_step', label: 'Шаг' },
  { key: 'russian_thesis', label: 'Тезис' },
  { key: 'evidence_summary', label: 'Доказательства' },
  { key: 'claim_boundary_ru', label: 'Граница' },
  { key: 'next_validation_step_ru', label: 'Следующий шаг' }
], rows.length));
lines.push('');
lines.push('## Файлы');
lines.push('');
lines.push(`- \`${OUT}\``);
lines.push(`- \`${DOC}\``);

fs.writeFileSync(DOC, `${lines.join('\n')}\n`);

console.log(`russian_narrative_evidence_map_rows=${rows.length}`);
console.log(`doc=${DOC}`);
