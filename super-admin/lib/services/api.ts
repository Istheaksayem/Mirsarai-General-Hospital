// ─── Types ────────────────────────────────────────────────────────────────────

export interface Patient {
  id: string; name: string; age: number; gender: "Male" | "Female";
  phone: string; email?: string; address: string; bloodGroup: string;
  registrationDate: string; status: "active" | "inactive" | "admitted";
  lastVisit?: string; doctor?: string; department?: string; diagnosis?: string;
}

export interface RealPatient {
  _id: string;
  patientId: string;
  fullName: string;
  mobile: string;
  email?: string;
  dateOfBirth?: string;
  age?: number;
  gender?: string;
  bloodGroup?: string;
  address?: string;
  status: "active" | "inactive" | "admitted";
  diagnosis?: string;
  department?: string;
  isActive: boolean;
  emergencyContact?: string;
  allergies?: string;
  medicalConditions?: string;
  createdBy?: { _id: string; fullName: string };
  createdAt: string;
  updatedAt: string;
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
  errors?: { field: string; message: string }[];
  constructor(public status: number, message: string, errors?: { field: string; message: string }[]) {
    super(message);
    this.name = "ApiError";
    this.errors = errors;
  }
}

export function formatApiError(err: ApiError): string {
  if (err.errors && err.errors.length > 0) {
    return err.errors.map((e) => e.message).join("; ");
  }
  return err.message || "Something went wrong";
}

// ─── Image URL Normalization ──────────────────────────────────────────────────

import { getImageUrl } from '../getImageUrl';

function normalizeImages(obj: unknown): unknown {
  if (typeof obj === 'string') return getImageUrl(obj);
  if (Array.isArray(obj)) return obj.map(normalizeImages);
  if (obj && typeof obj === 'object') {
    const result: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(obj as Record<string, unknown>)) {
      result[key] = normalizeImages(value);
    }
    return result;
  }
  return obj;
}

// ─── Base Fetcher ─────────────────────────────────────────────────────────────

const MOCK_BASE = "/mock-data";

async function fetchMock<T>(path: string): Promise<T> {
  const res = await fetch(`${MOCK_BASE}/${path}`, { cache: "no-store" });
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

// ─── Lab Reports Real API ─────────────────────────────────────────────────────

export interface LabReportData {
  _id: string;
  patientId: string;
  testName: string;
  reportType: string;
  requestingDoctor: string;
  fileUrl: string;
  status: "pending" | "completed";
  uploadedBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface LabReportListResponse {
  data: LabReportData[];
  total: number;
}

// ─── Patient Management (super-admin) ────────────────────────────────────────

export interface PaginatedPatients {
  data: RealPatient[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export const getPatientsReal = (params?: Record<string, string>) => {
  const q = params ? '?' + new URLSearchParams(params).toString() : '';
  return fetchAdminReal<PaginatedPatients>(`admin/patients${q}`);
};

export const getPatientById = (id: string) =>
  fetchAdminReal<{ data: RealPatient }>(`admin/patients/${id}`);

export const createPatient = (data: Partial<RealPatient>) =>
  mutateAdminReal<RealPatient>('admin/patients', data, 'POST');

export const updatePatient = (id: string, data: Partial<RealPatient>) =>
  mutateAdminReal<RealPatient>(`admin/patients/${id}`, data, 'PUT');

export const deletePatient = (id: string) =>
  mutateAdminReal<null>(`admin/patients/${id}`, undefined, 'DELETE');

// ─── Reception Patient API ───────────────────────────────────────────────────

export const registerPatientReception = (data: {
  fullName: string;
  mobile: string;
  email?: string;
  dateOfBirth?: string;
  gender?: string;
  bloodGroup?: string;
  address?: string;
  department?: string;
}) => mutateAdminReal<RealPatient>('reception/patients/register', data, 'POST');

export const searchPatients = (query: string) =>
  fetchAdminReal<RealPatient[]>(`reception/patients/search?q=${encodeURIComponent(query)}`);

// ─── Reception Appointments API ──────────────────────────────────────────────

export const getReceptionAppointments = (params?: Record<string, string>) => {
  const q = params ? '?' + new URLSearchParams(params).toString() : '';
  return fetchAdminReal<{ data: unknown[]; total: number; page: number; limit: number }>(`reception/appointments${q}`);
};

export const updateAppointmentStatus = (id: string, status: string) =>
  mutateAdminReal<unknown>(`reception/appointments/${id}/status`, { status }, 'PATCH');

// ─── Lab Document API ────────────────────────────────────────────────────────

export const lookupPatient = (query: string) =>
  fetchAdminReal<{ data: RealPatient[] }>(`patients/lookup?q=${encodeURIComponent(query)}`)
    .then(res => res.data);

export const uploadDocument = (formData: FormData) => {
  const headers: Record<string, string> = {};
  if (typeof window !== 'undefined') {
    try {
      const raw = sessionStorage.getItem('mgh_admin_user');
      if (raw) { const user = JSON.parse(raw); if (user.token) headers['Authorization'] = `Bearer ${user.token}`; }
    } catch {}
  }
  return fetch(`${BACKEND_API}/lab/documents`, {
    method: 'POST',
    headers,
    body: formData,
  }).then(async (res) => {
    if (!res.ok) {
      const errorText = await res.text();
      let errorMessage = 'Failed to upload document';
      try { const parsed = JSON.parse(errorText); errorMessage = parsed.message || errorMessage; } catch {}
      throw new ApiError(res.status, errorMessage);
    }
    return res.json();
  });
};

export const getDocuments = (params?: Record<string, string>) => {
  const q = params ? '?' + new URLSearchParams(params).toString() : '';
  return fetchAdminReal<{ data: unknown[]; total: number }>(`lab/documents${q}`);
};

export const deleteDocument = (id: string) =>
  mutateAdminReal<null>(`lab/documents/${id}`, undefined, 'DELETE');

// ─── Patient Portal API ──────────────────────────────────────────────────────

export const patientSendOtp = (email: string) =>
  fetch(`${BACKEND_API}/patient/auth/send-otp`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email }),
  }).then((r) => r.json());

export const patientVerifyOtp = (email: string, otp: string) =>
  fetch(`${BACKEND_API}/patient/auth/verify-otp`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, otp }),
  }).then((r) => r.json());

export const patientRegister = (data: {
  fullName: string;
  email: string;
  mobile: string;
  dateOfBirth?: string;
  gender?: string;
  bloodGroup?: string;
  address?: string;
}) =>
  fetch(`${BACKEND_API}/patient/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  }).then((r) => r.json());

export const patientGetProfile = (token: string) =>
  fetch(`${BACKEND_API}/patient/profile`, {
    headers: { Authorization: `Bearer ${token}` },
  }).then((r) => r.json());

export const patientUpdateProfile = (token: string, data: Record<string, unknown>) =>
  fetch(`${BACKEND_API}/patient/profile`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify(data),
  }).then((r) => r.json());

export const patientGetAppointments = (token: string) =>
  fetch(`${BACKEND_API}/patient/appointments`, {
    headers: { Authorization: `Bearer ${token}` },
  }).then((r) => r.json());

export const patientCreateAppointment = (token: string, data: Record<string, unknown>) =>
  fetch(`${BACKEND_API}/patient/appointments`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify(data),
  }).then((r) => r.json());

export const patientGetDocuments = (token: string) =>
  fetch(`${BACKEND_API}/patient/documents`, {
    headers: { Authorization: `Bearer ${token}` },
  }).then((r) => r.json());

export const patientGetNotifications = (token: string) =>
  fetch(`${BACKEND_API}/patient/notifications`, {
    headers: { Authorization: `Bearer ${token}` },
  }).then((r) => r.json());

export const patientMarkNotificationRead = (token: string, id: string) =>
  fetch(`${BACKEND_API}/patient/notifications/${id}/read`, {
    method: 'PATCH',
    headers: { Authorization: `Bearer ${token}` },
  }).then((r) => r.json());

export const patientMarkAllNotificationsRead = (token: string) =>
  fetch(`${BACKEND_API}/patient/notifications/read-all`, {
    method: 'PATCH',
    headers: { Authorization: `Bearer ${token}` },
  }).then((r) => r.json());

export const patientGetTimeline = (token: string) =>
  fetch(`${BACKEND_API}/patient/timeline`, {
    headers: { Authorization: `Bearer ${token}` },
  }).then((r) => r.json());

// ─── Lab Reports (existing) ─────────────────────────────────────────────────
export const getLabReports = () => fetchAdminReal<{ data: LabReportData[] }>("lab-reports");

// Get single lab report by ID
export const getLabReportById = (id: string) => fetchAdminReal<{ data: LabReportData }>(`lab-reports/${id}`);

// Update lab report status
export const updateLabReportStatus = (id: string, status: "pending" | "completed") =>
  mutateAdminReal<LabReportData>(`lab-reports/${id}/status`, { status }, "PATCH");

// Delete lab report
export const deleteLabReport = (id: string) =>
  mutateAdminReal<null>(`lab-reports/${id}`, undefined, "DELETE");

// Download lab report
export const downloadLabReport = (id: string) =>
  fetchAdminReal<{ data: { fileUrl: string; testName: string } }>(`lab-reports/${id}/download`);

// Upload new lab report
export const uploadLabReport = (formData: FormData) => {
  const headers: Record<string, string> = {};
  if (typeof window !== 'undefined') {
    try {
      const raw = sessionStorage.getItem('mgh_admin_user');
      if (raw) { const user = JSON.parse(raw); if (user.token) headers['Authorization'] = `Bearer ${user.token}`; }
    } catch {}
  }
  return fetch(`${BACKEND_API}/lab-reports/upload`, {
    method: "POST",
    headers,
    body: formData,
  }).then(async (res) => {
    if (!res.ok) {
      const errorText = await res.text();
      let errorMessage = "Failed to upload report";
      try {
        const parsed = JSON.parse(errorText);
        errorMessage = parsed.message || errorMessage;
      } catch { }
      throw new ApiError(res.status, errorMessage);
    }
    return res.json();
  });
};

// Get recent lab reports
export const getRecentLabReports = () => fetchAdminReal<{ data: LabReportData[] }>("lab-reports/recent");
export const getNotifications = () => fetchMock<Notification[]>("notifications.json");
export const getRoles = () => fetchMock<RoleData[]>("roles.json");
export const getActivities = () => fetchMock<Activity[]>("activities.json");
export const getWebsiteContent = () => fetchMock<WebsiteContent>("website-content.json");
export const getLabTests = () => fetchMock<LabTest[]>("lab-tests.json");
export const getPrescriptions = () => fetchMock<Prescription[]>("prescriptions.json");

// ─── Real Backend APIs (Homepage & Hero CMS) ───────────────────────────

export interface LocalizedString {
  en: string;
  bn: string;
}

export interface LinkButton {
  en: string;
  bn: string;
  link: string;
}

export interface StatItem {
  number: string;
  label: LocalizedString;
  icon: string;
  color: string;
}

export interface HomepageData {
  emergency: {
    phone: string;
    badge: LocalizedString;
    heading: LocalizedString;
    subheading: LocalizedString;
    description: LocalizedString;
    quickInfo: LocalizedString[];
  };
  appointmentCTA: {
    badge: LocalizedString;
    heading: LocalizedString;
    description: LocalizedString;
    primaryBtn: LinkButton;
    secondaryBtn: LinkButton;
    features: LocalizedString[];
  };
  statistics: {
    sectionBadge: LocalizedString;
    heading: LocalizedString;
    description: LocalizedString;
    stats: StatItem[];
  };
}

export interface SlideButton {
  label: LocalizedString;
  link: string;
  variant: string;
}

export interface HeroSlide {
  id?: number;
  slideNumber: string;
  heading: LocalizedString;
  description: LocalizedString;
  image: string;
  buttons: SlideButton[];
}

export interface SearchBarConfig {
  enabled: boolean;
  title: LocalizedString;
  searchPlaceholder: LocalizedString;
  locationPlaceholder: LocalizedString;
  advancedSearchLink: LocalizedString;
}

export interface JoinTeamConfig {
  enabled: boolean;
  question: LocalizedString;
  title: LocalizedString;
  buttonLabel: LocalizedString;
  buttonLink: string;
  image: string;
}

export interface ShapeConfig {
  color: string;
  size: number;
  position: Record<string, string>;
  opacity: number;
}

export interface DecorativeShapesConfig {
  enabled: boolean;
  shapes: ShapeConfig[];
}

export interface HeroData {
  slides: HeroSlide[];
  searchBar: SearchBarConfig;
  joinTeam: JoinTeamConfig;
  decorativeShapes: DecorativeShapesConfig;
}

const BACKEND_API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";

async function fetchReal<T>(path: string): Promise<T> {
  const res = await fetch(`${BACKEND_API}/${path}`, {
    cache: "no-store",
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (!res.ok) {
    const errorText = await res.text();
    let errorMessage = `Failed to fetch ${path}`;
    try {
      const parsed = JSON.parse(errorText);
      errorMessage = parsed.message || errorMessage;
    } catch { }
    throw new ApiError(res.status, errorMessage);
  }
  const result = await res.json();
  return normalizeImages(result.data) as T;
}

async function saveReal<T>(path: string, data: Partial<T>, method: "PUT" | "PATCH"): Promise<T> {
  const res = await fetch(`${BACKEND_API}/${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const errorText = await res.text();
    let errorMessage = `Failed to save ${path}`;
    try {
      const parsed = JSON.parse(errorText);
      errorMessage = parsed.message || errorMessage;
    } catch { }
    throw new ApiError(res.status, errorMessage);
  }
  const result = await res.json();
  return normalizeImages(result.data) as T;
}

export const getAdminHomepage = () => fetchReal<HomepageData>("homepage");
export const updateAdminHomepage = (data: Partial<HomepageData>, method: "PUT" | "PATCH" = "PUT") =>
  saveReal<HomepageData>("homepage", data, method);

export const getAdminHero = () => fetchReal<HeroData>("homepage/hero");
export const updateAdminHero = (data: Partial<HeroData>, method: "PUT" | "PATCH" = "PUT") =>
  saveReal<HeroData>("homepage/hero", data, method);

// ─── About CMS Types ───────────────────────────────────────────────────

export interface SectionConfig {
  isVisible: boolean;
  order: number;
}

export interface SeoConfig {
  metaTitle: LocalizedString;
  metaDescription: LocalizedString;
  keywords: LocalizedString;
  ogImage: string;
}

export interface AboutUsStat {
  title: LocalizedString;
  value: string;
}

export interface AboutUsData {
  _id?: string;
  title: LocalizedString;
  subtitle: LocalizedString;
  description: LocalizedString;
  content: LocalizedString[];
  statistics: AboutUsStat[];
  image: string;
  features: LocalizedString[];
  sections: Record<string, SectionConfig>;
  seo: SeoConfig;
  createdBy?: string;
  updatedBy?: string;
}

export interface CoreValue {
  title: LocalizedString;
  description: LocalizedString;
}

export interface MissionVisionData {
  _id?: string;
  title: LocalizedString;
  mission: { title: LocalizedString; description: LocalizedString };
  vision: { title: LocalizedString; description: LocalizedString };
  coreValues: CoreValue[];
  image: string;
  sections: Record<string, SectionConfig>;
  seo: SeoConfig;
  createdBy?: string;
  updatedBy?: string;
}

export interface GalleryCategory {
  id: string;
  title: LocalizedString;
  description: LocalizedString;
}

export interface GalleryImage {
  id: number;
  category: string;
  src: string;
  title: LocalizedString;
  description: LocalizedString;
}

export interface GalleryStatItem {
  number: string;
  label: LocalizedString;
}

export interface GalleryData {
  _id?: string;
  hero: { title: LocalizedString; subtitle: LocalizedString; description: LocalizedString; image?: string };
  categories: GalleryCategory[];
  images: GalleryImage[];
  stats: { title: LocalizedString; items: GalleryStatItem[] };
  sections: Record<string, SectionConfig>;
  seo: SeoConfig;
  createdBy?: string;
  updatedBy?: string;
}

export interface CareerBenefit {
  id?: number;
  icon: string;
  title: LocalizedString;
  description: LocalizedString;
}

export interface CareerPosition {
  id: number;
  title: LocalizedString;
  department: LocalizedString;
  location: LocalizedString;
  jobType: LocalizedString;
  description: LocalizedString;
  requirements: LocalizedString;
  applyLink: string;
  bannerImage: string;
  isActive: boolean;
}

export interface CareerStep {
  id?: number;
  step: number;
  icon: string;
  title: LocalizedString;
  description: LocalizedString;
}

export interface CareerData {
  _id?: string;
  title: LocalizedString;
  description: LocalizedString;
  image: string;
  jobListings: CareerPosition[];
  sections: Record<string, SectionConfig>;
  seo: SeoConfig;
  createdBy?: string;
  updatedBy?: string;
}

// ─── About CMS API Functions ────────────────────────────────────────────

export const getAboutUs = () => fetchReal<AboutUsData>("about/us");
export const updateAboutUs = (data: Partial<AboutUsData>) => saveReal<AboutUsData>("about/us", data, "PUT");

export const getMissionVision = () => fetchReal<MissionVisionData>("about/mission-vision");
export const updateMissionVision = (data: Partial<MissionVisionData>) => saveReal<MissionVisionData>("about/mission-vision", data, "PUT");

export const getGalleryData = () => fetchReal<GalleryData>("about/gallery");
export const updateGalleryData = (data: Partial<GalleryData>) => saveReal<GalleryData>("about/gallery", data, "PUT");

export const getCareerData = () => fetchReal<CareerData>("about/career");
export const updateCareerData = (data: Partial<CareerData>) => saveReal<CareerData>("about/career", data, "PUT");

// ─── Our Team CMS Types ─────────────────────────────────────────────────

export interface OurTeamMember {
  name: LocalizedString;
  designation: LocalizedString;
  department: LocalizedString;
  bio: LocalizedString;
  image: string;
  email: string;
  phone: string;
  order: number;
}

export interface OurTeamCustomSection {
  id: string;
  title: LocalizedString;
  description: LocalizedString;
  image: string;
  order: number;
}

export interface OurTeamData {
  _id?: string;
  hero: {
    title: LocalizedString;
    subtitle: LocalizedString;
    description: LocalizedString;
    image: string;
  };
  sectionTitle: LocalizedString;
  sectionDescription: LocalizedString;
  members: OurTeamMember[];
  customSections?: OurTeamCustomSection[];
  sections: Record<string, SectionConfig>;
  seo: SeoConfig;
  createdBy?: string;
  updatedBy?: string;
}

export const getOurTeamData = () => fetchReal<OurTeamData>("about/our-team");
export const updateOurTeamData = (data: Partial<OurTeamData>) => saveReal<OurTeamData>("about/our-team", data, "PUT");

// Image upload helper
export async function uploadCmsImage(base64Data: string): Promise<string> {
  const res = await fetch(`${BACKEND_API}/about/upload`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders()
    },
    body: JSON.stringify({ base64Data }),
  });
  if (!res.ok) {
    throw new ApiError(res.status, "Failed to upload image");
  }
  const result = await res.json();
  return result.data.url;
}

// ─── Doctor CMS Types ──────────────────────────────────────────────────────────

export interface BilingualField {
  en: string;
  bn: string;
}

export interface TimeSlot {
  day: string;
  startTime: string;
  endTime: string;
  type: "online" | "offline" | "both";
}

export interface SocialLink {
  platform: string;
  url: string;
}

export interface DoctorSeo {
  metaTitle: BilingualField;
  metaDescription: BilingualField;
  keywords: string[];
}

export interface CmsDoctor {
  _id: string;
  slug: string;
  name: BilingualField;
  designation: BilingualField;
  specialization: BilingualField;
  department: BilingualField;
  qualification: string;
  experience: { years: number; label: BilingualField };
  registrationNumber: string;
  languages: string[];
  about: BilingualField;
  services: BilingualField[];
  consultationFee: number;
  chamberTime: BilingualField;
  chamberAddress: BilingualField;
  address: BilingualField;
  timeSlots: TimeSlot[];
  availableDays: string[];
  onlineConsultation: boolean;
  offlineConsultation: boolean;
  appointmentAvailable: boolean;
  phone: string;
  email: string;
  image: string;
  bannerImage: string;
  galleryImages: string[];
  patientsCount: number;
  rating: number;
  joinDate: string;
  status: "active" | "on-leave" | "inactive";
  available: boolean;
  featured: boolean;
  displayOrder: number;
  isVisible: boolean;
  seo: DoctorSeo;
  createdAt?: string;
  updatedAt?: string;
}

export interface CmsDoctorListResponse {
  doctors: CmsDoctor[];
  total: number;
  page: number;
  limit: number;
}

export interface DoctorQueryParams {
  page?: number;
  limit?: number;
  status?: string;
  department?: string;
  featured?: boolean;
  search?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

// ─── Upload API ───────────────────────────────────────────────────────────────

export async function uploadProfilePhoto(file: File): Promise<{ url: string }> {
  const formData = new FormData();
  formData.append("photo", file);

  const headers: Record<string, string> = {};
  if (typeof window !== "undefined") {
    try {
      const raw = sessionStorage.getItem("mgh_admin_user");
      if (raw) {
        const user = JSON.parse(raw);
        if (user.token) headers["Authorization"] = `Bearer ${user.token}`;
      }
    } catch {}
  }

  const res = await fetch(`${BACKEND_API}/upload/profile-photo`, {
    method: "POST",
    headers,
    body: formData,
  });

  const json = await res.json();
  if (!res.ok || !json.success) {
    const msg = json.message || "Failed to upload photo";
    throw new Error(msg);
  }
  return json.data;
}

// ─── Doctor CMS API ───────────────────────────────────────────────────────────

function getAuthHeaders(): Record<string, string> {
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (typeof window !== "undefined") {
    try {
      const raw = sessionStorage.getItem("mgh_admin_user");
      if (raw) {
        const user = JSON.parse(raw);
        if (user.token) headers["Authorization"] = `Bearer ${user.token}`;
      }
    } catch { }
  }
  return headers;
}

async function fetchAdminReal<T>(path: string): Promise<T> {
  const res = await fetch(`${BACKEND_API}/${path}`, {
    cache: "no-store",
    headers: getAuthHeaders(),
  });
  if (!res.ok) {
    const errorText = await res.text();
    let errorMessage = `Failed to fetch ${path}`;
    try { const parsed = JSON.parse(errorText); errorMessage = parsed.message || errorMessage; } catch { }
    throw new ApiError(res.status, errorMessage);
  }
  const result = await res.json();
  return normalizeImages(result) as T;
}

async function mutateAdminReal<T>(path: string, data: unknown, method: "POST" | "PUT" | "PATCH" | "DELETE" = "PUT"): Promise<T> {
  const res = await fetch(`${BACKEND_API}/${path}`, {
    method,
    headers: getAuthHeaders(),
    body: data !== undefined ? JSON.stringify(data) : undefined,
  });
  if (!res.ok) {
    const errorText = await res.text();
    let errorMessage = `Failed to ${method} ${path}`;
    try { const parsed = JSON.parse(errorText); errorMessage = parsed.message || errorMessage; } catch { }
    throw new ApiError(res.status, errorMessage);
  }
  const result = await res.json();
  return normalizeImages(result.data) as T;
}

export const getCmsDoctors = (params: DoctorQueryParams = {}) => {
  const q = new URLSearchParams(params as Record<string, string>).toString();
  return fetchAdminReal<{ data: CmsDoctor[]; total: number; page: number; limit: number; }>(`admin/doctors${q ? `?${q}` : ""}`);
};
export const getCmsDoctorById = (id: string) => fetchAdminReal<{ data: CmsDoctor }>(`admin/doctors/${id}`);
export const createCmsDoctor = (data: Partial<CmsDoctor>) => mutateAdminReal<CmsDoctor>("admin/doctors", data, "POST");
export const updateCmsDoctor = (id: string, data: Partial<CmsDoctor>) => mutateAdminReal<CmsDoctor>(`admin/doctors/${id}`, data, "PUT");
export const patchCmsDoctor = (id: string, data: Partial<CmsDoctor>) => mutateAdminReal<CmsDoctor>(`admin/doctors/${id}`, data, "PATCH");
export const deleteCmsDoctor = (id: string) => mutateAdminReal<null>(`admin/doctors/${id}`, undefined, "DELETE");
export const toggleCmsDoctorVisibility = (id: string) => mutateAdminReal<CmsDoctor>(`admin/doctors/${id}/toggle-visibility`, {}, "PATCH");
export const toggleCmsDoctorFeatured = (id: string) => mutateAdminReal<CmsDoctor>(`admin/doctors/${id}/toggle-featured`, {}, "PATCH");
export const reorderCmsDoctors = (updates: { id: string; displayOrder: number }[]) =>
  mutateAdminReal<null>("admin/doctors/reorder", updates, "PATCH");

// ─── Staff Management (super-admin) ─────────────────────────────────────────

export interface StaffMember {
  _id: string;
  fullName: string;
  email: string;
  phone: string;
  role: "admin" | "doctor" | "reception" | "lab";
  approvalStatus: "pending" | "approved" | "rejected";
  accountStatus: "active" | "inactive" | "suspended";
  isActive: boolean;
  profileCompleted: boolean;
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
  profile: Record<string, unknown> | null;
}

export const getStaffMembers = (params?: { role?: string }) => {
  const q = params?.role ? `?role=${params.role}` : "";
  return fetchAdminReal<{ data: StaffMember[] }>(`admin/staff${q}`);
};

export const getStaffMemberById = (id: string) =>
  fetchAdminReal<{ data: StaffMember }>(`admin/staff/${id}`);

export const updateStaffMember = (id: string, data: Partial<StaffMember>) =>
  mutateAdminReal<StaffMember>(`admin/staff/${id}`, data, "PUT");

export const deleteStaffMember = (id: string) =>
  mutateAdminReal<null>(`admin/staff/${id}`, undefined, "DELETE");

export const activateStaffMember = (id: string) =>
  mutateAdminReal<StaffMember>(`admin/staff/${id}/activate`, {}, "PATCH");

export const deactivateStaffMember = (id: string) =>
  mutateAdminReal<StaffMember>(`admin/staff/${id}/deactivate`, {}, "PATCH");

// ─── Doctor Self Profile (authenticated doctor) ────────────────────────────────

export interface DoctorProfileData {
  _id?: string;
  userId?: string;
  doctorCode?: string;
  department: string;
  specialization: string;
  qualification: string;
  experience: number;
  bmdcNumber: string;
  consultationFee: number;
  availableDays: string[];
  availableTimeSlots: { day: string; startTime: string; endTime: string }[];
  profilePhoto: string;
  gender: string;
  dateOfBirth?: string;
  address: string;
  biography: string;
  isDeleted?: boolean;
  createdAt?: string;
  updatedAt?: string;

  // ── New bilingual fields ────────────────────────────────────────────────
  slug?: string;
  name?: { en: string; bn: string };
  about?: { en: string; bn: string };
  chamberTime?: { en: string; bn: string };
  chamberAddress?: { en: string; bn: string };
  services?: { en: string; bn: string }[];
  languages?: string[];
  onlineConsultation?: boolean;
  offlineConsultation?: boolean;
  appointmentAvailable?: boolean;
  available?: boolean;
  image?: string;
}

function getDoctorAuthHeaders(): Record<string, string> {
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (typeof window !== "undefined") {
    try {
      const raw = sessionStorage.getItem("mgh_admin_user");
      if (raw) {
        const user = JSON.parse(raw);
        if (user.token) headers["Authorization"] = `Bearer ${user.token}`;
      }
    } catch { }
  }
  return headers;
}

async function fetchDoctorProfile<T>(path: string): Promise<T> {
  const res = await fetch(`${BACKEND_API}/${path}`, {
    cache: "no-store",
    headers: getDoctorAuthHeaders(),
  });
  if (!res.ok) {
    const errorText = await res.text();
    let errorMessage = `Failed to fetch ${path}`;
    try { const parsed = JSON.parse(errorText); errorMessage = parsed.message || errorMessage; } catch { }
    throw new ApiError(res.status, errorMessage);
  }
  const result = await res.json();
  return normalizeImages(result.data) as T;
}

async function updateDoctorProfile<T>(path: string, data: unknown): Promise<T> {
  const res = await fetch(`${BACKEND_API}/${path}`, {
    method: "PUT",
    headers: getDoctorAuthHeaders(),
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const errorText = await res.text();
    let errorMessage = `Failed to update ${path}`;
    try { const parsed = JSON.parse(errorText); errorMessage = parsed.message || errorMessage; } catch { }
    throw new ApiError(res.status, errorMessage);
  }
  const result = await res.json();
  return normalizeImages(result.data) as T;
}

export const getMyDoctorProfile = () =>
  fetchDoctorProfile<DoctorProfileData>("doctors/me");

export const updateMyDoctorProfile = (data: Partial<DoctorProfileData>) =>
  updateDoctorProfile<DoctorProfileData>("doctors/me", data);

// ─── Receptionist Self Profile ────────────────────────────────────────────

export interface ReceptionistProfileData {
  _id?: string;
  userId?: string;
  receptionistCode?: string;
  department: string;
  designation: string;
  branch: string;
  employmentType: string;
  profilePhoto: string;
  gender: string;
  dateOfBirth?: string;
  address: string;
  emergencyContact: string;
  createdAt?: string;
  updatedAt?: string;
}

export const getMyReceptionistProfile = () =>
  fetchDoctorProfile<ReceptionistProfileData>("receptionists/me");

export const updateMyReceptionistProfile = (data: Partial<ReceptionistProfileData>) =>
  updateDoctorProfile<ReceptionistProfileData>("receptionists/me", data);

// ─── Lab Admin Self Profile ───────────────────────────────────────────────

export interface LabAdminProfileData {
  _id?: string;
  userId?: string;
  labAdminCode?: string;
  department: string;
  designation: string;
  branch: string;
  employmentType: string;
  profilePhoto: string;
  gender: string;
  dateOfBirth?: string;
  address: string;
  qualification: string;
  experience: number;
  createdAt?: string;
  updatedAt?: string;
}

export const getMyLabAdminProfile = () =>
  fetchDoctorProfile<LabAdminProfileData>("lab/me");

export const updateMyLabAdminProfile = (data: Partial<LabAdminProfileData>) =>
  updateDoctorProfile<LabAdminProfileData>("lab/me", data);

export const fetchCurrentUser = async (token: string) => {
  const res = await fetch(`${BACKEND_API}/auth/me`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  });
  const result = await res.json();
  if (!res.ok || !result.success) throw new Error(result.message || "Failed to fetch user");
  return result.data.user;
};

// ─── Doctor Registration Approval ──────────────────────────────────────────────

export interface PendingRegistration {
  _id: string;
  fullName: string;
  email: string;
  phone: string;
  role: string;
  createdAt: string;
}

export const getPendingDoctorRegistrations = () =>
  fetchAdminReal<{ data: PendingRegistration[] }>("admin/doctors/registrations/pending");

export const approveDoctorRegistration = (userId: string) =>
  mutateAdminReal<{ data: unknown }>(`admin/doctors/registrations/${userId}/approve`, {}, "PATCH");

export const rejectDoctorRegistration = (userId: string) =>
  mutateAdminReal<{ data: unknown }>(`admin/doctors/registrations/${userId}/reject`, {}, "PATCH");

export const suspendDoctor = (userId: string) =>
  mutateAdminReal<{ data: unknown }>(`admin/doctors/registrations/${userId}/suspend`, {}, "PATCH");

export interface AdminInfoData {
  department: string;
  designation: string;
  branch?: string;
  employmentType?: string;
}

export const assignDoctorAdminInfo = (userId: string, data: AdminInfoData) =>
  mutateAdminReal<{ data: unknown }>(`admin/doctors/registrations/${userId}/assign-admin-info`, data, "PATCH");

// ─── Department CMS Types ─────────────────────────────────────────────────────

export interface DeptService {
  en: string;
  bn: string;
}

export interface DeptSeo {
  metaTitle: BilingualField;
  metaDescription: BilingualField;
  keywords: string[];
}

export interface CmsDepartment {
  _id: string;
  slug: string;
  name: BilingualField;
  icon: string;
  image: string;
  shortDescription: BilingualField;
  description: BilingualField;
  services: DeptService[];
  headDoctor: BilingualField;
  availableDoctors: number;
  available: boolean;
  displayOrder: number;
  isVisible: boolean;
  seo: DeptSeo;
  createdAt?: string;
  updatedAt?: string;
}

export interface CmsDepartmentListResponse {
  data: CmsDepartment[];
  total: number;
  page: number;
  limit: number;
}

// ─── Department CMS API ───────────────────────────────────────────────────────

export const getCmsDepartments = (params: { page?: number; limit?: number; search?: string } = {}) => {
  const q = new URLSearchParams(params as Record<string, string>).toString();
  return fetchAdminReal<{ data: CmsDepartment[]; total: number; page: number; limit: number }>(`admin/departments${q ? `?${q}` : ""}`);
};
export const getCmsDepartmentById = (id: string) => fetchAdminReal<{ data: CmsDepartment }>(`admin/departments/${id}`);
export const createCmsDepartment = (data: Partial<CmsDepartment>) => mutateAdminReal<CmsDepartment>("admin/departments", data, "POST");
export const updateCmsDepartment = (id: string, data: Partial<CmsDepartment>) => mutateAdminReal<CmsDepartment>(`admin/departments/${id}`, data, "PUT");
export const patchCmsDepartment = (id: string, data: Partial<CmsDepartment>) => mutateAdminReal<CmsDepartment>(`admin/departments/${id}`, data, "PATCH");
export const deleteCmsDepartment = (id: string) => mutateAdminReal<null>(`admin/departments/${id}`, undefined, "DELETE");
export const toggleCmsDeptVisibility = (id: string) => mutateAdminReal<CmsDepartment>(`admin/departments/${id}/toggle-visibility`, {}, "PATCH");
export const reorderCmsDepartments = (updates: { id: string; displayOrder: number }[]) =>
  mutateAdminReal<null>("admin/departments/reorder", updates, "PATCH");

// ─── Departments Page CMS Types ───────────────────────────────────────────────

export interface CmsFeature {
  icon: string;
  title: BilingualField;
  description: BilingualField;
  color: string;
  bg: string;
  isVisible: boolean;
  displayOrder: number;
}

export interface CmsTestimonial {
  name: string;
  department: string;
  rating: number;
  text: BilingualField;
  avatar: string;
  color: string;
  isVisible: boolean;
  displayOrder: number;
}

export interface CmsDepartmentsPage {
  _id?: string;
  title: BilingualField;
  subtitle: BilingualField;
  hospitalStats: {
    patientsCount: string;
    yearsOfService: string;
  };
  features: CmsFeature[];
  testimonials: CmsTestimonial[];
  cta: {
    title: BilingualField;
    description: BilingualField;
    primaryBtn: { label: BilingualField; link: string };
    secondaryBtn: { label: BilingualField; link: string };
  };
  seo: {
    metaTitle: BilingualField;
    metaDescription: BilingualField;
  };
}

// ─── Departments Page CMS API ─────────────────────────────────────────────────

export const getCmsDepartmentsPageConfig = () => fetchAdminReal<{ data: CmsDepartmentsPage }>("admin/departments/page-config");
export const updateCmsDepartmentsPageConfig = (data: Partial<CmsDepartmentsPage>) => mutateAdminReal<CmsDepartmentsPage>("admin/departments/page-config", data, "PUT");

// ─── Specialization CMS Types ─────────────────────────────────────────────────

export interface CmsSpecialization {
  _id: string;
  name: BilingualField;
  slug: string;
  departmentSlug: string;
  description: BilingualField;
  isVisible: boolean;
  displayOrder: number;
  seo: {
    metaTitle: BilingualField;
    metaDescription: BilingualField;
  };
  createdAt?: string;
  updatedAt?: string;
}

// ─── Specialization CMS API ─────────────────────────────────────────────────

export const getCmsSpecializations = (params: { page?: number; limit?: number; search?: string; departmentSlug?: string } = {}) => {
  const q = new URLSearchParams(params as Record<string, string>).toString();
  return fetchAdminReal<{ data: CmsSpecialization[]; total: number; page: number; limit: number }>(`admin/specializations${q ? `?${q}` : ""}`);
};
export const getCmsSpecializationById = (id: string) => fetchAdminReal<{ data: CmsSpecialization }>(`admin/specializations/${id}`);
export const createCmsSpecialization = (data: Partial<CmsSpecialization>) => mutateAdminReal<CmsSpecialization>("admin/specializations", data, "POST");
export const updateCmsSpecialization = (id: string, data: Partial<CmsSpecialization>) => mutateAdminReal<CmsSpecialization>(`admin/specializations/${id}`, data, "PUT");
export const patchCmsSpecialization = (id: string, data: Partial<CmsSpecialization>) => mutateAdminReal<CmsSpecialization>(`admin/specializations/${id}`, data, "PATCH");
export const deleteCmsSpecialization = (id: string) => mutateAdminReal<null>(`admin/specializations/${id}`, undefined, "DELETE");
export const reorderCmsSpecializations = (updates: { id: string; displayOrder: number }[]) =>
  mutateAdminReal<null>("admin/specializations/reorder", updates, "PATCH");

// ─── Appointment CMS Types ────────────────────────────────────────────────────

export interface CmsAppointmentDoctor {
  _id: string;
  name: BilingualField;
  designation: BilingualField;
  image?: string;
  department: BilingualField;
}

export interface CmsAppointment {
  _id: string;
  patientName: string;
  patientPhone: string;
  patientEmail?: string;
  patientAge?: number;
  patientGender?: string;
  doctor: CmsAppointmentDoctor;
  department?: string;
  service?: string;
  date: string;
  time: string;
  type: "new" | "follow-up" | "consultation";
  status: "pending" | "confirmed" | "cancelled" | "completed" | "no-show";
  reason?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CmsAppointmentListResponse {
  data: CmsAppointment[];
  total: number;
  page: number;
  limit: number;
}

// ─── Appointment CMS API ──────────────────────────────────────────────────────

export const getCmsAppointments = (params: Record<string, string> = {}) => {
  const q = new URLSearchParams(params).toString();
  return fetchAdminReal<CmsAppointmentListResponse>(`admin/appointments${q ? `?${q}` : ""}`);
};

export const getCmsAppointmentById = (id: string) =>
  fetchAdminReal<{ data: CmsAppointment }>(`admin/appointments/${id}`);

export const createCmsAppointment = (data: Partial<CmsAppointment>) =>
  mutateAdminReal<CmsAppointment>("admin/appointments", data, "POST");

export const updateCmsAppointment = (id: string, data: Partial<CmsAppointment>) =>
  mutateAdminReal<CmsAppointment>(`admin/appointments/${id}`, data, "PUT");

export const deleteCmsAppointment = (id: string) =>
  mutateAdminReal<null>(`admin/appointments/${id}`, undefined, "DELETE");

export const updateCmsAppointmentStatus = (id: string, status: string) =>
  mutateAdminReal<CmsAppointment>(`admin/appointments/${id}/status`, { status }, "PATCH");

// ─── Service Page CMS Types ─────────────────────────────────────────────────

export interface ServicePageFeature {
  title: BilingualField;
  description: BilingualField;
  icon: string;
}

export interface ServicePageCategory {
  category: BilingualField;
  icon: string;
  accent: string;
  tests: BilingualField[];
  items: BilingualField[];
}

export interface ServicePageWorkingHours {
  weekdays: string;
  weekends: string;
  emergency: BilingualField;
}

export interface ServicePageStat {
  value: string;
  label: BilingualField;
}

export interface ServicePageGuideline {
  en: string;
  bn: string;
}

export interface ServicePageVaccinationEntry {
  age: BilingualField;
  vaccines: string[];
}

export interface ServicePageSeo {
  metaTitle: BilingualField;
  metaDescription: BilingualField;
}

export type ServicePageType = "diagnostic" | "nicu";

export interface ServicePageData {
  _id?: string;
  type: ServicePageType;
  title: BilingualField;
  subtitle: BilingualField;
  heroDescription: BilingualField;
  backgroundImage: string;
  description: BilingualField;
  features: ServicePageFeature[];
  services: ServicePageCategory[];
  workingHours?: ServicePageWorkingHours;
  statistics: ServicePageStat[];
  equipment: BilingualField[];
  guidelines: ServicePageGuideline[];
  vaccinationSchedule: ServicePageVaccinationEntry[];
  seo?: ServicePageSeo;
  createdBy?: string;
  updatedBy?: string;
  createdAt?: string;
  updatedAt?: string;
}

// ─── Service Page CMS API ───────────────────────────────────────────────────

export const getServicePageData = (type: string) =>
  fetchAdminReal<{ data: ServicePageData }>(`admin/service-page/${type}`);

export const updateServicePageData = (type: string, data: Partial<ServicePageData>) =>
  mutateAdminReal<ServicePageData>(`admin/service-page/${type}`, data, "PUT");

// ─── Resource Page CMS Types ──────────────────────────────────────────────

export interface HealthBlogPost {
  id: number;
  category: string;
  title: BilingualField;
  excerpt: BilingualField;
  author: BilingualField;
  date: string;
  readTime: BilingualField;
  image: string;
}

export interface HealthBlogData {
  _id?: string;
  hero: {
    title: BilingualField;
    subtitle: BilingualField;
    description: BilingualField;
    image: string;
  };
  categories: { id: string; name: BilingualField }[];
  posts: HealthBlogPost[];
  tags: BilingualField[];
  sections: Record<string, SectionConfig>;
  seo: SeoConfig;
  createdBy?: string;
  updatedBy?: string;
}

export interface EmergencyContact {
  icon: string;
  title: BilingualField;
  number: string;
  available: BilingualField;
}

export interface FirstAidStep {
  en: string;
  bn: string;
}

export interface FirstAidItem {
  icon: string;
  title: BilingualField;
  steps: FirstAidStep[];
}

export interface PreparednessTip {
  icon: string;
  title: BilingualField;
  description: BilingualField;
}

export interface EmergencyInfoData {
  _id?: string;
  hero: {
    title: BilingualField;
    subtitle: BilingualField;
    description: BilingualField;
    image: string;
  };
  emergencyContacts: {
    title: BilingualField;
    contacts: EmergencyContact[];
  };
  firstAid: {
    title: BilingualField;
    items: FirstAidItem[];
  };
  whenToCallEmergency: {
    title: BilingualField;
    description: BilingualField;
    situations: FirstAidStep[];
  };
  emergencyPreparedness: {
    title: BilingualField;
    tips: PreparednessTip[];
  };
  sections: Record<string, SectionConfig>;
  seo: SeoConfig;
  createdBy?: string;
  updatedBy?: string;
}

export interface FAQCategory {
  id: string;
  name: BilingualField;
  icon: string;
}

export interface FAQItemData {
  id: number;
  category: string;
  question: BilingualField;
  answer: BilingualField;
}

export interface FAQContactInfo {
  title: BilingualField;
  description: BilingualField;
  phone: string;
  email: string;
}

export interface FAQData {
  _id?: string;
  hero: {
    title: BilingualField;
    subtitle: BilingualField;
    description: BilingualField;
    image: string;
  };
  categories: FAQCategory[];
  faqs: FAQItemData[];
  contactInfo: FAQContactInfo;
  sections: Record<string, SectionConfig>;
  seo: SeoConfig;
  createdBy?: string;
  updatedBy?: string;
}

// ─── Resource Page CMS API Functions ──────────────────────────────────────

export const getHealthBlog = () => fetchReal<HealthBlogData>("health-blog");
export const updateHealthBlog = (data: Partial<HealthBlogData>) =>
  mutateAdminReal<HealthBlogData>("admin/health-blog", data, "PUT");

export const getEmergencyInfo = () => fetchReal<EmergencyInfoData>("emergency-information");
export const updateEmergencyInfo = (data: Partial<EmergencyInfoData>) =>
  mutateAdminReal<EmergencyInfoData>("admin/emergency-information", data, "PUT");

export const getFAQData = () => fetchReal<FAQData>("faq");
export const updateFAQData = (data: Partial<FAQData>) =>
  mutateAdminReal<FAQData>("admin/faq", data, "PUT");
