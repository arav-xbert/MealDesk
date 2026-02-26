import { API_BASE_URL } from '../config';

function getToken(): string | null {
  return localStorage.getItem('auth_token');
}

export class ApiError extends Error {
  constructor(
    public status: number,
    public body: { error: string }
  ) {
    super(body?.error ?? `HTTP ${status}`);
  }
}

interface RequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  body?: unknown;
  multipart?: FormData;
  auth?: boolean;
}

async function request<T>(
  path: string,
  { method = 'GET', body, multipart, auth = true }: RequestOptions = {}
): Promise<T> {
  const headers: Record<string, string> = {};

  if (auth) {
    const token = getToken();
    if (token) headers['Authorization'] = `Bearer ${token}`;
  }

  // Do NOT set Content-Type for multipart — browser sets it with boundary
  if (body !== undefined) {
    headers['Content-Type'] = 'application/json';
  }

  const res = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers,
    body: multipart ?? (body !== undefined ? JSON.stringify(body) : undefined),
  });

  if (res.status === 204) return undefined as T;

  const data = await res.json();

  if (!res.ok) {
    throw new ApiError(res.status, data as { error: string });
  }

  return data as T;
}

export const http = {
  get: <T>(path: string, opts?: Pick<RequestOptions, 'auth'>) =>
    request<T>(path, { ...opts, method: 'GET' }),

  post: <T>(path: string, body?: unknown, opts?: Pick<RequestOptions, 'auth'>) =>
    request<T>(path, { ...opts, method: 'POST', body }),

  put: <T>(path: string, body?: unknown, opts?: Pick<RequestOptions, 'auth'>) =>
    request<T>(path, { ...opts, method: 'PUT', body }),

  delete: <T>(path: string, opts?: Pick<RequestOptions, 'auth'>) =>
    request<T>(path, { ...opts, method: 'DELETE' }),

  postForm: <T>(path: string, form: FormData, opts?: Pick<RequestOptions, 'auth'>) =>
    request<T>(path, { ...opts, method: 'POST', multipart: form }),

  putForm: <T>(path: string, form: FormData, opts?: Pick<RequestOptions, 'auth'>) =>
    request<T>(path, { ...opts, method: 'PUT', multipart: form }),
};
