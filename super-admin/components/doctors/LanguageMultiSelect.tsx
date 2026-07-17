"use client";
import { useState, useRef, useEffect, useCallback } from "react";
import { Globe, Check, ChevronDown, X } from "lucide-react";
import { cn } from "@/lib/utils";

const DEFAULT_LANGUAGES = [
  "Bangla",
  "English",
  "Hindi",
  "Arabic",
  "Urdu",
  "Chinese",
  "Japanese",
  "Korean",
  "French",
  "German",
  "Spanish",
  "Italian",
  "Portuguese",
  "Russian",
  "Turkish",
  "Malay",
  "Thai",
  "Tamil",
  "Telugu",
  "Punjabi",
];

interface LanguageMultiSelectProps {
  value: string[];
  onChange: (languages: string[]) => void;
  error?: string;
  options?: string[];
  label?: string;
  required?: boolean;
}

export function LanguageMultiSelect({
  value = [],
  onChange,
  error,
  options = DEFAULT_LANGUAGES,
  label = "Languages",
  required = true,
}: LanguageMultiSelectProps) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Close on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  const toggle = useCallback(
    (lang: string) => {
      const next = value.includes(lang)
        ? value.filter((l) => l !== lang)
        : [...value, lang];
      onChange(next);
    },
    [value, onChange]
  );

  const remove = useCallback(
    (lang: string) => {
      onChange(value.filter((l) => l !== lang));
    },
    [value, onChange]
  );

  return (
    <div className="space-y-1.5" ref={containerRef}>
      <label className="flex items-center gap-1 text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">
        <Globe className="h-3.5 w-3.5" />
        {label}
        {required && <span className="text-red-500">*</span>}
      </label>

      {/* Tags + Trigger */}
      <div
        role="button"
        tabIndex={0}
        onClick={() => {
          setOpen(!open);
          if (!open) setTimeout(() => inputRef.current?.focus(), 50);
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            setOpen(!open);
          }
        }}
        className={cn(
          "flex flex-wrap items-center gap-1.5 min-h-[42px] w-full rounded-xl border px-3 py-2 text-sm cursor-pointer transition-all",
          "bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100",
          open
            ? "border-[#1E2B7A] ring-2 ring-[#1E2B7A]/20"
            : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
        )}
      >
        {value.length === 0 && (
          <span className="text-gray-400 dark:text-gray-500 text-sm">
            Select languages...
          </span>
        )}
        {value.map((lang) => (
          <span
            key={lang}
            className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-[#1E2B7A]/10 dark:bg-blue-400/10 text-[#1E2B7A] dark:text-blue-400 text-xs font-semibold"
          >
            {lang}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                remove(lang);
              }}
              className="hover:bg-[#1E2B7A]/20 dark:hover:bg-blue-400/20 rounded p-0.5 transition-colors"
            >
              <X className="h-3 w-3" />
            </button>
          </span>
        ))}
        <ChevronDown
          className={cn(
            "ml-auto h-4 w-4 text-gray-400 transition-transform shrink-0",
            open && "rotate-180"
          )}
        />
      </div>

      {/* Dropdown */}
      {open && (
        <div className="relative z-50">
          <div className="absolute top-1 left-0 right-0 max-h-60 overflow-y-auto rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-lg ring-1 ring-black/5">
            <div className="sticky top-0 bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 px-3 py-2">
              <input
                ref={inputRef}
                type="text"
                placeholder="Search languages..."
                className="w-full bg-transparent text-sm text-gray-700 dark:text-gray-300 outline-none placeholder:text-gray-400"
                onKeyDown={(e) => e.stopPropagation()}
              />
            </div>
            <div className="py-1">
              {options.map((lang) => {
                const selected = value.includes(lang);
                return (
                  <button
                    key={lang}
                    type="button"
                    onClick={() => toggle(lang)}
                    className={cn(
                      "flex w-full items-center gap-3 px-3 py-2 text-sm text-left transition-colors",
                      selected
                        ? "bg-[#1E2B7A]/5 dark:bg-blue-400/5 text-[#1E2B7A] dark:text-blue-400"
                        : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                    )}
                  >
                    <span
                      className={cn(
                        "flex h-4 w-4 shrink-0 items-center justify-center rounded border transition-colors",
                        selected
                          ? "border-[#1E2B7A] bg-[#1E2B7A] dark:border-blue-400 dark:bg-blue-400"
                          : "border-gray-300 dark:border-gray-600"
                      )}
                    >
                      {selected && <Check className="h-3 w-3 text-white" />}
                    </span>
                    {lang}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}
