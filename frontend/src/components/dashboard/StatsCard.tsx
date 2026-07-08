"use client";

import React from "react";
import { FiTrendingUp, FiTrendingDown } from "react-icons/fi";
import { motion } from "framer-motion";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: number; // e.g. 12.5 (positive) or -8.2 (negative)
  trendSuffix?: string; // e.g. "from last month"
  progress?: number; // percentage, e.g. 75
  colorClass?: string; // optional icon override colors
}

export default function StatsCard({
  title,
  value,
  icon,
  trend,
  trendSuffix = "since yesterday",
  progress,
  colorClass = "text-primary dark:text-tertiary",
}: StatsCardProps) {
  const isPositive = trend !== undefined && trend >= 0;

  return (
    <motion.div
      whileHover={{ y: -3 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="bg-white dark:bg-[#0f1524] border border-slate-200/50 dark:border-slate-800/50 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow duration-300 relative overflow-hidden group"
    >
      {/* Decorative background blur gradient */}
      <div className="absolute -right-16 -top-16 w-32 h-32 bg-[#1E2B7A]/5 rounded-full blur-2xl group-hover:bg-[#1E2B7A]/10 transition-colors duration-300 pointer-events-none" />

      <div className="flex items-center justify-between mb-4.5 relative z-10">
        <span className="text-[11px] font-bold text-slate-450 dark:text-slate-500 uppercase tracking-widest">
          {title}
        </span>
        <div className={`p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/40 transition-all duration-300 group-hover:scale-105 ${colorClass}`}>
          {icon}
        </div>
      </div>

      <div className="flex items-baseline gap-2.5 relative z-10">
        <span className="text-3xl font-black tracking-tight text-slate-900 dark:text-white font-sans">
          {value}
        </span>
        {trend !== undefined && (
          <span
            className={`flex items-center gap-1 text-[10px] font-black px-2 py-0.5 rounded-md ${
              isPositive
                ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                : "bg-rose-500/10 text-rose-600 dark:text-rose-400"
            }`}
          >
            {isPositive ? <FiTrendingUp size={11} /> : <FiTrendingDown size={11} />}
            {isPositive ? "+" : ""}
            {trend}%
          </span>
        )}
      </div>

      {trend !== undefined && (
        <span className="block mt-2 text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider">
          {trendSuffix}
        </span>
      )}

      {progress !== undefined && (
        <div className="mt-5 relative z-10">
          <div className="flex items-center justify-between text-[10px] font-bold text-slate-400 dark:text-slate-400 mb-1.5 uppercase tracking-wide">
            <span>Utilization</span>
            <span>{progress}%</span>
          </div>
          <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="h-full bg-gradient-to-r from-[#1E2B7A] to-[#6366F1] dark:from-[#6366F1] dark:to-[#76BC21] rounded-full"
            />
          </div>
        </div>
      )}
    </motion.div>
  );
}
