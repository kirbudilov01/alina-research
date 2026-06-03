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
  { title: 'AURA', type: 'cover' },
  {
    title: 'What The Leaders Already Prove',
    type: 'leaderGrid',
    leaders: [
      ['Nebula / Co-Star', 'personal guidance', 'birth data, weekly meaning, compatibility, paid readings', '$718K-$797K/mo iOS estimates'],
      ['Calm / Headspace', 'daily ritual', 'subscription trust, annual plans, wellness habit', '$300M/yr Calm proxy'],
      ['Finch / Replika', 'companion loop', 'memory, avatar, gentle return, emotional continuity', '$1.5M-$2.36M/mo estimates'],
      ['Runway / HeyGen', 'visual AI layer', 'video/avatar as premium output, not cheap daily commodity', 'Runway 8s Gen-4 Turbo ~= $0.40']
    ],
    note: 'The market already has the ingredients. AURA is the product format that connects them into one causal weekly experience.'
  },
  {
    title: 'The New Format Is At The Intersection',
    type: 'intersectionThesis',
    pieces: [
      ['Astrology', 'personal meaning'],
      ['Mindfulness', 'daily ritual'],
      ['AI Companion', 'memory / assistant'],
      ['Visual AI', 'Life Canvas / video'],
      ['AURA', 'weekly visual self-guidance']
    ],
    note: 'AURA is not “another horoscope app”. It is a weekly life-series where meaning becomes action and action changes the visual state.'
  },
  {
    title: 'What AURA Is',
    type: 'overview',
    blocks: [
      ['One-line thesis', 'AURA is a weekly visual self-guidance app: birth data + personal context → forecast → daily episode → action/reset → Life Canvas change → tomorrow hook.'],
      ['User promise', 'Not “your zodiac sign says X”. The user should feel: “I understand my week, I did one small action, and I can see how my life picture changed.”'],
      ['Core product', 'A personal pocket forecastist/assistant with memory, weekly seasons, image-first Life Canvas and rare premium video moments.'],
      ['Why now', 'Astrology apps monetize personal meaning, mindfulness apps monetize ritual, AI companions monetize memory, video AI creates premium visual moments. AURA joins these behaviors.'],
      ['Business rule', 'Daily loop must stay cheap. Premium video/avatar must be tokenized, milestone-based or paid, not free daily generation.'],
      ['Strategic gate', 'If users cannot explain why Life Canvas changed, AURA becomes an AI image toy. If they can, AURA becomes a product.']
    ]
  },
  {
    title: 'The Product Loop',
    type: 'pipeline',
    items: [
      ['Birth data + request', 'personal context'],
      ['Weekly forecast', 'season arc'],
      ['Daily episode', 'today focus'],
      ['Action / Reset', 'small behavior'],
      ['Life Canvas', 'visible causality']
    ],
    note: 'The loop is the product: Episode → Action → Reset → Reflection → Life Canvas → Tomorrow Hook.'
  },
  {
    title: 'User Journey: First 30 Days',
    type: 'dayJourney',
    stages: [
      ['Day 0', 'Search moment', 'The user wants meaning for the week, a softer reset, or a visual future-self prompt.'],
      ['Day 1', 'First loop', 'Birth data + context → first forecast → one action → first Life Canvas shift.'],
      ['Day 7', 'First season', 'The user sees a weekly arc, remembers actions, and receives a recap/visual artifact.'],
      ['Day 30', 'Personal system', 'AURA becomes a ritual: assistant memory, seasons, premium visual moments, annual path.']
    ],
    note: 'AURA only works if the user understands the sequence: input → meaning → action → visible change → return tomorrow.'
  },
  {
    title: 'Core Screens',
    type: 'appScreens',
    screens: [
      ['01', 'Birth data', 'date / time / place\ncurrent question'],
      ['02', 'Week forecast', 'season theme\n3 tensions\nfirst promise'],
      ['03', 'Daily episode', 'today focus\nassistant message\naction card'],
      ['04', 'Reset', '2-min practice\nreflection\ncompletion'],
      ['05', 'Life Canvas', 'before / after\nwhat changed\nwhy it changed'],
      ['06', 'Paywall', 'continue season\nPlus / annual\ntoken video']
    ],
    note: 'These are not final UI designs. They define what the designer must make visible on screen.'
  },
  {
    title: 'Life Canvas Must Explain Causality',
    type: 'lifeCanvasDemo',
    leftLabel: 'Before action',
    rightLabel: 'After action',
    cause: 'Because the user completed the reset and reflection, the Canvas changes from “fog / pressure” to “clear route / grounded self”.',
    rule: 'If the user says “AI just drew another picture”, the product fails. If the user says “the picture changed because I acted”, AURA is alive.'
  },
  {
    title: 'Premium Video Is a Magic Moment',
    type: 'premiumMoment',
    claim: 'Video can be included in the subscription only if the model is cheap and capped: one 8s video per week, not unlimited generation.',
    economics: [
      ['Runway 8 sec', '~$0.40 COGS'],
      ['4 videos/mo', '~$1.60 COGS'],
      ['30 daily images', '~$0.60-$1.20 COGS'],
      ['Total media', '~$2.20-$3.80/mo before buffer']
    ],
    note: 'The business move: sell a visual subscription package, but cap it tightly and track every generated asset.'
  },
  {
    title: 'Paywall Architecture',
    type: 'paywallArchitecture',
    tiers: [
      ['Free', '$0', 'first forecast\n3-7 daily cards\nlimited images\nno weekly video', 'activation'],
      ['Plus', '$14.99/mo', 'daily cards\n30 images/mo\n4 weekly videos\nmemory + recap', 'core revenue'],
      ['Annual', '$89/yr', 'same package\nlower churn\nupfront cash', 'cashflow'],
      ['Creator add-on', 'later', 'Alina seasons\nspecial prompts\npremium packs', 'upside']
    ],
    note: 'Paywall appears after the first completed loop, not before the user understands the product.'
  },
  {
    title: 'Why This Is Not Just Astrology',
    type: 'solution',
    leftTitle: 'What existing apps give',
    left: ['Astrology: meaning, but often generic and passive.', 'Mindfulness: ritual, but often not personal enough.', 'AI companion: conversation, but not a structured week.', 'Avatar tools: visuals, but weak causality.'],
    rightTitle: 'What AURA combines',
    right: ['Birth-data context without fatalistic positioning.', 'A weekly season that gives structure.', 'A daily micro-action that creates agency.', 'A Life Canvas that changes for a reason.', 'Premium video as rare proof-of-magic, not daily COGS leak.']
  },
  {
    title: 'Market Map',
    type: 'marketSize',
    items: [
      ['PAM', 'consumer mobile apps', 'AURA competes for the daily habit of opening an app for meaning, reset and self-direction.'],
      ['TAM', '4 paid behaviors', 'personal guidance, wellness ritual, AI companion memory, visual identity/avatar progression.'],
      ['SAM', 'apps + web + AI tools', 'existing research covers app stores, web apps, paywalls, adjacent tools and manual competitor walkthroughs.'],
      ['SOM', '100k-300k users', 'reachable first scale if creator-led GTM, weekly seasons and premium visual moments work.'],
      ['UP', '$30-80M ARR path', 'subscription + annual + premium tokens + creator seasons can create venture-relevant upside.']
    ],
    note: 'The market is not a single horoscope TAM. It is the overlap of paid personal meaning, daily ritual and AI visual identity.'
  },
  {
    title: 'How The Numbers Work',
    type: 'numberLogic',
    steps: [
      ['1', 'External signals', 'Rev.now / Sacra / press / API pricing', 'Revenue, MAU, payers, price, public COGS'],
      ['2', 'Derived benchmarks', 'calculated from public signals', 'ARPMAU, paid conversion, CAC bands, COGS per user'],
      ['3', 'AURA assumptions', 'conservative / base / strong', 'pricing, conversion, token attach, no-free-video rule'],
      ['4', 'Product decisions', 'what we actually build', 'Plus, annual, token video, image-first Life Canvas']
    ],
    note: 'The deck does not treat competitor estimates as truth. It uses them to create bounded assumptions for AURA.'
  },
  {
    title: 'The Four Numbers That Matter',
    type: 'bigNumbers',
    numbers: [
      ['2.5-3.0%', 'base paid conversion', 'derived from Co-Star / Nebula / The Pattern style subscription apps'],
      ['$0.35-$0.50', 'base ARPMAU target', 'AURA needs subscription + some visual/token uplift to beat long-tail astrology'],
      ['$0.80-$1.50', 'strong ARPMAU target', 'only if high-intent premium moments work: future-self, relationship, video'],
      ['<$1.50', 'payer AI/image COGS target', 'daily loop must be cheap enough for $9.99-$14.99 subscription']
    ],
    note: 'If one of these four numbers breaks, the product model must change.'
  },
  {
    title: 'Competitor Economics: The Read',
    type: 'proofMatrix',
    rows: [
      ['Proof question', 'Competitor signal', 'What it proves', 'AURA decision'],
      ['Will people pay for personal meaning?', 'Co-Star iOS: $797.5K/mo, 2.7M MAU, 64K payers', 'yes, but conversion is closer to 2-3%', 'model base conversion at 2.5-3.0%'],
      ['Can spiritual guidance monetize?', 'Nebula iOS: $718K/mo, 52K payers, $0.33 ARPMAU', 'yes, but aggressive paywalls create trust risk', 'sell causality and season, not vague psychic pressure'],
      ['Can daily ritual become large?', 'Calm: $300M/year proxy, 4M+ subscribers', 'yes, if trust and annual habit exist', 'annual plan after first completed week'],
      ['Can AI/avatar create paid intent?', 'Replika Android: $2.36M/mo estimate, 99K payers proxy', 'yes, users pay for memory/avatar/voice', 'assistant memory + visual identity layer'],
      ['Can urgent guidance lift ARPMAU?', 'AstroTime Android: $1.82 ARPMAU, 4.5% conversion', 'yes, high-intent moments monetize better', 'future-self / relationship / video tokens']
    ],
    conclusion: 'AURA should model base-case like subscription self-discovery, and upside like premium visual/guidance moments.'
  },
  {
    title: 'Astrology Unit Economics',
    type: 'competitorEconomics',
    rows: [
      ['Product', 'Revenue / scale signal', 'Visible economics', 'AURA implication'],
      ['Co-Star iOS', '$797.5K/mo; 2.7M MAU; 64K payers', 'ARPMAU ~$0.30; conversion ~2.4%; $8.99/mo + IAP', 'base paid conversion should be 2-3%, not fantasy 8-10%'],
      ['Nebula iOS', '$718K/mo; 2.2M MAU; 52K payers', 'ARPMAU ~$0.33; conversion ~2.4%; $9.99/mo + weekly IAPs', 'personal guidance monetizes, but paywall trust is fragile'],
      ['The Pattern iOS', '$36.1K/mo; 160K MAU; 4K payers', 'ARPMAU ~$0.23; conversion ~2.5%', 'relationship/self-insight works, but depth alone does not guarantee scale'],
      ['AstroSage Android', '$547.8K/mo; 2.4M MAU; 34K payers', 'ARPMAU ~$0.23; conversion ~1.4%', 'birth-data utility can bring huge reach with lower conversion'],
      ['AstroTime Android', '$440.8K/mo; 242K MAU; 11K payers', 'ARPMAU ~$1.82; conversion ~4.5%', 'urgent guidance mechanics can lift conversion and ARPMAU'],
      ['Astrotalk company', 'Rs 1,214 crore FY25 total revenue reported', 'consultation marketplace, not pure app subscription', 'human/expert layer is upside later, not MVP core']
    ],
    note: 'Source layer: Rev.now estimates and public company/press reports. Directional benchmarks, not audited internal P&L.'
  },
  {
    title: 'Mindfulness Unit Economics',
    type: 'competitorEconomics',
    rows: [
      ['Product', 'Revenue / scale signal', 'Visible economics', 'AURA implication'],
      ['Calm brand', '$300M/year proxy; 4M+ paying subscribers', '$70/year and $14.99/mo price anchors', 'annual wellness subscription can be very large when trust and routine exist'],
      ['Calm Android', '$2.35M/mo; 3.6M MAU; 85K payers', 'ARPMAU ~$0.65; conversion ~2.4%', 'wellness can monetize above astrology ARPMAU, but needs retention'],
      ['Headspace', '~$200M/year brand proxy; app-store proxy ~$39-40M/year', '$12.99/mo price signal', 'off-store/B2B revenue can understate visible app economics'],
      ['Waking Up', '$492.7K/mo iOS leaderboard estimate', '$19.99/mo; $129.99/year', 'trusted teacher voice can justify premium pricing'],
      ['Balance Android', '$180K/mo; ~317K MAU; 11K payers', 'ARPMAU ~$0.57; conversion ~3.5%', 'personalization can outperform generic meditation libraries'],
      ['Meditopia iOS', '$118.4K/mo; 629K MAU', 'ARPMAU ~$0.19', 'large MAU without strong monetization can still be thin']
    ],
    note: 'AURA should borrow daily ritual and annual plan logic, not build a giant meditation library.'
  },
  {
    title: 'AI Companion / Avatar Economics',
    type: 'competitorEconomics',
    rows: [
      ['Product', 'Revenue / scale signal', 'What people pay for', 'AURA implication'],
      ['Character.AI', '$30M-$32M ARR proxy; c.ai+ $9.99/mo', 'priority, memory, engagement, chat volume', 'AI can monetize engagement, but inference cost and safety dominate'],
      ['Replika Android', '$2.36M/mo estimate; 99K payers proxy', 'AI companion, avatar, memory, voice/video features', 'users pay for emotional continuity, not raw text chat'],
      ['Finch iOS', '$1.5M-$2.0M/mo public estimate range', 'self-care pet, soft progression, daily loop, Plus features', 'daily companion mechanics can monetize without scary “therapy” positioning'],
      ['HeyGen / D-ID', 'API pricing proves avatar video is paid compute', '$0.05-$0.0667/sec or plan/credit based pricing', 'talking avatar is a premium event, not free habit content'],
      ['AURA', '$9.99-$14.99/mo + tokens target', 'season, assistant memory, Life Canvas, rare video', 'must be a cost-controlled AI product under a premium visual wrapper']
    ],
    note: 'The avatar is not decoration. It has to show the user why the week changed.'
  },
  {
    title: 'What People Actually Pay For',
    type: 'pricingTable',
    rows: [
      ['Paid object', 'Seen in competitors', 'Why users pay', 'AURA equivalent'],
      ['Monthly subscription', 'Co-Star, Nebula, CHANI, Calm, Balance', 'regular personal value and lower friction', 'AURA Plus: weekly season + memory + Life Canvas'],
      ['Annual subscription', 'Calm, Headspace, Waking Up, CHANI', 'commitment and cashflow when trust is formed', '$69-$89 annual after first completed week'],
      ['Compatibility / relationship report', 'Co-Star, The Pattern, Nebula', 'emotionally high-stakes personal insight', 'relationship / future-self special episode'],
      ['Live or urgent guidance', 'Astrotalk, AstroTime, Astroyogi', 'anxiety moment: “answer me now”', 'AI assistant first; human/creator layer later'],
      ['Special visual asset', 'soulmate sketch, aura reading, avatar/video tools', 'ownable image of self/future/period', 'Life Canvas trailer or future-self video token']
    ]
  },
  {
    title: 'Pricing Decision',
    type: 'auraMath',
    rows: [
      ['Plan', 'Price', 'Included generation', 'Target margin logic'],
      ['Free', '$0', 'first forecast + Day 1 loop + one medium Life Canvas', 'COGS target <$0.20; goal is activation, not generosity'],
      ['Plus monthly', '$9.99-$14.99', 'daily text loop, memory, weekly recap, 2-4 images/mo', 'net after app fee ~$8.49-$12.74; COGS target <$1.50'],
      ['Plus annual', '$69-$89/year', 'same loop + annual season framing', 'cashflow and lower churn pressure'],
      ['Low video token', '$2.99-$4.99', 'Runway/Luma-class 5-8 sec visual moment', 'works if COGS <$1 and retries are capped'],
      ['Premium video token', '$6.99-$9.99', 'Veo/Replicate/HeyGen high-quality moment', 'needed when COGS is $2-$4+'],
      ['Creator season', '$14.99-$29.99', 'limited guided pack / custom assistant style', 'monetizes content leverage, not only compute']
    ],
    conclusion: 'AURA should not sell unlimited AI. It sells season, memory, causality and rare premium visual events.'
  },
  {
    title: 'Conversion / ARPMAU Assumptions',
    type: 'finance',
    rows: [
      ['Metric', 'Conservative', 'Base', 'Strong'],
      ['Paid conversion', '1.5%', '2.5-3.0%', '4.0-5.0%'],
      ['Monthly ARPMAU', '$0.20', '$0.35-$0.50', '$0.80-$1.50'],
      ['Monthly price', '$7.99-$9.99', '$9.99-$14.99', '$14.99'],
      ['Token buyer share', '3%', '8-12%', '15-20%'],
      ['CAC payer', '$300-$800', '$100-$250', '$30-$100'],
      ['Verdict', 'content app risk', 'works if causality is understood', 'works only with high-intent moments']
    ],
    note: 'These assumptions are derived from competitor estimates: Co-Star, Nebula, The Pattern, AstroSage, AstroTime, Calm and Balance.'
  },
  {
    title: 'From Benchmarks To AURA Model',
    type: 'assumptionBridge',
    rows: [
      ['Input', 'Observed / benchmark range', 'AURA base assumption', 'Why this is reasonable'],
      ['Paid conversion', '1.4-2.5% subscription astrology; 3.5% Balance; 4.5% AstroTime', '2.5-3.0%', 'base case assumes value is proven before paywall'],
      ['ARPMAU', '$0.19-$0.37 subscription astrology; $0.57-$0.65 wellness; $1.82+ urgent guidance', '$0.35-$0.50', 'AURA needs to outperform generic astrology through visual/token uplift'],
      ['Monthly price', '$8.99-$14.99 common paid band; $19.99+ premium teacher apps', '$9.99-$14.99', 'sits inside proven consumer subscription range'],
      ['Video COGS', 'Runway ~$0.40 / 8s; Veo ~$4 / 8s; HeyGen ~$1.50-$2 / 30s', '4 Runway clips / paid month; no free video', 'weekly video can sit in Plus only if model, retries and count are capped'],
      ['CAC payer', '$50-$150 organic/social; $150-$500+ paid web2app', '$100-$250 base', 'paid acquisition only after retention and paywall data']
    ],
    note: 'This is the missing bridge: competitor data is not the model; it is the guardrail for the model.'
  },
  {
    title: 'Generation Subscription Package',
    type: 'generationPackage',
    rows: [
      ['Asset', 'Frequency / month', 'Model option', 'Unit COGS', 'Monthly COGS'],
      ['Daily card text', '30', 'LLM mini / structured prompt', '$0.003-$0.008', '$0.10-$0.25'],
      ['Daily image / Life Canvas frame', '30', 'Runway gen4_image_turbo or low-cost image model', '$0.02-$0.04', '$0.60-$1.20'],
      ['Weekly 8s video', '4', 'Runway Gen-4 Turbo, 5 credits/sec', '~$0.40', '~$1.60'],
      ['Retry / failed generation buffer', '20-30%', 'media retry reserve', 'n/a', '$0.50-$1.10'],
      ['Storage / infra / analytics', 'month', 'S3 + backend + events', 'n/a', '$0.20-$0.50'],
      ['Total paid user COGS', 'Plus package', 'subscription generation bundle', 'n/a', '~$2.40-$4.05/mo']
    ],
    note: 'This is the recommended subscription bundle: 30 daily visual cards + 4 weekly videos, tightly capped.'
  },
  {
    title: 'Free User Cost & Conversion Break-Even',
    type: 'freeUserModel',
    rows: [
      ['Free scenario', 'Included usage', 'Free COGS / activated user', 'What must happen'],
      ['Light free trial', 'first forecast + 3 cards + 1 image', '$0.08-$0.18', 'safe for broad acquisition tests'],
      ['7-day free loop', '7 daily cards + 7 images + no video', '$0.25-$0.55', 'only works if D1/D7 and paywall intent are visible'],
      ['Free video trial', '1 free 8s Runway video', '+$0.40-$0.60', 'risky unless it dramatically improves conversion'],
      ['Plus contribution', '$14.99 price, 15% fee, $2.40-$4.05 COGS', '$8.70-$10.35 / month', 'base subscription margin per payer'],
      ['Break-even CAC activated', '3% conversion, 3-month payer life', '~$0.53-$0.75', 'paid ads cannot scale yet without better LTV'],
      ['Strong CAC activated', '5% conversion, 4-month payer life', '~$1.55-$2.05', 'possible only with strong retention and visual proof']
    ],
    note: 'Free users are not free. AURA should test paid acquisition only after free COGS and paywall conversion are measured.'
  },
  {
    title: 'Generation Cost Benchmarks',
    type: 'costBenchmarks',
    rows: [
      ['Layer', 'Provider / model', 'Public price signal', 'AURA implication'],
      ['LLM', 'OpenAI GPT-4.1 mini', '$0.40 / 1M input tokens; $1.60 / 1M output tokens', 'daily text loop is cheap if prompts are structured'],
      ['Image', 'OpenAI Images', '~$0.01 low / $0.04 medium / $0.17 high per square image', 'Life Canvas can be included if image count is capped'],
      ['Cinematic video', 'Google Veo 2 / Vertex AI', '~$0.50 per generated second', '8 sec ~= $4.00; cannot be free daily content'],
      ['Cinematic video', 'Runway API', '$0.25 per 5 sec API example', '8 sec ~= $0.40; viable for tests, still needs retry budget'],
      ['Video model', 'Replicate Wan 2.1 720p', '$0.24 per output second', '8 sec ~= $1.92; better as paid token / milestone'],
      ['Talking avatar', 'HeyGen API Avatar IV/V', '$0.05/sec photo avatar; $0.0667/sec digital twin', '30 sec ~= $1.50-$2.00; not a default daily loop'],
      ['Avatar API', 'D-ID Build plan', '$14.4/mo annual plan; up to 16 offline video min', '~$0.90/min plan math, but limits/watermark/credits matter']
    ],
    note: 'All prices are public API/pricing-page signals as of June 2026; exact billing must be rechecked before procurement.'
  },
  {
    title: 'Cost Per User / Month',
    type: 'unitCost',
    rows: [
      ['User type', 'Usage assumption', 'Variable AI cost', 'Business meaning'],
      ['Free active user', '8 text loops + 1 medium image + no video', '$0.10-$0.20 / MAU', 'safe if onboarding is capped and no free video exists'],
      ['Engaged free user', '20 text loops + 2 images + no video', '$0.25-$0.45 / MAU', 'acceptable only if retention and conversion are visible'],
      ['Plus with Runway video', '30 cards + 30 images + 4 weekly 8s videos', '$2.40-$4.05 / payer', '$14.99 subscription can hold margin if retries are capped'],
      ['Plus with Veo video', '+ four weekly 8s Veo clips', '+$16.00 before retries', 'too expensive for base subscription'],
      ['Premium avatar token', 'HeyGen / talking-avatar moment', '$1.50-$2.00 per 30 sec', 'sell as separate pack or milestone'],
      ['High-quality video token', 'Replicate / Veo / premium model', '$1.92-$4.00 per 8 sec', 'price token by model quality']
    ],
    formula: 'COGS = LLM tokens + images + video seconds × provider price + storage + support + failed-generation buffer.',
    conclusion: 'The daily product can be cheap. Weekly video is viable only as a capped paid subscription benefit or token.'
  },
  {
    title: 'Video Cost Stress Test',
    type: 'videoStress',
    rows: [
      ['Scenario', '100 users', '1,000 users', '10,000 users', 'Conclusion'],
      ['4 weekly Runway clips / payer', '$160', '$1,600', '$16,000', 'viable inside $14.99 Plus if paid cohort is real'],
      ['4 weekly Veo clips / payer', '$1,600', '$16,000', '$160,000', 'not viable as base subscription bundle'],
      ['1 free Runway trial clip', '$40 COGS', '$400 COGS', '$4,000 COGS', 'only if it sharply lifts paid conversion'],
      ['1 premium Replicate/Wan clip', '$192 COGS', '$1,920 COGS', '$19,200 COGS', 'needs $4.99-$9.99 token or bundle'],
      ['1 paid 30s HeyGen avatar', '$150-$200 COGS', '$1,500-$2,000', '$15,000-$20,000', 'works for premium forecast / assistant moment'],
      ['30 daily Life Canvas images', '$60-$120 COGS', '$600-$1,200', '$6,000-$12,000', 'safe only for paid users, capped retries']
    ],
    note: 'This is the decision: Runway can be the weekly subscription video; Veo/avatars stay premium or later.'
  },
  {
    title: 'AURA Base Financial Model',
    type: 'finance',
    rows: [
      ['Scenario', '10k MAU', '50k MAU', '150k MAU'],
      ['Paid conversion', '1.5%', '3.0%', '4.5%'],
      ['Payers', '150', '1,500', '6,750'],
      ['Gross subscription @ $14.99', '$2.2K/mo', '$22.5K/mo', '$101.2K/mo'],
      ['Net after 15% fee', '$1.9K/mo', '$19.1K/mo', '$86.0K/mo'],
      ['Paid-user generation COGS', '$0.4K-$0.6K', '$3.6K-$6.1K', '$16.2K-$27.3K'],
      ['Verdict', 'thin until retention is proven', 'works if free COGS is capped', 'strong if annual + token upsell work']
    ],
    note: 'Base model assumes Plus users receive 30 daily visuals and 4 Runway 8s videos per month.'
  },
  {
    title: 'Marketing Benchmarks',
    type: 'competitorEconomics',
    rows: [
      ['Competitor / archetype', 'Public marketing signal', 'Risk', 'AURA use'],
      ['Nebula', '$6.8M/mo YouTube ad spend estimate; 620 creatives; 18.6M visits Jan 2026; 50 landing pages', 'paid scale requires high LTV and aggressive funnel', 'use as paid-test inspiration, not MVP operating model'],
      ['Nebula prelands', 'soulmate sketch 10% ad traffic; marriage compatibility 8.2%; aura reading 8%', 'curiosity hooks can become scammy', 'test future-self / visual week / relationship hooks carefully'],
      ['Co-Star', '20M+ downloads with no real marketing spend; 25% young US women 18-25 downloaded historically', 'hard to force virality', 'build shareable identity language and relationship/social hooks'],
      ['Astrotalk', 'FY25 total expenses Rs 1,129 crore; marketing/tech/ops/talent growth cited', 'marketplace growth is expensive operationally', 'do not start with marketplace/expert model'],
      ['CHANI / Waking Up', 'trusted founder/teacher voice', 'requires real authority', 'use Alina/creator expertise without guru tone']
    ],
    note: 'Sources: Web2App World, Axios/TIME, Moneycontrol/ET-style reporting and qualitative product observations.'
  },
  {
    title: 'AURA Marketing Funnel Model',
    type: 'marketingModel',
    rows: [
      ['Stage', 'Conservative', 'Base', 'Strong', 'Decision'],
      ['Visitor -> signup', '8%', '15%', '25%', 'landing must be tested before ad scale'],
      ['Signup -> activated', '35%', '50%', '65%', 'activation = first completed loop'],
      ['Activated -> paid', '1.5%', '3.0%', '5.0%', 'paywall after value moment'],
      ['CAC activated target', '<$0.50', '<$1.00', '<$2.00', 'based on COGS + contribution margin'],
      ['First test budget', '$500', '$1,500-$3,000', '$5,000', 'small tests before scaling'],
      ['First 1,000 users', 'warm/interviews', 'creator + organic', 'creator + paid test', 'Alina marketing layer can sit above this']
    ],
    note: 'Marketing cannot be modeled separately from free COGS. If free usage is generous, CAC must be extremely low.'
  },
  {
    title: 'Go-to-Market Strategy',
    type: 'gtm',
    blocks: [
      ['1. First 100 are not bought by ads', 'warm users, interviews, manual weekly forecasts and concierge cohort. Goal: understand the loop, not installs.'],
      ['2. Creator-led proof', 'micro creators in astrology/self-growth/visual AI pass a 7-day season and show the experience, not a generic ad.'],
      ['3. Short-form hooks', 'future-self, weekly forecast, avatar transformation, “not horoscope”, before/after Life Canvas and paid-intent CTA.'],
      ['4. Shareable artifacts', 'Life Canvas card, season recap, future-self poster and trailer week as viral layer after value moment.']
    ]
  },
  {
    title: '30-Day Validation Plan',
    type: 'validation',
    weeks: [
      ['Week 1', '20-30 interviews + manual weekly forecast concierge'],
      ['Week 2', '10-screen prototype + 2 Life Canvas visual styles'],
      ['Week 3', 'landing + price test $7.99 / $9.99 / $14.99'],
      ['Week 4', '30-50 users through 3-7 days + paid-intent test']
    ],
    metrics: ['>70% understand category', '>50% explain Canvas change', 'D1 >20%', 'paid intent >5%']
  },
  {
    title: 'Product Scope: MVP vs Later',
    type: 'pricingTable',
    rows: [
      ['Layer', 'MVP', 'Later', 'Why'],
      ['Core loop', 'Episode → Action → Reset → Reflection → Life Canvas', 'season branching and deeper memory', 'must prove causality first'],
      ['Assistant', 'chosen tone + weekly context + memory summary', 'voice/video assistant, creator voices', 'text memory is cheaper and faster to validate'],
      ['Visual layer', 'image-first Life Canvas + avatar style', 'cinematic video, talking avatar', 'video is premium COGS'],
      ['Monetization', 'Plus + annual + one token test', 'creator seasons, expert layer, marketplace', 'avoid operational complexity before retention'],
      ['Community', 'none in MVP', 'sharing, social, cohorts', 'do not build social network before core value is proven']
    ]
  },
  {
    title: 'Risks',
    type: 'risks',
    rows: [
      ['Risk', 'How it breaks', 'Mitigation'],
      ['Looks like horoscope', 'user thinks it is generic astrology', 'position as weekly life-series and action, not fate'],
      ['Avatar feels random', 'user cannot explain visual change', 'show cause next to Canvas and tie it to action/reflection'],
      ['Video cost kills margin', 'free users generate expensive clips', 'premium/token video only; log COGS per asset'],
      ['AI sounds generic', 'low trust and no return', 'prompt QA, user feedback and memory guardrails'],
      ['No paid intent', 'users like it but do not pay', 'paywall after first completed loop and price tests by cohort']
    ]
  },
  {
    title: 'Growth Roadmap',
    type: 'roadmap',
    steps: [
      ['IDEA', 'forecast + avatars'],
      ['MVP', 'week season + Canvas'],
      ['PAID', 'Plus + first token'],
      ['RETENTION', 'D7 / season recaps'],
      ['SCALE', 'creators + paid tests'],
      ['$1M ARR', 'visual engine + annual']
    ]
  },
  {
    title: 'What We Should Build',
    type: 'overview',
    blocks: [
      ['Product', 'A weekly visual self-guidance app where the user enters birth data/context, receives a forecast, completes daily micro-actions, and sees Life Canvas evolve.'],
      ['MVP', 'Text-first assistant, weekly season, daily episode, action/reset/reflection, image-first Life Canvas, Plus paywall, one premium video token test.'],
      ['Pricing', '$9.99-$14.99 monthly, $69-$89 annual, $2.99-$9.99 visual/video tokens, no unlimited generation.'],
      ['GTM', 'Start with interviews and concierge cohorts, then creator-led proof, then small paid tests around visual week/future-self hooks.'],
      ['Kill criteria', 'Stop or pivot if users cannot explain Canvas causality, D1 is below 20%, paid intent stays below 5%, or video COGS cannot be controlled.'],
      ['Next step', 'Create 3-5 visual examples, clickable prototype, 30-user cohort and one pricing/token experiment.']
    ]
  },
  {
    title: 'Development Offer: Phase 1',
    type: 'offerSlide',
    rows: [
      ['Item', 'Included in €5,000 Phase 1', 'Not included yet'],
      ['Prototype', 'clickable Figma / screen logic / product flow', 'full native mobile app'],
      ['Generation pipeline', 'manual or semi-automated Runway/image workflow for 30-user test', 'scaled backend with unlimited generation'],
      ['Content logic', 'weekly forecast prompts, daily card structure, Life Canvas explanation', 'large content marketplace'],
      ['Landing / test', 'simple landing, price test, lead capture, analytics events', 'large paid acquisition campaign'],
      ['Validation pack', '30-user cohort plan, metrics, interview script, results template', 'guaranteed revenue or scale'],
      ['Alina side', 'marketing/creator distribution and expert content layer', 'handled outside development budget']
    ],
    note: 'Offer logic: do not sell a huge build yet. Sell a tight proof sprint that verifies product loop, generation cost and paid intent.'
  },
  {
    title: 'Contacts / Next Step',
    type: 'contacts',
    name: 'AURA',
    cta: 'Next step: generate visual examples, assemble clickable prototype, test first 30 users, and verify whether Life Canvas causality is understood.'
  }
];

const sources = [
  ['AURA Competitor Economics Report', 'Internal sourcebook created 2026-06-03', 'Astrology, mindfulness, AI companion/avatar revenue proxies, ARPMAU, paid conversion, pricing, CAC, marketing benchmarks and AI generation costs.', 'reports/aura-competitor-economics-report.md'],
  ['Calm', 'Sacra', 'Revenue $300M in 2023; $70/year subscription; 4M+ paying subscribers; 2-7% paid conversion commentary.', 'https://sacra.com/c/calm/'],
  ['Headspace', 'Udonis statistics / public app-store proxy', 'Headspace estimated at roughly $39-40M/year app-store revenue and ~1.7M monthly users; directional public estimate.', 'https://www.blog.udonis.co/statistics/headspace'],
  ['Character.AI', 'Sacra / Character.AI pricing page', '$30M annualized revenue in July 2025; $50M projected end-2025; c.ai+ $9.99/month; 20M MAU early 2024.', 'https://sacra.com/c/character-ai/ and https://character.ai/subscribe'],
  ['Character.AI', 'AI Wiki / public research proxy', 'Revenue grew from roughly $15.2M to $32.2M; user engagement remains high; safety/inference cost risk noted.', 'https://aiwiki.ai/wiki/character_ai'],
  ['Co-Star', 'Adapty / Trend Apps / Axios', '$300k-$500k/month public estimates; 200k+ monthly downloads estimate; $15M Series A and 20M+ downloads reported by Axios.', 'https://adapty.io/paywall-library/co-star-personalized-astrology/ and https://trendapps.dev/app/ios/1264782561/ and https://www.axios.com/2021/04/14/astrology-app-co-star-raises-15-million-funding'],
  ['Replika', 'Rev.now Android estimate', '$2.36M/month Play Store estimate; $28.35M/year; 99K paying users estimate; ~$17.23/month proxy.', 'https://rev.now/app/android/replika-my-ai-friend-ux7ec/'],
  ['Replika pricing', 'CompanionWise pricing guide', 'Replika Pro price ranges and paid features: voice/video/AR/avatar customization/memory.', 'https://companionwise.com/faqs/replika-pricing/'],
  ['Finch', 'Rev.now / SensorTower snippet / ScreensDesign', '$1.5-2.0M/month public estimates; Finch Plus monthly price around $9.99.', 'https://rev.now/app/ios/finch-self-care-pet-95748/ and https://app.sensortower.com/overview/1528595748 and https://screensdesign.com/showcase/finch-self-care-pet'],
  ['Nebula', 'Rev.now iOS/Android estimates', '$718k/month App Store estimate; $125.9k/month Play Store estimate; iOS estimate includes 52K paying users; IAP tiers include $7.99 weekly, $9.99 monthly, $24.99 monthly / $29.99 three-month signals.', 'https://rev.now/app/ios/nebula-spiritual-guidance-69523/ and https://rev.now/app/android/nebula-spiritual-guidance-4a0ag/'],
  ['CHANI', 'Rev.now / Appark / Statista snippets', 'CHANI appears as top-grossing astrology/wellness app in public rankings; estimates range around $674K-$832K/month.', 'https://rev.now/best/astrology-apps/ and https://appark.ai/en/blog/market-insights-best-astrology-app-2026-growth-analysis and https://www.statista.com/statistics/1451664/top-horoscope-apps-us-market-revenue/'],
  ['The Pattern', 'Adapty paywall library', 'Last-month estimates around 90K downloads and $400K revenue; paywall reference.', 'https://adapty.io/paywall-library/the-pattern/'],
  ['OpenAI pricing', 'OpenAI official pricing', 'GPT Image pricing is token-based; pricing calculator and token rates used as source for image-cost assumptions.', 'https://openai.com/api/pricing/'],
  ['Veo pricing', 'Google Vertex AI pricing / public reporting', 'Veo-class video remains materially more expensive than Runway Gen-4 Turbo and is treated as premium/high-cost option.', 'https://cloud.google.com/vertex-ai/generative-ai/pricing and https://www.gadgets360.com/ai/news/google-veo-2-video-generation-ai-model-pricing-vertex-ai-platform-7783807/amp'],
  ['Runway API pricing', 'Runway developer docs', 'Credits cost $0.01; Gen-4 Turbo is 5 credits/sec; an 8s clip is about 40 credits / $0.40; gen4_image_turbo is 2 credits per image.', 'https://docs.dev.runwayml.com/guides/pricing/'],
  ['Replicate Wan 2.1 pricing', 'Replicate model page', 'Wan 2.1 720p price around $0.24 per output second.', 'https://replicate.com/wavespeedai/wan-2.1-t2v-720p/api'],
  ['Luma pricing', 'APIs.io / Luma pricing profile', 'Ray-2 public API pricing proxy around $0.08/second; official Luma page uses credits/plans and should be rechecked before build.', 'https://plans.apis.io/plans/luma-ai/luma-ai-plans-pricing/ and https://lumalabs.ai/pricing'],
  ['HeyGen API pricing', 'HeyGen help/API docs', 'API pay-as-you-go: standard avatar video around $1/min, Avatar IV $3-$4/min depending avatar type and resolution.', 'https://help.heygen.com/en/articles/10060327-heygen-api-pricing-explained'],
  ['D-ID API pricing', 'D-ID official pricing page', 'Build plan at $14.4/month annual with up to 16 min offline video; trial includes 3 min video.', 'https://www.d-id.com/pricing/api?from=studio_settings'],
];

function esc(s) {
  return String(s).replace(/`/g, '\\`').replace(/\$/g, '\\$').replace(/\n/g, '\\n');
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

export function mark(slide, ctx, x = 48, y = 30, size = 58) {
  ctx.addShape(slide, { left: x, top: y, width: size, height: size, fill: C.purpleLight, line: { style: 'solid', fill: C.purpleLight, width: 0 } });
  ctx.addShape(slide, { left: x + 17, top: y + 10, width: size - 34, height: size - 20, fill: C.purple, line: { style: 'solid', fill: C.purple, width: 0 } });
  ctx.addText(slide, { text: 'A', left: x + 19, top: y + 17, width: size - 38, height: size - 34, fontSize: 25, bold: true, fontFace: 'Montserrat', color: C.white, align: 'center' });
}

export function title(slide, ctx, text) {
  mark(slide, ctx);
  ctx.addText(slide, { text, left: 128, top: 43, width: 960, height: 42, fontSize: 34, bold: true, fontFace: 'Montserrat', color: C.purple, fit: 'shrink' });
  ctx.addShape(slide, { left: 50, top: 106, width: 1080, height: 1.5, fill: C.purpleLight, line: { style: 'solid', fill: C.purpleLight, width: 0 } });
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

  if (slide.type === 'leaderGrid') {
    return `
  title(slide, ctx, '${esc(slide.title)}');
  ${slide.leaders.map((l, i) => {
    const x = 70 + (i % 2) * 545;
    const y = 150 + Math.floor(i / 2) * 205;
    return `
  ctx.addShape(slide, { left: ${x}, top: ${y}, width: 485, height: 165, fill: ${i === 3 ? 'C.greenLight' : 'C.purpleLight'}, line: { style: 'solid', fill: C.line, width: 1.1 } });
  ctx.addText(slide, { text: '${esc(l[0])}', left: ${x + 22}, top: ${y + 18}, width: 220, height: 28, fontSize: 23, bold: true, fontFace: 'Arial', color: C.ink, fit: 'shrink' });
  ctx.addText(slide, { text: '${esc(l[1])}', left: ${x + 265}, top: ${y + 20}, width: 190, height: 24, fontSize: 17, bold: true, fontFace: 'Arial', color: C.purpleDark, align: 'right', fit: 'shrink' });
  ctx.addText(slide, { text: '${esc(l[2])}', left: ${x + 24}, top: ${y + 66}, width: 440, height: 42, fontSize: 16, fontFace: 'Arial', color: C.ink, fit: 'shrink' });
  ctx.addText(slide, { text: '${esc(l[3])}', left: ${x + 24}, top: ${y + 120}, width: 440, height: 24, fontSize: 18, bold: true, fontFace: 'Arial', color: C.ink, fit: 'shrink' });`;
  }).join('\n')}
  ctx.addText(slide, { text: '${esc(slide.note)}', left: 150, top: 610, width: 850, height: 34, fontSize: 20, bold: true, fontFace: 'Arial', color: C.ink, align: 'center', fit: 'shrink' });
`;
  }

  if (slide.type === 'intersectionThesis') {
    return `
  title(slide, ctx, '${esc(slide.title)}');
  ${slide.pieces.slice(0, 4).map((p, i) => {
    const x = i < 2 ? 105 + i * 290 : 105 + (i - 2) * 290;
    const y = i < 2 ? 185 : 405;
    return `
  pill(slide, ctx, '${esc(p[0])}', ${x}, ${y}, 220, 78, ${i === 3 ? 'C.greenLight' : 'C.purpleLight'}, C.line, 19);
  ctx.addText(slide, { text: '${esc(p[1])}', left: ${x}, top: ${y + 92}, width: 220, height: 28, fontSize: 16, fontFace: 'Arial', color: C.ink, align: 'center', fit: 'shrink' });`;
  }).join('\n')}
  ctx.addShape(slide, { left: 720, top: 205, width: 300, height: 250, fill: C.purple, line: { style: 'solid', fill: C.line, width: 1.2 } });
  ctx.addText(slide, { text: '${esc(slide.pieces[4][0])}', left: 740, top: 252, width: 260, height: 52, fontSize: 46, bold: true, fontFace: 'Montserrat', color: C.white, align: 'center' });
  ctx.addText(slide, { text: '${esc(slide.pieces[4][1])}', left: 758, top: 330, width: 224, height: 46, fontSize: 23, bold: true, fontFace: 'Arial', color: C.white, align: 'center', fit: 'shrink' });
  ctx.addText(slide, { text: '${esc(slide.note)}', left: 145, top: 590, width: 880, height: 42, fontSize: 21, bold: true, fontFace: 'Arial', color: C.ink, align: 'center', fit: 'shrink' });
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

  if (slide.type === 'dayJourney') {
    return `
  title(slide, ctx, '${esc(slide.title)}');
  ctx.addShape(slide, { left: 92, top: 330, width: 960, height: 3, fill: C.purple, line: { style: 'solid', fill: C.purple, width: 0 } });
  ${slide.stages.map((s, i) => `
  ctx.addShape(slide, { geometry: 'ellipse', left: ${84 + i * 300}, top: 280, width: 112, height: 112, fill: ${i === 1 ? 'C.purple' : i === 3 ? 'C.greenLight' : 'C.purpleLight'}, line: { style: 'solid', fill: C.line, width: 1.2 } });
  ctx.addText(slide, { text: '${esc(s[0])}', left: ${96 + i * 300}, top: 318, width: 88, height: 25, fontSize: 20, bold: true, fontFace: 'Arial', color: ${i === 1 ? 'C.white' : 'C.ink'}, align: 'center', fit: 'shrink' });
  ctx.addText(slide, { text: '${esc(s[1])}', left: ${40 + i * 300}, top: 430, width: 200, height: 26, fontSize: 21, bold: true, fontFace: 'Arial', color: C.ink, align: 'center', fit: 'shrink' });
  ctx.addText(slide, { text: '${esc(s[2])}', left: ${35 + i * 300}, top: 468, width: 210, height: 85, fontSize: 16, fontFace: 'Arial', color: C.ink, align: 'center', fit: 'shrink' });`).join('\n')}
  ctx.addText(slide, { text: '${esc(slide.note)}', left: 142, top: 600, width: 860, height: 34, fontSize: 20, bold: true, fontFace: 'Arial', color: C.ink, align: 'center', fit: 'shrink' });
`;
  }

  if (slide.type === 'appScreens') {
    return `
  title(slide, ctx, '${esc(slide.title)}');
  ${slide.screens.map((s, i) => {
    const x = 58 + (i % 6) * 185;
    const y = 165;
    return `
  ctx.addShape(slide, { left: ${x}, top: ${y}, width: 138, height: 330, fill: C.white, line: { style: 'solid', fill: C.line, width: 1.3 } });
  ctx.addShape(slide, { left: ${x + 11}, top: ${y + 14}, width: 116, height: 45, fill: C.purpleLight, line: { style: 'solid', fill: C.purpleLight, width: 0 } });
  ctx.addText(slide, { text: '${esc(s[0])}', left: ${x + 20}, top: ${y + 24}, width: 34, height: 20, fontSize: 16, bold: true, fontFace: 'Arial', color: C.purpleDark, align: 'center' });
  ctx.addText(slide, { text: '${esc(s[1])}', left: ${x + 48}, top: ${y + 23}, width: 72, height: 22, fontSize: 12, bold: true, fontFace: 'Arial', color: C.ink, fit: 'shrink' });
  ctx.addShape(slide, { geometry: 'ellipse', left: ${x + 43}, top: ${y + 86}, width: 52, height: 52, fill: ${i === 4 ? 'C.greenLight' : 'C.purpleLight'}, line: { style: 'solid', fill: C.line, width: 0.8 } });
  ctx.addText(slide, { text: '${esc(s[2])}', left: ${x + 16}, top: ${y + 166}, width: 106, height: 82, fontSize: 12, fontFace: 'Arial', color: C.ink, align: 'center', fit: 'shrink' });
  ctx.addShape(slide, { left: ${x + 24}, top: ${y + 274}, width: 90, height: 24, fill: ${i === 5 ? 'C.greenLight' : 'C.purpleLight'}, line: { style: 'solid', fill: C.line, width: 0.6 } });
  ctx.addText(slide, { text: '${i === 5 ? 'choose plan' : 'continue'}', left: ${x + 28}, top: ${y + 279}, width: 82, height: 12, fontSize: 10, bold: true, fontFace: 'Arial', color: C.ink, align: 'center', fit: 'shrink' });`;
  }).join('\n')}
  ctx.addText(slide, { text: '${esc(slide.note)}', left: 174, top: 570, width: 820, height: 34, fontSize: 20, bold: true, fontFace: 'Arial', color: C.ink, align: 'center', fit: 'shrink' });
`;
  }

  if (slide.type === 'lifeCanvasDemo') {
    return `
  title(slide, ctx, '${esc(slide.title)}');
  ctx.addText(slide, { text: '${esc(slide.leftLabel)}', left: 160, top: 166, width: 260, height: 30, fontSize: 23, bold: true, fontFace: 'Arial', color: C.ink, align: 'center' });
  ctx.addText(slide, { text: '${esc(slide.rightLabel)}', left: 650, top: 166, width: 260, height: 30, fontSize: 23, bold: true, fontFace: 'Arial', color: C.ink, align: 'center' });
  ctx.addShape(slide, { left: 112, top: 210, width: 360, height: 250, fill: C.purpleLight, line: { style: 'solid', fill: C.line, width: 1.2 } });
  ctx.addShape(slide, { geometry: 'ellipse', left: 165, top: 260, width: 120, height: 120, fill: '#D8D5E6', line: { style: 'solid', fill: '#D8D5E6', width: 0 } });
  ctx.addShape(slide, { geometry: 'ellipse', left: 262, top: 235, width: 145, height: 145, fill: '#C4B7F5', line: { style: 'solid', fill: '#C4B7F5', width: 0 } });
  ctx.addText(slide, { text: 'fog / pressure\\nunclear week', left: 158, top: 405, width: 270, height: 42, fontSize: 20, bold: true, fontFace: 'Arial', color: C.ink, align: 'center', fit: 'shrink' });
  ctx.addShape(slide, { left: 605, top: 210, width: 360, height: 250, fill: '#F4FFF0', line: { style: 'solid', fill: C.line, width: 1.2 } });
  ctx.addShape(slide, { geometry: 'ellipse', left: 668, top: 258, width: 120, height: 120, fill: C.greenLight, line: { style: 'solid', fill: C.greenLight, width: 0 } });
  ctx.addShape(slide, { left: 780, top: 268, width: 125, height: 28, fill: C.purple, line: { style: 'solid', fill: C.purple, width: 0 } });
  ctx.addShape(slide, { left: 780, top: 318, width: 90, height: 28, fill: C.purpleDark, line: { style: 'solid', fill: C.purpleDark, width: 0 } });
  ctx.addText(slide, { text: 'clear route\\ngrounded self', left: 650, top: 405, width: 270, height: 42, fontSize: 20, bold: true, fontFace: 'Arial', color: C.ink, align: 'center', fit: 'shrink' });
  ctx.addText(slide, { text: '→', left: 512, top: 300, width: 50, height: 44, fontSize: 40, bold: true, fontFace: 'Arial', color: C.purple, align: 'center' });
  ctx.addShape(slide, { left: 180, top: 498, width: 790, height: 56, fill: C.purpleLight, line: { style: 'solid', fill: C.line, width: 1 } });
  ctx.addText(slide, { text: '${esc(slide.cause)}', left: 200, top: 510, width: 750, height: 30, fontSize: 18, bold: true, fontFace: 'Arial', color: C.ink, align: 'center', fit: 'shrink' });
  ctx.addText(slide, { text: '${esc(slide.rule)}', left: 145, top: 596, width: 860, height: 34, fontSize: 18, italic: true, fontFace: 'Arial', color: C.ink, align: 'center', fit: 'shrink' });
`;
  }

  if (slide.type === 'premiumMoment') {
    return `
  title(slide, ctx, '${esc(slide.title)}');
  ctx.addShape(slide, { left: 80, top: 160, width: 590, height: 360, fill: '#121022', line: { style: 'solid', fill: C.line, width: 1.2 } });
  ctx.addShape(slide, { geometry: 'ellipse', left: 250, top: 230, width: 210, height: 210, fill: C.purple, line: { style: 'solid', fill: C.purple, width: 0 } });
  ctx.addText(slide, { text: 'WEEK\\nTRAILER', left: 270, top: 287, width: 170, height: 86, fontSize: 34, bold: true, fontFace: 'Montserrat', color: C.white, align: 'center', fit: 'shrink' });
  ctx.addText(slide, { text: 'Premium video moment', left: 210, top: 462, width: 250, height: 30, fontSize: 22, bold: true, fontFace: 'Arial', color: C.white, align: 'center' });
  ctx.addText(slide, { text: '${esc(slide.claim)}', left: 750, top: 170, width: 330, height: 78, fontSize: 25, bold: true, fontFace: 'Arial', color: C.ink, fit: 'shrink' });
  ${slide.economics.map((r, i) => `
  cell(slide, ctx, '${esc(r[0])}', 740, ${285 + i * 50}, 170, 48, ${i === 3 ? 'C.greenLight' : 'C.white'}, true, 15);
  cell(slide, ctx, '${esc(r[1])}', 910, ${285 + i * 50}, 210, 48, ${i === 3 ? 'C.greenLight' : 'C.white'}, false, 15);`).join('\n')}
  ctx.addText(slide, { text: '${esc(slide.note)}', left: 140, top: 580, width: 940, height: 44, fontSize: 20, bold: true, fontFace: 'Arial', color: C.ink, align: 'center', fit: 'shrink' });
`;
  }

  if (slide.type === 'paywallArchitecture') {
    return `
  title(slide, ctx, '${esc(slide.title)}');
  ${slide.tiers.map((t, i) => {
    const x = 72 + i * 275;
    return `
  ctx.addShape(slide, { left: ${x}, top: 170, width: 235, height: 330, fill: ${i === 1 ? 'C.purpleLight' : i === 3 ? 'C.greenLight' : 'C.white'}, line: { style: 'solid', fill: C.line, width: 1.2 } });
  ctx.addText(slide, { text: '${esc(t[0])}', left: ${x + 20}, top: 196, width: 195, height: 30, fontSize: 26, bold: true, fontFace: 'Arial', color: C.purpleDark, align: 'center', fit: 'shrink' });
  ctx.addText(slide, { text: '${esc(t[1])}', left: ${x + 20}, top: 245, width: 195, height: 34, fontSize: 24, bold: true, fontFace: 'Arial', color: C.ink, align: 'center', fit: 'shrink' });
  ctx.addText(slide, { text: '${esc(t[2])}', left: ${x + 24}, top: 314, width: 187, height: 92, fontSize: 17, fontFace: 'Arial', color: C.ink, align: 'center', fit: 'shrink' });
  ctx.addShape(slide, { left: ${x + 45}, top: 438, width: 145, height: 34, fill: C.purpleLight, line: { style: 'solid', fill: C.line, width: 0.8 } });
  ctx.addText(slide, { text: '${esc(t[3])}', left: ${x + 52}, top: 446, width: 132, height: 16, fontSize: 13, bold: true, fontFace: 'Arial', color: C.ink, align: 'center', fit: 'shrink' });`;
  }).join('\n')}
  ctx.addText(slide, { text: '${esc(slide.note)}', left: 170, top: 575, width: 840, height: 40, fontSize: 22, bold: true, fontFace: 'Arial', color: C.ink, align: 'center', fit: 'shrink' });
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

  if (slide.type === 'numberLogic') {
    return `
  title(slide, ctx, '${esc(slide.title)}');
  ctx.addShape(slide, { left: 95, top: 330, width: 955, height: 3, fill: C.purple, line: { style: 'solid', fill: C.purple, width: 0 } });
  ${slide.steps.map((s, i) => {
    const x = 58 + i * 292;
    return `
  ctx.addShape(slide, { geometry: 'ellipse', left: ${x + 60}, top: 210, width: 108, height: 108, fill: ${i === 2 ? 'C.purple' : i === 3 ? 'C.greenLight' : 'C.purpleLight'}, line: { style: 'solid', fill: C.line, width: 1.1 } });
  ctx.addText(slide, { text: '${esc(s[0])}', left: ${x + 82}, top: 238, width: 64, height: 44, fontSize: 38, bold: true, fontFace: 'Montserrat', color: ${i === 2 ? 'C.white' : 'C.purpleDark'}, align: 'center' });
  ctx.addText(slide, { text: '${esc(s[1])}', left: ${x}, top: 365, width: 230, height: 30, fontSize: 22, bold: true, fontFace: 'Arial', color: C.ink, align: 'center', fit: 'shrink' });
  ctx.addText(slide, { text: '${esc(s[2])}', left: ${x}, top: 410, width: 230, height: 42, fontSize: 16, fontFace: 'Arial', color: C.muted, align: 'center', fit: 'shrink' });
  ctx.addText(slide, { text: '${esc(s[3])}', left: ${x}, top: 476, width: 230, height: 64, fontSize: 16, bold: true, fontFace: 'Arial', color: C.ink, align: 'center', fit: 'shrink' });`;
  }).join('\n')}
  ctx.addText(slide, { text: '${esc(slide.note)}', left: 145, top: 600, width: 880, height: 36, fontSize: 20, bold: true, fontFace: 'Arial', color: C.ink, align: 'center', fit: 'shrink' });
`;
  }

  if (slide.type === 'bigNumbers') {
    return `
  title(slide, ctx, '${esc(slide.title)}');
  ${slide.numbers.map((n, i) => {
    const x = 74 + (i % 2) * 560;
    const y = 175 + Math.floor(i / 2) * 210;
    return `
  ctx.addShape(slide, { left: ${x}, top: ${y}, width: 485, height: 160, fill: ${i === 2 ? 'C.greenLight' : 'C.purpleLight'}, line: { style: 'solid', fill: C.line, width: 1.1 } });
  ctx.addText(slide, { text: '${esc(n[0])}', left: ${x + 24}, top: ${y + 22}, width: 190, height: 46, fontSize: 34, bold: true, fontFace: 'Montserrat', color: C.purpleDark, fit: 'shrink' });
  ctx.addText(slide, { text: '${esc(n[1])}', left: ${x + 230}, top: ${y + 29}, width: 225, height: 35, fontSize: 22, bold: true, fontFace: 'Arial', color: C.ink, fit: 'shrink' });
  ctx.addText(slide, { text: '${esc(n[2])}', left: ${x + 28}, top: ${y + 88}, width: 430, height: 48, fontSize: 16, fontFace: 'Arial', color: C.ink, fit: 'shrink' });`;
  }).join('\n')}
  ctx.addText(slide, { text: '${esc(slide.note)}', left: 150, top: 615, width: 850, height: 28, fontSize: 19, bold: true, fontFace: 'Arial', color: C.ink, align: 'center', fit: 'shrink' });
`;
  }

  if (slide.type === 'proofMatrix' || slide.type === 'assumptionBridge') {
    const widths = slide.type === 'proofMatrix' ? [205, 315, 285, 270] : [190, 350, 235, 290];
    return `
  title(slide, ctx, '${esc(slide.title)}');
  ${table(slide.rows, widths, 54, 148, slide.type === 'proofMatrix' ? 74 : 68)}
  ctx.addText(slide, { text: '${esc(slide.conclusion || slide.note)}', left: 90, top: 620, width: 1000, height: 30, fontSize: 18, bold: true, fontFace: 'Arial', color: C.ink, align: 'center', fit: 'shrink' });
`;
  }

  if (slide.type === 'generationPackage') {
    return `
  title(slide, ctx, '${esc(slide.title)}');
  ctx.addShape(slide, { left: 70, top: 135, width: 265, height: 455, fill: C.purpleLight, line: { style: 'solid', fill: C.line, width: 1.1 } });
  ctx.addText(slide, { text: 'PLUS PACKAGE', left: 95, top: 164, width: 215, height: 30, fontSize: 25, bold: true, fontFace: 'Montserrat', color: C.purpleDark, align: 'center', fit: 'shrink' });
  ctx.addText(slide, { text: '30 daily cards\\n30 images\\n4 weekly 8s videos\\nmemory + recap', left: 105, top: 235, width: 195, height: 145, fontSize: 22, bold: true, fontFace: 'Arial', color: C.ink, align: 'center', fit: 'shrink' });
  ctx.addText(slide, { text: '~$2.40-$4.05', left: 88, top: 430, width: 230, height: 42, fontSize: 33, bold: true, fontFace: 'Montserrat', color: C.purpleDark, align: 'center', fit: 'shrink' });
  ctx.addText(slide, { text: 'COGS / paid user / month', left: 100, top: 482, width: 205, height: 28, fontSize: 17, bold: true, fontFace: 'Arial', color: C.ink, align: 'center', fit: 'shrink' });
  ${table(slide.rows, [155, 145, 250, 118, 130], 365, 145, 54)}
  ctx.addText(slide, { text: '${esc(slide.note)}', left: 155, top: 628, width: 860, height: 28, fontSize: 18, bold: true, fontFace: 'Arial', color: C.ink, align: 'center', fit: 'shrink' });
`;
  }

  if (slide.type === 'freeUserModel') {
    return `
  title(slide, ctx, '${esc(slide.title)}');
  ${table(slide.rows, [210, 300, 230, 330], 54, 138, 62)}
  ctx.addShape(slide, { left: 90, top: 610, width: 980, height: 42, fill: C.greenLight, line: { style: 'solid', fill: C.line, width: 1 } });
  ctx.addText(slide, { text: '${esc(slide.note)}', left: 110, top: 620, width: 940, height: 22, fontSize: 17, bold: true, fontFace: 'Arial', color: C.ink, align: 'center', fit: 'shrink' });
`;
  }

  if (slide.type === 'marketingModel') {
    return `
  title(slide, ctx, '${esc(slide.title)}');
  ${table(slide.rows, [190, 190, 190, 190, 310], 54, 145, 58)}
  ctx.addText(slide, { text: '${esc(slide.note)}', left: 150, top: 620, width: 850, height: 30, fontSize: 18, bold: true, fontFace: 'Arial', color: C.ink, align: 'center', fit: 'shrink' });
`;
  }

  if (slide.type === 'offerSlide') {
    return `
  title(slide, ctx, '${esc(slide.title)}');
  ctx.addShape(slide, { left: 70, top: 142, width: 245, height: 420, fill: C.greenLight, line: { style: 'solid', fill: C.line, width: 1.1 } });
  ctx.addText(slide, { text: '€5,000', left: 95, top: 210, width: 195, height: 55, fontSize: 48, bold: true, fontFace: 'Montserrat', color: C.purpleDark, align: 'center' });
  ctx.addText(slide, { text: 'Phase 1\\nproof sprint', left: 105, top: 300, width: 175, height: 70, fontSize: 28, bold: true, fontFace: 'Arial', color: C.ink, align: 'center', fit: 'shrink' });
  ctx.addText(slide, { text: 'not a full-scale app build', left: 95, top: 442, width: 190, height: 26, fontSize: 18, bold: true, fontFace: 'Arial', color: C.ink, align: 'center', fit: 'shrink' });
  ${table(slide.rows, [150, 390, 300], 345, 145, 56)}
  ctx.addText(slide, { text: '${esc(slide.note)}', left: 140, top: 620, width: 900, height: 30, fontSize: 18, bold: true, fontFace: 'Arial', color: C.ink, align: 'center', fit: 'shrink' });
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

  if (slide.type === 'costBenchmarks') {
    return `
  title(slide, ctx, '${esc(slide.title)}');
  ${table(slide.rows, [155, 245, 310, 360], 54, 150, 54)}
  ctx.addText(slide, { text: '${esc(slide.note)}', left: 80, top: 610, width: 990, height: 34, fontSize: 15, italic: true, fontFace: 'Arial', color: C.ink, align: 'center', fit: 'shrink' });
  source(slide, ctx, 'Sources: OpenAI, Google Vertex AI, Runway, Replicate, HeyGen, D-ID, Luma public pricing pages.');
`;
  }

  if (slide.type === 'unitCost') {
    return `
  title(slide, ctx, '${esc(slide.title)}');
  ${table(slide.rows, [190, 345, 215, 320], 54, 154, 58)}
  ctx.addShape(slide, { left: 72, top: 558, width: 1030, height: 42, fill: C.purpleLight, line: { style: 'solid', fill: C.line, width: 1 } });
  ctx.addText(slide, { text: '${esc(slide.formula)}', left: 88, top: 568, width: 998, height: 22, fontSize: 15, bold: true, fontFace: 'Arial', color: C.ink, fit: 'shrink' });
  ctx.addText(slide, { text: '${esc(slide.conclusion)}', left: 110, top: 615, width: 940, height: 28, fontSize: 18, italic: true, fontFace: 'Arial', color: C.ink, align: 'center', fit: 'shrink' });
`;
  }

  if (slide.type === 'videoStress') {
    return `
  title(slide, ctx, '${esc(slide.title)}');
  ${table(slide.rows, [265, 155, 170, 180, 300], 54, 158, 58)}
  ctx.addText(slide, { text: '${esc(slide.note)}', left: 120, top: 610, width: 900, height: 34, fontSize: 20, bold: true, fontFace: 'Arial', color: C.ink, align: 'center', fit: 'shrink' });
`;
  }

  if (slide.type === 'competitorEconomics') {
    return `
  title(slide, ctx, '${esc(slide.title)}');
  ${table(slide.rows, [155, 190, 375, 350], 54, 128, 48)}
  ctx.addText(slide, { text: '${esc(slide.note)}', left: 82, top: 610, width: 990, height: 34, fontSize: 14, italic: true, fontFace: 'Arial', color: C.ink, align: 'center', fit: 'shrink' });
`;
  }

  if (slide.type === 'auraMath') {
    return `
  title(slide, ctx, '${esc(slide.title)}');
  ${table(slide.rows, [190, 160, 395, 325], 54, 150, 58)}
  ctx.addShape(slide, { left: 140, top: 610, width: 870, height: 42, fill: C.greenLight, line: { style: 'solid', fill: C.line, width: 1 } });
  ctx.addText(slide, { text: '${esc(slide.conclusion)}', left: 160, top: 620, width: 830, height: 22, fontSize: 17, bold: true, fontFace: 'Arial', color: C.ink, align: 'center', fit: 'shrink' });
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
  ctx.addShape(slide, { left: 88, top: 360, width: 1000, height: 3, fill: C.purple, line: { style: 'solid', fill: C.purple, width: 0 } });
  ${slide.steps.map((s, i) => `
  pill(slide, ctx, '${esc(s[0])}', ${55 + i * 185}, 320, 130, 58, ${i === 2 || i === 5 ? 'C.greenLight' : i === 3 ? 'C.purple' : 'C.grey'}, C.line, 17);
  ctx.addText(slide, { text: '${esc(s[1])}', left: ${45 + i * 185}, top: 402, width: 150, height: 54, fontSize: 16, fontFace: 'Arial', color: C.ink, align: 'center', fit: 'shrink' });`).join('\n')}
  ctx.addText(slide, { text: 'The roadmap stays narrow until the loop is proven: first causality, then retention, then paid scale.', left: 178, top: 520, width: 820, height: 42, fontSize: 22, bold: true, fontFace: 'Arial', color: C.ink, align: 'center', fit: 'shrink' });
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
