"use client";

import { useNICUService } from "@/hooks/useNICUService";
import {
  FaHeartbeat,
  FaLaptopMedical,
  FaUserNurse,
  FaHandHoldingHeart,
  FaBaby,
  FaShieldAlt,
  FaCheckCircle
} from "react-icons/fa";
import { MdLocalHospital } from "react-icons/md";
import { motion } from "framer-motion";

const iconMap: Record<string, any> = {
  FaHeartbeat,
  FaLaptopMedical,
  FaUserNurse,
  FaHandHoldingHeart,
};

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.5 },
};

const NICUServicePage = () => {
  const { data, isLoading, isError } = useNICUService();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "var(--background)" }}>
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 rounded-full border-4 border-[var(--tertiary)] border-t-transparent animate-spin" />
          <p className="font-semibold text-lg nicu-text-primary">Loading...</p>
        </div>
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "var(--background)" }}>
        <p className="text-red-500 text-lg font-medium">Failed to load NICU service data.</p>
      </div>
    );
  }

  const { nicu } = data;

  return (
    <main className="overflow-hidden" style={{ background: "var(--background)" }}>
      {/* ── Hero Banner ── */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <img
            src={nicu.backgroundImage}
            alt="NICU Care"
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).src =
                "https://images.unsplash.com/photo-1631815588090-d4bfec5b1ccb?w=1920&h=800&fit=crop";
            }}
          />
          <div className="absolute inset-0 bg-black/60" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="border-l-4 border-orange-500 pl-6"
            {...fadeUp}
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-4 tracking-tight">
              {nicu.title}
            </h1>
            <div className="flex items-center text-xs md:text-sm font-bold tracking-widest uppercase text-gray-300 gap-3">
              <span className="text-white">NICU</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Features Grid ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 -mt-16 relative z-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {nicu.features.map((feature, index) => {
            const Icon = iconMap[feature.icon] || FaHeartbeat;
            return (
              <motion.div
                key={index}
                className="glass-panel p-8 text-center group hover:-translate-y-2 transition-all duration-500"
                style={{
                  borderRadius: "var(--radius-lg)"
                }}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div
                  className="nicu-gradient w-16 h-16 flex items-center justify-center mx-auto mb-5 transition-all duration-300 group-hover:scale-110"
                  style={{
                    borderRadius: "var(--radius-md)",
                  }}
                >
                  <Icon className="text-white" size={28} />
                </div>
                <h3 className="text-lg font-bold mb-3" style={{ color: "var(--color-primary)" }}>
                  {feature.title}
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: "var(--foreground)", opacity: 0.7 }}>
                  {feature.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* ── About Section ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div 
            className="relative order-2 lg:order-1"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div
              className="nicu-gradient absolute -top-6 -left-6 w-full h-full"
              style={{
                opacity: 0.1,
                borderRadius: "var(--radius-xl)"
              }}
            />
            <img
              src="https://images.unsplash.com/photo-1631815588090-d4bfec5b1ccb?w=800&h=600&fit=crop"
              alt="NICU"
              className="relative z-10 w-full h-[500px] object-cover"
              style={{
                borderRadius: "var(--radius-xl)",
                boxShadow: "var(--shadow-xl)"
              }}
            />
          </motion.div>

          <motion.div 
            className="order-1 lg:order-2"
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-8 leading-tight" style={{ color: "var(--color-primary)" }}>
              Caring for Your <span className="nicu-text-primary">Precious Little Ones</span>
            </h2>
            <p
              className="text-lg leading-relaxed mb-8"
              style={{ color: "var(--foreground)", opacity: 0.75 }}
            >
              {nicu.description}
            </p>

            <div className="space-y-4">
              {[
                { icon: FaBaby, title: "Specialized Equipment", desc: "Modern incubators & ventilators" },
                { icon: FaShieldAlt, title: "Expert Medical Staff", desc: "Trained neonatologists & nurses" },
                { icon: FaHeartbeat, title: "24/7 Monitoring", desc: "Continuous care & supervision" }
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-4">
                  <div
                    className="nicu-gradient-light w-12 h-12 flex items-center justify-center flex-shrink-0"
                    style={{
                      borderRadius: "var(--radius-md)"
                    }}
                  >
                    <item.icon className="nicu-text-primary" size={20} />
                  </div>
                  <div>
                    <p className="font-semibold" style={{ color: "var(--color-primary)" }}>
                      {item.title}
                    </p>
                    <p className="text-sm" style={{ color: "var(--foreground)", opacity: 0.6 }}>
                      {item.desc}
                    </p>
                  </div>
                </div>
              ))}
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
            <h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight" style={{ color: "var(--color-primary)" }}>
              Our NICU Services
            </h2>
            <p className="text-lg max-w-2xl mx-auto" style={{ color: "var(--foreground)", opacity: 0.7 }}>
              Comprehensive neonatal care for premature and critically ill newborns
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {nicu.services.map((service, index) => (
              <motion.div
                key={index}
                className="premium-card p-8 hover:scale-[1.02] transition-all duration-300"
                style={{
                  borderRadius: "var(--radius-lg)"
                }}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className="flex items-center gap-4 mb-6">
                  <div
                    className="nicu-gradient w-12 h-12 flex items-center justify-center"
                    style={{
                      borderRadius: "var(--radius-md)"
                    }}
                  >
                    <MdLocalHospital className="text-white" size={24} />
                  </div>
                  <h3 className="text-xl font-bold" style={{ color: "var(--color-primary)" }}>
                    {service.category}
                  </h3>
                </div>
                <ul className="space-y-3">
                  {service.items.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <FaCheckCircle
                        className="nicu-text-primary mt-1 flex-shrink-0"
                        size={16}
                      />
                      <span className="text-sm leading-relaxed" style={{ color: "var(--foreground)", opacity: 0.75 }}>
                        {item}
                      </span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>

          {/* Equipment Section */}
          <motion.div 
            className="glass-panel p-10" 
            style={{ borderRadius: "var(--radius-lg)" }}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <h3 className="text-2xl font-bold mb-6 text-center" style={{ color: "var(--color-primary)" }}>
              Advanced Medical Equipment
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {nicu.equipment.map((item, i) => (
                <div
                  key={i}
                  className="nicu-gradient-light text-center p-4 rounded-lg transition-all duration-300 hover:scale-105"
                >
                  <p className="text-sm font-medium" style={{ color: "var(--foreground)", opacity: 0.8 }}>
                    {item}
                  </p>
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
            <div
              className="nicu-gradient inline-block px-5 py-2 mb-6 text-sm font-bold tracking-wider uppercase text-white"
              style={{
                borderRadius: "var(--radius-xl)"
              }}
            >
              Our Success
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight" style={{ color: "var(--color-primary)" }}>
              Trusted NICU Care
            </h2>
            <p className="text-lg max-w-2xl mx-auto leading-relaxed" style={{ color: "var(--foreground)", opacity: 0.7 }}>
              Providing exceptional neonatal care with proven success rates
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {nicu.statistics.map((stat, i) => (
              <motion.div
                key={i}
                className="nicu-glow-hover premium-card text-center p-10 group hover:-translate-y-2"
                style={{
                  borderRadius: "var(--radius-lg)"
                }}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              >
                <div
                  className="nicu-gradient w-14 h-14 flex items-center justify-center mx-auto mb-4 transition-transform duration-300 group-hover:scale-110"
                  style={{
                    borderRadius: "var(--radius-md)"
                  }}
                >
                  <FaBaby className="text-white" size={24} />
                </div>
                <p className="nicu-text-primary text-5xl font-extrabold mb-2 tracking-tight">
                  {stat.value}
                </p>
                <p className="text-sm font-medium tracking-wide" style={{ color: "var(--foreground)", opacity: 0.7 }}>
                  {stat.label}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Guidelines Section ── */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <motion.div className="text-center mb-12" {...fadeUp}>
          <h2 className="text-4xl font-bold mb-4" style={{ color: "var(--color-primary)" }}>
            NICU Visiting Guidelines
          </h2>
          <p style={{ color: "var(--foreground)", opacity: 0.7 }}>
            Please follow these guidelines to ensure the safety of all babies
          </p>
        </motion.div>

        <div className="space-y-4">
          {nicu.guidelines.map((guideline, i) => (
            <motion.div
              key={i}
              className="premium-card p-6 flex items-start gap-4"
              style={{
                borderRadius: "var(--radius-md)"
              }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
            >
              <FaCheckCircle className="nicu-text-primary flex-shrink-0 mt-1" size={20} />
              <p style={{ color: "var(--foreground)", opacity: 0.8 }}>{guideline}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── CTA Section ── */}
      <section className="py-28 px-4 text-center">
        <motion.div className="max-w-3xl mx-auto" {...fadeUp}>
          <h2 className="text-4xl md:text-5xl font-bold mb-6 leading-tight tracking-tight" style={{ color: "var(--color-primary)" }}>
            Need NICU Consultation?
          </h2>
          <p
            className="text-lg mb-12 leading-relaxed max-w-xl mx-auto"
            style={{ color: "var(--foreground)", opacity: 0.7 }}
          >
            Our expert neonatologists are available 24/7 for emergency and routine care
          </p>
          <a
            href="/appointment"
            className="nicu-gradient nicu-glow inline-block text-white px-12 py-5 font-bold text-lg transition-all duration-500 hover:-translate-y-2 transform"
            style={{
              borderRadius: "var(--radius-xl)",
            }}
          >
            Book Appointment
          </a>
        </motion.div>
      </section>
    </main>
  );
};

export default NICUServicePage;
