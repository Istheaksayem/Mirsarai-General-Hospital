/**
 * Frontend API Service Layer
 *
 * Current state: fetching from /data/*.json (static mock files)
 * Future state: fetch from NEXT_PUBLIC_API_URL (real backend)
 *
 * To switch to real backend:
 * 1. Set NEXT_PUBLIC_API_URL in .env.local
 * 2. Replace fetchFromJson() calls with fetchFromApi() calls per function
 */

export const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";

// ── Base fetcher: static JSON files (current mock) ────────────────────────────
async function fetchFromJson<T>(path: string): Promise<T> {
  const res = await fetch(`/data/${path}`, { cache: "no-store" });
  if (!res.ok) throw new Error(`Failed to fetch /data/${path}: ${res.statusText}`);
  return res.json();
}

// ── Base fetcher: real backend API (future) ───────────────────────────────────
async function fetchFromApi<T>(endpoint: string): Promise<T> {
  const res = await fetch(`${API_URL}/${endpoint}`, {
    cache: "no-store",
    headers: { "Content-Type": "application/json" },
  });
  if (!res.ok) throw new Error(`API error [${endpoint}]: ${res.statusText}`);
  const json = await res.json();
  return json.data as T;
}

// ── Homepage sections ─────────────────────────────────────────────────────────
// Currently: /data/homepage.json
// Future:    GET /api/v1/cms/homepage
export async function fetchHomepage() {
  return fetchFromJson("homepage.json");
}

// ── Hero section ──────────────────────────────────────────────────────────────
// Currently: /data/hero.json
// Future:    GET /api/v1/cms/hero
export async function fetchHero() {
  return fetchFromJson("hero.json");
}

// ── Services section ──────────────────────────────────────────────────────────
// Currently: /data/services.json
// Future:    GET /api/v1/services
export async function fetchServices() {
  return fetchFromJson("services.json");
}

// ── Doctors (public list) ─────────────────────────────────────────────────────
// Live: GET /api/v1/doctors — falls back to /data/doctors.json on error
export async function fetchDoctors() {
  try {
    return await fetchFromApi("doctors");
  } catch {
    return fetchFromJson("doctors.json");
  }
}

// ── Departments (public list) ─────────────────────────────────────────────────
// Live: GET /api/v1/departments — falls back to /data/departments.json on error
export async function fetchDepartments() {
  try {
    return await fetchFromApi("departments");
  } catch {
    return fetchFromJson("departments.json");
  }
}

// ── About data ────────────────────────────────────────────────────────────────
// Currently: /data/aboutData.json
// Future:    GET /api/v1/cms/about
export async function fetchAboutData() {
  return fetchFromJson("aboutData.json");
}

// ─────────────────────────────────────────────────────────────────────────────
// Dashboard mock data (keep as-is — admin panel uses these)
// ─────────────────────────────────────────────────────────────────────────────

export async function fetchDashboard(role: string) {
  const fileMap: Record<string, string> = {
    "super-admin": "super-admin.json",
    "reception-admin": "reception-admin.json",
    reception: "reception-admin.json",
    "lab-admin": "lab-admin.json",
    lab: "lab-admin.json",
    doctor: "doctor.json",
  };
  const filename = fileMap[role] ?? "super-admin.json";
  const res = await fetch(`/mock-data/dashboard/${filename}`, { cache: "no-store" });
  if (!res.ok) throw new Error(`Failed to fetch dashboard data for role: ${role}`);
  return res.json();
}

export async function fetchPatients() {
  const res = await fetch("/mock-data/patients.json", { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch patients list");
  return res.json();
}

export async function fetchAppointments() {
  const res = await fetch("/mock-data/appointments.json", { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch appointments list");
  return res.json();
}

export async function fetchReports() {
  const res = await fetch("/mock-data/reports.json", { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch reports list");
  return res.json();
}

export async function fetchNotifications() {
  const res = await fetch("/mock-data/notifications.json", { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch notifications");
  return res.json();
}

export async function fetchRoles() {
  const res = await fetch("/mock-data/roles.json", { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch roles");
  return res.json();
}

export async function fetchActivities() {
  const res = await fetch("/mock-data/activities.json", { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch activities");
  return res.json();
}

export async function fetchWebsiteContent() {
  const res = await fetch("/mock-data/website-content.json", { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch website CMS content");
  return res.json();
}

// ── Patient Token Helper ───────────────────────────────────────────────────────
function getPatientToken(): string {
  if (typeof window === 'undefined') return '';
  try {
    return sessionStorage.getItem('mgh_patient_token') || '';
  } catch { return ''; }
}

async function patientFetch<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const token = getPatientToken();
  const res = await fetch(`${API_URL}/${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...((options?.headers as Record<string, string>) || {}),
    },
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: `API error [${endpoint}]` }));
    throw new Error(err.message || `API error [${endpoint}]`);
  }
  const json = await res.json();
  return json.data as T;
}

// ── Patient Portal API ─────────────────────────────────────────────────────────
export interface PatientProfileData {
  _id: string;
  patientId: string;
  fullName: string;
  mobile: string;
  email: string;
  dateOfBirth?: string;
  age?: number;
  gender?: string;
  bloodGroup?: string;
  address?: string;
  emergencyContact?: string;
  allergies?: string;
  medicalConditions?: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export type PatientAppointment = Record<string, unknown>;

export interface PatientDocument {
  _id: string;
  patientId: string;
  documentType: 'prescription' | 'diagnostic_report' | 'admission_form' | 'discharge_summary' | 'certificate' | 'bill_receipt' | 'other';
  title: string;
  department?: string;
  fileUrl: string;
  uploadedBy: { _id?: string; id?: string; role: string; fullName?: string };
  notes?: string;
  isDeleted: boolean;
  date: string;
  createdAt: string;
  updatedAt: string;
}

export type PatientNotification = Record<string, unknown>;
export type PatientTimelineItem = Record<string, unknown>;

export async function patientAuthSendOtp(email: string) {
  const res = await fetch(`${API_URL}/patient/auth/send-otp`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email }),
  });
  return res.json();
}

export async function patientAuthVerifyOtp(email: string, otp: string) {
  const res = await fetch(`${API_URL}/patient/auth/verify-otp`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, otp }),
  });
  return res.json();
}

export async function patientAuthRegister(data: {
  fullName: string;
  email: string;
  mobile: string;
  dateOfBirth?: string;
  gender?: string;
  bloodGroup?: string;
  address?: string;
}) {
  const res = await fetch(`${API_URL}/patient/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return res.json();
}

export function patientGetProfile() {
  return patientFetch<PatientProfileData>('patient/profile');
}

export function patientUpdateProfile(data: Record<string, unknown>) {
  return patientFetch<PatientProfileData>('patient/profile', {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export function patientGetAppointments() {
  return patientFetch<PatientAppointment[]>('patient/appointments');
}

export function patientCreateAppointment(data: Record<string, unknown>) {
  return patientFetch<PatientAppointment>('patient/appointments', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export function patientGetDocuments() {
  return patientFetch<PatientDocument[]>('patient/documents');
}

export function patientGetDocumentFileUrl(docId: string) {
  return `${API_URL}/patient/documents/${docId}/file`;
}

export async function patientFetchDocumentFile(docId: string): Promise<{ blob: Blob; filename: string }> {
  const token = getPatientToken();
  const res = await fetch(`${API_URL}/patient/documents/${docId}/file`, {
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: 'Failed to fetch document' }));
    throw new Error(err.message || 'Failed to fetch document');
  }
  const blob = await res.blob();
  const disposition = res.headers.get('Content-Disposition') || '';
  const match = disposition.match(/filename="?(.+?)"?$/);
  const filename = match ? match[1] : 'document';
  return { blob, filename };
}

export function patientGetNotifications() {
  return patientFetch<PatientNotification[]>('patient/notifications');
}

export function patientMarkNotificationRead(id: string) {
  return patientFetch<PatientNotification>(`patient/notifications/${id}/read`, {
    method: 'PATCH',
  });
}

export function patientMarkAllNotificationsRead() {
  return patientFetch<null>('patient/notifications/read-all', {
    method: 'PATCH',
  });
}

export function patientGetTimeline() {
  return patientFetch<PatientTimelineItem[]>('patient/timeline');
}

// ── Appointment submission ─────────────────────────────────────────────────────
export interface AppointmentSubmitData {
  patientName: string;
  patientPhone: string;
  patientEmail?: string;
  patientAge?: number;
  patientGender?: string;
  doctor: string;
  department?: string;
  service?: string;
  date: string;
  time: string;
  reason?: string;
}

export async function submitAppointment(data: AppointmentSubmitData) {
  const res = await fetch(`${API_URL}/appointments`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: "Failed to book appointment" }));
    throw new Error(err.message || "Failed to book appointment");
  }
  const json = await res.json();
  return json.data;
}
