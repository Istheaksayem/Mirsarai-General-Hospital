"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";
import { useCareerData, CareerPosition } from "@/hooks/useAboutData";
import { getImageUrl } from "@/lib/getImageUrl";
import {
  FaBriefcase,
  FaClock,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaTimes,
  FaChevronRight,
} from "react-icons/fa";

const CareerPage = () => {
  const { lang, t } = useLanguage();
  const [selectedJob, setSelectedJob] = useState<CareerPosition | null>(null);

  const { data, isLoading, isError } = useCareerData();

  // Dynamic SEO Meta tags
  useEffect(() => {
    if (data?.seo) {
      const seo = data.seo;
      document.title = lang === "bn" ? seo.metaTitle.bn : seo.metaTitle.en;
      
      const metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc) {
        metaDesc.setAttribute("content", lang === "bn" ? seo.metaDescription.bn : seo.metaDescription.en);
      }
      
      const metaKeywords = document.querySelector('meta[name="keywords"]');
      if (metaKeywords) {
        metaKeywords.setAttribute("content", lang === "bn" ? seo.keywords.bn : seo.keywords.en);
      }
    }
  }, [data, lang]);
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 to-secondary/5">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 border-4 border-primary/30 border-t-primary rounded-full animate-spin mx-auto" />
          <p className="text-gray-600 font-medium">
            {t("Loading...", "লোড হচ্ছে...")}
          </p>
        </div>
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center p-8 bg-white rounded-3xl shadow-xl border border-gray-100 max-w-md mx-auto">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <p className="text-red-600 text-lg font-semibold mb-4">
            {t("Failed to load Career content.", "ক্যারিয়ার ডেটা লোড করতে ব্যর্থ হয়েছে।")}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2.5 bg-primary text-white rounded-xl font-bold hover:bg-primary/90 transition-all shadow-md"
          >
            {t("Retry", "আবার চেষ্টা করুন")}
          </button>
        </div>
      </div>
    );
  }

  // Schema-independent field mappings (safeguards for database migration)
  const pageTitle = data.title || (data as any).hero?.title || { en: "Join Our Team", bn: "আমাদের দলে যোগ দিন" };
  const pageDesc = data.description || (data as any).hero?.description || { en: "Build your career in healthcare excellence...", bn: "স্বাস্থ্যসেবায় আপনার ক্যারিয়ার গড়ে তুলুন..." };
  const pageImage = data.image || (data as any).hero?.image || "/about-us.jpg";

  const rawListings = data.jobListings || (data as any).openPositions || [];
  const normalizedListings: CareerPosition[] = rawListings.map((job: any) => ({
    id: job.id,
    title: job.title || job.jobTitle || { en: "Position", bn: "পদ" },
    department: job.department || { en: "Department", bn: "বিভাগ" },
    location: job.location || { en: "Mirsarai, Chittagong", bn: "মীরসরাই, চট্টগ্রাম" },
    jobType: job.jobType || job.type || job.employmentType || { en: "Full-time", bn: "পূর্ণকালীন" },
    description: job.description || job.jobDescription || { en: "", bn: "" },
    requirements: job.requirements || { en: "", bn: "" },
    applyLink: job.applyLink || job.applyButtonUrl || "mailto:careers@mirsaraihospital.com",
    bannerImage: job.bannerImage || job.image || "/about-us.jpg",
    isActive: job.isActive !== undefined ? job.isActive : (job.status === "Open" || true)
  }));

  // Filter only active positions
  const activeJobs = normalizedListings.filter(job => job.isActive !== false);

  const renderHero = () => (
    <section key="hero" className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
      {/* Background Image Layer */}
      <div className="absolute inset-0">
        {/* Use regular img — avoids Next.js domain restrictions for backend uploads */}
        <img
          src={getImageUrl(pageImage)}
          alt="Career Banner"
          className="w-full h-full object-cover"
        />
      </div>
      {/* Dark overlay for readability */}
      <div className="absolute inset-0 bg-black/60" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="border-l-4 border-secondary pl-6"
        >
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-4 tracking-tight">
            {t(pageTitle.en, pageTitle.bn)}
          </h1>
          <p className="text-lg md:text-xl font-light text-white/90 mt-4 leading-relaxed max-w-3xl">
            {t(pageDesc.en, pageDesc.bn)}
          </p>
        </motion.div>
      </div>
    </section>
  );

  const renderJobListings = () => (
    <section key="jobListings" className="py-20 bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-extrabold text-primary mb-4">
            {t("Open Positions", "খোলা পদসমূহ")}
          </h2>
          <p className="text-gray-500 max-w-2xl mx-auto">
            {t(
              "Join our team of healthcare experts and help shape the future of medical care in Mirsarai.",
              "আমাদের স্বাস্থ্যসেবা বিশেষজ্ঞদের দলে যোগ দিন এবং মীরসরাইয়ে চিকিৎসা সেবার ভবিষ্যৎ গঠনে সহায়তা করুন।"
            )}
          </p>
        </motion.div>

        {activeJobs.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-gray-200">
            <p className="text-gray-500 font-medium">
              {t("No job vacancies available at the moment.", "এই মুহূর্তে কোনো চাকরির সুযোগ নেই।")}
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {activeJobs.map((job, index) => (
              <motion.div
                key={job.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white rounded-3xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden group cursor-pointer"
                onClick={() => setSelectedJob(job)}
              >
                {/* Thumbnail Banner */}
                <div className="relative h-48 w-full bg-gray-100 overflow-hidden shrink-0">
                  {/* Use regular img — avoids Next.js domain restrictions for backend uploads */}
                  <img
                    src={getImageUrl(job.bannerImage)}
                    alt={t(job.title.en, job.title.bn)}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-4 right-4 bg-secondary text-white px-3 py-1 rounded-full text-xs font-bold shadow-md">
                    {t(job.jobType.en, job.jobType.bn)}
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 flex flex-col flex-grow justify-between space-y-4">
                  <div className="space-y-2">
                    <p className="text-xs font-bold text-secondary uppercase tracking-wider">
                      {t(job.department.en, job.department.bn)}
                    </p>
                    <h3 className="text-xl font-bold text-gray-900 group-hover:text-primary transition-colors line-clamp-1">
                      {t(job.title.en, job.title.bn)}
                    </h3>
                    <p className="text-gray-500 text-sm line-clamp-2">
                      {t(job.description.en, job.description.bn)}
                    </p>
                  </div>

                  <div className="space-y-2 pt-2 border-t border-gray-50 text-sm text-gray-500">
                    <div className="flex items-center gap-2">
                      <FaMapMarkerAlt className="text-secondary shrink-0" />
                      <span className="line-clamp-1">{t(job.location.en, job.location.bn)}</span>
                    </div>
                  </div>

                  <button 
                    className="w-full bg-primary text-white py-3 rounded-xl font-semibold hover:bg-secondary transition-all flex items-center justify-center gap-2"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedJob(job);
                    }}
                  >
                    <span>{t("View Details & Apply", "বিস্তারিত ও আবেদন করুন")}</span>
                    <FaChevronRight size={12} />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );

  // Read section settings
  const sectionConfig = data.sections || {
    hero: { isVisible: true, order: 1 },
    jobListings: { isVisible: true, order: 2 }
  };

  const activeSections = Object.entries(sectionConfig)
    .filter(([_, config]) => config.isVisible)
    .sort(([_, a], [__, b]) => a.order - b.order)
    .map(([name]) => name);

  return (
    <main className="bg-white min-h-screen">
      {activeSections.map((sectionName) => {
        switch (sectionName) {
          case "hero":
            return renderHero();
          case "jobListings":
            return renderJobListings();
          default:
            return null;
        }
      })}

      {/* Modal Detailed View */}
      <AnimatePresence>
        {selectedJob && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedJob(null)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />

            {/* Modal Box */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-2xl bg-white rounded-3xl overflow-hidden shadow-2xl z-10 max-h-[85vh] flex flex-col"
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedJob(null)}
                className="absolute top-4 right-4 bg-white/80 hover:bg-white text-gray-700 hover:text-black p-2 rounded-full z-20 shadow-md transition-all"
              >
                <FaTimes size={16} />
              </button>

              {/* Banner Image in Modal */}
              <div className="relative h-48 sm:h-56 w-full shrink-0">
                {/* Use regular img — avoids Next.js domain restrictions for backend uploads */}
                <img
                  src={getImageUrl(selectedJob.bannerImage)}
                  alt={t(selectedJob.title.en, selectedJob.title.bn)}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/45" />
                <div className="absolute bottom-6 left-6 text-white pr-12">
                  <span className="bg-secondary px-3 py-1 rounded-full text-xs font-bold mb-2 inline-block">
                    {t(selectedJob.jobType.en, selectedJob.jobType.bn)}
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-extrabold">
                    {t(selectedJob.title.en, selectedJob.title.bn)}
                  </h2>
                </div>
              </div>

              {/* Scrollable Content */}
              <div className="p-6 overflow-y-auto space-y-6 flex-grow">
                <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-gray-500 border-b border-gray-100 pb-4">
                  <div>
                    <span className="font-bold text-gray-900">{t("Department:", "বিভাগ:")} </span>
                    {t(selectedJob.department.en, selectedJob.department.bn)}
                  </div>
                  <div>
                    <span className="font-bold text-gray-900">{t("Location:", "অবস্থান:")} </span>
                    {t(selectedJob.location.en, selectedJob.location.bn)}
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="text-lg font-bold text-primary">
                    {t("Job Description", "কাজের বিবরণ")}
                  </h4>
                  <p className="text-gray-600 leading-relaxed text-sm whitespace-pre-line">
                    {t(selectedJob.description.en, selectedJob.description.bn)}
                  </p>
                </div>

                <div className="space-y-2">
                  <h4 className="text-lg font-bold text-primary">
                    {t("Requirements", "প্রয়োজনীয় যোগ্যতা")}
                  </h4>
                  <p className="text-gray-600 leading-relaxed text-sm whitespace-pre-line">
                    {t(selectedJob.requirements.en, selectedJob.requirements.bn)}
                  </p>
                </div>
              </div>

              {/* Bottom Apply Action */}
              <div className="p-6 border-t border-gray-100 bg-gray-50/50 flex gap-4">
                <button
                  onClick={() => setSelectedJob(null)}
                  className="px-5 py-3 rounded-xl border border-gray-200 hover:bg-gray-100 font-semibold text-gray-600 text-sm transition-colors"
                >
                  {t("Close", "বন্ধ করুন")}
                </button>
                <a
                  href={selectedJob.applyLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-grow bg-primary hover:bg-secondary text-white py-3 rounded-xl font-bold text-sm text-center shadow-lg transition-colors flex items-center justify-center gap-2"
                >
                  <FaBriefcase />
                  <span>{t("Apply Now", "আবেদন করুন")}</span>
                </a>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </main>
  );
};

export default CareerPage;
