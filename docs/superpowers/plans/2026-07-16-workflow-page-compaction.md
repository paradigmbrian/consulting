# Workflow Service Page Compaction Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the `/services/automated-workflows/:slug` pages more compact — value + CTA + stats/demo above the fold, ~9 sections down to ~6, padding cut by a third — without changing the index page.

**Architecture:** Approach 1 from the design ("tighten & merge in place"). Reuse existing components and order; tighten `wf-*` padding, fold stats + a demo button into the hero, merge pains + mechanism into one two-column band, and render the shared "Why" + "How we'd work" components side by side via a new optional `as="bare"` prop that leaves their default (index-page) rendering untouched.

**Tech Stack:** React 18 + TypeScript, Vite 5, vanilla CSS with custom properties, react-icons, react-router-dom v6.

## Global Constraints

- **No test framework exists.** The verification loop for every task is `npm run lint` (zero warnings tolerated) + `npm run build` (`tsc` typecheck + Vite build) + a visual check in `npm run dev`. There are no unit tests to write.
- **Index page must stay visually identical.** `AwHowItWorks`, `AwWhyWorkWithMe`, `AwFinalCta` are shared with `src/components/AutomatedWorkflows.tsx`. Their default rendering must not change.
- **Git is Brian's to run.** Per the global CLAUDE.md rule, Claude does not execute git write commands. Each task ends with a commit *command to surface to Brian*, not to run.
- **CSS convention:** vanilla CSS with the existing `--spacing-*` / `--color-*` custom properties. No Tailwind, no CSS-in-JS.
- **Spacing scale:** `--spacing-xs` 0.5rem · `--spacing-sm` 1rem · `--spacing-md` 2rem · `--spacing-lg` 4rem · `--spacing-xl` 6rem. Breakpoints at 768px and 968px.

---

### Task 1: Compact the vertical rhythm (workflow-scoped CSS)

Reduce `wf-*` section padding and inner top-margins so the whole page tightens. Pure CSS; every section still renders in the same order, just closer together.

**Files:**
- Modify: `src/components/workflows/WorkflowPage.css`

**Interfaces:**
- Consumes: nothing.
- Produces: tighter `wf-*` rhythm relied on visually by later tasks.

- [ ] **Step 1: Replace `--spacing-xl` section padding with `--spacing-lg` on all `wf-*` sections**

In `src/components/workflows/WorkflowPage.css`, change the padding on each of these rules from `var(--spacing-xl) 0` to `var(--spacing-lg) 0`:
- `.wf-hero` (line ~4)
- `.wf-stats` (line ~53) — *(will be removed in Task 2, but update for consistency now)*
- `.wf-pains` (line ~98) — *(removed in Task 3)*
- `.wf-mechanism` (line ~129) — *(removed in Task 3)*
- `.wf-demo` (line ~178)
- `.wf-faq` (line ~194)

- [ ] **Step 2: Reduce the inner list/grid top margins from `--spacing-lg` to `--spacing-md`**

In the same file, change `margin: var(--spacing-lg) auto 0;` → `margin: var(--spacing-md) auto 0;` on:
- `.wf-stats-grid` (line ~62)
- `.wf-pains-list` (line ~108)
- `.wf-mechanism-list` (line ~139)
- `.wf-faq-list` (line ~203)

- [ ] **Step 3: Verify lint + build**

Run: `npm run lint && npm run build`
Expected: both pass, no warnings.

- [ ] **Step 4: Visual check**

Run: `npm run dev`, open `http://localhost:5173/services/automated-workflows/win-back-campaigns`.
Expected: same content and order, noticeably less whitespace between sections.

- [ ] **Step 5: Commit (surface to Brian)**

```bash
git add src/components/workflows/WorkflowPage.css
git commit -m "style: tighten workflow page vertical rhythm"
```

---

### Task 2: Hero front-loads the stats strip and demo button

Add a "Try the demo →" secondary CTA and a compact stat strip (with the "What it costs to leave this manual" label) to the hero. Remove the standalone `WorkflowStats` section and delete its component.

**Files:**
- Modify: `src/components/workflows/WorkflowHero.tsx`
- Modify: `src/components/workflows/WorkflowPage.tsx`
- Modify: `src/components/workflows/WorkflowPage.css`
- Delete: `src/components/workflows/WorkflowStats.tsx`

**Interfaces:**
- Consumes: `workflowDemoPath(slug)` and `Stat` from `src/data/workflows.ts`; `CALENDLY_URL` from `src/data/site.ts`.
- Produces: `WorkflowHero` now takes `{ headline, subhead, slug, hasDemo, stats }`.

- [ ] **Step 1: Rewrite `WorkflowHero.tsx` with the new props, dual CTA, and stat strip**

Replace the entire file `src/components/workflows/WorkflowHero.tsx` with:

```tsx
import { FaCalendarAlt, FaPlay } from "react-icons/fa";
import { Link } from "react-router-dom";
import { CALENDLY_URL } from "../../data/site";
import { workflowDemoPath, type Stat } from "../../data/workflows";

interface WorkflowHeroProps {
  headline: string;
  subhead: string;
  slug: string;
  hasDemo: boolean;
  stats: Stat[];
}

const WorkflowHero = ({
  headline,
  subhead,
  slug,
  hasDemo,
  stats,
}: WorkflowHeroProps) => {
  return (
    <section className="wf-hero">
      <div className="container">
        <div className="wf-hero-content">
          <h1 className="wf-hero-title">{headline}</h1>
          <p className="wf-hero-subtitle">{subhead}</p>
          <div className="wf-hero-actions">
            <a
              href={CALENDLY_URL}
              className="wf-hero-btn"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaCalendarAlt className="wf-hero-btn-icon" />
              Book a free automation consult →
            </a>
            {hasDemo && (
              <Link to={workflowDemoPath(slug)} className="wf-hero-btn wf-hero-btn-secondary">
                <FaPlay className="wf-hero-btn-icon" />
                Try the demo →
              </Link>
            )}
          </div>
          {stats.length > 0 && (
            <div className="wf-hero-stats">
              <p className="wf-hero-stats-label">
                What it costs to leave this manual
              </p>
              <div className="wf-hero-stats-row">
                {stats.map((stat) => (
                  <a
                    key={stat.label}
                    href={stat.sourceUrl}
                    className="wf-hero-stat"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <span className="wf-hero-stat-value">{stat.value}</span>
                    <span className="wf-hero-stat-label">{stat.label}</span>
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default WorkflowHero;
```

- [ ] **Step 2: Update `WorkflowPage.tsx` — pass new hero props, drop the `WorkflowStats` section**

In `src/components/workflows/WorkflowPage.tsx`:
- Remove the import line `import WorkflowStats from "./WorkflowStats";`.
- Replace the `<WorkflowHero .../>` and `<WorkflowStats .../>` block with:

```tsx
      <WorkflowHero
        headline={workflow.hero.headline}
        subhead={workflow.hero.subhead}
        slug={workflow.slug}
        hasDemo={workflow.hasDemo}
        stats={workflow.stats}
      />
      <WorkflowPains painPoints={workflow.painPoints} />
```

(i.e. the `<WorkflowStats stats={workflow.stats} />` line is deleted; `WorkflowPains` now immediately follows the hero.)

- [ ] **Step 3: Add hero action-row and stat-strip CSS**

In `src/components/workflows/WorkflowPage.css`, inside the `/* 1. Hero */` section (after the `.wf-hero-btn-icon` rule, before `/* 2. Stats */`), add:

```css
.wf-hero-actions {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-sm);
  justify-content: center;
}

.wf-hero-btn-secondary {
  background: transparent;
  color: var(--color-primary);
  border: 1px solid var(--color-border);
  box-shadow: none;
}

.wf-hero-btn-secondary:hover {
  color: var(--color-primary);
  filter: none;
  box-shadow: none;
  border-color: var(--color-primary);
}

.wf-hero-stats {
  margin-top: var(--spacing-lg);
}

.wf-hero-stats-label {
  font-size: 0.85rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--color-text-light);
  margin-bottom: var(--spacing-sm);
}

.wf-hero-stats-row {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: var(--spacing-md);
}

.wf-hero-stat {
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: 220px;
}

.wf-hero-stat-value {
  font-size: clamp(1.75rem, 4vw, 2.5rem);
  font-weight: 700;
  line-height: 1.1;
  color: var(--color-primary);
}

.wf-hero-stat-label {
  font-size: 0.9rem;
  color: var(--color-text-light);
}

.wf-hero-stat:hover .wf-hero-stat-label {
  color: var(--color-primary);
  text-decoration: underline;
}
```

- [ ] **Step 4: Remove the now-dead Stats CSS block**

In `src/components/workflows/WorkflowPage.css`, delete the entire `/* 2. Stats */` block: rules `.wf-stats`, `.wf-stats-grid`, `.wf-stat`, `.wf-stat-value`, `.wf-stat-label`, `.wf-stat-source`, `.wf-stat-source:hover`.

- [ ] **Step 5: Delete the `WorkflowStats` component**

Run: `git rm src/components/workflows/WorkflowStats.tsx` (or delete the file). No other file imports it after Step 2 — confirm with:
Run: `grep -rn "WorkflowStats" src`
Expected: no matches.

- [ ] **Step 6: Verify lint + build**

Run: `npm run lint && npm run build`
Expected: both pass. (If `tsc` complains about an unused import or missing prop, fix per the message.)

- [ ] **Step 7: Visual check — one page WITH stats and one WITHOUT**

Run: `npm run dev`. Check:
- A page with stats + demo, e.g. `/services/automated-workflows/review-generation` (verify via `grep -l "stats: \[$" ...` is not it; pick any slug whose `stats` array is non-empty) — expect the label + inline number row and a "Try the demo →" button beside the consult button.
- `/services/automated-workflows/win-back-campaigns` — `stats: []`, so expect NO stat strip, and (since `hasDemo: true`) the demo button present.

To find a slug with stats:
Run: `grep -n "stats:" src/data/workflows.ts | grep -v "\[\]"`

- [ ] **Step 8: Commit (surface to Brian)**

```bash
git add src/components/workflows/WorkflowHero.tsx src/components/workflows/WorkflowPage.tsx src/components/workflows/WorkflowPage.css
git rm src/components/workflows/WorkflowStats.tsx
git commit -m "feat: fold stats strip and demo CTA into the workflow hero"
```

---

### Task 3: Merge Pains + Mechanism into one two-column band

Create `WorkflowProblemSolution` rendering "Sound familiar?" (pains) and "How it works" (mechanism) side by side; replace the two standalone sections and delete the old components.

**Files:**
- Create: `src/components/workflows/WorkflowProblemSolution.tsx`
- Modify: `src/components/workflows/WorkflowPage.tsx`
- Modify: `src/components/workflows/WorkflowPage.css`
- Delete: `src/components/workflows/WorkflowPains.tsx`
- Delete: `src/components/workflows/WorkflowMechanism.tsx`

**Interfaces:**
- Consumes: `workflow.painPoints: string[]`, `workflow.mechanism: { title; description }[]`.
- Produces: `WorkflowProblemSolution` taking `{ painPoints, mechanism }`.

- [ ] **Step 1: Create `WorkflowProblemSolution.tsx`**

Create `src/components/workflows/WorkflowProblemSolution.tsx`:

```tsx
interface WorkflowProblemSolutionProps {
  painPoints: string[];
  mechanism: { title: string; description: string }[];
}

const WorkflowProblemSolution = ({
  painPoints,
  mechanism,
}: WorkflowProblemSolutionProps) => {
  return (
    <section className="wf-problem-solution">
      <div className="container">
        <div className="wf-ps-grid">
          <div className="wf-ps-col">
            <h2 className="wf-ps-heading">Sound familiar?</h2>
            <ul className="wf-pains-list">
              {painPoints.map((pain) => (
                <li key={pain} className="wf-pains-item">
                  {pain}
                </li>
              ))}
            </ul>
          </div>
          <div className="wf-ps-col">
            <h2 className="wf-ps-heading">How it works</h2>
            <ol className="wf-mechanism-list">
              {mechanism.map((item, index) => (
                <li key={item.title} className="wf-mechanism-item">
                  <span className="wf-mechanism-number">{index + 1}</span>
                  <div className="wf-mechanism-body">
                    <h3 className="wf-mechanism-title">{item.title}</h3>
                    <p className="wf-mechanism-description">
                      {item.description}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WorkflowProblemSolution;
```

- [ ] **Step 2: Wire it into `WorkflowPage.tsx`**

In `src/components/workflows/WorkflowPage.tsx`:
- Remove imports of `WorkflowPains` and `WorkflowMechanism`.
- Add `import WorkflowProblemSolution from "./WorkflowProblemSolution";`.
- Replace the `<WorkflowPains .../>` and `<WorkflowMechanism .../>` lines with:

```tsx
      <WorkflowProblemSolution
        painPoints={workflow.painPoints}
        mechanism={workflow.mechanism}
      />
```

- [ ] **Step 3: Replace the Pains + Mechanism CSS with the two-column band**

In `src/components/workflows/WorkflowPage.css`:
- Delete the section-wrapper rules `.wf-pains` (the `/* 3. Pains */` section header rule) and `.wf-mechanism` (the `/* 4. Mechanism */` section header rule) — just the `padding`/`background` section rules, NOT the list/item rules.
- Keep `.wf-pains-list`, `.wf-pains-item`, `.wf-pains-item::before`, `.wf-mechanism-list`, `.wf-mechanism-item`, `.wf-mechanism-number`, `.wf-mechanism-body`, `.wf-mechanism-title`, `.wf-mechanism-description`.
- Change `.wf-pains-list` and `.wf-mechanism-list` so they fill their column: set `margin: var(--spacing-md) 0 0;` and `max-width: none;` (remove the `auto` centering and 800px cap). For `.wf-pains-list` also change `grid-template-columns` to `1fr` (single column inside the half-width band).
- Add the band rules where the `/* 3. Pains */` block used to start:

```css
/* 3. Problem / Solution band */
.wf-problem-solution {
  padding: var(--spacing-lg) 0;
  background: var(--color-bg);
}

.wf-ps-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--spacing-lg);
  max-width: 1000px;
  margin: 0 auto;
  align-items: start;
}

.wf-ps-heading {
  text-align: left;
  font-size: clamp(1.35rem, 3vw, 1.75rem);
}

@media (max-width: 768px) {
  .wf-ps-grid {
    grid-template-columns: 1fr;
    gap: var(--spacing-md);
  }
}
```

- [ ] **Step 4: Delete the old components**

Run: `git rm src/components/workflows/WorkflowPains.tsx src/components/workflows/WorkflowMechanism.tsx`
Then confirm nothing else imports them:
Run: `grep -rn "WorkflowPains\|WorkflowMechanism" src`
Expected: no matches.

- [ ] **Step 5: Verify lint + build**

Run: `npm run lint && npm run build`
Expected: both pass.

- [ ] **Step 6: Visual check — desktop and mobile**

Run: `npm run dev`, open a workflow page. Expect "Sound familiar?" (left) and "How it works" (right) side by side on desktop; narrow the window below 768px and confirm they stack, pains above mechanism.

- [ ] **Step 7: Commit (surface to Brian)**

```bash
git add src/components/workflows/WorkflowProblemSolution.tsx src/components/workflows/WorkflowPage.tsx src/components/workflows/WorkflowPage.css
git rm src/components/workflows/WorkflowPains.tsx src/components/workflows/WorkflowMechanism.tsx
git commit -m "feat: merge workflow pains and mechanism into one two-column band"
```

---

### Task 4: Render "Why" + "How we'd work" as a two-column tail band

Add an optional `as` prop to the two shared components so they can render "bare" (no `<section>`), then compose them side by side in `WorkflowPage` via a new `wf-tail` band. Index page unchanged (it passes no `as`, gets the default full section).

**Files:**
- Modify: `src/components/workflows/AwWhyWorkWithMe.tsx`
- Modify: `src/components/workflows/AwHowItWorks.tsx`
- Modify: `src/components/workflows/WorkflowPage.tsx`
- Modify: `src/components/workflows/WorkflowPage.css`

**Interfaces:**
- Produces: `AwWhyWorkWithMe` takes optional `{ as?: "section" | "bare" }` (default `"section"`). `AwHowItWorks` takes `{ title: string; as?: "section" | "bare" }` (default `"section"`).
- Consumes: those two components rendered `as="bare"` inside `wf-tail`.

- [ ] **Step 1: Add the `as` prop to `AwWhyWorkWithMe.tsx`**

Replace the component body in `src/components/workflows/AwWhyWorkWithMe.tsx` (keep the `reasons` array and import) with:

```tsx
interface AwWhyWorkWithMeProps {
  as?: "section" | "bare";
}

const AwWhyWorkWithMe = ({ as = "section" }: AwWhyWorkWithMeProps) => {
  const content = (
    <div className="section-content">
      <h2 className="section-title">Why work with me</h2>
      <ul className="aw-why-list">
        {reasons.map((reason) => (
          <li key={reason} className="aw-why-item">
            {reason}
          </li>
        ))}
      </ul>
    </div>
  );

  if (as === "bare") {
    return content;
  }

  return (
    <section className="aw-why">
      <div className="container">{content}</div>
    </section>
  );
};
```

- [ ] **Step 2: Add the `as` prop to `AwHowItWorks.tsx`**

In `src/components/workflows/AwHowItWorks.tsx`, replace the `AwHowItWorksProps` interface and component with:

```tsx
interface AwHowItWorksProps {
  title: string;
  as?: "section" | "bare";
}

const AwHowItWorks = ({ title, as = "section" }: AwHowItWorksProps) => {
  const content = (
    <div className="section-content">
      <h2 className="section-title">{title}</h2>
      <div className="aw-steps">
        {steps.map((step) => {
          const Icon = step.icon;
          return (
            <div key={step.title} className="aw-step">
              <div className="aw-step-number">
                <Icon className="aw-step-icon" />
              </div>
              <div className="aw-step-content">
                <h3>{step.title}</h3>
                <p>{step.description}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  if (as === "bare") {
    return content;
  }

  return (
    <section className="aw-how">
      <div className="container">{content}</div>
    </section>
  );
};
```

- [ ] **Step 3: Compose the tail band in `WorkflowPage.tsx`**

In `src/components/workflows/WorkflowPage.tsx`, replace the two lines:

```tsx
      <AwWhyWorkWithMe />
      <AwHowItWorks title="How we'd work together" />
```

with:

```tsx
      <section className="wf-tail">
        <div className="container">
          <div className="wf-tail-grid">
            <AwWhyWorkWithMe as="bare" />
            <AwHowItWorks title="How we'd work together" as="bare" />
          </div>
        </div>
      </section>
```

- [ ] **Step 4: Add `wf-tail` CSS**

In `src/components/workflows/WorkflowPage.css`, add (before `/* 8. FAQ */`):

```css
/* 7. Tail band (why + how) */
.wf-tail {
  padding: var(--spacing-lg) 0;
  background: var(--color-bg-light);
}

.wf-tail-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--spacing-lg);
  align-items: start;
}

@media (max-width: 768px) {
  .wf-tail-grid {
    grid-template-columns: 1fr;
    gap: var(--spacing-md);
  }
}
```

- [ ] **Step 5: Verify lint + build**

Run: `npm run lint && npm run build`
Expected: both pass.

- [ ] **Step 6: Visual check — workflow page AND index page**

Run: `npm run dev`. Check:
- A workflow page: "Why work with me" and "How we'd work together" appear side by side, stacking below 768px.
- `/services/automated-workflows` (index): "How It Works" and "Why work with me" still render as their own full-width stacked sections — **unchanged** from before.

- [ ] **Step 7: Commit (surface to Brian)**

```bash
git add src/components/workflows/AwWhyWorkWithMe.tsx src/components/workflows/AwHowItWorks.tsx src/components/workflows/WorkflowPage.tsx src/components/workflows/WorkflowPage.css
git commit -m "feat: render workflow why + how as a two-column tail band"
```

---

### Task 5: Full-page verification sweep

Confirm the whole redesign holds across the content variants and both viewports.

**Files:** none (verification only).

- [ ] **Step 1: Lint + build clean**

Run: `npm run lint && npm run build`
Expected: both pass, zero warnings.

- [ ] **Step 2: Cross-check the content variants**

Run: `npm run dev` and open, at desktop width then <768px:
- A page with non-empty `stats` (from `grep -n "stats:" src/data/workflows.ts | grep -v "\[\]"`) — stat strip with label shows in hero.
- `win-back-campaigns` — no stat strip; demo button present.
- A page with `hasDemo: false` (from `grep -n "hasDemo: false" src/data/workflows.ts`) — no "Try the demo →" button in hero, and no `WorkflowDemoCta` section.

For each: hero → problem/solution band → (demo) → why/how tail band → FAQ → final CTA, in that order, with the tightened spacing.

- [ ] **Step 3: Confirm the index page is untouched**

Open `/services/automated-workflows`. Expect the grid of 9 cards, then stacked "How It Works", "Why work with me", final CTA — identical to before this branch's changes (compare against `git stash`/main if unsure).

- [ ] **Step 4: Commit any final tweaks (surface to Brian)**

If Step 2/3 surfaced a spacing nit, fix it in `WorkflowPage.css` and:

```bash
git add src/components/workflows/WorkflowPage.css
git commit -m "style: workflow page compaction polish"
```

---

## Self-Review notes

- **Spec coverage:** Design §1 → Task 1 + per-section padding in Tasks 2–4; §2 (hero) → Task 2; §3 (problem/solution) → Task 3; §4 (demo unchanged, tighter padding) → Task 1 Step 1; §5 (why/how bare tail) → Task 4; §6 (FAQ/final CTA) → Task 1 (FAQ padding) + left as-is; verification → Task 5.
- **Type consistency:** `as?: "section" | "bare"` identical in both shared components; `WorkflowHero` props `{ headline, subhead, slug, hasDemo, stats }` match what `WorkflowPage` passes; `WorkflowProblemSolution` props match. `workflowDemoPath` / `Stat` imported from `src/data/workflows.ts` where they already live.
- **No placeholders:** every code and CSS change is spelled out.
