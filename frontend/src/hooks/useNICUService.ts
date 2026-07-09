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

export interface NICUService {
  id: number;
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
}

export interface NICUData {
  nicu: NICUService;
}

const fetchNICUService = async (): Promise<NICUData> => {
  const res = await fetch("/data/nicuService.json");
  if (!res.ok) throw new Error("Failed to fetch NICU service data");
  return res.json();
};

export const useNICUService = () =>
  useQuery<NICUData>({
    queryKey: ["nicuService"],
    queryFn: fetchNICUService,
    staleTime: 1000 * 60 * 15,
  });
