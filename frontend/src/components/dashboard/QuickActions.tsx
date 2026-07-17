"use client";

import React from "react";

interface ActionItem {
  label: string;
  icon: React.ReactNode;
  onClick: () => void;
  colorClass?: string; // e.g. "bg-blue-500/10 text-blue-500 hover:bg-blue-500 hover:text-white"
}

interface QuickActionsProps {
  actions: ActionItem[];
  title?: string;
}

export default function QuickActions({
  actions,
  title = "Quick Operations",
}: QuickActionsProps) {
  return (
    <div className="bg-white dark:bg-slate-800/40 backdrop-blur-md rounded-2xl p-6 border border-gray-100 dark:border-slate-700/50 shadow-sm transition-all duration-300">
      <h3 className="text-sm font-bold text-gray-400 dark:text-slate-400 uppercase tracking-wider mb-5">
        {title}
      </h3>

      <div className="grid grid-cols-2 gap-4">
        {actions.map((act, idx) => (
          <button
            key={idx}
            onClick={act.onClick}
            className={`flex flex-col items-center justify-center p-4 rounded-xl border border-gray-100 dark:border-slate-700/50 text-center gap-2 hover:-translate-y-0.5 hover:shadow-md transition-all duration-200 cursor-pointer group bg-gray-50/50 hover:bg-white dark:bg-slate-700/10 dark:hover:bg-slate-700/30 ${
              act.colorClass || "text-primary dark:text-tertiary"
            }`}
          >
            <div className="p-3 rounded-lg bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 shadow-sm group-hover:scale-105 transition-transform duration-200">
              {act.icon}
            </div>
            <span className="text-xs font-bold text-gray-700 dark:text-slate-200 tracking-tight">
              {act.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
