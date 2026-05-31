# Competitor Taxonomy Cleanup Queue V1

Generated: 2026-05-31

## Зачем нужен этот слой

Этот queue превращает найденный шум в competitor taxonomy в конкретную рабочую очередь. Он не переписывает исходный top-100 scorecard автоматически: каждая строка остается queued_not_applied, пока ее не подтвердит ручной taxonomy pass.

## Краткая сводка

- Строк в очереди: 8
- Предложенных изменений: 6
- Подтвердить/прочитать вручную: 2

## Таблица cleanup

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

## Граница применения

Это очередь cleanup, а не примененное исправление. Она должна улучшить будущую карту competitor archetypes, но H1/H3/H4/H6 все еще требуют настоящего app walkthrough evidence перед любым claim upgrade.

## Files

- `data_processed/competitor_taxonomy_cleanup_queue.csv`
- `data_processed/top100_competitor_review_scorecard.csv`
