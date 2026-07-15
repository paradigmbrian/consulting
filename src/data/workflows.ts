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
    published: false,
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
