# MealDesk HR Dashboard Test Plan

## Application Overview

After logging in as an HR user, the dashboard provides an overview of submission statistics and a tab to manage meals.

## Test Files

- `tests/hr-dashboard/hr-dashboard.spec.ts`

## Setup (beforeEach)

- Navigate to `/`
- Log in as HR001 with password `password123`
- Assert redirect to `/dashboard/overview`

> Tests run in **serial** mode to avoid concurrent HR001 session conflicts.

## Test Scenarios

### 1. Overview Tab – Submissions Stats and Sections

**Description:** Verify the overview tab displays submission statistics and expected section headings.
**Steps:**

1. (Already on `/dashboard/overview` after login)

**Expected Results:**

- "Submissions Overview" section header is visible.
- Stat labels visible (exact match): "Total Users", "Submitted", "Pending".
- "Recent Submissions" section heading is visible.
- "Current Meals" section heading is visible.

---

### 2. Add a New Meal from the Edit Meals Tab

**Description:** Verify HR can navigate to Edit Meals and add a new meal successfully.
**Steps:**

1. Click the "Edit Meals" tab.
2. Assert URL changes to `/dashboard/edit-meals`.
3. Confirm form fields visible: "Add New Meal" heading, name placeholder "e.g. Grilled Chicken Salad", description placeholder "Brief meal description...", tags placeholder "e.g. High Protein, Veg, Classic".
4. Fill in a unique meal name (e.g., `Test Burger <timestamp>`).
5. Fill in description: "A juicy test burger".
6. Fill in tags: "Classic".
7. Click "Add Meal" button.

**Expected Results:**

- The newly added meal name appears in the meal list (within 10 s).
- The name, description, and tags form fields are cleared after submission.

---

### 3. Logout Returns HR to Login Page

**Description:** Verify that clicking Logout navigates the HR user back to the login page.
**Steps:**

1. Click "Logout".

**Expected Results:**

- URL changes to `/`.
- "Enter your Employee ID" placeholder field is visible.
