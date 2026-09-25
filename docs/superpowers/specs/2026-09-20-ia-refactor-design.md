# IA Refactor — Offers and Proof — Design

**Date:** 2026-09-20
**Status:** Draft for review
**Spec 3 of 3.** Depends on spec 1 (`2026-09-20-next-migration-design.md`) and spec 2
(`2026-09-20-blog-design.md`): server components, `src/lib/seo.ts`, the SEO build gate,
`loadPosts()`, `PostCard`, and the `services` front-matter key.

## Goal

Restructure the site around two layers — **offers** (the three services) and **proof** (the
nine demos and the writing) — so the strongest evidence is one click from anywhere instead of
two levels down under one service.

## Why

The home page is a sorter: "which are you?" → three audience-specific offers. That holds up. A
blog is not a fourth offer, so it does not belong in the sorter. Meanwhile the nine demos — the
strongest asset on the site — are reachable only through the Automations page, so a founder or
product team landing on the home page never sees them, and the home page goes from the sorter
straight to why/how/CTA with no evidence in between.

## Out of scope

Moving demo URLs. A `/work` page or case studies. Tag pages. Related posts on workflow detail
pages (would need a `workflows:` front-matter key; deferred until post volume justifies growing
the content-engine contract). Service-page copy changes. New copy is limited to the section
headings and the `/demos` page intro named below.

## 1. Data

- **`src/data/services.ts` is the single source of truth.** Each service: `slug`, `navLabel`
  ("Automations"), `name` ("AI Automations"), `eyebrow` ("For small-business owners"), `line`,
  `summary`, `accent`, `published` (no `order` field: array order is display order, already
  tested, and a second ordering would only be a way to disagree with it). `servicePath(slug)` stays. Header, Footer, the home
  sorter, the blog service CTA (spec 2), `RelatedPosts` and `lib/seo.ts` read it. Spec 1
  already made `Home` read its cards from this file; this spec adds `navLabel` and
  deletes the hardcoded links in `Header.tsx` / `Footer.tsx`, after which no component
  hardcodes the service list.
- **`src/data/workflows.ts`** gains `featuredDemoSlugs: string[]`, ordered:
  `missed-call-text-back`, `automated-quoting`, `weekly-owner-reports`, `review-generation`.
  Chosen because the AI is most visibly doing something, which reads for founder and
  product-team visitors as well as trades owners. Changing the picks is a one-line edit.

## 2. Navigation

### Header

`[brand] · Services ▾ · Demos · Blog · [Book a call]`

- `Services` is a `<button>`, not a link — there is no `/services` page and the home sorter is
  the services index. Its menu lists the three services, each with its `eyebrow`, so the menu
  does the same sorting job as the home page.
- `Header` stays a server component and renders every link into the HTML. One client component,
  `HeaderMenu`, owns open/closed state: `aria-expanded` and `aria-controls` on the button,
  Escape closes and returns focus to the button, click-outside closes, route change closes.
  With JavaScript disabled the menu items are visible (progressive enhancement), so crawlers
  and no-JS visitors reach every page.
- Below 768px: a hamburger button opens a panel with the three services listed inline (no nested
  disclosure), then Demos, Blog and the Book-a-call CTA. Same `HeaderMenu` component, same
  keyboard behaviour. This replaces today's wrap-below-640px header and removes the extra row
  spec 2 accepted.
- `Blog` appears only when at least one published post exists (spec 2 §7).

### Footer

Three groups: **Services** (from `services.ts`), **Proof** (Demos, Blog — Blog conditional as
above), **Book a call**. Copyright and tagline unchanged.

## 3. `/demos` index

`app/(site)/demos/page.tsx`.

- Hero: eyebrow "Proof, not promises", an `<h1>`, and a short intro making the point the
  Automations proof section already makes — these are working click-throughs on made-up
  businesses, not slides.
- Grid of nine `DemoCard`s, in `workflows.ts` order, for workflows that are `published` and
  `hasDemo`.
- **`DemoCard`** (`src/components/demos/DemoCard.tsx` + `.css`): the workflow's existing static
  showcase snippet (`showcase.heroSnippet`) inside `ShowcaseFrame` — which keeps the
  "Illustrative" tag — then icon, `label`, `cardSummary`, a primary link "Try the demo →"
  (`workflowDemoPath`) and a secondary link "How it works" (`workflowPath`). The shot wrapper is `inert` — snippets are mock UI containing mock
  `<button>`s, and `inert` keeps them out of the tab order and the accessibility tree. Server-rendered
  static markup; ships no JavaScript. Showcase modules are imported statically here rather than
  through the lazy registry; the page therefore loads the snippet CSS for all nine, which is
  no new cost: since the Next migration, workflow pages already ship all nine demo stylesheets.
  The plan measures the page's gzipped CSS against a 30 KB budget; the lighter-card fallback is
  built only if that is exceeded.
- Closing section: `AwFinalCta`.
- Metadata via `lib/seo.ts`; `CollectionPage` + `ItemList` JSON-LD (one `ListItem` per demo
  URL). Added to the sitemap and to `llms.txt` as a Demos section.
- **`netlify.toml`:** no rule changes. Add a comment that `/demos` is the index page and the
  nine `/demos/<old-slug>` rules beneath it are legacy 301s; the old slugs differ from every
  current route, so nothing collides.

## 4. Home page

hero → sorter → **demos strip** → **latest writing** → why → how → CTA.

- **Sorter** renders from `services.ts`. Hero copy is unchanged ("three ways to put it to work"
  is still true).
- **Demos strip:** heading "See it work", the four `featuredDemoSlugs` as `DemoCard`s, and a
  "See all nine demos →" link to `/demos`. The count in the link is derived from the data.
- **Latest writing:** heading "From the blog", the three newest published posts as spec 2's
  `PostCard`, and an "All posts →" link. The whole section is omitted when there are no
  published posts.

## 5. Service pages

- `<RelatedPosts service="<slug>" />` (`src/components/blog/RelatedPosts.tsx`) on the three
  service pages, immediately before the final CTA: heading "Related writing", up to three
  newest published posts whose `services` includes the slug, as `PostCard`s. Omitted when none.
- The Automations page proof section gains a "See all demos →" link to `/demos`.

## 6. Testing

- **Vitest:** `services.ts` slugs and nav labels unique; every `featuredDemoSlugs` entry
  exists, is published and has a demo; `RelatedPosts` selection (filters by service, newest
  first, caps at three, excludes drafts, empty ⇒ renders nothing); the `/demos` `ItemList`
  matches the published-with-demo workflows.
- **Playwright:**
  - Services menu by keyboard: Tab to button, Enter opens, Tab reaches the three links, Escape
    closes and focus returns to the button; click-outside closes; navigating closes.
  - Hamburger at 375px: opens, all links reachable, closes on navigation.
  - With JavaScript disabled, every nav destination is present as a link in the HTML.
  - `/demos` shows nine cards and every card link resolves to a built page.
  - Home shows four demo cards and the writing strip (the e2e build always has fixture posts).
    The strip's absence without posts is checked with `grep` on a default-content build; a
    second Playwright build for one absence check is not worth its runtime.
  - `@axe-core/playwright` scan of the header in closed and open states, desktop and mobile:
    no violations.
- **Build gate:** the spec-1 checks cover `/demos` automatically.
- **Visual baselines change on purpose** in this spec — the header on every page, the home
  page, the three service pages, plus new `/demos` snapshots. The plan includes a task to
  review the diffs with Brian and then regenerate baselines.
- **Definition of done:** `npm test` → `npm run lint` → `npm run build` → `npm run e2e`.

## 7. Docs

Update `CLAUDE.md`: the offers/proof structure, `services.ts` as source of truth,
`featuredDemoSlugs`, `/demos`, `HeaderMenu` as the header's only client component. Sync to the
Obsidian vault.

## Risks

| Risk | Mitigation |
|---|---|
| Dropdown hurts discoverability of the three services | Menu items carry the audience eyebrow; home sorter unchanged; footer lists all three; links always in HTML |
| Nine showcase snippets' CSS on one page | Static markup only, no JS; CSS size budget checked in the plan; fall back to a lighter card (icon + summary) for non-featured demos if over budget |
| Menu state bugs on client navigation | Close-on-route-change covered by Playwright |
| Home page gets long on mobile | Demos strip is four cards, writing strip three; both scroll-snap horizontally below 768px rather than stacking |
