// types.ts

// ——————————————————————————————————————————————————
// 1) “Domain” interfaces matching your Prisma models
// ——————————————————————————————————————————————————

export interface IUser {
  id: number;
  email: string;
  name: string;
  phone?: string;
  bio?: string;
  avatar?: string;
  skills: string[];
  createdAt: string; // ISO datetime
  updatedAt: string; // ISO datetime
  isVerified: boolean;
  googleId?: string;
}

export interface ICompany {
  id: number;
  email: string;
  name: string;
  description?: string;
  website?: string;
  logo?: string;
  location?: string;
  industry?: string;
  size?: string;
  createdAt: string; // ISO datetime
  updatedAt: string; // ISO datetime
  isVerified: boolean;
  googleId?: string;
}

// ——————————————————————————————————————————————————
// 2) “Session” types
// ——————————————————————————————————————————————————

export type UserType = "user" | "company" | null;

export interface SessionContext {
  isAuth: boolean;
  type: UserType; // who's logged in?
  user: IUser | null; // populated if type === "user"
  company: ICompany | null; // populated if type === "company"
  checkSession: () => Promise<void>;
  logout: () => void;
  loading: boolean; // while we're fetching / initializing
  setToken: (token: string, isCompany?: boolean) => void;
}
