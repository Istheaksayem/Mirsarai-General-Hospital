import { useQuery } from "@tanstack/react-query";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";

interface Service {
  _id: string;
  name: { en: string; bn: string };
  slug: string;
  description: { en: string; bn: string };
  image: string;
  icon: string;
  color: string;
  gradient: string;
  link: string;
  highlights: string[];
  tagline: string;
  displayOrder: number;
}

const fetchServices = async (): Promise<Service[]> => {
  try {
    const res = await fetch(`${API_URL}/services`, { cache: "no-store" });
    if (!res.ok) throw new Error("API unavailable");
    const json = await res.json();
    return json.data as Service[];
  } catch {
    const fallback = await fetch("/data/services.json", { cache: "no-store" });
    if (!fallback.ok) throw new Error("Failed to fetch services");
    return fallback.json();
  }
};

export const useServices = () =>
  useQuery<Service[]>({
    queryKey: ["services"],
    queryFn: fetchServices,
    staleTime: 1000 * 60 * 10,
  });
