"use client";

import { useAboutData, CoreValue } from "@/hooks/useAboutData";
import { useLanguage } from "@/context/LanguageContext";
import {
  FaHeartbeat,
  FaShieldAlt,
  FaStar,
  FaLightbulb,
  FaUserCheck,
  FaBullseye,
  FaEye,
  FaRocket,
  FaHandHoldingHeart,
} from "react-icons/fa";
import { motion } from "framer-motion";
import { FiArrowRight, FiCheckCircle } from "react-icons/fi";
import { useEffect, useRef } from "react";
import { BsFillHeartPulseFill } from "react-icons/bs";

const valueIcons: Record<string, React.ElementType> = {
  Compassion: FaHeartbeat,
  Integrity: FaShieldAlt,
  Excellence: FaStar,
  Innovation: FaLightbulb,
  "Patient First": FaUserCheck,
};

const MissionVisionPage = () => {
  const { data, isLoading, isError } = useAboutData();
  const { lang, t } = useLanguage();
  const parallaxRef = useRef<HTMLDivElement>(null);

  // Parallax scrolling effect
  useEffect(() => {
    const handleScroll = () => {
      if (parallaxRef.current) {
        const scrolled = window.pageYOffset;
        parallaxRef.current.style.transform = `translateY(${scrolled * 0.5}px)`;
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 rounded-full border-4 border-primary border-t-transparent animate-spin" />
          <p className="text-primary font-semibold text-lg">{t("Loading...", "লোড হচ্ছে...")}</p>
        </div>
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center p-8">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <p className="text-red-500 text-lg font-medium">
            {t("Failed to load Mission & Vision data.", "মিশন ও ভিশন ডেটা লোড করতে ব্যর্থ হয়েছে।")}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
          >
            {t("Retry", "আবার চেষ্টা করুন")}
          </button>
        </div>
      </div>
    );
  }

  const { missionVision } = data;

  return (
    <main className="bg-white overflow-hidden">
      {/* ══════════════════════════════════════════
          HERO SECTION - STANDARD BANNER
          ══════════════════════════════════════════ */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
        {/* Background Image Layer */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url('/about-us.jpg')` }}
        />
        <div className="absolute inset-0 bg-black/60" />

        {/* Hero Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="border-l-4 border-orange-500 pl-6"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-4 tracking-tight">
              {t(missionVision.title.en, missionVision.title.bn)}
            </h1>
            <div className="flex items-center text-xs md:text-sm font-bold tracking-widest uppercase text-gray-300 gap-3">
              <span className="text-white">{t("MISSION & VISION", "লক্ষ্য ও দর্শন")}</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          MISSION & VISION CARDS
          ══════════════════════════════════════════ */}
      <section className="py-24 px-4 bg-white relative">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Mission Card */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="bg-gradient-to-br from-blue-50 to-white rounded-3xl p-8 md:p-12 shadow-lg border border-blue-100 hover:shadow-xl transition-shadow duration-300"
            >
              <div className="w-16 h-16 rounded-2xl bg-primary flex items-center justify-center text-white mb-6 shadow-md">
                <FaBullseye size={32} />
              </div>
              <h2 className="text-3xl font-bold text-primary mb-4">
                {t(missionVision.mission.title.en, missionVision.mission.title.bn)}
              </h2>
              <p className="text-gray-600 text-lg leading-relaxed">
                {t(missionVision.mission.description.en, missionVision.mission.description.bn)}
              </p>
            </motion.div>

            {/* Vision Card */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="bg-gradient-to-br from-green-50 to-white rounded-3xl p-8 md:p-12 shadow-lg border border-green-100 hover:shadow-xl transition-shadow duration-300"
            >
              <div className="w-16 h-16 rounded-2xl bg-secondary flex items-center justify-center text-white mb-6 shadow-md">
                <FaEye size={32} />
              </div>
              <h2 className="text-3xl font-bold text-primary mb-4">
                {t(missionVision.vision.title.en, missionVision.vision.title.bn)}
              </h2>
              <p className="text-gray-600 text-lg leading-relaxed">
                {t(missionVision.vision.description.en, missionVision.vision.description.bn)}
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          CORE VALUES - UNIQUE GRID LAYOUT
          ══════════════════════════════════════════ */}
      <section className="relative py-24 px-4 bg-gradient-to-br from-white via-blue-50/20 to-white overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 medical-pattern opacity-30" />

        {/* Decorative Blobs */}
        <div className="absolute top-20 right-20 w-96 h-96 bg-secondary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-20 w-80 h-80 bg-primary/10 rounded-full blur-3xl" />

        <div className="max-w-7xl mx-auto relative z-10">
          {/* Section Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-secondary/10 text-secondary text-sm font-bold mb-6">
              <FaStar className="animate-pulse" />
              <span>{t("What We Stand For", "আমাদের মূল্যবোধ")}</span>
            </div>
            <h2 className="text-5xl md:text-6xl font-extrabold text-primary mb-6">
              {t("Our Core Values", "আমাদের মূল মূল্যবোধসমূহ")}
            </h2>
            <p className="text-gray-600 text-xl max-w-3xl mx-auto leading-relaxed">
              {t(
                "These principles guide every decision, treatment, and interaction we have with our patients.",
                "এই নীতিগুলো আমাদের রোগীদের সাথে প্রতিটি সিদ্ধান্ত, চিকিৎসা এবং যোগাযোগের ক্ষেত্রে আমাদের পথপ্রদর্শন করে।"
              )}
            </p>
          </motion.div>

          {/* Values Grid - Unique Layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {missionVision.coreValues.map((val: CoreValue, i: number) => {
              const Icon = valueIcons[val.title.en] || FaStar;
              const gradients = [
                "from-rose-500 to-pink-600",
                "from-blue-600 to-primary",
                "from-amber-500 to-orange-600",
                "from-purple-500 to-purple-700",
                "from-emerald-500 to-green-600",
              ];
              const bgColors = [
                "bg-rose-50",
                "bg-blue-50",
                "bg-amber-50",
                "bg-purple-50",
                "bg-emerald-50",
              ];

              return (
                <motion.div
                  key={val.title.en}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="group relative"
                >
                  {/* Card */}
                  <div className={`${bgColors[i % bgColors.length]} rounded-3xl p-8 h-full hover-lift border-2 border-gray-100 hover:border-gray-200 transition-all duration-300`}>
                    {/* Icon with Gradient Background */}
                    <div className="relative mb-6">
                      <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${gradients[i % gradients.length]} flex items-center justify-center shadow-xl group-hover:scale-110 group-hover:rotate-6 transition-all duration-300`}>
                        <Icon className="text-white text-3xl" />
                      </div>
                      {/* Number Badge */}
                      <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-white shadow-lg flex items-center justify-center">
                        <span className="text-sm font-bold text-primary">{i + 1}</span>
                      </div>
                    </div>

                    {/* Content */}
                    <h3 className="text-2xl font-bold text-primary mb-4 group-hover:text-secondary transition-colors">
                      {t(val.title.en, val.title.bn)}
                    </h3>
                    <p className="text-gray-600 text-base leading-relaxed">
                      {t(val.description.en, val.description.bn)}
                    </p>

                    {/* Check Icon */}
                    <div className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-secondary">
                      <FiCheckCircle />
                      <span>{t("Core Value", "মূল মূল্যবোধ")}</span>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          COMMITMENT SECTION - WITH BACKGROUND
          ══════════════════════════════════════════ */}
      <section className="relative py-32 px-4 overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <div
            className="absolute inset-0 bg-cover bg-center bg-fixed"
            style={{
              backgroundImage: `url('/about-us.jpg')`,
            }}
          />
          <div className="absolute inset-0 bg-primary/60" />
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-10 left-10 w-80 h-80 bg-secondary/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-cyan-400/20 rounded-full blur-3xl animate-pulse delay-1000" />

        <div className="max-w-5xl mx-auto relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            {/* Quote Icon */}
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full glass-card-dark mb-8">
              <span className="text-5xl text-secondary">"</span>
            </div>

            <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-8 leading-tight text-shadow-strong">
              {t("Our Commitment to You", "আপনার প্রতি আমাদের অঙ্গীকার")}
            </h2>

            <p className="text-white/90 text-2xl md:text-3xl font-light italic leading-relaxed mb-6">
              {t(
                "Every patient who walks through our doors deserves the very best care — and that is what we promise.",
                "আমাদের দ্বারে আসা প্রতিটি রোগী সর্বোত্তম সেবা পাওয়ার যোগ্য — এবং আমরা ঠিক এই প্রতিশ্রুতিই দিই।"
              )}
            </p>

            <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full glass-card-dark text-secondary font-bold">
              <BsFillHeartPulseFill className="animate-pulse" />
              <span>{t("Mirsarai General Hospital", "মীরসরাই জেনারেল হাসপাতাল")}</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          WHY IT MATTERS SECTION
          ══════════════════════════════════════════ */}
      <section className="py-24 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-extrabold text-primary mb-6">
              {t("Why This Matters", "এটি কেন গুরুত্বপূর্ণ")}
            </h2>
            <p className="text-gray-600 text-xl max-w-3xl mx-auto">
              {t(
                "Our mission and vision aren't just words — they're the foundation of every action we take.",
                "আমাদের লক্ষ্য এবং দর্শন কেবল শব্দ নয় — এগুলো আমাদের প্রতিটি পদক্ষেপের ভিত্তি।"
              )}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: FaHandHoldingHeart,
                title: t("Patient-Centered Care", "রোগী-কেন্দ্রিক সেবা"),
                description: t(
                  "Your health, comfort, and satisfaction are at the heart of everything we do.",
                  "আপনার স্বাস্থ্য, আরাম এবং সন্তুষ্টি আমাদের প্রতিটি কাজের কেন্দ্রবিন্দুতে রয়েছে।"
                ),
                color: "from-red-500 to-pink-600",
              },
              {
                icon: FaRocket,
                title: t("Continuous Innovation", "ক্রমাগত উদ্ভাবন"),
                description: t(
                  "We constantly evolve with the latest medical technology and treatment methods.",
                  "আমরা প্রতিনিয়ত সর্বাধুনিক চিকিৎসা প্রযুক্তি এবং চিকিৎসা পদ্ধতির সাথে নিজেদের উন্নত করছি।"
                ),
                color: "from-purple-500 to-purple-700",
              },
              {
                icon: FaShieldAlt,
                title: t("Trust & Integrity", "বিশ্বাস ও সততা"),
                description: t(
                  "We maintain the highest ethical standards in all our medical practices.",
                  "আমরা আমাদের সমস্ত চিকিৎসা অনুশীলনে সর্বোচ্চ নৈতিক মান বজায় রাখি।"
                ),
                color: "from-blue-600 to-primary",
              },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="text-center group"
              >
                <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${item.color} flex items-center justify-center mx-auto mb-6 shadow-xl group-hover:scale-110 group-hover:rotate-6 transition-all duration-300`}>
                  <item.icon className="text-white text-4xl" />
                </div>
                <h3 className="text-2xl font-bold text-primary mb-4">{item.title}</h3>
                <p className="text-gray-600 text-base leading-relaxed">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          CTA SECTION
          ══════════════════════════════════════════ */}
      <section className="py-24 px-4 text-center bg-gradient-to-br from-gray-50 via-blue-50/30 to-white">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl mx-auto"
        >
          <h2 className="text-4xl md:text-5xl font-extrabold text-primary mb-6">
            {t("Experience Our Care Today", "আজই আমাদের সেবার অভিজ্ঞতা নিন")}
          </h2>
          <p className="text-gray-600 text-xl mb-10 leading-relaxed">
            {t(
              "Our mission is your health. Come and experience compassionate, world-class healthcare.",
              "আমাদের লক্ষ্য আপনার স্বাস্থ্য। আসুন এবং সহানুভূতিশীল, বিশ্বমানের স্বাস্থ্যসেবার অভিজ্ঞতা নিন।"
            )}
          </p>
          <div className="flex flex-wrap gap-6 justify-center">
            <a
              href="/appointment"
              className="inline-flex items-center gap-3 bg-secondary hover:bg-secondary/90 text-white px-10 py-5 rounded-full font-bold text-lg shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 transform group"
            >
              <BsFillHeartPulseFill className="text-xl" />
              {t("Book an Appointment", "অ্যাপয়েন্টমেন্ট বুক করুন")}
              <FiArrowRight className="text-xl group-hover:translate-x-2 transition-transform" />
            </a>
            <a
              href="/about"
              className="inline-flex items-center gap-3 bg-white hover:bg-gray-50 text-primary border-2 border-gray-200 hover:border-primary/30 px-10 py-5 rounded-full font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 transform"
            >
              {t("← Back to About Us", "← আমাদের সম্পর্কে ফিরে যান")}
            </a>
          </div>
        </motion.div>
      </section>
    </main>
  );
};

export default MissionVisionPage;
