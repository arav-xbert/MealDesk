# MealDesk Employee Lunch Selection Test Plan

## Application Overview

After logging in as an employee, the user lands on the lunch selection page where they can view today's menu, submit a meal selection, and change a previously submitted selection.

## Test Files

- `tests/employee-lunch-selection/emp001.spec.ts` — EMP001 submitting/re-submitting a selection
- `tests/employee-lunch-selection/change-vote.spec.ts` — EMP002 changing a previously submitted selection

---

## Suite: Employee Lunch Selection (EMP001)

> Tests run in **serial** mode.

### Setup (beforeEach)

- Navigate to `/`
- Log in as EMP001 with password `password123`
- Assert redirect to `/lunch-selection`

### 1. View Meal Listing and Submit (or Re-Submit) a Selection

**Description:** Verify an employee can view today's menu and submit or re-submit a meal selection.
**Steps:**

1. Wait for "Loading today's menu..." spinner to disappear.
2. If "No active meal listing for today." is shown — **skip test**.
3. Confirm the meal schedule card shows a deadline ("select before …").
4. If a "Change" button is visible (already submitted), click it.
5. Confirm the meal list section is visible: "Available Menus" or "Choose a different meal".
6. Click the first meal card heading (h3).
7. Confirm the "Submit Selection" or "Update Selection" button becomes enabled.
8. Click the submit/update button.

**Expected Results:**

- URL changes to `/submitted`.

---

### 2. Logout Returns Employee to Login Page

**Description:** Verify that clicking Logout navigates the employee back to the login page.
**Steps:**

1. Click "Logout".

**Expected Results:**

- URL changes to `/`.
- "Enter your Employee ID" placeholder field is visible.

---

## Suite: Employee Lunch Selection – Change Vote (EMP002)

### Setup (beforeEach)

- Navigate to `/`
- Log in as EMP002 with password `password123`
- Assert redirect to `/lunch-selection`

### 3. Change a Previously Submitted Selection

**Description:** Verify an employee can change their lunch selection after already submitting.
**Steps:**

1. Wait for "Loading today's menu..." spinner to disappear.
2. If "No active meal listing for today." is shown — **skip test**.
3. If a "Change" button is visible: click it to enter change mode.
4. If no "Change" button (first-time visit):
   a. Click the first meal card heading to select it.
   b. Click "Submit Selection".
   c. Assert redirect to `/submitted`.
   d. Navigate to `/lunch-selection`.
   e. Wait for spinner to disappear.
   f. Click the "Change" button.
5. Confirm "Choose a different meal" heading is visible.
6. Confirm "Update Selection" button is visible.
7. Click the **last** meal card heading (h3).
8. Click "Update Selection".

**Expected Results:**

- URL changes to `/submitted`.
