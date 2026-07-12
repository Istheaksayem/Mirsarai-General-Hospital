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

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";

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
