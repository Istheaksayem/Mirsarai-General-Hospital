"use client";

import { motion } from "framer-motion";
import { Construction } from "lucide-react";

interface ComingSoonCardProps {
  title: string;
  description?: string;
}

export function ComingSoonCard({
  title,
  description = "This section is under construction and will be available soon.",
}: ComingSoonCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-8 py-20 text-center shadow-sm"
    >
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#1E2B7A]/10 dark:bg-[#1E2B7A]/20">
        <Construction className="h-8 w-8 text-[#1E2B7A] dark:text-blue-400" strokeWidth={1.5} />
      </div>
      <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
        {title}
      </h2>
      <p className="mt-2 max-w-sm text-sm text-gray-500 dark:text-gray-400">
        {description}
      </p>
      <div className="mt-6 flex items-center gap-2">
        <span className="h-1.5 w-1.5 rounded-full bg-[#76BC21] animate-pulse" />
        <span className="text-xs font-medium text-[#76BC21]">
          Step 2 coming up
        </span>
      </div>
    </motion.div>
  );
}
