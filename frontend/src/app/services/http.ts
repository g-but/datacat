'use client';

// Prefer relative calls ("/api/...") so Next.js rewrites can proxy to the
// configured backend. Allow overriding with NEXT_PUBLIC_API_URL when needed.
const API_BASE = process.env.NEXT_PUBLIC_API_URL || '';

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

interface RequestOptions {
  method?: HttpMethod;
  path: string;
  body?: unknown;
  headers?: Record<string, string>;
  authenticated?: boolean;
}

async function request<T>({ method = 'GET', path, body, headers = {}, authenticated = false }: RequestOptions): Promise<T> {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  const finalHeaders: HeadersInit = {
    'Content-Type': 'application/json',
    ...headers,
  };

  if (authenticated && token) {
    (finalHeaders as Record<string, string>).Authorization = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers: finalHeaders,
    body: body !== undefined ? JSON.stringify(body) : undefined,
    cache: 'no-store',
    credentials: 'include',
  });

  const json = await res.json().catch(() => ({}));
  if (!res.ok) {
    const message = (json && (json.message || json.error || json.msg)) || `HTTP ${res.status}`;
    throw new Error(message);
  }
  return json as T;
}

export const http = {
  get: <T>(path: string, authenticated = false, headers?: Record<string, string>) =>
    request<T>({ method: 'GET', path, authenticated, headers }),
  post: <T>(path: string, body?: unknown, authenticated = false, headers?: Record<string, string>) =>
    request<T>({ method: 'POST', path, body, authenticated, headers }),
  put: <T>(path: string, body?: unknown, authenticated = false, headers?: Record<string, string>) =>
    request<T>({ method: 'PUT', path, body, authenticated, headers }),
  patch: <T>(path: string, body?: unknown, authenticated = false, headers?: Record<string, string>) =>
    request<T>({ method: 'PATCH', path, body, authenticated, headers }),
  delete: <T>(path: string, authenticated = false, headers?: Record<string, string>) =>
    request<T>({ method: 'DELETE', path, authenticated, headers }),
};

export type ApiSuccess<T> = { success: true; message?: string } & T;
export type ApiError = { success: false; message: string };

