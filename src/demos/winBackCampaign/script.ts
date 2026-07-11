import type {
  Practice,
  PatientRecord,
  Segment,
  DroppedSummary,
  Offer,
  DraftMessage,
  Reply,
  Booking,
  ResultsSummary,
  AiStep,
  AiReasoning,
} from "./types";

export const practice: Practice = {
  name: "Riverbend Family Dental",
  services: ["Cleanings & exams", "Whitening", "Restorative"],
  winBackWindow: "No visit in 9+ months",
  listSource: "Practice management export (Dentrix)",
  listSize: 1420,
};

export const patients: PatientRecord[] = [
  {
    id: "wb1",
    name: "Marcus Bell",
    lastVisitLabel: "14 months ago",
    lastService: "Cleaning & exam",
    contact: "(•••) •••-4021",
  },
  {
    id: "wb2",
    name: "Priya Nair",
    lastVisitLabel: "11 months ago",
    lastService: "Cleaning",
    contact: "p•••@•••.com",
  },
  {
    id: "wb3",
    name: "Dana Whitfield",
    lastVisitLabel: "17 months ago",
    lastService: "Whitening",
    contact: "(•••) •••-8842",
  },
  {
    id: "wb4",
    name: "Owen Grant",
    lastVisitLabel: "3 months ago",
    lastService: "Cleaning & exam",
    contact: "(•••) •••-1190",
  },
];

export const featuredPatientId = "wb1";

export const segments: Segment[] = [
  {
    id: "s1",
    label: "Overdue hygiene (9–18 mo)",
    criteria: "Due for a cleaning, reachable, no active plan",
    count: 612,
    winnable: true,
  },
  {
    id: "s2",
    label: "Lapsed restorative",
    criteria: "Had treatment, no recall booked, high value",
    count: 138,
    winnable: true,
  },
];

export const droppedSummary: DroppedSummary = {
  dropped: 670,
  reasons: [
    "No valid phone or email on file",
    "Visited within the last 6 months",
    "Previously opted out of outreach",
  ],
};

export const offer: Offer = {
  headline: "$59 return cleaning + exam",
  detail:
    "New-patient-style pricing for lapsed patients, valid for 3 weeks, online booking link included.",
  channel: "SMS, with email fallback",
};

export const messages: DraftMessage[] = [
  {
    patientId: "wb1",
    channel: "SMS",
    body: "Hi Marcus, it's Riverbend Family Dental — it's been a while! We'd love to get you back in. Book a $59 cleaning + exam this month: rvbd.co/book. Reply STOP to opt out.",
  },
];

export const reply: Reply = {
  patientId: "wb1",
  fromName: "Marcus Bell",
  channel: "SMS",
  body: "Oh nice, I've been meaning to come in. Do you have anything Thursday afternoon?",
  receivedLabel: "About an hour later",
};

export const booking: Booking = {
  patientId: "wb1",
  service: "Cleaning & exam",
  when: "Thu 2:30 PM",
  value: "$220 first visit",
};

export const results: ResultsSummary = {
  contacted: 750,
  delivered: 731,
  replied: 96,
  booked: 41,
  revenueRecovered: "$9,020 booked",
  takeaway:
    "41 lapsed patients rebooked from one campaign — off a list the practice already owned, with no ad spend.",
};

export const aiReasoning: Record<AiStep, AiReasoning> = {
  segment: {
    step: "segment",
    title: "Claude — segmenting the list",
    lines: [
      "Scanning 1,420 patient records for recall gaps…",
      "Flagging visits older than 9 months with valid contact info.",
      "Separating high-value restorative lapses from routine hygiene.",
      "Dropping opt-outs and anyone seen in the last 6 months.",
      "2 winnable segments, 750 reachable patients.",
    ],
  },
  offer: {
    step: "offer",
    title: "Claude — drafting the offer & copy",
    lines: [
      "Picking an offer that clears the 'worth booking' bar: $59 cleaning + exam.",
      "Writing a short, personal SMS — first name, practice name, one link.",
      "Keeping it compliant: clear sender, easy opt-out.",
      "Tailoring tone per segment; drafting the featured message.",
    ],
  },
};
