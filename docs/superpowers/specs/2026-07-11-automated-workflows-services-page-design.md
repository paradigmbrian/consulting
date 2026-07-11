# Automated Workflows Services Page — Content & Design Spec

**Route:** `/services/automated-workflows` (wired in `src/App.tsx`, inside the shared `Layout`)
**Depends on:** [[2026-07-11-multi-service-navigation-design]] — **landed.** The nav refactor is complete: `Layout`, `Header`, `LandingPage`, `TechnicalConsulting`, and the `AutomatedWorkflows.tsx` placeholder all exist, `Home.tsx` is removed, and routes are wired. This page can be built now — no blocking prerequisites.
**Status:** Approved — ready for implementation planning

## Overview

Build out the real content for the Automated Workflows service page. The page targets **small local-business owners** (plumbers, cleaners, salons, contractors, dentists, etc.) — a different audience than the Technical Consulting page, which targets non-technical software founders.

### Core positioning

Brian is a **software engineer with 10+ years of experience** who builds *custom* automation, not off-the-shelf software or brittle no-code. This is the page's moat: nearly every competitor selling small-business automation is a no-code agency reselling a platform (e.g. GoHighLevel). Brian actually engineers durable systems around how each business already runs.

The three flagship automations are presented as **examples of what's possible, not a fixed menu / product catalog.** The page sells *capability + credibility*, not SKUs.

### Key decisions

- **No prices on the page.** Every engagement is scoped on a free discovery call. This differs from the Technical Consulting page (which shows fixed prices) — defensible because automation work is custom/bespoke vs. productized. The "How it works → Build → fixed scope, agreed up front" line carries the reassurance that there won't be surprise bills.
- **Examples over-list (9 items)** to signal breadth ("I can build almost anything"), not just the 3 flagship automations from earlier workshopping.
- **Single CTA throughout:** book a free automation consult → Calendly (`https://calendly.com/brian-paradigmshiftdev/30min`, `target="_blank"` + `rel="noopener noreferrer"`).

## Page Structure

Six sections, mirroring the patterns and CSS conventions already used on the Technical Consulting page. Reuse the `--color-*` / `--spacing-*` custom properties from `src/index.css`, the global `.container` wrapper, and the standard section shell (`<section><div className="container"><div className="section-content"><h2 className="section-title">…`). Do **not** depend on the global `.btn*` classes — define page-local button classes (the existing placeholder already does this with `workflows-placeholder-btn`).

Reference patterns in the current codebase:
- **Section shell + intro:** `Solution.tsx` (`.section-title` + `.section-intro`) and `Offer.tsx`.
- **Step layout (for section 4):** `HowItWorks.tsx` — `.steps > .step > .step-number` (holds an icon) + `.step-content` (h3 + p), with an optional closing `.how-it-works-outcome` line.
- **Existing placeholder to replace:** `AutomatedWorkflows.tsx` currently renders a single `.workflows-placeholder` hero with an `HiCog` icon and one Calendly button; its `.tsx` body and paired `AutomatedWorkflows.css` are fully replaced by this spec.

### 1. Positioning hero

> **Custom automation for the way your business actually works.**
>
> I'm a software engineer with 10+ years of experience. I build systems that take the repetitive, revenue-losing busywork off your plate — designed around how your business runs, not a template you have to bend to fit.
>
> **[ Book a free automation consult → ]**

### 2. What can be automated (framing band)

> **If your team does it the same way every time, it can probably be automated.**
>
> The work that quietly eats your week is usually a candidate:
> - Chasing leads and following up
> - Booking, reminders, and no-shows
> - Quotes, invoices, and getting paid
> - Reviews and reputation
> - Moving data between the tools you already use
> - Knowing what's actually working

### 3. Example automations (grid)

Intro line: **A few examples of what that looks like in practice.** Not a fixed menu — if it's repetitive, it's probably a candidate.

Nine cards (title — one-line description):

1. **Win-Back Campaigns** — re-engage past customers automatically
2. **Missed-Call Text-Back** — instant reply so leads don't call a competitor
3. **Review Generation** — a steady stream of 5-star reviews, hands-off
4. **Automated Quoting** — from intake to a ready-to-send quote
5. **Invoice & Payment Reminders** — get paid without chasing
6. **New-Customer Onboarding** — welcome, docs, and scheduling handled
7. **Job Scheduling & Dispatch** — right job, right person, customer notified
8. **Weekly Owner Reports** — the numbers that matter, in your inbox
9. **Tool-to-Tool Sync** — stop retyping the same data twice

Suggested `react-icons` (implementer may adjust for visual balance): Win-Back `FaUndo`, Missed-Call `FaCommentDots`, Review `FaStar`, Quoting `FaFileInvoiceDollar`, Invoice/Payment `FaMoneyBillWave`, Onboarding `FaUserPlus`, Dispatch `FaTruck`, Reports `FaChartLine`, Sync `FaSyncAlt`.

### 4. How it works (3 steps)

Mirror the existing `HowItWorks` component's step pattern.

1. **Discovery call (free)** — we map where your time and money are leaking to repetitive work, and find the highest-ROI place to start.
2. **Build** — I design and build the automation around your existing tools. Fixed scope, agreed up front.
3. **Handoff or hands-off** — you own and run it, or I maintain and improve it over time. Your call.

### 5. Why me (credibility band)

> - 10+ years as a professional software engineer
> - Real, robust engineering — not brittle no-code that breaks
> - Built on the tools you already use
> - Fixed scope, agreed up front — no surprise bills

### 6. CTA

> **Curious what's automatable in your business?**
>
> **[ Book a free automation consult → ]**

## Implementation Notes

- Replaces the placeholder body in `src/components/AutomatedWorkflows.tsx` and rewrites its paired `AutomatedWorkflows.css` (the current `.workflows-placeholder*` styles can be dropped or superseded).
- When this page ships, flip `published: true` for the `automated-workflows` entry in `src/data/services.ts` (currently `false`) so it appears in the `Header` nav and `LandingPage` services grid — both are already driven off `publishedServices`, so no other wiring is needed.
- The route is already wired in `App.tsx` and the shared `Header`/`Footer` come from `Layout` — this task only touches the page body. Do **not** add a page-level header, footer, or brand bar; the layout supplies them.
- Verification per project convention: `npm run build` (tsc + Vite) and `npm run lint` (zero warnings), plus a manual `npm run dev` smoke check of `/services/automated-workflows`.
- Keep copy in the component (no CMS); this project hardcodes all content.

## Out of Scope

- Building any of the actual automations. This is a website content/design task only.
- Pricing tables, tier ladders, or a paid "automation audit" front door — explicitly decided against (free consult model).
- Changes to the Technical Consulting page or shared nav/layout (delivered by the multi-service navigation plan).
