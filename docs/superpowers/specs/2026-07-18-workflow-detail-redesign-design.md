# Phase 2 — Workflow Detail-Page Redesign — Design

**Date:** 2026-07-18
**Part of:** the Domo-inspired redesign (Phase 2 of 3). Phase 1 (light theme) is
complete. Phase 3 (index/landing cohesion) is later. This spec covers the
per-workflow service pages (`/services/automated-workflows/:slug`) only.

## Goal

Rebuild the workflow detail pages so every section is anchored by a real product
visual, in Domo's structural language — split hero, eyebrow labels, alternating
image/text feature rows, framed "product shots." The pages are currently light
but visually empty (centered text floating in space). The redesign fills them by
**reusing the real demo UI** as static, framed snippets.

## Decisions (locked in brainstorming)

- **Visual source:** reuse each demo's real UI (its own `.rg-*` / `.mc-*` / etc.
  cards) as static, framed "product shots" — authentic, DRY, showcases the actual
  product. Not new bespoke art; not one full screenshot per page.
- **Demo placement:** the interactive demo stays its own full-bleed route. The
  detail page shows static framed snippets + a prominent "Try the interactive
  demo" band/CTA that opens that route. The marketing page stays light and fast.
- **Rollout:** prototype **review-generation** end-to-end, validate live, lock the
  pattern + data shape, then roll to the other 8.

## New page structure

1. **Split hero** — left: eyebrow (workflow label), headline, subhead, dual CTA
   ("Book a free automation consult" + "Try the demo →"), optional inline stat.
   Right: a framed product-shot (the workflow's hero snippet — e.g. the
   `.rg-review` card). Stacks (visual below copy) on mobile.
2. **"Sound familiar?"** — the pain points, as a tight block (kept compact; may
   carry a small supporting visual but text-first).
3. **Feature rows** — the mechanism reimagined as 2–3 alternating rows. Each row:
   eyebrow + heading + body on one side, a framed demo snippet on the other,
   alternating left/right. This is the heart of the redesign.
4. **Stats band** (only if `stats` non-empty) — compact highlighted strip/cards.
5. **"See it run" band** — a larger framed preview of the demo + prominent "Try
   the interactive demo →" CTA to the full-bleed route (replaces today's plain
   `WorkflowDemoCta`, restyled).
6. **Tail** — "Why work with me" + "How we'd work together" as cards (the shared
   `AwWhyWorkWithMe` / `AwHowItWorks`, `as="bare"` in a band, as today).
7. **FAQ** — unchanged structurally.
8. **Final CTA** — shared `AwFinalCta`.

## Visual system

- **Framed product-shots:** real demo cards in light floating frames — white
  surface, `--demo-border` hairline, soft `--demo-shadow`, generous radius; slight
  layering/offset (a second card peeking behind) for Domo-style depth where it
  fits. No heavy browser/device chrome — clean floating cards.
- **Eyebrow labels** (small uppercase, `--color-primary`) above section/row
  headings; feature-row headings left-aligned; section intro headings centered.
- Sections alternate white / `--color-bg-light` bands for rhythm.
- Reduced, purposeful whitespace — every band anchored by a visual, never empty.

## Components (units, with boundaries)

- **`WorkflowHero`** (rebuilt) — props `{ eyebrow, headline, subhead, slug,
  hasDemo, stats, heroVisual: ReactNode }`. Renders the split layout. Owns no demo
  logic; receives the framed visual as a node.
- **`WorkflowFeatureRow`** (new) — props `{ eyebrow?, title, body, visual:
  ReactNode, flip?: boolean }`. One reusable alternating row. Pure presentation.
- **`WorkflowShowcase` registry** (new, mirrors `src/demos/registry.ts`) — maps
  `slug → () => import()` of that workflow's showcase module. Keeps each demo's CSS
  out of the shared bundle (imported only on its own detail page).
- **Per-workflow showcase module** (new, one per workflow, e.g.
  `src/showcases/reviewGeneration.tsx`) — exports a `snippets` map
  `{ [key: string]: ReactNode }` of curated static cards, reusing the demo's CSS
  classes with sample content, each wrapped in the token scope (below). Imports the
  demo's CSS file so the classes are styled.
- **`WorkflowDemoCta`** (restyled) — the "See it run" band; larger framed preview +
  CTA to the demo route.
- Reused unchanged: `WorkflowFaq`, `AwWhyWorkWithMe`, `AwHowItWorks`, `AwFinalCta`.
- **`WorkflowPage`** — composes the above from `workflow` + its resolved showcase.

## Token-scope refactor (enabling reuse)

Today `.demo` in `DemoShell.css` bundles the `--demo-*` token definitions **and**
full-viewport layout (`height: 100vh; overflow: hidden`). Static snippets need the
tokens without the layout. Refactor: move the `--demo-*` token block onto a
selector that both contexts share — `:where(.demo, .demo-scope) { --demo-*: … }` —
and leave `.demo`'s layout rules separate. Showcase frames wrap snippets in
`<div className="demo-scope wf-shot">`: `demo-scope` supplies the colors, `wf-shot`
supplies the static card frame. `.demo`'s behavior is unchanged (it still matches
the token block via `:where`).

## Data model

Extend `WorkflowContent` (in `src/data/workflows.ts`) with a `showcase` config:

```ts
interface FeatureRow {
  eyebrow?: string;
  title: string;
  body: string;
  snippet: string;   // key into the workflow's showcase module
  flip?: boolean;    // visual on the left instead of the right
}
interface Showcase {
  heroSnippet: string;         // key for the hero product-shot
  rows: FeatureRow[];          // 2–3 curated feature rows
}
```

Feature rows carry their own marketing copy (decoupled from in-demo step text,
which is written for the interactive flow). `snippet` keys resolve against the
workflow's showcase module.

**Incremental typing:** add `showcase?: Showcase` as **optional** first. Pages with
a `showcase` render the new redesign; pages without it keep the current Phase-1
light layout (fallback). After all 9 have a `showcase`, a final step makes it
required (restoring the published-union guarantee) and removes the fallback path.
This keeps every commit shippable during rollout.

## Rollout

1. **Prototype** review-generation end-to-end: token-scope refactor, new
   components, its showcase module (hero + ~3 row snippets from `.rg-*` cards),
   its `showcase` data, wired into `WorkflowPage` behind the optional-`showcase`
   branch. Validate live in the browser; iterate on framing/spacing.
2. **Lock** the component API, the `wf-shot` frame styles, and the `showcase`
   shape from the approved prototype.
3. **Roll** to the other 8: per workflow, author its showcase module (curate 2–3
   demo cards) + `showcase` data. Mostly curation + copy; snippets reuse existing
   demo CSS, so little new styling.
4. **Finalize:** make `showcase` required, remove the fallback, verify all 9.

## Verification

- No test framework; loop is `npm run lint` + `npm run build` + browser walk (dev
  server + Claude-in-Chrome), desktop and mobile (<768px), for each redesigned
  page.
- Contrast bar as in Phase 1 (AA); snippets inherit the light `--demo-*` tokens.
- Confirm demo CSS is loaded only on its own detail page (bundle check via the
  showcase registry / lazy import), not globally.

## Non-goals

- No change to the interactive demo experience itself (only reused as static
  snippets + linked).
- No index/landing structural changes (Phase 3).
- No new copy research or statistics (sourcing rules from CLAUDE.md still apply;
  feature-row copy is marketing framing of existing vetted content).
- No dark mode / theme toggle.

## Disposition of prior work

The Phase-1 light theme is the foundation. The leftover uncommitted amber
"Try the demo" button edit in `WorkflowPage.css` is superseded here (the hero is
rebuilt); it can be discarded. The Phase-1 `WorkflowProblemSolution`/`wf-tail`
concepts from the earlier (reverted) compaction are re-expressed here as feature
rows + the tail band.
