# Global Market Sizing Methodology V1

Generated: 2026-05-31T15:44:57.763Z

## Что доказывает этот слой

Этот слой объясняет, как читать TAM/SAM/SOM для мирового Alina Research. Он не пытается дать одну “твердую” цифру рынка. Вместо этого он показывает диапазон adjacent-рынков, conservative serviceable share, confidence weight и границы, после которых claim нельзя усиливать без observed evidence.

## Формулы

- Top-down SAM: `TAM base * serviceable share = SAM base`.
- Weighted SAM: `SAM base * confidence/directness weight = weighted SAM`.
- Bottom-up stress: `reachable users * activation rate * paid conversion * ARPPU = annual revenue scenario`.
- H2 upgrade rule: market reports и public pricing дают только directional support; H2 усиливается только после paid-flow signoff, ICP willingness-to-pay и prototype paid-depth signal.

## Таблица методологии

| Pillar | Тип рынка | TAM base | Share | SAM base | Weighted SAM | Риск | Как читать |
| --- | --- | ---: | --- | ---: | ---: | --- | --- |
| gaming | benchmark механик, не прямой TAM | $134.2B | 0.50% | $671M | $470M | не считать прямым рынком Alina | использовать только как benchmark retention/progression/monetization mechanics, не включать в прямой TAM Alina |
| astrology_esoterics | прямой adjacent-рынок | $6.24B | 6.00% | $374M | $262M | поддержано proxy, но нужен ручной paid-flow/WTP | использовать как directional market-money anchor до ручного paywall, ICP и WTP evidence |
| avatar_identity | широкий adjacent-рынок с сильным consumer-discount | $8.40B | 5.00% | $420M | $294M | поддержано proxy, но нужен ручной paid-flow/WTP | использовать как money context с сильным consumer/self-improvement discount |
| coaching | прямой adjacent-рынок | $5.00B | 6.00% | $300M | $210M | широкий диапазон источников, нужен conservative range | использовать как directional market-money anchor до ручного paywall, ICP и WTP evidence |
| mindfulness | прямой adjacent-рынок | $1.68B | 15.0% | $252M | $176M | поддержано proxy, но нужен ручной paid-flow/WTP | использовать как directional market-money anchor до ручного paywall, ICP и WTP evidence |
| intersection | расчетное пересечение Alina | $1.35B | 15.0% | $202M | $80.8M | модельное пересечение, высокий риск завысить claim | читать как рабочий modeled SAM для проверки, а не как прогноз выручки или investor-grade market claim |

## Stress-сценарии

| Сценарий | Reachable | Activation | Paid conv | ARPPU | Annual revenue | Как читать |
| --- | ---: | --- | --- | --- | ---: | --- |
| defensive | 100,000 | 25% | 2% | $50 | $25,000 | маленький validation business, полезен для проверки, но не для venture claim |
| conservative | 250,000 | 32% | 3% | $60 | $144,000 | ранний нишевый бизнес, имеет смысл при сильной удерживаемости |
| base | 1,000,000 | 40% | 5% | $80 | $1.6M | ранний нишевый бизнес, имеет смысл при сильной удерживаемости |
| strong_niche | 2,500,000 | 45% | 7% | $95 | $7.5M | venture-relevant только если retention и paid depth реально работают |
| upside | 5,000,000 | 50% | 9% | $110 | $24.8M | крупный outcome требует доказанного distribution, retention и WTP |
| breakout | 10,000,000 | 55% | 11% | $125 | $75.6M | крупный outcome требует доказанного distribution, retention и WTP |

## Файлы

- `data_processed/global_market_sizing_methodology.csv`
- `data_processed/tam_sam_som_model.csv`
- `data_processed/market_sizing_assumption_audit.csv`
- `data_processed/market_sizing_stress_test.csv`
- `data_processed/market_money_triangulation.csv`
