"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { FaCalendarAlt, FaArrowRight, FaCheckCircle, FaUserMd } from "react-icons/fa";
import { useLanguage } from "@/context/LanguageContext";
import Link from "next/link";

interface HomepageData {
  appointmentCTA: {
    badge: { en: string; bn: string };
    heading: { en: string; bn: string };
    description: { en: string; bn: string };
    primaryBtn: { en: string; bn: string; link: string };
    secondaryBtn: { en: string; bn: string; link: string };
    features: Array<{ en: string; bn: string }>;
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
    console.warn("Backend API not reachable for appointment CTA data. Falling back to local data/homepage.json", error);
    const res = await fetch("/data/homepage.json", { cache: "no-store" });
    if (!res.ok) throw new Error("Failed to fetch fallback homepage data");
    return res.json();
  }
};

const AppointmentCTA = () => {
  const { data, isLoading } = useQuery<HomepageData>({
    queryKey: ["homepage"],
    queryFn: fetchHomepage,
    staleTime: 1000 * 60 * 10,
  });
  const { lang } = useLanguage();
  const cta = data?.appointmentCTA;

  return (
    <section className="py-20 bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-14"
        >
          <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#76BC21]/10 text-[#76BC21] rounded-full text-xs font-bold uppercase tracking-widest mb-4">
            <FaCalendarAlt size={12} />
            {isLoading ? "..." : lang === "bn" ? cta?.badge.bn : cta?.badge.en}
          </span>

          <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white mb-4 leading-tight">
            {isLoading ? "..." : (
              lang === "bn" ? (
                <>
                  আজই আপনার{" "}
                  <span className="text-[#1E2B7A] dark:text-[#76BC21]">অ্যাপয়েন্টমেন্ট</span>{" "}
                  বুক করুন
                </>
              ) : (
                <>
                  Book Your{" "}
                  <span className="text-[#1E2B7A] dark:text-[#76BC21]">Appointment</span>{" "}
                  Today
                </>
              )
            )}
          </h2>

          <div className="w-20 h-1.5 bg-gradient-to-r from-[#1E2B7A] to-[#76BC21] mx-auto rounded-full mb-5" />

          <p className="text-gray-600 dark:text-gray-300 text-lg max-w-2xl mx-auto leading-relaxed">
            {isLoading ? "" : lang === "bn" ? cta?.description.bn : cta?.description.en}
          </p>
        </motion.div>

        {/* Main card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl border border-gray-100 dark:border-gray-700 overflow-hidden"
        >
          <div className="grid lg:grid-cols-2">
            {/* Left — features */}
            <div className="p-10 lg:p-14 border-b lg:border-b-0 lg:border-r border-gray-100 dark:border-gray-700">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-14 h-14 rounded-2xl bg-[#1E2B7A] flex items-center justify-center shadow-md">
                  <FaCalendarAlt className="text-white" size={22} />
                </div>
                <div>
                  <p className="font-bold text-gray-900 dark:text-white text-lg">
                    {lang === "bn" ? "সহজ অ্যাপয়েন্টমেন্ট" : "Easy Appointment"}
                  </p>
                  <p className="text-gray-500 dark:text-gray-400 text-sm">
                    {lang === "bn" ? "মাত্র কয়েক মিনিটে বুক করুন" : "Book in just a few minutes"}
                  </p>
                </div>
              </div>

              {!isLoading && cta?.features && (
                <ul className="space-y-4 mb-10">
                  {cta.features.map((f, idx) => (
                    <li key={idx} className="flex items-center gap-3">
                      <div className="w-6 h-6 rounded-full bg-[#76BC21]/15 flex items-center justify-center shrink-0">
                        <FaCheckCircle className="text-[#76BC21]" size={13} />
                      </div>
                      <span className="text-gray-700 dark:text-gray-300 font-medium">
                        {lang === "bn" ? f.bn : f.en}
                      </span>
                    </li>
                  ))}
                </ul>
              )}

              {!isLoading && cta && (
                <div className="flex flex-wrap gap-3">
                  <Link href={cta.primaryBtn.link}>
                    <button className="group px-7 py-3.5 bg-[#1E2B7A] hover:bg-[#76BC21] text-white rounded-xl font-bold transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg flex items-center gap-2">
                      <FaCalendarAlt size={15} />
                      {lang === "bn" ? cta.primaryBtn.bn : cta.primaryBtn.en}
                      <FaArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                  </Link>
                  <Link href={cta.secondaryBtn.link}>
                    <button className="px-7 py-3.5 border-2 border-[#1E2B7A] dark:border-[#76BC21] text-[#1E2B7A] dark:text-[#76BC21] hover:bg-[#1E2B7A] dark:hover:bg-[#76BC21] hover:text-white dark:hover:text-white rounded-xl font-bold transition-all duration-300 flex items-center gap-2">
                      <FaUserMd size={15} />
                      {lang === "bn" ? cta.secondaryBtn.bn : cta.secondaryBtn.en}
                    </button>
                  </Link>
                </div>
              )}
            </div>

            {/* Right — time slots visual */}
            <div className="p-10 lg:p-14 bg-gray-50/60 dark:bg-gray-900/40">
              <p className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-6">
                {lang === "bn" ? "আজকের উপলব্ধ স্লট" : "Today's Available Slots"}
              </p>

              <div className="space-y-3">
                {[
                  { time: "9:00 AM",  status: "available" },
                  { time: "11:00 AM", status: "booked"    },
                  { time: "2:00 PM",  status: "available" },
                  { time: "4:30 PM",  status: "available" },
                  { time: "6:00 PM",  status: "booked"    },
                ].map((slot, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.07 }}
                    className={[
                      "flex items-center justify-between px-5 py-3.5 rounded-xl border font-medium text-sm transition-colors",
                      slot.status === "available"
                        ? "border-[#76BC21]/30 bg-[#76BC21]/8 dark:bg-[#76BC21]/10"
                        : "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 opacity-50",
                    ].join(" ")}
                  >
                    <span className="text-gray-800 dark:text-gray-200">{slot.time}</span>
                    <span
                      className={[
                        "text-xs font-bold px-3 py-1 rounded-full",
                        slot.status === "available"
                          ? "bg-[#76BC21]/15 text-[#76BC21]"
                          : "bg-gray-100 dark:bg-gray-700 text-gray-400",
                      ].join(" ")}
                    >
                      {slot.status === "available"
                        ? (lang === "bn" ? "উপলব্ধ" : "Available")
                        : (lang === "bn" ? "বুকড" : "Booked")}
                    </span>
                  </motion.div>
                ))}
              </div>

              <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#1E2B7A]/10 dark:bg-[#1E2B7A]/20 flex items-center justify-center">
                  <FaUserMd className="text-[#1E2B7A] dark:text-[#76BC21]" size={16} />
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  {lang === "bn"
                    ? "৪+ বিশেষজ্ঞ ডাক্তার আজ উপলব্ধ"
                    : "4+ specialist doctors available today"}
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default AppointmentCTA;
