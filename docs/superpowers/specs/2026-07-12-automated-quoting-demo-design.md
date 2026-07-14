# Automated Quoting Demo — Design

**Date:** 2026-07-12
**Status:** Approved (brainstorming)
**Related:** [[demo-engine-architecture]], [[2026-07-11-review-generation-demo-design]], [[2026-07-11-missed-call-text-back-demo-design]], win-back / missed-call / review-generation demos

## Goal

Build an interactive click-through demo for the **Automated Quoting** automation, on the shared demo engine (`src/demos/shared/`), and link it from its example card on the Automated Workflows page. It becomes the fifth demo in the suite (after commercial-cleaning lead-gen, win-back, missed-call text-back, and review generation).

## What makes this demo distinct

The prior demos are messaging flows (send → AI → results). Automated Quoting introduces new mechanics: the AI **parses a messy, conversational intake** into structured scope, then **builds an itemized line-item quote** with a total. Watching the quote get assembled is the "wow" — it's visibly AI-shaped work, not a template. A deliberate **owner-in-the-loop approval** step keeps the owner in control (a real selling point: the AI does the grunt work, the owner still signs off).

## Persona & narrative

**Business:** *Anchor Moving Co.* — a local moving company (owner + a few crews). Quotes are the bottleneck: every lead wants a price, hand-figuring an itemized estimate takes time, replies lag, and jobs go to whoever answered first.

**The lead:** Devin Marsh submits a request through the site (or a text) — messy and conversational, the way real customers write.

## Step flow (6 steps)

Two steps are AI-powered (`isAi: true`) and render the shared `AiPanel`.

| # | id | label | Icon | isAi | Stage content |
|---|----|-------|------|------|---------------|
| 1 | `request` | Request comes in | `FaInbox` | — | The raw intake verbatim (customer, channel, the conversational request text). A lead worth a fast, accurate quote. |
| 2 | `understand` | Understand the job | `FaBrain` | ✓ | AI parses the mess into structured scope: origin size, 2nd-floor destination (stairs), ~12 mi cross-town, special items (piano, fridge), ~30 boxes, target date. `AiPanel` reasoning, then a scope list reveals. |
| 3 | `build` | Build the quote | `FaFileInvoiceDollar` | ✓ | AI computes itemized line items — crew, truck + mileage, stairs surcharge, piano handling, materials — and a total. `AiPanel` reasoning, then the quote card reveals. The hero beat. |
| 4 | `review` | Owner review | `FaUserCheck` | — | The ready-to-send quote is presented to the owner for a one-tap **Approve & send**. AI did the grunt work; the owner stays in control. |
| 5 | `send` | Send & accept | `FaPaperPlane` | — | Quote delivered (send lifecycle), and Devin replies "looks good, let's book it" → the move date is locked. |
| 6 | `results` | Results | `FaChartLine` | — | Month recap: quote requests → quotes sent, avg turnaround (minutes not a day), jobs booked / win rate, revenue quoted. |

## Architecture

New thin folder `src/demos/automatedQuoting/`, mirroring `reviewGeneration/`:

- `steps.ts` — the 6 `DemoStep`s (icons from `react-icons/fa`).
- `types.ts` — a `WorkflowProvider` interface + the data types.
- `script.ts` — all mock data (business, intake, scope, quote, approval, acceptance, results, AI reasoning).
- `provider.ts` — `scriptedWorkflowProvider` implementing `WorkflowProvider`.
- `steps/` — 6 step components, each taking `{ provider }`.
- `quoting.css` — scoped styles, `qt-*` class prefix, `--demo-*` / `--spacing-*` tokens.
- `AutomatedQuotingDemo.tsx` — composes `DemoProvider steps → SendLifecycleProvider → DemoShell renderStage`.

Everything else (shell, vertical flow rail, AI panel, send lifecycle, reduced-motion) is reused unchanged from `src/demos/shared/`. **No engine changes.**

## WorkflowProvider interface

```ts
export type AiStep = "understand" | "build";

getBusiness(): Business;              // name, service, context line
getIntake(): Intake;                 // { customerName, channel, rawText, receivedLabel }
getScope(): ScopeField[];            // extracted [{ label, value }] rows
getQuote(): Quote;                   // { lineItems: LineItem[], total, validityNote }
getApproval(): Approval;             // { summary, ownerAction } — the one-tap approve framing
getAcceptance(): Acceptance;         // { customerName, replyBody, bookedDate, jobValue }
getResults(): ResultsSummary;        // requests, quotesSent, avgTurnaround, jobsBooked, winRate, revenueQuoted, takeaway
getAiReasoning(step: AiStep): AiReasoning;
```

Supporting types: `ScopeField { label: string; value: string }`, `LineItem { label: string; detail: string; amount: string }`, `Quote { lineItems: LineItem[]; total: string; validityNote: string }`.

## Mock data (script.ts) — content sketch

- **Business:** Anchor Moving Co.; service "Local & long-distance moving"; context "owner + a few crews; quotes are the bottleneck."
- **Intake:** Devin Marsh · via website form · rawText: "Need to move end of the month. 3-bed house on Oak St to a 2nd-floor apartment across town on Delmar. Got a piano and a big fridge, maybe 30 boxes." · receivedLabel "Today 9:04 AM".
- **Scope (extracted):** Move size "3-bedroom house"; From "House, ground floor (Oak St)"; To "Apartment, 2nd floor — stairs (Delmar)"; Distance "~12 mi, cross-town"; Special items "Upright piano, full-size fridge"; Boxes "~30"; Target date "End of month".
- **Quote line items:** Crew — "3 movers × ~5 hrs" — "$720"; Truck & mileage — "26' truck, ~12 mi" — "$180"; Stairs surcharge — "2nd-floor carry" — "$90"; Piano handling — "specialty item" — "$150"; Packing materials — "blankets, tape, wardrobe boxes" — "$60". Total "$1,200". validityNote "Estimate valid 14 days · final subject to on-site confirmation."
- **Approval:** summary "Itemized quote ready for Devin's move"; ownerAction "Owner taps Approve & send — or tweaks a line first."
- **Acceptance:** Devin Marsh; replyBody "Looks good — let's book it for the 28th."; bookedDate "Sat, the 28th"; jobValue "$1,200 booked".
- **Results:** requests 34, quotesSent 34, avgTurnaround "4 min", jobsBooked 19, winRate "56%", revenueQuoted "$38k quoted", takeaway line.
- **AI reasoning:** `understand` (read the message, pull out size/distance/stairs/special items/date, flag what needs on-site confirmation) and `build` (price each line from the shop's rate card, add surcharges for stairs + piano, total it, keep it itemized so it's trustworthy).

Values are illustrative and tunable during implementation without changing the interface.

## Styling

- Scoped `.demo` dark palette provides `--demo-*` tokens; use those plus `--spacing-*`.
- Class prefix `qt-*`. Reuse structural idioms from the prior demos: `*-heading`/`*-sub`, reveal wrappers (`opacity/translateY` + `.is-shown`), the send-lifecycle stage strip (step 5), and the results tally grid.
- New bespoke UI: the **intake card** (raw request text, styled like a received message/form submission), the **scope list** (label/value rows revealed after the AI panel), and the **itemized quote card** (line-item rows with right-aligned amounts + a total row) — the hero. The owner-review step reuses the quote card plus an "Approve & send" action affordance (non-functional, presentational). Keep them self-contained in `quoting.css`.
- Responsive: match the prior demos' media queries; the quote line-item rows must stay readable and not cause horizontal scroll at mobile widths.

## Wiring

- **Route:** add `<Route path="/demos/automated-quoting" element={<AutomatedQuotingDemo />} />` in `App.tsx`, **outside** the `Layout` route, next to the other demo routes.
- **Example card:** set `to: "/demos/automated-quoting"` on the existing "Automated Quoting" entry (`examples[3]`) in `AutomatedWorkflows.tsx`. The card auto-becomes a `<Link>`.

## Verification

No test framework exists. Per convention:
- `npm run build` (tsc + Vite) — no errors, no unused imports.
- `npm run dev` smoke at `/demos/automated-quoting`: 6 steps advance via rail + Next/Back; the intake card shows the raw request; both AI panels play then reveal (scope list, then quote card); the owner-review step shows the quote + approve action; the send step animates the send lifecycle and shows the acceptance; results tally renders; reduced-motion path shows content instantly; no horizontal scroll at mobile widths; the example card on `/services/automated-workflows` links here.
- `npm run lint` (zero warnings) as the final gate.

## Out of scope

- No engine/shared changes. No real quoting/pricing integration (fully scripted). No pricing of PDS's own services on the demo. No changes to the other demos or the Automated Workflows page beyond the one `to` field. The "Approve & send" affordance is presentational only (no interactive editing).

## Self-review

- Placeholder scan: no TBD/TODO; content values marked illustrative-and-tunable, interface fixed.
- Consistency: 6 steps map to the `WorkflowProvider` accessors; the two `isAi` steps match `AiStep = "understand" | "build"`; `getScope`/`getQuote` back the two reveal steps.
- Scope: single demo folder + two one-line wiring edits — fits one implementation plan.
- Ambiguity: the owner-approval and acceptance are static/presentational; the send step reuses the send lifecycle exactly as prior demos do.
