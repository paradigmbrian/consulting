# Phase 1 — Light Theme Migration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Convert the whole site — marketing pages and all 9 interactive demos — from the dark "Electric Azure" theme to a clean, Domo-inspired light theme (brand blue primary + warm amber accent), changing appearance only, not structure or copy.

**Architecture:** The palette is tokenized in two places: the global `:root` in `src/index.css` (marketing) and a scoped `.demo { --demo-* }` block in `src/demos/shared/DemoShell.css` (demos, which locally remap the global `--color-*` tokens). Re-theming is: (1) flip both token blocks to light and add the semantic tokens the demos need; (2) sweep the hardcoded color literals scattered across 24 files to reference those tokens; (3) re-tune dark-only tricks (white overlays, heavy glows/shadows) for a light ground.

**Tech Stack:** React 18 + TypeScript, Vite 5, vanilla CSS custom properties, react-icons, react-router-dom v6.

## Global Constraints

- **No test framework.** Verification for every task = `npm run lint` (zero warnings) + `npm run build` (tsc + vite) + a browser visual check via the running dev server (currently http://localhost:5174) and Claude-in-Chrome screenshots. There are no unit tests.
- **Git is Brian's to run.** Per global CLAUDE.md, Claude executes no git write commands. Each task ends with a commit command to surface to Brian; changes stay in the working tree.
- **Appearance only.** No markup moves, no spacing/layout changes, no copy edits (those are Phase 2/3).
- **Contrast is the bar.** Every text/background pair must read (target WCAG AA for body text). Re-tune dark-ground tricks for light — do not leave light-on-light or dark-on-dark.
- **Every new literal must earn a token.** Where a color isn't in the palette, add a named token (global `:root` or scoped `.demo`) and use it everywhere; don't sprinkle fresh literals.
- **Footer stays dark on purpose** (`--color-bg-dark: #0b1220`); its text tokens must still read on that dark ground.
- **Palette source of truth:** `src/index.css` `:root` (already holds the final light tokens) and `docs/design/color-themes.md` (theme registry, to be updated).
- **Exact final global tokens** (already applied to `index.css`):
  `--color-primary:#2563eb` · `--color-primary-dark:#1d4ed8` · `--color-secondary:#64748b` · `--color-text:#0f172a` · `--color-text-light:#566072` · `--color-bg:#ffffff` · `--color-bg-light:#f4f6fa` · `--color-bg-dark:#0b1220` · `--color-border:#e3e8ef` · `--color-success:#059669` · `--color-accent-2:#0ea5e9` · `--color-warm:#f59e0b` · `--color-warm-dark:#d97706` · `--warm-ink:#241a02` · `--btn-ink:#ffffff`.

---

### Task 1: Formalize global tokens + theme registry

The final light tokens are already in `src/index.css` (applied during design validation). This task adds the shared soft/shadow helper tokens the marketing sweep will reference, and updates the theme-registry doc so it isn't stale.

**Files:**
- Modify: `src/index.css` (`:root` block)
- Modify: `docs/design/color-themes.md`

**Interfaces:**
- Produces (global tokens for later tasks): `--primary-soft`, `--primary-soft-2`, `--warm-soft`, `--shadow-sm`, `--shadow-md`, `--overlay-scrim` — in addition to the palette tokens already present.

- [ ] **Step 1: Add helper tokens to `:root`**

In `src/index.css`, immediately after the `--warm-ink` line, add:

```css
  --primary-soft: rgba(37, 99, 235, 0.10);   /* blue tint fill (chips, badges) */
  --primary-soft-2: rgba(37, 99, 235, 0.04);  /* faint blue wash */
  --warm-soft: rgba(245, 158, 11, 0.14);      /* amber tint fill */
  --shadow-sm: 0 1px 3px rgba(15, 23, 42, 0.06);
  --shadow-md: 0 10px 30px rgba(15, 23, 42, 0.10);
  --overlay-scrim: rgba(15, 23, 42, 0.55);    /* dark scrim for light ground */
```

- [ ] **Step 2: Update the theme registry doc**

In `docs/design/color-themes.md`, update the active-theme section so it documents the "Clean Light (Domo-inspired)" palette above as current (replace the stale dark "Electric Azure" values with the final tokens from Global Constraints, including the helper tokens from Step 1). Keep any alternate themes listed as alternates.

- [ ] **Step 3: Verify lint + build**

Run: `npm run lint && npm run build`
Expected: both pass, zero warnings.

- [ ] **Step 4: Commit (surface to Brian)**

```bash
git add src/index.css docs/design/color-themes.md
git commit -m "feat: light theme tokens + helper tokens; update theme registry"
```

---

### Task 2: Sweep marketing components — grounds, text, borders

Replace the hardcoded old-accent tints and white overlays in the marketing component CSS with tokens, so every marketing surface reads on the light ground. This is a mechanical literal→token sweep guided by the mapping table.

**Files (marketing CSS, all under `src/components/`):**
- Modify: `Hero.css`, `LandingPage.css`, `Footer.css`, `AutomatedWorkflows.css`, `Problem.css`, `Solution.css`, `Offer.css`, `HowItWorks.css`, `WhyWorkWithMe.css`

**Interfaces:**
- Consumes: all global tokens incl. the Task 1 helpers.
- Produces: no dark-assuming literals remaining in `src/components/*.css`.

**Mapping table (apply in every file above):**

| Hardcoded literal (old) | Replace with |
|---|---|
| `rgba(39, 119, 180, 0.15)` / `rgba(56, 189, 248, 0.12)` (old azure tint) | `var(--primary-soft)` |
| `rgba(39, 119, 180, 0.08)` | `var(--primary-soft)` |
| `rgba(39, 119, 180, 0.04)` / `0.02` (faint azure wash) | `var(--primary-soft-2)` |
| `rgba(39, 119, 180, 0.3)` / `0.4` (azure glow/border) | `var(--color-primary)` (solid) or drop the glow; for borders use `var(--color-border)` |
| `rgba(37, 99, 235, 0.15)` / `0.12` (already-blue tint) | `var(--primary-soft)` |
| `rgba(245, 158, 11, 0.15)` (amber tint) / `#f59e0b` | `var(--warm-soft)` / `var(--color-warm)` |
| `rgba(255, 255, 255, 0.8)` / `0.6` / `0.5` (white overlay meant on dark) | a solid light surface: `var(--color-bg)` or `var(--color-bg-light)` (pick by whether it sits on white or a gray band) |
| `rgba(0, 0, 0, 0.35)` (heavy dark shadow) | `var(--shadow-md)` |
| `rgba(0, 0, 0, 0.1)` / `0.08` / `0.06` / `0.05` (soft shadow) | `var(--shadow-sm)` |

- [ ] **Step 1: Sweep each file against the table**

For each of the 9 files: open it, and replace every color literal per the mapping table. Read each occurrence in context to choose between `--color-bg` vs `--color-bg-light` for white-overlay replacements (rule: if the element sits inside an alt/gray band, use `--color-bg` so it pops white; on a white band use `--color-bg-light`). After editing, that file must contain no `#`/`rgb`/`rgba` literals except ones you deliberately keep and comment.

- [ ] **Step 2: Grep-gate the marketing CSS**

Run: `grep -rInE '#[0-9a-fA-F]{3,8}|rgba?\(|hsla?\(' src/components --include='*.css'`
Expected: only intentional, commented literals remain (ideally none).

- [ ] **Step 3: Verify lint + build**

Run: `npm run lint && npm run build`
Expected: both pass.

- [ ] **Step 4: Browser visual check**

With the dev server running, view `/`, `/services/technical-consulting`, and `/services/automated-workflows`. Expected: clean light surfaces, blue accents, amber where intended, readable text everywhere, dark footer still legible. No azure-on-white ghosts, no invisible white-on-white panels.

- [ ] **Step 5: Commit (surface to Brian)**

```bash
git add src/components/*.css
git commit -m "feat: sweep marketing components to light theme tokens"
```

---

### Task 3: Light demo palette — rewrite the `.demo` token block + shared panels

Flip the scoped demo palette in `DemoShell.css` to light and add the semantic tokens the per-demo files need, then re-tune the shared shell/AiPanel/FlowMap literals. This establishes the light-demo design language reused by every demo.

**Files:**
- Modify: `src/demos/shared/DemoShell.css`
- Modify: `src/demos/shared/AiPanel.css`
- Modify: `src/demos/shared/FlowMap.css`

**Interfaces:**
- Produces (scoped `.demo` tokens for all per-demo tasks): `--demo-bg`, `--demo-surface`, `--demo-surface-2`, `--demo-border`, `--demo-text`, `--demo-muted`, `--demo-accent`, `--demo-accent-bright`, `--demo-accent-deep`, `--demo-accent-glow`, `--demo-accent-soft` (new), `--demo-edge`, `--demo-edge-active`, `--demo-success`, `--demo-success-soft` (new), `--demo-warn` (new), `--demo-warn-soft` (new), `--demo-error` (new), `--demo-error-soft` (new), `--demo-star` (new), `--demo-on-accent` (new), `--demo-shadow` (new), `--demo-dot` (new).

- [ ] **Step 1: Replace the `.demo` token block (top of `DemoShell.css`)**

Replace lines 1–24 (the `.demo { --demo-* ... }` declarations up to and including the scope-local remap block) with:

```css
.demo {
  /* demo-only palette (does not affect anything outside .demo) — LIGHT */
  --demo-bg: #f4f6fa;             /* demo ground */
  --demo-surface: #ffffff;        /* content pane */
  --demo-surface-2: #f7f9fc;      /* nested cards / bubbles */
  --demo-border: #e3e8ef;
  --demo-text: #0f172a;
  --demo-muted: #566072;
  --demo-accent: #2563eb;
  --demo-accent-bright: #3b82f6;
  --demo-accent-deep: #1d4ed8;
  --demo-accent-glow: rgba(37, 99, 235, 0.22);  /* softer glow for light */
  --demo-accent-soft: rgba(37, 99, 235, 0.10);  /* accent tint fills */
  --demo-edge: #e3e8ef;
  --demo-edge-active: #3b82f6;
  --demo-success: #059669;
  --demo-success-soft: rgba(5, 150, 105, 0.12);
  --demo-warn: #b7791f;           /* darker amber — readable as text on light */
  --demo-warn-soft: rgba(245, 158, 11, 0.16);
  --demo-error: #dc2626;
  --demo-error-soft: rgba(220, 38, 38, 0.10);
  --demo-star: #f59e0b;           /* review-star gold */
  --demo-on-accent: #ffffff;      /* text on filled accent */
  --demo-shadow: 0 10px 30px rgba(15, 23, 42, 0.10);
  --demo-dot: rgba(15, 23, 42, 0.05);  /* background dot pattern */

  /* scope-local remap: flips shared step CSS to this palette without touching index.css */
  --color-bg-light: var(--demo-surface-2);
  --color-border: var(--demo-border);
  --color-text: var(--demo-text);
  --color-text-light: var(--demo-muted);
  --color-secondary: var(--demo-muted);
  --color-primary: var(--demo-accent-bright);
  --color-primary-dark: var(--demo-accent);
```

(Leave the rest of the `.demo` rule — `display`, `height`, etc. — intact below this.)

- [ ] **Step 2: Re-tune the remaining literals in `DemoShell.css`**

In the body of `DemoShell.css`, replace:
- `rgba(255, 255, 255, 0.06)` (dot pattern, ~line 34) → `var(--demo-dot)`
- `rgba(90, 169, 230, 0.12)` (ai-chip bg) → `var(--demo-accent-soft)`
- `rgba(90, 169, 230, 0.15)` (stage-badge bg) → `var(--demo-accent-soft)`
- `#fff` on `.demo-cta`, `.demo-btn-primary` (text on accent) → `var(--demo-on-accent)`
- `rgba(90, 169, 230, 0.35)` (cta shadow) → `var(--demo-accent-glow)`
- `rgba(0, 0, 0, 0.35)` (`.demo-content` shadow) → `var(--demo-shadow)`

- [ ] **Step 3: Re-tune `AiPanel.css`**

Replace `rgba(90, 169, 230, 0.15)` (`.ai-panel-badge` bg) → `var(--demo-accent-soft)`. (Everything else already uses `--demo-*` tokens and follows automatically.)

- [ ] **Step 4: Re-tune `FlowMap.css`**

Replace `rgba(90, 169, 230, 0.15)` (`.flow-node-active .flow-node-badge` bg, ~line 113) → `var(--demo-accent-soft)`. (The rest uses `--demo-*` tokens.)

- [ ] **Step 5: Grep-gate the shared demo files**

Run: `grep -rInE '#[0-9a-fA-F]{3,8}|rgba?\(' src/demos/shared`
Expected: only the token *definitions* inside the `.demo` block remain; no stray literals in rules.

- [ ] **Step 6: Verify lint + build**

Run: `npm run lint && npm run build`
Expected: both pass.

- [ ] **Step 7: Commit (surface to Brian)**

```bash
git add src/demos/shared/DemoShell.css src/demos/shared/AiPanel.css src/demos/shared/FlowMap.css
git commit -m "feat: light demo palette + semantic demo tokens (shared shell)"
```

---

### Task 4: Re-theme the review-generation demo (prototype demo)

Sweep the one representative demo end-to-end against the new demo tokens, then review it live. This validates the light-demo language before rolling to the rest.

**Files:**
- Modify: `src/demos/reviewGeneration/reviews.css`

**Interfaces:**
- Consumes: the scoped `.demo` tokens from Task 3.

**Mapping table (per-demo literals → demo tokens):**

| Hardcoded literal | Replace with |
|---|---|
| `rgba(16, 185, 129, 0.14)` / `0.12` / `0.1` (success tint) | `var(--demo-success-soft)` |
| `#fff` (text on `--demo-accent` bubble, `.rg-bubble-caller`) | `var(--demo-on-accent)` |
| `#f4b740` (warn amber as text/border: route-negative, lock) | `var(--demo-warn)` |
| `rgba(244, 183, 64, 0.14)` (warn tint fill) | `var(--demo-warn-soft)` |
| `#f5b301` (`.rg-review-star`, `.rg-rating-star`) | `var(--demo-star)` |
| `rgba(0, 0, 0, 0.35)` (`.rg-push` shadow) | `var(--demo-shadow)` |

- [ ] **Step 1: Sweep `reviews.css` against the table**

Replace every literal per the table. Read each in context — the `#f4b740` occurrences are used both as a solid text/border color (→ `--demo-warn`) and inside `rgba(244,183,64,...)` tints (→ `--demo-warn-soft`); map by form.

- [ ] **Step 2: Grep-gate**

Run: `grep -InE '#[0-9a-fA-F]{3,8}|rgba?\(' src/demos/reviewGeneration/reviews.css`
Expected: no matches.

- [ ] **Step 3: Verify lint + build**

Run: `npm run lint && npm run build`
Expected: both pass.

- [ ] **Step 4: Browser visual check — full walk**

Open `/services/automated-workflows/review-generation/demo` and step through all 6 stages (Next). Expected: white content pane on light ground, readable bubbles (blue caller bubble with white text, light business bubble), success chips green-on-light, negative-sentiment amber readable, stars gold, flow map + AI panel legible, no dark-on-dark. This is the design gate for the demo look — confirm it reads as premium before Task 5.

- [ ] **Step 5: Commit (surface to Brian)**

```bash
git add src/demos/reviewGeneration/reviews.css
git commit -m "feat: light theme for review-generation demo"
```

---

### Task 5: Roll the light palette to the remaining 8 demos

Apply the same per-demo literal→token sweep (Task 4's table, plus the error-red rows) to every other demo. Same mechanical pattern, now that the token set is proven.

**Files:**
- Modify: `src/demos/invoiceReminders/invoices.css`
- Modify: `src/demos/weeklyReports/reports.css`
- Modify: `src/demos/missedCallTextBack/missedcall.css`
- Modify: `src/demos/automatedQuoting/quoting.css`
- Modify: `src/demos/newCustomerOnboarding/onboarding.css`
- Modify: `src/demos/jobDispatch/dispatch.css`
- Modify: `src/demos/toolSync/sync.css`
- Modify: `src/demos/winBackCampaign/winback.css`
- Modify: `src/demos/commercialCleaning/steps/EnrichQualifyStep.css`
- Modify: `src/demos/commercialCleaning/steps/ResultsStep.css`
- Modify: `src/demos/commercialCleaning/steps/SendStep.css`

**Interfaces:**
- Consumes: the scoped `.demo` tokens from Task 3.

**Mapping table (superset — Task 4's rows plus):**

| Hardcoded literal | Replace with |
|---|---|
| `rgba(16, 185, 129, 0.08–0.14)` (success tint) | `var(--demo-success-soft)` |
| `#10b981` (success solid, if any) | `var(--demo-success)` |
| `#f4b740` (warn solid text/border) | `var(--demo-warn)` |
| `rgba(244, 183, 64, 0.06–0.35)` (warn tint) | `var(--demo-warn-soft)` |
| `#e5484d` (error solid) | `var(--demo-error)` |
| `rgba(229, 72, 77, 0.12)` (error tint) | `var(--demo-error-soft)` |
| `#f5b301` (star gold) | `var(--demo-star)` |
| `#fff` (text on accent fill) | `var(--demo-on-accent)` |
| `rgba(90, 169, 230, 0.12–0.5)` (accent tint/glow) | `var(--demo-accent-soft)` (fills) / `var(--demo-accent-glow)` (glows) |
| `rgba(139, 151, 167, 0.12)` / `rgba(100, 116, 139, 0.12)` (muted tint) | `color-mix(in srgb, var(--demo-muted) 12%, transparent)` |
| `rgba(0, 0, 0, 0.35)` (heavy shadow) | `var(--demo-shadow)` |
| `#0a0a0a` (device/phone-screen bg) | **judgment:** if it's a phone/device screen meant to look like a screen, keep a dark value but token it as a local `--demo-screen: #0b1220` on that demo's root and note why; otherwise map to `var(--demo-surface)`. Decide per occurrence and comment it. |

- [ ] **Step 1: Sweep each file against the table**

Work one file at a time. For each: replace literals per the table, reading each in context (solid vs tint form). The `#0a0a0a` device-screen case needs a per-occurrence decision — comment whichever choice you make.

- [ ] **Step 2: Grep-gate all demos**

Run: `grep -rInE '#[0-9a-fA-F]{3,8}|rgba?\(' src/demos | grep -v 'shared/DemoShell.css'`
Expected: only intentional, commented literals (e.g. a deliberately-dark device screen) remain. `DemoShell.css` is excluded because its `.demo` block legitimately defines the token literals.

- [ ] **Step 3: Verify lint + build**

Run: `npm run lint && npm run build`
Expected: both pass.

- [ ] **Step 4: Browser visual check — every demo**

Open each demo route and step through: `invoice-payment-reminders`, `weekly-owner-reports`, `missed-call-text-back`, `automated-quoting`, `new-customer-onboarding`, `job-scheduling-dispatch`, `tool-to-tool-sync`, `win-back-campaigns`, and the commercial-cleaning steps (if routed). Confirm each reads on the light ground with legible status/accent colors and no dark-on-dark or invisible fills.

- [ ] **Step 5: Commit (surface to Brian)**

```bash
git add src/demos
git commit -m "feat: light theme for the remaining automation demos"
```

---

### Task 6: Whole-site light verification sweep

Confirm the migration holds across every page and demo at both viewports, and that no dark remnants survive.

**Files:** none (verification only).

- [ ] **Step 1: Full grep gate**

Run: `grep -rInE '#[0-9a-fA-F]{3,8}|rgba?\(|hsla?\(' src --include='*.css' --include='*.tsx' | grep -vE 'src/index.css|shared/DemoShell.css'`
Expected: only intentional, commented literals remain. Investigate anything unexpected.

- [ ] **Step 2: Lint + build clean**

Run: `npm run lint && npm run build`
Expected: both pass, zero warnings.

- [ ] **Step 3: Browser walk, desktop + mobile (<768px)**

Visit `/`, `/services/technical-consulting`, `/services/automated-workflows`, one workflow detail page, and every `…/:slug/demo` route. For each: light ground, readable text, blue/amber accents correct, footer readable on its dark ground, no light-on-light or dark-on-dark. Note anything off.

- [ ] **Step 4: Commit any final tweaks (surface to Brian)**

If Steps 1–3 surface a nit, fix it in the offending file and:

```bash
git add -A src
git commit -m "style: light theme migration polish"
```

---

## Self-Review notes

- **Spec coverage:** palette formalization → Task 1; marketing sweep (9 files) → Task 2; demo shared palette + semantic tokens → Task 3; demo prototype (review-generation) → Task 4; roll to remaining demos → Task 5; verification (grep gate, browser walk, contrast) → Task 6. Sequencing matches the spec (tokens → marketing → demo prototype → roll). Footer-stays-dark and "new literal earns a token" are in Global Constraints and enforced by the grep gates.
- **Type/token consistency:** the `--demo-*` token names introduced in Task 3's Interfaces are exactly those referenced by Tasks 4–5's mapping tables (`--demo-success-soft`, `--demo-warn`, `--demo-warn-soft`, `--demo-error`, `--demo-error-soft`, `--demo-star`, `--demo-on-accent`, `--demo-shadow`, `--demo-accent-soft`, `--demo-dot`). Global helpers (`--primary-soft`, `--primary-soft-2`, `--warm-soft`, `--shadow-sm`, `--shadow-md`) defined in Task 1, used in Task 2.
- **No placeholders:** token values and mapping tables are concrete; the only deliberate judgment call (`#0a0a0a` device screens) is called out with a decision rule and a comment requirement rather than left vague.
