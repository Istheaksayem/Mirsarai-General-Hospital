"use client";

import React from "react";
import { motion } from "framer-motion";

const doctors = [
  {
    name: "Dr. Sarah Jenkins",
    specialty: "Chief of Cardiology",
    experience: "15+ Years Experience",
    description: "Expert in interventional cardiology and advanced heart failure management.",
    image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "Dr. Michael Chen",
    specialty: "Orthopedic Surgeon",
    experience: "12+ Years Experience",
    description: "Specializes in sports injuries, joint replacement, and trauma surgery.",
    image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "Dr. Emily Roberts",
    specialty: "Lead Pediatrician",
    experience: "10+ Years Experience",
    description: "Dedicated to providing exceptional care for infants, children, and adolescents.",
    image: "https://images.unsplash.com/photo-1594824436998-058a23116d0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "Dr. James Wilson",
    specialty: "General Surgery",
    experience: "20+ Years Experience",
    description: "Renowned general surgeon with expertise in minimally invasive procedures.",
    image: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
  },
];

const Doctors = () => {
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {doctors.map((doctor, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl border border-gray-100 transition-all duration-300 group"
            >
              <div className="relative h-64 overflow-hidden bg-gray-200">
                <img
                  src={doctor.image}
                  alt={doctor.name}
                  className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-110"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-1">{doctor.name}</h3>
                <p className="text-secondary font-medium mb-2">{doctor.specialty}</p>
                <div className="inline-block bg-tertiary/20 text-tertiary-dark px-3 py-1 rounded-full text-sm font-semibold mb-4 text-cyan-800 bg-cyan-100">
                  {doctor.experience}
                </div>
                <p className="text-gray-600 text-sm mb-6 line-clamp-3">
                  {doctor.description}
                </p>
                <button className="w-full py-2.5 border border-primary text-primary hover:bg-primary hover:text-white rounded-xl font-medium transition-colors duration-300">
                  View Profile
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Doctors;
