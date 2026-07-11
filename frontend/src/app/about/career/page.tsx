"use client";

import React, { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { useLanguage } from "@/context/LanguageContext";
import {
  FaUserMd,
  FaHeart,
  FaHandHoldingMedical,
  FaUsers,
  FaBriefcase,
  FaClock,
  FaUserTie,
  FaEnvelope,
  FaPhone,
  FaCheckCircle,
} from "react-icons/fa";

// ── Types ──────────────────────────────────────────────────────────────────
interface Benefit {
  icon: string;
  title: { en: string; bn: string };
  description: { en: string; bn: string };
}

interface Position {
  id: number;
  title: { en: string; bn: string };
  department: { en: string; bn: string };
  type: { en: string; bn: string };
  experience: { en: string; bn: string };
  description: { en: string; bn: string };
}

interface Step {
  step: number;
  title: { en: string; bn: string };
  description: { en: string; bn: string };
}

interface CareerData {
  hero: {
    title: { en: string; bn: string };
    subtitle: { en: string; bn: string };
    description: { en: string; bn: string };
    image: string;
  };
  whyJoinUs: {
    title: { en: string; bn: string };
    benefits: Benefit[];
  };
  openPositions: Position[];
  applicationProcess: {
    title: { en: string; bn: string };
    steps: Step[];
  };
  contact: {
    title: { en: string; bn: string };
    description: { en: string; bn: string };
    email: string;
    phone: string;
  };
}

// ── Icon Mapper ────────────────────────────────────────────────────────────
const iconMap: { [key: string]: React.ElementType } = {
  FaUserMd,
  FaHeart,
  FaHandHoldingMedical,
  FaUsers,
};

// ── Fetch Career Data ──────────────────────────────────────────────────────
const fetchCareerData = async (): Promise<CareerData> => {
  const res = await fetch("/data/career.json");
  if (!res.ok) throw new Error("Failed to fetch career data");
  return res.json();
};

// ── Main Career Page ───────────────────────────────────────────────────────
const CareerPage = () => {
  const { lang } = useLanguage();
  const [selectedPosition, setSelectedPosition] = useState<Position | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    position: "",
    message: "",
  });

  const { data, isLoading, error } = useQuery<CareerData>({
    queryKey: ["career"],
    queryFn: fetchCareerData,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 to-tertiary/5">
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log("Form submitted:", formData);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary via-primary/95 to-tertiary text-white py-20 overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 opacity-10">
          <div className="hero-pattern-grid absolute inset-0" />
          <div className="absolute top-20 right-20 w-64 h-64 bg-white/10 rounded-full blur-3xl animate-float" />
          <div className="absolute bottom-20 left-20 w-80 h-80 bg-tertiary/20 rounded-full blur-3xl animate-float delay-700" />
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-6"
            >
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                {lang === "bn" ? data.hero.title.bn : data.hero.title.en}
              </h1>
              <p className="text-xl md:text-2xl font-light text-white/90">
                {lang === "bn" ? data.hero.subtitle.bn : data.hero.subtitle.en}
              </p>
              <p className="text-base md:text-lg text-white/80">
                {lang === "bn"
                  ? data.hero.description.bn
                  : data.hero.description.en}
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative h-[400px] rounded-2xl overflow-hidden shadow-2xl"
            >
              <Image
                src={data.hero.image}
                alt="Career"
                fill
                className="object-cover"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Why Join Us */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">
              {lang === "bn"
                ? data.whyJoinUs.title.bn
                : data.whyJoinUs.title.en}
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {data.whyJoinUs.benefits.map((benefit, index) => {
              const IconComponent = iconMap[benefit.icon] || FaUserMd;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="glass-card p-6 rounded-2xl text-center space-y-4 hover:shadow-xl transition-all duration-300 hover:-translate-y-2"
                >
                  <div className="w-16 h-16 mx-auto bg-gradient-to-br from-primary to-tertiary rounded-full flex items-center justify-center text-white">
                    <IconComponent size={32} />
                  </div>
                  <h3 className="text-xl font-bold text-gray-800">
                    {lang === "bn" ? benefit.title.bn : benefit.title.en}
                  </h3>
                  <p className="text-gray-600">
                    {lang === "bn"
                      ? benefit.description.bn
                      : benefit.description.en}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Open Positions */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">
              {lang === "bn" ? "খোলা পদসমূহ" : "Open Positions"}
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {data.openPositions.map((position, index) => (
              <motion.div
                key={position.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="glass-card p-6 rounded-2xl space-y-4 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer"
                onClick={() => setSelectedPosition(position)}
              >
                <div className="flex items-start justify-between">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary to-tertiary rounded-xl flex items-center justify-center text-white">
                    <FaBriefcase size={24} />
                  </div>
                  <span className="px-3 py-1 bg-tertiary/10 text-tertiary rounded-full text-xs font-semibold">
                    {lang === "bn" ? position.type.bn : position.type.en}
                  </span>
                </div>

                <h3 className="text-xl font-bold text-gray-800">
                  {lang === "bn" ? position.title.bn : position.title.en}
                </h3>

                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <FaBriefcase className="text-primary" />
                    <span>
                      {lang === "bn"
                        ? position.department.bn
                        : position.department.en}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FaClock className="text-primary" />
                    <span>
                      {lang === "bn"
                        ? position.experience.bn
                        : position.experience.en}
                    </span>
                  </div>
                </div>

                <p className="text-gray-600 text-sm">
                  {lang === "bn"
                    ? position.description.bn
                    : position.description.en}
                </p>

                <button className="w-full bg-primary text-white py-3 rounded-xl font-semibold hover:bg-primary/90 transition-colors">
                  {lang === "bn" ? "আবেদন করুন" : "Apply Now"}
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Application Process */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">
              {lang === "bn"
                ? data.applicationProcess.title.bn
                : data.applicationProcess.title.en}
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {data.applicationProcess.steps.map((step, index) => (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="relative"
              >
                <div className="glass-card p-6 rounded-2xl space-y-4 h-full">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary to-tertiary rounded-full flex items-center justify-center text-white text-xl font-bold">
                    {step.step}
                  </div>
                  <h3 className="text-xl font-bold text-gray-800">
                    {lang === "bn" ? step.title.bn : step.title.en}
                  </h3>
                  <p className="text-gray-600">
                    {lang === "bn" ? step.description.bn : step.description.en}
                  </p>
                </div>
                {index < data.applicationProcess.steps.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-4 w-8 h-0.5 bg-primary/30" />
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 bg-gradient-to-br from-primary to-tertiary text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto text-center space-y-6"
          >
            <FaCheckCircle className="mx-auto text-6xl mb-4" />
            <h2 className="text-3xl md:text-4xl font-bold">
              {lang === "bn" ? data.contact.title.bn : data.contact.title.en}
            </h2>
            <p className="text-xl text-white/90">
              {lang === "bn"
                ? data.contact.description.bn
                : data.contact.description.en}
            </p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center pt-6">
              <a
                href={`mailto:${data.contact.email}`}
                className="flex items-center gap-3 bg-white/10 hover:bg-white/20 px-6 py-3 rounded-xl transition-colors backdrop-blur-sm"
              >
                <FaEnvelope size={20} />
                <span className="font-medium">{data.contact.email}</span>
              </a>
              <a
                href={`tel:${data.contact.phone}`}
                className="flex items-center gap-3 bg-white/10 hover:bg-white/20 px-6 py-3 rounded-xl transition-colors backdrop-blur-sm"
              >
                <FaPhone size={20} />
                <span className="font-medium">{data.contact.phone}</span>
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default CareerPage;
