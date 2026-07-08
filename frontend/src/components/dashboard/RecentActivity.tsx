"use client";

import React from "react";
import { FiCheckCircle, FiAlertCircle, FiInfo, FiActivity } from "react-icons/fi";

interface ActivityItem {
  id: string | number;
  user: string;
  role?: string;
  action: string;
  module?: string;
  timestamp: string;
  status: "success" | "failed" | "warning" | "info" | string;
  ipAddress?: string;
}

interface RecentActivityProps {
  activities: ActivityItem[];
  title?: string;
}

export default function RecentActivity({
  activities,
  title = "Recent Activity Log",
}: RecentActivityProps) {
  const getIcon = (status: string) => {
    switch (status) {
      case "success":
        return (
          <div className="p-2 bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400 rounded-full">
            <FiCheckCircle size={16} />
          </div>
        );
      case "failed":
        return (
          <div className="p-2 bg-rose-50 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400 rounded-full">
            <FiAlertCircle size={16} />
          </div>
        );
      case "warning":
        return (
          <div className="p-2 bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400 rounded-full">
            <FiAlertCircle size={16} />
          </div>
        );
      case "info":
      default:
        return (
          <div className="p-2 bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400 rounded-full">
            <FiInfo size={16} />
          </div>
        );
    }
  };

  const formatTime = (timeStr: string) => {
    try {
      const date = new Date(timeStr);
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch {
      return timeStr;
    }
  };

  return (
    <div className="bg-white dark:bg-[#0f1524] border border-slate-200/50 dark:border-slate-800/50 rounded-2xl p-6 shadow-sm transition-all duration-300">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xs font-bold text-slate-450 dark:text-slate-500 uppercase tracking-widest">
          {title}
        </h3>
        <div className="text-[#1E2B7A] dark:text-[#76BC21]">
          <FiActivity size={16} />
        </div>
      </div>

      <div className="relative border-l border-slate-100 dark:border-slate-800/60 ml-4 space-y-6">
        {activities.map((act) => (
          <div key={act.id} className="relative pl-7 group">
            {/* Timeline icon */}
            <div className="absolute -left-4 top-0 transition-transform duration-200 group-hover:scale-110">
              {getIcon(act.status)}
            </div>

            {/* Event Details */}
            <div className="space-y-1">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                <span className="text-xs font-bold text-slate-900 dark:text-white">
                  {act.action}
                </span>
                <span className="text-[10px] text-slate-400 dark:text-slate-500 font-bold">
                  {formatTime(act.timestamp)}
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-slate-500 dark:text-slate-400 font-semibold">
                <span className="font-extrabold text-[#1E2B7A] dark:text-[#76BC21]">
                  {act.user}
                </span>
                {act.role && (
                  <span className="px-2 py-0.5 bg-slate-100 dark:bg-slate-900 rounded text-[9px] font-bold text-slate-500 dark:text-slate-400 border border-slate-200/40 dark:border-slate-850">
                    {act.role}
                  </span>
                )}
                {act.module && <span className="text-slate-400 dark:text-slate-500 text-[10px] font-bold">• in {act.module}</span>}
                {act.ipAddress && <span className="text-[9px] text-slate-400 dark:text-slate-550 font-bold">• IP: {act.ipAddress}</span>}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
