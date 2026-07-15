# Invoice & Payment Reminders — Stats Research

**Date:** 2026-07-15
**For:** `/services/automated-workflows/invoice-reminders`

## Outcome

2 accepted, 7 rejected. `stats:` ships with two figures, both from the Federal Reserve Banks' 2024 Report on Payments (2023 Small Business Credit Survey). Unlike the sibling missed-call workflow, this domain **does** have a genuine primary source — the spec's expectation was correct, though not in the form it predicted (no defensible days-sales-outstanding figure exists for this population; see Assessment).

## Accepted

### 1. Most small businesses that invoice say slow-paying customers are a problem
- **value:** 64%
- **label:** of small businesses that collect payment after delivery (e.g., invoice, net 30) say customers being slow to pay is a payments-related challenge
- **source:** Federal Reserve Banks Small Business Credit Survey, 2024 Report on Payments
- **sourceUrl:** https://www.fedsmallbusiness.org/-/media/project/clevelandfedtenant/fsbsite/reports/2024/2024-report-on-payments_sbcs.pdf
- **Verified:** URL fetched 2026-07-15 (HTTP 200, `application/pdf`). Claim present on report page 6 (PDF page 11), chart "PAYMENTS-RELATED CHALLENGES, By Typical Payment Terms and Arrangements", row "Customers are slow to pay", orange series = "Customer pays after delivery of product or service" (N=1,455). Confirmed by rendering the page to an image and reading the chart visually — not by text extraction alone (see Assessment for why this mattered).
- **Population/conditions:** US small **employer** firms, 1–499 full/part-time employees, all 50 states + DC. 2023 SBCS, fielded September–November 2023, published December 2024. Subgroup = the 28% of firms whose largest share of revenue is collected after delivery by invoice. All industries; **mix of B2B and B2C** — not trades-specific. SBCS is a **convenience sample, not a random sample** (the report says so explicitly on page ii).
- **Why it applies here:** The subgroup is defined by *the exact condition the product addresses* — the business gets paid by invoice after the work is done, rather than at the time of service. This is the closest population match available anywhere in the evidence base.

### 2. Slow-paying customers rank second among all small-business payments problems
- **value:** 39%
- **label:** of small businesses say customers being slow to pay is a payments-related challenge
- **source:** Federal Reserve Banks Small Business Credit Survey, 2024 Report on Payments
- **sourceUrl:** https://www.fedsmallbusiness.org/-/media/project/clevelandfedtenant/fsbsite/reports/2024/2024-report-on-payments_sbcs.pdf
- **Verified:** URL fetched 2026-07-15 (HTTP 200). Claim present on report page 5 (PDF page 10), chart "PAYMENTS-RELATED CHALLENGES" (N=4,858), second bar. Confirmed visually. Second-most-common challenge of eight, behind only "fees associated with payments processing" (52%).
- **Population/conditions:** Same survey as above. All small US employer firms answering the payments module (N=4,858), including firms that take payment at the time of sale and therefore have little exposure to late payment.
- **Why it applies here:** Establishes that late payment is a mainstream small-business problem, not a niche one. **Note the overlap:** this figure and the 64% are nested — the 39% population contains the 64% subgroup. If only one is used, use the 64%; if both, they should be presented as a general-then-specific pair, not as two independent findings.

## Rejected

| Figure | Where it came from | Why rejected |
|---|---|---|
| "51% of small businesses cited uneven cash flow as a financial challenge" | Fed SBCS **2025 Report on Employer Firms**, p.4 — verified real (N=7,625, 2024 survey) | **Not a late-payment measure.** The report's own footnote 1 defines the category as *"'Uneven cash flow' includes collecting on receivables"* — i.e. it merges receivables with seasonality and other causes. Publishing it as a late-payment stat would misdescribe a composite. Genuine figure, wrong claim. |
| "58% — customers are slow to pay" for construction firms | Fed SBCS 2024 Report on Payments **Industry appendix** (verified real, N=817) | **Population mismatch.** Table 1 defines this SBCS category ("Nonmanufacturing goods production and associated services") as *"Construction, farming, logistics, mining, taxis, wholesale suppliers and distributors, and warehousing"* — heavily B2B (wholesale, logistics, warehousing), not a trades cut. Cannot be labeled "contractors" honestly; the accurate label is unusable on a sales page. Arguable ⇒ rejected. |
| "37% — customers are slow to pay" for cleaning/repair services | Fed SBCS 2024 Report on Payments Industry appendix (verified real, N=653) | **Population mismatch.** The SBCS "Business support and consumer services" category is *"Barbers, business-event planners, cleaning services, repair services, salons, spas, and travel agencies"* — dominated by at-time-of-service businesses (salons, spas, barbers) that don't invoice. Blends in the wrong direction; can't be sold as a cleaning-business figure. |
| "Median small business holds 27 cash buffer days" | JPMorgan Chase Institute, *Cash is King: Flows, Balances, and Buffer Days* — **verified real and fetched successfully** (597,000 firms, 470M transactions) | **Data is from Feb–Oct 2015, published 2016 — 11 years old.** Also measures cash-buffer fragility, not invoices or late payment; the link to invoice reminders is inferential. Population is Chase business-banking customers, not a random sample. Real and citable, but too old and too indirect for a 2026 claim. |
| "It takes an average of 51 days for US businesses to be paid" | Allianz Trade (Euler Hermes), fetched 2026-07-15 — figure **is** on the page | **Page does not state the population.** I fetched it and confirmed the sentence exists, but the page never says whether the DSO sample is listed companies, small businesses, or B2B only. 2019 data. An unspecified-population DSO figure cannot be labeled as a small-business figure. Fails criterion 4. |
| "82% of small businesses fail because of cash flow problems" | Attributed to a "U.S. Bank study" by Jessie Hagen | **No primary source exists that I could reach.** Every result was a lender/factoring/accounting marketing blog (invopilot, smbcompass, finntree, factorfunding, become.co, cocountant, preferredcfo) citing each other. No U.S. Bank publication, URL, or methodology surfaced. Classic zombie stat — do not use. Also measures business failure, not late payment. |
| "Average DSO for US small businesses is 40–50 days, per Census Bureau data" | Surfaced as a *search-engine summary*, not a real document | **Almost certainly fabricated.** The Census Bureau publishes no small-business DSO series, and no result contained such a figure — the summarizer synthesized an authoritative-sounding attribution out of vendor blogs (Bill.com, HighRadius, Salesforce, Intuit, Upflow, altLINE). See warning in Assessment. |

## Assessment of the evidence base

**The one source that works.** The Federal Reserve Banks' **2024 Report on Payments** (findings from the 2023 SBCS) is the real find, and it is excellent: a US, small-business, government-published study with an explicit late-payment question ("Customers are slow to pay"), broken out *by how the firm collects payment* — which is exactly the axis this product cares about. Full data:

- All employer firms (N=4,858): fees 52%, **slow to pay 39%**, time-consuming processes 20%, delays in settlement 18%, managing multiple streams 13%, fraud 11%, demand for more options 7%, no challenges 20%.
- "Customers are slow to pay" by payment terms: at time of sale **14%**, **after delivery/invoice 64%**, set schedule 48%, installments 56%, third party 50%. (N = 1,864 / 1,455 / 610 / 435 / 234.)
- Also available and verified, if a different angle is ever wanted: **26%** of after-delivery firms cite "time-consuming processes (e.g., billing customers, making deposits at bank)" — an honest but low-impact admin-burden stat. Nonemployer firms (N=3,849): slow to pay **30%**, and 28% collect after delivery.

**A separate, downloadable appendix exists** and is worth knowing about: `.../2024/2024-report-on-payments-appendix.pdf`. Despite the `.pdf` extension it is **actually an XLSX file** (PK zip header) with full cuts by industry, revenue, geography, credit risk, owner demographics, and nonemployer status. Rename to `.xlsx` to open. This is where the industry-level slow-to-pay numbers live.

**Two process warnings for whoever picks this up next:**

1. **`fedsmallbusiness.org` returns HTTP 403 to WebFetch** on every URL, HTML and PDF alike. This is bot-blocking, **not a dead link** — `curl` with a normal browser User-Agent returns HTTP 200 for the landing page, the PDF, and the DOI. Do not conclude the citation is broken. All three of these resolve for a real reader: the PDF (used as `sourceUrl`), the landing page `https://www.fedsmallbusiness.org/reports/survey/2024/2024-report-on-payments`, and the DOI `https://doi.org/10.55350/sbcs-20241205` (redirects to the landing page). The PDF was chosen as `sourceUrl` because it is where the figures are actually visible.

2. **Do not read this report's charts via PDF text extraction.** The bar charts store labels and values as separate text runs, so extraction returns them scrambled and out of order — the all-firms chart yields 9 values for 8 labels. I recovered the mapping by x/y coordinates and then **confirmed it by rendering the pages to images and reading the charts visually**. Both accepted figures were verified that way. Anyone re-checking these numbers should render, not extract.

**What genuinely does not exist.** There is **no defensible days-sales-outstanding or "days to get paid" figure for US small service businesses.** The spec anticipated one; I could not find one that survives the gate. That space is entirely vendor marketing (Bill.com, HighRadius, Intuit, Salesforce, Upflow, altLINE, Crestmont) and the only primary-ish figure (Allianz Trade, 51 days) declines to state its population. **Do not re-research this** — the answer is that the number isn't out there, and the 64% is the better claim anyway.

**The fabrication pattern from the sibling workflow is present here too, in a new form.** No fabricated *institution* citation turned up this time, but the **search-result summaries themselves invented an authoritative attribution** ("approximately 40–50 days, according to general industry research and Census Bureau data") that appeared in no underlying document. The aggregators flagged previously have close cousins in this domain: `invopilot.com`, `thebrokershopinc.com`, and `smbcompass.com` all publish "2025/2026 small business cash flow statistics" listicles — `smbcompass` presents JPMorgan Chase Institute's **2015** buffer-days data under a "Cash Flow Report 2025" headline. Treat every figure in this domain as guilty until fetched at the institution.

**Caveats the owner is standing behind.** Both accepted stats are US and small-business — good. But both are (a) **all-industry, mixing B2B and B2C**, not trades-specific, and (b) drawn from a **convenience sample**, which the Fed states plainly. Neither is a "HVAC contractor" number, and neither should ever be relabeled as one. The 64% is honest as written: businesses that invoice after the work is done.
