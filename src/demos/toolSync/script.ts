import type {
  Business,
  SourceJob,
  ToolTarget,
  ToolMapping,
  Reconciliation,
  SyncSummary,
  ResultsSummary,
  AiStep,
  AiReasoning,
} from "./types";

export const business: Business = {
  name: "Guardian Pest Control",
  service: "Residential pest control — quarterly plans & one-off treatments",
  context:
    "Every booked job used to get retyped into four apps by hand — ten minutes of double entry per job, and half-typed names quietly spawned duplicate customers.",
};

export const job: SourceJob = {
  customer: "E. Vargas",
  address: "512 Cypress Bend",
  service: "Quarterly pest plan — initial visit",
  price: "$149",
  date: "Thu, Jul 17 · 9–11 AM",
  phone: "(512) 555-0148",
};

export const tools: ToolTarget[] = [
  { name: "Ledgerbook", kind: "Accounting & invoicing" },
  { name: "Pipeline", kind: "CRM — contacts & deals" },
  { name: "Calendar", kind: "Scheduling" },
  { name: "CrewHQ", kind: "Field app — work orders" },
];

export const mappings: ToolMapping[] = [
  {
    toolName: "Ledgerbook",
    kind: "Accounting & invoicing",
    fields: [
      { label: "Customer", value: "Elena Vargas" },
      { label: "Billing address", value: "512 Cypress Bend" },
      { label: "Item", value: "Quarterly pest plan – initial" },
      { label: "Amount", value: "$149.00" },
      { label: "Invoice", value: "Draft #1043" },
    ],
  },
  {
    toolName: "Pipeline",
    kind: "CRM — contacts & deals",
    fields: [
      { label: "Contact", value: "Elena Vargas" },
      { label: "Stage", value: "Won" },
      { label: "Deal", value: "Quarterly plan" },
      { label: "Value", value: "$149" },
      { label: "Source", value: "Online booking" },
    ],
  },
  {
    toolName: "Calendar",
    kind: "Scheduling",
    fields: [
      { label: "Title", value: "Guardian — initial pest visit (Vargas)" },
      { label: "When", value: "Thu Jul 17 · 9:00–11:00 AM" },
      { label: "Location", value: "512 Cypress Bend" },
      { label: "Route", value: "Route 3" },
    ],
  },
  {
    toolName: "CrewHQ",
    kind: "Field app — work orders",
    fields: [
      { label: "Work order", value: "Quarterly initial — Vargas" },
      { label: "Address", value: "512 Cypress Bend" },
      { label: "Window", value: "9–11 AM" },
      { label: "Notes", value: "Gate code at booking; dog on site" },
    ],
  },
];

export const reconciliation: Reconciliation = {
  duplicateFound: true,
  existingLabel: "Existing account: Elena Vargas — last serviced 14 mo ago (lapsed)",
  matchReason:
    "Same service address as the booking, and 'E. Vargas' lines up with Elena Vargas on file — it just came in looking like a brand-new customer.",
  conflicts: [
    {
      field: "Name",
      incoming: "E. Vargas",
      existing: "Elena Vargas",
      resolution: "Merged onto the existing full-name record.",
    },
    {
      field: "Phone",
      incoming: "(512) 555-0148",
      existing: "(512) 555-0132",
      resolution: "Updated to the new number; kept the old on file as history.",
    },
  ],
  note: "Instead of a second 'E. Vargas' customer, the job attached to the real Elena Vargas — and reactivated her lapsed quarterly plan.",
};

export const syncResult: SyncSummary = {
  headline: "Written to all 4 tools",
  rows: [
    { toolName: "Ledgerbook", detail: "Customer matched · draft invoice #1043" },
    { toolName: "Pipeline", detail: "Deal marked Won on the existing contact" },
    { toolName: "Calendar", detail: "Visit booked Thu 9–11 AM" },
    { toolName: "CrewHQ", detail: "Work order created for Route 3" },
  ],
  note: "One entry became four correct records — no duplicate, no retyping.",
};

export const results: ResultsSummary = {
  toolsSynced: 4,
  fieldsMapped: "18",
  duplicatesPrevented: "1 (this job)",
  timeSaved: "~9 min/job",
  takeaway:
    "One booking flowed into accounting, CRM, calendar, and the crew app — correctly shaped for each, with a duplicate customer caught before it doubled up. The office stops retyping, the books stay clean, and nothing falls through the gap between tools.",
};

export const aiReasoning: Record<AiStep, AiReasoning> = {
  map: {
    step: "map",
    title: "Claude — shaping the job for each tool",
    lines: [
      "Reading the one booking: customer, address, service, price, date, phone.",
      "Translating those facts into each tool's own schema and field names.",
      "Building a draft invoice, a CRM deal, a calendar event, and a work order.",
      "Formatting the phone, price, and date the way each app expects them.",
      "Pulling the booking notes through so the crew has what they need.",
    ],
  },
  reconcile: {
    step: "reconcile",
    title: "Claude — checking for duplicates",
    lines: [
      "Before writing anything, searching each tool for an existing match.",
      "Matching on the service address even though the name came in abbreviated and the phone had changed.",
      "Found it — this 'new' customer is a lapsed account, not a new one.",
      "Merging onto the real record instead of creating a second customer.",
      "Resolving the phone conflict, keeping history, and reactivating the plan.",
    ],
  },
};
