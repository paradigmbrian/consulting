# Multi-Service Navigation Restructure Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Restructure the site from a single CTO-consulting home page into a generic brand landing page plus per-service routes under `/services/<slug>`, with shared header/footer navigation.

**Architecture:** A React Router v6 layout route wraps all marketing pages with a shared `Header` + `Footer`; the demo route stays outside it (full-bleed). A `services.ts` data module is the single source of truth for service slug/label/summary/published state, driving both the header nav and the landing grid. The existing home content moves wholesale to `/services/technical-consulting`; a thin unlinked placeholder stands up `/services/automated-workflows`.

**Tech Stack:** React 18 + TypeScript, Vite 5, react-router-dom v6, react-icons, vanilla CSS with custom properties.

## Global Constraints

- **No test framework exists** in this project. Verification per task is `npm run build` (runs `tsc` type-check + Vite build) and, for UI tasks, a manual smoke check via `npm run dev`. The final task also runs `npm run lint`.
- **`npm run lint` must pass with zero warnings** (`--max-warnings 0`).
- **Git is read-only for the assistant** (per CLAUDE.md). Do NOT execute `git add`/`git commit`. Each task's commit step lists the exact command to **surface to Brian to run manually**.
- **CSS conventions:** vanilla CSS, one `.css` file per component, use existing custom properties from `src/index.css` (`--color-primary`, `--color-primary-dark`, `--color-text`, `--color-text-light`, `--color-border`, `--color-bg`, `--color-bg-light`, `--spacing-xs|sm|md|lg|xl`, `--max-width`). Reuse the global `.container` class for width.
- **Do not depend on the global `.btn*` classes** — they live in `Hero.css`/`CTA.css`, are background-dependent, and are error-prone off a colored hero. New pages define their own button classes.
- **Calendly URL (verbatim):** `https://calendly.com/brian-paradigmshiftdev/30min` — all booking CTAs use `target="_blank"` + `rel="noopener noreferrer"`.
- **Service names (verbatim):** Technical Consulting (`technical-consulting`, published), Automated Workflows (`automated-workflows`, NOT published — unlinked placeholder only).

---

## File Structure

**New**
- `src/data/services.ts` — service metadata + helpers (single source of truth).
- `src/components/Header.tsx` / `Header.css` — sticky shared nav.
- `src/components/Layout.tsx` — Header + `<Outlet/>` + Footer wrapper.
- `src/components/LandingPage.tsx` / `LandingPage.css` — generic brand landing page.
- `src/components/TechnicalConsulting.tsx` — existing home sections (from `Home.tsx`, minus Footer).
- `src/components/AutomatedWorkflows.tsx` / `AutomatedWorkflows.css` — unlinked placeholder.

**Modified**
- `src/App.tsx` — nested layout routes.

**Removed**
- `src/components/Home.tsx` — replaced by `TechnicalConsulting.tsx`.

**Unchanged**
- `src/components/Footer.tsx`, `CTA.tsx`, `Hero.tsx`, and all other section components.
- `netlify.toml` (SPA fallback already rewrites all paths to `index.html`).
- `src/demos/**`.

---

## Task 1: Service metadata module

**Files:**
- Create: `src/data/services.ts`

**Interfaces:**
- Produces:
  - `interface Service { slug: string; label: string; summary: string; published: boolean }`
  - `const services: Service[]`
  - `const publishedServices: Service[]` (services where `published === true`)
  - `function servicePath(slug: string): string` → `/services/${slug}`

- [ ] **Step 1: Create the data module**

Create `src/data/services.ts`:

```ts
export interface Service {
  slug: string;
  label: string;
  summary: string;
  published: boolean;
}

export const services: Service[] = [
  {
    slug: "technical-consulting",
    label: "Technical Consulting",
    summary:
      "Fractional CTO guidance, technical audits, and MVP blueprints for non-technical founders making early product decisions.",
    published: true,
  },
  {
    slug: "automated-workflows",
    label: "Automated Workflows",
    summary:
      "Design and build automated workflows that remove manual, repetitive operations from your business.",
    published: false,
  },
];

export const publishedServices: Service[] = services.filter((s) => s.published);

export const servicePath = (slug: string): string => `/services/${slug}`;
```

- [ ] **Step 2: Verify it compiles**

Run: `npm run build`
Expected: build succeeds with no TypeScript errors.

- [ ] **Step 3: Commit (surface command to Brian)**

```bash
git add src/data/services.ts
git commit -m "feat: add service metadata module"
```

---

## Task 2: Shared header nav

**Files:**
- Create: `src/components/Header.tsx`
- Create: `src/components/Header.css`

**Interfaces:**
- Consumes: `publishedServices`, `servicePath` from `../data/services`.
- Produces: default export `Header` (React component, no props).

- [ ] **Step 1: Create `Header.tsx`**

```tsx
import { Link } from "react-router-dom";
import { HiLightBulb } from "react-icons/hi";
import { FaCalendarAlt } from "react-icons/fa";
import { publishedServices, servicePath } from "../data/services";
import "./Header.css";

const Header = () => {
  return (
    <header className="site-header">
      <div className="container site-header-inner">
        <Link to="/" className="site-header-brand">
          <HiLightBulb className="site-header-brand-icon" />
          <span className="site-header-brand-text">Paradigm Shift</span>
        </Link>
        <nav className="site-header-nav">
          {publishedServices.map((service) => (
            <Link
              key={service.slug}
              to={servicePath(service.slug)}
              className="site-header-link"
            >
              {service.label}
            </Link>
          ))}
          <a
            href="https://calendly.com/brian-paradigmshiftdev/30min"
            className="site-header-cta"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaCalendarAlt className="site-header-cta-icon" />
            Book a call
          </a>
        </nav>
      </div>
    </header>
  );
};

export default Header;
```

- [ ] **Step 2: Create `Header.css`**

```css
.site-header {
  position: sticky;
  top: 0;
  z-index: 100;
  background: var(--color-bg);
  border-bottom: 1px solid var(--color-border);
}

.site-header-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 4rem;
}

.site-header-brand {
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-xs);
  color: var(--color-text);
  font-weight: 700;
}

.site-header-brand:hover {
  color: var(--color-primary);
}

.site-header-brand-icon {
  font-size: 1.5rem;
  color: var(--color-primary);
}

.site-header-brand-text {
  font-size: 1.125rem;
}

.site-header-nav {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
}

.site-header-link {
  color: var(--color-text-light);
  font-weight: 600;
  font-size: 0.95rem;
}

.site-header-link:hover {
  color: var(--color-primary);
}

.site-header-cta {
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-xs);
  background: var(--color-primary);
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  font-weight: 600;
  font-size: 0.95rem;
}

.site-header-cta:hover {
  background: var(--color-primary-dark);
  color: white;
}

.site-header-cta-icon {
  font-size: 0.9rem;
}

@media (max-width: 640px) {
  .site-header-nav {
    gap: var(--spacing-sm);
  }
}
```

- [ ] **Step 3: Verify it compiles**

Run: `npm run build`
Expected: build succeeds. (Header is not rendered by any route yet; that is fine.)

- [ ] **Step 4: Commit (surface command to Brian)**

```bash
git add src/components/Header.tsx src/components/Header.css
git commit -m "feat: add shared site header nav"
```

---

## Task 3: Shared layout wrapper

**Files:**
- Create: `src/components/Layout.tsx`

**Interfaces:**
- Consumes: `Header` (Task 2), existing `Footer` (`./Footer`), `Outlet` from `react-router-dom`.
- Produces: default export `Layout` (renders `Header`, `<main><Outlet/></main>`, `Footer`).

- [ ] **Step 1: Create `Layout.tsx`**

```tsx
import { Outlet } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";

const Layout = () => {
  return (
    <>
      <Header />
      <main>
        <Outlet />
      </main>
      <Footer />
    </>
  );
};

export default Layout;
```

- [ ] **Step 2: Verify it compiles**

Run: `npm run build`
Expected: build succeeds.

- [ ] **Step 3: Commit (surface command to Brian)**

```bash
git add src/components/Layout.tsx
git commit -m "feat: add shared layout wrapper"
```

---

## Task 4: Technical Consulting service page

**Files:**
- Create: `src/components/TechnicalConsulting.tsx`

**Interfaces:**
- Consumes: existing section components `Hero`, `WhoIsFor`, `Problem`, `Offer`, `HowItWorks`, `WhyWorkWithMe`, `CTA`.
- Produces: default export `TechnicalConsulting`.

Note: This is the old `Home.tsx` body **minus** the trailing `<Footer />` (Footer is now supplied by `Layout`). `Home.tsx` stays in place and routed until Task 7 — do not delete it here.

- [ ] **Step 1: Create `TechnicalConsulting.tsx`**

```tsx
import Hero from "./Hero";
import WhoIsFor from "./WhoIsFor";
import Problem from "./Problem";
import Offer from "./Offer";
import HowItWorks from "./HowItWorks";
import WhyWorkWithMe from "./WhyWorkWithMe";
import CTA from "./CTA";

const TechnicalConsulting = () => {
  return (
    <>
      <Hero />
      <WhoIsFor />
      <Problem />
      <Offer />
      <HowItWorks />
      <WhyWorkWithMe />
      <CTA />
    </>
  );
};

export default TechnicalConsulting;
```

- [ ] **Step 2: Verify it compiles**

Run: `npm run build`
Expected: build succeeds.

- [ ] **Step 3: Commit (surface command to Brian)**

```bash
git add src/components/TechnicalConsulting.tsx
git commit -m "feat: add technical consulting service page"
```

---

## Task 5: Generic landing page

**Files:**
- Create: `src/components/LandingPage.tsx`
- Create: `src/components/LandingPage.css`

**Interfaces:**
- Consumes: `publishedServices`, `servicePath` from `../data/services`; existing `CTA` component; `Link` from `react-router-dom`.
- Produces: default export `LandingPage`.

- [ ] **Step 1: Create `LandingPage.tsx`**

```tsx
import { Link } from "react-router-dom";
import { HiLightBulb } from "react-icons/hi";
import { FaCalendarAlt } from "react-icons/fa";
import { publishedServices, servicePath } from "../data/services";
import CTA from "./CTA";
import "./LandingPage.css";

const LandingPage = () => {
  return (
    <>
      <section className="landing-hero">
        <div className="container">
          <div className="landing-hero-content">
            <div className="landing-hero-icon">
              <HiLightBulb />
            </div>
            <p className="landing-hero-brand">
              Paradigm Shift Software Development
            </p>
            <h1 className="landing-hero-title">
              Software expertise for
              <br />
              growing businesses
            </h1>
            <p className="landing-hero-subtitle">
              From early-stage technical strategy to automating the work that
              slows you down.
            </p>
            <div className="landing-hero-cta">
              <a
                href="https://calendly.com/brian-paradigmshiftdev/30min"
                className="landing-hero-btn"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaCalendarAlt className="landing-hero-btn-icon" />
                Book a 30-minute call →
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="landing-services">
        <div className="container">
          <h2 className="section-title">What we do</h2>
          <div className="landing-services-grid">
            {publishedServices.map((service) => (
              <Link
                key={service.slug}
                to={servicePath(service.slug)}
                className="landing-service-card"
              >
                <h3 className="landing-service-card-title">{service.label}</h3>
                <p className="landing-service-card-summary">{service.summary}</p>
                <span className="landing-service-card-link">Learn more →</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <CTA />
    </>
  );
};

export default LandingPage;
```

- [ ] **Step 2: Create `LandingPage.css`**

```css
.landing-hero {
  background: linear-gradient(
    135deg,
    var(--color-primary) 0%,
    var(--color-primary-dark) 100%
  );
  color: white;
  padding: var(--spacing-xl) 0;
  text-align: center;
}

.landing-hero-content {
  max-width: 800px;
  margin: 0 auto;
}

.landing-hero-icon {
  font-size: 3rem;
  color: white;
  margin-bottom: var(--spacing-sm);
}

.landing-hero-brand {
  color: rgba(255, 255, 255, 0.85);
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  font-size: 0.9rem;
  margin-bottom: var(--spacing-sm);
}

.landing-hero-title {
  color: white;
  margin-bottom: var(--spacing-md);
}

.landing-hero-subtitle {
  color: rgba(255, 255, 255, 0.9);
  font-size: clamp(1.125rem, 2.5vw, 1.375rem);
  margin-bottom: var(--spacing-lg);
}

.landing-hero-btn {
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-sm);
  background: white;
  color: var(--color-primary);
  padding: 1.25rem 2.5rem;
  border-radius: 0.5rem;
  font-size: 1.25rem;
  font-weight: 700;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.landing-hero-btn:hover {
  color: var(--color-primary-dark);
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.3);
}

.landing-hero-btn-icon {
  font-size: 1.125rem;
}

.landing-services {
  padding: var(--spacing-xl) 0;
  background: var(--color-bg);
}

.landing-services .section-title {
  margin-bottom: var(--spacing-lg);
}

.landing-services-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 360px));
  justify-content: center;
  gap: var(--spacing-md);
  max-width: 900px;
  margin: 0 auto;
}

.landing-service-card {
  display: block;
  padding: var(--spacing-md);
  border: 1px solid var(--color-border);
  border-radius: 0.75rem;
  background: var(--color-bg-light);
  transition: all 0.2s ease;
}

.landing-service-card:hover {
  border-color: var(--color-primary);
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
}

.landing-service-card-title {
  color: var(--color-text);
  margin-bottom: var(--spacing-xs);
}

.landing-service-card-summary {
  margin-bottom: var(--spacing-sm);
}

.landing-service-card-link {
  color: var(--color-primary);
  font-weight: 600;
}
```

- [ ] **Step 3: Verify it compiles**

Run: `npm run build`
Expected: build succeeds.

- [ ] **Step 4: Commit (surface command to Brian)**

```bash
git add src/components/LandingPage.tsx src/components/LandingPage.css
git commit -m "feat: add generic brand landing page"
```

---

## Task 6: Automated Workflows placeholder

**Files:**
- Create: `src/components/AutomatedWorkflows.tsx`
- Create: `src/components/AutomatedWorkflows.css`

**Interfaces:**
- Consumes: `react-icons` (`FaCalendarAlt`, `HiCog`).
- Produces: default export `AutomatedWorkflows`.

- [ ] **Step 1: Create `AutomatedWorkflows.tsx`**

```tsx
import { FaCalendarAlt } from "react-icons/fa";
import { HiCog } from "react-icons/hi";
import "./AutomatedWorkflows.css";

const AutomatedWorkflows = () => {
  return (
    <section className="workflows-placeholder">
      <div className="container">
        <div className="workflows-placeholder-content">
          <div className="workflows-placeholder-icon">
            <HiCog />
          </div>
          <p className="workflows-placeholder-brand">
            Paradigm Shift — Automated Workflows
          </p>
          <h1 className="workflows-placeholder-title">Automated Workflows</h1>
          <p className="workflows-placeholder-subtitle">
            We design and build automation that removes manual, repetitive work
            from your business. Detailed service page coming soon.
          </p>
          <a
            href="https://calendly.com/brian-paradigmshiftdev/30min"
            className="workflows-placeholder-btn"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaCalendarAlt className="workflows-placeholder-btn-icon" />
            Book a call to learn more →
          </a>
        </div>
      </div>
    </section>
  );
};

export default AutomatedWorkflows;
```

- [ ] **Step 2: Create `AutomatedWorkflows.css`**

```css
.workflows-placeholder {
  padding: var(--spacing-xl) 0;
  text-align: center;
  min-height: 60vh;
  display: flex;
  align-items: center;
}

.workflows-placeholder-content {
  max-width: 700px;
  margin: 0 auto;
}

.workflows-placeholder-icon {
  font-size: 3rem;
  color: var(--color-primary);
  margin-bottom: var(--spacing-sm);
}

.workflows-placeholder-brand {
  color: var(--color-text-light);
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  font-size: 0.9rem;
  margin-bottom: var(--spacing-sm);
}

.workflows-placeholder-title {
  margin-bottom: var(--spacing-md);
}

.workflows-placeholder-subtitle {
  margin-bottom: var(--spacing-lg);
}

.workflows-placeholder-btn {
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-sm);
  background: var(--color-primary);
  color: white;
  padding: 1rem 2rem;
  border-radius: 0.5rem;
  font-weight: 700;
  transition: all 0.2s ease;
}

.workflows-placeholder-btn:hover {
  background: var(--color-primary-dark);
  color: white;
  transform: translateY(-2px);
}

.workflows-placeholder-btn-icon {
  font-size: 1rem;
}
```

- [ ] **Step 3: Verify it compiles**

Run: `npm run build`
Expected: build succeeds.

- [ ] **Step 4: Commit (surface command to Brian)**

```bash
git add src/components/AutomatedWorkflows.tsx src/components/AutomatedWorkflows.css
git commit -m "feat: add automated workflows placeholder page"
```

---

## Task 7: Wire routes and remove old Home

**Files:**
- Modify: `src/App.tsx`
- Remove: `src/components/Home.tsx`

**Interfaces:**
- Consumes: `Layout` (Task 3), `LandingPage` (Task 5), `TechnicalConsulting` (Task 4), `AutomatedWorkflows` (Task 6), existing `DemoPage`.

- [ ] **Step 1: Replace `src/App.tsx` with nested routes**

```tsx
import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import LandingPage from "./components/LandingPage";
import TechnicalConsulting from "./components/TechnicalConsulting";
import AutomatedWorkflows from "./components/AutomatedWorkflows";
import DemoPage from "./demos/commercialCleaning/DemoPage";

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
      <Route path="/demos/commercial-cleaning" element={<DemoPage />} />
    </Routes>
  );
}

export default App;
```

- [ ] **Step 2: Delete the now-unused `Home.tsx`**

Run: `rm src/components/Home.tsx`

- [ ] **Step 3: Lint**

Run: `npm run lint`
Expected: passes with zero warnings. (No remaining imports of `Home`; no unused vars.)

- [ ] **Step 4: Build**

Run: `npm run build`
Expected: `tsc` + Vite build succeed with no errors.

- [ ] **Step 5: Manual smoke test**

Run: `npm run dev`, then in the browser verify:
- `/` — landing page: gradient hero + a single "Technical Consulting" service card + CTA; header shows "Paradigm Shift" logo, "Technical Consulting" link, "Book a call"; one footer at the bottom.
- Click the service card AND the header "Technical Consulting" link — both land on `/services/technical-consulting` showing all sections (Hero → Offer → … → CTA) with exactly one footer (no duplicate).
- `/services/automated-workflows` (type the URL) — placeholder renders; it is absent from the header nav and the landing grid.
- `/demos/commercial-cleaning` — still renders full-bleed with NO shared header/footer.
- Logo click from any page returns to `/`.

- [ ] **Step 6: Commit (surface command to Brian)**

```bash
git add src/App.tsx src/components/Home.tsx
git commit -m "feat: wire multi-service routes and shared layout"
```

---

## Self-Review

**Spec coverage:**
- Routing (`/`, `/services/technical-consulting`, `/services/automated-workflows`, demo unchanged) → Task 7.
- Layout wrapping non-demo pages, demo outside → Tasks 3, 7.
- Shared `Header` driven by published services + booking CTA → Task 2.
- `services.ts` single source of truth with `published` flag → Task 1.
- Landing page: brand hero + services grid (published only) + CTA → Task 5.
- Technical Consulting page = old Home minus Footer → Task 4.
- Automated Workflows unlinked placeholder → Task 6.
- Footer shared via layout, removed from moved page body → Tasks 3, 4.
- `netlify.toml` unchanged (SPA fallback covers new routes) → noted in File Structure.
- Verification (lint + build + smoke) → Task 7. All covered.

**Placeholder scan:** No TBD/TODO/"handle edge cases" — every step contains complete file contents or exact commands.

**Type consistency:** `Service`/`services`/`publishedServices`/`servicePath` defined in Task 1 and consumed identically in Tasks 2 and 5. Component default exports (`Header`, `Layout`, `LandingPage`, `TechnicalConsulting`, `AutomatedWorkflows`) match their imports in Tasks 3 and 7. Route paths match `servicePath` output and the smoke test.
