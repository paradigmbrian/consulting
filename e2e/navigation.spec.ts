import { test, expect, type Page } from "@playwright/test";

// One viewport is enough: this checks the client router, not the layout.
test.skip(({ viewport }) => viewport?.width !== 1280, "desktop project only");

/** The client bundle sets `window.next` when the app boots, so Links are live. */
async function waitForHydration(page: Page): Promise<void> {
  await page.waitForFunction(() => Boolean((window as unknown as { next?: unknown }).next));
}

test("next/link navigates in the browser, without reloading the document", async ({ page }) => {
  const errors: string[] = [];
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(message.text());
  });
  page.on("pageerror", (error) => errors.push(error.message));

  await page.goto("/");
  await waitForHydration(page);

  // Survives a client-side navigation; a full document load would wipe it.
  await page.evaluate(() => {
    (window as unknown as { __clientNavMarker?: string }).__clientNavMarker = "alive";
  });

  await page.getByRole("banner").getByRole("link", { name: "Automations" }).click();
  await expect(page).toHaveURL("/services/automated-workflows");
  await expect(page.locator("h1")).toHaveText(
    "Put AI to work on the busywork your business runs on",
  );
  expect(
    await page.evaluate(() => (window as unknown as { __clientNavMarker?: string }).__clientNavMarker),
  ).toBe("alive");

  await waitForHydration(page);
  await page.getByRole("main").getByRole("link", { name: /Missed-Call Text-Back/ }).click();
  await expect(page).toHaveURL("/services/automated-workflows/missed-call-text-back");
  await expect(page.locator("h1")).toHaveText("A missed call doesn't wait for you to call back");

  expect(errors).toEqual([]);
});
