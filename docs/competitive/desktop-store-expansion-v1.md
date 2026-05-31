# Desktop Store Expansion V1

Generated: 2026-05-31T07:08:25.448Z

## Purpose

This source-native collector expands the competitor universe beyond mobile, browser extensions, itch.io, and Steam by querying the public Mac App Store/iTunes Search API. It avoids broad search engines and treats desktop apps as discovery/mechanic evidence, not final market-share proof.

## Collection Summary

- Raw desktop store rows: 6942
- OK rows: 6938
- Countries: us, gb, ca, au
- Query pairs: 50
- Unique OK app IDs/bundles: 1522

Rows by market:

- mindfulness: 1645
- coaching: 1406
- gaming_progression: 1377
- avatar_identity: 1322
- astrology_esoterics: 1192

Rows by category:

- Productivity: 1836
- Health & Fitness: 1108
- Lifestyle: 1062
- Games: 996
- Utilities: 416
- Photo & Video: 298
- Entertainment: 291
- Graphics & Design: 245
- Education: 202
- Business: 90
- Social Networking: 88
- Weather: 78

## Market Summary

| Market | Rows / OK / Unique / Paid | Top Categories | Feature Tags |
| --- | --- | --- | --- |
| coaching | rows=1406; ok=1406; unique_apps=312; paid=92 | Productivity:874<br>Lifestyle:200<br>Health & Fitness:160<br>Education:59<br>Utilities:45 | habit_or_goal_loop<br>avatar_or_identity<br>progression_benchmark:285<br>habit_or_goal_loop<br>mindfulness_or_reset<br>avatar_or_identity<br>progression_benchmark:269<br>habit_or_goal_loop<br>progression_benchmark:211<br>habit_or_goal_loop<br>avatar_or_identity:164<br>habit_or_goal_loop:113 |
| mindfulness | rows=1645; ok=1645; unique_apps=389; paid=171 | Health & Fitness:808<br>Productivity:381<br>Lifestyle:272<br>Utilities:53<br>Games:41 | habit_or_goal_loop<br>mindfulness_or_reset<br>avatar_or_identity<br>progression_benchmark:245<br>mindfulness_or_reset:240<br>mindfulness_or_reset<br>avatar_or_identity:181<br>habit_or_goal_loop<br>mindfulness_or_reset<br>avatar_or_identity:158<br>habit_or_goal_loop<br>mindfulness_or_reset<br>progression_benchmark:101 |
| avatar_identity | rows=1322; ok=1320; unique_apps=395; paid=176 | Photo & Video:294<br>Graphics & Design:232<br>Utilities:188<br>Games:172<br>Productivity:122 | avatar_or_identity:629<br>avatar_or_identity<br>progression_benchmark:234<br>avatar_identity_adjacent:162<br>mindfulness_or_reset<br>avatar_or_identity:83<br>habit_or_goal_loop<br>avatar_or_identity<br>progression_benchmark:45 |
| astrology_esoterics | rows=1192; ok=1192; unique_apps=229; paid=468 | Lifestyle:509<br>Productivity:154<br>Entertainment:106<br>Education:95<br>Health & Fitness:92 | symbolic_guidance:192<br>avatar_or_identity<br>symbolic_guidance:159<br>astrology_esoterics_adjacent:146<br>avatar_or_identity<br>symbolic_guidance<br>progression_benchmark:141<br>symbolic_guidance<br>progression_benchmark:122 |
| gaming_progression | rows=1377; ok=1375; unique_apps=446; paid=236 | Games:724<br>Productivity:305<br>Utilities:75<br>Entertainment:69<br>Health & Fitness:47 | avatar_or_identity<br>progression_benchmark:285<br>habit_or_goal_loop<br>avatar_or_identity<br>progression_benchmark:213<br>habit_or_goal_loop<br>progression_benchmark:163<br>progression_benchmark:141<br>habit_or_goal_loop<br>mindfulness_or_reset<br>avatar_or_identity<br>progression_benchmark:106 |

## Claim Boundary

- Mac App Store rows strengthen desktop-app coverage and source diversity.
- They should not be merged into revenue, market-share, or hidden-clone proof without manual inspection.
- Desktop rows are strongest as competitive-discovery, mechanic-saturation, and positioning evidence.

## Files

- `data_raw/expanded_desktop_store_raw.csv`
- `data_processed/desktop_store_source_summary.csv`
