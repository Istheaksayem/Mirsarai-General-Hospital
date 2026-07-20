"use client";

import React from "react";
import { motion } from "framer-motion";
import { FaAmbulance, FaStethoscope, FaHeartbeat, FaBone, FaBaby, FaMicroscope, FaBrain, FaVenus, FaRibbon, FaEye, FaArrowRight, FaCalendarCheck } from "react-icons/fa";
import { useLanguage } from "@/context/LanguageContext";
import { useServices } from "@/hooks/useServices";
import Link from "next/link";

interface Service {
  _id?: string;
  id?: number;
  name: { en: string; bn: string };
  slug?: string;
  title?: { en: string; bn: string };
  description: { en: string; bn: string };
  icon: string;
  color: string;
  gradient: string;
  link: string;
  highlights?: string[];
  tagline?: string;
}

const iconMap: Record<string, React.ReactNode> = {
  FaAmbulance: <FaAmbulance />,
  FaStethoscope: <FaStethoscope />,
  FaHeartbeat: <FaHeartbeat />,
  FaBone: <FaBone />,
  FaBaby: <FaBaby />,
  FaMicroscope: <FaMicroscope />,
  FaBrain: <FaBrain />,
  FaVenus: <FaVenus />,
  FaRibbon: <FaRibbon />,
  FaEye: <FaEye />,
};

const getServiceName = (service: Service): { en: string; bn: string } => {
  return service.title || service.name;
};

const getServiceSlug = (service: Service): string => {
  return service.slug || getServiceName(service).en.toLowerCase().replace(/[^a-z0-9]+/g, '-');
};

const ServiceCard = ({ service, index, lang }: { service: Service; index: number; lang: string }) => {
  const Icon = iconMap[service.icon] || <FaStethoscope />;
  const name = getServiceName(service);
  const slug = getServiceSlug(service);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group"
    >
      <div className="relative h-full bg-white dark:bg-gray-800 rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-700 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
        <div
          className="h-1.5 w-full transition-all duration-500 group-hover:h-2"
          style={{ background: `linear-gradient(135deg, ${service.color}, ${service.color}dd)` }}
        />

        <div className="p-6 sm:p-7">
          <div className="flex items-start justify-between mb-5">
            <div
              className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center text-2xl text-white shadow-lg transition-all duration-500 group-hover:scale-110 group-hover:rotate-3"
              style={{ background: `linear-gradient(135deg, ${service.color}, ${service.color}dd)` }}
            >
              {Icon}
              <div
                className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-40 transition-opacity duration-500"
                style={{
                  background: `linear-gradient(135deg, transparent 40%, ${service.color})`,
                  filter: "blur(8px)",
                }}
              />
            </div>
            {service.tagline && (
              <span
                className="text-[10px] sm:text-xs font-semibold px-2.5 py-1 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-500 whitespace-nowrap"
                style={{
                  background: `${service.color}15`,
                  color: service.color,
                }}
              >
                {service.tagline}
              </span>
            )}
          </div>

          <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-2 transition-colors duration-300">
            {lang === "bn" ? name.bn : name.en}
          </h3>

          <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed mb-4 line-clamp-2">
            {lang === "bn" ? (service.description?.bn || "") : (service.description?.en || "")}
          </p>

          {service.highlights && (
            <div className="flex flex-wrap gap-1.5 mb-4">
              {service.highlights.map((h, i) => (
                <span
                  key={i}
                  className="text-[10px] font-medium px-2 py-0.5 rounded-md"
                  style={{
                    background: `${service.color}10`,
                    color: service.color,
                  }}
                >
                  {h}
                </span>
              ))}
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-2 mt-auto">
            <Link
              href={service.link}
              className="flex items-center justify-center gap-2 text-sm font-semibold px-4 py-2.5 rounded-xl border transition-all duration-300 hover:gap-3 flex-1"
              style={{
                borderColor: `${service.color}30`,
                color: service.color,
              }}
            >
              {lang === "bn" ? "আরও জানুন" : "Learn More"}
              <FaArrowRight className="text-xs transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
            <Link
              href={`/appointment?service=${encodeURIComponent(slug)}`}
              className="flex items-center justify-center gap-2 text-sm font-semibold px-4 py-2.5 rounded-xl text-white transition-all duration-300 flex-1 hover:-translate-y-0.5"
              style={{
                background: `linear-gradient(135deg, ${service.color}, ${service.color}dd)`,
              }}
            >
              <FaCalendarCheck className="text-xs" />
              {lang === "bn" ? "অ্যাপয়েন্টমেন্ট বুক করুন" : "Book Appointment"}
            </Link>
          </div>
        </div>

        <div
          className="absolute -bottom-8 -right-8 w-24 h-24 rounded-full opacity-0 group-hover:opacity-20 transition-all duration-500 group-hover:scale-150"
          style={{ background: service.color, filter: "blur(20px)" }}
        />
      </div>
    </motion.div>
  );
};

const ServicesSkeleton = () => (
  <section className="py-20 bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-16 space-y-4 animate-pulse">
        <div className="h-10 w-64 bg-gray-200 dark:bg-gray-700 rounded-lg mx-auto" />
        <div className="h-4 w-96 bg-gray-200 dark:bg-gray-700 rounded mx-auto" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="h-80 bg-gray-200 dark:bg-gray-700 rounded-2xl animate-pulse" />
        ))}
      </div>
    </div>
  </section>
);

const Services = () => {
  const { data: services, isLoading, isError } = useServices();
  const { lang } = useLanguage();

  if (isLoading) return <ServicesSkeleton />;
  if (isError || !services) {
    return (
      <section className="py-20 bg-gray-50 dark:bg-gray-900">
        <div className="text-center text-gray-600 dark:text-gray-400">
          {lang === "bn" ? "সেবাসমূহ লোড করতে ব্যর্থ।" : "Failed to load services."}
        </div>
      </section>
    );
  }

  return (
    <section className="relative py-20 lg:py-28 bg-gradient-to-b from-white via-blue-50/30 to-white dark:from-gray-900 dark:via-gray-850 dark:to-gray-900 overflow-hidden">
      <div className="absolute top-20 right-0 w-96 h-96 bg-[#1E2B7A]/5 rounded-full blur-3xl" />
      <div className="absolute bottom-20 left-0 w-96 h-96 bg-[#76BC21]/5 rounded-full blur-3xl" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
            className="inline-block mb-4"
          >
            <span className="px-4 py-2 bg-[#1E2B7A]/10 text-[#1E2B7A] dark:bg-[#1E2B7A]/20 dark:text-blue-400 rounded-full text-sm font-semibold uppercase tracking-wide">
              {lang === "bn" ? "আমাদের সেবা" : "Our Services"}
            </span>
          </motion.div>

          <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white mb-4">
            {lang === "bn" ? (
              <>আমাদের <span className="text-[#1E2B7A] dark:text-[#76BC21]">চিকিৎসা সেবা</span></>
            ) : (
              <>Our Medical <span className="text-[#1E2B7A] dark:text-[#76BC21]">Services</span></>
            )}
          </h2>

          <div className="w-24 h-1.5 bg-gradient-to-r from-[#1E2B7A] to-[#76BC21] mx-auto rounded-full mb-6" />

          <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto text-lg leading-relaxed">
            {lang === "bn"
              ? "আমরা আপনার এবং আপনার পরিবারের সর্বোত্তম সেবা নিশ্চিত করতে বিস্তৃত চিকিৎসা সেবা প্রদান করি।"
              : "We offer a wide range of medical services to ensure that you and your family receive the best possible care."}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {services.map((service, index) => (
            <ServiceCard key={service._id || index} service={service} index={index} lang={lang} />
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-center mt-12"
        >
          <Link href="/departments">
            <button className="group px-8 py-4 bg-gradient-to-r from-[#1E2B7A] to-[#2c3e7a] hover:from-[#76BC21] hover:to-[#67a81d] text-white rounded-xl font-semibold shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
              <span className="flex items-center gap-3">
                {lang === "bn" ? "সকল সেবা দেখুন" : "View All Services"}
                <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
              </span>
            </button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default Services;
