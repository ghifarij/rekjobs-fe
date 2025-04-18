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

// Create an axios instance with default config and interceptor
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL_BE,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Check for token or companyToken and set header accordingly
    const token =
      localStorage.getItem("token") || localStorage.getItem("companyToken");
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
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
    setIsAuth(false);
    setType(null);
    setUser(null);
    setCompany(null);
  }, []);

  const checkSession = useCallback(async () => {
    try {
      // Check for token from localStorage manually in case none exists
      const token = localStorage.getItem("token");
      const companyToken = localStorage.getItem("companyToken");
      const activeToken = token || companyToken;
      if (!activeToken) throw new Error("No token");

      // Client‐side expiry check
      const payload = JSON.parse(atob(activeToken.split(".")[1]));
      if (payload.exp * 1000 < Date.now()) throw new Error("Token expired");

      // Use axios instance to call the session endpoint
      const res = await api.get("/auth/session");
      // If the status is not OK, throw an error
      if (res.status < 200 || res.status >= 300) {
        throw new Error("Session fetch failed");
      }

      // Expected response JSON structure: { type, id, name, email, avatar|logo, isVerified, googleId }
      const result: any = res.data;

      if (result.type === "user") {
        const u: IUser = {
          id: result.id,
          name: result.name,
          email: result.email,
          avatar: result.avatar ?? null,
          phone: undefined,
          bio: undefined,
          skills: [],
          createdAt: "",
          updatedAt: "",
          isVerified: result.isVerified,
          googleId: result.googleId ?? undefined,
        };
        setUser(u);
        setCompany(null);
        setType("user");
      } else if (result.type === "company") {
        const c: ICompany = {
          id: result.id,
          name: result.name,
          email: result.email,
          logo: result.logo ?? null,
          description: undefined,
          website: undefined,
          location: undefined,
          industry: undefined,
          size: undefined,
          createdAt: "",
          updatedAt: "",
          isVerified: result.isVerified,
          googleId: result.googleId ?? undefined,
        };
        setCompany(c);
        setUser(null);
        setType("company");
      } else {
        throw new Error("Invalid session payload");
      }

      setIsAuth(true);
    } catch (err) {
      console.error("Session check error:", err);
      resetSession();
    } finally {
      setLoading(false);
    }
  }, [resetSession]);

  const logout = useCallback(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("companyToken");
    resetSession();
    window.location.href = "/";
  }, [resetSession]);

  // Listen for storage events to catch login/logout from other tabs
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "token" || e.key === "companyToken") {
        if (e.newValue) {
          // Token added or changed
          checkSession();
        } else {
          // Token removed
          resetSession();
        }
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [checkSession, resetSession]);

  // Initial session check
  useEffect(() => {
    const token = localStorage.getItem("token");
    const companyToken = localStorage.getItem("companyToken");

    if (token || companyToken) {
      checkSession();
    } else {
      setLoading(false);
    }
  }, [checkSession]);

  // Create a method to handle login programmatically
  const setToken = useCallback(
    (token: string, isCompany: boolean = false) => {
      if (isCompany) {
        localStorage.setItem("companyToken", token);
        localStorage.removeItem("token"); // Remove other token to avoid conflicts
      } else {
        localStorage.setItem("token", token);
        localStorage.removeItem("companyToken"); // Remove other token to avoid conflicts
      }
      checkSession();
    },
    [checkSession]
  );

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
