# Firm-Voice Conversion Design

**Date:** 2026-07-19
**Status:** Approved (design) — implementation plan to follow
**Author:** Brian Flannery / Paradigm Shift Software Development

## Purpose

Convert the site's marketing/brand voice from first-person singular ("I / me / my") to
first-person plural firm voice ("we / our / us"), so the site reads as an established
studio rather than a single named person. This reverses the recent commit
`c03e5b3 "copy: unify voice to first-person"`.

**Honesty constraint (load-bearing):** every claim stays literally true. This is firm
voice over the *same* real credentials — not an invented team. No fabricated headcount,
colleagues, bios, or roles. "Paradigm Shift Software Development, LLC" legitimately says
"we"; it does not claim people who do not exist.

## What converts vs. what does not

### Convert — the business speaking (brand voice)

First-person where **Paradigm Shift itself** is the speaker. Change to we/our/us.
Occurs in these surfaces:

- `src/components/Home.tsx` — hero subtitle ("from a senior engineer with 10+ years…"),
  and the `AwHowItWorks` title prop `"How I work"` → `"How we work"`.
- `src/components/workflows/AwWhyWorkWithMe.tsx` — "Why work with me" → "Why work with us";
  the four reasons re-voiced (the "10+ years as a professional software engineer" claim
  becomes firm-voiced, still true).
- `src/components/workflows/AwHowItWorks.tsx` — step copy ("I design and build…",
  "I maintain and improve…") → we.
- `src/components/workflows/AwFinalCta.tsx` — any brand-voice first person.
- `src/components/AiIntegration.tsx` — "Why work with me" heading + the proof paragraph
  ("I build AI into…", "I was handed the keys… shipped in ~2 weeks") → we/our.
- `src/components/AutomatedWorkflows.tsx` — hero ("I build AI-powered automations…",
  "Backed by 10+ years as a professional software engineer"), and the `homeFaq` **answers**
  ("I'll walk you through…", "I'll tell you…") → we.
- `src/components/HowItWorks.tsx` (consulting) — "I start with…", "I'll confirm…" → we.
- `src/components/WhyWorkWithMe.tsx` (consulting) — "Why work with me", "I help founders…" → we.
- `src/components/CTA.tsx` (consulting) — "I'll help you figure out…" → we.
- `src/components/Problem.tsx` (consulting) — "The problem I help you solve" → "…we help you solve".
- `src/data/workflows.ts` — FAQ **answers** that speak as the business (e.g. "you don't
  need me to build it" → "…need us to build it"). Convert only the answer text, and only
  where the *business* is the referent.
- `src/components/Footer.tsx` — tagline only if it uses brand-voice first person (current
  tagline "AI-powered automation, built on the tools you already use" needs no change).

### Do NOT touch — not the brand voice

- **Demo and showcase dialogue:** `src/showcases/*`, `src/demos/*/script.ts`,
  `src/demos/commercialCleaning/script.ts`. These are simulated customers and personas
  speaking in character — their "I/me/my" is theirs, not the brand's.
- **FAQ questions** (as opposed to answers): the prospect's own voice — e.g. "Is my
  business's data safe?", "Do I have to switch tools?", "What if I'd rather call people
  back myself?". These stay first-person singular. This applies to `homeFaq` questions in
  `AutomatedWorkflows.tsx` and every `q:` field in `src/data/workflows.ts`.

## Voice rules

- "I" → "we"; "me" → "us"; "my" → "our"; "I'll" → "we'll"; "I've" → "we've";
  "myself" → "ourselves" — **only** in brand-voice copy.
- Re-voice, don't just swap, where a literal swap reads awkwardly. Prefer natural firm
  phrasing over robotic substitution.
- Keep every factual claim true. Examples of acceptable re-voicing:
  - "Backed by 10+ years as a professional software engineer" →
    "Backed by 10+ years of professional software engineering."
  - "from a senior engineer with 10+ years shipping production software" →
    "with 10+ years shipping production software behind every build."
  - "I was handed the keys … and shipped … in about two weeks" →
    "We were handed the keys … and shipped … in about two weeks."
- Headings: "Why work with me" → "Why work with us"; "How I work" → "How we work".
- Do not introduce plural-people claims ("our team of engineers", "our developers") that
  imply headcount. Firm voice ("we build", "our approach", "we were handed the keys") is
  fine; invented staff is not.

## Verification

- No test harness exists; verification is `npm run lint` (zero warnings) + `npm run build`
  + a manual read of each converted surface.
- **Completeness check after conversion:** re-run the brand-voice grep and confirm every
  remaining first-person hit is either demo/showcase dialogue or a FAQ question (the
  no-touch zones). Nothing in brand copy should still say "I/me/my."

## Out of scope (YAGNI)

- Any layout, structure, or routing change.
- Rewriting copy beyond the pronoun/voice shift (no messaging overhaul).
- Building an actual team/about page.
