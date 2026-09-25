export interface Service {
  slug: string;
  label: string; // short label
  name: string; // card heading on the home page
  eyebrow: string; // who it is for
  line: string; // one-line pitch on the home page card
  summary: string;
  accent: boolean; // accent-styled card on the home page
  metaTitle: string; // <title>, before the site suffix
  metaDescription: string; // 70–160 characters
  published: boolean;
}

/** Ordered as they appear on the home page. */
export const services: Service[] = [
  {
    slug: "automated-workflows",
    label: "Automated Workflows",
    name: "AI Automations",
    eyebrow: "For small-business owners",
    line: "Put AI to work on the busywork — missed calls, quotes, invoices, reviews — on the tools you already use.",
    summary:
      "Design and build automated workflows that remove manual, repetitive operations from your business.",
    accent: true,
    metaTitle: "AI Automations for Small Business",
    metaDescription:
      "AI-powered automations that answer missed calls, chase invoices, ask for reviews and turn messy requests into quotes, built around the tools you already use.",
    published: true,
  },
  {
    slug: "ai-integration",
    label: "AI Integration",
    name: "AI Integration",
    eyebrow: "For startups & product teams",
    line: "Embed AI into the product you already have — starting with a fixed-fee roadmap, not a rebuild.",
    summary:
      "Embed AI into an existing product, starting with a fixed-fee roadmap instead of a rebuild.",
    accent: true,
    metaTitle: "AI Integration for Product Teams",
    metaDescription:
      "Embed AI into the product you already have. Start with a fixed-fee roadmap, not a rebuild, from a senior engineer with 10+ years shipping production software.",
    published: true,
  },
  {
    slug: "technical-consulting",
    label: "Technical Consulting",
    name: "Technical Consulting",
    eyebrow: "For non-technical founders",
    line: "Technical clarity before you build or hire — fixed-scope audits and MVP blueprints.",
    summary:
      "Fractional CTO guidance, technical audits, and MVP blueprints for non-technical founders making early product decisions.",
    accent: false,
    metaTitle: "Technical Consulting for Founders",
    metaDescription:
      "Technical clarity before you build or hire: fixed-scope tech audits, MVP blueprints and fractional CTO guidance for non-technical founders.",
    published: true,
  },
];

export const publishedServices: Service[] = services.filter((s) => s.published);

export const servicePath = (slug: string): string => `/services/${slug}`;

export const getService = (slug: string): Service | undefined =>
  services.find((s) => s.slug === slug);

/** For call sites where a missing service is a programming error. */
export const requireService = (slug: string): Service => {
  const service = getService(slug);
  if (!service) throw new Error(`Unknown service: ${slug}`);
  return service;
};
