import { LoginCredentials, Role, User } from "@/types/auth";

// Mock users database — replace with real API later
const MOCK_USERS: Array<User & { password: string }> = [
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
  },
];

export interface MockAuthResult {
  success: boolean;
  user?: User;
  error?: string;
}

export async function mockLogin(
  credentials: LoginCredentials
): Promise<MockAuthResult> {
  // Simulate network delay
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
