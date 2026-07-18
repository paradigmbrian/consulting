# Workflow Service Page Compaction — Design

**Date:** 2026-07-16
**Scope:** `/services/automated-workflows/:slug` pages (`src/components/workflows/WorkflowPage.tsx` and its sections)

## Problem

Each per-workflow service page stacks 8–9 full-width sections, every one carrying
`var(--spacing-xl)` (6rem) top and bottom padding. The result is a long, scroll-heavy
page where the value proposition and the primary actions (book a consult / try the
demo) sit far apart, and the last four sections are generic boilerplate appended after
all the workflow-specific content.

## Goals

1. **Front-load the punch** — value + a CTA (and the stats/demo) visible in the first
   screen or two.
2. **Trim total length** — fewer, merged sections and tighter spacing end-to-end.

## Hard constraint

`AwHowItWorks`, `AwWhyWorkWithMe`, and `AwFinalCta` are **shared** with the index page
(`src/components/AutomatedWorkflows.tsx`), where they render stacked as full sections.
The redesign must leave the index page visually identical.

## Current structure (per workflow page)

1. Hero — headline + subhead + "Book a consult" CTA
2. Stats — bordered cards grid (only 3 of 9 pages have stats)
3. Pains — "Sound familiar?" bullet list
4. Mechanism — "How it works" numbered steps
5. Demo CTA — button to the interactive demo route (if `hasDemo`)
6. Why work with me — shared, bullet list
7. How we'd work together — shared, 3 icon steps
8. FAQ — collapsed `<details>` list
9. Final CTA — shared

## Chosen approach: tighten & merge in place

Reuse the existing components and order; compact the rhythm and pair sections that are
conceptually one thing. Net: ~9 sections → ~6, padding cut by a third, stats + demo
button above the fold.

### 1. Compact vertical rhythm (workflow-scoped)

- `wf-*` section padding: `var(--spacing-xl)` → `var(--spacing-lg)` (6rem → 4rem).
- Inner list/grid top margins: `var(--spacing-lg)` → `var(--spacing-md)`.
- Scoped to `wf-*` classes only. The shared `aw-*` sections keep their own padding, so
  the index page is untouched.

### 2. Hero front-loads the punch (`WorkflowHero`)

- Accept `slug`, `hasDemo`, and `stats` as new props (in addition to `headline` /
  `subhead`).
- When `hasDemo`, render a secondary button **"Try the demo →"** beside "Book a free
  automation consult", linking to `/services/automated-workflows/:slug/demo`.
- When `stats` is non-empty, render a compact inline **stat strip** under the CTAs:
  the small label **"What it costs to leave this manual"** above a single row of
  `value · value · value`, each value linking to its `sourceUrl`. This replaces the
  standalone `WorkflowStats` card section and pulls the numbers above the fold.
- The standalone `WorkflowStats` section is removed from `WorkflowPage`. (The
  `WorkflowStats.tsx` component may be deleted, or left unused; prefer deleting to
  avoid dead code.)

### 3. Pains + Mechanism → one two-column band (`WorkflowProblemSolution`)

- New component `WorkflowProblemSolution` takes `painPoints: string[]` and
  `mechanism: { title; description }[]`.
- Renders a single `<section class="wf-problem-solution">` with a two-column grid:
  left column "Sound familiar?" (pains), right column "How it works" (numbered steps).
  Side by side on desktop, stacked on mobile (single column below 768px).
- Replaces `WorkflowPains` + `WorkflowMechanism` in `WorkflowPage`. Move their existing
  list markup/CSS into the new component; delete the two old components.

### 4. Demo (`WorkflowDemoCta`)

- Kept as its own mid-page section (the interactive payoff earns a dedicated beat).
- Only change: picks up the tightened `wf-*` padding. The hero button and this section
  point at the same demo route — an intentional re-CTA.

### 5. Why + How → one two-column tail band

- Add an optional prop `as?: "section" | "bare"` (default `"section"`) to
  `AwWhyWorkWithMe` and `AwHowItWorks`.
  - `"section"` (default): current behavior — renders the full `<section>` with its own
    padding. The index page passes nothing, so it is unchanged.
  - `"bare"`: renders only the inner `.section-content` (heading + list/steps), no
    `<section>` wrapper or padding.
- `WorkflowPage` renders both `as="bare"` inside a single `<section class="wf-tail">`
  with a two-column grid: "Why work with me" | "How we'd work together". Stacks on
  mobile.

### 6. FAQ + Final CTA

- `WorkflowFaq` unchanged in structure; picks up the tighter `wf-*` padding.
- `AwFinalCta` stays shared and as-is.

## Resulting workflow page structure

1. Hero (headline + subhead + dual CTA + stat strip)
2. Problem/Solution band (pains | mechanism)
3. Demo CTA (if `hasDemo`)
4. Tail band (why | how)
5. FAQ
6. Final CTA

## Files touched

- `src/components/workflows/WorkflowPage.tsx` — new composition, pass hero props.
- `src/components/workflows/WorkflowHero.tsx` (+ `WorkflowPage.css`) — dual CTA + stat strip.
- `src/components/workflows/WorkflowProblemSolution.tsx` (new) — merged pains + mechanism.
- `src/components/workflows/WorkflowPains.tsx`, `WorkflowMechanism.tsx` — deleted.
- `src/components/workflows/WorkflowStats.tsx` — deleted (folded into hero).
- `src/components/workflows/AwWhyWorkWithMe.tsx`, `AwHowItWorks.tsx` — add `as` prop.
- `src/components/workflows/WorkflowPage.css` — compact padding, new grids
  (`wf-problem-solution`, `wf-tail`, `wf-hero-stats` strip, dual-CTA row).

## Non-goals

- No change to the index page (`AutomatedWorkflows.tsx`) appearance.
- No sticky mini-CTA bar (Approach 2) or split hero card (Approach 3) — could layer on later.
- No content/copy rewrites; this is layout/density only.

## Verification

- `npm run build`, `npm run lint`.
- Visually check a page **with** stats (e.g. one of the 3) and one **without**, plus a
  page with a demo and without, at desktop and mobile widths.
- Confirm the index page (`/services/automated-workflows`) is unchanged.
