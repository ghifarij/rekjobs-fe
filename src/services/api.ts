import axios, { InternalAxiosRequestConfig } from "axios";

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
  (error: any) => {
    return Promise.reject(error);
  }
);

// Auth API endpoints
export const authAPI = {
  // Register a new user
  register: async (email: string) => {
    try {
      const response = await api.post("/auth/user/register", { email });
      return response.data;
    } catch (error: any) {
      throw error.response?.data || { message: "Registration failed" };
    }
  },

  // Verify user email
  verify: async (token: string) => {
    try {
      const response = await api.post("/auth/user/verify", { token });
      return response.data;
    } catch (error: any) {
      throw error.response?.data || { message: "Verification failed" };
    }
  },

  // Login user
  login: async (email: string, password: string) => {
    try {
      const response = await api.post("/auth/user/login", { email, password });
      return response.data;
    } catch (error: any) {
      throw error.response?.data || { message: "Login failed" };
    }
  },

  // Social login (Google)
  socialLogin: async (userData: {
    googleId: string;
    email: string;
    name: string;
    picture?: string;
  }) => {
    try {
      console.log("Sending Google user data to backend:", userData);
      const response = await api.post("/auth/user/social-login", userData);
      return response.data;
    } catch (error: any) {
      throw error.response?.data || { message: "Social login failed" };
    }
  },

  // Social login (Google) for companies
  socialLoginCompany: async (companyData: {
    googleId: string;
    email: string;
    name: string;
    picture?: string;
  }) => {
    try {
      console.log("Sending Google company data to backend:", companyData);
      const response = await api.post(
        "/auth/company/social-login",
        companyData
      );
      return response.data;
    } catch (error: any) {
      throw error.response?.data || { message: "Company social login failed" };
    }
  },

  // Forgot password
  forgotPassword: async (email: string) => {
    try {
      const response = await api.post("/auth/user/forgot-password", { email });
      return response.data;
    } catch (error: any) {
      throw (
        error.response?.data || { message: "Forgot password request failed" }
      );
    }
  },

  // Reset password
  resetPassword: async (token: string, password: string) => {
    try {
      const response = await api.post("/auth/user/reset-password", {
        token,
        password,
      });
      return response.data;
    } catch (error: any) {
      throw error.response?.data || { message: "Password reset failed" };
    }
  },

  // Verify user with token and user data
  verifyUser: async (
    token: string,
    userData: { username: string; password: string; no_handphone: string }
  ) => {
    try {
      const response = await api.post("/auth/user/verify", {
        token,
        ...userData,
      });
      return response.data;
    } catch (error: any) {
      throw error.response?.data || { message: "Verification failed" };
    }
  },
};

export default api;
