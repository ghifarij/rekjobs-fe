// src/services/company.ts
import api from "./authUser"; // your configured axios instance
import { AxiosError } from "axios";
import { ErrorResponse } from "@/types/auth";
import { CompanyInterview } from "@/types/interview";

export interface CreateInterviewPayload {
  applicationId: number;
  scheduledAt: string; // ISO datetime string
  notes?: string;
}

export interface RescheduleInterviewPayload {
  scheduledAt: string; // ISO datetime string
  notes?: string;
}

export interface InterviewResponse {
  id: number;
  applicationId: number;
  scheduledAt: string;
  notes?: string;
  status: string;
}

// Add interceptor to include company token with every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("companyToken");
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const companyInterviewAPI = {
  // Fetch the authenticated company's profile
  createInterview: async (
    payload: CreateInterviewPayload
  ): Promise<InterviewResponse> => {
    try {
      const response = await api.post<InterviewResponse>(
        "/interviews/company",
        payload
      );
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError<ErrorResponse>;
      console.error(
        "Error scheduling interview:",
        axiosError.response?.data || axiosError.message
      );
      throw (
        axiosError.response?.data || { message: "Failed to schedule interview" }
      );
    }
  },

  getCompanyInterviews: async (): Promise<CompanyInterview[]> => {
    try {
      const response = await api.get<CompanyInterview[]>("/interviews/company");
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError<ErrorResponse>;
      console.error("Error fetching company interviews:", axiosError);
      throw (
        axiosError.response?.data || { message: "Failed to fetch interviews" }
      );
    }
  },

  rescheduleInterview: async (
    interviewId: number,
    payload: RescheduleInterviewPayload
  ): Promise<InterviewResponse> => {
    try {
      const response = await api.patch<InterviewResponse>(
        `/interviews/company/${interviewId}`,
        payload
      );
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError<ErrorResponse>;
      console.error("Error rescheduling interview:", axiosError);
      throw (
        axiosError.response?.data || {
          message: "Failed to reschedule interview",
        }
      );
    }
  },
};
