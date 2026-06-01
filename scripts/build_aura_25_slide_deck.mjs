import fs from 'fs';
import path from 'path';
import { spawnSync } from 'child_process';

const ROOT = process.cwd();
const THREAD_ID = process.env.CODEX_THREAD_ID || `manual-${Date.now().toString(36)}`;
const WORKSPACE = path.join(ROOT, 'tmp', 'presentations', THREAD_ID, 'aura-25-slides');
const SLIDES_DIR = path.join(WORKSPACE, 'slides');
const PREVIEW_DIR = path.join(WORKSPACE, 'preview');
const LAYOUT_DIR = path.join(WORKSPACE, 'layout');
const OUTPUT_DIR = path.join(ROOT, 'output', 'pptx');
const PLAN_OUT = path.join(ROOT, 'reports', 'aura-presentation-25-slides.md');
const PPTX_OUT = path.join(OUTPUT_DIR, 'AURA_PRODUCT_MASTER_PLAN_25_SLIDES.pptx');
const CONTACT_SHEET = path.join(OUTPUT_DIR, 'AURA_PRODUCT_MASTER_PLAN_25_SLIDES_CONTACT_SHEET.png');

const BUILDER = '/Users/kirill/.codex/plugins/cache/openai-primary-runtime/presentations/26.521.10419/skills/presentations/scripts/build_artifact_deck.mjs';
const NODE = '/Users/kirill/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node';

const slides = [
  {
    title: 'AURA: продуктовая система, а не AI-картинка',
    thesis: ['AURA превращает личный контекст в ежедневный эпизод, действие и видимый след.', 'Центральная проверка: пользователь должен понять, почему изменился Life Canvas.', 'Если картинка кажется случайной, продукт теряет смысл.', 'Если картинка считывается как след действия, появляется новая категория.'],
    visual: 'Core loop diagram',
    understand: 'AURA держится на причинной петле Episode → Action → Reset → Reflection → Life Canvas → Tomorrow Hook.',
    type: 'loop'
  },
  {
    title: 'Почему проект существует сейчас',
    thesis: ['Рынок уже платит за self-care, смысл, progress, coaching и AI-визуализацию.', 'Но эти категории часто живут отдельно.', 'Пользователь получает либо смысл без действия, либо действие без образа, либо образ без причинности.', 'AURA собирает эти фрагменты в один ежедневный ритуал.'],
    visual: 'Category intersection',
    understand: 'AURA не нужно создавать спрос с нуля; нужно соединить существующие спросы в новую форму.',
    type: 'intersection'
  },
  {
    title: 'Пять категорий дают пять слоев продукта',
    thesis: ['Mindfulness дает reset и эмоциональный вход.', 'Astrology/self-discovery дает язык личного смысла.', 'Coaching и habits дают действие и accountability.', 'Avatar/identity дает видимый образ изменения.', 'Gaming/progression дает возврат и накопление.'],
    visual: 'Category → product-layer map',
    understand: 'Рынки важны не как цифры сами по себе, а как источники функций AURA.',
    type: 'layers'
  },
  {
    title: 'Белое пятно не в отсутствии конкурентов',
    thesis: ['Конкурентов много, и это хороший сигнал спроса.', 'Проблема не в том, что никто не делает self-care или avatars.', 'Проблема в разрыве петли: у одних есть meaning, у других action, у третьих avatar.', 'AURA должна выиграть не функцией, а причинной сборкой.'],
    visual: 'Competitor white-space matrix',
    understand: 'AURA конкурирует не шириной функций, а связью между смыслом, действием и видимым следом.',
    type: 'matrix'
  },
  {
    title: 'AURA не должна стать astrology app',
    thesis: ['Дата рождения может быть символическим входом, но не обещанием судьбы.', 'Опасность astrology-позиционирования — скепсис и узкая категория.', 'AURA использует личный смысл как начало действия, а не как финальный прогноз.', 'Тон должен быть взрослым: без эзотерического пафоса и абсолютных обещаний.'],
    visual: 'Do / Don’t positioning frame',
    understand: 'AURA берет из astrology персональный смысл, но не становится гороскопом.',
    type: 'dont'
  },
  {
    title: 'AURA не должна стать avatar app',
    thesis: ['AI-картинка сама по себе быстро становится декоративной.', 'Life Canvas должен отвечать на вопрос: что изменилось из-за действия?', 'Визуал работает только как доказательство внутреннего движения.', 'Поэтому image-first можно, video-first нельзя до проверки экономики и retention.'],
    visual: 'Random image vs causal Life Canvas',
    understand: 'Главная ценность образа — причинность, а не красота генерации.',
    type: 'cause'
  },
  {
    title: 'AURA не должна стать habit tracker',
    thesis: ['Habit trackers сильны в действии, но часто сухие эмоционально.', 'AURA не продает streak как самоцель.', 'Маленькое действие должно быть продолжением эпизода, а не задачей из списка.', 'Progress должен ощущаться как история, а не как галочка.'],
    visual: 'Habit tracker vs personal life series',
    understand: 'AURA берет action-discipline, но превращает ее в эмоциональный story loop.',
    type: 'compare'
  },
  {
    title: 'Первые аудитории: где искать pull',
    thesis: ['Spiritual self-improvers дают спрос на смысл.', 'Habit/progress users дают спрос на действие и видимый результат.', 'Reset users дают вход через состояние и короткий ритуал.', 'Avatar/future-self users проверяют визуальную мотивацию.'],
    visual: 'Segment map',
    understand: 'Первые сегменты выбираются не по демографии, а по близости к центральной петле.',
    type: 'segments'
  },
  {
    title: 'Day 1: момент, где идея становится продуктом',
    thesis: ['Welcome объясняет категорию.', 'Consent создает доверие к личным данным.', 'Profile дает контекст.', 'Episode и Action ведут к первому шагу.', 'Life Canvas показывает след и открывает Tomorrow Hook.'],
    visual: 'Day 1 journey map',
    understand: 'Первый день должен довести пользователя до причинного visual moment.',
    type: 'journey'
  },
  {
    title: 'Ценность должна накапливаться',
    thesis: ['Day 1 доказывает первый loop.', 'Day 2 должен помнить Day 1.', 'Day 7 превращает действия в season recap.', 'Day 30 показывает траекторию, а не набор случайных карточек.'],
    visual: 'Day 1 / Day 2 / Day 7 / Day 30 timeline',
    understand: 'AURA становится продуктом, только если память усиливает ценность со временем.',
    type: 'timeline'
  },
  {
    title: 'Life Canvas: anatomy of causality',
    thesis: ['Action создает evidence.', 'Reflection добавляет эмоциональный контекст.', 'AI/image layer переводит evidence в visual trait.', 'Canvas должен объяснять изменение рядом с образом.', 'Без explanation визуал рискует стать random image.'],
    visual: 'Action → Evidence → Visual trait → Life Canvas',
    understand: 'Life Canvas — это система причинности, а не reward-картинка.',
    type: 'cause'
  },
  {
    title: 'Что входит в первый продукт',
    thesis: ['Must have: onboarding, season, episode, action, reset, reflection, Life Canvas, tomorrow hook.', 'Should have: memory, recap, notifications, paywall after value.', 'Could have: share card, style presets, voice reset.', 'Not first: video every day, marketplace, community, social network, AR.'],
    visual: 'Must / Should / Could / Not scope map',
    understand: 'Первый продукт защищен от расползания scope.',
    type: 'scope'
  },
  {
    title: 'Главные экраны AURA',
    thesis: ['10 ключевых экранов достаточно, чтобы проверить гипотезу.', 'Каждый экран отвечает за один переход в петле.', 'Paywall появляется только после value moment.', 'Settings и privacy нужны для доверия из-за персонального контекста.'],
    visual: 'Screen map',
    understand: 'Дизайнеру нужно рисовать не приложение целиком, а проверку центральной петли.',
    type: 'screens'
  },
  {
    title: 'Архитектура должна сохранять причинную цепочку',
    thesis: ['Mobile app показывает flow и собирает действия.', 'Backend хранит state transitions.', 'AI layer генерирует episode/action/reset safely.', 'Image layer создает Life Canvas.', 'Analytics доказывает loop, cost и return.'],
    visual: 'System architecture stack',
    understand: 'Техника обслуживает продуктовую причинность, а не просто генерирует контент.',
    type: 'stack'
  },
  {
    title: 'Data model: каждое действие должно иметь след',
    thesis: ['UserProfile задает контекст.', 'Season держит траекторию.', 'Episode создает смысл.', 'Action и Reflection создают evidence.', 'AvatarState связывает visual change с действием.'],
    visual: 'Entity relationship / data flow',
    understand: 'Если сущности не связаны, AURA распадается на несвязанные AI-выдачи.',
    type: 'data'
  },
  {
    title: 'No free daily video',
    thesis: ['Видео выглядит эффектно, но может убить экономику.', 'Image-first Life Canvas достаточно для проверки причинности.', 'Видео нужно тестировать позже как premium/token moment.', 'Cost logging обязателен с первого дня.'],
    visual: 'Cost stack with video warning',
    understand: 'Самое важное техническое решение — не дать красивому видео разрушить маржинальность.',
    type: 'cost'
  },
  {
    title: 'Unit economics: считать нужно completed loop',
    thesis: ['AI text, images, storage, analytics, support и infra формируют COGS.', 'Images быстро становятся ключевой переменной статьей.', 'Free users должны иметь ограниченный image budget.', 'Главная метрика — cost per completed loop and returned user.'],
    visual: 'Unit economics scale chart',
    understand: 'Экономика AURA должна считаться вокруг поведения, а не вокруг абстрактного MAU.',
    type: 'bars'
  },
  {
    title: 'Монетизация появляется после ценности',
    thesis: ['Нельзя продавать понимание себя до первого инсайта.', 'Paywall должен появляться после completed loop.', 'Aura Plus продает season continuation, memory, recap и styles.', 'Premium/video moments тестируются отдельно.'],
    visual: 'Free → Plus → Premium → Tokens ladder',
    understand: 'Платность должна усиливать уже понятную ценность, а не блокировать первый опыт.',
    type: 'ladder'
  },
  {
    title: 'Первые 100 пользователей не покупаются рекламой',
    thesis: ['Сначала нужны warm contacts и интервью.', 'Задача — не registration, а прохождение loop.', 'Concierge cohort дает язык, objections и реальные friction points.', 'Только после этого можно тестировать публичные каналы.'],
    visual: 'First 100 funnel',
    understand: 'GTM начинается как исследование поведения, а не как performance marketing.',
    type: 'funnel'
  },
  {
    title: 'Первые 1000: каналы играют разные роли',
    thesis: ['TikTok/Reels/Shorts дают discovery.', 'Creators дают доверие и демонстрацию опыта.', 'Reddit дает жесткую обратную связь.', 'Referral проверяет shareability Life Canvas.', 'Landing variants проверяют positioning.'],
    visual: 'Channel role map',
    understand: 'Каналы нужны для разных доказательств, а не для одного общего “охвата”.',
    type: 'channels'
  },
  {
    title: 'Контент должен повторять одну идею разными углами',
    thesis: ['Life series объясняет категорию.', 'Future self дает эмоциональный pull.', 'Avatar causality объясняет отличие от image apps.', 'Reset/action показывает практичность.', 'Build in public привлекает первых пользователей.'],
    visual: 'Content pillar wheel',
    understand: 'Контент AURA должен продавать причинную петлю, а не набор фич.',
    type: 'wheel'
  },
  {
    title: '30 дней до первого решения',
    thesis: ['Week 1: interviews and prototype.', 'Week 2: concierge season.', 'Week 3: content and creators.', 'Week 4: paid intent and cohort readout.', 'Цель — понять, строить, менять или остановить.'],
    visual: '30-day validation timeline',
    understand: 'Запуск должен быстро привести к решению, а не к бесконечной активности.',
    type: 'timeline'
  },
  {
    title: '5 спринтов: как построить первый продукт',
    thesis: ['Sprint 1: foundation and onboarding.', 'Sprint 2: episode, action, reset, reflection.', 'Sprint 3: Life Canvas and causality.', 'Sprint 4: return, memory, paywall.', 'Sprint 5: admin, analytics, QA, soft launch.'],
    visual: '5-sprint roadmap',
    understand: 'Команда строит доказательство петли, а не весь будущий продукт.',
    type: 'roadmap'
  },
  {
    title: 'Go / No-Go: решение принимает петля',
    thesis: ['Activation показывает, понятен ли вход.', 'Completed loop показывает, работает ли первый опыт.', 'Causality показывает, жив ли Life Canvas.', 'D1/D7 показывают retention.', 'Paid intent показывает коммерческий сигнал.'],
    visual: 'Go / No-Go dashboard',
    understand: 'AURA нельзя оценивать “по ощущениям”; решение должны принять метрики петли.',
    type: 'dashboard'
  },
  {
    title: 'Следующий шаг: Figma → prototype → interviews',
    thesis: ['Research достаточно, чтобы перестать спорить о рынке.', 'Теперь нужен low-fi prototype 10 ключевых экранов.', '20 интервью должны проверить язык, доверие и причинность.', '30 concierge users должны пройти season.', 'Если Life Canvas causality не считывается — продукт пересобирается.'],
    visual: 'Decision tree / next 30 days',
    understand: 'Главный риск AURA теперь находится внутри прототипа.',
    type: 'decision'
  }
];

function esc(s) {
  return String(s).replace(/`/g, '\\`').replace(/\$/g, '\\$');
}

function mdTable(rows, columns) {
  const header = `| ${columns.map(c => c.label).join(' | ')} |`;
  const sep = `| ${columns.map(() => '---').join(' | ')} |`;
  const body = rows.map(row => `| ${columns.map(c => String(row[c.key] ?? '').replace(/\n/g, '<br>').replace(/\|/g, '/')).join(' | ')} |`);
  return [header, sep, ...body].join('\n');
}

function writePlan() {
  const lines = ['# AURA Product Master Plan — 25 slides', ''];
  for (const [idx, slide] of slides.entries()) {
    lines.push(`## Слайд ${idx + 1}. ${slide.title}`);
    lines.push('');
    lines.push(`**Тезисы:**`);
    for (const t of slide.thesis) lines.push(`- ${t}`);
    lines.push('');
    lines.push(`**Визуализация:** ${slide.visual}`);
    lines.push('');
    lines.push(`**Что должен понять человек:** ${slide.understand}`);
    lines.push('');
  }
  fs.mkdirSync(path.dirname(PLAN_OUT), { recursive: true });
  fs.writeFileSync(PLAN_OUT, `${lines.join('\n').trimEnd()}\n`);
}

function sharedModule() {
  return `
const C = {
  ink: '#101828',
  muted: '#667085',
  line: '#D0D5DD',
  blue: '#2563EB',
  blueSoft: '#DBEAFE',
  green: '#16A34A',
  greenSoft: '#DCFCE7',
  yellowSoft: '#FEF3C7',
  purpleSoft: '#EDE9FE',
  redSoft: '#FEE2E2',
  bg: '#FBFAF7',
  card: '#FFFFFF'
};

export function base(slide, ctx, n, title, takeaway) {
  ctx.addShape(slide, { left: 0, top: 0, width: ctx.W, height: ctx.H, fill: C.bg });
  ctx.addText(slide, { text: 'AURA', left: 54, top: 30, width: 130, height: 24, fontSize: 16, bold: true, color: C.ink });
  ctx.addText(slide, { text: String(n).padStart(2, '0'), left: ctx.W - 96, top: 30, width: 42, height: 24, fontSize: 13, bold: true, color: C.muted, align: 'right' });
  ctx.addText(slide, { text: title, left: 54, top: 72, width: 620, height: 86, fontSize: 34, bold: true, color: C.ink, insets: { left: 0, right: 0, top: 0, bottom: 0 } });
  ctx.addShape(slide, { left: 54, top: ctx.H - 80, width: ctx.W - 108, height: 44, fill: '#F2F4F7', line: { style: 'solid', fill: '#E4E7EC', width: 1 } });
  ctx.addText(slide, { text: 'Что должен понять человек', left: 74, top: ctx.H - 72, width: 220, height: 14, fontSize: 10, bold: true, color: C.muted });
  ctx.addText(slide, { text: takeaway, left: 74, top: ctx.H - 56, width: ctx.W - 148, height: 28, fontSize: 15, bold: true, color: C.ink });
}

export function bullets(slide, ctx, items, x = 72, y = 172, w = 470) {
  items.forEach((item, i) => {
    const yy = y + i * 54;
    ctx.addShape(slide, { left: x, top: yy + 6, width: 8, height: 8, fill: C.blue, line: { style: 'solid', fill: C.blue, width: 0 } });
    ctx.addText(slide, { text: item, left: x + 22, top: yy, width: w, height: 44, fontSize: 16, color: C.ink });
  });
}

export function tag(slide, ctx, text, x, y, w, fill = C.blueSoft) {
  ctx.addShape(slide, { left: x, top: y, width: w, height: 38, fill, line: { style: 'solid', fill: '#BBD5FF', width: 1 } });
  ctx.addText(slide, { text, left: x + 10, top: y + 10, width: w - 20, height: 18, fontSize: 13, bold: true, color: C.ink, align: 'center' });
}

export function arrow(slide, ctx, x1, y1, x2, y2) {
  ctx.addShape(slide, { geometry: 'rect', left: x1, top: y1, width: Math.max(1, x2 - x1), height: 2, fill: C.blue, line: { style: 'solid', fill: C.blue, width: 0 } });
  ctx.addText(slide, { text: '→', left: x2 - 4, top: y2 - 13, width: 20, height: 20, fontSize: 18, bold: true, color: C.blue });
}

export function loopVisual(slide, ctx, x = 610, y = 210) {
  const labels = ['Episode', 'Action', 'Reset', 'Reflection', 'Life Canvas', 'Tomorrow Hook'];
  labels.forEach((label, i) => {
    const yy = y + i * 48;
    tag(slide, ctx, label, x, yy, 210, i === 4 ? C.greenSoft : C.blueSoft);
    if (i < labels.length - 1) ctx.addText(slide, { text: '↓', left: x + 95, top: yy + 35, width: 20, height: 20, fontSize: 18, bold: true, color: C.blue });
  });
}

export function visual(slide, ctx, type) {
  const x = 620, y = 170, w = 560, h = 360;
  ctx.addShape(slide, { left: x, top: y, width: w, height: h, fill: '#FFFFFF', line: { style: 'solid', fill: '#E4E7EC', width: 1 } });
  if (type === 'loop') {
    loopVisual(slide, ctx, x + 170, y + 36);
  } else if (type === 'intersection') {
    const cats = [['Mindfulness', 80, 70, C.blueSoft], ['Astrology', 230, 38, C.purpleSoft], ['Avatar', 380, 70, C.greenSoft], ['Coaching', 150, 210, C.yellowSoft], ['Progression', 320, 210, C.redSoft]];
    cats.forEach(([t, dx, dy, fill]) => tag(slide, ctx, t, x + dx, y + dy, 130, fill));
    ctx.addShape(slide, { left: x + 210, top: y + 135, width: 140, height: 66, fill: C.ink, line: { style: 'solid', fill: C.ink, width: 0 } });
    ctx.addText(slide, { text: 'AURA', left: x + 210, top: y + 154, width: 140, height: 26, fontSize: 24, bold: true, color: '#FFFFFF', align: 'center' });
  } else if (type === 'matrix') {
    ctx.addShape(slide, { left: x + 70, top: y + 70, width: 390, height: 230, fill: '#FFFFFF', line: { style: 'solid', fill: C.line, width: 1 } });
    ctx.addShape(slide, { left: x + 260, top: y + 70, width: 1, height: 230, fill: C.line });
    ctx.addShape(slide, { left: x + 70, top: y + 185, width: 390, height: 1, fill: C.line });
    [['Calm', 130, 240], ['Finch', 260, 220], ['Replika', 190, 130], ['Avatar apps', 350, 120], ['AURA', 375, 150]].forEach(([t, dx, dy]) => tag(slide, ctx, t, x + dx, y + dy, t === 'AURA' ? 100 : 90, t === 'AURA' ? C.greenSoft : C.blueSoft));
    ctx.addText(slide, { text: 'meaning → action', left: x + 180, top: y + 310, width: 220, height: 18, fontSize: 12, color: C.muted, align: 'center' });
  } else if (type === 'journey' || type === 'screens') {
    const steps = ['Welcome', 'Consent', 'Profile', 'Season', 'Episode', 'Action', 'Reset', 'Canvas', 'Hook'];
    steps.forEach((s, i) => tag(slide, ctx, s, x + 36 + (i % 3) * 165, y + 40 + Math.floor(i / 3) * 86, 130, i >= 4 ? C.greenSoft : C.blueSoft));
  } else if (type === 'timeline') {
    const days = ['Day 1', 'Day 2', 'Day 7', 'Day 30'];
    days.forEach((d, i) => {
      const xx = x + 70 + i * 130;
      tag(slide, ctx, d, xx, y + 150, 90, C.blueSoft);
      if (i < days.length - 1) arrow(slide, ctx, xx + 90, y + 168, xx + 126, y + 168);
    });
  } else if (type === 'cause') {
    const items = ['Action', 'Evidence', 'Visual trait', 'Life Canvas'];
    items.forEach((d, i) => {
      const xx = x + 44 + i * 125;
      tag(slide, ctx, d, xx, y + 150, 105, i === 3 ? C.greenSoft : C.blueSoft);
      if (i < items.length - 1) arrow(slide, ctx, xx + 105, y + 168, xx + 122, y + 168);
    });
  } else if (type === 'stack' || type === 'data') {
    ['Mobile App', 'Backend', 'AI + Image', 'Postgres + Storage', 'Analytics + Admin'].forEach((s, i) => tag(slide, ctx, s, x + 135, y + 48 + i * 54, 290, i === 2 ? C.greenSoft : C.blueSoft));
  } else if (type === 'cost' || type === 'bars') {
    [['AI', 90], ['Images', 210], ['Infra', 120], ['Support', 65]].forEach(([s, hh], i) => {
      const xx = x + 90 + i * 105;
      ctx.addShape(slide, { left: xx, top: y + 280 - hh, width: 56, height: hh, fill: i === 1 ? C.greenSoft : C.blueSoft, line: { style: 'solid', fill: C.blue, width: 1 } });
      ctx.addText(slide, { text: s, left: xx - 8, top: y + 292, width: 72, height: 18, fontSize: 11, bold: true, align: 'center', color: C.ink });
    });
  } else if (type === 'funnel') {
    [['150 warm', 420], ['60 replies', 330], ['20 interviews', 250], ['30 users', 180], ['1000 users', 110]].forEach(([s, ww], i) => tag(slide, ctx, s, x + (w - ww) / 2, y + 46 + i * 54, ww, i > 2 ? C.greenSoft : C.blueSoft));
  } else if (type === 'roadmap') {
    ['S1 Foundation', 'S2 Loop', 'S3 Canvas', 'S4 Return', 'S5 Launch'].forEach((s, i) => tag(slide, ctx, s, x + 42 + i * 96, y + 155, 86, i === 2 ? C.greenSoft : C.blueSoft));
  } else if (type === 'dashboard') {
    [['Activation', '45%+'], ['Loop', '25%+'], ['Causality', '70%+'], ['D1', '20%+'], ['Paid', '5%+']].forEach(([s, v], i) => {
      tag(slide, ctx, v, x + 52 + i * 96, y + 140, 76, C.greenSoft);
      ctx.addText(slide, { text: s, left: x + 36 + i * 96, top: y + 190, width: 108, height: 16, fontSize: 10, bold: true, color: C.ink, align: 'center' });
    });
  } else if (type === 'decision') {
    tag(slide, ctx, 'Prototype', x + 190, y + 55, 160, C.blueSoft);
    tag(slide, ctx, 'Causality?', x + 190, y + 145, 160, C.yellowSoft);
    tag(slide, ctx, 'Iterate flow', x + 55, y + 245, 160, C.redSoft);
    tag(slide, ctx, 'Build cohort', x + 325, y + 245, 160, C.greenSoft);
  } else if (type === 'wheel' || type === 'channels') {
    ['TikTok', 'Creators', 'Reddit', 'Referral', 'Landing'].forEach((s, i) => tag(slide, ctx, s, x + 60 + (i % 3) * 150, y + 70 + Math.floor(i / 3) * 115, 125, C.blueSoft));
  } else if (type === 'ladder' || type === 'scope') {
    ['Free', 'Plus', 'Premium', 'Tokens'].forEach((s, i) => tag(slide, ctx, s, x + 90 + i * 102, y + 235 - i * 50, 100 + i * 24, i > 1 ? C.greenSoft : C.blueSoft));
  } else {
    loopVisual(slide, ctx, x + 170, y + 36);
  }
}
`;
}

function slideModule(slide, n) {
  return `import { base, bullets, visual } from './_shared.mjs';

export async function slide${String(n).padStart(2, '0')}(presentation, ctx) {
  const slide = presentation.slides.add();
  base(slide, ctx, ${n}, \`${esc(slide.title)}\`, \`${esc(slide.understand)}\`);
  bullets(slide, ctx, ${JSON.stringify(slide.thesis)}, 72, 178, 475);
  visual(slide, ctx, \`${slide.type}\`);
  ctx.addText(slide, { text: \`${esc(slide.visual)}\`, left: 620, top: 542, width: 560, height: 22, fontSize: 13, bold: true, color: '#667085', align: 'center' });
  return slide;
}
`;
}

function writeSlides() {
  fs.rmSync(WORKSPACE, { recursive: true, force: true });
  fs.mkdirSync(SLIDES_DIR, { recursive: true });
  fs.writeFileSync(path.join(SLIDES_DIR, '_shared.mjs'), sharedModule());
  slides.forEach((slide, idx) => {
    fs.writeFileSync(path.join(SLIDES_DIR, `slide-${String(idx + 1).padStart(2, '0')}.mjs`), slideModule(slide, idx + 1));
  });
}

function buildDeck() {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  const result = spawnSync(NODE, [
    BUILDER,
    '--slides-dir', SLIDES_DIR,
    '--out', PPTX_OUT,
    '--preview-dir', PREVIEW_DIR,
    '--layout-dir', LAYOUT_DIR,
    '--contact-sheet', CONTACT_SHEET,
    '--slide-count', '25',
    '--workspace', WORKSPACE,
    '--slide-size', '1280x720',
    '--scale', '0.8',
  ], { stdio: 'inherit', env: { ...process.env, NODE_PATH: '/Users/kirill/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules' } });
  if (result.status !== 0) {
    throw new Error(`Deck build failed with status ${result.status}`);
  }
}

writePlan();
writeSlides();
buildDeck();
console.log(`plan=${PLAN_OUT}`);
console.log(`pptx=${PPTX_OUT}`);
console.log(`contact_sheet=${CONTACT_SHEET}`);
