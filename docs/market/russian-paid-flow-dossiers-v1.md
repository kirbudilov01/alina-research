# Русские paid-flow dossiers V1

Собрано: 2026-05-31T12:47:37.768Z

## Зачем нужен этот слой

Этот dossier переводит H2 из рыночной модели и pricing proxy в конкретную ручную проверку paid surfaces. Он не доказывает выручку и не заменяет paid intelligence. Его задача - показать, какие страницы и продукты надо проверить человеком, где есть видимая цена, где нужен product-match, где paywall boundary и что должно произойти с H2 после signoff.

Всего paid-flow dossiers: 10. Required slots: 40. Completed slots: 0. Confirmed public-pricing prefill: 2. Пока completed slots равны нулю, H2 остается range/proxy-supported, но не final investor-grade.

## Очередь paid-flow проверки

| # | Product | Market | Prefill | Price evidence | Slots | Done |
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

## 1. Character AI: Chat, Talk, Text

**Риск чтения:** сильный public-pricing сигнал, но нужен human product-match и paid-boundary signoff

**Цена / IAP:** public=$9.99|$94.99; store=нет данных.

**Скрин-слоты:** public_pricing_or_store_iap: Capture visible price, trial, subscription term, or IAP list. -> output/manual_validation/paid-flow-01-character-ai-chat-talk-text-public_pricing_or_store_iap.png | first_meaningful_paywall_boundary: Capture whether the paywall appears before or after first meaningful loop value. -> output/manual_validation/paid-flow-01-character-ai-chat-talk-text-first_meaningful_paywall_boundary.png | plan_depth_and_unlocks: Capture what paid tier unlocks and whether it matches Alina paid-depth logic. -> output/manual_validation/paid-flow-01-character-ai-chat-talk-text-plan_depth_and_unlocks.png | human_match_check: Confirm the paid surface belongs to the same product/app, not a parent or unrelated page. -> output/manual_validation/paid-flow-01-character-ai-chat-talk-text-human_match_check.png

**Решающие вопросы:** Видна ли цена или trial? Принадлежит ли paid surface тому же продукту? Появляется ли paywall до или после first meaningful value? Что именно unlocks paid tier? Похожа ли paid depth на Alina logic или это unrelated monetization?

**Upgrade:** если price, product-match и paid-boundary подтверждены человеком, H2 получает stronger paid-surface support; если нет, сигнал остается public-pricing proxy.

**Downgrade:** если price относится к parent page, B2B offer, unrelated product, login-only flow или не совпадает с user-facing product, H2 claim надо ослабить и убрать источник из сильной опоры.

**URL:** https://character.ai/subscribe

## 2. Meditopia: Sleep & Meditation

**Риск чтения:** сильный public-pricing сигнал, но нужен human product-match и paid-boundary signoff

**Цена / IAP:** public=$3.50; store=нет данных.

**Скрин-слоты:** public_pricing_or_store_iap: Capture visible price, trial, subscription term, or IAP list. -> output/manual_validation/paid-flow-02-meditopia-sleep-meditation-public_pricing_or_store_iap.png | first_meaningful_paywall_boundary: Capture whether the paywall appears before or after first meaningful loop value. -> output/manual_validation/paid-flow-02-meditopia-sleep-meditation-first_meaningful_paywall_boundary.png | plan_depth_and_unlocks: Capture what paid tier unlocks and whether it matches Alina paid-depth logic. -> output/manual_validation/paid-flow-02-meditopia-sleep-meditation-plan_depth_and_unlocks.png | human_match_check: Confirm the paid surface belongs to the same product/app, not a parent or unrelated page. -> output/manual_validation/paid-flow-02-meditopia-sleep-meditation-human_match_check.png

**Решающие вопросы:** Видна ли цена или trial? Принадлежит ли paid surface тому же продукту? Появляется ли paywall до или после first meaningful value? Что именно unlocks paid tier? Похожа ли paid depth на Alina logic или это unrelated monetization?

**Upgrade:** если price, product-match и paid-boundary подтверждены человеком, H2 получает stronger paid-surface support; если нет, сигнал остается public-pricing proxy.

**Downgrade:** если price относится к parent page, B2B offer, unrelated product, login-only flow или не совпадает с user-facing product, H2 claim надо ослабить и убрать источник из сильной опоры.

**URL:** https://meditopia.com/en/plans

## 3. Carrom Pool: Disc Game

**Риск чтения:** слабый или смешанный public signal: использовать только как очередь для проверки, не как proof денег

**Цена / IAP:** public=нет чистой public price; store=нет данных.

**Скрин-слоты:** public_pricing_or_store_iap: Capture visible price, trial, subscription term, or IAP list. -> output/manual_validation/paid-flow-03-carrom-pool-disc-game-public_pricing_or_store_iap.png | first_meaningful_paywall_boundary: Capture whether the paywall appears before or after first meaningful loop value. -> output/manual_validation/paid-flow-03-carrom-pool-disc-game-first_meaningful_paywall_boundary.png | plan_depth_and_unlocks: Capture what paid tier unlocks and whether it matches Alina paid-depth logic. -> output/manual_validation/paid-flow-03-carrom-pool-disc-game-plan_depth_and_unlocks.png | human_match_check: Confirm the paid surface belongs to the same product/app, not a parent or unrelated page. -> output/manual_validation/paid-flow-03-carrom-pool-disc-game-human_match_check.png

**Решающие вопросы:** Видна ли цена или trial? Принадлежит ли paid surface тому же продукту? Появляется ли paywall до или после first meaningful value? Что именно unlocks paid tier? Похожа ли paid depth на Alina logic или это unrelated monetization?

**Upgrade:** если human review не подтверждает product-match, убрать этот источник из H2 support или понизить до context-only.

**Downgrade:** если price относится к parent page, B2B offer, unrelated product, login-only flow или не совпадает с user-facing product, H2 claim надо ослабить и убрать источник из сильной опоры.

**URL:** https://www.miniclip.com/pricing

## 4. Avatar World ®

**Риск чтения:** слабый или смешанный public signal: использовать только как очередь для проверки, не как proof денег

**Цена / IAP:** public=нет чистой public price; store=нет данных.

**Скрин-слоты:** public_pricing_or_store_iap: Capture visible price, trial, subscription term, or IAP list. -> output/manual_validation/paid-flow-04-avatar-world-public_pricing_or_store_iap.png | first_meaningful_paywall_boundary: Capture whether the paywall appears before or after first meaningful loop value. -> output/manual_validation/paid-flow-04-avatar-world-first_meaningful_paywall_boundary.png | plan_depth_and_unlocks: Capture what paid tier unlocks and whether it matches Alina paid-depth logic. -> output/manual_validation/paid-flow-04-avatar-world-plan_depth_and_unlocks.png | human_match_check: Confirm the paid surface belongs to the same product/app, not a parent or unrelated page. -> output/manual_validation/paid-flow-04-avatar-world-human_match_check.png

**Решающие вопросы:** Видна ли цена или trial? Принадлежит ли paid surface тому же продукту? Появляется ли paywall до или после first meaningful value? Что именно unlocks paid tier? Похожа ли paid depth на Alina logic или это unrelated monetization?

**Upgrade:** если human review не подтверждает product-match, убрать этот источник из H2 support или понизить до context-only.

**Downgrade:** если price относится к parent page, B2B offer, unrelated product, login-only flow или не совпадает с user-facing product, H2 claim надо ослабить и убрать источник из сильной опоры.

**URL:** https://pazugames.com/

## 5. AstroSage Kundli: AI Astrology

**Риск чтения:** слабый или смешанный public signal: использовать только как очередь для проверки, не как proof денег

**Цена / IAP:** public=нет чистой public price; store=нет данных.

**Скрин-слоты:** public_pricing_or_store_iap: Capture visible price, trial, subscription term, or IAP list. -> output/manual_validation/paid-flow-05-astrosage-kundli-ai-astrology-public_pricing_or_store_iap.png | first_meaningful_paywall_boundary: Capture whether the paywall appears before or after first meaningful loop value. -> output/manual_validation/paid-flow-05-astrosage-kundli-ai-astrology-first_meaningful_paywall_boundary.png | plan_depth_and_unlocks: Capture what paid tier unlocks and whether it matches Alina paid-depth logic. -> output/manual_validation/paid-flow-05-astrosage-kundli-ai-astrology-plan_depth_and_unlocks.png | human_match_check: Confirm the paid surface belongs to the same product/app, not a parent or unrelated page. -> output/manual_validation/paid-flow-05-astrosage-kundli-ai-astrology-human_match_check.png

**Решающие вопросы:** Видна ли цена или trial? Принадлежит ли paid surface тому же продукту? Появляется ли paywall до или после first meaningful value? Что именно unlocks paid tier? Похожа ли paid depth на Alina logic или это unrelated monetization?

**Upgrade:** если human review не подтверждает product-match, убрать этот источник из H2 support или понизить до context-only.

**Downgrade:** если price относится к parent page, B2B offer, unrelated product, login-only flow или не совпадает с user-facing product, H2 claim надо ослабить и убрать источник из сильной опоры.

**URL:** https://www.astrosage.com/

## 6. NBA 2K Mobile Basketball Game

**Риск чтения:** слабый или смешанный public signal: использовать только как очередь для проверки, не как proof денег

**Цена / IAP:** public=$20; store=нет данных.

**Скрин-слоты:** public_pricing_or_store_iap: Capture visible price, trial, subscription term, or IAP list. -> output/manual_validation/paid-flow-06-nba-2k-mobile-basketball-game-public_pricing_or_store_iap.png | first_meaningful_paywall_boundary: Capture whether the paywall appears before or after first meaningful loop value. -> output/manual_validation/paid-flow-06-nba-2k-mobile-basketball-game-first_meaningful_paywall_boundary.png | plan_depth_and_unlocks: Capture what paid tier unlocks and whether it matches Alina paid-depth logic. -> output/manual_validation/paid-flow-06-nba-2k-mobile-basketball-game-plan_depth_and_unlocks.png | human_match_check: Confirm the paid surface belongs to the same product/app, not a parent or unrelated page. -> output/manual_validation/paid-flow-06-nba-2k-mobile-basketball-game-human_match_check.png

**Решающие вопросы:** Видна ли цена или trial? Принадлежит ли paid surface тому же продукту? Появляется ли paywall до или после first meaningful value? Что именно unlocks paid tier? Похожа ли paid depth на Alina logic или это unrelated monetization?

**Upgrade:** если human review не подтверждает product-match, убрать этот источник из H2 support или понизить до context-only.

**Downgrade:** если price относится к parent page, B2B offer, unrelated product, login-only flow или не совпадает с user-facing product, H2 claim надо ослабить и убрать источник из сильной опоры.

**URL:** https://www.nba2kmobile.com/

## 7. Everskies: Virtual Dress up

**Риск чтения:** слабый или смешанный public signal: использовать только как очередь для проверки, не как proof денег

**Цена / IAP:** public=нет чистой public price; store=нет данных.

**Скрин-слоты:** public_pricing_or_store_iap: Capture visible price, trial, subscription term, or IAP list. -> output/manual_validation/paid-flow-07-everskies-virtual-dress-up-public_pricing_or_store_iap.png | first_meaningful_paywall_boundary: Capture whether the paywall appears before or after first meaningful loop value. -> output/manual_validation/paid-flow-07-everskies-virtual-dress-up-first_meaningful_paywall_boundary.png | plan_depth_and_unlocks: Capture what paid tier unlocks and whether it matches Alina paid-depth logic. -> output/manual_validation/paid-flow-07-everskies-virtual-dress-up-plan_depth_and_unlocks.png | human_match_check: Confirm the paid surface belongs to the same product/app, not a parent or unrelated page. -> output/manual_validation/paid-flow-07-everskies-virtual-dress-up-human_match_check.png

**Решающие вопросы:** Видна ли цена или trial? Принадлежит ли paid surface тому же продукту? Появляется ли paywall до или после first meaningful value? Что именно unlocks paid tier? Похожа ли paid depth на Alina logic или это unrelated monetization?

**Upgrade:** если human review не подтверждает product-match, убрать этот источник из H2 support или понизить до context-only.

**Downgrade:** если price относится к parent page, B2B offer, unrelated product, login-only flow или не совпадает с user-facing product, H2 claim надо ослабить и убрать источник из сильной опоры.

**URL:** https://everskies.com/pricing

## 8. Mindfulness with Petit BamBou

**Риск чтения:** слабый или смешанный public signal: использовать только как очередь для проверки, не как proof денег

**Цена / IAP:** public=нет чистой public price; store=нет данных.

**Скрин-слоты:** public_pricing_or_store_iap: Capture visible price, trial, subscription term, or IAP list. -> output/manual_validation/paid-flow-08-mindfulness-with-petit-bambou-public_pricing_or_store_iap.png | first_meaningful_paywall_boundary: Capture whether the paywall appears before or after first meaningful loop value. -> output/manual_validation/paid-flow-08-mindfulness-with-petit-bambou-first_meaningful_paywall_boundary.png | plan_depth_and_unlocks: Capture what paid tier unlocks and whether it matches Alina paid-depth logic. -> output/manual_validation/paid-flow-08-mindfulness-with-petit-bambou-plan_depth_and_unlocks.png | human_match_check: Confirm the paid surface belongs to the same product/app, not a parent or unrelated page. -> output/manual_validation/paid-flow-08-mindfulness-with-petit-bambou-human_match_check.png

**Решающие вопросы:** Видна ли цена или trial? Принадлежит ли paid surface тому же продукту? Появляется ли paywall до или после first meaningful value? Что именно unlocks paid tier? Похожа ли paid depth на Alina logic или это unrelated monetization?

**Upgrade:** если human review не подтверждает product-match, убрать этот источник из H2 support или понизить до context-only.

**Downgrade:** если price относится к parent page, B2B offer, unrelated product, login-only flow или не совпадает с user-facing product, H2 claim надо ослабить и убрать источник из сильной опоры.

**URL:** https://www.petitbambou.com/en

## 9. Monster Girl Maker 2

**Риск чтения:** слабый или смешанный public signal: использовать только как очередь для проверки, не как proof денег

**Цена / IAP:** public=$9; store=нет данных.

**Скрин-слоты:** public_pricing_or_store_iap: Capture visible price, trial, subscription term, or IAP list. -> output/manual_validation/paid-flow-09-monster-girl-maker-2-public_pricing_or_store_iap.png | first_meaningful_paywall_boundary: Capture whether the paywall appears before or after first meaningful loop value. -> output/manual_validation/paid-flow-09-monster-girl-maker-2-first_meaningful_paywall_boundary.png | plan_depth_and_unlocks: Capture what paid tier unlocks and whether it matches Alina paid-depth logic. -> output/manual_validation/paid-flow-09-monster-girl-maker-2-plan_depth_and_unlocks.png | human_match_check: Confirm the paid surface belongs to the same product/app, not a parent or unrelated page. -> output/manual_validation/paid-flow-09-monster-girl-maker-2-human_match_check.png

**Решающие вопросы:** Видна ли цена или trial? Принадлежит ли paid surface тому же продукту? Появляется ли paywall до или после first meaningful value? Что именно unlocks paid tier? Похожа ли paid depth на Alina logic или это unrelated monetization?

**Upgrade:** если human review не подтверждает product-match, убрать этот источник из H2 support или понизить до context-only.

**Downgrade:** если price относится к parent page, B2B offer, unrelated product, login-only flow или не совпадает с user-facing product, H2 claim надо ослабить и убрать источник из сильной опоры.

**URL:** https://www.ghoulkiss.com/

## 10. Monster Girl Maker

**Риск чтения:** слабый или смешанный public signal: использовать только как очередь для проверки, не как proof денег

**Цена / IAP:** public=$9; store=нет данных.

**Скрин-слоты:** public_pricing_or_store_iap: Capture visible price, trial, subscription term, or IAP list. -> output/manual_validation/paid-flow-10-monster-girl-maker-public_pricing_or_store_iap.png | first_meaningful_paywall_boundary: Capture whether the paywall appears before or after first meaningful loop value. -> output/manual_validation/paid-flow-10-monster-girl-maker-first_meaningful_paywall_boundary.png | plan_depth_and_unlocks: Capture what paid tier unlocks and whether it matches Alina paid-depth logic. -> output/manual_validation/paid-flow-10-monster-girl-maker-plan_depth_and_unlocks.png | human_match_check: Confirm the paid surface belongs to the same product/app, not a parent or unrelated page. -> output/manual_validation/paid-flow-10-monster-girl-maker-human_match_check.png

**Решающие вопросы:** Видна ли цена или trial? Принадлежит ли paid surface тому же продукту? Появляется ли paywall до или после first meaningful value? Что именно unlocks paid tier? Похожа ли paid depth на Alina logic или это unrelated monetization?

**Upgrade:** если human review не подтверждает product-match, убрать этот источник из H2 support или понизить до context-only.

**Downgrade:** если price относится к parent page, B2B offer, unrelated product, login-only flow или не совпадает с user-facing product, H2 claim надо ослабить и убрать источник из сильной опоры.

**URL:** https://www.ghoulkiss.com/

## Файлы

- `data_processed/russian_paid_flow_dossiers.csv`
- `docs/market/russian-paid-flow-dossiers-v1.md`
- `data_processed/paid_flow_capture_sheet.csv`
- `data_processed/web_paywall_visual_adjudication.csv`
- `data_processed/competitor_revenue_proxy_review.csv`
