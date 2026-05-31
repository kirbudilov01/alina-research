# Global Competitor Archetype Rollup V1

Generated: 2026-05-31T16:30:29.836Z

## Зачем нужен этот слой

Этот rollup переводит top-100 competitors из списка приложений в понятные конкурентные классы. Он показывает, какие типы игроков формируют риск для Alina: spiritual habit loops, manifestation/self-improvement, avatar/identity coaching, gamified habits, astrology/tarot guidance и AI companion benchmarks.

## Важная граница

У top-100 scorecard нет ручной колонки “рынок/ниша”. Поэтому этот документ использует archetype mapping как промежуточную классификацию. Это помогает читать конкурентную карту, но не заменяет ручной walkthrough и не доказывает отсутствие hidden full-loop clone.

Также важно: некоторые source archetypes шумные. AI companion / tarot-oracle классы требуют ручной taxonomy cleanup перед тем, как использовать их для сильных market/whitespace claims. В этом rollup они оставлены не как доказательство категории, а как подсказка, где классификацию надо перепроверить.

## Archetype Table

| Archetype | Market role | Top-100 apps | Close/direct | Behavior-tied | Paid signal | Battlecards | Manual targets | Taxonomy | Top examples | Следующая проверка |
| --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | --- | --- | --- |
| ai_companion_roleplay | AI companion / identity benchmark | 1 | 1 | 0 | 1 | 1 | 1 | taxonomy_needs_manual_cleanup_before_claim_use | Habit Tracker (high_priority_close_substitute; score 29) | есть P0/manual targets: нужно пройти public listing -> onboarding -> first action -> progress/avatar feedback -> paywall boundary |
| astrology_guidance | astrology / esoterics | 12 | 6 | 0 | 4 | 0 | 0 | usable_for_directional_grouping | Sol - Inner Life & Wellbeing (high_priority_close_substitute; score 30.1) <br> Pocket Insight Psychic Reading (high_priority_close_substitute; score 27.7) <br> Bodhi: Astrology & Horoscope (high_priority_close_substitute; score 25.2) <br> Lunaria AI - Soulmate Drawing (close_substitute; score 21.4) | пока использовать как category context; апгрейдить только после sampling/walkthrough |
| avatar_identity_coaching | avatar / identity + coaching | 19 | 17 | 0 | 6 | 3 | 3 | usable_for_directional_grouping | Zing AI: Home & Gym Workouts (high_priority_close_substitute; score 34) <br> Daily Yoga: Yoga for Fitness® (high_priority_close_substitute; score 31.6) <br> Vida Health (high_priority_close_substitute; score 31) <br> Daily Burn: Workout Coach (high_priority_close_substitute; score 31) | есть P0/manual targets: нужно пройти public listing -> onboarding -> first action -> progress/avatar feedback -> paywall boundary |
| faith_devotional_habit | spiritual meaning / habit loop | 8 | 6 | 1 | 3 | 1 | 1 | usable_for_directional_grouping | Shepherd: Spiritual Bible BFF (direct_reference_competitor; score 40.9) <br> Good Morning Messages & Images (high_priority_close_substitute; score 27.6) <br> Testimonio (close_substitute; score 22.7) <br> Pactly: Social Habit Tracker (close_substitute; score 22) | есть P0/manual targets: нужно пройти public listing -> onboarding -> first action -> progress/avatar feedback -> paywall boundary |
| gamified_self_improvement | coaching / habits / progression | 13 | 12 | 0 | 8 | 1 | 1 | usable_for_directional_grouping | LifeWheel Goal Habit Tracker (high_priority_close_substitute; score 29.7) <br> Habit Tracker - Statz (high_priority_close_substitute; score 28.6) <br> OtterLife: AI Health Tracker (high_priority_close_substitute; score 28) <br> Ricky Kalmon (high_priority_close_substitute; score 26.6) | есть P0/manual targets: нужно пройти public listing -> onboarding -> first action -> progress/avatar feedback -> paywall boundary |
| manifestation_tool | astrology / manifestation / self-improvement | 30 | 27 | 0 | 14 | 6 | 6 | usable_for_directional_grouping | Miracle Morning Routine (high_priority_close_substitute; score 33.7) <br> EVOLVE: Transform Your Life (high_priority_close_substitute; score 31) <br> Rosebud: AI Journal & Diary (high_priority_close_substitute; score 30.5) <br> Habit Tracker : Haby (high_priority_close_substitute; score 29.9) | есть P0/manual targets: нужно пройти public listing -> onboarding -> first action -> progress/avatar feedback -> paywall boundary |
| tarot_or_oracle_guidance | tarot / oracle / symbolic guidance | 7 | 4 | 0 | 3 | 0 | 0 | taxonomy_needs_manual_cleanup_before_claim_use | Harem AI - Chat & Talk & Crush (high_priority_close_substitute; score 29.1) <br> Kokoa AI: Roleplay AI Chat (high_priority_close_substitute; score 27.8) <br> Spark AI: Chat with Characters (high_priority_close_substitute; score 27) <br> LunaMate: AI Fanstasy Roleplay (high_priority_close_substitute; score 25.6) | пока использовать как category context; апгрейдить только после sampling/walkthrough |

## Files

- `data_processed/global_competitor_archetype_rollup.csv`
- `data_processed/top100_competitor_review_scorecard.csv`
- `data_processed/russian_competitor_battlecards.csv`
- `data_processed/manual_competitor_inspection_packet.csv`
