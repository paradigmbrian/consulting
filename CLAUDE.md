# Paradigm Shift Software Development — Consulting Website

## Overview
Consulting website for Paradigm Shift Software Development (PDS). Two service lines: **Technical Consulting** (targets non-technical founders who need technical clarity before building or hiring) and **Automated Workflows** (targets small trades-business owners — HVAC, plumbing, cleaning — who lose time and revenue to repetitive work). Each of the nine automated workflows has its own service page with an interactive demo nested inside it.

**Live site:** https://paradigmshiftdev.io/
**Hosting:** Netlify (auto-deploys from build)

## Tech Stack
- **Framework:** React 18 + TypeScript
- **Build:** Vite 5
- **CSS:** Vanilla CSS with custom properties (no Tailwind, no CSS-in-JS)
- **Icons:** react-icons
- **Deployment:** Netlify (`npm run build` → `dist/`)

## Project Structure
```
src/
  App.tsx           # Routes only — assembles nothing itself
  main.tsx          # React entry point
  index.css         # Global styles and CSS variables (the theme lives here)
  components/       # Each section is a component with paired .tsx + .css
    Layout.tsx      # Header + <Outlet /> + Footer; pages render inside it
    Header.tsx      # Sticky site header (nav + Calendly CTA)
    Footer.tsx      # Copyright and tagline
    LandingPage.tsx # "/" — the root landing page
    TechnicalConsulting.tsx # Assembles the sections below, in order
      Hero.tsx        # Brand intro, primary CTAs
      WhoIsFor.tsx    # Target audience
      Problem.tsx     # Pain points founders face
      Offer.tsx       # Three service tiers (MVP Blueprint, Tech Audit, Fractional CTO)
      HowItWorks.tsx  # 3-step engagement process
      WhyWorkWithMe.tsx # USP and benefits
      CTA.tsx         # Final call-to-action (links to Calendly)
    AutomatedWorkflows.tsx  # The automated-workflows index (grid of 9 cards)
    workflows/      # WorkflowPage template + its 6 sections + one WorkflowPage.css
                    # AwHowItWorks / AwWhyWorkWithMe / AwFinalCta are SHARED with
                    # the index page. AwHowItWorks takes a required `title` prop:
                    # index passes "How It Works", workflow pages pass "How we'd
                    # work together" (they already have their own "How it works"
                    # mechanism section, which would otherwise collide).
  data/
    services.ts     # The two top-level service lines
    workflows.ts    # The 9 automated workflows — SOURCE OF TRUTH for cards and pages
    site.ts         # Shared CALENDLY_URL
  demos/            # One directory per automation demo (shared engine in demos/shared/)
    registry.ts     # slug → lazily-imported demo component; keeps demos out of the main bundle
public/
  favicon/          # Favicon assets
```

`workflows.ts` types `Workflow` as a discriminated union: `published: true` *requires*
the page-content fields, `published: false` forbids them — so a workflow cannot carry
half-written copy, and a published one cannot be missing it. `Stat.sourceUrl` is
non-optional for the same reason: no figure ships without a source. Six of the nine
pages carry `stats: []` because the research did not survive vetting; the section
omits itself. See `docs/superpowers/research/` before adding any statistic.

## Key Details
- **Routing** — `react-router-dom` v6. `/` → landing page (`components/LandingPage.tsx`); `/services/technical-consulting` and `/services/automated-workflows` → the two service lines; `/services/automated-workflows/:slug` → per-workflow service page (`components/workflows/WorkflowPage.tsx`, inside `Layout`); `/services/automated-workflows/:slug/demo` → that workflow's interactive demo (full-bleed, outside `Layout`, lazily resolved via `src/demos/registry.ts`). Old `/demos/*` URLs 301 to the nested demo routes — those rules must stay above the SPA catch-all in `netlify.toml`, which Netlify evaluates in file order. `src/demos/commercialCleaning/` is retained but has no route.
- **No CMS** — all content is hardcoded in components
- **No blog infrastructure** — no markdown parsing, no dynamic content
- **Calendly integration** — CTAs link to https://calendly.com/brian-paradigmshiftdev/30min
- **Responsive** — mobile-first CSS with breakpoints at 768px and 968px

## Commands
- `npm run dev` — Start dev server (localhost:5173)
- `npm run build` — TypeScript check + Vite production build
- `npm run preview` — Preview production build locally
- `npm run lint` — ESLint with zero warnings tolerance

## Content Reference
Consulting offer details, pricing, and copy are documented in the Obsidian vault at:
`/Users/brian/Documents/dev-vault/projects/paradigm/Consulting/`
