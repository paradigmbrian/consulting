# Missed-Call Text-Back — Stats Research

**Date:** 2026-07-15
**For:** `/services/automated-workflows/missed-call-text-back`

## Outcome

**No figures survived the acceptance gate. This workflow ships `stats: []`.**

Per the task brief: "If fewer than two survive, this workflow ships `stats: []` — that is a legitimate outcome, not a failure." Every candidate figure in this domain failed at least one of the four criteria, most of them on criterion 1 (primary or near-primary).

The short version of why: **this domain has almost no primary research in it.** The missed-call / voicemail / speed-to-lead statistics that saturate the web are produced and recycled by companies selling missed-call and answering software. The one genuine academic study in the space (HBR 2011) is about a different population and is paywalled. See "Assessment of the evidence base" below.

## Accepted

*(none)*

## Rejected

| Figure | Where it came from | Why rejected |
|---|---|---|
| "Firms contacting a lead within 1 hour are ~7x more likely to qualify it, and 60x more likely than those waiting 24+ hours" | Harvard Business Review, March 2011, "The Short Life of Online Sales Leads" (Oldroyd, McElheran, Elkington) — https://hbr.org/2011/03/the-short-life-of-online-sales-leads | **Fails #3 and #4.** #3: article body is paywalled. Fetched hbr.org (2026-07-15) — returns headline/byline teaser only, claim not present. `store.hbr.org` product page resolves but carries only a one-line description, no figures. HBS faculty page → 403; ResearchGate PDF → 403; SKKU repository → 500; the circulating WordPress "PDF" is a 2-page print stub with no body text; web.archive.org not fetchable from this environment. **No URL I could personally fetch contains the number.** #4: population is web-form leads submitted to 2,241 US companies in financial services, autos, education, software, health care, and professional services — B2B/online lead forms, not a residential customer phoning an HVAC company. Both the channel (web form ≠ phone call) and the buyer (B2B ≠ homeowner) are wrong. This is the exact mismatch the brief warns about. **Real research — but not about this.** |
| "Contact a lead within 5 min → 100x more likely to connect, 21x more likely to qualify" (the "MIT study" / Lead Response Management study) | InsideSales.com / Dr. James Oldroyd; circulated via https://ainora.lt/blog/lead-response-time-statistics-every-study-2026 and dozens of others | **Fails #1.** Vendor research by a company that sold lead-response software — the finding is a direct advertisement for the product. Routinely misattributed to "MIT" (Oldroyd's academic affiliation), which lends it unearned authority; MIT did not publish it. No independent replication, no reachable methodology. Famous, but marketing. |
| "391% conversion lift when calling a lead within 1 minute" | Velocify, "The Ultimate Contact Strategy" (~2013) | **Fails #1.** Vendor platform data from a lead-response software company. Self-selected customer base, no independent audit. |
| "67% of callers who reach voicemail don't leave a message" | Attributed to BIA/Kelsey, via https://captureclient.com/blog/why-67-percent-callers-never-leave-voicemail | **Fails #1 and #3.** No reachable BIA/Kelsey primary. Only vendor blogs cite it, each citing another blog. |
| "80% of callers who reach voicemail hang up without leaving a message" | Attributed to Hiya, via https://www.callsaver.ai/blog/why-customers-dont-leave-voicemails | **Fails #1.** Answering-service vendor blog. No traceable Hiya publication. |
| "85–87% of callers don't leave a voicemail" | Attributed to Invoca / RingCentral, via multiple vendor blogs | **Fails #1.** Vendor marketing. |
| "Fewer than 3% of callers routed to voicemail leave a message" | Invoca blog (2024), cited by https://www.hicira.com/missed-call-statistics | **Fails #1.** Vendor blog; no methodology published. Note this figure is ~25x lower than the "67%" claim above — the spread across "sources" is itself proof none are measuring anything. |
| "85% of people whose calls go unanswered will not call back" | PATLive (answering service), via aggregators | **Fails #1.** Vendor marketing. |
| "62% of callers who don't reach you immediately contact a competitor" | Dialzara — https://dialzara.com/blog/missed-calls-hidden-costs-and-ai-solutions | **Fails #1.** Vendor blog selling AI call answering. |
| "85% of callers who don't reach you won't call back — they call a competitor" | https://www.hicira.com/missed-call-statistics, citing "Forbes / BIA Kelsey" but linking to https://pcnanswers.com/missed-call-revenue-study/ | **Fails #1.** Broken attribution chain: credits Forbes/BIA Kelsey but links to an answering-service vendor's own page. The cited authority does not host the claim. |
| "A 2024 Pew Research survey found 72% of people under 40 prefer not to leave voicemails and actively avoid businesses that require it" | Surfaced via AI-generated aggregator blogs (ainora.lt, hicira.com) | **Fails #1, #2, #3 — the figure appears to be fabricated.** Searched pewresearch.org directly (2026-07-15): **no such study exists.** Pew has published nothing matching this claim, population, or year. Flagging explicitly: do not let this one back in, and treat these aggregator sites as unusable for anything. |
| "78% of consumers wish they could text a business" | Intelligent Contacts / LinkedIn listicles, vaguely attributed to "Pew" | **Fails #1 and #2.** Not a Pew finding. No traceable origin; the attribution to Pew appears to be borrowed from the unrelated 2011 texting report below. |
| "31% of cell owners prefer text; 53% prefer a voice call" | Pew Research Center, 2011, "How Americans Use Text Messaging" — https://www.pewresearch.org/internet/2011/09/19/how-americans-use-text-messaging/ | **Fails #4** (passes #1, #2, #3 — URL fetched 2026-07-15, claim present verbatim). Population is *personal* contact preference on one's own cell phone (n=2,277 US adults, Apr–May 2011), not consumer-to-business communication. Also 15 years stale, predating the smartphone-messaging era. **And it points the opposite way from the pitch** — a majority preferred voice calls. Including it honestly would argue against the product; including it selectively would be dishonest. Rejected on both counts. |
| "8 in 10 Americans don't answer calls from unknown numbers; only 14% ignore voicemail" | Pew Research Center, 2020 — https://www.pewresearch.org/short-reads/2020/12/14/most-americans-dont-answer-cellphone-calls-from-unknown-numbers/ | **Fails #4.** Real and primary, but measures the wrong direction: people *receiving* unsolicited inbound calls (telemarketing/survey context). Says nothing about someone who deliberately dialed a business and got voicemail — a caller with intent behaves nothing like someone screening a robocall. |
| "The State of Speed to Lead in Home Services" (2019) — various response-time figures | ConXpros — https://conxpros.com/wp-content/uploads/2019/12/Speed2Lead-case-study.pdf | **Fails #1.** Lead-generation vendor marketing collateral aimed at the exact audience it sells to. PDF text is not extractable (Type1C-encoded), so the claims could not be read or verified even setting the source aside. |
| "Phone calls convert at 10–15x the rate of web form leads" | Attributed to BIA/Kelsey, via vendor blogs | **Fails #1 and #3.** No reachable BIA/Kelsey primary; only vendor repetition. |

## Assessment of the evidence base

The task brief anticipated that lead-response-time figures would be the trap here, and that is exactly what happened. Three findings worth carrying forward to Tasks 9–16:

1. **The voicemail-abandonment cluster is not evidence.** The circulating numbers — 3%, 67%, 80%, 85%, 86%, 87%, 90% — purport to measure the same quantity and disagree by a factor of ~25. Every one traces to a company selling missed-call software. There is no primary study underneath any of them. No amount of further searching will fix this; the research does not exist.

2. **This domain's search results are heavily AI-generated and contain fabricated citations.** Sites like ainora.lt, hicira.com, and their peers publish confident, specific, well-formatted statistics attributed to real institutions (Pew, MIT, Forbes, BIA/Kelsey) that those institutions never published. The invented "2024 Pew voicemail survey" is a confirmed instance. **Treat any statistic sourced from these aggregators as fabricated until proven otherwise, and never cite an institution because an aggregator says it said something — check the institution.**

3. **The honest position is that this workflow's value is self-evident, not statistical.** A trades business owner does not need a study to know that a missed call is a lost job — they know it from their own bookings. A stats section stapled on from B2B web-form research would make the page *less* credible to that reader, not more, because they would recognize a number that has nothing to do with their phone ringing. Shipping `stats: []` is the stronger sales page here, not a gap in it.

**Recommendation for Task 7:** ship `stats: []` and let the page argue from the mechanism rather than from borrowed numbers. If a stats section is wanted later, the only credible source would be first-party data — e.g. measured results from PDS's own deployments, cited as such.
