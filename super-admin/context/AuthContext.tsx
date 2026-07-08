"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { useRouter } from "next/navigation";
import { AuthState, LoginCredentials, ROLE_ROUTES, User } from "@/types/auth";
import { mockLogin } from "@/lib/mock-auth";
import { clearUser, retrieveUser, storeUser } from "@/lib/auth-storage";

interface AuthContextValue extends AuthState {
  login: (credentials: LoginCredentials) => Promise<{ error?: string }>;
  logout: () => void;
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

  const logout = useCallback(() => {
    clearUser();
    setUser(null);
    router.push("/login");
  }, [router]);

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated: !!user, isLoading, login, logout }}
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
