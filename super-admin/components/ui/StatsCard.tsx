"use client";

import { type LucideIcon, TrendingUp, TrendingDown } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

type Color = "blue" | "green" | "amber" | "red" | "purple" | "cyan" | "pink";

const colorMap: Record<Color, { icon: string; trend: string; bar: string }> = {
  blue:   { icon: "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400",   trend: "text-blue-600 dark:text-blue-400",   bar: "bg-blue-500" },
  green:  { icon: "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400", trend: "text-green-600 dark:text-green-400", bar: "bg-green-500" },
  amber:  { icon: "bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400", trend: "text-amber-600 dark:text-amber-400", bar: "bg-amber-500" },
  red:    { icon: "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400",         trend: "text-red-600 dark:text-red-400",     bar: "bg-red-500" },
  purple: { icon: "bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400", trend: "text-purple-600 dark:text-purple-400", bar: "bg-purple-500" },
  cyan:   { icon: "bg-cyan-100 text-cyan-600 dark:bg-cyan-900/30 dark:text-cyan-400",     trend: "text-cyan-600 dark:text-cyan-400",   bar: "bg-cyan-500" },
  pink:   { icon: "bg-pink-100 text-pink-600 dark:bg-pink-900/30 dark:text-pink-400",     trend: "text-pink-600 dark:text-pink-400",   bar: "bg-pink-500" },
};

interface StatsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: { value: number; label: string };
  color?: Color;
  index?: number;
  className?: string;
}

export function StatsCard({ title, value, subtitle, icon: Icon, trend, color = "blue", index = 0, className }: StatsCardProps) {
  const c = colorMap[color];
  const isPositive = trend ? trend.value >= 0 : true;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.07, ease: "easeOut" }}
      className={cn(
        "relative overflow-hidden rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-5 shadow-sm hover:shadow-md transition-shadow duration-200",
        className
      )}
    >
      <div className="flex items-start justify-between">
        <div className="min-w-0 flex-1">
          <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500 truncate">
            {title}
          </p>
          <p className="mt-2 text-2xl font-bold text-gray-900 dark:text-gray-50 tabular-nums">
            {value}
          </p>
          {subtitle && (
            <p className="mt-1 text-xs text-gray-400 dark:text-gray-500">{subtitle}</p>
          )}
          {trend && (
            <div className="mt-2 flex items-center gap-1.5">
              <span className={cn("flex items-center gap-0.5 text-xs font-semibold", isPositive ? "text-green-600 dark:text-green-400" : "text-red-500 dark:text-red-400")}>
                {isPositive ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                {Math.abs(trend.value)}%
              </span>
              <span className="text-xs text-gray-400 dark:text-gray-500">{trend.label}</span>
            </div>
          )}
        </div>
        <div className={cn("flex h-11 w-11 shrink-0 items-center justify-center rounded-xl", c.icon)}>
          <Icon className="h-5 w-5" strokeWidth={1.8} />
        </div>
      </div>
      <div className={cn("absolute bottom-0 left-0 h-0.5 w-16 rounded-full opacity-70", c.bar)} />
    </motion.div>
  );
}
