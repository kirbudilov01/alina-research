# Alina Research. Русский повествовательный отчет V1

Собрано: 2026-05-31T12:02:03.013Z

## Как читать этот документ

Этот отчет специально написан как последовательное повествование на русском языке. Таблицы и цифры здесь не заменяют рассказ, а поддерживают его: сначала мы фиксируем продуктовую гипотезу, потом показываем, почему рынок вообще заслуживает внимания, затем проверяем конкурентную плотность, белое пятно, аудиторию, продуктовую петлю и открытые риски. Это не финальная инвестиционная справка и не обещание спроса. Это evidence-first версия исследования: каждое сильное утверждение либо уже связано с локальными данными, либо явно оставлено в статусе гипотезы до ручной проверки.

Главный вывод на текущем этапе такой: направление Alina стоит продолжать исследовать, но нельзя честно объявлять его доказанным продуктом. Деньги и соседние рынки видны. Конкурентная среда большая. Аудиторные языки и боли повторяются. Узкое потенциальное белое пятно формулируется как ежедневная петля, где личный смысл превращается в одно действие, а результат действия становится видимым через прогресс, идентичность или аватар. Но эта петля пока должна пройти ручные конкурентные walkthrough, paywall sign-off, интервью и прототипные сессии.

## Карта аргумента

Чтобы отчет читался как последовательная история, каждый крупный блок связан с одним тезисом, доказательным слоем, ограничением и следующим действием. Это защищает документ от двух ошибок: превращения в сухую таблицу и превращения в красивый текст без evidence backbone.

| Шаг | Тезис | Доказательная опора | Граница утверждения |
| --- | --- | --- | --- |
| 01_problem_frame | Alina нужно рассматривать не как еще один трекер, медитацию или эзотерическое приложение, а как гипотезу о ежедневной петле личного смысла, действия, reset и видимого прогресса. | 33718 cross-source dedup rows across five markets; 20492 audience signal rows; 6 ICP hypotheses | Это формулировка исследовательской рамки, а не доказательство product-market fit. |
| 02_market_money | В соседних рынках видны деньги и платное поведение, но это пока directional proxy, а не доказанная выручка Alina. | 6 market-money rows; 3 strong and 1 medium directional money cases; 22 strong competitor revenue proxies; 70 medium+ competitor revenue proxies | Нельзя подавать TAM/SAM/SOM как прогноз revenue; H2 остается gated до paid-flow signoff и WTP evidence. |
| 03_competitive_density | Рынок не пустой: пользователи уже решают куски задачи соседними приложениями, поэтому искать нужно узкую комбинацию, а не широкую категорию. | 100 top-candidate review rows; 90 primary apps; 1/100 behavior-tied progression signal rows | Публичные листинги и metadata могут скрывать реальные onboarding loops; нельзя объявлять whitespace финальным без walkthrough. |
| 04_whitespace | Потенциальное белое пятно - не отдельная функция, а причинная петля meaning -> action -> reset -> visible identity/progress feedback -> return. | 12552 whitespace rows; 593 high whitespace candidates; 6 cross-source saturation markets | Это narrow opportunity hypothesis; gaming/progression остается benchmark-only, пока не доказан прямой consumer overlap. |
| 05_audience_icp | Общая аудитория - digital ritual users: люди, которые используют приложения для состояния, идентичности, прогресса и надежды на изменение. | 20492 audience rows; 6 ICP segments; 2339 coded Reddit rows; 574 Reddit capture rows | Это directional ICP, не финальная персона; Reddit rows не являются representative survey. |
| 06_reddit_language | Reddit/forum слой нужен как язык боли и альтернатив: overload, streak anxiety, repetitive content, weak personalization, unclear value before paid. | 2339 coded signals; 1852 unique thread reads; 336 P0 and 238 P1 reads; 574 unread/do-not-upgrade capture rows | Пока capture_status=not_started, нельзя цитировать треды во внешнем документе и нельзя усиливать claims. |
| 07_product_core | Проверяемая MVP-петля: персональное отражение дня, одно действие, короткий reset, завершение, причинное изменение прогресса/аватара и мягкий next-day hook. | 16 prototype stimulus rows; 6 scorecard metrics | Петля описана и подготовлена к тесту, но нет completed participant evidence. |
| 08_claim_status | Текущий честный verdict: продолжать исследование, но не переобещать. Evidence base сильная как подготовка, но не финальная validation proof. | 10 completion requirements; 6 not fully proved/final; 6 validation gates; 6 not started gates; 384 manifest artifacts | Не отмечать цель complete: manual competitor walkthroughs, paid signoff, ICP interviews and prototype sessions remain open. |
| 09_validation_operating_system | Исследование уже превращено в операционную систему проверки: гипотезы, gates, capture sheets и dashboard показывают, какие claims можно усиливать, а какие нужно держать. | 6 validation gates; 6 not-started gates; 10 completion audit rows | Наличие validation OS не равно завершенной валидации; это подготовка к disciplined execution. |
| 10_provenance_and_versioning | Все ключевые данные должны оставаться локально воспроизводимыми и версионированными, иначе большой ресерч быстро превращается в набор непроверяемых утверждений. | 384 manifest rows; local artifact hashes and row counts tracked; GitHub push used as persistence layer | Manifest подтверждает наличие и форму артефактов, но не заменяет human validation содержательных выводов. |
| 11_report_style | Финальный документ должен читаться как русское последовательное повествование: данные идут внутри рассказа, а не заменяют его. | Russian narrative report generated; evidence map is used as the chapter-level argument backbone; PDF output exists through the report pipeline | Красивый русский текст не должен усиливать недоказанные claims; каждое сильное утверждение остается связано с boundary. |

## 0. Исполнительный рассказ

Если читать весь ресерч как одну историю, она выглядит так. Мы начали с осторожной продуктовой гипотезы: возможно, существует место для приложения, которое соединяет личный смысл, маленькое действие, короткий reset и видимый прогресс в одну ежедневную петлю. Чтобы не строить это на вкусе или интуиции, мы развернули карту соседних рынков и получили 33718 dedup rows в cross-source universe, 100 строк top-candidate review, 20492 audience signal rows и 396 локальных артефактов в manifest. Это уже достаточно большой evidence warehouse, чтобы видеть рельеф рынка, но недостаточно, чтобы объявить продукт доказанным.

Главное, что стало понятнее: Alina не должна соревноваться с каждым meditation app, habit tracker, astrology app, avatar generator или coaching product по отдельности. Сильнее выглядит узкая ставка на причинную петлю: пользователь получает персональное отражение дня, выбирает одно действие, проходит reset, завершает шаг и видит, что прогресс или образ себя изменился именно из-за действия. В публичных данных эта комбинация пока выглядит редкой: в top-100 найдено 1/100 строгих behavior-tied progression signals, но 12 P0 конкурентов все еще требуют настоящего walkthrough, потому что скрытая петля может жить внутри onboarding, paywall или first-session experience.

Деньги в adjacent landscape видны, но их нужно держать честно. В market-money layer сейчас 3 strong directional cases, 1 medium directional case и 22 strong competitor revenue proxies. Базовый intersection SAM в модели равен $201,960,000. Это не прогноз выручки Alina и не обещание спроса; это аргумент, что рядом существуют платные привычки пользователей, которые стоит проверить через paid-flow signoff и willingness-to-pay вопросы.

Аудиторно наиболее полезная формулировка сейчас не демографическая, а поведенческая: digital ritual users. Это люди, которые уже используют приложения, чтобы регулировать состояние, видеть прогресс, поддерживать идентичность и возвращаться к ощущению изменения. Самый сильный directional ICP сейчас - Spiritual self-improvers, но ни один ICP нельзя считать выбранным до интервью и прототипных сессий. Поэтому финальный смысл текущего пакета простой: у нас есть масштабная карта, гипотезы, источники, матрицы и рабочая validation system; следующий скачок качества появится только после наблюдаемого evidence на экранах конкурентов и у живых пользователей.

## 1. Откуда мы начали

Исходная продуктовая идея была не в том, чтобы сделать еще один трекер привычек, еще один mindfulness-продукт или еще одно эзотерическое приложение. Интуиция была шире: есть люди, которым нужен ежедневный ритуал личного смысла, короткий reset, понятный следующий шаг и ощущение, что они меняются. Поэтому исследование разложено на пять направлений: coaching/self-improvement, mindfulness/reset, avatar/identity, astrology/esoterics и gaming/progression как источник механик, но не обязательно как основной рынок.

На уровне данных это уже не маленькая записка. Сейчас в локальном пакете 396 артефакта, missing в manifest: 0. Cross-source universe содержит 61345 нормализованных raw rows и 33718 dedup rows. Это дает масштабную карту соседних продуктов, но сама по себе карта не доказывает спрос на Alina. Она нужна, чтобы не спорить вслепую.

| Слой | Объем | Что это значит |
| --- | ---: | --- |
| Dedup competitor/source universe | 33718 | нижняя граница 30k+ уже закрыта на cross-source уровне |
| Coverage cells | 39 | покрытие рынков источниками, не один канал |
| Top-100 reviewed rows | 100 | AI-assisted конкурентный обзор, требует manual validation |
| Validation capture rows | 850 | готовые строки для ручной фиксации доказательств |

## 2. Рынки и деньги: почему здесь вообще может быть бизнес

Рыночная часть строится не на одной красивой цифре TAM, а на триангуляции. В модели есть TAM/SAM/SOM, source-confidence review, stress-test assumptions, IAP/Google Play/paywall evidence, competitor revenue proxy и отдельная market-money triangulation. Самая честная формулировка сейчас: в нескольких соседних рынках деньги видны направленно, но H2 все еще держится в validation, потому что нужны paid-flow walkthrough и willingness-to-pay evidence.

Сильные directional money cases сейчас: astrology apps, AI avatars, meditation and mindfulness apps. Средние directional cases: digital coaching and AI coaching. На уровне конкурентов есть 22 strong bottom-up money proxy и 70 medium-or-stronger proxy. Это поддерживает тезис, что пользователи платят в соседних категориях, но не доказывает, что они заплатят именно за Alina.

| Рынок | Вердикт денег | Score | Граница утверждения |
| --- | --- | ---: | --- |
| mobile gaming | benchmark_money_visible_not_direct_tam | 7 |  |
| astrology apps | strong_directional_money_case | 9 |  |
| AI avatars | strong_directional_money_case | 10 |  |
| digital coaching and AI coaching | medium_directional_money_case | 8 |  |
| meditation and mindfulness apps | strong_directional_money_case | 9 |  |
| Alina direct intersection SAM | insufficient_money_case | 1 |  |

Для intersection-модели базовый SAM в текущей модели: $201,960,000. Эту цифру нельзя читать как прогноз выручки. Ее корректнее читать как рамку: если удастся доказать продуктовую петлю, есть достаточно большой соседний платежный контекст, чтобы продолжать работу.

## 2.1. Пять рынков по отдельности

Чтобы не смешивать разные типы доказательств, добавлен market-by-market слой на 5 направлений. Он показывает роль каждого рынка для Alina: где мы ищем деньги, где язык личного смысла, где reset, где identity feedback, а где только механики прогресса. Этот слой особенно важен для русского PDF: он делает пять направлений не списком категорий, а последовательной картой решений.

| Рынок | SAM base | Money verdict | Dedup rows | Whitespace | Русский вывод |
| --- | ---: | --- | ---: | --- | --- |
| Mindfulness / reset | 252000000 | strong_directional_money_case | 9723 | medium_opportunity_needs_sampling | приоритетный adjacent рынок для manual sampling |
| Avatar / identity | 420000000 | strong_directional_money_case | 7944 | medium_opportunity_needs_sampling | приоритетный adjacent рынок для manual sampling |
| Astrology / esoterics | 374400000 | strong_directional_money_case | 2657 | crowded_or_unclear_context | рынок важен, но crowded/unclear без walkthrough |
| Coaching / self-improvement | 300000000 | medium_directional_money_case | 3857 | crowded_or_unclear_context | рынок важен, но crowded/unclear без walkthrough |
| Gaming / progression benchmark | 671100000 | benchmark_money_visible_not_direct_tam | 14304 | mechanic_benchmark_not_primary_market | mechanic benchmark, не direct TAM |

**Mindfulness / reset.** прямой adjacent рынок для короткого reset, сна, тревоги и ежедневной практики. Для Alina: нужен как доказательство привычки платить за calm/reset, но Alina должна отличаться не библиотекой медитаций, а связкой reset -> одно действие -> видимый прогресс. Evidence: 9723 dedup rows, 8 coverage cells, 4021 audience rows, 804 Reddit/forum signals, 21 top-100 primary competitors. Граница: Можно использовать как directional evidence, но нельзя усиливать claim до product-market proof без walkthrough, paywall signoff и пользовательских сессий.

**Avatar / identity.** рынок визуальной идентичности, аватаров, self-image и companion/creator механик. Для Alina: нужен как источник identity feedback, но главный риск - аватар может быть одноразовой генерацией или декором, а не причинным отражением действия. Evidence: 7944 dedup rows, 8 coverage cells, 6844 audience rows, 648 Reddit/forum signals, 49 top-100 primary competitors. Граница: Можно использовать как directional evidence, но нельзя усиливать claim до product-market proof без walkthrough, paywall signoff и пользовательских сессий.

**Astrology / esoterics.** direct adjacent рынок личного смысла, символов, ежедневных подсказок и spiritual guidance. Для Alina: нужен как язык meaning и willingness-to-pay за персональные интерпретации, но claims должны быть осторожными из-за trust/safety и разброса источников. Evidence: 2657 dedup rows, 7 coverage cells, 4990 audience rows, 35 Reddit/forum signals, 59 top-100 primary competitors. Граница: Можно использовать как directional evidence, но нельзя усиливать claim до product-market proof без walkthrough, paywall signoff и пользовательских сессий.

**Coaching / self-improvement.** direct adjacent рынок намерений, целей, habit/action guidance и accountability. Для Alina: нужен как слой действия и структурирования, но нельзя превращать Alina в тяжелую productivity-систему или generic AI coach. Evidence: 3857 dedup rows, 7 coverage cells, 5003 audience rows, 984 Reddit/forum signals, 50 top-100 primary competitors. Граница: Можно использовать как directional evidence, но нельзя усиливать claim до product-market proof без walkthrough, paywall signoff и пользовательских сессий.

**Gaming / progression benchmark.** benchmark рынок прогресса, наград, возвращаемости и avatar/progression feedback. Для Alina: нужен как библиотека механик, но не как прямой TAM: если продукт будет ощущаться как игра ради retention, личный смысл сломается. Evidence: 14304 dedup rows, 9 coverage cells, 6460 audience rows, 83 Reddit/forum signals, 8 top-100 primary competitors. Граница: Нельзя считать прямым рынком Alina без доказанного ritual/self-improvement overlap; использовать как механику прогресса и retention.

## 3. Конкурентная плотность: рынок большой, но не пустой

В top-100 review найдено 90 unique primary apps. Из них 45 выглядят high-threat, а direct reference competitor сейчас 1. Это означает, что пространство не пустое: пользователи уже решают куски задачи через meditation apps, habit apps, AI companions, astrology apps, avatar tools и game-like progression products.

Самый важный нюанс: широкие категории заняты, но строгий сигнал behavior-tied avatar/progress progression найден только в 1/100 top-candidate rows. Поэтому белое пятно формулируется узко: не "сделать все сразу", а проверить, действительно ли редка петля meaning -> action -> reset -> visible identity/progress feedback -> next-day return.

Manual inspection packet уже выделяет 12 P0 приложений для walkthrough, а public listing inspection покрывает 12 публичных листингов. Но это еще не закрывает вопрос: публичные описания могут скрывать реальные onboarding/paywall/product-loop детали. Поэтому H1 и H3 остаются в статусе hold/validate.

## 3.1. Русские battlecards P0 конкурентов

Чтобы конкурентный анализ был читаемым, добавлены русские battlecards на 12 P0 приложений. Они показывают угрозу, money proxy, review language, JTBD/pain, открытие для Alina и конкретные slots для walkthrough. Это не human validation: карточки только готовят проверку и не усиливают H1/H3 без скриншотов.

| # | Конкурент | Риск | Priority | Money proxy | Behavior-tied |
| --- | --- | --- | ---: | --- | --- |
| 1 | Shepherd: Spiritual Bible BFF | прямой reference-риск | 162.8 | strong_bottom_up_money_proxy | yes |
| 2 | Zing AI: Home & Gym Workouts | сильный платный close substitute | 112 | strong_bottom_up_money_proxy | no |
| 3 | Miracle Morning Routine | сильный платный close substitute | 111.4 | strong_bottom_up_money_proxy | no |
| 4 | EVOLVE: Transform Your Life | сильный платный close substitute | 106 | strong_bottom_up_money_proxy | no |
| 5 | Daily Yoga: Yoga for Fitness® | сильный платный close substitute | 99.2 | strong_bottom_up_money_proxy | no |
| 6 | Daily Burn: Workout Coach | сильный платный close substitute | 98 | strong_bottom_up_money_proxy | no |
| 7 | Myla : Manifest & Vision Board | высокий close-substitute риск | 97.6 | medium_bottom_up_money_proxy | no |
| 8 | Rosebud: AI Journal & Diary | высокий close-substitute риск | 97 | medium_bottom_up_money_proxy | no |
| 9 | Habit Tracker : Haby | высокий close-substitute риск | 95.8 | medium_bottom_up_money_proxy | no |
| 10 | Goddess・Women's Wellness Coach | высокий close-substitute риск | 95.8 | medium_bottom_up_money_proxy | no |
| 11 | LifeWheel Goal Habit Tracker | высокий close-substitute риск | 95.4 | medium_bottom_up_money_proxy | no |
| 12 | Habit Tracker | сильный платный close substitute | 94 | strong_bottom_up_money_proxy | no |

**Shepherd: Spiritual Bible BFF.** Публичные данные уже намекают на behavior-tied progression; это нужно проверять первым, потому что такой конкурент может сузить whitespace. Открытие для Alina: Differentiate by broader spiritual/identity scope, softer safety framing, and better reliability around action-tied progression. Проверить: app_store_listing_or_public_positioning|onboarding_first_value_screen|first_daily_action_or_task_screen|progress_avatar_identity_feedback_screen|first_paywall_or_iap_terms_screen.

**Zing AI: Home & Gym Workouts.** Публичные данные показывают близкие primitives, но не подтверждают причинную связку action -> identity/avatar/progress. Открытие для Alina: Make the avatar causally respond to completed daily action, not just exist as profile or decorative identity. Проверить: app_store_listing_or_public_positioning|onboarding_first_value_screen|first_daily_action_or_task_screen|progress_avatar_identity_feedback_screen|first_paywall_or_iap_terms_screen.

**Miracle Morning Routine.** Публичные данные показывают близкие primitives, но не подтверждают причинную связку action -> identity/avatar/progress. Открытие для Alina: Make the avatar causally respond to completed daily action, not just exist as profile or decorative identity. Проверить: app_store_listing_or_public_positioning|onboarding_first_value_screen|first_daily_action_or_task_screen|progress_avatar_identity_feedback_screen|first_paywall_or_iap_terms_screen.

**EVOLVE: Transform Your Life.** Публичные данные показывают близкие primitives, но не подтверждают причинную связку action -> identity/avatar/progress. Открытие для Alina: Make the avatar causally respond to completed daily action, not just exist as profile or decorative identity. Проверить: app_store_listing_or_public_positioning|onboarding_first_value_screen|first_daily_action_or_task_screen|progress_avatar_identity_feedback_screen|first_paywall_or_iap_terms_screen.

**Daily Yoga: Yoga for Fitness®.** Публичные данные показывают близкие primitives, но не подтверждают причинную связку action -> identity/avatar/progress. Открытие для Alina: Make the avatar causally respond to completed daily action, not just exist as profile or decorative identity. Проверить: app_store_listing_or_public_positioning|onboarding_first_value_screen|first_daily_action_or_task_screen|progress_avatar_identity_feedback_screen|first_paywall_or_iap_terms_screen.

**Daily Burn: Workout Coach.** Публичные данные показывают близкие primitives, но не подтверждают причинную связку action -> identity/avatar/progress. Открытие для Alina: Make the avatar causally respond to completed daily action, not just exist as profile or decorative identity. Проверить: app_store_listing_or_public_positioning|onboarding_first_value_screen|first_daily_action_or_task_screen|progress_avatar_identity_feedback_screen|first_paywall_or_iap_terms_screen.

## 4. Белое пятно: что именно может быть новым

Белое пятно не в том, что нет медитаций, нет привычек, нет коучинга или нет аватаров. Все это есть. Потенциальная возможность появляется на стыке: пользователю не просто дают контент или список задач, а помогают каждый день прожить маленький цикл изменения. Сначала он получает персональный смысл или отражение состояния. Потом выбирает одно реальное действие. Потом делает короткий reset. После завершения действия видит, что его прогресс или образ себя изменился не произвольно, а причинно связан с действием.

В whitespace matrix сейчас 12552 строк. Cross-source saturation держит gaming/progression скорее как benchmark, а не как прямой основной рынок. Это здоровая осторожность: игровые механики полезны как язык мотивации, но если Alina будет выглядеть как retention-game без личного смысла, гипотеза сломается.

| Рынок | Opportunity band | Интерпретация | Следующий шаг |
| --- | --- | --- | --- |
| mindfulness | medium_opportunity_needs_sampling | Plausible whitespace, but needs sampled competitor inspection before claim upgrade. | Sample top direct consumer-app and desktop rows, then compare against prototype scorecard. |
| avatar_identity | medium_opportunity_needs_sampling | Plausible whitespace, but needs sampled competitor inspection before claim upgrade. | Sample top direct consumer-app and desktop rows, then compare against prototype scorecard. |
| gaming | mechanic_benchmark_not_primary_market | Strong mechanic/saturation benchmark, but not a primary Alina consumer market without direct ritual/self-improvement overlap. | Use for progression/avatar/retention mechanics only; do not treat as direct market proof. |
| gaming_progression | mechanic_benchmark_not_primary_market | Strong mechanic/saturation benchmark, but not a primary Alina consumer market without direct ritual/self-improvement overlap. | Use for progression/avatar/retention mechanics only; do not treat as direct market proof. |
| coaching | crowded_or_unclear_context | Market is visible but either crowded, indirect, or weakly tied to the full Alina loop. | Use only as support/context unless new source-native evidence is added. |
| astrology_esoterics | crowded_or_unclear_context | Market is visible but either crowded, indirect, or weakly tied to the full Alina loop. | Use only as support/context unless new source-native evidence is added. |

## 5. Аудитория: не "люди из пяти рынков", а digital ritual users

Аудиторная гипотеза стала точнее. Общая аудитория - это не люди, которые одновременно пользуются всеми пятью категориями. Это люди, которые уже используют цифровые ритуалы, чтобы регулировать состояние, идентичность, прогресс и надежду на изменение. В audience matrix сейчас 20492 rows, в ICP matrix - 6 segment hypotheses. Самый сильный directional ICP на текущий момент: Spiritual self-improvers с evidence score 10.

Review/JTBD слой показывает повторяющиеся работы: daily anchor, structure self-improvement, make growth visible, fast emotional reset, belonging/accountability, feel seen/personalized. Reddit/forum слой добавляет живой язык: люди ищут alternatives, жалуются на перегрузку, скучные повторяющиеся медитации, streak anxiety, отсутствие ясного доказательства, что практики помогают, и слишком тяжелые системы.

| ICP | Сегмент | Evidence | Core job | Validation gate |
| --- | --- | --- | --- | --- |
| ICP_A | Spiritual self-improvers | strong_directional_icp | Turn symbolic/personal meaning into one grounded action today. | 5 interviews or manual sessions show users trust the daily guidance enough to act on it. |
| ICP_B | Avatar identity builders | strong_directional_icp | See a version of myself change as I make progress. | Manual inspection confirms avatar/identity products rarely make the visual self causally respond to a daily action. |
| ICP_C | Anxious daily reset users | strong_directional_icp | Calm down quickly and return to the day with one manageable next step. | Prototype users complete the reset without feeling gamified, pressured, or clinically generic. |
| ICP_D | Habit and progress users | strong_directional_icp | Make vague growth concrete and keep momentum without streak anxiety. | Users prefer action-tied progress/identity feedback over a plain checklist or streak counter. |
| ICP_E | Cozy/casual progression users | strong_directional_icp | Return because progress feels gentle, visible, and emotionally rewarding. | Users read progression as self-growth feedback, not game chores or retention tricks. |
| ICP_F | Coaching professionals and structured growth users | strong_directional_icp | Get structured guidance that turns intention into accountable practice. | Evidence separates consumer daily ritual use from B2B/career coaching demand. |

## 5.1. Русские ICP battlecards

Чтобы аудиторная часть была не набором сегментов, а рабочей картой клиента, добавлены русские ICP battlecards на 6 сегментов. Они последовательно отвечают на вопросы: кто этот пользователь, какую работу он уже делает, почему это важно для Alina, где его искать, как его отсечь на screener, что показать в прототипе, какой WTP-вопрос задать и по какому сигналу сегмент усилить или отбросить.

| ICP | Сегмент | Приоритет | Score | Audience rows | Reddit rows | Core job |
| --- | --- | --- | ---: | ---: | ---: | --- |
| ICP_A | Spiritual self-improvers | P0: начинать интервью и прототип с этого сегмента | 10 | 9045 | 922 | Turn symbolic/personal meaning into one grounded action today. |
| ICP_D | Habit and progress users | P0: начинать интервью и прототип с этого сегмента | 10 | 8444 | 1891 | Make vague growth concrete and keep momentum without streak anxiety. |
| ICP_C | Anxious daily reset users | P1: использовать как сравнение после P0 | 9 | 8444 | 1010 | Calm down quickly and return to the day with one manageable next step. |
| ICP_E | Cozy/casual progression users | P1: использовать как сравнение после P0 | 9 | 7426 | 666 | Return because progress feels gentle, visible, and emotionally rewarding. |
| ICP_F | Coaching professionals and structured growth users | P1: использовать как сравнение после P0 | 9 | 4423 | 1477 | Get structured guidance that turns intention into accountable practice. |
| ICP_B | Avatar identity builders | P1: использовать как сравнение после P0 | 8 | 7794 | 663 | See a version of myself change as I make progress. |

**Spiritual self-improvers.** Это люди, которые уже ищут личный смысл, символическое отражение дня, дневниковые практики, spiritual guidance или мягкий self-improvement. Для Alina это самый естественный вход: смысл должен быстро превращаться в одно реальное действие. Позиционирование: Personal guidance that becomes action, not another vague reading.. Следующий шаг: Набрать 8 интервью и 5 прототипных сессий, фиксируя recent behavior, конкретный эпизод, понимание петли, meaning lift и paid-depth сигнал.

**Habit and progress users.** Это люди, которым не хватает не еще одного списка задач, а более мягкого способа видеть движение вперед. Для Alina это проверка, может ли action-tied прогресс заменить жесткий streak pressure. Позиционирование: One meaningful action with forgiving visible progress, not another task manager.. Следующий шаг: Набрать 8 интервью и 5 прототипных сессий, фиксируя recent behavior, конкретный эпизод, понимание петли, meaning lift и paid-depth сигнал.

**Anxious daily reset users.** Это пользователи коротких reset, calm, sleep, breathwork и mood tools. Для Alina они важны как проверка: reset должен не просто успокоить, а вернуть человека к одному посильному следующему шагу. Позиционирование: A two-minute reset connected to meaning and progress, not a generic meditation library.. Следующий шаг: Использовать после первых P0-сессий как compare-сегмент: проверить, является ли потребность шире одного рынка или распадается на разные продукты.

**Cozy/casual progression users.** Это люди, которым близки мягкие игровые циклы, коллекционирование, daily rewards и уютная progression. Для Alina это источник языка возвращения, но есть риск выглядеть как манипулятивная retention-механика. Позиционирование: Borrow cozy progression, but avoid manipulative daily-claim monetization.. Следующий шаг: Использовать после первых P0-сессий как compare-сегмент: проверить, является ли потребность шире одного рынка или распадается на разные продукты.

Граница этого слоя принципиальна: карточки помогают начать fieldwork, но не выбирают ICP вместо реальных интервью, прототипных сессий и WTP/fatal-objection capture.

Reddit source-native слой сейчас содержит 2339 coded qualitative signal rows. Из них 1852 уникальных тредов поставлены в manual reading queue, 336 имеют P0_read_first, 238 - P1_read_next. Для P0/P1 создан capture sheet на 574 строк. Все строки по умолчанию имеют статус unread_do_not_upgrade: это специально защищает отчет от преждевременного апгрейда claims.

## 6. Что говорит Reddit/forum слой человеческим языком

Самые частые Reddit signal groups: alternative_or_tool_switching_request: 875; habit_accountability_and_progress_need: 388; identity_companion_or_avatar_need: 385; pain_or_rejection_of_overbuilt_systems: 373; reset_mindfulness_or_emotional_regulation_need: 207; unclassified_context_language: 63; spiritual_guidance_or_meaning_need: 32; gamified_progression_or_reward_need: 8. Это важно не как статистика спроса, а как словарь проблем. Например, в productivity/self-improvement тредах люди часто не просят "больше функций"; они просят меньше трения, меньше чувства вины и больше ясной связи между практикой и результатом. В mindfulness тредах часто звучит запрос на персонализацию, свежий ежедневный курс, короткий sleep/anxiety контент и отсутствие перегруза. В avatar/AI companion зоне важно отделить эмоционального компаньона от визуальной обратной связи о росте.

Из этого рождаются реальные interview prompts: "Что в последнем self-improvement app показалось тяжелым?", "Что должно произойти бесплатно, чтобы было не жалко платить?", "Аватар, который меняется после действия, мотивирует или выглядит глупо?", "Какая духовная подсказка ощущается полезной, а какая манипулятивной?" Эти вопросы уже не абстрактные: они привязаны к конкретным источникам и capture rows.

## 7. Продуктовое ядро: какая петля сейчас выглядит проверяемой

Product-core evidence и prototype stimulus переводят исследование из "рынок интересный" в "что именно тестировать". Сейчас есть 16 prototype stimulus rows и 6 scorecard metrics. MVP-гипотеза выглядит так: открыть Alina, получить персональное отражение/смысл дня, выбрать одно действие, пройти короткий reset, завершить действие, увидеть причинное изменение прогресса/аватара/identity object и получить мягкий next-day hook.

У этой петли есть сильная сторона: она объединяет meaning, action, reset и visible progress. Но у нее есть и риски. Если guidance будет слишком эзотерическим, появится недоверие. Если avatar будет декоративным, петля развалится. Если progression будет похож на game chores, пользователь почувствует манипуляцию. Если paywall появится до первого понятного value moment, доверие может не возникнуть.

## 7.1. Русские карточки продуктовой петли

Чтобы продуктовая гипотеза читалась последовательно, добавлены русские карточки 8 экранов MVP-петли. Они показывают не только экран и текст, но роль каждого шага в доказательной логике: где возникает личный смысл, где он превращается в действие, где снижается трение, где фиксируется completion, где проверяется action -> identity/avatar causality и где нельзя усиливать H4/H6 без наблюдаемого prototype evidence.

| Шаг | Экран | Роль | Gate | Sec |
| --- | --- | --- | --- | ---: |
| 1 | Daily meaning entry | Вход в личный смысл: пользователь должен почувствовать, что это не generic motivation и не жесткое предсказание. | H6: coherence of MVP loop | 20 |
| 2 | Tiny context prompt | Минимальный контекст: петля получает живую точку дня, но не превращается в длинный onboarding. | H6: coherence of MVP loop | 20 |
| 3 | One grounded action | Перевод смысла в действие: центральная проверка, что Alina не остается чтением или дневником. | H6: coherence of MVP loop | 20 |
| 4 | Short reset | Снижение трения: reset должен помогать начать действие, а не выглядеть как отдельная медитация ради медитации. | H6: coherence of MVP loop | 20 |
| 5 | Action evidence | Легкое доказательство действия: self-report должен быть достаточным и не ощущаться как контроль. | H6/H2: доказательство действия и paid-depth boundary | 20 |
| 6 | Identity/avatar feedback | Причинная видимость прогресса: ключевой момент H4/H6, где действие должно объяснять изменение identity/avatar. | H4/H6: конкурентное преимущество и продуктовая причинность | 20 |
| 7 | Next-day hook | Возврат без наказания: continuity должен поддерживать привычку без streak anxiety. | H6: return intent без punitive streak | 15 |
| 8 | Immediate value check | Проверка понимания: пользователь должен назвать интегрированную петлю своими словами. | H4/H5/H6: понимание, ICP resonance и итоговая ценность | 25 |

**1. Daily meaning entry.** Вход в личный смысл: пользователь должен почувствовать, что это не generic motivation и не жесткое предсказание. Успех: Participant can explain why this is personal rather than generic content. Провал: Participant reads it as vague astrology, generic motivation, or unsafe certainty.

**2. Tiny context prompt.** Минимальный контекст: петля получает живую точку дня, но не превращается в длинный onboarding. Успех: Participant supplies a concrete lived moment or emotional target. Провал: Participant skips because the prompt feels too broad, exposing, or irrelevant.

**3. One grounded action.** Перевод смысла в действие: центральная проверка, что Alina не остается чтением или дневником. Успех: Participant sees the action as doable and causally linked to the chosen theme. Провал: Participant sees it as a random task, chore list, or generic habit tracker.

**4. Short reset.** Снижение трения: reset должен помогать начать действие, а не выглядеть как отдельная медитация ради медитации. Успех: Participant feels the reset makes action easier without feeling clinical. Провал: Participant thinks the reset is filler or clashes with the progress mechanic.

**5. Action evidence.** Легкое доказательство действия: self-report должен быть достаточным и не ощущаться как контроль. Успех: Participant accepts lightweight self-report as enough evidence. Провал: Participant wants objective tracking, rejects proof language, or feels judged.

**6. Identity/avatar feedback.** Причинная видимость прогресса: ключевой момент H4/H6, где действие должно объяснять изменение identity/avatar. Успех: Participant understands action -> identity/avatar causality. Провал: Participant sees avatar as decoration, reward spam, or unrelated game skin.

**7. Next-day hook.** Возврат без наказания: continuity должен поддерживать привычку без streak anxiety. Успех: Participant wants to return and understands continuity. Провал: Participant feels manipulated, infantilized, or indifferent.

**8. Immediate value check.** Проверка понимания: пользователь должен назвать интегрированную петлю своими словами. Успех: Participant names the integrated loop in their own words. Провал: Participant cannot distinguish it from a generic habit tracker, meditation app, or horoscope.

Граница этого слоя: это stimulus design, а не результат пользовательской валидации. Он делает H4/H6 проверяемыми, но не закрывает их.

## 8. Что уже доказано, а что еще нельзя утверждать

На текущем этапе доказано не "Alina точно сработает", а другое: есть достаточно большой и платежеспособный adjacent landscape; есть повторяющиеся боли и jobs-to-be-done; есть narrow whitespace hypothesis; есть операционная система источников, матриц, claim boundaries, capture sheets и PDF/report artifacts. Не доказано: что пользователи действительно предпочитают эту петлю существующим решениям, что они понимают avatar/progress causality, что они готовы платить за paid depth, и что конкуренты не закрывают этот loop внутри onboarding.

| Requirement | Статус | Сила | Открытый gap |
| --- | --- | --- | --- |
| REQ_01_MASTER_PLAN | proved_v1 | strong | Keep refreshing as validation results change. |
| REQ_02_COMPETITOR_UNIVERSE | proved_30k_plus_cross_source_dedup | medium_high | The 30k lower-bound dedup target is now met; the remaining expansion gap is the upper 50k aspiration plus Product Hunt/AlternativeTo, B2B directories, Reddit mentions, and additional source-native coverage. |
| REQ_03_FIVE_MARKET_COVERAGE | proved_v1 | strong | Gaming should remain benchmark-only unless direct consumer overlap is validated. |
| REQ_04_MARKET_MONEY | supported_with_triangulated_proxy_not_final | medium_high | Market sizing is stress-tested and triangulated, but actual competitor revenue estimates, paid intelligence, and manual in-app paywall/WTP validation are still needed for final investor-grade claims. |
| REQ_05_WHITESPACE | narrow_supported_public_listing_inspected_walkthrough_open | medium | Cross-source saturation now keeps gaming/progression as benchmark-only and finds no primary market opportunity strong enough to upgrade without manual walkthrough; app/onboarding screenshots are still required. |
| REQ_06_AUDIENCE_ICP | directionally_supported_recruiting_ready | medium | Segments and recruiting assets are directional and need actual interviews/prototype/WTP validation. |
| REQ_07_COMPETITIVE_ADVANTAGE | prototype_stimulus_ready_not_validated | medium | No completed user/prototype sessions prove the loop is understood/preferred. |
| REQ_08_REPORT_PDF | polished_and_russian_narrative_argument_map_done_not_validated_final | medium_high | Polished evidence PDF, Russian narrative PDF, and Russian argument map exist as publication-ready drafts, but they are not final validated investor/user-facing proof because manual competitor inspection and prototype/user validation remain open. |
| REQ_09_VERSIONING_PROVENANCE | proved_active | high | Manifest must be regenerated after future evidence changes. |
| REQ_10_VALIDATION_GATES | proved_v1_open_gates_capture_ready | strong | Open P0 gates remain: app/onboarding walkthrough screenshots, paywall human sign-off, whitespace validation, competitive advantage prototype sessions, ICP validation. |

## 9. Следующие действия

Все H1-H6 validation gates сейчас требуют наблюдаемой валидации. Not-started gates: 6. Это не провал, а честная граница исследования: локальная evidence base готова, но реальные решения должны приниматься после ручного walkthrough и пользовательских сессий.

Практический порядок следующий. Сначала закрыть manual competitor walkthrough для P0 приложений: onboarding, first action, progress/avatar feedback, first paywall. Затем пройти paid-flow sign-off по сильным money proxy. Затем прочитать P0 Reddit threads и заполнить capture sheet: user job, alternatives, rejected patterns, paid/WTP signal, safety boundary, Alina implication. Затем провести ICP interviews по двум верхним сегментам и короткие prototype sessions. Только после этого можно обновлять H1-H6 из hold/validate в более сильные решения.

## 9.1. Русский полевой протокол

Чтобы следующий этап не остался абстрактным "надо провалидировать", создан русский полевой протокол на 7 фаз. Он переводит открытые gates в человеческую последовательность действий: сначала сохраняем сырой evidence, затем заполняем capture rows, затем обновляем claims и только после этого пересобираем PDF. Это не доказательство спроса, а инструкция, как не потерять строгость во время ручной работы.

| Фаза | Что делаем | Evidence | Правило решения |
| --- | --- | --- | --- |
| RU_FIELD_01 | Начать не с красивого вывода, а с evidence discipline | raw screenshot path / notes path / participant quote / observed score / human signoff note / final verdict | Если evidence не связан с конкретным локальным файлом или строкой capture sheet, он не может усиливать внешний claim. |
| RU_FIELD_02 | Ручной walkthrough конкурентов: проверить, нет ли скрытого прямого клона | listing screenshot / onboarding first value / first action/task / progress/avatar/identity feedback / paywall/free boundary / final directness verdict | Если хотя бы один P0 конкурент полноценно владеет петлей meaning -> action -> reset -> visible identity/progress -> return, whitespace нужно резко сузить или downgrade. |
| RU_FIELD_03 | Paid-flow signoff: отделить реальные деньги от proxy-шумов | pricing screenshot / product match / monthly/annual/trial price / first meaningful paywall boundary / human signoff | H2 можно усиливать только там, где paid evidence совпадает с конкретным продуктом или честно помечено как partial proxy. |
| RU_FIELD_04 | ICP interviews: выбрать аудиторию через недавнее поведение, а не через демографию | recent behavior / last episode / current workaround / pain intensity / language resonance / trust/safety objection / acceptable price range / quote | Primary ICP выбирается только если есть concrete recent behavior, понятная боль, резонанс языка, activation trigger и хотя бы directional WTP. |
| RU_FIELD_05 | Prototype sessions: проверить, понимают ли люди причинность петли | completion time / comprehension yes/no / meaning lift 1-5 / differentiation 1-5 / return intent 1-5 / trust objection / verbatim quote | H4/H6 остаются hold, пока ключевые scorecard metrics не получают observed participant evidence. |
| RU_FIELD_06 | Reddit/manual reading: читать как язык боли, а не как количественный спрос | source thread / user job / alternative used / rejected pattern / paid signal / safety boundary / Alina implication / quote approved for external use | Forum/Reddit evidence усиливает только language and pain claims, если нет репрезентативной выборки или подтверждения в интервью. |
| RU_FIELD_07 | Обновить gates и отчет: evidence меняет документ, а не живет рядом | updated gate status / updated hypothesis decision / changed claim boundary / regenerated PDF / git commit hash | Любой validation result должен завершаться rebuild -> audit -> commit -> push, иначе research package считается рассинхронизированным. |

## 9.2. Очередность validation tranches

Чтобы не тратить силы на широкий capture до проверки самых опасных рисков, добавлен tranche planner на 9 партий. Он начинает со stop rules и hidden-clone spike, затем ведет через top-5 competitor walkthrough, paid-flow signoff, ICP/prototype pilots, Reddit language read и только потом предлагает расширять объем.

| Seq | Tranche | Priority | Rows | Задача | Stop / downgrade |
| --- | --- | --- | --- | --- | --- |
| 0 | TRANCHE_00_STOP_RULES | P0_guardrail | 0 | Зафиксировать, что validation tranche может не только усиливать идею, но и сузить, downgrade или kill claims. | Если результат показывает скрытого full-loop clone, отсутствие WTP, непонимание causality или fatal trust objection, отчет должен стать слабее. |
| 1 | TRANCHE_01_HIDDEN_CLONE_SPIKE | P0_blocker | 5 | Сначала проверить самый опасный public-listing сигнал: Shepherd выглядит как потенциальный hidden direct clone, поэтому его нужно разобрать до других приложений. | Если Shepherd полностью владеет Alina loop с action->identity/avatar causality, H1/H3 немедленно downgrade до narrow/pivot wording. |
| 2 | TRANCHE_02_MANUAL_TOP5 | P0 | 25 | Закрыть первые 5 P0 конкурентов, потому что gate требует минимум 5 приложений с полным walkthrough. | Любой full-loop competitor переводит whitespace claim в narrower/pivot language. |
| 3 | TRANCHE_03_PAID_CONFIRMED_SPIKE | P0 | 8 | Сначала проверить подтвержденные visible pricing rows, чтобы быстро отделить real paid surfaces от proxy noise. | Если confirmed rows оказываются unrelated/parent-only/OCR noise, H2 остается proxy-only и market-money wording сужается. |
| 4 | TRANCHE_04_ICP_PILOT | P0 | 24 | Провести маленький pilot по двум сегментам до массового интервью, чтобы проверить язык, recent behavior и fatal objections. | Если оба сегмента говорят только абстрактно или отвергают action-tied identity/progress, ICP claim не усиливается. |
| 5 | TRANCHE_05_PROTOTYPE_PILOT | P0_blocker | 32 | Проверить самое хрупкое место: понимают ли люди causality между действием и avatar/progress feedback. | Если avatar/progress читается как декоративная игра или манипуляция, H4/H6 остаются hold или pivot. |
| 6 | TRANCHE_06_REDDIT_TOP25_LANGUAGE | P0 | 25 | Быстро получить живой язык rejected patterns и alternatives, не превращая Reddit в ложный количественный спрос. | Если top threads показывают, что users reject gamified identity/progress, prototype positioning must change before more sessions. |
| 7 | TRANCHE_07_EXPAND_AFTER_SPIKES | P1_after_spikes | 236 | Расширять объем только после первых spikes. Если первые партии противоречат гипотезам, сначала обновить позиционирование и вопросы. | Do not continue broad capture if early evidence shows the core loop is misunderstood or already owned. |
| 8 | TRANCHE_08_PUBLICATION_REBUILD | P0_after_observed_evidence | 0 | Закрыть цикл evidence-first: результаты должны попасть в claims, русский отчет, PDF, manifest и GitHub. | If reports do not reflect changed evidence, publication is stale and cannot be used externally. |

## 9.3. Briefing-пакеты для первых tranches

Чтобы оператор не прыгал между десятками CSV, создано 6 briefing-пакетов. Каждый пакет связывает одну tranche с конкретными capture rows, linked gates, success criteria, stop/downgrade rule и файлами, куда нужно записать результат. Это все еще не validation evidence, а рабочий маршрут для получения evidence.

| # | Tranche | Priority | Rows | Briefing | Boundary |
| --- | --- | --- | --- | --- | --- |
| 1 | TRANCHE_01_HIDDEN_CLONE_SPIKE | P0_blocker | 5 | output/validation/2026-05-31/tranche_briefings/01__tranche-01-hidden-clone-spike__briefing.md | briefing_routes_execution_only_no_claim_upgrade_without_filled_capture_rows |
| 2 | TRANCHE_02_MANUAL_TOP5 | P0 | 25 | output/validation/2026-05-31/tranche_briefings/02__tranche-02-manual-top5__briefing.md | briefing_routes_execution_only_no_claim_upgrade_without_filled_capture_rows |
| 3 | TRANCHE_03_PAID_CONFIRMED_SPIKE | P0 | 8 | output/validation/2026-05-31/tranche_briefings/03__tranche-03-paid-confirmed-spike__briefing.md | briefing_routes_execution_only_no_claim_upgrade_without_filled_capture_rows |
| 4 | TRANCHE_04_ICP_PILOT | P0 | 24 | output/validation/2026-05-31/tranche_briefings/04__tranche-04-icp-pilot__briefing.md | briefing_routes_execution_only_no_claim_upgrade_without_filled_capture_rows |
| 5 | TRANCHE_05_PROTOTYPE_PILOT | P0_blocker | 32 | output/validation/2026-05-31/tranche_briefings/05__tranche-05-prototype-pilot__briefing.md | briefing_routes_execution_only_no_claim_upgrade_without_filled_capture_rows |
| 6 | TRANCHE_06_REDDIT_TOP25_LANGUAGE | P0 | 25 | output/validation/2026-05-31/tranche_briefings/06__tranche-06-reddit-top25-language__briefing.md | briefing_routes_execution_only_no_claim_upgrade_without_filled_capture_rows |

## 9.4. Навигационный индекс пакета

Чтобы весь ресерч не распался на сотни файлов, добавлен navigation index на 38 строк. Он связывает requirement, claim, gate, tranche, briefing, source files и next action. Это не новый evidence, а карта движения по evidence package.

| Gate | H | Status | Tranche | Briefing | Next action |
| --- | --- | --- | --- | --- | --- |
| GATE_H1_MANUAL_PRODUCT_SHAPE | H1 | not_started | TRANCHE_00_STOP_RULES |  | Capture onboarding, first action, progress/avatar feedback, and paywall screenshots for the highest-risk public-listing rows. |
| GATE_H3_MANUAL_WHITESPACE | H3 | not_started | TRANCHE_00_STOP_RULES |  | Use the public-listing risk read to classify action->avatar causality in walkthrough as visible, inferred, absent, or blocked. |
| GATE_H2_PAID_FLOW | H2 | not_started | TRANCHE_00_STOP_RULES |  | Use stress-test risk rows to prioritize paid-flow inspection and prototype willingness-to-pay questions. |
| GATE_H5_ICP_RECENT_BEHAVIOR | H5 | not_started | TRANCHE_00_STOP_RULES |  | Execute the ICP validation packet for the top two segments, then update segment status and selected primary ICP. |
| GATE_H4_PROTOTYPE_ADVANTAGE | H4 | not_started | TRANCHE_00_STOP_RULES |  | Run prototype sessions with the top two ICP segments and fill the scorecard with observed results. |
| GATE_H6_PRODUCT_CORE | H6 | not_started | TRANCHE_00_STOP_RULES |  | Run prototype sessions and measure loop completion, comprehension, meaning lift, return intent, and paid-depth interest. |

## 9.5. Claim -> Evidence -> Boundary appendix

Чтобы большой русский отчет не превратился в набор красивых утверждений, добавлен claim appendix на 22 строк. Каждая строка связывает claim, статус evidence, confidence, primary metric, границу утверждения, следующий шаг и source files. Это не новый рыночный claim, а проверочный слой: он показывает, где можно говорить уверенно, где только направленно, а где gate еще открыт.

| Claim | Статус | Confidence | Метрика | Граница |
| --- | --- | --- | --- | --- |
| REQ_plan | доказано как исследовательский слой | high | master plan exists; 16 validation roadmap rows; 11 execution tasks | Needs periodic refresh as validation findings change. |
| REQ_evidence_package_traceability | доказано как исследовательский слой | high | 384 manifest rows; 0 missing artifacts | Это provenance proof, а не содержательное доказательство спроса. |
| REQ_completion_readiness_audit | доказано как исследовательский слой | high | 10 completion requirements; 6 not fully proved/final | Several objective requirements remain partial, directional, draft, or validation-ready rather than fully complete. |
| REQ_hypothesis_decision_matrix | доказано как исследовательский слой | high | 6 hypothesis decision rows; 6 hold/validate; 0 go; 0 stop/pivot | Decision rows remain validation gates, not final proof: competitor walkthroughs, paywall sign-off, ICP interviews, and prototype sessions are still open. |
| REQ_market_money_triangulation | доказано как исследовательский слой | medium_high | 6 market rows; 3 strong and 1 medium directional money cases | Нельзя читать proxy как выручку Alina; нужны paid-flow signoff и WTP evidence. |
| REQ_p0_validation_command_center | доказано как исследовательский слой | high | 75 command rows; 6 blocker rows; 52 P0 rows | Это операционная готовность, не observed validation evidence. |
| REQ_p0_validation_field_guide | доказано как исследовательский слой | high | 8 field guide sections; 75 command rows referenced | Это операционная готовность, не observed validation evidence. |
| REQ_validation_evidence_workspace | доказано как исследовательский слой | high | 5 workspace lanes; output/validation README and templates generated | Это операционная готовность, не observed validation evidence. |
| REQ_validation_batch_01 | доказано как исследовательский слой | high | 6 batch rows; 6 not started; 0 local artifacts linked | Это операционная готовность, не observed validation evidence. |
| REQ_validation_batch_02 | доказано как исследовательский слой | high | 52 batch rows; 52 not started; 12 local artifacts linked | Это операционная готовность, не observed validation evidence. |
| REQ_validation_batch_03 | доказано как исследовательский слой | high | 17 batch rows; 17 not started; 17 local artifacts linked | Это операционная готовность, не observed validation evidence. |
| REQ_validation_evidence_rollup | доказано как исследовательский слой | high | 75 command rows; 75 notes present; 29 local artifacts linked | Это операционная готовность, не observed validation evidence. |
| REQ_validation_gate_calculator | доказано как исследовательский слой | high | 6 gate rows; 0 pass-ready; 0 in-progress; 6 not started; 0 downgrade/kill triggered | Это операционная готовность, не observed validation evidence. |
| REQ_competitor_universe | доказано как исследовательский слой | medium_high | 61345 cross-source raw rows; 33718 cross-source dedup rows; 39 coverage cells; 11 strong and 12 medium source/market cells | The 30k lower-bound dedup target is met; upper-bound 50k expansion and Product Hunt/AlternativeTo, Microsoft Store, B2B directories, Reddit mentions, and additional source-native coverage remain backlog. |
| H1_product_shape_exists | готово к проверке, gate открыт | medium | 100 top-candidate rows; 90 primary apps; 12 P0 inspection targets; 12 public listings inspected | Нельзя усиливать claim без app/onboarding walkthrough и скриншотов причинной петли. |
| H2_markets_have_money | поддержано направленно, но не финально доказано | medium | intersection SAM base USD 201960000; 12 market sources confidence-reviewed; 6 assumption rows; 6 stress scenarios; 22 strong competitor money proxies | Нельзя читать proxy как выручку Alina; нужны paid-flow signoff и WTP evidence. |
| H2_paywall_visible_evidence | поддержано направленно, но не финально доказано | medium_low | 2/29 screenshots confirm visible public pricing; 8 partial paid-surface examples | Нельзя читать proxy как выручку Alina; нужны paid-flow signoff и WTP evidence. |
| H3_whitespace_exists | поддержано направленно, но не финально доказано | medium | 1/100 strict behavior-tied progression signals; 6 cross-source saturation markets; 2 benchmark-only markets; 12 P0 apps queued | Нельзя усиливать claim без app/onboarding walkthrough и скриншотов причинной петли. |
| H4_competitive_advantage_plausible | готово к проверке, gate открыт | medium | 1 direct reference competitor; 45 high-threat competitors; 8 prototype screens; 6 success/kill metrics | Нельзя считать продуктовое преимущество доказанным без prototype sessions и observed scorecard. |
| H5_shared_audience_exists | поддержано направленно, но не финально доказано | medium | 20492 audience signal rows; 294 community/referral rows; 2339 coded Reddit mention rows; 1852 Reddit manual-read queue rows; 574 Reddit capture rows; 6 ICP segment hypotheses; 36 ICP validation tests; 24 ICP recruiting bridge rows | Нельзя превращать directional language signals в финальную персону без интервью. |
| H6_product_core_defined | поддержано направленно, но не финально доказано | medium | 12552 feature matrix rows; 100 product-core rows; 8 prototype screens | Нельзя считать продуктовое преимущество доказанным без prototype sessions и observed scorecard. |
| REQ_final_artifacts_versioned | доказано как исследовательский слой | high | current branch pushed through latest commit | Это provenance proof, а не содержательное доказательство спроса. |

## 9.6. Source provenance index

Чтобы было понятно, откуда берутся источники и какие слои можно цитировать, добавлен provenance index на 16 строк. Он связывает manifest, source-reference artifacts, market source registry и source discovery. Важно: provenance доказывает трассируемость данных, но не превращает proxy в финальное доказательство спроса.

| ID | Слой / источник | Rows | Source refs | Граница |
| --- | --- | ---: | ---: | --- |
| PROV_001 | Локальный манифест артефактов | 387 | 224356 | Manifest доказывает наличие и форму файлов, но не доказывает, что рынок купит продукт или что гипотеза валидирована. |
| PROV_002 | Raw/processed source-reference слой | 67 | 224356 | Source refs показывают provenance, но не заменяют ручную проверку качества страницы, скриншота, onboarding flow или participant quote. |
| PROV_003 | Market source registry для TAM/SAM/SOM | 12 | 12 | Часть market report pages paywalled или broad-category; использовать как диапазоны и proxy, не как прогноз выручки Alina. |
| PROV_004 | Research source discovery | 12 | 12 | Discovery row не равен подтвержденному источнику; claim можно усиливать только после extraction/confidence review. |
| SRC_SRC-MKT-0001 | gaming / market_forecast_page | 1 | 1 | Use as cross-check, not sole source. |
| SRC_SRC-MKT-0002 | gaming / analyst_pdf | 1 | 1 | Useful for monetization and distribution, not full Alina direct TAM. |
| SRC_SRC-MKT-0003 | mindfulness / market_report_page | 1 | 1 | Good direct category anchor; methodology paywalled. |
| SRC_SRC-MKT-0004 | avatar_identity / market_report_page | 1 | 1 | Broad enterprise+consumer market; must discount for consumer self-improvement/avatar app use case. |
| SRC_SRC-MKT-0005 | coaching / industry_pdf | 1 | 1 | Trend anchor; needs separate TAM/revenue source. |
| SRC_SRC-MKT-0006 | astrology_esoterics / market_report_page | 1 | 1 | Need direct values and cross-checks from multiple astrology sources. |
| SRC_SRC-MKT-0007 | astrology_esoterics / market_report_page | 1 | 1 | High estimate anchor; likely broad definition. |
| SRC_SRC-MKT-0008 | astrology_esoterics / market_report_page | 1 | 1 | Large CAGR; use for range only. |

## 10. Финальный текущий verdict

Текущий verdict: продолжать, но не переобещать. Alina выглядит как исследовательски перспективная ставка на стыке digital ritual, self-improvement, reset и identity/progress feedback. Самая сильная формулировка возможности: не универсальный комбайн, а короткая ежедневная трансформационная петля, где действие меняет видимый образ прогресса. Самая большая опасность: сделать слишком широкий продукт, который будет одновременно слабым meditation app, слабым habit tracker, слабым astrology app и слабым avatar toy. Поэтому следующий этап должен быть не расширением ради расширения, а жесткой проверкой центральной петли на реальных конкурентных экранах и реальных людях.

## Ключевые локальные файлы

- `data_processed/evidence_artifact_manifest.csv`
- `data_processed/research_completion_audit.csv`
- `data_processed/evidence_claim_register.csv`
- `data_processed/research_navigation_index.csv`
- `data_processed/reddit_manual_reading_capture_sheet.csv`
- `data_processed/russian_narrative_evidence_map.csv`
- `data_processed/russian_market_deep_dives.csv`
- `data_processed/russian_claim_evidence_appendix.csv`
- `data_processed/russian_source_provenance_index.csv`
- `data_processed/russian_competitor_battlecards.csv`
- `data_processed/russian_icp_battlecards.csv`
- `data_processed/russian_product_loop_cards.csv`
- `data_processed/russian_validation_fieldbook.csv`
- `data_processed/validation_tranche_planner.csv`
- `data_processed/validation_tranche_briefing_index.csv`
- `data_processed/validation_gate_calculator.csv`
- `reports/alina-russian-narrative-report-v1.md`
- `output/pdf/alina-russian-narrative-report-v1.pdf`
