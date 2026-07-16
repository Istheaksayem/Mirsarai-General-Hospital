import { useQuery } from "@tanstack/react-query";

// ── Bilingual string ──────────────────────────────────────────────────────────
export interface BiText { en: string; bn: string }

// ── Types ─────────────────────────────────────────────────────────────────────
export interface Statistic {
  title: BiText;
  value: string;
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

export interface AboutSection {
  id?: number;
  title: BiText;
  subtitle: BiText;
  description: BiText;
  content: BiText[];
  statistics: Statistic[];
  image: string;
  features?: BiText[];
  sections?: {
    hero: SectionConfig;
    story: SectionConfig;
    features: SectionConfig;
    statistics: SectionConfig;
    cta: SectionConfig;
  };
  seo?: SEOConfig;
}

export interface CoreValue {
  title: BiText;
  description: BiText;
}

export interface MissionVisionSection {
  id?: number;
  title: BiText;
  mission: { title: BiText; description: BiText };
  vision: { title: BiText; description: BiText };
  coreValues: CoreValue[];
  image: string;
  sections?: {
    hero: SectionConfig;
    missionVision: SectionConfig;
    coreValues: SectionConfig;
    commitment: SectionConfig;
    whyItMatters: SectionConfig;
    cta: SectionConfig;
  };
  seo?: SEOConfig;
}

export interface AboutData {
  about: AboutSection;
  missionVision: MissionVisionSection;
}

// ── Fetcher ───────────────────────────────────────────────────────────────────
import { normalizeImages } from "@/lib/getImageUrl";

const fetchAboutData = async (): Promise<AboutData> => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";

  try {
    const [aboutRes, mvRes] = await Promise.all([
      fetch(`${apiUrl}/about/us`, { cache: "no-store" }),
      fetch(`${apiUrl}/about/mission-vision`, { cache: "no-store" })
    ]);

    if (!aboutRes.ok) throw new Error("Failed to fetch about us data");
    if (!mvRes.ok) throw new Error("Failed to fetch mission & vision data");

    const aboutData = await aboutRes.json();
    const mvData = await mvRes.json();

    return {
      about: normalizeImages(aboutData.data),
      missionVision: normalizeImages(mvData.data)
    };
  } catch (error) {
    console.warn("Backend API not reachable for about data. Falling back to local data/aboutData.json", error);
    const res = await fetch("/data/aboutData.json", { cache: "no-store" });
    if (!res.ok) throw new Error("Failed to fetch fallback about data");
    const localData = await res.json();
    return localData;
  }
};

// ── Hook ──────────────────────────────────────────────────────────────────────
export const useAboutData = () =>
  useQuery<AboutData>({
    queryKey: ["aboutData"],
    queryFn: fetchAboutData,
    staleTime: 1000 * 60 * 15,
  });
export default useAboutData;
