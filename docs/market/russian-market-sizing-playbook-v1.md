# Русский market sizing playbook V1

Собрано: 2026-05-31T12:19:03.942Z

## Зачем нужен этот файл

Этот слой переводит TAM/SAM/SOM модель в русскую методологию. Его задача - объяснить, как читать рынок Alina без ложной точности: где широкий TAM, где serviceable SAM, где confidence weight, где bottom-up money proxy, где стресс-сценарий, а где только гипотеза до paid-flow и WTP evidence.

## Формулы

**Top-down:** TAM category -> serviceable share -> SAM -> confidence/directness weighted SAM.

**Bottom-up stress:** reachable users * activation rate * paid conversion * ARPPU = annual revenue scenario.

**Competitor proxy:** competitor paid behavior + IAP/paywall/review signals показывают наличие платной привычки, но не доказывают выручку Alina.

## Market-by-market read

| Pillar | Directness | SAM base | Weighted SAM | Money verdict | Как читать |
| --- | --- | ---: | ---: | --- | --- |
| gaming | benchmark: деньги и retention-паттерны видны, но это не прямой TAM Alina | $671,100,000 | $469,770,000 | benchmark_money_visible_not_direct_tam | Держать вне прямого TAM. Использовать как benchmark механик прогресса, retention и monetization patterns. |
| astrology_esoterics | direct adjacent: можно использовать как рыночный якорь с caveats | $374,400,000 | $262,080,000 | strong_directional_money_case | Деньги видны направленно: можно использовать для приоритизации validation, но не как финальную выручку Alina. |
| avatar_identity | broad adjacent: нужен сильный consumer/self-improvement discount | $420,000,000 | $294,000,000 | strong_directional_money_case | Деньги видны направленно: можно использовать для приоритизации validation, но не как финальную выручку Alina. |
| coaching | direct adjacent: можно использовать как рыночный якорь с caveats | $300,000,000 | $210,000,000 | medium_directional_money_case | Использовать осторожно как range/context до ручного paywall/product-match evidence. |
| mindfulness | direct adjacent: можно использовать как рыночный якорь с caveats | $252,000,000 | $176,400,000 | strong_directional_money_case | Деньги видны направленно: можно использовать для приоритизации validation, но не как финальную выручку Alina. |
| intersection | intersection model: расчетная зона Alina, не внешний market report | $201,960,000 | $80,784,000 | insufficient_money_case | Читать только как modeled SAM для проверки гипотезы. Нельзя использовать как revenue forecast без ICP/WTP и paid-flow validation. |

## gaming: mobile gaming

**Формула:** SAM base = TAM base $134,220,000,000 * serviceable share 0.50% = $671,100,000. Weighted SAM applies confidence/directness weight 0.7 -> $469,770,000.

**Денежный verdict:** benchmark_money_visible_not_direct_tam, score 7, risk penalty 3.

**Как использовать:** Держать вне прямого TAM. Использовать как benchmark механик прогресса, retention и monetization patterns.

**Caveat:** Public IAP/review/install/paywall proxies cannot prove revenue; use for triangulation and validation prioritization.

**Следующий proof:** Keep as monetization/retention benchmark; do not count as direct Alina TAM unless direct audience overlap is validated.

## astrology_esoterics: astrology apps

**Формула:** SAM base = TAM base $6,240,000,000 * serviceable share 6.0% = $374,400,000. Weighted SAM applies confidence/directness weight 0.7 -> $262,080,000.

**Денежный verdict:** strong_directional_money_case, score 9, risk penalty 0.

**Как использовать:** Деньги видны направленно: можно использовать для приоритизации validation, но не как финальную выручку Alina.

**Caveat:** Public IAP/review/install/paywall proxies cannot prove revenue; use for triangulation and validation prioritization.

**Следующий proof:** Run paid-flow signoff and WTP prototype probes before using as final product-level money proof.

## avatar_identity: AI avatars

**Формула:** SAM base = TAM base $8,400,000,000 * serviceable share 5.0% = $420,000,000. Weighted SAM applies confidence/directness weight 0.7 -> $294,000,000.

**Денежный verdict:** strong_directional_money_case, score 10, risk penalty 1.

**Как использовать:** Деньги видны направленно: можно использовать для приоритизации validation, но не как финальную выручку Alina.

**Caveat:** Public IAP/review/install/paywall proxies cannot prove revenue; use for triangulation and validation prioritization.

**Следующий proof:** Run paid-flow signoff and WTP prototype probes before using as final product-level money proof.

## coaching: digital coaching and AI coaching

**Формула:** SAM base = TAM base $5,000,000,000 * serviceable share 6.0% = $300,000,000. Weighted SAM applies confidence/directness weight 0.7 -> $210,000,000.

**Денежный verdict:** medium_directional_money_case, score 8, risk penalty 3.

**Как использовать:** Использовать осторожно как range/context до ручного paywall/product-match evidence.

**Caveat:** Public IAP/review/install/paywall proxies cannot prove revenue; use for triangulation and validation prioritization.

**Следующий proof:** Add manual paywall/product-match evidence and competitor revenue/intelligence before investor-grade claims.

## mindfulness: meditation and mindfulness apps

**Формула:** SAM base = TAM base $1,680,000,000 * serviceable share 15.0% = $252,000,000. Weighted SAM applies confidence/directness weight 0.7 -> $176,400,000.

**Денежный verdict:** strong_directional_money_case, score 9, risk penalty 0.

**Как использовать:** Деньги видны направленно: можно использовать для приоритизации validation, но не как финальную выручку Alina.

**Caveat:** Public IAP/review/install/paywall proxies cannot prove revenue; use for triangulation and validation prioritization.

**Следующий proof:** Run paid-flow signoff and WTP prototype probes before using as final product-level money proof.

## intersection: Alina direct intersection SAM

**Формула:** SAM base = TAM base $1,346,400,000 * serviceable share 15.0% = $201,960,000. Weighted SAM applies confidence/directness weight 0.4 -> $80,784,000.

**Денежный verdict:** insufficient_money_case, score 1, risk penalty 4.

**Как использовать:** Читать только как modeled SAM для проверки гипотезы. Нельзя использовать как revenue forecast без ICP/WTP и paid-flow validation.

**Caveat:** Range-based modeled intersection. Must be validated with competitor revenue, user interviews, and conversion tests.

**Следующий proof:** Validate intersection through ICP/WTP and competitor bottom-up proxies; keep modeled SAM as range-only.

## Stress scenarios

| Scenario | Reachable | Activation | Paid conv | ARPPU | Annual revenue | Read |
| --- | ---: | --- | --- | --- | ---: | --- |
| defensive | 100000 | 0.25 | 0.02 | 50 | 25000 | tiny_validation_business |
| conservative | 250000 | 0.32 | 0.03 | 60 | 144000 | niche_early_business |
| base | 1000000 | 0.4 | 0.05 | 80 | 1600000 | niche_early_business |
| strong_niche | 2500000 | 0.45 | 0.07 | 95 | 7481250 | venture_relevant_if_retention_works |
| upside | 5000000 | 0.5 | 0.09 | 110 | 24750000 | large_outcome_requires_distribution_and_retention_proof |
| breakout | 10000000 | 0.55 | 0.11 | 125 | 75625000 | large_outcome_requires_distribution_and_retention_proof |

## H2 boundary

H2 нельзя закрывать одной TAM/SAM/SOM таблицей. Для апгрейда нужны paid-flow signoff, product-matched pricing/paywall evidence, ICP willingness-to-pay и прототипный paid-depth signal. До этого все цифры являются range-based prioritization, а не прогнозом выручки.

## Файлы

- `data_processed/russian_market_sizing_playbook.csv`
- `docs/market/russian-market-sizing-playbook-v1.md`
- `data_processed/tam_sam_som_model.csv`
- `data_processed/market_sizing_assumption_audit.csv`
- `data_processed/market_money_triangulation.csv`
- `data_processed/market_sizing_stress_test.csv`
- `data_processed/market_source_confidence_review.csv`
