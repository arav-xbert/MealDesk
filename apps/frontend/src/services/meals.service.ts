import { http } from '../lib/http';
import type { Meal } from '../types/api';

export interface CreateMealPayload {
  name: string;
  description?: string;
  category?: string;
  image?: File;
}

export interface UpdateMealPayload {
  name?: string;
  description?: string;
  category?: string;
  image?: File;
}

function buildMealForm(payload: CreateMealPayload | UpdateMealPayload): FormData {
  const form = new FormData();
  if (payload.name)        form.append('name',        payload.name);
  if (payload.description) form.append('description', payload.description);
  if (payload.category)    form.append('category',    payload.category);
  if (payload.image)       form.append('image',       payload.image, payload.image.name);
  return form;
}

export const mealsService = {
  create(payload: CreateMealPayload): Promise<Meal> {
    return http.postForm<Meal>('/meals', buildMealForm(payload));
  },

  update(id: string, payload: UpdateMealPayload): Promise<Meal> {
    return http.putForm<Meal>(`/meals/${id}`, buildMealForm(payload));
  },

  delete(id: string): Promise<void> {
    return http.delete<void>(`/meals/${id}`);
  },
};
