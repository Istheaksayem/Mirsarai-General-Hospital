"use client";

import React, { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";
import { useFAQ, FAQData } from "@/hooks/useFAQ";
import {
  FaQuestionCircle,
  FaCalendarCheck,
  FaHospital,
  FaMoneyBillWave,
  FaChevronDown,
  FaPhone,
  FaEnvelope,
} from "react-icons/fa";

// ── Icon Mapper ────────────────────────────────────────────────────────────
const iconMap: { [key: string]: React.ElementType } = {
  FaQuestionCircle,
  FaCalendarCheck,
  FaHospital,
  FaMoneyBillWave,
};

// ── Main FAQ Page ──────────────────────────────────────────────────────────
const FAQPage = () => {
  const { lang } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);

  const { data, isLoading, error } = useFAQ();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 border-4 border-primary/30 border-t-primary rounded-full animate-spin mx-auto" />
          <p className="text-gray-600 font-medium">
            {lang === "bn" ? "লোড হচ্ছে..." : "Loading..."}
          </p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-3">
          <p className="text-red-600 font-semibold text-lg">
            {lang === "bn" ? "ডেটা লোড করতে ব্যর্থ" : "Failed to load data"}
          </p>
        </div>
      </div>
    );
  }

  const filteredFAQs =
    selectedCategory === "all"
      ? data.faqs
      : data.faqs.filter((faq) => faq.category === selectedCategory);

  const toggleFAQ = (id: number) => {
    setOpenFAQ(openFAQ === id ? null : id);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative h-[400px] overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src={data.hero.image}
            alt="FAQ Hero"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/60 to-black/50" />
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 h-full flex items-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-3xl text-white"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="h-[3px] w-12 bg-secondary" />
              <p className="text-sm uppercase tracking-wider font-semibold text-secondary">
                {lang === "bn" ? "সাহায্য কেন্দ্র" : "HELP CENTER"}
              </p>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
              {lang === "bn" ? data.hero.title.bn : data.hero.title.en}
            </h1>

            <p className="text-xl md:text-2xl font-light text-white/90 mb-4">
              {lang === "bn" ? data.hero.subtitle.bn : data.hero.subtitle.en}
            </p>

            <p className="text-base md:text-lg text-white/80 max-w-2xl">
              {lang === "bn"
                ? data.hero.description.bn
                : data.hero.description.en}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Categories Filter */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap justify-center gap-4">
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelectedCategory("all")}
              className={`px-6 py-3 rounded-xl font-semibold text-sm transition-all duration-300 flex items-center gap-2 ${
                selectedCategory === "all"
                  ? "bg-gradient-to-r from-primary to-accent text-white shadow-lg"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              <FaQuestionCircle />
              {lang === "bn" ? "সব" : "All"}
            </motion.button>

            {data.categories.map((category, index) => {
              const IconComponent = iconMap[category.icon] || FaQuestionCircle;
              return (
                <motion.button
                  key={category.id}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: (index + 1) * 0.1 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`px-6 py-3 rounded-xl font-semibold text-sm transition-all duration-300 flex items-center gap-2 ${
                    selectedCategory === category.id
                      ? "bg-gradient-to-r from-primary to-accent text-white shadow-lg"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  <IconComponent />
                  {lang === "bn" ? category.name.bn : category.name.en}
                </motion.button>
              );
            })}
          </div>
        </div>
      </section>

      {/* FAQ List */}
      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
          <div className="space-y-4">
            {filteredFAQs.map((faq, index) => (
              <motion.div
                key={faq.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                className="bg-white border-2 border-gray-200 rounded-xl overflow-hidden hover:border-accent transition-all duration-300 hover:shadow-lg"
              >
                <button
                  onClick={() => toggleFAQ(faq.id)}
                  className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
                >
                  <span className="font-semibold text-primary text-lg pr-4">
                    {lang === "bn" ? faq.question.bn : faq.question.en}
                  </span>
                  <motion.div
                    animate={{ rotate: openFAQ === faq.id ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                    className="flex-shrink-0"
                  >
                    <FaChevronDown
                      className={
                        openFAQ === faq.id ? "text-accent" : "text-gray-400"
                      }
                    />
                  </motion.div>
                </button>

                <AnimatePresence>
                  {openFAQ === faq.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 pb-5 text-gray-600 leading-relaxed border-t border-gray-100 pt-4">
                        {lang === "bn" ? faq.answer.bn : faq.answer.en}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 bg-gradient-to-br from-primary via-accent to-tertiary text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto text-center space-y-6"
          >
            <h2 className="text-3xl md:text-4xl font-bold">
              {lang === "bn"
                ? data.contactInfo.title.bn
                : data.contactInfo.title.en}
            </h2>
            <p className="text-xl text-white/90">
              {lang === "bn"
                ? data.contactInfo.description.bn
                : data.contactInfo.description.en}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-6">
              <a
                href={`tel:${data.contactInfo.phone}`}
                className="flex items-center gap-3 bg-white/10 hover:bg-white/20 px-6 py-3 rounded-xl transition-all backdrop-blur-sm border border-white/20"
              >
                <FaPhone />
                <span className="font-medium">{data.contactInfo.phone}</span>
              </a>
              <a
                href={`mailto:${data.contactInfo.email}`}
                className="flex items-center gap-3 bg-white/10 hover:bg-white/20 px-6 py-3 rounded-xl transition-all backdrop-blur-sm border border-white/20"
              >
                <FaEnvelope />
                <span className="font-medium">{data.contactInfo.email}</span>
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default FAQPage;
