export interface RegisterPostData {
  email: string;
  password: string;
  fullName?: string; // Keeping for backward compatibility
}

export interface LoginPostData {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  message?: string;
}

export interface User {
  id: string;
  email: string;
  fullName?: string;
}
