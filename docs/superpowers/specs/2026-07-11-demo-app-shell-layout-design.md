# Demo App-Shell Layout — Design

**Date:** 2026-07-11
**Component:** Shared interactive-demo engine (`src/demos/shared/`)
**Applies to:** Both demos — commercial-cleaning (`/demos/commercial-cleaning`) and win-back campaign (`/demos/win-back-campaign`) — via the shared `DemoShell`.

## Problem

The current demo layout stacks a tall centered hero header, a horizontal flow map, and the step content vertically. On a typical viewport the header + flow map fill the screen, pushing the actual step content below the fold. Users must scroll down to see what each step does, which breaks the "watch the workflow run" feel.

**Goal:** Restructure the shared shell so the workflow map and the active step's content both fit on one screen without page scrolling, and the result reads like a real product UI.

## Approach

Convert `DemoShell` from a vertical marketing stack into a **two-pane app shell** locked to the viewport height on desktop:

- A slim **top bar** (title, step counter, "Powered by Claude" chip, CTA).
- A **vertical step rail** on the left (the flow map, rotated from horizontal to vertical).
- A **content pane** on the right that holds the active step — the only region allowed to scroll internally.
- A docked **footer nav** (Back / Restart / Next).

Below 968px the frame unlocks to natural document flow with a horizontal step strip on top, preserving today's mobile behavior.

Because both demos already render through `DemoShell` and consume the same `useDemo` API, this is a single shared-shell change — no per-demo or per-step edits required.

## Layout Specification

### Desktop (≥ 968px)

The demo root is a `100vh` flex column with `overflow: hidden`. Three horizontal bands:

```
┌ .demo-topbar ──────────────────────────────────────────────────────┐
│ WIN-BACK CAMPAIGN   Step 3 of 6        [✨ Powered by Claude] [Book a call] │
├ .demo-body (flex row, flex: 1, min-height: 0) ─────────────────────┤
│ .demo-rail (fixed ~240px)      │ .demo-content (flex: 1, min-w: 0)  │
│   ✓ Import                     │  ┌ .demo-stage-header ───────────┐ │
│   ✓ Segment                   │  │ [icon] Craft the offer         │ │
│   ● Craft  ✨   ◀ active       │  ├────────────────────────────────┤ │
│   ○ Send                      │  │  renderStage(stepId)           │ │
│   ○ Replies ✨                 │  │  ← ONLY internal scroll region │ │
│   ○ Results                   │  │     (overflow-y: auto)         │ │
│                                │  └────────────────────────────────┘ │
├ .demo-nav (footer) ────────────────────────────────────────────────┤
│ [← Back]                  Restart                        [Next →]    │
└─────────────────────────────────────────────────────────────────────┘
```

**Top bar (`.demo-topbar`)**
- Left cluster: eyebrow kicker (small, uppercase) + `title` + `Step X of N` counter.
- Right cluster: persistent `✨ Powered by Claude` chip, then the `Book a call` Calendly CTA.
- The `lede` sentence is **removed** from the persistent chrome. (It remains a `DemoShell` prop but is no longer rendered; keeping the prop avoids touching the two demo call sites. If desired later it can return as a wide-screen subtitle — out of scope here.)

**Body (`.demo-body`)** — `display: flex; flex: 1; min-height: 0` so children can shrink and scroll correctly.

**Step rail (`.demo-rail`)**
- Vertical `<ol>` (`flex: 0 0 240px`), one row per step.
- A vertical **spine line** runs behind the row badges; the portion up to the active step is colored (done/active accent), the remainder dimmed.
- Row states:
  - `done` — green check badge, muted label.
  - `active` — accent glow badge, bold label, subtle pulse (respecting `prefers-reduced-motion`), optional `◀` active marker.
  - `upcoming` — dimmed badge + label.
- AI steps (`step.isAi`) show a small `✨` mark on the row.
- Rows remain buttons wired to `goTo(i)`, preserving jump-to-step. `aria-current="step"` on the active row.
- `overflow-y: auto` on the rail so unusually long step lists still work; active row uses `scrollIntoView({ block: "nearest" })`.

**Content pane (`.demo-content`)**
- `display: flex; flex-direction: column; min-height: 0`.
- Contains the existing `.demo-stage-header` (step icon + label) and `renderStage(stepId)`.
- The scroll region wrapping `renderStage` gets `flex: 1; overflow-y: auto`. It is the **only** scrollable element on desktop, so tall steps (e.g. Results tables) scroll here while all chrome stays fixed.
- Drop the current `.demo-stage` `min-height: 320px`; height now comes from the flex frame.

**Footer nav (`.demo-nav`)** — unchanged behavior (Back / Restart / Next), docked as the bottom band.

### Responsive (< 968px)

- Root switches off the `100vh` lock and `overflow: hidden`; document scrolls naturally.
- `.demo-body` becomes `flex-direction: column`.
- `.demo-rail` becomes a **horizontal, swipe-scrollable strip** on top, reusing today's compact horizontal node styling (`overflow-x: auto`, row layout). The spine becomes a horizontal connector between nodes.
- Top bar wraps; CTA and chip drop below the title if needed.
- Content pane scrolls with the page (no independent scroll container needed at this width).

Existing project breakpoints are 768px and 968px. Use **968px** as the two-pane ↔ stacked boundary (the rail needs ~240px + a readable content column). The 768px breakpoint continues to tune compact spacing within the stacked layout.

## Components & Files

| File | Change |
|---|---|
| `src/demos/shared/DemoShell.tsx` | Restructure into topbar / body / footer frame. Add the "Powered by Claude" chip. Stop rendering `lede`. Keep `StageHeader` and `DemoNav` (DemoNav moves into the footer band; StageHeader moves into the content pane). |
| `src/demos/shared/DemoShell.css` | New app-frame layout (100vh flex column, bands, responsive unlock). Remove `.demo-header` centered-hero styles and `.demo-stage` min-height. |
| `src/demos/shared/FlowMap.tsx` | Rewrite to render the vertical rail. Remove `FlowAiLane` import/usage and the AI-node ref plumbing. Keep `goTo`, status logic, `scrollIntoView`, and the `✨` per-row AI mark. |
| `src/demos/shared/FlowMap.css` | Vertical rail styles (spine, rows, states) + horizontal fallback under 968px. |
| `src/demos/shared/FlowAiLane.tsx` | **Delete.** Replaced by per-row `✨` + top-bar chip. |
| `src/demos/shared/FlowAiLane.css` | **Delete.** |
| `src/demos/shared/usePrefersReducedMotion.ts` | Keep — still used by rail pulse / spine animations. |
| `DemoController.tsx`, `types.ts`, all step components | **Unchanged.** `useDemo` API and `DemoStep` shape (`id`, `label`, `Icon`, `isAi`) are untouched, so both demos adopt this automatically. |

## AI Branding

Today's animated "Claude" connector lane (`FlowAiLane`) is replaced by two always-visible, geometry-free signals:
1. A `✨` mark on each AI step row in the rail.
2. A persistent `✨ Powered by Claude` chip in the top bar.

This keeps the Anthropic/Claude attribution prominent without the fragile absolute-positioned SVG overlay that assumed a horizontal layout.

## Accessibility

- Rail remains a `<nav aria-label="Workflow steps">` with an `<ol>` of step buttons; `aria-current="step"` on the active row; `aria-label` per step (`Step N: label`).
- All animations gated behind `prefers-reduced-motion: reduce` (pulse, spine dash).
- Internal scroll region is keyboard-scrollable; focus order follows top bar → rail → content → footer.
- Color is never the sole state signal (check icon for done, `◀`/glow + bold for active).

## Out of Scope

- Changing step content, copy, or the demo scripts.
- Restoring the `lede` as a subtitle (possible follow-up).
- Any change to the marketing pages or landing routes.

## Verification

- `npm run lint` — zero warnings (note: unused `lede` prop must not trigger a lint error; the prop stays in the interface but simply isn't destructured/rendered, which is fine).
- `npm run build` — TypeScript check + production build passes.
- Manual: load `/demos/win-back-campaign` and `/demos/commercial-cleaning` at desktop width — flow rail + active step content visible with no page scroll; stepping through advances the rail; tall steps scroll inside the content pane only. Resize below 968px — layout stacks with a horizontal step strip and normal page scroll.
