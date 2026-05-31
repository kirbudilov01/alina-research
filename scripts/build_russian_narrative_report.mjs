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
  { key: 'directional_money_score', label: 'Score', align: 'right' },
  { key: 'claim_boundary', label: 'Граница утверждения' }
], 8));
lines.push('');
lines.push(`Для intersection-модели базовый SAM в текущей модели: ${money(intersection.samBase)}. Эту цифру нельзя читать как прогноз выручки. Ее корректнее читать как рамку: если удастся доказать продуктовую петлю, есть достаточно большой соседний платежный контекст, чтобы продолжать работу.`);
lines.push('');
lines.push('## 3. Конкурентная плотность: рынок большой, но не пустой');
lines.push('');
lines.push(`В top-100 review найдено ${primaryTop100.length} unique primary apps. Из них ${highThreat.length} выглядят high-threat, а direct reference competitor сейчас ${directReference.length}. Это означает, что пространство не пустое: пользователи уже решают куски задачи через meditation apps, habit apps, AI companions, astrology apps, avatar tools и game-like progression products.`);
lines.push('');
lines.push(`Самый важный нюанс: широкие категории заняты, но строгий сигнал behavior-tied avatar/progress progression найден только в ${behaviorTied.length}/100 top-candidate rows. Поэтому белое пятно формулируется узко: не "сделать все сразу", а проверить, действительно ли редка петля meaning -> action -> reset -> visible identity/progress feedback -> next-day return.`);
lines.push('');
lines.push(`Manual inspection packet уже выделяет ${manualPacket.length} P0 приложений для walkthrough, а public listing inspection покрывает ${publicListing.length} публичных листингов. Но это еще не закрывает вопрос: публичные описания могут скрывать реальные onboarding/paywall/product-loop детали. Поэтому H1 и H3 остаются в статусе hold/validate.`);
lines.push('');
lines.push('## 4. Белое пятно: что именно может быть новым');
lines.push('');
lines.push('Белое пятно не в том, что нет медитаций, нет привычек, нет коучинга или нет аватаров. Все это есть. Потенциальная возможность появляется на стыке: пользователю не просто дают контент или список задач, а помогают каждый день прожить маленький цикл изменения. Сначала он получает персональный смысл или отражение состояния. Потом выбирает одно реальное действие. Потом делает короткий reset. После завершения действия видит, что его прогресс или образ себя изменился не произвольно, а причинно связан с действием.');
lines.push('');
lines.push(`В whitespace matrix сейчас ${whitespace.length} строк. Cross-source saturation держит gaming/progression скорее как benchmark, а не как прямой основной рынок. Это здоровая осторожность: игровые механики полезны как язык мотивации, но если Alina будет выглядеть как retention-game без личного смысла, гипотеза сломается.`);
lines.push('');
lines.push(mdTable(saturation, [
  { key: 'market', label: 'Рынок' },
  { key: 'opportunity_band', label: 'Opportunity band' },
  { key: 'interpretation', label: 'Интерпретация' }
], 8));
lines.push('');
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
lines.push('## 10. Финальный текущий verdict');
lines.push('');
lines.push('Текущий verdict: продолжать, но не переобещать. Alina выглядит как исследовательски перспективная ставка на стыке digital ritual, self-improvement, reset и identity/progress feedback. Самая сильная формулировка возможности: не универсальный комбайн, а короткая ежедневная трансформационная петля, где действие меняет видимый образ прогресса. Самая большая опасность: сделать слишком широкий продукт, который будет одновременно слабым meditation app, слабым habit tracker, слабым astrology app и слабым avatar toy. Поэтому следующий этап должен быть не расширением ради расширения, а жесткой проверкой центральной петли на реальных конкурентных экранах и реальных людях.');
lines.push('');
lines.push('## Ключевые локальные файлы');
lines.push('');
lines.push('- `data_processed/evidence_artifact_manifest.csv`');
lines.push('- `data_processed/research_completion_audit.csv`');
lines.push('- `data_processed/evidence_claim_register.csv`');
lines.push('- `data_processed/reddit_manual_reading_capture_sheet.csv`');
lines.push('- `data_processed/russian_narrative_evidence_map.csv`');
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
