export interface AuthResponse {
  token: string;
  message?: string;
  user?: {
    id: number;
    name: string;
    email: string;
    avatar?: string;
    isVerified: boolean;
    googleId?: string;
  };
  company?: {
    id: number;
    name: string;
    email: string;
    logo?: string;
    isVerified: boolean;
    googleId?: string;
  };
  isVerified?: boolean;
}

export interface ErrorResponse {
  message: string;
  errors?: Record<string, string[]>;
  statusCode?: number;
}
