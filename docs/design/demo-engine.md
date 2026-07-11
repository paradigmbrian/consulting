# Interactive Demo Engine

Reference for the shared engine that powers the per-automation interactive
simulators (e.g. `/demos/commercial-cleaning`, `/demos/win-back-campaign`).
New automation demos (Missed-Call Text-Back, Review Generation, etc.) are built
on this engine — a spec/plan for one should reference this doc for the
architecture and the "add a new demo" recipe, and only describe its own flow +
mock data.

**Built:** shared engine (`src/demos/shared/`), commercial cleaning refactored
onto it, and the Win-Back Campaign demo.
Origin spec/plan: `docs/superpowers/specs/2026-07-11-automation-demos-shared-engine-winback-design.md`,
`docs/superpowers/plans/2026-07-11-automation-demos-shared-engine-winback.md`.

## What a demo is

A full-bleed, click-through simulator of one automation: a header (eyebrow /
title / lede / Calendly CTA), a **flow map** of steps (with a "Powered by
Claude" AI lane over the AI steps), an active **stage** rendering the current
step, and Back / Restart / Next nav. Each step is a small component that reads
scripted mock data from a per-demo `WorkflowProvider`. Nothing hits the network.

## The engine — `src/demos/shared/`

Everything is driven by a per-demo **steps config**: `DemoStep[]` where
`DemoStep = { id: string; label: string; Icon: IconType; isAi?: boolean }`.

| Module | What it gives you |
|---|---|
| `types.ts` | `DemoStep`. |
| `DemoController.tsx` | `DemoProvider({ steps, children })` + `useDemo()` → `{ steps, stepIndex, stepId, next, back, goTo, reset, resetNonce, canBack, canNext }`. Pure step navigation. |
| `SendLifecycleProvider.tsx` | `SendLifecycleProvider` + `useSendLifecycle()` → `{ status, start, markReplied }` where `status: SendStatus = idle\|sending\|delivered\|opened\|replied`. Mocked send animation (1100/1100 ms), lifted to demo scope so status survives the Send→Results step change; resets only on demo Restart (via `resetNonce`), honours reduced-motion. Wrap a demo in it only if it has a "send" step. |
| `FlowMap.tsx` / `FlowAiLane.tsx` (+ CSS) | The step diagram. Reads `steps` from `useDemo()`, derives the AI lane from `steps.filter(s => s.isAi)`, renders the AI lane + "Powered by Claude" caption only when there is ≥1 AI step. Click a node to jump. |
| `AiPanel.tsx` (+ CSS) | Animated reasoning panel. Props `{ title, lines, animate?, onComplete? }` — reveals `lines` in sequence, calls `onComplete` when done (or immediately under reduced-motion). Use it to gate a "reveal" in an AI step. |
| `DemoShell.tsx` (+ CSS) | The whole page frame. Props `{ eyebrow, title, lede, renderStage(stepId) => ReactNode }`. Renders `<main class="demo">` (which carries the scope-local dark palette), header, `FlowMap`, the stage (`StageHeader` + `renderStage`), and nav. Owns the Calendly URL. |
| `usePrefersReducedMotion.ts` | Reduced-motion hook. |

## Recipe — add a new automation demo

Create `src/demos/<name>/` (camelCase folder, e.g. `missedCallTextBack/`):

1. **`types.ts`** — a `WorkflowProvider` interface for this domain (getters for
   each step's data + `getFeaturedXId()` + `getAiReasoning(step)`), plus its data
   shapes and an `AiStep` union.
2. **`script.ts`** — the scripted mock data (all values). Keep ids aligned: the
   featured id must have a matching entry in every per-featured getter
   (message/reply/etc.) or the provider will throw.
3. **`provider.ts`** — `class ScriptedWorkflowProvider implements WorkflowProvider`
   + `export const scriptedWorkflowProvider`.
4. **`steps.ts`** — the `DemoStep[]` (import `DemoStep` from `../shared/types`);
   set `isAi: true` on the steps Claude drives.
5. **`steps/*.tsx`** — one component per step, signature
   `({ provider }: { provider: WorkflowProvider })`, using namespaced CSS classes.
6. **`<name>.css`** — the step styling, namespaced (e.g. `wb-*`), imported once
   by the demo component. Use the `--demo-*` / remapped `--color-*` tokens from
   the `.demo` scope (see Conventions).
7. **`<Name>Demo.tsx`** — compose it:
   ```tsx
   <DemoProvider steps={steps}>
     <SendLifecycleProvider>            {/* only if there's a send step */}
       <DemoShell eyebrow=… title=… lede=… renderStage={renderStage} />
     </SendLifecycleProvider>
   </DemoProvider>
   ```
   where `renderStage(stepId)` is a switch mapping each step id → its component
   with `provider={provider}`.
8. **Route** — in `src/App.tsx`, add `<Route path="/demos/<slug>" element={<NameDemo />} />`
   as a sibling of the other demo routes, **outside** the `<Route element={<Layout/>}>`
   block (demos are full-bleed).
9. **Link it** — in `src/components/AutomatedWorkflows.tsx`, set
   `to: "/demos/<slug>"` on that automation's example entry; the card renders a
   "Try the demo →" link automatically.

### Patterns to copy from the Win-Back demo
- **AI step with reveal:** `SegmentStep`/`CraftOfferStep` — render `AiPanel` with
  the step's reasoning; gate a `wb-reveal` block on `onComplete={() => setRevealed(true)}`,
  initialized to the reduced-motion value.
- **Send step:** `SendStep` — `const { status, start } = useSendLifecycle()`;
  call `start()` once via a `started` ref; render a `sending→delivered→opened`
  stage row keyed off `status`.
- **Reply/booking reveal:** `RepliesStep` — delayed reveal + `markReplied()`.

## Conventions

- **Full-bleed:** demo routes render outside `Layout` (no site header/footer).
- **Scope-local dark palette:** `DemoShell.css` scopes `--demo-*` tokens and
  remaps `--color-*` under `.demo`, so demos are dark independent of the site
  theme. (Currently the old brand blue `#2777b4`; on-brand Electric Azure is a
  deferred one-file tweak — see `docs/design/color-themes.md`.)
- **Calendly (verbatim):** `https://calendly.com/brian-paradigmshiftdev/30min`,
  `target="_blank"` + `rel="noopener noreferrer"` — already handled by `DemoShell`.
- **No test framework:** verify with `npm run build` (tsc + Vite) and
  `npm run lint` (`--max-warnings 0`), plus a manual `npm run dev` click-through.
- **react-icons** for all icons; vanilla CSS with the shared custom properties.
