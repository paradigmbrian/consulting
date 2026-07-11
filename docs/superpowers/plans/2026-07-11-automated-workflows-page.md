# Automated Workflows Page Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

Spec: [[2026-07-11-automated-workflows-services-page-design]]

**Goal:** Replace the `AutomatedWorkflows.tsx` placeholder with the real six-section Automated Workflows service page, then publish it to the nav and landing grid.

**Architecture:** A single self-contained page component (`AutomatedWorkflows.tsx` + `AutomatedWorkflows.css`) rendering six stacked sections — hero, framing band, examples grid, how-it-works steps, credibility band, CTA. The route and shared `Header`/`Footer` (via `Layout`) already exist from the multi-service navigation refactor, so this touches only the page body plus one line in `services.ts` to publish. Content is hardcoded; small data arrays keep repeated markup (examples, steps, lists) DRY.

**Tech Stack:** React 18 + TypeScript, Vite 5, react-router-dom v6, react-icons, vanilla CSS with custom properties.

## Global Constraints

- **No test framework exists** in this project. Per-task verification is `npm run build` (runs `tsc` type-check + Vite build) and a manual `npm run dev` smoke check; the final task also runs `npm run lint`.
- **`npm run lint` must pass with zero warnings** (`--max-warnings 0`). No unused imports or variables.
- **Git is read-only for the assistant** (per CLAUDE.md). Do NOT execute `git add`/`git commit`. Each task's commit step lists the exact command to **surface to Brian to run manually**.
- **CSS conventions:** vanilla CSS, one `.css` file per component, use existing custom properties from `src/index.css` (`--color-primary`, `--color-primary-dark`, `--color-text`, `--color-text-light`, `--color-bg`, `--color-bg-light`, `--color-border`, `--color-success`, `--spacing-xs|sm|md|lg|xl`, `--max-width`). Reuse the global `.container`, `.section-content`, `.section-title`, `.section-intro` classes (defined in `src/index.css`; they handle centering/width only — all spacing and color live in the page CSS).
- **Do not depend on the global `.btn*` classes** — they live in `Hero.css`/`CTA.css` and are background-dependent. This page defines its own button classes (`aw-hero-btn`, `aw-cta-btn`).
- **Calendly URL (verbatim):** `https://calendly.com/brian-paradigmshiftdev/30min` — every booking CTA uses `target="_blank"` + `rel="noopener noreferrer"`.
- **No prices anywhere on the page** — the model is a free consult (per spec). Do not add pricing, tiers, or an "audit" offer.
- **Do not add a page-level header, footer, or brand bar** — `Layout` supplies the shared `Header` and `Footer`. This page renders only its section content.

---

## File Structure

**Modified**
- `src/components/AutomatedWorkflows.tsx` — replace the placeholder body with the six-section page.
- `src/components/AutomatedWorkflows.css` — replace the `.workflows-placeholder*` styles with the new `aw-*` styles.
- `src/data/services.ts` — flip `automated-workflows` to `published: true` (Task 2 only).

**Unchanged**
- `src/App.tsx` (route already wired), `src/components/Layout.tsx`, `Header.tsx`, `LandingPage.tsx` (auto-pick up the published service).

---

## Task 1: Build the Automated Workflows page body

Builds the full page while the service stays **unpublished** (`published: false`), so it is reachable only by typing the URL — the live nav and landing grid are unaffected until Task 2. A reviewer can accept the page in isolation before it goes live.

**Files:**
- Modify (full replace): `src/components/AutomatedWorkflows.tsx`
- Modify (full replace): `src/components/AutomatedWorkflows.css`

**Interfaces:**
- Consumes: `react-icons/fa` icons; the `IconType` type from `react-icons`; global classes from `src/index.css`.
- Produces: default export `AutomatedWorkflows` (React component, no props) — already imported by `src/App.tsx`, so the export name and default-export shape must not change.

- [ ] **Step 1: Replace `src/components/AutomatedWorkflows.tsx`**

Replace the entire file contents with:

```tsx
import {
  FaCalendarAlt,
  FaUndo,
  FaCommentDots,
  FaStar,
  FaFileInvoiceDollar,
  FaMoneyBillWave,
  FaUserPlus,
  FaTruck,
  FaChartLine,
  FaSyncAlt,
  FaPhone,
  FaCogs,
  FaRocket,
} from "react-icons/fa";
import type { IconType } from "react-icons";
import "./AutomatedWorkflows.css";

const CALENDLY_URL = "https://calendly.com/brian-paradigmshiftdev/30min";

const automatableWork: string[] = [
  "Chasing leads and following up",
  "Booking, reminders, and no-shows",
  "Quotes, invoices, and getting paid",
  "Reviews and reputation",
  "Moving data between the tools you already use",
  "Knowing what's actually working",
];

interface Example {
  icon: IconType;
  title: string;
  description: string;
}

const examples: Example[] = [
  {
    icon: FaUndo,
    title: "Win-Back Campaigns",
    description: "Re-engage past customers automatically",
  },
  {
    icon: FaCommentDots,
    title: "Missed-Call Text-Back",
    description: "Instant reply so leads don't call a competitor",
  },
  {
    icon: FaStar,
    title: "Review Generation",
    description: "A steady stream of 5-star reviews, hands-off",
  },
  {
    icon: FaFileInvoiceDollar,
    title: "Automated Quoting",
    description: "From intake to a ready-to-send quote",
  },
  {
    icon: FaMoneyBillWave,
    title: "Invoice & Payment Reminders",
    description: "Get paid without chasing",
  },
  {
    icon: FaUserPlus,
    title: "New-Customer Onboarding",
    description: "Welcome, docs, and scheduling handled",
  },
  {
    icon: FaTruck,
    title: "Job Scheduling & Dispatch",
    description: "Right job, right person, customer notified",
  },
  {
    icon: FaChartLine,
    title: "Weekly Owner Reports",
    description: "The numbers that matter, in your inbox",
  },
  {
    icon: FaSyncAlt,
    title: "Tool-to-Tool Sync",
    description: "Stop retyping the same data twice",
  },
];

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

const reasons: string[] = [
  "10+ years as a professional software engineer",
  "Real, robust engineering — not brittle no-code that breaks",
  "Built on the tools you already use",
  "Fixed scope, agreed up front — no surprise bills",
];

const AutomatedWorkflows = () => {
  return (
    <>
      <section className="aw-hero">
        <div className="container">
          <div className="aw-hero-content">
            <h1 className="aw-hero-title">
              Custom automation for the way your business actually works
            </h1>
            <p className="aw-hero-subtitle">
              I'm a software engineer with 10+ years of experience. I build
              systems that take the repetitive, revenue-losing busywork off your
              plate — designed around how your business runs, not a template you
              have to bend to fit.
            </p>
            <a
              href={CALENDLY_URL}
              className="aw-hero-btn"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaCalendarAlt className="aw-hero-btn-icon" />
              Book a free automation consult →
            </a>
          </div>
        </div>
      </section>

      <section className="aw-framing">
        <div className="container">
          <div className="section-content">
            <h2 className="section-title">
              If your team does it the same way every time, it can probably be
              automated
            </h2>
            <p className="section-intro aw-framing-intro">
              The work that quietly eats your week is usually a candidate:
            </p>
            <ul className="aw-framing-list">
              {automatableWork.map((item) => (
                <li key={item} className="aw-framing-item">
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="aw-examples">
        <div className="container">
          <div className="section-content">
            <h2 className="section-title">
              A few examples of what that looks like in practice
            </h2>
            <p className="section-intro aw-examples-intro">
              Not a fixed menu — if it's repetitive, it's probably a candidate.
            </p>
            <div className="aw-examples-grid">
              {examples.map((example) => {
                const Icon = example.icon;
                return (
                  <div key={example.title} className="aw-example-card">
                    <div className="aw-example-icon">
                      <Icon />
                    </div>
                    <h3 className="aw-example-title">{example.title}</h3>
                    <p className="aw-example-description">
                      {example.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

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
    </>
  );
};

export default AutomatedWorkflows;
```

- [ ] **Step 2: Replace `src/components/AutomatedWorkflows.css`**

Replace the entire file contents with:

```css
/* 1. Positioning hero */
.aw-hero {
  background: linear-gradient(
    135deg,
    var(--color-primary) 0%,
    var(--color-primary-dark) 100%
  );
  color: white;
  padding: var(--spacing-xl) 0;
  text-align: center;
}

.aw-hero-content {
  max-width: 800px;
  margin: 0 auto;
}

.aw-hero-title {
  color: white;
  margin-bottom: var(--spacing-md);
}

.aw-hero-subtitle {
  color: rgba(255, 255, 255, 0.9);
  font-size: clamp(1.125rem, 2.5vw, 1.375rem);
  margin-bottom: var(--spacing-lg);
}

.aw-hero-btn {
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-xs);
  background: white;
  color: var(--color-primary);
  padding: 1.25rem 2.5rem;
  border-radius: 0.5rem;
  font-size: 1.25rem;
  font-weight: 700;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.aw-hero-btn:hover {
  color: var(--color-primary-dark);
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.3);
}

.aw-hero-btn-icon {
  font-size: 1.125rem;
}

/* 2. Framing band */
.aw-framing {
  padding: var(--spacing-xl) 0;
  background: var(--color-bg);
}

.aw-framing-intro {
  margin-top: var(--spacing-sm);
  margin-bottom: var(--spacing-md);
}

.aw-framing-list {
  list-style: none;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: var(--spacing-sm);
  max-width: 800px;
  margin: 0 auto;
  text-align: left;
}

.aw-framing-item {
  position: relative;
  padding-left: 1.75rem;
  color: var(--color-text-light);
  font-size: clamp(1rem, 2vw, 1.125rem);
}

.aw-framing-item::before {
  content: "→";
  position: absolute;
  left: 0;
  color: var(--color-primary);
  font-weight: 700;
}

/* 3. Examples grid */
.aw-examples {
  padding: var(--spacing-xl) 0;
  background: var(--color-bg-light);
}

.aw-examples-intro {
  margin-top: var(--spacing-sm);
  margin-bottom: var(--spacing-lg);
}

.aw-examples-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: var(--spacing-md);
  max-width: 1000px;
  margin: 0 auto;
}

.aw-example-card {
  padding: var(--spacing-md);
  border: 1px solid var(--color-border);
  border-radius: 0.75rem;
  background: var(--color-bg);
  text-align: left;
  transition: all 0.2s ease;
}

.aw-example-card:hover {
  border-color: var(--color-primary);
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
}

.aw-example-icon {
  font-size: 1.75rem;
  color: var(--color-primary);
  margin-bottom: var(--spacing-sm);
}

.aw-example-title {
  margin-bottom: var(--spacing-xs);
}

.aw-example-description {
  margin: 0;
}

/* 4. How it works */
.aw-how {
  padding: var(--spacing-xl) 0;
  background: var(--color-bg);
}

.aw-steps {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: var(--spacing-lg);
  max-width: 1000px;
  margin: var(--spacing-lg) auto 0;
}

.aw-step {
  text-align: center;
}

.aw-step-number {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 4rem;
  height: 4rem;
  border-radius: 50%;
  background: var(--color-primary);
  margin-bottom: var(--spacing-sm);
}

.aw-step-icon {
  font-size: 1.5rem;
  color: white;
}

.aw-step-content h3 {
  margin-bottom: var(--spacing-xs);
}

.aw-step-content p {
  margin: 0;
}

/* 5. Why me */
.aw-why {
  padding: var(--spacing-xl) 0;
  background: var(--color-bg-light);
}

.aw-why-list {
  list-style: none;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: var(--spacing-sm);
  max-width: 800px;
  margin: var(--spacing-md) auto 0;
  text-align: left;
}

.aw-why-item {
  position: relative;
  padding-left: 2rem;
  color: var(--color-text);
  font-weight: 600;
  font-size: clamp(1rem, 2vw, 1.125rem);
}

.aw-why-item::before {
  content: "✓";
  position: absolute;
  left: 0;
  color: var(--color-success);
  font-weight: 700;
}

/* 6. CTA */
.aw-cta {
  padding: var(--spacing-xl) 0;
  background: var(--color-bg);
  text-align: center;
}

.aw-cta-content {
  max-width: 700px;
  margin: 0 auto;
}

.aw-cta-title {
  margin-bottom: var(--spacing-lg);
}

.aw-cta-btn {
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-xs);
  background: var(--color-primary);
  color: white;
  padding: 1.25rem 2.5rem;
  border-radius: 0.5rem;
  font-size: 1.25rem;
  font-weight: 700;
  transition: all 0.2s ease;
}

.aw-cta-btn:hover {
  background: var(--color-primary-dark);
  color: white;
  transform: translateY(-2px);
}

.aw-cta-btn-icon {
  font-size: 1.125rem;
}

@media (max-width: 640px) {
  .aw-hero-btn,
  .aw-cta-btn {
    padding: 1rem 1.75rem;
    font-size: 1.1rem;
  }
}
```

- [ ] **Step 3: Build**

Run: `npm run build`
Expected: `tsc` + Vite build succeed with no TypeScript errors. (In particular, no "unused import" errors — every imported `react-icons/fa` icon is referenced in the `examples` or `steps` arrays or a CTA.)

- [ ] **Step 4: Manual smoke test**

Run: `npm run dev`, then in the browser open `http://localhost:5173/services/automated-workflows` and verify:
- Shared `Header` (Paradigm Shift logo, "Technical Consulting" link, "Book a call") and `Footer` appear (from `Layout`); the page itself renders no second header/footer.
- Six sections in order: gradient hero → framing band with 6 arrow bullets → 9-card examples grid → 3 how-it-works steps with circular icons → "Why work with me" with 4 check bullets → CTA.
- Both "Book a free automation consult" buttons open Calendly in a new tab.
- The page is **not** yet in the header nav or on the `/` landing grid (still `published: false`) — confirm it's absent from both.
- Resize to mobile width: grids collapse to a single column, buttons shrink, no horizontal scroll.

- [ ] **Step 5: Commit (surface command to Brian)**

```bash
git add src/components/AutomatedWorkflows.tsx src/components/AutomatedWorkflows.css
git commit -m "feat: build out automated workflows service page"
```

---

## Task 2: Publish the service

Flips the service live so it appears in the shared `Header` nav and the `/` landing grid. Split from Task 1 so publishing is a deliberate, separately-reviewable go-live step.

**Files:**
- Modify: `src/data/services.ts`

**Interfaces:**
- Consumes: the existing `services` array and its `published` field.
- Produces: no new symbols — `publishedServices` (already exported) now includes the `automated-workflows` entry, which `Header` and `LandingPage` already consume.

- [ ] **Step 1: Flip the published flag**

In `src/data/services.ts`, in the `automated-workflows` service object, change:

```ts
    published: false,
```

to:

```ts
    published: true,
```

(Leave the `technical-consulting` entry untouched.)

- [ ] **Step 2: Lint**

Run: `npm run lint`
Expected: passes with zero warnings.

- [ ] **Step 3: Build**

Run: `npm run build`
Expected: `tsc` + Vite build succeed with no errors.

- [ ] **Step 4: Manual smoke test**

Run: `npm run dev`, then verify:
- Header nav now shows an "Automated Workflows" link (alongside "Technical Consulting"); clicking it lands on `/services/automated-workflows`.
- The `/` landing page services grid now shows an "Automated Workflows" card with its summary; clicking it lands on the same route.
- `/services/technical-consulting` still renders unchanged.
- `/demos/commercial-cleaning` still renders full-bleed with no shared header/footer.

- [ ] **Step 5: Commit (surface command to Brian)**

```bash
git add src/data/services.ts
git commit -m "feat: publish automated workflows service to nav and landing"
```

---

## Self-Review

**Spec coverage:**
- Positioning hero (10+ yr engineer, custom-not-template, consult CTA) → Task 1, `aw-hero`.
- "What can be automated" framing band with 6 bullets → Task 1, `aw-framing` / `automatableWork`.
- Example automations grid, 9 items, "not a menu" intro → Task 1, `aw-examples` / `examples`.
- How it works, 3 steps mirroring `HowItWorks` → Task 1, `aw-how` / `steps`.
- Why-me credibility band, 4 points → Task 1, `aw-why` / `reasons`.
- CTA with bespoke local-owner copy → Task 1, `aw-cta`.
- No prices, single Calendly CTA with `target`/`rel` → enforced in Global Constraints and both button elements.
- Replaces placeholder `.tsx` body + `.css` → Task 1 (full-file replaces).
- Flip `published: true`; nav + landing auto-update → Task 2.
- No page-level header/footer (Layout supplies them) → Global Constraints + Task 1 smoke step.
- Verification build + lint + smoke → Steps in both tasks. All covered.

**Placeholder scan:** No TBD/TODO/"handle edge cases" — every step contains complete file contents or exact commands and expected output.

**Type consistency:** `Example` and `Step` interfaces both use `{ icon: IconType; title: string; description: string }` and are consumed by matching `.map` callbacks. Every icon imported from `react-icons/fa` (`FaCalendarAlt`, `FaUndo`, `FaCommentDots`, `FaStar`, `FaFileInvoiceDollar`, `FaMoneyBillWave`, `FaUserPlus`, `FaTruck`, `FaChartLine`, `FaSyncAlt`, `FaPhone`, `FaCogs`, `FaRocket`) is referenced exactly once in the data arrays or CTAs — no unused imports (lint-safe). Component keeps its `default export AutomatedWorkflows` shape, matching the existing `import AutomatedWorkflows` in `App.tsx`. CSS class names in the `.tsx` (`aw-hero`, `aw-hero-content`, `aw-hero-title`, `aw-hero-subtitle`, `aw-hero-btn`, `aw-hero-btn-icon`, `aw-framing`, `aw-framing-intro`, `aw-framing-list`, `aw-framing-item`, `aw-examples`, `aw-examples-intro`, `aw-examples-grid`, `aw-example-card`, `aw-example-icon`, `aw-example-title`, `aw-example-description`, `aw-how`, `aw-steps`, `aw-step`, `aw-step-number`, `aw-step-icon`, `aw-step-content`, `aw-why`, `aw-why-list`, `aw-why-item`, `aw-cta`, `aw-cta-content`, `aw-cta-title`, `aw-cta-btn`, `aw-cta-btn-icon`) all have matching definitions in the CSS.
