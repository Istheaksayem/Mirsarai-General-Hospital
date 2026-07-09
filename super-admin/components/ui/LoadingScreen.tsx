"use client";

import { motion } from "framer-motion";

export function LoadingScreen() {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white dark:bg-gray-950">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="flex flex-col items-center gap-6"
      >
        {/* Logo mark */}
        <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-[#1E2B7A] to-[#2d3fa8] shadow-lg shadow-[#1E2B7A]/30">
          <span className="text-2xl font-bold text-white">M</span>
          <span className="absolute -bottom-1 -right-1 h-5 w-5 rounded-full bg-[#76BC21]" />
        </div>

        {/* Spinner */}
        <div className="relative h-8 w-8">
          <motion.span
            className="absolute inset-0 rounded-full border-2 border-[#1E2B7A]/20"
          />
          <motion.span
            className="absolute inset-0 rounded-full border-2 border-transparent border-t-[#1E2B7A]"
            animate={{ rotate: 360 }}
            transition={{ duration: 0.9, repeat: Infinity, ease: "linear" }}
          />
        </div>

        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
          Loading…
        </p>
      </motion.div>
    </div>
  );
}
