# Automation Demos: Shared Engine + Win-Back Campaign — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

Spec: [[2026-07-11-automation-demos-shared-engine-winback-design]]

**Goal:** Extract the reusable machinery from the commercial cleaning demo into a shared demo engine, refactor that demo onto it (behavior-preserving), then build a new Win-Back Campaign interactive simulator (dental persona) on the engine at `/demos/win-back-campaign`.

**Architecture:** A per-demo `DemoStep[]` config drives a generic engine in `src/demos/shared/` (stepped `DemoController`, a lifted `SendLifecycleProvider`, `FlowMap`/`FlowAiLane`, `AiPanel`, `DemoShell`, reduced-motion hook, shared CSS). Each demo is a thin folder providing its steps, a scripted `WorkflowProvider`, step components, and header copy. Demos render full-bleed (outside the site `Layout`) and carry their own scope-local dark palette.

**Tech Stack:** React 18 + TypeScript, Vite 5, react-router-dom v6, react-icons, vanilla CSS with custom properties.

## Global Constraints

- **No test framework exists.** Per-task verification is `npm run build` (tsc + Vite) and, for UI tasks, a manual `npm run dev` smoke check. The final task also runs `npm run lint`.
- **`npm run lint` must pass with zero warnings** (`--max-warnings 0`). No unused imports/vars. Preserve existing `// eslint-disable-next-line react-refresh/only-export-components` directives on files that export both a component and a hook (e.g. controllers/providers).
- **Git is read-only for the assistant** (per CLAUDE.md). Do NOT run `git add`/`git commit`/`git mv`/`rm`. Create/modify file contents with the editor; for deletions, list the files and surface the exact `git rm`/`rm` command to Brian. Each task's commit step lists the exact command to surface.
- **Full-bleed demos:** demo routes render outside `Layout` (no shared `Header`/`Footer`), matching `/demos/commercial-cleaning`.
- **Calendly URL (verbatim):** `https://calendly.com/brian-paradigmshiftdev/30min` — booking CTAs use `target="_blank"` + `rel="noopener noreferrer"`. It lives once in `DemoShell`.
- **Behavior-preserving refactor:** after Task 4, `/demos/commercial-cleaning` must look and behave identically — same six steps, AI panels, send animation, and nav.
- **Demo palette:** the `.demo` wrapper's scope-local dark palette (moved verbatim into `DemoShell.css`) is intentional and unchanged. Do not re-tint the demo to the site theme in this plan.

---

## File Structure

**New — shared engine (`src/demos/shared/`)**
- `types.ts` — `DemoStep`.
- `usePrefersReducedMotion.ts` — verbatim copy of the commercial cleaning hook.
- `AiPanel.tsx` + `AiPanel.css` — verbatim copy (already generic).
- `DemoController.tsx` — generic stepped controller (navigation only).
- `SendLifecycleProvider.tsx` — send-lifecycle context + hook (extracted from the old controller).
- `FlowMap.tsx` + `FlowMap.css` — generalized (reads `steps` from context); CSS verbatim copy.
- `FlowAiLane.tsx` + `FlowAiLane.css` — generalized (AI nodes from a prop); CSS verbatim copy.
- `DemoShell.tsx` + `DemoShell.css` — shell layout; CSS is the old `DemoPage.css` verbatim.

**New — Win-Back demo (`src/demos/winBackCampaign/`)**
- `types.ts`, `script.ts`, `provider.ts`, `steps.ts`, `WinBackDemo.tsx`, `winback.css`
- `steps/ImportListStep.tsx`, `SegmentStep.tsx`, `CraftOfferStep.tsx`, `SendStep.tsx`, `RepliesStep.tsx`, `ResultsStep.tsx`

**Modified**
- `src/demos/commercialCleaning/DemoPage.tsx` — rewritten to compose the shared engine.
- `src/demos/commercialCleaning/steps/{Discover,EnrichQualify,Personalize,Send,Results}Step.tsx` — import remaps (below).
- `src/demos/commercialCleaning/steps.ts` — NEW (replaces `stepMeta.ts`).
- `src/App.tsx` — add the Win-Back route.
- `src/components/AutomatedWorkflows.tsx` — the "Win-Back Campaigns" example card becomes a link.

**Deleted (surface removal commands to Brian, after Task 4)**
- `src/demos/commercialCleaning/DemoController.tsx`, `FlowMap.tsx`, `FlowMap.css`, `FlowAiLane.tsx`, `FlowAiLane.css`, `AiPanel.tsx`, `AiPanel.css`, `usePrefersReducedMotion.ts`, `DemoPage.css`, `stepMeta.ts`.

---

## Task 1: Shared engine — core logic

**Files:**
- Create: `src/demos/shared/types.ts`
- Create: `src/demos/shared/usePrefersReducedMotion.ts`
- Create: `src/demos/shared/AiPanel.tsx`, `src/demos/shared/AiPanel.css`
- Create: `src/demos/shared/DemoController.tsx`
- Create: `src/demos/shared/SendLifecycleProvider.tsx`

**Interfaces:**
- Produces:
  - `interface DemoStep { id: string; label: string; Icon: IconType; isAi?: boolean }`
  - `DemoProvider({ steps, children })`; `useDemo(): { steps, stepIndex, stepId, next, back, goTo, reset, canBack, canNext, resetNonce }`
  - `SendLifecycleProvider({ children })`; `useSendLifecycle(): { status: SendStatus, start(), markReplied() }`; `type SendStatus`
  - `AiPanel` (props `{ title, lines, animate?, onComplete? }`), `usePrefersReducedMotion()`

- [ ] **Step 1: `src/demos/shared/types.ts`**

```ts
import type { IconType } from "react-icons";

export interface DemoStep {
  id: string;
  label: string;
  Icon: IconType;
  isAi?: boolean;
}
```

- [ ] **Step 2: `src/demos/shared/usePrefersReducedMotion.ts`**

Copy the file `src/demos/commercialCleaning/usePrefersReducedMotion.ts` verbatim (identical contents) into `src/demos/shared/usePrefersReducedMotion.ts`. No changes.

- [ ] **Step 3: `src/demos/shared/AiPanel.tsx` and `AiPanel.css`**

Copy `src/demos/commercialCleaning/AiPanel.tsx` and `AiPanel.css` verbatim into `src/demos/shared/`. No content changes (the component is already generic).

- [ ] **Step 4: `src/demos/shared/DemoController.tsx`**

```tsx
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { DemoStep } from "./types";

interface DemoContextValue {
  steps: DemoStep[];
  stepIndex: number;
  stepId: string;
  next: () => void;
  back: () => void;
  goTo: (index: number) => void;
  reset: () => void;
  /** Increments on every reset() — lets sibling providers reset in response. */
  resetNonce: number;
  canBack: boolean;
  canNext: boolean;
}

const DemoContext = createContext<DemoContextValue | null>(null);

export function DemoProvider({
  steps,
  children,
}: {
  steps: DemoStep[];
  children: ReactNode;
}) {
  const [stepIndex, setStepIndex] = useState(0);
  const [resetNonce, setResetNonce] = useState(0);
  const last = steps.length - 1;

  const next = useCallback(
    () => setStepIndex((i) => Math.min(i + 1, last)),
    [last],
  );
  const back = useCallback(() => setStepIndex((i) => Math.max(i - 1, 0)), []);
  const goTo = useCallback(
    (index: number) => setStepIndex(Math.min(Math.max(index, 0), last)),
    [last],
  );
  const reset = useCallback(() => {
    setStepIndex(0);
    setResetNonce((n) => n + 1);
  }, []);

  const value = useMemo<DemoContextValue>(
    () => ({
      steps,
      stepIndex,
      stepId: steps[stepIndex].id,
      next,
      back,
      goTo,
      reset,
      resetNonce,
      canBack: stepIndex > 0,
      canNext: stepIndex < last,
    }),
    [steps, stepIndex, next, back, goTo, reset, resetNonce, last],
  );

  return <DemoContext.Provider value={value}>{children}</DemoContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useDemo(): DemoContextValue {
  const ctx = useContext(DemoContext);
  if (!ctx) {
    throw new Error("useDemo must be used within a DemoProvider");
  }
  return ctx;
}
```

- [ ] **Step 5: `src/demos/shared/SendLifecycleProvider.tsx`**

The mocked send animation, lifted to demo scope so status survives the Send → Results step change. Resets only when the demo is restarted (via `resetNonce`), matching the original controller's `reset()` semantics.

```tsx
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { usePrefersReducedMotion } from "./usePrefersReducedMotion";
import { useDemo } from "./DemoController";

export type SendStatus =
  | "idle"
  | "sending"
  | "delivered"
  | "opened"
  | "replied";

/** Timings for the mocked send lifecycle (ms). */
const SENDING_MS = 1100;
const DELIVERED_MS = 1100;

interface SendLifecycleValue {
  status: SendStatus;
  start: () => void;
  markReplied: () => void;
}

const Ctx = createContext<SendLifecycleValue | null>(null);

export function SendLifecycleProvider({ children }: { children: ReactNode }) {
  const [status, setStatus] = useState<SendStatus>("idle");
  const reduced = usePrefersReducedMotion();
  const timers = useRef<number[]>([]);
  const { resetNonce } = useDemo();

  const clear = useCallback(() => {
    timers.current.forEach((id) => window.clearTimeout(id));
    timers.current = [];
  }, []);

  useEffect(() => clear, [clear]);

  // Reset only on an explicit demo restart (not on back-navigation).
  const firstRun = useRef(true);
  useEffect(() => {
    if (firstRun.current) {
      firstRun.current = false;
      return;
    }
    clear();
    setStatus("idle");
  }, [resetNonce, clear]);

  const start = useCallback(() => {
    clear();
    if (reduced) {
      setStatus("opened");
      return;
    }
    setStatus("sending");
    timers.current.push(
      window.setTimeout(() => setStatus("delivered"), SENDING_MS),
    );
    timers.current.push(
      window.setTimeout(
        () => setStatus("opened"),
        SENDING_MS + DELIVERED_MS,
      ),
    );
  }, [clear, reduced]);

  const markReplied = useCallback(() => setStatus("replied"), []);

  const value = useMemo<SendLifecycleValue>(
    () => ({ status, start, markReplied }),
    [status, start, markReplied],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useSendLifecycle(): SendLifecycleValue {
  const ctx = useContext(Ctx);
  if (!ctx) {
    throw new Error(
      "useSendLifecycle must be used within a SendLifecycleProvider",
    );
  }
  return ctx;
}
```

- [ ] **Step 6: Build**

Run: `npm run build`
Expected: succeeds. New files compile; nothing consumes them yet.

- [ ] **Step 7: Commit (surface command to Brian)**

```bash
git add src/demos/shared/types.ts src/demos/shared/usePrefersReducedMotion.ts src/demos/shared/AiPanel.tsx src/demos/shared/AiPanel.css src/demos/shared/DemoController.tsx src/demos/shared/SendLifecycleProvider.tsx
git commit -m "feat: add shared demo engine core (controller, send lifecycle, ai panel)"
```

---

## Task 2: Shared engine — flow visualization

**Files:**
- Create: `src/demos/shared/FlowMap.tsx`, `src/demos/shared/FlowMap.css`
- Create: `src/demos/shared/FlowAiLane.tsx`, `src/demos/shared/FlowAiLane.css`

**Interfaces:**
- Consumes: `useDemo` (Task 1), `usePrefersReducedMotion` (Task 1).
- Produces: default export `FlowMap` (no props; reads steps from context). `FlowAiLane` (props `{ containerRef, aiNodeRefs, aiStepIds, activeStepId }`).

- [ ] **Step 1: `src/demos/shared/FlowAiLane.css` and `FlowMap.css`**

Copy `src/demos/commercialCleaning/FlowAiLane.css` and `FlowMap.css` verbatim into `src/demos/shared/`. No changes.

- [ ] **Step 2: `src/demos/shared/FlowAiLane.tsx`**

Generalized from the commercial cleaning version: AI node ids come from a prop (`aiStepIds`) and refs are keyed by `string` instead of the old `StepId` union.

```tsx
import { useEffect, useRef, useState, type RefObject } from "react";
import { FaMagic } from "react-icons/fa";
import { usePrefersReducedMotion } from "./usePrefersReducedMotion";
import "./FlowAiLane.css";

interface Point {
  x: number;
  y: number;
}

interface Edge {
  id: string;
  from: Point; // Claude node (top-center)
  to: Point; // AI step node (bottom-center)
}

interface FlowAiLaneProps {
  containerRef: RefObject<HTMLElement | null>;
  aiNodeRefs: RefObject<Record<string, HTMLButtonElement | null>>;
  aiStepIds: string[];
  activeStepId: string;
}

const FlowAiLane = ({
  containerRef,
  aiNodeRefs,
  aiStepIds,
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
      for (const id of aiStepIds) {
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
  }, [containerRef, aiNodeRefs, aiStepIds]);

  return (
    <>
      <svg
        className="flow-ai-edges"
        width={size.w}
        height={size.h}
        aria-hidden="true"
      >
        {edges.map((e) => {
          const midY = (e.to.y + e.from.y) / 2;
          const d = `M ${e.to.x} ${e.to.y} C ${e.to.x} ${midY}, ${e.from.x} ${midY}, ${e.from.x} ${e.from.y}`;
          const active = e.id === activeStepId && !reduced;
          return (
            <path
              key={e.id}
              d={d}
              className={"flow-ai-edge" + (active ? " is-active" : "")}
            />
          );
        })}
      </svg>
      <div className="flow-ai-lane">
        <div className="flow-ai-node" ref={claudeRef}>
          <span className="flow-ai-badge" aria-hidden="true">
            <FaMagic />
          </span>
          <span className="flow-ai-label">Claude</span>
          <span className="flow-ai-sub">Anthropic</span>
        </div>
      </div>
    </>
  );
};

export default FlowAiLane;
```

- [ ] **Step 3: `src/demos/shared/FlowMap.tsx`**

Generalized: reads `steps` from `useDemo()`, derives AI ids, and only renders the AI lane when the demo has AI steps.

```tsx
import { useEffect, useRef } from "react";
import { FaCheck, FaMagic } from "react-icons/fa";
import { useDemo } from "./DemoController";
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
  const { steps, stepIndex, goTo } = useDemo();
  const reduced = usePrefersReducedMotion();
  const containerRef = useRef<HTMLElement | null>(null);
  const activeRef = useRef<HTMLButtonElement | null>(null);
  const aiNodeRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const aiStepIds = steps.filter((s) => s.isAi).map((s) => s.id);

  useEffect(() => {
    activeRef.current?.scrollIntoView({
      inline: "center",
      block: "nearest",
      behavior: reduced ? "auto" : "smooth",
    });
  }, [stepIndex, reduced]);

  const setNodeRef =
    (id: string, isActive: boolean) => (el: HTMLButtonElement | null) => {
      if (isActive) activeRef.current = el;
      if (aiStepIds.includes(id)) aiNodeRefs.current[id] = el;
    };

  return (
    <nav className="flow-map" aria-label="Workflow steps" ref={containerRef}>
      <ol className="flow-track">
        {steps.map((step, i) => {
          const status =
            i < stepIndex ? "done" : i === stepIndex ? "active" : "upcoming";
          const connState: ConnState =
            i < stepIndex ? "done" : i === stepIndex ? "active" : "idle";
          const Icon = step.Icon;
          return (
            <li key={step.id} className="flow-item">
              {i > 0 && <Connector state={connState} />}
              <button
                type="button"
                ref={setNodeRef(step.id, i === stepIndex)}
                className={`flow-node flow-node-${status}`}
                onClick={() => goTo(i)}
                aria-current={i === stepIndex ? "step" : undefined}
                aria-label={`Step ${i + 1}: ${step.label}`}
              >
                {step.isAi && (
                  <span className="flow-node-ai-mark" aria-hidden="true">
                    <FaMagic />
                  </span>
                )}
                <span className="flow-node-badge">
                  {i < stepIndex ? <FaCheck /> : <Icon />}
                </span>
                <span className="flow-node-label">{step.label}</span>
              </button>
            </li>
          );
        })}
      </ol>

      {aiStepIds.length > 0 && (
        <>
          <FlowAiLane
            containerRef={containerRef}
            aiNodeRefs={aiNodeRefs}
            aiStepIds={aiStepIds}
            activeStepId={steps[stepIndex].id}
          />
          <p className="flow-ai-caption">
            <FaMagic aria-hidden="true" /> Powered by Claude
          </p>
        </>
      )}
    </nav>
  );
};

export default FlowMap;
```

- [ ] **Step 4: Build**

Run: `npm run build`
Expected: succeeds.

- [ ] **Step 5: Commit (surface command to Brian)**

```bash
git add src/demos/shared/FlowMap.tsx src/demos/shared/FlowMap.css src/demos/shared/FlowAiLane.tsx src/demos/shared/FlowAiLane.css
git commit -m "feat: add shared demo flow map + ai lane"
```

---

## Task 3: Shared engine — DemoShell

**Files:**
- Create: `src/demos/shared/DemoShell.tsx`
- Create: `src/demos/shared/DemoShell.css`

**Interfaces:**
- Consumes: `useDemo` (Task 1), `FlowMap` (Task 2).
- Produces: default export `DemoShell` (props `{ eyebrow: string; title: string; lede: string; renderStage: (stepId: string) => ReactNode }`).

- [ ] **Step 1: `src/demos/shared/DemoShell.css`**

Copy `src/demos/commercialCleaning/DemoPage.css` verbatim into `src/demos/shared/DemoShell.css`. No changes (this carries the `.demo` scope-local dark palette).

- [ ] **Step 2: `src/demos/shared/DemoShell.tsx`**

```tsx
import { FaCalendarAlt } from "react-icons/fa";
import type { ReactNode } from "react";
import { useDemo } from "./DemoController";
import FlowMap from "./FlowMap";
import "./DemoShell.css";

const CALENDLY_URL = "https://calendly.com/brian-paradigmshiftdev/30min";

interface DemoShellProps {
  eyebrow: string;
  title: string;
  lede: string;
  renderStage: (stepId: string) => ReactNode;
}

function StageHeader() {
  const { steps, stepIndex } = useDemo();
  const step = steps[stepIndex];
  const Icon = step.Icon;
  return (
    <div className="demo-stage-header">
      <span className="demo-stage-badge">
        <Icon />
      </span>
      <h2 className="demo-stage-title">{step.label}</h2>
      <span className="demo-stage-count">
        Step {stepIndex + 1} of {steps.length}
      </span>
    </div>
  );
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

const DemoShell = ({ eyebrow, title, lede, renderStage }: DemoShellProps) => {
  const { stepId } = useDemo();
  return (
    <main className="demo">
      <div className="container">
        <header className="demo-header">
          <p className="demo-eyebrow">{eyebrow}</p>
          <h1 className="demo-title">{title}</h1>
          <p className="demo-lede">{lede}</p>
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
          {renderStage(stepId)}
        </section>

        <DemoNav />
      </div>
    </main>
  );
};

export default DemoShell;
```

- [ ] **Step 3: Build**

Run: `npm run build`
Expected: succeeds.

- [ ] **Step 4: Commit (surface command to Brian)**

```bash
git add src/demos/shared/DemoShell.tsx src/demos/shared/DemoShell.css
git commit -m "feat: add shared demo shell"
```

---

## Task 4: Refactor commercial cleaning onto the engine

Behavior-preserving. After this task the commercial cleaning demo uses only the shared engine for machinery; its own generic files are deleted.

**Files:**
- Create: `src/demos/commercialCleaning/steps.ts`
- Modify: `src/demos/commercialCleaning/DemoPage.tsx`
- Modify: `src/demos/commercialCleaning/steps/DiscoverStep.tsx`, `EnrichQualifyStep.tsx`, `PersonalizeStep.tsx`, `SendStep.tsx`, `ResultsStep.tsx`
- Delete (surface commands): `DemoController.tsx`, `FlowMap.tsx`, `FlowMap.css`, `FlowAiLane.tsx`, `FlowAiLane.css`, `AiPanel.tsx`, `AiPanel.css`, `usePrefersReducedMotion.ts`, `DemoPage.css`, `stepMeta.ts`

**Interfaces:**
- Consumes: the shared engine (Tasks 1–3).

- [ ] **Step 1: Create `src/demos/commercialCleaning/steps.ts`** (replaces `stepMeta.ts`)

```ts
import {
  FaBullseye,
  FaSearchLocation,
  FaFilter,
  FaPenFancy,
  FaPaperPlane,
  FaChartLine,
} from "react-icons/fa";
import type { DemoStep } from "../shared/types";

export const steps: DemoStep[] = [
  { id: "define", label: "Define target", Icon: FaBullseye },
  { id: "discover", label: "Discover", Icon: FaSearchLocation, isAi: true },
  { id: "enrich", label: "Enrich & qualify", Icon: FaFilter, isAi: true },
  { id: "personalize", label: "Personalize", Icon: FaPenFancy, isAi: true },
  { id: "send", label: "Send", Icon: FaPaperPlane },
  { id: "results", label: "Reply & results", Icon: FaChartLine },
];
```

- [ ] **Step 2: Rewrite `src/demos/commercialCleaning/DemoPage.tsx`**

```tsx
import type { ReactNode } from "react";
import { DemoProvider } from "../shared/DemoController";
import { SendLifecycleProvider } from "../shared/SendLifecycleProvider";
import DemoShell from "../shared/DemoShell";
import { steps } from "./steps";
import { scriptedWorkflowProvider } from "./ScriptedWorkflowProvider";
import DefineTargetStep from "./steps/DefineTargetStep";
import DiscoverStep from "./steps/DiscoverStep";
import EnrichQualifyStep from "./steps/EnrichQualifyStep";
import PersonalizeStep from "./steps/PersonalizeStep";
import SendStep from "./steps/SendStep";
import ResultsStep from "./steps/ResultsStep";

const provider = scriptedWorkflowProvider;

function renderStage(stepId: string): ReactNode {
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

const DemoPage = () => {
  return (
    <DemoProvider steps={steps}>
      <SendLifecycleProvider>
        <DemoShell
          eyebrow="Paradigm Shift — Workflow Demo"
          title={`Outbound lead-gen for ${provider.getCompany().name}`}
          lede="A click-through of how the workflow finds, qualifies, personalizes, and reaches out to local leads — end to end."
          renderStage={renderStage}
        />
      </SendLifecycleProvider>
    </DemoProvider>
  );
};

export default DemoPage;
```

- [ ] **Step 3: Remap imports in the retained step files**

Apply these exact import-specifier changes (only the ones present in each file):

- In `steps/DiscoverStep.tsx`, `steps/PersonalizeStep.tsx`:
  - `from "../usePrefersReducedMotion"` → `from "../../shared/usePrefersReducedMotion"`
  - `from "../AiPanel"` → `from "../../shared/AiPanel"`
- In `steps/EnrichQualifyStep.tsx`:
  - `from "../AiPanel"` → `from "../../shared/AiPanel"`
- In `steps/SendStep.tsx`:
  - Replace `import { useDemo, type SendStatus } from "../DemoController";` with `import { useSendLifecycle, type SendStatus } from "../../shared/SendLifecycleProvider";`
  - Replace `const { sendStatus, startSend } = useDemo();` with `const { status: sendStatus, start: startSend } = useSendLifecycle();`
- In `steps/ResultsStep.tsx`:
  - Replace `import { useDemo } from "../DemoController";` with `import { useSendLifecycle } from "../../shared/SendLifecycleProvider";`
  - `from "../usePrefersReducedMotion"` → `from "../../shared/usePrefersReducedMotion"`
  - Replace `const { markReplied } = useDemo();` with `const { markReplied } = useSendLifecycle();`

`steps/DefineTargetStep.tsx` needs no changes (it imports only `../types` and its own CSS).

- [ ] **Step 4: Delete the now-unused generic CC files (surface command to Brian)**

These are replaced by the shared engine and must be removed so nothing imports the old copies:

```bash
git rm src/demos/commercialCleaning/DemoController.tsx \
  src/demos/commercialCleaning/FlowMap.tsx src/demos/commercialCleaning/FlowMap.css \
  src/demos/commercialCleaning/FlowAiLane.tsx src/demos/commercialCleaning/FlowAiLane.css \
  src/demos/commercialCleaning/AiPanel.tsx src/demos/commercialCleaning/AiPanel.css \
  src/demos/commercialCleaning/usePrefersReducedMotion.ts \
  src/demos/commercialCleaning/DemoPage.css \
  src/demos/commercialCleaning/stepMeta.ts
```

(If executing without git, delete the same file paths from disk. The build in Step 5 will fail loudly if any straggler import remains.)

- [ ] **Step 5: Lint + build**

Run: `npm run lint` then `npm run build`
Expected: both pass, zero warnings. A leftover import of a deleted file surfaces here as a resolve error.

- [ ] **Step 6: Manual smoke test**

Run: `npm run dev`, open `/demos/commercial-cleaning`, and verify it is **unchanged**:
- Six steps in the flow map (Define → … → Reply & results) with the "Powered by Claude" AI lane over Discover/Enrich/Personalize.
- Clicking a flow node jumps to that step; Back/Next/Restart work; step count reads "Step N of 6".
- The Send step animates sending → delivered → opened; the Results step reveals the reply after a beat and shows the tally.
- Restart returns to step 1 and the send lifecycle resets.

- [ ] **Step 7: Commit (surface command to Brian)**

```bash
git add src/demos/commercialCleaning/steps.ts src/demos/commercialCleaning/DemoPage.tsx src/demos/commercialCleaning/steps/DiscoverStep.tsx src/demos/commercialCleaning/steps/EnrichQualifyStep.tsx src/demos/commercialCleaning/steps/PersonalizeStep.tsx src/demos/commercialCleaning/steps/SendStep.tsx src/demos/commercialCleaning/steps/ResultsStep.tsx
git commit -m "refactor: move commercial cleaning demo onto shared engine"
```

---

## Task 5: Win-Back demo — data layer

**Files:**
- Create: `src/demos/winBackCampaign/types.ts`, `script.ts`, `provider.ts`, `steps.ts`

**Interfaces:**
- Produces: the `WorkflowProvider` interface + `scriptedWorkflowProvider` instance + `steps: DemoStep[]`, consumed by Task 6.

- [ ] **Step 1: `src/demos/winBackCampaign/types.ts`**

```ts
export interface Practice {
  name: string;
  services: string[];
  winBackWindow: string;
  listSource: string;
  listSize: number;
}

export interface PatientRecord {
  id: string;
  name: string;
  lastVisitLabel: string;
  lastService: string;
  contact: string;
}

export interface Segment {
  id: string;
  label: string;
  criteria: string;
  count: number;
  winnable: boolean;
}

export interface DroppedSummary {
  dropped: number;
  reasons: string[];
}

export interface Offer {
  headline: string;
  detail: string;
  channel: string;
}

export interface DraftMessage {
  patientId: string;
  channel: string;
  body: string;
}

export interface Reply {
  patientId: string;
  fromName: string;
  channel: string;
  body: string;
  receivedLabel: string;
}

export interface Booking {
  patientId: string;
  service: string;
  when: string;
  value: string;
}

export interface ResultsSummary {
  contacted: number;
  delivered: number;
  replied: number;
  booked: number;
  revenueRecovered: string;
  takeaway: string;
}

export type AiStep = "segment" | "offer";

export interface AiReasoning {
  step: AiStep;
  title: string;
  lines: string[];
}

export interface WorkflowProvider {
  getPractice(): Practice;
  getPatients(): PatientRecord[];
  getSegments(): Segment[];
  getDroppedSummary(): DroppedSummary;
  getOffer(): Offer;
  getMessage(patientId: string): DraftMessage;
  getReply(patientId: string): Reply;
  getBooking(patientId: string): Booking;
  getResults(): ResultsSummary;
  getFeaturedPatientId(): string;
  getAiReasoning(step: AiStep): AiReasoning;
}
```

- [ ] **Step 2: `src/demos/winBackCampaign/script.ts`**

```ts
import type {
  Practice,
  PatientRecord,
  Segment,
  DroppedSummary,
  Offer,
  DraftMessage,
  Reply,
  Booking,
  ResultsSummary,
  AiStep,
  AiReasoning,
} from "./types";

export const practice: Practice = {
  name: "Riverbend Family Dental",
  services: ["Cleanings & exams", "Whitening", "Restorative"],
  winBackWindow: "No visit in 9+ months",
  listSource: "Practice management export (Dentrix)",
  listSize: 1420,
};

export const patients: PatientRecord[] = [
  {
    id: "wb1",
    name: "Marcus Bell",
    lastVisitLabel: "14 months ago",
    lastService: "Cleaning & exam",
    contact: "(•••) •••-4021",
  },
  {
    id: "wb2",
    name: "Priya Nair",
    lastVisitLabel: "11 months ago",
    lastService: "Cleaning",
    contact: "p•••@•••.com",
  },
  {
    id: "wb3",
    name: "Dana Whitfield",
    lastVisitLabel: "17 months ago",
    lastService: "Whitening",
    contact: "(•••) •••-8842",
  },
  {
    id: "wb4",
    name: "Owen Grant",
    lastVisitLabel: "3 months ago",
    lastService: "Cleaning & exam",
    contact: "(•••) •••-1190",
  },
];

export const featuredPatientId = "wb1";

export const segments: Segment[] = [
  {
    id: "s1",
    label: "Overdue hygiene (9–18 mo)",
    criteria: "Due for a cleaning, reachable, no active plan",
    count: 612,
    winnable: true,
  },
  {
    id: "s2",
    label: "Lapsed restorative",
    criteria: "Had treatment, no recall booked, high value",
    count: 138,
    winnable: true,
  },
];

export const droppedSummary: DroppedSummary = {
  dropped: 670,
  reasons: [
    "No valid phone or email on file",
    "Visited within the last 6 months",
    "Previously opted out of outreach",
  ],
};

export const offer: Offer = {
  headline: "$59 return cleaning + exam",
  detail:
    "New-patient-style pricing for lapsed patients, valid for 3 weeks, online booking link included.",
  channel: "SMS, with email fallback",
};

export const messages: DraftMessage[] = [
  {
    patientId: "wb1",
    channel: "SMS",
    body: "Hi Marcus, it's Riverbend Family Dental — it's been a while! We'd love to get you back in. Book a $59 cleaning + exam this month: rvbd.co/book. Reply STOP to opt out.",
  },
];

export const reply: Reply = {
  patientId: "wb1",
  fromName: "Marcus Bell",
  channel: "SMS",
  body: "Oh nice, I've been meaning to come in. Do you have anything Thursday afternoon?",
  receivedLabel: "About an hour later",
};

export const booking: Booking = {
  patientId: "wb1",
  service: "Cleaning & exam",
  when: "Thu 2:30 PM",
  value: "$220 first visit",
};

export const results: ResultsSummary = {
  contacted: 750,
  delivered: 731,
  replied: 96,
  booked: 41,
  revenueRecovered: "$9,020 booked",
  takeaway:
    "41 lapsed patients rebooked from one campaign — off a list the practice already owned, with no ad spend.",
};

export const aiReasoning: Record<AiStep, AiReasoning> = {
  segment: {
    step: "segment",
    title: "Claude — segmenting the list",
    lines: [
      "Scanning 1,420 patient records for recall gaps…",
      "Flagging visits older than 9 months with valid contact info.",
      "Separating high-value restorative lapses from routine hygiene.",
      "Dropping opt-outs and anyone seen in the last 6 months.",
      "2 winnable segments, 750 reachable patients.",
    ],
  },
  offer: {
    step: "offer",
    title: "Claude — drafting the offer & copy",
    lines: [
      "Picking an offer that clears the 'worth booking' bar: $59 cleaning + exam.",
      "Writing a short, personal SMS — first name, practice name, one link.",
      "Keeping it compliant: clear sender, easy opt-out.",
      "Tailoring tone per segment; drafting the featured message.",
    ],
  },
};
```

- [ ] **Step 3: `src/demos/winBackCampaign/provider.ts`**

```ts
import type {
  Practice,
  PatientRecord,
  Segment,
  DroppedSummary,
  Offer,
  DraftMessage,
  Reply,
  Booking,
  ResultsSummary,
  AiStep,
  AiReasoning,
  WorkflowProvider,
} from "./types";
import {
  practice,
  patients,
  segments,
  droppedSummary,
  offer,
  messages,
  reply,
  booking,
  results,
  featuredPatientId,
  aiReasoning,
} from "./script";

class ScriptedWorkflowProvider implements WorkflowProvider {
  getPractice(): Practice {
    return practice;
  }

  getPatients(): PatientRecord[] {
    return patients;
  }

  getSegments(): Segment[] {
    return segments;
  }

  getDroppedSummary(): DroppedSummary {
    return droppedSummary;
  }

  getOffer(): Offer {
    return offer;
  }

  getMessage(patientId: string): DraftMessage {
    const found = messages.find((m) => m.patientId === patientId);
    if (!found) {
      throw new Error(`No message for patient ${patientId}`);
    }
    return found;
  }

  getReply(patientId: string): Reply {
    if (reply.patientId !== patientId) {
      throw new Error(`No reply for patient ${patientId}`);
    }
    return reply;
  }

  getBooking(patientId: string): Booking {
    if (booking.patientId !== patientId) {
      throw new Error(`No booking for patient ${patientId}`);
    }
    return booking;
  }

  getResults(): ResultsSummary {
    return results;
  }

  getFeaturedPatientId(): string {
    return featuredPatientId;
  }

  getAiReasoning(step: AiStep): AiReasoning {
    return aiReasoning[step];
  }
}

export const scriptedWorkflowProvider: WorkflowProvider =
  new ScriptedWorkflowProvider();
```

- [ ] **Step 4: `src/demos/winBackCampaign/steps.ts`**

```ts
import {
  FaFileImport,
  FaFilter,
  FaPenFancy,
  FaPaperPlane,
  FaInbox,
  FaChartLine,
} from "react-icons/fa";
import type { DemoStep } from "../shared/types";

export const steps: DemoStep[] = [
  { id: "import", label: "Import list", Icon: FaFileImport },
  { id: "segment", label: "Segment", Icon: FaFilter, isAi: true },
  { id: "offer", label: "Craft offer", Icon: FaPenFancy, isAi: true },
  { id: "send", label: "Send", Icon: FaPaperPlane },
  { id: "replies", label: "Replies & bookings", Icon: FaInbox },
  { id: "results", label: "Results", Icon: FaChartLine },
];
```

- [ ] **Step 5: Build**

Run: `npm run build`
Expected: succeeds (files compile; unused until Task 6).

- [ ] **Step 6: Commit (surface command to Brian)**

```bash
git add src/demos/winBackCampaign/types.ts src/demos/winBackCampaign/script.ts src/demos/winBackCampaign/provider.ts src/demos/winBackCampaign/steps.ts
git commit -m "feat: add win-back demo data layer"
```

---

## Task 6: Win-Back demo — step components + wiring

**Files:**
- Create: `src/demos/winBackCampaign/winback.css`
- Create: `src/demos/winBackCampaign/steps/ImportListStep.tsx`, `SegmentStep.tsx`, `CraftOfferStep.tsx`, `SendStep.tsx`, `RepliesStep.tsx`, `ResultsStep.tsx`
- Create: `src/demos/winBackCampaign/WinBackDemo.tsx`

**Interfaces:**
- Consumes: shared engine (Tasks 1–3), Win-Back data layer (Task 5).
- Produces: default export `WinBackDemo` (consumed by Task 7).

All step components take `{ provider }: { provider: WorkflowProvider }` and use `wb-` CSS classes defined in `winback.css`. `winback.css` is imported once by `WinBackDemo.tsx`.

- [ ] **Step 1: `src/demos/winBackCampaign/steps/ImportListStep.tsx`**

```tsx
import { FaDatabase } from "react-icons/fa";
import type { WorkflowProvider } from "../types";

const ImportListStep = ({ provider }: { provider: WorkflowProvider }) => {
  const practice = provider.getPractice();
  const patients = provider.getPatients();
  return (
    <div className="wb-step">
      <h3 className="wb-heading">Import the past-patient list</h3>
      <p className="wb-sub">
        Pull {practice.name}'s patient history straight from{" "}
        {practice.listSource} — no manual export gymnastics.
      </p>

      <div className="wb-source">
        <FaDatabase className="wb-source-icon" />
        <div>
          <p className="wb-source-name">{practice.listSource}</p>
          <p className="wb-source-meta">
            {practice.listSize.toLocaleString()} patient records · target:{" "}
            {practice.winBackWindow.toLowerCase()}
          </p>
        </div>
      </div>

      <table className="wb-table">
        <thead>
          <tr>
            <th>Patient</th>
            <th>Last visit</th>
            <th>Last service</th>
            <th>Contact</th>
          </tr>
        </thead>
        <tbody>
          {patients.map((p) => (
            <tr key={p.id}>
              <td>{p.name}</td>
              <td>{p.lastVisitLabel}</td>
              <td>{p.lastService}</td>
              <td className="wb-mono">{p.contact}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="wb-note">Showing 4 of {practice.listSize.toLocaleString()} records.</p>
    </div>
  );
};

export default ImportListStep;
```

- [ ] **Step 2: `src/demos/winBackCampaign/steps/SegmentStep.tsx`**

```tsx
import { useState } from "react";
import { FaUserSlash } from "react-icons/fa";
import type { WorkflowProvider } from "../types";
import { usePrefersReducedMotion } from "../../shared/usePrefersReducedMotion";
import AiPanel from "../../shared/AiPanel";

const SegmentStep = ({ provider }: { provider: WorkflowProvider }) => {
  const segments = provider.getSegments();
  const dropped = provider.getDroppedSummary();
  const reasoning = provider.getAiReasoning("segment");
  const reduced = usePrefersReducedMotion();
  const [revealed, setRevealed] = useState(reduced);

  return (
    <div className="wb-step">
      <h3 className="wb-heading">Find the winnable patients</h3>
      <p className="wb-sub">
        Claude reads the full list, groups the lapsed patients worth
        re-engaging, and sets aside the rest.
      </p>

      <AiPanel
        title={reasoning.title}
        lines={reasoning.lines}
        onComplete={() => setRevealed(true)}
      />

      <div className={"wb-reveal" + (revealed ? " is-shown" : "")}>
        <div className="wb-segments">
          {segments.map((s) => (
            <div key={s.id} className="wb-segment">
              <p className="wb-segment-count">{s.count.toLocaleString()}</p>
              <p className="wb-segment-label">{s.label}</p>
              <p className="wb-segment-crit">{s.criteria}</p>
            </div>
          ))}
        </div>

        <div className="wb-dropped">
          <FaUserSlash className="wb-dropped-icon" />
          <div>
            <p className="wb-dropped-count">
              {dropped.dropped.toLocaleString()} set aside
            </p>
            <ul className="wb-dropped-reasons">
              {dropped.reasons.map((r) => (
                <li key={r}>{r}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SegmentStep;
```

- [ ] **Step 3: `src/demos/winBackCampaign/steps/CraftOfferStep.tsx`**

```tsx
import { useState } from "react";
import { FaTag, FaCommentDots } from "react-icons/fa";
import type { WorkflowProvider } from "../types";
import { usePrefersReducedMotion } from "../../shared/usePrefersReducedMotion";
import AiPanel from "../../shared/AiPanel";

const CraftOfferStep = ({ provider }: { provider: WorkflowProvider }) => {
  const offer = provider.getOffer();
  const featuredId = provider.getFeaturedPatientId();
  const message = provider.getMessage(featuredId);
  const reasoning = provider.getAiReasoning("offer");
  const reduced = usePrefersReducedMotion();
  const [revealed, setRevealed] = useState(reduced);

  return (
    <div className="wb-step">
      <h3 className="wb-heading">Craft the offer &amp; the message</h3>
      <p className="wb-sub">
        Claude picks an offer worth booking and writes short, compliant copy —
        personalized per patient.
      </p>

      <AiPanel
        title={reasoning.title}
        lines={reasoning.lines}
        onComplete={() => setRevealed(true)}
      />

      <div className={"wb-reveal" + (revealed ? " is-shown" : "")}>
        <div className="wb-offer">
          <FaTag className="wb-offer-icon" />
          <div>
            <p className="wb-offer-headline">{offer.headline}</p>
            <p className="wb-offer-detail">{offer.detail}</p>
            <p className="wb-offer-channel">Channel: {offer.channel}</p>
          </div>
        </div>

        <div className="wb-message">
          <div className="wb-message-head">
            <FaCommentDots />
            <span>Drafted {message.channel} — featured patient</span>
          </div>
          <p className="wb-message-body">{message.body}</p>
        </div>
      </div>
    </div>
  );
};

export default CraftOfferStep;
```

- [ ] **Step 4: `src/demos/winBackCampaign/steps/SendStep.tsx`**

```tsx
import { useEffect, useRef } from "react";
import { FaPaperPlane, FaCheck, FaEnvelopeOpen, FaInbox } from "react-icons/fa";
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

const SendStep = ({ provider }: { provider: WorkflowProvider }) => {
  const patientId = provider.getFeaturedPatientId();
  const message = provider.getMessage(patientId);
  const results = provider.getResults();
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
    { id: "opened", label: "Opened", icon: <FaEnvelopeOpen /> },
  ];

  return (
    <div className="wb-step">
      <h3 className="wb-heading">Send the campaign</h3>
      <p className="wb-sub">
        {results.contacted.toLocaleString()} messages go out. Here's the
        featured patient's message moving through the lifecycle.
      </p>

      <div className="wb-outbox">
        <div className="wb-envelope">
          <FaInbox className="wb-envelope-icon" />
          <p className="wb-envelope-body">{message.body}</p>
        </div>

        <ol className="wb-stages">
          {stages.map((stage, i) => (
            <li
              key={stage.id}
              className={
                "wb-stage" +
                (rank >= i ? " is-active" : "") +
                (rank > i ? " is-done" : "")
              }
            >
              <span className="wb-stage-icon">{stage.icon}</span>
              <span className="wb-stage-label">{stage.label}</span>
            </li>
          ))}
        </ol>

        {status === "opened" && (
          <p className="wb-done-note">
            Opened — when a lapsed patient engages, that's your booking signal.
            Continue to see what comes back.
          </p>
        )}
      </div>
    </div>
  );
};

export default SendStep;
```

- [ ] **Step 5: `src/demos/winBackCampaign/steps/RepliesStep.tsx`**

```tsx
import { useEffect, useRef, useState } from "react";
import { FaReply, FaCalendarCheck } from "react-icons/fa";
import type { WorkflowProvider } from "../types";
import { useSendLifecycle } from "../../shared/SendLifecycleProvider";
import { usePrefersReducedMotion } from "../../shared/usePrefersReducedMotion";

const REPLY_DELAY_MS = 700;

const RepliesStep = ({ provider }: { provider: WorkflowProvider }) => {
  const patientId = provider.getFeaturedPatientId();
  const reply = provider.getReply(patientId);
  const booking = provider.getBooking(patientId);
  const { markReplied } = useSendLifecycle();
  const reduced = usePrefersReducedMotion();
  const [shown, setShown] = useState(reduced);
  const timer = useRef<number | null>(null);

  useEffect(() => {
    if (reduced) {
      setShown(true);
      markReplied();
      return;
    }
    timer.current = window.setTimeout(() => {
      setShown(true);
      markReplied();
    }, REPLY_DELAY_MS);
    return () => {
      if (timer.current !== null) window.clearTimeout(timer.current);
    };
  }, [reduced, markReplied]);

  return (
    <div className="wb-step">
      <h3 className="wb-heading">A patient replies — and books</h3>
      <p className="wb-sub">{reply.receivedLabel}, {reply.fromName} texts back.</p>

      <div className={"wb-reply-card" + (shown ? " is-shown" : "")}>
        <div className="wb-reply-head">
          <FaReply className="wb-reply-icon" />
          <div>
            <p className="wb-reply-from">{reply.fromName}</p>
            <p className="wb-reply-channel">{reply.channel}</p>
          </div>
        </div>
        <p className="wb-reply-body">{reply.body}</p>
      </div>

      <div className={"wb-booking" + (shown ? " is-shown" : "")}>
        <FaCalendarCheck className="wb-booking-icon" />
        <div>
          <p className="wb-booking-title">Booked — {booking.service}</p>
          <p className="wb-booking-meta">
            {booking.when} · {booking.value}
          </p>
        </div>
      </div>
    </div>
  );
};

export default RepliesStep;
```

- [ ] **Step 6: `src/demos/winBackCampaign/steps/ResultsStep.tsx`**

```tsx
import type { WorkflowProvider } from "../types";

const ResultsStep = ({ provider }: { provider: WorkflowProvider }) => {
  const results = provider.getResults();
  const tally = [
    { num: results.contacted.toLocaleString(), label: "Contacted" },
    { num: results.delivered.toLocaleString(), label: "Delivered" },
    { num: results.replied.toLocaleString(), label: "Replied" },
    { num: results.booked.toLocaleString(), label: "Booked", hl: true },
  ];

  return (
    <div className="wb-step">
      <h3 className="wb-heading">Campaign results</h3>
      <p className="wb-sub">One run, off a list the practice already owned.</p>

      <div className="wb-tally">
        {tally.map((t) => (
          <div
            key={t.label}
            className={"wb-tally-item" + (t.hl ? " wb-tally-item-hl" : "")}
          >
            <span className="wb-tally-num">{t.num}</span>
            <span className="wb-tally-label">{t.label}</span>
          </div>
        ))}
      </div>

      <p className="wb-revenue">{results.revenueRecovered}</p>
      <p className="wb-takeaway">{results.takeaway}</p>
    </div>
  );
};

export default ResultsStep;
```

- [ ] **Step 7: `src/demos/winBackCampaign/winback.css`**

```css
.wb-step {
  color: var(--demo-text);
}

.wb-heading {
  font-size: 1.15rem;
  margin: 0 0 var(--spacing-xs);
}

.wb-sub {
  color: var(--demo-muted);
  margin: 0 0 var(--spacing-md);
  max-width: 60ch;
}

.wb-mono {
  font-family: ui-monospace, "SF Mono", Menlo, Consolas, monospace;
  font-size: 0.85em;
}

.wb-note {
  color: var(--demo-muted);
  font-size: 0.8rem;
  margin-top: var(--spacing-sm);
}

/* Import */
.wb-source {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-sm) var(--spacing-md);
  background: var(--demo-surface-2);
  border: 1px solid var(--demo-border);
  border-radius: 0.6rem;
  margin-bottom: var(--spacing-md);
}
.wb-source-icon {
  font-size: 1.4rem;
  color: var(--demo-accent-bright);
}
.wb-source-name {
  font-weight: 600;
  margin: 0;
}
.wb-source-meta {
  color: var(--demo-muted);
  font-size: 0.85rem;
  margin: 0;
}

.wb-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.9rem;
}
.wb-table th,
.wb-table td {
  text-align: left;
  padding: 0.6rem 0.75rem;
  border-bottom: 1px solid var(--demo-border);
}
.wb-table th {
  color: var(--demo-muted);
  font-weight: 600;
  font-size: 0.78rem;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

/* Reveal wrapper (segments/offer after AI completes) */
.wb-reveal {
  opacity: 0;
  transform: translateY(6px);
  transition: opacity 0.4s ease, transform 0.4s ease;
  margin-top: var(--spacing-md);
}
.wb-reveal.is-shown {
  opacity: 1;
  transform: none;
}

/* Segments */
.wb-segments {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: var(--spacing-sm);
}
.wb-segment {
  padding: var(--spacing-md);
  background: var(--demo-surface-2);
  border: 1px solid var(--demo-border);
  border-left: 3px solid var(--demo-accent-bright);
  border-radius: 0.6rem;
}
.wb-segment-count {
  font-size: 1.6rem;
  font-weight: 700;
  color: var(--demo-accent-bright);
  margin: 0;
}
.wb-segment-label {
  font-weight: 600;
  margin: 0.15rem 0;
}
.wb-segment-crit {
  color: var(--demo-muted);
  font-size: 0.85rem;
  margin: 0;
}

.wb-dropped {
  display: flex;
  gap: var(--spacing-sm);
  align-items: flex-start;
  margin-top: var(--spacing-md);
  padding: var(--spacing-sm) var(--spacing-md);
  border: 1px dashed var(--demo-border);
  border-radius: 0.6rem;
}
.wb-dropped-icon {
  color: var(--demo-muted);
  font-size: 1.2rem;
  margin-top: 0.2rem;
}
.wb-dropped-count {
  font-weight: 600;
  margin: 0 0 0.25rem;
}
.wb-dropped-reasons {
  margin: 0;
  padding-left: 1.1rem;
  color: var(--demo-muted);
  font-size: 0.85rem;
}

/* Offer + message */
.wb-offer {
  display: flex;
  gap: var(--spacing-sm);
  align-items: flex-start;
  padding: var(--spacing-md);
  background: var(--demo-surface-2);
  border: 1px solid var(--demo-border);
  border-radius: 0.6rem;
  margin-bottom: var(--spacing-sm);
}
.wb-offer-icon {
  color: var(--demo-accent-bright);
  font-size: 1.3rem;
  margin-top: 0.15rem;
}
.wb-offer-headline {
  font-weight: 700;
  font-size: 1.05rem;
  margin: 0;
}
.wb-offer-detail {
  color: var(--demo-muted);
  margin: 0.25rem 0;
}
.wb-offer-channel {
  color: var(--demo-muted);
  font-size: 0.85rem;
  margin: 0;
}

.wb-message {
  border: 1px solid var(--demo-border);
  border-radius: 0.6rem;
  overflow: hidden;
}
.wb-message-head {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  padding: 0.6rem 0.9rem;
  background: var(--demo-surface-2);
  color: var(--demo-muted);
  font-size: 0.85rem;
}
.wb-message-body {
  padding: var(--spacing-md);
  margin: 0;
  line-height: 1.6;
}

/* Send */
.wb-outbox {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}
.wb-envelope {
  display: flex;
  gap: var(--spacing-sm);
  align-items: flex-start;
  padding: var(--spacing-md);
  background: var(--demo-surface-2);
  border: 1px solid var(--demo-border);
  border-radius: 0.6rem;
}
.wb-envelope-icon {
  color: var(--demo-accent-bright);
  font-size: 1.2rem;
  margin-top: 0.15rem;
}
.wb-envelope-body {
  margin: 0;
  line-height: 1.6;
}
.wb-stages {
  list-style: none;
  display: flex;
  gap: var(--spacing-sm);
  padding: 0;
  margin: 0;
}
.wb-stage {
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
.wb-stage.is-active {
  opacity: 1;
  color: var(--demo-text);
  border-color: var(--demo-accent-bright);
}
.wb-stage.is-done {
  color: var(--demo-accent-bright);
}
.wb-stage-icon {
  font-size: 1.2rem;
}
.wb-stage-label {
  font-size: 0.8rem;
}
.wb-done-note {
  color: var(--demo-muted);
  font-size: 0.9rem;
  margin: 0;
}

/* Replies + booking */
.wb-reply-card,
.wb-booking {
  opacity: 0;
  transform: translateY(6px);
  transition: opacity 0.4s ease, transform 0.4s ease;
}
.wb-reply-card.is-shown,
.wb-booking.is-shown {
  opacity: 1;
  transform: none;
}
.wb-reply-card {
  border: 1px solid var(--demo-border);
  border-radius: 0.6rem;
  overflow: hidden;
  margin-bottom: var(--spacing-md);
}
.wb-reply-head {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  padding: 0.6rem 0.9rem;
  background: var(--demo-surface-2);
}
.wb-reply-icon {
  color: var(--demo-accent-bright);
}
.wb-reply-from {
  font-weight: 600;
  margin: 0;
}
.wb-reply-channel {
  color: var(--demo-muted);
  font-size: 0.8rem;
  margin: 0;
}
.wb-reply-body {
  padding: var(--spacing-md);
  margin: 0;
  line-height: 1.6;
}
.wb-booking {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-md);
  background: rgba(16, 185, 129, 0.1);
  border: 1px solid var(--demo-success);
  border-radius: 0.6rem;
}
.wb-booking-icon {
  color: var(--demo-success);
  font-size: 1.5rem;
}
.wb-booking-title {
  font-weight: 700;
  margin: 0;
}
.wb-booking-meta {
  color: var(--demo-muted);
  margin: 0;
}

/* Results */
.wb-tally {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: var(--spacing-sm);
  margin-bottom: var(--spacing-md);
}
.wb-tally-item {
  padding: var(--spacing-md);
  text-align: center;
  background: var(--demo-surface-2);
  border: 1px solid var(--demo-border);
  border-radius: 0.6rem;
}
.wb-tally-item-hl {
  border-color: var(--demo-accent-bright);
  box-shadow: 0 0 16px var(--demo-accent-glow);
}
.wb-tally-num {
  display: block;
  font-size: 1.8rem;
  font-weight: 700;
  color: var(--demo-accent-bright);
}
.wb-tally-label {
  color: var(--demo-muted);
  font-size: 0.85rem;
}
.wb-revenue {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--demo-success);
  margin: 0 0 var(--spacing-xs);
}
.wb-takeaway {
  color: var(--demo-muted);
  max-width: 60ch;
  margin: 0;
}

@media (max-width: 600px) {
  .wb-stages {
    flex-direction: column;
  }
  .wb-table {
    display: block;
    overflow-x: auto;
  }
}
```

- [ ] **Step 8: `src/demos/winBackCampaign/WinBackDemo.tsx`**

```tsx
import type { ReactNode } from "react";
import { DemoProvider } from "../shared/DemoController";
import { SendLifecycleProvider } from "../shared/SendLifecycleProvider";
import DemoShell from "../shared/DemoShell";
import { steps } from "./steps";
import { scriptedWorkflowProvider } from "./provider";
import ImportListStep from "./steps/ImportListStep";
import SegmentStep from "./steps/SegmentStep";
import CraftOfferStep from "./steps/CraftOfferStep";
import SendStep from "./steps/SendStep";
import RepliesStep from "./steps/RepliesStep";
import ResultsStep from "./steps/ResultsStep";
import "./winback.css";

const provider = scriptedWorkflowProvider;

function renderStage(stepId: string): ReactNode {
  switch (stepId) {
    case "import":
      return <ImportListStep provider={provider} />;
    case "segment":
      return <SegmentStep provider={provider} />;
    case "offer":
      return <CraftOfferStep provider={provider} />;
    case "send":
      return <SendStep provider={provider} />;
    case "replies":
      return <RepliesStep provider={provider} />;
    case "results":
      return <ResultsStep provider={provider} />;
    default:
      return null;
  }
}

const WinBackDemo = () => {
  const practice = provider.getPractice();
  return (
    <DemoProvider steps={steps}>
      <SendLifecycleProvider>
        <DemoShell
          eyebrow="Paradigm Shift — Automation Demo"
          title={`Win-back campaign for ${practice.name}`}
          lede="A click-through of how the automation wakes up a practice's lapsed patients — import, segment, offer, send, and book — end to end."
          renderStage={renderStage}
        />
      </SendLifecycleProvider>
    </DemoProvider>
  );
};

export default WinBackDemo;
```

- [ ] **Step 9: Build + lint**

Run: `npm run build` then `npm run lint`
Expected: both pass, zero warnings. (Confirm no unused imports — e.g. `ImportListStep` imports only `FaDatabase` + `WorkflowProvider`.)

- [ ] **Step 10: Commit (surface command to Brian)**

```bash
git add src/demos/winBackCampaign/winback.css src/demos/winBackCampaign/WinBackDemo.tsx src/demos/winBackCampaign/steps
git commit -m "feat: add win-back campaign demo steps + wiring"
```

---

## Task 7: Route + link the example card

**Files:**
- Modify: `src/App.tsx`
- Modify: `src/components/AutomatedWorkflows.tsx`

**Interfaces:**
- Consumes: `WinBackDemo` (Task 6).

- [ ] **Step 1: Add the route in `src/App.tsx`**

Add the import and a full-bleed route (a sibling of the existing commercial-cleaning route, **outside** the `Layout` route):

```tsx
import WinBackDemo from "./demos/winBackCampaign/WinBackDemo";
```

and, next to the existing `<Route path="/demos/commercial-cleaning" ... />`:

```tsx
<Route path="/demos/win-back-campaign" element={<WinBackDemo />} />
```

- [ ] **Step 2: Make the "Win-Back Campaigns" example card a link in `src/components/AutomatedWorkflows.tsx`**

Add `import { Link } from "react-router-dom";` at the top. Give the `Example` interface an optional route and set it on the first example:

```tsx
interface Example {
  icon: IconType;
  title: string;
  description: string;
  to?: string;
}
```

In the `examples` array, add `to: "/demos/win-back-campaign"` to the `Win-Back Campaigns` entry only (leave the other eight without `to`).

Then render each example as a `Link` when it has `to`, otherwise the current `div`. Replace the examples `.map(...)` body with:

```tsx
{examples.map((example) => {
  const Icon = example.icon;
  const inner = (
    <>
      <div className="aw-example-icon">
        <Icon />
      </div>
      <h3 className="aw-example-title">{example.title}</h3>
      <p className="aw-example-description">{example.description}</p>
    </>
  );
  return example.to ? (
    <Link key={example.title} to={example.to} className="aw-example-card aw-example-card-link">
      {inner}
    </Link>
  ) : (
    <div key={example.title} className="aw-example-card">
      {inner}
    </div>
  );
})}
```

- [ ] **Step 3: Add a subtle "has demo" affordance in `src/components/AutomatedWorkflows.css`**

Append:

```css
.aw-example-card-link {
  cursor: pointer;
}

.aw-example-card-link::after {
  content: "Try the demo →";
  display: block;
  margin-top: var(--spacing-sm);
  color: var(--color-primary);
  font-weight: 600;
  font-size: 0.9rem;
}
```

- [ ] **Step 4: Lint + build**

Run: `npm run lint` then `npm run build`
Expected: both pass, zero warnings.

- [ ] **Step 5: Manual smoke test**

Run: `npm run dev` and verify:
- `/demos/win-back-campaign` renders full-bleed (no site header/footer), dark, with the six-step flow map (AI lane over Segment + Craft offer), the header title "Win-back campaign for Riverbend Family Dental", and the Calendly CTA.
- Walk all six steps: Import table → Segment (AI panel then segments/dropped reveal) → Craft offer (AI panel then offer + message) → Send (animated sending→delivered→opened) → Replies (reply + booking reveal) → Results (tally + revenue). Back/Next/Restart and flow-node clicks work; Restart resets the send animation.
- On `/services/automated-workflows`, the "Win-Back Campaigns" card shows "Try the demo →" and navigates to the demo; the other eight cards are unchanged (no link affordance).
- `/demos/commercial-cleaning` still works (regression check).

- [ ] **Step 6: Commit (surface command to Brian)**

```bash
git add src/App.tsx src/components/AutomatedWorkflows.tsx src/components/AutomatedWorkflows.css
git commit -m "feat: route win-back demo and link it from automated workflows"
```

---

## Self-Review

**Spec coverage:**
- Shared engine (steps-config, controller, send lifecycle, FlowMap/FlowAiLane, AiPanel, DemoShell, reduced-motion, CSS) → Tasks 1–3.
- Send lifecycle lifted so status persists across Send→Results, resets on restart → Task 1 (`SendLifecycleProvider` + `resetNonce`).
- Commercial cleaning refactored, behavior-preserving, generic files deleted → Task 4.
- Win-Back demo (dental persona, 6 steps, `WorkflowProvider` data) → Tasks 5–6.
- Full-bleed route + example-card link → Task 7.
- Constraints (full-bleed, Calendly verbatim, react-icons, build+lint+smoke, git read-only, demo palette unchanged) → Global Constraints + per-task steps.

**Placeholder scan:** No TBD/TODO — every step contains complete file contents or exact edits. Verbatim-copy steps (usePrefersReducedMotion, AiPanel, the three CSS files, DemoShell.css) name the exact source file and say "no changes," which is deterministic, not a placeholder.

**Type consistency:** `DemoStep` (Task 1) is consumed identically in every `steps.ts` (Tasks 4, 5) and by FlowMap/DemoShell. `SendStatus`/`useSendLifecycle` defined in Task 1 and consumed in CC Send/Results (Task 4) and Win-Back Send/Replies (Task 6). The Win-Back `WorkflowProvider` methods defined in Task 5 (`getPractice`, `getPatients`, `getSegments`, `getDroppedSummary`, `getOffer`, `getMessage`, `getReply`, `getBooking`, `getResults`, `getFeaturedPatientId`, `getAiReasoning`) match every call site in Task 6's step components. `renderStage(stepId: string)` signature matches `DemoShell`'s prop type in both demos.
