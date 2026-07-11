import { useQuery } from "@tanstack/react-query";

// ── Bilingual string ──────────────────────────────────────────────────────────
export interface BiText { en: string; bn: string }

// ── Types ─────────────────────────────────────────────────────────────────────
export interface Statistic {
  title: BiText;
  value: string;
}

export interface AboutSection {
  id: number;
  title: BiText;
  subtitle: BiText;
  description: BiText;
  content: BiText[];
  statistics: Statistic[];
  image: string;
  features?: BiText[];
}

export interface CoreValue {
  title: BiText;
  description: BiText;
}

export interface MissionVisionSection {
  id: number;
  title: BiText;
  mission: { title: BiText; description: BiText };
  vision: { title: BiText; description: BiText };
  coreValues: CoreValue[];
  image: string;
}

export interface AboutData {
  about: AboutSection;
  missionVision: MissionVisionSection;
}

// ── Fetcher ───────────────────────────────────────────────────────────────────
const fetchAboutData = async (): Promise<AboutData> => {
  const res = await fetch("/data/aboutData.json", { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch about data");
  return res.json();
};

// ── Hook ──────────────────────────────────────────────────────────────────────
export const useAboutData = () =>
  useQuery<AboutData>({
    queryKey: ["aboutData"],
    queryFn: fetchAboutData,
    staleTime: 1000 * 60 * 15,
  });
