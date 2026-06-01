import fs from 'fs';

const OUT = 'reports/aura-prd-sprint-backlog-v1.md';
const HOURLY_RATE = 50;

function mdTable(rows, columns) {
  const header = `| ${columns.map(c => c.label).join(' | ')} |`;
  const sep = `| ${columns.map(() => '---').join(' | ')} |`;
  const body = rows.map(row => `| ${columns.map(c => String(row[c.key] ?? '').replace(/\n/g, '<br>').replace(/\|/g, '/')).join(' | ')} |`);
  return [header, sep, ...body].join('\n');
}

function money(hours) {
  return `$${Math.round(hours * HOURLY_RATE).toLocaleString('en-US')}`;
}

const sprints = [
  {
    sprint: 'Sprint 1',
    theme: 'Foundation: app shell, auth, consent, profile, season start',
    goal: 'Пользователь может открыть приложение, принять consent, заполнить минимальный профиль и выбрать первый сезон.',
    hours: 180,
    dependencies: 'Design wireframes v0, privacy copy, season template list.',
    deliverables: 'React Native app shell, backend skeleton, Postgres schema v1, auth/session, consent, profile, season templates, first analytics events.',
    acceptance: 'Welcome -> Consent -> Profile -> Season Select проходит без ручной помощи; данные сохраняются; события видны в аналитике.'
  },
  {
    sprint: 'Sprint 2',
    theme: 'Episode and action loop',
    goal: 'Пользователь получает первый episode, выбирает action, проходит reset и сохраняет reflection.',
    hours: 220,
    dependencies: 'Prompt v1, profile/season data, AI provider key, safety rules.',
    deliverables: 'Episode generation, structured output, safety fallback, action options, reset flow, reflection flow, event tracking.',
    acceptance: '10 тестовых профилей получают безопасный episode; каждый episode имеет easy/normal/brave actions; reset/reflection не ломают состояние.'
  },
  {
    sprint: 'Sprint 3',
    theme: 'Life Canvas / Avatar causality',
    goal: 'Пользователь видит image-first Life Canvas shift и понимает, почему он изменился.',
    hours: 240,
    dependencies: 'Image provider, storage, visual style rules, causal explanation copy.',
    deliverables: 'AvatarState model, image generation job, asset storage, pending/failure states, causal explanation, cost logging.',
    acceptance: 'После completed action создается asset или fallback; explanation явно ссылается на action; generation cost логируется.'
  },
  {
    sprint: 'Sprint 4',
    theme: 'Return, memory, paywall',
    goal: 'Пользователь получает Tomorrow Hook, возвращается на Day 2, видит memory link и paid value.',
    hours: 230,
    dependencies: 'Completed first loop, notification setup, RevenueCat sandbox, paywall copy.',
    deliverables: 'Tomorrow hook, push opt-in, Day 2 memory reference, Memory archive v1, Paywall, RevenueCat webhook, entitlement logic.',
    acceptance: 'Day 2 episode ссылается на Day 1; paywall появляется после value moment; sandbox purchase/restore работают.'
  },
  {
    sprint: 'Sprint 5',
    theme: 'Admin, analytics, QA, soft launch',
    goal: 'Команда может управлять prompts/templates, видеть funnel/costs и запустить 30-100 пользователей.',
    hours: 260,
    dependencies: 'Core flows ready, event taxonomy, prompt versions, first cohort plan.',
    deliverables: 'Admin prompt/template controls, moderation queue, dashboard, cost dashboard, QA fixes, TestFlight/closed testing build, launch checklist.',
    acceptance: 'Activation, completed loop, avatar causality, D1, paywall and cost events видны; prompt rollback работает; build готов к первой cohort.'
  }
];

const backlog = [
  { id: 'P0-01', sprint: '1', epic: 'App Shell', task: 'Create React Native + Expo project structure', role: 'Frontend', hours: 14, deps: 'None', output: 'Runnable mobile app shell' },
  { id: 'P0-02', sprint: '1', epic: 'Backend', task: 'Create NestJS backend skeleton and env config', role: 'Backend', hours: 16, deps: 'Repo setup', output: 'API service with healthcheck' },
  { id: 'P0-03', sprint: '1', epic: 'Database', task: 'Create Postgres schema v1', role: 'Backend', hours: 22, deps: 'Technical Blueprint', output: 'Users, profiles, seasons, episodes, actions tables' },
  { id: 'P0-04', sprint: '1', epic: 'Auth', task: 'Implement auth/session flow', role: 'Fullstack', hours: 24, deps: 'Backend, app shell', output: 'User session in app and backend' },
  { id: 'P0-05', sprint: '1', epic: 'Consent', task: 'Build consent screen and consent API', role: 'Fullstack', hours: 18, deps: 'Privacy copy', output: 'Consent version stored' },
  { id: 'P0-06', sprint: '1', epic: 'Profile', task: 'Build profile form and API', role: 'Fullstack', hours: 28, deps: 'Consent', output: 'Birth/current state saved' },
  { id: 'P0-07', sprint: '1', epic: 'Season', task: 'Build season templates and start season', role: 'Fullstack', hours: 28, deps: 'Profile', output: 'Active season created' },
  { id: 'P0-08', sprint: '1', epic: 'Analytics', task: 'Add app_opened/onboarding/profile/season events', role: 'Data/Frontend', hours: 18, deps: 'Analytics provider', output: 'Early funnel visible' },
  { id: 'P0-09', sprint: '1', epic: 'QA', task: 'Sprint 1 QA and bugfix buffer', role: 'QA/Team', hours: 12, deps: 'Sprint 1 flows', output: 'Stable foundation' },

  { id: 'P0-10', sprint: '2', epic: 'AI', task: 'Create PromptVersion registry', role: 'Backend/AI', hours: 18, deps: 'DB schema', output: 'Prompt versions saved' },
  { id: 'P0-11', sprint: '2', epic: 'Episode', task: 'Implement episode generation endpoint', role: 'AI/Backend', hours: 36, deps: 'OpenAI key, prompt v1', output: 'Structured episode JSON' },
  { id: 'P0-12', sprint: '2', epic: 'Safety', task: 'Add safety rules and fallback episode template', role: 'AI/Product', hours: 24, deps: 'Prompt v1', output: 'Unsafe/generic fallback' },
  { id: 'P0-13', sprint: '2', epic: 'Episode UI', task: 'Build episode screen', role: 'Frontend', hours: 28, deps: 'Episode API', output: 'Episode readable in app' },
  { id: 'P0-14', sprint: '2', epic: 'Action', task: 'Generate and save easy/normal/brave actions', role: 'AI/Backend', hours: 24, deps: 'Episode output', output: 'Action options' },
  { id: 'P0-15', sprint: '2', epic: 'Action UI', task: 'Build action selection screen', role: 'Frontend', hours: 24, deps: 'Action API', output: 'Action selected' },
  { id: 'P0-16', sprint: '2', epic: 'Reset', task: 'Build 30-60 second reset flow', role: 'Frontend', hours: 24, deps: 'Action selected', output: 'Reset complete/skip' },
  { id: 'P0-17', sprint: '2', epic: 'Reflection', task: 'Build reflection save flow', role: 'Fullstack', hours: 24, deps: 'Action completion', output: 'Emotion/note saved' },
  { id: 'P0-18', sprint: '2', epic: 'Analytics', task: 'Track episode/action/reset/reflection events', role: 'Data/Frontend', hours: 18, deps: 'Event taxonomy', output: 'Core loop events' },
  { id: 'P0-19', sprint: '2', epic: 'QA', task: 'Prompt QA on 10 test profiles', role: 'Product/AI', hours: 20, deps: 'Episode endpoint', output: 'Prompt fixes' },

  { id: 'P0-20', sprint: '3', epic: 'Avatar Data', task: 'Create AvatarState and Asset models', role: 'Backend', hours: 20, deps: 'DB schema', output: 'Visual state stored' },
  { id: 'P0-21', sprint: '3', epic: 'Image Provider', task: 'Integrate image provider', role: 'AI/Backend', hours: 34, deps: 'Provider key', output: 'Generated image asset' },
  { id: 'P0-22', sprint: '3', epic: 'Storage', task: 'Implement private asset storage and thumbnails', role: 'Backend', hours: 28, deps: 'Storage bucket', output: 'Stored image + thumbnail' },
  { id: 'P0-23', sprint: '3', epic: 'Avatar Job', task: 'Build async generation queue with retry', role: 'Backend', hours: 34, deps: 'Image provider, storage', output: 'Pending/success/failure job states' },
  { id: 'P0-24', sprint: '3', epic: 'Avatar UI', task: 'Build Life Canvas screen', role: 'Frontend', hours: 36, deps: 'Avatar API', output: 'Image shown with explanation' },
  { id: 'P0-25', sprint: '3', epic: 'Causality', task: 'Implement causal explanation template', role: 'Product/AI', hours: 18, deps: 'Action/reflection data', output: 'Changed because copy' },
  { id: 'P0-26', sprint: '3', epic: 'Cost Logging', task: 'Log provider, latency and estimated cost', role: 'Backend/Data', hours: 18, deps: 'Generation APIs', output: 'Cost per generation' },
  { id: 'P0-27', sprint: '3', epic: 'Analytics', task: 'Track avatar_generated and causality check', role: 'Data/Frontend', hours: 18, deps: 'Avatar UI', output: 'Avatar hypothesis events' },
  { id: 'P0-28', sprint: '3', epic: 'QA', task: 'Avatar causality QA with 10 examples', role: 'Product/Design', hours: 34, deps: 'Avatar screen', output: 'Visual/copy fixes' },

  { id: 'P0-29', sprint: '4', epic: 'Return', task: 'Build Tomorrow Hook screen', role: 'Frontend', hours: 20, deps: 'Avatar screen', output: 'Next day hook' },
  { id: 'P0-30', sprint: '4', epic: 'Notifications', task: 'Implement push opt-in and reminder scheduling', role: 'Mobile/Backend', hours: 34, deps: 'Push credentials', output: 'Reminder opens app' },
  { id: 'P0-31', sprint: '4', epic: 'Memory', task: 'Generate Day 2 with Day 1 memory', role: 'AI/Backend', hours: 30, deps: 'Day 1 data', output: 'Day 2 continuity' },
  { id: 'P0-32', sprint: '4', epic: 'Memory UI', task: 'Build Memory archive v1', role: 'Frontend', hours: 30, deps: 'Memory API', output: 'Season timeline' },
  { id: 'P0-33', sprint: '4', epic: 'Paywall', task: 'Build paywall after completed loop', role: 'Frontend/Product', hours: 26, deps: 'Paywall copy', output: 'Paywall screen' },
  { id: 'P0-34', sprint: '4', epic: 'Billing', task: 'Integrate RevenueCat sandbox and webhook', role: 'Mobile/Backend', hours: 42, deps: 'Store setup', output: 'Purchase/restore/entitlements' },
  { id: 'P0-35', sprint: '4', epic: 'Analytics', task: 'Track paywall, trial, D1 events', role: 'Data/Frontend', hours: 18, deps: 'Paywall/notifications', output: 'Return and paid funnel' },
  { id: 'P0-36', sprint: '4', epic: 'QA', task: 'End-to-end Day 1 -> Day 2 QA', role: 'QA/Team', hours: 30, deps: 'Sprint 4 flows', output: 'Stable return loop' },

  { id: 'P0-37', sprint: '5', epic: 'Admin', task: 'Build prompt/template admin controls', role: 'Backend/Internal', hours: 40, deps: 'PromptVersion', output: 'Publish/rollback prompts' },
  { id: 'P0-38', sprint: '5', epic: 'Safety', task: 'Build moderation/report queue', role: 'Backend/Admin', hours: 34, deps: 'Report events', output: 'Review unsafe outputs' },
  { id: 'P0-39', sprint: '5', epic: 'Dashboard', task: 'Build MVP funnel dashboard', role: 'Data', hours: 36, deps: 'Events', output: 'Activation/loop/D1/paywall' },
  { id: 'P0-40', sprint: '5', epic: 'Cost Dashboard', task: 'Build generation cost dashboard', role: 'Data/Backend', hours: 24, deps: 'Cost logs', output: 'Cost per completed loop' },
  { id: 'P0-41', sprint: '5', epic: 'Weekly Recap', task: 'Build weekly recap v1', role: 'AI/Frontend', hours: 36, deps: 'Memory archive', output: 'Day 7 recap' },
  { id: 'P0-42', sprint: '5', epic: 'Privacy', task: 'Implement export/delete data path', role: 'Backend', hours: 24, deps: 'Data model', output: 'Delete/export tested' },
  { id: 'P0-43', sprint: '5', epic: 'Release', task: 'Prepare TestFlight/closed testing build', role: 'Mobile', hours: 30, deps: 'QA pass', output: 'Installable build' },
  { id: 'P0-44', sprint: '5', epic: 'Launch Ops', task: 'Create cohort tracking and interview protocol', role: 'Product/Growth', hours: 22, deps: 'GTM plan', output: '30-100 user launch kit' },
  { id: 'P0-45', sprint: '5', epic: 'QA', task: 'Final QA and bugfix buffer', role: 'Team', hours: 38, deps: 'All flows', output: 'Soft-launch ready MVP' }
];

const lines = [];

lines.push('# AURA PRD / Sprint Backlog v1');
lines.push('');
lines.push('Этот документ переводит AURA из research package в план разработки. Он отвечает на вопросы: что строим в MVP, кто что делает, сколько это займет, сколько примерно стоит, какие зависимости есть между задачами и по каким критериям принимать работу.');
lines.push('');
lines.push('Главная продуктовая гипотеза остается прежней: пользователь должен пройти петлю Episode -> Action -> Reset -> Reflection -> Avatar -> Tomorrow Hook и понять, что Life Canvas изменился из-за его действия. Все спринты ниже служат только этой петле. Любая задача, которая не помогает проверить эту петлю, не входит в MVP.');
lines.push('');

lines.push('## 1. Product Requirement Summary');
lines.push('');
lines.push(mdTable([
  { field: 'Product', value: 'AURA mobile MVP: personal 7-day season with daily episode, action, reset, reflection, Life Canvas shift and return hook.' },
  { field: 'Primary user', value: 'Spiritual self-improvers / habit-progress users / avatar-future-self users who already show pull toward self-care and AI personalization.' },
  { field: 'Core loop', value: 'Episode -> Action -> Reset -> Reflection -> Avatar -> Tomorrow Hook.' },
  { field: 'MVP success', value: 'User completes first loop, understands avatar causality, returns on Day 2 and shows paid/trial intent after value.' },
  { field: 'MVP non-goals', value: 'No free daily video, no social network, no marketplace, no coach marketplace, no AR/metaverse, no public UGC.' },
  { field: 'Team assumption', value: '1 frontend/mobile, 1 backend, 0.5 AI/product engineer, 0.5 designer, 0.5 QA/data/product ops.' },
  { field: 'Cost assumption', value: `Blended planning rate: ${money(1)} per hour. This is an estimate for planning, not a vendor quote.` }
], [
  { key: 'field', label: 'Пункт' },
  { key: 'value', label: 'Решение' }
]));
lines.push('');

lines.push('## 2. Sprint Plan');
lines.push('');
lines.push(mdTable(sprints.map(s => ({
  ...s,
  cost: money(s.hours)
})), [
  { key: 'sprint', label: 'Sprint' },
  { key: 'theme', label: 'Theme' },
  { key: 'goal', label: 'Goal' },
  { key: 'hours', label: 'Hours' },
  { key: 'cost', label: 'Cost at $50/h' },
  { key: 'dependencies', label: 'Dependencies' },
  { key: 'deliverables', label: 'Deliverables' },
  { key: 'acceptance', label: 'Acceptance' }
]));
lines.push('');

const totalHours = sprints.reduce((sum, s) => sum + s.hours, 0);
lines.push('## 3. Budget Summary');
lines.push('');
lines.push(mdTable([
  { item: 'Sprint 1', hours: sprints[0].hours, cost: money(sprints[0].hours), note: 'Foundation and onboarding.' },
  { item: 'Sprint 2', hours: sprints[1].hours, cost: money(sprints[1].hours), note: 'Episode/action/reset/reflection.' },
  { item: 'Sprint 3', hours: sprints[2].hours, cost: money(sprints[2].hours), note: 'Life Canvas and avatar causality.' },
  { item: 'Sprint 4', hours: sprints[3].hours, cost: money(sprints[3].hours), note: 'Return, memory, paywall.' },
  { item: 'Sprint 5', hours: sprints[4].hours, cost: money(sprints[4].hours), note: 'Admin, analytics, QA, launch.' },
  { item: 'Subtotal', hours: totalHours, cost: money(totalHours), note: 'Planning estimate.' },
  { item: 'Contingency 20%', hours: Math.round(totalHours * 0.2), cost: money(totalHours * 0.2), note: 'AI/image/payment surprises and QA.' },
  { item: 'Total planning budget', hours: Math.round(totalHours * 1.2), cost: money(totalHours * 1.2), note: 'Approximate MVP build budget before marketing.' }
], [
  { key: 'item', label: 'Item' },
  { key: 'hours', label: 'Hours' },
  { key: 'cost', label: 'Cost' },
  { key: 'note', label: 'Note' }
]));
lines.push('');

lines.push('## 4. Detailed Backlog');
lines.push('');
lines.push(mdTable(backlog.map(item => ({
  ...item,
  cost: money(item.hours)
})), [
  { key: 'id', label: 'ID' },
  { key: 'sprint', label: 'Sprint' },
  { key: 'epic', label: 'Epic' },
  { key: 'task', label: 'Task' },
  { key: 'role', label: 'Role' },
  { key: 'hours', label: 'Hours' },
  { key: 'cost', label: 'Cost' },
  { key: 'deps', label: 'Dependencies' },
  { key: 'output', label: 'Output' }
]));
lines.push('');

lines.push('## 5. Epic Requirements');
lines.push('');
lines.push(mdTable([
  { epic: 'Onboarding', requirement: 'Welcome, consent, profile and season selection must take user to first episode without confusion.', acceptance: 'User can complete in under 90 seconds; consent stored; profile saved.' },
  { epic: 'Episode', requirement: 'Episode must be personal, safe, structured and linked to season/day/profile.', acceptance: '10 test users do not call it generic horoscope; unsafe outputs fall back.' },
  { epic: 'Action', requirement: 'Every episode must produce easy, normal and brave actions.', acceptance: 'User can choose a 2-minute option and complete it today.' },
  { epic: 'Reset', requirement: 'Reset is a short bridge before action, not a standalone meditation product.', acceptance: '30-60 sec timer works; skip does not break flow.' },
  { epic: 'Reflection', requirement: 'Reflection must be low friction.', acceptance: 'Emotion-only save allowed; note optional.' },
  { epic: 'Life Canvas', requirement: 'Avatar/image shift must be causally tied to completed action.', acceptance: 'User sees explanation: changed because of action X.' },
  { epic: 'Tomorrow Hook', requirement: 'After value moment, user sees why tomorrow matters.', acceptance: 'Reminder opt-in and next-day teaser shown.' },
  { epic: 'Memory', requirement: 'Day 2 and archive must remember Day 1.', acceptance: 'Day 2 episode references previous action/reflection.' },
  { epic: 'Paywall', requirement: 'Paywall appears after completed loop, not before first value.', acceptance: 'RevenueCat sandbox purchase and restore work.' },
  { epic: 'Analytics', requirement: 'Every critical state transition must be measurable.', acceptance: 'Activation, completed loop, avatar causality, D1, paywall visible.' },
  { epic: 'Admin', requirement: 'Team can update prompts/templates and review safety flags.', acceptance: 'Prompt publish/rollback and moderation queue work.' },
  { epic: 'Privacy', requirement: 'User can trust data handling.', acceptance: 'Consent version, private assets, delete/export path.' }
], [
  { key: 'epic', label: 'Epic' },
  { key: 'requirement', label: 'Requirement' },
  { key: 'acceptance', label: 'Acceptance' }
]));
lines.push('');

lines.push('## 6. Dependencies And Critical Path');
lines.push('');
lines.push(mdTable([
  { dependency: 'Wireframes before Sprint 1 UI', blocks: 'Frontend screens, copy placement, state design.', decision: 'Need low-fi Figma before serious frontend polish.' },
  { dependency: 'Privacy copy before profile', blocks: 'Consent screen and birth date trust.', decision: 'Do not collect birth date without explanation.' },
  { dependency: 'Prompt v1 before Sprint 2', blocks: 'Episode/action generation.', decision: 'PromptVersion must be versioned from day one.' },
  { dependency: 'Image provider before Sprint 3', blocks: 'Life Canvas generation.', decision: 'Choose one provider for MVP; avoid router complexity.' },
  { dependency: 'Visual style rules before avatar QA', blocks: 'Causality comprehension.', decision: 'Define 2-3 Life Canvas styles, not unlimited customization.' },
  { dependency: 'RevenueCat setup before Sprint 4', blocks: 'Paywall and entitlement.', decision: 'Store setup can take time; start early.' },
  { dependency: 'Event taxonomy before launch', blocks: 'Go/no-go decisions.', decision: 'Analytics is not optional.' },
  { dependency: 'Admin controls before first cohort >30 users', blocks: 'Prompt fixes and safety operations.', decision: 'Manual DB edits are acceptable only in tiny internal testing.' }
], [
  { key: 'dependency', label: 'Dependency' },
  { key: 'blocks', label: 'Blocks' },
  { key: 'decision', label: 'Decision' }
]));
lines.push('');

lines.push('## 7. Definition Of Done');
lines.push('');
lines.push(mdTable([
  { layer: 'Product', done: 'A new user can complete Day 1 loop and return to Day 2.', fail: 'Any part of Episode -> Action -> Reset -> Avatar is mocked without measurement.' },
  { layer: 'Design', done: 'All MVP screens, loading states and failure states exist in Figma.', fail: 'Only happy path is designed.' },
  { layer: 'Backend', done: 'State transitions are persisted and linked.', fail: 'AI outputs are disconnected blobs.' },
  { layer: 'AI', done: 'Outputs are structured, safe, versioned and logged.', fail: 'No prompt version or fallback.' },
  { layer: 'Image', done: 'Avatar state is causal, private, stored and costed.', fail: 'Random image without explanation.' },
  { layer: 'Billing', done: 'Paywall, trial, purchase, restore and entitlement work in sandbox.', fail: 'Subscription state hardcoded.' },
  { layer: 'Analytics', done: 'Core funnel and cost dashboard visible.', fail: 'Team relies on vibes.' },
  { layer: 'Admin', done: 'Prompt/template rollback and moderation queue work.', fail: 'Every content fix requires deploy.' },
  { layer: 'Launch', done: '30-100 user cohort can be invited and tracked.', fail: 'No owner for interviews and cohort notes.' }
], [
  { key: 'layer', label: 'Layer' },
  { key: 'done', label: 'Done' },
  { key: 'fail', label: 'Not done if' }
]));
lines.push('');

lines.push('## 8. Open Questions Before Build');
lines.push('');
lines.push(mdTable([
  { question: 'React Native or Flutter?', default: 'React Native + Expo unless team has stronger Flutter capacity.', owner: 'Tech lead' },
  { question: 'Which image provider first?', default: 'Together/Replicate FLUX; one provider, no router in MVP.', owner: 'AI/backend' },
  { question: 'Do we require face upload?', default: 'No. Symbolic Life Canvas first.', owner: 'Product/design' },
  { question: 'Which season themes ship first?', default: 'Calm, Confidence, Focus, Relationships.', owner: 'Product' },
  { question: 'What is paid in MVP?', default: 'Season continuation, memory, recap, styles; no free video.', owner: 'Product' },
  { question: 'What is the first launch platform?', default: 'iOS-first closed testing if audience and team fit; otherwise Expo both stores later.', owner: 'Founder/tech' },
  { question: 'Who owns prompt QA?', default: 'Product + AI engineer together; not only developer.', owner: 'Founder' },
  { question: 'What kills the build?', default: 'Users cannot explain avatar causality after prototype/interviews.', owner: 'Founder/product' }
], [
  { key: 'question', label: 'Question' },
  { key: 'default', label: 'Default decision' },
  { key: 'owner', label: 'Owner' }
]));
lines.push('');

lines.push('## 9. Team Plan');
lines.push('');
lines.push(mdTable([
  { role: 'Product owner / founder', allocation: '0.5-1.0 FTE', responsibility: 'Scope, user interviews, acceptance, prompt QA, launch decisions.' },
  { role: 'Product designer', allocation: '0.5 FTE first 2-3 weeks, then part-time', responsibility: 'Wireframes, flow, states, Life Canvas direction, paywall.' },
  { role: 'Mobile engineer', allocation: '1.0 FTE', responsibility: 'React Native app, UI states, analytics, RevenueCat SDK, push.' },
  { role: 'Backend engineer', allocation: '1.0 FTE', responsibility: 'API, Postgres, billing webhook, jobs, storage, admin.' },
  { role: 'AI/product engineer', allocation: '0.5 FTE', responsibility: 'Prompts, generation, safety, image provider, evals.' },
  { role: 'QA/data/product ops', allocation: '0.5 FTE', responsibility: 'Testing, dashboard, cohort tracking, interview notes.' }
], [
  { key: 'role', label: 'Role' },
  { key: 'allocation', label: 'Allocation' },
  { key: 'responsibility', label: 'Responsibility' }
]));
lines.push('');

lines.push('## 10. Final PRD Decision');
lines.push('');
lines.push('The build should start only after low-fi Figma wireframes exist for the ten critical screens: Welcome, Consent, Profile, Season, Episode, Action, Reset, Reflection, Avatar and Paywall. Once those are in place, Sprint 1 can begin. The MVP budget estimate is roughly $56.5k at a $50/hour planning rate, plus 20% contingency for a total planning envelope around $67.8k before marketing. This can be reduced with founder labor, no-code admin shortcuts and concierge operations, but the scope should not remove analytics, avatar causality, safety or cost logging.');
lines.push('');
lines.push('The product is ready to leave research. The next real question is not “is there a market?” The next question is: can a real person complete Day 1 and say, without explanation from us, “my Life Canvas changed because I did the action.”');

fs.mkdirSync('reports', { recursive: true });
fs.writeFileSync(OUT, `${lines.join('\n').trimEnd()}\n`);
console.log(`aura_prd_sprint_backlog=${OUT}`);
