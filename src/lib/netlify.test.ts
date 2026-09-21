import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { allRoutes } from "./routes";

interface Redirect {
  from: string;
  to: string;
  status: number;
}

function parseRedirects(toml: string): Redirect[] {
  return toml
    .split("[[redirects]]")
    .slice(1)
    .map((block) => ({
      from: /from\s*=\s*"([^"]+)"/.exec(block)?.[1] ?? "",
      to: /to\s*=\s*"([^"]+)"/.exec(block)?.[1] ?? "",
      status: Number(/status\s*=\s*(\d+)/.exec(block)?.[1] ?? 0),
    }));
}

/** The body of each `[[headers]]` table, cut at the next table header. */
function headerBlocks(toml: string): string[] {
  return toml
    .split("[[headers]]")
    .slice(1)
    .map((block) => block.split("[[")[0]);
}

const toml = readFileSync("netlify.toml", "utf8");
const redirects = parseRedirects(toml);

describe("netlify.toml", () => {
  it("publishes the static export on Node 22", () => {
    expect(toml).toMatch(/publish\s*=\s*"out"/);
    expect(toml).toMatch(/NODE_VERSION\s*=\s*"22"/);
  });

  it("skips Netlify's Next.js runtime — a static export needs none", () => {
    expect(toml).toMatch(/NETLIFY_NEXT_PLUGIN_SKIP\s*=\s*"true"/);
  });

  it("caches the content-hashed /_next/static assets immutably", () => {
    const hashed = headerBlocks(toml).find((block) =>
      /for\s*=\s*"\/_next\/static\/\*"/.test(block),
    );
    expect(hashed, "a [[headers]] block for /_next/static/*").toBeDefined();
    expect(hashed).toMatch(/Cache-Control\s*=\s*"[^"]*\bimmutable\b[^"]*"/);
  });

  it("has no SPA catch-all", () => {
    expect(redirects.find((r) => r.from === "/*")).toBeUndefined();
  });

  it("never redirects away from a page the site builds", () => {
    const built = new Set(allRoutes());
    for (const r of redirects) expect(built.has(r.from), r.from).toBe(false);
  });

  it("keeps the nine legacy demo redirects, each a 301 to a built page", () => {
    const built = new Set(allRoutes());
    expect(redirects).toHaveLength(9);
    for (const r of redirects) {
      expect(r.from.startsWith("/demos/"), r.from).toBe(true);
      expect(r.status).toBe(301);
      expect(built.has(r.to), r.to).toBe(true);
    }
  });
});
