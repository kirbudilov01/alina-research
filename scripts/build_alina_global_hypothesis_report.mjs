import fs from 'fs';

const OUT = 'reports/alina-global-hypothesis-report-v1.md';

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
const paidSignoff = csv('data_processed/paid_flow_local_signoff.csv');
const tam = csv('data_processed/tam_sam_som_model.csv');
const manifest = csv('data_processed/evidence_artifact_manifest.csv');

const intersection = by(tam, 'pillar', 'intersection');
const p0Icp = icp.filter(row => clean(row.priority_ru).startsWith('P0'));
const topCompetitors = competitors.slice(0, 12);
const h2 = by(gates, 'gate_id', 'GATE_H2_PAID_FLOW');

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
lines.push(`На текущем этапе собрано ${fmt(rawRows.length)} raw source rows, ${fmt(dedupRows.length)} dedup rows и ${fmt(manifest.length)} локальных артефактов. Эти данные нужны не для того, чтобы объявить продукт доказанным, а для последовательной проверки: существует ли рынок, есть ли деньги, насколько плотна конкуренция, где может быть белое пятно, кто аудитория и какую MVP-петлю надо тестировать.`);
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
  money: row.money_verdict,
  score: row.money_score,
  boundary: row.boundary_ru
})), [
  { key: 'market', label: 'Рынок' },
  { key: 'sam', label: 'SAM base', align: 'right' },
  { key: 'money', label: 'Money verdict' },
  { key: 'score', label: 'Score', align: 'right' },
  { key: 'boundary', label: 'Граница' }
]));
lines.push('');
lines.push(`Intersection SAM в текущей модели равен ${money(intersection.samBase)}. Это рабочая мировая рамка для дальнейшей проверки, а не обещание revenue. Локальный paid-flow signoff сейчас заполнен на ${fmt(paidSignoff.length)} строках; H2 gate имеет статус ${h2.gate_status || 'unknown'}, потому что нужны еще in-app paywall walkthrough и willingness-to-pay evidence.`);
lines.push('');
lines.push('## СЦЕНАРИИ ВХОДА КАК СВЯЗУЮЩЕЕ ЗВЕНО');
lines.push('');
lines.push('В отличие от образца по Telegram-mini-app, здесь сценарии входа не завязаны на один канал. Для Alina логичнее рассматривать несколько мировых consumer-entry сценариев. Первый сценарий - пользователь приходит из состояния тревоги, усталости или перегруза и ищет короткий reset. Второй сценарий - пользователь приходит из self-improvement контекста: он хочет двигаться вперед, но устал от жестких streak и сложных систем. Третий сценарий - пользователь приходит из spiritual/meaning контекста и хочет не просто читать интерпретацию, а превратить ее в действие. Четвертый сценарий - пользователь приходит через avatar/identity интерес и хочет видеть, что версия себя меняется. Пятый сценарий - пользователь возвращается через мягкую progression-механику, если она не выглядит как манипулятивная игра.');
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
  money: row.revenue_proxy_band,
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
lines.push('## БЫСТРЫЕ ВЫВОДЫ ДЛЯ СТРАТЕГИИ');
lines.push('');
lines.push('1. Мировой рынок вокруг Alina есть, но его нельзя сводить к одному TAM: это пересечение mindfulness, coaching, astrology/spiritual guidance, avatar/identity и progression mechanics.');
lines.push('2. Продуктовая ставка должна быть узкой: ежедневная причинная петля, а не комбайн функций.');
lines.push('3. Самые важные проверки - hidden-clone walkthrough, paid-flow signoff, P0 ICP interviews и prototype sessions.');
lines.push('4. Отчет должен оставаться на русском языке, но описывать мировой рынок и глобальные consumer-app категории.');
lines.push('5. Финальный документ можно собирать в стиле предоставленного образца: гипотеза -> рынки -> конкуренты -> интервью -> уточнение гипотезы -> MVP -> вопросы -> вывод.');
lines.push('');
lines.push('## Локальные файлы');
lines.push('');
lines.push('- `reports/alina-global-hypothesis-report-v1.md`');
lines.push('- `output/pdf/alina-global-hypothesis-report-v1.pdf`');
lines.push('- `reports/alina-russian-readable-report-v2.md`');
lines.push('- `data_processed/russian_readable_niche_summary.csv`');
lines.push('- `data_processed/validation_gate_calculator.csv`');

fs.writeFileSync(OUT, `${lines.join('\n')}\n`);

console.log(`global_hypothesis_report=${OUT}`);
console.log(`raw_rows=${rawRows.length}`);
console.log(`dedup_rows=${dedupRows.length}`);
console.log(`markets=${nicheSummary.length}`);
