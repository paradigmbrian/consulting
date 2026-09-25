import { describe, expect, it } from "vitest";
import { requireService } from "../data/services";
import { HOME_DESCRIPTION, SITE_SHORT_NAME } from "../data/site";
import { publishedWorkflows } from "./routes";
import {
  absoluteUrl,
  breadcrumbJsonLd,
  demoBreadcrumb,
  demoMeta,
  faqJsonLd,
  ogImagePath,
  ogName,
  organizationJsonLd,
  pageMetadata,
  serviceJsonLd,
  websiteJsonLd,
  workflowBreadcrumb,
  workflowJsonLd,
  workflowMeta,
} from "./seo";

const missedCall = publishedWorkflows().find(
  (w) => w.slug === "missed-call-text-back",
)!;

describe("urls", () => {
  it("builds absolute URLs with no trailing slash", () => {
    expect(absoluteUrl("/")).toBe("https://paradigmshiftdev.io");
    expect(absoluteUrl("/services/ai-integration")).toBe(
      "https://paradigmshiftdev.io/services/ai-integration",
    );
  });

  it("names OG images after the path", () => {
    expect(ogName("/")).toBe("home");
    expect(ogName("/services/automated-workflows/tool-sync/demo")).toBe(
      "services-automated-workflows-tool-sync-demo",
    );
    expect(ogImagePath("/")).toBe("/og/home.png");
  });
});

describe("pageMetadata", () => {
  const meta = pageMetadata({
    title: "AI Integration",
    description: "Desc",
    path: "/services/ai-integration",
  });

  it("sets title, description and a self-canonical", () => {
    expect(meta.title).toBe("AI Integration");
    expect(meta.description).toBe("Desc");
    expect(meta.alternates?.canonical).toBe("/services/ai-integration");
  });

  it("sets Open Graph and Twitter with the generated card", () => {
    expect(meta.openGraph).toMatchObject({
      url: "/services/ai-integration",
      title: "AI Integration | Paradigm Shift",
      description: "Desc",
      siteName: "Paradigm Shift Software Development",
    });
    expect(JSON.stringify(meta.openGraph)).toContain(
      "/og/services-ai-integration.png",
    );
    expect(meta.twitter).toMatchObject({ card: "summary_large_image" });
  });

  it("supports an absolute title for the home page", () => {
    const home = pageMetadata({
      title: "Whole title",
      description: "D",
      path: "/",
      absoluteTitle: true,
    });
    expect(home.title).toEqual({ absolute: "Whole title" });
    expect(home.openGraph).toMatchObject({ title: "Whole title" });
  });
});

describe("workflow and demo meta", () => {
  const all = publishedWorkflows().flatMap((w) => [workflowMeta(w), demoMeta(w)]);

  it("gives every workflow and demo a unique title and description", () => {
    expect(new Set(all.map((m) => m.title)).size).toBe(all.length);
    expect(new Set(all.map((m) => m.description)).size).toBe(all.length);
  });

  it("keeps every description within 70–160 characters", () => {
    for (const m of all) {
      expect(m.description.length, m.title).toBeGreaterThanOrEqual(70);
      expect(m.description.length, m.title).toBeLessThanOrEqual(160);
    }
  });

  it("keeps every title, with the site suffix, within 60 characters", () => {
    for (const m of all) {
      expect(`${m.title} | ${SITE_SHORT_NAME}`.length, m.title).toBeLessThanOrEqual(60);
    }
  });

  it("titles a workflow by its label and a demo by label + Demo", () => {
    expect(workflowMeta(missedCall).title).toBe(missedCall.label);
    expect(demoMeta(missedCall).title).toBe(`${missedCall.label} Demo`);
  });

  it("uses the hand-written descriptions, not the hero copy", () => {
    expect(workflowMeta(missedCall).description).toBe(missedCall.metaDescription);
    expect(demoMeta(missedCall).description).toBe(missedCall.demoDescription);
    expect(workflowJsonLd(missedCall).description).toBe(missedCall.metaDescription);
  });
});

describe("site", () => {
  it("keeps the home description within 70–160 characters", () => {
    expect(HOME_DESCRIPTION.length).toBeGreaterThanOrEqual(70);
    expect(HOME_DESCRIPTION.length).toBeLessThanOrEqual(160);
  });
});

describe("JSON-LD", () => {
  it("describes the organization and website with stable ids", () => {
    expect(organizationJsonLd()).toMatchObject({
      "@context": "https://schema.org",
      "@type": "Organization",
      "@id": "https://paradigmshiftdev.io/#organization",
      name: "Paradigm Shift Software Development",
      url: "https://paradigmshiftdev.io",
      sameAs: ["https://www.linkedin.com/company/paradigm-shift-tech-consulting/"],
    });
    expect(websiteJsonLd()).toMatchObject({
      "@type": "WebSite",
      "@id": "https://paradigmshiftdev.io/#website",
      publisher: { "@id": "https://paradigmshiftdev.io/#organization" },
    });
  });

  it("describes a service, provided by the organization", () => {
    expect(serviceJsonLd(requireService("ai-integration"))).toMatchObject({
      "@type": "Service",
      name: "AI Integration",
      url: "https://paradigmshiftdev.io/services/ai-integration",
      provider: { "@id": "https://paradigmshiftdev.io/#organization" },
    });
  });

  it("describes a workflow as a service and never emits stats", () => {
    const data = workflowJsonLd(missedCall);
    expect(data).toMatchObject({
      "@type": "Service",
      name: missedCall.label,
      url: "https://paradigmshiftdev.io/services/automated-workflows/missed-call-text-back",
    });
    expect(JSON.stringify(data)).not.toContain("sourceUrl");
  });

  it("builds an FAQPage", () => {
    expect(faqJsonLd([{ q: "Q?", a: "A." }])).toEqual({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "Q?",
          acceptedAnswer: { "@type": "Answer", text: "A." },
        },
      ],
    });
  });

  it("builds breadcrumbs with 1-based positions and absolute URLs", () => {
    const data = breadcrumbJsonLd([
      { name: "Home", path: "/" },
      { name: "X", path: "/x" },
    ]);
    expect(data.itemListElement).toEqual([
      { "@type": "ListItem", position: 1, name: "Home", item: "https://paradigmshiftdev.io" },
      { "@type": "ListItem", position: 2, name: "X", item: "https://paradigmshiftdev.io/x" },
    ]);
    const crumbs = workflowBreadcrumb(missedCall).itemListElement as unknown[];
    expect(crumbs).toHaveLength(3);
  });

  it("ends a demo breadcrumb at the demo itself", () => {
    const crumbs = demoBreadcrumb(missedCall).itemListElement as {
      position: number;
      name: string;
      item: string;
    }[];
    expect(crumbs).toHaveLength(4);
    expect(crumbs.map((c) => c.position)).toEqual([1, 2, 3, 4]);
    expect(crumbs[3]).toMatchObject({
      name: "Demo",
      item: "https://paradigmshiftdev.io/services/automated-workflows/missed-call-text-back/demo",
    });
  });
});

describe("requireService", () => {
  it("throws on a slug the site does not define", () => {
    expect(() => requireService("nope")).toThrow("Unknown service: nope");
  });
});
