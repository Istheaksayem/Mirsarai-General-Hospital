"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { motion } from "framer-motion";
import { FaUserMd, FaStar, FaPhoneAlt, FaEnvelope } from "react-icons/fa";

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

export default function DoctorDirectoryPage() {
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
        Error loading doctor directory. Please try again later.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] relative overflow-hidden pt-16 pb-24">
      {/* Decorative Blobs */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-primary/15 rounded-full blur-[100px] -translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-secondary/10 rounded-full blur-[120px] translate-x-1/3 translate-y-1/3 pointer-events-none"></div>

      <div className="relative z-10 max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-primary/10 rounded-3xl shadow-sm border border-primary/10">
              <FaUserMd className="w-10 h-10 md:w-12 md:h-12 text-primary" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-6 tracking-tight">
            Doctor Directory
          </h1>
          <p className="text-xl text-gray-600 leading-relaxed max-w-2xl mx-auto">
            Meet our experienced and dedicated team of medical professionals. We are here to provide the best healthcare for you and your family.
          </p>
        </motion.div>

        {/* Doctors Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {doctors.map((doctor, index) => (
            <motion.div
              key={doctor.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: index * 0.1, ease: "easeOut" }}
              className="bg-white/70 backdrop-blur-xl rounded-3xl overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgb(0,0,0,0.1)] transition-all duration-500 border border-white group flex flex-col hover:-translate-y-2"
            >
              {/* Image Section */}
              <div className="relative h-64 overflow-hidden bg-gray-100">
                {/* Fallback pattern if image is missing, though we assume image exists */}
                <div className="absolute inset-0 bg-primary/5 group-hover:bg-transparent transition duration-500 z-10"></div>
                <img 
                  src={doctor.image} 
                  alt={doctor.name} 
                  className="w-full h-full object-cover object-top transform group-hover:scale-105 transition duration-700 ease-out" 
                />
                {doctor.available && (
                  <div className="absolute top-4 right-4 bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full z-20 shadow-sm flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></span>
                    Available
                  </div>
                )}
              </div>

              {/* Content Section */}
              <div className="p-6 flex-grow flex flex-col">
                <div className="mb-2 text-sm font-semibold text-secondary uppercase tracking-wider">
                  {doctor.department}
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-1 group-hover:text-primary transition-colors">
                  {doctor.name}
                </h3>
                <p className="text-gray-600 font-medium mb-4">{doctor.specialization}</p>
                
                <div className="space-y-2 mb-6">
                  <div className="flex items-start gap-2 text-sm text-gray-600">
                    <span className="font-semibold text-gray-800 min-w-[80px]">Experience:</span> 
                    {doctor.experience}
                  </div>
                  <div className="flex items-start gap-2 text-sm text-gray-600">
                    <span className="font-semibold text-gray-800 min-w-[80px]">Degree:</span> 
                    <span className="line-clamp-1">{doctor.qualification}</span>
                  </div>
                </div>

                <div className="mt-auto pt-5 flex items-center justify-between">
                  <Link 
                    href={`/doctors/${doctor.slug}`}
                    className="flex-1 text-center bg-white border border-primary/20 text-primary hover:bg-primary hover:text-white font-bold py-3 px-4 rounded-xl transition duration-300 shadow-sm hover:shadow-md"
                  >
                    View Profile
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
