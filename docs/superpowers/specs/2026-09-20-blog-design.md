# Blog — Design

**Date:** 2026-09-20
**Status:** Draft for review
**Spec 2 of 3.** Depends on spec 1 (`2026-09-20-next-migration-design.md`): Next.js App Router,
`output: 'export'`, `src/lib/seo.ts`, the `out/` SEO build gate, Vitest and Playwright. Spec 3
(IA refactor) consumes this spec's `loadPosts()` and the `services` front-matter key.

## Goal

A blog at `/blog` that publishes posts exported from `../content-engine`. Publishing a post is
"drop the export into `content/blog/`, commit, push". Every post ships as static HTML with full
metadata, structured data, a feed entry and a raw-markdown alternate, so it performs for organic
search, social unfurls and AI search.

## Out of scope

The nav restructure, related posts on service pages and the home-page writing strip (spec 3).
Tag pages, pagination, search, comments, newsletter signup, analytics. Any change to
content-engine.

## 1. Content contract

### Layout on disk

A post is one of:

- `content/blog/<slug>/index.md` with images under `content/blog/<slug>/images/`, referenced
  from the markdown as `./images/<name>.<ext>`.
- `content/blog/<slug>.md` — a bare export with no images.

The folder or file name must equal the front-matter `slug`. Both forms existing for one slug is
a build error. A post with no cover and no images must render correctly.

### Bundle contract with content-engine

- Today the engine exports a single `<slug>.md`. It drops in as the flat form unchanged.
- Later the engine will export `<slug>.zip` containing `<slug>/index.md` plus
  `<slug>/images/*.svg` for posts with diagrams, and keep exporting a bare `.md` for posts
  without. Unzipping into `content/blog/` yields the folder form unchanged.
- The engine's front matter does **not** gain a `cover` key yet; nothing generates covers.
- `services` (below) is a site-side key today and a candidate engine export key later.

### Front matter

Validated by a **strict** zod schema in `src/lib/blog/schema.ts`. Unknown keys fail the build,
so a typo such as `service:` cannot be silently ignored; a new engine key is a deliberate
one-line schema change.

| Keys | From | Rule |
|---|---|---|
| `title`, `slug`, `date`, `tags`, `summary` | engine | required; `slug` kebab-case; `date` `YYYY-MM-DD`; `summary` non-empty (it is the meta description) |
| `series`, `seriesSlug`, `part`, `partsTotal` | engine | all four or none |
| `previousPart`, `nextPart` | engine | accepted, ignored — `nextPart` is stale until the earlier part is re-exported, so prev/next are derived from `seriesSlug` + `part` across the posts the site actually has |
| `cover`, `coverAlt` | hand-added | optional; `cover` is a relative path whose file must exist; `coverAlt` required when `cover` is set |
| `services` | hand-added | optional list of slugs validated against `src/data/services.ts` |
| `updated` | hand-added | optional `YYYY-MM-DD`, must be ≥ `date` |
| `draft` | hand-added | `true` ⇒ visible under `next dev`, excluded from production pages, sitemap, feed, `llms.txt` |

Cross-post rules (build errors): duplicate `slug`; two posts with the same `seriesSlug` + `part`;
posts sharing a `seriesSlug` but disagreeing on `series` or `partsTotal`.

### Body conventions (as the engine writes them)

- The body opens with an `# H1` repeating the title. The pipeline strips it; the page template
  renders the `<h1>`. Any other H1 in the body is a build error (the spec-1 gate requires
  exactly one `<h1>`).
- Sources are inline Markdown links. They render as ordinary links — no special citation
  handling. `[n]` markers, if present, render as text.

## 2. Pipeline

`src/lib/blog/` — server-only, no client JavaScript.

- `loadPosts()` reads and validates `content/blog/` once per build (module-level cache) and
  returns posts sorted by `date` descending. Pages, feed, sitemap, `llms.txt` and spec 3 all
  consume it. Derived helpers: `getPost(slug)`, `getSeries(seriesSlug)`, `relatedPosts(post)`.
- Render steps: `gray-matter` (JS front-matter engines disabled, as the engine does) → strip
  leading H1 → `remark-parse` + `remark-gfm` → `remark-rehype` with raw HTML dropped →
  heading ids + anchor links on H2/H3 → `shiki` highlighting at build time → external links get
  `target="_blank" rel="noopener noreferrer"` (not nofollowed) → image step (§3) → React
  elements on the server via `hast-util-to-jsx-runtime`.
- Also produced per post: table of contents (H2s), reading time, and the cleaned markdown used
  for the `.md` alternate (§5). There is no separate excerpt: cards, feed and metadata all use
  `summary`.
- No MDX. Content is drafted by agents from web pages; nothing in a post may execute.

`relatedPosts(post)`: up to three, excluding the post itself and other parts of its series
(series prev/next covers those); ranked by shared `services`, then shared `tags`, then recency.

## 3. Images

- A prebuild script copies `content/blog/<slug>/images/*` to `public/blog/<slug>/images/`
  (gitignored), so they are served at `/blog/<slug>/images/<name>.<ext>`.
- The rehype image step rewrites `./images/x.ext` to that absolute URL, reads intrinsic width
  and height (from `viewBox` for SVG) to prevent layout shift, and **fails the build** on a
  missing file, missing dimensions, or empty alt text. References outside `./images/` and
  remote image URLs are build errors.
- Raster images render through `next/image` with a custom loader targeting the Netlify Image
  CDN (`/.netlify/images?url=…&w=…&q=…`). The CDN is switched on by
  `NEXT_PUBLIC_IMAGE_CDN=netlify`, set only in `netlify.toml`; everywhere else — `next dev`, a
  local production build, Playwright — the loader returns the raw file, because
  `/.netlify/images` does not exist off Netlify.
- `image-size` reads intrinsic dimensions for raster files and for SVG (`width`/`height` or
  `viewBox`), so both share one code path.
- `.svg` bypasses the pipeline: plain `<img>` with explicit width/height. `<img>` also
  sandboxes any script inside an agent-written SVG.
- `cover` follows the same path and is the post's `og:image`. With no cover, the post uses the
  generated branded card from spec 1.

## 4. Routes and pages

All statically generated; `dynamicParams = false`. Pages live under `app/(site)/blog/`.
Styling follows the existing theme: vanilla CSS with the `index.css` custom properties, paired
`.tsx` + `.css`. Post body typography is a single `.post-body` stylesheet.

| URL | Content |
|---|---|
| `/blog` | Chronological post cards: optional cover, title, summary, date, reading time, tags as plain labels, "Part N of M" badge for series posts. No pagination until ~24 posts. |
| `/blog/[slug]` | Breadcrumb → `<h1>` → byline (author · date · "Updated" when set · reading time) → cover → series banner → table of contents (when ≥ 3 H2s) → body → series prev/next → service CTA → author box → related posts. Wrapped in `<article>`. |
| `/blog/series/[seriesSlug]` | Series title and its published parts in order, with "N of M published". Generated only for series with at least one post. |

- **Series banner:** "Part N of M in *Series title*", linking to the series page.
- **Service CTA:** when `services` is set, a card for the first listed service (name, line and
  link from `services.ts`) plus the Calendly CTA; otherwise the generic Calendly CTA.
- **Author:** `src/data/author.ts` holds name, job title, bio, URL and `sameAs` links. It
  drives the byline, the author box and the `Person` JSON-LD. Posts are attributed to Brian
  Flannery; the publisher is the Organization. `sameAs` is Brian's personal profile,
  `https://www.linkedin.com/in/bflanneryatx/` — the company page belongs to the `Organization`
  (spec 1), never to the author. Bio is drafted from existing site copy.
- **No tag pages.** Thin at low post counts. Revisit at ~20 posts.
- **Nav:** add `Blog` to `Header` and `Footer`. The header has no hamburger and wraps below
  640px; a fourth link adds a wrapped row on phones. Accepted until spec 3 collapses the
  services under one item.

## 5. SEO, feeds and AI search

Extends `src/lib/seo.ts` from spec 1.

- **Metadata per post:** title; `summary` as description; canonical; Open Graph `article` with
  `publishedTime`, `modifiedTime` (`updated ?? date`), `authors`, `tags`; Twitter large card;
  `og:image` = cover or generated card.
- **JSON-LD:** `BlogPosting` (headline, description, `datePublished`, `dateModified`, `author`
  Person with `sameAs`, `publisher` Organization, `image`, `keywords`, `mainEntityOfPage`,
  `isPartOf` for series parts) and `BreadcrumbList` on posts; `Blog` on `/blog`;
  `CollectionPage` on series pages.
- **Sitemap:** `/blog`, every published post (`lastmod` = `updated ?? date`), every series page.
- **RSS:** `/blog/feed.xml`, full content, absolute URLs for links and images. Autodiscovery is
  a literal `<link rel="alternate" type="application/rss+xml">` in the root layout `<head>` —
  not `metadata.alternates.types`, which Next replaces wholesale on any page that sets a
  canonical.
- **Raw markdown alternate:** each published post's cleaned markdown (front matter reduced to
  title, date, summary, canonical URL; image URLs absolute) is written at build to
  `/blog/<slug>.md`, declared with `<link rel="alternate" type="text/markdown">`. AI agents get
  the post without parsing HTML.
- **`llms.txt`:** gains a Blog section — title, summary and `.md` link per post.

## 6. Testing and build gate

- **Build gate (extends `scripts/verify-seo.ts`).** The spec-1 checks already cover the new
  pages. Added: every post page has `BlogPosting` JSON-LD; `feed.xml` parses and its item count
  equals the published post count; every published post and series page is in the sitemap; every
  post has its `.md` alternate; no `draft` post appears anywhere in `out/`.
- **Fixtures.** Unit tests build throwaway content directories with a helper
  (`src/lib/blog/testing.ts`), so each case is a few lines. On-disk fixture posts (flat post,
  bundle with cover + raster + SVG, a three-part series with part two unpublished, a draft) live
  in `e2e/fixtures/blog/`; the e2e build reads them via `BLOG_CONTENT_DIR`, because production
  has no published post yet.
- **Vitest:**
  - schema: bad slug, empty summary, partial series keys, `cover` without `coverAlt`, missing
    cover file, unknown service, unknown key, `updated` before `date`;
  - cross-post: duplicate slug, duplicate series part, conflicting series metadata, name/slug
    mismatch, both layouts for one slug;
  - pipeline: leading H1 stripped, second H1 rejected, raw HTML dropped, external link attrs,
    heading ids, TOC, reading time;
  - images: URL rewrite, dimensions, missing alt rejected, missing file rejected, SVG → `<img>`,
    remote URL rejected;
  - series derivation with a gap (part 1 and 3 present, 2 absent); `relatedPosts` ranking;
  - feed and `.md` alternate output; drafts excluded when `NODE_ENV=production`.
- **Playwright:** `/blog`, a post and a series page render with JavaScript disabled; images
  load; visual snapshots at 375 / 768 / 1280.
- **Definition of done:** unchanged from spec 1 — `npm test` → `npm run lint` →
  `npm run build` → `npm run e2e`.

## 7. First content

No export is ready yet. The build ships with one sample post marked `draft: true`, which
exercises the templates in dev and never reaches production. Until the first real post is
committed, production has an empty `/blog`; therefore the `Blog` nav link, the feed
autodiscovery link and the `/blog` sitemap entry are emitted only when at least one published
post exists, and `/blog` renders an empty state marked `noindex` (the SEO gate treats a
`noindex` page as deliberately unlisted). Static export refuses a dynamic route that generates
zero pages, so with no posts — or no series — the route emits a `__placeholder__` param that
renders `notFound()`, and a post-build script deletes the resulting files. The first real post turns the
section on with no code change.

## 8. Publishing workflow (documented in `CLAUDE.md`)

1. Export from content-engine.
2. Drop `<slug>.md` into `content/blog/`, or unzip the bundle there.
3. Optionally add `services`, `cover` + `coverAlt` (put the cover in `<slug>/images/`).
4. `npm run build` — validates every post and runs the gate.
5. Commit and push; Netlify builds and deploys.

## Distribution (decided, not built here)

Every post is bylined to Brian on the site. Whether a post is *shared* from Brian's personal
LinkedIn profile or from the company page is decided per post, by its content, at share time.
That choice belongs to content-engine (which knows the post's audience and category) as a future
distribution feature. The site carries no signal for it: no front-matter key, no per-post author
switch.

## Risks

| Risk | Mitigation |
|---|---|
| Netlify Image CDN behaves differently from the dev passthrough | Verify on the deploy preview with the fixture bundle before the first real post |
| `out/blog/<slug>.html` beside `out/blog/<slug>/images/` confuses Netlify pretty URLs | Same file-beside-directory shape spec 1 already ships for `/services/automated-workflows`; confirm on the deploy preview |
| Engine adds a front-matter key and the strict schema fails the build | Intended: the failure names the key; adding it is a one-line change |
| Agent-written markdown contains raw HTML or an unsafe SVG | Raw HTML dropped in the pipeline; SVG only ever rendered via `<img>` |
| Header wraps to an extra row on phones | Accepted; removed by spec 3 |
