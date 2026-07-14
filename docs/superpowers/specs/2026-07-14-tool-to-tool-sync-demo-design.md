# Tool-to-Tool Sync Demo — Design

**Date:** 2026-07-14
**Status:** Approved (brainstorming)
**Related:** [[demo-engine-architecture]], [[2026-07-13-job-scheduling-dispatch-demo-design]], [[2026-07-13-new-customer-onboarding-demo-design]], win-back / missed-call / review-generation / automated-quoting / invoice-reminders / weekly-reports / onboarding / job-dispatch demos

## Goal

Build an interactive click-through demo for the **Tool-to-Tool Sync** automation, on the shared demo engine (`src/demos/shared/`), and link it from its example card on the Automated Workflows page. It becomes the **tenth and final** demo in the suite — the last example card without a link.

## What makes this demo distinct

The prior demos are *send → reply*, *data → AI narrative*, *trigger → coordinated sequence*, or *AI assignment*. Tool-to-Tool Sync is the first **AI integration / reconciliation** demo, and the only **purely internal** one — no customer is ever messaged. One messy job entry becomes four correctly-shaped records across four different tools, with a **duplicate customer caught before it's created**. Two AI beats carry it: **map** (translate the one job into each tool's different schema) and **reconcile** (dedupe + merge + conflict-resolution). The wow is watching a single hand-entry fan out clean and de-duplicated across systems — judgment over integration glue — not writing. It closes on the internal payoff the card promises: stop retyping the same data twice, and keep the books clean.

## Persona & narrative

**Business:** *Guardian Pest Control* — residential pest control: quarterly service plans and one-off treatments. An owner-operator whose office juggles four disconnected tools.

**The moment:** A quarterly-plan job just got booked for "E. Vargas" at 512 Cypress Bend. Every booked job normally gets hand-retyped into accounting, the CRM, the calendar, and the crew app — ten minutes of double entry, and half-typed names quietly spawn duplicate customers. This one *looks* new, but it's actually **Elena Vargas**, an existing account that lapsed 14 months ago, entered under a shortened name and with a new phone number. The AI shapes the one job for each tool's schema and catches the duplicate before a second customer record is ever born — attaching the job to the real Elena Vargas and reactivating her plan.

## Step flow (5 steps)

Two steps are AI-powered (`isAi: true`) and render the shared `AiPanel`. There is **no** send-lifecycle step — the whole flow is internal system-to-system.

| # | id | label | Icon | isAi | Stage content |
|---|----|-------|------|------|---------------|
| 1 | `intake` | The job just landed | `FaFileImport` | — | The trigger: one raw job (customer, address, service, price, date, phone) as it arrived from the booking tool, plus the 4 destination tools shown as chips (name + kind). Dense and single-source — the entry that normally gets retyped into all four apps. |
| 2 | `map` | Shape it for each tool | `FaSitemap` | ✓ | AI translates the one job into each tool's schema — field names and formats differ per tool. `AiPanel` reasoning, then a per-tool reveal: four cards, each showing the shaped record (Ledgerbook → customer + draft invoice; Pipeline → contact + Won deal; Calendar → titled event + window + location; CrewHQ → work order + notes). |
| 3 | `reconcile` | Catch the duplicate | `FaClone` | ✓ | AI searches each tool for an existing match before writing, finds the lapsed account, merges onto it instead of creating a dupe, and resolves the phone conflict. `AiPanel` reasoning, then a reveal: a "duplicate caught" banner (amber) plus conflict rows showing incoming vs. existing vs. resolution. |
| 4 | `push` | Write to every tool | `FaSyncAlt` | — | A self-contained timed reveal shows the 4 tool rows flip from "Writing…" to "Synced" one after another (green). Presentational — mirrors the dispatch demo's crew-acceptance reveal. |
| 5 | `results` | Results | `FaChartLine` | — | Recap: tools synced, fields mapped, duplicates prevented, double-entry time saved, and the takeaway. |

The `push` step is a self-contained timed reveal (no send lifecycle) — the write-to-tools is presentational. No step reuses the shared send lifecycle.

## Architecture

New thin folder `src/demos/toolSync/`, mirroring `jobDispatch/`:

- `steps.ts` — the 5 `DemoStep`s (icons from `react-icons/fa`).
- `types.ts` — a `WorkflowProvider` interface + the data types.
- `script.ts` — all mock data (business, job, tools, mappings, reconciliation, sync result, results, AI reasoning).
- `provider.ts` — `scriptedWorkflowProvider` implementing `WorkflowProvider`.
- `steps/` — 5 step components, each taking `{ provider }`.
- `sync.css` — scoped styles, `tts-*` class prefix, `--demo-*` / `--spacing-*` tokens.
- `ToolSyncDemo.tsx` — composes `DemoProvider steps → DemoShell renderStage`. **No `SendLifecycleProvider`** — no step uses the send lifecycle, so it is omitted (YAGNI).

Everything else (shell, vertical flow rail, AI panel, reduced-motion) is reused unchanged from `src/demos/shared/`. **No engine changes.**

## WorkflowProvider interface

```ts
export type AiStep = "map" | "reconcile";

getBusiness(): Business;              // name, service, context line
getJob(): SourceJob;                 // the one raw entry
getTools(): ToolTarget[];            // the 4 destination tools
getMappings(): ToolMapping[];        // per-tool shaped record
getReconciliation(): Reconciliation; // duplicate + conflicts
getSyncResult(): SyncSummary;        // timed reveal (write-to-tools)
getResults(): ResultsSummary;        // recap tally
getAiReasoning(step: AiStep): AiReasoning;
```

Supporting types:
- `Business { name: string; service: string; context: string }`
- `SourceJob { customer: string; address: string; service: string; price: string; date: string; phone: string }`
- `ToolTarget { name: string; kind: string }`
- `MappedField { label: string; value: string }`
- `ToolMapping { toolName: string; kind: string; fields: MappedField[] }`
- `Conflict { field: string; incoming: string; existing: string; resolution: string }`
- `Reconciliation { duplicateFound: boolean; existingLabel: string; matchReason: string; conflicts: Conflict[]; note: string }`
- `SyncRow { toolName: string; detail: string }`
- `SyncSummary { headline: string; rows: SyncRow[]; note: string }`
- `ResultsSummary { toolsSynced: number; fieldsMapped: string; duplicatesPrevented: string; timeSaved: string; takeaway: string }`
- `AiReasoning { step: AiStep; title: string; lines: string[] }`

Note: `toolName` in `ToolMapping` and `SyncRow` refers back to a `ToolTarget.name`; the tool names are illustrative and tunable, but the four `getMappings()` / `getSyncResult().rows` entries must use the same four names as `getTools()`.

## Mock data (script.ts) — content sketch

- **Business:** Guardian Pest Control; service "Residential pest control — quarterly plans & one-off treatments"; context "every booked job used to get retyped into four apps by hand — ten minutes of double entry per job, and half-typed names quietly spawned duplicate customers."
- **Job (the raw entry):**
  - customer "E. Vargas" · address "512 Cypress Bend" · service "Quarterly pest plan — initial visit" · price "$149" · date "Thu, Jul 17 · 9–11 AM" · phone "(512) 555-0148"
- **Tools (4 destinations):** brand-neutral invented names (no real trademarks):
  - Ledgerbook · "Accounting & invoicing"
  - Pipeline · "CRM — contacts & deals"
  - Calendar · "Scheduling"
  - CrewHQ · "Field app — work orders"
- **Mappings (map reveal — the same job shaped per tool):**
  - Ledgerbook: Customer "Elena Vargas" · Billing address "512 Cypress Bend" · Item "Quarterly pest plan – initial" · Amount "$149.00" · Invoice "Draft #1043"
  - Pipeline: Contact "Elena Vargas" · Stage "Won" · Deal "Quarterly plan" · Value "$149" · Source "Online booking"
  - Calendar: Title "Guardian — initial pest visit (Vargas)" · When "Thu Jul 17 · 9:00–11:00 AM" · Location "512 Cypress Bend" · Route "Route 3"
  - CrewHQ: Work order "Quarterly initial — Vargas" · Address "512 Cypress Bend" · Window "9–11 AM" · Notes "Gate code at booking; dog on site"
- **Reconciliation (reconcile reveal):**
  - duplicateFound: true
  - existingLabel: "Existing account: Elena Vargas — last serviced 14 mo ago (lapsed)"
  - matchReason: "Same address and phone as the booking; it came in as 'E. Vargas,' which looked like a brand-new customer."
  - conflicts:
    - { field "Name", incoming "E. Vargas", existing "Elena Vargas", resolution "Merged onto the existing full-name record." }
    - { field "Phone", incoming "(512) 555-0148", existing "(512) 555-0132", resolution "Updated to the new number; kept the old on file as history." }
  - note: "Instead of a second 'E. Vargas' customer, the job attached to the real Elena Vargas — and reactivated her lapsed quarterly plan."
- **Sync result (timed reveal):** headline "Written to all 4 tools"; rows:
  - Ledgerbook · "Customer matched · draft invoice #1043"
  - Pipeline · "Deal marked Won on the existing contact"
  - Calendar · "Visit booked Thu 9–11 AM"
  - CrewHQ · "Work order created for Route 3"
  - note "One entry became four correct records — no duplicate, no retyping."
- **Results:** toolsSynced 4; fieldsMapped "18"; duplicatesPrevented "1 (this job)"; timeSaved "~9 min/job"; takeaway "One booking flowed into accounting, CRM, calendar, and the crew app — correctly shaped for each, with a duplicate customer caught before it doubled up. The office stops retyping, the books stay clean, and nothing falls through the gap between tools."
- **AI reasoning:**
  - `map` (title "Claude — shaping the job for each tool"): read the one booking; translate its fields into each tool's schema; build a draft invoice, a CRM deal, a calendar event, and a work order; format the phone, price, and date the way each tool expects.
  - `reconcile` (title "Claude — checking for duplicates"): before writing anything, search each tool for an existing match; match on address and phone even though the name came in abbreviated; merge onto the real customer instead of creating a duplicate; resolve the phone conflict while keeping history; reactivate the lapsed plan.

Values are illustrative and tunable during implementation without changing the interface.

## Styling

- Scoped `.demo` dark palette provides `--demo-*` tokens; use those plus `--spacing-*`.
- Class prefix `tts-*`. Reuse structural idioms from the prior demos: `*-heading`/`*-sub`, reveal wrappers (`opacity/translateY` + `.is-shown`), the timed-reveal board (dispatch's crew rows flipping state), and the results tally grid.
- New bespoke UI: the **intake card** (the raw job) plus a row of **tool-destination chips** (name + kind); the **mapping view** (per-tool cards, each listing the shaped `label: value` fields); the **reconcile view** (a "duplicate caught" banner and conflict rows showing incoming vs. existing vs. resolution); the **sync board** (tool rows that flip from "Writing…" to "Synced" after a beat — timed reveal).
- Attention accent: the "duplicate caught / conflict" state uses the established sibling **amber** (`#f4b740`, matching the prior demos' caution pattern) — a caution, not an emergency, so amber rather than the dispatch red. Green `--demo-success` for the "Synced" state, matched records, and on the results.
- Responsive: match the prior demos' media queries; the tool chips, mapping cards, conflict rows, sync board, and tally must stay readable and not cause horizontal scroll at mobile widths.

## Wiring

- **Route:** add `<Route path="/demos/tool-sync" element={<ToolSyncDemo />} />` in `App.tsx`, **outside** the `Layout` route, next to the other demo routes.
- **Example card:** set `to: "/demos/tool-sync"` on the existing "Tool-to-Tool Sync" entry (`icon: FaSyncAlt`) in `AutomatedWorkflows.tsx`. The card auto-becomes a `<Link>`. This is the last example card without a link — wiring it completes the grid.

## Verification

No test framework exists. Per convention:
- `npm run build` (tsc + Vite) — no errors, no unused imports.
- `npm run dev` smoke at `/demos/tool-sync`: 5 steps advance via rail + Next/Back; the intake step shows the raw job plus the 4 tool chips; both AI panels play then reveal (the mapping cards, then the reconcile banner + conflict rows); the push step shows the 4 tool rows flipping to "Synced" after a beat; results tally renders; reduced-motion path shows content instantly; no horizontal scroll at mobile widths; the example card on `/services/automated-workflows` links here.
- `npm run lint` (zero warnings) as the final gate.

## Out of scope

- No engine/shared changes. No real integrations, OAuth, or API calls to any tool (fully scripted). No send lifecycle (the demo is purely internal; `SendLifecycleProvider` is omitted). No pricing of PDS's own services on the demo. No changes to the other demos or the Automated Workflows page beyond the one `to` field. The mapping, reconciliation, and sync are presentational only (no interactive editing, no real records written). No cross-references to the other demos' data (standalone sync). Real product/tool trademarks are avoided — the four tool names are invented and brand-neutral.

## Self-review

- Placeholder scan: no TBD/TODO; content values marked illustrative-and-tunable, interface fixed.
- Consistency: 5 steps map to the `WorkflowProvider` accessors; the two `isAi` steps match `AiStep = "map" | "reconcile"`; `getMappings` backs the map reveal; `getReconciliation` backs the reconcile reveal; `getSyncResult` backs the timed-reveal push step; `getResults` backs the tally. `getMappings()` and `getSyncResult().rows` use the same four tool names as `getTools()`.
- Scope: single demo folder + two one-line wiring edits — fits one implementation plan.
- Ambiguity: the `push` step is a self-contained timed reveal (no send lifecycle); there is no customer-facing step; the duplicate-caught/conflict state is presentational and uses amber, the Synced/matched state uses green.
