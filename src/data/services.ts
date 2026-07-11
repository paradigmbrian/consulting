export interface Service {
  slug: string;
  label: string;
  summary: string;
  published: boolean;
}

export const services: Service[] = [
  {
    slug: "technical-consulting",
    label: "Technical Consulting",
    summary:
      "Fractional CTO guidance, technical audits, and MVP blueprints for non-technical founders making early product decisions.",
    published: true,
  },
  {
    slug: "automated-workflows",
    label: "Automated Workflows",
    summary:
      "Design and build automated workflows that remove manual, repetitive operations from your business.",
    published: true,
  },
];

export const publishedServices: Service[] = services.filter((s) => s.published);

export const servicePath = (slug: string): string => `/services/${slug}`;
