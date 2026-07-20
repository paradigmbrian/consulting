import type {
  Business,
  Tech,
  Job,
  Assignment,
  TechRoute,
  DispatchSummary,
  Notification,
  ResultsSummary,
  AiStep,
  AiReasoning,
} from "./types";

export const business: Business = {
  name: "Rapid Flow Plumbing",
  service: "Residential plumbing — repairs, installs & drain cleaning",
  context:
    "Eight jobs, four vans, one emergency — and a dispatcher who spends the first hour every morning playing Tetris with the schedule.",
};

export const techs: Tech[] = [
  { name: "Marco D.", specialty: "Water heaters & installs", zone: "North zone" },
  { name: "Priya N.", specialty: "Leak detection & repair", zone: "Central zone" },
  { name: "Sam K.", specialty: "Drain & sewer", zone: "East zone" },
  { name: "Luis R.", specialty: "General repair", zone: "South zone" },
];

export const jobs: Job[] = [
  {
    customer: "Kessler",
    location: "1420 Oak Hill Rd",
    type: "Water heater replacement",
    window: "8–11 AM",
    priority: "standard",
  },
  {
    customer: "Nguyen",
    location: "88 Birch St",
    type: "Under-sink leak",
    window: "morning",
    priority: "standard",
  },
  {
    customer: "Alvarez",
    location: "310 Maple Ave",
    type: "Main drain clog",
    window: "flexible",
    priority: "standard",
  },
  {
    customer: "Foster",
    location: "27 Cedar Ct",
    type: "Running toilet + faucet",
    window: "1–4 PM",
    priority: "standard",
  },
  {
    customer: "Brennan",
    location: "540 Lakeview Dr",
    type: "Burst pipe — water everywhere",
    window: "ASAP",
    priority: "emergency",
  },
  {
    customer: "Okafor",
    location: "9 Sunset Blvd",
    type: "Water heater — no hot water",
    window: "afternoon",
    priority: "standard",
  },
  {
    customer: "Reyes",
    location: "215 Pine St",
    type: "Slow shower drain",
    window: "flexible",
    priority: "standard",
  },
  {
    customer: "Whitaker",
    location: "76 Elm St",
    type: "Sump pump check",
    window: "morning",
    priority: "standard",
  },
];

export const assignments: Assignment[] = [
  {
    jobLabel: "Burst pipe",
    customer: "Brennan",
    techName: "Priya N.",
    reason:
      "Emergency — Priya's certified for leaks and closest to Lakeview. Bumped to her first stop.",
  },
  {
    jobLabel: "Water heater replacement",
    customer: "Kessler",
    techName: "Marco D.",
    reason:
      "Marco's the water-heater specialist; Oak Hill sits on his north loop.",
  },
  {
    jobLabel: "Water heater — no hot water",
    customer: "Okafor",
    techName: "Marco D.",
    reason:
      "Second heater call — same specialist, batched to save a return trip.",
  },
  {
    jobLabel: "Under-sink leak",
    customer: "Nguyen",
    techName: "Priya N.",
    reason:
      "Leak work in Central — fits Priya's route right after the emergency.",
  },
  {
    jobLabel: "Main drain clog",
    customer: "Alvarez",
    techName: "Sam K.",
    reason: "Drain specialty, East zone — squarely Sam's wheelhouse.",
  },
  {
    jobLabel: "Slow shower drain",
    customer: "Reyes",
    techName: "Sam K.",
    reason: "Another east-side drain — batched onto Sam's run.",
  },
  {
    jobLabel: "Sump pump check",
    customer: "Whitaker",
    techName: "Luis R.",
    reason: "Quick general check, South — keeps Luis's morning tight.",
  },
  {
    jobLabel: "Running toilet + faucet",
    customer: "Foster",
    techName: "Luis R.",
    reason:
      "General repair, afternoon window — pairs with Luis's south route.",
  },
];

export const routes: TechRoute[] = [
  {
    techName: "Priya N.",
    stops: ["1. Brennan — burst pipe (ASAP)", "2. Nguyen — under-sink leak"],
    driveNote: "Emergency first, then the Central leak — 12 min between stops.",
  },
  {
    techName: "Marco D.",
    stops: [
      "1. Kessler — water heater (8–11 AM)",
      "2. Okafor — water heater (PM)",
    ],
    driveNote: "Both installs batched north-to-south — one trip, no backtrack.",
  },
  {
    techName: "Sam K.",
    stops: ["1. Alvarez — main drain", "2. Reyes — shower drain"],
    driveNote: "Two east-side drains back to back — 9 min apart.",
  },
  {
    techName: "Luis R.",
    stops: [
      "1. Whitaker — sump pump (AM)",
      "2. Foster — toilet + faucet (1–4 PM)",
    ],
    driveNote: "Morning check, afternoon repair — honors both windows.",
  },
];

export const dispatch: DispatchSummary = {
  headline: "Pushed to all 4 vans",
  crew: [
    { techName: "Marco D.", stops: "2 stops" },
    { techName: "Priya N.", stops: "2 stops" },
    { techName: "Sam K.", stops: "2 stops" },
    { techName: "Luis R.", stops: "2 stops" },
  ],
  note: "All four vans accept within seconds — the whole crew is rolling before the dispatcher's coffee is poured.",
};

export const notify: Notification = {
  recipientName: "Brennan",
  channel: "Text",
  sentLabel: "7:42 AM",
  message:
    "Hi Brennan — Priya from Rapid Flow is on her way for the burst pipe. ETA 7:55 AM. You'll get a text when she's close.",
};

export const results: ResultsSummary = {
  jobsPlaced: 8,
  driveTimeSaved: "2.5 hrs/day",
  onTimeRate: "96%",
  dispatchTime: "under 1 min",
  takeaway:
    "Eight jobs, four vans, one emergency — sorted and routed in under a minute instead of an hour of morning Tetris. Techs drive less, every customer knows when someone's coming, and the dispatcher gets their morning back.",
};

export const aiReasoning: Record<AiStep, AiReasoning> = {
  assign: {
    step: "assign",
    title: "AI — assigning the day",
    lines: [
      "Reading every job's skill need and flagging the burst-pipe emergency.",
      "Matching each job to the tech whose specialty and zone fit best.",
      "Bumping the burst pipe to the front of the day — everything else flexes around it.",
      "Balancing the load so no van is overloaded and no one's idle.",
      "Keeping each tech near their home zone to cut cross-town drives.",
    ],
  },
  route: {
    step: "route",
    title: "AI — routing each van",
    lines: [
      "Ordering each tech's stops to cut total drive time.",
      "Honoring the ASAP emergency and every fixed time window.",
      "Batching nearby jobs together so vans don't backtrack.",
      "Keeping the emergency locked as Priya's first stop.",
      "Minimizing miles across the whole service area.",
    ],
  },
};
