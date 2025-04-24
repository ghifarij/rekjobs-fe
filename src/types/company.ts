// src/types/company.ts
export interface CompanyProfile {
  id: number;
  name: string;
  email: string;
  description: string | null;
  website: string | null;
  logo: string | null;
  location: string | null;
  industry: string | null;
  size: string | null;
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
}
