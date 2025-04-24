// src/services/company.ts
import { AxiosError } from "axios";
import api from "./authUser"; // your configured axios instance
import { ErrorResponse } from "@/types/auth";

// Add interceptor to include company token with every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const userInterviewAPI = {
  // Fetch the authenticated company's profile
  requestRescheduleInterview: async (interviewId: number) => {
    try {
      const response = await api.patch(
        `/interviews/user/${interviewId}/reschedule`
      );
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError<ErrorResponse>;
      console.error("Error rescheduling interview:", error);
      throw (
        axiosError.response?.data || {
          message: "Failed to reschedule interview",
        }
      );
    }
  },

  acceptInterview: async (interviewId: number) => {
    try {
      const response = await api.patch(
        `/interviews/user/${interviewId}/accept`
      );
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError<ErrorResponse>;
      console.error("Error accepting interview:", error);
      throw (
        axiosError.response?.data || { message: "Failed to accept interview" }
      );
    }
  },
};
