# IA Refactor — Offers and Proof — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Restructure the site into offers (three services) and proof (nine demos, the blog): a `Services ▾ · Demos · Blog` header with a real mobile menu, a `/demos` index, demo and writing strips on the home page, and related posts on the service pages.

**Architecture:** `src/data/services.ts` and `src/data/workflows.ts` stay the sources of truth; the header, footer, home strips and `/demos` all read from them. The header remains a server component with one client island, `HeaderMenu`, which owns open/closed state; every link is in the server HTML. `DemoCard` reuses each workflow's existing static showcase snippet, so the new surfaces ship no demo JavaScript.

**Tech Stack:** as plans 1 and 2, plus `@axe-core/playwright`.

**Spec:** `docs/superpowers/specs/2026-09-20-ia-refactor-design.md`

**Prerequisite:** plans `2026-09-20-next-migration.md` and `2026-09-20-blog.md` are complete and merged. This plan uses, by name: `publishedServices`, `servicePath`, `Service`; `workflows`, `PublishedWorkflow`, `workflowPath`, `workflowDemoPath`; `showcaseRegistry`, `ShowcaseFrame`; `pageRoutes`, `demoWorkflows`, `publishedWorkflows`; `pageMetadata`, `absoluteUrl`; `ogCards`; `buildLlmsTxt`; `getPosts`, `hasPosts`, `postsForService`; `PostGrid`; `BLOG_PATH`; `JsonLd`; `AwFinalCta`; `CALENDLY_URL`.

## Global Constraints

- **Git is read-only for the agent.** Every "Commit" step means: print the exact commands and ask Brian to run them. Branch: `ia-refactor` (Brian creates it).
- `npm`, Node 22. Definition of done for every task: `npm test` → `npm run lint` → `npm run build` → `npm run e2e`.
- **No demo URL moves.** `/demos` is new; the nine `/demos/<old-slug>` 301s in `netlify.toml` are untouched.
- New copy is limited to: the `/demos` page intro, the two home strip headings, "Related writing", and menu/footer labels. No service-page copy changes.
- `HeaderMenu` is the **only** new client component. Every nav destination must be a real `<a href>` in the server-rendered HTML.
- Vanilla CSS with the `index.css` custom properties; paired `.tsx` + `.css`; breakpoints 768px and 968px.
- The e2e build renders the fixture posts (`BLOG_CONTENT_DIR=e2e/fixtures/blog`, set in `playwright.config.ts` by plan 2), so the Blog link and writing strip are present in every e2e run.
- **Visual baselines change on purpose in this plan.** Until Task 7, run the functional suites only — `npx playwright test --grep-invert "visual:"` — and treat that as the `e2e` gate. Task 7 reviews the diffs and re-baselines.
- Markdown docs created or edited are copied to `/Users/brian/Documents/dev-vault/projects/paradigm/consulting-website/<same relative path>`.

## Deviations from the spec (decided at plan time, spec updated to match)

1. **No `order` field on `Service`.** The array order in `services.ts` already is the display order (plan 1 tests it); a second ordering would be a way to disagree with it.
2. **The "writing strip absent without posts" case is checked on a default-content build with `grep`,** not in Playwright: the e2e build always has fixture posts, and a second Playwright build just for one absence check is not worth its runtime.
3. **The showcase shot inside a `DemoCard` is `inert`.** Snippets are static mock UI and contain mock `<button>`s; `inert` keeps them out of the tab order and the accessibility tree, which a bare `aria-hidden` would not.
4. **CSS budget:** plan 1 already ships all nine demo stylesheets on every workflow page (static showcase imports), so `/demos` adds no new CSS cost. Task 7 measures it; the spec's lighter-card fallback is only built if the measured page CSS exceeds 30 KB gzipped.

## File Structure

| File | Responsibility |
|---|---|
| `src/data/services.ts` | + `navLabel` |
| `src/data/workflows.ts` | + `featuredDemoSlugs` |
| `src/data/workflowPaths.ts` | + `DEMOS_PATH` |
| `src/components/demos/DemoCard.tsx`, `DemoCard.css` | One demo: showcase shot, icon, label, summary, two links |
| `src/app/(site)/demos/page.tsx` | The `/demos` index |
| `src/components/HeaderMenu.tsx` | Client island: mobile toggle + Services disclosure |
| `src/components/Header.tsx`, `Header.css` | Server header; passes plain data to `HeaderMenu` |
| `src/components/Footer.tsx`, `Footer.css` | Grouped footer |
| `src/components/home/DemoStrip.tsx`, `LatestPosts.tsx` | Home page proof strips (styles in `Home.css`) |
| `src/components/blog/RelatedPosts.tsx` | "Related writing" on a service page |
| `e2e/nav.spec.ts`, `e2e/demos-index.spec.ts`, `e2e/home.spec.ts` | New e2e suites |

---

### Task 1: Data — `navLabel`, featured demos, `DEMOS_PATH`

**Files:**
- Modify: `src/data/services.ts`, `src/data/workflows.ts`, `src/data/workflowPaths.ts`, `src/data/data.test.ts`

**Interfaces:**
- Produces: `Service.navLabel: string`; `featuredDemoSlugs: string[]` (from `workflows.ts`); `featuredDemos(): PublishedWorkflow[]` (from `src/lib/routes.ts`); `DEMOS_PATH = "/demos"`.

- [ ] **Step 1: Failing tests** — append to `src/data/data.test.ts`

```ts
import { featuredDemoSlugs } from "./workflows";
import { featuredDemos } from "../lib/routes";

describe("navigation data", () => {
  it("gives every service a short, unique nav label", () => {
    const labels = publishedServices.map((s) => s.navLabel);
    expect(labels).toEqual(["Automations", "AI Integration", "Consulting"]);
  });
});

describe("featured demos", () => {
  it("features four demos, each published and with a demo, in the listed order", () => {
    expect(featuredDemoSlugs).toHaveLength(4);
    expect(new Set(featuredDemoSlugs).size).toBe(4);
    expect(featuredDemos().map((w) => w.slug)).toEqual(featuredDemoSlugs);
    for (const w of featuredDemos()) expect(w.hasDemo).toBe(true);
  });
});
```

(Merge the two imports into the file's existing import lines.) Run: `npm test` — expected: FAIL.

- [ ] **Step 2: Implement**

`src/data/services.ts` — add `navLabel: string; // header and footer` to the `Service` interface after `label`, and to the three objects: `navLabel: "Automations"`, `navLabel: "AI Integration"`, `navLabel: "Consulting"` (the labels the header uses today).

`src/data/workflowPaths.ts` — append:

```ts
/** The demos index. The nine legacy /demos/<old-slug> URLs 301 elsewhere (netlify.toml). */
export const DEMOS_PATH = "/demos";
```

`src/data/workflows.ts` — append after the `workflows` array:

```ts
/**
 * The demos shown on the home page, in order. Chosen because the AI is most
 * visibly doing something, which reads for founders and product teams as well as
 * trades owners. `data.test.ts` checks each is published and has a demo.
 */
export const featuredDemoSlugs: string[] = [
  "missed-call-text-back",
  "automated-quoting",
  "weekly-owner-reports",
  "review-generation",
];
```

and re-export the new constant beside the existing path re-export:

```ts
export { DEMOS_PATH, workflowPath, workflowDemoPath } from "./workflowPaths";
```

`src/lib/routes.ts` — add (import `featuredDemoSlugs` from `../data/workflows`):

```ts
/** Featured demos in `featuredDemoSlugs` order. Unknown or demo-less slugs are dropped — and fail data.test.ts. */
export const featuredDemos = (): PublishedWorkflow[] =>
  featuredDemoSlugs
    .map((slug) => demoWorkflows().find((w) => w.slug === slug))
    .filter((w): w is PublishedWorkflow => w !== undefined);
```

- [ ] **Step 3: Run, gate, commit (print for Brian)**

Run: `npm test && npm run lint && npm run build`

```bash
git add -A
git commit -m "feat: nav labels, featured demos and DEMOS_PATH"
```

---

### Task 2: `DemoCard` and the `/demos` index

**Files:**
- Create: `src/components/demos/DemoCard.tsx`, `src/components/demos/DemoCard.css`, `src/app/(site)/demos/page.tsx`, `e2e/demos-index.spec.ts`
- Modify: `src/lib/seo.ts`, `src/lib/seo.test.ts`, `src/lib/routes.ts`, `src/lib/routes.test.ts`, `src/lib/og.ts`, `src/lib/llms.ts`, `src/lib/llms.test.ts`, `e2e/seo.spec.ts`, `netlify.toml`

**Interfaces:**
- Consumes: Task 1.
- Produces: `DemoCard { workflow: PublishedWorkflow; headingLevel: 2 | 3 }`; `DEMOS_META = { title, description }` and `demosJsonLd(demos: PublishedWorkflow[])` in `src/lib/seo.ts`; `/demos` in `pageRoutes()`.

- [ ] **Step 1: Failing unit tests**

Append to the JSON-LD describe block in `src/lib/seo.test.ts` (import `demosJsonLd`, `DEMOS_META` from `./seo` and `demoWorkflows` from `./routes`):

```ts
  it("lists every demo on the demos index", () => {
    const data = demosJsonLd(demoWorkflows());
    expect(data).toMatchObject({
      "@type": "CollectionPage",
      url: "https://paradigmshiftdev.io/demos",
      mainEntity: { "@type": "ItemList", numberOfItems: 9 },
    });
    const items = (data.mainEntity as { itemListElement: { position: number; url: string }[] })
      .itemListElement;
    expect(items[0]).toMatchObject({
      position: 1,
      url: "https://paradigmshiftdev.io/services/automated-workflows/win-back-campaigns/demo",
    });
    expect(DEMOS_META.description.length).toBeLessThanOrEqual(160);
  });
```

In `src/lib/routes.test.ts`: the page-route count becomes `14` and the non-blog `allRoutes()` count `23`; add `expect(routes).toContain("/demos");`.
In `src/lib/llms.test.ts`: `section("Interactive demos")` becomes `toHaveLength(10)` (the index link plus nine demos).

Run: `npm test` — expected: FAIL.

- [ ] **Step 2: Implement the lib changes**

`src/lib/seo.ts` — import `DEMOS_PATH` from `../data/workflowPaths` and add:

```ts
export const DEMOS_META = {
  title: "Interactive Demos: AI Automations You Can Click Through",
  description:
    "Nine working AI automation demos on made-up businesses: missed-call text-back, quoting, invoicing, reviews, dispatch and more. Click through every step.",
};

export const demosJsonLd = (demos: PublishedWorkflow[]): JsonLd => ({
  "@context": CONTEXT,
  "@type": "CollectionPage",
  name: DEMOS_META.title,
  description: DEMOS_META.description,
  url: absoluteUrl(DEMOS_PATH),
  mainEntity: {
    "@type": "ItemList",
    numberOfItems: demos.length,
    itemListElement: demos.map((w, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: `${w.label} demo`,
      url: absoluteUrl(workflowDemoPath(w.slug)),
    })),
  },
});
```

`src/lib/routes.ts` — in `pageRoutes()`, add `DEMOS_PATH` after the service routes (import it from `../data/workflowPaths`):

```ts
export const pageRoutes = (): string[] => [
  "/",
  ...publishedServices.map((s) => servicePath(s.slug)),
  DEMOS_PATH,
  ...publishedWorkflows().map((w) => workflowPath(w.slug)),
];
```

`src/lib/og.ts` — add after the services spread (import `DEMOS_PATH`):

```ts
    card(DEMOS_PATH, "Proof, not promises", "Working demos you can click through"),
```

`src/lib/llms.ts` — make the index the first line of the "Interactive demos" section (import `DEMOS_PATH`):

```ts
      link("All demos", DEMOS_PATH, "Every working demo on one page."),
```

Run: `npm test` — expected: PASS.

- [ ] **Step 3: `DemoCard`**

`src/components/demos/DemoCard.tsx`:

```tsx
import Link from "next/link";
import { createElement } from "react";
import { workflowDemoPath, workflowPath } from "../../data/workflowPaths";
import type { PublishedWorkflow } from "../../data/workflows";
import ShowcaseFrame from "../../showcases/ShowcaseFrame";
import { showcaseRegistry } from "../../showcases/registry";
import "./DemoCard.css";

interface DemoCardProps {
  workflow: PublishedWorkflow;
  headingLevel: 2 | 3;
}

const DemoCard = ({ workflow, headingLevel }: DemoCardProps) => {
  const Icon = workflow.icon;
  const Heading = headingLevel === 2 ? "h2" : "h3";
  const Showcase = showcaseRegistry[workflow.slug];
  return (
    <article className="demo-card">
      {/* Static mock UI with mock buttons: inert keeps it out of the tab order
          and the accessibility tree. ShowcaseFrame adds the "Illustrative" tag. */}
      <div className="demo-card-shot" inert>
        <ShowcaseFrame>
          {createElement(Showcase, { snippet: workflow.showcase.heroSnippet })}
        </ShowcaseFrame>
      </div>
      <div className="demo-card-body">
        <div className="demo-card-icon">
          <Icon />
        </div>
        <Heading className="demo-card-title">{workflow.label}</Heading>
        <p className="demo-card-summary">{workflow.cardSummary}</p>
        <div className="demo-card-actions">
          <Link href={workflowDemoPath(workflow.slug)} className="demo-card-primary">
            Try the demo →
          </Link>
          <Link href={workflowPath(workflow.slug)} className="demo-card-secondary">
            How it works
          </Link>
        </div>
      </div>
    </article>
  );
};

export default DemoCard;
```

`src/components/demos/DemoCard.css`:

```css
.demo-card {
  display: flex;
  flex-direction: column;
  background: var(--color-bg);
  border: 1px solid var(--color-border);
  border-radius: 12px;
  overflow: hidden;
  box-shadow: var(--shadow-sm);
}

/* The snippet is a full product shot; the card shows its top, faded out. */
.demo-card-shot {
  position: relative;
  max-height: 240px;
  overflow: hidden;
  padding: var(--spacing-sm) var(--spacing-sm) 0;
  background: var(--color-bg-light);
  pointer-events: none;
}

.demo-card-shot::after {
  content: "";
  position: absolute;
  inset: auto 0 0 0;
  height: 56px;
  background: linear-gradient(180deg, transparent, var(--color-bg-light));
}

.demo-card-body {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
  padding: var(--spacing-sm);
  flex: 1;
}

.demo-card-icon {
  font-size: 1.25rem;
  color: var(--color-primary);
}

.demo-card-title {
  font-size: 1.125rem;
  line-height: 1.3;
  color: var(--color-text);
}

.demo-card-summary {
  color: var(--color-text-light);
  line-height: 1.5;
  flex: 1;
}

.demo-card-actions {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--spacing-sm);
  margin-top: var(--spacing-xs);
}

.demo-card-primary {
  padding: 0.5rem 0.9rem;
  border-radius: 0.5rem;
  background: var(--gradient-accent);
  color: var(--btn-ink);
  font-weight: 600;
  font-size: 0.9rem;
}

.demo-card-primary:hover {
  filter: brightness(1.08);
  color: var(--btn-ink);
}

.demo-card-secondary {
  color: var(--color-primary);
  font-weight: 600;
  font-size: 0.9rem;
}

.demo-grid {
  display: grid;
  gap: var(--spacing-md);
  grid-template-columns: 1fr;
}

@media (min-width: 768px) {
  .demo-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 968px) {
  .demo-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}
```

- [ ] **Step 4: The page — `src/app/(site)/demos/page.tsx`**

The intro adapts the automations page's existing proof copy, so the two pages say the same thing.

```tsx
import JsonLd from "@/components/JsonLd";
import DemoCard from "@/components/demos/DemoCard";
import AwFinalCta from "@/components/workflows/AwFinalCta";
import { DEMOS_PATH } from "@/data/workflowPaths";
import { demoWorkflows } from "@/lib/routes";
import { DEMOS_META, demosJsonLd, pageMetadata } from "@/lib/seo";
import "@/components/shared-sections.css";
import "@/components/blog/blog.css";

export const metadata = pageMetadata({ ...DEMOS_META, path: DEMOS_PATH });

export default function Page() {
  const demos = demoWorkflows();
  return (
    <>
      <section className="blog-page">
        <div className="container">
          <header className="blog-header blog-narrow">
            <p className="wf-eyebrow">Proof, not promises</p>
            <h1 className="blog-title">Working demos you can click through</h1>
            <p className="blog-intro">
              Most "AI automation" is a slideshow. Each of these is a working
              click-through on a made-up business, so you can see exactly what
              happens at each step before you commit to anything.
            </p>
          </header>
          <div className="demo-grid">
            {demos.map((workflow) => (
              <DemoCard key={workflow.slug} workflow={workflow} headingLevel={2} />
            ))}
          </div>
        </div>
      </section>
      <AwFinalCta />
      <JsonLd data={demosJsonLd(demos)} />
    </>
  );
}
```

(`blog.css` is reused for the page header classes `blog-page`, `blog-header`, `blog-narrow`, `blog-title`, `blog-intro` — they are generic page-header styles, not blog-specific.)

- [ ] **Step 5: `netlify.toml`** — replace the comment above the nine redirects with

```toml
# /demos itself is a real page (the demos index). The rules below are the nine
# LEGACY demo URLs, whose old slugs differ from every current route, 301ing to
# each demo's home under its service page. Every other URL is a real file in
# out/, so there is no SPA catch-all, and unknown URLs get out/404.html.
```

- [ ] **Step 6: e2e — `e2e/demos-index.spec.ts`**

```ts
import { test, expect } from "@playwright/test";

test.skip(({ viewport }) => viewport?.width !== 1280, "desktop project only");

test("the demos index shows nine cards whose links all resolve", async ({ page, request }) => {
  await page.goto("/demos");
  await expect(page.locator("h1")).toHaveText("Working demos you can click through");
  const cards = page.locator(".demo-card");
  await expect(cards).toHaveCount(9);

  const hrefs = await page.locator(".demo-card-actions a").evaluateAll((links) =>
    links.map((a) => (a as HTMLAnchorElement).getAttribute("href") ?? ""),
  );
  expect(hrefs).toHaveLength(18);
  for (const href of hrefs) {
    expect((await request.get(href)).status(), href).toBe(200);
  }
});

test("a card's mock UI cannot be focused", async ({ page }) => {
  await page.goto("/demos");
  const focusable = await page
    .locator(".demo-card-shot")
    .first()
    .evaluate((shot) => shot.matches("[inert]"));
  expect(focusable).toBe(true);
});

test("Try the demo opens the demo", async ({ page }) => {
  await page.goto("/demos");
  await page.locator(".demo-card").first().getByRole("link", { name: "Try the demo →" }).click();
  await expect(page.locator("h1.demo-title")).toBeVisible();
});
```

In `e2e/seo.spec.ts`, add to the "structured data by page type" test:

```ts
  expect(await typesOn("/demos")).toEqual(["CollectionPage", "Organization", "WebSite"]);
```

- [ ] **Step 7: Build, look, gate**

```bash
npm test && npm run lint && npm run build          # SEO gate: 23 pages OK
npx playwright test --grep-invert "visual:"
npm run preview &                                   # then open http://localhost:4173/demos
```

Look at `/demos` at 375, 768 and 1280px. Each card must show a recognisable slice of its product shot with the "Illustrative" tag visible; if a snippet is cropped to nothing useful, raise `.demo-card-shot { max-height }` — do not rescale snippets with `transform`, which blurs text. Stop the preview server afterwards.

- [ ] **Step 8: Commit (print for Brian)**

```bash
git add -A
git commit -m "feat: /demos index and DemoCard"
```

---

### Task 3: The header — `Services ▾ · Demos · Blog` and a real mobile menu

**Files:**
- Create: `src/components/HeaderMenu.tsx`, `e2e/nav.spec.ts`
- Modify: `src/components/Header.tsx`, `src/components/Header.css`, `package.json`

**Interfaces:**
- Produces: `HeaderMenu { services: MenuService[]; demosHref: string; blogHref: string | null; calendlyUrl: string }`, `MenuService = { href: string; label: string; eyebrow: string }`. Stable hooks for tests: `#site-nav-list`, `#site-nav-services`, `.site-nav-toggle`, `.site-nav-services-toggle`.

- [ ] **Step 1: Install axe**

```bash
npm install -D @axe-core/playwright@^4
```

- [ ] **Step 2: Failing e2e — `e2e/nav.spec.ts`**

```ts
import AxeBuilder from "@axe-core/playwright";
import { test, expect } from "@playwright/test";

const SERVICE_HREFS = [
  "/services/automated-workflows",
  "/services/ai-integration",
  "/services/technical-consulting",
];

test.describe("desktop", () => {
  test.skip(({ viewport }) => viewport?.width !== 1280, "desktop project only");

  test("the Services menu works by keyboard", async ({ page }) => {
    await page.goto("/");
    const toggle = page.locator(".site-nav-services-toggle");
    const menu = page.locator("#site-nav-services");
    await expect(menu).toBeHidden();

    await toggle.focus();
    await page.keyboard.press("Enter");
    await expect(toggle).toHaveAttribute("aria-expanded", "true");
    await expect(menu).toBeVisible();

    await page.keyboard.press("Tab");
    await expect(menu.getByRole("link").first()).toBeFocused();

    await page.keyboard.press("Escape");
    await expect(menu).toBeHidden();
    await expect(toggle).toBeFocused();
  });

  test("the menu closes on outside click, on tabbing away, and on navigation", async ({ page }) => {
    await page.goto("/");
    const toggle = page.locator(".site-nav-services-toggle");
    const menu = page.locator("#site-nav-services");

    await toggle.click();
    await page.locator("h1").click();
    await expect(menu).toBeHidden();

    await toggle.click();
    for (let i = 0; i < 4; i++) await page.keyboard.press("Tab"); // past the three links
    await expect(menu).toBeHidden();

    await toggle.click();
    await menu.getByRole("link", { name: /AI Integration/ }).click();
    await expect(page).toHaveURL(/\/services\/ai-integration$/);
    await expect(menu).toBeHidden();
  });

  test("Demos and Blog are top-level links", async ({ page }) => {
    await page.goto("/");
    const nav = page.getByRole("navigation", { name: "Main" });
    await nav.getByRole("link", { name: "Demos" }).click();
    await expect(page).toHaveURL(/\/demos$/);
    await nav.getByRole("link", { name: "Blog" }).click();
    await expect(page).toHaveURL(/\/blog$/);
  });

  test("the header has no accessibility violations, closed or open", async ({ page }) => {
    await page.goto("/");
    expect((await new AxeBuilder({ page }).include("header").analyze()).violations).toEqual([]);
    await page.locator(".site-nav-services-toggle").click();
    expect((await new AxeBuilder({ page }).include("header").analyze()).violations).toEqual([]);
  });
});

test.describe("mobile", () => {
  test.skip(({ viewport }) => viewport?.width !== 375, "mobile project only");

  test("the hamburger opens a panel with every destination, services listed inline", async ({ page }) => {
    await page.goto("/");
    const toggle = page.locator(".site-nav-toggle");
    const list = page.locator("#site-nav-list");
    await expect(list).toBeHidden();
    await expect(toggle).toHaveAttribute("aria-expanded", "false");

    await toggle.click();
    await expect(list).toBeVisible();
    await expect(page.locator(".site-nav-services-toggle")).toBeHidden(); // no nested disclosure
    for (const href of [...SERVICE_HREFS, "/demos", "/blog"]) {
      await expect(list.locator(`a[href="${href}"]`)).toBeVisible();
    }
    await expect(list.getByRole("link", { name: /Book a call/ })).toBeVisible();

    expect((await new AxeBuilder({ page }).include("header").analyze()).violations).toEqual([]);

    await list.locator('a[href="/demos"]').click();
    await expect(page).toHaveURL(/\/demos$/);
    await expect(list).toBeHidden();
  });

  test("Escape closes the panel and returns focus to the hamburger", async ({ page }) => {
    await page.goto("/");
    const toggle = page.locator(".site-nav-toggle");
    await toggle.click();
    await page.keyboard.press("Escape");
    await expect(page.locator("#site-nav-list")).toBeHidden();
    await expect(toggle).toBeFocused();
  });

  test("the header is a single row", async ({ page }) => {
    await page.goto("/");
    const box = await page.locator(".site-header-inner").boundingBox();
    expect(box?.height).toBeLessThanOrEqual(64);
  });
});

test.describe("without JavaScript", () => {
  test.skip(({ viewport }) => viewport?.width !== 1280, "desktop project only");
  test.use({ javaScriptEnabled: false });

  test("every destination is a visible link in the HTML", async ({ page }) => {
    await page.goto("/");
    for (const href of [...SERVICE_HREFS, "/demos", "/blog"]) {
      await expect(page.locator(`header a[href="${href}"]`)).toBeVisible();
    }
  });
});
```

Run: `npx playwright test e2e/nav.spec.ts` — expected: FAIL.

- [ ] **Step 3: `src/components/HeaderMenu.tsx`**

```tsx
"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import type { FocusEvent, KeyboardEvent } from "react";
import { FaBars, FaCalendarAlt, FaChevronDown, FaTimes } from "react-icons/fa";

export interface MenuService {
  href: string;
  label: string;
  eyebrow: string;
}

interface HeaderMenuProps {
  services: MenuService[];
  demosHref: string;
  /** null until the blog has a published post. */
  blogHref: string | null;
  calendlyUrl: string;
}

/**
 * The header's only client code. Two disclosures share one nav:
 *  - below 768px, a hamburger reveals the whole list, with services inline;
 *  - from 768px, the list is always visible and "Services" opens a dropdown.
 * Which one applies is decided in Header.css, not here.
 */
const HeaderMenu = ({ services, demosHref, blogHref, calendlyUrl }: HeaderMenuProps) => {
  const [navOpen, setNavOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const navRef = useRef<HTMLElement>(null);
  const navToggleRef = useRef<HTMLButtonElement>(null);
  const servicesToggleRef = useRef<HTMLButtonElement>(null);

  const closeAll = () => {
    setNavOpen(false);
    setServicesOpen(false);
  };

  useEffect(() => {
    const onPointerDown = (event: PointerEvent) => {
      if (navRef.current?.contains(event.target as Node)) return;
      setNavOpen(false);
      setServicesOpen(false);
    };
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, []);

  const onKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    if (event.key !== "Escape") return;
    if (servicesOpen) {
      setServicesOpen(false);
      servicesToggleRef.current?.focus();
    } else if (navOpen) {
      setNavOpen(false);
      navToggleRef.current?.focus();
    }
  };

  const onServicesBlur = (event: FocusEvent<HTMLLIElement>) => {
    if (!event.currentTarget.contains(event.relatedTarget)) setServicesOpen(false);
  };

  return (
    <nav
      ref={navRef}
      className="site-nav"
      aria-label="Main"
      data-open={navOpen}
      onKeyDown={onKeyDown}
    >
      <button
        ref={navToggleRef}
        type="button"
        className="site-nav-toggle"
        aria-expanded={navOpen}
        aria-controls="site-nav-list"
        aria-label={navOpen ? "Close menu" : "Open menu"}
        onClick={() => setNavOpen((open) => !open)}
      >
        {navOpen ? <FaTimes aria-hidden="true" /> : <FaBars aria-hidden="true" />}
      </button>

      <ul id="site-nav-list" className="site-nav-list">
        <li className="site-nav-services" data-open={servicesOpen} onBlur={onServicesBlur}>
          <button
            ref={servicesToggleRef}
            type="button"
            className="site-header-link site-nav-services-toggle"
            aria-expanded={servicesOpen}
            aria-controls="site-nav-services"
            onClick={() => setServicesOpen((open) => !open)}
          >
            Services
            <FaChevronDown className="site-nav-chevron" aria-hidden="true" />
          </button>
          <p className="site-nav-group-label">Services</p>
          <ul id="site-nav-services" className="site-nav-submenu">
            {services.map((service) => (
              <li key={service.href}>
                <Link href={service.href} className="site-nav-sublink" onClick={closeAll}>
                  <span className="site-nav-sublink-label">{service.label}</span>
                  <span className="site-nav-sublink-for">{service.eyebrow}</span>
                </Link>
              </li>
            ))}
          </ul>
        </li>
        <li>
          <Link href={demosHref} className="site-header-link" onClick={closeAll}>
            Demos
          </Link>
        </li>
        {blogHref && (
          <li>
            <Link href={blogHref} className="site-header-link" onClick={closeAll}>
              Blog
            </Link>
          </li>
        )}
        <li>
          <a
            href={calendlyUrl}
            className="site-header-cta"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaCalendarAlt className="site-header-cta-icon" aria-hidden="true" />
            Book a call
          </a>
        </li>
      </ul>
    </nav>
  );
};

export default HeaderMenu;
```

- [ ] **Step 4: `src/components/Header.tsx`** (replace the file)

```tsx
import Link from "next/link";
import { HiLightBulb } from "react-icons/hi";
import { publishedServices, servicePath } from "../data/services";
import { CALENDLY_URL } from "../data/site";
import { DEMOS_PATH } from "../data/workflowPaths";
import { BLOG_PATH } from "../lib/blog/paths";
import { hasPosts } from "../lib/blog/posts";
import HeaderMenu from "./HeaderMenu";
import "./Header.css";

/**
 * Without JavaScript nothing can toggle, so everything is simply shown. Crawlers
 * do not need this — every link is in the HTML either way — people do.
 */
const NO_JS_CSS = `
.site-nav-toggle,.site-nav-services-toggle{display:none!important}
.site-nav-list{display:flex!important;position:static!important;flex-wrap:wrap;box-shadow:none!important;border:0!important;padding:0!important}
.site-nav-submenu{display:flex!important;position:static!important;flex-wrap:wrap;gap:1rem;box-shadow:none!important;border:0!important;padding:0!important;min-width:0!important}
.site-nav-sublink-for{display:none!important}
.site-header-inner{height:auto!important;flex-wrap:wrap;padding-top:.5rem;padding-bottom:.5rem}
`;

const Header = () => {
  return (
    <header className="site-header">
      <noscript>
        <style>{NO_JS_CSS}</style>
      </noscript>
      <div className="container site-header-inner">
        <Link href="/" className="site-header-brand">
          <HiLightBulb className="site-header-brand-icon" />
          <span className="site-header-brand-text">Paradigm Shift</span>
        </Link>
        <HeaderMenu
          services={publishedServices.map((service) => ({
            href: servicePath(service.slug),
            label: service.navLabel,
            eyebrow: service.eyebrow,
          }))}
          demosHref={DEMOS_PATH}
          blogHref={hasPosts() ? BLOG_PATH : null}
          calendlyUrl={CALENDLY_URL}
        />
      </div>
    </header>
  );
};

export default Header;
```

Only plain strings cross into the client component — no functions, no icons.

- [ ] **Step 5: `src/components/Header.css`** (replace the file)

```css
.site-header {
  position: sticky;
  top: 0;
  z-index: 100;
  background: var(--color-bg);
  border-bottom: 1px solid var(--color-border);
}

.site-header-inner {
  position: relative; /* anchors the mobile panel */
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 4rem;
}

.site-header-brand {
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-xs);
  color: var(--color-text);
  font-weight: 700;
}

.site-header-brand:hover {
  color: var(--color-primary);
}

.site-header-brand-icon {
  font-size: 1.5rem;
  color: var(--color-primary);
}

.site-header-brand-text {
  font-size: 1.125rem;
}

.site-header-link {
  color: var(--color-text-light);
  font-weight: 600;
  font-size: 0.95rem;
}

.site-header-link:hover {
  color: var(--color-primary);
}

.site-header-cta {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-xs);
  background: var(--gradient-accent);
  color: var(--btn-ink);
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  font-weight: 600;
  font-size: 0.95rem;
}

.site-header-cta:hover {
  filter: brightness(1.08);
  color: var(--btn-ink);
}

.site-header-cta-icon {
  font-size: 0.9rem;
}

.site-nav-list,
.site-nav-submenu {
  list-style: none;
}

.site-nav-services-toggle {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0;
  border: 0;
  background: none;
  font-family: inherit;
  cursor: pointer;
}

.site-nav-chevron {
  font-size: 0.7rem;
}

.site-nav-services[data-open="true"] .site-nav-chevron {
  transform: rotate(180deg);
}

.site-nav-sublink {
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
  padding: 0.6rem 0.75rem;
  border-radius: 0.5rem;
}

.site-nav-sublink:hover {
  background: var(--primary-soft-2);
}

.site-nav-sublink-label {
  color: var(--color-text);
  font-weight: 600;
  font-size: 0.95rem;
}

.site-nav-sublink-for {
  color: var(--color-text-light);
  font-size: 0.8rem;
}

/* ---- Below 768px: hamburger → panel, services listed inline ---- */
.site-nav-toggle {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2.5rem;
  height: 2.5rem;
  border: 1px solid var(--color-border);
  border-radius: 0.5rem;
  background: var(--color-bg);
  color: var(--color-text);
  font-size: 1.1rem;
  cursor: pointer;
}

.site-nav-list {
  display: none;
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  flex-direction: column;
  gap: var(--spacing-sm);
  padding: var(--spacing-sm);
  background: var(--color-bg);
  border-bottom: 1px solid var(--color-border);
  box-shadow: var(--shadow-md);
}

.site-nav[data-open="true"] .site-nav-list {
  display: flex;
}

.site-nav-services-toggle {
  display: none;
}

.site-nav-group-label {
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--color-text-light);
  padding: 0 0.75rem;
}

/* ---- From 768px: inline list, Services dropdown ---- */
@media (min-width: 768px) {
  .site-nav-toggle,
  .site-nav-group-label {
    display: none;
  }

  .site-nav-list {
    display: flex;
    position: static;
    flex-direction: row;
    align-items: center;
    gap: var(--spacing-md);
    padding: 0;
    border: 0;
    box-shadow: none;
  }

  .site-nav-services {
    position: relative;
  }

  .site-nav-services-toggle {
    display: inline-flex;
  }

  .site-nav-submenu {
    display: none;
    position: absolute;
    top: calc(100% + 0.75rem);
    left: -0.75rem;
    min-width: 280px;
    padding: 0.5rem;
    background: var(--color-bg);
    border: 1px solid var(--color-border);
    border-radius: 0.75rem;
    box-shadow: var(--shadow-md);
  }

  .site-nav-services[data-open="true"] .site-nav-submenu {
    display: block;
  }
}
```

- [ ] **Step 6: Run the nav suite, then everything functional**

Run: `npx playwright test e2e/nav.spec.ts` — expected: PASS.
Run: `npm test && npm run lint && npm run build && npx playwright test --grep-invert "visual:"` — expected: PASS.

Likely failure modes: (a) "tabbing away" closes too early or not at all — the blur handler depends on `relatedTarget`, so the fourth Tab must land on the Demos link, outside the `<li>`; (b) axe `aria-valid-attr-value` on `aria-controls` if an id is misspelled; (c) the blog e2e "header links to the blog" from plan 2 still passes because the link's accessible name is unchanged.

- [ ] **Step 7: Commit (print for Brian)**

```bash
git add -A
git commit -m "feat: Services menu, Demos and Blog in the header, real mobile menu"
```

---

### Task 4: Grouped footer

**Files:**
- Modify: `src/components/Footer.tsx`, `src/components/Footer.css`, `e2e/nav.spec.ts`

- [ ] **Step 1: Failing e2e** — append to the `desktop` describe block in `e2e/nav.spec.ts`

```ts
  test("the footer groups services, proof and the call link", async ({ page }) => {
    await page.goto("/");
    const footer = page.getByRole("navigation", { name: "Footer" });
    const services = footer.locator(".footer-group").nth(0);
    await expect(services.locator(".footer-group-title")).toHaveText("Services");
    await expect(services.getByRole("link")).toHaveCount(3);
    const proof = footer.locator(".footer-group").nth(1);
    await expect(proof.locator(".footer-group-title")).toHaveText("Proof");
    await expect(proof.getByRole("link", { name: "Demos" })).toHaveAttribute("href", "/demos");
    await expect(proof.getByRole("link", { name: "Blog" })).toHaveAttribute("href", "/blog");
    await expect(footer.getByRole("link", { name: "Book a call" })).toBeVisible();
    expect((await new AxeBuilder({ page }).include("footer").analyze()).violations).toEqual([]);
  });
```

Run: `npx playwright test e2e/nav.spec.ts -g footer` — expected: FAIL.

- [ ] **Step 2: `src/components/Footer.tsx`** (replace the file)

```tsx
import Link from "next/link";
import { publishedServices, servicePath } from "../data/services";
import { CALENDLY_URL } from "../data/site";
import { DEMOS_PATH } from "../data/workflowPaths";
import { BLOG_PATH } from "../lib/blog/paths";
import { hasPosts } from "../lib/blog/posts";
import "./Footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <nav className="footer-groups" aria-label="Footer">
            <div className="footer-group">
              <p className="footer-group-title">Services</p>
              <ul>
                {publishedServices.map((service) => (
                  <li key={service.slug}>
                    <Link href={servicePath(service.slug)}>{service.name}</Link>
                  </li>
                ))}
              </ul>
            </div>
            <div className="footer-group">
              <p className="footer-group-title">Proof</p>
              <ul>
                <li>
                  <Link href={DEMOS_PATH}>Demos</Link>
                </li>
                {hasPosts() && (
                  <li>
                    <Link href={BLOG_PATH}>Blog</Link>
                  </li>
                )}
              </ul>
            </div>
            <div className="footer-group">
              <p className="footer-group-title">Get started</p>
              <ul>
                <li>
                  <a href={CALENDLY_URL} target="_blank" rel="noopener noreferrer">
                    Book a call
                  </a>
                </li>
              </ul>
            </div>
          </nav>
          <p className="footer-text">
            © {new Date().getFullYear()} Paradigm Shift Software Development, LLC
          </p>
          <p className="footer-tagline">
            AI-powered automation, built on the tools you already use.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
```

- [ ] **Step 3: `src/components/Footer.css`** — replace the three `.footer-links…` rules with

```css
.footer-groups {
  display: grid;
  grid-template-columns: repeat(3, auto);
  justify-content: center;
  gap: var(--spacing-md) var(--spacing-lg);
  margin-bottom: var(--spacing-md);
  text-align: left;
}

.footer-group ul {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.footer-group-title {
  /* Intentional: light-on-dark, see .footer above. */
  color: rgba(255, 255, 255, 0.55);
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  margin-bottom: 0.6rem;
}

.footer-group a {
  /* Intentional: light-on-dark footer links, see .footer above. */
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.9rem;
  font-weight: 600;
}

.footer-group a:hover {
  color: #ffffff;
}

@media (max-width: 640px) {
  .footer-groups {
    grid-template-columns: 1fr 1fr;
  }
}
```

- [ ] **Step 4: Run, gate, commit (print for Brian)**

Run: `npm test && npm run lint && npm run build && npx playwright test --grep-invert "visual:"`

If axe reports a color-contrast violation in the footer, raise the alpha of the failing rule until it passes (the existing `.footer-tagline` at 0.5 alpha is the likeliest offender; 0.6 on `#0b1220` passes AA).

```bash
git add -A
git commit -m "feat: grouped footer from services.ts"
```

---

### Task 5: Home page proof strips

**Files:**
- Create: `src/components/home/DemoStrip.tsx`, `src/components/home/LatestPosts.tsx`, `e2e/home.spec.ts`
- Modify: `src/components/Home.tsx`, `src/components/Home.css`

**Interfaces:**
- Consumes: `featuredDemos()`, `demoWorkflows()`, `DemoCard`, `getPosts()`, `PostGrid`, `DEMOS_PATH`, `BLOG_PATH`.

- [ ] **Step 1: Failing e2e — `e2e/home.spec.ts`**

```ts
import { test, expect } from "@playwright/test";

test("the home page shows four featured demos, in the featured order", async ({ page }) => {
  await page.goto("/");
  const strip = page.locator("#see-it-work");
  await expect(strip.getByRole("heading", { level: 2 })).toHaveText("See it work");
  await expect(strip.locator(".demo-card-title")).toHaveText([
    "Missed-Call Text-Back",
    "Automated Quoting",
    "Weekly Owner Reports",
    "Review Generation",
  ]);
  await strip.getByRole("link", { name: "See all nine demos →" }).click();
  await expect(page).toHaveURL(/\/demos$/);
});

test("the home page shows the three newest posts", async ({ page }) => {
  await page.goto("/");
  const strip = page.locator("#from-the-blog");
  await expect(strip.locator(".post-card-title")).toHaveText([
    "A Bundle Post With Images",
    "A Flat Post",
    "Series Part Three: Shipping",
  ]);
  await strip.getByRole("link", { name: "All posts →" }).click();
  await expect(page).toHaveURL(/\/blog$/);
});

test("proof sits between the sorter and the why/how sections", async ({ page }) => {
  await page.goto("/");
  const order = await page.locator("main > section, main > div").evaluateAll((nodes) =>
    nodes.map((n) => n.id || n.className.split(" ")[0]),
  );
  const at = (name: string) => order.indexOf(name);
  expect(at("home-sorter")).toBeLessThan(at("see-it-work"));
  expect(at("see-it-work")).toBeLessThan(at("from-the-blog"));
});

test("the strips never cause horizontal page scroll", async ({ page }) => {
  await page.goto("/");
  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
  );
  expect(overflow).toBeLessThanOrEqual(0);
});
```

If a workflow's `label` in `workflows.ts` differs from the four titles above, use the label from the data — the test documents the order, not the wording. Run: `npx playwright test e2e/home.spec.ts` — expected: FAIL.

- [ ] **Step 2: `src/components/home/DemoStrip.tsx`**

```tsx
import Link from "next/link";
import { DEMOS_PATH } from "../../data/workflowPaths";
import { demoWorkflows, featuredDemos } from "../../lib/routes";
import DemoCard from "../demos/DemoCard";

const NUMBER_WORDS = ["zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten", "eleven", "twelve"];

const DemoStrip = () => {
  const total = demoWorkflows().length;
  return (
    <section id="see-it-work" className="home-strip home-strip-alt">
      <div className="home-strip-head">
        <div>
          <p className="wf-eyebrow">Proof, not promises</p>
          <h2 className="home-strip-title">See it work</h2>
        </div>
        <Link href={DEMOS_PATH} className="home-strip-link">
          See all {NUMBER_WORDS[total] ?? total} demos →
        </Link>
      </div>
      <div className="home-strip-track home-strip-track-4">
        {featuredDemos().map((workflow) => (
          <DemoCard key={workflow.slug} workflow={workflow} headingLevel={3} />
        ))}
      </div>
    </section>
  );
};

export default DemoStrip;
```

- [ ] **Step 3: `src/components/home/LatestPosts.tsx`**

```tsx
import Link from "next/link";
import { BLOG_PATH } from "../../lib/blog/paths";
import { getPosts } from "../../lib/blog/posts";
import PostCard from "../blog/PostCard";
import "../blog/blog.css";

/** Omitted entirely until the blog has a published post. */
const LatestPosts = () => {
  const posts = getPosts().slice(0, 3);
  if (posts.length === 0) return null;
  return (
    <section id="from-the-blog" className="home-strip">
      <div className="home-strip-head">
        <div>
          <p className="wf-eyebrow">Writing</p>
          <h2 className="home-strip-title">From the blog</h2>
        </div>
        <Link href={BLOG_PATH} className="home-strip-link">
          All posts →
        </Link>
      </div>
      <div className="home-strip-track home-strip-track-3">
        {posts.map((post) => (
          <PostCard key={post.slug} post={post} headingLevel={3} />
        ))}
      </div>
    </section>
  );
};

export default LatestPosts;
```

- [ ] **Step 4: `src/components/Home.tsx`** — import both and place them after the sorter section

```tsx
import DemoStrip from "./home/DemoStrip";
import LatestPosts from "./home/LatestPosts";
```

```tsx
      </section>

      <DemoStrip />
      <LatestPosts />

      <AwWhyWorkWithMe />
```

- [ ] **Step 5: `src/components/Home.css`** — append

```css
/* ---- Proof strips ---- */
.home-strip {
  padding: var(--spacing-lg) var(--spacing-sm);
}

.home-strip-alt {
  background: var(--color-bg-light);
}

.home-strip-head,
.home-strip-track {
  max-width: var(--max-width);
  margin-left: auto;
  margin-right: auto;
}

.home-strip-head {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-end;
  justify-content: space-between;
  gap: var(--spacing-sm);
  margin-bottom: var(--spacing-md);
}

.home-strip-title {
  font-size: clamp(1.5rem, 3vw, 2rem);
  color: var(--color-text);
}

.home-strip-link {
  color: var(--color-primary);
  font-weight: 600;
}

/* Below 768px the cards scroll sideways instead of stacking seven cards deep. */
.home-strip-track {
  display: flex;
  gap: var(--spacing-sm);
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  padding-bottom: var(--spacing-xs);
}

.home-strip-track > * {
  flex: 0 0 85%;
  scroll-snap-align: start;
}

@media (min-width: 768px) {
  .home-strip-track {
    display: grid;
    gap: var(--spacing-md);
    overflow: visible;
    grid-template-columns: repeat(2, 1fr);
  }

  .home-strip-track-3 {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (min-width: 1200px) {
  .home-strip-track-4 {
    grid-template-columns: repeat(4, 1fr);
  }
}
```

- [ ] **Step 6: Run, and check the absent state on a default build**

```bash
npx playwright test e2e/home.spec.ts            # PASS on all three projects
npm run build                                   # default content: no published posts
grep -c 'id="from-the-blog"' out/index.html     # 0 — the strip omits itself
grep -c 'id="see-it-work"' out/index.html       # 1
```

- [ ] **Step 7: Gate and commit (print for Brian)**

Run: `npm test && npm run lint && npm run build && npx playwright test --grep-invert "visual:"`

```bash
git add -A
git commit -m "feat: demos and latest-writing strips on the home page"
```

---

### Task 6: Related writing on the service pages

**Files:**
- Create: `src/components/blog/RelatedPosts.tsx`
- Modify: `src/components/AutomatedWorkflows.tsx`, `src/components/AiIntegration.tsx`, `src/components/TechnicalConsulting.tsx`, `e2e/home.spec.ts`

**Interfaces:**
- Consumes: `getPosts`, `postsForService` (unit-tested in plan 2: filters by service, newest first, capped, drafts never loaded), `PostGrid`.
- Produces: `RelatedPosts { serviceSlug: string }` — renders nothing when no post names the service.

- [ ] **Step 1: Failing e2e** — append to `e2e/home.spec.ts`

The fixtures tag `bundle-post` with `ai-integration` and `flat-post` with `automated-workflows`; nothing names `technical-consulting`.

```ts
test("service pages show writing tagged with that service, and only that", async ({ page }) => {
  await page.goto("/services/ai-integration");
  const related = page.locator("#related-writing");
  await expect(related.getByRole("heading", { level: 2 })).toHaveText("Related writing");
  await expect(related.locator(".post-card-title")).toHaveText(["A Bundle Post With Images"]);

  await page.goto("/services/automated-workflows");
  await expect(page.locator("#related-writing .post-card-title")).toHaveText(["A Flat Post"]);

  await page.goto("/services/technical-consulting");
  await expect(page.locator("#related-writing")).toHaveCount(0);
});

test("the automations page links to the demos index", async ({ page }) => {
  await page.goto("/services/automated-workflows");
  await page.locator(".aw-proof").getByRole("link", { name: "See all demos →" }).click();
  await expect(page).toHaveURL(/\/demos$/);
});
```

Run: `npx playwright test e2e/home.spec.ts -g "service pages|automations page"` — expected: FAIL.

- [ ] **Step 2: `src/components/blog/RelatedPosts.tsx`**

```tsx
import { getPosts, postsForService } from "../../lib/blog/posts";
import PostGrid from "./PostGrid";
import "./blog.css";

/** Up to three newest posts whose front matter names this service. */
const RelatedPosts = ({ serviceSlug }: { serviceSlug: string }) => {
  const posts = postsForService(getPosts(), serviceSlug);
  if (posts.length === 0) return null;
  return (
    <section id="related-writing" className="blog-related">
      <div className="container">
        <h2 className="blog-related-title">Related writing</h2>
        <PostGrid posts={posts} headingLevel={3} />
      </div>
    </section>
  );
};

export default RelatedPosts;
```

- [ ] **Step 3: Place it immediately before each page's final CTA**

`src/components/AutomatedWorkflows.tsx` — import `RelatedPosts from "./blog/RelatedPosts"` and `DEMOS_PATH` from `"../data/workflowPaths"`:

```tsx
      <WorkflowFaq faq={automationsFaq} />
      <RelatedPosts serviceSlug="automated-workflows" />
      <AwFinalCta />
```

and in the `aw-proof` section's `wf-hero-actions`, after the "Try a live demo →" link:

```tsx
                <Link href={DEMOS_PATH} className="aw-hero-btn aw-hero-btn-ghost">
                  See all demos →
                </Link>
```

`src/components/AiIntegration.tsx` — import it, and directly above the closing `<CTA subtitle="Book a call" … />`:

```tsx
      <RelatedPosts serviceSlug="ai-integration" />
```

`src/components/TechnicalConsulting.tsx` — import it:

```tsx
      <WhyWorkWithMe />
      <RelatedPosts serviceSlug="technical-consulting" />
      <CTA />
```

- [ ] **Step 4: Run, gate, commit (print for Brian)**

Run: `npm test && npm run lint && npm run build && npx playwright test --grep-invert "visual:"`

```bash
git add -A
git commit -m "feat: related writing on service pages; demos index link on automations"
```

---

### Task 7: Visual review, CSS measurement, docs, launch

**Files:**
- Regenerate: `e2e/__screenshots__/**`
- Modify: `CLAUDE.md`

- [ ] **Step 1: Look at the diffs before accepting them**

Run: `npm run e2e`
Expected: functional suites pass; visual tests fail on **every** page (new header and footer) and there is no baseline for `/demos`.

Open `playwright-report/index.html` and review with Brian, at all three widths:
- `home` — the two strips; at 375px the cards scroll sideways and the page itself does not.
- `demos` — nine cards, shots legible, "Illustrative" tags visible.
- `services--ai-integration` and `services--automated-workflows` — "Related writing" sits directly above the final CTA.
- any one workflow page and one blog post — confirm the **only** differences are the header and footer.
- mobile header — one row: brand and hamburger.

Fix what is wrong in CSS. Only then: `npm run e2e:update && npm run e2e` — expected: green.

- [ ] **Step 2: Measure the CSS `/demos` and the home page ship**

```bash
for page in out/demos.html out/index.html; do
  total=0
  for css in $(grep -o '/_next/static/[^"]*\.css' $page | sort -u); do
    size=$(gzip -c "out$css" | wc -c); total=$((total + size))
  done
  echo "$page: $total bytes gzipped CSS"
done
```

Expected: each under 30 KB gzipped (30720 bytes). If a page is over, report the number to Brian before building the spec's lighter-card fallback — do not build it speculatively.

- [ ] **Step 3: `CLAUDE.md`**

In **Project Structure**, update or add:

```
    Header.tsx      # Server component. Builds plain link data from services.ts and
                    # renders HeaderMenu. A <noscript> style shows every link without JS
    HeaderMenu.tsx  # The header's ONLY client code: hamburger (<768px) and the
                    # Services dropdown (>=768px). Which applies is decided in Header.css
    Footer.tsx      # Grouped: Services (from services.ts) · Proof · Get started
    demos/          # DemoCard — a workflow's static showcase shot + two links
    home/           # DemoStrip, LatestPosts — the home page proof strips
    blog/RelatedPosts.tsx  # "Related writing" on a service page (front matter `services:`)
    (site)/demos/page.tsx  # "/demos" — the demos index
```

In **Key Details**, add:

```markdown
- **Offers and proof.** The three services are the offers (home sorter, `Services ▾`).
  The demos and the blog are the proof (`/demos`, `/blog`, the two home strips). A blog
  is not a fourth service — do not add it to the sorter.
- **No hardcoded service lists.** Header, footer, home sorter, blog service CTA and
  related posts all read `data/services.ts`. Array order is display order.
- **Featured demos** are `featuredDemoSlugs` in `data/workflows.ts` (order matters; a test
  checks each is published and has a demo).
- **`/demos` vs `/demos/<old-slug>`.** `/demos` is a real page. The nine `/demos/<old-slug>`
  rules in `netlify.toml` are legacy 301s to the nested demo routes. Demo URLs do not move.
```

In **Commands**, add: until baselines are intentionally regenerated, `npx playwright test --grep-invert "visual:"` runs the functional suites only.

- [ ] **Step 4: Sync docs to the Obsidian vault**

```bash
V=/Users/brian/Documents/dev-vault/projects/paradigm/consulting-website
cp CLAUDE.md "$V/"
cp docs/superpowers/plans/2026-09-20-ia-refactor.md "$V/docs/superpowers/plans/"
cp docs/superpowers/specs/2026-09-20-ia-refactor-design.md "$V/docs/superpowers/specs/"
```

- [ ] **Step 5: Full gate, commit, PR (print for Brian)**

Run: `npm test && npm run lint && npm run build && npm run e2e`

```bash
git add -A
git commit -m "docs: offers-and-proof structure; re-baseline visual suite"
git push -u origin ia-refactor
gh pr create --title "IA refactor: offers and proof" --body "Implements docs/superpowers/specs/2026-09-20-ia-refactor-design.md"
```

- [ ] **Step 6: Deploy-preview checks**

```bash
P=https://deploy-preview-N--<site>.netlify.app
curl -s -o /dev/null -w "%{http_code}\n" $P/demos                                  # 200 — the index
curl -s -o /dev/null -w "%{http_code} %{redirect_url}\n" $P/demos/tool-sync        # 301 → …/tool-sync/demo — legacy rule intact
curl -s $P/sitemap.xml | grep -c "/demos</loc>"                                    # 1
curl -s $P/ | grep -o 'href="/services/[a-z-]*"' | sort -u | wc -l                 # 3 — service links are in the HTML
```

On a phone (or device emulation) against the preview: open the hamburger, follow a service link, confirm the panel closes and the page scrolls to top. After merge, re-submit `sitemap.xml` in Google Search Console so `/demos` is picked up.
