"use client";

import React from "react";
import { cn } from "@/lib/utils";

export type CmsTab = "content" | "visibility" | "seo";

const tabs: { key: CmsTab; label: string; emoji: string }[] = [
  { key: "content",    label: "Content",          emoji: "✏️" },
  { key: "visibility", label: "Visibility & Order", emoji: "👁️" },
  { key: "seo",        label: "SEO Settings",      emoji: "🔍" },
];

interface CmsTabNavProps {
  active: CmsTab;
  onChange: (tab: CmsTab) => void;
}

export function CmsTabNav({ active, onChange }: CmsTabNavProps) {
  return (
    <div className="flex border-b border-gray-200 dark:border-gray-700 gap-1 -mb-px overflow-x-auto">
      {tabs.map((t) => (
        <button
          key={t.key}
          type="button"
          onClick={() => onChange(t.key)}
          className={cn(
            "flex items-center gap-2 px-5 py-3 text-sm font-semibold whitespace-nowrap border-b-2 transition-all duration-200",
            active === t.key
              ? "border-[#1E2B7A] text-[#1E2B7A] dark:border-blue-400 dark:text-blue-400"
              : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 hover:border-gray-300"
          )}
        >
          <span>{t.emoji}</span>
          {t.label}
        </button>
      ))}
    </div>
  );
}

/** Wraps sections inside the white card with proper padding */
export function CmsCard({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
      {children}
    </div>
  );
}

/** Success / Error notification bar */
export function CmsStatusBar({
  message,
}: {
  message: { type: "success" | "error"; text: string } | null;
}) {
  if (!message) return null;
  return (
    <div
      className={cn(
        "flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-medium",
        message.type === "success"
          ? "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800"
          : "bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-800"
      )}
    >
      <span>{message.type === "success" ? "✅" : "❌"}</span>
      {message.text}
    </div>
  );
}

/** Standard page header shared by all CMS detail pages */
export function CmsPageHeader({
  title,
  description,
  onBack,
  onSave,
  isSaving,
}: {
  title: string;
  description: string;
  onBack: () => void;
  onSave: () => void;
  isSaving: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-4 flex-wrap">
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={onBack}
          className="flex h-9 w-9 items-center justify-center rounded-xl border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        >
          ←
        </button>
        <div>
          <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">{title}</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">{description}</p>
        </div>
      </div>
      <button
        type="button"
        onClick={onSave}
        disabled={isSaving}
        className={cn(
          "flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold text-white transition-all duration-200 shadow-md",
          isSaving
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-[#1E2B7A] hover:bg-[#76BC21] hover:-translate-y-0.5 hover:shadow-lg"
        )}
      >
        💾 {isSaving ? "Saving..." : "Save Changes"}
      </button>
    </div>
  );
}
