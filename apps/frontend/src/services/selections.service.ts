import { http } from '../lib/http';
import type { Selection, LatestSelection } from '../types/api';

export const selectionsService = {
  submit(listingId: string, menuOptionId: string): Promise<Selection> {
    return http.post<Selection>('/selections', { listingId, menuOptionId });
  },

  getMyLatest(): Promise<LatestSelection | null> {
    return http.get<LatestSelection | null>('/selections/my-latest');
  },

  updateCurrent(menuOptionId: string): Promise<Selection> {
    return http.put<Selection>('/selections/current', { menuOptionId });
  },
};
