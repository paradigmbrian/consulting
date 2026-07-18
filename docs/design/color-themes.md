# Color Themes

The whole site is themed from **one block** of CSS custom properties at the top
of `src/index.css` (`:root`). Every component reads these tokens, so swapping
the theme is a matter of replacing that one block — no component edits.

**Currently applied:** Clean Light (Domo-inspired).

## How to swap themes

1. Open `src/index.css`.
2. Replace the values inside the `/* ===== Theme: ... ===== */` block in
   `:root` with one of the blocks below.
3. `npm run build` (or the dev server hot-reloads).

The current theme is a **light** site: white/near-white grounds with a dark
footer (`--color-bg-dark`) for anchor/contrast. The alternate themes below are
**full dark** and predate the light migration. Panels (hero / CTA sections)
use `--hero-bg` and filled buttons use `--gradient-accent` with `--btn-ink`
text, so contrast holds on any palette.

## Token roles

| Token | Role |
|---|---|
| `--color-primary` | Accent — buttons, links, icons, eyebrows |
| `--color-primary-dark` | Gradient partner / secondary edge |
| `--color-secondary` | Muted UI text (alias of muted) |
| `--color-text` | Primary text on the page ground |
| `--color-text-light` | Muted / secondary text |
| `--color-bg` | Page ground |
| `--color-bg-light` | Elevated surface — cards, alternating sections |
| `--color-bg-dark` | Deepest surface — footer |
| `--color-border` | Hairlines, card borders, outlined buttons |
| `--color-success` | Semantic success (checkmarks) — not the accent |
| `--color-accent-2` | Secondary accent (gradient partner) |
| `--color-warm` | Warm amber highlight accent (Domo-like) |
| `--color-warm-dark` | Amber hover |
| `--warm-ink` | Text on amber fills |
| `--btn-ink` | Text color on filled accent buttons |
| `--gradient-accent` | Filled-button / accent gradient |
| `--hero-bg` | Hero & CTA panel background (glow + gradient) |
| `--primary-soft` | Blue tint fill (chips, badges) |
| `--primary-soft-2` | Faint blue wash |
| `--warm-soft` | Amber tint fill |
| `--shadow-sm` | Small elevation shadow (cards) |
| `--shadow-md` | Larger elevation shadow (raised cards, popovers) |
| `--overlay-scrim` | Dark scrim for overlays on a light ground |

---

## Theme: Clean Light (Domo-inspired) — CURRENT

Light, near-white grounds with a saturated blue accent and a warm amber
secondary accent (Domo-like). Dark footer (`--color-bg-dark`) stays as an
anchor/contrast surface. Includes the shared soft/shadow helper tokens used
across chips, badges, cards, and overlays.

```css
  --color-primary: #2563eb;        /* blue accent — buttons, links, icons */
  --color-primary-dark: #1d4ed8;   /* hover / gradient end */
  --color-secondary: #64748b;
  --color-text: #0f172a;           /* near-black — headings + body on light */
  --color-text-light: #566072;     /* muted / secondary text */
  --color-bg: #ffffff;             /* page ground */
  --color-bg-light: #f4f6fa;       /* elevated surface — cards, alt sections */
  --color-bg-dark: #0b1220;        /* footer — stays dark for anchor/contrast */
  --color-border: #e3e8ef;
  --color-success: #059669;
  --color-accent-2: #0ea5e9;       /* secondary accent (gradient partner) */
  --color-warm: #f59e0b;           /* warm amber highlight accent (Domo-like) */
  --color-warm-dark: #d97706;      /* amber hover */
  --warm-ink: #241a02;             /* text on amber fills */
  --primary-soft: rgba(37, 99, 235, 0.10);   /* blue tint fill (chips, badges) */
  --primary-soft-2: rgba(37, 99, 235, 0.04);  /* faint blue wash */
  --warm-soft: rgba(245, 158, 11, 0.14);      /* amber tint fill */
  --shadow-sm: 0 1px 3px rgba(15, 23, 42, 0.06);
  --shadow-md: 0 10px 30px rgba(15, 23, 42, 0.10);
  --overlay-scrim: rgba(15, 23, 42, 0.55);    /* dark scrim for light ground */
  --btn-ink: #ffffff;              /* text on filled accent buttons */
  --gradient-accent: linear-gradient(120deg, #2563eb 0%, #1d4ed8 100%);
  --hero-bg: radial-gradient(
      circle at 30% 15%,
      rgba(37, 99, 235, 0.08) 0%,
      transparent 55%
    ),
    linear-gradient(180deg, #f8fafc 0%, #eef2f7 100%);
```

---

## Theme: Electric Azure (dark)

Saturated sky-blue on deep navy. Familiar evolution of the original brand blue,
charged up and moved onto a dark ground. The site's previous theme, before the
light migration.

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

- `--color-success` is intentionally a **green** across themes so the ✓
  checkmarks (e.g. the "Why me" list) stay distinct from the accent. On Cyber
  Teal it's nudged toward lime (`#4ade80`) so it reads apart from the teal
  accent.
- Decorative gradient icon circles in the Technical Consulting page
  (`Offer.css`, `HowItWorks.css`) still use `--color-primary → --color-primary-dark`
  with white glyphs. They render fine across themes; if you want them to match
  the tinted circle treatment used on the Automated Workflows page, that's a
  small follow-up (swap to a `color-mix` tinted background + accent-colored
  glyph).
- The Electric Azure and Cyber Teal alternates below commit to a full dark
  site; swapping to either reverts the light migration (content sections,
  hero, and panels would all need to go dark together).
