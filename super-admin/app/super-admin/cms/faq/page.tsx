"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Plus, Trash2, Loader2 } from "lucide-react";
import {
  getFAQData,
  updateFAQData,
  uploadCmsImage,
  FAQData,
  BilingualField,
} from "@/lib/services/api";
import { CmsTabNav, CmsTab, CmsCard, CmsStatusBar, CmsPageHeader } from "@/components/cms/CmsLayout";
import { LanguageTabs } from "@/components/cms/LanguageTabs";
import { ImageUploader } from "@/components/cms/ImageUploader";
import { SeoFields } from "@/components/cms/SeoFields";
import { VisibilityOrderControl } from "@/components/cms/VisibilityOrderControl";
import { LocalizedInput, LocalizedTextarea, SectionDivider } from "@/components/cms/LocalizedFields";
import { FormField, FormInput } from "@/components/ui/FormPage";

const SECTION_DEFS = [
  { key: "hero",    label: "Hero Section",  description: "Top banner with title, subtitle, and image" },
  { key: "faqs",    label: "FAQ Section",   description: "FAQ categories and questions/answers" },
  { key: "contact", label: "Contact Section", description: "Contact information at the bottom" },
];

export default function FAQCmsPage() {
  const router = useRouter();
  const [data, setData] = useState<FAQData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [cmsTab, setCmsTab] = useState<CmsTab>("content");
  const [langTab, setLangTab] = useState<"en" | "bn">("en");
  const [seoLangTab, setSeoLangTab] = useState<"en" | "bn">("en");
  const [status, setStatus] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    getFAQData()
      .then(setData)
      .catch((e) => setStatus({ type: "error", text: e.message || "Failed to load data" }))
      .finally(() => setIsLoading(false));
  }, []);

  const handleSave = async () => {
    if (!data) return;
    setIsSaving(true);
    setStatus(null);
    try {
      await updateFAQData(data);
      setStatus({ type: "success", text: "FAQ content saved successfully!" });
      setTimeout(() => setStatus(null), 4000);
    } catch (e: any) {
      setStatus({ type: "error", text: e.message || "Save failed" });
    } finally {
      setIsSaving(false);
    }
  };

  const set = useCallback((updater: (d: FAQData) => FAQData) => {
    setData((prev) => (prev ? updater(prev) : prev));
  }, []);

  const handleImageUpload = async (base64: string) => uploadCmsImage(base64);

  if (isLoading) {
    return (
      <div className="flex h-[400px] items-center justify-center gap-3">
        <Loader2 className="h-8 w-8 animate-spin text-[#1E2B7A]" />
        <p className="text-sm text-gray-500">Loading FAQ content…</p>
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
        title="FAQ CMS"
        description="Edit the FAQ page — hero, categories, questions/answers, and contact info"
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
                  description="Top banner of the FAQ page"
                />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <LocalizedInput
                    label="Page Title"
                    value={data.hero.title}
                    activeTab={langTab}
                    onChange={(v) => set((d) => ({ ...d, hero: { ...d.hero, title: v } }))}
                    placeholder={{ en: "Frequently Asked Questions", bn: "প্রায়শই জিজ্ঞাসিত প্রশ্ন" }}
                    required
                  />
                  <LocalizedInput
                    label="Subtitle"
                    value={data.hero.subtitle}
                    activeTab={langTab}
                    onChange={(v) => set((d) => ({ ...d, hero: { ...d.hero, subtitle: v } }))}
                    placeholder={{ en: "Find Answers to Common Questions", bn: "সাধারণ প্রশ্নের উত্তর খুঁজুন" }}
                  />
                </div>
                <LocalizedTextarea
                  label="Main Description"
                  value={data.hero.description}
                  activeTab={langTab}
                  onChange={(v) => set((d) => ({ ...d, hero: { ...d.hero, description: v } }))}
                  rows={4}
                  required
                />
                <ImageUploader
                  label="Hero Image"
                  value={data.hero.image}
                  onChange={(url) => set((d) => ({ ...d, hero: { ...d.hero, image: url } }))}
                  onUpload={handleImageUpload}
                  helpText="Main banner image (recommended: 1920×600px)"
                />
              </div>

              <hr className="border-gray-100 dark:border-gray-800" />

              {/* FAQ Categories */}
              <div className="space-y-4">
                <SectionDivider
                  title="FAQ Categories"
                  description="Filter categories shown above the FAQ list"
                />
                <div className="space-y-3">
                  {data.categories.map((cat, i) => (
                    <div key={i} className="flex gap-3 items-start">
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 flex-1">
                        <FormField label={`Category ID #${i + 1}`}>
                          <FormInput
                            value={cat.id}
                            onChange={(e) => {
                              const updated = [...data.categories];
                              updated[i] = { ...cat, id: e.target.value };
                              set((d) => ({ ...d, categories: updated }));
                            }}
                            placeholder="general"
                          />
                        </FormField>
                        <FormField label="Icon Name">
                          <FormInput
                            value={cat.icon}
                            onChange={(e) => {
                              const updated = [...data.categories];
                              updated[i] = { ...cat, icon: e.target.value };
                              set((d) => ({ ...d, categories: updated }));
                            }}
                            placeholder="FaQuestionCircle"
                          />
                        </FormField>
                        <LocalizedInput
                          label="Category Name"
                          value={cat.name}
                          activeTab={langTab}
                          onChange={(v) => {
                            const updated = [...data.categories];
                            updated[i] = { ...cat, name: v };
                            set((d) => ({ ...d, categories: updated }));
                          }}
                          placeholder={{ en: "General", bn: "সাধারণ" }}
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => set((d) => ({ ...d, categories: d.categories.filter((_, idx) => idx !== i) }))}
                        className="mt-7 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-red-200 text-red-500 hover:bg-red-50 transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => set((d) => ({
                      ...d,
                      categories: [...d.categories, { id: "new-category", name: { en: "New Category", bn: "নতুন ক্যাটাগরি" }, icon: "FaQuestionCircle" }],
                    }))}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl border border-dashed border-gray-300 dark:border-gray-600 text-sm text-gray-500 hover:border-[#1E2B7A] hover:text-[#1E2B7A] transition-colors"
                  >
                    <Plus className="h-4 w-4" /> Add Category
                  </button>
                </div>
              </div>

              <hr className="border-gray-100 dark:border-gray-800" />

              {/* FAQ Items */}
              <div className="space-y-4">
                <SectionDivider
                  title="FAQ Items"
                  description="Questions and answers displayed in the accordion"
                />
                <div className="space-y-4">
                  {data.faqs.map((faq, i) => (
                    <div key={faq.id} className="rounded-xl border border-gray-200 dark:border-gray-700 p-4 space-y-3 bg-gray-50/50 dark:bg-gray-800/30">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-gray-500 uppercase tracking-wide">FAQ #{faq.id}</span>
                        <button
                          type="button"
                          onClick={() => set((d) => ({ ...d, faqs: d.faqs.filter((_, idx) => idx !== i) }))}
                          className="flex h-7 w-7 items-center justify-center rounded-lg border border-red-200 text-red-500 hover:bg-red-50 transition-colors"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <FormField label="FAQ ID">
                          <FormInput
                            value={String(faq.id)}
                            onChange={(e) => {
                              const updated = [...data.faqs];
                              updated[i] = { ...faq, id: parseInt(e.target.value) || 0 };
                              set((d) => ({ ...d, faqs: updated }));
                            }}
                          />
                        </FormField>
                        <FormField label="Category">
                          <FormInput
                            value={faq.category}
                            onChange={(e) => {
                              const updated = [...data.faqs];
                              updated[i] = { ...faq, category: e.target.value };
                              set((d) => ({ ...d, faqs: updated }));
                            }}
                            placeholder="general"
                          />
                        </FormField>
                      </div>
                      <LocalizedInput
                        label="Question"
                        value={faq.question}
                        activeTab={langTab}
                        onChange={(v) => {
                          const updated = [...data.faqs];
                          updated[i] = { ...faq, question: v };
                          set((d) => ({ ...d, faqs: updated }));
                        }}
                        placeholder={{ en: "What are your visiting hours?", bn: "আপনার হাসপাতালের দেখা করার সময় কি?" }}
                      />
                      <LocalizedTextarea
                        label="Answer"
                        value={faq.answer}
                        activeTab={langTab}
                        onChange={(v) => {
                          const updated = [...data.faqs];
                          updated[i] = { ...faq, answer: v };
                          set((d) => ({ ...d, faqs: updated }));
                        }}
                        rows={4}
                      />
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => {
                      const maxId = data.faqs.reduce((max, f) => (f.id > max ? f.id : max), 0);
                      set((d) => ({
                        ...d,
                        faqs: [...d.faqs, {
                          id: maxId + 1,
                          category: "general",
                          question: { en: "New Question?", bn: "নতুন প্রশ্ন?" },
                          answer: { en: "Answer…", bn: "উত্তর…" },
                        }],
                      }));
                    }}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl border border-dashed border-gray-300 dark:border-gray-600 text-sm text-gray-500 hover:border-[#1E2B7A] hover:text-[#1E2B7A] transition-colors"
                  >
                    <Plus className="h-4 w-4" /> Add FAQ
                  </button>
                </div>
              </div>

              <hr className="border-gray-100 dark:border-gray-800" />

              {/* Contact Info */}
              <div className="space-y-4">
                <SectionDivider
                  title="Contact Information"
                  description="Contact details shown at the bottom of the FAQ page"
                />
                <LocalizedInput
                  label="Section Title"
                  value={data.contactInfo.title}
                  activeTab={langTab}
                  onChange={(v) => set((d) => ({ ...d, contactInfo: { ...d.contactInfo, title: v } }))}
                  placeholder={{ en: "Still Have Questions?", bn: "এখনও প্রশ্ন আছে?" }}
                />
                <LocalizedTextarea
                  label="Section Description"
                  value={data.contactInfo.description}
                  activeTab={langTab}
                  onChange={(v) => set((d) => ({ ...d, contactInfo: { ...d.contactInfo, description: v } }))}
                  rows={2}
                />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormField label="Phone Number">
                    <FormInput
                      value={data.contactInfo.phone}
                      onChange={(e) => set((d) => ({ ...d, contactInfo: { ...d.contactInfo, phone: e.target.value } }))}
                      placeholder="+880 1234-567890"
                    />
                  </FormField>
                  <FormField label="Email Address">
                    <FormInput
                      value={data.contactInfo.email}
                      onChange={(e) => set((d) => ({ ...d, contactInfo: { ...d.contactInfo, email: e.target.value } }))}
                      placeholder="info@mirsaraihospital.com"
                    />
                  </FormField>
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
