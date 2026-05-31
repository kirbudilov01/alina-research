# Desktop Store Expansion V1

Generated: 2026-05-31T09:00:51.348Z

## Purpose

This source-native collector expands the competitor universe beyond mobile, browser extensions, itch.io, and Steam by querying the public Mac App Store/iTunes Search API. It avoids broad search engines and treats desktop apps as discovery/mechanic evidence, not final market-share proof.

## Collection Summary

- Raw desktop store rows: 15397
- OK rows: 15394
- Countries: us, gb, ca, au, in, ph
- Query pairs: 50
- Unique OK app IDs/bundles: 2475

Rows by market:

- mindfulness: 3878
- gaming_progression: 3572
- coaching: 3274
- avatar_identity: 2759
- astrology_esoterics: 1914

Rows by category:

- Productivity: 4423
- Health & Fitness: 2377
- Games: 2151
- Lifestyle: 1888
- Utilities: 1054
- Photo & Video: 693
- Entertainment: 658
- Graphics & Design: 586
- Education: 460
- Business: 206
- Social Networking: 162
- Weather: 141

## Market Summary

| Market | Rows / OK / Unique / Paid | Top Categories | Feature Tags |
| --- | --- | --- | --- |
| coaching | rows=3274; ok=3274; unique_apps=551; paid=229 | Productivity:2078<br>Health & Fitness:351<br>Lifestyle:349<br>Education:142<br>Utilities:101 | habit_or_goal_loop<br>avatar_or_identity<br>progression_benchmark:706<br>habit_or_goal_loop<br>mindfulness_or_reset<br>avatar_or_identity<br>progression_benchmark:578<br>habit_or_goal_loop<br>progression_benchmark:502<br>habit_or_goal_loop<br>avatar_or_identity:362<br>habit_or_goal_loop:337 |
| mindfulness | rows=3878; ok=3878; unique_apps=638; paid=543 | Health & Fitness:1725<br>Productivity:1021<br>Lifestyle:573<br>Utilities:167<br>Games:112 | mindfulness_or_reset:553<br>habit_or_goal_loop<br>mindfulness_or_reset<br>avatar_or_identity<br>progression_benchmark:454<br>mindfulness_or_reset<br>avatar_or_identity:435<br>habit_or_goal_loop<br>mindfulness_or_reset<br>avatar_or_identity:335<br>habit_or_goal_loop<br>mindfulness_or_reset:266 |
| avatar_identity | rows=2759; ok=2758; unique_apps=607; paid=440 | Photo & Video:670<br>Graphics & Design:541<br>Utilities:365<br>Games:281<br>Productivity:232 | avatar_or_identity:1275<br>avatar_or_identity<br>progression_benchmark:475<br>avatar_identity_adjacent:370<br>mindfulness_or_reset<br>avatar_or_identity:197<br>progression_benchmark:117 |
| astrology_esoterics | rows=1914; ok=1913; unique_apps=323; paid=811 | Lifestyle:763<br>Productivity:238<br>Entertainment:172<br>Education:151<br>Health & Fitness:150 | symbolic_guidance:315<br>astrology_esoterics_adjacent:246<br>avatar_or_identity<br>symbolic_guidance:238<br>avatar_or_identity<br>symbolic_guidance<br>progression_benchmark:203<br>symbolic_guidance<br>progression_benchmark:194 |
| gaming_progression | rows=3572; ok=3571; unique_apps=832; paid=816 | Games:1677<br>Productivity:854<br>Utilities:276<br>Entertainment:182<br>Health & Fitness:141 | avatar_or_identity<br>progression_benchmark:679<br>habit_or_goal_loop<br>avatar_or_identity<br>progression_benchmark:497<br>progression_benchmark:440<br>habit_or_goal_loop<br>progression_benchmark:417<br>gaming_progression_adjacent:292 |

## Claim Boundary

- Mac App Store rows strengthen desktop-app coverage and source diversity.
- They should not be merged into revenue, market-share, or hidden-clone proof without manual inspection.
- Desktop rows are strongest as competitive-discovery, mechanic-saturation, and positioning evidence.

## Files

- `data_raw/expanded_desktop_store_raw.csv`
- `data_processed/desktop_store_source_summary.csv`
