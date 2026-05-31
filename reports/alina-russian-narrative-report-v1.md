# Alina Research. Русский повествовательный отчет V1

Собрано: 2026-05-31T18:23:11.719Z

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

Если читать весь ресерч как одну историю, она выглядит так. Мы начали с осторожной продуктовой гипотезы: возможно, существует место для приложения, которое соединяет личный смысл, маленькое действие, короткий reset и видимый прогресс в одну ежедневную петлю. Чтобы не строить это на вкусе или интуиции, мы развернули карту соседних рынков и получили 37176 dedup rows в cross-source universe, 100 строк top-candidate review, 20492 audience signal rows и 525 локальных артефактов в manifest. Это уже достаточно большой evidence warehouse, чтобы видеть рельеф рынка, но недостаточно, чтобы объявить продукт доказанным.

Главное, что стало понятнее: Alina не должна соревноваться с каждым meditation app, habit tracker, astrology app, avatar generator или coaching product по отдельности. Сильнее выглядит узкая ставка на причинную петлю: пользователь получает персональное отражение дня, выбирает одно действие, проходит reset, завершает шаг и видит, что прогресс или образ себя изменился именно из-за действия. В публичных данных эта комбинация пока выглядит редкой: в top-100 найдено 1/100 строгих behavior-tied progression signals, но 12 P0 конкурентов все еще требуют настоящего walkthrough, потому что скрытая петля может жить внутри onboarding, paywall или first-session experience.

Деньги в adjacent landscape видны, но их нужно держать честно. В market-money layer сейчас 3 strong directional cases, 1 medium directional case и 22 strong competitor revenue proxies. Базовый intersection SAM в модели равен $201,960,000. Это не прогноз выручки Alina и не обещание спроса; это аргумент, что рядом существуют платные привычки пользователей, которые стоит проверить через paid-flow signoff и willingness-to-pay вопросы.

Аудиторно наиболее полезная формулировка сейчас не демографическая, а поведенческая: digital ritual users. Это люди, которые уже используют приложения, чтобы регулировать состояние, видеть прогресс, поддерживать идентичность и возвращаться к ощущению изменения. Самый сильный directional ICP сейчас - Spiritual self-improvers, но ни один ICP нельзя считать выбранным до интервью и прототипных сессий. Поэтому финальный смысл текущего пакета простой: у нас есть масштабная карта, гипотезы, источники, матрицы и рабочая validation system; следующий скачок качества появится только после наблюдаемого evidence на экранах конкурентов и у живых пользователей.

## 1. Откуда мы начали

Исходная продуктовая идея была не в том, чтобы сделать еще один трекер привычек, еще один mindfulness-продукт или еще одно эзотерическое приложение. Интуиция была шире: есть люди, которым нужен ежедневный ритуал личного смысла, короткий reset, понятный следующий шаг и ощущение, что они меняются. Поэтому исследование разложено на пять направлений: coaching/self-improvement, mindfulness/reset, avatar/identity, astrology/esoterics и gaming/progression как источник механик, но не обязательно как основной рынок.

На уровне данных это уже не маленькая записка. Сейчас в локальном пакете 525 артефакта, missing в manifest: 0. Cross-source universe содержит 68085 нормализованных raw rows и 37176 dedup rows. Это дает масштабную карту соседних продуктов, но сама по себе карта не доказывает спрос на Alina. Она нужна, чтобы не спорить вслепую.

| Слой | Объем | Что это значит |
| --- | ---: | --- |
| Dedup competitor/source universe | 37176 | нижняя граница 30k+ уже закрыта на cross-source уровне |
| Coverage cells | 44 | покрытие рынков источниками, не один канал |
| Top-100 reviewed rows | 100 | AI-assisted конкурентный обзор, требует manual validation |
| Validation capture rows | 858 | готовые строки для ручной фиксации доказательств |

## 1.1. Масштаб источников: что уже закрыто, а что нет

После Steam deep-tag expansion важно говорить точнее. Масштаб уже не выглядит маленьким: raw cross-source universe прошел 50k, а dedup universe закрыл 30k+ и находится в рабочей зоне 30k-40k. Но это не означает, что можно написать "50k уникальных конкурентов доказаны". Dedup 50k остается открытой верхней целью. Эта граница важна для честности отчета: масштаб discovery большой, но H1-H6 закрываются не количеством строк, а наблюдаемыми walkthrough, paywall signoff, интервью и прототипными сессиями.

| Milestone | Status | Metric | Threshold | Как читать | Граница |
| --- | --- | ---: | --- | --- | --- |
| RAW_50K_SOURCE_SCALE | proved | 68085 | >= 50000 raw normalized source rows | Raw cross-source universe уже прошел 50k: 68,085 строк. Это закрывает масштаб discovery/source-map, но не означает 68,085 уникальных прямых конкурентов. | Raw rows сохраняют повторы по источникам, странам, запросам, тегам и форумным упоминаниям; это слой покрытия, а не dedup competitor proof. |
| DEDUP_30K_LOWER_BOUND | proved | 37176 | >= 30000 dedup competitor/source rows | Dedup cross-source universe закрыл нижнюю границу 30k: 37,176 строк. | Dedup снижает дубли, но часть строк остается benchmark/context evidence, особенно Steam/itch/gaming mechanics и Reddit mentions. |
| DEDUP_30_40K_BAND | proved_inside_band | 37176 | 30000-40000 dedup competitor/source rows | Dedup universe сейчас находится внутри рабочей зоны 30k-40k: 37,176 строк. | Это достаточный масштаб для картирования соседних рынков, но не финальный validation proof по H1-H6. |
| DEDUP_50K_UPPER_ASPIRATION | open | 37176 | >= 50000 dedup competitor/source rows | Dedup 50k aspiration еще открыт: 37,176 строк, gap 12,824 строк. | Нельзя писать, что 50k уникальных/dedup конкурентов уже доказаны; доказаны raw 50k и dedup 30k+. |
| SOURCE_QUALITY_BOUNDARY | explicit | 16 summary rows; 44 coverage cells; 11 strong; 12 medium | quality boundary stated | Масштаб источников полезен для discovery, saturation и поиска белого пятна, но качество claim зависит от типа источника. | App Store/Google Play/desktop/web extensions ближе к конкурентам; Steam/itch часто benchmark/mechanic; Reddit/forum чаще VOC/context до manual read. |
| NEXT_SOURCE_LANES | prioritized | 10 backlog lanes | non-search-heavy next expansion lanes | Следующий рост лучше делать не через широкие поисковики, а через source-native/direct lanes: B2B directories, company positioning pages, дополнительные desktop/browser stores, curated Product Hunt/AlternativeTo exports если доступны без Cloudflare-блокировки. | Product Hunt и AlternativeTo direct/sitemap попытки ранее уперлись в Cloudflare 403; этот факт не надо обходить тяжелым search-engine crawl без отдельного решения. |

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

## 2.0. Русский TAM/SAM/SOM playbook

Чтобы рыночная часть не выглядела как одна магическая цифра, добавлен русский sizing playbook на 6 market rows. Он показывает формулу по каждому рынку: TAM base, serviceable share, SAM base, confidence/directness weighted SAM, money verdict, caveat и следующий proof. Главная логика: цифры нужны для приоритизации и проверки H2, а не для заявления "Alina заработает столько-то".

| Pillar | Directness | SAM base | Weighted SAM | Money verdict | Как читать |
| --- | --- | --- | --- | --- | --- |
| gaming | benchmark: деньги и retention-паттерны видны, но это не прямой TAM Alina | $671,100,000 | $469,770,000 | benchmark_money_visible_not_direct_tam | Держать вне прямого TAM. Использовать как benchmark механик прогресса, retention и monetization patterns. |
| astrology_esoterics | direct adjacent: можно использовать как рыночный якорь с caveats | $374,400,000 | $262,080,000 | strong_directional_money_case | Деньги видны направленно: можно использовать для приоритизации validation, но не как финальную выручку Alina. |
| avatar_identity | broad adjacent: нужен сильный consumer/self-improvement discount | $420,000,000 | $294,000,000 | strong_directional_money_case | Деньги видны направленно: можно использовать для приоритизации validation, но не как финальную выручку Alina. |
| coaching | direct adjacent: можно использовать как рыночный якорь с caveats | $300,000,000 | $210,000,000 | medium_directional_money_case | Использовать осторожно как range/context до ручного paywall/product-match evidence. |
| mindfulness | direct adjacent: можно использовать как рыночный якорь с caveats | $252,000,000 | $176,400,000 | strong_directional_money_case | Деньги видны направленно: можно использовать для приоритизации validation, но не как финальную выручку Alina. |
| intersection | intersection model: расчетная зона Alina, не внешний market report | $201,960,000 | $80,784,000 | insufficient_money_case | Читать только как modeled SAM для проверки гипотезы. Нельзя использовать как revenue forecast без ICP/WTP и paid-flow validation. |

**gaming.** SAM base = TAM base $134,220,000,000 * serviceable share 0.50% = $671,100,000. Weighted SAM applies confidence/directness weight 0.7 -> $469,770,000. Caveat: Public IAP/review/install/paywall proxies cannot prove revenue; use for triangulation and validation prioritization. Следующий proof: Keep as monetization/retention benchmark; do not count as direct Alina TAM unless direct audience overlap is validated.

**astrology_esoterics.** SAM base = TAM base $6,240,000,000 * serviceable share 6.0% = $374,400,000. Weighted SAM applies confidence/directness weight 0.7 -> $262,080,000. Caveat: Public IAP/review/install/paywall proxies cannot prove revenue; use for triangulation and validation prioritization. Следующий proof: Run paid-flow signoff and WTP prototype probes before using as final product-level money proof.

**avatar_identity.** SAM base = TAM base $8,400,000,000 * serviceable share 5.0% = $420,000,000. Weighted SAM applies confidence/directness weight 0.7 -> $294,000,000. Caveat: Public IAP/review/install/paywall proxies cannot prove revenue; use for triangulation and validation prioritization. Следующий proof: Run paid-flow signoff and WTP prototype probes before using as final product-level money proof.

**coaching.** SAM base = TAM base $5,000,000,000 * serviceable share 6.0% = $300,000,000. Weighted SAM applies confidence/directness weight 0.7 -> $210,000,000. Caveat: Public IAP/review/install/paywall proxies cannot prove revenue; use for triangulation and validation prioritization. Следующий proof: Add manual paywall/product-match evidence and competitor revenue/intelligence before investor-grade claims.

**mindfulness.** SAM base = TAM base $1,680,000,000 * serviceable share 15.0% = $252,000,000. Weighted SAM applies confidence/directness weight 0.7 -> $176,400,000. Caveat: Public IAP/review/install/paywall proxies cannot prove revenue; use for triangulation and validation prioritization. Следующий proof: Run paid-flow signoff and WTP prototype probes before using as final product-level money proof.

**intersection.** SAM base = TAM base $1,346,400,000 * serviceable share 15.0% = $201,960,000. Weighted SAM applies confidence/directness weight 0.4 -> $80,784,000. Caveat: Range-based modeled intersection. Must be validated with competitor revenue, user interviews, and conversion tests. Следующий proof: Validate intersection through ICP/WTP and competitor bottom-up proxies; keep modeled SAM as range-only.

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

## 2.2. Русские paid-flow dossiers

Чтобы H2 не держалась только на TAM/SAM/SOM, IAP и web-pricing proxy, добавлены paid-flow dossiers на 10 продуктов. Они показывают, где есть public-pricing prefill, какие 4 скрина надо сохранить, как проверить product-match, где лежит first meaningful paywall boundary и когда H2 можно усилить или, наоборот, ослабить.

| # | Product | Market | Prefill | Price | Slots | Done |
| --- | --- | --- | --- | --- | ---: | ---: |
| 1 | Character AI: Chat, Talk, Text | avatar_identity | confirmed_visible_public_pricing | $9.99/$94.99 | 4 | 0 |
| 2 | Meditopia: Sleep & Meditation | mindfulness | confirmed_visible_public_pricing | $3.50 | 4 | 0 |
| 3 | Carrom Pool: Disc Game | gaming | partial_paid_surface_language |  | 4 | 0 |
| 4 | Avatar World ® | avatar_identity | partial_paid_surface_language |  | 4 | 0 |
| 5 | AstroSage Kundli: AI Astrology | astrology_esoterics | partial_paid_surface_language |  | 4 | 0 |
| 6 | NBA 2K Mobile Basketball Game | gaming | visible_price_context_uncertain | $20 | 4 | 0 |
| 7 | Everskies: Virtual Dress up | avatar_identity | partial_paid_surface_language |  | 4 | 0 |
| 8 | Mindfulness with Petit BamBou | mindfulness | partial_paid_surface_language |  | 4 | 0 |
| 9 | Monster Girl Maker 2 | avatar_identity | visible_price_context_uncertain | $9 | 4 | 0 |
| 10 | Monster Girl Maker | avatar_identity | visible_price_context_uncertain | $9 | 4 | 0 |

**1. Character AI: Chat, Talk, Text.** сильный public-pricing сигнал, но нужен human product-match и paid-boundary signoff Upgrade: если price, product-match и paid-boundary подтверждены человеком, H2 получает stronger paid-surface support; если нет, сигнал остается public-pricing proxy.

**2. Meditopia: Sleep & Meditation.** сильный public-pricing сигнал, но нужен human product-match и paid-boundary signoff Upgrade: если price, product-match и paid-boundary подтверждены человеком, H2 получает stronger paid-surface support; если нет, сигнал остается public-pricing proxy.

**3. Carrom Pool: Disc Game.** слабый или смешанный public signal: использовать только как очередь для проверки, не как proof денег Upgrade: если human review не подтверждает product-match, убрать этот источник из H2 support или понизить до context-only.

**4. Avatar World ®.** слабый или смешанный public signal: использовать только как очередь для проверки, не как proof денег Upgrade: если human review не подтверждает product-match, убрать этот источник из H2 support или понизить до context-only.

**5. AstroSage Kundli: AI Astrology.** слабый или смешанный public signal: использовать только как очередь для проверки, не как proof денег Upgrade: если human review не подтверждает product-match, убрать этот источник из H2 support или понизить до context-only.

Граница этого слоя: paid-flow dossier делает H2 проверяемой, но не заменяет human signoff. Пока completed slots равны нулю, деньги можно описывать как range/proxy-supported, а не как доказанную willingness-to-pay для Alina.

## 2.3. Локальный paid-flow signoff по сохраненным скриншотам

Первый маленький paid-flow spike теперь не только запланирован, но и частично просмотрен по локальным screenshot artifacts. Заполнено 28 observed rows: Character AI/c.ai+ можно читать как подтвержденную public-web subscription surface, а Meditopia нужно читать осторожнее - это Meditopia-branded B2B/EAP pricing, не consumer app paywall. Поэтому H2 становится не "доказанной", а in-progress: появились наблюдаемые платные поверхности, но willingness-to-pay для Alina, in-app timing и consumer conversion все еще открыты.

| Capture | Product | Strength | Что видно | Граница |
| --- | --- | --- | --- | --- |
| PF_01_PF_S01 | Character AI: Chat, Talk, Text | confirmed_public_web | $9.99/month; $94.99/year; annual page also shows $119.88 struck-through reference price | Supports adjacent paid-behavior / paid-depth proxy for AI companion/avatar-identity market; does not prove Alina WTP or in-app conversion. |
| PF_01_PF_S02 | Character AI: Chat, Talk, Text | partial_boundary_unknown | Public subscribe page is visible independently; first meaningful in-app value boundary was not inspected. | Use as public paid-surface evidence only, not as first-value/paywall-timing proof. |
| PF_01_PF_S03 | Character AI: Chat, Talk, Text | confirmed_public_web | Paid tier unlocks: better memory, ad-free chats, bonus Charms, latest/best models, no slow mode, unlimited voice calls, more muted words/voice memos/go-ons/swipes, customization. | Useful for paid-depth analogs around memory, personalization, voice, and premium model access. |
| PF_01_PF_S04 | Character AI: Chat, Talk, Text | confirmed_public_web | Same public page brands the paid tier as c.ai+ and includes Character AI site footer links. | Product-match support for public pricing row; still not a substitute for in-app subscription confirmation. |
| PF_02_PF_S01 | Meditopia: Sleep & Meditation | partial_b2b_price | $3.50 per user per month (PUPM) average price shown for Essential Care on Meditopia business pricing page. | Supports enterprise wellness monetization proxy only; do not use as direct consumer app WTP proof. |
| PF_02_PF_S02 | Meditopia: Sleep & Meditation | partial_boundary_unknown | Business pricing page with Calculate Pricing / Book a Demo CTAs; consumer first meaningful paywall boundary not inspected. | Use only as B2B paid-surface evidence; keep consumer paywall boundary open. |
| PF_02_PF_S03 | Meditopia: Sleep & Meditation | partial_b2b_feature_depth | Essential Care includes personalized wellbeing library with AI support, 10,000+ resources, web/mobile/smartwatch access; Total Care adds 1:1 expert sessions, integrations, social features. | Use as wellness/EAP paid-depth benchmark; do not treat as direct Alina consumer subscription analog. |
| PF_02_PF_S04 | Meditopia: Sleep & Meditation | partial_b2b_product_match | Same Meditopia brand, business navigation, and EAP pricing page; product family matches, consumer app plan does not. | Use as same-brand enterprise monetization context; keep consumer product-match and WTP open. |
| PF_03_PF_S01 | Carrom Pool: Disc Game | reviewed_no_clean_public_price | Saved Miniclip public page shows games/company context and cookie/privacy language, but no clean Carrom Pool price or plan term. | Use only as a weak gaming monetization cue from a parent-brand page; do not use as Carrom Pool pricing proof. |
| PF_03_PF_S02 | Carrom Pool: Disc Game | reviewed_no_clean_public_price | First meaningful in-app paywall boundary was not inspected in the local screenshot. | Use only as a weak public paid-surface cue; keep first-value/paywall timing open. |
| PF_03_PF_S03 | Carrom Pool: Disc Game | reviewed_no_clean_public_price | Paid-feature depth could not be cleanly reconstructed from the saved public screenshot. | Do not use as plan-depth proof until app/store or in-app paywall evidence is captured. |
| PF_03_PF_S04 | Carrom Pool: Disc Game | reviewed_no_clean_public_price | Human review completed from saved screenshot/OCR; product-match remains conservative because the evidence is public web only. | Use only as a weak gaming monetization cue from a parent-brand page; do not use as Carrom Pool pricing proof. |
| PF_04_PF_S01 | Avatar World ® | reviewed_no_clean_public_price | Saved Pazu Games page shows Avatar World portfolio context and scale claims, but no visible price or subscription term. | Use only as avatar-market product context; do not use as Avatar World pricing or paid-depth proof. |
| PF_04_PF_S02 | Avatar World ® | reviewed_no_clean_public_price | First meaningful in-app paywall boundary was not inspected in the local screenshot. | Use only as a weak public paid-surface cue; keep first-value/paywall timing open. |
| PF_04_PF_S03 | Avatar World ® | reviewed_no_clean_public_price | Paid-feature depth could not be cleanly reconstructed from the saved public screenshot. | Do not use as plan-depth proof until app/store or in-app paywall evidence is captured. |
| PF_04_PF_S04 | Avatar World ® | reviewed_no_clean_public_price | Human review completed from saved screenshot/OCR; product-match remains conservative because the evidence is public web only. | Use only as avatar-market product context; do not use as Avatar World pricing or paid-depth proof. |
| PF_05_PF_S01 | AstroSage Kundli: AI Astrology | reviewed_no_clean_public_price | Saved AstroSage page shows astrology services and “Buy Brihat Kundli”/buy-now language, but no clean app subscription price. | Use only as astrology monetization context; do not use as app paywall, plan-depth, or WTP proof. |
| PF_05_PF_S02 | AstroSage Kundli: AI Astrology | reviewed_no_clean_public_price | First meaningful in-app paywall boundary was not inspected in the local screenshot. | Use only as a weak public paid-surface cue; keep first-value/paywall timing open. |
| PF_05_PF_S03 | AstroSage Kundli: AI Astrology | reviewed_no_clean_public_price | Paid-feature depth could not be cleanly reconstructed from the saved public screenshot. | Do not use as plan-depth proof until app/store or in-app paywall evidence is captured. |
| PF_05_PF_S04 | AstroSage Kundli: AI Astrology | reviewed_no_clean_public_price | Human review completed from saved screenshot/OCR; product-match remains conservative because the evidence is public web only. | Use only as astrology monetization context; do not use as app paywall, plan-depth, or WTP proof. |
| PF_07_PF_S01 | Everskies: Virtual Dress up | reviewed_no_clean_public_price | Saved Everskies page shows logged-out public site context and mentions StarPass/Stars, but no clean price or plan term. | Use as weak avatar-economy paid-surface cue; do not use as pricing or conversion proof. |
| PF_07_PF_S02 | Everskies: Virtual Dress up | reviewed_no_clean_public_price | First meaningful in-app paywall boundary was not inspected in the local screenshot. | Use only as a weak public paid-surface cue; keep first-value/paywall timing open. |
| PF_07_PF_S03 | Everskies: Virtual Dress up | reviewed_no_clean_public_price | Paid-feature depth could not be cleanly reconstructed from the saved public screenshot. | Do not use as plan-depth proof until app/store or in-app paywall evidence is captured. |
| PF_07_PF_S04 | Everskies: Virtual Dress up | reviewed_no_clean_public_price | Human review completed from saved screenshot/OCR; product-match remains conservative because the evidence is public web only. | Use as weak avatar-economy paid-surface cue; do not use as pricing or conversion proof. |
| PF_08_PF_S01 | Mindfulness with Petit BamBou | reviewed_no_clean_public_price | Saved Petit BamBou page shows Subscribe/Login and free-version/account language, but no clean subscription price. | Use as weak mindfulness paid-surface cue; do not use as pricing, plan-depth, or WTP proof. |
| PF_08_PF_S02 | Mindfulness with Petit BamBou | reviewed_no_clean_public_price | First meaningful in-app paywall boundary was not inspected in the local screenshot. | Use only as a weak public paid-surface cue; keep first-value/paywall timing open. |
| PF_08_PF_S03 | Mindfulness with Petit BamBou | reviewed_no_clean_public_price | Paid-feature depth could not be cleanly reconstructed from the saved public screenshot. | Do not use as plan-depth proof until app/store or in-app paywall evidence is captured. |
| PF_08_PF_S04 | Mindfulness with Petit BamBou | reviewed_no_clean_public_price | Human review completed from saved screenshot/OCR; product-match remains conservative because the evidence is public web only. | Use as weak mindfulness paid-surface cue; do not use as pricing, plan-depth, or WTP proof. |

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
| avatar_identity | medium_opportunity_needs_sampling | Plausible whitespace, but needs sampled competitor inspection before claim upgrade. | Sample top direct consumer-app and desktop rows, then compare against prototype scorecard. |
| mindfulness | medium_opportunity_needs_sampling | Plausible whitespace, but needs sampled competitor inspection before claim upgrade. | Sample top direct consumer-app and desktop rows, then compare against prototype scorecard. |
| gaming | mechanic_benchmark_not_primary_market | Strong mechanic/saturation benchmark, but not a primary Alina consumer market without direct ritual/self-improvement overlap. | Use for progression/avatar/retention mechanics only; do not treat as direct market proof. |
| gaming_progression | mechanic_benchmark_not_primary_market | Strong mechanic/saturation benchmark, but not a primary Alina consumer market without direct ritual/self-improvement overlap. | Use for progression/avatar/retention mechanics only; do not treat as direct market proof. |
| coaching | crowded_or_unclear_context | Market is visible but either crowded, indirect, or weakly tied to the full Alina loop. | Use only as support/context unless new source-native evidence is added. |
| astrology_esoterics | crowded_or_unclear_context | Market is visible but either crowded, indirect, or weakly tied to the full Alina loop. | Use only as support/context unless new source-native evidence is added. |

## 4.1. Русская whitespace decision map

Чтобы H3 не звучала сильнее, чем позволяет evidence, добавлена русская whitespace decision map на 6 рынков/ниш. Она показывает full-loop rate, scarcity, public-listing hidden clone risks и практический H3 read: где есть узкая directional возможность, где рынок только benchmark, а где claim остается crowded/unclear.

| Niche | Dedup | Full-loop % | Opportunity | H3 read |
| --- | ---: | ---: | --- | --- |
| mindfulness | 9723 | 3.82 | возможность есть, но нужна выборочная ручная проверка | H3 можно держать как narrow directional whitespace: full-loop-like кандидаты редки, но sampling обязателен. |
| avatar_identity | 7944 | 2.83 | возможность есть, но нужна выборочная ручная проверка | H3 можно держать как narrow directional whitespace: full-loop-like кандидаты редки, но sampling обязателен. |
| gaming | 14304 | 1.03 | механический benchmark, не основной whitespace | Не использовать как H3 proof. Это источник механик, а не доказательство рынка Alina. |
| gaming_progression | 950 | 6.63 | механический benchmark, не основной whitespace | Не использовать как H3 proof. Это источник механик, а не доказательство рынка Alina. |
| coaching | 3857 | 13.02 | рынок видим, но claim о whitespace слабый без нового evidence | H3 не усиливать: плотность/контекст/прямота пока слишком неоднозначны. |
| astrology_esoterics | 2657 | 13.70 | рынок видим, но claim о whitespace слабый без нового evidence | H3 не усиливать: плотность/контекст/прямота пока слишком неоднозначны. |

**mindfulness.** H3 можно держать как narrow directional whitespace: full-loop-like кандидаты редки, но sampling обязателен. Риск: Shepherd: Spiritual Bible BFF:high_hidden_clone_risk_requires_app_walkthrough|Zing AI: Home & Gym Workouts:medium_adjacency_risk|EVOLVE: Transform Your Life:medium_adjacency_risk|Daily Burn: Workout Coach:medium_adjacency_risk|Myla : Manifest & Vision Board:medium_adjacency_risk. Следующий шаг: Sample top direct consumer-app and desktop rows, then compare against prototype scorecard.

**avatar_identity.** H3 можно держать как narrow directional whitespace: full-loop-like кандидаты редки, но sampling обязателен. Риск: Shepherd: Spiritual Bible BFF:high_hidden_clone_risk_requires_app_walkthrough|Zing AI: Home & Gym Workouts:medium_adjacency_risk|EVOLVE: Transform Your Life:medium_adjacency_risk|Daily Burn: Workout Coach:medium_adjacency_risk|Myla : Manifest & Vision Board:medium_adjacency_risk. Следующий шаг: Sample top direct consumer-app and desktop rows, then compare against prototype scorecard.

**gaming.** Не использовать как H3 proof. Это источник механик, а не доказательство рынка Alina. Риск: Shepherd: Spiritual Bible BFF:high_hidden_clone_risk_requires_app_walkthrough|Zing AI: Home & Gym Workouts:medium_adjacency_risk|EVOLVE: Transform Your Life:medium_adjacency_risk|Daily Burn: Workout Coach:medium_adjacency_risk|Myla : Manifest & Vision Board:medium_adjacency_risk. Следующий шаг: Use for progression/avatar/retention mechanics only; do not treat as direct market proof.

**gaming_progression.** Не использовать как H3 proof. Это источник механик, а не доказательство рынка Alina. Риск: Shepherd: Spiritual Bible BFF:high_hidden_clone_risk_requires_app_walkthrough|Zing AI: Home & Gym Workouts:medium_adjacency_risk|EVOLVE: Transform Your Life:medium_adjacency_risk|Daily Burn: Workout Coach:medium_adjacency_risk|Myla : Manifest & Vision Board:medium_adjacency_risk. Следующий шаг: Use for progression/avatar/retention mechanics only; do not treat as direct market proof.

**coaching.** H3 не усиливать: плотность/контекст/прямота пока слишком неоднозначны. Риск: Shepherd: Spiritual Bible BFF:high_hidden_clone_risk_requires_app_walkthrough|Zing AI: Home & Gym Workouts:medium_adjacency_risk|EVOLVE: Transform Your Life:medium_adjacency_risk|Daily Burn: Workout Coach:medium_adjacency_risk|Myla : Manifest & Vision Board:medium_adjacency_risk. Следующий шаг: Use only as support/context unless new source-native evidence is added.

**astrology_esoterics.** H3 не усиливать: плотность/контекст/прямота пока слишком неоднозначны. Риск: Shepherd: Spiritual Bible BFF:high_hidden_clone_risk_requires_app_walkthrough|Zing AI: Home & Gym Workouts:medium_adjacency_risk|EVOLVE: Transform Your Life:medium_adjacency_risk|Daily Burn: Workout Coach:medium_adjacency_risk|Myla : Manifest & Vision Board:medium_adjacency_risk. Следующий шаг: Use only as support/context unless new source-native evidence is added.

Самый опасный ранний риск для H3 - Shepherd: Spiritual Bible BFF. Если walkthrough подтвердит полный loop с action -> identity/avatar causality, whitespace wording должен быть немедленно сужен.

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

## 5.2. Русские ICP interview dossiers

Чтобы H5 не оставалась аудиторной матрицей, добавлены ICP interview dossiers на 6 сегментов. Они показывают, кого искать, через какие каналы, какие тесты провести, какие evidence fields заполнить и какие ответы апгрейдят или ослабляют сегмент.

| ICP | Segment | Priority | Score | Rows | Done | Upgrade rule |
| --- | --- | --- | ---: | ---: | ---: | --- |
| ICP_A | Spiritual self-improvers | P0_top_two | 10 | 48 | 0 | апгрейдить primary ICP, если recent behavior, trust, meaning lift и WTP не противоречат spiritual/self-improvement framing. |
| ICP_B | Avatar identity builders | P1_secondary | 8 | 0 | 0 | оставить как secondary ICP, пока P0_top_two не дадут слабый результат или сегмент не покажет более сильный recent-behavior/WTP signal. |
| ICP_C | Anxious daily reset users | P1_secondary | 9 | 0 | 0 | оставить как secondary ICP, пока P0_top_two не дадут слабый результат или сегмент не покажет более сильный recent-behavior/WTP signal. |
| ICP_D | Habit and progress users | P0_top_two | 10 | 48 | 0 | апгрейдить primary ICP, если action-tied progress выигрывает у plain checklist/streak и не вызывает streak anxiety. |
| ICP_E | Cozy/casual progression users | P1_secondary | 9 | 0 | 0 | оставить как secondary ICP, пока P0_top_two не дадут слабый результат или сегмент не покажет более сильный recent-behavior/WTP signal. |
| ICP_F | Coaching professionals and structured growth users | P1_secondary | 9 | 0 | 0 | оставить как secondary ICP, пока P0_top_two не дадут слабый результат или сегмент не покажет более сильный recent-behavior/WTP signal. |

**ICP_A. Spiritual self-improvers.** Core job: Turn symbolic/personal meaning into one grounded action today. Recruiting: community_or_accountability_need: Relevant community thread, Discord, forum, or group where users already discuss the job | word_of_mouth_or_personal_recommendation: Warm referral or friend-of-user intro | coded_forum_need_or_competitor_context: Forum-language recruiting using exact problem wording from coded snippets | social_platform_discovery: Social platform discovery or creator/community mention Downgrade: ослабить сегмент, если участники не называют recent behavior, проблема оказывается абстрактной, paid depth отвергается, или возникает fatal objection: Alina needs careful framing: soft guidance, no deterministic claims, visible limits, and clear safety posture.

**ICP_D. Habit and progress users.** Core job: Make vague growth concrete and keep momentum without streak anxiety. Recruiting: community_or_accountability_need: Relevant community thread, Discord, forum, or group where users already discuss the job | word_of_mouth_or_personal_recommendation: Warm referral or friend-of-user intro | coded_forum_need_or_competitor_context: Forum-language recruiting using exact problem wording from coded snippets | social_platform_discovery: Social platform discovery or creator/community mention Downgrade: ослабить сегмент, если участники не называют recent behavior, проблема оказывается абстрактной, paid depth отвергается, или возникает fatal objection: The free loop must demonstrate value before asking for deeper paid analysis or personalization.

Граница этого слоя: dossier готовит интервью и делает их сравнимыми, но не валидирует аудиторию до заполненных capture rows и точных цитат.

## 5.3. Русская voice-of-customer / objection map

Чтобы аудитория не была только сегментной матрицей, добавлена voice-of-customer / objection map на 8 тем. Она сшивает review/JTBD clusters, community/referral rows, Reddit signal rows, manual-read queue, ICP segments и prototype scorecard в язык пользовательских работ, возражений, interview probes и prototype probes. Суммарно по темам учтено 22759 локальных supporting signals/rows; это intentionally proxy layer, а не representative demand proof.

| # | Theme | Тема | H | Signals | Read queue | Interview probe |
| --- | --- | --- | --- | ---: | ---: | --- |
| 1 | VOC_DAILY_ANCHOR | Ежедневный якорь и повторяемый ритуал | H5/H6/H4 | 3234 | 962 | Расскажи про последний цифровой ритуал, к которому ты возвращался несколько дней подряд. Что именно заставляло открыть его снова? |
| 2 | VOC_VISIBLE_PROGRESS | Видимый прогресс и доказательство, что действие помогает | H3/H4/H6 | 5931 | 1664 | Когда ты в последний раз бросил практику, потому что не видел, что она реально работает? |
| 3 | VOC_OVERBUILT_STREAK_ANXIETY | Перегруз, streak anxiety и тяжелые productivity-системы | H3/H5/H6 | 2301 | 908 | Что в последнем self-improvement/productivity app стало слишком тяжелым или давящим? |
| 4 | VOC_PERSONALIZATION_FEEL_SEEN | Персонализация и ощущение “меня увидели” | H2/H5/H6 | 4743 | 1092 | Какая персональная подсказка за последний месяц попала в точку, а какая показалась пустой или манипулятивной? |
| 5 | VOC_TRUST_SAFETY | Доверие, безопасность и граница мягкого guidance | H4/H5/H6 | 1263 | 515 | Что сделало бы такой продукт небезопасным, cringe, манипулятивным или не для тебя? |
| 6 | VOC_DEPTH_CUSTOMIZATION | Глубина, свежесть и кастомизация после первого value moment | H2/H5/H6 | 1544 | 541 | За какую глубину в похожем продукте тебе было бы не жалко платить после первой бесплатной пользы? |
| 7 | VOC_SUBSCRIPTION_VALUE | Цена, подписка и доказательство ценности | H2/H6 | 1312 | 512 | За что ты уже платишь в этой зоне и что должно случиться бесплатно, чтобы подписка стала честной? |
| 8 | VOC_SOCIAL_PROOF_REFERRAL | Рекомендации, принадлежность и легкость рассказа другу | H5/H6 | 2431 | 1120 | Как бы ты одним предложением объяснил другу, зачем это открыть завтра? |

**VOC_DAILY_ANCHOR.** Возможность: Alina должна быть не библиотекой функций, а одним коротким ежедневным циклом, к которому понятно зачем возвращаться. Риск: Если первый экран выглядит как меню практик, пользователь сравнит продукт с meditation/journal/habit apps и потеряет ощущение нового ядра. Downgrade: Ослабить H5/H6, если участники не называют recent recurring behavior или не видят причины вернуться завтра.

**VOC_VISIBLE_PROGRESS.** Возможность: Сильная ставка Alina: связать meaning -> action -> visible progress так, чтобы изменение выглядело причинным, а не декоративным. Риск: Если avatar/progress меняется произвольно, продукт станет декоративной игрушкой или обычным habit tracker с красивой оболочкой. Downgrade: Ослабить H3/H4, если пользователи не могут объяснить причинность без подсказки или называют feedback косметическим.

**VOC_OVERBUILT_STREAK_ANXIETY.** Возможность: Alina может выиграть как легкая, forgiving петля без наказания за пропуск и без ощущения обслуживания системы. Риск: Если добавить streak pressure, сложные настройки или много обязательных шагов, продукт попадет в прямо отвергаемый паттерн. Downgrade: Ослабить H5/H6, если P0 сегменты воспринимают петлю как pressure, chores или guilt machine.

**VOC_PERSONALIZATION_FEEL_SEEN.** Возможность: Пользователь платит вниманием и деньгами не за generic совет, а за точное отражение состояния, которое превращается в действие. Риск: Слишком generic guidance разрушит доверие; слишком deterministic guidance создаст safety/trust risk. Downgrade: Ослабить H5/H2, если пользователи не чувствуют персональной точности или не готовы платить за глубину после free loop.

**VOC_TRUST_SAFETY.** Возможность: Если Alina честно ограничивает обещания и дает контролируемое мягкое guidance, она может избежать части риска spiritual/AI/self-help продуктов. Риск: Любое ощущение диагноза, предсказания судьбы, манипуляции или небезопасного совета должно останавливать claim upgrade. Downgrade: Ослабить H4/H6 немедленно, если возникает повторяющийся fatal trust/safety objection.

Граница этого слоя: VOC карта задает язык интервью, prototype sessions и paid-depth checks, но не апгрейдит H5/H6/H4 без заполненных capture rows.

## 5.4. Русский field session kit

Чтобы перейти от "у нас есть capture sheets" к реальной исполнимой сессии, добавлен русский field session kit: 14 шагов на P0 сегменты ICP_A, ICP_D, примерно 120 минут операторского времени. Kit соединяет consent, recent-behavior screener, problem story, VOC objections, prototype walkthrough, WTP/referral language, scorecard и rebuild hygiene.

| Step | ICP | Phase | Min | H | Evidence |
| --- | --- | --- | ---: | --- | --- |
| ICP_A_CONSENT | ICP_A | Consent и рамка безопасности | 3 | H5/H6 | consent_yes_no/recording_permission/quote_permission/participant_boundaries |
| ICP_A_SCREENER | ICP_A | Recent behavior screener | 7 | H5 | recent_behavior_match/current_tool/trigger_of_last_use/segment_fit_yes_no |
| ICP_A_PROBLEM_STORY | ICP_A | Problem story и current workaround | 12 | H5/H3 | specific_episode/workaround/pain_intensity_1_5/verbatim_language/rejected_patterns |
| ICP_A_VOC_OBJECTIONS | ICP_A | VOC objections и disconfirmation | 10 | H2/H4/H5/H6 | top_objection/trust_boundary/streak_or_pressure_reaction/personalization_reaction/paid_depth_reaction |
| ICP_A_PROTOTYPE_WALKTHROUGH | ICP_A | Prototype walkthrough | 15 | H4/H6/H5 | completion_time_seconds/comprehension_yes_no/meaning_lift_1_5/differentiation_1_5/return_intent_1_5/verbatim_quote/fatal_objection |
| ICP_A_VALUE_WTP | ICP_A | Value, paid depth и referral language | 8 | H2/H5/H6 | free_value_moment/paid_depth_feature/acceptable_price_range/friend_explanation/return_trigger |
| ICP_A_SCORE_REBUILD | ICP_A | Scorecard и rebuild hygiene | 5 | H1/H2/H3/H4/H5/H6 | scorecard_metric_values/claim_update_needed/source_file_updated/rebuild_commit_hash |
| ICP_D_CONSENT | ICP_D | Consent и рамка безопасности | 3 | H5/H6 | consent_yes_no/recording_permission/quote_permission/participant_boundaries |
| ICP_D_SCREENER | ICP_D | Recent behavior screener | 7 | H5 | recent_behavior_match/current_tool/trigger_of_last_use/segment_fit_yes_no |
| ICP_D_PROBLEM_STORY | ICP_D | Problem story и current workaround | 12 | H5/H3 | specific_episode/workaround/pain_intensity_1_5/verbatim_language/rejected_patterns |
| ICP_D_VOC_OBJECTIONS | ICP_D | VOC objections и disconfirmation | 10 | H2/H4/H5/H6 | top_objection/trust_boundary/streak_or_pressure_reaction/personalization_reaction/paid_depth_reaction |
| ICP_D_PROTOTYPE_WALKTHROUGH | ICP_D | Prototype walkthrough | 15 | H4/H6/H5 | completion_time_seconds/comprehension_yes_no/meaning_lift_1_5/differentiation_1_5/return_intent_1_5/verbatim_quote/fatal_objection |
| ICP_D_VALUE_WTP | ICP_D | Value, paid depth и referral language | 8 | H2/H5/H6 | free_value_moment/paid_depth_feature/acceptable_price_range/friend_explanation/return_trigger |
| ICP_D_SCORE_REBUILD | ICP_D | Scorecard и rebuild hygiene | 5 | H1/H2/H3/H4/H5/H6 | scorecard_metric_values/claim_update_needed/source_file_updated/rebuild_commit_hash |

Граница этого слоя: session kit не является validation evidence. Он становится evidence только после заполненных source capture rows, цитат/скриншотов/scorecard values, пересборки gates/report/PDF/manifest и commit/push.

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

## 7.2. Русские prototype session dossiers

Чтобы H4/H6 не оставались на уровне stimulus design, добавлены prototype session dossiers на 2 P0 сегмента. Они показывают flow сессии, critical screens, scorecard metrics, evidence fields и правила upgrade/downgrade для конкурентного преимущества и продуктового ядра.

| ICP | Segment | Screens | Rows | Done | Critical screens |
| --- | --- | ---: | ---: | ---: | --- |
| ICP_A | Spiritual self-improvers | 8 | 40 | 0 | S03_ACTION_CARD: Participant sees the action as doable and causally linked to the chosen theme. / S06_AVATAR_CHANGE: Participant understands action -> identity/avatar causality. / S08_VALUE_CHECK: Participant names the integrated loop in their own words. |
| ICP_D | Habit and progress users | 8 | 40 | 0 | S03_ACTION_CARD: Participant sees the action as doable and causally linked to the chosen theme. / S06_AVATAR_CHANGE: Participant understands action -> identity/avatar causality. / S08_VALUE_CHECK: Participant names the integrated loop in their own words. |

**ICP_A. Spiritual self-improvers.** Upgrade: усилить H4/H6 только если участники понимают причинность meaning -> action -> avatar/progress, проходят петлю примерно за две минуты, видят отличие от habit/coach/meditation альтернатив и не дают fatal trust/safety objection. Downgrade: ослабить H4/H6, если пользователи читают петлю как generic habit tracker, vague reading, manipulative gamification, childish avatar toy или unsafe guidance. Segment risk: Alina needs careful framing: soft guidance, no deterministic claims, visible limits, and clear safety posture.

**ICP_D. Habit and progress users.** Upgrade: усилить H4/H6 только если участники понимают причинность meaning -> action -> avatar/progress, проходят петлю примерно за две минуты, видят отличие от habit/coach/meditation альтернатив и не дают fatal trust/safety objection. Downgrade: ослабить H4/H6, если пользователи читают петлю как generic habit tracker, vague reading, manipulative gamification, childish avatar toy или unsafe guidance. Segment risk: The free loop must demonstrate value before asking for deeper paid analysis or personalization.

Граница этого слоя: prototype dossier делает H4/H6 проверяемыми, но claim усиливается только после заполненных prototype_session_capture_sheet и scorecard metrics.

## 8. Что уже доказано, а что еще нельзя утверждать

На текущем этапе доказано не "Alina точно сработает", а другое: есть достаточно большой и платежеспособный adjacent landscape; есть повторяющиеся боли и jobs-to-be-done; есть narrow whitespace hypothesis; есть операционная система источников, матриц, claim boundaries, capture sheets и PDF/report artifacts. Не доказано: что пользователи действительно предпочитают эту петлю существующим решениям, что они понимают avatar/progress causality, что они готовы платить за paid depth, и что конкуренты не закрывают этот loop внутри onboarding.

| Requirement | Статус | Сила | Открытый gap |
| --- | --- | --- | --- |
| REQ_01_MASTER_PLAN | proved_v1 | strong | Keep refreshing as validation results change. |
| REQ_02_COMPETITOR_UNIVERSE | proved_raw_50k_and_dedup_30k_plus_dedup_50k_open | medium_high | Raw 50k source scale is now met and the dedup 30k+/30k-40k working band is met; the remaining expansion gap is dedup 50k plus Product Hunt/AlternativeTo, B2B directories, company positioning pages, and additional source-native coverage. |
| REQ_03_FIVE_MARKET_COVERAGE | proved_v1 | strong | Gaming should remain benchmark-only unless direct consumer overlap is validated. |
| REQ_04_MARKET_MONEY | supported_with_triangulated_proxy_not_final | medium_high | Market sizing is stress-tested and triangulated. Paid-flow signoff improved H2, but it is still below the validation threshold and actual competitor revenue estimates, paid intelligence, and in-app/WTP validation remain open. |
| REQ_05_WHITESPACE | narrow_supported_public_listing_signed_off_walkthrough_open | medium | Cross-source saturation now keeps gaming/progression as benchmark-only and finds no primary market opportunity strong enough to upgrade without manual walkthrough; app/onboarding screenshots are still required. |
| REQ_06_AUDIENCE_ICP | directionally_supported_secondary_voc_signed_off_interviews_open | medium | Segments and recruiting assets are directional and need actual interviews/prototype/WTP validation. |
| REQ_07_COMPETITIVE_ADVANTAGE | prototype_readiness_signed_off_user_sessions_open | medium | No completed user/prototype sessions prove the loop is understood/preferred. |
| REQ_08_REPORT_PDF | global_russian_report_pdf_docx_done_not_validated_final | medium_high | Global Russian Markdown/PDF/DOCX report exists and includes validation rollup, but it is not final validated investor/user-facing proof because all six validation gates still remain hold_validate. |
| REQ_09_VERSIONING_PROVENANCE | proved_active | high | Manifest must be regenerated after future evidence changes. |
| REQ_10_VALIDATION_GATES | all_gates_started_none_passed_validation_open | strong | All six gates are now started, but none is pass-ready: partial/readiness/signoff evidence is present, while app walkthrough, ICP interview, prototype session, and WTP proof remain below threshold. |

## 8.1. Русские карточки H1-H6 validation gates

Чтобы не потерять строгость в момент перехода от desk research к ручной работе, добавлены русские карточки 6 validation gates. Они показывают по каждой гипотезе: что уже поддерживает claim, почему его нельзя апгрейдить, какой evidence надо собрать, какой результат даст GO и какой результат заставит downgradе/kill.

| H | Гипотеза | Workstream | Status | Required | Done | Success min |
| --- | --- | --- | --- | ---: | ---: | ---: |
| H1 | Product shape exists | ручной walkthrough конкурентов | not_started | 60 | 0 | 25 |
| H2 | Markets have money | ручная проверка paywall/paid-flow | not_started | 40 | 0 | 12 |
| H3 | Whitespace exists | ручной walkthrough конкурентов | not_started | 60 | 0 | 25 |
| H4 | Competitive advantage is plausible | прототипные сессии и scorecard | not_started | 80 | 0 | 32 |
| H5 | Shared audience exists | интервью ICP и проверка recent behavior | not_started | 96 | 0 | 30 |
| H6 | Product core can be defined | прототипные сессии и scorecard | not_started | 80 | 0 | 32 |

**H1. Product shape exists.** Нельзя апгрейдить, потому что: No observed capture rows yet. Strict full loop is rare and still needs actual app/onboarding screenshots to confirm or downgrade public listing claims. Следующее действие: Capture onboarding, first action, progress/avatar feedback, and paywall screenshots for the highest-risk public-listing rows.

**H2. Markets have money.** Нельзя апгрейдить, потому что: No observed capture rows yet. Market sizing still needs actual revenue estimates, paid intelligence, manual in-app paywall validation, and willingness-to-pay prototype evidence for final investor-grade claims. Следующее действие: Use stress-test risk rows to prioritize paid-flow inspection and prototype willingness-to-pay questions.

**H3. Whitespace exists.** Нельзя апгрейдить, потому что: No observed capture rows yet. Actual app/onboarding inspection results are still missing; public listings and cross-source text rules can overstate or hide in-app loops. Следующее действие: Use the public-listing risk read to classify action->avatar causality in walkthrough as visible, inferred, absent, or blocked.

**H4. Competitive advantage is plausible.** Нельзя апгрейдить, потому что: No observed capture rows yet. No human prototype session yet proves users understand, prefer, or value the integrated loop. Следующее действие: Run prototype sessions with the top two ICP segments and fill the scorecard with observed results.

**H5. Shared audience exists.** Нельзя апгрейдить, потому что: No observed capture rows yet. Keyword/OCR/forum coding and directional ICP segments need human validation, interviews, and prototype tests. Следующее действие: Execute the ICP validation packet for the top two segments, then update segment status and selected primary ICP.

**H6. Product core can be defined.** Нельзя апгрейдить, потому что: No observed capture rows yet. No user prototype evidence yet confirms comprehension, emotional value, or retention impact. Следующее действие: Run prototype sessions and measure loop completion, comprehension, meaning lift, return intent, and paid-depth interest.

Практический смысл этого слоя простой: пока completed_rows и success_rows равны нулю, отчет может быть большим и хорошо структурированным, но claims остаются в hold_validate.

## 8.2. Русская observed-evidence ladder

Чтобы отчет оставался речевым, но не терял доказательную строгость, добавлена observed-evidence ladder на 6 гипотез. Она отделяет desk support от observed proof: что уже можно говорить, чего пока нельзя утверждать, какой capture artifact надо заполнить и какая фраза допустима в текущей версии отчета.

| H | Гипотеза | Observed mode | Need | Done | Честная фраза для отчета |
| --- | --- | --- | ---: | ---: | --- |
| H1 | форма продукта существует | ручной walkthrough конкурентов | 60 | 0 | Мы видим рядом продукты с похожими примитивами, но форму Alina нельзя считать доказанной, пока первые P0 walkthrough не покажут, что полный цикл не занят скрытым прямым клоном. |
| H2 | в соседних рынках есть деньги | ручная проверка paywall/paid-flow | 40 | 0 | Деньги в соседних категориях подтверждаются proxy-слоями, но инвестиционный claim по рынку должен оставаться range-based до ручной проверки платных поверхностей и willingness-to-pay. |
| H3 | есть узкое белое пятно | ручной walkthrough конкурентов | 60 | 0 | Белое пятно формулируется узко: не просто wellness, coaching или avatar, а причинная петля meaning -> action -> reset -> visible identity/progress; до walkthrough это directional, не финальный вывод. |
| H4 | конкурентное преимущество правдоподобно | прототипные сессии | 80 | 0 | Преимущество Alina пока является проверяемой ставкой на интегрированную петлю, а не доказанным moat: оно должно пройти prototype comprehension, differentiation и trust gates. |
| H5 | общая аудитория существует | интервью ICP | 96 | 0 | Аудитория видна через повторяющийся язык ritual/progress/support, но ICP нельзя выбирать окончательно без recent-behavior интервью и проверки готовности возвращаться. |
| H6 | продуктовое ядро можно определить | прототипные сессии | 80 | 0 | Продуктовое ядро уже собрано в MVP framing, но оно станет настоящим core только если пользователи поймут причинность петли и смогут объяснить, зачем вернуться завтра. |

**H1.** Наблюдаемых rows пока нет: desk evidence не переводит гипотезу из hold_validate в go. Главная дырка: No observed capture rows yet. Strict full loop is rare and still needs actual app/onboarding screenshots to confirm or downgrade public listing claims. Сначала заполнить: manual_walkthrough_capture_sheet.csv + screenshot paths + inspector_notes

**H2.** Наблюдаемых rows пока нет: desk evidence не переводит гипотезу из hold_validate в go. Главная дырка: No observed capture rows yet. Market sizing still needs actual revenue estimates, paid intelligence, manual in-app paywall validation, and willingness-to-pay prototype evidence for final investor-grade claims. Сначала заполнить: paid_flow_capture_sheet.csv + public pricing screenshot + product-match verdict

**H3.** Наблюдаемых rows пока нет: desk evidence не переводит гипотезу из hold_validate в go. Главная дырка: No observed capture rows yet. Actual app/onboarding inspection results are still missing; public listings and cross-source text rules can overstate or hide in-app loops. Сначала заполнить: manual_walkthrough_capture_sheet.csv + screenshot paths + inspector_notes

**H4.** Наблюдаемых rows пока нет: desk evidence не переводит гипотезу из hold_validate в go. Главная дырка: No observed capture rows yet. No human prototype session yet proves users understand, prefer, or value the integrated loop. Сначала заполнить: prototype_session_capture_sheet.csv + prototype_validation_scorecard.csv + observed metrics

**H5.** Наблюдаемых rows пока нет: desk evidence не переводит гипотезу из hold_validate в go. Главная дырка: No observed capture rows yet. Keyword/OCR/forum coding and directional ICP segments need human validation, interviews, and prototype tests. Сначала заполнить: icp_interview_capture_sheet.csv + recent behavior + verbatim quote + segment status

**H6.** Наблюдаемых rows пока нет: desk evidence не переводит гипотезу из hold_validate в go. Главная дырка: No observed capture rows yet. No user prototype evidence yet confirms comprehension, emotional value, or retention impact. Сначала заполнить: prototype_session_capture_sheet.csv + prototype_validation_scorecard.csv + observed metrics

Этот слой особенно важен для финального PDF: он не дает красивому повествованию случайно превратить незавершенную проверку в доказанный вывод.

## 8.3. Русский validation runway

Чтобы dossier-слои не жили отдельно, добавлен validation runway на 5 workstreams. Он задает порядок: hidden-clone walkthrough, paid-flow signoff, ICP interviews, prototype sessions, затем decision rebuild/PDF refresh.

| # | ID | Workstream | H | Units | Need | Done | P0 focus |
| --- | --- | --- | --- | ---: | ---: | ---: | --- |
| 1 | WS_COMPETITOR_HIDDEN_CLONE | P0 competitor walkthrough | H1/H3 | 12 | 60 | 0 | 1. Shepherd: Spiritual Bible BFF / 2. Zing AI: Home & Gym Workouts / 3. Miracle Morning Routine |
| 2 | WS_PAID_FLOW_SIGNOFF | Paid-flow signoff | H2 | 10 | 40 | 0 | 1. Character AI: Chat, Talk, Text / 2. Meditopia: Sleep & Meditation / 3. Carrom Pool: Disc Game |
| 3 | WS_ICP_INTERVIEWS | ICP interviews | H5/H6 | 6 | 96 | 0 | ICP_A. Spiritual self-improvers / ICP_D. Habit and progress users |
| 4 | WS_PROTOTYPE_SESSIONS | Prototype sessions | H4/H6/H5/H2 | 2 | 80 | 0 | ICP_A. Spiritual self-improvers / ICP_D. Habit and progress users |
| 5 | WS_DECISION_REBUILD | Decision rebuild and PDF refresh | H1/H2/H3/H4/H5/H6 | 6 | 0 | 0 | H1/H2/H3/H4/H5/H6 |

**1. WS_COMPETITOR_HIDDEN_CLONE: P0 competitor walkthrough.** Pass: 5 P0 продуктов имеют сопоставимые listing/onboarding/action/progress/paywall screenshots, и полный hidden direct clone не подтвержден. Downgrade: если walkthrough показывает полную петлю meaning -> action -> reset -> causally changing identity/avatar/progress -> next-day hook, H3 downgrade обязателен.

**2. WS_PAID_FLOW_SIGNOFF: Paid-flow signoff.** Pass: visible price/trial, product-match, unlock depth и first meaningful paywall boundary подтверждены человеком для strongest paid-flow rows. Downgrade: если price относится к parent/B2B/unrelated/login-only flow, источник уходит из сильной H2 опоры.

**3. WS_ICP_INTERVIEWS: ICP interviews.** Pass: P0 участники называют recent behavior, specific episode, current workaround, language resonance, paid depth и отсутствие fatal objection. Downgrade: если участники не называют recent behavior или paid depth/fatal objection ломают сегмент, ICP нельзя выбирать как primary.

**4. WS_PROTOTYPE_SESSIONS: Prototype sessions.** Pass: scorecard проходит comprehension, two-minute completion, meaning lift, differentiation, trust/safety и paid-depth gates. Downgrade: если flow читается как generic habit tracker/vague reading/manipulative gamification/unsafe guidance, H4/H6 downgrade.

**5. WS_DECISION_REBUILD: Decision rebuild and PDF refresh.** Pass: claim statuses меняются только после заполненных capture rows и пересборки evidence package. Downgrade: если observed evidence противоречит desk claim, отчет должен стать слабее, а не красивее.

Граница runway: он не создает observed evidence, а превращает весь пакет в последовательную программу ручной проверки.

## 9. Следующие действия

Все H1-H6 validation gates сейчас требуют наблюдаемой валидации. Not-started gates: 0. Это не провал, а честная граница исследования: локальная evidence base готова, но реальные решения должны приниматься после ручного walkthrough и пользовательских сессий.

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

## 9.2.1. Русский P0 execution packet

Чтобы следующий шаг был исполнимым, добавлен P0 execution packet на 6 рабочих пакетов. Он переводит tranche planner в утреннюю очередность: какой блок открыть первым, какие evidence fields заполнить, что считается success, что вызывает downgrade и какие файлы пересобрать после наблюдаемого результата.

| Seq | Tranche | Target | Rows | Minutes | Сделать сейчас |
| --- | --- | --- | ---: | --- | --- |
| 1 | TRANCHE_01_HIDDEN_CLONE_SPIKE | Shepherd: Spiritual Bible BFF | 5 | 45-75 | Открыть Shepherd первым и заполнить 5 walkthrough slots до любых расширений. |
| 2 | TRANCHE_02_MANUAL_TOP5 | Shepherd: Spiritual Bible BFF/Zing AI: Home & Gym Workouts/Miracle Morning Routine/EVOLVE: Transform Your Life/Daily Yoga: Yoga for Fitness® | 25 | 180-300 | После Shepherd закрыть top-5 конкурентов одинаковой рубрикой, чтобы H1/H3 получили сопоставимый evidence. |
| 3 | TRANCHE_03_PAID_CONFIRMED_SPIKE | Character AI: Chat, Talk, Text/Meditopia: Sleep & Meditation | 8 | 60-90 | Проверить только product-matched paid surfaces; не усиливать H2 по parent/OCR/noise pages. |
| 4 | TRANCHE_04_ICP_PILOT | ICP_A and ICP_D / participants P01-P02 | 24 | 120-180 | Провести по 2 участника в ICP_A и ICP_D, записывая recent behavior и exact language. |
| 5 | TRANCHE_05_PROTOTYPE_PILOT | ICP_A and ICP_D / participants P01-P02 / screens S01-S08 | 32 | 90-150 | Показать 8 экранов петли и особенно проверить S06 action -> avatar/progress causality. |
| 6 | TRANCHE_06_REDDIT_TOP25_LANGUAGE | Top 25 P0 Reddit/manual reading rows | 25 | 150-240 | Прочитать top-25 тредов как словарь проблем, не как количественное доказательство спроса. |

**TRANCHE_01_HIDDEN_CLONE_SPIKE.** Открыть Shepherd первым и заполнить 5 walkthrough slots до любых расширений. Success: Shepherd классифицирован как full loop, adjacent loop, weak adjacency, blocked или hidden direct clone. Stop/downgrade: Если Shepherd полностью владеет Alina loop с action->identity/avatar causality, H1/H3 немедленно downgrade до narrow/pivot wording.

**TRANCHE_02_MANUAL_TOP5.** После Shepherd закрыть top-5 конкурентов одинаковой рубрикой, чтобы H1/H3 получили сопоставимый evidence. Success: Все 25 строк имеют observed answer, directness label, causality label, paywall label и notes. Stop/downgrade: Любой full-loop competitor переводит whitespace claim в narrower/pivot language.

**TRANCHE_03_PAID_CONFIRMED_SPIKE.** Проверить только product-matched paid surfaces; не усиливать H2 по parent/OCR/noise pages. Success: Не меньше 6/8 строк получают confirm или conservative partial с human notes. Stop/downgrade: Если confirmed rows оказываются unrelated/parent-only/OCR noise, H2 остается proxy-only и market-money wording сужается.

**TRANCHE_04_ICP_PILOT.** Провести по 2 участника в ICP_A и ICP_D, записывая recent behavior и exact language. Success: Хотя бы один участник в каждом сегменте дает concrete recent behavior и понятный language resonance. Stop/downgrade: Если оба сегмента говорят только абстрактно или отвергают action-tied identity/progress, ICP claim не усиливается.

**TRANCHE_05_PROTOTYPE_PILOT.** Показать 8 экранов петли и особенно проверить S06 action -> avatar/progress causality. Success: PVS_M01/PVS_M04/PVS_M05 не получают kill evidence; участники понимают S06 causality без объяснения. Stop/downgrade: Если avatar/progress читается как декоративная игра или манипуляция, H4/H6 остаются hold или pivot.

**TRANCHE_06_REDDIT_TOP25_LANGUAGE.** Прочитать top-25 тредов как словарь проблем, не как количественное доказательство спроса. Success: 25 rows read; at least 10 useful language/pain insights with quote-use status explicitly set. Stop/downgrade: Если top threads показывают, что users reject gamified identity/progress, prototype positioning must change before more sessions.

Этот packet не усиливает claims сам по себе. Он только делает ручную валидацию исполнимой и защищает отчет от stale publication после новых evidence.

## 9.2.2. Русские P0 competitor walkthrough dossiers

Чтобы первый ручной walkthrough был не абстрактным "посмотреть конкурентов", добавлены P0 dossiers на 12 конкурентов. Каждый dossier связывает public listing risk, hidden-clone риск, 5 обязательных screenshot slots, decisive questions и правило изменения H1/H3/H2 после проверки.

| # | Конкурент | Риск | Slots | Done | Как меняет claim |
| --- | --- | --- | ---: | ---: | --- |
| 1 | Shepherd: Spiritual Bible BFF | красный риск: возможный скрытый прямой клон полной петли | 5 | 0 | если walkthrough подтверждает полный цикл, H3 надо ослабить и явно признать direct clone risk; если нет, Shepherd остается важным reference competitor, но whitespace survives narrower. |
| 2 | Zing AI: Home & Gym Workouts | средний риск: adjacent loop может оказаться близким после onboarding | 5 | 0 | если onboarding не показывает causality, использовать как adjacent benchmark; если неожиданно есть action -> identity/progress, поднять в hidden-clone review. |
| 3 | Miracle Morning Routine | низкий публичный риск: листинг поддерживает adjacency, но не доказывает full-loop clone | 5 | 0 | если onboarding не показывает causality, использовать как adjacent benchmark; если неожиданно есть action -> identity/progress, поднять в hidden-clone review. |
| 4 | EVOLVE: Transform Your Life | желтый риск: публичный текст похож на строгую петлю, но причинность надо увидеть в приложении | 5 | 0 | если causality видна в first session, H1/H3 получают сильный competitor boundary; если нет, downgrade public-listing claim до adjacent/progression only. |
| 5 | Daily Yoga: Yoga for Fitness® | низкий публичный риск: листинг поддерживает adjacency, но не доказывает full-loop clone | 5 | 0 | если onboarding не показывает causality, использовать как adjacent benchmark; если неожиданно есть action -> identity/progress, поднять в hidden-clone review. |
| 6 | Daily Burn: Workout Coach | желтый риск: публичный текст похож на строгую петлю, но причинность надо увидеть в приложении | 5 | 0 | если causality видна в first session, H1/H3 получают сильный competitor boundary; если нет, downgrade public-listing claim до adjacent/progression only. |
| 7 | Myla : Manifest & Vision Board | средний риск: adjacent loop может оказаться близким после onboarding | 5 | 0 | если onboarding не показывает causality, использовать как adjacent benchmark; если неожиданно есть action -> identity/progress, поднять в hidden-clone review. |
| 8 | Rosebud: AI Journal & Diary | средний риск: adjacent loop может оказаться близким после onboarding | 5 | 0 | если onboarding не показывает causality, использовать как adjacent benchmark; если неожиданно есть action -> identity/progress, поднять в hidden-clone review. |
| 9 | Habit Tracker : Haby | средний риск: adjacent loop может оказаться близким после onboarding | 5 | 0 | если onboarding не показывает causality, использовать как adjacent benchmark; если неожиданно есть action -> identity/progress, поднять в hidden-clone review. |
| 10 | Goddess・Women's Wellness Coach | низкий публичный риск: листинг поддерживает adjacency, но не доказывает full-loop clone | 5 | 0 | если onboarding не показывает causality, использовать как adjacent benchmark; если неожиданно есть action -> identity/progress, поднять в hidden-clone review. |
| 11 | LifeWheel Goal Habit Tracker | средний риск: adjacent loop может оказаться близким после onboarding | 5 | 0 | если onboarding не показывает causality, использовать как adjacent benchmark; если неожиданно есть action -> identity/progress, поднять в hidden-clone review. |
| 12 | Habit Tracker | средний риск: adjacent loop может оказаться близким после onboarding | 5 | 0 | если onboarding не показывает causality, использовать как adjacent benchmark; если неожиданно есть action -> identity/progress, поднять в hidden-clone review. |

**1. Shepherd: Spiritual Bible BFF.** красный риск: возможный скрытый прямой клон полной петли Сначала сохранить: output/manual_validation/01-shepherd-spiritual-bible-bff-app_store_listing_or_public_positioning.png|output/manual_validation/01-shepherd-spiritual-bible-bff-onboarding_first_value_screen.png|output/manual_validation/01-shepherd-spiritual-bible-bff-first_daily_action_or_task_screen.png|output/manual_validation/01-shepherd-spiritual-bible-bff-progress_avatar_identity_feedback_screen.png|output/manual_validation/01-shepherd-spiritual-bible-bff-first_paywall_or_iap_terms_screen.png. После walkthrough: если walkthrough подтверждает полный цикл, H3 надо ослабить и явно признать direct clone risk; если нет, Shepherd остается важным reference competitor, но whitespace survives narrower.

**2. Zing AI: Home & Gym Workouts.** средний риск: adjacent loop может оказаться близким после onboarding Сначала сохранить: output/manual_validation/02-zing-ai-home-gym-workouts-app_store_listing_or_public_positioning.png|output/manual_validation/02-zing-ai-home-gym-workouts-onboarding_first_value_screen.png|output/manual_validation/02-zing-ai-home-gym-workouts-first_daily_action_or_task_screen.png|output/manual_validation/02-zing-ai-home-gym-workouts-progress_avatar_identity_feedback_screen.png|output/manual_validation/02-zing-ai-home-gym-workouts-first_paywall_or_iap_terms_screen.png. После walkthrough: если onboarding не показывает causality, использовать как adjacent benchmark; если неожиданно есть action -> identity/progress, поднять в hidden-clone review.

**3. Miracle Morning Routine.** низкий публичный риск: листинг поддерживает adjacency, но не доказывает full-loop clone Сначала сохранить: output/manual_validation/03-miracle-morning-routine-app_store_listing_or_public_positioning.png|output/manual_validation/03-miracle-morning-routine-onboarding_first_value_screen.png|output/manual_validation/03-miracle-morning-routine-first_daily_action_or_task_screen.png|output/manual_validation/03-miracle-morning-routine-progress_avatar_identity_feedback_screen.png|output/manual_validation/03-miracle-morning-routine-first_paywall_or_iap_terms_screen.png. После walkthrough: если onboarding не показывает causality, использовать как adjacent benchmark; если неожиданно есть action -> identity/progress, поднять в hidden-clone review.

**4. EVOLVE: Transform Your Life.** желтый риск: публичный текст похож на строгую петлю, но причинность надо увидеть в приложении Сначала сохранить: output/manual_validation/04-evolve-transform-your-life-app_store_listing_or_public_positioning.png|output/manual_validation/04-evolve-transform-your-life-onboarding_first_value_screen.png|output/manual_validation/04-evolve-transform-your-life-first_daily_action_or_task_screen.png|output/manual_validation/04-evolve-transform-your-life-progress_avatar_identity_feedback_screen.png|output/manual_validation/04-evolve-transform-your-life-first_paywall_or_iap_terms_screen.png. После walkthrough: если causality видна в first session, H1/H3 получают сильный competitor boundary; если нет, downgrade public-listing claim до adjacent/progression only.

**5. Daily Yoga: Yoga for Fitness®.** низкий публичный риск: листинг поддерживает adjacency, но не доказывает full-loop clone Сначала сохранить: output/manual_validation/05-daily-yoga-yoga-for-fitness-app_store_listing_or_public_positioning.png|output/manual_validation/05-daily-yoga-yoga-for-fitness-onboarding_first_value_screen.png|output/manual_validation/05-daily-yoga-yoga-for-fitness-first_daily_action_or_task_screen.png|output/manual_validation/05-daily-yoga-yoga-for-fitness-progress_avatar_identity_feedback_screen.png|output/manual_validation/05-daily-yoga-yoga-for-fitness-first_paywall_or_iap_terms_screen.png. После walkthrough: если onboarding не показывает causality, использовать как adjacent benchmark; если неожиданно есть action -> identity/progress, поднять в hidden-clone review.

**6. Daily Burn: Workout Coach.** желтый риск: публичный текст похож на строгую петлю, но причинность надо увидеть в приложении Сначала сохранить: output/manual_validation/06-daily-burn-workout-coach-app_store_listing_or_public_positioning.png|output/manual_validation/06-daily-burn-workout-coach-onboarding_first_value_screen.png|output/manual_validation/06-daily-burn-workout-coach-first_daily_action_or_task_screen.png|output/manual_validation/06-daily-burn-workout-coach-progress_avatar_identity_feedback_screen.png|output/manual_validation/06-daily-burn-workout-coach-first_paywall_or_iap_terms_screen.png. После walkthrough: если causality видна в first session, H1/H3 получают сильный competitor boundary; если нет, downgrade public-listing claim до adjacent/progression only.

Этот слой по-прежнему не закрывает H1/H3 сам по себе: он нужен, чтобы captured screenshots и labels были сопоставимыми между конкурентами.

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
| REQ_evidence_package_traceability | доказано как исследовательский слой | high | 525 manifest rows; 0 missing artifacts | Это provenance proof, а не содержательное доказательство спроса. |
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
| REQ_validation_gate_calculator | доказано как исследовательский слой | high | 6 gate rows; 0 pass-ready; 6 in-progress; 0 not started; 0 downgrade/kill triggered | Это операционная готовность, не observed validation evidence. |
| REQ_competitor_universe | доказано как исследовательский слой | medium_high | 68085 cross-source raw rows; 37176 cross-source dedup rows; 44 coverage cells; 11 strong and 12 medium source/market cells | Raw 50k source scale is met; dedup 30k+ and the 30k-40k working band are met; dedup 50k remains open and should not be overclaimed. |
| H1_product_shape_exists | готово к проверке, gate открыт | medium | 100 top-candidate rows; 90 primary apps; 12 P0 inspection targets; 12 public listings inspected | Нельзя усиливать claim без app/onboarding walkthrough и скриншотов причинной петли. |
| H2_markets_have_money | поддержано направленно, но не финально доказано | medium | intersection SAM base USD 201960000; 12 market sources confidence-reviewed; 6 assumption rows; 6 stress scenarios; 22 strong competitor money proxies; 28 local paid-flow signoff rows | Нельзя читать proxy как выручку Alina; нужны paid-flow signoff и WTP evidence. |
| H2_paywall_visible_evidence | поддержано направленно, но не финально доказано | medium_low | 2/29 screenshots confirm visible public pricing; 8 partial paid-surface examples; 28 local signoff rows | Нельзя читать proxy как выручку Alina; нужны paid-flow signoff и WTP evidence. |
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
- `data_processed/source_scale_milestone.csv`
- `data_processed/research_navigation_index.csv`
- `data_processed/reddit_manual_reading_capture_sheet.csv`
- `data_processed/russian_narrative_evidence_map.csv`
- `data_processed/russian_market_sizing_playbook.csv`
- `data_processed/russian_market_deep_dives.csv`
- `data_processed/russian_paid_flow_dossiers.csv`
- `data_processed/paid_flow_local_signoff.csv`
- `data_processed/russian_whitespace_decision_map.csv`
- `data_processed/russian_claim_evidence_appendix.csv`
- `data_processed/russian_source_provenance_index.csv`
- `data_processed/russian_competitor_battlecards.csv`
- `data_processed/russian_icp_battlecards.csv`
- `data_processed/russian_icp_interview_dossiers.csv`
- `data_processed/russian_voc_objection_map.csv`
- `data_processed/russian_field_session_kit.csv`
- `data_processed/russian_product_loop_cards.csv`
- `data_processed/russian_prototype_session_dossiers.csv`
- `data_processed/russian_validation_gate_cards.csv`
- `data_processed/russian_p0_execution_packet.csv`
- `data_processed/russian_observed_evidence_ladder.csv`
- `data_processed/russian_validation_runway.csv`
- `data_processed/russian_p0_walkthrough_dossiers.csv`
- `data_processed/russian_validation_fieldbook.csv`
- `data_processed/validation_tranche_planner.csv`
- `data_processed/validation_tranche_briefing_index.csv`
- `data_processed/validation_gate_calculator.csv`
- `reports/alina-russian-narrative-report-v1.md`
- `output/pdf/alina-russian-narrative-report-v1.pdf`
