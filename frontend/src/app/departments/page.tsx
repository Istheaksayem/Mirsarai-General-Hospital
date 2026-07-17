"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useDepartments } from "@/hooks/useDepartments";
import { useLanguage } from "@/context/LanguageContext";
import * as FaIcons from "react-icons/fa6";
import * as FaIcons5 from "react-icons/fa";
import {
  FiSearch, FiChevronRight, FiUsers, FiCheckCircle,
  FiAward, FiClock, FiHeart, FiShield,
} from "react-icons/fi";
import { FaStar } from "react-icons/fa";

// ── Icon resolvers ──────────────────────────────────────────
const getDeptIcon = (iconName: string) => {
  const Icon6 = (FaIcons as any)[iconName];
  if (Icon6) return Icon6;
  const Icon5 = (FaIcons5 as any)[iconName];
  if (Icon5) return Icon5;
  return FaIcons5.FaHospital;
};

// Maps icon name strings from JSON to actual icon components
const featureIconMap: Record<string, React.ElementType> = {
  FiAward,
  FiClock,
  FiHeart,
  FiShield,
};

export default function DepartmentsPage() {
  const { lang } = useLanguage();
  const { data, isLoading, error } = useDepartments(lang);
  const [selectedDept, setSelectedDept] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50/50">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-primary"></div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500">
        <p>Failed to load departments data.</p>
      </div>
    );
  }

  const { departments, hospitalStats, features, testimonials, cta } = data;

  const filteredDepartments = departments.filter((dept) =>
    dept.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const activeDepartment = departments.find((d) => d.slug === selectedDept);

  // Derive stats dynamically from departments data
  const totalDoctors = departments.reduce((sum, d) => sum + d.availableDoctors, 0);
  const stats = [
    { value: `${departments.length}+`, label: "Departments", icon: FaIcons5.FaHospital },
    { value: `${totalDoctors}+`, label: "Expert Doctors", icon: FiUsers },
    { value: hospitalStats.patientsCount, label: "Patients Treated", icon: FiHeart },
    { value: hospitalStats.yearsOfService, label: "Years of Service", icon: FiAward },
  ];

  return (
    <main className="min-h-screen bg-gray-50/30 pt-8 pb-20">
      {/* ── Header Banner ── */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden mb-8">
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('/about-us.jpg')" }}
        />
        <div className="absolute inset-0 bg-black/60" />

        {/* Hero Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="border-l-4 border-orange-500 pl-6 animate-slide-up">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-4 tracking-tight">
              Our Departments
            </h1>
            <div className="flex items-center text-xs md:text-sm font-bold tracking-widest uppercase text-gray-300 gap-3">
              <span className="text-white">DEPARTMENTS</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── Stats Bar ── */}
      <div className="bg-white border-b border-gray-100 shadow-sm mb-8">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-gray-100">
            {stats.map((stat, i) => (
              <div key={i} className="flex flex-col items-center justify-center py-6 gap-1">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mb-2">
                  <stat.icon size={18} className="text-primary" />
                </div>
                <p className="text-2xl md:text-3xl font-extrabold text-primary">{stat.value}</p>
                <p className="text-xs md:text-sm text-gray-500 font-medium">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Sidebar + Main Grid ── */}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-8">

          {/* Sidebar */}
          <div className="w-full lg:w-1/4">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 sticky top-28">
              <h2 className="text-xl font-bold text-gray-900 mb-4 px-2">Categories</h2>

              <div className="relative mb-4">
                <input
                  type="text"
                  placeholder="Search department..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm"
                />
                <FiSearch className="absolute left-3.5 top-3.5 text-gray-400" />
              </div>

              <div className="space-y-1.5">
                {/* All Departments */}
                <button
                  onClick={() => setSelectedDept(null)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-300 text-left ${selectedDept === null
                    ? "bg-primary text-white shadow-md font-semibold"
                    : "text-gray-600 hover:bg-gray-50 hover:text-primary font-medium"
                    }`}
                >
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <FaIcons5.FaHospital
                      size={16}
                      className={selectedDept === null ? "text-white" : "text-primary"}
                    />
                  </div>
                  <span className="text-sm">All Departments</span>
                  {selectedDept === null && <FiChevronRight size={14} className="ml-auto" />}
                </button>

                {/* Per-department with thumbnail */}
                {departments.map((dept) => {
                  const isSelected = selectedDept === dept.slug;
                  return (
                    <button
                      key={dept.id}
                      onClick={() => setSelectedDept(dept.slug)}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-300 text-left ${isSelected
                        ? "bg-primary text-white shadow-md font-semibold"
                        : "text-gray-600 hover:bg-gray-50 hover:text-primary font-medium"
                        }`}
                    >
                      <div
                        className="w-10 h-10 rounded-lg flex-shrink-0 overflow-hidden relative"
                        style={{ minWidth: "40px", minHeight: "40px" }}
                      >
                        <img
                          src={dept.image}
                          alt={dept.name}
                          style={{
                            position: "absolute",
                            top: 0, left: 0,
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                          }}
                        />
                        {isSelected && (
                          <div style={{ position: "absolute", inset: 0, background: "rgba(30,43,122,0.3)" }} />
                        )}
                      </div>
                      <span className="text-sm flex-1">{dept.name}</span>
                      {isSelected && <FiChevronRight size={14} />}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="w-full lg:w-3/4">
            <AnimatePresence mode="wait">
              {selectedDept === null ? (
                /* Grid View */
                <motion.div
                  key="grid"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
                >
                  {filteredDepartments.map((dept) => {
                    const Icon = getDeptIcon(dept.icon);
                    return (
                      <div
                        key={dept.id}
                        onClick={() => setSelectedDept(dept.slug)}
                        className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-xl hover:border-primary/20 transition-all duration-300 cursor-pointer group"
                      >
                        <div style={{ height: "176px", width: "100%", position: "relative", overflow: "hidden", background: "#f1f5f9" }}>
                          <img
                            src={dept.image}
                            alt={dept.name}
                            style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", objectFit: "cover" }}
                            className="group-hover:scale-105 transition-transform duration-500"
                          />
                          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.05) 50%, transparent 100%)" }} />
                          <div style={{ position: "absolute", bottom: "12px", left: "16px", width: "40px", height: "40px", borderRadius: "10px", background: "rgba(255,255,255,0.92)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 2px 8px rgba(0,0,0,0.15)" }}>
                            <Icon size={18} className="text-primary" />
                          </div>
                        </div>
                        <div className="p-5">
                          <h3 className="text-lg font-bold text-gray-900 mb-1.5 group-hover:text-primary transition-colors">{dept.name}</h3>
                          <p className="text-gray-500 text-sm mb-4 line-clamp-2">{dept.shortDescription}</p>
                          <div className="flex items-center text-primary font-medium text-sm">
                            Explore Department <FiChevronRight className="ml-1" />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  {filteredDepartments.length === 0 && (
                    <div className="col-span-full py-12 text-center text-gray-500">No departments found.</div>
                  )}
                </motion.div>
              ) : (
                /* Detail View */
                activeDepartment && (
                  <motion.div
                    key="detail"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-sm"
                  >
                    <div style={{ height: "300px", width: "100%", position: "relative", overflow: "hidden", background: "#e2e8f0" }}>
                      <img
                        src={activeDepartment.image}
                        alt={activeDepartment.name}
                        style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", objectFit: "cover" }}
                      />
                      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.05) 40%, transparent 100%)" }} />
                      <div style={{ position: "absolute", bottom: "24px", left: "32px" }}>
                        <h2 style={{ color: "#fff", fontSize: "1.875rem", fontWeight: 700, textShadow: "0 2px 8px rgba(0,0,0,0.4)" }}>
                          {activeDepartment.name}
                        </h2>
                      </div>
                    </div>

                    <div className="p-8 md:p-10">
                      <div className="flex items-center justify-between mb-6">
                        <h2 className="text-3xl font-bold text-gray-900 flex items-center gap-4">
                          {React.createElement(getDeptIcon(activeDepartment.icon), { className: "text-primary" })}
                          {activeDepartment.name}
                        </h2>
                        {activeDepartment.available && (
                          <span className="px-4 py-1.5 bg-green-100 text-green-700 rounded-full text-sm font-semibold flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                            Available Now
                          </span>
                        )}
                      </div>
                      <p className="text-gray-600 text-lg leading-relaxed mb-8">{activeDepartment.description}</p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
                        <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
                          <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                            <FiUsers className="text-primary" /> Head of Department
                          </h3>
                          <p className="text-gray-700 font-medium text-lg">{activeDepartment.headDoctor}</p>
                          <p className="text-gray-500 text-sm mt-1">{activeDepartment.availableDoctors} Specialists Available</p>
                        </div>
                      </div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-6">Key Services</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {activeDepartment.services.map((service, idx) => (
                          <div key={idx} className="flex items-start gap-3 bg-white p-4 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                            <FiCheckCircle className="text-secondary mt-1 flex-shrink-0" size={20} />
                            <span className="text-gray-700 font-medium">{service}</span>
                          </div>
                        ))}
                      </div>
                      <div className="mt-10 pt-8 border-t border-gray-100 flex flex-wrap gap-4">
                        <a href="/appointment" className="bg-primary text-white px-8 py-3.5 rounded-xl font-bold hover:bg-blue-700 transition-colors shadow-lg shadow-primary/20 inline-block text-center">
                          Book Appointment
                        </a>
                        <a href="/doctors" className="bg-white text-gray-700 border-2 border-gray-200 px-8 py-3.5 rounded-xl font-bold hover:border-primary hover:text-primary transition-colors inline-block text-center">
                          View Doctors
                        </a>
                      </div>
                    </div>
                  </motion.div>
                )
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* ── Why Choose Us ── (data from JSON) */}
      <section className="py-20 mt-16 bg-white border-t border-gray-100">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-semibold mb-4">
              Why Choose Us
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              World-Class Care, <span className="text-primary">Close to Home</span>
            </h2>
            <p className="text-gray-500 max-w-2xl mx-auto">
              Our departments are equipped with cutting-edge technology and staffed by dedicated professionals committed to your health.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((item, i) => {
              const FeatureIcon = featureIconMap[item.icon] ?? FiAward;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.1 }}
                  className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
                >
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-5" style={{ background: item.bg }}>
                    <FeatureIcon size={22} style={{ color: item.color }} />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{item.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{item.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Patient Testimonials ── (data from JSON) */}
      <section className="py-20 bg-primary/5">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-semibold mb-4">
              Testimonials
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              What Our <span className="text-primary">Patients Say</span>
            </h2>
            <p className="text-gray-500 max-w-xl mx-auto">
              Thousands of patients trust Mirsarai General Hospital. Here&apos;s what some of them have to say.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.12 }}
                className="bg-white rounded-2xl border border-gray-100 p-7 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col"
              >
                {/* Stars */}
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: t.rating }).map((_, s) => (
                    <FaStar key={s} size={14} className="text-yellow-400" />
                  ))}
                </div>
                {/* Quote */}
                <p className="text-gray-600 text-sm leading-relaxed flex-1 mb-6 italic">
                  &ldquo;{t.text}&rdquo;
                </p>
                {/* Author */}
                <div className="flex items-center gap-3">
                  <div
                    className="w-11 h-11 rounded-full flex items-center justify-center text-white font-bold text-lg flex-shrink-0"
                    style={{ background: t.color }}
                  >
                    {t.avatar}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">{t.name}</p>
                    <p className="text-xs text-gray-400">{t.department} Department</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Banner ── */}
      <section className="py-16 px-4">
        <div className="max-w-[1400px] mx-auto">
          <div
            className="rounded-3xl p-10 md:p-14 text-center"
            style={{ background: "linear-gradient(135deg, var(--primary) 0%, #2d3f9e 100%)" }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">{cta.title}</h2>
            <p className="text-white/80 max-w-xl mx-auto mb-8 text-lg">{cta.description}</p>
            <div className="flex flex-wrap gap-4 justify-center">
              <a href={cta.primaryBtn.link} className="inline-block px-8 py-4 rounded-xl font-bold text-primary bg-white hover:bg-gray-50 transition-colors shadow-lg text-base">
                {cta.primaryBtn.label}
              </a>
              <a href={cta.secondaryBtn.link} className="inline-block px-8 py-4 rounded-xl font-bold text-white border-2 border-white/40 hover:bg-white/10 transition-colors text-base">
                {cta.secondaryBtn.label}
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
