import { useQuery } from "@tanstack/react-query";

// ── Bilingual string ──────────────────────────────────────────────────────────
export interface BiText { en: string; bn: string }

// ── Types ─────────────────────────────────────────────────────────────────────
export interface AppointmentPageFeatureCard {
  icon: string;
  title: BiText;
  description: BiText;
}

export interface SEOConfig {
  metaTitle: BiText;
  metaDescription: BiText;
  keywords: BiText;
  ogImage: string;
}

export interface SectionConfig {
  isVisible: boolean;
  order: number;
}

export interface AppointmentPageData {
  hero: {
    title: BiText;
    subtitle: BiText;
    description: BiText;
    image: string;
  };
  features: AppointmentPageFeatureCard[];
  whyChooseUs: {
    title: BiText;
    items: BiText[];
  };
  emergencyBanner: {
    title: BiText;
    description: BiText;
    buttonText: BiText;
    phone: string;
  };
  contactCard: {
    title: BiText;
    description: BiText;
    phone: string;
  };
  formSection: {
    title: BiText;
    description: BiText;
  };
  disclaimer: BiText;
  sections: Record<string, SectionConfig>;
  seo: SEOConfig;
}

// ── Fetcher ───────────────────────────────────────────────────────────────────
import { normalizeImages } from "@/lib/getImageUrl";

const fetchAppointmentPageData = async (): Promise<AppointmentPageData> => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";
  const res = await fetch(`${apiUrl}/appointment-page`, { cache: "no-store" });
  if (!res.ok) {
    throw new Error("Failed to fetch Appointment page data");
  }
  const json = await res.json();
  return normalizeImages(json.data) as AppointmentPageData;
};

// ── Hook ──────────────────────────────────────────────────────────────────────
export const useAppointmentPageData = () =>
  useQuery<AppointmentPageData>({
    queryKey: ["appointmentPageData"],
    queryFn: fetchAppointmentPageData,
    staleTime: 1000 * 60 * 15,
  });

export default useAppointmentPageData;
