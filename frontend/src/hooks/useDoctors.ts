import { useQuery } from "@tanstack/react-query";

export interface Doctor {
  id: number;
  name: string;
  slug: string;
  specialization: string;
  qualification: string;
  experience: string;
  department: string;
  designation: string;
  image: string;
  phone: string;
  email: string;
  chamberTime: string;
  consultationFee: number;
  languages: string[];
  about: string;
  services: string[];
  available: boolean;
}

const fetchDoctors = async (): Promise<Doctor[]> => {
  const res = await fetch("/data/doctors.json");
  if (!res.ok) throw new Error("Failed to fetch doctors data");
  return res.json();
};

export const useDoctors = () =>
  useQuery<Doctor[]>({
    queryKey: ["doctors"],
    queryFn: fetchDoctors,
    staleTime: 1000 * 60 * 15,
  });
