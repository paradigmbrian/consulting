import { describe, expect, it } from "vitest";
import { ogCards } from "./og";
import { allRoutes } from "./routes";
import { ogImagePath } from "./seo";

describe("ogCards", () => {
  const cards = ogCards();

  it("has exactly one card per route, matching the URL pageMetadata emits", () => {
    const expected = allRoutes().map((route) => ogImagePath(route)).sort();
    expect(cards.map((c) => `/og/${c.name}`).sort()).toEqual(expected);
  });

  it("has unique .png names and non-empty text", () => {
    expect(new Set(cards.map((c) => c.name)).size).toBe(cards.length);
    for (const card of cards) {
      expect(card.name).toMatch(/^[a-z0-9-]+\.png$/);
      expect(card.title.length).toBeGreaterThan(0);
      expect(card.eyebrow.length).toBeGreaterThan(0);
    }
  });
});
