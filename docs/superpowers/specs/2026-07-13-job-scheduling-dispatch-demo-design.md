# Job Scheduling & Dispatch Demo — Design

**Date:** 2026-07-13
**Status:** Approved (brainstorming)
**Related:** [[demo-engine-architecture]], [[2026-07-13-new-customer-onboarding-demo-design]], [[2026-07-12-weekly-owner-reports-demo-design]], win-back / missed-call / review-generation / automated-quoting / invoice-reminders / weekly-reports / onboarding demos

## Goal

Build an interactive click-through demo for the **Job Scheduling & Dispatch** automation, on the shared demo engine (`src/demos/shared/`), and link it from its example card on the Automated Workflows page. It becomes the ninth demo in the suite.

## What makes this demo distinct

The prior demos are *send → reply*, *data → AI narrative*, or *trigger → coordinated sequence*. Job Scheduling & Dispatch is the first **AI assignment / optimization** demo: a messy pile of unassigned jobs and a set of techs become an optimized dispatch board. Two AI beats carry it — **assign** (which tech does each job: skill, zone, availability, workload, emergency priority) and **route** (what order each van runs to cut drive time while honoring time windows and keeping the emergency first). The wow is visible matching and sequencing — judgment over logistics — not writing. It closes on the customer-facing payoff the card promises: every customer gets an ETA notification.

## Persona & narrative

**Business:** *Rapid Flow Plumbing* — residential plumbing: repairs, installs & drain cleaning. Four techs with distinct specialties run vans across the whole service area.

**The moment:** It's morning. Eight jobs are stacked up, four vans are ready, and one call is a burst-pipe emergency. The dispatcher normally spends the first hour every day playing Tetris — matching skills to jobs, protecting time windows, squeezing in the emergency, and trying not to send anyone back and forth across town. The AI does it in under a minute, dispatches each van, and texts every customer an ETA.

## Step flow (6 steps)

Two steps are AI-powered (`isAi: true`) and render the shared `AiPanel`.

| # | id | label | Icon | isAi | Stage content |
|---|----|-------|------|------|---------------|
| 1 | `queue` | The morning job pile | `FaClipboardList` | — | The trigger: the 4 techs (name, specialty, zone) plus 8 unassigned jobs, each with customer, location, type, time window, and priority — one is a burst-pipe emergency (red tag). Dense and unsorted, the morning pile. |
| 2 | `assign` | Match jobs to techs | `FaUserCheck` | ✓ | AI matches each job to the right tech — skill, zone, availability, workload balance, emergency-first. `AiPanel` reasoning, then the assignment list reveals (job → tech with the matching reason). |
| 3 | `route` | Route each van | `FaRoute` | ✓ | AI sequences each tech's day into the tightest route that still honors time windows and keeps the emergency first. `AiPanel` reasoning, then per-van ordered timelines reveal. |
| 4 | `dispatch` | Push to the crew | `FaTruck` | — | Assignments go to each van's phone; a self-contained timed reveal shows all 4 techs tapping **Accepted**. Presentational. |
| 5 | `notify` | Notify the customer | `FaCommentDots` | — | Every customer gets an ETA text; the send lifecycle shows the emergency customer's message going out and getting read. Ends at "read" (no reply). |
| 6 | `results` | Results | `FaChartLine` | — | Recap: jobs placed, drive time saved, on-time arrival, dispatch time (under a minute vs. an hour). |

The `dispatch` step is a self-contained timed reveal (no send lifecycle) — the crew acceptance is presentational. The `notify` step reuses the shared send lifecycle and ends at "read".

## Architecture

New thin folder `src/demos/jobDispatch/`, mirroring `newCustomerOnboarding/`:

- `steps.ts` — the 6 `DemoStep`s (icons from `react-icons/fa`).
- `types.ts` — a `WorkflowProvider` interface + the data types.
- `script.ts` — all mock data (business, techs, jobs, assignments, routes, dispatch, notify, results, AI reasoning).
- `provider.ts` — `scriptedWorkflowProvider` implementing `WorkflowProvider`.
- `steps/` — 6 step components, each taking `{ provider }`.
- `dispatch.css` — scoped styles, `jd-*` class prefix, `--demo-*` / `--spacing-*` tokens.
- `JobDispatchDemo.tsx` — composes `DemoProvider steps → SendLifecycleProvider → DemoShell renderStage`.

Everything else (shell, vertical flow rail, AI panel, send lifecycle, reduced-motion) is reused unchanged from `src/demos/shared/`. **No engine changes.**

## WorkflowProvider interface

```ts
export type AiStep = "assign" | "route";
export type Priority = "emergency" | "standard";

getBusiness(): Business;          // name, service, context line
getTechs(): Tech[];               // the crew [{ name, specialty, zone }]
getJobs(): Job[];                 // the raw queue [{ customer, location, type, window, priority }]
getAssignments(): Assignment[];   // matched [{ jobLabel, customer, techName, reason }]
getRoutes(): TechRoute[];         // sequenced [{ techName, stops[], driveNote }]
getDispatch(): DispatchSummary;   // { headline, crew: [{ techName, stops }], note } — timed reveal
getNotify(): Notification;        // { recipientName, channel, sentLabel, message } — send lifecycle
getResults(): ResultsSummary;     // jobsPlaced, driveTimeSaved, onTimeRate, dispatchTime, takeaway
getAiReasoning(step: AiStep): AiReasoning;
```

Supporting types:
- `Business { name: string; service: string; context: string }`
- `Tech { name: string; specialty: string; zone: string }`
- `Job { customer: string; location: string; type: string; window: string; priority: Priority }`
- `Assignment { jobLabel: string; customer: string; techName: string; reason: string }`
- `TechRoute { techName: string; stops: string[]; driveNote: string }`
- `DispatchCrew { techName: string; stops: string }`
- `DispatchSummary { headline: string; crew: DispatchCrew[]; note: string }`
- `Notification { recipientName: string; channel: string; sentLabel: string; message: string }`
- `ResultsSummary { jobsPlaced: number; driveTimeSaved: string; onTimeRate: string; dispatchTime: string; takeaway: string }`
- `AiReasoning { step: AiStep; title: string; lines: string[] }`

## Mock data (script.ts) — content sketch

- **Business:** Rapid Flow Plumbing; service "Residential plumbing — repairs, installs & drain cleaning"; context "eight jobs, four vans, one emergency — and a dispatcher who spends the first hour every morning playing Tetris with the schedule."
- **Techs (4):**
  - Marco D. · "Water heaters & installs" · "North zone"
  - Priya N. · "Leak detection & repair" · "Central zone"
  - Sam K. · "Drain & sewer" · "East zone"
  - Luis R. · "General repair" · "South zone"
- **Jobs (8, the queue):**
  - Kessler · "1420 Oak Hill Rd" · "Water heater replacement" · "8–11 AM" · standard
  - Nguyen · "88 Birch St" · "Under-sink leak" · "morning" · standard
  - Alvarez · "310 Maple Ave" · "Main drain clog" · "flexible" · standard
  - Foster · "27 Cedar Ct" · "Running toilet + faucet" · "1–4 PM" · standard
  - Brennan · "540 Lakeview Dr" · "Burst pipe — water everywhere" · "ASAP" · emergency
  - Okafor · "9 Sunset Blvd" · "Water heater — no hot water" · "afternoon" · standard
  - Reyes · "215 Pine St" · "Slow shower drain" · "flexible" · standard
  - Whitaker · "76 Elm St" · "Sump pump check" · "morning" · standard
- **Assignments (assign reveal):**
  - Burst pipe · Brennan · Priya N. · "Emergency — Priya's certified for leaks and closest to Lakeview. Bumped to her first stop."
  - Water heater replacement · Kessler · Marco D. · "Marco's the water-heater specialist; Oak Hill sits on his north loop."
  - Water heater — no hot water · Okafor · Marco D. · "Second heater call — same specialist, batched to save a return trip."
  - Under-sink leak · Nguyen · Priya N. · "Leak work in Central — fits Priya's route right after the emergency."
  - Main drain clog · Alvarez · Sam K. · "Drain specialty, East zone — squarely Sam's wheelhouse."
  - Slow shower drain · Reyes · Sam K. · "Another east-side drain — batched onto Sam's run."
  - Sump pump check · Whitaker · Luis R. · "Quick general check, South — keeps Luis's morning tight."
  - Running toilet + faucet · Foster · Luis R. · "General repair, afternoon window — pairs with Luis's south route."
- **Routes (route reveal):**
  - Priya N. · ["1. Brennan — burst pipe (ASAP)", "2. Nguyen — under-sink leak"] · "Emergency first, then the Central leak — 12 min between stops."
  - Marco D. · ["1. Kessler — water heater (8–11 AM)", "2. Okafor — water heater (PM)"] · "Both installs batched north-to-south — one trip, no backtrack."
  - Sam K. · ["1. Alvarez — main drain", "2. Reyes — shower drain"] · "Two east-side drains back to back — 9 min apart."
  - Luis R. · ["1. Whitaker — sump pump (AM)", "2. Foster — toilet + faucet (1–4 PM)"] · "Morning check, afternoon repair — honors both windows."
- **Dispatch (timed reveal):** headline "Pushed to all 4 vans"; crew [{Marco D., "2 stops"}, {Priya N., "2 stops"}, {Sam K., "2 stops"}, {Luis R., "2 stops"}]; note "Each tech gets their stops, addresses, and job notes on their phone — and taps to accept."
- **Notify (send lifecycle):** recipientName "Brennan"; channel "Text"; sentLabel "7:42 AM"; message "Hi Brennan — Priya from Rapid Flow is on her way for the burst pipe. ETA 7:55 AM. You'll get a text when she's close."
- **Results:** jobsPlaced 8; driveTimeSaved "2.5 hrs/day"; onTimeRate "96%"; dispatchTime "under 1 min"; takeaway "Eight jobs, four vans, one emergency — sorted and routed in under a minute instead of an hour of morning Tetris. Techs drive less, every customer knows when someone's coming, and the dispatcher gets their morning back."
- **AI reasoning:**
  - `assign` (title "Claude — assigning the day"): read every job's skill need and the emergency; match each to the tech whose specialty and zone fit; bump the burst pipe to the front; balance the load so no van is overloaded; keep each tech near their home zone.
  - `route` (title "Claude — routing each van"): order each tech's stops to cut drive time; honor the ASAP and windowed jobs; batch nearby jobs together; keep the emergency first; minimize backtracking across the service area.

Values are illustrative and tunable during implementation without changing the interface.

## Styling

- Scoped `.demo` dark palette provides `--demo-*` tokens; use those plus `--spacing-*`.
- Class prefix `jd-*`. Reuse structural idioms from the prior demos: `*-heading`/`*-sub`, reveal wrappers (`opacity/translateY` + `.is-shown`), the send-lifecycle stage strip (step 5), and the results tally grid.
- New bespoke UI: the **job board** (a row of tech chips showing specialty + zone, and a queue of job cards each with customer, location, type, window, and a priority tag), the **assignment list** (job → tech rows with the matching reason), the **route timelines** (per-van cards with an ordered stop list and a drive-time note), and the **dispatch acceptance** (crew rows that flip to "Accepted" after a beat — timed reveal).
- Emergency accent: the `emergency` priority tag and the emergency job/route use a red tint (reuse the amber pattern's structure but red — `#e5484d` or similar; standard jobs use the muted/neutral tag). Green `--demo-success` for the "Accepted" state and on-time metric.
- Responsive: match the prior demos' media queries; the job board, assignment list, route timelines, and tally must stay readable and not cause horizontal scroll at mobile widths.

## Wiring

- **Route:** add `<Route path="/demos/dispatch" element={<JobDispatchDemo />} />` in `App.tsx`, **outside** the `Layout` route, next to the other demo routes.
- **Example card:** set `to: "/demos/dispatch"` on the existing "Job Scheduling & Dispatch" entry (`icon: FaTruck`) in `AutomatedWorkflows.tsx`. The card auto-becomes a `<Link>`.

## Verification

No test framework exists. Per convention:
- `npm run build` (tsc + Vite) — no errors, no unused imports.
- `npm run dev` smoke at `/demos/dispatch`: 6 steps advance via rail + Next/Back; the job board shows the 4 techs + 8 jobs with the emergency tagged; both AI panels play then reveal (assignment list, then route timelines); the dispatch step shows the crew flipping to "Accepted" after a beat; the notify step animates the send lifecycle to "read"; results tally renders; reduced-motion path shows content instantly; no horizontal scroll at mobile widths; the example card on `/services/automated-workflows` links here.
- `npm run lint` (zero warnings) as the final gate.

## Out of scope

- No engine/shared changes. No real scheduling/mapping/routing integration (fully scripted). No pricing of PDS's own services on the demo. No changes to the other demos or the Automated Workflows page beyond the one `to` field. The dispatch acceptance and customer notification are presentational only (no interactive editing, no real messages sent). No cross-references to the other demos' data (standalone dispatch).

## Self-review

- Placeholder scan: no TBD/TODO; content values marked illustrative-and-tunable, interface fixed.
- Consistency: 6 steps map to the `WorkflowProvider` accessors; the two `isAi` steps match `AiStep = "assign" | "route"`; `getAssignments`/`getRoutes` back the two reveal steps; `getDispatch` backs the timed-reveal step; `getNotify` backs the send step; `getResults` backs the tally.
- Scope: single demo folder + two one-line wiring edits — fits one implementation plan.
- Ambiguity: the `dispatch` step is a self-contained timed reveal (no send lifecycle); the `notify` step reuses the shared send lifecycle (ends at "read", no reply); both crew acceptance and customer notification are presentational.
