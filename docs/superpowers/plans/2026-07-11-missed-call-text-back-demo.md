# Missed-Call Text-Back Demo Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

Spec: [[2026-07-11-missed-call-text-back-demo-design]]

**Goal:** Build the interactive Missed-Call Text-Back click-through demo on the shared demo engine, reachable at `/demos/missed-call-text-back`, and link it from its example card on the Automated Workflows page.

**Architecture:** A new thin demo folder `src/demos/missedCallTextBack/` mirroring `winBackCampaign/` — a `WorkflowProvider` interface + scripted mock data, six per-step components, one scoped CSS file, and a composition component wiring `DemoProvider → SendLifecycleProvider → DemoShell`. It follows **one HVAC caller through one conversation** (missed call → instant text-back → AI-qualified SMS thread → book & dispatch → owner alert → results). No changes to the shared engine.

**Tech Stack:** React 18 + TypeScript, Vite 5, react-router-dom v6, react-icons/fa, vanilla CSS with custom properties.

## Global Constraints

- **No test framework exists** in this project. Per-task verification is `npm run build` (runs `tsc` type-check + Vite build) and, where a UI is visible, a manual `npm run dev` smoke check; the final task also runs `npm run lint`.
- **`npm run lint` must pass with zero warnings** (`--max-warnings 0`). No unused imports or variables.
- **Git is read-only for the assistant** (per CLAUDE.md). Do NOT execute `git add`/`git commit`. Each task's commit step lists the exact command to **surface to Brian to run manually**.
- **Reuse the shared engine unchanged** — import from `src/demos/shared/` (`DemoProvider`, `SendLifecycleProvider`/`useSendLifecycle`, `DemoShell`, `AiPanel`, `usePrefersReducedMotion`, `DemoStep`). Do NOT modify any file under `src/demos/shared/`.
- **CSS conventions:** vanilla CSS, one `.css` file for the demo, class prefix `mc-*`. Use only the demo-scoped tokens defined on `.demo` in `DemoShell.css` (`--demo-bg`, `--demo-surface`, `--demo-surface-2`, `--demo-border`, `--demo-text`, `--demo-muted`, `--demo-accent`, `--demo-accent-bright`, `--demo-accent-glow`, `--demo-accent-deep`, `--demo-success`) plus the global `--spacing-xs|sm|md|lg|xl`. Do not reference `index.css` light-theme colors directly.
- **Calendly / CTA** is supplied by `DemoShell` — do not add another booking CTA in the page body.
- **Demos are full-bleed** (no site `Header`/`Footer`): the route goes **outside** the `Layout` route in `App.tsx`, like the other two demos.
- **Scripted only** — no real telephony/SMS. All content is static mock data in `script.ts`.

---

## File Structure

**Created**
- `src/demos/missedCallTextBack/types.ts` — `WorkflowProvider` interface + data types.
- `src/demos/missedCallTextBack/script.ts` — all mock data.
- `src/demos/missedCallTextBack/provider.ts` — `scriptedWorkflowProvider` implementing the interface.
- `src/demos/missedCallTextBack/steps.ts` — the 6 `DemoStep`s.
- `src/demos/missedCallTextBack/missedcall.css` — scoped `mc-*` styles.
- `src/demos/missedCallTextBack/steps/MissedCallStep.tsx`
- `src/demos/missedCallTextBack/steps/TextBackStep.tsx`
- `src/demos/missedCallTextBack/steps/ConversationStep.tsx`
- `src/demos/missedCallTextBack/steps/BookStep.tsx`
- `src/demos/missedCallTextBack/steps/OwnerAlertStep.tsx`
- `src/demos/missedCallTextBack/steps/ResultsStep.tsx`
- `src/demos/missedCallTextBack/MissedCallTextBackDemo.tsx` — composition.

**Modified**
- `src/App.tsx` — add the full-bleed route (Task 2).
- `src/components/AutomatedWorkflows.tsx` — set `to` on the Missed-Call Text-Back example card (Task 3).

---

## Task 1: Data layer (types, script, provider)

Establishes the demo's data contract and mock content. Independently verifiable via `npm run build` (types compile); no UI yet. Mirrors win-back's `types.ts`/`script.ts`/`provider.ts` split.

**Files:**
- Create: `src/demos/missedCallTextBack/types.ts`
- Create: `src/demos/missedCallTextBack/script.ts`
- Create: `src/demos/missedCallTextBack/provider.ts`

**Interfaces:**
- Consumes: nothing from other tasks.
- Produces: the `WorkflowProvider` interface and all data types (below); `scriptedWorkflowProvider: WorkflowProvider`. Every step component in Task 2 imports `WorkflowProvider` from `./types` and receives `scriptedWorkflowProvider` as its `provider` prop. Accessor set: `getBusiness()`, `getMissedCall()`, `getAutoText()`, `getConversation()`, `getQualified()`, `getBooking()`, `getOwnerAlert()`, `getResults()`, `getAiReasoning(step: AiStep)`. `AiStep = "conversation" | "book"`.

- [ ] **Step 1: Create `src/demos/missedCallTextBack/types.ts`**

```ts
export interface Business {
  name: string;
  trades: string[];
  phone: string;
  context: string;
}

export interface MissedCall {
  callerName: string;
  number: string;
  timeLabel: string;
  ringNote: string;
}

export interface AutoText {
  body: string;
  responseSeconds: number;
}

export interface SmsTurn {
  id: string;
  from: "business" | "caller";
  body: string;
  timeLabel: string;
}

export interface QualifiedLead {
  problem: string;
  urgency: string;
  address: string;
  homeowner: boolean;
}

export interface Booking {
  service: string;
  when: string;
  tech: string;
  value: string;
}

export interface OwnerAlert {
  title: string;
  lines: string[];
}

export interface ResultsSummary {
  missedCalls: number;
  recovered: number;
  booked: number;
  revenueRecovered: string;
  takeaway: string;
}

export type AiStep = "conversation" | "book";

export interface AiReasoning {
  step: AiStep;
  title: string;
  lines: string[];
}

export interface WorkflowProvider {
  getBusiness(): Business;
  getMissedCall(): MissedCall;
  getAutoText(): AutoText;
  getConversation(): SmsTurn[];
  getQualified(): QualifiedLead;
  getBooking(): Booking;
  getOwnerAlert(): OwnerAlert;
  getResults(): ResultsSummary;
  getAiReasoning(step: AiStep): AiReasoning;
}
```

- [ ] **Step 2: Create `src/demos/missedCallTextBack/script.ts`**

```ts
import type {
  Business,
  MissedCall,
  AutoText,
  SmsTurn,
  QualifiedLead,
  Booking,
  OwnerAlert,
  ResultsSummary,
  AiStep,
  AiReasoning,
} from "./types";

export const business: Business = {
  name: "Summit Air & Plumbing",
  trades: ["HVAC", "Plumbing"],
  phone: "(•••) •••-7788",
  context: "owner plus two techs, usually out on jobs",
};

export const missedCall: MissedCall = {
  callerName: "Marcus Bell",
  number: "(•••) •••-3162",
  timeLabel: "Today 2:14 PM",
  ringNote: "2 rings → voicemail",
};

export const autoText: AutoText = {
  body: "Hi, this is Summit Air & Plumbing — sorry we missed your call! What can we help with?",
  responseSeconds: 14,
};

export const conversation: SmsTurn[] = [
  {
    id: "t1",
    from: "caller",
    body: "My AC quit and the house is 84 and climbing. Can someone come out today?",
    timeLabel: "2:15 PM",
  },
  {
    id: "t2",
    from: "business",
    body: "Sorry to hear that — we can help. What's the service address, and are you the homeowner?",
    timeLabel: "2:15 PM",
  },
  {
    id: "t3",
    from: "caller",
    body: "Yes, homeowner. 412 Marigold Ln. It's an emergency, it's brutal in here.",
    timeLabel: "2:16 PM",
  },
  {
    id: "t4",
    from: "business",
    body: "Got it. I can get a tech out this afternoon for an AC diagnostic. Want me to lock in the next slot?",
    timeLabel: "2:16 PM",
  },
  {
    id: "t5",
    from: "caller",
    body: "Yes please, ASAP.",
    timeLabel: "2:17 PM",
  },
];

export const qualified: QualifiedLead = {
  problem: "AC not cooling (84°F indoors)",
  urgency: "Same-day / emergency",
  address: "412 Marigold Ln",
  homeowner: true,
};

export const booking: Booking = {
  service: "AC diagnostic",
  when: "Today 4:30 PM",
  tech: "Diego R.",
  value: "$189 diagnostic (repair likely to follow)",
};

export const ownerAlert: OwnerAlert = {
  title: "New job booked",
  lines: [
    "AC diagnostic — Marcus Bell",
    "Today 4:30 PM · Diego R.",
    "$189 diagnostic, repair likely",
    "Captured from a missed call — you did nothing.",
  ],
};

export const results: ResultsSummary = {
  missedCalls: 18,
  recovered: 14,
  booked: 9,
  revenueRecovered: "$4,300+ in jobs recovered this week",
  takeaway:
    "9 booked jobs off calls that would have gone to voicemail — and to the next shop on Google. All from an instant text nobody had to send.",
};

export const aiReasoning: Record<AiStep, AiReasoning> = {
  conversation: {
    step: "conversation",
    title: "Claude — working the conversation",
    lines: [
      "Reading the caller's first text: 'AC quit, house is 84.'",
      "Flagging this as a same-day emergency, not a routine request.",
      "Asking for the two things needed to book: address and homeowner.",
      "Confirming 412 Marigold Ln, homeowner verified.",
      "Ready to offer the next available same-day slot.",
    ],
  },
  book: {
    step: "book",
    title: "Claude — booking & dispatch",
    lines: [
      "Checking today's schedule for an open emergency slot.",
      "Next opening: 4:30 PM — within the same-day window.",
      "Matching the nearest available tech: Diego R.",
      "Confirming the time with the caller over text.",
      "Writing the job to the board and dispatching Diego.",
    ],
  },
};
```

- [ ] **Step 3: Create `src/demos/missedCallTextBack/provider.ts`**

```ts
import type {
  Business,
  MissedCall,
  AutoText,
  SmsTurn,
  QualifiedLead,
  Booking,
  OwnerAlert,
  ResultsSummary,
  AiStep,
  AiReasoning,
  WorkflowProvider,
} from "./types";
import {
  business,
  missedCall,
  autoText,
  conversation,
  qualified,
  booking,
  ownerAlert,
  results,
  aiReasoning,
} from "./script";

class ScriptedWorkflowProvider implements WorkflowProvider {
  getBusiness(): Business {
    return business;
  }

  getMissedCall(): MissedCall {
    return missedCall;
  }

  getAutoText(): AutoText {
    return autoText;
  }

  getConversation(): SmsTurn[] {
    return conversation;
  }

  getQualified(): QualifiedLead {
    return qualified;
  }

  getBooking(): Booking {
    return booking;
  }

  getOwnerAlert(): OwnerAlert {
    return ownerAlert;
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
Expected: `tsc` + Vite build succeed with no TypeScript errors. (The new files are not yet imported anywhere; `tsc` still type-checks them. `npm run build` does not run ESLint, so unused-export warnings do not apply here.)

- [ ] **Step 5: Commit (surface command to Brian)**

```bash
git add src/demos/missedCallTextBack/types.ts src/demos/missedCallTextBack/script.ts src/demos/missedCallTextBack/provider.ts
git commit -m "feat: add missed-call text-back demo data layer"
```

---

## Task 2: Steps, styles, composition, and route

Builds all six step components, the scoped CSS, the step list, and the composition component, then wires the full-bleed route so the demo is reachable at `/demos/missed-call-text-back`. It is **not yet linked** from the Automated Workflows page (that is Task 3), so it can be reviewed in isolation by typing the URL.

**Files:**
- Create: `src/demos/missedCallTextBack/steps.ts`
- Create: `src/demos/missedCallTextBack/missedcall.css`
- Create: `src/demos/missedCallTextBack/steps/MissedCallStep.tsx`
- Create: `src/demos/missedCallTextBack/steps/TextBackStep.tsx`
- Create: `src/demos/missedCallTextBack/steps/ConversationStep.tsx`
- Create: `src/demos/missedCallTextBack/steps/BookStep.tsx`
- Create: `src/demos/missedCallTextBack/steps/OwnerAlertStep.tsx`
- Create: `src/demos/missedCallTextBack/steps/ResultsStep.tsx`
- Create: `src/demos/missedCallTextBack/MissedCallTextBackDemo.tsx`
- Modify: `src/App.tsx`

**Interfaces:**
- Consumes: `scriptedWorkflowProvider` and the `WorkflowProvider` type from Task 1; shared `DemoProvider`, `SendLifecycleProvider`/`useSendLifecycle`/`SendStatus`, `DemoShell`, `AiPanel`, `usePrefersReducedMotion`, and the `DemoStep` type from `src/demos/shared/`.
- Produces: default export `MissedCallTextBackDemo` (React component, no props), imported by `App.tsx`. Each step component is a default export taking `{ provider }: { provider: WorkflowProvider }`.

- [ ] **Step 1: Create `src/demos/missedCallTextBack/steps.ts`**

```ts
import {
  FaPhoneSlash,
  FaSms,
  FaComments,
  FaCalendarCheck,
  FaBell,
  FaChartLine,
} from "react-icons/fa";
import type { DemoStep } from "../shared/types";

export const steps: DemoStep[] = [
  { id: "missed-call", label: "Missed call", Icon: FaPhoneSlash },
  { id: "text-back", label: "Instant text-back", Icon: FaSms },
  { id: "conversation", label: "Conversation", Icon: FaComments, isAi: true },
  { id: "book", label: "Book & dispatch", Icon: FaCalendarCheck, isAi: true },
  { id: "owner-alert", label: "Owner alert", Icon: FaBell },
  { id: "results", label: "Results", Icon: FaChartLine },
];
```

- [ ] **Step 2: Create `src/demos/missedCallTextBack/missedcall.css`**

```css
.mc-step {
  color: var(--demo-text);
}

.mc-heading {
  font-size: 1.15rem;
  margin: 0 0 var(--spacing-xs);
}

.mc-sub {
  color: var(--demo-muted);
  margin: 0 0 var(--spacing-md);
  max-width: 60ch;
}

.mc-note {
  color: var(--demo-muted);
  font-size: 0.85rem;
  margin: var(--spacing-md) 0 0;
}

/* Missed-call caller-ID card */
.mc-callcard {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-md);
  background: var(--demo-surface-2);
  border: 1px solid var(--demo-border);
  border-left: 3px solid #f4b740;
  border-radius: 0.6rem;
}
.mc-callcard-icon {
  font-size: 1.6rem;
  color: #f4b740;
}
.mc-callcard-body {
  flex: 1 1 auto;
  min-width: 0;
}
.mc-callcard-name {
  font-weight: 700;
  margin: 0;
}
.mc-callcard-number {
  color: var(--demo-muted);
  margin: 0.1rem 0 0;
  font-family: ui-monospace, "SF Mono", Menlo, Consolas, monospace;
  font-size: 0.85rem;
}
.mc-callcard-meta {
  color: var(--demo-muted);
  font-size: 0.8rem;
  margin: 0.25rem 0 0;
}
.mc-callcard-tag {
  align-self: flex-start;
  padding: 0.2rem 0.6rem;
  border-radius: 999px;
  background: rgba(244, 183, 64, 0.14);
  color: #f4b740;
  font-size: 0.72rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

/* Hero response-time badge */
.mc-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.4rem 0.8rem;
  margin-bottom: var(--spacing-md);
  border-radius: 999px;
  background: rgba(90, 169, 230, 0.12);
  border: 1px solid var(--demo-accent);
  color: var(--demo-accent-bright);
  font-weight: 700;
  font-size: 0.85rem;
  box-shadow: 0 0 12px var(--demo-accent-glow);
}
.mc-badge-icon {
  font-size: 0.9rem;
}

/* SMS bubbles */
.mc-outbox {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}
.mc-bubble {
  max-width: 80%;
  padding: 0.7rem 0.95rem;
  border-radius: 1rem;
  line-height: 1.5;
}
.mc-bubble-body {
  margin: 0;
}
.mc-bubble-business {
  align-self: flex-start;
  background: var(--demo-surface-2);
  border: 1px solid var(--demo-border);
  border-bottom-left-radius: 0.3rem;
}
.mc-bubble-caller {
  align-self: flex-end;
  background: var(--demo-accent);
  color: #fff;
  border-bottom-right-radius: 0.3rem;
}
.mc-confirm {
  margin-top: var(--spacing-sm);
}

/* Send lifecycle stage strip */
.mc-stages {
  list-style: none;
  display: flex;
  gap: var(--spacing-sm);
  padding: 0;
  margin: 0;
}
.mc-stage {
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
.mc-stage.is-active {
  opacity: 1;
  color: var(--demo-text);
  border-color: var(--demo-accent-bright);
}
.mc-stage.is-done {
  color: var(--demo-accent-bright);
}
.mc-stage-icon {
  font-size: 1.2rem;
}
.mc-stage-label {
  font-size: 0.8rem;
}
.mc-done-note {
  color: var(--demo-muted);
  font-size: 0.9rem;
  margin: 0;
}

/* Reveal wrapper (thread/booking after AI completes) */
.mc-reveal {
  opacity: 0;
  transform: translateY(6px);
  transition: opacity 0.4s ease, transform 0.4s ease;
  margin-top: var(--spacing-md);
}
.mc-reveal.is-shown {
  opacity: 1;
  transform: none;
}

/* Conversation thread */
.mc-thread {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
  margin-bottom: var(--spacing-md);
}
.mc-turn {
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
  max-width: 100%;
}
.mc-turn-business {
  align-items: flex-start;
}
.mc-turn-caller {
  align-items: flex-end;
}
.mc-turn-time {
  font-size: 0.7rem;
  color: var(--demo-muted);
  padding: 0 0.3rem;
}

/* Extracted facts */
.mc-facts {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: var(--spacing-sm);
  padding: var(--spacing-md);
  background: var(--demo-surface-2);
  border: 1px solid var(--demo-border);
  border-radius: 0.6rem;
}
.mc-fact {
  display: flex;
  align-items: baseline;
  gap: 0.4rem;
  font-size: 0.9rem;
}
.mc-fact-icon {
  color: var(--demo-success);
  flex: 0 0 auto;
}
.mc-fact-label {
  color: var(--demo-muted);
}
.mc-fact-value {
  font-weight: 600;
}

/* Booking card */
.mc-booking {
  display: flex;
  align-items: flex-start;
  gap: var(--spacing-sm);
  padding: var(--spacing-md);
  background: rgba(16, 185, 129, 0.1);
  border: 1px solid var(--demo-success);
  border-radius: 0.6rem;
}
.mc-booking-icon {
  color: var(--demo-success);
  font-size: 1.5rem;
  margin-top: 0.1rem;
}
.mc-booking-title {
  font-weight: 700;
  margin: 0;
}
.mc-booking-meta {
  color: var(--demo-muted);
  margin: 0.15rem 0 0;
}
.mc-booking-tech {
  display: flex;
  align-items: center;
  gap: 0.35rem;
  margin: 0.4rem 0 0;
  font-size: 0.9rem;
}
.mc-booking-tech-icon {
  color: var(--demo-accent-bright);
}

/* Owner alert phone card */
.mc-phone {
  display: flex;
  justify-content: center;
}
.mc-push {
  width: 100%;
  max-width: 380px;
  padding: var(--spacing-md);
  background: var(--demo-surface-2);
  border: 1px solid var(--demo-border);
  border-radius: 0.9rem;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.35);
}
.mc-push-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: var(--spacing-sm);
}
.mc-push-app {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.78rem;
  font-weight: 600;
  color: var(--demo-muted);
  text-transform: uppercase;
  letter-spacing: 0.04em;
}
.mc-push-app-icon {
  color: var(--demo-accent-bright);
}
.mc-push-now {
  font-size: 0.75rem;
  color: var(--demo-muted);
}
.mc-push-title {
  font-weight: 700;
  font-size: 1.05rem;
  margin: 0 0 var(--spacing-xs);
}
.mc-push-lines {
  margin: 0;
  padding-left: 1.1rem;
  color: var(--demo-text);
}
.mc-push-lines li {
  margin: 0.15rem 0;
}

/* Results tally */
.mc-tally {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: var(--spacing-sm);
  margin-bottom: var(--spacing-md);
}
.mc-tally-item {
  padding: var(--spacing-md);
  text-align: center;
  background: var(--demo-surface-2);
  border: 1px solid var(--demo-border);
  border-radius: 0.6rem;
}
.mc-tally-item-hl {
  border-color: var(--demo-accent-bright);
  box-shadow: 0 0 16px var(--demo-accent-glow);
}
.mc-tally-num {
  display: block;
  font-size: 1.8rem;
  font-weight: 700;
  color: var(--demo-accent-bright);
}
.mc-tally-label {
  color: var(--demo-muted);
  font-size: 0.85rem;
}
.mc-revenue {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--demo-success);
  margin: 0 0 var(--spacing-xs);
}
.mc-takeaway {
  color: var(--demo-muted);
  max-width: 60ch;
  margin: 0;
}

@media (max-width: 600px) {
  .mc-stages {
    flex-direction: column;
  }
  .mc-bubble {
    max-width: 100%;
  }
}
```

- [ ] **Step 3: Create `src/demos/missedCallTextBack/steps/MissedCallStep.tsx`**

```tsx
import { FaPhoneSlash } from "react-icons/fa";
import type { WorkflowProvider } from "../types";

const MissedCallStep = ({ provider }: { provider: WorkflowProvider }) => {
  const call = provider.getMissedCall();
  const business = provider.getBusiness();

  return (
    <div className="mc-step">
      <h3 className="mc-heading">A call comes in — and nobody's free</h3>
      <p className="mc-sub">
        {business.name}: {business.context}. The phone rings while the crew is
        out on a job, so it goes to voicemail.
      </p>

      <div className="mc-callcard">
        <div className="mc-callcard-icon">
          <FaPhoneSlash />
        </div>
        <div className="mc-callcard-body">
          <p className="mc-callcard-name">{call.callerName}</p>
          <p className="mc-callcard-number">{call.number}</p>
          <p className="mc-callcard-meta">
            {call.timeLabel} · {call.ringNote}
          </p>
        </div>
        <span className="mc-callcard-tag">Missed</span>
      </div>

      <p className="mc-note">
        Normally this lead just calls the next shop on Google. Watch what
        happens instead.
      </p>
    </div>
  );
};

export default MissedCallStep;
```

- [ ] **Step 4: Create `src/demos/missedCallTextBack/steps/TextBackStep.tsx`**

```tsx
import { useEffect, useRef } from "react";
import { FaPaperPlane, FaCheck, FaSms, FaBolt } from "react-icons/fa";
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

const TextBackStep = ({ provider }: { provider: WorkflowProvider }) => {
  const autoText = provider.getAutoText();
  const call = provider.getMissedCall();
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
    <div className="mc-step">
      <h3 className="mc-heading">An instant text goes back — automatically</h3>
      <p className="mc-sub">
        No one lifted a finger. Seconds after the missed call, {call.callerName}{" "}
        gets a text from the shop's number.
      </p>

      <div className="mc-badge">
        <FaBolt className="mc-badge-icon" />
        Replied in {autoText.responseSeconds} seconds
      </div>

      <div className="mc-outbox">
        <div className="mc-bubble mc-bubble-business">
          <p className="mc-bubble-body">{autoText.body}</p>
        </div>

        <ol className="mc-stages">
          {stages.map((stage, i) => (
            <li
              key={stage.id}
              className={
                "mc-stage" +
                (rank >= i ? " is-active" : "") +
                (rank > i ? " is-done" : "")
              }
            >
              <span className="mc-stage-icon">{stage.icon}</span>
              <span className="mc-stage-label">{stage.label}</span>
            </li>
          ))}
        </ol>

        {status === "opened" && (
          <p className="mc-done-note">
            Read — the lead is still yours. Now the automation actually talks to
            them.
          </p>
        )}
      </div>
    </div>
  );
};

export default TextBackStep;
```

- [ ] **Step 5: Create `src/demos/missedCallTextBack/steps/ConversationStep.tsx`**

```tsx
import { useState } from "react";
import { FaCheckCircle } from "react-icons/fa";
import type { WorkflowProvider } from "../types";
import { usePrefersReducedMotion } from "../../shared/usePrefersReducedMotion";
import AiPanel from "../../shared/AiPanel";

const ConversationStep = ({ provider }: { provider: WorkflowProvider }) => {
  const thread = provider.getConversation();
  const qualified = provider.getQualified();
  const reasoning = provider.getAiReasoning("conversation");
  const reduced = usePrefersReducedMotion();
  const [revealed, setRevealed] = useState(reduced);

  const facts = [
    { label: "Problem", value: qualified.problem },
    { label: "Urgency", value: qualified.urgency },
    { label: "Address", value: qualified.address },
    { label: "Homeowner", value: qualified.homeowner ? "Yes" : "No" },
  ];

  return (
    <div className="mc-step">
      <h3 className="mc-heading">
        The automation qualifies the lead — in plain text
      </h3>
      <p className="mc-sub">
        Claude handles the back-and-forth over SMS, pulling out exactly what the
        shop needs to book the job.
      </p>

      <AiPanel
        title={reasoning.title}
        lines={reasoning.lines}
        onComplete={() => setRevealed(true)}
      />

      <div className={"mc-reveal" + (revealed ? " is-shown" : "")}>
        <div className="mc-thread">
          {thread.map((turn) => (
            <div key={turn.id} className={"mc-turn mc-turn-" + turn.from}>
              <div className={"mc-bubble mc-bubble-" + turn.from}>
                <p className="mc-bubble-body">{turn.body}</p>
              </div>
              <span className="mc-turn-time">{turn.timeLabel}</span>
            </div>
          ))}
        </div>

        <div className="mc-facts">
          {facts.map((f) => (
            <div key={f.label} className="mc-fact">
              <FaCheckCircle className="mc-fact-icon" />
              <span className="mc-fact-label">{f.label}:</span>
              <span className="mc-fact-value">{f.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ConversationStep;
```

- [ ] **Step 6: Create `src/demos/missedCallTextBack/steps/BookStep.tsx`**

```tsx
import { useState } from "react";
import { FaCalendarCheck, FaUserHardHat } from "react-icons/fa";
import type { WorkflowProvider } from "../types";
import { usePrefersReducedMotion } from "../../shared/usePrefersReducedMotion";
import AiPanel from "../../shared/AiPanel";

const BookStep = ({ provider }: { provider: WorkflowProvider }) => {
  const booking = provider.getBooking();
  const reasoning = provider.getAiReasoning("book");
  const reduced = usePrefersReducedMotion();
  const [revealed, setRevealed] = useState(reduced);

  return (
    <div className="mc-step">
      <h3 className="mc-heading">It books the job and dispatches a tech</h3>
      <p className="mc-sub">
        Claude offers the next same-day slot, confirms with the caller over
        text, and puts the job on the board.
      </p>

      <AiPanel
        title={reasoning.title}
        lines={reasoning.lines}
        onComplete={() => setRevealed(true)}
      />

      <div className={"mc-reveal" + (revealed ? " is-shown" : "")}>
        <div className="mc-booking">
          <FaCalendarCheck className="mc-booking-icon" />
          <div>
            <p className="mc-booking-title">Booked — {booking.service}</p>
            <p className="mc-booking-meta">
              {booking.when} · {booking.value}
            </p>
            <p className="mc-booking-tech">
              <FaUserHardHat className="mc-booking-tech-icon" />
              Dispatched to {booking.tech}
            </p>
          </div>
        </div>

        <div className="mc-bubble mc-bubble-business mc-confirm">
          <p className="mc-bubble-body">
            You're all set for {booking.when}. {booking.tech} will text when
            he's on the way. Thanks for reaching out!
          </p>
        </div>
      </div>
    </div>
  );
};

export default BookStep;
```

- [ ] **Step 7: Create `src/demos/missedCallTextBack/steps/OwnerAlertStep.tsx`**

```tsx
import { FaBell } from "react-icons/fa";
import type { WorkflowProvider } from "../types";

const OwnerAlertStep = ({ provider }: { provider: WorkflowProvider }) => {
  const alert = provider.getOwnerAlert();
  const business = provider.getBusiness();

  return (
    <div className="mc-step">
      <h3 className="mc-heading">The owner just gets the good news</h3>
      <p className="mc-sub">
        No missed-call panic, no callback scramble. {business.name}'s owner sees
        one notification: a job already booked.
      </p>

      <div className="mc-phone">
        <div className="mc-push">
          <div className="mc-push-head">
            <span className="mc-push-app">
              <FaBell className="mc-push-app-icon" />
              {business.name}
            </span>
            <span className="mc-push-now">now</span>
          </div>
          <p className="mc-push-title">{alert.title}</p>
          <ul className="mc-push-lines">
            {alert.lines.map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default OwnerAlertStep;
```

- [ ] **Step 8: Create `src/demos/missedCallTextBack/steps/ResultsStep.tsx`**

```tsx
import type { WorkflowProvider } from "../types";

const ResultsStep = ({ provider }: { provider: WorkflowProvider }) => {
  const results = provider.getResults();
  const tally = [
    { num: results.missedCalls, label: "Missed calls" },
    { num: results.recovered, label: "Recovered" },
    { num: results.booked, label: "Booked", hl: true },
  ];

  return (
    <div className="mc-step">
      <h3 className="mc-heading">One week, hands-off</h3>
      <p className="mc-sub">
        Every missed call got an instant text back. Here's what that recovered.
      </p>

      <div className="mc-tally">
        {tally.map((t) => (
          <div
            key={t.label}
            className={"mc-tally-item" + (t.hl ? " mc-tally-item-hl" : "")}
          >
            <span className="mc-tally-num">{t.num}</span>
            <span className="mc-tally-label">{t.label}</span>
          </div>
        ))}
      </div>

      <p className="mc-revenue">{results.revenueRecovered}</p>
      <p className="mc-takeaway">{results.takeaway}</p>
    </div>
  );
};

export default ResultsStep;
```

- [ ] **Step 9: Create `src/demos/missedCallTextBack/MissedCallTextBackDemo.tsx`**

```tsx
import type { ReactNode } from "react";
import { DemoProvider } from "../shared/DemoController";
import { SendLifecycleProvider } from "../shared/SendLifecycleProvider";
import DemoShell from "../shared/DemoShell";
import { steps } from "./steps";
import { scriptedWorkflowProvider } from "./provider";
import MissedCallStep from "./steps/MissedCallStep";
import TextBackStep from "./steps/TextBackStep";
import ConversationStep from "./steps/ConversationStep";
import BookStep from "./steps/BookStep";
import OwnerAlertStep from "./steps/OwnerAlertStep";
import ResultsStep from "./steps/ResultsStep";
import "./missedcall.css";

const provider = scriptedWorkflowProvider;

function renderStage(stepId: string): ReactNode {
  switch (stepId) {
    case "missed-call":
      return <MissedCallStep provider={provider} />;
    case "text-back":
      return <TextBackStep provider={provider} />;
    case "conversation":
      return <ConversationStep provider={provider} />;
    case "book":
      return <BookStep provider={provider} />;
    case "owner-alert":
      return <OwnerAlertStep provider={provider} />;
    case "results":
      return <ResultsStep provider={provider} />;
    default:
      return null;
  }
}

const MissedCallTextBackDemo = () => {
  const business = provider.getBusiness();
  return (
    <DemoProvider steps={steps}>
      <SendLifecycleProvider>
        <DemoShell
          eyebrow="Paradigm Shift — Automation Demo"
          title={`Missed-call text-back for ${business.name}`}
          lede="A click-through of how one missed call becomes a booked job — instant text-back, an AI-qualified SMS thread, and a dispatched tech, all hands-off."
          renderStage={renderStage}
        />
      </SendLifecycleProvider>
    </DemoProvider>
  );
};

export default MissedCallTextBackDemo;
```

- [ ] **Step 10: Add the route in `src/App.tsx`**

Add the import alongside the other demo imports (after the `WinBackDemo` import on line 7):

```tsx
import MissedCallTextBackDemo from "./demos/missedCallTextBack/MissedCallTextBackDemo";
```

Add the route alongside the other demo routes, immediately after the `win-back-campaign` route (so it sits **outside** the `Layout` route):

```tsx
      <Route
        path="/demos/missed-call-text-back"
        element={<MissedCallTextBackDemo />}
      />
```

For reference, the `<Routes>` block should then end like:

```tsx
      <Route path="/demos/commercial-cleaning" element={<DemoPage />} />
      <Route path="/demos/win-back-campaign" element={<WinBackDemo />} />
      <Route
        path="/demos/missed-call-text-back"
        element={<MissedCallTextBackDemo />}
      />
    </Routes>
```

- [ ] **Step 11: Build**

Run: `npm run build`
Expected: `tsc` + Vite build succeed with no TypeScript errors and no unused-import errors. (Every imported icon — `FaPhoneSlash`, `FaSms`, `FaComments`, `FaCalendarCheck`, `FaBell`, `FaChartLine`, `FaPaperPlane`, `FaCheck`, `FaBolt`, `FaCheckCircle`, `FaUserHardHat` — is referenced exactly once in a step or in `steps.ts`.)

- [ ] **Step 12: Manual smoke test**

Run: `npm run dev`, then open `http://localhost:5173/demos/missed-call-text-back` and verify:
- Full-bleed demo shell (dark, two-pane: vertical flow rail on the left + content pane), **no** site `Header`/`Footer`.
- Flow rail shows 6 steps in order — Missed call, Instant text-back, Conversation (AI mark), Book & dispatch (AI mark), Owner alert, Results — and the top bar reads "Step 1 of 6".
- **Missed call:** caller-ID card for Marcus Bell with masked number, time, "2 rings → voicemail", "Missed" tag.
- **Instant text-back:** the "Replied in 14 seconds" badge shows; the business SMS bubble renders; the stage strip animates Sending → Delivered → Read; the "Read" note appears at the end.
- **Conversation:** the AI panel plays its lines then flips to "done"; the SMS thread reveals with caller bubbles right-aligned and business bubbles left-aligned; the four extracted facts show below.
- **Book & dispatch:** AI panel plays, then the green booking card ("Booked — AC diagnostic", time/value, "Dispatched to Diego R.") and the confirmation bubble reveal.
- **Owner alert:** the phone-style push card shows the business name, "New job booked", and the four summary lines.
- **Results:** three tally tiles (Missed calls 18, Recovered 14, Booked 9 highlighted), the revenue line, and the takeaway.
- Back / Next / Restart demo all work; clicking a rail node jumps to that step; "Restart demo" returns to step 1 and re-arms the text-back animation.
- Resize to mobile width (< 600px): the stage strip stacks vertically, bubbles go full-width, grids collapse to one column, no horizontal scroll.
- The demo is **not** yet linked from `/services/automated-workflows` (that card is still a plain `<div>`) — confirm the card is not a link.

- [ ] **Step 13: Commit (surface command to Brian)**

```bash
git add src/demos/missedCallTextBack src/App.tsx
git commit -m "feat: add missed-call text-back demo steps, styles, and route"
```

---

## Task 3: Link the example card

Surfaces the demo from the Automated Workflows page by adding `to` to the existing "Missed-Call Text-Back" example card, turning it into a `<Link>`. Split from Task 2 so going live is a deliberate, separately-reviewable step. Runs the final lint gate.

**Files:**
- Modify: `src/components/AutomatedWorkflows.tsx`

**Interfaces:**
- Consumes: the existing `examples` array and its optional `to` field, and the existing `<Link>` rendering branch (already present for the Win-Back card).
- Produces: no new symbols — the Missed-Call Text-Back card now navigates to `/demos/missed-call-text-back`.

- [ ] **Step 1: Set `to` on the Missed-Call Text-Back example**

In `src/components/AutomatedWorkflows.tsx`, in the `examples` array, change the Missed-Call Text-Back entry from:

```tsx
  {
    icon: FaCommentDots,
    title: "Missed-Call Text-Back",
    description: "Instant reply so leads don't call a competitor",
  },
```

to:

```tsx
  {
    icon: FaCommentDots,
    title: "Missed-Call Text-Back",
    description: "Instant reply so leads don't call a competitor",
    to: "/demos/missed-call-text-back",
  },
```

(Leave every other example entry untouched. No other changes are needed — the render already wraps any example with a `to` in a `<Link>`.)

- [ ] **Step 2: Lint**

Run: `npm run lint`
Expected: passes with zero warnings.

- [ ] **Step 3: Build**

Run: `npm run build`
Expected: `tsc` + Vite build succeed with no errors.

- [ ] **Step 4: Manual smoke test**

Run: `npm run dev`, then verify:
- On `/services/automated-workflows`, the "Missed-Call Text-Back" card is now a hoverable link (same treatment as the Win-Back card); clicking it lands on `/demos/missed-call-text-back`.
- The other example cards without a demo are still plain, non-linked cards.
- `/demos/win-back-campaign` and `/demos/commercial-cleaning` still render unchanged.

- [ ] **Step 5: Commit (surface command to Brian)**

```bash
git add src/components/AutomatedWorkflows.tsx
git commit -m "feat: link missed-call text-back demo from automated workflows"
```

---

## Self-Review

**Spec coverage:**
- Structurally different (one caller, one conversation) → Task 2 step components follow a single caller; no list/import step.
- Persona (Summit Air & Plumbing, Marcus Bell, July AC emergency) → Task 1 `script.ts`.
- 6-step flow (missed-call, text-back, conversation[AI], book[AI], owner-alert, results) → Task 2 `steps.ts` + six components; two `isAi: true` steps match `AiStep = "conversation" | "book"`.
- Instant text-back with send lifecycle + response-time badge → `TextBackStep` reuses `useSendLifecycle`; badge from `autoText.responseSeconds`.
- AI-qualified SMS thread (new `SmsTurn[]` chat UI) + extracted facts → `ConversationStep` + `.mc-thread`/`.mc-facts` CSS.
- Book & dispatch with confirmation SMS → `BookStep`.
- Owner push-notification card → `OwnerAlertStep` + `.mc-push` CSS.
- Week-level results tally → `ResultsStep`.
- Full-bleed route outside `Layout` → Task 2 Step 10.
- Example-card link → Task 3.
- No engine changes, scripted only, no extra CTA → enforced in Global Constraints; components only import from `shared/`, never modify it.
- Verification build + smoke + lint → steps across all three tasks.

**Placeholder scan:** No TBD/TODO/"handle edge cases" — every create/modify step contains complete file contents or an exact before/after diff plus expected output.

**Type consistency:** `WorkflowProvider` accessors defined in Task 1 (`getBusiness`, `getMissedCall`, `getAutoText`, `getConversation`, `getQualified`, `getBooking`, `getOwnerAlert`, `getResults`, `getAiReasoning`) are exactly the methods called by the Task 2 components. `AiStep` union (`"conversation" | "book"`) matches both the `getAiReasoning` argument in `ConversationStep`/`BookStep` and the `aiReasoning` record keys in `script.ts`. `SmsTurn.from` (`"business" | "caller"`) drives the `mc-turn-${from}` / `mc-bubble-${from}` class names, which have matching CSS rules. Every `mc-*` class used in a component has a definition in `missedcall.css`. The composition's `renderStage` switch cases (`missed-call`, `text-back`, `conversation`, `book`, `owner-alert`, `results`) match the `steps.ts` `id`s exactly. `DemoShell` is passed `eyebrow`/`title`/`lede`/`renderStage`, matching its props interface (`lede` is accepted though currently unused by the shell, consistent with `WinBackDemo`).
