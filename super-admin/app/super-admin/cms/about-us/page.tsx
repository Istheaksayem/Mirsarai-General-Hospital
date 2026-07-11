"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Plus, Trash2, Loader2 } from "lucide-react";
import {
  getAboutUs,
  updateAboutUs,
  uploadCmsImage,
  AboutUsData,
  AboutUsStat,
} from "@/lib/services/api";
import { CmsTabNav, CmsTab, CmsCard, CmsStatusBar, CmsPageHeader } from "@/components/cms/CmsLayout";
import { LanguageTabs } from "@/components/cms/LanguageTabs";
import { ImageUploader } from "@/components/cms/ImageUploader";
import { SeoFields } from "@/components/cms/SeoFields";
import { VisibilityOrderControl } from "@/components/cms/VisibilityOrderControl";
import { LocalizedInput, LocalizedTextarea, SectionDivider } from "@/components/cms/LocalizedFields";
import { FormField, FormInput } from "@/components/ui/FormPage";

const SECTION_DEFS = [
  { key: "hero",       label: "Hero Section",       description: "Top banner with title, subtitle, and image" },
  { key: "story",      label: "Our Story",           description: "Hospital background and history narrative" },
  { key: "features",   label: "Features / Services", description: "Key feature bullet points displayed below the story" },
  { key: "statistics", label: "Statistics",          description: "Numeric stats (doctors, patients, beds, etc.)" },
  { key: "cta",        label: "Call-to-Action",      description: "Bottom CTA banner linking to appointments" },
];

export default function AboutUsCmsPage() {
  const router = useRouter();
  const [data, setData] = useState<AboutUsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [cmsTab, setCmsTab] = useState<CmsTab>("content");
  const [langTab, setLangTab] = useState<"en" | "bn">("en");
  const [seoLangTab, setSeoLangTab] = useState<"en" | "bn">("en");
  const [status, setStatus] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    getAboutUs()
      .then(setData)
      .catch((e) => setStatus({ type: "error", text: e.message || "Failed to load data" }))
      .finally(() => setIsLoading(false));
  }, []);

  const handleSave = async () => {
    if (!data) return;
    setIsSaving(true);
    setStatus(null);
    try {
      await updateAboutUs(data);
      setStatus({ type: "success", text: "About Us content saved successfully!" });
      setTimeout(() => setStatus(null), 4000);
    } catch (e: any) {
      setStatus({ type: "error", text: e.message || "Save failed" });
    } finally {
      setIsSaving(false);
    }
  };

  const set = useCallback((updater: (d: AboutUsData) => AboutUsData) => {
    setData((prev) => (prev ? updater(prev) : prev));
  }, []);

  const handleImageUpload = async (base64: string) => uploadCmsImage(base64);

  if (isLoading) {
    return (
      <div className="flex h-[400px] items-center justify-center gap-3">
        <Loader2 className="h-8 w-8 animate-spin text-[#1E2B7A]" />
        <p className="text-sm text-gray-500">Loading About Us content…</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="rounded-2xl border border-red-100 bg-red-50 p-6 text-center text-red-600">
        <p className="font-semibold">Error Loading Content</p>
        <p className="text-sm mt-1">{status?.text || "Please ensure the backend server is running."}</p>
        <button onClick={() => window.location.reload()} className="mt-4 px-4 py-2 bg-red-600 text-white rounded-xl text-sm">Retry</button>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-10">
      <CmsPageHeader
        title="About Us CMS"
        description="Edit the About Us page — hero, story, stats, features, and CTA"
        onBack={() => router.push("/super-admin/cms")}
        onSave={handleSave}
        isSaving={isSaving}
      />

      <CmsStatusBar message={status} />

      <CmsCard>
        <div className="px-6 pt-5">
          <CmsTabNav active={cmsTab} onChange={setCmsTab} />
        </div>

        <div className="p-6 space-y-8">

          {/* ── CONTENT TAB ── */}
          {cmsTab === "content" && (
            <>
              <div className="flex items-center justify-between flex-wrap gap-3">
                <SectionDivider title="Content Language" description="Switch between English and Bangla content fields" />
                <LanguageTabs activeTab={langTab} onTabChange={setLangTab} />
              </div>

              {/* Hero Section */}
              <div className="space-y-4">
                <SectionDivider
                  title="Hero Section"
                  description="Controls the top banner of the About Us page — visible on the page header"
                />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <LocalizedInput
                    label="Page Title"
                    value={data.title}
                    activeTab={langTab}
                    onChange={(v) => set((d) => ({ ...d, title: v }))}
                    placeholder={{ en: "About Us", bn: "আমাদের সম্পর্কে" }}
                    required
                  />
                  <LocalizedInput
                    label="Subtitle"
                    value={data.subtitle}
                    activeTab={langTab}
                    onChange={(v) => set((d) => ({ ...d, subtitle: v }))}
                    placeholder={{ en: "Our mission and values", bn: "আমাদের লক্ষ্য ও মূল্যবোধ" }}
                  />
                </div>
                <LocalizedTextarea
                  label="Main Description"
                  value={data.description}
                  activeTab={langTab}
                  onChange={(v) => set((d) => ({ ...d, description: v }))}
                  placeholder={{ en: "Brief description of the hospital…", bn: "হাসপাতালের সংক্ষিপ্ত বিবরণ…" }}
                  rows={4}
                  required
                />
                <ImageUploader
                  label="Hero / Story Image"
                  value={data.image}
                  onChange={(url) => set((d) => ({ ...d, image: url }))}
                  onUpload={handleImageUpload}
                  helpText="Main image displayed in the About Us section (recommended: 800×600px)"
                />
              </div>

              <hr className="border-gray-100 dark:border-gray-800" />

              {/* Story / Content paragraphs */}
              <div className="space-y-4">
                <SectionDivider
                  title="Our Story Paragraphs"
                  description="Additional paragraphs shown in the hospital story narrative section"
                />
                <div className="space-y-3">
                  {data.content.map((item, i) => (
                    <div key={i} className="flex gap-3 items-start">
                      <div className="flex-1">
                        <LocalizedTextarea
                          label={`Paragraph ${i + 1}`}
                          value={item}
                          activeTab={langTab}
                          onChange={(v) => {
                            const updated = [...data.content];
                            updated[i] = v;
                            set((d) => ({ ...d, content: updated }));
                          }}
                          rows={3}
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => set((d) => ({ ...d, content: d.content.filter((_, idx) => idx !== i) }))}
                        className="mt-7 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-red-200 text-red-500 hover:bg-red-50 transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => set((d) => ({ ...d, content: [...d.content, { en: "New paragraph…", bn: "নতুন অনুচ্ছেদ…" }] }))}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl border border-dashed border-gray-300 dark:border-gray-600 text-sm text-gray-500 hover:border-[#1E2B7A] hover:text-[#1E2B7A] transition-colors"
                  >
                    <Plus className="h-4 w-4" /> Add Paragraph
                  </button>
                </div>
              </div>

              <hr className="border-gray-100 dark:border-gray-800" />

              {/* Features */}
              <div className="space-y-4">
                <SectionDivider
                  title="Feature / Service Points"
                  description="Bullet points shown below the story section highlighting key services"
                />
                <div className="space-y-3">
                  {data.features.map((item, i) => (
                    <div key={i} className="flex gap-3 items-start">
                      <div className="flex-1">
                        <LocalizedInput
                          label={`Feature ${i + 1}`}
                          value={item}
                          activeTab={langTab}
                          onChange={(v) => {
                            const updated = [...data.features];
                            updated[i] = v;
                            set((d) => ({ ...d, features: updated }));
                          }}
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => set((d) => ({ ...d, features: d.features.filter((_, idx) => idx !== i) }))}
                        className="mt-7 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-red-200 text-red-500 hover:bg-red-50 transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => set((d) => ({ ...d, features: [...d.features, { en: "New feature", bn: "নতুন বৈশিষ্ট্য" }] }))}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl border border-dashed border-gray-300 dark:border-gray-600 text-sm text-gray-500 hover:border-[#1E2B7A] hover:text-[#1E2B7A] transition-colors"
                  >
                    <Plus className="h-4 w-4" /> Add Feature
                  </button>
                </div>
              </div>

              <hr className="border-gray-100 dark:border-gray-800" />

              {/* Statistics */}
              <div className="space-y-4">
                <SectionDivider
                  title="Statistics / Numbers"
                  description="Key metrics displayed in the statistics section (e.g., 5000+ Patients, 150+ Doctors)"
                />
                <div className="space-y-3">
                  {data.statistics.map((stat, i) => (
                    <div key={i} className="rounded-xl border border-gray-100 dark:border-gray-800 p-4 space-y-3 bg-gray-50/50 dark:bg-gray-800/30">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-gray-500 uppercase tracking-wide">Stat #{i + 1}</span>
                        <button
                          type="button"
                          onClick={() => set((d) => ({ ...d, statistics: d.statistics.filter((_, idx) => idx !== i) }))}
                          className="flex h-7 w-7 items-center justify-center rounded-lg border border-red-200 text-red-500 hover:bg-red-50 transition-colors"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <FormField label="Value (e.g. 5000+)">
                          <FormInput
                            value={stat.value}
                            onChange={(e) => {
                              const updated = [...data.statistics];
                              updated[i] = { ...stat, value: e.target.value };
                              set((d) => ({ ...d, statistics: updated }));
                            }}
                            placeholder="5000+"
                          />
                        </FormField>
                        <LocalizedInput
                          label="Label"
                          value={stat.title}
                          activeTab={langTab}
                          onChange={(v) => {
                            const updated = [...data.statistics];
                            updated[i] = { ...stat, title: v };
                            set((d) => ({ ...d, statistics: updated }));
                          }}
                          placeholder={{ en: "Patients Served", bn: "সেবাপ্রাপ্ত রোগী" }}
                        />
                      </div>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => set((d) => ({ ...d, statistics: [...d.statistics, { value: "100+", title: { en: "New Stat", bn: "নতুন পরিসংখ্যান" } }] }))}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl border border-dashed border-gray-300 dark:border-gray-600 text-sm text-gray-500 hover:border-[#1E2B7A] hover:text-[#1E2B7A] transition-colors"
                  >
                    <Plus className="h-4 w-4" /> Add Statistic
                  </button>
                </div>
              </div>
            </>
          )}

          {/* ── VISIBILITY & ORDER TAB ── */}
          {cmsTab === "visibility" && (
            <div className="space-y-4">
              <SectionDivider
                title="Section Visibility & Display Order"
                description="Show or hide individual sections and control the order they appear on the frontend"
              />
              <VisibilityOrderControl
                sections={data.sections}
                sectionDefs={SECTION_DEFS}
                onChange={(key, field, value) =>
                  set((d) => ({
                    ...d,
                    sections: {
                      ...d.sections,
                      [key]: { ...d.sections[key], [field]: value },
                    },
                  }))
                }
              />
            </div>
          )}

          {/* ── SEO TAB ── */}
          {cmsTab === "seo" && (
            <SeoFields
              seo={data.seo}
              activeTab={seoLangTab}
              onTabChange={setSeoLangTab}
              onChange={(field, value) =>
                set((d) => ({ ...d, seo: { ...d.seo, [field]: value } }))
              }
              onUpload={handleImageUpload}
            />
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/20">
          <button
            onClick={() => router.push("/super-admin/cms")}
            className="px-5 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 text-sm font-semibold text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className={`px-6 py-2.5 rounded-xl text-sm font-bold text-white transition-all duration-200 flex items-center gap-2 shadow-md ${isSaving ? "bg-gray-400 cursor-not-allowed" : "bg-[#1E2B7A] hover:bg-[#76BC21] hover:-translate-y-0.5 hover:shadow-lg"}`}
          >
            💾 {isSaving ? "Saving…" : "Save Changes"}
          </button>
        </div>
      </CmsCard>
    </div>
  );
}
