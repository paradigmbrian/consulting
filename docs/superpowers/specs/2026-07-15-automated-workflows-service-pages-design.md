# Automated Workflows — Per-Service Pages

**Date:** 2026-07-15
**Status:** Approved, ready for planning

## Problem

`/services/automated-workflows` lists 9 example automations as a grid of cards.
Each card is an icon, a title, and a one-line blurb, and clicking it drops the
visitor straight into a full-screen interactive demo. There is nothing between
"here is a name for a thing" and "here is a simulator of it running" — no case
for why the workflow matters, what it costs to not have it, or how it works.

The demo is also a dead end: it renders outside the site `Layout` with no header
or footer, so the only way back is the browser's back button.

## Goal

Give each of the 9 workflows a real page that makes the case for it, with the
demo as supporting evidence inside that page's narrative rather than as the
destination.

Reference: <https://www.levologylabs.com/speed-to-lead> — a single-offer sales
page whose arc is hook → quantified pain → "sound familiar?" → mechanism →
credibility → process → FAQ → pricing → CTA. We adopt the arc and drop the
pricing, keeping the site's existing Calendly-based conversion.

## Decisions

| Decision | Choice | Why |
|---|---|---|
| Page structure | Full Levology arc, **no pricing** | The site publishes no pricing anywhere and routes to Calendly. Publishing per-workflow prices is a different business decision, out of scope here. |
| Scope | All 9 workflows, one shared template | Partial rollout means some cards go to service pages and some to demos — an inconsistent grid. |
| Stats | Real, cited, researched | This is a live commercial site. No invented figures. Workflows without defensible research ship with no stats section. |
| Demo URL | Nested under the service route | `/services/automated-workflows/<slug>/demo` |
| Commercial-cleaning demo | Route retired, code retained | Owner confirmed the link is not being shared. See "Retired route" below. |

## Routing

Path nesting is independent of layout nesting in React Router, so the demo lives
under the service URL while still rendering full-bleed outside `Layout`:

```
/services/automated-workflows              → AutomatedWorkflows  (index, in Layout)
/services/automated-workflows/:slug        → WorkflowPage        (in Layout)
/services/automated-workflows/:slug/demo   → demo component      (outside Layout, full-bleed)
```

```tsx
<Route element={<Layout />}>
  <Route path="/services/automated-workflows" element={<AutomatedWorkflows />} />
  <Route path="/services/automated-workflows/:slug" element={<WorkflowPage />} />
</Route>
<Route path="/services/automated-workflows/:slug/demo" element={<WorkflowDemo />} />
```

An unknown `:slug` renders `<Navigate to="/services/automated-workflows" replace />`.
Netlify's SPA catch-all means an unmatched path would otherwise serve
`index.html` and render nothing — a blank page rather than a visible failure.

### Slugs

Demo slugs today do not match their card titles (`/demos/onboarding` for
"New-Customer Onboarding", `/demos/dispatch` for "Job Scheduling & Dispatch").
Unify on slugs derived from the card titles:

| Card | Slug | Old demo URL |
|---|---|---|
| Win-Back Campaigns | `win-back-campaigns` | `/demos/win-back-campaign` |
| Missed-Call Text-Back | `missed-call-text-back` | `/demos/missed-call-text-back` |
| Review Generation | `review-generation` | `/demos/review-generation` |
| Automated Quoting | `automated-quoting` | `/demos/automated-quoting` |
| Invoice & Payment Reminders | `invoice-reminders` | `/demos/invoice-reminders` |
| New-Customer Onboarding | `new-customer-onboarding` | `/demos/onboarding` |
| Job Scheduling & Dispatch | `job-dispatch` | `/demos/dispatch` |
| Weekly Owner Reports | `weekly-owner-reports` | `/demos/weekly-reports` |
| Tool-to-Tool Sync | `tool-sync` | `/demos/tool-sync` |

### Redirects

Nine `301`s in `netlify.toml`, one per old demo URL → its new
`/services/automated-workflows/<slug>/demo`.

**These must be declared above the existing SPA catch-all.** Netlify evaluates
redirect rules in file order and stops at the first match; the existing
`/*  →  /index.html  200` rule matches everything, so any rule below it is
unreachable.

### Retired route

`/demos/commercial-cleaning` is removed from `App.tsx`. Its code under
`src/demos/commercialCleaning/` stays in the repo, so restoring it is a
one-line change.

Context for the decision, recorded because the evidence pointed the other way:
nothing in the app links to that route (it is reachable only by someone being
sent the URL, which is what a prospecting demo is for), and it was refactored
onto the shared engine three days prior. The owner confirmed the link is not
being shared with anyone, which is knowledge not available from the codebase.
No redirect is added — the route simply ceases to exist.

## Data model

New `src/data/workflows.ts` — the single source of truth for both the index
cards and the pages:

```ts
export interface Stat {
  value: string;      // the figure, e.g. a percentage or dollar range
  label: string;      // what it measures, in plain language
  source: string;     // publication + year, shown on the page
  sourceUrl: string;  // required — no stat without a source
}
```

(No illustrative values are given here on purpose: every real `Stat` must come
from the research pass, and a plausible-looking example in a spec is the most
likely thing to get pasted into `workflows.ts` unverified.)

```ts

export interface Workflow {
  slug: string;
  label: string;
  icon: IconType;
  cardSummary: string;                                  // the grid card
  hero: { headline: string; subhead: string };
  stats: Stat[];                                        // empty ⇒ section omitted
  painPoints: string[];
  mechanism: { title: string; description: string }[];
  faq: { q: string; a: string }[];
  hasDemo: boolean;
  published: boolean;
}

export const workflows: Workflow[] = [ /* 9 entries */ ];
export const workflowPath = (slug: string) => `/services/automated-workflows/${slug}`;
export const workflowDemoPath = (slug: string) => `${workflowPath(slug)}/demo`;
```

`sourceUrl` is deliberately non-optional. A stat cannot exist in the data
without a place it came from, which makes the "no invented numbers" rule a
type error rather than a matter of discipline.

Existing `src/data/services.ts` is unchanged — it models the two top-level
service lines (`technical-consulting`, `automated-workflows`); this file models
the tier beneath one of them.

`src/demos/registry.ts` maps slug → lazily-imported demo component, so the demo
route resolves without pulling all nine demos into the main bundle.

## Page template

`src/components/workflows/WorkflowPage.tsx` reads the workflow by `:slug` and
renders:

| # | Section | Source |
|---|---|---|
| 1 | Hero — headline, subhead, Calendly CTA | per-service |
| 2 | The cost — cited stats | per-service, omitted when `stats` is empty |
| 3 | "Sound familiar?" — pain bullets | per-service |
| 4 | How it works — mechanism | per-service |
| 5 | See it run — demo CTA | per-service, rendered when `hasDemo` |
| 6 | Built by an engineer, not a reseller | **shared** |
| 7 | How we'd work together — discovery → build → handoff | **shared** |
| 8 | FAQ | per-service |
| 9 | Final CTA — Calendly | **shared** |

Sections 6, 7 and 9 are identical across all nine workflows, so they are
components rather than data — putting them in `workflows.ts` would mean nine
copies of the same paragraph drifting apart. They already exist on the index
page as `aw-how`, `aw-why` and `aw-cta`, so this extracts them for reuse rather
than writing anything new.

Each section stays a small, separately-readable component with the workflow (or
its relevant slice) as its only input.

## Changes to existing files

- **`AutomatedWorkflows.tsx`** — the hardcoded `examples[]` array is deleted;
  cards render from `workflows.ts` and link to `workflowPath(slug)`. Its
  `aw-how` / `aw-why` / `aw-cta` sections are replaced by the shared components
  extracted from them.
- **`DemoShell.tsx`** — gains a `backTo` prop rendering a back-link in the
  topbar, so a demo returns to its service page instead of dead-ending.
- **`App.tsx`** — routes as above; the ten individual demo imports collapse into
  the registry.
- **`netlify.toml`** — nine redirects above the catch-all.
- **`CLAUDE.md`** — the Content Reference path
  (`/Users/brian/Documents/dev-vault/PDS/Consulting/`) does not exist; the real
  path is `/Users/brian/Documents/dev-vault/projects/paradigm/Consulting/`.
  Also update the routing description and drop the commercial-cleaning route.

## Content

The nine pages are the bulk of the work; the plumbing above is comparatively
small.

**Stats research.** Each workflow gets researched independently for real,
citable figures. Missed-Call Text-Back, Review Generation and Invoice Reminders
have well-documented industry research (lead response-time studies, review
volume/conversion effects, days-sales-outstanding figures). Tool-to-Tool Sync
and Weekly Owner Reports likely have nothing defensible; those pages ship with
an empty `stats` array and no section. A workflow's stats section is cut, never
padded.

**Voice.** Copy is drafted to match the existing page: plainspoken and
anti-hype ("Real, robust engineering — not brittle no-code that breaks";
"Fixed scope, agreed up front — no surprise bills"). Drafts are a starting
point for the owner's edit, not final claims.

## Build order

1. Plumbing — data model, routes, registry, redirects, shared sections, `backTo`.
2. One workflow end-to-end: **Missed-Call Text-Back** (closest to the Levology
   speed-to-lead arc, and the best-researched).
3. Owner reviews that page.
4. Fan out to the remaining 8.

## Verification

The project has **no test runner** — no Vitest, Jest, or test files. "Done"
therefore means:

1. `npm run lint` — ESLint, zero warnings tolerated.
2. `npm run build` — `tsc` typecheck + Vite production build.
3. Manual browser verification: index cards navigate to service pages; each
   service page renders and its demo CTA reaches the demo; the demo's back-link
   returns; all 9 old `/demos/*` URLs redirect; an unknown slug redirects to the
   index.

Adding a test runner is out of scope for this work.

## Out of scope

- The root landing page (`/`). Raised, then explicitly deferred.
- Per-workflow pricing.
- Lead-capture forms — Levology's page has two; conversion stays on Calendly.
- Any change to the demos' internals beyond the `backTo` prop.
