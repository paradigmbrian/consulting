# Phase 1 — Light Theme Migration — Design

**Date:** 2026-07-18
**Part of:** the Domo-inspired redesign (Phase 1 of 3). Phase 2 = detail-page
redesign; Phase 3 = index/landing cohesion pass. This spec covers Phase 1 only.

## Goal

Convert the entire site — marketing pages **and** the 9 interactive demos — from
the current dark theme ("Electric Azure") to a clean, Domo-inspired **light**
theme, with brand blue as primary and a warm amber accent. Structure and copy are
unchanged; this is a palette/appearance migration only. The redesign of the detail
pages (layout, mockups, feature rows) is Phase 2 and out of scope here.

## Reference

The look is modeled on https://www.domo.com/automation/workflows — light ground,
near-black headlines, gray body, bordered cards, one warm accent alongside a cool
brand color. (Phase 2 adopts its layout; Phase 1 only establishes the light ground.)

## Palette (validated live on the marketing surfaces)

The single source of truth is the `:root` block in `src/index.css`. Final tokens:

```css
--color-primary: #2563eb;        /* brand blue — buttons, links, icons, eyebrows */
--color-primary-dark: #1d4ed8;   /* hover / gradient end */
--color-secondary: #64748b;
--color-text: #0f172a;           /* near-black — headings + body on light */
--color-text-light: #566072;     /* muted / secondary text */
--color-bg: #ffffff;             /* page ground */
--color-bg-light: #f4f6fa;       /* elevated surface — cards, alt bands */
--color-bg-dark: #0b1220;        /* footer — intentionally stays dark (anchor) */
--color-border: #e3e8ef;         /* hairline borders */
--color-success: #059669;
--color-accent-2: #0ea5e9;       /* cool secondary accent (gradient partner) */
--color-warm: #f59e0b;           /* warm amber highlight accent (Domo-like) */
--color-warm-dark: #d97706;      /* amber hover */
--warm-ink: #241a02;             /* text on amber fills */
--btn-ink: #ffffff;              /* text on filled blue buttons */
--gradient-accent: linear-gradient(120deg, #2563eb 0%, #1d4ed8 100%);
--hero-bg: radial-gradient(circle at 30% 15%, rgba(37,99,235,0.08) 0%, transparent 55%),
           linear-gradient(180deg, #f8fafc 0%, #eef2f7 100%);
```

These are already applied to `index.css` (previewed on landing/hero/detail pages —
clean and legible). This spec formalizes them and mirrors them into
`docs/design/color-themes.md` so that doc stays the theme registry.

### Role of the warm accent

Amber is a **sparing highlight**, not a second primary. Approved use: the
secondary **"Try the demo"** CTA renders amber-filled (validated live — pairs well
with the blue primary). Otherwise reserve amber for small emphasis (badges,
selective highlights). Brand blue remains the primary conversion/interaction color.
Do not blanket-swap blue elements to amber.

## The migration surface

`index.css` is tokenized, so the palette swap itself is one file (done). The work is
sweeping **122 hardcoded color literals across 24 files** so nothing stays
unintentionally dark:

**Marketing components (9 files):** `AutomatedWorkflows.css`, `Footer.css`,
`Hero.css`, `HowItWorks.css`, `LandingPage.css`, `Offer.css`, `Problem.css`,
`Solution.css`, `WhyWorkWithMe.css`.

**Demos — shared (3 files):** `demos/shared/DemoShell.css`, `demos/shared/AiPanel.css`,
`demos/shared/FlowMap.css`.

**Demos — per-demo (12 files):** `automatedQuoting/quoting.css`,
`invoiceReminders/invoices.css`, `jobDispatch/dispatch.css`,
`missedCallTextBack/missedcall.css`, `newCustomerOnboarding/onboarding.css`,
`reviewGeneration/reviews.css`, `toolSync/sync.css`, `weeklyReports/reports.css`,
`winBackCampaign/winback.css`, and `commercialCleaning/steps/` (EnrichQualifyStep,
ResultsStep, SendStep).

## Sweep principles

1. **Prefer tokens.** Replace each hardcoded literal with the semantic token that
   fits (`var(--color-bg)`, `--color-text`, `--color-border`, etc.). A dark ground
   like `#0a0f1a` becomes `var(--color-bg)`; light-on-dark text like `#e6edf7`
   becomes `var(--color-text)`.
2. **Introduce semantic tokens, don't re-hardcode.** Where a demo needs meaning
   colors that aren't in the palette (status pass/fail greens & reds, chat-bubble
   tints, flow-map node states, the "Powered by Claude" accent), add a named token
   to `:root` (e.g. `--demo-bubble-in`, `--status-warn`) and use it everywhere,
   rather than sprinkling new literals. Each new literal must earn a token.
3. **Contrast is the acceptance bar.** Every text/background pair must be legible
   (target WCAG AA for body text). Dark-theme tricks that assumed a dark ground
   (low-opacity white overlays, glow shadows) must be re-tuned for light — e.g.
   `rgba(255,255,255,0.06)` panel fills become a light surface + hairline border;
   heavy dark glows become soft neutral shadows.
4. **Footer stays dark on purpose** (`--color-bg-dark`); ensure footer text tokens
   still read on the dark ground (they already reference light text tokens).
5. **No structural or copy changes.** Only color/appearance. Do not move markup or
   change spacing (that is Phase 2).

## Sequencing (matters for risk)

The demos are the delicate part — a rich interactive UI needs a considered light
design language, not find-and-replace. Sequence:

1. **Global tokens** — `index.css` + `color-themes.md` (largely done; formalize).
2. **Marketing components** — sweep the 9 component CSS files. Verify the landing,
   consulting, index, and (current) detail pages render correctly in light.
3. **Demo language prototype** — re-theme the **shared** files (`DemoShell`,
   `AiPanel`, `FlowMap`) plus **one** representative demo (`reviewGeneration`) to
   establish the light-demo look (surfaces, bubbles, status colors, flow map).
   Review this one demo end-to-end before proceeding.
4. **Roll to the remaining demos** — apply the established token set/patterns to the
   other 8 demos + the commercialCleaning steps.

## Verification

- No test framework; loop is `npm run lint` + `npm run build` + **browser visual
  check** (the dev server + Claude-in-Chrome screenshots, as used during design).
- Grep gate after the sweep: `grep -rInE '#[0-9a-fA-F]{3,8}|rgba?\(|hsla?\('`
  over `src` excluding `index.css` should return only *intentional* literals
  (each justified in a comment or promoted to a token). No stray dark grounds.
- Visually walk: landing `/`, `/services/technical-consulting`,
  `/services/automated-workflows`, a detail page, and **every** demo route
  (`…/:slug/demo`) at desktop + mobile widths. Confirm nothing renders dark-on-dark
  or light-on-light, and the footer still reads on its dark ground.

## Non-goals

- Detail-page layout redesign, per-workflow mockups, feature rows (Phase 2).
- Index/landing structural polish (Phase 3).
- Copy changes.
- Dark-mode toggle / theme switching (single light theme only).

## Disposition of prior work

The uncommitted "compaction" changes (tighter `wf-*` padding, hero stats strip,
merged problem/solution + tail bands) remain in the working tree. They are
superseded by the Phase 2 redesign; Phase 1 does not depend on them. The amber
"Try the demo" button styling added during palette validation is kept (it encodes
the approved warm-accent role). Brian will decide separately whether to stash or
discard the rest of the compaction diff.
