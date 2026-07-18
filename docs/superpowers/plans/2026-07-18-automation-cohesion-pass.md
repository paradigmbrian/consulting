# Phase 3 — Automation-Side Cohesion Pass Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax.

**Goal:** Bring the detail-page design language (split heroes with real demo-card product-shots, eyebrow labels, framed cards) to the Landing page and the Automated-Workflows index, so the automation journey reads as one designed system.

**Architecture:** Extract the reusable presentational CSS (product-shot frame, eyebrow, split-hero, feature-row) out of `WorkflowPage.css` into shared stylesheets, then restructure the two pages' heroes into split layouts anchored by `ShowcaseFrame` product-shots (reusing existing showcase modules' demo cards) and polish their cards.

**Tech Stack:** React 18 + TypeScript, Vite 5, vanilla CSS custom properties, react-icons, react-router-dom v6.

## Global Constraints

- **No test framework.** Verify each task with `npm run lint` (zero warnings) + `npm run build` (tsc + vite) + a browser walk (dev server http://localhost:5174, Claude-in-Chrome), desktop and mobile (<768px).
- **Git writes permitted** (Brian, this session). Commit each task with scoped paths.
- **Detail pages must not change appearance** — the CSS extraction is a pure move; verify a detail page renders identically after.
- **Reuse, don't fork:** hero visuals reuse existing `src/showcases/*` demo cards via `ShowcaseFrame`; all framed shots keep the "Illustrative" tag.
- **Scope:** Landing (`src/components/LandingPage.tsx`) + index (`src/components/AutomatedWorkflows.tsx`) only. No Technical Consulting, no shared `Aw*`/`CTA` changes, no copy rewrites beyond promoting existing text to eyebrows, no new stats.
- **Visual polish is iterated live** (Task 2 hero/montage/cards) against the detail-page look, then reused for Landing — the CSS in this plan is a labeled starting point, not final pixels.

---

### Task 1: Extract shared presentational CSS (pure move)

Move the page-agnostic styles out of `WorkflowPage.css` so any page can render a product-shot / eyebrow / split-hero. No visual change anywhere.

**Files:**
- Create: `src/showcases/showcase.css`
- Create: `src/components/shared-sections.css`
- Modify: `src/showcases/ShowcaseFrame.tsx` (import `showcase.css`)
- Modify: `src/components/workflows/WorkflowPage.css` (remove the moved rules)
- Modify: `src/components/workflows/WorkflowPage.tsx` (import `shared-sections.css`) — or import it wherever the moved layout classes are used.

- [ ] **Step 1: Create `showcase.css` with the product-shot frame rules**

Move these rules verbatim from `WorkflowPage.css` into `src/showcases/showcase.css`: `.wf-shot`, `.wf-shot-layered::before`, `.wf-shot-skeleton`, `.wf-shot-tag`. (These reference `--demo-*` tokens, which `ShowcaseFrame` already loads via `demoTokens.css`.)

- [ ] **Step 2: Import `showcase.css` in `ShowcaseFrame.tsx`**

Add `import "./showcase.css";` to `src/showcases/ShowcaseFrame.tsx`. Now any page using `ShowcaseFrame` gets frame styling without depending on `WorkflowPage.css`.

- [ ] **Step 3: Create `shared-sections.css` with the layout utilities**

Move these rules verbatim from `WorkflowPage.css` into `src/components/shared-sections.css`: `.wf-eyebrow`, `.wf-hero-split`, `.wf-hero-copy`, `.wf-hero-copy .wf-hero-actions`, `.wf-hero-copy .wf-hero-stats-label`/`-row`, `.wf-hero-visual`, `.wf-feature-row`, `.wf-feature-row:last-child`, `.wf-feature-row-flip .wf-feature-copy`, `.wf-feature-copy`, `.wf-feature-title`, `.wf-feature-visual`, and the `@media (max-width: 768px)` rules that target `.wf-hero-split` / `.wf-feature-row`. Leave `.wf-hero` (band padding/bg), `.wf-features` band, `.wf-hero-content`, and all detail-specific bands in `WorkflowPage.css`.

- [ ] **Step 4: Import `shared-sections.css` where the classes are used**

Add `import "../shared-sections.css";` to `WorkflowPage.tsx` (the detail page still uses these classes). It will also be imported by Landing and Index in later tasks.

- [ ] **Step 5: Remove the moved rules from `WorkflowPage.css`**

Delete the rules moved in Steps 1 and 3 from `WorkflowPage.css` (no duplicates left).

- [ ] **Step 6: Verify lint + build**

Run: `npm run lint && npm run build`
Expected: both pass.

- [ ] **Step 7: Browser check — detail page unchanged**

Open `/services/automated-workflows/review-generation`. Expected: identical to before (split hero, framed shots with Illustrative tag, feature rows) — the move is invisible.

- [ ] **Step 8: Commit**

```bash
git add src/showcases/showcase.css src/components/shared-sections.css src/showcases/ShowcaseFrame.tsx src/components/workflows/WorkflowPage.css src/components/workflows/WorkflowPage.tsx
git commit -m "refactor: extract shared product-shot + section CSS for reuse"
```

---

### Task 2: Restructure the Automated-Workflows index

Split hero with a demo-card montage, eyebrows, and polished cards. This is the biggest visual mismatch and where the hero-montage pattern is locked. Iterate live.

**Files:**
- Create: `src/showcases/HeroMontage.tsx` (a small reusable two-card product-shot montage)
- Modify: `src/components/AutomatedWorkflows.tsx`
- Modify: `src/components/AutomatedWorkflows.css`

**Interfaces:**
- Produces: `HeroMontage` — `() => JSX.Element` rendering two `ShowcaseFrame`s (reusing existing showcase modules' cards, e.g. reviewGeneration "review" + missedCallTextBack "booked") in a stacked/offset arrangement for hero use. Direct (non-lazy) imports of those showcase modules.

- [ ] **Step 1: Build `HeroMontage.tsx`**

Render two curated demo cards as offset framed shots. Starting implementation:

```tsx
import ShowcaseFrame from "./ShowcaseFrame";
import ReviewGeneration from "./reviewGeneration";
import MissedCall from "./missedCallTextBack";
import "./heroMontage.css";

const HeroMontage = () => (
  <div className="hero-montage">
    <div className="hero-montage-back">
      <ShowcaseFrame>
        <MissedCall snippet="booked" />
      </ShowcaseFrame>
    </div>
    <div className="hero-montage-front">
      <ShowcaseFrame layered>
        <ReviewGeneration snippet="review" />
      </ShowcaseFrame>
    </div>
  </div>
);

export default HeroMontage;
```

Create `src/showcases/heroMontage.css` with a starting layout (absolute-positioned offset stack on desktop, simple stack on mobile) — tuned live in Step 4:

```css
.hero-montage { position: relative; width: 100%; max-width: 460px; }
.hero-montage-front { position: relative; z-index: 2; }
.hero-montage-back {
  position: absolute; top: -32px; right: -28px; z-index: 1;
  width: 78%; opacity: 0.92; transform: rotate(2deg);
}
@media (max-width: 768px) {
  .hero-montage-back { display: none; }
}
```

- [ ] **Step 2: Rebuild the index hero as a split**

In `AutomatedWorkflows.tsx`, replace the `aw-hero-content` block with a split: reuse the shared `.wf-hero-split` / `.wf-hero-copy` / `.wf-hero-visual` / `.wf-eyebrow` classes (now shared). Add `import "./workflows/... "`? No — add `import HeroMontage from "../showcases/HeroMontage";` and `import "./shared-sections.css";`. Structure: eyebrow "Automated Workflows", the existing `aw-hero-title` + `aw-hero-subtitle` + the CTA in `.wf-hero-copy`, and `<div className="wf-hero-visual"><HeroMontage /></div>`. Keep `aw-hero` section bg.

- [ ] **Step 3: Add eyebrows + polish cards**

- Add a `.wf-eyebrow` above the `aw-framing` heading ("Where it fits") and the `aw-examples` heading ("A few examples").
- In `AutomatedWorkflows.css`, upgrade `.aw-example-card` to the detail-page card language (border `--color-border`, `--shadow-sm`, hover `translateY(-2px)` + `--shadow-md`, arrow affordance on `.aw-example-card-link`). Make `.aw-framing-list` a two-column checklist (grid, check/arrow markers) if not already.

- [ ] **Step 4: Browser iteration (the design gate)**

Open `/services/automated-workflows`. Iterate the montage offset/scale, hero balance, eyebrow, and card hover until it matches the detail-page polish, desktop + mobile. Lock the `HeroMontage` + card styles.

- [ ] **Step 5: Verify lint + build, then commit**

Run: `npm run lint && npm run build` (expect pass), then:

```bash
git add src/showcases/HeroMontage.tsx src/showcases/heroMontage.css src/components/AutomatedWorkflows.tsx src/components/AutomatedWorkflows.css
git commit -m "feat: split hero + eyebrows + polished cards on the workflows index"
```

---

### Task 3: Restructure the Landing page

Apply the locked hero-split + card pattern to `/`.

**Files:**
- Modify: `src/components/LandingPage.tsx`
- Modify: `src/components/LandingPage.css`

- [ ] **Step 1: Rebuild the landing hero as a split**

In `LandingPage.tsx`, convert `landing-hero-content` to the shared split: `import HeroMontage from "../showcases/HeroMontage";` and `import "./shared-sections.css";`. Left column (`.wf-hero-copy`): the lightbulb icon + the brand line as `.wf-eyebrow`, the `landing-hero-title`, `landing-hero-subtitle`, and the Book-a-call CTA. Right column (`.wf-hero-visual`): `<HeroMontage />`. Keep the `landing-hero` section bg.

- [ ] **Step 2: Polish the "What we do" service cards**

In `LandingPage.css`, upgrade `.landing-service-card` to the same framed-card language as the index example cards (border, `--shadow-sm`, hover-lift to `--shadow-md`, arrow). If the service data has icons available, add an icon chip; otherwise keep title + summary + arrow. Two-up desktop, stacked mobile.

- [ ] **Step 3: Browser iteration**

Open `/`. Confirm the split hero + montage read well and the service cards match the index cards, desktop + mobile.

- [ ] **Step 4: Verify lint + build, then commit**

Run: `npm run lint && npm run build` (expect pass), then:

```bash
git add src/components/LandingPage.tsx src/components/LandingPage.css
git commit -m "feat: split hero + polished service cards on the landing page"
```

---

### Task 4: Cohesion verification sweep

- [ ] **Step 1: Lint + build clean**

Run: `npm run lint && npm run build` — both pass.

- [ ] **Step 2: Browser walk, desktop + mobile (<768px)**

Visit `/`, `/services/automated-workflows`, and one detail page (e.g. `/services/automated-workflows/review-generation`). Confirm: consistent split heroes with framed "Illustrative" product-shots, eyebrows, and matching card treatment across all three; nothing dark-on-dark/light-on-light; the detail page and shared tail unchanged; the (out-of-scope) Technical Consulting page still renders fine (it lost nothing).

- [ ] **Step 3: Commit any final tweaks**

```bash
git add -A src/components src/showcases
git commit -m "style: automation cohesion polish"
```

---

## Self-Review notes

- **Spec coverage:** CSS extraction → Task 1; index split hero + eyebrows + cards → Task 2; landing split hero + service cards → Task 3; hero montage reuse → Task 2 (`HeroMontage`, reused in Task 3); verification (detail-page-unchanged, both viewports) → Tasks 1 & 4.
- **Interface consistency:** `HeroMontage` (built in Task 2) is reused verbatim in Task 3; the shared classes (`.wf-hero-split`, `.wf-eyebrow`, `.wf-shot*`) moved in Task 1 are consumed by Tasks 2–3 and still by the detail page.
- **Design-work honesty:** structure, the CSS move, and component wiring are deterministic and fully specified; the montage offset and card hover polish are explicitly iterated live in Task 2 Step 4 and locked — the CSS given is a starting point, flagged as such, not a vague placeholder.
