"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { FaPhoneAlt, FaCheckCircle } from "react-icons/fa";
import { useLanguage } from "@/context/LanguageContext";

interface HomepageData {
  emergency: {
    phone: string;
    badge: { en: string; bn: string };
    heading: { en: string; bn: string };
    subheading: { en: string; bn: string };
    description: { en: string; bn: string };
    quickInfo: Array<{ en: string; bn: string }>;
  };
}

const fetchHomepage = async (): Promise<HomepageData> => {
  const res = await fetch("/data/homepage.json", { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch");
  return res.json();
};

const EmergencyContact = () => {
  const { data, isLoading } = useQuery<HomepageData>({
    queryKey: ["homepage"],
    queryFn: fetchHomepage,
    staleTime: 1000 * 60 * 10,
  });
  const { lang } = useLanguage();
  const e = data?.emergency;

  return (
    <section className="relative py-20 overflow-hidden">
      {/* Fixed background image with overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?w=1920&h=1080&fit=crop')",
          backgroundAttachment: "fixed",
        }}
      />
      <div className="absolute inset-0 bg-[#1E2B7A]/90" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">

          {/* Left — text */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            {/* Badge */}
            <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/10 text-white/80 rounded-full text-xs font-bold uppercase tracking-widest">
              <span className="w-2 h-2 bg-[#76BC21] rounded-full animate-pulse" />
              {isLoading ? "..." : lang === "bn" ? e?.badge.bn : e?.badge.en}
            </span>

            <h2 className="text-4xl lg:text-5xl font-extrabold text-white leading-tight">
              {isLoading ? "..." : lang === "bn" ? e?.heading.bn : e?.heading.en}
              <span className="block text-[#76BC21]">
                {isLoading ? "" : lang === "bn" ? e?.subheading.bn : e?.subheading.en}
              </span>
            </h2>

            <p className="text-white/70 text-lg leading-relaxed max-w-lg">
              {isLoading ? "" : lang === "bn" ? e?.description.bn : e?.description.en}
            </p>

            {!isLoading && e?.quickInfo && (
              <ul className="space-y-2 pt-2">
                {e.quickInfo.map((info, idx) => (
                  <li key={idx} className="flex items-center gap-3 text-white/80 text-sm font-medium">
                    <FaCheckCircle className="text-[#76BC21] shrink-0" />
                    {lang === "bn" ? info.bn : info.en}
                  </li>
                ))}
              </ul>
            )}
          </motion.div>

          {/* Right — phone card */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="flex justify-center lg:justify-end"
          >
            <div className="w-full max-w-sm bg-white/10 backdrop-blur-sm border border-white/20 rounded-3xl p-10 text-center space-y-6">
              {/* Icon */}
              <div className="mx-auto w-20 h-20 rounded-full bg-[#76BC21]/20 border-2 border-[#76BC21]/40 flex items-center justify-center">
                <FaPhoneAlt className="text-[#76BC21]" size={32} />
              </div>

              <div>
                <p className="text-white/60 text-sm font-semibold uppercase tracking-wider mb-2">
                  {lang === "bn" ? "জরুরি হেল্পলাইন" : "Emergency Helpline"}
                </p>
                <a
                  href={`tel:${e?.phone ?? ""}`}
                  className="block text-3xl lg:text-4xl font-black text-white tracking-wide hover:text-[#76BC21] transition-colors"
                >
                  {isLoading ? "..." : e?.phone}
                </a>
              </div>

              <a href={`tel:${e?.phone ?? ""}`} className="block">
                <button className="w-full py-4 bg-[#76BC21] hover:bg-[#67a81d] text-white rounded-2xl font-bold text-base transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl flex items-center justify-center gap-2">
                  <FaPhoneAlt size={16} />
                  {lang === "bn" ? "এখনই কল করুন" : "Call Now"}
                </button>
              </a>

              <p className="text-white/40 text-xs">
                {lang === "bn" ? "বিনামূল্যে · ২৪/৭ উপলব্ধ" : "Free · Available 24/7"}
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default EmergencyContact;
