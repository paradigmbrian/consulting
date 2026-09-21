import { describe, expect, it } from "vitest";
import { demoRegistry } from "../demos/registry";
import { showcaseRegistry } from "../showcases/registry";
import { getService, publishedServices, servicePath, services } from "./services";
import { workflows } from "./workflows";

describe("services", () => {
  it("lists the three service lines in home-page order", () => {
    expect(publishedServices.map((s) => s.slug)).toEqual([
      "automated-workflows",
      "ai-integration",
      "technical-consulting",
    ]);
  });

  it("has unique slugs", () => {
    const slugs = services.map((s) => s.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it("has unique, non-empty meta titles and descriptions of sane length", () => {
    const titles = services.map((s) => s.metaTitle);
    const descriptions = services.map((s) => s.metaDescription);
    expect(new Set(titles).size).toBe(titles.length);
    expect(new Set(descriptions).size).toBe(descriptions.length);
    for (const d of descriptions) {
      expect(d.length).toBeGreaterThanOrEqual(70);
      expect(d.length).toBeLessThanOrEqual(160);
    }
  });

  it("resolves paths and lookups", () => {
    expect(servicePath("ai-integration")).toBe("/services/ai-integration");
    expect(getService("ai-integration")?.name).toBe("AI Integration");
    expect(getService("nope")).toBeUndefined();
  });
});

describe("workflows", () => {
  it("has unique slugs", () => {
    const slugs = workflows.map((w) => w.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it("has a demo registered for exactly the published workflows that claim one", () => {
    const claimed = workflows
      .filter((w) => w.published && w.hasDemo)
      .map((w) => w.slug)
      .sort();
    expect(Object.keys(demoRegistry).sort()).toEqual(claimed);
  });

  it("has a showcase for every published workflow", () => {
    for (const w of workflows.filter((w) => w.published)) {
      expect(showcaseRegistry[w.slug], w.slug).toBeDefined();
    }
  });

  it("never ships a stat without a source URL", () => {
    for (const w of workflows) {
      if (!w.published) continue;
      for (const stat of w.stats) {
        expect(stat.sourceUrl, `${w.slug}: ${stat.label}`).toMatch(/^https?:\/\//);
      }
    }
  });
});
