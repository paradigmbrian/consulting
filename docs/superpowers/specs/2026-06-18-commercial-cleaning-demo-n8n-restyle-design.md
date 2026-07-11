# Commercial-Cleaning Demo — n8n-Style Flow Restyle Design Spec

**Date:** 2026-06-18
**Project:** `paradigm/consulting-website`
**Status:** Approved for planning
**Author:** Brian (with Claude)
**Builds on:** `2026-06-17-commercial-cleaning-demo-design.md` (the scripted demo, already implemented)

## 1. Purpose

Make the existing `/demos/commercial-cleaning` walkthrough **stand out** by re-skinning it with an
n8n-inspired flow-diagram aesthetic: a dark canvas with a dotted grid, the step progression rendered as
a chain of connected **nodes**, animated "flowing" connectors, and each step's detail shown in a dark
node card. The underlying behavior — a six-step, one-step-at-a-time scripted walkthrough driven by the
`WorkflowProvider` — is unchanged. This is a **visual/interaction restyle**, not a new feature or a data
change.

## 2. Goals & non-goals

**Goals**
- Give the demo a distinctive, "this is a real automation workflow" look modeled on n8n flow diagrams.
- Keep the existing six-step reveal, navigation, mocked send/reply, and persuasive content intact.
- Confine all visual changes to the demo route; the landing page and global design tokens are untouched.
- Honor `prefers-reduced-motion` (collapse all added animation to static states).

**Non-goals**
- No change to the scripted content (`script.ts`), the `WorkflowProvider` interface, or the data flow.
- No real branching/true-false nodes — the flow is linear (six steps). (n8n's branch visuals are reference
  only.)
- No drag/pan/zoom canvas, no node editing — this is a presentational chain, not an editor.
- No change to the landing page, routing, or `netlify.toml`.
- No new dependencies (no React Flow / no animation library) — vanilla CSS + inline SVG only.

## 3. Decisions (from brainstorming)

- **Structure:** restyle the existing steps as nodes; keep the one-step-at-a-time reveal (not a full
  single-canvas rebuild).
- **Theme:** full dark canvas across the whole demo page, including the inner step content.
- **Motion:** "flowing connectors" — the connector entering the active node animates with traveling dashes;
  the active node glows/pulses; completed nodes show a check.

## 4. Theming approach (demo-scoped tokens)

All dark styling is scoped under the existing `.demo` root element on the demo page. We introduce
**demo-only CSS custom properties** declared on `.demo` — we do NOT override the site's global tokens in
`src/index.css`, so nothing outside the demo is affected.

Token set (declared on `.demo`):

```css
.demo {
  --demo-bg: #0d1117;          /* near-black canvas */
  --demo-surface: #161b22;     /* node / card background */
  --demo-surface-2: #1c2330;   /* nested / inset surfaces */
  --demo-border: #2a3340;      /* node + card borders */
  --demo-text: #e6edf3;        /* primary text on dark */
  --demo-muted: #8b97a7;       /* secondary text */
  --demo-accent: #2777B4;      /* brand blue — active/edge accent */
  --demo-accent-glow: rgba(39, 119, 180, 0.55);
  --demo-edge: #2a3340;        /* idle connector */
  --demo-edge-active: #2777B4; /* active connector */
  --demo-success: #10b981;     /* completed / qualified */
}
```

Background grid on `.demo`:

```css
.demo {
  background-color: var(--demo-bg);
  background-image: radial-gradient(circle, rgba(255, 255, 255, 0.06) 1px, transparent 1px);
  background-size: 22px 22px;
}
```

**Inner-content migration:** the six `steps/*.css` files and `DemoPage.css` currently use hardcoded `#fff`
backgrounds, `rgba(...)` tints, and global tokens (`--color-text`, `--color-border`, `--color-bg-light`,
etc.). These are migrated to the demo tokens above so all step content (Define chips, Discover/Enrich cards,
Personalize email, Send outbox, Results reply + tally) renders legibly light-on-dark. Success/qualified
greens and the drop/secondary greys map to `--demo-success` / `--demo-muted`. This is a mechanical
per-rule color migration — no structural HTML/layout change to the steps.

## 5. New component — `FlowMap`

**Files:** `src/demos/commercialCleaning/FlowMap.tsx` + `FlowMap.css`.

Replaces the current `StepProgress` (the dotted numbered indicator) in `DemoPage.tsx`.

**Render model:** a horizontal flex row alternating **node** and **connector** elements:

```
[node 0] [conn 0→1] [node 1] [conn 1→2] [node 2] ... [node 5]
```

- **Node:** a rounded dark card (`--demo-surface`, `--demo-border`) containing the step's react-icon badge
  and a short label (reuse the step labels already in `DemoPage.tsx`). A `<button>` (clickable to navigate).
  Visual states by comparing the node's index `i` to `stepIndex` from `useDemo()`:
  - `i < stepIndex` → **completed**: success-tinted border, a check overlay on the icon badge.
  - `i === stepIndex` → **active**: accent border with a glow, slightly raised (`transform: translateY(-2px)`),
    pulsing animation.
  - `i > stepIndex` → **upcoming**: dimmed (reduced opacity, muted border).
- **Connector:** a small fixed-width inline `<svg>` (e.g. 48px wide on desktop) drawing a horizontal line
  from the left node's right edge to the right node's left edge. Connector state by the index of the node it
  **feeds** (the right-hand node, index `i+1`):
  Let the connector's right-hand node index be `r = i + 1`:
    - `r < stepIndex` → **solid completed** (`--demo-edge`/subtle).
    - `r === stepIndex` → **active**: accent stroke with animated traveling dashes (this is the segment
      entering the active node).
    - `r > stepIndex` → **idle/faint**.

  Because nodes sit at the same vertical level, a straight stroke (optionally with a slight rounded mid) is
  used — no global DOM measurement or bezier math is required; each connector is self-contained between its
  two neighbors.

**Click-to-navigate:** clicking a node calls `goTo(i)` (see §6). Active node is `aria-current="step"`;
each node button has an accessible label (e.g. `aria-label="Step 3: Enrich & qualify"`).

**Animations (CSS keyframes in `FlowMap.css`):**
- Traveling dashes on the active connector: `stroke-dasharray` + animated `stroke-dashoffset`.
- Active node pulse: animated `box-shadow`/border glow using `--demo-accent-glow`.
- `@media (prefers-reduced-motion: reduce)`: disable the dash animation (static accent stroke) and the pulse
  (static glow). No JS gating needed for the map (pure CSS), matching the existing step pattern.

## 6. Controller change — `goTo(index)`

`src/demos/commercialCleaning/DemoController.tsx` gains one method so flow nodes can navigate:

```ts
const goTo = useCallback(
  (index: number) => {
    clearTimers();
    setStepIndex(Math.min(Math.max(index, 0), STEPS.length - 1));
  },
  [clearTimers],
);
```

- Bounds-guarded; clears the mocked-send timers exactly like `next`/`back` (consistent with the
  navigation-clears-timers fix already in place).
- Added to `DemoContextValue` and the memoized context `value` (add `goTo` to its dependency array).
- `next`, `back`, `reset`, `startSend`, `markReplied`, `sendStatus`, etc. are unchanged.

## 7. Active step as a node card

In `DemoPage.tsx` / `DemoPage.css`, the existing `.demo-stage` (the detail container) is restyled as a
large dark **node card**: `--demo-surface` background, `--demo-border`, a header strip showing the active
step's icon + title with an accent top accent/glow, content below. The `StepBody` switch and step
components are unchanged except for their CSS palette (§4). The persistent Calendly CTA and the Back /
Restart / Next nav remain; the nav buttons restyle to the dark palette (`--demo-surface`/`--demo-border`,
accent primary).

## 8. Responsive

- **Desktop (>768px):** full horizontal flow chain, centered.
- **≤768px:** the chain is a horizontally-scrollable strip (`overflow-x: auto`) that **auto-centers the
  active node** when `stepIndex` changes (via `scrollIntoView({ inline: "center", block: "nearest" })` on the
  active node ref, guarded to instant under reduced motion). Node labels condense (icon-forward; label may
  truncate or hide on the narrowest widths, consistent with today's behavior of hiding progress labels under
  768px). Connector SVG width shrinks.
- The active step node card and inner content remain single-column on mobile as they are today.

## 9. Error handling & edge cases

- Pure presentational restyle; no new data or network paths.
- `goTo` bounds-guarded (no navigation past first/last).
- Flow-map animations are CSS-only and degrade via `prefers-reduced-motion`; the mobile auto-center scroll
  is guarded to instant under reduced motion.
- No timers introduced by the flow map (the only timers remain the controller's mocked-send + the existing
  in-step ones).

## 10. Affected / new files

- **New:** `src/demos/commercialCleaning/FlowMap.tsx`, `src/demos/commercialCleaning/FlowMap.css`.
- **Modified:**
  - `DemoController.tsx` — add `goTo`.
  - `DemoPage.tsx` — render `<FlowMap />` in place of `StepProgress`; wire `goTo`; node-card stage header;
    apply the dark scope.
  - `DemoPage.css` — demo tokens, dotted-grid canvas, dark nav, node-card stage.
  - `steps/DefineTargetStep.css`, `steps/DiscoverStep.css`, `steps/EnrichQualifyStep.css`,
    `steps/PersonalizeStep.css`, `steps/SendStep.css`, `steps/ResultsStep.css` — palette migration to demo
    tokens.
- **Unchanged:** all step `.tsx`, `script.ts`, `types.ts`, `ScriptedWorkflowProvider.ts`,
  `usePrefersReducedMotion.ts`, routing, `netlify.toml`, the landing page, `src/index.css`.

## 11. Testing & definition of done

- `npm run lint` — zero warnings (repo standard).
- `npm run build` — TypeScript check + Vite build green.
- Manual walkthrough on desktop and mobile widths:
  - All six nodes render; active node glows/pulses; completed nodes show checks; the connector into the
    active node shows traveling dashes.
  - Back / Next / Restart still work; clicking a flow node jumps to that step.
  - All inner step content (Define chips, Discover reveal, Enrich drop-offs, Personalize email typing, Send
    lifecycle, Results reply + tally) is legible on the dark canvas and still animates.
  - Mobile: the flow strip scrolls and auto-centers the active node.
- Toggle `prefers-reduced-motion`: traveling dashes + node pulse + mobile auto-scroll collapse to static;
  in-step animations collapse to instant as before.

## 12. Out of scope / future

- Real branching nodes (true/false) — only relevant once the real engine (goal b) introduces conditional
  paths; revisit then.
- Sub-node "tool" badges hanging off a node (n8n's dashed sub-connectors) — a later flourish if the real
  workflow exposes tools/integrations worth showing.
