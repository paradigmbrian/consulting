import { test, expect } from "@playwright/test";
import { demoRoutes, pageRoutes } from "./routes";

// One viewport is enough: this checks the HTML, not the layout.
test.skip(({ viewport }) => viewport?.width !== 1280, "desktop project only");
test.use({ javaScriptEnabled: false });

for (const route of [...pageRoutes, ...demoRoutes]) {
  test(`prerendered without JavaScript: ${route}`, async ({ page }) => {
    const response = await page.goto(route);
    expect(response?.status()).toBe(200);
    await expect(page.locator("h1")).toHaveCount(1);
    await expect(page.locator("h1")).not.toBeEmpty();
  });
}

test("unknown URL serves the 404 page", async ({ page }) => {
  const response = await page.goto("/no-such-page");
  expect(response?.status()).toBe(404);
  await expect(page.locator("h1")).toHaveText("Page not found");
});
