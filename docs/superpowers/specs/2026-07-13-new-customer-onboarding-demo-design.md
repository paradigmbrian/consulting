# New-Customer Onboarding Demo — Design

**Date:** 2026-07-13
**Status:** Approved (brainstorming)
**Related:** [[demo-engine-architecture]], [[2026-07-12-weekly-owner-reports-demo-design]], [[2026-07-12-invoice-payment-reminders-demo-design]], win-back / missed-call / review-generation / automated-quoting / invoice-reminders / weekly-reports demos

## Goal

Build an interactive click-through demo for the **New-Customer Onboarding** automation, on the shared demo engine (`src/demos/shared/`), and link it from its example card on the Automated Workflows page. It becomes the eighth demo in the suite (after commercial-cleaning lead-gen, win-back, missed-call text-back, review generation, automated quoting, invoice reminders, and weekly owner reports).

## What makes this demo distinct

The prior demos are either *send → reply* (win-back, missed-call, review, quoting, invoice) or *data → AI narrative* (weekly reports). New-Customer Onboarding is a third shape: **one trigger → a coordinated onboarding sequence**. A single new-customer booking fans out into a whole welcome-docs-scheduling flow that runs itself.

The AI "hero" is an **authored welcome**: the AI reads the bare booking and writes a personalized welcome message + a tailored "what to expect" — the contrast between a raw form submission and a polished, human-sounding welcome is the wow. A second AI beat then **assembles the onboarding packet** — deciding what *this* customer still needs (agreement, gate access) versus what the booking already captured (equipment, billing) — showing operational judgment, not just a checklist firing. The sequence then delivers the welcome and auto-books the first visit, so onboarding is done end-to-end before the owner lifts a finger.

## Persona & narrative

**Business:** *Clearwater Pool Care* — weekly pool cleaning & maintenance (owner + a couple of route techs). Recurring residential service where onboarding is real: a new customer needs a signed agreement, a gate code, equipment details, and a first visit on the calendar before anyone shows up.

**New customer:** *Marcus Bell, 14 Aldercreek Dr* — just booked weekly service for an in-ground saltwater pool through the website form on a Saturday afternoon.

**The moment:** Instead of the owner spending ~20 minutes writing a welcome email, chasing the signed agreement, collecting the gate code, and hunting for a first slot, the automation welcomes Marcus, assembles exactly what he needs, and books his first visit — within minutes of the booking, untouched by the owner.

## Step flow (6 steps)

Two steps are AI-powered (`isAi: true`) and render the shared `AiPanel`.

| # | id | label | Icon | isAi | Stage content |
|---|----|-------|------|------|---------------|
| 1 | `signup` | New customer booked | `FaUserPlus` | — | The trigger: Marcus's raw booking — customer, address, service booked, how it came in, and a few intake facts. Unglamorous, the bare form data. |
| 2 | `compose` | Write the welcome | `FaPenFancy` | ✓ | AI reads what he booked and writes a personalized welcome + a tailored "what to expect." `AiPanel` reasoning, then the welcome letter card reveals. **The hero beat.** |
| 3 | `packet` | Assemble the packet | `FaClipboardCheck` | ✓ | AI decides what *this* customer needs and assembles the onboarding checklist (agreement, gate access, equipment, billing, first-visit window) with per-item status. `AiPanel` reasoning, then the checklist reveals. |
| 4 | `deliver` | Send to the customer | `FaPaperPlane` | — | The welcome + packet link goes out as a text/email; send lifecycle → Marcus opens and reads it. Ends at "read" (no reply). |
| 5 | `schedule` | Book the first visit | `FaCalendarCheck` | — | A first-visit slot is auto-booked and confirmed. Self-contained timed reveal (no send lifecycle): the slot "confirms" after a beat and a confirmation card reveals. Presentational payoff. |
| 6 | `results` | Results | `FaChartLine` | — | Recap: customers onboarded, avg time-to-first-visit, agreements signed same-day, hours saved not doing it by hand. |

The `deliver` step reuses the shared send lifecycle and ends at "read" (no reply). The `schedule` step is a self-contained timed reveal (no send lifecycle) — the booking is presentational.

## Architecture

New thin folder `src/demos/newCustomerOnboarding/`, mirroring `weeklyReports/`:

- `steps.ts` — the 6 `DemoStep`s (icons from `react-icons/fa`).
- `types.ts` — a `WorkflowProvider` interface + the data types.
- `script.ts` — all mock data (business, signup, welcome, packet, delivery, first visit, results, AI reasoning).
- `provider.ts` — `scriptedWorkflowProvider` implementing `WorkflowProvider`.
- `steps/` — 6 step components, each taking `{ provider }`.
- `onboarding.css` — scoped styles, `nco-*` class prefix, `--demo-*` / `--spacing-*` tokens.
- `OnboardingDemo.tsx` — composes `DemoProvider steps → SendLifecycleProvider → DemoShell renderStage`.

Everything else (shell, vertical flow rail, AI panel, send lifecycle, reduced-motion) is reused unchanged from `src/demos/shared/`. **No engine changes.**

## WorkflowProvider interface

```ts
export type AiStep = "compose" | "packet";
export type PacketStatus = "ready" | "collected" | "requested";

getBusiness(): Business;          // name, service, context line
getSignup(): Signup;              // the raw booking { customerName, address, serviceBooked, bookedVia, intakeFacts[] }
getWelcome(): Welcome;            // the AI prose artifact { greeting, body[], whatToExpect[] }
getPacket(): PacketItem[];        // the onboarding checklist [{ label, detail, status }]
getDelivery(): Delivery;          // { recipientName, channel, sentLabel }
getFirstVisit(): FirstVisit;      // { slotLabel, tech, confirmation, detail } — the post-schedule payoff
getResults(): ResultsSummary;     // customersOnboarded, avgTimeToFirstVisit, agreementsSigned, hoursSaved, takeaway
getAiReasoning(step: AiStep): AiReasoning;
```

Supporting types:
- `Business { name: string; service: string; context: string }`
- `Signup { customerName: string; address: string; serviceBooked: string; bookedVia: string; intakeFacts: string[] }`
- `Welcome { greeting: string; body: string[]; whatToExpect: string[] }`
- `PacketItem { label: string; detail: string; status: PacketStatus }`
- `Delivery { recipientName: string; channel: string; sentLabel: string }`
- `FirstVisit { slotLabel: string; tech: string; confirmation: string; detail: string }`
- `ResultsSummary { customersOnboarded: number; avgTimeToFirstVisit: string; agreementsSigned: string; hoursSaved: string; takeaway: string }`
- `AiReasoning { step: AiStep; title: string; lines: string[] }`

## Mock data (script.ts) — content sketch

- **Business:** Clearwater Pool Care; service "Weekly pool cleaning & maintenance"; context "every new customer used to mean 20 minutes of welcome email, chasing a signed agreement, and hunting for a gate code before the first visit."
- **Signup (the trigger booking):** customerName "Marcus Bell"; address "14 Aldercreek Dr"; serviceBooked "Weekly pool service — in-ground"; bookedVia "Website booking form · Sat 4:12 PM"; intakeFacts ["In-ground pool, ~18,000 gal", "Saltwater system", "Prefers morning visits", "Card entered at booking"].
- **Welcome (the hero prose):**
  - greeting "Welcome to Clearwater, Marcus!"
  - body: ["Thanks for choosing Clearwater Pool Care — your weekly service is all set, and we'll keep your water clear and balanced so you never have to think about it.", "Your regular technician will be Diego, who runs the Aldercreek route. He'll test and balance your water, clean the pool, and check your saltwater system on every visit."]
  - whatToExpect: ["A dependable weekly visit — same day each week, no need to be home.", "A photo and quick service summary texted to you after every clean.", "Balanced water and a healthy salt system, checked every single time."]
- **Packet (the checklist):**
  - Service agreement · "Weekly terms & auto-pay — one tap to sign" · requested
  - Gate / pool access · "Gate code or access notes so Diego can reach the pool" · requested
  - Equipment profile · "In-ground · ~18,000 gal · saltwater — pulled from your booking" · ready
  - Billing on file · "Card saved at booking — weekly auto-pay ready" · collected
  - First-visit window · "Proposed and confirmed automatically" · ready
- **Delivery:** recipientName "Marcus"; channel "Text + email"; sentLabel "Sat 4:14 PM".
- **First visit:** slotLabel "Thursday, Jul 17 · 8:00–9:30 AM"; tech "Diego R."; confirmation "First visit booked — Thursday 8:00 AM."; detail "Added to Diego's Aldercreek route. Marcus gets a reminder the day before, and you never touched the calendar."
- **Results:** customersOnboarded 34; avgTimeToFirstVisit "3.5 days"; agreementsSigned "94% same-day"; hoursSaved "~11 hrs/mo"; takeaway "Thirty-four new customers welcomed the moment they booked — agreements signed same-day, first visits on the calendar in under four days, and not one evening lost to welcome emails. Every pool starts on the right foot."
- **AI reasoning:**
  - `compose` (title "Composing Marcus's welcome"): pull the booking (weekly, in-ground saltwater, prefers mornings); greet him by name and confirm exactly what he signed up for; assign a regular tech so it feels personal, not corporate; set three clear expectations for a recurring service he shouldn't have to think about; keep it warm and under a 20-second read.
  - `packet` (title "Assembling the onboarding packet"): list everything a new weekly customer needs before the first visit; auto-fill what the booking already gave us (equipment profile, card on file); flag what only Marcus can provide (signed agreement, gate/pool access); turn the agreement into a one-tap sign and request the gate code in the same message; track each item's status so nothing gets chased by hand.

Values are illustrative and tunable during implementation without changing the interface.

## Styling

- Scoped `.demo` dark palette provides `--demo-*` tokens; use those plus `--spacing-*`.
- Class prefix `nco-*`. Reuse structural idioms from the prior demos: `*-heading`/`*-sub`, reveal wrappers (`opacity/translateY` + `.is-shown`), the send-lifecycle stage strip (step 4), and the results tally grid.
- New bespoke UI: the **booking card** (the raw form data — customer, address, service, intake facts — deliberately plain, "the trigger"), the **welcome letter card** (greeting + body paragraphs + a "what to expect" bulleted list — the hero, reads like a real welcome), the **packet checklist** (rows with label + detail + a status pill), and the **first-visit confirmation card** (slot + tech + a confirmation that reveals after a beat — the payoff).
- Status pills: `ready` and `collected` use the success token/green tint (with a check for `collected`); `requested` uses the amber tint (`#f4b740`, as in sibling demos) to read as "pending from the customer." Keep all bespoke UI self-contained in `onboarding.css`.
- Responsive: match the prior demos' media queries; the booking card, welcome card, packet checklist, and confirmation card must stay readable and not cause horizontal scroll at mobile widths.

## Wiring

- **Route:** add `<Route path="/demos/onboarding" element={<OnboardingDemo />} />` in `App.tsx`, **outside** the `Layout` route, next to the other demo routes.
- **Example card:** set `to: "/demos/onboarding"` on the existing "New-Customer Onboarding" entry (`icon: FaUserPlus`) in `AutomatedWorkflows.tsx`. The card auto-becomes a `<Link>`.

## Verification

No test framework exists. Per convention:
- `npm run build` (tsc + Vite) — no errors, no unused imports.
- `npm run dev` smoke at `/demos/onboarding`: 6 steps advance via rail + Next/Back; the booking card shows the raw signup; both AI panels play then reveal (welcome letter, then packet checklist); the deliver step animates the send lifecycle to "read"; the schedule step reveals the first-visit confirmation after a beat; results tally renders; reduced-motion path shows content instantly; no horizontal scroll at mobile widths; the example card on `/services/automated-workflows` links here.
- `npm run lint` (zero warnings) as the final gate.

## Out of scope

- No engine/shared changes. No real CRM/scheduling/e-sign integration (fully scripted). No pricing of PDS's own services on the demo. No changes to the other demos or the Automated Workflows page beyond the one `to` field. The packet checklist, first-visit booking, and their confirmations are presentational only (no interactive editing, no real action fired). No cross-references to the other demos' data (standalone onboarding).

## Self-review

- Placeholder scan: no TBD/TODO; content values marked illustrative-and-tunable, interface fixed.
- Consistency: 6 steps map to the `WorkflowProvider` accessors; the two `isAi` steps match `AiStep = "compose" | "packet"`; `getWelcome`/`getPacket` back the two reveal steps; `getDelivery` backs the send step; `getFirstVisit` backs the schedule step; `getResults` backs the tally.
- Scope: single demo folder + two one-line wiring edits — fits one implementation plan.
- Ambiguity: the `deliver` step reuses the shared send lifecycle (ends at "read", no reply); the `schedule` step is a self-contained timed reveal (no send lifecycle), and the booking is presentational.
