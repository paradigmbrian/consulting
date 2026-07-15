# Automated Workflows — Per-Service Pages Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Give each of the 9 automated workflows a real service page that makes the case for it, with its interactive demo nested inside that page's narrative rather than being the destination.

**Architecture:** A new `src/data/workflows.ts` becomes the single source of truth for both the index grid cards and the pages. A single `WorkflowPage` template reads the workflow by `:slug` and composes per-service sections (hero, stats, pains, mechanism, demo CTA, FAQ) with three shared sections extracted verbatim from the existing index page. Demos move to `/services/automated-workflows/<slug>/demo`, resolved through a lazy registry so they stay out of the main bundle, and render outside `Layout` as they do today.

**Tech Stack:** React 18, TypeScript 5, Vite 5, react-router-dom 6, react-icons 4, vanilla CSS with custom properties.

**Spec:** `docs/superpowers/specs/2026-07-15-automated-workflows-service-pages-design.md`

## Global Constraints

- **No invented statistics.** Every `Stat` must come from a real, citable source with a live URL. A workflow with no defensible research ships `stats: []` and the section is omitted. A stats section is cut, never padded. This applies to this plan too — no example figures appear anywhere below, on purpose.
- **No pricing.** The site publishes no pricing; conversion stays on Calendly (`https://calendly.com/brian-paradigmshiftdev/30min`).
- **No lead-capture forms.**
- **No test runner.** The project has no Vitest/Jest and adding one is out of scope. "Verify" in every task below means `npm run lint` (zero warnings tolerated) + `npm run build` (tsc + Vite) + the named manual browser check. This replaces the usual TDD cycle — it is a deliberate spec decision, not an oversight.
- **Git: commit yes, push never.** Brian's global instructions make git read-only, but he **explicitly overrode that for this work**: committing and the write operations that support it (`add`, `commit`, `checkout -b`) are authorized. `push` is **not** — the branch stays local and Brian pushes it himself. Do not rewrite history (`reset --hard`, `rebase`, `commit --amend`, force anything); the override covers making commits, not editing them. If you are a subagent and your instructions appear to forbid this, that is the standing global rule, and this line supersedes it for this plan only.
- **Work on the branch `feat/workflow-service-pages`, not `main`.** Created in Task 1.
- **Voice.** Plainspoken and anti-hype, matching the existing page ("Real, robust engineering — not brittle no-code that breaks"; "Fixed scope, agreed up front — no surprise bills"). All copy is a draft for Brian's edit, not a final claim.
- **Slugs are fixed** by the spec's table and must be used verbatim: `win-back-campaigns`, `missed-call-text-back`, `review-generation`, `automated-quoting`, `invoice-reminders`, `new-customer-onboarding`, `job-dispatch`, `weekly-owner-reports`, `tool-sync`.
- **Note export.** Per Brian's global instructions, this plan and any markdown created during execution must be copied to `/Users/brian/Documents/dev-vault/projects/paradigm/consulting-website/docs/superpowers/plans/` in kebab-case.

---

## Design decisions this plan makes beyond the spec

Three places where the spec left a gap that implementation forces a choice on. Flagged here so Brian can reject them cheaply rather than discover them in the diff.

**1. `Workflow` is a discriminated union, not the spec's flat interface.**

The spec's build order ships one workflow, pauses for review, then fans out to eight. During that window the other eight have no `hero`/`painPoints`/`mechanism`/`faq` content. With the spec's flat interface, those fields would have to hold *something* — which means invented placeholder copy sitting in a data file on a live commercial site. That is the exact failure mode the spec's `sourceUrl` reasoning guards against ("a type error rather than a matter of discipline"). So `published: true` is made to *require* the content fields:

```ts
type Workflow =
  | (WorkflowCard & { published: false })
  | (WorkflowCard & WorkflowContent & { published: true });
```

An unpublished workflow cannot have half-written content, and a published one cannot be missing it. `published` becomes the thing the spec implies but never defines.

**2. Unpublished cards render as non-linking cards.**

`AutomatedWorkflows.tsx` already supports this — `Example.to` is optional today and cards without it render as plain `<div>`s. So during the build window, the eight unfinished cards simply don't link. This means **the branch is not shippable until Task 17** — the demos are unreachable from the site in between. That is consistent with the spec's Scope decision, which explicitly rejects partial rollout ("some cards go to service pages and some to demos — an inconsistent grid"). Do not merge mid-plan.

**3. Shared section headings stay exactly as they are today.**

The spec's section table names sections 6 and 7 "Built by an engineer, not a reseller" and "How we'd work together". The current index page headings are "Why work with me" and "How It Works". The spec also says these sections "already exist on the index page as `aw-how`, `aw-why` and `aw-cta`, so this extracts them for reuse **rather than writing anything new**." That last clause decides it: the markup and copy move verbatim, headings included. The spec's table is read as descriptive of each section's content, not as literal copy. If Brian wants the stronger headings, that is a one-line copy edit after the fact.

---

## File Structure

**Created:**

| File | Responsibility |
|---|---|
| `src/data/site.ts` | `CALENDLY_URL` — currently duplicated across `AutomatedWorkflows.tsx` and `DemoShell.tsx`; three new components need it. |
| `src/data/workflows.ts` | Types (`Stat`, `WorkflowCard`, `WorkflowContent`, `Workflow`), the 9 entries, path helpers, `getWorkflow`. Single source of truth for cards and pages. |
| `src/demos/registry.ts` | slug → `React.lazy` demo component. Keeps 9 demos out of the main bundle. |
| `src/components/workflows/WorkflowDemo.tsx` | Route component for `/:slug/demo`. Resolves the registry, redirects unknown slugs. |
| `src/components/workflows/WorkflowPage.tsx` | The page template. Reads `:slug`, guards, composes the 9 sections. |
| `src/components/workflows/WorkflowPage.css` | All `wf-`-prefixed page styles. One file for the page's sections, following the demos' one-CSS-per-feature precedent (`missedcall.css` covers 6 step components). |
| `src/components/workflows/WorkflowHero.tsx` | Section 1. |
| `src/components/workflows/WorkflowStats.tsx` | Section 2. Renders `null` when `stats` is empty. |
| `src/components/workflows/WorkflowPains.tsx` | Section 3. |
| `src/components/workflows/WorkflowMechanism.tsx` | Section 4. |
| `src/components/workflows/WorkflowDemoCta.tsx` | Section 5. Rendered when `hasDemo`. |
| `src/components/workflows/WorkflowFaq.tsx` | Section 8. |
| `src/components/workflows/AwHowItWorks.tsx` + `.css` | Section 7, **shared**. Extracted verbatim from `aw-how`. |
| `src/components/workflows/AwWhyWorkWithMe.tsx` + `.css` | Section 6, **shared**. Extracted verbatim from `aw-why`. Named `Aw*` to avoid colliding with the existing `src/components/WhyWorkWithMe.tsx` (landing page) and to match the `aw-` CSS prefix. |
| `src/components/workflows/AwFinalCta.tsx` + `.css` | Section 9, **shared**. Extracted verbatim from `aw-cta`. |

**Modified:** `src/App.tsx` (routes; 10 demo imports collapse into the registry; commercial-cleaning route removed), `src/components/AutomatedWorkflows.tsx` (+`.css`) (cards from data; three sections extracted out), `src/demos/shared/DemoShell.tsx` (+`.css`) (`backTo` prop), the 9 demo entry components (pass `backTo`), `netlify.toml` (9 redirects), `CLAUDE.md`.

**Deliberately untouched:** `src/data/services.ts`, everything under `src/demos/commercialCleaning/` (code retained, route retired), all demo internals beyond the `backTo` prop.

---

### Task 1: Workflow data model and index cards driven by it

**Files:**
- Create: `src/data/site.ts`
- Create: `src/data/workflows.ts`
- Modify: `src/components/AutomatedWorkflows.tsx` (delete `examples[]` at lines 31–93 and the icon imports feeding it; rewrite the grid at lines 187–215)
- Modify: `src/components/AutomatedWorkflows.css:262-269` (card `::after` copy)

**Interfaces:**
- Consumes: nothing.
- Produces: `CALENDLY_URL`; `Stat`, `WorkflowCard`, `WorkflowContent`, `Workflow`, `PublishedWorkflow`; `workflows`, `workflowPath(slug)`, `workflowDemoPath(slug)`, `getWorkflow(slug)`.

- [ ] **Step 0: Branch off main**

All 17 tasks land on one branch. The branch is not shippable until Task 17 (see "Design decisions" #2), so it must not be merged or pushed mid-plan.

```bash
git checkout -b feat/workflow-service-pages
```

- [ ] **Step 1: Create the shared Calendly constant**

Create `src/data/site.ts`:

```ts
export const CALENDLY_URL = "https://calendly.com/brian-paradigmshiftdev/30min";
```

- [ ] **Step 2: Create the workflow data module**

Create `src/data/workflows.ts`. The 9 entries carry card-level data only and are all `published: false` — content arrives per-workflow in Tasks 7 and 9–16. Entry order must match today's grid exactly.

```ts
import {
  FaUndo,
  FaCommentDots,
  FaStar,
  FaFileInvoiceDollar,
  FaMoneyBillWave,
  FaUserPlus,
  FaTruck,
  FaChartLine,
  FaSyncAlt,
} from "react-icons/fa";
import type { IconType } from "react-icons";

export interface Stat {
  value: string; // the figure, e.g. a percentage or dollar range
  label: string; // what it measures, in plain language
  source: string; // publication + year, shown on the page
  sourceUrl: string; // required — no stat without a source
}

export interface WorkflowCard {
  slug: string;
  label: string;
  icon: IconType;
  cardSummary: string;
  hasDemo: boolean;
}

export interface WorkflowContent {
  hero: { headline: string; subhead: string };
  stats: Stat[]; // empty ⇒ section omitted
  painPoints: string[];
  mechanism: { title: string; description: string }[];
  faq: { q: string; a: string }[];
}

/**
 * `published: true` requires the page content to exist. An unpublished
 * workflow cannot carry half-written copy, and a published one cannot be
 * missing it.
 */
export type PublishedWorkflow = WorkflowCard &
  WorkflowContent & { published: true };

export type Workflow = (WorkflowCard & { published: false }) | PublishedWorkflow;

export const workflows: Workflow[] = [
  {
    slug: "win-back-campaigns",
    label: "Win-Back Campaigns",
    icon: FaUndo,
    cardSummary: "Re-engage past customers automatically",
    hasDemo: true,
    published: false,
  },
  {
    slug: "missed-call-text-back",
    label: "Missed-Call Text-Back",
    icon: FaCommentDots,
    cardSummary: "Instant reply so leads don't call a competitor",
    hasDemo: true,
    published: false,
  },
  {
    slug: "review-generation",
    label: "Review Generation",
    icon: FaStar,
    cardSummary: "A steady stream of 5-star reviews, hands-off",
    hasDemo: true,
    published: false,
  },
  {
    slug: "automated-quoting",
    label: "Automated Quoting",
    icon: FaFileInvoiceDollar,
    cardSummary: "From intake to a ready-to-send quote",
    hasDemo: true,
    published: false,
  },
  {
    slug: "invoice-reminders",
    label: "Invoice & Payment Reminders",
    icon: FaMoneyBillWave,
    cardSummary: "Get paid without chasing",
    hasDemo: true,
    published: false,
  },
  {
    slug: "new-customer-onboarding",
    label: "New-Customer Onboarding",
    icon: FaUserPlus,
    cardSummary: "Welcome, docs, and scheduling handled",
    hasDemo: true,
    published: false,
  },
  {
    slug: "job-dispatch",
    label: "Job Scheduling & Dispatch",
    icon: FaTruck,
    cardSummary: "Right job, right person, customer notified",
    hasDemo: true,
    published: false,
  },
  {
    slug: "weekly-owner-reports",
    label: "Weekly Owner Reports",
    icon: FaChartLine,
    cardSummary: "The numbers that matter, in your inbox",
    hasDemo: true,
    published: false,
  },
  {
    slug: "tool-sync",
    label: "Tool-to-Tool Sync",
    icon: FaSyncAlt,
    cardSummary: "Stop retyping the same data twice",
    hasDemo: true,
    published: false,
  },
];

export const workflowPath = (slug: string): string =>
  `/services/automated-workflows/${slug}`;

export const workflowDemoPath = (slug: string): string =>
  `${workflowPath(slug)}/demo`;

export const getWorkflow = (slug: string): Workflow | undefined =>
  workflows.find((workflow) => workflow.slug === slug);
```

- [ ] **Step 3: Point the index grid at the data**

In `src/components/AutomatedWorkflows.tsx`, delete the `Example` interface and the `examples[]` array (lines 31–93) and replace the grid body (lines 188–214) with:

```tsx
{workflows.map((workflow) => {
  const Icon = workflow.icon;
  const inner = (
    <>
      <div className="aw-example-icon">
        <Icon />
      </div>
      <h3 className="aw-example-title">{workflow.label}</h3>
      <p className="aw-example-description">{workflow.cardSummary}</p>
    </>
  );
  return workflow.published ? (
    <Link
      key={workflow.slug}
      to={workflowPath(workflow.slug)}
      className="aw-example-card aw-example-card-link"
    >
      {inner}
    </Link>
  ) : (
    <div key={workflow.slug} className="aw-example-card">
      {inner}
    </div>
  );
})}
```

Add the import:

```tsx
import { workflows, workflowPath } from "../data/workflows";
```

- [ ] **Step 4: Remove the icon imports that moved to the data module**

The nine card icons now live in `workflows.ts`. `npm run lint` runs with `--max-warnings 0`, so leaving them imported fails the build.

Also delete the local `CALENDLY_URL` const at line 20 and import the shared one instead, so `src/data/site.ts` has a consumer the moment it is created. The hero button at line 145 keeps using the name, now imported.

The import block at lines 1–20 must end up as exactly:

```tsx
import { FaCalendarAlt, FaPhone, FaCogs, FaRocket } from "react-icons/fa";
import type { IconType } from "react-icons";
import { Link } from "react-router-dom";
import { CALENDLY_URL } from "../data/site";
import { workflows, workflowPath } from "../data/workflows";
import "./AutomatedWorkflows.css";
```

`IconType` is still used by the `Step` interface at line 95. `Link` is still used by the grid. `FaCalendarAlt` is still used by the hero button.

- [ ] **Step 5: Fix the card call-to-action copy**

Cards now lead to a service page, not straight into a demo. In `src/components/AutomatedWorkflows.css:262-269`:

```css
.aw-example-card-link::after {
  content: "See how it works →";
  display: block;
  margin-top: var(--spacing-sm);
  color: var(--color-primary);
  font-weight: 600;
  font-size: 0.9rem;
}
```

- [ ] **Step 6: Verify**

Run: `npm run lint && npm run build`
Expected: both exit 0, no warnings.

Run: `npm run dev`, open <http://localhost:5173/services/automated-workflows>
Expected: the examples grid still shows the same 9 cards with the same titles and blurbs, in the same order. Every card is now a plain card with no "Try the demo →" line and no hover link — correct, because nothing is published yet.

- [ ] **Step 7: Commit**

```bash
git add src/data/site.ts src/data/workflows.ts src/components/AutomatedWorkflows.tsx src/components/AutomatedWorkflows.css
git commit -m "feat: drive automated-workflows cards from a workflows data module"
```

---

### Task 2: Demo registry and nested demo route

**Files:**
- Create: `src/demos/registry.ts`
- Create: `src/components/workflows/WorkflowDemo.tsx`
- Modify: `src/App.tsx` (whole file)

**Interfaces:**
- Consumes: `workflows.ts` path helpers (Task 1).
- Produces: `demoRegistry` — `Record<string, LazyExoticComponent<ComponentType>>` keyed by workflow slug; the route `/services/automated-workflows/:slug/demo`.

- [ ] **Step 1: Create the registry**

Create `src/demos/registry.ts`. Keys are the Task 1 slugs; note that several demo directory names do not match their slug (`newCustomerOnboarding/OnboardingDemo`, `jobDispatch/JobDispatchDemo`, `weeklyReports/WeeklyReportsDemo`, `winBackCampaign/WinBackDemo`). `React.lazy` requires a default export — every demo entry component has one.

```ts
import { lazy } from "react";
import type { ComponentType, LazyExoticComponent } from "react";

export const demoRegistry: Record<
  string,
  LazyExoticComponent<ComponentType>
> = {
  "win-back-campaigns": lazy(() => import("./winBackCampaign/WinBackDemo")),
  "missed-call-text-back": lazy(
    () => import("./missedCallTextBack/MissedCallTextBackDemo"),
  ),
  "review-generation": lazy(
    () => import("./reviewGeneration/ReviewGenerationDemo"),
  ),
  "automated-quoting": lazy(
    () => import("./automatedQuoting/AutomatedQuotingDemo"),
  ),
  "invoice-reminders": lazy(
    () => import("./invoiceReminders/InvoiceRemindersDemo"),
  ),
  "new-customer-onboarding": lazy(
    () => import("./newCustomerOnboarding/OnboardingDemo"),
  ),
  "job-dispatch": lazy(() => import("./jobDispatch/JobDispatchDemo")),
  "weekly-owner-reports": lazy(() => import("./weeklyReports/WeeklyReportsDemo")),
  "tool-sync": lazy(() => import("./toolSync/ToolSyncDemo")),
};
```

- [ ] **Step 2: Create the demo route component**

Create `src/components/workflows/WorkflowDemo.tsx`. This renders outside `Layout`, so it must not assume a header exists. Resolution is gated on the registry, not on `published` — so the Task 3 redirects work immediately, before any page ships.

```tsx
import { Suspense } from "react";
import { Navigate, useParams } from "react-router-dom";
import { demoRegistry } from "../../demos/registry";

const WorkflowDemo = () => {
  const { slug } = useParams<{ slug: string }>();
  const Demo = slug ? demoRegistry[slug] : undefined;

  if (!Demo) {
    return <Navigate to="/services/automated-workflows" replace />;
  }

  return (
    <Suspense fallback={null}>
      <Demo />
    </Suspense>
  );
};

export default WorkflowDemo;
```

- [ ] **Step 3: Rewrite the router**

Replace all of `src/App.tsx`. The ten demo imports collapse into the registry; the `/demos/commercial-cleaning` route is retired (its code under `src/demos/commercialCleaning/` stays in the repo untouched — restoring it is a one-line change). No redirect is added for it.

```tsx
import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import LandingPage from "./components/LandingPage";
import TechnicalConsulting from "./components/TechnicalConsulting";
import AutomatedWorkflows from "./components/AutomatedWorkflows";
import WorkflowDemo from "./components/workflows/WorkflowDemo";

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<LandingPage />} />
        <Route
          path="/services/technical-consulting"
          element={<TechnicalConsulting />}
        />
        <Route
          path="/services/automated-workflows"
          element={<AutomatedWorkflows />}
        />
      </Route>
      <Route
        path="/services/automated-workflows/:slug/demo"
        element={<WorkflowDemo />}
      />
    </Routes>
  );
}

export default App;
```

The `/services/automated-workflows/:slug` page route is deliberately absent until Task 7, which is the first task with a page to render.

- [ ] **Step 4: Verify**

Run: `npm run lint && npm run build`
Expected: both exit 0. The build output should now show separate demo chunks rather than one large bundle.

Run: `npm run dev` and open each of the nine URLs:

```
/services/automated-workflows/win-back-campaigns/demo
/services/automated-workflows/missed-call-text-back/demo
/services/automated-workflows/review-generation/demo
/services/automated-workflows/automated-quoting/demo
/services/automated-workflows/invoice-reminders/demo
/services/automated-workflows/new-customer-onboarding/demo
/services/automated-workflows/job-dispatch/demo
/services/automated-workflows/weekly-owner-reports/demo
/services/automated-workflows/tool-sync/demo
```

Expected: each loads its demo full-bleed with no site header or footer, and clicking through the steps works.

Open `/services/automated-workflows/not-a-real-slug/demo`
Expected: redirects to `/services/automated-workflows`.

Open `/demos/commercial-cleaning`
Expected: blank — the route no longer exists. This is the intended retirement; Task 3 adds no redirect for it.

- [ ] **Step 5: Commit**

```bash
git add src/demos/registry.ts src/components/workflows/WorkflowDemo.tsx src/App.tsx
git commit -m "feat: nest demos under their service route via a lazy registry"
```

---

### Task 3: Netlify redirects for the nine old demo URLs

**Files:**
- Modify: `netlify.toml` (whole file)

**Interfaces:**
- Consumes: the slug table from Task 1.
- Produces: nothing consumed by later tasks.

- [ ] **Step 1: Add the redirects above the catch-all**

Netlify evaluates redirect rules in file order and stops at the first match. The existing `/*  →  /index.html  200` rule matches everything, so **any rule placed below it is unreachable**. The nine `301`s must come first. Replace all of `netlify.toml`:

```toml
[build]
  command = "npm run build"
  publish = "dist"

# Old demo URLs → their new home under the service route.
# MUST stay above the SPA catch-all: Netlify stops at the first matching rule.
[[redirects]]
  from = "/demos/win-back-campaign"
  to = "/services/automated-workflows/win-back-campaigns/demo"
  status = 301

[[redirects]]
  from = "/demos/missed-call-text-back"
  to = "/services/automated-workflows/missed-call-text-back/demo"
  status = 301

[[redirects]]
  from = "/demos/review-generation"
  to = "/services/automated-workflows/review-generation/demo"
  status = 301

[[redirects]]
  from = "/demos/automated-quoting"
  to = "/services/automated-workflows/automated-quoting/demo"
  status = 301

[[redirects]]
  from = "/demos/invoice-reminders"
  to = "/services/automated-workflows/invoice-reminders/demo"
  status = 301

[[redirects]]
  from = "/demos/onboarding"
  to = "/services/automated-workflows/new-customer-onboarding/demo"
  status = 301

[[redirects]]
  from = "/demos/dispatch"
  to = "/services/automated-workflows/job-dispatch/demo"
  status = 301

[[redirects]]
  from = "/demos/weekly-reports"
  to = "/services/automated-workflows/weekly-owner-reports/demo"
  status = 301

[[redirects]]
  from = "/demos/tool-sync"
  to = "/services/automated-workflows/tool-sync/demo"
  status = 301

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

Note the three `from` paths that differ from their slug: `/demos/onboarding`, `/demos/dispatch`, `/demos/weekly-reports`. And `/demos/win-back-campaign` (singular) → `win-back-campaigns` (plural). Copy these from the spec's table, do not derive them.

- [ ] **Step 2: Verify**

`netlify.toml` has no effect on `npm run dev` or `npm run preview` — these redirects cannot be exercised locally. Verify by inspection:

Run: `grep -n "from\|status" netlify.toml`
Expected: nine `status = 301` lines, all appearing **before** the line containing `status = 200`.

Confirm each `to` target is one of the nine URLs that Task 2's verification proved reachable.

The live check happens on the Netlify deploy preview (Task 17).

- [ ] **Step 3: Commit**

```bash
git add netlify.toml
git commit -m "feat: redirect old /demos/* URLs to their nested service demo routes"
```

---

### Task 4: `backTo` prop on DemoShell, wired into the nine demos

**Files:**
- Modify: `src/demos/shared/DemoShell.tsx`
- Modify: `src/demos/shared/DemoShell.css`
- Modify: the nine demo entry components (paths in Step 3)

**Interfaces:**
- Consumes: `workflowPath` (Task 1).
- Produces: `DemoShellProps.backTo?: string`.

- [ ] **Step 1: Add the prop and the topbar link**

In `src/demos/shared/DemoShell.tsx`, add `Link` to the imports, extend the props, and render the link as the first child of the topbar.

`backTo` is optional so that `src/demos/commercialCleaning/DemoPage.tsx` — retired but still compiled — keeps typechecking without being touched.

The link text is **"← Exit demo"**, not "← Back": the footer nav already has a "← Back" button that steps backward through the demo (`DemoShell.tsx:36`), and two controls reading "← Back" in one view is ambiguous.

Imports become:

```tsx
import { FaCalendarAlt, FaMagic } from "react-icons/fa";
import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { useDemo } from "./DemoController";
import FlowMap from "./FlowMap";
import "./DemoShell.css";
```

Props become:

```tsx
interface DemoShellProps {
  eyebrow: string;
  title: string;
  lede: string;
  backTo?: string;
  renderStage: (stepId: string) => ReactNode;
}
```

The component signature and topbar become:

```tsx
const DemoShell = ({ eyebrow, title, backTo, renderStage }: DemoShellProps) => {
  const { stepId, steps, stepIndex } = useDemo();
  return (
    <main className="demo">
      <header className="demo-topbar">
        {backTo && (
          <Link to={backTo} className="demo-back">
            ← Exit demo
          </Link>
        )}
        <div className="demo-topbar-heading">
          <p className="demo-eyebrow">{eyebrow}</p>
          <h1 className="demo-title">{title}</h1>
        </div>
```

Leave the rest of the file unchanged. (`lede` is declared but not destructured today — that is pre-existing and out of scope.)

- [ ] **Step 2: Style the link**

Append to `src/demos/shared/DemoShell.css`, after the `.demo-cta-icon` rule (line 124):

```css
.demo-back {
  flex: 0 0 auto;
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.35rem 0.7rem;
  border: 1px solid var(--demo-border);
  border-radius: 0.5rem;
  color: var(--demo-muted);
  font-size: 0.8rem;
  font-weight: 600;
  white-space: nowrap;
}

.demo-back:hover {
  border-color: var(--demo-accent);
  color: var(--demo-accent-bright);
}
```

- [ ] **Step 3: Pass `backTo` from each demo**

In each file below, add the import and the prop on its `<DemoShell>`. Change nothing else — demo internals are out of scope.

```tsx
import { workflowPath } from "../../data/workflows";
```

| File | Prop to add |
|---|---|
| `src/demos/winBackCampaign/WinBackDemo.tsx` | `backTo={workflowPath("win-back-campaigns")}` |
| `src/demos/missedCallTextBack/MissedCallTextBackDemo.tsx` | `backTo={workflowPath("missed-call-text-back")}` |
| `src/demos/reviewGeneration/ReviewGenerationDemo.tsx` | `backTo={workflowPath("review-generation")}` |
| `src/demos/automatedQuoting/AutomatedQuotingDemo.tsx` | `backTo={workflowPath("automated-quoting")}` |
| `src/demos/invoiceReminders/InvoiceRemindersDemo.tsx` | `backTo={workflowPath("invoice-reminders")}` |
| `src/demos/newCustomerOnboarding/OnboardingDemo.tsx` | `backTo={workflowPath("new-customer-onboarding")}` |
| `src/demos/jobDispatch/JobDispatchDemo.tsx` | `backTo={workflowPath("job-dispatch")}` |
| `src/demos/weeklyReports/WeeklyReportsDemo.tsx` | `backTo={workflowPath("weekly-owner-reports")}` |
| `src/demos/toolSync/ToolSyncDemo.tsx` | `backTo={workflowPath("tool-sync")}` |

For reference, `MissedCallTextBackDemo.tsx` ends up as:

```tsx
        <DemoShell
          eyebrow="Paradigm Shift — Automation Demo"
          title={`Missed-call text-back for ${business.name}`}
          lede="A click-through of how one missed call becomes a booked job — instant text-back, an AI-qualified SMS thread, and a dispatched tech, all hands-off."
          backTo={workflowPath("missed-call-text-back")}
          renderStage={renderStage}
        />
```

Do **not** add `backTo` to `src/demos/commercialCleaning/DemoPage.tsx` — that route is retired.

- [ ] **Step 4: Verify**

Run: `npm run lint && npm run build`
Expected: both exit 0.

Run: `npm run dev`, open `/services/automated-workflows/missed-call-text-back/demo`
Expected: an "← Exit demo" link sits at the far left of the dark topbar, left of the eyebrow/title block, visually distinct from the footer's "← Back" step button. Clicking it lands on `/services/automated-workflows` — because `missed-call-text-back` is not published yet, `WorkflowPage` does not exist yet, and the route falls through. That is the expected intermediate state; Task 7 makes it land on the page.

Narrow the window to 760px.
Expected: the topbar wraps (it already sets `flex-wrap: wrap` at ≤968px) and the link stays legible and tappable.

Spot-check two more demos for the link's presence.

- [ ] **Step 5: Commit**

```bash
git add src/demos/shared/DemoShell.tsx src/demos/shared/DemoShell.css src/demos/winBackCampaign/WinBackDemo.tsx src/demos/missedCallTextBack/MissedCallTextBackDemo.tsx src/demos/reviewGeneration/ReviewGenerationDemo.tsx src/demos/automatedQuoting/AutomatedQuotingDemo.tsx src/demos/invoiceReminders/InvoiceRemindersDemo.tsx src/demos/newCustomerOnboarding/OnboardingDemo.tsx src/demos/jobDispatch/JobDispatchDemo.tsx src/demos/weeklyReports/WeeklyReportsDemo.tsx src/demos/toolSync/ToolSyncDemo.tsx
git commit -m "feat: give demos a back-link to their service page"
```

---

### Task 5: Extract the three shared sections

**Files:**
- Create: `src/components/workflows/AwHowItWorks.tsx`, `src/components/workflows/AwHowItWorks.css`
- Create: `src/components/workflows/AwWhyWorkWithMe.tsx`, `src/components/workflows/AwWhyWorkWithMe.css`
- Create: `src/components/workflows/AwFinalCta.tsx`, `src/components/workflows/AwFinalCta.css`
- Modify: `src/components/AutomatedWorkflows.tsx` (remove `steps[]`, `reasons[]`, and the three sections)
- Modify: `src/components/AutomatedWorkflows.css` (remove the three moved blocks)

**Interfaces:**
- Consumes: `CALENDLY_URL` (Task 1).
- Produces: default exports `AwHowItWorks`, `AwWhyWorkWithMe`, `AwFinalCta` — all take no props.

This is a pure move. Markup, class names, and copy are unchanged, so the index page must look **byte-identical** afterward. Class names stay `aw-*` so the CSS moves verbatim.

- [ ] **Step 1: Create `AwHowItWorks`**

Create `src/components/workflows/AwHowItWorks.tsx` — the `steps[]` array from `AutomatedWorkflows.tsx:101-120` and the `aw-how` section from `:220-242`, moved as-is:

```tsx
import { FaPhone, FaCogs, FaRocket } from "react-icons/fa";
import type { IconType } from "react-icons";
import "./AwHowItWorks.css";

interface Step {
  icon: IconType;
  title: string;
  description: string;
}

const steps: Step[] = [
  {
    icon: FaPhone,
    title: "Discovery call (free)",
    description:
      "We map where your time and money are leaking to repetitive work, and find the highest-ROI place to start.",
  },
  {
    icon: FaCogs,
    title: "Build",
    description:
      "I design and build the automation around your existing tools. Fixed scope, agreed up front.",
  },
  {
    icon: FaRocket,
    title: "Handoff or hands-off",
    description:
      "You own and run it, or I maintain and improve it over time. Your call.",
  },
];

const AwHowItWorks = () => {
  return (
    <section className="aw-how">
      <div className="container">
        <div className="section-content">
          <h2 className="section-title">How It Works</h2>
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
      </div>
    </section>
  );
};

export default AwHowItWorks;
```

Create `src/components/workflows/AwHowItWorks.css` by **cutting** the `/* 4. How it works */` block (`AutomatedWorkflows.css:134-176`) verbatim — `.aw-how`, `.aw-steps`, `.aw-step`, `.aw-step-number`, `.aw-step-icon`, `.aw-step-content h3`, `.aw-step-content p`.

- [ ] **Step 2: Create `AwWhyWorkWithMe`**

Named `Aw*` to avoid confusion with the existing `src/components/WhyWorkWithMe.tsx`, which is the landing page's section and is unrelated.

Create `src/components/workflows/AwWhyWorkWithMe.tsx` — `reasons[]` from `AutomatedWorkflows.tsx:122-127` and the `aw-why` section from `:244-257`:

```tsx
import "./AwWhyWorkWithMe.css";

const reasons: string[] = [
  "10+ years as a professional software engineer",
  "Real, robust engineering — not brittle no-code that breaks",
  "Built on the tools you already use",
  "Fixed scope, agreed up front — no surprise bills",
];

const AwWhyWorkWithMe = () => {
  return (
    <section className="aw-why">
      <div className="container">
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
      </div>
    </section>
  );
};

export default AwWhyWorkWithMe;
```

Create `src/components/workflows/AwWhyWorkWithMe.css` by cutting the `/* 5. Why me */` block (`AutomatedWorkflows.css:177-207`) verbatim.

- [ ] **Step 3: Create `AwFinalCta`**

Create `src/components/workflows/AwFinalCta.tsx` — the `aw-cta` section from `AutomatedWorkflows.tsx:259-276`, with the local `CALENDLY_URL` const replaced by the shared import:

```tsx
import { FaCalendarAlt } from "react-icons/fa";
import { CALENDLY_URL } from "../../data/site";
import "./AwFinalCta.css";

const AwFinalCta = () => {
  return (
    <section className="aw-cta">
      <div className="container">
        <div className="aw-cta-content">
          <h2 className="aw-cta-title">
            Curious what's automatable in your business?
          </h2>
          <a
            href={CALENDLY_URL}
            className="aw-cta-btn"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaCalendarAlt className="aw-cta-btn-icon" />
            Book a free automation consult →
          </a>
        </div>
      </div>
    </section>
  );
};

export default AwFinalCta;
```

Create `src/components/workflows/AwFinalCta.css` by cutting the `/* 6. CTA */` block (`AutomatedWorkflows.css:209-248`) verbatim, **plus** the `.aw-cta-btn` half of the shared media query at `:250-256`:

```css
@media (max-width: 640px) {
  .aw-cta-btn {
    padding: 1rem 1.75rem;
    font-size: 1.1rem;
  }
}
```

That media query currently targets `.aw-hero-btn, .aw-cta-btn` together. Split it: the `.aw-hero-btn` rule stays in `AutomatedWorkflows.css`, which becomes:

```css
@media (max-width: 640px) {
  .aw-hero-btn {
    padding: 1rem 1.75rem;
    font-size: 1.1rem;
  }
}
```

- [ ] **Step 4: Use the three components on the index page**

In `src/components/AutomatedWorkflows.tsx`, delete the `Step` interface, `steps[]`, `reasons[]`, and the three `<section>` blocks. Replace them with the components. (The local `CALENDLY_URL` const is already gone — Task 1 replaced it with the shared import, which the hero still uses.) The tail of the JSX becomes:

```tsx
      <AwHowItWorks />
      <AwWhyWorkWithMe />
      <AwFinalCta />
    </>
  );
};
```

Imports become exactly:

```tsx
import { FaCalendarAlt } from "react-icons/fa";
import { Link } from "react-router-dom";
import { CALENDLY_URL } from "../data/site";
import { workflows, workflowPath } from "../data/workflows";
import AwHowItWorks from "./workflows/AwHowItWorks";
import AwWhyWorkWithMe from "./workflows/AwWhyWorkWithMe";
import AwFinalCta from "./workflows/AwFinalCta";
import "./AutomatedWorkflows.css";
```

`IconType` is no longer used here (the `Step` interface went with `AwHowItWorks`) — drop it or lint fails. `FaCalendarAlt` is still used by the hero button. The hero keeps using `CALENDLY_URL`, now imported.

- [ ] **Step 5: Verify**

Run: `npm run lint && npm run build`
Expected: both exit 0.

Run: `npm run dev`, open `/services/automated-workflows`
Expected: the page is **visually identical** to before this task — same hero, framing list, 9 cards, "How It Works" with 3 icon steps, "Why work with me" with 4 checkmarks, and the final CTA. If anything shifted, a CSS block was moved incompletely; diff `AutomatedWorkflows.css` against `git show HEAD:src/components/AutomatedWorkflows.css` and confirm every removed rule landed in exactly one new file.

Narrow to 600px.
Expected: the CTA button shrinks to the smaller padding — confirms the split media query still applies.

- [ ] **Step 6: Commit**

```bash
git add src/components/workflows/AwHowItWorks.tsx src/components/workflows/AwHowItWorks.css src/components/workflows/AwWhyWorkWithMe.tsx src/components/workflows/AwWhyWorkWithMe.css src/components/workflows/AwFinalCta.tsx src/components/workflows/AwFinalCta.css src/components/AutomatedWorkflows.tsx src/components/AutomatedWorkflows.css
git commit -m "refactor: extract shared automated-workflows sections for reuse on service pages"
```

---

### Task 6: Stats research — Missed-Call Text-Back

**Files:**
- Create: `docs/superpowers/research/2026-07-15-missed-call-text-back-stats.md`

**Interfaces:**
- Consumes: nothing.
- Produces: a vetted list of `Stat` values for Task 7 to paste into `workflows.ts`.

This is a separate task from the page build because it carries its own reviewer gate — "are these figures real, current, and citable?" is a different question from "does the page render?", and a wrong answer to the first one is a liability on a live commercial site.

**No figures appear in this plan.** Anything written here would be the most likely thing to get pasted in unverified.

- [ ] **Step 1: Research**

Use `WebSearch` and `WebFetch`. The spec identifies this workflow's evidence base as **lead response-time studies**. Find 2–4 figures that a skeptical reader could check, covering some of:

- how quickly inbound leads must be contacted before qualification/contact rates collapse
- what share of callers who reach voicemail leave one, or call a competitor instead
- how consumers rank text vs. voice for business contact

**Acceptance criteria for every figure — all four must hold:**

1. **Primary or near-primary.** The study, its publisher, or a reputable outlet reporting it directly. Not an agency blog citing an agency blog. If a widely-repeated statistic can only be traced to marketing pages, drop it — no matter how well-known it is.
2. **Attributable and dated.** You can name the publication and year. `source` reads like `"Harvard Business Review, 2011"`.
3. **Live URL.** `WebFetch` the `sourceUrl` and confirm it currently resolves and still contains the claim.
4. **Says what you claim it says.** Read the surrounding context. Check the population and conditions — a figure about B2B web-form leads is not a figure about a plumber's missed phone call, and must not be labeled as one.

If a figure fails any criterion, discard it. Two solid stats beat four shaky ones. If fewer than two survive, this workflow ships `stats: []` — that is a legitimate outcome, not a failure.

- [ ] **Step 2: Record the findings**

Create `docs/superpowers/research/2026-07-15-missed-call-text-back-stats.md`:

```markdown
# Missed-Call Text-Back — Stats Research

**Date:** 2026-07-15
**For:** `/services/automated-workflows/missed-call-text-back`

## Accepted

### 1. <the claim in one line>
- **value:** <the figure, exactly as it will appear on the page>
- **label:** <what it measures, plain language, no spin>
- **source:** <Publication, Year>
- **sourceUrl:** <url>
- **Verified:** URL fetched <date>, claim present at <where on the page>
- **Population/conditions:** <who was studied, under what conditions>
- **Why it applies here:** <one line, or "weak — consider dropping">

<repeat per accepted stat>

## Rejected

| Figure | Where it came from | Why rejected |
|---|---|---|
| <figure> | <url> | <untraceable / undated / stale link / population mismatch> |
```

The "Rejected" table matters as much as the accepted list — it is what stops the same unusable statistic from being re-researched in Tasks 9–16, and it shows the gate was actually applied.

- [ ] **Step 3: Verify**

Re-`WebFetch` each accepted `sourceUrl` one final time. Confirm it resolves and the claim is present.

Read the "Population/conditions" line for each accepted stat and ask directly: would a skeptical HVAC owner reading this page consider it honest? If not, reject it now.

- [ ] **Step 4: Export the note**

Per Brian's global instructions, copy to the vault:

```bash
mkdir -p "/Users/brian/Documents/dev-vault/projects/paradigm/consulting-website/docs/superpowers/research"
cp docs/superpowers/research/2026-07-15-missed-call-text-back-stats.md "/Users/brian/Documents/dev-vault/projects/paradigm/consulting-website/docs/superpowers/research/"
```

- [ ] **Step 5: Commit**

```bash
git add docs/superpowers/research/2026-07-15-missed-call-text-back-stats.md
git commit -m "docs: cited stats research for missed-call text-back"
```

**Gate:** Brian has delegated stat sign-off — apply the four acceptance criteria and publish what survives, without stopping. The criteria are the gate now, so enforce them literally rather than generously: when a figure is arguable, reject it. These are claims his business makes in public, and `stats: []` is always an acceptable answer. Report every accepted and rejected figure in the task summary so he can veto after the fact.

---

### Task 7: The page template, built around Missed-Call Text-Back

**Files:**
- Create: `src/components/workflows/WorkflowHero.tsx`, `WorkflowStats.tsx`, `WorkflowPains.tsx`, `WorkflowMechanism.tsx`, `WorkflowDemoCta.tsx`, `WorkflowFaq.tsx`, `WorkflowPage.tsx`, `WorkflowPage.css` (all under `src/components/workflows/`)
- Modify: `src/data/workflows.ts` (the `missed-call-text-back` entry)
- Modify: `src/App.tsx` (add the `:slug` route)

**Interfaces:**
- Consumes: `PublishedWorkflow`, `Stat`, `getWorkflow`, `workflowDemoPath` (Task 1); `CALENDLY_URL` (Task 1); `AwHowItWorks`, `AwWhyWorkWithMe`, `AwFinalCta` (Task 5); the Task 6 stats.
- Produces: the `WorkflowPage` template and its six per-service section components, each taking the workflow or its relevant slice as its only input. Tasks 9–16 add data only and touch none of these files.

- [ ] **Step 1: Write the section components**

All six live in `src/components/workflows/`. Styles are `wf-`-prefixed and share one `WorkflowPage.css` — following the demos' precedent, where one `missedcall.css` covers six step components.

`WorkflowHero.tsx`:

```tsx
import { FaCalendarAlt } from "react-icons/fa";
import { CALENDLY_URL } from "../../data/site";

interface WorkflowHeroProps {
  headline: string;
  subhead: string;
}

const WorkflowHero = ({ headline, subhead }: WorkflowHeroProps) => {
  return (
    <section className="wf-hero">
      <div className="container">
        <div className="wf-hero-content">
          <h1 className="wf-hero-title">{headline}</h1>
          <p className="wf-hero-subtitle">{subhead}</p>
          <a
            href={CALENDLY_URL}
            className="wf-hero-btn"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaCalendarAlt className="wf-hero-btn-icon" />
            Book a free automation consult →
          </a>
        </div>
      </div>
    </section>
  );
};

export default WorkflowHero;
```

`WorkflowStats.tsx` — returns `null` on an empty array, which is how the spec's "omitted when `stats` is empty" is enforced. Every figure renders its source as a live link; a stat is never shown bare.

```tsx
import type { Stat } from "../../data/workflows";

interface WorkflowStatsProps {
  stats: Stat[];
}

const WorkflowStats = ({ stats }: WorkflowStatsProps) => {
  if (stats.length === 0) {
    return null;
  }

  return (
    <section className="wf-stats">
      <div className="container">
        <div className="section-content">
          <h2 className="section-title">What it costs to leave this manual</h2>
          <div className="wf-stats-grid">
            {stats.map((stat) => (
              <div key={stat.label} className="wf-stat">
                <p className="wf-stat-value">{stat.value}</p>
                <p className="wf-stat-label">{stat.label}</p>
                <a
                  href={stat.sourceUrl}
                  className="wf-stat-source"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {stat.source}
                </a>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default WorkflowStats;
```

`WorkflowPains.tsx`:

```tsx
interface WorkflowPainsProps {
  painPoints: string[];
}

const WorkflowPains = ({ painPoints }: WorkflowPainsProps) => {
  return (
    <section className="wf-pains">
      <div className="container">
        <div className="section-content">
          <h2 className="section-title">Sound familiar?</h2>
          <ul className="wf-pains-list">
            {painPoints.map((pain) => (
              <li key={pain} className="wf-pains-item">
                {pain}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
};

export default WorkflowPains;
```

`WorkflowMechanism.tsx` — numbered because the mechanism is a sequence:

```tsx
interface WorkflowMechanismProps {
  mechanism: { title: string; description: string }[];
}

const WorkflowMechanism = ({ mechanism }: WorkflowMechanismProps) => {
  return (
    <section className="wf-mechanism">
      <div className="container">
        <div className="section-content">
          <h2 className="section-title">How it works</h2>
          <ol className="wf-mechanism-list">
            {mechanism.map((item, index) => (
              <li key={item.title} className="wf-mechanism-item">
                <span className="wf-mechanism-number">{index + 1}</span>
                <div className="wf-mechanism-body">
                  <h3 className="wf-mechanism-title">{item.title}</h3>
                  <p className="wf-mechanism-description">{item.description}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
};

export default WorkflowMechanism;
```

`WorkflowDemoCta.tsx`:

```tsx
import { FaPlay } from "react-icons/fa";
import { Link } from "react-router-dom";
import { workflowDemoPath } from "../../data/workflows";

interface WorkflowDemoCtaProps {
  slug: string;
  label: string;
}

const WorkflowDemoCta = ({ slug, label }: WorkflowDemoCtaProps) => {
  return (
    <section className="wf-demo">
      <div className="container">
        <div className="wf-demo-content">
          <h2 className="section-title">See it run</h2>
          <p className="wf-demo-lede">
            A click-through of {label.toLowerCase()} on a made-up business, so
            you can see exactly what happens at each step before you commit to
            anything.
          </p>
          <Link to={workflowDemoPath(slug)} className="wf-demo-btn">
            <FaPlay className="wf-demo-btn-icon" />
            Try the interactive demo →
          </Link>
        </div>
      </div>
    </section>
  );
};

export default WorkflowDemoCta;
```

`WorkflowFaq.tsx` — native `<details>`, so it is accessible and keyboard-operable with no JS:

```tsx
interface WorkflowFaqProps {
  faq: { q: string; a: string }[];
}

const WorkflowFaq = ({ faq }: WorkflowFaqProps) => {
  return (
    <section className="wf-faq">
      <div className="container">
        <div className="section-content">
          <h2 className="section-title">Questions</h2>
          <div className="wf-faq-list">
            {faq.map((item) => (
              <details key={item.q} className="wf-faq-item">
                <summary className="wf-faq-question">{item.q}</summary>
                <p className="wf-faq-answer">{item.a}</p>
              </details>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default WorkflowFaq;
```

- [ ] **Step 2: Write the page template**

Create `src/components/workflows/WorkflowPage.tsx`. The `!workflow.published` guard narrows `Workflow` to `PublishedWorkflow`, so the content fields below are typed without a cast — that is the discriminated union paying for itself.

```tsx
import { Navigate, useParams } from "react-router-dom";
import { getWorkflow } from "../../data/workflows";
import WorkflowHero from "./WorkflowHero";
import WorkflowStats from "./WorkflowStats";
import WorkflowPains from "./WorkflowPains";
import WorkflowMechanism from "./WorkflowMechanism";
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

  return (
    <>
      <WorkflowHero
        headline={workflow.hero.headline}
        subhead={workflow.hero.subhead}
      />
      <WorkflowStats stats={workflow.stats} />
      <WorkflowPains painPoints={workflow.painPoints} />
      <WorkflowMechanism mechanism={workflow.mechanism} />
      {workflow.hasDemo && (
        <WorkflowDemoCta slug={workflow.slug} label={workflow.label} />
      )}
      <AwWhyWorkWithMe />
      <AwHowItWorks />
      <WorkflowFaq faq={workflow.faq} />
      <AwFinalCta />
    </>
  );
};

export default WorkflowPage;
```

Section order matches the spec's table: hero, stats, pains, mechanism, demo, why (6), how (7), FAQ (8), CTA (9).

- [ ] **Step 3: Write the page styles**

Create `src/components/workflows/WorkflowPage.css`. Sections alternate `--color-bg` / `--color-bg-light` the way the index page does. Uses only the existing custom properties from `src/index.css` — no new colors.

```css
/* 1. Hero */
.wf-hero {
  background: var(--hero-bg);
  padding: var(--spacing-xl) 0;
  text-align: center;
}

.wf-hero-content {
  max-width: 800px;
  margin: 0 auto;
}

.wf-hero-title {
  margin-bottom: var(--spacing-md);
}

.wf-hero-subtitle {
  color: var(--color-text-light);
  font-size: clamp(1.125rem, 2.5vw, 1.375rem);
  margin-bottom: var(--spacing-lg);
}

.wf-hero-btn,
.wf-demo-btn {
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-xs);
  background: var(--gradient-accent);
  color: var(--btn-ink);
  padding: 1.25rem 2.5rem;
  border-radius: 0.5rem;
  font-size: 1.25rem;
  font-weight: 700;
  box-shadow: 0 6px 20px -6px var(--color-primary);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.wf-hero-btn:hover,
.wf-demo-btn:hover {
  filter: brightness(1.08);
  color: var(--btn-ink);
  transform: translateY(-2px);
  box-shadow: 0 10px 28px -6px var(--color-primary);
}

.wf-hero-btn-icon,
.wf-demo-btn-icon {
  font-size: 1.125rem;
}

/* 2. Stats */
.wf-stats {
  padding: var(--spacing-xl) 0;
  background: var(--color-bg-light);
}

.wf-stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: var(--spacing-md);
  max-width: 1000px;
  margin: var(--spacing-lg) auto 0;
}

.wf-stat {
  padding: var(--spacing-md);
  border: 1px solid var(--color-border);
  border-radius: 0.75rem;
  background: var(--color-bg);
  text-align: left;
}

.wf-stat-value {
  font-size: clamp(2rem, 5vw, 2.75rem);
  font-weight: 700;
  line-height: 1.1;
  color: var(--color-primary);
  margin-bottom: var(--spacing-xs);
}

.wf-stat-label {
  color: var(--color-text);
  margin-bottom: var(--spacing-sm);
}

.wf-stat-source {
  font-size: 0.8rem;
  color: var(--color-text-light);
  text-decoration: underline;
}

.wf-stat-source:hover {
  color: var(--color-primary);
}

/* 3. Pains */
.wf-pains {
  padding: var(--spacing-xl) 0;
  background: var(--color-bg);
}

.wf-pains-list {
  list-style: none;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: var(--spacing-sm);
  max-width: 800px;
  margin: var(--spacing-lg) auto 0;
  text-align: left;
}

.wf-pains-item {
  position: relative;
  padding-left: 1.75rem;
  color: var(--color-text-light);
  font-size: clamp(1rem, 2vw, 1.125rem);
}

.wf-pains-item::before {
  content: "→";
  position: absolute;
  left: 0;
  color: var(--color-primary);
  font-weight: 700;
}

/* 4. Mechanism */
.wf-mechanism {
  padding: var(--spacing-xl) 0;
  background: var(--color-bg-light);
}

.wf-mechanism-list {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
  max-width: 800px;
  margin: var(--spacing-lg) auto 0;
  text-align: left;
}

.wf-mechanism-item {
  display: flex;
  gap: var(--spacing-sm);
  align-items: flex-start;
}

.wf-mechanism-number {
  flex: 0 0 auto;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 50%;
  background: color-mix(in srgb, var(--color-primary) 16%, transparent);
  border: 1px solid var(--color-border);
  color: var(--color-primary);
  font-weight: 700;
}

.wf-mechanism-title {
  font-size: clamp(1.1rem, 2vw, 1.35rem);
  margin-bottom: var(--spacing-xs);
}

.wf-mechanism-description {
  margin: 0;
}

/* 5. Demo */
.wf-demo {
  padding: var(--spacing-xl) 0;
  background: var(--color-bg);
  text-align: center;
}

.wf-demo-content {
  max-width: 700px;
  margin: 0 auto;
}

.wf-demo-lede {
  margin: var(--spacing-sm) 0 var(--spacing-lg);
}

/* 8. FAQ */
.wf-faq {
  padding: var(--spacing-xl) 0;
  background: var(--color-bg-light);
}

.wf-faq-list {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
  max-width: 800px;
  margin: var(--spacing-lg) auto 0;
  text-align: left;
}

.wf-faq-item {
  border: 1px solid var(--color-border);
  border-radius: 0.75rem;
  background: var(--color-bg);
  padding: var(--spacing-sm) var(--spacing-md);
}

.wf-faq-question {
  cursor: pointer;
  font-weight: 600;
  color: var(--color-text);
  font-size: clamp(1rem, 2vw, 1.125rem);
  list-style: none;
}

.wf-faq-question::marker,
.wf-faq-question::-webkit-details-marker {
  display: none;
}

.wf-faq-question::after {
  content: "+";
  float: right;
  color: var(--color-primary);
  font-weight: 700;
}

.wf-faq-item[open] .wf-faq-question::after {
  content: "−";
}

.wf-faq-answer {
  margin-top: var(--spacing-sm);
}

@media (max-width: 640px) {
  .wf-hero-btn,
  .wf-demo-btn {
    padding: 1rem 1.75rem;
    font-size: 1.1rem;
  }
}
```

- [ ] **Step 4: Add the page route**

In `src/App.tsx`, import `WorkflowPage` and add its route **inside** the `Layout` route, after the index route. Path nesting is independent of layout nesting, so the demo route stays where it is, outside `Layout`:

```tsx
import WorkflowPage from "./components/workflows/WorkflowPage";
```

```tsx
        <Route
          path="/services/automated-workflows"
          element={<AutomatedWorkflows />}
        />
        <Route
          path="/services/automated-workflows/:slug"
          element={<WorkflowPage />}
        />
      </Route>
      <Route
        path="/services/automated-workflows/:slug/demo"
        element={<WorkflowDemo />}
      />
```

- [ ] **Step 5: Publish the Missed-Call Text-Back content**

In `src/data/workflows.ts`, replace the `missed-call-text-back` entry. The copy below is a **draft for Brian's edit**, not a final claim.

The `mechanism` mirrors that workflow's demo steps (`src/demos/missedCallTextBack/steps.ts`: missed-call → text-back → conversation → book → owner-alert → results), so the page and the demo tell the same story. This mirroring rule is what Tasks 9–16 reuse.

`stats` takes the **accepted stats from Task 6, and only those**. If fewer than two survived, write `stats: []` — the section then omits itself. Do not fill this from memory, from this plan, or from a search you didn't run.

```ts
  {
    slug: "missed-call-text-back",
    label: "Missed-Call Text-Back",
    icon: FaCommentDots,
    cardSummary: "Instant reply so leads don't call a competitor",
    hasDemo: true,
    published: true,
    hero: {
      headline: "Every missed call is a customer calling someone else",
      subhead:
        "When your phone rings and nobody picks up, most callers don't leave a voicemail — they dial the next company on the list. This texts them back in seconds, answers their questions, and books the job while you're still up a ladder.",
    },
    stats: [], // ← replace with the accepted stats from Task 6, or leave empty
    painPoints: [
      "You're on a job, the phone rings, and there's nobody in the office to answer it.",
      "Voicemails pile up until the evening — by then the caller has booked someone else.",
      "You call back the next morning and hear \"we already went with another company.\"",
      "You have no idea how many calls you missed last week, or what they were worth.",
    ],
    mechanism: [
      {
        title: "The call comes in — and goes unanswered",
        description:
          "The automation watches your business line. Nobody has to remember to do anything; the missed call itself is the trigger.",
      },
      {
        title: "A text goes out in seconds",
        description:
          "The caller gets a real reply while your business is still the one they're thinking about — not a voicemail greeting promising you'll call back.",
      },
      {
        title: "The conversation qualifies itself",
        description:
          "An AI-assisted text thread asks what they need, where they are, and how urgent it is — in your voice, using your service area and your pricing rules.",
      },
      {
        title: "The job gets booked",
        description:
          "Qualified leads land on the calendar against your real availability. You get the details, not the back-and-forth.",
      },
      {
        title: "You see what it caught",
        description:
          "Every missed call, reply, and booking is logged, so you can see what the automation recovered instead of guessing.",
      },
    ],
    faq: [
      {
        q: "Will customers know they're texting a robot?",
        a: "The thread is written in your voice, and it never pretends to be a person sitting in your office. Most callers just want a fast, accurate answer — that's what they get. Anything it can't handle cleanly gets handed to you with the whole conversation attached.",
      },
      {
        q: "Does this replace my answering service?",
        a: "It doesn't have to. Plenty of businesses run both: the text-back catches the callers who'd never leave a voicemail, and the answering service handles the ones who want a person. If you'd rather it replace one, we can scope that.",
      },
      {
        q: "What if I'd rather call people back myself?",
        a: "Then it texts them to say you'll call right back, and alerts you with the number and whatever it already knows about the job. The point is that the caller hears from you in seconds — not that a machine has to handle it.",
      },
      {
        q: "Do I need to change my phone system?",
        a: "Almost never. It works with the number you already publish and sits alongside your existing setup rather than replacing it.",
      },
      {
        q: "How long does it take to build?",
        a: "This is usually the fastest one to stand up — typically a couple of weeks from the discovery call to live, depending on how much qualification logic you want in the thread.",
      },
    ],
  },
```

- [ ] **Step 6: Verify**

Run: `npm run lint && npm run build`
Expected: both exit 0.

Run: `npm run dev`, open `/services/automated-workflows`
Expected: the Missed-Call Text-Back card is now the only linked card, showing "See how it works →". Click it.

On `/services/automated-workflows/missed-call-text-back`, expected:
- site header and footer are present (it renders inside `Layout`)
- sections in order: hero → stats (only if Task 6 produced stats) → "Sound familiar?" → "How it works" → "See it run" → "Why work with me" → "How It Works" → "Questions" → final CTA
- every stat shows a source that links out and resolves
- the FAQ `<details>` open and close on click and on Enter when focused
- both Calendly buttons open the booking page in a new tab

Click "Try the interactive demo →".
Expected: lands on `/services/automated-workflows/missed-call-text-back/demo`, full-bleed with no site header. Click "← Exit demo" — expected: back on the service page (this is the link that dead-ended at the index in Task 4).

Open `/services/automated-workflows/win-back-campaigns` (not yet published).
Expected: redirects to `/services/automated-workflows`.

Open `/services/automated-workflows/not-a-real-slug`.
Expected: redirects to `/services/automated-workflows`.

Narrow to 375px.
Expected: no horizontal scroll; stats/pains grids collapse to one column; buttons stay tappable.

- [ ] **Step 7: Commit**

```bash
git add src/components/workflows/ src/data/workflows.ts src/App.tsx
git commit -m "feat: add the workflow service page template with missed-call text-back"
```

---

### Task 8: Owner review checkpoint

**This is a stop, not a code task.** The spec's build order puts a review here on purpose: Task 7 defines the template, the voice, and the evidence bar that the remaining eight pages copy. Fixing those now costs one page; fixing them after Task 16 costs nine.

- [ ] **Step 1: Present the page to Brian**

Give him the running URL (`/services/automated-workflows/missed-call-text-back`) and ask specifically for:

1. **The stats** — are these figures ones he's willing to stand behind publicly?
2. **The voice** — does the copy sound like him, or like a marketer?
3. **The section order and headings** — including the "Design decisions this plan makes beyond the spec" call about keeping "Why work with me" and "How It Works" verbatim rather than the spec table's "Built by an engineer, not a reseller" / "How we'd work together".
4. **The mechanism-mirrors-the-demo rule** — Tasks 9–16 all follow it.

- [ ] **Step 2: Fold his edits back into Task 7's files before continuing**

Any change to structure, headings, or CSS lands in the shared components/CSS here, where it is one edit. Do not start Task 9 until this is settled.

---

### Tasks 9–16: The remaining eight workflows

**Each task is one workflow.** They are fully independent — each touches exactly one entry in `src/data/workflows.ts` plus one new research note, and no shared files. That makes them a clean fan-out for `superpowers:dispatching-parallel-agents`, with one caveat: `workflows.ts` is a shared file, so parallel agents will conflict on it. Either run them sequentially, or have each agent write only its research note and apply the nine data entries yourself.

| Task | Workflow | Slug | Demo steps to mirror (`src/demos/<dir>/steps.ts`) |
|---|---|---|---|
| 9 | Win-Back Campaigns | `win-back-campaigns` | `winBackCampaign` |
| 10 | Review Generation | `review-generation` | `reviewGeneration` |
| 11 | Automated Quoting | `automated-quoting` | `automatedQuoting` |
| 12 | Invoice & Payment Reminders | `invoice-reminders` | `invoiceReminders` |
| 13 | New-Customer Onboarding | `new-customer-onboarding` | `newCustomerOnboarding` |
| 14 | Job Scheduling & Dispatch | `job-dispatch` | `jobDispatch` |
| 15 | Weekly Owner Reports | `weekly-owner-reports` | `weeklyReports` |
| 16 | Tool-to-Tool Sync | `tool-sync` | `toolSync` |

**Every one of these tasks follows the same five steps:**

- [ ] **Step 1: Research the stats**

Follow **Task 6 Step 1 verbatim** — same four acceptance criteria (primary/near-primary, attributable and dated, live URL confirmed by `WebFetch`, says what you claim under a matching population). Record findings in `docs/superpowers/research/2026-07-15-<slug>-stats.md` using Task 6 Step 2's template, including the "Rejected" table.

What the spec says about the evidence base for each:

- **Review Generation** — well documented: review volume/recency effects on conversion and local search. Expect to find usable figures.
- **Invoice & Payment Reminders** — well documented: days-sales-outstanding and late-payment figures for small businesses. Expect to find usable figures.
- **Win-Back Campaigns** — likely findable: cost of retention vs. acquisition, repeat-customer value. Hold the line on population match; most such figures come from e-commerce and may not transfer to a trades business. Say so in the note if they don't.
- **Automated Quoting, New-Customer Onboarding, Job Scheduling & Dispatch** — uncertain. Research honestly and accept the result.
- **Tool-to-Tool Sync, Weekly Owner Reports** — the spec's expectation is that **nothing defensible exists**. These very likely ship `stats: []`. Do the search, but returning empty here is the anticipated correct outcome, not a failed task. Do not go hunting for a vendor blog to fill the gap.

A workflow's stats section is cut, never padded. Fewer than two surviving figures ⇒ `stats: []`.

- [ ] **Step 2: Draft the content**

Edit **only** this workflow's entry in `src/data/workflows.ts`. Flip `published: false` to `published: true` and add the five content fields. TypeScript will not let you publish with a field missing — that is the discriminated union doing its job.

Shape and length, matching Task 7's missed-call entry:
- `hero.headline` — one line naming the cost of the status quo, not the feature. Not a slogan.
- `hero.subhead` — 2–3 sentences: what goes wrong today, then what the automation does about it.
- `painPoints` — 4 bullets, each a concrete scene an owner recognizes, written in second person.
- `mechanism` — one entry per meaningful step in that workflow's `steps.ts`, **in the demo's order**, so the page and the demo tell the same story. Titles are plain-language, not the demo's internal step labels. Drop the demo's `results` step if it doesn't earn a mechanism entry, or fold it into a final "you see what it caught"-style item.
- `faq` — 4–5 questions. At least one must be a genuine objection, not a softball. Answers concede real limits rather than dodging.

Voice: plainspoken, anti-hype, matches "Real, robust engineering — not brittle no-code that breaks". No superlatives, no "revolutionize", no invented customer outcomes, no implied guarantees. Never state or imply a price.

- [ ] **Step 3: Verify**

Run: `npm run lint && npm run build`
Expected: both exit 0.

Run: `npm run dev`, open `/services/automated-workflows/<slug>`
Expected: all sections render; the stats section is **absent entirely** if `stats: []`, with no empty heading or gap left behind; the demo CTA reaches this workflow's demo; "← Exit demo" returns to this page; the card on the index now links here.

Narrow to 375px. Expected: no horizontal scroll.

If a section looks wrong, fix it in the shared component/CSS — never by bending this workflow's data.

- [ ] **Step 4: Export the research note**

```bash
cp docs/superpowers/research/2026-07-15-<slug>-stats.md "/Users/brian/Documents/dev-vault/projects/paradigm/consulting-website/docs/superpowers/research/"
```

- [ ] **Step 5: Commit**

```bash
git add src/data/workflows.ts docs/superpowers/research/2026-07-15-<slug>-stats.md
git commit -m "feat: add the <label> service page"
```

---

### Task 17: Documentation and full-surface verification

**Files:**
- Modify: `CLAUDE.md` (lines 31–41)

**Interfaces:**
- Consumes: everything above.
- Produces: nothing.

- [ ] **Step 1: Fix the Content Reference path**

`CLAUDE.md` points at `/Users/brian/Documents/dev-vault/PDS/Consulting/`, which **does not exist** (verified). The real path is `/Users/brian/Documents/dev-vault/projects/paradigm/Consulting/` (verified to exist). Update the "Content Reference" section at the end of the file to:

```markdown
## Content Reference
Consulting offer details, pricing, and copy are documented in the Obsidian vault at:
`/Users/brian/Documents/dev-vault/projects/paradigm/Consulting/`
```

- [ ] **Step 2: Update the project structure block**

In the `## Project Structure` fenced block, replace the `src/demos/commercialCleaning/` line with:

```
src/data/
  services.ts       # Two top-level service lines
  workflows.ts      # The 9 automated workflows — source of truth for cards and pages
src/components/workflows/  # WorkflowPage template + its sections + shared aw-* sections
src/demos/          # One directory per automation demo; registry.ts maps slug → lazy component
```

- [ ] **Step 3: Update the routing description**

Replace the `- **Routing**` bullet with:

```markdown
- **Routing** — `react-router-dom` v6. `/` → landing page (`components/LandingPage.tsx`); `/services/:slug` → the two service lines; `/services/automated-workflows/:slug` → per-workflow service page (`components/workflows/WorkflowPage.tsx`, inside `Layout`); `/services/automated-workflows/:slug/demo` → that workflow's interactive demo (full-bleed, outside `Layout`, lazily resolved via `src/demos/registry.ts`). Old `/demos/*` URLs 301 to the nested demo routes — those rules must stay above the SPA catch-all in `netlify.toml`, which Netlify evaluates in file order. `src/demos/commercialCleaning/` is retained but has no route.
```

Note the existing bullet also says the landing page is `components/Home.tsx`; the actual file is `components/LandingPage.tsx`. Fixed above.

- [ ] **Step 4: Full-surface verification**

Run: `npm run lint && npm run build && npm run preview`
Expected: lint and build exit 0. Against the preview server, walk the spec's full checklist:

1. `/services/automated-workflows` — all 9 cards link to their service page, each reading "See how it works →".
2. All 9 service pages render, in `Layout`, with correct content and no empty stats sections.
3. All 9 demo CTAs reach their demo; each demo's "← Exit demo" returns to its own service page.
4. `/services/automated-workflows/not-a-real-slug` and `.../not-a-real-slug/demo` both redirect to the index.
5. `/demos/commercial-cleaning` is gone (blank). Intended.
6. Every stat's source link opens and still contains its claim.
7. At 375px wide, no page scrolls horizontally.

- [ ] **Step 5: Verify the redirects on the deploy preview**

The nine 301s cannot be tested locally — `netlify.toml` is inert under `dev` and `preview`. Once Brian pushes the branch and Netlify builds a deploy preview, check all nine against it:

```bash
for u in win-back-campaign missed-call-text-back review-generation automated-quoting invoice-reminders onboarding dispatch weekly-reports tool-sync; do
  echo "--- /demos/$u"
  curl -s -o /dev/null -w '%{http_code} → %{redirect_url}\n' "https://<deploy-preview-url>/demos/$u"
done
```

Expected: nine `301` responses, each pointing at the matching `/services/automated-workflows/<slug>/demo`. Watch the four whose names change: `win-back-campaign`→`win-back-campaigns`, `onboarding`→`new-customer-onboarding`, `dispatch`→`job-dispatch`, `weekly-reports`→`weekly-owner-reports`.

A `200` instead of a `301` means the rule landed below the catch-all.

- [ ] **Step 6: Export this plan to the vault**

```bash
mkdir -p "/Users/brian/Documents/dev-vault/projects/paradigm/consulting-website/docs/superpowers/plans"
cp docs/superpowers/plans/2026-07-15-automated-workflows-service-pages.md "/Users/brian/Documents/dev-vault/projects/paradigm/consulting-website/docs/superpowers/plans/"
cp docs/superpowers/specs/2026-07-15-automated-workflows-service-pages-design.md "/Users/brian/Documents/dev-vault/projects/paradigm/consulting-website/docs/superpowers/specs/"
```

- [ ] **Step 7: Commit**

```bash
git add CLAUDE.md docs/superpowers/plans/2026-07-15-automated-workflows-service-pages.md
git commit -m "docs: update CLAUDE.md for the nested workflow service pages"
```

---

## Spec coverage

| Spec requirement | Task |
|---|---|
| Full Levology arc, no pricing | 7 (template), 9–16 (content) |
| All 9 workflows, one shared template | 7, 9–16 |
| Real, cited stats; no section without them | 6, 9–16 (research); 7 (`WorkflowStats` returns null on empty) |
| Demo URL nested under the service route | 2 |
| Commercial-cleaning route retired, code retained | 2 |
| Routing incl. unknown-slug `<Navigate replace />` | 2 (demo), 7 (page) |
| Slug unification | 1 |
| Nine 301s above the catch-all | 3 |
| `src/data/workflows.ts` with required `sourceUrl` | 1 |
| `src/demos/registry.ts`, lazy | 2 |
| `WorkflowPage.tsx` with the 9 sections | 7 |
| Sections 6/7/9 shared as components | 5 |
| `AutomatedWorkflows.tsx` — `examples[]` deleted, cards from data, sections extracted | 1, 5 |
| `DemoShell.tsx` — `backTo` prop | 4 |
| `App.tsx` — routes, imports collapse to registry | 2, 7 |
| `netlify.toml` | 3 |
| `CLAUDE.md` — vault path, routing, drop commercial-cleaning | 17 |
| Build order: plumbing → missed-call → review → fan out | 1–5, 6–7, 8, 9–16 |
| Verification: lint, build, manual browser | every task; 17 for the full surface |
