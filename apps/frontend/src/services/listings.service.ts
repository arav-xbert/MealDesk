import { http } from '../lib/http';
import type { ActiveListing } from '../types/api';

export const listingsService = {
  getActive(): Promise<ActiveListing> {
    return http.get<ActiveListing>('/listings/active');
  },

  create(payload: {
    title: string;
    date: string;
    startTime: string;
    endTime: string;
  }): Promise<{ id: string; title: string; date: string; startTime: string; endTime: string; status: string }> {
    return http.post('/listings', payload);
  },
};
