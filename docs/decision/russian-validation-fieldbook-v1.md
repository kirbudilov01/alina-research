# Русский полевой протокол валидации V1

Собрано: 2026-05-31T10:56:01.884Z

## Как читать этот документ

Это не еще одна матрица и не финальный вывод. Это русскоязычный маршрут исполнения валидации: что делать первым, что считать доказательством, когда понижать claim, как обновлять отчет и что обязательно коммитить. Документ специально написан последовательным языком, чтобы им можно было пользоваться во время ручной работы, а не только смотреть на него как на таблицу.

Сейчас в command center 75 строк, из них 6 P0 blocker. Capture-подготовка покрывает 850 строк: manual walkthrough 60, paid flow 40, ICP interviews 96, prototype sessions 80, Reddit/manual reading 574. Все 6 validation gates пока не имеют pass evidence, поэтому этот протокол не закрывает гипотезы, а задает дисциплину их проверки.

Команды по lane:

- paid_flow_validation: 29
- prototype_user_validation: 16
- manual_competitor_walkthrough: 12
- icp_interviews: 12
- prototype_scorecard_gate: 6

## Короткая карта фаз

| Фаза | Название | Что собрать | Правило решения |
| --- | --- | --- | --- |
| RU_FIELD_01 | Начать не с красивого вывода, а с evidence discipline | raw screenshot path <br> notes path <br> participant quote <br> observed score <br> human signoff note <br> final verdict | Если evidence не связан с конкретным локальным файлом или строкой capture sheet, он не может усиливать внешний claim. |
| RU_FIELD_02 | Ручной walkthrough конкурентов: проверить, нет ли скрытого прямого клона | listing screenshot <br> onboarding first value <br> first action/task <br> progress/avatar/identity feedback <br> paywall/free boundary <br> final directness verdict | Если хотя бы один P0 конкурент полноценно владеет петлей meaning -> action -> reset -> visible identity/progress -> return, whitespace нужно резко сузить или downgrade. |
| RU_FIELD_03 | Paid-flow signoff: отделить реальные деньги от proxy-шумов | pricing screenshot <br> product match <br> monthly/annual/trial price <br> first meaningful paywall boundary <br> human signoff | H2 можно усиливать только там, где paid evidence совпадает с конкретным продуктом или честно помечено как partial proxy. |
| RU_FIELD_04 | ICP interviews: выбрать аудиторию через недавнее поведение, а не через демографию | recent behavior <br> last episode <br> current workaround <br> pain intensity <br> language resonance <br> trust/safety objection <br> acceptable price range <br> quote | Primary ICP выбирается только если есть concrete recent behavior, понятная боль, резонанс языка, activation trigger и хотя бы directional WTP. |
| RU_FIELD_05 | Prototype sessions: проверить, понимают ли люди причинность петли | completion time <br> comprehension yes/no <br> meaning lift 1-5 <br> differentiation 1-5 <br> return intent 1-5 <br> trust objection <br> verbatim quote | H4/H6 остаются hold, пока ключевые scorecard metrics не получают observed participant evidence. |
| RU_FIELD_06 | Reddit/manual reading: читать как язык боли, а не как количественный спрос | source thread <br> user job <br> alternative used <br> rejected pattern <br> paid signal <br> safety boundary <br> Alina implication <br> quote approved for external use | Forum/Reddit evidence усиливает только language and pain claims, если нет репрезентативной выборки или подтверждения в интервью. |
| RU_FIELD_07 | Обновить gates и отчет: evidence меняет документ, а не живет рядом | updated gate status <br> updated hypothesis decision <br> changed claim boundary <br> regenerated PDF <br> git commit hash | Любой validation result должен завершаться rebuild -> audit -> commit -> push, иначе research package считается рассинхронизированным. |

## RU_FIELD_01. Начать не с красивого вывода, а с evidence discipline

Перед полевой работой мы фиксируем простое правило: ни одна гипотеза H1-H6 не усиливается из ощущения, памяти или красивой формулировки. Сначала появляется сырой след: скриншот, заметка, цитата, числовая оценка или human signoff. Потом заполняется capture row. Только после этого обновляются claim register, hypothesis decisions, отчет и PDF.

- Scope: command_rows=75; p0_blockers=6; dashboard_rows=11; field_guide_sections=8
- Evidence: raw screenshot path | notes path | participant quote | observed score | human signoff note | final verdict
- Decision rule: Если evidence не связан с конкретным локальным файлом или строкой capture sheet, он не может усиливать внешний claim.
- Update files: data_processed/p0_validation_command_center.csv;data_processed/evidence_claim_register.csv;data_processed/hypothesis_decision_matrix.csv

## RU_FIELD_02. Ручной walkthrough конкурентов: проверить, нет ли скрытого прямого клона

Первый фактический удар по H1/H3 - пройти P0 конкурентов руками. Публичные листинги уже подсветили риск, но листинг не показывает реальную петлю. Нужно открыть продукт или доступный demo/listing, зафиксировать onboarding, первое ценное действие, экран после действия, progress/avatar/identity feedback и первую границу paywall. Главный вопрос: конкурент действительно связывает личный смысл, действие и причинное изменение прогресса, или просто говорит похожими словами?

- Scope: manual_commands=12; manual_capture_rows=60; first_manual_target=Shepherd: Spiritual Bible BFF
- Evidence: listing screenshot | onboarding first value | first action/task | progress/avatar/identity feedback | paywall/free boundary | final directness verdict
- Decision rule: Если хотя бы один P0 конкурент полноценно владеет петлей meaning -> action -> reset -> visible identity/progress -> return, whitespace нужно резко сузить или downgrade.
- Update files: data_processed/manual_competitor_inspection_packet.csv;data_processed/manual_walkthrough_capture_sheet.csv;data_processed/public_listing_inspection_results.csv

## RU_FIELD_03. Paid-flow signoff: отделить реальные деньги от proxy-шумов

Рыночная часть уже показывает деньги в соседних рынках, но инвесторский или продуктовый вывод нельзя строить только на proxy. Нужно взять сильнейшие money-прокси, проверить соответствие продукта, видимые цены, trial terms, paywall boundary и пометить каждую строку как confirm, partial, reject, login-gated или unrelated. Здесь важна консервативность: лучше оставить меньше сильных claims, чем протащить случайную цену с parent-company страницы.

- Scope: paid_commands=29; paid_capture_rows=40
- Evidence: pricing screenshot | product match | monthly/annual/trial price | first meaningful paywall boundary | human signoff
- Decision rule: H2 можно усиливать только там, где paid evidence совпадает с конкретным продуктом или честно помечено как partial proxy.
- Update files: data_processed/web_paywall_visual_adjudication.csv;data_processed/paid_flow_capture_sheet.csv;data_processed/market_money_triangulation.csv

## RU_FIELD_04. ICP interviews: выбрать аудиторию через недавнее поведение, а не через демографию

Аудитория Alina сейчас формулируется как digital ritual users, но это еще directional тезис. Интервью должны доказать не то, что человеку "нравится идея", а что у него был недавний эпизод: он уже использовал приложение, ритуал, дневник, AI coach, habit tracker, astrology/tarot guidance или похожий инструмент, чтобы справиться с состоянием, прогрессом или личным смыслом. Без recent behavior сегмент остается красивой персоной, а не ICP.

- Scope: icp_commands=12; icp_capture_rows=96; hold_hypotheses=6
- Evidence: recent behavior | last episode | current workaround | pain intensity | language resonance | trust/safety objection | acceptable price range | quote
- Decision rule: Primary ICP выбирается только если есть concrete recent behavior, понятная боль, резонанс языка, activation trigger и хотя бы directional WTP.
- Update files: data_processed/icp_interview_capture_sheet.csv;data_processed/icp_segment_matrix.csv;data_processed/icp_validation_test_plan.csv

## RU_FIELD_05. Prototype sessions: проверить, понимают ли люди причинность петли

Прототип нужен не для презентационной красоты, а для проверки H4/H6. Участник должен сам объяснить, что происходит: персональное отражение превращается в одно действие, действие завершается, а progress/avatar/identity feedback меняется именно из-за действия. Если люди видят просто декор, мотивационную фразу или очередной habit tracker, конкурентное преимущество не доказано.

- Scope: prototype_commands=16; score_commands=6; prototype_capture_rows=80
- Evidence: completion time | comprehension yes/no | meaning lift 1-5 | differentiation 1-5 | return intent 1-5 | trust objection | verbatim quote
- Decision rule: H4/H6 остаются hold, пока ключевые scorecard metrics не получают observed participant evidence.
- Update files: data_processed/prototype_session_capture_sheet.csv;data_processed/prototype_validation_scorecard.csv;data_processed/validation_gate_calculator.csv

## RU_FIELD_06. Reddit/manual reading: читать как язык боли, а не как количественный спрос

Reddit слой уже большой, но пока большинство строк специально стоят в unread_do_not_upgrade. Его задача - дать язык боли, альтернатив и возражений. После чтения P0 тредов нужно выписывать job, rejected patterns, paid/WTP signals, safety boundaries и Alina implication. До ручного чтения нельзя цитировать треды как внешнее доказательство и нельзя усиливать claims.

- Scope: reddit_capture_rows=574; capture_total=850
- Evidence: source thread | user job | alternative used | rejected pattern | paid signal | safety boundary | Alina implication | quote approved for external use
- Decision rule: Forum/Reddit evidence усиливает только language and pain claims, если нет репрезентативной выборки или подтверждения в интервью.
- Update files: data_processed/reddit_manual_reading_capture_sheet.csv;data_processed/reddit_mention_signal_matrix.csv;docs/audience/reddit-manual-reading-capture-sheet-v1.md

## RU_FIELD_07. Обновить gates и отчет: evidence меняет документ, а не живет рядом

После каждой партии валидации нельзя оставлять результаты отдельными заметками. Нужно пересобрать gate calculator, hypothesis decision matrix, completion audit, русский narrative report, polished PDF и manifest. Если результат противоречит старому тезису, текст должен стать слабее или точнее. В этом и есть evidence-first логика: отчет не защищает идею, а показывает, что мы честно узнали.

- Scope: validation_gates=6; not_started_gates=6; workspace_dirs=output/validation/2026-05-31/icp_interviews | output/validation/2026-05-31/manual_competitor_walkthrough | output/validation/2026-05-31/paid_flow_validation | output/validation/2026-05-31/prototype_scorecard_gate | output/validation/2026-05-31/prototype_user_validation
- Evidence: updated gate status | updated hypothesis decision | changed claim boundary | regenerated PDF | git commit hash
- Decision rule: Любой validation result должен завершаться rebuild -> audit -> commit -> push, иначе research package считается рассинхронизированным.
- Update files: data_processed/validation_gate_calculator.csv;data_processed/hypothesis_decision_matrix.csv;reports/alina-russian-narrative-report-v1.md;output/pdf/alina-russian-narrative-report-v1.pdf;data_processed/evidence_artifact_manifest.csv

## Граница утверждений

Этот fieldbook является execution asset. Он не доказывает H1-H6 и не заменяет людей, скриншоты, интервью или прототипные сессии. Его задача - сделать следующий ручной этап настолько конкретным, чтобы после него можно было честно обновить claims: усилить, оставить hold, сузить или убить.

## Файлы

- `data_processed/russian_validation_fieldbook.csv`
- `docs/decision/russian-validation-fieldbook-v1.md`
