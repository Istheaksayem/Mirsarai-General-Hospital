"use client";

import { useQuery } from "@tanstack/react-query";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";

export interface BiText { en: string; bn: string }

export interface FAQCategory {
  id: string;
  name: BiText;
  icon: string;
}

export interface FAQItem {
  id: number;
  category: string;
  question: BiText;
  answer: BiText;
}

export interface FAQContactInfo {
  title: BiText;
  description: BiText;
  phone: string;
  email: string;
}

export interface FAQData {
  hero: {
    title: BiText;
    subtitle: BiText;
    description: BiText;
    image: string;
  };
  categories: FAQCategory[];
  faqs: FAQItem[];
  contactInfo: FAQContactInfo;
}

const fetchFAQ = async (): Promise<FAQData> => {
  try {
    const res = await fetch(`${API_URL}/faq`, { cache: "no-store" });
    if (!res.ok) throw new Error("Failed to fetch FAQ data");
    const json = await res.json();
    return json.data as FAQData;
  } catch {
    const res = await fetch("/data/faq.json", { cache: "no-store" });
    if (!res.ok) throw new Error("Failed to fetch fallback FAQ data");
    return res.json();
  }
};

export const useFAQ = () =>
  useQuery<FAQData>({
    queryKey: ["faq"],
    queryFn: fetchFAQ,
    staleTime: 1000 * 60 * 15,
  });

export default useFAQ;
