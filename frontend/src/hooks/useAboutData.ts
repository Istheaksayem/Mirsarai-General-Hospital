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

export interface FeatureItem {
  title: BiText;
  description: BiText;
  color: string;
}

export interface FeaturesSection {
  badge: BiText;
  heading: BiText;
  description: BiText;
  items: FeatureItem[];
}

export interface AboutSection {
  id?: number;
  title: BiText;
  subtitle: BiText;
  storyHeading?: BiText;
  description: BiText;
  content: BiText[];
  statistics: Statistic[];
  image: string;
  features?: BiText[];
  featuresSection?: FeaturesSection;
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

export interface WhyItMattersItem {
  title: BiText;
  description: BiText;
  color: string;
}

export interface MissionVisionSection {
  id?: number;
  title: BiText;
  mission: { title: BiText; description: BiText };
  vision: { title: BiText; description: BiText };
  coreValues: CoreValue[];
  commitmentHeading?: BiText;
  commitmentDescription?: BiText;
  whyItMattersHeading?: BiText;
  whyItMattersDescription?: BiText;
  whyItMattersItems?: WhyItMattersItem[];
  ctaHeading?: BiText;
  ctaDescription?: BiText;
  ctaPrimaryButtonText?: BiText;
  ctaSecondaryButtonText?: BiText;
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

  const [aboutSettled, mvSettled] = await Promise.allSettled([
    fetch(`${apiUrl}/about/us`, { cache: "no-store" }).then(async (r) => {
      if (!r.ok) throw new Error("Failed to fetch about us data");
      const json = await r.json();
      return normalizeImages(json.data) as AboutSection;
    }),
    fetch(`${apiUrl}/about/mission-vision`, { cache: "no-store" }).then(async (r) => {
      if (!r.ok) throw new Error("Failed to fetch mission & vision data");
      const json = await r.json();
      return normalizeImages(json.data) as MissionVisionSection;
    }),
  ]);

  // Both succeeded — return API data
  if (aboutSettled.status === "fulfilled" && mvSettled.status === "fulfilled") {
    return { about: aboutSettled.value, missionVision: mvSettled.value };
  }

  // Partial failure — load fallback JSON and merge per-section
  console.warn(
    "Backend API partially unreachable. Falling back to local data/aboutData.json where needed.",
    aboutSettled.status === "rejected" ? aboutSettled.reason : "",
    mvSettled.status === "rejected" ? mvSettled.reason : "",
  );
  const fallbackRes = await fetch("/data/aboutData.json", { cache: "no-store" });
  if (!fallbackRes.ok) throw new Error("Failed to fetch fallback about data");
  const fallback: AboutData = await fallbackRes.json();

  return {
    about: aboutSettled.status === "fulfilled" ? aboutSettled.value : normalizeImages(fallback.about),
    missionVision: mvSettled.status === "fulfilled" ? mvSettled.value : normalizeImages(fallback.missionVision),
  };
};

// ── Hook ──────────────────────────────────────────────────────────────────────
export const useAboutData = () =>
  useQuery<AboutData>({
    queryKey: ["aboutData"],
    queryFn: fetchAboutData,
    staleTime: 1000 * 60 * 15,
  });
export default useAboutData;

// ── Our Team Types ─────────────────────────────────────────────────────────────
export interface TeamMember {
  name: BiText;
  designation: BiText;
  department: BiText;
  bio: BiText;
  image: string;
  email: string;
  phone: string;
  order: number;
}

export interface OurTeamSection {
  hero: {
    title: BiText;
    subtitle: BiText;
    description: BiText;
    image: string;
  };
  sectionTitle: BiText;
  sectionDescription: BiText;
  members: TeamMember[];
  sections?: {
    hero: SectionConfig;
    members: SectionConfig;
    cta: SectionConfig;
  };
  seo?: SEOConfig;
}

// ── Our Team Fetcher ────────────────────────────────────────────────────────────
const fetchOurTeamData = async (): Promise<OurTeamSection> => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";
  const res = await fetch(`${apiUrl}/about/our-team`, { cache: "no-store" });
  if (!res.ok) {
    console.warn("Backend API unreachable for Our Team. Falling back to local data/ourTeam.json.");
    const fallbackRes = await fetch("/data/ourTeam.json", { cache: "no-store" });
    if (!fallbackRes.ok) throw new Error("Failed to fetch fallback Our Team data");
    return normalizeImages((await fallbackRes.json())) as OurTeamSection;
  }
  const json = await res.json();
  return normalizeImages(json.data) as OurTeamSection;
};

// ── Our Team Hook ───────────────────────────────────────────────────────────────
export const useOurTeamData = () =>
  useQuery<OurTeamSection>({
    queryKey: ["ourTeamData"],
    queryFn: fetchOurTeamData,
    staleTime: 1000 * 60 * 15,
  });

// ── Career Types ──────────────────────────────────────────────────────────────
export interface CareerPosition {
  id: number;
  title: BiText;
  department: BiText;
  location: BiText;
  jobType: BiText;
  description: BiText;
  requirements: BiText;
  applyLink: string;
  bannerImage: string;
  isActive: boolean;
}

export interface CareerData {
  title: BiText;
  description: BiText;
  image: string;
  jobListings: CareerPosition[];
  sections?: {
    hero: SectionConfig;
    jobListings: SectionConfig;
  };
  seo?: SEOConfig;
}

// ── Career Fetcher ─────────────────────────────────────────────────────────────
const fetchCareerData = async (): Promise<CareerData> => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";
  const res = await fetch(`${apiUrl}/about/career`, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch Career data");
  const json = await res.json();
  return normalizeImages(json.data) as CareerData;
};

// ── Career Hook ────────────────────────────────────────────────────────────────
export const useCareerData = () =>
  useQuery<CareerData>({
    queryKey: ["careerData"],
    queryFn: fetchCareerData,
    staleTime: 1000 * 60 * 15,
  });
