# Weekly Owner Reports Demo — Design

**Date:** 2026-07-12
**Status:** Approved (brainstorming)
**Related:** [[demo-engine-architecture]], [[2026-07-12-invoice-payment-reminders-demo-design]], [[2026-07-12-automated-quoting-demo-design]], win-back / missed-call / review-generation / automated-quoting / invoice-reminders demos

## Goal

Build an interactive click-through demo for the **Weekly Owner Reports** automation, on the shared demo engine (`src/demos/shared/`), and link it from its example card on the Automated Workflows page. It becomes the seventh demo in the suite (after commercial-cleaning lead-gen, win-back, missed-call text-back, review generation, automated quoting, and invoice reminders).

## What makes this demo distinct

Every prior demo is a *send → reply* flow. Weekly Owner Reports is **data → AI narrative**: the AI reads a week of raw activity scattered across the owner's tools, computes what actually moved, and **writes a plain-English executive digest** — a headline, a few highlights, one watch-out, and one recommended action — that reads like a sharp ops manager wrote it. Watching a dense pile of numbers become a 30-second written report is the "wow": it's visibly judgment and synthesis, not a dashboard. The payoff is a **one-tap action** the owner takes straight off the digest, so the report drives a decision instead of just informing one.

## Persona & narrative

**Business:** *Evergreen Lawn & Landscape* — a lawn-care & landscaping outfit (owner + crews). Its weekly rhythm and seasonality make a weekly report natural. The owner runs the crews all week; the numbers pile up in five different apps and never get looked at.

**The moment:** It's Sunday evening. Instead of the owner logging into five dashboards (they won't), the AI compiles the week and texts a digest that takes 30 seconds to read.

## Step flow (6 steps)

Two steps are AI-powered (`isAi: true`) and render the shared `AiPanel`.

| # | id | label | Icon | isAi | Stage content |
|---|----|-------|------|------|---------------|
| 1 | `data` | The week's raw numbers | `FaDatabase` | — | The trigger: Sunday night, a pile of raw weekly activity scattered across tools (revenue, jobs, leads, quotes, reviews, missed calls, crew hours) — dense and unglamorous, the numbers no one has time to read. |
| 2 | `analyze` | Read the week | `FaBrain` | ✓ | AI pulls it all together, computes week-over-week deltas, and flags what matters. `AiPanel` reasoning, then a findings list reveals (metrics with good/watch trend badges). |
| 3 | `write` | Write the digest | `FaPenFancy` | ✓ | AI writes the report — headline, highlights, one watch-out, one recommended action. `AiPanel` reasoning, then the report card reveals. The hero beat. |
| 4 | `deliver` | Deliver to the owner | `FaPaperPlane` | — | The digest goes out Sunday evening as a text/email (send lifecycle → owner reads it in ~30 seconds). |
| 5 | `act` | One-tap action | `FaBolt` | — | The recommended action is presented as a tappable button; after a beat it "fires" and a confirmation reveals ("Done — follow-ups sent to all 3"). Presentational payoff. |
| 6 | `results` | Results | `FaChartLine` | — | Recap: reports delivered, avg read time (~30 sec vs "never looked"), one-tap actions taken off the reports, hours saved not digging through dashboards. |

The `deliver` step reuses the shared send lifecycle and ends at "read" (no reply). The `act` step is a self-contained timed reveal (no send lifecycle) — the "tap" is animated, the action is presentational.

## Architecture

New thin folder `src/demos/weeklyReports/`, mirroring `invoiceReminders/`:

- `steps.ts` — the 6 `DemoStep`s (icons from `react-icons/fa`).
- `types.ts` — a `WorkflowProvider` interface + the data types.
- `script.ts` — all mock data (business, raw data, findings, digest, delivery, action result, results, AI reasoning).
- `provider.ts` — `scriptedWorkflowProvider` implementing `WorkflowProvider`.
- `steps/` — 6 step components, each taking `{ provider }`.
- `reports.css` — scoped styles, `wr-*` class prefix, `--demo-*` / `--spacing-*` tokens.
- `WeeklyReportsDemo.tsx` — composes `DemoProvider steps → SendLifecycleProvider → DemoShell renderStage`.

Everything else (shell, vertical flow rail, AI panel, send lifecycle, reduced-motion) is reused unchanged from `src/demos/shared/`. **No engine changes.**

## WorkflowProvider interface

```ts
export type AiStep = "analyze" | "write";
export type Trend = "good" | "watch" | "flat";

getBusiness(): Business;              // name, service, context line
getRawData(): RawMetric[];           // the raw pile [{ source, label, value }]
getFindings(): Finding[];            // analyzed [{ label, value, delta, trend }]
getDigest(): Digest;                 // { headline, highlights[], watchOut, recommendedAction }
getDelivery(): Delivery;             // { recipientName, channel, sentLabel }
getActionResult(): ActionResult;     // { confirmation, detail } — the post-tap payoff
getResults(): ResultsSummary;        // reportsDelivered, avgReadTime, actionsTaken, hoursSaved, takeaway
getAiReasoning(step: AiStep): AiReasoning;
```

Supporting types:
- `RawMetric { source: string; label: string; value: string }`
- `Finding { label: string; value: string; delta: string; trend: Trend }`
- `RecommendedAction { summary: string; actionLabel: string }`
- `Digest { headline: string; highlights: string[]; watchOut: string; recommendedAction: RecommendedAction }`
- `Delivery { recipientName: string; channel: string; sentLabel: string }`
- `ActionResult { confirmation: string; detail: string }`
- `ResultsSummary { reportsDelivered: number; avgReadTime: string; actionsTaken: number; hoursSaved: string; takeaway: string }`
- `AiReasoning { step: AiStep; title: string; lines: string[] }`

## Mock data (script.ts) — content sketch

- **Business:** Evergreen Lawn & Landscape; service "Lawn care, landscaping & seasonal cleanups"; context "owner runs the crews all week — the numbers pile up in five different apps and never get looked at."
- **Raw data (the pile):** Jobs · "Jobs completed" · "38"; Revenue · "Revenue booked" · "$14,200"; Leads · "New leads" · "23"; Quotes · "Quotes sent" · "17"; Quotes · "Quotes still open" · "6"; Reviews · "New reviews" · "9"; Phone · "Missed calls" · "12"; Crew · "Crew hours" · "410".
- **Findings (analyzed, with deltas):**
  - Revenue · "$14,200" · "up 14% vs last week" · good
  - Jobs completed · "38" · "5 more than last week" · good
  - New leads · "23" · "up 8%" · good
  - New reviews · "9" · "3 more · 4.8★ avg" · good
  - Missed calls · "12" · "4 fewer — all auto-answered" · good
  - Open quotes aging · "3 of 6" · "cold >7 days — needs a nudge" · watch
- **Digest (the report):**
  - headline "Strong week — revenue up 14% and reviews climbing. One thing to fix: 3 quotes are going cold."
  - highlights: ["Revenue hit $14,200 — your best week this month, up 14%.", "38 jobs done and 9 fresh reviews (4.8★ avg) — the crews are firing.", "23 new leads in, and every missed call got answered automatically."]
  - watchOut "3 of your 6 open quotes haven't been touched in over a week — roughly $4k that could quietly walk."
  - recommendedAction { summary: "Send a friendly follow-up to the 3 cold quotes before they slip away.", actionLabel: "Nudge the 3 cold quotes" }
- **Delivery:** recipientName "Dana"; channel "Text + email"; sentLabel "Sunday 6:02 PM".
- **Action result:** confirmation "Done — follow-ups sent to all 3."; detail "Each got a warm, personalized nudge with a link to accept. Any replies land back in your inbox."
- **Results:** reportsDelivered 12; avgReadTime "32 sec"; actionsTaken 27; hoursSaved "~5 hrs/mo"; takeaway "Twelve Sunday-night digests, each read in about 30 seconds — 27 quick actions taken straight off them, and zero evenings lost to spreadsheets. The owner finally knows the numbers without chasing them."
- **AI reasoning:**
  - `analyze` (pull every tool's numbers into one place, compare against last week, note revenue/jobs/leads/reviews all up, flag the aging quotes, decide what's worth the owner's 30 seconds).
  - `write` (lead with the headline, back the wins with numbers, name the one risk and the dollars at stake, end with a single clear action, keep it a 30-second read in the owner's voice).

Values are illustrative and tunable during implementation without changing the interface.

## Styling

- Scoped `.demo` dark palette provides `--demo-*` tokens; use those plus `--spacing-*`.
- Class prefix `wr-*`. Reuse structural idioms from the prior demos: `*-heading`/`*-sub`, reveal wrappers (`opacity/translateY` + `.is-shown`), the send-lifecycle stage strip (step 4), and the results tally grid.
- New bespoke UI: the **raw-data panel** (a dense grid of source-tagged metric chips — deliberately unglamorous, "the pile"), the **findings list** (metric rows with a value + a good/watch trend badge, revealed after the AI panel), the **report card / digest** (headline, a check-bulleted highlights list, a distinct watch-out callout, and a recommended-action row — the hero), and the **action payoff** (the recommended-action button + a confirmation card that reveals after a beat). Keep them self-contained in `reports.css`.
- Trend badges: `good` uses the success token/green tint, `watch` uses the amber tint (`#f4b740`, as in sibling demos). Responsive: match the prior demos' media queries; the raw-data grid, findings rows, and report card must stay readable and not cause horizontal scroll at mobile widths.

## Wiring

- **Route:** add `<Route path="/demos/weekly-reports" element={<WeeklyReportsDemo />} />` in `App.tsx`, **outside** the `Layout` route, next to the other demo routes.
- **Example card:** set `to: "/demos/weekly-reports"` on the existing "Weekly Owner Reports" entry (`examples[7]`, `icon: FaChartLine`) in `AutomatedWorkflows.tsx`. The card auto-becomes a `<Link>`.

## Verification

No test framework exists. Per convention:
- `npm run build` (tsc + Vite) — no errors, no unused imports.
- `npm run dev` smoke at `/demos/weekly-reports`: 6 steps advance via rail + Next/Back; the raw-data panel shows the pile; both AI panels play then reveal (findings list, then report card); the deliver step animates the send lifecycle to "read"; the act step shows the recommended-action button then reveals the confirmation; results tally renders; reduced-motion path shows content instantly; no horizontal scroll at mobile widths; the example card on `/services/automated-workflows` links here.
- `npm run lint` (zero warnings) as the final gate.

## Out of scope

- No engine/shared changes. No real reporting/analytics integration (fully scripted). No pricing of PDS's own services on the demo. No changes to the other demos or the Automated Workflows page beyond the one `to` field. The recommended-action button and its confirmation are presentational only (no interactive editing, no real action fired). No cross-references to the other demos' data (standalone digest).

## Self-review

- Placeholder scan: no TBD/TODO; content values marked illustrative-and-tunable, interface fixed.
- Consistency: 6 steps map to the `WorkflowProvider` accessors; the two `isAi` steps match `AiStep = "analyze" | "write"`; `getFindings`/`getDigest` back the two reveal steps; `getDelivery` backs the send step; `getActionResult` backs the act step.
- Scope: single demo folder + two one-line wiring edits — fits one implementation plan.
- Ambiguity: the `deliver` step reuses the shared send lifecycle (ends at "read", no reply); the `act` step is a self-contained timed reveal (no send lifecycle), and the action is presentational.
