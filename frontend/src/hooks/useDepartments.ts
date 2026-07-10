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

export interface HospitalStats {
  patientsCount: string;
  yearsOfService: string;
}

export interface DepartmentFeature {
  icon: string;
  title: string;
  description: string;
  color: string;
  bg: string;
}

export interface Testimonial {
  name: string;
  department: string;
  rating: number;
  text: string;
  avatar: string;
  color: string;
}

export interface DepartmentsData {
  departments: Department[];
  hospitalStats: HospitalStats;
  features: DepartmentFeature[];
  testimonials: Testimonial[];
}

const fetchDepartments = async (): Promise<DepartmentsData> => {
  const res = await fetch("/data/departments.json");
  if (!res.ok) throw new Error("Failed to fetch departments data");
  return res.json();
};

export const useDepartments = () =>
  useQuery<DepartmentsData>({
    queryKey: ["departments"],
    queryFn: fetchDepartments,
    staleTime: 0,
  });
