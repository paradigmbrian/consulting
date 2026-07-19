# AI-Services Homepage Restructure — Design

**Date:** 2026-07-19
**Scope:** site-wide information architecture + a new homepage. Repositions the
business around **AI services for small business** as the primary offering, with
Technical Consulting demoted to a referral-only page.

## Strategic context (from the owner)

- **Automation / AI for small businesses is now the priority and focus** — the
  whole front door.
- **Technical Consulting is a niche, word-of-mouth / referral offering** — no ad
  or marketing spend; referrals are sent directly to its existing page. It leaves
  the main nav but its page stays live.
- Lead with **AI**. Brand the offering **"AI Services for Small Business."**
- **Proof** leans on the 9 live interactive demos + the owner's credentials — no
  client testimonials yet.

## Decisions (locked in brainstorming)

1. **Merge to one front door.** `/` becomes the AI-services homepage; the separate
   automation index (`/services/automated-workflows`) redirects to `/`.
2. **Naming:** "AI Services for Small Business" (nav label "AI Services"; AI-forward
   headings).
3. **Consulting:** out of main nav; lives in the footer + its own URL for referrals.
4. **Proof:** the live demos ("see it actually work") + credentials, not
   testimonials.

## Information architecture / routing

| Route | Before | After |
|---|---|---|
| `/` | thin dual-service landing (`LandingPage`) | **the AI-services homepage** (repurposed automation index content) |
| `/services/automated-workflows` | automation index (`AutomatedWorkflows`) | **301 → `/`** (netlify.toml, above the SPA catch-all) + in-app `<Navigate to="/" replace />` |
| `/services/automated-workflows/:slug` | workflow detail | unchanged |
| `/services/automated-workflows/:slug/demo` | full-bleed demo | unchanged |
| `/services/technical-consulting` | consulting page | unchanged (referral page) |

- The `LandingPage` dual-service component is retired from routing (kept in the repo
  or deleted — the plan deletes it to avoid dead code, since its content is
  superseded).
- `WorkflowPage`'s invalid-slug fallback (`<Navigate to="/services/automated-workflows" …>`)
  updates to `/` so it doesn't bounce through the redirect.
- The netlify 301 for `/services/automated-workflows` must sit **above** the `/*`
  SPA catch-all (Netlify stops at the first match), alongside the existing demo
  redirects.

## Header nav + footer

- **Header:** drop the `publishedServices` map (the two service links). Nav becomes
  lean: brand → `/`, on-page anchor links **Use cases** (`/#use-cases`) and **How it
  works** (`/#how-it-works`), and the **Book a call** CTA. (Anchors scroll to the
  homepage sections; on other pages they navigate to `/#…`.)
- **Footer:** add a small link row including **Technical consulting →**
  (`/services/technical-consulting`) so referrals and curious visitors can still
  reach it; keep the copyright line. Replace the consulting-flavored tagline
  ("Making the right early technology decisions") with an AI-automation one, e.g.
  *"AI-powered automation, built on the tools you already use."*

## Homepage structure (the new `/`)

Reuses the existing automation-index components (split hero + `HeroMontage`, the
9-card grid, `AwHowItWorks`, `AwWhyWorkWithMe`, `AwFinalCta`) with AI-forward copy,
plus two new sections. Order:

1. **Split hero** — eyebrow "AI Services for Small Business"; AI-forward headline +
   subhead; dual CTA (Book a free automation consult · See it work → the demos).
   Reuses `wf-hero-split` + `HeroMontage`.
2. **Trust strip** *(new, compact)* — one row of the credibility points: *10+ years
   as a software engineer · real AI, not brittle no-code · built on the tools you
   already use · fixed scope, no surprise bills.* Sits directly under the hero.
3. **Where it fits** — the existing "automatable work" framing (`aw-framing`),
   reframed with the AI angle.
4. **Use cases** — the existing 9 workflow cards (`aw-examples`), `id="use-cases"`
   for the nav anchor.
5. **See it actually work** *(new proof section)* — the differentiator: most "AI
   automation" is slideware; these are nine you can click through. A framed
   demo-`HeroMontage`-style visual (or a couple of `ShowcaseFrame`s) + a prominent
   link into the demos. Reinforces the "Powered by Claude" reality of the demos.
6. **How it works** — `AwHowItWorks` (`id="how-it-works"`), 3 steps.
7. **Why work with me** — `AwWhyWorkWithMe` (skip if fully covered by the trust
   strip; otherwise keep as the fuller version lower down).
8. **FAQ** *(new, short, AI-specific)* — 4–5 Q&A addressing the AI buyer's real
   objections: "Is this just ChatGPT?" · "Is my business's data safe?" · "What
   happens when it gets something wrong?" · "Do I have to switch tools?" · "What
   does it cost?" Reuse the `wf-faq` styling.
9. **Final CTA** — `AwFinalCta`.

## Copy direction

- **Lead with AI, honestly.** The demos are Claude-powered, so "AI-powered
  automation" / "AI that reads, decides, and acts" is accurate. Do not overclaim on
  the handful of workflows that are more automation-than-AI — frame the *offering*
  as AI-powered, keep each use-case's existing (strong, vetted) copy.
- **Small-business framing throughout** — the audience is trades / local
  service businesses, in their language (the existing use-case copy already nails
  this; keep it).
- **New hero copy** (AI + small-business): lead with the pain + the AI outcome; keep
  the "backed by 10+ years as a software engineer" credibility.
- **FAQ copy** in the same honest, objection-handling voice as the workflow-page
  FAQs (which push back where warranted).
- Keep the existing "no hourly billing / fixed scope" trust lines.

## Preserve / do not touch

- The 9 workflow detail pages and their demos (content + routes).
- The Technical Consulting page (just remove it from nav; page unchanged).
- The Phase-1/2/3 design system (light theme, product-shots, shared CSS).

## Verification

- No test framework; loop is `npm run lint` + `npm run build` + browser walk
  (desktop + mobile <768px).
- Confirm: `/` renders the new homepage; `/services/automated-workflows` redirects
  to `/` (react-router in dev; note the netlify 301 only applies in production —
  verify the react-router `<Navigate>` in dev); the 9 detail pages + demos still
  work; the consulting page renders and is reachable from the footer but gone from
  the nav; nav anchors scroll to the right sections.
- Update the document `<title>`/meta if it references the old positioning (check
  `index.html` — currently "Early-Stage Tech Consulting …").

## Non-goals

- No changes to the workflow detail pages or demos.
- No rewrite of the Technical Consulting page (referral page stays as-is).
- No new testimonials/case studies (proof = demos + credentials).
- No route changes to the detail/demo pages (avoid redirect churn).
