"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface TooltipProps {
  content: string;
  children: React.ReactNode;
  position?: "top" | "bottom" | "left" | "right";
}

export default function Tooltip({
  content,
  children,
  position = "top",
}: TooltipProps) {
  const [active, setActive] = useState(false);

  const positionClasses = {
    top: "bottom-full left-1/2 -translate-x-1/2 mb-2",
    bottom: "top-full left-1/2 -translate-x-1/2 mt-2",
    left: "right-full top-1/2 -translate-y-1/2 mr-2",
    right: "left-full top-1/2 -translate-y-1/2 ml-2",
  };

  const arrowClasses = {
    top: "top-full left-1/2 -translate-x-1/2 border-t-gray-900 dark:border-t-slate-800",
    bottom: "bottom-full left-1/2 -translate-x-1/2 border-b-gray-900 dark:border-b-slate-800",
    left: "left-full top-1/2 -translate-y-1/2 border-l-gray-900 dark:border-l-slate-800",
    right: "right-full top-1/2 -translate-y-1/2 border-r-gray-900 dark:border-r-slate-800",
  };

  return (
    <div
      className="relative flex items-center"
      onMouseEnter={() => setActive(true)}
      onMouseLeave={() => setActive(false)}
      onFocus={() => setActive(true)}
      onBlur={() => setActive(false)}
    >
      {children}
      <AnimatePresence>
        {active && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className={`absolute z-50 pointer-events-none ${positionClasses[position]}`}
          >
            <div className="bg-gray-900 dark:bg-slate-850 text-white dark:text-slate-100 text-[10px] font-bold tracking-tight px-2.5 py-1.5 rounded-lg shadow-md whitespace-nowrap border border-gray-800 dark:border-slate-700 relative">
              {content}
              <div
                className={`absolute border-4 border-transparent ${arrowClasses[position]}`}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
