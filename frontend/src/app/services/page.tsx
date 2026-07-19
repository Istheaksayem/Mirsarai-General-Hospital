"use client";

import React from "react";
import { motion } from "framer-motion";
import { FaAmbulance, FaStethoscope, FaHeartbeat, FaBone, FaBaby, FaMicroscope, FaArrowRight, FaCalendarCheck } from "react-icons/fa";
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
};

const getServiceName = (service: Service): { en: string; bn: string } => {
  return service.title || service.name;
};

const getServiceSlug = (service: Service): string => {
  return service.slug || getServiceName(service).en.toLowerCase().replace(/[^a-z0-9]+/g, '-');
};

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.5 },
};

const ServicesPage = () => {
  const { data: services, isLoading, isError } = useServices();
  const { lang } = useLanguage();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "var(--background)" }}>
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 rounded-full border-4 border-[var(--color-accent)] border-t-transparent animate-spin" />
          <p className="font-semibold text-lg" style={{ color: "var(--color-accent)" }}>{lang === "bn" ? "লোড হচ্ছে..." : "Loading..."}</p>
        </div>
      </div>
    );
  }

  if (isError || !services) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "var(--background)" }}>
        <p className="text-red-500 text-lg font-medium">
          {lang === "bn" ? "সেবাসমূহ লোড করতে ব্যর্থ।" : "Failed to load services."}
        </p>
      </div>
    );
  }

  return (
    <main className="overflow-hidden" style={{ background: "var(--background)" }}>
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=1920&h=800&fit=crop"
            alt="Services"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/60" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div className="border-l-4 border-[var(--color-accent)] pl-6" {...fadeUp}>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-4 tracking-tight">
              {lang === "bn" ? "আমাদের সেবাসমূহ" : "Our Services"}
            </h1>
            <p className="text-lg text-gray-300 max-w-2xl">
              {lang === "bn"
                ? "আমরা আপনার এবং আপনার পরিবারের জন্য ব্যাপক চিকিৎসা সেবা প্রদান করি।"
                : "We provide comprehensive medical services for you and your family."}
            </p>
          </motion.div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {services.map((service, index) => {
            const Icon = iconMap[service.icon] || <FaStethoscope />;
            const name = getServiceName(service);
            const slug = getServiceSlug(service);

            return (
              <motion.div
                key={service._id || index}
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
                        className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center text-2xl text-white shadow-lg transition-all duration-500 group-hover:scale-110"
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

                    <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-2">
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
                        className="flex items-center justify-center gap-2 text-sm font-semibold px-4 py-2.5 rounded-xl border transition-all duration-300 flex-1"
                        style={{
                          borderColor: `${service.color}30`,
                          color: service.color,
                        }}
                      >
                        {lang === "bn" ? "আরও জানুন" : "Learn More"}
                        <FaArrowRight className="text-xs" />
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
          })}
        </div>
      </section>

      <section className="py-28 px-4 text-center">
        <motion.div className="max-w-3xl mx-auto" {...fadeUp}>
          <h2 className="text-4xl md:text-5xl font-bold mb-6 leading-tight tracking-tight" style={{ color: "var(--color-primary)" }}>
            {lang === "bn" ? "চিকিৎসা সহায়তা প্রয়োজন?" : "Need Medical Assistance?"}
          </h2>
          <p className="text-lg mb-12 leading-relaxed max-w-xl mx-auto text-gray-500 dark:text-gray-400">
            {lang === "bn"
              ? "আমাদের বিশেষজ্ঞরা সাহায্য করতে প্রস্তুত। আজই একটি অ্যাপয়েন্টমেন্ট বুক করুন।"
              : "Our specialists are ready to help. Book an appointment today."}
          </p>
          <Link
            href="/appointment"
            className="inline-block text-white px-12 py-5 font-bold text-lg transition-all duration-500 hover:-translate-y-2 transform rounded-[var(--radius-xl)] shadow-xl hover:shadow-2xl"
            style={{
              background: "linear-gradient(135deg, var(--color-primary) 0%, var(--color-secondary) 100%)",
            }}
          >
            {lang === "bn" ? "অ্যাপয়েন্টমেন্ট বুক করুন" : "Book Appointment"}
          </Link>
        </motion.div>
      </section>
    </main>
  );
};

export default ServicesPage;
