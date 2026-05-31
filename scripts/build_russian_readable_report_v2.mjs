import fs from 'fs';

const OUT = 'reports/alina-russian-readable-report-v2.md';

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

function mdTable(rows, columns, limit = rows.length) {
  const limited = rows.slice(0, limit);
  const header = `| ${columns.map(c => c.label).join(' | ')} |`;
  const sep = `| ${columns.map(c => c.align === 'right' ? '---:' : '---').join(' | ')} |`;
  const body = limited.map(row => `| ${columns.map(c => clean(row[c.key]).replace(/\|/g, '/')).join(' | ')} |`);
  return [header, sep, ...body].join('\n');
}

function by(rows, key, value) {
  return rows.find(row => row[key] === value) || {};
}

function sum(rows, key) {
  return rows.reduce((acc, row) => acc + num(row[key]), 0);
}

function top(rows, key, limit = 3) {
  return rows
    .slice()
    .sort((a, b) => num(b[key]) - num(a[key]))
    .slice(0, limit);
}

const crossSummary = csv('data_processed/cross_source_universe_summary.csv');
const rawRows = csv('data_processed/cross_source_universe_raw.csv');
const dedupRows = csv('data_processed/cross_source_universe_dedup.csv');
const marketDeepDives = csv('data_processed/russian_market_deep_dives.csv');
const marketMoney = csv('data_processed/market_money_triangulation.csv');
const tam = csv('data_processed/tam_sam_som_model.csv');
const whitespaceMap = csv('data_processed/russian_whitespace_decision_map.csv');
const competitorBattlecards = csv('data_processed/russian_competitor_battlecards.csv');
const icpBattlecards = csv('data_processed/russian_icp_battlecards.csv');
const vocMap = csv('data_processed/russian_voc_objection_map.csv');
const productLoop = csv('data_processed/russian_product_loop_cards.csv');
const gates = csv('data_processed/validation_gate_calculator.csv');
const paidSignoff = csv('data_processed/paid_flow_local_signoff.csv');
const manifest = csv('data_processed/evidence_artifact_manifest.csv');
const sourceScale = csv('data_processed/source_scale_milestone.csv');
const top100 = csv('data_processed/top100_competitor_review_scorecard.csv');
const manualPacket = csv('data_processed/manual_competitor_inspection_packet.csv');
const redditSignals = csv('data_processed/reddit_mention_signal_matrix.csv');
const redditQueue = csv('data_processed/reddit_manual_reading_queue.csv');

const nicheRows = crossSummary.filter(row => row.summary_type === 'niche');
const sourceRows = crossSummary.filter(row => row.summary_type === 'source_group');
const directAppSources = sourceRows.filter(row => ['mobile_app_store', 'google_play_or_android', 'desktop_store', 'browser_extension'].includes(row.segment));
const directRaw = sum(directAppSources, 'raw_rows');
const directDedup = sum(directAppSources, 'dedup_rows');
const raw50 = by(sourceScale, 'milestone_id', 'RAW_50K_SOURCE_SCALE');
const dedup30 = by(sourceScale, 'milestone_id', 'DEDUP_30K_LOWER_BOUND');
const dedup50 = by(sourceScale, 'milestone_id', 'DEDUP_50K_UPPER_ASPIRATION');
const intersection = by(tam, 'pillar', 'intersection');
const strongMoney = marketMoney.filter(row => row.money_triangulation_verdict === 'strong_directional_money_case');
const mediumMoney = marketMoney.filter(row => row.money_triangulation_verdict === 'medium_directional_money_case');
const primaryTop100 = top100.filter(row => row.duplicate_flag === 'primary_app_entry');
const highThreat = primaryTop100.filter(row => num(row.competitive_threat_score) >= 24);
const behaviorTied = top100.filter(row => row.behavior_tied_progression === 'yes');
const p0Icp = icpBattlecards.filter(row => clean(row.priority_ru).startsWith('P0'));
const gateSummary = gates.map(row => `${row.gate_id}: ${row.gate_status || row.status || 'unknown'}`).join('; ');

const nicheName = {
  mindfulness: 'Mindfulness / reset',
  avatar_identity: 'Avatar / identity',
  astrology_esoterics: 'Astrology / esoterics',
  coaching: 'Coaching / self-improvement',
  gaming: 'Gaming / progression mechanics',
  gaming_progression: 'Gaming progression sub-layer'
};

const lines = [];

lines.push('# Alina Research. Читаемая русская версия V2');
lines.push('');
lines.push(`Собрано: ${new Date().toISOString()}`);
lines.push('');
lines.push('## Короткий вывод');
lines.push('');
lines.push('Alina пока нельзя честно называть доказанным продуктом, но ее стоит продолжать исследовать. Вокруг идеи уже виден большой соседний рынок: люди платят за mindfulness, коучинг, astrology/spiritual guidance, аватары/AI companions и игровые механики прогресса. При этом сама возможность для Alina находится не в одной из этих категорий, а на пересечении: короткая ежедневная петля, где личный смысл превращается в одно действие, действие дает reset, а результат становится видимым через прогресс, идентичность или аватар.');
lines.push('');
lines.push(`Главное, что сейчас есть: ${fmt(rawRows.length)} raw source rows, ${fmt(dedupRows.length)} dedup rows, ${fmt(manifest.length)} локальных артефакта в manifest и ${fmt(primaryTop100.length)} первичных приложений в top-100 конкурентном разборе. Это уже не маленький ресерч на несколько тысяч строк. Но это все еще desk/source evidence, а не финальная пользовательская валидация. Поэтому вывод аккуратный: идея выглядит перспективной, но следующие решения должны приниматься после ручного walkthrough конкурентов, проверки paywall и коротких прототипных сессий.`);
lines.push('');
lines.push('## 1. Что мы проверяем');
lines.push('');
lines.push('Исходная гипотеза простая: пользователю может быть нужен не отдельный трекер, не библиотека медитаций и не очередной аватар-генератор, а ежедневный цифровой ритуал изменения. В идеальном сценарии человек открывает приложение, получает персональное отражение дня, выбирает одно маленькое действие, быстро возвращает себя в рабочее состояние и видит, что прогресс или образ себя изменился именно из-за сделанного шага.');
lines.push('');
lines.push('Поэтому исследование разложено на пять основных направлений. Mindfulness отвечает за reset и calm. Coaching/self-improvement отвечает за действие и структуру роста. Astrology/esoterics отвечает за личный смысл и символический язык. Avatar/identity отвечает за видимый образ изменения. Gaming/progression не считается прямым рынком Alina, но нужен как источник retention и прогресс-механик.');
lines.push('');
lines.push('## 2. Сколько приложений и источников взяли по нишам');
lines.push('');
lines.push('Ниже - самая важная таблица для ориентации. Raw rows показывают общий объем собранных строк из источников. Dedup rows - очищенную рабочую базу после снятия дублей. Это не значит, что каждая строка является прямым конкурентом Alina: часть gaming/Steam/itch строк используется как benchmark механик, а Reddit/forum строки используются как язык боли и контекст.');
lines.push('');
lines.push(mdTable(nicheRows.map(row => ({
  niche: nicheName[row.segment] || row.segment,
  raw: fmt(row.raw_rows),
  dedup: fmt(row.dedup_rows),
  ok: fmt(row.ok_rows),
  read: row.segment === 'gaming' || row.segment === 'gaming_progression'
    ? 'benchmark механик, не прямой TAM'
    : 'adjacent рынок для конкурентной карты'
})), [
  { key: 'niche', label: 'Ниша' },
  { key: 'raw', label: 'Raw rows', align: 'right' },
  { key: 'dedup', label: 'Dedup rows', align: 'right' },
  { key: 'ok', label: 'OK rows', align: 'right' },
  { key: 'read', label: 'Как читать' }
]));
lines.push('');
lines.push(`Если смотреть только на более прямые source-native каналы приложений и витрин - App Store, Google Play/Android, desktop stores и browser extensions - там сейчас ${fmt(directRaw)} raw rows и ${fmt(directDedup)} dedup rows. Остальной объем дает более широкий discovery слой: Steam/itch для механик, Reddit/forum для языка аудитории и дополнительные source lanes для насыщения карты.`);
lines.push('');
lines.push(`По масштабу граница такая: ${raw50.status === 'proved' ? `raw 50k уже закрыт (${fmt(raw50.metric_value)} строк)` : 'raw 50k еще не закрыт'}, ${dedup30.status === 'proved' ? `dedup 30k+ закрыт (${fmt(dedup30.metric_value)} строк)` : 'dedup 30k+ еще открыт'}, а dedup 50k остается целью следующего расширения (${dedup50.status || 'open'}, gap сохраняется). Поэтому правильная формулировка: у нас есть большая карта источников, но не 50k вручную проверенных прямых конкурентов.`);
lines.push('');
lines.push('## 3. Что видно по рынкам и деньгам');
lines.push('');
lines.push('Деньги в соседних рынках видны, но пока как направленный сигнал. Сильнее всего выглядят astrology apps, AI/avatar identity и meditation/mindfulness. Digital coaching тоже важен, но требует более аккуратной проверки, потому что часть рынка уходит в B2B, human coaching и broad productivity.');
lines.push('');
lines.push(mdTable(marketDeepDives.map(row => ({
  market: row.ru_name,
  sam: money(row.sam_base_usd),
  dedup: fmt(row.cross_source_dedup_rows),
  money: row.money_verdict,
  competitors: fmt(row.top100_primary_competitors),
  verdict: row.verdict_ru
})), [
  { key: 'market', label: 'Рынок' },
  { key: 'sam', label: 'SAM base', align: 'right' },
  { key: 'dedup', label: 'Dedup rows', align: 'right' },
  { key: 'money', label: 'Деньги' },
  { key: 'competitors', label: 'Top-100 apps', align: 'right' },
  { key: 'verdict', label: 'Вывод' }
]));
lines.push('');
lines.push(`В текущей модели intersection SAM равен ${money(intersection.samBase)}. Это не прогноз выручки Alina. Это рабочая рамка: рядом есть достаточно большой платежный контекст, чтобы проверять продукт дальше. Сейчас ${strongMoney.length} рынков имеют strong directional money case, ${mediumMoney.length} рынок имеет medium directional money case, а локальный paid-flow signoff заполнен на ${paidSignoff.length} строках. Самый важный нюанс: Character AI/c.ai+ подтверждает публичную платную поверхность в AI companion/avatar-identity зоне, а Meditopia подтверждает скорее B2B/EAP wellness pricing, не прямой consumer paywall.`);
lines.push('');
lines.push('## 4. Что видно по конкурентам');
lines.push('');
lines.push(`Конкурентная среда не пустая. В top-100 review сейчас ${fmt(primaryTop100.length)} primary apps, из них ${fmt(highThreat.length)} выглядят high-threat. Это значит, что пользователь уже решает части задачи через существующие приложения: медитации, привычки, коучинг, дневники, AI companions, astrology apps, avatar tools и игровые progress loops.`);
lines.push('');
lines.push(`Но строгий сигнал полной петли Alina пока редкий: behavior-tied progression найден в ${behaviorTied.length}/100 top-candidate rows. Это важный, но не финальный аргумент. Публичные листинги могут скрывать настоящую логику продукта внутри onboarding, первого действия или paywall, поэтому ${fmt(manualPacket.length)} P0 конкурентов вынесены в ручной walkthrough.`);
lines.push('');
lines.push(mdTable(competitorBattlecards.slice(0, 12).map(row => ({
  app: row.app_name,
  risk: row.threat_ru,
  priority: row.validation_priority_score,
  money: row.revenue_proxy_band,
  check: row.behavior_tied_progression_prefill === 'yes' ? 'проверить первым' : 'проверить causality'
})), [
  { key: 'app', label: 'Конкурент' },
  { key: 'risk', label: 'Риск' },
  { key: 'priority', label: 'Priority', align: 'right' },
  { key: 'money', label: 'Money proxy' },
  { key: 'check', label: 'Что проверить' }
]));
lines.push('');
lines.push('Самый опасный ранний конкурент - Shepherd: Spiritual Bible BFF. Если ручной walkthrough покажет, что он уже закрывает петлю meaning -> action -> reset -> visible identity/progress -> return, белое пятно придется резко сузить. Если нет, он останется важным reference competitor, но не убьет гипотезу.');
lines.push('');
lines.push('## 5. Где может быть белое пятно');
lines.push('');
lines.push('Белое пятно не в том, что на рынке нет медитаций, привычек, коучинга или аватаров. Они есть, и их много. Возможность появляется только в узкой комбинации: личное отражение дня должно превращаться в одно действие, действие должно быть достаточно маленьким, reset должен снижать трение, а avatar/progress должен меняться причинно, не декоративно.');
lines.push('');
lines.push(mdTable(whitespaceMap.map(row => ({
  niche: nicheName[row.niche] || row.niche,
  dedup: fmt(row.cross_source_dedup_rows),
  loop: pct(row.full_loop_rate_pct),
  band: row.opportunity_read_ru,
  h3: row.h3_decision_read_ru
})), [
  { key: 'niche', label: 'Ниша' },
  { key: 'dedup', label: 'Dedup rows', align: 'right' },
  { key: 'loop', label: 'Full-loop rate', align: 'right' },
  { key: 'band', label: 'Opportunity' },
  { key: 'h3', label: 'Как читать' }
]));
lines.push('');
lines.push('Пока сильнее всего выглядит не широкий claim “рынок пустой”, а более точная формулировка: полный цикл Alina в публичных данных встречается редко, особенно в mindfulness и avatar/identity, но это нужно подтвердить экранами. Gaming дает полезный язык прогресса, но его нельзя использовать как прямое доказательство рынка Alina.');
lines.push('');
lines.push('## 6. Кто может быть аудиторией');
lines.push('');
lines.push('Самая полезная аудитория сейчас описывается не демографией, а поведением: digital ritual users. Это люди, которые уже используют приложения, чтобы регулировать состояние, видеть движение вперед, чувствовать личный смысл, возвращаться к практике и иногда платить за глубину, персонализацию или поддержку.');
lines.push('');
lines.push(mdTable(icpBattlecards.map(row => ({
  segment: row.segment_name,
  priority: row.priority_ru,
  score: row.evidence_score,
  audience: fmt(row.audience_signal_rows),
  reddit: fmt(row.reddit_signal_rows),
  job: row.core_job_ru
})), [
  { key: 'segment', label: 'Сегмент' },
  { key: 'priority', label: 'Приоритет' },
  { key: 'score', label: 'Score', align: 'right' },
  { key: 'audience', label: 'Audience rows', align: 'right' },
  { key: 'reddit', label: 'Reddit rows', align: 'right' },
  { key: 'job', label: 'Core job' }
]));
lines.push('');
lines.push(`Первые два сегмента для проверки: ${p0Icp.map(row => row.segment_name).join(' и ') || 'нет данных'}. Первый нужен, чтобы проверить personal meaning -> action. Второй нужен, чтобы проверить, может ли мягкий видимый прогресс заменить обычный checklist/streak pressure. Остальные сегменты полезны как сравнение, но выбирать primary ICP без интервью пока нельзя.`);
lines.push('');
lines.push('## 7. Как звучат боли пользователей');
lines.push('');
lines.push(`Reddit/forum слой сейчас дает ${fmt(redditSignals.length)} coded signal rows и ${fmt(redditQueue.length)} треда в manual reading queue. Это не репрезентативный опрос и не доказательство спроса. Его роль другая: дать язык проблем, альтернатив и возражений, чтобы интервью не были абстрактными.`);
lines.push('');
lines.push(mdTable(top(vocMap, 'evidence_rows', 8).map(row => ({
  theme: row.theme_ru,
  signals: fmt(row.evidence_rows),
  probe: row.interview_probe_ru
})), [
  { key: 'theme', label: 'Тема' },
  { key: 'signals', label: 'Signals', align: 'right' },
  { key: 'probe', label: 'Вопрос для интервью' }
]));
lines.push('');
lines.push('Главный риск из этого слоя: пользователи могут отвергнуть продукт, если он покажется манипулятивным, слишком эзотерическим, слишком игровым или просто еще одним тяжелым self-improvement инструментом. Поэтому в прототипе надо проверять не только “понравилось ли”, а понял ли человек причинность петли и захотел ли бы вернуться завтра.');
lines.push('');
lines.push('## 8. Каким сейчас выглядит продуктовое ядро');
lines.push('');
lines.push('Рабочее ядро Alina сейчас можно описать так: “одно персональное отражение, одно маленькое действие, короткий reset, видимый причинный прогресс и мягкий следующий шаг”. Это достаточно узко, чтобы тестировать, и достаточно отличается от обычной библиотеки контента.');
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
lines.push('Слабое место этой петли - avatar/progress feedback. Если пользователь не понимает, что изменение связано с действием, это станет декоративной игрушкой. Если понимает и чувствует, что действие стало видимым, это может стать главным отличием Alina от meditation app, habit tracker и vague spiritual reading.');
lines.push('');
lines.push('## 9. Что доказано и что еще открыто');
lines.push('');
lines.push('На сегодня доказано как исследовательский слой: большая база источников, пять направлений, рыночная модель, конкурентные матрицы, whitespace map, ICP hypotheses, продуктовая петля и локальная трассируемость файлов. Не доказано как validation proof: что пользователи выберут Alina, что они поймут причинность avatar/progress, что готовы платить, и что конкуренты не закрывают этот цикл внутри приложения.');
lines.push('');
lines.push(mdTable(gates.map(row => ({
  gate: row.gate_id,
  status: row.gate_status || row.status || 'unknown',
  required: row.required_capture_rows || row.required || '',
  done: row.completed_rows || row.completed || '',
  success: row.success_rows || row.success || '',
  next: row.next_action || row.next_action_ru || ''
})), [
  { key: 'gate', label: 'Gate' },
  { key: 'status', label: 'Status' },
  { key: 'required', label: 'Need', align: 'right' },
  { key: 'done', label: 'Done', align: 'right' },
  { key: 'success', label: 'Success', align: 'right' },
  { key: 'next', label: 'Следующий шаг' }
]));
lines.push('');
lines.push(`Технический статус gates: ${gateSummary}. Если где-то уже есть локальные observed rows, это нужно читать как in-progress, а не как финальный pass. Для финального решения нужны одинаково заполненные capture rows, screenshots/quotes/scorecard values, пересборка отчета и сохранение в Git.`);
lines.push('');
lines.push('## 10. Что делать дальше');
lines.push('');
lines.push('Следующий этап лучше не расширять бесконечно, а закрыть самые опасные проверки. Сначала пройти Shepherd и top-5 конкурентов: listing, onboarding, first action, progress/avatar feedback, paywall. Затем расширить paid-flow signoff по самым сильным money proxy. Затем провести короткий ICP pilot по Spiritual self-improvers и Habit/progress users. После этого показать прототипную петлю и проверить, понимают ли люди action -> avatar/progress causality.');
lines.push('');
lines.push('Если первые проверки усиливают гипотезу, можно расширять sampling и делать PDF более внешним. Если Shepherd или другой P0 конкурент уже владеет полной петлей, отчет должен стать слабее и точнее. Если пользователи читают аватар как детскую декорацию или манипуляцию, продуктовую ставку нужно менять до дальнейшего масштабирования.');
lines.push('');
lines.push('## Локальные файлы');
lines.push('');
lines.push('- `reports/alina-russian-readable-report-v2.md`');
lines.push('- `output/pdf/alina-russian-readable-report-v2.pdf`');
lines.push('- `reports/alina-russian-narrative-report-v1.md`');
lines.push('- `output/pdf/alina-russian-narrative-report-v1.pdf`');
lines.push('- `data_processed/cross_source_universe_summary.csv`');
lines.push('- `data_processed/russian_market_deep_dives.csv`');
lines.push('- `data_processed/russian_whitespace_decision_map.csv`');
lines.push('- `data_processed/russian_icp_battlecards.csv`');
lines.push('- `data_processed/validation_gate_calculator.csv`');

fs.writeFileSync(OUT, `${lines.join('\n')}\n`);

console.log(`russian_readable_report=${OUT}`);
console.log(`raw_rows=${rawRows.length}`);
console.log(`dedup_rows=${dedupRows.length}`);
console.log(`niches=${nicheRows.length}`);
console.log(`direct_source_raw=${directRaw}`);
console.log(`direct_source_dedup=${directDedup}`);
