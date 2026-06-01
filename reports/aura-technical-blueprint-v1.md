# AURA Technical Blueprint v1

Этот документ отвечает на вопрос: как именно собирать AURA MVP технически, сколько это примерно стоит при росте пользователей и какие решения нельзя откладывать до разработки. Он не заменяет финальное ТЗ, но задает архитектурную рамку, стек, unit economics и границы MVP.

Главное решение: MVP должен быть mobile-first, image-first и analytics-first. Видеоаватар, marketplace, community и тяжелый AI companion не входят в MVP, потому что главный риск сейчас - не наличие рынка, а прохождение петли Episode -> Action -> Reset -> Avatar -> Return Tomorrow.

## 1. Architecture Decision

| Слой | Технология | Стоимость | Почему выбрана | Риск |
| --- | --- | --- | --- | --- |
| Frontend | React Native + Expo | $0 platform cost; developer time | Быстрее собрать iOS/Android MVP, легче подключить RevenueCat, push, analytics и OTA updates. | Сложные native animations и avatar/video editing могут потребовать native modules. |
| Backend | NestJS on Fly.io/Render/Railway or managed container | $25-300/mo MVP, выше при росте | Четкая модульная архитектура, TypeScript, удобно для API, jobs, billing webhooks и admin. | Нужно дисциплинированно не строить enterprise backend раньше времени. |
| Database | Postgres via Supabase Pro | От $25/mo; Pro включает 100k MAU и базовые лимиты | Postgres лучше подходит для связанных сущностей: user, season, episode, action, reflection, avatar state. | При тяжелых assets и логах нельзя складывать все в Postgres. |
| Storage | S3-compatible storage / Supabase Storage for MVP | Supabase Pro включает 100GB storage, далее usage-based | Нужно хранить avatar/canvas assets, recaps, exports. | Изображения быстро раздувают storage/egress, нужна компрессия и lifecycle policy. |
| AI Brain | OpenAI GPT-4.1 mini first, Claude/Gemini as fallback later | GPT-4.1 mini: $0.40 input / $1.60 output за 1M tokens | Хороший баланс цены, скорости, structured output и tool calling для MVP. | Качество “личности” может требовать prompt QA или более дорогой модели на отдельных шагах. |
| Image | Together FLUX.2 pro/dev or Replicate FLUX | Около $0.015-$0.04/image depending provider/model | Для MVP достаточно image-first Life Canvas; видео не нужно в core loop. | Если делать изображение каждый день для всех, себестоимость быстро становится главной статьей. |
| Video avatar | Not MVP; later Replicate/Tavus/HeyGen tests | Replicate video examples: $0.09/sec 480p, $0.25/sec 720p for Wan i2v | Видео может стать premium/token moment, но разрушает экономику free MVP. | Deepfake/privacy, latency, moderation, cost. |
| Payments | RevenueCat + App Store/Google Play IAP | Free up to $2.5k MTR, then 1% tracked revenue; store fee separately | Быстрый subscription stack, restore purchases, webhooks, entitlement source of truth. | Нужно считать store fee и RevenueCat fee отдельно. |
| Analytics | PostHog / Amplitude / Firebase Analytics | $0-$300/mo early depending tool and events | MVP без analytics бессмысленен: нужно видеть loop completion, D1, D7, paywall. | Слишком много событий без product questions. |
| Admin | Retool/Supabase Studio/internal Next.js later | $0-$50/mo early + dev time | Нужно менять prompts, season templates, смотреть safety flags без релиза приложения. | Не строить большой backoffice до первых пользователей. |

## 2. System Architecture

| Блок | Что делает | Интеграции | Данные |
| --- | --- | --- | --- |
| Mobile App | Onboarding, profile, season, episode, action, reset, reflection, Life Canvas, paywall, reminders. | RevenueCat SDK, analytics SDK, push, backend API. | Сохраняет минимум локального cache, не хранит secrets. |
| API Backend | Auth session, profile, seasons, episodes, actions, avatar jobs, billing webhooks, admin. | Supabase/Postgres, OpenAI, image provider, RevenueCat, analytics. | Единый слой бизнес-правил и state transitions. |
| Postgres | Хранит связанные сущности продукта. | Supabase APIs, backend service role. | UserProfile, Season, Episode, Action, Reflection, AvatarState, Subscription, Event. |
| AI Layer | Генерирует episode/action/reset recap, structured JSON, safety checked outputs. | OpenAI primary, optional Claude/Gemini fallback. | PromptVersion, request/response metadata, cost logs. |
| Image Layer | Генерирует image-first Life Canvas shifts. | Together/Replicate/other provider. | Prompt, provider, asset id, latency, cost. |
| Storage | Хранит изображения, exports, preview cards. | S3/Supabase Storage/CDN. | Compressed assets, thumbnails, lifecycle policy. |
| Billing | Entitlements, trial, subscription status, webhooks. | RevenueCat, App Store, Google Play. | Plan, status, renewal, cancellation reason. |
| Analytics | Funnel, retention, paywall, cost-per-loop, avatar causality. | PostHog/Amplitude/Firebase, warehouse later. | Events with user_state and experiment_id. |
| Admin | Prompt publish, safety review, season templates, user issue review. | Backend admin endpoints. | Prompt versions, moderation queue, feature flags. |

## 3. Recommended Stack For MVP

Рекомендация: React Native + Expo, NestJS, Supabase Postgres, S3/Supabase Storage, OpenAI GPT-4.1 mini, Together/Replicate FLUX, RevenueCat, PostHog/Firebase Analytics, Retool or simple internal admin. Это не “идеальный навсегда” стек, а стек, который быстрее всего доводит продукт до интервью, прототипа и первых 30-100 пользователей.

| Решение | Почему | Альтернатива |
| --- | --- | --- |
| React Native вместо Flutter | Больше готовых integrations для paywall/analytics/AI tooling и быстрее нанимать JS/TS команду. | Flutter тоже валиден, если команда уже сильнее во Flutter. |
| NestJS вместо no-code backend | Нужны state transitions, async jobs, billing webhooks, admin endpoints и cost logs. | Supabase Edge Functions можно использовать для быстрого старта, но бизнес-логика быстро усложнится. |
| Postgres вместо Firestore | У AURA много связанных сущностей и отчетности; SQL проще для аналитики и unit economics. | Firestore хорош для realtime/simple mobile apps, но relational product graph здесь важнее. |
| Image-first вместо video-first | Видео дорого, медленно и рискованно; центральную гипотезу avatar causality можно проверить изображением. | Видео тестировать как premium token после proof of loop. |
| One primary LLM | На MVP лучше контролировать prompt quality и стоимость, чем строить router. | OpenRouter/LLM router после 1000+ активных пользователей и накопления evals. |
| RevenueCat с первого paid test | Restore, entitlements, webhooks и paywall experiments не стоит писать руками. | Чистый StoreKit/Google Billing только если команда хочет контролировать billing сама. |

## 4. Component Responsibilities

| Компонент | Ответственность | Must | Do not |
| --- | --- | --- | --- |
| Mobile Shell | Navigation, auth state, onboarding, paywall routing, offline event queue. | Fast cold start, no blank loading before Welcome. | Do not embed provider secrets or prompt logic. |
| Onboarding Module | Privacy, consent, birth date, current state, season choice. | Can resume if app closes mid-flow. | Do not ask 20 questions before first episode. |
| Episode Module | Render episode, read progress, dislike/report, action entry. | Supports generated and fallback episodes. | Do not expose raw AI output without product formatting. |
| Action Module | Action choices, difficulty, reminders, completion state. | Always offer a softer version. | Do not punish skipped or partial action. |
| Reset Module | Short ritual, timer, skip, complete, event logging. | 30-60 sec default. | Do not become a full meditation product in MVP. |
| Reflection Module | Emotion after, one-line note, save to memory. | Can save without text. | Do not require journaling friction. |
| Life Canvas Module | Pending state, generated image, explanation, save/share. | Show why canvas changed. | Do not show random beauty without causality. |
| Memory Module | Season history, recap, locked paid sections. | Make 7-day trajectory visible. | Do not overbuild timeline/social feed. |
| Billing Module | Paywall config, trial, purchase, restore, entitlement. | Single entitlement source of truth. | Do not hardcode prices in app. |
| Admin Module | Prompt versions, season templates, safety queue, manual overrides. | Prompt rollback. | Do not build a complex CRM. |

## 5. Database Schema Draft

| Table | Core columns | Indexes | Notes |
| --- | --- | --- | --- |
| users | id, email_hash, auth_provider, locale, timezone, created_at, deleted_at | id, auth_provider | PII минимум; не хранить лишние персональные данные. |
| user_profiles | user_id, display_name, birth_date, current_goal, mood, privacy_flags, updated_at | user_id | Birth date is sensitive; access only through backend. |
| consents | id, user_id, policy_version, accepted_at, revoked_at | user_id, policy_version | Нужно для доверия и compliance. |
| season_templates | id, theme, title, description, active, sort_order | active | Управляется из admin. |
| seasons | id, user_id, template_id, status, day_index, started_at, completed_at | user_id, status | Один active season в MVP. |
| prompt_versions | id, type, version, template, safety_rules, active, created_at | type, active | Все AI outputs должны знать prompt version. |
| episodes | id, season_id, day_index, title, insight, conflict, resource, risk, prompt_version_id, safety_status | season_id, day_index | Structured JSON, не raw blob only. |
| actions | id, episode_id, difficulty, text, estimated_minutes, status, selected_at, completed_at | episode_id, status | Action is observable behavior. |
| reset_sessions | id, action_id, reset_type, duration_sec, status, started_at, completed_at | action_id | Skip allowed. |
| reflections | id, action_id, emotion_after, note, created_at | action_id | One-line reflection. |
| avatar_states | id, user_id, season_id, episode_id, action_id, visual_traits_json, explanation, asset_id, created_at | user_id, season_id | Core causal visual state. |
| assets | id, user_id, provider, type, url, thumbnail_url, status, estimated_cost, latency_ms | user_id, provider, status | Cost and provider logging mandatory. |
| subscriptions | user_id, store, revenuecat_id, entitlement, status, trial_start, renewal_at | user_id, status | RevenueCat webhook source. |
| notifications | id, user_id, type, scheduled_at, sent_at, opened_at, status | user_id, scheduled_at | D1/D7 return loop. |
| events | id, user_id, event_name, user_state, properties_json, client_ts, server_ts | event_name, server_ts, user_id | Could later move to warehouse. |
| generation_logs | id, user_id, provider, model, input_units, output_units, estimated_cost, latency_ms, status | provider, model, created_at | Unit economics depends on this. |

## 6. API Groups

| Group | Endpoints | Owner | QA |
| --- | --- | --- | --- |
| Auth/Profile | POST /auth/session, PATCH /profile, GET /profile, DELETE /profile | Backend/mobile | Can create, resume, export/delete data. |
| Consent | GET /consent/current, POST /consent/accept, POST /consent/revoke | Backend | Policy version stored. |
| Season | GET /seasons/templates, POST /seasons, GET /seasons/current, PATCH /seasons/:id | Backend/product | Only one active MVP season. |
| Episode | POST /episodes/generate, GET /episodes/today, POST /episodes/:id/report | AI/backend | Fallback and safety status. |
| Action | POST /actions/select, PATCH /actions/:id, POST /actions/:id/complete | Backend/mobile | Partial completion valid. |
| Reset | POST /reset/start, POST /reset/:id/complete | Backend/mobile | Skip does not break flow. |
| Reflection | POST /reflections, PATCH /reflections/:id | Backend/mobile | Text optional. |
| Avatar | POST /avatar/generate, GET /avatar/:job_id, GET /avatar/current | AI/image/backend | Async job, pending/failure/retry. |
| Memory | GET /memory, GET /recap/weekly, POST /recap/generate | Backend/AI | Free locks and paid unlocks. |
| Billing | GET /paywall, POST /billing/webhook, GET /entitlements | Backend/mobile | Sandbox purchase and restore. |
| Events | POST /events, POST /events/batch | Data/mobile | Offline batch and dedupe. |
| Admin | GET/POST /admin/prompts, /admin/templates, /admin/moderation | Backend/internal | Role protected, audit log. |

## 7. Provider Comparison

| Category | Provider | Pros | Cons | Verdict |
| --- | --- | --- | --- | --- |
| LLM primary | OpenAI GPT-4.1 mini | Low cost, strong structured output, good speed. | May need prompt tuning for warmth. | Use for MVP default. |
| LLM quality fallback | Claude Sonnet | Strong writing/reasoning quality. | Much more expensive per token. | Use only for evals or premium generation later. |
| LLM low-cost fallback | Gemini/DeepSeek via router | Potentially cheaper/fast. | Quality and safety variance. | Not day-one unless team already has eval harness. |
| Image primary | Together FLUX.2 dev/pro | Clear per-image pricing and API. | Style consistency needs prompts/seeds. | Good MVP candidate. |
| Image alternative | Replicate FLUX | Many models and fast experimentation. | Costs vary by model; latency varies. | Good for experiments and fallback. |
| Video later | Replicate/Tavus/HeyGen | Can create premium wow moments. | Expensive, privacy/deepfake risk, longer latency. | Not free MVP. |
| Billing | RevenueCat | Fast subscriptions, entitlements, webhooks. | Adds fee after revenue threshold. | Use from first paid test. |
| Analytics | PostHog/Firebase/Amplitude | Funnels, cohorts, events. | Pricing can rise with events. | Use one; do not duplicate event stacks. |

## 8. Unit Economics Assumptions

Ниже модель не претендует на бухгалтерскую точность. Ее задача - понять порядок величин и главный риск. Допущение нормального MVP: 1 MAU в среднем имеет 8 активных дней в месяц, получает 4 image-based avatar shifts в месяц, daily AI использует GPT-4.1 mini, видеоаватар не входит в MVP. Store fee, VAT/tax, paid acquisition и зарплаты команды не включены в product COGS и считаются отдельно.

| Статья | Модельное допущение | Источник / основание |
| --- | --- | --- |
| AI text | 8 active days/user/month; ~3,200 input tokens and ~1,000 output tokens per active day | OpenAI GPT-4.1 mini public pricing: $0.40 input and $1.60 output per 1M tokens. |
| Image | 4 images/user/month at $0.03 each | Together FLUX.2 pro around $0.03/image; Replicate FLUX ranges around $0.003-$0.04/image depending model. |
| Storage | $0.006/user/month placeholder | Supabase Pro includes 100GB file storage, then overage. |
| Analytics | $0.01/user/month placeholder | Tool-dependent; MVP can start low/free but events must be planned. |
| Push | $0.002/user/month placeholder | Firebase/APNs costs usually not the first bottleneck for MVP. |
| Support | $0.025/user/month placeholder | Internal support/ops placeholder for early cohorts. |
| Infra base | $65 at 100-1,000 MAU; $220 at 10k; $1,300 at 100k | Supabase/hosting/monitoring/admin estimates, not exact invoices. |
| Optional video | 15% of MAU get one 5-sec video at $0.09/sec in stress scenario | Replicate video example $0.09/sec 480p. |

## 9. Unit Economics By Scale

| MAU | AI text | Images | Storage | Analytics | Push | Support | Infra/Admin | Total/mo | Cost/MAU | If optional video |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 100 | $2 | $12 | $1 | $1 | $0 | $3 | $65 | $84 | $0.84 | $90 |
| 1000 | $23 | $120 | $6 | $10 | $2 | $25 | $65 | $251 | $0.25 | $319 |
| 10000 | $230 | $1,200 | $60 | $100 | $20 | $250 | $220 | $2,080 | $0.21 | $2,755 |
| 100000 | $2,304 | $12,000 | $600 | $1,000 | $200 | $2,500 | $1,300 | $19,904 | $0.20 | $26,654 |

Главный вывод: в image-first MVP себестоимость не выглядит убийственной, но изображения уже становятся основной переменной статьей. Видео нельзя давать всем бесплатно: даже один 5-секундный video moment для 15% MAU заметно увеличивает расходы. Поэтому video avatar должен быть либо premium/token, либо validation-only ручным экспериментом.

## 10. Sensitivity Analysis

| Variable | Low | Base | High | Impact |
| --- | --- | --- | --- | --- |
| Images per MAU | 2/mo | 4/mo | 12/mo | Главный variable cost. Daily images for free users can triple cost. |
| Image model | $0.003/image | $0.03/image | $0.04+/image | Provider/model choice can change image COGS by 10x. |
| Active days | 4/mo | 8/mo | 20/mo | Retention increases value but also AI usage. |
| Paid conversion | 1% | 5% | 10% | At low conversion free COGS must be aggressively limited. |
| Video usage | 0 | premium only | free daily | Free daily video likely breaks MVP margin. |
| Store fee | 15% | 30% | 30% + taxes | Subscription net revenue must be modeled after platform fees. |
| Support load | self-serve | light | high-touch wellbeing | If users treat AURA like coaching/therapy, support cost and safety burden rise. |

## 11. Revenue And Margin Scenarios

| MAU | Paid conversion | Paid users | Net revenue/mo after 30% store fee at $7.99 | Product COGS/mo | Вывод |
| --- | --- | --- | --- | --- | --- |
| 1,000 | 1% | 10 | $56 | $251 | Убыточно без ограничения free costs. 1% paid conversion недостаточен. |
| 1,000 | 5% | 50 | $280 | $251 | Почти бьется product COGS, но не покрывает маркетинг и команду. |
| 10,000 | 3% | 300 | $1,678 | $2,080 | Нужно либо лучше конвертировать, либо снижать image frequency/free cost. |
| 10,000 | 7% | 700 | $3,914 | $2,080 | Product gross margin начинает выглядеть рабочей, paid acquisition еще не доказан. |
| 100,000 | 5% | 5,000 | $27,965 | $19,904 | Становится бизнесом только при сильном retention и контроле image/video costs. |

## 12. Cost Control Rules

| Правило | Почему | Как внедрить |
| --- | --- | --- |
| No free daily video | Видео может стоить больше подписочной маржи. | Video only paid token/premium validation. |
| Image budget per free user | Images dominate variable COGS. | Free: 1-2 images/week; paid: more styles and recaps. |
| Prompt caching and templates | Большая часть system prompt повторяется. | Cache where provider supports it; use structured templates. |
| Async generation | Latency and retries не должны блокировать UX. | Queue, pending state, retry, fallback. |
| Cost log per generation | Без cost-per-loop нельзя принимать pricing decisions. | provider, tokens, images, seconds, latency, estimated_cost. |
| Manual QA before scaling | AI quality важнее автомасштаба до 100 users. | Prompt review and admin override for early cohorts. |

## 13. Security And Privacy Requirements

| Requirement | Reason | Implementation |
| --- | --- | --- |
| PII minimization | Дата рождения чувствительна. | Не собирать адрес, телефон, фото лица в MVP unless absolutely needed. |
| Data deletion | Trust and compliance. | DELETE /profile and asset deletion job. |
| Consent versioning | Нужно знать, с какой политикой согласился user. | consents table with policy_version. |
| Provider secrecy | API keys and prompts are sensitive. | All AI calls via backend only. |
| Asset privacy | Avatar/Life Canvas может быть личным. | Private buckets, signed URLs, thumbnails. |
| Safety moderation | Wellbeing/spirituality adjacent risk. | Prompt rules, output filter, report issue, admin review. |
| No deterministic claims | Не обещать судьбу/диагноз. | AI output contract forbids medical/absolute predictions. |
| Audit log | Admin changes prompts and templates. | admin_actions table. |

## 14. Build Phases

| Фаза | Что строим | Цель | Условие выхода |
| --- | --- | --- | --- |
| Phase 0 | Clickable prototype + fake backend + manual content | 20 interviews and comprehension test. | 70% understand Episode -> Action -> Avatar causality. |
| Phase 1 | Real auth/profile/season/episode/action/reflection/image/paywall sandbox | 30-100 concierge users. | Completed loop and D1 return measurable. |
| Phase 2 | Notifications, memory, weekly recap, admin prompts, cost dashboard | 1000 users without chaos. | D7 and trial intent visible. |
| Phase 3 | Provider optimization, experiments, paid acquisition readiness | Scale only if unit economics and retention pass. | CAC/LTV test can start. |

## 15. Engineering Roadmap

| Sprint | Deliverable | Output | Risk |
| --- | --- | --- | --- |
| Sprint 1 | Repo setup, app shell, backend skeleton, DB schema, auth/session. | User can open app, create session, accept consent. | Too much time on design polish before flow works. |
| Sprint 2 | Profile, season templates, episode prompt v1, structured output. | Day 1 episode generated and saved. | AI output generic; needs prompt QA. |
| Sprint 3 | Action, reset, reflection, analytics events. | Completed loop without avatar. | Action friction too high. |
| Sprint 4 | Image provider, avatar state, storage, pending/failure states. | Life Canvas shift with explanation. | Visual causality unclear. |
| Sprint 5 | Paywall sandbox, RevenueCat webhook, entitlements. | Trial/subscription unlocks memory/premium flags. | Paywall timing hurts D1. |
| Sprint 6 | Memory, weekly recap, notifications. | 7-day season can complete. | Recap weak without enough user data. |
| Sprint 7 | Admin prompts/templates/safety queue. | Team can operate first cohort. | Admin scope creep. |
| Sprint 8 | QA, dashboards, cost logging, soft launch. | 30-100 users measured end-to-end. | No single owner for event quality. |

## 16. Technical Risk Register

| Risk | Probability | Impact | Mitigation |
| --- | --- | --- | --- |
| AI output feels generic | High | High | PromptVersion, manual QA, profile context, user feedback flag. |
| Image not causally understood | High | Very high | Explanation copy, visual trait mapping, prototype interviews. |
| Video cost explodes | Medium | High | No free video in MVP, premium/token only. |
| Paywall breaks trust | Medium | High | Paywall only after completed loop. |
| Data/privacy concerns | Medium | High | Consent, deletion, no face upload in MVP. |
| Analytics unreliable | Medium | High | Event taxonomy, QA checklist, dashboard before launch. |
| Admin not ready | Medium | Medium | Minimal prompt/template controls before 100 users. |
| Backend overbuilt | Medium | Medium | Build only core loop modules before community/marketplace. |

## 17. Implementation Backlog

| ID | Task | Area | Output | Priority |
| --- | --- | --- | --- | --- |
| T-01 | Create mobile app shell | Frontend | Navigation, session state, empty Welcome. | P0 |
| T-02 | Implement consent flow | Frontend/Backend | Policy version accepted and stored. | P0 |
| T-03 | Profile form | Frontend | Birth date, mood, current goal saved. | P0 |
| T-04 | Season templates API | Backend | Active templates returned to app. | P0 |
| T-05 | Start season endpoint | Backend | One active season per user. | P0 |
| T-06 | PromptVersion registry | AI/Admin | Prompt templates versioned. | P0 |
| T-07 | Episode generation endpoint | AI/Backend | Structured episode JSON saved. | P0 |
| T-08 | Episode safety filter | AI/Safety | No diagnosis/prediction/harmful advice. | P0 |
| T-09 | Episode screen | Frontend | Title, insight, conflict, resource, risk. | P0 |
| T-10 | Action options generation | AI/Backend | Easy/normal/brave actions. | P0 |
| T-11 | Action selection UI | Frontend | Select and soften action. | P0 |
| T-12 | Reset timer | Frontend | 30-60 sec reset with skip/complete. | P0 |
| T-13 | Reflection UI | Frontend | Emotion + optional note. | P0 |
| T-14 | Avatar state data model | Backend | Causal visual traits saved. | P0 |
| T-15 | Image provider integration | AI/Image | Generate and store Life Canvas asset. | P0 |
| T-16 | Avatar pending/failure states | Frontend | No blocked UI during generation. | P0 |
| T-17 | Avatar explanation copy | Product/Frontend | Changed because of action X. | P0 |
| T-18 | Event collector | Analytics | POST /events and batch retry. | P0 |
| T-19 | Core funnel dashboard | Analytics | Activation, loop, D1, paywall. | P0 |
| T-20 | Cost logging | Backend/Data | Provider, tokens/images, estimated cost. | P0 |
| T-21 | RevenueCat sandbox | Billing | Purchase, restore, entitlement. | P0 |
| T-22 | Paywall config API | Backend | Placement and copy variants. | P1 |
| T-23 | Memory archive | Frontend/Backend | Season timeline. | P1 |
| T-24 | Weekly recap | AI/Frontend | 7-day recap generated. | P1 |
| T-25 | Push notification setup | Mobile | Tomorrow hook reminder. | P1 |
| T-26 | Comeback flow | Product/Frontend | Missed day recovery. | P1 |
| T-27 | Admin prompt publish | Admin | Publish/rollback prompt versions. | P1 |
| T-28 | Admin safety queue | Admin/Safety | Review reported outputs. | P1 |
| T-29 | Data export/delete | Privacy | User can remove data. | P1 |
| T-30 | Share card | Growth/Frontend | Optional card after avatar shift. | P2 |
| T-31 | Style presets | Image/Product | 2-3 Life Canvas styles. | P2 |
| T-32 | Provider fallback | AI/Backend | Switch provider on failure. | P2 |
| T-33 | LLM eval set | AI/Data | Manual examples and scoring. | P2 |
| T-34 | A/B experiment flags | Backend/Product | Paywall and copy variants. | P2 |
| T-35 | Video token experiment | AI/Image | Paid/manual only. | Later |
| T-36 | Community features | Product | Not MVP. | Later |

## 18. Event Taxonomy

| Event | When | Properties | Decision |
| --- | --- | --- | --- |
| app_opened | Every app open. | source, user_state, app_version | Baseline activity. |
| onboarding_started | Welcome start. | source, campaign | Top funnel. |
| consent_accepted | Privacy accepted. | policy_version | Trust barrier. |
| profile_started | Profile screen opened. | fields_visible | Onboarding friction. |
| profile_completed | Profile saved. | fields_count, skipped_birth_date | Personalization readiness. |
| season_template_viewed | Season select opened. | recommended_theme | Theme demand. |
| season_started | Season chosen. | theme, day_index | Season intent. |
| episode_generate_started | Backend generation starts. | model, prompt_version | Latency/cost. |
| episode_generated | Episode saved. | latency_ms, estimated_cost, safety_status | AI reliability. |
| episode_read | Read threshold reached. | read_time, scroll_depth | Content engagement. |
| episode_reported | User reports issue. | reason, prompt_version | Safety/product quality. |
| action_selected | Action chosen. | difficulty, estimated_minutes | Action fit. |
| action_softened | User asks easier version. | original_difficulty | Difficulty tuning. |
| reset_started | Reset begins. | type, duration | Reset adoption. |
| reset_completed | Reset complete. | duration, skipped=false | Ritual value. |
| action_completed | Action marked done. | status, time_to_complete | Core behavior. |
| reflection_saved | Emotion/note saved. | emotion_after, note_length | Memory friction. |
| avatar_generate_started | Image job starts. | provider, style | Image pipeline. |
| avatar_generated | Asset ready. | latency_ms, estimated_cost, provider | Visual cost/quality. |
| avatar_causality_checked | User answers/interaction shows understanding. | understood=true/false | Main hypothesis. |
| tomorrow_hook_seen | Hook shown. | day_index, reminder_prompted | Return setup. |
| push_opt_in | Notifications enabled. | placement | Reminder viability. |
| paywall_viewed | Paywall shown. | placement, offer, price | Monetization timing. |
| trial_started | Trial starts. | plan, store | WTP. |
| subscription_started | Paid starts. | plan, net_price | Revenue. |
| season_completed | Day 7 complete. | actions_completed, recaps_saved | D7 success. |
| share_card_clicked | Share card opened. | screen, style | Virality. |
| data_delete_requested | User requests deletion. | reason optional | Trust/privacy. |

## 19. QA Checklist Before First Cohort

| Area | Check | Owner |
| --- | --- | --- |
| Onboarding | User can complete profile in under 90 seconds. | Product/QA |
| Privacy | Consent version stored and visible. | Backend |
| Episode | 10 test profiles produce safe, non-generic outputs. | AI/Product |
| Action | Every episode has easy/normal/brave action. | AI/Product |
| Reset | Reset can complete, skip and resume without broken state. | Mobile |
| Reflection | Emotion-only save works. | Mobile/Backend |
| Avatar | Pending, success, failure and retry states work. | Mobile/Backend |
| Causality | Avatar explanation names the action that caused change. | Product |
| Storage | Assets are private and have thumbnails. | Backend |
| Billing | Sandbox purchase, restore and webhook sync work. | Mobile/Backend |
| Analytics | Core funnel events visible in dashboard. | Data |
| Cost | Every AI/image call writes estimated cost. | Backend/Data |
| Safety | Report issue creates admin review item. | Backend/Admin |
| Notifications | Tomorrow reminder can be scheduled and opened. | Mobile |
| Memory | Day 1 and Day 2 references connect correctly. | Backend/AI |
| Deletion | Data deletion path tested on staging. | Backend |

## 20. Source Notes

| Источник | Что взяли в модель | URL |
| --- | --- | --- |
| OpenAI | GPT-4.1 mini pricing used: $0.40 input / $1.60 output per 1M tokens. | https://developers.openai.com/api/docs/models/gpt-4.1-mini |
| Anthropic | Claude Sonnet 4.6 pricing: $3 input / $15 output per 1M tokens; Haiku 4.5: $1 / $5. | https://platform.claude.com/docs/en/about-claude/pricing |
| Together AI | Image pricing examples include FLUX.2 pro around $0.03/image and FLUX.2 dev around $0.0154/image. | https://www.together.ai/pricing |
| Replicate | FLUX and video examples used for stress testing; e.g. FLUX 1.1 pro $0.04/image and Wan i2v 480p $0.09/sec. | https://replicate.com/pricing |
| Supabase | Pro starts at $25/mo, includes 100k MAU, 8GB disk, 250GB egress, 100GB file storage. | https://supabase.com/pricing |
| RevenueCat | Starts free up to $2,500 MTR, then 1% tracked revenue after that threshold. | https://www.revenuecat.com/pricing/ |

## 21. Final Technical Decision

Строить AURA MVP нужно как легкий мобильный продукт с жестким контролем AI/image costs. Архитектурно важно не переусложнить запуск: React Native, NestJS, Postgres, RevenueCat, один основной LLM, image-first avatar, простая admin-панель и сильная аналитика. Финансово важнейшее ограничение: free пользователь не должен получать дорогой ежедневный video/avatar pipeline. До доказательства D1/D7 и willingness to pay нужно считать не “сколько стоит разработать мечту”, а “сколько стоит один completed loop и один вернувшийся завтра пользователь”.
