# SEO Copy and Post-Migration Polish — Design

**Date:** 2026-09-24
**Status:** Draft for review
**Follows:** `2026-09-20-next-migration-design.md` (implemented; local `main` = `2105e9e`, not yet pushed).

## Goal

Close the eight items the migration deliberately left open because its parity rule forbade
copy and design changes: hand-written page metadata with enforced lengths, the AI Integration
hero as it was designed, bold Open Graph cards, a `favicon.ico`, and screenshot baselines in
Git LFS before they ever reach GitHub. Then take the site through its first deploy preview and
launch.

## Out of scope

Moving `icon` out of `src/data/workflows.ts` (the reason `e2e/package.json` exists); extracting
shared `.btn*` styles so `AiIntegration.tsx` stops importing borrowed stylesheets; the
`matchMedia` guard in `usePrefersReducedMotion`; caret ranges in `package.json`; any other copy
or design change.

## 1. Page metadata

### Data

`WorkflowContent` in `src/data/workflows.ts` gains two required string fields, so a published
workflow cannot ship without them (the existing discriminated union already forbids half-written
copy):

- `metaDescription` — the workflow page's `<meta name="description">` and its `Service`
  JSON-LD `description`.
- `demoDescription` — the demo page's `<meta name="description">`.

`HOME_DESCRIPTION` in `src/data/site.ts` is rewritten (it feeds the home description, the
`Organization` JSON-LD description and the `llms.txt` blockquote).

### Builders (`src/lib/seo.ts`)

| Function | Title (template adds ` \| Paradigm Shift`) | Description |
|---|---|---|
| `workflowMeta(w)` | `w.label` | `w.metaDescription` |
| `demoMeta(w)` | `${w.label} Demo` | `w.demoDescription` |
| `workflowJsonLd(w).description` | — | `w.metaDescription` |

`clip()` then has no consumer and is deleted with its tests.

### Bounds, enforced twice

- **Unit tests** (`src/lib/seo.test.ts`, `src/data/data.test.ts`): every workflow and demo
  title *including* the ` | Paradigm Shift` suffix is ≤ 60 characters; every description
  (home, services, workflows, demos) is 70–160 characters; titles and descriptions are unique.
  The home title is exempt from the 60-character rule — it is the deliberate 70-character
  absolute title.
- **SEO gate** (`scripts/verify-seo/checks.ts`): a page whose description is shorter than 70 or
  longer than 160 characters is a problem (`<path>: description is N chars, expected 70–160`).
  Tested in `checks.test.ts`. The gate is what stops the next edit drifting.

### The copy

All lengths verified ≤ 158 so an accidental trailing space still passes. Written for the
trades-business owner the pages address: plain terms, no jargon, one idea each.

**Home (`HOME_DESCRIPTION`, 157):**
> AI automation for small and trades businesses: missed-call text-back, review requests, quoting, invoice reminders and dispatch, on the tools you already use.

**Workflow pages (`metaDescription`):**

| slug | description |
|---|---|
| win-back-campaigns (153) | Picks out the past customers who are actually due for work, gives each one a reason that fits their last job, and contacts only them. No blast discounts. |
| missed-call-text-back (147) | Miss a call and it texts the caller back in seconds, answers their questions and books the job, so leads stop dialing the next company on the list. |
| review-generation (148) | Asks every customer how the job went, points the happy ones at Google and routes the unhappy ones to you while there is still a problem you can fix. |
| automated-quoting (144) | Reads an incoming request, builds an itemized quote from your own pricing and puts it in front of you to approve the same day, not after dinner. |
| invoice-reminders (154) | Follows up on unpaid invoices on a schedule, in a tone you would put your name to, and stops the moment the customer pays. No more evenings chasing money. |
| new-customer-onboarding (148) | Sends the welcome the moment a customer books, collects the paperwork and access details in one message, and gets the first visit onto the calendar. |
| job-dispatch (155) | Sorts incoming jobs against skills, zones and the arrival windows you have already promised, routes each van and tells the customer when to expect someone. |
| weekly-owner-reports (156) | Pulls the numbers from your job software, invoicing and calendar every week and puts a short, readable summary in your inbox. What you do next is your call. |
| tool-sync (157) | Moves job details between your scheduler, invoicing and books so data is entered once and lands wherever it is needed. No retyping, no records that disagree. |

**Demo pages (`demoDescription`):**

| slug | description |
|---|---|
| win-back-campaigns (146) | Click through the Win-Back Campaigns automation on a made-up business: who gets picked, what they are sent and why. No signup, nothing to install. |
| missed-call-text-back (148) | Click through the Missed-Call Text-Back automation on a made-up business: the missed call, the reply and the booking. No signup, nothing to install. |
| review-generation (151) | Click through the Review Generation automation on a made-up business: the ask, the happy path to Google, the unhappy one to you. No signup, no install. |
| automated-quoting (151) | Click through the Automated Quoting automation on a made-up business: the request, the itemized quote and your approval. No signup, nothing to install. |
| invoice-reminders (151) | Click through the Invoice & Payment Reminders automation on a made-up business: each follow-up, and the moment it stops. No signup, nothing to install. |
| new-customer-onboarding (158) | Click through the New-Customer Onboarding automation on a made-up business: welcome, paperwork, access details and first visit. No signup, nothing to install. |
| job-dispatch (156) | Click through the Job Scheduling & Dispatch automation on a made-up business: the job pile, the routing, the customer notice. No signup, nothing to install. |
| weekly-owner-reports (149) | Click through the Weekly Owner Reports automation on a made-up business: scattered numbers in, a readable summary out. No signup, nothing to install. |
| tool-sync (152) | Click through the Tool-to-Tool Sync automation on a made-up business: one entry in the scheduler, landing in invoicing and books. No signup, no install. |

Resulting titles, longest first: `Invoice & Payment Reminders Demo | Paradigm Shift` (49),
`Job Scheduling & Dispatch Demo | Paradigm Shift` (47), `Invoice & Payment Reminders | Paradigm
Shift` (44). Nothing visible on any page changes; the visual suite stays green with no baseline
update.

## 2. AI Integration hero and in-page scrolling

- `src/components/AiIntegration.css`: the `.ai-hero` rule recorded inside the NOTE comment is
  restored as live CSS (`padding: var(--spacing-xl) var(--spacing-sm) var(--spacing-lg);
  text-align: center;`) and the NOTE is cut down to one line explaining why the header comment
  must never contain `*/`. This is the design the page was written with; the malformed comment
  hid it on the live site.
- `src/index.css`: `#offer, #ai-offer` join the existing `#use-cases, #how-it-works`
  `scroll-margin-top: 5rem` rule, so the two "See what's included / See the engagements" anchors
  land with the heading clear of the sticky header. `html { scroll-behavior: smooth }` is added
  inside `@media (prefers-reduced-motion: no-preference)`, restoring the smooth scroll the old
  click handlers had, for every in-page anchor.
- Visual effect: only `/services/ai-integration` changes (taller, centred hero). Its three
  baselines are regenerated with `npm run e2e:update` (Playwright's "changed" mode rewrites
  exactly the failing snapshots) and Brian looks at the three PNGs before they are committed.
  Every other snapshot must be byte-identical; Playwright forces reduced motion, so
  `scroll-behavior` cannot touch a screenshot.

## 3. Bold Open Graph cards

`next/og` bundles a single regular weight, so `fontWeight: 700` in the card is ignored today.

- Inter 4.1 Bold and SemiBold (SIL OFL) are committed under `src/app/og/fonts/` with
  `LICENSE.txt`, subset to Latin with `pyftsubset` (fonttools via `uvx`) so each TTF is well
  under 150 KB instead of 420 KB. Kept ranges: U+0020–007E, U+00A0–00FF, U+2013–2014,
  U+2018–2019, U+201C–201D, U+2026 — everything the card text uses (ampersands, en dashes,
  curly quotes, the ellipsis).
- `src/app/og/[name]/route.tsx` reads both files once at module scope with
  `readFile(join(process.cwd(), "src/app/og/fonts/…"))` — the pattern in Next 16's
  `ImageResponse` documentation — and passes them as `fonts: [{ name: "Inter", data, weight:
  700, style: "normal" }, { …, weight: 600 }]`; the card sets `fontFamily: "Inter"`. The title
  uses 700, the eyebrow 600, the site name 600.
- Verification: `npm run build` still writes 22 PNGs at 1200 × 630; `out/og/home.png`, the
  card with the longest title and one demo card are opened and checked for weight, fit and
  clipping. Existing `og.test.ts` is unchanged.

## 4. `favicon.ico`

`public/favicon.ico` holding 16, 32 and 48 px images, built once from the existing PNGs (48 px
resized from `ps-favicon-1024.png` with `sips`) using `png-to-ico` through `npx` — no dependency
is added; the command is recorded in the plan. The root metadata `icons.icon` list gains
`{ url: "/favicon.ico", sizes: "48x48 32x32 16x16", type: "image/x-icon" }`, and
`favicon.ico` joins the gate's required-files list so a build without it fails.

## 5. Screenshot baselines in Git LFS

66 PNGs (33 MB) sit in the 17 local commits on `main`; `origin/main` is still `e8fa1f9`, so
GitHub has never seen them. Moving them to LFS now keeps them out of GitHub history for good.

- `git-lfs` is installed with Homebrew and `git lfs install` run once.
- `.gitattributes` tracks `e2e/__screenshots__/**/*.png` (`filter=lfs diff=lfs merge=lfs
  -text`).
- `git lfs migrate import --include="e2e/__screenshots__/**/*.png" --everything` rewrites every
  local ref (`main` and `next-migration`, which point at the same commit) so the PNGs are LFS
  pointers from their first commit. This is the one history rewrite in the project; it runs
  **last**, after every other task's commits, and only after Brian confirms at that moment that
  nothing has been pushed (`git rev-parse origin/main` = `e8fa1f9`).
- Verification: `git lfs ls-files | wc -l` = 66 (every baseline, including the three
  regenerated in §2, is a pointer); `git count-objects -vH` after `git gc` shows the pack shrank
  by roughly 33 MB; `npm run e2e` is green (the working tree still holds real PNGs).
- Netlify: nothing to configure. `GIT_LFS_ENABLED` stays unset, so Netlify clones pointer
  files, and the build never reads a screenshot. GitHub's free LFS tier (1 GB storage, 1 GB/month
  bandwidth) covers ~30 full clones a month; only a developer clone fetches the objects.

## 6. Documentation

`CLAUDE.md` gains: `metaDescription` and `demoDescription` are required copy for a published
workflow and the gate enforces 70–160 characters on every page; workflow titles are the label
alone; `e2e/__screenshots__` is Git LFS, so a fresh clone needs `git lfs install` before
`npm run e2e`; OG cards render Inter from `src/app/og/fonts/`. `README.md` gets the LFS note
under Prerequisites. Both are copied to the Obsidian vault.

## 7. Testing

- **Vitest:** the length and uniqueness rules in §1; `checks.test.ts` for the two new gate
  rules (description length, `favicon.ico` required). Test-first for every rule.
- **Build gate:** unchanged mechanism; two new rules.
- **Playwright:** the existing suite; only three AI Integration baselines change, by design.
- **Eyes:** the three new baselines, three OG cards, `favicon.ico` in a browser tab.

Definition of done for every task: `npm test` → `npm run lint` → `npm run typecheck` →
`npm run build` → `npm run e2e`, all green.

## 8. Cutover

1. All tasks committed locally, LFS migration done, Brian's confirmation obtained for each push.
2. Push `next-migration` (identical to `main` after the migration) and open a PR against `main`
   so Netlify builds a **deploy preview**. On it, run the checks the migration plan's Task 13
   left pending: all **22** clean URLs return 200 (Next 16 writes an RSC payload directory next
   to every page's `.html`, so each route has a sibling directory and Netlify's precedence must
   be seen, not assumed); the nine `/demos/*` 301s; a 404 for an unknown path; content types for
   `/og/home.png`, `/llms.txt`, `/sitemap.xml`, `/favicon.ico`; `/activebalance/` intact; zero
   functions deployed. If a clean URL 301s to a trailing slash, add per-path `status = 200`
   rewrites generated from `allRoutes()` — never `trailingSlash: true`.
3. Push `main`; Netlify deploys production. Submit `sitemap.xml` in Google Search Console and
   Bing Webmaster Tools. Rollback: republish the previous deploy in Netlify.

## Risks

| Risk | Mitigation |
|---|---|
| `git lfs migrate import` rewrites the wrong refs or runs after a push | Precondition check on `origin/main`; it is the last task; Brian confirms at run time; `git lfs migrate` prints the ref map and old commits stay in the reflog until `gc` |
| Subset font drops a glyph a card needs | Kept ranges chosen from the card text; the three opened cards include an ampersand, an en dash and the longest title |
| Restored `.ai-hero` looks worse than the accidental version | Brian reviews the three regenerated baselines before commit; reverting is re-commenting one rule |
| A description reads badly in a SERP snippet | The 19 strings are in this spec for review before any code changes |
