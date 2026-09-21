import { test, expect } from "@playwright/test";
import { demoRoutes } from "./routes";

for (const route of demoRoutes) {
  test(`demo advances with no console errors: ${route}`, async ({ page }) => {
    const errors: string[] = [];
    page.on("console", (message) => {
      if (message.type() === "error") errors.push(message.text());
    });
    page.on("pageerror", (error) => errors.push(error.message));

    await page.goto(route);
    await expect(page.locator(".demo-stage-count")).toHaveText(/Step 1 of \d+/);
    await page.getByRole("button", { name: "Next →" }).click();
    await expect(page.locator(".demo-stage-count")).toHaveText(/Step 2 of \d+/);

    expect(errors).toEqual([]);
  });
}
