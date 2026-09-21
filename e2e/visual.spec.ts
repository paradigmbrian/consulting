import { test, expect } from "@playwright/test";
import { pageRoutes, demoRoutes, snapshotName } from "./routes";

for (const route of pageRoutes) {
  test(`visual: ${route}`, async ({ page }) => {
    await page.goto(route);
    await page.waitForLoadState("networkidle");
    await expect(page).toHaveScreenshot(`${snapshotName(route)}.png`, { fullPage: true });
  });
}

for (const route of demoRoutes) {
  test(`visual: ${route}`, async ({ page }) => {
    // Demos run scripted timers (typing, staged reveals). Freezing the clock
    // pins every demo to its first frame so the screenshot is deterministic.
    await page.clock.install();
    await page.goto(route);
    await expect(page.locator("h1.demo-title")).toBeVisible();
    await expect(page).toHaveScreenshot(`${snapshotName(route)}.png`, { fullPage: true });
  });
}
