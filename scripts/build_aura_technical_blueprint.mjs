import fs from 'fs';

const OUT = 'reports/aura-technical-blueprint-v1.md';

function mdTable(rows, columns) {
  const header = `| ${columns.map(c => c.label).join(' | ')} |`;
  const sep = `| ${columns.map(() => '---').join(' | ')} |`;
  const body = rows.map(row => `| ${columns.map(c => String(row[c.key] ?? '').replace(/\n/g, '<br>').replace(/\|/g, '/')).join(' | ')} |`);
  return [header, sep, ...body].join('\n');
}

function money(value) {
  return `$${Math.round(value).toLocaleString('en-US')}`;
}

const scenarios = [100, 1000, 10000, 100000];
const unit = {
  activeDaysPerMau: 8,
  episodeInputTokens: 2200,
  episodeOutputTokens: 700,
  supportInputTokens: 1000,
  supportOutputTokens: 300,
  gptInputPerM: 0.40,
  gptOutputPerM: 1.60,
  imagesPerMau: 4,
  imageCost: 0.03,
  storagePerMau: 0.006,
  analyticsPerMau: 0.01,
  pushPerMau: 0.002,
  supportPerMau: 0.025,
};

function llmCostPerMau() {
  const dailyInput = unit.episodeInputTokens + unit.supportInputTokens;
  const dailyOutput = unit.episodeOutputTokens + unit.supportOutputTokens;
  return unit.activeDaysPerMau * ((dailyInput / 1_000_000) * unit.gptInputPerM + (dailyOutput / 1_000_000) * unit.gptOutputPerM);
}

function infraBase(mau) {
  if (mau <= 1000) return 65;
  if (mau <= 10000) return 220;
  if (mau <= 100000) return 1300;
  return 8000;
}

function costRow(mau) {
  const ai = mau * llmCostPerMau();
  const images = mau * unit.imagesPerMau * unit.imageCost;
  const storage = mau * unit.storagePerMau;
  const analytics = mau * unit.analyticsPerMau;
  const push = mau * unit.pushPerMau;
  const support = mau * unit.supportPerMau;
  const infra = infraBase(mau);
  const total = ai + images + storage + analytics + push + support + infra;
  const perMau = total / mau;
  const videoOptional = mau * 0.15 * 5 * 0.09;
  return {
    mau: String(mau),
    ai: money(ai),
    images: money(images),
    storage: money(storage),
    analytics: money(analytics),
    push: money(push),
    support: money(support),
    infra: money(infra),
    total: money(total),
    perMau: `$${perMau.toFixed(2)}`,
    withVideo: money(total + videoOptional),
  };
}

const lines = [];

lines.push('# AURA Technical Blueprint v1');
lines.push('');
lines.push('Этот документ отвечает на вопрос: как именно собирать AURA MVP технически, сколько это примерно стоит при росте пользователей и какие решения нельзя откладывать до разработки. Он не заменяет финальное ТЗ, но задает архитектурную рамку, стек, unit economics и границы MVP.');
lines.push('');
lines.push('Главное решение: MVP должен быть mobile-first, image-first и analytics-first. Видеоаватар, marketplace, community и тяжелый AI companion не входят в MVP, потому что главный риск сейчас - не наличие рынка, а прохождение петли Episode -> Action -> Reset -> Avatar -> Return Tomorrow.');
lines.push('');

lines.push('## 1. Architecture Decision');
lines.push('');
lines.push(mdTable([
  { layer: 'Frontend', tech: 'React Native + Expo', cost: '$0 platform cost; developer time', why: 'Быстрее собрать iOS/Android MVP, легче подключить RevenueCat, push, analytics и OTA updates.', risk: 'Сложные native animations и avatar/video editing могут потребовать native modules.' },
  { layer: 'Backend', tech: 'NestJS on Fly.io/Render/Railway or managed container', cost: '$25-300/mo MVP, выше при росте', why: 'Четкая модульная архитектура, TypeScript, удобно для API, jobs, billing webhooks и admin.', risk: 'Нужно дисциплинированно не строить enterprise backend раньше времени.' },
  { layer: 'Database', tech: 'Postgres via Supabase Pro', cost: 'От $25/mo; Pro включает 100k MAU и базовые лимиты', why: 'Postgres лучше подходит для связанных сущностей: user, season, episode, action, reflection, avatar state.', risk: 'При тяжелых assets и логах нельзя складывать все в Postgres.' },
  { layer: 'Storage', tech: 'S3-compatible storage / Supabase Storage for MVP', cost: 'Supabase Pro включает 100GB storage, далее usage-based', why: 'Нужно хранить avatar/canvas assets, recaps, exports.', risk: 'Изображения быстро раздувают storage/egress, нужна компрессия и lifecycle policy.' },
  { layer: 'AI Brain', tech: 'OpenAI GPT-4.1 mini first, Claude/Gemini as fallback later', cost: 'GPT-4.1 mini: $0.40 input / $1.60 output за 1M tokens', why: 'Хороший баланс цены, скорости, structured output и tool calling для MVP.', risk: 'Качество “личности” может требовать prompt QA или более дорогой модели на отдельных шагах.' },
  { layer: 'Image', tech: 'Together FLUX.2 pro/dev or Replicate FLUX', cost: 'Около $0.015-$0.04/image depending provider/model', why: 'Для MVP достаточно image-first Life Canvas; видео не нужно в core loop.', risk: 'Если делать изображение каждый день для всех, себестоимость быстро становится главной статьей.' },
  { layer: 'Video avatar', tech: 'Not MVP; later Replicate/Tavus/HeyGen tests', cost: 'Replicate video examples: $0.09/sec 480p, $0.25/sec 720p for Wan i2v', why: 'Видео может стать premium/token moment, но разрушает экономику free MVP.', risk: 'Deepfake/privacy, latency, moderation, cost.' },
  { layer: 'Payments', tech: 'RevenueCat + App Store/Google Play IAP', cost: 'Free up to $2.5k MTR, then 1% tracked revenue; store fee separately', why: 'Быстрый subscription stack, restore purchases, webhooks, entitlement source of truth.', risk: 'Нужно считать store fee и RevenueCat fee отдельно.' },
  { layer: 'Analytics', tech: 'PostHog / Amplitude / Firebase Analytics', cost: '$0-$300/mo early depending tool and events', why: 'MVP без analytics бессмысленен: нужно видеть loop completion, D1, D7, paywall.', risk: 'Слишком много событий без product questions.' },
  { layer: 'Admin', tech: 'Retool/Supabase Studio/internal Next.js later', cost: '$0-$50/mo early + dev time', why: 'Нужно менять prompts, season templates, смотреть safety flags без релиза приложения.', risk: 'Не строить большой backoffice до первых пользователей.' }
], [
  { key: 'layer', label: 'Слой' },
  { key: 'tech', label: 'Технология' },
  { key: 'cost', label: 'Стоимость' },
  { key: 'why', label: 'Почему выбрана' },
  { key: 'risk', label: 'Риск' }
]));
lines.push('');

lines.push('## 2. System Architecture');
lines.push('');
lines.push(mdTable([
  { block: 'Mobile App', does: 'Onboarding, profile, season, episode, action, reset, reflection, Life Canvas, paywall, reminders.', integrations: 'RevenueCat SDK, analytics SDK, push, backend API.', data: 'Сохраняет минимум локального cache, не хранит secrets.' },
  { block: 'API Backend', does: 'Auth session, profile, seasons, episodes, actions, avatar jobs, billing webhooks, admin.', integrations: 'Supabase/Postgres, OpenAI, image provider, RevenueCat, analytics.', data: 'Единый слой бизнес-правил и state transitions.' },
  { block: 'Postgres', does: 'Хранит связанные сущности продукта.', integrations: 'Supabase APIs, backend service role.', data: 'UserProfile, Season, Episode, Action, Reflection, AvatarState, Subscription, Event.' },
  { block: 'AI Layer', does: 'Генерирует episode/action/reset recap, structured JSON, safety checked outputs.', integrations: 'OpenAI primary, optional Claude/Gemini fallback.', data: 'PromptVersion, request/response metadata, cost logs.' },
  { block: 'Image Layer', does: 'Генерирует image-first Life Canvas shifts.', integrations: 'Together/Replicate/other provider.', data: 'Prompt, provider, asset id, latency, cost.' },
  { block: 'Storage', does: 'Хранит изображения, exports, preview cards.', integrations: 'S3/Supabase Storage/CDN.', data: 'Compressed assets, thumbnails, lifecycle policy.' },
  { block: 'Billing', does: 'Entitlements, trial, subscription status, webhooks.', integrations: 'RevenueCat, App Store, Google Play.', data: 'Plan, status, renewal, cancellation reason.' },
  { block: 'Analytics', does: 'Funnel, retention, paywall, cost-per-loop, avatar causality.', integrations: 'PostHog/Amplitude/Firebase, warehouse later.', data: 'Events with user_state and experiment_id.' },
  { block: 'Admin', does: 'Prompt publish, safety review, season templates, user issue review.', integrations: 'Backend admin endpoints.', data: 'Prompt versions, moderation queue, feature flags.' }
], [
  { key: 'block', label: 'Блок' },
  { key: 'does', label: 'Что делает' },
  { key: 'integrations', label: 'Интеграции' },
  { key: 'data', label: 'Данные' }
]));
lines.push('');

lines.push('## 3. Recommended Stack For MVP');
lines.push('');
lines.push('Рекомендация: React Native + Expo, NestJS, Supabase Postgres, S3/Supabase Storage, OpenAI GPT-4.1 mini, Together/Replicate FLUX, RevenueCat, PostHog/Firebase Analytics, Retool or simple internal admin. Это не “идеальный навсегда” стек, а стек, который быстрее всего доводит продукт до интервью, прототипа и первых 30-100 пользователей.');
lines.push('');
lines.push(mdTable([
  { decision: 'React Native вместо Flutter', reason: 'Больше готовых integrations для paywall/analytics/AI tooling и быстрее нанимать JS/TS команду.', alternative: 'Flutter тоже валиден, если команда уже сильнее во Flutter.' },
  { decision: 'NestJS вместо no-code backend', reason: 'Нужны state transitions, async jobs, billing webhooks, admin endpoints и cost logs.', alternative: 'Supabase Edge Functions можно использовать для быстрого старта, но бизнес-логика быстро усложнится.' },
  { decision: 'Postgres вместо Firestore', reason: 'У AURA много связанных сущностей и отчетности; SQL проще для аналитики и unit economics.', alternative: 'Firestore хорош для realtime/simple mobile apps, но relational product graph здесь важнее.' },
  { decision: 'Image-first вместо video-first', reason: 'Видео дорого, медленно и рискованно; центральную гипотезу avatar causality можно проверить изображением.', alternative: 'Видео тестировать как premium token после proof of loop.' },
  { decision: 'One primary LLM', reason: 'На MVP лучше контролировать prompt quality и стоимость, чем строить router.', alternative: 'OpenRouter/LLM router после 1000+ активных пользователей и накопления evals.' },
  { decision: 'RevenueCat с первого paid test', reason: 'Restore, entitlements, webhooks и paywall experiments не стоит писать руками.', alternative: 'Чистый StoreKit/Google Billing только если команда хочет контролировать billing сама.' }
], [
  { key: 'decision', label: 'Решение' },
  { key: 'reason', label: 'Почему' },
  { key: 'alternative', label: 'Альтернатива' }
]));
lines.push('');

lines.push('## 4. Component Responsibilities');
lines.push('');
lines.push(mdTable([
  { component: 'Mobile Shell', responsibilities: 'Navigation, auth state, onboarding, paywall routing, offline event queue.', must: 'Fast cold start, no blank loading before Welcome.', not: 'Do not embed provider secrets or prompt logic.' },
  { component: 'Onboarding Module', responsibilities: 'Privacy, consent, birth date, current state, season choice.', must: 'Can resume if app closes mid-flow.', not: 'Do not ask 20 questions before first episode.' },
  { component: 'Episode Module', responsibilities: 'Render episode, read progress, dislike/report, action entry.', must: 'Supports generated and fallback episodes.', not: 'Do not expose raw AI output without product formatting.' },
  { component: 'Action Module', responsibilities: 'Action choices, difficulty, reminders, completion state.', must: 'Always offer a softer version.', not: 'Do not punish skipped or partial action.' },
  { component: 'Reset Module', responsibilities: 'Short ritual, timer, skip, complete, event logging.', must: '30-60 sec default.', not: 'Do not become a full meditation product in MVP.' },
  { component: 'Reflection Module', responsibilities: 'Emotion after, one-line note, save to memory.', must: 'Can save without text.', not: 'Do not require journaling friction.' },
  { component: 'Life Canvas Module', responsibilities: 'Pending state, generated image, explanation, save/share.', must: 'Show why canvas changed.', not: 'Do not show random beauty without causality.' },
  { component: 'Memory Module', responsibilities: 'Season history, recap, locked paid sections.', must: 'Make 7-day trajectory visible.', not: 'Do not overbuild timeline/social feed.' },
  { component: 'Billing Module', responsibilities: 'Paywall config, trial, purchase, restore, entitlement.', must: 'Single entitlement source of truth.', not: 'Do not hardcode prices in app.' },
  { component: 'Admin Module', responsibilities: 'Prompt versions, season templates, safety queue, manual overrides.', must: 'Prompt rollback.', not: 'Do not build a complex CRM.' }
], [
  { key: 'component', label: 'Компонент' },
  { key: 'responsibilities', label: 'Ответственность' },
  { key: 'must', label: 'Must' },
  { key: 'not', label: 'Do not' }
]));
lines.push('');

lines.push('## 5. Database Schema Draft');
lines.push('');
lines.push(mdTable([
  { table: 'users', columns: 'id, email_hash, auth_provider, locale, timezone, created_at, deleted_at', indexes: 'id, auth_provider', notes: 'PII минимум; не хранить лишние персональные данные.' },
  { table: 'user_profiles', columns: 'user_id, display_name, birth_date, current_goal, mood, privacy_flags, updated_at', indexes: 'user_id', notes: 'Birth date is sensitive; access only through backend.' },
  { table: 'consents', columns: 'id, user_id, policy_version, accepted_at, revoked_at', indexes: 'user_id, policy_version', notes: 'Нужно для доверия и compliance.' },
  { table: 'season_templates', columns: 'id, theme, title, description, active, sort_order', indexes: 'active', notes: 'Управляется из admin.' },
  { table: 'seasons', columns: 'id, user_id, template_id, status, day_index, started_at, completed_at', indexes: 'user_id, status', notes: 'Один active season в MVP.' },
  { table: 'prompt_versions', columns: 'id, type, version, template, safety_rules, active, created_at', indexes: 'type, active', notes: 'Все AI outputs должны знать prompt version.' },
  { table: 'episodes', columns: 'id, season_id, day_index, title, insight, conflict, resource, risk, prompt_version_id, safety_status', indexes: 'season_id, day_index', notes: 'Structured JSON, не raw blob only.' },
  { table: 'actions', columns: 'id, episode_id, difficulty, text, estimated_minutes, status, selected_at, completed_at', indexes: 'episode_id, status', notes: 'Action is observable behavior.' },
  { table: 'reset_sessions', columns: 'id, action_id, reset_type, duration_sec, status, started_at, completed_at', indexes: 'action_id', notes: 'Skip allowed.' },
  { table: 'reflections', columns: 'id, action_id, emotion_after, note, created_at', indexes: 'action_id', notes: 'One-line reflection.' },
  { table: 'avatar_states', columns: 'id, user_id, season_id, episode_id, action_id, visual_traits_json, explanation, asset_id, created_at', indexes: 'user_id, season_id', notes: 'Core causal visual state.' },
  { table: 'assets', columns: 'id, user_id, provider, type, url, thumbnail_url, status, estimated_cost, latency_ms', indexes: 'user_id, provider, status', notes: 'Cost and provider logging mandatory.' },
  { table: 'subscriptions', columns: 'user_id, store, revenuecat_id, entitlement, status, trial_start, renewal_at', indexes: 'user_id, status', notes: 'RevenueCat webhook source.' },
  { table: 'notifications', columns: 'id, user_id, type, scheduled_at, sent_at, opened_at, status', indexes: 'user_id, scheduled_at', notes: 'D1/D7 return loop.' },
  { table: 'events', columns: 'id, user_id, event_name, user_state, properties_json, client_ts, server_ts', indexes: 'event_name, server_ts, user_id', notes: 'Could later move to warehouse.' },
  { table: 'generation_logs', columns: 'id, user_id, provider, model, input_units, output_units, estimated_cost, latency_ms, status', indexes: 'provider, model, created_at', notes: 'Unit economics depends on this.' }
], [
  { key: 'table', label: 'Table' },
  { key: 'columns', label: 'Core columns' },
  { key: 'indexes', label: 'Indexes' },
  { key: 'notes', label: 'Notes' }
]));
lines.push('');

lines.push('## 6. API Groups');
lines.push('');
lines.push(mdTable([
  { group: 'Auth/Profile', endpoints: 'POST /auth/session, PATCH /profile, GET /profile, DELETE /profile', owner: 'Backend/mobile', qa: 'Can create, resume, export/delete data.' },
  { group: 'Consent', endpoints: 'GET /consent/current, POST /consent/accept, POST /consent/revoke', owner: 'Backend', qa: 'Policy version stored.' },
  { group: 'Season', endpoints: 'GET /seasons/templates, POST /seasons, GET /seasons/current, PATCH /seasons/:id', owner: 'Backend/product', qa: 'Only one active MVP season.' },
  { group: 'Episode', endpoints: 'POST /episodes/generate, GET /episodes/today, POST /episodes/:id/report', owner: 'AI/backend', qa: 'Fallback and safety status.' },
  { group: 'Action', endpoints: 'POST /actions/select, PATCH /actions/:id, POST /actions/:id/complete', owner: 'Backend/mobile', qa: 'Partial completion valid.' },
  { group: 'Reset', endpoints: 'POST /reset/start, POST /reset/:id/complete', owner: 'Backend/mobile', qa: 'Skip does not break flow.' },
  { group: 'Reflection', endpoints: 'POST /reflections, PATCH /reflections/:id', owner: 'Backend/mobile', qa: 'Text optional.' },
  { group: 'Avatar', endpoints: 'POST /avatar/generate, GET /avatar/:job_id, GET /avatar/current', owner: 'AI/image/backend', qa: 'Async job, pending/failure/retry.' },
  { group: 'Memory', endpoints: 'GET /memory, GET /recap/weekly, POST /recap/generate', owner: 'Backend/AI', qa: 'Free locks and paid unlocks.' },
  { group: 'Billing', endpoints: 'GET /paywall, POST /billing/webhook, GET /entitlements', owner: 'Backend/mobile', qa: 'Sandbox purchase and restore.' },
  { group: 'Events', endpoints: 'POST /events, POST /events/batch', owner: 'Data/mobile', qa: 'Offline batch and dedupe.' },
  { group: 'Admin', endpoints: 'GET/POST /admin/prompts, /admin/templates, /admin/moderation', owner: 'Backend/internal', qa: 'Role protected, audit log.' }
], [
  { key: 'group', label: 'Group' },
  { key: 'endpoints', label: 'Endpoints' },
  { key: 'owner', label: 'Owner' },
  { key: 'qa', label: 'QA' }
]));
lines.push('');

lines.push('## 7. Provider Comparison');
lines.push('');
lines.push(mdTable([
  { category: 'LLM primary', provider: 'OpenAI GPT-4.1 mini', pros: 'Low cost, strong structured output, good speed.', cons: 'May need prompt tuning for warmth.', verdict: 'Use for MVP default.' },
  { category: 'LLM quality fallback', provider: 'Claude Sonnet', pros: 'Strong writing/reasoning quality.', cons: 'Much more expensive per token.', verdict: 'Use only for evals or premium generation later.' },
  { category: 'LLM low-cost fallback', provider: 'Gemini/DeepSeek via router', pros: 'Potentially cheaper/fast.', cons: 'Quality and safety variance.', verdict: 'Not day-one unless team already has eval harness.' },
  { category: 'Image primary', provider: 'Together FLUX.2 dev/pro', pros: 'Clear per-image pricing and API.', cons: 'Style consistency needs prompts/seeds.', verdict: 'Good MVP candidate.' },
  { category: 'Image alternative', provider: 'Replicate FLUX', pros: 'Many models and fast experimentation.', cons: 'Costs vary by model; latency varies.', verdict: 'Good for experiments and fallback.' },
  { category: 'Video later', provider: 'Replicate/Tavus/HeyGen', pros: 'Can create premium wow moments.', cons: 'Expensive, privacy/deepfake risk, longer latency.', verdict: 'Not free MVP.' },
  { category: 'Billing', provider: 'RevenueCat', pros: 'Fast subscriptions, entitlements, webhooks.', cons: 'Adds fee after revenue threshold.', verdict: 'Use from first paid test.' },
  { category: 'Analytics', provider: 'PostHog/Firebase/Amplitude', pros: 'Funnels, cohorts, events.', cons: 'Pricing can rise with events.', verdict: 'Use one; do not duplicate event stacks.' }
], [
  { key: 'category', label: 'Category' },
  { key: 'provider', label: 'Provider' },
  { key: 'pros', label: 'Pros' },
  { key: 'cons', label: 'Cons' },
  { key: 'verdict', label: 'Verdict' }
]));
lines.push('');

lines.push('## 8. Unit Economics Assumptions');
lines.push('');
lines.push('Ниже модель не претендует на бухгалтерскую точность. Ее задача - понять порядок величин и главный риск. Допущение нормального MVP: 1 MAU в среднем имеет 8 активных дней в месяц, получает 4 image-based avatar shifts в месяц, daily AI использует GPT-4.1 mini, видеоаватар не входит в MVP. Store fee, VAT/tax, paid acquisition и зарплаты команды не включены в product COGS и считаются отдельно.');
lines.push('');
lines.push(mdTable([
  { item: 'AI text', value: `${unit.activeDaysPerMau} active days/user/month; ~3,200 input tokens and ~1,000 output tokens per active day`, source: 'OpenAI GPT-4.1 mini public pricing: $0.40 input and $1.60 output per 1M tokens.' },
  { item: 'Image', value: `${unit.imagesPerMau} images/user/month at $${unit.imageCost.toFixed(2)} each`, source: 'Together FLUX.2 pro around $0.03/image; Replicate FLUX ranges around $0.003-$0.04/image depending model.' },
  { item: 'Storage', value: '$0.006/user/month placeholder', source: 'Supabase Pro includes 100GB file storage, then overage.' },
  { item: 'Analytics', value: '$0.01/user/month placeholder', source: 'Tool-dependent; MVP can start low/free but events must be planned.' },
  { item: 'Push', value: '$0.002/user/month placeholder', source: 'Firebase/APNs costs usually not the first bottleneck for MVP.' },
  { item: 'Support', value: '$0.025/user/month placeholder', source: 'Internal support/ops placeholder for early cohorts.' },
  { item: 'Infra base', value: '$65 at 100-1,000 MAU; $220 at 10k; $1,300 at 100k', source: 'Supabase/hosting/monitoring/admin estimates, not exact invoices.' },
  { item: 'Optional video', value: '15% of MAU get one 5-sec video at $0.09/sec in stress scenario', source: 'Replicate video example $0.09/sec 480p.' }
], [
  { key: 'item', label: 'Статья' },
  { key: 'value', label: 'Модельное допущение' },
  { key: 'source', label: 'Источник / основание' }
]));
lines.push('');

lines.push('## 9. Unit Economics By Scale');
lines.push('');
lines.push(mdTable(scenarios.map(costRow), [
  { key: 'mau', label: 'MAU' },
  { key: 'ai', label: 'AI text' },
  { key: 'images', label: 'Images' },
  { key: 'storage', label: 'Storage' },
  { key: 'analytics', label: 'Analytics' },
  { key: 'push', label: 'Push' },
  { key: 'support', label: 'Support' },
  { key: 'infra', label: 'Infra/Admin' },
  { key: 'total', label: 'Total/mo' },
  { key: 'perMau', label: 'Cost/MAU' },
  { key: 'withVideo', label: 'If optional video' }
]));
lines.push('');

lines.push('Главный вывод: в image-first MVP себестоимость не выглядит убийственной, но изображения уже становятся основной переменной статьей. Видео нельзя давать всем бесплатно: даже один 5-секундный video moment для 15% MAU заметно увеличивает расходы. Поэтому video avatar должен быть либо premium/token, либо validation-only ручным экспериментом.');
lines.push('');

lines.push('## 10. Sensitivity Analysis');
lines.push('');
lines.push(mdTable([
  { variable: 'Images per MAU', low: '2/mo', base: '4/mo', high: '12/mo', impact: 'Главный variable cost. Daily images for free users can triple cost.' },
  { variable: 'Image model', low: '$0.003/image', base: '$0.03/image', high: '$0.04+/image', impact: 'Provider/model choice can change image COGS by 10x.' },
  { variable: 'Active days', low: '4/mo', base: '8/mo', high: '20/mo', impact: 'Retention increases value but also AI usage.' },
  { variable: 'Paid conversion', low: '1%', base: '5%', high: '10%', impact: 'At low conversion free COGS must be aggressively limited.' },
  { variable: 'Video usage', low: '0', base: 'premium only', high: 'free daily', impact: 'Free daily video likely breaks MVP margin.' },
  { variable: 'Store fee', low: '15%', base: '30%', high: '30% + taxes', impact: 'Subscription net revenue must be modeled after platform fees.' },
  { variable: 'Support load', low: 'self-serve', base: 'light', high: 'high-touch wellbeing', impact: 'If users treat AURA like coaching/therapy, support cost and safety burden rise.' }
], [
  { key: 'variable', label: 'Variable' },
  { key: 'low', label: 'Low' },
  { key: 'base', label: 'Base' },
  { key: 'high', label: 'High' },
  { key: 'impact', label: 'Impact' }
]));
lines.push('');

lines.push('## 11. Revenue And Margin Scenarios');
lines.push('');
lines.push(mdTable([
  { mau: '1,000', conv: '1%', paid: '10', net: '$56', cogs: costRow(1000).total, result: 'Убыточно без ограничения free costs. 1% paid conversion недостаточен.' },
  { mau: '1,000', conv: '5%', paid: '50', net: '$280', cogs: costRow(1000).total, result: 'Почти бьется product COGS, но не покрывает маркетинг и команду.' },
  { mau: '10,000', conv: '3%', paid: '300', net: '$1,678', cogs: costRow(10000).total, result: 'Нужно либо лучше конвертировать, либо снижать image frequency/free cost.' },
  { mau: '10,000', conv: '7%', paid: '700', net: '$3,914', cogs: costRow(10000).total, result: 'Product gross margin начинает выглядеть рабочей, paid acquisition еще не доказан.' },
  { mau: '100,000', conv: '5%', paid: '5,000', net: '$27,965', cogs: costRow(100000).total, result: 'Становится бизнесом только при сильном retention и контроле image/video costs.' }
], [
  { key: 'mau', label: 'MAU' },
  { key: 'conv', label: 'Paid conversion' },
  { key: 'paid', label: 'Paid users' },
  { key: 'net', label: 'Net revenue/mo after 30% store fee at $7.99' },
  { key: 'cogs', label: 'Product COGS/mo' },
  { key: 'result', label: 'Вывод' }
]));
lines.push('');

lines.push('## 12. Cost Control Rules');
lines.push('');
lines.push(mdTable([
  { rule: 'No free daily video', reason: 'Видео может стоить больше подписочной маржи.', implementation: 'Video only paid token/premium validation.' },
  { rule: 'Image budget per free user', reason: 'Images dominate variable COGS.', implementation: 'Free: 1-2 images/week; paid: more styles and recaps.' },
  { rule: 'Prompt caching and templates', reason: 'Большая часть system prompt повторяется.', implementation: 'Cache where provider supports it; use structured templates.' },
  { rule: 'Async generation', reason: 'Latency and retries не должны блокировать UX.', implementation: 'Queue, pending state, retry, fallback.' },
  { rule: 'Cost log per generation', reason: 'Без cost-per-loop нельзя принимать pricing decisions.', implementation: 'provider, tokens, images, seconds, latency, estimated_cost.' },
  { rule: 'Manual QA before scaling', reason: 'AI quality важнее автомасштаба до 100 users.', implementation: 'Prompt review and admin override for early cohorts.' }
], [
  { key: 'rule', label: 'Правило' },
  { key: 'reason', label: 'Почему' },
  { key: 'implementation', label: 'Как внедрить' }
]));
lines.push('');

lines.push('## 13. Security And Privacy Requirements');
lines.push('');
lines.push(mdTable([
  { requirement: 'PII minimization', reason: 'Дата рождения чувствительна.', implementation: 'Не собирать адрес, телефон, фото лица в MVP unless absolutely needed.' },
  { requirement: 'Data deletion', reason: 'Trust and compliance.', implementation: 'DELETE /profile and asset deletion job.' },
  { requirement: 'Consent versioning', reason: 'Нужно знать, с какой политикой согласился user.', implementation: 'consents table with policy_version.' },
  { requirement: 'Provider secrecy', reason: 'API keys and prompts are sensitive.', implementation: 'All AI calls via backend only.' },
  { requirement: 'Asset privacy', reason: 'Avatar/Life Canvas может быть личным.', implementation: 'Private buckets, signed URLs, thumbnails.' },
  { requirement: 'Safety moderation', reason: 'Wellbeing/spirituality adjacent risk.', implementation: 'Prompt rules, output filter, report issue, admin review.' },
  { requirement: 'No deterministic claims', reason: 'Не обещать судьбу/диагноз.', implementation: 'AI output contract forbids medical/absolute predictions.' },
  { requirement: 'Audit log', reason: 'Admin changes prompts and templates.', implementation: 'admin_actions table.' }
], [
  { key: 'requirement', label: 'Requirement' },
  { key: 'reason', label: 'Reason' },
  { key: 'implementation', label: 'Implementation' }
]));
lines.push('');

lines.push('## 14. Build Phases');
lines.push('');
lines.push(mdTable([
  { phase: 'Phase 0', scope: 'Clickable prototype + fake backend + manual content', goal: '20 interviews and comprehension test.', exit: '70% understand Episode -> Action -> Avatar causality.' },
  { phase: 'Phase 1', scope: 'Real auth/profile/season/episode/action/reflection/image/paywall sandbox', goal: '30-100 concierge users.', exit: 'Completed loop and D1 return measurable.' },
  { phase: 'Phase 2', scope: 'Notifications, memory, weekly recap, admin prompts, cost dashboard', goal: '1000 users without chaos.', exit: 'D7 and trial intent visible.' },
  { phase: 'Phase 3', scope: 'Provider optimization, experiments, paid acquisition readiness', goal: 'Scale only if unit economics and retention pass.', exit: 'CAC/LTV test can start.' }
], [
  { key: 'phase', label: 'Фаза' },
  { key: 'scope', label: 'Что строим' },
  { key: 'goal', label: 'Цель' },
  { key: 'exit', label: 'Условие выхода' }
]));
lines.push('');

lines.push('## 15. Engineering Roadmap');
lines.push('');
lines.push(mdTable([
  { sprint: 'Sprint 1', deliverable: 'Repo setup, app shell, backend skeleton, DB schema, auth/session.', output: 'User can open app, create session, accept consent.', risk: 'Too much time on design polish before flow works.' },
  { sprint: 'Sprint 2', deliverable: 'Profile, season templates, episode prompt v1, structured output.', output: 'Day 1 episode generated and saved.', risk: 'AI output generic; needs prompt QA.' },
  { sprint: 'Sprint 3', deliverable: 'Action, reset, reflection, analytics events.', output: 'Completed loop without avatar.', risk: 'Action friction too high.' },
  { sprint: 'Sprint 4', deliverable: 'Image provider, avatar state, storage, pending/failure states.', output: 'Life Canvas shift with explanation.', risk: 'Visual causality unclear.' },
  { sprint: 'Sprint 5', deliverable: 'Paywall sandbox, RevenueCat webhook, entitlements.', output: 'Trial/subscription unlocks memory/premium flags.', risk: 'Paywall timing hurts D1.' },
  { sprint: 'Sprint 6', deliverable: 'Memory, weekly recap, notifications.', output: '7-day season can complete.', risk: 'Recap weak without enough user data.' },
  { sprint: 'Sprint 7', deliverable: 'Admin prompts/templates/safety queue.', output: 'Team can operate first cohort.', risk: 'Admin scope creep.' },
  { sprint: 'Sprint 8', deliverable: 'QA, dashboards, cost logging, soft launch.', output: '30-100 users measured end-to-end.', risk: 'No single owner for event quality.' }
], [
  { key: 'sprint', label: 'Sprint' },
  { key: 'deliverable', label: 'Deliverable' },
  { key: 'output', label: 'Output' },
  { key: 'risk', label: 'Risk' }
]));
lines.push('');

lines.push('## 16. Technical Risk Register');
lines.push('');
lines.push(mdTable([
  { risk: 'AI output feels generic', probability: 'High', impact: 'High', mitigation: 'PromptVersion, manual QA, profile context, user feedback flag.' },
  { risk: 'Image not causally understood', probability: 'High', impact: 'Very high', mitigation: 'Explanation copy, visual trait mapping, prototype interviews.' },
  { risk: 'Video cost explodes', probability: 'Medium', impact: 'High', mitigation: 'No free video in MVP, premium/token only.' },
  { risk: 'Paywall breaks trust', probability: 'Medium', impact: 'High', mitigation: 'Paywall only after completed loop.' },
  { risk: 'Data/privacy concerns', probability: 'Medium', impact: 'High', mitigation: 'Consent, deletion, no face upload in MVP.' },
  { risk: 'Analytics unreliable', probability: 'Medium', impact: 'High', mitigation: 'Event taxonomy, QA checklist, dashboard before launch.' },
  { risk: 'Admin not ready', probability: 'Medium', impact: 'Medium', mitigation: 'Minimal prompt/template controls before 100 users.' },
  { risk: 'Backend overbuilt', probability: 'Medium', impact: 'Medium', mitigation: 'Build only core loop modules before community/marketplace.' }
], [
  { key: 'risk', label: 'Risk' },
  { key: 'probability', label: 'Probability' },
  { key: 'impact', label: 'Impact' },
  { key: 'mitigation', label: 'Mitigation' }
]));
lines.push('');

lines.push('## 17. Implementation Backlog');
lines.push('');
lines.push(mdTable([
  { id: 'T-01', task: 'Create mobile app shell', area: 'Frontend', output: 'Navigation, session state, empty Welcome.', priority: 'P0' },
  { id: 'T-02', task: 'Implement consent flow', area: 'Frontend/Backend', output: 'Policy version accepted and stored.', priority: 'P0' },
  { id: 'T-03', task: 'Profile form', area: 'Frontend', output: 'Birth date, mood, current goal saved.', priority: 'P0' },
  { id: 'T-04', task: 'Season templates API', area: 'Backend', output: 'Active templates returned to app.', priority: 'P0' },
  { id: 'T-05', task: 'Start season endpoint', area: 'Backend', output: 'One active season per user.', priority: 'P0' },
  { id: 'T-06', task: 'PromptVersion registry', area: 'AI/Admin', output: 'Prompt templates versioned.', priority: 'P0' },
  { id: 'T-07', task: 'Episode generation endpoint', area: 'AI/Backend', output: 'Structured episode JSON saved.', priority: 'P0' },
  { id: 'T-08', task: 'Episode safety filter', area: 'AI/Safety', output: 'No diagnosis/prediction/harmful advice.', priority: 'P0' },
  { id: 'T-09', task: 'Episode screen', area: 'Frontend', output: 'Title, insight, conflict, resource, risk.', priority: 'P0' },
  { id: 'T-10', task: 'Action options generation', area: 'AI/Backend', output: 'Easy/normal/brave actions.', priority: 'P0' },
  { id: 'T-11', task: 'Action selection UI', area: 'Frontend', output: 'Select and soften action.', priority: 'P0' },
  { id: 'T-12', task: 'Reset timer', area: 'Frontend', output: '30-60 sec reset with skip/complete.', priority: 'P0' },
  { id: 'T-13', task: 'Reflection UI', area: 'Frontend', output: 'Emotion + optional note.', priority: 'P0' },
  { id: 'T-14', task: 'Avatar state data model', area: 'Backend', output: 'Causal visual traits saved.', priority: 'P0' },
  { id: 'T-15', task: 'Image provider integration', area: 'AI/Image', output: 'Generate and store Life Canvas asset.', priority: 'P0' },
  { id: 'T-16', task: 'Avatar pending/failure states', area: 'Frontend', output: 'No blocked UI during generation.', priority: 'P0' },
  { id: 'T-17', task: 'Avatar explanation copy', area: 'Product/Frontend', output: 'Changed because of action X.', priority: 'P0' },
  { id: 'T-18', task: 'Event collector', area: 'Analytics', output: 'POST /events and batch retry.', priority: 'P0' },
  { id: 'T-19', task: 'Core funnel dashboard', area: 'Analytics', output: 'Activation, loop, D1, paywall.', priority: 'P0' },
  { id: 'T-20', task: 'Cost logging', area: 'Backend/Data', output: 'Provider, tokens/images, estimated cost.', priority: 'P0' },
  { id: 'T-21', task: 'RevenueCat sandbox', area: 'Billing', output: 'Purchase, restore, entitlement.', priority: 'P0' },
  { id: 'T-22', task: 'Paywall config API', area: 'Backend', output: 'Placement and copy variants.', priority: 'P1' },
  { id: 'T-23', task: 'Memory archive', area: 'Frontend/Backend', output: 'Season timeline.', priority: 'P1' },
  { id: 'T-24', task: 'Weekly recap', area: 'AI/Frontend', output: '7-day recap generated.', priority: 'P1' },
  { id: 'T-25', task: 'Push notification setup', area: 'Mobile', output: 'Tomorrow hook reminder.', priority: 'P1' },
  { id: 'T-26', task: 'Comeback flow', area: 'Product/Frontend', output: 'Missed day recovery.', priority: 'P1' },
  { id: 'T-27', task: 'Admin prompt publish', area: 'Admin', output: 'Publish/rollback prompt versions.', priority: 'P1' },
  { id: 'T-28', task: 'Admin safety queue', area: 'Admin/Safety', output: 'Review reported outputs.', priority: 'P1' },
  { id: 'T-29', task: 'Data export/delete', area: 'Privacy', output: 'User can remove data.', priority: 'P1' },
  { id: 'T-30', task: 'Share card', area: 'Growth/Frontend', output: 'Optional card after avatar shift.', priority: 'P2' },
  { id: 'T-31', task: 'Style presets', area: 'Image/Product', output: '2-3 Life Canvas styles.', priority: 'P2' },
  { id: 'T-32', task: 'Provider fallback', area: 'AI/Backend', output: 'Switch provider on failure.', priority: 'P2' },
  { id: 'T-33', task: 'LLM eval set', area: 'AI/Data', output: 'Manual examples and scoring.', priority: 'P2' },
  { id: 'T-34', task: 'A/B experiment flags', area: 'Backend/Product', output: 'Paywall and copy variants.', priority: 'P2' },
  { id: 'T-35', task: 'Video token experiment', area: 'AI/Image', output: 'Paid/manual only.', priority: 'Later' },
  { id: 'T-36', task: 'Community features', area: 'Product', output: 'Not MVP.', priority: 'Later' }
], [
  { key: 'id', label: 'ID' },
  { key: 'task', label: 'Task' },
  { key: 'area', label: 'Area' },
  { key: 'output', label: 'Output' },
  { key: 'priority', label: 'Priority' }
]));
lines.push('');

lines.push('## 18. Event Taxonomy');
lines.push('');
lines.push(mdTable([
  { event: 'app_opened', when: 'Every app open.', props: 'source, user_state, app_version', decision: 'Baseline activity.' },
  { event: 'onboarding_started', when: 'Welcome start.', props: 'source, campaign', decision: 'Top funnel.' },
  { event: 'consent_accepted', when: 'Privacy accepted.', props: 'policy_version', decision: 'Trust barrier.' },
  { event: 'profile_started', when: 'Profile screen opened.', props: 'fields_visible', decision: 'Onboarding friction.' },
  { event: 'profile_completed', when: 'Profile saved.', props: 'fields_count, skipped_birth_date', decision: 'Personalization readiness.' },
  { event: 'season_template_viewed', when: 'Season select opened.', props: 'recommended_theme', decision: 'Theme demand.' },
  { event: 'season_started', when: 'Season chosen.', props: 'theme, day_index', decision: 'Season intent.' },
  { event: 'episode_generate_started', when: 'Backend generation starts.', props: 'model, prompt_version', decision: 'Latency/cost.' },
  { event: 'episode_generated', when: 'Episode saved.', props: 'latency_ms, estimated_cost, safety_status', decision: 'AI reliability.' },
  { event: 'episode_read', when: 'Read threshold reached.', props: 'read_time, scroll_depth', decision: 'Content engagement.' },
  { event: 'episode_reported', when: 'User reports issue.', props: 'reason, prompt_version', decision: 'Safety/product quality.' },
  { event: 'action_selected', when: 'Action chosen.', props: 'difficulty, estimated_minutes', decision: 'Action fit.' },
  { event: 'action_softened', when: 'User asks easier version.', props: 'original_difficulty', decision: 'Difficulty tuning.' },
  { event: 'reset_started', when: 'Reset begins.', props: 'type, duration', decision: 'Reset adoption.' },
  { event: 'reset_completed', when: 'Reset complete.', props: 'duration, skipped=false', decision: 'Ritual value.' },
  { event: 'action_completed', when: 'Action marked done.', props: 'status, time_to_complete', decision: 'Core behavior.' },
  { event: 'reflection_saved', when: 'Emotion/note saved.', props: 'emotion_after, note_length', decision: 'Memory friction.' },
  { event: 'avatar_generate_started', when: 'Image job starts.', props: 'provider, style', decision: 'Image pipeline.' },
  { event: 'avatar_generated', when: 'Asset ready.', props: 'latency_ms, estimated_cost, provider', decision: 'Visual cost/quality.' },
  { event: 'avatar_causality_checked', when: 'User answers/interaction shows understanding.', props: 'understood=true/false', decision: 'Main hypothesis.' },
  { event: 'tomorrow_hook_seen', when: 'Hook shown.', props: 'day_index, reminder_prompted', decision: 'Return setup.' },
  { event: 'push_opt_in', when: 'Notifications enabled.', props: 'placement', decision: 'Reminder viability.' },
  { event: 'paywall_viewed', when: 'Paywall shown.', props: 'placement, offer, price', decision: 'Monetization timing.' },
  { event: 'trial_started', when: 'Trial starts.', props: 'plan, store', decision: 'WTP.' },
  { event: 'subscription_started', when: 'Paid starts.', props: 'plan, net_price', decision: 'Revenue.' },
  { event: 'season_completed', when: 'Day 7 complete.', props: 'actions_completed, recaps_saved', decision: 'D7 success.' },
  { event: 'share_card_clicked', when: 'Share card opened.', props: 'screen, style', decision: 'Virality.' },
  { event: 'data_delete_requested', when: 'User requests deletion.', props: 'reason optional', decision: 'Trust/privacy.' }
], [
  { key: 'event', label: 'Event' },
  { key: 'when', label: 'When' },
  { key: 'props', label: 'Properties' },
  { key: 'decision', label: 'Decision' }
]));
lines.push('');

lines.push('## 19. QA Checklist Before First Cohort');
lines.push('');
lines.push(mdTable([
  { area: 'Onboarding', check: 'User can complete profile in under 90 seconds.', owner: 'Product/QA' },
  { area: 'Privacy', check: 'Consent version stored and visible.', owner: 'Backend' },
  { area: 'Episode', check: '10 test profiles produce safe, non-generic outputs.', owner: 'AI/Product' },
  { area: 'Action', check: 'Every episode has easy/normal/brave action.', owner: 'AI/Product' },
  { area: 'Reset', check: 'Reset can complete, skip and resume without broken state.', owner: 'Mobile' },
  { area: 'Reflection', check: 'Emotion-only save works.', owner: 'Mobile/Backend' },
  { area: 'Avatar', check: 'Pending, success, failure and retry states work.', owner: 'Mobile/Backend' },
  { area: 'Causality', check: 'Avatar explanation names the action that caused change.', owner: 'Product' },
  { area: 'Storage', check: 'Assets are private and have thumbnails.', owner: 'Backend' },
  { area: 'Billing', check: 'Sandbox purchase, restore and webhook sync work.', owner: 'Mobile/Backend' },
  { area: 'Analytics', check: 'Core funnel events visible in dashboard.', owner: 'Data' },
  { area: 'Cost', check: 'Every AI/image call writes estimated cost.', owner: 'Backend/Data' },
  { area: 'Safety', check: 'Report issue creates admin review item.', owner: 'Backend/Admin' },
  { area: 'Notifications', check: 'Tomorrow reminder can be scheduled and opened.', owner: 'Mobile' },
  { area: 'Memory', check: 'Day 1 and Day 2 references connect correctly.', owner: 'Backend/AI' },
  { area: 'Deletion', check: 'Data deletion path tested on staging.', owner: 'Backend' }
], [
  { key: 'area', label: 'Area' },
  { key: 'check', label: 'Check' },
  { key: 'owner', label: 'Owner' }
]));
lines.push('');

lines.push('## 20. Source Notes');
lines.push('');
lines.push(mdTable([
  { provider: 'OpenAI', fact: 'GPT-4.1 mini pricing used: $0.40 input / $1.60 output per 1M tokens.', url: 'https://developers.openai.com/api/docs/models/gpt-4.1-mini' },
  { provider: 'Anthropic', fact: 'Claude Sonnet 4.6 pricing: $3 input / $15 output per 1M tokens; Haiku 4.5: $1 / $5.', url: 'https://platform.claude.com/docs/en/about-claude/pricing' },
  { provider: 'Together AI', fact: 'Image pricing examples include FLUX.2 pro around $0.03/image and FLUX.2 dev around $0.0154/image.', url: 'https://www.together.ai/pricing' },
  { provider: 'Replicate', fact: 'FLUX and video examples used for stress testing; e.g. FLUX 1.1 pro $0.04/image and Wan i2v 480p $0.09/sec.', url: 'https://replicate.com/pricing' },
  { provider: 'Supabase', fact: 'Pro starts at $25/mo, includes 100k MAU, 8GB disk, 250GB egress, 100GB file storage.', url: 'https://supabase.com/pricing' },
  { provider: 'RevenueCat', fact: 'Starts free up to $2,500 MTR, then 1% tracked revenue after that threshold.', url: 'https://www.revenuecat.com/pricing/' }
], [
  { key: 'provider', label: 'Источник' },
  { key: 'fact', label: 'Что взяли в модель' },
  { key: 'url', label: 'URL' }
]));
lines.push('');

lines.push('## 21. Final Technical Decision');
lines.push('');
lines.push('Строить AURA MVP нужно как легкий мобильный продукт с жестким контролем AI/image costs. Архитектурно важно не переусложнить запуск: React Native, NestJS, Postgres, RevenueCat, один основной LLM, image-first avatar, простая admin-панель и сильная аналитика. Финансово важнейшее ограничение: free пользователь не должен получать дорогой ежедневный video/avatar pipeline. До доказательства D1/D7 и willingness to pay нужно считать не “сколько стоит разработать мечту”, а “сколько стоит один completed loop и один вернувшийся завтра пользователь”.');

fs.mkdirSync('reports', { recursive: true });
fs.writeFileSync(OUT, `${lines.join('\n').trimEnd()}\n`);
console.log(`aura_technical_blueprint=${OUT}`);
