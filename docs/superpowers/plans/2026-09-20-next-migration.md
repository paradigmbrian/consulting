# Next.js Migration at Parity — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Move the site from a client-only Vite SPA to statically exported Next.js with per-route metadata, structured data, sitemap, robots, `llms.txt` and a build gate — same pages, same URLs, same design.

**Architecture:** Next.js App Router with `output: 'export'`; `src/app/` holds thin route files that import the existing components from `src/components/`. Pages are server components; only the nine demos are client components, loaded through `next/dynamic` and still prerendered. One module, `src/lib/seo.ts`, derives all metadata and JSON-LD from `src/data/*`. A Playwright visual suite captured on the Vite build first is the proof that nothing visual changed.

**Tech Stack:** Next 16.3.5, React 19.3.0, TypeScript ~5.9.3, vanilla CSS, ESLint 9 flat config + `eslint-config-next`, Vitest 5, Playwright 1.63, `serve`, `tsx`, `node-html-parser`. Netlify static hosting.

**Spec:** `docs/superpowers/specs/2026-09-20-next-migration-design.md`

## Global Constraints

- **Git is read-only for the agent.** Never run `git add`, `commit`, `checkout`, `stash`, `restore` or any other git write. Every "Commit" step means: print the exact commands and ask Brian to run them. `git status` / `git diff` / `git log` are fine.
- Work happens on branch `next-migration` (Brian creates it — see Task 0).
- Package manager is `npm`. Node 22 (`.nvmrc`).
- Pinned versions: `next@16.3.5`, `react@19.3.0`, `react-dom@19.3.0`, `eslint-config-next@16.3.5`, `typescript@~5.9.3`, `eslint@^9`. Do **not** install TypeScript 7 or ESLint 10.
- **Vitest 5 requires Vite ≥ 6.** Do not install Vitest while the project still depends on Vite 5 (Tasks 1–3). It arrives in Task 5, after Vite is removed.
- URLs are unchanged. `trailingSlash` stays `false`.
- No copy changes and no design changes. The only permitted visible differences: unknown URLs now show a 404 page; the two "scroll to offer" buttons become anchor links that look identical.
- CSS stays vanilla, paired `.tsx` + `.css`. No Tailwind, no CSS modules, no CSS-in-JS.
- Existing components stay under `src/components/`; existing relative-import style stays. The `@/*` alias (→ `src/*`) is used **only** inside `src/app/**`.
- Site origin: `https://paradigmshiftdev.io`.
- `public/activebalance/` is a different product's landing page. Never edit it; the SEO gate excludes it.
- Any markdown file created or edited is also copied to `/Users/brian/Documents/dev-vault/projects/paradigm/consulting-website/<same relative path>`.
- Definition of done for every task from Task 5 on: `npm test` → `npm run lint` → `npm run build` → `npm run e2e`, all green. Tasks 1–4 state their own gates.

## Deviations from the spec (decided at plan time, spec updated to match)

1. **`app/` lives at `src/app/`.** Keeps every source file under `src/` and keeps imports short.
2. **OG images come from a static route handler, `src/app/og/[name]/route.tsx`, not `opengraph-image.tsx`.** A spike on Next 16.3.5 showed `opengraph-image` exports a file with **no extension** (`out/w/a/opengraph-image`), which Netlify would serve without an image content type. A route handler whose param is `home.png` exports a real `out/og/home.png`. It uses `next/og`, so no `satori` dependency.
3. **Stats are not emitted in JSON-LD at all.** schema.org has no natural home for them; omitting them trivially satisfies "no stat without its source".
4. **Showcase snippets are imported statically** (not `React.lazy`). They are pure static markup and become server components with zero JS. Consequence: a workflow page's CSS includes all nine demos' stylesheets. Class names are namespaced per demo; the visual suite proves no bleed.

## File Structure

Created:

| File | Responsibility |
|---|---|
| `playwright.config.ts` | Three viewport projects; serves the built site |
| `e2e/routes.ts` | Route lists for e2e (later re-exports `src/lib/routes.ts`) |
| `e2e/visual.spec.ts` | Full-page screenshot per route per width |
| `e2e/demos.spec.ts` | Each demo loads, advances one step, zero console errors |
| `e2e/prerender.spec.ts` | Every route shows its `<h1>` with JavaScript disabled; 404 page |
| `next.config.ts` | `output: 'export'` |
| `eslint.config.mjs` | Flat config, `eslint-config-next`, zero warnings |
| `vitest.config.ts` | Node environment, `src/**` + `scripts/**` tests |
| `.nvmrc` | `22` |
| `src/app/layout.tsx` | Root `<html>`, `index.css`, root metadata, Organization/WebSite JSON-LD |
| `src/app/not-found.tsx` | 404 page |
| `src/app/(site)/layout.tsx` | Header + `<main>` + Footer |
| `src/app/(site)/page.tsx` and three `services/*/page.tsx` | Thin route files |
| `src/app/(site)/services/automated-workflows/[slug]/page.tsx` | Workflow page route |
| `src/app/services/automated-workflows/[slug]/demo/page.tsx` | Demo route (outside `(site)` → full-bleed) |
| `src/app/og/[name]/route.tsx` | Build-time OG PNGs |
| `src/app/sitemap.ts`, `src/app/robots.ts`, `src/app/llms.txt/route.ts` | Generated discovery files |
| `src/data/workflowPaths.ts` | `workflowPath` / `workflowDemoPath` without the 1000-line data file |
| `src/data/faq.ts` | The automations-index FAQ (moved out of the component) |
| `src/lib/routes.ts` | Every route the site builds — one source for sitemap, OG, e2e, tests |
| `src/lib/seo.ts` | Metadata + JSON-LD builders |
| `src/lib/og.ts` | OG card list |
| `src/lib/llms.ts` | `llms.txt` body |
| `src/components/JsonLd.tsx` | `<script type="application/ld+json">` |
| `scripts/verify-seo/checks.ts`, `run.ts` | Post-build SEO gate |
| `*.test.ts` beside each lib file | Vitest |

Deleted: `index.html`, `vite.config.ts`, `tsconfig.node.json`, `.eslintrc.cjs`, `src/main.tsx`, `src/App.tsx`, `src/components/Layout.tsx`, `src/components/ScrollToTop.tsx`, `src/components/workflows/WorkflowDemo.tsx`.

---

### Task 0: Branch (Brian)

- [ ] **Step 1: Ask Brian to create the branch**

Print and wait for confirmation:

```bash
git checkout -b next-migration
```

---

### Task 1: Parity harness and Vite baselines

Captures what the site looks like **today**, so later tasks can prove they changed nothing. Must run before anything else touches `src/`.

**Files:**
- Create: `playwright.config.ts`, `e2e/routes.ts`, `e2e/visual.spec.ts`, `e2e/demos.spec.ts`
- Modify: `package.json` (scripts, devDependencies), `.gitignore`
- Generated + committed: `e2e/__screenshots__/**`

**Interfaces:**
- Produces: `pageRoutes: string[]`, `demoRoutes: string[]`, `snapshotName(route: string): string` from `e2e/routes.ts`; `npm run e2e`; `npm run e2e:update`.

- [ ] **Step 1: Install Playwright**

```bash
npm install -D @playwright/test@^1.63.0
npx playwright install chromium
```

- [ ] **Step 2: Add scripts and ignores**

In `package.json` `"scripts"` add:

```json
"e2e": "playwright test",
"e2e:update": "playwright test e2e/visual.spec.ts --update-snapshots"
```

Append to `.gitignore`:

```
# Playwright
test-results
playwright-report
```

- [ ] **Step 3: Write `e2e/routes.ts`**

```ts
import { workflows } from "../src/data/workflows";

const published = workflows.filter((w) => w.published);

export const pageRoutes: string[] = [
  "/",
  "/services/automated-workflows",
  "/services/ai-integration",
  "/services/technical-consulting",
  ...published.map((w) => `/services/automated-workflows/${w.slug}`),
];

export const demoRoutes: string[] = published
  .filter((w) => w.hasDemo)
  .map((w) => `/services/automated-workflows/${w.slug}/demo`);

/** "/services/x/y" → "services--x--y"; "/" → "home". */
export const snapshotName = (route: string): string =>
  route === "/" ? "home" : route.slice(1).replaceAll("/", "--");
```

- [ ] **Step 4: Write `playwright.config.ts`**

```ts
import { defineConfig, devices } from "@playwright/test";

const PORT = 4173;

export default defineConfig({
  testDir: "./e2e",
  // No platform suffix: baselines are captured and compared on Brian's Mac only.
  snapshotPathTemplate: "{testDir}/__screenshots__/{projectName}/{arg}{ext}",
  fullyParallel: true,
  reporter: [["list"], ["html", { open: "never" }]],
  expect: {
    toHaveScreenshot: { maxDiffPixelRatio: 0.01, animations: "disabled" },
  },
  use: {
    baseURL: `http://localhost:${PORT}`,
    contextOptions: { reducedMotion: "reduce" },
  },
  projects: [
    { name: "mobile", use: { ...devices["Desktop Chrome"], viewport: { width: 375, height: 812 } } },
    { name: "tablet", use: { ...devices["Desktop Chrome"], viewport: { width: 768, height: 1024 } } },
    { name: "desktop", use: { ...devices["Desktop Chrome"], viewport: { width: 1280, height: 800 } } },
  ],
  webServer: {
    command: `npm run build && npm run preview -- --port ${PORT} --strictPort`,
    url: `http://localhost:${PORT}`,
    reuseExistingServer: false,
    timeout: 240_000,
  },
});
```

- [ ] **Step 5: Write `e2e/visual.spec.ts`**

```ts
import { test, expect } from "@playwright/test";
import { pageRoutes, demoRoutes, snapshotName } from "./routes";

for (const route of pageRoutes) {
  test(`visual: ${route}`, async ({ page }) => {
    await page.goto(route);
    await page.waitForLoadState("networkidle");
    await expect(page).toHaveScreenshot(`${snapshotName(route)}.png`, { fullPage: true });
  });
}

for (const route of demoRoutes) {
  test(`visual: ${route}`, async ({ page }) => {
    // Demos run scripted timers (typing, staged reveals). Freezing the clock
    // pins every demo to its first frame so the screenshot is deterministic.
    await page.clock.install();
    await page.goto(route);
    await expect(page.locator("h1.demo-title")).toBeVisible();
    await expect(page).toHaveScreenshot(`${snapshotName(route)}.png`, { fullPage: true });
  });
}
```

- [ ] **Step 6: Write `e2e/demos.spec.ts`**

```ts
import { test, expect } from "@playwright/test";
import { demoRoutes } from "./routes";

for (const route of demoRoutes) {
  test(`demo advances with no console errors: ${route}`, async ({ page }) => {
    const errors: string[] = [];
    page.on("console", (message) => {
      if (message.type() === "error") errors.push(message.text());
    });
    page.on("pageerror", (error) => errors.push(error.message));

    await page.goto(route);
    await expect(page.locator(".demo-stage-count")).toHaveText(/Step 1 of \d+/);
    await page.getByRole("button", { name: "Next →" }).click();
    await expect(page.locator(".demo-stage-count")).toHaveText(/Step 2 of \d+/);

    expect(errors).toEqual([]);
  });
}
```

- [ ] **Step 7: Capture baselines from the Vite build**

Run: `npm run e2e:update`
Expected: 22 routes × 3 projects = 66 screenshots written under `e2e/__screenshots__/{mobile,tablet,desktop}/`.

- [ ] **Step 8: Prove the baselines are stable**

Run: `npm run e2e` twice.
Expected: both runs fully green (66 visual + 27 demo tests). If a route flakes, it has an un-frozen animation: find the animated element and add `mask: [page.locator("<selector>")]` to that route's `toHaveScreenshot` options, re-run Step 7, and repeat until two consecutive runs pass. Record any mask added in the commit message.

- [ ] **Step 9: Open three baselines and look at them**

Read `e2e/__screenshots__/desktop/home.png`, `e2e/__screenshots__/mobile/services--automated-workflows.png` and `e2e/__screenshots__/desktop/services--automated-workflows--missed-call-text-back--demo.png`. Confirm each shows a fully rendered page (no blank showcase skeletons, no unstyled content). A baseline of a broken page proves nothing.

- [ ] **Step 10: Commit (print for Brian)**

```bash
git add package.json package-lock.json .gitignore playwright.config.ts e2e
git commit -m "test: Playwright parity harness with Vite baselines"
```

---

### Task 2: React 19 on Vite

Upgrading React while still on Vite means a React breakage cannot be confused with a Next breakage.

**Files:**
- Modify: `package.json`, `package-lock.json`, any file the type codemod touches

- [ ] **Step 1: Upgrade**

```bash
npm install react@19.3.0 react-dom@19.3.0 react-icons@^5.7.0
npm install -D @types/react@^19 @types/react-dom@^19
```

`react-icons` 4 types return `JSX.Element` from the global `JSX` namespace, which `@types/react` 19 removed; 5.x fixes that.

- [ ] **Step 2: Typecheck and build**

Run: `npm run build`
Expected: PASS. If `tsc` reports React 19 type errors (`JSX` namespace, `useRef()` without an argument, `ReactElement` props typed `unknown`), run the official codemod and re-run the build:

```bash
npx types-react-codemod@latest preset-19 ./src
```

- [ ] **Step 3: Lint**

Run: `npm run lint`
Expected: PASS, zero warnings.

- [ ] **Step 4: Parity**

Run: `npm run e2e`
Expected: all green against the Task 1 baselines. A visual diff here means React 19 changed rendering — stop and investigate; do not update baselines.

- [ ] **Step 5: Commit (print for Brian)**

```bash
git add -A
git commit -m "chore: upgrade to React 19 and react-icons 5"
```

---

### Task 3: Make the components server-safe (still on Vite)

Three small changes that would otherwise force `"use client"` onto two marketing pages or cause a hydration mismatch in every demo.

**Files:**
- Modify: `src/components/Hero.tsx`, `src/components/AiIntegration.tsx`, `src/demos/shared/usePrefersReducedMotion.ts`
- Create: `src/data/workflowPaths.ts`
- Modify: `src/data/workflows.ts`, the nine demo entry components

**Interfaces:**
- Produces: `workflowPath(slug: string): string`, `workflowDemoPath(slug: string): string` from `src/data/workflowPaths.ts` (still re-exported from `src/data/workflows.ts`).

- [ ] **Step 1: `Hero.tsx` — anchor instead of a scroll handler**

Delete the `scrollToOffer` function. Replace

```tsx
            <button className="btn btn-secondary" onClick={scrollToOffer}>
              See what's included
            </button>
```

with

```tsx
            <a href="#offer" className="btn btn-secondary">
              See what's included
            </a>
```

`index.css` already sets `scroll-margin-top: 5rem` for anchored sections, the pattern the rest of the site uses.

- [ ] **Step 2: `AiIntegration.tsx` — same change**

Delete the `scrollToOffer` function. Replace

```tsx
              <button className="btn btn-secondary" onClick={scrollToOffer}>
                See the engagements
              </button>
```

with

```tsx
              <a href="#ai-offer" className="btn btn-secondary">
                See the engagements
              </a>
```

- [ ] **Step 3: `usePrefersReducedMotion.ts` — hydration-safe**

The current `useState` initializer reads `window.matchMedia` during the first client render, so a reduced-motion visitor's first render differs from the server HTML. Replace the whole file:

```ts
import { useSyncExternalStore } from "react";

const QUERY = "(prefers-reduced-motion: reduce)";

function subscribe(onChange: () => void): () => void {
  const mql = window.matchMedia(QUERY);
  mql.addEventListener("change", onChange);
  return () => mql.removeEventListener("change", onChange);
}

const getSnapshot = (): boolean => window.matchMedia(QUERY).matches;

/** The server has no media queries; React swaps in the real value after hydration. */
const getServerSnapshot = (): boolean => false;

export function usePrefersReducedMotion(): boolean {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
```

- [ ] **Step 4: Split the path helpers out of the data file**

Every demo imports `workflowPath` from `src/data/workflows.ts`, which drags ~1000 lines of page copy into each demo's client bundle. Create `src/data/workflowPaths.ts`:

```ts
export const workflowPath = (slug: string): string =>
  `/services/automated-workflows/${slug}`;

export const workflowDemoPath = (slug: string): string =>
  `${workflowPath(slug)}/demo`;
```

In `src/data/workflows.ts`, replace the two existing definitions of `workflowPath` and `workflowDemoPath` (near line 976) with:

```ts
export { workflowPath, workflowDemoPath } from "./workflowPaths";
```

First confirm the existing bodies produce exactly those strings; if they differ, copy the existing bodies into `workflowPaths.ts` instead.

In each of the nine demo entry files, change `from "../../data/workflows"` to `from "../../data/workflowPaths"`:

```
src/demos/winBackCampaign/WinBackDemo.tsx
src/demos/missedCallTextBack/MissedCallTextBackDemo.tsx
src/demos/reviewGeneration/ReviewGenerationDemo.tsx
src/demos/automatedQuoting/AutomatedQuotingDemo.tsx
src/demos/invoiceReminders/InvoiceRemindersDemo.tsx
src/demos/newCustomerOnboarding/OnboardingDemo.tsx
src/demos/jobDispatch/JobDispatchDemo.tsx
src/demos/weeklyReports/WeeklyReportsDemo.tsx
src/demos/toolSync/ToolSyncDemo.tsx
```

Run `grep -rn "data/workflows\"" src/demos` — expected: no matches.

- [ ] **Step 5: Gates**

Run: `npm run build && npm run lint && npm run e2e`
Expected: all green. The two anchors must be pixel-identical to the buttons they replace; if the technical-consulting or ai-integration snapshot differs, the `.btn` rule is missing something `<button>` had by default — fix it in the component's CSS (typically `text-decoration: none; display: inline-flex;`), never by updating the baseline.

- [ ] **Step 6: Commit (print for Brian)**

```bash
git add -A
git commit -m "refactor: server-safe anchors, hydration-safe reduced-motion hook, split workflow paths"
```

---

### Task 4: Swap Vite for Next.js

The one unavoidably large task: the site cannot half-run on two bundlers. Its deliverable is `npm run build` producing `out/` and the **unchanged Task 1 baselines passing against it**.

**Files:**
- Create: `next.config.ts`, `eslint.config.mjs`, `src/app/layout.tsx`, `src/app/(site)/layout.tsx`, `src/app/(site)/page.tsx`, `src/app/(site)/services/automated-workflows/page.tsx`, `src/app/(site)/services/ai-integration/page.tsx`, `src/app/(site)/services/technical-consulting/page.tsx`, `src/app/(site)/services/automated-workflows/[slug]/page.tsx`, `src/app/services/automated-workflows/[slug]/demo/page.tsx`
- Modify: `package.json`, `tsconfig.json`, `.gitignore`, `playwright.config.ts`, `src/demos/registry.ts`, `src/showcases/registry.ts`, `src/components/workflows/WorkflowPage.tsx`, `src/demos/shared/DemoController.tsx`, `src/demos/shared/SendLifecycleProvider.tsx`, the nine demo entry components, and the seven files that import `Link` from `react-router-dom`
- Delete: `index.html`, `vite.config.ts`, `tsconfig.node.json`, `.eslintrc.cjs`, `src/main.tsx`, `src/App.tsx`, `src/components/Layout.tsx`, `src/components/ScrollToTop.tsx`, `src/components/workflows/WorkflowDemo.tsx`

**Interfaces:**
- Consumes: `workflowPath`, `workflowDemoPath` (Task 3); `pageRoutes`, `demoRoutes` (Task 1).
- Produces: `demoRegistry: Record<string, ComponentType>` and `showcaseRegistry: Record<string, ComponentType<{ snippet: string }>>` (plain component maps, no `React.lazy`); `WorkflowPage` now takes `{ workflow: PublishedWorkflow }`; scripts `dev`, `build`, `preview`, `lint`, `typecheck`.

- [ ] **Step 1: Swap dependencies**

```bash
npm uninstall vite @vitejs/plugin-react react-router-dom eslint-plugin-react-refresh eslint-plugin-react-hooks @typescript-eslint/eslint-plugin @typescript-eslint/parser
npm install next@16.3.5
npm install -D typescript@~5.9.3 @types/node@^22 eslint@^9 eslint-config-next@16.3.5 serve@^14
```

Confirm no Vite-isms remain in the source: `grep -rn "import.meta" src` — expected: no matches.

- [ ] **Step 2: Scripts**

Replace the `"scripts"` block in `package.json`, keeping the two `e2e` scripts from Task 1:

```json
"scripts": {
  "dev": "next dev",
  "build": "next build",
  "preview": "serve out -l 4173 -L",
  "lint": "eslint . --max-warnings 0",
  "typecheck": "tsc --noEmit",
  "e2e": "playwright test",
  "e2e:update": "playwright test e2e/visual.spec.ts --update-snapshots"
}
```

- [ ] **Step 3: `next.config.ts`**

```ts
import type { NextConfig } from "next";

const config: NextConfig = {
  output: "export",
  // Static export has no image optimizer. Spec 2 replaces this with a Netlify
  // Image CDN loader; until then the site has no content images.
  images: { unoptimized: true },
};

export default config;
```

- [ ] **Step 4: `tsconfig.json`** (replace the whole file; delete `tsconfig.node.json`)

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["ES2022", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "moduleResolution": "bundler",
    "skipLibCheck": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "esModuleInterop": true,
    "incremental": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "paths": { "@/*": ["./src/*"] },
    "plugins": [{ "name": "next" }]
  },
  "include": [
    "next-env.d.ts",
    ".next/types/**/*.ts",
    ".next/dev/types/**/*.ts",
    "src",
    "e2e",
    "scripts",
    "*.ts"
  ],
  "exclude": ["node_modules"]
}
```

`next build` may append options it wants; accept its edits.

- [ ] **Step 5: `.gitignore`** — append

```
# Next.js
.next
out
next-env.d.ts
```

- [ ] **Step 6: Root layout — `src/app/layout.tsx`**

Title and description are copied verbatim from `index.html`; Task 8 replaces this block with the full metadata.

```tsx
import type { Metadata } from "next";
import type { ReactNode } from "react";
import "../index.css";

export const metadata: Metadata = {
  title: "AI Automation for Small Business | Paradigm Shift Software Development",
  description:
    "AI-powered automation for small and trades businesses — missed-call text-back, review generation, quoting, invoicing, dispatch and more, built on the tools you already use. See nine working demos.",
  icons: {
    icon: [
      { url: "/favicon/ps-favicon-16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon/ps-favicon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon/ps-favicon-1024.png", sizes: "1024x1024", type: "image/png" },
    ],
    apple: [
      { url: "/favicon/ps-favicon-192.png", sizes: "192x192" },
      { url: "/favicon/ps-favicon-512.png", sizes: "512x512" },
    ],
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
```

- [ ] **Step 7: Site layout — `src/app/(site)/layout.tsx`** (replaces `components/Layout.tsx`)

```tsx
import type { ReactNode } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function SiteLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <Header />
      <main>{children}</main>
      <Footer />
    </>
  );
}
```

- [ ] **Step 8: The four static pages**

`src/app/(site)/page.tsx`:

```tsx
import Home from "@/components/Home";

export default function Page() {
  return <Home />;
}
```

`src/app/(site)/services/automated-workflows/page.tsx`:

```tsx
import AutomatedWorkflows from "@/components/AutomatedWorkflows";

export default function Page() {
  return <AutomatedWorkflows />;
}
```

`src/app/(site)/services/ai-integration/page.tsx`:

```tsx
import AiIntegration from "@/components/AiIntegration";

export default function Page() {
  return <AiIntegration />;
}
```

`src/app/(site)/services/technical-consulting/page.tsx`:

```tsx
import TechnicalConsulting from "@/components/TechnicalConsulting";

export default function Page() {
  return <TechnicalConsulting />;
}
```

- [ ] **Step 9: Showcase registry — static imports**

Replace `src/showcases/registry.ts`:

```ts
import type { ComponentType } from "react";
import ReviewGeneration from "./reviewGeneration";
import WinBackCampaign from "./winBackCampaign";
import MissedCallTextBack from "./missedCallTextBack";
import JobDispatch from "./jobDispatch";
import NewCustomerOnboarding from "./newCustomerOnboarding";
import WeeklyReports from "./weeklyReports";
import InvoiceReminders from "./invoiceReminders";
import ToolSync from "./toolSync";
import AutomatedQuoting from "./automatedQuoting";

/**
 * slug → showcase module. Each module renders ONE static snippet, selected by
 * the `snippet` key. They are pure markup, so they render on the server and
 * ship no JavaScript.
 */
export const showcaseRegistry: Record<
  string,
  ComponentType<{ snippet: string }>
> = {
  "review-generation": ReviewGeneration,
  "win-back-campaigns": WinBackCampaign,
  "missed-call-text-back": MissedCallTextBack,
  "job-dispatch": JobDispatch,
  "new-customer-onboarding": NewCustomerOnboarding,
  "weekly-owner-reports": WeeklyReports,
  "invoice-reminders": InvoiceReminders,
  "tool-sync": ToolSync,
  "automated-quoting": AutomatedQuoting,
};
```

- [ ] **Step 10: `WorkflowPage.tsx` takes the workflow as a prop**

In `src/components/workflows/WorkflowPage.tsx`:

Replace the first three import lines

```tsx
import { Suspense, createElement } from "react";
import { Navigate, useParams } from "react-router-dom";
import { getWorkflow } from "../../data/workflows";
```

with

```tsx
import { createElement } from "react";
import type { PublishedWorkflow } from "../../data/workflows";
```

Replace

```tsx
const WorkflowPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const workflow = slug ? getWorkflow(slug) : undefined;

  if (!workflow || !workflow.published) {
    return <Navigate to="/" replace />;
  }
```

with

```tsx
interface WorkflowPageProps {
  workflow: PublishedWorkflow;
}

const WorkflowPage = ({ workflow }: WorkflowPageProps) => {
```

Replace the `shot` helper

```tsx
  const shot = (key: string, layered = false) => (
    <ShowcaseFrame layered={layered}>
      <Suspense fallback={<div className="wf-shot-skeleton" />}>
        {createElement(Showcase, { snippet: key })}
      </Suspense>
    </ShowcaseFrame>
  );
```

with

```tsx
  const shot = (key: string, layered = false) => (
    <ShowcaseFrame layered={layered}>
      {createElement(Showcase, { snippet: key })}
    </ShowcaseFrame>
  );
```

- [ ] **Step 11: Workflow route — `src/app/(site)/services/automated-workflows/[slug]/page.tsx`**

```tsx
import { notFound } from "next/navigation";
import { getWorkflow, workflows } from "@/data/workflows";
import WorkflowPage from "@/components/workflows/WorkflowPage";

export const dynamicParams = false;

export function generateStaticParams() {
  return workflows.filter((w) => w.published).map((w) => ({ slug: w.slug }));
}

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const workflow = getWorkflow(slug);
  if (!workflow || !workflow.published) notFound();
  return <WorkflowPage workflow={workflow} />;
}
```

- [ ] **Step 12: Demo registry and the client boundary**

Replace `src/demos/registry.ts`:

```ts
import dynamic from "next/dynamic";
import type { ComponentType } from "react";

/**
 * slug → demo. `next/dynamic` gives each demo its own client chunk, so a demo's
 * JavaScript loads only on its own page, and the demo is still prerendered.
 */
export const demoRegistry: Record<string, ComponentType> = {
  "win-back-campaigns": dynamic(() => import("./winBackCampaign/WinBackDemo")),
  "missed-call-text-back": dynamic(
    () => import("./missedCallTextBack/MissedCallTextBackDemo"),
  ),
  "review-generation": dynamic(
    () => import("./reviewGeneration/ReviewGenerationDemo"),
  ),
  "automated-quoting": dynamic(
    () => import("./automatedQuoting/AutomatedQuotingDemo"),
  ),
  "invoice-reminders": dynamic(
    () => import("./invoiceReminders/InvoiceRemindersDemo"),
  ),
  "new-customer-onboarding": dynamic(
    () => import("./newCustomerOnboarding/OnboardingDemo"),
  ),
  "job-dispatch": dynamic(() => import("./jobDispatch/JobDispatchDemo")),
  "weekly-owner-reports": dynamic(
    () => import("./weeklyReports/WeeklyReportsDemo"),
  ),
  "tool-sync": dynamic(() => import("./toolSync/ToolSyncDemo")),
};
```

Add `"use client";` as the **first line** of each of the nine demo entry files listed in Task 3 Step 4. Everything they import (steps, providers, `DemoShell`, `DemoController`) joins the client graph automatically; do not add the directive anywhere else.

- [ ] **Step 13: Demo route — `src/app/services/automated-workflows/[slug]/demo/page.tsx`**

Outside the `(site)` group, so no Header/Footer — the demo stays full-bleed.

```tsx
import { notFound } from "next/navigation";
import { demoRegistry } from "@/demos/registry";

export const dynamicParams = false;

export function generateStaticParams() {
  return Object.keys(demoRegistry).map((slug) => ({ slug }));
}

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const Demo = demoRegistry[slug];
  if (!Demo) notFound();
  return <Demo />;
}
```

- [ ] **Step 14: `Link` swap**

In each of these seven files, change `import { Link } from "react-router-dom";` to `import Link from "next/link";` and every `to=` on a `<Link>` to `href=`:

```
src/components/Home.tsx
src/components/Footer.tsx
src/components/Header.tsx
src/components/AutomatedWorkflows.tsx
src/components/workflows/WorkflowHero.tsx
src/components/workflows/WorkflowDemoCta.tsx
src/demos/shared/DemoShell.tsx
```

(`Home.tsx`'s `ServiceCard.to` field is data, not a prop — leave the field name, change only `to={service.to}` → `href={service.to}`.)

Run: `grep -rn "react-router-dom" src` — expected: no matches after Step 15.

- [ ] **Step 15: Delete the Vite shell**

Delete: `index.html`, `vite.config.ts`, `tsconfig.node.json`, `.eslintrc.cjs`, `src/main.tsx`, `src/App.tsx`, `src/components/Layout.tsx`, `src/components/ScrollToTop.tsx`, `src/components/workflows/WorkflowDemo.tsx`. Look at each before deleting; none holds anything not already reproduced above. `dist/` is an ignored build artifact — delete it too.

- [ ] **Step 16: ESLint flat config — `eslint.config.mjs`**

A dry run of `eslint-config-next` against today's source found exactly four rule families firing; each is handled below and nothing else may be disabled.

```js
import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

export default defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    rules: {
      // Fires in 52 files of marketing and demo copy ("you're", "it's").
      // Escaping would churn every page of copy for no rendering difference.
      "react/no-unescaped-entities": "off",
    },
  },
  {
    // The scripted demos drive staged reveals with setState-in-effect timers.
    // This migration is at parity: demo internals are not refactored here.
    files: ["src/demos/**/*.{ts,tsx}"],
    rules: {
      "react-hooks/set-state-in-effect": "off",
      "react-hooks/refs": "off",
    },
  },
  globalIgnores([
    ".next/**",
    "out/**",
    "next-env.d.ts",
    "public/**",
    "playwright-report/**",
    "test-results/**",
  ]),
]);
```

Then delete the two now-meaningless comments (the rule no longer exists, so ESLint errors on them):
- `src/demos/shared/DemoController.tsx:71` — `// eslint-disable-next-line react-refresh/only-export-components`
- `src/demos/shared/SendLifecycleProvider.tsx:85` — same comment

- [ ] **Step 17: Point Playwright at the static export**

In `playwright.config.ts` change the `webServer.command` to:

```ts
    command: `npm run build && npm run preview`,
```

`serve` maps `/services/x` → `out/services/x.html` and serves `out/404.html` for unknown paths — the same behaviour as Netlify.

- [ ] **Step 18: Build**

Run: `npm run build`
Expected: route table lists `/`, the three service pages, 9 × `/services/automated-workflows/[slug]`, 9 × `…/demo`, `/_not-found`; `out/index.html` exists. Fix type errors the stricter include surfaces. If the build says a component "needs `use client`", the file uses a hook or handler outside `src/demos/` — report it rather than adding the directive; Task 3 was supposed to have removed them all.

- [ ] **Step 19: Lint and typecheck**

Run: `npm run lint && npm run typecheck`
Expected: PASS, zero warnings. If a rule not listed in Step 16 fires, fix the code; do not extend the disable list without Brian's say-so.

- [ ] **Step 20: Parity — the point of the whole task**

Run: `npm run e2e`
Expected: all 93 tests green against the **unchanged** Task 1 baselines. On a visual diff, open `playwright-report/index.html`, find the cause (usually CSS order — Next concatenates stylesheets per route, so two rules of equal specificity can swap precedence) and fix the CSS so the winner is explicit. Never update a baseline in this task.

- [ ] **Step 21: Prerender spot check**

Run: `grep -c "<h1" out/index.html out/services/automated-workflows/missed-call-text-back.html out/services/automated-workflows/missed-call-text-back/demo.html`
Expected: `1` for each — the markup is in the HTML, not rendered by JavaScript.

- [ ] **Step 22: Commit (print for Brian)**

```bash
git add -A
git commit -m "feat: migrate from Vite SPA to Next.js static export"
```

---

### Task 5: Vitest, the route list, and `services.ts` as the source of truth

**Files:**
- Create: `vitest.config.ts`, `src/lib/routes.ts`, `src/lib/routes.test.ts`, `src/data/data.test.ts`
- Modify: `package.json`, `src/data/services.ts`, `src/components/Home.tsx`, `e2e/routes.ts`

**Interfaces:**
- Produces:
  - `Service` = `{ slug; label; name; eyebrow; line; summary; accent: boolean; metaTitle; metaDescription; published: boolean }` (all strings unless noted); `services`, `publishedServices`, `servicePath(slug)`, `getService(slug): Service | undefined`.
  - `src/lib/routes.ts`: `publishedWorkflows(): PublishedWorkflow[]`, `demoWorkflows(): PublishedWorkflow[]`, `pageRoutes(): string[]`, `demoRoutes(): string[]`, `allRoutes(): string[]`.

- [ ] **Step 1: Install and configure Vitest**

```bash
npm install -D vitest@^5.0.1
```

`vitest.config.ts`:

```ts
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",
    include: ["src/**/*.test.ts", "scripts/**/*.test.ts"],
  },
});
```

Add to `package.json` scripts: `"test": "vitest run"`.

Tests live in `.ts` files and exercise data and lib modules. The two registries are imported only to read their keys. If importing `next/dynamic` throws under Vitest, add this at the top of `src/data/data.test.ts` (with `vi` added to the `vitest` import): `vi.mock("next/dynamic", () => ({ default: () => () => null }));`

- [ ] **Step 2: Write the failing data tests — `src/data/data.test.ts`**

```ts
import { describe, expect, it } from "vitest";
import { demoRegistry } from "../demos/registry";
import { showcaseRegistry } from "../showcases/registry";
import { getService, publishedServices, servicePath, services } from "./services";
import { workflows } from "./workflows";

describe("services", () => {
  it("lists the three service lines in home-page order", () => {
    expect(publishedServices.map((s) => s.slug)).toEqual([
      "automated-workflows",
      "ai-integration",
      "technical-consulting",
    ]);
  });

  it("has unique slugs", () => {
    const slugs = services.map((s) => s.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it("has unique, non-empty meta titles and descriptions of sane length", () => {
    const titles = services.map((s) => s.metaTitle);
    const descriptions = services.map((s) => s.metaDescription);
    expect(new Set(titles).size).toBe(titles.length);
    expect(new Set(descriptions).size).toBe(descriptions.length);
    for (const d of descriptions) {
      expect(d.length).toBeGreaterThanOrEqual(70);
      expect(d.length).toBeLessThanOrEqual(160);
    }
  });

  it("resolves paths and lookups", () => {
    expect(servicePath("ai-integration")).toBe("/services/ai-integration");
    expect(getService("ai-integration")?.name).toBe("AI Integration");
    expect(getService("nope")).toBeUndefined();
  });
});

describe("workflows", () => {
  it("has unique slugs", () => {
    const slugs = workflows.map((w) => w.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it("has a demo registered for exactly the published workflows that claim one", () => {
    const claimed = workflows
      .filter((w) => w.published && w.hasDemo)
      .map((w) => w.slug)
      .sort();
    expect(Object.keys(demoRegistry).sort()).toEqual(claimed);
  });

  it("has a showcase for every published workflow", () => {
    for (const w of workflows.filter((w) => w.published)) {
      expect(showcaseRegistry[w.slug], w.slug).toBeDefined();
    }
  });

  it("never ships a stat without a source URL", () => {
    for (const w of workflows) {
      if (!w.published) continue;
      for (const stat of w.stats) {
        expect(stat.sourceUrl, `${w.slug}: ${stat.label}`).toMatch(/^https?:\/\//);
      }
    }
  });
});
```

- [ ] **Step 3: Run it**

Run: `npm test`
Expected: the `services` block FAILS (`getService` is not exported; only two services). If the `workflows` block fails to *import* because `showcaseRegistry` pulls in `.css` files, add `css: false` under `test` in `vitest.config.ts` and re-run.

- [ ] **Step 4: Rewrite `src/data/services.ts`**

`name`, `eyebrow`, `line` and `accent` are moved verbatim from the array in `Home.tsx`. `summary` for the two existing services is unchanged.

```ts
export interface Service {
  slug: string;
  label: string; // short label
  name: string; // card heading on the home page
  eyebrow: string; // who it is for
  line: string; // one-line pitch on the home page card
  summary: string;
  accent: boolean; // accent-styled card on the home page
  metaTitle: string; // <title>, before the site suffix
  metaDescription: string; // 70–160 characters
  published: boolean;
}

/** Ordered as they appear on the home page. */
export const services: Service[] = [
  {
    slug: "automated-workflows",
    label: "Automated Workflows",
    name: "AI Automations",
    eyebrow: "For small-business owners",
    line: "Put AI to work on the busywork — missed calls, quotes, invoices, reviews — on the tools you already use.",
    summary:
      "Design and build automated workflows that remove manual, repetitive operations from your business.",
    accent: true,
    metaTitle: "AI Automations for Small Business",
    metaDescription:
      "AI-powered automations that answer missed calls, chase invoices, ask for reviews and turn messy requests into quotes, built around the tools you already use.",
    published: true,
  },
  {
    slug: "ai-integration",
    label: "AI Integration",
    name: "AI Integration",
    eyebrow: "For startups & product teams",
    line: "Embed AI into the product you already have — starting with a fixed-fee roadmap, not a rebuild.",
    summary:
      "Embed AI into an existing product, starting with a fixed-fee roadmap instead of a rebuild.",
    accent: true,
    metaTitle: "AI Integration for Startups and Product Teams",
    metaDescription:
      "Embed AI into the product you already have. Start with a fixed-fee roadmap, not a rebuild, from a senior engineer with 10+ years shipping production software.",
    published: true,
  },
  {
    slug: "technical-consulting",
    label: "Technical Consulting",
    name: "Technical Consulting",
    eyebrow: "For non-technical founders",
    line: "Technical clarity before you build or hire — fixed-scope audits and MVP blueprints.",
    summary:
      "Fractional CTO guidance, technical audits, and MVP blueprints for non-technical founders making early product decisions.",
    accent: false,
    metaTitle: "Technical Consulting for Non-Technical Founders",
    metaDescription:
      "Technical clarity before you build or hire: fixed-scope tech audits, MVP blueprints and fractional CTO guidance for non-technical founders.",
    published: true,
  },
];

export const publishedServices: Service[] = services.filter((s) => s.published);

export const servicePath = (slug: string): string => `/services/${slug}`;

export const getService = (slug: string): Service | undefined =>
  services.find((s) => s.slug === slug);
```

- [ ] **Step 5: `Home.tsx` reads from it**

Delete the `ServiceCard` interface and the local `services` array. Add:

```tsx
import { publishedServices, servicePath } from "../data/services";
```

Replace the sorter map with:

```tsx
            {publishedServices.map((service) => (
              <Link
                key={service.slug}
                href={servicePath(service.slug)}
                className={
                  service.accent
                    ? "home-service-card home-service-card-accent"
                    : "home-service-card"
                }
              >
                <p className="home-service-for">{service.eyebrow}</p>
                <h2 className="home-service-name">{service.name}</h2>
                <p className="home-service-line">{service.line}</p>
                <span className="home-service-link">Explore →</span>
              </Link>
            ))}
```

- [ ] **Step 6: Run the data tests**

Run: `npm test`
Expected: PASS.

- [ ] **Step 7: Write the failing route test — `src/lib/routes.test.ts`**

```ts
import { describe, expect, it } from "vitest";
import { allRoutes, demoRoutes, pageRoutes } from "./routes";

describe("routes", () => {
  it("lists home, three services and nine workflow pages", () => {
    const routes = pageRoutes();
    expect(routes).toHaveLength(13);
    expect(routes[0]).toBe("/");
    expect(routes).toContain("/services/ai-integration");
    expect(routes).toContain("/services/automated-workflows/missed-call-text-back");
  });

  it("lists nine demo routes", () => {
    expect(demoRoutes()).toHaveLength(9);
    expect(demoRoutes()).toContain("/services/automated-workflows/tool-sync/demo");
  });

  it("has no duplicates, no trailing slashes", () => {
    const routes = allRoutes();
    expect(routes).toHaveLength(22);
    expect(new Set(routes).size).toBe(22);
    for (const r of routes) expect(r === "/" || !r.endsWith("/")).toBe(true);
  });
});
```

Run: `npm test` — expected: FAIL, `./routes` not found.

- [ ] **Step 8: Implement `src/lib/routes.ts`**

```ts
import { publishedServices, servicePath } from "../data/services";
import { workflows, type PublishedWorkflow } from "../data/workflows";
import { workflowDemoPath, workflowPath } from "../data/workflowPaths";

export const publishedWorkflows = (): PublishedWorkflow[] =>
  workflows.filter((w): w is PublishedWorkflow => w.published);

export const demoWorkflows = (): PublishedWorkflow[] =>
  publishedWorkflows().filter((w) => w.hasDemo);

/** Every page inside the site layout. */
export const pageRoutes = (): string[] => [
  "/",
  ...publishedServices.map((s) => servicePath(s.slug)),
  ...publishedWorkflows().map((w) => workflowPath(w.slug)),
];

export const demoRoutes = (): string[] =>
  demoWorkflows().map((w) => workflowDemoPath(w.slug));

/** Every indexable URL the build emits. One list for sitemap, OG cards, tests. */
export const allRoutes = (): string[] => [...pageRoutes(), ...demoRoutes()];
```

- [ ] **Step 9: e2e uses the same list**

Replace `e2e/routes.ts`:

```ts
import { demoRoutes as demos, pageRoutes as pages } from "../src/lib/routes";

export const pageRoutes: string[] = pages();
export const demoRoutes: string[] = demos();

/** "/services/x/y" → "services--x--y"; "/" → "home". */
export const snapshotName = (route: string): string =>
  route === "/" ? "home" : route.slice(1).replaceAll("/", "--");
```

- [ ] **Step 10: Gates**

Run: `npm test && npm run lint && npm run build && npm run e2e`
Expected: all green — the home page is pixel-identical because the card content moved, not changed.

- [ ] **Step 11: Commit (print for Brian)**

```bash
git add -A
git commit -m "feat: services.ts as source of truth, shared route list, Vitest"
```

---

### Task 6: Netlify config, 404 page, prerender proof

**Files:**
- Create: `.nvmrc`, `src/components/NotFound.tsx`, `src/app/not-found.tsx`, `e2e/prerender.spec.ts`, `src/lib/netlify.test.ts`
- Modify: `netlify.toml`

**Interfaces:**
- Consumes: `allRoutes()` (Task 5).

- [ ] **Step 1: Write the failing redirect test — `src/lib/netlify.test.ts`**

```ts
import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { allRoutes } from "./routes";

interface Redirect {
  from: string;
  to: string;
  status: number;
}

function parseRedirects(toml: string): Redirect[] {
  return toml
    .split("[[redirects]]")
    .slice(1)
    .map((block) => ({
      from: /from\s*=\s*"([^"]+)"/.exec(block)?.[1] ?? "",
      to: /to\s*=\s*"([^"]+)"/.exec(block)?.[1] ?? "",
      status: Number(/status\s*=\s*(\d+)/.exec(block)?.[1] ?? 0),
    }));
}

const toml = readFileSync("netlify.toml", "utf8");
const redirects = parseRedirects(toml);

describe("netlify.toml", () => {
  it("publishes the static export on Node 22", () => {
    expect(toml).toMatch(/publish\s*=\s*"out"/);
    expect(toml).toMatch(/NODE_VERSION\s*=\s*"22"/);
  });

  it("has no SPA catch-all", () => {
    expect(redirects.find((r) => r.from === "/*")).toBeUndefined();
  });

  it("never redirects away from a page the site builds", () => {
    const built = new Set(allRoutes());
    for (const r of redirects) expect(built.has(r.from), r.from).toBe(false);
  });

  it("keeps the nine legacy demo redirects, each a 301 to a built page", () => {
    const built = new Set(allRoutes());
    expect(redirects).toHaveLength(9);
    for (const r of redirects) {
      expect(r.from.startsWith("/demos/"), r.from).toBe(true);
      expect(r.status).toBe(301);
      expect(built.has(r.to), r.to).toBe(true);
    }
  });
});
```

Run: `npm test` — expected: FAIL on `publish`, the catch-all, and the `/services/automated-workflows` redirect.

- [ ] **Step 2: Rewrite the top and bottom of `netlify.toml`**

Replace the `[build]` block and the first redirect (the `/services/automated-workflows → /` rule and its two comment lines) with:

```toml
[build]
  command = "npm run build"
  publish = "out"

[build.environment]
  NODE_VERSION = "22"

# Legacy demo URLs → their home under the service route. Every other URL is a
# real file in out/ (Next static export), so there is no SPA catch-all, and
# unknown URLs get out/404.html automatically.
```

Keep the nine `/demos/*` redirect blocks exactly as they are. Delete the final `/* → /index.html` block and the now-redundant "MUST stay above the SPA catch-all" comments.

- [ ] **Step 3: `.nvmrc`**

```
22
```

- [ ] **Step 4: Run the redirect test**

Run: `npm test`
Expected: PASS.

- [ ] **Step 5: Write the failing prerender test — `e2e/prerender.spec.ts`**

```ts
import { test, expect } from "@playwright/test";
import { demoRoutes, pageRoutes } from "./routes";

// One viewport is enough: this checks the HTML, not the layout.
test.skip(({ viewport }) => viewport?.width !== 1280, "desktop project only");
test.use({ javaScriptEnabled: false });

for (const route of [...pageRoutes, ...demoRoutes]) {
  test(`prerendered without JavaScript: ${route}`, async ({ page }) => {
    const response = await page.goto(route);
    expect(response?.status()).toBe(200);
    await expect(page.locator("h1")).toHaveCount(1);
    await expect(page.locator("h1")).not.toBeEmpty();
  });
}

test("unknown URL serves the 404 page", async ({ page }) => {
  const response = await page.goto("/no-such-page");
  expect(response?.status()).toBe(404);
  await expect(page.locator("h1")).toHaveText("Page not found");
});
```

Run: `npx playwright test e2e/prerender.spec.ts --project=desktop`
Expected: the 22 route tests PASS (Task 4 already prerenders); the 404 test FAILS on the `<h1>` text (Next's default 404 says "404").

- [ ] **Step 6: The 404 page**

`src/components/NotFound.tsx` — reuses the home hero classes, so it needs no new CSS:

```tsx
import Link from "next/link";
import "./shared-sections.css";
import "./Home.css";

const NotFound = () => {
  return (
    <section className="home-hero">
      <div className="container">
        <div className="home-hero-content">
          <p className="wf-eyebrow">404</p>
          <h1 className="home-hero-title">Page not found</h1>
          <p className="home-hero-subtitle">
            That page doesn't exist or has moved.
          </p>
          <Link href="/" className="home-hero-btn">
            Back to the home page →
          </Link>
        </div>
      </div>
    </section>
  );
};

export default NotFound;
```

`src/app/not-found.tsx` — sits outside `(site)`, so it brings its own Header and Footer:

```tsx
import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import NotFound from "@/components/NotFound";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false, follow: false },
};

export default function NotFoundPage() {
  return (
    <>
      <Header />
      <main>
        <NotFound />
      </main>
      <Footer />
    </>
  );
}
```

- [ ] **Step 7: Gates**

Run: `npm test && npm run lint && npm run build && npm run e2e`
Expected: all green, including the 404 test. `out/404.html` exists.

- [ ] **Step 8: Commit (print for Brian)**

```bash
git add -A
git commit -m "feat: Netlify static-export config, real 404 page, prerender tests"
```

---

### Task 7: `src/lib/seo.ts`

Pure functions, fully unit-tested, no React. Nothing is wired into pages until Task 8.

**Files:**
- Modify: `src/data/site.ts`, `src/data/services.ts`
- Create: `src/lib/seo.ts`, `src/lib/seo.test.ts`

**Interfaces:**
- Consumes: `Service`, `servicePath`; `PublishedWorkflow`; `workflowPath`, `workflowDemoPath`.
- Produces (all from `src/lib/seo.ts` unless noted):
  - `src/data/site.ts`: `SITE_URL`, `SITE_NAME`, `SITE_SHORT_NAME`, `COMPANY_LINKEDIN_URL`, `HOME_TITLE`, `HOME_DESCRIPTION`
  - `src/data/services.ts`: `requireService(slug: string): Service` (throws on unknown slug)
  - `absoluteUrl(path: string): string`
  - `ogName(path: string): string`, `ogImagePath(path: string): string`
  - `clip(text: string, max?: number): string`
  - `pageMetadata(meta: { title: string; description: string; path: string; absoluteTitle?: boolean }): Metadata`
  - `workflowMeta(w: PublishedWorkflow): { title: string; description: string }`, `demoMeta(w)` same shape
  - `organizationJsonLd()`, `websiteJsonLd()`, `serviceJsonLd(s: Service)`, `workflowJsonLd(w: PublishedWorkflow)`, `faqJsonLd(faq: { q: string; a: string }[])`, `breadcrumbJsonLd(items: { name: string; path: string }[])`, `workflowBreadcrumb(w)`, `demoBreadcrumb(w)` — each returns `Record<string, unknown>`

- [ ] **Step 1: Site constants — append to `src/data/site.ts`**

`HOME_TITLE` and `HOME_DESCRIPTION` are the strings from the old `index.html`, verbatim.

```ts
export const SITE_URL = "https://paradigmshiftdev.io";
export const SITE_NAME = "Paradigm Shift Software Development";
export const SITE_SHORT_NAME = "Paradigm Shift";
/** The company page. Brian's personal profile belongs to the blog author (spec 2), not here. */
export const COMPANY_LINKEDIN_URL =
  "https://www.linkedin.com/company/paradigm-shift-tech-consulting/";
export const HOME_TITLE =
  "AI Automation for Small Business | Paradigm Shift Software Development";
export const HOME_DESCRIPTION =
  "AI-powered automation for small and trades businesses — missed-call text-back, review generation, quoting, invoicing, dispatch and more, built on the tools you already use. See nine working demos.";
```

- [ ] **Step 2: Write the failing tests — `src/lib/seo.test.ts`**

```ts
import { describe, expect, it } from "vitest";
import { requireService } from "../data/services";
import { publishedWorkflows } from "./routes";
import {
  absoluteUrl,
  breadcrumbJsonLd,
  clip,
  demoMeta,
  faqJsonLd,
  ogImagePath,
  ogName,
  organizationJsonLd,
  pageMetadata,
  serviceJsonLd,
  websiteJsonLd,
  workflowBreadcrumb,
  workflowJsonLd,
  workflowMeta,
} from "./seo";

const missedCall = publishedWorkflows().find(
  (w) => w.slug === "missed-call-text-back",
)!;

describe("urls", () => {
  it("builds absolute URLs with no trailing slash", () => {
    expect(absoluteUrl("/")).toBe("https://paradigmshiftdev.io");
    expect(absoluteUrl("/services/ai-integration")).toBe(
      "https://paradigmshiftdev.io/services/ai-integration",
    );
  });

  it("names OG images after the path", () => {
    expect(ogName("/")).toBe("home");
    expect(ogName("/services/automated-workflows/tool-sync/demo")).toBe(
      "services-automated-workflows-tool-sync-demo",
    );
    expect(ogImagePath("/")).toBe("/og/home.png");
  });
});

describe("clip", () => {
  it("returns short text unchanged, whitespace collapsed", () => {
    expect(clip("  a  b\n c ")).toBe("a b c");
  });

  it("cuts on a word boundary, never mid-word, and adds an ellipsis", () => {
    const out = clip("alpha beta gamma delta", 12);
    expect(out).toBe("alpha beta…");
    expect(out.length).toBeLessThanOrEqual(13);
  });

  it("drops trailing punctuation before the ellipsis", () => {
    expect(clip("alpha, beta gamma", 8)).toBe("alpha…");
  });
});

describe("pageMetadata", () => {
  const meta = pageMetadata({
    title: "AI Integration",
    description: "Desc",
    path: "/services/ai-integration",
  });

  it("sets title, description and a self-canonical", () => {
    expect(meta.title).toBe("AI Integration");
    expect(meta.description).toBe("Desc");
    expect(meta.alternates?.canonical).toBe("/services/ai-integration");
  });

  it("sets Open Graph and Twitter with the generated card", () => {
    expect(meta.openGraph).toMatchObject({
      url: "/services/ai-integration",
      title: "AI Integration | Paradigm Shift",
      description: "Desc",
      siteName: "Paradigm Shift Software Development",
    });
    expect(JSON.stringify(meta.openGraph)).toContain(
      "/og/services-ai-integration.png",
    );
    expect(meta.twitter).toMatchObject({ card: "summary_large_image" });
  });

  it("supports an absolute title for the home page", () => {
    const home = pageMetadata({
      title: "Whole title",
      description: "D",
      path: "/",
      absoluteTitle: true,
    });
    expect(home.title).toEqual({ absolute: "Whole title" });
    expect(home.openGraph).toMatchObject({ title: "Whole title" });
  });
});

describe("workflow and demo meta", () => {
  it("gives every workflow and demo a unique title and a 70–160 char description", () => {
    const all = publishedWorkflows().flatMap((w) => [workflowMeta(w), demoMeta(w)]);
    expect(new Set(all.map((m) => m.title)).size).toBe(all.length);
    expect(new Set(all.map((m) => m.description)).size).toBe(all.length);
    for (const m of all) {
      expect(m.description.length, m.title).toBeGreaterThanOrEqual(70);
      expect(m.description.length, m.title).toBeLessThanOrEqual(160);
    }
  });

  it("titles a workflow by label and summary", () => {
    expect(workflowMeta(missedCall).title).toBe(
      `${missedCall.label}: ${missedCall.cardSummary}`,
    );
    expect(demoMeta(missedCall).title).toBe(`Interactive Demo: ${missedCall.label}`);
  });
});

describe("JSON-LD", () => {
  it("describes the organization and website with stable ids", () => {
    expect(organizationJsonLd()).toMatchObject({
      "@context": "https://schema.org",
      "@type": "Organization",
      "@id": "https://paradigmshiftdev.io/#organization",
      name: "Paradigm Shift Software Development",
      url: "https://paradigmshiftdev.io",
      sameAs: ["https://www.linkedin.com/company/paradigm-shift-tech-consulting/"],
    });
    expect(websiteJsonLd()).toMatchObject({
      "@type": "WebSite",
      "@id": "https://paradigmshiftdev.io/#website",
      publisher: { "@id": "https://paradigmshiftdev.io/#organization" },
    });
  });

  it("describes a service, provided by the organization", () => {
    expect(serviceJsonLd(requireService("ai-integration"))).toMatchObject({
      "@type": "Service",
      name: "AI Integration",
      url: "https://paradigmshiftdev.io/services/ai-integration",
      provider: { "@id": "https://paradigmshiftdev.io/#organization" },
    });
  });

  it("describes a workflow as a service and never emits stats", () => {
    const data = workflowJsonLd(missedCall);
    expect(data).toMatchObject({
      "@type": "Service",
      name: missedCall.label,
      url: "https://paradigmshiftdev.io/services/automated-workflows/missed-call-text-back",
    });
    expect(JSON.stringify(data)).not.toContain("sourceUrl");
  });

  it("builds an FAQPage", () => {
    expect(faqJsonLd([{ q: "Q?", a: "A." }])).toEqual({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "Q?",
          acceptedAnswer: { "@type": "Answer", text: "A." },
        },
      ],
    });
  });

  it("builds breadcrumbs with 1-based positions and absolute URLs", () => {
    const data = breadcrumbJsonLd([
      { name: "Home", path: "/" },
      { name: "X", path: "/x" },
    ]);
    expect(data.itemListElement).toEqual([
      { "@type": "ListItem", position: 1, name: "Home", item: "https://paradigmshiftdev.io" },
      { "@type": "ListItem", position: 2, name: "X", item: "https://paradigmshiftdev.io/x" },
    ]);
    const crumbs = workflowBreadcrumb(missedCall).itemListElement as unknown[];
    expect(crumbs).toHaveLength(3);
  });
});
```

Run: `npm test` — expected: FAIL, `./seo` not found.

- [ ] **Step 3: `requireService` — append to `src/data/services.ts`**

```ts
/** For call sites where a missing service is a programming error. */
export const requireService = (slug: string): Service => {
  const service = getService(slug);
  if (!service) throw new Error(`Unknown service: ${slug}`);
  return service;
};
```

- [ ] **Step 4: Implement `src/lib/seo.ts`**

```ts
import type { Metadata } from "next";
import { requireService, servicePath, type Service } from "../data/services";
import {
  COMPANY_LINKEDIN_URL,
  HOME_DESCRIPTION,
  SITE_NAME,
  SITE_SHORT_NAME,
  SITE_URL,
} from "../data/site";
import { workflowDemoPath, workflowPath } from "../data/workflowPaths";
import type { PublishedWorkflow } from "../data/workflows";

type JsonLd = Record<string, unknown>;

const CONTEXT = "https://schema.org";
const ORGANIZATION_ID = `${SITE_URL}/#organization`;
const WEBSITE_ID = `${SITE_URL}/#website`;

export const absoluteUrl = (path: string): string =>
  path === "/" ? SITE_URL : `${SITE_URL}${path}`;

/** "/services/x" → "services-x"; "/" → "home". The OG route serves `<name>.png`. */
export const ogName = (path: string): string =>
  path === "/" ? "home" : path.slice(1).replaceAll("/", "-");

export const ogImagePath = (path: string): string => `/og/${ogName(path)}.png`;

/** Trim to `max` characters on a word boundary. Meta descriptions, not prose. */
export function clip(text: string, max = 158): string {
  const clean = text.replace(/\s+/g, " ").trim();
  if (clean.length <= max) return clean;
  const cut = clean.slice(0, max);
  const lastSpace = cut.lastIndexOf(" ");
  const body = cut.slice(0, lastSpace > 0 ? lastSpace : max);
  return `${body.replace(/[\s,;:—–-]+$/, "")}…`;
}

export interface PageMeta {
  title: string;
  description: string;
  path: string;
  /** Use `title` as the entire <title>, without the site suffix. */
  absoluteTitle?: boolean;
}

export function pageMetadata({
  title,
  description,
  path,
  absoluteTitle = false,
}: PageMeta): Metadata {
  const fullTitle = absoluteTitle ? title : `${title} | ${SITE_SHORT_NAME}`;
  const image = { url: ogImagePath(path), width: 1200, height: 630, alt: title };
  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      locale: "en_US",
      url: path,
      siteName: SITE_NAME,
      title: fullTitle,
      description,
      images: [image],
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [image.url],
    },
  };
}

export const workflowMeta = (
  w: PublishedWorkflow,
): { title: string; description: string } => ({
  title: `${w.label}: ${w.cardSummary}`,
  description: clip(w.hero.subhead),
});

export const demoMeta = (
  w: PublishedWorkflow,
): { title: string; description: string } => ({
  title: `Interactive Demo: ${w.label}`,
  description: clip(
    `Click through a working ${w.label} automation on a made-up business, step by step. ${w.cardSummary}. No signup, nothing to install.`,
  ),
});

export const organizationJsonLd = (): JsonLd => ({
  "@context": CONTEXT,
  "@type": "Organization",
  "@id": ORGANIZATION_ID,
  name: SITE_NAME,
  alternateName: SITE_SHORT_NAME,
  url: SITE_URL,
  logo: `${SITE_URL}/favicon/ps-favicon-512.png`,
  description: HOME_DESCRIPTION,
  sameAs: [COMPANY_LINKEDIN_URL],
});

export const websiteJsonLd = (): JsonLd => ({
  "@context": CONTEXT,
  "@type": "WebSite",
  "@id": WEBSITE_ID,
  name: SITE_NAME,
  url: SITE_URL,
  publisher: { "@id": ORGANIZATION_ID },
});

export const serviceJsonLd = (s: Service): JsonLd => ({
  "@context": CONTEXT,
  "@type": "Service",
  name: s.name,
  description: s.metaDescription,
  url: absoluteUrl(servicePath(s.slug)),
  provider: { "@id": ORGANIZATION_ID },
  audience: { "@type": "Audience", audienceType: s.eyebrow.replace(/^For /, "") },
});

/** Stats are deliberately absent: no figure travels without its source. */
export const workflowJsonLd = (w: PublishedWorkflow): JsonLd => ({
  "@context": CONTEXT,
  "@type": "Service",
  name: w.label,
  description: clip(w.hero.subhead),
  url: absoluteUrl(workflowPath(w.slug)),
  provider: { "@id": ORGANIZATION_ID },
});

export const faqJsonLd = (faq: { q: string; a: string }[]): JsonLd => ({
  "@context": CONTEXT,
  "@type": "FAQPage",
  mainEntity: faq.map((item) => ({
    "@type": "Question",
    name: item.q,
    acceptedAnswer: { "@type": "Answer", text: item.a },
  })),
});

export const breadcrumbJsonLd = (
  items: { name: string; path: string }[],
): JsonLd => ({
  "@context": CONTEXT,
  "@type": "BreadcrumbList",
  itemListElement: items.map((item, index) => ({
    "@type": "ListItem",
    position: index + 1,
    name: item.name,
    item: absoluteUrl(item.path),
  })),
});

const automationsCrumbs = (): { name: string; path: string }[] => {
  const automations = requireService("automated-workflows");
  return [
    { name: "Home", path: "/" },
    { name: automations.name, path: servicePath(automations.slug) },
  ];
};

export const workflowBreadcrumb = (w: PublishedWorkflow): JsonLd =>
  breadcrumbJsonLd([
    ...automationsCrumbs(),
    { name: w.label, path: workflowPath(w.slug) },
  ]);

export const demoBreadcrumb = (w: PublishedWorkflow): JsonLd =>
  breadcrumbJsonLd([
    ...automationsCrumbs(),
    { name: w.label, path: workflowPath(w.slug) },
    { name: "Demo", path: workflowDemoPath(w.slug) },
  ]);
```

- [ ] **Step 5: Run the tests**

Run: `npm test`
Expected: PASS. If the 70-character floor fails for a workflow, its `hero.subhead` is unexpectedly short — report it; do not pad copy.

- [ ] **Step 6: Gates and commit (print for Brian)**

Run: `npm run lint && npm run build`

```bash
git add -A
git commit -m "feat: seo lib — metadata and JSON-LD builders derived from site data"
```

---

### Task 8: Wire metadata and JSON-LD into every route

**Files:**
- Create: `src/components/JsonLd.tsx`, `src/data/faq.ts`, `e2e/seo.spec.ts`
- Modify: `src/app/layout.tsx`, the four static pages, the workflow page route, the demo page route, `src/components/AutomatedWorkflows.tsx`

**Interfaces:**
- Consumes: everything Task 7 produces.
- Produces: `JsonLd` component (`{ data: Record<string, unknown> }`); `automationsFaq: { q: string; a: string }[]` from `src/data/faq.ts`.

- [ ] **Step 1: Write the failing e2e test — `e2e/seo.spec.ts`**

```ts
import { test, expect } from "@playwright/test";
import { demoRoutes, pageRoutes } from "./routes";

test.skip(({ viewport }) => viewport?.width !== 1280, "desktop project only");

const ORIGIN = "https://paradigmshiftdev.io";

for (const route of [...pageRoutes, ...demoRoutes]) {
  test(`head metadata: ${route}`, async ({ page }) => {
    await page.goto(route);
    const canonical = route === "/" ? ORIGIN : `${ORIGIN}${route}`;
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", canonical);
    await expect(page.locator('meta[name="description"]')).toHaveAttribute("content", /.{70,}/);
    await expect(page.locator('meta[property="og:image"]')).toHaveAttribute(
      "content",
      new RegExp(`^${ORIGIN}/og/.+\\.png$`),
    );
    await expect(page.locator('meta[name="twitter:card"]')).toHaveAttribute(
      "content",
      "summary_large_image",
    );
  });
}

test("structured data by page type", async ({ page }) => {
  const typesOn = async (route: string): Promise<string[]> => {
    await page.goto(route);
    const blocks = await page.locator('script[type="application/ld+json"]').allTextContents();
    return blocks.map((b) => JSON.parse(b)["@type"] as string).sort();
  };

  expect(await typesOn("/")).toEqual(["Organization", "WebSite"]);
  expect(await typesOn("/services/ai-integration")).toEqual(["Organization", "Service", "WebSite"]);
  expect(await typesOn("/services/automated-workflows")).toEqual([
    "FAQPage", "Organization", "Service", "WebSite",
  ]);
  expect(await typesOn("/services/automated-workflows/missed-call-text-back")).toEqual([
    "BreadcrumbList", "FAQPage", "Organization", "Service", "WebSite",
  ]);
  expect(await typesOn("/services/automated-workflows/missed-call-text-back/demo")).toEqual([
    "BreadcrumbList", "Organization", "WebSite",
  ]);
});
```

Run: `npx playwright test e2e/seo.spec.ts --project=desktop` — expected: FAIL (no canonical).

- [ ] **Step 2: `src/components/JsonLd.tsx`**

```tsx
interface JsonLdProps {
  data: Record<string, unknown>;
}

/** `<` is escaped so page copy can never close the script element early. */
const JsonLd = ({ data }: JsonLdProps) => (
  <script
    type="application/ld+json"
    dangerouslySetInnerHTML={{
      __html: JSON.stringify(data).replace(/</g, "\\u003c"),
    }}
  />
);

export default JsonLd;
```

- [ ] **Step 3: Root layout**

In `src/app/layout.tsx`, add imports:

```tsx
import JsonLd from "@/components/JsonLd";
import { HOME_DESCRIPTION, HOME_TITLE, SITE_SHORT_NAME, SITE_URL } from "@/data/site";
import { organizationJsonLd, websiteJsonLd } from "@/lib/seo";
```

Replace the `title` and `description` lines of `metadata` with:

```tsx
  metadataBase: new URL(SITE_URL),
  title: { default: HOME_TITLE, template: `%s | ${SITE_SHORT_NAME}` },
  description: HOME_DESCRIPTION,
```

(keep the `icons` block), and replace `<body>{children}</body>` with:

```tsx
      <body>
        {children}
        <JsonLd data={organizationJsonLd()} />
        <JsonLd data={websiteJsonLd()} />
      </body>
```

- [ ] **Step 4: Home page — `src/app/(site)/page.tsx`**

```tsx
import Home from "@/components/Home";
import { HOME_DESCRIPTION, HOME_TITLE } from "@/data/site";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: HOME_TITLE,
  description: HOME_DESCRIPTION,
  path: "/",
  absoluteTitle: true,
});

export default function Page() {
  return <Home />;
}
```

- [ ] **Step 5: Move the automations FAQ into data**

Create `src/data/faq.ts` and move the `homeFaq` array out of `src/components/AutomatedWorkflows.tsx` into it **verbatim**, renamed:

```ts
/** The FAQ on the automations index page. Rendered by WorkflowFaq and emitted as FAQPage JSON-LD. */
export const automationsFaq: { q: string; a: string }[] = [
  {
    q: "Is this just ChatGPT with extra steps?",
    a: "No. It's an AI model doing a specific job inside the tools you already use — reading a message, deciding what to do, drafting a reply, updating a record — not a chatbot you have to go and talk to. You don't change how you work; the work just gets done.",
  },
  {
    q: "Is my business's data safe?",
    a: "Your data stays in the tools you already trust, and the automation only touches what the job needs. We'll walk you through exactly what it reads and writes on the call, and nothing goes live until you're comfortable with it.",
  },
  {
    q: "What happens when the AI gets something wrong?",
    a: "It's built to hand off, not to guess. Anything it isn't sure about comes to you with the full context instead of being sent blindly — and the steps that matter, like a quote going out or a public review, wait for your say-so.",
  },
  {
    q: "Do I have to switch tools?",
    a: "No. It's built on top of what you already use — your phone, your inbox, your scheduling and invoicing software. If a tool can't be connected cleanly, we'll tell you on the call rather than sell you a rebuild.",
  },
  {
    q: "What does it cost?",
    a: "Fixed scope, agreed up front — no hourly billing and no surprise scope creep. We work out what's worth automating first on a free call, and you get a price before anything is built.",
  },
];
```

These are the five objects currently in `AutomatedWorkflows.tsx` (`const homeFaq`); delete that array from the component — the copy must not change. In `AutomatedWorkflows.tsx` add `import { automationsFaq } from "../data/faq";` and change `<WorkflowFaq faq={homeFaq} />` to `<WorkflowFaq faq={automationsFaq} />`.

- [ ] **Step 6: The three service pages**

`src/app/(site)/services/automated-workflows/page.tsx`:

```tsx
import AutomatedWorkflows from "@/components/AutomatedWorkflows";
import JsonLd from "@/components/JsonLd";
import { automationsFaq } from "@/data/faq";
import { requireService, servicePath } from "@/data/services";
import { faqJsonLd, pageMetadata, serviceJsonLd } from "@/lib/seo";

const service = requireService("automated-workflows");

export const metadata = pageMetadata({
  title: service.metaTitle,
  description: service.metaDescription,
  path: servicePath(service.slug),
});

export default function Page() {
  return (
    <>
      <AutomatedWorkflows />
      <JsonLd data={serviceJsonLd(service)} />
      <JsonLd data={faqJsonLd(automationsFaq)} />
    </>
  );
}
```

`src/app/(site)/services/ai-integration/page.tsx`:

```tsx
import AiIntegration from "@/components/AiIntegration";
import JsonLd from "@/components/JsonLd";
import { requireService, servicePath } from "@/data/services";
import { pageMetadata, serviceJsonLd } from "@/lib/seo";

const service = requireService("ai-integration");

export const metadata = pageMetadata({
  title: service.metaTitle,
  description: service.metaDescription,
  path: servicePath(service.slug),
});

export default function Page() {
  return (
    <>
      <AiIntegration />
      <JsonLd data={serviceJsonLd(service)} />
    </>
  );
}
```

`src/app/(site)/services/technical-consulting/page.tsx`:

```tsx
import TechnicalConsulting from "@/components/TechnicalConsulting";
import JsonLd from "@/components/JsonLd";
import { requireService, servicePath } from "@/data/services";
import { pageMetadata, serviceJsonLd } from "@/lib/seo";

const service = requireService("technical-consulting");

export const metadata = pageMetadata({
  title: service.metaTitle,
  description: service.metaDescription,
  path: servicePath(service.slug),
});

export default function Page() {
  return (
    <>
      <TechnicalConsulting />
      <JsonLd data={serviceJsonLd(service)} />
    </>
  );
}
```

- [ ] **Step 7: Workflow page route** — replace `src/app/(site)/services/automated-workflows/[slug]/page.tsx`

```tsx
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import JsonLd from "@/components/JsonLd";
import WorkflowPage from "@/components/workflows/WorkflowPage";
import { workflowPath } from "@/data/workflowPaths";
import { getWorkflow, type PublishedWorkflow } from "@/data/workflows";
import { publishedWorkflows } from "@/lib/routes";
import {
  faqJsonLd,
  pageMetadata,
  workflowBreadcrumb,
  workflowJsonLd,
  workflowMeta,
} from "@/lib/seo";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export const dynamicParams = false;

export function generateStaticParams() {
  return publishedWorkflows().map((w) => ({ slug: w.slug }));
}

function load(slug: string): PublishedWorkflow {
  const workflow = getWorkflow(slug);
  if (!workflow || !workflow.published) notFound();
  return workflow;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const workflow = load((await params).slug);
  return pageMetadata({ ...workflowMeta(workflow), path: workflowPath(workflow.slug) });
}

export default async function Page({ params }: PageProps) {
  const workflow = load((await params).slug);
  return (
    <>
      <WorkflowPage workflow={workflow} />
      <JsonLd data={workflowJsonLd(workflow)} />
      <JsonLd data={workflowBreadcrumb(workflow)} />
      <JsonLd data={faqJsonLd(workflow.faq)} />
    </>
  );
}
```

- [ ] **Step 8: Demo page route** — replace `src/app/services/automated-workflows/[slug]/demo/page.tsx`

```tsx
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import JsonLd from "@/components/JsonLd";
import { workflowDemoPath } from "@/data/workflowPaths";
import type { PublishedWorkflow } from "@/data/workflows";
import { demoRegistry } from "@/demos/registry";
import { demoWorkflows } from "@/lib/routes";
import { demoBreadcrumb, demoMeta, pageMetadata } from "@/lib/seo";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export const dynamicParams = false;

export function generateStaticParams() {
  return demoWorkflows().map((w) => ({ slug: w.slug }));
}

function load(slug: string): PublishedWorkflow {
  const workflow = demoWorkflows().find((w) => w.slug === slug);
  if (!workflow || !demoRegistry[slug]) notFound();
  return workflow;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const workflow = load((await params).slug);
  return pageMetadata({ ...demoMeta(workflow), path: workflowDemoPath(workflow.slug) });
}

export default async function Page({ params }: PageProps) {
  const workflow = load((await params).slug);
  const Demo = demoRegistry[workflow.slug];
  return (
    <>
      <Demo />
      <JsonLd data={demoBreadcrumb(workflow)} />
    </>
  );
}
```

- [ ] **Step 9: Gates**

Run: `npm test && npm run lint && npm run build && npm run e2e`
Expected: all green. `og:image` URLs point at files that do not exist until Task 9; the test only checks the URL shape. Visual tests stay green — nothing visible changed.

- [ ] **Step 10: Commit (print for Brian)**

```bash
git add -A
git commit -m "feat: per-route metadata and JSON-LD"
```

---

### Task 9: OG images

**Files:**
- Create: `src/lib/og.ts`, `src/lib/og.test.ts`, `src/app/og/[name]/route.tsx`

**Interfaces:**
- Consumes: `allRoutes()`, `publishedWorkflows()`, `demoWorkflows()`, `ogName`, `ogImagePath`, `publishedServices`, `servicePath`, `workflowPath`, `workflowDemoPath`.
- Produces: `OgCard = { name: string; eyebrow: string; title: string }` and `ogCards(): OgCard[]`, where `name` is the file name including `.png`.

- [ ] **Step 1: Write the failing test — `src/lib/og.test.ts`**

```ts
import { describe, expect, it } from "vitest";
import { ogCards } from "./og";
import { allRoutes } from "./routes";
import { ogImagePath } from "./seo";

describe("ogCards", () => {
  const cards = ogCards();

  it("has exactly one card per route, matching the URL pageMetadata emits", () => {
    const expected = allRoutes().map((route) => ogImagePath(route)).sort();
    expect(cards.map((c) => `/og/${c.name}`).sort()).toEqual(expected);
  });

  it("has unique .png names and non-empty text", () => {
    expect(new Set(cards.map((c) => c.name)).size).toBe(cards.length);
    for (const card of cards) {
      expect(card.name).toMatch(/^[a-z0-9-]+\.png$/);
      expect(card.title.length).toBeGreaterThan(0);
      expect(card.eyebrow.length).toBeGreaterThan(0);
    }
  });
});
```

Run: `npm test` — expected: FAIL, `./og` not found.

- [ ] **Step 2: Implement `src/lib/og.ts`**

```ts
import { publishedServices, requireService, servicePath } from "../data/services";
import { SITE_SHORT_NAME } from "../data/site";
import { workflowDemoPath, workflowPath } from "../data/workflowPaths";
import { demoWorkflows, publishedWorkflows } from "./routes";
import { ogName } from "./seo";

export interface OgCard {
  name: string; // file name, including ".png"
  eyebrow: string;
  title: string;
}

const card = (path: string, eyebrow: string, title: string): OgCard => ({
  name: `${ogName(path)}.png`,
  eyebrow,
  title,
});

/** One social card per indexable route. */
export function ogCards(): OgCard[] {
  const automations = requireService("automated-workflows").name;
  return [
    card("/", SITE_SHORT_NAME, "AI automation and senior engineering for small business"),
    ...publishedServices.map((s) => card(servicePath(s.slug), s.eyebrow, s.name)),
    ...publishedWorkflows().map((w) => card(workflowPath(w.slug), automations, w.label)),
    ...demoWorkflows().map((w) => card(workflowDemoPath(w.slug), "Interactive demo", w.label)),
  ];
}
```

Run: `npm test` — expected: PASS.

- [ ] **Step 3: The route handler — `src/app/og/[name]/route.tsx`**

The param is the whole file name (`home.png`), so static export writes `out/og/home.png` with a real extension. Colors are the `index.css` theme values.

```tsx
import { ImageResponse } from "next/og";
import { SITE_NAME } from "@/data/site";
import { ogCards } from "@/lib/og";

export const dynamic = "force-static";
export const dynamicParams = false;

export function generateStaticParams() {
  return ogCards().map((card) => ({ name: card.name }));
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ name: string }> },
) {
  const { name } = await params;
  const card = ogCards().find((c) => c.name === name);
  if (!card) return new Response("Not found", { status: 404 });

  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          width: "100%",
          height: "100%",
          background: "linear-gradient(180deg, #f8fafc 0%, #eef2f7 100%)",
        }}
      >
        <div style={{ display: "flex", width: 24, height: "100%", background: "#2563eb" }} />
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            padding: "72px 80px",
            flex: 1,
          }}
        >
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", fontSize: 34, fontWeight: 600, color: "#2563eb" }}>
              {card.eyebrow}
            </div>
            <div
              style={{
                display: "flex",
                marginTop: 24,
                fontSize: card.title.length > 40 ? 64 : 80,
                fontWeight: 700,
                lineHeight: 1.1,
                color: "#0f172a",
              }}
            >
              {card.title}
            </div>
          </div>
          <div style={{ display: "flex", fontSize: 30, color: "#566072" }}>{SITE_NAME}</div>
        </div>
      </div>
    ),
    { width: 1200, height: 630 },
  );
}
```

- [ ] **Step 4: Build and look at the output**

Run: `npm run build && ls out/og | wc -l && file out/og/home.png`
Expected: `22`, and `PNG image data, 1200 x 630`.

Read `out/og/home.png` and `out/og/services-automated-workflows-missed-call-text-back.png` and confirm the text fits inside the card and nothing is clipped. If a long title overflows, lower the size threshold in the `fontSize` expression.

- [ ] **Step 5: Gates and commit (print for Brian)**

Run: `npm test && npm run lint && npm run e2e`

```bash
git add -A
git commit -m "feat: build-time Open Graph cards for every route"
```

---

### Task 10: `sitemap.xml`, `robots.txt`, `llms.txt`

**Files:**
- Create: `src/lib/llms.ts`, `src/lib/llms.test.ts`, `src/app/sitemap.ts`, `src/app/robots.ts`, `src/app/llms.txt/route.ts`

**Interfaces:**
- Consumes: `allRoutes()`, `absoluteUrl`, `publishedServices`, `publishedWorkflows()`, `demoWorkflows()`, `CALENDLY_URL`, `SITE_NAME`, `HOME_DESCRIPTION`.
- Produces: `buildLlmsTxt(): string`.

- [ ] **Step 1: Write the failing test — `src/lib/llms.test.ts`**

```ts
import { describe, expect, it } from "vitest";
import { buildLlmsTxt } from "./llms";

describe("buildLlmsTxt", () => {
  const text = buildLlmsTxt();

  it("opens with the site name and a blockquote summary", () => {
    const lines = text.split("\n");
    expect(lines[0]).toBe("# Paradigm Shift Software Development");
    expect(lines[2].startsWith("> ")).toBe(true);
  });

  it("lists three services, nine automations, nine demos and a contact link", () => {
    const section = (heading: string): string[] =>
      text.split(`## ${heading}\n\n`)[1].split("\n\n")[0].split("\n");
    expect(section("Services")).toHaveLength(3);
    expect(section("Automations")).toHaveLength(9);
    expect(section("Interactive demos")).toHaveLength(9);
    expect(section("Contact")).toHaveLength(1);
  });

  it("uses absolute URLs in markdown links", () => {
    expect(text).toContain(
      "- [AI Integration](https://paradigmshiftdev.io/services/ai-integration): ",
    );
    expect(text).not.toMatch(/\]\(\//);
  });
});
```

Run: `npm test` — expected: FAIL, `./llms` not found.

- [ ] **Step 2: Implement `src/lib/llms.ts`**

```ts
import { publishedServices, servicePath } from "../data/services";
import { CALENDLY_URL, HOME_DESCRIPTION, SITE_NAME } from "../data/site";
import { workflowDemoPath, workflowPath } from "../data/workflowPaths";
import { demoWorkflows, publishedWorkflows } from "./routes";
import { absoluteUrl } from "./seo";

const link = (name: string, path: string, note: string): string =>
  `- [${name}](${absoluteUrl(path)}): ${note}`;

/** https://llmstxt.org — a plain-markdown map of the site for language models. */
export function buildLlmsTxt(): string {
  const sections: string[] = [
    `# ${SITE_NAME}`,
    `> ${HOME_DESCRIPTION}`,
    [
      "## Services",
      "",
      ...publishedServices.map((s) => link(s.name, servicePath(s.slug), `${s.eyebrow}. ${s.line}`)),
    ].join("\n"),
    [
      "## Automations",
      "",
      ...publishedWorkflows().map((w) => link(w.label, workflowPath(w.slug), w.cardSummary)),
    ].join("\n"),
    [
      "## Interactive demos",
      "",
      ...demoWorkflows().map((w) =>
        link(
          `${w.label} demo`,
          workflowDemoPath(w.slug),
          "A working click-through on a made-up business.",
        ),
      ),
    ].join("\n"),
    ["## Contact", "", `- [Book a 30-minute call](${CALENDLY_URL})`].join("\n"),
  ];
  return `${sections.join("\n\n")}\n`;
}
```

Run: `npm test` — expected: PASS.

- [ ] **Step 3: The three route files**

`src/app/llms.txt/route.ts`:

```ts
import { buildLlmsTxt } from "@/lib/llms";

export const dynamic = "force-static";

export function GET() {
  return new Response(buildLlmsTxt(), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
```

`src/app/sitemap.ts` — no `lastModified`: the site has no trustworthy per-page dates, and a made-up one is worse than none. Spec 2 adds real dates for posts.

```ts
import type { MetadataRoute } from "next";
import { allRoutes } from "@/lib/routes";
import { absoluteUrl } from "@/lib/seo";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  return allRoutes().map((path) => ({ url: absoluteUrl(path) }));
}
```

`src/app/robots.ts` — everything is allowed; the AI crawlers are named so the intent is on the record.

```ts
import type { MetadataRoute } from "next";
import { SITE_URL } from "@/data/site";

export const dynamic = "force-static";

const AI_CRAWLERS = [
  "GPTBot",
  "OAI-SearchBot",
  "ChatGPT-User",
  "ClaudeBot",
  "Claude-SearchBot",
  "Claude-User",
  "PerplexityBot",
  "Perplexity-User",
  "Google-Extended",
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/" },
      { userAgent: AI_CRAWLERS, allow: "/" },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
```

- [ ] **Step 4: Build and check**

Run: `npm run build && grep -c "<loc>" out/sitemap.xml && head -5 out/robots.txt && head -3 out/llms.txt`
Expected: `22`; `robots.txt` starts with `User-Agent: *` / `Allow: /`; `llms.txt` starts with `# Paradigm Shift Software Development`.

- [ ] **Step 5: Gates and commit (print for Brian)**

Run: `npm test && npm run lint && npm run e2e`

```bash
git add -A
git commit -m "feat: generated sitemap.xml, robots.txt and llms.txt"
```

---

### Task 11: The SEO build gate

Runs after every `next build`. A page that ships without its metadata fails the build.

**Files:**
- Create: `scripts/verify-seo/checks.ts`, `scripts/verify-seo/checks.test.ts`, `scripts/verify-seo/run.ts`
- Modify: `package.json`

**Interfaces:**
- Produces: `verify(input: VerifyInput): string[]` — a list of human-readable problems, empty when the build is good. `VerifyInput = { pages: { path: string; html: string }[]; sitemapXml: string; siteUrl: string; fileExists: (publicPath: string) => boolean }`.

- [ ] **Step 1: Install**

```bash
npm install -D tsx@^4 node-html-parser@^7
```

- [ ] **Step 2: Write the failing tests — `scripts/verify-seo/checks.test.ts`**

```ts
import { describe, expect, it } from "vitest";
import { verify, type VerifyInput } from "./checks";

const SITE = "https://example.com";

const page = (path: string, overrides: Partial<Record<string, string>> = {}): string => {
  const url = path === "/" ? SITE : `${SITE}${path}`;
  const parts = {
    title: `<title>Title ${path}</title>`,
    description: `<meta name="description" content="Description ${path}">`,
    canonical: `<link rel="canonical" href="${url}">`,
    og: `<meta property="og:image" content="${SITE}/og/x.png">`,
    body: `<h1>Heading</h1><script type="application/ld+json">{"@type":"WebSite"}</script>`,
    ...overrides,
  };
  return `<html><head>${parts.title}${parts.description}${parts.canonical}${parts.og}</head><body>${parts.body}</body></html>`;
};

const sitemap = (paths: string[]): string =>
  `<urlset>${paths.map((p) => `<url><loc>${p === "/" ? SITE : SITE + p}</loc></url>`).join("")}</urlset>`;

const input = (pages: { path: string; html: string }[], paths?: string[]): VerifyInput => ({
  pages,
  sitemapXml: sitemap(paths ?? pages.map((p) => p.path)),
  siteUrl: SITE,
  fileExists: () => true,
});

describe("verify", () => {
  it("passes a good build", () => {
    expect(verify(input([{ path: "/", html: page("/") }, { path: "/a", html: page("/a") }]))).toEqual([]);
  });

  it.each([
    ["title", "missing <title>"],
    ["description", "missing meta description"],
    ["canonical", "missing canonical"],
    ["og", "missing og:image"],
  ])("reports a page with no %s", (part, message) => {
    const problems = verify(input([{ path: "/a", html: page("/a", { [part]: "" }) }]));
    expect(problems).toContain(`/a: ${message}`);
  });

  it("reports a canonical that is not the page's own URL", () => {
    const html = page("/a", { canonical: `<link rel="canonical" href="${SITE}/b">` });
    expect(verify(input([{ path: "/a", html }]))).toContain(
      `/a: canonical is ${SITE}/b, expected ${SITE}/a`,
    );
  });

  it("reports zero or several h1s", () => {
    expect(verify(input([{ path: "/a", html: page("/a", { body: "<p>x</p>" }) }]))).toContain(
      "/a: expected exactly one <h1>, found 0",
    );
    expect(
      verify(input([{ path: "/a", html: page("/a", { body: "<h1>a</h1><h1>b</h1>" }) }])),
    ).toContain("/a: expected exactly one <h1>, found 2");
  });

  it("reports JSON-LD that does not parse", () => {
    const body = `<h1>x</h1><script type="application/ld+json">{oops</script>`;
    expect(verify(input([{ path: "/a", html: page("/a", { body }) }]))).toContain(
      "/a: JSON-LD block 1 does not parse",
    );
  });

  it("reports an og:image whose file was not built", () => {
    const problems = verify({ ...input([{ path: "/a", html: page("/a") }]), fileExists: () => false });
    expect(problems).toContain("/a: og:image /og/x.png was not built");
  });

  it("reports duplicate titles and descriptions across pages", () => {
    const same = { title: "<title>Same</title>", description: `<meta name="description" content="Same">` };
    const problems = verify(
      input([
        { path: "/a", html: page("/a", same) },
        { path: "/b", html: page("/b", same) },
      ]),
    );
    expect(problems).toContain('duplicate title "Same": /a, /b');
    expect(problems).toContain('duplicate description "Same": /a, /b');
  });

  it("reports pages missing from the sitemap and sitemap URLs with no page", () => {
    const problems = verify(input([{ path: "/a", html: page("/a") }], ["/b"]));
    expect(problems).toContain("/a: not in sitemap.xml");
    expect(problems).toContain(`sitemap.xml lists ${SITE}/b, which was not built`);
  });
});
```

Run: `npm test` — expected: FAIL, `./checks` not found.

- [ ] **Step 3: Implement `scripts/verify-seo/checks.ts`**

```ts
import { parse } from "node-html-parser";

export interface BuiltPage {
  path: string;
  html: string;
}

export interface VerifyInput {
  pages: BuiltPage[];
  sitemapXml: string;
  siteUrl: string;
  /** Does this site-root-relative path ("/og/home.png") exist in the build output? */
  fileExists: (publicPath: string) => boolean;
}

function duplicates(label: string, values: Map<string, string[]>): string[] {
  return [...values.entries()]
    .filter(([, paths]) => paths.length > 1)
    .map(([value, paths]) => `duplicate ${label} "${value}": ${paths.join(", ")}`);
}

export function verify({ pages, sitemapXml, siteUrl, fileExists }: VerifyInput): string[] {
  const problems: string[] = [];
  const titles = new Map<string, string[]>();
  const descriptions = new Map<string, string[]>();
  const urlOf = (path: string): string => (path === "/" ? siteUrl : `${siteUrl}${path}`);

  for (const { path, html } of pages) {
    const root = parse(html);

    const title = root.querySelector("title")?.text.trim() ?? "";
    if (!title) problems.push(`${path}: missing <title>`);
    else titles.set(title, [...(titles.get(title) ?? []), path]);

    const description =
      root.querySelector('meta[name="description"]')?.getAttribute("content")?.trim() ?? "";
    if (!description) problems.push(`${path}: missing meta description`);
    else descriptions.set(description, [...(descriptions.get(description) ?? []), path]);

    const canonical = root.querySelector('link[rel="canonical"]')?.getAttribute("href") ?? "";
    if (!canonical) problems.push(`${path}: missing canonical`);
    else if (canonical !== urlOf(path)) {
      problems.push(`${path}: canonical is ${canonical}, expected ${urlOf(path)}`);
    }

    const ogImage = root.querySelector('meta[property="og:image"]')?.getAttribute("content") ?? "";
    if (!ogImage) problems.push(`${path}: missing og:image`);
    else {
      const publicPath = new URL(ogImage).pathname;
      if (!fileExists(publicPath)) problems.push(`${path}: og:image ${publicPath} was not built`);
    }

    const h1Count = root.querySelectorAll("h1").length;
    if (h1Count !== 1) problems.push(`${path}: expected exactly one <h1>, found ${h1Count}`);

    root.querySelectorAll('script[type="application/ld+json"]').forEach((script, index) => {
      try {
        JSON.parse(script.text);
      } catch {
        problems.push(`${path}: JSON-LD block ${index + 1} does not parse`);
      }
    });
  }

  problems.push(...duplicates("title", titles), ...duplicates("description", descriptions));

  const inSitemap = new Set([...sitemapXml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]));
  const built = new Set(pages.map((p) => urlOf(p.path)));
  for (const p of pages) {
    if (!inSitemap.has(urlOf(p.path))) problems.push(`${p.path}: not in sitemap.xml`);
  }
  for (const url of inSitemap) {
    if (!built.has(url)) problems.push(`sitemap.xml lists ${url}, which was not built`);
  }

  return problems;
}
```

Run: `npm test` — expected: PASS.

- [ ] **Step 4: The CLI — `scripts/verify-seo/run.ts`**

```ts
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { join, relative, sep } from "node:path";
import { SITE_URL } from "../../src/data/site";
import { verify, type BuiltPage } from "./checks";

const OUT = "out";

/** Not part of this site's metadata contract. */
const EXCLUDED_FILES = new Set(["404.html", "_not-found.html"]);
const EXCLUDED_DIRS = new Set(["activebalance", "_next"]);

function htmlFiles(dir: string): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) {
      return dir === OUT && EXCLUDED_DIRS.has(entry.name) ? [] : htmlFiles(full);
    }
    const isPage = entry.name.endsWith(".html") && !(dir === OUT && EXCLUDED_FILES.has(entry.name));
    return isPage ? [full] : [];
  });
}

/** out/index.html → "/", out/services/x.html → "/services/x" */
function toPath(file: string): string {
  const rel = relative(OUT, file).split(sep).join("/").replace(/\.html$/, "");
  return rel === "index" ? "/" : `/${rel}`;
}

const pages: BuiltPage[] = htmlFiles(OUT).map((file) => ({
  path: toPath(file),
  html: readFileSync(file, "utf8"),
}));

const problems = verify({
  pages,
  sitemapXml: readFileSync(join(OUT, "sitemap.xml"), "utf8"),
  siteUrl: SITE_URL,
  fileExists: (publicPath) => existsSync(join(OUT, publicPath)),
});

if (problems.length > 0) {
  console.error(`SEO gate: ${problems.length} problem(s) in ${pages.length} pages\n`);
  for (const problem of problems) console.error(`  ✗ ${problem}`);
  process.exit(1);
}

console.log(`SEO gate: ${pages.length} pages OK`);
```

- [ ] **Step 5: Hook it to the build**

Add to `package.json` scripts:

```json
"postbuild": "tsx scripts/verify-seo/run.ts",
"verify:seo": "tsx scripts/verify-seo/run.ts"
```

- [ ] **Step 6: Run the gate for real**

Run: `npm run build`
Expected: ends with `SEO gate: 22 pages OK`. Any problem it reports is a genuine defect in Tasks 8–10 — fix the page, not the gate.

- [ ] **Step 7: Prove the gate can fail**

Temporarily delete the `export const metadata = …` block from `src/app/(site)/services/ai-integration/page.tsx`, run `npm run build`, and confirm it exits non-zero reporting `/services/ai-integration: missing canonical` and a duplicate title/description with `/`. Restore the file exactly and re-run `npm run build` to green. (`git diff` must be empty for that file afterwards.)

- [ ] **Step 8: Gates and commit (print for Brian)**

Run: `npm test && npm run lint && npm run build && npm run e2e`

```bash
git add -A
git commit -m "feat: post-build SEO gate"
```

---

### Task 12: Re-baseline, docs, spec sync

**Files:**
- Regenerate: `e2e/__screenshots__/**`
- Modify: `CLAUDE.md`, `README.md`, `docs/superpowers/specs/2026-09-20-next-migration-design.md`

- [ ] **Step 1: Confirm parity one last time against the Vite baselines**

Run: `npm run e2e`
Expected: green. These are still the screenshots taken from the Vite build in Task 1 — this run is the proof of parity.

- [ ] **Step 2: Regenerate baselines from the Next build**

Run: `npm run e2e:update && npm run e2e`
Expected: green. Run `git status --short e2e/__screenshots__` — most PNGs are rewritten with sub-threshold differences. From here on the suite is regression coverage.

- [ ] **Step 3: Rewrite the stale sections of `CLAUDE.md`**

Replace **Tech Stack**, **Project Structure** (through the `workflows.ts` paragraph), **Key Details** and **Commands** with:

````markdown
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
  The build fails otherwise: the gate requires a unique title and description, a
  self-canonical, a built `og:image`, exactly one `<h1>`, valid JSON-LD, and agreement
  between `sitemap.xml` and the built pages.
- **URLs have no trailing slash.** Netlify serves `out/services/x.html` at `/services/x`.
- **Redirects.** `netlify.toml` holds only the nine legacy `/demos/*` 301s. There is no
  SPA catch-all; unknown URLs get `out/404.html`. `src/lib/netlify.test.ts` enforces this.
- **Static export limits.** No middleware, no ISR, no server actions, no `next/image`
  optimizer. Route handlers must be `force-static`.
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
- `npm run e2e` — Playwright (builds first). `npm run e2e:update` regenerates visual
  baselines — only after an intentional visual change, and look at the diff first.

**Definition of done:** `npm test` → `npm run lint` → `npm run build` → `npm run e2e`.
````

Also update the **Overview** paragraph: it says "Two service lines"; there are three — add **AI Integration** (targets startups and product teams embedding AI into an existing product). Leave **Content Reference** as is.

- [ ] **Step 4: `README.md`**

Replace Vite references: line 8 "**Vite** for fast development and building" → "**Next.js** (static export) for development and building"; line 42 and line 58 `dist` → `out`; line 102 "Fast build times with Vite" → "Static HTML for every route (Next.js static export)". Read the surrounding lines first and fix any other Vite-specific instruction (dev port is now 3000).

- [ ] **Step 5: Sync docs to the Obsidian vault**

```bash
V=/Users/brian/Documents/dev-vault/projects/paradigm/consulting-website
mkdir -p "$V/docs/superpowers/plans" "$V/docs/superpowers/specs"
cp CLAUDE.md README.md "$V/"
cp docs/superpowers/plans/2026-09-20-next-migration.md "$V/docs/superpowers/plans/"
cp docs/superpowers/specs/2026-09-20-next-migration-design.md "$V/docs/superpowers/specs/"
```

(Copying is a file write, not a git write — run it.)

- [ ] **Step 6: Full gate and commit (print for Brian)**

Run: `npm test && npm run lint && npm run build && npm run e2e`

```bash
git add -A
git commit -m "docs: CLAUDE.md and README for Next.js; re-baseline visual suite"
```

---

### Task 13: Deploy preview and launch (Brian, with the agent assisting)

The first place redirects, the 404, content types and Netlify's Next detection can be checked for real.

- [ ] **Step 1: Push and open a PR (print for Brian)**

```bash
git push -u origin next-migration
gh pr create --title "Migrate to Next.js static export" --body "Implements docs/superpowers/specs/2026-09-20-next-migration-design.md"
```

- [ ] **Step 2: Check the deploy preview**

With `P` set to the preview origin Netlify posts on the PR:

```bash
P=https://deploy-preview-N--<site>.netlify.app

# Real page, direct load (this URL bounced to "/" before the migration)
curl -s -o /dev/null -w "%{http_code}\n" $P/services/automated-workflows        # 200

# The nine legacy redirects
for s in win-back-campaign missed-call-text-back review-generation automated-quoting \
         invoice-reminders onboarding dispatch weekly-reports tool-sync; do
  curl -s -o /dev/null -w "%{http_code} %{redirect_url}\n" $P/demos/$s            # 301 → …/demo
done

# 404, and content types
curl -s -o /dev/null -w "%{http_code}\n" $P/no-such-page                          # 404
curl -sI $P/og/home.png | grep -i content-type                                    # image/png
curl -sI $P/llms.txt    | grep -i content-type                                    # text/plain
curl -sI $P/sitemap.xml | grep -i content-type                                    # application/xml or text/xml
curl -s  $P/activebalance/ | grep -c "Active Balance"                             # ≥ 1
```

- [ ] **Step 3: Confirm Netlify deployed no functions**

In the deploy log and the deploy's **Functions** tab: expected zero functions. Netlify auto-detects Next.js and may attach its runtime; a static export needs none. If functions appear, add to `netlify.toml` under `[build.environment]`:

```toml
  NETLIFY_NEXT_PLUGIN_SKIP = "true"
```

re-run `npm test` (the redirect test still passes), and have Brian push.

- [ ] **Step 4: Validate a page's social card and structured data**

Paste the preview URL of the home page and one workflow page into https://www.opengraph.xyz and https://validator.schema.org. Expected: the generated card renders; no structured-data errors.

- [ ] **Step 5: Merge, then post-launch (Brian)**

After merging and the production deploy: submit `https://paradigmshiftdev.io/sitemap.xml` in Google Search Console and Bing Webmaster Tools. Rollback, if ever needed: Netlify → Deploys → the last pre-merge deploy → **Publish deploy**.
