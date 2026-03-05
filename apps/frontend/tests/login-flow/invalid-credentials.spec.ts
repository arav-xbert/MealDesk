import { test, expect } from "@playwright/test";

test.describe("MealDesk Login Flow – Invalid Credentials", () => {
  test("shows error message for wrong credentials", async ({ page }) => {
    await page.goto("/");

    await page.getByPlaceholder("Enter your Employee ID").fill("INVALID_ID");
    await page.getByPlaceholder("Enter your password").fill("WRONG_PASS");
    await page.getByRole("button", { name: /sign in/i }).click();

    // Error message appears
    await expect(
      page.locator("p").filter({ hasText: /invalid|credentials|error/i })
    ).toBeVisible({ timeout: 10000 });

    // User stays on login page
    await expect(page).toHaveURL("/");
  });
});
