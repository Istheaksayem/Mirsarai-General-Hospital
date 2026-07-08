export type Role = "super-admin" | "reception-admin" | "lab-admin" | "doctor";

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  avatar?: string;
  department?: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export const ROLE_ROUTES: Record<Role, string> = {
  "super-admin": "/super-admin",
  "reception-admin": "/reception-admin",
  "lab-admin": "/lab-admin",
  doctor: "/doctor",
};

export const ROLE_LABELS: Record<Role, string> = {
  "super-admin": "Super Admin",
  "reception-admin": "Reception Admin",
  "lab-admin": "Lab Admin",
  doctor: "Doctor",
};

export const ROLE_COLORS: Record<Role, string> = {
  "super-admin": "bg-[#1E2B7A] text-white",
  "reception-admin": "bg-emerald-600 text-white",
  "lab-admin": "bg-violet-600 text-white",
  doctor: "bg-[#76BC21] text-white",
};
