import { describe, expect, it } from "vitest";
import { allRoutes, demoRoutes, pageRoutes } from "./routes";

describe("routes", () => {
  it("lists home, three services and nine workflow pages", () => {
    const routes = pageRoutes();
    expect(routes).toHaveLength(13);
    expect(routes[0]).toBe("/");
    expect(routes).toContain("/services/ai-integration");
    expect(routes).toContain("/services/automated-workflows/missed-call-text-back");
  });

  it("lists nine demo routes", () => {
    expect(demoRoutes()).toHaveLength(9);
    expect(demoRoutes()).toContain("/services/automated-workflows/tool-sync/demo");
  });

  it("has no duplicates, no trailing slashes", () => {
    const routes = allRoutes();
    expect(routes).toHaveLength(22);
    expect(new Set(routes).size).toBe(22);
    for (const r of routes) expect(r === "/" || !r.endsWith("/")).toBe(true);
  });
});
