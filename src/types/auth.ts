
export interface User {
  id: number;
  email: string;
  name: string;
  role: 'user' | 'admin';
  status?: 'active' | 'pending';
  created_at: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  password_confirm: string;
  role?: 'user' | 'admin';
}

export interface AuthResponse {
  user: User;
  token: string;
  success: boolean;
  message?: string;
}

export interface UserUpdateRequest {
  id: number;
  status?: 'active' | 'pending';
  role?: 'user' | 'admin';
}
