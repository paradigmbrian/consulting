# AI Integration Service Page Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

> **RE-BASELINED 2026-07-19** against the current `main` (`6269c7c "refactor layout"`).
> The site was restructured into an AI-forward homepage — the landing page was retired,
> `/` renders the automated-workflows page, the header nav is hardcoded, and
> `data/services.ts` is now vestigial (no consumers). The earlier version of this plan
> assumed a data-driven nav/landing and is obsolete. This version targets the real
> structure: AI Integration is a **secondary service page**, a peer of
> `/services/technical-consulting`, surfaced via a **Footer link**.

**Goal:** Add an "AI Integration" secondary service page at `/services/ai-integration` presenting the two-rung offer (AI Opportunity Audit → AI Integration Sprint), surfaced through a Footer link, matching the current light-theme design system.

**Architecture:** Mirrors the existing `TechnicalConsulting.tsx` secondary-service-page pattern: a component that composes sections. It reuses the existing `offer-*` tier-card classes (`Offer.css`), `steps`/`step` classes (`HowItWorks.css`), the shared `wf-eyebrow` label (`shared-sections.css`), global `section-title`/`section-content`/`btn` utilities (`index.css`/`Hero.css`), and the shared `<CTA />` component. The route already exists under `Layout`; a Footer link makes it reachable, exactly as Technical Consulting is reached.

**Tech Stack:** React 18 + TypeScript, Vite 5, react-router-dom v6, vanilla CSS with custom properties, react-icons.

## Global Constraints

- **No test harness exists in this repo.** Do not add one (YAGNI). Verification for every task is: `npm run lint` (zero warnings) → `npm run build` (tsc + vite) → manual check in `npm run dev` at the stated URL. A task is "done" only when lint and build both pass clean.
- **Git writes are performed by Brian, not the executing agent.** Never run `git add`/`git commit`/`git checkout` or any git write. Leave changes in the working tree; surface commit commands for Brian. To *undo* a tracked-file change, edit the file back by hand (a plain Edit is not a git op) — do not `git checkout`.
- **Current working-tree state (from a prior aborted run):** `src/App.tsx` already contains the `AiIntegration` import and the `/services/ai-integration` route; `src/components/AiIntegration.tsx` + `AiIntegration.css` already exist as a minimal shell; `src/data/services.ts` was erroneously given an extra entry that has no effect and must be reverted (Task 1). Verify each of these rather than assuming.
- **CSS:** vanilla CSS with custom properties only. Use the real theme variables — `--color-primary` (#2563eb), `--color-text` , `--color-text-light`, `--color-bg`, `--color-bg-light`, `--color-border`, `--shadow-sm`, `--spacing-xs|sm|md|lg|xl`, `--max-width`. Do NOT invent variables (no `--color-accent`, `--color-surface`, `--color-text-muted`, no hardcoded hex like `#6c5ce7`).
- **Calendly:** import `CALENDLY_URL` from `../data/site` (do not inline the URL literal).
- **Slug** is exactly `ai-integration`, used identically in the route path and the Footer link `to`.
- **Copy is locked by the approved spec** (`docs/superpowers/specs/2026-07-19-ai-into-product-service-line-design.md`): audit = $3,000 crediting toward a sprint; sprint = $10,000–20,000, 2–4 weeks; scope is strictly LLM-into-product. Do not invent new pricing or scope.
- **Responsive:** mobile-first, breakpoint at 768px (match existing components).
- **No `netlify.toml` change** — the SPA fallback already serves any client route.

---

### Task 1: Surface the page — Footer link, verify route/shell, revert services.ts

Make the existing `/services/ai-integration` route reachable via a Footer link (mirroring Technical Consulting) and undo the inert `services.ts` edit left by the prior run. Independently reviewable: the reviewer confirms the footer link renders and navigates, the route resolves to the shell, and `services.ts` is back to its original two entries.

**Files:**
- Modify: `src/components/Footer.tsx` — add the AI integration link
- Modify: `src/data/services.ts` — remove the erroneously-added third entry (restore to original)
- Verify (no change expected): `src/App.tsx` route + import; `src/components/AiIntegration.tsx` + `.css` shell exist and render

**Interfaces:**
- Consumes: `Link` from `react-router-dom` (already imported in `Footer.tsx`); the route `/services/ai-integration` (already registered in `App.tsx`).
- Produces: a reachable `/services/ai-integration` page and a Footer entry linking to it. No new exported symbols.

- [ ] **Step 1: Revert the inert `services.ts` edit**

Open `src/data/services.ts`. If it contains an `ai-integration` entry (added by the prior run), remove that object so the `services` array has exactly the two original entries (`technical-consulting`, `automated-workflows`) followed by `publishedServices` and `servicePath`. The block to delete is:

```ts
  {
    slug: "ai-integration",
    label: "AI Integration",
    summary:
      "Embed AI into the product you already have — starting with a fixed-fee opportunity audit, not a rebuild.",
    published: true,
  },
```

(If it is already absent, make no change.)

- [ ] **Step 2: Add the Footer link**

In `src/components/Footer.tsx`, add an AI integration link immediately after the existing "Technical consulting" `<Link>`, inside `<nav className="footer-links">`:

```tsx
            <Link to="/services/technical-consulting">
              Technical consulting
            </Link>
            <Link to="/services/ai-integration">AI integration</Link>
```

- [ ] **Step 3: Verify the route and shell are present**

Confirm (read-only) that `src/App.tsx` contains `import AiIntegration from "./components/AiIntegration";` and a `<Route path="/services/ai-integration" element={<AiIntegration />} />` inside the `<Route element={<Layout />}>` block, and that `src/components/AiIntegration.tsx` + `AiIntegration.css` exist. If any is missing, create it: minimal shell —

```tsx
import "./AiIntegration.css";

const AiIntegration = () => (
  <section className="ai-hero">
    <div className="container">
      <div className="ai-hero-content">
        <h1 className="ai-hero-title">AI Integration</h1>
      </div>
    </div>
  </section>
);

export default AiIntegration;
```

- [ ] **Step 4: Verify lint and build pass**

Run: `npm run lint`
Expected: no errors, no warnings.

Run: `npm run build`
Expected: TypeScript check passes, Vite build completes, no errors.

- [ ] **Step 5: Manual verification in dev server**

Run: `npm run dev`, then check:
- `http://localhost:5173/` — scroll to the footer: it now shows an "AI integration" link between "Technical consulting" and "Book a call".
- Clicking "AI integration" navigates to `/services/ai-integration` and renders the shell (heading "AI Integration") inside the site layout (header + footer).

- [ ] **Step 6: Commit (surface command, do not run)**

```bash
git add src/components/Footer.tsx src/data/services.ts src/App.tsx src/components/AiIntegration.tsx src/components/AiIntegration.css
git commit -m "feat: add reachable AI Integration service route + footer link"
```

---

### Task 2: Build the AI Integration page content

Replace the shell with the full page: hero, positioning, two-tier offer (Audit → Sprint), how-it-works funnel, proof section, and the shared final CTA — all on the current light theme. Independently reviewable: a reviewer can accept/reject page copy and layout without touching Task 1 wiring.

**Files:**
- Modify: `src/components/AiIntegration.tsx` — full page content (replace entire file)
- Modify: `src/components/AiIntegration.css` — full scoped styles (replace entire file)

**Interfaces:**
- Consumes: shared `CTA` component (`src/components/CTA.tsx`, default export, no props); `CALENDLY_URL` from `src/data/site.ts`; global utilities (`container`, `section-content`, `section-title`, `btn`, `btn-primary`, `btn-large`, `btn-secondary`, `btn-icon`); shared `wf-eyebrow` (`shared-sections.css`); `offer-*` classes (`Offer.css`); `steps`/`step*` classes (`HowItWorks.css`).
- Produces: no new exported symbols; same default export `AiIntegration`.

> **Note on reused classes:** `offer-*`, `steps`/`step`, `wf-eyebrow`, and base `btn*` classes are defined in sibling component CSS that is globally bundled. Reusing them is intentional and DRY, matching how `TechnicalConsulting.tsx` composes its page. `.offer-grid` is a 3-column grid; the `.ai-offer-grid` modifier below narrows it to 2 columns and centers it for the two tiers.

- [ ] **Step 1: Replace the page component**

Replace the entire contents of `src/components/AiIntegration.tsx` with:

```tsx
import {
  FaCalendarAlt,
  FaClipboardCheck,
  FaRocket,
  FaPhone,
  FaBolt,
} from "react-icons/fa";
import { HiClock, HiCurrencyDollar, HiLightBulb } from "react-icons/hi";
import { CALENDLY_URL } from "../data/site";
import CTA from "./CTA";
import "./AiIntegration.css";

const AiIntegration = () => {
  const scrollToOffer = () => {
    document.getElementById("ai-offer")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      <section className="ai-hero">
        <div className="container">
          <div className="ai-hero-content">
            <div className="ai-hero-icon">
              <HiLightBulb />
            </div>
            <p className="wf-eyebrow">Paradigm Shift — AI Integration</p>
            <h1 className="ai-hero-title">
              AI, Built Into the Product
              <br />
              You Already Have
            </h1>
            <p className="ai-hero-subtitle">
              Start with a fixed-fee roadmap — not a rebuild.
            </p>
            <div className="ai-hero-cta">
              <a
                href={CALENDLY_URL}
                className="btn btn-primary btn-large"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaCalendarAlt className="btn-icon" />
                Book a 30-minute call →
              </a>
              <button className="btn btn-secondary" onClick={scrollToOffer}>
                See the engagements
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="ai-who">
        <div className="container">
          <div className="section-content">
            <h2 className="section-title">Who this is for</h2>
            <p className="ai-who-text">
              Funded startups and established businesses who know AI belongs in
              their product — but don't yet know what's actually worth building,
              or whether their systems and data can support it. You want a
              working capability inside the product you already have, not a
              standalone chatbot and not a full-time ML team to find out.
            </p>
          </div>
        </div>
      </section>

      <section id="ai-offer" className="offer">
        <div className="container">
          <div className="section-content">
            <h2 className="section-title">Two ways to start</h2>

            <div className="offer-grid ai-offer-grid">
              <div className="offer-item">
                <div className="offer-item-icon">
                  <FaClipboardCheck />
                </div>
                <h3 className="offer-item-title">AI Opportunity Audit</h3>
                <p className="offer-item-subtitle">
                  The fixed-fee starting point
                </p>

                <div className="offer-item-details">
                  <div className="offer-item-detail">
                    <HiCurrencyDollar className="offer-item-detail-icon" />
                    <span>$3,000</span>
                  </div>
                  <div className="offer-item-detail">
                    <HiClock className="offer-item-detail-icon" />
                    <span>8–12 hrs, fully async</span>
                  </div>
                </div>

                <div className="offer-item-section">
                  <h4 className="offer-item-section-title">What it is</h4>
                  <p className="offer-item-section-text">
                    A focused review of your product and data that tells you
                    where AI genuinely adds value — before you commit to a build.
                    You get a written report plus a 45-minute walkthrough call.
                  </p>
                </div>

                <div className="offer-item-section">
                  <h4 className="offer-item-section-title">You leave with</h4>
                  <ul className="offer-item-list">
                    <li>3–5 concrete AI opportunities, ranked by value vs. effort</li>
                    <li>A feasibility check against your current systems</li>
                    <li>A data-readiness assessment — what plumbing is missing</li>
                    <li>A recommended first build with rough scope and cost</li>
                  </ul>
                </div>

                <div className="offer-item-section">
                  <h4 className="offer-item-section-title">Outcome</h4>
                  <p className="offer-item-section-text">
                    You know exactly what to build first and why — and the
                    $3,000 fee credits toward the sprint if you move forward.
                  </p>
                </div>
              </div>

              <div className="offer-item">
                <div className="offer-item-icon">
                  <FaRocket />
                </div>
                <h3 className="offer-item-title">AI Integration Sprint</h3>
                <p className="offer-item-subtitle">
                  The build, scoped from your audit
                </p>

                <div className="offer-item-details">
                  <div className="offer-item-detail">
                    <HiCurrencyDollar className="offer-item-detail-icon" />
                    <span>$10,000 – $20,000</span>
                  </div>
                  <div className="offer-item-detail">
                    <HiClock className="offer-item-detail-icon" />
                    <span>2–4 weeks, fixed scope</span>
                  </div>
                </div>

                <div className="offer-item-section">
                  <h4 className="offer-item-section-title">What it is</h4>
                  <p className="offer-item-section-text">
                    One working, shipped AI capability inside your product — an
                    embedded assistant, an LLM-powered feature, or an internal
                    agent with real data context. Fixed scope, taken straight
                    from the top of your audit.
                  </p>
                </div>

                <div className="offer-item-section">
                  <h4 className="offer-item-section-title">Best if you:</h4>
                  <ul className="offer-item-list">
                    <li>Have a live product AI should live inside</li>
                    <li>Want a shipped capability, not a proof-of-concept</li>
                    <li>Prefer a fixed price over an open-ended build</li>
                    <li>Have completed (or will start with) the audit</li>
                  </ul>
                </div>

                <div className="offer-item-section">
                  <h4 className="offer-item-section-title">Data not ready?</h4>
                  <p className="offer-item-section-text">
                    If the audit shows your data isn't usable yet, the first
                    sprint becomes a Data-Ready-for-AI foundation — pipelines and
                    retrieval setup — so the capability sprint that follows has
                    solid ground to stand on.
                  </p>
                </div>
              </div>
            </div>

            <div className="ai-offer-note">
              <p>
                Not sure where you land? Most teams start with the{" "}
                <strong>AI Opportunity Audit</strong>. It's low-risk, valuable on
                its own, and tells us both whether a sprint makes sense.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="how-it-works">
        <div className="container">
          <div className="section-content">
            <h2 className="section-title">How we'd work together</h2>
            <div className="steps">
              <div className="step">
                <div className="step-number">
                  <FaPhone className="step-icon" />
                </div>
                <div className="step-content">
                  <h3>Book a call</h3>
                  <p>
                    A 30-minute conversation to understand your product, your
                    data, and what you're hoping AI can do inside it.
                  </p>
                </div>
              </div>
              <div className="step">
                <div className="step-number">
                  <FaClipboardCheck className="step-icon" />
                </div>
                <div className="step-content">
                  <h3>AI Opportunity Audit</h3>
                  <p>
                    A fixed-fee review that turns the hype into a ranked, feasible
                    roadmap — with a recommended first build and a real cost.
                  </p>
                </div>
              </div>
              <div className="step">
                <div className="step-number">
                  <FaRocket className="step-icon" />
                </div>
                <div className="step-content">
                  <h3>AI Integration Sprint</h3>
                  <p>
                    In 2–4 weeks, the top opportunity ships as a working
                    capability inside your product. The audit fee credits over.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="ai-proof">
        <div className="container">
          <div className="section-content">
            <h2 className="section-title">Why work with me</h2>
            <div className="ai-proof-card">
              <div className="ai-proof-icon">
                <FaBolt />
              </div>
              <p className="ai-proof-text">
                I build AI <em>into</em> existing products — not standalone bots.
                For an early-stage startup, I was handed the keys to an
                unfamiliar codebase and data model, learned it, and shipped a
                context-aware AI agent embedded in their live product in about
                two weeks. That's the whole offer: fast, scoped, and inside the
                thing you already have.
              </p>
            </div>
          </div>
        </div>
      </section>

      <CTA />
    </>
  );
};

export default AiIntegration;
```

- [ ] **Step 2: Replace the stylesheet**

Replace the entire contents of `src/components/AiIntegration.css` with:

```css
/* AI Integration service page — scoped styles.
   Reuses global utilities, offer-*/steps classes, and the wf-eyebrow label;
   only net-new elements are styled here, using the current light theme. */

.ai-hero {
  padding: var(--spacing-xl) var(--spacing-sm) var(--spacing-lg);
  text-align: center;
}

.ai-hero-content {
  max-width: 760px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.ai-hero-icon {
  font-size: 3rem;
  color: var(--color-primary);
  margin-bottom: var(--spacing-sm);
}

.ai-hero-title {
  font-size: clamp(2rem, 5vw, 3.25rem);
  line-height: 1.1;
  margin-bottom: var(--spacing-sm);
}

.ai-hero-subtitle {
  font-size: 1.15rem;
  color: var(--color-text-light);
  margin-bottom: var(--spacing-md);
}

.ai-hero-cta {
  display: flex;
  gap: var(--spacing-sm);
  flex-wrap: wrap;
  justify-content: center;
}

.ai-who {
  padding: var(--spacing-md) 0;
}

.ai-who-text {
  max-width: 720px;
  margin: var(--spacing-sm) auto 0;
  text-align: center;
  font-size: 1.1rem;
  line-height: 1.7;
  color: var(--color-text-light);
}

/* Narrow the 3-column offer grid to 2 centered tiers. */
.ai-offer-grid {
  grid-template-columns: repeat(2, 1fr);
  max-width: 820px;
  margin-left: auto;
  margin-right: auto;
}

.ai-offer-note {
  max-width: 720px;
  margin: var(--spacing-md) auto 0;
  text-align: center;
  color: var(--color-text-light);
}

.ai-proof {
  padding: var(--spacing-md) 0 var(--spacing-lg);
}

.ai-proof-card {
  max-width: 760px;
  margin: var(--spacing-sm) auto 0;
  display: flex;
  gap: var(--spacing-sm);
  align-items: flex-start;
  padding: var(--spacing-md);
  border: 1px solid var(--color-border);
  border-radius: 0.75rem;
  background: var(--color-bg-light);
  box-shadow: var(--shadow-sm);
}

.ai-proof-icon {
  flex-shrink: 0;
  font-size: 1.75rem;
  color: var(--color-primary);
}

.ai-proof-text {
  font-size: 1.05rem;
  line-height: 1.7;
  margin: 0;
  text-align: left;
}

@media (max-width: 768px) {
  .ai-offer-grid {
    grid-template-columns: 1fr;
  }

  .ai-proof-card {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }

  .ai-proof-text {
    text-align: center;
  }
}
```

- [ ] **Step 3: Verify lint and build pass**

Run: `npm run lint`
Expected: no errors, no warnings. (Every imported icon — `FaCalendarAlt`, `FaClipboardCheck`, `FaRocket`, `FaPhone`, `FaBolt`, `HiClock`, `HiCurrencyDollar`, `HiLightBulb` — is referenced.)

Run: `npm run build`
Expected: TypeScript check passes, Vite build completes, no errors.

- [ ] **Step 4: Manual verification in dev server**

Run: `npm run dev`, open `http://localhost:5173/services/ai-integration`, confirm on the light theme:
- Hero renders with blue eyebrow, title, subtitle, two buttons; "See the engagements" smooth-scrolls to the offer section.
- The two offer cards ("AI Opportunity Audit" $3,000 / "AI Integration Sprint" $10,000–$20,000) render side by side and centered on desktop; they stack below 768px.
- "How we'd work together" three steps render.
- Proof card renders (blue bolt icon, light card) and stacks on mobile.
- Shared final CTA renders at the bottom.
- No console errors.

- [ ] **Step 5: Commit (surface command, do not run)**

```bash
git add src/components/AiIntegration.tsx src/components/AiIntegration.css
git commit -m "feat: build AI Integration service page content"
```

---

## Self-Review (completed by plan author)

- **Spec coverage:** positioning/one-liner (hero), target buyer (who-this-is-for), both rungs with locked pricing (offer cards), data-not-ready variant (card section), funnel (how-it-works), LLM-into-product scope (copy), proof point (why-work-with-me), and "secondary service page surfaced via Footer link" (Task 1) — all mapped. ✓
- **Placeholder scan:** no TBD/TODO; all JSX/CSS complete and inline. ✓
- **Type/name consistency:** slug `ai-integration` identical in the route and the Footer `to`; `#ai-offer` id matches `scrollToOffer`; every reused class verified to exist in the current codebase (`offer-*`, `steps`/`step*`, `wf-eyebrow`, `section-title`/`section-content`, base `btn*`). ✓
- **Theme correctness:** scoped CSS uses only real theme variables; no invented `--color-accent`/`--color-surface`/`#6c5ce7`. ✓
- **Import hygiene:** every imported icon is referenced; `CALENDLY_URL` sourced from `data/site.ts`. ✓
