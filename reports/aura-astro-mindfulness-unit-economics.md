# AURA: Astrology & Mindfulness Apps Unit Economics

Дата обновления: 2026-06-03.

Цель: собрать детальную экономику соседних категорий для AURA: astrology/spiritual guidance и mindfulness/meditation/sleep. В открытом доступе почти нет настоящих внутренних P&L этих компаний, поэтому ниже используются три слоя данных:

1. Official pricing: публичные цены подписок и IAP.
2. App-intelligence estimates: Rev.now, Adapty, Appark, Sensor Tower snippets и похожие публичные оценки.
3. Derived unit economics: расчеты AURA на базе revenue, MAU, paying users, price и предполагаемой комиссии Apple/Google.

Важно: все revenue/MAU/paying users из app-intelligence являются directional estimates, не точными финансовыми данными компаний.

## Executive Summary

Astrology apps и mindfulness apps доказывают разные части гипотезы AURA.

Astrology apps доказывают, что пользователи платят за personal meaning, weekly/daily guidance, compatibility, birth chart, relationship insight и “что со мной происходит”. Но у категории есть сильный риск: generic readings, агрессивные paywall, недоверие, refund complaints, ощущение “это просто гороскоп”.

Mindfulness apps доказывают, что daily ritual, sleep, stress relief, breathing, guided content и annual subscription могут быть крупным бизнесом. Но у категории есть другой риск: контентная библиотека становится перегруженной, пользователи устают от paywall, streaks и “слишком много кликов”.

Для AURA главный вывод такой:

> Лучший monetization path — не копировать astrology paywall и не копировать meditation library. Нужно взять willingness to pay за личный смысл из astrology, retention ritual из mindfulness и добавить причинный visual layer: Life Canvas меняется не случайно, а после действия пользователя.

## 1. Astrology Apps: Revenue & Unit Economics Proxy

| Product | Store / scope | Revenue estimate | MAU / users proxy | Paying users proxy | Price signal | Derived ARPMAU | Derived payer conversion | Notes |
| --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | --- |
| Co-Star | iOS | $797.5K/mo | 2.7M MAU | 64K payers | ~$8.99/mo + IAP ladder | ~$0.30 | ~2.4% | Strong brand, social compatibility, relationship upsells. |
| Co-Star | Android | $95.3K/mo | 487K MAU | n/a | ~$8.62/mo | ~$0.20 | n/a | Android materially weaker than iOS. |
| Nebula | iOS | $718K/mo | 2.2M MAU | 52K payers | ~$9.99/mo + weekly IAPs | ~$0.33 | ~2.4% | Strong monetization, but high trust/refund risk. |
| CHANI | iOS ranking | $674.5K/mo | n/a | implied ~45K-65K | ~$13/mo signal | n/a | n/a | Premium trusted voice/content; less “AI slop” positioning. |
| The Pattern | iOS | $36.1K/mo | 160K MAU | 4K payers | annual ~= $7/mo; monthly tiers higher | ~$0.23 | ~2.5% | Relationship/self-insight depth; weaker recent rating. |
| The Pattern | Android | $84.9K/mo | 227K MAU | n/a | ~$27.48/mo parsed proxy | ~$0.37 | n/a | Higher Android ARPMAU in Rev.now estimate. |
| AstroBella | iOS | $5.1K/mo | 27K MAU | n/a | IAP/subscription | ~$0.19 | n/a | Small but shows long-tail monetization. |
| Astrotalk | company/app-led service | Rs 1,176 crore FY25 operating revenue | n/a | n/a | consultations / app-led services | n/a | n/a | Different model: human astrology marketplace, not pure subscription app. |

### Sources

- Co-Star iOS: Rev.now estimates $797.5K/month, 2.7M MAU, 64K paying users, 30.8M installs, ~$8.99/month subscription.
- Co-Star Android: Rev.now estimates $95.3K/month, 487K MAU, 8.3M installs.
- Nebula iOS: Rev.now estimates $718K/month, 2.2M MAU, 52K paying users, 25.3M installs, ~$9.99/month subscription and weekly IAP tiers.
- CHANI: Rev.now astrology leaderboard reports $674.5K/month App Store estimate and ~$13/month price signal.
- The Pattern iOS: Rev.now estimates $36.1K/month, 160K MAU, 4K paying users.
- The Pattern Android: Rev.now estimates $84.9K/month, 227K MAU.
- AstroBella iOS: Rev.now estimates $5.1K/month, 27K MAU.
- Astrotalk: Economic Times reports FY25 operating revenue of Rs 1,176 crore.

## 2. Astrology Apps: What People Pay For

| Paid object | Examples | What it means for AURA |
| --- | --- | --- |
| Monthly subscription | Co-Star Plus, Nebula premium, The Pattern Go Deeper | Users pay when the app feels personally relevant, not when it feels like generic horoscope content. |
| Weekly subscription / high-friction IAP | Nebula weekly readings, compatibility, relationship checks | High ARPPU is possible, but aggressive weekly pricing creates refund/trust risk. |
| Relationship/compatibility reports | Co-Star Eros, crush reports, The Pattern relationship analysis | Relationship/self-understanding is one of the most monetizable astrology angles. |
| Birth chart / deeper report | Co-Star chart reports, Nebula birth chart readings, CHANI deeper astrology | AURA can package birth data as “life context”, not as hard astrology positioning. |
| Live/human guidance | Sanctuary, Astrotalk, astrologer marketplaces | Human expert layer has high willingness to pay, but operational complexity is much higher. |

## 3. Astrology Apps: Unit Economics Pattern

Typical public proxy pattern:

- Paying conversion: around 2-3% of MAU for large subscription astrology apps in Rev.now estimates.
- ARPMAU: roughly $0.19-$0.37/month for the examples where MAU is visible.
- Net revenue per paying user: often above headline monthly subscription because IAP and weekly products add ARPPU.
- iOS monetization is materially stronger than Android for premium spiritual/self-discovery products.

What this means:

1. AURA should not assume high paid conversion on day one. Base case should use 2-3% paid conversion, not 8-10%.
2. AURA can price near $9.99-$14.99/month if it proves personal relevance before paywall.
3. AURA should avoid Nebula-style trust risk: no hidden subscription trap, no vague psychic language, no fake urgency.
4. AURA should borrow “relationship/self-insight/deeper report” economics, but translate it into Life Canvas, season, future-self and assistant memory.

## 4. Mindfulness Apps: Revenue & Unit Economics Proxy

| Product | Store / scope | Revenue estimate | MAU / users proxy | Paying users proxy | Price signal | Derived ARPMAU | Derived payer conversion | Notes |
| --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | --- |
| Calm | brand / Sacra | ~$300M/year historical proxy; 4M+ paying subscribers | n/a | 4M+ payers | ~$70/year, ~$14.99/mo | n/a | n/a | Huge proof that wellness subscriptions can scale. |
| Calm | Android / Rev.now | $2.35M/mo | 3.6M MAU | 85K payers | ~$19.90/mo parsed | ~$0.65 | ~2.4% | Android-only estimate; Rev notes full brand revenue can be off-store. |
| Calm | iOS / Adapty | $5M/mo estimate | 300K downloads/mo | n/a | $14.99/mo, $69.99/year | n/a | n/a | Strong annual-plan anchor. |
| Headspace | brand / Rev.now developer | ~$200M/year brand proxy | n/a | n/a | ~$12.99/mo, annual plans | n/a | n/a | Off-store/B2B revenue matters. |
| Headspace | Android / Rev.now | $1.23M/mo | n/a | n/a | IAP $4.99-$119.99 | n/a | n/a | Android app-store slice only. |
| Headspace | Udonis proxy | ~$39-40M/year app-store revenue; ~1.7M MAU | 1.7M MAU | n/a | subscription | ~$1.9/mo if using $39M/year / MAU | n/a | Directional; private revenue estimates disagree. |
| Waking Up | official pricing / Rev leaderboard | $492.7K/mo iOS leaderboard estimate | n/a | n/a | $19.99/mo, $129.99/year | n/a | n/a | Premium “serious seeker” positioning. |
| Insight Timer | public member signal / Rev | 32M members; Android $345.5K/mo meditation leaderboard | 32M registered members | n/a | ~$19.95/mo Android signal | n/a | n/a | Free-library strategy; monetization through premium/live/teacher ecosystem. |
| Balance | Android / Rev.now | $180K/mo | ~317K MAU implied | 11K payers | ~$11.99/mo | ~$0.57 | ~3.5% | Personalization-first meditation coach positioning. |
| Meditopia | iOS / Rev.now | $118.4K/mo | 629K MAU | n/a | ~$5.83/mo | ~$0.19 | n/a | Large library + AI therapy positioning. |

### Sources

- Calm: Sacra, Adapty, Rev.now Android.
- Headspace: Rev.now Android/developer page, Udonis statistics.
- Waking Up: official subscription page and Rev.now meditation leaderboard.
- Insight Timer: Rev.now meditation leaderboard and public member-count reporting via 2026 meditation statistics articles.
- Balance: Rev.now Android.
- Meditopia: Rev.now iOS.

## 5. Mindfulness Apps: What People Pay For

| Paid object | Examples | What it means for AURA |
| --- | --- | --- |
| Annual subscription | Calm, Headspace, Waking Up | Annual plans reduce churn pressure and give upfront cashflow. |
| Sleep content | Calm, Headspace, BetterSleep, sleep trackers | Sleep is one of the strongest repeat-use monetization anchors. |
| Structured courses | Headspace, Waking Up, Balance | Users pay for progression and “I know what to do next”. |
| Personalization | Balance, Meditopia SOUL, AI companion features | AURA should not be a static content library; it should adapt to the user. |
| Daily ritual | Daily Calm, streaks, reminders, plans | Retention comes from a lightweight daily anchor, not from content volume alone. |
| Trusted teacher/voice | Waking Up, CHANI, Insight Timer teachers | Trust can justify premium pricing more than feature count. |

## 6. Mindfulness Apps: Unit Economics Pattern

Compared with astrology apps, mindfulness apps often have:

- higher subscription trust if the product is positioned as wellness/sleep/stress relief;
- lower variable COGS because most content is fixed-cost audio/video, not generated per user;
- strong annual-plan economics;
- high churn risk when the app becomes too complex, too commercial, or too content-library-like.

The key difference from AURA:

Mindfulness apps can serve the same meditation audio to millions of users. AURA wants personalized AI text, personalized Life Canvas and maybe video/avatar generation. That means AURA has more variable COGS and must be stricter with free usage.

## 7. Derived Benchmarks For AURA

### Conservative AURA benchmark

| Metric | Assumption |
| --- | ---: |
| Paid conversion from MAU | 2.0% |
| Monthly price | $9.99 |
| Net after store fee | ~$8.49 |
| COGS / paying user | $1.00-$1.50 |
| Product gross margin after AI COGS | ~82-88% before support/marketing |
| Free user COGS | $0.10-$0.25/mo |
| Rule | no free video |

### Base AURA benchmark

| Metric | Assumption |
| --- | ---: |
| Paid conversion from MAU | 3.0-3.5% |
| Monthly price | $11.99-$14.99 |
| Net after store fee | ~$10.19-$12.74 |
| COGS / paying user | $1.00-$2.00 |
| Product gross margin after AI COGS | ~80-90% if video is tokenized |
| Video monetization | $2.99-$9.99 token, depending on provider |
| Annual plan | $69-$89/year |

### Aggressive AURA benchmark

| Metric | Assumption |
| --- | ---: |
| Paid conversion from MAU | 5%+ |
| Monthly price | $14.99 |
| Token attach rate | 10-20% of payers buy at least one premium visual moment/month |
| Premium video COGS | $0.40-$4.00 per 8 sec depending provider |
| Risk | paid intent exists, but visual generation COGS and retries must be logged per asset |

## 8. What This Changes In AURA

### Pricing

AURA should test:

- Free: first forecast, one Day 1 episode, one Life Canvas moment.
- Plus: $9.99-$14.99/month.
- Annual: $69-$89/year.
- Low-cost video token: $2.99-$4.99.
- Premium video token: $6.99-$9.99.
- Creator/special season: $14.99-$29.99.

### Product scope

AURA should prioritize:

1. Birth data + current request.
2. Weekly forecast/season.
3. Daily episode.
4. Action/reset.
5. Life Canvas change with causal explanation.
6. Memory/assistant continuity.
7. Paywall after first completed loop.
8. Premium video only after user understands the core loop.

### What not to do

- Do not position as “another astrology app”.
- Do not copy Nebula-style aggressive subscription funnel.
- Do not build a giant Calm-style content library.
- Do not include daily free AI video.
- Do not sell “unlimited AI generation”.

## 9. Open Data Gaps

To get closer to true unit economics, we would still need:

- paid ad spend / CAC by channel for each competitor;
- retention D1/D7/D30 and subscriber churn;
- exact gross vs net revenue;
- refund rate;
- app-store vs web revenue split;
- content production cost;
- support/moderation cost;
- real AI inference cost for AI-heavy astrology/chat apps.

These are not public for most private companies. The realistic strategy is to use public proxies for market sizing and then collect AURA-specific unit economics during the first concierge/prototype cohort.

## 10. Final Conclusion

The strongest proxy category for AURA is not pure astrology and not pure mindfulness.

The better market map is:

```text
Astrology willingness to pay
        +
Mindfulness daily ritual
        +
AI companion personalization
        +
Visual avatar / Life Canvas progression
        =
AURA
```

Financially, AURA should behave like a subscription wellness product on the outside and like a tightly cost-controlled AI product on the inside.

The winning unit economics thesis:

> Text + structured personalization + limited Life Canvas images can live inside subscription. Video/avatar generation must be paid, tokenized, milestone-based or creator-season-based until retention and paid intent are proven.
