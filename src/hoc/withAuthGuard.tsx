"use client";

import React, { useContext, useEffect } from "react";
import { useRouter } from "next/navigation";
import { SessionContext } from "@/context/sessionProvider";
import Loading from "@/app/loading";

interface AuthGuardOptions {
  requiredRole?: "user" | "company";
  redirectTo?: string;
  routeRedirects?: {
    [route: string]: string;
  };
}

export default function withAuthGuard<P extends object>(
  Component: React.ComponentType<P>,
  options: AuthGuardOptions = {}
) {
  const { requiredRole, redirectTo = "/", routeRedirects = {} } = options;

  return function AuthGuardedComponent(props: P) {
    const { isAuth, loading, type } = useContext(SessionContext) || {};
    const router = useRouter();

    useEffect(() => {
      if (!loading) {
        const currentRoute = window.location.pathname;

        // Handle unauthenticated users
        if (!isAuth) {
          console.warn("User is not authenticated. Redirecting to login.");
          router.replace(routeRedirects[currentRoute] || redirectTo);
          return;
        }

        // Handle role-based access
        if (requiredRole && type !== requiredRole) {
          const redirectPath =
            routeRedirects[currentRoute] || "/not-authorized";
          console.warn(`Role mismatch: required ${requiredRole}, got ${type}`);
          router.replace(redirectPath);
          return;
        }

        // Handle specific route redirects
        if (routeRedirects[currentRoute]) {
          router.replace(routeRedirects[currentRoute]);
        }
      }
    }, [isAuth, loading, type, router]);

    // Show loading state
    if (loading) {
      return <Loading />;
    }

    // Don't render if not authenticated or wrong role
    if (!isAuth || (requiredRole && type !== requiredRole)) {
      return null;
    }

    return <Component {...props} />;
  };
}
