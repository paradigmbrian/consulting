# Homepage Hub Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the automations-only homepage with a buyer-led hub at `/` that routes visitors to the three service pages, and relocate the existing automations funnel to `/services/automated-workflows` unchanged.

**Architecture:** A new `Home` component renders at `/`, assembling a new hero + a three-service buyer sorter (Layout A: two AI cards accented, consulting third) plus three reused shared sections (`AwWhyWorkWithMe`, `AwHowItWorks`, `AwFinalCta`). The existing `AutomatedWorkflows` component moves from `/` to `/services/automated-workflows` (which currently redirects to `/`). Header nav and Footer links are repointed to the three service routes.

**Tech Stack:** React 18 + TypeScript, Vite 5, react-router-dom v6, vanilla CSS with custom properties, react-icons.

## Global Constraints

- **No test harness exists in this repo.** Do not add one (YAGNI). Verification for every task: `npm run lint` (zero warnings) → `npm run build` (tsc + vite) → manual check in `npm run dev` at the stated URL. A task is done only when lint and build both pass clean.
- **Git writes are performed by Brian, not the executing agent.** Never run `git add`/`commit`/`checkout`. Leave changes in the working tree; surface commit commands. To undo a change, edit the file back by hand — do not `git checkout`.
- **CSS:** vanilla CSS with custom properties only. Use the real light-theme variables — `--color-primary`, `--color-text`, `--color-text-light`, `--color-bg`, `--color-bg-light`, `--color-border`, `--shadow-sm`, `--shadow-md`, `--primary-soft-2`, `--gradient-accent`, `--btn-ink`, `--hero-bg`, `--spacing-xs|sm|md|lg|xl`. Do not invent variables.
- **Calendly:** import `CALENDLY_URL` from the appropriate relative path to `data/site` (do not inline the URL).
- **Reused shared components (verified signatures):**
  - `AwWhyWorkWithMe` — `src/components/workflows/AwWhyWorkWithMe.tsx`, default export, optional `as?: "section" | "bare"` (default "section"). Renders an h2 "Why work with me" + the four credibility items. **This is the credibility band AND the trust content** — do not additionally build a separate trust strip (it would duplicate these four items).
  - `AwHowItWorks` — same dir, default export, props `{ title: string; as?: "section" | "bare" }`. Call `<AwHowItWorks title="How I work" />`.
  - `AwFinalCta` — same dir, default export, no props.
- **Copy is locked by the approved spec** (`docs/superpowers/specs/2026-07-19-homepage-hub-design.md`). Use the hero/card copy verbatim from this plan (which matches the spec). Do not invent new copy.
- **Responsive:** mobile-first, breakpoint at 768px.
- **No `netlify.toml` change** — SPA fallback already serves any client route.

---

### Task 1: Rewire routing — new `Home` at `/`, relocate automations to its service path

Point `/` at a new `Home` shell and make `/services/automated-workflows` render the existing `AutomatedWorkflows` component instead of redirecting. Independently reviewable: the automations funnel now lives at `/services/automated-workflows` and renders fully; `/` renders the new shell.

**Files:**
- Modify: `src/App.tsx` — swap the `/` element, replace the automated-workflows redirect, drop the now-unused `Navigate` import, add the `Home` import
- Create: `src/components/Home.tsx` — shell (replaced with full content in Task 2)
- Create: `src/components/Home.css` — minimal placeholder styles (replaced in Task 2)

**Interfaces:**
- Consumes: `Layout` route wrapper; existing `AutomatedWorkflows` component (unchanged).
- Produces: default export `Home` from `src/components/Home.tsx`; `/` → `Home`; `/services/automated-workflows` → `AutomatedWorkflows`.

- [ ] **Step 1: Create the `Home` shell**

Create `src/components/Home.tsx`:

```tsx
import "./Home.css";

const Home = () => (
  <section className="home-hero">
    <div className="container">
      <div className="home-hero-content">
        <h1 className="home-hero-title">Paradigm Shift</h1>
      </div>
    </div>
  </section>
);

export default Home;
```

- [ ] **Step 2: Create the placeholder stylesheet**

Create `src/components/Home.css`:

```css
/* Homepage hub — scoped styles. Populated in Task 2. */
.home-hero {
  padding: var(--spacing-xl) var(--spacing-sm) var(--spacing-lg);
  text-align: center;
}
```

- [ ] **Step 3: Rewire `src/App.tsx`**

Change the import line:

```tsx
import { Routes, Route } from "react-router-dom";
```

(Remove `Navigate` — it becomes unused after this task.)

Add the `Home` import alongside the other component imports:

```tsx
import Home from "./components/Home";
```

Set the `/` route element to `<Home />`, and change the `/services/automated-workflows` route from the `Navigate` redirect to render `AutomatedWorkflows`. The Layout block's first two routes become:

```tsx
        <Route path="/" element={<Home />} />
        <Route
          path="/services/automated-workflows"
          element={<AutomatedWorkflows />}
        />
```

Leave the remaining routes (`/services/technical-consulting`, `/services/automated-workflows/:slug`, `/services/ai-integration`, and the standalone `:slug/demo`) unchanged.

- [ ] **Step 4: Verify lint and build**

Run: `npm run lint` → expect zero errors/warnings (confirm `Navigate` is no longer imported anywhere, or lint fails on unused import).
Run: `npm run build` → expect success.

- [ ] **Step 5: Manual verification**

Run `npm run dev`, then:
- `http://localhost:5173/` — renders the new shell ("Paradigm Shift" heading) inside the layout.
- `http://localhost:5173/services/automated-workflows` — renders the FULL existing automations funnel (hero + montage, use-case grid, demos, FAQ, CTA) — no longer a redirect.
- `http://localhost:5173/services/automated-workflows/missed-call-text-back` — a workflow detail page still renders (sub-route intact).

- [ ] **Step 6: Commit (surface, do not run)**

```bash
git add src/App.tsx src/components/Home.tsx src/components/Home.css
git commit -m "feat: route / to new Home hub; relocate automations to its service path"
```

---

### Task 2: Build the hub content

Replace the `Home` shell with the full buyer-led hub: hero, three-service sorter (Layout A), and the three reused shared sections. Independently reviewable: page copy and layout can be judged without touching routing or nav.

**Files:**
- Modify: `src/components/Home.tsx` — full content (replace entire file)
- Modify: `src/components/Home.css` — full scoped styles (replace entire file)

**Interfaces:**
- Consumes: `Link` (react-router-dom); `CALENDLY_URL` from `../data/site`; `AwWhyWorkWithMe`, `AwHowItWorks`, `AwFinalCta` from `./workflows/…`; shared `wf-eyebrow` (`shared-sections.css`); global `container`/`section-*` utilities.
- Produces: no new exported symbols; same default export `Home`.

> **Structure (per spec, trust strip merged into `AwWhyWorkWithMe`):** hero → buyer sorter → `AwWhyWorkWithMe` (credibility = the four trust items) → `AwHowItWorks title="How I work"` → `AwFinalCta`. No separate one-line trust strip — it would duplicate the four `AwWhyWorkWithMe` items.

- [ ] **Step 1: Replace the component**

Replace the entire contents of `src/components/Home.tsx` with:

```tsx
import { FaCalendarAlt } from "react-icons/fa";
import { Link } from "react-router-dom";
import { CALENDLY_URL } from "../data/site";
import AwWhyWorkWithMe from "./workflows/AwWhyWorkWithMe";
import AwHowItWorks from "./workflows/AwHowItWorks";
import AwFinalCta from "./workflows/AwFinalCta";
import "./shared-sections.css";
import "./Home.css";

interface ServiceCard {
  eyebrow: string;
  name: string;
  line: string;
  to: string;
  accent: boolean;
}

const services: ServiceCard[] = [
  {
    eyebrow: "For small-business owners",
    name: "AI Automations",
    line: "Put AI to work on the busywork — missed calls, quotes, invoices, reviews — on the tools you already use.",
    to: "/services/automated-workflows",
    accent: true,
  },
  {
    eyebrow: "For startups & product teams",
    name: "AI Integration",
    line: "Embed AI into the product you already have — starting with a fixed-fee roadmap, not a rebuild.",
    to: "/services/ai-integration",
    accent: true,
  },
  {
    eyebrow: "For non-technical founders",
    name: "Technical Consulting",
    line: "Technical clarity before you build or hire — fixed-scope audits and MVP blueprints.",
    to: "/services/technical-consulting",
    accent: false,
  },
];

const Home = () => {
  return (
    <>
      <section className="home-hero">
        <div className="container">
          <div className="home-hero-content">
            <p className="wf-eyebrow">Senior software expertise</p>
            <h1 className="home-hero-title">
              Real engineering, three ways to put it to work
            </h1>
            <p className="home-hero-subtitle">
              AI automations, AI built into your product, and technical guidance
              for founders — from a senior engineer with 10+ years shipping
              production software. Which are you?
            </p>
            <a
              href={CALENDLY_URL}
              className="home-hero-btn"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaCalendarAlt className="home-hero-btn-icon" />
              Book a call →
            </a>
          </div>
        </div>
      </section>

      <section className="home-sorter">
        <div className="container">
          <div className="home-sorter-grid">
            {services.map((service) => (
              <Link
                key={service.to}
                to={service.to}
                className={
                  service.accent
                    ? "home-service-card home-service-card-accent"
                    : "home-service-card"
                }
              >
                <p className="home-service-for">{service.eyebrow}</p>
                <h2 className="home-service-name">{service.name}</h2>
                <p className="home-service-line">{service.line}</p>
                <span className="home-service-link">Explore →</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <AwWhyWorkWithMe />
      <AwHowItWorks title="How I work" />
      <AwFinalCta />
    </>
  );
};

export default Home;
```

- [ ] **Step 2: Replace the stylesheet**

Replace the entire contents of `src/components/Home.css` with:

```css
/* Homepage hub — scoped styles. Uses the light-theme variables and reuses
   wf-eyebrow / container / section utilities from the shared design system. */

.home-hero {
  padding: var(--spacing-xl) var(--spacing-sm) var(--spacing-lg);
  text-align: center;
  background: var(--hero-bg);
}

.home-hero-content {
  max-width: 780px;
  margin: 0 auto;
}

.home-hero-title {
  font-size: clamp(2rem, 5vw, 3.25rem);
  line-height: 1.1;
  margin: var(--spacing-xs) 0 var(--spacing-sm);
}

.home-hero-subtitle {
  font-size: 1.15rem;
  color: var(--color-text-light);
  max-width: 640px;
  margin: 0 auto var(--spacing-md);
}

.home-hero-btn {
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-xs);
  background: var(--gradient-accent);
  color: var(--btn-ink);
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  font-weight: 600;
}

.home-hero-btn:hover {
  filter: brightness(1.08);
  color: var(--btn-ink);
}

.home-hero-btn-icon {
  font-size: 0.9rem;
}

.home-sorter {
  padding: var(--spacing-lg) var(--spacing-sm);
}

.home-sorter-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--spacing-md);
  max-width: 1100px;
  margin: 0 auto;
}

.home-service-card {
  display: flex;
  flex-direction: column;
  padding: var(--spacing-md);
  border: 1px solid var(--color-border);
  border-radius: 0.75rem;
  background: var(--color-bg-light);
  transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease;
}

.home-service-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-md);
  border-color: var(--color-primary);
}

.home-service-card-accent {
  border-color: var(--color-primary);
  background: var(--primary-soft-2);
  box-shadow: var(--shadow-sm);
}

.home-service-for {
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  font-weight: 700;
  color: var(--color-primary);
  margin-bottom: var(--spacing-xs);
}

.home-service-card:not(.home-service-card-accent) .home-service-for {
  color: var(--color-text-light);
}

.home-service-name {
  font-size: 1.35rem;
  margin-bottom: var(--spacing-xs);
  color: var(--color-text);
}

.home-service-line {
  font-size: 0.98rem;
  color: var(--color-text-light);
  line-height: 1.6;
  flex-grow: 1;
}

.home-service-link {
  margin-top: var(--spacing-sm);
  font-weight: 600;
  color: var(--color-primary);
}

@media (max-width: 768px) {
  .home-sorter-grid {
    grid-template-columns: 1fr;
  }
}
```

- [ ] **Step 3: Verify lint and build**

Run: `npm run lint` → zero warnings (every import — `FaCalendarAlt`, `Link`, `CALENDLY_URL`, the three `Aw*` components — is used).
Run: `npm run build` → success.

- [ ] **Step 4: Manual verification**

`npm run dev`, open `http://localhost:5173/`:
- Hero: blue eyebrow, title "Real engineering, three ways to put it to work", subtitle, "Book a call" button.
- Sorter: three cards; the two AI cards (Automations, AI Integration) have the blue accent treatment, Technical Consulting is the plain third; each links to its service page (click each, confirm it lands on the right page).
- Below: "Why work with me" (four items), "How I work" (three steps), final CTA. The four trust items appear once (not duplicated).
- Narrow below 768px: cards stack to one column.

- [ ] **Step 5: Commit (surface, do not run)**

```bash
git add src/components/Home.tsx src/components/Home.css
git commit -m "feat: build buyer-led homepage hub (hero + service sorter)"
```

---

### Task 3: Repoint header nav and footer

Update the header nav (currently broken `/#use-cases` / `/#how-it-works` anchors — that content moved off `/`) and the footer to the three service routes. Independently reviewable: nav/footer link targets and labels.

**Files:**
- Modify: `src/components/Header.tsx` — replace the two hash-anchor nav links with three service links
- Modify: `src/components/Footer.tsx` — replace the two hash-anchor links with the automations service link; keep the other two service links

**Interfaces:**
- Consumes: `Link` (react-router-dom) — already imported in both files; `CALENDLY_URL` — already imported in both.
- Produces: nav/footer pointing at `/services/automated-workflows`, `/services/ai-integration`, `/services/technical-consulting`.

- [ ] **Step 1: Update `Header.tsx` nav**

Replace the two `<a href="/#…">` links inside `<nav className="site-header-nav">` with three `<Link>`s (keep the existing `Book a call` `<a>` after them):

```tsx
        <nav className="site-header-nav">
          <Link to="/services/automated-workflows" className="site-header-link">
            Automations
          </Link>
          <Link to="/services/ai-integration" className="site-header-link">
            AI Integration
          </Link>
          <Link to="/services/technical-consulting" className="site-header-link">
            Consulting
          </Link>
          <a
            href={CALENDLY_URL}
            className="site-header-cta"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaCalendarAlt className="site-header-cta-icon" />
            Book a call
          </a>
        </nav>
```

(`Link` is already imported at the top of `Header.tsx`; leave that import.)

- [ ] **Step 2: Update `Footer.tsx` links**

Replace the two `<a href="/#…">` links in `<nav className="footer-links">` with a single Automations service link, so the footer lists the three services then Book a call:

```tsx
          <nav className="footer-links">
            <Link to="/services/automated-workflows">Automations</Link>
            <Link to="/services/ai-integration">AI integration</Link>
            <Link to="/services/technical-consulting">
              Technical consulting
            </Link>
            <a href={CALENDLY_URL} target="_blank" rel="noopener noreferrer">
              Book a call
            </a>
          </nav>
```

- [ ] **Step 3: Verify lint and build**

Run: `npm run lint` → zero warnings (no leftover unused imports).
Run: `npm run build` → success.

- [ ] **Step 4: Manual verification**

`npm run dev`:
- Header: three nav links (Automations · AI Integration · Consulting) + Book a call; each navigates to the correct service page; none point at a dead `/#…` anchor.
- Footer: Automations · AI integration · Technical consulting · Book a call — all resolve.
- From `/services/automated-workflows`, the in-page `#use-cases` / `#how-it-works` anchors that live there still work (unchanged by this task).

- [ ] **Step 5: Commit (surface, do not run)**

```bash
git add src/components/Header.tsx src/components/Footer.tsx
git commit -m "feat: repoint nav + footer to the three service pages"
```

---

## Self-Review (completed by plan author)

- **Spec coverage:** buyer-led hub at `/` (Task 1+2), Layout A sorter with two AI cards accented + consulting third (Task 2), router+credibility depth via `AwWhyWorkWithMe` + `AwHowItWorks` (Task 2), automations relocated wholesale (Task 1), nav→three services + footer update (Task 3), hero/card/trust copy verbatim (Task 2). ✓
- **Trust-strip dedup:** the spec's separate "trust strip" and "Why work with me" are the same four items; the plan renders them once via `AwWhyWorkWithMe` and says so explicitly. Flagged to the user; spec to be updated to match. ✓
- **Placeholder scan:** no TBD/TODO; all JSX/CSS complete inline. ✓
- **Type/name consistency:** service `to` paths match the existing routes exactly; `AwHowItWorks` called with required `title` prop; every reused class/variable verified to exist. ✓
- **Import hygiene:** `Navigate` removed from `App.tsx` when its last use is deleted (Task 1); every other import is used. ✓

## Open follow-ups (not blocking)

- `AwHowItWorks` step copy is automation-flavored ("repetitive work", "automation around your existing tools"). On a unified hub it reads slightly automations-specific; a later copy pass could genericize it, but per spec it is reused as-is for now.
- The hub hero is text-first; `HeroMontage` stays reserved for the automations page.
