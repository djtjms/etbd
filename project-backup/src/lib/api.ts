// API Client for PHP Backend
const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

// Token management
const getToken = (): string | null => localStorage.getItem('access_token');
const getRefreshToken = (): string | null => localStorage.getItem('refresh_token');
const setTokens = (access: string, refresh: string): void => {
  localStorage.setItem('access_token', access);
  localStorage.setItem('refresh_token', refresh);
};
const clearTokens = (): void => {
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
};

// Types
export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data: T;
  errors?: Record<string, string[]>;
}

export interface PaginatedData<T> {
  items: T[];
  pagination: {
    total: number;
    per_page: number;
    current_page: number;
    last_page: number;
  };
}

// API Request helper
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const token = getToken();
  
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };
  
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });
    
    // Handle 401 - try to refresh token
    if (response.status === 401 && token) {
      const refreshed = await refreshToken();
      if (refreshed) {
        headers.Authorization = `Bearer ${getToken()}`;
        const retryResponse = await fetch(`${API_BASE_URL}${endpoint}`, {
          ...options,
          headers,
        });
        return retryResponse.json();
      }
      clearTokens();
      window.location.href = '/auth';
    }
    
    return response.json();
  } catch (error) {
    console.error('API request error:', error);
    return {
      success: false,
      message: 'Network error. Please try again.',
      data: null as T,
    };
  }
}

// Token refresh
async function refreshToken(): Promise<boolean> {
  const token = getRefreshToken();
  if (!token) return false;
  
  try {
    const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refresh_token: token }),
    });
    
    const data = await response.json();
    if (data.success) {
      setTokens(data.data.access_token, data.data.refresh_token);
      return true;
    }
  } catch (error) {
    console.error('Token refresh failed:', error);
  }
  
  return false;
}

// API client
export const api = {
  get: <T>(endpoint: string): Promise<ApiResponse<T>> => apiRequest<T>(endpoint),
  
  post: <T>(endpoint: string, data: Record<string, unknown>): Promise<ApiResponse<T>> => 
    apiRequest<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  
  put: <T>(endpoint: string, data: Record<string, unknown>): Promise<ApiResponse<T>> => 
    apiRequest<T>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  
  delete: <T>(endpoint: string): Promise<ApiResponse<T>> => 
    apiRequest<T>(endpoint, { method: 'DELETE' }),
    
  upload: async (file: File): Promise<ApiResponse<{ url: string }>> => {
    const token = getToken();
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await fetch(`${API_BASE_URL}/upload`, {
      method: 'POST',
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body: formData,
    });
    
    return response.json();
  },
};

// User type for auth responses
interface AuthUser {
  id: string;
  email: string;
  full_name: string | null;
  role: string;
}

interface AuthResponse {
  user: AuthUser;
  access_token: string;
  refresh_token: string;
}

// Auth helpers
export const auth = {
  login: async (email: string, password: string): Promise<ApiResponse<AuthResponse>> => {
    const response = await api.post<AuthResponse>('/auth/login', { email, password });
    
    if (response.success) {
      setTokens(response.data.access_token, response.data.refresh_token);
    }
    return response;
  },
  
  register: async (email: string, password: string, fullName?: string): Promise<ApiResponse<AuthResponse>> => {
    const response = await api.post<AuthResponse>('/auth/register', {
      email,
      password,
      password_confirmation: password,
      full_name: fullName,
    });
    
    if (response.success) {
      setTokens(response.data.access_token, response.data.refresh_token);
    }
    return response;
  },
  
  logout: async (): Promise<void> => {
    await api.post('/auth/logout', {});
    clearTokens();
  },
  
  getUser: (): Promise<ApiResponse<AuthUser>> => api.get<AuthUser>('/auth/me'),
  
  isAuthenticated: (): boolean => !!getToken(),
};

export default api;
