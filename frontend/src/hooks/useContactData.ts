import { useQuery } from "@tanstack/react-query";

// ── Bilingual string ──────────────────────────────────────────────────────────
export interface BiText { en: string; bn: string }

// ── Types ─────────────────────────────────────────────────────────────────────
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

export interface ContactPageData {
  hero: {
    title: BiText;
    subtitle: BiText;
    description: BiText;
    image: string;
  };
  contactInfo: {
    title: BiText;
    addressCard: { label: BiText; name: BiText; location: BiText };
    hotlineCard: { label: BiText; number: string; numberLabel: BiText };
    emailCard: { label: BiText; address: string };
  };
  form: {
    title: BiText;
    description: BiText;
    buttonText: BiText;
    fields: {
      name: { label: BiText; placeholder: BiText };
      phone: { label: BiText; placeholder: BiText };
      email: { label: BiText; placeholder: BiText };
      message: { label: BiText; placeholder: BiText };
    };
  };
  sections: Record<string, SectionConfig>;
  seo: SEOConfig;
}

// ── Fetcher ───────────────────────────────────────────────────────────────────
import { normalizeImages } from "@/lib/getImageUrl";

const fetchContactPageData = async (): Promise<ContactPageData> => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";
  const res = await fetch(`${apiUrl}/contact-page`, { cache: "no-store" });
  if (!res.ok) {
    throw new Error("Failed to fetch Contact page data");
  }
  const json = await res.json();
  return normalizeImages(json.data) as ContactPageData;
};

// ── Hook ──────────────────────────────────────────────────────────────────────
export const useContactData = () =>
  useQuery<ContactPageData>({
    queryKey: ["contactPageData"],
    queryFn: fetchContactPageData,
    staleTime: 1000 * 60 * 15,
  });

export default useContactData;
