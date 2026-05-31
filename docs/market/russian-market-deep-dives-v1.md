# Русские deep dives по пяти рынкам V1

Собрано: 2026-05-31T11:29:21.836Z

## Зачем нужен этот файл

Этот слой переводит пять рыночных направлений из общей матрицы в читаемые market-by-market выводы. Он не добавляет новых внешних claims и не усиливает H1-H6 сам по себе: вся логика остается evidence-first, а каждый рынок получает границу утверждения и следующий validation move.

## Сводная таблица

| Рынок | SAM base | Money verdict | Dedup rows | Whitespace | Русский вывод |
| --- | ---: | --- | ---: | --- | --- |
| Mindfulness / reset | 252000000 | strong_directional_money_case | 9723 | medium_opportunity_needs_sampling | приоритетный adjacent рынок для manual sampling |
| Avatar / identity | 420000000 | strong_directional_money_case | 7944 | medium_opportunity_needs_sampling | приоритетный adjacent рынок для manual sampling |
| Astrology / esoterics | 374400000 | strong_directional_money_case | 2657 | crowded_or_unclear_context | рынок важен, но crowded/unclear без walkthrough |
| Coaching / self-improvement | 300000000 | medium_directional_money_case | 3857 | crowded_or_unclear_context | рынок важен, но crowded/unclear без walkthrough |
| Gaming / progression benchmark | 671100000 | benchmark_money_visible_not_direct_tam | 14304 | mechanic_benchmark_not_primary_market | mechanic benchmark, не direct TAM |

## Mindfulness / reset

прямой adjacent рынок для короткого reset, сна, тревоги и ежедневной практики. Для Alina этот рынок читается так: нужен как доказательство привычки платить за calm/reset, но Alina должна отличаться не библиотекой медитаций, а связкой reset -> одно действие -> видимый прогресс.

Доказательная опора: 9723 dedup rows, 8 source/market coverage cells, 4021 audience rows, 804 Reddit/forum signal rows, 21 top-100 primary competitors. Рыночная модель дает SAM base $252,000,000, money verdict: strong_directional_money_case, score 9.

Whitespace read: medium_opportunity_needs_sampling; full-loop-like rate 3.82%; behavior/identity/progress signals 2529. Конкурентные money proxies: 2 strong, 4 medium+. Top Reddit signal groups: alternative_or_tool_switching_request: 339; reset_mindfulness_or_emotional_regulation_need: 207; pain_or_rejection_of_overbuilt_systems: 163; habit_accountability_and_progress_need: 71.

Вывод: приоритетный adjacent рынок для manual sampling. Граница: Можно использовать как directional evidence, но нельзя усиливать claim до product-market proof без walkthrough, paywall signoff и пользовательских сессий. Следующее действие: Sample top direct consumer-app and desktop rows, then compare against prototype scorecard.

## Avatar / identity

рынок визуальной идентичности, аватаров, self-image и companion/creator механик. Для Alina этот рынок читается так: нужен как источник identity feedback, но главный риск - аватар может быть одноразовой генерацией или декором, а не причинным отражением действия.

Доказательная опора: 7944 dedup rows, 8 source/market coverage cells, 6844 audience rows, 648 Reddit/forum signal rows, 49 top-100 primary competitors. Рыночная модель дает SAM base $420,000,000, money verdict: strong_directional_money_case, score 10.

Whitespace read: medium_opportunity_needs_sampling; full-loop-like rate 2.83%; behavior/identity/progress signals 3607. Конкурентные money proxies: 7 strong, 16 medium+. Top Reddit signal groups: identity_companion_or_avatar_need: 385; alternative_or_tool_switching_request: 172; pain_or_rejection_of_overbuilt_systems: 39; unclassified_context_language: 36.

Вывод: приоритетный adjacent рынок для manual sampling. Граница: Можно использовать как directional evidence, но нельзя усиливать claim до product-market proof без walkthrough, paywall signoff и пользовательских сессий. Следующее действие: Sample top direct consumer-app and desktop rows, then compare against prototype scorecard.

## Astrology / esoterics

direct adjacent рынок личного смысла, символов, ежедневных подсказок и spiritual guidance. Для Alina этот рынок читается так: нужен как язык meaning и willingness-to-pay за персональные интерпретации, но claims должны быть осторожными из-за trust/safety и разброса источников.

Доказательная опора: 2657 dedup rows, 7 source/market coverage cells, 4990 audience rows, 35 Reddit/forum signal rows, 59 top-100 primary competitors. Рыночная модель дает SAM base $374,400,000, money verdict: strong_directional_money_case, score 9.

Whitespace read: crowded_or_unclear_context; full-loop-like rate 13.70%; behavior/identity/progress signals 867. Конкурентные money proxies: 8 strong, 35 medium+. Top Reddit signal groups: spiritual_guidance_or_meaning_need: 32; reset_mindfulness_or_emotional_regulation_need: 2; identity_companion_or_avatar_need: 1.

Вывод: рынок важен, но crowded/unclear без walkthrough. Граница: Можно использовать как directional evidence, но нельзя усиливать claim до product-market proof без walkthrough, paywall signoff и пользовательских сессий. Следующее действие: Use only as support/context unless new source-native evidence is added.

## Coaching / self-improvement

direct adjacent рынок намерений, целей, habit/action guidance и accountability. Для Alina этот рынок читается так: нужен как слой действия и структурирования, но нельзя превращать Alina в тяжелую productivity-систему или generic AI coach.

Доказательная опора: 3857 dedup rows, 7 source/market coverage cells, 5003 audience rows, 984 Reddit/forum signal rows, 50 top-100 primary competitors. Рыночная модель дает SAM base $300,000,000, money verdict: medium_directional_money_case, score 8.

Whitespace read: crowded_or_unclear_context; full-loop-like rate 13.02%; behavior/identity/progress signals 1709. Конкурентные money proxies: 5 strong, 11 medium+. Top Reddit signal groups: habit_accountability_and_progress_need: 388; alternative_or_tool_switching_request: 380; pain_or_rejection_of_overbuilt_systems: 181; reset_mindfulness_or_emotional_regulation_need: 14.

Вывод: рынок важен, но crowded/unclear без walkthrough. Граница: Можно использовать как directional evidence, но нельзя усиливать claim до product-market proof без walkthrough, paywall signoff и пользовательских сессий. Следующее действие: Use only as support/context unless new source-native evidence is added.

## Gaming / progression benchmark

benchmark рынок прогресса, наград, возвращаемости и avatar/progression feedback. Для Alina этот рынок читается так: нужен как библиотека механик, но не как прямой TAM: если продукт будет ощущаться как игра ради retention, личный смысл сломается.

Доказательная опора: 14304 dedup rows, 9 source/market coverage cells, 6460 audience rows, 83 Reddit/forum signal rows, 8 top-100 primary competitors. Рыночная модель дает SAM base $671,100,000, money verdict: benchmark_money_visible_not_direct_tam, score 7.

Whitespace read: mechanic_benchmark_not_primary_market; full-loop-like rate 1.03%; behavior/identity/progress signals 3785. Конкурентные money proxies: 0 strong, 4 medium+. Top Reddit signal groups: habit_accountability_and_progress_need: 27; alternative_or_tool_switching_request: 19; pain_or_rejection_of_overbuilt_systems: 15; gamified_progression_or_reward_need: 8.

Вывод: mechanic benchmark, не direct TAM. Граница: Нельзя считать прямым рынком Alina без доказанного ritual/self-improvement overlap; использовать как механику прогресса и retention. Следующее действие: Use for progression/avatar/retention mechanics only; do not treat as direct market proof.

## Файлы

- `data_processed/russian_market_deep_dives.csv`
- `docs/market/russian-market-deep-dives-v1.md`
