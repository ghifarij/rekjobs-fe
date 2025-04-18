import api from "./api";

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
  createJob: async (jobData: {
    title: string;
    description: string;
    location: string;
    requirements: string;
    salary?: string;
    jobType: string;
    experience?: string;
    deadline: string;
  }) => {
    try {
      const response = await api.post("/company-jobs", jobData);
      return response.data;
    } catch (error: any) {
      console.error(
        "Job creation error:",
        error.response?.data || error.message
      );
      throw error.response?.data || { message: "Failed to create job" };
    }
  },

  // Update a job
  updateJob: async (
    jobId: number,
    jobData: {
      title?: string;
      description?: string;
      location?: string;
      requirements?: string;
      salary?: string;
      jobType?: string;
      experience?: string;
      deadline?: string;
      isActive?: boolean;
    }
  ) => {
    try {
      const response = await api.put(`/company-jobs/${jobId}`, jobData);
      return response.data;
    } catch (error: any) {
      console.error("Job update error:", error.response?.data || error.message);
      throw error.response?.data || { message: "Failed to update job" };
    }
  },

  // Delete a job
  deleteJob: async (jobId: number) => {
    try {
      const response = await api.delete(`/company-jobs/${jobId}`);
      return response.data;
    } catch (error: any) {
      console.error(
        "Job deletion error:",
        error.response?.data || error.message
      );
      throw error.response?.data || { message: "Failed to delete job" };
    }
  },

  // Get all jobs for the company
  getJobs: async () => {
    try {
      const response = await api.get("/company-jobs");
      return response.data;
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error("Error fetching jobs:", error.message);
        throw error;
      } else {
        console.error("Error fetching jobs:", error);
        throw { message: "Failed to fetch jobs" };
      }
    }
  },

  // Get a job by ID
  getJobById: async (jobId: number) => {
    try {
      const response = await api.get(`/company-jobs/${jobId}`);
      return response.data;
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error("Error fetching job by ID:", error.message);
        throw error;
      } else {
        console.error("Error fetching job by ID:", error);
        throw { message: "Failed to fetch job" };
      }
    }
  },
};
