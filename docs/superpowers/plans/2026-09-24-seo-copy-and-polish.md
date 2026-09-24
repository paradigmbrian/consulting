# SEO Copy and Post-Migration Polish — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship hand-written, length-enforced page metadata, the AI Integration hero as designed, bold Open Graph cards, a `favicon.ico`, and screenshot baselines in Git LFS — then take the migrated site through its first deploy preview and launch.

**Architecture:** All copy lives in `src/data/*` and is consumed by `src/lib/seo.ts`; the post-build gate in `scripts/verify-seo/` grows two rules so the bounds cannot drift. CSS and font changes are file-local. The LFS migration is a single history rewrite of unpushed commits, run last, with Brian's confirmation at run time.

**Tech Stack:** Next 16.3.5 (static export), React 19, TypeScript 5.9, Vitest 5, Playwright 1.63, `next/og`, fonttools via `uvx`, `png-to-ico` via `npx`, Git LFS via Homebrew.

**Spec:** `docs/superpowers/specs/2026-09-24-seo-copy-and-polish-design.md`

## Global Constraints

- Repo: `/Users/brian/Development/paradigm/consulting-website`, branch `main` (local `main` = `f650dc7`; `origin/main` = `e8fa1f9`, nothing pushed). Work directly on `main`.
- **Git:** local `add`/`commit` are fine; stage by explicit path, never `git add -A`. The six untracked docs under `docs/superpowers/` that belong to other plans stay untracked. End every commit message with the `Co-Authored-By:` trailer from your session's attribution reminder. **Never push** — every push in Task 8 needs Brian's explicit approval for that specific push. The LFS migration (Task 7) is a history rewrite and needs Brian's confirmation at the moment it runs.
- Site origin `https://paradigmshiftdev.io`; `trailingSlash` stays `false`; URLs unchanged.
- Copy is exactly the strings in the spec §1 (and reproduced in Task 1). Every description is 70–160 characters; every workflow/demo title including ` | Paradigm Shift` is ≤ 60. The home title stays the 70-character absolute title.
- The only visual change is `/services/ai-integration` (Task 3). No other screenshot baseline may change; Task 3 regenerates exactly its three.
- No new npm dependencies. `png-to-ico` and fonttools run through `npx` / `uvx` once.
- `public/activebalance/` is never edited.
- Markdown created or edited in the repo is also copied to `/Users/brian/Documents/dev-vault/projects/paradigm/consulting-website/<same relative path>`.
- Definition of done for every task: `npm test` → `npm run lint` → `npm run typecheck` → `npm run build` (ends `SEO gate: 22 pages OK`) → `npm run e2e` (140 passed / 94 skipped), all green. `npm run e2e` binds port 4173; check it is free first and leave nothing listening.

---

### Task 1: Hand-written metadata and title pattern

**Files:**
- Modify: `src/data/workflows.ts` (interface at lines 42–49; nine insertions before the `stats:` lines 74, 172, 271, 385, 483, 598, 697, 795, 893)
- Modify: `src/data/site.ts:11-12`
- Modify: `src/lib/seo.ts:28-36, 76-90, 124-131`
- Modify: `src/lib/seo.test.ts`

**Interfaces:**
- Produces: `WorkflowContent.metaDescription: string`, `WorkflowContent.demoDescription: string` (required on every published workflow); `workflowMeta(w)` → `{ title: w.label, description: w.metaDescription }`; `demoMeta(w)` → `{ title: \`${w.label} Demo\`, description: w.demoDescription }`; `clip` no longer exists.

- [ ] **Step 1: Write the failing tests**

In `src/lib/seo.test.ts`, delete the whole `describe("clip", …)` block (lines 43–57) and remove `clip` from the import list. Replace the `describe("workflow and demo meta", …)` block (lines 97–114) with:

```ts
describe("workflow and demo meta", () => {
  const all = publishedWorkflows().flatMap((w) => [workflowMeta(w), demoMeta(w)]);

  it("gives every workflow and demo a unique title and description", () => {
    expect(new Set(all.map((m) => m.title)).size).toBe(all.length);
    expect(new Set(all.map((m) => m.description)).size).toBe(all.length);
  });

  it("keeps every description within 70–160 characters", () => {
    for (const m of all) {
      expect(m.description.length, m.title).toBeGreaterThanOrEqual(70);
      expect(m.description.length, m.title).toBeLessThanOrEqual(160);
    }
  });

  it("keeps every title, with the site suffix, within 60 characters", () => {
    for (const m of all) {
      expect(`${m.title} | Paradigm Shift`.length, m.title).toBeLessThanOrEqual(60);
    }
  });

  it("titles a workflow by its label and a demo by label + Demo", () => {
    expect(workflowMeta(missedCall).title).toBe(missedCall.label);
    expect(demoMeta(missedCall).title).toBe(`${missedCall.label} Demo`);
  });

  it("uses the hand-written descriptions, not the hero copy", () => {
    expect(workflowMeta(missedCall).description).toBe(missedCall.metaDescription);
    expect(demoMeta(missedCall).description).toBe(missedCall.demoDescription);
    expect(workflowJsonLd(missedCall).description).toBe(missedCall.metaDescription);
  });
});

describe("site", () => {
  it("keeps the home description within 70–160 characters", () => {
    expect(HOME_DESCRIPTION.length).toBeGreaterThanOrEqual(70);
    expect(HOME_DESCRIPTION.length).toBeLessThanOrEqual(160);
  });
});
```

Add `import { HOME_DESCRIPTION } from "../data/site";` to the imports.

- [ ] **Step 2: Run the tests to see them fail**

Run: `npx vitest run src/lib/seo.test.ts`
Expected: FAIL — `missedCall.metaDescription` is `undefined` so the description tests throw, the title test fails on `Missed-Call Text-Back: Instant reply…`, and the home description test fails at 196 characters.

- [ ] **Step 3: Add the two fields to the type**

In `src/data/workflows.ts`, replace lines 42–49 with:

```ts
export interface WorkflowContent {
  hero: { headline: string; subhead: string };
  metaDescription: string; // <meta name="description"> and Service JSON-LD; 70–160 chars
  demoDescription: string; // the demo page's <meta name="description">; 70–160 chars
  stats: Stat[]; // empty ⇒ section omitted
  painPoints: string[];
  mechanism: { title: string; description: string }[];
  faq: { q: string; a: string }[];
  showcase: Showcase; // per-workflow product-shots + feature rows (Phase-2)
}
```

- [ ] **Step 4: Add the copy to the nine workflows**

In each workflow object, insert the two fields immediately before its `stats:` line (the `hero: { … },` block ends just above it). Use these exact strings:

`win-back-campaigns`:
```ts
    metaDescription:
      "Picks out the past customers who are actually due for work, gives each one a reason that fits their last job, and contacts only them. No blast discounts.",
    demoDescription:
      "Click through the Win-Back Campaigns automation on a made-up business: who gets picked, what they are sent and why. No signup, nothing to install.",
```

`missed-call-text-back`:
```ts
    metaDescription:
      "Miss a call and it texts the caller back in seconds, answers their questions and books the job, so leads stop dialing the next company on the list.",
    demoDescription:
      "Click through the Missed-Call Text-Back automation on a made-up business: the missed call, the reply and the booking. No signup, nothing to install.",
```

`review-generation`:
```ts
    metaDescription:
      "Asks every customer how the job went, points the happy ones at Google and routes the unhappy ones to you while there is still a problem you can fix.",
    demoDescription:
      "Click through the Review Generation automation on a made-up business: the ask, the happy path to Google, the unhappy one to you. No signup, no install.",
```

`automated-quoting`:
```ts
    metaDescription:
      "Reads an incoming request, builds an itemized quote from your own pricing and puts it in front of you to approve the same day, not after dinner.",
    demoDescription:
      "Click through the Automated Quoting automation on a made-up business: the request, the itemized quote and your approval. No signup, nothing to install.",
```

`invoice-reminders`:
```ts
    metaDescription:
      "Follows up on unpaid invoices on a schedule, in a tone you would put your name to, and stops the moment the customer pays. No more evenings chasing money.",
    demoDescription:
      "Click through the Invoice & Payment Reminders automation on a made-up business: each follow-up, and the moment it stops. No signup, nothing to install.",
```

`new-customer-onboarding`:
```ts
    metaDescription:
      "Sends the welcome the moment a customer books, collects the paperwork and access details in one message, and gets the first visit onto the calendar.",
    demoDescription:
      "Click through the New-Customer Onboarding automation on a made-up business: welcome, paperwork, access details and first visit. No signup, nothing to install.",
```

`job-dispatch`:
```ts
    metaDescription:
      "Sorts incoming jobs against skills, zones and the arrival windows you have already promised, routes each van and tells the customer when to expect someone.",
    demoDescription:
      "Click through the Job Scheduling & Dispatch automation on a made-up business: the job pile, the routing, the customer notice. No signup, nothing to install.",
```

`weekly-owner-reports`:
```ts
    metaDescription:
      "Pulls the numbers from your job software, invoicing and calendar every week and puts a short, readable summary in your inbox. What you do next is your call.",
    demoDescription:
      "Click through the Weekly Owner Reports automation on a made-up business: scattered numbers in, a readable summary out. No signup, nothing to install.",
```

`tool-sync`:
```ts
    metaDescription:
      "Moves job details between your scheduler, invoicing and books so data is entered once and lands wherever it is needed. No retyping, no records that disagree.",
    demoDescription:
      "Click through the Tool-to-Tool Sync automation on a made-up business: one entry in the scheduler, landing in invoicing and books. No signup, no install.",
```

- [ ] **Step 5: Rewrite the home description**

In `src/data/site.ts`, replace the `HOME_DESCRIPTION` value with:

```ts
export const HOME_DESCRIPTION =
  "AI automation for small and trades businesses: missed-call text-back, review requests, quoting, invoice reminders and dispatch, on the tools you already use.";
```

- [ ] **Step 6: Update the builders and delete `clip`**

In `src/lib/seo.ts`, delete the `clip` function and its doc comment (lines 28–36). Replace `workflowMeta` and `demoMeta` (lines 76–90) with:

```ts
export const workflowMeta = (
  w: PublishedWorkflow,
): { title: string; description: string } => ({
  title: w.label,
  description: w.metaDescription,
});

export const demoMeta = (
  w: PublishedWorkflow,
): { title: string; description: string } => ({
  title: `${w.label} Demo`,
  description: w.demoDescription,
});
```

In `workflowJsonLd`, change `description: clip(w.hero.subhead),` to `description: w.metaDescription,`.

Run `grep -rn "clip(" src scripts e2e` — expected: no matches.

- [ ] **Step 7: Run the tests to see them pass**

Run: `npm test`
Expected: PASS, 55 tests → the seo file now has 5 workflow/demo tests + 1 site test in place of the previous 5 (clip ×3, meta ×2); total 56.

- [ ] **Step 8: Gates**

Run: `npm run lint && npm run typecheck && npm run build && npm run e2e`
Expected: all green; the build's gate still says `SEO gate: 22 pages OK`; `npm run e2e` 140 passed / 94 skipped with **no** screenshot change (`git status --short e2e/__screenshots__` empty). Spot-check `grep -o '<title>[^<]*</title>' out/services/automated-workflows/invoice-reminders/demo.html` → `Invoice & Payment Reminders Demo | Paradigm Shift`.

- [ ] **Step 9: Commit**

```bash
git add src/data/workflows.ts src/data/site.ts src/lib/seo.ts src/lib/seo.test.ts
git commit -m "feat(seo): hand-written meta descriptions, label-only titles"
```

---

### Task 2: Gate rule — description length

**Files:**
- Modify: `scripts/verify-seo/checks.ts:46-49`
- Modify: `scripts/verify-seo/checks.test.ts`

**Interfaces:**
- Produces: a new problem string `${path}: description is ${n} chars, expected 70–160`.

- [ ] **Step 1: Write the failing test**

The fixture's default description (`Description /a`, 14 chars) would itself trip the new rule, so first change the `description:` line of the `page()` helper in `scripts/verify-seo/checks.test.ts` (line 10) to:

```ts
    description: `<meta name="description" content="Description for ${path}: long enough to clear the seventy-character floor that the gate enforces.">`,
```

Then append inside `describe("verify", …)`:

```ts
  it.each([
    ["a".repeat(69), 69],
    ["a".repeat(161), 161],
  ])("reports a description outside 70–160 characters", (text, length) => {
    const html = page("/a", { description: `<meta name="description" content="${text}">` });
    expect(verify(input([{ path: "/a", html }]))).toContain(
      `/a: description is ${length} chars, expected 70–160`,
    );
  });

  it("accepts a 70-character and a 160-character description", () => {
    for (const text of ["b".repeat(70), "c".repeat(160)]) {
      const html = page("/a", { description: `<meta name="description" content="${text}">` });
      expect(verify(input([{ path: "/a", html }]))).toEqual([]);
    }
  });
```

- [ ] **Step 2: Run it to see it fail**

Run: `npx vitest run scripts/verify-seo/checks.test.ts`
Expected: the two out-of-range cases FAIL (no such problem string); the in-range case passes already.

- [ ] **Step 3: Implement**

In `scripts/verify-seo/checks.ts`, replace lines 46–49 with:

```ts
    const description =
      root.querySelector('meta[name="description"]')?.getAttribute("content")?.trim() ?? "";
    if (!description) problems.push(`${path}: missing meta description`);
    else {
      descriptions.set(description, [...(descriptions.get(description) ?? []), path]);
      if (description.length < 70 || description.length > 160) {
        problems.push(`${path}: description is ${description.length} chars, expected 70–160`);
      }
    }
```

- [ ] **Step 4: Run the tests**

Run: `npm test`
Expected: PASS (59 tests).

- [ ] **Step 5: Gates**

Run: `npm run lint && npm run typecheck && npm run build`
Expected: `SEO gate: 22 pages OK` — every page's description is now within bounds (Task 1 fixed the home page). Then `npm run e2e` green, no baseline change.

- [ ] **Step 6: Commit**

```bash
git add scripts/verify-seo/checks.ts scripts/verify-seo/checks.test.ts
git commit -m "feat(seo-gate): fail on descriptions outside 70–160 characters"
```

---

### Task 3: AI Integration hero, scroll margin, smooth scroll

**Files:**
- Modify: `src/components/AiIntegration.css:5-18`
- Modify: `src/index.css:129-133`
- Regenerate: `e2e/__screenshots__/{mobile,tablet,desktop}/services--ai-integration.png`

- [ ] **Step 1: Restore the hero rule**

In `src/components/AiIntegration.css`, replace lines 5–18 (the NOTE comment) with:

```css
/* The header comment above must never contain "*/" — a stray terminator once
   swallowed the rule below and the page shipped with no hero padding. */
.ai-hero {
  padding: var(--spacing-xl) var(--spacing-sm) var(--spacing-lg);
  text-align: center;
}
```

- [ ] **Step 2: Scroll margin and smooth scroll**

In `src/index.css`, replace lines 129–133 with:

```css
/* Offset in-page anchor targets so the sticky header doesn't cover them. */
#use-cases,
#how-it-works,
#offer,
#ai-offer {
  scroll-margin-top: 5rem;
}

/* In-page anchors glide instead of jumping, unless the visitor asked for less motion. */
@media (prefers-reduced-motion: no-preference) {
  html {
    scroll-behavior: smooth;
  }
}
```

- [ ] **Step 3: See exactly three snapshots fail**

Run: `npm run e2e`
Expected: 3 failures, all `visual: /services/ai-integration` (mobile, tablet, desktop); everything else green. Any other failing snapshot means the change leaked — stop and investigate; do not update it.

- [ ] **Step 4: Regenerate the three**

Run: `npm run e2e:update` (Playwright's default "changed" mode rewrites only the failing snapshots), then `git status --short e2e/__screenshots__`.
Expected: exactly the three `services--ai-integration.png` files modified.

- [ ] **Step 5: Look at them**

Read `e2e/__screenshots__/desktop/services--ai-integration.png` and `e2e/__screenshots__/mobile/services--ai-integration.png`: the hero heading and subhead are centred with clear space above them; nothing else on the page moved. Describe what you saw in the report; Brian looks too before this is pushed.

- [ ] **Step 6: Gates**

Run: `npm test && npm run lint && npm run typecheck && npm run build && npm run e2e`
Expected: all green, 140 passed / 94 skipped.

- [ ] **Step 7: Commit**

```bash
git add src/components/AiIntegration.css src/index.css e2e/__screenshots__
git commit -m "feat(ai-integration): restore centred hero; smooth scroll and scroll-margin for offer anchors"
```

---

### Task 4: Bold Open Graph cards

**Files:**
- Create: `src/app/og/fonts/Inter-Bold.ttf`, `src/app/og/fonts/Inter-SemiBold.ttf`, `src/app/og/fonts/LICENSE.txt`
- Modify: `src/app/og/[name]/route.tsx`

- [ ] **Step 1: Fetch and subset Inter 4.1**

```bash
T=$(mktemp -d)
curl -sL -o "$T/inter.zip" https://github.com/rsms/inter/releases/download/v4.1/Inter-4.1.zip
unzip -q -j "$T/inter.zip" 'extras/ttf/Inter-Bold.ttf' 'extras/ttf/Inter-SemiBold.ttf' 'LICENSE.txt' -d "$T"
mkdir -p src/app/og/fonts
cp "$T/LICENSE.txt" src/app/og/fonts/LICENSE.txt
for w in Bold SemiBold; do
  uvx --from fonttools pyftsubset "$T/Inter-$w.ttf" \
    --unicodes="U+0020-007E,U+00A0-00FF,U+2013-2014,U+2018-2019,U+201C-201D,U+2026" \
    --layout-features='*' --output-file="src/app/og/fonts/Inter-$w.ttf"
done
ls -la src/app/og/fonts
```

Expected: `LICENSE.txt` (SIL Open Font License), two TTFs each well under 150 KB (the unsubset files are ~420 KB).

- [ ] **Step 2: Load the fonts in the route**

In `src/app/og/[name]/route.tsx`, add after the existing imports:

```tsx
import { readFile } from "node:fs/promises";
import { join } from "node:path";
```

and, after `generateStaticParams`, at module scope (the fonts do not depend on the request, so they are read once):

```tsx
// next/og bundles a single regular weight, so bold needs a font file. Inter 4.1
// (SIL OFL), subset to Latin in src/app/og/fonts/.
const FONT_DIR = join(process.cwd(), "src/app/og/fonts");
const interBold = await readFile(join(FONT_DIR, "Inter-Bold.ttf"));
const interSemiBold = await readFile(join(FONT_DIR, "Inter-SemiBold.ttf"));
```

On the outermost `<div style={{ display: "flex", width: "100%", height: "100%", background: … }}>` add `fontFamily: "Inter",` to its style. Change the site-name line's style from `{ display: "flex", fontSize: 30, color: "#566072" }` to `{ display: "flex", fontSize: 30, fontWeight: 600, color: "#566072" }`. Replace the `ImageResponse` options `{ width: 1200, height: 630 }` with:

```tsx
    {
      width: 1200,
      height: 630,
      fonts: [
        { name: "Inter", data: interBold, weight: 700, style: "normal" },
        { name: "Inter", data: interSemiBold, weight: 600, style: "normal" },
      ],
    },
```

- [ ] **Step 3: Build and look**

Run: `npm run build && ls out/og | wc -l && file out/og/home.png`
Expected: `SEO gate: 22 pages OK`, `22`, `PNG image data, 1200 x 630`.

Read `out/og/home.png` (the longest title, 55 chars), `out/og/services-automated-workflows-invoice-reminders.png` (an ampersand) and `out/og/services-automated-workflows-tool-sync-demo.png` (a demo card, "Interactive demo" eyebrow). Confirm: the title is visibly bold, the eyebrow and site name semi-bold, every glyph renders (no tofu boxes), nothing clipped. If a long title now overflows because bold is wider, lower the threshold in `card.title.length > 40 ? 64 : 80` to `> 36` and rebuild; record it.

- [ ] **Step 4: Gates**

Run: `npm test && npm run lint && npm run typecheck && npm run e2e`
Expected: green; no baseline changes (OG images are not screenshotted).

- [ ] **Step 5: Commit**

```bash
git add src/app/og/fonts "src/app/og/[name]/route.tsx"
git commit -m "feat(og): render cards in Inter Bold/SemiBold"
```

---

### Task 5: `favicon.ico`

**Files:**
- Create: `public/favicon.ico`
- Modify: `src/app/layout.tsx:13-17`
- Modify: `scripts/verify-seo/checks.ts:19`, `scripts/verify-seo/checks.test.ts:85`

- [ ] **Step 1: Write the failing gate test**

In `scripts/verify-seo/checks.test.ts` line 85, change `it.each(["llms.txt", "robots.txt", "sitemap.xml"])` to `it.each(["llms.txt", "robots.txt", "sitemap.xml", "favicon.ico"])`.

Run: `npx vitest run scripts/verify-seo/checks.test.ts` — expected: the `favicon.ico` case FAILS.

- [ ] **Step 2: Add it to the required files**

In `scripts/verify-seo/checks.ts` line 19: `const REQUIRED_FILES = ["llms.txt", "robots.txt", "sitemap.xml", "favicon.ico"];` and update the comment above it to `/** Route handlers and static assets nothing else in this gate would notice missing. */`.

Run: `npx vitest run scripts/verify-seo/checks.test.ts` — expected: PASS.

- [ ] **Step 3: Generate the icon**

```bash
T=$(mktemp -d)
sips -z 48 48 public/favicon/ps-favicon-1024.png --out "$T/48.png" >/dev/null
npx -y -p png-to-ico node -e '
  const toIco = require("png-to-ico");
  const fs = require("fs");
  toIco(["public/favicon/ps-favicon-16.png", "public/favicon/ps-favicon-32.png", process.argv[1]])
    .then((buf) => fs.writeFileSync("public/favicon.ico", buf));
' "$T/48.png"
file public/favicon.ico
```

Expected: `MS Windows icon resource - 3 icons, 16x16, 32x32, 48x48` (wording varies by `file` version; three icons is the point).

- [ ] **Step 4: Reference it in the root metadata**

In `src/app/layout.tsx`, add as the first entry of `icons.icon`:

```tsx
      { url: "/favicon.ico", sizes: "48x48 32x32 16x16", type: "image/x-icon" },
```

- [ ] **Step 5: Gates**

Run: `npm test && npm run lint && npm run typecheck && npm run build && npm run e2e`
Expected: green (60 unit tests); `out/favicon.ico` exists; `grep -c 'favicon.ico' out/index.html` ≥ 1; no baseline changes. Open `http://localhost:4173/favicon.ico` while `npm run preview` runs (then stop it) or `curl -sI localhost:4173/favicon.ico | grep -i content-type` → `image/x-icon` or `image/vnd.microsoft.icon`.

- [ ] **Step 6: Commit**

```bash
git add public/favicon.ico src/app/layout.tsx scripts/verify-seo/checks.ts scripts/verify-seo/checks.test.ts
git commit -m "feat: favicon.ico, required by the SEO gate"
```

---

### Task 6: Documentation

**Files:**
- Modify: `CLAUDE.md` (Key Details, Commands), `README.md` (Prerequisites)

- [ ] **Step 1: `CLAUDE.md`**

Replace the **Every page needs metadata** bullet with:

```markdown
- **Every page needs metadata.** A new route exports `metadata` (or `generateMetadata`)
  built with `pageMetadata()` from `lib/seo.ts`, and must be added to `lib/routes.ts`.
  Workflow titles are the label alone (`<Label> | Paradigm Shift`; demos `<Label> Demo`);
  a published workflow must carry hand-written `metaDescription` and `demoDescription`
  (70–160 chars). The build fails otherwise: the gate requires a unique title and a unique
  70–160-character description, a self-canonical, a built `og:image`, exactly one `<h1>`,
  valid JSON-LD, agreement between `sitemap.xml` and the built pages, and the presence of
  `llms.txt`, `robots.txt`, `sitemap.xml` and `favicon.ico`.
```

Add two bullets after the `e2e/package.json` bullet:

```markdown
- **Screenshot baselines are Git LFS.** `e2e/__screenshots__/**/*.png` is tracked in
  `.gitattributes`; a fresh clone needs `brew install git-lfs && git lfs install` (then
  `git lfs pull`) before `npm run e2e` can compare against real images.
- **OG cards render Inter** from `src/app/og/fonts/` (SIL OFL, Latin subset) because
  `next/og` bundles one regular weight; the hex colours in the route mirror `index.css`.
```

- [ ] **Step 2: `README.md`**

Under **Prerequisites**, add after the Node line:

```markdown
- Git LFS (`brew install git-lfs && git lfs install`) — the Playwright screenshot baselines
  are LFS objects; without it `npm run e2e` compares against pointer files and fails
```

- [ ] **Step 3: Sync to the vault**

```bash
V=/Users/brian/Documents/dev-vault/projects/paradigm/consulting-website
cp CLAUDE.md README.md "$V/"
mkdir -p "$V/docs/superpowers/plans" "$V/docs/superpowers/specs"
cp docs/superpowers/plans/2026-09-24-seo-copy-and-polish.md "$V/docs/superpowers/plans/"
cp docs/superpowers/specs/2026-09-24-seo-copy-and-polish-design.md "$V/docs/superpowers/specs/"
```

- [ ] **Step 4: Gates and commit**

Run: `npm test && npm run lint && npm run typecheck && npm run build` (no source change; e2e not needed).

```bash
git add CLAUDE.md README.md docs/superpowers/plans/2026-09-24-seo-copy-and-polish.md
git commit -m "docs: metadata rules, LFS and OG font notes"
```

(Task 7 makes the LFS bullets true; they are written now so the docs commit precedes the rewrite.)

---

### Task 7: Screenshot baselines to Git LFS (history rewrite — Brian confirms)

**Files:**
- Create: `.gitattributes`
- Rewrite: every local commit on `main` (and `next-migration`) that touches `e2e/__screenshots__/**/*.png`

- [ ] **Step 1: Preconditions — stop if any fails**

```bash
git status --short | grep -v '^?? docs/'          # expected: empty
git rev-parse --short origin/main                  # expected: e8fa1f9 (nothing pushed)
git branch --list                                  # note next-migration still exists
git lfs version || echo "LFS NOT INSTALLED"
```

- [ ] **Step 2: Install and track**

```bash
brew install git-lfs
git lfs install
git lfs track "e2e/__screenshots__/**/*.png"
cat .gitattributes
```

Expected `.gitattributes`: `e2e/__screenshots__/**/*.png filter=lfs diff=lfs merge=lfs -text`.

```bash
git add .gitattributes
git commit -m "chore: track screenshot baselines with Git LFS"
```

- [ ] **Step 3: Ask Brian, then migrate**

Print this and wait for an explicit yes — it rewrites every local commit since `e8fa1f9` on both refs:

```bash
git lfs migrate import --include="e2e/__screenshots__/**/*.png" \
  --include-ref=refs/heads/main --include-ref=refs/heads/next-migration
```

Expected output ends with `migrate: Rewriting commits: 100%` and `migrate: Updating refs: 100%`; the old commits stay reachable from the reflog (do not `gc`).

- [ ] **Step 4: Verify**

```bash
git lfs ls-files | wc -l                                             # 66
git show HEAD:e2e/__screenshots__/desktop/home.png | head -2         # "version https://git-lfs.github.com/spec/v1" + "oid sha256:…"
git log --oneline e8fa1f9..HEAD | wc -l                              # same count as before the migration (25)
git status --short | grep -v '^?? docs/'                             # empty
git diff --quiet next-migration main && echo "refs agree"
file e2e/__screenshots__/desktop/home.png                            # PNG image data (working tree still real)
npm run e2e                                                          # green, 140 passed / 94 skipped
```

- [ ] **Step 5: Ledger**

No further commit: the migration rewrote history in place. Record the pre-migration `main` SHA (from Step 1's `git log -1`) in the report so it can be found in the reflog if anything looks wrong.

---

### Task 8: Deploy preview and launch (Brian, with the agent assisting)

Every push below needs Brian's explicit approval for that specific push.

- [ ] **Step 1: Push the branch and open a PR (ask first)**

```bash
git push -u origin next-migration
gh pr create --base main --head next-migration \
  --title "Migrate to Next.js static export; SEO copy and polish" \
  --body "Implements docs/superpowers/specs/2026-09-20-next-migration-design.md and docs/superpowers/specs/2026-09-24-seo-copy-and-polish-design.md"
```

The push uploads 66 LFS objects (~33 MB) once.

- [ ] **Step 2: Check the deploy preview — all 22 routes**

With `P` set to the preview origin Netlify posts on the PR:

```bash
P=https://deploy-preview-N--<site>.netlify.app
npx tsx -e 'import("./src/lib/routes.ts").then((m) => console.log(m.allRoutes().join("\n")))' \
  | while read -r r; do printf "%s %s\n" "$(curl -s -o /dev/null -w '%{http_code} %{redirect_url}' "$P$r")" "$r"; done
```

Expected: 22 lines, every one `200 ` with an empty redirect URL. **If any route answers `301` with a trailing slash**, Netlify prefers the sibling RSC directory: add to `netlify.toml` one `[[redirects]]` per route with `from = "<route>"`, `to = "<route>.html"`, `status = 200`, generated from `allRoutes()`, placed above the `/demos/*` blocks — never set `trailingSlash: true`. Re-run `npm test` (the redirect test needs updating to allow these), commit, push again (ask), re-check.

Then:

```bash
for s in win-back-campaign missed-call-text-back review-generation automated-quoting \
         invoice-reminders onboarding dispatch weekly-reports tool-sync; do
  curl -s -o /dev/null -w "%{http_code} %{redirect_url}\n" "$P/demos/$s"         # 301 → …/demo
done
curl -s -o /dev/null -w "%{http_code}\n" "$P/no-such-page"                        # 404
for f in og/home.png llms.txt sitemap.xml favicon.ico; do curl -sI "$P/$f" | grep -i '^content-type'; done
curl -s "$P/activebalance/" | grep -c "Active Balance"                            # ≥ 1
```

Expected content types: `image/png`, `text/plain`, `application/xml` or `text/xml`, `image/x-icon` or `image/vnd.microsoft.icon`.

- [ ] **Step 3: Confirm no functions**

In the Netlify deploy's **Functions** tab: zero functions (`NETLIFY_NEXT_PLUGIN_SKIP` is already set).

- [ ] **Step 4: Validate a card and structured data**

Paste the preview URL of `/` and `/services/automated-workflows/missed-call-text-back` into https://www.opengraph.xyz and https://validator.schema.org. Expected: the bold card renders; no structured-data errors.

- [ ] **Step 5: Launch (ask first)**

```bash
git push origin main
```

Netlify deploys production; the PR closes as merged. Then submit `https://paradigmshiftdev.io/sitemap.xml` in Google Search Console and Bing Webmaster Tools. Rollback if needed: Netlify → Deploys → previous deploy → **Publish deploy**.
