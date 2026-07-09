"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import { notFound } from "next/navigation";
import { FaMicroscope, FaCheckCircle } from "react-icons/fa";
import { motion } from "framer-motion";

// Types
interface Service {
  id: number;
  title: string;
  slug: string;
  shortDescription: string;
  description: string;
  image: string;
  icon: string;
  features: string[];
  availableServices: string[];
}

const fetchServices = async (): Promise<Service[]> => {
  const res = await fetch("/data/services.json");
  if (!res.ok) throw new Error("Failed to fetch services");
  return res.json();
};

export default function DiagnosticServicePage() {
  const { data: services, isLoading, error } = useQuery({
    queryKey: ["services"],
    queryFn: fetchServices,
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh] bg-gray-50/30">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-primary"></div>
      </div>
    );
  }

  if (error || !services) {
    return (
      <div className="flex justify-center items-center min-h-[60vh] text-red-500 bg-gray-50/30 font-medium text-lg">
        Error loading service data. Please try again later.
      </div>
    );
  }

  // Find the specific service data
  const service = services.find((s) => s.slug === "diagnostic-services");

  if (!service) {
    return notFound();
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
              <FaMicroscope className="w-10 h-10 md:w-12 md:h-12 text-primary" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 mb-6 tracking-tight">
            {service.title}
          </h1>
          <p className="text-xl text-gray-600 leading-relaxed max-w-2xl mx-auto">
            {service.shortDescription}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Left Column: Image & Description */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
            className="lg:col-span-7 space-y-8"
          >
            <div className="relative rounded-[2rem] overflow-hidden shadow-2xl group border border-gray-100">
              <div className="absolute inset-0 bg-primary/5 group-hover:bg-transparent transition duration-500 z-10"></div>
              <img
                src={service.image}
                alt={service.title}
                className="w-full h-[350px] md:h-[450px] object-cover transform group-hover:scale-105 transition duration-700 ease-out"
              />
            </div>

            <div className="bg-white p-8 md:p-10 rounded-[2rem] shadow-sm border border-gray-100/80 hover:shadow-md transition duration-300">
              <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                <span className="w-2 h-6 bg-primary rounded-full"></span>
                Overview
              </h3>
              <p className="text-gray-600 leading-relaxed text-lg">
                {service.description}
              </p>
            </div>
          </motion.div>

          {/* Right Column: Features & Services Lists */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
            className="lg:col-span-5 space-y-8"
          >
            {/* Features */}
            <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100/80 hover:shadow-md transition duration-300">
              <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                <span className="w-2 h-6 bg-secondary rounded-full"></span>
                Key Features
              </h3>
              <ul className="space-y-4">
                {service.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-4 p-3 rounded-2xl hover:bg-gray-50 transition duration-200">
                    <FaCheckCircle className="text-secondary mt-1 flex-shrink-0" size={20} />
                    <span className="text-gray-700 font-medium text-[1.05rem]">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Available Services */}
            <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100/80 hover:shadow-md transition duration-300">
              <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                <span className="w-2 h-6 bg-primary rounded-full"></span>
                Available Services
              </h3>
              <div className="flex flex-wrap gap-3">
                {service.availableServices.map((item, idx) => (
                  <span
                    key={idx}
                    className="px-4 py-2.5 bg-gray-50 text-gray-700 rounded-xl text-sm font-semibold border border-gray-100 hover:bg-primary hover:text-white hover:border-primary transition duration-300 shadow-sm cursor-default"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>

            {/* CTA */}
            <div className="bg-gradient-to-br from-primary to-[#005c99] p-8 md:p-10 rounded-[2rem] shadow-xl text-white text-center relative overflow-hidden group">
              <div className="absolute -top-24 -right-24 w-48 h-48 bg-white/10 rounded-full blur-3xl group-hover:scale-150 transition duration-700"></div>
              <h3 className="text-2xl font-bold mb-4 relative z-10">Need Medical Assistance?</h3>
              <p className="text-primary-50 mb-8 opacity-95 relative z-10 text-[1.05rem]">
                Our expert team is available 24/7 to provide the best care for you and your family.
              </p>
              <a href="/appointment" className="relative z-10 inline-block bg-white text-primary font-bold py-3.5 px-8 rounded-full shadow-lg hover:shadow-2xl hover:-translate-y-1 transition duration-300 ease-in-out w-full sm:w-auto">
                Book an Appointment
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
