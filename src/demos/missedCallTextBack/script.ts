import type {
  Business,
  MissedCall,
  AutoText,
  SmsTurn,
  QualifiedLead,
  Booking,
  OwnerAlert,
  ResultsSummary,
  AiStep,
  AiReasoning,
} from "./types";

export const business: Business = {
  name: "Summit Air & Plumbing",
  trades: ["HVAC", "Plumbing"],
  phone: "(•••) •••-7788",
  context: "owner plus two techs, usually out on jobs",
};

export const missedCall: MissedCall = {
  callerName: "Marcus Bell",
  number: "(•••) •••-3162",
  timeLabel: "Today 2:14 PM",
  ringNote: "2 rings → voicemail",
};

export const autoText: AutoText = {
  body: "Hi, this is Summit Air & Plumbing — sorry we missed your call! What can we help with?",
  responseSeconds: 14,
};

export const conversation: SmsTurn[] = [
  {
    id: "t1",
    from: "caller",
    body: "My AC quit and the house is 84 and climbing. Can someone come out today?",
    timeLabel: "2:15 PM",
  },
  {
    id: "t2",
    from: "business",
    body: "Sorry to hear that — we can help. What's the service address, and are you the homeowner?",
    timeLabel: "2:15 PM",
  },
  {
    id: "t3",
    from: "caller",
    body: "Yes, homeowner. 412 Marigold Ln. It's an emergency, it's brutal in here.",
    timeLabel: "2:16 PM",
  },
  {
    id: "t4",
    from: "business",
    body: "Got it. I can get a tech out this afternoon for an AC diagnostic. Want me to lock in the next slot?",
    timeLabel: "2:16 PM",
  },
  {
    id: "t5",
    from: "caller",
    body: "Yes please, ASAP.",
    timeLabel: "2:17 PM",
  },
];

export const qualified: QualifiedLead = {
  problem: "AC not cooling (84°F indoors)",
  urgency: "Same-day / emergency",
  address: "412 Marigold Ln",
  homeowner: true,
};

export const booking: Booking = {
  service: "AC diagnostic",
  when: "Today 4:30 PM",
  tech: "Diego R.",
  value: "$189 diagnostic (repair likely to follow)",
};

export const ownerAlert: OwnerAlert = {
  title: "New job booked",
  lines: [
    "AC diagnostic — Marcus Bell",
    "Today 4:30 PM · Diego R.",
    "$189 diagnostic, repair likely",
    "Captured from a missed call — you did nothing.",
  ],
};

export const results: ResultsSummary = {
  missedCalls: 18,
  recovered: 14,
  booked: 9,
  revenueRecovered: "$4,300+ in jobs recovered this week",
  takeaway:
    "9 booked jobs off calls that would have gone to voicemail — and to the next shop on Google. All from an instant text nobody had to send.",
};

export const aiReasoning: Record<AiStep, AiReasoning> = {
  conversation: {
    step: "conversation",
    title: "AI — working the conversation",
    lines: [
      "Reading the caller's first text: 'AC quit, house is 84.'",
      "Flagging this as a same-day emergency, not a routine request.",
      "Asking for the two things needed to book: address and homeowner.",
      "Confirming 412 Marigold Ln, homeowner verified.",
      "Ready to offer the next available same-day slot.",
    ],
  },
  book: {
    step: "book",
    title: "AI — booking & dispatch",
    lines: [
      "Checking today's schedule for an open emergency slot.",
      "Next opening: 4:30 PM — within the same-day window.",
      "Matching the nearest available tech: Diego R.",
      "Confirming the time with the caller over text.",
      "Writing the job to the board and dispatching Diego.",
    ],
  },
};
