import {
  FaUndo,
  FaCommentDots,
  FaStar,
  FaFileInvoiceDollar,
  FaMoneyBillWave,
  FaUserPlus,
  FaTruck,
  FaChartLine,
  FaSyncAlt,
} from "react-icons/fa";
import type { IconType } from "react-icons";

export interface Stat {
  value: string; // the figure, e.g. a percentage or dollar range
  label: string; // what it measures, in plain language
  source: string; // publication + year, shown on the page
  sourceUrl: string; // required — no stat without a source
}

export interface WorkflowCard {
  slug: string;
  label: string;
  icon: IconType;
  cardSummary: string;
  hasDemo: boolean;
}

export interface WorkflowContent {
  hero: { headline: string; subhead: string };
  stats: Stat[]; // empty ⇒ section omitted
  painPoints: string[];
  mechanism: { title: string; description: string }[];
  faq: { q: string; a: string }[];
}

/**
 * `published: true` requires the page content to exist. An unpublished
 * workflow cannot carry half-written copy, and a published one cannot be
 * missing it.
 */
export type PublishedWorkflow = WorkflowCard &
  WorkflowContent & { published: true };

export type Workflow = (WorkflowCard & { published: false }) | PublishedWorkflow;

export const workflows: Workflow[] = [
  {
    slug: "win-back-campaigns",
    label: "Win-Back Campaigns",
    icon: FaUndo,
    cardSummary: "Re-engage past customers automatically",
    hasDemo: true,
    published: false,
  },
  {
    slug: "missed-call-text-back",
    label: "Missed-Call Text-Back",
    icon: FaCommentDots,
    cardSummary: "Instant reply so leads don't call a competitor",
    hasDemo: true,
    published: true,
    hero: {
      headline: "Every missed call is a customer calling someone else",
      subhead:
        "When your phone rings and nobody picks up, most callers don't leave a voicemail — they dial the next company on the list. This texts them back in seconds, answers their questions, and books the job while you're still up a ladder.",
    },
    stats: [],
    painPoints: [
      "You're on a job, the phone rings, and there's nobody in the office to answer it.",
      "Voicemails pile up until the evening — by then the caller has booked someone else.",
      "You call back the next morning and hear \"we already went with another company.\"",
      "You have no idea how many calls you missed last week, or what they were worth.",
    ],
    mechanism: [
      {
        title: "The call comes in — and goes unanswered",
        description:
          "The automation watches your business line. Nobody has to remember to do anything; the missed call itself is the trigger.",
      },
      {
        title: "A text goes out in seconds",
        description:
          "The caller gets a real reply while your business is still the one they're thinking about — not a voicemail greeting promising you'll call back.",
      },
      {
        title: "The conversation qualifies itself",
        description:
          "An AI-assisted text thread asks what they need, where they are, and how urgent it is — in your voice, using your service area and your pricing rules.",
      },
      {
        title: "The job gets booked",
        description:
          "Qualified leads land on the calendar against your real availability. You get the details, not the back-and-forth.",
      },
      {
        title: "You see what it caught",
        description:
          "Every missed call, reply, and booking is logged, so you can see what the automation recovered instead of guessing.",
      },
    ],
    faq: [
      {
        q: "Will customers know they're texting a robot?",
        a: "The thread is written in your voice, and it never pretends to be a person sitting in your office. Most callers just want a fast, accurate answer — that's what they get. Anything it can't handle cleanly gets handed to you with the whole conversation attached.",
      },
      {
        q: "Does this replace my answering service?",
        a: "It doesn't have to. Plenty of businesses run both: the text-back catches the callers who'd never leave a voicemail, and the answering service handles the ones who want a person. If you'd rather it replace one, we can scope that.",
      },
      {
        q: "What if I'd rather call people back myself?",
        a: "Then it texts them to say you'll call right back, and alerts you with the number and whatever it already knows about the job. The point is that the caller hears from you in seconds — not that a machine has to handle it.",
      },
      {
        q: "Do I need to change my phone system?",
        a: "Almost never. It works with the number you already publish and sits alongside your existing setup rather than replacing it.",
      },
      {
        q: "How long does it take to build?",
        a: "This is usually the fastest one to stand up — typically a couple of weeks from the discovery call to live, depending on how much qualification logic you want in the thread.",
      },
    ],
  },
  {
    slug: "review-generation",
    label: "Review Generation",
    icon: FaStar,
    cardSummary: "A steady stream of 5-star reviews, hands-off",
    hasDemo: true,
    published: false,
  },
  {
    slug: "automated-quoting",
    label: "Automated Quoting",
    icon: FaFileInvoiceDollar,
    cardSummary: "From intake to a ready-to-send quote",
    hasDemo: true,
    published: false,
  },
  {
    slug: "invoice-reminders",
    label: "Invoice & Payment Reminders",
    icon: FaMoneyBillWave,
    cardSummary: "Get paid without chasing",
    hasDemo: true,
    published: false,
  },
  {
    slug: "new-customer-onboarding",
    label: "New-Customer Onboarding",
    icon: FaUserPlus,
    cardSummary: "Welcome, docs, and scheduling handled",
    hasDemo: true,
    published: false,
  },
  {
    slug: "job-dispatch",
    label: "Job Scheduling & Dispatch",
    icon: FaTruck,
    cardSummary: "Right job, right person, customer notified",
    hasDemo: true,
    published: false,
  },
  {
    slug: "weekly-owner-reports",
    label: "Weekly Owner Reports",
    icon: FaChartLine,
    cardSummary: "The numbers that matter, in your inbox",
    hasDemo: true,
    published: false,
  },
  {
    slug: "tool-sync",
    label: "Tool-to-Tool Sync",
    icon: FaSyncAlt,
    cardSummary: "Stop retyping the same data twice",
    hasDemo: true,
    published: false,
  },
];

export const workflowPath = (slug: string): string =>
  `/services/automated-workflows/${slug}`;

export const workflowDemoPath = (slug: string): string =>
  `${workflowPath(slug)}/demo`;

export const getWorkflow = (slug: string): Workflow | undefined =>
  workflows.find((workflow) => workflow.slug === slug);
