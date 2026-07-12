import type {
  Business,
  Appointment,
  ReviewRequest,
  ClientReply,
  Routing,
  GoogleReview,
  PrivateCatch,
  ResultsSummary,
  ReplyKind,
  AiStep,
  AiReasoning,
} from "./types";

export const business: Business = {
  name: "Lumière Med Spa",
  category: "Aesthetics & skincare",
  ratingContext: "4.6★ on Google — and new bookings track that rating",
};

export const appointment: Appointment = {
  client: "Jenna Alvarez",
  service: "HydraFacial",
  provider: "Maya",
  timeLabel: "Today 1:30 PM",
};

export const request: ReviewRequest = {
  body: "Hi Jenna! It was so lovely seeing you at Lumière today 💛 How was your visit?",
  delayLabel: "~2 hours later",
};

export const replies: Record<ReplyKind, ClientReply> = {
  happy: {
    kind: "happy",
    name: "Jenna Alvarez",
    service: "HydraFacial",
    body: "Obsessed!! My skin is glowing and Maya was amazing 🤍",
    sentiment: "positive",
    receivedLabel: "Replied 2h later",
  },
  unhappy: {
    kind: "unhappy",
    name: "Rachel K.",
    service: "Dermal filler",
    body: "It was fine. Front desk kept me waiting like 25 min though.",
    sentiment: "negative",
    receivedLabel: "Replied 40m later",
  },
};

export const routing: Record<ReplyKind, Routing> = {
  happy: {
    kind: "happy",
    sentiment: "positive",
    decision: "Delighted client — invite her to leave a public Google review",
    destination: "Google review (one-tap link)",
  },
  unhappy: {
    kind: "unhappy",
    sentiment: "negative",
    decision: "Not happy — keep this private and make it right, don't ask for a public review",
    destination: "Private feedback + owner alert",
  },
};

export const googleReview: GoogleReview = {
  clientName: "Jenna Alvarez",
  stars: 5,
  suggestedBody:
    "Had the best HydraFacial with Maya at Lumière — my skin has never looked this good. Warm team, spotless space, and I already booked my next visit. Highly recommend!",
};

export const privateCatch: PrivateCatch = {
  clientName: "Rachel K.",
  concern: "Long front-desk wait (~25 min)",
  ownerAction: "Owner reaches out personally to apologize and comp her next visit",
  alertLines: [
    "Rachel K. wasn't fully happy today",
    "Issue: ~25-min front-desk wait",
    "She was NOT asked for a public review",
    "Suggested: personal text + a comp to make it right",
  ],
};

export const results: ResultsSummary = {
  requestsSent: 42,
  reviewsGained: 27,
  ratingBefore: "4.6",
  ratingAfter: "4.8",
  intercepted: 5,
  takeaway:
    "27 fresh 5-star reviews in a month and the rating up to 4.8 — plus 5 unhappy clients handled privately instead of becoming public 1-stars.",
};

export const aiReasoning: Record<AiStep, AiReasoning> = {
  route: {
    step: "route",
    title: "Claude — reading the reply",
    lines: [
      "Reading Jenna's reply for tone and specifics.",
      "Sentiment: clearly positive — 'obsessed', 'glowing', names her provider.",
      "Rule: only genuinely delighted clients get pushed to a public review.",
      "Routing Jenna to a one-tap Google review.",
      "(A lukewarm or negative reply takes the other branch — caught privately.)",
    ],
  },
  draft: {
    step: "draft",
    title: "Claude — drafting the review",
    lines: [
      "Writing a short review in Jenna's own voice — not a template.",
      "Working in the specifics she mentioned: HydraFacial, Maya, glowing skin.",
      "Keeping it honest and natural, no exaggeration.",
      "Attaching a one-tap link so posting takes five seconds.",
    ],
  },
};
