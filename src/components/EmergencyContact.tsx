"use client";

import React from "react";
import { FaPhoneAlt } from "react-icons/fa";
import { motion } from "framer-motion";

const EmergencyContact = () => {
  return (
    <section className="bg-red-600 text-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex flex-col md:flex-row items-center justify-between bg-red-700/50 p-8 md:p-12 rounded-3xl backdrop-blur-sm border border-red-500/30 shadow-2xl"
        >
          <div className="flex items-center mb-6 md:mb-0">
            <div className="bg-white text-red-600 p-5 rounded-full mr-6 animate-pulse shadow-lg">
              <FaPhoneAlt className="text-4xl md:text-5xl" />
            </div>
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-2">Emergency? Call Now</h2>
              <p className="text-red-100 text-lg">Our emergency team is available 24/7 for immediate assistance.</p>
            </div>
          </div>
          
          <div className="text-center md:text-right">
            <a 
              href="tel:+8801234567890" 
              className="inline-block text-4xl md:text-5xl font-black tracking-wider hover:text-red-200 transition-colors duration-300"
            >
              +880 1234-567890
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default EmergencyContact;
