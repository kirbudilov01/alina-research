# Market Model Sensitivity Audit V1

Generated: 2026-05-31

## Зачем нужен этот слой

Этот аудит проверяет, где TAM/SAM/SOM модель наиболее чувствительна к assumptions. Он не добавляет новые market claims и не меняет базовую модель; он показывает, какие рычаги делают H2 хрупкой и какое evidence нужно собрать перед claim upgrade.

## Summary

- Rows: 6
- Medium-high/high/very-high sensitivity rows: 4
- Base stress annual revenue: $1.6M
- Breakout stress annual revenue: $75.6M

## Sensitivity Table

| Pillar | SAM base | Weighted SAM | SAM spread | Risk | Main driver | Next proof |
| --- | ---: | ---: | ---: | --- | --- | --- |
| gaming | $671M | $470M | 7.3 | средний | directness: benchmark нельзя считать прямым TAM | оставить как mechanics benchmark; не включать в прямой H2 proof |
| astrology_esoterics | $374M | $262M | 9.4 | средне-высокий | paid-flow/WTP still unobserved | добрать paid-flow screenshots и WTP/prototype paid-depth signals |
| avatar_identity | $420M | $294M | 29.4 | высокий | ширина диапазона SAM | добавить credible market anchors и source-confidence refresh |
| coaching | $300M | $210M | 5.3 | средний | range variance источников | добрать bottom-up competitor pricing/revenue proxy и WTP signals |
| mindfulness | $252M | $176M | 8.6 | высокий | малое число market anchors | добавить credible market anchors и source-confidence refresh |
| intersection | $202M | $80.8M | 30.3 | очень высокий | intersection discount + отсутствующие прямые источники | ICP/WTP + product-matched paid-flow + bottom-up competitor revenue proxy |

## Reading Rule

H2 нельзя усиливать из-за одной market-size таблицы. Самые важные рычаги сейчас: intersection discount, ширина SAM диапазона, directness рынка, количество источников и paid-flow/WTP evidence. До observed paid-flow и user WTP цифры остаются prioritization model, а не revenue forecast.

## Files

- `data_processed/market_model_sensitivity_audit.csv`
- `data_processed/tam_sam_som_model.csv`
- `data_processed/market_sizing_assumption_audit.csv`
- `data_processed/market_sizing_stress_test.csv`
