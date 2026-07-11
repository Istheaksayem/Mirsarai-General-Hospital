"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Plus, Trash2, Loader2 } from "lucide-react";
import {
  getCareerData,
  updateCareerData,
  uploadCmsImage,
  CareerData,
  CareerBenefit,
  CareerPosition,
  CareerStep,
} from "@/lib/services/api";
import { CmsTabNav, CmsTab, CmsCard, CmsStatusBar, CmsPageHeader } from "@/components/cms/CmsLayout";
import { LanguageTabs } from "@/components/cms/LanguageTabs";
import { ImageUploader } from "@/components/cms/ImageUploader";
import { SeoFields } from "@/components/cms/SeoFields";
import { VisibilityOrderControl } from "@/components/cms/VisibilityOrderControl";
import { LocalizedInput, LocalizedTextarea, SectionDivider } from "@/components/cms/LocalizedFields";
import { FormField, FormInput } from "@/components/ui/FormPage";

const SECTION_DEFS = [
  { key: "hero",               label: "Hero Section",          description: "Top banner with career page title and image" },
  { key: "whyJoinUs",          label: "Why Join Us",           description: "Benefits and perks of working at the hospital" },
  { key: "openPositions",      label: "Open Positions",        description: "Current job listings with details" },
  { key: "applicationProcess", label: "Application Process",   description: "Step-by-step guide to applying" },
  { key: "contact",            label: "Contact Section",       description: "HR contact details for applicants" },
];

const ICON_OPTIONS = ["FaHeart", "FaUsers", "FaGraduationCap", "FaBriefcase", "FaAward", "FaHandshake", "FaStar", "FaShieldAlt", "FaLaptopMedical", "FaBuilding"];

export default function CareerCmsPage() {
  const router = useRouter();
  const [data, setData] = useState<CareerData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [cmsTab, setCmsTab] = useState<CmsTab>("content");
  const [langTab, setLangTab] = useState<"en" | "bn">("en");
  const [seoLangTab, setSeoLangTab] = useState<"en" | "bn">("en");
  const [status, setStatus] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    getCareerData()
      .then(setData)
      .catch((e) => setStatus({ type: "error", text: e.message || "Failed to load data" }))
      .finally(() => setIsLoading(false));
  }, []);

  const handleSave = async () => {
    if (!data) return;
    setIsSaving(true);
    setStatus(null);
    try {
      await updateCareerData(data);
      setStatus({ type: "success", text: "Career content saved successfully!" });
      setTimeout(() => setStatus(null), 4000);
    } catch (e: any) {
      setStatus({ type: "error", text: e.message || "Save failed" });
    } finally {
      setIsSaving(false);
    }
  };

  const set = useCallback((updater: (d: CareerData) => CareerData) => {
    setData((prev) => (prev ? updater(prev) : prev));
  }, []);

  const handleImageUpload = async (base64: string) => uploadCmsImage(base64);

  const nextPositionId = () => (data?.openPositions.reduce((max, p) => (p.id > max ? p.id : max), 0) ?? 0) + 1;

  if (isLoading) {
    return (
      <div className="flex h-[400px] items-center justify-center gap-3">
        <Loader2 className="h-8 w-8 animate-spin text-[#1E2B7A]" />
        <p className="text-sm text-gray-500">Loading Career content…</p>
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
        title="Career CMS"
        description="Manage job listings, benefits, application process, and contact details"
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
                <SectionDivider title="Hero Section" description="Top banner of the Career page with title, subtitle, and background image" />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <LocalizedInput label="Hero Title" value={data.hero.title} activeTab={langTab}
                    onChange={(v) => set((d) => ({ ...d, hero: { ...d.hero, title: v } }))}
                    placeholder={{ en: "Join Our Team", bn: "আমাদের দলে যোগ দিন" }} required />
                  <LocalizedInput label="Hero Subtitle" value={data.hero.subtitle} activeTab={langTab}
                    onChange={(v) => set((d) => ({ ...d, hero: { ...d.hero, subtitle: v } }))}
                    placeholder={{ en: "Build your career…", bn: "আপনার ক্যারিয়ার গড়ুন…" }} />
                </div>
                <LocalizedTextarea label="Hero Description" value={data.hero.description} activeTab={langTab}
                  onChange={(v) => set((d) => ({ ...d, hero: { ...d.hero, description: v } }))}
                  placeholder={{ en: "We are looking for dedicated…", bn: "আমরা নিবেদিতপ্রাণ পেশাদারদের খুঁজছি…" }} rows={3} />
                <ImageUploader label="Hero Background Image" value={data.hero.image}
                  onChange={(url) => set((d) => ({ ...d, hero: { ...d.hero, image: url } }))}
                  onUpload={handleImageUpload}
                  helpText="Background image for the career hero section (recommended: 1200×600px)" />
              </div>

              <hr className="border-gray-100 dark:border-gray-800" />

              {/* Why Join Us */}
              <div className="space-y-4">
                <SectionDivider title="Why Join Us — Benefits" description="Cards highlighting the benefits of working at the hospital" />
                <LocalizedInput label="Section Title" value={data.whyJoinUs.title} activeTab={langTab}
                  onChange={(v) => set((d) => ({ ...d, whyJoinUs: { ...d.whyJoinUs, title: v } }))}
                  placeholder={{ en: "Why Join Our Team?", bn: "কেন আমাদের দলে যোগ দেবেন?" }} />
                <div className="space-y-3">
                  {data.whyJoinUs.benefits.map((benefit, i) => (
                    <div key={i} className="rounded-xl border border-gray-100 dark:border-gray-800 p-4 space-y-3 bg-gray-50/50 dark:bg-gray-800/30">
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-bold text-gray-500 uppercase tracking-wide">Benefit #{i + 1}</span>
                        <button type="button" onClick={() => set((d) => ({ ...d, whyJoinUs: { ...d.whyJoinUs, benefits: d.whyJoinUs.benefits.filter((_, idx) => idx !== i) } }))}
                          className="flex h-7 w-7 items-center justify-center rounded-lg border border-red-200 text-red-500 hover:bg-red-50 transition-colors">
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <FormField label="Icon (React Icon Name)">
                          <select value={benefit.icon}
                            onChange={(e) => {
                              const updated = [...data.whyJoinUs.benefits];
                              updated[i] = { ...benefit, icon: e.target.value };
                              set((d) => ({ ...d, whyJoinUs: { ...d.whyJoinUs, benefits: updated } }));
                            }}
                            className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-3.5 py-2.5 text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-[#1E2B7A]/20">
                            {ICON_OPTIONS.map((icon) => <option key={icon} value={icon}>{icon}</option>)}
                          </select>
                        </FormField>
                        <LocalizedInput label="Title" value={benefit.title} activeTab={langTab}
                          onChange={(v) => {
                            const updated = [...data.whyJoinUs.benefits];
                            updated[i] = { ...benefit, title: v };
                            set((d) => ({ ...d, whyJoinUs: { ...d.whyJoinUs, benefits: updated } }));
                          }}
                          placeholder={{ en: "Health Insurance", bn: "স্বাস্থ্য বীমা" }} />
                        <LocalizedInput label="Description" value={benefit.description} activeTab={langTab}
                          onChange={(v) => {
                            const updated = [...data.whyJoinUs.benefits];
                            updated[i] = { ...benefit, description: v };
                            set((d) => ({ ...d, whyJoinUs: { ...d.whyJoinUs, benefits: updated } }));
                          }}
                          placeholder={{ en: "Full coverage…", bn: "সম্পূর্ণ কভারেজ…" }} />
                      </div>
                    </div>
                  ))}
                  <button type="button"
                    onClick={() => set((d) => ({ ...d, whyJoinUs: { ...d.whyJoinUs, benefits: [...d.whyJoinUs.benefits, { icon: "FaStar", title: { en: "New Benefit", bn: "নতুন সুবিধা" }, description: { en: "Description…", bn: "বিবরণ…" } }] } }))}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl border border-dashed border-gray-300 dark:border-gray-600 text-sm text-gray-500 hover:border-[#1E2B7A] hover:text-[#1E2B7A] transition-colors">
                    <Plus className="h-4 w-4" /> Add Benefit
                  </button>
                </div>
              </div>

              <hr className="border-gray-100 dark:border-gray-800" />

              {/* Open Positions */}
              <div className="space-y-4">
                <SectionDivider title="Open Positions" description="Current job openings displayed on the career page" />
                <div className="space-y-3">
                  {data.openPositions.map((pos, i) => (
                    <div key={i} className="rounded-xl border border-gray-100 dark:border-gray-800 p-4 space-y-3 bg-gray-50/50 dark:bg-gray-800/30">
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-bold text-gray-500 uppercase tracking-wide">Position #{i + 1}</span>
                        <button type="button" onClick={() => set((d) => ({ ...d, openPositions: d.openPositions.filter((_, idx) => idx !== i) }))}
                          className="flex h-7 w-7 items-center justify-center rounded-lg border border-red-200 text-red-500 hover:bg-red-50 transition-colors">
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <LocalizedInput label="Job Title" value={pos.title} activeTab={langTab}
                          onChange={(v) => {
                            const updated = [...data.openPositions];
                            updated[i] = { ...pos, title: v };
                            set((d) => ({ ...d, openPositions: updated }));
                          }}
                          placeholder={{ en: "Cardiologist", bn: "হৃদরোগ বিশেষজ্ঞ" }} required />
                        <LocalizedInput label="Department" value={pos.department} activeTab={langTab}
                          onChange={(v) => {
                            const updated = [...data.openPositions];
                            updated[i] = { ...pos, department: v };
                            set((d) => ({ ...d, openPositions: updated }));
                          }}
                          placeholder={{ en: "Cardiology", bn: "কার্ডিওলজি" }} />
                        <LocalizedInput label="Job Type" value={pos.type} activeTab={langTab}
                          onChange={(v) => {
                            const updated = [...data.openPositions];
                            updated[i] = { ...pos, type: v };
                            set((d) => ({ ...d, openPositions: updated }));
                          }}
                          placeholder={{ en: "Full-time", bn: "পূর্ণকালীন" }} />
                        <LocalizedInput label="Experience Required" value={pos.experience} activeTab={langTab}
                          onChange={(v) => {
                            const updated = [...data.openPositions];
                            updated[i] = { ...pos, experience: v };
                            set((d) => ({ ...d, openPositions: updated }));
                          }}
                          placeholder={{ en: "5+ years", bn: "৫+ বছর" }} />
                      </div>
                      <LocalizedTextarea label="Job Description" value={pos.description} activeTab={langTab}
                        onChange={(v) => {
                          const updated = [...data.openPositions];
                          updated[i] = { ...pos, description: v };
                          set((d) => ({ ...d, openPositions: updated }));
                        }}
                        placeholder={{ en: "Responsibilities include…", bn: "দায়িত্বসমূহের মধ্যে রয়েছে…" }} rows={3} />
                    </div>
                  ))}
                  <button type="button"
                    onClick={() => set((d) => ({ ...d, openPositions: [...d.openPositions, { id: nextPositionId(), title: { en: "New Position", bn: "নতুন পদ" }, department: { en: "Department", bn: "বিভাগ" }, type: { en: "Full-time", bn: "পূর্ণকালীন" }, experience: { en: "2+ years", bn: "২+ বছর" }, description: { en: "Description…", bn: "বিবরণ…" } }] }))}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl border border-dashed border-gray-300 dark:border-gray-600 text-sm text-gray-500 hover:border-[#1E2B7A] hover:text-[#1E2B7A] transition-colors">
                    <Plus className="h-4 w-4" /> Add Position
                  </button>
                </div>
              </div>

              <hr className="border-gray-100 dark:border-gray-800" />

              {/* Application Process */}
              <div className="space-y-4">
                <SectionDivider title="Application Process" description="Step-by-step guide shown to applicants" />
                <LocalizedInput label="Section Title" value={data.applicationProcess.title} activeTab={langTab}
                  onChange={(v) => set((d) => ({ ...d, applicationProcess: { ...d.applicationProcess, title: v } }))}
                  placeholder={{ en: "How to Apply", bn: "কীভাবে আবেদন করবেন" }} />
                <div className="space-y-3">
                  {data.applicationProcess.steps.map((step, i) => (
                    <div key={i} className="rounded-xl border border-gray-100 dark:border-gray-800 p-4 space-y-3 bg-gray-50/50 dark:bg-gray-800/30">
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-bold text-gray-500 uppercase tracking-wide">Step {step.step}</span>
                        <button type="button" onClick={() => set((d) => ({ ...d, applicationProcess: { ...d.applicationProcess, steps: d.applicationProcess.steps.filter((_, idx) => idx !== i) } }))}
                          className="flex h-7 w-7 items-center justify-center rounded-lg border border-red-200 text-red-500 hover:bg-red-50 transition-colors">
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <LocalizedInput label="Step Title" value={step.title} activeTab={langTab}
                          onChange={(v) => {
                            const updated = [...data.applicationProcess.steps];
                            updated[i] = { ...step, title: v };
                            set((d) => ({ ...d, applicationProcess: { ...d.applicationProcess, steps: updated } }));
                          }}
                          placeholder={{ en: "Submit Application", bn: "আবেদন জমা দিন" }} />
                        <LocalizedInput label="Step Description" value={step.description} activeTab={langTab}
                          onChange={(v) => {
                            const updated = [...data.applicationProcess.steps];
                            updated[i] = { ...step, description: v };
                            set((d) => ({ ...d, applicationProcess: { ...d.applicationProcess, steps: updated } }));
                          }}
                          placeholder={{ en: "Fill out the form…", bn: "ফর্মটি পূরণ করুন…" }} />
                      </div>
                    </div>
                  ))}
                  <button type="button"
                    onClick={() => set((d) => ({ ...d, applicationProcess: { ...d.applicationProcess, steps: [...d.applicationProcess.steps, { step: d.applicationProcess.steps.length + 1, title: { en: "New Step", bn: "নতুন ধাপ" }, description: { en: "Description…", bn: "বিবরণ…" } }] } }))}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl border border-dashed border-gray-300 dark:border-gray-600 text-sm text-gray-500 hover:border-[#1E2B7A] hover:text-[#1E2B7A] transition-colors">
                    <Plus className="h-4 w-4" /> Add Step
                  </button>
                </div>
              </div>

              <hr className="border-gray-100 dark:border-gray-800" />

              {/* Contact */}
              <div className="space-y-4">
                <SectionDivider title="Contact Section" description="HR contact details shown to potential applicants" />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <LocalizedInput label="Section Title" value={data.contact.title} activeTab={langTab}
                    onChange={(v) => set((d) => ({ ...d, contact: { ...d.contact, title: v } }))}
                    placeholder={{ en: "Contact HR", bn: "এইচআর-এর সাথে যোগাযোগ করুন" }} />
                  <FormField label="HR Email" required>
                    <FormInput type="email" value={data.contact.email} placeholder="hr@hospital.com"
                      onChange={(e) => set((d) => ({ ...d, contact: { ...d.contact, email: e.target.value } }))} />
                  </FormField>
                  <FormField label="HR Phone" required>
                    <FormInput type="tel" value={data.contact.phone} placeholder="+880-XXX-XXXXXX"
                      onChange={(e) => set((d) => ({ ...d, contact: { ...d.contact, phone: e.target.value } }))} />
                  </FormField>
                </div>
                <LocalizedTextarea label="Contact Description" value={data.contact.description} activeTab={langTab}
                  onChange={(v) => set((d) => ({ ...d, contact: { ...d.contact, description: v } }))}
                  placeholder={{ en: "For career inquiries, please contact…", bn: "ক্যারিয়ার সম্পর্কিত তথ্যের জন্য যোগাযোগ করুন…" }} rows={2} />
              </div>
            </>
          )}

          {cmsTab === "visibility" && (
            <div className="space-y-4">
              <SectionDivider title="Section Visibility & Display Order" description="Show or hide career sections and set their rendering order" />
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
