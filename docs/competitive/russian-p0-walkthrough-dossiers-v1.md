# Русские P0 walkthrough dossiers V1

Собрано: 2026-05-31T12:39:11.647Z

## Зачем нужен этот слой

Этот dossier превращает P0 competitor walkthrough из набора CSV в исполнимую операторскую очередь. По каждому конкуренту видно, почему он опасен, какой публичный evidence уже найден, какие пять скриншотов надо сохранить, какие labels заполнить и как результат должен изменить H1/H3/H2.

Всего dossiers: 12. Required screenshot slots: 60. Completed slots: 0. Красный hidden-clone риск: 1. Желтый strict-loop риск: 2. Пока completed slots равны нулю, этот слой не закрывает validation; он делает первый observed-evidence проход воспроизводимым.

## P0 очередь

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

## 1. Shepherd: Spiritual Bible BFF

**Риск:** красный риск: возможный скрытый прямой клон полной петли

**Публичный read:** public_listing_supports_strict_loop_claim; causality=visible_in_public_copy; hidden_clone=high_hidden_clone_risk_requires_app_walkthrough.

**Деньги:** strong_bottom_up_money_proxy; IAP=$4.99-$59.99.

**Review signals:** content_depth_request:20|loves_daily_loop:10|quality_bug_complaint:8|loves_emotional_support:7|loves_avatar_progress:6

**Скрин-слоты:** app_store_listing_or_public_positioning: What promise, audience, and daily loop does the public listing imply? -> output/manual_validation/01-shepherd-spiritual-bible-bff-app_store_listing_or_public_positioning.png | onboarding_first_value_screen: Does onboarding show one coherent loop or separate feature shelves? -> output/manual_validation/01-shepherd-spiritual-bible-bff-onboarding_first_value_screen.png | first_daily_action_or_task_screen: Is there a concrete action that can be completed in under two minutes? -> output/manual_validation/01-shepherd-spiritual-bible-bff-first_daily_action_or_task_screen.png | progress_avatar_identity_feedback_screen: Does completion visibly change avatar, identity, or progress feedback? -> output/manual_validation/01-shepherd-spiritual-bible-bff-progress_avatar_identity_feedback_screen.png | first_paywall_or_iap_terms_screen: Is the first meaningful value before or after a subscription/trial wall? -> output/manual_validation/01-shepherd-spiritual-bible-bff-first_paywall_or_iap_terms_screen.png

**Решающие вопросы:** Does onboarding show one coherent daily loop or separate feature shelves?|Is there a personal meaning prompt before the action?|Is there one concrete action that can be completed in under two minutes?|Does completion causally change avatar/identity/progress feedback?|Is paywall before or after first meaningful value?|Would this invalidate Alina whitespace by being a hidden direct clone?

**Pass:** evidence supports close substitute/directness classification and clarifies whether action->identity/avatar causality exists

**Downgrade/kill:** metadata claim is not visible, flow is unrelated, or app is only decorative/generic without daily transformation loop

**После walkthrough:** если walkthrough подтверждает полный цикл, H3 надо ослабить и явно признать direct clone risk; если нет, Shepherd остается важным reference competitor, но whitespace survives narrower.

**URL:** https://apps.apple.com/us/app/shepherd-spiritual-bible-bff/id6745461941?uo=4

## 2. Zing AI: Home & Gym Workouts

**Риск:** средний риск: adjacent loop может оказаться близким после onboarding

**Публичный read:** public_listing_supports_adjacent_loop_not_causality; causality=inferred_from_public_copy_not_causal; hidden_clone=medium_adjacency_risk.

**Деньги:** strong_bottom_up_money_proxy; IAP=$18.99-$59.99.

**Review signals:** content_depth_request:16|loves_daily_loop:8|pricing_complaint:8|loves_avatar_progress:6|loves_emotional_support:4

**Скрин-слоты:** app_store_listing_or_public_positioning: What promise, audience, and daily loop does the public listing imply? -> output/manual_validation/02-zing-ai-home-gym-workouts-app_store_listing_or_public_positioning.png | onboarding_first_value_screen: Does onboarding show one coherent loop or separate feature shelves? -> output/manual_validation/02-zing-ai-home-gym-workouts-onboarding_first_value_screen.png | first_daily_action_or_task_screen: Is there a concrete action that can be completed in under two minutes? -> output/manual_validation/02-zing-ai-home-gym-workouts-first_daily_action_or_task_screen.png | progress_avatar_identity_feedback_screen: Does completion visibly change avatar, identity, or progress feedback? -> output/manual_validation/02-zing-ai-home-gym-workouts-progress_avatar_identity_feedback_screen.png | first_paywall_or_iap_terms_screen: Is the first meaningful value before or after a subscription/trial wall? -> output/manual_validation/02-zing-ai-home-gym-workouts-first_paywall_or_iap_terms_screen.png

**Решающие вопросы:** Does onboarding show one coherent daily loop or separate feature shelves?|Is there a personal meaning prompt before the action?|Is there one concrete action that can be completed in under two minutes?|Does completion causally change avatar/identity/progress feedback?|Is paywall before or after first meaningful value?|Would this invalidate Alina whitespace by being a hidden direct clone?

**Pass:** evidence supports close substitute/directness classification and clarifies whether action->identity/avatar causality exists

**Downgrade/kill:** metadata claim is not visible, flow is unrelated, or app is only decorative/generic without daily transformation loop

**После walkthrough:** если onboarding не показывает causality, использовать как adjacent benchmark; если неожиданно есть action -> identity/progress, поднять в hidden-clone review.

**URL:** https://apps.apple.com/us/app/zing-ai-home-gym-workouts/id1552207792?uo=4

## 3. Miracle Morning Routine

**Риск:** низкий публичный риск: листинг поддерживает adjacency, но не доказывает full-loop clone

**Публичный read:** public_listing_supports_adjacent_loop_not_causality; causality=not_visible_public_listing; hidden_clone=low_public_listing_directness_risk.

**Деньги:** strong_bottom_up_money_proxy; IAP=$12.99-$99.99.

**Review signals:** loves_daily_loop:17|content_depth_request:13|loves_avatar_progress:9|loves_emotional_support:6|pricing_complaint:5

**Скрин-слоты:** app_store_listing_or_public_positioning: What promise, audience, and daily loop does the public listing imply? -> output/manual_validation/03-miracle-morning-routine-app_store_listing_or_public_positioning.png | onboarding_first_value_screen: Does onboarding show one coherent loop or separate feature shelves? -> output/manual_validation/03-miracle-morning-routine-onboarding_first_value_screen.png | first_daily_action_or_task_screen: Is there a concrete action that can be completed in under two minutes? -> output/manual_validation/03-miracle-morning-routine-first_daily_action_or_task_screen.png | progress_avatar_identity_feedback_screen: Does completion visibly change avatar, identity, or progress feedback? -> output/manual_validation/03-miracle-morning-routine-progress_avatar_identity_feedback_screen.png | first_paywall_or_iap_terms_screen: Is the first meaningful value before or after a subscription/trial wall? -> output/manual_validation/03-miracle-morning-routine-first_paywall_or_iap_terms_screen.png

**Решающие вопросы:** Does onboarding show one coherent daily loop or separate feature shelves?|Is there a personal meaning prompt before the action?|Is there one concrete action that can be completed in under two minutes?|Does completion causally change avatar/identity/progress feedback?|Is paywall before or after first meaningful value?|Would this invalidate Alina whitespace by being a hidden direct clone?

**Pass:** evidence supports close substitute/directness classification and clarifies whether action->identity/avatar causality exists

**Downgrade/kill:** metadata claim is not visible, flow is unrelated, or app is only decorative/generic without daily transformation loop

**После walkthrough:** если onboarding не показывает causality, использовать как adjacent benchmark; если неожиданно есть action -> identity/progress, поднять в hidden-clone review.

**URL:** https://apps.apple.com/us/app/miracle-morning-routine/id1581511740?uo=4

## 4. EVOLVE: Transform Your Life

**Риск:** желтый риск: публичный текст похож на строгую петлю, но причинность надо увидеть в приложении

**Публичный read:** public_listing_supports_strict_loop_claim; causality=decorative_or_progress_only_possible; hidden_clone=medium_adjacency_risk.

**Деньги:** strong_bottom_up_money_proxy; IAP=$9.99-$99.99.

**Review signals:** loves_daily_loop:13|pricing_complaint:11|content_depth_request:10|loves_avatar_progress:8|churn_signal:6

**Скрин-слоты:** app_store_listing_or_public_positioning: What promise, audience, and daily loop does the public listing imply? -> output/manual_validation/04-evolve-transform-your-life-app_store_listing_or_public_positioning.png | onboarding_first_value_screen: Does onboarding show one coherent loop or separate feature shelves? -> output/manual_validation/04-evolve-transform-your-life-onboarding_first_value_screen.png | first_daily_action_or_task_screen: Is there a concrete action that can be completed in under two minutes? -> output/manual_validation/04-evolve-transform-your-life-first_daily_action_or_task_screen.png | progress_avatar_identity_feedback_screen: Does completion visibly change avatar, identity, or progress feedback? -> output/manual_validation/04-evolve-transform-your-life-progress_avatar_identity_feedback_screen.png | first_paywall_or_iap_terms_screen: Is the first meaningful value before or after a subscription/trial wall? -> output/manual_validation/04-evolve-transform-your-life-first_paywall_or_iap_terms_screen.png

**Решающие вопросы:** Does onboarding show one coherent daily loop or separate feature shelves?|Is there a personal meaning prompt before the action?|Is there one concrete action that can be completed in under two minutes?|Does completion causally change avatar/identity/progress feedback?|Is paywall before or after first meaningful value?|Would this invalidate Alina whitespace by being a hidden direct clone?

**Pass:** evidence supports close substitute/directness classification and clarifies whether action->identity/avatar causality exists

**Downgrade/kill:** metadata claim is not visible, flow is unrelated, or app is only decorative/generic without daily transformation loop

**После walkthrough:** если causality видна в first session, H1/H3 получают сильный competitor boundary; если нет, downgrade public-listing claim до adjacent/progression only.

**URL:** https://apps.apple.com/us/app/evolve-transform-your-life/id6754897547?uo=4

## 5. Daily Yoga: Yoga for Fitness®

**Риск:** низкий публичный риск: листинг поддерживает adjacency, но не доказывает full-loop clone

**Публичный read:** public_listing_supports_adjacent_loop_not_causality; causality=not_visible_public_listing; hidden_clone=low_public_listing_directness_risk.

**Деньги:** strong_bottom_up_money_proxy; IAP=$9.99-$69.99.

**Review signals:** loves_avatar_progress:6|loves_daily_loop:6|content_depth_request:6|loves_emotional_support:5|pricing_complaint:5

**Скрин-слоты:** app_store_listing_or_public_positioning: What promise, audience, and daily loop does the public listing imply? -> output/manual_validation/05-daily-yoga-yoga-for-fitness-app_store_listing_or_public_positioning.png | onboarding_first_value_screen: Does onboarding show one coherent loop or separate feature shelves? -> output/manual_validation/05-daily-yoga-yoga-for-fitness-onboarding_first_value_screen.png | first_daily_action_or_task_screen: Is there a concrete action that can be completed in under two minutes? -> output/manual_validation/05-daily-yoga-yoga-for-fitness-first_daily_action_or_task_screen.png | progress_avatar_identity_feedback_screen: Does completion visibly change avatar, identity, or progress feedback? -> output/manual_validation/05-daily-yoga-yoga-for-fitness-progress_avatar_identity_feedback_screen.png | first_paywall_or_iap_terms_screen: Is the first meaningful value before or after a subscription/trial wall? -> output/manual_validation/05-daily-yoga-yoga-for-fitness-first_paywall_or_iap_terms_screen.png

**Решающие вопросы:** Does onboarding show one coherent daily loop or separate feature shelves?|Is there a personal meaning prompt before the action?|Is there one concrete action that can be completed in under two minutes?|Does completion causally change avatar/identity/progress feedback?|Is paywall before or after first meaningful value?|Would this invalidate Alina whitespace by being a hidden direct clone?

**Pass:** evidence supports close substitute/directness classification and clarifies whether action->identity/avatar causality exists

**Downgrade/kill:** metadata claim is not visible, flow is unrelated, or app is only decorative/generic without daily transformation loop

**После walkthrough:** если onboarding не показывает causality, использовать как adjacent benchmark; если неожиданно есть action -> identity/progress, поднять в hidden-clone review.

**URL:** https://apps.apple.com/us/app/daily-yoga-yoga-for-fitness/id545849922?uo=4

## 6. Daily Burn: Workout Coach

**Риск:** желтый риск: публичный текст похож на строгую петлю, но причинность надо увидеть в приложении

**Публичный read:** public_listing_supports_strict_loop_claim; causality=decorative_or_progress_only_possible; hidden_clone=medium_adjacency_risk.

**Деньги:** strong_bottom_up_money_proxy; IAP=$9.99-$149.99.

**Review signals:** loves_daily_loop:16|content_depth_request:15|pricing_complaint:14|loves_avatar_progress:6|churn_signal:6

**Скрин-слоты:** app_store_listing_or_public_positioning: What promise, audience, and daily loop does the public listing imply? -> output/manual_validation/06-daily-burn-workout-coach-app_store_listing_or_public_positioning.png | onboarding_first_value_screen: Does onboarding show one coherent loop or separate feature shelves? -> output/manual_validation/06-daily-burn-workout-coach-onboarding_first_value_screen.png | first_daily_action_or_task_screen: Is there a concrete action that can be completed in under two minutes? -> output/manual_validation/06-daily-burn-workout-coach-first_daily_action_or_task_screen.png | progress_avatar_identity_feedback_screen: Does completion visibly change avatar, identity, or progress feedback? -> output/manual_validation/06-daily-burn-workout-coach-progress_avatar_identity_feedback_screen.png | first_paywall_or_iap_terms_screen: Is the first meaningful value before or after a subscription/trial wall? -> output/manual_validation/06-daily-burn-workout-coach-first_paywall_or_iap_terms_screen.png

**Решающие вопросы:** Does onboarding show one coherent daily loop or separate feature shelves?|Is there a personal meaning prompt before the action?|Is there one concrete action that can be completed in under two minutes?|Does completion causally change avatar/identity/progress feedback?|Is paywall before or after first meaningful value?|Would this invalidate Alina whitespace by being a hidden direct clone?

**Pass:** evidence supports close substitute/directness classification and clarifies whether action->identity/avatar causality exists

**Downgrade/kill:** metadata claim is not visible, flow is unrelated, or app is only decorative/generic without daily transformation loop

**После walkthrough:** если causality видна в first session, H1/H3 получают сильный competitor boundary; если нет, downgrade public-listing claim до adjacent/progression only.

**URL:** https://apps.apple.com/us/app/daily-burn-workout-coach/id472322122?uo=4

## 7. Myla : Manifest & Vision Board

**Риск:** средний риск: adjacent loop может оказаться близким после onboarding

**Публичный read:** public_listing_supports_adjacent_loop_not_causality; causality=inferred_from_public_copy_not_causal; hidden_clone=medium_adjacency_risk.

**Деньги:** medium_bottom_up_money_proxy; IAP=$0.00-$42.99.

**Review signals:** loves_daily_loop:15|content_depth_request:12|pricing_complaint:8|loves_emotional_support:8|churn_signal:6

**Скрин-слоты:** app_store_listing_or_public_positioning: What promise, audience, and daily loop does the public listing imply? -> output/manual_validation/07-myla-manifest-vision-board-app_store_listing_or_public_positioning.png | onboarding_first_value_screen: Does onboarding show one coherent loop or separate feature shelves? -> output/manual_validation/07-myla-manifest-vision-board-onboarding_first_value_screen.png | first_daily_action_or_task_screen: Is there a concrete action that can be completed in under two minutes? -> output/manual_validation/07-myla-manifest-vision-board-first_daily_action_or_task_screen.png | progress_avatar_identity_feedback_screen: Does completion visibly change avatar, identity, or progress feedback? -> output/manual_validation/07-myla-manifest-vision-board-progress_avatar_identity_feedback_screen.png | first_paywall_or_iap_terms_screen: Is the first meaningful value before or after a subscription/trial wall? -> output/manual_validation/07-myla-manifest-vision-board-first_paywall_or_iap_terms_screen.png

**Решающие вопросы:** Does onboarding show one coherent daily loop or separate feature shelves?|Is there a personal meaning prompt before the action?|Is there one concrete action that can be completed in under two minutes?|Does completion causally change avatar/identity/progress feedback?|Is paywall before or after first meaningful value?|Would this invalidate Alina whitespace by being a hidden direct clone?

**Pass:** evidence supports close substitute/directness classification and clarifies whether action->identity/avatar causality exists

**Downgrade/kill:** metadata claim is not visible, flow is unrelated, or app is only decorative/generic without daily transformation loop

**После walkthrough:** если onboarding не показывает causality, использовать как adjacent benchmark; если неожиданно есть action -> identity/progress, поднять в hidden-clone review.

**URL:** https://apps.apple.com/us/app/myla-manifest-vision-board/id1638650650?uo=4

## 8. Rosebud: AI Journal & Diary

**Риск:** средний риск: adjacent loop может оказаться близким после onboarding

**Публичный read:** public_listing_supports_adjacent_loop_not_causality; causality=decorative_or_progress_only_possible; hidden_clone=medium_adjacency_risk.

**Деньги:** medium_bottom_up_money_proxy; IAP=$11.00-$107.99.

**Review signals:** content_depth_request:17|loves_emotional_support:13|pricing_complaint:9|loves_avatar_progress:7|loves_daily_loop:4

**Скрин-слоты:** app_store_listing_or_public_positioning: What promise, audience, and daily loop does the public listing imply? -> output/manual_validation/08-rosebud-ai-journal-diary-app_store_listing_or_public_positioning.png | onboarding_first_value_screen: Does onboarding show one coherent loop or separate feature shelves? -> output/manual_validation/08-rosebud-ai-journal-diary-onboarding_first_value_screen.png | first_daily_action_or_task_screen: Is there a concrete action that can be completed in under two minutes? -> output/manual_validation/08-rosebud-ai-journal-diary-first_daily_action_or_task_screen.png | progress_avatar_identity_feedback_screen: Does completion visibly change avatar, identity, or progress feedback? -> output/manual_validation/08-rosebud-ai-journal-diary-progress_avatar_identity_feedback_screen.png | first_paywall_or_iap_terms_screen: Is the first meaningful value before or after a subscription/trial wall? -> output/manual_validation/08-rosebud-ai-journal-diary-first_paywall_or_iap_terms_screen.png

**Решающие вопросы:** Does onboarding show one coherent daily loop or separate feature shelves?|Is there a personal meaning prompt before the action?|Is there one concrete action that can be completed in under two minutes?|Does completion causally change avatar/identity/progress feedback?|Is paywall before or after first meaningful value?|Would this invalidate Alina whitespace by being a hidden direct clone?

**Pass:** evidence supports close substitute/directness classification and clarifies whether action->identity/avatar causality exists

**Downgrade/kill:** metadata claim is not visible, flow is unrelated, or app is only decorative/generic without daily transformation loop

**После walkthrough:** если onboarding не показывает causality, использовать как adjacent benchmark; если неожиданно есть action -> identity/progress, поднять в hidden-clone review.

**URL:** https://apps.apple.com/us/app/rosebud-ai-journal-diary/id6451135127?uo=4

## 9. Habit Tracker : Haby

**Риск:** средний риск: adjacent loop может оказаться близким после onboarding

**Публичный read:** public_listing_supports_adjacent_loop_not_causality; causality=decorative_or_progress_only_possible; hidden_clone=medium_adjacency_risk.

**Деньги:** medium_bottom_up_money_proxy; IAP=$0.00-$89.99.

**Review signals:** loves_daily_loop:15|content_depth_request:10|pricing_complaint:9|loves_avatar_progress:4|quality_bug_complaint:2

**Скрин-слоты:** app_store_listing_or_public_positioning: What promise, audience, and daily loop does the public listing imply? -> output/manual_validation/09-habit-tracker-haby-app_store_listing_or_public_positioning.png | onboarding_first_value_screen: Does onboarding show one coherent loop or separate feature shelves? -> output/manual_validation/09-habit-tracker-haby-onboarding_first_value_screen.png | first_daily_action_or_task_screen: Is there a concrete action that can be completed in under two minutes? -> output/manual_validation/09-habit-tracker-haby-first_daily_action_or_task_screen.png | progress_avatar_identity_feedback_screen: Does completion visibly change avatar, identity, or progress feedback? -> output/manual_validation/09-habit-tracker-haby-progress_avatar_identity_feedback_screen.png | first_paywall_or_iap_terms_screen: Is the first meaningful value before or after a subscription/trial wall? -> output/manual_validation/09-habit-tracker-haby-first_paywall_or_iap_terms_screen.png

**Решающие вопросы:** Does onboarding show one coherent daily loop or separate feature shelves?|Is there a personal meaning prompt before the action?|Is there one concrete action that can be completed in under two minutes?|Does completion causally change avatar/identity/progress feedback?|Is paywall before or after first meaningful value?|Would this invalidate Alina whitespace by being a hidden direct clone?

**Pass:** evidence supports close substitute/directness classification and clarifies whether action->identity/avatar causality exists

**Downgrade/kill:** metadata claim is not visible, flow is unrelated, or app is only decorative/generic without daily transformation loop

**После walkthrough:** если onboarding не показывает causality, использовать как adjacent benchmark; если неожиданно есть action -> identity/progress, поднять в hidden-clone review.

**URL:** https://apps.apple.com/us/app/habit-tracker-haby/id6739170801?uo=4

## 10. Goddess・Women's Wellness Coach

**Риск:** низкий публичный риск: листинг поддерживает adjacency, но не доказывает full-loop clone

**Публичный read:** public_listing_supports_adjacent_loop_not_causality; causality=not_visible_public_listing; hidden_clone=low_public_listing_directness_risk.

**Деньги:** medium_bottom_up_money_proxy; IAP=$6.99-$54.90.

**Review signals:** content_depth_request:12|pricing_complaint:10|loves_emotional_support:9|loves_avatar_progress:7|churn_signal:4

**Скрин-слоты:** app_store_listing_or_public_positioning: What promise, audience, and daily loop does the public listing imply? -> output/manual_validation/10-goddess-women-s-wellness-coach-app_store_listing_or_public_positioning.png | onboarding_first_value_screen: Does onboarding show one coherent loop or separate feature shelves? -> output/manual_validation/10-goddess-women-s-wellness-coach-onboarding_first_value_screen.png | first_daily_action_or_task_screen: Is there a concrete action that can be completed in under two minutes? -> output/manual_validation/10-goddess-women-s-wellness-coach-first_daily_action_or_task_screen.png | progress_avatar_identity_feedback_screen: Does completion visibly change avatar, identity, or progress feedback? -> output/manual_validation/10-goddess-women-s-wellness-coach-progress_avatar_identity_feedback_screen.png | first_paywall_or_iap_terms_screen: Is the first meaningful value before or after a subscription/trial wall? -> output/manual_validation/10-goddess-women-s-wellness-coach-first_paywall_or_iap_terms_screen.png

**Решающие вопросы:** Does onboarding show one coherent daily loop or separate feature shelves?|Is there a personal meaning prompt before the action?|Is there one concrete action that can be completed in under two minutes?|Does completion causally change avatar/identity/progress feedback?|Is paywall before or after first meaningful value?|Would this invalidate Alina whitespace by being a hidden direct clone?

**Pass:** evidence supports close substitute/directness classification and clarifies whether action->identity/avatar causality exists

**Downgrade/kill:** metadata claim is not visible, flow is unrelated, or app is only decorative/generic without daily transformation loop

**После walkthrough:** если onboarding не показывает causality, использовать как adjacent benchmark; если неожиданно есть action -> identity/progress, поднять в hidden-clone review.

**URL:** https://apps.apple.com/us/app/goddess-womens-wellness-coach/id1527058035?uo=4

## 11. LifeWheel Goal Habit Tracker

**Риск:** средний риск: adjacent loop может оказаться близким после onboarding

**Публичный read:** public_listing_supports_adjacent_loop_not_causality; causality=decorative_or_progress_only_possible; hidden_clone=medium_adjacency_risk.

**Деньги:** medium_bottom_up_money_proxy; IAP=$5.99-$79.99.

**Review signals:** content_depth_request:12|loves_daily_loop:10|pricing_complaint:6|loves_avatar_progress:6|trust_accuracy_complaint:4

**Скрин-слоты:** app_store_listing_or_public_positioning: What promise, audience, and daily loop does the public listing imply? -> output/manual_validation/11-lifewheel-goal-habit-tracker-app_store_listing_or_public_positioning.png | onboarding_first_value_screen: Does onboarding show one coherent loop or separate feature shelves? -> output/manual_validation/11-lifewheel-goal-habit-tracker-onboarding_first_value_screen.png | first_daily_action_or_task_screen: Is there a concrete action that can be completed in under two minutes? -> output/manual_validation/11-lifewheel-goal-habit-tracker-first_daily_action_or_task_screen.png | progress_avatar_identity_feedback_screen: Does completion visibly change avatar, identity, or progress feedback? -> output/manual_validation/11-lifewheel-goal-habit-tracker-progress_avatar_identity_feedback_screen.png | first_paywall_or_iap_terms_screen: Is the first meaningful value before or after a subscription/trial wall? -> output/manual_validation/11-lifewheel-goal-habit-tracker-first_paywall_or_iap_terms_screen.png

**Решающие вопросы:** Does onboarding show one coherent daily loop or separate feature shelves?|Is there a personal meaning prompt before the action?|Is there one concrete action that can be completed in under two minutes?|Does completion causally change avatar/identity/progress feedback?|Is paywall before or after first meaningful value?|Would this invalidate Alina whitespace by being a hidden direct clone?

**Pass:** evidence supports close substitute/directness classification and clarifies whether action->identity/avatar causality exists

**Downgrade/kill:** metadata claim is not visible, flow is unrelated, or app is only decorative/generic without daily transformation loop

**После walkthrough:** если onboarding не показывает causality, использовать как adjacent benchmark; если неожиданно есть action -> identity/progress, поднять в hidden-clone review.

**URL:** https://apps.apple.com/us/app/lifewheel-goal-habit-tracker/id988402523?uo=4

## 12. Habit Tracker

**Риск:** средний риск: adjacent loop может оказаться близким после onboarding

**Публичный read:** public_listing_supports_adjacent_loop_not_causality; causality=decorative_or_progress_only_possible; hidden_clone=medium_adjacency_risk.

**Деньги:** strong_bottom_up_money_proxy; IAP=$4.99-$12.99.

**Review signals:** loves_daily_loop:13|pricing_complaint:13|content_depth_request:13|loves_emotional_support:5|loves_avatar_progress:5

**Скрин-слоты:** app_store_listing_or_public_positioning: What promise, audience, and daily loop does the public listing imply? -> output/manual_validation/12-habit-tracker-app_store_listing_or_public_positioning.png | onboarding_first_value_screen: Does onboarding show one coherent loop or separate feature shelves? -> output/manual_validation/12-habit-tracker-onboarding_first_value_screen.png | first_daily_action_or_task_screen: Is there a concrete action that can be completed in under two minutes? -> output/manual_validation/12-habit-tracker-first_daily_action_or_task_screen.png | progress_avatar_identity_feedback_screen: Does completion visibly change avatar, identity, or progress feedback? -> output/manual_validation/12-habit-tracker-progress_avatar_identity_feedback_screen.png | first_paywall_or_iap_terms_screen: Is the first meaningful value before or after a subscription/trial wall? -> output/manual_validation/12-habit-tracker-first_paywall_or_iap_terms_screen.png

**Решающие вопросы:** Does onboarding show one coherent daily loop or separate feature shelves?|Is there a personal meaning prompt before the action?|Is there one concrete action that can be completed in under two minutes?|Does completion causally change avatar/identity/progress feedback?|Is paywall before or after first meaningful value?|Would this invalidate Alina whitespace by being a hidden direct clone?

**Pass:** evidence supports close substitute/directness classification and clarifies whether action->identity/avatar causality exists

**Downgrade/kill:** metadata claim is not visible, flow is unrelated, or app is only decorative/generic without daily transformation loop

**После walkthrough:** если onboarding не показывает causality, использовать как adjacent benchmark; если неожиданно есть action -> identity/progress, поднять в hidden-clone review.

**URL:** https://apps.apple.com/us/app/habit-tracker/id1438388363?uo=4

## Файлы

- `data_processed/russian_p0_walkthrough_dossiers.csv`
- `docs/competitive/russian-p0-walkthrough-dossiers-v1.md`
- `data_processed/manual_competitor_inspection_packet.csv`
- `data_processed/manual_walkthrough_capture_sheet.csv`
- `data_processed/public_listing_inspection_results.csv`
- `data_processed/top100_human_validation_queue.csv`
