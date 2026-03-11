import { test } from "@playwright/test";

test("seed", async ({ page }) => {
  await page.goto("/");
  // The planner will start from this state.
});
