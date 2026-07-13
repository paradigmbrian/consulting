# Invoice & Payment Reminders Demo Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build an interactive 6-step click-through demo for the "Invoice & Payment Reminders" automation on the shared demo engine, and link it from its example card on the Automated Workflows page.

**Architecture:** A new thin `src/demos/invoiceReminders/` folder mirroring `src/demos/automatedQuoting/`: a `WorkflowProvider` interface (`types.ts`) backed by scripted mock data (`script.ts`) via a provider (`provider.ts`), a step list (`steps.ts`), six step components (`steps/`) plus a shared `InvoiceCard` presentational component, scoped CSS (`invoices.css`), and a composition root (`InvoiceRemindersDemo.tsx`) wrapping the shared `DemoProvider → SendLifecycleProvider → DemoShell`. Two steps (`plan`, `draft`) are AI-powered and render the shared `AiPanel`; the `send` step reuses the shared send lifecycle. **No changes to `src/demos/shared/`.**

**Tech Stack:** React 18 + TypeScript, Vite 5, react-router-dom v6, react-icons/fa, vanilla CSS with `--demo-*` / `--spacing-*` custom properties (defined in `src/index.css` / `src/demos/shared/DemoShell.css`).

## Global Constraints

- **No engine/shared changes.** Everything under `src/demos/shared/` is reused unchanged.
- **CSS class prefix `inv-*`**, scoped in `invoices.css`. Prefer `--demo-*` / `--spacing-*` tokens for structural color/spacing; a few literal values are acceptable, matching sibling demos (`reviews.css`/`quoting.css` use `#fff`, star yellows, `rgba(16,185,129,…)` success tints, `#0a0a0a` on-accent text).
- **No test framework exists** in this repo. Per-task verification gate is `npm run build` (tsc + Vite) then `npm run lint` (zero warnings). The final task adds a `npm run dev` smoke test.
- **Read-only git.** Do NOT run any git write commands (`add`, `commit`, etc.). Leave all changes in the working tree; commit commands are surfaced to the user at the end. Ignore any "Commit" steps below.
- **Fully scripted.** No real invoicing/payment integration. No interactive editing of the cadence or reminders (presentational only). No per-send owner approval step.
- **Content values are illustrative and tunable**; the `WorkflowProvider` interface is fixed.
- **AiStep union is exactly** `"plan" | "draft"`.
- **Route path:** `/demos/invoice-reminders`. **Example card target:** same path, set as `to` on `examples[4]` (the "Invoice & Payment Reminders" entry, `icon: FaMoneyBillWave`) in `AutomatedWorkflows.tsx`.
- **Working tree also holds prior uncommitted/committed demo work.** This feature touches disjoint paths (`src/demos/invoiceReminders/`) plus additive edits to `src/App.tsx` and `src/components/AutomatedWorkflows.tsx` — edits there must be purely additive (use targeted Edit, never rewrite; leave existing imports/routes/example entries intact).
- **Obsidian export (from global CLAUDE.md):** after the plan is finalized, the plan is copied to `/Users/brian/Documents/dev-vault/projects/paradigm/consulting-website/docs/superpowers/plans/` (the spec is already exported). Handled in the final task.

---

### Task 1: Data layer — types, mock script, provider

**Files:**
- Create: `src/demos/invoiceReminders/types.ts`
- Create: `src/demos/invoiceReminders/script.ts`
- Create: `src/demos/invoiceReminders/provider.ts`

**Interfaces:**
- Consumes: nothing (foundation task).
- Produces:
  - Types: `Business`, `Invoice`, `CadenceRung`, `ReminderDraft`, `Payment`, `OwnerFlag`, `ResultsSummary`, `AiStep` (`"plan" | "draft"`), `AiReasoning`, `WorkflowProvider`.
  - `WorkflowProvider` methods: `getBusiness(): Business`, `getInvoice(): Invoice`, `getCadence(): CadenceRung[]`, `getReminders(): ReminderDraft[]`, `getPayment(): Payment`, `getOwnerFlag(): OwnerFlag`, `getResults(): ResultsSummary`, `getAiReasoning(step: AiStep): AiReasoning`.
  - `export const scriptedWorkflowProvider: WorkflowProvider`.

- [ ] **Step 1: Create `types.ts`**

```ts
export interface Business {
  name: string;
  service: string;
  context: string;
}

export interface Invoice {
  customerName: string;
  jobDescription: string;
  invoiceNo: string;
  amount: string;
  issuedLabel: string;
  dueLabel: string;
  daysOverdue: number;
}

export interface CadenceRung {
  label: string;
  timing: string;
  tone: string;
  channel: string;
  isOwnerFlag?: boolean;
}

export interface ReminderDraft {
  rungLabel: string;
  tone: string;
  body: string;
}

export interface Payment {
  customerName: string;
  method: string;
  amount: string;
  paidLabel: string;
  daysToPay: string;
}

export interface OwnerFlag {
  summary: string;
  note: string;
}

export interface ResultsSummary {
  invoicesTracked: number;
  collected: string;
  avgDaysBefore: string;
  avgDaysAfter: string;
  hoursSaved: string;
  flaggedForCall: number;
  takeaway: string;
}

export type AiStep = "plan" | "draft";

export interface AiReasoning {
  step: AiStep;
  title: string;
  lines: string[];
}

export interface WorkflowProvider {
  getBusiness(): Business;
  getInvoice(): Invoice;
  getCadence(): CadenceRung[];
  getReminders(): ReminderDraft[];
  getPayment(): Payment;
  getOwnerFlag(): OwnerFlag;
  getResults(): ResultsSummary;
  getAiReasoning(step: AiStep): AiReasoning;
}
```

- [ ] **Step 2: Create `script.ts`**

```ts
import type {
  Business,
  Invoice,
  CadenceRung,
  ReminderDraft,
  Payment,
  OwnerFlag,
  ResultsSummary,
  AiStep,
  AiReasoning,
} from "./types";

export const business: Business = {
  name: "Voltline Electric",
  service: "Residential & commercial electrical",
  context:
    "Small crew — invoices go out after every job, but chasing late payers eats the owner's nights.",
};

export const invoice: Invoice = {
  customerName: "Marcus Bell",
  jobDescription: "Panel upgrade + kitchen circuits",
  invoiceNo: "#1042",
  amount: "$2,450",
  issuedLabel: "Issued Jun 26",
  dueLabel: "Due Jul 3 · net 7",
  daysOverdue: 6,
};

export const cadence: CadenceRung[] = [
  {
    label: "Friendly heads-up",
    timing: "Day before due",
    tone: "Warm, informational",
    channel: "Text + email",
  },
  {
    label: "Gentle nudge",
    timing: "+3 days overdue",
    tone: "Friendly, no pressure",
    channel: "Text",
  },
  {
    label: "Firm reminder",
    timing: "+10 days overdue",
    tone: "Clear & professional",
    channel: "Email + text",
  },
  {
    label: "Flag for the owner",
    timing: "+14 days, still unpaid",
    tone: "Hand off to a human",
    channel: "Owner alert",
    isOwnerFlag: true,
  },
];

export const reminders: ReminderDraft[] = [
  {
    rungLabel: "Friendly heads-up",
    tone: "Warm, informational",
    body: "Hi Marcus — quick heads-up that your invoice for the panel upgrade ($2,450) is due tomorrow. Pay in a tap here: [link]. Thanks again!",
  },
  {
    rungLabel: "Gentle nudge",
    tone: "Friendly, no pressure",
    body: "Hi Marcus, just circling back — the $2,450 invoice for your panel upgrade is a few days past due. No worries if it slipped your mind; you can pay anytime here: [link].",
  },
  {
    rungLabel: "Firm reminder",
    tone: "Clear & professional",
    body: "Hi Marcus, following up on invoice #1042 for $2,450, now 10 days past due. Please settle it at your earliest convenience: [link]. Happy to sort out any questions — just reply here.",
  },
];

export const payment: Payment = {
  customerName: "Marcus Bell",
  method: "Card — one-tap link",
  amount: "$2,450",
  paidLabel: "Paid ~2 hrs after the firm reminder",
  daysToPay: "11 days",
};

export const ownerFlag: OwnerFlag = {
  summary: "The safety net you didn't need this time",
  note: "If Marcus had gone quiet past day 14, the AI would've stopped texting and flagged him for a personal call — it never nags a good customer into resentment.",
};

export const results: ResultsSummary = {
  invoicesTracked: 22,
  collected: "$18.6k collected",
  avgDaysBefore: "31 days",
  avgDaysAfter: "12 days",
  hoursSaved: "~6 hrs/mo",
  flaggedForCall: 2,
  takeaway:
    "Every invoice followed up on time and in the right tone — days-to-pay cut from 31 to 12, $18.6k collected, and only 2 needed a personal call. No more evenings spent chasing.",
};

export const aiReasoning: Record<AiStep, AiReasoning> = {
  plan: {
    step: "plan",
    title: "Claude — planning the follow-up",
    lines: [
      "Reading the invoice: $2,450 for the panel upgrade, now slipping past due.",
      "Checking Marcus's history — a good customer who's paid before, just late.",
      "Setting a schedule: a friendly heads-up, then a gentle nudge, then a firmer reminder.",
      "Adding a safety net: if it's still unpaid at day 14, stop and flag it for a personal call.",
      "Escalating tone gradually — never harsh with a customer worth keeping.",
    ],
  },
  draft: {
    step: "draft",
    title: "Claude — writing the reminders",
    lines: [
      "Writing each reminder in the tone the schedule calls for.",
      "The heads-up stays warm; the nudge is friendly and low-pressure.",
      "The firm reminder is clear and professional — direct, never rude.",
      "Every message carries a one-tap pay link, so paying takes seconds.",
    ],
  },
};
```

- [ ] **Step 3: Create `provider.ts`**

```ts
import type {
  Business,
  Invoice,
  CadenceRung,
  ReminderDraft,
  Payment,
  OwnerFlag,
  ResultsSummary,
  AiStep,
  AiReasoning,
  WorkflowProvider,
} from "./types";
import {
  business,
  invoice,
  cadence,
  reminders,
  payment,
  ownerFlag,
  results,
  aiReasoning,
} from "./script";

class ScriptedWorkflowProvider implements WorkflowProvider {
  getBusiness(): Business {
    return business;
  }

  getInvoice(): Invoice {
    return invoice;
  }

  getCadence(): CadenceRung[] {
    return cadence;
  }

  getReminders(): ReminderDraft[] {
    return reminders;
  }

  getPayment(): Payment {
    return payment;
  }

  getOwnerFlag(): OwnerFlag {
    return ownerFlag;
  }

  getResults(): ResultsSummary {
    return results;
  }

  getAiReasoning(step: AiStep): AiReasoning {
    return aiReasoning[step];
  }
}

export const scriptedWorkflowProvider: WorkflowProvider =
  new ScriptedWorkflowProvider();
```

- [ ] **Step 4: Verify build + lint**

Run: `npm run build && npm run lint`
Expected: PASS — no errors. (These three files compile as a self-contained unit; `tsc` type-checks them under the project `include`.)

- [ ] **Step 5: Commit** — SKIP (read-only git; leave in working tree).

---

### Task 2: Step list, scoped stylesheet, overdue + plan steps

**Files:**
- Create: `src/demos/invoiceReminders/steps.ts`
- Create: `src/demos/invoiceReminders/invoices.css`
- Create: `src/demos/invoiceReminders/steps/InvoiceCard.tsx`
- Create: `src/demos/invoiceReminders/steps/OverdueStep.tsx`
- Create: `src/demos/invoiceReminders/steps/PlanStep.tsx`

**Interfaces:**
- Consumes: `WorkflowProvider` (`getBusiness`, `getInvoice`, `getCadence`, `getAiReasoning`) and `Invoice` type from Task 1; `DemoStep` from `../shared/types`; `AiPanel` and `usePrefersReducedMotion` from `../../shared/`.
- Produces:
  - `export const steps: DemoStep[]` (6 entries).
  - `InvoiceCard` — default-exported, `({ invoice, paid }: { invoice: Invoice; paid?: boolean })`; renders the invoice card, with a PAID stamp + `.inv-invoice-paid` styling when `paid` is true. Reused by `OverdueStep` (unpaid) and `PaidStep` (paid, Task 4).
  - Default-exported `OverdueStep` and `PlanStep`, each `({ provider }: { provider: WorkflowProvider })`.
  - `invoices.css` defines every `inv-*` class used across all six steps (created in full here so later tasks only consume classes).

- [ ] **Step 1: Create `steps.ts`**

```ts
import {
  FaFileInvoiceDollar,
  FaCalendarAlt,
  FaPenFancy,
  FaPaperPlane,
  FaCheckCircle,
  FaChartLine,
} from "react-icons/fa";
import type { DemoStep } from "../shared/types";

export const steps: DemoStep[] = [
  { id: "overdue", label: "Invoice slips past due", Icon: FaFileInvoiceDollar },
  { id: "plan", label: "Plan the follow-up", Icon: FaCalendarAlt, isAi: true },
  { id: "draft", label: "Draft the reminders", Icon: FaPenFancy, isAi: true },
  { id: "send", label: "Send & escalate", Icon: FaPaperPlane },
  { id: "paid", label: "Paid", Icon: FaCheckCircle },
  { id: "results", label: "Results", Icon: FaChartLine },
];
```

- [ ] **Step 2: Create `invoices.css`** (complete stylesheet for all six steps)

```css
.inv-step {
  color: var(--demo-text);
}

.inv-heading {
  font-size: 1.15rem;
  margin: 0 0 var(--spacing-xs);
}

.inv-sub {
  color: var(--demo-muted);
  margin: 0 0 var(--spacing-md);
  max-width: 60ch;
}

.inv-note {
  color: var(--demo-muted);
  font-size: 0.85rem;
  margin: var(--spacing-md) 0 0;
}

/* Reveal wrapper */
.inv-reveal {
  opacity: 0;
  transform: translateY(6px);
  transition: opacity 0.4s ease, transform 0.4s ease;
  margin-top: var(--spacing-md);
}
.inv-reveal.is-shown {
  opacity: 1;
  transform: none;
}

/* Invoice card (steps 1 & 5) */
.inv-invoice {
  padding: var(--spacing-md);
  background: var(--demo-surface-2);
  border: 1px solid var(--demo-border);
  border-left: 3px solid var(--demo-accent-bright);
  border-radius: 0.6rem;
}
.inv-invoice-paid {
  border-left-color: var(--demo-success);
}
.inv-invoice-head {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  margin-bottom: var(--spacing-sm);
}
.inv-invoice-icon {
  font-size: 1.5rem;
  color: var(--demo-accent-bright);
}
.inv-invoice-paid .inv-invoice-icon {
  color: var(--demo-success);
}
.inv-invoice-headmeta {
  min-width: 0;
  flex: 1 1 auto;
}
.inv-invoice-customer {
  font-weight: 700;
  margin: 0;
}
.inv-invoice-job {
  color: var(--demo-muted);
  font-size: 0.85rem;
  margin: 0.1rem 0 0;
}
.inv-invoice-stamp {
  align-self: flex-start;
  padding: 0.25rem 0.7rem;
  border-radius: 999px;
  font-size: 0.72rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.06em;
}
.inv-invoice-stamp-overdue {
  background: rgba(244, 183, 64, 0.14);
  color: #f4b740;
}
.inv-invoice-stamp-paid {
  background: rgba(16, 185, 129, 0.14);
  color: var(--demo-success);
}
.inv-invoice-rows {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-sm) var(--spacing-md);
  margin-top: var(--spacing-sm);
}
.inv-invoice-field {
  display: flex;
  flex-direction: column;
  gap: 0.1rem;
}
.inv-invoice-label {
  color: var(--demo-muted);
  font-size: 0.72rem;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}
.inv-invoice-value {
  font-weight: 600;
}
.inv-invoice-amount {
  font-size: 1.4rem;
  font-weight: 800;
  color: var(--demo-accent-bright);
  font-variant-numeric: tabular-nums;
}
.inv-invoice-paid .inv-invoice-amount {
  color: var(--demo-success);
}

/* Cadence ladder (step 2) */
.inv-ladder {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}
.inv-rung {
  display: flex;
  align-items: flex-start;
  gap: var(--spacing-sm);
  padding: var(--spacing-md);
  background: var(--demo-surface-2);
  border: 1px solid var(--demo-border);
  border-radius: 0.6rem;
}
.inv-rung-owner {
  border-style: dashed;
  border-color: #f4b740;
  background: rgba(244, 183, 64, 0.06);
}
.inv-rung-index {
  flex: 0 0 auto;
  width: 1.7rem;
  height: 1.7rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 999px;
  background: var(--demo-accent);
  color: #fff;
  font-weight: 700;
  font-size: 0.85rem;
}
.inv-rung-owner .inv-rung-index {
  background: #f4b740;
  color: #0a0a0a;
}
.inv-rung-body {
  flex: 1 1 auto;
  min-width: 0;
}
.inv-rung-top {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: var(--spacing-sm);
  flex-wrap: wrap;
}
.inv-rung-label {
  font-weight: 700;
}
.inv-rung-timing {
  color: var(--demo-muted);
  font-size: 0.8rem;
  white-space: nowrap;
}
.inv-rung-meta {
  color: var(--demo-muted);
  font-size: 0.85rem;
  margin: 0.25rem 0 0;
}

/* Reminder message ladder (step 3) — the hero */
.inv-messages {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}
.inv-message {
  padding: var(--spacing-md);
  background: var(--demo-surface-2);
  border: 1px solid var(--demo-border);
  border-radius: 0.6rem;
}
.inv-message-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--spacing-sm);
  margin-bottom: var(--spacing-xs);
}
.inv-message-rung {
  font-weight: 700;
  font-size: 0.9rem;
}
.inv-message-tone {
  color: var(--demo-muted);
  font-size: 0.72rem;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  padding: 0.15rem 0.55rem;
  border: 1px solid var(--demo-border);
  border-radius: 999px;
  white-space: nowrap;
}
.inv-message-body {
  margin: 0;
  line-height: 1.55;
}

/* Send / escalate timeline (step 4) */
.inv-outbox {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}
.inv-stages {
  list-style: none;
  display: flex;
  gap: var(--spacing-sm);
  padding: 0;
  margin: 0;
}
.inv-stage {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.35rem;
  padding: var(--spacing-sm);
  border: 1px solid var(--demo-border);
  border-radius: 0.6rem;
  color: var(--demo-muted);
  opacity: 0.5;
  transition: all 0.3s ease;
  text-align: center;
}
.inv-stage.is-active {
  opacity: 1;
  color: var(--demo-text);
  border-color: var(--demo-accent-bright);
}
.inv-stage.is-done {
  color: var(--demo-accent-bright);
}
.inv-stage-icon {
  font-size: 1.2rem;
}
.inv-stage-label {
  font-size: 0.8rem;
  font-weight: 600;
}
.inv-stage-timing {
  font-size: 0.72rem;
  color: var(--demo-muted);
}
.inv-lifecycle {
  list-style: none;
  display: flex;
  gap: var(--spacing-sm);
  padding: 0;
  margin: 0;
}
.inv-life {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.35rem;
  padding: var(--spacing-sm);
  border: 1px solid var(--demo-border);
  border-radius: 0.6rem;
  color: var(--demo-muted);
  opacity: 0.5;
  transition: all 0.3s ease;
}
.inv-life.is-active {
  opacity: 1;
  color: var(--demo-text);
  border-color: var(--demo-accent-bright);
}
.inv-life.is-done {
  color: var(--demo-accent-bright);
}
.inv-life-icon {
  font-size: 1.1rem;
}
.inv-life-label {
  font-size: 0.78rem;
}
.inv-done-note {
  color: var(--demo-muted);
  font-size: 0.9rem;
  margin: 0;
}

/* Payment reveal (step 5) */
.inv-paid-reveal {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
  opacity: 0;
  transform: translateY(6px);
  transition: opacity 0.4s ease, transform 0.4s ease;
}
.inv-paid-reveal.is-shown {
  opacity: 1;
  transform: none;
}
.inv-payment {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-md);
  background: rgba(16, 185, 129, 0.1);
  border: 1px solid var(--demo-success);
  border-radius: 0.6rem;
}
.inv-payment-icon {
  color: var(--demo-success);
  font-size: 1.5rem;
}
.inv-payment-title {
  font-weight: 700;
  margin: 0;
}
.inv-payment-meta {
  color: var(--demo-muted);
  margin: 0.15rem 0 0;
  font-size: 0.9rem;
}
.inv-safety {
  display: flex;
  align-items: flex-start;
  gap: var(--spacing-sm);
  padding: var(--spacing-md);
  border: 1px dashed #f4b740;
  border-radius: 0.6rem;
  background: rgba(244, 183, 64, 0.06);
}
.inv-safety-icon {
  color: #f4b740;
  font-size: 1.3rem;
  margin-top: 0.1rem;
}
.inv-safety-title {
  font-weight: 700;
  margin: 0;
}
.inv-safety-note {
  color: var(--demo-muted);
  margin: 0.2rem 0 0;
  font-size: 0.9rem;
}

/* Results tally + days-to-pay lift (step 6) */
.inv-tally {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: var(--spacing-sm);
  margin-bottom: var(--spacing-md);
}
.inv-tally-item {
  padding: var(--spacing-md);
  text-align: center;
  background: var(--demo-surface-2);
  border: 1px solid var(--demo-border);
  border-radius: 0.6rem;
}
.inv-tally-item-hl {
  border-color: var(--demo-accent-bright);
  box-shadow: 0 0 16px var(--demo-accent-glow);
}
.inv-tally-num {
  display: block;
  font-size: 1.8rem;
  font-weight: 700;
  color: var(--demo-accent-bright);
}
.inv-tally-label {
  color: var(--demo-muted);
  font-size: 0.85rem;
}
.inv-lift {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  flex-wrap: wrap;
  margin-bottom: var(--spacing-md);
  padding: var(--spacing-md);
  background: var(--demo-surface-2);
  border: 1px solid var(--demo-border);
  border-radius: 0.6rem;
}
.inv-lift-before {
  font-size: 1.4rem;
  font-weight: 700;
  color: var(--demo-muted);
}
.inv-lift-arrow {
  color: var(--demo-muted);
  font-weight: 700;
}
.inv-lift-after {
  font-size: 1.8rem;
  font-weight: 800;
  color: var(--demo-success);
}
.inv-lift-caption {
  color: var(--demo-muted);
  font-size: 0.85rem;
  margin-left: auto;
}
.inv-takeaway {
  color: var(--demo-muted);
  max-width: 60ch;
  margin: 0;
}

@media (max-width: 600px) {
  .inv-stages,
  .inv-lifecycle {
    flex-direction: column;
  }
  .inv-lift-caption {
    margin-left: 0;
  }
}
```

- [ ] **Step 3: Create `steps/InvoiceCard.tsx`** (shared presentational invoice card — unpaid + paid variants)

```tsx
import { FaFileInvoiceDollar } from "react-icons/fa";
import type { Invoice } from "../types";

const InvoiceCard = ({
  invoice,
  paid = false,
}: {
  invoice: Invoice;
  paid?: boolean;
}) => (
  <div className={"inv-invoice" + (paid ? " inv-invoice-paid" : "")}>
    <div className="inv-invoice-head">
      <FaFileInvoiceDollar className="inv-invoice-icon" />
      <div className="inv-invoice-headmeta">
        <p className="inv-invoice-customer">
          {invoice.customerName} · {invoice.invoiceNo}
        </p>
        <p className="inv-invoice-job">{invoice.jobDescription}</p>
      </div>
      <span
        className={
          "inv-invoice-stamp" +
          (paid ? " inv-invoice-stamp-paid" : " inv-invoice-stamp-overdue")
        }
      >
        {paid ? "Paid" : `${invoice.daysOverdue} days overdue`}
      </span>
    </div>
    <div className="inv-invoice-rows">
      <div className="inv-invoice-field">
        <span className="inv-invoice-label">Amount</span>
        <span className="inv-invoice-value inv-invoice-amount">
          {invoice.amount}
        </span>
      </div>
      <div className="inv-invoice-field">
        <span className="inv-invoice-label">Issued</span>
        <span className="inv-invoice-value">{invoice.issuedLabel}</span>
      </div>
      <div className="inv-invoice-field">
        <span className="inv-invoice-label">Due</span>
        <span className="inv-invoice-value">{invoice.dueLabel}</span>
      </div>
    </div>
  </div>
);

export default InvoiceCard;
```

- [ ] **Step 4: Create `steps/OverdueStep.tsx`** (step 1 — the trigger, non-AI)

```tsx
import type { WorkflowProvider } from "../types";
import InvoiceCard from "./InvoiceCard";

const OverdueStep = ({ provider }: { provider: WorkflowProvider }) => {
  const business = provider.getBusiness();
  const invoice = provider.getInvoice();

  return (
    <div className="inv-step">
      <h3 className="inv-heading">An invoice quietly slips past due</h3>
      <p className="inv-sub">
        {business.name} does the work and sends the invoice — but follow-up
        slips, and this is exactly where money leaks. Here's one starting to age.
      </p>

      <InvoiceCard invoice={invoice} />

      <p className="inv-note">
        {invoice.customerName} is a good customer who's just late — he needs a
        nudge, not a lecture.
      </p>
    </div>
  );
};

export default OverdueStep;
```

- [ ] **Step 5: Create `steps/PlanStep.tsx`** (step 2 — AI plans the escalation ladder)

```tsx
import { useState } from "react";
import { FaUserClock } from "react-icons/fa";
import type { WorkflowProvider } from "../types";
import { usePrefersReducedMotion } from "../../shared/usePrefersReducedMotion";
import AiPanel from "../../shared/AiPanel";

const PlanStep = ({ provider }: { provider: WorkflowProvider }) => {
  const cadence = provider.getCadence();
  const reasoning = provider.getAiReasoning("plan");
  const reduced = usePrefersReducedMotion();
  const [revealed, setRevealed] = useState(reduced);

  return (
    <div className="inv-step">
      <h3 className="inv-heading">It plans the follow-up — tone and timing</h3>
      <p className="inv-sub">
        Claude doesn't just blast one reminder. It lays out a schedule that gets
        firmer over time, and knows when to hand the tough one to you.
      </p>

      <AiPanel
        title={reasoning.title}
        lines={reasoning.lines}
        onComplete={() => setRevealed(true)}
      />

      <div className={"inv-reveal" + (revealed ? " is-shown" : "")}>
        <div className="inv-ladder">
          {cadence.map((rung, i) => (
            <div
              key={rung.label}
              className={"inv-rung" + (rung.isOwnerFlag ? " inv-rung-owner" : "")}
            >
              <span className="inv-rung-index">
                {rung.isOwnerFlag ? <FaUserClock /> : i + 1}
              </span>
              <div className="inv-rung-body">
                <div className="inv-rung-top">
                  <span className="inv-rung-label">{rung.label}</span>
                  <span className="inv-rung-timing">{rung.timing}</span>
                </div>
                <p className="inv-rung-meta">
                  {rung.tone} · {rung.channel}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PlanStep;
```

- [ ] **Step 6: Verify build + lint**

Run: `npm run build && npm run lint`
Expected: PASS. `AiPanel` default export + `usePrefersReducedMotion` named export resolve; no unused imports (`FaUserClock`, `FaFileInvoiceDollar` both used).

- [ ] **Step 7: Commit** — SKIP (read-only git).

---

### Task 3: Draft-reminders step (hero)

**Files:**
- Create: `src/demos/invoiceReminders/steps/DraftStep.tsx`

**Interfaces:**
- Consumes: `WorkflowProvider` (`getReminders`, `getAiReasoning`) from Task 1; `AiPanel`, `usePrefersReducedMotion` from `../../shared/`; `inv-messages`/`inv-message*` and `inv-reveal` classes from Task 2.
- Produces: default-exported `DraftStep`, `({ provider }: { provider: WorkflowProvider })`.

- [ ] **Step 1: Create `steps/DraftStep.tsx`** (step 3 — AI writes each reminder in tone; the hero reveal)

```tsx
import { useState } from "react";
import type { WorkflowProvider } from "../types";
import { usePrefersReducedMotion } from "../../shared/usePrefersReducedMotion";
import AiPanel from "../../shared/AiPanel";

const DraftStep = ({ provider }: { provider: WorkflowProvider }) => {
  const reminders = provider.getReminders();
  const reasoning = provider.getAiReasoning("draft");
  const reduced = usePrefersReducedMotion();
  const [revealed, setRevealed] = useState(reduced);

  return (
    <div className="inv-step">
      <h3 className="inv-heading">It writes each reminder in the right tone</h3>
      <p className="inv-sub">
        Same customer, three different tones — warm, then friendly, then clearly
        professional. Never a template, never rude.
      </p>

      <AiPanel
        title={reasoning.title}
        lines={reasoning.lines}
        onComplete={() => setRevealed(true)}
      />

      <div className={"inv-reveal" + (revealed ? " is-shown" : "")}>
        <div className="inv-messages">
          {reminders.map((reminder) => (
            <div key={reminder.rungLabel} className="inv-message">
              <div className="inv-message-head">
                <span className="inv-message-rung">{reminder.rungLabel}</span>
                <span className="inv-message-tone">{reminder.tone}</span>
              </div>
              <p className="inv-message-body">{reminder.body}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DraftStep;
```

- [ ] **Step 2: Verify build + lint**

Run: `npm run build && npm run lint`
Expected: PASS. No unused imports; all `inv-message*` classes referenced exist in `invoices.css`.

- [ ] **Step 3: Commit** — SKIP (read-only git).

---

### Task 4: Send/escalate step + paid step

**Files:**
- Create: `src/demos/invoiceReminders/steps/SendStep.tsx`
- Create: `src/demos/invoiceReminders/steps/PaidStep.tsx`

**Interfaces:**
- Consumes: `WorkflowProvider` (`getCadence`, `getInvoice`, `getPayment`, `getOwnerFlag`) from Task 1; `useSendLifecycle` + `SendStatus` from `../../shared/SendLifecycleProvider`; `usePrefersReducedMotion` from `../../shared/`; `InvoiceCard` from `./InvoiceCard` (Task 2); `inv-outbox`/`inv-stages`/`inv-stage*`/`inv-lifecycle`/`inv-life*`/`inv-paid-reveal`/`inv-payment*`/`inv-safety*` classes from Task 2.
- Produces: default-exported `SendStep` and `PaidStep`, each `({ provider }: { provider: WorkflowProvider })`. `SendStep` drives the shared send lifecycle (`start()` on mount) and presents the cadence rungs as a timeline with the active rung running the send-lifecycle strip.

- [ ] **Step 1: Create `steps/SendStep.tsx`** (step 4 — cadence timeline + shared send lifecycle on the active rung)

```tsx
import { useEffect, useRef } from "react";
import {
  FaPaperPlane,
  FaCheck,
  FaEnvelopeOpenText,
} from "react-icons/fa";
import type { WorkflowProvider } from "../types";
import {
  useSendLifecycle,
  type SendStatus,
} from "../../shared/SendLifecycleProvider";

const ORDER: SendStatus[] = ["sending", "delivered", "opened"];

function statusRank(s: SendStatus): number {
  if (s === "idle") return -1;
  if (s === "replied") return ORDER.length - 1;
  return ORDER.indexOf(s);
}

const SendStep = ({ provider }: { provider: WorkflowProvider }) => {
  const cadence = provider.getCadence();
  const { status, start } = useSendLifecycle();
  const started = useRef(false);

  useEffect(() => {
    if (started.current) return;
    started.current = true;
    start();
  }, [start]);

  // The reminders that actually go out (exclude the owner-flag safety net).
  const sentRungs = cadence.filter((rung) => !rung.isOwnerFlag);

  const rank = statusRank(status);
  const lifecycle = [
    { id: "sending", label: "Sending", icon: <FaPaperPlane /> },
    { id: "delivered", label: "Delivered", icon: <FaCheck /> },
    { id: "opened", label: "Read", icon: <FaEnvelopeOpenText /> },
  ];

  return (
    <div className="inv-step">
      <h3 className="inv-heading">The reminders go out on schedule</h3>
      <p className="inv-sub">
        No one lifts a finger. Each reminder fires on its day, in its tone —
        until the invoice is paid or it's time to loop you in.
      </p>

      <div className="inv-outbox">
        <ol className="inv-stages">
          {sentRungs.map((rung) => (
            <li key={rung.label} className="inv-stage is-done">
              <span className="inv-stage-icon">
                <FaCheck />
              </span>
              <span className="inv-stage-label">{rung.label}</span>
              <span className="inv-stage-timing">{rung.timing}</span>
            </li>
          ))}
        </ol>

        <p className="inv-done-note">Firm reminder delivered:</p>

        <ol className="inv-lifecycle">
          {lifecycle.map((stage, i) => (
            <li
              key={stage.id}
              className={
                "inv-life" +
                (rank >= i ? " is-active" : "") +
                (rank > i ? " is-done" : "")
              }
            >
              <span className="inv-life-icon">{stage.icon}</span>
              <span className="inv-life-label">{stage.label}</span>
            </li>
          ))}
        </ol>

        {status === "opened" && (
          <p className="inv-done-note">
            Read. Now watch what happens next — no third-party collections, no
            awkward phone call.
          </p>
        )}
      </div>
    </div>
  );
};

export default SendStep;
```

- [ ] **Step 2: Create `steps/PaidStep.tsx`** (step 5 — invoice flips to PAID + owner-flag safety net)

```tsx
import { useEffect, useRef, useState } from "react";
import { FaMoneyBillWave, FaUserShield } from "react-icons/fa";
import type { WorkflowProvider } from "../types";
import { useSendLifecycle } from "../../shared/SendLifecycleProvider";
import { usePrefersReducedMotion } from "../../shared/usePrefersReducedMotion";
import InvoiceCard from "./InvoiceCard";

const PAID_DELAY_MS = 700;

const PaidStep = ({ provider }: { provider: WorkflowProvider }) => {
  const invoice = provider.getInvoice();
  const payment = provider.getPayment();
  const ownerFlag = provider.getOwnerFlag();
  const { markReplied } = useSendLifecycle();
  const reduced = usePrefersReducedMotion();
  const [shown, setShown] = useState(reduced);
  const timer = useRef<number | null>(null);

  useEffect(() => {
    if (reduced) {
      setShown(true);
      markReplied();
      return;
    }
    timer.current = window.setTimeout(() => {
      setShown(true);
      markReplied();
    }, PAID_DELAY_MS);
    return () => {
      if (timer.current !== null) window.clearTimeout(timer.current);
    };
  }, [reduced, markReplied]);

  return (
    <div className="inv-step">
      <h3 className="inv-heading">Paid — without a single awkward call</h3>
      <p className="inv-sub">
        {payment.customerName} tapped the link and paid right after the firm
        reminder. The invoice closes itself out.
      </p>

      <InvoiceCard invoice={invoice} paid />

      <div className={"inv-paid-reveal" + (shown ? " is-shown" : "")}>
        <div className="inv-payment">
          <FaMoneyBillWave className="inv-payment-icon" />
          <div>
            <p className="inv-payment-title">
              {payment.amount} paid · {payment.method}
            </p>
            <p className="inv-payment-meta">
              {payment.paidLabel} · {payment.daysToPay} to pay
            </p>
          </div>
        </div>

        <div className="inv-safety">
          <FaUserShield className="inv-safety-icon" />
          <div>
            <p className="inv-safety-title">{ownerFlag.summary}</p>
            <p className="inv-safety-note">{ownerFlag.note}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaidStep;
```

- [ ] **Step 3: Verify build + lint**

Run: `npm run build && npm run lint`
Expected: PASS. `useSendLifecycle`/`SendStatus` resolve; `PaidStep` timer cleared on cleanup; all imported icons used.

- [ ] **Step 4: Commit** — SKIP (read-only git).

---

### Task 5: Results step, compose demo, wire route + example card, full verification

**Files:**
- Create: `src/demos/invoiceReminders/steps/ResultsStep.tsx`
- Create: `src/demos/invoiceReminders/InvoiceRemindersDemo.tsx`
- Modify: `src/App.tsx` (add import + `<Route>`, outside `Layout`)
- Modify: `src/components/AutomatedWorkflows.tsx` (add `to` on `examples[4]`)

**Interfaces:**
- Consumes: `steps` (Task 2), `scriptedWorkflowProvider` (Task 1), all six step components (Tasks 2–5), shared `DemoProvider`/`SendLifecycleProvider`/`DemoShell`.
- Produces: default-exported `ResultsStep` and `InvoiceRemindersDemo`; a live route at `/demos/invoice-reminders`; the "Invoice & Payment Reminders" example card becomes a `<Link>`.

- [ ] **Step 1: Create `steps/ResultsStep.tsx`** (step 6 — tally + days-to-pay before→after)

```tsx
import type { WorkflowProvider } from "../types";

const ResultsStep = ({ provider }: { provider: WorkflowProvider }) => {
  const results = provider.getResults();
  const tally = [
    { num: String(results.invoicesTracked), label: "Invoices tracked" },
    { num: results.collected, label: "Collected", hl: true },
    { num: results.hoursSaved, label: "Owner time saved" },
    { num: String(results.flaggedForCall), label: "Flagged for a call" },
  ];

  return (
    <div className="inv-step">
      <h3 className="inv-heading">One month, invoices chasing themselves</h3>
      <p className="inv-sub">
        Every invoice followed up on time and in the right tone — the owner stays
        out of it unless a human is actually needed.
      </p>

      <div className="inv-tally">
        {tally.map((t) => (
          <div
            key={t.label}
            className={"inv-tally-item" + (t.hl ? " inv-tally-item-hl" : "")}
          >
            <span className="inv-tally-num">{t.num}</span>
            <span className="inv-tally-label">{t.label}</span>
          </div>
        ))}
      </div>

      <div className="inv-lift">
        <span className="inv-lift-before">{results.avgDaysBefore}</span>
        <span className="inv-lift-arrow">→</span>
        <span className="inv-lift-after">{results.avgDaysAfter}</span>
        <span className="inv-lift-caption">Avg days to get paid</span>
      </div>

      <p className="inv-takeaway">{results.takeaway}</p>
    </div>
  );
};

export default ResultsStep;
```

- [ ] **Step 2: Create `InvoiceRemindersDemo.tsx`**

```tsx
import type { ReactNode } from "react";
import { DemoProvider } from "../shared/DemoController";
import { SendLifecycleProvider } from "../shared/SendLifecycleProvider";
import DemoShell from "../shared/DemoShell";
import { steps } from "./steps";
import { scriptedWorkflowProvider } from "./provider";
import OverdueStep from "./steps/OverdueStep";
import PlanStep from "./steps/PlanStep";
import DraftStep from "./steps/DraftStep";
import SendStep from "./steps/SendStep";
import PaidStep from "./steps/PaidStep";
import ResultsStep from "./steps/ResultsStep";
import "./invoices.css";

const provider = scriptedWorkflowProvider;

function renderStage(stepId: string): ReactNode {
  switch (stepId) {
    case "overdue":
      return <OverdueStep provider={provider} />;
    case "plan":
      return <PlanStep provider={provider} />;
    case "draft":
      return <DraftStep provider={provider} />;
    case "send":
      return <SendStep provider={provider} />;
    case "paid":
      return <PaidStep provider={provider} />;
    case "results":
      return <ResultsStep provider={provider} />;
    default:
      return null;
  }
}

const InvoiceRemindersDemo = () => {
  const business = provider.getBusiness();
  return (
    <DemoProvider steps={steps}>
      <SendLifecycleProvider>
        <DemoShell
          eyebrow="Paradigm Shift — Automation Demo"
          title={`Invoice & payment reminders for ${business.name}`}
          lede="A click-through of how every invoice follows itself up — in the right tone, at the right time — so you get paid without chasing."
          renderStage={renderStage}
        />
      </SendLifecycleProvider>
    </DemoProvider>
  );
};

export default InvoiceRemindersDemo;
```

- [ ] **Step 3: Wire the route in `src/App.tsx`** (ADDITIVE — use targeted Edit, do not rewrite; leave all existing imports/routes intact)

Add the import alongside the other demo imports (after the `AutomatedQuotingDemo` import):

```tsx
import InvoiceRemindersDemo from "./demos/invoiceReminders/InvoiceRemindersDemo";
```

Add the route after the `automated-quoting` route (inside `<Routes>`, **outside** the `Layout` route):

```tsx
      <Route
        path="/demos/invoice-reminders"
        element={<InvoiceRemindersDemo />}
      />
```

- [ ] **Step 4: Wire the example card in `src/components/AutomatedWorkflows.tsx`** (ADDITIVE — change ONLY the "Invoice & Payment Reminders" entry)

In the `examples` array, add a `to` field to the "Invoice & Payment Reminders" entry (`examples[4]`, `icon: FaMoneyBillWave`):

```tsx
  {
    icon: FaMoneyBillWave,
    title: "Invoice & Payment Reminders",
    description: "Get paid without chasing",
    to: "/demos/invoice-reminders",
  },
```

- [ ] **Step 5: Verify build + lint**

Run: `npm run build && npm run lint`
Expected: PASS — all six step components now imported and used; no unused imports; zero lint warnings.

- [ ] **Step 6: Dev smoke test**

Run: `npm run dev`, open the printed local URL at `/demos/invoice-reminders`. Confirm:
- All 6 steps advance via the vertical rail and Next/Back.
- Step 1 shows the overdue invoice card (days-overdue badge).
- Step 2 plays the `AiPanel`, then reveals the cadence ladder (4 rungs, the owner-flag rung visually distinct).
- Step 3 plays the `AiPanel`, then reveals the 3 reminder message cards with escalating tone labels.
- Step 4 shows the sent rungs + animates the send lifecycle strip to "Read".
- Step 5 shows the invoice flipped to PAID + the payment card + the owner-flag safety-net note.
- Step 6 renders the tally + the days-to-pay before→after + takeaway.
- No horizontal scroll at a 375px-wide viewport; ladder rows and message cards stay readable.
- With OS "reduce motion" enabled, AI panels and reveals show content instantly.
- On `/services/automated-workflows`, the "Invoice & Payment Reminders" card is now a link to this demo.

- [ ] **Step 7: Commit** — SKIP (read-only git). Surface the commit command to the user at completion instead.

- [ ] **Step 8: Export markdown to Obsidian** (global CLAUDE.md rule)

Copy this plan to the mirrored vault path (the spec is already exported):

```bash
mkdir -p "/Users/brian/Documents/dev-vault/projects/paradigm/consulting-website/docs/superpowers/plans"
cp docs/superpowers/plans/2026-07-12-invoice-payment-reminders-demo.md \
   "/Users/brian/Documents/dev-vault/projects/paradigm/consulting-website/docs/superpowers/plans/"
```

---

## Notes for the implementer

- **Send lifecycle timing:** `SendLifecycleProvider` runs `sending → delivered → opened` over ~2.2s. `SendStep` calls `start()` once on mount (ref-guarded) and renders the lifecycle strip for the "firm reminder" rung; the earlier rungs render as already-`is-done`. `PaidStep` then waits `PAID_DELAY_MS` (700ms) before `markReplied()` + revealing the payment/safety-net cards. Under reduced motion the provider jumps straight to `opened` and `PaidStep` reveals instantly.
- **Why `InvoiceCard` is extracted:** the invoice appears in step 1 (unpaid) and step 5 (paid). One component, a `paid` boolean — DRY.
- **The owner-flag rung** (`isOwnerFlag: true`) is the 4th cadence entry. It renders in the step-2 ladder (visually distinct) and is described again in step 5's safety-net card, but it is NOT one of the reminders that "send" in step 4 — `SendStep` filters it out. This is intentional: it's the safety net that didn't need to fire.
- **`Business.service`** is available on the type for parity with sibling demos but is not required to render; `Business.context` and `Business.name` are used. Not a lint concern (object fields, not imports).
