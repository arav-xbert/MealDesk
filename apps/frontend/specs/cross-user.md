# MealDesk Cross-User Flow Test Plan

## Application Overview

This test plan covers flows where actions taken by an HR user (adding/editing meals) are immediately visible to an employee user. It validates end-to-end data consistency across different user roles.

## Test Files

- `tests/cross-user/hr-add-edit-employee-sees.spec.ts`

---

## Test Scenarios

### 1. HR Adds and Edits a Meal → Employee Sees It in Lunch Selection

**Description:** Verify that a meal added and then edited by HR is visible to an employee in their lunch selection menu.

**Steps:**

**HR actions:**

1. Navigate to `/`
2. Log in as HR001 with password `password123`
3. Assert redirect to `/dashboard/overview`
4. Click "Edit Meals" tab → assert URL is `/dashboard/edit-meals`
5. Fill in a uniquely named meal (e.g., `E2E Meal <timestamp>`) with:
   - Description: "Freshly added by the E2E test"
   - Tags: "Test"
6. Click "Add Meal"
7. Assert the new meal name appears in the Existing Meals list.
8. Assert the add form fields are cleared.
9. Click the last "Edit" button (for the just-added meal).
10. Assert the inline edit form appears with a "Meal name" field.
11. Clear and fill "Meal name" with `E2E Meal <timestamp> (Edited)`.
12. Clear and fill "Description" with "Updated by the E2E test".
13. Click "Save".
14. Assert the edited meal name is visible.
15. Assert the original meal name is no longer visible.
16. Click "Logout" → assert URL is `/`.

**Employee actions:**

17. Log in as EMP001 with password `password123`
18. Assert redirect to `/lunch-selection`
19. Wait for "Loading today's menu..." spinner to disappear.
20. If "No active meal listing for today." is shown — **skip test**.
21. If a "Change" button is visible (already submitted), click it to enter change mode.
22. Assert the edited meal name appears as an h3 heading in the meal list.

**Expected Results:**

- The meal edited by HR001 (`E2E Meal <timestamp> (Edited)`) is visible to EMP001 in the lunch selection menu.
