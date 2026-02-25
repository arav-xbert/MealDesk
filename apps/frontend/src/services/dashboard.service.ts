import { http } from '../lib/http';
import type { DashboardStats, RecentSubmission, MealCount } from '../types/api';

export const dashboardService = {
  getStats(): Promise<DashboardStats> {
    return http.get<DashboardStats>('/dashboard/stats');
  },

  getRecentSubmissions(): Promise<RecentSubmission[]> {
    return http.get<RecentSubmission[]>('/dashboard/recent-submissions');
  },

  getMealCounts(): Promise<MealCount[]> {
    return http.get<MealCount[]>('/dashboard/meal-counts');
  },
};
