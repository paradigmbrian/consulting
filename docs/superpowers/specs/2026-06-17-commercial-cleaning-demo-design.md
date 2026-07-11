# Commercial-Cleaning Prospecting Demo — Design Spec

**Date:** 2026-06-17
**Project:** `paradigm/consulting-website`
**Status:** Draft for review
**Author:** Brian (with Claude)

## 1. Purpose

Build an interactive, **fully-scripted** product-tour that showcases an outbound lead-generation
workflow, framed for a sample commercial-cleaning company. It lives as a new route on the existing
Paradigm Shift website and serves two goals:

- **(a) Showcase** — give a prospect a click-through demonstration of how the workflow finds,
  qualifies, personalizes, and reaches out to leads, end to end, including a *mocked* send/reply.
- **(b) Sales engine (later)** — the same workflow, once real (phase 2), is used to prospect local
  small businesses to sell this product. The demo is the pitch; running it for real is the proof.

This spec covers **only the scripted demo** (goal a). The real engine (goal b) is a separate spec.

## 2. Goals & non-goals

**Goals**
- A self-contained, reliable, instant demo a prospect can click through with zero backend.
- Conveys the *value and selectivity* of the workflow (it targets and filters, it doesn't spray).
- Matches the existing site's stack, conventions, and visual language.
- Structured so the scripted stages can later be swapped for real implementations without a UI rewrite.

**Non-goals (explicitly out of scope — deferred to later specs)**
- Real lead discovery (Google Places), real enrichment, real Claude personalization.
- Real email sending, deliverability, reply parsing, tracking.
- Visitor-supplied input (city/industry) — first version is a fixed walkthrough.
- Operator/admin UI, multi-tenancy, CRM integration.
- The inbound-prospecting demo and the broader consulting-vs-workflows site restructure.

## 3. Audience & framing

- **Demo viewer:** a local small-business owner (initially commercial-cleaning operators and
  adjacent local B2B services) evaluating whether this lead-gen workflow is worth buying.
- **Sample company in the demo:** a fictional commercial-cleaning business (working name
  *"Summit Commercial Cleaning"*) whose ideal customers are local facilities needing recurring
  cleaning (offices, clinics, gyms, daycares, retail).

## 4. Scope of the MVP

A single new route, `/demos/commercial-cleaning`, presenting a 6-step guided walkthrough driven
entirely by pre-authored data. The mocked send simulates the email lifecycle with timed state
transitions. No network calls.

## 5. Architecture

**Type:** Client-side React SPA addition to the existing Vite site. No backend.

**Routing**
- Introduce `react-router-dom` (v6) — the site currently has none.
- Routes:
  - `/` → existing landing page (current `App` content, refactored into a `Home`/`Landing` route).
  - `/demos/commercial-cleaning` → the demo page.
- Namespaced under `/demos/` so future demos (inbound, other verticals) slot in cleanly.
- Add a Netlify SPA fallback so deep links resolve:
  ```toml
  [[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
  ```

**Demo as a state machine**
- The walkthrough is a step state machine: `DefineTarget → Discover → EnrichQualify → Personalize → Send → Results`.
- A `DemoController` (hook/context) holds current step + the mocked send sub-state and exposes
  `next() / back() / reset()`.
- The mocked send is a timed sub-state machine: `Idle → Sending → Delivered → Opened → Replied`,
  advanced with `setTimeout` and rendered via CSS transitions (no animation library).

**Phase-2 seam (designed now, not built now)**
- All stage data is read through a `WorkflowProvider` interface:
  ```ts
  interface WorkflowProvider {
    getICP(): Icp;
    getTargets(): Prospect[];          // discovery
    getEnrichment(id): Enrichment;     // enrich & qualify
    getEmail(prospectId): DraftEmail;  // personalize
    send(email): Promise<SendResult>;  // mocked now
    getReply(prospectId): Reply;
  }
  ```
- MVP ships a `ScriptedWorkflowProvider` backed by the content module (§7). Phase 2 adds a
  `LiveWorkflowProvider`; the UI/state machine are unchanged.

## 6. Demo flow (the six steps)

1. **Define target** — display Summit's ICP: facility types + radius. Read-only; sets the scene.
2. **Discover** — animated reveal of matched local businesses; a callout explains the match/buy-signal
   logic (e.g., "physical facility, no in-house janitorial, within service area").
3. **Enrich & qualify** — contact + facility details fill in per prospect; 2–3 prospects visibly
   **drop off with stated reasons** (residential-only, competitor, no decision-maker found) to show
   the workflow is selective.
4. **Personalize** — focus on one qualified prospect; a tailored cold email "writes in," referencing
   specifics about them. Show subject + body + CAN-SPAM-style footer.
5. **Send (mocked)** — `Sending → Delivered → Opened` lifecycle animation in a faux outbox/inbox UI.
6. **Reply & results** — a simulated positive reply lands in a faux inbox; a results panel tallies
   sent / opened / replied and frames the takeaway ("this is what we'd do for your business").

**Navigation:** guided **Back / Next** with a step progress indicator. Optional auto-advance on the
send lifecycle. A "Restart demo" control returns to step 1. A persistent CTA (Calendly link, matching
the site's existing CTA) is visible throughout.

## 7. Content model (the script)

The persuasive substance is the authored data, kept in a typed module (e.g.,
`src/demos/commercialCleaning/script.ts`) so it is easy to edit and later swap:

- **1 sample company** (Summit Commercial Cleaning) — name, services, service area, ICP.
- **~8–10 sample prospects** — mix of qualified and dropped; each with name, facility type, address,
  website, contact, and (for dropped) a drop reason.
- **2–3 fully-written personalized emails** — subject, body, footer; specific to the chosen prospects.
- **1 reply** — a realistic positive response.

Copy authoring is Brian's (or reviewed by Brian) — it is the demo's credibility. Spec ships the
structure + placeholder copy; final copy is a content task.

## 8. Styling & conventions

- Vanilla CSS with custom properties; paired `.tsx` + `.css` per component (matches existing repo).
- Reuse the existing design tokens/variables from `index.css`; the demo should feel native to the site.
- Components live under `src/demos/commercialCleaning/` (page, step components, shared demo UI) plus a
  thin routing change in `main.tsx`/`App.tsx`.
- react-icons for any iconography (already a dependency).
- Mobile-responsive per existing breakpoints (768px / 968px).

## 9. Error handling & edge cases

Minimal, since the demo is scripted and offline:
- No network/data-fetch failure paths (data is bundled).
- Guard step navigation bounds (no next past last, no back before first).
- Mocked-send timers are cleared on unmount / restart to avoid stray transitions.
- Respect `prefers-reduced-motion` — collapse animations to instant state changes.

## 10. Testing & definition of done

The repo has no test framework today. Gate for this work:
- `npm run lint` — zero warnings (repo standard).
- `npm run build` — TypeScript check + Vite build green.
- Manual walkthrough of all six steps, including restart and the mocked send lifecycle, on desktop
  and mobile widths.
- Optional (not required this phase): add Vitest + React Testing Library for the `DemoController`
  state machine and step rendering.

## 11. Affected / new files (sketch)

- `package.json` — add `react-router-dom`.
- `src/main.tsx` — wrap in `BrowserRouter`.
- `src/App.tsx` — refactor existing sections into a `Home` route; add `/demos/commercial-cleaning`.
- `src/demos/commercialCleaning/` — `DemoPage.tsx` + steps + `script.ts` + `WorkflowProvider` +
  paired CSS.
- `netlify.toml` — SPA redirect.
- `CLAUDE.md` — update the "no routing" note to reflect React Router.

## 12. Roadmap (context — not built here)

1. **This spec:** fully-scripted commercial-cleaning demo.
2. **Next:** real outbound prospecting engine spec (discovery, enrichment, Claude personalization,
   sending/tracking) — swaps `ScriptedWorkflowProvider` for `LiveWorkflowProvider`.
3. **Later:** inbound-prospecting demo; multi-vertical + operator/admin; consulting-vs-workflows
   site restructure.

## 13. Next step — specing & implementing the real workflow (added 2026-06-17)

The scripted demo (this spec) is **built and live in the working tree**: route `/demos/commercial-cleaning`,
six steps, mocked send/reply, all driven by `ScriptedWorkflowProvider`. The phase-2 seam landed as designed —
the UI reads **only** through the `WorkflowProvider` interface (`src/demos/commercialCleaning/types.ts`), so the
real engine is a drop-in implementation, not a UI rewrite.

**Goal (b) — the real engine — is its own spec.** Before writing code, write that spec. Key things the scripted
version deferred that the real spec must resolve:

- **The interface is the contract.** A `LiveWorkflowProvider` implements the same methods the UI already calls:
  `getCompany`, `getICP`, `getTargets`, `getEnrichment`, `getEmail`, `send`, `getReply`, `getResults`,
  `getFeaturedProspectId`. Decide which become async — `getTargets`/`getEnrichment`/`getEmail` are synchronous in
  the script but become network calls live, so the interface (and the step components consuming it) will need a
  loading/error story the scripted version doesn't have. `send` is already typed `Promise<SendResult>`, so the
  send step's seam is the cleanest.
- **Discovery:** Google Places (or equivalent) — query construction from the ICP, radius filtering, buy-signal
  inference, dedup, quotas/cost.
- **Enrich & qualify:** contact/decision-maker lookup, facility data, and the qualify/drop logic that the demo
  hardcodes as `dropReason`s — now a real ruleset.
- **Personalize:** Claude generates the cold email from real enrichment data. Prompt design, guardrails, and
  human-review-before-send all need specs (see latest Claude models / `claude-api` guidance at implementation time).
- **Send & track:** real delivery, deliverability, reply parsing, open/click tracking, and **CAN-SPAM compliance
  for actual outbound** (the demo's footer is cosmetic; real sends are regulated).
- **Backend + secrets + rate limits:** the demo is zero-backend; the real engine is not. Stack defaults: Fastify +
  Postgres + AWS.

**Validation loop:** the same engine that powers the demo is the engine we run to prospect for real (goal b) —
so phase 2 is both the product and our own sales channel. Spec it as a standalone document, then implement
behind the existing interface so the demo and the live tool stay one codebase.
