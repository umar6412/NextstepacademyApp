const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'STUDENT' | 'ADMIN' | 'RECRUITER';
  avatarUrl?: string;
  bio?: string;
  targetRole?: string;
  progressPercent?: number;
}

export function setToken(token: string) {
  if (typeof window !== 'undefined') {
    localStorage.setItem('nextstep_token', token);
  }
}

export function getToken(): string | null {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('nextstep_token');
  }
  return null;
}

export function removeToken() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('nextstep_token');
    localStorage.removeItem('nextstep_user');
  }
}

export function setCurrentUser(user: User) {
  if (typeof window !== 'undefined') {
    localStorage.setItem('nextstep_user', JSON.stringify(user));
  }
}

export function getCurrentUser(): User | null {
  if (typeof window !== 'undefined') {
    const raw = localStorage.getItem('nextstep_user');
    if (raw) {
      try {
        return JSON.parse(raw);
      } catch (e) {
        return null;
      }
    }
  }
  return null;
}

export async function apiRequest<T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const res = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers,
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({ message: 'An error occurred' }));
      throw new Error(errorData.message || errorData.detail || `Request failed with status ${res.status}`);
    }

    return await res.json();
  } catch (error: any) {
    // If backend isn't running, log warn and throw
    console.warn('API Request Error:', error.message);
    throw error;
  }
}
