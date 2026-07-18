# Phase 2 — Workflow Detail-Page Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild the per-workflow detail pages in Domo's structural language — split hero, eyebrow labels, alternating feature rows — with every section anchored by a framed "product shot" that reuses the real demo UI.

**Architecture:** A per-workflow *showcase* module renders curated static snippets built from each demo's existing CSS classes, wrapped in a color-only token scope. `WorkflowPage` composes a split `WorkflowHero`, reusable `WorkflowFeatureRow`s, and a "See it run" band from the workflow's `showcase` config. Migrate one workflow at a time behind an optional `showcase` field (pages without it keep the current light layout), then make it required.

**Tech Stack:** React 18 + TypeScript, Vite 5, vanilla CSS custom properties, react-icons, react-router-dom v6, `React.lazy`/`Suspense` for per-workflow code-splitting.

## Global Constraints

- **No test framework.** Verification for every task = `npm run lint` (zero warnings) + `npm run build` (tsc + vite) + a browser visual walk (dev server, currently http://localhost:5174, via Claude-in-Chrome), desktop and mobile (<768px). No unit tests.
- **Git writes permitted this session** (per Brian). Each task commits with scoped paths and a message; surface the hash.
- **Light theme is the ground** (Phase 1). Use existing tokens; snippets reuse the scoped `--demo-*` light tokens. Contrast bar: WCAG AA for body text.
- **Reuse, don't duplicate:** snippets reuse each demo's existing CSS classes (`.rg-*`, `.mc-*`, …). Do not fork demo styles; if a snippet needs a tweak, scope it under `wf-shot`.
- **Demo CSS off the shared bundle:** showcase modules are `React.lazy`-loaded per slug (mirroring `src/demos/registry.ts`), so a demo's CSS ships only on its own detail page.
- **Incremental & shippable:** `showcase` is optional until every published workflow has one; pages without it render the current layout. Only the final task makes it required.
- **Sourcing rules** (CLAUDE.md): no new statistics; feature-row copy is marketing framing of existing vetted `mechanism`/`hero` content.

---

### Task 1: Token-scope refactor — colors without the demo shell

Split the `--demo-*` token definitions off `.demo`'s full-viewport layout so static snippets can borrow the demo palette without inheriting `height:100vh`.

**Files:**
- Modify: `src/demos/shared/DemoShell.css`

**Interfaces:**
- Produces: a `.demo-scope` class (and `.demo`) that both carry the `--demo-*` tokens; `.demo`'s layout rules unchanged.

- [ ] **Step 1: Move the token block onto a shared `:where` selector**

In `src/demos/shared/DemoShell.css`, the `.demo { --demo-*: …; <layout> }` rule currently holds both tokens and layout. Change the selector on the **token-definition block only** so it is shared, leaving the layout declarations on `.demo`. Concretely, replace the opening of the `.demo` rule so the token declarations live on `:where(.demo, .demo-scope)` and the layout declarations remain on `.demo`:

```css
/* tokens: available to the full demo AND to static showcase snippets */
:where(.demo, .demo-scope) {
  --demo-bg: #f4f6fa;
  --demo-surface: #ffffff;
  --demo-surface-2: #f7f9fc;
  --demo-border: #e3e8ef;
  --demo-text: #0f172a;
  --demo-muted: #566072;
  --demo-accent: #2563eb;
  --demo-accent-bright: #3b82f6;
  --demo-accent-deep: #1d4ed8;
  --demo-accent-glow: rgba(37, 99, 235, 0.22);
  --demo-accent-soft: rgba(37, 99, 235, 0.10);
  --demo-edge: #e3e8ef;
  --demo-edge-active: #3b82f6;
  --demo-success: #059669;
  --demo-success-soft: rgba(5, 150, 105, 0.12);
  --demo-warn: #b7791f;
  --demo-warn-soft: rgba(245, 158, 11, 0.16);
  --demo-error: #dc2626;
  --demo-error-soft: rgba(220, 38, 38, 0.10);
  --demo-star: #f59e0b;
  --demo-on-accent: #ffffff;
  --demo-shadow: 0 10px 30px rgba(15, 23, 42, 0.10);
  --demo-dot: rgba(15, 23, 42, 0.05);

  /* scope-local remap of the global tokens (used by shared step CSS) */
  --color-bg-light: var(--demo-surface-2);
  --color-border: var(--demo-border);
  --color-text: var(--demo-text);
  --color-text-light: var(--demo-muted);
  --color-secondary: var(--demo-muted);
  --color-primary: var(--demo-accent-bright);
  --color-primary-dark: var(--demo-accent);
}

.demo {
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow: hidden;
  color: var(--demo-text);
  background-color: var(--demo-bg);
  background-image: radial-gradient(circle, var(--demo-dot) 1px, transparent 1px);
  background-size: 22px 22px;
}
```

Preserve every other rule in the file unchanged. (Read the current `.demo` rule first and move exactly its layout declarations onto the new `.demo` block — do not drop any property.)

- [ ] **Step 2: Verify lint + build**

Run: `npm run lint && npm run build`
Expected: both pass.

- [ ] **Step 3: Browser check — demos unaffected**

With the dev server running, open `/services/automated-workflows/review-generation/demo` and step through 2–3 stages. Expected: identical to before (light, full-viewport, dot background) — the refactor is behavior-preserving for `.demo`.

- [ ] **Step 4: Commit**

```bash
git add src/demos/shared/DemoShell.css
git commit -m "refactor: share demo color tokens via :where(.demo,.demo-scope)"
```

---

### Task 2: Showcase infrastructure — frame, feature row, registry, data types

Build the reusable pieces every redesigned page uses: the `wf-shot` frame, `WorkflowFeatureRow`, the lazy showcase registry, and the `showcase` data types (optional for now).

**Files:**
- Create: `src/components/workflows/WorkflowFeatureRow.tsx`
- Create: `src/showcases/registry.ts`
- Create: `src/showcases/ShowcaseFrame.tsx`
- Modify: `src/components/workflows/WorkflowPage.css` (add `wf-shot`, `wf-feature-row`, split-hero, band styles)
- Modify: `src/data/workflows.ts` (add `Showcase` / `FeatureRow` types + optional `showcase` field)

**Interfaces:**
- Produces:
  - `ShowcaseFrame` — `({ children, layered? }: { children: ReactNode; layered?: boolean }) => JSX.Element`. Wraps snippet markup in `<div className="demo-scope wf-shot">` (adds a peeking back-card when `layered`).
  - `WorkflowFeatureRow` — `({ eyebrow?, title, body, visual, flip? }: { eyebrow?: string; title: string; body: string; visual: ReactNode; flip?: boolean }) => JSX.Element`.
  - `showcaseRegistry: Record<string, LazyExoticComponent<ComponentType<{ snippet: string }>>>` — slug → lazy showcase component that renders one snippet by key.
  - Types in `workflows.ts`: `FeatureRow = { eyebrow?: string; title: string; body: string; snippet: string; flip?: boolean }`, `Showcase = { heroSnippet: string; rows: FeatureRow[] }`, and `WorkflowContent.showcase?: Showcase`.

- [ ] **Step 1: Add the data types (optional field)**

In `src/data/workflows.ts`, add above `WorkflowContent`:

```ts
export interface FeatureRow {
  eyebrow?: string;
  title: string;
  body: string;
  snippet: string; // key into the workflow's showcase module
  flip?: boolean; // place the visual on the left
}

export interface Showcase {
  heroSnippet: string;
  rows: FeatureRow[];
}
```

Then add one line to `WorkflowContent` (optional — keeps all 9 published workflows compiling without a showcase yet):

```ts
  showcase?: Showcase; // present ⇒ page renders the Phase-2 redesign
```

- [ ] **Step 2: Create `ShowcaseFrame.tsx`**

```tsx
import type { ReactNode } from "react";

interface ShowcaseFrameProps {
  children: ReactNode;
  layered?: boolean;
}

const ShowcaseFrame = ({ children, layered = false }: ShowcaseFrameProps) => (
  <div className={layered ? "demo-scope wf-shot wf-shot-layered" : "demo-scope wf-shot"}>
    {children}
  </div>
);

export default ShowcaseFrame;
```

- [ ] **Step 3: Create `WorkflowFeatureRow.tsx`**

```tsx
import type { ReactNode } from "react";

interface WorkflowFeatureRowProps {
  eyebrow?: string;
  title: string;
  body: string;
  visual: ReactNode;
  flip?: boolean;
}

const WorkflowFeatureRow = ({ eyebrow, title, body, visual, flip = false }: WorkflowFeatureRowProps) => (
  <div className={flip ? "wf-feature-row wf-feature-row-flip" : "wf-feature-row"}>
    <div className="wf-feature-copy">
      {eyebrow && <p className="wf-eyebrow">{eyebrow}</p>}
      <h2 className="wf-feature-title">{title}</h2>
      <p className="wf-feature-body">{body}</p>
    </div>
    <div className="wf-feature-visual">{visual}</div>
  </div>
);

export default WorkflowFeatureRow;
```

- [ ] **Step 4: Create the lazy showcase registry**

`src/showcases/registry.ts` (mirrors `src/demos/registry.ts`; only review-generation exists at first — others are added in their rollout tasks):

```ts
import { lazy } from "react";
import type { ComponentType, LazyExoticComponent } from "react";

// Each showcase component renders ONE static snippet, selected by `snippet` key.
export const showcaseRegistry: Record<
  string,
  LazyExoticComponent<ComponentType<{ snippet: string }>>
> = {
  "review-generation": lazy(() => import("./reviewGeneration")),
};
```

- [ ] **Step 5: Add the frame / row / split-hero / band CSS**

In `src/components/workflows/WorkflowPage.css`, add the styles below. These are the *starting* styles; framing, radius, shadow depth, and spacing are tuned live against the design in Task 3 — keep the class names stable.

```css
/* Eyebrow */
.wf-eyebrow {
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  font-weight: 700;
  color: var(--color-primary);
  margin-bottom: var(--spacing-xs);
}

/* Framed product-shot (color tokens come from .demo-scope) */
.wf-shot {
  position: relative;
  background: var(--demo-surface);
  border: 1px solid var(--demo-border);
  border-radius: 1rem;
  box-shadow: var(--demo-shadow);
  padding: var(--spacing-md);
  max-width: 460px;
}
.wf-shot-layered::before {
  content: "";
  position: absolute;
  inset: 12px -12px -12px 12px;
  background: var(--demo-surface-2);
  border: 1px solid var(--demo-border);
  border-radius: 1rem;
  z-index: -1;
}

/* Split hero */
.wf-hero-split {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--spacing-lg);
  align-items: center;
  max-width: var(--max-width);
  margin: 0 auto;
}
.wf-hero-copy { text-align: left; }
.wf-hero-visual { display: flex; justify-content: center; }

/* Feature row */
.wf-feature-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--spacing-lg);
  align-items: center;
  max-width: 1000px;
  margin: 0 auto var(--spacing-xl);
}
.wf-feature-row-flip .wf-feature-copy { order: 2; }
.wf-feature-copy { text-align: left; }
.wf-feature-title { font-size: clamp(1.35rem, 3vw, 2rem); margin-bottom: var(--spacing-sm); }
.wf-feature-visual { display: flex; justify-content: center; }

@media (max-width: 768px) {
  .wf-hero-split,
  .wf-feature-row { grid-template-columns: 1fr; gap: var(--spacing-md); }
  .wf-feature-row-flip .wf-feature-copy { order: 0; }
  .wf-shot { max-width: 100%; }
}
```

- [ ] **Step 6: Verify lint + build**

Run: `npm run lint && npm run build`
Expected: both pass (new components are unused until Task 3 — that is fine; but ensure no unused-import lint error by not importing them anywhere yet).

- [ ] **Step 7: Commit**

```bash
git add src/components/workflows/WorkflowFeatureRow.tsx src/showcases/registry.ts src/showcases/ShowcaseFrame.tsx src/components/workflows/WorkflowPage.css src/data/workflows.ts
git commit -m "feat: showcase infrastructure (frame, feature row, registry, types)"
```

---

### Task 3: Prototype — redesign the review-generation page end-to-end

Build review-generation's showcase module + data, rebuild the hero as a split, wire `WorkflowPage` to render the redesign when `showcase` exists, and iterate the visuals live. This is the design gate; the approved result locks the pattern for rollout.

**Files:**
- Create: `src/showcases/reviewGeneration.tsx`
- Modify: `src/components/workflows/WorkflowHero.tsx` (split layout + `eyebrow` + `heroVisual`)
- Modify: `src/components/workflows/WorkflowPage.tsx` (branch on `showcase`)
- Modify: `src/components/workflows/WorkflowDemoCta.tsx` (+ CSS) — restyle into the "See it run" band with a framed preview
- Modify: `src/data/workflows.ts` (add `showcase` to the review-generation entry)
- Modify: `src/components/workflows/WorkflowPage.css` (tune shot/row/hero visuals)

**Interfaces:**
- Consumes: `ShowcaseFrame`, `WorkflowFeatureRow`, `showcaseRegistry`, the `Showcase` type from Task 2.
- Produces: `reviewGeneration.tsx` default export — `({ snippet }: { snippet: string }) => JSX.Element` rendering a snippet by key (`"review"`, `"appt"`, `"thread"`, `"route"`). `WorkflowHero` new props `{ eyebrow, headline, subhead, slug, hasDemo, stats, heroVisual }`.

- [ ] **Step 1: Create the review-generation showcase module**

`src/showcases/reviewGeneration.tsx` — reuses the `.rg-*` classes (import the demo CSS so they are styled) and renders one static snippet per key. Sample content is hardcoded (no provider). Example (adjust card content to read well as a product-shot):

```tsx
import { FaGoogle, FaStar, FaCheckCircle, FaSpa } from "react-icons/fa";
import "../demos/reviewGeneration/reviews.css";

const Review = () => (
  <div className="rg-review">
    <div className="rg-review-head">
      <FaGoogle className="rg-review-google" />
      <span className="rg-review-on">on Google</span>
      <span className="rg-review-badge"><FaCheckCircle /> Verified</span>
    </div>
    <div className="rg-review-stars">
      {Array.from({ length: 5 }).map((_, i) => (
        <FaStar key={i} className="rg-review-star" />
      ))}
    </div>
    <p className="rg-review-body">
      “Jenna and the team were incredible — booked me in fast and the results
      speak for themselves. Already rebooked.”
    </p>
    <p className="rg-review-author">— Priya N.</p>
  </div>
);

const Appt = () => (
  <div className="rg-appt">
    <div className="rg-appt-icon"><FaSpa /></div>
    <div className="rg-appt-body">
      <p className="rg-appt-name">Jenna Alvarez</p>
      <p className="rg-appt-service">HydraFacial · with Maya</p>
      <p className="rg-appt-meta">Today 1:30 PM · visit complete</p>
    </div>
    <span className="rg-appt-tag">Done</span>
  </div>
);

// "thread" and "route" snippets reuse .rg-bubble / .rg-route markup — build them
// the same way, lifting the class structure from reviews.css / the step components.
const snippets: Record<string, JSX.Element> = {
  review: <Review />,
  appt: <Appt />,
  // thread: <Thread />,
  // route: <Route />,
};

const ReviewGenerationShowcase = ({ snippet }: { snippet: string }) => snippets[snippet] ?? null;

export default ReviewGenerationShowcase;
```

Build the `thread` and `route` snippets in the same file by lifting the `.rg-bubble*` and `.rg-route*` markup (see `reviews.css` and `steps/RouteStep.tsx` for the class structure). Each must render correctly under `demo-scope`.

- [ ] **Step 2: Rebuild `WorkflowHero` as a split**

Replace `WorkflowHero.tsx` so it accepts `eyebrow` and `heroVisual` and renders the split layout when a visual is supplied. Keep the existing CTA + stat-strip markup inside the copy column. Full file:

```tsx
import { FaCalendarAlt, FaPlay } from "react-icons/fa";
import { Link } from "react-router-dom";
import type { ReactNode } from "react";
import { CALENDLY_URL } from "../../data/site";
import { workflowDemoPath, type Stat } from "../../data/workflows";

interface WorkflowHeroProps {
  eyebrow?: string;
  headline: string;
  subhead: string;
  slug: string;
  hasDemo: boolean;
  stats: Stat[];
  heroVisual?: ReactNode;
}

const WorkflowHero = ({ eyebrow, headline, subhead, slug, hasDemo, stats, heroVisual }: WorkflowHeroProps) => {
  const copy = (
    <div className="wf-hero-copy">
      {eyebrow && <p className="wf-eyebrow">{eyebrow}</p>}
      <h1 className="wf-hero-title">{headline}</h1>
      <p className="wf-hero-subtitle">{subhead}</p>
      <div className="wf-hero-actions">
        <a href={CALENDLY_URL} className="wf-hero-btn" target="_blank" rel="noopener noreferrer">
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
          <p className="wf-hero-stats-label">What it costs to leave this manual</p>
          <div className="wf-hero-stats-row">
            {stats.map((stat) => (
              <a key={stat.label} href={stat.sourceUrl} className="wf-hero-stat" target="_blank" rel="noopener noreferrer">
                <span className="wf-hero-stat-value">{stat.value}</span>
                <span className="wf-hero-stat-label">{stat.label}</span>
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  return (
    <section className="wf-hero">
      <div className="container">
        {heroVisual ? (
          <div className="wf-hero-split">
            {copy}
            <div className="wf-hero-visual">{heroVisual}</div>
          </div>
        ) : (
          <div className="wf-hero-content">{copy}</div>
        )}
      </div>
    </section>
  );
};

export default WorkflowHero;
```

(The `wf-hero-content` fallback keeps non-migrated pages rendering as today. Adjust `.wf-hero-copy` text-align vs the old centered `.wf-hero-content` in CSS as needed.)

- [ ] **Step 3: Wire `WorkflowPage` to branch on `showcase`**

Rewrite `WorkflowPage.tsx` so that when `workflow.showcase` exists it renders the redesign (lazy showcase + hero visual + feature rows), else the current layout. Use a `Suspense` boundary around lazy showcase visuals with a light fallback. Key structure:

```tsx
import { Suspense, createElement } from "react";
import { Navigate, useParams } from "react-router-dom";
import { getWorkflow } from "../../data/workflows";
import { showcaseRegistry } from "../../showcases/registry";
import ShowcaseFrame from "../../showcases/ShowcaseFrame";
import WorkflowHero from "./WorkflowHero";
import WorkflowFeatureRow from "./WorkflowFeatureRow";
import WorkflowProblemSolution from "./WorkflowProblemSolution";
import WorkflowDemoCta from "./WorkflowDemoCta";
import WorkflowFaq from "./WorkflowFaq";
import AwWhyWorkWithMe from "./AwWhyWorkWithMe";
import AwHowItWorks from "./AwHowItWorks";
import AwFinalCta from "./AwFinalCta";
import "./WorkflowPage.css";

const WorkflowPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const workflow = slug ? getWorkflow(slug) : undefined;
  if (!workflow || !workflow.published) {
    return <Navigate to="/services/automated-workflows" replace />;
  }

  const Tail = (
    <>
      <section className="wf-tail">
        <div className="container">
          <div className="wf-tail-grid">
            <AwWhyWorkWithMe as="bare" />
            <AwHowItWorks title="How we'd work together" as="bare" />
          </div>
        </div>
      </section>
      <WorkflowFaq faq={workflow.faq} />
      <AwFinalCta />
    </>
  );

  if (workflow.showcase) {
    const Showcase = showcaseRegistry[workflow.slug];
    const shot = (key: string, layered = false) => (
      <ShowcaseFrame layered={layered}>
        <Suspense fallback={<div className="wf-shot-skeleton" />}>
          {createElement(Showcase, { snippet: key })}
        </Suspense>
      </ShowcaseFrame>
    );
    return (
      <>
        <WorkflowHero
          eyebrow={workflow.label}
          headline={workflow.hero.headline}
          subhead={workflow.hero.subhead}
          slug={workflow.slug}
          hasDemo={workflow.hasDemo}
          stats={workflow.stats}
          heroVisual={shot(workflow.showcase.heroSnippet, true)}
        />
        <WorkflowProblemSolution painPoints={workflow.painPoints} mechanism={[]} />
        <section className="wf-features">
          <div className="container">
            {workflow.showcase.rows.map((row) => (
              <WorkflowFeatureRow
                key={row.title}
                eyebrow={row.eyebrow}
                title={row.title}
                body={row.body}
                flip={row.flip}
                visual={shot(row.snippet)}
              />
            ))}
          </div>
        </section>
        {workflow.hasDemo && <WorkflowDemoCta slug={workflow.slug} label={workflow.label} />}
        {Tail}
      </>
    );
  }

  // Fallback: current (Phase-1) layout for not-yet-migrated workflows
  return (
    <>
      <WorkflowHero headline={workflow.hero.headline} subhead={workflow.hero.subhead} slug={workflow.slug} hasDemo={workflow.hasDemo} stats={workflow.stats} />
      <WorkflowProblemSolution painPoints={workflow.painPoints} mechanism={workflow.mechanism} />
      {workflow.hasDemo && <WorkflowDemoCta slug={workflow.slug} label={workflow.label} />}
      {Tail}
    </>
  );
};

export default WorkflowPage;
```

Note: in the redesign branch `WorkflowProblemSolution` is passed `mechanism={[]}` so it renders only the "Sound familiar?" pains (the mechanism is now the feature rows). Confirm `WorkflowProblemSolution` renders nothing for the mechanism column when the array is empty; if it renders an empty column, add a guard there (single-column when `mechanism.length === 0`).

- [ ] **Step 4: Add the review-generation `showcase` data**

In `src/data/workflows.ts`, add a `showcase` block to the `review-generation` entry, e.g.:

```ts
    showcase: {
      heroSnippet: "review",
      rows: [
        { eyebrow: "Trigger", title: "It starts the moment a visit wraps", body: "…", snippet: "appt" },
        { eyebrow: "Ask", title: "A real question in your voice, at the right moment", body: "…", snippet: "thread", flip: true },
        { eyebrow: "Route", title: "Happy clients to Google, unhappy ones to you", body: "…", snippet: "route" },
      ],
    },
```

Write the row `body` copy as marketing framing of the existing `mechanism` descriptions (lift/condense; do not invent claims or stats).

- [ ] **Step 5: Restyle `WorkflowDemoCta` into the "See it run" band**

Update `WorkflowDemoCta.tsx` (+ its CSS in `WorkflowPage.css`) to show a framed preview (reuse a showcase snippet at larger size, or keep the current lede) plus the prominent "Try the interactive demo →" CTA. Keep the route target (`workflowDemoPath(slug)`) unchanged.

- [ ] **Step 6: Verify lint + build**

Run: `npm run lint && npm run build`
Expected: both pass.

- [ ] **Step 7: Browser iteration — the design gate**

Open `/services/automated-workflows/review-generation`. Walk the whole page desktop + mobile. Iterate the `wf-shot` / hero / feature-row CSS until it reads like the Domo reference: framed product-shots with depth, clean alternating rows, no empty voids, everything legible. Confirm the demo route still works and the "Try the demo" CTAs land there. **Get sign-off on this page before rollout.**

- [ ] **Step 8: Commit**

```bash
git add src/showcases/reviewGeneration.tsx src/components/workflows/WorkflowHero.tsx src/components/workflows/WorkflowPage.tsx src/components/workflows/WorkflowDemoCta.tsx src/data/workflows.ts src/components/workflows/WorkflowPage.css
git commit -m "feat: redesign the review-generation detail page (Phase 2 prototype)"
```

---

### Task 4: Roll the redesign to the remaining 8 workflows

Apply the locked pattern to each other workflow: author a showcase module (curate 2–3 static snippets from that demo's CSS classes) + register it + add its `showcase` data. Same procedure per workflow; do them one at a time, each independently committed and browser-verified.

**Per-workflow procedure (repeat for each slug below):**

1. Create `src/showcases/<demoDir>.tsx` — a default `({ snippet }) => JSX.Element` that imports that demo's CSS (`import "../demos/<demoDir>/<file>.css"`) and renders one static snippet per key, reusing the demo's real classes with sample content (lift class structure from the demo's `.css` and `steps/*`). Pick the most "product-shot"-worthy cards: a hero card + 2–3 row visuals.
2. Register it in `src/showcases/registry.ts`: add `"<slug>": lazy(() => import("./<demoDir>"))`.
3. Add a `showcase` block to that workflow's entry in `src/data/workflows.ts` (`heroSnippet` + 2–3 `rows` with eyebrow/title/body/snippet/flip), copy as marketing framing of existing `mechanism`/`hero` content.
4. `npm run lint && npm run build`; browser-walk `/services/automated-workflows/<slug>` desktop + mobile; fix contrast/framing.
5. Commit: `git add src/showcases/<demoDir>.tsx src/showcases/registry.ts src/data/workflows.ts && git commit -m "feat: redesign the <slug> detail page"`.

**Workflows (slug → demo dir → CSS file → candidate snippet cards):**

- [ ] `win-back-campaigns` → `winBackCampaign` → `winback.css` — import list card, segment/offer card, results tiles.
- [ ] `missed-call-text-back` → `missedCallTextBack` → `missedcall.css` — missed-call card, SMS thread (`.mc-bubble`), booking/dispatch card.
- [ ] `automated-quoting` → `automatedQuoting` → `quoting.css` — request card, itemized estimate, approve band.
- [ ] `invoice-reminders` → `invoiceReminders` → `invoices.css` — overdue invoice card, reminder ladder, paid/results.
- [ ] `new-customer-onboarding` → `newCustomerOnboarding` → `onboarding.css` — booking card, welcome/packet card, first-visit card.
- [ ] `job-dispatch` → `jobDispatch` → `dispatch.css` — job-pile cards, tech match, route/notify card.
- [ ] `weekly-owner-reports` → `weeklyReports` → `reports.css` — the stat-tile grid, digest card, delivery card.
- [ ] `tool-sync` → `toolSync` → `sync.css` — new-booking card, mapping card, write-to-tools/results.

Each bullet above is one independently-committed unit (create module + register + data + verify + commit). Every task ends green on lint+build and a browser walk.

---

### Task 5: Finalize — make `showcase` required, verify all 9

Now that every published workflow has a `showcase`, restore the type guarantee and remove the fallback path.

**Files:**
- Modify: `src/data/workflows.ts`
- Modify: `src/components/workflows/WorkflowPage.tsx`

- [ ] **Step 1: Make `showcase` required**

In `src/data/workflows.ts`, change `showcase?: Showcase;` to `showcase: Showcase;` in `WorkflowContent`. `tsc` will now flag any published workflow missing it.

- [ ] **Step 2: Remove the fallback branch**

In `WorkflowPage.tsx`, delete the "Fallback: current layout" return and the `workflow.showcase` conditional (it's always present now) — keep only the redesign path. `WorkflowProblemSolution` is now always called with `mechanism={[]}`; if the mechanism column guard added in Task 3 makes the extra import unnecessary, simplify accordingly.

- [ ] **Step 3: Verify lint + build**

Run: `npm run lint && npm run build`
Expected: both pass. If `tsc` flags a workflow missing `showcase`, that workflow was skipped in Task 4 — add it.

- [ ] **Step 4: Full browser walk — all 9**

Open every `/services/automated-workflows/<slug>` (all 9), desktop + mobile. Confirm each renders the redesign (split hero, feature rows, framed shots, "See it run" band), reads legibly, and its demo route still works. Confirm the index page and other pages are unaffected.

- [ ] **Step 5: Commit**

```bash
git add src/data/workflows.ts src/components/workflows/WorkflowPage.tsx
git commit -m "feat: require showcase on published workflows; drop legacy layout"
```

---

## Self-Review notes

- **Spec coverage:** token-scope refactor → Task 1; frame/row/registry/types → Task 2; split hero + feature rows + "See it run" band + prototype → Task 3; reuse-real-demo-UI via showcase modules → Tasks 3–4; per-workflow rollout → Task 4; optional→required incremental typing → Tasks 2 & 5; verification (lint/build/browser, contrast, bundle-splitting via lazy registry) → every task.
- **Type/interface consistency:** `Showcase`/`FeatureRow` defined in Task 2 are used verbatim in Tasks 3–5; `showcaseRegistry` value type `ComponentType<{ snippet: string }>` matches each showcase module's `({ snippet }: { snippet: string })` default export; `WorkflowHero` prop set is identical across the Task 3 rewrite and the Task 3 `WorkflowPage` call; `ShowcaseFrame`/`WorkflowFeatureRow` signatures match their call sites.
- **Design-work honesty:** structure, props, data, wiring, and the refactor are fully specified (deterministic). The *visual polish* of `wf-shot`/hero/rows is explicitly iterated live in Task 3 Step 7 against the Domo reference and then locked for rollout — the CSS given is a labeled starting point, not final pixels. This is intentional for visual design and is called out, not left as a vague placeholder.
- **No placeholders in logic:** the one deliberately-open item (exact `thread`/`route` snippet markup, and row `body` copy) is bounded by "lift the class structure from `reviews.css`/`steps/*`" and "marketing framing of existing vetted content," with the example snippets/data shape given.
