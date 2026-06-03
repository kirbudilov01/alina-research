# AURA Economics Sourcebook

Дата обновления: 2026-06-03.

Этот файл фиксирует расчетную базу для финансовых слайдов AURA Trendvi-style deck. Цифры делятся на два типа:

- official pricing: публичные прайсы API/провайдеров;
- public estimates/proxies: оценки выручки, MAU, downloads и paying users из публичных app-intelligence, research и press sources. Это не внутренние P&L компаний.

## 1. Generation Cost Benchmarks

| Layer | Provider / model | Public price signal | AURA implication | Source |
| --- | --- | --- | --- | --- |
| LLM | OpenAI GPT-4.1 mini | $0.40 / 1M input tokens; $1.60 / 1M output tokens | daily text loop can be cheap if prompts are structured | https://openai.com/api/pricing/ |
| Image | OpenAI Images | approx. $0.01 low / $0.04 medium / $0.17 high per square image | Life Canvas is viable if image count is capped | https://openai.com/api/pricing/ |
| Cinematic video | Google Veo 2 / Vertex AI | approx. $0.50 per generated second | 8 sec ~= $4.00; cannot be free daily content | https://cloud.google.com/vertex-ai/generative-ai/pricing |
| Cinematic video | Runway API | API billing example: $0.25 per 5 sec video | 8 sec ~= $0.40; viable for tests, still needs retry budget | https://docs.dev.runwayml.com/usage/billing/ |
| Video model | Replicate Wan 2.1 720p | $0.24 per output second | 8 sec ~= $1.92; better as paid token/milestone | https://replicate.com/wavespeedai/wan-2.1-t2v-720p/api |
| Talking avatar | HeyGen Avatar IV/V | $0.05/sec photo avatar; $0.0667/sec digital twin/studio avatar | 30 sec ~= $1.50-2.00; not a default daily loop | https://developers.heygen.com/docs/pricing |
| Avatar API | D-ID Build plan | $14.4/month annual, up to 16 min offline video | plan math ~= $0.90/min, but limits/credits/watermark matter | https://www.d-id.com/pricing/api?from=studio_settings |
| Cinematic video | Luma Ray-2 | public API pricing proxy around $0.08/sec | 8 sec ~= $0.64; should be rechecked directly before build | https://plans.apis.io/plans/luma-ai/luma-ai-plans-pricing/ |

## 2. Cost Per User Formula

```text
user COGS =
  LLM input tokens * input_price
+ LLM output tokens * output_price
+ image_count * image_price
+ video_seconds * video_price_per_second
+ storage
+ infra
+ support
+ failed_generation_buffer
```

Practical assumption for the deck:

| User type | Usage assumption | Variable AI cost | Meaning |
| --- | --- | --- | --- |
| Free active user | 8 text loops + 1 medium image + no video | $0.10-0.20 / MAU | safe if onboarding is capped |
| Engaged free user | 20 text loops + 2 images + no video | $0.25-0.45 / MAU | acceptable acquisition cost if retention improves |
| Plus subscriber | 25 text loops + 4 images + recaps + storage/support | $0.70-1.40 / payer | $9.99-14.99 subscription can hold margin |
| Plus + 1 Veo clip | + one 8 sec Veo 2 clip | +$4.00 before retries | margin collapses unless clip is paid separately |
| Plus + 4 Veo clips | + weekly 8 sec Veo clip | +$16.00 before retries | negative economics on $9.99/mo subscription |
| Token video | one paid 8 sec video moment | Runway ~= $0.40 / Replicate ~= $1.92 / Veo ~= $4.00 | price token by model quality |

## 3. Video Stress Test

| Scenario | 100 users | 1,000 users | 10,000 users | Decision |
| --- | ---: | ---: | ---: | --- |
| 1 free 8s Veo clip / month | $400 | $4,000 | $40,000 | too expensive before paid conversion is proven |
| 4 free 8s Veo clips / month | $1,600 | $16,000 | $160,000 | kills consumer subscription margin |
| 1 paid 8s Runway clip | $40 COGS | $400 COGS | $4,000 COGS | can work as low-price token |
| 1 paid 8s Replicate/Wan clip | $192 COGS | $1,920 COGS | $19,200 COGS | needs $4.99-9.99 token or bundle |
| 1 paid 30s HeyGen avatar | $150-200 COGS | $1,500-2,000 | $15,000-20,000 | works for premium forecast / assistant moment |
| Image-first Life Canvas | $4-17 COGS | $40-170 | $400-1,700 | safe default visual layer |

The product conclusion is hard: AURA can be visually premium, but it should not include free daily video generation.

## 4. Competitor Revenue Proxies

| Product | Category | Public signal used | Source |
| --- | --- | --- | --- |
| Calm | sleep / meditation | Sacra proxy: $300M revenue, 4M+ paying subscribers | https://sacra.com/c/calm/ |
| Headspace | meditation / mental health | Udonis/public proxy: roughly $39-40M/year app-store revenue, ~1.7M MAU | https://www.blog.udonis.co/statistics/headspace |
| Finch | self-care pet | Rev.now/SensorTower/ScreensDesign-style public estimates: roughly $1.5-2.0M/month, Plus around $9.99/mo | https://rev.now/app/ios/finch-self-care-pet-95748/ |
| Replika | AI companion | Rev.now Android estimate: $2.36M/month, paid users and ARPPU proxy | https://rev.now/app/android/replika-my-ai-friend-ux7ec/ |
| Character.AI | AI companion / roleplay | Sacra/AI Wiki proxies: $30-32M ARR; c.ai+ $9.99/mo | https://sacra.com/c/character-ai/ |
| Nebula | astrology guidance | Rev.now iOS estimate: $718K/month, 52K paying users; IAP/subscription ladder | https://rev.now/app/ios/nebula-spiritual-guidance-69523/ |
| CHANI | astrology / wellness | Rev.now/Appark/Statista-style public rankings: ~$674K-$832K/month estimate range | https://rev.now/best/astrology-apps/ |
| The Pattern | astrology / relationships | Adapty paywall library: roughly 90K downloads and $400K last-month estimate | https://adapty.io/paywall-library/the-pattern/ |
| Co-Star | astrology / social | Adapty/Trend Apps estimates: ~$300K-$500K/month; Axios: $15M Series A, 20M+ downloads | https://www.axios.com/2021/04/14/astrology-app-co-star-raises-15-million-funding |
| Waking Up | mindfulness / philosophy | official price signal: $19.99/mo or $129.99/year | https://www.wakingup.com/subscription |

## 5. AURA Pricing Decision

| Plan | Price | Included generation | Rule |
| --- | --- | --- | --- |
| Free | $0 | first forecast, Day 1 loop, one medium Life Canvas | COGS target below $0.20 |
| Plus monthly | $9.99/mo | daily text loop, memory, weekly recap, 2-4 images/mo | COGS target below $1.40 |
| Plus annual | $69-89/year | same core loop, annual season framing | improves cashflow and reduces churn pressure |
| Video token low | $2.99-4.99 | Runway/Luma-class 5-8 sec visual moment | works only if COGS stays below ~$1 |
| Video token premium | $6.99-9.99 | Veo/Replicate/HeyGen high-quality avatar/video | needed when COGS is $2-4+ |
| Creator season | $14.99-29.99 | limited guided pack / custom assistant style | monetizes content leverage, not only compute |

## 6. Strategic Conclusion

AURA should not sell unlimited AI generation.

It should sell:

- a weekly personal season;
- memory and continuity;
- Life Canvas causality;
- assistant tone and context;
- rare premium visual/video events.

The technical and financial boundary is clear: text and image-first visual evolution can live inside subscription. Expensive video must be premium, token-based, or milestone-based until real paid retention is proven.
