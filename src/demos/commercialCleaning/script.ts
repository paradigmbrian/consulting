import type {
  Company,
  Prospect,
  Enrichment,
  DraftEmail,
  Reply,
  ResultsSummary,
  AiStep,
  AiReasoning,
} from "./types";

export const company: Company = {
  name: "Summit Commercial Cleaning",
  tagline: "Recurring janitorial for facilities that can't afford to look unkempt.",
  services: [
    "Nightly office janitorial",
    "Medical-grade clinic sanitation",
    "Floor care & carpet extraction",
    "Restroom restocking & disinfection",
  ],
  serviceArea: "Greater Austin, TX (30-mile radius)",
  icp: {
    facilityTypes: ["Offices", "Clinics", "Gyms", "Daycares", "Retail"],
    serviceRadiusMiles: 30,
    serviceAreaLabel: "Greater Austin, TX",
  },
};

export const prospects: Prospect[] = [
  {
    id: "p1",
    name: "Lakeline Dental Group",
    facilityType: "Dental clinic",
    address: "13740 Research Blvd, Austin, TX 78750",
    website: "lakelinedental.com",
    matchSignals: [
      "Physical clinic in service area",
      "No in-house janitorial listed",
      "Medical facility — needs compliant sanitation",
    ],
  },
  {
    id: "p2",
    name: "Northcross Family YMCA",
    facilityType: "Gym / community center",
    address: "2913 W Anderson Ln, Austin, TX 78757",
    website: "northcrossy.org",
    matchSignals: [
      "High-traffic facility within radius",
      "Multiple restrooms & locker rooms",
    ],
  },
  {
    id: "p3",
    name: "Bright Beginnings Daycare",
    facilityType: "Daycare",
    address: "8500 N Mopac Expy, Austin, TX 78759",
    website: "brightbeginningsatx.com",
    matchSignals: [
      "Licensed childcare — strict cleaning needs",
      "Single facility owner-operated",
    ],
  },
  {
    id: "p4",
    name: "Mueller Eye Associates",
    facilityType: "Optometry clinic",
    address: "1801 E 51st St, Austin, TX 78723",
    website: "muellereye.com",
    matchSignals: ["Clinic in service area", "No janitorial vendor found"],
  },
  {
    id: "p5",
    name: "Cedar Park Coworking",
    facilityType: "Office / coworking",
    address: "715 Discovery Blvd, Cedar Park, TX 78613",
    website: "cedarparkcowork.com",
    matchSignals: [
      "Multi-tenant office space",
      "Shared common areas & kitchens",
    ],
  },
  {
    id: "p6",
    name: "Barton Springs Pediatrics",
    facilityType: "Pediatric clinic",
    address: "3705 Medical Pkwy, Austin, TX 78705",
    website: "bartonspringspeds.com",
    matchSignals: ["Medical facility in radius", "Multi-room clinic"],
  },
  {
    id: "p7",
    name: "The Hartwell Residence",
    facilityType: "Private residence",
    address: "4402 Rollingwood Dr, Austin, TX 78746",
    website: "—",
    matchSignals: ["Address matched in radius"],
  },
  {
    id: "p8",
    name: "SparkleRight Janitorial",
    facilityType: "Cleaning company",
    address: "9600 Escarpment Blvd, Austin, TX 78749",
    website: "sparklerightatx.com",
    matchSignals: ["Facility-services keyword match"],
  },
  {
    id: "p9",
    name: "Riverside Distribution Center",
    facilityType: "Warehouse",
    address: "4900 E Riverside Dr, Austin, TX 78741",
    website: "riversidedc.com",
    matchSignals: ["Large facility in radius"],
  },
];

export const enrichments: Enrichment[] = [
  {
    prospectId: "p1",
    contactName: "Dr. Amelia Reyes",
    contactTitle: "Practice Owner",
    email: "areyes@lakelinedental.com",
    phone: "(512) 555-0142",
    employeeEstimate: "12–18 staff",
    facilityDetail: "~4,200 sq ft, 6 operatories + waiting room",
    qualified: true,
  },
  {
    prospectId: "p2",
    contactName: "Marcus Bell",
    contactTitle: "Facilities Director",
    email: "mbell@northcrossy.org",
    phone: "(512) 555-0188",
    employeeEstimate: "40+ staff",
    facilityDetail: "~22,000 sq ft, gym floor + 4 restrooms + locker rooms",
    qualified: true,
  },
  {
    prospectId: "p3",
    contactName: "Tanya Okafor",
    contactTitle: "Owner / Director",
    email: "tanya@brightbeginningsatx.com",
    phone: "(512) 555-0119",
    employeeEstimate: "8–12 staff",
    facilityDetail: "~3,000 sq ft, 6 classrooms + kitchen",
    qualified: true,
  },
  {
    prospectId: "p4",
    contactName: "Dr. Steven Liu",
    contactTitle: "Owner",
    email: "sliu@muellereye.com",
    phone: "(512) 555-0173",
    employeeEstimate: "6–10 staff",
    facilityDetail: "~2,800 sq ft, exam rooms + optical floor",
    qualified: true,
  },
  {
    prospectId: "p5",
    contactName: "Priya Nair",
    contactTitle: "Operations Manager",
    email: "priya@cedarparkcowork.com",
    phone: "(512) 555-0160",
    employeeEstimate: "Property mgmt, ~200 members",
    facilityDetail: "~15,000 sq ft, open floor + 8 conference rooms",
    qualified: true,
  },
  {
    prospectId: "p6",
    contactName: "Dr. Renee Caldwell",
    contactTitle: "Managing Partner",
    email: "rcaldwell@bartonspringspeds.com",
    phone: "(512) 555-0205",
    employeeEstimate: "15–20 staff",
    facilityDetail: "~5,000 sq ft, 8 exam rooms + lab",
    qualified: true,
  },
  {
    prospectId: "p7",
    contactName: "—",
    contactTitle: "—",
    email: "—",
    phone: "—",
    employeeEstimate: "—",
    facilityDetail: "Single-family home",
    qualified: false,
    dropReason: "Residential address — outside commercial ICP.",
  },
  {
    prospectId: "p8",
    contactName: "—",
    contactTitle: "—",
    email: "info@sparklerightatx.com",
    phone: "(512) 555-0191",
    employeeEstimate: "25+ staff",
    facilityDetail: "Janitorial services firm",
    qualified: false,
    dropReason: "Direct competitor — not a buyer.",
  },
  {
    prospectId: "p9",
    contactName: "—",
    contactTitle: "—",
    email: "—",
    phone: "(512) 555-0210",
    employeeEstimate: "Unknown",
    facilityDetail: "~80,000 sq ft warehouse",
    qualified: false,
    dropReason: "No reachable decision-maker found after enrichment.",
  },
];

/** The qualified prospect Personalize/Send/Results focus on. */
export const featuredProspectId = "p1";

export const emails: DraftEmail[] = [
  {
    prospectId: "p1",
    subject: "Quick question about nightly cleaning at Lakeline Dental",
    body: [
      "Hi Dr. Reyes,",
      "",
      "I run Summit Commercial Cleaning here in north Austin, and I work with a few dental practices off Research Blvd on their nightly janitorial — operatory wipe-downs, restroom disinfection, and floor care that keeps an inspection-ready clinic.",
      "",
      "I noticed Lakeline has six operatories and a busy waiting room. For practices that size we usually handle a nightly turn so your team walks into a spotless office every morning without anyone staying late to do it.",
      "",
      "Would it be worth a 15-minute call to see if we're a fit? Happy to put together a quick walk-through quote.",
      "",
      "Best,",
      "Brian — Summit Commercial Cleaning",
      "(512) 555-0100",
    ].join("\n"),
    footer:
      "Summit Commercial Cleaning · 13740 Research Blvd, Austin, TX 78750 · You're receiving this one-time outreach because of your business listing. Reply STOP to opt out and we won't contact you again.",
  },
];

export const reply: Reply = {
  prospectId: "p1",
  fromName: "Dr. Amelia Reyes",
  subject: "Re: Quick question about nightly cleaning at Lakeline Dental",
  body: [
    "Hi Brian,",
    "",
    "Good timing — our current cleaner has been inconsistent and I've been meaning to look around. Six operatories is right, and inspection-readiness is exactly my concern.",
    "",
    "Thursday afternoon works for a walk-through. What time suits you?",
    "",
    "Thanks,",
    "Amelia",
  ].join("\n"),
  receivedLabel: "2 days later",
};

export const results: ResultsSummary = {
  sent: 6,
  opened: 4,
  replied: 1,
  takeaway:
    "Six qualified facilities reached, four opens, one booked walk-through — from a single scripted pass. This is exactly what we'd run for your business.",
};

export const aiReasoning: Record<AiStep, AiReasoning> = {
  discover: {
    step: "discover",
    title: "AI — matching buy-signals",
    lines: [
      "Scanning facility types across the service area…",
      "Inferring fit: physical location, no in-house janitorial, inside the radius.",
      "Prioritizing recurring-cleaning need — clinics, daycares, and gyms score highest.",
    ],
  },
  enrich: {
    step: "enrich",
    title: "AI — qualifying prospects",
    lines: [
      "Cross-checking each prospect against Summit's ideal-customer profile…",
      "Dropping The Hartwell Residence: residential address, outside the commercial ICP.",
      "Dropping SparkleRight Janitorial: a competitor, not a buyer.",
      "Keeping the 6 facilities with a reachable decision-maker.",
    ],
  },
  personalize: {
    step: "personalize",
    title: "AI — drafting outreach",
    lines: [
      "Reading Lakeline Dental's profile: 6 operatories, ~4,200 sq ft.",
      "Decision-maker is the practice owner, Dr. Reyes — address her directly.",
      "Angle: an inspection-ready clinic with a nightly operatory + restroom turn.",
      "Writing a short, specific note — not a generic blast.",
    ],
  },
};
