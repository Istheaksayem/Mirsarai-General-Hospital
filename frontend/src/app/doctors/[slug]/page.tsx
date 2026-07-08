"use client";

import React, { use } from "react";
import { useQuery } from "@tanstack/react-query";
import { notFound } from "next/navigation";
import { motion } from "framer-motion";
import { FaUserMd, FaGraduationCap, FaBriefcase, FaMoneyBillWave, FaClock, FaCheckCircle, FaGlobe, FaPhoneAlt, FaEnvelope } from "react-icons/fa";

interface Doctor {
  id: number;
  name: string;
  slug: string;
  specialization: string;
  qualification: string;
  experience: string;
  department: string;
  designation: string;
  image: string;
  phone: string;
  email: string;
  chamberTime: string;
  consultationFee: number;
  languages: string[];
  about: string;
  services: string[];
  available: boolean;
}

const fetchDoctors = async (): Promise<Doctor[]> => {
  const res = await fetch("/data/doctors.json");
  if (!res.ok) throw new Error("Failed to fetch doctors");
  return res.json();
};

export default function DoctorProfilePage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = use(params);

  const { data: doctors, isLoading, error } = useQuery({
    queryKey: ["doctors"],
    queryFn: fetchDoctors,
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh] bg-gray-50/30">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-primary"></div>
      </div>
    );
  }

  if (error || !doctors) {
    return (
      <div className="flex justify-center items-center min-h-[60vh] text-red-500 bg-gray-50/30 font-medium text-lg">
        Error loading doctor profile. Please try again later.
      </div>
    );
  }

  const doctor = doctors.find((d) => d.slug === resolvedParams.slug);

  if (!doctor) {
    return notFound();
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white pt-12 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Profile Header Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden mb-12"
        >
          <div className="flex flex-col md:flex-row">
            {/* Image */}
            <div className="w-full md:w-1/3 lg:w-1/4 relative h-80 md:h-auto bg-gray-100">
              <img
                src={doctor.image}
                alt={doctor.name}
                className="w-full h-full object-cover object-top"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(doctor.name)}&background=0D8ABC&color=fff&size=512`;
                }}
              />
              {doctor.available && (
                <div className="absolute top-4 left-4 bg-green-500 text-white text-sm font-bold px-4 py-1.5 rounded-full z-20 shadow-md flex items-center gap-2">
                  <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
                  Available Today
                </div>
              )}
            </div>

            {/* Info */}
            <div className="w-full md:w-2/3 lg:w-3/4 p-8 md:p-10 flex flex-col justify-center">
              <div className="inline-block px-4 py-1.5 bg-secondary/10 text-secondary text-sm font-bold rounded-full mb-4 w-fit uppercase tracking-wide">
                {doctor.department}
              </div>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-gray-900 mb-2">
                {doctor.name}
              </h1>
              <p className="text-xl text-primary font-medium mb-6">{doctor.designation}</p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-8 mb-8">
                <div className="flex items-center gap-3 text-gray-600">
                  <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center shrink-0 text-primary">
                    <FaGraduationCap size={20} />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 font-semibold uppercase">Qualification</p>
                    <p className="font-medium">{doctor.qualification}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-gray-600">
                  <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center shrink-0 text-secondary">
                    <FaBriefcase size={18} />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 font-semibold uppercase">Specialization</p>
                    <p className="font-medium">{doctor.specialization}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-gray-600">
                  <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center shrink-0 text-orange-500">
                    <FaClock size={18} />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 font-semibold uppercase">Experience</p>
                    <p className="font-medium">{doctor.experience}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-gray-600">
                  <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center shrink-0 text-green-500">
                    <FaMoneyBillWave size={18} />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 font-semibold uppercase">Consultation Fee</p>
                    <p className="font-medium">৳{doctor.consultationFee}</p>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-4 pt-6 border-t border-gray-100">
                <a href="#appointment" className="bg-primary text-white font-bold py-3 px-8 rounded-full shadow-md hover:shadow-lg hover:bg-primary/90 transition duration-300">
                  Book Appointment
                </a>
                {/* <a href={`tel:${doctor.phone}`} className="flex items-center gap-2 bg-gray-50 text-gray-700 font-bold py-3 px-6 rounded-full hover:bg-gray-100 transition duration-300">
                  <FaPhoneAlt /> Call Doctor
                </a> */}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Details Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="lg:col-span-2 space-y-8"
          >
            {/* About */}
            <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100">
              <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                <span className="w-2 h-6 bg-primary rounded-full"></span>
                About {doctor.name}
              </h3>
              <p className="text-gray-600 leading-relaxed text-lg">
                {doctor.about}
              </p>
            </div>

            {/* Services */}
            <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100">
              <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                <span className="w-2 h-6 bg-secondary rounded-full"></span>
                Specialized Services
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {doctor.services.map((service, idx) => (
                  <div key={idx} className="flex items-start gap-3 p-3 rounded-2xl hover:bg-gray-50 transition duration-200 border border-transparent hover:border-gray-100">
                    <FaCheckCircle className="text-secondary mt-1 shrink-0" size={18} />
                    <span className="text-gray-700 font-medium">{service}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Right Column */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="space-y-8"
          >
            {/* Schedule & Contact */}
            <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100">
              <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                <span className="w-2 h-6 bg-primary rounded-full"></span>
                Chamber & Contact
              </h3>

              <div className="space-y-6">
                <div>
                  <p className="text-sm text-gray-400 font-semibold uppercase mb-2">Chamber Time</p>
                  <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 flex items-center gap-3">
                    <FaClock className="text-primary shrink-0" size={20} />
                    <span className="text-gray-700 font-medium">{doctor.chamberTime}</span>
                  </div>
                </div>

                <div>
                  <p className="text-sm text-gray-400 font-semibold uppercase mb-2">Contact Number</p>
                  <a href={`tel:${doctor.phone}`} className="bg-gray-50 p-4 rounded-xl border border-gray-100 flex items-center gap-3 hover:bg-primary/5 hover:border-primary/20 transition group">
                    <FaPhoneAlt className="text-primary shrink-0" size={18} />
                    <span className="text-gray-700 font-medium group-hover:text-primary transition">{doctor.phone}</span>
                  </a>
                </div>

                <div>
                  <p className="text-sm text-gray-400 font-semibold uppercase mb-2">Email Address</p>
                  <a href={`mailto:${doctor.email}`} className="bg-gray-50 p-4 rounded-xl border border-gray-100 flex items-center gap-3 hover:bg-primary/5 hover:border-primary/20 transition group">
                    <FaEnvelope className="text-primary shrink-0" size={18} />
                    <span className="text-gray-700 font-medium group-hover:text-primary transition break-all">{doctor.email}</span>
                  </a>
                </div>

                <div>
                  <p className="text-sm text-gray-400 font-semibold uppercase mb-2">Languages Spoken</p>
                  <div className="flex gap-2 flex-wrap">
                    {doctor.languages.map(lang => (
                      <span key={lang} className="px-3 py-1.5 bg-gray-50 border border-gray-100 rounded-lg text-sm font-medium text-gray-600 flex items-center gap-1.5">
                        <FaGlobe className="text-gray-400" size={12} /> {lang}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
