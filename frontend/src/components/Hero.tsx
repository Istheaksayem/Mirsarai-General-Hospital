"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { FaUserMd, FaCalendarAlt } from "react-icons/fa";
import { useLanguage } from "@/context/LanguageContext";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useDoctors, Doctor } from "@/hooks/useDoctors";
import { getImageUrl } from "@/lib/getImageUrl";

interface HeroButton {
  label: { en: string; bn: string };
  link: string;
  variant: "primary" | "outline";
}

interface HeroSlide {
  id: number;
  slideNumber: string;
  heading: { en: string; bn: string };
  description: { en: string; bn: string };
  image: string;
  buttons: HeroButton[];
}

interface ShapeConfig {
  color: string;
  size: number;
  position: Record<string, string>;
  opacity: number;
}

interface HeroData {
  slides: HeroSlide[];
  appointmentBooking: {
    enabled: boolean;
    title: { en: string; bn: string };
    departmentLabel: { en: string; bn: string };
    doctorLabel: { en: string; bn: string };
    buttonLabel: { en: string; bn: string };
  };
  joinTeam: {
    enabled: boolean;
    question: { en: string; bn: string };
    title: { en: string; bn: string };
    buttonLabel: { en: string; bn: string };
    buttonLink: string;
    image: string;
  };
  decorativeShapes: {
    enabled: boolean;
    shapes: ShapeConfig[];
  };
}

const normalizeHeroData = (raw: any): HeroData => ({
  slides: raw.slides || [],
  appointmentBooking: raw.appointmentBooking || {
    enabled: true,
    title: { en: "Book an Appointment", bn: "অ্যাপয়েন্টমেন্ট বুক করুন" },
    departmentLabel: { en: "Select Department", bn: "বিভাগ নির্বাচন করুন" },
    doctorLabel: { en: "Select Doctor", bn: "ডাক্তার নির্বাচন করুন" },
    buttonLabel: { en: "Book Appointment", bn: "অ্যাপয়েন্টমেন্ট বুক করুন" }
  },
  joinTeam: raw.joinTeam || {
    enabled: true,
    question: { en: "Are You A Doctor?", bn: "আপনি কি ডাক্তার?" },
    title: { en: "Join Our Team", bn: "আমাদের দলে যোগ দিন" },
    buttonLabel: { en: "Join As Doctors", bn: "ডাক্তার হিসাবে যোগ দিন" },
    buttonLink: "/register",
    image: "/genaral_Hospital_logo.jpeg"
  },
  decorativeShapes: raw.decorativeShapes
});

const fetchHeroData = async (): Promise<HeroData> => {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/homepage/hero`, { cache: "no-store" });
    if (!res.ok) throw new Error("API responded with an error status");
    const result = await res.json();
    if (result.success && result.data) return normalizeHeroData(result.data);
    throw new Error(result.message || "Invalid API response");
  } catch (error) {
    console.warn("Backend API not reachable for hero data. Falling back to local data/hero.json", error);
    const res = await fetch("/data/hero.json", { cache: "no-store" });
    if (!res.ok) throw new Error("Failed to fetch fallback hero data");
    return normalizeHeroData(await res.json());
  }
};

const HeroSkeleton = () => (
  <section className="relative w-full h-screen bg-gray-900 animate-pulse">
    <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-transparent z-10" />
    <div className="relative z-20 h-full flex items-center max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
      <div className="space-y-6 max-w-2xl">
        <div className="h-12 w-20 bg-white/10 rounded" />
        <div className="h-20 w-full bg-white/10 rounded-lg" />
        <div className="h-8 w-3/4 bg-white/10 rounded" />
        <div className="flex gap-4">
          <div className="h-14 w-44 bg-white/10 rounded-lg" />
          <div className="h-14 w-36 bg-white/10 rounded-lg" />
        </div>
      </div>
    </div>
  </section>
);

const Hero = () => {
  const { data, isLoading, isError } = useQuery<HeroData>({
    queryKey: ["hero"],
    queryFn: fetchHeroData,
    staleTime: 1000 * 60 * 10,
  });
  const { lang } = useLanguage();
  const router = useRouter();
  const { data: doctorsList, isLoading: doctorsLoading } = useDoctors();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [selectedDoctor, setSelectedDoctor] = useState("");

  useEffect(() => {
    if (!data) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % data.slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [data]);

  const departments = useMemo(() => {
    if (!doctorsList) return [];
    return Array.from(new Set(doctorsList.map((d) => d.department?.en).filter(Boolean))) as string[];
  }, [doctorsList]);

  const filteredDoctors = useMemo(() => {
    if (!doctorsList) return [];
    if (!selectedDepartment) return doctorsList;
    return doctorsList.filter((d) => d.department?.en === selectedDepartment);
  }, [doctorsList, selectedDepartment]);

  const handleBookAppointment = () => {
    const params = new URLSearchParams();
    if (selectedDepartment) params.set("department", selectedDepartment);
    if (selectedDoctor) params.set("doctor", selectedDoctor);
    router.push(`/appointment${params.toString() ? `?${params.toString()}` : ""}`);
  };

  if (isLoading) return <HeroSkeleton />;
  if (isError || !data) {
    return (
      <section className="relative w-full h-screen flex items-center justify-center bg-gray-900">
        <p className="text-white">Failed to load hero section.</p>
      </section>
    );
  }

  const slides = data.slides;
  const current = slides[currentSlide];

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % slides.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);

  return (
    <>
      <section className="relative w-full h-screen overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={current.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="absolute inset-0"
          >
            <motion.div
              initial={{ scale: 1.1 }}
              animate={{ scale: 1 }}
              transition={{ duration: 8, ease: "linear" }}
              className="absolute inset-0 bg-cover bg-center"
              style={{
                backgroundImage: `url('${getImageUrl(current.image)}')`,
              }}
            />

            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-transparent" />

            <div className="relative z-10 h-full flex items-center max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 50 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="max-w-2xl space-y-6"
              >
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-7xl font-black text-white/10"
                >
                  {current.slideNumber}
                </motion.p>

                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="text-5xl sm:text-6xl lg:text-7xl font-extrabold leading-tight"
                >
                  <span className="text-[#76bc21]">
                    {lang === "bn" ? current.heading.bn.split(" ")[0] : current.heading.en.split(" ")[0]}
                  </span>
                  <br />
                  <span className="text-white">
                    {lang === "bn"
                      ? current.heading.bn.split(" ").slice(1).join(" ")
                      : current.heading.en.split(" ").slice(1).join(" ")}
                  </span>
                </motion.h1>

                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="text-lg sm:text-xl text-gray-200 max-w-xl"
                >
                  {lang === "bn" ? current.description.bn : current.description.en}
                </motion.p>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="flex flex-wrap gap-4 pt-4"
                >
                  {current.buttons.map((btn, idx) => (
                    <Link key={idx} href={btn.link}>
                      {btn.variant === "primary" ? (
                        <button className="px-8 py-4 bg-[#1E2B7A] text-white rounded-lg font-semibold text-base hover:bg-[#76BC21] transition-all duration-300 shadow-lg hover:shadow-2xl hover:-translate-y-1">
                          {lang === "bn" ? btn.label.bn : btn.label.en}
                        </button>
                      ) : (
                        <button className="px-8 py-4 border-2 border-white text-white rounded-lg font-semibold text-base hover:bg-white hover:text-[#1E2B7A] transition-all duration-300">
                          {lang === "bn" ? btn.label.bn : btn.label.en}
                        </button>
                      )}
                    </Link>
                  ))}
                </motion.div>
              </motion.div>
            </div>

            <button
              onClick={prevSlide}
              aria-label="Previous slide"
              className="absolute left-4 sm:left-8 top-1/2 -translate-y-1/2 z-20 w-14 h-14 flex items-center justify-center rounded-full bg-white/10 hover:bg-[#1E2B7A] backdrop-blur-md border border-white/20 text-white transition-all duration-300 hover:scale-110 group"
            >
              <FiChevronLeft size={28} className="group-hover:scale-125 transition-transform" />
            </button>

            <button
              onClick={nextSlide}
              aria-label="Next slide"
              className="absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 z-20 w-14 h-14 flex items-center justify-center rounded-full bg-white/10 hover:bg-[#1E2B7A] backdrop-blur-md border border-white/20 text-white transition-all duration-300 hover:scale-110 group"
            >
              <FiChevronRight size={28} className="group-hover:scale-125 transition-transform" />
            </button>

            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex items-center gap-3">
              {slides.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentSlide(idx)}
                  className={[
                    "h-1.5 rounded-full transition-all duration-300",
                    idx === currentSlide
                      ? "w-12 bg-[#76BC21]"
                      : "w-8 bg-white/40 hover:bg-white/70",
                  ].join(" ")}
                />
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
      </section>

      {/* Bottom Appointment Booking + Join Section */}
      <div className="relative -mt-20 z-30 max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-700 overflow-hidden">
          <div className="grid md:grid-cols-[1.5fr_1fr]">
            {/* Appointment Booking */}
            {data.appointmentBooking && data.appointmentBooking.enabled && (
              <div className="p-6 lg:p-8">
                <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4">
                  {lang === "bn" ? data.appointmentBooking.title?.bn : data.appointmentBooking.title?.en}
                </h3>
                <div className="flex flex-col gap-3">
                  <div className="relative">
                    <FaCalendarAlt className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                    <select
                      value={selectedDepartment}
                      onChange={(e) => { setSelectedDepartment(e.target.value); setSelectedDoctor(""); }}
                      className="w-full pl-11 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#1E2B7A] transition-all appearance-none cursor-pointer"
                    >
                      <option value="">
                        {lang === "bn" ? data.appointmentBooking.departmentLabel?.bn : data.appointmentBooking.departmentLabel?.en}
                      </option>
                      {departments.map((dept) => (
                        <option key={dept} value={dept}>{dept}</option>
                      ))}
                    </select>
                  </div>

                  <div className="relative">
                    <FaUserMd className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                    <select
                      value={selectedDoctor}
                      onChange={(e) => setSelectedDoctor(e.target.value)}
                      className="w-full pl-11 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#1E2B7A] transition-all appearance-none cursor-pointer"
                      disabled={doctorsLoading}
                    >
                      <option value="">
                        {lang === "bn" ? data.appointmentBooking.doctorLabel?.bn : data.appointmentBooking.doctorLabel?.en}
                      </option>
                      {filteredDoctors.map((d) => (
                        <option key={d._id} value={d._id}>
                          {d.name ? (lang === "bn" ? d.name.bn : d.name.en) : "Unknown"}
                        </option>
                      ))}
                    </select>
                  </div>

                  <button
                    onClick={handleBookAppointment}
                    className="w-full px-8 py-3 bg-[#1E2B7A] text-white rounded-lg font-semibold hover:bg-[#76BC21] transition-all duration-300 shadow-md whitespace-nowrap"
                  >
                    <FaCalendarAlt className="inline mr-2" size={16} />
                    {lang === "bn" ? data.appointmentBooking.buttonLabel?.bn : data.appointmentBooking.buttonLabel?.en}
                  </button>
                </div>
              </div>
            )}

            {/* Join Team */}
            {data.joinTeam.enabled && (
              <div className="relative bg-gradient-to-br from-[#1E2B7A] to-[#2c3e7a] text-white p-6 lg:p-8 flex items-center gap-4 overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-[#76BC21]/10 rounded-full blur-3xl" />

                <div className="flex-1 z-10">
                  <p className="text-sm opacity-90 mb-1">
                    {lang === "bn" ? data.joinTeam.question.bn : data.joinTeam.question.en}
                  </p>
                  <h4 className="text-xl font-bold mb-3">
                    {lang === "bn" ? data.joinTeam.title.bn : data.joinTeam.title.en}
                  </h4>
                  <Link href={data.joinTeam.buttonLink}>
                    <button className="px-6 py-2.5 bg-[#76BC21] hover:bg-[#67a81d] rounded-lg font-semibold transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5">
                      {lang === "bn" ? data.joinTeam.buttonLabel.bn : data.joinTeam.buttonLabel.en}
                    </button>
                  </Link>
                </div>

                <div className="hidden sm:block relative w-32 h-32 rounded-full overflow-hidden border-4 border-white/20 shadow-xl flex-shrink-0 z-10">
                  <img
                    src={getImageUrl(data.joinTeam.image)}
                    alt="Doctor"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Hero;
