# Automation Demos: Shared Engine + Win-Back Campaign — Design Spec

**Status:** Approved — ready for implementation planning
**Routes added:** `/demos/win-back-campaign` (full-bleed)

## Overview

Give each automation service its own **interactive, click-through simulator** in
the style of the existing commercial cleaning demo (`/demos/commercial-cleaning`).
The first is the **Win-Back Campaign** (dental-practice persona). To avoid
duplicating ~2,500 lines per automation, first extract the reusable machinery
from the commercial cleaning demo into a **shared demo engine**, refactor the
commercial cleaning demo onto it (behavior-preserving), then build the Win-Back
demo as a thin folder on top.

The commercial cleaning demo already separates cleanly into:
- **Generic machinery** — stepped controller, `FlowMap`, `FlowAiLane`, `AiPanel`,
  the send-lifecycle animation, `usePrefersReducedMotion`, the shell layout, CSS.
- **Domain-specific parts** — the steps list, the `WorkflowProvider` data
  interface, the mock `script.ts`, the per-step components.

That split is the basis for the engine.

## Goals

1. A **shared engine** (`src/demos/shared/`) that any automation demo consumes,
   parameterized by a per-demo **steps config**.
2. **Commercial cleaning refactored** onto the engine with **no behavioral or
   visual change** (same route, same six steps, same animations).
3. A new **Win-Back Campaign** demo on the engine, full-bleed at
   `/demos/win-back-campaign`, dental-practice persona.
4. The Automated Workflows page's **"Win-Back Campaigns" example card links**
   into the demo.

## Non-Goals / Out of Scope

- The other eight example automations (Missed-Call Text-Back, Review Generation,
  etc.) — later, each a thin folder on the same engine.
- Any change to the site theme, landing page, or other service pages.
- Real integrations — all demo data stays mocked/scripted.

---

## Architecture

### The steps-config abstraction (the key generalization)

Today `DemoController` hardcodes `STEPS`, `stepMeta.ts` hardcodes the label/icon
map and `AI_STEPS`. Generalize all three into one per-demo array:

```ts
// src/demos/shared/types.ts
import type { IconType } from "react-icons";

export interface DemoStep {
  id: string;        // unique within the demo, e.g. "import"
  label: string;     // FlowMap + stage header, e.g. "Import list"
  Icon: IconType;    // react-icons component
  isAi?: boolean;    // true → gets the "Powered by Claude" AI-lane mark
}
```

A demo passes its `DemoStep[]` to the engine; the engine derives step count,
the FlowMap nodes, the AI lane, and the stage header from it.

### Shared engine — `src/demos/shared/`

| Module | Responsibility | Notes on generalization |
|---|---|---|
| `DemoController.tsx` | Stepped state machine + `useDemo()` context. `DemoProvider` takes `steps: DemoStep[]`. Exposes `stepIndex`, `stepId`, `steps`, `next/back/goTo/reset`, `canBack/canNext`. | Remove the send-lifecycle state (`sendStatus`/`startSend`/`markReplied`) from here — it moves to `SendLifecycleProvider`. Navigation only. |
| `SendLifecycleProvider.tsx` | Optional provider + `useSendLifecycle()` hook for the mocked message-send animation (`idle → sending → delivered → opened → replied`), with the existing timings (`SENDING_MS`/`DELIVERED_MS`) and reduced-motion shortcut. | Lifted to demo level (not step level) so the status **persists across the Send → Results step change**. Resets on demo reset / when navigation returns to step 0. Demos with a send flow wrap their shell in it; demos without one omit it. |
| `FlowMap.tsx` + `.css` | The step diagram: nodes from `steps`, done/active/upcoming states, click-to-`goTo`, auto-scroll active node into view, AI marks, "Powered by Claude" caption. | Reads `steps` from `useDemo()` instead of the module-level `STEPS`/`STEP_META`/`AI_STEPS`. |
| `FlowAiLane.tsx` + `.css` | The animated AI lane connecting `isAi` nodes. | Takes node refs + active step id (as today); AI nodes derived from `steps`. |
| `AiPanel.tsx` + `.css` | Animated reasoning panel (`title` + `lines[]` revealed in sequence, working/done state). | Already fully generic — moves as-is. |
| `DemoShell.tsx` + `.css` | Page layout: `<main class="demo">` → header (eyebrow / title / lede / Calendly CTA) → `FlowMap` → stage (stage header + step body) → Back/Restart/Next nav. | Props: `eyebrow`, `title`, `lede`, and a `renderStage(stepId) => ReactNode`. CSS is today's `DemoPage.css`, moved and renamed. |
| `usePrefersReducedMotion.ts` | Reduced-motion hook. | Moves as-is. |
| `types.ts` | `DemoStep` and any shared demo types. | New. |

Constants: `CALENDLY_URL = "https://calendly.com/brian-paradigmshiftdev/30min"`
lives in the shell (used by the header CTA), so demos don't repeat it.

### Per-demo folders

A demo folder provides only its domain:

```
src/demos/winBackCampaign/
  steps.ts              # DemoStep[] for this demo
  types.ts              # WinBack WorkflowProvider + data shapes
  script.ts             # mock data (dental practice)
  provider.ts           # ScriptedWorkflowProvider implementing the interface
  WinBackDemo.tsx       # composes DemoProvider + SendLifecycleProvider + DemoShell
  steps/                # per-step components (consume the provider)
    ImportListStep.tsx + .css
    SegmentStep.tsx + .css
    CraftOfferStep.tsx + .css
    SendStep.tsx + .css
    RepliesStep.tsx + .css
    ResultsStep.tsx + .css
```

`WinBackDemo.tsx` is the analog of today's `DemoPage.tsx`: it wires the demo's
`steps` into `DemoProvider`, wraps in `SendLifecycleProvider`, and renders
`DemoShell` with the header copy and a `renderStage` switch mapping step id →
step component.

### Commercial cleaning refactor (behavior-preserving)

- **Delete** the generic files from `src/demos/commercialCleaning/` once shared
  equivalents exist: `DemoController.tsx`, `FlowMap.*`, `FlowAiLane.*`,
  `AiPanel.*`, `usePrefersReducedMotion.ts`, `DemoPage.css` (shell CSS).
- **Keep** the domain files: `types.ts`, `script.ts`, `ScriptedWorkflowProvider.ts`,
  `stepMeta.ts` (folded into a `steps.ts` `DemoStep[]`), the six `steps/*`
  components.
- **Rewrite** `DemoPage.tsx` to compose the shared engine (like `WinBackDemo.tsx`).
- The Send/Results steps switch from `useDemo().sendStatus` to
  `useSendLifecycle()`.
- **Acceptance:** `/demos/commercial-cleaning` looks and behaves identically —
  same six steps, same AI panels, same send animation, same nav.

---

## The Win-Back Campaign demo

**Persona:** a dental practice running a win-back campaign against its own list
of lapsed patients (overdue for cleanings/checkups). The "company" object holds
the practice name, services, and the win-back parameters (e.g. "patients with no
visit in 9+ months").

**Flow (6 steps; 2 AI steps mirror the CC rhythm):**

| # | id | label | isAi | What it shows |
|---|---|---|---|---|
| 1 | `import` | Import list | – | Pull the past-patient list from the practice's CRM/PMS (or a spreadsheet): row count, source, a sample of records. |
| 2 | `segment` | Segment | ✓ | Claude analyzes the list, finds the lapsed & winnable patients, scores/segments them (e.g. "overdue 9–18 mo, no active plan"), and drops the unreachable/inactive. AI panel narrates the reasoning. |
| 3 | `offer` | Craft offer | ✓ | Claude drafts the win-back offer and per-segment SMS/email copy (e.g. "We miss you — $59 return cleaning"). AI panel narrates; shows the drafted message for the featured patient. |
| 4 | `send` | Send | – | The campaign sends; animated `sending → delivered → opened` lifecycle (via `useSendLifecycle`). |
| 5 | `replies` | Replies & bookings | – | A patient replies and books; shows the inbound reply and the booked appointment. |
| 6 | `results` | Results | – | Summary: contacted / delivered / replied / booked, and estimated revenue recovered, plus a takeaway line. |

**Data interface (`WinBack` `WorkflowProvider`)** — analogous to the CC provider,
shaped to this domain:

```ts
getPractice(): Practice;                 // name, services, win-back window
getPatients(): PatientRecord[];          // imported list sample (step 1)
getSegments(): Segment[];                // step 2 output: label, count, criteria
getDroppedSummary(): DroppedSummary;     // step 2: how many dropped and why
getOffer(): Offer;                       // step 3: offer terms + per-segment copy
getMessage(patientId): DraftMessage;     // step 3: featured drafted SMS/email
getReply(patientId): Reply;              // step 5: inbound reply
getBooking(patientId): Booking;          // step 5: booked appointment
getResults(): ResultsSummary;            // step 6: totals + revenue + takeaway
getFeaturedPatientId(): string;          // the patient steps 3/5 focus on
getAiReasoning(step): AiReasoning;       // "segment" and "offer" reasoning lines
```

All values come from a scripted `script.ts` (mock data), exactly like CC —
no real data, no network.

**AI framing:** the "Powered by Claude" mark appears on `segment` and `offer`;
their `AiPanel` reasoning lines are scripted in `script.ts`.

---

## Routing & wiring

- **`src/App.tsx`** — add a full-bleed route (outside `Layout`), alongside the
  existing commercial cleaning route:
  ```tsx
  <Route path="/demos/win-back-campaign" element={<WinBackDemo />} />
  ```
- **`src/components/AutomatedWorkflows.tsx`** — the example grid's "Win-Back
  Campaigns" card becomes a link to `/demos/win-back-campaign` (internal
  `react-router-dom` `Link`). The other eight example cards stay non-interactive
  for now. This means the example item model gains an optional `href`/`to`; cards
  with it render as links, cards without render as plain cards (no visual
  regression for the others).
- **`netlify.toml`** — unchanged; the existing SPA fallback already rewrites all
  paths to `index.html`.

---

## Constraints

- **Full-bleed demos** — the demo routes render outside the shared `Layout`
  (no site `Header`/`Footer`), same as commercial cleaning.
- **Theme** — the site is now the Electric Azure dark theme; demos already read
  the shared CSS custom properties from `index.css`, so they inherit it. Verify
  the demo surfaces (panels, flow map, AI panel) read on the dark ground; adjust
  any demo-local hardcoded light colors found during the CC refactor.
- **Calendly URL (verbatim):** `https://calendly.com/brian-paradigmshiftdev/30min`,
  with `target="_blank"` + `rel="noopener noreferrer"`.
- **Icons:** `react-icons` (Fa/Hi sets, as elsewhere).
- **No test framework** exists — verification is `npm run build` (tsc + Vite) and
  `npm run lint` (zero warnings, `--max-warnings 0`), plus a manual `npm run dev`
  smoke check of both demo routes.
- **Git is read-only for the assistant** — commit commands are surfaced to Brian.
- **Accessibility/motion** — keep the existing reduced-motion behavior and the
  ARIA on the flow map / nav.

---

## Design details to resolve in the plan

- **Send-lifecycle reset semantics** — `SendLifecycleProvider` must reset its
  status when the demo restarts (nav returns to step 0). Decide whether it
  subscribes to `stepIndex === 0` or the shell's Restart calls an exposed reset.
- **`stepMeta.ts` fate** — folded into each demo's `steps.ts` (`DemoStep[]`);
  the shared engine no longer needs a separate meta map.
- **CSS token audit** — during the CC refactor, confirm no demo CSS hardcodes
  the old brand blue in a way that clashes with the dark theme.

## Verification

- `npm run build` and `npm run lint` pass.
- `/demos/commercial-cleaning` is visually/behaviorally identical to before.
- `/demos/win-back-campaign` runs the full 6-step flow with AI panels and the
  send animation, on the dark theme, full-bleed.
- The Automated Workflows "Win-Back Campaigns" card navigates to the demo; the
  other cards are unchanged.
