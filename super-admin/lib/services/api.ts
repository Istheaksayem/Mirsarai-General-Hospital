// ─── Types ────────────────────────────────────────────────────────────────────

export interface Patient {
  id: string; name: string; age: number; gender: "Male" | "Female";
  phone: string; email?: string; address: string; bloodGroup: string;
  registrationDate: string; status: "active" | "inactive" | "admitted";
  lastVisit?: string; doctor?: string; department?: string; diagnosis?: string;
}

export interface Doctor {
  id: string; name: string; specialization: string; department: string;
  qualification: string; experience: number; phone: string; email: string;
  status: "active" | "on-leave" | "inactive"; patientsCount: number;
  appointmentsToday: number; joinDate: string; availableDays: string[];
  consultationFee: number;
}

export interface Department {
  id: string; name: string; code: string; headOfDepartment: string;
  staffCount: number; bedsCount: number; activePatients: number;
  status: "active" | "inactive"; description: string; location: string;
  phone: string; establishedYear: number;
}

export interface Appointment {
  id: string; patientId: string; patientName: string; patientAge: number;
  patientGender: string; doctorId: string; doctorName: string; department: string;
  date: string; time: string; status: "confirmed" | "pending" | "completed" | "cancelled";
  type: "new" | "follow-up" | "consultation"; reason: string; notes: string;
}

export interface Invoice {
  id: string; patientId: string; patientName: string; date: string; dueDate: string;
  services: { name: string; quantity: number; rate: number; total: number }[];
  subtotal: number; discount: number; tax: number; total: number;
  paid: number; due: number; status: "paid" | "partial" | "unpaid";
  paymentMethod: string | null; notes: string;
}

export interface Report {
  id: string; patientId: string; patientName: string; reportType: string;
  testName: string; status: "pending" | "in-progress" | "completed";
  requestedBy: string; department: string; requestDate: string;
  completedDate: string | null; results: Record<string, string> | null; notes: string;
}

export interface Notification {
  id: string; title: string; description: string; type: string;
  priority: "low" | "medium" | "high" | "urgent"; read: boolean;
  timestamp: string; actionUrl: string;
}

export interface RoleData {
  id: string; name: string; key: string; description: string;
  userCount: number; permissions: string[]; isSystem: boolean;
  createdAt: string; updatedAt: string;
}

export interface Activity {
  id: string; userId: string; userName: string; userRole: string;
  action: string; resourceType: string; resourceId: string;
  description: string; timestamp: string; ipAddress: string;
  metadata: Record<string, unknown>;
}

export interface WebsiteContent {
  hero: Record<string, unknown>; about: Record<string, unknown>;
  stats: Record<string, number>;
  services: { id: string; title: string; icon: string; description: string; isActive: boolean; order: number }[];
  contact: Record<string, unknown>;
  notices: { id: string; title: string; content: string; isActive: boolean; publishedAt: string }[];
}

export interface LabTest {
  id: string; name: string; category: string; turnaroundTime: string;
  price: number; description: string; status: "active" | "inactive";
  tests_included: string[];
}

export interface Prescription {
  id: string; patientId: string; patientName: string; doctorId: string;
  doctorName: string; appointmentId: string; date: string; diagnosis: string;
  medications: { name: string; dosage: string; frequency: string; duration: string; instructions: string }[];
  instructions: string; followUp: string; status: "active" | "expired";
}

export type DashboardRole = "super-admin" | "reception-admin" | "lab-admin" | "doctor";

// ─── API Error ───────────────────────────────────────────────────────────────

export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = "ApiError";
  }
}

// ─── Base Fetcher ─────────────────────────────────────────────────────────────

async function fetchMock<T>(path: string): Promise<T> {
  const res = await fetch(`/mock-data/${path}`, { cache: "no-store" });
  if (!res.ok) throw new ApiError(res.status, `Failed to fetch ${path}: ${res.statusText}`);
  return res.json() as Promise<T>;
}

// ─── API Functions ────────────────────────────────────────────────────────────

export const getDashboardStats = (role: DashboardRole) =>
  fetchMock<Record<string, unknown>>(`dashboard/${role}.json`);

export const getPatients = () => fetchMock<Patient[]>("patients.json");
export const getDoctors = () => fetchMock<Doctor[]>("doctors.json");
export const getDepartments = () => fetchMock<Department[]>("departments.json");
export const getAppointments = () => fetchMock<Appointment[]>("appointments.json");
export const getBilling = () => fetchMock<Invoice[]>("billing.json");
export const getReports = () => fetchMock<Report[]>("reports.json");
export const getNotifications = () => fetchMock<Notification[]>("notifications.json");
export const getRoles = () => fetchMock<RoleData[]>("roles.json");
export const getActivities = () => fetchMock<Activity[]>("activities.json");
export const getWebsiteContent = () => fetchMock<WebsiteContent>("website-content.json");
export const getLabTests = () => fetchMock<LabTest[]>("lab-tests.json");
export const getPrescriptions = () => fetchMock<Prescription[]>("prescriptions.json");
