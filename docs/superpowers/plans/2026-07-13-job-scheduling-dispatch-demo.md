# Job Scheduling & Dispatch Demo Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the ninth interactive click-through demo — Job Scheduling & Dispatch for *Rapid Flow Plumbing* — on the shared demo engine, and link it from its example card on the Automated Workflows page.

**Architecture:** A new thin folder `src/demos/jobDispatch/` mirroring `src/demos/newCustomerOnboarding/`: a `WorkflowProvider` interface + data types (`types.ts`), all mock data (`script.ts`), a scripted provider (`provider.ts`), 6 step definitions (`steps.ts`), 6 step components (`steps/`), scoped CSS (`dispatch.css`), and a composition root (`JobDispatchDemo.tsx`). Everything in `src/demos/shared/` (shell, flow rail, `AiPanel`, send lifecycle, reduced-motion) is reused unchanged — **no engine changes**. Two AI steps (`assign`, `route`) render the shared `AiPanel`; `dispatch` is a self-contained timed reveal; `notify` reuses the shared send lifecycle.

**Tech Stack:** React 18 + TypeScript, Vite 5, `react-router-dom` v6, `react-icons/fa`, vanilla CSS with custom properties.

## Global Constraints

- **No engine/shared changes.** Only files under `src/demos/jobDispatch/` are created, plus two one-line edits (`src/App.tsx` route, `src/components/AutomatedWorkflows.tsx` `to:` field).
- **Class prefix `jd-`** on every bespoke class; use `--demo-*` and `--spacing-*` tokens only (both are already in scope: `--demo-*` from `.demo` in `DemoShell.css`, `--spacing-*` from `:root` in `index.css`).
- **Emergency accent** is red `#e5484d` with a `rgba(229, 72, 77, 0.12)` tint (mirrors the amber `requested`-pill structure). Standard jobs use a muted/neutral tag. Green `var(--demo-success)` for the "Accepted" state and on-time metric.
- **Emergency is derived from data, never hardcoded** — components compute the emergency customer/tech from `getJobs()` + `getAssignments()`, so no name strings live in component logic.
- **No test framework exists** in this repo. Per project convention the verification cycle for every task is: `npm run build` (tsc + Vite, zero errors, no unused imports) → `npm run lint` (zero warnings) → dev smoke where applicable. There are no unit-test steps.
- **Git is user-run.** Per user preference, do **not** execute git write commands. Each task ends by surfacing the exact `git add` / `git commit` command for Brian to run.
- **No horizontal scroll at mobile widths.** The job board, assignment list, route timelines, dispatch crew, and tally must stay readable; match the prior demos' `@media (max-width: 640px)` breakpoints.
- Content values are illustrative and tunable; the `WorkflowProvider` interface is fixed.

---

## File Structure

Created under `src/demos/jobDispatch/`:

- `types.ts` — `WorkflowProvider` interface + all data types (`Business`, `Tech`, `Job`, `Assignment`, `TechRoute`, `DispatchCrew`, `DispatchSummary`, `Notification`, `ResultsSummary`, `AiReasoning`, and unions `AiStep`, `Priority`).
- `script.ts` — all mock data (business, techs, jobs, assignments, routes, dispatch, notify, results, AI reasoning).
- `provider.ts` — `scriptedWorkflowProvider` implementing `WorkflowProvider`.
- `steps.ts` — the 6 `DemoStep`s with `react-icons/fa` icons; `assign` and `route` carry `isAi: true`.
- `dispatch.css` — scoped `jd-*` styles.
- `steps/QueueStep.tsx` — step 1, the job board (tech chips + job cards, emergency tagged).
- `steps/AssignStep.tsx` — step 2 (AI), `AiPanel` then the assignment list reveal.
- `steps/RouteStep.tsx` — step 3 (AI), `AiPanel` then per-van route timelines reveal.
- `steps/DispatchStep.tsx` — step 4, self-contained timed reveal of the crew flipping to "Accepted".
- `steps/NotifyStep.tsx` — step 5, shared send lifecycle ending at "read".
- `steps/ResultsStep.tsx` — step 6, the tally grid + takeaway.
- `JobDispatchDemo.tsx` — composes `DemoProvider steps → SendLifecycleProvider → DemoShell renderStage`.

Modified:

- `src/App.tsx` — add the `/demos/dispatch` route (outside `Layout`).
- `src/components/AutomatedWorkflows.tsx` — add `to: "/demos/dispatch"` to the existing "Job Scheduling & Dispatch" example.

---

### Task 1: Data contract — types, script, provider

Establishes the `WorkflowProvider` interface, all mock data, and the scripted provider. Deliverable: the data layer compiles and the provider satisfies the interface. No UI yet.

**Files:**
- Create: `src/demos/jobDispatch/types.ts`
- Create: `src/demos/jobDispatch/script.ts`
- Create: `src/demos/jobDispatch/provider.ts`

**Interfaces:**
- Consumes: nothing (foundation task).
- Produces: the exports every later task imports —
  - Types (from `./types`): `AiStep = "assign" | "route"`, `Priority = "emergency" | "standard"`, `Business { name, service, context }`, `Tech { name, specialty, zone }`, `Job { customer, location, type, window, priority: Priority }`, `Assignment { jobLabel, customer, techName, reason }`, `TechRoute { techName, stops: string[], driveNote }`, `DispatchCrew { techName, stops }`, `DispatchSummary { headline, crew: DispatchCrew[], note }`, `Notification { recipientName, channel, sentLabel, message }`, `ResultsSummary { jobsPlaced: number, driveTimeSaved, onTimeRate, dispatchTime, takeaway }`, `AiReasoning { step: AiStep, title, lines: string[] }`, `WorkflowProvider`.
  - `scriptedWorkflowProvider: WorkflowProvider` (from `./provider`).
  - Every `WorkflowProvider` method: `getBusiness()`, `getTechs()`, `getJobs()`, `getAssignments()`, `getRoutes()`, `getDispatch()`, `getNotify()`, `getResults()`, `getAiReasoning(step: AiStep)`.

- [ ] **Step 1: Create `types.ts`**

```ts
export type AiStep = "assign" | "route";
export type Priority = "emergency" | "standard";

export interface Business {
  name: string;
  service: string;
  context: string;
}

export interface Tech {
  name: string;
  specialty: string;
  zone: string;
}

export interface Job {
  customer: string;
  location: string;
  type: string;
  window: string;
  priority: Priority;
}

export interface Assignment {
  jobLabel: string;
  customer: string;
  techName: string;
  reason: string;
}

export interface TechRoute {
  techName: string;
  stops: string[];
  driveNote: string;
}

export interface DispatchCrew {
  techName: string;
  stops: string;
}

export interface DispatchSummary {
  headline: string;
  crew: DispatchCrew[];
  note: string;
}

export interface Notification {
  recipientName: string;
  channel: string;
  sentLabel: string;
  message: string;
}

export interface ResultsSummary {
  jobsPlaced: number;
  driveTimeSaved: string;
  onTimeRate: string;
  dispatchTime: string;
  takeaway: string;
}

export interface AiReasoning {
  step: AiStep;
  title: string;
  lines: string[];
}

export interface WorkflowProvider {
  getBusiness(): Business;
  getTechs(): Tech[];
  getJobs(): Job[];
  getAssignments(): Assignment[];
  getRoutes(): TechRoute[];
  getDispatch(): DispatchSummary;
  getNotify(): Notification;
  getResults(): ResultsSummary;
  getAiReasoning(step: AiStep): AiReasoning;
}
```

- [ ] **Step 2: Create `script.ts`**

```ts
import type {
  Business,
  Tech,
  Job,
  Assignment,
  TechRoute,
  DispatchSummary,
  Notification,
  ResultsSummary,
  AiStep,
  AiReasoning,
} from "./types";

export const business: Business = {
  name: "Rapid Flow Plumbing",
  service: "Residential plumbing — repairs, installs & drain cleaning",
  context:
    "Eight jobs, four vans, one emergency — and a dispatcher who spends the first hour every morning playing Tetris with the schedule.",
};

export const techs: Tech[] = [
  { name: "Marco D.", specialty: "Water heaters & installs", zone: "North zone" },
  { name: "Priya N.", specialty: "Leak detection & repair", zone: "Central zone" },
  { name: "Sam K.", specialty: "Drain & sewer", zone: "East zone" },
  { name: "Luis R.", specialty: "General repair", zone: "South zone" },
];

export const jobs: Job[] = [
  {
    customer: "Kessler",
    location: "1420 Oak Hill Rd",
    type: "Water heater replacement",
    window: "8–11 AM",
    priority: "standard",
  },
  {
    customer: "Nguyen",
    location: "88 Birch St",
    type: "Under-sink leak",
    window: "morning",
    priority: "standard",
  },
  {
    customer: "Alvarez",
    location: "310 Maple Ave",
    type: "Main drain clog",
    window: "flexible",
    priority: "standard",
  },
  {
    customer: "Foster",
    location: "27 Cedar Ct",
    type: "Running toilet + faucet",
    window: "1–4 PM",
    priority: "standard",
  },
  {
    customer: "Brennan",
    location: "540 Lakeview Dr",
    type: "Burst pipe — water everywhere",
    window: "ASAP",
    priority: "emergency",
  },
  {
    customer: "Okafor",
    location: "9 Sunset Blvd",
    type: "Water heater — no hot water",
    window: "afternoon",
    priority: "standard",
  },
  {
    customer: "Reyes",
    location: "215 Pine St",
    type: "Slow shower drain",
    window: "flexible",
    priority: "standard",
  },
  {
    customer: "Whitaker",
    location: "76 Elm St",
    type: "Sump pump check",
    window: "morning",
    priority: "standard",
  },
];

export const assignments: Assignment[] = [
  {
    jobLabel: "Burst pipe",
    customer: "Brennan",
    techName: "Priya N.",
    reason:
      "Emergency — Priya's certified for leaks and closest to Lakeview. Bumped to her first stop.",
  },
  {
    jobLabel: "Water heater replacement",
    customer: "Kessler",
    techName: "Marco D.",
    reason:
      "Marco's the water-heater specialist; Oak Hill sits on his north loop.",
  },
  {
    jobLabel: "Water heater — no hot water",
    customer: "Okafor",
    techName: "Marco D.",
    reason:
      "Second heater call — same specialist, batched to save a return trip.",
  },
  {
    jobLabel: "Under-sink leak",
    customer: "Nguyen",
    techName: "Priya N.",
    reason:
      "Leak work in Central — fits Priya's route right after the emergency.",
  },
  {
    jobLabel: "Main drain clog",
    customer: "Alvarez",
    techName: "Sam K.",
    reason: "Drain specialty, East zone — squarely Sam's wheelhouse.",
  },
  {
    jobLabel: "Slow shower drain",
    customer: "Reyes",
    techName: "Sam K.",
    reason: "Another east-side drain — batched onto Sam's run.",
  },
  {
    jobLabel: "Sump pump check",
    customer: "Whitaker",
    techName: "Luis R.",
    reason: "Quick general check, South — keeps Luis's morning tight.",
  },
  {
    jobLabel: "Running toilet + faucet",
    customer: "Foster",
    techName: "Luis R.",
    reason:
      "General repair, afternoon window — pairs with Luis's south route.",
  },
];

export const routes: TechRoute[] = [
  {
    techName: "Priya N.",
    stops: ["1. Brennan — burst pipe (ASAP)", "2. Nguyen — under-sink leak"],
    driveNote: "Emergency first, then the Central leak — 12 min between stops.",
  },
  {
    techName: "Marco D.",
    stops: [
      "1. Kessler — water heater (8–11 AM)",
      "2. Okafor — water heater (PM)",
    ],
    driveNote: "Both installs batched north-to-south — one trip, no backtrack.",
  },
  {
    techName: "Sam K.",
    stops: ["1. Alvarez — main drain", "2. Reyes — shower drain"],
    driveNote: "Two east-side drains back to back — 9 min apart.",
  },
  {
    techName: "Luis R.",
    stops: [
      "1. Whitaker — sump pump (AM)",
      "2. Foster — toilet + faucet (1–4 PM)",
    ],
    driveNote: "Morning check, afternoon repair — honors both windows.",
  },
];

export const dispatch: DispatchSummary = {
  headline: "Pushed to all 4 vans",
  crew: [
    { techName: "Marco D.", stops: "2 stops" },
    { techName: "Priya N.", stops: "2 stops" },
    { techName: "Sam K.", stops: "2 stops" },
    { techName: "Luis R.", stops: "2 stops" },
  ],
  note: "Each tech gets their stops, addresses, and job notes on their phone — and taps to accept.",
};

export const notify: Notification = {
  recipientName: "Brennan",
  channel: "Text",
  sentLabel: "7:42 AM",
  message:
    "Hi Brennan — Priya from Rapid Flow is on her way for the burst pipe. ETA 7:55 AM. You'll get a text when she's close.",
};

export const results: ResultsSummary = {
  jobsPlaced: 8,
  driveTimeSaved: "2.5 hrs/day",
  onTimeRate: "96%",
  dispatchTime: "under 1 min",
  takeaway:
    "Eight jobs, four vans, one emergency — sorted and routed in under a minute instead of an hour of morning Tetris. Techs drive less, every customer knows when someone's coming, and the dispatcher gets their morning back.",
};

export const aiReasoning: Record<AiStep, AiReasoning> = {
  assign: {
    step: "assign",
    title: "Claude — assigning the day",
    lines: [
      "Reading every job's skill need and flagging the burst-pipe emergency.",
      "Matching each job to the tech whose specialty and zone fit best.",
      "Bumping the burst pipe to the front of the day — everything else flexes around it.",
      "Balancing the load so no van is overloaded and no one's idle.",
      "Keeping each tech near their home zone to cut cross-town drives.",
    ],
  },
  route: {
    step: "route",
    title: "Claude — routing each van",
    lines: [
      "Ordering each tech's stops to cut total drive time.",
      "Honoring the ASAP emergency and every fixed time window.",
      "Batching nearby jobs together so vans don't backtrack.",
      "Keeping the emergency locked as Priya's first stop.",
      "Minimizing miles across the whole service area.",
    ],
  },
};
```

- [ ] **Step 3: Create `provider.ts`**

```ts
import type {
  Business,
  Tech,
  Job,
  Assignment,
  TechRoute,
  DispatchSummary,
  Notification,
  ResultsSummary,
  AiStep,
  AiReasoning,
  WorkflowProvider,
} from "./types";
import {
  business,
  techs,
  jobs,
  assignments,
  routes,
  dispatch,
  notify,
  results,
  aiReasoning,
} from "./script";

class ScriptedWorkflowProvider implements WorkflowProvider {
  getBusiness(): Business {
    return business;
  }

  getTechs(): Tech[] {
    return techs;
  }

  getJobs(): Job[] {
    return jobs;
  }

  getAssignments(): Assignment[] {
    return assignments;
  }

  getRoutes(): TechRoute[] {
    return routes;
  }

  getDispatch(): DispatchSummary {
    return dispatch;
  }

  getNotify(): Notification {
    return notify;
  }

  getResults(): ResultsSummary {
    return results;
  }

  getAiReasoning(step: AiStep): AiReasoning {
    return aiReasoning[step];
  }
}

export const scriptedWorkflowProvider: WorkflowProvider =
  new ScriptedWorkflowProvider();
```

- [ ] **Step 4: Verify build**

Run: `npm run build`
Expected: PASS — tsc + Vite complete with no errors. (The new files are not yet imported anywhere; tsc still type-checks them. `ScriptedWorkflowProvider` compiling proves it satisfies `WorkflowProvider`.)

- [ ] **Step 5: Surface the commit command**

Print for Brian to run (do not execute):

```bash
git add src/demos/jobDispatch/types.ts src/demos/jobDispatch/script.ts src/demos/jobDispatch/provider.ts
git commit -m "feat(dispatch): add job-dispatch demo data contract and provider"
```

---

### Task 2: Scoped stylesheet — `dispatch.css`

The full `jd-*` stylesheet. CSS classes are not type-checked, so this task's deliverable is verified by build (no import errors) and visually in Task 4's smoke; author it up front so the step components in Tasks 3–4 reference classes that already exist.

**Files:**
- Create: `src/demos/jobDispatch/dispatch.css`

**Interfaces:**
- Consumes: `--demo-*` tokens (from `.demo` scope) and `--spacing-*` tokens (from `:root`).
- Produces: the `jd-*` classes every step component uses (`jd-step`, `jd-heading`, `jd-sub`, `jd-note`, `jd-reveal`, `jd-techs`/`jd-tech-*`, `jd-jobs`/`jd-job-*`, `jd-assignments`/`jd-assign-*`, `jd-routes`/`jd-route-*`, `jd-dispatch`/`jd-crew-*`, `jd-notify`/`jd-life*`, `jd-tally`/`jd-takeaway`).

- [ ] **Step 1: Create `dispatch.css`**

```css
.jd-step {
  color: var(--demo-text);
  /* emergency accent — red counterpart to the amber pattern */
  --jd-emergency: #e5484d;
  --jd-emergency-tint: rgba(229, 72, 77, 0.12);
}

.jd-heading {
  font-size: 1.15rem;
  margin: 0 0 var(--spacing-xs);
}

.jd-sub {
  color: var(--demo-muted);
  margin: 0 0 var(--spacing-md);
  max-width: 60ch;
}

.jd-note {
  color: var(--demo-muted);
  font-size: 0.85rem;
  margin: var(--spacing-md) 0 0;
}

/* Reveal wrapper (shared by the assign + route steps) */
.jd-reveal {
  opacity: 0;
  transform: translateY(6px);
  transition: opacity 0.4s ease, transform 0.4s ease;
  margin-top: var(--spacing-md);
}
.jd-reveal.is-shown {
  opacity: 1;
  transform: none;
}

/* Tech chips (step 1) — the crew */
.jd-techs {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: var(--spacing-sm);
  margin-bottom: var(--spacing-md);
}
.jd-tech-chip {
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
  padding: var(--spacing-sm);
  background: var(--demo-surface-2);
  border: 1px solid var(--demo-border);
  border-radius: 0.5rem;
}
.jd-tech-name {
  font-weight: 700;
  color: var(--demo-text);
}
.jd-tech-specialty {
  font-size: 0.8rem;
  color: var(--demo-text);
}
.jd-tech-zone {
  font-size: 0.75rem;
  color: var(--demo-muted);
}

/* Job board (step 1) — the unsorted pile */
.jd-jobs {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: var(--spacing-sm);
}
.jd-job-card {
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
  padding: var(--spacing-sm) var(--spacing-md);
  background: var(--demo-surface-2);
  border: 1px solid var(--demo-border);
  border-radius: 0.5rem;
}
.jd-job-card.is-emergency {
  border-color: var(--jd-emergency);
  background: var(--jd-emergency-tint);
}
.jd-job-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--spacing-sm);
}
.jd-job-customer {
  font-weight: 700;
  color: var(--demo-text);
}
.jd-job-tag {
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  padding: 0.15rem 0.5rem;
  border-radius: 999px;
  font-size: 0.7rem;
  font-weight: 600;
  white-space: nowrap;
  color: var(--demo-muted);
  background: rgba(139, 151, 167, 0.12);
}
.jd-job-tag.is-emergency {
  color: var(--jd-emergency);
  background: var(--jd-emergency-tint);
}
.jd-job-type {
  font-size: 0.9rem;
  color: var(--demo-text);
}
.jd-job-meta {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: var(--spacing-sm);
}
.jd-job-location {
  font-size: 0.8rem;
  color: var(--demo-muted);
}
.jd-job-window {
  font-size: 0.75rem;
  color: var(--demo-muted);
  white-space: nowrap;
}

/* Assignment list (step 2) — job → tech with the matching reason */
.jd-assignments {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
}
.jd-assign-row {
  padding: var(--spacing-sm) var(--spacing-md);
  background: var(--demo-surface-2);
  border: 1px solid var(--demo-border);
  border-radius: 0.5rem;
}
.jd-assign-row.is-emergency {
  border-color: var(--jd-emergency);
  background: var(--jd-emergency-tint);
}
.jd-assign-match {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  flex-wrap: wrap;
}
.jd-assign-job {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  font-weight: 700;
  color: var(--demo-text);
}
.jd-assign-row.is-emergency .jd-assign-job {
  color: var(--jd-emergency);
}
.jd-assign-customer {
  font-weight: 400;
  font-size: 0.8rem;
  color: var(--demo-muted);
}
.jd-assign-arrow {
  flex: 0 0 auto;
  color: var(--demo-accent-bright);
}
.jd-assign-tech {
  font-weight: 700;
  color: var(--demo-accent-bright);
}
.jd-assign-reason {
  margin: 0.35rem 0 0;
  font-size: 0.85rem;
  line-height: 1.4;
  color: var(--demo-muted);
}

/* Route timelines (step 3) — per-van ordered stops + drive note */
.jd-routes {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: var(--spacing-sm);
}
.jd-route-card {
  padding: var(--spacing-md);
  background: var(--demo-surface-2);
  border: 1px solid var(--demo-border);
  border-radius: 0.6rem;
}
.jd-route-card.is-emergency {
  border-color: var(--jd-emergency);
}
.jd-route-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--spacing-sm);
  margin-bottom: var(--spacing-sm);
}
.jd-route-tech {
  font-weight: 700;
  color: var(--demo-text);
}
.jd-route-flag {
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  font-size: 0.7rem;
  font-weight: 600;
  color: var(--jd-emergency);
  background: var(--jd-emergency-tint);
  padding: 0.15rem 0.5rem;
  border-radius: 999px;
  white-space: nowrap;
}
.jd-route-stops {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}
.jd-route-stop {
  font-size: 0.85rem;
  color: var(--demo-text);
  padding-left: var(--spacing-sm);
  border-left: 2px solid var(--demo-border);
}
.jd-route-note {
  margin: var(--spacing-sm) 0 0;
  padding-top: var(--spacing-sm);
  border-top: 1px solid var(--demo-border);
  font-size: 0.8rem;
  color: var(--demo-muted);
}

/* Dispatch (step 4) — crew rows flip to "Accepted" (timed reveal) */
.jd-dispatch {
  padding: var(--spacing-md);
  background: var(--demo-surface-2);
  border: 1px solid var(--demo-border);
  border-radius: 0.6rem;
}
.jd-dispatch-head {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  font-weight: 700;
  color: var(--demo-text);
  margin-bottom: var(--spacing-md);
}
.jd-crew {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
}
.jd-crew-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--spacing-sm);
  padding: var(--spacing-sm) var(--spacing-md);
  background: var(--demo-bg);
  border: 1px solid var(--demo-border);
  border-radius: 0.5rem;
  transition: border-color 0.3s ease;
}
.jd-crew-row.is-accepted {
  border-color: var(--demo-success);
}
.jd-crew-name {
  font-weight: 700;
  color: var(--demo-text);
  flex: 1 1 auto;
}
.jd-crew-stops {
  font-size: 0.8rem;
  color: var(--demo-muted);
}
.jd-crew-status {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  font-size: 0.8rem;
  font-weight: 700;
  color: var(--demo-muted);
  white-space: nowrap;
}
.jd-crew-row.is-accepted .jd-crew-status {
  color: var(--demo-success);
}
.jd-dispatch-note {
  margin: var(--spacing-md) 0 0;
  font-size: 0.85rem;
  color: var(--demo-muted);
}

/* Notify (step 5) — send lifecycle strip, ends at "read" */
.jd-notify {
  padding: var(--spacing-md);
  background: var(--demo-surface-2);
  border: 1px solid var(--demo-border);
  border-radius: 0.6rem;
}
.jd-notify-meta {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  justify-content: space-between;
  gap: var(--spacing-xs);
  margin-bottom: var(--spacing-sm);
}
.jd-notify-to {
  font-weight: 700;
  color: var(--demo-text);
}
.jd-notify-channel {
  font-size: 0.8rem;
  color: var(--demo-muted);
}
.jd-notify-message {
  margin: 0 0 var(--spacing-md);
  padding: var(--spacing-sm) var(--spacing-md);
  background: var(--demo-bg);
  border: 1px solid var(--demo-border);
  border-left: 3px solid var(--demo-accent-bright);
  border-radius: 0.5rem;
  font-size: 0.9rem;
  line-height: 1.5;
  color: var(--demo-text);
}
.jd-lifecycle {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  gap: var(--spacing-sm);
}
.jd-life {
  flex: 1 1 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.35rem;
  padding: var(--spacing-sm);
  border: 1px solid var(--demo-border);
  border-radius: 0.5rem;
  color: var(--demo-muted);
  opacity: 0.5;
  transition: opacity 0.3s ease, color 0.3s ease, border-color 0.3s ease;
}
.jd-life.is-active {
  opacity: 1;
  color: var(--demo-text);
  border-color: var(--demo-accent-bright);
}
.jd-life.is-done {
  color: var(--demo-success);
  border-color: var(--demo-success);
}
.jd-life-icon {
  font-size: 1.1rem;
}
.jd-life-label {
  font-size: 0.8rem;
}
.jd-notify-note {
  margin: var(--spacing-md) 0 0;
  font-size: 0.85rem;
  color: var(--demo-success);
}

/* Results (step 6) — recap tally + takeaway */
.jd-tally {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: var(--spacing-sm);
  margin-bottom: var(--spacing-md);
}
.jd-tally-item {
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
  padding: var(--spacing-md);
  background: var(--demo-surface-2);
  border: 1px solid var(--demo-border);
  border-radius: 0.5rem;
  text-align: center;
}
.jd-tally-item-hl {
  border-color: var(--demo-accent-bright);
}
.jd-tally-num {
  font-size: 1.3rem;
  font-weight: 700;
  color: var(--demo-text);
}
.jd-tally-item-hl .jd-tally-num {
  color: var(--demo-accent-bright);
}
.jd-tally-label {
  font-size: 0.75rem;
  color: var(--demo-muted);
}
.jd-takeaway {
  margin: 0;
  font-size: 0.9rem;
  line-height: 1.5;
  color: var(--demo-text);
  max-width: 65ch;
}

/* Responsive — collapse multi-column grids, prevent horizontal scroll */
@media (max-width: 640px) {
  .jd-techs {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
  .jd-jobs {
    grid-template-columns: 1fr;
  }
  .jd-routes {
    grid-template-columns: 1fr;
  }
  .jd-tally {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
  .jd-crew-row {
    flex-wrap: wrap;
  }
}
```

- [ ] **Step 2: Verify build**

Run: `npm run build`
Expected: PASS. (CSS is bundled but not yet imported; this confirms no syntax error breaks the build once imported in Task 5.)

- [ ] **Step 3: Surface the commit command**

```bash
git add src/demos/jobDispatch/dispatch.css
git commit -m "feat(dispatch): add scoped jd-* stylesheet for job-dispatch demo"
```

---

### Task 3: The two AI step components — `AssignStep`, `RouteStep`

The two `isAi` steps that render the shared `AiPanel` then reveal their result. Emergency accent is derived from provider data (no hardcoded names).

**Files:**
- Create: `src/demos/jobDispatch/steps/AssignStep.tsx`
- Create: `src/demos/jobDispatch/steps/RouteStep.tsx`

**Interfaces:**
- Consumes: `WorkflowProvider` (`./types`), `scriptedWorkflowProvider` methods `getJobs()`, `getAssignments()`, `getRoutes()`, `getAiReasoning("assign" | "route")`; shared `AiPanel` (`../../shared/AiPanel`) and `usePrefersReducedMotion` (`../../shared/usePrefersReducedMotion`); `jd-*` classes from Task 2.
- Produces: default-exported components `AssignStep` and `RouteStep`, each a `({ provider }: { provider: WorkflowProvider }) => JSX.Element`, consumed by `JobDispatchDemo.tsx` in Task 5.

- [ ] **Step 1: Create `steps/AssignStep.tsx`**

```tsx
import { useState } from "react";
import { FaArrowRight, FaExclamationTriangle } from "react-icons/fa";
import type { WorkflowProvider } from "../types";
import { usePrefersReducedMotion } from "../../shared/usePrefersReducedMotion";
import AiPanel from "../../shared/AiPanel";

const AssignStep = ({ provider }: { provider: WorkflowProvider }) => {
  const assignments = provider.getAssignments();
  const reasoning = provider.getAiReasoning("assign");
  const reduced = usePrefersReducedMotion();
  const [revealed, setRevealed] = useState(reduced);

  // Derive the emergency customer(s) from the raw queue — no hardcoded names.
  const emergencyCustomers = new Set(
    provider
      .getJobs()
      .filter((j) => j.priority === "emergency")
      .map((j) => j.customer),
  );

  return (
    <div className="jd-step">
      <h3 className="jd-heading">It matches every job to the right tech</h3>
      <p className="jd-sub">
        Claude reads each job's skill need, zone, and time window — bumps the
        burst pipe to the front — then matches it to the tech who fits, balancing
        the load so no van is overloaded.
      </p>

      <AiPanel
        title={reasoning.title}
        lines={reasoning.lines}
        onComplete={() => setRevealed(true)}
      />

      <div className={"jd-reveal" + (revealed ? " is-shown" : "")}>
        <div className="jd-assignments">
          {assignments.map((a) => {
            const emergency = emergencyCustomers.has(a.customer);
            return (
              <div
                key={a.jobLabel}
                className={"jd-assign-row" + (emergency ? " is-emergency" : "")}
              >
                <div className="jd-assign-match">
                  <span className="jd-assign-job">
                    {emergency && <FaExclamationTriangle aria-hidden="true" />}
                    {a.jobLabel}
                    <span className="jd-assign-customer">{a.customer}</span>
                  </span>
                  <FaArrowRight className="jd-assign-arrow" aria-hidden="true" />
                  <span className="jd-assign-tech">{a.techName}</span>
                </div>
                <p className="jd-assign-reason">{a.reason}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default AssignStep;
```

- [ ] **Step 2: Create `steps/RouteStep.tsx`**

```tsx
import { useState } from "react";
import { FaExclamationTriangle } from "react-icons/fa";
import type { WorkflowProvider } from "../types";
import { usePrefersReducedMotion } from "../../shared/usePrefersReducedMotion";
import AiPanel from "../../shared/AiPanel";

const RouteStep = ({ provider }: { provider: WorkflowProvider }) => {
  const routes = provider.getRoutes();
  const reasoning = provider.getAiReasoning("route");
  const reduced = usePrefersReducedMotion();
  const [revealed, setRevealed] = useState(reduced);

  // The emergency route is whichever tech got the emergency job — derived, not hardcoded.
  const emergencyCustomers = new Set(
    provider
      .getJobs()
      .filter((j) => j.priority === "emergency")
      .map((j) => j.customer),
  );
  const emergencyTech = provider
    .getAssignments()
    .find((a) => emergencyCustomers.has(a.customer))?.techName;

  return (
    <div className="jd-step">
      <h3 className="jd-heading">It routes each van to cut the drive</h3>
      <p className="jd-sub">
        Claude sequences each tech's stops into the tightest route that still
        honors every time window — and keeps the emergency locked as the first
        stop.
      </p>

      <AiPanel
        title={reasoning.title}
        lines={reasoning.lines}
        onComplete={() => setRevealed(true)}
      />

      <div className={"jd-reveal" + (revealed ? " is-shown" : "")}>
        <div className="jd-routes">
          {routes.map((r) => {
            const emergency = r.techName === emergencyTech;
            return (
              <div
                key={r.techName}
                className={"jd-route-card" + (emergency ? " is-emergency" : "")}
              >
                <div className="jd-route-head">
                  <span className="jd-route-tech">{r.techName}</span>
                  {emergency && (
                    <span className="jd-route-flag">
                      <FaExclamationTriangle aria-hidden="true" /> Emergency first
                    </span>
                  )}
                </div>
                <ol className="jd-route-stops">
                  {r.stops.map((s) => (
                    <li key={s} className="jd-route-stop">
                      {s}
                    </li>
                  ))}
                </ol>
                <p className="jd-route-note">{r.driveNote}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default RouteStep;
```

- [ ] **Step 3: Verify build**

Run: `npm run build`
Expected: PASS. (Components type-check against `WorkflowProvider`; not yet imported by the composition root.)

- [ ] **Step 4: Surface the commit command**

```bash
git add src/demos/jobDispatch/steps/AssignStep.tsx src/demos/jobDispatch/steps/RouteStep.tsx
git commit -m "feat(dispatch): add AI assign + route step components"
```

---

### Task 4: The four presentational step components — `Queue`, `Dispatch`, `Notify`, `Results`

The non-AI steps: the job board (step 1), the timed-reveal crew acceptance (step 4), the send-lifecycle notification (step 5), and the results tally (step 6).

**Files:**
- Create: `src/demos/jobDispatch/steps/QueueStep.tsx`
- Create: `src/demos/jobDispatch/steps/DispatchStep.tsx`
- Create: `src/demos/jobDispatch/steps/NotifyStep.tsx`
- Create: `src/demos/jobDispatch/steps/ResultsStep.tsx`

**Interfaces:**
- Consumes: `WorkflowProvider` (`./types`), provider methods `getBusiness()`, `getTechs()`, `getJobs()`, `getDispatch()`, `getNotify()`, `getResults()`; shared `usePrefersReducedMotion` and `useSendLifecycle`/`SendStatus` (`../../shared/SendLifecycleProvider`); `jd-*` classes from Task 2. `NotifyStep` requires a `SendLifecycleProvider` ancestor (provided by `JobDispatchDemo` in Task 5).
- Produces: default-exported `QueueStep`, `DispatchStep`, `NotifyStep`, `ResultsStep`, each `({ provider }: { provider: WorkflowProvider }) => JSX.Element`.

- [ ] **Step 1: Create `steps/QueueStep.tsx`**

```tsx
import { FaExclamationTriangle } from "react-icons/fa";
import type { WorkflowProvider } from "../types";

const QueueStep = ({ provider }: { provider: WorkflowProvider }) => {
  const business = provider.getBusiness();
  const techs = provider.getTechs();
  const jobs = provider.getJobs();

  return (
    <div className="jd-step">
      <h3 className="jd-heading">
        Eight jobs, four vans, one emergency — the morning pile
      </h3>
      <p className="jd-sub">
        {business.name} starts every day with a stack of unassigned jobs and a
        dispatcher playing Tetris — matching skills to jobs, protecting time
        windows, and squeezing in whatever just broke. Here's this morning's
        pile.
      </p>

      <div className="jd-techs">
        {techs.map((t) => (
          <div key={t.name} className="jd-tech-chip">
            <span className="jd-tech-name">{t.name}</span>
            <span className="jd-tech-specialty">{t.specialty}</span>
            <span className="jd-tech-zone">{t.zone}</span>
          </div>
        ))}
      </div>

      <div className="jd-jobs">
        {jobs.map((job) => {
          const emergency = job.priority === "emergency";
          return (
            <div
              key={job.customer}
              className={"jd-job-card" + (emergency ? " is-emergency" : "")}
            >
              <div className="jd-job-top">
                <span className="jd-job-customer">{job.customer}</span>
                <span
                  className={"jd-job-tag" + (emergency ? " is-emergency" : "")}
                >
                  {emergency && <FaExclamationTriangle aria-hidden="true" />}
                  {emergency ? "Emergency" : "Standard"}
                </span>
              </div>
              <span className="jd-job-type">{job.type}</span>
              <div className="jd-job-meta">
                <span className="jd-job-location">{job.location}</span>
                <span className="jd-job-window">{job.window}</span>
              </div>
            </div>
          );
        })}
      </div>

      <p className="jd-note">
        Dense and unsorted — an hour of the owner's morning, every morning.
      </p>
    </div>
  );
};

export default QueueStep;
```

- [ ] **Step 2: Create `steps/DispatchStep.tsx`**

```tsx
import { useEffect, useState } from "react";
import { FaTruck, FaCheckCircle } from "react-icons/fa";
import type { WorkflowProvider } from "../types";
import { usePrefersReducedMotion } from "../../shared/usePrefersReducedMotion";

const ACCEPT_DELAY_MS = 600;

const DispatchStep = ({ provider }: { provider: WorkflowProvider }) => {
  const dispatch = provider.getDispatch();
  const reduced = usePrefersReducedMotion();
  const total = dispatch.crew.length;
  const [accepted, setAccepted] = useState(reduced ? total : 0);

  useEffect(() => {
    if (reduced) {
      setAccepted(total);
      return;
    }
    setAccepted(0);
    const timers: number[] = [];
    for (let i = 1; i <= total; i++) {
      timers.push(
        window.setTimeout(() => setAccepted(i), ACCEPT_DELAY_MS * i),
      );
    }
    return () => timers.forEach((id) => window.clearTimeout(id));
  }, [reduced, total]);

  return (
    <div className="jd-step">
      <h3 className="jd-heading">It pushes every route to the crew</h3>
      <p className="jd-sub">
        Each tech gets their stops, addresses, and job notes on their phone — and
        taps to accept. No radio calls, no paper run sheets.
      </p>

      <div className="jd-dispatch">
        <div className="jd-dispatch-head">
          <FaTruck aria-hidden="true" /> {dispatch.headline}
        </div>
        <div className="jd-crew">
          {dispatch.crew.map((c, i) => {
            const isAccepted = i < accepted;
            return (
              <div
                key={c.techName}
                className={"jd-crew-row" + (isAccepted ? " is-accepted" : "")}
              >
                <span className="jd-crew-name">{c.techName}</span>
                <span className="jd-crew-stops">{c.stops}</span>
                <span className="jd-crew-status">
                  {isAccepted ? (
                    <>
                      <FaCheckCircle aria-hidden="true" /> Accepted
                    </>
                  ) : (
                    "Sending…"
                  )}
                </span>
              </div>
            );
          })}
        </div>
        <p className="jd-dispatch-note">{dispatch.note}</p>
      </div>
    </div>
  );
};

export default DispatchStep;
```

- [ ] **Step 3: Create `steps/NotifyStep.tsx`**

```tsx
import { useEffect, useRef } from "react";
import { FaPaperPlane, FaCheck, FaEnvelopeOpenText } from "react-icons/fa";
import type { WorkflowProvider } from "../types";
import {
  useSendLifecycle,
  type SendStatus,
} from "../../shared/SendLifecycleProvider";

const ORDER: SendStatus[] = ["sending", "delivered", "opened"];

function statusRank(s: SendStatus): number {
  if (s === "idle") return -1;
  if (s === "replied") return ORDER.length - 1;
  return ORDER.indexOf(s);
}

const NotifyStep = ({ provider }: { provider: WorkflowProvider }) => {
  const notify = provider.getNotify();
  const { status, start } = useSendLifecycle();
  const started = useRef(false);

  useEffect(() => {
    if (started.current) return;
    started.current = true;
    start();
  }, [start]);

  const rank = statusRank(status);
  const lifecycle = [
    { id: "sending", label: "Sending", icon: <FaPaperPlane /> },
    { id: "delivered", label: "Delivered", icon: <FaCheck /> },
    { id: "opened", label: "Read", icon: <FaEnvelopeOpenText /> },
  ];

  return (
    <div className="jd-step">
      <h3 className="jd-heading">
        Every customer gets an ETA — before the van pulls up
      </h3>
      <p className="jd-sub">
        The moment routes are set, each customer gets a text with who's coming
        and when. Here's the emergency going out to {notify.recipientName}.
      </p>

      <div className="jd-notify">
        <div className="jd-notify-meta">
          <span className="jd-notify-to">To {notify.recipientName}</span>
          <span className="jd-notify-channel">
            {notify.channel} · {notify.sentLabel}
          </span>
        </div>

        <p className="jd-notify-message">{notify.message}</p>

        <ol className="jd-lifecycle">
          {lifecycle.map((stage, i) => (
            <li
              key={stage.id}
              className={
                "jd-life" +
                (rank >= i ? " is-active" : "") +
                (rank > i ? " is-done" : "")
              }
            >
              <span className="jd-life-icon">{stage.icon}</span>
              <span className="jd-life-label">{stage.label}</span>
            </li>
          ))}
        </ol>

        {status === "opened" && (
          <p className="jd-notify-note">
            Read. {notify.recipientName} knows help is on the way — before
            anyone's even shown up.
          </p>
        )}
      </div>
    </div>
  );
};

export default NotifyStep;
```

- [ ] **Step 4: Create `steps/ResultsStep.tsx`**

```tsx
import type { WorkflowProvider } from "../types";

const ResultsStep = ({ provider }: { provider: WorkflowProvider }) => {
  const results = provider.getResults();
  const tally = [
    { num: String(results.jobsPlaced), label: "Jobs placed" },
    { num: results.driveTimeSaved, label: "Drive time saved", hl: true },
    { num: results.onTimeRate, label: "On-time arrival" },
    { num: results.dispatchTime, label: "Dispatch time" },
  ];

  return (
    <div className="jd-step">
      <h3 className="jd-heading">A full day, dispatched in under a minute</h3>
      <p className="jd-sub">
        Eight jobs matched, four vans routed, and every customer notified —
        before the dispatcher would've finished their first coffee.
      </p>

      <div className="jd-tally">
        {tally.map((t) => (
          <div
            key={t.label}
            className={"jd-tally-item" + (t.hl ? " jd-tally-item-hl" : "")}
          >
            <span className="jd-tally-num">{t.num}</span>
            <span className="jd-tally-label">{t.label}</span>
          </div>
        ))}
      </div>

      <p className="jd-takeaway">{results.takeaway}</p>
    </div>
  );
};

export default ResultsStep;
```

- [ ] **Step 5: Verify build**

Run: `npm run build`
Expected: PASS.

- [ ] **Step 6: Surface the commit command**

```bash
git add src/demos/jobDispatch/steps/QueueStep.tsx src/demos/jobDispatch/steps/DispatchStep.tsx src/demos/jobDispatch/steps/NotifyStep.tsx src/demos/jobDispatch/steps/ResultsStep.tsx
git commit -m "feat(dispatch): add queue, dispatch, notify, results step components"
```

---

### Task 5: Step registry + composition root — `steps.ts`, `JobDispatchDemo.tsx`

Wires the 6 step definitions and the composition root that assembles `DemoProvider → SendLifecycleProvider → DemoShell`. After this task the demo is a complete, renderable component (route wiring is Task 6).

**Files:**
- Create: `src/demos/jobDispatch/steps.ts`
- Create: `src/demos/jobDispatch/JobDispatchDemo.tsx`

**Interfaces:**
- Consumes: `DemoStep` (`../shared/types`); `react-icons/fa` icons; `DemoProvider` (`../shared/DemoController`), `SendLifecycleProvider` (`../shared/SendLifecycleProvider`), `DemoShell` (default, `../shared/DemoShell`); `scriptedWorkflowProvider` (`./provider`); the six step components from Tasks 3–4; `./dispatch.css`.
- Produces: `steps: DemoStep[]` (ids `queue`, `assign`, `route`, `dispatch`, `notify`, `results`; `assign`/`route` have `isAi: true`) and default-exported `JobDispatchDemo` — the component Task 6 routes to.

- [ ] **Step 1: Create `steps.ts`**

```ts
import {
  FaClipboardList,
  FaUserCheck,
  FaRoute,
  FaTruck,
  FaCommentDots,
  FaChartLine,
} from "react-icons/fa";
import type { DemoStep } from "../shared/types";

export const steps: DemoStep[] = [
  { id: "queue", label: "The morning job pile", Icon: FaClipboardList },
  { id: "assign", label: "Match jobs to techs", Icon: FaUserCheck, isAi: true },
  { id: "route", label: "Route each van", Icon: FaRoute, isAi: true },
  { id: "dispatch", label: "Push to the crew", Icon: FaTruck },
  { id: "notify", label: "Notify the customer", Icon: FaCommentDots },
  { id: "results", label: "Results", Icon: FaChartLine },
];
```

- [ ] **Step 2: Create `JobDispatchDemo.tsx`**

```tsx
import type { ReactNode } from "react";
import { DemoProvider } from "../shared/DemoController";
import { SendLifecycleProvider } from "../shared/SendLifecycleProvider";
import DemoShell from "../shared/DemoShell";
import { steps } from "./steps";
import { scriptedWorkflowProvider } from "./provider";
import QueueStep from "./steps/QueueStep";
import AssignStep from "./steps/AssignStep";
import RouteStep from "./steps/RouteStep";
import DispatchStep from "./steps/DispatchStep";
import NotifyStep from "./steps/NotifyStep";
import ResultsStep from "./steps/ResultsStep";
import "./dispatch.css";

const provider = scriptedWorkflowProvider;

function renderStage(stepId: string): ReactNode {
  switch (stepId) {
    case "queue":
      return <QueueStep provider={provider} />;
    case "assign":
      return <AssignStep provider={provider} />;
    case "route":
      return <RouteStep provider={provider} />;
    case "dispatch":
      return <DispatchStep provider={provider} />;
    case "notify":
      return <NotifyStep provider={provider} />;
    case "results":
      return <ResultsStep provider={provider} />;
    default:
      return null;
  }
}

const JobDispatchDemo = () => {
  const business = provider.getBusiness();
  return (
    <DemoProvider steps={steps}>
      <SendLifecycleProvider>
        <DemoShell
          eyebrow="Paradigm Shift — Automation Demo"
          title={`Job scheduling & dispatch for ${business.name}`}
          lede="A click-through of how a messy morning pile becomes an optimized dispatch board — every job matched to the right tech, every van routed to cut the drive, and every customer texted an ETA."
          renderStage={renderStage}
        />
      </SendLifecycleProvider>
    </DemoProvider>
  );
};

export default JobDispatchDemo;
```

- [ ] **Step 3: Verify build**

Run: `npm run build`
Expected: PASS. (`DemoShell` is a default export; `DemoShellProps` includes `lede` even though the shell doesn't render it — matches the onboarding demo exactly, so no type error.)

- [ ] **Step 4: Surface the commit command**

```bash
git add src/demos/jobDispatch/steps.ts src/demos/jobDispatch/JobDispatchDemo.tsx
git commit -m "feat(dispatch): compose job-dispatch demo shell and step registry"
```

---

### Task 6: Wire the route + example card, verify end-to-end

The two one-line edits that make the demo reachable, then the full smoke + lint gate.

**Files:**
- Modify: `src/App.tsx` (import + `/demos/dispatch` route, outside `Layout`)
- Modify: `src/components/AutomatedWorkflows.tsx:76-79` (add `to:` to the "Job Scheduling & Dispatch" example)

**Interfaces:**
- Consumes: `JobDispatchDemo` (default, `./demos/jobDispatch/JobDispatchDemo`).
- Produces: reachable route `/demos/dispatch`; the example card becomes a `<Link>` to it.

- [ ] **Step 1: Add the import to `src/App.tsx`**

After the existing `OnboardingDemo` import (line 13), add:

```tsx
import JobDispatchDemo from "./demos/jobDispatch/JobDispatchDemo";
```

- [ ] **Step 2: Add the route to `src/App.tsx`**

Immediately after the onboarding route (`<Route path="/demos/onboarding" element={<OnboardingDemo />} />`, line 51) and before the closing `</Routes>`, add:

```tsx
<Route path="/demos/dispatch" element={<JobDispatchDemo />} />
```

- [ ] **Step 3: Add the `to:` field in `src/components/AutomatedWorkflows.tsx`**

In the `examples` array, change the "Job Scheduling & Dispatch" entry (currently lines 75-79) from:

```tsx
  {
    icon: FaTruck,
    title: "Job Scheduling & Dispatch",
    description: "Right job, right person, customer notified",
  },
```

to:

```tsx
  {
    icon: FaTruck,
    title: "Job Scheduling & Dispatch",
    description: "Right job, right person, customer notified",
    to: "/demos/dispatch",
  },
```

- [ ] **Step 4: Verify build**

Run: `npm run build`
Expected: PASS — tsc + Vite, zero errors, no unused imports.

- [ ] **Step 5: Dev smoke**

Run: `npm run dev`, open `http://localhost:5173/demos/dispatch`. Confirm:
- 6 steps advance via both the flow rail and Next/Back.
- Step 1 (`queue`): 4 tech chips + 8 job cards render; Brennan's card and its tag show the red emergency accent; no horizontal scroll.
- Step 2 (`assign`): `AiPanel` plays "working… → done", then the assignment list reveals; the Brennan row carries the emergency accent.
- Step 3 (`route`): `AiPanel` plays, then the 4 route cards reveal; Priya's card shows the "Emergency first" flag.
- Step 4 (`dispatch`): the 4 crew rows flip from "Sending…" to "Accepted" one after another (~600 ms apart), each turning green.
- Step 5 (`notify`): the message bubble shows, and the send lifecycle animates Sending → Delivered → Read, ending at "Read" with the green note (no reply).
- Step 6 (`results`): the 4-item tally renders (drive-time saved highlighted) plus the takeaway.
- Restart demo returns to step 1 and re-arms the timed reveals.
- Then verify `http://localhost:5173/services/automated-workflows`: the "Job Scheduling & Dispatch" card is now a link and navigates to `/demos/dispatch`.
- Reduced-motion check (macOS System Settings → Accessibility → Display → Reduce motion, or emulate in devtools): AI panels, the crew acceptance, and the send lifecycle all show final content instantly.

- [ ] **Step 6: Lint gate**

Run: `npm run lint`
Expected: PASS — zero warnings.

- [ ] **Step 7: Surface the commit command**

```bash
git add src/App.tsx src/components/AutomatedWorkflows.tsx
git commit -m "feat(dispatch): wire /demos/dispatch route and example card"
```

---

## Self-Review

**1. Spec coverage** — every spec section maps to a task:
- Step flow (6 steps, 2 AI) → `steps.ts` (Task 5) + step components (Tasks 3–4).
- `WorkflowProvider` interface + supporting types → `types.ts` (Task 1).
- Mock data content sketch → `script.ts` (Task 1) — every value copied verbatim.
- Architecture (thin folder mirroring onboarding, no engine changes) → file structure + Global Constraints.
- Styling (`jd-*`, emergency red, tokens, responsive) → `dispatch.css` (Task 2).
- Wiring (route + card `to:`) → Task 6.
- Verification (build, dev smoke, lint) → Task 6 steps 4–6.
- Out of scope (no engine changes, presentational dispatch/notify, standalone data) → Global Constraints + task boundaries.

**2. Placeholder scan** — no TBD/TODO; every code step contains complete, runnable content; no "similar to Task N" references (each file is written out in full).

**3. Type consistency** — method names match across tasks: `getBusiness`, `getTechs`, `getJobs`, `getAssignments`, `getRoutes`, `getDispatch`, `getNotify`, `getResults`, `getAiReasoning` are identical in `types.ts` (Task 1), `provider.ts` (Task 1), and every consuming component (Tasks 3–5). `AiStep = "assign" | "route"` matches the `isAi` steps and both `getAiReasoning` calls. `Priority = "emergency" | "standard"` matches the job data and every emergency-derivation check. The reveal class `jd-reveal` / `.is-shown`, the send-lifecycle `jd-life` classes, and the tally `jd-tally-*` classes are defined in Task 2 and referenced unchanged in Tasks 3–4. Emergency is derived from `getJobs()` + `getAssignments()` in both AI steps — no hardcoded names.
