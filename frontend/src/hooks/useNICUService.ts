import { useQuery } from "@tanstack/react-query";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";

export interface Feature {
  title: string;
  description: string;
  icon: string;
}

export interface ServiceCategory {
  category: string;
  items: string[];
  icon: string;
  accent: string;
}

export interface Statistic {
  value: string;
  label: string;
}

export interface VaccinationSchedule {
  age: string;
  vaccines: string[];
}

export interface NICUService {
  type: string;
  title: string;
  subtitle: string;
  heroDescription: string;
  backgroundImage: string;
  description: string;
  features: Feature[];
  services: ServiceCategory[];
  equipment: string[];
  statistics: Statistic[];
  guidelines: string[];
  vaccinationSchedule: VaccinationSchedule[];
  workingHours: {
    weekdays: string;
    emergency: string;
  };
}

const fetchNICUService = async (lang = "en"): Promise<NICUService> => {
  const res = await fetch(`${API_URL}/service-page/nicu?lang=${lang}`, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch NICU service data");
  const json = await res.json();
  return json.data as NICUService;
};

export const useNICUService = (lang = "en") =>
  useQuery<NICUService>({
    queryKey: ["nicuService", lang],
    queryFn: () => fetchNICUService(lang),
    staleTime: 1000 * 60 * 15,
  });
