import { useQuery } from "@tanstack/react-query";

interface BilingualText {
  en: string;
  bn: string;
}

export interface Doctor {
  id: number;
  name: BilingualText;
  slug: string;
  specialization: BilingualText;
  qualification: string;
  experience: BilingualText;
  department: BilingualText;
  designation: BilingualText;
  image: string;
  phone: string;
  email: string;
  chamberTime: BilingualText;
  consultationFee: number;
  languages: string[];
  about: BilingualText;
  services: BilingualText[];
  available: boolean;
}

const fetchDoctors = async (): Promise<Doctor[]> => {
  const res = await fetch("/data/doctors.json", { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch doctors data");
  return res.json();
};

export const useDoctors = () =>
  useQuery<Doctor[]>({
    queryKey: ["doctors"],
    queryFn: fetchDoctors,
    staleTime: 1000 * 60 * 15,
  });
