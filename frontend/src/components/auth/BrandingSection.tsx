"use client";

import React from "react";
import { FaHeartbeat, FaStethoscope, FaUserMd } from "react-icons/fa";
import { motion } from "framer-motion";

const BrandingSection = () => {
  return (
    <div className="w-full h-full bg-gradient-to-br from-primary via-blue-800 to-cyan-700 p-12 text-white flex flex-col justify-between relative overflow-hidden">
      {/* Decorative background shapes */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 rounded-full bg-white opacity-5 blur-3xl"></div>
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-cyan-400 opacity-10 blur-3xl"></div>
      
      <div className="relative z-10">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex items-center space-x-4 mb-16"
        >
          <div className="bg-white p-2 rounded-full">
            <img src="/genaral_Hospital_logo.jpeg" alt="Hospital Logo" className="h-12 w-12 rounded-full object-cover" />
          </div>
          <h1 className="text-2xl font-bold tracking-wide">Mirsarai General</h1>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <h2 className="text-4xl lg:text-5xl font-extrabold mb-6 leading-tight">
            Your Health,<br />
            <span className="text-cyan-300">Our Priority</span>
          </h2>
          <p className="text-blue-100 text-lg leading-relaxed max-w-md font-light">
            Access your account to book appointments, view medical history, and manage your healthcare services securely.
          </p>
        </motion.div>
      </div>

      {/* Abstract Illustration via Icons */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.6 }}
        className="relative z-10 mt-12 w-full max-w-sm mx-auto h-64 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 p-8 shadow-2xl flex items-center justify-center"
      >
        <div className="absolute top-4 left-4 text-cyan-300/30 text-6xl">
          <FaStethoscope />
        </div>
        <div className="absolute bottom-4 right-4 text-white/20 text-7xl">
          <FaUserMd />
        </div>
        <div className="bg-white p-6 rounded-full shadow-xl shadow-cyan-900/50 animate-pulse">
          <FaHeartbeat className="text-6xl text-primary" />
        </div>
      </motion.div>
    </div>
  );
};

export default BrandingSection;
