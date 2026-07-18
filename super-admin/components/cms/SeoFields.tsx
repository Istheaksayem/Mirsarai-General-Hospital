"use client";

import React, { useState } from "react";
import { Search } from "lucide-react";
import { FormField, FormInput } from "@/components/ui/FormPage";
import { LanguageTabs } from "@/components/cms/LanguageTabs";

interface BilingualField {
  en: string;
  bn: string;
}

export interface SeoValue {
  metaTitle: BilingualField;
  metaDescription: BilingualField;
  keywords: string[] | BilingualField;
}

interface SeoFieldsSimpleProps {
  value: SeoValue;
  onChange: (value: SeoValue) => void;
  helpText?: string;
}

interface SeoFieldsFullProps {
  seo: SeoValue;
  activeTab: "en" | "bn";
  onTabChange: (tab: "en" | "bn") => void;
  onChange: (field: string, value: BilingualField | string) => void;
  onUpload: (base64: string) => Promise<string>;
}

type SeoFieldsProps = SeoFieldsSimpleProps | SeoFieldsFullProps;

function isSimpleProps(p: SeoFieldsProps): p is SeoFieldsSimpleProps {
  return "value" in p;
}

export function SeoFields(props: SeoFieldsProps) {
  const [simpleTab, setSimpleTab] = useState<"en" | "bn">("en");

  if (isSimpleProps(props)) {
    const { value, onChange, helpText } = props;
    const tab = simpleTab;
    const setTab = setSimpleTab;

    const setMetaTitle = (v: string) =>
      onChange({ ...value, metaTitle: { ...value.metaTitle, [tab]: v } });
    const setMetaDesc = (v: string) =>
      onChange({ ...value, metaDescription: { ...value.metaDescription, [tab]: v } });
    const setKeywords = (v: string) => {
      const current = Array.isArray(value.keywords) ? value.keywords : [];
      onChange({ ...value, keywords: v.split(",").map(k => k.trim()) });
    };

    return (
      <section className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 space-y-5">
        <div className="flex items-center gap-2 pb-3 border-b border-gray-100 dark:border-gray-800">
          <Search className="h-4 w-4 text-gray-400" />
          <div className="flex-1">
            <h2 className="font-bold text-gray-900 dark:text-gray-100 text-sm">SEO Settings</h2>
            <p className="text-xs text-gray-400">{helpText || "Search engine optimization"}</p>
          </div>
          <LanguageTabs activeTab={tab} onTabChange={setTab} />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField label={`Meta Title (${tab.toUpperCase()})`}>
            <FormInput
              value={value.metaTitle?.[tab] ?? ""}
              onChange={e => setMetaTitle(e.target.value)}
              placeholder={tab === "en" ? "Doctor Name - Specialization - Hospital Name" : "ডাক্তারের নাম - বিশেষায়ন - হাসপাতালের নাম"}
            />
          </FormField>
          <FormField label="Keywords (comma-separated)">
            <FormInput
              value={Array.isArray(value.keywords) ? value.keywords.join(", ") : ""}
              onChange={e => setKeywords(e.target.value)}
              placeholder="cardiologist, heart specialist, dhaka"
            />
          </FormField>
        </div>
        <FormField label={`Meta Description (${tab.toUpperCase()})`}>
          <textarea
            value={value.metaDescription?.[tab] ?? ""}
            onChange={e => setMetaDesc(e.target.value)}
            rows={3}
            placeholder={tab === "en" ? "Brief description for search results" : "সার্চ ফলাফলের জন্য সংক্ষিপ্ত বিবরণ"}
            className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-3.5 py-2.5 text-sm text-gray-900 dark:text-gray-100 focus:border-[#1E2B7A] focus:ring-2 focus:ring-[#1E2B7A]/20 focus:outline-none transition-all resize-none placeholder:text-gray-400"
          />
        </FormField>
      </section>
    );
  }

  const { seo, activeTab, onTabChange, onChange, onUpload } = props;

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
            value={(seo.keywords as BilingualField)?.[activeTab] ?? ""}
            onChange={(e) =>
              onChange("keywords", { ...(seo.keywords as BilingualField), [activeTab]: e.target.value })
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
    </div>
  );
}
