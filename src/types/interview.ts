import { InterviewStatus } from "./application";

export interface CompanyInterview {
  id: number;
  scheduledAt: string; // ISO string
  notes?: string;
  status: InterviewStatus;
  application: {
    id: number;
    job: {
      id: number;
      title: string;
      slug: string;
    };
    applicant: {
      id: number;
      name: string;
      email: string;
      phone?: string;
      avatar?: string;
    };
  };
}

export interface InterviewResponse {
  id: number;
  scheduledAt: string;
  notes?: string;
  application: {
    id: number;
    job: {
      id: number;
      title: string;
      slug: string;
    };
    applicant: {
      id: number;
      name: string;
      email: string;
      phone?: string;
      avatar?: string;
    };
  };
}
