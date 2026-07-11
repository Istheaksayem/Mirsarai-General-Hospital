"use client";

import React from "react";
import { Search } from "lucide-react";
import { SeoConfig, LocalizedString } from "@/lib/services/api";
import { FormField, FormInput } from "@/components/ui/FormPage";
import { ImageUploader } from "@/components/cms/ImageUploader";
import { LanguageTabs } from "@/components/cms/LanguageTabs";

interface SeoFieldsProps {
  seo: SeoConfig;
  activeTab: "en" | "bn";
  onTabChange: (tab: "en" | "bn") => void;
  onChange: (field: keyof SeoConfig, value: LocalizedString | string) => void;
  onUpload: (base64: string) => Promise<string>;
}

export function SeoFields({ seo, activeTab, onTabChange, onChange, onUpload }: SeoFieldsProps) {
  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3 pb-2 border-b border-gray-100 dark:border-gray-800">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 dark:bg-blue-900/20 text-[#1E2B7A] dark:text-blue-400">
          <Search className="h-4 w-4" />
        </div>
        <div>
          <h3 className="text-sm font-bold text-gray-800 dark:text-gray-200">SEO Settings</h3>
          <p className="text-xs text-gray-400">Control how this page appears in search engines and social media</p>
        </div>
        <div className="ml-auto">
          <LanguageTabs activeTab={activeTab} onTabChange={onTabChange} />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FormField label="Meta Title" required>
          <FormInput
            value={seo.metaTitle?.[activeTab] ?? ""}
            onChange={(e) =>
              onChange("metaTitle", { ...seo.metaTitle, [activeTab]: e.target.value })
            }
            placeholder={activeTab === "en" ? "Page title for search engines" : "সার্চ ইঞ্জিনের জন্য পেজ শিরোনাম"}
          />
        </FormField>

        <FormField label="Keywords" required>
          <FormInput
            value={seo.keywords?.[activeTab] ?? ""}
            onChange={(e) =>
              onChange("keywords", { ...seo.keywords, [activeTab]: e.target.value })
            }
            placeholder={activeTab === "en" ? "keyword1, keyword2, keyword3" : "কীওয়ার্ড১, কীওয়ার্ড২"}
          />
        </FormField>
      </div>

      <FormField label="Meta Description" required>
        <textarea
          value={seo.metaDescription?.[activeTab] ?? ""}
          onChange={(e) =>
            onChange("metaDescription", { ...seo.metaDescription, [activeTab]: e.target.value })
          }
          rows={3}
          placeholder={activeTab === "en" ? "Brief description for search results (150–160 chars)" : "অনুসন্ধান ফলাফলের জন্য সংক্ষিপ্ত বিবরণ"}
          className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-3.5 py-2.5 text-sm text-gray-900 dark:text-gray-100 focus:border-[#1E2B7A] focus:ring-2 focus:ring-[#1E2B7A]/20 focus:outline-none transition-all resize-none placeholder:text-gray-400"
        />
      </FormField>

      <ImageUploader
        label="Open Graph Image (Social Share)"
        value={seo.ogImage ?? ""}
        onChange={(url) => onChange("ogImage", url)}
        onUpload={onUpload}
        helpText="Recommended: 1200×630px — shown when shared on Facebook, Twitter, etc."
      />
    </div>
  );
}
