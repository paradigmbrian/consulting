# Phase 3 — Automation-Side Cohesion Pass — Design

**Date:** 2026-07-18
**Part of:** the Domo-inspired redesign (Phase 3 of 3). Phases 1 (light theme) and
2 (detail-page redesign) are complete. This phase brings the detail-page design
language to the two automation-side entry pages so the whole automation journey
feels like one designed system.

## Scope (locked in brainstorming)

- **In:** the Landing page (`/`, `src/components/LandingPage.tsx`) and the
  Automated-Workflows index (`/services/automated-workflows`,
  `src/components/AutomatedWorkflows.tsx`).
- **Out:** Technical Consulting (`/services/technical-consulting`) — a separate
  service line with no demos/product-shots; gets its own pass later if wanted.
- **Depth:** fuller restructure — split heroes with a product-shot visual, eyebrow
  labels, framed cards — not just spacing polish.

## Goal

Both pages currently use the old centered-everything layout (light, from Phase 1,
but no eyebrows, no split heroes, no product-shots), so they read as a different,
plainer site than the polished detail pages. Restructure them to match: split
heroes anchored by real demo-card product-shots, eyebrow labels, and cards that use
the detail-page card language.

## Enabling refactor: shared presentational CSS

The reusable presentational styles live in `WorkflowPage.css`, imported only by the
detail page. Extract the page-agnostic ones into a shared stylesheet so Landing,
Index, and detail pages draw from one source:

- **New file** `src/showcases/showcase.css` — the product-shot frame styles
  (`.wf-shot`, `.wf-shot-layered`, `.wf-shot-skeleton`, `.wf-shot-tag`). Imported by
  `ShowcaseFrame.tsx` so any page rendering a framed shot gets the styling
  automatically (today it silently depends on `WorkflowPage.css` being loaded).
- **Shared layout utilities** — move `.wf-eyebrow`, `.wf-hero-split`,
  `.wf-hero-copy`, `.wf-hero-visual`, `.wf-feature-row*` from `WorkflowPage.css`
  into a shared stylesheet (either `src/index.css` or a new
  `src/components/shared-sections.css` imported by the pages that use them). Keep the
  class names identical so the detail pages are unchanged.

`WorkflowPage.css` keeps only detail-page-specific rules (hero band padding, the
problem/solution band, the tail band, FAQ, demo band). No visual change to the
detail pages — this is a pure move.

## Landing page (`/`)

1. **Split hero** — left: eyebrow ("Paradigm Shift Software Development", the current
   brand line, restyled as an eyebrow), headline, subhead, the Book-a-call CTA.
   Right: a framed product-shot — a small montage of two real demo cards (e.g. a
   review card + an SMS booking) to signal the breadth of tangible work. Stacks on
   mobile. Keep the lightbulb brand icon (small, above/with the eyebrow).
2. **"What we do"** — the two service cards (Technical Consulting, Automated
   Workflows) upgraded to framed cards: icon chip, title, summary, an arrow link,
   hover-lift — matching the detail-page card treatment. Two-up on desktop, stacked
   on mobile.
3. **CTA** — shared `CTA`, unchanged.

## Index page (`/services/automated-workflows`)

1. **Split hero** — left: eyebrow "Automated Workflows", the current headline,
   subhead, the automation-consult CTA. Right: a framed product-shot (a montage of
   two demo cards). Stacks on mobile.
2. **"Automatable work" band** (`aw-framing`) — add an eyebrow; present the
   automatable-work list as a clean two-column checklist (it is a plain list today).
3. **Examples grid** (`aw-examples`, the 9 workflow cards) — add an eyebrow; polish
   each card to the detail-page card language (icon chip, hover-lift, arrow affordance
   on published cards). This grid is already the right "use-cases" shape; this is a
   styling harmonization, not a restructure.
4. **How it works / Why work with me / Final CTA** — shared `Aw*` components,
   unchanged.

## Hero visuals

Reuse the existing per-workflow showcase modules' cards via `ShowcaseFrame` — a
curated snippet or a two-card montage per hero — same authentic real-UI approach as
the detail pages. All framed shots carry the "Illustrative" tag (already built into
`ShowcaseFrame`). Import the chosen showcase module(s) directly (not via the
slug-keyed lazy registry, which is for detail pages); this pulls one or two demos'
CSS into these pages' bundles — acceptable and small. A tiny montage wrapper
(stacked/offset frames) may be added if a single card reads thin.

## Non-goals

- No Technical Consulting changes (deferred).
- No changes to the shared `Aw*` tail components, `CTA`, or the detail pages'
  appearance.
- No copy rewrites beyond promoting existing brand/section text into eyebrow labels.
- No new statistics; hero product-shots stay illustrative (labelled).

## Verification

- No test framework; loop is `npm run lint` + `npm run build` + browser walk (dev
  server + Claude-in-Chrome), desktop and mobile (<768px).
- Confirm the detail pages and the shared tail render **unchanged** after the CSS
  extraction (pure move).
- Walk `/` and `/services/automated-workflows` desktop + mobile: split heroes with
  framed shots, eyebrows, polished cards, everything legible.

## Rollout

1. **CSS extraction** — move the shared styles; verify detail pages unchanged.
2. **Index hero + cards** (the biggest mismatch) — build, iterate live, lock the
   montage/hero pattern.
3. **Landing hero + service cards** — apply the locked pattern.
4. **Verification sweep** — both pages, both viewports; confirm nothing else moved.
