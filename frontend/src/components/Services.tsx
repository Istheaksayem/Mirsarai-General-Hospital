"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { FaAmbulance, FaStethoscope, FaHeartbeat, FaBone, FaBaby, FaMicroscope, FaArrowRight } from "react-icons/fa";
import { useLanguage } from "@/context/LanguageContext";
import Link from "next/link";

// ── Types ──────────────────────────────────────────────────────────────────
interface Service {
  id: number;
  title: { en: string; bn: string };
  description: { en: string; bn: string };
  icon: string;
  color: string;
  link: string;
}

// ── Icon Map ───────────────────────────────────────────────────────────────
const iconMap: Record<string, React.ReactNode> = {
  FaAmbulance: <FaAmbulance />,
  FaStethoscope: <FaStethoscope />,
  FaHeartbeat: <FaHeartbeat />,
  FaBone: <FaBone />,
  FaBaby: <FaBaby />,
  FaMicroscope: <FaMicroscope />,
};

// ── Fetcher ────────────────────────────────────────────────────────────────
const fetchServices = async (): Promise<Service[]> => {
  const res = await fetch("/data/services.json", { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch services");
  return res.json();
};

// ── Skeleton ───────────────────────────────────────────────────────────────
const ServicesSkeleton = () => (
  <section className="py-20 bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-16 space-y-4 animate-pulse">
        <div className="h-10 w-64 bg-gray-200 dark:bg-gray-700 rounded-lg mx-auto" />
        <div className="h-4 w-96 bg-gray-200 dark:bg-gray-700 rounded mx-auto" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="h-64 bg-gray-200 dark:bg-gray-700 rounded-2xl animate-pulse" />
        ))}
      </div>
    </div>
  </section>
);

// ── Main Services ──────────────────────────────────────────────────────────
const Services = () => {
  const { data: services, isLoading, isError } = useQuery<Service[]>({
    queryKey: ["services"],
    queryFn: fetchServices,
    staleTime: 1000 * 60 * 10,
  });
  const { lang } = useLanguage();

  if (isLoading) return <ServicesSkeleton />;
  if (isError || !services) {
    return (
      <section className="py-20 bg-gray-50 dark:bg-gray-900">
        <div className="text-center text-gray-600 dark:text-gray-400">
          {lang === "bn" ? "সেবাসমূহ লোড করতে ব্যর্থ।" : "Failed to load services."}
        </div>
      </section>
    );
  }

  return (
    <section className="relative py-20 lg:py-28 bg-gradient-to-b from-white via-blue-50/30 to-white dark:from-gray-900 dark:via-gray-850 dark:to-gray-900 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-20 right-0 w-96 h-96 bg-[#1E2B7A]/5 rounded-full blur-3xl" />
      <div className="absolute bottom-20 left-0 w-96 h-96 bg-[#76BC21]/5 rounded-full blur-3xl" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="inline-block mb-4"
          >
            <span className="px-4 py-2 bg-[#1E2B7A]/10 text-[#1E2B7A] dark:bg-[#1E2B7A]/20 dark:text-blue-400 rounded-full text-sm font-semibold uppercase tracking-wide">
              {lang === "bn" ? "আমাদের সেবা" : "Our Services"}
            </span>
          </motion.div>

          <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white mb-4">
            {lang === "bn" ? (
              <>
                আমাদের <span className="text-[#1E2B7A] dark:text-[#76BC21]">চিকিৎসা সেবা</span>
              </>
            ) : (
              <>
                Our Medical <span className="text-[#1E2B7A] dark:text-[#76BC21]">Services</span>
              </>
            )}
          </h2>

          <div className="w-24 h-1.5 bg-gradient-to-r from-[#1E2B7A] to-[#76BC21] mx-auto rounded-full mb-6" />

          <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto text-lg leading-relaxed">
            {lang === "bn"
              ? "আমরা আপনার এবং আপনার পরিবারের সর্বোত্তম সেবা নিশ্চিত করতে বিস্তৃত চিকিৎসা সেবা প্রদান করি।"
              : "We offer a wide range of medical services to ensure that you and your family receive the best possible care."}
          </p>
        </motion.div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {services.map((service, index) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group"
            >
              <Link href={service.link}>
                <div className="relative h-full bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg hover:shadow-2xl border border-gray-100 dark:border-gray-700 transition-all duration-300 hover:-translate-y-2 overflow-hidden">
                  {/* Gradient overlay on hover */}
                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-300 rounded-2xl"
                    style={{ background: `linear-gradient(135deg, ${service.color} 0%, transparent 100%)` }}
                  />

                  {/* Icon */}
                  <div className="relative z-10 mb-6">
                    <div
                      className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl text-white shadow-lg transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-300"
                      style={{ backgroundColor: service.color }}
                    >
                      {iconMap[service.icon]}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="relative z-10">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-[#1E2B7A] dark:group-hover:text-[#76BC21] transition-colors">
                      {lang === "bn" ? service.title.bn : service.title.en}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
                      {lang === "bn" ? service.description.bn : service.description.en}
                    </p>

                    {/* Learn More Link */}
                    <div className="flex items-center gap-2 text-sm font-semibold text-[#1E2B7A] dark:text-[#76BC21] group-hover:gap-3 transition-all">
                      {lang === "bn" ? "আরও জানুন" : "Learn More"}
                      <FaArrowRight className="text-xs group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>

                  {/* Decorative corner */}
                  <div
                    className="absolute -top-6 -right-6 w-24 h-24 rounded-full opacity-10 group-hover:opacity-20 transition-opacity duration-300"
                    style={{ backgroundColor: service.color }}
                  />
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* View All Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-center mt-12"
        >
          <Link href="/departments">
            <button className="group px-8 py-4 bg-gradient-to-r from-[#1E2B7A] to-[#2c3e7a] hover:from-[#76BC21] hover:to-[#67a81d] text-white rounded-xl font-semibold shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
              <span className="flex items-center gap-3">
                {lang === "bn" ? "সকল সেবা দেখুন" : "View All Services"}
                <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
              </span>
            </button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default Services;
