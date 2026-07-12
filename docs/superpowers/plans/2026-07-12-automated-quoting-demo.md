# Automated Quoting Demo Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build an interactive 6-step click-through demo for the "Automated Quoting" automation on the shared demo engine, and link it from its example card on the Automated Workflows page.

**Architecture:** A new thin `src/demos/automatedQuoting/` folder mirroring `src/demos/reviewGeneration/`: a `WorkflowProvider` interface (`types.ts`) backed by scripted mock data (`script.ts`) via a provider (`provider.ts`), a step list (`steps.ts`), six step components (`steps/`), scoped CSS (`quoting.css`), and a composition root (`AutomatedQuotingDemo.tsx`) wrapping the shared `DemoProvider → SendLifecycleProvider → DemoShell`. Two steps (`understand`, `build`) are AI-powered and render the shared `AiPanel`. **No changes to `src/demos/shared/`.**

**Tech Stack:** React 18 + TypeScript, Vite 5, react-router-dom v6, react-icons/fa, vanilla CSS with `--demo-*` / `--spacing-*` custom properties (defined in `src/demos/shared/DemoShell.css`).

## Global Constraints

- **No engine/shared changes.** Everything under `src/demos/shared/` is reused unchanged.
- **CSS class prefix `qt-*`**, scoped in `quoting.css`. Prefer `--demo-*` and `--spacing-*` tokens (already defined by the `.demo` shell) for all structural color/spacing. A few literal values are acceptable, matching sibling demos (`reviews.css` uses `#fff`, star yellows, `rgba(16,185,129,…)` success tints): the `rgba(...)` success tints and the `#0a0a0a` on-accent button text used here.
- **No test framework exists** in this repo. Per-task verification gate is `npm run build` (tsc + Vite) then `npm run lint` (zero warnings). The final task adds a `npm run dev` smoke test.
- **Fully scripted.** No real quoting/pricing integration. The "Approve & send" / "Tweak a line" affordances are presentational only (non-interactive `<span>`s).
- **Content values are illustrative and tunable**; the `WorkflowProvider` interface is fixed.
- **AiStep union is exactly** `"understand" | "build"`.
- **Route path:** `/demos/automated-quoting`. **Example card target:** same path, set as `to` on `examples[3]` in `AutomatedWorkflows.tsx`.
- **Obsidian export (from global CLAUDE.md):** after the plan and any session markdown are finalized, copy them to `/Users/brian/Documents/dev-vault/projects/paradigm/consulting-website/docs/superpowers/...` (kebab-case names). Handled in the final task.

---

### Task 1: Data layer — types, mock script, provider

**Files:**
- Create: `src/demos/automatedQuoting/types.ts`
- Create: `src/demos/automatedQuoting/script.ts`
- Create: `src/demos/automatedQuoting/provider.ts`

**Interfaces:**
- Consumes: nothing (foundation task).
- Produces:
  - Types: `Business`, `Intake`, `ScopeField`, `LineItem`, `Quote`, `Approval`, `Acceptance`, `ResultsSummary`, `AiStep` (`"understand" | "build"`), `AiReasoning`, `WorkflowProvider`.
  - `WorkflowProvider` methods: `getBusiness(): Business`, `getIntake(): Intake`, `getScope(): ScopeField[]`, `getQuote(): Quote`, `getApproval(): Approval`, `getAcceptance(): Acceptance`, `getResults(): ResultsSummary`, `getAiReasoning(step: AiStep): AiReasoning`.
  - `export const scriptedWorkflowProvider: WorkflowProvider`.

- [ ] **Step 1: Create `types.ts`**

```ts
export interface Business {
  name: string;
  service: string;
  context: string;
}

export interface Intake {
  customerName: string;
  channel: string;
  rawText: string;
  receivedLabel: string;
}

export interface ScopeField {
  label: string;
  value: string;
}

export interface LineItem {
  label: string;
  detail: string;
  amount: string;
}

export interface Quote {
  lineItems: LineItem[];
  total: string;
  validityNote: string;
}

export interface Approval {
  summary: string;
  ownerAction: string;
}

export interface Acceptance {
  customerName: string;
  replyBody: string;
  bookedDate: string;
  jobValue: string;
}

export interface ResultsSummary {
  requests: number;
  quotesSent: number;
  avgTurnaround: string;
  jobsBooked: number;
  winRate: string;
  revenueQuoted: string;
  takeaway: string;
}

export type AiStep = "understand" | "build";

export interface AiReasoning {
  step: AiStep;
  title: string;
  lines: string[];
}

export interface WorkflowProvider {
  getBusiness(): Business;
  getIntake(): Intake;
  getScope(): ScopeField[];
  getQuote(): Quote;
  getApproval(): Approval;
  getAcceptance(): Acceptance;
  getResults(): ResultsSummary;
  getAiReasoning(step: AiStep): AiReasoning;
}
```

- [ ] **Step 2: Create `script.ts`**

```ts
import type {
  Business,
  Intake,
  ScopeField,
  Quote,
  Approval,
  Acceptance,
  ResultsSummary,
  AiStep,
  AiReasoning,
} from "./types";

export const business: Business = {
  name: "Anchor Moving Co.",
  service: "Local & long-distance moving",
  context: "Owner + a few crews — quotes are the bottleneck.",
};

export const intake: Intake = {
  customerName: "Devin Marsh",
  channel: "website form",
  rawText:
    "Need to move end of the month. 3-bed house on Oak St to a 2nd-floor apartment across town on Delmar. Got a piano and a big fridge, maybe 30 boxes.",
  receivedLabel: "Today 9:04 AM",
};

export const scope: ScopeField[] = [
  { label: "Move size", value: "3-bedroom house" },
  { label: "From", value: "House, ground floor (Oak St)" },
  { label: "To", value: "Apartment, 2nd floor — stairs (Delmar)" },
  { label: "Distance", value: "~12 mi, cross-town" },
  { label: "Special items", value: "Upright piano, full-size fridge" },
  { label: "Boxes", value: "~30" },
  { label: "Target date", value: "End of month" },
];

export const quote: Quote = {
  lineItems: [
    { label: "Crew", detail: "3 movers × ~5 hrs", amount: "$720" },
    { label: "Truck & mileage", detail: "26' truck, ~12 mi", amount: "$180" },
    { label: "Stairs surcharge", detail: "2nd-floor carry", amount: "$90" },
    { label: "Piano handling", detail: "specialty item", amount: "$150" },
    {
      label: "Packing materials",
      detail: "blankets, tape, wardrobe boxes",
      amount: "$60",
    },
  ],
  total: "$1,200",
  validityNote: "Estimate valid 14 days · final subject to on-site confirmation.",
};

export const approval: Approval = {
  summary: "Itemized quote ready for Devin's move",
  ownerAction: "Owner taps Approve & send — or tweaks a line first.",
};

export const acceptance: Acceptance = {
  customerName: "Devin Marsh",
  replyBody: "Looks good — let's book it for the 28th.",
  bookedDate: "Sat, the 28th",
  jobValue: "$1,200 booked",
};

export const results: ResultsSummary = {
  requests: 34,
  quotesSent: 34,
  avgTurnaround: "4 min",
  jobsBooked: 19,
  winRate: "56%",
  revenueQuoted: "$38k quoted",
  takeaway:
    "34 quote requests, 34 itemized quotes out the door in minutes — 19 booked jobs and $38k quoted, without a single evening spent hand-figuring estimates.",
};

export const aiReasoning: Record<AiStep, AiReasoning> = {
  understand: {
    step: "understand",
    title: "Claude — reading the request",
    lines: [
      "Reading Devin's message the way a customer actually wrote it.",
      "Pulling the essentials: 3-bed house → 2nd-floor apartment, ~12 mi cross-town.",
      "Flagging the hard parts: stairs at the destination, a piano and a full-size fridge.",
      "Estimating volume: ~30 boxes, end-of-month target date.",
      "Marking what needs on-site confirmation before it's final.",
    ],
  },
  build: {
    step: "build",
    title: "Claude — building the quote",
    lines: [
      "Pricing each line from Anchor's own rate card — not a guess.",
      "Sizing crew and truck to a 3-bedroom, ~12-mile move.",
      "Adding the surcharges this job actually needs: 2nd-floor stairs, piano handling.",
      "Totaling it, itemized, so Devin sees exactly what he's paying for.",
    ],
  },
};
```

- [ ] **Step 3: Create `provider.ts`**

```ts
import type {
  Business,
  Intake,
  ScopeField,
  Quote,
  Approval,
  Acceptance,
  ResultsSummary,
  AiStep,
  AiReasoning,
  WorkflowProvider,
} from "./types";
import {
  business,
  intake,
  scope,
  quote,
  approval,
  acceptance,
  results,
  aiReasoning,
} from "./script";

class ScriptedWorkflowProvider implements WorkflowProvider {
  getBusiness(): Business {
    return business;
  }

  getIntake(): Intake {
    return intake;
  }

  getScope(): ScopeField[] {
    return scope;
  }

  getQuote(): Quote {
    return quote;
  }

  getApproval(): Approval {
    return approval;
  }

  getAcceptance(): Acceptance {
    return acceptance;
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

- [ ] **Step 4: Verify build + lint**

Run: `npm run build && npm run lint`
Expected: PASS — no errors. (These three files compile as a self-contained unit; nothing imports them yet, so no runtime surface. `tsc` still type-checks them under the project `include`.)

- [ ] **Step 5: Commit**

```bash
git add src/demos/automatedQuoting/types.ts src/demos/automatedQuoting/script.ts src/demos/automatedQuoting/provider.ts
git commit -m "feat: add automated-quoting demo data layer"
```

---

### Task 2: Step list, scoped stylesheet, intake + scope steps

**Files:**
- Create: `src/demos/automatedQuoting/steps.ts`
- Create: `src/demos/automatedQuoting/quoting.css`
- Create: `src/demos/automatedQuoting/steps/RequestStep.tsx`
- Create: `src/demos/automatedQuoting/steps/UnderstandStep.tsx`

**Interfaces:**
- Consumes: `WorkflowProvider` (`getBusiness`, `getIntake`, `getScope`, `getAiReasoning`) from Task 1; `DemoStep` from `../shared/types`; `AiPanel` and `usePrefersReducedMotion` from `../../shared/`.
- Produces: `export const steps: DemoStep[]` (6 entries); default-exported `RequestStep` and `UnderstandStep` components, each `({ provider }: { provider: WorkflowProvider })`. `quoting.css` defines every `qt-*` class used across all six steps (created in full here so later tasks only consume classes).

- [ ] **Step 1: Create `steps.ts`**

```ts
import {
  FaInbox,
  FaBrain,
  FaFileInvoiceDollar,
  FaUserCheck,
  FaPaperPlane,
  FaChartLine,
} from "react-icons/fa";
import type { DemoStep } from "../shared/types";

export const steps: DemoStep[] = [
  { id: "request", label: "Request comes in", Icon: FaInbox },
  { id: "understand", label: "Understand the job", Icon: FaBrain, isAi: true },
  { id: "build", label: "Build the quote", Icon: FaFileInvoiceDollar, isAi: true },
  { id: "review", label: "Owner review", Icon: FaUserCheck },
  { id: "send", label: "Send & accept", Icon: FaPaperPlane },
  { id: "results", label: "Results", Icon: FaChartLine },
];
```

- [ ] **Step 2: Create `quoting.css`** (complete stylesheet for all six steps)

```css
.qt-step {
  color: var(--demo-text);
}

.qt-heading {
  font-size: 1.15rem;
  margin: 0 0 var(--spacing-xs);
}

.qt-sub {
  color: var(--demo-muted);
  margin: 0 0 var(--spacing-md);
  max-width: 60ch;
}

.qt-note {
  color: var(--demo-muted);
  font-size: 0.85rem;
  margin: var(--spacing-md) 0 0;
}

/* Badge */
.qt-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  margin-top: var(--spacing-md);
  padding: 0.35rem 0.75rem;
  border-radius: 999px;
  background: rgba(16, 185, 129, 0.14);
  color: var(--demo-success);
  font-size: 0.8rem;
  font-weight: 700;
}
.qt-badge-icon {
  font-size: 0.85rem;
}

/* Intake card (step 1) */
.qt-intake {
  padding: var(--spacing-md);
  background: var(--demo-surface-2);
  border: 1px solid var(--demo-border);
  border-left: 3px solid var(--demo-accent-bright);
  border-radius: 0.6rem;
}
.qt-intake-head {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  margin-bottom: var(--spacing-sm);
}
.qt-intake-icon {
  font-size: 1.5rem;
  color: var(--demo-accent-bright);
}
.qt-intake-meta {
  min-width: 0;
}
.qt-intake-name {
  font-weight: 700;
  margin: 0;
}
.qt-intake-channel {
  color: var(--demo-muted);
  font-size: 0.8rem;
  margin: 0.1rem 0 0;
}
.qt-intake-body {
  margin: 0;
  line-height: 1.6;
  font-style: italic;
}

/* Reveal wrapper */
.qt-reveal {
  opacity: 0;
  transform: translateY(6px);
  transition: opacity 0.4s ease, transform 0.4s ease;
  margin-top: var(--spacing-md);
}
.qt-reveal.is-shown {
  opacity: 1;
  transform: none;
}

/* Scope list (step 2) */
.qt-scope {
  margin: 0;
  border: 1px solid var(--demo-border);
  border-radius: 0.6rem;
  overflow: hidden;
}
.qt-scope-row {
  display: flex;
  gap: var(--spacing-sm);
  padding: 0.6rem var(--spacing-md);
  background: var(--demo-surface-2);
  border-bottom: 1px solid var(--demo-border);
}
.qt-scope-row:last-child {
  border-bottom: none;
}
.qt-scope-label {
  flex: 0 0 40%;
  color: var(--demo-muted);
  font-size: 0.85rem;
  margin: 0;
}
.qt-scope-value {
  flex: 1 1 auto;
  margin: 0;
  font-weight: 600;
}

/* Itemized quote card (steps 3 & 4) — the hero */
.qt-quote {
  padding: var(--spacing-md);
  background: var(--demo-surface-2);
  border: 1px solid var(--demo-border);
  border-radius: 0.6rem;
}
.qt-quote-head {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  margin-bottom: var(--spacing-sm);
}
.qt-quote-icon {
  color: var(--demo-accent-bright);
  font-size: 1.2rem;
}
.qt-quote-title {
  font-size: 0.78rem;
  color: var(--demo-muted);
  text-transform: uppercase;
  letter-spacing: 0.04em;
  font-weight: 600;
}
.qt-quote-lines {
  list-style: none;
  margin: 0;
  padding: 0;
}
.qt-quote-line {
  display: flex;
  align-items: baseline;
  gap: var(--spacing-sm);
  padding: 0.55rem 0;
  border-bottom: 1px solid var(--demo-border);
}
.qt-quote-line-main {
  flex: 1 1 auto;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 0.1rem;
}
.qt-quote-line-label {
  font-weight: 600;
}
.qt-quote-line-detail {
  color: var(--demo-muted);
  font-size: 0.82rem;
}
.qt-quote-line-amount {
  flex: 0 0 auto;
  font-weight: 700;
  font-variant-numeric: tabular-nums;
}
.qt-quote-total {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: var(--spacing-sm);
  margin-top: var(--spacing-sm);
  padding-top: var(--spacing-sm);
}
.qt-quote-total-label {
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  font-size: 0.85rem;
  color: var(--demo-muted);
}
.qt-quote-total-amount {
  font-size: 1.6rem;
  font-weight: 800;
  color: var(--demo-accent-bright);
  font-variant-numeric: tabular-nums;
}
.qt-quote-validity {
  margin: var(--spacing-xs) 0 0;
  color: var(--demo-muted);
  font-size: 0.78rem;
}

/* Owner review (step 4) */
.qt-approve-banner {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  margin-bottom: var(--spacing-md);
  padding: var(--spacing-sm) var(--spacing-md);
  background: rgba(16, 185, 129, 0.1);
  border: 1px solid var(--demo-success);
  border-radius: 0.6rem;
  font-weight: 600;
}
.qt-approve-banner-icon {
  color: var(--demo-success);
  font-size: 1.2rem;
}
.qt-approve-actions {
  display: flex;
  gap: var(--spacing-sm);
  flex-wrap: wrap;
  margin-top: var(--spacing-md);
}
.qt-approve-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.55rem 1.1rem;
  border-radius: 0.5rem;
  font-weight: 700;
  font-size: 0.9rem;
  cursor: default;
  user-select: none;
}
.qt-approve-btn-primary {
  background: var(--demo-accent-bright);
  color: #0a0a0a;
}
.qt-approve-btn-ghost {
  background: transparent;
  border: 1px solid var(--demo-border);
  color: var(--demo-muted);
}
.qt-approve-btn-icon {
  font-size: 0.85rem;
}

/* Send lifecycle (step 5) */
.qt-outbox {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}
.qt-stages {
  list-style: none;
  display: flex;
  gap: var(--spacing-sm);
  padding: 0;
  margin: 0;
}
.qt-stage {
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
.qt-stage.is-active {
  opacity: 1;
  color: var(--demo-text);
  border-color: var(--demo-accent-bright);
}
.qt-stage.is-done {
  color: var(--demo-accent-bright);
}
.qt-stage-icon {
  font-size: 1.2rem;
}
.qt-stage-label {
  font-size: 0.8rem;
}

/* Acceptance reveal (step 5) */
.qt-accept {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
  opacity: 0;
  transform: translateY(6px);
  transition: opacity 0.4s ease, transform 0.4s ease;
}
.qt-accept.is-shown {
  opacity: 1;
  transform: none;
}
.qt-accept-reply {
  padding: var(--spacing-md);
  background: var(--demo-surface-2);
  border: 1px solid var(--demo-border);
  border-radius: 0.6rem;
}
.qt-accept-reply-head {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  margin-bottom: var(--spacing-xs);
}
.qt-accept-reply-icon {
  color: var(--demo-accent-bright);
}
.qt-accept-reply-from {
  font-weight: 700;
}
.qt-accept-reply-body {
  margin: 0;
  line-height: 1.5;
}
.qt-accept-booking {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-md);
  background: rgba(16, 185, 129, 0.1);
  border: 1px solid var(--demo-success);
  border-radius: 0.6rem;
}
.qt-accept-booking-icon {
  color: var(--demo-success);
  font-size: 1.5rem;
}
.qt-accept-booking-title {
  font-weight: 700;
  margin: 0;
}
.qt-accept-booking-meta {
  color: var(--demo-muted);
  margin: 0.15rem 0 0;
  font-size: 0.9rem;
}

/* Results tally (step 6) */
.qt-tally {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: var(--spacing-sm);
  margin-bottom: var(--spacing-md);
}
.qt-tally-item {
  padding: var(--spacing-md);
  text-align: center;
  background: var(--demo-surface-2);
  border: 1px solid var(--demo-border);
  border-radius: 0.6rem;
}
.qt-tally-item-hl {
  border-color: var(--demo-accent-bright);
  box-shadow: 0 0 16px var(--demo-accent-glow);
}
.qt-tally-num {
  display: block;
  font-size: 1.8rem;
  font-weight: 700;
  color: var(--demo-accent-bright);
}
.qt-tally-label {
  color: var(--demo-muted);
  font-size: 0.85rem;
}
.qt-takeaway {
  color: var(--demo-muted);
  max-width: 60ch;
  margin: 0;
}

@media (max-width: 600px) {
  .qt-stages {
    flex-direction: column;
  }
  .qt-scope-row {
    flex-direction: column;
    gap: 0.1rem;
  }
  .qt-scope-label {
    flex-basis: auto;
  }
  .qt-approve-actions {
    flex-direction: column;
  }
  .qt-approve-btn {
    justify-content: center;
  }
}
```

- [ ] **Step 3: Create `steps/RequestStep.tsx`** (step 1 — raw intake card, non-AI)

```tsx
import { FaInbox, FaBolt } from "react-icons/fa";
import type { WorkflowProvider } from "../types";

const RequestStep = ({ provider }: { provider: WorkflowProvider }) => {
  const business = provider.getBusiness();
  const intake = provider.getIntake();

  return (
    <div className="qt-step">
      <h3 className="qt-heading">A lead asks for a price — in their own words</h3>
      <p className="qt-sub">
        {business.name} lives and dies on fast, accurate quotes. Here's one
        coming in — messy and conversational, the way real customers write.
      </p>

      <div className="qt-intake">
        <div className="qt-intake-head">
          <FaInbox className="qt-intake-icon" />
          <div className="qt-intake-meta">
            <p className="qt-intake-name">{intake.customerName}</p>
            <p className="qt-intake-channel">
              via {intake.channel} · {intake.receivedLabel}
            </p>
          </div>
        </div>
        <p className="qt-intake-body">"{intake.rawText}"</p>
      </div>

      <div className="qt-badge">
        <FaBolt className="qt-badge-icon" />
        A lead worth a fast, accurate quote
      </div>
    </div>
  );
};

export default RequestStep;
```

- [ ] **Step 4: Create `steps/UnderstandStep.tsx`** (step 2 — AI parses to scope list)

```tsx
import { useState } from "react";
import type { WorkflowProvider } from "../types";
import { usePrefersReducedMotion } from "../../shared/usePrefersReducedMotion";
import AiPanel from "../../shared/AiPanel";

const UnderstandStep = ({ provider }: { provider: WorkflowProvider }) => {
  const intake = provider.getIntake();
  const scope = provider.getScope();
  const reasoning = provider.getAiReasoning("understand");
  const reduced = usePrefersReducedMotion();
  const [revealed, setRevealed] = useState(reduced);

  const firstName = intake.customerName.split(" ")[0];

  return (
    <div className="qt-step">
      <h3 className="qt-heading">It turns the mess into a clear scope</h3>
      <p className="qt-sub">
        Claude reads {firstName}'s message and pulls out the details that
        actually drive the price.
      </p>

      <AiPanel
        title={reasoning.title}
        lines={reasoning.lines}
        onComplete={() => setRevealed(true)}
      />

      <div className={"qt-reveal" + (revealed ? " is-shown" : "")}>
        <dl className="qt-scope">
          {scope.map((field) => (
            <div key={field.label} className="qt-scope-row">
              <dt className="qt-scope-label">{field.label}</dt>
              <dd className="qt-scope-value">{field.value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  );
};

export default UnderstandStep;
```

- [ ] **Step 5: Verify build + lint**

Run: `npm run build && npm run lint`
Expected: PASS. `AiPanel` default export and `usePrefersReducedMotion` named export resolve; no unused imports (`FaBolt`, `FaInbox` both used).

- [ ] **Step 6: Commit**

```bash
git add src/demos/automatedQuoting/steps.ts src/demos/automatedQuoting/quoting.css src/demos/automatedQuoting/steps/RequestStep.tsx src/demos/automatedQuoting/steps/UnderstandStep.tsx
git commit -m "feat: add automated-quoting step list, styles, intake + scope steps"
```

---

### Task 3: Quote card, build step (hero), owner-review step

**Files:**
- Create: `src/demos/automatedQuoting/steps/QuoteCard.tsx`
- Create: `src/demos/automatedQuoting/steps/BuildStep.tsx`
- Create: `src/demos/automatedQuoting/steps/ReviewStep.tsx`

**Interfaces:**
- Consumes: `Quote` type + `WorkflowProvider` (`getQuote`, `getApproval`, `getAiReasoning`) from Task 1; `AiPanel`, `usePrefersReducedMotion` from `../../shared/`; `qt-quote*` / `qt-approve*` classes from Task 2.
- Produces: default-exported `QuoteCard` (`({ quote }: { quote: Quote })`), reused by both `BuildStep` and `ReviewStep`; default-exported `BuildStep` and `ReviewStep`, each `({ provider }: { provider: WorkflowProvider })`.

- [ ] **Step 1: Create `steps/QuoteCard.tsx`** (shared presentational card — the hero UI)

```tsx
import { FaFileInvoiceDollar } from "react-icons/fa";
import type { Quote } from "../types";

const QuoteCard = ({ quote }: { quote: Quote }) => (
  <div className="qt-quote">
    <div className="qt-quote-head">
      <FaFileInvoiceDollar className="qt-quote-icon" />
      <span className="qt-quote-title">Itemized estimate</span>
    </div>
    <ul className="qt-quote-lines">
      {quote.lineItems.map((item) => (
        <li key={item.label} className="qt-quote-line">
          <div className="qt-quote-line-main">
            <span className="qt-quote-line-label">{item.label}</span>
            <span className="qt-quote-line-detail">{item.detail}</span>
          </div>
          <span className="qt-quote-line-amount">{item.amount}</span>
        </li>
      ))}
    </ul>
    <div className="qt-quote-total">
      <span className="qt-quote-total-label">Total estimate</span>
      <span className="qt-quote-total-amount">{quote.total}</span>
    </div>
    <p className="qt-quote-validity">{quote.validityNote}</p>
  </div>
);

export default QuoteCard;
```

- [ ] **Step 2: Create `steps/BuildStep.tsx`** (step 3 — AI builds the quote, reveals `QuoteCard`)

```tsx
import { useState } from "react";
import type { WorkflowProvider } from "../types";
import { usePrefersReducedMotion } from "../../shared/usePrefersReducedMotion";
import AiPanel from "../../shared/AiPanel";
import QuoteCard from "./QuoteCard";

const BuildStep = ({ provider }: { provider: WorkflowProvider }) => {
  const quote = provider.getQuote();
  const reasoning = provider.getAiReasoning("build");
  const reduced = usePrefersReducedMotion();
  const [revealed, setRevealed] = useState(reduced);

  return (
    <div className="qt-step">
      <h3 className="qt-heading">It builds the quote, line by line</h3>
      <p className="qt-sub">
        Claude prices each piece from the shop's rate card and totals it — an
        itemized estimate, not a templated guess.
      </p>

      <AiPanel
        title={reasoning.title}
        lines={reasoning.lines}
        onComplete={() => setRevealed(true)}
      />

      <div className={"qt-reveal" + (revealed ? " is-shown" : "")}>
        <QuoteCard quote={quote} />
      </div>
    </div>
  );
};

export default BuildStep;
```

- [ ] **Step 3: Create `steps/ReviewStep.tsx`** (step 4 — owner-in-the-loop, reuses `QuoteCard`; actions presentational)

```tsx
import { FaUserCheck, FaPaperPlane, FaPen } from "react-icons/fa";
import type { WorkflowProvider } from "../types";
import QuoteCard from "./QuoteCard";

const ReviewStep = ({ provider }: { provider: WorkflowProvider }) => {
  const quote = provider.getQuote();
  const approval = provider.getApproval();

  return (
    <div className="qt-step">
      <h3 className="qt-heading">You stay in control — one tap to send</h3>
      <p className="qt-sub">
        The AI did the grunt work. The quote lands in your queue ready to go —
        you approve it, or tweak a line first.
      </p>

      <div className="qt-approve-banner">
        <FaUserCheck className="qt-approve-banner-icon" />
        <span>{approval.summary}</span>
      </div>

      <QuoteCard quote={quote} />

      <div className="qt-approve-actions">
        <span className="qt-approve-btn qt-approve-btn-primary">
          <FaPaperPlane className="qt-approve-btn-icon" />
          Approve &amp; send
        </span>
        <span className="qt-approve-btn qt-approve-btn-ghost">
          <FaPen className="qt-approve-btn-icon" />
          Tweak a line
        </span>
      </div>

      <p className="qt-note">{approval.ownerAction}</p>
    </div>
  );
};

export default ReviewStep;
```

- [ ] **Step 4: Verify build + lint**

Run: `npm run build && npm run lint`
Expected: PASS. `QuoteCard` resolves from both consumers; all imported icons used.

- [ ] **Step 5: Commit**

```bash
git add src/demos/automatedQuoting/steps/QuoteCard.tsx src/demos/automatedQuoting/steps/BuildStep.tsx src/demos/automatedQuoting/steps/ReviewStep.tsx
git commit -m "feat: add automated-quoting quote card, build and owner-review steps"
```

---

### Task 4: Send-and-accept step, results step

**Files:**
- Create: `src/demos/automatedQuoting/steps/SendStep.tsx`
- Create: `src/demos/automatedQuoting/steps/ResultsStep.tsx`

**Interfaces:**
- Consumes: `WorkflowProvider` (`getAcceptance`, `getResults`) from Task 1; `useSendLifecycle` + `SendStatus` from `../../shared/SendLifecycleProvider`; `usePrefersReducedMotion` from `../../shared/`; `qt-outbox`/`qt-stages`/`qt-accept*`/`qt-tally*` classes from Task 2.
- Produces: default-exported `SendStep` and `ResultsStep`, each `({ provider }: { provider: WorkflowProvider })`. `SendStep` drives the shared send lifecycle (`start()` on mount; `markReplied()` after the `opened` stage) and reveals the acceptance card.

- [ ] **Step 1: Create `steps/SendStep.tsx`** (step 5 — send lifecycle strip → acceptance reveal)

```tsx
import { useEffect, useRef, useState } from "react";
import {
  FaPaperPlane,
  FaCheck,
  FaEnvelopeOpenText,
  FaReply,
  FaCalendarCheck,
} from "react-icons/fa";
import type { WorkflowProvider } from "../types";
import {
  useSendLifecycle,
  type SendStatus,
} from "../../shared/SendLifecycleProvider";
import { usePrefersReducedMotion } from "../../shared/usePrefersReducedMotion";

const ORDER: SendStatus[] = ["sending", "delivered", "opened"];
const REPLY_DELAY_MS = 700;

function statusRank(s: SendStatus): number {
  if (s === "idle") return -1;
  if (s === "replied") return ORDER.length - 1;
  return ORDER.indexOf(s);
}

const SendStep = ({ provider }: { provider: WorkflowProvider }) => {
  const acceptance = provider.getAcceptance();
  const { status, start, markReplied } = useSendLifecycle();
  const reduced = usePrefersReducedMotion();
  const started = useRef(false);
  const replyTimer = useRef<number | null>(null);
  const [accepted, setAccepted] = useState(reduced);

  useEffect(() => {
    if (started.current) return;
    started.current = true;
    start();
  }, [start]);

  useEffect(() => {
    if (status !== "opened") return;
    if (reduced) {
      setAccepted(true);
      markReplied();
      return;
    }
    replyTimer.current = window.setTimeout(() => {
      setAccepted(true);
      markReplied();
    }, REPLY_DELAY_MS);
    return () => {
      if (replyTimer.current !== null) window.clearTimeout(replyTimer.current);
    };
  }, [status, reduced, markReplied]);

  const rank = statusRank(status);
  const stages = [
    { id: "sending", label: "Sending", icon: <FaPaperPlane /> },
    { id: "delivered", label: "Delivered", icon: <FaCheck /> },
    { id: "opened", label: "Read", icon: <FaEnvelopeOpenText /> },
  ];

  return (
    <div className="qt-step">
      <h3 className="qt-heading">Sent — and the job books itself</h3>
      <p className="qt-sub">
        The quote goes out the moment you approve it. {acceptance.customerName}{" "}
        sees a fast, professional estimate — and says yes.
      </p>

      <div className="qt-outbox">
        <ol className="qt-stages">
          {stages.map((stage, i) => (
            <li
              key={stage.id}
              className={
                "qt-stage" +
                (rank >= i ? " is-active" : "") +
                (rank > i ? " is-done" : "")
              }
            >
              <span className="qt-stage-icon">{stage.icon}</span>
              <span className="qt-stage-label">{stage.label}</span>
            </li>
          ))}
        </ol>

        <div className={"qt-accept" + (accepted ? " is-shown" : "")}>
          <div className="qt-accept-reply">
            <div className="qt-accept-reply-head">
              <FaReply className="qt-accept-reply-icon" />
              <span className="qt-accept-reply-from">
                {acceptance.customerName}
              </span>
            </div>
            <p className="qt-accept-reply-body">{acceptance.replyBody}</p>
          </div>
          <div className="qt-accept-booking">
            <FaCalendarCheck className="qt-accept-booking-icon" />
            <div>
              <p className="qt-accept-booking-title">
                Booked — {acceptance.bookedDate}
              </p>
              <p className="qt-accept-booking-meta">{acceptance.jobValue}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SendStep;
```

- [ ] **Step 2: Create `steps/ResultsStep.tsx`** (step 6 — month recap tally)

```tsx
import type { WorkflowProvider } from "../types";

const ResultsStep = ({ provider }: { provider: WorkflowProvider }) => {
  const results = provider.getResults();
  const tally = [
    { num: String(results.requests), label: "Quote requests" },
    { num: String(results.quotesSent), label: "Quotes sent" },
    { num: results.avgTurnaround, label: "Avg turnaround", hl: true },
    { num: String(results.jobsBooked), label: "Jobs booked" },
    { num: results.winRate, label: "Win rate" },
    { num: results.revenueQuoted, label: "Revenue quoted" },
  ];

  return (
    <div className="qt-step">
      <h3 className="qt-heading">One month, quotes on autopilot</h3>
      <p className="qt-sub">
        Every request answered in minutes, every quote itemized and consistent.
      </p>

      <div className="qt-tally">
        {tally.map((t) => (
          <div
            key={t.label}
            className={"qt-tally-item" + (t.hl ? " qt-tally-item-hl" : "")}
          >
            <span className="qt-tally-num">{t.num}</span>
            <span className="qt-tally-label">{t.label}</span>
          </div>
        ))}
      </div>

      <p className="qt-takeaway">{results.takeaway}</p>
    </div>
  );
};

export default ResultsStep;
```

- [ ] **Step 3: Verify build + lint**

Run: `npm run build && npm run lint`
Expected: PASS. `useSendLifecycle`/`SendStatus` resolve; cleanup clears the reply timer; all imported icons used.

- [ ] **Step 4: Commit**

```bash
git add src/demos/automatedQuoting/steps/SendStep.tsx src/demos/automatedQuoting/steps/ResultsStep.tsx
git commit -m "feat: add automated-quoting send-and-accept and results steps"
```

---

### Task 5: Compose demo, wire route + example card, full verification

**Files:**
- Create: `src/demos/automatedQuoting/AutomatedQuotingDemo.tsx`
- Modify: `src/App.tsx` (add import + `<Route>`, outside `Layout`)
- Modify: `src/components/AutomatedWorkflows.tsx` (add `to` on `examples[3]`)

**Interfaces:**
- Consumes: `steps` (Task 2), `scriptedWorkflowProvider` (Task 1), all six step components (Tasks 2–4), shared `DemoProvider`/`SendLifecycleProvider`/`DemoShell`.
- Produces: default-exported `AutomatedQuotingDemo`; a live route at `/demos/automated-quoting`; the "Automated Quoting" example card becomes a `<Link>`.

- [ ] **Step 1: Create `AutomatedQuotingDemo.tsx`**

```tsx
import type { ReactNode } from "react";
import { DemoProvider } from "../shared/DemoController";
import { SendLifecycleProvider } from "../shared/SendLifecycleProvider";
import DemoShell from "../shared/DemoShell";
import { steps } from "./steps";
import { scriptedWorkflowProvider } from "./provider";
import RequestStep from "./steps/RequestStep";
import UnderstandStep from "./steps/UnderstandStep";
import BuildStep from "./steps/BuildStep";
import ReviewStep from "./steps/ReviewStep";
import SendStep from "./steps/SendStep";
import ResultsStep from "./steps/ResultsStep";
import "./quoting.css";

const provider = scriptedWorkflowProvider;

function renderStage(stepId: string): ReactNode {
  switch (stepId) {
    case "request":
      return <RequestStep provider={provider} />;
    case "understand":
      return <UnderstandStep provider={provider} />;
    case "build":
      return <BuildStep provider={provider} />;
    case "review":
      return <ReviewStep provider={provider} />;
    case "send":
      return <SendStep provider={provider} />;
    case "results":
      return <ResultsStep provider={provider} />;
    default:
      return null;
  }
}

const AutomatedQuotingDemo = () => {
  const business = provider.getBusiness();
  return (
    <DemoProvider steps={steps}>
      <SendLifecycleProvider>
        <DemoShell
          eyebrow="Paradigm Shift — Automation Demo"
          title={`Automated quoting for ${business.name}`}
          lede="A click-through of how a messy request becomes an itemized, ready-to-send quote — with you still in control of the send."
          renderStage={renderStage}
        />
      </SendLifecycleProvider>
    </DemoProvider>
  );
};

export default AutomatedQuotingDemo;
```

- [ ] **Step 2: Wire the route in `src/App.tsx`**

Add the import alongside the other demo imports (after the `ReviewGenerationDemo` import at line 9):

```tsx
import AutomatedQuotingDemo from "./demos/automatedQuoting/AutomatedQuotingDemo";
```

Add the route after the `review-generation` route (inside `<Routes>`, **outside** the `Layout` route), before `</Routes>`:

```tsx
      <Route
        path="/demos/automated-quoting"
        element={<AutomatedQuotingDemo />}
      />
```

- [ ] **Step 3: Wire the example card in `src/components/AutomatedWorkflows.tsx`**

In the `examples` array, add a `to` field to the "Automated Quoting" entry (`examples[3]`) so it matches its siblings:

```tsx
  {
    icon: FaFileInvoiceDollar,
    title: "Automated Quoting",
    description: "From intake to a ready-to-send quote",
    to: "/demos/automated-quoting",
  },
```

- [ ] **Step 4: Verify build + lint**

Run: `npm run build && npm run lint`
Expected: PASS — all six step components now imported and used; no unused imports; zero lint warnings.

- [ ] **Step 5: Dev smoke test**

Run: `npm run dev`, open `http://localhost:5173/demos/automated-quoting`. Confirm:
- All 6 steps advance via the vertical rail and Next/Back.
- Step 1 intake card shows the raw request text.
- Steps 2 & 3 play the `AiPanel`, then reveal the scope list (2) and the itemized quote card (3).
- Step 4 shows the quote card + "Approve & send" / "Tweak a line" (presentational).
- Step 5 animates the send lifecycle strip, then reveals Devin's reply + booked card.
- Step 6 renders the results tally + takeaway.
- No horizontal scroll at a 375px-wide viewport; quote line-item rows stay readable.
- With OS "reduce motion" enabled, AI panels and reveals show content instantly.
- On `/services/automated-workflows`, the "Automated Quoting" card is now a link to this demo.

- [ ] **Step 6: Commit**

```bash
git add src/demos/automatedQuoting/AutomatedQuotingDemo.tsx src/App.tsx src/components/AutomatedWorkflows.tsx
git commit -m "feat: wire automated-quoting demo route and example card"
```

- [ ] **Step 7: Export markdown to Obsidian** (global CLAUDE.md rule)

Copy this plan and the design spec to the mirrored vault path (kebab-case, create dirs as needed):

```bash
mkdir -p "/Users/brian/Documents/dev-vault/projects/paradigm/consulting-website/docs/superpowers/plans" \
         "/Users/brian/Documents/dev-vault/projects/paradigm/consulting-website/docs/superpowers/specs"
cp docs/superpowers/plans/2026-07-12-automated-quoting-demo.md \
   "/Users/brian/Documents/dev-vault/projects/paradigm/consulting-website/docs/superpowers/plans/"
cp docs/superpowers/specs/2026-07-12-automated-quoting-demo-design.md \
   "/Users/brian/Documents/dev-vault/projects/paradigm/consulting-website/docs/superpowers/specs/"
```

---

## Notes for the implementer

- **Send lifecycle timing:** `SendLifecycleProvider` runs `sending → delivered → opened` over ~2.2s, then `SendStep` waits `REPLY_DELAY_MS` (700ms) before `markReplied()` + revealing the acceptance. Under reduced motion the provider jumps straight to `opened` and `SendStep` reveals instantly.
- **Why `QuoteCard` is extracted:** the itemized quote appears in both step 3 (build) and step 4 (owner review). One component, two consumers — DRY.
- **`getBusiness().service` and `getIntake().channel`:** `service` is available on `Business` for parity with sibling demos but is not required to be rendered; `channel` renders in the intake card. Neither is a lint concern (they're object fields, not imports).
