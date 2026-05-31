# АУРА Research. Мировой рынок и логика гипотез

Собрано: 2026-05-31T19:14:23.520Z

## ОПИСАНИЕ ПРОЕКТА И ГИПОТЕЗА #1

Проект АУРА рассматривается не как отдельный трекер привычек, не как очередная библиотека медитаций и не как декоративный avatar app. Базовая идея шире: создать ежедневный цифровой ритуал, в котором пользователь получает личное отражение дня, выбирает одно маленькое действие, проходит короткий reset и видит, что его прогресс или образ себя изменился именно из-за сделанного шага.

География этого отчета - мировой consumer-app рынок. Русский язык здесь используется как язык повествования и принятия решения, а не как ограничение рынка: конкурентная карта, источники, категории и монетизация собираются глобально.

Логика продукта строится вокруг связки meaning -> action -> reset -> visible progress. В этой связке смысл не остается абстрактной интерпретацией, действие не превращается в тяжелую productivity-систему, reset не живет как отдельная медитация, а avatar/progress не является случайной косметикой. Ценность появляется только тогда, когда пользователь понимает причинность: я сделал маленький шаг, и поэтому мой образ прогресса изменился.

Гипотеза №1: на мировом consumer-app рынке есть место для приложения, которое объединяет личный смысл, короткое действие, reset и причинно видимый прогресс в одну ежедневную петлю. Эта гипотеза пока не доказана как product-market fit, но уже поддержана масштабной картой соседних рынков и конкурентных сигналов.

На текущем этапе собрано 68,085 сырьевых source-строк, 37,176 уникализированных строк и 557 локальных артефактов. Эти данные нужны не для того, чтобы объявить продукт доказанным, а для последовательной проверки: существует ли рынок, есть ли деньги, насколько плотна конкуренция, где может быть белое пятно, кто аудитория и какую MVP-петлю надо тестировать.

### Первые управленческие числа

Перед длинным evidence pack ниже вынесена короткая панель. Она отвечает на базовые вопросы: сколько данных собрано, сколько приложений/строк видно по каждой нише, где находится денежная модель, какие gates еще открыты и что делать дальше. Это не отдельное доказательство продукта, а навигация по текущему состоянию ресерча.

| Метрика | Значение | Как читать | Граница |
| --- | --- | --- | --- |
| Масштаб evidence base | 68,085 raw source-строк; 37,176 global dedup; 525 manifest artifacts | Пакет уже большой как карта рынка и конкурентов. | Масштаб строк не равен доказанному спросу или числу прямых клонов. |
| Покрытие пяти направлений | 5 market rows; 13,117 direct app dedup rows by niche; 43,144 all-source dedup rows by niche | По каждой нише видно, сколько данных лежит под выводами. | Niche dedup rows нельзя складывать как уникальные продукты: один продукт может жить в нескольких контекстах. |
| Денежная рамка H2 | intersection SAM $202M; weighted SAM $80.8M; sensitivity high-or-above 4/6 | Денежная зона выглядит достаточно большой, чтобы продолжать проверку. | Это range-based sizing, не revenue forecast и не закрытый H2 gate. |
| Статус гипотез | 6/6 gates hold_validate; H1 12 / 60; success 0 / 25; H2 28 / 48; success 8 / 12; H5 12 / 96; success 0 / 30 | Исследование готово к ручной проверке, но еще не готово к claim upgrade. | Listing-only, secondary VOC и prototype-readiness не заменяют observed walkthrough/interview/session evidence. |
| Следующий рабочий фокус | 22 next-validation tasks; readability rows=10; source-quality rows=5 | Следующий прирост качества должен прийти от observed rows, а не от бесконечного расширения desk research. | Backlog описывает работу, но не считается выполненным evidence. |

Самая важная читательская оговорка: счетчики по нишам показывают coverage и источник для анализа, а не количество прямых клонов АУРА и не доказанный спрос.

| Ниша | Сколько данных | Как читать | Граница |
| --- | --- | --- | --- |
| Mindfulness / reset | raw=15,109; all dedup=9,803; direct app dedup=2,550; top100=21; manual targets=0 | сильный money proxy | Счетчики показывают coverage, но не доказывают demand, WTP или отсутствие hidden clone. |
| Avatar / identity | raw=14,872; all dedup=9,952; direct app dedup=2,506; top100=49; manual targets=3 | сильный money proxy | Счетчики показывают coverage, но не доказывают demand, WTP или отсутствие hidden clone. |
| Astrology / esoterics | raw=5,427; all dedup=2,657; direct app dedup=2,206; top100=59; manual targets=7 | сильный money proxy | Счетчики показывают coverage, но не доказывают demand, WTP или отсутствие hidden clone. |
| Coaching / self-improvement | raw=7,671; all dedup=3,857; direct app dedup=2,651; top100=50; manual targets=8 | средний money proxy | Счетчики показывают coverage, но не доказывают demand, WTP или отсутствие hidden clone. |
| Gaming / progression benchmark | raw=24,446; all dedup=16,875; direct app dedup=3,204; top100=8; manual targets=0 | Использовать как benchmark механик прогресса, возврата и монетизации. | Gaming не считать прямым TAM АУРА до доказанного ritual/self-improvement overlap. |

| Гипотеза | Статус | Следующий шаг | Решение сейчас |
| --- | --- | --- | --- |
| H1: форма продукта существует | начато, но доказательств недостаточно; completed 12 / 60; success 0 / 25 | Нужна observed validation строка. | оставить hold_validate |
| H3: есть узкое белое пятно | начато, но доказательств недостаточно; completed 12 / 60; success 0 / 25 | Нужна observed validation строка. | оставить hold_validate |
| H2: в рынках есть деньги | начато, но доказательств недостаточно; completed 28 / 48; success 8 / 12 | Нужна observed validation строка. | оставить hold_validate |
| H5: общая аудитория существует | начато, но доказательств недостаточно; completed 12 / 96; success 0 / 30 | Нужна observed validation строка. | оставить hold_validate |
| H4: конкурентное преимущество правдоподобно | начато, но доказательств недостаточно; completed 16 / 80; success 0 / 32 | Нужна observed validation строка. | оставить hold_validate |
| H6: продуктовое ядро можно определить | начато, но доказательств недостаточно; completed 16 / 80; success 0 / 32 | Нужна observed validation строка. | оставить hold_validate |

Чтобы масштаб базы не читался как одинаковое качество источников, отдельно добавлен source-quality audit по пяти рынкам. Он показывает, где coverage ближе к прямым consumer-app конкурентам, где это скорее Steam/itch mechanics benchmark, а где нужны source-native lanes из backlog. Это защищает отчет от ложного вывода “много строк = все доказано”.

| Рынок | Direct dedup | Direct share | Benchmark dedup | Как читать source quality | Следующие lanes |
| --- | ---: | ---: | ---: | --- | --- |
| Mindfulness / reset | 2,550 | 25.8% | 6,608 | coverage пригоден для directionality, но требует ручного sampling перед claim upgrade | P0 Product Hunt / P0 AlternativeTo / P0 Chrome Web Store / browser extensions |
| Avatar / identity | 2,506 | 24.9% | 6,867 | coverage сильный по масштабу, но сильно benchmark/mechanics-heavy | P0 Product Hunt / P0 AlternativeTo / P0 Chrome Web Store / browser extensions |
| Astrology / esoterics | 2,206 | 81.7% | 366 | direct consumer-app coverage достаточно заметный для desk map | P0 Product Hunt / P1 Reddit/subreddit discovery as competitor source / P2 Public website/pricing pages for top candidates |
| Coaching / self-improvement | 2,651 | 68.6% | 485 | direct consumer-app coverage достаточно заметный для desk map | P0 Product Hunt / P0 AlternativeTo / P0 Chrome Web Store / browser extensions |
| Gaming / progression benchmark | 3,204 | 18.7% | 13,542 | coverage сильный по масштабу, но сильно benchmark/mechanics-heavy | P1 Microsoft Store / Mac App Store web / P1 itch.io / indie game directories / P1 Reddit/subreddit discovery as competitor source |

### Логика гипотез

Исследование специально построено как цепочка, а не как набор независимых таблиц. Сначала фиксируется продуктовая идея: если АУРА должна соединить смысл, действие, reset и видимый прогресс, то первая проверка - существует ли вообще такая форма продукта и не занята ли она уже конкурентами. После этого нужно понять, есть ли вокруг нее мировые рынки и деньги: без этого даже красивая продуктовая петля остается маленьким экспериментом.

Дальше проверка переходит к конкурентам и whitespace. Здесь важно не доказывать, что конкурентов нет, а увидеть, где именно существующие решения разрывают петлю: у одних есть reset без действия, у других действие без личного смысла, у третьих avatar без причинности, у четвертых прогресс без мягкого эмоционального входа. Только после этого имеет смысл говорить об аудитории: кто уже живет рядом с этой проблемой, какие приложения и ритуалы использует, за что платит и какие формулировки считает безопасными или манипулятивными.

Последний шаг - продуктовое ядро. Если рынки есть, конкуренты понятны, whitespace выглядит узким, а аудитория имеет recent behavior, тогда MVP должен проверять не весь возможный продукт, а одну причинную петлю: personal meaning -> tiny action -> short reset -> visible progress -> tomorrow hook. Пока эта цепочка не пройдет walkthrough, интервью и прототипные сессии, все выводы остаются evidence-first гипотезами, а не финальным go.

### Цепочка проверки: как строится исследование

Формат этого отчета дальше такой же, как в старом ресерче Алины: мы не просто складываем факты в папку, а идем по гипотезам. Сначала формулируем, что мы думаем. Потом объясняем, почему это вообще разумно проверять. Затем смотрим рынки, конкурентов, аудиторию и продуктовую петлю. После каждого шага фиксируем вывод и следующий вопрос.

| Гипотеза | Что мы думаем | Почему пошли проверять | Что смотрели | Текущий вывод |
| --- | --- | --- | --- | --- |
| H1 | Мы думаем, что АУРА может быть отдельной формой consumer-app, а не набором разрозненных функций. | Потому что на пересечении meaning, action, reset и visible progress может возникать ежедневный ритуал. | Пошли смотреть соседние рынки и конкурентов: есть ли уже такая форма и насколько она занята. | Форма выглядит правдоподобно, но hidden-clone риск открыт до ручных walkthrough. |
| H2 | Мы думаем, что вокруг этой формы есть деньги. | Потому что mindfulness, coaching, spiritual guidance, avatar/identity и progression уже монетизируются. | Собрали TAM/SAM/SOM, paid-flow proxy, IAP/pricing и market-money triangulation. | Money case сильный направленно, но это еще не revenue proof АУРЫ. |
| H3 | Мы думаем, что белое пятно есть не в отсутствии конкурентов, а в недособранной причинной петле. | Многие продукты закрывают reset, смысл, действие или avatar отдельно, но не обязательно связывают их причинно. | Собрали top competitors, archetypes, whitespace map и public-listing inspection. | Белое пятно узкое и интересное, но требует onboarding/app screenshots. |
| H4/H5 | Мы думаем, что у АУРЫ может быть общая аудитория с adjacent-продуктами. | Пользователь уже имеет recent behavior: ритуалы, journaling, self-improvement, spiritual guidance, progress tools. | Собрали ICP-сегменты, VOC, Reddit/forum/context signals и interview probes. | Лучшие первые сегменты: Spiritual self-improvers и Habit/progress users; нужны интервью. |
| H6 | Мы думаем, что продуктовое ядро должно быть одной короткой сессией, а не большим приложением. | Если причинность не считывается за одну сессию, avatar/progress станет декорацией, а reset — отдельной практикой. | Собрали MVP-loop, prototype stimulus, scorecard и P0 validation queue. | MVP сформулирован, но не доказан без prototype sessions. |

### Итог первого блока

На уровне идеи АУРА уже сформулирована достаточно узко: это не “еще одно wellness-приложение”, а daily ritual с причинной связкой между смыслом, действием и видимым изменением. Это делает исследование проверяемым: если в конкурентах уже есть такая же связка, гипотеза слабеет; если пользователи не считывают причинность в прототипе, продуктовая ставка тоже слабеет.

Следующий блок поэтому не пытается сразу доказать рынок деньгами. Он сначала показывает статус evidence: что уже собрано как desk/source layer, а что все еще требует ручных walkthrough, интервью, paywall-проверок и прототипных сессий.

## ТЕКУЩИЙ СТАТУС ДОКАЗАТЕЛЬСТВ

На этом этапе исследование уже масштабное как база источников, но еще не завершенное как наблюдаемая валидация. Поэтому главный вывод должен звучать аккуратно: кабинетный ресерч подтверждает, что направление стоит проверять, но большинство гипотез пока нельзя переводить в “доказано”. Ниже показано, какие ворота уже имеют наблюдаемые строки, а где пока есть только подготовленный пакет для ручной проверки.

| Гипотеза | Что проверяем | Поток проверки | Статус | Заполнено / нужно | Успехи / порог | Решение сейчас |
| --- | --- | --- | --- | --- | --- | --- |
| H1 | форма продукта существует | ручной walkthrough конкурентов | начато, но доказательств недостаточно | 12 / 60 | 0 / 25 | оставить hold_validate |
| H3 | есть узкое белое пятно | ручной walkthrough конкурентов | начато, но доказательств недостаточно | 12 / 60 | 0 / 25 | оставить hold_validate |
| H2 | в рынках есть деньги | проверка paywall и платной глубины | начато, но доказательств недостаточно | 28 / 48 | 8 / 12 | оставить hold_validate |
| H5 | общая аудитория существует | интервью ICP и recent behavior | начато, но доказательств недостаточно | 12 / 96 | 0 / 30 | оставить hold_validate |
| H4 | конкурентное преимущество правдоподобно | прототипные сессии и scorecard | начато, но доказательств недостаточно | 16 / 80 | 0 / 32 | оставить hold_validate |
| H6 | продуктовое ядро можно определить | прототипные сессии и scorecard | начато, но доказательств недостаточно | 16 / 80 | 0 / 32 | оставить hold_validate |

Практически это означает следующее: H1 и H3 уже имеют по 12 / 60 listing-only строк, но 0 / 25 успешных app-walkthrough строк, поэтому hidden-clone риск остается открытым. H2 имеет 28 / 48 заполненных paid-flow строк и 8 / 12 успешных строк, но тоже ниже минимального порога. H5 имеет 12 / 96 secondary VOC строк и 0 / 30 успешных interview строк: это контекст для рекрутинга, а не доказательство аудитории. H4 и H6 имеют по 16 / 80 prototype-readiness строк, но 0 / 32 успешных user-session строк. Это не слабость отчета, а защита от преждевременного вывода: большой массив конкурентов и источников показывает, куда идти, но не заменяет walkthrough, интервью и прототипные сессии.

### Управленческий rollup по validation evidence

Чтобы не путать подготовленный research layer с реальной валидацией, ниже сведены типы evidence по каждому gate. Важная граница: listing-only, secondary VOC и prototype-readiness помогают запускать проверку, но не апгрейдят гипотезы без наблюдаемых walkthrough/interview/session результатов.

| H | Тип evidence сейчас | Rows | Success | Success gap | Следующий реальный validation step |
| --- | --- | --- | --- | ---: | --- |
| H1 | listing-only evidence | 12 / 60 | 0 / 25 | 25 | пройти первые 5 P0-приложений от listing до onboarding, first action, avatar/progress feedback и paywall boundary |
| H3 | listing-only whitespace risk evidence | 12 / 60 | 0 / 25 | 25 | для тех же 5 P0-приложений классифицировать full_loop / adjacent_loop / weak_adjacency и action->avatar causality |
| H2 | paid-flow signoff evidence | 28 / 48 | 8 / 12 | 4 | добрать product-matched paid-flow rows с чистой ценой, trial/plan depth и first-value/paywall boundary |
| H5 | secondary VOC evidence | 12 / 96 | 0 / 30 | 30 | провести первые P0-интервью ICP_A/ICP_D и заменить secondary VOC rows реальными participant answers |
| H4 | prototype-readiness evidence | 16 / 80 | 0 / 32 | 32 | запустить prototype sessions и измерить comprehension, differentiation, meaning lift, trust/safety и return intent |
| H6 | prototype-readiness evidence | 16 / 80 | 0 / 32 | 32 | после prototype sessions обновить MVP loop и проверить, могут ли участники назвать продукт и причинность своими словами |

### Итог по статусу доказательств

Сейчас отчет можно честно читать так: исследовательская база большая, направление выглядит достойным проверки, но product/market claims остаются в статусе hold_validate. Это важная редакционная позиция, потому что она не продает иллюзию финального ответа там, где пока есть только подготовленный validation pipeline.

Из этого следует переход к рынкам: если продуктовая форма в принципе имеет смысл, надо понять, какие мировые adjacent-рынки дают ей денежный и поведенческий контекст, а какие являются только источником механик или сравнений.

## ОПРЕДЕЛЕНИЕ МИРОВЫХ ЦЕЛЕВЫХ РЫНКОВ И ГИПОТЕЗА #2

Для проверки первой гипотезы исследование выделяет пять мировых направлений. Они не равны пяти отдельным продуктам: каждое направление отвечает за один слой будущей ценности АУРА. Mindfulness дает reset и привычку платить за эмоциональное состояние. Coaching/self-improvement дает действие, структуру роста и язык прогресса. Astrology/esoterics дает личный смысл, символический контекст и willingness-to-pay за персональные интерпретации. Avatar/identity дает видимое отражение изменения. Gaming/progression используется как benchmark механик возврата, награды и прогресса, но не как прямой рынок АУРА.

| Направление | Direct app/store dedup | Total dedup | Top-100 apps | Роль в гипотезе |
| --- | ---: | ---: | ---: | --- |
| Mindfulness / reset | 2,550 | 9,723 | 21 | adjacent рынок для конкурентной карты |
| Avatar / identity | 2,506 | 7,944 | 49 | adjacent рынок для конкурентной карты |
| Astrology / esoterics | 2,206 | 2,657 | 59 | adjacent рынок для конкурентной карты |
| Coaching / self-improvement | 2,651 | 3,857 | 50 | adjacent рынок для конкурентной карты |
| Gaming / progression benchmark | 3,204 | 14,304 | 8 | benchmark механик, не прямой TAM |

Чтобы было понятно, что реально собрано по каждой нише, ниже отдельно показан rollup. Здесь есть три уровня: all-source rows показывают ширину карты, direct app-store dedup показывает ближнее consumer-app поле, а top-100/manual targets показывают, какие конкуренты уже вынесены в более внимательный review. Глобальный dedup пакета сейчас 37,176; нишевые dedup нельзя просто складывать, потому что один продукт может попадать в несколько тематических контекстов.

| Ниша | All raw | All dedup | Direct app dedup | Direct share | Top-100 | Manual targets | Coverage | Как читать |
| --- | ---: | ---: | ---: | --- | ---: | ---: | --- | --- |
| Mindfulness / reset | 15,181 | 9,865 | 2,550 | 25.8% | 21 | 0 | 9 groups; strong 3; medium 2 | возможность есть, нужен ручной sampling |
| Avatar / identity | 15,000 | 10,058 | 2,506 | 24.9% | 49 | 3 | 9 groups; strong 3; medium 2 | возможность есть, нужен ручной sampling |
| Astrology / esoterics | 5,475 | 2,700 | 2,206 | 81.7% | 59 | 7 | 8 groups; strong 1; medium 3 | рынок плотный или контекст неясен |
| Coaching / self-improvement | 7,679 | 3,864 | 2,651 | 68.6% | 50 | 8 | 8 groups; strong 1; medium 3 | рынок плотный или контекст неясен |
| Gaming / progression benchmark | 24,750 | 17,139 | 3,204 | 18.7% | 8 | 0 | 10 groups; strong 3; medium 2 | benchmark механик, не primary market |

### Что реально нашли по каждой нише: top-приложения

Ниже не методология, а конкретная картина рынка: по каждой нише показаны крупнейшие direct consumer-app примеры из уже собранной базы. Это не финальный список прямых конкурентов АУРЫ, но он отвечает на практический вопрос: “какие приложения мы вообще нашли, насколько крупные они по review scale и почему эта ниша релевантна”.

#### Mindfulness / reset

Mindfulness / reset: собрано 15,181 raw source-строк, 9,865 all-source dedup и 2,550 direct app/store dedup. В top-100 review вынесено 21 приложений, manual validation targets сейчас 0. Для АУРЫ эта ниша важна так: adjacent рынок для конкурентной карты; денежный сигнал: сильный направленный money case; opportunity: medium_opportunity_needs_sampling.

| Top app | Publisher | Источник | Reviews | Rating | Монетизация | Почему важно для АУРЫ |
| --- | --- | --- | ---: | --- | --- | --- |
| Calm | Calm.com | mobile_app_store | 1,956,370 | 4.77376 | free | Показывает рынок короткого reset, mental health, meditation, journaling или эмоциональной саморегуляции. Для АУРЫ это источник языка спокойного входа и ежедневного ритуала. релевантность видна по названию, категории и описанию. |
| Headspace: Sleep & Meditation | Headspace Inc. | mobile_app_store | 974,022 | 4.84264 | free | Показывает рынок короткого reset, mental health, meditation, journaling или эмоциональной саморегуляции. Для АУРЫ это источник языка спокойного входа и ежедневного ритуала. релевантность видна по названию, категории и описанию. |
| I am - Daily Affirmations | Monkey Taps | mobile_app_store | 715,211 | 4.84183 | free | Показывает рынок короткого reset, mental health, meditation, journaling или эмоциональной саморегуляции. Для АУРЫ это источник языка спокойного входа и ежедневного ритуала. релевантность видна по названию, категории и описанию. |
| Finch: Self-Care Pet | Finch Care Public Benefit Corporation | mobile_app_store | 704,428 | 4.94855 | free | Показывает рынок короткого reset, mental health, meditation, journaling или эмоциональной саморегуляции. Для АУРЫ это источник языка спокойного входа и ежедневного ритуала. релевантность видна по названию, категории и описанию. |
| Insight Timer: Meditate, Sleep | Insight Network Inc | mobile_app_store | 440,173 | 4.89501 | free | Показывает рынок короткого reset, mental health, meditation, journaling или эмоциональной саморегуляции. Для АУРЫ это источник языка спокойного входа и ежедневного ритуала. релевантность видна по названию, категории и описанию. |
| BetterSleep: Relax and Sleep | Ipnos Software Inc. | mobile_app_store | 390,333 | 4.74429 | free | Показывает рынок короткого reset, mental health, meditation, journaling или эмоциональной саморегуляции. Для АУРЫ это источник языка спокойного входа и ежедневного ритуала. релевантность видна по названию, категории и описанию. |
| Balance: Meditation & Sleep | The Mind Company | mobile_app_store | 119,464 | 4.88073 | free | Показывает рынок короткого reset, mental health, meditation, journaling или эмоциональной саморегуляции. Для АУРЫ это источник языка спокойного входа и ежедневного ритуала. релевантность видна по названию, категории и описанию. |
| Fabulous: Daily Habit Tracker | Fabulous | mobile_app_store | 87,905 | 4.44095 | free | Показывает рынок короткого reset, mental health, meditation, journaling или эмоциональной саморегуляции. Для АУРЫ это источник языка спокойного входа и ежедневного ритуала. релевантность видна по названию, категории и описанию. |

#### Avatar / identity

Avatar / identity: собрано 15,000 raw source-строк, 10,058 all-source dedup и 2,506 direct app/store dedup. В top-100 review вынесено 49 приложений, manual validation targets сейчас 3. Для АУРЫ эта ниша важна так: adjacent рынок для конкурентной карты; денежный сигнал: сильный направленный money case; opportunity: medium_opportunity_needs_sampling.

| Top app | Publisher | Источник | Reviews | Rating | Монетизация | Почему важно для АУРЫ |
| --- | --- | --- | ---: | --- | --- | --- |
| ChatGPT | OpenAI OpCo, LLC | mobile_app_store | 7,582,257 | 4.83563 | free | Показывает спрос на avatar/identity/AI companion механику. Для АУРЫ важно проверить, может ли образ себя меняться не декоративно, а причинно от действия. релевантность видна по названию, категории и описанию. |
| Grok - AI Chat & Video | X Corp. | mobile_app_store | 1,207,762 | 4.88381 | free | Показывает спрос на avatar/identity/AI companion механику. Для АУРЫ важно проверить, может ли образ себя меняться не декоративно, а причинно от действия. релевантность видна по названию, категории и описанию. |
| Character AI: Chat, Talk, Text | Character.AI | mobile_app_store | 535,071 | 4.33654 | free | Показывает спрос на avatar/identity/AI companion механику. Для АУРЫ важно проверить, может ли образ себя меняться не декоративно, а причинно от действия. релевантность видна по названию, категории и описанию. |
| ZEPETO: Avatar, Connect & Live | NAVER Z Corporation | mobile_app_store | 515,481 | 4.65143 | free | Показывает спрос на avatar/identity/AI companion механику. Для АУРЫ важно проверить, может ли образ себя меняться не декоративно, а причинно от действия. релевантность видна по названию, категории и описанию. |
| PolyBuzz: Chat with Characters | CLOUD WHALE INTERACTIVE TECHNOLOGY LLC. | mobile_app_store | 417,661 | 4.43872 | free | Показывает спрос на avatar/identity/AI companion механику. Для АУРЫ важно проверить, может ли образ себя меняться не декоративно, а причинно от действия. релевантность видна по названию, категории и описанию. |
| Lensa AI: Photo Editor | Prisma labs, inc. | desktop_store | 415,712 | 4.69597 | free_or_freemium_unknown | Показывает спрос на avatar/identity/AI companion механику. Для АУРЫ важно проверить, может ли образ себя меняться не декоративно, а причинно от действия. видимые теги: avatar_or_identity. |
| IMVU: Fun 3D Avatar Chat Game | IMVU | mobile_app_store | 364,215 | 4.60362 | free | Показывает спрос на avatar/identity/AI companion механику. Для АУРЫ важно проверить, может ли образ себя меняться не декоративно, а причинно от действия. релевантность видна по названию, категории и описанию. |
| Replika - AI Friend | Luka, Inc. | mobile_app_store | 227,803 | 4.44685 | free | Показывает спрос на avatar/identity/AI companion механику. Для АУРЫ важно проверить, может ли образ себя меняться не декоративно, а причинно от действия. релевантность видна по названию, категории и описанию. |

#### Astrology / esoterics

Astrology / esoterics: собрано 5,475 raw source-строк, 2,700 all-source dedup и 2,206 direct app/store dedup. В top-100 review вынесено 59 приложений, manual validation targets сейчас 7. Для АУРЫ эта ниша важна так: adjacent рынок для конкурентной карты; денежный сигнал: сильный направленный money case; opportunity: crowded_or_unclear_context.

| Top app | Publisher | Источник | Reviews | Rating | Монетизация | Почему важно для АУРЫ |
| --- | --- | --- | ---: | --- | --- | --- |
| Bible | Life.Church | mobile_app_store | 13,311,404 | 4.91606 | free | Показывает рынок personal meaning: horoscope, tarot, moon/spiritual guidance, manifestation или symbolic reflection. Для АУРЫ это источник входа через смысл, но не proof действия. релевантность видна по названию, категории и описанию. |
| Nebula: Spiritual Guidance | Spiritual Nebula Limited | mobile_app_store | 169,696 | 4.57524 | free | Показывает рынок personal meaning: horoscope, tarot, moon/spiritual guidance, manifestation или symbolic reflection. Для АУРЫ это источник входа через смысл, но не proof действия. релевантность видна по названию, категории и описанию. |
| Faladdin: Zodiac & Love | Truemium | mobile_app_store | 89,741 | 4.59496 | free | Показывает рынок personal meaning: horoscope, tarot, moon/spiritual guidance, manifestation или symbolic reflection. Для АУРЫ это источник входа через смысл, но не proof действия. релевантность видна по названию, категории и описанию. |
| Kaave: Tarot, Angel, Horoscope | Didilabs BV | mobile_app_store | 55,523 | 4.75138 | free | Показывает рынок personal meaning: horoscope, tarot, moon/spiritual guidance, manifestation или symbolic reflection. Для АУРЫ это источник входа через смысл, но не proof действия. релевантность видна по названию, категории и описанию. |
| CHANI: Your Astrology Guide | Chani Nicholas Incorporated | mobile_app_store | 54,144 | 4.91533 | free | Показывает рынок personal meaning: horoscope, tarot, moon/spiritual guidance, manifestation или symbolic reflection. Для АУРЫ это источник входа через смысл, но не proof действия. релевантность видна по названию, категории и описанию. |
| Sanctuary Psychic Reading | Sanctuary Ventures Inc | mobile_app_store | 44,109 | 4.79692 | free | Показывает рынок personal meaning: horoscope, tarot, moon/spiritual guidance, manifestation или symbolic reflection. Для АУРЫ это источник входа через смысл, но не proof действия. релевантность видна по названию, категории и описанию. |
| TimePassages Astrology | AstroGraph Software | mobile_app_store | 43,574 | 4.838 | free | Показывает рынок personal meaning: horoscope, tarot, moon/spiritual guidance, manifestation или symbolic reflection. Для АУРЫ это источник входа через смысл, но не proof действия. релевантность видна по названию, категории и описанию. |
| Daily Horoscope - Astrology! | Astera Dijital Hizmetler Anonim Sirketi | mobile_app_store | 35,630 | 4.62518 | free | Показывает рынок personal meaning: horoscope, tarot, moon/spiritual guidance, manifestation или symbolic reflection. Для АУРЫ это источник входа через смысл, но не proof действия. релевантность видна по названию, категории и описанию. |

#### Coaching / self-improvement

Coaching / self-improvement: собрано 7,679 raw source-строк, 3,864 all-source dedup и 2,651 direct app/store dedup. В top-100 review вынесено 50 приложений, manual validation targets сейчас 8. Для АУРЫ эта ниша важна так: adjacent рынок для конкурентной карты; денежный сигнал: средний направленный money case; opportunity: crowded_or_unclear_context.

| Top app | Publisher | Источник | Reviews | Rating | Монетизация | Почему важно для АУРЫ |
| --- | --- | --- | ---: | --- | --- | --- |
| Impulse - Brain Training | GMRD Apps Limited | mobile_app_store | 832,218 | 4.74822 | free | Показывает рынок self-improvement, habit, AI coach, routine или goal guidance. Для АУРЫ это источник action layer и paid-depth, но не proof мягкого ritual experience. релевантность видна по названию, категории и описанию. |
| Finch: Self-Care Pet | Finch Care Public Benefit Corporation | mobile_app_store | 704,428 | 4.94855 | free | Показывает рынок self-improvement, habit, AI coach, routine или goal guidance. Для АУРЫ это источник action layer и paid-depth, но не proof мягкого ritual experience. релевантность видна по названию, категории и описанию. |
| Structured: Daily Planner Todo | unorderly GmbH | mobile_app_store | 159,816 | 4.79678 | free | Показывает рынок self-improvement, habit, AI coach, routine или goal guidance. Для АУРЫ это источник action layer и paid-depth, но не proof мягкого ritual experience. релевантность видна по названию, категории и описанию. |
| Habit Tracker | InnerGrow | mobile_app_store | 141,431 | 4.79463 | free | Показывает рынок self-improvement, habit, AI coach, routine или goal guidance. Для АУРЫ это источник action layer и paid-depth, но не proof мягкого ritual experience. релевантность видна по названию, категории и описанию. |
| Productive - Habit Tracker | Mosaic S.r.l. | mobile_app_store | 91,108 | 4.59673 | free | Показывает рынок self-improvement, habit, AI coach, routine или goal guidance. Для АУРЫ это источник action layer и paid-depth, но не proof мягкого ritual experience. релевантность видна по названию, категории и описанию. |
| Fabulous: Daily Habit Tracker | Fabulous | mobile_app_store | 87,905 | 4.44095 | free | Показывает рынок self-improvement, habit, AI coach, routine или goal guidance. Для АУРЫ это источник action layer и paid-depth, но не proof мягкого ritual experience. релевантность видна по названию, категории и описанию. |
| Zing AI: Home & Gym Workouts | Zing Coach Inc. | mobile_app_store | 30,671 | 4.77053 | free | Показывает рынок self-improvement, habit, AI coach, routine или goal guidance. Для АУРЫ это источник action layer и paid-depth, но не proof мягкого ritual experience. релевантность видна по названию, категории и описанию. |
| Streaks | Crunchy Bagel | mobile_app_store | 27,335 | 4.81496 | paid | Показывает рынок self-improvement, habit, AI coach, routine или goal guidance. Для АУРЫ это источник action layer и paid-depth, но не proof мягкого ritual experience. релевантность видна по названию, категории и описанию. |

#### Gaming / progression benchmark

Gaming / progression benchmark: собрано 24,750 raw source-строк, 17,139 all-source dedup и 3,204 direct app/store dedup. В top-100 review вынесено 8 приложений, manual validation targets сейчас 0. Для АУРЫ эта ниша важна так: benchmark механик, не прямой TAM; денежный сигнал: деньги видны, но это benchmark, не прямой TAM; opportunity: mechanic_benchmark_not_primary_market.

| Top app | Publisher | Источник | Reviews | Rating | Монетизация | Почему важно для АУРЫ |
| --- | --- | --- | ---: | --- | --- | --- |
| Roblox | Roblox Corporation | mobile_app_store | 18,852,783 | 4.51961 | free | Показывает progression/quest/avatar benchmark. Для АУРЫ это не прямой TAM, а источник механик возврата, видимого прогресса и награды. релевантность видна по названию, категории и описанию. |
| 8 Ball Pool™ | Miniclip.com | mobile_app_store | 4,683,643 | 4.75221 | free | Показывает progression/quest/avatar benchmark. Для АУРЫ это не прямой TAM, а источник механик возврата, видимого прогресса и награды. релевантность видна по названию, категории и описанию. |
| Candy Crush Saga | King | mobile_app_store | 3,928,435 | 4.70617 | free | Показывает progression/quest/avatar benchmark. Для АУРЫ это не прямой TAM, а источник механик возврата, видимого прогресса и награды. релевантность видна по названию, категории и описанию. |
| Clash Royale | Supercell | mobile_app_store | 3,795,629 | 4.59762 | free | Показывает progression/quest/avatar benchmark. Для АУРЫ это не прямой TAM, а источник механик возврата, видимого прогресса и награды. релевантность видна по названию, категории и описанию. |
| Subway Surfers | Sybo Games ApS | mobile_app_store | 3,727,320 | 4.64777 | free | Показывает progression/quest/avatar benchmark. Для АУРЫ это не прямой TAM, а источник механик возврата, видимого прогресса и награды. релевантность видна по названию, категории и описанию. |
| MONOPOLY GO! | Scopely, Inc. | mobile_app_store | 3,684,825 | 4.79866 | free | Показывает progression/quest/avatar benchmark. Для АУРЫ это не прямой TAM, а источник механик возврата, видимого прогресса и награды. релевантность видна по названию, категории и описанию. |
| Royal Match | Dream Games | mobile_app_store | 3,668,789 | 4.69166 | free | Показывает progression/quest/avatar benchmark. Для АУРЫ это не прямой TAM, а источник механик возврата, видимого прогресса и награды. релевантность видна по названию, категории и описанию. |
| Discord - Talk, Play, Hang Out | Discord Inc. | mobile_app_store | 3,443,757 | 4.70101 | free | Показывает progression/quest/avatar benchmark. Для АУРЫ это не прямой TAM, а источник механик возврата, видимого прогресса и награды. релевантность видна по названию, категории и описанию. |

### Сверка счетчиков: почему числа не складываются в одно “количество приложений”

Чтобы не было ощущения, что в отчете смешаны несопоставимые данные, ниже отдельно сверены уровни счетчиков. Главное правило: global dedup, niche dedup и direct app-store dedup отвечают на разные вопросы. Global dedup показывает размер уникализированного пакета. Niche dedup показывает тематическую ширину каждой корзины. Direct app-store dedup ближе всего к вопросу “сколько consumer-app конкурентов видно в нише”, но и он не доказывает, что все эти продукты являются прямыми клонами АУРА.

| ID | Слой | Тип числа | Значение | Что значит | Как сверять |
| --- | --- | --- | ---: | --- | --- |
| COUNT_01_GLOBAL_RAW | Глобальный пакет | raw source rows | 68085 | Все собранные строки до глобальной дедупликации: app/store listings, source rows, benchmarks, forum/context rows и другие discovery-строки. | Raw rows всегда больше или иначе устроены, чем dedup rows; их нельзя читать как число приложений. |
| COUNT_02_GLOBAL_DEDUP | Глобальный пакет | global dedup rows | 37176 | Уникализированные строки всего пакета после глобальной дедупликации. | Глобальный dedup сейчас 37,176, а сумма нишевых all-source dedup 43,144; разница объясняется пересечениями и разными scope. |
| COUNT_03_NICHE_DEDUP_SUM | Сумма по нишам | sum of all-source niche dedup rows | 43144 | Сумма dedup-строк внутри каждой ниши, если читать рынки как тематические корзины. | Это тематическая сумма, а не глобальная уникальность: пересекающиеся продукты могут встречаться в нескольких корзинах. |
| COUNT_04_DIRECT_APP_SUM | Сумма по нишам | sum of direct app-store dedup rows by niche | 13117 | Ближнее consumer-app поле: App Store / Google Play / похожие app-store rows после нишевой дедупликации. | Это более близкий к конкурентному анализу слой, чем all-source dedup, но он тоже тематический и требует ручного sampling. |
| COUNT_05_TOP100_REVIEW | Review layer | top100 primary competitors | 187 | Кандидаты, вынесенные в более внимательный scorecard/review слой. | Top-100 layer сейчас суммарно 187 строк по нишам; manual targets еще уже: 18. |

| Ниша | All-source dedup | Стек счетчиков | Что не доказывает |
| --- | ---: | --- | --- |
| Mindfulness / reset | 9,803 | В Mindfulness / reset: raw=15,109, all-source dedup=9,803, cross-source total dedup=9,723, direct app-store dedup=2,550, top100=21, manual targets=0. | Эти счетчики доказывают масштаб карты рынка и плотность source coverage, но не доказывают PMF, willingness-to-pay или отсутствие hidden full-loop clone без manual walkthrough/interviews. |
| Avatar / identity | 9,952 | В Avatar / identity: raw=14,872, all-source dedup=9,952, cross-source total dedup=7,944, direct app-store dedup=2,506, top100=49, manual targets=3. | Эти счетчики доказывают масштаб карты рынка и плотность source coverage, но не доказывают PMF, willingness-to-pay или отсутствие hidden full-loop clone без manual walkthrough/interviews. |
| Astrology / esoterics | 2,657 | В Astrology / esoterics: raw=5,427, all-source dedup=2,657, cross-source total dedup=2,657, direct app-store dedup=2,206, top100=59, manual targets=7. | Эти счетчики доказывают масштаб карты рынка и плотность source coverage, но не доказывают PMF, willingness-to-pay или отсутствие hidden full-loop clone без manual walkthrough/interviews. |
| Coaching / self-improvement | 3,857 | В Coaching / self-improvement: raw=7,671, all-source dedup=3,857, cross-source total dedup=3,857, direct app-store dedup=2,651, top100=50, manual targets=8. | Эти счетчики доказывают масштаб карты рынка и плотность source coverage, но не доказывают PMF, willingness-to-pay или отсутствие hidden full-loop clone без manual walkthrough/interviews. |
| Gaming / progression benchmark | 16,875 | В Gaming / progression benchmark: raw=24,446, all-source dedup=16,875, cross-source total dedup=14,304, direct app-store dedup=3,204, top100=8, manual targets=0. | Эти счетчики доказывают масштаб карты рынка и плотность source coverage, но не доказывают PMF, willingness-to-pay или отсутствие hidden full-loop clone без manual walkthrough/interviews. |

Гипотеза №2: мировые adjacent-рынки достаточно велики и монетизируемы, чтобы продолжать проверку АУРА, но рыночные цифры должны читаться как sizing для направления, а не как прогноз выручки самого продукта.

| Рынок | SAM base | Денежный вывод | Score | Граница |
| --- | ---: | --- | ---: | --- |
| Mindfulness / reset | $252M | сильный направленный money case | 9 | Можно использовать как directional evidence, но нельзя усиливать claim до product-market proof без walkthrough, paywall signoff и пользовательских сессий. |
| Avatar / identity | $420M | сильный направленный money case | 10 | Можно использовать как directional evidence, но нельзя усиливать claim до product-market proof без walkthrough, paywall signoff и пользовательских сессий. |
| Astrology / esoterics | $374M | сильный направленный money case | 9 | Можно использовать как directional evidence, но нельзя усиливать claim до product-market proof без walkthrough, paywall signoff и пользовательских сессий. |
| Coaching / self-improvement | $300M | средний направленный money case | 8 | Можно использовать как directional evidence, но нельзя усиливать claim до product-market proof без walkthrough, paywall signoff и пользовательских сессий. |
| Gaming / progression benchmark | $671M | деньги видны, но это benchmark, не прямой TAM | 7 | Нельзя считать прямым рынком АУРА без доказанного ritual/self-improvement overlap; использовать как механику прогресса и retention. |

Intersection SAM в текущей модели равен $202M. Это рабочая мировая рамка для дальнейшей проверки, а не обещание revenue. Локальный paid-flow signoff сейчас заполнен на 28 строках; H2 gate имеет статус in_progress_insufficient_evidence, потому что нужны еще in-app paywall walkthrough и willingness-to-pay evidence.

## МЕТОДОЛОГИЯ TAM/SAM/SOM

Рыночная модель АУРА намеренно построена как диапазон, а не как одна “красивая” цифра. Она разделяет широкий TAM, serviceable SAM, confidence-weighted SAM и bottom-up stress-сценарии. Такой подход нужен, потому что АУРА находится на пересечении нескольких adjacent-рынков, а не внутри одной готовой категории market report.

Базовая формула top-down: TAM base умножается на serviceable share и дает SAM base. Затем SAM дополнительно умножается на confidence/directness weight, чтобы не смешивать прямые adjacent-рынки, широкие adjacent-рынки и benchmark-механику. Отдельно используется bottom-up stress: reachable users * activation rate * paid conversion * ARPPU. Этот слой нужен не для прогноза выручки, а для проверки, какой масштаб начинает иметь смысл при разных уровнях distribution, retention и willingness-to-pay.

| Pillar | Какой тип рынка | SAM base | Weighted SAM | Риск модели | Как читать |
| --- | --- | ---: | ---: | --- | --- |
| gaming | benchmark механик, не прямой TAM | $671M | $470M | не считать прямым рынком АУРА | использовать только как benchmark retention/progression/monetization mechanics, не включать в прямой TAM АУРА |
| astrology_esoterics | прямой adjacent-рынок | $374M | $262M | поддержано proxy, но нужен ручной paid-flow/WTP | использовать как directional market-money anchor до ручного paywall, ICP и WTP evidence |
| avatar_identity | широкий adjacent-рынок с сильным consumer-discount | $420M | $294M | поддержано proxy, но нужен ручной paid-flow/WTP | использовать как money context с сильным consumer/self-improvement discount |
| coaching | прямой adjacent-рынок | $300M | $210M | широкий диапазон источников, нужен conservative range | использовать как directional market-money anchor до ручного paywall, ICP и WTP evidence |
| mindfulness | прямой adjacent-рынок | $252M | $176M | поддержано proxy, но нужен ручной paid-flow/WTP | использовать как directional market-money anchor до ручного paywall, ICP и WTP evidence |
| intersection | расчетное пересечение АУРА | $202M | $80.8M | модельное пересечение, высокий риск завысить claim | читать как рабочий modeled SAM для проверки, а не как прогноз выручки или investor-grade market claim |

Для H2 это означает жесткую границу: TAM/SAM/SOM доказывает, что рынок достаточно интересен для проверки, но не доказывает, что АУРА заработает эти деньги. H2 можно усиливать только после product-matched paid-flow signoff, willingness-to-pay в ICP-интервью и paid-depth signal в прототипных сессиях.

Чтобы H2 не опиралась на одну “красивую” рыночную цифру, отдельно добавлен sensitivity audit. Он показывает, какие assumptions двигают модель сильнее всего: ширина SAM диапазона, directness рынка, confidence weight, число источников и paid-flow/WTP evidence. Самый хрупкий слой - intersection SAM: его нельзя читать как прогноз выручки до ICP/WTP и product-matched paid-flow.

| Pillar | SAM base | Weighted SAM | SAM spread | Risk | Main driver | Next proof |
| --- | ---: | ---: | ---: | --- | --- | --- |
| gaming | $671M | $470M | 7.3 | средний | directness: benchmark нельзя считать прямым TAM | оставить как mechanics benchmark; не включать в прямой H2 proof |
| astrology_esoterics | $374M | $262M | 9.4 | средне-высокий | paid-flow/WTP still unobserved | добрать paid-flow screenshots и WTP/prototype paid-depth signals |
| avatar_identity | $420M | $294M | 29.4 | высокий | ширина диапазона SAM | добавить credible market anchors и source-confidence refresh |
| coaching | $300M | $210M | 5.3 | средний | range variance источников | добрать bottom-up competitor pricing/revenue proxy и WTP signals |
| mindfulness | $252M | $176M | 8.6 | высокий | малое число market anchors | добавить credible market anchors и source-confidence refresh |
| intersection | $202M | $80.8M | 30.3 | очень высокий | intersection discount + отсутствующие прямые источники | ICP/WTP + product-matched paid-flow + bottom-up competitor revenue proxy |

| Сценарий | Reachable users | Activation | Paid conv | ARPPU | Annual revenue | Как читать |
| --- | ---: | --- | --- | --- | ---: | --- |
| defensive | 100,000 | 25% | 2% | $50 | $25,000 | маленький validation business, полезен для проверки, но не для venture claim |
| conservative | 250,000 | 32% | 3% | $60 | $144,000 | ранний нишевый бизнес, имеет смысл при сильной удерживаемости |
| base | 1,000,000 | 40% | 5% | $80 | $1.6M | ранний нишевый бизнес, имеет смысл при сильной удерживаемости |
| strong_niche | 2,500,000 | 45% | 7% | $95 | $7.5M | venture-relevant только если retention и paid depth реально работают |
| upside | 5,000,000 | 50% | 9% | $110 | $24.8M | крупный outcome требует доказанного distribution, retention и WTP |
| breakout | 10,000,000 | 55% | 11% | $125 | $75.6M | крупный outcome требует доказанного distribution, retention и WTP |

### Итог по рынкам и деньгам

Рыночная картина поддерживает H2 только направленно. Вокруг АУРА есть крупные соседние категории, платные привычки и понятные consumer-app механики, но ни одна broad market цифра не является прямым прогнозом выручки АУРА. Самое аккуратное чтение: рынок достаточно большой, чтобы продолжать, но недостаточно доказанный, чтобы объявлять go.

Поэтому следующий шаг - не спорить о единственной TAM-цифре, а перейти к сценариям входа. Именно сценарии показывают, какой пользовательский мотив может привести человека в продукт и почему пять рынков собираются в одну гипотезу, а не остаются пятью разными направлениями.

## СЦЕНАРИИ ВХОДА КАК СВЯЗУЮЩЕЕ ЗВЕНО

Сценарии входа для АУРА не завязаны на один канал. Логичнее рассматривать несколько мировых consumer-entry сценариев. Первый сценарий - пользователь приходит из состояния тревоги, усталости или перегруза и ищет короткий reset. Второй сценарий - пользователь приходит из self-improvement контекста: он хочет двигаться вперед, но устал от жестких streak и сложных систем. Третий сценарий - пользователь приходит из spiritual/meaning контекста и хочет не просто читать интерпретацию, а превратить ее в действие. Четвертый сценарий - пользователь приходит через avatar/identity интерес и хочет видеть, что версия себя меняется. Пятый сценарий - пользователь возвращается через мягкую progression-механику, если она не выглядит как манипулятивная игра.

Таким образом, рынок АУРА должен рассматриваться не по одному каналу входа, а как пересечение потребностей: состояние, смысл, действие, видимость прогресса и возвращаемость.

### ЛОГИКА СЕГМЕНТАЦИИ

Как и в прошлом исследовательском документе Алины, сегментация здесь нужна не для красивых labels, а для ответа на практический вопрос: через какой мотив человек вообще войдет в систему и какой use case он принесет с собой. Поэтому аудитория АУРА делится не по полу, возрасту или стране, а по мотивационным линиям: смысл, прогресс, reset, identity/avatar и мягкая возвращаемость.

Первая линия - пользователи, которые ищут personal meaning и хотят превратить его в действие. Вторая линия - пользователи, которым нужен видимый прогресс без давления streak. Третья линия - пользователи короткого emotional reset. Четвертая линия - пользователи, которым важна identity/avatar метафора. Пятая линия - progression users, у которых можно брать механику возврата, но нельзя автоматически считать их прямым рынком АУРА.

Эта логика важна для продукта: один и тот же MVP-loop должен быть проверен разными входами. Если spiritual self-improver видит в продукте “очередное гадание”, H1/H6 слабеют. Если habit/progress user видит “еще один task manager”, H4 слабеет. Если reset user не связывает calm-down с действием, петля распадается. Поэтому сегментация сразу переводится в validation tests, а не остается маркетинговой типологией.

| Сегмент | Приоритет | Рынки | Core job | Почему важен | Как проверять |
| --- | --- | --- | --- | --- | --- |
| Spiritual self-improvers | P0: начинать интервью и прототип с этого сегмента | astrology_esoterics/coaching | Turn symbolic/personal meaning into one grounded action today. | Это люди, которые уже ищут личный смысл, символическое отражение дня, дневниковые практики, spiritual guidance или мягкий self-improvement. Для АУРА это самый естественный вход: смысл должен быстро превращаться в одно реальное действие. | In the last 30 days, which apps, rituals, journals, coaches, avatars, or reset tools did you actually use for this job: Turn symbolic/personal meaning into one grounded action today. |
| Habit and progress users | P0: начинать интервью и прототип с этого сегмента | coaching/mindfulness | Make vague growth concrete and keep momentum without streak anxiety. | Это люди, которым не хватает не еще одного списка задач, а более мягкого способа видеть движение вперед. Для АУРА это проверка, может ли action-tied прогресс заменить жесткий streak pressure. | In the last 30 days, which apps, rituals, journals, coaches, avatars, or reset tools did you actually use for this job: Make vague growth concrete and keep momentum without streak anxiety. |
| Anxious daily reset users | P1: использовать как сравнение после P0 | mindfulness/coaching | Calm down quickly and return to the day with one manageable next step. | Это пользователи коротких reset, calm, sleep, breathwork и mood tools. Для АУРА они важны как проверка: reset должен не просто успокоить, а вернуть человека к одному посильному следующему шагу. | In the last 30 days, which apps, rituals, journals, coaches, avatars, or reset tools did you actually use for this job: Calm down quickly and return to the day with one manageable next step. |
| Cozy/casual progression users | P1: использовать как сравнение после P0 | gaming/avatar_identity | Return because progress feels gentle, visible, and emotionally rewarding. | Это люди, которым близки мягкие игровые циклы, коллекционирование, daily rewards и уютная progression. Для АУРА это источник языка возвращения, но есть риск выглядеть как манипулятивная retention-механика. | In the last 30 days, which apps, rituals, journals, coaches, avatars, or reset tools did you actually use for this job: Return because progress feels gentle, visible, and emotionally rewarding. |
| Coaching professionals and structured growth users | P1: использовать как сравнение после P0 | coaching | Get structured guidance that turns intention into accountable practice. | Это пользователи структурированного роста, coaching и accountability. Для АУРА сегмент полезен как проверка глубины, но продукт не должен превращаться в B2B/career coaching software. | In the last 30 days, which apps, rituals, journals, coaches, avatars, or reset tools did you actually use for this job: Get structured guidance that turns intention into accountable practice. |
| Avatar identity builders | P1: использовать как сравнение после P0 | avatar_identity/coaching | See a version of myself change as I make progress. | Это пользователи identity, avatars, AI companions и future-self визуализаций. Для АУРА сегмент важен как проверка, мотивирует ли визуальное self-change только тогда, когда оно связано с завершенным действием. | In the last 30 days, which apps, rituals, journals, coaches, avatars, or reset tools did you actually use for this job: See a version of myself change as I make progress. |

Итог по сегментации: первыми стоит проверять Spiritual self-improvers и Habit and progress users, потому что они дают два разных входа в одну и ту же причинную петлю. Остальные сегменты нужны как compare-layers: они покажут, является ли АУРА отдельным продуктом с широкой daily ritual задачей или распадается на несколько уже занятых категорий.

## ОПРЕДЕЛЕНИЕ КОНКУРЕНТОВ И ГИПОТЕЗА #3

Конкурентная среда подтверждает, что пользователь уже решает части задачи через существующие приложения. В top-100 review сейчас есть meditation apps, habit trackers, AI journals, spiritual guidance apps, avatar/identity apps и progression products. Рынок не пустой, поэтому сильная ставка АУРА не может звучать как “конкурентов нет”. Ставка должна быть точнее: конкуренты закрывают отдельные части петли, но полная причинная связка meaning -> action -> reset -> visible identity/progress встречается редко и требует ручной проверки.

Чтобы конкурентная карта не выглядела как случайный список приложений, ниже она сведена в archetype rollup. Это промежуточная классификация по App Store metadata/reviews/IAP и AI-assisted scorecards: она показывает, какие типы конкурентов создают риск для АУРА, но не заменяет walkthrough. Особенно важно смотреть не только на количество приложений, а на close/direct count, behavior-tied progression и manual targets. Отдельная осторожность: AI companion / tarot-oracle labels требуют taxonomy cleanup перед сильными выводами, потому что source classifier может смешивать symbolic guidance и roleplay/companion продукты.

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

### Итог по конкурентам

Конкурентная карта не доказывает, что поле свободно. Наоборот, она показывает плотную среду, где почти каждая часть петли уже кем-то закрывается. Сила гипотезы АУРА появляется только в более узкой формулировке: возможно, рынок занят отдельными функциями, но не занят причинной daily-loop системой.

Значит, следующий вопрос звучит не “есть ли конкуренты”, а “где именно петля разрывается”. Поэтому отчет переходит от списка конкурентов к whitespace: какие элементы у рынка есть, каких не хватает, и где у АУРА может быть отличие.

## ГДЕ ДЫРЫ И ВОЗМОЖНОСТЬ ОТЛИЧИТЬСЯ

| Направление | Full-loop rate | Opportunity | Как читать |
| --- | ---: | --- | --- |
| Mindfulness / reset | 3.82% | возможность есть, но нужна выборочная ручная проверка | H3 можно держать как narrow directional whitespace: full-loop-like кандидаты редки, но sampling обязателен. |
| Avatar / identity | 2.83% | возможность есть, но нужна выборочная ручная проверка | H3 можно держать как narrow directional whitespace: full-loop-like кандидаты редки, но sampling обязателен. |
| Astrology / esoterics | 13.70% | рынок видим, но claim о whitespace слабый без нового evidence | H3 не усиливать: плотность/контекст/прямота пока слишком неоднозначны. |
| Coaching / self-improvement | 13.02% | рынок видим, но claim о whitespace слабый без нового evidence | H3 не усиливать: плотность/контекст/прямота пока слишком неоднозначны. |
| Gaming / progression benchmark | 1.03% | механический benchmark, не основной whitespace | Не использовать как H3 proof. Это источник механик, а не доказательство рынка АУРА. |

Наиболее перспективная формулировка белого пятна: не “новый wellness app”, а короткая трансформационная петля с причинным visual feedback. Если прогресс меняется произвольно, продукт станет декоративным avatar toy. Если действие никак не связано со смыслом, продукт станет обычным habit tracker. Если reset живет отдельно, продукт станет библиотекой практик. Поэтому отличие должно проверяться именно на связке, а не на отдельных функциях.

## СВЯЗКА WHITESPACE И АУДИТОРИИ

Белое пятно нельзя оценивать отдельно от аудитории. Даже если full-loop candidates редки, это становится продуктовой возможностью только там, где есть люди с recent behavior, current workaround и языком боли. Поэтому следующий слой соединяет H3 и H5: по каждому мировому направлению видно, какой разрыв найден в конкурентной среде, какой ICP туда ложится и какой первый validation move нужен.

| Рынок | Full-loop rate | Whitespace read | ICP fit | Первый validation move |
| --- | --- | --- | --- | --- |
| Mindfulness / reset | 3.82% | узкое белое пятно выглядит правдоподобно: full-loop candidates редки, но нужен P0 walkthrough | ICP_D: Habit and progress users / ICP_C: Anxious daily reset users | сначала проверить P0-аудиторию через recent behavior интервью, затем walkthrough high-risk конкурентов |
| Avatar / identity | 2.83% | узкое белое пятно выглядит правдоподобно: full-loop candidates редки, но нужен P0 walkthrough | ICP_E: Cozy/casual progression users / ICP_B: Avatar identity builders | использовать как compare-сегмент после P0 ICP и high-risk competitor walkthrough |
| Gaming / progression benchmark | 1.03% | использовать как источник механик прогресса и возврата, но не как прямое доказательство whitespace АУРА | ICP_E: Cozy/casual progression users | взять progression/avatar/retention паттерны в прототип, но не использовать gaming как H3 proof |
| Coaching / self-improvement | 13.02% | рынок видим и плотен; whitespace claim слабый без нового ручного evidence | ICP_A: Spiritual self-improvers / ICP_D: Habit and progress users | сначала проверить P0-аудиторию через recent behavior интервью, затем walkthrough high-risk конкурентов |
| Astrology / esoterics | 13.70% | рынок видим и плотен; whitespace claim слабый без нового ручного evidence | ICP_A: Spiritual self-improvers | сначала проверить P0-аудиторию через recent behavior интервью, затем walkthrough high-risk конкурентов |

Практический вывод: mindfulness и avatar/identity выглядят как самые чистые whitespace-поля по редкости full-loop candidates, но они все равно требуют walkthrough. Astrology/esoterics и coaching дают сильную аудиторию и деньги, но full-loop rate выше, поэтому claim о белом пятне там слабее. Gaming остается benchmark механик, а не прямой рынок.

### Итог по whitespace и аудитории

Белое пятно выглядит не как пустой рынок, а как узкая недособранная петля. Это более сильная и более честная формулировка: АУРА не должна победить все wellness, coaching, astrology, avatar и gaming-продукты; ей нужно доказать, что связка meaning -> tiny action -> reset -> visible progress дает пользователю другой опыт.

Но даже хороший whitespace ничего не стоит без аудитории с recent behavior. Поэтому следующий блок отвечает на вопрос: кто уже живет рядом с этой задачей, какие текущие решения использует и с кого начинать интервью.

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

Гипотеза №4: primary-аудитория АУРА находится среди людей, которые уже имеют recent behavior вокруг daily ritual, progress, reset или personal meaning, и которым нужна не новая функция, а более короткий и связанный цикл изменения.

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

### Итог по аудитории и интервью

Пока самая рабочая аудитория описывается как digital ritual users, но это не финальный ICP. Это набор людей, у которых уже есть поведение рядом с проблемой: они возвращаются к приложениям, ищут смысл или reset, используют трекеры, paid guidance или персонализацию и могут рассказать конкретный последний эпизод.

Именно поэтому продуктовую модель нельзя собирать из желаний команды. Она должна быть следующей гипотезой, выведенной из рынков, конкурентов, whitespace и первых вопросов к пользователям.

## ИТОГОВАЯ МОДЕЛЬ ПРОДУКТА И ГИПОТЕЗА #5

По текущим данным продуктовая модель должна опираться на несколько столпов. Первый столп - персональное отражение дня, которое не выглядит generic motivation. Второй - одно маленькое действие, связанное со смыслом. Третий - короткий reset, который снижает трение перед действием. Четвертый - visible progress или avatar/identity feedback, который меняется причинно. Пятый - мягкий next-day hook без наказания и streak anxiety.

| Шаг | Экран | Роль | Что должно сработать |
| --- | --- | --- | --- |
| 1 | Daily meaning entry | Вход в личный смысл: пользователь должен почувствовать, что это не generic motivation и не жесткое предсказание. | Participant can explain why this is personal rather than generic content. |
| 2 | Tiny context prompt | Минимальный контекст: петля получает живую точку дня, но не превращается в длинный onboarding. | Participant supplies a concrete lived moment or emotional target. |
| 3 | One grounded action | Перевод смысла в действие: центральная проверка, что АУРА не остается чтением или дневником. | Participant sees the action as doable and causally linked to the chosen theme. |
| 4 | Short reset | Снижение трения: reset должен помогать начать действие, а не выглядеть как отдельная медитация ради медитации. | Participant feels the reset makes action easier without feeling clinical. |
| 5 | Action evidence | Легкое доказательство действия: self-report должен быть достаточным и не ощущаться как контроль. | Participant accepts lightweight self-report as enough evidence. |
| 6 | Identity/avatar feedback | Причинная видимость прогресса: ключевой момент H4/H6, где действие должно объяснять изменение identity/avatar. | Participant understands action -> identity/avatar causality. |
| 7 | Next-day hook | Возврат без наказания: continuity должен поддерживать привычку без streak anxiety. | Participant wants to return and understands continuity. |
| 8 | Immediate value check | Проверка понимания: пользователь должен назвать интегрированную петлю своими словами. | Participant names the integrated loop in their own words. |

Гипотеза №5: устойчивый MVP возможен, если пользователь за одну короткую сессию понимает причинность петли, чувствует отличие от обычного tracker/meditation/reading app и может объяснить, зачем вернуться завтра. Пока это не доказано: нужны prototype sessions, scorecard и WTP-вопросы.

### Итог по продуктовой модели

Текущая MVP-логика уже достаточно сфокусирована для проверки: не строить “все приложение”, а проверить одну короткую сессию, где пользователь видит личный смысл, делает маленький шаг, проходит reset и понимает, почему изменился progress/avatar. Это ядро либо собирается в простую историю, либо распадается на знакомые категории.

Поэтому следующий раздел фиксирует не новые идеи, а столпы уверенности и риски. Он нужен, чтобы отделить то, что уже выглядит сильным, от того, что может разрушить гипотезу в первой же ручной проверке.

## СТОЛПЫ УВЕРЕННОСТИ И ОТКРЫТЫЕ РИСКИ

Первый столп уверенности - масштаб мирового adjacent landscape: база уже достаточно велика, чтобы видеть рынки и конкурентов. Второй - money proxy: в соседних категориях видны платные привычки. Третий - повторяющиеся pain themes: пользователи говорят о visible progress, personalization, daily anchor, subscription value и trust/safety. Четвертый - narrow whitespace: полная петля выглядит редкой, но только до ручной проверки.

Главные риски остаются открытыми. P0-конкуренты могут закрывать петлю внутри onboarding. Пользователи могут прочитать avatar/progress как детскую декорацию. Spiritual/meaning layer может вызвать недоверие или safety objection. Paywall может быть понятен в соседних рынках, но не в АУРА. Поэтому следующий этап должен не украшать отчет, а собирать observed evidence.

## СПИСОК ВОПРОСОВ И ПРОВЕРОК ДЛЯ СЛЕДУЮЩЕГО ЭТАПА

Следующий слой исследования должен собираться как evidence protocol. По каждой гипотезе нужно заранее определить вопрос, наблюдение, артефакт и правило понижения уверенности. Если нет capture row, скриншота, цитаты, цены, walkthrough-заметки или scorecard-метрики, то гипотеза не апгрейдится.

| Гипотеза | Блок | Вопрос / проверка | Что сохранить | Сигнал усиления | Сигнал ослабления |
| --- | --- | --- | --- | --- | --- |
| H1 | Форма продукта и hidden-clone риск | Открой P0-конкурента от первого экрана до первого value moment: есть ли там связка личный смысл -> маленькое действие -> reset -> видимый progress/avatar feedback? | listing screenshot / onboarding first value / first action / progress/avatar feedback / paywall/free boundary / inspector notes | Минимум пять P0-приложений вручную прошли все walkthrough-слоты, и полный скрытый клон АУРА не найден. | Любой P0-конкурент уже владеет полной петлей АУРА с причинностью action -> identity/avatar. |
| H2 | Деньги и willingness-to-pay | В каждом high-money конкуренте зафиксируй, где появляется первый честный paywall: до value moment или после него, какая цена, trial, годовая скидка и какая именно depth продается. | public pricing screenshot / app/product match / trial length / monthly/annual price / first meaningful paywall boundary | Для high-money конкурентов подтверждены цена, trial, граница paywall и связь платной глубины с похожей пользовательской работой. | Платные сигналы относятся к нерелевантным продуктам, parent pages, login-gated страницам или paywall появляется до понятной ценности. |
| H2 | Деньги и willingness-to-pay | За что ты уже платишь в этой зоне и что должно случиться бесплатно, чтобы подписка стала честной? | free_value_moment/paid_depth_feature/acceptable_price_range/friend_explanation/return_trigger | участник называет paid depth после free value moment и может объяснить продукт своими словами | вся ценность ожидается бесплатно, paid depth не связана с loop, или продукт невозможно пересказать |
| H3 | Белое пятно и отличие | После walkthrough конкурента выпиши, что именно он закрывает: meaning, action, reset, visual progress, identity/avatar, causality. Где петля разрывается? | listing screenshot / onboarding first value / first action / progress/avatar feedback / paywall/free boundary / inspector notes | Ручной walkthrough подтверждает, что behavior-tied identity/avatar progression остается редкой среди high-risk substitutes. | Walkthrough показывает распространенные full-loop substitutes или подтверждает скрытый клон. |
| H4 | Конкурентное преимущество в прототипе | На экране изменения спросить: что изменилось, почему это изменилось и какое действие это вызвало? | completion_time_seconds/comprehension_yes_no/meaning_lift_1_5/differentiation_1_5/return_intent_1_5/verbatim_quote/fatal_objection | Не менее 80% участников прототипа правильно объясняют причинность personal meaning -> action -> avatar/progress. | Менее 50% участников могут объяснить причинную петлю без подсказки. |
| H5 | Аудитория и recent behavior | Какие приложения, ритуалы, дневники, игры, guidance tools, коучи или avatar-продукты ты реально использовал за последние 30 дней, и что запустило последнее использование? | recent_behavior_match/current_tool/trigger_of_last_use/segment_fit_yes_no | есть recent behavior и конкретный триггер последнего использования | поведение абстрактное, давно не было, или сегмент выбран по вкусу исследователя |
| H5 | Аудитория и current workaround | Расскажи про последний реальный момент, когда тебе нужно было превратить личный смысл, состояние или внутренний сигнал в одно приземленное действие на сегодня. | specific_episode/workaround/pain_intensity_1_5/verbatim_language/rejected_patterns | участник рассказывает конкретный эпизод, current workaround и язык боли без наводки | участник рассуждает теоретически или проблема оказывается слабее текущих альтернатив |
| H6 | MVP-петля и продуктовое ядро | Пройди прототип от entry до tomorrow hook и попроси участника своими словами назвать продукт: что это, зачем он нужен и почему он может быть нужен завтра? | completion_time_seconds/comprehension_yes_no/meaning_lift_1_5/differentiation_1_5/return_intent_1_5/verbatim_quote/fatal_objection | MVP-петля остается понятной после прототипных сессий и обновления конкурентных walkthrough. | Петля требует слишком много трения или контента, либо пользователи не могут объяснить причинность. |
| H4/H5/H6 | Trust, safety и границы обещания | Что сделало бы такой продукт небезопасным, cringe, манипулятивным или не для тебя? | top_objection/trust_boundary/unsafe_phrase/manipulation_signal/participant_control_needed | Если АУРА честно ограничивает обещания и дает контролируемое мягкое guidance, она может избежать части риска spiritual/AI/self-help продуктов. | Ослабить H4/H6 немедленно, если возникает повторяющийся fatal trust/safety objection. |

Такой порядок удерживает исследование от преждевременного вывода: сначала формулируется гипотеза, затем показывается рынок, затем конкуренты, затем открытые сомнения, затем интервью/прототип и только после этого обновляется решение. Для мирового рынка это особенно важно: объем данных большой, но решение должно приниматься не по размеру базы, а по тому, выдерживает ли продуктовая петля ручные проверки.

## БЛИЖАЙШАЯ ОЧЕРЕДЬ ВАЛИДАЦИИ

Чтобы следующий шаг был исполнимым, из общего command center выделена короткая P0-очередь. Она начинается с hidden-clone walkthrough конкурентов, затем добирает paid-flow evidence, потом проверяет ICP recent behavior и только после этого переводит прототип в scorecard. Такой порядок сохраняет причинность исследования: сначала убираем риск “это уже существует”, затем проверяем деньги, затем аудиторию, затем преимущество продукта.

### P0 execution slice: что делать в первую рабочую сессию

Ниже показана сжатая очередь, которая превращает большой backlog в исполнимую сессию. У каждой строки есть gate impact и файл, куда писать observed evidence. До заполнения этих строк это не доказательство, а маршрут проверки.

| # | Блок | ID | Что проверяем | H | Timebox | Действие | Что сдвигает | Куда писать |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | Сначала hidden-clone walkthrough | P0_MANUAL_01 | Shepherd: Spiritual Bible BFF | H1/H3 | 25-35 min | открыть listing/app, сохранить 5 слотов скриншотов, записать full-loop/directness/causality verdict | двигает H1/H3: directness, hidden clone risk, action -> avatar/progress causality | data_processed/manual_competitor_inspection_packet.csv |
| 2 | Сначала hidden-clone walkthrough | P0_MANUAL_02 | Zing AI: Home & Gym Workouts | H1/H3 | 25-35 min | открыть listing/app, сохранить 5 слотов скриншотов, записать full-loop/directness/causality verdict | двигает H1/H3: directness, hidden clone risk, action -> avatar/progress causality | data_processed/manual_competitor_inspection_packet.csv |
| 3 | Сначала hidden-clone walkthrough | P0_MANUAL_03 | Miracle Morning Routine | H1/H3 | 25-35 min | открыть listing/app, сохранить 5 слотов скриншотов, записать full-loop/directness/causality verdict | двигает H1/H3: directness, hidden clone risk, action -> avatar/progress causality | data_processed/manual_competitor_inspection_packet.csv |
| 4 | Сначала hidden-clone walkthrough | P0_MANUAL_04 | EVOLVE: Transform Your Life | H1/H3 | 25-35 min | открыть listing/app, сохранить 5 слотов скриншотов, записать full-loop/directness/causality verdict | двигает H1/H3: directness, hidden clone risk, action -> avatar/progress causality | data_processed/manual_competitor_inspection_packet.csv |
| 5 | Сначала hidden-clone walkthrough | P0_MANUAL_05 | Daily Yoga: Yoga for Fitness® | H1/H3 | 25-35 min | открыть listing/app, сохранить 5 слотов скриншотов, записать full-loop/directness/causality verdict | двигает H1/H3: directness, hidden clone risk, action -> avatar/progress causality | data_processed/manual_competitor_inspection_packet.csv |
| 6 | Потом paid-flow/WTP evidence | P0_PAYWALL_02 | Character AI: Chat, Talk, Text | H2 | 10-15 min | проверить screenshot/source, подтвердить цену, trial, product-match и границу первого paywall | двигает H2: product-matched paid evidence, price/trial/paywall boundary | data_processed/web_paywall_visual_adjudication.csv |
| 7 | Потом paid-flow/WTP evidence | P0_PAYWALL_03 | Headspace: Sleep & Meditate | H2 | 10-15 min | проверить screenshot/source, подтвердить цену, trial, product-match и границу первого paywall | двигает H2: product-matched paid evidence, price/trial/paywall boundary | data_processed/web_paywall_visual_adjudication.csv |
| 8 | Потом paid-flow/WTP evidence | P0_PAYWALL_04 | Meditopia: Sleep & Meditation | H2 | 10-15 min | проверить screenshot/source, подтвердить цену, trial, product-match и границу первого paywall | двигает H2: product-matched paid evidence, price/trial/paywall boundary | data_processed/web_paywall_visual_adjudication.csv |
| 9 | Потом paid-flow/WTP evidence | P0_PAYWALL_05 | Nebula: Spiritual Guidance | H2 | 10-15 min | проверить screenshot/source, подтвердить цену, trial, product-match и границу первого paywall | двигает H2: product-matched paid evidence, price/trial/paywall boundary | data_processed/web_paywall_visual_adjudication.csv |
| 10 | Потом paid-flow/WTP evidence | P0_PAYWALL_08 | Carrom Pool: Disc Game | H2 | 10-15 min | проверить screenshot/source, подтвердить цену, trial, product-match и границу первого paywall | двигает H2: product-matched paid evidence, price/trial/paywall boundary | data_processed/web_paywall_visual_adjudication.csv |
| 11 | Затем ICP recent behavior | P0_ICP_ICP_A_T01 | Spiritual self-improvers / screener | H5/H6 | 20-30 min | спросить, какие приложения/ритуалы/дневники/коучи/avatar-tools участник использовал за 30 дней и что запустило последнее использование | двигает H5/H6: recent behavior, workaround, language, WTP, loop comprehension | data_processed/icp_validation_test_plan.csv |
| 12 | Затем ICP recent behavior | P0_ICP_ICP_A_T02 | Spiritual self-improvers / problem_interview | H5/H6 | 20-30 min | разобрать последний реальный эпизод, current workaround, эмоциональную ставку и точный язык боли | двигает H5/H6: recent behavior, workaround, language, WTP, loop comprehension | data_processed/icp_validation_test_plan.csv |
| 13 | Затем ICP recent behavior | P0_ICP_ICP_A_T03 | Spiritual self-improvers / prototype_loop | H5/H6 | 20-30 min | показать простую петлю meaning -> action -> reset -> avatar/progress -> tomorrow hook и попросить участника narrate flow | двигает H5/H6: recent behavior, workaround, language, WTP, loop comprehension | data_processed/icp_validation_test_plan.csv |
| 14 | Затем ICP recent behavior | P0_ICP_ICP_A_T04 | Spiritual self-improvers / positioning_test | H5/H6 | 20-30 min | сравнить current tool, generic habit/coach и АУРА angle; записать, что участник выбрал бы первым и почему | двигает H5/H6: recent behavior, workaround, language, WTP, loop comprehension | data_processed/icp_validation_test_plan.csv |
| 15 | После этого prototype loop | P0_PROTO_ICP_A_S06_AVATAR_CHANGE | Spiritual self-improvers / S06_AVATAR_CHANGE | H4/H6 | 10-15 min | показать S01-S08 без объяснения, записать время, понимание, цитаты, trust objection и return intent | двигает H4/H6: comprehension, differentiation, trust, return intent | data_processed/prototype_validation_scorecard.csv |
| 16 | После этого prototype loop | P0_PROTO_ICP_D_S06_AVATAR_CHANGE | Habit and progress users / S06_AVATAR_CHANGE | H4/H6 | 10-15 min | показать S01-S08 без объяснения, записать время, понимание, цитаты, trust objection и return intent | двигает H4/H6: comprehension, differentiation, trust, return intent | data_processed/prototype_validation_scorecard.csv |
| 17 | После этого prototype loop | P0_SCORE_PVS_M01 | comprehension | H4/H6 | 5-10 min after sessions | после сессий посчитать observed value и gate status по этой метрике | двигает H4/H6: comprehension, differentiation, trust, return intent | data_processed/prototype_validation_scorecard.csv |
| 18 | После этого prototype loop | P0_SCORE_PVS_M02 | two_minute_completion | H4/H6 | 5-10 min after sessions | после сессий посчитать observed value и gate status по этой метрике | двигает H4/H6: comprehension, differentiation, trust, return intent | data_processed/prototype_validation_scorecard.csv |

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
| 14 | ICP интервью | Spiritual self-improvers / positioning_test | H5/H6 | сравнить current tool, generic habit/coach и АУРА angle; записать, что участник выбрал бы первым и почему | data_processed/icp_validation_test_plan.csv |

Эта очередь не заменяет полный validation command center. Она нужна как первый рабочий слой для следующих 12-24 часов: если заполнить хотя бы первые manual walkthrough и paid-flow задачи, отчет начнет переходить от desk evidence к наблюдаемым доказательствам.

## ИСТОЧНИКИ И ГРАНИЦЫ ДОКАЗАТЕЛЬСТВ

Ниже зафиксирована короткая связка claim -> evidence -> boundary для этой мировой версии отчета. Это не полный manifest всех файлов, а читательский слой: он показывает, какие утверждения можно читать как desk/source support, а какие нельзя усиливать без ручных walkthrough, интервью, прототипных сессий или WTP-проверки.

| Claim | Раздел | Статус | Метрика | Граница |
| --- | --- | --- | --- | --- |
| SRC_01_PROJECT_AND_SCALE | Описание проекта и гипотеза #1 | доказано как исследовательский слой | 68085 cross-source raw rows; 37176 cross-source dedup rows; 44 coverage cells; 11 strong and 12 medium source/market cells | Это source/discovery coverage, а не ручная проверка каждого конкурента и не proof спроса. |
| SRC_02_MARKET_SIZING | Определение мировых целевых рынков и гипотеза #2 | поддержано направленно, но не финальный revenue/WTP proof | 6 market rows; 3 strong and 1 medium directional money cases | Market reports часто broad-category/paywalled; использовать как range-based sizing, не как прогноз выручки АУРА. |
| SRC_03_COMPETITORS | Определение конкурентов и гипотеза #3 | готово к проверке, gate открыт | 100 top-candidate rows; 90 primary apps; 12 P0 inspection targets; 12 public listings inspected; taxonomy_cleanup_rows=8 | Public listings и scorecards не заменяют app/onboarding walkthrough screenshots. |
| SRC_04_WHITESPACE | Где дыры и возможность отличиться | поддержано направленно, но не финально доказано | 1/100 strict behavior-tied progression signals; 6 cross-source saturation markets; 2 benchmark-only markets; 12 P0 apps queued | Whitespace нельзя апгрейдить без manual walkthrough и final verdict_after_inspection. |
| SRC_05_AUDIENCE | Аудитория, интервью и гипотеза #4 | поддержано направленно, но не финально доказано | 20492 audience signal rows; 294 community/referral rows; 2339 coded Reddit mention rows; 1852 Reddit manual-read queue rows; 574 Reddit capture rows; 6 ICP segment hypotheses; 36 ICP validation tests; 24 ICP recruiting bridge rows | Audience rows и Reddit/forum signals не являются representative survey и не заменяют recent-behavior interviews. |
| SRC_06_PRODUCT_CORE | Итоговая модель продукта и гипотеза #5 | поддержано направленно, но не финально доказано | 12552 feature matrix rows; 100 product-core rows; 8 prototype screens | Product core не считается доказанным без заполненных prototype_session_capture_sheet и scorecard. |
| SRC_07_PROVENANCE | Источники и границы доказательств | доказано как исследовательский слой | 557 manifest artifacts; missing=0 | Manifest доказывает наличие файлов и хэши, но не заменяет содержательную валидацию claims. |
| SRC_09_NICHE_COUNT_ROLLUP | Определение мировых целевых рынков и гипотеза #2 | доказано как source-count rollup, не как PMF proof | 5 niche rows; file=data_processed/global_niche_count_rollup.csv | Niche count rollup показывает масштаб source discovery по рынкам; он не доказывает спрос, WTP или отсутствие скрытого full-loop конкурента. |
| SRC_11_SOURCE_QUALITY_GAP | Описание проекта и гипотеза #1 | доказано как source-quality audit, не validation proof | 5 market source-quality rows | Source quality audit показывает качество coverage и next lanes; он не доказывает PMF, WTP или отсутствие hidden clone. |
| SRC_12_MARKET_SENSITIVITY | Методология TAM/SAM/SOM | проверено sensitivity audit, не revenue forecast | 6 sensitivity rows | Sensitivity audit показывает хрупкость assumptions; он не доказывает выручку АУРА. |
| SRC_15_NICHE_COUNT_RECONCILIATION | Определение мировых целевых рынков и гипотеза #2 | доказано как count reconciliation, не demand proof | 10 reconciliation rows | Reconciliation объясняет арифметику и scope счетчиков; он не доказывает спрос, WTP или отсутствие hidden clone. |
| SRC_16_P0_EXECUTION_SLICE | Ближайшая очередь валидации | доказано как execution routing, не observed validation | 18 execution-slice rows | Execution slice показывает порядок действий; он не апгрейдит H1-H6 без заполненных observed rows. |

## БЫСТРЫЕ ВЫВОДЫ ДЛЯ СТРАТЕГИИ

1. Мировой рынок вокруг АУРА есть, но его нельзя сводить к одному TAM: это пересечение mindfulness, coaching, astrology/spiritual guidance, avatar/identity и progression mechanics.
2. Продуктовая ставка должна быть узкой: ежедневная причинная петля, а не комбайн функций.
3. Самые важные проверки - hidden-clone walkthrough, paid-flow signoff, P0 ICP interviews и prototype sessions.
4. Отчет должен оставаться на русском языке, но описывать мировой рынок и глобальные consumer-app категории.
5. Дальше исследование должно идти в строгой последовательности: гипотеза -> рынки -> конкуренты -> интервью -> уточнение гипотезы -> MVP -> вопросы -> вывод.
