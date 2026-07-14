# Invoice & Payment Reminders Demo — Design

**Date:** 2026-07-12
**Status:** Approved (brainstorming)
**Related:** [[demo-engine-architecture]], [[2026-07-12-automated-quoting-demo-design]], [[2026-07-11-review-generation-demo-design]], [[2026-07-11-missed-call-text-back-demo-design]], win-back / missed-call / review-generation / automated-quoting demos

## Goal

Build an interactive click-through demo for the **Invoice & Payment Reminders** automation, on the shared demo engine (`src/demos/shared/`), and link it from its example card on the Automated Workflows page. It becomes the sixth demo in the suite (after commercial-cleaning lead-gen, win-back, missed-call text-back, review generation, and automated quoting).

## What makes this demo distinct

The prior demos are single-shot flows (one send → AI → one result). Invoice & Payment Reminders introduces a new mechanic: a **scheduled, escalating cadence** where the AI plans a *sequence* of touches over days and **calibrates the tone at each rung** — friendly heads-up → gentle nudge → firm reminder — and knows when to **stop nagging and hand a stubborn one to the owner** for a personal call. Watching the AI lay out the escalation ladder and write each rung in the right tone is the "wow": it's visibly judgment, not a blast. The payoff is an invoice flipping to **PAID** and days-to-pay collapsing — with the owner-escalation rung shown as the safety net that keeps the automation from ever souring a good customer.

## Persona & narrative

**Business:** *Voltline Electric* — a small residential & commercial electrical shop (owner + a small crew). Invoices go out after every job, but chasing late payers eats the owner's nights, and money quietly leaks when follow-up slips.

**The invoice:** Marcus Bell's panel upgrade ($2,450) was invoiced on net-7 terms and is now sliding past due — a good customer who just needs a nudge, not a lecture.

## Step flow (6 steps)

Two steps are AI-powered (`isAi: true`) and render the shared `AiPanel`.

| # | id | label | Icon | isAi | Stage content |
|---|----|-------|------|------|---------------|
| 1 | `overdue` | Invoice slips past due | `FaFileInvoiceDollar` | — | The invoice verbatim (customer, job, amount, issued/due dates) with a **days-overdue** badge. Framing: this is where money quietly leaks. |
| 2 | `plan` | Plan the follow-up | `FaCalendarAlt` | ✓ | AI reads the invoice + customer history and lays out the escalation ladder: rungs with timing, tone, channel, and the owner-flag fallback. `AiPanel` reasoning, then the cadence ladder reveals. |
| 3 | `draft` | Draft the reminders | `FaPenFancy` | ✓ | AI writes each reminder in its calibrated tone (friendly → gentle → firm), each carrying a one-tap pay link. `AiPanel` reasoning, then the message ladder reveals. The hero beat. |
| 4 | `send` | Send & escalate | `FaPaperPlane` | — | Reminders go out on schedule across "days" — a cadence timeline with the active rung running the shared send lifecycle (send lifecycle strip). |
| 5 | `paid` | Paid | `FaCheckCircle` | — | Marcus pays after the firm reminder → the invoice flips to **PAID** (payment method, days-to-pay). The owner-flag rung is shown as the safety net that never had to fire. |
| 6 | `results` | Results | `FaChartLine` | — | Month recap: invoices tracked, $ collected, avg days-to-pay (before → after), hours saved chasing, # flagged for a personal call. |

Single featured invoice (kept clean). The owner-escalation is shown as the *planned safety net* (step 2 ladder + step 5 note) and as a results stat — not a separately tracked invoice. **No per-send owner approval** — "set it and forget it" is the selling point.

## Architecture

New thin folder `src/demos/invoiceReminders/`, mirroring `automatedQuoting/`:

- `steps.ts` — the 6 `DemoStep`s (icons from `react-icons/fa`).
- `types.ts` — a `WorkflowProvider` interface + the data types.
- `script.ts` — all mock data (business, invoice, cadence, reminders, payment, owner-flag, results, AI reasoning).
- `provider.ts` — `scriptedWorkflowProvider` implementing `WorkflowProvider`.
- `steps/` — 6 step components, each taking `{ provider }`. Step 1 and step 5 share a small `InvoiceCard` presentational component (paid vs unpaid variant), mirroring how `automatedQuoting` shares `QuoteCard`.
- `invoices.css` — scoped styles, `inv-*` class prefix, `--demo-*` / `--spacing-*` tokens.
- `InvoiceRemindersDemo.tsx` — composes `DemoProvider steps → SendLifecycleProvider → DemoShell renderStage`.

Everything else (shell, vertical flow rail, AI panel, send lifecycle, reduced-motion) is reused unchanged from `src/demos/shared/`. **No engine changes.**

## WorkflowProvider interface

```ts
export type AiStep = "plan" | "draft";

getBusiness(): Business;              // name, service, context line
getInvoice(): Invoice;               // { customerName, jobDescription, invoiceNo, amount, issuedLabel, dueLabel, daysOverdue }
getCadence(): CadenceRung[];         // the escalation ladder, incl. the owner-flag rung
getReminders(): ReminderDraft[];     // the drafted messages (one per non-flag rung)
getPayment(): Payment;               // { customerName, method, amount, paidLabel, daysToPay }
getOwnerFlag(): OwnerFlag;           // { summary, note } — the safety-net framing (untriggered this time)
getResults(): ResultsSummary;        // invoicesTracked, collected, avgDaysBefore, avgDaysAfter, hoursSaved, flaggedForCall, takeaway
getAiReasoning(step: AiStep): AiReasoning;
```

Supporting types:
- `Invoice { customerName: string; jobDescription: string; invoiceNo: string; amount: string; issuedLabel: string; dueLabel: string; daysOverdue: number }`
- `CadenceRung { label: string; timing: string; tone: string; channel: string; isOwnerFlag?: boolean }`
- `ReminderDraft { rungLabel: string; tone: string; body: string }`
- `Payment { customerName: string; method: string; amount: string; paidLabel: string; daysToPay: string }`
- `OwnerFlag { summary: string; note: string }`
- `ResultsSummary { invoicesTracked: number; collected: string; avgDaysBefore: string; avgDaysAfter: string; hoursSaved: string; flaggedForCall: number; takeaway: string }`
- `AiReasoning { step: AiStep; title: string; lines: string[] }`

## Mock data (script.ts) — content sketch

- **Business:** Voltline Electric; service "Residential & commercial electrical"; context "small crew — invoices go out after every job, but chasing late payers eats the owner's nights."
- **Invoice:** Marcus Bell · job "Panel upgrade + kitchen circuits" · invoiceNo "#1042" · amount "$2,450" · issuedLabel "Issued Jun 26" · dueLabel "Due Jul 3 · net 7" · daysOverdue 6.
- **Cadence (ladder):**
  - "Friendly heads-up" — "Day before due" — tone "Warm, informational" — channel "Text + email"
  - "Gentle nudge" — "+3 days overdue" — tone "Friendly, no pressure" — channel "Text"
  - "Firm reminder" — "+10 days overdue" — tone "Clear & professional" — channel "Email + text"
  - "Flag for the owner" — "+14 days, still unpaid" — tone "Hand off to a human" — channel "Owner alert" — `isOwnerFlag: true`
- **Reminders (drafts, one per non-flag rung):**
  - Friendly heads-up: "Hi Marcus — quick heads-up that your invoice for the panel upgrade ($2,450) is due tomorrow. Pay in a tap here: [link]. Thanks again!"
  - Gentle nudge: "Hi Marcus, just circling back — the $2,450 invoice for your panel upgrade is a few days past due. No worries if it slipped your mind; you can pay anytime here: [link]."
  - Firm reminder: "Hi Marcus, following up on invoice #1042 for $2,450, now 10 days past due. Please settle it at your earliest convenience: [link]. Happy to sort out any questions — just reply here."
- **Payment:** Marcus Bell · method "Card — one-tap link" · amount "$2,450" · paidLabel "Paid ~2 hrs after the firm reminder" · daysToPay "11 days".
- **Owner-flag:** summary "The safety net you didn't need this time"; note "If Marcus had gone quiet past day 14, the AI would've stopped texting and flagged him for a personal call — it never nags a good customer into resentment."
- **Results:** invoicesTracked 22; collected "$18.6k collected"; avgDaysBefore "31 days"; avgDaysAfter "12 days"; hoursSaved "~6 hrs/mo"; flaggedForCall 2; takeaway "Every invoice followed up on time and in the right tone — days-to-pay cut from 31 to 12, $18.6k collected, and only 2 needed a personal call. No more evenings spent chasing."
- **AI reasoning:**
  - `plan` (read the invoice + amount, check the customer is a good-but-late payer, set the schedule, add the day-14 owner-flag safety net, escalate tone gradually).
  - `draft` (write each rung in the scheduled tone — warm heads-up, low-pressure nudge, clear-not-rude firm reminder — each with a one-tap pay link).

Values are illustrative and tunable during implementation without changing the interface.

## Styling

- Scoped `.demo` dark palette provides `--demo-*` tokens; use those plus `--spacing-*`.
- Class prefix `inv-*`. Reuse structural idioms from the prior demos: `*-heading`/`*-sub`, reveal wrappers (`opacity/translateY` + `.is-shown`), the send-lifecycle stage strip (step 4), the results tally grid, and a before→after pair for days-to-pay (like review-generation's rating lift).
- New bespoke UI: the **invoice card** (customer/job/amount/dates + a days-overdue badge; a PAID variant for step 5 with a paid stamp), the **cadence ladder** (rung rows with timing/tone/channel, the owner-flag rung visually distinct), the **reminder message ladder** (stacked message cards with escalating tone labels — the hero), and the **send/escalate timeline** (rungs firing over days, the active rung running the send lifecycle). Keep them self-contained in `invoices.css`.
- Responsive: match the prior demos' media queries; the cadence-ladder rows and message cards must stay readable and not cause horizontal scroll at mobile widths.

## Wiring

- **Route:** add `<Route path="/demos/invoice-reminders" element={<InvoiceRemindersDemo />} />` in `App.tsx`, **outside** the `Layout` route, next to the other demo routes.
- **Example card:** set `to: "/demos/invoice-reminders"` on the existing "Invoice & Payment Reminders" entry (`examples[4]`) in `AutomatedWorkflows.tsx`. The card auto-becomes a `<Link>`.

## Verification

No test framework exists. Per convention:
- `npm run build` (tsc + Vite) — no errors, no unused imports.
- `npm run dev` smoke at `/demos/invoice-reminders`: 6 steps advance via rail + Next/Back; the invoice card shows the overdue invoice; both AI panels play then reveal (cadence ladder, then message ladder); the send step animates the cadence/send lifecycle; the paid step flips the invoice to PAID and shows the owner-flag safety-net note; results tally + days-to-pay before→after render; reduced-motion path shows content instantly; no horizontal scroll at mobile widths; the example card on `/services/automated-workflows` links here.
- `npm run lint` (zero warnings) as the final gate.

## Out of scope

- No engine/shared changes. No real invoicing/payment integration (fully scripted). No pricing of PDS's own services on the demo. No changes to the other demos or the Automated Workflows page beyond the one `to` field. No interactive editing of the cadence or reminders (presentational only). No per-send owner approval step.

## Self-review

- Placeholder scan: no TBD/TODO; content values marked illustrative-and-tunable, interface fixed.
- Consistency: 6 steps map to the `WorkflowProvider` accessors; the two `isAi` steps match `AiStep = "plan" | "draft"`; `getCadence`/`getReminders` back the two reveal steps; `getPayment`/`getOwnerFlag` back the paid step.
- Scope: single demo folder + two one-line wiring edits — fits one implementation plan.
- Ambiguity: the send step reuses the shared send lifecycle exactly as prior demos do (active rung), presented on a cadence timeline; the owner-escalation is presentational (planned safety net + results stat), not a separately tracked invoice.
