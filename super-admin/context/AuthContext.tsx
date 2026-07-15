"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { useRouter } from "next/navigation";
import { AuthState, LoginCredentials, ROLE_ROUTES, Role, User } from "@/types/auth";
import { mockLogin, ROLE_MAP } from "@/lib/mock-auth";
import { clearUser, retrieveUser, storeUser } from "@/lib/auth-storage";
import { fetchCurrentUser } from "@/lib/services/api";

interface AuthContextValue extends AuthState {
  login: (credentials: LoginCredentials) => Promise<{ error?: string }>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Rehydrate from sessionStorage on mount
  useEffect(() => {
    const stored = retrieveUser();
    if (stored) setUser(stored);
    setIsLoading(false);
  }, []);

  const login = useCallback(
    async (credentials: LoginCredentials): Promise<{ error?: string }> => {
      setIsLoading(true);
      try {
        const result = await mockLogin(credentials);
        if (!result.success || !result.user) {
          return { error: result.error ?? "Login failed." };
        }
        storeUser(result.user);
        setUser(result.user);
        router.push(ROLE_ROUTES[result.user.role]);
        return {};
      } finally {
        setIsLoading(false);
      }
    },
    [router]
  );

  const refreshUser = useCallback(async () => {
    const current = retrieveUser();
    if (!current?.token) return;
    try {
      const backendUser = await fetchCurrentUser(current.token);
      const frontendRole: Role = ROLE_MAP[backendUser.role] || backendUser.role;
      const updated: User = {
        ...current,
        name: backendUser.fullName ?? current.name,
        email: backendUser.email ?? current.email,
        role: frontendRole,
        approvalStatus: backendUser.approvalStatus,
        profileCompleted: backendUser.profileCompleted,
      };
      storeUser(updated);
      setUser(updated);
    } catch {
      // Silently fail — user can still use the app with stale data
    }
  }, []);

  const logout = useCallback(() => {
    clearUser();
    setUser(null);
    router.push("/login");
  }, [router]);

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated: !!user, isLoading, login, logout, refreshUser }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}
