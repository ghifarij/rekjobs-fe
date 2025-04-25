export interface Experience {
  id?: number;
  title: string;
  company: string;
  location: string | null;
  startDate: Date;
  endDate: Date | null;
  current: boolean;
  description: string | null;
}

export interface Education {
  id?: number;
  school: string;
  degree: string;
  fieldOfStudy: string;
  startDate: Date;
  endDate: Date | null;
  current: boolean;
  description: string | null;
}

export interface UserProfile {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  bio: string | null;
  avatar: string | null;
  skills: string[];
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
  experience: Experience[];
  education: Education[];
}

export interface UserProfileUpdate {
  name: string;
  email: string;
  phone?: string;
  bio?: string;
  avatar?: string;
  skills?: string[];
  password?: string;
  experience?: Array<{
    id?: number;
    title: string;
    company: string;
    location?: string;
    startDate: Date;
    endDate?: Date;
    current: boolean;
    description?: string;
  }>;
  education?: Array<{
    id?: number;
    school: string;
    degree: string;
    fieldOfStudy: string;
    startDate: Date;
    endDate?: Date;
    current: boolean;
    description?: string;
  }>;
}
