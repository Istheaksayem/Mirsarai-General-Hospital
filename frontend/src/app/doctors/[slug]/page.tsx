"use client";

import React, { use } from "react";
import { notFound } from "next/navigation";
import { motion } from "framer-motion";
import {
  FaGraduationCap, FaBriefcase, FaMoneyBillWave, FaClock,
  FaCheckCircle, FaGlobe, FaPhoneAlt, FaEnvelope,
  FaCalendarAlt, FaMapMarkerAlt, FaStar, FaUserMd,
} from "react-icons/fa";
import { useLanguage } from "@/context/LanguageContext";
import { getImageUrl } from "@/lib/getImageUrl";
import { useDoctors } from "@/hooks/useDoctors";
import Link from "next/link";

export default function DoctorProfilePage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = use(params);
  const { lang } = useLanguage();

  const { data: doctors, isLoading, isError } = useDoctors();

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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/20 to-green-50/20 dark:from-gray-900 dark:via-gray-850 dark:to-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-[380px_1fr] gap-8">

          {/* Left Sidebar - Doctor Profile Card */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            {/* Profile Card */}
            <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden">
              {/* Image */}
              <div className="relative h-80 bg-gradient-to-b from-[#1E2B7A]/10 to-transparent">
                <img
                  src={getImageUrl(doctor.image)}
                  alt={lang === "bn" ? (doctor.name?.bn ?? '') : (doctor.name?.en ?? '')}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                      lang === "bn" ? (doctor.name?.bn ?? '') : (doctor.name?.en ?? '')
                    )}&background=1E2B7A&color=fff&size=512`;
                  }}
                />
                {/* Status Badge */}
                {doctor.available && (
                  <div className="absolute top-4 left-4 flex items-center gap-2 px-3 py-1.5 bg-[#76BC21] text-white rounded-full text-xs font-bold shadow-lg">
                    <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
                    {lang === "bn" ? "সক্রিয়" : "Active"}
                  </div>
                )}
                {/* Full-time Badge */}
                <div className="absolute top-4 right-4 px-3 py-1.5 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm text-gray-600 dark:text-gray-300 rounded-full text-xs font-semibold">
                  {lang === "bn" ? "পূর্ণকালীন" : "Full-time"}
                </div>
              </div>

              {/* Info */}
              <div className="p-6 space-y-6">
                {/* Name & Title */}
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                    {lang === "bn" ? (doctor.name?.bn ?? '') : (doctor.name?.en ?? '')}
                  </h1>
                  <p className="text-gray-500 dark:text-gray-400 text-sm">
                    {lang === "bn" ? (doctor.designation?.bn ?? '') : (doctor.designation?.en ?? '')}
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
                      <a href={`tel:${doctor.phone ?? ''}`} className="text-sm text-gray-700 dark:text-gray-300 hover:text-[#1E2B7A] dark:hover:text-[#76BC21] transition-colors">
                        {doctor.phone ?? ''}
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
                      <a href={`mailto:${doctor.email ?? ''}`} className="text-sm text-gray-700 dark:text-gray-300 hover:text-[#1E2B7A] dark:hover:text-[#76BC21] transition-colors truncate block">
                        {doctor.email ?? ''}
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
                  {lang === "bn" ? (doctor.experience?.bn?.split("+")?.[0] ?? '0') : (doctor.experience?.en?.split("+")?.[0] ?? '0')}
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
                {lang === "bn" ? (doctor.about?.bn ?? '') : (doctor.about?.en ?? '')}
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
                      {lang === "bn" ? (doctor.chamberTime?.bn ?? '') : (doctor.chamberTime?.en ?? '')}
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
