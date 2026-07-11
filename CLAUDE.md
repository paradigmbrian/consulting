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
src/demos/commercialCleaning/  # Scripted commercial-cleaning prospecting demo (route /demos/commercial-cleaning)
```

## Key Details
- **Routing** — `react-router-dom` v6. `/` → landing page (`components/Home.tsx`); `/demos/commercial-cleaning` → scripted product-tour demo (`src/demos/commercialCleaning/`). Netlify SPA fallback in `netlify.toml`.
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
`/Users/brian/Documents/dev-vault/PDS/Consulting/`
