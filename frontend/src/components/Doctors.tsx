"use client";

import React from "react";
import { motion } from "framer-motion";
import { FaUserMd, FaCalendarAlt, FaArrowRight, FaCheckCircle } from "react-icons/fa";
import { useLanguage } from "@/context/LanguageContext";
import { useDoctors } from "@/hooks/useDoctors";
import Link from "next/link";
import Image from "next/image";

const DoctorsSkeleton = () => (
  <section className="py-20 bg-white dark:bg-gray-900">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-16 space-y-4 animate-pulse">
        <div className="h-10 w-80 bg-gray-200 dark:bg-gray-700 rounded-lg mx-auto" />
        <div className="h-4 w-96 bg-gray-200 dark:bg-gray-700 rounded mx-auto" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-[480px] bg-gray-200 dark:bg-gray-700 rounded-3xl animate-pulse" />
        ))}
      </div>
    </div>
  </section>
);

const Doctors = () => {
  const { data: doctors, isLoading, isError } = useDoctors();
  const { lang } = useLanguage();

  if (isLoading) return <DoctorsSkeleton />;
  if (isError || !doctors) {
    return (
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="text-center text-gray-600 dark:text-gray-400">
          {lang === "bn" ? "ডাক্তার তালিকা লোড করতে ব্যর্থ।" : "Failed to load doctors."}
        </div>
      </section>
    );
  }

  return (
    <section className="relative py-20 lg:py-28 bg-white dark:bg-gray-900 overflow-hidden">
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#76BC21]/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#1E2B7A]/5 rounded-full blur-3xl" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#76BC21]/10 text-[#76BC21] rounded-full text-sm font-semibold uppercase tracking-wide mb-4">
            <FaUserMd />
            {lang === "bn" ? "আমাদের বিশেষজ্ঞ" : "Our Specialists"}
          </div>
          <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white mb-4">
            {lang === "bn" ? (
              <>আমাদের <span className="text-[#1E2B7A] dark:text-[#76BC21]">বিশেষজ্ঞ ডাক্তার</span></>
            ) : (
              <>Our Specialist <span className="text-[#1E2B7A] dark:text-[#76BC21]">Doctors</span></>
            )}
          </h2>
          <div className="w-24 h-1.5 bg-gradient-to-r from-[#1E2B7A] to-[#76BC21] mx-auto rounded-full mb-6" />
          <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto text-lg leading-relaxed">
            {lang === "bn"
              ? "আপনার সুস্বাস্থ্যের জন্য নিবেদিত উচ্চ যোগ্যতাসম্পন্ন এবং অভিজ্ঞ চিকিৎসা পেশাদারদের আমাদের দলের সাথে দেখা করুন।"
              : "Meet our team of highly qualified and experienced medical professionals dedicated to your well-being."}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {doctors.map((doctor, index) => (
            <motion.div
              key={doctor.slug}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group"
            >
              <Link href={`/doctors/${doctor.slug}`}>
                <div className="relative h-full bg-gradient-to-b from-white to-gray-50 dark:from-gray-800 dark:to-gray-850 rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100 dark:border-gray-700 hover:border-[#76BC21]/30">
                  <div className="relative h-80 overflow-hidden bg-gradient-to-b from-[#1E2B7A]/5 to-transparent">
                    <Image
                      src={doctor.image?.trim() || "/images/doctor-placeholder.svg"}
                      alt={lang === "bn" ? doctor.name.bn : doctor.name.en}
                      width={400}
                      height={500}
                      className="w-full h-full object-cover object-top group-hover:scale-110 transition-transform duration-700"
                    />
                    {doctor.available && (
                      <div className="absolute top-4 right-4 flex items-center gap-2 px-3 py-1.5 bg-[#76BC21] text-white rounded-full text-xs font-bold shadow-lg">
                        <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
                        {lang === "bn" ? "উপলব্ধ" : "Available"}
                      </div>
                    )}
                    <div className="absolute bottom-4 left-4 px-3 py-1.5 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-full text-xs font-bold text-[#1E2B7A] dark:text-[#76BC21]">
                      {lang === "bn" ? doctor.department.bn : doctor.department.en}
                    </div>
                  </div>

                  <div className="p-6 space-y-3">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-[#1E2B7A] dark:group-hover:text-[#76BC21] transition-colors line-clamp-1">
                      {lang === "bn" ? doctor.name.bn : doctor.name.en}
                    </h3>
                    <p className="text-[#76BC21] font-semibold text-sm flex items-center gap-2">
                      <FaCheckCircle className="shrink-0" />
                      {lang === "bn" ? doctor.specialization.bn : doctor.specialization.en}
                    </p>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">{doctor.qualification}</p>
                    <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-gray-700">
                      <div className="flex items-center gap-1.5 text-sm">
                        <div className="w-8 h-8 rounded-lg bg-[#1E2B7A]/10 dark:bg-[#1E2B7A]/20 flex items-center justify-center">
                          <FaCalendarAlt className="text-[#1E2B7A] dark:text-[#76BC21] text-xs" />
                        </div>
                        <span className="text-gray-600 dark:text-gray-400 font-medium">
                          {lang === "bn"
                            ? (doctor.experience?.bn || "অভিজ্ঞ")
                            : (doctor.experience?.en || "Experienced")}
                        </span>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-gray-400">{lang === "bn" ? "পরামর্শ ফি" : "Fee"}</p>
                        <p className="text-lg font-bold text-[#1E2B7A] dark:text-[#76BC21]">৳{doctor.consultationFee}</p>
                      </div>
                    </div>
                    <button className="w-full mt-4 py-3 bg-gradient-to-r from-[#1E2B7A] to-[#2c3e7a] group-hover:from-[#76BC21] group-hover:to-[#67a81d] text-white rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-all duration-300 shadow-md">
                      {lang === "bn" ? "বিস্তারিত দেখুন" : "View Profile"}
                      <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-center mt-12"
        >
          <Link href="/doctors">
            <button className="group px-8 py-4 bg-white dark:bg-gray-800 border-2 border-[#1E2B7A] dark:border-[#76BC21] text-[#1E2B7A] dark:text-[#76BC21] hover:bg-[#1E2B7A] dark:hover:bg-[#76BC21] hover:text-white dark:hover:text-white rounded-xl font-semibold shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
              <span className="flex items-center gap-3">
                {lang === "bn" ? "সকল ডাক্তার দেখুন" : "View All Doctors"}
                <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
              </span>
            </button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default Doctors;
