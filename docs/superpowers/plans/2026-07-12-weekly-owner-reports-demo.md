# Weekly Owner Reports Demo Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a scripted 6-step interactive demo for the "Weekly Owner Reports" automation on the shared demo engine, and link it from its example card on the Automated Workflows page.

**Architecture:** New thin folder `src/demos/weeklyReports/` mirroring `src/demos/invoiceReminders/` — a `WorkflowProvider` interface with a single scripted implementation, six `DemoStep`s, six step components, and one scoped stylesheet. Everything else (shell, flow rail, AI panel, send lifecycle, reduced-motion) is reused unchanged from `src/demos/shared/`. No engine/shared changes. Two wiring edits: a route in `App.tsx` and a `to` field on the existing example card in `AutomatedWorkflows.tsx`.

**Tech Stack:** React 18 + TypeScript, Vite 5, vanilla CSS with custom properties, `react-icons/fa`, `react-router-dom` v6.

## Global Constraints

- **No test framework exists.** Verification per repo convention is `npm run build` (tsc + Vite) as the compile gate after each task, plus a `npm run dev` smoke and `npm run lint` (zero warnings) at the end. There are no unit tests to write.
- **No engine/shared changes.** Do not modify anything under `src/demos/shared/`. Reuse `DemoProvider`, `SendLifecycleProvider`, `DemoShell`, `AiPanel`, `usePrefersReducedMotion` as-is.
- **Class prefix `wr-*`** for every new CSS class. Scope all styles to `src/demos/weeklyReports/reports.css`.
- **Styling tokens only:** use the `.demo`-scoped `--demo-*` palette tokens (`--demo-text`, `--demo-muted`, `--demo-surface`, `--demo-surface-2`, `--demo-border`, `--demo-accent-bright`, `--demo-success`) and the global `--spacing-*` tokens. Amber accent is the literal `#f4b740` (matches sibling demos); there is no amber token.
- **Two AI steps** (`analyze`, `write`) render the shared `AiPanel`; `AiStep = "analyze" | "write"`.
- **Route path:** `/demos/weekly-reports`. Registered **outside** the `Layout` route, next to the other demo routes.
- **No horizontal scroll at mobile widths.** Match the prior demos' media queries (breakpoints ~640px / 768px).
- Content values are illustrative and tunable during implementation; the `WorkflowProvider` interface and type shapes are fixed.

---

### Task 1: Data layer — types, script, provider, CSS base

Defines the fixed interface + all mock content, plus the base stylesheet the step components build on. Compiles standalone (files are type-checked by `tsc` even before they are imported anywhere).

**Files:**
- Create: `src/demos/weeklyReports/types.ts`
- Create: `src/demos/weeklyReports/script.ts`
- Create: `src/demos/weeklyReports/provider.ts`
- Create: `src/demos/weeklyReports/reports.css`

**Interfaces:**
- Produces (consumed by every later task):
  - `WorkflowProvider` with `getBusiness(): Business`, `getRawData(): RawMetric[]`, `getFindings(): Finding[]`, `getDigest(): Digest`, `getDelivery(): Delivery`, `getActionResult(): ActionResult`, `getResults(): ResultsSummary`, `getAiReasoning(step: AiStep): AiReasoning`.
  - `scriptedWorkflowProvider: WorkflowProvider` (singleton export).
  - Types: `Business`, `RawMetric`, `Finding`, `RecommendedAction`, `Digest`, `Delivery`, `ActionResult`, `ResultsSummary`, `AiReasoning`, and the unions `AiStep = "analyze" | "write"`, `Trend = "good" | "watch" | "flat"`.
  - CSS base classes: `.wr-step`, `.wr-heading`, `.wr-sub`, `.wr-note`, `.wr-reveal` / `.wr-reveal.is-shown`.

- [ ] **Step 1: Write `types.ts`**

```ts
export type AiStep = "analyze" | "write";
export type Trend = "good" | "watch" | "flat";

export interface Business {
  name: string;
  service: string;
  context: string;
}

export interface RawMetric {
  source: string;
  label: string;
  value: string;
}

export interface Finding {
  label: string;
  value: string;
  delta: string;
  trend: Trend;
}

export interface RecommendedAction {
  summary: string;
  actionLabel: string;
}

export interface Digest {
  headline: string;
  highlights: string[];
  watchOut: string;
  recommendedAction: RecommendedAction;
}

export interface Delivery {
  recipientName: string;
  channel: string;
  sentLabel: string;
}

export interface ActionResult {
  confirmation: string;
  detail: string;
}

export interface ResultsSummary {
  reportsDelivered: number;
  avgReadTime: string;
  actionsTaken: number;
  hoursSaved: string;
  takeaway: string;
}

export interface AiReasoning {
  step: AiStep;
  title: string;
  lines: string[];
}

export interface WorkflowProvider {
  getBusiness(): Business;
  getRawData(): RawMetric[];
  getFindings(): Finding[];
  getDigest(): Digest;
  getDelivery(): Delivery;
  getActionResult(): ActionResult;
  getResults(): ResultsSummary;
  getAiReasoning(step: AiStep): AiReasoning;
}
```

- [ ] **Step 2: Write `script.ts`**

```ts
import type {
  Business,
  RawMetric,
  Finding,
  Digest,
  Delivery,
  ActionResult,
  ResultsSummary,
  AiStep,
  AiReasoning,
} from "./types";

export const business: Business = {
  name: "Evergreen Lawn & Landscape",
  service: "Lawn care, landscaping & seasonal cleanups",
  context:
    "Owner runs the crews all week — the numbers pile up in five different apps and never get looked at.",
};

export const rawData: RawMetric[] = [
  { source: "Jobs", label: "Jobs completed", value: "38" },
  { source: "Revenue", label: "Revenue booked", value: "$14,200" },
  { source: "Leads", label: "New leads", value: "23" },
  { source: "Quotes", label: "Quotes sent", value: "17" },
  { source: "Quotes", label: "Quotes still open", value: "6" },
  { source: "Reviews", label: "New reviews", value: "9" },
  { source: "Phone", label: "Missed calls", value: "12" },
  { source: "Crew", label: "Crew hours", value: "410" },
];

export const findings: Finding[] = [
  {
    label: "Revenue",
    value: "$14,200",
    delta: "up 14% vs last week",
    trend: "good",
  },
  {
    label: "Jobs completed",
    value: "38",
    delta: "5 more than last week",
    trend: "good",
  },
  { label: "New leads", value: "23", delta: "up 8%", trend: "good" },
  {
    label: "New reviews",
    value: "9",
    delta: "3 more · 4.8★ avg",
    trend: "good",
  },
  {
    label: "Missed calls",
    value: "12",
    delta: "4 fewer — all auto-answered",
    trend: "good",
  },
  {
    label: "Open quotes aging",
    value: "3 of 6",
    delta: "cold >7 days — needs a nudge",
    trend: "watch",
  },
];

export const digest: Digest = {
  headline:
    "Strong week — revenue up 14% and reviews climbing. One thing to fix: 3 quotes are going cold.",
  highlights: [
    "Revenue hit $14,200 — your best week this month, up 14%.",
    "38 jobs done and 9 fresh reviews (4.8★ avg) — the crews are firing.",
    "23 new leads in, and every missed call got answered automatically.",
  ],
  watchOut:
    "3 of your 6 open quotes haven't been touched in over a week — roughly $4k that could quietly walk.",
  recommendedAction: {
    summary:
      "Send a friendly follow-up to the 3 cold quotes before they slip away.",
    actionLabel: "Nudge the 3 cold quotes",
  },
};

export const delivery: Delivery = {
  recipientName: "Dana",
  channel: "Text + email",
  sentLabel: "Sunday 6:02 PM",
};

export const actionResult: ActionResult = {
  confirmation: "Done — follow-ups sent to all 3.",
  detail:
    "Each got a warm, personalized nudge with a link to accept. Any replies land back in your inbox.",
};

export const results: ResultsSummary = {
  reportsDelivered: 12,
  avgReadTime: "32 sec",
  actionsTaken: 27,
  hoursSaved: "~5 hrs/mo",
  takeaway:
    "Twelve Sunday-night digests, each read in about 30 seconds — 27 quick actions taken straight off them, and zero evenings lost to spreadsheets. The owner finally knows the numbers without chasing them.",
};

export const aiReasoning: Record<AiStep, AiReasoning> = {
  analyze: {
    step: "analyze",
    title: "Claude — reading the week",
    lines: [
      "Pulling every tool's numbers into one place — jobs, revenue, leads, quotes, reviews, calls, crew hours.",
      "Comparing each against last week to see what actually moved.",
      "Revenue, jobs, leads, and reviews are all up — the crews had a strong week.",
      "Flagging the outlier: 3 of 6 open quotes have gone cold, over a week untouched.",
      "Deciding what's worth the owner's 30 seconds — the wins, and the one real risk.",
    ],
  },
  write: {
    step: "write",
    title: "Claude — writing the digest",
    lines: [
      "Leading with the headline: a strong week, with one thing to fix.",
      "Backing each win with the number that proves it.",
      "Naming the one risk plainly — and the dollars quietly at stake.",
      "Ending with a single clear action the owner can take in one tap.",
      "Keeping it a 30-second read, in the owner's own voice.",
    ],
  },
};
```

- [ ] **Step 3: Write `provider.ts`**

```ts
import type {
  Business,
  RawMetric,
  Finding,
  Digest,
  Delivery,
  ActionResult,
  ResultsSummary,
  AiStep,
  AiReasoning,
  WorkflowProvider,
} from "./types";
import {
  business,
  rawData,
  findings,
  digest,
  delivery,
  actionResult,
  results,
  aiReasoning,
} from "./script";

class ScriptedWorkflowProvider implements WorkflowProvider {
  getBusiness(): Business {
    return business;
  }

  getRawData(): RawMetric[] {
    return rawData;
  }

  getFindings(): Finding[] {
    return findings;
  }

  getDigest(): Digest {
    return digest;
  }

  getDelivery(): Delivery {
    return delivery;
  }

  getActionResult(): ActionResult {
    return actionResult;
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

- [ ] **Step 4: Write `reports.css` (base classes only)**

```css
.wr-step {
  color: var(--demo-text);
}

.wr-heading {
  font-size: 1.15rem;
  margin: 0 0 var(--spacing-xs);
}

.wr-sub {
  color: var(--demo-muted);
  margin: 0 0 var(--spacing-md);
  max-width: 60ch;
}

.wr-note {
  color: var(--demo-muted);
  font-size: 0.85rem;
  margin: var(--spacing-md) 0 0;
}

/* Reveal wrapper (shared by the analyze + write steps) */
.wr-reveal {
  opacity: 0;
  transform: translateY(6px);
  transition: opacity 0.4s ease, transform 0.4s ease;
  margin-top: var(--spacing-md);
}
.wr-reveal.is-shown {
  opacity: 1;
  transform: none;
}
```

- [ ] **Step 5: Verify the tree compiles**

Run: `npm run build`
Expected: PASS — tsc reports no errors, Vite build completes. (The new files are type-checked even though nothing imports them yet.)

- [ ] **Step 6: Commit**

```bash
git add src/demos/weeklyReports/types.ts src/demos/weeklyReports/script.ts src/demos/weeklyReports/provider.ts src/demos/weeklyReports/reports.css
git commit -m "feat: add weekly-reports demo data layer and CSS base"
```

---

### Task 2: DataStep — the raw-numbers pile (step 1, `data`)

The trigger step: a dense grid of source-tagged metric chips ("the pile"). No AI.

**Files:**
- Create: `src/demos/weeklyReports/steps/DataStep.tsx`
- Modify: `src/demos/weeklyReports/reports.css` (append raw-grid styles)

**Interfaces:**
- Consumes: `WorkflowProvider.getBusiness()`, `WorkflowProvider.getRawData()` (Task 1).
- Produces: default-exported `DataStep` component taking `{ provider: WorkflowProvider }`, rendered for `stepId === "data"` (Task 8).

- [ ] **Step 1: Write `steps/DataStep.tsx`**

```tsx
import type { WorkflowProvider } from "../types";

const DataStep = ({ provider }: { provider: WorkflowProvider }) => {
  const business = provider.getBusiness();
  const raw = provider.getRawData();

  return (
    <div className="wr-step">
      <h3 className="wr-heading">
        Sunday night — a week's worth of numbers, unread
      </h3>
      <p className="wr-sub">
        {business.name} ran the crews all week. The numbers piled up across five
        different apps — revenue, jobs, leads, quotes, reviews, missed calls,
        crew hours — and no one has time to log into five dashboards to read
        them.
      </p>

      <div className="wr-rawgrid">
        {raw.map((m) => (
          <div key={m.label} className="wr-chip">
            <span className="wr-chip-source">{m.source}</span>
            <span className="wr-chip-value">{m.value}</span>
            <span className="wr-chip-label">{m.label}</span>
          </div>
        ))}
      </div>

      <p className="wr-note">
        Raw, scattered, and unglamorous — exactly the pile that never gets
        looked at.
      </p>
    </div>
  );
};

export default DataStep;
```

- [ ] **Step 2: Append raw-grid styles to `reports.css`**

```css
/* Raw-data panel (step 1) — deliberately dense "pile" of chips */
.wr-rawgrid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: var(--spacing-sm);
}
.wr-chip {
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
  padding: var(--spacing-sm);
  background: var(--demo-surface-2);
  border: 1px solid var(--demo-border);
  border-radius: 0.5rem;
  min-width: 0;
}
.wr-chip-source {
  font-size: 0.65rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--demo-muted);
}
.wr-chip-value {
  font-size: 1.2rem;
  font-weight: 700;
  color: var(--demo-text);
}
.wr-chip-label {
  font-size: 0.75rem;
  color: var(--demo-muted);
}

@media (max-width: 768px) {
  .wr-rawgrid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
```

- [ ] **Step 3: Verify the tree compiles**

Run: `npm run build`
Expected: PASS — no errors, no unused imports.

- [ ] **Step 4: Commit**

```bash
git add src/demos/weeklyReports/steps/DataStep.tsx src/demos/weeklyReports/reports.css
git commit -m "feat: add weekly-reports data step (raw-numbers pile)"
```

---

### Task 3: AnalyzeStep — AI reads the week (step 2, `analyze`, isAi)

`AiPanel` reasoning, then a findings list reveals — metric rows with good/watch trend badges. Mirrors `invoiceReminders/steps/PlanStep.tsx`.

**Files:**
- Create: `src/demos/weeklyReports/steps/AnalyzeStep.tsx`
- Modify: `src/demos/weeklyReports/reports.css` (append findings styles)

**Interfaces:**
- Consumes: `WorkflowProvider.getFindings()`, `WorkflowProvider.getAiReasoning("analyze")` (Task 1); shared `AiPanel` (props `title: string`, `lines: string[]`, `onComplete?: () => void`) and `usePrefersReducedMotion(): boolean`.
- Produces: default-exported `AnalyzeStep` taking `{ provider: WorkflowProvider }`, rendered for `stepId === "analyze"` (Task 8).

- [ ] **Step 1: Write `steps/AnalyzeStep.tsx`**

```tsx
import { useState } from "react";
import { FaExclamationTriangle } from "react-icons/fa";
import type { WorkflowProvider } from "../types";
import { usePrefersReducedMotion } from "../../shared/usePrefersReducedMotion";
import AiPanel from "../../shared/AiPanel";

const AnalyzeStep = ({ provider }: { provider: WorkflowProvider }) => {
  const findings = provider.getFindings();
  const reasoning = provider.getAiReasoning("analyze");
  const reduced = usePrefersReducedMotion();
  const [revealed, setRevealed] = useState(reduced);

  return (
    <div className="wr-step">
      <h3 className="wr-heading">It reads the whole week in one pass</h3>
      <p className="wr-sub">
        Claude pulls every tool's numbers into one place, compares them against
        last week, and flags what actually moved — and what needs attention.
      </p>

      <AiPanel
        title={reasoning.title}
        lines={reasoning.lines}
        onComplete={() => setRevealed(true)}
      />

      <div className={"wr-reveal" + (revealed ? " is-shown" : "")}>
        <div className="wr-findings">
          {findings.map((f) => (
            <div key={f.label} className="wr-finding">
              <div className="wr-finding-main">
                <span className="wr-finding-label">{f.label}</span>
                <span className="wr-finding-value">{f.value}</span>
              </div>
              <span className={"wr-badge wr-badge-" + f.trend}>
                {f.trend === "watch" && (
                  <FaExclamationTriangle aria-hidden="true" />
                )}
                {f.delta}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AnalyzeStep;
```

- [ ] **Step 2: Append findings styles to `reports.css`**

```css
/* Findings list (step 2) — analyzed metrics with trend badges */
.wr-findings {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
}
.wr-finding {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--spacing-sm);
  padding: var(--spacing-sm) var(--spacing-md);
  background: var(--demo-surface-2);
  border: 1px solid var(--demo-border);
  border-radius: 0.5rem;
}
.wr-finding-main {
  display: flex;
  align-items: baseline;
  gap: var(--spacing-sm);
  min-width: 0;
}
.wr-finding-label {
  color: var(--demo-muted);
  font-size: 0.9rem;
}
.wr-finding-value {
  font-weight: 700;
  color: var(--demo-text);
}
.wr-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.2rem 0.55rem;
  border-radius: 999px;
  font-size: 0.75rem;
  font-weight: 600;
  white-space: nowrap;
}
.wr-badge-good {
  color: var(--demo-success);
  background: rgba(16, 185, 129, 0.12);
}
.wr-badge-watch {
  color: #f4b740;
  background: rgba(244, 183, 64, 0.12);
}
.wr-badge-flat {
  color: var(--demo-muted);
  background: rgba(139, 151, 167, 0.12);
}

@media (max-width: 640px) {
  .wr-finding {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.35rem;
  }
  .wr-badge {
    white-space: normal;
  }
}
```

- [ ] **Step 3: Verify the tree compiles**

Run: `npm run build`
Expected: PASS.

- [ ] **Step 4: Commit**

```bash
git add src/demos/weeklyReports/steps/AnalyzeStep.tsx src/demos/weeklyReports/reports.css
git commit -m "feat: add weekly-reports analyze step (AI findings list)"
```

---

### Task 4: WriteStep — AI writes the digest (step 3, `write`, isAi)

`AiPanel` reasoning, then the report card reveals — headline, check-bulleted highlights, a watch-out callout, and the recommended-action row. The hero beat. Mirrors `invoiceReminders/steps/DraftStep.tsx`.

**Files:**
- Create: `src/demos/weeklyReports/steps/WriteStep.tsx`
- Modify: `src/demos/weeklyReports/reports.css` (append report-card styles)

**Interfaces:**
- Consumes: `WorkflowProvider.getDigest()`, `WorkflowProvider.getAiReasoning("write")` (Task 1); shared `AiPanel`, `usePrefersReducedMotion`.
- Produces: default-exported `WriteStep` taking `{ provider: WorkflowProvider }`, rendered for `stepId === "write"` (Task 8).

- [ ] **Step 1: Write `steps/WriteStep.tsx`**

```tsx
import { useState } from "react";
import { FaCheck, FaExclamationTriangle, FaBolt } from "react-icons/fa";
import type { WorkflowProvider } from "../types";
import { usePrefersReducedMotion } from "../../shared/usePrefersReducedMotion";
import AiPanel from "../../shared/AiPanel";

const WriteStep = ({ provider }: { provider: WorkflowProvider }) => {
  const digest = provider.getDigest();
  const reasoning = provider.getAiReasoning("write");
  const reduced = usePrefersReducedMotion();
  const [revealed, setRevealed] = useState(reduced);

  return (
    <div className="wr-step">
      <h3 className="wr-heading">It writes the report — a 30-second read</h3>
      <p className="wr-sub">
        Not a dashboard. A plain-English digest that reads like a sharp ops
        manager wrote it: the headline, the wins, the one thing to watch, and a
        single action to take.
      </p>

      <AiPanel
        title={reasoning.title}
        lines={reasoning.lines}
        onComplete={() => setRevealed(true)}
      />

      <div className={"wr-reveal" + (revealed ? " is-shown" : "")}>
        <div className="wr-report">
          <p className="wr-report-headline">{digest.headline}</p>

          <ul className="wr-highlights">
            {digest.highlights.map((h) => (
              <li key={h} className="wr-highlight">
                <FaCheck className="wr-highlight-icon" aria-hidden="true" />
                <span>{h}</span>
              </li>
            ))}
          </ul>

          <div className="wr-watchout">
            <FaExclamationTriangle
              className="wr-watchout-icon"
              aria-hidden="true"
            />
            <div>
              <p className="wr-watchout-label">One thing to watch</p>
              <p className="wr-watchout-text">{digest.watchOut}</p>
            </div>
          </div>

          <div className="wr-action-row">
            <FaBolt className="wr-action-icon" aria-hidden="true" />
            <div>
              <p className="wr-action-label">Recommended action</p>
              <p className="wr-action-text">
                {digest.recommendedAction.summary}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WriteStep;
```

- [ ] **Step 2: Append report-card styles to `reports.css`**

```css
/* Report card / digest (step 3) — the hero */
.wr-report {
  padding: var(--spacing-md);
  background: var(--demo-surface-2);
  border: 1px solid var(--demo-border);
  border-left: 3px solid var(--demo-accent-bright);
  border-radius: 0.6rem;
}
.wr-report-headline {
  font-size: 1.05rem;
  font-weight: 700;
  line-height: 1.4;
  margin: 0 0 var(--spacing-md);
  color: var(--demo-text);
}
.wr-highlights {
  list-style: none;
  margin: 0 0 var(--spacing-md);
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}
.wr-highlight {
  display: flex;
  align-items: flex-start;
  gap: var(--spacing-sm);
  color: var(--demo-text);
  font-size: 0.9rem;
  line-height: 1.4;
}
.wr-highlight-icon {
  flex: 0 0 auto;
  margin-top: 0.15rem;
  color: var(--demo-success);
}
.wr-watchout {
  display: flex;
  align-items: flex-start;
  gap: var(--spacing-sm);
  padding: var(--spacing-sm) var(--spacing-md);
  margin-bottom: var(--spacing-sm);
  background: rgba(244, 183, 64, 0.1);
  border: 1px solid rgba(244, 183, 64, 0.35);
  border-radius: 0.5rem;
}
.wr-watchout-icon {
  flex: 0 0 auto;
  margin-top: 0.15rem;
  color: #f4b740;
}
.wr-watchout-label {
  margin: 0 0 0.15rem;
  font-size: 0.7rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: #f4b740;
  font-weight: 700;
}
.wr-watchout-text {
  margin: 0;
  font-size: 0.9rem;
  line-height: 1.4;
  color: var(--demo-text);
}
.wr-action-row {
  display: flex;
  align-items: flex-start;
  gap: var(--spacing-sm);
  padding-top: var(--spacing-sm);
  border-top: 1px solid var(--demo-border);
}
.wr-action-icon {
  flex: 0 0 auto;
  margin-top: 0.15rem;
  color: var(--demo-accent-bright);
}
.wr-action-label {
  margin: 0 0 0.15rem;
  font-size: 0.7rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--demo-accent-bright);
  font-weight: 700;
}
.wr-action-text {
  margin: 0;
  font-size: 0.9rem;
  line-height: 1.4;
  color: var(--demo-text);
}
```

- [ ] **Step 3: Verify the tree compiles**

Run: `npm run build`
Expected: PASS.

- [ ] **Step 4: Commit**

```bash
git add src/demos/weeklyReports/steps/WriteStep.tsx src/demos/weeklyReports/reports.css
git commit -m "feat: add weekly-reports write step (digest report card)"
```

---

### Task 5: DeliverStep — send lifecycle to "read" (step 4, `deliver`)

Reuses the shared send lifecycle (a single digest, not a cadence ladder) and ends at "read" (no reply). Mirrors the lifecycle strip in `invoiceReminders/steps/SendStep.tsx`, simplified.

**Files:**
- Create: `src/demos/weeklyReports/steps/DeliverStep.tsx`
- Modify: `src/demos/weeklyReports/reports.css` (append deliver styles)

**Interfaces:**
- Consumes: `WorkflowProvider.getDelivery()` (Task 1); shared `useSendLifecycle()` returning `{ status: SendStatus, start: () => void, markReplied: () => void }` and the `SendStatus` type `"idle" | "sending" | "delivered" | "opened" | "replied"`. `SendLifecycleProvider` wraps the tree in Task 8, so `useSendLifecycle` resolves.
- Produces: default-exported `DeliverStep` taking `{ provider: WorkflowProvider }`, rendered for `stepId === "deliver"` (Task 8). Calls `start()` once on mount; ends at `"opened"` (labeled "Read") — never calls `markReplied()`.

- [ ] **Step 1: Write `steps/DeliverStep.tsx`**

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

const DeliverStep = ({ provider }: { provider: WorkflowProvider }) => {
  const delivery = provider.getDelivery();
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
    <div className="wr-step">
      <h3 className="wr-heading">It lands Sunday evening — and gets read</h3>
      <p className="wr-sub">
        The digest goes out as a text and email to {delivery.recipientName}. No
        login, no dashboard — just the week, in about 30 seconds.
      </p>

      <div className="wr-deliver">
        <div className="wr-deliver-meta">
          <span className="wr-deliver-to">To {delivery.recipientName}</span>
          <span className="wr-deliver-channel">
            {delivery.channel} · {delivery.sentLabel}
          </span>
        </div>

        <ol className="wr-lifecycle">
          {lifecycle.map((stage, i) => (
            <li
              key={stage.id}
              className={
                "wr-life" +
                (rank >= i ? " is-active" : "") +
                (rank > i ? " is-done" : "")
              }
            >
              <span className="wr-life-icon">{stage.icon}</span>
              <span className="wr-life-label">{stage.label}</span>
            </li>
          ))}
        </ol>

        {status === "opened" && (
          <p className="wr-deliver-note">
            Read in 32 seconds. The owner knows the week — without chasing it.
          </p>
        )}
      </div>
    </div>
  );
};

export default DeliverStep;
```

- [ ] **Step 2: Append deliver styles to `reports.css`**

```css
/* Deliver (step 4) — send lifecycle strip, ends at "read" */
.wr-deliver {
  padding: var(--spacing-md);
  background: var(--demo-surface-2);
  border: 1px solid var(--demo-border);
  border-radius: 0.6rem;
}
.wr-deliver-meta {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  justify-content: space-between;
  gap: var(--spacing-xs);
  margin-bottom: var(--spacing-md);
}
.wr-deliver-to {
  font-weight: 700;
  color: var(--demo-text);
}
.wr-deliver-channel {
  font-size: 0.8rem;
  color: var(--demo-muted);
}
.wr-lifecycle {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  gap: var(--spacing-sm);
}
.wr-life {
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
.wr-life.is-active {
  opacity: 1;
  color: var(--demo-text);
  border-color: var(--demo-accent-bright);
}
.wr-life.is-done {
  color: var(--demo-success);
  border-color: var(--demo-success);
}
.wr-life-icon {
  font-size: 1.1rem;
}
.wr-life-label {
  font-size: 0.8rem;
}
.wr-deliver-note {
  margin: var(--spacing-md) 0 0;
  font-size: 0.85rem;
  color: var(--demo-success);
}
```

- [ ] **Step 3: Verify the tree compiles**

Run: `npm run build`
Expected: PASS.

- [ ] **Step 4: Commit**

```bash
git add src/demos/weeklyReports/steps/DeliverStep.tsx src/demos/weeklyReports/reports.css
git commit -m "feat: add weekly-reports deliver step (send lifecycle to read)"
```

---

### Task 6: ActStep — one-tap action payoff (step 5, `act`)

A self-contained timed reveal (no send lifecycle). The recommended action is a tappable button; after a beat it "fires" and a confirmation card reveals. The tap is also clickable to fire immediately. Reduced motion shows the fired state instantly. Timing pattern mirrors `invoiceReminders/steps/PaidStep.tsx` (without `markReplied`).

**Files:**
- Create: `src/demos/weeklyReports/steps/ActStep.tsx`
- Modify: `src/demos/weeklyReports/reports.css` (append act styles)

**Interfaces:**
- Consumes: `WorkflowProvider.getDigest().recommendedAction` (`{ summary, actionLabel }`) and `WorkflowProvider.getActionResult()` (`{ confirmation, detail }`) (Task 1); shared `usePrefersReducedMotion`.
- Produces: default-exported `ActStep` taking `{ provider: WorkflowProvider }`, rendered for `stepId === "act"` (Task 8). Does NOT use the send lifecycle.

- [ ] **Step 1: Write `steps/ActStep.tsx`**

```tsx
import { useEffect, useRef, useState } from "react";
import { FaBolt, FaCheckCircle } from "react-icons/fa";
import type { WorkflowProvider } from "../types";
import { usePrefersReducedMotion } from "../../shared/usePrefersReducedMotion";

const ACT_DELAY_MS = 1100;

const ActStep = ({ provider }: { provider: WorkflowProvider }) => {
  const action = provider.getDigest().recommendedAction;
  const result = provider.getActionResult();
  const reduced = usePrefersReducedMotion();
  const [fired, setFired] = useState(reduced);
  const timer = useRef<number | null>(null);

  useEffect(() => {
    if (reduced) {
      setFired(true);
      return;
    }
    timer.current = window.setTimeout(() => setFired(true), ACT_DELAY_MS);
    return () => {
      if (timer.current !== null) window.clearTimeout(timer.current);
    };
  }, [reduced]);

  const fire = () => {
    if (timer.current !== null) window.clearTimeout(timer.current);
    setFired(true);
  };

  return (
    <div className="wr-step">
      <h3 className="wr-heading">One tap — and the report drives a decision</h3>
      <p className="wr-sub">
        The report doesn't just inform. Its recommended action is a single tap,
        right from the text — so the week's one real risk gets handled on the
        spot.
      </p>

      <div className="wr-act">
        <button
          type="button"
          className={"wr-act-btn" + (fired ? " is-fired" : "")}
          onClick={fire}
          disabled={fired}
        >
          <FaBolt aria-hidden="true" />
          {fired ? "Sent" : action.actionLabel}
        </button>

        <div className={"wr-act-confirm" + (fired ? " is-shown" : "")}>
          <FaCheckCircle className="wr-act-confirm-icon" aria-hidden="true" />
          <div>
            <p className="wr-act-confirm-title">{result.confirmation}</p>
            <p className="wr-act-confirm-detail">{result.detail}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActStep;
```

- [ ] **Step 2: Append act styles to `reports.css`**

```css
/* Act (step 5) — one-tap action button + confirmation payoff */
.wr-act {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}
.wr-act-btn {
  align-self: flex-start;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.7rem 1.2rem;
  font-size: 0.95rem;
  font-weight: 700;
  color: #fff;
  background: var(--demo-accent);
  border: 1px solid var(--demo-accent-bright);
  border-radius: 0.5rem;
  cursor: pointer;
  transition: background 0.25s ease, transform 0.1s ease, opacity 0.25s ease;
}
.wr-act-btn:hover:not(:disabled) {
  background: var(--demo-accent-bright);
}
.wr-act-btn:active:not(:disabled) {
  transform: translateY(1px);
}
.wr-act-btn.is-fired {
  background: var(--demo-success);
  border-color: var(--demo-success);
  cursor: default;
  opacity: 0.9;
}
.wr-act-confirm {
  display: flex;
  align-items: flex-start;
  gap: var(--spacing-sm);
  padding: var(--spacing-md);
  background: var(--demo-surface-2);
  border: 1px solid var(--demo-success);
  border-radius: 0.6rem;
  opacity: 0;
  transform: translateY(6px);
  transition: opacity 0.4s ease, transform 0.4s ease;
}
.wr-act-confirm.is-shown {
  opacity: 1;
  transform: none;
}
.wr-act-confirm-icon {
  flex: 0 0 auto;
  margin-top: 0.15rem;
  font-size: 1.3rem;
  color: var(--demo-success);
}
.wr-act-confirm-title {
  margin: 0 0 0.2rem;
  font-weight: 700;
  color: var(--demo-text);
}
.wr-act-confirm-detail {
  margin: 0;
  font-size: 0.9rem;
  line-height: 1.4;
  color: var(--demo-muted);
}
```

- [ ] **Step 3: Verify the tree compiles**

Run: `npm run build`
Expected: PASS.

- [ ] **Step 4: Commit**

```bash
git add src/demos/weeklyReports/steps/ActStep.tsx src/demos/weeklyReports/reports.css
git commit -m "feat: add weekly-reports act step (one-tap action payoff)"
```

---

### Task 7: ResultsStep — recap tally (step 6, `results`)

Recap grid + takeaway. Mirrors `invoiceReminders/steps/ResultsStep.tsx`.

**Files:**
- Create: `src/demos/weeklyReports/steps/ResultsStep.tsx`
- Modify: `src/demos/weeklyReports/reports.css` (append tally styles)

**Interfaces:**
- Consumes: `WorkflowProvider.getResults()` returning `{ reportsDelivered: number, avgReadTime: string, actionsTaken: number, hoursSaved: string, takeaway: string }` (Task 1).
- Produces: default-exported `ResultsStep` taking `{ provider: WorkflowProvider }`, rendered for `stepId === "results"` (Task 8).

- [ ] **Step 1: Write `steps/ResultsStep.tsx`**

```tsx
import type { WorkflowProvider } from "../types";

const ResultsStep = ({ provider }: { provider: WorkflowProvider }) => {
  const results = provider.getResults();
  const tally = [
    { num: String(results.reportsDelivered), label: "Reports delivered" },
    { num: results.avgReadTime, label: "Avg read time", hl: true },
    { num: String(results.actionsTaken), label: "One-tap actions taken" },
    { num: results.hoursSaved, label: "Owner time saved" },
  ];

  return (
    <div className="wr-step">
      <h3 className="wr-heading">
        A quarter of Sundays — the numbers, finally read
      </h3>
      <p className="wr-sub">
        Every week compiled into a 30-second digest, with one clear action the
        owner can take on the spot. No evenings lost to spreadsheets.
      </p>

      <div className="wr-tally">
        {tally.map((t) => (
          <div
            key={t.label}
            className={"wr-tally-item" + (t.hl ? " wr-tally-item-hl" : "")}
          >
            <span className="wr-tally-num">{t.num}</span>
            <span className="wr-tally-label">{t.label}</span>
          </div>
        ))}
      </div>

      <p className="wr-takeaway">{results.takeaway}</p>
    </div>
  );
};

export default ResultsStep;
```

- [ ] **Step 2: Append tally styles to `reports.css`**

```css
/* Results (step 6) — recap tally + takeaway */
.wr-tally {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: var(--spacing-sm);
  margin-bottom: var(--spacing-md);
}
.wr-tally-item {
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
  padding: var(--spacing-md);
  background: var(--demo-surface-2);
  border: 1px solid var(--demo-border);
  border-radius: 0.5rem;
  text-align: center;
}
.wr-tally-item-hl {
  border-color: var(--demo-accent-bright);
}
.wr-tally-num {
  font-size: 1.3rem;
  font-weight: 700;
  color: var(--demo-text);
}
.wr-tally-item-hl .wr-tally-num {
  color: var(--demo-accent-bright);
}
.wr-tally-label {
  font-size: 0.75rem;
  color: var(--demo-muted);
}
.wr-takeaway {
  margin: 0;
  font-size: 0.9rem;
  line-height: 1.5;
  color: var(--demo-text);
  max-width: 65ch;
}

@media (max-width: 640px) {
  .wr-tally {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
```

- [ ] **Step 3: Verify the tree compiles**

Run: `npm run build`
Expected: PASS.

- [ ] **Step 4: Commit**

```bash
git add src/demos/weeklyReports/steps/ResultsStep.tsx src/demos/weeklyReports/reports.css
git commit -m "feat: add weekly-reports results step (recap tally)"
```

---

### Task 8: Compose the demo and wire it in

Assemble the six steps into the shell, register the route, and point the example card at it. This is the first task whose deliverable is visible in the running app — the smoke test and lint gate live here.

**Files:**
- Create: `src/demos/weeklyReports/steps.ts`
- Create: `src/demos/weeklyReports/WeeklyReportsDemo.tsx`
- Modify: `src/App.tsx` (add import + route, after the `invoice-reminders` route, before `</Routes>`)
- Modify: `src/components/AutomatedWorkflows.tsx` (add `to` to `examples[7]`, the "Weekly Owner Reports" entry)

**Interfaces:**
- Consumes: `steps` (the six `DemoStep`s), `scriptedWorkflowProvider`, and the six step components (Tasks 1–7); shared `DemoProvider` (prop `steps: DemoStep[]`), `SendLifecycleProvider`, `DemoShell` (props `eyebrow`, `title`, `lede`, `renderStage: (stepId: string) => ReactNode`).
- Produces: default-exported `WeeklyReportsDemo` mounted at `/demos/weekly-reports`.

- [ ] **Step 1: Write `steps.ts`**

```ts
import {
  FaDatabase,
  FaBrain,
  FaPenFancy,
  FaPaperPlane,
  FaBolt,
  FaChartLine,
} from "react-icons/fa";
import type { DemoStep } from "../shared/types";

export const steps: DemoStep[] = [
  { id: "data", label: "The week's raw numbers", Icon: FaDatabase },
  { id: "analyze", label: "Read the week", Icon: FaBrain, isAi: true },
  { id: "write", label: "Write the digest", Icon: FaPenFancy, isAi: true },
  { id: "deliver", label: "Deliver to the owner", Icon: FaPaperPlane },
  { id: "act", label: "One-tap action", Icon: FaBolt },
  { id: "results", label: "Results", Icon: FaChartLine },
];
```

- [ ] **Step 2: Write `WeeklyReportsDemo.tsx`**

```tsx
import type { ReactNode } from "react";
import { DemoProvider } from "../shared/DemoController";
import { SendLifecycleProvider } from "../shared/SendLifecycleProvider";
import DemoShell from "../shared/DemoShell";
import { steps } from "./steps";
import { scriptedWorkflowProvider } from "./provider";
import DataStep from "./steps/DataStep";
import AnalyzeStep from "./steps/AnalyzeStep";
import WriteStep from "./steps/WriteStep";
import DeliverStep from "./steps/DeliverStep";
import ActStep from "./steps/ActStep";
import ResultsStep from "./steps/ResultsStep";
import "./reports.css";

const provider = scriptedWorkflowProvider;

function renderStage(stepId: string): ReactNode {
  switch (stepId) {
    case "data":
      return <DataStep provider={provider} />;
    case "analyze":
      return <AnalyzeStep provider={provider} />;
    case "write":
      return <WriteStep provider={provider} />;
    case "deliver":
      return <DeliverStep provider={provider} />;
    case "act":
      return <ActStep provider={provider} />;
    case "results":
      return <ResultsStep provider={provider} />;
    default:
      return null;
  }
}

const WeeklyReportsDemo = () => {
  const business = provider.getBusiness();
  return (
    <DemoProvider steps={steps}>
      <SendLifecycleProvider>
        <DemoShell
          eyebrow="Paradigm Shift — Automation Demo"
          title={`Weekly owner reports for ${business.name}`}
          lede="A click-through of how a week scattered across five tools becomes a 30-second digest — with one action the owner takes on the spot."
          renderStage={renderStage}
        />
      </SendLifecycleProvider>
    </DemoProvider>
  );
};

export default WeeklyReportsDemo;
```

- [ ] **Step 3: Add the import to `src/App.tsx`**

After the existing `InvoiceRemindersDemo` import (currently line 11), add:

```tsx
import WeeklyReportsDemo from "./demos/weeklyReports/WeeklyReportsDemo";
```

- [ ] **Step 4: Add the route to `src/App.tsx`**

Immediately after the `invoice-reminders` route and before `</Routes>`, add:

```tsx
      <Route
        path="/demos/weekly-reports"
        element={<WeeklyReportsDemo />}
      />
```

The surrounding block should read:

```tsx
      <Route
        path="/demos/invoice-reminders"
        element={<InvoiceRemindersDemo />}
      />
      <Route
        path="/demos/weekly-reports"
        element={<WeeklyReportsDemo />}
      />
    </Routes>
```

- [ ] **Step 5: Point the example card at the route in `src/components/AutomatedWorkflows.tsx`**

The "Weekly Owner Reports" entry (`examples[7]`, `icon: FaChartLine`) currently has no `to`. Add it so the card auto-becomes a `<Link>`:

```tsx
  {
    icon: FaChartLine,
    title: "Weekly Owner Reports",
    description: "The numbers that matter, in your inbox",
    to: "/demos/weekly-reports",
  },
```

- [ ] **Step 6: Verify the build**

Run: `npm run build`
Expected: PASS — tsc no errors, Vite build completes.

- [ ] **Step 7: Smoke test in the dev server**

Run: `npm run dev`, then open `http://localhost:5173/demos/weekly-reports`. Confirm:
- All 6 steps advance via the flow rail and Next/Back.
- Step 1 shows the raw-data chip grid ("the pile").
- Steps 2 & 3 play the `AiPanel`, then reveal the findings list (with a good/watch badge) and the report card, respectively.
- Step 4 animates the send lifecycle strip to "Read".
- Step 5 shows the action button, then reveals the confirmation card after a beat (and clicking the button fires it immediately).
- Step 6 renders the tally grid + takeaway.
- No horizontal scroll at a ~375px-wide viewport.
- On `http://localhost:5173/services/automated-workflows`, the "Weekly Owner Reports" card is now a link to `/demos/weekly-reports`.
- (Optional) With OS "reduce motion" enabled, AI panels and reveals show content instantly.

- [ ] **Step 8: Lint gate**

Run: `npm run lint`
Expected: PASS — zero warnings.

- [ ] **Step 9: Commit**

```bash
git add src/demos/weeklyReports/steps.ts src/demos/weeklyReports/WeeklyReportsDemo.tsx src/App.tsx src/components/AutomatedWorkflows.tsx
git commit -m "feat: wire up weekly owner reports demo route and example card"
```

---

## Self-Review

**1. Spec coverage:**
- 6-step flow (`data`, `analyze`, `write`, `deliver`, `act`, `results`) → Tasks 2–7, icons/labels/`isAi` in Task 8's `steps.ts`. ✓
- `WorkflowProvider` interface + supporting types (`RawMetric`, `Finding`, `RecommendedAction`, `Digest`, `Delivery`, `ActionResult`, `ResultsSummary`, `AiReasoning`, `AiStep`, `Trend`) → Task 1 `types.ts`. ✓
- All mock content (business, raw data, findings, digest, delivery, action result, results, both AI reasonings) → Task 1 `script.ts`. ✓
- `scriptedWorkflowProvider` → Task 1 `provider.ts`. ✓
- Bespoke UI: raw-data panel (Task 2), findings list with trend badges (Task 3), report card/digest (Task 4), action payoff (Task 6); send-lifecycle deliver strip (Task 5); results tally (Task 7). ✓
- `deliver` reuses send lifecycle, ends at "read", no reply (Task 5). `act` is a self-contained timed reveal, presentational (Task 6). ✓
- Styling: `wr-*` prefix, `--demo-*`/`--spacing-*` tokens, `#f4b740` amber for `watch`, `--demo-success` for `good`; mobile media queries on raw-grid, findings, tally. ✓
- Wiring: route in `App.tsx` outside `Layout`; `to` on `examples[7]` in `AutomatedWorkflows.tsx`. → Task 8. ✓
- Verification: build + dev smoke + lint. → Task 8 + per-task build gates. ✓
- Out of scope respected: no engine/shared edits, no real integrations, action presentational only, no cross-demo data. ✓

**2. Placeholder scan:** No TBD/TODO; every code step contains complete file content or an exact anchored edit. ✓

**3. Type consistency:** `AiStep = "analyze" | "write"` used consistently in `getAiReasoning`, `aiReasoning` record, and both AI steps. `Trend` values `good`/`watch`/`flat` map to `.wr-badge-good`/`.wr-badge-watch`/`.wr-badge-flat`. Provider method names (`getBusiness`, `getRawData`, `getFindings`, `getDigest`, `getDelivery`, `getActionResult`, `getResults`, `getAiReasoning`) are identical across `types.ts`, `provider.ts`, and every consuming step. `recommendedAction` shape (`summary`/`actionLabel`) matches between `Digest` and `ActStep`. `SendStatus` usage in `DeliverStep` matches the shared type. ✓
