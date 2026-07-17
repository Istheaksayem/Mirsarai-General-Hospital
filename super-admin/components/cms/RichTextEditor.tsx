"use client";

import React, { useState } from "react";
import { Eye, Edit2 } from "lucide-react";

interface RichTextEditorProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  helpText?: string;
  rows?: number;
}

/**
 * Minimal rich text editor with markdown textarea + live preview
 * Used for biography and long description fields in CMS
 */
export function RichTextEditor({
  label,
  value,
  onChange,
  placeholder = "Write content here...",
  helpText,
  rows = 8,
}: RichTextEditorProps) {
  const [mode, setMode] = useState<"edit" | "preview">("edit");

  // Simple markdown → HTML converter for preview
  const toHtml = (md: string) =>
    md
      .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
      .replace(/\*(.+?)\*/g, "<em>$1</em>")
      .replace(/^## (.+)$/gm, "<h2 class='text-lg font-bold mb-1 mt-3'>$1</h2>")
      .replace(/^# (.+)$/gm, "<h1 class='text-xl font-bold mb-2 mt-4'>$1</h1>")
      .replace(/^- (.+)$/gm, "<li class='ml-4 list-disc'>$1</li>")
      .replace(/\n/g, "<br />");

  return (
    <div className="space-y-2">
      {/* Header */}
      <div className="flex items-center justify-between">
        <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">
          {label}
        </label>
        <div className="flex items-center rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
          <button
            type="button"
            onClick={() => setMode("edit")}
            className={[
              "flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold transition-colors",
              mode === "edit"
                ? "bg-[#1E2B7A] text-white"
                : "text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800",
            ].join(" ")}
          >
            <Edit2 className="h-3 w-3" /> Edit
          </button>
          <button
            type="button"
            onClick={() => setMode("preview")}
            className={[
              "flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold transition-colors",
              mode === "preview"
                ? "bg-[#1E2B7A] text-white"
                : "text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800",
            ].join(" ")}
          >
            <Eye className="h-3 w-3" /> Preview
          </button>
        </div>
      </div>

      {helpText && (
        <p className="text-xs text-gray-400">{helpText}</p>
      )}

      {/* Markdown cheatsheet */}
      {mode === "edit" && (
        <div className="flex flex-wrap gap-2 text-[10px] text-gray-400">
          <span className="bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded"><code>**bold**</code></span>
          <span className="bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded"><code>*italic*</code></span>
          <span className="bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded"><code>## heading</code></span>
          <span className="bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded"><code>- list item</code></span>
        </div>
      )}

      {/* Editor / Preview */}
      {mode === "edit" ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          rows={rows}
          className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-3.5 py-2.5 text-sm text-gray-900 dark:text-gray-100 placeholder:text-gray-400 focus:border-[#1E2B7A] focus:ring-2 focus:ring-[#1E2B7A]/20 focus:outline-none transition-all resize-y font-mono"
        />
      ) : (
        <div
          className="min-h-[120px] rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-4 py-3 text-sm text-gray-700 dark:text-gray-300 leading-relaxed prose prose-sm dark:prose-invert max-w-none"
          dangerouslySetInnerHTML={{ __html: value ? toHtml(value) : '<span class="text-gray-300 italic">Nothing to preview yet...</span>' }}
        />
      )}
    </div>
  );
}
