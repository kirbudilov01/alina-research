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
  const tagText = tags.length ? `видимые теги: ${tags.join(', ')}` : 'релевантность видна по названию, категории и описанию';
  const reads = {
    mindfulness: 'Показывает рынок короткого reset, mental health, meditation, journaling или эмоциональной саморегуляции. Для АУРЫ это источник языка спокойного входа и ежедневного ритуала.',
    avatar_identity: 'Показывает спрос на avatar/identity/AI companion механику. Для АУРЫ важно проверить, может ли образ себя меняться не декоративно, а причинно от действия.',
    astrology_esoterics: 'Показывает рынок personal meaning: horoscope, tarot, moon/spiritual guidance, manifestation или symbolic reflection. Для АУРЫ это источник входа через смысл, но не proof действия.',
    coaching: 'Показывает рынок self-improvement, habit, AI coach, routine или goal guidance. Для АУРЫ это источник слоя действия и платной глубины, но не доказательство мягкого ритуального опыта.',
    gaming: 'Показывает progression/quest/avatar benchmark. Для АУРЫ это не прямой TAM, а источник механик возврата, видимого прогресса и награды.',
    gaming_progression: 'Показывает progression/quest/avatar benchmark. Для АУРЫ это не прямой TAM, а источник механик возврата, видимого прогресса и награды.'
  };
  return `${reads[marketId] || 'Релевантный adjacent product для проверки.'} ${tagText}.`;
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

lines.push('# АУРА Research. Мировой рынок и логика гипотез');
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
lines.push('Формат этого отчета дальше такой же, как в старом ресерче Алины: мы не просто складываем факты в папку, а идем по гипотезам. Сначала формулируем, что мы думаем. Потом объясняем, почему это вообще разумно проверять. Затем смотрим рынки, конкурентов, аудиторию и продуктовую петлю. После каждого шага фиксируем вывод и следующий вопрос.');
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
    h: 'H4/H5',
    thought: 'Мы думаем, что у АУРЫ может быть общая аудитория с adjacent-продуктами.',
    why: 'Пользователь уже имеет recent behavior: ритуалы, journaling, self-improvement, spiritual guidance, progress tools.',
    checked: 'Собрали ICP-сегменты, VOC, Reddit/forum/context signals и interview probes.',
    current: 'Лучшие первые сегменты: Spiritual self-improvers и Habit/progress users; нужны интервью.'
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
  lines.push(`Чтобы было понятно, сколько материала собрано по каждой нише, ниже отдельно показана сводка. Здесь есть три уровня: общий объем показывает ширину карты рынка, приложения из магазинов ближе всего к конкурентному полю, а кандидаты в review показывают, какие продукты уже вынесены в более внимательное сравнение. Глобально в пакете сейчас ${fmt(dedupRows.length)} уникализированных объектов; ниши нельзя просто складывать между собой, потому что один продукт может попадать в несколько тематических контекстов.`);
  lines.push('');
  lines.push(mdTable(nicheCountRollup.map(row => ({
    market: row.market_ru,
    all_raw: row.all_source_raw_rows,
    all_dedup: row.all_source_dedup_rows,
    direct: row.direct_app_store_dedup_rows,
    direct_share: row.direct_app_store_dedup_share,
    top100: row.top100_primary_competitors,
    manual: row.manual_validation_targets,
    coverage: `${row.coverage_groups} groups; strong ${row.strong_coverage_groups}; medium ${row.medium_coverage_groups}`,
    read: row.opportunity_ru
  })), [
    { key: 'market', label: 'Ниша' },
    { key: 'all_raw', label: 'Исходных записей', align: 'right' },
    { key: 'all_dedup', label: 'Уникальных объектов', align: 'right' },
    { key: 'direct', label: 'Приложений из магазинов', align: 'right' },
    { key: 'direct_share', label: 'Доля приложений' },
    { key: 'top100', label: 'В review', align: 'right' },
    { key: 'manual', label: 'На ручную проверку', align: 'right' },
    { key: 'coverage', label: 'Покрытие' },
    { key: 'read', label: 'Как читать' }
  ]));
  lines.push('');
}
lines.push('### Что реально нашли по каждой нише: top-приложения');
lines.push('');
lines.push('Ниже не внутренняя методология, а конкретная картина рынка: по каждой нише показаны заметные consumer-приложения из уже собранной базы. Это не финальный список прямых конкурентов АУРЫ, но он отвечает на практический вопрос: какие приложения мы нашли, насколько они крупные по отзывам и почему эта ниша важна для гипотезы.');
lines.push('');
for (const row of nicheSummary) {
  const rollup = by(nicheCountRollup, 'market_id', row.market_id);
  const topApps = topAppsByNiche[row.market_id] || [];
  lines.push(`#### ${row.ru_name}`);
  lines.push('');
  lines.push(`${row.ru_name}: в этой нише собрано ${fmt(rollup.all_source_raw_rows || row.all_source_raw_rows)} исходных записей, ${fmt(rollup.all_source_dedup_rows || row.all_source_dedup_rows)} уникализированных объектов и ${fmt(rollup.direct_app_store_dedup_rows || row.direct_app_store_dedup_rows)} приложений из магазинов. В более внимательный review вынесено ${fmt(rollup.top100_primary_competitors || row.top100_primary_competitors)} приложений; на ручную проверку уже выделено ${fmt(rollup.manual_validation_targets || row.manual_validation_targets)}. Для АУРЫ эта ниша важна так: ${row.role_ru}. Денежный сигнал сейчас читается как: ${moneyVerdictRu(row.money_verdict)}.`);
  lines.push('');
  lines.push(mdTable(topApps.map(app => ({
    app: app.app_name,
    publisher: app.publisher,
    source: sourceGroupRu(app.source_group),
    reviews: fmt(app.review_count),
    rating: app.rating,
    pricing: [app.pricing_type, app.monetization_tags].map(clean).filter(Boolean).join('; ') || 'нет данных',
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
  { key: 'sam', label: 'SAM base', align: 'right' },
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
    { key: 'sam', label: 'SAM base', align: 'right' },
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
lines.push('Наиболее перспективная формулировка белого пятна: не “новое wellness-приложение”, а короткая трансформационная петля с причинной визуальной обратной связью. Если прогресс меняется произвольно, продукт станет декоративной avatar-игрушкой. Если действие никак не связано со смыслом, продукт станет обычным трекером привычек. Если reset живет отдельно, продукт станет библиотекой практик. Поэтому отличие должно проверяться именно на связке, а не на отдельных функциях.');
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
lines.push('## АУДИТОРИЯ, ИНТЕРВЬЮ И ГИПОТЕЗА #4');
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
lines.push('Гипотеза №4: первичная аудитория Alina находится среди людей, у которых уже есть недавнее поведение вокруг ежедневного ритуала, прогресса, reset или личного смысла, и которым нужна не новая функция, а более короткий и связанный цикл изменения.');
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
lines.push('## ИТОГОВАЯ МОДЕЛЬ ПРОДУКТА И ГИПОТЕЗА #5');
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
lines.push('Главная граница для всех концепций: АУРА не должна обещать судьбу, диагноз или точное предсказание по дате рождения. Рабочая формулировка честнее: дата рождения и символический профиль помогают создать личный язык входа, но продукт доказывает ценность только тогда, когда пользователь совершает маленькое действие и видит понятный сдвиг.');
lines.push('');
lines.push('Пример первой пользовательской сессии: человек вводит дату рождения и пишет “я хочу перестать откладывать важный разговор”. АУРА не отвечает предсказанием. Она открывает эпизод дня: “серия про честность без давления”. Пользователь получает короткий reset, выбирает действие “написать одно честное сообщение без требования ответа”, отмечает выполнение, а avatar получает новую черту - не абстрактный XP, а след эпизода: больше ясности, света, прямоты. На следующий день приложение возвращает не наказанием за пропуск, а продолжением: “вчера ты сделал сцену честности; сегодня можно закрепить ее одним спокойным шагом”.');
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
lines.push('Гипотеза №5: устойчивый MVP возможен, если пользователь за одну короткую сессию понимает причинность петли, чувствует отличие от обычного трекера привычек, медитации или приложения для чтения и может объяснить, зачем вернуться завтра. Пока это не доказано: нужны прототипные сессии, вопросы о готовности платить и наблюдение за тем, как пользователь сам пересказывает ценность продукта.');
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
lines.push('## СПИСОК ВОПРОСОВ И ПРОВЕРОК ДЛЯ СЛЕДУЮЩЕГО ЭТАПА');
lines.push('');
lines.push('Следующий слой исследования должен отвечать на простые вопросы: существует ли уже прямой аналог, где именно люди платят, кто реально испытывает такую потребность, считывается ли причинная петля и где продукт вызывает недоверие. Ниже эти вопросы разложены по гипотезам, чтобы следующий этап не превратился в абстрактный сбор мнений.');
lines.push('');
lines.push(mdTable(validationQuestionnaire.map(row => ({
  h: row.hypothesis_id,
  block: row.block_ru,
  question: row.question_ru,
  pass: row.pass_signal_ru,
  down: row.downgrade_signal_ru
})), [
  { key: 'h', label: 'Гипотеза' },
  { key: 'block', label: 'Блок' },
  { key: 'question', label: 'Вопрос / проверка' },
  { key: 'pass', label: 'Сигнал усиления' },
  { key: 'down', label: 'Сигнал ослабления' }
]));
lines.push('');
lines.push('Такой порядок удерживает исследование от преждевременного вывода: сначала формулируется гипотеза, затем показывается рынок, затем конкуренты, затем открытые сомнения, затем интервью/прототип и только после этого обновляется решение. Для мирового рынка это особенно важно: объем данных большой, но решение должно приниматься не по размеру базы, а по тому, выдерживает ли продуктовая петля ручные проверки.');
lines.push('');
lines.push('## БЛИЖАЙШАЯ ЛОГИКА ПРОВЕРКИ');
lines.push('');
lines.push('Следующий этап должен идти в том же порядке, в котором строится отчет. Сначала нужно убрать самый опасный риск: что прямой аналог уже существует внутри onboarding конкурента. Затем нужно проверить, где у соседних продуктов появляется платная ценность. После этого можно идти в интервью и прототип, потому что к этому моменту будет понятно, что именно показывать пользователю и какие сомнения проверять.');
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
  .replace(/paid-flow/g, 'платной модели')
  .replace(/Money case/g, 'Денежный аргумент')
  .replace(/revenue proof/g, 'доказательство выручки')
  .replace(/prototype sessions/g, 'прототипных сессий')
  .replace(/scorecard/g, 'оценочной карты')
  .replace(/validation queue/g, 'очереди проверки')
  .replace(/recent behavior/g, 'недавнее поведение')
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
  .replace(/финальным go/g, 'финальным решением')
  .replace(/доказательство product-market fit/g, 'доказательства product-market fit')
  .replace(/paywall signoff/g, 'проверки paywall')
  .replace(/consumer-приложение механики/g, 'механики consumer-приложений')
  .replace(/consumer-приложение гипотеза/g, 'гипотеза consumer-приложения')
  .replace(/consumer-приложение категории/g, 'категории consumer-приложений')
  .replace(/personal смысл enough to act/g, 'личному смыслу достаточно, чтобы перейти к действию')
  .replace(/personal смысл/g, 'личный смысл')
  .replace(/действие-tied progress/g, 'прогресс, связанный с действием')
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
  .replace(/primary-аудитория/g, 'первичная аудитория');
fs.writeFileSync(OUT, `${reportText.trimEnd()}\n`);

console.log(`global_hypothesis_report=${OUT}`);
console.log(`global_hypothesis_source_appendix=${SOURCE_APPENDIX_OUT}`);
console.log(`raw_rows=${rawRows.length}`);
console.log(`dedup_rows=${dedupRows.length}`);
console.log(`markets=${nicheSummary.length}`);
