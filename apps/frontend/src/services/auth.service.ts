import { http } from '../lib/http';
import type { LoginResponse } from '../types/api';

export const authService = {
  login(employeeId: string, password: string): Promise<LoginResponse> {
    return http.post<LoginResponse>('/auth/login', { employeeId, password }, { auth: false });
  },

  logout(): Promise<void> {
    return http.post<void>('/auth/logout').catch(() => {
      // Stateless on server — ignore network failures on logout
    });
  },
};
