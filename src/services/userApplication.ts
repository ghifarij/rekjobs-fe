import { ErrorResponse } from "@/types/auth";
import api from "./authUser";
import { AxiosError } from "axios";

// Add interceptor to include token with every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const userApplicationAPI = {
  // Create a new application
  createApplication: async (params: {
    jobId: number;
    coverLetterFile?: File;
    resumeFile?: File;
  }) => {
    const { jobId, coverLetterFile, resumeFile } = params;

    // build a multipart/form-data payload
    const form = new FormData();
    form.append("jobId", String(jobId));
    if (coverLetterFile) form.append("coverLetter", coverLetterFile);
    if (resumeFile) form.append("resume", resumeFile);

    try {
      const response = await api.post("/applications/user", form, {
        headers: {
          // Let the browser set Content‑Type with boundary
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError<ErrorResponse>;
      console.error(
        "Application creation error:",
        axiosError.response?.data || axiosError.message
      );
      throw (
        axiosError.response?.data || { message: "Failed to create application" }
      );
    }
  },

  // Get all applications for the current user
  getUserApplications: async () => {
    try {
      const response = await api.get("/applications/user");
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError<ErrorResponse>;
      console.error(
        "Error fetching user applications:",
        axiosError.response?.data || axiosError.message
      );
      throw (
        axiosError.response?.data || { message: "Failed to fetch applications" }
      );
    }
  },

  // Delete an application
  deleteApplication: async (applicationId: number) => {
    try {
      const response = await api.delete(`/applications/user/${applicationId}`);
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError<ErrorResponse>;
      console.error(
        "Error deleting application:",
        axiosError.response?.data || axiosError.message
      );
      throw (
        axiosError.response?.data || { message: "Failed to delete application" }
      );
    }
  },
};
