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
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white pt-16 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
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
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 group flex flex-col"
            >
              {/* Image Section */}
              <div className="relative h-64 overflow-hidden bg-gray-100">
                {/* Fallback pattern if image is missing, though we assume image exists */}
                <div className="absolute inset-0 bg-primary/5 group-hover:bg-transparent transition duration-500 z-10"></div>
                <img 
                  src={doctor.image} 
                  alt={doctor.name} 
                  className="w-full h-full object-cover object-top transform group-hover:scale-105 transition duration-700 ease-out" 
                  onError={(e) => {
                    // Fallback to placeholder if image fails to load
                    (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(doctor.name)}&background=0D8ABC&color=fff&size=512`;
                  }}
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

                <div className="mt-auto pt-4 border-t border-gray-100 flex items-center justify-between">
                  <Link 
                    href={`/doctors/${doctor.slug}`}
                    className="flex-1 text-center bg-primary/10 text-primary hover:bg-primary hover:text-white font-semibold py-2.5 px-4 rounded-xl transition duration-300"
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
