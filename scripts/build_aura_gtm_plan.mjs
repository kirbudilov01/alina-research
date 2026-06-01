import fs from 'fs';

const OUT = 'reports/aura-gtm-plan-v1.md';

function mdTable(rows, columns) {
  const header = `| ${columns.map(c => c.label).join(' | ')} |`;
  const sep = `| ${columns.map(() => '---').join(' | ')} |`;
  const body = rows.map(row => `| ${columns.map(c => String(row[c.key] ?? '').replace(/\n/g, '<br>').replace(/\|/g, '/')).join(' | ')} |`);
  return [header, sep, ...body].join('\n');
}

const lines = [];

lines.push('# AURA GTM Plan v1');
lines.push('');
lines.push('Этот документ отвечает не на вопрос “есть ли рынок”, а на вопрос “как получить первых пользователей и доказать, что петля Episode -> Action -> Reset -> Avatar -> Return Tomorrow работает в реальности”. GTM для AURA на первом этапе должен быть не про масштабный media buying, а про быстрые циклы: оффер, прототип, интервью, ручная активация, первые оплаты, повторяемый контент.');
lines.push('');
lines.push('Главная позиция: AURA нельзя запускать как абстрактное wellbeing-приложение. Первичный оффер должен продавать новую категорию: личный сериал изменений, где каждый день дает эпизод, действие и видимый след в Life Canvas.');
lines.push('');

lines.push('## 1. GTM Decision Summary');
lines.push('');
lines.push(mdTable([
  { field: 'Главный риск', value: 'Не рынок, а прохождение пользовательской петли и понимание avatar causality.' },
  { field: 'Первый канал', value: 'Founder-led concierge: личные контакты, warm аудитория, маленькие сообщества, интервью.' },
  { field: 'Первый публичный канал', value: 'TikTok/Reels/Shorts с контентом “сериал о себе”, “future self”, “маленькое действие меняет образ”.' },
  { field: 'Первый оффер', value: 'Пройди 7-дневный личный сезон и увидь, как меняется твой Life Canvas после действий.' },
  { field: 'Первый paid test', value: 'После completed loop: $7.99-9.99/mo или annual anchor; цель не revenue, а willingness to pay signal.' },
  { field: 'Запрет', value: 'Не покупать масштабный трафик до доказательства activation, D1 return и avatar causality.' }
], [
  { key: 'field', label: 'Пункт' },
  { key: 'value', label: 'Решение' }
]));
lines.push('');

lines.push('## 2. Positioning');
lines.push('');
lines.push(mdTable([
  { option: 'AI horoscope', verdict: 'Не выбирать', reason: 'Слишком узко, много скепсиса, сложно защищать качество.' },
  { option: 'Avatar app', verdict: 'Не выбирать как главный угол', reason: 'Становится image generator; теряется действие и retention.' },
  { option: 'Habit tracker', verdict: 'Не выбирать как главный угол', reason: 'Слишком функционально; AURA должна быть эмоциональнее.' },
  { option: 'Mindfulness app', verdict: 'Соседняя категория', reason: 'Помогает объяснить reset/ritual, но не объясняет Life Canvas.' },
  { option: 'Personal life series', verdict: 'Выбрать', reason: 'Соединяет episode, action, memory и avatar в одну категорию.' },
  { option: 'Future self ritual', verdict: 'Использовать в креативах', reason: 'Сильный hook для TikTok/Reels, но требует аккуратного тона без токсичной “лучшей версии”.' }
], [
  { key: 'option', label: 'Позиционирование' },
  { key: 'verdict', label: 'Вердикт' },
  { key: 'reason', label: 'Почему' }
]));
lines.push('');

lines.push('## 3. Audience Segments');
lines.push('');
lines.push(mdTable([
  { segment: 'Spiritual self-improvers', pain: 'Хочется личного смысла и ощущения направления.', hook: 'Твой день как эпизод, основанный на твоем контексте.', channel: 'TikTok, Instagram, astrology/self-care communities.', test: 'Понимают ли они Life Canvas как развитие, а не гадание.' },
  { segment: 'Habit/progress users', pain: 'Трекеры сухие, мотивация быстро падает.', hook: 'Маленькое действие меняет визуальную историю.', channel: 'Productivity creators, Reddit, habit communities.', test: 'Достаточно ли сильна эмоциональная награда.' },
  { segment: 'Reset users', pain: 'Нужен быстрый способ выйти из тревоги и начать маленький шаг.', hook: '60 секунд reset перед действием дня.', channel: 'Mindfulness/Reels/Shorts, anxiety/self-care content.', test: 'Не воспринимается ли как еще одна meditation app.' },
  { segment: 'Avatar/future-self users', pain: 'Хочется увидеть альтернативную/будущую версию себя.', hook: 'Не просто avatar, а образ, который меняется после твоих действий.', channel: 'AI art, avatar, future-self TikTok.', test: 'Понимают ли связь с действием.' },
  { segment: 'Journaling users', pain: 'Дневник помогает, но сложно возвращаться каждый день.', hook: 'Одна строка reflection превращается в weekly recap.', channel: 'Journaling creators, Pinterest, Instagram.', test: 'Достаточно ли low-friction reflection.' }
], [
  { key: 'segment', label: 'Сегмент' },
  { key: 'pain', label: 'Боль' },
  { key: 'hook', label: 'Оффер' },
  { key: 'channel', label: 'Канал' },
  { key: 'test', label: 'Что проверить' }
]));
lines.push('');

lines.push('## 4. First 100 Users');
lines.push('');
lines.push('Первые 100 пользователей не нужно получать рекламой. Их нужно получить руками, чтобы слышать формулировки, видеть непонимание, смотреть на прохождение loop и быстро менять продукт. Это не масштабирование, а доказательство.');
lines.push('');
lines.push(mdTable([
  { step: '1', action: 'Собрать список 150 теплых кандидатов', details: 'Друзья, знакомые, подписчики, клиенты Алины, self-care/astrology/habit аудитория.', metric: '150 контактов, 60 ответов, 30 интервью.' },
  { step: '2', action: 'Отправить личное приглашение', details: 'Не “скачай приложение”, а “помоги проверить 7-дневный личный сезон”.', metric: 'Reply rate 30%+.' },
  { step: '3', action: 'Провести 20 интервью до прототипа', details: 'Проверить язык боли, отношение к avatar/future-self, платность, privacy.', metric: '10+ людей с сильным pull.' },
  { step: '4', action: 'Дать clickable prototype', details: 'Пусть проходят Day 1: episode, action, reset, avatar shift.', metric: '70% понимают причинность.' },
  { step: '5', action: 'Concierge Day 1-7', details: 'Даже если генерация частично ручная, довести 30 пользователей через неделю.', metric: 'D1 return, D7 completion, qualitative notes.' },
  { step: '6', action: 'Показать paywall/waitlist', details: 'Не обязательно списывать деньги у всех; важно измерить trial intent и готовность платить.', metric: '5-10% paid/trial intent among completed-loop users.' },
  { step: '7', action: 'Собрать 30 testimonials/objections', details: 'Фразы пользователей станут будущим positioning и ads copy.', metric: 'Top 20 phrases, top 20 objections.' }
], [
  { key: 'step', label: 'Шаг' },
  { key: 'action', label: 'Действие' },
  { key: 'details', label: 'Детали' },
  { key: 'metric', label: 'Метрика' }
]));
lines.push('');

lines.push('## 5. First 1000 Users');
lines.push('');
lines.push('Первые 1000 пользователей нужны уже не только для интервью, а для первых когорт. Здесь можно включать публичный контент, micro-influencers, waitlist, referral и маленький paid boost, но только если продукт уже показывает completed loop и D1 return.');
lines.push('');
lines.push(mdTable([
  { channel: 'TikTok/Reels/Shorts', role: 'Главный discovery канал', tactic: '3-5 роликов в день 30 дней: hooks, before/after Life Canvas, future self, 7-day season.', target: '300-500 signups.' },
  { channel: 'Warm creators', role: 'Доверие', tactic: '10 micro creators в astrology/self-care/journaling/habit niches; не реклама, а прохождение сезона.', target: '100-300 users.' },
  { channel: 'Reddit/communities', role: 'Качественные early adopters', tactic: 'Не спамить; постить build-in-public, просить feedback на prototype.', target: '50-150 users.' },
  { channel: 'Pinterest', role: 'Evergreen visual demand', tactic: 'Future self boards, Life Canvas examples, 7-day reset pins.', target: '50-150 waitlist.' },
  { channel: 'Referral', role: 'Проверка shareability', tactic: 'Share card after avatar shift: “мой эпизод дня / мой Life Canvas changed because…”.', target: 'K-factor signal, not scale.' },
  { channel: 'Landing page', role: 'Conversion test', tactic: '3 positioning variants: Life Series, Future Self, Daily Reset.', target: 'Visitor-to-waitlist 8-15%.' },
  { channel: 'Small paid test', role: 'CAC sanity only', tactic: '$300-1000 test after organic signal; do not optimize before retention.', target: 'CAC benchmark, creative CTR.' }
], [
  { key: 'channel', label: 'Канал' },
  { key: 'role', label: 'Роль' },
  { key: 'tactic', label: 'Тактика' },
  { key: 'target', label: 'Цель' }
]));
lines.push('');

lines.push('## 6. Content Pillars');
lines.push('');
lines.push(mdTable([
  { pillar: 'Сериал о себе', examples: '“Что если твой день был бы серией?”, “Day 1 of becoming visible to yourself”.', purpose: 'Объяснить новую категорию.' },
  { pillar: 'Future self without cringe', examples: '“Не лучшая версия, а следующая честная версия”, “маленький шаг, который меняет образ”.', purpose: 'Снять токсичность self-improvement.' },
  { pillar: 'Avatar causality', examples: '“Я сделал X, поэтому мой canvas изменился так”, “AI image, но не random”.', purpose: 'Доказать отличие от avatar generator.' },
  { pillar: 'Reset before action', examples: '“60 секунд перед сложным шагом”, “микро-ритуал вместо мотивации”.', purpose: 'Привести mindfulness аудиторию.' },
  { pillar: '7-day season', examples: '“7 дней уверенности”, “7 дней спокойствия”, “первый сезон про границы”.', purpose: 'Удержание и paid continuation.' },
  { pillar: 'Build in public', examples: '“Мы проверяем, понимают ли люди такую петлю”, “покажи, где экран слабый”.', purpose: 'Получить ранних пользователей и доверие.' },
  { pillar: 'Objection handling', examples: '“Это не гороскоп”, “это не терапия”, “почему дата рождения не равно судьба”.', purpose: 'Снять барьеры privacy/skepticism.' }
], [
  { key: 'pillar', label: 'Контент-пиллар' },
  { key: 'examples', label: 'Примеры hooks' },
  { key: 'purpose', label: 'Зачем' }
]));
lines.push('');

lines.push('## 7. Channel Playbooks');
lines.push('');
lines.push(mdTable([
  { channel: 'TikTok', audience: 'Discovery and emotional hooks.', cadence: '3-5 videos/day for 30 days.', formats: 'POV, before/after canvas, founder test, user journey mock, “day as episode”.', avoid: 'Do not explain the whole app in one video.' },
  { channel: 'Instagram Reels', audience: 'Self-care, visual, creator-led trust.', cadence: '1-3 reels/day + stories.', formats: 'Life Canvas visuals, season cards, reset rituals, creator walkthrough.', avoid: 'Do not make it look like generic wellness quotes.' },
  { channel: 'YouTube Shorts', audience: 'Search/discovery for future self and AI tools.', cadence: '1-2/day.', formats: 'Short demos, “I turned my day into an episode”, app build updates.', avoid: 'Do not rely on long onboarding explanation.' },
  { channel: 'Pinterest', audience: 'Evergreen visual intent.', cadence: '10-20 pins/week.', formats: 'Future self boards, 7-day reset templates, visual season cards.', avoid: 'Do not send directly to app without landing context.' },
  { channel: 'Reddit', audience: 'Critical feedback and niche communities.', cadence: '2-4 thoughtful posts/week.', formats: 'Build in public, ask for critique, prototype feedback.', avoid: 'No spam, no fake testimonials.' },
  { channel: 'Micro creators', audience: 'Trust transfer.', cadence: '10-30 outreach/week.', formats: 'Creator experiences 7-day season and records honest reaction.', avoid: 'Do not script fake spiritual certainty.' },
  { channel: 'Referral', audience: 'Users after avatar shift.', cadence: 'Triggered after completed loop.', formats: 'Share card with “changed because I did X”.', avoid: 'Do not push referral before value moment.' },
  { channel: 'Email/waitlist', audience: 'People not ready to install.', cadence: '2-3 emails/week during launch.', formats: 'Prototype updates, season invite, first user stories.', avoid: 'No generic newsletter.' }
], [
  { key: 'channel', label: 'Channel' },
  { key: 'audience', label: 'Role' },
  { key: 'cadence', label: 'Cadence' },
  { key: 'formats', label: 'Formats' },
  { key: 'avoid', label: 'Avoid' }
]));
lines.push('');

lines.push('## 8. 30-Day Launch Plan');
lines.push('');
lines.push(mdTable([
  { week: 'Week 1', focus: 'Prototype + interviews', actions: 'Figma Day 1, 20 interviews, 150-person warm list, landing waitlist.', metrics: '20 interviews, 100 waitlist target, top objections.' },
  { week: 'Week 2', focus: 'Concierge season', actions: '30 users through Day 1-2 manually/semi-manually, daily notes, avatar causality test.', metrics: 'Activation, completed loop, D1 return.' },
  { week: 'Week 3', focus: 'Public content test', actions: '50-100 short videos, 3 landing variants, 5 micro creators, share cards.', metrics: 'CTR, waitlist CVR, creator response, share intent.' },
  { week: 'Week 4', focus: 'Paid willingness and cohort readout', actions: 'Paywall test, annual/monthly anchor, 7-day recap interviews, MVP go/no-go.', metrics: 'Trial intent, D7 completion, top paid reasons, kill reasons.' }
], [
  { key: 'week', label: 'Неделя' },
  { key: 'focus', label: 'Фокус' },
  { key: 'actions', label: 'Действия' },
  { key: 'metrics', label: 'Метрики' }
]));
lines.push('');

lines.push('## 9. 30-Day Content Calendar');
lines.push('');
lines.push(mdTable([
  { day: '1', theme: 'Category', content: 'Что если твой день был бы серией?', cta: 'Join waitlist.' },
  { day: '2', theme: 'Problem', content: 'Почему habit trackers не дают ощущения истории.', cta: 'Comment “season”.' },
  { day: '3', theme: 'Avatar', content: 'AI image vs Life Canvas: в чем разница.', cta: 'Vote on visual style.' },
  { day: '4', theme: 'Reset', content: '60 секунд перед маленьким действием.', cta: 'Try the reset.' },
  { day: '5', theme: 'Prototype', content: 'Day 1 screen walkthrough.', cta: 'Apply for first cohort.' },
  { day: '6', theme: 'Future self', content: 'Не лучшая версия, а следующая честная версия.', cta: 'Pick your season.' },
  { day: '7', theme: 'Recap', content: 'Как выглядит первая неделя.', cta: 'Join 7-day test.' },
  { day: '8', theme: 'Objection', content: 'Это не гороскоп и не терапия.', cta: 'Ask a hard question.' },
  { day: '9', theme: 'User language', content: 'Фразы из первых интервью.', cta: 'Do you relate?' },
  { day: '10', theme: 'Action', content: '3 уровня действия: 2 минуты, 10 минут, brave step.', cta: 'Choose one.' },
  { day: '11', theme: 'Causality', content: 'Я сделал X, поэтому canvas изменился Y.', cta: 'Want yours?' },
  { day: '12', theme: 'Privacy', content: 'Зачем дата рождения и что мы с ней не делаем.', cta: 'Trust check.' },
  { day: '13', theme: 'Founder-led', content: 'Что мы поняли после 10 интервью.', cta: 'Become tester.' },
  { day: '14', theme: 'Season', content: '7 дней уверенности: пример season arc.', cta: 'Vote next season.' },
  { day: '15', theme: 'Comparison', content: 'Calm vs Finch vs AURA in one sentence.', cta: 'Which one are you?' },
  { day: '16', theme: 'Prototype', content: 'Paywall after value: честный paid test.', cta: 'Would you pay?' },
  { day: '17', theme: 'Community ask', content: 'Разнесите наш first screen.', cta: 'Comment critique.' },
  { day: '18', theme: 'Avatar styles', content: '3 Life Canvas visual directions.', cta: 'Pick A/B/C.' },
  { day: '19', theme: 'D1 return', content: 'Что должно случиться завтра, чтобы ты вернулся?', cta: 'Answer in comments.' },
  { day: '20', theme: 'User story', content: 'Один человек прошел Day 1: что сработало/нет.', cta: 'Join next batch.' },
  { day: '21', theme: 'Recap', content: 'Weekly recap mock: почему память важна.', cta: 'Save this.' },
  { day: '22', theme: 'Paid value', content: 'За что тут вообще платить?', cta: 'Rank paid features.' },
  { day: '23', theme: 'Build in public', content: 'Наш главный риск теперь не рынок.', cta: 'Follow build.' },
  { day: '24', theme: 'Interview clip', content: 'Что люди не понимают в avatar shift.', cta: 'Help us fix.' },
  { day: '25', theme: 'Landing A/B', content: 'Life Series vs Future Self vs Daily Reset.', cta: 'Choose headline.' },
  { day: '26', theme: 'Soft launch', content: 'Открываем 30 мест на 7-дневный тест.', cta: 'Apply.' },
  { day: '27', theme: 'Objection', content: 'Почему мы не делаем social network в MVP.', cta: 'Agree/disagree.' },
  { day: '28', theme: 'Metrics', content: 'Какие метрики решат судьбу продукта.', cta: 'Follow results.' },
  { day: '29', theme: 'Creator', content: 'Micro creator goes through Day 1.', cta: 'Try cohort.' },
  { day: '30', theme: 'Readout', content: 'Что показали первые 30 дней.', cta: 'Join next 100.' }
], [
  { key: 'day', label: 'Day' },
  { key: 'theme', label: 'Theme' },
  { key: 'content', label: 'Content' },
  { key: 'cta', label: 'CTA' }
]));
lines.push('');

lines.push('## 10. Experiment Backlog');
lines.push('');
lines.push(mdTable([
  { experiment: 'Positioning A/B/C', hypothesis: 'Life Series beats AI horoscope and Avatar app.', setup: '3 landing pages / 3 TikTok hooks.', success: 'Life Series gives best qualitative comprehension and waitlist CVR.' },
  { experiment: 'Avatar causality copy', hypothesis: 'Explanation next to image improves understanding.', setup: 'Image only vs image + “changed because…”', success: '+25% correct causality explanation.' },
  { experiment: 'Paywall placement', hypothesis: 'After first completed loop beats before Day 2.', setup: 'Completed loop vs Day 2 teaser paywall.', success: 'Higher trial intent with no D1 damage.' },
  { experiment: 'Season theme', hypothesis: 'Calm/Confidence/Relationships outperform Money/Creativity early.', setup: 'Season select analytics.', success: 'Top 2 themes get 60%+ selection.' },
  { experiment: 'Share card', hypothesis: 'Avatar shift is shareable if framed as personal progress.', setup: 'Share card after avatar screen.', success: '5%+ users click share in prototype cohort.' },
  { experiment: 'Concierge vs automated', hypothesis: 'Manual quality beats cheap automation for first cohort.', setup: 'Manual prompt review for 30 users.', success: 'Higher relevance; learn prompt rules.' },
  { experiment: 'Annual anchor', hypothesis: 'Annual plan increases perceived seriousness, even if monthly chosen.', setup: '$7.99/mo vs $39.99/year anchor.', success: 'More positive paid intent.' }
], [
  { key: 'experiment', label: 'Эксперимент' },
  { key: 'hypothesis', label: 'Гипотеза' },
  { key: 'setup', label: 'Как проверить' },
  { key: 'success', label: 'Успех' }
]));
lines.push('');

lines.push('## 11. Creator Outreach');
lines.push('');
lines.push(mdTable([
  { type: 'Astrology/self-care creator', pitch: 'Мы тестируем не гороскоп, а 7-дневный личный сезон с действием и визуальным следом.', ask: 'Пройти Day 1 и дать честную реакцию.', offer: 'Early access, co-creation, affiliate later.' },
  { type: 'Journaling creator', pitch: 'AURA превращает одну строку reflection в историю недели.', ask: 'Сравнить с обычным journaling.', offer: 'Exclusive first cohort.' },
  { type: 'AI/avatar creator', pitch: 'Это avatar, который меняется из-за действия, а не random image.', ask: 'Оценить visual mechanic.', offer: 'Behind-the-scenes AI workflow.' },
  { type: 'Mindfulness creator', pitch: 'Reset здесь не отдельная медитация, а мост перед маленьким действием.', ask: 'Проверить 60-sec reset.', offer: 'Co-designed reset pack later.' },
  { type: 'Productivity creator', pitch: 'Habit tracker with emotional visual feedback.', ask: 'Проверить action completion.', offer: 'Case study for audience.' }
], [
  { key: 'type', label: 'Creator type' },
  { key: 'pitch', label: 'Pitch' },
  { key: 'ask', label: 'Ask' },
  { key: 'offer', label: 'Offer' }
]));
lines.push('');

lines.push('## 12. Landing Page Variants');
lines.push('');
lines.push(mdTable([
  { variant: 'Life Series', headline: 'AURA - сериал о твоей жизни, который начинается сегодня.', bullets: 'Эпизод дня / маленькое действие / Life Canvas меняется после шага.', success: 'Best comprehension of new category.' },
  { variant: 'Future Self', headline: 'Увидь следующую версию себя через 7 дней маленьких действий.', bullets: 'Future-self image / daily reset / weekly recap.', success: 'Best emotional pull and shares.' },
  { variant: 'Daily Reset', headline: 'Каждый день: один инсайт, один reset, один маленький шаг.', bullets: 'Less mystical / more practical / lower skepticism.', success: 'Best conversion among mindfulness/habit users.' },
  { variant: 'Avatar Causality', headline: 'Avatar, который меняется не случайно, а из-за твоих действий.', bullets: 'AI visual / action proof / personal memory.', success: 'Best avatar-user conversion.' }
], [
  { key: 'variant', label: 'Variant' },
  { key: 'headline', label: 'Headline' },
  { key: 'bullets', label: 'Bullets' },
  { key: 'success', label: 'Success signal' }
]));
lines.push('');

lines.push('## 13. Messaging Matrix');
lines.push('');
lines.push(mdTable([
  { audience: 'Spiritual', headline: 'Твой день как личный эпизод', proof: 'Дата рождения + текущий запрос + маленькое действие.', cta: 'Пройти первый сезон.' },
  { audience: 'Habit', headline: 'Не просто трекер, а видимый след действия', proof: 'Action меняет Life Canvas.', cta: 'Сделать первый шаг.' },
  { audience: 'Mindfulness', headline: '60 секунд reset перед важным шагом', proof: 'Reset связан с episode/action.', cta: 'Попробовать reset дня.' },
  { audience: 'Avatar', headline: 'Avatar, который меняется из-за твоих действий', proof: 'Не random AI image, а причинная история.', cta: 'Увидеть первый shift.' },
  { audience: 'Journaling', headline: 'Одна строка в день превращается в историю недели', proof: 'Reflection -> weekly recap -> memory.', cta: 'Начать 7 дней.' }
], [
  { key: 'audience', label: 'Аудитория' },
  { key: 'headline', label: 'Headline' },
  { key: 'proof', label: 'Proof' },
  { key: 'cta', label: 'CTA' }
]));
lines.push('');

lines.push('## 14. Metrics');
lines.push('');
lines.push(mdTable([
  { stage: 'Awareness', metric: 'Hook hold / 3-sec view / profile click', threshold: 'Сравнивать hooks, не принимать стратегических решений по одному ролику.' },
  { stage: 'Interest', metric: 'Landing conversion to waitlist', threshold: '8-15% early target for warm/organic.' },
  { stage: 'Activation', metric: 'Prototype start -> episode generated/read', threshold: '45%+.' },
  { stage: 'Core loop', metric: 'Episode -> action -> reset/reflection -> avatar', threshold: '25-35%+ completed first loop.' },
  { stage: 'Comprehension', metric: 'Avatar causality understood', threshold: '70%+.' },
  { stage: 'Retention', metric: 'D1 return', threshold: '20-30%+ early cohort.' },
  { stage: 'Season', metric: 'D7 completion', threshold: '10-15%+ early target.' },
  { stage: 'Monetization', metric: 'Trial/paid intent after value', threshold: '5-10%+ among completed-loop users.' },
  { stage: 'Referral', metric: 'Share click / invite sent', threshold: 'Signal only; not expected to scale immediately.' }
], [
  { key: 'stage', label: 'Этап' },
  { key: 'metric', label: 'Метрика' },
  { key: 'threshold', label: 'Порог' }
]));
lines.push('');

lines.push('## 15. Interview Script For GTM');
lines.push('');
lines.push(mdTable([
  { block: 'Current behavior', questions: 'Что вы делаете, когда хотите понять себя или собрать фокус? Какие приложения/практики уже используете?', signal: 'Existing behavior, not abstract interest.' },
  { block: 'Pain', questions: 'Что не хватает в этих решениях? Когда вы бросали похожий продукт?', signal: 'Churn reasons and white space.' },
  { block: 'Language', questions: 'Какими словами вы бы описали эту потребность подруге/другу?', signal: 'Organic copy for ads.' },
  { block: 'Prototype reaction', questions: 'Что вы думаете, увидев Welcome? Что ожидаете дальше?', signal: 'Positioning clarity.' },
  { block: 'Avatar causality', questions: 'Почему изменилась картинка? Что должно измениться завтра?', signal: 'Core concept comprehension.' },
  { block: 'Paid value', questions: 'За что здесь можно платить? Что точно не стоит денег?', signal: 'Monetization hooks.' },
  { block: 'Sharing', questions: 'Кому бы вы это отправили? Что бы написали?', signal: 'Referral language.' },
  { block: 'Commitment', questions: 'Готовы пройти 7 дней? Когда начнем?', signal: 'Real intent, not politeness.' }
], [
  { key: 'block', label: 'Block' },
  { key: 'questions', label: 'Questions' },
  { key: 'signal', label: 'Signal' }
]));
lines.push('');

lines.push('## 16. Budget For First 30 Days');
lines.push('');
lines.push(mdTable([
  { item: 'Prototype/design', low: '$0 internal', normal: '$500-1500', note: 'Clickable Figma, not full UI kit.' },
  { item: 'Content production', low: '$0 founder-led', normal: '$300-1000', note: 'CapCut/templates/basic assets.' },
  { item: 'Micro creators', low: '$0 barter', normal: '$500-2000', note: 'Small creators, honest reactions.' },
  { item: 'Landing/waitlist', low: '$0-50', normal: '$50-200', note: 'Framer/Webflow/Tally/Typeform.' },
  { item: 'Paid boost', low: '$0', normal: '$300-1000', note: 'Only after organic hooks show signal.' },
  { item: 'Concierge operations', low: 'Founder time', normal: '$0-500', note: 'Manual prompt QA and user calls.' },
  { item: 'Total', low: '$0-350', normal: '$1,650-6,200', note: 'Enough for learning; not enough for scale.' }
], [
  { key: 'item', label: 'Item' },
  { key: 'low', label: 'Lean' },
  { key: 'normal', label: 'Normal' },
  { key: 'note', label: 'Note' }
]));
lines.push('');

lines.push('## 17. Hook Bank');
lines.push('');
lines.push(mdTable([
  { n: '1', hook: 'Что если твой день был бы не списком задач, а серией?', angle: 'Category' },
  { n: '2', hook: 'Я не хочу еще один habit tracker. Я хочу видеть, что меняюсь.', angle: 'Habit pain' },
  { n: '3', hook: 'AI avatar бесполезен, если он не связан с твоим действием.', angle: 'Avatar causality' },
  { n: '4', hook: 'Твой future self не должен тебя стыдить.', angle: 'Future self' },
  { n: '5', hook: 'Один эпизод, одно действие, один визуальный след.', angle: 'Core loop' },
  { n: '6', hook: 'Это не гороскоп. Это сценарий маленького шага на сегодня.', angle: 'Objection' },
  { n: '7', hook: 'Почему ты бросаешь приложения для привычек через 3 дня?', angle: 'Retention' },
  { n: '8', hook: 'Мы сделали reset, который длится меньше минуты.', angle: 'Reset' },
  { n: '9', hook: 'Каждая неделя в AURA становится сезоном.', angle: 'Season' },
  { n: '10', hook: 'Если бы твоя тревога стала эпизодом, как бы он назывался?', angle: 'Emotional' },
  { n: '11', hook: 'Я хочу приложение, которое помнит не только streak, но и смысл.', angle: 'Memory' },
  { n: '12', hook: 'Avatar изменился не потому что AI красивый, а потому что ты сделал шаг.', angle: 'Causality' },
  { n: '13', hook: '7 дней спокойствия: что должно измениться в твоем Life Canvas?', angle: 'Season theme' },
  { n: '14', hook: 'Твоя следующая версия начинается не с мотивации, а с действия на 2 минуты.', angle: 'Action' },
  { n: '15', hook: 'Почему self-care apps часто ощущаются пустыми?', angle: 'Market pain' },
  { n: '16', hook: 'Мы тестируем приложение, где день превращается в серию о тебе.', angle: 'Build in public' },
  { n: '17', hook: 'Можно ли платить за приложение, которое помогает видеть свои изменения?', angle: 'Monetization' },
  { n: '18', hook: 'Что будет, если пропустить день? Ничего. История не ломается.', angle: 'Comeback' },
  { n: '19', hook: 'Дневник на одну строку, который потом собирает recap недели.', angle: 'Journaling' },
  { n: '20', hook: 'Выбери: спокойствие, уверенность, фокус, отношения, тело, деньги, творчество.', angle: 'Season choice' },
  { n: '21', hook: 'Мы убрали видеоаватары из MVP, потому что они могут убить экономику.', angle: 'Founder transparency' },
  { n: '22', hook: 'Главный риск AURA теперь не рынок, а вернешься ли ты завтра.', angle: 'Product risk' },
  { n: '23', hook: 'Что должно случиться на втором экране, чтобы ты доверил дату рождения?', angle: 'Privacy' },
  { n: '24', hook: 'В чем разница между “советом дня” и “эпизодом дня”?', angle: 'Education' },
  { n: '25', hook: 'Мы хотим проверить: может ли маленькое действие менять визуальную историю.', angle: 'Hypothesis' },
  { n: '26', hook: 'Если Calm успокаивает, Finch заботится, то что делает AURA?', angle: 'Comparison' },
  { n: '27', hook: 'Я хочу видеть не идеальную версию себя, а честную следующую.', angle: 'Tone' },
  { n: '28', hook: 'Твой первый эпизод начинается с вопроса: что сейчас правда важно?', angle: 'Onboarding' },
  { n: '29', hook: 'Почему paywall должен появляться только после первого value moment.', angle: 'Trust' },
  { n: '30', hook: 'AURA за 15 секунд: дата, состояние, эпизод, действие, canvas.', angle: 'Explainer' },
  { n: '31', hook: 'Мы ищем 30 людей, которые пройдут личный сезон первыми.', angle: 'Recruiting' },
  { n: '32', hook: 'Что если приложение не говорило “ты не сделал streak”, а помогало вернуться?', angle: 'Comeback' },
  { n: '33', hook: 'AI не должен заменять действие. Он должен помочь его выбрать.', angle: 'AI philosophy' },
  { n: '34', hook: 'Самое важное в avatar app - не avatar.', angle: 'Contrarian' },
  { n: '35', hook: 'Какая картинка должна появиться после действия про границы?', angle: 'Interactive' },
  { n: '36', hook: 'Мы не строим community, пока не доказали личную петлю.', angle: 'Focus' },
  { n: '37', hook: 'Покажи мне приложение, которое становится ценнее через 7 дней.', angle: 'Retention' },
  { n: '38', hook: 'Один человек, один сезон, одна маленькая перемена.', angle: 'Poetic' },
  { n: '39', hook: 'Это приложение должно быть странным ровно настолько, чтобы быть новым.', angle: 'Brand' },
  { n: '40', hook: 'Первый пользователь AURA не покупает AI. Он покупает продолжение истории.', angle: 'Monetization' },
  { n: '41', hook: 'Что ты сделал сегодня, что должен увидеть твой будущий образ?', angle: 'Prompt' },
  { n: '42', hook: 'Мы проверяем, можно ли сделать self-improvement менее сухим.', angle: 'Positioning' },
  { n: '43', hook: 'Если картинка не объясняет действие, она не нужна.', angle: 'Design principle' },
  { n: '44', hook: 'Твой progress bar может быть не полоской, а сценой.', angle: 'Visual metaphor' },
  { n: '45', hook: 'Почему weekly recap может быть главным paid feature.', angle: 'Paid value' },
  { n: '46', hook: 'Каждый день AURA должен отвечать: что я понял, что сделал, что изменилось?', angle: 'Framework' },
  { n: '47', hook: 'Не “стань лучше”. “Сделай шаг и увидь след”.', angle: 'Copy' },
  { n: '48', hook: 'Что если твой дневник сам собирал визуальную память?', angle: 'Memory' },
  { n: '49', hook: 'Мы не знаем, сработает ли это. Поэтому зовем первых 30 людей.', angle: 'Honesty' },
  { n: '50', hook: 'Если ты любишь astrology, journaling и AI images, нам нужно твое мнение.', angle: 'Targeting' }
], [
  { key: 'n', label: '#' },
  { key: 'hook', label: 'Hook' },
  { key: 'angle', label: 'Angle' }
]));
lines.push('');

lines.push('## 18. Objection Handling');
lines.push('');
lines.push(mdTable([
  { objection: 'Это просто гороскоп?', answer: 'Нет. Дата рождения может быть символическим входом, но ценность в episode -> action -> visual progress.', use: 'Landing FAQ, creator scripts.' },
  { objection: 'Это терапия?', answer: 'Нет. AURA не ставит диагнозы и не лечит; это self-reflection и маленькие действия.', use: 'Privacy/safety copy.' },
  { objection: 'Зачем мне avatar?', answer: 'Не ради картинки. Avatar/Life Canvas делает прогресс видимым.', use: 'Avatar screen, ads.' },
  { objection: 'Почему я должен вернуться завтра?', answer: 'Потому что история продолжается и Day 2 помнит Day 1.', use: 'Tomorrow hook.' },
  { objection: 'Почему платить?', answer: 'За продолжение сезона, память, recap, visual evolution и глубину.', use: 'Paywall.' },
  { objection: 'Это звучит слишком эзотерично', answer: 'Можно выбрать practical framing: reset, action, reflection, memory.', use: 'Audience segmentation.' },
  { objection: 'Я не хочу грузить фото лица', answer: 'В MVP face upload не нужен; Life Canvas может быть символическим.', use: 'Privacy reassurance.' },
  { objection: 'Я уже пользуюсь Finch/Calm/Notion', answer: 'AURA не заменяет их полностью; она соединяет смысл, действие и визуальную историю.', use: 'Comparison content.' },
  { objection: 'AI будет писать общие фразы', answer: 'Это главный риск MVP; поэтому тестируем relevance и собираем feedback.', use: 'Build in public.' },
  { objection: 'Я брошу через день', answer: 'MVP специально проверяет D1/D7; comeback flow не стыдит за пропуск.', use: 'Retention content.' }
], [
  { key: 'objection', label: 'Objection' },
  { key: 'answer', label: 'Answer' },
  { key: 'use', label: 'Where to use' }
]));
lines.push('');

lines.push('## 19. Operating Rhythm');
lines.push('');
lines.push(mdTable([
  { cadence: 'Daily', ritual: 'Check activation, completed loop, D1, qualitative notes.', owner: 'Founder/product', output: 'Top 3 fixes for tomorrow.' },
  { cadence: 'Daily', ritual: 'Publish 3-5 short videos and log hook performance.', owner: 'Growth', output: 'Hook leaderboard.' },
  { cadence: 'Daily', ritual: 'Talk to 2-3 users from first cohort.', owner: 'Founder', output: 'Exact phrases and confusion points.' },
  { cadence: 'Twice weekly', ritual: 'Review AI outputs and avatar causality examples.', owner: 'AI/product', output: 'Prompt changes.' },
  { cadence: 'Weekly', ritual: 'Cohort readout: D1/D7, paywall intent, top objections.', owner: 'Product/data', output: 'Go/no-go decisions.' },
  { cadence: 'Weekly', ritual: 'Landing and positioning review.', owner: 'Growth/product', output: 'Winning headline and offer.' },
  { cadence: 'End of 30 days', ritual: 'Decision meeting.', owner: 'Founder/team', output: 'Build MVP, pivot positioning, or stop.' }
], [
  { key: 'cadence', label: 'Cadence' },
  { key: 'ritual', label: 'Ritual' },
  { key: 'owner', label: 'Owner' },
  { key: 'output', label: 'Output' }
]));
lines.push('');

lines.push('## 20. Kill Criteria');
lines.push('');
lines.push(mdTable([
  { risk: 'Люди не понимают продукт', kill: 'После 20 интервью большинство описывает AURA как “просто гороскоп” или “просто картинки”.', action: 'Переписать positioning и screen flow.' },
  { risk: 'Avatar не причинный', kill: 'Меньше 50% пользователей могут объяснить, почему изменился Life Canvas.', action: 'Менять avatar mechanics, explanation, visual logic.' },
  { risk: 'Действия не выполняются', kill: 'Меньше 20% activated users завершают первое действие.', action: 'Упростить actions и reset.' },
  { risk: 'Нет возврата', kill: 'D1 ниже 15% даже в теплой concierge cohort.', action: 'Пересобрать Day 2 hook и season memory.' },
  { risk: 'Нет платного сигнала', kill: 'После completed loop никто не понимает, за что платить.', action: 'Менять paid value: memory/season/recap/styles.' },
  { risk: 'Слишком дорогая себестоимость', kill: 'Cost per completed loop растет выше acceptable paid margin.', action: 'Ограничить images/video, перейти на cheaper provider/templates.' }
], [
  { key: 'risk', label: 'Риск' },
  { key: 'kill', label: 'Kill signal' },
  { key: 'action', label: 'Что делать' }
]));
lines.push('');

lines.push('## 21. Final GTM Decision');
lines.push('');
lines.push('AURA сейчас не нужно “масштабно запускать”. Ей нужно пройти узкий коридор: 20 интервью, clickable prototype, 30 concierge users, 100 warm users, затем 1000 users через короткий контент и micro-creators. До этого момента нельзя спорить о большом performance marketing. Главный GTM-актив - не бюджет, а точная формулировка новой категории и доказательство, что пользователь сам может объяснить: “я получил эпизод, сделал маленькое действие, увидел изменение, хочу завтра продолжение”.');

fs.mkdirSync('reports', { recursive: true });
fs.writeFileSync(OUT, `${lines.join('\n').trimEnd()}\n`);
console.log(`aura_gtm_plan=${OUT}`);
