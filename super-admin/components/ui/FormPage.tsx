"use client";

import { ArrowLeft, Save } from "lucide-react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

interface FormPageProps {
  title: string;
  description?: string;
  backHref: string;
  onSubmit: () => void;
  isSubmitting?: boolean;
  submitLabel?: string;
  children: React.ReactNode;
}

export function FormPage({
  title,
  description,
  backHref,
  onSubmit,
  isSubmitting,
  submitLabel = "Save",
  children,
}: FormPageProps) {
  const router = useRouter();

  return (
    <div className="space-y-6">
      {/* Page header with back button */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => router.push(backHref)}
          className="flex h-9 w-9 items-center justify-center rounded-xl border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        >
          <ArrowLeft className="h-4 w-4 text-gray-600 dark:text-gray-400" />
        </button>
        <div>
          <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">{title}</h1>
          {description && <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{description}</p>}
        </div>
      </div>

      {/* Form card */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
        <div className="p-6 space-y-5">{children}</div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/20">
          <button
            onClick={() => router.push(backHref)}
            className="px-5 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 text-sm font-semibold text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onSubmit}
            disabled={isSubmitting}
            className={cn(
              "px-6 py-2.5 rounded-xl text-sm font-bold text-white transition-all duration-200 flex items-center gap-2 shadow-md",
              isSubmitting
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-[#1E2B7A] hover:bg-[#76BC21] hover:-translate-y-0.5 hover:shadow-lg"
            )}
          >
            <Save className="h-4 w-4" />
            {isSubmitting ? "Saving..." : submitLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Reusable form field ───────────────────────────────────────────────────────
export function FormField({
  label,
  required,
  error,
  children,
}: {
  label: string;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {children}
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );
}

// ── Reusable input ────────────────────────────────────────────────────────────
export function FormInput({ className, readOnly, ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      readOnly={readOnly}
      className={cn(
        "w-full rounded-xl border px-3.5 py-2.5 text-sm transition-all focus:outline-none focus:ring-2",
        readOnly
          ? "border-gray-100 dark:border-gray-800 bg-gray-100 dark:bg-gray-800/50 text-gray-500 cursor-not-allowed"
          : "border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:border-[#1E2B7A] focus:ring-[#1E2B7A]/20 placeholder:text-gray-400",
        className
      )}
      {...props}
    />
  );
}

// ── Reusable select ───────────────────────────────────────────────────────────
export function FormSelect({
  className,
  children,
  ...props
}: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      className={cn(
        "w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-3.5 py-2.5 text-sm text-gray-900 dark:text-gray-100 focus:border-[#1E2B7A] focus:ring-2 focus:ring-[#1E2B7A]/20 focus:outline-none transition-all appearance-none cursor-pointer",
        className
      )}
      {...props}
    >
      {children}
    </select>
  );
}

// ── Section divider ───────────────────────────────────────────────────────────
export function FormSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <span className="w-1 h-5 rounded-full bg-[#1E2B7A] dark:bg-[#76BC21]" />
        <h3 className="text-sm font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wide">{title}</h3>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">{children}</div>
    </div>
  );
}
