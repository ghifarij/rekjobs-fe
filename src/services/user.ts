// src/services/user.ts
import { ErrorResponse } from "@/types/auth";
import api from "./authUser"; // your configured axios instance
import { UserProfile, UserProfileUpdate } from "@/types/user";
import { AxiosError } from "axios";

// Add interceptor to include user token with every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const userAPI = {
  /** Fetch the authenticated user's profile */
  getProfile: async (): Promise<UserProfile> => {
    try {
      const response = await api.get("/user-profile");
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError<ErrorResponse>;
      console.error(
        "Error fetching user profile:",
        axiosError.response?.data || axiosError.message
      );
      throw axiosError.response?.data || { message: "Failed to fetch profile" };
    }
  },

  /** Update the authenticated user's profile */
  updateProfile: async (
    updateData: UserProfileUpdate
  ): Promise<UserProfile> => {
    try {
      const response = await api.put("/user-profile", updateData);
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError<ErrorResponse>;
      console.error(
        "Error updating user profile:",
        axiosError.response?.data || axiosError.message
      );
      throw (
        axiosError.response?.data || { message: "Failed to update profile" }
      );
    }
  },
};
