"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { motion } from "framer-motion";
import { FaUserMd, FaCalendarAlt, FaCheckCircle } from "react-icons/fa";
import { useLanguage } from "@/context/LanguageContext";

interface Doctor {
  id: number;
  name: { en: string; bn: string };
  slug: string;
  specialization: { en: string; bn: string };
  qualification: string;
  experience: { en: string; bn: string };
  department: { en: string; bn: string };
  designation: { en: string; bn: string };
  image: string;
  phone: string;
  email: string;
  chamberTime: { en: string; bn: string };
  consultationFee: number;
  languages: string[];
  about: { en: string; bn: string };
  services: Array<{ en: string; bn: string }>;
  available: boolean;
}

const fetchDoctors = async (): Promise<Doctor[]> => {
  const res = await fetch("/data/doctors.json", { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch doctors");
  return res.json();
};

export default function DoctorDirectoryPage() {
  const { data: doctors, isLoading, isError } = useQuery({
    queryKey: ["doctors"],
    queryFn: fetchDoctors,
  });
  const { lang } = useLanguage();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 pt-20 pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 space-y-4 animate-pulse">
            <div className="h-12 w-80 bg-gray-200 dark:bg-gray-700 rounded-xl mx-auto" />
            <div className="h-5 w-96 bg-gray-200 dark:bg-gray-700 rounded mx-auto" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-[480px] bg-gray-200 dark:bg-gray-700 rounded-3xl animate-pulse" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (isError || !doctors) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <p className="text-red-500 font-medium text-lg">
          {lang === "bn" ? "ডাক্তার তালিকা লোড করতে ব্যর্থ।" : "Error loading doctor directory."}
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-50 dark:from-gray-900 dark:via-gray-850 dark:to-gray-900 relative overflow-hidden pt-16 pb-24">
      {/* Decorative blobs */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-[#1E2B7A]/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-[#76BC21]/5 rounded-full blur-3xl translate-x-1/3 translate-y-1/3 pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#76BC21]/10 text-[#76BC21] rounded-full text-sm font-bold uppercase tracking-wide mb-4">
            <FaUserMd />
            {lang === "bn" ? "আমাদের বিশেষজ্ঞ" : "Our Specialists"}
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white mb-4">
            {lang === "bn" ? (
              <>আমাদের <span className="text-[#1E2B7A] dark:text-[#76BC21]">ডাক্তার তালিকা</span></>
            ) : (
              <>Our <span className="text-[#1E2B7A] dark:text-[#76BC21]">Doctor Directory</span></>
            )}
          </h1>
          <div className="w-24 h-1.5 bg-gradient-to-r from-[#1E2B7A] to-[#76BC21] mx-auto rounded-full mb-6" />
          <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
            {lang === "bn"
              ? "আমাদের অভিজ্ঞ ও নিবেদিত চিকিৎসা পেশাদারদের সাথে পরিচিত হন।"
              : "Meet our experienced and dedicated team of medical professionals."}
          </p>
        </motion.div>

        {/* Doctors Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {doctors.map((doctor, index) => (
            <motion.div
              key={doctor.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group"
            >
              <div className="h-full bg-white dark:bg-gray-800 rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl border border-gray-100 dark:border-gray-700 hover:border-[#76BC21]/30 transition-all duration-500 hover:-translate-y-2 flex flex-col">
                {/* Image */}
                <div className="relative h-72 overflow-hidden bg-gradient-to-b from-[#1E2B7A]/5 to-transparent">
                  <img
                    src={doctor.image}
                    alt={lang === "bn" ? doctor.name.bn : doctor.name.en}
                    className="w-full h-full object-cover object-top group-hover:scale-110 transition-transform duration-700"
                    onError={(e) => {
                      e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                        lang === "bn" ? doctor.name.bn : doctor.name.en
                      )}&background=1E2B7A&color=fff&size=512`;
                    }}
                  />
                  {/* Available badge */}
                  {doctor.available && (
                    <div className="absolute top-4 right-4 flex items-center gap-1.5 px-3 py-1.5 bg-[#76BC21] text-white rounded-full text-xs font-bold shadow-lg">
                      <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
                      {lang === "bn" ? "উপলব্ধ" : "Available"}
                    </div>
                  )}
                  {/* Department badge */}
                  <div className="absolute bottom-4 left-4 px-3 py-1.5 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-full text-xs font-bold text-[#1E2B7A] dark:text-[#76BC21]">
                    {lang === "bn" ? doctor.department.bn : doctor.department.en}
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 flex flex-col flex-grow">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1 group-hover:text-[#1E2B7A] dark:group-hover:text-[#76BC21] transition-colors">
                    {lang === "bn" ? doctor.name.bn : doctor.name.en}
                  </h3>
                  <p className="text-[#76BC21] font-semibold text-sm flex items-center gap-1.5 mb-2">
                    <FaCheckCircle size={12} />
                    {lang === "bn" ? doctor.specialization.bn : doctor.specialization.en}
                  </p>
                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                    {doctor.qualification}
                  </p>

                  {/* Experience & Fee */}
                  <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100 dark:border-gray-700">
                    <div className="flex items-center gap-2 text-sm">
                      <div className="w-8 h-8 rounded-lg bg-[#1E2B7A]/10 dark:bg-[#1E2B7A]/20 flex items-center justify-center">
                        <FaCalendarAlt className="text-[#1E2B7A] dark:text-[#76BC21] text-xs" />
                      </div>
                      <span className="text-gray-600 dark:text-gray-400 font-medium">
                        {lang === "bn" ? doctor.experience.bn : doctor.experience.en}
                      </span>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-400">{lang === "bn" ? "পরামর্শ ফি" : "Fee"}</p>
                      <p className="text-lg font-bold text-[#1E2B7A] dark:text-[#76BC21]">
                        ৳{doctor.consultationFee}
                      </p>
                    </div>
                  </div>

                  {/* View Profile Button */}
                  <Link href={`/doctors/${doctor.slug}`}>
                    <button className="w-full mt-4 py-3 bg-gradient-to-r from-[#1E2B7A] to-[#2c3e7a] group-hover:from-[#76BC21] group-hover:to-[#67a81d] text-white rounded-xl font-semibold text-sm transition-all duration-300 shadow-md group-hover:shadow-lg">
                      {lang === "bn" ? "বিস্তারিত দেখুন" : "View Profile"}
                    </button>
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
