import { useQuery } from "@tanstack/react-query";

export interface Feature {
  title: string;
  description: string;
  icon: string;
}

export interface ServiceCategory {
  category: string;
  items: string[];
}

export interface Statistic {
  value: string;
  label: string;
}

export interface VaccinationSchedule {
  age: string;
  vaccines: string[];
}

export interface WorkingHours {
  weekdays: string;
  weekends: string;
  emergency: string;
}

export interface BabyCareService {
  id: number;
  title: string;
  subtitle: string;
  heroDescription: string;
  backgroundImage: string;
  description: string;
  features: Feature[];
  services: ServiceCategory[];
  vaccinationSchedule: VaccinationSchedule[];
  statistics: Statistic[];
  workingHours: WorkingHours;
}

export interface BabyCareData {
  babyCare: BabyCareService;
}

const fetchBabyCare = async (): Promise<BabyCareData> => {
  const res = await fetch("/data/babycare.json");
  if (!res.ok) throw new Error("Failed to fetch baby care data");
  return res.json();
};

export const useBabyCare = () =>
  useQuery<BabyCareData>({
    queryKey: ["babyCare"],
    queryFn: fetchBabyCare,
    staleTime: 1000 * 60 * 15,
  });
