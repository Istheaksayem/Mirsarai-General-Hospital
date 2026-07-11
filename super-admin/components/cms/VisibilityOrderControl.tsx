"use client";

import React from "react";
import { Eye, EyeOff } from "lucide-react";
import { SectionConfig } from "@/lib/services/api";

interface SectionRow {
  key: string;
  label: string;
  description: string;
}

interface VisibilityOrderControlProps {
  sections: Record<string, SectionConfig>;
  sectionDefs: SectionRow[];
  onChange: (key: string, field: "isVisible" | "order", value: boolean | number) => void;
}

export function VisibilityOrderControl({ sections, sectionDefs, onChange }: VisibilityOrderControlProps) {
  return (
    <div className="space-y-3">
      <p className="text-xs text-gray-500 dark:text-gray-400">
        Toggle sections on/off and set their display order. Lower numbers appear first.
      </p>
      <div className="divide-y divide-gray-100 dark:divide-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
        {sectionDefs.map((def) => {
          const cfg = sections?.[def.key] ?? { isVisible: true, order: 1 };
          return (
            <div
              key={def.key}
              className="flex items-center justify-between px-4 py-3 bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => onChange(def.key, "isVisible", !cfg.isVisible)}
                  className={`flex h-8 w-8 items-center justify-center rounded-lg transition-colors ${
                    cfg.isVisible
                      ? "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400"
                      : "bg-gray-100 dark:bg-gray-800 text-gray-400"
                  }`}
                >
                  {cfg.isVisible ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                </button>
                <div>
                  <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">{def.label}</p>
                  <p className="text-xs text-gray-400">{def.description}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <label className="text-xs text-gray-400">Order</label>
                <input
                  type="number"
                  min={1}
                  max={20}
                  value={cfg.order}
                  onChange={(e) => onChange(def.key, "order", parseInt(e.target.value) || 1)}
                  className="w-16 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-2 py-1.5 text-center text-sm font-medium text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-[#1E2B7A]/20"
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
