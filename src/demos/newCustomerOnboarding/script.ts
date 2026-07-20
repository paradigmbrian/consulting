import type {
  Business,
  Signup,
  Welcome,
  PacketItem,
  Delivery,
  FirstVisit,
  ResultsSummary,
  AiStep,
  AiReasoning,
} from "./types";

export const business: Business = {
  name: "Clearwater Pool Care",
  service: "Weekly pool cleaning & maintenance",
  context:
    "Every new customer used to mean 20 minutes of welcome email, chasing a signed agreement, and hunting for a gate code before the first visit.",
};

export const signup: Signup = {
  customerName: "Marcus Bell",
  address: "14 Aldercreek Dr",
  serviceBooked: "Weekly pool service — in-ground",
  bookedVia: "Website booking form · Sat 4:12 PM",
  intakeFacts: [
    "In-ground pool, ~18,000 gal",
    "Saltwater system",
    "Prefers morning visits",
    "Card entered at booking",
  ],
};

export const welcome: Welcome = {
  greeting: "Welcome to Clearwater, Marcus!",
  body: [
    "Thanks for choosing Clearwater Pool Care — your weekly service is all set, and we'll keep your water clear and balanced so you never have to think about it.",
    "Your regular technician will be Diego, who runs the Aldercreek route. He'll test and balance your water, clean the pool, and check your saltwater system on every visit.",
  ],
  whatToExpect: [
    "A dependable weekly visit — same day each week, no need to be home.",
    "A photo and quick service summary texted to you after every clean.",
    "Balanced water and a healthy salt system, checked every single time.",
  ],
};

export const packet: PacketItem[] = [
  {
    label: "Service agreement",
    detail: "Weekly terms & auto-pay — one tap to sign",
    status: "requested",
  },
  {
    label: "Gate / pool access",
    detail: "Gate code or access notes so Diego can reach the pool",
    status: "requested",
  },
  {
    label: "Equipment profile",
    detail: "In-ground · ~18,000 gal · saltwater — pulled from your booking",
    status: "ready",
  },
  {
    label: "Billing on file",
    detail: "Card saved at booking — weekly auto-pay ready",
    status: "collected",
  },
  {
    label: "First-visit window",
    detail: "Proposed and confirmed automatically",
    status: "ready",
  },
];

export const delivery: Delivery = {
  recipientName: "Marcus",
  channel: "Text + email",
  sentLabel: "Sat 4:14 PM",
};

export const firstVisit: FirstVisit = {
  slotLabel: "Thursday, Jul 17 · 8:00–9:30 AM",
  tech: "Diego R.",
  confirmation: "First visit booked — Thursday 8:00 AM.",
  detail:
    "Added to Diego's Aldercreek route. Marcus gets a reminder the day before, and you never touched the calendar.",
};

export const results: ResultsSummary = {
  customersOnboarded: 34,
  avgTimeToFirstVisit: "3.5 days",
  agreementsSigned: "94% same-day",
  hoursSaved: "~11 hrs/mo",
  takeaway:
    "Thirty-four new customers welcomed the moment they booked — agreements signed same-day, first visits on the calendar in under four days, and not one evening lost to welcome emails. Every pool starts on the right foot.",
};

export const aiReasoning: Record<AiStep, AiReasoning> = {
  compose: {
    step: "compose",
    title: "AI — composing Marcus's welcome",
    lines: [
      "Pulling the booking: weekly service, in-ground saltwater pool, prefers mornings.",
      "Greeting Marcus by name and confirming exactly what he signed up for.",
      "Assigning a regular tech — Diego, Aldercreek route — so it feels personal, not corporate.",
      "Setting three clear expectations for a recurring service he shouldn't have to think about.",
      "Keeping it warm and under a 20-second read — the voice of an owner who cares.",
    ],
  },
  packet: {
    step: "packet",
    title: "AI — assembling the onboarding packet",
    lines: [
      "Listing everything a new weekly customer needs before the first visit.",
      "Auto-filling what the booking already gave us: equipment profile and card on file.",
      "Flagging what only Marcus can provide: a signed agreement and gate/pool access.",
      "Turning the agreement into a one-tap sign and requesting the gate code in the same message.",
      "Tracking each item's status so nothing has to be chased by hand.",
    ],
  },
};
