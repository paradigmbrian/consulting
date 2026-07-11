# AI Showcase Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the AI in the `/demos/commercial-cleaning` walkthrough visible — add a "Claude" model node to the n8n flow map (feeding the three AI-powered steps via dashed connectors) and in-step "AI at work" reasoning panels on Discover, Enrich & qualify, and Personalize.

**Architecture:** Presentational + content. Authored AI reasoning lines are added to `script.ts` and read through a new `WorkflowProvider.getAiReasoning(step)` method (phase-2 seam preserved). A reusable `AiPanel` renders Claude's reasoning with a sequential line reveal inside the three AI steps. A `FlowAiLane` component renders a centered `Claude` node beneath the flow track and draws measured dashed SVG connectors to the three AI step nodes (desktop); on mobile it collapses to `✦` markers + a caption.

**Tech Stack:** React 18 + TypeScript (strict), Vite 5, vanilla CSS with the demo's `--demo-*` custom properties, inline SVG, `react-icons` (existing, `FaMagic` for the AI mark).

## Global Constraints

- **No new dependencies** — vanilla CSS + inline SVG only; AI mark is `FaMagic` from `react-icons/fa` (already used elsewhere in the demo).
- **Generic "Claude" branding** — label the model `Claude` with subtitle `Anthropic`; **never** a version number (static marketing page).
- **AI steps are exactly** `discover`, `enrich`, `personalize` (Define / Send / Reply&results get no AI treatment).
- **Demo-scoped:** all styling lives under the existing `.demo` root and uses the demo tokens (`--demo-surface`, `--demo-surface-2`, `--demo-border`, `--demo-text`, `--demo-muted`, `--demo-accent`, `--demo-accent-bright`, `--demo-accent-glow`, `--demo-edge`, `--demo-edge-active`, `--demo-bg`). Do not touch `src/index.css` or the landing page.
- **Behavior/flow/data unchanged** except the additive `aiReasoning` content + `getAiReasoning` method. No change to the six-step state machine, the mocked send, routing, or `netlify.toml`.
- **Respect `prefers-reduced-motion`:** the panel line-reveal, the panel "working" pulse, the dashed-connector travel, and the Personalize email typing all collapse to static/instant (use the existing `usePrefersReducedMotion` hook + `@media (prefers-reduced-motion: reduce)` blocks).
- **TypeScript strict** (`noUnusedLocals`, `noUnusedParameters`); the repo's ESLint includes `react-refresh/only-export-components` (keep non-component exports out of component files) and `react-hooks/exhaustive-deps`.
- **No test framework** (deferred by the original spec). Each task's DoD is `npm run lint` (zero warnings) + `npm run build` (green) + the stated manual check. Do not run the dev server or background processes.
- **Git:** this runs in **no-git-writes** mode — do NOT run any git write command. Leave changes uncommitted in the working tree. Skip every "Commit" step.

---

## File Structure

**New files** (under `src/demos/commercialCleaning/`):
- `AiPanel.tsx` / `AiPanel.css` — reusable "Claude reasoning" panel with sequential line reveal.
- `FlowAiLane.tsx` / `FlowAiLane.css` — the centered `Claude` flow node + measured dashed SVG connectors.

**Modified files:**
- `types.ts` — `AiStep`, `AiReasoning`, `getAiReasoning` on `WorkflowProvider`.
- `script.ts` — authored `aiReasoning`.
- `ScriptedWorkflowProvider.ts` — implement `getAiReasoning`.
- `stepMeta.ts` — `AI_STEPS` constant.
- `steps/DiscoverStep.tsx`, `steps/EnrichQualifyStep.tsx` — render `AiPanel`.
- `steps/PersonalizeStep.tsx` / `PersonalizeStep.css` — render `AiPanel`, gate email typing on reasoning completion, add the "Drafted by Claude" badge.
- `FlowMap.tsx` / `FlowMap.css` — `✦` markers on AI nodes, AI-node + container refs, render `FlowAiLane`, mobile caption.

---

## Task 1: Content model + provider (`getAiReasoning`) + `AI_STEPS`

**Files:**
- Modify: `src/demos/commercialCleaning/types.ts`
- Modify: `src/demos/commercialCleaning/script.ts`
- Modify: `src/demos/commercialCleaning/ScriptedWorkflowProvider.ts`
- Modify: `src/demos/commercialCleaning/stepMeta.ts`

**Interfaces:**
- Consumes: existing `WorkflowProvider`, `StepId`.
- Produces (relied on by Tasks 2–5):
  - `type AiStep = "discover" | "enrich" | "personalize"`
  - `interface AiReasoning { step: AiStep; title: string; lines: string[] }`
  - `WorkflowProvider.getAiReasoning(step: AiStep): AiReasoning`
  - `AI_STEPS: readonly StepId[]` (exported from `stepMeta.ts`)

- [ ] **Step 1: Add the AI types + provider method to `types.ts`**

In `src/demos/commercialCleaning/types.ts`, add after the `ResultsSummary` interface (before `WorkflowProvider`):

```ts
export type AiStep = "discover" | "enrich" | "personalize";

export interface AiReasoning {
  step: AiStep;
  /** Panel header, e.g. "Claude — matching buy-signals". */
  title: string;
  /** Short reasoning lines, revealed in sequence. */
  lines: string[];
}
```

Then add this method to the `WorkflowProvider` interface, right after `getFeaturedProspectId(): string;`:

```ts
  getAiReasoning(step: AiStep): AiReasoning;
```

- [ ] **Step 2: Author the reasoning content in `script.ts`**

In `src/demos/commercialCleaning/script.ts`, add `AiStep` and `AiReasoning` to the existing `import type { … } from "./types";` block, then append at the end of the file:

```ts
export const aiReasoning: Record<AiStep, AiReasoning> = {
  discover: {
    step: "discover",
    title: "Claude — matching buy-signals",
    lines: [
      "Scanning facility types across the service area…",
      "Inferring fit: physical location, no in-house janitorial, inside the radius.",
      "Prioritizing recurring-cleaning need — clinics, daycares, and gyms score highest.",
    ],
  },
  enrich: {
    step: "enrich",
    title: "Claude — qualifying prospects",
    lines: [
      "Cross-checking each prospect against Summit's ideal-customer profile…",
      "Dropping The Hartwell Residence: residential address, outside the commercial ICP.",
      "Dropping SparkleRight Janitorial: a competitor, not a buyer.",
      "Keeping the 6 facilities with a reachable decision-maker.",
    ],
  },
  personalize: {
    step: "personalize",
    title: "Claude — drafting outreach",
    lines: [
      "Reading Lakeline Dental's profile: 6 operatories, ~4,200 sq ft.",
      "Decision-maker is the practice owner, Dr. Reyes — address her directly.",
      "Angle: an inspection-ready clinic with a nightly operatory + restroom turn.",
      "Writing a short, specific note — not a generic blast.",
    ],
  },
};
```

- [ ] **Step 3: Implement `getAiReasoning` in the provider**

In `src/demos/commercialCleaning/ScriptedWorkflowProvider.ts`:

Add `AiStep` and `AiReasoning` to the `import type { … } from "./types";` block, and add `aiReasoning` to the `import { … } from "./script";` block.

Then add this method to the class, right after `getFeaturedProspectId()`:

```ts
  getAiReasoning(step: AiStep): AiReasoning {
    return aiReasoning[step];
  }
```

- [ ] **Step 4: Add the `AI_STEPS` constant to `stepMeta.ts`**

In `src/demos/commercialCleaning/stepMeta.ts`, append after the `STEP_META` declaration:

```ts
/** The steps whose work is driven by Claude. */
export const AI_STEPS: readonly StepId[] = ["discover", "enrich", "personalize"];
```

(`StepId` is already imported in this file.)

- [ ] **Step 5: Verify lint + build**

Run:
```bash
npm run lint && npm run build
```
Expected: zero warnings, build green. (`getAiReasoning`/`aiReasoning`/`AI_STEPS` are not consumed yet — that's fine; they're exported, not unused locals.)

- [ ] **Step 6: Commit** — SKIPPED (no-git-writes mode).

---

## Task 2: `AiPanel` component

**Files:**
- Create: `src/demos/commercialCleaning/AiPanel.tsx`
- Create: `src/demos/commercialCleaning/AiPanel.css`

**Interfaces:**
- Consumes: `usePrefersReducedMotion`.
- Produces (relied on by Tasks 3–4): `AiPanel` default export with props
  `{ title: string; lines: string[]; animate?: boolean; onComplete?: () => void }`.
  Reveals `lines` one at a time (~550 ms apart); under reduced motion (or `animate={false}`) shows
  all lines immediately and calls `onComplete` right away. `onComplete` fires once, after the last line.

- [ ] **Step 1: Create `AiPanel.tsx`**

Create `src/demos/commercialCleaning/AiPanel.tsx`:

```tsx
import { useEffect, useRef, useState } from "react";
import { FaMagic } from "react-icons/fa";
import { usePrefersReducedMotion } from "./usePrefersReducedMotion";
import "./AiPanel.css";

const LINE_INTERVAL_MS = 550;

interface AiPanelProps {
  title: string;
  lines: string[];
  animate?: boolean;
  onComplete?: () => void;
}

const AiPanel = ({ title, lines, animate = true, onComplete }: AiPanelProps) => {
  const reduced = usePrefersReducedMotion();
  const instant = reduced || !animate;
  const [shown, setShown] = useState(instant ? lines.length : 0);
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  useEffect(() => {
    if (instant) {
      setShown(lines.length);
      onCompleteRef.current?.();
      return;
    }
    setShown(0);
    const timers: number[] = [];
    for (let i = 1; i <= lines.length; i++) {
      timers.push(
        window.setTimeout(() => {
          setShown(i);
          if (i === lines.length) onCompleteRef.current?.();
        }, LINE_INTERVAL_MS * i),
      );
    }
    return () => timers.forEach((id) => window.clearTimeout(id));
  }, [lines.length, instant]);

  const working = shown < lines.length;

  return (
    <div className="ai-panel">
      <div className="ai-panel-head">
        <span className="ai-panel-badge" aria-hidden="true">
          <FaMagic />
        </span>
        <span className="ai-panel-title">{title}</span>
        <span
          className={"ai-panel-state" + (working ? " is-working" : " is-done")}
          aria-live="polite"
        >
          {working ? "working…" : "done"}
        </span>
      </div>
      <ul className="ai-panel-lines">
        {lines.map((line, i) => (
          <li
            key={line}
            className={"ai-panel-line" + (i < shown ? " is-shown" : "")}
          >
            {line}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AiPanel;
```

- [ ] **Step 2: Create `AiPanel.css`**

Create `src/demos/commercialCleaning/AiPanel.css`:

```css
.ai-panel {
  max-width: 640px;
  margin: 0 auto var(--spacing-md);
  padding: var(--spacing-sm) var(--spacing-md);
  background: var(--demo-surface-2);
  border: 1px solid var(--demo-border);
  border-left: 3px solid var(--demo-accent-bright);
  border-radius: 0.6rem;
}

.ai-panel-head {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  margin-bottom: var(--spacing-sm);
}

.ai-panel-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 26px;
  height: 26px;
  border-radius: 50%;
  background: rgba(90, 169, 230, 0.15);
  color: var(--demo-accent-bright);
  font-size: 0.85rem;
}

.ai-panel-title {
  font-weight: 600;
  font-size: 0.9rem;
  color: var(--demo-text);
}

.ai-panel-state {
  margin-left: auto;
  font-size: 0.7rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  white-space: nowrap;
}

.ai-panel-state.is-working {
  color: var(--demo-accent-bright);
}

.ai-panel-state.is-working::before {
  content: "";
  display: inline-block;
  width: 6px;
  height: 6px;
  margin-right: 0.4rem;
  border-radius: 50%;
  background: var(--demo-accent-bright);
  vertical-align: middle;
  animation: ai-panel-pulse 1s ease-in-out infinite;
}

.ai-panel-state.is-done {
  color: var(--demo-muted);
}

@keyframes ai-panel-pulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.3;
  }
}

.ai-panel-lines {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

.ai-panel-line {
  position: relative;
  padding-left: 1rem;
  font-size: 0.88rem;
  color: var(--demo-muted);
  opacity: 0;
  transform: translateY(4px);
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.ai-panel-line::before {
  content: "▸";
  position: absolute;
  left: 0;
  color: var(--demo-accent-bright);
}

.ai-panel-line.is-shown {
  opacity: 1;
  transform: translateY(0);
}

@media (prefers-reduced-motion: reduce) {
  .ai-panel-state.is-working::before {
    animation: none;
  }
  .ai-panel-line {
    transition: none;
  }
}
```

- [ ] **Step 3: Verify lint + build**

Run:
```bash
npm run lint && npm run build
```
Expected: zero warnings, build green. (`AiPanel` exported but not yet rendered — fine.)

- [ ] **Step 4: Commit** — SKIPPED (no-git-writes mode).

---

## Task 3: Render `AiPanel` in Discover & Enrich

**Files:**
- Modify: `src/demos/commercialCleaning/steps/DiscoverStep.tsx`
- Modify: `src/demos/commercialCleaning/steps/EnrichQualifyStep.tsx`

**Interfaces:**
- Consumes: `AiPanel` (Task 2), `provider.getAiReasoning` (Task 1).
- Produces: nothing new.

- [ ] **Step 1: Add the panel to `DiscoverStep`**

In `src/demos/commercialCleaning/steps/DiscoverStep.tsx`, add this import after the existing `usePrefersReducedMotion` import:

```tsx
import AiPanel from "../AiPanel";
```

Inside the component, after `const targets = provider.getTargets();`, add:

```tsx
  const ai = provider.getAiReasoning("discover");
```

Then, in the returned JSX, insert the panel between the `</p>` of `.step-sub` and the `.discover-count` paragraph:

```tsx
      <AiPanel title={ai.title} lines={ai.lines} />

      <p className="discover-count">
```

(i.e. the `<AiPanel … />` goes immediately before the existing `<p className="discover-count">` line.)

- [ ] **Step 2: Add the panel to `EnrichQualifyStep`**

In `src/demos/commercialCleaning/steps/EnrichQualifyStep.tsx`, add this import after the `WorkflowProvider` type import:

```tsx
import AiPanel from "../AiPanel";
```

Inside the component, after the `dropped` line, add:

```tsx
  const ai = provider.getAiReasoning("enrich");
```

Then insert the panel between the `</p>` of `.step-sub` and the `.enrich-summary` paragraph:

```tsx
      <AiPanel title={ai.title} lines={ai.lines} />

      <p className="enrich-summary">
```

- [ ] **Step 3: Verify lint + build**

Run:
```bash
npm run lint && npm run build
```
Expected: zero warnings, build green.

- [ ] **Step 4: Manual check**

`npm run dev` → `/demos/commercial-cleaning`. On step 2 (Discover) and step 3 (Enrich), a Claude reasoning panel renders above the content with lines appearing one at a time and a "working…" → "done" state. Stop the server. *(Implementer: lint+build is the gate; flag the visual check as deferred if not running a browser.)*

- [ ] **Step 5: Commit** — SKIPPED (no-git-writes mode).

---

## Task 4: Personalize — panel + "Drafted by Claude" badge + gated typing

**Files:**
- Modify: `src/demos/commercialCleaning/steps/PersonalizeStep.tsx` (full rewrite below)
- Modify: `src/demos/commercialCleaning/steps/PersonalizeStep.css`

**Interfaces:**
- Consumes: `AiPanel`, `provider.getAiReasoning`.
- Produces: nothing new.

- [ ] **Step 1: Rewrite `PersonalizeStep.tsx`**

Replace the entire contents of `src/demos/commercialCleaning/steps/PersonalizeStep.tsx` with:

```tsx
import { useEffect, useRef, useState } from "react";
import { FaMagic } from "react-icons/fa";
import type { WorkflowProvider } from "../types";
import { usePrefersReducedMotion } from "../usePrefersReducedMotion";
import AiPanel from "../AiPanel";
import "./PersonalizeStep.css";

const CHARS_PER_TICK = 4;
const TICK_MS = 16;

const PersonalizeStep = ({ provider }: { provider: WorkflowProvider }) => {
  const prospectId = provider.getFeaturedProspectId();
  const email = provider.getEmail(prospectId);
  const enrichment = provider.getEnrichment(prospectId);
  const ai = provider.getAiReasoning("personalize");
  const reduced = usePrefersReducedMotion();

  // The email types in only after Claude's reasoning finishes.
  const [reasoningDone, setReasoningDone] = useState(reduced);
  const [typed, setTyped] = useState(reduced ? email.body.length : 0);
  const timer = useRef<number | null>(null);

  useEffect(() => {
    if (reduced) {
      setTyped(email.body.length);
      return;
    }
    if (!reasoningDone) return;
    setTyped(0);
    timer.current = window.setInterval(() => {
      setTyped((n) => {
        const next = n + CHARS_PER_TICK;
        if (next >= email.body.length && timer.current !== null) {
          window.clearInterval(timer.current);
          timer.current = null;
          return email.body.length;
        }
        return next;
      });
    }, TICK_MS);
    return () => {
      if (timer.current !== null) window.clearInterval(timer.current);
    };
  }, [email.body.length, reduced, reasoningDone]);

  const isDone = typed >= email.body.length;

  return (
    <div className="personalize-step">
      <h2 className="step-heading">Step 4 — Personalize the outreach</h2>
      <p className="step-sub">
        For each qualified prospect, a tailored cold email is written —
        referencing specifics about them, not a generic blast. Here's{" "}
        {enrichment.contactName} at the top of the list.
      </p>

      <AiPanel
        title={ai.title}
        lines={ai.lines}
        onComplete={() => setReasoningDone(true)}
      />

      <div className="email-card">
        <div className="email-meta">
          <p>
            <span className="email-label">To:</span> {enrichment.contactName}{" "}
            &lt;{enrichment.email}&gt;
          </p>
          <p>
            <span className="email-label">Subject:</span> {email.subject}
          </p>
          <p className="email-drafted">
            <FaMagic className="email-drafted-icon" aria-hidden="true" /> Drafted
            by Claude
          </p>
        </div>
        <pre className={"email-body" + (isDone ? "" : " is-typing")}>
          {email.body.slice(0, typed)}
        </pre>
        <p className="email-footer">{email.footer}</p>
      </div>
    </div>
  );
};

export default PersonalizeStep;
```

- [ ] **Step 2: Add the badge styles to `PersonalizeStep.css`**

In `src/demos/commercialCleaning/steps/PersonalizeStep.css`, append:

```css
.email-drafted {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  margin-top: 0.4rem;
  font-size: 0.78rem;
  font-weight: 600;
  color: var(--demo-accent-bright);
}

.email-drafted-icon {
  font-size: 0.8rem;
}
```

- [ ] **Step 3: Verify lint + build**

Run:
```bash
npm run lint && npm run build
```
Expected: zero warnings, build green.

- [ ] **Step 4: Manual check**

`npm run dev` → step 4 (Personalize): the Claude reasoning panel appears first and reveals its lines; when it finishes, the email types in. The email card shows a "✦ Drafted by Claude" badge. Toggle OS reduce-motion + reload: the panel shows all lines instantly and the full email is shown immediately. Stop the server. *(Implementer: defer the visual check to the human if not running a browser.)*

- [ ] **Step 5: Commit** — SKIPPED (no-git-writes mode).

---

## Task 5: Flow-map AI node (`FlowAiLane` + `FlowMap` integration)

**Files:**
- Create: `src/demos/commercialCleaning/FlowAiLane.tsx`
- Create: `src/demos/commercialCleaning/FlowAiLane.css`
- Modify: `src/demos/commercialCleaning/FlowMap.tsx` (full rewrite below)
- Modify: `src/demos/commercialCleaning/FlowMap.css`

**Interfaces:**
- Consumes: `AI_STEPS` (Task 1), `useDemo`, `STEPS`, `StepId`, `STEP_META`, `usePrefersReducedMotion`.
- Produces: `FlowAiLane` default export with props
  `{ containerRef: React.RefObject<HTMLElement | null>; aiNodeRefs: React.RefObject<Partial<Record<StepId, HTMLButtonElement | null>>>; activeStepId: StepId }`.

- [ ] **Step 1: Create `FlowAiLane.tsx`**

Create `src/demos/commercialCleaning/FlowAiLane.tsx`:

```tsx
import { useEffect, useRef, useState, type RefObject } from "react";
import { FaMagic } from "react-icons/fa";
import type { StepId } from "./DemoController";
import { AI_STEPS } from "./stepMeta";
import { usePrefersReducedMotion } from "./usePrefersReducedMotion";
import "./FlowAiLane.css";

interface Point {
  x: number;
  y: number;
}

interface Edge {
  id: StepId;
  from: Point; // Claude node (top-center)
  to: Point; // AI step node (bottom-center)
  active: boolean;
}

interface FlowAiLaneProps {
  containerRef: RefObject<HTMLElement | null>;
  aiNodeRefs: RefObject<Partial<Record<StepId, HTMLButtonElement | null>>>;
  activeStepId: StepId;
}

const FlowAiLane = ({
  containerRef,
  aiNodeRefs,
  activeStepId,
}: FlowAiLaneProps) => {
  const reduced = usePrefersReducedMotion();
  const claudeRef = useRef<HTMLDivElement | null>(null);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [size, setSize] = useState({ w: 0, h: 0 });

  useEffect(() => {
    const container = containerRef.current;
    const claude = claudeRef.current;
    if (!container || !claude) return;

    const measure = () => {
      const cont = container.getBoundingClientRect();
      const c = claude.getBoundingClientRect();
      const from: Point = {
        x: c.left - cont.left + c.width / 2,
        y: c.top - cont.top,
      };
      const next: Edge[] = [];
      for (const id of AI_STEPS) {
        const el = aiNodeRefs.current?.[id];
        if (!el) continue;
        const r = el.getBoundingClientRect();
        next.push({
          id,
          from,
          to: {
            x: r.left - cont.left + r.width / 2,
            y: r.bottom - cont.top,
          },
          active: id === activeStepId,
        });
      }
      setEdges(next);
      setSize({ w: cont.width, h: cont.height });
    };

    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(container);
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [containerRef, aiNodeRefs, activeStepId]);

  return (
    <div className="flow-ai-lane">
      <svg
        className="flow-ai-edges"
        width={size.w}
        height={size.h}
        aria-hidden="true"
      >
        {edges.map((e) => {
          const midY = (e.to.y + e.from.y) / 2;
          const d = `M ${e.to.x} ${e.to.y} C ${e.to.x} ${midY}, ${e.from.x} ${midY}, ${e.from.x} ${e.from.y}`;
          return (
            <path
              key={e.id}
              d={d}
              className={
                "flow-ai-edge" + (e.active && !reduced ? " is-active" : "")
              }
            />
          );
        })}
      </svg>
      <div className="flow-ai-node" ref={claudeRef}>
        <span className="flow-ai-badge" aria-hidden="true">
          <FaMagic />
        </span>
        <span className="flow-ai-label">Claude</span>
        <span className="flow-ai-sub">Anthropic</span>
      </div>
    </div>
  );
};

export default FlowAiLane;
```

- [ ] **Step 2: Create `FlowAiLane.css`**

Create `src/demos/commercialCleaning/FlowAiLane.css`:

```css
.flow-ai-lane {
  display: flex;
  justify-content: center;
  margin-top: var(--spacing-md);
}

.flow-ai-edges {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 0;
  pointer-events: none;
  overflow: visible;
}

.flow-ai-edge {
  fill: none;
  stroke: var(--demo-edge);
  stroke-width: 1.5;
  stroke-dasharray: 5 5;
}

.flow-ai-edge.is-active {
  stroke: var(--demo-edge-active);
  animation: flow-ai-dash 0.6s linear infinite;
}

@keyframes flow-ai-dash {
  to {
    stroke-dashoffset: -20;
  }
}

.flow-ai-node {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.15rem;
  padding: var(--spacing-sm) var(--spacing-md);
  background: var(--demo-surface);
  border: 1px solid var(--demo-accent);
  border-radius: 0.75rem;
  box-shadow: 0 0 16px var(--demo-accent-glow);
}

.flow-ai-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 34px;
  height: 34px;
  margin-bottom: 0.1rem;
  border-radius: 50%;
  background: rgba(90, 169, 230, 0.15);
  color: var(--demo-accent-bright);
  font-size: 1rem;
}

.flow-ai-label {
  font-weight: 700;
  font-size: 0.9rem;
  color: var(--demo-text);
}

.flow-ai-sub {
  font-size: 0.7rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--demo-muted);
}

@media (max-width: 768px) {
  .flow-ai-lane {
    display: none;
  }
}

@media (prefers-reduced-motion: reduce) {
  .flow-ai-edge.is-active {
    animation: none;
  }
}
```

- [ ] **Step 3: Rewrite `FlowMap.tsx`**

Replace the entire contents of `src/demos/commercialCleaning/FlowMap.tsx` with:

```tsx
import { useEffect, useRef } from "react";
import { FaCheck, FaMagic } from "react-icons/fa";
import { useDemo, STEPS, type StepId } from "./DemoController";
import { STEP_META, AI_STEPS } from "./stepMeta";
import { usePrefersReducedMotion } from "./usePrefersReducedMotion";
import FlowAiLane from "./FlowAiLane";
import "./FlowMap.css";

type ConnState = "done" | "active" | "idle";

function Connector({ state }: { state: ConnState }) {
  return (
    <svg
      className={`flow-conn flow-conn-${state}`}
      width="48"
      height="24"
      viewBox="0 0 48 24"
      aria-hidden="true"
    >
      <line x1="0" y1="12" x2="48" y2="12" className="flow-conn-line" />
    </svg>
  );
}

const FlowMap = () => {
  const { stepIndex, goTo } = useDemo();
  const reduced = usePrefersReducedMotion();
  const containerRef = useRef<HTMLElement | null>(null);
  const activeRef = useRef<HTMLButtonElement | null>(null);
  const aiNodeRefs = useRef<Partial<Record<StepId, HTMLButtonElement | null>>>(
    {},
  );

  useEffect(() => {
    const el = activeRef.current;
    if (!el) return;
    el.scrollIntoView({
      inline: "center",
      block: "nearest",
      behavior: reduced ? "auto" : "smooth",
    });
  }, [stepIndex, reduced]);

  const setNodeRef =
    (id: StepId, isActive: boolean) => (el: HTMLButtonElement | null) => {
      if (isActive) activeRef.current = el;
      if (AI_STEPS.includes(id)) aiNodeRefs.current[id] = el;
    };

  return (
    <nav className="flow-map" aria-label="Workflow steps" ref={containerRef}>
      <ol className="flow-track">
        {STEPS.map((id, i) => {
          const { label, Icon } = STEP_META[id];
          const status =
            i < stepIndex ? "done" : i === stepIndex ? "active" : "upcoming";
          const connState: ConnState =
            i < stepIndex ? "done" : i === stepIndex ? "active" : "idle";
          const isAi = AI_STEPS.includes(id);
          return (
            <li key={id} className="flow-item">
              {i > 0 && <Connector state={connState} />}
              <button
                type="button"
                ref={setNodeRef(id, i === stepIndex)}
                className={`flow-node flow-node-${status}`}
                onClick={() => goTo(i)}
                aria-current={i === stepIndex ? "step" : undefined}
                aria-label={`Step ${i + 1}: ${label}`}
              >
                {isAi && (
                  <span className="flow-node-ai-mark" aria-hidden="true">
                    <FaMagic />
                  </span>
                )}
                <span className="flow-node-badge">
                  {i < stepIndex ? <FaCheck /> : <Icon />}
                </span>
                <span className="flow-node-label">{label}</span>
              </button>
            </li>
          );
        })}
      </ol>

      <FlowAiLane
        containerRef={containerRef}
        aiNodeRefs={aiNodeRefs}
        activeStepId={STEPS[stepIndex]}
      />

      <p className="flow-ai-caption">
        <FaMagic aria-hidden="true" /> Powered by Claude
      </p>
    </nav>
  );
};

export default FlowMap;
```

- [ ] **Step 4: Update `FlowMap.css` (positioning, AI marker, caption)**

In `src/demos/commercialCleaning/FlowMap.css`, replace the existing `.flow-map` rule:

```css
.flow-map {
  margin-bottom: var(--spacing-lg);
}
```

with:

```css
.flow-map {
  position: relative;
  margin-bottom: var(--spacing-lg);
}
```

Replace the existing `.flow-track` rule:

```css
.flow-track {
  display: flex;
  align-items: center;
  justify-content: center;
  list-style: none;
  flex-wrap: nowrap;
}
```

with:

```css
.flow-track {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  list-style: none;
  flex-wrap: nowrap;
}
```

Then add the AI-marker, relative-node, and caption rules. The `.flow-node` rule already exists — add `position: relative;` to it by replacing its opening:

```css
.flow-node {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-xs);
  min-width: 96px;
```

with:

```css
.flow-node {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-xs);
  min-width: 96px;
```

Finally, append at the end of the file:

```css
.flow-node-ai-mark {
  position: absolute;
  top: -6px;
  right: -6px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: var(--demo-accent-bright);
  color: var(--demo-bg);
  font-size: 0.6rem;
  box-shadow: 0 0 8px var(--demo-accent-glow);
}

.flow-ai-caption {
  display: none;
  margin-top: var(--spacing-sm);
  text-align: center;
  font-size: 0.8rem;
  color: var(--demo-accent-bright);
}

.flow-ai-caption svg {
  vertical-align: middle;
  margin-right: 0.3rem;
}

@media (max-width: 768px) {
  .flow-ai-caption {
    display: block;
  }
}
```

- [ ] **Step 5: Verify lint + build**

Run:
```bash
npm run lint && npm run build
```
Expected: zero warnings (no unused imports/vars; `setNodeRef` callback and `aiNodeRefs` are used), build green.

- [ ] **Step 6: Manual check (desktop + mobile + reduced-motion)**

`npm run dev` → `/demos/commercial-cleaning`:
- Desktop: the three AI step nodes (Discover, Enrich & qualify, Personalize) show a small `✦` marker; a centered **Claude / Anthropic** node renders below the flow track with dashed connectors rising to those three nodes; when the active step is one of the three, the connector into it animates (traveling dashes). Navigating between steps re-points the active connector.
- Narrow to ≤768px: the Claude sub-node and connectors disappear; the `✦` markers remain and a "✦ Powered by Claude" caption shows under the flow.
- Toggle OS reduce-motion + reload: the dashed connectors are static (no travel).

Stop the server. *(Implementer: defer the visual checks to the human if not running a browser; lint+build is the gate.)*

- [ ] **Step 7: Commit** — SKIPPED (no-git-writes mode).

---

## Self-Review (completed against the spec)

- **§4 content model + provider:** `AiStep`, `AiReasoning`, `getAiReasoning`, authored `aiReasoning`, `AI_STEPS` → Task 1. ✓
- **§5 reusable `AiPanel` (sequential reveal, working/done state, reduced-motion instant + `onComplete`):** Task 2. ✓
- **§6 flow-map AI node (centered Claude node, measured dashed SVG connectors to the 3 AI nodes, active-connector animation, `✦` markers, mobile caption fallback, reduced-motion static):** Task 5. ✓
- **§7 per-step integration:** Discover + Enrich panels → Task 3; Personalize panel + reasoning-gated typing + "Drafted by Claude" badge → Task 4. ✓
- **§8 iconography:** `FaMagic` from `react-icons/fa` (already a demo dependency); "Anthropic" as text subtitle. ✓
- **§9 edge cases:** timers cleared on unmount (AiPanel, Personalize, FlowAiLane via ResizeObserver/listener cleanup); reduced-motion gating everywhere; measurement degrades (renders nothing until refs measured; hidden on mobile). ✓
- **§10 affected files:** exactly the files listed; no `DemoController`/`DemoPage`/routing/`index.css`/landing-page changes; non-AI steps untouched. ✓
- **§11 DoD:** every task gates on lint + build; Task 5 carries the full desktop/mobile/reduced-motion walkthrough. ✓
- **Generic "Claude" branding, no version:** the Claude node, panel titles, and "Drafted by Claude" badge carry no model version. ✓

**Type/name consistency:** `AiStep`/`AiReasoning`/`getAiReasoning` (Task 1) are consumed verbatim by `AiPanel` callers (Tasks 3–4) and `getAiReasoning("discover"|"enrich"|"personalize")`. `AI_STEPS` (Task 1) is used identically in `FlowMap` and `FlowAiLane` (Task 5). `AiPanel`'s prop names (`title`, `lines`, `animate`, `onComplete`) match every call site. `FlowAiLane`'s prop names (`containerRef`, `aiNodeRefs`, `activeStepId`) match the `FlowMap` render.

**Note on a design refinement vs the spec:** the spec (§5/§7) left open whether Personalize gates typing on `onComplete` or "a simple reasoning-done state." The plan pins it to `onComplete` setting a `reasoningDone` flag that the typing effect depends on — the cleanest option, surfaced here so review doesn't read it as a deviation.
