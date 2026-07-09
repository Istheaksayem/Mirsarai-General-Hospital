"use client";

import React, { use } from "react";
import { useQuery } from "@tanstack/react-query";
import { notFound } from "next/navigation";
import { motion } from "framer-motion";
import {
  FaGraduationCap,
  FaBriefcase,
  FaMoneyBillWave,
  FaClock,
  FaCheckCircle,
  FaGlobe,
  FaPhoneAlt,
  FaEnvelope,
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaStar,
  FaEdit,
  FaUserMd,
} from "react-icons/fa";
import { useLanguage } from "@/context/LanguageContext";
import Link from "next/link";

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

export default function DoctorProfilePage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = use(params);
  const { lang } = useLanguage();

  const { data: doctors, isLoading, isError } = useQuery({
    queryKey: ["doctors"],
    queryFn: fetchDoctors,
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[80vh] bg-gray-50 dark:bg-gray-900">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-[#1E2B7A]" />
          <p className="text-gray-600 dark:text-gray-400 font-medium">
            {lang === "bn" ? "লোড হচ্ছে..." : "Loading..."}
          </p>
        </div>
      </div>
    );
  }

  if (isError || !doctors) {
    return (
      <div className="flex justify-center items-center min-h-[80vh] bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <p className="text-red-500 font-medium text-lg mb-4">
            {lang === "bn" ? "ডাক্তারের প্রোফাইল লোড করতে ব্যর্থ।" : "Error loading doctor profile."}
          </p>
          <Link href="/doctors">
            <button className="px-6 py-3 bg-[#1E2B7A] text-white rounded-lg font-semibold hover:bg-[#76BC21] transition-colors">
              {lang === "bn" ? "ফিরে যান" : "Go Back"}
            </button>
          </Link>
        </div>
      </div>
    );
  }

  const doctor = doctors.find((d) => d.slug === resolvedParams.slug);

  if (!doctor) {
    return notFound();
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] pt-12 pb-24 relative overflow-hidden">
      {/* Decorative Blobs */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[120px] translate-x-1/3 -translate-y-1/3 pointer-events-none z-0"></div>
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-secondary/10 rounded-full blur-[100px] -translate-x-1/4 translate-y-1/4 pointer-events-none z-0"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Profile Header Card */}
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.7, ease: "easeOut", type: "spring", bounce: 0.4 }}
          className="bg-white/80 backdrop-blur-2xl rounded-[2rem] shadow-[0_8px_40px_rgb(0,0,0,0.06)] border border-white overflow-hidden mb-12 relative"
        >
          <div className="flex flex-col md:flex-row">
            {/* Image */}
            <div className="w-full md:w-1/3 lg:w-1/4 relative h-80 md:h-auto bg-gray-100">
              <img
                src={doctor.image}
                alt={doctor.name}
                className="w-full h-full object-cover object-top"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(doctor.name)}&background=0D8ABC&color=fff&size=512`;
                }}
              />
              {doctor.available && (
                <div className="absolute top-4 left-4 bg-green-500 text-white text-sm font-bold px-4 py-1.5 rounded-full z-20 shadow-md flex items-center gap-2">
                  <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
                  Available Today
                </div>
              </div>

              {/* Info */}
              <div className="p-6 space-y-6">
                {/* Name & Title */}
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                    {lang === "bn" ? doctor.name.bn : doctor.name.en}
                  </h1>
                  <p className="text-gray-500 dark:text-gray-400 text-sm">
                    {lang === "bn" ? doctor.designation.bn : doctor.designation.en}
                  </p>
                </div>

                {/* Contact Info */}
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-gray-50 dark:bg-gray-900 flex items-center justify-center shrink-0 mt-0.5">
                      <FaMapMarkerAlt className="text-[#1E2B7A] dark:text-[#76BC21]" size={16} />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs text-gray-400 font-semibold uppercase mb-1">
                        {lang === "bn" ? "ঠিকানা" : "Address"}
                      </p>
                      <p className="text-sm text-gray-700 dark:text-gray-300">
                        {lang === "bn" ? "মীরসরাই জেনারেল হাসপাতাল" : "Mirsarai General Hospital"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-gray-50 dark:bg-gray-900 flex items-center justify-center shrink-0">
                      <FaPhoneAlt className="text-[#76BC21]" size={14} />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs text-gray-400 font-semibold uppercase mb-1">
                        {lang === "bn" ? "ফোন নম্বর" : "Phone number"}
                      </p>
                      <a href={`tel:${doctor.phone}`} className="text-sm text-gray-700 dark:text-gray-300 hover:text-[#1E2B7A] dark:hover:text-[#76BC21] transition-colors">
                        {doctor.phone}
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-gray-50 dark:bg-gray-900 flex items-center justify-center shrink-0">
                      <FaEnvelope className="text-[#1E2B7A] dark:text-[#76BC21]" size={14} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-gray-400 font-semibold uppercase mb-1">
                        {lang === "bn" ? "ইমেইল" : "Email"}
                      </p>
                      <a href={`mailto:${doctor.email}`} className="text-sm text-gray-700 dark:text-gray-300 hover:text-[#1E2B7A] dark:hover:text-[#76BC21] transition-colors truncate block">
                        {doctor.email}
                      </a>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="pt-4 space-y-2">
                  <Link href="/appointment" className="block">
                    <button className="w-full py-3.5 bg-gradient-to-r from-[#76BC21] to-[#67a81d] hover:from-[#67a81d] hover:to-[#76BC21] text-white rounded-xl font-bold shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5 flex items-center justify-center gap-2">
                      <FaCalendarAlt />
                      {lang === "bn" ? "অ্যাপয়েন্টমেন্ট বুক করুন" : "Book Appointment"}
                    </button>
                  </Link>
                </div>
              </div>
            </div>

            {/* Experience Card */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 p-6">
              <h3 className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase mb-1">
                {lang === "bn" ? "অভিজ্ঞতা" : "Experience"}
              </h3>
              <div className="flex items-end gap-2 mb-1">
                <span className="text-4xl font-black text-gray-900 dark:text-white">
                  {lang === "bn" ? doctor.experience.bn.split("+")[0] : doctor.experience.en.split("+")[0]}
                </span>
                <span className="text-xl font-bold text-gray-500 dark:text-gray-400 mb-1">
                  {lang === "bn" ? "বছর" : "years"}
                </span>
              </div>
              <p className="text-xs text-gray-400">
                {lang === "bn" ? "এক্সপেরিয়েন্স এ উচ্চ" : "of experience"}
              </p>
            </div>

            {/* Rating Card */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 p-6">
              <h3 className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase mb-1">
                {lang === "bn" ? "রেটিং" : "Rating"}
              </h3>
              <div className="flex items-center gap-3 mb-1">
                <span className="text-4xl font-black text-gray-900 dark:text-white">5</span>
                <FaStar className="text-amber-400 text-2xl" />
              </div>
              <p className="text-xs text-gray-400">
                {lang === "bn" ? "এই ডাক্তারের রেটিং ভাল" : "This doctor's rating is good"}
              </p>
            </div>

            {/* Education Card */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 p-6">
              <h3 className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase mb-4">
                {lang === "bn" ? "শিক্ষা" : "Education"}
              </h3>
              <div className="flex items-start gap-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#1E2B7A] to-[#2c3e7a] flex items-center justify-center shrink-0">
                  <FaGraduationCap className="text-white" size={20} />
                </div>
                <div>
                  <p className="font-bold text-gray-900 dark:text-white mb-1">{doctor.qualification}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {lang === "bn" ? "মেডিকেল ডিগ্রি" : "Medical Degree"}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right Content */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-8"
          >
            {/* About Section */}
            <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-700 p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {lang === "bn" ? "সম্পর্কে" : "About"}
                </h2>
              </div>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                {lang === "bn" ? doctor.about.bn : doctor.about.en}
              </p>
            </div>

            {/* Stats Row */}
            <div className="grid sm:grid-cols-2 gap-6">
              {/* Consultation Fee */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 p-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center">
                    <FaMoneyBillWave className="text-green-500" size={20} />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 font-semibold uppercase">
                      {lang === "bn" ? "পরামর্শ ফি" : "Consultation Fee"}
                    </p>
                    <p className="text-2xl font-black text-gray-900 dark:text-white">
                      ৳{doctor.consultationFee}
                    </p>
                  </div>
                </div>
              </div>

              {/* Chamber Time */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 p-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 rounded-xl bg-[#1E2B7A]/10 dark:bg-[#1E2B7A]/20 flex items-center justify-center">
                    <FaClock className="text-[#1E2B7A] dark:text-[#76BC21]" size={20} />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 font-semibold uppercase">
                      {lang === "bn" ? "চেম্বার সময়" : "Chamber Time"}
                    </p>
                    <p className="text-sm font-bold text-gray-700 dark:text-gray-300">
                      {lang === "bn" ? doctor.chamberTime.bn : doctor.chamberTime.en}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Services Section */}
            <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-700 p-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                {lang === "bn" ? "বিশেষায়িত সেবা" : "Specialized Services"}
              </h2>
              <div className="grid sm:grid-cols-2 gap-4">
                {doctor.services.map((service, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-3 p-4 rounded-xl bg-gradient-to-br from-[#76BC21]/5 to-transparent border border-[#76BC21]/20 hover:border-[#76BC21]/40 hover:shadow-md transition-all group"
                  >
                    <FaCheckCircle className="text-[#76BC21] mt-0.5 shrink-0 group-hover:scale-110 transition-transform" size={18} />
                    <span className="text-gray-700 dark:text-gray-300 font-medium">
                      {lang === "bn" ? service.bn : service.en}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Languages */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 p-6">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <FaGlobe className="text-[#1E2B7A] dark:text-[#76BC21]" />
                {lang === "bn" ? "ভাষা" : "Languages Spoken"}
              </h3>
              <div className="flex flex-wrap gap-2">
                {doctor.languages.map((language) => (
                  <span
                    key={language}
                    className="px-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm font-semibold text-gray-700 dark:text-gray-300"
                  >
                    {language}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
