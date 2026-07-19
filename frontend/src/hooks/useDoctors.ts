import { useQuery } from "@tanstack/react-query";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";

// ── Types ─────────────────────────────────────────────────────────────────────

export interface BilingualText {
  en: string;
  bn: string;
}

export interface Doctor {
  _id?: string;
  id?: number;
  slug: string;
  name: BilingualText;
  designation: BilingualText;
  specialization: BilingualText;
  department: BilingualText;
  qualification: string;
  experience: BilingualText;
  languages: string[];
  about: BilingualText;
  services: BilingualText[];
  consultationFee: number;
  chamberTime: BilingualText;
  availableDays: string[];
  phone: string;
  email: string;
  image?: string;
  featured: boolean;
  displayOrder: number;
  isVisible: boolean;
  status: "active" | "on-leave" | "inactive";
  available: boolean;
}

// ── Normalizer ────────────────────────────────────────────────────────────────
import { getImageUrl } from "@/lib/getImageUrl";

// API stores experience as { years, label: { en, bn } }, frontend expects { en, bn }
const normalizeDoctor = (d: Record<string, unknown>): Doctor => {
  const exp = d.experience as Record<string, unknown>;
  if (exp && exp.label) {
    d.experience = exp.label;
  }
  if (d.image && typeof d.image === 'string' && d.image.trim()) {
    d.image = getImageUrl(d.image.trim());
  } else {
    delete d.image;
  }
  return d as unknown as Doctor;
};

// ── Fetchers ──────────────────────────────────────────────────────────────────

const fetchDoctors = async (): Promise<Doctor[]> => {
  const res = await fetch(`${API_URL}/doctors`, { cache: "no-store" });
  if (!res.ok) {
    // Fallback to static JSON if API is unavailable
    const fallback = await fetch("/data/doctors.json", { cache: "no-store" });
    if (!fallback.ok) throw new Error("Failed to fetch doctors data");
    return fallback.json();
  }
  const json = await res.json();
  return (json.data as Record<string, unknown>[]).map(normalizeDoctor);
};

const fetchDoctorBySlug = async (slug: string): Promise<Doctor> => {
  const res = await fetch(`${API_URL}/doctors/${slug}`, { cache: "no-store" });
  if (!res.ok) throw new Error(`Doctor not found: ${slug}`);
  const json = await res.json();
  return normalizeDoctor(json.data as Record<string, unknown>);
};

const fetchFeaturedDoctors = async (limit = 4): Promise<Doctor[]> => {
  const res = await fetch(`${API_URL}/doctors/featured?limit=${limit}`, {
    cache: "no-store",
  });
  if (!res.ok) {
    const fallback = await fetch("/data/doctors.json", { cache: "no-store" });
    if (!fallback.ok) throw new Error("Failed to fetch featured doctors");
    const all: Doctor[] = await fallback.json();
    return all.filter((d) => d.available).slice(0, limit);
  }
  const json = await res.json();
  return (json.data as Record<string, unknown>[]).map(normalizeDoctor);
};

// ── Hooks ─────────────────────────────────────────────────────────────────────

export const useDoctors = () =>
  useQuery<Doctor[]>({
    queryKey: ["doctors"],
    queryFn: fetchDoctors,
    staleTime: 1000 * 60 * 5,
  });

export const useDoctorBySlug = (slug: string) =>
  useQuery<Doctor>({
    queryKey: ["doctors", slug],
    queryFn: () => fetchDoctorBySlug(slug),
    enabled: !!slug,
    staleTime: 1000 * 60 * 5,
  });

export const useFeaturedDoctors = (limit = 4) =>
  useQuery<Doctor[]>({
    queryKey: ["doctors", "featured", limit],
    queryFn: () => fetchFeaturedDoctors(limit),
    staleTime: 1000 * 60 * 5,
  });
