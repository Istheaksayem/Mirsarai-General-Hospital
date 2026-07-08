"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
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

  useEffect(() => {
    if (isLoading) return;

    if (!isAuthenticated || !user) {
      router.replace("/login");
      return;
    }

    if (user.role !== allowedRole) {
      // Redirect to their own dashboard
      router.replace(ROLE_ROUTES[user.role]);
    }
  }, [isLoading, isAuthenticated, user, allowedRole, router]);

  if (isLoading) return <LoadingScreen />;

  if (!isAuthenticated || !user || user.role !== allowedRole) {
    return <LoadingScreen />;
  }

  return <>{children}</>;
}
