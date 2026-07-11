"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface LanguageTabsProps {
  activeTab: "en" | "bn";
  onTabChange: (tab: "en" | "bn") => void;
}

export function LanguageTabs({ activeTab, onTabChange }: LanguageTabsProps) {
  return (
    <div className="flex items-center gap-1 rounded-xl bg-gray-100 dark:bg-gray-800 p-1 w-fit">
      {[
        { key: "en" as const, label: "🇬🇧 English" },
        { key: "bn" as const, label: "🇧🇩 বাংলা" },
      ].map((tab) => (
        <button
          key={tab.key}
          type="button"
          onClick={() => onTabChange(tab.key)}
          className={cn(
            "px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200",
            activeTab === tab.key
              ? "bg-white dark:bg-gray-700 text-[#1E2B7A] dark:text-blue-400 shadow-sm"
              : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
          )}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
