# Review Generation Demo — Design

**Date:** 2026-07-11
**Status:** Approved (brainstorming)
**Related:** [[demo-engine-architecture]], [[2026-07-11-missed-call-text-back-demo-design]], win-back campaign demo (`src/demos/winBackCampaign/`), missed-call text-back demo (`src/demos/missedCallTextBack/`)

## Goal

Build an interactive click-through demo for the **Review Generation** automation, on the shared demo engine (`src/demos/shared/`), and link it from its example card on the Automated Workflows page. It becomes the fourth demo in the suite (after commercial-cleaning lead-gen, win-back campaign, and missed-call text-back).

## What makes this demo distinct

The prior demos are linear sends. Review Generation has a **sentiment branch**: after a completed appointment the automation requests a review, an AI reads the client's reply, and it **routes on sentiment** — delighted clients get a friction-free path to a public Google review; lukewarm/unhappy clients get caught in a private feedback channel and the owner is alerted, so a bad day never becomes a public 1-star. That fork is the demo's "wow" beat and the thing that makes owners lean in ("it protects my rating, not just pads it").

To show a branch inside a linear click-through, the demo carries **two client threads**: a positive client (**Jenna**) as the spine, and a negative client (**Rachel**) surfaced at the interception step.

## Persona & narrative

**Business:** *Lumière Med Spa* — a single-location aesthetics clinic (injectables, facials, laser). Owner-operator plus a few providers. Its Google rating directly drives high-ticket bookings, so both *more* 5-star reviews and *fewer* public 1-stars matter.

**Spine (positive):** Jenna Alvarez, in for a HydraFacial, loved it. ~2 hours after she leaves, the automation texts her.
**Interception (negative):** Rachel K., in for filler, felt rushed at the front desk — caught privately before she posts publicly.

## Step flow (6 steps)

Two steps are AI-powered (`isAi: true`) and render the shared `AiPanel`.

| # | id | label | Icon | isAi | Stage content |
|---|----|-------|------|------|---------------|
| 1 | `appointment` | Appointment done | `FaSpa` | — | Trigger card: Jenna's visit just wrapped — service (HydraFacial), provider, time. A review opportunity is created. |
| 2 | `request` | Request the review | `FaSms` | — | ~2 hrs later an auto-SMS goes out: warm, human, "how was your visit?" — no begging for stars yet. Runs the send lifecycle (sending → delivered → read). |
| 3 | `route` | Read & route | `FaCodeBranch` | ✓ | Jenna replies delighted; AI classifies sentiment and picks a destination (positive → Google). `AiPanel` reasoning, then a sentiment-routing card reveals the decision. The "reads the room" beat. |
| 4 | `google` | Happy → Google | `FaStar` | ✓ | AI drafts a suggested review in Jenna's voice and sends a one-tap Google link; a 5★ review posts publicly. `AiPanel` reasoning (drafting), then a Google-review card reveals. |
| 5 | `caught` | Unhappy → caught | `FaShieldAlt` | — | Cut to Rachel: her lukewarm reply was flagged negative → NOT pushed to Google; routed to a private feedback note and the owner is alerted to make it right. The bad review that never happened. |
| 6 | `results` | Results | `FaChartLine` | — | Month recap: requests sent → new 5★ reviews, rating lift (e.g. 4.6 → 4.8), and N unhappy clients intercepted before going public. |

## Architecture

New thin folder `src/demos/reviewGeneration/`, mirroring `missedCallTextBack/`:

- `steps.ts` — the 6 `DemoStep`s (icons from `react-icons/fa`).
- `types.ts` — a `WorkflowProvider` interface + the data types.
- `script.ts` — all mock data (business, appointment, request, both client replies, routing, Google review, private catch, results, AI reasoning).
- `provider.ts` — `scriptedWorkflowProvider` implementing `WorkflowProvider`.
- `steps/` — 6 step components, each taking `{ provider }`.
- `reviews.css` — scoped styles, `rg-*` class prefix, `--demo-*` / `--spacing-*` tokens.
- `ReviewGenerationDemo.tsx` — composes `DemoProvider steps → SendLifecycleProvider → DemoShell renderStage`.

Everything else (shell, vertical flow rail, AI panel, send lifecycle, reduced-motion) is reused unchanged from `src/demos/shared/`. **No engine changes.**

## WorkflowProvider interface

```ts
export type ReplyKind = "happy" | "unhappy";
export type AiStep = "route" | "draft";

getBusiness(): Business;              // name, category, ratingContext line
getAppointment(): Appointment;       // client, service, provider, timeLabel (Jenna's completed visit)
getRequest(): ReviewRequest;         // SMS body + delayLabel ("~2 hours later")
getReply(kind: ReplyKind): ClientReply;   // { kind, name, service, body, sentiment, receivedLabel }
getRouting(kind: ReplyKind): Routing;     // { kind, sentiment, decision, destination }
getGoogleReview(): GoogleReview;     // { clientName, stars, suggestedBody }
getPrivateCatch(): PrivateCatch;     // { clientName, concern, ownerAction, alertLines[] }
getResults(): ResultsSummary;        // requestsSent, reviewsGained, ratingBefore, ratingAfter, intercepted, takeaway
getAiReasoning(step: AiStep): AiReasoning;  // { step, title, lines[] }
```

`sentiment` is a small union (e.g. `"positive" | "negative"`). Two client threads are addressed by `ReplyKind` (`"happy"` = Jenna, `"unhappy"` = Rachel), mirroring how missed-call addressed a single caller but generalized to two.

## Mock data (script.ts) — content sketch

- **Business:** Lumière Med Spa; category "Aesthetics & skincare"; rating context "4.6★ on Google, booking-critical."
- **Appointment:** Jenna Alvarez · HydraFacial · with provider "Maya" · "Today 1:30 PM".
- **Request:** "Hi Jenna! It was so lovely seeing you at Lumière today 💛 How was your visit?", delayLabel "~2 hours later".
- **Happy reply (Jenna):** "Obsessed!! My skin is glowing, Maya was amazing.", sentiment positive.
- **Unhappy reply (Rachel):** "It was fine. Front desk kept me waiting like 25 min though.", sentiment negative.
- **Routing (happy):** positive → "Invite to Google review". **Routing (unhappy):** negative → "Route to private feedback, alert owner — do not request public review".
- **Google review:** 5★, suggested body in Jenna's voice ("Had the best HydraFacial with Maya at Lumière — my skin has never looked better…").
- **Private catch:** Rachel; concern "Front-desk wait time"; ownerAction "Owner texts a personal apology + a comp"; alert lines for the owner push card.
- **Results:** requestsSent 42, reviewsGained 27, ratingBefore "4.6", ratingAfter "4.8", intercepted 5, takeaway line.
- **AI reasoning:** `route` (read the reply, score sentiment, pick destination, protect the rating) and `draft` (write a natural review in the client's voice, keep it honest, one-tap to Google).

Values are illustrative and tunable during implementation without changing the interface.

## Styling

- Scoped `.demo` dark palette provides `--demo-*` tokens; use those plus `--spacing-*`.
- Class prefix `rg-*`. Reuse structural idioms from missed-call/win-back: `*-heading`/`*-sub`, reveal wrappers (`opacity/translateY` + `.is-shown`), the send-lifecycle stage strip, SMS bubbles, the owner-alert phone-push card (for step 5), and the results tally grid.
- New bespoke UI: the **sentiment-routing card** (step 3 — shows classification + the fork/decision), and the **Google-review card** (step 4 — a star row + drafted review text styled like a review). Keep them self-contained in `reviews.css`.
- Responsive: match the prior demos' media queries; no horizontal scroll at mobile widths.

## Wiring

- **Route:** add `<Route path="/demos/review-generation" element={<ReviewGenerationDemo />} />` in `App.tsx`, **outside** the `Layout` route, next to the other demo routes.
- **Example card:** set `to: "/demos/review-generation"` on the existing "Review Generation" entry (`examples[2]`) in `AutomatedWorkflows.tsx`. The card auto-becomes a `<Link>`.

## Verification

No test framework exists. Per convention:
- `npm run build` (tsc + Vite) — no errors, no unused imports.
- `npm run dev` smoke at `/demos/review-generation`: 6 steps advance via rail + Next/Back; send lifecycle animates; both AI panels play then reveal; the routing card shows the positive→Google decision; the Google-review card shows 5★ + drafted text; the unhappy step shows the private catch + owner alert; results tally + rating lift render; reduced-motion path shows content instantly; no horizontal scroll at mobile widths; the example card on `/services/automated-workflows` links here.
- `npm run lint` (zero warnings) as the final gate.

## Out of scope

- No engine/shared changes. No real review-platform/SMS integration (fully scripted). No pricing on the demo. No changes to the other demos or the Automated Workflows page beyond the one `to` field. Only two client threads are modeled (one per branch) — not a full multi-client list.

## Self-review

- Placeholder scan: no TBD/TODO; content values marked illustrative-and-tunable, interface fixed.
- Consistency: 6 steps map to the `WorkflowProvider` accessors; the two `isAi` steps match `AiStep = "route" | "draft"`; `ReplyKind` (`"happy" | "unhappy"`) addresses the two client threads used by `getReply`/`getRouting`.
- Scope: single demo folder + two one-line wiring edits — fits one implementation plan.
- Ambiguity: the branch is shown as two sequential branch steps (happy in step 4, unhappy in step 5), not a runtime toggle; both threads are static data.
