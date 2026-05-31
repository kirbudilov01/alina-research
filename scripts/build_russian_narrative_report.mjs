import fs from 'fs';

const OUT = 'reports/alina-russian-narrative-report-v1.md';

for (const dir of ['reports']) fs.mkdirSync(dir, { recursive: true });

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

function pick(row, keys) {
  for (const key of keys) {
    const value = clean(row[key]);
    if (value) return value;
  }
  return '';
}

function countBy(rows, key) {
  const out = {};
  for (const row of rows) out[row[key] || 'unknown'] = (out[row[key] || 'unknown'] || 0) + 1;
  return out;
}

function topCounts(rows, key, limit = 5) {
  return Object.entries(countBy(rows, key))
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .slice(0, limit)
    .map(([k, v]) => `${k}: ${v}`)
    .join('; ');
}

function mdTable(rows, columns, limit = rows.length) {
  const limited = rows.slice(0, limit);
  const header = `| ${columns.map(c => c.label).join(' | ')} |`;
  const sep = `| ${columns.map(c => c.align === 'right' ? '---:' : '---').join(' | ')} |`;
  const body = limited.map(row => `| ${columns.map(c => clean(row[c.key]).replace(/\|/g, '/')).join(' | ')} |`);
  return [header, sep, ...body].join('\n');
}

function money(value) {
  const n = Number(String(value ?? '').replace(/[^\d.-]/g, ''));
  if (!Number.isFinite(n)) return clean(value) || 'нет данных';
  return `$${Math.round(n).toLocaleString('en-US')}`;
}

const expanded = csv('data_raw/expanded/all_expanded_dedup.csv');
const crossSourceRaw = csv('data_processed/cross_source_universe_raw.csv');
const crossSourceDedup = csv('data_processed/cross_source_universe_dedup.csv');
const coverage = csv('data_processed/cross_source_coverage_matrix.csv');
const saturation = csv('data_processed/cross_source_market_saturation_matrix.csv');
const tam = csv('data_processed/tam_sam_som_model.csv');
const marketMoney = csv('data_processed/market_money_triangulation.csv');
const revenueProxy = csv('data_processed/competitor_revenue_proxy_review.csv');
const top100 = csv('data_processed/top100_competitor_review_scorecard.csv');
const manualPacket = csv('data_processed/manual_competitor_inspection_packet.csv');
const publicListing = csv('data_processed/public_listing_inspection_results.csv');
const whitespace = csv('data_processed/whitespace_signal_matrix.csv');
const audience = csv('data_processed/audience_signal_matrix.csv');
const icp = csv('data_processed/icp_segment_matrix.csv');
const icpRecruiting = csv('data_processed/icp_recruiting_bridge.csv');
const reviewClusters = csv('data_processed/review_jtbd_cluster_summary.csv');
const redditSignals = csv('data_processed/reddit_mention_signal_matrix.csv');
const redditQueue = csv('data_processed/reddit_manual_reading_queue.csv');
const redditCapture = csv('data_processed/reddit_manual_reading_capture_sheet.csv');
const prototypeFlow = csv('data_processed/prototype_validation_stimulus_flow.csv');
const prototypeScorecard = csv('data_processed/prototype_validation_scorecard.csv');
const gate = csv('data_processed/validation_gate_calculator.csv');
const completion = csv('data_processed/research_completion_audit.csv');
const manifest = csv('data_processed/evidence_artifact_manifest.csv');
const paywallVisual = csv('data_processed/web_paywall_visual_adjudication.csv');
const narrativeMap = csv('data_processed/russian_narrative_evidence_map.csv');
const russianFieldbook = csv('data_processed/russian_validation_fieldbook.csv');
const tranchePlanner = csv('data_processed/validation_tranche_planner.csv');
const trancheBriefings = csv('data_processed/validation_tranche_briefing_index.csv');
const navigationIndex = csv('data_processed/research_navigation_index.csv');
const marketSizingPlaybook = csv('data_processed/russian_market_sizing_playbook.csv');
const marketDeepDives = csv('data_processed/russian_market_deep_dives.csv');
const whitespaceDecisionMap = csv('data_processed/russian_whitespace_decision_map.csv');
const claimAppendix = csv('data_processed/russian_claim_evidence_appendix.csv');
const sourceProvenance = csv('data_processed/russian_source_provenance_index.csv');
const competitorBattlecards = csv('data_processed/russian_competitor_battlecards.csv');
const icpBattlecards = csv('data_processed/russian_icp_battlecards.csv');
const icpInterviewDossiers = csv('data_processed/russian_icp_interview_dossiers.csv');
const vocObjectionMap = csv('data_processed/russian_voc_objection_map.csv');
const productLoopCards = csv('data_processed/russian_product_loop_cards.csv');
const prototypeSessionDossiers = csv('data_processed/russian_prototype_session_dossiers.csv');
const validationGateCards = csv('data_processed/russian_validation_gate_cards.csv');
const p0ExecutionPacket = csv('data_processed/russian_p0_execution_packet.csv');
const observedEvidenceLadder = csv('data_processed/russian_observed_evidence_ladder.csv');
const validationRunway = csv('data_processed/russian_validation_runway.csv');
const p0WalkthroughDossiers = csv('data_processed/russian_p0_walkthrough_dossiers.csv');
const paidFlowDossiers = csv('data_processed/russian_paid_flow_dossiers.csv');
const validationCaptureRows =
  csv('data_processed/manual_walkthrough_capture_sheet.csv').length +
  csv('data_processed/paid_flow_capture_sheet.csv').length +
  csv('data_processed/icp_interview_capture_sheet.csv').length +
  csv('data_processed/prototype_session_capture_sheet.csv').length +
  redditCapture.length;

const primaryTop100 = top100.filter(row => row.duplicate_flag === 'primary_app_entry');
const highThreat = primaryTop100.filter(row => Number(row.competitive_threat_score || 0) >= 24);
const directReference = primaryTop100.filter(row => row.competitive_verdict === 'direct_reference_competitor');
const behaviorTied = top100.filter(row => row.behavior_tied_progression === 'yes');
const strongRevenue = revenueProxy.filter(row => row.revenue_proxy_band === 'strong_bottom_up_money_proxy');
const mediumPlusRevenue = revenueProxy.filter(row => ['strong_bottom_up_money_proxy', 'medium_bottom_up_money_proxy'].includes(row.revenue_proxy_band));
const strongMoneyMarkets = marketMoney.filter(row => row.money_triangulation_verdict === 'strong_directional_money_case');
const mediumMoneyMarkets = marketMoney.filter(row => row.money_triangulation_verdict === 'medium_directional_money_case');
const p0Reddit = redditQueue.filter(row => row.priority_band === 'P0_read_first');
const p1Reddit = redditQueue.filter(row => row.priority_band === 'P1_read_next');
const notStartedGates = gate.filter(row => row.gate_status === 'not_started');
const manifestMissing = manifest.filter(row => row.exists !== 'yes');
const strongestIcp = [...icp].sort((a, b) => Number(b.evidence_score || 0) - Number(a.evidence_score || 0))[0] || {};
const intersection = tam.find(row => row.pillar === 'intersection') || {};

const lines = [];

lines.push('# Alina Research. Русский повествовательный отчет V1');
lines.push('');
lines.push(`Собрано: ${new Date().toISOString()}`);
lines.push('');
lines.push('## Как читать этот документ');
lines.push('');
lines.push('Этот отчет специально написан как последовательное повествование на русском языке. Таблицы и цифры здесь не заменяют рассказ, а поддерживают его: сначала мы фиксируем продуктовую гипотезу, потом показываем, почему рынок вообще заслуживает внимания, затем проверяем конкурентную плотность, белое пятно, аудиторию, продуктовую петлю и открытые риски. Это не финальная инвестиционная справка и не обещание спроса. Это evidence-first версия исследования: каждое сильное утверждение либо уже связано с локальными данными, либо явно оставлено в статусе гипотезы до ручной проверки.');
lines.push('');
lines.push('Главный вывод на текущем этапе такой: направление Alina стоит продолжать исследовать, но нельзя честно объявлять его доказанным продуктом. Деньги и соседние рынки видны. Конкурентная среда большая. Аудиторные языки и боли повторяются. Узкое потенциальное белое пятно формулируется как ежедневная петля, где личный смысл превращается в одно действие, а результат действия становится видимым через прогресс, идентичность или аватар. Но эта петля пока должна пройти ручные конкурентные walkthrough, paywall sign-off, интервью и прототипные сессии.');
lines.push('');
if (narrativeMap.length) {
  lines.push('## Карта аргумента');
  lines.push('');
  lines.push('Чтобы отчет читался как последовательная история, каждый крупный блок связан с одним тезисом, доказательным слоем, ограничением и следующим действием. Это защищает документ от двух ошибок: превращения в сухую таблицу и превращения в красивый текст без evidence backbone.');
  lines.push('');
  lines.push(mdTable(narrativeMap, [
    { key: 'narrative_step', label: 'Шаг' },
    { key: 'russian_thesis', label: 'Тезис' },
    { key: 'evidence_summary', label: 'Доказательная опора' },
    { key: 'claim_boundary_ru', label: 'Граница утверждения' }
  ], narrativeMap.length));
  lines.push('');
}
lines.push('## 0. Исполнительный рассказ');
lines.push('');
lines.push(`Если читать весь ресерч как одну историю, она выглядит так. Мы начали с осторожной продуктовой гипотезы: возможно, существует место для приложения, которое соединяет личный смысл, маленькое действие, короткий reset и видимый прогресс в одну ежедневную петлю. Чтобы не строить это на вкусе или интуиции, мы развернули карту соседних рынков и получили ${crossSourceDedup.length} dedup rows в cross-source universe, ${top100.length} строк top-candidate review, ${audience.length} audience signal rows и ${manifest.length} локальных артефактов в manifest. Это уже достаточно большой evidence warehouse, чтобы видеть рельеф рынка, но недостаточно, чтобы объявить продукт доказанным.`);
lines.push('');
lines.push(`Главное, что стало понятнее: Alina не должна соревноваться с каждым meditation app, habit tracker, astrology app, avatar generator или coaching product по отдельности. Сильнее выглядит узкая ставка на причинную петлю: пользователь получает персональное отражение дня, выбирает одно действие, проходит reset, завершает шаг и видит, что прогресс или образ себя изменился именно из-за действия. В публичных данных эта комбинация пока выглядит редкой: в top-100 найдено ${behaviorTied.length}/100 строгих behavior-tied progression signals, но ${manualPacket.length} P0 конкурентов все еще требуют настоящего walkthrough, потому что скрытая петля может жить внутри onboarding, paywall или first-session experience.`);
lines.push('');
lines.push(`Деньги в adjacent landscape видны, но их нужно держать честно. В market-money layer сейчас ${strongMoneyMarkets.length} strong directional cases, ${mediumMoneyMarkets.length} medium directional case и ${strongRevenue.length} strong competitor revenue proxies. Базовый intersection SAM в модели равен ${money(intersection.samBase)}. Это не прогноз выручки Alina и не обещание спроса; это аргумент, что рядом существуют платные привычки пользователей, которые стоит проверить через paid-flow signoff и willingness-to-pay вопросы.`);
lines.push('');
lines.push(`Аудиторно наиболее полезная формулировка сейчас не демографическая, а поведенческая: digital ritual users. Это люди, которые уже используют приложения, чтобы регулировать состояние, видеть прогресс, поддерживать идентичность и возвращаться к ощущению изменения. Самый сильный directional ICP сейчас - ${strongestIcp.segment_name || 'нет данных'}, но ни один ICP нельзя считать выбранным до интервью и прототипных сессий. Поэтому финальный смысл текущего пакета простой: у нас есть масштабная карта, гипотезы, источники, матрицы и рабочая validation system; следующий скачок качества появится только после наблюдаемого evidence на экранах конкурентов и у живых пользователей.`);
lines.push('');
lines.push('## 1. Откуда мы начали');
lines.push('');
lines.push('Исходная продуктовая идея была не в том, чтобы сделать еще один трекер привычек, еще один mindfulness-продукт или еще одно эзотерическое приложение. Интуиция была шире: есть люди, которым нужен ежедневный ритуал личного смысла, короткий reset, понятный следующий шаг и ощущение, что они меняются. Поэтому исследование разложено на пять направлений: coaching/self-improvement, mindfulness/reset, avatar/identity, astrology/esoterics и gaming/progression как источник механик, но не обязательно как основной рынок.');
lines.push('');
lines.push(`На уровне данных это уже не маленькая записка. Сейчас в локальном пакете ${manifest.length} артефакта, missing в manifest: ${manifestMissing.length}. Cross-source universe содержит ${crossSourceRaw.length} нормализованных raw rows и ${crossSourceDedup.length} dedup rows. Это дает масштабную карту соседних продуктов, но сама по себе карта не доказывает спрос на Alina. Она нужна, чтобы не спорить вслепую.`);
lines.push('');
lines.push(mdTable([
  { metric: 'Dedup competitor/source universe', value: crossSourceDedup.length, meaning: 'нижняя граница 30k+ уже закрыта на cross-source уровне' },
  { metric: 'Coverage cells', value: coverage.length, meaning: 'покрытие рынков источниками, не один канал' },
  { metric: 'Top-100 reviewed rows', value: top100.length, meaning: 'AI-assisted конкурентный обзор, требует manual validation' },
  { metric: 'Validation capture rows', value: validationCaptureRows, meaning: 'готовые строки для ручной фиксации доказательств' }
], [
  { key: 'metric', label: 'Слой' },
  { key: 'value', label: 'Объем', align: 'right' },
  { key: 'meaning', label: 'Что это значит' }
]));
lines.push('');
lines.push('## 2. Рынки и деньги: почему здесь вообще может быть бизнес');
lines.push('');
lines.push(`Рыночная часть строится не на одной красивой цифре TAM, а на триангуляции. В модели есть TAM/SAM/SOM, source-confidence review, stress-test assumptions, IAP/Google Play/paywall evidence, competitor revenue proxy и отдельная market-money triangulation. Самая честная формулировка сейчас: в нескольких соседних рынках деньги видны направленно, но H2 все еще держится в validation, потому что нужны paid-flow walkthrough и willingness-to-pay evidence.`);
lines.push('');
lines.push(`Сильные directional money cases сейчас: ${strongMoneyMarkets.map(row => row.market).join(', ') || 'нет'}. Средние directional cases: ${mediumMoneyMarkets.map(row => row.market).join(', ') || 'нет'}. На уровне конкурентов есть ${strongRevenue.length} strong bottom-up money proxy и ${mediumPlusRevenue.length} medium-or-stronger proxy. Это поддерживает тезис, что пользователи платят в соседних категориях, но не доказывает, что они заплатят именно за Alina.`);
lines.push('');
lines.push(mdTable(marketMoney, [
  { key: 'market', label: 'Рынок' },
  { key: 'money_triangulation_verdict', label: 'Вердикт денег' },
  { key: 'total_money_evidence_score', label: 'Score', align: 'right' },
  { key: 'claim_boundary', label: 'Граница утверждения' }
], 8));
lines.push('');
lines.push(`Для intersection-модели базовый SAM в текущей модели: ${money(intersection.samBase)}. Эту цифру нельзя читать как прогноз выручки. Ее корректнее читать как рамку: если удастся доказать продуктовую петлю, есть достаточно большой соседний платежный контекст, чтобы продолжать работу.`);
lines.push('');
if (marketSizingPlaybook.length) {
  lines.push('## 2.0. Русский TAM/SAM/SOM playbook');
  lines.push('');
  lines.push(`Чтобы рыночная часть не выглядела как одна магическая цифра, добавлен русский sizing playbook на ${marketSizingPlaybook.length} market rows. Он показывает формулу по каждому рынку: TAM base, serviceable share, SAM base, confidence/directness weighted SAM, money verdict, caveat и следующий proof. Главная логика: цифры нужны для приоритизации и проверки H2, а не для заявления "Alina заработает столько-то".`);
  lines.push('');
  lines.push(mdTable(marketSizingPlaybook, [
    { key: 'pillar', label: 'Pillar' },
    { key: 'directness_ru', label: 'Directness' },
    { key: 'sam_base_usd', label: 'SAM base' },
    { key: 'weighted_sam_base_usd', label: 'Weighted SAM' },
    { key: 'money_verdict', label: 'Money verdict' },
    { key: 'decision_rule_ru', label: 'Как читать' }
  ], marketSizingPlaybook.length));
  lines.push('');
  for (const row of marketSizingPlaybook) {
    lines.push(`**${row.pillar}.** ${row.formula_read_ru} Caveat: ${row.caveat_ru} Следующий proof: ${row.next_proof_ru}`);
    lines.push('');
  }
}
if (marketDeepDives.length) {
  lines.push('## 2.1. Пять рынков по отдельности');
  lines.push('');
  lines.push(`Чтобы не смешивать разные типы доказательств, добавлен market-by-market слой на ${marketDeepDives.length} направлений. Он показывает роль каждого рынка для Alina: где мы ищем деньги, где язык личного смысла, где reset, где identity feedback, а где только механики прогресса. Этот слой особенно важен для русского PDF: он делает пять направлений не списком категорий, а последовательной картой решений.`);
  lines.push('');
  lines.push(mdTable(marketDeepDives, [
    { key: 'ru_name', label: 'Рынок' },
    { key: 'sam_base_usd', label: 'SAM base', align: 'right' },
    { key: 'money_verdict', label: 'Money verdict' },
    { key: 'cross_source_dedup_rows', label: 'Dedup rows', align: 'right' },
    { key: 'opportunity_band', label: 'Whitespace' },
    { key: 'verdict_ru', label: 'Русский вывод' }
  ], marketDeepDives.length));
  lines.push('');
  for (const row of marketDeepDives) {
    lines.push(`**${row.ru_name}.** ${row.role_ru}. Для Alina: ${row.alina_read_ru}. Evidence: ${row.cross_source_dedup_rows || 0} dedup rows, ${row.coverage_cells} coverage cells, ${row.audience_signal_rows} audience rows, ${row.reddit_signal_rows} Reddit/forum signals, ${row.top100_primary_competitors} top-100 primary competitors. Граница: ${row.boundary_ru}`);
    lines.push('');
  }
}
if (paidFlowDossiers.length) {
  lines.push('## 2.2. Русские paid-flow dossiers');
  lines.push('');
  lines.push(`Чтобы H2 не держалась только на TAM/SAM/SOM, IAP и web-pricing proxy, добавлены paid-flow dossiers на ${paidFlowDossiers.length} продуктов. Они показывают, где есть public-pricing prefill, какие 4 скрина надо сохранить, как проверить product-match, где лежит first meaningful paywall boundary и когда H2 можно усилить или, наоборот, ослабить.`);
  lines.push('');
  lines.push(mdTable(paidFlowDossiers, [
    { key: 'dossier_rank', label: '#' },
    { key: 'app_name', label: 'Product' },
    { key: 'market', label: 'Market' },
    { key: 'visual_adjudication_prefill', label: 'Prefill' },
    { key: 'price_evidence', label: 'Price' },
    { key: 'required_slots_count', label: 'Slots', align: 'right' },
    { key: 'completed_slots_count', label: 'Done', align: 'right' }
  ], paidFlowDossiers.length));
  lines.push('');
  for (const row of paidFlowDossiers.slice(0, 5)) {
    lines.push(`**${row.dossier_rank}. ${row.app_name}.** ${row.paid_signal_risk_ru} Upgrade: ${row.upgrade_rule_ru}`);
    lines.push('');
  }
  lines.push('Граница этого слоя: paid-flow dossier делает H2 проверяемой, но не заменяет human signoff. Пока completed slots равны нулю, деньги можно описывать как range/proxy-supported, а не как доказанную willingness-to-pay для Alina.');
  lines.push('');
}
lines.push('## 3. Конкурентная плотность: рынок большой, но не пустой');
lines.push('');
lines.push(`В top-100 review найдено ${primaryTop100.length} unique primary apps. Из них ${highThreat.length} выглядят high-threat, а direct reference competitor сейчас ${directReference.length}. Это означает, что пространство не пустое: пользователи уже решают куски задачи через meditation apps, habit apps, AI companions, astrology apps, avatar tools и game-like progression products.`);
lines.push('');
lines.push(`Самый важный нюанс: широкие категории заняты, но строгий сигнал behavior-tied avatar/progress progression найден только в ${behaviorTied.length}/100 top-candidate rows. Поэтому белое пятно формулируется узко: не "сделать все сразу", а проверить, действительно ли редка петля meaning -> action -> reset -> visible identity/progress feedback -> next-day return.`);
lines.push('');
lines.push(`Manual inspection packet уже выделяет ${manualPacket.length} P0 приложений для walkthrough, а public listing inspection покрывает ${publicListing.length} публичных листингов. Но это еще не закрывает вопрос: публичные описания могут скрывать реальные onboarding/paywall/product-loop детали. Поэтому H1 и H3 остаются в статусе hold/validate.`);
lines.push('');
if (competitorBattlecards.length) {
  lines.push('## 3.1. Русские battlecards P0 конкурентов');
  lines.push('');
  lines.push(`Чтобы конкурентный анализ был читаемым, добавлены русские battlecards на ${competitorBattlecards.length} P0 приложений. Они показывают угрозу, money proxy, review language, JTBD/pain, открытие для Alina и конкретные slots для walkthrough. Это не human validation: карточки только готовят проверку и не усиливают H1/H3 без скриншотов.`);
  lines.push('');
  lines.push(mdTable(competitorBattlecards, [
    { key: 'battlecard_rank', label: '#' },
    { key: 'app_name', label: 'Конкурент' },
    { key: 'threat_ru', label: 'Риск' },
    { key: 'validation_priority_score', label: 'Priority', align: 'right' },
    { key: 'revenue_proxy_band', label: 'Money proxy' },
    { key: 'behavior_tied_progression_prefill', label: 'Behavior-tied' }
  ], competitorBattlecards.length));
  lines.push('');
  for (const row of competitorBattlecards.slice(0, 6)) {
    lines.push(`**${row.app_name}.** ${row.inspection_read_ru} Открытие для Alina: ${row.alina_opening_ru} Проверить: ${row.required_screenshot_slots}.`);
    lines.push('');
  }
}
lines.push('## 4. Белое пятно: что именно может быть новым');
lines.push('');
lines.push('Белое пятно не в том, что нет медитаций, нет привычек, нет коучинга или нет аватаров. Все это есть. Потенциальная возможность появляется на стыке: пользователю не просто дают контент или список задач, а помогают каждый день прожить маленький цикл изменения. Сначала он получает персональный смысл или отражение состояния. Потом выбирает одно реальное действие. Потом делает короткий reset. После завершения действия видит, что его прогресс или образ себя изменился не произвольно, а причинно связан с действием.');
lines.push('');
lines.push(`В whitespace matrix сейчас ${whitespace.length} строк. Cross-source saturation держит gaming/progression скорее как benchmark, а не как прямой основной рынок. Это здоровая осторожность: игровые механики полезны как язык мотивации, но если Alina будет выглядеть как retention-game без личного смысла, гипотеза сломается.`);
lines.push('');
lines.push(mdTable(saturation.map(row => ({
  market_label: pick(row, ['market', 'niche', 'pillar']),
  opportunity_band: row.opportunity_band,
  interpretation: row.interpretation,
  next_validation_move: row.next_validation_move
})), [
  { key: 'market_label', label: 'Рынок' },
  { key: 'opportunity_band', label: 'Opportunity band' },
  { key: 'interpretation', label: 'Интерпретация' },
  { key: 'next_validation_move', label: 'Следующий шаг' }
], 8));
lines.push('');
if (whitespaceDecisionMap.length) {
  lines.push('## 4.1. Русская whitespace decision map');
  lines.push('');
  lines.push(`Чтобы H3 не звучала сильнее, чем позволяет evidence, добавлена русская whitespace decision map на ${whitespaceDecisionMap.length} рынков/ниш. Она показывает full-loop rate, scarcity, public-listing hidden clone risks и практический H3 read: где есть узкая directional возможность, где рынок только benchmark, а где claim остается crowded/unclear.`);
  lines.push('');
  lines.push(mdTable(whitespaceDecisionMap, [
    { key: 'niche', label: 'Niche' },
    { key: 'cross_source_dedup_rows', label: 'Dedup', align: 'right' },
    { key: 'full_loop_rate_pct', label: 'Full-loop %', align: 'right' },
    { key: 'opportunity_read_ru', label: 'Opportunity' },
    { key: 'h3_decision_read_ru', label: 'H3 read' }
  ], whitespaceDecisionMap.length));
  lines.push('');
  for (const row of whitespaceDecisionMap) {
    lines.push(`**${row.niche}.** ${row.h3_decision_read_ru} Риск: ${row.top_public_risk_apps || 'n/a'}. Следующий шаг: ${row.next_validation_move_ru}`);
    lines.push('');
  }
  lines.push('Самый опасный ранний риск для H3 - Shepherd: Spiritual Bible BFF. Если walkthrough подтвердит полный loop с action -> identity/avatar causality, whitespace wording должен быть немедленно сужен.');
  lines.push('');
}
lines.push('## 5. Аудитория: не "люди из пяти рынков", а digital ritual users');
lines.push('');
lines.push(`Аудиторная гипотеза стала точнее. Общая аудитория - это не люди, которые одновременно пользуются всеми пятью категориями. Это люди, которые уже используют цифровые ритуалы, чтобы регулировать состояние, идентичность, прогресс и надежду на изменение. В audience matrix сейчас ${audience.length} rows, в ICP matrix - ${icp.length} segment hypotheses. Самый сильный directional ICP на текущий момент: ${strongestIcp.segment_name || 'нет данных'} с evidence score ${strongestIcp.evidence_score || 'n/a'}.`);
lines.push('');
lines.push('Review/JTBD слой показывает повторяющиеся работы: daily anchor, structure self-improvement, make growth visible, fast emotional reset, belonging/accountability, feel seen/personalized. Reddit/forum слой добавляет живой язык: люди ищут alternatives, жалуются на перегрузку, скучные повторяющиеся медитации, streak anxiety, отсутствие ясного доказательства, что практики помогают, и слишком тяжелые системы.');
lines.push('');
lines.push(mdTable(icp, [
  { key: 'segment_id', label: 'ICP' },
  { key: 'segment_name', label: 'Сегмент' },
  { key: 'evidence_band', label: 'Evidence' },
  { key: 'core_job', label: 'Core job' },
  { key: 'validation_gate', label: 'Validation gate' }
], icp.length));
lines.push('');
if (icpBattlecards.length) {
  lines.push('## 5.1. Русские ICP battlecards');
  lines.push('');
  lines.push(`Чтобы аудиторная часть была не набором сегментов, а рабочей картой клиента, добавлены русские ICP battlecards на ${icpBattlecards.length} сегментов. Они последовательно отвечают на вопросы: кто этот пользователь, какую работу он уже делает, почему это важно для Alina, где его искать, как его отсечь на screener, что показать в прототипе, какой WTP-вопрос задать и по какому сигналу сегмент усилить или отбросить.`);
  lines.push('');
  lines.push(mdTable(icpBattlecards, [
    { key: 'segment_id', label: 'ICP' },
    { key: 'segment_name', label: 'Сегмент' },
    { key: 'priority_ru', label: 'Приоритет' },
    { key: 'evidence_score', label: 'Score', align: 'right' },
    { key: 'audience_signal_rows', label: 'Audience rows', align: 'right' },
    { key: 'reddit_signal_rows', label: 'Reddit rows', align: 'right' },
    { key: 'core_job_ru', label: 'Core job' }
  ], icpBattlecards.length));
  lines.push('');
  for (const row of icpBattlecards.slice(0, 4)) {
    lines.push(`**${row.segment_name}.** ${row.why_it_matters_ru} Позиционирование: ${row.positioning_angle_ru}. Следующий шаг: ${row.next_action_ru}`);
    lines.push('');
  }
  lines.push('Граница этого слоя принципиальна: карточки помогают начать fieldwork, но не выбирают ICP вместо реальных интервью, прототипных сессий и WTP/fatal-objection capture.');
  lines.push('');
}
if (icpInterviewDossiers.length) {
  lines.push('## 5.2. Русские ICP interview dossiers');
  lines.push('');
  lines.push(`Чтобы H5 не оставалась аудиторной матрицей, добавлены ICP interview dossiers на ${icpInterviewDossiers.length} сегментов. Они показывают, кого искать, через какие каналы, какие тесты провести, какие evidence fields заполнить и какие ответы апгрейдят или ослабляют сегмент.`);
  lines.push('');
  lines.push(mdTable(icpInterviewDossiers, [
    { key: 'segment_id', label: 'ICP' },
    { key: 'segment_name', label: 'Segment' },
    { key: 'priority', label: 'Priority' },
    { key: 'evidence_score', label: 'Score', align: 'right' },
    { key: 'capture_rows_count', label: 'Rows', align: 'right' },
    { key: 'completed_capture_rows', label: 'Done', align: 'right' },
    { key: 'success_rule_ru', label: 'Upgrade rule' }
  ], icpInterviewDossiers.length));
  lines.push('');
  for (const row of icpInterviewDossiers.filter(r => r.priority === 'P0_top_two')) {
    lines.push(`**${row.segment_id}. ${row.segment_name}.** Core job: ${row.core_job_ru} Recruiting: ${row.best_recruiting_routes_ru} Downgrade: ${row.downgrade_rule_ru}`);
    lines.push('');
  }
  lines.push('Граница этого слоя: dossier готовит интервью и делает их сравнимыми, но не валидирует аудиторию до заполненных capture rows и точных цитат.');
  lines.push('');
}
if (vocObjectionMap.length) {
  lines.push('## 5.3. Русская voice-of-customer / objection map');
  lines.push('');
  const vocSignals = vocObjectionMap.reduce((sum, row) => sum + Number(row.evidence_rows || 0), 0);
  lines.push(`Чтобы аудитория не была только сегментной матрицей, добавлена voice-of-customer / objection map на ${vocObjectionMap.length} тем. Она сшивает review/JTBD clusters, community/referral rows, Reddit signal rows, manual-read queue, ICP segments и prototype scorecard в язык пользовательских работ, возражений, interview probes и prototype probes. Суммарно по темам учтено ${vocSignals} локальных supporting signals/rows; это intentionally proxy layer, а не representative demand proof.`);
  lines.push('');
  lines.push(mdTable(vocObjectionMap, [
    { key: 'theme_rank', label: '#' },
    { key: 'theme_id', label: 'Theme' },
    { key: 'theme_ru', label: 'Тема' },
    { key: 'linked_hypotheses', label: 'H' },
    { key: 'evidence_rows', label: 'Signals', align: 'right' },
    { key: 'reddit_queue_rows', label: 'Read queue', align: 'right' },
    { key: 'interview_probe_ru', label: 'Interview probe' }
  ], vocObjectionMap.length));
  lines.push('');
  for (const row of vocObjectionMap.slice(0, 5)) {
    lines.push(`**${row.theme_id}.** Возможность: ${row.opportunity_ru} Риск: ${row.product_risk_ru} Downgrade: ${row.downgrade_rule_ru}`);
    lines.push('');
  }
  lines.push('Граница этого слоя: VOC карта задает язык интервью, prototype sessions и paid-depth checks, но не апгрейдит H5/H6/H4 без заполненных capture rows.');
  lines.push('');
}
lines.push(`Reddit source-native слой сейчас содержит ${redditSignals.length} coded qualitative signal rows. Из них ${redditQueue.length} уникальных тредов поставлены в manual reading queue, ${p0Reddit.length} имеют P0_read_first, ${p1Reddit.length} - P1_read_next. Для P0/P1 создан capture sheet на ${redditCapture.length} строк. Все строки по умолчанию имеют статус unread_do_not_upgrade: это специально защищает отчет от преждевременного апгрейда claims.`);
lines.push('');
lines.push('## 6. Что говорит Reddit/forum слой человеческим языком');
lines.push('');
lines.push(`Самые частые Reddit signal groups: ${topCounts(redditSignals, 'signal_group', 8)}. Это важно не как статистика спроса, а как словарь проблем. Например, в productivity/self-improvement тредах люди часто не просят "больше функций"; они просят меньше трения, меньше чувства вины и больше ясной связи между практикой и результатом. В mindfulness тредах часто звучит запрос на персонализацию, свежий ежедневный курс, короткий sleep/anxiety контент и отсутствие перегруза. В avatar/AI companion зоне важно отделить эмоционального компаньона от визуальной обратной связи о росте.`);
lines.push('');
lines.push('Из этого рождаются реальные interview prompts: "Что в последнем self-improvement app показалось тяжелым?", "Что должно произойти бесплатно, чтобы было не жалко платить?", "Аватар, который меняется после действия, мотивирует или выглядит глупо?", "Какая духовная подсказка ощущается полезной, а какая манипулятивной?" Эти вопросы уже не абстрактные: они привязаны к конкретным источникам и capture rows.');
lines.push('');
lines.push('## 7. Продуктовое ядро: какая петля сейчас выглядит проверяемой');
lines.push('');
lines.push(`Product-core evidence и prototype stimulus переводят исследование из "рынок интересный" в "что именно тестировать". Сейчас есть ${prototypeFlow.length} prototype stimulus rows и ${prototypeScorecard.length} scorecard metrics. MVP-гипотеза выглядит так: открыть Alina, получить персональное отражение/смысл дня, выбрать одно действие, пройти короткий reset, завершить действие, увидеть причинное изменение прогресса/аватара/identity object и получить мягкий next-day hook.`);
lines.push('');
lines.push('У этой петли есть сильная сторона: она объединяет meaning, action, reset и visible progress. Но у нее есть и риски. Если guidance будет слишком эзотерическим, появится недоверие. Если avatar будет декоративным, петля развалится. Если progression будет похож на game chores, пользователь почувствует манипуляцию. Если paywall появится до первого понятного value moment, доверие может не возникнуть.');
lines.push('');
if (productLoopCards.length) {
  lines.push('## 7.1. Русские карточки продуктовой петли');
  lines.push('');
  lines.push(`Чтобы продуктовая гипотеза читалась последовательно, добавлены русские карточки ${productLoopCards.length} экранов MVP-петли. Они показывают не только экран и текст, но роль каждого шага в доказательной логике: где возникает личный смысл, где он превращается в действие, где снижается трение, где фиксируется completion, где проверяется action -> identity/avatar causality и где нельзя усиливать H4/H6 без наблюдаемого prototype evidence.`);
  lines.push('');
  lines.push(mdTable(productLoopCards, [
    { key: 'step', label: 'Шаг' },
    { key: 'screen_name', label: 'Экран' },
    { key: 'role_ru', label: 'Роль' },
    { key: 'linked_gate_ru', label: 'Gate' },
    { key: 'max_seconds', label: 'Sec', align: 'right' }
  ], productLoopCards.length));
  lines.push('');
  for (const row of productLoopCards) {
    lines.push(`**${row.step}. ${row.screen_name}.** ${row.role_ru} Успех: ${row.expected_signal_ru} Провал: ${row.failure_signal_ru}`);
    lines.push('');
  }
  lines.push('Граница этого слоя: это stimulus design, а не результат пользовательской валидации. Он делает H4/H6 проверяемыми, но не закрывает их.');
  lines.push('');
}
if (prototypeSessionDossiers.length) {
  lines.push('## 7.2. Русские prototype session dossiers');
  lines.push('');
  lines.push(`Чтобы H4/H6 не оставались на уровне stimulus design, добавлены prototype session dossiers на ${prototypeSessionDossiers.length} P0 сегмента. Они показывают flow сессии, critical screens, scorecard metrics, evidence fields и правила upgrade/downgrade для конкурентного преимущества и продуктового ядра.`);
  lines.push('');
  lines.push(mdTable(prototypeSessionDossiers, [
    { key: 'segment_id', label: 'ICP' },
    { key: 'segment_name', label: 'Segment' },
    { key: 'screen_count', label: 'Screens', align: 'right' },
    { key: 'capture_rows_count', label: 'Rows', align: 'right' },
    { key: 'completed_capture_rows', label: 'Done', align: 'right' },
    { key: 'critical_screens_ru', label: 'Critical screens' }
  ], prototypeSessionDossiers.length));
  lines.push('');
  for (const row of prototypeSessionDossiers) {
    lines.push(`**${row.segment_id}. ${row.segment_name}.** Upgrade: ${row.upgrade_rule_ru} Downgrade: ${row.downgrade_rule_ru}`);
    lines.push('');
  }
  lines.push('Граница этого слоя: prototype dossier делает H4/H6 проверяемыми, но claim усиливается только после заполненных prototype_session_capture_sheet и scorecard metrics.');
  lines.push('');
}
lines.push('## 8. Что уже доказано, а что еще нельзя утверждать');
lines.push('');
lines.push('На текущем этапе доказано не "Alina точно сработает", а другое: есть достаточно большой и платежеспособный adjacent landscape; есть повторяющиеся боли и jobs-to-be-done; есть narrow whitespace hypothesis; есть операционная система источников, матриц, claim boundaries, capture sheets и PDF/report artifacts. Не доказано: что пользователи действительно предпочитают эту петлю существующим решениям, что они понимают avatar/progress causality, что они готовы платить за paid depth, и что конкуренты не закрывают этот loop внутри onboarding.');
lines.push('');
lines.push(mdTable(completion, [
  { key: 'requirement_id', label: 'Requirement' },
  { key: 'status', label: 'Статус' },
  { key: 'evidence_strength', label: 'Сила' },
  { key: 'remaining_gap', label: 'Открытый gap' }
], completion.length));
lines.push('');
if (validationGateCards.length) {
  lines.push('## 8.1. Русские карточки H1-H6 validation gates');
  lines.push('');
  lines.push(`Чтобы не потерять строгость в момент перехода от desk research к ручной работе, добавлены русские карточки ${validationGateCards.length} validation gates. Они показывают по каждой гипотезе: что уже поддерживает claim, почему его нельзя апгрейдить, какой evidence надо собрать, какой результат даст GO и какой результат заставит downgradе/kill.`);
  lines.push('');
  lines.push(mdTable(validationGateCards, [
    { key: 'hypothesis_id', label: 'H' },
    { key: 'hypothesis_ru', label: 'Гипотеза' },
    { key: 'workstream_ru', label: 'Workstream' },
    { key: 'gate_status', label: 'Status' },
    { key: 'required_capture_rows', label: 'Required', align: 'right' },
    { key: 'completed_rows', label: 'Done', align: 'right' },
    { key: 'min_success_threshold', label: 'Success min', align: 'right' }
  ], validationGateCards.length));
  lines.push('');
  for (const row of validationGateCards) {
    lines.push(`**${row.hypothesis_id}. ${row.hypothesis_ru}.** Нельзя апгрейдить, потому что: ${row.why_not_upgrade_ru} Следующее действие: ${row.next_action_ru}`);
    lines.push('');
  }
  lines.push('Практический смысл этого слоя простой: пока completed_rows и success_rows равны нулю, отчет может быть большим и хорошо структурированным, но claims остаются в hold_validate.');
  lines.push('');
}
if (observedEvidenceLadder.length) {
  lines.push('## 8.2. Русская observed-evidence ladder');
  lines.push('');
  lines.push(`Чтобы отчет оставался речевым, но не терял доказательную строгость, добавлена observed-evidence ladder на ${observedEvidenceLadder.length} гипотез. Она отделяет desk support от observed proof: что уже можно говорить, чего пока нельзя утверждать, какой capture artifact надо заполнить и какая фраза допустима в текущей версии отчета.`);
  lines.push('');
  lines.push(mdTable(observedEvidenceLadder, [
    { key: 'hypothesis_id', label: 'H' },
    { key: 'hypothesis_ru', label: 'Гипотеза' },
    { key: 'evidence_mode_ru', label: 'Observed mode' },
    { key: 'required_capture_rows', label: 'Need', align: 'right' },
    { key: 'completed_rows', label: 'Done', align: 'right' },
    { key: 'report_sentence_ru', label: 'Честная фраза для отчета' }
  ], observedEvidenceLadder.length));
  lines.push('');
  for (const row of observedEvidenceLadder) {
    lines.push(`**${row.hypothesis_id}.** ${row.observed_gap_ru} Сначала заполнить: ${row.exact_artifact_to_fill_ru}`);
    lines.push('');
  }
  lines.push('Этот слой особенно важен для финального PDF: он не дает красивому повествованию случайно превратить незавершенную проверку в доказанный вывод.');
  lines.push('');
}
if (validationRunway.length) {
  lines.push('## 8.3. Русский validation runway');
  lines.push('');
  lines.push(`Чтобы dossier-слои не жили отдельно, добавлен validation runway на ${validationRunway.length} workstreams. Он задает порядок: hidden-clone walkthrough, paid-flow signoff, ICP interviews, prototype sessions, затем decision rebuild/PDF refresh.`);
  lines.push('');
  lines.push(mdTable(validationRunway, [
    { key: 'runway_order', label: '#' },
    { key: 'workstream_id', label: 'ID' },
    { key: 'workstream_ru', label: 'Workstream' },
    { key: 'linked_hypotheses', label: 'H' },
    { key: 'unit_count', label: 'Units', align: 'right' },
    { key: 'required_capture_rows', label: 'Need', align: 'right' },
    { key: 'completed_capture_rows', label: 'Done', align: 'right' },
    { key: 'p0_focus_ru', label: 'P0 focus' }
  ], validationRunway.length));
  lines.push('');
  for (const row of validationRunway) {
    lines.push(`**${row.runway_order}. ${row.workstream_id}: ${row.workstream_ru}.** Pass: ${row.pass_rule_ru} Downgrade: ${row.downgrade_rule_ru}`);
    lines.push('');
  }
  lines.push('Граница runway: он не создает observed evidence, а превращает весь пакет в последовательную программу ручной проверки.');
  lines.push('');
}
lines.push('## 9. Следующие действия');
lines.push('');
lines.push(`Все H1-H6 validation gates сейчас требуют наблюдаемой валидации. Not-started gates: ${notStartedGates.length}. Это не провал, а честная граница исследования: локальная evidence base готова, но реальные решения должны приниматься после ручного walkthrough и пользовательских сессий.`);
lines.push('');
lines.push('Практический порядок следующий. Сначала закрыть manual competitor walkthrough для P0 приложений: onboarding, first action, progress/avatar feedback, first paywall. Затем пройти paid-flow sign-off по сильным money proxy. Затем прочитать P0 Reddit threads и заполнить capture sheet: user job, alternatives, rejected patterns, paid/WTP signal, safety boundary, Alina implication. Затем провести ICP interviews по двум верхним сегментам и короткие prototype sessions. Только после этого можно обновлять H1-H6 из hold/validate в более сильные решения.');
lines.push('');
if (russianFieldbook.length) {
  lines.push('## 9.1. Русский полевой протокол');
  lines.push('');
  lines.push(`Чтобы следующий этап не остался абстрактным "надо провалидировать", создан русский полевой протокол на ${russianFieldbook.length} фаз. Он переводит открытые gates в человеческую последовательность действий: сначала сохраняем сырой evidence, затем заполняем capture rows, затем обновляем claims и только после этого пересобираем PDF. Это не доказательство спроса, а инструкция, как не потерять строгость во время ручной работы.`);
  lines.push('');
  lines.push(mdTable(russianFieldbook, [
    { key: 'phase_id', label: 'Фаза' },
    { key: 'phase_title_ru', label: 'Что делаем' },
    { key: 'evidence_to_collect_ru', label: 'Evidence' },
    { key: 'decision_rule_ru', label: 'Правило решения' }
  ], russianFieldbook.length));
  lines.push('');
}
if (tranchePlanner.length) {
  lines.push('## 9.2. Очередность validation tranches');
  lines.push('');
  lines.push(`Чтобы не тратить силы на широкий capture до проверки самых опасных рисков, добавлен tranche planner на ${tranchePlanner.length} партий. Он начинает со stop rules и hidden-clone spike, затем ведет через top-5 competitor walkthrough, paid-flow signoff, ICP/prototype pilots, Reddit language read и только потом предлагает расширять объем.`);
  lines.push('');
  lines.push(mdTable(tranchePlanner, [
    { key: 'sequence', label: 'Seq' },
    { key: 'tranche_id', label: 'Tranche' },
    { key: 'priority', label: 'Priority' },
    { key: 'row_count', label: 'Rows' },
    { key: 'operator_goal_ru', label: 'Задача' },
    { key: 'stop_or_downgrade_rule_ru', label: 'Stop / downgrade' }
  ], tranchePlanner.length));
  lines.push('');
}
if (p0ExecutionPacket.length) {
  lines.push('## 9.2.1. Русский P0 execution packet');
  lines.push('');
  lines.push(`Чтобы следующий шаг был исполнимым, добавлен P0 execution packet на ${p0ExecutionPacket.length} рабочих пакетов. Он переводит tranche planner в утреннюю очередность: какой блок открыть первым, какие evidence fields заполнить, что считается success, что вызывает downgrade и какие файлы пересобрать после наблюдаемого результата.`);
  lines.push('');
  lines.push(mdTable(p0ExecutionPacket, [
    { key: 'sequence', label: 'Seq' },
    { key: 'tranche_id', label: 'Tranche' },
    { key: 'target_scope', label: 'Target' },
    { key: 'row_count', label: 'Rows', align: 'right' },
    { key: 'operator_minutes', label: 'Minutes' },
    { key: 'next_action_ru', label: 'Сделать сейчас' }
  ], p0ExecutionPacket.length));
  lines.push('');
  for (const row of p0ExecutionPacket) {
    lines.push(`**${row.tranche_id}.** ${row.next_action_ru} Success: ${row.success_threshold_ru} Stop/downgrade: ${row.stop_or_downgrade_rule_ru}`);
    lines.push('');
  }
  lines.push('Этот packet не усиливает claims сам по себе. Он только делает ручную валидацию исполнимой и защищает отчет от stale publication после новых evidence.');
  lines.push('');
}
if (p0WalkthroughDossiers.length) {
  lines.push('## 9.2.2. Русские P0 competitor walkthrough dossiers');
  lines.push('');
  lines.push(`Чтобы первый ручной walkthrough был не абстрактным "посмотреть конкурентов", добавлены P0 dossiers на ${p0WalkthroughDossiers.length} конкурентов. Каждый dossier связывает public listing risk, hidden-clone риск, 5 обязательных screenshot slots, decisive questions и правило изменения H1/H3/H2 после проверки.`);
  lines.push('');
  lines.push(mdTable(p0WalkthroughDossiers, [
    { key: 'dossier_rank', label: '#' },
    { key: 'app_name', label: 'Конкурент' },
    { key: 'risk_read_ru', label: 'Риск' },
    { key: 'required_slots_count', label: 'Slots', align: 'right' },
    { key: 'completed_slots_count', label: 'Done', align: 'right' },
    { key: 'claim_update_after_walkthrough_ru', label: 'Как меняет claim' }
  ], p0WalkthroughDossiers.length));
  lines.push('');
  for (const row of p0WalkthroughDossiers.slice(0, 6)) {
    lines.push(`**${row.dossier_rank}. ${row.app_name}.** ${row.risk_read_ru} Сначала сохранить: ${row.required_filename_stubs}. После walkthrough: ${row.claim_update_after_walkthrough_ru}`);
    lines.push('');
  }
  lines.push('Этот слой по-прежнему не закрывает H1/H3 сам по себе: он нужен, чтобы captured screenshots и labels были сопоставимыми между конкурентами.');
  lines.push('');
}
if (trancheBriefings.length) {
  lines.push('## 9.3. Briefing-пакеты для первых tranches');
  lines.push('');
  lines.push(`Чтобы оператор не прыгал между десятками CSV, создано ${trancheBriefings.length} briefing-пакетов. Каждый пакет связывает одну tranche с конкретными capture rows, linked gates, success criteria, stop/downgrade rule и файлами, куда нужно записать результат. Это все еще не validation evidence, а рабочий маршрут для получения evidence.`);
  lines.push('');
  lines.push(mdTable(trancheBriefings, [
    { key: 'briefing_rank', label: '#' },
    { key: 'tranche_id', label: 'Tranche' },
    { key: 'priority', label: 'Priority' },
    { key: 'row_count', label: 'Rows' },
    { key: 'briefing_path', label: 'Briefing' },
    { key: 'claim_boundary', label: 'Boundary' }
  ], trancheBriefings.length));
  lines.push('');
}
if (navigationIndex.length) {
  lines.push('## 9.4. Навигационный индекс пакета');
  lines.push('');
  lines.push(`Чтобы весь ресерч не распался на сотни файлов, добавлен navigation index на ${navigationIndex.length} строк. Он связывает requirement, claim, gate, tranche, briefing, source files и next action. Это не новый evidence, а карта движения по evidence package.`);
  lines.push('');
  lines.push(mdTable(navigationIndex.filter(row => row.nav_type === 'gate'), [
    { key: 'label', label: 'Gate' },
    { key: 'linked_hypothesis', label: 'H' },
    { key: 'status', label: 'Status' },
    { key: 'linked_tranche', label: 'Tranche' },
    { key: 'briefing_path', label: 'Briefing' },
    { key: 'next_action', label: 'Next action' }
  ], 12));
  lines.push('');
}
if (claimAppendix.length) {
  lines.push('## 9.5. Claim -> Evidence -> Boundary appendix');
  lines.push('');
  lines.push(`Чтобы большой русский отчет не превратился в набор красивых утверждений, добавлен claim appendix на ${claimAppendix.length} строк. Каждая строка связывает claim, статус evidence, confidence, primary metric, границу утверждения, следующий шаг и source files. Это не новый рыночный claim, а проверочный слой: он показывает, где можно говорить уверенно, где только направленно, а где gate еще открыт.`);
  lines.push('');
  lines.push(mdTable(claimAppendix, [
    { key: 'claim_id', label: 'Claim' },
    { key: 'status_ru', label: 'Статус' },
    { key: 'confidence', label: 'Confidence' },
    { key: 'primary_metric', label: 'Метрика' },
    { key: 'boundary_ru', label: 'Граница' }
  ], claimAppendix.length));
  lines.push('');
}
if (sourceProvenance.length) {
  lines.push('## 9.6. Source provenance index');
  lines.push('');
  lines.push(`Чтобы было понятно, откуда берутся источники и какие слои можно цитировать, добавлен provenance index на ${sourceProvenance.length} строк. Он связывает manifest, source-reference artifacts, market source registry и source discovery. Важно: provenance доказывает трассируемость данных, но не превращает proxy в финальное доказательство спроса.`);
  lines.push('');
  lines.push(mdTable(sourceProvenance, [
    { key: 'provenance_id', label: 'ID' },
    { key: 'source_family_ru', label: 'Слой / источник' },
    { key: 'row_count', label: 'Rows', align: 'right' },
    { key: 'source_ref_rows', label: 'Source refs', align: 'right' },
    { key: 'boundary_ru', label: 'Граница' }
  ], 12));
  lines.push('');
}
lines.push('## 10. Финальный текущий verdict');
lines.push('');
lines.push('Текущий verdict: продолжать, но не переобещать. Alina выглядит как исследовательски перспективная ставка на стыке digital ritual, self-improvement, reset и identity/progress feedback. Самая сильная формулировка возможности: не универсальный комбайн, а короткая ежедневная трансформационная петля, где действие меняет видимый образ прогресса. Самая большая опасность: сделать слишком широкий продукт, который будет одновременно слабым meditation app, слабым habit tracker, слабым astrology app и слабым avatar toy. Поэтому следующий этап должен быть не расширением ради расширения, а жесткой проверкой центральной петли на реальных конкурентных экранах и реальных людях.');
lines.push('');
lines.push('## Ключевые локальные файлы');
lines.push('');
lines.push('- `data_processed/evidence_artifact_manifest.csv`');
lines.push('- `data_processed/research_completion_audit.csv`');
lines.push('- `data_processed/evidence_claim_register.csv`');
lines.push('- `data_processed/research_navigation_index.csv`');
lines.push('- `data_processed/reddit_manual_reading_capture_sheet.csv`');
lines.push('- `data_processed/russian_narrative_evidence_map.csv`');
lines.push('- `data_processed/russian_market_sizing_playbook.csv`');
lines.push('- `data_processed/russian_market_deep_dives.csv`');
lines.push('- `data_processed/russian_paid_flow_dossiers.csv`');
lines.push('- `data_processed/russian_whitespace_decision_map.csv`');
lines.push('- `data_processed/russian_claim_evidence_appendix.csv`');
lines.push('- `data_processed/russian_source_provenance_index.csv`');
lines.push('- `data_processed/russian_competitor_battlecards.csv`');
lines.push('- `data_processed/russian_icp_battlecards.csv`');
lines.push('- `data_processed/russian_icp_interview_dossiers.csv`');
lines.push('- `data_processed/russian_voc_objection_map.csv`');
lines.push('- `data_processed/russian_product_loop_cards.csv`');
lines.push('- `data_processed/russian_prototype_session_dossiers.csv`');
lines.push('- `data_processed/russian_validation_gate_cards.csv`');
lines.push('- `data_processed/russian_p0_execution_packet.csv`');
lines.push('- `data_processed/russian_observed_evidence_ladder.csv`');
lines.push('- `data_processed/russian_validation_runway.csv`');
lines.push('- `data_processed/russian_p0_walkthrough_dossiers.csv`');
lines.push('- `data_processed/russian_validation_fieldbook.csv`');
lines.push('- `data_processed/validation_tranche_planner.csv`');
lines.push('- `data_processed/validation_tranche_briefing_index.csv`');
lines.push('- `data_processed/validation_gate_calculator.csv`');
lines.push('- `reports/alina-russian-narrative-report-v1.md`');
lines.push('- `output/pdf/alina-russian-narrative-report-v1.pdf`');

fs.writeFileSync(OUT, `${lines.join('\n')}\n`);

console.log(`russian_narrative_report=${OUT}`);
console.log(`cross_source_dedup=${crossSourceDedup.length}`);
console.log(`reddit_capture_rows=${redditCapture.length}`);
console.log(`completion_rows=${completion.length}`);
