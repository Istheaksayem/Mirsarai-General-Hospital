"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Role, ROLE_ROUTES } from "@/types/auth";
import { LoadingScreen } from "@/components/ui/LoadingScreen";

interface RouteGuardProps {
  children: React.ReactNode;
  allowedRole: Role;
}

export function RouteGuard({ children, allowedRole }: RouteGuardProps) {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (isLoading) return;

    if (!isAuthenticated || !user) {
      router.replace("/login");
      return;
    }

    if (user.role !== allowedRole) {
      // Redirect to their own dashboard
      router.replace(ROLE_ROUTES[user.role]);
      return;
    }

    // Staff-specific checks (applies to doctor, reception-admin, lab-admin)
    const STAFF_ROLES = ["doctor", "reception-admin", "lab-admin"];
    if (STAFF_ROLES.includes(user.role)) {
      // Check approval status
      if (user.approvalStatus === "pending") {
        router.replace("/login");
        return;
      }
      if (user.approvalStatus === "rejected") {
        router.replace("/login");
        return;
      }
      if (user.approvalStatus === "suspended" || user.approvalStatus === undefined) {
        // User is approved but may be suspended via accountStatus
        // approvalStatus undefined means mock user — allow through
      }

      // Profile completion check — for all staff roles
      const PROFILE_PATHS: Record<string, string> = {
        "doctor": "/doctor/profile",
        "reception-admin": "/reception-admin/profile",
        "lab-admin": "/lab-admin/profile",
      };
      if (user.profileCompleted === false) {
        const profilePath = PROFILE_PATHS[user.role];
        if (profilePath && pathname !== profilePath) {
          router.replace(profilePath);
        }
      }
    }
  }, [isLoading, isAuthenticated, user, allowedRole, router, pathname]);

  if (isLoading) return <LoadingScreen />;

  if (!isAuthenticated || !user || user.role !== allowedRole) {
    return <LoadingScreen />;
  }

  return <>{children}</>;
}
