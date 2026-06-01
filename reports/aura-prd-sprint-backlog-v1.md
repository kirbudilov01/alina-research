# AURA PRD / Sprint Backlog v1

Этот документ переводит AURA из research package в план разработки. Он отвечает на вопросы: что строим в MVP, кто что делает, сколько это займет, сколько примерно стоит, какие зависимости есть между задачами и по каким критериям принимать работу.

Главная продуктовая гипотеза остается прежней: пользователь должен пройти петлю Episode -> Action -> Reset -> Reflection -> Avatar -> Tomorrow Hook и понять, что Life Canvas изменился из-за его действия. Все спринты ниже служат только этой петле. Любая задача, которая не помогает проверить эту петлю, не входит в MVP.

## 1. Product Requirement Summary

| Пункт | Решение |
| --- | --- |
| Product | AURA mobile MVP: personal 7-day season with daily episode, action, reset, reflection, Life Canvas shift and return hook. |
| Primary user | Spiritual self-improvers / habit-progress users / avatar-future-self users who already show pull toward self-care and AI personalization. |
| Core loop | Episode -> Action -> Reset -> Reflection -> Avatar -> Tomorrow Hook. |
| MVP success | User completes first loop, understands avatar causality, returns on Day 2 and shows paid/trial intent after value. |
| MVP non-goals | No free daily video, no social network, no marketplace, no coach marketplace, no AR/metaverse, no public UGC. |
| Team assumption | 1 frontend/mobile, 1 backend, 0.5 AI/product engineer, 0.5 designer, 0.5 QA/data/product ops. |
| Cost assumption | Blended planning rate: $50 per hour. This is an estimate for planning, not a vendor quote. |

## 2. Sprint Plan

| Sprint | Theme | Goal | Hours | Cost at $50/h | Dependencies | Deliverables | Acceptance |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Sprint 1 | Foundation: app shell, auth, consent, profile, season start | Пользователь может открыть приложение, принять consent, заполнить минимальный профиль и выбрать первый сезон. | 180 | $9,000 | Design wireframes v0, privacy copy, season template list. | React Native app shell, backend skeleton, Postgres schema v1, auth/session, consent, profile, season templates, first analytics events. | Welcome -> Consent -> Profile -> Season Select проходит без ручной помощи; данные сохраняются; события видны в аналитике. |
| Sprint 2 | Episode and action loop | Пользователь получает первый episode, выбирает action, проходит reset и сохраняет reflection. | 220 | $11,000 | Prompt v1, profile/season data, AI provider key, safety rules. | Episode generation, structured output, safety fallback, action options, reset flow, reflection flow, event tracking. | 10 тестовых профилей получают безопасный episode; каждый episode имеет easy/normal/brave actions; reset/reflection не ломают состояние. |
| Sprint 3 | Life Canvas / Avatar causality | Пользователь видит image-first Life Canvas shift и понимает, почему он изменился. | 240 | $12,000 | Image provider, storage, visual style rules, causal explanation copy. | AvatarState model, image generation job, asset storage, pending/failure states, causal explanation, cost logging. | После completed action создается asset или fallback; explanation явно ссылается на action; generation cost логируется. |
| Sprint 4 | Return, memory, paywall | Пользователь получает Tomorrow Hook, возвращается на Day 2, видит memory link и paid value. | 230 | $11,500 | Completed first loop, notification setup, RevenueCat sandbox, paywall copy. | Tomorrow hook, push opt-in, Day 2 memory reference, Memory archive v1, Paywall, RevenueCat webhook, entitlement logic. | Day 2 episode ссылается на Day 1; paywall появляется после value moment; sandbox purchase/restore работают. |
| Sprint 5 | Admin, analytics, QA, soft launch | Команда может управлять prompts/templates, видеть funnel/costs и запустить 30-100 пользователей. | 260 | $13,000 | Core flows ready, event taxonomy, prompt versions, first cohort plan. | Admin prompt/template controls, moderation queue, dashboard, cost dashboard, QA fixes, TestFlight/closed testing build, launch checklist. | Activation, completed loop, avatar causality, D1, paywall and cost events видны; prompt rollback работает; build готов к первой cohort. |

## 3. Budget Summary

| Item | Hours | Cost | Note |
| --- | --- | --- | --- |
| Sprint 1 | 180 | $9,000 | Foundation and onboarding. |
| Sprint 2 | 220 | $11,000 | Episode/action/reset/reflection. |
| Sprint 3 | 240 | $12,000 | Life Canvas and avatar causality. |
| Sprint 4 | 230 | $11,500 | Return, memory, paywall. |
| Sprint 5 | 260 | $13,000 | Admin, analytics, QA, launch. |
| Subtotal | 1130 | $56,500 | Planning estimate. |
| Contingency 20% | 226 | $11,300 | AI/image/payment surprises and QA. |
| Total planning budget | 1356 | $67,800 | Approximate MVP build budget before marketing. |

## 4. Detailed Backlog

| ID | Sprint | Epic | Task | Role | Hours | Cost | Dependencies | Output |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| P0-01 | 1 | App Shell | Create React Native + Expo project structure | Frontend | 14 | $700 | None | Runnable mobile app shell |
| P0-02 | 1 | Backend | Create NestJS backend skeleton and env config | Backend | 16 | $800 | Repo setup | API service with healthcheck |
| P0-03 | 1 | Database | Create Postgres schema v1 | Backend | 22 | $1,100 | Technical Blueprint | Users, profiles, seasons, episodes, actions tables |
| P0-04 | 1 | Auth | Implement auth/session flow | Fullstack | 24 | $1,200 | Backend, app shell | User session in app and backend |
| P0-05 | 1 | Consent | Build consent screen and consent API | Fullstack | 18 | $900 | Privacy copy | Consent version stored |
| P0-06 | 1 | Profile | Build profile form and API | Fullstack | 28 | $1,400 | Consent | Birth/current state saved |
| P0-07 | 1 | Season | Build season templates and start season | Fullstack | 28 | $1,400 | Profile | Active season created |
| P0-08 | 1 | Analytics | Add app_opened/onboarding/profile/season events | Data/Frontend | 18 | $900 | Analytics provider | Early funnel visible |
| P0-09 | 1 | QA | Sprint 1 QA and bugfix buffer | QA/Team | 12 | $600 | Sprint 1 flows | Stable foundation |
| P0-10 | 2 | AI | Create PromptVersion registry | Backend/AI | 18 | $900 | DB schema | Prompt versions saved |
| P0-11 | 2 | Episode | Implement episode generation endpoint | AI/Backend | 36 | $1,800 | OpenAI key, prompt v1 | Structured episode JSON |
| P0-12 | 2 | Safety | Add safety rules and fallback episode template | AI/Product | 24 | $1,200 | Prompt v1 | Unsafe/generic fallback |
| P0-13 | 2 | Episode UI | Build episode screen | Frontend | 28 | $1,400 | Episode API | Episode readable in app |
| P0-14 | 2 | Action | Generate and save easy/normal/brave actions | AI/Backend | 24 | $1,200 | Episode output | Action options |
| P0-15 | 2 | Action UI | Build action selection screen | Frontend | 24 | $1,200 | Action API | Action selected |
| P0-16 | 2 | Reset | Build 30-60 second reset flow | Frontend | 24 | $1,200 | Action selected | Reset complete/skip |
| P0-17 | 2 | Reflection | Build reflection save flow | Fullstack | 24 | $1,200 | Action completion | Emotion/note saved |
| P0-18 | 2 | Analytics | Track episode/action/reset/reflection events | Data/Frontend | 18 | $900 | Event taxonomy | Core loop events |
| P0-19 | 2 | QA | Prompt QA on 10 test profiles | Product/AI | 20 | $1,000 | Episode endpoint | Prompt fixes |
| P0-20 | 3 | Avatar Data | Create AvatarState and Asset models | Backend | 20 | $1,000 | DB schema | Visual state stored |
| P0-21 | 3 | Image Provider | Integrate image provider | AI/Backend | 34 | $1,700 | Provider key | Generated image asset |
| P0-22 | 3 | Storage | Implement private asset storage and thumbnails | Backend | 28 | $1,400 | Storage bucket | Stored image + thumbnail |
| P0-23 | 3 | Avatar Job | Build async generation queue with retry | Backend | 34 | $1,700 | Image provider, storage | Pending/success/failure job states |
| P0-24 | 3 | Avatar UI | Build Life Canvas screen | Frontend | 36 | $1,800 | Avatar API | Image shown with explanation |
| P0-25 | 3 | Causality | Implement causal explanation template | Product/AI | 18 | $900 | Action/reflection data | Changed because copy |
| P0-26 | 3 | Cost Logging | Log provider, latency and estimated cost | Backend/Data | 18 | $900 | Generation APIs | Cost per generation |
| P0-27 | 3 | Analytics | Track avatar_generated and causality check | Data/Frontend | 18 | $900 | Avatar UI | Avatar hypothesis events |
| P0-28 | 3 | QA | Avatar causality QA with 10 examples | Product/Design | 34 | $1,700 | Avatar screen | Visual/copy fixes |
| P0-29 | 4 | Return | Build Tomorrow Hook screen | Frontend | 20 | $1,000 | Avatar screen | Next day hook |
| P0-30 | 4 | Notifications | Implement push opt-in and reminder scheduling | Mobile/Backend | 34 | $1,700 | Push credentials | Reminder opens app |
| P0-31 | 4 | Memory | Generate Day 2 with Day 1 memory | AI/Backend | 30 | $1,500 | Day 1 data | Day 2 continuity |
| P0-32 | 4 | Memory UI | Build Memory archive v1 | Frontend | 30 | $1,500 | Memory API | Season timeline |
| P0-33 | 4 | Paywall | Build paywall after completed loop | Frontend/Product | 26 | $1,300 | Paywall copy | Paywall screen |
| P0-34 | 4 | Billing | Integrate RevenueCat sandbox and webhook | Mobile/Backend | 42 | $2,100 | Store setup | Purchase/restore/entitlements |
| P0-35 | 4 | Analytics | Track paywall, trial, D1 events | Data/Frontend | 18 | $900 | Paywall/notifications | Return and paid funnel |
| P0-36 | 4 | QA | End-to-end Day 1 -> Day 2 QA | QA/Team | 30 | $1,500 | Sprint 4 flows | Stable return loop |
| P0-37 | 5 | Admin | Build prompt/template admin controls | Backend/Internal | 40 | $2,000 | PromptVersion | Publish/rollback prompts |
| P0-38 | 5 | Safety | Build moderation/report queue | Backend/Admin | 34 | $1,700 | Report events | Review unsafe outputs |
| P0-39 | 5 | Dashboard | Build MVP funnel dashboard | Data | 36 | $1,800 | Events | Activation/loop/D1/paywall |
| P0-40 | 5 | Cost Dashboard | Build generation cost dashboard | Data/Backend | 24 | $1,200 | Cost logs | Cost per completed loop |
| P0-41 | 5 | Weekly Recap | Build weekly recap v1 | AI/Frontend | 36 | $1,800 | Memory archive | Day 7 recap |
| P0-42 | 5 | Privacy | Implement export/delete data path | Backend | 24 | $1,200 | Data model | Delete/export tested |
| P0-43 | 5 | Release | Prepare TestFlight/closed testing build | Mobile | 30 | $1,500 | QA pass | Installable build |
| P0-44 | 5 | Launch Ops | Create cohort tracking and interview protocol | Product/Growth | 22 | $1,100 | GTM plan | 30-100 user launch kit |
| P0-45 | 5 | QA | Final QA and bugfix buffer | Team | 38 | $1,900 | All flows | Soft-launch ready MVP |

## 5. Epic Requirements

| Epic | Requirement | Acceptance |
| --- | --- | --- |
| Onboarding | Welcome, consent, profile and season selection must take user to first episode without confusion. | User can complete in under 90 seconds; consent stored; profile saved. |
| Episode | Episode must be personal, safe, structured and linked to season/day/profile. | 10 test users do not call it generic horoscope; unsafe outputs fall back. |
| Action | Every episode must produce easy, normal and brave actions. | User can choose a 2-minute option and complete it today. |
| Reset | Reset is a short bridge before action, not a standalone meditation product. | 30-60 sec timer works; skip does not break flow. |
| Reflection | Reflection must be low friction. | Emotion-only save allowed; note optional. |
| Life Canvas | Avatar/image shift must be causally tied to completed action. | User sees explanation: changed because of action X. |
| Tomorrow Hook | After value moment, user sees why tomorrow matters. | Reminder opt-in and next-day teaser shown. |
| Memory | Day 2 and archive must remember Day 1. | Day 2 episode references previous action/reflection. |
| Paywall | Paywall appears after completed loop, not before first value. | RevenueCat sandbox purchase and restore work. |
| Analytics | Every critical state transition must be measurable. | Activation, completed loop, avatar causality, D1, paywall visible. |
| Admin | Team can update prompts/templates and review safety flags. | Prompt publish/rollback and moderation queue work. |
| Privacy | User can trust data handling. | Consent version, private assets, delete/export path. |

## 6. Dependencies And Critical Path

| Dependency | Blocks | Decision |
| --- | --- | --- |
| Wireframes before Sprint 1 UI | Frontend screens, copy placement, state design. | Need low-fi Figma before serious frontend polish. |
| Privacy copy before profile | Consent screen and birth date trust. | Do not collect birth date without explanation. |
| Prompt v1 before Sprint 2 | Episode/action generation. | PromptVersion must be versioned from day one. |
| Image provider before Sprint 3 | Life Canvas generation. | Choose one provider for MVP; avoid router complexity. |
| Visual style rules before avatar QA | Causality comprehension. | Define 2-3 Life Canvas styles, not unlimited customization. |
| RevenueCat setup before Sprint 4 | Paywall and entitlement. | Store setup can take time; start early. |
| Event taxonomy before launch | Go/no-go decisions. | Analytics is not optional. |
| Admin controls before first cohort >30 users | Prompt fixes and safety operations. | Manual DB edits are acceptable only in tiny internal testing. |

## 7. Definition Of Done

| Layer | Done | Not done if |
| --- | --- | --- |
| Product | A new user can complete Day 1 loop and return to Day 2. | Any part of Episode -> Action -> Reset -> Avatar is mocked without measurement. |
| Design | All MVP screens, loading states and failure states exist in Figma. | Only happy path is designed. |
| Backend | State transitions are persisted and linked. | AI outputs are disconnected blobs. |
| AI | Outputs are structured, safe, versioned and logged. | No prompt version or fallback. |
| Image | Avatar state is causal, private, stored and costed. | Random image without explanation. |
| Billing | Paywall, trial, purchase, restore and entitlement work in sandbox. | Subscription state hardcoded. |
| Analytics | Core funnel and cost dashboard visible. | Team relies on vibes. |
| Admin | Prompt/template rollback and moderation queue work. | Every content fix requires deploy. |
| Launch | 30-100 user cohort can be invited and tracked. | No owner for interviews and cohort notes. |

## 8. Open Questions Before Build

| Question | Default decision | Owner |
| --- | --- | --- |
| React Native or Flutter? | React Native + Expo unless team has stronger Flutter capacity. | Tech lead |
| Which image provider first? | Together/Replicate FLUX; one provider, no router in MVP. | AI/backend |
| Do we require face upload? | No. Symbolic Life Canvas first. | Product/design |
| Which season themes ship first? | Calm, Confidence, Focus, Relationships. | Product |
| What is paid in MVP? | Season continuation, memory, recap, styles; no free video. | Product |
| What is the first launch platform? | iOS-first closed testing if audience and team fit; otherwise Expo both stores later. | Founder/tech |
| Who owns prompt QA? | Product + AI engineer together; not only developer. | Founder |
| What kills the build? | Users cannot explain avatar causality after prototype/interviews. | Founder/product |

## 9. Team Plan

| Role | Allocation | Responsibility |
| --- | --- | --- |
| Product owner / founder | 0.5-1.0 FTE | Scope, user interviews, acceptance, prompt QA, launch decisions. |
| Product designer | 0.5 FTE first 2-3 weeks, then part-time | Wireframes, flow, states, Life Canvas direction, paywall. |
| Mobile engineer | 1.0 FTE | React Native app, UI states, analytics, RevenueCat SDK, push. |
| Backend engineer | 1.0 FTE | API, Postgres, billing webhook, jobs, storage, admin. |
| AI/product engineer | 0.5 FTE | Prompts, generation, safety, image provider, evals. |
| QA/data/product ops | 0.5 FTE | Testing, dashboard, cohort tracking, interview notes. |

## 10. Final PRD Decision

The build should start only after low-fi Figma wireframes exist for the ten critical screens: Welcome, Consent, Profile, Season, Episode, Action, Reset, Reflection, Avatar and Paywall. Once those are in place, Sprint 1 can begin. The MVP budget estimate is roughly $56.5k at a $50/hour planning rate, plus 20% contingency for a total planning envelope around $67.8k before marketing. This can be reduced with founder labor, no-code admin shortcuts and concierge operations, but the scope should not remove analytics, avatar causality, safety or cost logging.

The product is ready to leave research. The next real question is not “is there a market?” The next question is: can a real person complete Day 1 and say, without explanation from us, “my Life Canvas changed because I did the action.”
