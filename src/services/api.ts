const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3000';

export type ApiError = {
  status: number;
  message: string;
};

const getToken = () => localStorage.getItem('access_token');

function safeJsonParse(text: string) {
  try {
    return text ? JSON.parse(text) : null;
  } catch {
    return null;
  }
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const headers = new Headers(options.headers);
  headers.set('Content-Type', 'application/json');

  const token = getToken();
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
  });

  const text = await response.text();
  const data = safeJsonParse(text);

  if (!response.ok) {
    const message = data?.message || data?.error || 'Beklenmeyen bir hata oluþtu.';
    const error: ApiError = { status: response.status, message };
    throw error;
  }

  return data as T;
}

export const api = {
  auth: {
    register: (email: string, password: string) =>
      request<void>('/auth/register', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      }),
    login: (email: string, password: string) =>
      request<{ access_token: string }>('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      }),
  },
  products: {
    list: () => request<any[]>('/products'),
    get: (id: string | number) => request<any>(`/products/${id}`),
    create: (payload: Record<string, unknown>) =>
      request<any>('/products', {
        method: 'POST',
        body: JSON.stringify(payload),
      }),
    update: (id: string | number, payload: Record<string, unknown>) =>
      request<any>(`/products/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(payload),
      }),
    remove: (id: string | number) =>
      request<void>(`/products/${id}`, {
        method: 'DELETE',
      }),
  },
};
