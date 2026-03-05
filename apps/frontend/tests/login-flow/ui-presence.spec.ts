import { test, expect } from "@playwright/test";

test.describe("MealDesk Login Flow – UI Presence", () => {
  test("login page shows all required UI elements", async ({ page }) => {
    await page.goto("/");

    // Branding
    await expect(page.getByText("MealDesk").first()).toBeVisible();

    // Employee ID field
    await expect(
      page.getByPlaceholder("Enter your Employee ID")
    ).toBeVisible();

    // Password field
    await expect(
      page.getByPlaceholder("Enter your password")
    ).toBeVisible();

    // Sign In button
    await expect(page.getByRole("button", { name: /sign in/i })).toBeVisible();

    // Keep me signed in checkbox (input is CSS-hidden; check the visible label text)
    await expect(page.getByText("Keep me signed in")).toBeVisible();

    // Forgot? link
    await expect(page.getByText("Forgot?")).toBeVisible();

    // Contact System Admin
    await expect(page.getByText("Contact System Admin")).toBeVisible();
  });
});
