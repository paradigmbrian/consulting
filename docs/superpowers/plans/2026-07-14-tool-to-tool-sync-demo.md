# Tool-to-Tool Sync Demo Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the tenth and final interactive click-through demo — Tool-to-Tool Sync for *Guardian Pest Control* — on the shared demo engine, and link it from its example card on the Automated Workflows page (the last card without a link).

**Architecture:** A new thin folder `src/demos/toolSync/` mirroring `src/demos/jobDispatch/`: a `WorkflowProvider` interface + data types (`types.ts`), all mock data (`script.ts`), a scripted provider (`provider.ts`), 5 step definitions (`steps.ts`), 5 step components (`steps/`), scoped CSS (`sync.css`), and a composition root (`ToolSyncDemo.tsx`). Everything in `src/demos/shared/` (shell, flow rail, `AiPanel`, reduced-motion) is reused unchanged — **no engine changes**. Two AI steps (`map`, `reconcile`) render the shared `AiPanel`; `push` is a self-contained timed reveal. There is **no send-lifecycle step** — the demo is purely internal, so `SendLifecycleProvider` is omitted from the composition.

**Tech Stack:** React 18 + TypeScript, Vite 5, `react-router-dom` v6, `react-icons/fa`, vanilla CSS with custom properties.

## Global Constraints

- **No engine/shared changes.** Only files under `src/demos/toolSync/` are created, plus two one-line edits (`src/App.tsx` route, `src/components/AutomatedWorkflows.tsx` `to:` field).
- **Class prefix `tts-`** on every bespoke class; use `--demo-*` and `--spacing-*` tokens only (both already in scope: `--demo-*` from `.demo` in `DemoShell.css`, `--spacing-*` from `:root` in `index.css`).
- **Attention accent** for the duplicate-caught / conflict state is the established sibling **amber** `#f4b740` with a `rgba(244, 183, 64, 0.12)` tint (declared as local `--tts-warn` / `--tts-warn-tint` on `.tts-step`). This is a caution, not an emergency — amber, not red. Green `var(--demo-success)` for the "Synced" state, matched records, conflict resolutions, and the on-screen success accents.
- **5 steps, no send lifecycle.** `ToolSyncDemo.tsx` composes `DemoProvider steps → DemoShell renderStage` — it does **not** wrap `SendLifecycleProvider`, and no step imports `useSendLifecycle`.
- **Tool-name consistency.** The four `getMappings()` entries and the four `getSyncResult().rows` entries must use the same four `toolName` strings as `getTools()`: **Ledgerbook, Pipeline, Calendar, CrewHQ**. Tool names are invented and brand-neutral (no real trademarks).
- **No test framework exists** in this repo. Per project convention the verification cycle for every task is: `npm run build` (tsc + Vite, zero errors, no unused imports) → `npm run lint` (zero warnings) → dev smoke where applicable. There are no unit-test steps.
- **Git is user-run.** Per user preference (read-only git), do **not** execute git write commands. Each task ends by surfacing the exact `git add` / `git commit` command for Brian to run; leave files in the working tree.
- **No horizontal scroll at mobile widths.** The tool chips, mapping cards, conflict rows, sync board, and tally must stay readable; match the prior demos' `@media (max-width: 640px)` breakpoints.
- Content values are illustrative and tunable; the `WorkflowProvider` interface is fixed.

---

## File Structure

Created under `src/demos/toolSync/`:

- `types.ts` — `WorkflowProvider` interface + all data types (`Business`, `SourceJob`, `ToolTarget`, `MappedField`, `ToolMapping`, `Conflict`, `Reconciliation`, `SyncRow`, `SyncSummary`, `ResultsSummary`, `AiReasoning`, and the union `AiStep`).
- `script.ts` — all mock data (business, job, tools, mappings, reconciliation, sync result, results, AI reasoning).
- `provider.ts` — `scriptedWorkflowProvider` implementing `WorkflowProvider`.
- `steps.ts` — the 5 `DemoStep`s with `react-icons/fa` icons; `map` and `reconcile` carry `isAi: true`.
- `sync.css` — scoped `tts-*` styles.
- `steps/IntakeStep.tsx` — step 1, the raw job card + tool-destination chips.
- `steps/MapStep.tsx` — step 2 (AI), `AiPanel` then the per-tool mapping cards reveal.
- `steps/ReconcileStep.tsx` — step 3 (AI), `AiPanel` then the duplicate banner + conflict rows reveal.
- `steps/PushStep.tsx` — step 4, self-contained timed reveal of the tool rows flipping to "Synced".
- `steps/ResultsStep.tsx` — step 5, the tally grid + takeaway.
- `ToolSyncDemo.tsx` — composes `DemoProvider steps → DemoShell renderStage` (no `SendLifecycleProvider`).

Modified:

- `src/App.tsx` — add the `/demos/tool-sync` route (outside `Layout`).
- `src/components/AutomatedWorkflows.tsx` — add `to: "/demos/tool-sync"` to the existing "Tool-to-Tool Sync" example.

---

### Task 1: Data contract — types, script, provider

Establishes the `WorkflowProvider` interface, all mock data, and the scripted provider. Deliverable: the data layer compiles and the provider satisfies the interface. No UI yet.

**Files:**
- Create: `src/demos/toolSync/types.ts`
- Create: `src/demos/toolSync/script.ts`
- Create: `src/demos/toolSync/provider.ts`

**Interfaces:**
- Consumes: nothing (foundation task).
- Produces: the exports every later task imports —
  - Types (from `./types`): `AiStep = "map" | "reconcile"`, `Business { name, service, context }`, `SourceJob { customer, address, service, price, date, phone }`, `ToolTarget { name, kind }`, `MappedField { label, value }`, `ToolMapping { toolName, kind, fields: MappedField[] }`, `Conflict { field, incoming, existing, resolution }`, `Reconciliation { duplicateFound: boolean, existingLabel, matchReason, conflicts: Conflict[], note }`, `SyncRow { toolName, detail }`, `SyncSummary { headline, rows: SyncRow[], note }`, `ResultsSummary { toolsSynced: number, fieldsMapped, duplicatesPrevented, timeSaved, takeaway }`, `AiReasoning { step: AiStep, title, lines: string[] }`, `WorkflowProvider`.
  - `scriptedWorkflowProvider: WorkflowProvider` (from `./provider`).
  - Every `WorkflowProvider` method: `getBusiness()`, `getJob()`, `getTools()`, `getMappings()`, `getReconciliation()`, `getSyncResult()`, `getResults()`, `getAiReasoning(step: AiStep)`.

- [ ] **Step 1: Create `types.ts`**

```ts
export type AiStep = "map" | "reconcile";

export interface Business {
  name: string;
  service: string;
  context: string;
}

export interface SourceJob {
  customer: string;
  address: string;
  service: string;
  price: string;
  date: string;
  phone: string;
}

export interface ToolTarget {
  name: string;
  kind: string;
}

export interface MappedField {
  label: string;
  value: string;
}

export interface ToolMapping {
  toolName: string;
  kind: string;
  fields: MappedField[];
}

export interface Conflict {
  field: string;
  incoming: string;
  existing: string;
  resolution: string;
}

export interface Reconciliation {
  duplicateFound: boolean;
  existingLabel: string;
  matchReason: string;
  conflicts: Conflict[];
  note: string;
}

export interface SyncRow {
  toolName: string;
  detail: string;
}

export interface SyncSummary {
  headline: string;
  rows: SyncRow[];
  note: string;
}

export interface ResultsSummary {
  toolsSynced: number;
  fieldsMapped: string;
  duplicatesPrevented: string;
  timeSaved: string;
  takeaway: string;
}

export interface AiReasoning {
  step: AiStep;
  title: string;
  lines: string[];
}

export interface WorkflowProvider {
  getBusiness(): Business;
  getJob(): SourceJob;
  getTools(): ToolTarget[];
  getMappings(): ToolMapping[];
  getReconciliation(): Reconciliation;
  getSyncResult(): SyncSummary;
  getResults(): ResultsSummary;
  getAiReasoning(step: AiStep): AiReasoning;
}
```

- [ ] **Step 2: Create `script.ts`**

```ts
import type {
  Business,
  SourceJob,
  ToolTarget,
  ToolMapping,
  Reconciliation,
  SyncSummary,
  ResultsSummary,
  AiStep,
  AiReasoning,
} from "./types";

export const business: Business = {
  name: "Guardian Pest Control",
  service: "Residential pest control — quarterly plans & one-off treatments",
  context:
    "Every booked job used to get retyped into four apps by hand — ten minutes of double entry per job, and half-typed names quietly spawned duplicate customers.",
};

export const job: SourceJob = {
  customer: "E. Vargas",
  address: "512 Cypress Bend",
  service: "Quarterly pest plan — initial visit",
  price: "$149",
  date: "Thu, Jul 17 · 9–11 AM",
  phone: "(512) 555-0148",
};

export const tools: ToolTarget[] = [
  { name: "Ledgerbook", kind: "Accounting & invoicing" },
  { name: "Pipeline", kind: "CRM — contacts & deals" },
  { name: "Calendar", kind: "Scheduling" },
  { name: "CrewHQ", kind: "Field app — work orders" },
];

export const mappings: ToolMapping[] = [
  {
    toolName: "Ledgerbook",
    kind: "Accounting & invoicing",
    fields: [
      { label: "Customer", value: "Elena Vargas" },
      { label: "Billing address", value: "512 Cypress Bend" },
      { label: "Item", value: "Quarterly pest plan – initial" },
      { label: "Amount", value: "$149.00" },
      { label: "Invoice", value: "Draft #1043" },
    ],
  },
  {
    toolName: "Pipeline",
    kind: "CRM — contacts & deals",
    fields: [
      { label: "Contact", value: "Elena Vargas" },
      { label: "Stage", value: "Won" },
      { label: "Deal", value: "Quarterly plan" },
      { label: "Value", value: "$149" },
      { label: "Source", value: "Online booking" },
    ],
  },
  {
    toolName: "Calendar",
    kind: "Scheduling",
    fields: [
      { label: "Title", value: "Guardian — initial pest visit (Vargas)" },
      { label: "When", value: "Thu Jul 17 · 9:00–11:00 AM" },
      { label: "Location", value: "512 Cypress Bend" },
      { label: "Route", value: "Route 3" },
    ],
  },
  {
    toolName: "CrewHQ",
    kind: "Field app — work orders",
    fields: [
      { label: "Work order", value: "Quarterly initial — Vargas" },
      { label: "Address", value: "512 Cypress Bend" },
      { label: "Window", value: "9–11 AM" },
      { label: "Notes", value: "Gate code at booking; dog on site" },
    ],
  },
];

export const reconciliation: Reconciliation = {
  duplicateFound: true,
  existingLabel: "Existing account: Elena Vargas — last serviced 14 mo ago (lapsed)",
  matchReason:
    "Same address and phone as the booking; it came in as 'E. Vargas,' which looked like a brand-new customer.",
  conflicts: [
    {
      field: "Name",
      incoming: "E. Vargas",
      existing: "Elena Vargas",
      resolution: "Merged onto the existing full-name record.",
    },
    {
      field: "Phone",
      incoming: "(512) 555-0148",
      existing: "(512) 555-0132",
      resolution: "Updated to the new number; kept the old on file as history.",
    },
  ],
  note: "Instead of a second 'E. Vargas' customer, the job attached to the real Elena Vargas — and reactivated her lapsed quarterly plan.",
};

export const syncResult: SyncSummary = {
  headline: "Written to all 4 tools",
  rows: [
    { toolName: "Ledgerbook", detail: "Customer matched · draft invoice #1043" },
    { toolName: "Pipeline", detail: "Deal marked Won on the existing contact" },
    { toolName: "Calendar", detail: "Visit booked Thu 9–11 AM" },
    { toolName: "CrewHQ", detail: "Work order created for Route 3" },
  ],
  note: "One entry became four correct records — no duplicate, no retyping.",
};

export const results: ResultsSummary = {
  toolsSynced: 4,
  fieldsMapped: "18",
  duplicatesPrevented: "1 (this job)",
  timeSaved: "~9 min/job",
  takeaway:
    "One booking flowed into accounting, CRM, calendar, and the crew app — correctly shaped for each, with a duplicate customer caught before it doubled up. The office stops retyping, the books stay clean, and nothing falls through the gap between tools.",
};

export const aiReasoning: Record<AiStep, AiReasoning> = {
  map: {
    step: "map",
    title: "Claude — shaping the job for each tool",
    lines: [
      "Reading the one booking: customer, address, service, price, date, phone.",
      "Translating those facts into each tool's own schema and field names.",
      "Building a draft invoice, a CRM deal, a calendar event, and a work order.",
      "Formatting the phone, price, and date the way each app expects them.",
      "Pulling the booking notes through so the crew has what they need.",
    ],
  },
  reconcile: {
    step: "reconcile",
    title: "Claude — checking for duplicates",
    lines: [
      "Before writing anything, searching each tool for an existing match.",
      "Matching on address and phone even though the name came in abbreviated.",
      "Found it — this 'new' customer is a lapsed account, not a new one.",
      "Merging onto the real record instead of creating a second customer.",
      "Resolving the phone conflict, keeping history, and reactivating the plan.",
    ],
  },
};
```

- [ ] **Step 3: Create `provider.ts`**

```ts
import type {
  Business,
  SourceJob,
  ToolTarget,
  ToolMapping,
  Reconciliation,
  SyncSummary,
  ResultsSummary,
  AiStep,
  AiReasoning,
  WorkflowProvider,
} from "./types";
import {
  business,
  job,
  tools,
  mappings,
  reconciliation,
  syncResult,
  results,
  aiReasoning,
} from "./script";

class ScriptedWorkflowProvider implements WorkflowProvider {
  getBusiness(): Business {
    return business;
  }

  getJob(): SourceJob {
    return job;
  }

  getTools(): ToolTarget[] {
    return tools;
  }

  getMappings(): ToolMapping[] {
    return mappings;
  }

  getReconciliation(): Reconciliation {
    return reconciliation;
  }

  getSyncResult(): SyncSummary {
    return syncResult;
  }

  getResults(): ResultsSummary {
    return results;
  }

  getAiReasoning(step: AiStep): AiReasoning {
    return aiReasoning[step];
  }
}

export const scriptedWorkflowProvider: WorkflowProvider =
  new ScriptedWorkflowProvider();
```

- [ ] **Step 4: Verify build**

Run: `npm run build`
Expected: PASS — tsc + Vite complete with no errors. (The new files are not yet imported anywhere; tsc still type-checks them. `ScriptedWorkflowProvider` compiling proves it satisfies `WorkflowProvider`.)

- [ ] **Step 5: Surface the commit command**

Print for Brian to run (do not execute):

```bash
git add src/demos/toolSync/types.ts src/demos/toolSync/script.ts src/demos/toolSync/provider.ts
git commit -m "feat(tool-sync): add tool-to-tool sync demo data contract and provider"
```

---

### Task 2: Scoped stylesheet — `sync.css`

The full `tts-*` stylesheet. CSS classes are not type-checked, so this task's deliverable is verified by build (no import errors) and visually in Task 4's smoke; author it up front so the step components in Tasks 3–4 reference classes that already exist.

**Files:**
- Create: `src/demos/toolSync/sync.css`

**Interfaces:**
- Consumes: `--demo-*` tokens (from `.demo` scope) and `--spacing-*` tokens (from `:root`).
- Produces: the `tts-*` classes every step component uses (`tts-step`, `tts-heading`, `tts-sub`, `tts-note`, `tts-reveal`, `tts-flow-label`, `tts-intake*`/`tts-fields`/`tts-field*`, `tts-tools`/`tts-tool*`, `tts-mappings`/`tts-map*`, `tts-recon`/`tts-dup*`/`tts-conflict*`, `tts-sync`/`tts-sync-*`, `tts-tally`/`tts-takeaway`).

- [ ] **Step 1: Create `sync.css`**

```css
.tts-step {
  color: var(--demo-text);
  /* caution accent — amber, for the duplicate-caught / conflict state */
  --tts-warn: #f4b740;
  --tts-warn-tint: rgba(244, 183, 64, 0.12);
}

.tts-heading {
  font-size: 1.15rem;
  margin: 0 0 var(--spacing-xs);
}

.tts-sub {
  color: var(--demo-muted);
  margin: 0 0 var(--spacing-md);
  max-width: 60ch;
}

.tts-note {
  color: var(--demo-muted);
  font-size: 0.85rem;
  margin: var(--spacing-md) 0 0;
}

/* Reveal wrapper (shared by the map + reconcile steps) */
.tts-reveal {
  opacity: 0;
  transform: translateY(6px);
  transition: opacity 0.4s ease, transform 0.4s ease;
  margin-top: var(--spacing-md);
}
.tts-reveal.is-shown {
  opacity: 1;
  transform: none;
}

/* Intake card (step 1) — the raw booking */
.tts-intake {
  padding: var(--spacing-md);
  background: var(--demo-surface-2);
  border: 1px solid var(--demo-border);
  border-radius: 0.6rem;
}
.tts-intake-head {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  padding-bottom: var(--spacing-sm);
  border-bottom: 1px solid var(--demo-border);
}
.tts-intake-icon {
  flex: 0 0 auto;
  font-size: 1.4rem;
  color: var(--demo-accent-bright);
}
.tts-intake-title {
  font-weight: 700;
  color: var(--demo-text);
}
.tts-intake-source {
  margin-left: auto;
  font-size: 0.75rem;
  color: var(--demo-muted);
}
.tts-fields {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: var(--spacing-sm);
  margin: var(--spacing-sm) 0 0;
}
.tts-field {
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
  min-width: 0;
}
.tts-field-label {
  font-size: 0.7rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--demo-muted);
}
.tts-field-value {
  margin: 0;
  font-weight: 600;
  color: var(--demo-text);
}

/* Tool-destination chips (step 1) */
.tts-flow-label {
  margin: var(--spacing-md) 0 var(--spacing-sm);
  font-size: 0.7rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--demo-muted);
}
.tts-tools {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: var(--spacing-sm);
}
.tts-tool-chip {
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
  padding: var(--spacing-sm);
  background: var(--demo-surface-2);
  border: 1px solid var(--demo-border);
  border-radius: 0.5rem;
}
.tts-tool-name {
  font-weight: 700;
  color: var(--demo-text);
}
.tts-tool-kind {
  font-size: 0.75rem;
  color: var(--demo-muted);
}

/* Mapping cards (step 2) — the job shaped per tool */
.tts-mappings {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: var(--spacing-sm);
}
.tts-map-card {
  padding: var(--spacing-md);
  background: var(--demo-surface-2);
  border: 1px solid var(--demo-border);
  border-radius: 0.6rem;
}
.tts-map-head {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: var(--spacing-sm);
  margin-bottom: var(--spacing-sm);
  padding-bottom: var(--spacing-sm);
  border-bottom: 1px solid var(--demo-border);
}
.tts-map-tool {
  font-weight: 700;
  color: var(--demo-accent-bright);
}
.tts-map-kind {
  font-size: 0.7rem;
  color: var(--demo-muted);
  text-align: right;
}
.tts-map-fields {
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
}
.tts-map-field {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: var(--spacing-sm);
}
.tts-map-label {
  font-size: 0.75rem;
  color: var(--demo-muted);
  flex: 0 0 auto;
}
.tts-map-value {
  margin: 0;
  font-size: 0.8rem;
  font-weight: 600;
  color: var(--demo-text);
  text-align: right;
  min-width: 0;
}

/* Reconcile (step 3) — duplicate banner + conflict rows (amber caution) */
.tts-recon {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}
.tts-dup-banner {
  display: flex;
  align-items: flex-start;
  gap: var(--spacing-sm);
  padding: var(--spacing-md);
  background: var(--tts-warn-tint);
  border: 1px solid var(--tts-warn);
  border-radius: 0.6rem;
}
.tts-dup-icon {
  flex: 0 0 auto;
  margin-top: 0.15rem;
  font-size: 1.3rem;
  color: var(--tts-warn);
}
.tts-dup-meta {
  min-width: 0;
}
.tts-dup-title {
  display: block;
  font-weight: 700;
  color: var(--demo-text);
}
.tts-dup-reason {
  font-size: 0.85rem;
  color: var(--demo-muted);
}
.tts-conflicts {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
}
.tts-conflict {
  padding: var(--spacing-sm) var(--spacing-md);
  background: var(--demo-surface-2);
  border: 1px solid var(--demo-border);
  border-radius: 0.5rem;
}
.tts-conflict-field {
  font-size: 0.7rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.03em;
  color: var(--demo-muted);
}
.tts-conflict-row {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-md);
  margin: 0.35rem 0;
}
.tts-conflict-pair {
  display: flex;
  flex-direction: column;
  gap: 0.1rem;
  min-width: 0;
}
.tts-conflict-tag {
  font-size: 0.65rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--demo-muted);
}
.tts-conflict-incoming,
.tts-conflict-existing {
  font-size: 0.85rem;
  color: var(--demo-text);
}
.tts-conflict-res {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.85rem;
  color: var(--demo-success);
}
.tts-conflict-arrow {
  flex: 0 0 auto;
  color: var(--demo-success);
}
.tts-recon-note {
  margin: var(--spacing-xs) 0 0;
  font-size: 0.85rem;
  line-height: 1.4;
  color: var(--demo-text);
}

/* Sync board (step 4) — tool rows flip to "Synced" (timed reveal) */
.tts-sync {
  padding: var(--spacing-md);
  background: var(--demo-surface-2);
  border: 1px solid var(--demo-border);
  border-radius: 0.6rem;
}
.tts-sync-head {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  font-weight: 700;
  color: var(--demo-text);
  margin-bottom: var(--spacing-md);
}
.tts-sync-rows {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
}
.tts-sync-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--spacing-sm);
  padding: var(--spacing-sm) var(--spacing-md);
  background: var(--demo-bg);
  border: 1px solid var(--demo-border);
  border-radius: 0.5rem;
  transition: border-color 0.3s ease;
}
.tts-sync-row.is-synced {
  border-color: var(--demo-success);
}
.tts-sync-tool {
  font-weight: 700;
  color: var(--demo-text);
  flex: 0 0 auto;
}
.tts-sync-detail {
  font-size: 0.8rem;
  color: var(--demo-muted);
  flex: 1 1 auto;
  min-width: 0;
}
.tts-sync-status {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  font-size: 0.8rem;
  font-weight: 700;
  color: var(--demo-muted);
  white-space: nowrap;
  flex: 0 0 auto;
}
.tts-sync-row.is-synced .tts-sync-status {
  color: var(--demo-success);
}
.tts-sync-note {
  margin: var(--spacing-md) 0 0;
  font-size: 0.85rem;
  color: var(--demo-muted);
}

/* Results (step 5) — recap tally + takeaway */
.tts-tally {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: var(--spacing-sm);
  margin-bottom: var(--spacing-md);
}
.tts-tally-item {
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
  padding: var(--spacing-md);
  background: var(--demo-surface-2);
  border: 1px solid var(--demo-border);
  border-radius: 0.5rem;
  text-align: center;
}
.tts-tally-item-hl {
  border-color: var(--demo-accent-bright);
}
.tts-tally-num {
  font-size: 1.3rem;
  font-weight: 700;
  color: var(--demo-text);
}
.tts-tally-item-hl .tts-tally-num {
  color: var(--demo-accent-bright);
}
.tts-tally-label {
  font-size: 0.75rem;
  color: var(--demo-muted);
}
.tts-takeaway {
  margin: 0;
  font-size: 0.9rem;
  line-height: 1.5;
  color: var(--demo-text);
  max-width: 65ch;
}

/* Responsive — collapse multi-column grids, prevent horizontal scroll */
@media (max-width: 640px) {
  .tts-fields {
    grid-template-columns: 1fr;
  }
  .tts-tools {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
  .tts-mappings {
    grid-template-columns: 1fr;
  }
  .tts-tally {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
  .tts-sync-row {
    flex-wrap: wrap;
  }
}
```

- [ ] **Step 2: Verify build**

Run: `npm run build`
Expected: PASS. (CSS is bundled but not yet imported; this confirms no syntax error breaks the build once imported in Task 5.)

- [ ] **Step 3: Surface the commit command**

```bash
git add src/demos/toolSync/sync.css
git commit -m "feat(tool-sync): add scoped tts-* stylesheet for tool-to-tool sync demo"
```

---

### Task 3: The two AI step components — `MapStep`, `ReconcileStep`

The two `isAi` steps that render the shared `AiPanel` then reveal their result.

**Files:**
- Create: `src/demos/toolSync/steps/MapStep.tsx`
- Create: `src/demos/toolSync/steps/ReconcileStep.tsx`

**Interfaces:**
- Consumes: `WorkflowProvider` (`./types`), provider methods `getMappings()`, `getReconciliation()`, `getAiReasoning("map" | "reconcile")`; shared `AiPanel` (`../../shared/AiPanel`) and `usePrefersReducedMotion` (`../../shared/usePrefersReducedMotion`); `tts-*` classes from Task 2.
- Produces: default-exported components `MapStep` and `ReconcileStep`, each a `({ provider }: { provider: WorkflowProvider }) => JSX.Element`, consumed by `ToolSyncDemo.tsx` in Task 5.

- [ ] **Step 1: Create `steps/MapStep.tsx`**

```tsx
import { useState } from "react";
import type { WorkflowProvider } from "../types";
import { usePrefersReducedMotion } from "../../shared/usePrefersReducedMotion";
import AiPanel from "../../shared/AiPanel";

const MapStep = ({ provider }: { provider: WorkflowProvider }) => {
  const mappings = provider.getMappings();
  const reasoning = provider.getAiReasoning("map");
  const reduced = usePrefersReducedMotion();
  const [revealed, setRevealed] = useState(reduced);

  return (
    <div className="tts-step">
      <h3 className="tts-heading">It shapes the one job for every tool</h3>
      <p className="tts-sub">
        Each app wants the same facts in a different shape. Claude reads the
        booking once and builds the right record for each — a draft invoice, a
        CRM deal, a calendar event, and a work order.
      </p>

      <AiPanel
        title={reasoning.title}
        lines={reasoning.lines}
        onComplete={() => setRevealed(true)}
      />

      <div className={"tts-reveal" + (revealed ? " is-shown" : "")}>
        <div className="tts-mappings">
          {mappings.map((m) => (
            <div key={m.toolName} className="tts-map-card">
              <div className="tts-map-head">
                <span className="tts-map-tool">{m.toolName}</span>
                <span className="tts-map-kind">{m.kind}</span>
              </div>
              <dl className="tts-map-fields">
                {m.fields.map((f) => (
                  <div key={f.label} className="tts-map-field">
                    <dt className="tts-map-label">{f.label}</dt>
                    <dd className="tts-map-value">{f.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MapStep;
```

- [ ] **Step 2: Create `steps/ReconcileStep.tsx`**

```tsx
import { useState } from "react";
import { FaExclamationTriangle, FaArrowRight } from "react-icons/fa";
import type { WorkflowProvider } from "../types";
import { usePrefersReducedMotion } from "../../shared/usePrefersReducedMotion";
import AiPanel from "../../shared/AiPanel";

const ReconcileStep = ({ provider }: { provider: WorkflowProvider }) => {
  const recon = provider.getReconciliation();
  const reasoning = provider.getAiReasoning("reconcile");
  const reduced = usePrefersReducedMotion();
  const [revealed, setRevealed] = useState(reduced);

  return (
    <div className="tts-step">
      <h3 className="tts-heading">
        It catches the duplicate before it's created
      </h3>
      <p className="tts-sub">
        Before writing anything, Claude checks each tool for a match. This "new"
        customer is actually an existing account under a shortened name — so the
        job merges onto the real record instead of spawning a second one.
      </p>

      <AiPanel
        title={reasoning.title}
        lines={reasoning.lines}
        onComplete={() => setRevealed(true)}
      />

      <div className={"tts-reveal" + (revealed ? " is-shown" : "")}>
        <div className="tts-recon">
          <div className="tts-dup-banner">
            <FaExclamationTriangle className="tts-dup-icon" aria-hidden="true" />
            <div className="tts-dup-meta">
              <span className="tts-dup-title">{recon.existingLabel}</span>
              <span className="tts-dup-reason">{recon.matchReason}</span>
            </div>
          </div>

          <div className="tts-conflicts">
            {recon.conflicts.map((c) => (
              <div key={c.field} className="tts-conflict">
                <span className="tts-conflict-field">{c.field}</span>
                <div className="tts-conflict-row">
                  <span className="tts-conflict-pair">
                    <span className="tts-conflict-tag">Booking</span>
                    <span className="tts-conflict-incoming">{c.incoming}</span>
                  </span>
                  <span className="tts-conflict-pair">
                    <span className="tts-conflict-tag">On file</span>
                    <span className="tts-conflict-existing">{c.existing}</span>
                  </span>
                </div>
                <div className="tts-conflict-res">
                  <FaArrowRight className="tts-conflict-arrow" aria-hidden="true" />
                  <span>{c.resolution}</span>
                </div>
              </div>
            ))}
          </div>

          <p className="tts-recon-note">{recon.note}</p>
        </div>
      </div>
    </div>
  );
};

export default ReconcileStep;
```

- [ ] **Step 3: Verify build**

Run: `npm run build`
Expected: PASS. (Components type-check against `WorkflowProvider`; not yet imported by the composition root.)

- [ ] **Step 4: Surface the commit command**

```bash
git add src/demos/toolSync/steps/MapStep.tsx src/demos/toolSync/steps/ReconcileStep.tsx
git commit -m "feat(tool-sync): add AI map + reconcile step components"
```

---

### Task 4: The three presentational step components — `Intake`, `Push`, `Results`

The non-AI steps: the intake job board (step 1), the timed-reveal sync board (step 4), and the results tally (step 5).

**Files:**
- Create: `src/demos/toolSync/steps/IntakeStep.tsx`
- Create: `src/demos/toolSync/steps/PushStep.tsx`
- Create: `src/demos/toolSync/steps/ResultsStep.tsx`

**Interfaces:**
- Consumes: `WorkflowProvider` (`./types`), provider methods `getBusiness()`, `getJob()`, `getTools()`, `getSyncResult()`, `getResults()`; shared `usePrefersReducedMotion` (`../../shared/usePrefersReducedMotion`); `tts-*` classes from Task 2. No step uses the send lifecycle.
- Produces: default-exported `IntakeStep`, `PushStep`, `ResultsStep`, each `({ provider }: { provider: WorkflowProvider }) => JSX.Element`.

- [ ] **Step 1: Create `steps/IntakeStep.tsx`**

```tsx
import { FaFileImport } from "react-icons/fa";
import type { WorkflowProvider } from "../types";

const IntakeStep = ({ provider }: { provider: WorkflowProvider }) => {
  const business = provider.getBusiness();
  const job = provider.getJob();
  const tools = provider.getTools();

  const fields = [
    { label: "Customer", value: job.customer },
    { label: "Address", value: job.address },
    { label: "Service", value: job.service },
    { label: "Price", value: job.price },
    { label: "Date", value: job.date },
    { label: "Phone", value: job.phone },
  ];

  return (
    <div className="tts-step">
      <h3 className="tts-heading">One job, four tools — and a lot of retyping</h3>
      <p className="tts-sub">
        A job just came into {business.name}'s booking tool. To actually run it,
        the same details have to land in four other apps — normally typed in by
        hand, four times over.
      </p>

      <div className="tts-intake">
        <div className="tts-intake-head">
          <FaFileImport className="tts-intake-icon" aria-hidden="true" />
          <span className="tts-intake-title">New booking</span>
          <span className="tts-intake-source">from the scheduling tool</span>
        </div>
        <dl className="tts-fields">
          {fields.map((f) => (
            <div key={f.label} className="tts-field">
              <dt className="tts-field-label">{f.label}</dt>
              <dd className="tts-field-value">{f.value}</dd>
            </div>
          ))}
        </dl>
      </div>

      <p className="tts-flow-label">Needs to reach</p>
      <div className="tts-tools">
        {tools.map((t) => (
          <div key={t.name} className="tts-tool-chip">
            <span className="tts-tool-name">{t.name}</span>
            <span className="tts-tool-kind">{t.kind}</span>
          </div>
        ))}
      </div>

      <p className="tts-note">
        Four apps, none of them talking — where double entry and duplicate
        customers creep in.
      </p>
    </div>
  );
};

export default IntakeStep;
```

- [ ] **Step 2: Create `steps/PushStep.tsx`**

```tsx
import { useEffect, useState } from "react";
import { FaSyncAlt, FaCheckCircle } from "react-icons/fa";
import type { WorkflowProvider } from "../types";
import { usePrefersReducedMotion } from "../../shared/usePrefersReducedMotion";

const SYNC_DELAY_MS = 600;

const PushStep = ({ provider }: { provider: WorkflowProvider }) => {
  const sync = provider.getSyncResult();
  const reduced = usePrefersReducedMotion();
  const total = sync.rows.length;
  const [synced, setSynced] = useState(reduced ? total : 0);

  useEffect(() => {
    if (reduced) {
      setSynced(total);
      return;
    }
    setSynced(0);
    const timers: number[] = [];
    for (let i = 1; i <= total; i++) {
      timers.push(window.setTimeout(() => setSynced(i), SYNC_DELAY_MS * i));
    }
    return () => timers.forEach((id) => window.clearTimeout(id));
  }, [reduced, total]);

  return (
    <div className="tts-step">
      <h3 className="tts-heading">It writes the record to all four tools</h3>
      <p className="tts-sub">
        With everything shaped and de-duplicated, the records go out to each app
        at once — no copy-paste, no tab-switching.
      </p>

      <div className="tts-sync">
        <div className="tts-sync-head">
          <FaSyncAlt aria-hidden="true" /> {sync.headline}
        </div>
        <div className="tts-sync-rows">
          {sync.rows.map((r, i) => {
            const isSynced = i < synced;
            return (
              <div
                key={r.toolName}
                className={"tts-sync-row" + (isSynced ? " is-synced" : "")}
              >
                <span className="tts-sync-tool">{r.toolName}</span>
                <span className="tts-sync-detail">{r.detail}</span>
                <span className="tts-sync-status">
                  {isSynced ? (
                    <>
                      <FaCheckCircle aria-hidden="true" /> Synced
                    </>
                  ) : (
                    "Writing…"
                  )}
                </span>
              </div>
            );
          })}
        </div>
        <p className="tts-sync-note">{sync.note}</p>
      </div>
    </div>
  );
};

export default PushStep;
```

- [ ] **Step 3: Create `steps/ResultsStep.tsx`**

```tsx
import type { WorkflowProvider } from "../types";

const ResultsStep = ({ provider }: { provider: WorkflowProvider }) => {
  const results = provider.getResults();
  const tally = [
    { num: String(results.toolsSynced), label: "Tools in sync" },
    { num: results.timeSaved, label: "Double-entry saved", hl: true },
    { num: results.fieldsMapped, label: "Fields mapped" },
    { num: results.duplicatesPrevented, label: "Duplicates prevented" },
  ];

  return (
    <div className="tts-step">
      <h3 className="tts-heading">One entry, four tools, zero retyping</h3>
      <p className="tts-sub">
        Every booking flows into accounting, CRM, calendar, and the crew app —
        correctly shaped for each, with duplicates caught before they land.
      </p>

      <div className="tts-tally">
        {tally.map((t) => (
          <div
            key={t.label}
            className={"tts-tally-item" + (t.hl ? " tts-tally-item-hl" : "")}
          >
            <span className="tts-tally-num">{t.num}</span>
            <span className="tts-tally-label">{t.label}</span>
          </div>
        ))}
      </div>

      <p className="tts-takeaway">{results.takeaway}</p>
    </div>
  );
};

export default ResultsStep;
```

- [ ] **Step 4: Verify build**

Run: `npm run build`
Expected: PASS.

- [ ] **Step 5: Surface the commit command**

```bash
git add src/demos/toolSync/steps/IntakeStep.tsx src/demos/toolSync/steps/PushStep.tsx src/demos/toolSync/steps/ResultsStep.tsx
git commit -m "feat(tool-sync): add intake, push, results step components"
```

---

### Task 5: Step registry + composition root — `steps.ts`, `ToolSyncDemo.tsx`

Wires the 5 step definitions and the composition root that assembles `DemoProvider → DemoShell`. After this task the demo is a complete, renderable component (route wiring is Task 6).

**Files:**
- Create: `src/demos/toolSync/steps.ts`
- Create: `src/demos/toolSync/ToolSyncDemo.tsx`

**Interfaces:**
- Consumes: `DemoStep` (`../shared/types`); `react-icons/fa` icons; `DemoProvider` (`../shared/DemoController`), `DemoShell` (default, `../shared/DemoShell`); `scriptedWorkflowProvider` (`./provider`); the five step components from Tasks 3–4; `./sync.css`.
- Produces: `steps: DemoStep[]` (ids `intake`, `map`, `reconcile`, `push`, `results`; `map`/`reconcile` have `isAi: true`) and default-exported `ToolSyncDemo` — the component Task 6 routes to. Note: **no `SendLifecycleProvider`** in the composition.

- [ ] **Step 1: Create `steps.ts`**

```ts
import {
  FaFileImport,
  FaSitemap,
  FaClone,
  FaSyncAlt,
  FaChartLine,
} from "react-icons/fa";
import type { DemoStep } from "../shared/types";

export const steps: DemoStep[] = [
  { id: "intake", label: "The job just landed", Icon: FaFileImport },
  { id: "map", label: "Shape it for each tool", Icon: FaSitemap, isAi: true },
  { id: "reconcile", label: "Catch the duplicate", Icon: FaClone, isAi: true },
  { id: "push", label: "Write to every tool", Icon: FaSyncAlt },
  { id: "results", label: "Results", Icon: FaChartLine },
];
```

- [ ] **Step 2: Create `ToolSyncDemo.tsx`**

```tsx
import type { ReactNode } from "react";
import { DemoProvider } from "../shared/DemoController";
import DemoShell from "../shared/DemoShell";
import { steps } from "./steps";
import { scriptedWorkflowProvider } from "./provider";
import IntakeStep from "./steps/IntakeStep";
import MapStep from "./steps/MapStep";
import ReconcileStep from "./steps/ReconcileStep";
import PushStep from "./steps/PushStep";
import ResultsStep from "./steps/ResultsStep";
import "./sync.css";

const provider = scriptedWorkflowProvider;

function renderStage(stepId: string): ReactNode {
  switch (stepId) {
    case "intake":
      return <IntakeStep provider={provider} />;
    case "map":
      return <MapStep provider={provider} />;
    case "reconcile":
      return <ReconcileStep provider={provider} />;
    case "push":
      return <PushStep provider={provider} />;
    case "results":
      return <ResultsStep provider={provider} />;
    default:
      return null;
  }
}

const ToolSyncDemo = () => {
  const business = provider.getBusiness();
  return (
    <DemoProvider steps={steps}>
      <DemoShell
        eyebrow="Paradigm Shift — Automation Demo"
        title={`Tool-to-tool sync for ${business.name}`}
        lede="A click-through of how one booking flows into every tool — shaped for each app and de-duplicated on the way — instead of being retyped four times."
        renderStage={renderStage}
      />
    </DemoProvider>
  );
};

export default ToolSyncDemo;
```

- [ ] **Step 3: Verify build**

Run: `npm run build`
Expected: PASS. (`DemoShell` is a default export; `DemoShellProps` includes `lede` even though the shell doesn't render it — matches the sibling demos, so no type error. No `SendLifecycleProvider` is needed because no step calls `useSendLifecycle`.)

- [ ] **Step 4: Surface the commit command**

```bash
git add src/demos/toolSync/steps.ts src/demos/toolSync/ToolSyncDemo.tsx
git commit -m "feat(tool-sync): compose tool-to-tool sync demo shell and step registry"
```

---

### Task 6: Wire the route + example card, verify end-to-end

The two one-line edits that make the demo reachable, then the full smoke + lint gate.

**Files:**
- Modify: `src/App.tsx` (import + `/demos/tool-sync` route, outside `Layout`)
- Modify: `src/components/AutomatedWorkflows.tsx` (add `to:` to the "Tool-to-Tool Sync" example)

**Interfaces:**
- Consumes: `ToolSyncDemo` (default, `./demos/toolSync/ToolSyncDemo`).
- Produces: reachable route `/demos/tool-sync`; the example card becomes a `<Link>` to it.

- [ ] **Step 1: Add the import to `src/App.tsx`**

After the existing `JobDispatchDemo` import, add:

```tsx
import ToolSyncDemo from "./demos/toolSync/ToolSyncDemo";
```

- [ ] **Step 2: Add the route to `src/App.tsx`**

Immediately after the dispatch route (`<Route path="/demos/dispatch" element={<JobDispatchDemo />} />`) and before the closing `</Routes>`, add:

```tsx
<Route path="/demos/tool-sync" element={<ToolSyncDemo />} />
```

- [ ] **Step 3: Add the `to:` field in `src/components/AutomatedWorkflows.tsx`**

In the `examples` array, change the "Tool-to-Tool Sync" entry (icon `FaSyncAlt`) from:

```tsx
  {
    icon: FaSyncAlt,
    title: "Tool-to-Tool Sync",
    description: "Stop retyping the same data twice",
  },
```

to:

```tsx
  {
    icon: FaSyncAlt,
    title: "Tool-to-Tool Sync",
    description: "Stop retyping the same data twice",
    to: "/demos/tool-sync",
  },
```

- [ ] **Step 4: Verify build**

Run: `npm run build`
Expected: PASS — tsc + Vite, zero errors, no unused imports.

- [ ] **Step 5: Dev smoke**

Run: `npm run dev`, open `http://localhost:5173/demos/tool-sync` (or whatever port Vite reports). Confirm:
- 5 steps advance via both the flow rail and Next/Back.
- Step 1 (`intake`): the raw booking card shows all 6 fields; the 4 tool chips (Ledgerbook, Pipeline, Calendar, CrewHQ) render; no horizontal scroll.
- Step 2 (`map`): `AiPanel` plays "working… → done", then the 4 mapping cards reveal, each with its shaped fields.
- Step 3 (`reconcile`): `AiPanel` plays, then the amber "duplicate caught" banner and the 2 conflict rows reveal (Name, Phone), each showing Booking vs On file and a green resolution.
- Step 4 (`push`): the 4 sync rows flip from "Writing…" to "Synced" one after another (~600 ms apart), each turning green.
- Step 5 (`results`): the 4-item tally renders (double-entry saved highlighted) plus the takeaway.
- Restart demo returns to step 1 and re-arms the timed sync reveal.
- Then verify `/services/automated-workflows`: the "Tool-to-Tool Sync" card is now a link and navigates to `/demos/tool-sync` (it was the last card without a link).
- Reduced-motion check (emulate in devtools or macOS Reduce motion): AI panels and the sync reveal all show final content instantly.

- [ ] **Step 6: Lint gate**

Run: `npm run lint`
Expected: PASS — zero warnings.

- [ ] **Step 7: Surface the commit command**

```bash
git add src/App.tsx src/components/AutomatedWorkflows.tsx
git commit -m "feat(tool-sync): wire /demos/tool-sync route and example card"
```

---

## Self-Review

**1. Spec coverage** — every spec section maps to a task:
- Step flow (5 steps, 2 AI, no send lifecycle) → `steps.ts` (Task 5) + step components (Tasks 3–4).
- `WorkflowProvider` interface + supporting types → `types.ts` (Task 1).
- Mock data content sketch → `script.ts` (Task 1) — every value copied verbatim, tool names consistent across `getTools`/`getMappings`/`getSyncResult`.
- Architecture (thin folder mirroring jobDispatch, no engine changes, no `SendLifecycleProvider`) → file structure + Global Constraints + Task 5.
- Styling (`tts-*`, amber `#f4b740` caution + green success, tokens, responsive) → `sync.css` (Task 2).
- Wiring (route + card `to:`) → Task 6.
- Verification (build, dev smoke, lint) → Task 6 steps 4–6.
- Out of scope (no engine changes, presentational push, standalone data, no trademarks) → Global Constraints + task boundaries.

**2. Placeholder scan** — no TBD/TODO; every code step contains complete, runnable content; no "similar to Task N" references (each file is written out in full).

**3. Type consistency** — method names match across tasks: `getBusiness`, `getJob`, `getTools`, `getMappings`, `getReconciliation`, `getSyncResult`, `getResults`, `getAiReasoning` are identical in `types.ts` (Task 1), `provider.ts` (Task 1), and every consuming component (Tasks 3–5). `AiStep = "map" | "reconcile"` matches the two `isAi` steps and both `getAiReasoning` calls. The reveal class `tts-reveal` / `.is-shown`, the sync-board `tts-sync-*` / `.is-synced` classes, the conflict `tts-conflict-*` classes, and the tally `tts-tally-*` classes are defined in Task 2 and referenced unchanged in Tasks 3–4. The four tool names (Ledgerbook, Pipeline, Calendar, CrewHQ) are identical across `getTools`, `getMappings`, and `getSyncResult().rows`. `PushStep`'s timed-reveal (timer cleanup, reduced-motion seed to `synced = total`) mirrors the verified `jobDispatch/steps/DispatchStep.tsx` pattern.
