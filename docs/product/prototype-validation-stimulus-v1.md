# Prototype Validation Stimulus V1

Generated: 2026-05-31T06:01:25.128Z

## Purpose

This package converts the product-core hypothesis into a concrete two-minute prototype test. It does not claim user validation has happened. It defines exactly what to show, what to measure, what would support H4, and what would kill or downgrade the competitive-advantage claim.

## Target Segments

| ID | Segment | Core Job | Positioning | Main Risk |
| --- | --- | --- | --- | --- |
| ICP_A | Spiritual self-improvers | Turn symbolic/personal meaning into one grounded action today. | Personal guidance that becomes action, not another vague reading. | Alina needs careful framing: soft guidance, no deterministic claims, visible limits, and clear safety posture. |
| ICP_D | Habit and progress users | Make vague growth concrete and keep momentum without streak anxiety. | One meaningful action with forgiving visible progress, not another task manager. | The free loop must demonstrate value before asking for deeper paid analysis or personalization. |

## Prototype Flow

The stimulus contains 8 screens and is designed to be narrated or mocked in Figma, slides, HTML, or a no-code prototype. Target completion: under 120 seconds.

| Step | Screen | Stimulus Copy | Expected Signal | Failure Signal |
| ---: | --- | --- | --- | --- |
| 1 | Daily meaning entry | Today is for turning one real feeling into one small proof. Pick the theme that feels alive right now. | Participant can explain why this is personal rather than generic content. | Participant reads it as vague astrology, generic motivation, or unsafe certainty. |
| 2 | Tiny context prompt | One sentence only: what do you want to feel different by tonight? | Participant supplies a concrete lived moment or emotional target. | Participant skips because the prompt feels too broad, exposing, or irrelevant. |
| 3 | One grounded action | Your action: send one honest message, tidy one visible surface, or take a two-minute walk. Pick the one that proves your theme. | Participant sees the action as doable and causally linked to the chosen theme. | Participant sees it as a random task, chore list, or generic habit tracker. |
| 4 | Short reset | Before you do it: breathe out once, unclench your jaw, name the smallest next move. | Participant feels the reset makes action easier without feeling clinical. | Participant thinks the reset is filler or clashes with the progress mechanic. |
| 5 | Action evidence | Proof, not perfection: tap Done and choose how it felt: lighter, clearer, braver, steadier, no change. | Participant accepts lightweight self-report as enough evidence. | Participant wants objective tracking, rejects proof language, or feels judged. |
| 6 | Identity/avatar feedback | Your future-self signal brightened because you acted. Today added one visible layer: clarity. | Participant understands action -> identity/avatar causality. | Participant sees avatar as decoration, reward spam, or unrelated game skin. |
| 7 | Next-day hook | Tomorrow, we will build on this gently. No streak punishment. Just one more proof. | Participant wants to return and understands continuity. | Participant feels manipulated, infantilized, or indifferent. |
| 8 | Immediate value check | What did Alina help you do: understand yourself, pick an action, calm down, see progress, or none? | Participant names the integrated loop in their own words. | Participant cannot distinguish it from a generic habit tracker, meditation app, or horoscope. |

## Success / Kill Scorecard

| Metric | Gate | Success Threshold | Kill Threshold | Why It Matters |
| --- | --- | --- | --- | --- |
| PVS_M01 | comprehension | >=80% of prototype participants correctly explain personal meaning -> action -> avatar/progress causality | <50% can explain the causal loop without prompting | Competitive advantage depends on the integrated loop being understood, not merely on feature novelty. |
| PVS_M02 | two_minute_completion | >=70% complete simulated loop in under 120 seconds | <40% complete or flow feels too fragmented | The MVP claim is a tiny daily ritual, not a long onboarding or content library. |
| PVS_M03 | meaning_lift | Average meaning_lift >=4/5 among target ICP participants | Average meaning_lift <=2.5/5 | The avatar/progress cue must make action feel personally meaningful, not decorative. |
| PVS_M04 | differentiation | >=60% prefer Alina framing over generic habit/coach alternative | Generic habit/coach/meditation alternative wins by clear margin | H4 is about competitive advantage, not general product appeal. |
| PVS_M05 | trust_safety | No fatal safety/trust objection from target participants; objections are addressable by copy/control | Recurring fatal objections: manipulative, spiritual overclaim, childish, clinical, or unsafe guidance | Trust failures can invalidate the spiritual/identity loop even if engagement is high. |
| PVS_M06 | paid_depth | >=40% name a plausible paid depth feature after free loop value is clear | Users expect all value free or reject paid depth after seeing loop | Market-money evidence needs product-level willingness-to-pay validation. |

## Evidence Inputs Used

- ICP segments: Spiritual self-improvers; Habit and progress users
- ICP validation tests already queued: 36
- Top JTBD clusters considered: Give me a daily anchor I can return to; Turn vague self-improvement into concrete actions; Show me visible progress so effort feels real; Feel accompanied or accountable
- Top pain clusters considered: Users want more depth, options, or customization; Subscription or paywall does not feel worth it; Signup, access, or device friction blocks activation; Bugs break trust and interrupt the ritual
- Strong competitor money proxies considered for paid-depth prompts: 8

## Claim Boundary

This artifact closes the stimulus-design gap, not the user-validation gap. H4 remains unproven until real participants complete the loop and the scorecard is filled with observed results.

## Files

- `data_processed/prototype_validation_stimulus_flow.csv`
- `data_processed/prototype_validation_scorecard.csv`
