# Missed-Call Text-Back Demo — Design

**Date:** 2026-07-11
**Status:** Approved (brainstorming)
**Related:** [[demo-engine-architecture]], [[2026-07-11-demo-app-shell-layout-design]], win-back campaign demo (`src/demos/winBackCampaign/`)

## Goal

Build an interactive click-through demo for the **Missed-Call Text-Back** automation, on the shared demo engine (`src/demos/shared/`), and link it from its example card on the Automated Workflows page. It becomes the third demo in the suite (after commercial-cleaning lead-gen and win-back campaign).

## Why this demo is structurally different

Commercial-cleaning and win-back are **outbound batch campaigns** (import a list → segment → send to many). Missed-Call Text-Back is **event-triggered and per-conversation**: one inbound call goes unanswered → an instant auto-text fires → a back-and-forth SMS thread qualifies and books the caller → the owner is notified. The demo therefore follows **one caller through one conversation**, then ends on an aggregate week-level recap. This is a narrative shape the engine has not shown yet, but it fits the existing shell without engine changes.

## Persona & narrative

**Business:** *Summit Air & Plumbing* — a small HVAC/plumbing shop (owner + a couple techs, usually out on jobs, front desk can't always answer).

**Featured caller:** Marcus Bell, homeowner. AC quit in a July heat wave, house is 84°. Calls at 2:14 PM; both techs are on a job, so the call goes unanswered. Normally Marcus dials the next shop on Google. Instead the automation recovers him.

**Emotional hook:** speed of response (seconds, before the caller moves on) + lead recovery (missed calls per week that would otherwise walk).

## Step flow (6 steps)

Flow map (vertical rail) top-to-bottom. Two steps are AI-powered (`isAi: true`) and render the shared `AiPanel`.

| # | id | label | Icon | isAi | Stage content |
|---|----|-------|------|------|---------------|
| 1 | `missed-call` | Missed call | `FaPhoneSlash` | — | Caller-ID card: caller name, masked number, time, "2 rings → voicemail". Frames the about-to-be-lost lead. |
| 2 | `text-back` | Instant text-back | `FaSms` | — | Auto-SMS fires ~14s later from the shop's number. Runs the send lifecycle (sending → delivered → read). A response-time badge ("14 sec") is the hero stat. |
| 3 | `conversation` | Conversation | `FaComments` | ✓ | Live SMS thread (chat bubbles, business vs caller). AI qualifies: problem, urgency, address, homeowner. `AiPanel` shows reasoning, then the thread reveals. |
| 4 | `book` | Book & dispatch | `FaCalendarCheck` | ✓ | AI offers next same-day slot; caller confirms; appointment booked + tech dispatched; confirmation SMS back. `AiPanel` reasoning, then booking card reveals. |
| 5 | `owner-alert` | Owner alert | `FaBell` | — | Owner's phone gets a clean push notification summarizing the booked job. Owner did nothing. |
| 6 | `results` | Results | `FaChartLine` | — | Week recap tally: missed calls → recovered → booked, revenue that would have walked, takeaway line. |

## Architecture

New thin folder `src/demos/missedCallTextBack/`, mirroring `winBackCampaign/`:

- `steps.ts` — the 6 `DemoStep`s (importing icons from `react-icons/fa`).
- `types.ts` — a `WorkflowProvider` interface + the data types for this demo.
- `script.ts` — all mock data (business, caller, SMS thread, booking, owner alert, results, AI reasoning).
- `provider.ts` — `scriptedWorkflowProvider` class implementing `WorkflowProvider`, reading from `script.ts`.
- `steps/` — 6 step components, each taking `{ provider }`.
- `missedcall.css` — scoped styles, `mc-*` class prefix, `--demo-*` / `--spacing-*` tokens.
- `MissedCallTextBackDemo.tsx` — composes `DemoProvider steps → SendLifecycleProvider → DemoShell renderStage`.

Everything else (shell, vertical flow rail, AI panel, send lifecycle, reduced-motion) is reused unchanged from `src/demos/shared/`. **No engine changes.**

## WorkflowProvider interface

Bespoke to this demo, following win-back's provider shape (accessor methods returning typed mock objects):

```ts
export type AiStep = "conversation" | "book";

getBusiness(): Business;              // name, trades[], phone (masked), context line
getMissedCall(): MissedCall;          // caller name, masked number, time label, rings→vm note
getAutoText(): AutoText;              // the instant-reply SMS body + responseSeconds
getConversation(): SmsTurn[];         // ordered thread; from: "business" | "caller"; body; timeLabel
getQualified(): QualifiedLead;        // problem, urgency, address (masked), homeowner flag
getBooking(): Booking;                // service, when, tech, value
getOwnerAlert(): OwnerAlert;          // title + summary lines for the push card
getResults(): ResultsSummary;         // missedCalls, recovered, booked, revenueRecovered, takeaway
getAiReasoning(step: AiStep): AiReasoning;  // { step, title, lines[] } — same shape as win-back
```

`SmsTurn[]` is new to this demo (win-back had only a single `Reply`). It renders as a stacked chat thread in the Conversation step — business bubbles one side, caller bubbles the other.

## Mock data (script.ts) — content sketch

- **Business:** Summit Air & Plumbing; trades HVAC + plumbing; masked line `(•••) •••-7788`.
- **Missed call:** Marcus Bell, `(•••) •••-3162`, "Today 2:14 PM", "2 rings → voicemail".
- **Auto-text:** *"Hi, this is Summit Air & Plumbing — sorry we missed your call! What can we help with?"*, `responseSeconds: 14`.
- **Conversation (SmsTurn[]):** caller: "AC not cooling, house is 84 and climbing" → business: asks address / same-day ok → caller: gives street + "yes please, ASAP" → business: confirms a tech can come today.
- **Qualified lead:** problem "AC not cooling", urgency "Same-day / emergency", address masked, homeowner true.
- **Booking:** service "AC diagnostic", when "Today 4:30 PM", tech "Diego R.", value "$189 diagnostic (repair likely to follow)".
- **Owner alert:** title "New job booked", lines: job type, customer, time, value — "you did nothing."
- **Results:** missedCalls 18, recovered 14, booked 9, revenueRecovered e.g. "$4,300+ in jobs that would've walked", takeaway line.
- **AI reasoning:** `conversation` (detect emergency, extract address, confirm homeowner, keep it human) and `book` (find same-day slot, match nearest tech, confirm + dispatch).

Values are illustrative and can be tuned during implementation without changing the interface.

## Styling

- Scoped `.demo` dark palette already provides `--demo-bg/surface/surface-2/border/text/muted/accent/accent-bright/success` etc. Use those plus `--spacing-*`.
- Class prefix `mc-*`. Reuse win-back's structural idioms (`*-heading`, `*-sub`, reveal wrappers with `opacity/translateY` + `.is-shown`, the send-lifecycle stage strip, the success-tinted booking card, the results tally grid).
- New bespoke UI: the SMS chat thread (aligned bubbles) and the phone-style owner-alert card. Keep them self-contained in `missedcall.css`.
- Responsive: stage body is the scroll region on desktop; collapse multi-column grids and stack chat below 600–768px (match win-back's media queries).

## Wiring

- **Route:** add `<Route path="/demos/missed-call-text-back" element={<MissedCallTextBackDemo />} />` in `App.tsx`, **outside** the `Layout` route (full-bleed, no site header/footer), next to the other demo routes.
- **Example card:** set `to: "/demos/missed-call-text-back"` on the existing "Missed-Call Text-Back" entry (`examples[1]`) in `AutomatedWorkflows.tsx`. The card already becomes a `<Link>` automatically when `to` is present.

## Verification

No test framework exists. Per the project convention:

- `npm run build` (tsc type-check + Vite build) — must pass with no errors, no unused imports (lint-sensitive).
- `npm run dev` smoke check at `/demos/missed-call-text-back`: all 6 steps advance via the rail and Next/Back; send lifecycle animates; both AI panels play then reveal; reduced-motion path shows content instantly; no horizontal scroll at mobile widths; the example card on `/services/automated-workflows` links here.
- `npm run lint` (zero warnings) as the final gate.

## Out of scope

- No engine/shared changes. No real telephony/SMS integration (fully scripted, like the other demos). No pricing on the demo. No changes to the other two demos or the Automated Workflows page beyond the one `to` field.

## Self-review

- Placeholder scan: no TBD/TODO; content values are explicitly marked illustrative-and-tunable, interface is fixed.
- Consistency: 6 steps in the table match the `WorkflowProvider` accessors (each step's data has a getter) and the two `isAi` steps match `AiStep = "conversation" | "book"`.
- Scope: single demo folder + two one-line wiring edits — fits one implementation plan.
- Ambiguity: send lifecycle reused as-is for the text-back step; AI steps follow win-back's `AiPanel` + reveal pattern exactly.
