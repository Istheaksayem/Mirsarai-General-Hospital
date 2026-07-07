"use client";

import React from "react";
import { motion } from "framer-motion";
import { FaAmbulance, FaStethoscope, FaHeartbeat, FaBone, FaBaby, FaMicroscope } from "react-icons/fa";

const services = [
  {
    title: "Emergency Care",
    description: "24/7 rapid response and comprehensive emergency medical services.",
    icon: <FaAmbulance className="text-4xl text-primary" />,
  },
  {
    title: "General Medicine",
    description: "Expert diagnosis, treatment, and management of adult health conditions.",
    icon: <FaStethoscope className="text-4xl text-primary" />,
  },
  {
    title: "Cardiology",
    description: "Advanced cardiac care, diagnostics, and heart disease management.",
    icon: <FaHeartbeat className="text-4xl text-primary" />,
  },
  {
    title: "Orthopedics",
    description: "Specialized care for bones, joints, ligaments, tendons, and muscles.",
    icon: <FaBone className="text-4xl text-primary" />,
  },
  {
    title: "Pediatrics",
    description: "Compassionate and expert medical care for infants, children, and adolescents.",
    icon: <FaBaby className="text-4xl text-primary" />,
  },
  {
    title: "Laboratory Services",
    description: "State-of-the-art diagnostic testing with accurate and fast results.",
    icon: <FaMicroscope className="text-4xl text-primary" />,
  },
];

const Services = () => {
  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Our Medical Services</h2>
          <div className="w-20 h-1 bg-secondary mx-auto rounded-full mb-4"></div>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            We offer a wide range of medical services to ensure that you and your family receive the best possible care.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -10, transition: { duration: 0.2 } }}
              className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-xl border border-gray-100 transition-all duration-300"
            >
              <div className="bg-primary/10 w-16 h-16 rounded-2xl flex items-center justify-center mb-6">
                {service.icon}
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">{service.title}</h3>
              <p className="text-gray-600 leading-relaxed">{service.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
