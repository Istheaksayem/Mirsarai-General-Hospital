import { useQuery } from "@tanstack/react-query";

// ---------- Types ----------
export interface Statistic {
  title: string;
  value: string;
}

export interface AboutSection {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  content: string[];
  statistics: Statistic[];
  image: string;
}

export interface CoreValue {
  title: string;
  description: string;
}

export interface MissionVisionSection {
  id: number;
  title: string;
  mission: { title: string; description: string };
  vision: { title: string; description: string };
  coreValues: CoreValue[];
  image: string;
}

export interface AboutData {
  about: AboutSection;
  missionVision: MissionVisionSection;
}

// ---------- Fetcher ----------
const fetchAboutData = async (): Promise<AboutData> => {
  const res = await fetch("/data/aboutData.json");
  if (!res.ok) throw new Error("Failed to fetch about data");
  return res.json();
};

// ---------- Hook ----------
export const useAboutData = () =>
  useQuery<AboutData>({
    queryKey: ["aboutData"],
    queryFn: fetchAboutData,
    staleTime: 1000 * 60 * 15,
  });
