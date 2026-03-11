# MealDesk Login Flow Test Plan

## Application Overview

MealDesk is a corporate meal management portal. The entry point is a login page requiring an employee ID and password.

## Test Files

- `tests/login-flow/ui-presence.spec.ts`
- `tests/login-flow/invalid-credentials.spec.ts`
- `tests/login-flow/hr-login.spec.ts`
- `tests/login-flow/employee-login.spec.ts`

## Test Scenarios

### 1. UI Presence

**Description:** Verify all essential UI elements are present on the login page.
**Test file:** `tests/login-flow/ui-presence.spec.ts`
**Steps:**

1. Navigate to `/`

**Expected Results:**

- "MealDesk" branding is visible.
- Employee ID field is visible with placeholder "Enter your Employee ID".
- Password field is visible with placeholder "Enter your password".
- "Sign In" button is visible.
- "Keep me signed in" label is present (checkbox is CSS-hidden).
- "Forgot?" link is present.
- "Contact System Admin" link is present.

---

### 2. Invalid Credentials

**Description:** Verify that an error message is shown when incorrect credentials are used.
**Test file:** `tests/login-flow/invalid-credentials.spec.ts`
**Steps:**

1. Navigate to `/`
2. Enter "INVALID_ID" in the "Employee ID" field.
3. Enter "WRONG_PASS" in the "Password" field.
4. Click "Sign In"

**Expected Results:**

- An error message matching `/invalid|credentials|error/i` appears.
- User remains on the login page (`/`).

---

### 3. HR Login

**Description:** Verify that an HR user logs in and lands on the dashboard overview.
**Test file:** `tests/login-flow/hr-login.spec.ts`
**Steps:**

1. Navigate to `/`
2. Enter "HR001" in the "Employee ID" field.
3. Enter "password123" in the "Password" field.
4. Click "Sign In"

**Expected Results:**

- User is redirected to `/dashboard/overview`.
- "Overview" and "Edit Meals" tabs are visible.
- "Logout" link is visible.

---

### 4. Employee Login

**Description:** Verify that a regular employee logs in and lands on the lunch selection page.
**Test file:** `tests/login-flow/employee-login.spec.ts`
**Steps:**

1. Navigate to `/`
2. Enter "EMP001" in the "Employee ID" field.
3. Enter "password123" in the "Password" field.
4. Click "Sign In"

**Expected Results:**

- User is redirected to `/lunch-selection`.
- "MealDesk" branding is visible in the nav bar.
- "Logout" link is visible.
