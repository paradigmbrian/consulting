# Paradigm Shift Software Development — Consulting Website

## Overview
Single-page consulting website for Paradigm Shift Software Development (PDS). Targets non-technical founders at the early stage who need technical clarity before building or hiring.

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
  components/       # Each section is a component with paired .tsx + .css
    Hero.tsx        # Brand intro, primary CTAs
    WhoIsFor.tsx    # Target audience
    Problem.tsx     # Pain points founders face
    Offer.tsx       # Three service tiers (MVP Blueprint, Tech Audit, Fractional CTO)
    HowItWorks.tsx  # 3-step engagement process
    WhyWorkWithMe.tsx # USP and benefits
    CTA.tsx         # Final call-to-action (links to Calendly)
    Footer.tsx      # Copyright and tagline
  App.tsx           # Assembles all sections in order
  main.tsx          # React entry point
  index.css         # Global styles and CSS variables
public/
  favicon/          # Favicon assets
src/data/
  services.ts       # Two top-level service lines
  workflows.ts      # The 9 automated workflows — source of truth for cards and pages
src/components/workflows/  # WorkflowPage template + its sections + shared aw-* sections
src/demos/          # One directory per automation demo; registry.ts maps slug → lazy component
```

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
