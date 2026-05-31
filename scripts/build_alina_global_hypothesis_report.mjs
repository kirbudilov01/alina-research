import fs from 'fs';

const OUT = 'reports/alina-global-hypothesis-report-v1.md';
const SOURCE_APPENDIX_OUT = 'data_processed/global_hypothesis_source_appendix.csv';
const VALIDATION_QUESTIONNAIRE_OUT = 'data_processed/global_hypothesis_validation_questionnaire.csv';
const GATE_SNAPSHOT_OUT = 'data_processed/global_hypothesis_gate_snapshot.csv';

for (const dir of ['reports', 'data_processed']) fs.mkdirSync(dir, { recursive: true });

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

function num(value) {
  const n = Number(String(value ?? '').replace(/[^\d.-]/g, ''));
  return Number.isFinite(n) ? n : 0;
}

function fmt(value) {
  return Math.round(num(value)).toLocaleString('en-US');
}

function money(value) {
  const n = num(value);
  if (!n) return 'нет данных';
  if (n >= 1_000_000_000) return `$${(n / 1_000_000_000).toFixed(n >= 10_000_000_000 ? 1 : 2)}B`;
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(n >= 100_000_000 ? 0 : 1)}M`;
  return `$${Math.round(n).toLocaleString('en-US')}`;
}

function pct(value) {
  const n = num(value);
  return Number.isFinite(n) ? `${n.toFixed(n % 1 ? 2 : 0)}%` : clean(value);
}

function ratio(done, total) {
  const d = num(done);
  const t = num(total);
  return `${fmt(d)} / ${fmt(t)}`;
}

function statusRu(value) {
  const v = clean(value);
  return ({
    not_started: 'не начато',
    in_progress_insufficient_evidence: 'начато, но доказательств недостаточно',
    complete: 'закрыто',
    completed: 'закрыто',
    blocked: 'заблокировано'
  })[v] || v || 'нет статуса';
}

function decisionRu(value) {
  const v = clean(value);
  return ({
    keeps_hold_validate: 'оставить hold_validate',
    upgrades_go: 'можно усилить до go',
    downgrades_or_kills: 'понизить или остановить гипотезу'
  })[v] || v || 'нет решения';
}

function workstreamRu(value) {
  const v = clean(value);
  return ({
    manual_competitor_walkthrough: 'ручной walkthrough конкурентов',
    paid_flow_validation: 'проверка paywall и платной глубины',
    icp_interviews: 'интервью ICP и recent behavior',
    prototype_user_validation: 'прототипные сессии и scorecard'
  })[v] || v || 'нет workstream';
}

function hypothesisName(value) {
  const v = clean(value);
  return ({
    H1: 'форма продукта существует',
    H2: 'в рынках есть деньги',
    H3: 'есть узкое белое пятно',
    H4: 'конкурентное преимущество правдоподобно',
    H5: 'общая аудитория существует',
    H6: 'продуктовое ядро можно определить'
  })[v] || v || 'гипотеза';
}

function moneyVerdictRu(value) {
  const v = clean(value);
  return ({
    strong_directional_money_case: 'сильный направленный money case',
    medium_directional_money_case: 'средний направленный money case',
    benchmark_money_visible_not_direct_tam: 'деньги видны, но это benchmark, не прямой TAM'
  })[v] || v || 'нет оценки';
}

function moneyProxyRu(value) {
  const v = clean(value);
  return ({
    strong_bottom_up_money_proxy: 'сильный bottom-up proxy',
    medium_bottom_up_money_proxy: 'средний bottom-up proxy',
    weak_bottom_up_money_proxy: 'слабый bottom-up proxy'
  })[v] || v || 'нет proxy';
}

function nextActionRu(value) {
  const v = clean(value);
  return ({
    'Capture onboarding, first action, progress/avatar feedback, and paywall screenshots for the highest-risk public-listing rows.': 'Собрать onboarding, первое действие, progress/avatar feedback, границу paywall/free и заметки по самым рискованным P0-конкурентам.',
    'Use the public-listing risk read to classify action->avatar causality in walkthrough as visible, inferred, absent, or blocked.': 'В walkthrough классифицировать action -> avatar/progress causality как visible, inferred, absent или blocked.',
    'Use stress-test risk rows to prioritize paid-flow inspection and prototype willingness-to-pay questions.': 'Использовать stress-test risk rows, чтобы выбрать следующие paid-flow проверки и WTP-вопросы для прототипа.',
    'Execute the ICP validation packet for the top two segments, then update segment status and selected primary ICP.': 'Провести ICP validation packet для двух P0-сегментов, затем обновить статус сегментов и выбор primary ICP.',
    'Run prototype sessions with the top two ICP segments and fill the scorecard with observed results.': 'Провести прототипные сессии с двумя P0-сегментами и заполнить scorecard наблюдаемыми результатами.',
    'Run prototype sessions and measure loop completion, comprehension, meaning lift, return intent, and paid-depth interest.': 'Провести прототипные сессии и измерить completion, понимание петли, meaning lift, return intent и интерес к paid depth.'
  })[v] || v;
}

function stressReadRu(value) {
  return ({
    tiny_validation_business: 'маленький validation business, полезен для проверки, но не для venture claim',
    niche_early_business: 'ранний нишевый бизнес, имеет смысл при сильной удерживаемости',
    venture_relevant_if_retention_works: 'venture-relevant только если retention и paid depth реально работают',
    large_outcome_requires_distribution_and_retention_proof: 'крупный outcome требует доказанного distribution, retention и WTP'
  })[clean(value)] || clean(value);
}

function by(rows, key, value) {
  return rows.find(row => row[key] === value) || {};
}

function mdTable(rows, columns, limit = rows.length) {
  const limited = rows.slice(0, limit);
  const header = `| ${columns.map(c => c.label).join(' | ')} |`;
  const sep = `| ${columns.map(c => c.align === 'right' ? '---:' : '---').join(' | ')} |`;
  const body = limited.map(row => `| ${columns.map(c => clean(row[c.key]).replace(/\|/g, '/')).join(' | ')} |`);
  return [header, sep, ...body].join('\n');
}

const rawRows = csv('data_processed/cross_source_universe_raw.csv');
const dedupRows = csv('data_processed/cross_source_universe_dedup.csv');
const nicheSummary = csv('data_processed/russian_readable_niche_summary.csv');
const marketDeepDives = csv('data_processed/russian_market_deep_dives.csv');
const whitespace = csv('data_processed/russian_whitespace_decision_map.csv');
const competitors = csv('data_processed/russian_competitor_battlecards.csv');
const icp = csv('data_processed/russian_icp_battlecards.csv');
const voc = csv('data_processed/russian_voc_objection_map.csv');
const productLoop = csv('data_processed/russian_product_loop_cards.csv');
const gates = csv('data_processed/validation_gate_calculator.csv');
const gateCards = csv('data_processed/russian_validation_gate_cards.csv');
const fieldSessionKit = csv('data_processed/russian_field_session_kit.csv');
const prototypeScorecard = csv('data_processed/prototype_validation_scorecard.csv');
const paidSignoff = csv('data_processed/paid_flow_local_signoff.csv');
const tam = csv('data_processed/tam_sam_som_model.csv');
const manifest = csv('data_processed/evidence_artifact_manifest.csv');
const claimAppendix = csv('data_processed/russian_claim_evidence_appendix.csv');
const sourceProvenance = csv('data_processed/russian_source_provenance_index.csv');
const marketSources = csv('data_processed/market_source_registry.csv');
const nextValidationBacklog = csv('data_processed/global_next_validation_backlog.csv');
const marketSizingMethodology = csv('data_processed/global_market_sizing_methodology.csv');
const marketStressScenarios = csv('data_processed/market_sizing_stress_test.csv');

const intersection = by(tam, 'pillar', 'intersection');
const p0Icp = icp.filter(row => clean(row.priority_ru).startsWith('P0'));
const topCompetitors = competitors.slice(0, 12);
const h2 = by(gates, 'gate_id', 'GATE_H2_PAID_FLOW');
const claimById = Object.fromEntries(claimAppendix.map(row => [row.claim_id, row]));
const provByLayer = Object.fromEntries(sourceProvenance.map(row => [row.layer, row]));
const marketSourceIds = marketSources.map(row => row.source_id).join('|');

const gateByHypothesis = Object.fromEntries(gateCards.map(row => [row.hypothesis_id, row]));
const fieldByStep = Object.fromEntries(fieldSessionKit.map(row => [row.step_id, row]));
const prototypeMetricById = Object.fromEntries(prototypeScorecard.map(row => [row.metric_id, row]));
const vocByTheme = Object.fromEntries(voc.map(row => [row.theme_id, row]));

const validationQuestionnaire = [
  {
    block_id: 'VQ_H1_01',
    hypothesis_id: 'H1',
    block_ru: 'Форма продукта и hidden-clone риск',
    question_ru: 'Открой P0-конкурента от первого экрана до первого value moment: есть ли там связка личный смысл -> маленькое действие -> reset -> видимый progress/avatar feedback?',
    what_it_tests_ru: 'Проверяет, существует ли уже полный аналог Alina внутри onboarding, а не только в публичном описании приложения.',
    evidence_to_capture_ru: gateByHypothesis.H1?.exact_evidence_to_collect_ru || 'listing screenshot | onboarding first value | first action | progress/avatar feedback | paywall/free boundary | inspector notes',
    pass_signal_ru: 'Минимум пять P0-приложений вручную прошли все walkthrough-слоты, и полный скрытый клон Alina не найден.',
    downgrade_signal_ru: 'Любой P0-конкурент уже владеет полной петлей Alina с причинностью action -> identity/avatar.'
  },
  {
    block_id: 'VQ_H2_01',
    hypothesis_id: 'H2',
    block_ru: 'Деньги и willingness-to-pay',
    question_ru: 'В каждом high-money конкуренте зафиксируй, где появляется первый честный paywall: до value moment или после него, какая цена, trial, годовая скидка и какая именно depth продается.',
    what_it_tests_ru: 'Отделяет общий факт подписок в adjacent-рынках от product-matched paid evidence для Alina.',
    evidence_to_capture_ru: gateByHypothesis.H2?.exact_evidence_to_collect_ru || 'public pricing screenshot | app/product match | trial length | monthly/annual price | first meaningful paywall boundary',
    pass_signal_ru: 'Для high-money конкурентов подтверждены цена, trial, граница paywall и связь платной глубины с похожей пользовательской работой.',
    downgrade_signal_ru: 'Платные сигналы относятся к нерелевантным продуктам, parent pages, login-gated страницам или paywall появляется до понятной ценности.'
  },
  {
    block_id: 'VQ_H2_02',
    hypothesis_id: 'H2',
    block_ru: 'Деньги и willingness-to-pay',
    question_ru: vocByTheme.VOC_SUBSCRIPTION_VALUE?.interview_probe_ru || 'За что ты уже платишь в этой зоне и что должно случиться бесплатно, чтобы подписка стала честной?',
    what_it_tests_ru: 'Проверяет, возникает ли платная глубина из языка пользователя, а не из желания исследователя монетизировать продукт.',
    evidence_to_capture_ru: fieldByStep.ICP_A_VALUE_WTP?.evidence_to_capture_ru || 'free_value_moment|paid_depth_feature|acceptable_price_range|friend_explanation|return_trigger',
    pass_signal_ru: fieldByStep.ICP_A_VALUE_WTP?.pass_signal_ru || 'Участник называет paid depth после понятного free value moment.',
    downgrade_signal_ru: fieldByStep.ICP_A_VALUE_WTP?.downgrade_signal_ru || 'Вся ценность ожидается бесплатно или paid depth не связана с core loop.'
  },
  {
    block_id: 'VQ_H3_01',
    hypothesis_id: 'H3',
    block_ru: 'Белое пятно и отличие',
    question_ru: 'После walkthrough конкурента выпиши, что именно он закрывает: meaning, action, reset, visual progress, identity/avatar, causality. Где петля разрывается?',
    what_it_tests_ru: 'Делает whitespace узким и проверяемым: не “конкурентов нет”, а “нет причинной связки action -> identity/progress”.',
    evidence_to_capture_ru: gateByHypothesis.H3?.exact_evidence_to_collect_ru || 'listing screenshot | onboarding first value | first action | progress/avatar feedback | paywall/free boundary | inspector notes',
    pass_signal_ru: 'Ручной walkthrough подтверждает, что behavior-tied identity/avatar progression остается редкой среди high-risk substitutes.',
    downgrade_signal_ru: 'Walkthrough показывает распространенные full-loop substitutes или подтверждает скрытый клон.'
  },
  {
    block_id: 'VQ_H4_01',
    hypothesis_id: 'H4',
    block_ru: 'Конкурентное преимущество в прототипе',
    question_ru: 'На экране изменения спросить: что изменилось, почему это изменилось и какое действие это вызвало?',
    what_it_tests_ru: 'Проверяет, считывает ли пользователь причинность, без которой avatar/progress превращается в декорацию.',
    evidence_to_capture_ru: 'completion_time_seconds|comprehension_yes_no|meaning_lift_1_5|differentiation_1_5|return_intent_1_5|verbatim_quote|fatal_objection',
    pass_signal_ru: 'Не менее 80% участников прототипа правильно объясняют причинность personal meaning -> action -> avatar/progress.',
    downgrade_signal_ru: 'Менее 50% участников могут объяснить причинную петлю без подсказки.'
  },
  {
    block_id: 'VQ_H5_01',
    hypothesis_id: 'H5',
    block_ru: 'Аудитория и recent behavior',
    question_ru: 'Какие приложения, ритуалы, дневники, игры, guidance tools, коучи или avatar-продукты ты реально использовал за последние 30 дней, и что запустило последнее использование?',
    what_it_tests_ru: 'Отсекает абстрактный интерес от реального поведения в последние 30 дней.',
    evidence_to_capture_ru: fieldByStep.ICP_A_SCREENER?.evidence_to_capture_ru || 'recent_behavior_match|current_tool|trigger_of_last_use|segment_fit_yes_no',
    pass_signal_ru: fieldByStep.ICP_A_SCREENER?.pass_signal_ru || 'Есть recent behavior и конкретный триггер последнего использования.',
    downgrade_signal_ru: fieldByStep.ICP_A_SCREENER?.downgrade_signal_ru || 'Поведение абстрактное, давно не было или сегмент выбран по вкусу исследователя.'
  },
  {
    block_id: 'VQ_H5_02',
    hypothesis_id: 'H5',
    block_ru: 'Аудитория и current workaround',
    question_ru: 'Расскажи про последний реальный момент, когда тебе нужно было превратить личный смысл, состояние или внутренний сигнал в одно приземленное действие на сегодня.',
    what_it_tests_ru: 'Проверяет силу job-to-be-done и текущие обходные решения пользователя.',
    evidence_to_capture_ru: fieldByStep.ICP_A_PROBLEM_STORY?.evidence_to_capture_ru || 'specific_episode|workaround|pain_intensity_1_5|verbatim_language|rejected_patterns',
    pass_signal_ru: fieldByStep.ICP_A_PROBLEM_STORY?.pass_signal_ru || 'Участник рассказывает конкретный эпизод, current workaround и язык боли без наводки.',
    downgrade_signal_ru: fieldByStep.ICP_A_PROBLEM_STORY?.downgrade_signal_ru || 'Участник рассуждает теоретически или проблема слабее текущих альтернатив.'
  },
  {
    block_id: 'VQ_H6_01',
    hypothesis_id: 'H6',
    block_ru: 'MVP-петля и продуктовое ядро',
    question_ru: 'Пройди прототип от entry до tomorrow hook и попроси участника своими словами назвать продукт: что это, зачем он нужен и почему он может быть нужен завтра?',
    what_it_tests_ru: 'Проверяет, собирается ли MVP в один понятный продукт, а не в набор разрозненных экранов.',
    evidence_to_capture_ru: fieldByStep.ICP_A_PROTOTYPE_WALKTHROUGH?.evidence_to_capture_ru || 'completion_time_seconds|comprehension_yes_no|meaning_lift_1_5|differentiation_1_5|return_intent_1_5|verbatim_quote|fatal_objection',
    pass_signal_ru: 'MVP-петля остается понятной после прототипных сессий и обновления конкурентных walkthrough.',
    downgrade_signal_ru: 'Петля требует слишком много трения или контента, либо пользователи не могут объяснить причинность.'
  },
  {
    block_id: 'VQ_RISK_01',
    hypothesis_id: 'H4|H5|H6',
    block_ru: 'Trust, safety и границы обещания',
    question_ru: vocByTheme.VOC_TRUST_SAFETY?.interview_probe_ru || 'Что сделало бы такой продукт небезопасным, cringe, манипулятивным или не для тебя?',
    what_it_tests_ru: 'Проверяет, не ломает ли spiritual/AI/identity слой доверие еще до проверки retention.',
    evidence_to_capture_ru: 'top_objection|trust_boundary|unsafe_phrase|manipulation_signal|participant_control_needed',
    pass_signal_ru: vocByTheme.VOC_TRUST_SAFETY?.opportunity_ru || 'Пользователь принимает мягкое guidance при ясных ограничениях и контроле.',
    downgrade_signal_ru: vocByTheme.VOC_TRUST_SAFETY?.downgrade_rule_ru || 'Повторяется fatal trust/safety objection.'
  }
];

writeCsv(VALIDATION_QUESTIONNAIRE_OUT, validationQuestionnaire, [
  'block_id',
  'hypothesis_id',
  'block_ru',
  'question_ru',
  'what_it_tests_ru',
  'evidence_to_capture_ru',
  'pass_signal_ru',
  'downgrade_signal_ru'
]);

const gateSnapshot = gates.map(row => ({
  gate_id: row.gate_id,
  hypothesis_id: row.linked_hypotheses,
  hypothesis_ru: hypothesisName(row.linked_hypotheses),
  workstream_ru: workstreamRu(row.workstream),
  gate_status_ru: statusRu(row.gate_status),
  completed_vs_required: ratio(row.completed_rows, row.required_capture_rows),
  success_vs_threshold: ratio(row.success_rows, row.min_success_threshold),
  decision_ru: decisionRu(row.current_decision_effect),
  blocker_ru: row.current_blocker === 'No observed capture rows yet.'
    ? 'нет наблюдаемых capture rows'
    : row.current_blocker === 'Observed evidence is partial and below threshold.'
      ? 'наблюдаемые доказательства частичные и ниже порога'
      : clean(row.current_blocker),
  next_action_ru: nextActionRu(row.next_action)
}));

writeCsv(GATE_SNAPSHOT_OUT, gateSnapshot, [
  'gate_id',
  'hypothesis_id',
  'hypothesis_ru',
  'workstream_ru',
  'gate_status_ru',
  'completed_vs_required',
  'success_vs_threshold',
  'decision_ru',
  'blocker_ru',
  'next_action_ru'
]);

const sourceAppendix = [
  {
    claim_id: 'SRC_01_PROJECT_AND_SCALE',
    report_section: 'Описание проекта и гипотеза #1',
    claim_ru: 'Alina проверяется как мировая consumer-app гипотеза на пересечении meaning, action, reset и visible progress; масштаб source base достаточен для desk research, но не для финального PMF claim.',
    evidence_status_ru: claimById.REQ_competitor_universe?.status_ru || 'доказано как исследовательский слой',
    primary_metric: claimById.REQ_competitor_universe?.primary_metric || `${fmt(rawRows.length)} raw rows; ${fmt(dedupRows.length)} dedup rows`,
    evidence_files: 'data_processed/cross_source_universe_raw_index.csv;data_processed/cross_source_universe_dedup.csv;data_processed/russian_readable_niche_summary.csv',
    source_boundary_ru: 'Это source/discovery coverage, а не ручная проверка каждого конкурента и не proof спроса.'
  },
  {
    claim_id: 'SRC_02_MARKET_SIZING',
    report_section: 'Определение мировых целевых рынков и гипотеза #2',
    claim_ru: 'Пять мировых adjacent-направлений имеют достаточный market-money context для дальнейшей проверки Alina.',
    evidence_status_ru: 'поддержано направленно, но не финальный revenue/WTP proof',
    primary_metric: claimById.REQ_market_money_triangulation?.primary_metric || `market sources=${marketSources.length}; intersection SAM=${money(intersection.samBase)}`,
    evidence_files: `data_processed/tam_sam_som_model.csv;data_processed/market_money_triangulation.csv;data_processed/market_source_registry.csv;source_ids=${marketSourceIds}`,
    source_boundary_ru: 'Market reports часто broad-category/paywalled; использовать как range-based sizing, не как прогноз выручки Alina.'
  },
  {
    claim_id: 'SRC_03_COMPETITORS',
    report_section: 'Определение конкурентов и гипотеза #3',
    claim_ru: 'Конкуренты закрывают отдельные части петли; P0 список нужен для проверки hidden-clone риска.',
    evidence_status_ru: claimById.H1_product_shape_exists?.status_ru || 'готово к проверке, gate открыт',
    primary_metric: claimById.H1_product_shape_exists?.primary_metric || `${topCompetitors.length} P0 competitors`,
    evidence_files: 'data_processed/russian_competitor_battlecards.csv;data_processed/top100_competitor_review_scorecard.csv;data_processed/manual_competitor_inspection_packet.csv',
    source_boundary_ru: 'Public listings и scorecards не заменяют app/onboarding walkthrough screenshots.'
  },
  {
    claim_id: 'SRC_04_WHITESPACE',
    report_section: 'Где дыры и возможность отличиться',
    claim_ru: 'Белое пятно формулируется как узкая причинная петля, а не как отсутствие wellness/coaching/avatar конкурентов.',
    evidence_status_ru: claimById.H3_whitespace_exists?.status_ru || 'поддержано направленно, но не финально доказано',
    primary_metric: claimById.H3_whitespace_exists?.primary_metric || 'full-loop rates by five markets',
    evidence_files: 'data_processed/russian_whitespace_decision_map.csv;data_processed/cross_source_market_saturation_matrix.csv;data_processed/whitespace_signal_matrix.csv',
    source_boundary_ru: 'Whitespace нельзя апгрейдить без manual walkthrough и final verdict_after_inspection.'
  },
  {
    claim_id: 'SRC_05_AUDIENCE',
    report_section: 'Аудитория, интервью и гипотеза #4',
    claim_ru: 'Digital ritual users являются directional ICP, но primary ICP выбирается только после interviews/prototype sessions.',
    evidence_status_ru: claimById.H5_shared_audience_exists?.status_ru || 'поддержано направленно, но не финально доказано',
    primary_metric: claimById.H5_shared_audience_exists?.primary_metric || `${icp.length} ICP hypotheses`,
    evidence_files: 'data_processed/russian_icp_battlecards.csv;data_processed/audience_signal_matrix.csv;data_processed/russian_voc_objection_map.csv',
    source_boundary_ru: 'Audience rows и Reddit/forum signals не являются representative survey и не заменяют recent-behavior interviews.'
  },
  {
    claim_id: 'SRC_06_PRODUCT_CORE',
    report_section: 'Итоговая модель продукта и гипотеза #5',
    claim_ru: 'MVP-петля описана как stimulus design и должна пройти prototype comprehension, differentiation, trust and WTP checks.',
    evidence_status_ru: claimById.H6_product_core_defined?.status_ru || 'поддержано направленно, но не финально доказано',
    primary_metric: claimById.H6_product_core_defined?.primary_metric || `${productLoop.length} product-loop screens`,
    evidence_files: 'data_processed/russian_product_loop_cards.csv;data_processed/prototype_validation_stimulus_flow.csv;data_processed/prototype_validation_scorecard.csv',
    source_boundary_ru: 'Product core не считается доказанным без заполненных prototype_session_capture_sheet и scorecard.'
  },
  {
    claim_id: 'SRC_07_PROVENANCE',
    report_section: 'Источники и границы доказательств',
    claim_ru: 'Пакет трассируем локально через manifest/provenance; missing artifacts отсутствуют после пересборки.',
    evidence_status_ru: claimById.REQ_evidence_package_traceability?.status_ru || 'доказано как исследовательский слой',
    primary_metric: `${fmt(manifest.length)} manifest artifacts; missing=${manifest.filter(row => row.exists !== 'yes').length}`,
    evidence_files: `${provByLayer.artifact_manifest?.main_files || 'data_processed/evidence_artifact_manifest.csv;docs/decision/evidence-package-manifest-v1.md'}`,
    source_boundary_ru: 'Manifest доказывает наличие файлов и хэши, но не заменяет содержательную валидацию claims.'
  }
];

writeCsv(SOURCE_APPENDIX_OUT, sourceAppendix, [
  'claim_id',
  'report_section',
  'claim_ru',
  'evidence_status_ru',
  'primary_metric',
  'evidence_files',
  'source_boundary_ru'
]);

const lines = [];

lines.push('# Alina Research. Мировой рынок и логика гипотез');
lines.push('');
lines.push(`Собрано: ${new Date().toISOString()}`);
lines.push('');
lines.push('## ОПИСАНИЕ ПРОЕКТА И ГИПОТЕЗА #1');
lines.push('');
lines.push('Проект Alina рассматривается не как отдельный трекер привычек, не как очередная библиотека медитаций и не как декоративный avatar app. Базовая идея шире: создать ежедневный цифровой ритуал, в котором пользователь получает личное отражение дня, выбирает одно маленькое действие, проходит короткий reset и видит, что его прогресс или образ себя изменился именно из-за сделанного шага.');
lines.push('');
lines.push('Логика продукта строится вокруг связки meaning -> action -> reset -> visible progress. В этой связке смысл не остается абстрактной интерпретацией, действие не превращается в тяжелую productivity-систему, reset не живет как отдельная медитация, а avatar/progress не является случайной косметикой. Ценность появляется только тогда, когда пользователь понимает причинность: я сделал маленький шаг, и поэтому мой образ прогресса изменился.');
lines.push('');
lines.push('Гипотеза №1: на мировом consumer-app рынке есть место для приложения, которое объединяет личный смысл, короткое действие, reset и причинно видимый прогресс в одну ежедневную петлю. Эта гипотеза пока не доказана как product-market fit, но уже поддержана масштабной картой соседних рынков и конкурентных сигналов.');
lines.push('');
lines.push(`На текущем этапе собрано ${fmt(rawRows.length)} сырьевых source-строк, ${fmt(dedupRows.length)} уникализированных строк и ${fmt(manifest.length)} локальных артефактов. Эти данные нужны не для того, чтобы объявить продукт доказанным, а для последовательной проверки: существует ли рынок, есть ли деньги, насколько плотна конкуренция, где может быть белое пятно, кто аудитория и какую MVP-петлю надо тестировать.`);
lines.push('');
lines.push('## ТЕКУЩИЙ СТАТУС ДОКАЗАТЕЛЬСТВ');
lines.push('');
lines.push('На этом этапе исследование уже масштабное как база источников, но еще не завершенное как наблюдаемая валидация. Поэтому главный вывод должен звучать аккуратно: кабинетный ресерч подтверждает, что направление стоит проверять, но большинство гипотез пока нельзя переводить в “доказано”. Ниже показано, какие ворота уже имеют наблюдаемые строки, а где пока есть только подготовленный пакет для ручной проверки.');
lines.push('');
lines.push(mdTable(gateSnapshot.map(row => ({
  h: row.hypothesis_id,
  name: row.hypothesis_ru,
  stream: row.workstream_ru,
  status: row.gate_status_ru,
  rows: row.completed_vs_required,
  success: row.success_vs_threshold,
  decision: row.decision_ru
})), [
  { key: 'h', label: 'Гипотеза' },
  { key: 'name', label: 'Что проверяем' },
  { key: 'stream', label: 'Поток проверки' },
  { key: 'status', label: 'Статус' },
  { key: 'rows', label: 'Заполнено / нужно' },
  { key: 'success', label: 'Успехи / порог' },
  { key: 'decision', label: 'Решение сейчас' }
]));
lines.push('');
lines.push('Практически это означает следующее: H2 уже имеет 8 заполненных paid-flow строк из 40, но еще ниже минимального порога; H1, H3, H4, H5 и H6 остаются в hold_validate, потому что по ним нет наблюдаемых capture rows. Это не слабость отчета, а защита от преждевременного вывода: большой массив конкурентов и источников показывает, куда идти, но не заменяет walkthrough, интервью и прототипные сессии.');
lines.push('');
lines.push('## ОПРЕДЕЛЕНИЕ МИРОВЫХ ЦЕЛЕВЫХ РЫНКОВ И ГИПОТЕЗА #2');
lines.push('');
lines.push('Для проверки первой гипотезы исследование выделяет пять мировых направлений. Они не равны пяти отдельным продуктам: каждое направление отвечает за один слой будущей ценности Alina. Mindfulness дает reset и привычку платить за эмоциональное состояние. Coaching/self-improvement дает действие, структуру роста и язык прогресса. Astrology/esoterics дает личный смысл, символический контекст и willingness-to-pay за персональные интерпретации. Avatar/identity дает видимое отражение изменения. Gaming/progression используется как benchmark механик возврата, награды и прогресса, но не как прямой рынок Alina.');
lines.push('');
lines.push(mdTable(nicheSummary.map(row => ({
  market: row.ru_name,
  direct: row.direct_app_store_dedup_rows,
  total: row.total_cross_source_dedup_rows,
  apps: row.top100_primary_competitors,
  role: row.role_ru
})), [
  { key: 'market', label: 'Направление' },
  { key: 'direct', label: 'Direct app/store dedup', align: 'right' },
  { key: 'total', label: 'Total dedup', align: 'right' },
  { key: 'apps', label: 'Top-100 apps', align: 'right' },
  { key: 'role', label: 'Роль в гипотезе' }
]));
lines.push('');
lines.push('Гипотеза №2: мировые adjacent-рынки достаточно велики и монетизируемы, чтобы продолжать проверку Alina, но рыночные цифры должны читаться как sizing для направления, а не как прогноз выручки самого продукта.');
lines.push('');
lines.push(mdTable(marketDeepDives.map(row => ({
  market: row.ru_name,
  sam: money(row.sam_base_usd),
  money: moneyVerdictRu(row.money_verdict),
  score: row.money_score,
  boundary: row.boundary_ru
})), [
  { key: 'market', label: 'Рынок' },
  { key: 'sam', label: 'SAM base', align: 'right' },
  { key: 'money', label: 'Денежный вывод' },
  { key: 'score', label: 'Score', align: 'right' },
  { key: 'boundary', label: 'Граница' }
]));
lines.push('');
lines.push(`Intersection SAM в текущей модели равен ${money(intersection.samBase)}. Это рабочая мировая рамка для дальнейшей проверки, а не обещание revenue. Локальный paid-flow signoff сейчас заполнен на ${fmt(paidSignoff.length)} строках; H2 gate имеет статус ${h2.gate_status || 'unknown'}, потому что нужны еще in-app paywall walkthrough и willingness-to-pay evidence.`);
lines.push('');
lines.push('## МЕТОДОЛОГИЯ TAM/SAM/SOM');
lines.push('');
lines.push('Рыночная модель Alina намеренно построена как диапазон, а не как одна “красивая” цифра. Она разделяет широкий TAM, serviceable SAM, confidence-weighted SAM и bottom-up stress-сценарии. Такой подход нужен, потому что Alina находится на пересечении нескольких adjacent-рынков, а не внутри одной готовой категории market report.');
lines.push('');
lines.push('Базовая формула top-down: TAM base умножается на serviceable share и дает SAM base. Затем SAM дополнительно умножается на confidence/directness weight, чтобы не смешивать прямые adjacent-рынки, широкие adjacent-рынки и benchmark-механику. Отдельно используется bottom-up stress: reachable users * activation rate * paid conversion * ARPPU. Этот слой нужен не для прогноза выручки, а для проверки, какой масштаб начинает иметь смысл при разных уровнях distribution, retention и willingness-to-pay.');
lines.push('');
lines.push(mdTable(marketSizingMethodology.map(row => ({
  pillar: row.pillar,
  direct: row.directness_ru,
  sam: row.sam_base,
  weighted: row.weighted_sam_base,
  risk: row.model_risk_ru,
  read: row.read_rule_ru
})), [
  { key: 'pillar', label: 'Pillar' },
  { key: 'direct', label: 'Какой тип рынка' },
  { key: 'sam', label: 'SAM base', align: 'right' },
  { key: 'weighted', label: 'Weighted SAM', align: 'right' },
  { key: 'risk', label: 'Риск модели' },
  { key: 'read', label: 'Как читать' }
]));
lines.push('');
lines.push('Для H2 это означает жесткую границу: TAM/SAM/SOM доказывает, что рынок достаточно интересен для проверки, но не доказывает, что Alina заработает эти деньги. H2 можно усиливать только после product-matched paid-flow signoff, willingness-to-pay в ICP-интервью и paid-depth signal в прототипных сессиях.');
lines.push('');
lines.push(mdTable(marketStressScenarios.map(row => ({
  scenario: row.scenario_family,
  reachable: fmt(row.reachable_users),
  activation: `${(num(row.activation_rate) * 100).toFixed(0)}%`,
  paid: `${(num(row.paid_conversion) * 100).toFixed(0)}%`,
  arppu: money(row.arppu_year),
  revenue: money(row.annual_revenue),
  read: stressReadRu(row.stress_read)
})), [
  { key: 'scenario', label: 'Сценарий' },
  { key: 'reachable', label: 'Reachable users', align: 'right' },
  { key: 'activation', label: 'Activation' },
  { key: 'paid', label: 'Paid conv' },
  { key: 'arppu', label: 'ARPPU' },
  { key: 'revenue', label: 'Annual revenue', align: 'right' },
  { key: 'read', label: 'Как читать' }
]));
lines.push('');
lines.push('## СЦЕНАРИИ ВХОДА КАК СВЯЗУЮЩЕЕ ЗВЕНО');
lines.push('');
lines.push('Сценарии входа для Alina не завязаны на один канал. Логичнее рассматривать несколько мировых consumer-entry сценариев. Первый сценарий - пользователь приходит из состояния тревоги, усталости или перегруза и ищет короткий reset. Второй сценарий - пользователь приходит из self-improvement контекста: он хочет двигаться вперед, но устал от жестких streak и сложных систем. Третий сценарий - пользователь приходит из spiritual/meaning контекста и хочет не просто читать интерпретацию, а превратить ее в действие. Четвертый сценарий - пользователь приходит через avatar/identity интерес и хочет видеть, что версия себя меняется. Пятый сценарий - пользователь возвращается через мягкую progression-механику, если она не выглядит как манипулятивная игра.');
lines.push('');
lines.push('Таким образом, рынок Alina должен рассматриваться не по одному каналу входа, а как пересечение потребностей: состояние, смысл, действие, видимость прогресса и возвращаемость.');
lines.push('');
lines.push('## ОПРЕДЕЛЕНИЕ КОНКУРЕНТОВ И ГИПОТЕЗА #3');
lines.push('');
lines.push('Конкурентная среда подтверждает, что пользователь уже решает части задачи через существующие приложения. В top-100 review сейчас есть meditation apps, habit trackers, AI journals, spiritual guidance apps, avatar/identity apps и progression products. Рынок не пустой, поэтому сильная ставка Alina не может звучать как “конкурентов нет”. Ставка должна быть точнее: конкуренты закрывают отдельные части петли, но полная причинная связка meaning -> action -> reset -> visible identity/progress встречается редко и требует ручной проверки.');
lines.push('');
lines.push(mdTable(topCompetitors.map(row => ({
  app: row.app_name,
  risk: row.threat_ru,
  priority: row.validation_priority_score,
  money: moneyProxyRu(row.revenue_proxy_band),
  check: row.behavior_tied_progression_prefill === 'yes' ? 'проверить full-loop первым' : 'проверить action -> progress causality'
})), [
  { key: 'app', label: 'Конкурент' },
  { key: 'risk', label: 'Риск' },
  { key: 'priority', label: 'Priority', align: 'right' },
  { key: 'money', label: 'Money proxy' },
  { key: 'check', label: 'Что проверить' }
]));
lines.push('');
lines.push('Гипотеза №3: востребованным может стать не отдельный mindfulness, habit, astrology или avatar product, а связанная система, где смысл быстро превращается в действие, а действие становится видимым. Главный риск для этой гипотезы - скрытый прямой клон внутри onboarding P0-конкурентов, прежде всего Shepherd: Spiritual Bible BFF.');
lines.push('');
lines.push('## ГДЕ ДЫРЫ И ВОЗМОЖНОСТЬ ОТЛИЧИТЬСЯ');
lines.push('');
lines.push(mdTable(marketDeepDives.map(row => {
  const w = by(whitespace, 'niche', row.market_id === 'gaming_progression' ? 'gaming' : row.market_id);
  return {
    market: row.ru_name,
    loop: pct(row.full_loop_rate_pct),
    opportunity: w.opportunity_read_ru || row.opportunity_band,
    read: w.h3_decision_read_ru || row.next_validation_move_ru
  };
}), [
  { key: 'market', label: 'Направление' },
  { key: 'loop', label: 'Full-loop rate', align: 'right' },
  { key: 'opportunity', label: 'Opportunity' },
  { key: 'read', label: 'Как читать' }
]));
lines.push('');
lines.push('Наиболее перспективная формулировка белого пятна: не “новый wellness app”, а короткая трансформационная петля с причинным visual feedback. Если прогресс меняется произвольно, продукт станет декоративным avatar toy. Если действие никак не связано со смыслом, продукт станет обычным habit tracker. Если reset живет отдельно, продукт станет библиотекой практик. Поэтому отличие должно проверяться именно на связке, а не на отдельных функциях.');
lines.push('');
lines.push('## АУДИТОРИЯ, ИНТЕРВЬЮ И ГИПОТЕЗА #4');
lines.push('');
lines.push('На текущем этапе аудитория описывается не демографией, а поведением. Рабочее название - digital ritual users: люди, которые уже используют приложения, чтобы регулировать состояние, видеть движение вперед, получать личный смысл, возвращаться к практике и иногда платить за персонализацию, глубину или поддержку.');
lines.push('');
lines.push(mdTable(icp.map(row => ({
  segment: row.segment_name,
  priority: row.priority_ru,
  score: row.evidence_score,
  job: row.core_job_ru
})), [
  { key: 'segment', label: 'Сегмент' },
  { key: 'priority', label: 'Приоритет' },
  { key: 'score', label: 'Score', align: 'right' },
  { key: 'job', label: 'Core job' }
]));
lines.push('');
lines.push(`Первые интервью и прототипные сессии нужно начинать с двух P0-сегментов: ${p0Icp.map(row => row.segment_name).join(' и ') || 'нет данных'}. Первый проверяет, доверяет ли пользователь personal meaning enough to act. Второй проверяет, может ли action-tied progress заменить обычный checklist или streak pressure.`);
lines.push('');
lines.push('Гипотеза №4: primary-аудитория Alina находится среди людей, которые уже имеют recent behavior вокруг daily ritual, progress, reset или personal meaning, и которым нужна не новая функция, а более короткий и связанный цикл изменения.');
lines.push('');
lines.push('## КЛЮЧЕВЫЕ НАБЛЮДЕНИЯ И ВОПРОСЫ ДЛЯ ПРОВЕРКИ');
lines.push('');
lines.push(mdTable(voc.slice(0, 8).map(row => ({
  theme: row.theme_ru,
  signals: fmt(row.evidence_rows),
  probe: row.interview_probe_ru
})), [
  { key: 'theme', label: 'Тема' },
  { key: 'signals', label: 'Signals', align: 'right' },
  { key: 'probe', label: 'Вопрос для интервью' }
]));
lines.push('');
lines.push('Вопросы для следующей проверки должны быть прикладными, как в образце: какой последний цифровой ритуал человек реально использовал; что стало слишком тяжелым или давящим; за какую глубину он уже платит; какая персональная подсказка показалась точной; как он объяснил бы продукт другу; что сделало бы продукт небезопасным, cringe или манипулятивным.');
lines.push('');
lines.push('## ИТОГОВАЯ МОДЕЛЬ ПРОДУКТА И ГИПОТЕЗА #5');
lines.push('');
lines.push('По текущим данным продуктовая модель должна опираться на несколько столпов. Первый столп - персональное отражение дня, которое не выглядит generic motivation. Второй - одно маленькое действие, связанное со смыслом. Третий - короткий reset, который снижает трение перед действием. Четвертый - visible progress или avatar/identity feedback, который меняется причинно. Пятый - мягкий next-day hook без наказания и streak anxiety.');
lines.push('');
lines.push(mdTable(productLoop.map(row => ({
  step: row.step,
  screen: row.screen_name,
  role: row.role_ru,
  success: row.expected_signal_ru
})), [
  { key: 'step', label: 'Шаг' },
  { key: 'screen', label: 'Экран' },
  { key: 'role', label: 'Роль' },
  { key: 'success', label: 'Что должно сработать' }
], 8));
lines.push('');
lines.push('Гипотеза №5: устойчивый MVP возможен, если пользователь за одну короткую сессию понимает причинность петли, чувствует отличие от обычного tracker/meditation/reading app и может объяснить, зачем вернуться завтра. Пока это не доказано: нужны prototype sessions, scorecard и WTP-вопросы.');
lines.push('');
lines.push('## СТОЛПЫ УВЕРЕННОСТИ И ОТКРЫТЫЕ РИСКИ');
lines.push('');
lines.push('Первый столп уверенности - масштаб мирового adjacent landscape: база уже достаточно велика, чтобы видеть рынки и конкурентов. Второй - money proxy: в соседних категориях видны платные привычки. Третий - повторяющиеся pain themes: пользователи говорят о visible progress, personalization, daily anchor, subscription value и trust/safety. Четвертый - narrow whitespace: полная петля выглядит редкой, но только до ручной проверки.');
lines.push('');
lines.push('Главные риски остаются открытыми. P0-конкуренты могут закрывать петлю внутри onboarding. Пользователи могут прочитать avatar/progress как детскую декорацию. Spiritual/meaning layer может вызвать недоверие или safety objection. Paywall может быть понятен в соседних рынках, но не в Alina. Поэтому следующий этап должен не украшать отчет, а собирать observed evidence.');
lines.push('');
lines.push('## СПИСОК ВОПРОСОВ И ПРОВЕРОК ДЛЯ СЛЕДУЮЩЕГО ЭТАПА');
lines.push('');
lines.push('Следующий слой исследования должен собираться как evidence protocol. По каждой гипотезе нужно заранее определить вопрос, наблюдение, артефакт и правило понижения уверенности. Если нет capture row, скриншота, цитаты, цены, walkthrough-заметки или scorecard-метрики, то гипотеза не апгрейдится.');
lines.push('');
lines.push(mdTable(validationQuestionnaire.map(row => ({
  h: row.hypothesis_id,
  block: row.block_ru,
  question: row.question_ru,
  evidence: row.evidence_to_capture_ru,
  pass: row.pass_signal_ru,
  down: row.downgrade_signal_ru
})), [
  { key: 'h', label: 'Гипотеза' },
  { key: 'block', label: 'Блок' },
  { key: 'question', label: 'Вопрос / проверка' },
  { key: 'evidence', label: 'Что сохранить' },
  { key: 'pass', label: 'Сигнал усиления' },
  { key: 'down', label: 'Сигнал ослабления' }
]));
lines.push('');
lines.push('Такой порядок удерживает исследование от преждевременного вывода: сначала формулируется гипотеза, затем показывается рынок, затем конкуренты, затем открытые сомнения, затем интервью/прототип и только после этого обновляется решение. Для мирового рынка это особенно важно: объем данных большой, но решение должно приниматься не по размеру базы, а по тому, выдерживает ли продуктовая петля ручные проверки.');
lines.push('');
lines.push('## БЛИЖАЙШАЯ ОЧЕРЕДЬ ВАЛИДАЦИИ');
lines.push('');
lines.push('Чтобы следующий шаг был исполнимым, из общего command center выделена короткая P0-очередь. Она начинается с hidden-clone walkthrough конкурентов, затем добирает paid-flow evidence, потом проверяет ICP recent behavior и только после этого переводит прототип в scorecard. Такой порядок сохраняет причинность исследования: сначала убираем риск “это уже существует”, затем проверяем деньги, затем аудиторию, затем преимущество продукта.');
lines.push('');
lines.push(mdTable(nextValidationBacklog.slice(0, 14).map(row => ({
  rank: row.backlog_rank,
  lane: row.lane_ru,
  target: row.target,
  h: row.linked_hypotheses,
  action: row.operator_action_ru,
  file: row.output_file_to_update
})), [
  { key: 'rank', label: '#' },
  { key: 'lane', label: 'Поток' },
  { key: 'target', label: 'Цель' },
  { key: 'h', label: 'Гипотезы' },
  { key: 'action', label: 'Что сделать' },
  { key: 'file', label: 'Куда писать evidence' }
]));
lines.push('');
lines.push('Эта очередь не заменяет полный validation command center. Она нужна как первый рабочий слой для следующих 12-24 часов: если заполнить хотя бы первые manual walkthrough и paid-flow задачи, отчет начнет переходить от desk evidence к наблюдаемым доказательствам.');
lines.push('');
lines.push('## ИСТОЧНИКИ И ГРАНИЦЫ ДОКАЗАТЕЛЬСТВ');
lines.push('');
lines.push('Ниже зафиксирована короткая связка claim -> evidence -> boundary для этой мировой версии отчета. Это не полный manifest всех файлов, а читательский слой: он показывает, какие утверждения можно читать как desk/source support, а какие нельзя усиливать без ручных walkthrough, интервью, прототипных сессий или WTP-проверки.');
lines.push('');
lines.push(mdTable(sourceAppendix.map(row => ({
  claim: row.claim_id,
  section: row.report_section,
  status: row.evidence_status_ru,
  metric: row.primary_metric,
  boundary: row.source_boundary_ru
})), [
  { key: 'claim', label: 'Claim' },
  { key: 'section', label: 'Раздел' },
  { key: 'status', label: 'Статус' },
  { key: 'metric', label: 'Метрика' },
  { key: 'boundary', label: 'Граница' }
]));
lines.push('');
lines.push('## БЫСТРЫЕ ВЫВОДЫ ДЛЯ СТРАТЕГИИ');
lines.push('');
lines.push('1. Мировой рынок вокруг Alina есть, но его нельзя сводить к одному TAM: это пересечение mindfulness, coaching, astrology/spiritual guidance, avatar/identity и progression mechanics.');
lines.push('2. Продуктовая ставка должна быть узкой: ежедневная причинная петля, а не комбайн функций.');
lines.push('3. Самые важные проверки - hidden-clone walkthrough, paid-flow signoff, P0 ICP interviews и prototype sessions.');
lines.push('4. Отчет должен оставаться на русском языке, но описывать мировой рынок и глобальные consumer-app категории.');
lines.push('5. Дальше исследование должно идти в строгой последовательности: гипотеза -> рынки -> конкуренты -> интервью -> уточнение гипотезы -> MVP -> вопросы -> вывод.');
lines.push('');
lines.push('## Локальные файлы');
lines.push('');
lines.push('- `reports/alina-global-hypothesis-report-v1.md`');
lines.push('- `output/pdf/alina-global-hypothesis-report-v1.pdf`');
lines.push('- `data_processed/global_hypothesis_source_appendix.csv`');
lines.push('- `data_processed/global_hypothesis_validation_questionnaire.csv`');
lines.push('- `data_processed/global_hypothesis_gate_snapshot.csv`');
lines.push('- `data_processed/global_next_validation_backlog.csv`');
lines.push('- `data_processed/global_market_sizing_methodology.csv`');
lines.push('- `reports/alina-russian-readable-report-v2.md`');
lines.push('- `data_processed/russian_readable_niche_summary.csv`');
lines.push('- `data_processed/validation_gate_calculator.csv`');

fs.writeFileSync(OUT, `${lines.join('\n')}\n`);

console.log(`global_hypothesis_report=${OUT}`);
console.log(`global_hypothesis_source_appendix=${SOURCE_APPENDIX_OUT}`);
console.log(`raw_rows=${rawRows.length}`);
console.log(`dedup_rows=${dedupRows.length}`);
console.log(`markets=${nicheSummary.length}`);
