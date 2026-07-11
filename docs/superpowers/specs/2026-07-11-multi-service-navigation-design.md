# Multi-Service Navigation Restructure — Design

**Date:** 2026-07-11
**Status:** Approved (design), pending implementation plan
**Scope:** Information architecture / routing refactor only. No copy rewrites, no new service content.

## Problem

The site currently has one content route (`/`) that is entirely dedicated to CTO/technical-consulting services, plus a demo route. Paradigm Shift is expanding beyond consulting into additional service offerings (first up: Automated Workflows). The single-purpose landing page can't represent a multi-service business, and there's no structure for adding services without rewriting the home page each time.

## Goals

- A generic, brand-level landing page at `/` that introduces Paradigm Shift and points visitors to specific services.
- Move the existing CTO-consulting content to its own service route.
- Establish a scalable `/services/<slug>` URL structure and shared navigation so new services drop in cleanly.
- Stand up an unlinked placeholder route for Automated Workflows so a direct URL doesn't 404, without publishing it yet.

## Non-Goals

- Writing Automated Workflows service content (separate future spec).
- Rewriting or restyling existing consulting copy/sections.
- Changing the commercial-cleaning demo.

## Routing

```
/                                  → LandingPage        (new, lightweight)
/services/technical-consulting     → TechnicalConsulting (existing Home sections, moved)
/services/automated-workflows      → AutomatedWorkflows  (thin placeholder, UNLINKED)
/demos/commercial-cleaning         → DemoPage            (unchanged)
```

React Router v6 nested routes. A layout route wraps all non-demo pages so they share a header and footer. The demo route stays **outside** the layout (it is a full-bleed, chrome-free experience).

```tsx
<Routes>
  <Route element={<Layout />}>
    <Route path="/" element={<LandingPage />} />
    <Route path="/services/technical-consulting" element={<TechnicalConsulting />} />
    <Route path="/services/automated-workflows" element={<AutomatedWorkflows />} />
  </Route>
  <Route path="/demos/commercial-cleaning" element={<DemoPage />} />
</Routes>
```

Netlify SPA fallback in `netlify.toml` already rewrites all paths to `index.html`, so the new client routes need no config change.

## Components & Structure

### `Layout.tsx`
Renders the persistent `Header`, an `<Outlet />` for the active page, and the shared `Footer`. This is the only place `Footer` is rendered for layout-wrapped pages.

### `Header.tsx` / `Header.css` (new)
Slim, sticky header following the existing vanilla-CSS + custom-properties conventions.
- Left: Paradigm Shift logo/wordmark, links to `/`.
- Right: service link(s) + booking CTA (Calendly).
- **Service links are driven by `services.ts` filtered to published services.** For now that is only **Technical Consulting**. Automated Workflows is excluded until its content ships.

### `services.ts` (new)
Single source of truth for service metadata so the nav, landing grid, and routes stay in sync:

```ts
export interface Service {
  slug: string;        // e.g. "technical-consulting"
  label: string;       // nav label, e.g. "Technical Consulting"
  summary: string;     // card blurb
  published: boolean;  // controls nav + landing-grid visibility
}
```

- `technical-consulting` → `published: true`
- `automated-workflows` → `published: false`

Nav and landing grid render only `published` services. The route table registers all services regardless of `published` (so the placeholder URL resolves).

### `LandingPage.tsx` / `LandingPage.css` (new)
Lightweight brand-level landing page:
- **Brand hero** — Paradigm Shift positioning spanning services (not CTO-specific), primary CTA to Calendly.
- **Services grid** — cards generated from published services in `services.ts`. Currently one card: Technical Consulting, linking to `/services/technical-consulting`. Automated Workflows is **omitted entirely** (not shown, not teased).
- CTA + Footer come from the layout.

### `TechnicalConsulting.tsx` (moved)
The current `Home.tsx` body becomes this page, essentially unchanged:
`Hero → WhoIsFor → Problem → Offer → HowItWorks → WhyWorkWithMe → CTA`
The trailing `<Footer />` is removed from the page body (now supplied by `Layout`). No copy changes.

### `AutomatedWorkflows.tsx` (new, placeholder)
Minimal branded placeholder so the URL resolves instead of 404-ing: a hero with the service name/tagline and a booking CTA. Unlinked from nav and grid. Real content is a later spec.

## Files

**New**
- `src/components/Layout.tsx`
- `src/components/Header.tsx`, `src/components/Header.css`
- `src/components/LandingPage.tsx`, `src/components/LandingPage.css`
- `src/components/TechnicalConsulting.tsx` (from `Home.tsx`)
- `src/components/AutomatedWorkflows.tsx`
- `src/data/services.ts`

**Changed**
- `src/App.tsx` — nested layout routes.
- Remove `<Footer />` from the moved consulting page body.

**Removed**
- `src/components/Home.tsx` (replaced by `TechnicalConsulting.tsx`).

**Unchanged**
- `netlify.toml` (SPA fallback already covers new routes).
- `src/demos/**`.

## Testing / Verification

Per project Definition of Done, before marking complete:
1. `npm run lint` — zero warnings.
2. `npm run build` — TypeScript check + production build passes.
3. Manual smoke: `/` renders landing + nav; nav "Technical Consulting" and the grid card both route to the consulting page; consulting page shows all sections once with a single shared footer; `/services/automated-workflows` renders the placeholder (reachable by URL, absent from nav/grid); `/demos/commercial-cleaning` still renders full-bleed with no header.

## Open Questions

None. Ready for implementation planning.
