"use client";

import { useNICUService } from "@/hooks/useNICUService";
import { useLanguage } from "@/context/LanguageContext";
import {
  FaHeartbeat, FaLaptopMedical, FaUserNurse, FaHandHoldingHeart,
  FaBaby, FaAmbulance, FaShieldAlt, FaCheckCircle, FaClock
} from "react-icons/fa";
import { MdLocalHospital } from "react-icons/md";
import { motion } from "framer-motion";

const iconMap: Record<string, any> = {
  FaHeartbeat, FaLaptopMedical, FaUserNurse, FaHandHoldingHeart, FaBaby, FaAmbulance,
};

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.5 },
};

const NICUServicePage = () => {
  const { lang, t } = useLanguage();
  const { data, isLoading, isError } = useNICUService(lang);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--background)]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 rounded-full border-4 border-[var(--tertiary)] border-t-transparent animate-spin" />
          <p className="font-semibold text-lg nicu-text-primary">{t("Loading...", "লোড হচ্ছে...")}</p>
        </div>
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--background)]">
        <p className="text-red-500 text-lg font-medium">{t("Failed to load NICU service data.", "এনআইসিইউ সেবার তথ্য লোড করতে ব্যর্থ হয়েছে।")}</p>
      </div>
    );
  }

  return (
    <main className="overflow-hidden" style={{ background: "var(--background)" }}>
      {/* ── Hero Banner ── */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src={data.backgroundImage}
            alt={t("NICU Care", "এনআইসিইউ সেবা")}
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).src =
                "https://images.unsplash.com/photo-1631815588090-d4bfec5b1ccb?w=1920&h=800&fit=crop";
            }}
          />
          <div className="absolute inset-0 bg-black/60" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div className="border-l-4 border-orange-500 pl-6" {...fadeUp}>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-4 tracking-tight">
              {data.title}
            </h1>
            <div className="flex items-center text-xs md:text-sm font-bold tracking-widest uppercase text-gray-300 gap-3">
              <span className="text-white">{t("NICU", "এনআইসিইউ")}</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Features Grid ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 -mt-16 relative z-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {data.features.map((feature, index) => {
            const Icon = iconMap[feature.icon] || FaHeartbeat;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group relative bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-7 border border-gray-100 dark:border-gray-700 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl" />
                <div className="relative z-10">
                  <div className="w-14 h-14 rounded-xl flex items-center justify-center mb-5 text-white shadow-lg transition-all duration-300 group-hover:scale-110 group-hover:rotate-3"
                    style={{
                      background: "linear-gradient(135deg, var(--tertiary), var(--color-secondary))",
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
                  style={{ background: "var(--tertiary)", filter: "blur(12px)" }}
                />
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* ── About Section ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div className="relative order-2 lg:order-1"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="absolute -top-6 -left-6 w-full h-full opacity-10 rounded-[var(--radius-xl)]"
              style={{ background: "linear-gradient(135deg, var(--tertiary), var(--color-secondary))" }}
            />
            <img
              src="https://images.unsplash.com/photo-1631815588090-d4bfec5b1ccb?w=800&h=600&fit=crop"
              alt={t("NICU", "এনআইসিইউ")}
              className="relative z-10 w-full h-[400px] lg:h-[500px] object-cover rounded-[var(--radius-xl)] shadow-xl"
            />
          </motion.div>
          <motion.div className="order-1 lg:order-2"
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-8 leading-tight" style={{ color: "var(--color-primary)" }}>
              {t("Caring for Your", "আপনার")} <span className="nicu-text-primary">{t("Precious Little Ones", "মূল্যবান ছোট্ট সন্তানদের যত্ন")}</span>
            </h2>
            <p className="text-lg leading-relaxed mb-8 text-gray-600 dark:text-gray-400">
              {data.description}
            </p>
            <div className="space-y-4">
              {[
                { icon: FaBaby, title: t("Specialized Equipment", "বিশেষায়িত সরঞ্জাম"), desc: t("Modern incubators & ventilators", "আধুনিক ইনকিউবেটর ও ভেন্টিলেটর") },
                { icon: FaShieldAlt, title: t("Expert Medical Staff", "বিশেষজ্ঞ চিকিৎসক কর্মী"), desc: t("Trained neonatologists & nurses", "প্রশিক্ষিত নিওনাটোলজিস্ট ও নার্স") },
                { icon: FaHeartbeat, title: t("24/7 Monitoring", "২৪/৭ মনিটরিং"), desc: t("Continuous care & supervision", "নিরবিচ্ছিন্ন সেবা ও তত্ত্বাবধান") },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-4 p-3 rounded-xl hover:bg-orange-50/50 dark:hover:bg-orange-900/10 transition-colors">
                  <div className="w-12 h-12 flex items-center justify-center rounded-[var(--radius-md)]"
                    style={{ background: "linear-gradient(135deg, var(--tertiary), var(--color-secondary))" }}
                  >
                    <item.icon className="text-white" size={20} />
                  </div>
                  <div>
                    <p className="font-semibold" style={{ color: "var(--color-primary)" }}>{item.title}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{item.desc}</p>
                  </div>
                </div>
              ))}
              {data.workingHours && data.workingHours.weekdays && (
                <div className="flex items-center gap-4 p-3 rounded-xl hover:bg-orange-50/50 dark:hover:bg-orange-900/10 transition-colors">
                  <div className="w-12 h-12 flex items-center justify-center rounded-[var(--radius-md)]"
                    style={{ background: "linear-gradient(135deg, var(--tertiary), var(--color-secondary))" }}
                  >
                    <FaClock className="text-white" size={20} />
                  </div>
                  <div>
                    <p className="font-semibold" style={{ color: "var(--color-primary)" }}>{t("Working Hours", "কাজের সময়")}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{data.workingHours.weekdays} ({t("Weekdays", "সপ্তাহের দিন")})</p>
                  </div>
                </div>
              )}
              {data.workingHours && data.workingHours.emergency && (
                <div className="flex items-center gap-4 p-3 rounded-xl hover:bg-red-50/50 dark:hover:bg-red-900/10 transition-colors">
                  <div className="w-12 h-12 flex items-center justify-center rounded-[var(--radius-md)]"
                    style={{ background: "rgba(239, 68, 68, 0.1)" }}
                  >
                    <FaHeartbeat style={{ color: "#ef4444" }} size={20} />
                  </div>
                  <div>
                    <p className="font-semibold" style={{ color: "var(--color-primary)" }}>{t("Emergency Care", "জরুরি সেবা")}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{data.workingHours.emergency}</p>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Services Grid ── */}
      <section className="py-24 px-4 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full bg-[var(--color-primary)] blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 rounded-full bg-[var(--color-secondary)] blur-3xl" />
        </div>
        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div className="text-center mb-16" {...fadeUp}>
            <div className="inline-block px-5 py-2 mb-6 text-sm font-bold tracking-wider uppercase text-white rounded-full"
              style={{ background: "linear-gradient(135deg, var(--tertiary), var(--color-secondary))" }}
            >
              {t("Our NICU Services", "আমাদের এনআইসিইউ সেবা")}
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight" style={{ color: "var(--color-primary)" }}>
              {t("Comprehensive Neonatal Care", "ব্যাপক নবজাতক সেবা")}
            </h2>
            <p className="text-lg max-w-2xl mx-auto text-gray-500 dark:text-gray-400">
              {t("Specialized care for premature and critically ill newborns", "অকালপ্রসবী ও গুরুতর অসুস্থ নবজাতকদের জন্য বিশেষায়িত সেবা")}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {data.services.map((service: any, index: number) => {
              const Icon = iconMap[service.icon] || MdLocalHospital;
              const accent = service.accent || "var(--tertiary)";
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
                  <div className="p-6">
                    <div className="flex items-center gap-3 mb-5">
                      <div className="w-11 h-11 rounded-xl flex items-center justify-center text-white shadow-md transition-all duration-300 group-hover:scale-110"
                        style={{ background: `linear-gradient(135deg, ${accent}, ${accent}dd)` }}
                      >
                        <Icon size={20} />
                      </div>
                      <h3 className="text-lg font-bold" style={{ color: "var(--color-primary)" }}>
                        {service.category}
                      </h3>
                    </div>
                    <ul className="space-y-2.5">
                      {service.items.map((item: string, idx: number) => (
                        <li key={idx} className="flex items-start gap-3">
                          <FaCheckCircle
                            className="mt-0.5 flex-shrink-0 transition-all duration-300 group-hover:scale-110"
                            size={14}
                            style={{ color: accent }}
                          />
                          <span className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                            {item}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="absolute -bottom-8 -right-8 w-20 h-20 rounded-full opacity-0 group-hover:opacity-20 transition-all duration-500"
                    style={{ background: accent, filter: "blur(16px)" }}
                  />
                </motion.div>
              );
            })}
          </div>

          {/* Equipment Section */}
          <motion.div
            className="mt-12 relative bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl border border-gray-100 dark:border-gray-700 p-8 shadow-lg"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <h3 className="text-xl font-bold mb-6 text-center" style={{ color: "var(--color-primary)" }}>
              <span className="inline-flex items-center gap-2">
                <MdLocalHospital className="nicu-text-primary" size={24} />
                {t("Advanced Medical Equipment", "অত্যাধুনিক চিকিৎসা সরঞ্জাম")}
              </span>
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
              {data.equipment.map((item: string, i: number) => (
                <div
                  key={i}
                  className="text-center py-3 px-3 rounded-xl border border-orange-100 dark:border-orange-900/30 bg-orange-50/50 dark:bg-orange-900/10 transition-all duration-300 hover:scale-105 hover:shadow-md"
                >
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300">{item}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Statistics ── */}
      <section className="py-28 px-4 relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03]">
          <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full bg-[var(--color-primary)] blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 rounded-full bg-[var(--color-accent)] blur-3xl" />
        </div>
        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div className="text-center mb-16" {...fadeUp}>
            <div className="inline-block px-5 py-2 mb-6 text-sm font-bold tracking-wider uppercase text-white rounded-full"
              style={{ background: "linear-gradient(135deg, var(--tertiary), var(--color-secondary))" }}
            >
              {t("Our Success", "আমাদের সাফল্য")}
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight" style={{ color: "var(--color-primary)" }}>
              {t("Trusted NICU Care", "বিশ্বস্ত এনআইসিইউ সেবা")}
            </h2>
            <p className="text-lg max-w-2xl mx-auto text-gray-500 dark:text-gray-400">
              {t("Providing exceptional neonatal care with proven success rates", "প্রমাণিত সাফল্যের হার সহ ব্যতিক্রমী নবজাতক সেবা প্রদান")}
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            {data.statistics.map((stat: any, i: number) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="relative bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-8 text-center shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 overflow-hidden group"
              >
                <div className="absolute inset-0 bg-gradient-to-b from-orange-500/5 to-transparent" />
                <div className="relative z-10">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4 transition-transform duration-300 group-hover:scale-110"
                    style={{ background: "linear-gradient(135deg, var(--tertiary), var(--color-secondary))" }}
                  >
                    <FaBaby className="text-white" size={20} />
                  </div>
                  <p className="text-4xl font-extrabold mb-2 tracking-tight nicu-text-primary">
                    {stat.value}
                  </p>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    {stat.label}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Vaccination Schedule ── */}
      {data.vaccinationSchedule && data.vaccinationSchedule.length > 0 && (
        <section className="py-24 px-4 relative overflow-hidden">
          <div className="absolute inset-0 opacity-5">
            <div className="absolute top-0 right-1/4 w-96 h-96 rounded-full bg-[var(--tertiary)] blur-3xl" />
            <div className="absolute bottom-0 left-1/4 w-96 h-96 rounded-full bg-[var(--color-secondary)] blur-3xl" />
          </div>
          <div className="max-w-7xl mx-auto relative z-10">
            <motion.div className="text-center mb-16" {...fadeUp}>
              <div className="inline-block px-5 py-2 mb-6 text-sm font-bold tracking-wider uppercase text-white rounded-full"
                style={{ background: "linear-gradient(135deg, var(--tertiary), var(--color-secondary))" }}
              >
                {t("Immunization Program", "টিকাদান কর্মসূচি")}
              </div>
              <h2 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight" style={{ color: "var(--color-primary)" }}>
                {t("Vaccination Schedule", "টিকাদান সময়সূচী")}
              </h2>
              <p className="text-lg max-w-2xl mx-auto text-gray-500 dark:text-gray-400">
                {t("Complete immunization program for your child's health protection", "আপনার সন্তানের স্বাস্থ্য সুরক্ষার জন্য সম্পূর্ণ টিকাদান কর্মসূচি")}
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {data.vaccinationSchedule.map((schedule, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="group relative bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-1 overflow-hidden"
                >
                  <div className="h-1.5 w-full"
                    style={{ background: "linear-gradient(90deg, var(--tertiary), var(--color-secondary))" }}
                  />
                  <div className="p-6">
                    <div className="inline-block px-4 py-1.5 mb-4 text-sm font-bold text-white rounded-lg"
                      style={{ background: "linear-gradient(135deg, var(--tertiary), var(--color-secondary))" }}
                    >
                      {schedule.age}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {schedule.vaccines.map((vaccine, idx) => (
                        <span
                          key={idx}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm transition-all duration-200 hover:scale-105"
                          style={{
                            background: "rgba(249, 115, 22, 0.1)",
                            color: "var(--tertiary)",
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
      )}

      {/* ── Guidelines ── */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <motion.div className="text-center mb-12" {...fadeUp}>
          <h2 className="text-4xl font-bold mb-4" style={{ color: "var(--color-primary)" }}>
            {t("NICU Visiting Guidelines", "এনআইসিইউ ভিজিটিং নির্দেশিকা")}
          </h2>
          <p className="text-gray-500 dark:text-gray-400">
            {t("Please follow these guidelines to ensure the safety of all babies", "সব শিশুর নিরাপত্তা নিশ্চিত করতে এই নির্দেশিকা অনুসরণ করুন")}
          </p>
        </motion.div>
        <div className="space-y-3">
          {data.guidelines.map((guideline: string, i: number) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              className="flex items-start gap-4 p-5 bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-all hover:border-orange-200 dark:hover:border-orange-800"
            >
              <FaCheckCircle className="nicu-text-primary flex-shrink-0 mt-0.5" size={18} />
              <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">{guideline}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-28 px-4 text-center">
        <motion.div className="max-w-3xl mx-auto" {...fadeUp}>
          <h2 className="text-4xl md:text-5xl font-bold mb-6 leading-tight tracking-tight" style={{ color: "var(--color-primary)" }}>
            {t("Need NICU Consultation?", "এনআইসিইউ পরামর্শ প্রয়োজন?")}
          </h2>
          <p className="text-lg mb-12 leading-relaxed max-w-xl mx-auto text-gray-500 dark:text-gray-400">
            {t("Our expert neonatologists are available 24/7 for emergency and routine care", "আমাদের বিশেষজ্ঞ নিওনাটোলজিস্টরা জরুরি ও নিয়মিত সেবার জন্য ২৪/৭ উপলব্ধ")}
          </p>
          <a
            href="/appointment?service=nicu"
            className="inline-block text-white px-12 py-5 font-bold text-lg transition-all duration-500 hover:-translate-y-2 transform rounded-[var(--radius-xl)] shadow-xl hover:shadow-2xl"
            style={{
              background: "linear-gradient(135deg, var(--tertiary), var(--color-secondary))",
            }}
          >
            {t("Book Appointment", "অ্যাপয়েন্টমেন্ট বুক করুন")}
          </a>
        </motion.div>
      </section>
    </main>
  );
};

export default NICUServicePage;
