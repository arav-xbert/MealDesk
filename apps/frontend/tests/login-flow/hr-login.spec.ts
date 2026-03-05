import { test, expect } from "@playwright/test";

test.describe("MealDesk Login Flow – HR Login", () => {
  test("HR001 logs in and lands on the dashboard overview", async ({ page }) => {
    await page.goto("/");

    await page.getByPlaceholder("Enter your Employee ID").fill("HR001");
    await page.getByPlaceholder("Enter your password").fill("password123");
    await page.getByRole("button", { name: /sign in/i }).click();

    // Redirected to dashboard
    await expect(page).toHaveURL(/\/dashboard\/overview/, { timeout: 10000 });

    // Tab bar with Overview and Edit Meals is visible
    await expect(page.getByText("Overview")).toBeVisible();
    await expect(page.getByText("Edit Meals")).toBeVisible();

    // Logout link
    await expect(page.getByText("Logout")).toBeVisible();
  });
});
