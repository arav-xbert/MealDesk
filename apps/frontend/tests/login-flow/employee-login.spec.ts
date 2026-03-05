import { test, expect } from "@playwright/test";

test.describe("MealDesk Login Flow – Employee Login", () => {
  test("EMP001 logs in and lands on the lunch selection page", async ({ page }) => {
    await page.goto("/");

    await page.getByPlaceholder("Enter your Employee ID").fill("EMP001");
    await page.getByPlaceholder("Enter your password").fill("password123");
    await page.getByRole("button", { name: /sign in/i }).click();

    // Redirected to lunch selection
    await expect(page).toHaveURL(/\/lunch-selection/, { timeout: 10000 });

    // MealDesk nav bar is visible
    await expect(page.getByText("MealDesk").first()).toBeVisible();

    // Logout link
    await expect(page.getByText("Logout")).toBeVisible();
  });
});
