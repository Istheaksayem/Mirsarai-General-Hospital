import { useQuery } from "@tanstack/react-query";

export interface Feature {
  title: string;
  description: string;
  icon: string;
}

export interface ServiceCategory {
  category: string;
  tests?: string[];
  items?: string[];
}

export interface Statistic {
  value: string;
  label: string;
}

export interface WorkingHours {
  weekdays: string;
  weekends: string;
  emergency: string;
}

export interface DiagnosticService {
  id: number;
  title: string;
  subtitle: string;
  heroDescription: string;
  backgroundImage: string;
  description: string;
  features: Feature[];
  services: ServiceCategory[];
  workingHours: WorkingHours;
  statistics: Statistic[];
}

export interface DiagnosticData {
  diagnostic: DiagnosticService;
}

const fetchDiagnosticService = async (): Promise<DiagnosticData> => {
  const res = await fetch("/data/diagnosticService.json");
  if (!res.ok) throw new Error("Failed to fetch diagnostic service data");
  return res.json();
};

export const useDiagnosticService = () =>
  useQuery<DiagnosticData>({
    queryKey: ["diagnosticService"],
    queryFn: fetchDiagnosticService,
    staleTime: 1000 * 60 * 15,
  });
