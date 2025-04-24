import api from "./authUser";
import { AxiosError } from "axios";
import { ErrorResponse } from "@/types/auth";
import {
  Application,
  ApplicationResponse,
  ApplicationStatus,
} from "@/types/application";

// Add interceptor to include token with every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("companyToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const companyApplicationAPI = {
  // Get all applications for a specific job (company)
  getCompanyApplications: async (): Promise<ApplicationResponse> => {
    try {
      const response = await api.get<ApplicationResponse>(
        `/applications/company`
      );
      return response.data;
    } catch (error) {
      console.error(
        "Error fetching job applications:",
        error instanceof AxiosError ? error.response?.data : error
      );
      if (error instanceof AxiosError) {
        throw (
          (error.response?.data as ErrorResponse) || {
            message: "Failed to fetch job applications",
          }
        );
      }
      throw { message: "Failed to fetch job applications" } as ErrorResponse;
    }
  },

  // Get a single application by ID
  getApplicationById: async (applicationId: number): Promise<Application> => {
    try {
      const response = await api.get<Application>(
        `/applications/company/${applicationId}`
      );
      return response.data;
    } catch (error) {
      console.error(
        "Error fetching application:",
        error instanceof AxiosError ? error.response?.data : error
      );
      if (error instanceof AxiosError) {
        throw (
          (error.response?.data as ErrorResponse) || {
            message: "Failed to fetch application",
          }
        );
      }
      throw { message: "Failed to fetch application" } as ErrorResponse;
    }
  },

  // Update application status (company)
  updateApplicationStatus: async (
    applicationId: number,
    status: ApplicationStatus
  ): Promise<Application> => {
    try {
      const response = await api.patch<Application>(
        `/applications/company/${applicationId}/status`,
        { status }
      );
      return response.data;
    } catch (error) {
      console.error(
        "Error updating application status:",
        error instanceof AxiosError ? error.response?.data : error
      );
      if (error instanceof AxiosError) {
        throw (
          (error.response?.data as ErrorResponse) || {
            message: "Failed to update application status",
          }
        );
      }
      throw { message: "Failed to update application status" } as ErrorResponse;
    }
  },
};
