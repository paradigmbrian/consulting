import type { Metadata } from "next";
import { requireService, servicePath, type Service } from "../data/services";
import {
  COMPANY_LINKEDIN_URL,
  HOME_DESCRIPTION,
  SITE_NAME,
  SITE_SHORT_NAME,
  SITE_URL,
} from "../data/site";
import { workflowDemoPath, workflowPath } from "../data/workflowPaths";
import type { PublishedWorkflow } from "../data/workflows";

type JsonLd = Record<string, unknown>;

const CONTEXT = "https://schema.org";
const ORGANIZATION_ID = `${SITE_URL}/#organization`;
const WEBSITE_ID = `${SITE_URL}/#website`;

export const absoluteUrl = (path: string): string =>
  path === "/" ? SITE_URL : `${SITE_URL}${path}`;

/** "/services/x" → "services-x"; "/" → "home". The OG route serves `<name>.png`. */
export const ogName = (path: string): string =>
  path === "/" ? "home" : path.slice(1).replaceAll("/", "-");

export const ogImagePath = (path: string): string => `/og/${ogName(path)}.png`;

export interface PageMeta {
  title: string;
  description: string;
  path: string;
  /** Use `title` as the entire <title>, without the site suffix. */
  absoluteTitle?: boolean;
}

export function pageMetadata({
  title,
  description,
  path,
  absoluteTitle = false,
}: PageMeta): Metadata {
  const fullTitle = absoluteTitle ? title : `${title} | ${SITE_SHORT_NAME}`;
  const image = { url: ogImagePath(path), width: 1200, height: 630, alt: title };
  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      locale: "en_US",
      url: path,
      siteName: SITE_NAME,
      title: fullTitle,
      description,
      images: [image],
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [image.url],
    },
  };
}

export const workflowMeta = (
  w: PublishedWorkflow,
): { title: string; description: string } => ({
  title: w.label,
  description: w.metaDescription,
});

export const demoMeta = (
  w: PublishedWorkflow,
): { title: string; description: string } => ({
  title: `${w.label} Demo`,
  description: w.demoDescription,
});

export const organizationJsonLd = (): JsonLd => ({
  "@context": CONTEXT,
  "@type": "Organization",
  "@id": ORGANIZATION_ID,
  name: SITE_NAME,
  alternateName: SITE_SHORT_NAME,
  url: SITE_URL,
  logo: `${SITE_URL}/favicon/ps-favicon-512.png`,
  description: HOME_DESCRIPTION,
  sameAs: [COMPANY_LINKEDIN_URL],
});

export const websiteJsonLd = (): JsonLd => ({
  "@context": CONTEXT,
  "@type": "WebSite",
  "@id": WEBSITE_ID,
  name: SITE_NAME,
  url: SITE_URL,
  publisher: { "@id": ORGANIZATION_ID },
});

export const serviceJsonLd = (s: Service): JsonLd => ({
  "@context": CONTEXT,
  "@type": "Service",
  name: s.name,
  description: s.metaDescription,
  url: absoluteUrl(servicePath(s.slug)),
  provider: { "@id": ORGANIZATION_ID },
  audience: { "@type": "Audience", audienceType: s.eyebrow.replace(/^For /, "") },
});

/** Stats are deliberately absent: no figure travels without its source. */
export const workflowJsonLd = (w: PublishedWorkflow): JsonLd => ({
  "@context": CONTEXT,
  "@type": "Service",
  name: w.label,
  description: w.metaDescription,
  url: absoluteUrl(workflowPath(w.slug)),
  provider: { "@id": ORGANIZATION_ID },
});

export const faqJsonLd = (faq: { q: string; a: string }[]): JsonLd => ({
  "@context": CONTEXT,
  "@type": "FAQPage",
  mainEntity: faq.map((item) => ({
    "@type": "Question",
    name: item.q,
    acceptedAnswer: { "@type": "Answer", text: item.a },
  })),
});

export const breadcrumbJsonLd = (
  items: { name: string; path: string }[],
): JsonLd => ({
  "@context": CONTEXT,
  "@type": "BreadcrumbList",
  itemListElement: items.map((item, index) => ({
    "@type": "ListItem",
    position: index + 1,
    name: item.name,
    item: absoluteUrl(item.path),
  })),
});

const automationsCrumbs = (): { name: string; path: string }[] => {
  const automations = requireService("automated-workflows");
  return [
    { name: "Home", path: "/" },
    { name: automations.name, path: servicePath(automations.slug) },
  ];
};

export const workflowBreadcrumb = (w: PublishedWorkflow): JsonLd =>
  breadcrumbJsonLd([
    ...automationsCrumbs(),
    { name: w.label, path: workflowPath(w.slug) },
  ]);

export const demoBreadcrumb = (w: PublishedWorkflow): JsonLd =>
  breadcrumbJsonLd([
    ...automationsCrumbs(),
    { name: w.label, path: workflowPath(w.slug) },
    { name: "Demo", path: workflowDemoPath(w.slug) },
  ]);
