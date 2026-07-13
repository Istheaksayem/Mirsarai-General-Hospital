"use client";

import { useQuery } from "@tanstack/react-query";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";

export interface BiText { en: string; bn: string }

export interface BlogPost {
  id: number;
  category: string;
  title: BiText;
  excerpt: BiText;
  author: BiText;
  date: string;
  readTime: BiText;
  image: string;
}

export interface BlogCategory {
  id: string;
  name: BiText;
}

export interface BlogTag {
  en: string;
  bn: string;
}

export interface HealthBlogData {
  hero: {
    title: BiText;
    subtitle: BiText;
    description: BiText;
    image: string;
  };
  categories: BlogCategory[];
  posts: BlogPost[];
  tags: BlogTag[];
}

const fetchHealthBlog = async (): Promise<HealthBlogData> => {
  try {
    const res = await fetch(`${API_URL}/health-blog`, { cache: "no-store" });
    if (!res.ok) throw new Error("Failed to fetch health blog data");
    const json = await res.json();
    return json.data as HealthBlogData;
  } catch {
    const res = await fetch("/data/healthBlog.json", { cache: "no-store" });
    if (!res.ok) throw new Error("Failed to fetch fallback health blog data");
    return res.json();
  }
};

export const useHealthBlog = () =>
  useQuery<HealthBlogData>({
    queryKey: ["healthBlog"],
    queryFn: fetchHealthBlog,
    staleTime: 1000 * 60 * 15,
  });

export default useHealthBlog;
