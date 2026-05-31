# Alina Research. Мировой рынок и логика гипотез

Собрано: 2026-05-31T16:39:27.595Z

## ОПИСАНИЕ ПРОЕКТА И ГИПОТЕЗА #1

Проект Alina рассматривается не как отдельный трекер привычек, не как очередная библиотека медитаций и не как декоративный avatar app. Базовая идея шире: создать ежедневный цифровой ритуал, в котором пользователь получает личное отражение дня, выбирает одно маленькое действие, проходит короткий reset и видит, что его прогресс или образ себя изменился именно из-за сделанного шага.

География этого отчета - мировой consumer-app рынок. Русский язык здесь используется как язык повествования и принятия решения, а не как ограничение рынка: конкурентная карта, источники, категории и монетизация собираются глобально.

Логика продукта строится вокруг связки meaning -> action -> reset -> visible progress. В этой связке смысл не остается абстрактной интерпретацией, действие не превращается в тяжелую productivity-систему, reset не живет как отдельная медитация, а avatar/progress не является случайной косметикой. Ценность появляется только тогда, когда пользователь понимает причинность: я сделал маленький шаг, и поэтому мой образ прогресса изменился.

Гипотеза №1: на мировом consumer-app рынке есть место для приложения, которое объединяет личный смысл, короткое действие, reset и причинно видимый прогресс в одну ежедневную петлю. Эта гипотеза пока не доказана как product-market fit, но уже поддержана масштабной картой соседних рынков и конкурентных сигналов.

На текущем этапе собрано 67,525 сырьевых source-строк, 36,694 уникализированных строк и 489 локальных артефактов. Эти данные нужны не для того, чтобы объявить продукт доказанным, а для последовательной проверки: существует ли рынок, есть ли деньги, насколько плотна конкуренция, где может быть белое пятно, кто аудитория и какую MVP-петлю надо тестировать.

### Логика гипотез

Исследование специально построено как цепочка, а не как набор независимых таблиц. Сначала фиксируется продуктовая идея: если Alina должна соединить смысл, действие, reset и видимый прогресс, то первая проверка - существует ли вообще такая форма продукта и не занята ли она уже конкурентами. После этого нужно понять, есть ли вокруг нее мировые рынки и деньги: без этого даже красивая продуктовая петля остается маленьким экспериментом.

Дальше проверка переходит к конкурентам и whitespace. Здесь важно не доказывать, что конкурентов нет, а увидеть, где именно существующие решения разрывают петлю: у одних есть reset без действия, у других действие без личного смысла, у третьих avatar без причинности, у четвертых прогресс без мягкого эмоционального входа. Только после этого имеет смысл говорить об аудитории: кто уже живет рядом с этой проблемой, какие приложения и ритуалы использует, за что платит и какие формулировки считает безопасными или манипулятивными.

Последний шаг - продуктовое ядро. Если рынки есть, конкуренты понятны, whitespace выглядит узким, а аудитория имеет recent behavior, тогда MVP должен проверять не весь возможный продукт, а одну причинную петлю: personal meaning -> tiny action -> short reset -> visible progress -> tomorrow hook. Пока эта цепочка не пройдет walkthrough, интервью и прототипные сессии, все выводы остаются evidence-first гипотезами, а не финальным go.

## ТЕКУЩИЙ СТАТУС ДОКАЗАТЕЛЬСТВ

На этом этапе исследование уже масштабное как база источников, но еще не завершенное как наблюдаемая валидация. Поэтому главный вывод должен звучать аккуратно: кабинетный ресерч подтверждает, что направление стоит проверять, но большинство гипотез пока нельзя переводить в “доказано”. Ниже показано, какие ворота уже имеют наблюдаемые строки, а где пока есть только подготовленный пакет для ручной проверки.

| Гипотеза | Что проверяем | Поток проверки | Статус | Заполнено / нужно | Успехи / порог | Решение сейчас |
| --- | --- | --- | --- | --- | --- | --- |
| H1 | форма продукта существует | ручной walkthrough конкурентов | начато, но доказательств недостаточно | 12 / 60 | 0 / 25 | оставить hold_validate |
| H3 | есть узкое белое пятно | ручной walkthrough конкурентов | начато, но доказательств недостаточно | 12 / 60 | 0 / 25 | оставить hold_validate |
| H2 | в рынках есть деньги | проверка paywall и платной глубины | начато, но доказательств недостаточно | 28 / 40 | 8 / 12 | оставить hold_validate |
| H5 | общая аудитория существует | интервью ICP и recent behavior | начато, но доказательств недостаточно | 12 / 96 | 0 / 30 | оставить hold_validate |
| H4 | конкурентное преимущество правдоподобно | прототипные сессии и scorecard | начато, но доказательств недостаточно | 16 / 80 | 0 / 32 | оставить hold_validate |
| H6 | продуктовое ядро можно определить | прототипные сессии и scorecard | начато, но доказательств недостаточно | 16 / 80 | 0 / 32 | оставить hold_validate |

Практически это означает следующее: H1 и H3 уже имеют по 12 / 60 listing-only строк, но 0 / 25 успешных app-walkthrough строк, поэтому hidden-clone риск остается открытым. H2 имеет 28 / 40 заполненных paid-flow строк и 8 / 12 успешных строк, но тоже ниже минимального порога. H5 имеет 12 / 96 secondary VOC строк и 0 / 30 успешных interview строк: это контекст для рекрутинга, а не доказательство аудитории. H4 и H6 имеют по 16 / 80 prototype-readiness строк, но 0 / 32 успешных user-session строк. Это не слабость отчета, а защита от преждевременного вывода: большой массив конкурентов и источников показывает, куда идти, но не заменяет walkthrough, интервью и прототипные сессии.

### Управленческий rollup по validation evidence

Чтобы не путать подготовленный research layer с реальной валидацией, ниже сведены типы evidence по каждому gate. Важная граница: listing-only, secondary VOC и prototype-readiness помогают запускать проверку, но не апгрейдят гипотезы без наблюдаемых walkthrough/interview/session результатов.

| H | Тип evidence сейчас | Rows | Success | Success gap | Следующий реальный validation step |
| --- | --- | --- | --- | ---: | --- |
| H1 | listing-only evidence | 12 / 60 | 0 / 25 | 25 | пройти первые 5 P0-приложений от listing до onboarding, first action, avatar/progress feedback и paywall boundary |
| H3 | listing-only whitespace risk evidence | 12 / 60 | 0 / 25 | 25 | для тех же 5 P0-приложений классифицировать full_loop / adjacent_loop / weak_adjacency и action->avatar causality |
| H2 | paid-flow signoff evidence | 28 / 40 | 8 / 12 | 4 | добрать product-matched paid-flow rows с чистой ценой, trial/plan depth и first-value/paywall boundary |
| H5 | secondary VOC evidence | 12 / 96 | 0 / 30 | 30 | провести первые P0-интервью ICP_A/ICP_D и заменить secondary VOC rows реальными participant answers |
| H4 | prototype-readiness evidence | 16 / 80 | 0 / 32 | 32 | запустить prototype sessions и измерить comprehension, differentiation, meaning lift, trust/safety и return intent |
| H6 | prototype-readiness evidence | 16 / 80 | 0 / 32 | 32 | после prototype sessions обновить MVP loop и проверить, могут ли участники назвать продукт и причинность своими словами |

## ОПРЕДЕЛЕНИЕ МИРОВЫХ ЦЕЛЕВЫХ РЫНКОВ И ГИПОТЕЗА #2

Для проверки первой гипотезы исследование выделяет пять мировых направлений. Они не равны пяти отдельным продуктам: каждое направление отвечает за один слой будущей ценности Alina. Mindfulness дает reset и привычку платить за эмоциональное состояние. Coaching/self-improvement дает действие, структуру роста и язык прогресса. Astrology/esoterics дает личный смысл, символический контекст и willingness-to-pay за персональные интерпретации. Avatar/identity дает видимое отражение изменения. Gaming/progression используется как benchmark механик возврата, награды и прогресса, но не как прямой рынок Alina.

| Направление | Direct app/store dedup | Total dedup | Top-100 apps | Роль в гипотезе |
| --- | ---: | ---: | ---: | --- |
| Mindfulness / reset | 2,550 | 9,723 | 21 | adjacent рынок для конкурентной карты |
| Avatar / identity | 2,506 | 7,944 | 49 | adjacent рынок для конкурентной карты |
| Astrology / esoterics | 2,206 | 2,657 | 59 | adjacent рынок для конкурентной карты |
| Coaching / self-improvement | 2,651 | 3,857 | 50 | adjacent рынок для конкурентной карты |
| Gaming / progression benchmark | 3,204 | 14,304 | 8 | benchmark механик, не прямой TAM |

Чтобы счетчики не терялись в приложениях, ниже отдельно показан rollup по каждой нише. Здесь важно различать three layers: all-source rows показывают ширину карты, direct app-store dedup показывает ближнее consumer-app поле, а top-100/manual targets показывают, какие конкуренты уже вынесены в более внимательный review. Эти числа не читаются как “столько прямых клонов Alina”; они показывают, какой объем данных стоит за каждым направлением. Глобальный dedup пакета остается 36,694: построчные niche dedup нельзя просто складывать как уникальных конкурентов, потому что один продукт может попадать в несколько тематических контекстов.

| Ниша | All raw | All dedup | Direct app dedup | Direct share | Top-100 | Manual targets | Coverage | Как читать |
| --- | ---: | ---: | ---: | --- | ---: | ---: | --- | --- |
| Mindfulness / reset | 15,109 | 9,803 | 2,550 | 26.0% | 21 | 0 | 8 groups; strong 3; medium 2 | возможность есть, нужен ручной sampling |
| Avatar / identity | 14,872 | 9,952 | 2,506 | 25.2% | 49 | 3 | 8 groups; strong 3; medium 2 | возможность есть, нужен ручной sampling |
| Astrology / esoterics | 5,427 | 2,657 | 2,206 | 83.0% | 59 | 7 | 7 groups; strong 1; medium 3 | рынок плотный или контекст неясен |
| Coaching / self-improvement | 7,671 | 3,857 | 2,651 | 68.7% | 50 | 8 | 7 groups; strong 1; medium 3 | рынок плотный или контекст неясен |
| Gaming / progression benchmark | 24,446 | 16,875 | 3,204 | 19.0% | 8 | 0 | 9 groups; strong 3; medium 2 | benchmark механик, не primary market |

Гипотеза №2: мировые adjacent-рынки достаточно велики и монетизируемы, чтобы продолжать проверку Alina, но рыночные цифры должны читаться как sizing для направления, а не как прогноз выручки самого продукта.

| Рынок | SAM base | Денежный вывод | Score | Граница |
| --- | ---: | --- | ---: | --- |
| Mindfulness / reset | $252M | сильный направленный money case | 9 | Можно использовать как directional evidence, но нельзя усиливать claim до product-market proof без walkthrough, paywall signoff и пользовательских сессий. |
| Avatar / identity | $420M | сильный направленный money case | 10 | Можно использовать как directional evidence, но нельзя усиливать claim до product-market proof без walkthrough, paywall signoff и пользовательских сессий. |
| Astrology / esoterics | $374M | сильный направленный money case | 9 | Можно использовать как directional evidence, но нельзя усиливать claim до product-market proof без walkthrough, paywall signoff и пользовательских сессий. |
| Coaching / self-improvement | $300M | средний направленный money case | 8 | Можно использовать как directional evidence, но нельзя усиливать claim до product-market proof без walkthrough, paywall signoff и пользовательских сессий. |
| Gaming / progression benchmark | $671M | деньги видны, но это benchmark, не прямой TAM | 7 | Нельзя считать прямым рынком Alina без доказанного ritual/self-improvement overlap; использовать как механику прогресса и retention. |

Intersection SAM в текущей модели равен $202M. Это рабочая мировая рамка для дальнейшей проверки, а не обещание revenue. Локальный paid-flow signoff сейчас заполнен на 28 строках; H2 gate имеет статус in_progress_insufficient_evidence, потому что нужны еще in-app paywall walkthrough и willingness-to-pay evidence.

## МЕТОДОЛОГИЯ TAM/SAM/SOM

Рыночная модель Alina намеренно построена как диапазон, а не как одна “красивая” цифра. Она разделяет широкий TAM, serviceable SAM, confidence-weighted SAM и bottom-up stress-сценарии. Такой подход нужен, потому что Alina находится на пересечении нескольких adjacent-рынков, а не внутри одной готовой категории market report.

Базовая формула top-down: TAM base умножается на serviceable share и дает SAM base. Затем SAM дополнительно умножается на confidence/directness weight, чтобы не смешивать прямые adjacent-рынки, широкие adjacent-рынки и benchmark-механику. Отдельно используется bottom-up stress: reachable users * activation rate * paid conversion * ARPPU. Этот слой нужен не для прогноза выручки, а для проверки, какой масштаб начинает иметь смысл при разных уровнях distribution, retention и willingness-to-pay.

| Pillar | Какой тип рынка | SAM base | Weighted SAM | Риск модели | Как читать |
| --- | --- | ---: | ---: | --- | --- |
| gaming | benchmark механик, не прямой TAM | $671M | $470M | не считать прямым рынком Alina | использовать только как benchmark retention/progression/monetization mechanics, не включать в прямой TAM Alina |
| astrology_esoterics | прямой adjacent-рынок | $374M | $262M | поддержано proxy, но нужен ручной paid-flow/WTP | использовать как directional market-money anchor до ручного paywall, ICP и WTP evidence |
| avatar_identity | широкий adjacent-рынок с сильным consumer-discount | $420M | $294M | поддержано proxy, но нужен ручной paid-flow/WTP | использовать как money context с сильным consumer/self-improvement discount |
| coaching | прямой adjacent-рынок | $300M | $210M | широкий диапазон источников, нужен conservative range | использовать как directional market-money anchor до ручного paywall, ICP и WTP evidence |
| mindfulness | прямой adjacent-рынок | $252M | $176M | поддержано proxy, но нужен ручной paid-flow/WTP | использовать как directional market-money anchor до ручного paywall, ICP и WTP evidence |
| intersection | расчетное пересечение Alina | $202M | $80.8M | модельное пересечение, высокий риск завысить claim | читать как рабочий modeled SAM для проверки, а не как прогноз выручки или investor-grade market claim |

Для H2 это означает жесткую границу: TAM/SAM/SOM доказывает, что рынок достаточно интересен для проверки, но не доказывает, что Alina заработает эти деньги. H2 можно усиливать только после product-matched paid-flow signoff, willingness-to-pay в ICP-интервью и paid-depth signal в прототипных сессиях.

| Сценарий | Reachable users | Activation | Paid conv | ARPPU | Annual revenue | Как читать |
| --- | ---: | --- | --- | --- | ---: | --- |
| defensive | 100,000 | 25% | 2% | $50 | $25,000 | маленький validation business, полезен для проверки, но не для venture claim |
| conservative | 250,000 | 32% | 3% | $60 | $144,000 | ранний нишевый бизнес, имеет смысл при сильной удерживаемости |
| base | 1,000,000 | 40% | 5% | $80 | $1.6M | ранний нишевый бизнес, имеет смысл при сильной удерживаемости |
| strong_niche | 2,500,000 | 45% | 7% | $95 | $7.5M | venture-relevant только если retention и paid depth реально работают |
| upside | 5,000,000 | 50% | 9% | $110 | $24.8M | крупный outcome требует доказанного distribution, retention и WTP |
| breakout | 10,000,000 | 55% | 11% | $125 | $75.6M | крупный outcome требует доказанного distribution, retention и WTP |

## СЦЕНАРИИ ВХОДА КАК СВЯЗУЮЩЕЕ ЗВЕНО

Сценарии входа для Alina не завязаны на один канал. Логичнее рассматривать несколько мировых consumer-entry сценариев. Первый сценарий - пользователь приходит из состояния тревоги, усталости или перегруза и ищет короткий reset. Второй сценарий - пользователь приходит из self-improvement контекста: он хочет двигаться вперед, но устал от жестких streak и сложных систем. Третий сценарий - пользователь приходит из spiritual/meaning контекста и хочет не просто читать интерпретацию, а превратить ее в действие. Четвертый сценарий - пользователь приходит через avatar/identity интерес и хочет видеть, что версия себя меняется. Пятый сценарий - пользователь возвращается через мягкую progression-механику, если она не выглядит как манипулятивная игра.

Таким образом, рынок Alina должен рассматриваться не по одному каналу входа, а как пересечение потребностей: состояние, смысл, действие, видимость прогресса и возвращаемость.

## ОПРЕДЕЛЕНИЕ КОНКУРЕНТОВ И ГИПОТЕЗА #3

Конкурентная среда подтверждает, что пользователь уже решает части задачи через существующие приложения. В top-100 review сейчас есть meditation apps, habit trackers, AI journals, spiritual guidance apps, avatar/identity apps и progression products. Рынок не пустой, поэтому сильная ставка Alina не может звучать как “конкурентов нет”. Ставка должна быть точнее: конкуренты закрывают отдельные части петли, но полная причинная связка meaning -> action -> reset -> visible identity/progress встречается редко и требует ручной проверки.

Чтобы конкурентная карта не выглядела как случайный список приложений, ниже она сведена в archetype rollup. Это промежуточная классификация по App Store metadata/reviews/IAP и AI-assisted scorecards: она показывает, какие типы конкурентов создают риск для Alina, но не заменяет walkthrough. Особенно важно смотреть не только на количество приложений, а на close/direct count, behavior-tied progression и manual targets. Отдельная осторожность: AI companion / tarot-oracle labels требуют taxonomy cleanup перед сильными выводами, потому что source classifier может смешивать symbolic guidance и roleplay/companion продукты.

| Archetype | Market role | Top-100 apps | Close/direct | Behavior-tied | Paid signal | Battlecards | Manual targets | Taxonomy | Top examples |
| --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | --- | --- |
| ai_companion_roleplay | AI companion / identity benchmark | 1 | 1 | 0 | 1 | 1 | 1 | taxonomy_needs_manual_cleanup_before_claim_use | Habit Tracker (high_priority_close_substitute; score 29) |
| astrology_guidance | astrology / esoterics | 12 | 6 | 0 | 4 | 0 | 0 | usable_for_directional_grouping | Sol - Inner Life & Wellbeing (high_priority_close_substitute; score 30.1) / Pocket Insight Psychic Reading (high_priority_close_substitute; score 27.7) / Bodhi: Astrology & Horoscope (high_priority_close_substitute; score 25.2) / Lunaria AI - Soulmate Drawing (close_substitute; score 21.4) |
| avatar_identity_coaching | avatar / identity + coaching | 19 | 17 | 0 | 6 | 3 | 3 | usable_for_directional_grouping | Zing AI: Home & Gym Workouts (high_priority_close_substitute; score 34) / Daily Yoga: Yoga for Fitness® (high_priority_close_substitute; score 31.6) / Vida Health (high_priority_close_substitute; score 31) / Daily Burn: Workout Coach (high_priority_close_substitute; score 31) |
| faith_devotional_habit | spiritual meaning / habit loop | 8 | 6 | 1 | 3 | 1 | 1 | usable_for_directional_grouping | Shepherd: Spiritual Bible BFF (direct_reference_competitor; score 40.9) / Good Morning Messages & Images (high_priority_close_substitute; score 27.6) / Testimonio (close_substitute; score 22.7) / Pactly: Social Habit Tracker (close_substitute; score 22) |
| gamified_self_improvement | coaching / habits / progression | 13 | 12 | 0 | 8 | 1 | 1 | usable_for_directional_grouping | LifeWheel Goal Habit Tracker (high_priority_close_substitute; score 29.7) / Habit Tracker - Statz (high_priority_close_substitute; score 28.6) / OtterLife: AI Health Tracker (high_priority_close_substitute; score 28) / Ricky Kalmon (high_priority_close_substitute; score 26.6) |
| manifestation_tool | astrology / manifestation / self-improvement | 30 | 27 | 0 | 14 | 6 | 6 | usable_for_directional_grouping | Miracle Morning Routine (high_priority_close_substitute; score 33.7) / EVOLVE: Transform Your Life (high_priority_close_substitute; score 31) / Rosebud: AI Journal & Diary (high_priority_close_substitute; score 30.5) / Habit Tracker : Haby (high_priority_close_substitute; score 29.9) |
| tarot_or_oracle_guidance | tarot / oracle / symbolic guidance | 7 | 4 | 0 | 3 | 0 | 0 | taxonomy_needs_manual_cleanup_before_claim_use | Harem AI - Chat & Talk & Crush (high_priority_close_substitute; score 29.1) / Kokoa AI: Roleplay AI Chat (high_priority_close_substitute; score 27.8) / Spark AI: Chat with Characters (high_priority_close_substitute; score 27) / LunaMate: AI Fanstasy Roleplay (high_priority_close_substitute; score 25.6) |

Отдельно вынесена очередь taxonomy cleanup. Это не “исправленный датасет”, а список строк, где текущий classifier может смешивать AI companion, roleplay, tarot/oracle и habit-tracking продукты. Пока статус у всех строк queued_not_applied: эти замечания помогают читать competitor map критично, но не апгрейдят гипотезы без ручного подтверждения.

| ID | Rank | App | Current | Suggested | Status | Почему |
| --- | ---: | --- | --- | --- | --- | --- |
| TAX_01 | 12 | LunaMate: AI Fanstasy Roleplay | tarot_or_oracle_guidance | ai_companion_roleplay | suggested_change | публичное описание сильнее указывает на AI characters/companions/roleplay, чем на tarot/oracle symbolic guidance |
| TAX_02 | 13 | Kokoa AI: Roleplay AI Chat | tarot_or_oracle_guidance | ai_companion_roleplay | suggested_change | публичное описание сильнее указывает на AI characters/companions/roleplay, чем на tarot/oracle symbolic guidance |
| TAX_03 | 14 | Harem AI - Chat & Talk & Crush | tarot_or_oracle_guidance | ai_companion_roleplay | suggested_change | публичное описание сильнее указывает на AI characters/companions/roleplay, чем на tarot/oracle symbolic guidance |
| TAX_04 | 15 | Spark AI: Chat with Characters | tarot_or_oracle_guidance | ai_companion_roleplay | suggested_change | публичное описание сильнее указывает на AI characters/companions/roleplay, чем на tarot/oracle symbolic guidance |
| TAX_05 | 24 | Intuitive Life Coaching Oracle | tarot_or_oracle_guidance | tarot_or_oracle_guidance | confirm_or_manual_read | публичное описание действительно указывает на oracle/tarot/symbolic guidance |
| TAX_06 | 45 | Guiding Light Oracle Cards | tarot_or_oracle_guidance | tarot_or_oracle_guidance | confirm_or_manual_read | публичное описание действительно указывает на oracle/tarot/symbolic guidance |
| TAX_07 | 54 | PALs by Tavus: AI Companions | tarot_or_oracle_guidance | ai_companion_roleplay | suggested_change | публичное описание сильнее указывает на AI characters/companions/roleplay, чем на tarot/oracle symbolic guidance |
| TAX_08 | 62 | Habit Tracker | ai_companion_roleplay | gamified_self_improvement | suggested_change | публичное описание сильнее указывает на habit tracking/routine/planning, чем на AI companion roleplay |

| Конкурент | Риск | Priority | Money proxy | Что проверить |
| --- | --- | ---: | --- | --- |
| Shepherd: Spiritual Bible BFF | прямой reference-риск | 162.8 | сильный bottom-up proxy | проверить full-loop первым |
| Zing AI: Home & Gym Workouts | сильный платный close substitute | 112 | сильный bottom-up proxy | проверить action -> progress causality |
| Miracle Morning Routine | сильный платный close substitute | 111.4 | сильный bottom-up proxy | проверить action -> progress causality |
| EVOLVE: Transform Your Life | сильный платный close substitute | 106 | сильный bottom-up proxy | проверить action -> progress causality |
| Daily Yoga: Yoga for Fitness® | сильный платный close substitute | 99.2 | сильный bottom-up proxy | проверить action -> progress causality |
| Daily Burn: Workout Coach | сильный платный close substitute | 98 | сильный bottom-up proxy | проверить action -> progress causality |
| Myla : Manifest & Vision Board | высокий close-substitute риск | 97.6 | средний bottom-up proxy | проверить action -> progress causality |
| Rosebud: AI Journal & Diary | высокий close-substitute риск | 97 | средний bottom-up proxy | проверить action -> progress causality |
| Habit Tracker : Haby | высокий close-substitute риск | 95.8 | средний bottom-up proxy | проверить action -> progress causality |
| Goddess・Women's Wellness Coach | высокий close-substitute риск | 95.8 | средний bottom-up proxy | проверить action -> progress causality |
| LifeWheel Goal Habit Tracker | высокий close-substitute риск | 95.4 | средний bottom-up proxy | проверить action -> progress causality |
| Habit Tracker | сильный платный close substitute | 94 | сильный bottom-up proxy | проверить action -> progress causality |

Гипотеза №3: востребованным может стать не отдельный mindfulness, habit, astrology или avatar product, а связанная система, где смысл быстро превращается в действие, а действие становится видимым. Главный риск для этой гипотезы - скрытый прямой клон внутри onboarding P0-конкурентов, прежде всего Shepherd: Spiritual Bible BFF.

## ГДЕ ДЫРЫ И ВОЗМОЖНОСТЬ ОТЛИЧИТЬСЯ

| Направление | Full-loop rate | Opportunity | Как читать |
| --- | ---: | --- | --- |
| Mindfulness / reset | 3.82% | возможность есть, но нужна выборочная ручная проверка | H3 можно держать как narrow directional whitespace: full-loop-like кандидаты редки, но sampling обязателен. |
| Avatar / identity | 2.83% | возможность есть, но нужна выборочная ручная проверка | H3 можно держать как narrow directional whitespace: full-loop-like кандидаты редки, но sampling обязателен. |
| Astrology / esoterics | 13.70% | рынок видим, но claim о whitespace слабый без нового evidence | H3 не усиливать: плотность/контекст/прямота пока слишком неоднозначны. |
| Coaching / self-improvement | 13.02% | рынок видим, но claim о whitespace слабый без нового evidence | H3 не усиливать: плотность/контекст/прямота пока слишком неоднозначны. |
| Gaming / progression benchmark | 1.03% | механический benchmark, не основной whitespace | Не использовать как H3 proof. Это источник механик, а не доказательство рынка Alina. |

Наиболее перспективная формулировка белого пятна: не “новый wellness app”, а короткая трансформационная петля с причинным visual feedback. Если прогресс меняется произвольно, продукт станет декоративным avatar toy. Если действие никак не связано со смыслом, продукт станет обычным habit tracker. Если reset живет отдельно, продукт станет библиотекой практик. Поэтому отличие должно проверяться именно на связке, а не на отдельных функциях.

## СВЯЗКА WHITESPACE И АУДИТОРИИ

Белое пятно нельзя оценивать отдельно от аудитории. Даже если full-loop candidates редки, это становится продуктовой возможностью только там, где есть люди с recent behavior, current workaround и языком боли. Поэтому следующий слой соединяет H3 и H5: по каждому мировому направлению видно, какой разрыв найден в конкурентной среде, какой ICP туда ложится и какой первый validation move нужен.

| Рынок | Full-loop rate | Whitespace read | ICP fit | Первый validation move |
| --- | --- | --- | --- | --- |
| Mindfulness / reset | 3.82% | узкое белое пятно выглядит правдоподобно: full-loop candidates редки, но нужен P0 walkthrough | ICP_D: Habit and progress users / ICP_C: Anxious daily reset users | сначала проверить P0-аудиторию через recent behavior интервью, затем walkthrough high-risk конкурентов |
| Avatar / identity | 2.83% | узкое белое пятно выглядит правдоподобно: full-loop candidates редки, но нужен P0 walkthrough | ICP_E: Cozy/casual progression users / ICP_B: Avatar identity builders | использовать как compare-сегмент после P0 ICP и high-risk competitor walkthrough |
| Gaming / progression benchmark | 1.03% | использовать как источник механик прогресса и возврата, но не как прямое доказательство whitespace Alina | ICP_E: Cozy/casual progression users | взять progression/avatar/retention паттерны в прототип, но не использовать gaming как H3 proof |
| Coaching / self-improvement | 13.02% | рынок видим и плотен; whitespace claim слабый без нового ручного evidence | ICP_A: Spiritual self-improvers / ICP_D: Habit and progress users | сначала проверить P0-аудиторию через recent behavior интервью, затем walkthrough high-risk конкурентов |
| Astrology / esoterics | 13.70% | рынок видим и плотен; whitespace claim слабый без нового ручного evidence | ICP_A: Spiritual self-improvers | сначала проверить P0-аудиторию через recent behavior интервью, затем walkthrough high-risk конкурентов |

Практический вывод: mindfulness и avatar/identity выглядят как самые чистые whitespace-поля по редкости full-loop candidates, но они все равно требуют walkthrough. Astrology/esoterics и coaching дают сильную аудиторию и деньги, но full-loop rate выше, поэтому claim о белом пятне там слабее. Gaming остается benchmark механик, а не прямой рынок.

## АУДИТОРИЯ, ИНТЕРВЬЮ И ГИПОТЕЗА #4

На текущем этапе аудитория описывается не демографией, а поведением. Рабочее название - digital ritual users: люди, которые уже используют приложения, чтобы регулировать состояние, видеть движение вперед, получать личный смысл, возвращаться к практике и иногда платить за персонализацию, глубину или поддержку.

| Сегмент | Приоритет | Score | Core job |
| --- | --- | ---: | --- |
| Spiritual self-improvers | P0: начинать интервью и прототип с этого сегмента | 10 | Turn symbolic/personal meaning into one grounded action today. |
| Habit and progress users | P0: начинать интервью и прототип с этого сегмента | 10 | Make vague growth concrete and keep momentum without streak anxiety. |
| Anxious daily reset users | P1: использовать как сравнение после P0 | 9 | Calm down quickly and return to the day with one manageable next step. |
| Cozy/casual progression users | P1: использовать как сравнение после P0 | 9 | Return because progress feels gentle, visible, and emotionally rewarding. |
| Coaching professionals and structured growth users | P1: использовать как сравнение после P0 | 9 | Get structured guidance that turns intention into accountable practice. |
| Avatar identity builders | P1: использовать как сравнение после P0 | 8 | See a version of myself change as I make progress. |

Первые интервью и прототипные сессии нужно начинать с двух P0-сегментов: Spiritual self-improvers и Habit and progress users. Первый проверяет, доверяет ли пользователь personal meaning enough to act. Второй проверяет, может ли action-tied progress заменить обычный checklist или streak pressure.

Гипотеза №4: primary-аудитория Alina находится среди людей, которые уже имеют recent behavior вокруг daily ritual, progress, reset или personal meaning, и которым нужна не новая функция, а более короткий и связанный цикл изменения.

## КЛЮЧЕВЫЕ НАБЛЮДЕНИЯ И ВОПРОСЫ ДЛЯ ПРОВЕРКИ

| Тема | Signals | Вопрос для интервью |
| --- | ---: | --- |
| Ежедневный якорь и повторяемый ритуал | 3,234 | Расскажи про последний цифровой ритуал, к которому ты возвращался несколько дней подряд. Что именно заставляло открыть его снова? |
| Видимый прогресс и доказательство, что действие помогает | 5,931 | Когда ты в последний раз бросил практику, потому что не видел, что она реально работает? |
| Перегруз, streak anxiety и тяжелые productivity-системы | 2,301 | Что в последнем self-improvement/productivity app стало слишком тяжелым или давящим? |
| Персонализация и ощущение “меня увидели” | 4,743 | Какая персональная подсказка за последний месяц попала в точку, а какая показалась пустой или манипулятивной? |
| Доверие, безопасность и граница мягкого guidance | 1,263 | Что сделало бы такой продукт небезопасным, cringe, манипулятивным или не для тебя? |
| Глубина, свежесть и кастомизация после первого value moment | 1,544 | За какую глубину в похожем продукте тебе было бы не жалко платить после первой бесплатной пользы? |
| Цена, подписка и доказательство ценности | 1,312 | За что ты уже платишь в этой зоне и что должно случиться бесплатно, чтобы подписка стала честной? |
| Рекомендации, принадлежность и легкость рассказа другу | 2,431 | Как бы ты одним предложением объяснил другу, зачем это открыть завтра? |

Вопросы для следующей проверки должны быть прикладными, как в образце: какой последний цифровой ритуал человек реально использовал; что стало слишком тяжелым или давящим; за какую глубину он уже платит; какая персональная подсказка показалась точной; как он объяснил бы продукт другу; что сделало бы продукт небезопасным, cringe или манипулятивным.

## ИТОГОВАЯ МОДЕЛЬ ПРОДУКТА И ГИПОТЕЗА #5

По текущим данным продуктовая модель должна опираться на несколько столпов. Первый столп - персональное отражение дня, которое не выглядит generic motivation. Второй - одно маленькое действие, связанное со смыслом. Третий - короткий reset, который снижает трение перед действием. Четвертый - visible progress или avatar/identity feedback, который меняется причинно. Пятый - мягкий next-day hook без наказания и streak anxiety.

| Шаг | Экран | Роль | Что должно сработать |
| --- | --- | --- | --- |
| 1 | Daily meaning entry | Вход в личный смысл: пользователь должен почувствовать, что это не generic motivation и не жесткое предсказание. | Participant can explain why this is personal rather than generic content. |
| 2 | Tiny context prompt | Минимальный контекст: петля получает живую точку дня, но не превращается в длинный onboarding. | Participant supplies a concrete lived moment or emotional target. |
| 3 | One grounded action | Перевод смысла в действие: центральная проверка, что Alina не остается чтением или дневником. | Participant sees the action as doable and causally linked to the chosen theme. |
| 4 | Short reset | Снижение трения: reset должен помогать начать действие, а не выглядеть как отдельная медитация ради медитации. | Participant feels the reset makes action easier without feeling clinical. |
| 5 | Action evidence | Легкое доказательство действия: self-report должен быть достаточным и не ощущаться как контроль. | Participant accepts lightweight self-report as enough evidence. |
| 6 | Identity/avatar feedback | Причинная видимость прогресса: ключевой момент H4/H6, где действие должно объяснять изменение identity/avatar. | Participant understands action -> identity/avatar causality. |
| 7 | Next-day hook | Возврат без наказания: continuity должен поддерживать привычку без streak anxiety. | Participant wants to return and understands continuity. |
| 8 | Immediate value check | Проверка понимания: пользователь должен назвать интегрированную петлю своими словами. | Participant names the integrated loop in their own words. |

Гипотеза №5: устойчивый MVP возможен, если пользователь за одну короткую сессию понимает причинность петли, чувствует отличие от обычного tracker/meditation/reading app и может объяснить, зачем вернуться завтра. Пока это не доказано: нужны prototype sessions, scorecard и WTP-вопросы.

## СТОЛПЫ УВЕРЕННОСТИ И ОТКРЫТЫЕ РИСКИ

Первый столп уверенности - масштаб мирового adjacent landscape: база уже достаточно велика, чтобы видеть рынки и конкурентов. Второй - money proxy: в соседних категориях видны платные привычки. Третий - повторяющиеся pain themes: пользователи говорят о visible progress, personalization, daily anchor, subscription value и trust/safety. Четвертый - narrow whitespace: полная петля выглядит редкой, но только до ручной проверки.

Главные риски остаются открытыми. P0-конкуренты могут закрывать петлю внутри onboarding. Пользователи могут прочитать avatar/progress как детскую декорацию. Spiritual/meaning layer может вызвать недоверие или safety objection. Paywall может быть понятен в соседних рынках, но не в Alina. Поэтому следующий этап должен не украшать отчет, а собирать observed evidence.

## СПИСОК ВОПРОСОВ И ПРОВЕРОК ДЛЯ СЛЕДУЮЩЕГО ЭТАПА

Следующий слой исследования должен собираться как evidence protocol. По каждой гипотезе нужно заранее определить вопрос, наблюдение, артефакт и правило понижения уверенности. Если нет capture row, скриншота, цитаты, цены, walkthrough-заметки или scorecard-метрики, то гипотеза не апгрейдится.

| Гипотеза | Блок | Вопрос / проверка | Что сохранить | Сигнал усиления | Сигнал ослабления |
| --- | --- | --- | --- | --- | --- |
| H1 | Форма продукта и hidden-clone риск | Открой P0-конкурента от первого экрана до первого value moment: есть ли там связка личный смысл -> маленькое действие -> reset -> видимый progress/avatar feedback? | listing screenshot / onboarding first value / first action / progress/avatar feedback / paywall/free boundary / inspector notes | Минимум пять P0-приложений вручную прошли все walkthrough-слоты, и полный скрытый клон Alina не найден. | Любой P0-конкурент уже владеет полной петлей Alina с причинностью action -> identity/avatar. |
| H2 | Деньги и willingness-to-pay | В каждом high-money конкуренте зафиксируй, где появляется первый честный paywall: до value moment или после него, какая цена, trial, годовая скидка и какая именно depth продается. | public pricing screenshot / app/product match / trial length / monthly/annual price / first meaningful paywall boundary | Для high-money конкурентов подтверждены цена, trial, граница paywall и связь платной глубины с похожей пользовательской работой. | Платные сигналы относятся к нерелевантным продуктам, parent pages, login-gated страницам или paywall появляется до понятной ценности. |
| H2 | Деньги и willingness-to-pay | За что ты уже платишь в этой зоне и что должно случиться бесплатно, чтобы подписка стала честной? | free_value_moment/paid_depth_feature/acceptable_price_range/friend_explanation/return_trigger | участник называет paid depth после free value moment и может объяснить продукт своими словами | вся ценность ожидается бесплатно, paid depth не связана с loop, или продукт невозможно пересказать |
| H3 | Белое пятно и отличие | После walkthrough конкурента выпиши, что именно он закрывает: meaning, action, reset, visual progress, identity/avatar, causality. Где петля разрывается? | listing screenshot / onboarding first value / first action / progress/avatar feedback / paywall/free boundary / inspector notes | Ручной walkthrough подтверждает, что behavior-tied identity/avatar progression остается редкой среди high-risk substitutes. | Walkthrough показывает распространенные full-loop substitutes или подтверждает скрытый клон. |
| H4 | Конкурентное преимущество в прототипе | На экране изменения спросить: что изменилось, почему это изменилось и какое действие это вызвало? | completion_time_seconds/comprehension_yes_no/meaning_lift_1_5/differentiation_1_5/return_intent_1_5/verbatim_quote/fatal_objection | Не менее 80% участников прототипа правильно объясняют причинность personal meaning -> action -> avatar/progress. | Менее 50% участников могут объяснить причинную петлю без подсказки. |
| H5 | Аудитория и recent behavior | Какие приложения, ритуалы, дневники, игры, guidance tools, коучи или avatar-продукты ты реально использовал за последние 30 дней, и что запустило последнее использование? | recent_behavior_match/current_tool/trigger_of_last_use/segment_fit_yes_no | есть recent behavior и конкретный триггер последнего использования | поведение абстрактное, давно не было, или сегмент выбран по вкусу исследователя |
| H5 | Аудитория и current workaround | Расскажи про последний реальный момент, когда тебе нужно было превратить личный смысл, состояние или внутренний сигнал в одно приземленное действие на сегодня. | specific_episode/workaround/pain_intensity_1_5/verbatim_language/rejected_patterns | участник рассказывает конкретный эпизод, current workaround и язык боли без наводки | участник рассуждает теоретически или проблема оказывается слабее текущих альтернатив |
| H6 | MVP-петля и продуктовое ядро | Пройди прототип от entry до tomorrow hook и попроси участника своими словами назвать продукт: что это, зачем он нужен и почему он может быть нужен завтра? | completion_time_seconds/comprehension_yes_no/meaning_lift_1_5/differentiation_1_5/return_intent_1_5/verbatim_quote/fatal_objection | MVP-петля остается понятной после прототипных сессий и обновления конкурентных walkthrough. | Петля требует слишком много трения или контента, либо пользователи не могут объяснить причинность. |
| H4/H5/H6 | Trust, safety и границы обещания | Что сделало бы такой продукт небезопасным, cringe, манипулятивным или не для тебя? | top_objection/trust_boundary/unsafe_phrase/manipulation_signal/participant_control_needed | Если Alina честно ограничивает обещания и дает контролируемое мягкое guidance, она может избежать части риска spiritual/AI/self-help продуктов. | Ослабить H4/H6 немедленно, если возникает повторяющийся fatal trust/safety objection. |

Такой порядок удерживает исследование от преждевременного вывода: сначала формулируется гипотеза, затем показывается рынок, затем конкуренты, затем открытые сомнения, затем интервью/прототип и только после этого обновляется решение. Для мирового рынка это особенно важно: объем данных большой, но решение должно приниматься не по размеру базы, а по тому, выдерживает ли продуктовая петля ручные проверки.

## БЛИЖАЙШАЯ ОЧЕРЕДЬ ВАЛИДАЦИИ

Чтобы следующий шаг был исполнимым, из общего command center выделена короткая P0-очередь. Она начинается с hidden-clone walkthrough конкурентов, затем добирает paid-flow evidence, потом проверяет ICP recent behavior и только после этого переводит прототип в scorecard. Такой порядок сохраняет причинность исследования: сначала убираем риск “это уже существует”, затем проверяем деньги, затем аудиторию, затем преимущество продукта.

| # | Поток | Цель | Гипотезы | Что сделать | Куда писать evidence |
| --- | --- | --- | --- | --- | --- |
| 1 | walkthrough конкурентов | Shepherd: Spiritual Bible BFF | H1/H3 | открыть listing/app, сохранить 5 слотов скриншотов, записать full-loop/directness/causality verdict | data_processed/manual_competitor_inspection_packet.csv |
| 2 | walkthrough конкурентов | Zing AI: Home & Gym Workouts | H1/H3 | открыть listing/app, сохранить 5 слотов скриншотов, записать full-loop/directness/causality verdict | data_processed/manual_competitor_inspection_packet.csv |
| 3 | walkthrough конкурентов | Miracle Morning Routine | H1/H3 | открыть listing/app, сохранить 5 слотов скриншотов, записать full-loop/directness/causality verdict | data_processed/manual_competitor_inspection_packet.csv |
| 4 | walkthrough конкурентов | EVOLVE: Transform Your Life | H1/H3 | открыть listing/app, сохранить 5 слотов скриншотов, записать full-loop/directness/causality verdict | data_processed/manual_competitor_inspection_packet.csv |
| 5 | walkthrough конкурентов | Daily Yoga: Yoga for Fitness® | H1/H3 | открыть listing/app, сохранить 5 слотов скриншотов, записать full-loop/directness/causality verdict | data_processed/manual_competitor_inspection_packet.csv |
| 6 | paywall и деньги | Character AI: Chat, Talk, Text | H2 | проверить screenshot/source, подтвердить цену, trial, product-match и границу первого paywall | data_processed/web_paywall_visual_adjudication.csv |
| 7 | paywall и деньги | Headspace: Sleep & Meditate | H2 | проверить screenshot/source, подтвердить цену, trial, product-match и границу первого paywall | data_processed/web_paywall_visual_adjudication.csv |
| 8 | paywall и деньги | Meditopia: Sleep & Meditation | H2 | проверить screenshot/source, подтвердить цену, trial, product-match и границу первого paywall | data_processed/web_paywall_visual_adjudication.csv |
| 9 | paywall и деньги | Nebula: Spiritual Guidance | H2 | проверить screenshot/source, подтвердить цену, trial, product-match и границу первого paywall | data_processed/web_paywall_visual_adjudication.csv |
| 10 | paywall и деньги | Carrom Pool: Disc Game | H2 | проверить screenshot/source, подтвердить цену, trial, product-match и границу первого paywall | data_processed/web_paywall_visual_adjudication.csv |
| 11 | ICP интервью | Spiritual self-improvers / screener | H5/H6 | спросить, какие приложения/ритуалы/дневники/коучи/avatar-tools участник использовал за 30 дней и что запустило последнее использование | data_processed/icp_validation_test_plan.csv |
| 12 | ICP интервью | Spiritual self-improvers / problem_interview | H5/H6 | разобрать последний реальный эпизод, current workaround, эмоциональную ставку и точный язык боли | data_processed/icp_validation_test_plan.csv |
| 13 | ICP интервью | Spiritual self-improvers / prototype_loop | H5/H6 | показать простую петлю meaning -> action -> reset -> avatar/progress -> tomorrow hook и попросить участника narrate flow | data_processed/icp_validation_test_plan.csv |
| 14 | ICP интервью | Spiritual self-improvers / positioning_test | H5/H6 | сравнить current tool, generic habit/coach и Alina angle; записать, что участник выбрал бы первым и почему | data_processed/icp_validation_test_plan.csv |

Эта очередь не заменяет полный validation command center. Она нужна как первый рабочий слой для следующих 12-24 часов: если заполнить хотя бы первые manual walkthrough и paid-flow задачи, отчет начнет переходить от desk evidence к наблюдаемым доказательствам.

## ПОКРЫТИЕ ИСХОДНОЙ ЦЕЛИ ДОКАЗАТЕЛЬСТВАМИ

Чтобы не смешивать “сделан исследовательский слой” и “доказана гипотеза”, ниже показано покрытие исходной задачи по частям. Это контрольная карта текущего состояния: где уже есть локальные файлы, методология и отчет, а где требуются observed rows.

| ID | Часть цели | Статус | Текущее evidence | Осталось | Следующий ход |
| --- | --- | --- | --- | --- | --- |
| GOAL_01_PLAN | Зафиксировать большой план задач и execution path | покрыто как рабочая система | 22 next-validation задач; 75 command-center задач; 5 runway шагов | план есть, но требует обновления после observed evidence | после каждой ручной проверки пересобирать backlog и gates |
| GOAL_02_SOURCE_SCALE | Расширить конкурентов и источники по 5 рынкам до большого масштаба | покрыто по raw 50k и dedup 30k+, dedup 50k остается aspiration | raw=67525; dedup=36694; dedup50_status=open; source_refs=239857 | нельзя писать, что 50k dedup уникальных конкурентов доказаны; доказаны raw 50k и dedup 30k-40k band | расширять source-native lanes без тяжелого поискового crawl |
| GOAL_03_FIVE_MARKETS | Покрыть 5 направлений: mindfulness, coaching, astrology/esoterics, avatar/identity, gaming/progression | покрыто | 5 market rows; 5 whitespace/audience rows; 6 market methodology rows | gaming остается benchmark-only до direct audience overlap proof | сохранять gaming вне прямого TAM и H3 proof |
| GOAL_04_TAM_SAM_SOM | Подготовить рыночную методологию TAM/SAM/SOM и stress-сценарии | покрыто как range-based methodology, не финальный revenue proof | 6 methodology rows; 6 TAM/SAM/SOM rows; 6 stress scenarios | H2 не закрыт: paid-flow signoff ниже порога, WTP и paid-depth prototype signals еще нужны | добрать paid-flow capture rows и WTP вопросы из P0 backlog |
| GOAL_05_WHITESPACE_AUDIENCE | Собрать whitespace и аудиторные матрицы | покрыто как directional synthesis, validation остается открытой | 5 synthesis rows; 6 whitespace rows; 6 ICP rows; 20492 audience signal rows | H3/H5 нельзя усиливать без manual walkthrough и recent-behavior interviews | исполнить первые 5 walkthrough и P0 ICP interview rows |
| GOAL_06_REPORT_RU | Собрать последовательный русский мировой отчет и PDF/DOCX | покрыто как draft, не финальная validated версия | global report md=yes; pdf=yes; docx=yes; readability_audit_rows=7 | финальная версия должна обновиться после observed validation rows | после capture rows пересобрать отчет и изменить claim language |
| GOAL_07_VERSIONING | Сохранять локально, трассировать источники и версионировать через GitHub | покрыто активно | manifest=489; missing=0; docs=123; scripts=109 | manifest надо обновлять после каждого нового слоя | пересобирать manifest и делать commit/push после изменений |
| GOAL_08_VALIDATION | Критически мыслить и не закрывать гипотезы без observed evidence | открыто, capture-ready | gates=6; hold_validate=6; started=6; H1_completed=12 / 60; H1_success=0 / 25; H3_completed=12 / 60; H3_success=0 / 25; H2_completed=28 / 40; H2_success=8 / 12; H5_completed=12 / 96; H5_success=0 / 30; H4_completed=16 / 80; H4_success=0 / 32; H6_completed=16 / 80; H6_success=0 / 32 | цель нельзя считать завершенной, пока observed validation gates не закрыты или не понижены по evidence | исполнить P0 validation backlog и обновить gate statuses |

Главный вывод по этой карте: пакет уже масштабный и трассируемый, но не финально валидированный. Это правильное состояние для evidence-first ресерча: сильные desk/source слои готовы, а product/market claims остаются в hold_validate до ручных walkthrough, интервью, прототипа и WTP.

## ПРОВЕРКА СКЛАДНОСТИ И ЧИТАЕМОСТИ ОТЧЕТА

Отдельно проверено, складно ли текущая версия читается как русский мировой отчет, а не как случайная выгрузка таблиц. Вывод такой: логика гипотез уже держится, счетчики по нишам видны, границы доказательств прописаны, но документ остается плотным рабочим evidence pack. Для внешней версии позже нужен облегченный executive narrative, а тяжелые таблицы лучше вынести в appendix.

| Блок | Чтение | Риск | Что видно | Что делать |
| --- | --- | --- | --- | --- |
| Порядок повествования | складно | низкая | 19 крупных разделов; expected_sequence_breaks=0 | Сохранять этот порядок при следующих расширениях и не вставлять новые тяжелые таблицы до объясняющего абзаца. |
| Видимость счетчиков по нишам | складно | средняя | в отчете есть таблицы Direct app/store dedup, Total dedup, Top-100 apps и niche rollup | Оставить счетчики в основном тексте; если добавлять новые источники, обновлять niche rollup до PDF/DOCX. |
| Плотность таблиц | перегружено | высокая | markdown_table_rows=186 | В следующей итерации сделать два режима: executive narrative в основном PDF и heavy appendix для широких таблиц, сохранив текущий полный отчет как evidence pack. |
| Логичность competitor map | складно с оговоркой | средняя | competitor archetype rollup дополнен cleanup queue и прямой оговоркой queued_not_applied | После ручного taxonomy pass обновить top100 scorecard или оставить queue как documented limitation, если правки не подтверждены. |
| Русский текст и технические EN-термины | понятно, но много терминов | средняя | technical_english_hits=309 | Для внешней версии сделать отдельный glossary или заменить часть table headers на русские подписи; для рабочей версии оставить EN labels там, где они являются ID/полями данных. |
| Границы доказательств | складно | низкая | в тексте повторяются hold_validate, not final proof, source boundaries и запрет на claim upgrade без observed evidence | Не убирать эти границы ради красоты; лучше вынести краткий executive summary поверх них, если нужен более легкий PDF. |
| Ясность следующего шага | складно | низкая | есть P0 очередь: competitor walkthrough -> paid-flow -> ICP interview -> prototype session | Следующим рабочим ходом закрывать первые P0 walkthrough и paid-flow tasks, а не расширять desk research бесконечно. |

## ИСТОЧНИКИ И ГРАНИЦЫ ДОКАЗАТЕЛЬСТВ

Ниже зафиксирована короткая связка claim -> evidence -> boundary для этой мировой версии отчета. Это не полный manifest всех файлов, а читательский слой: он показывает, какие утверждения можно читать как desk/source support, а какие нельзя усиливать без ручных walkthrough, интервью, прототипных сессий или WTP-проверки.

| Claim | Раздел | Статус | Метрика | Граница |
| --- | --- | --- | --- | --- |
| SRC_01_PROJECT_AND_SCALE | Описание проекта и гипотеза #1 | доказано как исследовательский слой | 67525 cross-source raw rows; 36694 cross-source dedup rows; 39 coverage cells; 11 strong and 12 medium source/market cells | Это source/discovery coverage, а не ручная проверка каждого конкурента и не proof спроса. |
| SRC_02_MARKET_SIZING | Определение мировых целевых рынков и гипотеза #2 | поддержано направленно, но не финальный revenue/WTP proof | 6 market rows; 3 strong and 1 medium directional money cases | Market reports часто broad-category/paywalled; использовать как range-based sizing, не как прогноз выручки Alina. |
| SRC_03_COMPETITORS | Определение конкурентов и гипотеза #3 | готово к проверке, gate открыт | 100 top-candidate rows; 90 primary apps; 12 P0 inspection targets; 12 public listings inspected; taxonomy_cleanup_rows=8 | Public listings и scorecards не заменяют app/onboarding walkthrough screenshots. |
| SRC_04_WHITESPACE | Где дыры и возможность отличиться | поддержано направленно, но не финально доказано | 1/100 strict behavior-tied progression signals; 6 cross-source saturation markets; 2 benchmark-only markets; 12 P0 apps queued | Whitespace нельзя апгрейдить без manual walkthrough и final verdict_after_inspection. |
| SRC_05_AUDIENCE | Аудитория, интервью и гипотеза #4 | поддержано направленно, но не финально доказано | 20492 audience signal rows; 294 community/referral rows; 2339 coded Reddit mention rows; 1852 Reddit manual-read queue rows; 574 Reddit capture rows; 6 ICP segment hypotheses; 36 ICP validation tests; 24 ICP recruiting bridge rows | Audience rows и Reddit/forum signals не являются representative survey и не заменяют recent-behavior interviews. |
| SRC_06_PRODUCT_CORE | Итоговая модель продукта и гипотеза #5 | поддержано направленно, но не финально доказано | 12552 feature matrix rows; 100 product-core rows; 8 prototype screens | Product core не считается доказанным без заполненных prototype_session_capture_sheet и scorecard. |
| SRC_07_PROVENANCE | Источники и границы доказательств | доказано как исследовательский слой | 489 manifest artifacts; missing=0 | Manifest доказывает наличие файлов и хэши, но не заменяет содержательную валидацию claims. |
| SRC_08_SAMPLE_STYLE_REFERENCE | Логика гипотез и повествовательная форма | используется как style benchmark, не как market evidence | sample_docx_paragraphs=645; benchmark_doc=docs/decision/alina-sample-style-benchmark-v1.md | Образец задает композицию и русский нарратив; он не переносит российский рынок, локальные цифры или старую продуктовую гипотезу в мировой отчет. |
| SRC_09_NICHE_COUNT_ROLLUP | Определение мировых целевых рынков и гипотеза #2 | доказано как source-count rollup, не как PMF proof | 5 niche rows; file=data_processed/global_niche_count_rollup.csv | Niche count rollup показывает масштаб source discovery по рынкам; он не доказывает спрос, WTP или отсутствие скрытого full-loop конкурента. |
| SRC_10_REPORT_READABILITY | Проверка складности и читаемости отчета | проверено редакционным аудитом, не market proof | 7 readability audit rows | Readability audit оценивает форму и ясность текста; он не доказывает рыночные или продуктовые claims. |

## БЫСТРЫЕ ВЫВОДЫ ДЛЯ СТРАТЕГИИ

1. Мировой рынок вокруг Alina есть, но его нельзя сводить к одному TAM: это пересечение mindfulness, coaching, astrology/spiritual guidance, avatar/identity и progression mechanics.
2. Продуктовая ставка должна быть узкой: ежедневная причинная петля, а не комбайн функций.
3. Самые важные проверки - hidden-clone walkthrough, paid-flow signoff, P0 ICP interviews и prototype sessions.
4. Отчет должен оставаться на русском языке, но описывать мировой рынок и глобальные consumer-app категории.
5. Дальше исследование должно идти в строгой последовательности: гипотеза -> рынки -> конкуренты -> интервью -> уточнение гипотезы -> MVP -> вопросы -> вывод.

## Локальные файлы

- `reports/alina-global-hypothesis-report-v1.md`
- `output/pdf/alina-global-hypothesis-report-v1.pdf`
- `data_processed/global_hypothesis_source_appendix.csv`
- `data_processed/global_hypothesis_validation_questionnaire.csv`
- `data_processed/global_hypothesis_gate_snapshot.csv`
- `data_processed/global_next_validation_backlog.csv`
- `data_processed/global_report_readability_audit.csv`
- `data_processed/global_market_sizing_methodology.csv`
- `data_processed/global_niche_count_rollup.csv`
- `data_processed/global_whitespace_audience_synthesis.csv`
- `data_processed/global_competitor_archetype_rollup.csv`
- `data_processed/competitor_taxonomy_cleanup_queue.csv`
- `data_processed/global_goal_evidence_coverage.csv`
- `reports/alina-russian-readable-report-v2.md`
- `data_processed/russian_readable_niche_summary.csv`
- `data_processed/validation_gate_calculator.csv`
