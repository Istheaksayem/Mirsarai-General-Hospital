import { useQuery } from "@tanstack/react-query";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";

export interface Feature {
  title: string;
  description: string;
  icon: string;
}

export interface ServiceCategory {
  category: string;
  tests?: string[];
  items?: string[];
  icon: string;
  accent: string;
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
  type: string;
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

const fetchDiagnosticService = async (lang = "en"): Promise<DiagnosticService> => {
  const res = await fetch(`${API_URL}/service-page/diagnostic-services?lang=${lang}`, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch diagnostic service data");
  const json = await res.json();
  return json.data as DiagnosticService;
};

export const useDiagnosticService = (lang = "en") =>
  useQuery<DiagnosticService>({
    queryKey: ["diagnosticServices", lang],
    queryFn: () => fetchDiagnosticService(lang),
    staleTime: 1000 * 60 * 15,
  });
