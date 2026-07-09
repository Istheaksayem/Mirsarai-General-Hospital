"use client";

import { useAboutData, CoreValue } from "@/hooks/useAboutData";
import {
  FaHeartbeat,
  FaShieldAlt,
  FaStar,
  FaLightbulb,
  FaUserCheck,
} from "react-icons/fa";
import { motion } from "framer-motion";

const valueIcons: Record<string, React.ElementType> = {
  Compassion: FaHeartbeat,
  Integrity: FaShieldAlt,
  Excellence: FaStar,
  Innovation: FaLightbulb,
  "Patient First": FaUserCheck,
};

const valueColors = [
  { bg: "bg-rose-50", icon: "text-rose-500", border: "border-rose-200" },
  { bg: "bg-blue-50", icon: "text-blue-500", border: "border-blue-200" },
  { bg: "bg-amber-50", icon: "text-amber-500", border: "border-amber-200" },
  { bg: "bg-purple-50", icon: "text-purple-500", border: "border-purple-200" },
  { bg: "bg-emerald-50", icon: "text-emerald-500", border: "border-emerald-200" },
];

const MissionVisionPage = () => {
  const { data, isLoading, isError } = useAboutData();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 rounded-full border-4 border-primary border-t-transparent animate-spin" />
          <p className="text-primary font-semibold text-lg">Loading...</p>
        </div>
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-500 text-lg font-medium">Failed to load Mission & Vision data.</p>
      </div>
    );
  }

  const { missionVision } = data;

  return (
    <main className="bg-white overflow-hidden">
      {/* ── Hero Banner ── */}
      <section className="relative bg-primary py-24 px-4 text-white text-center overflow-hidden">
        <div className="absolute -top-20 -right-20 w-72 h-72 rounded-full bg-secondary/15 blur-3xl" />
        <div className="absolute -bottom-20 -left-20 w-72 h-72 rounded-full bg-tertiary/15 blur-3xl" />
        <div className="relative z-10 max-w-3xl mx-auto">
          <span className="inline-block px-4 py-1.5 rounded-full bg-tertiary/20 text-tertiary text-sm font-semibold tracking-wider uppercase mb-4">
            Our Purpose
          </span>
          <h1 className="text-4xl md:text-6xl font-extrabold mb-4 leading-tight">
            {missionVision.title}
          </h1>
          <p className="text-white/75 text-lg font-light">
            The values and vision that drive everything we do.
          </p>
        </div>
      </section>

      {/* ── Mission & Vision Cards ── */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Mission */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="relative group rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition duration-500"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-primary to-[#162060]" />
            {/* decorative ring */}
            <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-white/5" />
            <div className="absolute -bottom-10 -left-10 w-48 h-48 rounded-full bg-secondary/10" />
            <div className="relative z-10 p-10">
              <div className="w-14 h-14 rounded-2xl bg-secondary/20 flex items-center justify-center mb-6">
                <FaHeartbeat className="text-secondary" size={28} />
              </div>
              <h2 className="text-2xl font-bold text-white mb-4">
                {missionVision.mission.title}
              </h2>
              <p className="text-white/80 leading-relaxed text-base">
                {missionVision.mission.description}
              </p>
              {/* bottom accent line */}
              <div className="mt-8 h-1 w-16 rounded-full bg-secondary group-hover:w-32 transition-all duration-500" />
            </div>
          </motion.div>

          {/* Vision */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
            className="relative group rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition duration-500"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-tertiary/90 to-[#008fa3]" />
            <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-white/5" />
            <div className="absolute -bottom-10 -left-10 w-48 h-48 rounded-full bg-white/10" />
            <div className="relative z-10 p-10">
              <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center mb-6">
                <FaStar className="text-white" size={28} />
              </div>
              <h2 className="text-2xl font-bold text-white mb-4">
                {missionVision.vision.title}
              </h2>
              <p className="text-white/85 leading-relaxed text-base">
                {missionVision.vision.description}
              </p>
              <div className="mt-8 h-1 w-16 rounded-full bg-white/50 group-hover:w-32 transition-all duration-500" />
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Core Values ── */}
      <section className="bg-gray-50 py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <span className="inline-block px-4 py-1.5 rounded-full bg-secondary/15 text-secondary text-sm font-semibold tracking-wider uppercase mb-3">
              What We Stand For
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-primary">
              Our Core Values
            </h2>
            <p className="text-gray-500 mt-3 max-w-xl mx-auto text-base">
              These principles guide every decision, treatment, and interaction we have with our patients.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {missionVision.coreValues.map((val: CoreValue, i: number) => {
              const Icon = valueIcons[val.title] || FaStar;
              const color = valueColors[i % valueColors.length];
              return (
                <motion.div
                  key={val.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.5, delay: i * 0.1, ease: "easeOut" }}
                  className={`${color.bg} border ${color.border} rounded-2xl p-7 hover:shadow-lg transition duration-300 hover:-translate-y-1 group`}
                >
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 rounded-xl bg-white shadow-sm flex items-center justify-center flex-shrink-0">
                      <Icon className={`${color.icon}`} size={22} />
                    </div>
                    <h3 className="text-lg font-bold text-gray-800">{val.title}</h3>
                  </div>
                  <p className="text-gray-600 text-sm leading-relaxed">{val.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Divider with quote ── */}
      <section className="bg-primary py-16 px-4 text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-5 bg-[radial-gradient(circle_at_center,_#76BC21_1px,_transparent_1px)] bg-[size:32px_32px]" />
        <div className="relative z-10 max-w-3xl mx-auto">
          <p className="text-4xl text-white/20 font-serif mb-4">"</p>
          <p className="text-white text-xl md:text-2xl font-light italic leading-relaxed">
            Every patient who walks through our doors deserves the very best care — and that is what we promise.
          </p>
          <p className="text-secondary font-semibold mt-6 text-sm tracking-widest uppercase">
            — Mirsarai General Hospital
          </p>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-20 px-4 text-center bg-white">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="max-w-xl mx-auto"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">
            Experience Our Care
          </h2>
          <p className="text-gray-500 mb-8 text-base">
            Our mission is your health. Come and experience compassionate, world-class care today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/appointment"
              className="bg-primary text-white px-8 py-4 rounded-full font-bold text-base hover:bg-primary/90 transition duration-300 shadow-lg hover:-translate-y-0.5 transform"
            >
              Book Appointment
            </a>
            <a
              href="/about"
              className="border-2 border-primary text-primary px-8 py-4 rounded-full font-bold text-base hover:bg-primary/5 transition duration-300"
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
