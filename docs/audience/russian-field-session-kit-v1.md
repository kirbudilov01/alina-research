# Русский field session kit V1

Собрано: 2026-05-31T13:29:33.694Z

## Зачем нужен этот слой

Этот слой превращает ICP dossiers, VOC/objection map и prototype dossiers в исполнимую сессию. Он дает оператору последовательный сценарий: consent, recent-behavior screener, problem story, disconfirmation, prototype walkthrough, WTP/referral language, scorecard и rebuild hygiene.

P0 segments: ICP_A, ICP_D. Session steps: 14. Estimated total operator minutes across all P0 kits: 120. Этот слой не закрывает H1-H6: он только делает сбор observed evidence достаточно строгим и повторяемым.

## Session kit index

| Step ID | ICP | Phase | Min | H | Source rows |
| --- | --- | --- | ---: | --- | --- |
| ICP_A_CONSENT | ICP_A | Consent и рамка безопасности | 3 | H5/H6 |  |
| ICP_A_SCREENER | ICP_A | Recent behavior screener | 7 | H5 | ICP_A_T01_P01/ICP_A_T01_P02/ICP_A_T01_P03/ICP_A_T01_P04/ICP_A_T01_P05/ICP_A_T01_P06/ICP_A_T01_P07/ICP_A_T01_P08 |
| ICP_A_PROBLEM_STORY | ICP_A | Problem story и current workaround | 12 | H5/H3 | ICP_A_T02_P01/ICP_A_T02_P02/ICP_A_T02_P03/ICP_A_T02_P04/ICP_A_T02_P05/ICP_A_T02_P06/ICP_A_T02_P07/ICP_A_T02_P08 |
| ICP_A_VOC_OBJECTIONS | ICP_A | VOC objections и disconfirmation | 10 | H2/H4/H5/H6 | VOC_DAILY_ANCHOR/VOC_VISIBLE_PROGRESS/VOC_OVERBUILT_STREAK_ANXIETY/VOC_PERSONALIZATION_FEEL_SEEN/VOC_TRUST_SAFETY/VOC_SUBSCRIPTION_VALUE |
| ICP_A_PROTOTYPE_WALKTHROUGH | ICP_A | Prototype walkthrough | 15 | H4/H6/H5 | PVS_ICP_A_P01_S01_ENTRY/PVS_ICP_A_P01_S02_REFLECTION/PVS_ICP_A_P01_S03_ACTION_CARD/PVS_ICP_A_P01_S04_RESET/PVS_ICP_A_P01_S05_COMPLETION/PVS_ICP_A_P01_S06_AVATAR_CHANGE/PVS_ICP_A_P01_S07_TOMORROW_HOOK/PVS_ICP_A_P01_S08_VALUE_CHECK |
| ICP_A_VALUE_WTP | ICP_A | Value, paid depth и referral language | 8 | H2/H5/H6 | ICP_A_T05_P01/ICP_A_T05_P02/ICP_A_T05_P03/ICP_A_T05_P04/ICP_A_T05_P05/ICP_A_T05_P06/ICP_A_T05_P07/ICP_A_T05_P08 |
| ICP_A_SCORE_REBUILD | ICP_A | Scorecard и rebuild hygiene | 5 | H1/H2/H3/H4/H5/H6 | PVS_M01/PVS_M02/PVS_M03/PVS_M04/PVS_M05/PVS_M06 |
| ICP_D_CONSENT | ICP_D | Consent и рамка безопасности | 3 | H5/H6 |  |
| ICP_D_SCREENER | ICP_D | Recent behavior screener | 7 | H5 | ICP_D_T01_P01/ICP_D_T01_P02/ICP_D_T01_P03/ICP_D_T01_P04/ICP_D_T01_P05/ICP_D_T01_P06/ICP_D_T01_P07/ICP_D_T01_P08 |
| ICP_D_PROBLEM_STORY | ICP_D | Problem story и current workaround | 12 | H5/H3 | ICP_D_T02_P01/ICP_D_T02_P02/ICP_D_T02_P03/ICP_D_T02_P04/ICP_D_T02_P05/ICP_D_T02_P06/ICP_D_T02_P07/ICP_D_T02_P08 |
| ICP_D_VOC_OBJECTIONS | ICP_D | VOC objections и disconfirmation | 10 | H2/H4/H5/H6 | VOC_DAILY_ANCHOR/VOC_VISIBLE_PROGRESS/VOC_OVERBUILT_STREAK_ANXIETY/VOC_PERSONALIZATION_FEEL_SEEN/VOC_TRUST_SAFETY/VOC_DEPTH_CUSTOMIZATION |
| ICP_D_PROTOTYPE_WALKTHROUGH | ICP_D | Prototype walkthrough | 15 | H4/H6/H5 | PVS_ICP_D_P01_S01_ENTRY/PVS_ICP_D_P01_S02_REFLECTION/PVS_ICP_D_P01_S03_ACTION_CARD/PVS_ICP_D_P01_S04_RESET/PVS_ICP_D_P01_S05_COMPLETION/PVS_ICP_D_P01_S06_AVATAR_CHANGE/PVS_ICP_D_P01_S07_TOMORROW_HOOK/PVS_ICP_D_P01_S08_VALUE_CHECK |
| ICP_D_VALUE_WTP | ICP_D | Value, paid depth и referral language | 8 | H2/H5/H6 | ICP_D_T05_P01/ICP_D_T05_P02/ICP_D_T05_P03/ICP_D_T05_P04/ICP_D_T05_P05/ICP_D_T05_P06/ICP_D_T05_P07/ICP_D_T05_P08 |
| ICP_D_SCORE_REBUILD | ICP_D | Scorecard и rebuild hygiene | 5 | H1/H2/H3/H4/H5/H6 | PVS_M01/PVS_M02/PVS_M03/PVS_M04/PVS_M05/PVS_M06 |

## Файлы

- `data_processed/russian_field_session_kit.csv`
- `docs/audience/russian-field-session-kit-v1.md`
- `output/validation/ru_session_kits/ICP_A_field_session_kit.md`
- `output/validation/ru_session_kits/ICP_D_field_session_kit.md`
