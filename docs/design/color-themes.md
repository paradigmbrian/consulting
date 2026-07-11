# Color Themes

The whole site is themed from **one block** of CSS custom properties at the top
of `src/index.css` (`:root`). Every component reads these tokens, so swapping
the theme is a matter of replacing that one block — no component edits.

**Currently applied:** Electric Azure (dark).

## How to swap themes

1. Open `src/index.css`.
2. Replace the values inside the `/* ===== Theme: ... ===== */` block in
   `:root` with one of the blocks below.
3. `npm run build` (or the dev server hot-reloads).

Both themes are **full dark**. Panels (hero / CTA sections) use `--hero-bg` and
filled buttons use `--gradient-accent` with `--btn-ink` text, so contrast holds
on either palette.

## Token roles

| Token | Role |
|---|---|
| `--color-primary` | Accent — buttons, links, icons, eyebrows |
| `--color-primary-dark` | Gradient partner / secondary edge |
| `--color-secondary` | Muted UI text (alias of muted) |
| `--color-text` | Primary text on the dark ground |
| `--color-text-light` | Muted / secondary text |
| `--color-bg` | Page ground |
| `--color-bg-light` | Elevated surface — cards, alternating sections |
| `--color-bg-dark` | Deepest surface — footer |
| `--color-border` | Hairlines, card borders, outlined buttons |
| `--color-success` | Semantic success (checkmarks) — not the accent |
| `--color-accent-2` | Secondary accent (gradient partner) |
| `--btn-ink` | Text color on filled accent buttons |
| `--gradient-accent` | Filled-button / accent gradient |
| `--hero-bg` | Dark hero & CTA panel background (glow + gradient) |

---

## Theme: Electric Azure (dark) — CURRENT

Saturated sky-blue on deep navy. Familiar evolution of the original brand blue,
charged up and moved onto a dark ground.

```css
  --color-primary: #38bdf8;        /* azure accent — buttons, links, icons */
  --color-primary-dark: #2563eb;   /* edge — gradient end, hover */
  --color-secondary: #8595ad;
  --color-text: #e6edf7;           /* primary text on dark ground */
  --color-text-light: #8595ad;     /* muted / secondary text */
  --color-bg: #0a0f1a;             /* page ground */
  --color-bg-light: #111a2b;       /* elevated surface — cards, alt sections */
  --color-bg-dark: #06090f;        /* deepest — footer */
  --color-border: #1e2a44;
  --color-success: #34d399;
  --color-accent-2: #2563eb;       /* secondary accent (gradient partner) */
  --btn-ink: #04101f;              /* text on filled accent buttons */
  --gradient-accent: linear-gradient(120deg, #38bdf8 0%, #2563eb 100%);
  --hero-bg: radial-gradient(
      circle at 30% 15%,
      rgba(56, 189, 248, 0.14) 0%,
      transparent 55%
    ),
    linear-gradient(160deg, #0c1526 0%, #0a0f1a 72%);
```

---

## Theme: Cyber Teal (dark)

Cooler, more distinctly "developer/terminal" than Azure. Teal primary with a
cyan gradient edge on a near-black teal-tinted ground. Paste this block over the
Electric Azure block to switch.

```css
  --color-primary: #2dd4bf;        /* teal accent — buttons, links, icons */
  --color-primary-dark: #22d3ee;   /* edge — gradient end (cyan) */
  --color-secondary: #7ea0a6;
  --color-text: #e0f0f2;           /* primary text on dark ground */
  --color-text-light: #7ea0a6;     /* muted / secondary text */
  --color-bg: #071316;             /* page ground */
  --color-bg-light: #0d1f24;       /* elevated surface — cards, alt sections */
  --color-bg-dark: #040c0e;        /* deepest — footer */
  --color-border: #143138;
  --color-success: #4ade80;
  --color-accent-2: #22d3ee;       /* secondary accent (gradient partner) */
  --btn-ink: #02141a;              /* text on filled accent buttons */
  --gradient-accent: linear-gradient(120deg, #2dd4bf 0%, #22d3ee 100%);
  --hero-bg: radial-gradient(
      circle at 30% 15%,
      rgba(45, 212, 191, 0.14) 0%,
      transparent 55%
    ),
    linear-gradient(160deg, #0a1e22 0%, #071316 72%);
```

---

## Notes

- `--color-success` is intentionally a **green** in both themes so the ✓
  checkmarks (e.g. the "Why me" list) stay distinct from the accent. On Cyber
  Teal it's nudged toward lime (`#4ade80`) so it reads apart from the teal
  accent.
- Decorative gradient icon circles in the Technical Consulting page
  (`Offer.css`, `HowItWorks.css`) still use `--color-primary → --color-primary-dark`
  with white glyphs. They render fine on both themes; if you want them to match
  the tinted circle treatment used on the Automated Workflows page, that's a
  small follow-up (swap to a `color-mix` tinted background + accent-colored
  glyph).
- Both themes commit to a dark site. If you later want **light pages with a
  dark hero** instead, that's a larger change (the content sections would need a
  light `--color-bg`/`--color-text` while `--hero-bg` and panels stay dark) —
  flag it and it can be planned separately.
