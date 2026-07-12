import { useQuery } from "@tanstack/react-query";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";

// ── Types ─────────────────────────────────────────────────────────────────────

export interface Department {
  id: string;
  slug: string;
  name: string;
  icon: string;
  image: string;
  shortDescription: string;
  description: string;
  services: string[];
  headDoctor: string;
  availableDoctors: number;
  available: boolean;
}

export interface HospitalStats {
  patientsCount: string;
  yearsOfService: string;
}

export interface DepartmentFeature {
  icon: string;
  title: string;
  description: string;
  color: string;
  bg: string;
}

export interface Testimonial {
  name: string;
  department: string;
  rating: number;
  text: string;
  avatar: string;
  color: string;
}

export interface CtaData {
  title: string;
  description: string;
  primaryBtn: { label: string; link: string };
  secondaryBtn: { label: string; link: string };
}

export interface DepartmentsData {
  departments: Department[];
  hospitalStats: HospitalStats;
  features: DepartmentFeature[];
  testimonials: Testimonial[];
  cta: CtaData;
}

// ── Fetchers ──────────────────────────────────────────────────────────────────

const fetchDepartments = async (lang = "en"): Promise<Department[]> => {
  const res = await fetch(`${API_URL}/departments?lang=${lang}`, {
    cache: "no-store",
  });
  if (!res.ok) throw new Error("Failed to fetch departments");
  const json = await res.json();
  return json.data as Department[];
};

const fetchDepartmentsData = async (lang = "en"): Promise<DepartmentsData> => {
  const [depts, pageConfigRes] = await Promise.all([
    fetchDepartments(lang),
    fetch(`${API_URL}/departments/page-config?lang=${lang}`, { cache: "no-store" }),
  ]);

  if (!pageConfigRes.ok) throw new Error("Failed to fetch departments page config");
  const json = await pageConfigRes.json();
  const pageData = json.data;

  return {
    departments: depts,
    hospitalStats: pageData.hospitalStats || { patientsCount: "15K+", yearsOfService: "10+" },
    features: pageData.features || [],
    testimonials: pageData.testimonials || [],
    cta: pageData.cta || {
      title: "Need Medical Assistance?",
      description: "Our specialists are ready to help. Book an appointment today and get the care you deserve.",
      primaryBtn: { label: "Book Appointment", link: "/appointment" },
      secondaryBtn: { label: "View Our Doctors", link: "/doctors" },
    },
  };
};

const fetchDepartmentBySlug = async (slug: string, lang = "en"): Promise<Department> => {
  const res = await fetch(`${API_URL}/departments/${slug}?lang=${lang}`, {
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`Department not found: ${slug}`);
  const json = await res.json();
  return json.data as Department;
};

// ── Hooks ─────────────────────────────────────────────────────────────────────

export const useDepartments = (lang?: string) =>
  useQuery<DepartmentsData>({
    queryKey: ["departments", lang],
    queryFn: () => fetchDepartmentsData(lang),
    staleTime: 1000 * 60 * 5,
  });

export const useDepartmentBySlug = (slug: string, lang = "en") =>
  useQuery<Department>({
    queryKey: ["departments", slug, lang],
    queryFn: () => fetchDepartmentBySlug(slug, lang),
    enabled: !!slug,
    staleTime: 1000 * 60 * 5,
  });

export const useDepartmentList = (lang = "en") =>
  useQuery<Department[]>({
    queryKey: ["departments", "list", lang],
    queryFn: () => fetchDepartments(lang),
    staleTime: 1000 * 60 * 5,
  });
