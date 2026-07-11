"use client";

import { useAboutData, CoreValue } from "@/hooks/useAboutData";
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
import { MdVerified } from "react-icons/md";
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
          <p className="text-primary font-semibold text-lg">Loading...</p>
        </div>
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center p-8">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <p className="text-red-500 text-lg font-medium">Failed to load Mission & Vision data.</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
          >
            Retry
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
              {missionVision.title}
            </h1>
            <div className="flex items-center text-xs md:text-sm font-bold tracking-widest uppercase text-gray-300 gap-3">
              <span className="text-white">MISSION & VISION</span>
            </div>
          </motion.div>
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
              <span>What We Stand For</span>
            </div>
            <h2 className="text-5xl md:text-6xl font-extrabold text-primary mb-6">
              Our Core Values
            </h2>
            <p className="text-gray-600 text-xl max-w-3xl mx-auto leading-relaxed">
              These principles guide every decision, treatment, and interaction we have with our patients.
            </p>
          </motion.div>

          {/* Values Grid - Unique Layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {missionVision.coreValues.map((val: CoreValue, i: number) => {
              const Icon = valueIcons[val.title] || FaStar;
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
                  key={val.title}
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
                      {val.title}
                    </h3>
                    <p className="text-gray-600 text-base leading-relaxed">
                      {val.description}
                    </p>

                    {/* Check Icon */}
                    <div className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-secondary">
                      <FiCheckCircle />
                      <span>Core Value</span>
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
              Our Commitment to You
            </h2>

            <p className="text-white/90 text-2xl md:text-3xl font-light italic leading-relaxed mb-6">
              Every patient who walks through our doors deserves the very best care — and that is what we promise.
            </p>

            <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full glass-card-dark text-secondary font-bold">
              <BsFillHeartPulseFill className="animate-pulse" />
              <span>Mirsarai General Hospital</span>
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
              Why This Matters
            </h2>
            <p className="text-gray-600 text-xl max-w-3xl mx-auto">
              Our mission and vision aren't just words — they're the foundation of every action we take.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: FaHandHoldingHeart,
                title: "Patient-Centered Care",
                description: "Your health, comfort, and satisfaction are at the heart of everything we do.",
                color: "from-red-500 to-pink-600"
              },
              {
                icon: FaRocket,
                title: "Continuous Innovation",
                description: "We constantly evolve with the latest medical technology and treatment methods.",
                color: "from-purple-500 to-purple-700"
              },
              {
                icon: FaShieldAlt,
                title: "Trust & Integrity",
                description: "We maintain the highest ethical standards in all our medical practices.",
                color: "from-blue-600 to-primary"
              }
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
            Experience Our Care Today
          </h2>
          <p className="text-gray-600 text-xl mb-10 leading-relaxed">
            Our mission is your health. Come and experience compassionate, world-class healthcare.
          </p>
          <div className="flex flex-wrap gap-6 justify-center">
            <a
              href="/appointment"
              className="inline-flex items-center gap-3 bg-secondary hover:bg-secondary/90 text-white px-10 py-5 rounded-full font-bold text-lg shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 transform group"
            >
              <BsFillHeartPulseFill className="text-xl" />
              Book an Appointment
              <FiArrowRight className="text-xl group-hover:translate-x-2 transition-transform" />
            </a>
            <a
              href="/about"
              className="inline-flex items-center gap-3 bg-white hover:bg-gray-50 text-primary border-2 border-gray-200 hover:border-primary/30 px-10 py-5 rounded-full font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 transform"
            >
              ← Back to About Us
            </a>
          </div>
        </motion.div>
      </section>
    </main>
  );
};

export default MissionVisionPage;
