# AI-Services Homepage Restructure Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax.

**Goal:** Make `/` the primary "AI Services for Small Business" homepage (absorbing the automation index), demote Technical Consulting to a footer/referral link, and lead with AI — reusing the existing automation components + demos.

**Architecture:** Repurpose the automation-index component as the homepage at `/`; 301-redirect the old index route to `/`; trim the header nav and expand the footer; add AI-forward hero copy, a trust strip, a "see it actually work" demos-proof section, and a short AI-specific FAQ. Detail pages, demos, and the consulting page are untouched.

**Tech Stack:** React 18 + TypeScript, Vite 5, vanilla CSS custom properties, react-router-dom v6, Netlify redirects.

## Global Constraints

- **No test framework.** Verify each task: `npm run lint` (zero warnings) + `npm run build` (tsc + vite) + browser walk (desktop + mobile <768px, dev server http://localhost:5174).
- **Git writes permitted** (this session). Commit each task, scoped paths.
- **Do not touch** the 9 workflow detail pages, the demos, or the Technical Consulting page content — only its nav placement changes.
- **Reuse, don't rebuild:** the homepage reuses the existing split hero + `HeroMontage`, the 9-card grid, `AwHowItWorks`, `AwWhyWorkWithMe`, `AwFinalCta`, and the `wf-shot`/`wf-faq` styles.
- **AI framing must stay honest:** the demos are Claude-powered, so "AI-powered automation" is accurate; do not overclaim on individual use-cases — keep their existing vetted copy.
- **Copy is brand-critical:** all new hero/trust/proof/FAQ copy in this plan is a *draft to validate live with the owner*; the FAQ's data-handling / reliability answers must be confirmed true before shipping.
- **Netlify redirect ordering:** any new 301 must sit **above** the `/*` SPA catch-all in `netlify.toml` (Netlify stops at the first match).

---

### Task 1: Routing, redirects, and meta

Point `/` at the automation homepage, redirect the old index route, fix the invalid-slug fallback, and update the page title/description.

**Files:**
- Modify: `src/App.tsx`
- Modify: `netlify.toml`
- Modify: `src/components/workflows/WorkflowPage.tsx`
- Modify: `index.html`

- [ ] **Step 1: Repoint routes in `App.tsx`**

Change the `/` route to render the automation homepage component and redirect the old index path. Replace the relevant routes:

```tsx
import { Routes, Route, Navigate } from "react-router-dom";
// …
        <Route element={<Layout />}>
          <Route path="/" element={<AutomatedWorkflows />} />
          <Route
            path="/services/automated-workflows"
            element={<Navigate to="/" replace />}
          />
          <Route
            path="/services/technical-consulting"
            element={<TechnicalConsulting />}
          />
          <Route
            path="/services/automated-workflows/:slug"
            element={<WorkflowPage />}
          />
        </Route>
```

Remove the `LandingPage` import (retired in Task 5).

- [ ] **Step 2: Netlify 301 for the old index**

In `netlify.toml`, add — **above** the `/*` catch-all, alongside the demo redirects:

```toml
[[redirects]]
  from = "/services/automated-workflows"
  to = "/"
  status = 301
```

(The detail redirects `/services/automated-workflows/:slug` are NOT affected — this rule matches the exact path only.)

- [ ] **Step 3: Fix the invalid-slug fallback**

In `WorkflowPage.tsx`, change `<Navigate to="/services/automated-workflows" replace />` → `<Navigate to="/" replace />` (so a bad slug doesn't bounce through the redirect).

- [ ] **Step 4: Update title + meta in `index.html`**

Replace the consulting-flavored `<title>` and `<meta name="description">`:

```html
<title>AI Automation for Small Business | Paradigm Shift Software Development</title>
<meta
  name="description"
  content="AI-powered automation for small and trades businesses — missed-call text-back, review generation, quoting, invoicing, dispatch and more, built on the tools you already use. See nine working demos."
/>
```

- [ ] **Step 5: Verify + browser check**

Run: `npm run lint && npm run build` (expect pass). In the dev server: `/` renders the automation homepage; visiting `/services/automated-workflows` redirects to `/`; a detail page and a demo still load; the consulting page still loads.

- [ ] **Step 6: Commit**

```bash
git add src/App.tsx netlify.toml src/components/workflows/WorkflowPage.tsx index.html
git commit -m "feat: make / the AI-services homepage; redirect old index route"
```

---

### Task 2: Header nav + footer

Remove the service links from the nav; move Technical Consulting into the footer; update the footer tagline.

**Files:**
- Modify: `src/components/Header.tsx` (+ `Header.css` if needed)
- Modify: `src/components/Footer.tsx` (+ `Footer.css`)

- [ ] **Step 1: Trim the header nav**

In `Header.tsx`, remove the `publishedServices` map and the `data/services` import. Nav becomes brand + two on-page anchors + the CTA:

```tsx
<nav className="site-header-nav">
  <Link to="/#use-cases" className="site-header-link">Use cases</Link>
  <Link to="/#how-it-works" className="site-header-link">How it works</Link>
  <a href="https://calendly.com/brian-paradigmshiftdev/30min" className="site-header-cta" target="_blank" rel="noopener noreferrer">
    <FaCalendarAlt className="site-header-cta-icon" />
    Book a call
  </a>
</nav>
```

(Anchor links use `/#…`; add anchor `id`s to the homepage sections in Task 3/4. `react-router` `Link` to a hash on the same page scrolls; `ScrollToTop` should not interfere — verify it only resets on pathname change, not hash. If it does interfere, gate it on `pathname` only.)

- [ ] **Step 2: Expand the footer**

In `Footer.tsx`, add a small link row and update the tagline:

```tsx
<div className="footer-content">
  <nav className="footer-links">
    <Link to="/#use-cases">Use cases</Link>
    <Link to="/#how-it-works">How it works</Link>
    <Link to="/services/technical-consulting">Technical consulting</Link>
    <a href="https://calendly.com/brian-paradigmshiftdev/30min" target="_blank" rel="noopener noreferrer">Book a call</a>
  </nav>
  <p className="footer-text">© {new Date().getFullYear()} Paradigm Shift Software Development, LLC</p>
  <p className="footer-tagline">AI-powered automation, built on the tools you already use.</p>
</div>
```

Add `import { Link } from "react-router-dom";`. Add `.footer-links` styling in `Footer.css` (centered row, wrap on mobile, muted links that read on the dark footer ground — reuse the footer's existing light-on-dark treatment).

- [ ] **Step 3: Verify + browser check**

Run: `npm run lint && npm run build`. Confirm the nav no longer shows the two service links, the footer shows the links incl. Technical consulting (reaching its page), and the tagline reads correctly on the dark footer.

- [ ] **Step 4: Commit**

```bash
git add src/components/Header.tsx src/components/Header.css src/components/Footer.tsx src/components/Footer.css
git commit -m "feat: trim nav to AI-services focus; move consulting to footer"
```

---

### Task 3: Homepage hero (AI-forward) + trust strip

Rework the homepage hero copy to lead with AI + small business, and add a compact trust strip under it. (The component is `AutomatedWorkflows.tsx` — retained name; it is now the homepage.)

**Files:**
- Modify: `src/components/AutomatedWorkflows.tsx`
- Modify: `src/components/AutomatedWorkflows.css`

- [ ] **Step 1: AI-forward hero copy**

Update the hero eyebrow/headline/subhead (validate live — these are drafts):

```tsx
<p className="wf-eyebrow">AI Services for Small Business</p>
<h1 className="aw-hero-title">
  Put AI to work on the busywork your business runs on
</h1>
<p className="aw-hero-subtitle">
  I build AI-powered automations that answer missed calls, chase invoices,
  ask for reviews, and turn messy requests into quotes — around the tools you
  already use, not a template you have to bend to fit. Backed by 10+ years as a
  professional software engineer.
</p>
```

Keep the existing `HeroMontage` visual. Add a secondary hero CTA "See it work →" that links to `#use-cases` (or a representative demo) beside the existing consult CTA, using the `wf-hero-actions` row.

- [ ] **Step 2: Trust strip**

Add a compact trust strip section immediately after the hero, before `aw-framing`:

```tsx
<section className="aw-trust">
  <div className="container">
    <ul className="aw-trust-list">
      <li>10+ years as a professional software engineer</li>
      <li>Real AI, not brittle no-code that breaks</li>
      <li>Built on the tools you already use</li>
      <li>Fixed scope, agreed up front — no surprise bills</li>
    </ul>
  </div>
</section>
```

Add `.aw-trust` / `.aw-trust-list` CSS: a horizontal, wrapping row of four items separated by a subtle divider/dot, muted text, on `--color-bg`; stacks on mobile. Tune live.

- [ ] **Step 3: Anchor id for the how-it-works section**

Ensure the `AwHowItWorks` section on this page can be targeted by `/#how-it-works`. Since `AwHowItWorks` renders its own `<section>`, wrap its usage on the homepage in `<div id="how-it-works">…</div>` (or pass through an id) — pick the lowest-friction option and note it. Add `id="use-cases"` to the `aw-examples` section in Task 4's area (or here).

- [ ] **Step 4: Verify + browser iterate**

Run: `npm run lint && npm run build`. Open `/`; iterate the hero copy, the trust strip layout, and the anchor scrolling until it reads as a confident AI-services homepage. Confirm `/#use-cases` and `/#how-it-works` scroll correctly.

- [ ] **Step 5: Commit**

```bash
git add src/components/AutomatedWorkflows.tsx src/components/AutomatedWorkflows.css
git commit -m "feat: AI-forward homepage hero + trust strip"
```

---

### Task 4: "See it actually work" proof section + AI FAQ

Add the demos-as-proof section (the differentiator) and a short AI-specific FAQ. Add the `use-cases` anchor.

**Files:**
- Modify: `src/components/AutomatedWorkflows.tsx`
- Modify: `src/components/AutomatedWorkflows.css`

- [ ] **Step 1: `id="use-cases"` on the examples section**

Add `id="use-cases"` to the `aw-examples` `<section>` so the nav anchor lands on the 9-card grid.

- [ ] **Step 2: "See it actually work" proof section**

Add after the use-cases grid (before How it works). Reuses a framed product-shot / `HeroMontage` as the visual:

```tsx
<section className="aw-proof">
  <div className="container">
    <div className="wf-hero-split">
      <div className="wf-hero-copy">
        <p className="wf-eyebrow">Proof, not promises</p>
        <h2 className="aw-hero-title">
          Most "AI automation" is a slideshow. These you can click through.
        </h2>
        <p className="aw-hero-subtitle">
          Every use case above has a working, click-through demo on a made-up
          business — the real thing, powered by Claude, so you can see exactly
          what happens at each step before you commit to anything.
        </p>
        <div className="wf-hero-actions">
          <Link to="/services/automated-workflows/review-generation/demo" className="aw-hero-btn">
            <FaPlay className="aw-hero-btn-icon" />
            Try a live demo →
          </Link>
        </div>
      </div>
      <div className="wf-hero-visual"><HeroMontage /></div>
    </div>
  </div>
</section>
```

Add `.aw-proof` band styling (alternating bg for rhythm); import `FaPlay`. Tune live.

- [ ] **Step 3: AI-specific FAQ**

Add a short FAQ section (reuse `wf-faq` styles) before the final CTA. **Draft — the owner must confirm the data/reliability answers are true before shipping:**

```tsx
const homeFaq = [
  { q: "Is this just ChatGPT with extra steps?",
    a: "No. It's an AI model (Claude) doing a specific job inside the tools you already use — reading a message, deciding what to do, drafting a reply, updating a record — not a chatbot you have to go and talk to. You don't change how you work; the work just gets done." },
  { q: "Is my business's data safe?",
    a: "Your data stays in the tools you already trust, and the automation only touches what the job needs. I'll walk you through exactly what it reads and writes on the call, and nothing goes live until you're comfortable with it." },
  { q: "What happens when the AI gets something wrong?",
    a: "It's built to hand off, not to guess. Anything it isn't sure about comes to you with the full context instead of being sent blindly — and the steps that matter (a quote, a public review) wait for your say-so." },
  { q: "Do I have to switch tools?",
    a: "No. It's built on top of what you already use — your phone, your inbox, your scheduling and invoicing software. If a tool can't be connected cleanly, I'll tell you on the call rather than sell you a rebuild." },
  { q: "What does it cost?",
    a: "Fixed scope, agreed up front — no hourly billing and no surprise scope creep. We work out what's worth automating first on a free call, and you get a price before anything is built." },
];
```

Render with the `wf-faq` markup (`<details className="wf-faq-item">…`). Add an eyebrow "Questions".

- [ ] **Step 4: Verify + browser iterate**

Run: `npm run lint && npm run build`. Open `/`; walk the full page desktop + mobile. Iterate the proof section + FAQ. Confirm the demo link works and the FAQ opens/closes.

- [ ] **Step 5: Commit**

```bash
git add src/components/AutomatedWorkflows.tsx src/components/AutomatedWorkflows.css
git commit -m "feat: 'see it work' demos-proof section + AI FAQ on the homepage"
```

---

### Task 5: Retire the old landing + verification sweep

**Files:**
- Delete: `src/components/LandingPage.tsx`, `src/components/LandingPage.css`
- (Confirm no remaining imports.)

- [ ] **Step 1: Delete the retired landing**

Remove `src/components/LandingPage.tsx` + `LandingPage.css`. Run `grep -rn "LandingPage" src` — expect no matches (App.tsx import removed in Task 1).

- [ ] **Step 2: Lint + build**

Run: `npm run lint && npm run build` — both pass.

- [ ] **Step 3: Full browser walk (desktop + mobile)**

Verify: `/` = the AI-services homepage (hero → trust strip → where it fits → use cases → see-it-work → how it works → why me → FAQ → CTA); `/services/automated-workflows` redirects to `/`; nav has no service links and the anchors scroll; footer links work incl. Technical consulting → its page; a detail page + a demo still work; the consulting page is intact; mobile stacks cleanly.

- [ ] **Step 4: Commit**

```bash
git add -A src/components
git commit -m "chore: retire the old dual-service landing page"
```

---

## Self-Review notes

- **Spec coverage:** IA/redirects → Task 1; nav/footer → Task 2; AI hero + trust strip → Task 3; demos-proof + FAQ → Task 4; retire landing + verify → Task 5. Title/meta → Task 1 Step 4. Anchors → Tasks 2–4.
- **Consistency:** the homepage component (`AutomatedWorkflows.tsx`) is mounted at `/` in Task 1 and expanded in Tasks 3–4; anchor ids (`use-cases`, `how-it-works`) are added where the nav/footer links (Task 2) point.
- **Copy honesty:** all new copy is flagged as owner-review drafts; the FAQ's data/reliability claims must be confirmed true before shipping — called out, not assumed.
- **Risk:** the only routing subtlety (ScrollToTop vs hash anchors) is called out in Task 2 with a mitigation.
