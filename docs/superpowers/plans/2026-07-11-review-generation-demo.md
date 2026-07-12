# Review Generation Demo Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

Spec: [[2026-07-11-review-generation-demo-design]]

**Goal:** Build the interactive Review Generation click-through demo on the shared demo engine, reachable at `/demos/review-generation`, and link it from its example card on the Automated Workflows page.

**Architecture:** A new thin demo folder `src/demos/reviewGeneration/` mirroring `missedCallTextBack/` — a `WorkflowProvider` interface + scripted mock data, six per-step components, one scoped CSS file, and a composition component wiring `DemoProvider → SendLifecycleProvider → DemoShell`. It shows a **sentiment branch** by carrying two client threads: a positive client (Jenna) as the spine and a negative client (Rachel) caught privately. No changes to the shared engine.

**Tech Stack:** React 18 + TypeScript, Vite 5, react-router-dom v6, react-icons/fa, vanilla CSS with custom properties.

## Global Constraints

- **No test framework exists** in this project. Per-task verification is `npm run build` (`tsc` + Vite) and, where UI is visible, a manual `npm run dev` smoke check; the final task also runs `npm run lint`.
- **`npm run lint` must pass with zero warnings** (`--max-warnings 0`). No unused imports or variables.
- **Git is read-only for the assistant** (per CLAUDE.md). Do NOT execute `git add`/`git commit`. Each task's commit step lists the exact command to **surface to Brian to run manually**.
- **Reuse the shared engine unchanged** — import from `src/demos/shared/` (`DemoProvider`, `SendLifecycleProvider`/`useSendLifecycle`, `DemoShell`, `AiPanel`, `usePrefersReducedMotion`, `DemoStep`). Do NOT modify any file under `src/demos/shared/`.
- **CSS conventions:** vanilla CSS, one `.css` file, class prefix `rg-*`. Use only the demo-scoped tokens defined on `.demo` in `DemoShell.css` (`--demo-bg`, `--demo-surface`, `--demo-surface-2`, `--demo-border`, `--demo-text`, `--demo-muted`, `--demo-accent`, `--demo-accent-bright`, `--demo-accent-glow`, `--demo-accent-deep`, `--demo-success`) plus the global `--spacing-xs|sm|md|lg|xl`. Do not reference `index.css` light-theme colors directly.
- **CTA** is supplied by `DemoShell` — do not add another booking CTA in the page body.
- **Demos are full-bleed** (no site `Header`/`Footer`): the route goes **outside** the `Layout` route in `App.tsx`.
- **Scripted only** — no real review-platform/SMS integration. All content is static mock data in `script.ts`.
- **All `react-icons/fa` icon names below are verified to exist** (`FaSpa`, `FaSms`, `FaCodeBranch`, `FaStar`, `FaShieldAlt`, `FaChartLine`, `FaPaperPlane`, `FaCheck`, `FaThumbsUp`, `FaGoogle`, `FaCheckCircle`, `FaLock`, `FaBell`, `FaExclamationTriangle`). Do not substitute other names.

---

## File Structure

**Created**
- `src/demos/reviewGeneration/types.ts` — `WorkflowProvider` interface + data types.
- `src/demos/reviewGeneration/script.ts` — all mock data.
- `src/demos/reviewGeneration/provider.ts` — `scriptedWorkflowProvider`.
- `src/demos/reviewGeneration/steps.ts` — the 6 `DemoStep`s.
- `src/demos/reviewGeneration/reviews.css` — scoped `rg-*` styles.
- `src/demos/reviewGeneration/steps/AppointmentStep.tsx`
- `src/demos/reviewGeneration/steps/RequestStep.tsx`
- `src/demos/reviewGeneration/steps/RouteStep.tsx`
- `src/demos/reviewGeneration/steps/GoogleStep.tsx`
- `src/demos/reviewGeneration/steps/CaughtStep.tsx`
- `src/demos/reviewGeneration/steps/ResultsStep.tsx`
- `src/demos/reviewGeneration/ReviewGenerationDemo.tsx` — composition.

**Modified**
- `src/App.tsx` — add the full-bleed route (Task 2).
- `src/components/AutomatedWorkflows.tsx` — set `to` on the Review Generation example card (Task 3).

---

## Task 1: Data layer (types, script, provider)

Establishes the demo's data contract and mock content. Independently verifiable via `npm run build`; no UI yet. Mirrors the missed-call demo's `types.ts`/`script.ts`/`provider.ts` split.

**Files:**
- Create: `src/demos/reviewGeneration/types.ts`
- Create: `src/demos/reviewGeneration/script.ts`
- Create: `src/demos/reviewGeneration/provider.ts`

**Interfaces:**
- Consumes: nothing from other tasks.
- Produces: the `WorkflowProvider` interface and all data types (below); `scriptedWorkflowProvider: WorkflowProvider`. Every step component in Task 2 imports `WorkflowProvider` from `./types` and receives `scriptedWorkflowProvider` as its `provider` prop. Accessor set: `getBusiness()`, `getAppointment()`, `getRequest()`, `getReply(kind: ReplyKind)`, `getRouting(kind: ReplyKind)`, `getGoogleReview()`, `getPrivateCatch()`, `getResults()`, `getAiReasoning(step: AiStep)`. `ReplyKind = "happy" | "unhappy"`, `AiStep = "route" | "draft"`, `Sentiment = "positive" | "negative"`.

- [ ] **Step 1: Create `src/demos/reviewGeneration/types.ts`**

```ts
export interface Business {
  name: string;
  category: string;
  ratingContext: string;
}

export interface Appointment {
  client: string;
  service: string;
  provider: string;
  timeLabel: string;
}

export interface ReviewRequest {
  body: string;
  delayLabel: string;
}

export type Sentiment = "positive" | "negative";
export type ReplyKind = "happy" | "unhappy";

export interface ClientReply {
  kind: ReplyKind;
  name: string;
  service: string;
  body: string;
  sentiment: Sentiment;
  receivedLabel: string;
}

export interface Routing {
  kind: ReplyKind;
  sentiment: Sentiment;
  decision: string;
  destination: string;
}

export interface GoogleReview {
  clientName: string;
  stars: number;
  suggestedBody: string;
}

export interface PrivateCatch {
  clientName: string;
  concern: string;
  ownerAction: string;
  alertLines: string[];
}

export interface ResultsSummary {
  requestsSent: number;
  reviewsGained: number;
  ratingBefore: string;
  ratingAfter: string;
  intercepted: number;
  takeaway: string;
}

export type AiStep = "route" | "draft";

export interface AiReasoning {
  step: AiStep;
  title: string;
  lines: string[];
}

export interface WorkflowProvider {
  getBusiness(): Business;
  getAppointment(): Appointment;
  getRequest(): ReviewRequest;
  getReply(kind: ReplyKind): ClientReply;
  getRouting(kind: ReplyKind): Routing;
  getGoogleReview(): GoogleReview;
  getPrivateCatch(): PrivateCatch;
  getResults(): ResultsSummary;
  getAiReasoning(step: AiStep): AiReasoning;
}
```

- [ ] **Step 2: Create `src/demos/reviewGeneration/script.ts`**

```ts
import type {
  Business,
  Appointment,
  ReviewRequest,
  ClientReply,
  Routing,
  GoogleReview,
  PrivateCatch,
  ResultsSummary,
  ReplyKind,
  AiStep,
  AiReasoning,
} from "./types";

export const business: Business = {
  name: "Lumière Med Spa",
  category: "Aesthetics & skincare",
  ratingContext: "4.6★ on Google — and new bookings track that rating",
};

export const appointment: Appointment = {
  client: "Jenna Alvarez",
  service: "HydraFacial",
  provider: "Maya",
  timeLabel: "Today 1:30 PM",
};

export const request: ReviewRequest = {
  body: "Hi Jenna! It was so lovely seeing you at Lumière today 💛 How was your visit?",
  delayLabel: "~2 hours later",
};

export const replies: Record<ReplyKind, ClientReply> = {
  happy: {
    kind: "happy",
    name: "Jenna Alvarez",
    service: "HydraFacial",
    body: "Obsessed!! My skin is glowing and Maya was amazing 🤍",
    sentiment: "positive",
    receivedLabel: "Replied 2h later",
  },
  unhappy: {
    kind: "unhappy",
    name: "Rachel K.",
    service: "Dermal filler",
    body: "It was fine. Front desk kept me waiting like 25 min though.",
    sentiment: "negative",
    receivedLabel: "Replied 40m later",
  },
};

export const routing: Record<ReplyKind, Routing> = {
  happy: {
    kind: "happy",
    sentiment: "positive",
    decision: "Delighted client — invite her to leave a public Google review",
    destination: "Google review (one-tap link)",
  },
  unhappy: {
    kind: "unhappy",
    sentiment: "negative",
    decision: "Not happy — keep this private and make it right, don't ask for a public review",
    destination: "Private feedback + owner alert",
  },
};

export const googleReview: GoogleReview = {
  clientName: "Jenna Alvarez",
  stars: 5,
  suggestedBody:
    "Had the best HydraFacial with Maya at Lumière — my skin has never looked this good. Warm team, spotless space, and I already booked my next visit. Highly recommend!",
};

export const privateCatch: PrivateCatch = {
  clientName: "Rachel K.",
  concern: "Long front-desk wait (~25 min)",
  ownerAction: "Owner reaches out personally to apologize and comp her next visit",
  alertLines: [
    "Rachel K. wasn't fully happy today",
    "Issue: ~25-min front-desk wait",
    "She was NOT asked for a public review",
    "Suggested: personal text + a comp to make it right",
  ],
};

export const results: ResultsSummary = {
  requestsSent: 42,
  reviewsGained: 27,
  ratingBefore: "4.6",
  ratingAfter: "4.8",
  intercepted: 5,
  takeaway:
    "27 fresh 5-star reviews in a month and the rating up to 4.8 — plus 5 unhappy clients handled privately instead of becoming public 1-stars.",
};

export const aiReasoning: Record<AiStep, AiReasoning> = {
  route: {
    step: "route",
    title: "Claude — reading the reply",
    lines: [
      "Reading Jenna's reply for tone and specifics.",
      "Sentiment: clearly positive — 'obsessed', 'glowing', names her provider.",
      "Rule: only genuinely delighted clients get pushed to a public review.",
      "Routing Jenna to a one-tap Google review.",
      "(A lukewarm or negative reply takes the other branch — caught privately.)",
    ],
  },
  draft: {
    step: "draft",
    title: "Claude — drafting the review",
    lines: [
      "Writing a short review in Jenna's own voice — not a template.",
      "Working in the specifics she mentioned: HydraFacial, Maya, glowing skin.",
      "Keeping it honest and natural, no exaggeration.",
      "Attaching a one-tap link so posting takes five seconds.",
    ],
  },
};
```

- [ ] **Step 3: Create `src/demos/reviewGeneration/provider.ts`**

```ts
import type {
  Business,
  Appointment,
  ReviewRequest,
  ClientReply,
  Routing,
  GoogleReview,
  PrivateCatch,
  ResultsSummary,
  ReplyKind,
  AiStep,
  AiReasoning,
  WorkflowProvider,
} from "./types";
import {
  business,
  appointment,
  request,
  replies,
  routing,
  googleReview,
  privateCatch,
  results,
  aiReasoning,
} from "./script";

class ScriptedWorkflowProvider implements WorkflowProvider {
  getBusiness(): Business {
    return business;
  }

  getAppointment(): Appointment {
    return appointment;
  }

  getRequest(): ReviewRequest {
    return request;
  }

  getReply(kind: ReplyKind): ClientReply {
    return replies[kind];
  }

  getRouting(kind: ReplyKind): Routing {
    return routing[kind];
  }

  getGoogleReview(): GoogleReview {
    return googleReview;
  }

  getPrivateCatch(): PrivateCatch {
    return privateCatch;
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

- [ ] **Step 4: Build**

Run: `npm run build`
Expected: `tsc` + Vite build succeed with no TypeScript errors. (The new files are not imported yet — expected; `tsc` still type-checks them and `npm run build` does not run ESLint.)

- [ ] **Step 5: Commit (surface command to Brian)**

```bash
git add src/demos/reviewGeneration/types.ts src/demos/reviewGeneration/script.ts src/demos/reviewGeneration/provider.ts
git commit -m "feat: add review generation demo data layer"
```

---

## Task 2: Steps, styles, composition, and route

Builds all six step components, the scoped CSS, the step list, and the composition component, then wires the full-bleed route so the demo is reachable at `/demos/review-generation`. Not yet linked from the Automated Workflows page (Task 3), so it can be reviewed in isolation by typing the URL.

**Files:**
- Create: `src/demos/reviewGeneration/steps.ts`
- Create: `src/demos/reviewGeneration/reviews.css`
- Create: `src/demos/reviewGeneration/steps/AppointmentStep.tsx`
- Create: `src/demos/reviewGeneration/steps/RequestStep.tsx`
- Create: `src/demos/reviewGeneration/steps/RouteStep.tsx`
- Create: `src/demos/reviewGeneration/steps/GoogleStep.tsx`
- Create: `src/demos/reviewGeneration/steps/CaughtStep.tsx`
- Create: `src/demos/reviewGeneration/steps/ResultsStep.tsx`
- Create: `src/demos/reviewGeneration/ReviewGenerationDemo.tsx`
- Modify: `src/App.tsx`

**Interfaces:**
- Consumes: `scriptedWorkflowProvider` and the `WorkflowProvider` type from Task 1; shared `DemoProvider`, `SendLifecycleProvider`/`useSendLifecycle`/`SendStatus`, `DemoShell`, `AiPanel`, `usePrefersReducedMotion`, and the `DemoStep` type.
- Produces: default export `ReviewGenerationDemo` (React component, no props), imported by `App.tsx`. Each step component is a default export taking `{ provider }: { provider: WorkflowProvider }`.

- [ ] **Step 1: Create `src/demos/reviewGeneration/steps.ts`**

```ts
import {
  FaSpa,
  FaSms,
  FaCodeBranch,
  FaStar,
  FaShieldAlt,
  FaChartLine,
} from "react-icons/fa";
import type { DemoStep } from "../shared/types";

export const steps: DemoStep[] = [
  { id: "appointment", label: "Appointment done", Icon: FaSpa },
  { id: "request", label: "Request the review", Icon: FaSms },
  { id: "route", label: "Read & route", Icon: FaCodeBranch, isAi: true },
  { id: "google", label: "Happy → Google", Icon: FaStar, isAi: true },
  { id: "caught", label: "Unhappy → caught", Icon: FaShieldAlt },
  { id: "results", label: "Results", Icon: FaChartLine },
];
```

- [ ] **Step 2: Create `src/demos/reviewGeneration/reviews.css`**

```css
.rg-step {
  color: var(--demo-text);
}

.rg-heading {
  font-size: 1.15rem;
  margin: 0 0 var(--spacing-xs);
}

.rg-sub {
  color: var(--demo-muted);
  margin: 0 0 var(--spacing-md);
  max-width: 60ch;
}

.rg-note {
  color: var(--demo-muted);
  font-size: 0.85rem;
  margin: var(--spacing-md) 0 0;
}

/* Appointment trigger card */
.rg-appt {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-md);
  background: var(--demo-surface-2);
  border: 1px solid var(--demo-border);
  border-left: 3px solid var(--demo-accent-bright);
  border-radius: 0.6rem;
}
.rg-appt-icon {
  font-size: 1.6rem;
  color: var(--demo-accent-bright);
}
.rg-appt-body {
  flex: 1 1 auto;
  min-width: 0;
}
.rg-appt-name {
  font-weight: 700;
  margin: 0;
}
.rg-appt-service {
  color: var(--demo-muted);
  margin: 0.1rem 0 0;
  font-size: 0.9rem;
}
.rg-appt-meta {
  color: var(--demo-muted);
  font-size: 0.8rem;
  margin: 0.25rem 0 0;
}
.rg-appt-tag {
  align-self: flex-start;
  padding: 0.2rem 0.6rem;
  border-radius: 999px;
  background: rgba(16, 185, 129, 0.14);
  color: var(--demo-success);
  font-size: 0.72rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

/* SMS bubbles + send lifecycle (request step) */
.rg-outbox {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}
.rg-bubble {
  max-width: 80%;
  padding: 0.7rem 0.95rem;
  border-radius: 1rem;
  line-height: 1.5;
}
.rg-bubble-body {
  margin: 0;
}
.rg-bubble-business {
  align-self: flex-start;
  background: var(--demo-surface-2);
  border: 1px solid var(--demo-border);
  border-bottom-left-radius: 0.3rem;
}
.rg-bubble-caller {
  align-self: flex-end;
  background: var(--demo-accent);
  color: #fff;
  border-bottom-right-radius: 0.3rem;
}
.rg-stages {
  list-style: none;
  display: flex;
  gap: var(--spacing-sm);
  padding: 0;
  margin: 0;
}
.rg-stage {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.35rem;
  padding: var(--spacing-sm);
  border: 1px solid var(--demo-border);
  border-radius: 0.6rem;
  color: var(--demo-muted);
  opacity: 0.5;
  transition: all 0.3s ease;
}
.rg-stage.is-active {
  opacity: 1;
  color: var(--demo-text);
  border-color: var(--demo-accent-bright);
}
.rg-stage.is-done {
  color: var(--demo-accent-bright);
}
.rg-stage-icon {
  font-size: 1.2rem;
}
.rg-stage-label {
  font-size: 0.8rem;
}
.rg-done-note {
  color: var(--demo-muted);
  font-size: 0.9rem;
  margin: 0;
}

/* Client reply thread (route + caught steps) */
.rg-thread {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
  margin-bottom: var(--spacing-md);
}
.rg-turn {
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
  align-items: flex-end;
}
.rg-turn-time {
  font-size: 0.7rem;
  color: var(--demo-muted);
  padding: 0 0.3rem;
}

/* Reveal wrapper */
.rg-reveal {
  opacity: 0;
  transform: translateY(6px);
  transition: opacity 0.4s ease, transform 0.4s ease;
  margin-top: var(--spacing-md);
}
.rg-reveal.is-shown {
  opacity: 1;
  transform: none;
}

/* Sentiment routing card */
.rg-route {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  flex-wrap: wrap;
  padding: var(--spacing-md);
  border: 1px solid var(--demo-border);
  border-radius: 0.6rem;
  background: var(--demo-surface-2);
}
.rg-route-positive {
  border-left: 3px solid var(--demo-success);
}
.rg-route-negative {
  border-left: 3px solid #f4b740;
}
.rg-route-sentiment {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.3rem 0.7rem;
  border-radius: 999px;
  font-weight: 700;
  font-size: 0.8rem;
  white-space: nowrap;
}
.rg-route-positive .rg-route-sentiment {
  background: rgba(16, 185, 129, 0.14);
  color: var(--demo-success);
}
.rg-route-negative .rg-route-sentiment {
  background: rgba(244, 183, 64, 0.14);
  color: #f4b740;
}
.rg-route-sentiment-icon {
  font-size: 0.85rem;
}
.rg-route-arrow {
  color: var(--demo-muted);
  font-weight: 700;
}
.rg-route-decision {
  flex: 1 1 220px;
  min-width: 0;
}
.rg-route-dest {
  font-weight: 600;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 0.35rem;
}
.rg-route-lock {
  color: #f4b740;
  font-size: 0.85rem;
}
.rg-route-note {
  color: var(--demo-muted);
  font-size: 0.85rem;
  margin: 0.2rem 0 0;
}

/* Google review card */
.rg-review {
  padding: var(--spacing-md);
  background: var(--demo-surface-2);
  border: 1px solid var(--demo-border);
  border-radius: 0.6rem;
}
.rg-review-head {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  margin-bottom: var(--spacing-sm);
}
.rg-review-google {
  color: var(--demo-accent-bright);
  font-size: 1.2rem;
}
.rg-review-on {
  font-size: 0.78rem;
  color: var(--demo-muted);
  text-transform: uppercase;
  letter-spacing: 0.04em;
  font-weight: 600;
}
.rg-review-badge {
  margin-left: auto;
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  font-size: 0.75rem;
  font-weight: 700;
  color: var(--demo-success);
}
.rg-review-stars {
  display: flex;
  gap: 0.2rem;
  margin-bottom: var(--spacing-sm);
}
.rg-review-star {
  color: #f5b301;
  font-size: 1.1rem;
}
.rg-review-body {
  margin: 0 0 var(--spacing-sm);
  line-height: 1.6;
}
.rg-review-author {
  margin: 0;
  color: var(--demo-muted);
  font-weight: 600;
}

/* Private-catch card */
.rg-catch {
  display: flex;
  align-items: flex-start;
  gap: var(--spacing-sm);
  margin-top: var(--spacing-md);
  padding: var(--spacing-md);
  background: rgba(16, 185, 129, 0.1);
  border: 1px solid var(--demo-success);
  border-radius: 0.6rem;
}
.rg-catch-icon {
  color: var(--demo-success);
  font-size: 1.5rem;
  margin-top: 0.1rem;
}
.rg-catch-title {
  font-weight: 700;
  margin: 0;
}
.rg-catch-meta {
  color: var(--demo-muted);
  margin: 0.15rem 0 0;
}
.rg-catch-action {
  margin: 0.4rem 0 0;
  font-size: 0.9rem;
}

/* Owner alert phone card */
.rg-phone {
  display: flex;
  justify-content: center;
  margin-top: var(--spacing-md);
}
.rg-push {
  width: 100%;
  max-width: 380px;
  padding: var(--spacing-md);
  background: var(--demo-surface-2);
  border: 1px solid var(--demo-border);
  border-radius: 0.9rem;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.35);
}
.rg-push-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: var(--spacing-sm);
}
.rg-push-app {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.78rem;
  font-weight: 600;
  color: var(--demo-muted);
  text-transform: uppercase;
  letter-spacing: 0.04em;
}
.rg-push-app-icon {
  color: var(--demo-accent-bright);
}
.rg-push-now {
  font-size: 0.75rem;
  color: var(--demo-muted);
}
.rg-push-title {
  font-weight: 700;
  font-size: 1.05rem;
  margin: 0 0 var(--spacing-xs);
}
.rg-push-lines {
  margin: 0;
  padding-left: 1.1rem;
  color: var(--demo-text);
}
.rg-push-lines li {
  margin: 0.15rem 0;
}

/* Results tally + rating lift */
.rg-tally {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: var(--spacing-sm);
  margin-bottom: var(--spacing-md);
}
.rg-tally-item {
  padding: var(--spacing-md);
  text-align: center;
  background: var(--demo-surface-2);
  border: 1px solid var(--demo-border);
  border-radius: 0.6rem;
}
.rg-tally-item-hl {
  border-color: var(--demo-accent-bright);
  box-shadow: 0 0 16px var(--demo-accent-glow);
}
.rg-tally-num {
  display: block;
  font-size: 1.8rem;
  font-weight: 700;
  color: var(--demo-accent-bright);
}
.rg-tally-label {
  color: var(--demo-muted);
  font-size: 0.85rem;
}
.rg-rating {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  flex-wrap: wrap;
  margin-bottom: var(--spacing-md);
  padding: var(--spacing-md);
  background: var(--demo-surface-2);
  border: 1px solid var(--demo-border);
  border-radius: 0.6rem;
}
.rg-rating-before {
  font-size: 1.4rem;
  font-weight: 700;
  color: var(--demo-muted);
}
.rg-rating-arrow {
  color: var(--demo-muted);
  font-weight: 700;
}
.rg-rating-after {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 1.8rem;
  font-weight: 800;
  color: var(--demo-success);
}
.rg-rating-star {
  color: #f5b301;
  font-size: 1.3rem;
}
.rg-rating-caption {
  color: var(--demo-muted);
  font-size: 0.85rem;
  margin-left: auto;
}
.rg-takeaway {
  color: var(--demo-muted);
  max-width: 60ch;
  margin: 0;
}

@media (max-width: 600px) {
  .rg-stages {
    flex-direction: column;
  }
  .rg-bubble {
    max-width: 100%;
  }
  .rg-rating-caption {
    margin-left: 0;
  }
}
```

- [ ] **Step 3: Create `src/demos/reviewGeneration/steps/AppointmentStep.tsx`**

```tsx
import { FaSpa } from "react-icons/fa";
import type { WorkflowProvider } from "../types";

const AppointmentStep = ({ provider }: { provider: WorkflowProvider }) => {
  const business = provider.getBusiness();
  const appt = provider.getAppointment();

  return (
    <div className="rg-step">
      <h3 className="rg-heading">A great visit just wrapped</h3>
      <p className="rg-sub">
        {business.name} — {business.ratingContext}. Every happy client who walks
        out is a review waiting to happen. Here's one.
      </p>

      <div className="rg-appt">
        <div className="rg-appt-icon">
          <FaSpa />
        </div>
        <div className="rg-appt-body">
          <p className="rg-appt-name">{appt.client}</p>
          <p className="rg-appt-service">
            {appt.service} · with {appt.provider}
          </p>
          <p className="rg-appt-meta">{appt.timeLabel} · visit complete</p>
        </div>
        <span className="rg-appt-tag">Done</span>
      </div>

      <p className="rg-note">
        Most happy clients never leave a review — not because they won't, but
        because no one asked at the right moment.
      </p>
    </div>
  );
};

export default AppointmentStep;
```

- [ ] **Step 4: Create `src/demos/reviewGeneration/steps/RequestStep.tsx`**

```tsx
import { useEffect, useRef } from "react";
import { FaPaperPlane, FaCheck, FaSms } from "react-icons/fa";
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

const RequestStep = ({ provider }: { provider: WorkflowProvider }) => {
  const request = provider.getRequest();
  const appt = provider.getAppointment();
  const { status, start } = useSendLifecycle();
  const started = useRef(false);

  useEffect(() => {
    if (started.current) return;
    started.current = true;
    start();
  }, [start]);

  const rank = statusRank(status);
  const stages = [
    { id: "sending", label: "Sending", icon: <FaPaperPlane /> },
    { id: "delivered", label: "Delivered", icon: <FaCheck /> },
    { id: "opened", label: "Read", icon: <FaSms /> },
  ];

  return (
    <div className="rg-step">
      <h3 className="rg-heading">A warm, well-timed ask — automatically</h3>
      <p className="rg-sub">
        {request.delayLabel}, {appt.client} gets a friendly text. No pushy
        "leave us 5 stars" — just a real question.
      </p>

      <div className="rg-outbox">
        <div className="rg-bubble rg-bubble-business">
          <p className="rg-bubble-body">{request.body}</p>
        </div>

        <ol className="rg-stages">
          {stages.map((stage, i) => (
            <li
              key={stage.id}
              className={
                "rg-stage" +
                (rank >= i ? " is-active" : "") +
                (rank > i ? " is-done" : "")
              }
            >
              <span className="rg-stage-icon">{stage.icon}</span>
              <span className="rg-stage-label">{stage.label}</span>
            </li>
          ))}
        </ol>

        {status === "opened" && (
          <p className="rg-done-note">
            Read. Now the important part — what she says next decides what
            happens.
          </p>
        )}
      </div>
    </div>
  );
};

export default RequestStep;
```

- [ ] **Step 5: Create `src/demos/reviewGeneration/steps/RouteStep.tsx`**

```tsx
import { useState } from "react";
import { FaThumbsUp } from "react-icons/fa";
import type { WorkflowProvider } from "../types";
import { usePrefersReducedMotion } from "../../shared/usePrefersReducedMotion";
import AiPanel from "../../shared/AiPanel";

const RouteStep = ({ provider }: { provider: WorkflowProvider }) => {
  const reply = provider.getReply("happy");
  const routing = provider.getRouting("happy");
  const reasoning = provider.getAiReasoning("route");
  const reduced = usePrefersReducedMotion();
  const [revealed, setRevealed] = useState(reduced);

  return (
    <div className="rg-step">
      <h3 className="rg-heading">It reads the reply — and picks a path</h3>
      <p className="rg-sub">
        Claude doesn't blast everyone to Google. It reads what the client
        actually said and routes on sentiment.
      </p>

      <div className="rg-thread">
        <div className="rg-turn">
          <div className="rg-bubble rg-bubble-caller">
            <p className="rg-bubble-body">{reply.body}</p>
          </div>
          <span className="rg-turn-time">
            {reply.name} · {reply.receivedLabel}
          </span>
        </div>
      </div>

      <AiPanel
        title={reasoning.title}
        lines={reasoning.lines}
        onComplete={() => setRevealed(true)}
      />

      <div className={"rg-reveal" + (revealed ? " is-shown" : "")}>
        <div className="rg-route rg-route-positive">
          <span className="rg-route-sentiment">
            <FaThumbsUp className="rg-route-sentiment-icon" />
            Positive
          </span>
          <span className="rg-route-arrow">→</span>
          <div className="rg-route-decision">
            <p className="rg-route-dest">{routing.destination}</p>
            <p className="rg-route-note">{routing.decision}</p>
          </div>
        </div>
        <p className="rg-note">
          A lukewarm or negative reply takes the other branch — you'll see that
          in a couple of steps.
        </p>
      </div>
    </div>
  );
};

export default RouteStep;
```

- [ ] **Step 6: Create `src/demos/reviewGeneration/steps/GoogleStep.tsx`**

```tsx
import { useState } from "react";
import { FaStar, FaGoogle, FaCheckCircle } from "react-icons/fa";
import type { WorkflowProvider } from "../types";
import { usePrefersReducedMotion } from "../../shared/usePrefersReducedMotion";
import AiPanel from "../../shared/AiPanel";

const GoogleStep = ({ provider }: { provider: WorkflowProvider }) => {
  const review = provider.getGoogleReview();
  const reasoning = provider.getAiReasoning("draft");
  const reduced = usePrefersReducedMotion();
  const [revealed, setRevealed] = useState(reduced);

  const firstName = review.clientName.split(" ")[0];
  const stars = Array.from({ length: review.stars }, (_, i) => i);

  return (
    <div className="rg-step">
      <h3 className="rg-heading">One tap to a public 5-star review</h3>
      <p className="rg-sub">
        Claude drafts the review in {firstName}'s voice and sends a one-tap
        link. She just taps post.
      </p>

      <AiPanel
        title={reasoning.title}
        lines={reasoning.lines}
        onComplete={() => setRevealed(true)}
      />

      <div className={"rg-reveal" + (revealed ? " is-shown" : "")}>
        <div className="rg-review">
          <div className="rg-review-head">
            <FaGoogle className="rg-review-google" />
            <span className="rg-review-on">Posted to Google</span>
            <span className="rg-review-badge">
              <FaCheckCircle /> Live
            </span>
          </div>
          <div className="rg-review-stars">
            {stars.map((i) => (
              <FaStar key={i} className="rg-review-star" />
            ))}
          </div>
          <p className="rg-review-body">"{review.suggestedBody}"</p>
          <p className="rg-review-author">— {review.clientName}</p>
        </div>
      </div>
    </div>
  );
};

export default GoogleStep;
```

- [ ] **Step 7: Create `src/demos/reviewGeneration/steps/CaughtStep.tsx`**

```tsx
import {
  FaShieldAlt,
  FaLock,
  FaBell,
  FaExclamationTriangle,
} from "react-icons/fa";
import type { WorkflowProvider } from "../types";

const CaughtStep = ({ provider }: { provider: WorkflowProvider }) => {
  const reply = provider.getReply("unhappy");
  const routing = provider.getRouting("unhappy");
  const privateCatch = provider.getPrivateCatch();
  const business = provider.getBusiness();

  return (
    <div className="rg-step">
      <h3 className="rg-heading">The other branch: caught before it goes public</h3>
      <p className="rg-sub">
        Not everyone leaves happy. When the reply isn't positive, the automation
        does the opposite of asking for a review — it protects your rating.
      </p>

      <div className="rg-thread">
        <div className="rg-turn">
          <div className="rg-bubble rg-bubble-caller">
            <p className="rg-bubble-body">{reply.body}</p>
          </div>
          <span className="rg-turn-time">
            {reply.name} · {reply.receivedLabel}
          </span>
        </div>
      </div>

      <div className="rg-route rg-route-negative">
        <span className="rg-route-sentiment">
          <FaExclamationTriangle className="rg-route-sentiment-icon" />
          Negative
        </span>
        <span className="rg-route-arrow">→</span>
        <div className="rg-route-decision">
          <p className="rg-route-dest">
            <FaLock className="rg-route-lock" />
            {routing.destination}
          </p>
          <p className="rg-route-note">{routing.decision}</p>
        </div>
      </div>

      <div className="rg-catch">
        <FaShieldAlt className="rg-catch-icon" />
        <div>
          <p className="rg-catch-title">Kept off Google — handled privately</p>
          <p className="rg-catch-meta">{privateCatch.concern}</p>
          <p className="rg-catch-action">{privateCatch.ownerAction}</p>
        </div>
      </div>

      <div className="rg-phone">
        <div className="rg-push">
          <div className="rg-push-head">
            <span className="rg-push-app">
              <FaBell className="rg-push-app-icon" />
              {business.name}
            </span>
            <span className="rg-push-now">now</span>
          </div>
          <p className="rg-push-title">Client needs a personal touch</p>
          <ul className="rg-push-lines">
            {privateCatch.alertLines.map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default CaughtStep;
```

- [ ] **Step 8: Create `src/demos/reviewGeneration/steps/ResultsStep.tsx`**

```tsx
import { FaStar } from "react-icons/fa";
import type { WorkflowProvider } from "../types";

const ResultsStep = ({ provider }: { provider: WorkflowProvider }) => {
  const results = provider.getResults();
  const tally = [
    { num: results.requestsSent, label: "Requests sent" },
    { num: results.reviewsGained, label: "New 5★ reviews", hl: true },
    { num: results.intercepted, label: "Caught privately" },
  ];

  return (
    <div className="rg-step">
      <h3 className="rg-heading">One month, on autopilot</h3>
      <p className="rg-sub">
        Every completed visit asked, every reply read and routed.
      </p>

      <div className="rg-tally">
        {tally.map((t) => (
          <div
            key={t.label}
            className={"rg-tally-item" + (t.hl ? " rg-tally-item-hl" : "")}
          >
            <span className="rg-tally-num">{t.num}</span>
            <span className="rg-tally-label">{t.label}</span>
          </div>
        ))}
      </div>

      <div className="rg-rating">
        <span className="rg-rating-before">{results.ratingBefore}★</span>
        <span className="rg-rating-arrow">→</span>
        <span className="rg-rating-after">
          <FaStar className="rg-rating-star" />
          {results.ratingAfter}
        </span>
        <span className="rg-rating-caption">Google rating</span>
      </div>

      <p className="rg-takeaway">{results.takeaway}</p>
    </div>
  );
};

export default ResultsStep;
```

- [ ] **Step 9: Create `src/demos/reviewGeneration/ReviewGenerationDemo.tsx`**

```tsx
import type { ReactNode } from "react";
import { DemoProvider } from "../shared/DemoController";
import { SendLifecycleProvider } from "../shared/SendLifecycleProvider";
import DemoShell from "../shared/DemoShell";
import { steps } from "./steps";
import { scriptedWorkflowProvider } from "./provider";
import AppointmentStep from "./steps/AppointmentStep";
import RequestStep from "./steps/RequestStep";
import RouteStep from "./steps/RouteStep";
import GoogleStep from "./steps/GoogleStep";
import CaughtStep from "./steps/CaughtStep";
import ResultsStep from "./steps/ResultsStep";
import "./reviews.css";

const provider = scriptedWorkflowProvider;

function renderStage(stepId: string): ReactNode {
  switch (stepId) {
    case "appointment":
      return <AppointmentStep provider={provider} />;
    case "request":
      return <RequestStep provider={provider} />;
    case "route":
      return <RouteStep provider={provider} />;
    case "google":
      return <GoogleStep provider={provider} />;
    case "caught":
      return <CaughtStep provider={provider} />;
    case "results":
      return <ResultsStep provider={provider} />;
    default:
      return null;
  }
}

const ReviewGenerationDemo = () => {
  const business = provider.getBusiness();
  return (
    <DemoProvider steps={steps}>
      <SendLifecycleProvider>
        <DemoShell
          eyebrow="Paradigm Shift — Automation Demo"
          title={`Review generation for ${business.name}`}
          lede="A click-through of how every happy client becomes a 5-star review — and every unhappy one gets caught before it goes public."
          renderStage={renderStage}
        />
      </SendLifecycleProvider>
    </DemoProvider>
  );
};

export default ReviewGenerationDemo;
```

- [ ] **Step 10: Add the route in `src/App.tsx`**

Add the import alongside the other demo imports (after the `MissedCallTextBackDemo` import):

```tsx
import ReviewGenerationDemo from "./demos/reviewGeneration/ReviewGenerationDemo";
```

Add the route alongside the other demo routes, immediately after the `missed-call-text-back` route (so it sits **outside** the `Layout` route):

```tsx
      <Route
        path="/demos/review-generation"
        element={<ReviewGenerationDemo />}
      />
```

For reference, the demo routes should then read:

```tsx
      <Route path="/demos/commercial-cleaning" element={<DemoPage />} />
      <Route path="/demos/win-back-campaign" element={<WinBackDemo />} />
      <Route
        path="/demos/missed-call-text-back"
        element={<MissedCallTextBackDemo />}
      />
      <Route
        path="/demos/review-generation"
        element={<ReviewGenerationDemo />}
      />
    </Routes>
```

- [ ] **Step 11: Build**

Run: `npm run build`
Expected: `tsc` + Vite build succeed with no TypeScript errors and no unused-import errors. (Every imported icon — `FaSpa`, `FaSms`, `FaCodeBranch`, `FaStar`, `FaShieldAlt`, `FaChartLine`, `FaPaperPlane`, `FaCheck`, `FaThumbsUp`, `FaGoogle`, `FaCheckCircle`, `FaLock`, `FaBell`, `FaExclamationTriangle` — is referenced.)

- [ ] **Step 12: Lint**

Run: `npm run lint`
Expected: passes with zero warnings (no unused vars/imports).

- [ ] **Step 13: Manual smoke test**

Run: `npm run dev`, then open the printed local URL at `/demos/review-generation` and verify:
- Full-bleed demo shell (dark, two-pane: vertical flow rail + content pane), no site `Header`/`Footer`.
- Flow rail shows 6 steps in order — Appointment done, Request the review, Read & route (AI mark), Happy → Google (AI mark), Unhappy → caught, Results — top bar reads "Step 1 of 6".
- **Appointment done:** trigger card for Jenna Alvarez, HydraFacial with Maya, "Done" tag.
- **Request the review:** the business SMS bubble renders; stage strip animates Sending → Delivered → Read; the "Read" note appears at the end.
- **Read & route:** Jenna's reply bubble (right-aligned); the AI panel plays then flips to "done"; a green **Positive → Google** routing card reveals with the decision text.
- **Happy → Google:** AI panel plays, then a Google review card reveals — Google icon, 5 filled stars, drafted review text in quotes, "— Jenna Alvarez".
- **Unhappy → caught:** Rachel's reply bubble; an amber **Negative → Private feedback** routing card (with lock icon); a green shield "Kept off Google" card; and the owner-alert phone push with the four alert lines.
- **Results:** three tally tiles (Requests sent 42, New 5★ reviews 27 highlighted, Caught privately 5); a rating-lift row (4.6★ → ★4.8, "Google rating"); the takeaway.
- Back / Next / Restart all work; clicking a rail node jumps; "Restart demo" returns to step 1 and re-arms the request animation.
- Resize to mobile width (< 600px): the stage strip stacks, bubbles go full-width, no horizontal scroll.
- The demo is **not** yet linked from `/services/automated-workflows` (that card is still a plain `<div>`).

- [ ] **Step 14: Commit (surface command to Brian)**

```bash
git add src/demos/reviewGeneration src/App.tsx
git commit -m "feat: add review generation demo steps, styles, and route"
```

---

## Task 3: Link the example card

Surfaces the demo from the Automated Workflows page by adding `to` to the existing "Review Generation" example card, turning it into a `<Link>`. Runs the final lint gate.

**Files:**
- Modify: `src/components/AutomatedWorkflows.tsx`

**Interfaces:**
- Consumes: the existing `examples` array and its optional `to` field, and the existing `<Link>` rendering branch (already present for other linked cards).
- Produces: no new symbols — the Review Generation card now navigates to `/demos/review-generation`.

- [ ] **Step 1: Set `to` on the Review Generation example**

In `src/components/AutomatedWorkflows.tsx`, in the `examples` array, change the Review Generation entry from:

```tsx
  {
    icon: FaStar,
    title: "Review Generation",
    description: "A steady stream of 5-star reviews, hands-off",
  },
```

to:

```tsx
  {
    icon: FaStar,
    title: "Review Generation",
    description: "A steady stream of 5-star reviews, hands-off",
    to: "/demos/review-generation",
  },
```

(Leave every other example entry untouched. The render already wraps any example with a `to` in a `<Link>`, so no other change is needed.)

- [ ] **Step 2: Lint**

Run: `npm run lint`
Expected: passes with zero warnings.

- [ ] **Step 3: Build**

Run: `npm run build`
Expected: `tsc` + Vite build succeed with no errors.

- [ ] **Step 4: Manual smoke test**

Run: `npm run dev`, then verify:
- On `/services/automated-workflows`, the "Review Generation" card is now a hoverable link; clicking it lands on `/demos/review-generation`.
- The other example cards without a demo are still plain, non-linked cards.
- `/demos/missed-call-text-back`, `/demos/win-back-campaign`, and `/demos/commercial-cleaning` still render unchanged.

- [ ] **Step 5: Commit (surface command to Brian)**

```bash
git add src/components/AutomatedWorkflows.tsx
git commit -m "feat: link review generation demo from automated workflows"
```

---

## Self-Review

**Spec coverage:**
- Med spa persona (Lumière, Jenna spine, Rachel interception) → Task 1 `script.ts`.
- 6-step flow (appointment, request, route[AI], google[AI], caught, results) → Task 2 `steps.ts` + six components; two `isAi: true` steps match `AiStep = "route" | "draft"`.
- Sentiment branch via two client threads → `ReplyKind = "happy" | "unhappy"`; `getReply`/`getRouting` keyed by kind; happy routed in `RouteStep`/`GoogleStep`, unhappy in `CaughtStep`.
- Request with send lifecycle → `RequestStep` reuses `useSendLifecycle`.
- Sentiment-routing card → `RouteStep`/`CaughtStep` + `.rg-route*` CSS (positive green, negative amber).
- Google-review card (stars + drafted text) → `GoogleStep` + `.rg-review*` CSS.
- Private-catch + owner-alert → `CaughtStep` + `.rg-catch*` and `.rg-phone/.rg-push*` CSS.
- Results tally + rating lift → `ResultsStep` + `.rg-tally*`/`.rg-rating*` CSS.
- Full-bleed route outside `Layout` → Task 2 Step 10.
- Example-card link → Task 3.
- No engine changes, scripted only, no extra CTA → Global Constraints; components import only from `shared/`.
- Verification build + lint + smoke → steps across all three tasks.

**Placeholder scan:** No TBD/TODO — every create/modify step has complete file contents or an exact before/after plus expected output.

**Type consistency:** `WorkflowProvider` accessors defined in Task 1 (`getBusiness`, `getAppointment`, `getRequest`, `getReply`, `getRouting`, `getGoogleReview`, `getPrivateCatch`, `getResults`, `getAiReasoning`) are exactly the methods called in Task 2. `ReplyKind` (`"happy" | "unhappy"`) is the argument to `getReply`/`getRouting` (called with `"happy"` in `RouteStep`/`GoogleStep`, `"unhappy"` in `CaughtStep`) and the key type of the `replies`/`routing` records in `script.ts`. `AiStep` (`"route" | "draft"`) matches the `getAiReasoning` calls and the `aiReasoning` record keys. `renderStage` switch cases (`appointment`, `request`, `route`, `google`, `caught`, `results`) match the `steps.ts` `id`s exactly. Every `rg-*` class used in a component has a definition in `reviews.css`; the thread renders only client (caller) bubbles, so only `.rg-turn`/`.rg-bubble-caller` are used from the thread group (`.rg-bubble-business` is used by `RequestStep`). `DemoShell` is passed `eyebrow`/`title`/`lede`/`renderStage`, matching its props interface. All `react-icons/fa` names verified to exist.
