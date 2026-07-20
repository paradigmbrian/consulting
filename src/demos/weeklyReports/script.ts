import type {
  Business,
  RawMetric,
  Finding,
  Digest,
  Delivery,
  ActionResult,
  ResultsSummary,
  AiStep,
  AiReasoning,
} from "./types";

export const business: Business = {
  name: "Evergreen Lawn & Landscape",
  service: "Lawn care, landscaping & seasonal cleanups",
  context:
    "Owner runs the crews all week — the numbers pile up in five different apps and never get looked at.",
};

export const rawData: RawMetric[] = [
  { source: "Jobs", label: "Jobs completed", value: "38" },
  { source: "Revenue", label: "Revenue booked", value: "$14,200" },
  { source: "Leads", label: "New leads", value: "23" },
  { source: "Quotes", label: "Quotes sent", value: "17" },
  { source: "Quotes", label: "Quotes still open", value: "6" },
  { source: "Reviews", label: "New reviews", value: "9" },
  { source: "Phone", label: "Missed calls", value: "12" },
  { source: "Crew", label: "Crew hours", value: "410" },
];

export const findings: Finding[] = [
  {
    label: "Revenue",
    value: "$14,200",
    delta: "up 14% vs last week",
    trend: "good",
  },
  {
    label: "Jobs completed",
    value: "38",
    delta: "5 more than last week",
    trend: "good",
  },
  { label: "New leads", value: "23", delta: "up 8%", trend: "good" },
  {
    label: "New reviews",
    value: "9",
    delta: "3 more · 4.8★ avg",
    trend: "good",
  },
  {
    label: "Missed calls",
    value: "12",
    delta: "4 fewer — all auto-answered",
    trend: "good",
  },
  {
    label: "Open quotes aging",
    value: "3 of 6",
    delta: "cold >7 days — needs a nudge",
    trend: "watch",
  },
];

export const digest: Digest = {
  headline:
    "Strong week — revenue up 14% and reviews climbing. One thing to fix: 3 quotes are going cold.",
  highlights: [
    "Revenue hit $14,200 — your best week this month, up 14%.",
    "38 jobs done and 9 fresh reviews (4.8★ avg) — the crews are firing.",
    "23 new leads in, and every missed call got answered automatically.",
  ],
  watchOut:
    "3 of your 6 open quotes haven't been touched in over a week — roughly $4k that could quietly walk.",
  recommendedAction: {
    summary:
      "Send a friendly follow-up to the 3 cold quotes before they slip away.",
    actionLabel: "Nudge the 3 cold quotes",
  },
};

export const delivery: Delivery = {
  recipientName: "Dana",
  channel: "Text + email",
  sentLabel: "Sunday 6:02 PM",
};

export const actionResult: ActionResult = {
  confirmation: "Done — follow-ups sent to all 3.",
  detail:
    "Each got a warm, personalized nudge with a link to accept. Any replies land back in your inbox.",
};

export const results: ResultsSummary = {
  reportsDelivered: 12,
  avgReadTime: "32 sec",
  actionsTaken: 27,
  hoursSaved: "~5 hrs/mo",
  takeaway:
    "Twelve Sunday-night digests, each read in about 30 seconds — 27 quick actions taken straight off them, and zero evenings lost to spreadsheets. The owner finally knows the numbers without chasing them.",
};

export const aiReasoning: Record<AiStep, AiReasoning> = {
  analyze: {
    step: "analyze",
    title: "AI — reading the week",
    lines: [
      "Pulling every tool's numbers into one place — jobs, revenue, leads, quotes, reviews, calls, crew hours.",
      "Comparing each against last week to see what actually moved.",
      "Revenue, jobs, leads, and reviews are all up — the crews had a strong week.",
      "Flagging the outlier: 3 of 6 open quotes have gone cold, over a week untouched.",
      "Deciding what's worth the owner's 30 seconds — the wins, and the one real risk.",
    ],
  },
  write: {
    step: "write",
    title: "AI — writing the digest",
    lines: [
      "Leading with the headline: a strong week, with one thing to fix.",
      "Backing each win with the number that proves it.",
      "Naming the one risk plainly — and the dollars quietly at stake.",
      "Ending with a single clear action the owner can take in one tap.",
      "Keeping it a 30-second read, in the owner's own voice.",
    ],
  },
};
