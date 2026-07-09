"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { useDoctors } from "@/hooks/useDoctors";
import Link from "next/link";

// ── Fetcher ────────────────────────────────────────────────────────────────
const fetchDoctors = async (): Promise<Doctor[]> => {
  const res = await fetch("/data/doctors.json", { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch doctors");
  return res.json();
};

// ── Skeleton ───────────────────────────────────────────────────────────────
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

// ── Main Doctors ───────────────────────────────────────────────────────────
const Doctors = () => {
  const { data: doctors, isLoading, error } = useDoctors();

  return (
    <section className="relative py-20 lg:py-28 bg-white dark:bg-gray-900 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#76BC21]/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#1E2B7A]/5 rounded-full blur-3xl" />

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
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#76BC21]/10 text-[#76BC21] rounded-full text-sm font-semibold uppercase tracking-wide mb-4"
          >
            <FaUserMd />
            {lang === "bn" ? "আমাদের বিশেষজ্ঞ" : "Our Specialists"}
          </motion.div>

          <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white mb-4">
            {lang === "bn" ? (
              <>
                আমাদের <span className="text-[#1E2B7A] dark:text-[#76BC21]">বিশেষজ্ঞ ডাক্তার</span>
              </>
            ) : (
              <>
                Our Specialist <span className="text-[#1E2B7A] dark:text-[#76BC21]">Doctors</span>
              </>
            )}
          </h2>

          <div className="w-24 h-1.5 bg-gradient-to-r from-[#1E2B7A] to-[#76BC21] mx-auto rounded-full mb-6" />

          <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto text-lg leading-relaxed">
            {lang === "bn"
              ? "আপনার সুস্বাস্থ্যের জন্য নিবেদিত উচ্চ যোগ্যতাসম্পন্ন এবং অভিজ্ঞ চিকিৎসা পেশাদারদের আমাদের দলের সাথে দেখা করুন।"
              : "Meet our team of highly qualified and experienced medical professionals dedicated to your well-being."}
          </p>
        </motion.div>

        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-primary"></div>
          </div>
        ) : error || !doctors ? (
          <div className="text-center text-red-500 py-12 font-medium">
            Failed to load doctors.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {doctors.map((doctor, index) => (
              <motion.div
                key={doctor.id}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl border border-gray-100 transition-all duration-300 group flex flex-col"
              >
                <div className="relative h-64 overflow-hidden bg-gray-200">
                  <img
                    src={doctor.image}
                    alt={doctor.name}
                    className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-110"
                  />
                </div>
                <div className="p-6 flex flex-col flex-grow">
                  <h3 className="text-xl font-bold text-gray-900 mb-1">{doctor.name}</h3>
                  <p className="text-secondary font-medium mb-2">{doctor.specialization}</p>
                  <div className="inline-block self-start bg-tertiary/20 text-tertiary-dark px-3 py-1 rounded-full text-sm font-semibold mb-4 text-cyan-800 bg-cyan-100">
                    {doctor.experience}
                  </div>
                  <p className="text-gray-600 text-sm mb-6 line-clamp-3 flex-grow">
                    {doctor.about}
                  </p>
                  <Link href={`/doctors/${doctor.slug}`} className="text-center w-full py-2.5 border border-primary text-primary hover:bg-primary hover:text-white rounded-xl font-medium transition-colors duration-300 block">
                    View Details
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default Doctors;
