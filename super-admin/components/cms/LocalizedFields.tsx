"use client";

import React from "react";
import { LocalizedString } from "@/lib/services/api";
import { FormField, FormInput } from "@/components/ui/FormPage";

interface LocalizedInputProps {
  label: string;
  value: LocalizedString;
  activeTab: "en" | "bn";
  onChange: (val: LocalizedString) => void;
  placeholder?: { en: string; bn: string };
  required?: boolean;
}

export function LocalizedInput({
  label,
  value,
  activeTab,
  onChange,
  placeholder,
  required,
}: LocalizedInputProps) {
  return (
    <FormField label={`${label} (${activeTab === "en" ? "English" : "বাংলা"})`} required={required}>
      <FormInput
        value={value?.[activeTab] ?? ""}
        onChange={(e) => onChange({ ...value, [activeTab]: e.target.value })}
        placeholder={placeholder?.[activeTab] ?? ""}
      />
    </FormField>
  );
}

interface LocalizedTextareaProps {
  label: string;
  value: LocalizedString;
  activeTab: "en" | "bn";
  onChange: (val: LocalizedString) => void;
  placeholder?: { en: string; bn: string };
  rows?: number;
  required?: boolean;
}

export function LocalizedTextarea({
  label,
  value,
  activeTab,
  onChange,
  placeholder,
  rows = 4,
  required,
}: LocalizedTextareaProps) {
  return (
    <FormField label={`${label} (${activeTab === "en" ? "English" : "বাংলা"})`} required={required}>
      <textarea
        value={value?.[activeTab] ?? ""}
        onChange={(e) => onChange({ ...value, [activeTab]: e.target.value })}
        rows={rows}
        placeholder={placeholder?.[activeTab] ?? ""}
        className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-3.5 py-2.5 text-sm text-gray-900 dark:text-gray-100 focus:border-[#1E2B7A] focus:ring-2 focus:ring-[#1E2B7A]/20 focus:outline-none transition-all resize-none placeholder:text-gray-400"
      />
    </FormField>
  );
}

/** A section divider with a coloured accent bar */
export function SectionDivider({ title, description }: { title: string; description?: string }) {
  return (
    <div className="flex items-start gap-3 py-2">
      <span className="mt-1 w-1 h-5 rounded-full bg-[#1E2B7A] dark:bg-[#76BC21] shrink-0" />
      <div>
        <h3 className="text-sm font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wide">
          {title}
        </h3>
        {description && (
          <p className="text-xs text-gray-400 mt-0.5">{description}</p>
        )}
      </div>
    </div>
  );
}
