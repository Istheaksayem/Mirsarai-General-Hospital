import { User } from "@/types/auth";

const AUTH_KEY = "mgh_admin_user";

export function storeUser(user: User): void {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(AUTH_KEY, JSON.stringify(user));
}

export function retrieveUser(): User | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(AUTH_KEY);
    return raw ? (JSON.parse(raw) as User) : null;
  } catch {
    return null;
  }
}

export function clearUser(): void {
  if (typeof window === "undefined") return;
  sessionStorage.removeItem(AUTH_KEY);
}
