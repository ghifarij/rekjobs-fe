export type ApplicationStatus =
  | "PENDING"
  | "PROCESSING"
  | "ACCEPTED"
  | "REJECTED";
export type InterviewStatus =
  | "SCHEDULED"
  | "COMPLETED"
  | "CANCELLED"
  | "RESCHEDULED"
  | "PENDING";

export interface Application {
  id: number;
  jobId: number;
  userId: number;
  status: ApplicationStatus;
  coverLetter?: string;
  resume?: string;
  createdAt: string;
  updatedAt: string;
  job: {
    id: number;
    title: string;
    slug: string;
    company: {
      name: string;
      logo?: string;
    };
    location?: string;
    salary?: string;
  };
  applicant: {
    id: number;
    name: string;
    email: string;
    avatar?: string;
    phone?: string;
    bio?: string;
    skills?: string[];
    experience?: Array<{
      title: string;
      company: string;
      location?: string;
      startDate: string;
      endDate?: string;
      current: boolean;
    }>;
    education?: Array<{
      degree: string;
      field: string;
      school: string;
      startDate: string;
      endDate?: string;
      current: boolean;
    }>;
  };
  interviews: Array<{
    id: number;
    scheduledAt: string;
    notes?: string;
    status: InterviewStatus;
  }>;
}

export interface ApplicationCreate {
  jobId: number;
  coverLetter: string;
  resume: string;
}

export interface ApplicationUpdate {
  status?: ApplicationStatus;
  notes?: string;
}

export interface ApplicationResponse {
  applications: Application[];
  total: number;
  page: number;
  limit: number;
}

export interface ApplicationDetails {
  id: number;
  status: ApplicationStatus;
  coverLetter?: string;
  resume?: string;
  job: {
    id: number;
    title: string;
    slug: string;
  };
  interviews: {
    id: number;
    scheduledAt: string;
    status: InterviewStatus;
    notes?: string;
  }[];
  applicant: {
    id: number;
    name: string;
    email: string;
    avatar?: string;
    bio?: string;
    phone?: string;
    skills?: string[];
    experience?: Array<{
      title: string;
      company: string;
      location?: string;
      startDate: string;
      endDate?: string;
      current: boolean;
    }>;
    education?: Array<{
      school: string;
      degree: string;
      field: string;
      startDate: string;
      endDate?: string;
      current: boolean;
    }>;
  };
}
