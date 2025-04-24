import axios, { InternalAxiosRequestConfig, AxiosError } from "axios";
import { AuthResponse, ErrorResponse } from "@/types/auth";

// Create an axios instance with default config
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL_BE,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add a request interceptor to add the auth token to requests
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem("token");
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

interface UserSocialLoginData {
  googleId: string;
  email: string;
  name: string;
  picture?: string;
}

interface UserVerifyData {
  username: string;
  password: string;
  no_handphone: string;
}

// Auth API endpoints
export const authAPI = {
  // Register a new user
  register: async (email: string): Promise<AuthResponse> => {
    try {
      const response = await api.post<AuthResponse>("/auth/user/register", {
        email,
      });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw (
          (error.response?.data as ErrorResponse) || {
            message: "Registration failed",
          }
        );
      }
      throw { message: "Registration failed" } as ErrorResponse;
    }
  },

  // Verify user email
  verify: async (token: string): Promise<AuthResponse> => {
    try {
      const response = await api.post<AuthResponse>("/auth/user/verify", {
        token,
      });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw (
          (error.response?.data as ErrorResponse) || {
            message: "Verification failed",
          }
        );
      }
      throw { message: "Verification failed" } as ErrorResponse;
    }
  },

  // Login user
  login: async (email: string, password: string): Promise<AuthResponse> => {
    try {
      const response = await api.post<AuthResponse>("/auth/user/login", {
        email,
        password,
      });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw (
          (error.response?.data as ErrorResponse) || { message: "Login failed" }
        );
      }
      throw { message: "Login failed" } as ErrorResponse;
    }
  },

  // Social login (Google)
  socialLogin: async (userData: UserSocialLoginData): Promise<AuthResponse> => {
    try {
      console.log("Sending Google user data to backend:", userData);
      const response = await api.post<AuthResponse>(
        "/auth/user/social-login",
        userData
      );
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw (
          (error.response?.data as ErrorResponse) || {
            message: "Social login failed",
          }
        );
      }
      throw { message: "Social login failed" } as ErrorResponse;
    }
  },

  // Forgot password
  forgotPassword: async (email: string): Promise<AuthResponse> => {
    try {
      const response = await api.post<AuthResponse>(
        "/auth/user/forgot-password",
        { email }
      );
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw (
          (error.response?.data as ErrorResponse) || {
            message: "Forgot password request failed",
          }
        );
      }
      throw { message: "Forgot password request failed" } as ErrorResponse;
    }
  },

  // Reset password
  resetPassword: async (
    token: string,
    password: string
  ): Promise<AuthResponse> => {
    try {
      const response = await api.post<AuthResponse>(
        "/auth/user/reset-password",
        {
          token,
          password,
        }
      );
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw (
          (error.response?.data as ErrorResponse) || {
            message: "Password reset failed",
          }
        );
      }
      throw { message: "Password reset failed" } as ErrorResponse;
    }
  },

  // Verify user with token and user data
  verifyUser: async (
    token: string,
    userData: UserVerifyData
  ): Promise<AuthResponse> => {
    try {
      const response = await api.post<AuthResponse>("/auth/user/verify", {
        token,
        ...userData,
      });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw (
          (error.response?.data as ErrorResponse) || {
            message: "Verification failed",
          }
        );
      }
      throw { message: "Verification failed" } as ErrorResponse;
    }
  },

  // Check verification status
  checkVerificationStatus: async (token: string): Promise<AuthResponse> => {
    try {
      const response = await api.post<AuthResponse>(
        "/auth/user/check-verification",
        {
          token,
        }
      );
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw (
          (error.response?.data as ErrorResponse) || {
            message: "Failed to check verification status",
          }
        );
      }
      throw { message: "Failed to check verification status" } as ErrorResponse;
    }
  },
};

export default api;
