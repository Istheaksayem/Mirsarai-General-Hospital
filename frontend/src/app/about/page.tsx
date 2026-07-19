"use client";

import { useAboutData } from "@/hooks/useAboutData";
import { useLanguage } from "@/context/LanguageContext";
import { FaUserMd, FaUsers, FaSmile, FaAward, FaHeart, FaStethoscope } from "react-icons/fa";
import { FiCheckCircle, FiArrowRight, FiTarget } from "react-icons/fi";
import { MdSecurity } from "react-icons/md";
import { useEffect, useRef } from "react";
import { BsFillHeartPulseFill } from "react-icons/bs";
import { motion } from "framer-motion";
import { getImageUrl } from "@/lib/getImageUrl";

const statIcons = [FaUserMd, FaUsers, FaSmile, FaAward];
const featureIcons = [FaStethoscope, MdSecurity, FaHeart];

const fadeUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6 },
};

const AboutPage = () => {
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

  // Update SEO Meta tags dynamically
  useEffect(() => {
    if (data?.about?.seo) {
      const seo = data.about.seo;
      document.title = lang === "bn" ? seo.metaTitle.bn : seo.metaTitle.en;
      
      const metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc) {
        metaDesc.setAttribute("content", lang === "bn" ? seo.metaDescription.bn : seo.metaDescription.en);
      }
      
      const metaKeywords = document.querySelector('meta[name="keywords"]');
      if (metaKeywords) {
        metaKeywords.setAttribute("content", lang === "bn" ? seo.keywords.bn : seo.keywords.en);
      } else {
        const meta = document.createElement('meta');
        meta.name = "keywords";
        meta.content = lang === "bn" ? seo.keywords.bn : seo.keywords.en;
        document.head.appendChild(meta);
      }
    }
  }, [data, lang]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 rounded-full border-4 border-primary border-t-transparent animate-spin" />
          <p className="text-primary font-semibold text-lg">
            {t("Loading...", "লোড হচ্ছে...")}
          </p>
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
            {t("Failed to load About data.", "ডেটা লোড করতে ব্যর্থ।")}
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

  const { about } = data;

  // Section components
  const renderHero = () => (
    <section key="hero" className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
      {/* Background Image Layer */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url('${getImageUrl(about.image)}')` }}
      />
      <div className="absolute inset-0 bg-black/60" />

      {/* Hero Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="border-l-4 border-orange-500 pl-6"
          {...fadeUp}
        >
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-4 tracking-tight">
            {t(about.title.en, about.title.bn)}
          </h1>
          <div className="flex items-center text-xs md:text-sm font-bold tracking-widest uppercase text-gray-300 gap-3">
            <span className="text-white">
              {t(about.subtitle.en, about.subtitle.bn)}
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );

  const renderStory = () => (
    <section key="story" className="relative py-24 px-4 sm:px-6 lg:px-8 bg-white">
      {/* Medical Pattern Background */}
      <div className="absolute inset-0 medical-pattern opacity-50" />

      <div className="max-w-7xl mx-auto relative">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

          {/* Left - Image Collage */}
          <motion.div
            className="relative"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            {/* Main Large Image */}
            <div className="relative rounded-3xl overflow-hidden shadow-2xl hover-lift">
              <div
                className="w-full h-[500px] bg-cover bg-center"
                style={{
                  backgroundImage: `url('${getImageUrl(about.image)}')`,
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/60 to-transparent" />

              {/* Overlay Badge */}
              <div className="absolute bottom-6 left-6 right-6 glass-card rounded-2xl p-4">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-secondary/20 flex items-center justify-center flex-shrink-0">
                    <FaAward className="text-secondary text-3xl" />
                  </div>
                  <div>
                    <p className="text-2xl font-extrabold text-primary mb-1">10+ {t("Years", "বছর")}</p>
                    <p className="text-sm text-gray-600 font-medium">
                      {t("Trusted Healthcare Service", "বিশ্বস্ত স্বাস্থ্যসেবা")}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Small Floating Images */}
            <motion.div
              className="absolute -top-8 -right-8 w-40 h-40 rounded-2xl overflow-hidden shadow-xl border-4 border-white"
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            >
              <div
                className="w-full h-full bg-cover bg-center"
                style={{
                  backgroundImage: `url('/hospital-banner.jpg')`,
                }}
              />
            </motion.div>

            <motion.div
              className="absolute -bottom-8 -left-8 w-48 h-48 rounded-2xl overflow-hidden shadow-xl border-4 border-white"
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
            >
              <div
                className="w-full h-full bg-cover bg-center"
                style={{
                  backgroundImage: `url('/hospital-banner.jpg')`,
                }}
              />
            </motion.div>

            {/* Decorative Elements */}
            <div className="absolute -top-4 -left-4 w-24 h-24 border-4 border-secondary/30 rounded-full animate-rotate-slow" />
            <div className="absolute -bottom-4 -right-4 w-32 h-32 border-4 border-primary/20 rounded-full animate-rotate-slow" />
          </motion.div>

          {/* Right - Content */}
          <motion.div
            className="space-y-8"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div>
              <span className="inline-block px-4 py-2 rounded-full bg-secondary/10 text-secondary text-sm font-bold mb-4">
                {t("✨ Our Story", "✨ আমাদের গল্প")}
              </span>

              <h2 className="text-4xl md:text-5xl font-extrabold text-primary mb-6 leading-tight">
                {t(about.storyHeading?.en || "Dedicated to Better Healthcare for All", about.storyHeading?.bn || "নিবেদিত উন্নত স্বাস্থ্যসেবায় সকলের জন্য")}
              </h2>

              <p className="text-gray-600 text-lg leading-relaxed mb-6">
                {t(about.description.en, about.description.bn)}
              </p>
            </div>

            {/* Feature List with Icons */}
            <div className="space-y-4">
              {about.content.map((point, i) => (
                <motion.div
                  key={i}
                  className="group flex items-start gap-4 p-4 rounded-xl bg-gradient-to-r from-blue-50 to-transparent hover:from-blue-100 hover:shadow-md transition-all duration-300"
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.1 }}
                >
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-primary to-blue-900 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                    <FiCheckCircle className="text-white" size={20} />
                  </div>
                  <p className="text-gray-700 text-base leading-relaxed pt-1">
                    {t(point.en, point.bn)}
                  </p>
                </motion.div>
              ))}
            </div>

            {/* CTA Button */}
            <a
              href="/about/mission-vision"
              className="inline-flex items-center gap-3 bg-gradient-to-r from-primary via-blue-900 to-primary bg-size-200 hover:bg-pos-100 text-white px-8 py-4 rounded-full font-bold text-lg hover:shadow-2xl hover:shadow-primary/40 transition-all duration-500 hover:-translate-y-1 transform group"
            >
              <FiTarget className="group-hover:rotate-180 transition-transform duration-500" />
              {t("Our Mission & Vision", "আমাদের লক্ষ্য ও দর্শন")}
              <FiArrowRight className="group-hover:translate-x-2 transition-transform" />
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  );

  const renderFeatures = () => {
    const fs = about.featuresSection;
    if (!fs) return null;
    return (
      <section key="features" className="relative py-24 px-4 overflow-hidden">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0">
          <div
            className="absolute inset-0 bg-cover bg-center bg-fixed"
            style={{
              backgroundImage: `url('${getImageUrl(about.image)}')`,
            }}
          />
          <div className="absolute inset-0 bg-primary/50" />
        </div>

        {/* Decorative Blobs */}
        <div className="absolute top-20 left-20 w-80 h-80 bg-secondary/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-cyan-400/20 rounded-full blur-3xl animate-pulse delay-1000" />

        <div className="max-w-6xl mx-auto relative z-10">
          <motion.div className="text-center mb-16" {...fadeUp}>
            <span className="inline-block px-6 py-2 rounded-full glass-card-dark text-secondary text-sm font-bold mb-6">
              {t(fs.badge.en, fs.badge.bn)}
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 text-shadow-strong">
              {t(fs.heading.en, fs.heading.bn)}
            </h2>
            <p className="text-white/90 text-xl max-w-2xl mx-auto">
              {t(fs.description.en, fs.description.bn)}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {fs.items.map((item, i) => {
              const Icon = featureIcons[i % featureIcons.length];
              return (
                <motion.div
                  key={i}
                  className="group glass-card rounded-3xl p-8 hover:scale-105 transition-all duration-500 hover:shadow-2xl"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                >
                  <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${item.color} flex items-center justify-center mb-6 group-hover:rotate-6 group-hover:scale-110 transition-all duration-300 shadow-xl`}>
                    <Icon className="text-white text-4xl" />
                  </div>
                  <h3 className="text-2xl font-bold text-primary mb-4">{t(item.title.en, item.title.bn)}</h3>
                  <p className="text-gray-600 leading-relaxed text-lg">{t(item.description.en, item.description.bn)}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>
    );
  };

  const renderStatistics = () => (
    <section key="statistics" className="py-20 px-4 bg-gradient-to-br from-gray-50 via-blue-50/30 to-white">
      <div className="max-w-7xl mx-auto">
        <motion.div className="text-center mb-12" {...fadeUp}>
          <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">
            {t("Our Impact in Numbers", "সংখ্যায় আমাদের প্রভাব")}
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            {t(
              "Over a decade of service, we've grown stronger with each patient we've cared for.",
              "এক দশকেরও বেশি সেবায়, আমরা প্রতিটি রোগীর সেবার মাধ্যমে আরও শক্তিশালী পেয়েছি।"
            )}
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {about.statistics.map((stat, i) => {
            const Icon = statIcons[i % statIcons.length];
            return (
              <motion.div
                key={i}
                className="group bg-white rounded-3xl p-8 text-center border-2 border-gray-100 hover:border-secondary/50 hover:shadow-2xl transition-all duration-300 hover:-translate-y-3 transform"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              >
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-secondary/20 to-secondary/10 flex items-center justify-center mx-auto mb-6 group-hover:scale-110 group-hover:rotate-12 transition-all duration-300">
                  <Icon className="text-secondary text-3xl" />
                </div>
                <p className="text-5xl font-extrabold bg-gradient-to-r from-primary to-blue-900 bg-clip-text text-transparent mb-2 group-hover:scale-110 transition-transform">
                  {stat.value}
                </p>
                <p className="text-gray-600 text-base font-semibold">
                  {t(stat.title.en, stat.title.bn)}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );

  const renderCTA = () => (
    <section key="cta" className="relative py-32 px-4 text-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url('${getImageUrl(about.image)}')`,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-white/95 via-blue-50/95 to-white/95" />
      </div>

      <motion.div className="max-w-4xl mx-auto relative z-10" {...fadeUp}>
        <div className="inline-block mb-6">
          <div className="flex items-center gap-3 bg-secondary/10 border border-secondary/20 px-6 py-3 rounded-full backdrop-blur-sm">
            <BsFillHeartPulseFill className="text-secondary text-2xl animate-pulse" />
            <span className="text-primary font-bold">
              {t("Your Health is Our Priority", "আপনার স্বাস্থ্যই আমাদের অগ্রাধিকার")}
            </span>
          </div>
        </div>

        <h2 className="text-5xl md:text-6xl font-extrabold text-primary mb-6 leading-tight">
          {lang === "bn" ? (
            <>উন্নত স্বাস্থ্যসেবার<br />অভিজ্ঞতা নিতে প্রস্তুত?</>
          ) : (
            <>Ready to Experience<br />Better Healthcare?</>
          )}
        </h2>

        <p className="text-gray-600 text-xl mb-12 max-w-2xl mx-auto leading-relaxed">
          {t(
            "Book an appointment today and let our experienced medical team take care of you and your family with compassion and expertise.",
            "আজই একটি অ্যাপয়েন্টমেন্ট বুক করুন এবং আমাদের অভিজ্ঞ চিকিৎসা দলকে সহানুভূতি ও দক্ষতার সাথে আপনার এবং আপনার পরিবারের যত্ন নিতে দিন।"
          )}
        </p>

        <div className="flex flex-wrap gap-6 justify-center">
          <a
            href="/appointment"
            className="inline-flex items-center gap-3 bg-secondary hover:bg-secondary/90 text-white px-12 py-5 rounded-full font-bold text-xl transition-all duration-300 shadow-xl hover:shadow-2xl hover:-translate-y-2 transform group"
          >
            <FaStethoscope className="text-2xl" />
            {t("Book Appointment Now", "এখনই অ্যাপয়েন্টমেন্ট বুক করুন")}
            <FiArrowRight className="text-2xl group-hover:translate-x-2 transition-transform" />
          </a>
          <a
            href="/contact"
            className="inline-flex items-center gap-3 bg-white hover:bg-gray-50 text-primary border-2 border-gray-200 hover:border-primary/30 px-12 py-5 rounded-full font-bold text-xl transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-2 transform"
          >
            {t("Contact Us", "যোগাযোগ করুন")}
          </a>
        </div>
      </motion.div>
    </section>
  );

  // Sorting and filtering based on database settings
  const sectionConfig = about.sections || {
    hero: { isVisible: true, order: 1 },
    story: { isVisible: true, order: 2 },
    features: { isVisible: true, order: 3 },
    statistics: { isVisible: true, order: 4 },
    cta: { isVisible: true, order: 5 }
  };

  const activeSections = Object.entries(sectionConfig)
    .filter(([_, config]) => config.isVisible)
    .sort(([_, a], [__, b]) => a.order - b.order)
    .map(([name]) => name);

  return (
    <main className="bg-white overflow-hidden">
      {activeSections.map((sectionName) => {
        switch (sectionName) {
          case "hero":
            return renderHero();
          case "story":
            return renderStory();
          case "features":
            return renderFeatures();
          case "statistics":
            return renderStatistics();
          case "cta":
            return renderCTA();
          default:
            return null;
        }
      })}
    </main>
  );
};

export default AboutPage;
