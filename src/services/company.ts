// src/services/company.ts
import { ErrorResponse } from "@/types/auth";
import api from "./authUser"; // your configured axios instance
import axios from "axios";

// Add interceptor to include company token with every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("companyToken");
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export interface CompanyProfileUpdate {
  name?: string;
  description?: string;
  website?: string;
  logo?: string;
  location?: string;
  industry?: string;
  size?: string;
  password?: string;
}

export const companyAPI = {
  // Fetch the authenticated company's profile
  getProfile: async (): Promise<{
    id: number;
    name: string;
    email: string;
    description: string | null;
    website: string | null;
    logo: string | null;
    location: string | null;
    industry: string | null;
    size: string | null;
    isVerified: boolean;
    createdAt: string;
    updatedAt: string;
  }> => {
    try {
      const response = await api.get("/company-profile");
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        throw (
          (error.response?.data as ErrorResponse) || {
            message: "Failed to fetch profile",
          }
        );
      }
      throw { message: "Failed to fetch profile" } as ErrorResponse;
    }
  },

  // Update the authenticated company's profile
  updateProfile: async (
    updateData: CompanyProfileUpdate
  ): Promise<{
    id: number;
    name: string;
    email: string;
    description: string | null;
    website: string | null;
    logo: string | null;
    location: string | null;
    industry: string | null;
    size: string | null;
    isVerified: boolean;
    createdAt: string;
    updatedAt: string;
  }> => {
    try {
      const response = await api.put("/company-profile", updateData);
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        throw (
          (error.response?.data as ErrorResponse) || {
            message: "Failed to update profile",
          }
        );
      }
      throw { message: "Failed to update profile" } as ErrorResponse;
    }
  },
};
