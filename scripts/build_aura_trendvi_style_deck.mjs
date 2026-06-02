import fs from 'fs';
import path from 'path';
import { spawnSync } from 'child_process';

const ROOT = process.cwd();
const THREAD_ID = process.env.CODEX_THREAD_ID || `manual-${Date.now().toString(36)}`;
const WORKSPACE = path.join(ROOT, 'tmp', 'presentations', THREAD_ID, 'aura-trendvi-style-deck');
const SLIDES_DIR = path.join(WORKSPACE, 'slides');
const PREVIEW_DIR = path.join(WORKSPACE, 'preview');
const LAYOUT_DIR = path.join(WORKSPACE, 'layout');
const OUTPUT_DIR = path.join(ROOT, 'output', 'pptx');
const PLAN_OUT = path.join(ROOT, 'reports', 'aura-trendvi-style-deck.md');
const SOURCE_NOTES = path.join(ROOT, 'reports', 'aura-trendvi-style-deck-sources.md');
const PPTX_OUT = path.join(OUTPUT_DIR, 'AURA_TRENDVI_STYLE_DECK.pptx');
const CONTACT_SHEET = path.join(OUTPUT_DIR, 'AURA_TRENDVI_STYLE_DECK_CONTACT_SHEET.png');

const BUILDER = '/Users/kirill/.codex/plugins/cache/openai-primary-runtime/presentations/26.521.10419/skills/presentations/scripts/build_artifact_deck.mjs';
const NODE = '/Users/kirill/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node';

const slides = [
  {
    title: 'AURA',
    type: 'cover'
  },
  {
    title: 'Project Overview',
    type: 'overview',
    blocks: [
      ['Target audience', 'люди, которые хотят персональный прогноз, мягкий ежедневный ритуал и видимый образ своей траектории без тяжелого трекера привычек.'],
      ['Current alternatives', 'астрология, self-care apps, AI companions, habit trackers, заметки, Telegram-каналы, ручные консультации и генераторы картинок.'],
      ['Problem', 'пользователь получает смысл отдельно, действие отдельно, визуальный образ отдельно. Из-за этого нет ощущения личного сериала и накопления изменений.'],
      ['Solution', 'AURA превращает дату рождения и текущий запрос в недельный прогноз, daily episode, маленькое действие, reset и avatar / Life Canvas, который меняется по ходу недели.'],
      ['How it works', 'пользователь вводит дату рождения, выбирает состояние и стиль помощника; система собирает недельный сценарий, daily prompts, визуальные аватары и premium video moments.'],
      ['Key differentiation', 'AURA продает не “гороскоп” и не “AI-картинку”, а карманного прогнозиста и визуальный сериал о своей жизни.']
    ]
  },
  {
    title: 'Product Solution',
    type: 'solution',
    leftTitle: 'Пользователь приходит не за приложением',
    left: ['Хочет понять, что с ним происходит сейчас.', 'Хочет прогноз на неделю, но без жесткой фатальности.', 'Хочет красивую визуализацию себя и своего периода.', 'Не хочет еще один сухой список задач.'],
    rightTitle: 'AURA превращает это в продукт',
    right: ['Недельный прогноз как season.', 'Daily episode и маленькое действие.', 'Настраиваемый AI-помощник / avatar.', 'Life Canvas, который объясняет визуальные изменения.', 'Premium video как дорогой wow-момент, а не бесплатная ежедневная норма.']
  },
  {
    title: 'Market Size',
    type: 'marketSize',
    items: [
      ['PAM', '1B+', 'mobile users interested in wellness, spirituality, AI entertainment and self-improvement globally.'],
      ['TAM', '200M+', 'users already paying attention to astrology, mindfulness, AI companions, avatar apps and habit products.'],
      ['SAM', '20-40M', 'spiritual self-improvers, visual identity users and habit/progress users reachable through mobile channels.'],
      ['SOM', '100k-300k', 'realistic 3-year reachable user base with creator-led GTM and subscription-first product.'],
      ['SUM', '$30-80M ARR', 'upside through subscriptions, premium visual moments, creator seasons and team/coach packs.']
    ],
    note: 'AURA считается как пересечение рынков, а не как узкий horoscope TAM.'
  },
  {
    title: 'Market Size ($)',
    type: 'money',
    rows: [
      ['Calm', '$300M revenue / 2023', '$70/year subscription, 4M+ paying subscribers', 'wellness subscriptions can become large consumer businesses'],
      ['Character.AI', '$30M run-rate / 2025', '$9.99/month c.ai+', 'AI companions monetize heavy engagement'],
      ['Replika', '$2.36M/month Android est.', '~$17.23/month subscription proxy', 'AI companion + avatar layer has proven paid demand'],
      ['Finch', '$1.5M/month iOS est.', 'self-care pet + subscription', 'soft companion + habit loop can monetize'],
      ['Co-Star', '$300k/month est.', 'IAPs and paid readings', 'astrology can monetize through personal depth']
    ],
    conclusion: 'Деньги есть в соседних категориях. AURA должна взять не одну категорию, а их связку: personal meaning + companion + visual progress.'
  },
  {
    title: 'Customer Segments',
    type: 'segments',
    segments: [
      ['Spiritual self-improvers', 'Ищут смысл, символы, прогнозы, мягкую персонализацию.', 'недельный прогноз + daily episode'],
      ['Avatar / future-self users', 'Хотят увидеть себя в другой версии и красивом визуальном мире.', 'Life Canvas + avatar evolution'],
      ['Habit & reset users', 'Хотят действие, но без жесткого productivity-трека.', 'маленький шаг + reset'],
      ['AI companion users', 'Хочется персонального помощника, который помнит контекст.', 'карманный прогнозист']
    ]
  },
  {
    title: 'Why AURA Is Needed by the Market',
    type: 'why',
    bullets: ['Соседние рынки уже доказали готовность платить за смысл, self-care, AI companionship и визуальные identity-механики.', 'Но пользователь часто получает либо прогноз без действия, либо действие без образа, либо avatar без личной причинности.', 'AURA закрывает разрыв: недельный сценарий, ежедневный контакт, avatar-помощник, визуальная история и понятный повод вернуться.'],
    conclusion: 'AURA не решает “астрологическую” проблему. Она решает проблему личной ясности, регулярного контакта с собой и визуального ощущения движения.'
  },
  {
    title: 'Competitors',
    type: 'competitorsMap',
    quote: 'AURA должна отвечать на вопрос “что со мной происходит и каким будет мой следующий шаг?” — не просто “что говорит мой знак” и не “какую картинку сгенерировал AI”.'
  },
  {
    title: 'Competitive Analysis',
    type: 'compTable',
    rows: [
      ['Calm / Headspace', 'mindfulness, sleep, reset', 'контент и ритуал', 'слабее персональный прогноз и визуальная identity'],
      ['Co-Star / Nebula', 'astrology and spiritual guidance', 'персональный смысл', 'риск фатализма, мало действия и visual progress'],
      ['Replika / Character.AI', 'AI companion', 'диалог, память, эмоциональная связь', 'нет недельного life-series и действия в реальном мире'],
      ['Finch', 'self-care pet + tasks', 'мягкий habit loop', 'детский образ, меньше “взрослого” визуального сериала'],
      ['AURA', 'weekly forecast + avatar + action', 'смысл, действие, visual evolution', 'нужно доказать причинность и экономику видео']
    ]
  },
  {
    title: 'Pricing Analysis',
    type: 'pricingTable',
    rows: [
      ['Calm', '$14.99/mo or ~$70/yr', 'sleep, meditation, content library', 'annual subscription anchor'],
      ['Character.AI', '$9.99/mo or $94.99/yr', 'better memory, voice, premium models', 'AI companion subscription ceiling'],
      ['Nebula', '$7.99/week, $24.99/mo, $29.99/3mo', 'spiritual guidance, astrology depth', 'high willingness to pay for personal insight'],
      ['Replika', '~$17/mo proxy', 'AI companion, avatar, voice, memory', 'strong paid intent, but pricing risk'],
      ['AURA', '$9.99-14.99/mo target', 'weekly season, memory, Life Canvas, premium moments', 'start below high-friction astrology/companion pricing']
    ]
  },
  {
    title: 'Pricing',
    type: 'pricingNarrative',
    points: ['AURA should start with a free first loop: дата рождения, первый прогноз, первый episode, первое visual change.', 'Plus subscription sells weekly seasons, memory, recap, advanced avatar styles and assistant continuity.', 'Premium moments sell AI video, cinematic future-self scenes and limited creator seasons as tokens or packs.', 'Video must be a paid event, not a free daily feature.']
  },
  {
    title: 'Financial Model',
    type: 'finance',
    rows: [
      ['Metric', 'MVP', 'Early scale', 'Growth'],
      ['Users', '1,000', '10,000', '100,000'],
      ['Paid conversion', '3%', '5%', '7%'],
      ['ARPPU / month', '$10', '$12', '$14'],
      ['Revenue / month', '$300', '$6,000', '$98,000'],
      ['Product COGS', '$80-250', '$1.5k-5k', '$18k-45k'],
      ['Gross margin', 'low / learning', '50-75%', '60-80% if video gated']
    ],
    note: 'Model is directional: text + images are viable; daily AI video destroys margin unless sold as premium.'
  },
  {
    title: 'Go-to-Market Strategy',
    type: 'gtm',
    blocks: [
      ['1. Spiritual / self-growth creators', 'creator-led demos: “я прошла 7-дневный сезон AURA” with honest reactions and visual before/after.'],
      ['2. TikTok / Reels / Shorts', 'hooks around future-self, weekly forecast, avatar transformation and “not a horoscope” objection.'],
      ['3. Concierge validation', 'first 30-100 users manually guided through the weekly forecast to collect language, objections and paid intent.'],
      ['4. Referral / share cards', 'Life Canvas cards and weekly recap as shareable artifacts after value moment.']
    ]
  },
  {
    title: 'Growth Roadmap (Post-MVP)',
    type: 'roadmap',
    steps: [
      ['IDEA', 'product thesis'],
      ['MVP', 'weekly forecast + avatar'],
      ['First sales', 'paid season tests'],
      ['Optimization', 'retention + paywall'],
      ['Scaling', 'creators + AI pipeline'],
      ['$1M ARR milestone', 'premium visual engine']
    ]
  },
  {
    title: 'Product Background & Evolution',
    type: 'background',
    bullets: ['Исходная идея: специалист по astrology / смыслу + цифровые аватары + визуальная версия другой жизни.', 'После исследования продукт сужен до weekly life-series: forecast → daily episode → action → avatar / Life Canvas.', 'Следующий этап: не новое исследование, а prototype, examples of generated video/avatar, interviews and paid intent test.'],
    stages: ['research', 'product thesis', 'MVP spec', 'visual examples', 'prototype', 'first cohort']
  },
  {
    title: 'AI Avatar & Video Pipeline',
    type: 'pipeline',
    items: [
      ['Birth data + request', 'personal context'],
      ['Weekly forecast', 'season logic'],
      ['Daily assistant', 'text / voice dialog'],
      ['Avatar / Canvas', 'image-first evolution'],
      ['Premium video', 'Veo / video model as paid wow']
    ],
    note: 'Veo-class video is expensive: official Vertex AI Veo 2 pricing is around $0.50/sec, so video should be gated.'
  },
  {
    title: 'Risks',
    type: 'risks',
    rows: [
      ['Looks like horoscope', 'user thinks it is generic astrology', 'position as life-series and action, not fate'],
      ['Avatar feels random', 'user cannot explain visual change', 'show cause next to Canvas'],
      ['Video cost kills margin', 'free users generate expensive clips', 'premium/token video only'],
      ['AI sounds generic', 'low trust and no return', 'prompt QA + feedback loop'],
      ['No paid intent', 'users like it but do not pay', 'paywall after first completed loop']
    ]
  },
  {
    title: '30-Day Validation Plan',
    type: 'validation',
    weeks: [
      ['Week 1', '10-screen prototype + 20 interviews'],
      ['Week 2', 'manual weekly forecasts + avatar examples'],
      ['Week 3', 'concierge cohort: 30-50 users'],
      ['Week 4', 'paid intent, pricing test, final go/no-go']
    ],
    metrics: ['>70% understand category', '>50% explain avatar change', 'D1 >20%', 'paid intent >5%']
  },
  {
    title: 'Contacts / Next Step',
    type: 'contacts',
    name: 'AURA',
    cta: 'Next step: generate 3-5 visual examples, assemble clickable prototype, and validate the first weekly season with real users.'
  }
];

const sources = [
  ['Calm', 'Sacra', 'Revenue $300M in 2023; $70/year subscription; 4M+ paying subscribers; 2-7% paid conversion commentary.', 'https://sacra.com/c/calm/'],
  ['Character.AI', 'Sacra / Character.AI pricing page', '$30M annualized revenue in July 2025; $50M projected end-2025; c.ai+ $9.99/month; 20M MAU early 2024.', 'https://sacra.com/c/character-ai/ and https://character.ai/subscribe'],
  ['Co-Star', 'Adapty paywall library', '$300k/month revenue estimate; 200k+ downloads/month; IAP list.', 'https://adapty.io/paywall-library/co-star-personalized-astrology/'],
  ['Replika', 'Rev.now Android estimate', '$2.36M/month Play Store estimate; $28.35M/year; 99K paying users estimate; ~$17.23/month proxy.', 'https://rev.now/app/android/replika-my-ai-friend-ux7ec/'],
  ['Finch', 'Rev.now iOS estimate', '$1.50M/month App Store estimate; ~7.7M MAU estimate.', 'https://rev.now/app/ios/finch-self-care-pet-95748/'],
  ['Nebula', 'Rev.now iOS/Android estimates', '$718k/month App Store estimate; $125.9k/month Play Store estimate; Android listing mentions $7.99 weekly, $24.99 monthly, $29.99 three-month tiers.', 'https://rev.now/app/ios/nebula-spiritual-guidance-69523/ and https://rev.now/app/android/nebula-spiritual-guidance-4a0ag/'],
  ['OpenAI pricing', 'OpenAI official pricing', 'GPT-Image-2 pricing and web search/API pricing referenced for AI cost model.', 'https://openai.com/api/pricing/'],
  ['Veo pricing', 'Google Vertex AI pricing', 'Veo 2 pricing around $0.50/second for generated video.', 'https://cloud.google.com/vertex-ai/generative-ai/pricing'],
];

function esc(s) {
  return String(s).replace(/`/g, '\\`').replace(/\$/g, '\\$');
}

function writePlan() {
  const lines = ['# AURA Trendvi-Style Product Deck', '', 'Deck mode: create from AURA source material using Trendvi visual reference. This is not a copy of the owl/logo; it inherits typography, spacing, palette and analytical slide rhythm.', ''];
  slides.forEach((slide, i) => {
    lines.push(`## ${String(i + 1).padStart(2, '0')}. ${slide.title}`);
    lines.push('');
    lines.push(`Type: ${slide.type}`);
    lines.push('');
  });
  fs.mkdirSync(path.dirname(PLAN_OUT), { recursive: true });
  fs.writeFileSync(PLAN_OUT, `${lines.join('\n').trimEnd()}\n`);

  const src = ['# AURA Trendvi-Style Deck Sources', '', '| Topic | Source | What is used | URL |', '| --- | --- | --- | --- |'];
  for (const row of sources) src.push(`| ${row.map(v => String(v).replace(/\|/g, '/')).join(' | ')} |`);
  fs.writeFileSync(SOURCE_NOTES, `${src.join('\n').trimEnd()}\n`);
}

function sharedModule() {
  return `
const C = {
  purple: '#9B85E4',
  purpleDark: '#7B61D1',
  purpleLight: '#F0ECFF',
  green: '#98C484',
  greenLight: '#DCEFD4',
  grey: '#E8E8E8',
  line: '#4D5563',
  ink: '#111111',
  muted: '#555555',
  white: '#FFFFFF'
};

export function bg(slide, ctx) {
  ctx.addShape(slide, { left: 0, top: 0, width: ctx.W, height: ctx.H, fill: C.white, line: { style: 'solid', fill: C.white, width: 0 } });
}

export function mark(slide, ctx, x = 52, y = 42, size = 86) {
  ctx.addShape(slide, { left: x, top: y, width: size, height: size, fill: C.purpleLight, line: { style: 'solid', fill: C.purpleLight, width: 0 } });
  ctx.addShape(slide, { left: x + 26, top: y + 16, width: size - 52, height: size - 32, fill: C.purple, line: { style: 'solid', fill: C.purple, width: 0 } });
  ctx.addText(slide, { text: 'A', left: x + 29, top: y + 27, width: size - 58, height: size - 52, fontSize: 34, bold: true, fontFace: 'Montserrat', color: C.white, align: 'center' });
}

export function title(slide, ctx, text) {
  mark(slide, ctx);
  ctx.addText(slide, { text, left: 196, top: 78, width: 900, height: 54, fontSize: 38, bold: true, fontFace: 'Montserrat', color: C.purple });
}

export function footer(slide, ctx, n) {
  ctx.addText(slide, { text: String(n).padStart(2, '0'), left: 1130, top: 655, width: 50, height: 20, fontSize: 14, fontFace: 'Arial', color: C.ink, align: 'right' });
}

export function para(slide, ctx, label, text, x, y, w, h = 46) {
  ctx.addText(slide, { text: label + ' —', left: x, top: y, width: 185, height: 24, fontSize: 17, bold: true, fontFace: 'Arial', color: C.ink, fit: 'shrink' });
  ctx.addText(slide, { text, left: x + 205, top: y, width: w - 205, height: h, fontSize: 17, fontFace: 'Arial', color: C.ink, fit: 'shrink' });
}

export function bullet(slide, ctx, text, x, y, w, size = 18) {
  ctx.addText(slide, { text: '•', left: x, top: y - 2, width: 24, height: 22, fontSize: size + 6, fontFace: 'Arial', color: C.ink });
  ctx.addText(slide, { text, left: x + 38, top: y, width: w - 38, height: 46, fontSize: size, fontFace: 'Arial', color: C.ink, fit: 'shrink' });
}

export function cell(slide, ctx, text, x, y, w, h, fill = C.white, bold = false, size = 15, color = C.ink) {
  ctx.addShape(slide, { left: x, top: y, width: w, height: h, fill, line: { style: 'solid', fill: C.line, width: 1 } });
  ctx.addText(slide, { text, left: x + 8, top: y + 7, width: w - 16, height: h - 12, fontSize: size, bold, fontFace: 'Arial', color, fit: 'shrink' });
}

export function pill(slide, ctx, text, x, y, w, h = 62, fill = C.purpleLight, line = C.line, size = 18) {
  ctx.addShape(slide, { geometry: 'ellipse', left: x, top: y, width: w, height: h, fill, line: { style: 'solid', fill: line, width: 1.4 } });
  ctx.addText(slide, { text, left: x + 8, top: y + h / 2 - 14, width: w - 16, height: 30, fontSize: size, fontFace: 'Arial', bold: true, color: C.ink, align: 'center', fit: 'shrink' });
}

export function source(slide, ctx, text) {
  ctx.addText(slide, { text, left: 54, top: 662, width: 880, height: 16, fontSize: 9, fontFace: 'Arial', color: '#777777' });
}

export { C };
`;
}

function moduleFor(slide, n) {
  return `import { bg, title, footer, para, bullet, cell, pill, source, C } from './_shared.mjs';

export async function slide${String(n).padStart(2, '0')}(presentation, ctx) {
  const slide = presentation.slides.add();
  bg(slide, ctx);
  ${bodyFor(slide, n)}
  footer(slide, ctx, ${n});
  return slide;
}
`;
}

function bodyFor(slide, n) {
  if (slide.type === 'cover') {
    return `
  ctx.addShape(slide, { left: 470, top: 245, width: 130, height: 130, fill: C.purple, line: { style: 'solid', fill: C.purple, width: 0 } });
  ctx.addText(slide, { text: 'A', left: 492, top: 268, width: 86, height: 86, fontSize: 76, bold: true, fontFace: 'Montserrat', color: C.white, align: 'center' });
  ctx.addText(slide, { text: 'AURA', left: 620, top: 282, width: 320, height: 68, fontSize: 58, bold: true, fontFace: 'Montserrat', color: C.purple });
  ctx.addText(slide, { text: 'Product / Investor Deck', left: 465, top: 382, width: 500, height: 34, fontSize: 24, fontFace: 'Arial', color: C.muted, align: 'center' });
`;
  }

  if (slide.type === 'overview') {
    return `
  title(slide, ctx, '${esc(slide.title)}');
  ${slide.blocks.map((b, i) => `para(slide, ctx, '${esc(b[0])}', '${esc(b[1])}', 52, ${182 + i * 71}, 1068, 58);`).join('\n  ')}
`;
  }

  if (slide.type === 'solution') {
    return `
  title(slide, ctx, '${esc(slide.title)}');
  ctx.addText(slide, { text: '${esc(slide.leftTitle)}', left: 70, top: 180, width: 450, height: 34, fontSize: 24, bold: true, fontFace: 'Arial', color: C.ink });
  ${slide.left.map((t, i) => `bullet(slide, ctx, '${esc(t)}', 70, ${240 + i * 58}, 470, 18);`).join('\n  ')}
  ctx.addText(slide, { text: '${esc(slide.rightTitle)}', left: 670, top: 180, width: 430, height: 34, fontSize: 24, bold: true, fontFace: 'Arial', color: C.ink });
  ${slide.right.map((t, i) => `bullet(slide, ctx, '${esc(t)}', 670, ${240 + i * 48}, 450, 17);`).join('\n  ')}
  ctx.addShape(slide, { left: 575, top: 175, width: 2, height: 360, fill: C.purple, line: { style: 'solid', fill: C.purple, width: 0 } });
`;
  }

  if (slide.type === 'marketSize') {
    return `
  title(slide, ctx, '${esc(slide.title)}');
  ${slide.items.slice(0, 3).map((it, i) => `
  pill(slide, ctx, '${it[0]}', 50, ${185 + i * 135}, 105, 105, ${i === 2 ? 'C.purpleLight' : 'C.grey'});
  ctx.addText(slide, { text: '${esc(it[1])}', left: 180, top: ${198 + i * 135}, width: 160, height: 26, fontSize: 20, bold: true, fontFace: 'Arial', color: C.ink });
  ctx.addText(slide, { text: '${esc(it[2])}', left: 180, top: ${230 + i * 135}, width: 430, height: 52, fontSize: 17, fontFace: 'Arial', color: C.ink, fit: 'shrink' });`).join('\n')}
  ${slide.items.slice(3).map((it, i) => `
  pill(slide, ctx, '${it[0]}', 720, ${200 + i * 150}, 120, 100, ${i === 1 ? 'C.purple' : 'C.purpleLight'}, C.line, 18);
  ctx.addText(slide, { text: '${esc(it[1])}', left: 875, top: ${208 + i * 150}, width: 240, height: 28, fontSize: 20, bold: true, fontFace: 'Arial', color: C.ink });
  ctx.addText(slide, { text: '${esc(it[2])}', left: 875, top: ${242 + i * 150}, width: 290, height: 60, fontSize: 17, fontFace: 'Arial', color: C.ink, fit: 'shrink' });`).join('\n')}
  ctx.addText(slide, { text: '${esc(slide.note)}', left: 690, top: 530, width: 430, height: 44, fontSize: 18, bold: true, fontFace: 'Arial', color: C.ink });
`;
  }

  if (slide.type === 'money') {
    return `
  title(slide, ctx, '${esc(slide.title)}');
  ${table(slide.rows, [210, 225, 230, 420], 54, 176, 58)}
  ctx.addText(slide, { text: '${esc(slide.conclusion)}', left: 610, top: 535, width: 500, height: 56, fontSize: 20, fontFace: 'Arial', color: C.ink, fit: 'shrink' });
  source(slide, ctx, 'Sources: Sacra, Adapty, Rev.now public estimates. Figures are directional public proxies, not private company P&L.');
`;
  }

  if (slide.type === 'segments') {
    return `
  title(slide, ctx, '${esc(slide.title)}');
  ${slide.segments.map((s, i) => `
  cell(slide, ctx, '${esc(s[0])}', 70, ${178 + i * 100}, 285, 76, C.purpleLight, true, 17);
  cell(slide, ctx, '${esc(s[1])}', 355, ${178 + i * 100}, 450, 76, C.white, false, 16);
  cell(slide, ctx, '${esc(s[2])}', 805, ${178 + i * 100}, 300, 76, C.greenLight, true, 16);`).join('\n')}
`;
  }

  if (slide.type === 'why') {
    return `
  title(slide, ctx, '${esc(slide.title)}');
  ${slide.bullets.map((t, i) => `bullet(slide, ctx, '${esc(t)}', 90, ${190 + i * 72}, 660, 20);`).join('\n  ')}
  ctx.addText(slide, { text: 'Conclusion', left: 760, top: 210, width: 250, height: 28, fontSize: 24, bold: true, fontFace: 'Arial', color: C.ink });
  ctx.addText(slide, { text: '${esc(slide.conclusion)}', left: 760, top: 255, width: 330, height: 180, fontSize: 22, fontFace: 'Arial', color: C.ink, fit: 'shrink' });
`;
  }

  if (slide.type === 'competitorsMap') {
    return `
  title(slide, ctx, '${esc(slide.title)}');
  ctx.addShape(slide, { left: 520, top: 135, width: 2, height: 470, fill: C.line });
  ctx.addShape(slide, { left: 135, top: 395, width: 820, height: 2, fill: C.line });
  ctx.addText(slide, { text: 'Depth of personal meaning', left: 38, top: 355, width: 130, height: 70, fontSize: 18, bold: true, fontFace: 'Arial', color: C.ink });
  ctx.addText(slide, { text: 'Visual / companion experience', left: 760, top: 610, width: 260, height: 24, fontSize: 18, italic: true, fontFace: 'Arial', color: C.ink });
  pill(slide, ctx, 'Calm', 220, 458, 150, 70, C.grey);
  pill(slide, ctx, 'Co-Star', 610, 455, 160, 70, C.purpleLight);
  pill(slide, ctx, 'Replika', 615, 250, 170, 70, C.grey);
  pill(slide, ctx, 'Finch', 360, 310, 145, 70, C.greenLight);
  cell(slide, ctx, 'AURA', 535, 245, 260, 96, C.purpleLight, true, 34, C.purpleDark);
  ctx.addText(slide, { text: 'weekly forecast + assistant + Life Canvas', left: 548, top: 315, width: 234, height: 20, fontSize: 13, fontFace: 'Arial', color: C.ink, align: 'center' });
  ctx.addShape(slide, { left: 865, top: 80, width: 285, height: 155, fill: C.purple, line: { style: 'solid', fill: C.line, width: 1.4 } });
  ctx.addText(slide, { text: '${esc(slide.quote)}', left: 882, top: 100, width: 250, height: 120, fontSize: 18, bold: true, fontFace: 'Arial', color: C.white, fit: 'shrink' });
`;
  }

  if (slide.type === 'compTable' || slide.type === 'pricingTable') {
    const cols = slide.type === 'compTable' ? [220, 220, 260, 370] : [220, 220, 260, 370];
    return `
  title(slide, ctx, '${esc(slide.title)}');
  ${table(slide.rows, cols, 54, 176, 72)}
`;
  }

  if (slide.type === 'pricingNarrative') {
    return `
  title(slide, ctx, '${esc(slide.title)}');
  ctx.addText(slide, { text: 'AURA is not sold before the first value moment.', left: 78, top: 184, width: 640, height: 38, fontSize: 26, bold: true, fontFace: 'Arial', color: C.ink });
  ${slide.points.map((p, i) => `bullet(slide, ctx, '${esc(p)}', 80, ${250 + i * 72}, 680, 19);`).join('\n  ')}
  pill(slide, ctx, 'Free first loop', 810, 210, 250, 74, C.grey, C.line, 20);
  pill(slide, ctx, 'Plus subscription', 810, 320, 300, 80, C.purpleLight, C.line, 21);
  pill(slide, ctx, 'Premium video / tokens', 810, 445, 330, 86, C.greenLight, C.line, 21);
`;
  }

  if (slide.type === 'finance') {
    return `
  title(slide, ctx, '${esc(slide.title)}');
  ${table(slide.rows, [240, 260, 260, 260], 70, 180, 50)}
  ctx.addText(slide, { text: '${esc(slide.note)}', left: 112, top: 555, width: 940, height: 40, fontSize: 17, italic: true, fontFace: 'Arial', color: C.ink, align: 'center' });
  source(slide, ctx, 'Assumptions: $10-14 ARPPU, image-first cost control, premium video gated. Needs recalculation after prototype telemetry.');
`;
  }

  if (slide.type === 'gtm') {
    return `
  title(slide, ctx, '${esc(slide.title)}');
  ${slide.blocks.map((b, i) => `
  ctx.addText(slide, { text: '${esc(b[0])}', left: 78, top: ${180 + i * 98}, width: 350, height: 28, fontSize: 21, bold: true, fontFace: 'Arial', color: C.ink });
  ctx.addText(slide, { text: '${esc(b[1])}', left: 438, top: ${180 + i * 98}, width: 630, height: 60, fontSize: 18, fontFace: 'Arial', color: C.ink, fit: 'shrink' });`).join('\n')}
`;
  }

  if (slide.type === 'roadmap') {
    return `
  title(slide, ctx, '${esc(slide.title)}');
  ctx.addShape(slide, { geometry: 'arc', left: -35, top: 500, width: 1280, height: 500, line: { style: 'solid', fill: C.purple, width: 5 } });
  ${slide.steps.map((s, i) => `
  pill(slide, ctx, '${esc(s[0])}\\n${esc(s[1])}', ${40 + i * 175}, ${500 - Math.sin((i + 0.5) / 6 * Math.PI) * 250}, ${i === 5 ? 170 : 145}, ${i === 5 ? 85 : 70}, ${i === 2 || i === 5 ? 'C.greenLight' : i === 3 ? 'C.purple' : 'C.grey'}, C.line, 17);`).join('\n')}
`;
  }

  if (slide.type === 'background') {
    return `
  title(slide, ctx, '${esc(slide.title)}');
  ${slide.bullets.map((t, i) => `bullet(slide, ctx, '${esc(t)}', 76, ${190 + i * 82}, 570, 19);`).join('\n  ')}
  ctx.addText(slide, { text: 'Product Evolution', left: 705, top: 220, width: 360, height: 38, fontSize: 28, bold: true, fontFace: 'Arial', color: C.ink });
  ${slide.stages.map((s, i) => `bullet(slide, ctx, '${esc(s)}', 720, ${282 + i * 44}, 360, 18);`).join('\n  ')}
`;
  }

  if (slide.type === 'pipeline') {
    return `
  title(slide, ctx, '${esc(slide.title)}');
  ${slide.items.map((it, i) => `
  pill(slide, ctx, '${esc(it[0])}', ${80 + i * 205}, 270, 170, 76, ${i >= 3 ? 'C.greenLight' : 'C.purpleLight'}, C.line, 17);
  ctx.addText(slide, { text: '${esc(it[1])}', left: ${85 + i * 205}, top: 360, width: 160, height: 36, fontSize: 15, fontFace: 'Arial', color: C.ink, align: 'center', fit: 'shrink' });`).join('\n')}
  ctx.addText(slide, { text: '${esc(slide.note)}', left: 150, top: 480, width: 850, height: 52, fontSize: 22, bold: true, fontFace: 'Arial', color: C.ink, align: 'center', fit: 'shrink' });
  source(slide, ctx, 'Source: Google Vertex AI pricing page for Veo 2; exact video model pricing must be rechecked before build.');
`;
  }

  if (slide.type === 'risks') {
    return `
  title(slide, ctx, '${esc(slide.title)}');
  ${table(slide.rows, [245, 390, 430], 70, 180, 72)}
`;
  }

  if (slide.type === 'validation') {
    return `
  title(slide, ctx, '${esc(slide.title)}');
  ${slide.weeks.map((w, i) => `
  pill(slide, ctx, '${esc(w[0])}', ${90 + i * 260}, 230, 150, 70, ${i === 3 ? 'C.greenLight' : 'C.purpleLight'}, C.line, 20);
  ctx.addText(slide, { text: '${esc(w[1])}', left: ${70 + i * 260}, top: 325, width: 190, height: 70, fontSize: 17, fontFace: 'Arial', color: C.ink, align: 'center', fit: 'shrink' });`).join('\n')}
  ctx.addText(slide, { text: 'Success metrics', left: 105, top: 480, width: 240, height: 30, fontSize: 24, bold: true, fontFace: 'Arial', color: C.ink });
  ctx.addText(slide, { text: '${esc(slide.metrics.join('  /  '))}', left: 105, top: 522, width: 940, height: 40, fontSize: 20, fontFace: 'Arial', color: C.ink, align: 'center', fit: 'shrink' });
`;
  }

  if (slide.type === 'contacts') {
    return `
  title(slide, ctx, '${esc(slide.title)}');
  ctx.addText(slide, { text: '${esc(slide.name)}', left: 430, top: 235, width: 360, height: 70, fontSize: 56, bold: true, fontFace: 'Montserrat', color: C.purple, align: 'center' });
  ctx.addText(slide, { text: '${esc(slide.cta)}', left: 265, top: 350, width: 700, height: 96, fontSize: 26, fontFace: 'Arial', color: C.ink, align: 'center', fit: 'shrink' });
  ctx.addText(slide, { text: 'Prototype → interviews → concierge cohort → paid intent', left: 240, top: 500, width: 760, height: 40, fontSize: 24, bold: true, fontFace: 'Arial', color: C.ink, align: 'center' });
`;
  }

  return `title(slide, ctx, '${esc(slide.title)}');`;
}

function table(rows, widths, x, y, h) {
  return rows.map((row, r) => {
    let xx = x;
    const parts = row.map((value, c) => {
      const fill = r === 0 ? 'C.purpleLight' : 'C.white';
      const bold = r === 0 || c === 0;
      const out = `cell(slide, ctx, '${esc(value)}', ${xx}, ${y + r * h}, ${widths[c]}, ${h}, ${fill}, ${bold}, ${r === 0 ? 15 : 14});`;
      xx += widths[c];
      return out;
    });
    return parts.join('\n  ');
  }).join('\n  ');
}

function writeSlides() {
  fs.rmSync(WORKSPACE, { recursive: true, force: true });
  fs.mkdirSync(SLIDES_DIR, { recursive: true });
  fs.writeFileSync(path.join(SLIDES_DIR, '_shared.mjs'), sharedModule());
  slides.forEach((slide, idx) => {
    fs.writeFileSync(path.join(SLIDES_DIR, `slide-${String(idx + 1).padStart(2, '0')}.mjs`), moduleFor(slide, idx + 1));
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
    '--slide-count', String(slides.length),
    '--workspace', WORKSPACE,
    '--slide-size', '1280x720',
    '--scale', '0.8',
  ], { stdio: 'inherit', env: { ...process.env, NODE_PATH: '/Users/kirill/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules' } });
  if (result.status !== 0) throw new Error(`Deck build failed with status ${result.status}`);
}

writePlan();
writeSlides();
buildDeck();
console.log(`plan=${PLAN_OUT}`);
console.log(`sources=${SOURCE_NOTES}`);
console.log(`pptx=${PPTX_OUT}`);
console.log(`contact_sheet=${CONTACT_SHEET}`);
