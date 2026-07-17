import { LoginCredentials, Role, User } from "@/types/auth";
import { env } from "@/config/env";

const BACKEND_URL = env.apiUrl;

// Mock users database — only available when ENABLE_MOCK_AUTH is true
const MOCK_USERS: Array<User & { password: string }> = env.enableMockAuth
  ? [
      {
        id: "1",
        name: "Arif Hossain",
        email: "superadmin@mgh.com",
        password: "admin123",
        role: "super-admin",
        avatar: "",
        department: "Administration",
      },
      {
        id: "2",
        name: "Fatema Khatun",
        email: "reception@mgh.com",
        password: "admin123",
        role: "reception-admin",
        avatar: "",
        department: "Reception",
      },
      {
        id: "3",
        name: "Rahim Uddin",
        email: "lab@mgh.com",
        password: "admin123",
        role: "lab-admin",
        avatar: "",
        department: "Laboratory",
      },
      {
        id: "4",
        name: "Dr. Nasrin Begum",
        email: "doctor@mgh.com",
        password: "admin123",
        role: "doctor",
        avatar: "",
        department: "General Medicine",
        doctorRef: "doc_nasrin_id",
      },
    ]
  : [];

// Map backend roles to frontend roles
export const ROLE_MAP: Record<string, Role> = {
  superadmin: "super-admin",
  "super-admin": "super-admin",
  doctor: "doctor",
  reception: "reception-admin",
  "reception-admin": "reception-admin",
  lab: "lab-admin",
  "lab-admin": "lab-admin",
};

export interface MockAuthResult {
  success: boolean;
  user?: User;
  error?: string;
}

export async function mockLogin(
  credentials: LoginCredentials
): Promise<MockAuthResult> {
  // Try real backend first
  try {
    const res = await fetch(`${BACKEND_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: credentials.email,
        password: credentials.password,
      }),
    });

    const data = await res.json();

    if (!res.ok && data?.message) {
      return { success: false, error: data.message };
    }

    if (res.ok && data.success && data.data?.user) {
      const backendUser = data.data.user;
      const frontendRole = ROLE_MAP[backendUser.role] || backendUser.role;

      return {
        success: true,
        user: {
          id: backendUser._id,
          name: backendUser.fullName,
          email: backendUser.email,
          role: frontendRole as Role,
          token: data.data.token,
          approvalStatus: backendUser.approvalStatus,
          profileCompleted: backendUser.profileCompleted,
        },
      };
    }
  } catch {
    // Backend unavailable, fall through to mock
  }

  // Simulate network delay for mock fallback
  await new Promise((r) => setTimeout(r, 900));

  const found = MOCK_USERS.find(
    (u) =>
      u.email.toLowerCase() === credentials.email.toLowerCase() &&
      u.password === credentials.password
  );

  if (!found) {
    return { success: false, error: "Invalid email or password." };
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { password: _pw, ...user } = found;
  return { success: true, user };
}

export function getMockUser(role: Role): User {
  const user = MOCK_USERS.find((u) => u.role === role);
  if (!user) throw new Error(`No mock user for role: ${role}`);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { password: _pw, ...safeUser } = user;
  return safeUser;
}
