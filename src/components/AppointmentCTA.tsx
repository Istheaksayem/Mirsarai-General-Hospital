"use client";

import React from "react";
import { motion } from "framer-motion";

const AppointmentCTA = () => {
  return (
    <section className="py-24 relative overflow-hidden bg-primary">
      {/* Abstract Background Shapes */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-white opacity-5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-tertiary opacity-20 rounded-full blur-3xl translate-x-1/3 translate-y-1/3"></div>
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Book Your Appointment Today
          </h2>
          <p className="text-lg md:text-xl text-blue-100 mb-10 max-w-2xl mx-auto font-light">
            Don't wait to prioritize your health. Schedule a consultation with our world-class specialists and take the first step towards a healthier tomorrow.
          </p>
          <a href="/appointment" className="inline-block bg-secondary hover:bg-opacity-90 text-white px-10 py-5 rounded-full font-bold text-xl transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-105 transform">
            Book Appointment
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default AppointmentCTA;
