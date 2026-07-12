"use client";

import { useBabyCare } from "@/hooks/useBabyCare";
import {
  FaUserMd,
  FaSyringe,
  FaSmile,
  FaBook,
  FaBaby,
  FaHeartbeat,
  FaCheckCircle,
  FaClock,
  FaShieldAlt,
  FaStar,
} from "react-icons/fa";
import { MdChildCare } from "react-icons/md";
import { motion } from "framer-motion";

const iconMap: Record<string, any> = {
  FaUserMd,
  FaSyringe,
  FaSmile,
  FaBook,
  FaBaby,
  FaHeartbeat,
  FaCheckCircle,
  FaShieldAlt,
  FaStar,
};

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.5 },
};

const BabyCarePage = () => {
  const { data, isLoading, isError } = useBabyCare();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "var(--background)" }}>
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 rounded-full border-4 border-[var(--color-secondary)] border-t-transparent animate-spin" />
          <p className="font-semibold text-lg" style={{ color: "var(--color-secondary)" }}>Loading...</p>
        </div>
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "var(--background)" }}>
        <p className="text-red-500 text-lg font-medium">Failed to load baby care data.</p>
      </div>
    );
  }

  const { babyCare } = data;

  return (
    <main className="overflow-hidden" style={{ background: "var(--background)" }}>
      {/* ── Hero Section ── */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src={babyCare.backgroundImage}
            alt="Baby Care"
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).src =
                "https://images.unsplash.com/photo-1555252333-9f8e92e65df9?w=1920&h=800&fit=crop";
            }}
          />
          <div className="absolute inset-0 bg-black/60" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div className="border-l-4 border-[var(--color-secondary)] pl-6" {...fadeUp}>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-4 tracking-tight">
              {babyCare.title}
            </h1>
            <div className="flex items-center text-xs md:text-sm font-bold tracking-widest uppercase text-gray-300 gap-3">
              <span className="text-white">BABY CARE</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Features Grid ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 -mt-16 relative z-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {babyCare.features.map((feature, index) => {
            const Icon = iconMap[feature.icon] || FaBaby;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group relative bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-7 border border-gray-100 dark:border-gray-700 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-secondary)]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl" />
                <div className="relative z-10">
                  <div className="w-14 h-14 rounded-xl flex items-center justify-center mb-5 text-white shadow-lg transition-all duration-300 group-hover:scale-110"
                    style={{
                      background: "linear-gradient(135deg, var(--color-secondary), #8bc34a)",
                    }}
                  >
                    <Icon size={24} />
                  </div>
                  <h3 className="text-lg font-bold mb-2" style={{ color: "var(--color-primary)" }}>
                    {feature.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-gray-500 dark:text-gray-400">
                    {feature.description}
                  </p>
                </div>
                <div className="absolute -bottom-6 -right-6 w-16 h-16 rounded-full opacity-0 group-hover:opacity-10 transition-all duration-500"
                  style={{ background: "var(--color-secondary)", filter: "blur(12px)" }}
                />
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* ── About Section ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div {...fadeUp}>
            <h2 className="text-4xl md:text-5xl font-bold mb-8 leading-tight" style={{ color: "var(--color-primary)" }}>
              Complete <span style={{ color: "var(--color-secondary)" }}>Pediatric Healthcare</span>
            </h2>
            <p className="text-lg leading-relaxed mb-8 text-gray-600 dark:text-gray-400">
              {babyCare.description}
            </p>
            <div className="space-y-4">
              <div className="flex items-center gap-4 p-3 rounded-xl hover:bg-green-50/50 dark:hover:bg-green-900/10 transition-colors">
                <div className="w-12 h-12 flex items-center justify-center rounded-[var(--radius-md)]"
                  style={{ background: "rgba(var(--color-secondary), 0.1)" }}
                >
                  <FaClock style={{ color: "var(--color-secondary)" }} size={20} />
                </div>
                <div>
                  <p className="font-semibold" style={{ color: "var(--color-primary)" }}>Working Hours</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{babyCare.workingHours.weekdays} (Weekdays)</p>
                </div>
              </div>
              <div className="flex items-center gap-4 p-3 rounded-xl hover:bg-red-50/50 dark:hover:bg-red-900/10 transition-colors">
                <div className="w-12 h-12 flex items-center justify-center rounded-[var(--radius-md)]"
                  style={{ background: "rgba(239, 68, 68, 0.1)" }}
                >
                  <FaHeartbeat style={{ color: "#ef4444" }} size={20} />
                </div>
                <div>
                  <p className="font-semibold" style={{ color: "var(--color-primary)" }}>Emergency Care</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{babyCare.workingHours.emergency}</p>
                </div>
              </div>
            </div>
          </motion.div>
          <motion.div className="relative"
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="absolute -top-6 -right-6 w-full h-full opacity-10 rounded-[var(--radius-xl)]"
              style={{ background: "linear-gradient(135deg, var(--color-secondary), #8bc34a)" }}
            />
            <img
              src="https://images.unsplash.com/photo-1555252333-9f8e92e65df9?w=800&h=600&fit=crop"
              alt="Baby Care"
              className="relative z-10 w-full h-[400px] lg:h-[500px] object-cover rounded-[var(--radius-xl)] shadow-xl"
            />
          </motion.div>
        </div>
      </section>

      {/* ── Services Grid ── */}
      <section className="py-24 px-4 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full bg-[var(--color-secondary)] blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 rounded-full bg-[#8bc34a] blur-3xl" />
        </div>
        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div className="text-center mb-16" {...fadeUp}>
            <div className="inline-block px-5 py-2 mb-6 text-sm font-bold tracking-wider uppercase text-white rounded-full"
              style={{ background: "linear-gradient(135deg, var(--color-secondary), #8bc34a)" }}
            >
              Our Services
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight" style={{ color: "var(--color-primary)" }}>
              Comprehensive Baby Care Services
            </h2>
            <p className="text-lg max-w-2xl mx-auto text-gray-500 dark:text-gray-400">
              Complete healthcare for infants, children, and adolescents
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {babyCare.services.map((service, index) => {
              const accent = "var(--color-secondary)";
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="group relative bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 overflow-hidden"
                >
                  <div className="absolute left-0 top-0 bottom-0 w-1.5 transition-all duration-500 group-hover:w-2"
                    style={{ background: accent }}
                  />
                  <div className="p-6 lg:p-7">
                    <div className="flex items-center gap-3 mb-5">
                      <div className="w-11 h-11 rounded-xl flex items-center justify-center text-white shadow-md transition-all duration-300 group-hover:scale-110"
                        style={{ background: `linear-gradient(135deg, ${accent}, #8bc34a)` }}
                      >
                        <MdChildCare size={20} />
                      </div>
                      <h3 className="text-lg font-bold" style={{ color: "var(--color-primary)" }}>
                        {service.category}
                      </h3>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {service.items?.map((item, idx) => (
                        <span
                          key={idx}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm transition-all duration-200 hover:scale-105"
                          style={{
                            background: `${accent}10`,
                            color: accent,
                          }}
                        >
                          <FaCheckCircle size={10} />
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="absolute -bottom-8 -right-8 w-20 h-20 rounded-full opacity-0 group-hover:opacity-20 transition-all duration-500"
                    style={{ background: accent, filter: "blur(16px)" }}
                  />
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Vaccination Schedule ── */}
      <section className="py-24 px-4 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 right-1/4 w-96 h-96 rounded-full bg-[#8bc34a] blur-3xl" />
          <div className="absolute bottom-0 left-1/4 w-96 h-96 rounded-full bg-[var(--color-secondary)] blur-3xl" />
        </div>
        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div className="text-center mb-16" {...fadeUp}>
            <div className="inline-block px-5 py-2 mb-6 text-sm font-bold tracking-wider uppercase text-white rounded-full"
              style={{ background: "linear-gradient(135deg, var(--color-secondary), #8bc34a)" }}
            >
              Immunization Program
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight" style={{ color: "var(--color-primary)" }}>
              Vaccination Schedule
            </h2>
            <p className="text-lg max-w-2xl mx-auto text-gray-500 dark:text-gray-400">
              Complete immunization program for your child&apos;s health protection
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {babyCare.vaccinationSchedule.map((schedule, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="group relative bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-1 overflow-hidden"
              >
                <div className="h-1.5 w-full"
                  style={{ background: "linear-gradient(90deg, var(--color-secondary), #8bc34a)" }}
                />
                <div className="p-6">
                  <div className="inline-block px-4 py-1.5 mb-4 text-sm font-bold text-white rounded-lg"
                    style={{ background: "linear-gradient(135deg, var(--color-secondary), #8bc34a)" }}
                  >
                    {schedule.age}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {schedule.vaccines.map((vaccine, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm transition-all duration-200 hover:scale-105"
                        style={{
                          background: "rgba(var(--color-secondary-rgb), 0.1)",
                          color: "var(--color-secondary)",
                        }}
                      >
                        <FaCheckCircle size={10} />
                        {vaccine}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Statistics ── */}
      <section className="py-28 px-4 relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03]">
          <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full bg-[var(--color-secondary)] blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 rounded-full bg-[#8bc34a] blur-3xl" />
        </div>
        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div className="text-center mb-16" {...fadeUp}>
            <div className="inline-block px-5 py-2 mb-6 text-sm font-bold tracking-wider uppercase text-white rounded-full"
              style={{ background: "linear-gradient(135deg, var(--color-secondary), #8bc34a)" }}
            >
              Our Impact
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight" style={{ color: "var(--color-primary)" }}>
              Trusted by Families
            </h2>
            <p className="text-lg max-w-2xl mx-auto text-gray-500 dark:text-gray-400">
              Providing exceptional pediatric care with compassion and expertise
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            {babyCare.statistics.map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="relative bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-8 text-center shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 overflow-hidden group"
              >
                <div className="absolute inset-0 bg-gradient-to-b from-[var(--color-secondary)]/5 to-transparent" />
                <div className="relative z-10">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4 transition-transform duration-300 group-hover:scale-110"
                    style={{ background: "linear-gradient(135deg, var(--color-secondary), #8bc34a)" }}
                  >
                    <FaBaby className="text-white" size={20} />
                  </div>
                  <p className="text-4xl font-extrabold mb-2 tracking-tight" style={{ color: "var(--color-secondary)" }}>
                    {stat.value}
                  </p>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{stat.label}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-28 px-4 text-center">
        <motion.div className="max-w-3xl mx-auto" {...fadeUp}>
          <h2 className="text-4xl md:text-5xl font-bold mb-6 leading-tight tracking-tight" style={{ color: "var(--color-primary)" }}>
            Your Child&apos;s Health is Our Priority
          </h2>
          <p className="text-lg mb-12 leading-relaxed max-w-xl mx-auto text-gray-500 dark:text-gray-400">
            Schedule an appointment with our experienced pediatricians for routine checkups or consultations
          </p>
          <a
            href="/appointment?service=baby-care"
            className="inline-block text-white px-12 py-5 font-bold text-lg transition-all duration-500 hover:-translate-y-2 transform rounded-[var(--radius-xl)] shadow-xl hover:shadow-2xl"
            style={{
              background: "linear-gradient(135deg, var(--color-secondary) 0%, #8bc34a 100%)",
            }}
          >
            Book Appointment Now
          </a>
        </motion.div>
      </section>
    </main>
  );
};

export default BabyCarePage;
