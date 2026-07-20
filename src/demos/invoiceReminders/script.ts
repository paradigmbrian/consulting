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
    title: "AI — planning the follow-up",
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
    title: "AI — writing the reminders",
    lines: [
      "Writing each reminder in the tone the schedule calls for.",
      "The heads-up stays warm; the nudge is friendly and low-pressure.",
      "The firm reminder is clear and professional — direct, never rude.",
      "Every message carries a one-tap pay link, so paying takes seconds.",
    ],
  },
};
