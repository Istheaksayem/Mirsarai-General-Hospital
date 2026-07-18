"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Plus, Trash2, Loader2 } from "lucide-react";
import {
  getCareerData,
  updateCareerData,
  uploadCmsImage,
  CareerData,
  CareerPosition,
} from "@/lib/services/api";
import { CmsTabNav, CmsTab, CmsCard, CmsStatusBar, CmsPageHeader } from "@/components/cms/CmsLayout";
import { LanguageTabs } from "@/components/cms/LanguageTabs";
import { ImageUploader } from "@/components/cms/ImageUploader";
import { SeoFields } from "@/components/cms/SeoFields";
import { VisibilityOrderControl } from "@/components/cms/VisibilityOrderControl";
import { LocalizedInput, LocalizedTextarea, SectionDivider } from "@/components/cms/LocalizedFields";
import { FormField, FormInput } from "@/components/ui/FormPage";

const SECTION_DEFS = [
  { key: "hero",        label: "Hero Section", description: "Top banner with page title, description and background image" },
  { key: "jobListings", label: "Job Listings", description: "List of open positions shown on the careers page" },
];

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
      .then((raw) => {
        // Safe mapping / normalization to handle the transition between old and new schema
        const normalized: CareerData = {
          ...raw,
          title: raw.title || (raw as any).hero?.title || { en: "Join Our Team", bn: "আমাদের দলে যোগ দিন" },
          description: raw.description || (raw as any).hero?.description || { en: "Build your career in healthcare excellence...", bn: "স্বাস্থ্যসেবায় আপনার ক্যারিয়ার গড়ে তুলুন..." },
          image: raw.image || (raw as any).hero?.image || "/about-us.jpg",
          jobListings: (raw.jobListings || (raw as any).openPositions || []).map((job: any) => ({
            id: job.id,
            title: job.title || job.jobTitle || { en: "Position", bn: "পদ" },
            department: job.department || { en: "Department", bn: "বিভাগ" },
            location: job.location || { en: "Mirsarai, Chittagong", bn: "মীরসরাই, চট্টগ্রাম" },
            jobType: job.jobType || job.type || job.employmentType || { en: "Full-time", bn: "পূর্ণকালীন" },
            description: job.description || job.jobDescription || { en: "", bn: "" },
            requirements: job.requirements || { en: "", bn: "" },
            applyLink: job.applyLink || job.applyButtonUrl || "mailto:careers@mirsaraihospital.com",
            bannerImage: job.bannerImage || job.image || "/about-us.jpg",
            isActive: job.isActive !== undefined ? job.isActive : (job.status === "Open" || true)
          })),
          sections: raw.sections || {
            hero: { isVisible: true, order: 1 },
            jobListings: { isVisible: true, order: 2 }
          }
        };
        setData(normalized);
      })
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

  const nextPositionId = () => (data?.jobListings.reduce((max, p) => (p.id > max ? p.id : max), 0) ?? 0) + 1;

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
        description="Manage page banner, overview description, and active job listings"
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

              {/* Hero / Page Overview */}
              <div className="space-y-4">
                <SectionDivider title="Hero Section" description="Header banner settings for the careers page" />
                <div className="grid grid-cols-1 gap-4">
                  <LocalizedInput 
                    label="Page Title" 
                    value={data.title} 
                    activeTab={langTab}
                    onChange={(v) => set((d) => ({ ...d, title: v }))}
                    placeholder={{ en: "Join Our Team", bn: "আমাদের দলে যোগ দিন" }} 
                    required 
                  />
                  <LocalizedTextarea 
                    label="Page Description / Subtitle" 
                    value={data.description} 
                    activeTab={langTab}
                    onChange={(v) => set((d) => ({ ...d, description: v }))}
                    placeholder={{ en: "Build your career in healthcare excellence...", bn: "স্বাস্থ্যসেবায় আপনার ক্যারিয়ার গড়ে তুলুন..." }} 
                    rows={3} 
                    required
                  />
                </div>
                <ImageUploader 
                  label="Hero Banner Background Image" 
                  value={data.image}
                  onChange={(url) => set((d) => ({ ...d, image: url }))}
                  onUpload={handleImageUpload}
                  helpText="Background image shown behind the page title (recommended: 1200×600px)" 
                />
              </div>

              <hr className="border-gray-100 dark:border-gray-800" />

              {/* Job Listings */}
              <div className="space-y-4">
                <SectionDivider title="Job Listings" description="Create and modify available employment positions" />
                <div className="space-y-6">
                  {data.jobListings.map((pos, i) => (
                    <div key={pos.id} className="rounded-xl border border-gray-200 dark:border-gray-800 p-5 space-y-4 bg-gray-50/50 dark:bg-gray-800/30">
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-bold text-gray-500 uppercase tracking-wide">Position #{i + 1}</span>
                        <button 
                          type="button" 
                          onClick={() => set((d) => ({ ...d, jobListings: d.jobListings.filter((_, idx) => idx !== i) }))}
                          className="flex h-7 w-7 items-center justify-center rounded-lg border border-red-200 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <LocalizedInput 
                          label="Job Title" 
                          value={pos.title} 
                          activeTab={langTab}
                          onChange={(v) => {
                            const updated = [...data.jobListings];
                            updated[i] = { ...pos, title: v };
                            set((d) => ({ ...d, jobListings: updated }));
                          }}
                          placeholder={{ en: "Senior Staff Nurse", bn: "সিনিয়র স্টাফ নার্স" }} 
                          required 
                        />
                        <LocalizedInput 
                          label="Department" 
                          value={pos.department} 
                          activeTab={langTab}
                          onChange={(v) => {
                            const updated = [...data.jobListings];
                            updated[i] = { ...pos, department: v };
                            set((d) => ({ ...d, jobListings: updated }));
                          }}
                          placeholder={{ en: "Pediatrics / Cardiology", bn: "শিশুরোগ / হৃদরোগ বিভাগ" }} 
                          required
                        />
                        <LocalizedInput 
                          label="Location" 
                          value={pos.location} 
                          activeTab={langTab}
                          onChange={(v) => {
                            const updated = [...data.jobListings];
                            updated[i] = { ...pos, location: v };
                            set((d) => ({ ...d, jobListings: updated }));
                          }}
                          placeholder={{ en: "Mirsarai, Chittagong", bn: "মীরসরাই, চট্টগ্রাম" }} 
                          required
                        />
                        <LocalizedInput 
                          label="Job Type" 
                          value={pos.jobType} 
                          activeTab={langTab}
                          onChange={(v) => {
                            const updated = [...data.jobListings];
                            updated[i] = { ...pos, jobType: v };
                            set((d) => ({ ...d, jobListings: updated }));
                          }}
                          placeholder={{ en: "Full-time / Part-time", bn: "পূর্ণকালীন / খণ্ডকালীন" }} 
                          required
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <FormField label="Apply Link / Email" required>
                          <FormInput 
                            type="text" 
                            value={pos.applyLink} 
                            placeholder="mailto:hr@hospital.com or url link"
                            onChange={(e) => {
                              const updated = [...data.jobListings];
                              updated[i] = { ...pos, applyLink: e.target.value };
                              set((d) => ({ ...d, jobListings: updated }));
                            }} 
                          />
                        </FormField>

                        <FormField label="Status" required>
                          <select 
                            value={pos.isActive ? "active" : "inactive"}
                            onChange={(e) => {
                              const updated = [...data.jobListings];
                              updated[i] = { ...pos, isActive: e.target.value === "active" };
                              set((d) => ({ ...d, jobListings: updated }));
                            }}
                            className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-3.5 py-2.5 text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-[#1E2B7A]/20"
                          >
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                          </select>
                        </FormField>
                      </div>

                      <ImageUploader 
                        label="Job Listing Banner Image" 
                        value={pos.bannerImage}
                        onChange={(url) => {
                          const updated = [...data.jobListings];
                          updated[i] = { ...pos, bannerImage: url };
                          set((d) => ({ ...d, jobListings: updated }));
                        }}
                        onUpload={handleImageUpload}
                        helpText="A thumbnail/banner image representing this role" 
                      />

                      <LocalizedTextarea 
                        label="Job Description" 
                        value={pos.description} 
                        activeTab={langTab}
                        onChange={(v) => {
                          const updated = [...data.jobListings];
                          updated[i] = { ...pos, description: v };
                          set((d) => ({ ...d, jobListings: updated }));
                        }}
                        placeholder={{ en: "Briefly explain the role...", bn: "কাজের বিবরণ সংক্ষেপে লিখুন..." }} 
                        rows={3} 
                        required
                      />

                      <LocalizedTextarea 
                        label="Job Requirements" 
                        value={pos.requirements} 
                        activeTab={langTab}
                        onChange={(v) => {
                          const updated = [...data.jobListings];
                          updated[i] = { ...pos, requirements: v };
                          set((d) => ({ ...d, jobListings: updated }));
                        }}
                        placeholder={{ en: "List experience, skills, and qualifications...", bn: "অভিজ্ঞতা, দক্ষতা এবং শিক্ষাগত যোগ্যতা উল্লেখ করুন..." }} 
                        rows={3} 
                        required
                      />
                    </div>
                  ))}

                  <button 
                    type="button"
                    onClick={() => set((d) => ({ 
                      ...d, 
                      jobListings: [
                        ...d.jobListings, 
                        { 
                          id: nextPositionId(), 
                          title: { en: "New Position", bn: "নতুন পদ" }, 
                          department: { en: "Department", bn: "বিভাগ" }, 
                          location: { en: "Mirsarai, Chittagong", bn: "মীরসরাই, চট্টগ্রাম" }, 
                          jobType: { en: "Full-time", bn: "পূর্ণকালীন" }, 
                          description: { en: "Role description...", bn: "কাজের বিবরণ..." },
                          requirements: { en: "Qualifications...", bn: "প্রয়োজনীয় যোগ্যতা..." },
                          applyLink: "mailto:careers@mirsaraihospital.com",
                          bannerImage: "/about-us.jpg",
                          isActive: true
                        }
                      ] 
                    }))}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-dashed border-gray-300 dark:border-gray-600 text-sm text-gray-500 hover:border-[#1E2B7A] hover:text-[#1E2B7A] transition-colors"
                  >
                    <Plus className="h-4 w-4" /> Add Job Position
                  </button>
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
