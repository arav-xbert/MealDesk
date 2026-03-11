import { test, expect } from "@playwright/test";

test.describe("Employee Lunch Selection – Change Vote", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await page.getByPlaceholder("Enter your Employee ID").fill("EMP002");
    await page.getByPlaceholder("Enter your password").fill("password123");
    await page.getByRole("button", { name: /sign in/i }).click();
    await expect(page).toHaveURL(/\/lunch-selection/, { timeout: 10000 });
  });

  test("employee can change a previously submitted selection", async ({ page }) => {
    // Wait for loading spinner to disappear
    await expect(page.getByText("Loading today's menu...")).toBeHidden({ timeout: 10000 });

    const noListing = page.getByText("No active meal listing for today.");
    if (await noListing.isVisible()) {
      test.skip();
      return;
    }

    // If already submitted, click Change; otherwise submit first then change
    const changeBtn = page.getByRole("button", { name: /change/i });

    if (await changeBtn.isVisible()) {
      // Already submitted — click Change
      await changeBtn.click();
    } else {
      // First-time — make initial selection by clicking the first meal card heading
      await page.getByRole("heading", { level: 3 }).first().click();
      await page.getByRole("button", { name: /submit selection/i }).click();

      // Land on /submitted then navigate back
      await expect(page).toHaveURL(/\/submitted/, { timeout: 10000 });
      await page.goto("/lunch-selection");
      await expect(page.getByText("Loading today's menu...")).toBeHidden({ timeout: 10000 });
      await page.getByRole("button", { name: /change/i }).click();
    }

    // Full meal list reappears
    await expect(page.getByText(/choose a different meal/i)).toBeVisible({ timeout: 5000 });

    // Update Selection button is shown
    await expect(
      page.getByRole("button", { name: /update selection/i })
    ).toBeVisible();

    // Select the last meal card by clicking its heading
    const headings = page.getByRole("heading", { level: 3 });
    const count = await headings.count();
    await headings.nth(count - 1).click();
    await page.getByRole("button", { name: /update selection/i }).click();

    // Redirected to /submitted
    await expect(page).toHaveURL(/\/submitted/, { timeout: 10000 });
  });
});
