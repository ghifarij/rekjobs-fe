// context/SessionContext.tsx
"use client";

import React, {
  createContext,
  ReactNode,
  useEffect,
  useState,
  useCallback,
} from "react";
import axios, { InternalAxiosRequestConfig } from "axios";
import {
  SessionContext as ISessionContext,
  UserType,
  IUser,
  ICompany,
} from "@/types/session";

// Create axios instance
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL_BE,
  headers: { "Content-Type": "application/json" },
});

interface SessionResponse {
  type: UserType;
  id: number;
  name: string;
  email: string;
  avatar?: string;
  logo?: string;
  isVerified: boolean;
  googleId?: string;
}

// Attach either user or company token
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const userToken = localStorage.getItem("token");
    const companyToken = localStorage.getItem("companyToken");
    const authToken = companyToken || userToken;
    if (authToken && config.headers) {
      config.headers.Authorization = `Bearer ${authToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const SessionContext = createContext<ISessionContext | undefined>(
  undefined
);

export const SessionProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [isAuth, setIsAuth] = useState(false);
  const [type, setType] = useState<UserType>(null);
  const [user, setUser] = useState<IUser | null>(null);
  const [company, setCompany] = useState<ICompany | null>(null);
  const [loading, setLoading] = useState(true);

  const resetSession = useCallback(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("companyToken");
    setIsAuth(false);
    setType(null);
    setUser(null);
    setCompany(null);
  }, []);

  const checkSession = useCallback(async (): Promise<void> => {
    setLoading(true);
    try {
      // only proceed if a token exists
      if (
        !localStorage.getItem("token") &&
        !localStorage.getItem("companyToken")
      ) {
        resetSession();
        return;
      }

      const res = await api.get<SessionResponse>("/auth/session");
      const result = res.data;

      if (result.type === "user") {
        setUser({
          id: result.id,
          name: result.name,
          email: result.email,
          avatar: result.avatar,
          // other IUser fields defaulted
          phone: undefined,
          bio: undefined,
          skills: [],
          createdAt: "",
          updatedAt: "",
          isVerified: result.isVerified,
          googleId: result.googleId,
        });
        setCompany(null);
        setType("user");
      } else if (result.type === "company") {
        setCompany({
          id: result.id,
          name: result.name,
          email: result.email,
          logo: result.logo,
          // other ICompany fields defaulted
          description: undefined,
          website: undefined,
          location: undefined,
          industry: undefined,
          size: undefined,
          createdAt: "",
          updatedAt: "",
          isVerified: result.isVerified,
          googleId: result.googleId,
        });
        setUser(null);
        setType("company");
      } else {
        throw new Error("Invalid session payload");
      }

      setIsAuth(true);
    } catch (err: unknown) {
      // silently handle 401 (not logged in or expired)
      if (axios.isAxiosError(err) && err.response?.status === 401) {
        resetSession();
      } else {
        console.error("Session check error:", err);
        resetSession();
      }
    } finally {
      setLoading(false);
    }
  }, [resetSession]);

  const setToken = useCallback(
    async (token: string, isCompany: boolean = false): Promise<void> => {
      if (isCompany) {
        localStorage.setItem("companyToken", token);
        localStorage.removeItem("token");
      } else {
        localStorage.setItem("token", token);
        localStorage.removeItem("companyToken");
      }
      await checkSession();
    },
    [checkSession]
  );

  const logout = useCallback(() => {
    resetSession();
    window.location.href = "/";
  }, [resetSession]);

  useEffect(() => {
    if (localStorage.getItem("token") || localStorage.getItem("companyToken")) {
      checkSession();
    } else {
      setLoading(false);
    }
  }, [checkSession]);

  // Listen for changes in localStorage (other tabs)
  useEffect(() => {
    const handleStorage = (e: StorageEvent) => {
      if (e.key === "token" || e.key === "companyToken") {
        if (e.newValue) checkSession();
        else resetSession();
      }
    };
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, [checkSession, resetSession]);

  return (
    <SessionContext.Provider
      value={{
        isAuth,
        type,
        user,
        company,
        checkSession,
        logout,
        loading,
        setToken,
      }}
    >
      {children}
    </SessionContext.Provider>
  );
};
