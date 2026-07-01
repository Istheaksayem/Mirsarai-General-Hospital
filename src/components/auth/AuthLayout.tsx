"use client";

import React from "react";
import { motion } from "framer-motion";
import BrandingSection from "./BrandingSection";

interface AuthLayoutProps {
  children: React.ReactNode;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4 sm:p-6 lg:p-8">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-6xl bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col lg:flex-row min-h-[700px]"
      >
        {/* Left Side: Branding */}
        <div className="w-full lg:w-5/12 hidden md:block">
          <BrandingSection />
        </div>

        {/* Mobile Branding (Visible only on small screens) */}
        <div className="w-full md:hidden bg-gradient-to-br from-primary to-blue-800 p-8 text-white text-center">
          <img src="/genaral_Hospital_logo.jpeg" alt="Hospital Logo" className="h-16 w-auto mx-auto mb-4 rounded-full" />
          <h2 className="text-2xl font-bold mb-2">Mirsarai General Hospital</h2>
          <p className="text-blue-100 text-sm">Your Health, Our Priority</p>
        </div>

        {/* Right Side: Form */}
        <div className="w-full lg:w-7/12 p-8 sm:p-12 flex flex-col justify-center relative bg-white">
          {children}
        </div>
      </motion.div>
    </div>
  );
};

export default AuthLayout;
