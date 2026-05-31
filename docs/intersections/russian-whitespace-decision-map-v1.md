# Русская whitespace decision map V1

Собрано: 2026-05-31T12:24:40.752Z

## Зачем нужен этот файл

Этот слой переводит whitespace analysis в решение по H3. Он отделяет три вещи: где есть реальная узкая возможность, где рынок полезен только как benchmark, и где рынок слишком crowded/unclear, чтобы усиливать claim. Карта намеренно консервативна: public listing и cross-source counts помогают выбрать, что проверять, но не закрывают H3.

Контекст: whitespace rows=12552, saturation markets=6, product-core rows=100, top100 rows=100, public listing inspected=12.

## Market Read

| Niche | Dedup | Full-loop % | Opportunity | H3 read |
| --- | ---: | ---: | --- | --- |
| mindfulness | 9723 | 3.82 | возможность есть, но нужна выборочная ручная проверка | H3 можно держать как narrow directional whitespace: full-loop-like кандидаты редки, но sampling обязателен. |
| avatar_identity | 7944 | 2.83 | возможность есть, но нужна выборочная ручная проверка | H3 можно держать как narrow directional whitespace: full-loop-like кандидаты редки, но sampling обязателен. |
| gaming | 14304 | 1.03 | механический benchmark, не основной whitespace | Не использовать как H3 proof. Это источник механик, а не доказательство рынка Alina. |
| gaming_progression | 950 | 6.63 | механический benchmark, не основной whitespace | Не использовать как H3 proof. Это источник механик, а не доказательство рынка Alina. |
| coaching | 3857 | 13.02 | рынок видим, но claim о whitespace слабый без нового evidence | H3 не усиливать: плотность/контекст/прямота пока слишком неоднозначны. |
| astrology_esoterics | 2657 | 13.70 | рынок видим, но claim о whitespace слабый без нового evidence | H3 не усиливать: плотность/контекст/прямота пока слишком неоднозначны. |

## mindfulness

**Сигнал:** 9723 dedup rows, 725 high-intersection candidates, 371 full-loop-like candidates, full-loop rate 3.82%.

**Решение:** H3 можно держать как narrow directional whitespace: full-loop-like кандидаты редки, но sampling обязателен.

**Риск:** public-listing high hidden-clone risks=1, visible causality=1, strict loop claims=3. Top risk apps: Shepherd: Spiritual Bible BFF:high_hidden_clone_risk_requires_app_walkthrough|Zing AI: Home & Gym Workouts:medium_adjacency_risk|EVOLVE: Transform Your Life:medium_adjacency_risk|Daily Burn: Workout Coach:medium_adjacency_risk|Myla : Manifest & Vision Board:medium_adjacency_risk.

**Следующая проверка:** Sample top direct consumer-app and desktop rows, then compare against prototype scorecard.

## avatar_identity

**Сигнал:** 7944 dedup rows, 337 high-intersection candidates, 225 full-loop-like candidates, full-loop rate 2.83%.

**Решение:** H3 можно держать как narrow directional whitespace: full-loop-like кандидаты редки, но sampling обязателен.

**Риск:** public-listing high hidden-clone risks=1, visible causality=1, strict loop claims=3. Top risk apps: Shepherd: Spiritual Bible BFF:high_hidden_clone_risk_requires_app_walkthrough|Zing AI: Home & Gym Workouts:medium_adjacency_risk|EVOLVE: Transform Your Life:medium_adjacency_risk|Daily Burn: Workout Coach:medium_adjacency_risk|Myla : Manifest & Vision Board:medium_adjacency_risk.

**Следующая проверка:** Sample top direct consumer-app and desktop rows, then compare against prototype scorecard.

## gaming

**Сигнал:** 14304 dedup rows, 295 high-intersection candidates, 147 full-loop-like candidates, full-loop rate 1.03%.

**Решение:** Не использовать как H3 proof. Это источник механик, а не доказательство рынка Alina.

**Риск:** public-listing high hidden-clone risks=1, visible causality=1, strict loop claims=3. Top risk apps: Shepherd: Spiritual Bible BFF:high_hidden_clone_risk_requires_app_walkthrough|Zing AI: Home & Gym Workouts:medium_adjacency_risk|EVOLVE: Transform Your Life:medium_adjacency_risk|Daily Burn: Workout Coach:medium_adjacency_risk|Myla : Manifest & Vision Board:medium_adjacency_risk.

**Следующая проверка:** Use for progression/avatar/retention mechanics only; do not treat as direct market proof.

## gaming_progression

**Сигнал:** 950 dedup rows, 90 high-intersection candidates, 63 full-loop-like candidates, full-loop rate 6.63%.

**Решение:** Не использовать как H3 proof. Это источник механик, а не доказательство рынка Alina.

**Риск:** public-listing high hidden-clone risks=1, visible causality=1, strict loop claims=3. Top risk apps: Shepherd: Spiritual Bible BFF:high_hidden_clone_risk_requires_app_walkthrough|Zing AI: Home & Gym Workouts:medium_adjacency_risk|EVOLVE: Transform Your Life:medium_adjacency_risk|Daily Burn: Workout Coach:medium_adjacency_risk|Myla : Manifest & Vision Board:medium_adjacency_risk.

**Следующая проверка:** Use for progression/avatar/retention mechanics only; do not treat as direct market proof.

## coaching

**Сигнал:** 3857 dedup rows, 899 high-intersection candidates, 502 full-loop-like candidates, full-loop rate 13.02%.

**Решение:** H3 не усиливать: плотность/контекст/прямота пока слишком неоднозначны.

**Риск:** public-listing high hidden-clone risks=1, visible causality=1, strict loop claims=3. Top risk apps: Shepherd: Spiritual Bible BFF:high_hidden_clone_risk_requires_app_walkthrough|Zing AI: Home & Gym Workouts:medium_adjacency_risk|EVOLVE: Transform Your Life:medium_adjacency_risk|Daily Burn: Workout Coach:medium_adjacency_risk|Myla : Manifest & Vision Board:medium_adjacency_risk.

**Следующая проверка:** Use only as support/context unless new source-native evidence is added.

## astrology_esoterics

**Сигнал:** 2657 dedup rows, 589 high-intersection candidates, 364 full-loop-like candidates, full-loop rate 13.70%.

**Решение:** H3 не усиливать: плотность/контекст/прямота пока слишком неоднозначны.

**Риск:** public-listing high hidden-clone risks=1, visible causality=1, strict loop claims=3. Top risk apps: Shepherd: Spiritual Bible BFF:high_hidden_clone_risk_requires_app_walkthrough|Zing AI: Home & Gym Workouts:medium_adjacency_risk|EVOLVE: Transform Your Life:medium_adjacency_risk|Daily Burn: Workout Coach:medium_adjacency_risk|Myla : Manifest & Vision Board:medium_adjacency_risk.

**Следующая проверка:** Use only as support/context unless new source-native evidence is added.

## H3 Boundary

Нельзя утверждать, что белое пятно доказано, пока P0 competitors не пройдены вручную. Самый опасный ранний риск - Shepherd: Spiritual Bible BFF: public listing уже показывает visible action -> avatar/progress causality и требует hidden-clone walkthrough до любого усиления H3.

## Файлы

- `data_processed/russian_whitespace_decision_map.csv`
- `docs/intersections/russian-whitespace-decision-map-v1.md`
- `data_processed/whitespace_signal_matrix.csv`
- `data_processed/cross_source_market_saturation_matrix.csv`
- `data_processed/public_listing_inspection_results.csv`
- `data_processed/product_core_evidence_matrix.csv`
