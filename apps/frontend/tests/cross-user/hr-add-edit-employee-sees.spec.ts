import { test, expect } from "@playwright/test";

/**
 * Cross-user flow:
 *  1. HR001 adds a new meal to the active listing
 *  2. HR001 edits that meal (updates name + description)
 *  3. EMP001 logs in and finds the edited meal in Available Menus
 */
test("HR adds and edits a meal → employee sees it in lunch selection", async ({
  page,
}) => {
  // ── Step 1: HR login ──────────────────────────────────────────────────────
  await page.goto("/");
  await page.getByPlaceholder("Enter your Employee ID").fill("HR001");
  await page.getByPlaceholder("Enter your password").fill("password123");
  await page.getByRole("button", { name: /sign in/i }).click();
  await expect(page).toHaveURL(/\/dashboard\/overview/, { timeout: 15000 });

  // ── Step 2: Navigate to Edit Meals tab ───────────────────────────────────
  await page.getByText("Edit Meals").click();
  await expect(page).toHaveURL(/\/dashboard\/edit-meals/);

  // Skip if there is no active listing (meals can only be added to one)
  const noMealsHint = page.getByText(/no meals|no active/i);
  // Give the list a moment to settle
  await page.waitForTimeout(1000);

  // ── Step 3: Add a uniquely named meal ────────────────────────────────────
  const ts = Date.now();
  const originalName = `E2E Meal ${ts}`;
  const editedName   = `E2E Meal ${ts} (Edited)`;
  const description  = "Freshly added by the E2E test";
  const editedDesc   = "Updated by the E2E test";

  await page.getByPlaceholder("e.g. Grilled Chicken Salad").fill(originalName);
  await page.getByPlaceholder("Brief meal description...").fill(description);
  await page.getByPlaceholder("e.g. High Protein, Veg, Classic").fill("Test");
  await page.getByRole("button", { name: /add meal/i }).click();

  // Meal appears in Existing Meals list
  await expect(page.getByText(originalName)).toBeVisible({ timeout: 10000 });

  // Add form is cleared
  await expect(page.getByPlaceholder("e.g. Grilled Chicken Salad")).toHaveValue("");

  // ── Step 4: Edit the meal ─────────────────────────────────────────────────
  // Our meal was just added and is last in the list.
  // The only role="button" elements named /edit/i are the ✏️ Edit action buttons
  // (the "Edit Meals" tab has role="tab" so it won't match).
  await page.getByRole("button", { name: /edit/i }).last().click();

  // Inline edit form appears with the current values pre-filled
  await expect(page.getByPlaceholder("Meal name")).toBeVisible();

  // Update name and description
  await page.getByPlaceholder("Meal name").clear();
  await page.getByPlaceholder("Meal name").fill(editedName);
  await page.getByPlaceholder("Description", { exact: true }).clear();
  await page.getByPlaceholder("Description", { exact: true }).fill(editedDesc);

  // Save changes
  await page.getByRole("button", { name: /^save$/i }).click();

  // Edited name is now visible; original name is gone
  await expect(page.getByText(editedName)).toBeVisible({ timeout: 10000 });
  await expect(page.getByText(originalName, { exact: true })).not.toBeVisible();

  // ── Step 5: HR logs out ───────────────────────────────────────────────────
  await page.getByText("Logout").click();
  await expect(page).toHaveURL("/", { timeout: 10000 });

  // ── Step 6: Employee login ────────────────────────────────────────────────
  await page.getByPlaceholder("Enter your Employee ID").fill("EMP001");
  await page.getByPlaceholder("Enter your password").fill("password123");
  await page.getByRole("button", { name: /sign in/i }).click();
  await expect(page).toHaveURL(/\/lunch-selection/, { timeout: 10000 });

  // Wait for loading to finish
  await expect(page.getByText("Loading today's menu...")).toBeHidden({
    timeout: 10000,
  });

  // Skip gracefully if no active listing today
  if (await page.getByText("No active meal listing for today.").isVisible()) {
    test.skip();
    return;
  }

  // ── Step 7: Employee sees the edited meal ─────────────────────────────────
  // Handle already-submitted state: enter change mode first
  const changeBtn = page.getByRole("button", { name: /change/i });
  if (await changeBtn.isVisible()) {
    await changeBtn.click();
  }

  // The edited meal name should be listed
  await expect(page.getByRole("heading", { name: editedName, level: 3 })).toBeVisible({
    timeout: 8000,
  });
});
