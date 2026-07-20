"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Plus, Trash2, Loader2 } from "lucide-react";
import {
  getMissionVision,
  updateMissionVision,
  uploadCmsImage,
  MissionVisionData,
  CoreValue,
} from "@/lib/services/api";
import { CmsTabNav, CmsTab, CmsCard, CmsStatusBar, CmsPageHeader } from "@/components/cms/CmsLayout";
import { LanguageTabs } from "@/components/cms/LanguageTabs";
import { ImageUploader } from "@/components/cms/ImageUploader";
import { SeoFields } from "@/components/cms/SeoFields";
import { VisibilityOrderControl } from "@/components/cms/VisibilityOrderControl";
import { LocalizedInput, LocalizedTextarea, SectionDivider } from "@/components/cms/LocalizedFields";

const SECTION_DEFS = [
  { key: "hero",          label: "Hero Section",          description: "Top banner with page title and image" },
  { key: "missionVision", label: "Mission & Vision",      description: "Side-by-side mission and vision cards" },
  { key: "coreValues",    label: "Core Values",           description: "Grid of hospital core values" },
  { key: "commitment",    label: "Commitment Section",    description: "Content block about commitment to patients" },
  { key: "whyItMatters",  label: "Why It Matters",        description: "Explanatory section on hospital impact" },
  { key: "cta",           label: "Call-to-Action",        description: "Bottom CTA linking to appointments" },
];

export default function MissionVisionCmsPage() {
  const router = useRouter();
  const [data, setData] = useState<MissionVisionData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [cmsTab, setCmsTab] = useState<CmsTab>("content");
  const [langTab, setLangTab] = useState<"en" | "bn">("en");
  const [seoLangTab, setSeoLangTab] = useState<"en" | "bn">("en");
  const [status, setStatus] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    getMissionVision()
      .then(setData)
      .catch((e) => setStatus({ type: "error", text: e.message || "Failed to load data" }))
      .finally(() => setIsLoading(false));
  }, []);

  const handleSave = async () => {
    if (!data) return;
    setIsSaving(true);
    setStatus(null);
    try {
      const result = await updateMissionVision(data); setData(result);
      setStatus({ type: "success", text: "Mission & Vision content saved successfully!" });
      setTimeout(() => setStatus(null), 4000);
    } catch (e: any) {
      setStatus({ type: "error", text: e.message || "Save failed" });
    } finally {
      setIsSaving(false);
    }
  };

  const set = useCallback((updater: (d: MissionVisionData) => MissionVisionData) => {
    setData((prev) => (prev ? updater(prev) : prev));
  }, []);

  const handleImageUpload = async (base64: string) => uploadCmsImage(base64);

  if (isLoading) {
    return (
      <div className="flex h-[400px] items-center justify-center gap-3">
        <Loader2 className="h-8 w-8 animate-spin text-[#1E2B7A]" />
        <p className="text-sm text-gray-500">Loading Mission & Vision content…</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="rounded-2xl border border-red-100 bg-red-50 p-6 text-center text-red-600">
        <p className="font-semibold">Error Loading Content</p>
        <p className="text-sm mt-1">{status?.text}</p>
        <button onClick={() => window.location.reload()} className="mt-4 px-4 py-2 bg-red-600 text-white rounded-xl text-sm">Retry</button>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-10">
      <CmsPageHeader
        title="Mission & Vision CMS"
        description="Edit mission, vision, core values, and commitment sections"
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

          {cmsTab === "content" && (
            <>
              <div className="flex items-center justify-between flex-wrap gap-3">
                <SectionDivider title="Content Language" description="Switch between English and Bangla" />
                <LanguageTabs activeTab={langTab} onTabChange={setLangTab} />
              </div>

              {/* Hero */}
              <div className="space-y-4">
                <SectionDivider title="Hero Section" description="Page header displayed at the top of the Mission & Vision page" />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <LocalizedInput
                    label="Page Title"
                    value={data.title}
                    activeTab={langTab}
                    onChange={(v) => set((d) => ({ ...d, title: v }))}
                    placeholder={{ en: "Mission & Vision", bn: "লক্ষ্য ও দর্শন" }}
                    required
                  />
                </div>
                <ImageUploader
                  label="Hero Image"
                  value={data.image}
                  onChange={(url) => set((d) => ({ ...d, image: url }))}
                  onUpload={handleImageUpload}
                  helpText="Background image for the mission/vision page hero (recommended: 1200×500px)"
                />
              </div>

              <hr className="border-gray-100 dark:border-gray-800" />

              {/* Mission */}
              <div className="space-y-4">
                <SectionDivider title="Mission" description="Hospital mission statement — what we do and who we serve" />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <LocalizedInput
                    label="Mission Title"
                    value={data.mission.title}
                    activeTab={langTab}
                    onChange={(v) => set((d) => ({ ...d, mission: { ...d.mission, title: v } }))}
                    placeholder={{ en: "Our Mission", bn: "আমাদের লক্ষ্য" }}
                  />
                </div>
                <LocalizedTextarea
                  label="Mission Description"
                  value={data.mission.description}
                  activeTab={langTab}
                  onChange={(v) => set((d) => ({ ...d, mission: { ...d.mission, description: v } }))}
                  placeholder={{ en: "Our mission is to provide…", bn: "আমাদের লক্ষ্য হল…" }}
                  rows={4}
                />
              </div>

              <hr className="border-gray-100 dark:border-gray-800" />

              {/* Vision */}
              <div className="space-y-4">
                <SectionDivider title="Vision" description="Hospital vision statement — our long-term aspirations" />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <LocalizedInput
                    label="Vision Title"
                    value={data.vision.title}
                    activeTab={langTab}
                    onChange={(v) => set((d) => ({ ...d, vision: { ...d.vision, title: v } }))}
                    placeholder={{ en: "Our Vision", bn: "আমাদের দর্শন" }}
                  />
                </div>
                <LocalizedTextarea
                  label="Vision Description"
                  value={data.vision.description}
                  activeTab={langTab}
                  onChange={(v) => set((d) => ({ ...d, vision: { ...d.vision, description: v } }))}
                  placeholder={{ en: "We envision a future where…", bn: "আমরা এমন একটি ভবিষ্যত কল্পনা করি যেখানে…" }}
                  rows={4}
                />
              </div>

              <hr className="border-gray-100 dark:border-gray-800" />

              {/* Core Values */}
              <div className="space-y-4">
                <SectionDivider title="Core Values" description="Hospital values displayed as cards in the Core Values section" />
                <div className="space-y-3">
                  {data.coreValues.map((cv, i) => (
                    <div key={i} className="rounded-xl border border-gray-100 dark:border-gray-800 p-4 space-y-3 bg-gray-50/50 dark:bg-gray-800/30">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-gray-500 uppercase tracking-wide">Value #{i + 1}</span>
                        <button
                          type="button"
                          onClick={() => set((d) => ({ ...d, coreValues: d.coreValues.filter((_, idx) => idx !== i) }))}
                          className="flex h-7 w-7 items-center justify-center rounded-lg border border-red-200 text-red-500 hover:bg-red-50 transition-colors"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <LocalizedInput
                          label="Title"
                          value={cv.title}
                          activeTab={langTab}
                          onChange={(v) => {
                            const updated = [...data.coreValues];
                            updated[i] = { ...cv, title: v };
                            set((d) => ({ ...d, coreValues: updated }));
                          }}
                          placeholder={{ en: "Integrity", bn: "সততা" }}
                        />
                        <LocalizedInput
                          label="Description"
                          value={cv.description}
                          activeTab={langTab}
                          onChange={(v) => {
                            const updated = [...data.coreValues];
                            updated[i] = { ...cv, description: v };
                            set((d) => ({ ...d, coreValues: updated }));
                          }}
                          placeholder={{ en: "We uphold…", bn: "আমরা বিশ্বাস করি…" }}
                        />
                      </div>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => set((d) => ({
                      ...d,
                      coreValues: [...d.coreValues, { title: { en: "New Value", bn: "নতুন মূল্যবোধ" }, description: { en: "Description…", bn: "বিবরণ…" } }],
                    }))}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl border border-dashed border-gray-300 dark:border-gray-600 text-sm text-gray-500 hover:border-[#1E2B7A] hover:text-[#1E2B7A] transition-colors"
                  >
                    <Plus className="h-4 w-4" /> Add Core Value
                  </button>
                </div>
              </div>

              <hr className="border-gray-100 dark:border-gray-800" />

              {/* Commitment */}
              <div className="space-y-4">
                <SectionDivider title="Commitment Section" description="Heading and description for the 'Our Commitment to You' section" />
                <LocalizedInput
                  label="Heading"
                  value={data.commitmentHeading}
                  activeTab={langTab}
                  onChange={(v) => set((d) => ({ ...d, commitmentHeading: v }))}
                  placeholder={{ en: "Our Commitment to You", bn: "আপনার প্রতি আমাদের অঙ্গীকার" }}
                />
                <LocalizedTextarea
                  label="Description"
                  value={data.commitmentDescription}
                  activeTab={langTab}
                  onChange={(v) => set((d) => ({ ...d, commitmentDescription: v }))}
                  placeholder={{ en: "Every patient who walks through our doors…", bn: "আমাদের দ্বারে আসা প্রতিটি রোগী…" }}
                  rows={4}
                />
              </div>

              <hr className="border-gray-100 dark:border-gray-800" />

              {/* Why It Matters */}
              <div className="space-y-4">
                <SectionDivider title="Why It Matters Section" description="Heading, description, and cards for the 'Why This Matters' section" />
                <LocalizedInput
                  label="Heading"
                  value={data.whyItMattersHeading}
                  activeTab={langTab}
                  onChange={(v) => set((d) => ({ ...d, whyItMattersHeading: v }))}
                  placeholder={{ en: "Why This Matters", bn: "এটি কেন গুরুত্বপূর্ণ" }}
                />
                <LocalizedTextarea
                  label="Description"
                  value={data.whyItMattersDescription}
                  activeTab={langTab}
                  onChange={(v) => set((d) => ({ ...d, whyItMattersDescription: v }))}
                  placeholder={{ en: "Our mission and vision aren't just words…", bn: "আমাদের লক্ষ্য এবং দর্শন কেবল শব্দ নয়…" }}
                  rows={3}
                />
                <div className="space-y-3 pt-2">
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-wide">Why It Matters Cards</p>
                  {data.whyItMattersItems.map((item, i) => (
                    <div key={i} className="rounded-xl border border-gray-100 dark:border-gray-800 p-4 space-y-3 bg-gray-50/50 dark:bg-gray-800/30">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-gray-500 uppercase tracking-wide">Card #{i + 1}</span>
                        <button
                          type="button"
                          onClick={() => set((d) => ({ ...d, whyItMattersItems: d.whyItMattersItems.filter((_, idx) => idx !== i) }))}
                          className="flex h-7 w-7 items-center justify-center rounded-lg border border-red-200 text-red-500 hover:bg-red-50 transition-colors"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                      <LocalizedInput
                        label="Title"
                        value={item.title}
                        activeTab={langTab}
                        onChange={(v) => {
                          const updated = [...data.whyItMattersItems];
                          updated[i] = { ...item, title: v };
                          set((d) => ({ ...d, whyItMattersItems: updated }));
                        }}
                      />
                      <LocalizedTextarea
                        label="Description"
                        value={item.description}
                        activeTab={langTab}
                        onChange={(v) => {
                          const updated = [...data.whyItMattersItems];
                          updated[i] = { ...item, description: v };
                          set((d) => ({ ...d, whyItMattersItems: updated }));
                        }}
                      />
                      <div>
                        <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide mb-1">Color Gradient Class</label>
                        <input
                          type="text"
                          value={item.color}
                          disabled
                          placeholder="from-red-500 to-pink-600"
                          className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-4 py-2.5 text-sm text-gray-800 dark:text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1E2B7A]/20 focus:border-[#1E2B7A] transition-all cursor-not-allowed opacity-60"
                        />
                      </div>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => set((d) => ({ ...d, whyItMattersItems: [...d.whyItMattersItems, { title: { en: "New Card", bn: "নতুন কার্ড" }, description: { en: "Description…", bn: "বিবরণ…" }, color: "from-red-500 to-pink-600" }] }))}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl border border-dashed border-gray-300 dark:border-gray-600 text-sm text-gray-500 hover:border-[#1E2B7A] hover:text-[#1E2B7A] transition-colors"
                  >
                    <Plus className="h-4 w-4" /> Add Card
                  </button>
                </div>
              </div>

              <hr className="border-gray-100 dark:border-gray-800" />

              {/* CTA */}
              <div className="space-y-4">
                <SectionDivider title="CTA Section" description="Heading, description, and button text for the 'Experience Our Care Today' section" />
                <LocalizedInput
                  label="Heading"
                  value={data.ctaHeading}
                  activeTab={langTab}
                  onChange={(v) => set((d) => ({ ...d, ctaHeading: v }))}
                  placeholder={{ en: "Experience Our Care Today", bn: "আজই আমাদের সেবার অভিজ্ঞতা নিন" }}
                />
                <LocalizedTextarea
                  label="Description"
                  value={data.ctaDescription}
                  activeTab={langTab}
                  onChange={(v) => set((d) => ({ ...d, ctaDescription: v }))}
                  placeholder={{ en: "Our mission is your health…", bn: "আমাদের লক্ষ্য আপনার স্বাস্থ্য…" }}
                  rows={3}
                />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <LocalizedInput
                    label="Primary Button Text"
                    value={data.ctaPrimaryButtonText}
                    activeTab={langTab}
                    onChange={(v) => set((d) => ({ ...d, ctaPrimaryButtonText: v }))}
                    placeholder={{ en: "Book an Appointment", bn: "অ্যাপয়েন্টমেন্ট বুক করুন" }}
                  />
                  <LocalizedInput
                    label="Secondary Button Text"
                    value={data.ctaSecondaryButtonText}
                    activeTab={langTab}
                    onChange={(v) => set((d) => ({ ...d, ctaSecondaryButtonText: v }))}
                    placeholder={{ en: "← Back to About Us", bn: "← আমাদের সম্পর্কে ফিরে যান" }}
                  />
                </div>
              </div>
            </>
          )}

          {cmsTab === "visibility" && (
            <div className="space-y-4">
              <SectionDivider title="Section Visibility & Display Order" description="Show or hide sections and set their rendering order" />
              <VisibilityOrderControl
                sections={data.sections}
                sectionDefs={SECTION_DEFS}
                onChange={(key, field, value) =>
                  set((d) => ({ ...d, sections: { ...d.sections, [key]: { ...d.sections[key], [field]: value } } }))
                }
              />
            </div>
          )}

          {cmsTab === "seo" && (
            <SeoFields
              seo={data.seo}
              activeTab={seoLangTab}
              onTabChange={setSeoLangTab}
              onChange={(field, value) => set((d) => ({ ...d, seo: { ...d.seo, [field]: value } }))}
              onUpload={handleImageUpload}
            />
          )}
        </div>

        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/20">
          <button onClick={() => router.push("/super-admin/cms")} className="px-5 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 text-sm font-semibold text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">Cancel</button>
          <button onClick={handleSave} disabled={isSaving} className={`px-6 py-2.5 rounded-xl text-sm font-bold text-white flex items-center gap-2 shadow-md transition-all duration-200 ${isSaving ? "bg-gray-400 cursor-not-allowed" : "bg-[#1E2B7A] hover:bg-[#76BC21] hover:-translate-y-0.5 hover:shadow-lg"}`}>
            💾 {isSaving ? "Saving…" : "Save Changes"}
          </button>
        </div>
      </CmsCard>
    </div>
  );
}
