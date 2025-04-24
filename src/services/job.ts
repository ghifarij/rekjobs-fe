import { Job, JobCreate, JobUpdate } from "@/types/job";
import { AxiosError } from "axios";
import { ErrorResponse } from "@/types/auth";
import api from "./authUser";

// Add interceptor to include token with every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("companyToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const jobAPI = {
  // Create a new job
  createJob: async (jobData: JobCreate): Promise<Job> => {
    try {
      const response = await api.post<Job>("/company-jobs", jobData);
      return response.data;
    } catch (error) {
      console.error(
        "Job creation error:",
        error instanceof AxiosError ? error.response?.data : error
      );
      if (error instanceof AxiosError) {
        throw (
          (error.response?.data as ErrorResponse) || {
            message: "Failed to create job",
          }
        );
      }
      throw { message: "Failed to create job" } as ErrorResponse;
    }
  },

  // Update a job
  updateJob: async (jobId: number, jobData: JobUpdate): Promise<Job> => {
    try {
      const response = await api.put<Job>(`/company-jobs/${jobId}`, jobData);
      return response.data;
    } catch (error) {
      console.error(
        "Job update error:",
        error instanceof AxiosError ? error.response?.data : error
      );
      if (error instanceof AxiosError) {
        throw (
          (error.response?.data as ErrorResponse) || {
            message: "Failed to update job",
          }
        );
      }
      throw { message: "Failed to update job" } as ErrorResponse;
    }
  },

  // Delete a job
  deleteJob: async (jobId: number): Promise<void> => {
    try {
      await api.delete(`/company-jobs/${jobId}`);
    } catch (error) {
      console.error(
        "Job deletion error:",
        error instanceof AxiosError ? error.response?.data : error
      );
      if (error instanceof AxiosError) {
        throw (
          (error.response?.data as ErrorResponse) || {
            message: "Failed to delete job",
          }
        );
      }
      throw { message: "Failed to delete job" } as ErrorResponse;
    }
  },

  // Get all jobs for the company
  getCompanyJobs: async (): Promise<Job[]> => {
    try {
      const response = await api.get<Job[]>("/company-jobs");
      return response.data;
    } catch (error) {
      console.error(
        "Error fetching jobs:",
        error instanceof AxiosError ? error.response?.data : error
      );
      if (error instanceof AxiosError) {
        throw (
          (error.response?.data as ErrorResponse) || {
            message: "Failed to fetch jobs",
          }
        );
      }
      throw { message: "Failed to fetch jobs" } as ErrorResponse;
    }
  },

  getJobById: async (jobId: number): Promise<Job> => {
    try {
      const response = await api.get<Job>(`/company-jobs/${jobId}`);
      return response.data;
    } catch (error) {
      console.error(
        "Error fetching job by ID:",
        error instanceof AxiosError ? error.response?.data : error
      );
      if (error instanceof AxiosError) {
        throw (
          (error.response?.data as ErrorResponse) || {
            message: "Failed to fetch job",
          }
        );
      }
      throw { message: "Failed to fetch job" } as ErrorResponse;
    }
  },

  // Get a job by slug
  getJobBySlug: async (slug: string): Promise<Job> => {
    try {
      const response = await api.get<Job>(`/jobs/${slug}`);
      return response.data;
    } catch (error) {
      console.error(
        "Error fetching job by slug:",
        error instanceof AxiosError ? error.response?.data : error
      );
      if (error instanceof AxiosError) {
        throw (
          (error.response?.data as ErrorResponse) || {
            message: "Failed to fetch job",
          }
        );
      }
      throw { message: "Failed to fetch job" } as ErrorResponse;
    }
  },

  // Get all public jobs for the homepage
  getAllPublicJobs: async (search?: string): Promise<Job[]> => {
    try {
      const url = search
        ? `/jobs?search=${encodeURIComponent(search)}`
        : "/jobs";
      const response = await api.get<Job[]>(url);
      return response.data;
    } catch (error) {
      console.error(
        "Error fetching public jobs:",
        error instanceof AxiosError ? error.response?.data : error
      );
      if (error instanceof AxiosError) {
        throw (
          (error.response?.data as ErrorResponse) || {
            message: "Failed to fetch public jobs",
          }
        );
      }
      throw { message: "Failed to fetch public jobs" } as ErrorResponse;
    }
  },
};
