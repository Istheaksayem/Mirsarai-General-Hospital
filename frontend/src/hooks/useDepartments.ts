import { useQuery } from "@tanstack/react-query";

export interface Department {
  id: number;
  name: string;
  slug: string;
  icon: string;
  image: string;
  shortDescription: string;
  description: string;
  services: string[];
  headDoctor: string;
  availableDoctors: number;
  available: boolean;
}

const fetchDepartments = async (): Promise<Department[]> => {
  const res = await fetch("/data/departments.json");
  if (!res.ok) throw new Error("Failed to fetch departments data");
  return res.json();
};

export const useDepartments = () =>
  useQuery<Department[]>({
    queryKey: ["departments"],
    queryFn: fetchDepartments,
    staleTime: 1000 * 60 * 15,
  });
