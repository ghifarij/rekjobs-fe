export type JobType =
  | "FULL_TIME"
  | "PART_TIME"
  | "CONTRACT"
  | "INTERNSHIP"
  | "REMOTE";

export enum ExperienceLevel {
  ENTRY_LEVEL = "Entry Level",
  MID_LEVEL = "Mid Level",
  SENIOR_LEVEL = "Senior Level",
  EXPERT_LEVEL = "Expert Level",
}

export const EXPERIENCE_LEVELS = [
  ExperienceLevel.ENTRY_LEVEL,
  ExperienceLevel.MID_LEVEL,
  ExperienceLevel.SENIOR_LEVEL,
  ExperienceLevel.EXPERT_LEVEL,
] as const;

export interface Job {
  id: number;
  title: string;
  slug: string;
  description: string;
  location?: string;
  requirements: string;
  salary?: string;
  jobType: JobType;
  experience: ExperienceLevel;
  deadline?: string;
  createdAt: string;
  updatedAt: string;
  applications?: Array<{
    id: number;
    status: string;
  }>;
  company: {
    id: number;
    name: string;
    logo?: string;
  };
  isActive: boolean;
}

export interface JobCreate {
  title: string;
  description: string;
  requirements: string;
  salary: string;
  location: string;
  jobType: JobType;
  experience: string;
  deadline: string;
}

export interface JobUpdate {
  title?: string;
  description?: string;
  requirements?: string;
  salary?: string;
  location?: string;
  type?: JobType;
  experience?: ExperienceLevel;
  deadline?: string;
  isActive?: boolean;
}

export interface JobResponse {
  jobs: Job[];
  total: number;
  page: number;
  limit: number;
}

export interface JobData {
  id: number;
  title: string;
  company: {
    name: string;
  };
}
