import type {
  Business,
  Intake,
  ScopeField,
  Quote,
  Approval,
  Acceptance,
  ResultsSummary,
  AiStep,
  AiReasoning,
} from "./types";

export const business: Business = {
  name: "Anchor Moving Co.",
  service: "Local & long-distance moving",
  context: "Owner + a few crews — quotes are the bottleneck.",
};

export const intake: Intake = {
  customerName: "Devin Marsh",
  channel: "website form",
  rawText:
    "Need to move end of the month. 3-bed house on Oak St to a 2nd-floor apartment across town on Delmar. Got a piano and a big fridge, maybe 30 boxes.",
  receivedLabel: "Today 9:04 AM",
};

export const scope: ScopeField[] = [
  { label: "Move size", value: "3-bedroom house" },
  { label: "From", value: "House, ground floor (Oak St)" },
  { label: "To", value: "Apartment, 2nd floor — stairs (Delmar)" },
  { label: "Distance", value: "~12 mi, cross-town" },
  { label: "Special items", value: "Upright piano, full-size fridge" },
  { label: "Boxes", value: "~30" },
  { label: "Target date", value: "End of month" },
];

export const quote: Quote = {
  lineItems: [
    { label: "Crew", detail: "3 movers × ~5 hrs", amount: "$720" },
    { label: "Truck & mileage", detail: "26' truck, ~12 mi", amount: "$180" },
    { label: "Stairs surcharge", detail: "2nd-floor carry", amount: "$90" },
    { label: "Piano handling", detail: "specialty item", amount: "$150" },
    {
      label: "Packing materials",
      detail: "blankets, tape, wardrobe boxes",
      amount: "$60",
    },
  ],
  total: "$1,200",
  validityNote: "Estimate valid 14 days · final subject to on-site confirmation.",
};

export const approval: Approval = {
  summary: "Itemized quote ready for Devin's move",
  ownerAction: "Owner taps Approve & send — or tweaks a line first.",
};

export const acceptance: Acceptance = {
  customerName: "Devin Marsh",
  replyBody: "Looks good — let's book it for the 28th.",
  bookedDate: "Sat, the 28th",
  jobValue: "$1,200 booked",
};

export const results: ResultsSummary = {
  requests: 34,
  quotesSent: 34,
  avgTurnaround: "4 min",
  jobsBooked: 19,
  winRate: "56%",
  revenueQuoted: "$38k quoted",
  takeaway:
    "34 quote requests, 34 itemized quotes out the door in minutes — 19 booked jobs and $38k quoted, without a single evening spent hand-figuring estimates.",
};

export const aiReasoning: Record<AiStep, AiReasoning> = {
  understand: {
    step: "understand",
    title: "Claude — reading the request",
    lines: [
      "Reading Devin's message the way a customer actually wrote it.",
      "Pulling the essentials: 3-bed house → 2nd-floor apartment, ~12 mi cross-town.",
      "Flagging the hard parts: stairs at the destination, a piano and a full-size fridge.",
      "Estimating volume: ~30 boxes, end-of-month target date.",
      "Marking what needs on-site confirmation before it's final.",
    ],
  },
  build: {
    step: "build",
    title: "Claude — building the quote",
    lines: [
      "Pricing each line from Anchor's own rate card — not a guess.",
      "Sizing crew and truck to a 3-bedroom, ~12-mile move.",
      "Adding the surcharges this job actually needs: 2nd-floor stairs, piano handling.",
      "Totaling it, itemized, so Devin sees exactly what he's paying for.",
    ],
  },
};
