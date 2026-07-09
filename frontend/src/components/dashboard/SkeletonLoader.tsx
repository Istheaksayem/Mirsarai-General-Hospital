"use client";

import React from "react";

interface SkeletonLoaderProps {
  type?: "table" | "card" | "list";
  rows?: number;
  cardsCount?: number;
}

export default function SkeletonLoader({
  type = "card",
  rows = 5,
  cardsCount = 3,
}: SkeletonLoaderProps) {
  if (type === "table") {
    return (
      <div className="w-full bg-white dark:bg-[#0f1524] border border-slate-200/50 dark:border-slate-800/50 rounded-2xl shadow-sm p-6 animate-pulse">
        <div className="flex justify-between items-center mb-6">
          <div className="h-9 w-64 bg-slate-100 dark:bg-slate-800 rounded-xl" />
          <div className="h-9 w-32 bg-slate-100 dark:bg-slate-800 rounded-xl" />
        </div>
        <div className="space-y-4">
          <div className="h-10 bg-slate-50 dark:bg-slate-800/40 rounded-lg w-full" />
          {Array.from({ length: rows }).map((_, i) => (
            <div key={i} className="flex gap-4">
              <div className="h-12 bg-slate-50 dark:bg-slate-800/20 rounded-lg flex-1" />
              <div className="h-12 bg-slate-50 dark:bg-slate-800/20 rounded-lg flex-1" />
              <div className="h-12 bg-slate-50 dark:bg-slate-800/20 rounded-lg flex-1" />
              <div className="h-12 bg-slate-50 dark:bg-slate-800/20 rounded-lg w-20" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (type === "list") {
    return (
      <div className="w-full space-y-4 animate-pulse">
        {Array.from({ length: rows }).map((_, i) => (
          <div
            key={i}
            className="flex items-center justify-between p-4 bg-white dark:bg-[#0f1524] border border-slate-200/50 dark:border-slate-800/50 rounded-xl"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800" />
              <div className="space-y-2">
                <div className="h-4 w-32 bg-slate-100 dark:bg-slate-800 rounded" />
                <div className="h-3 w-20 bg-slate-100 dark:bg-slate-800 rounded" />
              </div>
            </div>
            <div className="h-6 w-16 bg-slate-100 dark:bg-slate-800 rounded-full" />
          </div>
        ))}
      </div>
    );
  }

  // default card grids
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-pulse">
      {Array.from({ length: cardsCount }).map((_, i) => (
        <div
          key={i}
          className="bg-white dark:bg-[#0f1524] rounded-2xl p-6 border border-slate-200/50 dark:border-slate-800/50 shadow-sm space-y-4"
        >
          <div className="flex items-center justify-between">
            <div className="h-4 w-24 bg-slate-100 dark:bg-slate-800 rounded" />
            <div className="h-10 w-10 bg-slate-100 dark:bg-slate-800 rounded-xl" />
          </div>
          <div className="h-8 w-16 bg-slate-100 dark:bg-slate-800 rounded" />
          <div className="h-3 w-32 bg-slate-100 dark:bg-slate-800 rounded" />
        </div>
      ))}
    </div>
  );
}
