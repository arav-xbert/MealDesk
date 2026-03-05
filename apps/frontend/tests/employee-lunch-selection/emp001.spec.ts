import { test, expect } from "@playwright/test";

// Serialised so only one EMP001 session is open at a time.
test.describe.configure({ mode: "serial" });

test.describe("Employee Lunch Selection (EMP001)", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await page.getByPlaceholder("Enter your Employee ID").fill("EMP001");
    await page.getByPlaceholder("Enter your password").fill("password123");
    await page.getByRole("button", { name: /sign in/i }).click();
    await expect(page).toHaveURL(/\/lunch-selection/, { timeout: 10000 });
  });

  test("employee can view meal listing and submit (or re-submit) a selection", async ({ page }) => {
    // Wait for loading spinner to disappear
    await expect(page.getByText("Loading today's menu...")).toBeHidden({ timeout: 10000 });

    const noListing = page.getByText("No active meal listing for today.");
    if (await noListing.isVisible()) {
      test.skip();
      return;
    }

    // MealScheduleCard with deadline is visible
    await expect(page.getByText(/select before/i)).toBeVisible();

    // If already submitted, enter change mode first
    const changeBtn = page.getByRole("button", { name: /change/i });
    if (await changeBtn.isVisible()) {
      await changeBtn.click();
    }

    // Selection list is now visible
    await expect(
      page.getByText(/available menus|choose a different meal/i)
    ).toBeVisible({ timeout: 5000 });

    // Select the first meal card by clicking its heading
    await page.getByRole("heading", { level: 3 }).first().click();

    // Submit / Update button becomes enabled
    const submitBtn = page.getByRole("button", {
      name: /submit selection|update selection/i,
    });
    await expect(submitBtn).toBeEnabled();
    await submitBtn.click();

    // Redirected to confirmation page
    await expect(page).toHaveURL(/\/submitted/, { timeout: 10000 });
  });

  test("employee can logout and is returned to the login page", async ({ page }) => {
    await page.getByText("Logout").click();
    await expect(page).toHaveURL("/", { timeout: 10000 });
    await expect(page.getByPlaceholder("Enter your Employee ID")).toBeVisible();
  });
});
