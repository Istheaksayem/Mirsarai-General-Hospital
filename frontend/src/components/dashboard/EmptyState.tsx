"use client";

import React from "react";
import { FiInbox } from "react-icons/fi";

interface EmptyStateProps {
  title?: string;
  description?: string;
  icon?: React.ReactNode;
  actionButton?: React.ReactNode;
}

export default function EmptyState({
  title = "No data available",
  description = "There are no records in this view currently.",
  icon = <FiInbox size={42} className="text-gray-400 dark:text-slate-500" />,
  actionButton,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center text-center p-8 min-h-[300px]">
      <div className="mb-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-dashed border-slate-200 dark:border-slate-800">
        {icon}
      </div>
      <h3 className="text-base font-black text-slate-900 dark:text-white mb-1.5">
        {title}
      </h3>
      <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mb-6 leading-relaxed font-bold">
        {description}
      </p>
      {actionButton && <div>{actionButton}</div>}
    </div>
  );
}
