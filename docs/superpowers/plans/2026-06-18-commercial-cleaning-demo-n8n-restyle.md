# n8n-Style Flow Restyle Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Re-skin the existing `/demos/commercial-cleaning` walkthrough with an n8n-style dark flow-diagram look — a dark dotted canvas, the step progression rendered as a clickable chain of connected nodes with animated "flowing" connectors, and each step shown in a dark node card — without changing the demo's behavior, content, or data layer.

**Architecture:** Purely presentational. (1) A small `goTo(index)` is added to the existing `DemoController`. (2) Dark styling is confined to the `.demo` root via demo-only CSS custom properties plus a scope-local remap of the existing palette tokens, so all existing step CSS flips to dark automatically and nothing outside the demo changes. (3) A new `FlowMap` component replaces the old numbered progress indicator, rendering nodes + inline-SVG connectors driven by `stepIndex`. (4) `DemoPage` is rewired to render `FlowMap` and a node-card stage header. No new dependencies.

**Tech Stack:** React 18 + TypeScript (strict), Vite 5, vanilla CSS with custom properties (paired `.tsx` + `.css`), `react-icons` (existing), inline SVG.

## Global Constraints

- **No new dependencies** — vanilla CSS + inline SVG only (no React Flow, no animation library).
- **Demo-scoped only:** all changes live under the `.demo` root on the demo page. Do NOT edit `src/index.css` or any global token. The palette "remap" is declared inside the `.demo` selector (in `DemoPage.css`), so it overrides tokens *only* within the demo subtree — nothing on the landing page changes.
- **Behavior/content/data unchanged:** no edits to `script.ts`, `types.ts`, `ScriptedWorkflowProvider.ts`, `usePrefersReducedMotion.ts`, routing, `netlify.toml`, or any step `.tsx` (CSS-only for steps). The `WorkflowProvider` interface and the six-step reveal stay exactly as they are.
- **Accent:** brand blue. Demo tokens: `--demo-accent: #2777b4` (edges/borders), `--demo-accent-bright: #5aa9e6` (text/icons on dark, for contrast).
- **Respect `prefers-reduced-motion`:** the traveling-dash connector animation, the active-node pulse, and the mobile auto-center scroll all collapse to static/instant.
- **TypeScript strict** (`noUnusedLocals`, `noUnusedParameters`). Lint must pass with zero warnings (`--max-warnings 0`); the repo's ESLint includes `react-refresh/only-export-components` (a component file should not also export non-components — keep non-component exports like `STEP_META` in their own module).
- **No test framework exists** (deferred by the original spec). Each task's Definition of Done is `npm run lint` (zero warnings) + `npm run build` (green) + the specified manual check. Do not run the dev server or background processes; the human does the visual walkthrough.
- **Git:** this execution runs in **no-git-writes** mode — do NOT run `git add`/`commit`/`branch` or any git write. Leave all changes uncommitted in the working tree. Skip every "Commit" step.

---

## File Structure

**New files** (under `src/demos/commercialCleaning/`):
- `stepMeta.ts` — single source of per-step display metadata: `STEP_META: Record<StepId, { label: string; Icon: IconType }>`. A plain data module (no component) so it can be imported by both `FlowMap` and `DemoPage` without tripping `react-refresh/only-export-components`.
- `FlowMap.tsx` / `FlowMap.css` — the node-chain flow map (nodes + SVG connectors + states + animation).

**Modified files:**
- `DemoController.tsx` — add `goTo(index)` to the context (value + interface + deps).
- `DemoPage.css` — demo tokens + scoped palette remap, dark dotted canvas, node-card stage + stage header, dark nav; remove the old `.demo-progress*` rules.
- `DemoPage.tsx` — render `<FlowMap />` in place of `StepProgress`; add a stage header from `STEP_META`; drop the local `STEP_LABELS`/`StepProgress`.
- `steps/DefineTargetStep.css`, `steps/DiscoverStep.css`, `steps/EnrichQualifyStep.css`, `steps/PersonalizeStep.css`, `steps/SendStep.css`, `steps/ResultsStep.css` — swap the hardcoded `background: #fff;` card backgrounds to `var(--demo-surface)` (everything else flips automatically via the token remap).

---

## Task 1: Controller `goTo(index)`

**Files:**
- Modify: `src/demos/commercialCleaning/DemoController.tsx`

**Interfaces:**
- Consumes: existing `clearTimers`, `setStepIndex`, `STEPS`.
- Produces: `goTo(index: number): void` on the `useDemo()` context — bounds-clamped to `[0, STEPS.length - 1]`, clears send timers (same as `next`/`back`). Later tasks (`FlowMap`) call it.

- [ ] **Step 1: Add `goTo` to the context interface**

In `src/demos/commercialCleaning/DemoController.tsx`, in the `DemoContextValue` interface, add `goTo` after `back`:

```ts
  next: () => void;
  back: () => void;
  goTo: (index: number) => void;
  reset: () => void;
```

- [ ] **Step 2: Implement `goTo`**

Immediately after the `back` `useCallback` (the block ending `}, [clearTimers]);` for `back`), add:

```ts
  const goTo = useCallback(
    (index: number) => {
      clearTimers();
      setStepIndex(Math.min(Math.max(index, 0), STEPS.length - 1));
    },
    [clearTimers],
  );
```

- [ ] **Step 3: Expose `goTo` in the context value + deps**

In the `useMemo` value object, add `goTo` after `back`:

```ts
      next,
      back,
      goTo,
      reset,
```

And add `goTo` to the `useMemo` dependency array:

```ts
    [stepIndex, sendStatus, next, back, goTo, reset, startSend, markReplied],
```

- [ ] **Step 4: Verify lint + build**

Run:
```bash
npm run lint && npm run build
```
Expected: zero warnings, build green. (`goTo` is defined but not yet consumed — that's fine, it's exported via context, not a local unused binding.)

- [ ] **Step 5: Commit** — SKIPPED (no-git-writes mode). Leave changes in the working tree.

---

## Task 2: Dark canvas theme (tokens, remap, grid, surfaces) + step-CSS background migration

**Files:**
- Modify: `src/demos/commercialCleaning/DemoPage.css`
- Modify: `src/demos/commercialCleaning/steps/DefineTargetStep.css`
- Modify: `src/demos/commercialCleaning/steps/DiscoverStep.css`
- Modify: `src/demos/commercialCleaning/steps/EnrichQualifyStep.css`
- Modify: `src/demos/commercialCleaning/steps/PersonalizeStep.css`
- Modify: `src/demos/commercialCleaning/steps/SendStep.css`
- Modify: `src/demos/commercialCleaning/steps/ResultsStep.css`

**Interfaces:**
- Consumes: nothing.
- Produces: the `.demo` token set (`--demo-bg`, `--demo-surface`, `--demo-surface-2`, `--demo-border`, `--demo-text`, `--demo-muted`, `--demo-accent`, `--demo-accent-bright`, `--demo-accent-glow`, `--demo-edge`, `--demo-edge-active`, `--demo-success`) that Task 3's `FlowMap.css` relies on, plus the dark canvas. After this task the page is dark with the old progress indicator still present (replaced in Task 4).

- [ ] **Step 1: Replace the `.demo` rule with the dark canvas + token block**

In `src/demos/commercialCleaning/DemoPage.css`, replace this exact rule:

```css
.demo {
  min-height: 100vh;
  padding: var(--spacing-lg) 0 var(--spacing-xl);
  background-color: var(--color-bg-light);
}
```

with:

```css
.demo {
  /* demo-only palette (does not affect anything outside .demo) */
  --demo-bg: #0d1117;
  --demo-surface: #161b22;
  --demo-surface-2: #1c2330;
  --demo-border: #2a3340;
  --demo-text: #e6edf3;
  --demo-muted: #8b97a7;
  --demo-accent: #2777b4;
  --demo-accent-bright: #5aa9e6;
  --demo-accent-glow: rgba(90, 169, 230, 0.5);
  --demo-edge: #2a3340;
  --demo-edge-active: #5aa9e6;
  --demo-success: #10b981;

  /* scope-local remap: flips existing step CSS to dark without touching index.css */
  --color-bg-light: var(--demo-surface-2);
  --color-border: var(--demo-border);
  --color-text: var(--demo-text);
  --color-text-light: var(--demo-muted);
  --color-secondary: var(--demo-muted);
  --color-primary: var(--demo-accent-bright);
  --color-primary-dark: var(--demo-accent);

  min-height: 100vh;
  padding: var(--spacing-lg) 0 var(--spacing-xl);
  color: var(--demo-text);
  background-color: var(--demo-bg);
  background-image: radial-gradient(
    circle,
    rgba(255, 255, 255, 0.06) 1px,
    transparent 1px
  );
  background-size: 22px 22px;
}
```

- [ ] **Step 2: Restyle the stage as a dark node card**

In `DemoPage.css`, replace this exact rule:

```css
.demo-stage {
  background: #fff;
  border: 1px solid var(--color-border);
  border-radius: 1rem;
  padding: var(--spacing-lg);
  min-height: 320px;
  box-shadow: 0 8px 30px rgba(15, 23, 42, 0.06);
}
```

with:

```css
.demo-stage {
  background: var(--demo-surface);
  border: 1px solid var(--demo-border);
  border-radius: 1rem;
  padding: var(--spacing-lg);
  min-height: 320px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.35);
}
```

- [ ] **Step 3: Verify the nav already flips (no edit) and lift the CTA shadow on dark**

The `.demo-btn-ghost` / `.demo-btn-primary` rules already use `var(--color-text)`, `var(--color-border)`, `var(--color-primary)` and flip via the remap — leave them. Update the CTA shadow for the dark background: in `DemoPage.css`, replace:

```css
  box-shadow: 0 4px 12px rgba(39, 119, 180, 0.25);
}

.demo-cta:hover {
```

with:

```css
  box-shadow: 0 4px 16px rgba(90, 169, 230, 0.35);
}

.demo-cta:hover {
```

- [ ] **Step 4: Migrate `DefineTargetStep.css` chip background**

In `src/demos/commercialCleaning/steps/DefineTargetStep.css`, replace:

```css
.define-chip {
  background: #fff;
  border: 1px solid var(--color-border);
```

with:

```css
.define-chip {
  background: var(--demo-surface);
  border: 1px solid var(--color-border);
```

- [ ] **Step 5: Migrate `DiscoverStep.css` card background**

In `src/demos/commercialCleaning/steps/DiscoverStep.css`, replace:

```css
.discover-card {
  border: 1px solid var(--color-border);
  border-radius: 0.75rem;
  padding: var(--spacing-md);
  background: #fff;
```

with:

```css
.discover-card {
  border: 1px solid var(--color-border);
  border-radius: 0.75rem;
  padding: var(--spacing-md);
  background: var(--demo-surface);
```

- [ ] **Step 6: Migrate `EnrichQualifyStep.css` card background**

Read `src/demos/commercialCleaning/steps/EnrichQualifyStep.css` first. In the `.enrich-card` rule, change its `background: #fff;` line to `background: var(--demo-surface);`. (The `.enrich-card.is-dropped` rule uses `var(--color-bg-light)` and flips automatically — leave it.) Use this exact replacement:

```css
.enrich-card {
  border: 1px solid var(--color-border);
  border-radius: 0.75rem;
  padding: var(--spacing-md);
  background: #fff;
}
```

→

```css
.enrich-card {
  border: 1px solid var(--color-border);
  border-radius: 0.75rem;
  padding: var(--spacing-md);
  background: var(--demo-surface);
}
```

- [ ] **Step 7: Migrate `PersonalizeStep.css` email-card background**

In `src/demos/commercialCleaning/steps/PersonalizeStep.css`, replace:

```css
.email-card {
  max-width: 640px;
  margin: 0 auto;
  border: 1px solid var(--color-border);
  border-radius: 0.75rem;
  overflow: hidden;
  background: #fff;
}
```

→

```css
.email-card {
  max-width: 640px;
  margin: 0 auto;
  border: 1px solid var(--color-border);
  border-radius: 0.75rem;
  overflow: hidden;
  background: var(--demo-surface);
}
```

- [ ] **Step 8: Migrate `SendStep.css` backgrounds (two rules)**

In `src/demos/commercialCleaning/steps/SendStep.css`, replace the `.send-envelope` background:

```css
  border-radius: 0.75rem;
  padding: var(--spacing-md);
  background: #fff;
  margin-bottom: var(--spacing-lg);
}
```

→

```css
  border-radius: 0.75rem;
  padding: var(--spacing-md);
  background: var(--demo-surface);
  margin-bottom: var(--spacing-lg);
}
```

Then replace the `.send-stage-icon` background:

```css
  border: 2px solid var(--color-border);
  background: #fff;
  color: var(--color-text-light);
```

→

```css
  border: 2px solid var(--color-border);
  background: var(--demo-surface-2);
  color: var(--color-text-light);
```

- [ ] **Step 9: Migrate `ResultsStep.css` reply-card background**

In `src/demos/commercialCleaning/steps/ResultsStep.css`, replace:

```css
  border-radius: 0.75rem;
  padding: var(--spacing-md);
  background: #fff;
  opacity: 0;
```

→

```css
  border-radius: 0.75rem;
  padding: var(--spacing-md);
  background: var(--demo-surface);
  opacity: 0;
```

- [ ] **Step 10: Verify lint + build**

Run:
```bash
npm run lint && npm run build
```
Expected: zero warnings, build green.

- [ ] **Step 11: Manual check (interim)**

`npm run dev` → `/demos/commercial-cleaning`. The page is now dark with a dotted grid; the stage and all step content (prospect cards, email, tally) read as dark cards with light text. The old numbered progress indicator is still present and looks dark — that's expected; it's replaced in Task 4. Stop the server. *(Implementer: skip if not running a browser; lint+build is the gate.)*

- [ ] **Step 12: Commit** — SKIPPED (no-git-writes mode).

---

## Task 3: `stepMeta.ts` + `FlowMap` component

**Files:**
- Create: `src/demos/commercialCleaning/stepMeta.ts`
- Create: `src/demos/commercialCleaning/FlowMap.tsx`
- Create: `src/demos/commercialCleaning/FlowMap.css`

**Interfaces:**
- Consumes: `useDemo` (`stepIndex`, `goTo`), `STEPS`, `StepId` from `DemoController`; `usePrefersReducedMotion`; the `--demo-*` tokens from Task 2.
- Produces:
  - `STEP_META: Record<StepId, { label: string; Icon: IconType }>` (exported from `stepMeta.ts`) — consumed by `FlowMap` and (Task 4) `DemoPage`.
  - `FlowMap` default-export React component (no props) — rendered by Task 4.

- [ ] **Step 1: Create the step metadata module**

Create `src/demos/commercialCleaning/stepMeta.ts`:

```ts
import {
  FaBullseye,
  FaSearchLocation,
  FaFilter,
  FaPenFancy,
  FaPaperPlane,
  FaChartLine,
} from "react-icons/fa";
import type { IconType } from "react-icons";
import type { StepId } from "./DemoController";

export const STEP_META: Record<StepId, { label: string; Icon: IconType }> = {
  define: { label: "Define target", Icon: FaBullseye },
  discover: { label: "Discover", Icon: FaSearchLocation },
  enrich: { label: "Enrich & qualify", Icon: FaFilter },
  personalize: { label: "Personalize", Icon: FaPenFancy },
  send: { label: "Send", Icon: FaPaperPlane },
  results: { label: "Reply & results", Icon: FaChartLine },
};
```

- [ ] **Step 2: Create the FlowMap component**

Create `src/demos/commercialCleaning/FlowMap.tsx`:

```tsx
import { useEffect, useRef } from "react";
import { FaCheck } from "react-icons/fa";
import { useDemo, STEPS } from "./DemoController";
import { STEP_META } from "./stepMeta";
import { usePrefersReducedMotion } from "./usePrefersReducedMotion";
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
  const activeRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    const el = activeRef.current;
    if (!el) return;
    el.scrollIntoView({
      inline: "center",
      block: "nearest",
      behavior: reduced ? "auto" : "smooth",
    });
  }, [stepIndex, reduced]);

  return (
    <nav className="flow-map" aria-label="Workflow steps">
      <ol className="flow-track">
        {STEPS.map((id, i) => {
          const { label, Icon } = STEP_META[id];
          const status =
            i < stepIndex ? "done" : i === stepIndex ? "active" : "upcoming";
          const connState: ConnState =
            i < stepIndex ? "done" : i === stepIndex ? "active" : "idle";
          return (
            <li key={id} className="flow-item">
              {i > 0 && <Connector state={connState} />}
              <button
                type="button"
                ref={i === stepIndex ? activeRef : null}
                className={`flow-node flow-node-${status}`}
                onClick={() => goTo(i)}
                aria-current={i === stepIndex ? "step" : undefined}
                aria-label={`Step ${i + 1}: ${label}`}
              >
                <span className="flow-node-badge">
                  {i < stepIndex ? <FaCheck /> : <Icon />}
                </span>
                <span className="flow-node-label">{label}</span>
              </button>
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default FlowMap;
```

- [ ] **Step 3: Create the FlowMap styles**

Create `src/demos/commercialCleaning/FlowMap.css`:

```css
.flow-map {
  margin-bottom: var(--spacing-lg);
}

.flow-track {
  display: flex;
  align-items: center;
  justify-content: center;
  list-style: none;
  flex-wrap: nowrap;
}

.flow-item {
  display: flex;
  align-items: center;
}

/* Nodes */
.flow-node {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-xs);
  min-width: 96px;
  padding: var(--spacing-sm) var(--spacing-md);
  background: var(--demo-surface);
  border: 1px solid var(--demo-border);
  border-radius: 0.75rem;
  color: var(--demo-text);
  cursor: pointer;
  transition: border-color 0.2s ease, box-shadow 0.2s ease,
    transform 0.2s ease, opacity 0.2s ease;
}

.flow-node:hover {
  border-color: var(--demo-accent-bright);
}

.flow-node-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: var(--demo-surface-2);
  color: var(--demo-accent-bright);
  font-size: 1.1rem;
}

.flow-node-label {
  font-size: 0.8rem;
  font-weight: 600;
  white-space: nowrap;
}

.flow-node-upcoming {
  opacity: 0.5;
}

.flow-node-done {
  border-color: rgba(16, 185, 129, 0.5);
}

.flow-node-done .flow-node-badge {
  background: var(--demo-success);
  color: #fff;
}

.flow-node-active {
  border-color: var(--demo-accent-bright);
  transform: translateY(-2px);
  box-shadow: 0 0 0 1px var(--demo-accent-bright),
    0 0 16px var(--demo-accent-glow);
  animation: flow-pulse 1.8s ease-in-out infinite;
}

.flow-node-active .flow-node-badge {
  background: rgba(90, 169, 230, 0.15);
}

@keyframes flow-pulse {
  0%,
  100% {
    box-shadow: 0 0 0 1px var(--demo-accent-bright),
      0 0 12px var(--demo-accent-glow);
  }
  50% {
    box-shadow: 0 0 0 1px var(--demo-accent-bright),
      0 0 24px var(--demo-accent-glow);
  }
}

/* Connectors */
.flow-conn {
  flex: 0 0 auto;
}

.flow-conn-line {
  stroke: var(--demo-edge);
  stroke-width: 2;
  fill: none;
}

.flow-conn-done .flow-conn-line {
  stroke: var(--demo-accent);
}

.flow-conn-active .flow-conn-line {
  stroke: var(--demo-edge-active);
  stroke-dasharray: 6 6;
  animation: flow-dash 0.6s linear infinite;
}

@keyframes flow-dash {
  to {
    stroke-dashoffset: -12;
  }
}

@media (max-width: 768px) {
  .flow-track {
    justify-content: flex-start;
    overflow-x: auto;
    padding-bottom: var(--spacing-xs);
  }

  .flow-node {
    min-width: 84px;
    padding: var(--spacing-xs) var(--spacing-sm);
  }
}

@media (prefers-reduced-motion: reduce) {
  .flow-node-active {
    animation: none;
  }

  .flow-conn-active .flow-conn-line {
    animation: none;
    stroke-dasharray: none;
  }
}
```

- [ ] **Step 4: Verify lint + build**

Run:
```bash
npm run lint && npm run build
```
Expected: zero warnings, build green. (`FlowMap` is not yet rendered — that's fine; it's an exported component, not an unused local.)

- [ ] **Step 5: Commit** — SKIPPED (no-git-writes mode).

---

## Task 4: Wire FlowMap into DemoPage + node-card stage header

**Files:**
- Modify: `src/demos/commercialCleaning/DemoPage.tsx` (full rewrite below)
- Modify: `src/demos/commercialCleaning/DemoPage.css` (remove old progress rules, add stage-header rules)

**Interfaces:**
- Consumes: `FlowMap` (default), `STEP_META` (from `stepMeta.ts`), existing `DemoController`/provider/steps.
- Produces: final demo page — `FlowMap` replaces `StepProgress`; the stage gains an icon + title header.

- [ ] **Step 1: Rewrite `DemoPage.tsx`**

Replace the entire contents of `src/demos/commercialCleaning/DemoPage.tsx` with:

```tsx
import { FaCalendarAlt } from "react-icons/fa";
import { DemoProvider, useDemo } from "./DemoController";
import { scriptedWorkflowProvider } from "./ScriptedWorkflowProvider";
import { STEP_META } from "./stepMeta";
import FlowMap from "./FlowMap";
import DefineTargetStep from "./steps/DefineTargetStep";
import DiscoverStep from "./steps/DiscoverStep";
import EnrichQualifyStep from "./steps/EnrichQualifyStep";
import PersonalizeStep from "./steps/PersonalizeStep";
import SendStep from "./steps/SendStep";
import ResultsStep from "./steps/ResultsStep";
import "./DemoPage.css";

const provider = scriptedWorkflowProvider;

const CALENDLY_URL = "https://calendly.com/brian-paradigmshiftdev/30min";

function StageHeader() {
  const { stepId, stepIndex } = useDemo();
  const { label, Icon } = STEP_META[stepId];
  return (
    <div className="demo-stage-header">
      <span className="demo-stage-badge">
        <Icon />
      </span>
      <h2 className="demo-stage-title">{label}</h2>
      <span className="demo-stage-count">Step {stepIndex + 1} of 6</span>
    </div>
  );
}

function StepBody() {
  const { stepId } = useDemo();
  switch (stepId) {
    case "define":
      return <DefineTargetStep provider={provider} />;
    case "discover":
      return <DiscoverStep provider={provider} />;
    case "enrich":
      return <EnrichQualifyStep provider={provider} />;
    case "personalize":
      return <PersonalizeStep provider={provider} />;
    case "send":
      return <SendStep provider={provider} />;
    case "results":
      return <ResultsStep provider={provider} />;
    default:
      return null;
  }
}

function DemoNav() {
  const { back, next, reset, canBack, canNext } = useDemo();
  return (
    <div className="demo-nav">
      <button
        className="demo-btn demo-btn-ghost"
        onClick={back}
        disabled={!canBack}
      >
        ← Back
      </button>
      <button className="demo-btn demo-btn-ghost" onClick={reset}>
        Restart demo
      </button>
      <button
        className="demo-btn demo-btn-primary"
        onClick={next}
        disabled={!canNext}
      >
        Next →
      </button>
    </div>
  );
}

function DemoShell() {
  const company = provider.getCompany();
  return (
    <main className="demo">
      <div className="container">
        <header className="demo-header">
          <p className="demo-eyebrow">Paradigm Shift — Workflow Demo</p>
          <h1 className="demo-title">Outbound lead-gen for {company.name}</h1>
          <p className="demo-lede">
            A click-through of how the workflow finds, qualifies, personalizes,
            and reaches out to local leads — end to end.
          </p>
          <a
            href={CALENDLY_URL}
            className="demo-cta"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaCalendarAlt className="demo-cta-icon" />
            Book a 30-minute call
          </a>
        </header>

        <FlowMap />

        <section className="demo-stage">
          <StageHeader />
          <StepBody />
        </section>

        <DemoNav />
      </div>
    </main>
  );
}

const DemoPage = () => {
  return (
    <DemoProvider>
      <DemoShell />
    </DemoProvider>
  );
};

export default DemoPage;
```

Note: this removes the local `STEP_LABELS` and `StepProgress` (now provided by `FlowMap` + `STEP_META`) and the now-unused `STEPS`/`StepId` imports.

- [ ] **Step 2: Remove the old progress CSS and add stage-header CSS**

In `src/demos/commercialCleaning/DemoPage.css`, delete this entire block (the progress-indicator rules):

```css
/* Progress indicator */
.demo-progress {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-sm);
  justify-content: center;
  list-style: none;
  margin-bottom: var(--spacing-lg);
}

.demo-progress-item {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  color: var(--color-text-light);
  font-size: 0.875rem;
}

.demo-progress-dot {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  border: 2px solid var(--color-border);
  background: #fff;
  font-weight: 700;
  font-size: 0.8rem;
}

.demo-progress-item.is-active .demo-progress-dot {
  border-color: var(--color-primary);
  color: var(--color-primary);
}

.demo-progress-item.is-active {
  color: var(--color-text);
  font-weight: 600;
}

.demo-progress-item.is-complete .demo-progress-dot {
  border-color: var(--color-success);
  background: var(--color-success);
  color: #fff;
}
```

Then, immediately before the `/* Stage */` comment, add the stage-header rules:

```css
/* Stage header */
.demo-stage-header {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  padding-bottom: var(--spacing-md);
  margin-bottom: var(--spacing-md);
  border-bottom: 1px solid var(--demo-border);
}

.demo-stage-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 0.6rem;
  background: rgba(90, 169, 230, 0.15);
  color: var(--demo-accent-bright);
  font-size: 1.15rem;
  box-shadow: 0 0 12px var(--demo-accent-glow);
}

.demo-stage-title {
  font-size: 1.25rem;
  margin: 0;
}

.demo-stage-count {
  margin-left: auto;
  font-size: 0.8rem;
  color: var(--demo-muted);
  white-space: nowrap;
}
```

Also remove the now-orphaned mobile rule for the progress label. In the `@media (max-width: 768px)` block, delete:

```css
  .demo-progress-label {
    display: none;
  }
```

- [ ] **Step 3: Verify lint + build**

Run:
```bash
npm run lint && npm run build
```
Expected: zero warnings (no unused `STEPS`/`StepId`/`STEP_LABELS`), build green.

- [ ] **Step 4: Manual walkthrough (desktop + mobile + reduced-motion)**

`npm run dev` → `/demos/commercial-cleaning`:
- The flow map shows six connected nodes with icons; the active node glows/pulses and is raised; completed nodes show a green check; the connector entering the active node shows traveling dashes; upcoming nodes/connectors are dimmed.
- Back / Next / Restart still work; **clicking any flow node jumps to that step**; the stage header updates its icon + title + "Step N of 6".
- All step content remains legible on dark and still animates (Discover reveal, Personalize typing, Send lifecycle, Results reply + tally).
- Narrow the window to ≤768px: the flow strip scrolls horizontally and auto-centers the active node as you advance.
- Toggle OS "reduce motion" and reload: connector dashes, node pulse, and the auto-center scroll are static/instant; in-step animations collapse to instant as before.

Stop the server. *(Implementer: if not running a browser, lint+build is the gate; flag that the visual checks are deferred to the human.)*

- [ ] **Step 5: Commit** — SKIPPED (no-git-writes mode).

---

## Self-Review (completed against the spec)

- **§3 restyle-as-nodes / full dark / flowing connectors** → Task 2 (dark canvas), Task 3 (FlowMap nodes + animated connectors). ✓
- **§4 demo-scoped tokens, no global override, inner-content migration** → Task 2: tokens + scoped remap declared inside `.demo` (not `index.css`); hardcoded `#fff` card backgrounds migrated to `--demo-surface`; all token-based colors flip via the remap. ✓ *(Mechanism note: the spec described migrating each rule to `--demo-*` tokens; the plan instead remaps the existing palette tokens within the `.demo` scope and only edits the non-token `#fff` literals. Same visual result, same "nothing outside the demo changes" guarantee, far less churn. Flagged here so review doesn't read it as a deviation.)*
- **§5 FlowMap: nodes + SVG connectors, states (completed check / active glow+pulse / upcoming dim), connector state by right-hand node index, clickable goTo, a11y (`aria-current`, labels)** → Task 3 `FlowMap.tsx`/`.css`; connector `connState` uses `i < stepIndex ? done : i === stepIndex ? active : idle` matching the spec's `r = i`. ✓
- **§6 `goTo(index)` bounds-guarded + clears timers, added to context value + deps** → Task 1. ✓
- **§7 stage as node card with glowing accent header (icon + title)** → Task 4 `StageHeader` + `.demo-stage-header`/`.demo-stage-badge`. ✓
- **§8 responsive: horizontal desktop, scrollable strip + auto-center active on ≤768px, instant under reduced motion** → Task 3 `scrollIntoView` (behavior gated on `reduced`) + `FlowMap.css` mobile + reduced-motion blocks. ✓
- **§9 edge cases: presentational only, goTo bounds-guarded, CSS-only animation degrades, no new timers** → Tasks 1 & 3. ✓
- **§10 affected files** → exactly the files listed; no step `.tsx`, `script.ts`, `types.ts`, routing, or `index.css` touched. ✓
- **§11 DoD: lint zero-warnings, build green, manual walkthrough desktop/mobile/reduced-motion** → every task gates on lint+build; Task 4 full walkthrough. ✓

**Type/name consistency:** `goTo` (Task 1) is consumed by `FlowMap` (Task 3) with the same signature. `STEP_META`/`StepId` are defined in `stepMeta.ts`/`DemoController` and used identically in `FlowMap` and `DemoPage`. Demo token names declared in Task 2 (`--demo-surface`, `--demo-accent-bright`, `--demo-accent-glow`, `--demo-edge`, `--demo-edge-active`, `--demo-success`, etc.) are the exact names referenced by Task 3's `FlowMap.css` and Task 4's stage-header CSS.
