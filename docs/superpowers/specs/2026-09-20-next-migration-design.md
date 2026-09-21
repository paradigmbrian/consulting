# Next.js Migration at Parity — Design

**Date:** 2026-09-20
**Status:** Implemented (branch next-migration)
**Spec 1 of 3.** Spec 2 is the blog (fed by `../content-engine`). Spec 3 is the IA refactor
(`Services ▾ · Demos · Blog` nav, `/demos` index, home-page proof strips). They are built in
that order; each gets its own spec, plan and build.

## Goal

Move the site from a client-only Vite SPA to statically exported Next.js so every route ships
real HTML with its own metadata. The site must perform for organic search and for AI search.
Same pages, same URLs, same design — nothing visual changes in this spec, so any regression is
attributable to the migration.

## Why

Today every route serves one `index.html` with one `<title>` and one description. Social
scrapers and most AI crawlers do not run JavaScript, so they see the homepage metadata and an
empty `<div id="root">` for every URL. The blog (spec 2) is pointless on that foundation, and
the service and demo pages already suffer from it.

## Out of scope

The blog, the nav/IA changes, the `/demos` index, the `next/image` loader and Netlify Image
CDN (spec 2 — the site has no content images today), any copy or design change, analytics.

## 1. Stack and rendering

- Current stable Next.js (App Router), React 19, TypeScript. Exact versions pinned at plan time.
- `output: 'export'`. Netlify publishes `out/`. No server runtime, no serverless functions.
- `trailingSlash` stays `false`. URLs are unchanged: Netlify serves `out/services/x.html` at
  `/services/x`.
- `.nvmrc` pins Node to a version that satisfies Next and exists on Netlify's build image
  (local is 22.16; verify at plan time).

### `netlify.toml`

- `publish = "out"`.
- **Remove** the SPA catch-all (`/* → /index.html 200`). Real HTML files replace it.
- **Remove** the `/services/automated-workflows → /` 301. It is a leftover from when the index
  was merged into the homepage; the page exists again and the header links to it, so today a
  refresh or a shared link to it bounces to the homepage.
- **Keep** the nine `/demos/* → /services/automated-workflows/<slug>/demo` 301s.
- `app/not-found.tsx` builds to `404.html`, which Netlify serves automatically. Today unknown
  URLs silently render the app shell with a 200.

### Routes

| URL | File | Notes |
|---|---|---|
| `/` | `app/(site)/page.tsx` | `Home` |
| `/services/automated-workflows` | `app/(site)/services/automated-workflows/page.tsx` | |
| `/services/ai-integration` | `app/(site)/services/ai-integration/page.tsx` | |
| `/services/technical-consulting` | `app/(site)/services/technical-consulting/page.tsx` | |
| `/services/automated-workflows/[slug]` | `app/(site)/services/automated-workflows/[slug]/page.tsx` | `generateStaticParams` from published workflows; `dynamicParams = false` |
| `/services/automated-workflows/[slug]/demo` | `app/services/automated-workflows/[slug]/demo/page.tsx` | outside `(site)` so it stays full-bleed; params from `demoRegistry` keys |

- **`app/` lives at `src/app/`**; every `app/…` path in this spec is under `src/`. Route files
  use the `@/*` alias (→ `src/*`); existing components keep their relative imports.
- `app/layout.tsx` is the root: `<html>`, `index.css`, root metadata, Organization/WebSite JSON-LD.
- `app/(site)/layout.tsx` holds `Header` + `Footer` (today's `Layout.tsx`).
- Unknown workflow or demo slugs 404 (today they client-redirect via `<Navigate>`).
- Existing components keep their location under `src/components/`; `app/` files are thin and
  import them. `src/App.tsx`, `src/main.tsx`, `index.html`, `vite.config.*` are deleted.

### Server and client components

- Pages and sections are server components and ship no JavaScript.
- `"use client"` only where state, effects or browser APIs are used: the demos, and any
  showcase that needs it (audited per file at plan time).
- `Hero.tsx` and `AiIntegration.tsx` use `document.getElementById(...).scrollIntoView` click
  handlers. Replace with native `<a href="#offer">` / `<a href="#ai-offer">` (the pattern the
  rest of the site already moved to, with `scroll-margin`) so they stay server components.
- Showcase snippets are pure static markup: the showcase registry switches from `React.lazy`
  to static imports and they render on the server with zero JS. Consequence: a workflow page's
  CSS includes all nine demos' stylesheets (class names are namespaced per demo; the visual
  suite proves no bleed).
- `usePrefersReducedMotion` reads `window.matchMedia` in a `useState` initializer, which would
  mismatch on hydration for reduced-motion visitors; it moves to `useSyncExternalStore`.
- Demos import `workflowPath` from a new `data/workflowPaths.ts` so ~1000 lines of page copy
  stay out of every demo bundle.
- Demos: the registry switches from `React.lazy` to `next/dynamic`. The demo page is a server
  component; the demo is a client component that is **also prerendered** (the demos are scripted
  and deterministic, and the SEO gate needs their `<h1>` in the HTML). `next/dynamic` keeps each
  demo in its own client chunk, out of the shared bundle as today.
- `ScrollToTop.tsx` is deleted; Next handles scroll restoration.
- `react-router-dom` is removed. `Link` → `next/link`; `useParams` → the `params` prop.

### CSS

Unchanged. Vanilla CSS with custom properties, paired `.tsx` + `.css`, `index.css` imported in
the root layout. System font stack stays (no web fonts today, so no `next/font`).

### `public/`

`public/favicon/` and `public/activebalance/index.html` (a standalone landing page for a
different product) are copied to `out/` as-is. The SEO build gate (§2) **excludes**
`activebalance/`; it is not part of this site's metadata contract.

## 2. SEO and AI-search layer

One module, `src/lib/seo.ts`, derives all metadata and structured data from `services.ts` and
`workflows.ts`, so structured data cannot drift from the visible copy.

- **`services.ts` becomes accurate.** It lists two services while `Home.tsx` hardcodes three.
  Add AI Integration and have `Home` read from it. (The nav still hardcodes links until spec 3.)
- **Metadata.** Root layout sets `metadataBase = https://paradigmshiftdev.io` and a title
  template. Every route exports `metadata` / `generateMetadata`: unique title, description,
  self-canonical, Open Graph, Twitter card. Workflow pages derive theirs from `label`,
  `hero.headline`, `hero.subhead`. Demo pages are indexable with their own metadata.
- **OG images.** A branded card per route (title on the site theme), generated at build by a
  static route handler, `src/app/og/[name]/route.tsx`, using `next/og`. Verified in a plan-time
  spike on Next 16.3.5: `opengraph-image.tsx` exports a file with no extension, which Netlify
  would serve without an image content type; a route handler whose param is `home.png` exports
  a real `out/og/home.png`. No `satori` dependency.
- **JSON-LD.** `Organization` (with `sameAs` → the company LinkedIn page,
  `https://www.linkedin.com/company/paradigm-shift-tech-consulting/`) + `WebSite` in the root layout. `Service` on each service page
  and workflow page. `BreadcrumbList` on workflow and demo pages. `FAQPage` wherever FAQs
  render (`WorkflowFaq`, the automations index FAQ). Google no longer shows FAQ rich results
  for most sites; the markup is for machine readability by AI engines and Bing.
- **Stats.** Stats are not emitted in structured data at all — schema.org has no natural home
  for them, and omitting them trivially honours the no-unsourced-figures rule.
- **`app/sitemap.ts`, `app/robots.ts`.** Generated from the same route data. Robots allows
  all, names GPTBot, ClaudeBot, PerplexityBot and Google-Extended explicitly to document
  intent, and points at the sitemap.
- **`llms.txt`.** Generated at build from the same data: site summary, the services, the nine
  workflow pages with one-line summaries. Emerging convention with uncertain adoption; near
  zero cost. Spec 2 adds posts to it.
- **Semantic HTML.** One `<h1>` per page, headings in order, `<main>` in the site layout.
  `WorkflowFaq` already uses `<details>`, so answers are in the HTML when collapsed — keep
  that pattern for any FAQ.

### Build gate

`scripts/verify-seo/run.ts` (checks in `scripts/verify-seo/checks.ts`) runs as `postbuild`. It
walks `out/**/*.html` (excluding
`activebalance/` and `404.html`) and fails the build if any page lacks a title, a description,
a canonical, an `og:image`, or exactly one `<h1>`; if any title, description or canonical is
duplicated across pages; if any JSON-LD block fails to parse; or if `sitemap.xml` and the set
of built pages disagree.

## 3. Testing and parity

The repo has no tests today. All of this is new.

- **Vitest (unit).** `lib/seo.ts` builders; sitemap and `llms.txt` generators; data invariants
  — every published workflow with `hasDemo` has a registry entry and vice versa, slugs are
  unique, every stat has a `sourceUrl`, every `netlify.toml` redirect target is a known route.
- **Build gate.** §2, part of `npm run build`.
- **Playwright against `out/` served locally.**
  - Every route returns 200 and shows its `<h1>` with JavaScript disabled (proves prerender).
  - Each of the nine demos loads and advances one step with zero console errors (catches
    hydration mismatches — the main migration risk).
  - An unknown URL gets the 404 page.
- **Visual parity.** Before migrating, capture Playwright screenshots of the current Vite
  build for every route at 375, 768 and 1280 px, reduced motion forced, animated regions
  (`HeroMontage`, showcase animations) masked. The Next build must match within a small pixel
  threshold. After the migration passes, regenerate baselines from the Next build and keep the
  suite as regression coverage. Baselines for the Vite build are captured first, as the first
  task of the plan, while `main` still builds with Vite.
- **Lint / types.** ESLint 9 flat config with `eslint-config-next`, zero warnings;
  `tsc --noEmit`. A dry run found four rule families firing on today's code:
  `react/no-unescaped-entities` (52 files of copy — turned off), `react-hooks/set-state-in-effect`
  and `react-hooks/refs` (scripted demo timers — off for `src/demos/**` only; demo internals are
  not refactored in a parity migration), and two stale `react-refresh` disable comments (deleted).

### Definition of done

`npm test` → `npm run lint` → `npm run build` (includes the SEO gate) → `npm run e2e`.

## 4. Cutover

- Work on a branch in this repo. Git write commands are printed for Brian to run.
- The Netlify deploy preview is the first place the 301s, the 404 page and caching headers can
  be checked for real; check all nine old `/demos/*` URLs and a direct load of
  `/services/automated-workflows` there before merge.
- Rollback: republish the previous deploy in Netlify (instant), or revert the merge.
- After launch (manual, Brian): submit `sitemap.xml` in Google Search Console and Bing
  Webmaster Tools.
- Rewrite `CLAUDE.md` for the new structure — it is already stale (references
  `LandingPage.tsx`, two service lines, the merged automations index). Sync to the Obsidian vault.

## Risks

| Risk | Mitigation |
|---|---|
| Hydration mismatches in demos (timers, `window` at render) | Demos are scripted and deterministic, so they are prerendered; the one `window` read at render is fixed; Playwright zero-console-error check per demo |
| `opengraph-image` unsupported for dynamic segments under static export | `satori` prebuild fallback, same output |
| React 18 → 19 breaks `react-icons` or demo engine typings | Upgrade React first as its own task, on Vite, before introducing Next |
| Global CSS import order changes cascade | Visual parity suite at three widths |
| Netlify auto-detects Next and installs its runtime plugin | Static export needs none; confirm on the deploy preview that no functions are deployed |

## Decisions recorded for later specs

- **Images (spec 2):** static export + Netlify Image CDN through a custom `next/image` loader;
  dev passes the raw file through. SVGs bypass the pipeline and render with plain `<img>`.
- **Blog bundle contract (spec 2):** `content/blog/<slug>/index.md`, images under
  `<slug>/images/`, referenced as `./images/<name>.<ext>`; `cover` optional and relative; posts
  with no cover and no images must render. content-engine will later export `<slug>.zip`
  containing that folder, and keeps exporting a bare `.md` for posts without diagrams. No
  `cover` field in content-engine front matter yet.
