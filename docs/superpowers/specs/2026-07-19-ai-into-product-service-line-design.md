# Service Line Design: "AI, Built Into Your Product"

**Date:** 2026-07-19
**Status:** Approved (offer strategy) — page implementation to be planned separately
**Author:** Brian Flannery / Paradigm Shift Software Development

## Purpose

Add a third high-ROI service line to the consulting website alongside
**Technical Consulting** and **Automated Workflows**. The goal is an offering that
matches the *economics* of the technical-consulting line (fixed scope, high $/hour,
low delivery drag) while capitalizing on current AI demand — without the labor drag
of the Automated Workflows line.

This document specifies the **offer strategy only**. The website page build is a
separate implementation plan.

## Constraints this design must respect

- **Capacity:** 10–12 hrs/week, evenings/async, alongside a full-time job, growing
  toward full-time. No meeting-heavy or SLA-bound-during-business-hours work.
- **Distribution:** website + inbound, cold outbound, some paid marketing. Thin warm
  network (one prior AI client). The offer must include a low-friction entry point
  that converts cold traffic.
- **Wallets:** funded startups / scale-ups and established SMBs (not the price-sensitive
  trades audience of the Automated Workflows line).
- **Preferred engagement shapes:** fixed-scope sprints + one-off audits/advisory.

## Founder capability profile (the design is built on this)

- **Confident:** LLM app integration (tool/function calling, embedded agents),
  prompt/context engineering, data pipelines / ETL, raw shipping speed.
- **Could learn on the job:** RAG / retrieval, evals & reliability, model fine-tuning.
- **Proof point:** shipped a context-aware AI agent embedded inside a startup's live
  product (RallySource) in ~2 weeks — including learning an unfamiliar codebase and
  data model to give the agent real app/tenant context.

## Positioning

**One-liner:**
> "I embed AI into the product you already have — starting with a fixed-fee roadmap,
> not a rebuild."

**Target buyer:** funded startups and established SMBs who know AI belongs in their
product but don't know *what's actually worth building* or *whether their systems can
support it*, and who don't want to hire a full-time ML team to find out.

**Differentiation:** this is AI built *inside* an existing product, not standalone
chatbots or generic automations. It is deliberately scoped to **LLM-into-product** work
to stay distinct from the Automated Workflows line and avoid cannibalizing it.

## The offer: a two-rung ladder

### Rung 1 — AI Opportunity Audit (entry offer)

- **Price:** $3,000 fixed. **Credits toward a subsequent AI Integration Sprint.**
- **Time / delivery:** 8–12 hrs, fully async.
- **Deliverable:** a written report plus a 45-minute walkthrough call, covering:
  1. **3–5 concrete AI opportunities** ranked by value vs. effort.
  2. **Feasibility check** — whether current data/systems can support each opportunity.
  3. **Data-readiness assessment** — what plumbing is missing (see Rung 2 variant).
  4. **A recommended first build** with rough scope and cost.
- **Funnel role:** cheap enough to sell cold or via paid ads, valuable standalone,
  qualifies the buyer, and manufactures demand for Rung 2.

### Rung 2 — AI Integration Sprint (primary revenue)

- **Price:** $10,000–20,000 fixed, scoped from the audit.
- **Time / delivery:** 2–4 weeks, fixed scope.
- **Deliverable:** one working, shipped AI capability inside the client's product —
  e.g. an embedded assistant, an LLM-powered feature, or an internal agent with real
  data context (the top-ranked audit item).
- **Data-not-ready variant ("Data-Ready-for-AI foundation"):** if the audit reveals the
  client's data isn't usable, the first sprint becomes a data pipelines + retrieval
  setup engagement instead. This keeps data work as a *sprint flavor*, not a separate
  product line.
- **Audit credit:** the $3,000 audit fee credits toward the sprint, removing the
  "why pay twice" objection and making the audit an easy first yes.

## Funnel logic (the core mechanism)

```
Cold outbound / paid ad / website inbound
        |  (easy, low-risk yes)
        v
   AI Opportunity Audit   ($3,000, async, high $/hr)
        |  (audit recommends a build; fee credits over)
        v
   AI Integration Sprint  ($10k–20k, fixed scope, 2–4 weeks)
        |
        v
   Repeat sprints / referrals
```

The audit does triple duty: **standalone revenue, buyer qualification, and demand
generation.** This is what makes the line viable on 10–12 hrs/week with a thin pipeline —
the high-ticket sprint is never sold cold; it is always sold to an already-converted,
already-qualified buyer who has received value.

## How it slots onto the site

- New third service line alongside Technical Consulting and Automated Workflows.
- Structurally mirrors existing patterns: a service-line index page presenting the two
  rungs as offer tiers (like `Offer.tsx`'s three tiers), reusing shared section
  components (`AwHowItWorks`, CTA → Calendly).
- No new infrastructure, CMS, or routing paradigm — a new route under `/services/`.
- **The actual page build is a separate implementation plan**, not part of this doc.

## Decisions locked

1. **Audit price:** $3,000, crediting toward a sprint.
2. **Naming:** "AI Opportunity Audit" + "AI Integration Sprint" (kept for now).
3. **AI scope:** strictly LLM-into-product; excludes classic automation (owned by the
   Automated Workflows line).

## Explicitly out of scope (YAGNI)

- Retainers / fractional engagements (fail the capacity constraint).
- Standalone chatbots, generic automations, or model training as a headline offer.
- "Ship-it" AI-agnostic speed sprints (undifferentiated, anchors on hourly rates).
- Data-readiness as a standalone product line (folded into Rung 2 as a variant).
- The website page implementation (separate plan).

## Open follow-ups (not blocking)

- Distribution strategy for the audit (cold outbound scripts, paid-ad targeting, SEO
  landing copy) — the offer is designed to be sellable cold, but the go-to-market
  execution is a separate effort.
- Whether to formalize a productized "audit" intake questionnaire to keep delivery
  inside the 8–12 hr envelope.
