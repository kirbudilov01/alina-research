# Hypothesis Decision Matrix V1

Generated: 2026-05-31T14:26:09.378Z

## Purpose

This matrix converts H1-H6 from research claims into operating decisions. It separates what can move forward, what must stay in validation, and what would kill or downgrade the thesis. It intentionally does not mark any open user/manual validation gate as complete.

## Summary

- Hypotheses scored: 6
- Go for next phase: 0
- Hold / validate: 6
- Stop or pivot: 0
- Linked capture rows: 416

Decision mix:

- hold_validate: 6

## Matrix

| ID | Hypothesis | Decision | Confidence | Primary Metric | Key Gap |
| --- | --- | --- | --- | --- | --- |
| H1 | Product shape exists | hold_validate | medium | 100 top-candidate rows; 90 primary apps; 12 P0 inspection targets; 12 public listings inspected | Strict full loop is rare and still needs actual app/onboarding screenshots to confirm or downgrade public listing claims. |
| H2 | Markets have money | hold_validate | medium | intersection SAM base USD 201960000; 12 market sources confidence-reviewed; 6 assumption rows; 6 stress scenarios; 22 strong competitor money proxies | Market sizing still needs actual revenue estimates, paid intelligence, manual in-app paywall validation, and willingness-to-pay prototype evidence for final investor-grade claims. |
| H3 | Whitespace exists | hold_validate | medium | 1/100 strict behavior-tied progression signals; 6 cross-source saturation markets; 2 benchmark-only markets; 12 P0 apps queued | Actual app/onboarding inspection results are still missing; public listings and cross-source text rules can overstate or hide in-app loops. |
| H4 | Competitive advantage is plausible | hold_validate | medium | 1 direct reference competitor; 45 high-threat competitors; 8 prototype screens; 6 success/kill metrics | No human prototype session yet proves users understand, prefer, or value the integrated loop. |
| H5 | Shared audience exists | hold_validate | medium | 20492 audience signal rows; 294 community/referral rows; 2339 coded Reddit mention rows; 1852 Reddit manual-read queue rows; 574 Reddit capture rows; 6 ICP segment hypotheses; 36 ICP validation tests; 24 ICP recruiting bridge rows | Keyword/OCR/forum coding and directional ICP recruiting assets need human validation, interviews, and prototype tests. |
| H6 | Product core can be defined | hold_validate | medium | 12552 feature matrix rows; 100 product-core rows; 8 prototype screens | No user prototype evidence yet confirms comprehension, emotional value, or retention impact. |

## Gates

| ID | Go Gate | Hold Gate | Kill/Pivot Gate |
| --- | --- | --- | --- |
| H1 | At least 5 P0 competitors classified by direct app walkthrough and no hidden direct clone owns the full loop. | Public metadata supports adjacency but onboarding/action/progress screenshots are missing. | A P0 competitor clearly owns personal meaning -> action -> reset -> causally changing identity/avatar/progress -> next-day hook. |
| H2 | Paid-flow inspection confirms top money proxies and prototype/WTP sessions show plausible paid depth. | TAM/SAM/SOM and proxy monetization are range-supported but not final revenue proof. | Paid signals fail product matching or users reject paid depth after free loop value. |
| H3 | Manual walkthrough confirms behavior-tied identity/avatar progression remains rare among high-risk direct substitutes. | Metadata and cross-source saturation are directional; gaming remains benchmark-only. | Walkthrough reveals common full-loop substitutes or hidden clone risk is confirmed. |
| H4 | Prototype users understand and prefer the integrated loop over generic habit/coach/meditation alternatives. | Prototype stimulus and scorecard exist, but no participant results are recorded. | Participants read Alina as generic, unsafe, childish, manipulative, or not worth returning to. |
| H5 | Top two ICP segments produce recent-behavior, language resonance, return-intent, and WTP signals. | Audience/ICP matrix is directional and needs interviews/prototype sessions. | No segment recalls concrete use episodes or all reject action-tied identity/progress premise. |
| H6 | MVP loop remains coherent after prototype sessions and competitor walkthrough updates. | Product core is defined, but comprehension and emotional value are not yet observed. | The loop requires too much friction/content cost or users cannot explain causality. |

## Claim Boundary

- A hold/validate decision is progress: it preserves the hypothesis while naming exactly what evidence is still missing.
- No hypothesis with participant, walkthrough, or paid-flow gaps is allowed to graduate from metadata alone.
- Any kill-gate trigger should update evidence claims, report language, and final PDF caveats before further expansion.

## Files

- `data_processed/hypothesis_decision_matrix.csv`
