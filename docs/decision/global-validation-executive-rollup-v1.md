# Global Validation Executive Rollup V1

Generated: 2026-05-31T18:05:57.651Z

## Зачем нужен этот слой

Этот rollup сводит H1-H6 в одну управленческую таблицу: что уже заполнено, какой это тип evidence, почему это еще не validation proof и какой следующий реальный шаг нужен. Он нужен, чтобы отчет не становился длиннее без роста доказательной силы.

## Gate Rollup

| H | Статус | Тип evidence | Rows | Success | Success gap | Граница claim | Следующий реальный шаг |
| --- | --- | --- | --- | --- | ---: | --- | --- |
| H1 | начато, но ниже порога | listing-only evidence | 12 / 60 | 0 / 25 | 25 | не апгрейдить гипотезу: evidence частичное, context/readiness/signoff не равны validated demand/product proof | пройти первые 5 P0-приложений от listing до onboarding, first action, avatar/progress feedback и paywall boundary |
| H3 | начато, но ниже порога | listing-only whitespace risk evidence | 12 / 60 | 0 / 25 | 25 | не апгрейдить гипотезу: evidence частичное, context/readiness/signoff не равны validated demand/product proof | для тех же 5 P0-приложений классифицировать full_loop / adjacent_loop / weak_adjacency и action->avatar causality |
| H2 | начато, но ниже порога | paid-flow signoff evidence | 28 / 48 | 8 / 12 | 4 | не апгрейдить гипотезу: evidence частичное, context/readiness/signoff не равны validated demand/product proof | добрать product-matched paid-flow rows с чистой ценой, trial/plan depth и first-value/paywall boundary |
| H5 | начато, но ниже порога | secondary VOC evidence | 12 / 96 | 0 / 30 | 30 | не апгрейдить гипотезу: evidence частичное, context/readiness/signoff не равны validated demand/product proof | провести первые P0-интервью ICP_A/ICP_D и заменить secondary VOC rows реальными participant answers |
| H4 | начато, но ниже порога | prototype-readiness evidence | 16 / 80 | 0 / 32 | 32 | не апгрейдить гипотезу: evidence частичное, context/readiness/signoff не равны validated demand/product proof | запустить prototype sessions и измерить comprehension, differentiation, meaning lift, trust/safety и return intent |
| H6 | начато, но ниже порога | prototype-readiness evidence | 16 / 80 | 0 / 32 | 32 | не апгрейдить гипотезу: evidence частичное, context/readiness/signoff не равны validated demand/product proof | после prototype sessions обновить MVP loop и проверить, могут ли участники назвать продукт и причинность своими словами |

## Главный вывод

Все 6 gates уже стартовали, но все 6 остаются hold/validate. H1/H3 основаны на listing-only evidence, H2 на paid-flow signoff с context-only строками, H5 на secondary VOC, H4/H6 на prototype readiness. Это хорошая исследовательская инфраструктура, но еще не product validation.

## Files

- `data_processed/global_validation_executive_rollup.csv`
- `data_processed/validation_gate_calculator.csv`
- `data_processed/manual_public_listing_signoff.csv`
- `data_processed/paid_flow_local_signoff.csv`
- `data_processed/icp_secondary_voc_signoff.csv`
- `data_processed/prototype_readiness_signoff.csv`
