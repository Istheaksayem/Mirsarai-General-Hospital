"use client";

import React from "react";
import { motion } from "framer-motion";
import { useDoctors } from "@/hooks/useDoctors";
import Link from "next/link";

const Doctors = () => {
  const { data: doctors, isLoading, error } = useDoctors();

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Our Specialist Doctors</h2>
          <div className="w-20 h-1 bg-primary mx-auto rounded-full mb-4"></div>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            Meet our team of highly qualified and experienced medical professionals dedicated to your well-being.
          </p>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-primary"></div>
          </div>
        ) : error || !doctors ? (
          <div className="text-center text-red-500 py-12 font-medium">
            Failed to load doctors.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {doctors.map((doctor, index) => (
              <motion.div
                key={doctor.id}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl border border-gray-100 transition-all duration-300 group flex flex-col"
              >
                <div className="relative h-64 overflow-hidden bg-gray-200">
                  <img
                    src={doctor.image}
                    alt={doctor.name}
                    className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-110"
                  />
                </div>
                <div className="p-6 flex flex-col flex-grow">
                  <h3 className="text-xl font-bold text-gray-900 mb-1">{doctor.name}</h3>
                  <p className="text-secondary font-medium mb-2">{doctor.specialization}</p>
                  <div className="inline-block self-start bg-tertiary/20 text-tertiary-dark px-3 py-1 rounded-full text-sm font-semibold mb-4 text-cyan-800 bg-cyan-100">
                    {doctor.experience}
                  </div>
                  <p className="text-gray-600 text-sm mb-6 line-clamp-3 flex-grow">
                    {doctor.about}
                  </p>
                  <Link href={`/doctors/${doctor.slug}`} className="text-center w-full py-2.5 border border-primary text-primary hover:bg-primary hover:text-white rounded-xl font-medium transition-colors duration-300 block">
                    View Details
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default Doctors;
