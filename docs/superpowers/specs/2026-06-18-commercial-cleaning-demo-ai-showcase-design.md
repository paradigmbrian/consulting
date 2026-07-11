# Commercial-Cleaning Demo — AI Showcase Design Spec

**Date:** 2026-06-18
**Project:** `paradigm/consulting-website`
**Status:** Approved for planning
**Author:** Brian (with Claude)
**Builds on:** `2026-06-17-commercial-cleaning-demo-design.md` (scripted demo) and
`2026-06-18-commercial-cleaning-demo-n8n-restyle-design.md` (dark n8n flow restyle) — both implemented.

## 1. Purpose

The demo currently only *implies* AI (the personalized email types itself in). Prospects evaluating a
lead-gen workflow want to **see the AI doing the work**. This spec adds two coordinated, visible AI
treatments to the existing dark n8n-style `/demos/commercial-cleaning` walkthrough:

1. An **"AI model" node in the flow map** — an n8n-style `Claude` node that feeds the AI-powered steps
   via dashed connectors (mirroring the model-feeds-agent pattern in the reference image).
2. **In-step "AI at work" panels** — a reusable panel that shows Claude's reasoning (and, on Personalize,
   its generation) inside the three AI-powered steps.

It is a presentational + content addition. The six-step flow, the mocked send/reply, routing, and the
landing page are unchanged. The `WorkflowProvider` seam is preserved and extended so the *real* engine
(phase 2) can return actual streamed Claude reasoning through the same interface.

## 2. Goals & non-goals

**Goals**
- Make AI involvement unmistakable and concrete on Discover, Enrich & qualify, and Personalize.
- Keep the n8n aesthetic and all existing demo behavior intact.
- Brand the model generically as **"Claude"** (with "Anthropic") — no version number, so the static
  marketing page never goes stale.
- Extend, not bypass, the `WorkflowProvider` interface so phase 2 swaps scripted reasoning for real.

**Non-goals**
- No real Claude API calls — reasoning text is authored/scripted (placeholder copy, Brian refines).
- No change to the six-step flow, the mocked send lifecycle, `goTo`/nav, routing, or `netlify.toml`.
- No AI treatment on Define / Send / Reply&results (those steps aren't AI-driven).
- No new runtime dependencies (vanilla CSS + inline SVG + existing `react-icons`).

## 3. Decisions (from brainstorming)

- **Mechanism:** both — an AI node in the flow map *and* in-step reasoning panels.
- **AI steps:** all three of Discover, Enrich & qualify, Personalize get the in-step treatment.
- **Branding:** generic "Claude" (`✦ Claude` mark + "Anthropic"), no model version.

## 4. Content model + provider extension

The reasoning copy is authored data, kept in the existing content module and read through the provider —
same pattern as the rest of the demo.

**Types (`types.ts`):**
```ts
export type AiStep = "discover" | "enrich" | "personalize";

export interface AiReasoning {
  step: AiStep;
  /** Panel header, e.g. "Claude — matching buy-signals". */
  title: string;
  /** Short reasoning lines, revealed sequentially. */
  lines: string[];
}
```

**`WorkflowProvider` gains one method:**
```ts
getAiReasoning(step: AiStep): AiReasoning;
```

**`script.ts`** adds an authored `aiReasoning: Record<AiStep, AiReasoning>`:
- **discover** — 2-3 lines of inferred match logic (facility type, no in-house janitorial, in service area).
- **enrich** — 2-4 lines framing the qualify/drop calls as Claude's assessment, naming a couple of the
  dropped prospects and why (competitor, residential, no decision-maker).
- **personalize** — 3-4 reasoning bullets about the **featured** prospect, referencing enrichment
  specifics (operatory count, owner is the decision-maker, inspection-readiness angle) — the rationale
  the email is built on.

`ScriptedWorkflowProvider` implements `getAiReasoning` by lookup. Phase 2's `LiveWorkflowProvider`
returns real streamed Claude reasoning behind the same signature.

**Constant:** `AI_STEPS: readonly StepId[] = ["discover", "enrich", "personalize"]` (single source of
truth for "which steps are AI-powered"), placed in `stepMeta.ts` next to `STEP_META`.

## 5. Reusable `AiPanel` component

**Files:** `src/demos/commercialCleaning/AiPanel.tsx` + `AiPanel.css`.

A dark, accent-bordered panel used inside the three AI steps.

**Props:**
```ts
interface AiPanelProps {
  title: string;        // e.g. "Claude — matching buy-signals"
  lines: string[];      // reasoning lines
  animate?: boolean;    // default true; false renders all lines at once
  onComplete?: () => void; // fired after the last line reveals
}
```

**Behavior:**
- Header: a `✦ Claude` mark + the title, plus a "working" state — a pulsing dot — shown while lines are
  still revealing; switches to a steady/"done" state after the last line.
- Body: reasoning `lines` reveal sequentially (one every ~500 ms) via `setTimeout`, each fading/sliding in.
  Timers are cleared on unmount.
- **Reduced motion:** all lines render immediately, no pulsing dot animation, `onComplete` called right
  away. (Uses the existing `usePrefersReducedMotion` hook; CSS animations gated by
  `@media (prefers-reduced-motion: reduce)`.)
- Styling uses the demo tokens (`--demo-surface`, `--demo-accent-bright`, `--demo-accent-glow`, etc.).

## 6. Flow-map AI node (`FlowAiLane`)

**Files:** `src/demos/commercialCleaning/FlowAiLane.tsx` + `FlowAiLane.css`. `FlowMap` renders it inside
its positioned container and supplies refs to the three AI-step nodes.

**Desktop (>768px):**
- Below the horizontal step track, a centered **`✦ Claude` node** (mark + "Claude" + "Anthropic" subtitle),
  styled like a flow node but visually distinct (accent-tinted).
- An absolutely-positioned **SVG overlay** spanning the flow-map container draws **dashed connectors** from
  the Claude node up to each of the three AI-step nodes (Discover, Enrich & qualify, Personalize).
- Connector geometry is **measured**: `FlowMap` holds refs to the three AI nodes and the Claude node; a
  layout effect computes their positions relative to the container and builds the SVG paths. It re-measures
  on window/element resize (`ResizeObserver`) and when `stepIndex` changes (layout is otherwise static).
- The connector feeding the **currently-active** AI step (when the active step is one of the three)
  animates with the same traveling-dash + glow language as the main flow; the other two are static dashed.
- Each of the three AI-step **nodes in the main chain also gets a small `✦` marker** so the
  Claude-powered steps are identifiable at a glance.

**Mobile (≤768px):** the chain is a horizontally-scrollable strip, so measured cross-node geometry is
unreliable. There, **drop the Claude sub-node + SVG overlay** and instead keep the `✦` markers on the AI
nodes plus a single **"✦ Powered by Claude"** caption under the flow. The in-step panels carry the AI
story on mobile.

**Reduced motion:** dashed connectors render static (no travel), the active-connector glow is static.

## 7. Per-step integration

- **DiscoverStep** — render `AiPanel` (title from `getAiReasoning("discover")`) above/alongside the
  prospect reveal, so Claude's match reasoning appears as the matched businesses surface.
- **EnrichQualifyStep** — render `AiPanel` (`getAiReasoning("enrich")`) above the qualified/dropped lists,
  framing the split as Claude's assessment. The existing drop cards + reasons are unchanged.
- **PersonalizeStep** — render `AiPanel` (`getAiReasoning("personalize")`) first; its `onComplete` (or a
  simple "reasoning done" state) gates the start of the existing email typing animation so it reads as
  "Claude reasons, then drafts." Add a **`✦ Drafted by Claude`** badge to the email card header. Under
  reduced motion the panel is instant and the email is fully shown, as today.

All three steps already receive `provider`; they call `provider.getAiReasoning(step)`. No change to the
prospect/email/reply data or the step state machine.

## 8. Iconography

The AI mark is a **sparkle/AI glyph** from `react-icons` (already a dependency; e.g. `HiSparkles`). The
implementation pins the exact import after verifying it builds — if the chosen glyph isn't exported by the
installed `react-icons` version, fall back to another available sparkle/star glyph. "Anthropic" appears as
a text subtitle only (no third-party logo asset).

## 9. Error handling & edge cases

- Presentational + scripted; no network or data-fetch paths.
- `AiPanel` and `FlowAiLane` clear any timers on unmount; reduced motion collapses all new animation.
- The flow-map measurement degrades safely: if refs aren't ready on first paint, the overlay renders
  nothing until measured; on mobile it isn't rendered at all.
- `getAiReasoning` throws on an unknown step (consistent with the provider's other lookups), but is only
  called with the three `AI_STEPS`.

## 10. Affected / new files

- **New:** `AiPanel.tsx` / `.css`; `FlowAiLane.tsx` / `.css`.
- **Modified:**
  - `types.ts` — `AiStep`, `AiReasoning`, `getAiReasoning` on `WorkflowProvider`.
  - `script.ts` — authored `aiReasoning`.
  - `ScriptedWorkflowProvider.ts` — implement `getAiReasoning`.
  - `stepMeta.ts` — `AI_STEPS` constant.
  - `FlowMap.tsx` / `.css` — `✦` markers on AI nodes, AI-node refs, render `FlowAiLane`, measurement glue.
  - `steps/DiscoverStep.tsx` / `.css`, `steps/EnrichQualifyStep.tsx` / `.css`,
    `steps/PersonalizeStep.tsx` / `.css` — render `AiPanel`; Personalize adds the "Drafted by Claude" badge
    and gates email typing on reasoning completion.
- **Unchanged:** `DemoController.tsx`, `DemoPage.tsx`, `usePrefersReducedMotion.ts`, routing,
  `netlify.toml`, `index.css`, the landing page, and all non-AI step content/data.

## 11. Testing & definition of done

- `npm run lint` — zero warnings.
- `npm run build` — TypeScript check + Vite build green.
- Manual walkthrough on desktop and mobile widths:
  - Flow map shows `✦` markers on Discover / Enrich / Personalize; on desktop the centered `Claude` node
    renders with dashed connectors to those three nodes, and the connector into the active AI step animates;
    on ≤768px the sub-node is hidden and the "✦ Powered by Claude" caption shows.
  - Discover, Enrich, and Personalize each show the `AiPanel` with Claude's reasoning revealing in sequence.
  - Personalize: reasoning appears first, then the email types in, with the `✦ Drafted by Claude` badge.
  - All prior behavior (reveal, drop-offs, send lifecycle, reply, tally, nav, `goTo`) still works.
- Toggle `prefers-reduced-motion`: panel line reveal, the pulsing dot, dashed-connector travel, and email
  typing all collapse to static/instant.

## 12. Out of scope / future

- Real streamed Claude reasoning and generation (phase 2) — swaps `ScriptedWorkflowProvider` for
  `LiveWorkflowProvider` behind `getAiReasoning`/`getEmail`, no UI rewrite.
- Tool/integration sub-nodes hanging off the Claude node (n8n's tool dashed sub-connectors) — a later
  flourish once the real workflow exposes concrete tools.
