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

function ruPluralOneFewMany(number, forms) {
  const n = Math.abs(Number(number)) % 100;
  const n1 = n % 10;
  if (n > 10 && n < 20) return forms[2];
  if (n1 > 1 && n1 < 5) return forms[1];
  if (n1 === 1) return forms[0];
  return forms[2];
}

function pricingRu(value) {
  const raw = clean(value);
  if (!raw) return '';
  if (/free_or_freemium_unknown/i.test(raw)) return 'бесплатно или freemium; модель требует проверки';
  return raw
    .replace(/\bfree\b/gi, 'бесплатно')
    .replace(/\bpaid\b/gi, 'платно')
    .replace(/\bin_app_purchase\b/gi, 'встроенные покупки')
    .replace(/\bsubscription\b/gi, 'подписка');
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

function sourceGroupRu(value) {
  const v = clean(value);
  return ({
    mobile_app_store: 'App Store / Google Play',
    google_play_or_android: 'Google Play / Android',
    desktop_store: 'desktop store',
    browser_extension: 'браузерные расширения',
    company_positioning: 'сайт продукта',
    unknown_source: 'открытый источник'
  })[v] || v || 'открытый источник';
}

function marketLabelRu(value) {
  return clean(value)
    .replace(/mindfulness/g, 'mindfulness/reset')
    .replace(/coaching/g, 'coaching/self-improvement')
    .replace(/astrology_esoterics/g, 'astrology/esoterics')
    .replace(/avatar_identity/g, 'avatar/identity')
    .replace(/gaming_progression|gaming/g, 'gaming/progression')
    .replace(/intersection/g, 'пересечение АУРЫ');
}

function coreJobRu(value) {
  const v = clean(value);
  return ({
    'Turn symbolic/personal meaning into one grounded action today.': 'Превратить личный или символический смысл в одно конкретное действие на сегодня.',
    'Make vague growth concrete and keep momentum without streak anxiety.': 'Сделать размытый личный рост видимым и продолжать движение без тревоги из-за streak.',
    'Calm down quickly and return to the day with one manageable next step.': 'Быстро успокоиться и вернуться к дню с одним посильным следующим шагом.',
    'Return because progress feels gentle, visible, and emotionally rewarding.': 'Возвращаться потому, что прогресс ощущается мягким, видимым и эмоционально приятным.',
    'Get structured guidance that turns intention into accountable practice.': 'Получать структурную поддержку, которая превращает намерение в регулярную практику.',
    'See a version of myself change as I make progress.': 'Видеть, как версия себя меняется вместе с реальным прогрессом.'
  })[v] || v;
}

function prototypeScreenRu(value) {
  const v = clean(value);
  return ({
    'Daily meaning entry': 'Вход в смысл дня',
    'Tiny context prompt': 'Короткий контекст',
    'One grounded action': 'Одно конкретное действие',
    'Short reset': 'Короткий reset',
    'Action evidence': 'Подтверждение действия',
    'Identity/avatar feedback': 'Обратная связь через identity/avatar',
    'Next-day hook': 'Причина вернуться завтра',
    'Immediate value check': 'Проверка ценности сразу после петли'
  })[v] || v;
}

function prototypeSignalRu(value) {
  const v = clean(value);
  return ({
    'Participant can explain why this is personal rather than generic content.': 'Участник может объяснить, почему это ощущается личным, а не общей мотивационной фразой.',
    'Participant supplies a concrete lived moment or emotional target.': 'Участник дает конкретный эпизод дня или эмоциональную цель.',
    'Participant sees the action as doable and causally linked to the chosen theme.': 'Участник видит действие как посильное и связанное с выбранной темой.',
    'Participant feels the reset makes action easier without feeling clinical.': 'Участник чувствует, что reset облегчает действие и не выглядит клиническим.',
    'Participant accepts lightweight self-report as enough evidence.': 'Участник принимает легкий самоотчет как достаточное подтверждение действия.',
    'Participant understands action -> identity/avatar causality.': 'Участник понимает причинность: действие меняет identity/avatar.',
    'Participant wants to return and understands continuity.': 'Участник хочет вернуться и понимает продолжение петли.',
    'Participant names the integrated loop in their own words.': 'Участник своими словами называет связанную петлю продукта.'
  })[v] || v;
}

function screenerRu(value) {
  const v = clean(value);
  return v
    .replace(/^In the last 30 days, which apps, rituals, journals, coaches, avatars, or reset tools did you actually use for this job: /, 'Какие приложения, ритуалы, дневники, коучи, avatar-инструменты или reset-практики человек реально использовал за последние 30 дней для задачи: ')
    .replace(/Turn symbolic\/personal meaning into one grounded action today\./g, 'превратить личный или символический смысл в одно конкретное действие на сегодня.')
    .replace(/Make vague growth concrete and keep momentum without streak anxiety\./g, 'сделать размытый личный рост видимым и продолжать движение без тревоги из-за streak.')
    .replace(/Calm down quickly and return to the day with one manageable next step\./g, 'быстро успокоиться и вернуться к дню с одним посильным следующим шагом.')
    .replace(/Return because progress feels gentle, visible, and emotionally rewarding\./g, 'возвращаться потому, что прогресс ощущается мягким, видимым и эмоционально приятным.')
    .replace(/Get structured guidance that turns intention into accountable practice\./g, 'получать структурную поддержку, которая превращает намерение в регулярную практику.')
    .replace(/See a version of myself change as I make progress\./g, 'видеть, как версия себя меняется вместе с реальным прогрессом.');
}

function kvPairs(value) {
  return clean(value).split('|')
    .map(part => {
      const [key, rawCount] = part.split(':');
      return { key: clean(key), count: num(rawCount) };
    })
    .filter(item => item.key);
}

function sumPairs(rows, field) {
  const totals = new Map();
  for (const row of rows) {
    for (const item of kvPairs(row[field])) {
      totals.set(item.key, (totals.get(item.key) || 0) + item.count);
    }
  }
  return [...totals.entries()]
    .map(([key, count]) => ({ key, count }))
    .sort((a, b) => b.count - a.count);
}

function topList(rows, field, limit = 5) {
  const totals = new Map();
  for (const row of rows) {
    for (const key of clean(row[field]).split('|').map(clean).filter(Boolean)) {
      totals.set(key, (totals.get(key) || 0) + 1);
    }
  }
  return [...totals.entries()]
    .map(([key, count]) => ({ key, count }))
    .sort((a, b) => b.count - a.count || a.key.localeCompare(b.key))
    .slice(0, limit);
}

function featureLabelRu(key) {
  return ({
    ai: 'AI-персонализация / AI-чат',
    astrology: 'астрология, horoscope, birth chart',
    tarot_or_oracle: 'tarot/oracle интерпретации',
    manifestation_spirituality: 'manifestation / духовные практики',
    avatar_identity: 'avatar / identity / future-self образ',
    photo_video_generation: 'фото- и video-генерация',
    coaching: 'coaching / советы / план роста',
    habits_streaks: 'habit loop, streak, ежедневные отметки',
    mindfulness: 'meditation, breathing, reset',
    journaling_mood: 'дневник, mood tracking, reflection',
    gaming_progression: 'уровни, XP, квесты, прогресс',
    social_community: 'социальность / community / sharing'
  })[key] || key.replace(/_/g, ' ');
}

function sourceGroupReadableRu(key) {
  return ({
    mobile_app_store: 'App Store: карточки приложений, категории, рейтинги, отзывы и ссылки',
    google_play_or_android: 'Google Play / Android: кросс-проверка карточек и pricing-сигналов',
    desktop_store: 'Desktop/Mac/PC stores: соседние desktop-продукты и productivity/wellness контекст',
    steam_pc: 'Steam: PC/gaming продукты как бенчмарк progression и retention механик',
    itch_web_game: 'itch.io: indie/game эксперименты, avatar/identity и cozy/progression паттерны',
    browser_extension: 'Chrome Web Store: browser-extension слой и lightweight utility patterns',
    community_forum: 'Reddit/forum/community: VOC, боли, обходные решения и язык пользователей',
    company_positioning: 'Сайты компаний/pricing pages: позиционирование, paywall и paid-depth сигналы',
    unknown_source: 'прочие нормализованные source rows'
  })[key] || key.replace(/_/g, ' ');
}

function compactTopApps(rows, limit = 4) {
  return rows
    .filter(row => clean(row.app_name))
    .sort((a, b) => num(b.review_count) - num(a.review_count))
    .slice(0, limit)
    .map(row => row.app_name)
    .join(', ');
}

function signalLabelRu(key) {
  return ({
    loves_daily_loop: 'пользователям нравится ежедневный ритуал',
    loves_avatar_progress: 'пользователям нравится avatar/progress feedback',
    loves_emotional_support: 'ценится эмоциональная поддержка',
    content_depth_request: 'люди просят больше глубины, настроек и персонализации',
    pricing_complaint: 'есть жалобы на цену или подписку',
    churn_signal: 'видны причины оттока',
    quality_bug_complaint: 'сбои ломают доверие и ритуал',
    trust_accuracy_complaint: 'есть жалобы на точность и доверие'
  })[key] || key.replace(/_/g, ' ');
}

function jtbdLabelRu(key) {
  return ({
    jtbd_daily_anchor: 'получить ежедневный якорь',
    jtbd_make_growth_visible: 'сделать рост видимым',
    jtbd_structure_self_improvement: 'структурировать саморазвитие',
    jtbd_belonging_accountability: 'чувствовать поддержку и ответственность',
    jtbd_fast_emotional_reset: 'быстро эмоционально перезагрузиться',
    jtbd_feel_seen_personalized: 'почувствовать, что продукт видит именно меня'
  })[key] || key.replace(/_/g, ' ');
}

function painLabelRu(key) {
  return ({
    pain_content_depth_customization: 'не хватает глубины и кастомизации',
    pain_subscription_value: 'подписка не кажется достаточно ценной',
    pain_signup_access_friction: 'вход и доступ создают трение',
    pain_reliability_breaks_ritual: 'сбои ломают ежедневный ритуал',
    pain_trust_accuracy_safety: 'есть риск доверия, точности и безопасности',
    pain_unclear_game_loop: 'игровая петля считывается неясно'
  })[key] || key.replace(/_/g, ' ');
}

function retentionTagRu(key) {
  return ({
    daily_loop: 'ежедневная петля',
    streaks: 'streak',
    xp_levels: 'уровни/XP',
    avatar_feedback: 'avatar feedback',
    quests_challenges: 'квесты и челленджи',
    journaling_reflection: 'дневник и рефлексия',
    social: 'социальная поддержка',
    reminders_habits: 'напоминания и привычки'
  })[key] || key.replace(/_/g, ' ');
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

function interimConclusion(title, paragraphs) {
  lines.push(`### ${title}`);
  lines.push('');
  for (const paragraph of paragraphs) {
    lines.push(paragraph);
    lines.push('');
  }
}

function relevanceRu(app, marketId) {
  const tags = clean(app.feature_tags).split('|').filter(Boolean);
  const tagText = tags.length
    ? `Отмеченные теги: ${tags.join(', ')}.`
    : 'Релевантность предварительная: по названию, категории и описанию.';
  const reads = {
    mindfulness: 'Показывает рынок короткого reset, mental health, meditation, journaling или эмоциональной саморегуляции. Для АУРЫ это источник языка спокойного входа и ежедневного ритуала.',
    avatar_identity: 'Показывает спрос на avatar/identity/AI companion механику. Для АУРЫ важно проверить, может ли образ себя меняться не декоративно, а причинно от действия.',
    astrology_esoterics: 'Показывает рынок личного смысла: horoscope, tarot, moon/spiritual guidance, manifestation или symbolic reflection. Для АУРЫ это источник входа через смысл, но не доказательство действия.',
    coaching: 'Показывает рынок self-improvement, habit, AI coach, routine или goal guidance. Для АУРЫ это источник слоя действия и платной глубины, но не доказательство мягкого ритуального опыта.',
    gaming: 'Показывает бенчмарк progression/quest/avatar механик. Для АУРЫ это не прямой TAM, а источник механик возврата, видимого прогресса и награды.',
    gaming_progression: 'Показывает бенчмарк progression/quest/avatar механик. Для АУРЫ это не прямой TAM, а источник механик возврата, видимого прогресса и награды.'
  };
  return `${reads[marketId] || 'Релевантный соседний продукт для проверки.'} ${tagText}`;
}

const rawRows = csv('data_processed/cross_source_universe_raw.csv');
const dedupRows = csv('data_processed/cross_source_universe_dedup.csv');
const nicheSummary = csv('data_processed/russian_readable_niche_summary.csv');
const nicheCountRollup = csv('data_processed/global_niche_count_rollup.csv');
const nicheCountReconciliation = csv('data_processed/niche_count_reconciliation.csv');
const marketDeepDives = csv('data_processed/russian_market_deep_dives.csv');
const whitespace = csv('data_processed/russian_whitespace_decision_map.csv');
const competitors = csv('data_processed/russian_competitor_battlecards.csv');
const competitorArchetypeRollup = csv('data_processed/global_competitor_archetype_rollup.csv');
const competitorFeatureRows = csv('data_processed/competitor_feature_matrix.csv');
const topIntersectionCandidates = csv('data_processed/top_intersection_review_candidates.csv');
const taxonomyCleanupQueue = csv('data_processed/competitor_taxonomy_cleanup_queue.csv');
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
const p0ValidationExecutionSlice = csv('data_processed/p0_validation_execution_slice.csv');
const p0ObservedEvidenceIntake = csv('data_processed/p0_observed_evidence_intake.csv');
const readerGlossary = csv('data_processed/russian_reader_glossary.csv');
const reportReadabilityAudit = csv('data_processed/global_report_readability_audit.csv');
const sourceQualityAudit = csv('data_processed/global_source_quality_gap_audit.csv');
const crossSourceSummary = csv('data_processed/cross_source_universe_summary.csv');
const crossSourceCoverage = csv('data_processed/cross_source_coverage_matrix.csv');
const marketSizingMethodology = csv('data_processed/global_market_sizing_methodology.csv');
const marketSensitivityAudit = csv('data_processed/market_model_sensitivity_audit.csv');
const russianStoryline = csv('data_processed/russian_sequential_storyline.csv');
const frontmatterDashboard = csv('data_processed/russian_frontmatter_dashboard.csv');
const marketStressScenarios = csv('data_processed/market_sizing_stress_test.csv');
const whitespaceAudienceSynthesis = csv('data_processed/global_whitespace_audience_synthesis.csv');
const goalEvidenceCoverage = csv('data_processed/global_goal_evidence_coverage.csv');
const validationExecutiveRollup = csv('data_processed/global_validation_executive_rollup.csv');

const intersection = by(tam, 'pillar', 'intersection');
const p0Icp = icp.filter(row => clean(row.priority_ru).startsWith('P0'));
const topCompetitors = competitors.slice(0, 12);
const nicheNameById = Object.fromEntries(nicheSummary.map(row => [row.market_id, row.ru_name]));
const nicheTerms = {
  mindfulness: ['calm', 'headspace', 'meditation', 'mindful', 'sleep', 'breath', 'relax', 'mood', 'motivation', 'affirmation', 'journal'],
  avatar_identity: ['avatar', 'identity', 'character', 'future self', 'ai', 'companion', 'chat', 'highrise', 'zepeto', 'replika', 'face', 'persona'],
  astrology_esoterics: ['astrology', 'horoscope', 'tarot', 'zodiac', 'moon', 'spiritual', 'psychic', 'manifest', 'affirmation', 'bible', 'birth chart'],
  coaching: ['coach', 'coaching', 'habit', 'routine', 'self improvement', 'goals', 'productivity', 'motivation', 'therapy', 'journal', 'fitness'],
  gaming_progression: ['quest', 'level', 'xp', 'rpg', 'avatar', 'progression', 'life simulator', 'cozy', 'habit', 'game', 'highrise', 'sims']
};
const excludedTopAppCategories = {
  mindfulness: ['shopping', 'navigation', 'travel', 'finance', 'food & drink'],
  avatar_identity: ['shopping', 'navigation', 'travel', 'finance', 'food & drink'],
  astrology_esoterics: ['shopping', 'navigation', 'travel', 'finance', 'food & drink', 'book'],
  coaching: ['shopping', 'navigation', 'travel', 'finance', 'food & drink'],
  gaming_progression: []
};
const curatedTopAppQueries = {
  mindfulness: ['Calm', 'Headspace', 'I am - Daily Affirmations', 'Finch', 'Insight Timer', 'BetterSleep', 'Balance', 'Fabulous', 'Breethe', 'Waking Up', 'Meditopia'],
  avatar_identity: ['ChatGPT', 'Grok - AI Chat & Video', 'Character AI', 'ZEPETO', 'PolyBuzz', 'Lensa', 'IMVU', 'Replika', 'Highrise', 'Hotel Hideaway', 'AI Mirror', 'Kindroid', 'Nomi'],
  astrology_esoterics: ['Bible', 'Nebula', 'Faladdin', 'CHANI', 'Kaave', 'Sanctuary', 'TimePassages', 'Daily Horoscope', 'Moonly', 'MoonX', 'The Pattern', 'Astromatrix', 'Shepherd'],
  coaching: ['Impulse', 'Finch', 'Structured', 'Habit Tracker', 'Productive', 'Fabulous', 'Zing AI', 'Streaks', 'Do Habits', 'Miracle Morning', 'Daily Yoga', 'Habitica', 'Hapday'],
  gaming_progression: ['Roblox', '8 Ball Pool', 'Candy Crush Saga', 'Clash Royale', 'Subway Surfers', 'MONOPOLY GO!', 'Royal Match', 'Discord', 'Call of Duty', 'Genshin Impact', 'Fortnite']
};

function pickCuratedTopApps(marketId) {
  const queries = curatedTopAppQueries[marketId] || [];
  const seen = new Set();
  const picked = [];
  for (const query of queries) {
    const q = query.toLowerCase();
    const hit = dedupRows
      .filter(item => ['mobile_app_store', 'google_play_or_android', 'desktop_store', 'browser_extension'].includes(clean(item.source_group)))
      .filter(item => clean(item.app_name).toLowerCase().includes(q))
      .filter(item => {
        const niches = clean(item.niche).split('|');
        return niches.includes(marketId) || (marketId === 'gaming_progression' && niches.includes('gaming'));
      })
      .sort((a, b) => num(b.review_count) - num(a.review_count))[0];
    if (!hit) continue;
    const key = clean(hit.normalized_name || hit.app_name).toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    picked.push(hit);
  }
  return picked.sort((a, b) => num(b.review_count) - num(a.review_count)).slice(0, 8);
}

const topAppsByNiche = Object.fromEntries(nicheSummary.map(row => {
  const seen = new Set();
  const terms = nicheTerms[row.market_id] || [];
  const scoredRows = dedupRows
    .filter(item => {
      const niches = clean(item.niche).split('|');
      return niches.includes(row.market_id) || (row.market_id === 'gaming_progression' && niches.includes('gaming'));
    })
    .filter(item => ['mobile_app_store', 'google_play_or_android', 'desktop_store', 'browser_extension'].includes(clean(item.source_group)))
    .filter(item => row.market_id !== 'gaming_progression' || (clean(item.source_group) === 'mobile_app_store' && (clean(item.category).toLowerCase() === 'games' || clean(item.keyword).toLowerCase().includes('game'))))
    .filter(item => !(excludedTopAppCategories[row.market_id] || []).includes(clean(item.category).toLowerCase()))
    .filter(item => clean(item.app_name))
    .map(item => {
      const haystack = clean([
        item.app_name,
        item.publisher,
        item.keyword,
        item.category,
        item.feature_tags,
        item.core_features,
        item.retention_mechanics,
        item.monetization_notes
      ].join(' ')).toLowerCase();
      const termScore = terms.reduce((sum, term) => sum + (haystack.includes(term) ? 1 : 0), 0);
      const mechanicScore = clean(item.feature_tags).split('|')
        .filter(tag => ['mindfulness', 'journaling_mood', 'habits_streaks', 'avatar_identity', 'gaming_progression', 'coaching', 'manifestation_spirituality'].includes(tag))
        .length;
      return { ...item, relevance_score: termScore * 10 + mechanicScore };
    });
  const directRows = (scoredRows.some(item => item.relevance_score > 0)
    ? scoredRows.filter(item => item.relevance_score > 0)
    : scoredRows)
    .sort((a, b) => num(b.review_count) - num(a.review_count) || num(b.relevance_score) - num(a.relevance_score));
  const unique = [];
  for (const item of directRows) {
    const key = clean(item.normalized_name || item.app_name).toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    unique.push(item);
    if (unique.length >= 8) break;
  }
  const curated = pickCuratedTopApps(row.market_id);
  return [row.market_id, curated.length >= 4 ? curated : unique];
}));
const h2 = by(gates, 'gate_id', 'GATE_H2_PAID_FLOW');
const claimById = Object.fromEntries(claimAppendix.map(row => [row.claim_id, row]));
const provByLayer = Object.fromEntries(sourceProvenance.map(row => [row.layer, row]));
const marketSourceIds = marketSources.map(row => row.source_id).join('|');
const competitorPrimaryMetric = `${claimById.H1_product_shape_exists?.primary_metric || `${topCompetitors.length} P0 competitors; archetype_rows=${competitorArchetypeRollup.length}`}; taxonomy_cleanup_rows=${taxonomyCleanupQueue.length}`;

const gateByHypothesis = Object.fromEntries(gateCards.map(row => [row.hypothesis_id, row]));
const fieldByStep = Object.fromEntries(fieldSessionKit.map(row => [row.step_id, row]));
const prototypeMetricById = Object.fromEntries(prototypeScorecard.map(row => [row.metric_id, row]));
const vocByTheme = Object.fromEntries(voc.map(row => [row.theme_id, row]));
const competitorSignalRows = competitors.length ? competitors : [];
const reviewSignalSummary = sumPairs(competitorSignalRows, 'top_review_signals').slice(0, 8);
const reviewJtbdSummary = sumPairs(competitorSignalRows, 'top_review_jtbd').slice(0, 8);
const reviewPainSummary = sumPairs(competitorSignalRows, 'top_review_pains').slice(0, 8);
const avatarCompetitorRows = competitorSignalRows
  .filter(row => clean(row.retention_tags).includes('avatar_feedback') || clean(row.top_review_signals).includes('loves_avatar_progress') || clean(row.archetype).includes('avatar'))
  .slice(0, 10);
const avatarSpec = fs.existsSync('docs/strategy/avatar-loop-spec.md')
  ? fs.readFileSync('docs/strategy/avatar-loop-spec.md', 'utf8')
  : '';

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
    primary_metric: competitorPrimaryMetric,
    evidence_files: 'data_processed/russian_competitor_battlecards.csv;data_processed/global_competitor_archetype_rollup.csv;data_processed/competitor_taxonomy_cleanup_queue.csv;docs/competitive/competitor-taxonomy-cleanup-queue-v1.md;data_processed/top100_competitor_review_scorecard.csv;data_processed/manual_competitor_inspection_packet.csv',
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
  },
  {
    claim_id: 'SRC_08_SAMPLE_STYLE_REFERENCE',
    report_section: 'Логика гипотез и повествовательная форма',
    claim_ru: 'Финальный отчет должен держать последовательную форму образца: сначала идея и гипотеза, затем рынки, конкуренты, whitespace, аудитория, продуктовая петля и validation.',
    evidence_status_ru: 'используется как style benchmark, не как market evidence',
    primary_metric: 'sample_docx_paragraphs=306; tables=10; style_profile=docs/decision/alina-sample-style-profile-v1.md',
    evidence_files: 'docs/decision/alina-sample-style-profile-v1.md;data_processed/alina_sample_style_profile.csv;data_processed/alina_sample_style_gap_map.csv',
    source_boundary_ru: 'Образец задает композицию и русский нарратив; он не переносит российский рынок, локальные цифры или старую продуктовую гипотезу в мировой отчет.'
  },
  {
    claim_id: 'SRC_09_NICHE_COUNT_ROLLUP',
    report_section: 'Определение мировых целевых рынков и гипотеза #2',
    claim_ru: 'По каждой из пяти ниш отдельно зафиксированы raw/dedup/direct/top100/manual-target счетчики, чтобы читатель видел масштаб данных по направлению.',
    evidence_status_ru: 'доказано как source-count rollup, не как PMF proof',
    primary_metric: `${nicheCountRollup.length} niche rows; file=data_processed/global_niche_count_rollup.csv`,
    evidence_files: 'data_processed/global_niche_count_rollup.csv;docs/competitive/global-niche-count-rollup-v1.md;data_processed/russian_readable_niche_summary.csv;data_processed/cross_source_coverage_matrix.csv',
    source_boundary_ru: 'Niche count rollup показывает масштаб source discovery по рынкам; он не доказывает спрос, WTP или отсутствие скрытого full-loop конкурента.'
  },
  {
    claim_id: 'SRC_10_REPORT_READABILITY',
    report_section: 'Проверка складности и читаемости отчета',
    claim_ru: 'Русский мировой отчет читается как последовательная гипотезная история; для легкого чтения добавлена executive narrative версия.',
    evidence_status_ru: 'проверено редакционным аудитом, не market proof',
    primary_metric: `${reportReadabilityAudit.length} readability audit rows`,
    evidence_files: 'data_processed/global_report_readability_audit.csv;docs/decision/global-report-readability-audit-v1.md;reports/alina-global-executive-narrative-v1.md;output/pdf/alina-global-executive-narrative-v1.pdf',
    source_boundary_ru: 'Readability audit оценивает форму и ясность текста; он не доказывает рыночные или продуктовые claims.'
  },
  {
    claim_id: 'SRC_11_SOURCE_QUALITY_GAP',
    report_section: 'Описание проекта и гипотеза #1',
    claim_ru: 'Source base по пяти рынкам имеет разную силу: direct app coverage, benchmark mechanics и VOC/context нужно читать отдельно.',
    evidence_status_ru: 'доказано как source-quality audit, не validation proof',
    primary_metric: `${sourceQualityAudit.length} market source-quality rows`,
    evidence_files: 'data_processed/global_source_quality_gap_audit.csv;docs/competitive/global-source-quality-gap-audit-v1.md;data_processed/cross_source_coverage_matrix.csv;data_processed/source_expansion_backlog.csv',
    source_boundary_ru: 'Source quality audit показывает качество coverage и next lanes; он не доказывает PMF, WTP или отсутствие hidden clone.'
  },
  {
    claim_id: 'SRC_12_MARKET_SENSITIVITY',
    report_section: 'Методология TAM/SAM/SOM',
    claim_ru: 'TAM/SAM/SOM модель проверена на чувствительность assumptions; H2 остается range-based до paid-flow/WTP proof.',
    evidence_status_ru: 'проверено sensitivity audit, не revenue forecast',
    primary_metric: `${marketSensitivityAudit.length} sensitivity rows`,
    evidence_files: 'data_processed/market_model_sensitivity_audit.csv;docs/market/market-model-sensitivity-audit-v1.md;data_processed/tam_sam_som_model.csv;data_processed/market_sizing_stress_test.csv',
    source_boundary_ru: 'Sensitivity audit показывает хрупкость assumptions; он не доказывает выручку Alina.'
  },
  {
    claim_id: 'SRC_13_RUSSIAN_STORYLINE',
    report_section: 'Повествовательная логика отчета',
    claim_ru: 'Отчет должен читаться как русская последовательная цепочка гипотез: идея -> evidence status -> рынки -> деньги -> конкуренты -> whitespace -> аудитория -> MVP -> validation -> источники.',
    evidence_status_ru: 'проверено narrative-spine картой, не market proof',
    primary_metric: `${russianStoryline.length} storyline rows`,
    evidence_files: 'data_processed/russian_sequential_storyline.csv;docs/decision/russian-sequential-storyline-v1.md;docs/decision/alina-sample-style-benchmark-v1.md',
    source_boundary_ru: 'Storyline карта управляет формой и переходами отчета; она не усиливает рыночные, конкурентные или продуктовые claims без observed evidence.'
  },
  {
    claim_id: 'SRC_14_FRONTMATTER_DASHBOARD',
    report_section: 'Первые управленческие числа',
    claim_ru: 'В начале отчета должна быть короткая панель: масштаб базы, счетчики по пяти нишам, денежная рамка, validation gates и следующий рабочий фокус.',
    evidence_status_ru: 'проверено frontmatter dashboard, не market proof',
    primary_metric: `${frontmatterDashboard.length} dashboard rows`,
    evidence_files: 'data_processed/russian_frontmatter_dashboard.csv;docs/decision/russian-frontmatter-dashboard-v1.md;data_processed/global_niche_count_rollup.csv;data_processed/global_hypothesis_gate_snapshot.csv',
    source_boundary_ru: 'Dashboard улучшает читаемость и видимость счетчиков; он не превращает coverage, source volume или TAM/SAM/SOM в доказанный спрос.'
  },
  {
    claim_id: 'SRC_15_NICHE_COUNT_RECONCILIATION',
    report_section: 'Определение мировых целевых рынков и гипотеза #2',
    claim_ru: 'Счетчики по пяти нишам сверены между raw, all-source niche dedup, global dedup, direct app-store dedup, top100 review и manual targets.',
    evidence_status_ru: 'доказано как count reconciliation, не demand proof',
    primary_metric: `${nicheCountReconciliation.length} reconciliation rows`,
    evidence_files: 'data_processed/niche_count_reconciliation.csv;docs/competitive/niche-count-reconciliation-v1.md;data_processed/global_niche_count_rollup.csv;data_processed/cross_source_universe_dedup.csv',
    source_boundary_ru: 'Reconciliation объясняет арифметику и scope счетчиков; он не доказывает спрос, WTP или отсутствие hidden clone.'
  },
  {
    claim_id: 'SRC_16_P0_EXECUTION_SLICE',
    report_section: 'Ближайшая очередь валидации',
    claim_ru: 'P0 validation queue сведена в исполнимую рабочую сессию: hidden-clone walkthrough, paid-flow, ICP recent behavior и prototype loop.',
    evidence_status_ru: 'доказано как execution routing, не observed validation',
    primary_metric: `${p0ValidationExecutionSlice.length} execution-slice rows`,
    evidence_files: 'data_processed/p0_validation_execution_slice.csv;docs/decision/p0-validation-execution-slice-v1.md;data_processed/global_next_validation_backlog.csv;data_processed/p0_validation_command_center.csv',
    source_boundary_ru: 'Execution slice показывает порядок действий; он не апгрейдит H1-H6 без заполненных observed rows.'
  },
  {
    claim_id: 'SRC_17_READER_GLOSSARY',
    report_section: 'Проверка складности и читаемости отчета',
    claim_ru: 'Для внешнего чтения добавлена русская reader-версия и glossary, которые объясняют технические labels без потери claim boundaries.',
    evidence_status_ru: 'проверено как readability layer, не market proof',
    primary_metric: `${readerGlossary.length} glossary rows`,
    evidence_files: 'reports/alina-global-reader-report-v1.md;data_processed/russian_reader_glossary.csv;docs/decision/russian-reader-glossary-v1.md;data_processed/global_report_readability_audit.csv',
    source_boundary_ru: 'Reader/glossary слой улучшает форму подачи; он не закрывает H1-H6 и не заменяет observed validation.'
  },
  {
    claim_id: 'SRC_18_P0_OBSERVED_INTAKE',
    report_section: 'Ближайшая очередь валидации',
    claim_ru: 'Для первых P0 задач добавлен intake-ledger: каждая задача связана с точными capture IDs, полями для заполнения и rebuild rule.',
    evidence_status_ru: 'доказано как intake routing, не observed validation',
    primary_metric: `${p0ObservedEvidenceIntake.length} intake rows`,
    evidence_files: 'data_processed/p0_observed_evidence_intake.csv;docs/decision/p0-observed-evidence-intake-v1.md;data_processed/p0_validation_execution_slice.csv;data_processed/manual_walkthrough_capture_sheet.csv;data_processed/paid_flow_capture_sheet.csv;data_processed/icp_interview_capture_sheet.csv;data_processed/prototype_session_capture_sheet.csv',
    source_boundary_ru: 'Intake-ledger приближает ручную работу к source capture rows; он не апгрейдит H1-H6 без заполненных observed answers/screenshots/quotes/scores.'
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

lines.push('# Исследование АУРА. Мировой рынок и логика гипотез');
lines.push('');
lines.push(`Версия отчета: ${new Date().toLocaleDateString('ru-RU')}`);
lines.push('');
lines.push('## ОПИСАНИЕ ПРОЕКТА И ГИПОТЕЗА #1');
lines.push('');
lines.push('Проект Alina рассматривается не как отдельный трекер привычек, не как очередная библиотека медитаций и не как декоративный avatar app. Базовая идея шире: создать ежедневный цифровой ритуал, в котором пользователь получает личное отражение дня, выбирает одно маленькое действие, проходит короткий reset и видит, что его прогресс или образ себя изменился именно из-за сделанного шага.');
lines.push('');
lines.push('География этого отчета - мировой consumer-app рынок. Русский язык здесь используется как язык повествования и принятия решения, а не как ограничение рынка: конкурентная карта, источники, категории и монетизация собираются глобально.');
lines.push('');
lines.push('Логика продукта строится вокруг связки meaning -> action -> reset -> visible progress. В этой связке смысл не остается абстрактной интерпретацией, действие не превращается в тяжелую productivity-систему, reset не живет как отдельная медитация, а avatar/progress не является случайной косметикой. Ценность появляется только тогда, когда пользователь понимает причинность: я сделал маленький шаг, и поэтому мой образ прогресса изменился.');
lines.push('');
lines.push('Гипотеза №1: на мировом consumer-app рынке есть место для приложения, которое объединяет личный смысл, короткое действие, reset и причинно видимый прогресс в одну ежедневную петлю. Эта гипотеза пока не доказана как product-market fit, но уже поддержана масштабной картой соседних рынков и конкурентных сигналов.');
lines.push('');
lines.push(`В основу отчета положена большая карта рынка: ${fmt(rawRows.length)} исходных записей, ${fmt(dedupRows.length)} уникализированных объектов и ${fmt(manifest.length)} локально сохраненных материалов. Эти данные не используются как “доказательство успеха” продукта сами по себе. Они нужны для последовательной проверки: существует ли рынок, есть ли деньги, насколько плотна конкуренция, где может быть белое пятно, кто аудитория и какую петлю продукта нужно тестировать первой.`);
lines.push('');
if (false && frontmatterDashboard.length) {
  const dashboardSummary = frontmatterDashboard.filter(row => row.block_ru === 'Сводка пакета');
  const dashboardNiches = frontmatterDashboard.filter(row => row.block_ru === 'Ниши');
  const dashboardGates = frontmatterDashboard.filter(row => row.block_ru === 'Gates');
  lines.push('### Первые управленческие числа');
  lines.push('');
  lines.push('Перед длинным evidence pack ниже вынесена короткая панель. Она отвечает на базовые вопросы: сколько данных собрано, сколько приложений/строк видно по каждой нише, где находится денежная модель, какие gates еще открыты и что делать дальше. Это не отдельное доказательство продукта, а навигация по текущему состоянию ресерча.');
  lines.push('');
  lines.push(mdTable(dashboardSummary.map(row => ({
    metric: row.metric_ru,
    value: row.value_ru,
    read: row.interpretation_ru,
    boundary: row.boundary_ru
  })), [
    { key: 'metric', label: 'Метрика' },
    { key: 'value', label: 'Значение' },
    { key: 'read', label: 'Как читать' },
    { key: 'boundary', label: 'Граница' }
  ]));
  lines.push('');
  lines.push('Самая важная читательская оговорка: счетчики по нишам показывают coverage и источник для анализа, а не количество прямых клонов Alina и не доказанный спрос.');
  lines.push('');
  lines.push(mdTable(dashboardNiches.map(row => ({
    niche: row.metric_ru,
    count: row.value_ru,
    read: row.interpretation_ru,
    boundary: row.boundary_ru
  })), [
    { key: 'niche', label: 'Ниша' },
    { key: 'count', label: 'Сколько данных' },
    { key: 'read', label: 'Как читать' },
    { key: 'boundary', label: 'Граница' }
  ]));
  lines.push('');
  lines.push(mdTable(dashboardGates.map(row => ({
    h: row.metric_ru,
    status: row.value_ru,
    next: row.interpretation_ru,
    decision: row.boundary_ru
  })), [
    { key: 'h', label: 'Гипотеза' },
    { key: 'status', label: 'Статус' },
    { key: 'next', label: 'Следующий шаг' },
    { key: 'decision', label: 'Решение сейчас' }
  ]));
  lines.push('');
}
if (false && sourceQualityAudit.length) {
  lines.push('Чтобы масштаб базы не читался как одинаковое качество источников, отдельно добавлен source-quality audit по пяти рынкам. Он показывает, где coverage ближе к прямым consumer-app конкурентам, где это скорее Steam/itch mechanics benchmark, а где нужны source-native lanes из backlog. Это защищает отчет от ложного вывода “много строк = все доказано”.');
  lines.push('');
  lines.push(mdTable(sourceQualityAudit.map(row => ({
    market: row.market_ru,
    direct: row.direct_consumer_app_dedup,
    directShare: row.direct_share_of_coverage,
    benchmark: row.benchmark_mechanics_dedup,
    quality: row.quality_read_ru,
    next: row.next_source_lanes_ru
  })), [
    { key: 'market', label: 'Рынок' },
    { key: 'direct', label: 'Direct dedup', align: 'right' },
    { key: 'directShare', label: 'Direct share', align: 'right' },
    { key: 'benchmark', label: 'Benchmark dedup', align: 'right' },
    { key: 'quality', label: 'Как читать source quality' },
    { key: 'next', label: 'Следующие lanes' }
  ]));
  lines.push('');
}
lines.push('### Логика гипотез');
lines.push('');
lines.push('Исследование специально построено как цепочка, а не как набор независимых таблиц. Сначала фиксируется продуктовая идея: если Alina должна соединить смысл, действие, reset и видимый прогресс, то первая проверка - существует ли вообще такая форма продукта и не занята ли она уже конкурентами. После этого нужно понять, есть ли вокруг нее мировые рынки и деньги: без этого даже красивая продуктовая петля остается маленьким экспериментом.');
lines.push('');
lines.push('Дальше проверка переходит к конкурентам и whitespace. Здесь важно не доказывать, что конкурентов нет, а увидеть, где именно существующие решения разрывают петлю: у одних есть reset без действия, у других действие без личного смысла, у третьих avatar без причинности, у четвертых прогресс без мягкого эмоционального входа. Только после этого имеет смысл говорить об аудитории: кто уже живет рядом с этой проблемой, какие приложения и ритуалы использует, за что платит и какие формулировки считает безопасными или манипулятивными.');
lines.push('');
lines.push('Последний шаг - продуктовое ядро. Если рынки есть, конкуренты понятны, whitespace выглядит узким, а аудитория имеет recent behavior, тогда MVP должен проверять не весь возможный продукт, а одну причинную петлю: personal meaning -> tiny action -> short reset -> visible progress -> tomorrow hook. Пока эта цепочка не пройдет walkthrough, интервью и прототипные сессии, все выводы остаются evidence-first гипотезами, а не финальным go.');
lines.push('');
lines.push('### Цепочка проверки: как строится исследование');
lines.push('');
lines.push('Дальше отчет идет не по темам, а по изменению логики. Каждый блок отвечает на один риск: сначала проверяем, существует ли форма продукта; затем - есть ли вокруг нее деньги; затем - не занята ли причинная петля; затем - есть ли аудитория с похожим поведением; затем - какое ядро продукта нужно собирать первым.');
lines.push('');
lines.push(mdTable([
  {
    h: 'H1',
    thought: 'Мы думаем, что АУРА может быть отдельной формой consumer-app, а не набором разрозненных функций.',
    why: 'Потому что на пересечении meaning, action, reset и visible progress может возникать ежедневный ритуал.',
    checked: 'Пошли смотреть соседние рынки и конкурентов: есть ли уже такая форма и насколько она занята.',
    current: 'Форма выглядит правдоподобно, но hidden-clone риск открыт до ручных walkthrough.'
  },
  {
    h: 'H2',
    thought: 'Мы думаем, что вокруг этой формы есть деньги.',
    why: 'Потому что mindfulness, coaching, spiritual guidance, avatar/identity и progression уже монетизируются.',
    checked: 'Собрали TAM/SAM/SOM, paid-flow proxy, IAP/pricing и market-money triangulation.',
    current: 'Money case сильный направленно, но это еще не revenue proof АУРЫ.'
  },
  {
    h: 'H3',
    thought: 'Мы думаем, что белое пятно есть не в отсутствии конкурентов, а в недособранной причинной петле.',
    why: 'Многие продукты закрывают reset, смысл, действие или avatar отдельно, но не обязательно связывают их причинно.',
    checked: 'Собрали top competitors, archetypes, whitespace map и public-listing inspection.',
    current: 'Белое пятно узкое и интересное, но требует onboarding/app screenshots.'
  },
  {
    h: 'H4',
    thought: 'Мы думаем, что АУРА может конкурировать не шириной функций, а связкой “смысл -> действие -> avatar/progress”.',
    why: 'Если конкурентное преимущество строить только на avatar или astrology, продукт попадет в занятые категории.',
    checked: 'Сравнили повторяющиеся паттерны: reset, привычки, прогресс, avatar, AI-персонализация, платная глубина.',
    current: 'Преимущество возможно только в причинной сборке петли; отдельные функции сами по себе не защищают продукт.'
  },
  {
    h: 'H5',
    thought: 'Мы думаем, что у АУРЫ есть общая аудитория с соседними продуктами.',
    why: 'Пользователь уже имеет недавнее поведение: ритуалы, journaling, self-improvement, spiritual guidance, progress tools.',
    checked: 'Собрали ICP-сегменты, VOC, Reddit/forum/context signals и вопросы для интервью.',
    current: 'Первые сегменты для проверки: Spiritual self-improvers и Habit/progress users; их нужно подтверждать интервью.'
  },
  {
    h: 'H6',
    thought: 'Мы думаем, что продуктовое ядро должно быть одной короткой сессией, а не большим приложением.',
    why: 'Если причинность не считывается за одну сессию, avatar/progress станет декорацией, а reset — отдельной практикой.',
    checked: 'Собрали MVP-loop, prototype stimulus, scorecard и P0 validation queue.',
    current: 'MVP сформулирован, но не доказан без prototype sessions.'
  }
], [
  { key: 'h', label: 'Гипотеза' },
  { key: 'thought', label: 'Что мы думаем' },
  { key: 'why', label: 'Почему пошли проверять' },
  { key: 'checked', label: 'Что смотрели' },
  { key: 'current', label: 'Текущий вывод' }
]));
lines.push('');
interimConclusion('Итог первого блока', [
  'На уровне идеи Alina уже сформулирована достаточно узко: это не “еще одно wellness-приложение”, а daily ritual с причинной связкой между смыслом, действием и видимым изменением. Это делает исследование проверяемым: если в конкурентах уже есть такая же связка, гипотеза слабеет; если пользователи не считывают причинность в прототипе, продуктовая ставка тоже слабеет.',
  'Следующий шаг логичен: если идея продукта сформулирована, нужно понять, какие мировые рынки могут поддержать такую форму, где уже есть платные привычки пользователей и какие соседние категории дают нам не только цифры, но и поведенческий контекст.'
]);
if (false) {
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
const h2Gate = gateSnapshot.find(row => row.hypothesis_id === 'H2') || {};
const h1Gate = gateSnapshot.find(row => row.hypothesis_id === 'H1') || {};
const h3Gate = gateSnapshot.find(row => row.hypothesis_id === 'H3') || {};
const h5Gate = gateSnapshot.find(row => row.hypothesis_id === 'H5') || {};
const h4Gate = gateSnapshot.find(row => row.hypothesis_id === 'H4') || {};
const h6Gate = gateSnapshot.find(row => row.hypothesis_id === 'H6') || {};
lines.push(`Практически это означает следующее: H1 и H3 уже имеют по ${h1Gate.completed_vs_required || h3Gate.completed_vs_required || '0 / 0'} listing-only строк, но ${h1Gate.success_vs_threshold || h3Gate.success_vs_threshold || '0 / 0'} успешных app-walkthrough строк, поэтому hidden-clone риск остается открытым. H2 имеет ${h2Gate.completed_vs_required || '0 / 0'} заполненных paid-flow строк и ${h2Gate.success_vs_threshold || '0 / 0'} успешных строк, но тоже ниже минимального порога. H5 имеет ${h5Gate.completed_vs_required || '0 / 0'} secondary VOC строк и ${h5Gate.success_vs_threshold || '0 / 0'} успешных interview строк: это контекст для рекрутинга, а не доказательство аудитории. H4 и H6 имеют по ${h4Gate.completed_vs_required || h6Gate.completed_vs_required || '0 / 0'} prototype-readiness строк, но ${h4Gate.success_vs_threshold || h6Gate.success_vs_threshold || '0 / 0'} успешных user-session строк. Это не слабость отчета, а защита от преждевременного вывода: большой массив конкурентов и источников показывает, куда идти, но не заменяет walkthrough, интервью и прототипные сессии.`);
lines.push('');
if (validationExecutiveRollup.length) {
  lines.push('### Управленческий rollup по validation evidence');
  lines.push('');
  lines.push('Чтобы не путать подготовленный research layer с реальной валидацией, ниже сведены типы evidence по каждому gate. Важная граница: listing-only, secondary VOC и prototype-readiness помогают запускать проверку, но не апгрейдят гипотезы без наблюдаемых walkthrough/interview/session результатов.');
  lines.push('');
  lines.push(mdTable(validationExecutiveRollup.map(row => ({
    h: row.linked_hypotheses,
    type: row.evidence_type_ru,
    rows: row.completed_vs_required,
    success: row.success_vs_threshold,
    gap: row.min_success_gap,
    next: row.next_real_validation_ru
  })), [
    { key: 'h', label: 'H' },
    { key: 'type', label: 'Тип evidence сейчас' },
    { key: 'rows', label: 'Rows' },
    { key: 'success', label: 'Success' },
    { key: 'gap', label: 'Success gap', align: 'right' },
    { key: 'next', label: 'Следующий реальный validation step' }
  ]));
  lines.push('');
}
interimConclusion('Итог по статусу доказательств', [
  'Сейчас отчет можно честно читать так: исследовательская база большая, направление выглядит достойным проверки, но product/market claims остаются в статусе hold_validate. Это важная редакционная позиция, потому что она не продает иллюзию финального ответа там, где пока есть только подготовленный validation pipeline.',
  'Из этого следует переход к рынкам: если продуктовая форма в принципе имеет смысл, надо понять, какие мировые adjacent-рынки дают ей денежный и поведенческий контекст, а какие являются только источником механик или сравнений.'
]);
}
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
  { key: 'direct', label: 'Приложений из магазинов', align: 'right' },
  { key: 'total', label: 'Уникальных объектов всего', align: 'right' },
  { key: 'apps', label: 'Кандидатов в review', align: 'right' },
  { key: 'role', label: 'Роль в гипотезе' }
]));
lines.push('');
if (nicheCountRollup.length) {
  lines.push(`Чтобы было понятно, сколько материала собрано по каждой нише, ниже отдельно показана сводка. Здесь есть три уровня: общий объем показывает ширину карты рынка, приложения из магазинов ближе всего к конкурентному полю, а кандидаты в анализ показывают, какие продукты уже вынесены в более внимательное сравнение. Глобально в пакете сейчас ${fmt(dedupRows.length)} уникализированных объектов; ниши нельзя просто складывать между собой, потому что один продукт может попадать в несколько тематических контекстов.`);
  lines.push('');
  lines.push(mdTable(nicheCountRollup.map(row => ({
    market: row.market_ru,
    all_raw: row.all_source_raw_rows,
    all_dedup: row.all_source_dedup_rows,
    direct: row.direct_app_store_dedup_rows,
    direct_share: row.direct_app_store_dedup_share,
    top100: row.top100_primary_competitors,
    manual: row.manual_validation_targets,
    coverage: `источников: ${row.coverage_groups}; сильных: ${row.strong_coverage_groups}; средних: ${row.medium_coverage_groups}`,
    read: row.opportunity_ru
  })), [
    { key: 'market', label: 'Ниша' },
    { key: 'all_raw', label: 'Исходных записей', align: 'right' },
    { key: 'all_dedup', label: 'Уникальных объектов', align: 'right' },
    { key: 'direct', label: 'Приложений из магазинов', align: 'right' },
    { key: 'direct_share', label: 'Доля приложений' },
    { key: 'top100', label: 'В анализ', align: 'right' },
    { key: 'manual', label: 'На ручную проверку', align: 'right' },
    { key: 'coverage', label: 'Покрытие' },
    { key: 'read', label: 'Как читать' }
  ]));
  lines.push('');
}
if (crossSourceSummary.length) {
  const sourceRows = crossSourceSummary
    .filter(row => clean(row.summary_type) === 'source_group')
    .sort((a, b) => num(b.raw_rows) - num(a.raw_rows))
    .slice(0, 9);
  lines.push('### Как собрана доказательная база');
  lines.push('');
  lines.push('Доказательная база не опирается на один источник и не сводится к одной таблице конкурентов. Мы совместили несколько типов сигналов: карточки мобильных приложений, Android-кросс-проверку, desktop/browser-продукты, игровые продукты как источник механик прогресса, обсуждения пользователей, публичные страницы компаний, платные экраны и рыночные источники. Поэтому в тексте разделяются три уровня: широкий рынок, очищенная карта объектов и приложения, которые ближе всего к реальному конкурентному полю.');
  lines.push('');
  lines.push(mdTable(sourceRows.map(row => ({
    source: sourceGroupReadableRu(row.segment),
    raw: row.raw_rows,
    dedup: row.dedup_rows,
    niches: row.unique_niches,
    read: clean(row.segment) === 'steam_pc' || clean(row.segment) === 'itch_web_game'
      ? 'используем как ориентир механик прогресса, не как прямой рынок АУРЫ'
      : clean(row.segment) === 'mobile_app_store' || clean(row.segment) === 'google_play_or_android'
        ? 'ближе всего к конкурентной карте потребительских приложений'
        : clean(row.segment) === 'community_forum'
          ? 'используем как язык боли и возражений, не как репрезентативный опрос'
          : 'поддерживающий слой для проверки позиционирования, цен и соседних продуктов'
  })), [
    { key: 'source', label: 'Семейство источников' },
    { key: 'raw', label: 'Собрано сигналов', align: 'right' },
    { key: 'dedup', label: 'После очистки', align: 'right' },
    { key: 'niches', label: 'Ниш' },
    { key: 'read', label: 'Как использовать' }
  ]));
  lines.push('');
  lines.push('Важно читать эту базу аккуратно: большой объем данных показывает масштаб и направление рынка, но финальные продуктовые решения нельзя принимать только по публичным описаниям. Их нужно подтверждать ручным разбором близких конкурентов, интервью и прототипными сессиями.');
  lines.push('');
}
lines.push('### Что реально нашли по каждой нише: ключевые приложения');
lines.push('');
lines.push('Ниже не внутренняя методология, а конкретная картина рынка: по каждой нише показаны заметные consumer-приложения из уже собранной базы. Это не финальный список прямых конкурентов АУРЫ, но он отвечает на практический вопрос: какие приложения мы нашли, насколько они крупные по отзывам и почему эта ниша важна для гипотезы.');
lines.push('');
for (const row of nicheSummary) {
  const rollup = by(nicheCountRollup, 'market_id', row.market_id);
  const topApps = topAppsByNiche[row.market_id] || [];
  const reviewCount = Number(rollup.top100_primary_competitors || row.top100_primary_competitors || 0);
  const manualCount = Number(rollup.manual_validation_targets || row.manual_validation_targets || 0);
  const reviewWord = ruPluralOneFewMany(reviewCount, ['приложение', 'приложения', 'приложений']);
  const manualPhrase = manualCount > 0
    ? `на ручную проверку уже выделено ${fmt(manualCount)}`
    : 'ручная проверка пока не выделена';
  lines.push(`#### ${row.ru_name}`);
  lines.push('');
  lines.push(`${row.ru_name}: в этой нише собрано ${fmt(rollup.all_source_raw_rows || row.all_source_raw_rows)} исходных записей, ${fmt(rollup.all_source_dedup_rows || row.all_source_dedup_rows)} уникализированных объектов и ${fmt(rollup.direct_app_store_dedup_rows || row.direct_app_store_dedup_rows)} приложений из магазинов. В более внимательный анализ вынесено ${fmt(reviewCount)} ${reviewWord}; ${manualPhrase}. Для АУРЫ эта ниша важна так: ${row.role_ru}. Денежный сигнал сейчас читается как: ${moneyVerdictRu(row.money_verdict)}.`);
  lines.push('');
  lines.push(mdTable(topApps.map(app => ({
    app: app.app_name,
    publisher: app.publisher,
    source: sourceGroupRu(app.source_group),
    reviews: fmt(app.review_count),
    rating: app.rating,
    pricing: [app.pricing_type, app.monetization_tags].map(pricingRu).filter(Boolean).join('; ') || 'нет данных',
    relevance: relevanceRu(app, row.market_id)
  })), [
    { key: 'app', label: 'Приложение' },
    { key: 'publisher', label: 'Компания' },
    { key: 'source', label: 'Источник' },
    { key: 'reviews', label: 'Отзывы', align: 'right' },
    { key: 'rating', label: 'Рейтинг' },
    { key: 'pricing', label: 'Монетизация' },
    { key: 'relevance', label: 'Почему важно для АУРЫ' }
  ], 8));
  lines.push('');
}
if (competitorFeatureRows.length || topIntersectionCandidates.length) {
  lines.push('### Главные повторяющиеся паттерны в функциях и возможностях');
  lines.push('');
  lines.push('Отдельно важно показать не только названия топ-приложений, а то, что у них повторяется внутри продукта. Ниже это прочитано по feature tags, карточкам приложений, review scorecards и top-intersection кандидатам. Это не утверждение, что каждая функция реализована одинаково глубоко: часть сигналов видна из публичных карточек и отзывов, поэтому они дают карту паттернов, а не финальный вывод после ручного прохождения onboarding.');
  lines.push('');

  const patternRows = nicheSummary.map(row => {
    const marketId = row.market_id;
    const featureRows = competitorFeatureRows.filter(item => {
      const niche = clean(item.niche);
      return niche === marketId || (marketId === 'gaming_progression' && niche === 'gaming');
    });
    const intersectionRows = topIntersectionCandidates.filter(item => {
      const niche = clean(item.niche);
      return niche === marketId || (marketId === 'gaming_progression' && niche === 'gaming');
    });
    const topFeatures = topList([...featureRows, ...intersectionRows], 'feature_tags', 7)
      .map(item => `${featureLabelRu(item.key)} (${fmt(item.count)})`)
      .join('; ');
    const topAudience = topList(intersectionRows, 'audience_tags', 4)
      .map(item => `${featureLabelRu(item.key)} (${fmt(item.count)})`)
      .join('; ');
    const topExamples = compactTopApps(topAppsByNiche[marketId] || intersectionRows, 4);
    const opportunity = ({
      mindfulness: 'Брать короткий reset и эмоциональный вход, но связывать его с действием и изменением avatar/progress.',
      avatar_identity: 'Не делать “редактор аватаров”: avatar должен быть следом действия и героем личного сериала.',
      astrology_esoterics: 'Использовать дату рождения/символы как персональный вход, но выводить пользователя в действие, а не оставлять в чтении.',
      coaching: 'Забирать структуру роста и привычки, но делать ее мягче, короче и менее похожей на task manager.',
      gaming_progression: 'Брать сезоны, XP, квесты, награды и возврат как механику, но не превращать АУРУ в игру ради игры.'
    })[marketId] || 'Использовать как соседний паттерн, затем проверять вручную.';
    return {
      market: row.ru_name,
      rows: featureRows.length,
      candidates: intersectionRows.length,
      patterns: topFeatures || 'нет достаточных tags',
      examples: topExamples || 'нет данных',
      opportunity
    };
  });

  lines.push(mdTable(patternRows, [
    { key: 'market', label: 'Категория' },
    { key: 'rows', label: 'Строк функций', align: 'right' },
    { key: 'candidates', label: 'Топ-кандидатов', align: 'right' },
    { key: 'patterns', label: 'Что повторяется в функциях' },
    { key: 'examples', label: 'Примеры из топа' },
    { key: 'opportunity', label: 'Что забираем в АУРУ' }
  ]));
  lines.push('');
  lines.push('Главный вывод из паттернов: рынок уже научил пользователей нескольким вещам. Пользователь ожидает персонализацию, ежедневный якорь, visible progress, reminder/return loop, платную глубину и иногда avatar или AI companion. Но почти везде эти элементы живут раздельно: meditation дает состояние, habit apps дают действие, astrology дает смысл, avatar apps дают образ, gaming дает возвращаемость. Возможность АУРЫ как раз в сборке этих повторяющихся паттернов в одну причинную петлю: смысл -> действие -> reset -> видимое изменение -> следующая серия.');
  lines.push('');
  lines.push('Что это значит для MVP: первая версия должна не демонстрировать “много функций”, а доказать, что самые частые паттерны действительно соединяются. Минимальный набор: персональный вход, один daily-ритуал, маленькое действие, короткий reset, avatar/progress feedback, память эпизодов и причина вернуться завтра. Все остальное - social, marketplace, длинные библиотеки контента, глубокая кастомизация и дорогое видео - должно идти после проверки базовой петли.');
  lines.push('');
}
if (false && nicheCountReconciliation.length) {
  const reconciliationSummary = nicheCountReconciliation.filter(row => row.layer_ru !== 'Ниша');
  const reconciliationNiches = nicheCountReconciliation.filter(row => row.layer_ru === 'Ниша');
  lines.push('### Сверка счетчиков: почему числа не складываются в одно “количество приложений”');
  lines.push('');
  lines.push('Чтобы не было ощущения, что в отчете смешаны несопоставимые данные, ниже отдельно сверены уровни счетчиков. Главное правило: global dedup, niche dedup и direct app-store dedup отвечают на разные вопросы. Global dedup показывает размер уникализированного пакета. Niche dedup показывает тематическую ширину каждой корзины. Direct app-store dedup ближе всего к вопросу “сколько consumer-app конкурентов видно в нише”, но и он не доказывает, что все эти продукты являются прямыми клонами Alina.');
  lines.push('');
  lines.push(mdTable(reconciliationSummary.map(row => ({
    id: row.row_id,
    layer: row.layer_ru,
    type: row.count_type_ru,
    value: row.count_value,
    meaning: row.plain_meaning_ru,
    note: row.reconciliation_note_ru
  })), [
    { key: 'id', label: 'ID' },
    { key: 'layer', label: 'Слой' },
    { key: 'type', label: 'Тип числа' },
    { key: 'value', label: 'Значение', align: 'right' },
    { key: 'meaning', label: 'Что значит' },
    { key: 'note', label: 'Как сверять' }
  ]));
  lines.push('');
  lines.push(mdTable(reconciliationNiches.map(row => ({
    market: row.market_ru,
    value: row.count_value,
    meaning: row.plain_meaning_ru,
    cannot: row.what_it_cannot_prove_ru
  })), [
    { key: 'market', label: 'Ниша' },
    { key: 'value', label: 'All-source dedup', align: 'right' },
    { key: 'meaning', label: 'Стек счетчиков' },
    { key: 'cannot', label: 'Что не доказывает' }
  ]));
  lines.push('');
}
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
  { key: 'sam', label: 'Рабочая SAM-оценка', align: 'right' },
  { key: 'money', label: 'Денежный вывод' },
  { key: 'score', label: 'Оценка', align: 'right' },
  { key: 'boundary', label: 'Граница' }
]));
lines.push('');
lines.push(`Расчетное пересечение рынков в текущей модели дает рабочую рамку около ${money(intersection.samBase)}. Это не обещание выручки и не финальная оценка бизнеса, а ориентир: рынок выглядит достаточно крупным, чтобы продолжать проверку. Денежную гипотезу можно считать сильнее только после проверки реальных paywall, цен, trial-моделей и готовности пользователей платить именно за похожую ценность.`);
lines.push('');
lines.push('## ОЦЕНКА РАЗМЕРА РЫНКА: TAM/SAM/SOM');
lines.push('');
lines.push('Рыночная модель Alina намеренно построена как диапазон, а не как одна “красивая” цифра. Такой подход нужен, потому что АУРА находится на пересечении нескольких соседних рынков, а не внутри одной готовой категории, где можно просто взять готовый отчет и перенести его на продукт.');
lines.push('');
lines.push('Логика расчета такая: сначала берется широкий размер рынка, затем выделяется та часть, которая может быть обслуживаемой для похожего consumer-продукта, после чего применяется понижающий коэффициент уверенности. Это защищает модель от завышения: mindfulness, coaching и spiritual guidance ближе к прямой проверке, avatar/identity шире и требует скидки, а gaming используется как источник механик прогресса, но не как прямой рынок АУРЫ.');
lines.push('');
lines.push(mdTable(marketSizingMethodology.map(row => ({
  pillar: marketLabelRu(row.pillar),
  direct: row.directness_ru,
  sam: row.sam_base,
  weighted: row.weighted_sam_base,
  risk: row.model_risk_ru,
  read: row.read_rule_ru
})), [
  { key: 'pillar', label: 'Направление' },
  { key: 'direct', label: 'Какой тип рынка' },
  { key: 'sam', label: 'Базовая оценка', align: 'right' },
  { key: 'weighted', label: 'Оценка с поправкой', align: 'right' },
  { key: 'risk', label: 'Риск модели' },
  { key: 'read', label: 'Как читать' }
]));
lines.push('');
lines.push('Для гипотезы о деньгах это означает жесткую границу: рыночная модель показывает, что направление достаточно интересно для проверки, но не доказывает, что АУРА заработает эти деньги. Эту гипотезу можно усиливать только после проверки платных сценариев у конкурентов, интервью о готовности платить и прототипных сессий, где пользователь понимает платную глубину продукта.');
lines.push('');
lines.push('### Как определить рынок АУРЫ');
lines.push('');
lines.push('Для презентации важно не спорить, является ли АУРА “астрологией”, “аватарами”, “mindfulness” или “игрой”. Продукт на самом деле находится на пересечении, но для стратегии нужно выбрать основной рынок входа и вспомогательные рынки механик. Самая сильная рабочая позиция сейчас такая: основной рынок - mobile wellness / self-improvement / entertainment app, где пользователь приходит за личным смыслом, эмоциональным состоянием и ощущением движения. Astrology/esoterics дает язык персонального входа, avatar/identity дает визуальный образ изменения, gaming дает механику сериала, сезонов, квестов и возврата, но не является прямым позиционированием продукта.');
lines.push('');
lines.push(mdTable([
  {
    layer: 'Базовый рынок',
    role: 'Мобильные consumer-приложения',
    why: 'Мы делаем мобилку, поэтому конкурируем за привычку открыть приложение, пройти короткую сессию и вернуться завтра.',
    decision: 'Считать верхним уровнем, но не использовать как доказательство спроса само по себе.'
  },
  {
    layer: 'Основная категория входа',
    role: 'Wellness / self-improvement / emotional guidance',
    why: 'Пользователь приходит не “создать аватар”, а улучшить состояние, понять себя и сделать маленький шаг.',
    decision: 'Использовать как главный язык рынка и ЦА.'
  },
  {
    layer: 'Смысловой слой',
    role: 'Astrology / esoterics / symbolic guidance',
    why: 'Дата рождения, символы и личные интерпретации дают ощущение “это про меня”.',
    decision: 'Использовать как вход, но не обещать судьбу или точные предсказания.'
  },
  {
    layer: 'Визуальный слой',
    role: 'Avatar / identity / future self',
    why: 'Avatar делает изменение видимым и эмоционально привязывает пользователя к истории.',
    decision: 'Не позиционировать как редактор аватаров; использовать как герой личного сериала.'
  },
  {
    layer: 'Механика возврата',
    role: 'Gaming / progression / life series',
    why: 'Сезоны, эпизоды, квесты, мягкий прогресс и память делают продукт возвращаемым.',
    decision: 'Брать механику из gaming, но не превращать продукт в игру ради игры.'
  }
], [
  { key: 'layer', label: 'Уровень рынка' },
  { key: 'role', label: 'Что это для АУРЫ' },
  { key: 'why', label: 'Зачем учитывать' },
  { key: 'decision', label: 'Рабочее решение' }
]));
lines.push('');
lines.push('Такой выбор категории делает исследование последовательным: сначала мы доказываем, что в мобильных wellness/self-improvement/entertainment категориях есть деньги и привычка платить; затем показываем, какие фичи и механики берем из соседних рынков; затем собираем прототип, где дата рождения, avatar, reset, действие и Life Series работают вместе.');
lines.push('');
if (false && marketSensitivityAudit.length) {
  lines.push('Чтобы H2 не опиралась на одну “красивую” рыночную цифру, отдельно добавлен sensitivity audit. Он показывает, какие assumptions двигают модель сильнее всего: ширина SAM диапазона, directness рынка, confidence weight, число источников и paid-flow/WTP evidence. Самый хрупкий слой - intersection SAM: его нельзя читать как прогноз выручки до ICP/WTP и product-matched paid-flow.');
  lines.push('');
  lines.push(mdTable(marketSensitivityAudit.map(row => ({
    pillar: row.pillar,
    sam: row.sam_base,
    weighted: row.weighted_sam_base,
    spread: row.sam_spread_ratio,
    risk: row.sensitivity_risk_ru,
    driver: row.main_sensitivity_driver_ru,
    next: row.next_evidence_to_reduce_risk_ru
  })), [
    { key: 'pillar', label: 'Pillar' },
  { key: 'sam', label: 'Рабочая SAM-оценка', align: 'right' },
    { key: 'weighted', label: 'Weighted SAM', align: 'right' },
    { key: 'spread', label: 'SAM spread', align: 'right' },
    { key: 'risk', label: 'Risk' },
    { key: 'driver', label: 'Main driver' },
    { key: 'next', label: 'Next proof' }
  ]));
  lines.push('');
}
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
  { key: 'reachable', label: 'Достижимая аудитория', align: 'right' },
  { key: 'activation', label: 'Активация' },
  { key: 'paid', label: 'Платящая доля' },
  { key: 'arppu', label: 'Средний годовой чек' },
  { key: 'revenue', label: 'Годовая выручка', align: 'right' },
  { key: 'read', label: 'Как читать' }
]));
lines.push('');
interimConclusion('Итог по рынкам и деньгам', [
  'Рыночная картина поддерживает H2 только направленно. Вокруг Alina есть крупные соседние категории, платные привычки и понятные consumer-app механики, но ни одна broad market цифра не является прямым прогнозом выручки Alina. Самое аккуратное чтение: рынок достаточно большой, чтобы продолжать, но недостаточно доказанный, чтобы объявлять go.',
  'Поэтому следующий шаг - не спорить о единственной TAM-цифре, а перейти к сценариям входа. Именно сценарии показывают, какой пользовательский мотив может привести человека в продукт и почему пять рынков собираются в одну гипотезу, а не остаются пятью разными направлениями.'
]);
lines.push('## СЦЕНАРИИ ВХОДА КАК СВЯЗУЮЩЕЕ ЗВЕНО');
lines.push('');
lines.push('Сценарии входа для Alina не завязаны на один канал. Логичнее рассматривать несколько мировых consumer-entry сценариев. Первый сценарий - пользователь приходит из состояния тревоги, усталости или перегруза и ищет короткий reset. Второй сценарий - пользователь приходит из self-improvement контекста: он хочет двигаться вперед, но устал от жестких streak и сложных систем. Третий сценарий - пользователь приходит из spiritual/meaning контекста и хочет не просто читать интерпретацию, а превратить ее в действие. Четвертый сценарий - пользователь приходит через avatar/identity интерес и хочет видеть, что версия себя меняется. Пятый сценарий - пользователь возвращается через мягкую progression-механику, если она не выглядит как манипулятивная игра.');
lines.push('');
lines.push('Таким образом, рынок Alina должен рассматриваться не по одному каналу входа, а как пересечение потребностей: состояние, смысл, действие, видимость прогресса и возвращаемость.');
lines.push('');
lines.push('### ЛОГИКА СЕГМЕНТАЦИИ');
lines.push('');
lines.push('Как и в прошлом исследовательском документе Алины, сегментация здесь нужна не для красивых labels, а для ответа на практический вопрос: через какой мотив человек вообще войдет в систему и какой use case он принесет с собой. Поэтому аудитория Alina делится не по полу, возрасту или стране, а по мотивационным линиям: смысл, прогресс, reset, identity/avatar и мягкая возвращаемость.');
lines.push('');
lines.push('Первая линия - пользователи, которые ищут personal meaning и хотят превратить его в действие. Вторая линия - пользователи, которым нужен видимый прогресс без давления streak. Третья линия - пользователи короткого emotional reset. Четвертая линия - пользователи, которым важна identity/avatar метафора. Пятая линия - progression users, у которых можно брать механику возврата, но нельзя автоматически считать их прямым рынком Alina.');
lines.push('');
lines.push('Эта логика важна для продукта: один и тот же MVP-loop должен быть проверен разными входами. Если spiritual self-improver видит в продукте “очередное гадание”, H1/H6 слабеют. Если habit/progress user видит “еще один task manager”, H4 слабеет. Если reset user не связывает calm-down с действием, петля распадается. Поэтому сегментация сразу переводится в validation tests, а не остается маркетинговой типологией.');
lines.push('');
lines.push(mdTable(icp.map(row => ({
  segment: row.segment_name,
  priority: row.priority_ru,
  markets: marketLabelRu(row.primary_markets),
  job: coreJobRu(row.core_job_ru),
  why: row.why_it_matters_ru,
  validation: screenerRu(row.screener_rule_ru)
})), [
  { key: 'segment', label: 'Сегмент' },
  { key: 'priority', label: 'Приоритет' },
  { key: 'markets', label: 'Рынки' },
  { key: 'job', label: 'Ключевая задача' },
  { key: 'why', label: 'Почему важен' },
  { key: 'validation', label: 'Как проверять' }
]));
lines.push('');
lines.push('Итог по сегментации: первыми стоит проверять Spiritual self-improvers и Habit and progress users, потому что они дают два разных входа в одну и ту же причинную петлю. Остальные сегменты нужны как compare-layers: они покажут, является ли Alina отдельным продуктом с широкой daily ritual задачей или распадается на несколько уже занятых категорий.');
lines.push('');
lines.push('## ОПРЕДЕЛЕНИЕ КОНКУРЕНТОВ И ГИПОТЕЗА #3');
lines.push('');
lines.push('Конкурентная среда подтверждает, что пользователь уже решает части задачи через существующие приложения. В top-100 review сейчас есть meditation apps, habit trackers, AI journals, spiritual guidance apps, avatar/identity apps и progression products. Рынок не пустой, поэтому сильная ставка Alina не может звучать как “конкурентов нет”. Ставка должна быть точнее: конкуренты закрывают отдельные части петли, но полная причинная связка meaning -> action -> reset -> visible identity/progress встречается редко и требует ручной проверки.');
lines.push('');
if (false && competitorArchetypeRollup.length) {
  lines.push('Чтобы конкурентная карта не выглядела как случайный список приложений, ниже она сведена в несколько типов игроков. Это промежуточная классификация по описаниям приложений, отзывам, платным сигналам и близости к петле АУРЫ. Она показывает, какие типы конкурентов создают риск, но не заменяет ручную проверку продукта внутри onboarding.');
  lines.push('');
lines.push(mdTable(competitorArchetypeRollup.map(row => ({
    archetype: marketLabelRu(row.archetype).replace(/_/g, ' '),
    market: row.primary_market_ru,
    apps: row.top100_primary_apps,
    close: row.close_or_direct_apps,
    behavior: row.behavior_tied_progression_apps,
    paid: row.paid_signal_apps,
    battle: row.battlecard_rows,
    manual: row.manual_validation_targets,
    taxonomy: row.taxonomy_quality_ru,
    top: marketLabelRu(row.top_apps).replace(/_/g, ' ')
  })), [
    { key: 'archetype', label: 'Тип конкурента' },
    { key: 'market', label: 'Роль на рынке' },
    { key: 'apps', label: 'Приложений в review', align: 'right' },
    { key: 'close', label: 'Близких к АУРЕ', align: 'right' },
    { key: 'behavior', label: 'С прогрессом от действия', align: 'right' },
    { key: 'paid', label: 'Есть платный сигнал', align: 'right' },
    { key: 'battle', label: 'Карточек анализа', align: 'right' },
    { key: 'manual', label: 'На ручную проверку', align: 'right' },
    { key: 'taxonomy', label: 'Качество группы' },
    { key: 'top', label: 'Примеры' }
  ]));
  lines.push('');
}
if (false && taxonomyCleanupQueue.length) {
  lines.push('Отдельно вынесена очередь taxonomy cleanup. Это не “исправленный датасет”, а список строк, где текущий classifier может смешивать AI companion, roleplay, tarot/oracle и habit-tracking продукты. Пока статус у всех строк queued_not_applied: эти замечания помогают читать competitor map критично, но не апгрейдят гипотезы без ручного подтверждения.');
  lines.push('');
  lines.push(mdTable(taxonomyCleanupQueue.map(row => ({
    id: row.cleanup_id,
    rank: row.review_rank,
    app: row.app_name,
    current: row.current_archetype,
    suggested: row.suggested_archetype,
    status: row.change_needed,
    reason: row.cleanup_reason_ru
  })), [
    { key: 'id', label: 'ID' },
    { key: 'rank', label: 'Rank', align: 'right' },
    { key: 'app', label: 'App' },
    { key: 'current', label: 'Current' },
    { key: 'suggested', label: 'Suggested' },
    { key: 'status', label: 'Status' },
    { key: 'reason', label: 'Почему' }
  ]));
  lines.push('');
}
lines.push(mdTable(topCompetitors.map(row => ({
  app: row.app_name,
  risk: row.threat_ru,
  priority: row.validation_priority_score,
  money: moneyProxyRu(row.revenue_proxy_band),
  check: row.behavior_tied_progression_prefill === 'yes' ? 'проверить full-loop первым' : 'проверить action -> progress causality'
})), [
  { key: 'app', label: 'Конкурент' },
  { key: 'risk', label: 'Риск' },
  { key: 'priority', label: 'Приоритет', align: 'right' },
  { key: 'money', label: 'Денежный сигнал' },
  { key: 'check', label: 'Что проверить' }
]));
lines.push('');
lines.push('### Что видно внутри приложений и отзывов');
lines.push('');
lines.push('Если смотреть не только на категории приложений, а на то, за что пользователи хвалят и ругают близкие продукты, картина становится конкретнее. Люди возвращаются не просто “в wellness” или “в коучинг”. Они ищут ежедневный якорь, ощущение движения, эмоциональную поддержку, персонализацию и доказательство, что маленькое действие действительно что-то меняет. Поэтому АУРА должна конкурировать не количеством функций, а качеством одной понятной петли.');
lines.push('');
lines.push(mdTable(reviewSignalSummary.map(row => ({
  signal: signalLabelRu(row.key),
  count: fmt(row.count),
  read: row.key === 'loves_avatar_progress'
    ? 'avatar/progress уже считывается пользователями как ценность, но только если он не декоративный.'
    : row.key === 'content_depth_request'
      ? 'после первого value moment пользователи хотят больше глубины, настроек и персонализации.'
      : row.key === 'pricing_complaint'
        ? 'платная модель должна появляться после понятной ценности, иначе вызывает сопротивление.'
        : 'это повторяющийся сигнал из отзывов и конкурентных карточек.'
})), [
  { key: 'signal', label: 'Что повторяется в отзывах' },
  { key: 'count', label: 'Сигналов', align: 'right' },
  { key: 'read', label: 'Что это значит для АУРЫ' }
]));
lines.push('');
lines.push(mdTable(reviewJtbdSummary.slice(0, 6).map(row => ({
  job: jtbdLabelRu(row.key),
  count: fmt(row.count),
  implication: row.key === 'jtbd_make_growth_visible'
    ? 'главный мост к avatar-механике: человек хочет видеть, что движение произошло.'
    : row.key === 'jtbd_daily_anchor'
      ? 'продукт должен быть коротким ежедневным ритуалом, а не тяжелой системой.'
      : row.key === 'jtbd_feel_seen_personalized'
        ? 'персонализация должна ощущаться точной, но не предсказательной и не небезопасной.'
        : 'это поведенческая задача, которую уже закрывают соседние продукты.'
})), [
  { key: 'job', label: 'Что человек пытается сделать' },
  { key: 'count', label: 'Сигналов', align: 'right' },
  { key: 'implication', label: 'Как это влияет на продукт' }
]));
lines.push('');
lines.push(mdTable(reviewPainSummary.slice(0, 6).map(row => ({
  pain: painLabelRu(row.key),
  count: fmt(row.count),
  implication: row.key === 'pain_reliability_breaks_ritual'
    ? 'если ежедневный ритуал ломается технически, доверие к эмоциональному продукту падает сильнее.'
    : row.key === 'pain_subscription_value'
      ? 'подписка должна продавать глубину после понятной бесплатной петли.'
      : row.key === 'pain_trust_accuracy_safety'
        ? 'AI/spiritual/identity слой обязан иметь мягкие границы и не обещать лишнего.'
        : 'это риск, который должен быть учтен в MVP и первых интервью.'
})), [
  { key: 'pain', label: 'Что раздражает или ломает опыт' },
  { key: 'count', label: 'Сигналов', align: 'right' },
  { key: 'implication', label: 'Что нельзя повторить в АУРЕ' }
]));
lines.push('');
lines.push('Практический вывод из этого слоя: пользователю мало получить “красивый инсайт”. Он должен увидеть, что инсайт превратился в действие, действие было достаточно маленьким, а результат стал видимым. Именно здесь avatar становится не украшением, а способом доказать пользователю изменение.');
lines.push('');
lines.push('### Avatar / identity как центральная ставка');
lines.push('');
lines.push('Avatar в АУРЕ должен быть не картинкой профиля и не косметической наградой. Его роль - визуализировать будущую версию пользователя и связывать ежедневные действия с видимым изменением. В конкурентных карточках регулярно встречаются обратная связь через avatar/progress, уровни, XP, streak, квесты, дневник и напоминания. Но главный вопрос остается открытым: меняется ли образ пользователя именно потому, что он сделал действие, или просто потому, что приложение хочет удержать его еще на день.');
lines.push('');
lines.push(mdTable(avatarCompetitorRows.map(row => ({
  app: row.app_name,
  signals: kvPairs(row.top_review_signals).slice(0, 3).map(item => `${signalLabelRu(item.key)} (${fmt(item.count)})`).join('; '),
  mechanics: clean(row.retention_tags).split('|').map(retentionTagRu).slice(0, 5).join(', '),
  opening: row.alina_opening_ru
    .replace('Differentiate by broader spiritual/identity scope, softer safety framing, and better reliability around action-tied progress.', 'Отличаться более широким identity/spiritual контуром, мягкими границами безопасности и надежной связкой действия с видимым прогрессом.')
    .replace('Make the avatar causally respond to completed daily action, not just exist as profile or decorative identity.', 'Сделать так, чтобы avatar причинно реагировал на завершенное действие, а не существовал как декоративный профиль.')
    .replace('Demonstrate daily-loop value before paywall; monetize depth and advanced personalization.', 'Сначала показать ценность ежедневной петли, а платную глубину строить на расширенной персонализации.')
})), [
  { key: 'app', label: 'Пример' },
  { key: 'signals', label: 'Что видно в отзывах' },
  { key: 'mechanics', label: 'Механики возврата' },
  { key: 'opening', label: 'Вывод для АУРЫ' }
]));
lines.push('');
lines.push('Из avatar-spec следует рабочая модель: пользователь дает входной сигнал дня, выбирает маленькое действие, проходит короткий reset, а avatar отвечает как “лучшая версия себя” и меняется микроскопически, но причинно. Важно не обещать магического преображения и не уходить в диагнозы. Avatar должен показывать: “ты сделал шаг, и это стало частью твоей версии себя”.');
lines.push('');
lines.push('Гипотеза №3: востребованной может стать не отдельная медитация, привычка, astrology-механика или avatar-продукт, а связанная система, где смысл быстро превращается в действие, а действие становится видимым. Главный риск для этой гипотезы - скрытый прямой клон внутри первого пользовательского опыта P0-конкурентов, прежде всего Shepherd: Spiritual Bible BFF.');
lines.push('');
interimConclusion('Итог по конкурентам', [
  'Конкурентная карта не доказывает, что поле свободно. Наоборот, она показывает плотную среду, где почти каждая часть петли уже кем-то закрывается. Сила гипотезы Alina появляется только в более узкой формулировке: возможно, рынок занят отдельными функциями, но не занят причинной системой ежедневного ритуала.',
  'Значит, следующий вопрос звучит не “есть ли конкуренты”, а “где именно петля разрывается”. Поэтому отчет переходит от списка конкурентов к whitespace: какие элементы у рынка есть, каких не хватает, и где у Alina может быть отличие.'
]);
lines.push('## КОНКУРЕНТНОЕ ПРЕИМУЩЕСТВО И ГИПОТЕЗА #4');
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
lines.push('Гипотеза №4: конкурентное преимущество АУРЫ может появиться не из отдельной функции, а из причинной сборки петли. Не “новое wellness-приложение”, а короткая трансформационная сессия с визуальной обратной связью: смысл превращается в действие, действие объясняет изменение avatar/progress, а это изменение дает повод вернуться завтра. Если прогресс меняется произвольно, продукт станет декоративной avatar-игрушкой. Если действие никак не связано со смыслом, продукт станет обычным трекером привычек. Если reset живет отдельно, продукт станет библиотекой практик.');
lines.push('');
lines.push('## СВЯЗКА WHITESPACE И АУДИТОРИИ');
lines.push('');
lines.push('Белое пятно нельзя оценивать отдельно от аудитории. Даже если кандидаты с похожей полной петлей редки, это становится продуктовой возможностью только там, где есть люди с недавним поведением, текущими обходными решениями и языком боли. Поэтому следующий слой соединяет H3 и H5: по каждому мировому направлению видно, какой разрыв найден в конкурентной среде, какой сегмент туда ложится и какой первый шаг проверки нужен.');
lines.push('');
lines.push(mdTable(whitespaceAudienceSynthesis.map(row => ({
  market: row.market_ru,
  loop: row.full_loop_rate_pct,
  read: row.whitespace_read_ru,
  icp: row.primary_icp_segments_ru,
  move: row.first_validation_move_ru
})), [
  { key: 'market', label: 'Рынок' },
  { key: 'loop', label: 'Full-loop rate' },
  { key: 'read', label: 'Whitespace read' },
  { key: 'icp', label: 'ICP fit' },
  { key: 'move', label: 'Первый validation move' }
]));
lines.push('');
lines.push('Практический вывод: mindfulness/reset и avatar/identity выглядят как самые чистые поля белого пятна по редкости кандидатов с похожей полной петлей, но они все равно требуют ручной проверки. Astrology/esoterics и coaching дают сильную аудиторию и деньги, но доля полной петли выше, поэтому вывод о белом пятне там слабее. Gaming остается источником механик, а не прямым рынком.');
lines.push('');
interimConclusion('Итог по whitespace и аудитории', [
  'Белое пятно выглядит не как пустой рынок, а как узкая недособранная петля. Это более сильная и более честная формулировка: Alina не должна победить все wellness, coaching, astrology, avatar и gaming-продукты; ей нужно доказать, что связка смысл -> маленькое действие -> reset -> видимый прогресс дает пользователю другой опыт.',
  'Но даже хорошее белое пятно ничего не стоит без аудитории с недавним поведением. Поэтому следующий блок отвечает на вопрос: кто уже живет рядом с этой задачей, какие текущие решения использует и с кого начинать интервью.'
]);
lines.push('## АУДИТОРИЯ, ИНТЕРВЬЮ И ГИПОТЕЗА #5');
lines.push('');
lines.push('На текущем этапе аудитория описывается не демографией, а поведением. Рабочее название - digital ritual users: люди, которые уже используют приложения, чтобы регулировать состояние, видеть движение вперед, получать личный смысл, возвращаться к практике и иногда платить за персонализацию, глубину или поддержку.');
lines.push('');
lines.push(mdTable(icp.map(row => ({
  segment: row.segment_name,
  priority: row.priority_ru,
  score: row.evidence_score,
  job: coreJobRu(row.core_job_ru)
})), [
  { key: 'segment', label: 'Сегмент' },
  { key: 'priority', label: 'Приоритет' },
  { key: 'score', label: 'Оценка', align: 'right' },
  { key: 'job', label: 'Ключевая задача' }
]));
lines.push('');
lines.push(`Первые интервью и прототипные сессии нужно начинать с двух P0-сегментов: ${p0Icp.map(row => row.segment_name).join(' и ') || 'нет данных'}. Первый проверяет, доверяет ли пользователь личному смыслу настолько, чтобы перейти к действию. Второй проверяет, может ли прогресс, связанный с действием, заменить обычный чеклист или давление streak.`);
lines.push('');
lines.push('Гипотеза №5: первичная аудитория Alina находится среди людей, у которых уже есть недавнее поведение вокруг ежедневного ритуала, прогресса, reset или личного смысла, и которым нужна не новая функция, а более короткий и связанный цикл изменения.');
lines.push('');
lines.push('## КЛЮЧЕВЫЕ НАБЛЮДЕНИЯ И ВОПРОСЫ ДЛЯ ПРОВЕРКИ');
lines.push('');
lines.push(mdTable(voc.slice(0, 8).map(row => ({
  theme: row.theme_ru,
  signals: fmt(row.evidence_rows),
  probe: row.interview_probe_ru
})), [
  { key: 'theme', label: 'Тема' },
  { key: 'signals', label: 'Сигналов', align: 'right' },
  { key: 'probe', label: 'Вопрос для интервью' }
]));
lines.push('');
lines.push('Вопросы для следующей проверки должны быть прикладными, как в образце: какой последний цифровой ритуал человек реально использовал; что стало слишком тяжелым или давящим; за какую глубину он уже платит; какая персональная подсказка показалась точной; как он объяснил бы продукт другу; что сделало бы продукт небезопасным, cringe или манипулятивным.');
lines.push('');
interimConclusion('Итог по аудитории и интервью', [
  'Пока самая рабочая аудитория описывается как digital ritual users, но это не финальный ICP. Это набор людей, у которых уже есть поведение рядом с проблемой: они возвращаются к приложениям, ищут смысл или reset, используют трекеры, платные подсказки или персонализацию и могут рассказать конкретный последний эпизод.',
  'Именно поэтому продуктовую модель нельзя собирать из желаний команды. Она должна быть следующей гипотезой, выведенной из рынков, конкурентов, whitespace и первых вопросов к пользователям.'
]);
lines.push('## ИТОГОВАЯ МОДЕЛЬ ПРОДУКТА И ГИПОТЕЗА #6');
lines.push('');
lines.push('По текущим данным продуктовая модель должна опираться на несколько столпов. Первый столп - персональное отражение дня, которое не выглядит общей мотивационной фразой. Второй - одно маленькое действие, связанное со смыслом. Третий - короткий reset, который снижает трение перед действием. Четвертый - видимый прогресс или avatar/identity feedback, который меняется причинно. Пятый - мягкая причина вернуться завтра без наказания и тревоги из-за streak.');
lines.push('');
lines.push('Если расширять ядро, его стоит описывать не как набор экранов, а как последовательность внутренних состояний пользователя. Сначала человек должен почувствовать: “это про меня сегодня”. Затем он должен увидеть одно действие, которое реально можно сделать. После этого ему нужен короткий reset, чтобы снизить сопротивление. И только затем появляется avatar/progress: не как приз, а как доказательство, что действие стало частью новой версии себя.');
lines.push('');
lines.push('Более сильная продуктовая формулировка: АУРА может быть не “приложением с аватаром”, а персональным сериалом о собственной жизни. Каждый день становится коротким эпизодом, где у пользователя есть тема, внутренний конфликт, маленькое действие и изменение героя. Avatar в такой модели - не картинка и не скин, а главный персонаж этого сериала: будущая версия пользователя, которая меняется не от кликов, а от прожитых решений. Тогда возврат строится не только на streak, а на желании узнать: какой я сегодня, какой эпизод моей жизни сейчас идет, что изменится в моем персонаже, если я сделаю один шаг.');
lines.push('');
lines.push(mdTable([
  {
    layer: 'Сезон',
    meaning: 'Большая жизненная тема на 7-14 дней: уверенность, отношения, тело, деньги, дом, творчество, спокойствие.',
    product: 'АУРА собирает серию эпизодов вокруг одной темы и показывает, как меняется герой за период.',
    risk: 'Если нет сезона, продукт распадается на случайные ежедневные подсказки.'
  },
  {
    layer: 'Эпизод дня',
    meaning: 'Короткая история сегодняшнего состояния: что происходит, где напряжение, какой выбор важен.',
    product: 'Дата рождения и чек-ин дают персональный вход, но эпизод всегда привязан к сегодняшнему запросу.',
    risk: 'Если эпизод звучит абстрактно, пользователь не чувствует “это про меня”.'
  },
  {
    layer: 'Сцена действия',
    meaning: 'Один маленький поступок, который можно сделать в реальной жизни.',
    product: 'Приложение превращает смысл в действие: написать сообщение, выйти на прогулку, разобрать угол, сказать честную фразу.',
    risk: 'Если действия нет, АУРА остается чтением, а не продуктом изменения.'
  },
  {
    layer: 'Герой/avatar',
    meaning: 'Визуальная версия пользователя, которая постепенно набирает черты, предметы, свет, состояние и историю.',
    product: 'Avatar меняется после эпизода: не “получил награду”, а “в герое появилась новая черта”.',
    risk: 'Если avatar не связан с поступком, он выглядит как декоративный редактор внешности.'
  },
  {
    layer: 'Память сериала',
    meaning: 'Лента прошлых эпизодов: что человек прожил, какие выборы сделал, какие темы повторяются.',
    product: 'АУРА показывает не статистику ради статистики, а личную историю изменения.',
    risk: 'Если нет памяти, продукт не создает эмоциональной привязанности.'
  },
  {
    layer: 'Следующая серия',
    meaning: 'Мягкое ожидание завтрашнего эпизода без наказания за пропуск.',
    product: 'Возврат звучит как “продолжим твою историю”, а не как “ты потеряешь streak”.',
    risk: 'Если возврат строится только на давлении, продукт попадает в отвергаемый productivity-паттерн.'
  }
], [
  { key: 'layer', label: 'Слой личного сериала' },
  { key: 'meaning', label: 'Что это значит для пользователя' },
  { key: 'product', label: 'Как это делает АУРА' },
  { key: 'risk', label: 'Что сломает идею' }
]));
lines.push('');
lines.push('### Рабочие концепции приложения');
lines.push('');
lines.push('Чтобы идея стала понятной для презентации, ее можно разложить не на список функций, а на несколько рабочих продуктовых концепций. Во всех вариантах стартовый вход может быть очень простым: дата рождения, имя, время или место рождения, текущий запрос дня, настроение и короткий личный контекст. Важно, что дата рождения здесь не должна продаваться как жесткое предсказание. Она работает как символический и персональный вход: человек чувствует “это про меня”, но ценность появляется только тогда, когда этот вход запускает эпизод, действие, reset и изменение avatar.');
lines.push('');
lines.push(mdTable([
  {
    concept: '1. Life Series / сериал о себе',
    input: 'Дата рождения + выбранная жизненная тема сезона.',
    output: 'Персональный сезон из 7-14 коротких эпизодов: каждый день раскрывает одну сцену жизни.',
    loop: 'Каждый эпизод дает смысл, действие, reset и изменение героя/avatar; история накапливается как сериал.',
    why: 'Это самая сильная удерживающая рамка: человек возвращается не за советом, а за продолжением своей истории.'
  },
  {
    concept: '2. Future Self Avatar',
    input: 'Дата рождения + цель пользователя: спокойствие, уверенность, фокус, отношения, тело, деньги.',
    output: 'Главный герой сериала: будущая версия себя и карта качеств, которые человек постепенно проявляет.',
    loop: 'Каждое действие усиливает конкретную черту avatar: ясность, смелость, мягкость, дисциплина, открытость.',
    why: 'Делает avatar эмоциональным персонажем, а не украшением профиля.'
  },
  {
    concept: '3. Daily Aura Code',
    input: 'Дата рождения + короткий вопрос “что сегодня хочется изменить?”',
    output: 'Персональный код дня: тема, риск дня, ресурс дня и одно маленькое действие.',
    loop: 'Код дня становится названием эпизода; после выполнения действия avatar получает новый след прожитого выбора.',
    why: 'Подходит как самый простой daily-вход: быстро, лично, без тяжелого onboarding.'
  },
  {
    concept: '4. Ritual of the Day',
    input: 'Дата рождения + состояние сейчас: тревожно, устало, расфокусировано, пусто, вдохновленно.',
    output: 'Короткий ежедневный ритуал: смысловая подсказка, 30-60 секунд reset и действие на сегодня.',
    loop: 'Reset становится подготовкой к сцене действия, а не отдельной медитацией ради медитации.',
    why: 'Связывает spiritual/wellness вход с практической ежедневной привычкой.'
  },
  {
    concept: '5. Symbol to Action',
    input: 'Дата рождения + выбранный символ дня: архетип, стихия, карта, цвет, энергия, настроение.',
    output: 'Символическая интерпретация без жестких обещаний и три варианта действия разной сложности.',
    loop: 'Символ становится мотивом эпизода; действие доказывает, что это не просто чтение, а прожитая сцена.',
    why: 'Использует интерес к astrology/esoterics, но выводит его из чтения в поведение.'
  },
  {
    concept: '6. Inner Weather',
    input: 'Дата рождения + быстрый чек-ин: энергия, напряжение, ясность, желание контакта.',
    output: '“Внутренняя погода” дня: что поддерживает, что может мешать, какой шаг будет самым мягким.',
    loop: 'Продукт не говорит “кто ты навсегда”, а помогает прожить один день осознаннее и увидеть сдвиг.',
    why: 'Снижает риск недоверия: это не диагноз и не судьба, а мягкая навигация по состоянию.'
  },
  {
    concept: '7. Compatibility With Myself',
    input: 'Дата рождения + конфликт дня: хочу одно, делаю другое; хочу начать, но откладываю.',
    output: 'Разбор внутреннего конфликта: какая часть хочет роста, какая защищается, какой шаг их примиряет.',
    loop: 'Эпизод строится вокруг внутреннего конфликта; после действия avatar показывает не “уровень”, а согласованность.',
    why: 'Хорошо раскрывает эмоциональную глубину и может стать платной персональной механикой.'
  }
], [
  { key: 'concept', label: 'Концепция' },
  { key: 'input', label: 'Что вводит человек' },
  { key: 'output', label: 'Что получает' },
  { key: 'loop', label: 'Как соединяется с АУРОЙ' },
  { key: 'why', label: 'Почему это может работать' }
]));
lines.push('');
lines.push('Из этих концепций самая сильная базовая версия для MVP выглядит как связка Life Series + Future Self Avatar + Daily Aura Code + Ritual of the Day. Человек вводит дату рождения и короткий запрос дня, попадает в “серию” своей жизни, получает персональный смысловой вход, выбирает одно действие, проходит короткий reset и видит, как avatar меняется из-за выполненного шага. Остальные концепции можно рассматривать как расширения: Symbol to Action усиливает spiritual/astrology слой, Inner Weather делает продукт безопаснее и мягче, Compatibility With Myself добавляет эмоциональную глубину.');
lines.push('');
lines.push('### Сравнение концепций: почему выбираем не одну красивую идею, а связку');
lines.push('');
lines.push('Чтобы выбор продукта выглядел доказательно, важно сравнить концепции не только по вкусу, а по тому, какие рыночные сигналы их поддерживают. Ниже каждая концепция прочитана через собранные данные: какие категории ее подтверждают, какой пользовательский мотив она закрывает, где риск и какое место ей дать в продукте. Это защищает решение от ощущения “просто придумали красивую механику”.');
lines.push('');
lines.push(mdTable([
  {
    concept: 'Life Series / сериал о себе',
    evidence: 'Gaming/progression показывает силу сезонов, эпизодов, прогресса и возврата; self-improvement показывает спрос на движение вперед.',
    user: 'Пользователь возвращается не за разовым советом, а за продолжением личной истории.',
    risk: 'Если эпизоды будут случайными, сериал не соберется.',
    decision: 'Брать в ядро: это главная метафора продукта.'
  },
  {
    concept: 'Future Self Avatar',
    evidence: 'Avatar/identity и AI companion категории показывают спрос на визуальное/персональное отражение себя.',
    user: 'Пользователь хочет видеть версию себя, которая меняется вместе с поступками.',
    risk: 'Если avatar декоративный, продукт конкурирует с редакторами внешности.',
    decision: 'Брать в ядро, но только как причинный avatar, связанный с действием.'
  },
  {
    concept: 'Daily Aura Code',
    evidence: 'Astrology/esoterics подтверждает интерес к дате рождения, символам и персональным интерпретациям.',
    user: 'Пользователь получает быстрый вход “это про меня сегодня”.',
    risk: 'Если код звучит как предсказание судьбы, падает доверие и растет safety-риск.',
    decision: 'Брать как вход, но не как самостоятельную ценность.'
  },
  {
    concept: 'Ritual of the Day',
    evidence: 'Mindfulness/reset и habit loop показывают привычку к коротким ежедневным практикам.',
    user: 'Пользователь получает маленький ритуал, который снижает сопротивление перед действием.',
    risk: 'Если reset отделить от действия, АУРА станет еще одной библиотекой медитаций.',
    decision: 'Брать в MVP как мост между смыслом и действием.'
  },
  {
    concept: 'Symbol to Action',
    evidence: 'Spiritual guidance и manifestation-паттерны показывают спрос на символический язык, но конкурентное отличие появляется только при переводе в действие.',
    user: 'Пользователь превращает символ дня в конкретный поступок.',
    risk: 'Слишком много эзотерики может выглядеть манипулятивно.',
    decision: 'Оставить как усилитель для spiritual-сегмента.'
  },
  {
    concept: 'Inner Weather',
    evidence: 'Mood tracking, journaling и reset-паттерны показывают спрос на мягкую навигацию по состоянию.',
    user: 'Пользователь понимает свое состояние без диагноза и жестких обещаний.',
    risk: 'Может стать обычным mood tracker без визуального вау.',
    decision: 'Использовать как safety-рамку и формат чек-ина.'
  },
  {
    concept: 'Compatibility With Myself',
    evidence: 'Coaching/self-improvement поддерживает работу с внутренним конфликтом и accountability.',
    user: 'Пользователь видит, какая часть хочет роста, какая сопротивляется, и что их примиряет.',
    risk: 'Сложнее объяснить в первом экране; может стать слишком терапевтическим.',
    decision: 'Оставить для платной глубины и более поздних сезонов.'
  },
  {
    concept: 'Life Canvas',
    evidence: 'Avatar/identity дает визуальный спрос, gaming дает progression, journaling дает память, а social/share-паттерны показывают ценность красивой карточки.',
    user: 'Пользователь видит не только героя, но и картинку своей жизни, которая меняется от действий.',
    risk: 'Если делать слишком дорогое видео каждый день, экономика ломается.',
    decision: 'Брать как главный visual roadmap: сначала карточка, потом сезонная эволюция, потом premium animation.'
  }
], [
  { key: 'concept', label: 'Концепция' },
  { key: 'evidence', label: 'Какие данные поддерживают' },
  { key: 'user', label: 'Какую задачу закрывает' },
  { key: 'risk', label: 'Риск' },
  { key: 'decision', label: 'Решение' }
]));
lines.push('');
lines.push('Вывод из сравнения: ни одна концепция в одиночку не дает достаточно сильного продукта. Сериал без avatar может стать обычным дневником. Avatar без действия станет красивой игрушкой. Дата рождения без поведения станет гороскопом. Reset без смысла станет медитацией. Поэтому ядро АУРЫ должно быть именно связкой: Life Series + Daily Aura Code + Ritual of the Day + Future Self Avatar + Life Canvas.');
lines.push('');
lines.push('### Доказательная база: что уже держит продуктовую ставку');
lines.push('');
lines.push('На текущем уровне доказательств сильнее всего подтверждены не финальная готовность рынка купить АУРУ, а сама логика сборки продукта. Мы видим крупные соседние рынки, повторяющиеся функции, платные привычки и пользовательские боли. Но прямое доказательство спроса появится только после прототипных сессий и проверки платной глубины.');
lines.push('');
lines.push(mdTable([
  {
    layer: 'Масштаб рынка',
    evidence: `${fmt(dedupRows.length)} уникализированных объектов; ${fmt(nicheCountRollup.reduce((sum, row) => sum + num(row.direct_app_store_dedup_rows), 0))} приложений из магазинов по пяти направлениям.`,
    supports: 'Есть достаточно большой контекст, чтобы не считать идею маленькой локальной фантазией.',
    limit: 'Это не доказывает спрос именно на АУРУ.'
  },
  {
    layer: 'Деньги',
    evidence: `Рабочая рамка пересечения около ${money(intersection.samBase)}; сильные денежные сигналы в mindfulness, avatar/identity и astrology/esoterics.`,
    supports: 'В соседних категориях пользователи уже платят за состояние, смысл, персонализацию и визуальную/AI-ценность.',
    limit: 'Нужно подтвердить готовность платить именно за сезон, память и Life Canvas.'
  },
  {
    layer: 'Функциональные паттерны',
    evidence: 'Повторяются daily loop, reset, streak/progress, avatar/identity, AI-персонализация, journaling, платная глубина.',
    supports: 'АУРА не изобретает поведение с нуля, а соединяет знакомые паттерны в новую причинную петлю.',
    limit: 'Публичные карточки не показывают всю глубину первого пользовательского опыта.'
  },
  {
    layer: 'Белое пятно',
    evidence: 'Полная петля “смысл -> действие -> reset -> avatar/progress -> возврат” выглядит редкой среди близких направлений.',
    supports: 'Отличие стоит искать не в отдельной функции, а в причинной сборке.',
    limit: 'Нужна проверка главных конкурентов внутри продукта.'
  },
  {
    layer: 'Аудитория',
    evidence: `${icp.length} сегментов; первые кандидаты - Spiritual self-improvers и Habit/progress users; VOC показывает запрос на персонализацию, прогресс, доверие и понятную ценность.`,
    supports: 'Есть люди с близким недавним поведением, которым можно показать прототип.',
    limit: 'Сегменты пока не подтверждены интервью.'
  },
  {
    layer: 'Продуктовое ядро',
    evidence: `${productLoop.length} шагов MVP-петли; сформулированы экраны, тарифы, avatar roadmap и техническая лестница.`,
    supports: 'Идея уже переводится в конкретный MVP, а не остается абстрактной концепцией.',
    limit: 'Нужно проверить, считывают ли пользователи причинность без объяснения.'
  }
], [
  { key: 'layer', label: 'Слой доказательств' },
  { key: 'evidence', label: 'Что уже есть' },
  { key: 'supports', label: 'Что это поддерживает' },
  { key: 'limit', label: 'Граница доказательства' }
]));
lines.push('');
lines.push('Таким образом, решение не в том, чтобы выбрать одну концепцию и выбросить остальные. Правильнее собрать продуктовую архитектуру: Life Series отвечает за возврат, Daily Aura Code - за персональный вход, Ritual of the Day - за переход к действию, Future Self Avatar - за героя, Life Canvas - за визуальную картину изменений, а Compatibility With Myself и Symbol to Action становятся платной глубиной для отдельных сезонов.');
lines.push('');
lines.push('Главная граница для всех концепций: АУРА не должна обещать судьбу, диагноз или точное предсказание по дате рождения. Рабочая формулировка честнее: дата рождения и символический профиль помогают создать личный язык входа, но продукт доказывает ценность только тогда, когда пользователь совершает маленькое действие и видит понятный сдвиг.');
lines.push('');
lines.push('Пример первой пользовательской сессии: человек вводит дату рождения и пишет “я хочу перестать откладывать важный разговор”. АУРА не отвечает предсказанием. Она открывает эпизод дня: “серия про честность без давления”. Пользователь получает короткий reset, выбирает действие “написать одно честное сообщение без требования ответа”, отмечает выполнение, а avatar получает новую черту - не абстрактный XP, а след эпизода: больше ясности, света, прямоты. На следующий день приложение возвращает не наказанием за пропуск, а продолжением: “вчера ты сделал сцену честности; сегодня можно закрепить ее одним спокойным шагом”.');
lines.push('');
lines.push('### Продуктовый вердикт: какое приложение стоит делать');
lines.push('');
lines.push('Если отвечать прямо, АУРУ не стоит запускать как “астрологию с аватаром”, “AI-дневник”, “трекер привычек” или “генератор красивых видео”. Все эти категории уже понятны рынку, но каждая по отдельности слабее исходной идеи. Самая сильная формулировка продукта: мобильное приложение “личный сериал о себе”, где дата рождения и текущий запрос запускают ежедневный эпизод, эпизод превращается в одно действие, действие обновляет future-self avatar, а сезон собирается в историю изменений.');
lines.push('');
lines.push('Такой продукт сохраняет первую идею: специалист по astrology/смыслу, цифровые avatar, лучшая версия себя и визуальное раскрытие “другой жизни”. Но он делает эту идею более продуктовой: не просто показать красивую версию себя, а связать ее с маленьким реальным действием. Иначе пользователь посмотрит картинку, восхитится один раз и уйдет. Сила АУРЫ должна быть в повторяемой петле: “я понял себя сегодня -> сделал маленький шаг -> увидел, как мой герой изменился -> хочу продолжить сезон”.');
lines.push('');
lines.push(mdTable([
  {
    decision: 'Главная категория',
    answer: 'Emotional self-improvement / daily ritual, а не чистая astrology и не чистый avatar editor.',
    why: 'Так мы берем деньги и привычку платить из self-improvement/wellness, персональность из astrology, визуальный вау из avatar/AI и возврат из game progression.'
  },
  {
    decision: 'Главная метафора',
    answer: 'Life Series: персональный сериал о собственной жизни.',
    why: 'Это лучше объясняет возврат, сезоны, эпизоды, avatar и память, чем абстрактное “приложение для роста”.'
  },
  {
    decision: 'Главная механика',
    answer: 'Смысл дня -> одно действие -> reset -> обновление future-self avatar.',
    why: 'Это отличает продукт от чтения гороскопа, дневника, медитации и редактора аватаров.'
  },
  {
    decision: 'Главный визуальный слой',
    answer: 'Сначала статичный или слоистый future-self avatar; видео только как редкий premium-момент.',
    why: 'Видео может быть дорогим и разрушить маржу; базовая петля должна быть дешевой, быстрой и повторяемой.'
  },
  {
    decision: 'Главная аудитория старта',
    answer: 'Spiritual self-improvers и habit/progress users.',
    why: 'Первые хотят личный смысл, вторые хотят видеть движение. АУРА нужна именно на пересечении этих мотиваций.'
  },
  {
    decision: 'Главная монетизация',
    answer: 'Freemium + подписка на сезонную глубину + premium/token для дорогих визуальных сцен.',
    why: 'Так платная ценность появляется после первого момента пользы и не заставляет включать дорогой video-avatar каждый день.'
  }
], [
  { key: 'decision', label: 'Решение' },
  { key: 'answer', label: 'Что делать' },
  { key: 'why', label: 'Почему это следует из исследования' }
]));
lines.push('');
lines.push('Практический вывод: первая версия должна быть не максимально широкой, а максимально ясной. Пользователь открывает приложение не “посмотреть астрологию” и не “сделать аватар”, а продолжить личный сезон. Внутри сезона каждый день есть короткая серия, одно действие и визуальный след. Это и есть продуктовая ставка.');
lines.push('');
lines.push('### Avatar / Life Canvas: что именно должно меняться');
lines.push('');
lines.push('Отдельно важно зафиксировать: avatar в АУРЕ не должен быть только лицом, скином или talking head. Более сильная идея - **Life Canvas**, то есть визуальная картина жизни пользователя. Меняется не только персонаж, но и сцена вокруг него: свет, пространство, предметы, погода, цвет, символы, следы действий, сезонная атмосфера и “кадр” текущей жизни. Тогда avatar становится не декоративной картинкой, а визуальным дневником изменений.');
lines.push('');
lines.push('Эта механика лучше соответствует исходной идее “ты в другой жизни / лучшая версия себя / сериал о себе”. Пользователь должен видеть не просто “мой аватар стал красивее”, а “мой мир немного изменился, потому что я сделал конкретный шаг”. Например, после действия про честный разговор у героя появляется больше света, открытое окно, письмо на столе или более прямая поза. После действия про заботу о теле меняется энергия сцены, одежда, цвет, пространство. После действия про деньги появляется порядок, структура, рабочий стол, символ ресурса. Так АУРА превращает абстрактный прогресс в эмоциональную картинку жизни.');
lines.push('');
lines.push(mdTable([
  {
    layer: 'Герой',
    changes: 'Поза, взгляд, выражение, стиль, черта дня, уровень энергии.',
    trigger: 'Завершенное действие и эмоциональная отметка пользователя.',
    mvp: 'Да: статичный/слоистый future-self avatar.',
    risk: 'Если герой меняется без объяснения, пользователь не верит причинности.'
  },
  {
    layer: 'Сцена жизни',
    changes: 'Комната, город, природа, рабочее место, дорога, окно, пространство вокруг героя.',
    trigger: 'Тема сезона: отношения, тело, деньги, дом, творчество, спокойствие.',
    mvp: 'Да, но как карточка эпизода, не как тяжелое видео.',
    risk: 'Если сцена слишком случайная, продукт станет генератором красивых картинок.'
  },
  {
    layer: 'Свет и цвет',
    changes: 'Теплее/холоднее, яснее/мягче, больше воздуха, контраст, утро/вечер.',
    trigger: 'Состояние до и после reset, уровень ясности, завершение действия.',
    mvp: 'Да: самый дешевый и понятный способ показать изменение.',
    risk: 'Если визуальный язык не стабилен, прогресс будет плохо считываться.'
  },
  {
    layer: 'Предметы и символы',
    changes: 'Письмо, ключ, растение, зеркало, книга, чашка, карта, билет, свеча, инструмент.',
    trigger: 'Тип действия: разговор, забота, порядок, смелость, отдых, творчество.',
    mvp: 'Да: 1 предмет как след эпизода.',
    risk: 'Символы нельзя делать слишком эзотерическими или непонятными.'
  },
  {
    layer: 'Сезонная эволюция',
    changes: 'За 7 дней сцена становится цельнее: больше света, порядка, дороги, открытости.',
    trigger: 'Накопление завершенных эпизодов внутри сезона.',
    mvp: 'Минимально: before/after сезона.',
    risk: 'Если нет накопления, сериал распадается на случайные daily cards.'
  },
  {
    layer: 'Кадр другой жизни',
    changes: 'Редкий premium-кадр: “я в другой версии жизни”, трейлер сезона, future-self poster.',
    trigger: 'Финал сезона, milestone, платный token или premium-подписка.',
    mvp: 'Не в базовой норме; лучше как premium/вау-слой.',
    risk: 'Дорогая генерация может съесть маржу, если давать ее ежедневно.'
  }
], [
  { key: 'layer', label: 'Что меняется' },
  { key: 'changes', label: 'Визуальное изменение' },
  { key: 'trigger', label: 'От чего зависит' },
  { key: 'mvp', label: 'Роль в продукте' },
  { key: 'risk', label: 'Риск' }
]));
lines.push('');
lines.push('Рекомендуемая логика roadmap по avatar такая: сначала сделать не видео, а устойчивую визуальную грамматику. MVP должен показывать avatar + scene card: герой, фон, свет, один символ и след действия. Версия 1 добавляет сезонную эволюцию: before/after, галерею эпизодов, карту изменений, разные стили. Версия 2 добавляет premium visual moments: анимированную карточку, talking avatar, трейлер сезона, “другая жизнь” как редкий вау-кадр. Это позволит сохранить магию аватаров, но не разрушить экономику продукта.');
lines.push('');
lines.push(mdTable([
  {
    stage: 'MVP: Life Canvas card',
    product: 'Одна статичная карточка после эпизода: герой + сцена + свет + символ + короткая подпись.',
    tech: 'Шаблоны, image generation по лимиту, правила “действие -> визуальный след”.',
    monetization: 'Входит в базовую петлю и подписку.',
    proof: 'Пользователь понимает, почему картинка изменилась.'
  },
  {
    stage: 'V1: Season evolution',
    product: '7-дневная галерея изменений, before/after сезона, карта черт и повторяющихся тем.',
    tech: 'Сохранение visual state, consistency prompts, style presets, история эпизодов.',
    monetization: 'Основная ценность Aura Plus.',
    proof: 'Пользователь возвращается, чтобы увидеть продолжение визуальной истории.'
  },
  {
    stage: 'V1.5: Style packs',
    product: 'Стили жизни: cinematic, soft mystic, clean future-self, cozy, fashion/editorial.',
    tech: 'Preset styles, LoRA/style references или контролируемые prompt-шаблоны.',
    monetization: 'Premium-стили или часть Aura Premium.',
    proof: 'Пользователь выбирает стиль и готов платить за более точный образ себя.'
  },
  {
    stage: 'V2: Animated moments',
    product: 'Короткая анимированная карточка или 3-5 секунд движения сцены.',
    tech: 'Image-to-video через Runway/Luma/Stability/Replicate или локальный пайплайн.',
    monetization: 'Лимит в Premium или token.',
    proof: 'Анимация повышает share/save/return, а не просто разово удивляет.'
  },
  {
    stage: 'V3: Living avatar',
    product: 'Talking/future-self avatar, который обращается к пользователю в финале сезона.',
    tech: 'HeyGen/D-ID/Tavus/AKOOL или локальные talking-head модели.',
    monetization: 'Только premium/token, не ежедневная бесплатная норма.',
    proof: 'Пользователь готов платить за редкое обращение future-self.'
  }
], [
  { key: 'stage', label: 'Этап roadmap' },
  { key: 'product', label: 'Что видит пользователь' },
  { key: 'tech', label: 'Как делать' },
  { key: 'monetization', label: 'Где монетизировать' },
  { key: 'proof', label: 'Что должно доказаться' }
]));
lines.push('');
lines.push('Итог по аватарам: центральная ставка - не “сгенерировать пользователя в красивом образе”, а **показывать визуальную эволюцию его жизни**. Это может стать главным отличием АУРЫ: у конкурентов часто есть avatar, карточки, AI-chat или гороскоп; у АУРЫ должен быть причинный Life Canvas, где каждая маленькая сцена появляется из выбора пользователя.');
lines.push('');
lines.push('### Детальная комплектация продукта');
lines.push('');
lines.push('Ниже - не просто список желаемых функций, а рекомендуемая комплектация приложения по версиям. Это важно, потому что слабое место идеи сейчас не в недостатке возможностей, а в риске сделать слишком много несвязанных функций. MVP должен доказывать одну петлю, v1 - расширять сезон и монетизацию, v2 - добавлять дорогой avatar/video слой только после подтверждения возврата и оплаты.');
lines.push('');
lines.push(mdTable([
  {
    block: 'Первый вход',
    mvp: 'Дата рождения, имя, текущий запрос дня, выбор темы сезона.',
    v1: 'Время/место рождения опционально, сохраненные темы, мягкий privacy-экран.',
    later: 'Импорт календаря/заметок только после доверия.',
    rationale: 'Вход должен быть личным, но не тяжелым и не пугающим.'
  },
  {
    block: 'Сезон',
    mvp: '7-дневный сезон: уверенность, спокойствие, отношения, фокус, тело, деньги или творчество.',
    v1: '14- и 30-дневные сезоны, развилки, финал сезона, повторение темы.',
    later: 'Сезоны от авторов/экспертов и персональные сезонные пакеты.',
    rationale: 'Сезон дает причину вернуться без давления streak.'
  },
  {
    block: 'Эпизод дня',
    mvp: 'Короткий текст: название серии, тема, внутренний конфликт, ресурс, риск, одно действие.',
    v1: 'Разные тона: мягкий, дерзкий, духовный, рациональный; сохранение любимых эпизодов.',
    later: 'Голосовой эпизод и cinematic-трейлер сезона.',
    rationale: 'Эпизод - основной носитель смысла, он должен быть точным и коротким.'
  },
  {
    block: 'Действие',
    mvp: 'Одно действие на сегодня плюс выбор сложности: 2 минуты, 10 минут, смелый шаг.',
    v1: 'Планирование времени, напоминание, evidence note, повтор действия.',
    later: 'Интеграция с календарем или задачами.',
    rationale: 'Без действия продукт остается чтением, а не изменением.'
  },
  {
    block: 'Reset',
    mvp: '30-60 секунд дыхания/заземления/микронастроя перед действием.',
    v1: 'Несколько reset-форматов под состояние: тревога, усталость, злость, пустота.',
    later: 'Голосовые reset и персональные аудио.',
    rationale: 'Reset нужен как мост к действию, а не как отдельная библиотека медитаций.'
  },
  {
    block: 'Future-self avatar',
    mvp: 'Статичный или слоистый avatar: свет, состояние, предмет, черта дня, след действия.',
    v1: 'Сезонная эволюция avatar, выбор стиля, галерея изменений.',
    later: 'Video-avatar, talking avatar, сезонный трейлер.',
    rationale: 'Avatar должен быть доказательством прожитого выбора, а не декоративной картинкой.'
  },
  {
    block: 'Память',
    mvp: 'Лента эпизодов: дата, тема, действие, изменение avatar, короткая заметка.',
    v1: 'Итог недели, карта повторяющихся тем, before/after сезона.',
    later: 'Личный архив сезонов и экспорт красивой истории.',
    rationale: 'Память создает эмоциональную привязанность и платную глубину.'
  },
  {
    block: 'Социальность',
    mvp: 'Не делать социальную сеть; только сохранить/поделиться одной карточкой.',
    v1: 'Share-card “мой эпизод дня” без раскрытия личных данных.',
    later: 'Мягкие челленджи или creator-сезоны.',
    rationale: 'Социальность может помочь маркетингу, но рано ломает интимность продукта.'
  }
], [
  { key: 'block', label: 'Блок' },
  { key: 'mvp', label: 'MVP' },
  { key: 'v1', label: 'Версия 1' },
  { key: 'later', label: 'Позже' },
  { key: 'rationale', label: 'Почему так' }
]));
lines.push('');
lines.push('Самая важная оптимизация: убрать из MVP все, что не доказывает причинную петлю. Не нужен большой дневник, большая библиотека медитаций, социальная сеть, бесконечный редактор avatar, маркетплейс практик и ежедневное видео. Эти вещи могут появиться позже, но в первой версии они размоют продукт и увеличат себестоимость.');
lines.push('');
lines.push('### Рекомендуемые тарифы и упаковка ценности');
lines.push('');
lines.push('Тарифы должны вытекать из логики продукта. Если АУРА продает “одно предсказание” или “одно видео”, экономика и удержание будут слабыми. Если АУРА продает сезон личных изменений, память и avatar-эволюцию, подписка выглядит честнее. Поэтому базовая модель: бесплатный вход дает первый момент ценности, подписка открывает сезонную глубину, а дорогие визуальные сцены продаются отдельно или лимитируются.');
lines.push('');
lines.push(mdTable([
  {
    tier: 'Free / первый опыт',
    price: '$0',
    includes: 'Один короткий эпизод дня, базовый reset, одно действие, первый статичный avatar-след.',
    limit: 'Ограниченная история, без полной сезонной памяти, без deep visual.',
    goal: 'Доказать “это про меня” до платного экрана.'
  },
  {
    tier: 'Aura Plus',
    price: '$7.99-9.99 в месяц или $39.99-59.99 в год',
    includes: 'Ежедневные эпизоды, 7-дневные сезоны, память действий, avatar-эволюция, несколько reset-форматов.',
    limit: 'Video-avatar не безлимитный; image/avatar сцены ограничены разумным лимитом.',
    goal: 'Основная подписка для регулярной петли и здоровой маржи.'
  },
  {
    tier: 'Aura Premium',
    price: '$14.99-19.99 в месяц или годовой план с сильной скидкой',
    includes: 'Более глубокие сезоны, расширенная рефлексия, больше avatar-стилей, weekly recap, premium-сезоны.',
    limit: 'Видео остается лимитированным: например, 1-2 special scenes в месяц.',
    goal: 'Для пользователей, которым нужна глубина, красота и личная история.'
  },
  {
    tier: 'Visual tokens / packs',
    price: '$2.99-9.99 за пакеты или включено частично в Premium',
    includes: 'Сезонный трейлер, talking avatar, cinematic-сцена, редкий milestone-ролик.',
    limit: 'Только для дорогих генераций; не смешивать с ежедневной базовой петлей.',
    goal: 'Монетизировать вау-аватары без разрушения подписочной экономики.'
  },
  {
    tier: 'Creator / expert seasons',
    price: 'Позже: разовые сезоны или revenue share',
    includes: 'Сезоны от авторов: отношения, деньги, тело, творчество, женская энергия, уверенность.',
    limit: 'Не делать до доказанного ядра и понятной модерации.',
    goal: 'Расширить контент и маркетинг после PMF-сигналов.'
  }
], [
  { key: 'tier', label: 'Тариф' },
  { key: 'price', label: 'Цена для проверки' },
  { key: 'includes', label: 'Что входит' },
  { key: 'limit', label: 'Ограничение' },
  { key: 'goal', label: 'Зачем нужен' }
]));
lines.push('');
lines.push('Рекомендация по платному экрану: не показывать его до первого завершенного мини-цикла. Пользователь должен сначала увидеть персональный эпизод, выбрать действие и получить первый avatar-след. Только после этого можно продавать продолжение сезона: “открой полную 7-дневную историю, сохрани изменения героя и получи следующий эпизод”. Такой платный экран связан с ценностью, а не выглядит как попытка взять деньги до доверия.');
lines.push('');
lines.push('### Первый релиз: что именно должно быть в приложении');
lines.push('');
lines.push('Если бы нужно было завтра отдать продуктовую спецификацию на первый кликабельный прототип, она должна выглядеть так: один поток, один сезон, один avatar, одна петля. Ниже - минимальный набор экранов, который уже отвечает на вопрос “что мы создаем”.');
lines.push('');
lines.push(mdTable([
  {
    screen: '1. Welcome',
    content: 'Обещание: “продолжи сериал о себе”; выбор языка и мягкое объяснение, что это не предсказание судьбы.',
    key: 'Сразу отделить АУРУ от жесткой astrology и медицинских обещаний.'
  },
  {
    screen: '2. Birth + now',
    content: 'Дата рождения, имя, текущий запрос, состояние, тема сезона.',
    key: 'Соединить символический профиль и реальный контекст дня.'
  },
  {
    screen: '3. Season start',
    content: 'Название сезона, герой/future-self, 7 коротких закрытых эпизодов впереди.',
    key: 'Создать ожидание продолжения, а не одноразовую выдачу.'
  },
  {
    screen: '4. Episode of the day',
    content: 'Название серии, смысл дня, внутренний конфликт, ресурс, риск.',
    key: 'Дать ощущение “это про меня сегодня”.'
  },
  {
    screen: '5. Choose action',
    content: 'Три действия разной сложности: мягкое, обычное, смелое.',
    key: 'Пользователь сам выбирает уровень, поэтому меньше сопротивления.'
  },
  {
    screen: '6. Reset',
    content: '30-60 секунд подготовки к действию: дыхание, фраза, фокус.',
    key: 'Перевести смысл из головы в действие.'
  },
  {
    screen: '7. Mark done / reflection',
    content: 'Отметка выполнения, одна строка заметки, эмоция после действия.',
    key: 'Собрать доказательство действия без тяжелого контроля.'
  },
  {
    screen: '8. Avatar change',
    content: 'Future-self avatar получает свет, предмет, черту, цвет или состояние из эпизода.',
    key: 'Показать причинность: действие изменило героя.'
  },
  {
    screen: '9. Tomorrow hook',
    content: '“Завтра откроется следующая серия”; teaser без наказания за пропуск.',
    key: 'Возврат через любопытство и историю.'
  },
  {
    screen: '10. Paywall after value',
    content: 'Предложение продолжить сезон, сохранить историю и открыть avatar-эволюцию.',
    key: 'Деньги берутся за продолжение понятной ценности.'
  }
], [
  { key: 'screen', label: 'Экран' },
  { key: 'content', label: 'Что на нем' },
  { key: 'key', label: 'Зачем нужен' }
]));
lines.push('');
lines.push('Такой первый релиз не отвечает на все мечты о продукте, но он отвечает на главный вопрос исследования: может ли исходная идея стать понятным приложением. Если пользователь проходит этот поток и хочет следующий эпизод, у АУРЫ есть ядро. Если нет - добавление видео, соцсети или большего количества астрологических данных не спасет продукт.');
lines.push('');
lines.push('### Product specification: путь пользователя по дням');
lines.push('');
lines.push('Чтобы после исследования можно было переходить к дизайну и ТЗ, продукт нужно описать не только как набор экранов, но и как развитие опыта во времени. Для АУРЫ критично доказать четыре момента: первый вау в День 1, повторное открытие в День 2, завершение первого сезона в День 7 и понятный личный результат к Дню 30.');
lines.push('');
lines.push(mdTable([
  {
    day: 'День 1',
    journey: 'Регистрация, дата рождения, запрос дня, выбор темы сезона, первый эпизод, одно действие, reset, первый Life Canvas/avatar след.',
    emotion: '“Это про меня сегодня, и я понял, что могу сделать маленький шаг”.',
    product: 'Нужны 10 экранов первого релиза: вход, профиль, сезон, эпизод, действие, reset, отметка, avatar change, tomorrow hook, платный экран после ценности.',
    metric: 'Activation to first episode, completion первой петли, понимание причинности avatar.'
  },
  {
    day: 'День 2',
    journey: 'Пуш/напоминание, короткое продолжение вчерашней истории, новый эпизод, новое действие, сравнение вчера/сегодня.',
    emotion: '“История продолжается, вчерашний шаг не исчез”.',
    product: 'Нужна память вчерашнего эпизода и простая связка “вчера -> сегодня”.',
    metric: 'D1 return, episode open, second action completion.'
  },
  {
    day: 'День 7',
    journey: 'Финал первого сезона: 7 эпизодов, карта действий, before/after Life Canvas, summary черт героя.',
    emotion: '“Я вижу, что неделя была не случайной, у нее появилась история”.',
    product: 'Нужен season recap и первый сильный платный/retention момент.',
    metric: 'Season completion, save/share recap, trial/subscription intent.'
  },
  {
    day: 'День 30',
    journey: 'Несколько сезонов или один длинный цикл, архив изменений, повторяющиеся темы, персональные рекомендации следующего сезона.',
    emotion: '“Я вижу свою траекторию, а не отдельные советы”.',
    product: 'Нужны архив, карта паттернов, рекомендации следующего сезона и premium visual moment.',
    metric: 'D30 retention, paid conversion, willingness to pay for visual/premium depth.'
  }
], [
  { key: 'day', label: 'Момент' },
  { key: 'journey', label: 'Что происходит' },
  { key: 'emotion', label: 'Что должен почувствовать пользователь' },
  { key: 'product', label: 'Что нужно в продукте' },
  { key: 'metric', label: 'Метрика' }
]));
lines.push('');
lines.push('Граница MVP: первый релиз должен полностью закрыть День 1 и частично День 2. День 7 можно показать в кликабельном прототипе или симуляции. День 30 не нужно строить сразу, но он нужен как продуктовый “север”: вся память, сезоны, avatar evolution и монетизация должны вести к ощущению траектории.');
lines.push('');
lines.push('### Что точно не делать в MVP');
lines.push('');
lines.push('Границы продукта так же важны, как функции. Если в MVP добавить все привлекательные идеи сразу, АУРА станет дорогой, размытой и непроверяемой. Поэтому в первую версию сознательно не включаем следующее.');
lines.push('');
lines.push(mdTable([
  { item: 'Ежедневный video-avatar', reason: 'Слишком дорогой слой до доказанного retention и willingness to pay.', later: 'Вернуть как premium/token после season completion.' },
  { item: 'Социальная сеть', reason: 'Ломает интимность продукта и усложняет модерацию.', later: 'Сначала share-card, потом мягкие челленджи.' },
  { item: 'Маркетплейс практик', reason: 'Рано: нет доказанного ядра и качества контента.', later: 'После creator/expert seasons.' },
  { item: 'Большой дневник', reason: 'Уводит в занятый рынок journaling и создает лишнее трение.', later: 'Оставить короткую заметку-доказательство.' },
  { item: 'AR / метавселенная / 3D-мир', reason: 'Не нужно для проверки причинной петли.', later: 'Только если Life Canvas доказал сильный визуальный спрос.' },
  { item: 'Human coaching внутри MVP', reason: 'Меняет операционную модель и unit economics.', later: 'Проверять отдельно как high-ticket слой.' }
], [
  { key: 'item', label: 'Не делаем' },
  { key: 'reason', label: 'Почему' },
  { key: 'later', label: 'Когда вернуться' }
]));
lines.push('');
lines.push('### Прототипы как гипотезы');
lines.push('');
lines.push('Дальше исследование должно мыслить не “один раз придумали продукт”, а “каждая гипотеза рождает новый прототип”. Сначала есть сырая идея: специалист по astrology/meaning, цифровые avatar, визуальная лучшая версия себя, сериал о жизни, заметки и действия. Потом мы смотрим рынки и конкурентов, забираем повторяющиеся паттерны, собираем первый прототип, проверяем его на конкурентах и ЦА, после чего уточняем продукт. Это нормальная логика: прототип не финальный дизайн, а инструмент принятия решения.');
lines.push('');
lines.push(mdTable([
  {
    step: '0. Сырая идея',
    question: 'Можно ли соединить дату рождения, avatar, личный смысл, действия и сериал о себе?',
    prototype: 'Короткое описание Life Series + Future Self Avatar + Daily Aura Code.',
    decision: 'Если это не собирается в одну историю, продукт распадается на чужие категории.'
  },
  {
    step: '1. Рыночный прототип',
    question: 'В каких рынках эта идея вообще живет и где есть деньги?',
    prototype: 'Карта пяти категорий: wellness, self-improvement, astrology, avatar/identity, gaming/progression.',
    decision: 'Если деньги видны только в нерелевантных рынках, H2 ослабляется.'
  },
  {
    step: '2. Функциональный прототип',
    question: 'Какие фичи нужны, чтобы продукт не был просто чтением или аватаркой?',
    prototype: 'Экран входа, эпизод дня, маленькое действие, reset, изменение avatar, память сезона.',
    decision: 'Если фича уже везде есть и не дает отличия, она становится hygiene, а не преимуществом.'
  },
  {
    step: '3. Конкурентный прототип',
    question: 'Есть ли у конкурентов такая же связка внутри onboarding?',
    prototype: 'Ручной проход по P0-конкурентам: смысл, действие, reset, avatar, paywall.',
    decision: 'Если найден скрытый клон, нужно сузить или изменить ставку.'
  },
  {
    step: '4. Аудиторный прототип',
    question: 'Кто понимает ценность быстрее: spiritual users, habit users, reset users или avatar users?',
    prototype: 'Одинаковая петля, но разные входы и формулировки для сегментов.',
    decision: 'Первичный ICP выбирается по недавнему поведению, а не по симпатии команды.'
  },
  {
    step: '5. Технический прототип',
    question: 'Можно ли это реально собрать современными сервисами и сколько это будет стоить?',
    prototype: 'Схема генерации текста, изображений/avatar, видео, хранения памяти и аналитики.',
    decision: 'Если видео/avatar слишком дорогие, MVP должен начинаться с image/static avatar и текста.'
  },
  {
    step: '6. Экономический прототип',
    question: 'При каком прайсинге, частоте генераций и конверсии модель имеет смысл?',
    prototype: 'Unit-модель: подписка, лимиты генераций, себестоимость, gross margin, маркетинг.',
    decision: 'Если себестоимость съедает маржу, меняем механику или монетизацию до разработки.'
  }
], [
  { key: 'step', label: 'Шаг' },
  { key: 'question', label: 'Вопрос' },
  { key: 'prototype', label: 'Что прототипируем' },
  { key: 'decision', label: 'Какое решение принимаем' }
]));
lines.push('');
lines.push('Эта логика важна для клиента: мы не утверждаем сразу, что финальный продукт найден. Мы показываем путь: идея выглядит достаточно сильной, чтобы продолжать; теперь ее нужно последовательно сузить через конкурентов, пользователя, технологию, экономику и маркетинг.');
lines.push('');
lines.push('### Функциональная карта MVP');
lines.push('');
lines.push('Если собрать текущую продуктовую ставку в MVP, он должен быть не большим комбайном, а проверкой одной цепочки. Ниже функции разложены по роли: какие обязательны для первой проверки, какие усиливают отличие, какие лучше оставить как следующий этап.');
lines.push('');
lines.push(mdTable([
  {
    feature: 'Дата рождения и символический профиль',
    role: 'Вход в ощущение “это про меня”.',
    mvp: 'Да, но коротко: дата рождения + имя + текущий запрос.',
    competitor: 'Есть в astrology/spiritual продуктах, но часто остается чтением без действия.'
  },
  {
    feature: 'Эпизод дня / Life Series',
    role: 'Сюжетная рамка возврата: сегодня идет новая серия моей жизни.',
    mvp: 'Да, это главный продуктовый угол.',
    competitor: 'Встречается в играх/квестах, но редко соединяется с личным смыслом и avatar self.'
  },
  {
    feature: 'Future Self Avatar',
    role: 'Визуальный герой, который меняется от действий.',
    mvp: 'Да, но можно начать со статичного/полустатичного avatar и состояния.',
    competitor: 'Avatar есть во многих продуктах, но причинность action -> identity надо проверять.'
  },
  {
    feature: 'Одно маленькое действие',
    role: 'Переводит смысл в реальное поведение.',
    mvp: 'Обязательно: без действия продукт остается чтением.',
    competitor: 'Habit/coaching продукты сильны здесь, поэтому нужна мягкая и персональная подача.'
  },
  {
    feature: 'Короткий reset',
    role: 'Снижает сопротивление перед действием.',
    mvp: 'Да, 30-60 секунд, без тяжелой библиотеки медитаций.',
    competitor: 'Mindfulness-продукты сильны, но часто reset живет отдельно от действия.'
  },
  {
    feature: 'Память сезона',
    role: 'Показывает историю изменений, а не просто streak.',
    mvp: 'Минимально: лента эпизодов и черт avatar.',
    competitor: 'В habit/productivity часто есть история, но она сухая и счетчиковая.'
  },
  {
    feature: 'Видео-avatar / deep visual generation',
    role: 'Может дать вау-эффект и shareability.',
    mvp: 'Осторожно: сначала проверить себестоимость и ценность.',
    competitor: 'Сильно для маркетинга, но может быть дорогим и не обязательным для первой петли.'
  },
  {
    feature: 'Заметки, to-do, дневник',
    role: 'Поддерживает действия и память.',
    mvp: 'Только как легкий слой, не превращать в productivity app.',
    competitor: 'Рынок занят, поэтому это hygiene, а не основное отличие.'
  }
], [
  { key: 'feature', label: 'Функция' },
  { key: 'role', label: 'Зачем нужна' },
  { key: 'mvp', label: 'Что делать в MVP' },
  { key: 'competitor', label: 'Что проверять у конкурентов' }
]));
lines.push('');
lines.push('Практический вывод по функциям: MVP должен проверять Life Series, Future Self Avatar, Daily Aura Code, маленькое действие, reset и память эпизодов. Видеоаватары, богатая кастомизация, социальность, marketplace, сложные заметки и глубокая генерация могут стать расширением, но их опасно ставить в центр до проверки себестоимости и пользовательской ценности.');
lines.push('');
lines.push('### Техническая реализуемость и себестоимость');
lines.push('');
lines.push('Следующий обязательный вопрос: можно ли это сделать технически и при какой себестоимости. На уровне современной реализации базовый MVP выглядит реализуемым: текстовый смысловой вход, короткие сценарии, статичный или полугенерируемый avatar, память эпизодов, действия и аналитика не требуют невозможных технологий. Самый дорогой и рискованный слой - частая генерация видео-avatar или сложного персонализированного визуального результата на каждого пользователя.');
lines.push('');
lines.push(mdTable([
  {
    layer: 'Текст и интерпретации',
    feasible: 'Высокая',
    cost: 'Низкая/средняя на пользователя при лимитах.',
    decision: 'Можно включать в MVP, но нужны safety-рамки и запрет жестких предсказаний.'
  },
  {
    layer: 'Статичный avatar / future self image',
    feasible: 'Высокая',
    cost: 'Контролируемая, если генерировать не на каждый клик.',
    decision: 'Хороший первый визуальный слой.'
  },
  {
    layer: 'Микроизменения avatar',
    feasible: 'Средняя/высокая',
    cost: 'Можно удешевить через шаблоны, слои, состояния, аксессуары, свет, цвет, текстуры.',
    decision: 'Лучше для MVP, чем полноценное видео.'
  },
  {
    layer: 'Видео-avatar',
    feasible: 'Средняя',
    cost: 'Потенциально высокая; зависит от длительности, качества, частоты и провайдера.',
    decision: 'Проверять отдельно: может быть premium или разовой покупкой, а не ежедневной бесплатной механикой.'
  },
  {
    layer: 'Память сериала',
    feasible: 'Высокая',
    cost: 'Низкая: хранение эпизодов, действий, тегов, состояний.',
    decision: 'Обязательный слой удержания.'
  },
  {
    layer: 'Аналитика и валидация',
    feasible: 'Высокая',
    cost: 'Низкая/средняя.',
    decision: 'Нужна с первого прототипа: понимать, где пользователь теряет смысл.'
  }
], [
  { key: 'layer', label: 'Слой' },
  { key: 'feasible', label: 'Реализуемость' },
  { key: 'cost', label: 'Себестоимость' },
  { key: 'decision', label: 'Решение для продукта' }
]));
lines.push('');
lines.push('Экономическая проверка должна идти от частоты генераций. Если пользователь каждый день получает дорогое видео, модель может не сойтись при обычной подписке. Если же ежедневная петля строится на тексте, легком reset, статичном avatar и редких визуальных premium-моментах, экономика становится гораздо реалистичнее. Поэтому до финального ТЗ нужно посчитать три сценария: дешевый static-avatar MVP, средний image/avatar MVP и дорогой video-avatar MVP.');
lines.push('');
lines.push(mdTable([
  {
    scenario: 'Static-avatar MVP',
    contents: 'Текст, эпизод дня, действие, reset, статичный avatar со слоями.',
    monetization: 'Подписка с бесплатной daily-петлей и платной глубиной.',
    risk: 'Может не хватить визуального вау, но лучше для первой экономики.'
  },
  {
    scenario: 'Image/avatar MVP',
    contents: 'Периодическая генерация образов, сезонные изменения, персональные визуальные карточки.',
    monetization: 'Подписка + лимиты генераций + платные пакеты.',
    risk: 'Нужно считать себестоимость генераций и лимиты.'
  },
  {
    scenario: 'Premium video-avatar',
    contents: 'Видео “лучшая версия себя”, сериальные трейлеры, специальные эпизоды.',
    monetization: 'Premium-дополнение, токены или разовые покупки.',
    risk: 'Высокая себестоимость; нельзя делать бесплатной ежедневной нормой без финмодели.'
  }
], [
  { key: 'scenario', label: 'Сценарий экономики' },
  { key: 'contents', label: 'Что входит' },
  { key: 'monetization', label: 'Как монетизировать' },
  { key: 'risk', label: 'Главный риск' }
]));
lines.push('');
lines.push('### Что технически нужно подключать для avatar и Life Series');
lines.push('');
lines.push('Если сопоставить техническую часть с продуктовой идеей, АУРА не должна начинаться с самого дорогого “живого видеоаватара”. Техническая логика должна идти ступенями: сначала собрать работающую ежедневную петлю, затем добавить визуальный future-self образ, потом микропрогресс avatar, и только после этого проверять premium video-avatar как дорогой вау-слой. Иначе продукт рискует потратить бюджет на генерацию роликов до того, как доказал, что пользователь вообще хочет возвращаться в “сериал о себе”.');
lines.push('');
lines.push(mdTable([
  {
    block: '1. Профиль и смысловой вход',
    job: 'Дата рождения, имя, запрос дня, состояние, выбранная тема сезона.',
    services: 'Backend и база: Supabase/Firebase; LLM-слой для интерпретаций и safety-фильтров.',
    mvp: 'Обязательно в MVP.',
    risk: 'Нельзя хранить чувствительные данные без явного согласия и понятной privacy-логики.'
  },
  {
    block: '2. Сценарий эпизода',
    job: 'Сформировать серию дня: тема, конфликт, мягкий смысл, одно действие, короткий reset.',
    services: 'LLM orchestration + prompt/version storage + moderation/safety rules.',
    mvp: 'Обязательно в MVP.',
    risk: 'Если генерация звучит как гадание или диагноз, доверие падает.'
  },
  {
    block: '3. Static / layered avatar',
    job: 'Показать героя/future-self без дорогого видео: образ, свет, состояние, предметы, черты.',
    services: 'Image generation API или шаблонный avatar-builder; хранение ассетов в storage/CDN.',
    mvp: 'Лучший первый визуальный слой.',
    risk: 'Если avatar не связан с действием, он становится косметикой.'
  },
  {
    block: '4. Микроизменения avatar',
    job: 'После действия менять не весь avatar, а черту: свет, позу, аксессуар, фон, карточку эпизода.',
    services: 'Template engine + image generation по лимиту + rules engine “действие -> изменение”.',
    mvp: 'Желательно в MVP или сразу после него.',
    risk: 'Нужна объяснимая причинность, иначе пользователь не поймет, почему образ изменился.'
  },
  {
    block: '5. Voice / narration',
    job: 'Озвучить эпизод, reset или обращение future-self.',
    services: 'TTS API, например ElevenLabs или аналог; аудио-кэширование.',
    mvp: 'Не обязательно, но может усилить эмоциональность.',
    risk: 'Голос повышает стоимость и требования к качеству; плохой voice ломает ощущение премиальности.'
  },
  {
    block: '6. Video-avatar / living avatar',
    job: 'Сделать ролики “лучшая версия себя”, трейлер сезона, special episode или talking avatar.',
    services: 'HeyGen / D-ID / Tavus для avatar-video; Runway или похожие video generation API для cinematic-сцен.',
    mvp: 'Не ставить в ежедневную бесплатную норму; тестировать как premium.',
    risk: 'Самый дорогой слой: себестоимость, latency, retries, права на лицо/образ и consent.'
  },
  {
    block: '7. Память сериала и аналитика',
    job: 'Хранить эпизоды, действия, состояния avatar, возврат, paywall, понимание причинности.',
    services: 'Postgres/Supabase, object storage, event analytics, A/B flags.',
    mvp: 'Обязательно с первой версии.',
    risk: 'Без аналитики невозможно понять, где ломается петля: смысл, действие, reset или avatar.'
  }
], [
  { key: 'block', label: 'Технический блок' },
  { key: 'job', label: 'Что делает' },
  { key: 'services', label: 'Что подключать' },
  { key: 'mvp', label: 'Роль в MVP' },
  { key: 'risk', label: 'Главный риск' }
]));
lines.push('');
lines.push('Практическая рекомендация: первая техническая версия должна быть дешевой, но эмоционально понятной. То есть текстовый эпизод, одно действие, reset, статичный или слоистый avatar, память эпизодов и базовая аналитика. Видео-avatar лучше вынести в отдельный paid/premium эксперимент: например, пользователь получает один бесплатный “трейлер сезона” после нескольких завершенных эпизодов, а дальше платит токенами или подпиской за редкие special episodes. Это лучше соответствует экономике и не убивает маржу ежедневной петли.');
lines.push('');
lines.push('Ниже не финальный выбор подрядчиков, а расширенная карта подключаемых сервисов для MVP и следующих итераций. Здесь важно мыслить не “какой один сервис выбрать”, а “какой стек даст нам управляемую себестоимость и нужный эмоциональный эффект”. Цены, лимиты, latency и правила consent у таких API меняются, поэтому перед финмоделью и ТЗ их нужно перепроверять по официальным страницам и считать на конкретных сценариях: сколько текстовых эпизодов, сколько image/avatar генераций, сколько секунд видео, сколько voice-over и сколько retries на одного пользователя.');
lines.push('');
lines.push(mdTable([
  {
    type: 'Image/API',
    source: 'OpenAI Image Generation API',
    use: 'Генерация и редактирование image/avatar cards, визуальных карточек эпизода, future-self образов.',
    price: 'Считать по модели, качеству, размеру и числу изображений.',
    note: 'Подходит для image-first MVP: быстро проверить, цепляет ли пользователя “образ себя”.',
    url: 'https://openai.com/index/image-generation-api/'
  },
  {
    type: 'Model marketplace',
    source: 'Replicate',
    use: 'Доступ к разным image/video/open-source моделям через API и pay-as-you-go эксперименты.',
    price: 'Pay-as-you-go по времени работы модели/GPU.',
    note: 'Удобно для прототипирования и сравнения моделей без жесткой привязки к одному поставщику.',
    url: 'https://replicate.com/pricing'
  },
  {
    type: 'Image/video API',
    source: 'Stability AI API',
    use: 'Быстрая генерация visual cards, стилизация, image-to-image, отдельные video-эксперименты.',
    price: 'Кредитная модель; Stable Image Core указан как 3 credits за генерацию.',
    note: 'Хороший кандидат для недорогих визуальных карточек и проверки альтернатив к OpenAI/Replicate.',
    url: 'https://platform.stability.ai/pricing'
  },
  {
    type: 'Video API',
    source: 'Runway API',
    use: 'Кинематографичная video generation, трейлеры сезонов, visual episodes.',
    price: 'Кредитная модель; пример API billing: 5s video около $0.25 по указанной таблице.',
    note: 'Использовать для редких вау-моментов, а не для ежедневной бесплатной нормы.',
    url: 'https://docs.dev.runwayml.com/usage/billing/'
  },
  {
    type: 'Video/API',
    source: 'Luma Dream Machine / Ray',
    use: 'Text-to-video и image-to-video для коротких “сцен жизни”, mood-трейлеров и visual episodes.',
    price: 'Кредитная модель по секундам видео; тарифы Plus/Pro/Ultra начинаются с $30/$90/$300 в месяц.',
    note: 'Смотреть как cinematic-слой рядом с Runway/Kling, особенно для image-to-video экспериментов.',
    url: 'https://lumalabs.ai/pricing'
  },
  {
    type: 'Avatar video API',
    source: 'HeyGen API',
    use: 'Avatar video, talking avatar, digital twin / instant avatar сценарии.',
    price: 'Pay-as-you-go: стандартный Avatar III около $1/min, Avatar IV до $3-5/min, Video Agent около $2/min.',
    note: 'Сильный кандидат для premium-видеослоя; custom digital twin и режимы вычитки требуют enterprise-проверки.',
    url: 'https://help.heygen.com/en/articles/10060327-heygen-api-pricing-explained'
  },
  {
    type: 'Avatar video API',
    source: 'D-ID API',
    use: 'Talking avatars / agents / video presenter сценарии.',
    price: 'Планы от trial до paid; trial дает ограниченные минуты video/streaming, далее кредиты/планы.',
    note: 'Проверять для talking portrait и agent-слоя; важно смотреть watermark, лицензию и права на персональный avatar.',
    url: 'https://www.d-id.com/pricing/api/'
  },
  {
    type: 'Conversational avatar API',
    source: 'Tavus API',
    use: 'Conversational video interface и AI-replica сценарии.',
    price: 'API/pricing требует отдельной коммерческой проверки по выбранному сценарию.',
    note: 'Больше подходит для дорогого future-self conversation, чем для простого MVP.',
    url: 'https://docs.tavus.io/api-reference'
  },
  {
    type: 'Avatar video platform',
    source: 'Synthesia',
    use: 'AI-presenter videos, avatars, dubbing, personal avatars, API access на старших планах.',
    price: 'Планы от ~$29/month; API access указан на Creator/выше, enterprise - custom.',
    note: 'Скорее B2B/training-style benchmark, полезен для понимания качества avatar-presenter рынка.',
    url: 'https://www.synthesia.io/pricing'
  },
  {
    type: 'Avatar video platform/API',
    source: 'Colossyan',
    use: 'AI avatars, custom avatars, AI voices, auto-translation, API для автоматизации видео.',
    price: 'Starter около $27/month с 15 min/month; Business около $88/month, API included/add-on по плану.',
    note: 'Полезен как benchmark “аватар + обучение + сценарии”, но для АУРЫ может быть слишком корпоративным.',
    url: 'https://www.colossyan.com/pricing'
  },
  {
    type: 'Avatar video platform/API',
    source: 'Elai',
    use: 'Avatar-presenter, talking photo, video slides, API integration.',
    price: 'Free/basic/advanced; Basic около $23/month annually, Advanced около $59/user/month annually.',
    note: 'Смотреть как быстрый benchmark talking-avatar без сложной cinematic-части.',
    url: 'https://elai.io/pricing/'
  },
  {
    type: 'Enterprise avatar API',
    source: 'Hour One',
    use: 'Automated avatar video production at scale через enterprise API.',
    price: 'API доступен enterprise-пользователям; цена обычно custom.',
    note: 'Не MVP-провайдер, но важен как ориентир верхнего B2B-слоя рынка.',
    url: 'https://helpcenter.hourone.ai/knowledge/api'
  },
  {
    type: 'Interactive avatar',
    source: 'DeepBrain AI / AI Studios',
    use: 'Interactive avatar, AI video generator, dubbing, talking avatar, enterprise deployment.',
    price: 'Interactive avatar: add-on slots около $49/slot/month; conversation usage примерно $0.2-0.5/min по модели.',
    note: 'Интересен для future-self conversation, но требует жесткого контроля стоимости минут разговора.',
    url: 'https://help.aistudios.com/en/articles/14683575-how-does-interactive-avatar-pricing-work'
  },
  {
    type: 'Avatar/API',
    source: 'AKOOL API',
    use: 'Streaming avatar, talking avatar, talking photo, lipsync, face swap, voice generator.',
    price: 'Кредитная сетка: talking avatar 1080p 5 credits/10s, 4K 10 credits/10s; streaming avatar 1-1.2 credits/10s.',
    note: 'Хороший кандидат для тестов talking/streaming avatar, но нужно понять цену одного credit и качество.',
    url: 'https://akool.com/ja-jp/api-pricing'
  },
  {
    type: 'Avatar/ad video API',
    source: 'Creatify API',
    use: 'AI Avatar, URL-to-video, product videos, AI shorts, ad clone.',
    price: 'API Starter $99/month за 500 credits; AI Avatar 5 credits/30s; Aurora 0.5-1 credit/sec.',
    note: 'Больше ad/UGC-инструмент; полезен для маркетинговых avatar-роликов и performance-креативов.',
    url: 'https://docs.creatify.ai/billing'
  },
  {
    type: 'Voice API',
    source: 'ElevenLabs API',
    use: 'Text-to-speech, voice narration, эмоциональный voice reset.',
    price: 'Считать по плану, символам/минутам и требованиям к voice clone.',
    note: 'Добавлять после проверки текстовой петли; голос повышает стоимость и ожидание качества.',
    url: 'https://elevenlabs.io/docs/overview/intro'
  },
  {
    type: 'Voice/STT API',
    source: 'Cartesia',
    use: 'TTS/STT и голосовые agent-сценарии, если АУРА пойдет в аудио/разговорный режим.',
    price: 'Кредитная модель; STT указан как credits per second, voice-agent минуты считаются отдельно.',
    note: 'Резервный вариант для voice-first механик и быстрых low-latency сценариев.',
    url: 'https://cartesia.ai/pricing'
  },
  {
    type: 'Backend',
    source: 'Supabase',
    use: 'Auth, Postgres, storage, edge functions, база эпизодов и состояния avatar.',
    price: 'Планы и usage по MAU/storage/egress/functions.',
    note: 'Подходит как быстрый backend для MVP, но нужно считать MAU/storage/egress.',
    url: 'https://supabase.com/pricing'
  },
  {
    type: 'Backend',
    source: 'Firebase',
    use: 'Auth, analytics, remote config, push notifications, mobile backend.',
    price: 'Spark/Blaze; usage-based pricing для Firebase/Google Cloud ресурсов.',
    note: 'Альтернатива Supabase, особенно если делать mobile-first и быстро включать аналитику/remote config.',
    url: 'https://firebase.google.com/pricing'
  },
  {
    type: 'Payments',
    source: 'RevenueCat',
    use: 'Подписки, paywalls, entitlement logic, App Store/Google Play billing, A/B paywall tests.',
    price: 'Считать по revenue/MAU и выбранному плану.',
    note: 'Практически обязательный кандидат для мобильной подписочной модели, чтобы не писать billing-логику с нуля.',
    url: 'https://www.revenuecat.com/pricing/'
  },
  {
    type: 'Analytics',
    source: 'PostHog',
    use: 'Product analytics, funnels, feature flags, session replay, experiments.',
    price: 'Usage-based по events/session replay/features.',
    note: 'Нужен для проверки, где ломается петля: onboarding, первый avatar, действие, reset, paywall.',
    url: 'https://posthog.com/pricing'
  }
], [
  { key: 'type', label: 'Тип' },
  { key: 'source', label: 'Сервис / источник' },
  { key: 'use', label: 'Как может использоваться в АУРЕ' },
  { key: 'price', label: 'Цена / единица для проверки' },
  { key: 'note', label: 'Как читать для решения' },
  { key: 'url', label: 'Источник' }
]));
lines.push('');
lines.push('Отдельно нужно рассмотреть локальный/open-source слой. Он не заменяет hosted API в первом прототипе, потому что требует GPU, MLOps, очередей, мониторинга качества, прав на модели и инженеров, которые будут чинить пайплайн. Но он важен стратегически: если у АУРЫ выстрелит регулярная визуальная петля, локальные модели могут снизить переменную себестоимость, дать больше контроля над стилем и убрать зависимость от одного avatar-провайдера.');
lines.push('');
lines.push(mdTable([
  {
    model: 'ComfyUI',
    job: 'Оркестрация локальных visual workflows: image, image-to-image, animation nodes, batch generation.',
    role: 'Лаборатория для сборки пайплайна “future-self card -> micro-animation -> video variation”.',
    cost: 'Нет оплаты за API-вызов, но нужны GPU/серверы, настройка, обновления, хранение и QA.',
    risk: 'Высокая сложность поддержки; custom nodes могут ломаться после обновлений.',
    url: 'https://github.com/comfy-org/ComfyUI'
  },
  {
    model: 'FLUX.1 / Stable Diffusion family',
    job: 'Статичные avatar cards, стили, mood-образы, “я в другой жизни”, сезонные visual states.',
    role: 'Кандидат для дешевого image-first слоя после доказательства спроса.',
    cost: 'Переменная стоимость уходит в GPU-время; лицензии и коммерческие условия проверять по конкретной модели.',
    risk: 'Нужны LoRA/style control, prompt QA и safety-фильтры, иначе образ будет нестабильным.',
    url: 'https://huggingface.co/black-forest-labs/FLUX.1-schnell'
  },
  {
    model: 'LivePortrait',
    job: 'Оживление портрета по driving video / motion template, мимика и движение головы.',
    role: 'Хороший локальный кандидат для “живого” future-self без полного text-to-video.',
    cost: 'GPU-инференс + подготовка исходных портретов; на Apple Silicon может быть существенно медленнее, чем на RTX.',
    risk: 'Нужны consent, стабильная фронтальная фотография, контроль похожести и защита от deepfake-рисков.',
    url: 'https://github.com/KlingAIResearch/LivePortrait'
  },
  {
    model: 'SadTalker',
    job: 'Talking head video из одного портрета и аудио.',
    role: 'Прототип для “avatar говорит со мной” без покупки дорогого API на каждой итерации.',
    cost: 'Локальный GPU-инференс; Apache 2.0 у репозитория, но все равно проверять веса/зависимости/коммерческое использование.',
    risk: 'Качество может выглядеть менее premium, чем у hosted avatar-сервисов; нужен human QA.',
    url: 'https://github.com/OpenTalker/SadTalker'
  },
  {
    model: 'Wav2Lip',
    job: 'Lip-sync для уже готового видео/лица по аудиодорожке.',
    role: 'Инструментальный модуль, если нужно синхронизировать рот, а не генерировать весь avatar.',
    cost: 'Локальный инференс; стоимость - GPU и поддержка окружения.',
    risk: 'Не решает мимику/эмоцию целиком; может давать механический lip-sync.',
    url: 'https://github.com/Rudrabha/Wav2Lip'
  },
  {
    model: 'MuseTalk',
    job: 'Real-time/high-quality lip synchronization через latent-space inpainting.',
    role: 'Кандидат для более качественного talking-face слоя после базовой проверки работоспособности.',
    cost: 'GPU-инференс и интеграция; нужно тестировать latency и стабильность на пользовательских лицах.',
    risk: 'Research/open-source слой: до production нужен отдельный техаудит качества, лицензий и воспроизводимости.',
    url: 'https://github.com/TMElyralab/MuseTalk'
  },
  {
    model: 'AnimateDiff / video diffusion workflows',
    job: 'Короткие стилизованные движения, atmospheric scenes, animated episode cards.',
    role: 'Может дать не “говорящую голову”, а более красивый сериализованный visual mood.',
    cost: 'GPU-время и настройка ComfyUI-workflows.',
    risk: 'Сложнее держать постоянство лица/персонажа; подходит для mood-сцен, но не для identity-heavy avatar.',
    url: 'https://github.com/guoyww/AnimateDiff'
  }
], [
  { key: 'model', label: 'Локальная модель / слой' },
  { key: 'job', label: 'Что делает' },
  { key: 'role', label: 'Роль для АУРЫ' },
  { key: 'cost', label: 'Экономика' },
  { key: 'risk', label: 'Риск' },
  { key: 'url', label: 'Источник' }
]));
lines.push('');
lines.push('Из этого получается не один стек, а три реалистичных технических маршрута. Маршрут A - быстрый hosted MVP: OpenAI/Stability/Replicate для картинок, Supabase/Firebase для backend, RevenueCat для подписок, PostHog для аналитики. Маршрут B - гибрид: ежедневная петля остается дешевой, а HeyGen/D-ID/AKOOL/Creatify/Runway/Luma включаются только для premium-эпизодов. Маршрут C - локальная визуальная лаборатория: ComfyUI + FLUX/Stable Diffusion + LivePortrait/SadTalker/Wav2Lip/MuseTalk, когда уже понятно, какие визуальные моменты реально удерживают пользователя и какие нужно удешевлять.');
lines.push('');
lines.push(mdTable([
  {
    stage: 'MVP 0: доказать петлю',
    stack: 'Backend, LLM-сценарии, static/layered avatar, analytics, paywall foundation.',
    services: 'Supabase/Firebase, OpenAI Image/Stability/Replicate, RevenueCat, PostHog.',
    decision: 'Проверяем: человек понимает “сериал о себе”, возвращается и завершает действия.'
  },
  {
    stage: 'MVP 1: усилить образ',
    stack: 'Периодические future-self cards, сезонные изменения, avatar progress, voice reset.',
    services: 'Image API + ElevenLabs/Cartesia + storage/CDN.',
    decision: 'Проверяем: визуальный образ повышает retention и willingness to pay.'
  },
  {
    stage: 'MVP 2: premium video',
    stack: 'Редкие трейлеры сезона, talking avatar, “лучшая версия себя” в видео.',
    services: 'HeyGen, D-ID, AKOOL, Creatify, Runway, Luma, Tavus.',
    decision: 'Проверяем: пользователь готов платить отдельно за дорогой вау-слой.'
  },
  {
    stage: 'Scale: снижать себестоимость',
    stack: 'Локальные workflows, batch generation, style control, QA и moderation.',
    services: 'ComfyUI, FLUX/Stable Diffusion, LivePortrait, SadTalker, Wav2Lip, MuseTalk.',
    decision: 'Переходим сюда только после того, как доказаны сценарии, частота и платность.'
  }
], [
  { key: 'stage', label: 'Этап' },
  { key: 'stack', label: 'Что собираем' },
  { key: 'services', label: 'Кандидаты' },
  { key: 'decision', label: 'Что должно стать понятно' }
]));
lines.push('');
lines.push('Технический вывод: реализуемость высокая, но АУРА не должна становиться “дорогим генератором видео” раньше времени. Самый здоровый порядок такой: сначала mobile/web MVP с текстом, действиями, reset, слоистым avatar, платежной и аналитической инфраструктурой; затем image/avatar generation по лимитам; затем voice; затем редкий premium video-avatar; и только после подтверждения спроса - локальный визуальный стек для снижения себестоимости и контроля стиля. Так продукт остается проверяемым, экономика - управляемой, а центральная идея “сериал о себе” не зависит от самого дорогого провайдера.');
lines.push('');
lines.push('### Рекомендуемый технологический стек и архитектура');
lines.push('');
lines.push('Для MVP важна не максимальная инженерная красота, а скорость проверки, контроль себестоимости и возможность быстро менять продуктовую петлю. Поэтому архитектура должна быть простой: мобильный клиент, backend, база эпизодов, AI-оркестрация, генерация изображений, платежи, аналитика и пуши.');
lines.push('');
lines.push(mdTable([
  {
    layer: 'Frontend',
    choice: 'React Native или Flutter',
    why: 'Нужно быстро собрать iOS/Android и не распыляться на две нативные команды.',
    mvp: 'React Native предпочтителен, если команда ближе к JS/TS; Flutter - если нужен более контролируемый UI.',
    avoid: 'Не делать отдельные native iOS/Android до проверки спроса.'
  },
  {
    layer: 'Backend',
    choice: 'NestJS или Supabase Edge Functions',
    why: 'Нужны API для профиля, сезонов, эпизодов, генераций, платежей и аналитики.',
    mvp: 'Для скорости можно начать с Supabase + server functions; NestJS добавить при росте логики.',
    avoid: 'Не строить сложный microservice backend в MVP.'
  },
  {
    layer: 'Database',
    choice: 'Postgres',
    why: 'Профили, эпизоды, действия, visual states, subscriptions, experiments.',
    mvp: 'Supabase Postgres.',
    avoid: 'Не хранить чувствительные данные без явного согласия и политики удаления.'
  },
  {
    layer: 'AI brain',
    choice: 'OpenRouter как роутер + GPT/Claude/Gemini/DeepSeek тестами',
    why: 'Нужно сравнивать качество, цену и стабильность интерпретаций.',
    mvp: 'Один основной LLM + fallback; жесткие safety prompts и logging версий.',
    avoid: 'Не завязывать продуктовую логику на один незаменимый prompt.'
  },
  {
    layer: 'Images / Life Canvas',
    choice: 'OpenAI Images / Stability / Replicate; позже FLUX/ComfyUI',
    why: 'Нужны avatar cards, scene cards, before/after, style packs.',
    mvp: 'Image-first, не video-first.',
    avoid: 'Не генерировать дорогое изображение на каждый клик.'
  },
  {
    layer: 'Video / talking avatar',
    choice: 'Runway/Luma для сцен; HeyGen/D-ID/Tavus/AKOOL для talking avatar',
    why: 'Нужен premium вау-слой, но не ежедневная механика.',
    mvp: 'Не включать в базовый MVP; тестировать в concierge/prototype или tokens.',
    avoid: 'Не обещать пользователю ежедневное видео без финмодели.'
  },
  {
    layer: 'Storage',
    choice: 'S3-compatible storage / Supabase Storage',
    why: 'Хранить visual cards, avatars, audio, exports.',
    mvp: 'Сохранять только нужные итоговые ассеты, не все промежуточные генерации.',
    avoid: 'Не копить тяжелые видео без retention policy.'
  },
  {
    layer: 'Payments',
    choice: 'RevenueCat',
    why: 'Подписки, trial, paywall experiments, entitlement, restore purchases.',
    mvp: 'Подключить до первых платных тестов.',
    avoid: 'Не писать billing с нуля.'
  },
  {
    layer: 'Analytics',
    choice: 'PostHog / Firebase Analytics',
    why: 'Считать activation, D1/D7, paywall, completion, avatar causality.',
    mvp: 'События с первого прототипа.',
    avoid: 'Не запускать без событий: тогда невозможно понять, что ломается.'
  },
  {
    layer: 'Push',
    choice: 'Firebase Cloud Messaging / OneSignal',
    why: 'Возврат к следующему эпизоду и мягкие reminders.',
    mvp: 'Только персональные пуши, без давления streak.',
    avoid: 'Не спамить; продукт должен возвращать историей, а не тревогой.'
  }
], [
  { key: 'layer', label: 'Слой' },
  { key: 'choice', label: 'Рекомендация' },
  { key: 'why', label: 'Зачем' },
  { key: 'mvp', label: 'Как в MVP' },
  { key: 'avoid', label: 'Чего избегать' }
]));
lines.push('');
lines.push('Архитектурный вывод: MVP можно собрать без тяжелой собственной AI-инфраструктуры. Главная сложность не в коде, а в управлении качеством генераций, памятью пользователя, безопасной персонализацией и себестоимостью visual layer. Поэтому сначала нужен управляемый hosted stack, а локальные модели и сложный video pipeline стоит подключать после доказанного retention.');
lines.push('');
lines.push('### Cost model: сколько может стоить продукт на разных масштабах');
lines.push('');
lines.push('Ниже не финальная финансовая модель, а ориентировочная рамка для принятия решения. Она показывает, почему ежедневный video-avatar опасен для MVP, а image-first Life Canvas выглядит здоровее. Числа нужно уточнять после выбора конкретных моделей и тарифов, но логика расходов уже видна.');
lines.push('');
lines.push(mdTable([
  {
    users: '100 MAU',
    text: '$5-25',
    images: '$10-60',
    video: '$0-100',
    infra: '$0-50',
    support: '$0-50',
    total: '$15-285',
    read: 'Ручной прототип и первые тесты; можно позволить себе больше ручной работы.'
  },
  {
    users: '1,000 MAU',
    text: '$30-150',
    images: '$80-500',
    video: '$0-1,000',
    infra: '$50-250',
    support: '$50-300',
    total: '$210-2,200',
    read: 'MVP уже должен иметь лимиты image/video и понятную аналитику.'
  },
  {
    users: '10,000 MAU',
    text: '$200-1,000',
    images: '$700-5,000',
    video: '$0-10,000+',
    infra: '$300-1,500',
    support: '$300-2,000',
    total: '$1,500-19,500+',
    read: 'Видео каждый день почти точно ломает подписочную экономику.'
  },
  {
    users: '100,000 MAU',
    text: '$1,500-8,000',
    images: '$5,000-50,000',
    video: '$0-100,000+',
    infra: '$2,000-15,000',
    support: '$3,000-20,000',
    total: '$11,500-193,000+',
    read: 'На масштабе нужны лимиты, batching, локальные модели или premium tokens.'
  }
], [
  { key: 'users', label: 'Масштаб' },
  { key: 'text', label: 'LLM/text' },
  { key: 'images', label: 'Images/Life Canvas' },
  { key: 'video', label: 'Video/avatar' },
  { key: 'infra', label: 'Storage/infra/push' },
  { key: 'support', label: 'Support/retries' },
  { key: 'total', label: 'Итого / месяц' },
  { key: 'read', label: 'Как читать' }
]));
lines.push('');
lines.push('Самая важная экономическая граница: ежедневный текст и легкий Life Canvas можно встроить в подписку, а video-avatar нужно считать как premium или token. Если подписка стоит $7.99-9.99 в месяц, продукт не может бесплатно генерировать дорогие видео каждый день для активного пользователя. Поэтому MVP должен быть image-first, а video-first сценарий нужно проверять как отдельную платную гипотезу.');
lines.push('');
lines.push('### Монетизация: что проверять у конкурентов');
lines.push('');
lines.push('Монетизацию АУРЫ нельзя выбирать только из вкуса команды. Ее нужно вывести из конкурентов и себестоимости. В соседних рынках уже видны подписки, встроенные покупки, пробные периоды, годовые планы, кредиты/токены и premium-пакеты. Рабочее решение на сейчас: базовая ежедневная петля должна быстро давать ценность бесплатно или через пробный период, а платная часть должна продавать глубину: историю сезона, расширенный avatar, больше визуальных моментов, персональные ритуалы, архив эпизодов, premium-интерпретации и редкие видео- или avatar-генерации.');
lines.push('');
lines.push(mdTable([
  {
    model: 'Подписка',
    fit: 'Лучше всего для ежедневного ритуала и памяти сезона.',
    use: 'Основная модель, если возврат подтверждается.',
    risk: 'Paywall до первого момента ценности вызовет сопротивление.'
  },
  {
    model: 'Freemium + платная глубина',
    fit: 'Хорошо совпадает с логикой “сначала почувствуй серию, потом углубляй”.',
    use: 'Оставить короткую daily-петлю доступной, платно продавать глубину и историю.',
    risk: 'Если free слишком полный, сложно объяснить подписку.'
  },
  {
    model: 'Токены / кредиты',
    fit: 'Подходит для дорогих визуальных или video-генераций.',
    use: 'Использовать для premium avatar-моментов, не для базового ежедневного действия.',
    risk: 'Может сделать продукт похожим на генератор картинок, а не на ежедневный ритуал.'
  },
  {
    model: 'Разовые пакеты',
    fit: 'Подходит для сезонов, тем, визуальных стилей, специальных эпизодов.',
    use: 'Можно тестировать после подтверждения базовой петли.',
    risk: 'Слабее для регулярной выручки, если нет подписки.'
  },
  {
    model: 'Premium coaching / человеческий слой',
    fit: 'Может быть дорого и ценно для глубокой аудитории.',
    use: 'Не MVP; рассмотреть как высокий чек позже.',
    risk: 'Сложнее операционно и меняет природу продукта.'
  }
], [
  { key: 'model', label: 'Модель' },
  { key: 'fit', label: 'Почему подходит' },
  { key: 'use', label: 'Как использовать' },
  { key: 'risk', label: 'Риск' }
]));
lines.push('');
lines.push('Следующий расчет финмодели должен быть простым: цена подписки или средний годовой чек платящего пользователя минус себестоимость генераций, хранение, платежные комиссии, поддержка и маркетинг. Отдельно нужно считать продуктовую маржу без маркетинга и затем проверять, выдерживает ли она платное привлечение. Если стоимость привлечения окажется выше допустимой маржи, придется менять прайсинг, бесплатные лимиты, частоту генераций или маркетинговый канал.');
lines.push('');
lines.push('### Монетизационная матрица: что именно продавать');
lines.push('');
lines.push('Для АУРЫ важно не просто выбрать “подписку”, а понять, какая платная ценность выглядит честной. Пользователь не должен платить за туманное обещание “мы знаем твою судьбу”. Он должен платить за продолжение личного сезона, сохранение истории, глубину интерпретации, визуальную эволюцию и редкие дорогие avatar-моменты, которые невозможно бесконечно раздавать бесплатно.');
lines.push('');
lines.push(mdTable([
  {
    model: 'Подписка',
    probability: 'Высокая',
    potential: 'Высокий',
    product: 'Открывает сезон, архив, расширенные эпизоды, weekly recap, больше avatar-состояний.',
    decision: 'Основная модель, если D1/D7 retention подтверждается.'
  },
  {
    model: 'Покупка сезонов',
    probability: 'Средняя',
    potential: 'Средний',
    product: 'Отдельные темы: отношения, деньги, уверенность, тело, творчество.',
    decision: 'Хорошо как дополнение к подписке или тест willingness to pay.'
  },
  {
    model: 'Персональные прогнозы / deep reads',
    probability: 'Высокая',
    potential: 'Высокий',
    product: 'Разбор месяца, совместимость с периодом, сезонная карта, большой personal report.',
    decision: 'Можно тестировать рано, но без жестких предсказаний и псевдогарантий.'
  },
  {
    model: 'Visual tokens',
    probability: 'Средняя',
    potential: 'Высокий',
    product: 'Видео-avatar, cinematic trailer, future-self poster, редкие Life Canvas сцены.',
    decision: 'Лучший способ не ломать подписочную маржу дорогой генерацией.'
  },
  {
    model: 'Маркетплейс практик',
    probability: 'Низкая в MVP',
    potential: 'Высокий позже',
    product: 'Сезоны от экспертов, практики, авторские маршруты.',
    decision: 'Не делать до доказанного ядра и модерации качества.'
  },
  {
    model: 'Коучи внутри',
    probability: 'Средняя позже',
    potential: 'Высокий чек',
    product: 'Платные сессии, сопровождение, human review.',
    decision: 'Отдельная бизнес-модель, не смешивать с первым MVP.'
  }
], [
  { key: 'model', label: 'Модель' },
  { key: 'probability', label: 'Вероятность' },
  { key: 'potential', label: 'Потенциал' },
  { key: 'product', label: 'Что продаем' },
  { key: 'decision', label: 'Решение' }
]));
lines.push('');
lines.push('### Почему люди платят соседним продуктам и что забирает АУРА');
lines.push('');
lines.push('Деньги в соседних категориях появляются не потому, что у приложений красивые интерфейсы. Пользователь платит, когда продукт регулярно снимает напряжение, возвращает к привычке, дает ощущение личной связи или обещает более глубокий доступ к себе. АУРА должна собрать эти мотивы в одну понятную подписочную ценность.');
lines.push('');
lines.push(mdTable([
  {
    product: 'Calm / mindfulness',
    pay: 'Платят за снижение тревоги, сон, регулярный reset и ощущение безопасного пространства.',
    aura: 'Забираем короткий reset и спокойный тон, но добавляем действие и личную историю.',
    caution: 'Не обещать лечение тревоги или медицинский эффект.'
  },
  {
    product: 'Finch / cozy self-care',
    pay: 'Платят за мягкую заботу, ежедневный прогресс, эмоциональную привязанность и коллекционирование.',
    aura: 'Забираем мягкий прогресс и avatar-эмоцию, но связываем их с реальными действиями пользователя.',
    caution: 'Не превращать продукт в игрушку без взрослой ценности.'
  },
  {
    product: 'Replika / AI companion',
    pay: 'Платят за персональное внимание, диалог, близость и ощущение “меня помнят”.',
    aura: 'Забираем память и персональность, но не делаем романтического companion как ядро.',
    caution: 'Нужны safety-рамки и границы зависимости.'
  },
  {
    product: 'Nebula / astrology',
    pay: 'Платят за личный язык, символическое объяснение себя, совместимость и прогнозность.',
    aura: 'Забираем символический вход, но переводим его в действие, сезон и визуальную трансформацию.',
    caution: 'Не строить продукт на категоричных судьбоносных заявлениях.'
  },
  {
    product: 'Duolingo / progression',
    pay: 'Платят или возвращаются из-за видимого движения, серии, целей, наград и простого daily loop.',
    aura: 'Забираем петлю возвращения и season logic, но избегаем жесткого shame-streak.',
    caution: 'Прогресс должен ощущаться поддерживающим, а не давящим.'
  }
], [
  { key: 'product', label: 'Соседний тип продукта' },
  { key: 'pay', label: 'Почему платят / возвращаются' },
  { key: 'aura', label: 'Что берет АУРА' },
  { key: 'caution', label: 'Ограничение' }
]));
lines.push('');
lines.push('### Аналитика, paywall и финмодель: что нужно доказать до ТЗ');
lines.push('');
lines.push('После рынков, конкурентов и технической реализуемости остается главный бизнес-вопрос: при каких цифрах АУРА имеет смысл. Здесь нельзя ограничиться фразой “будет подписка”. Нужна измеримая система: какие события считаем, где показываем платный экран, что продаем, сколько стоит один пользовательский цикл, какую маржу оставляет static/image/video сценарий и какой CAC эта маржа способна выдержать.');
lines.push('');
lines.push('Первый вывод: аналитика должна появиться в продукте раньше красоты. Если мы не знаем, дошел ли человек до первого эпизода, понял ли смысл avatar, сделал ли действие, вернулся ли завтра и где уперся в paywall, то любые разговоры про финмодель будут декоративными. Поэтому в MVP АУРЫ нужны не только генерация и интерфейс, но и нормальная событийная модель.');
lines.push('');
lines.push(mdTable([
  {
    layer: 'Первый вход',
    events: 'открытие приложения, старт первого опыта, ввод даты рождения, выбор темы, согласие на обработку данных, завершение входа',
    reason: 'Понять, не пугает ли вход через дату рождения, символы и персональные данные.',
    decision: 'Если drop-off высокий до первого эпизода, упрощаем вход и переносим часть вопросов позже.'
  },
  {
    layer: 'Первый момент пользы',
    events: 'первый эпизод создан, первый avatar показан, reset запущен, первый шаг выбран, первый шаг завершен',
    reason: 'Проверить, случается ли “ага, это про меня” до paywall.',
    decision: 'Paywall нельзя ставить до того, как пользователь увидел личный смысл и действие.'
  },
  {
    layer: 'Ежедневная петля',
    events: 'ежедневный эпизод открыт, reset завершен, рефлексия сохранена, прогресс обновлен, изменение avatar увидено',
    reason: 'Понять, есть ли ритуал и что именно возвращает: текст, reset, avatar, прогресс или напоминание.',
    decision: 'Сохраняем только те механики, которые реально двигают возврат на D1/D7.'
  },
  {
    layer: 'Avatar и visual value',
    events: 'avatar-карточка создана, сохранена или отправлена; video-avatar запрошен и завершен',
    reason: 'Отделить “вау” от платной ценности: человек просто смотрит или готов платить/делиться.',
    decision: 'Если video смотрят, но не покупают, оставляем его как маркетинговый hook, а не базовую механику.'
  },
  {
    layer: 'Paywall и деньги',
    events: 'платный экран показан, пробный период начат, покупка начата/завершена/сорвалась, подписка отменена',
    reason: 'Проверить цену, timing, trial, годовой план и формулировку платной глубины.',
    decision: 'Если конверсия слабая, меняем не только цену, но и момент paywall и состав платной глубины.'
  },
  {
    layer: 'Качество и безопасность',
    events: 'контент перегенерирован, пользователь поставил негативную оценку, возник safety-сигнал, обращение в поддержку, запрос возврата',
    reason: 'В персональном/spiritual продукте доверие важнее количества генераций.',
    decision: 'Если много dislike/refund, усиливаем ограничения, объяснение и контроль пользователя.'
  }
], [
  { key: 'layer', label: 'Слой аналитики' },
  { key: 'events', label: 'События' },
  { key: 'reason', label: 'Зачем считать' },
  { key: 'decision', label: 'Какое решение принимаем' }
]));
lines.push('');
lines.push('Вторая часть - сама монетизация. Для АУРЫ базовая модель должна быть гибридной: подписка продает ежедневную глубину и память сезона, а токены или разовые пакеты продают дорогие визуальные сцены. Это важно потому, что App Store и Google Play забирают комиссию, subscription infrastructure тоже стоит денег, а video/avatar генерация может быстро съесть маржу. По официальным правилам Apple Small Business Program снижает комиссию до 15% для подходящих разработчиков до порога $1M proceeds; Google Play для автоматически продлеваемых подписок указывает 15% service fee; RevenueCat позволяет стартовать бесплатно и затем берет процент от tracked revenue сверх порога; PostHog и похожие analytics-инструменты считаются usage-based. Значит, финмодель должна учитывать не только AI API, но и store fees, subscription tooling, analytics, storage, поддержку и возвраты.');
lines.push('');
lines.push(mdTable([
  {
    item: 'App Store / Google Play commission',
    how: 'Уменьшает gross revenue до net revenue; для подписок и small-business сценариев часто считать 15%, но условия нужно подтвердить по аккаунту и стране.',
    source: 'Apple Small Business Program; Google Play service fees',
    implication: 'В базовой модели считать 15% как optimistic/eligible и 30% как stress case.'
  },
  {
    item: 'RevenueCat / subscription infrastructure',
    how: 'Нужен для entitlement, paywall, trials, experiments, восстановлений покупок и связки с аналитикой.',
    source: 'RevenueCat pricing',
    implication: 'В MVP экономит разработку; в финмодели закладывать fee/процент после бесплатного порога.'
  },
  {
    item: 'Analytics / experiments',
    how: 'События, funnels, feature flags, session replay, A/B paywall.',
    source: 'PostHog pricing',
    implication: 'Это не “nice to have”: без аналитики нельзя считать возврат, конверсию и payback.'
  },
  {
    item: 'AI text cost',
    how: 'Стоимость генерации эпизода, интерпретации, reset, micro-coaching.',
    source: 'Выбранный LLM provider',
    implication: 'Должна быть низкой и входить в ежедневную подписочную петлю.'
  },
  {
    item: 'Image/avatar cost',
    how: 'Стоимость карточек, future-self образов, сезонных изменений.',
    source: 'OpenAI/Stability/Replicate или локальный visual stack',
    implication: 'Давать лимиты: например, daily text бесплатно/в подписке, image - несколько раз в неделю или по плану.'
  },
  {
    item: 'Video/avatar cost',
    how: 'Стоимость секунд или минут talking/cinematic avatar.',
    source: 'HeyGen/D-ID/AKOOL/Creatify/Runway/Luma/Tavus',
    implication: 'Не включать безлимитно в подписку; продавать как premium, token или milestone reward.'
  },
  {
    item: 'Refunds, support, retries',
    how: 'Ошибки генерации, неудачные образы, жалобы на подписку, повторные попытки.',
    source: 'Внутренняя аналитика и support tags',
    implication: 'Добавлять buffer к себестоимости, особенно в video/avatar сценариях.'
  }
], [
  { key: 'item', label: 'Статья финмодели' },
  { key: 'how', label: 'Как влияет' },
  { key: 'source', label: 'Откуда проверять' },
  { key: 'implication', label: 'Решение для АУРЫ' }
]));
lines.push('');
lines.push('Третья часть - формула. Для первой финмодели достаточно не “огромной Excel-машины”, а понятной unit-логики, которую можно расширять:');
lines.push('');
lines.push('- Net revenue per paying user = цена подписки или ARPPU минус store fee, refunds и subscription tooling.');
lines.push('- Product gross margin = net revenue минус AI text, image/video/avatar generation, voice, storage, analytics, support и retries.');
lines.push('- Contribution margin = product gross margin минус paid acquisition cost.');
lines.push('- Payback = CAC / monthly contribution margin.');
lines.push('- Допустимый CAC = LTV * целевая доля на маркетинг, где LTV зависит от повторных возвращений, churn и annual/monthly mix.');
lines.push('');
lines.push(mdTable([
  {
    scenario: 'Базовая подписка: текст + reset + память',
    paid: '$7.99-9.99/month или $39.99-59.99/year как проверяемый диапазон, не финальная цена.',
    cost: 'Низкая: LLM, storage, analytics, subscription tooling.',
    monetization: 'Подписка после первого момента ценности: бесплатный daily teaser и платная глубина.',
    decision: 'Это самый здоровый MVP-сценарий: высокий шанс сохранить маржу и проверить повторный возврат.'
  },
  {
    scenario: 'Подписка с image/avatar',
    paid: 'Подписка выше или лимиты: N image/avatar moments в неделю/месяц.',
    cost: 'Средняя: image API или локальная генерация, moderation, retries.',
    monetization: 'Платная глубина: future-self cards, сезонные изменения, visual archive.',
    decision: 'Работает, если avatar повышает возврат на D7/D30 или конверсию в оплату.'
  },
  {
    scenario: 'Premium video-avatar',
    paid: 'Токены, разовые покупки, special episodes или дорогой premium tier.',
    cost: 'Высокая: секунды/минуты видео, voice, retries, ожидание качества.',
    monetization: 'Не безлимит; milestone reward + paid packs.',
    decision: 'Делать только после проверки готовности платить, иначе можно получить красивый продукт с плохой маржей.'
  },
  {
    scenario: 'Гибридная модель на масштабе',
    paid: 'Подписка за ежедневную петлю + токены за video + annual plan для cashflow.',
    cost: 'Управляемая: hosted API в начале, локальный stack на масштабе.',
    monetization: 'Лучший кандидат после MVP: подписка удерживает, premium увеличивает ARPPU.',
    decision: 'Целевое направление, если базовая петля доказала повторный возврат.'
  }
], [
  { key: 'scenario', label: 'Сценарий' },
  { key: 'paid', label: 'Что проверяем в цене' },
  { key: 'cost', label: 'Себестоимость' },
  { key: 'monetization', label: 'Монетизация' },
  { key: 'decision', label: 'Вывод' }
]));
lines.push('');
lines.push('Четвертая часть - маркетинг и срок окупаемости. Сначала считаем продуктовую маржу без маркетинга, потом проверяем, выдерживает ли она привлечение. Для АУРЫ это особенно важно, потому что avatar/future-self может хорошо работать в креативах, но дорогой AI-видеослой может съесть деньги быстрее, чем платный пользователь окупится.');
lines.push('');
lines.push(mdTable([
  {
    channel: 'Organic / TikTok / Reels',
    hypothesis: '“Мой сериал о себе”, future-self, before/after avatar, архетип дня, визуальная трансформация.',
    metric: 'Share rate, install CVR, activation to first episode, возврат на D1.',
    risk: 'Может привести любопытных пользователей, которые смотрят вау, но не платят.'
  },
  {
    channel: 'Influencers / spiritual creators',
    hypothesis: 'Аудитория уже верит в персональные интерпретации и практики.',
    metric: 'CAC by creator, trial start rate, paid conversion, refund rate.',
    risk: 'Важно не уйти в обещания “судьбы” и не потерять доверие/safety.'
  },
  {
    channel: 'App Store Optimization',
    hypothesis: 'Mindfulness, horoscope, manifestation, avatar, self-care keywords могут давать intent.',
    metric: 'Keyword rank, product page CVR, trial start, paid conversion.',
    risk: 'Слишком широкая категория даст дорогой/размытый трафик.'
  },
  {
    channel: 'Paid social',
    hypothesis: 'Тестировать только после понятной unit-модели и paywall.',
    metric: 'CAC, trial-to-paid, D7/D30, payback period.',
    risk: 'Если CAC выше допустимого, нужно менять pricing, annual mix или бесплатные лимиты.'
  }
], [
  { key: 'channel', label: 'Канал' },
  { key: 'hypothesis', label: 'Что тестируем' },
  { key: 'metric', label: 'Метрика' },
  { key: 'risk', label: 'Риск' }
]));
lines.push('');
lines.push('Практический вывод по финмодели: сейчас нельзя утверждать “бизнес точно сходится”, но можно утверждать, что есть проверяемый путь к модели. Самый сильный вариант - не продавать одно видео и не делать безлимитный генератор, а строить подписку вокруг ежедневного ритуала и платной глубины, где дорогие avatar/video-сцены ограничены токенами, milestone rewards или premium tier. Следующий артефакт после этого отчета - отдельная таблица финмодели с тремя сценариями: консервативный, базовый и оптимистичный; в каждом сценарии должны быть цена, store fee, conversion to trial, trial-to-paid, monthly churn, среднее число image/video генераций, себестоимость, gross margin, CAC и payback.');
lines.push('');
lines.push('Для этой версии исследования собрана отдельная финансовая модель. Это не финальный прогноз выручки, а первая управленческая экономика, которая показывает, какие допущения делают продукт жизнеспособным. Главный результат модели: консервативный сценарий не сходится, если платящих пользователей мало; базовый и оптимистичный сценарии начинают выглядеть рабочими только при строгом ограничении AI-себестоимости, хорошем переходе из trial в оплату и вынесении video-avatar в premium/token слой.');
lines.push('');
lines.push(mdTable([
  {
    scenario: 'Conservative',
    users: '10,000 MAU / 84 paid subscribers',
    net: '$413 net revenue / month',
    margin: '29.2% product gross margin',
    payback: '23.2 months',
    decision: 'Не проходит: мало платящих пользователей, CAC и AI-cost слишком тяжелые для ранней базы.'
  },
  {
    scenario: 'Base',
    users: '50,000 MAU / 1,650 paid subscribers',
    net: '$13.1k net revenue / month',
    margin: '68.8% product gross margin',
    payback: '5.5 months',
    decision: 'Проходит как MVP-экономика, если video ограничен, images лимитированы, а ежедневная петля остается дешевой.'
  },
  {
    scenario: 'Upside',
    users: '150,000 MAU / 8,370 paid subscribers',
    net: '$97.0k net revenue / month',
    margin: '70.6% product gross margin',
    payback: '4.8 months',
    decision: 'Выглядит как сильный scale-сценарий, но требует повторного возврата, annual mix и работающей premium-token логики.'
  }
], [
  { key: 'scenario', label: 'Сценарий' },
  { key: 'users', label: 'Масштаб' },
  { key: 'net', label: 'Net revenue' },
  { key: 'margin', label: 'Маржа' },
  { key: 'payback', label: 'Payback' },
  { key: 'decision', label: 'Вывод' }
]));
lines.push('');
lines.push('Что это меняет в продуктовой рекомендации: АУРА должна выглядеть дорогой для пользователя, но быть дешевой внутри базовой петли. Дороговизна должна ощущаться через точность интерпретации, память сезона, красивый future-self образ и редкие special episodes, а не через ежедневную генерацию видео. Если команда хочет “супер вау” с аватарами, это нужно упаковывать как milestone, premium pack, сезонный трейлер или token-расход. Тогда продукт может быть красивым, интересным и дорогим, не превращаясь в убыточную AI-фабрику.');
lines.push('');
lines.push(mdTable([
  {
    lever: 'Сделать daily loop дешевым',
    action: 'Текст, reset, память и static/layered avatar должны быть основной ежедневной нормой.',
    why: 'Именно это сохраняет product gross margin.'
  },
  {
    lever: 'Лимитировать image/avatar generation',
    action: 'Давать визуальные моменты по плану, milestone или paid depth, а не безлимитно.',
    why: 'Image-cost быстро растет на активной базе, даже если unit cost кажется маленьким.'
  },
  {
    lever: 'Video-avatar только premium',
    action: 'HeyGen/D-ID/AKOOL/Runway/Luma использовать для special episodes, token packs или сезонных трейлеров.',
    why: 'Видео дает вау, но разрушает маржу при ежедневном бесплатном использовании.'
  },
  {
    lever: 'Поднимать annual mix',
    action: 'Продавать годовой план после первого сильного value moment и нескольких завершенных эпизодов.',
    why: 'Annual улучшает cashflow и позволяет выдержать CAC.'
  },
  {
    lever: 'Считать CAC через payback',
    action: 'Paid social запускать только после видимой trial-to-paid и D7/D30 retention.',
    why: 'Даже при хорошей product gross margin маркетинг может сделать первый месяц отрицательным.'
  }
], [
  { key: 'lever', label: 'Рычаг' },
  { key: 'action', label: 'Что делать' },
  { key: 'why', label: 'Почему важно' }
]));
lines.push('');
lines.push('### Точки верификации с автором приложения');
lines.push('');
lines.push('В отчете нужно отдельно фиксировать места, где решение нельзя принимать без автора/заказчика, потому что это уже не только исследовательский вопрос, а вопрос видения продукта. Эти точки лучше пройти как отдельный созвон или комментарии к документу.');
lines.push('');
lines.push(mdTable([
  {
    point: 'Главная метафора',
    question: 'АУРА - это сериал о себе, future-self avatar, astrology-guidance или wellness ritual?',
    output: 'Выбрать одну главную формулировку и 2-3 вторичных слоя.'
  },
  {
    point: 'Граница astrology',
    question: 'Насколько смело используем дату рождения, символы, архетипы, карты, судьбу, совместимость?',
    output: 'Согласовать safety-язык: без диагноза, фатальности и манипулятивных обещаний.'
  },
  {
    point: 'Визуальный уровень',
    question: 'Нужен ли в MVP видео-avatar или достаточно статичного/слоистого future self?',
    output: 'Выбрать сценарий себестоимости и глубину визуала.'
  },
  {
    point: 'Первичный ICP',
    question: 'С кого начинаем: spiritual self-improvers, habit/progress users, reset users или avatar identity users?',
    output: 'Выбрать первую аудиторию для интервью и прототипа.'
  },
  {
    point: 'Платная ценность',
    question: 'За что пользователь должен платить: глубина, визуалы, сезоны, история, premium episodes, human layer?',
    output: 'Сформулировать первую монетизационную гипотезу.'
  },
  {
    point: 'Следующий артефакт',
    question: 'Что нужно первым: бизнес-модель, кликабельный прототип, ТЗ продукта или маркетинговая стратегия?',
    output: 'Определить следующий рабочий артефакт после ресерча.'
  }
], [
  { key: 'point', label: 'Точка решения' },
  { key: 'question', label: 'Вопрос автору' },
  { key: 'output', label: 'Что должно появиться' }
]));
lines.push('');
lines.push(mdTable([
  {
    layer: '1. Личное отражение',
    user: 'Пользователь ищет не общий совет, а точное попадание в состояние дня.',
    product: 'АУРА дает мягкий смысловой вход: тема дня, короткий вопрос, один эмоциональный фокус.',
    risk: 'Если звучит слишком общо или слишком эзотерически, доверие падает сразу.'
  },
  {
    layer: '2. Маленькое действие',
    user: 'Пользователь не хочет обслуживать большую систему, ему нужен один посильный шаг.',
    product: 'Продукт переводит смысл в действие, которое можно выполнить сейчас или сегодня.',
    risk: 'Если действие выглядит случайной задачей, АУРА превращается в habit tracker.'
  },
  {
    layer: '3. Короткий reset',
    user: 'Перед действием часто есть тревога, усталость или внутреннее сопротивление.',
    product: 'Reset снижает трение и помогает перейти от мысли к движению.',
    risk: 'Если reset живет отдельно, продукт становится очередной библиотекой практик.'
  },
  {
    layer: '4. Avatar/progress',
    user: 'Пользователь хочет видеть, что шаг что-то изменил.',
    product: 'Avatar меняется причинно: маленький визуальный сдвиг связан с выполненным действием.',
    risk: 'Если avatar меняется произвольно, он становится декорацией и теряет силу.'
  },
  {
    layer: '5. Возврат завтра',
    user: 'Пользователь должен понимать, зачем возвращаться, но без наказания за пропуск.',
    product: 'АУРА показывает мягкую историю движения: что изменилось сегодня и какой следующий шаг может быть завтра.',
    risk: 'Если добавить давление streak, продукт попадет в отвергаемый productivity-паттерн.'
  },
  {
    layer: '6. Платная глубина',
    user: 'Платить готовы не за обещание, а за глубину после понятного первого момента ценности.',
    product: 'Платная часть может давать историю изменений, более богатый выбор avatar-настроек, персональные ритуалы и расширенную рефлексию.',
    risk: 'Если paywall появляется до ценности, денежный аргумент ослабевает.'
  }
], [
  { key: 'layer', label: 'Слой ядра' },
  { key: 'user', label: 'Что происходит у пользователя' },
  { key: 'product', label: 'Что должна делать АУРА' },
  { key: 'risk', label: 'Что сломает гипотезу' }
]));
lines.push('');
lines.push('В таком виде центральная продуктовая ставка звучит жестче: АУРА должна доказать не “у нас есть avatar”, а “avatar показывает изменение личности через действие”. Это разные продукты. Первый конкурирует с редактором аватарок и игровыми наградами. Второй конкурирует за глубинную пользовательскую задачу: увидеть, что маленький шаг сегодня меняет мою траекторию.');
lines.push('');
lines.push(mdTable(productLoop.map(row => ({
  step: row.step,
  screen: prototypeScreenRu(row.screen_name),
  role: row.role_ru,
  success: prototypeSignalRu(row.expected_signal_ru)
})), [
  { key: 'step', label: 'Шаг' },
  { key: 'screen', label: 'Экран' },
  { key: 'role', label: 'Роль' },
  { key: 'success', label: 'Что должно сработать' }
], 8));
lines.push('');
lines.push('Гипотеза №6: устойчивый MVP возможен, если пользователь за одну короткую сессию понимает причинность петли, чувствует отличие от обычного трекера привычек, медитации или приложения для чтения и может объяснить, зачем вернуться завтра. Пока это не доказано: нужны прототипные сессии, вопросы о готовности платить и наблюдение за тем, как пользователь сам пересказывает ценность продукта.');
lines.push('');
interimConclusion('Итог по продуктовой модели', [
  'Текущая MVP-логика уже достаточно сфокусирована для проверки: не строить “все приложение”, а проверить одну короткую сессию, где пользователь видит личный смысл, делает маленький шаг, проходит reset и понимает, почему изменился progress/avatar. Это ядро либо собирается в простую историю, либо распадается на знакомые категории.',
  'Поэтому следующий раздел фиксирует не новые идеи, а столпы уверенности и риски. Он нужен, чтобы отделить то, что уже выглядит сильным, от того, что может разрушить гипотезу в первой же ручной проверке.'
]);
lines.push('## СТОЛПЫ УВЕРЕННОСТИ И ОТКРЫТЫЕ РИСКИ');
lines.push('');
lines.push('Первый столп уверенности - масштаб мировой карты соседних рынков: база уже достаточно велика, чтобы видеть рынки и конкурентов. Второй - денежный сигнал: в соседних категориях видны платные привычки. Третий - повторяющиеся пользовательские темы: людям важны видимый прогресс, персонализация, ежедневный якорь, понятная ценность подписки и доверие к продукту. Четвертый - узкое белое пятно: полная петля выглядит редкой, но это еще нужно подтвердить ручной проверкой.');
lines.push('');
lines.push('Главные риски остаются открытыми. Близкие конкуренты могут уже закрывать петлю внутри первого пользовательского опыта. Пользователи могут прочитать avatar/progress как детскую декорацию. Слой личного смысла может вызвать недоверие, если будет звучать слишком эзотерически или манипулятивно. Платная модель может быть понятна в соседних рынках, но не обязательно в АУРЕ. Поэтому следующий этап должен проверять не красоту идеи, а реальные реакции пользователей и конкурентов.');
lines.push('');
lines.push('Граница текущего вывода такая: исследование уже дает продуктовую рекомендацию, но не превращает ее в финальное решение о разработке. Для перехода к ТЗ нужно закрыть три риска: проверить, что скрытый клон не найден у главных конкурентов; подтвердить готовность платить за похожую платную глубину; показать прототип 8-12 людям из первых сегментов и убедиться, что они понимают причинность “действие -> avatar/progress”.');
lines.push('');
lines.push('## ПЛАН ПРОВЕРКИ САМЫХ ВАЖНЫХ РИСКОВ');
lines.push('');
lines.push('Следующий слой исследования должен отвечать на простые вопросы: существует ли уже прямой аналог, где именно люди платят, кто реально испытывает такую потребность, считывается ли причинная петля и где продукт вызывает недоверие. Ниже эти вопросы разложены так, чтобы следующий этап не превратился в абстрактный сбор мнений.');
lines.push('');
lines.push(mdTable(validationQuestionnaire.map(row => ({
  block: row.block_ru,
  question: row.question_ru,
  pass: row.pass_signal_ru,
  down: row.downgrade_signal_ru
})), [
  { key: 'block', label: 'Что проверяем' },
  { key: 'question', label: 'Вопрос / проверка' },
  { key: 'pass', label: 'Сигнал усиления' },
  { key: 'down', label: 'Сигнал ослабления' }
]));
lines.push('');
lines.push('Такой порядок удерживает исследование от преждевременного вывода: сначала формулируется гипотеза, затем показывается рынок, затем конкуренты, затем открытые сомнения, затем интервью/прототип и только после этого обновляется решение. Для мирового рынка это особенно важно: объем данных большой, но решение должно приниматься не по размеру базы, а по тому, выдерживает ли продуктовая петля ручную проверку.');
lines.push('');
lines.push('### Retention analysis: почему пользователь возвращается или удаляет продукт');
lines.push('');
lines.push('Для АУРЫ удержание важнее первого вау. Пользователь может один раз открыть красивый avatar, но бизнес появится только тогда, когда он возвращается за следующей серией, видит связь между действием и изменением героя, сохраняет историю и хочет продолжить сезон. Поэтому retention нужно проектировать как часть продукта, а не как пуш-уведомления после запуска.');
lines.push('');
lines.push(mdTable([
  {
    driver: 'Продолжение истории',
    mechanism: 'Каждый день открывается следующий эпизод сезона, а не новый случайный совет.',
    metric: 'D1/D7 return, episode open rate.',
    product: 'Нужны teaser, season map, память вчерашнего действия.'
  },
  {
    driver: 'Видимая эволюция avatar',
    mechanism: 'После действия меняется Life Canvas: свет, черта, предмет, фон, карта сезона.',
    metric: 'Avatar viewed, saved, shared, paid visual intent.',
    product: 'Нужна понятная причинность “я сделал -> герой изменился”.'
  },
  {
    driver: 'Маленькое действие',
    mechanism: 'Пользователь не просто читает интерпретацию, а выбирает один шаг по силам.',
    metric: 'Action chosen, action completed, reflection saved.',
    product: 'Три уровня сложности: мягкий, обычный, смелый.'
  },
  {
    driver: 'Reset перед действием',
    mechanism: 'Короткий ritual/voice/breathing переводит смысл в состояние готовности.',
    metric: 'Reset start/completion, action completion after reset.',
    product: 'Reset должен быть коротким и связанным с эпизодом.'
  },
  {
    driver: 'Weekly recap',
    mechanism: 'Неделя собирается в понятную карту изменений и дает “я не стоял на месте”.',
    metric: 'Season completion, recap save/share, subscription intent.',
    product: 'День 7 должен быть отдельным сильным моментом продукта.'
  },
  {
    driver: 'Мягкий прогресс без стыда',
    mechanism: 'Продукт возвращает через любопытство и заботу, а не через наказание за пропуск.',
    metric: 'Reactivation after missed day, notification opt-in.',
    product: 'Нужны comeback-эпизоды и отсутствие агрессивного streak.'
  }
], [
  { key: 'driver', label: 'Что возвращает' },
  { key: 'mechanism', label: 'Механика' },
  { key: 'metric', label: 'Метрика' },
  { key: 'product', label: 'Что строить' }
]));
lines.push('');
lines.push('Главные причины удаления, которые нужно заранее закрыть продуктом: слишком общий текст, непонятная связь avatar с действием, ранний paywall, дорогие визуальные лимиты без объяснения, плохое качество лица/avatar, слишком много вопросов на входе, ощущение манипулятивной astrology, тревожные формулировки, скучные повторы, отсутствие результата через неделю, навязчивые пуши, медленная генерация, ошибки платежей, страх за персональные данные, отсутствие контроля над историей, слишком детский стиль, слишком эзотерический стиль, слишком productivity-стиль, неочевидная цена и отсутствие понятного “зачем завтра”.');
lines.push('');
lines.push('### Virality: что пользователь может захотеть показать другим');
lines.push('');
lines.push('Виральность АУРЫ не должна начинаться с “пригласи друга”. Для такого интимного продукта сильнее работают shareable artifacts: красивые, личные, но не слишком раскрывающие внутреннюю жизнь. Это могут быть не сырые прогнозы, а визуальные следы сезона, постеры future-self, короткие трейлеры, карточки “мой эпизод дня” и before/after без чувствительных подробностей.');
lines.push('');
lines.push(mdTable([
  {
    artifact: 'Life Canvas card',
    why: 'Показывает эстетичный образ дня без лишней интимности.',
    channel: 'Instagram Stories, Pinterest, TikTok slideshow.',
    risk: 'Если карточка выглядит как generic AI art, она не работает.'
  },
  {
    artifact: 'Future-self poster',
    why: 'Цепляет тему “лучшая версия себя” и avatar-идентичность.',
    channel: 'Reels, Stories, profile highlights.',
    risk: 'Нужна высокая визуальная стабильность лица/стиля.'
  },
  {
    artifact: 'Season recap',
    why: 'Показывает путь за 7 дней и усиливает желание завершить сезон.',
    channel: 'Stories, личные чаты, community posts.',
    risk: 'Нельзя раскрывать слишком личные инсайты без контроля пользователя.'
  },
  {
    artifact: 'Episode teaser',
    why: 'Легко объясняет продукт: “сегодня у меня серия про...”',
    channel: 'TikTok, Reels, Shorts.',
    risk: 'Тизер должен звучать как личный сериал, а не гороскоп.'
  },
  {
    artifact: 'Compatibility with myself',
    why: 'Меметичный формат: насколько я сегодня совпадаю со своей future-self версией.',
    channel: 'TikTok hooks, screenshots, social polls.',
    risk: 'Не превращать в токсичную оценку себя.'
  }
], [
  { key: 'artifact', label: 'Вирусный артефакт' },
  { key: 'why', label: 'Почему может работать' },
  { key: 'channel', label: 'Канал' },
  { key: 'risk', label: 'Риск' }
]));
lines.push('');
lines.push('### Go-to-market: где проверять спрос');
lines.push('');
lines.push('Маркетинг АУРЫ должен проверять не “нравится ли людям AI avatar”, а какие входы приводят к готовности попробовать сезон. У продукта есть несколько возможных крючков: future self, personal ritual, daily reset, astrology without fatalism, cinematic life series, мягкий self-improvement, avatar evolution. Их нужно тестировать как разные офферы, а не спорить внутри команды о единственном позиционировании.');
lines.push('');
lines.push(mdTable([
  {
    channel: 'TikTok / Reels',
    content: 'Короткие hooks: “я сделала серию о своей жизни”, “мой future-self сегодня сказал...”, before/after avatar.',
    offer: 'Бесплатный первый эпизод и Life Canvas.',
    metric: 'CTR, install/waitlist conversion, first episode completion.'
  },
  {
    channel: 'YouTube Shorts',
    content: 'Объясняющие мини-истории: сезон, avatar evolution, 7-дневный челлендж.',
    offer: 'Пройди 7-дневный сезон о себе.',
    metric: 'View-to-click, retention of landing video, signup intent.'
  },
  {
    channel: 'Pinterest',
    content: 'Future-self posters, visual mood boards, ritual cards, self-growth aesthetics.',
    offer: 'Собери Life Canvas своей недели.',
    metric: 'Saves, outbound clicks, visual style preference.'
  },
  {
    channel: 'Reddit / communities',
    content: 'Не рекламный пост, а validation: как люди используют astrology, journaling, AI companions, self-care.',
    offer: 'Ранний прототип и интервью.',
    metric: 'Качество комментариев, pain language, interview conversion.'
  },
  {
    channel: 'App Store Search',
    content: 'Ключи вокруг astrology, self care, daily ritual, future self, avatar, journal.',
    offer: 'Сезон личных эпизодов и визуальный прогресс.',
    metric: 'Search rank potential, conversion screenshots, keyword tests.'
  },
  {
    channel: 'Influencers / creators',
    content: 'Создатели в astrology, self-growth, feminine energy, cozy productivity, visual AI.',
    offer: 'Персональный сезон автора или limited style pack.',
    metric: 'CPA, paid conversion, creator content reuse.'
  }
], [
  { key: 'channel', label: 'Канал' },
  { key: 'content', label: 'Что публиковать' },
  { key: 'offer', label: 'Оффер' },
  { key: 'metric', label: 'Метрика' }
]));
lines.push('');
lines.push('Отдельный data sprint для маркетинга: собрать топовые ролики и объявления по запросам future self, glow up, astrology app, self care app, AI avatar, daily ritual, manifestation, journaling, cozy productivity. В текущем отчете это зафиксировано как следующий слой, потому что без ручного просмотра роликов нельзя честно писать “топ-100 креативов”.');
lines.push('');
lines.push('### Investment memo: решение на одну страницу');
lines.push('');
lines.push('Проблема: у людей много контента про личный рост, astrology, mindfulness и AI-avatars, но мало продуктов, которые превращают личный смысл в ежедневное действие и видимый личный прогресс. Рынок: АУРА работает на пересечении mobile wellness, self-improvement, astrology, AI personalization, avatar/identity и мягкой игровой progression. Решение: мобильное приложение, где пользователь вводит дату рождения и текущий запрос, получает личный эпизод дня, выбирает маленькое действие, проходит reset и видит, как меняется его future-self avatar / Life Canvas.');
lines.push('');
lines.push('Почему сейчас: генеративные модели уже позволяют быстро собирать персональный текст, визуальные карточки, voice и редкие video moments; пользователи привыкли к подпискам в wellness/self-care; AI avatars стали массовым визуальным языком. Почему можем выиграть: не конкурировать лоб в лоб как astrology app, journal или avatar generator, а соединить смысл, действие, reset, визуальную эволюцию и сезонность. Главные риски: generic content, дорогой video layer, слабый retention, ранний paywall, доверие к персональным данным, плохой визуальный стиль. Ближайшее решение: строить image-first MVP и проверять 7-дневный сезон, а video-avatar оставить как premium гипотезу.');
lines.push('');
lines.push('### MVP validation plan: что проверить за 30 дней');
lines.push('');
lines.push('Цель первого месяца - не построить “всю АУРУ”, а доказать, что ядро существует: человек понимает сериал о себе, проходит первый эпизод, делает действие, видит изменение avatar, возвращается на следующий день и готов платить за продолжение сезона или визуальную глубину.');
lines.push('');
lines.push(mdTable([
  {
    period: 'Неделя 1',
    work: '20-30 интервью с первичными сегментами, ручной walkthrough 10-15 ближайших конкурентов, сбор paywall/feature screenshots.',
    output: 'Уточненный ICP, язык боли, карта “что уже есть / чего нет”, первые формулировки офферов.',
    success: 'Пользователи описывают недавнее поведение и понимают идею без долгого объяснения.'
  },
  {
    period: 'Неделя 2',
    work: 'Кликабельный прототип 10 экранов, 3 варианта позиционирования, 2 визуальных стиля Life Canvas.',
    output: 'Проверка первого эпизода, действия, reset и avatar causality.',
    success: 'Большинство тестируемых понимают, зачем возвращаться завтра.'
  },
  {
    period: 'Неделя 3',
    work: 'Лендинг, waitlist, paid smoke test, paywall mock, тест цен $7.99/$9.99/$14.99 и token-пакета.',
    output: 'Первые сигналы willingness to pay и лучший оффер.',
    success: 'Есть регистрации/предзаказы/заявки на интервью по конкретному офферу.'
  },
  {
    period: 'Неделя 4',
    work: 'Concierge MVP: вручную или полуавтоматически провести 30-50 пользователей через 3-7 дней сезона.',
    output: 'D1/D3/D7, completion, причины возврата/отвала, запросы на платную глубину.',
    success: 'Пользователи возвращаются за продолжением и называют платную ценность своими словами.'
  }
], [
  { key: 'period', label: 'Период' },
  { key: 'work', label: 'Что делаем' },
  { key: 'output', label: 'Что получаем' },
  { key: 'success', label: 'Сигнал успеха' }
]));
lines.push('');
lines.push('Метрики провала тоже нужно определить заранее: пользователь не понимает отличие от horoscope/journal/avatar generator; не видит связи действия и avatar; не возвращается на второй день; считает текст generic; боится вводить дату рождения; хочет только бесплатную картинку; не готов платить за сезон; видео кажется красивым, но не усиливает желание возвращаться. Если эти сигналы появятся, продукт нужно не “дописывать функциями”, а пересобирать вокруг другого ядра.');
lines.push('');
lines.push('## БЛИЖАЙШАЯ ЛОГИКА ПРОВЕРКИ');
lines.push('');
lines.push('Следующий этап должен идти в том же порядке, в котором строится отчет. Сначала нужно убрать самый опасный риск: что прямой аналог уже существует внутри первого пользовательского опыта конкурента. Затем нужно проверить, где у соседних продуктов появляется платная ценность. После этого можно идти в интервью и прототип, потому что к этому моменту будет понятно, что именно показывать пользователю и какие сомнения проверять.');
lines.push('');
lines.push(mdTable([
  {
    step: '1',
    focus: 'Ручной проход по близким конкурентам',
    why: 'Проверить, есть ли у них полная петля смысл -> действие -> reset -> видимый прогресс.',
    result: 'Понять, остается ли у АУРЫ реальное белое пятно.'
  },
  {
    step: '2',
    focus: 'Платная глубина и paywall',
    why: 'Понять, за что пользователи уже платят в похожих категориях.',
    result: 'Отделить общий факт подписок от готовности платить за похожую ценность.'
  },
  {
    step: '3',
    focus: 'Интервью с первыми сегментами',
    why: 'Проверить recent behavior, текущие обходные решения и язык боли.',
    result: 'Выбрать первичный ICP не по вкусу команды, а по наблюдаемому поведению.'
  },
  {
    step: '4',
    focus: 'Прототип одной короткой сессии',
    why: 'Проверить, считывает ли пользователь причинность продукта без объяснения.',
    result: 'Понять, собирается ли АУРА в отдельный продукт или распадается на знакомые категории.'
  }
], [
  { key: 'step', label: 'Шаг' },
  { key: 'focus', label: 'Фокус проверки' },
  { key: 'why', label: 'Зачем это нужно' },
  { key: 'result', label: 'Какой результат должен появиться' }
]));
lines.push('');
lines.push('');
if (false) {
lines.push('## ПОКРЫТИЕ ИСХОДНОЙ ЦЕЛИ ДОКАЗАТЕЛЬСТВАМИ');
lines.push('');
lines.push('Чтобы не смешивать “сделан исследовательский слой” и “доказана гипотеза”, ниже показано покрытие исходной задачи по частям. Это контрольная карта текущего состояния: где уже есть локальные файлы, методология и отчет, а где требуются observed rows.');
lines.push('');
lines.push(mdTable(goalEvidenceCoverage.map(row => ({
  goal: row.coverage_id,
  part: row.objective_part_ru,
  status: row.status_ru,
  evidence: row.current_evidence_ru,
  gap: row.remaining_gap_ru,
  next: row.next_move_ru
})), [
  { key: 'goal', label: 'ID' },
  { key: 'part', label: 'Часть цели' },
  { key: 'status', label: 'Статус' },
  { key: 'evidence', label: 'Текущее evidence' },
  { key: 'gap', label: 'Осталось' },
  { key: 'next', label: 'Следующий ход' }
]));
lines.push('');
lines.push('Главный вывод по этой карте: пакет уже масштабный и трассируемый, но не финально валидированный. Это правильное состояние для evidence-first ресерча: сильные desk/source слои готовы, а product/market claims остаются в hold_validate до ручных walkthrough, интервью, прототипа и WTP.');
lines.push('');
}
if (false && russianStoryline.length) {
  lines.push('## ПОВЕСТВОВАТЕЛЬНАЯ ЛОГИКА ОТЧЕТА');
  lines.push('');
  lines.push('Чтобы отчет не выглядел как набор разрозненных таблиц, отдельно зафиксирована русская storyline-карта. Она переводит образец Alina в текущий мировой research: каждый большой раздел отвечает на один вопрос читателя, сначала дает смысловой вывод, затем показывает evidence, называет границу доказательства и объясняет переход к следующей гипотезе.');
  lines.push('');
  lines.push('Практически это означает: не начинать с методологии ради методологии, не прятать счетчики по нишам, не выдавать market size за proof, не писать “конкурентов нет”, а вести читателя по цепочке “идея -> рынки -> деньги -> конкуренты -> whitespace -> аудитория -> MVP -> validation”.');
  lines.push('');
  lines.push(mdTable(russianStoryline.map(row => ({
    id: row.storyline_id,
    section: row.report_section_ru,
    question: row.reader_question_ru,
    move: row.narrative_move_ru,
    evidence: row.evidence_anchor_ru,
    boundary: row.boundary_ru
  })), [
    { key: 'id', label: 'ID' },
    { key: 'section', label: 'Раздел' },
    { key: 'question', label: 'Вопрос читателя' },
    { key: 'move', label: 'Ход повествования' },
    { key: 'evidence', label: 'Evidence' },
    { key: 'boundary', label: 'Граница' }
  ]));
  lines.push('');
}
if (false && reportReadabilityAudit.length) {
  lines.push('## ПРОВЕРКА СКЛАДНОСТИ И ЧИТАЕМОСТИ ОТЧЕТА');
  lines.push('');
  lines.push('Отдельно проверено, складно ли текущая версия читается как русский мировой отчет, а не как случайная выгрузка таблиц. Вывод такой: логика гипотез уже держится, счетчики по нишам видны, границы доказательств прописаны, но документ остается плотным рабочим evidence pack. Для внешней версии позже нужен облегченный executive narrative, а тяжелые таблицы лучше вынести в appendix.');
  lines.push('');
  lines.push('Поэтому рядом с полным отчетом теперь собирается короткая executive-версия: `reports/alina-global-executive-narrative-v1.md` и `output/pdf/alina-global-executive-narrative-v1.pdf`. Ее задача - дать последовательное чтение без потери claim boundaries; полный отчет остается evidence pack и источником таблиц.');
  lines.push('');
  lines.push(mdTable(reportReadabilityAudit.map(row => ({
    area: row.report_area_ru,
    status: row.readability_status_ru,
    risk: row.severity_ru,
    evidence: row.evidence_seen_ru,
    action: row.recommendation_ru
  })), [
    { key: 'area', label: 'Блок' },
    { key: 'status', label: 'Чтение' },
    { key: 'risk', label: 'Риск' },
    { key: 'evidence', label: 'Что видно' },
    { key: 'action', label: 'Что делать' }
  ]));
  lines.push('');
}
lines.push('## ИСТОЧНИКИ И ГРАНИЦЫ ДОКАЗАТЕЛЬСТВ');
lines.push('');
lines.push('Ниже зафиксировано, на чем держатся основные утверждения отчета и где проходит граница доказательства. Это важно: исследование уже большое как карта рынка и конкурентов, но часть выводов остается гипотезами до ручной проверки конкурентов, интервью, прототипных сессий и проверки готовности платить.');
lines.push('');
const readerSourceAppendix = sourceAppendix.filter(row => ![
  'SRC_08_SAMPLE_STYLE_REFERENCE',
  'SRC_10_REPORT_READABILITY',
  'SRC_13_RUSSIAN_STORYLINE',
  'SRC_14_FRONTMATTER_DASHBOARD',
  'SRC_17_READER_GLOSSARY',
  'SRC_18_P0_OBSERVED_INTAKE'
].includes(row.claim_id));
const readerSourceRows = [
  {
    claim: 'АУРА рассматривается как мировая consumer-app гипотеза на пересечении смысла, действия, reset и видимого прогресса.',
    section: 'Описание проекта и гипотеза #1',
    status: 'поддержано исследовательской картой',
    metric: `${fmt(rawRows.length)} исходных записей; ${fmt(dedupRows.length)} уникализированных объектов; ${fmt(manifest.length)} локально сохраненных материалов`,
    boundary: 'Это карта рынка и конкурентов, а не доказательство спроса или удержания.'
  },
  {
    claim: 'Пять мировых направлений дают АУРЕ рыночный и денежный контекст.',
    section: 'Мировые целевые рынки и гипотеза #2',
    status: 'поддержано направленно',
    metric: `${nicheSummary.length} направлений; ${fmt(nicheCountRollup.reduce((sum, row) => sum + num(row.direct_app_store_dedup_rows), 0))} приложений из магазинов по нишам; рабочая рамка пересечения ${money(intersection.samBase)}`,
    boundary: 'Это не прогноз выручки; денежную гипотезу нужно усиливать paywall-проверками и интервью о готовности платить.'
  },
  {
    claim: 'Конкуренты закрывают отдельные части петли, но полная причинная связка остается вопросом ручной проверки.',
    section: 'Конкуренты и гипотеза #3',
    status: 'готово к ручной проверке',
    metric: `${competitorArchetypeRollup.reduce((sum, row) => sum + num(row.top100_primary_apps), 0)} приложений в review; ${topCompetitors.length} первых карточек конкурентов`,
    boundary: 'Публичные описания и отзывы не заменяют прохождение onboarding и проверку реальной петли внутри приложения.'
  },
  {
    claim: 'Белое пятно формулируется не как “конкурентов нет”, а как редкость связки meaning -> action -> reset -> visible progress.',
    section: 'Whitespace и возможность отличиться',
    status: 'поддержано направленно',
    metric: 'по пяти направлениям собрана карта разрывов: где есть смысл, где действие, где reset, где progress/avatar',
    boundary: 'Белое пятно нельзя считать доказанным без ручного сравнения близких конкурентов.'
  },
  {
    claim: 'Первичная аудитория должна выбираться по recent behavior, а не по демографии.',
    section: 'Аудитория и интервью',
    status: 'рабочая гипотеза',
    metric: `${icp.length} сегментов; первые для проверки: ${p0Icp.map(row => row.segment_name).join(' и ') || 'нет данных'}`,
    boundary: 'Сегменты нужно подтверждать интервью и конкретными историями последнего использования похожих продуктов.'
  },
  {
    claim: 'MVP должен проверять одну короткую причинную петлю, а не весь будущий продукт.',
    section: 'Продуктовая модель',
    status: 'сформулировано для прототипа',
    metric: `${productLoop.length} шагов продуктовой петли; ключевой тест - понимает ли пользователь причинность без объяснения`,
    boundary: 'Продуктовое ядро нельзя считать доказанным без прототипных сессий.'
  }
];
lines.push(mdTable(readerSourceRows.map(row => ({
  claim: row.claim,
  section: row.section,
  status: row.status,
  metric: row.metric,
  boundary: row.boundary
})), [
  { key: 'claim', label: 'Утверждение' },
  { key: 'section', label: 'Раздел' },
  { key: 'status', label: 'Насколько подтверждено' },
  { key: 'metric', label: 'На чем основано' },
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
if (false) {
lines.push('## Локальные файлы');
lines.push('');
lines.push('- `reports/alina-global-hypothesis-report-v1.md`');
lines.push('- `reports/alina-global-executive-narrative-v1.md`');
lines.push('- `reports/alina-global-reader-report-v1.md`');
lines.push('- `output/pdf/alina-global-hypothesis-report-v1.pdf`');
lines.push('- `output/pdf/alina-global-executive-narrative-v1.pdf`');
lines.push('- `output/pdf/alina-global-reader-report-v1.pdf`');
lines.push('- `data_processed/global_hypothesis_source_appendix.csv`');
lines.push('- `data_processed/global_hypothesis_validation_questionnaire.csv`');
lines.push('- `data_processed/global_hypothesis_gate_snapshot.csv`');
lines.push('- `data_processed/global_next_validation_backlog.csv`');
lines.push('- `data_processed/p0_validation_execution_slice.csv`');
lines.push('- `data_processed/p0_observed_evidence_intake.csv`');
lines.push('- `data_processed/russian_reader_glossary.csv`');
lines.push('- `data_processed/global_report_readability_audit.csv`');
lines.push('- `data_processed/global_source_quality_gap_audit.csv`');
lines.push('- `data_processed/russian_sequential_storyline.csv`');
lines.push('- `data_processed/russian_frontmatter_dashboard.csv`');
lines.push('- `data_processed/global_market_sizing_methodology.csv`');
lines.push('- `data_processed/market_model_sensitivity_audit.csv`');
lines.push('- `data_processed/global_niche_count_rollup.csv`');
lines.push('- `data_processed/niche_count_reconciliation.csv`');
lines.push('- `data_processed/global_whitespace_audience_synthesis.csv`');
lines.push('- `data_processed/global_competitor_archetype_rollup.csv`');
lines.push('- `data_processed/competitor_taxonomy_cleanup_queue.csv`');
lines.push('- `data_processed/global_goal_evidence_coverage.csv`');
lines.push('- `reports/alina-russian-readable-report-v2.md`');
lines.push('- `data_processed/russian_readable_niche_summary.csv`');
lines.push('- `data_processed/validation_gate_calculator.csv`');
}

const reportText = lines.join('\n')
  .replace(/\bAlina\b/g, 'АУРА')
  .replace(/consumer-app/g, 'consumer-приложение')
  .replace(/consumer-приложение/g, 'потребительское приложение')
  .replace(/consumer-приложений/g, 'потребительских приложений')
  .replace(/avatar app/g, 'avatar-приложение')
  .replace(/meaning -> action -> reset -> visible progress/g, 'смысл -> действие -> reset -> видимый прогресс')
  .replace(/personal meaning -> tiny action -> short reset -> visible progress -> tomorrow hook/g, 'личный смысл -> маленькое действие -> короткий reset -> видимый прогресс -> причина вернуться завтра')
  .replace(/meaning, action, reset и visible progress/g, 'смысла, действия, reset и видимого прогресса')
  .replace(/meaning, action, reset/g, 'смысл, действие, reset')
  .replace(/meaning/g, 'смысл')
  .replace(/action/g, 'действие')
  .replace(/visible progress/g, 'видимый прогресс')
  .replace(/avatar\/progress/g, 'avatar/progress')
  .replace(/hidden-clone/g, 'скрытого клона')
  .replace(/walkthrough/g, 'ручную проверку')
  .replace(/onboarding/g, 'первый пользовательский опыт')
  .replace(/screenshots/g, 'экраны')
  .replace(/screenshot/g, 'экран')
  .replace(/paid-flow/g, 'платной модели')
  .replace(/Money case/g, 'Денежный аргумент')
  .replace(/revenue proof/g, 'доказательство выручки')
  .replace(/prototype sessions/g, 'прототипных сессий')
  .replace(/scorecard/g, 'оценочной карты')
  .replace(/validation queue/g, 'очереди проверки')
  .replace(/recent behavior/g, 'недавнее поведение')
  .replace(/source rows/g, 'исходные сигналы')
  .replace(/discovery rows/g, 'исходные сигналы')
  .replace(/source-пакет/g, 'доказательная база')
  .replace(/registry/g, 'реестр')
  .replace(/spreadsheet/g, 'финансовая таблица')
  .replace(/mini-RFP/g, 'таблица выбора поставщиков')
  .replace(/signoff/g, 'подтверждение')
  .replace(/OCR/g, 'распознавание текста')
  .replace(/market-money/g, 'рыночно-денежный')
  .replace(/public-listing inspection/g, 'проверку публичных страниц')
  .replace(/top competitors/g, 'ключевых конкурентов')
  .replace(/archetypes/g, 'типов конкурентов')
  .replace(/interview probes/g, 'вопросы для интервью')
  .replace(/top-приложения/g, 'ключевые приложения')
  .replace(/review/g, 'анализ')
  .replace(/benchmark/g, 'бенчмарк')
  .replace(/adjacent/g, 'соседний')
  .replace(/directional evidence/g, 'направленный сигнал')
  .replace(/claim/g, 'вывод')
  .replace(/proof/g, 'доказательство')
  .replace(/proxy/g, 'косвенный сигнал')
  .replace(/retention/g, 'возврат')
  .replace(/PMF/g, 'product-market fit')
  .replace(/WTP/g, 'готовность платить')
  .replace(/\bP0\b/g, 'первичный')
  .replace(/\bP1\b/g, 'следующий')
  .replace(/P0-/g, 'первичный ')
  .replace(/P1-/g, 'следующий ')
  .replace(/\bH1\b/g, 'гипотеза 1')
  .replace(/\bH2\b/g, 'гипотеза 2')
  .replace(/\bH3\b/g, 'гипотеза 3')
  .replace(/\bH4\b/g, 'гипотеза 4')
  .replace(/\bH5\b/g, 'гипотеза 5')
  .replace(/\bH6\b/g, 'гипотеза 6')
  .replace(/H4\/H5\/H6/g, 'гипотезы 4-6')
  .replace(/H4\/H5/g, 'гипотезы 4-5')
  .replace(/декоративный avatar-приложение/g, 'декоративное avatar-приложение')
  .replace(/consumer-приложение рынок/g, 'рынок consumer-приложений')
  .replace(/consumer-приложение рынке/g, 'рынке consumer-приложений')
  .replace(/формой consumer-приложение/g, 'формой consumer-приложения')
  .replace(/соседний-продуктами/g, 'соседними продуктами')
  .replace(/Форма выглядит правдоподобно, но скрытого клона риск открыт до ручных ручную проверку\./g, 'Форма выглядит правдоподобно, но риск скрытого клона остается открытым до ручной проверки близких конкурентов.')
  .replace(/Собрали TAM\/SAM\/SOM, платной модели косвенный сигнал, IAP\/pricing и рыночно-денежный triangulation\./g, 'Собрали TAM/SAM/SOM, цены, paywall-сигналы и рыночные источники.')
  .replace(/MVP-loop, prototype stimulus, оценочной карты и P0 очереди проверки\./g, 'MVP-петлю, прототипный сценарий, оценочную карту и очередь проверки.')
  .replace(/сильный направленный money case/g, 'сильный направленный денежный аргумент')
  .replace(/средний направленный money case/g, 'средний направленный денежный аргумент')
  .replace(/personal смысл: horoscope, tarot, moon\/spiritual guidance, manifestation или symbolic reflection/g, 'личного смысла: horoscope, tarot, moon/spiritual guidance, manifestation или symbolic reflection')
  .replace(/релевантность видна/g, 'релевантность видна')
  .replace(/product-market доказательство/g, 'доказательство product-market fit')
  .replace(/без ручную проверку/g, 'без ручной проверки')
  .replace(/поддержано косвенный сигнал/g, 'поддержано косвенным сигналом')
  .replace(/нужен ручной платной модели\/готовность платить/g, 'нужна ручная проверка платной модели и готовности платить')
  .replace(/directional рыночно-денежный anchor/g, 'направленный рыночный ориентир')
  .replace(/готовность платить evidence/g, 'доказательства готовности платить')
  .replace(/venture вывод/g, 'venture-вывод')
  .replace(/маленький validation business/g, 'маленький проверочный бизнес')
  .replace(/venture-relevant/g, 'venture-релевантно')
  .replace(/distribution, возврат/g, 'дистрибуции и возврата')
  .replace(/недавнее поведение интервью/g, 'интервью о недавнем поведении')
  .replace(/по недавнее поведение/g, 'по недавнему поведению')
  .replace(/где есть люди с недавнее поведение/g, 'где есть люди с недавним поведением')
  .replace(/current workaround/g, 'текущими обходными решениями')
  .replace(/validation tests/g, 'проверочные вопросы')
  .replace(/Full-loop rate/g, 'Доля полной петли')
  .replace(/Whitespace read/g, 'Вывод по белому пятну')
  .replace(/ICP fit/g, 'Подходящий сегмент')
  .replace(/Первый validation move/g, 'Первый шаг проверки')
  .replace(/скрытого клона ручную проверку, платной модели signoff, P0 ICP interviews/g, 'ручная проверка скрытого клона, проверка платной модели, первые ICP-интервью')
  .replace(/evidence-first/g, 'доказательными')
  .replace(/доказательными гипотезами/g, 'проверяемыми гипотезами')
  .replace(/финальным go/g, 'финальным решением')
  .replace(/доказательство product-market fit/g, 'доказательства product-market fit')
  .replace(/paywall signoff/g, 'проверки paywall')
  .replace(/consumer-приложение механики/g, 'механики consumer-приложений')
  .replace(/consumer-приложение гипотеза/g, 'гипотеза consumer-приложения')
  .replace(/consumer-приложение категории/g, 'категории consumer-приложений')
  .replace(/personal смысл enough to act/g, 'личному смыслу достаточно, чтобы перейти к действию')
  .replace(/personal смысл/g, 'личный смысл')
  .replace(/действие-tied progress/g, 'прогресс, связанный с действием')
  .replace(/действие-tied прогресс/g, 'прогресс, связанный с действием')
  .replace(/может ли прогресс, связанный с действием заменить/g, 'может ли прогресс, связанный с действием, заменить')
  .replace(/расчетное пересечение АУРА/g, 'расчетное пересечение АУРЫ')
  .replace(/анализ оценочной картыs/g, 'оценочным картам')
  .replace(/top100_competitor_анализ_оценочной карты\.csv/g, 'top100_competitor_review_scorecard.csv')
  .replace(/анализ_signal_matrix\.csv/g, 'review_signal_matrix.csv')
  .replace(/competitor_revenue_косвенный сигнал_анализ\.csv/g, 'competitor_revenue_proxy_review.csv')
  .replace(/market_source_confidence_анализ\.csv/g, 'market_source_confidence_review.csv')
  .replace(/market-source-confidence-анализ-v1\.md/g, 'market-source-confidence-review-v1.md')
  .replace(/avatar-приложениеs/g, 'avatar-приложения')
  .replace(/ручного ручную проверку/g, 'ручного walkthrough')
  .replace(/ручного анализ/g, 'ручного review')
  .replace(/прогресс, связанный с действиемion/g, 'видимым прогрессом, связанным с действием')
  .replace(/Differentiate by broader spiritual\/identity scope, softer safety framing, and better reliability around видимым прогрессом, связанным с действием\./g, 'Отличаться более широким identity/spiritual контуром, мягкими границами безопасности и надежной связкой действия с видимым прогрессом.')
  .replace(/full-loop-like кандидаты/g, 'кандидаты с похожей полной петлей')
  .replace(/full-loop candidates/g, 'кандидаты с похожей полной петлей')
  .replace(/нужен P0 ручную проверку/g, 'нужна P0-ручная проверка')
  .replace(/high-risk конкурентов/g, 'конкурентов высокого риска')
  .replace(/high-risk competitor ручную проверку/g, 'ручную проверку конкурентов высокого риска')
  .replace(/high-risk substitutes/g, 'близких конкурентов высокого риска')
  .replace(/compare-сегмент/g, 'сегмент для сравнения')
  .replace(/narrow directional whitespace/g, 'узкое направленное белое пятно')
  .replace(/без нового evidence/g, 'без новых доказательств')
  .replace(/ручного evidence/g, 'ручного доказательства')
  .replace(/validation move/g, 'шаг проверки')
  .replace(/После ручную проверку конкурента/g, 'После ручной проверки конкурента')
  .replace(/Ручной ручную проверку/g, 'Ручная проверка')
  .replace(/behavior-tied identity\/avatar progression/g, 'identity/avatar progress, связанный с действием')
  .replace(/Walkthrough показывает/g, 'Ручная проверка показывает')
  .replace(/full-loop substitutes/g, 'конкурентов с полной петлей')
  .replace(/Action evidence/g, 'Доказательство действия')
  .replace(/self-report/g, 'самоотчет')
  .replace(/Participant accepts lightweight самоотчет as enough доказательство\./g, 'Участник принимает легкий самоотчет как достаточное подтверждение действия.')
  .replace(/willingness-to-pay/g, 'готовность платить')
  .replace(/high-money/g, 'крупном платном')
  .replace(/value moment/g, 'момента ценности')
  .replace(/paid depth/g, 'платную глубину')
  .replace(/free value moment/g, 'бесплатного момента ценности')
  .replace(/parent pages/g, 'родительским страницам')
  .replace(/login-gated/g, 'закрытым за логином')
  .replace(/daily ritual/g, 'ежедневного ритуала')
  .replace(/generic motivation/g, 'общая мотивационная фраза')
  .replace(/ручную проверку-слоты/g, 'слоты ручной проверки')
  .replace(/Для крупном платном конкурентов/g, 'Для крупных платных конкурентов')
  .replace(/free момента ценности/g, 'бесплатного момента ценности')
  .replace(/платную глубину не связана/g, 'платная глубина не связана')
  .replace(/распространенные конкурентов с полной петлей/g, 'распространенных конкурентов с полной петлей')
  .replace(/связанный с действием остается/g, 'связанный с действием, остается')
  .replace(/Аудитория и текущими обходными решениями/g, 'Аудитория и текущие обходные решения')
  .replace(/текущими обходными решениями и язык боли/g, 'текущее обходное решение и язык боли')
  .replace(/конкурентных ручную проверку/g, 'ручной проверки конкурентов')
  .replace(/progress, reset/g, 'прогресса, reset')
  .replace(/broad market/g, 'широкая рыночная')
  .replace(/sampling/g, 'выборочная проверка')
  .replace(/primary market/g, 'primary-рынок')
  .replace(/primary-аудитория/g, 'первичная аудитория')
  .replace(/а ежедневного ритуала с/g, 'а ежедневный ритуал с')
  .replace(/нужен ручной выборочная проверка/g, 'нужна ручная выборочная проверка')
  .replace(/выборочная проверка обязателен/g, 'выборочная проверка обязательна')
  .replace(/Opportunity/g, 'Возможность')
  .replace(/соседний-рынки/g, 'соседние рынки')
  .replace(/соседний-рынок/g, 'соседний рынок')
  .replace(/соседний рынки/g, 'соседние рынки')
  .replace(/consumer-discount/g, 'consumer-поправкой')
  .replace(/modeled SAM/g, 'модельную SAM-оценку')
  .replace(/investor-grade market вывод/g, 'инвесторский рыночный вывод')
  .replace(/читать как рабочий модельную SAM-оценку/g, 'читать как рабочую модельную SAM-оценку')
  .replace(/money context/g, 'денежный контекст')
  .replace(/conservative range/g, 'консервативный диапазон')
  .replace(/дистрибуции и возврата и готовность платить/g, 'дистрибуции, возврата и готовности платить')
  .replace(/бенчмарк возврат\/progression\/monetization mechanics/g, 'бенчмарк механик возврата, прогресса и монетизации')
  .replace(/с сильным consumer-поправкой/g, 'с сильной поправкой на ширину consumer-рынка')
  .replace(/с сильным consumer\/self-improvement discount/g, 'с сильной поправкой на широту consumer/self-improvement рынка')
  .replace(/возврат и платную глубину реально работают/g, 'возврат и платная глубина реально работают')
  .replace(/daily loop/g, 'daily-петля')
  .replace(/daily-петля строится/g, 'ежедневная петля строится')
  .replace(/premium visual moments/g, 'редких визуальных premium-моментах')
  .replace(/редких редких визуальных premium-моментах/g, 'редких визуальных premium-моментах')
  .replace(/static-avatar MVP/g, 'static-avatar MVP')
  .replace(/image\/avatar MVP/g, 'image/avatar MVP')
  .replace(/video-avatar MVP/g, 'video-avatar MVP')
  .replace(/Premium add-on/g, 'Premium-дополнение')
  .replace(/visual moments/g, 'визуальных моментов')
  .replace(/video\/avatar outputs/g, 'видео- или avatar-генерации')
  .replace(/Freemium \+ платную глубину/g, 'Freemium + платная глубина')
  .replace(/One-off packs/g, 'Разовые пакеты')
  .replace(/core loop/g, 'базовая петля')
  .replace(/core-петля/g, 'базовая петля')
  .replace(/human layer/g, 'человеческий слой')
  .replace(/premium episodes/g, 'premium-эпизоды')
  .replace(/платный acquisition/g, 'платное привлечение')
  .replace(/free limits/g, 'бесплатные лимиты')
  .replace(/локально сохраненных материалов/g, 'сохраненных исследовательских материалов')
  .replace(/consumer-приложения/g, 'потребительские приложения')
  .replace(/consumer-приложений/g, 'потребительских приложений')
  .replace(/consumer-приложение/g, 'потребительское приложение')
  .replace(/Мобильные consumer-приложения/g, 'Мобильные потребительские приложения')
  .replace(/consumer-приложений/g, 'потребительских приложений')
  .replace(/мировая потребительское приложение гипотеза/g, 'мировая гипотеза потребительского приложения')
  .replace(/первичный-конкурента/g, 'главного конкурента')
  .replace(/первичный-приложений/g, 'главных приложений')
  .replace(/Любой первичный-конкурент/g, 'Любой главный конкурент')
  .replace(/первичный ICP/g, 'первичный сегмент')
  .replace(/Ослабить гипотеза 4\/гипотеза 6/g, 'Ослабить гипотезы 4 и 6')
  .replace(/fatal trust\/safety objection/g, 'критичное возражение по доверию или безопасности')
  .replace(/trial-to-paid/g, 'переход из пробного периода в оплату')
  .replace(/trial в оплату/g, 'пробного периода в оплату')
  .replace(/paywall/g, 'платный экран')
  .replace(/paid-depth/g, 'платной глубины')
  .replace(/pricing/g, 'цен')
  .replace(/Ниже не внутренняя методология, а конкретная картина рынка:/g, 'Ниже показана конкретная картина рынка:')
  .replace(/Excel-модель/g, 'финансовая модель')
  .replace(/forecast/g, 'прогноз')
  .replace(/финальным инвестиционным memo/g, 'финальной инвестиционной запиской')
  .replace(/desk research/g, 'кабинетного исследования')
  .replace(/мировой потребительское приложение рынок/g, 'мировой рынок потребительских приложений')
  .replace(/мировом потребительское приложение рынке/g, 'мировом рынке потребительских приложений')
  .replace(/формой потребительское приложение/g, 'формой потребительского приложения')
  .replace(/платный экран-сигналы/g, 'сигналы платных экранов')
  .replace(/первый пользовательский опыт\/app экраны/g, 'экраны первого пользовательского опыта')
  .replace(/MVP-loop, prototype stimulus, оценочной карты и первичный очереди проверки/g, 'MVP-петлю, прототипный сценарий, оценочную карту и очередь проверки')
  .replace(/внутри первого пользовательского опыта первичный-конкурентов/g, 'внутри первого пользовательского опыта главных конкурентов')
  .replace(/нужен первичный ручную проверку/g, 'нужна первичная ручная проверка')
  .replace(/проверить первичный-аудиторию/g, 'проверить первичную аудиторию')
  .replace(/двух первичный-сегментов/g, 'двух первичных сегментов')
  .replace(/платной глубины сигналы/g, 'сигналы платной глубины')
  .replace(/платный экран-проверками/g, 'проверками платных экранов')
  .replace(/граница платный экран/g, 'граница платного экрана')
  .replace(/прохождение первый пользовательский опыт/g, 'прохождение первого пользовательского опыта')
  .replace(/повторяющийся критичное возражение/g, 'повторяющееся критичное возражение')
  .replace(/потребительское приложение гипотеза/g, 'гипотеза потребительского приложения')
  .replace(/Сайты компаний\/цен pages/g, 'Сайты компаний и страницы цен')
  .replace(/цен-сигналов/g, 'сигналов цен')
  .replace(/Whitespace и возможность отличиться/g, 'Белое пятно и возможность отличиться')
  .replace(/whitespace вывод/g, 'вывод о белом пятне')
  .replace(/whitespace выглядит/g, 'белое пятно выглядит')
  .replace(/whitespace map/g, 'карту белого пятна')
  .replace(/гипотеза 1\/гипотеза 6/g, 'гипотезы 1 и 6')
  .replace(/гипотеза 4\/гипотеза 5\/гипотеза 6/g, 'гипотезы 4-6')
  .replace(/гипотеза 4\/гипотеза 5/g, 'гипотезы 4-5')
  .replace(/гипотеза 4\/гипотеза 6/g, 'гипотезы 4 и 6')
  .replace(/ключевой момент гипотеза 4\/гипотеза 6/g, 'ключевой момент гипотез 4 и 6')
  .replace(/поддерживает гипотеза 2/g, 'поддерживает гипотезу 2')
  .replace(/потребительское приложение механики/g, 'механики потребительских приложений')
  .replace(/потребительское приложение категории/g, 'категории потребительских приложений')
  .replace(/потребительское приложение рынке/g, 'рынке потребительских приложений')
  .replace(/потребительское приложение рынок/g, 'рынок потребительских приложений')
  .replace(/первичный: начинать/g, 'первичный сегмент: начинать')
  .replace(/следующий: использовать как сравнение после первичный/g, 'следующий сегмент: использовать для сравнения после первичных интервью')
  .replace(/первичным-сегментам/g, 'первичным сегментам')
  .replace(/первичный сегмент interviews/g, 'интервью с первичным сегментом')
  .replace(/первичный сегмент не по вкусу/g, 'первичный сегмент не по вкусу')
  .replace(/ручной проверки, платный экран подтверждение/g, 'ручной проверки, подтверждения платного экрана')
  .replace(/ручного платный экран/g, 'ручной проверки платного экрана')
  .replace(/до ручного платный экран/g, 'до ручной проверки платного экрана')
  .replace(/реальных платный экран/g, 'реальных платных экранов')
  .replace(/проверка платный экран/g, 'проверка платного экрана')
  .replace(/платный экран появляется/g, 'платный экран появляется')
  .replace(/платной модели подтверждение/g, 'подтверждение платной модели')
  .replace(/платный экран\./g, 'платного экрана.')
  .replace(/границу платный экран/g, 'границу платного экрана')
  .replace(/цен, annual mix/g, 'цену, долю годовых подписок')
  .replace(/annual mix/g, 'долю годовых подписок')
  .replace(/цен, переход/g, 'цену, переход')
  .replace(/менять цен,/g, 'менять цену,')
  .replace(/видимой переход/g, 'видимого перехода')
  .replace(/первый пользовательский опыт\./g, 'первого пользовательского опыта.')
  .replace(/первый пользовательский опыт конкурента/g, 'первого пользовательского опыта конкурента')
  .replace(/в длинный первый пользовательский опыт/g, 'в длинный сценарий первого входа')
  .replace(/static-avatar MVP/g, 'MVP со статичным аватаром')
  .replace(/image\/avatar MVP/g, 'MVP с image/avatar')
  .replace(/video-avatar MVP/g, 'MVP с video-avatar')
  .replace(/video-avatar в/g, 'video-avatar в')
  .replace(/image\/video генераций/g, 'image/video-генераций')
  .replace(/product gross margin/g, 'продуктовой валовой марже')
  .replace(/gross margin/g, 'валовая маржа')
  .replace(/store fee/g, 'комиссия магазина')
  .replace(/conversion to trial/g, 'переход к пробному периоду')
  .replace(/monthly churn/g, 'месячный отток')
  .replace(/premium\/token слой/g, 'premium/token-слой')
  .replace(/cashflow/g, 'денежный поток')
  .replace(/CAC by creator/g, 'CAC по автору')
  .replace(/trial start rate/g, 'доля стартов пробного периода')
  .replace(/paid conversion/g, 'конверсия в оплату')
  .replace(/refund rate/g, 'доля возвратов')
  .replace(/payback period/g, 'срок окупаемости')
  .replace(/consumer-продукта/g, 'потребительского продукта')
  .replace(/объявлять go/g, 'принимать решение о запуске')
  .replace(/MVP-loop/g, 'MVP-петля')
  .replace(/после первичный сегмент и ручную проверку/g, 'после первичных интервью и ручной проверки')
  .replace(/внутри первый пользовательский опыт/g, 'внутри первого пользовательского опыта')
  .replace(/по главного конкурентам/g, 'по главным конкурентам')
  .replace(/avatar, платного экрана/g, 'avatar и платный экран')
  .replace(/Unit-модель/g, 'юнит-модель')
  .replace(/платный экранs/g, 'платные экраны')
  .replace(/entitlement logic/g, 'логика доступа')
  .replace(/A\/B платный экран tests/g, 'A/B-тесты платного экрана')
  .replace(/RevenueCat цен/g, 'тарифы RevenueCat')
  .replace(/PostHog цен/g, 'тарифы PostHog')
  .replace(/платного экрана\./g, 'платный экран.')
  .replace(/момент платный экран/g, 'момент показа платного экрана')
  .replace(/subscription infrastructure/g, 'инфраструктура подписок')
  .replace(/service fee/g, 'комиссию сервиса')
  .replace(/tracked revenue/g, 'отслеживаемой выручки')
  .replace(/usage-based/g, 'по фактическому использованию')
  .replace(/комиссия магазинаs/g, 'комиссии магазинов')
  .replace(/subscription tooling/g, 'инструменты подписки')
  .replace(/support tags/g, 'теги поддержки')
  .replace(/Добавлять buffer/g, 'Добавлять запас')
  .replace(/Product валовая маржа/g, 'Продуктовая валовая маржа')
  .replace(/net revenue/g, 'чистая выручка')
  .replace(/refunds/g, 'возвраты')
  .replace(/AI text/g, 'AI-текст')
  .replace(/image\/video\/avatar generation/g, 'генерацию image/video/avatar')
  .replace(/Contribution margin = продуктовой валовой марже минус paid acquisition cost\./g, 'Маржинальный вклад = продуктовая валовая маржа минус расходы на платное привлечение.')
  .replace(/Payback = CAC \/ monthly contribution margin\./g, 'Срок окупаемости = CAC / месячный маржинальный вклад.')
  .replace(/churn и annual\/monthly mix/g, 'оттока и соотношения годовых/месячных подписок')
  .replace(/\$7\.99-9\.99\/month или \$39\.99-59\.99\/year/g, '$7.99-9.99 в месяц или $39.99-59.99 в год')
  .replace(/daily teaser/g, 'ежедневный teaser')
  .replace(/special episodes/g, 'специальные эпизоды')
  .replace(/premium tier/g, 'premium-тариф')
  .replace(/milestone reward/g, 'награда за milestone')
  .replace(/annual plan для денежный поток/g, 'годовой план для улучшения денежного потока')
  .replace(/hosted API/g, 'внешние API')
  .replace(/локальный stack/g, 'локальный стек')
  .replace(/требует повторного возврата, долю годовых подписок/g, 'требует повторного возврата, высокой доли годовых подписок')
  .replace(/сохраняет продуктовой валовой марже/g, 'сохраняет продуктовую валовую маржу')
  .replace(/длинный первого пользовательского опыта/g, 'длинный сценарий первого входа')
  .replace(/trial, годовая скидка и какая именно depth/g, 'пробный период, годовая скидка и какая именно платная глубина')
  .replace(/пробный период-моделей/g, 'моделей пробного периода')
  .replace(/пробный период-модели/g, 'модели пробного периода')
  .replace(/trial, граница/g, 'пробный период, граница')
  .replace(/entry до tomorrow hook/g, 'первого входа до причины вернуться завтра')
  .replace(/скрытого клона ручную проверку, подтверждение платной модели, интервью с первичным сегментом и прототипных сессий/g, 'ручная проверка скрытого клона, подтверждение платной модели, интервью с первичным сегментом и прототипные сессии')
  .replace(/https:\/\/replicate\.com\/цен/g, 'https://replicate.com/pricing')
  .replace(/https:\/\/platform\.stability\.ai\/цен/g, 'https://platform.stability.ai/pricing')
  .replace(/https:\/\/lumalabs\.ai\/цен/g, 'https://lumalabs.ai/pricing')
  .replace(/https:\/\/help\.heygen\.com\/en\/articles\/10060327-heygen-api-цен-explained/g, 'https://help.heygen.com/en/articles/10060327-heygen-api-pricing-explained')
  .replace(/https:\/\/www\.d-id\.com\/цен\/api\//g, 'https://www.d-id.com/pricing/api/')
  .replace(/https:\/\/www\.synthesia\.io\/цен/g, 'https://www.synthesia.io/pricing')
  .replace(/https:\/\/www\.colossyan\.com\/цен/g, 'https://www.colossyan.com/pricing')
  .replace(/https:\/\/elai\.io\/цен\//g, 'https://elai.io/pricing/')
  .replace(/https:\/\/help\.aistudios\.com\/en\/articles\/14683575-how-does-interactive-avatar-цен-work/g, 'https://help.aistudios.com/en/articles/14683575-how-does-interactive-avatar-pricing-work')
  .replace(/https:\/\/akool\.com\/ja-jp\/api-цен/g, 'https://akool.com/ja-jp/api-pricing')
  .replace(/https:\/\/cartesia\.ai\/цен/g, 'https://cartesia.ai/pricing')
  .replace(/https:\/\/supabase\.com\/цен/g, 'https://supabase.com/pricing')
  .replace(/https:\/\/firebase\.google\.com\/цен/g, 'https://firebase.google.com/pricing')
  .replace(/https:\/\/www\.revenuecat\.com\/цен\//g, 'https://www.revenuecat.com/pricing/')
  .replace(/https:\/\/posthog\.com\/цен/g, 'https://posthog.com/pricing')
  .replace(/требует экраны первого пользовательского опыта/g, 'требует проверки экранов первого пользовательского опыта')
  .replace(/один и тот же MVP-петля/g, 'одна и та же MVP-петля')
  .replace(/одна и та же MVP-петля должен/g, 'одна и та же MVP-петля должна')
  .replace(/одна и та же MVP-петля должна быть проверен/g, 'одна и та же MVP-петля должна быть проверена')
  .replace(/гипотеза 3 можно держать/g, 'это можно держать')
  .replace(/гипотеза 3 не усиливать/g, 'не усиливать гипотезу 3')
  .replace(/Не использовать как гипотеза 3 доказательство/g, 'Не использовать как доказательство гипотезы 3')
  .replace(/соединяет гипотеза 3 и гипотеза 5/g, 'соединяет гипотезы 3 и 5')
  .replace(/из рынков, конкурентов, whitespace/g, 'из рынков, конкурентов, белого пятна')
  .replace(/A\/B-тесты платный экран/g, 'A/B-тесты платного экрана')
  .replace(/Уменьшает gross revenue до чистая выручка/g, 'Уменьшает валовую выручку до чистой выручки')
  .replace(/Google Play комиссию сервисаs/g, 'комиссии Google Play')
  .replace(/optimistic\/eligible/g, 'оптимистичный сценарий')
  .replace(/stress case/g, 'стресс-сценарий')
  .replace(/RevenueCat \/ инфраструктура подписок/g, 'RevenueCat / инфраструктура подписок')
  .replace(/Нужен для entitlement, платный экран, trials, experiments/g, 'Нужен для логики доступа, платного экрана, пробных периодов и экспериментов')
  .replace(/fee\/процент/g, 'процент комиссии')
  .replace(/Analytics \/ experiments/g, 'Аналитика / эксперименты')
  .replace(/funnels/g, 'воронки')
  .replace(/feature flags/g, 'флаги функций')
  .replace(/session replay/g, 'записи сессий')
  .replace(/A\/B платный экран/g, 'A/B-тесты платного экрана')
  .replace(/nice to have/g, 'приятное дополнение')
  .replace(/payback/g, 'срок окупаемости')
  .replace(/AI-текст, генерацию image\/video\/avatar, voice, storage, analytics, support и retries/g, 'AI-текст, генерацию image/video/avatar, голос, хранение данных, аналитику, поддержку и повторные попытки')
  .replace(/ежедневный teaser/g, 'ежедневный тизер')
  .replace(/N image\/avatar moments/g, 'ограниченное число image/avatar-сцен')
  .replace(/image API или локальная генерация, moderation, retries/g, 'image API или локальная генерация, модерация и повторные попытки')
  .replace(/future-self cards, сезонные изменения, visual archive/g, 'future-self карточки, сезонные изменения и визуальный архив')
  .replace(/premium увеличивает ARPPU/g, 'premium-слой увеличивает среднюю выручку на платящего пользователя')
  .replace(/Keyword rank, product page CVR, trial start/g, 'позиции по ключам, конверсия страницы продукта, старт пробного периода')
  .replace(/Paid social запускать/g, 'Платную рекламу запускать')
  .replace(/D7\/D30 возврат/g, 'возврат на 7-й и 30-й день')
  .replace(/награда за milestones/g, 'награды за milestone')
  .replace(/commission/g, 'комиссия')
  .replace(/paid subscribers/g, 'платящих пользователей')
  .replace(/чистая выручка \/ month/g, 'чистая выручка в месяц')
  .replace(/([0-9.]+)% продуктовой валовой марже/g, '$1% продуктовой валовой маржи')
  .replace(/([0-9.]+) months/g, '$1 мес.')
  .replace(/AI-cost/g, 'AI-себестоимость')
  .replace(/scale-сценарий/g, 'сценарий масштабирования')
  .replace(/Annual улучшает/g, 'Годовой план улучшает')
  .replace(/и whitespace/g, 'и белому пятну')
  .replace(/к whitespace/g, 'к белому пятну')
  .replace(/о whitespace/g, 'о белом пятне')
  .replace(/whitespace АУРА/g, 'белого пятна АУРЫ')
  .replace(/основной whitespace/g, 'основное белое пятно')
  .replace(/вывод о whitespace/g, 'вывод о белом пятне')
  .replace(/до платный экран/g, 'до платного экрана')
  .replace(/Paywall и деньги/g, 'Платный экран и деньги')
  .replace(/timing/g, 'момент показа')
  .replace(/trial/g, 'пробный период')
  .replace(/пробный период-моделей/g, 'моделей пробного периода')
  .replace(/пробный период-модели/g, 'модели пробного периода')
  .replace(/dislike\/refund/g, 'негативных оценок и возвратов')
  .replace(/AI-текст cost/g, 'Стоимость AI-текста')
  .replace(/Image\/avatar cost/g, 'Стоимость image/avatar')
  .replace(/Video\/avatar cost/g, 'Стоимость video/avatar')
  .replace(/Refunds, support, retries/g, 'Возвраты, поддержка и повторные попытки')
  .replace(/Net revenue per paying user/g, 'Чистая выручка на платящего пользователя')
  .replace(/ARPPU/g, 'средняя выручка на платящего пользователя')
  .replace(/LLM provider/g, 'LLM-провайдер')
  .replace(/voice/g, 'голос')
  .replace(/paid packs/g, 'платные пакеты')
  .replace(/Organic \/ TikTok \/ Reels/g, 'Органика / TikTok / Reels')
  .replace(/Share rate/g, 'доля пересылок')
  .replace(/install CVR/g, 'конверсия в установку')
  .replace(/activation to first episode/g, 'активация до первого эпизода')
  .replace(/App Store Optimization/g, 'Оптимизация App Store')
  .replace(/self-care keywords могут давать intent/g, 'self-care запросы могут давать намерение')
  .replace(/Paid social/g, 'Платная реклама')
  .replace(/unit-модели и платный экран/g, 'юнит-модели и понятного платного экрана')
  .replace(/Net revenue/g, 'Чистая выручка')
  .replace(/Payback/g, 'Срок окупаемости')
  .replace(/Conservative/g, 'Консервативный')
  .replace(/Base/g, 'Базовый')
  .replace(/Upside/g, 'Оптимистичный')
  .replace(/daily-петля/g, 'ежедневную петлю')
  .replace(/Image-cost/g, 'Себестоимость изображений')
  .replace(/для специальные эпизоды/g, 'для специальных эпизодов')
  .replace(/token packs/g, 'token-пакетов')
  .replace(/compare-layers/g, 'сегменты для сравнения')
  .replace(/с широкой ежедневного ритуала задачей/g, 'с широкой задачей ежедневного ритуала')
  .replace(/СВЯЗКА WHITESPACE И АУДИТОРИИ/g, 'СВЯЗКА БЕЛОГО ПЯТНА И АУДИТОРИИ')
  .replace(/Итог по белом пятне/g, 'Итог по белому пятну')
  .replace(/по белом пятне/g, 'по белому пятну')
  .replace(/ICP_A: Spiritual self-improvers/g, 'Spiritual self-improvers')
  .replace(/ICP_B: Avatar identity builders/g, 'Avatar identity builders')
  .replace(/ICP_C: Anxious daily reset users/g, 'Anxious daily reset users')
  .replace(/ICP_D: Habit and progress users/g, 'Habit and progress users')
  .replace(/ICP_E: Cozy\/casual progression users/g, 'Cozy/casual progression users')
  .replace(/доказательство белом пятне АУРА/g, 'доказательство белого пятна АУРЫ')
  .replace(/гипотеза 3 доказательство/g, 'доказательство гипотезы 3')
  .replace(/AI голосs/g, 'AI-голоса')
  .replace(/голос generator/g, 'генератор голоса')
  .replace(/голос-agent/g, 'voice-agent')
  .replace(/голос-first/g, 'voice-first')
  .replace(/low-задержку/g, 'low-latency')
  .replace(/experiments/g, 'эксперименты')
  .replace(/Usage-based/g, 'по фактическому использованию')
  .replace(/events\/записи сессий\/features/g, 'событиям, записям сессий и функциям')
  .replace(/retries/g, 'повторные попытки')
  .replace(/latency/g, 'задержку')
  .replace(/low-задержку/g, 'low-latency')
  .replace(/Emotional self-improvement \/ ежедневного ритуала/g, 'Emotional self-improvement / ежедневный ритуал')
  .replace(/privacy-экран/g, 'экран приватности')
  .replace(/evidence note/g, 'короткая заметка-доказательство')
  .replace(/Share-card/g, 'Share-карточка')
  .replace(/creator-сезоны/g, 'сезоны от авторов')
  .replace(/Paywall after value/g, 'Платный экран после ценности')
  .replace(/Choose действие/g, 'Выбор действия')
  .replace(/Mark done \/ reflection/g, 'Отметка действия / рефлексия')
  .replace(/Avatar change/g, 'Изменение avatar')
  .replace(/Tomorrow hook/g, 'Причина вернуться завтра')
  .replace(/Season start/g, 'Старт сезона')
  .replace(/Episode of the day/g, 'Эпизод дня')
  .replace(/Birth \+ now/g, 'Дата рождения + состояние сейчас')
  .replace(/Welcome/g, 'Первый экран')
  .replace(/teaser/g, 'тизер')
  .replace(/Paywall нельзя/g, 'Платный экран нельзя')
  .replace(/Product specification: путь пользователя по дням/g, 'Продуктовая спецификация: путь пользователя по дням')
  .replace(/Cost model: сколько может стоить продукт на разных масштабах/g, 'Модель себестоимости: сколько может стоить продукт на разных масштабах')
  .replace(/Retention analysis: почему пользователь возвращается или удаляет продукт/g, 'Анализ удержания: почему пользователь возвращается или удаляет продукт')
  .replace(/Virality: что пользователь может захотеть показать другим/g, 'Виральность: что пользователь может захотеть показать другим')
  .replace(/Go-to-market: где проверять спрос/g, 'Выход на рынок: где проверять спрос')
  .replace(/Investment memo: решение на одну страницу/g, 'Инвестиционная записка: решение на одну страницу')
  .replace(/MVP validation plan: что проверить за 30 дней/g, 'План проверки MVP: что проверить за 30 дней')
  .replace(/video-avatar/g, 'видео-avatar')
  .replace(/Video-avatar/g, 'Видео-avatar')
  .replace(/image-first/g, 'image-first')
  .replace(/Платный экран и деньги/g, 'Платный экран и деньги')
  .replace(/Product analytics/g, 'Продуктовая аналитика')
  .replace(/Usage-based по/g, 'По фактическому использованию по')
  .replace(/billing-логику/g, 'логику биллинга')
  .replace(/revenue\/MAU/g, 'выручке/MAU')
  .replace(/Starter около/g, 'Starter около')
  .replace(/MVP-петля/g, 'MVP-петля');
fs.writeFileSync(OUT, `${reportText.trimEnd()}\n`);

console.log(`global_hypothesis_report=${OUT}`);
console.log(`global_hypothesis_source_appendix=${SOURCE_APPENDIX_OUT}`);
console.log(`raw_rows=${rawRows.length}`);
console.log(`dedup_rows=${dedupRows.length}`);
console.log(`markets=${nicheSummary.length}`);
