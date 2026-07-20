# Homepage Hub Design

**Date:** 2026-07-19
**Status:** Approved (design) — implementation plan to follow
**Author:** Brian Flannery / Paradigm Shift Software Development

## Purpose

Unify the three service lines — **AI Automations**, **AI Integration**, and
**Technical Consulting** — under a single homepage that self-sorts visitors and routes
each to the right service page. The homepage's primary job is **buyer-led routing**:
quickly orient a visitor and send them to the service that fits, while establishing
enough solo-operator credibility to convert.

## Current state (what changes)

- `/` currently renders `AutomatedWorkflows.tsx` — a complete, polished automations
  funnel (hero + montage, trust strip, "where it fits," 9 use-case cards, live-demo
  proof, how-it-works, why-work-with-me, FAQ, final CTA). It targets small trades
  businesses only.
- `/services/automated-workflows` is currently a `<Navigate to="/" replace />` redirect.
- `/services/technical-consulting` (`TechnicalConsulting.tsx`) and
  `/services/ai-integration` (`AiIntegration.tsx`) already exist as service pages.
- Header nav is hardcoded to `#use-cases` / `#how-it-works` hash anchors that live on
  the automations content currently at `/`.

## Design decisions (locked)

1. **Organizing principle:** buyer-led — the homepage sorts visitors by who they are and
   routes them. Minimal shared narrative; fast routing.
2. **Hierarchy:** AI-forward, consulting present — the two AI services get visual primacy;
   Technical Consulting is a clear third.
3. **Top-of-page layout:** "Balanced trio, AI-weighted" (Layout A) — one row of three
   cards; the two AI cards are larger/accented, consulting sits beside them, quieter.
4. **Page depth:** "Router + credibility" — the hub routes *and* vouches for the operator
   before the CTA, without duplicating any service page's detail.
5. **Automations content:** relocate wholesale to its own service page. Nothing is
   rewritten; it moves down a level.

## Route changes

- New `Home` component renders at `/`.
- `/services/automated-workflows` stops redirecting and renders the existing
  `AutomatedWorkflows` component **unchanged** (it becomes the Automations service page).
  Its `#use-cases` / `#how-it-works` anchors travel with it.
- Result: three peer service pages — `/services/automated-workflows`,
  `/services/ai-integration`, `/services/technical-consulting` — plus the hub at `/`.
- No change to `/services/automated-workflows/:slug` (workflow detail pages) or
  `/services/automated-workflows/:slug/demo` (demos).

## Hub page structure (top to bottom)

1. **Hero** — unifying value line + primary Book-a-call CTA.
2. **Buyer sorter** (Layout A) — three service cards; the two AI cards accented, consulting
   third.
3. **Credibility band** — reuse `AwWhyWorkWithMe`, which renders "Why work with me" plus the
   four credibility items (10+ years · real AI not no-code · built on your tools · fixed
   scope). *This IS the trust content* — a separate one-line "trust strip" is intentionally
   omitted because it would duplicate these same four items.
4. **How I work** — shared 3-step process. Reuse `AwHowItWorks` with `title="How I work"`.
5. **Final CTA** — reuse `AwFinalCta`.

Sections 3–5 are existing shared components, so the hub is largely assembly plus a new
hero and sorter. Styling uses the current light-theme system
(`shared-sections.css` `wf-eyebrow`, theme CSS variables, `container`/`section-*`
utilities), matching the rest of the site.

## Copy

**Hero**
- eyebrow: *Senior software expertise*
- title: *Real engineering, three ways to put it to work*
- subtitle: *AI automations, AI built into your product, and technical guidance for
  founders — from a senior engineer with 10+ years shipping production software.
  Which are you?*
- CTA: *Book a call* (→ `CALENDLY_URL`)

**Buyer-sorter cards** (each: for-whom → outcome → link)

| Card | For | Line | Links to |
|---|---|---|---|
| **AI Automations** *(accent)* | Small-business owners | Put AI to work on the busywork — missed calls, quotes, invoices, reviews — on the tools you already use. | `/services/automated-workflows` |
| **AI Integration** *(accent)* | Startups & product teams | Embed AI into the product you already have — starting with a fixed-fee roadmap, not a rebuild. | `/services/ai-integration` |
| **Technical Consulting** | Non-technical founders | Technical clarity before you build or hire — fixed-scope audits and MVP blueprints. | `/services/technical-consulting` |

**Trust strip:** *10+ years a professional software engineer · Real AI, not brittle
no-code · Built on the tools you already use · Fixed scope, agreed up front.*

## Navigation & footer

- **Header nav** changes from the broken hash anchors to the three service links plus
  Book a call. Short labels: *Automations · AI Integration · Consulting* + *Book a call*.
- **Footer** gains the third service link (Automations); it already links Technical
  consulting and AI integration. The footer's `/#use-cases` / `/#how-it-works` anchors
  are updated to point at the automations service page (or removed) since that content
  no longer lives on `/`.

## Out of scope (YAGNI)

- Rewriting or re-theming any existing service page (automations content moves as-is).
- Duplicating service-specific content (use-case cards, demos, service FAQs) onto the hub.
- A services dropdown / mega-nav — flat links are enough for three services.
- Any change to the demo routes or workflow detail pages.

## Open follow-ups (not blocking)

- Whether the hero eyebrow/title copy survives a later polish pass (locked for now).
- Whether to eventually add a lightweight hub visual (the `HeroMontage` is reserved for
  the automations page; the hub hero is text-first for now).
