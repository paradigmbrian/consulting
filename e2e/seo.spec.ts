import { test, expect } from "@playwright/test";
import { demoRoutes, pageRoutes } from "./routes";

test.skip(({ viewport }) => viewport?.width !== 1280, "desktop project only");

const ORIGIN = "https://paradigmshiftdev.io";

for (const route of [...pageRoutes, ...demoRoutes]) {
  test(`head metadata: ${route}`, async ({ page }) => {
    await page.goto(route);
    const canonical = route === "/" ? ORIGIN : `${ORIGIN}${route}`;
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", canonical);
    await expect(page.locator('meta[name="description"]')).toHaveAttribute("content", /.{70,}/);
    await expect(page.locator('meta[property="og:image"]')).toHaveAttribute(
      "content",
      new RegExp(`^${ORIGIN}/og/.+\\.png$`),
    );
    await expect(page.locator('meta[name="twitter:card"]')).toHaveAttribute(
      "content",
      "summary_large_image",
    );
  });
}

test("structured data by page type", async ({ page }) => {
  const typesOn = async (route: string): Promise<string[]> => {
    await page.goto(route);
    const blocks = await page.locator('script[type="application/ld+json"]').allTextContents();
    return blocks.map((b) => JSON.parse(b)["@type"] as string).sort();
  };

  expect(await typesOn("/")).toEqual(["Organization", "WebSite"]);
  expect(await typesOn("/services/ai-integration")).toEqual(["Organization", "Service", "WebSite"]);
  expect(await typesOn("/services/automated-workflows")).toEqual([
    "FAQPage", "Organization", "Service", "WebSite",
  ]);
  expect(await typesOn("/services/automated-workflows/missed-call-text-back")).toEqual([
    "BreadcrumbList", "FAQPage", "Organization", "Service", "WebSite",
  ]);
  expect(await typesOn("/services/automated-workflows/missed-call-text-back/demo")).toEqual([
    "BreadcrumbList", "Organization", "WebSite",
  ]);
});
