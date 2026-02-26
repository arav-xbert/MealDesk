// ─── Auth ─────────────────────────────────────────────────────────────────

export type UserRole = 'EMPLOYEE' | 'HR';

export interface AuthUser {
  id: string;
  name: string;
  role: UserRole;
}

export interface LoginResponse {
  token: string;
  user: AuthUser;
}

// ─── Listings ─────────────────────────────────────────────────────────────

export interface MenuOption {
  id: string;
  name: string;
  description: string | null;
  imageUrl: string | null;
  category: string | null;
}

export interface ActiveListing {
  id: string;
  title: string;
  date: string;
  startTime: string;
  endTime: string;
  status: string;
  menuOptions: MenuOption[];
}

// ─── Selections ───────────────────────────────────────────────────────────

export interface Selection {
  id: string;
  listingId: string;
  userId: string;
  menuOptionId: string;
  createdAt: string;
  menuOption: { id: string; name: string };
}

export interface LatestSelection {
  id: string;
  createdAt: string;
  menuOption: { id: string; name: string; category: string | null };
  listing: { id: string; title: string; date: string };
}

// ─── Meals ────────────────────────────────────────────────────────────────

export interface Meal {
  id: string;
  name: string;
  description: string | null;
  imageUrl: string | null;
  category: string | null;
  active: boolean;
}

// ─── Dashboard ────────────────────────────────────────────────────────────

export interface DashboardStats {
  totalUsers: number;
  submitted: number;
  pending: number;
}

export interface RecentSubmission {
  id: string;
  createdAt: string;
  user: { name: string; employeeId: string };
  menuOption: { name: string };
}

export interface MealCount {
  menuOptionId: string;
  name: string;
  imageUrl: string | null;
  count: number;
}

// ─── Admin ────────────────────────────────────────────────────────────────

export interface CreateUserPayload {
  employeeId: string;
  name: string;
  role?: UserRole;
  password: string;
}
