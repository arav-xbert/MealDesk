import { test, expect } from "@playwright/test";

// Serialised so that only one test logs in as HR001 at a time,
// avoiding concurrent-session conflicts with the backend.
test.describe.configure({ mode: "serial" });

test.describe("HR Dashboard", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await page.getByPlaceholder("Enter your Employee ID").fill("HR001");
    await page.getByPlaceholder("Enter your password").fill("password123");
    await page.getByRole("button", { name: /sign in/i }).click();
    await expect(page).toHaveURL(/\/dashboard\/overview/, { timeout: 15000 });
  });

  test("overview tab shows submission stats and sections", async ({ page }) => {
    // Submissions Overview section header
    await expect(page.getByText("Submissions Overview")).toBeVisible();

    // Stat labels — use exact match to avoid colliding with the "SUBMITTED" badge
    await expect(page.getByText("Total Users", { exact: true })).toBeVisible();
    await expect(page.getByText("Submitted", { exact: true })).toBeVisible();
    await expect(page.getByText("Pending", { exact: true })).toBeVisible();

    // Section headings
    await expect(page.getByText("Recent Submissions")).toBeVisible();
    await expect(page.getByText("Current Meals")).toBeVisible();
  });

  test("HR can add a new meal from the Edit Meals tab", async ({ page }) => {
    // Navigate to Edit Meals tab
    await page.getByText("Edit Meals").click();
    await expect(page).toHaveURL(/\/dashboard\/edit-meals/);

    // Form fields are visible
    await expect(page.getByText("Add New Meal")).toBeVisible();
    await expect(page.getByPlaceholder("e.g. Grilled Chicken Salad")).toBeVisible();
    await expect(page.getByPlaceholder("Brief meal description...")).toBeVisible();
    await expect(page.getByPlaceholder("e.g. High Protein, Veg, Classic")).toBeVisible();

    // Fill and submit
    const uniqueName = `Test Burger ${Date.now()}`;
    await page.getByPlaceholder("e.g. Grilled Chicken Salad").fill(uniqueName);
    await page.getByPlaceholder("Brief meal description...").fill("A juicy test burger");
    await page.getByPlaceholder("e.g. High Protein, Veg, Classic").fill("Classic");
    await page.getByRole("button", { name: /add meal/i }).click();

    // New meal appears in the list and form is cleared
    await expect(page.getByText(uniqueName)).toBeVisible({ timeout: 10000 });
    await expect(page.getByPlaceholder("e.g. Grilled Chicken Salad")).toHaveValue("");
    await expect(page.getByPlaceholder("Brief meal description...")).toHaveValue("");
  });

  test("HR can logout and is returned to the login page", async ({ page }) => {
    await page.getByText("Logout").click();
    await expect(page).toHaveURL("/", { timeout: 10000 });
    await expect(page.getByPlaceholder("Enter your Employee ID")).toBeVisible();
  });
});
