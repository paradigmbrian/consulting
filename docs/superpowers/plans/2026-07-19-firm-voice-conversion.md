# Firm-Voice Conversion Implementation Plan

> **For agentic workers:** small, surgical copy edits. Verification is `npm run lint` + `npm run build` + a completeness grep. No test harness; do not add one.

**Goal:** Convert brand-voice first-person ("I/me/my") to firm voice ("we/our/us") across all marketing copy, keeping every claim true and leaving demo dialogue + FAQ questions untouched. Implements `docs/superpowers/specs/2026-07-19-firm-voice-conversion-design.md`.

## Global Constraints

- Git writes are Brian's; leave changes in the working tree, surface commit at the end.
- No test harness — verify with `npm run lint` (zero warnings) + `npm run build` + manual/grep completeness.
- **No-touch zones:** `src/showcases/*`, `src/demos/*/script.ts`, and every FAQ **question** (`q:` fields in `src/data/workflows.ts`; question strings in `AutomatedWorkflows.tsx` `homeFaq`). Do not rename code identifiers or CSS classes (e.g. `WhyWorkWithMe`, `why-work-with-me`) — visible text only.
- Claims stay literally true; re-voice rather than blind-swap where needed.

## Exact edits

### `src/components/Home.tsx`
- Hero subtitle: `… technical guidance for founders — from a senior engineer with 10+ years shipping production software. Which are you?` → `… technical guidance for founders — backed by 10+ years shipping production software. Which are you?`
- `<AwHowItWorks title="How I work" />` → `<AwHowItWorks title="How we work" />`

### `src/components/workflows/AwWhyWorkWithMe.tsx`
- `<h2 …>Why work with me</h2>` → `Why work with us`
- reasons[0] `"10+ years as a professional software engineer"` → `"10+ years of professional software engineering"`

### `src/components/workflows/AwHowItWorks.tsx`
- Build step description `"I design and build the automation around your existing tools. Fixed scope, agreed up front."` → `"We design and build the automation around your existing tools. Fixed scope, agreed up front."`
- Handoff step description `"You own and run it, or I maintain and improve it over time. Your call."` → `"You own and run it, or we maintain and improve it over time. Your call."`

### `src/components/AiIntegration.tsx`
- `<h2 …>Why work with me</h2>` → `Why work with us`
- Proof paragraph: `I build AI <em>into</em> existing products — not standalone bots. For an early-stage startup, I was handed the keys to an unfamiliar codebase and data model, learned it, and shipped a context-aware AI agent embedded in their live product in about two weeks. …` → `We build AI <em>into</em> existing products — not standalone bots. For an early-stage startup, we were handed the keys to an unfamiliar codebase and data model, learned it, and shipped a context-aware AI agent embedded in their live product in about two weeks. …`

### `src/components/AutomatedWorkflows.tsx`
- Hero subtitle: `I build AI-powered automations that answer missed calls, … not a template you have to bend to fit. Backed by 10+ years as a professional software engineer.` → `We build AI-powered automations that answer missed calls, … not a template you have to bend to fit. Backed by 10+ years of professional software engineering.`
- Trust list item `"10+ years as a professional software engineer"` → `"10+ years of professional software engineering"`
- `homeFaq` answer (data-safe): `… I'll walk you through exactly what it reads and writes on the call …` → `… we'll walk you through exactly what it reads and writes on the call …`
- `homeFaq` answer (switch-tools): `… If a tool can't be connected cleanly, I'll tell you on the call rather than sell you a rebuild.` → `… If a tool can't be connected cleanly, we'll tell you on the call rather than sell you a rebuild.`
- **Keep** the `homeFaq` questions "Is my business's data safe?" and "Do I have to switch tools?" unchanged.

### `src/components/HowItWorks.tsx` (consulting)
- Step 1 desc `"I start with a 30-minute conversation …"` → `"We start with a 30-minute conversation …"`
- Step 2 desc `"Based on your stage and needs, I'll confirm the right engagement …"` → `"Based on your stage and needs, we'll confirm the right engagement …"`

### `src/components/WhyWorkWithMe.tsx` (consulting)
- `Why work with me` → `Why work with us`
- `"I help founders who don't want to make these decisions alone."` → `"We help founders who don't want to make these decisions alone."`
- `"My focus isn't writing code — it's explaining tradeoffs clearly so you can:"` → `"Our focus isn't writing code — it's explaining tradeoffs clearly so you can:"`

### `src/components/CTA.tsx` (consulting)
- `"I'll help you figure out whether one of these engagements is a good fit — no pressure, no pitching."` → `"We'll help you figure out whether one of these engagements is a good fit — no pressure, no pitching."`

### `src/components/Problem.tsx` (consulting)
- `The problem I help you solve` → `The problem we help you solve`
- **Keep** the founder-POV questions ("Which stack should we use?" etc.) unchanged.

### `src/data/workflows.ts`
- Line ~341 answer: `… If your existing tool does that, you don't need me to build it.` → `… If your existing tool does that, you don't need us to build it.`
- **Keep** all `q:` questions unchanged.

## Verification
1. `npm run lint` → zero warnings.
2. `npm run build` → success.
3. Completeness grep — `grep -rnE "\b(I|I'll|I've|I'd|I'm|me|my|myself)\b" src --include='*.tsx' --include='*.ts'` — every remaining hit must be demo/showcase dialogue or a FAQ question. No brand copy still says I/me/my.
4. Manual read of the converted surfaces for natural phrasing and true claims.
