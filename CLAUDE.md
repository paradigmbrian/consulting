# Paradigm Shift Software Development — Consulting Website

## Overview
Consulting website for Paradigm Shift Software Development (PDS). Three service lines: **Technical Consulting** (targets non-technical founders who need technical clarity before building or hiring), **AI Integration** (targets startups and product teams embedding AI into an existing product), and **Automated Workflows** (targets small trades-business owners — HVAC, plumbing, cleaning — who lose time and revenue to repetitive work). Each of the nine automated workflows has its own service page with an interactive demo nested inside it.

**Live site:** https://paradigmshiftdev.io/
**Hosting:** Netlify (auto-deploys from build)

## Tech Stack
- **Framework:** Next.js 16 (App Router), static export (`output: 'export'`) — React 19 + TypeScript
- **CSS:** Vanilla CSS with custom properties (no Tailwind, no CSS-in-JS)
- **Icons:** react-icons
- **Tests:** Vitest (unit), Playwright (e2e + visual), a post-build SEO gate
- **Deployment:** Netlify serves `out/` as static files — no server runtime, no functions

## Project Structure
```
src/
  app/              # Routes only — thin files that import components
    layout.tsx        # <html>, index.css, root metadata, Organization/WebSite JSON-LD
    not-found.tsx     # → out/404.html
    (site)/           # Pages wrapped in Header + <main> + Footer
      page.tsx          # "/"
      services/…        # the three service pages + automated-workflows/[slug]
    services/automated-workflows/[slug]/demo/page.tsx
                      # OUTSIDE (site) on purpose — demos are full-bleed
    og/[name]/route.tsx   # build-time Open Graph PNGs (out/og/<name>.png)
    sitemap.ts, robots.ts, llms.txt/route.ts
  index.css         # Global styles and CSS variables (the theme lives here)
  components/       # Each section is a component with paired .tsx + .css
    workflows/      # WorkflowPage template + its sections + one WorkflowPage.css
                    # AwHowItWorks / AwWhyWorkWithMe / AwFinalCta are SHARED with
                    # the home and automations pages. AwHowItWorks takes a required
                    # `title` prop so it cannot collide with a page's own
                    # "How it works" section.
  data/
    services.ts     # The three service lines — SOURCE OF TRUTH (home cards, metadata, JSON-LD)
    workflows.ts    # The 9 automated workflows — SOURCE OF TRUTH for cards and pages
    workflowPaths.ts  # workflowPath / workflowDemoPath. Demos import THIS, not
                      # workflows.ts, so page copy stays out of demo bundles
    faq.ts          # The automations-index FAQ
    site.ts         # SITE_URL, names, home title/description, CALENDLY_URL
  lib/
    routes.ts       # Every URL the build emits — one list for sitemap, OG, tests
    seo.ts          # pageMetadata() + JSON-LD builders, all derived from data/
    og.ts, llms.ts  # OG card list; llms.txt body
  demos/            # One directory per automation demo (shared engine in demos/shared/)
    registry.ts     # slug → next/dynamic demo; each demo is its own client chunk
  showcases/        # Static product-shot snippets (server components, zero JS)
scripts/verify-seo/ # Post-build gate: runs after every `next build`
e2e/                # Playwright: visual baselines, demo smoke, prerender, head metadata
public/
  favicon/
  activebalance/    # A DIFFERENT product's landing page. Do not edit; the SEO gate skips it
```

`workflows.ts` types `Workflow` as a discriminated union: `published: true` *requires*
the page-content fields, `published: false` forbids them — so a workflow cannot carry
half-written copy, and a published one cannot be missing it. `Stat.sourceUrl` is
non-optional for the same reason: no figure ships without a source, and stats are never
emitted in JSON-LD. Six of the nine pages carry `stats: []` because the research did not
survive vetting; the section omits itself. See `docs/superpowers/research/` before adding
any statistic.

## Key Details
- **Server components by default.** Only the nine demo entry components carry
  `"use client"`. A marketing component that needs a hook or an event handler is a design
  smell — prefer an anchor link or CSS.
- **Every page needs metadata.** A new route exports `metadata` (or `generateMetadata`)
  built with `pageMetadata()` from `lib/seo.ts`, and must be added to `lib/routes.ts`.
  Workflow titles are the label alone (`<Label> | Paradigm Shift`; demos `<Label> Demo`);
  a published workflow must carry hand-written `metaDescription` and `demoDescription`
  (70–160 chars). The build fails otherwise: the gate requires a unique title and a unique
  70–160-character description, a self-canonical, a built `og:image`, exactly one `<h1>`,
  valid JSON-LD, agreement between `sitemap.xml` and the built pages, and the presence of
  `llms.txt`, `robots.txt`, `sitemap.xml` and `favicon.ico`.
- **URLs have no trailing slash.** Netlify serves `out/services/x.html` at `/services/x`.
- **Redirects.** `netlify.toml` holds only the nine legacy `/demos/*` 301s. There is no
  SPA catch-all; unknown URLs get `out/404.html`. `src/lib/netlify.test.ts` enforces this.
- **Static export limits.** No middleware, no ISR, no server actions, no `next/image`
  optimizer. Route handlers must be `force-static`.
- **`e2e/package.json` is `{ "type": "commonjs" }` on purpose.** The root package is
  `"type": "module"`, so without it Playwright's loader treats `e2e/*.ts` as native ESM,
  whose resolver rejects the `react-icons/fa` directory import reached via
  `e2e/routes.ts → src/lib/routes.ts → src/data/workflows.ts`. Don't remove it.
- **Screenshot baselines are Git LFS.** `e2e/__screenshots__/**/*.png` is tracked in
  `.gitattributes`; a fresh clone needs `brew install git-lfs && git lfs install` (then
  `git lfs pull`) before `npm run e2e` can compare against real images.
- **OG cards render Inter** from `src/app/og/fonts/` (SIL OFL, Latin subset) because
  `next/og` bundles one regular weight; the hex colours in the route mirror `index.css`.
- **No CMS** — all content is hardcoded in components or `data/`.
- **Calendly integration** — CTAs link to https://calendly.com/brian-paradigmshiftdev/30min
- **Responsive** — mobile-first CSS with breakpoints at 768px and 968px
- `src/demos/commercialCleaning/` is retained but has no route.

## Commands
- `npm run dev` — Next dev server (localhost:3000)
- `npm test` — Vitest
- `npm run lint` — ESLint, zero warnings · `npm run typecheck` — `tsc --noEmit`
- `npm run build` — `next build` → `out/`, then the SEO gate (`postbuild`)
- `npm run preview` — serve `out/` on :4173 the way Netlify does
- `npm run e2e` — Playwright (builds first). `npm run e2e:update` rewrites only the
  snapshots that fail comparison (Playwright's `--update-snapshots=changed` default); a
  full regeneration needs `npx playwright test e2e/visual.spec.ts --update-snapshots=all`.
  Only after an intentional visual change, and look at the diff first.

**Definition of done:** `npm test` → `npm run lint` → `npm run build` → `npm run e2e`.

## Content Reference
Consulting offer details, pricing, and copy are documented in the Obsidian vault at:
`/Users/brian/Documents/dev-vault/projects/paradigm/Consulting/`
