# Alina Research. Русский повествовательный отчет V1

Собрано: 2026-05-31T11:30:13.318Z

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
| 08_claim_status | Текущий честный verdict: продолжать исследование, но не переобещать. Evidence base сильная как подготовка, но не финальная validation proof. | 10 completion requirements; 5 not fully proved/final; 6 validation gates; 6 not started gates; 381 manifest artifacts | Не отмечать цель complete: manual competitor walkthroughs, paid signoff, ICP interviews and prototype sessions remain open. |
| 09_validation_operating_system | Исследование уже превращено в операционную систему проверки: гипотезы, gates, capture sheets и dashboard показывают, какие claims можно усиливать, а какие нужно держать. | 6 validation gates; 6 not-started gates; 10 completion audit rows | Наличие validation OS не равно завершенной валидации; это подготовка к disciplined execution. |
| 10_provenance_and_versioning | Все ключевые данные должны оставаться локально воспроизводимыми и версионированными, иначе большой ресерч быстро превращается в набор непроверяемых утверждений. | 381 manifest rows; local artifact hashes and row counts tracked; GitHub push used as persistence layer | Manifest подтверждает наличие и форму артефактов, но не заменяет human validation содержательных выводов. |
| 11_report_style | Финальный документ должен читаться как русское последовательное повествование: данные идут внутри рассказа, а не заменяют его. | Russian narrative report generated; evidence map is used as the chapter-level argument backbone; PDF output exists through the report pipeline | Красивый русский текст не должен усиливать недоказанные claims; каждое сильное утверждение остается связано с boundary. |

## 0. Исполнительный рассказ

Если читать весь ресерч как одну историю, она выглядит так. Мы начали с осторожной продуктовой гипотезы: возможно, существует место для приложения, которое соединяет личный смысл, маленькое действие, короткий reset и видимый прогресс в одну ежедневную петлю. Чтобы не строить это на вкусе или интуиции, мы развернули карту соседних рынков и получили 33718 dedup rows в cross-source universe, 100 строк top-candidate review, 20492 audience signal rows и 381 локальных артефактов в manifest. Это уже достаточно большой evidence warehouse, чтобы видеть рельеф рынка, но недостаточно, чтобы объявить продукт доказанным.

Главное, что стало понятнее: Alina не должна соревноваться с каждым meditation app, habit tracker, astrology app, avatar generator или coaching product по отдельности. Сильнее выглядит узкая ставка на причинную петлю: пользователь получает персональное отражение дня, выбирает одно действие, проходит reset, завершает шаг и видит, что прогресс или образ себя изменился именно из-за действия. В публичных данных эта комбинация пока выглядит редкой: в top-100 найдено 1/100 строгих behavior-tied progression signals, но 12 P0 конкурентов все еще требуют настоящего walkthrough, потому что скрытая петля может жить внутри onboarding, paywall или first-session experience.

Деньги в adjacent landscape видны, но их нужно держать честно. В market-money layer сейчас 3 strong directional cases, 1 medium directional case и 22 strong competitor revenue proxies. Базовый intersection SAM в модели равен $201,960,000. Это не прогноз выручки Alina и не обещание спроса; это аргумент, что рядом существуют платные привычки пользователей, которые стоит проверить через paid-flow signoff и willingness-to-pay вопросы.

Аудиторно наиболее полезная формулировка сейчас не демографическая, а поведенческая: digital ritual users. Это люди, которые уже используют приложения, чтобы регулировать состояние, видеть прогресс, поддерживать идентичность и возвращаться к ощущению изменения. Самый сильный directional ICP сейчас - Spiritual self-improvers, но ни один ICP нельзя считать выбранным до интервью и прототипных сессий. Поэтому финальный смысл текущего пакета простой: у нас есть масштабная карта, гипотезы, источники, матрицы и рабочая validation system; следующий скачок качества появится только после наблюдаемого evidence на экранах конкурентов и у живых пользователей.

## 1. Откуда мы начали

Исходная продуктовая идея была не в том, чтобы сделать еще один трекер привычек, еще один mindfulness-продукт или еще одно эзотерическое приложение. Интуиция была шире: есть люди, которым нужен ежедневный ритуал личного смысла, короткий reset, понятный следующий шаг и ощущение, что они меняются. Поэтому исследование разложено на пять направлений: coaching/self-improvement, mindfulness/reset, avatar/identity, astrology/esoterics и gaming/progression как источник механик, но не обязательно как основной рынок.

На уровне данных это уже не маленькая записка. Сейчас в локальном пакете 381 артефакта, missing в manifest: 0. Cross-source universe содержит 61345 нормализованных raw rows и 33718 dedup rows. Это дает масштабную карту соседних продуктов, но сама по себе карта не доказывает спрос на Alina. Она нужна, чтобы не спорить вслепую.

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

Reddit source-native слой сейчас содержит 2339 coded qualitative signal rows. Из них 1852 уникальных тредов поставлены в manual reading queue, 336 имеют P0_read_first, 238 - P1_read_next. Для P0/P1 создан capture sheet на 574 строк. Все строки по умолчанию имеют статус unread_do_not_upgrade: это специально защищает отчет от преждевременного апгрейда claims.

## 6. Что говорит Reddit/forum слой человеческим языком

Самые частые Reddit signal groups: alternative_or_tool_switching_request: 875; habit_accountability_and_progress_need: 388; identity_companion_or_avatar_need: 385; pain_or_rejection_of_overbuilt_systems: 373; reset_mindfulness_or_emotional_regulation_need: 207; unclassified_context_language: 63; spiritual_guidance_or_meaning_need: 32; gamified_progression_or_reward_need: 8. Это важно не как статистика спроса, а как словарь проблем. Например, в productivity/self-improvement тредах люди часто не просят "больше функций"; они просят меньше трения, меньше чувства вины и больше ясной связи между практикой и результатом. В mindfulness тредах часто звучит запрос на персонализацию, свежий ежедневный курс, короткий sleep/anxiety контент и отсутствие перегруза. В avatar/AI companion зоне важно отделить эмоционального компаньона от визуальной обратной связи о росте.

Из этого рождаются реальные interview prompts: "Что в последнем self-improvement app показалось тяжелым?", "Что должно произойти бесплатно, чтобы было не жалко платить?", "Аватар, который меняется после действия, мотивирует или выглядит глупо?", "Какая духовная подсказка ощущается полезной, а какая манипулятивной?" Эти вопросы уже не абстрактные: они привязаны к конкретным источникам и capture rows.

## 7. Продуктовое ядро: какая петля сейчас выглядит проверяемой

Product-core evidence и prototype stimulus переводят исследование из "рынок интересный" в "что именно тестировать". Сейчас есть 16 prototype stimulus rows и 6 scorecard metrics. MVP-гипотеза выглядит так: открыть Alina, получить персональное отражение/смысл дня, выбрать одно действие, пройти короткий reset, завершить действие, увидеть причинное изменение прогресса/аватара/identity object и получить мягкий next-day hook.

У этой петли есть сильная сторона: она объединяет meaning, action, reset и visible progress. Но у нее есть и риски. Если guidance будет слишком эзотерическим, появится недоверие. Если avatar будет декоративным, петля развалится. Если progression будет похож на game chores, пользователь почувствует манипуляцию. Если paywall появится до первого понятного value moment, доверие может не возникнуть.

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
- `data_processed/russian_validation_fieldbook.csv`
- `data_processed/validation_tranche_planner.csv`
- `data_processed/validation_tranche_briefing_index.csv`
- `data_processed/validation_gate_calculator.csv`
- `reports/alina-russian-narrative-report-v1.md`
- `output/pdf/alina-russian-narrative-report-v1.pdf`
