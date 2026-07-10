"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { FaUsers, FaUserMd, FaAward, FaAmbulance } from "react-icons/fa";
import { useLanguage } from "@/context/LanguageContext";

interface StatItem {
  number: string;
  label: { en: string; bn: string };
  icon: string;
  color: string;
}

interface HomepageData {
  statistics: {
    sectionBadge: { en: string; bn: string };
    heading: { en: string; bn: string };
    description: { en: string; bn: string };
    stats: StatItem[];
  };
}

const fetchHomepage = async (): Promise<HomepageData> => {
  try {
    const res = await fetch("http://localhost:5000/api/homepage", { cache: "no-store" });
    if (!res.ok) throw new Error("API responded with an error status");
    const result = await res.json();
    if (result.success && result.data) return result.data;
    throw new Error(result.message || "Invalid API response");
  } catch (error) {
    console.warn("Backend API not reachable for statistics data. Falling back to local data/homepage.json", error);
    const res = await fetch("/data/homepage.json", { cache: "no-store" });
    if (!res.ok) throw new Error("Failed to fetch fallback homepage data");
    return res.json();
  }
};

const iconMap: Record<string, React.ReactNode> = {
  FaUsers: <FaUsers size={32} />,
  FaUserMd: <FaUserMd size={32} />,
  FaAward: <FaAward size={32} />,
  FaAmbulance: <FaAmbulance size={32} />,
};

const Statistics = () => {
  const { data, isLoading } = useQuery<HomepageData>({
    queryKey: ["homepage"],
    queryFn: fetchHomepage,
    staleTime: 1000 * 60 * 10,
  });
  const { lang } = useLanguage();

  const section = data?.statistics;

  return (
    <section className="relative py-24 bg-white dark:bg-gray-900 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#1E2B7A] via-[#76BC21] to-[#1E2B7A]" />
      <div className="absolute top-0 left-1/3 w-96 h-96 bg-[#1E2B7A]/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/3 w-96 h-96 bg-[#76BC21]/5 rounded-full blur-3xl" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#76BC21]/10 text-[#76BC21] rounded-full text-sm font-bold uppercase tracking-wide mb-4">
            <span className="w-1.5 h-1.5 bg-[#76BC21] rounded-full" />
            {isLoading ? "..." : lang === "bn" ? section?.sectionBadge.bn : section?.sectionBadge.en}
          </div>

          <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white mb-4">
            {isLoading ? "..." : (
              lang === "bn" ? (
                <>
                  <span className="text-[#1E2B7A] dark:text-[#76BC21]">হাজারো</span> মানুষের বিশ্বাস
                </>
              ) : (
                <>
                  Trusted by{" "}
                  <span className="text-[#1E2B7A] dark:text-[#76BC21]">Thousands</span>
                </>
              )
            )}
          </h2>

          <div className="w-24 h-1.5 bg-gradient-to-r from-[#1E2B7A] to-[#76BC21] mx-auto rounded-full mb-6" />

          <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto text-lg leading-relaxed">
            {isLoading ? "" : lang === "bn" ? section?.description.bn : section?.description.en}
          </p>
        </motion.div>

        {/* Stats Grid */}
        {isLoading ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-56 bg-gray-100 dark:bg-gray-800 rounded-3xl animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {section?.stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group"
              >
                <div className="relative bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-lg hover:shadow-2xl border border-gray-100 dark:border-gray-700 hover:border-transparent transition-all duration-500 hover:-translate-y-2 text-center overflow-hidden">
                  {/* Hover background gradient */}
                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl"
                    style={{ background: `linear-gradient(135deg, ${stat.color}15 0%, transparent 100%)` }}
                  />

                  {/* Icon */}
                  <div className="relative z-10 flex justify-center mb-6">
                    <motion.div
                      whileHover={{ rotate: [0, -10, 10, 0], scale: 1.1 }}
                      transition={{ duration: 0.5 }}
                      className="w-20 h-20 rounded-2xl flex items-center justify-center shadow-lg"
                      style={{ backgroundColor: stat.color }}
                    >
                      <div className="text-white">
                        {iconMap[stat.icon]}
                      </div>
                    </motion.div>
                  </div>

                  {/* Number */}
                  <div className="relative z-10">
                    <motion.h3
                      initial={{ opacity: 0, scale: 0.5 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.6, delay: index * 0.1 + 0.3, type: "spring" }}
                      className="text-4xl lg:text-5xl font-black text-gray-900 dark:text-white mb-2"
                      style={{ color: stat.color }}
                    >
                      {stat.number}
                    </motion.h3>
                    <p className="text-gray-600 dark:text-gray-300 font-semibold text-base">
                      {lang === "bn" ? stat.label.bn : stat.label.en}
                    </p>
                  </div>

                  {/* Decorative corner */}
                  <div
                    className="absolute -bottom-8 -right-8 w-24 h-24 rounded-full opacity-10 group-hover:opacity-20 transition-opacity duration-500"
                    style={{ backgroundColor: stat.color }}
                  />
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default Statistics;
