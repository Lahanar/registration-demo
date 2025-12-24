export interface RegisterRequest {
  email: string;
  password: string;
  confirmPassword: string;
}

export interface RegisterResponse {
  id: string;
  email: string;
}

export interface RegisterError {
  error: string;
}

export type ValidationError = {
  field: 'email' | 'password' | 'confirmPassword' | 'general';
  message: string;
};
