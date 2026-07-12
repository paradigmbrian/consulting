# Demo App-Shell Layout Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Restructure the shared demo shell into a viewport-locked two-pane app layout (top bar + vertical step rail + internally-scrolling content pane + footer nav) so the workflow map and active step fit on one screen without page scrolling.

**Architecture:** All changes are in the shared engine (`src/demos/shared/`). `DemoShell` becomes a `100vh` flex frame; `FlowMap` is rewritten from a horizontal track into a vertical rail; the animated `FlowAiLane` overlay is deleted and its Claude attribution replaced by a per-row `✨` mark plus a persistent top-bar chip. The `useDemo` API and `DemoStep` shape are untouched, so both demos adopt the new layout with no per-demo edits.

**Tech Stack:** React 18 + TypeScript, Vite 5, vanilla CSS with custom properties, react-icons.

## Global Constraints

- **No test runner exists** in this project. Verification per task = `npm run lint` (zero warnings tolerated) → `npm run build` (tsc + Vite) → manual browser check at `npm run dev`. There is no `npm test`.
- **Git is user-run only.** Per project policy, do NOT execute git write operations. Each task's final step lists the exact commit command(s) to hand to Brian to run himself.
- **CSS variables:** reuse the demo palette already defined at the top of `DemoShell.css` (`--demo-bg`, `--demo-surface`, `--demo-surface-2`, `--demo-border`, `--demo-accent`, `--demo-accent-bright`, `--demo-accent-glow`, `--demo-accent-deep`, `--demo-success`, `--demo-edge`, `--demo-edge-active`, `--demo-muted`, `--demo-text`) and global spacing tokens (`--spacing-xs: .5rem`, `--spacing-sm: 1rem`, `--spacing-md: 2rem`).
- **Breakpoint:** 968px is the two-pane ↔ stacked boundary.
- **Accessibility:** all motion gated behind `@media (prefers-reduced-motion: reduce)`; rail stays `<nav aria-label="Workflow steps">` with `aria-current="step"` on the active row.
- **Do not modify** `DemoController.tsx`, `types.ts`, any step component, or the two demo entry files (`WinBackDemo.tsx`, `DemoPage.tsx`). The `DemoShell` prop signature (`eyebrow`, `title`, `lede`, `renderStage`) stays intact even though `lede` is no longer rendered.

---

## File Structure

| File | Responsibility after change |
|---|---|
| `src/demos/shared/FlowMap.tsx` | Renders the vertical step rail (buttons wired to `goTo`, done/active/upcoming states, per-row `✨` for AI steps, `scrollIntoView` on active). No `FlowAiLane`. |
| `src/demos/shared/FlowMap.css` | Vertical rail styling (spine line, badges, states) + horizontal strip fallback < 968px. |
| `src/demos/shared/DemoShell.tsx` | App-frame composition: top bar (eyebrow/title/step-count/chip/CTA), body (rail + content pane), footer (nav). |
| `src/demos/shared/DemoShell.css` | `100vh` flex frame, three bands, content-pane internal scroll, responsive unlock < 968px. |
| `src/demos/shared/FlowAiLane.tsx` | **Deleted.** |
| `src/demos/shared/FlowAiLane.css` | **Deleted.** |

---

## Task 1: Vertical rail FlowMap (+ remove FlowAiLane)

**Files:**
- Modify (rewrite): `src/demos/shared/FlowMap.tsx`
- Modify (rewrite): `src/demos/shared/FlowMap.css`
- Delete: `src/demos/shared/FlowAiLane.tsx`
- Delete: `src/demos/shared/FlowAiLane.css`

**Interfaces:**
- Consumes: `useDemo()` → `{ steps, stepIndex, goTo }`; each `step` has `{ id: string; label: string; Icon: IconType; isAi?: boolean }` (from `types.ts`, unchanged). `usePrefersReducedMotion(): boolean`.
- Produces: `FlowMap` default export (no props) — rendered by `DemoShell` in Task 2. Its root is `<nav className="flow-map">`, which Task 2's CSS sizes as the left rail via `flex: 0 0 240px` (set here in `FlowMap.css`).

**Note on intermediate state:** After this task the new vertical rail renders inside the *old* (still-stacked) `DemoShell`. It will look out of place (a vertical rail mid-page) but must compile, lint, and render without errors. The shell is fixed in Task 2.

- [ ] **Step 1: Rewrite `FlowMap.tsx`**

Replace the entire file with:

```tsx
import { useEffect, useRef } from "react";
import { FaCheck, FaMagic } from "react-icons/fa";
import { useDemo } from "./DemoController";
import { usePrefersReducedMotion } from "./usePrefersReducedMotion";
import "./FlowMap.css";

const FlowMap = () => {
  const { steps, stepIndex, goTo } = useDemo();
  const reduced = usePrefersReducedMotion();
  const activeRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    activeRef.current?.scrollIntoView({
      block: "nearest",
      inline: "nearest",
      behavior: reduced ? "auto" : "smooth",
    });
  }, [stepIndex, reduced]);

  return (
    <nav className="flow-map" aria-label="Workflow steps">
      <ol className="flow-track">
        {steps.map((step, i) => {
          const status =
            i < stepIndex ? "done" : i === stepIndex ? "active" : "upcoming";
          const Icon = step.Icon;
          return (
            <li key={step.id} className="flow-item">
              <button
                type="button"
                ref={i === stepIndex ? activeRef : undefined}
                className={`flow-node flow-node-${status}`}
                onClick={() => goTo(i)}
                aria-current={i === stepIndex ? "step" : undefined}
                aria-label={`Step ${i + 1}: ${step.label}`}
              >
                <span className="flow-node-badge">
                  {i < stepIndex ? <FaCheck /> : <Icon />}
                </span>
                <span className="flow-node-label">{step.label}</span>
                {step.isAi && (
                  <span className="flow-node-ai-mark" aria-label="AI-powered">
                    <FaMagic />
                  </span>
                )}
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

- [ ] **Step 2: Rewrite `FlowMap.css`**

Replace the entire file with:

```css
.flow-map {
  flex: 0 0 240px;
  min-height: 0;
  overflow-y: auto;
  padding-right: var(--spacing-xs);
}

.flow-track {
  display: flex;
  flex-direction: column;
  list-style: none;
}

/* Spine line runs behind the badges; badges are opaque and punch through it. */
.flow-item {
  position: relative;
}

.flow-item::before {
  content: "";
  position: absolute;
  left: 29px; /* node padding-left (12px) + badge radius (18px) − line half; nudge if misaligned */
  top: 0;
  bottom: 0;
  width: 2px;
  background: var(--demo-edge);
  z-index: 0;
}

.flow-item:first-child::before {
  top: 50%;
}

.flow-item:last-child::before {
  bottom: 50%;
}

/* Fill the spine up to and including the active node. */
.flow-item:has(.flow-node-done)::before,
.flow-item:has(.flow-node-active)::before {
  background: var(--demo-accent);
}

/* Nodes */
.flow-node {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  width: 100%;
  padding: 8px 12px;
  margin: 3px 0;
  background: transparent;
  border: 1px solid transparent;
  border-radius: 0.6rem;
  color: var(--demo-text);
  text-align: left;
  cursor: pointer;
  transition: border-color 0.2s ease, box-shadow 0.2s ease, opacity 0.2s ease;
}

.flow-node:hover {
  border-color: var(--demo-accent-bright);
}

.flow-node-badge {
  flex: 0 0 auto;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: var(--demo-surface-2);
  color: var(--demo-accent-bright);
  font-size: 1rem;
}

.flow-node-label {
  font-size: 0.85rem;
  font-weight: 600;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.flow-node-ai-mark {
  margin-left: auto;
  display: inline-flex;
  align-items: center;
  color: var(--demo-accent-bright);
  font-size: 0.7rem;
}

.flow-node-upcoming {
  opacity: 0.55;
}

.flow-node-done .flow-node-badge {
  background: var(--demo-success);
  color: #fff;
}

.flow-node-active {
  border-color: var(--demo-accent-bright);
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

/* Stacked / horizontal fallback */
@media (max-width: 968px) {
  .flow-map {
    flex: 0 0 auto;
    overflow-x: auto;
    overflow-y: visible;
    padding-right: 0;
    padding-bottom: var(--spacing-xs);
  }

  .flow-track {
    flex-direction: row;
    align-items: flex-start;
  }

  .flow-item::before {
    left: 0;
    right: 0;
    top: 26px; /* badge center in the column-layout node; nudge if misaligned */
    bottom: auto;
    width: auto;
    height: 2px;
  }

  .flow-item:first-child::before {
    top: 26px;
    left: 50%;
    bottom: auto;
  }

  .flow-item:last-child::before {
    right: 50%;
    bottom: auto;
  }

  .flow-node {
    flex-direction: column;
    align-items: center;
    gap: var(--spacing-xs);
    min-width: 88px;
    padding: var(--spacing-xs) var(--spacing-sm);
    text-align: center;
  }

  .flow-node-label {
    font-size: 0.72rem;
  }

  .flow-node-ai-mark {
    position: absolute;
    top: -4px;
    right: -4px;
    margin-left: 0;
    width: 18px;
    height: 18px;
    justify-content: center;
    border-radius: 50%;
    background: var(--demo-accent-bright);
    color: var(--demo-bg);
    font-size: 0.6rem;
    box-shadow: 0 0 8px var(--demo-accent-glow);
  }
}

@media (prefers-reduced-motion: reduce) {
  .flow-node-active {
    animation: none;
  }
}
```

- [ ] **Step 3: Delete the FlowAiLane files**

```bash
rm src/demos/shared/FlowAiLane.tsx src/demos/shared/FlowAiLane.css
```

- [ ] **Step 4: Lint**

Run: `npm run lint`
Expected: passes with zero warnings. (If it flags an unused import in `FlowMap.tsx`, remove that import — the file above imports only what it uses: `useEffect`, `useRef`, `FaCheck`, `FaMagic`, `useDemo`, `usePrefersReducedMotion`.)

- [ ] **Step 5: Build**

Run: `npm run build`
Expected: TypeScript check + Vite build succeed. Confirms nothing still imports the deleted `FlowAiLane` (only `FlowMap.tsx` referenced it — now removed).

- [ ] **Step 6: Commit (hand command to Brian)**

```bash
git add src/demos/shared/FlowMap.tsx src/demos/shared/FlowMap.css
git rm src/demos/shared/FlowAiLane.tsx src/demos/shared/FlowAiLane.css
git commit -m "refactor: convert demo FlowMap to vertical rail; drop FlowAiLane

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_016a6SViD6C9zbzZASRF5nV2"
```

---

## Task 2: DemoShell app frame

**Files:**
- Modify (rewrite): `src/demos/shared/DemoShell.tsx`
- Modify (rewrite): `src/demos/shared/DemoShell.css`

**Interfaces:**
- Consumes: `FlowMap` default export from Task 1 (rendered as the left rail). `useDemo()` → `{ stepId, steps, stepIndex, back, next, reset, canBack, canNext }`. `DemoStep.Icon`, `DemoStep.label`.
- Produces: `DemoShell` default export with unchanged props `{ eyebrow: string; title: string; lede: string; renderStage: (stepId: string) => ReactNode }`. `lede` remains in the interface (callers still pass it) but is intentionally not destructured/rendered.

- [ ] **Step 1: Rewrite `DemoShell.tsx`**

Replace the entire file with:

```tsx
import { FaCalendarAlt, FaMagic } from "react-icons/fa";
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

const DemoShell = ({ eyebrow, title, renderStage }: DemoShellProps) => {
  const { stepId, steps, stepIndex } = useDemo();
  return (
    <main className="demo">
      <header className="demo-topbar">
        <div className="demo-topbar-heading">
          <p className="demo-eyebrow">{eyebrow}</p>
          <h1 className="demo-title">{title}</h1>
        </div>
        <span className="demo-stage-count">
          Step {stepIndex + 1} of {steps.length}
        </span>
        <div className="demo-topbar-actions">
          <span className="demo-ai-chip">
            <FaMagic aria-hidden="true" /> Powered by Claude
          </span>
          <a
            href={CALENDLY_URL}
            className="demo-cta"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaCalendarAlt className="demo-cta-icon" />
            Book a call
          </a>
        </div>
      </header>

      <div className="demo-body">
        <FlowMap />
        <section className="demo-content">
          <StageHeader />
          <div className="demo-stage">{renderStage(stepId)}</div>
        </section>
      </div>

      <footer className="demo-footer">
        <DemoNav />
      </footer>
    </main>
  );
};

export default DemoShell;
```

- [ ] **Step 2: Rewrite `DemoShell.css`**

Replace the entire file with:

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
  --demo-accent-deep: #1c5d8f;
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

  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow: hidden;
  color: var(--demo-text);
  background-color: var(--demo-bg);
  background-image: radial-gradient(
    circle,
    rgba(255, 255, 255, 0.06) 1px,
    transparent 1px
  );
  background-size: 22px 22px;
}

/* Top bar */
.demo-topbar {
  flex: 0 0 auto;
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  padding: var(--spacing-sm) var(--spacing-md);
  border-bottom: 1px solid var(--demo-border);
  background: var(--demo-surface);
}

.demo-topbar-heading {
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
  min-width: 0;
}

.demo-eyebrow {
  margin: 0;
  font-size: 0.7rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--color-primary);
  font-weight: 600;
}

.demo-title {
  margin: 0;
  font-size: 1.15rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.demo-stage-count {
  font-size: 0.8rem;
  color: var(--demo-muted);
  white-space: nowrap;
}

.demo-topbar-actions {
  margin-left: auto;
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
}

.demo-ai-chip {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.35rem 0.7rem;
  border-radius: 999px;
  background: rgba(90, 169, 230, 0.12);
  border: 1px solid var(--demo-accent);
  color: var(--demo-accent-bright);
  font-size: 0.75rem;
  font-weight: 600;
  white-space: nowrap;
  box-shadow: 0 0 12px var(--demo-accent-glow);
}

.demo-cta {
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-xs);
  background: var(--demo-accent);
  color: #fff;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  font-weight: 600;
  white-space: nowrap;
  box-shadow: 0 4px 16px rgba(90, 169, 230, 0.35);
}

.demo-cta:hover {
  background: var(--demo-accent-deep);
  color: #fff;
  transform: translateY(-1px);
}

.demo-cta-icon {
  font-size: 0.9rem;
}

/* Body: rail + content */
.demo-body {
  flex: 1 1 auto;
  min-height: 0;
  display: flex;
  gap: var(--spacing-md);
  padding: var(--spacing-md);
  overflow: hidden;
}

.demo-content {
  flex: 1 1 auto;
  min-width: 0;
  display: flex;
  flex-direction: column;
  background: var(--demo-surface);
  border: 1px solid var(--demo-border);
  border-radius: 1rem;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.35);
  overflow: hidden;
}

/* Stage header (inside content pane) */
.demo-stage-header {
  flex: 0 0 auto;
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-md);
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

/* Stage body: the only scroll region on desktop */
.demo-stage {
  flex: 1 1 auto;
  min-height: 0;
  overflow-y: auto;
  padding: var(--spacing-md);
}

.demo-stub {
  text-align: center;
  color: var(--color-text-light);
}

/* Footer nav */
.demo-footer {
  flex: 0 0 auto;
  padding: var(--spacing-sm) var(--spacing-md);
  border-top: 1px solid var(--demo-border);
  background: var(--demo-surface);
}

.demo-nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: var(--spacing-sm);
}

.demo-btn {
  padding: 0.6rem 1.25rem;
  border-radius: 0.5rem;
  font-weight: 600;
  font-size: 0.95rem;
}

.demo-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.demo-btn-ghost {
  background: transparent;
  color: var(--color-text);
  border: 1px solid var(--color-border);
}

.demo-btn-ghost:hover:not(:disabled) {
  border-color: var(--color-primary);
  color: var(--color-primary);
}

.demo-btn-primary {
  background: var(--demo-accent);
  color: #fff;
}

.demo-btn-primary:hover:not(:disabled) {
  background: var(--demo-accent-deep);
}

/* Stacked layout: unlock the viewport frame below 968px */
@media (max-width: 968px) {
  .demo {
    height: auto;
    min-height: 100vh;
    overflow: visible;
  }

  .demo-topbar {
    flex-wrap: wrap;
  }

  .demo-body {
    flex-direction: column;
    overflow: visible;
  }

  .demo-content {
    overflow: visible;
  }

  .demo-stage {
    overflow: visible;
  }
}

@media (max-width: 768px) {
  .demo-body {
    padding: var(--spacing-sm);
  }

  .demo-stage,
  .demo-stage-header {
    padding: var(--spacing-md) var(--spacing-sm);
  }

  .demo-nav {
    flex-wrap: wrap;
  }
}
```

- [ ] **Step 3: Lint**

Run: `npm run lint`
Expected: passes with zero warnings. In particular, confirm no "unused variable" error for `lede` — it is not destructured, so it must not be flagged. If lint (or tsc `noUnusedParameters`) complains about the interface, leave the interface as-is; the error would only appear if `lede` were destructured, which it is not.

- [ ] **Step 4: Build**

Run: `npm run build`
Expected: TypeScript check + Vite build succeed.

- [ ] **Step 5: Manual verification (both demos)**

Run: `npm run dev`, then in the browser:
- Visit `http://localhost:5173/demos/win-back-campaign` at a desktop width (≥ 968px):
  - Top bar shows eyebrow + title + "Step 1 of 6" + "✨ Powered by Claude" chip + "Book a call".
  - Left rail shows all steps vertically with a spine line; step 1 is active (glow), later steps dimmed; AI steps show `✨`.
  - The active step's content is fully visible with **no page scroll** (the page itself does not scroll; only the content pane scrolls if a step is tall).
  - Click "Next →" through every step: the rail advances, completed steps show green checks, the spine fills, and the content swaps. Click a rail row to jump.
  - Confirm the spine line passes through the badge centers; if it is visibly off, nudge `left` in `.flow-item::before` (Task 1 `FlowMap.css`) by a few px.
- Visit `http://localhost:5173/demos/commercial-cleaning` and repeat the top checks (it uses the same shell).
- Resize the window below 968px: layout stacks, the rail becomes a horizontal swipe strip on top, and the page scrolls normally.
- Check the "Results" step (tallest content): on desktop it scrolls inside the content pane, not the page.

- [ ] **Step 6: Commit (hand command to Brian)**

```bash
git add src/demos/shared/DemoShell.tsx src/demos/shared/DemoShell.css
git commit -m "feat: restructure demo shell into two-pane app layout

Top bar + vertical step rail + internally-scrolling content pane so the
workflow map and active step fit on one screen without page scroll.

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_016a6SViD6C9zbzZASRF5nV2"
```

---

## Self-Review

**Spec coverage:**
- Two-pane app shell (top bar / rail / content / footer) → Task 2 ✓
- Vertical step rail with spine, done/active/upcoming states, clickable rows, `✨` AI marks → Task 1 ✓
- Content pane as the only internal scroll region → Task 2 (`.demo-stage { overflow-y: auto }` inside `overflow: hidden` frame) ✓
- Top-bar "Powered by Claude" chip + drop `lede` → Task 2 ✓
- Delete `FlowAiLane` + files → Task 1 ✓
- Responsive < 968px stacked + horizontal strip → Task 1 (FlowMap.css media query) + Task 2 (DemoShell.css media query) ✓
- `usePrefersReducedMotion` retained, motion gated → Task 1 ✓
- No changes to controller/types/steps/demo entries → honored (only 4 shared files touched) ✓
- Accessibility (nav label, aria-current, aria-label per step) → Task 1 ✓

**Placeholder scan:** No TBD/TODO. The two "nudge if misaligned" notes are deliberate, bounded manual-tuning instructions tied to a specific property, not open-ended work.

**Type consistency:** Class names align across tasks — `.flow-map` sized by `FlowMap.css` (Task 1) and consumed by `.demo-body` layout (Task 2); `.demo-stage-header`/`.demo-stage-badge`/`.demo-stage-title` used in `DemoShell.tsx` and styled in `DemoShell.css` (both Task 2). `DemoShell` prop signature unchanged, matching the untouched callers. `FlowMap` remains a no-prop default export in both its definition (Task 1) and its usage (Task 2).
