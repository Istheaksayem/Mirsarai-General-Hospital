"use client";

import { useQuery } from "@tanstack/react-query";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";

export interface BiText { en: string; bn: string }

export interface EmergencyContact {
  icon: string;
  title: BiText;
  number: string;
  available: BiText;
}

export interface FirstAidStep {
  en: string;
  bn: string;
}

export interface FirstAidItem {
  icon: string;
  title: BiText;
  steps: FirstAidStep[];
}

export interface PreparednessTip {
  icon: string;
  title: BiText;
  description: BiText;
}

export interface EmergencyInfoData {
  hero: {
    title: BiText;
    subtitle: BiText;
    description: BiText;
    image: string;
  };
  emergencyContacts: {
    title: BiText;
    contacts: EmergencyContact[];
  };
  firstAid: {
    title: BiText;
    items: FirstAidItem[];
  };
  whenToCallEmergency: {
    title: BiText;
    description: BiText;
    situations: FirstAidStep[];
  };
  emergencyPreparedness: {
    title: BiText;
    tips: PreparednessTip[];
  };
}

const fetchEmergencyInfo = async (): Promise<EmergencyInfoData> => {
  try {
    const res = await fetch(`${API_URL}/emergency-information`, { cache: "no-store" });
    if (!res.ok) throw new Error("Failed to fetch emergency info data");
    const json = await res.json();
    return json.data as EmergencyInfoData;
  } catch {
    const res = await fetch("/data/emergencyInfo.json", { cache: "no-store" });
    if (!res.ok) throw new Error("Failed to fetch fallback emergency info data");
    return res.json();
  }
};

export const useEmergencyInfo = () =>
  useQuery<EmergencyInfoData>({
    queryKey: ["emergencyInfo"],
    queryFn: fetchEmergencyInfo,
    staleTime: 1000 * 60 * 15,
  });

export default useEmergencyInfo;
