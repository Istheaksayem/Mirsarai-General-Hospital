"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Plus, Trash2, Loader2, ArrowLeft, Heart, Award, Shield, Clock, Star, Layout, MessageSquare, Megaphone, Info } from "lucide-react";
import {
  getCmsDepartmentsPageConfig,
  updateCmsDepartmentsPageConfig,
  type CmsDepartmentsPage,
  type CmsFeature,
  type CmsTestimonial,
} from "@/lib/services/api";
import { CmsTabNav, CmsTab, CmsCard, CmsStatusBar, CmsPageHeader } from "@/components/cms/CmsLayout";
import { LanguageTabs } from "@/components/cms/LanguageTabs";
import { LocalizedInput, LocalizedTextarea, SectionDivider } from "@/components/cms/LocalizedFields";
import { FormField, FormInput } from "@/components/ui/FormPage";

export default function DepartmentsCmsPage() {
  const router = useRouter();
  const [data, setData] = useState<CmsDepartmentsPage | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [cmsTab, setCmsTab] = useState<CmsTab>("content");
  const [langTab, setLangTab] = useState<"en" | "bn">("en");
  const [seoLangTab, setSeoLangTab] = useState<"en" | "bn">("en");
  const [status, setStatus] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Form states for adding new feature or testimonial
  const [newFeature, setNewFeature] = useState<CmsFeature>({
    icon: "FiAward",
    title: { en: "", bn: "" },
    description: { en: "", bn: "" },
    color: "#1E2B7A",
    bg: "rgba(30,43,122,0.08)",
    isVisible: true,
    displayOrder: 0
  });

  const [newTestimonial, setNewTestimonial] = useState<CmsTestimonial>({
    name: "",
    department: "",
    rating: 5,
    text: { en: "", bn: "" },
    avatar: "",
    color: "#76BC21",
    isVisible: true,
    displayOrder: 0
  });

  useEffect(() => {
    getCmsDepartmentsPageConfig()
      .then((res) => {
        setData(res.data);
      })
      .catch((e) => setStatus({ type: "error", text: e.message || "Failed to load data" }))
      .finally(() => setIsLoading(false));
  }, []);

  const handleSave = async () => {
    if (!data) return;
    setIsSaving(true);
    setStatus(null);
    try {
      await updateCmsDepartmentsPageConfig(data);
      setStatus({ type: "success", text: "Departments landing page settings saved successfully!" });
      setTimeout(() => setStatus(null), 4000);
    } catch (e: any) {
      setStatus({ type: "error", text: e.message || "Save failed" });
    } finally {
      setIsSaving(false);
    }
  };

  const set = useCallback((updater: (d: CmsDepartmentsPage) => CmsDepartmentsPage) => {
    setData((prev) => (prev ? updater(prev) : prev));
  }, []);

  // Features list mutations
  const addFeature = () => {
    if (!newFeature.title.en || !newFeature.description.en) {
      alert("Please fill in at least the English fields for the new feature.");
      return;
    }
    set((d) => ({
      ...d,
      features: [...(d.features || []), { ...newFeature, displayOrder: (d.features || []).length }]
    }));
    setNewFeature({
      icon: "FiAward",
      title: { en: "", bn: "" },
      description: { en: "", bn: "" },
      color: "#1E2B7A",
      bg: "rgba(30,43,122,0.08)",
      isVisible: true,
      displayOrder: 0
    });
  };

  const removeFeature = (index: number) => {
    set((d) => ({
      ...d,
      features: (d.features || []).filter((_, idx) => idx !== index)
    }));
  };

  // Testimonials list mutations
  const addTestimonial = () => {
    if (!newTestimonial.name || !newTestimonial.text.en) {
      alert("Please fill in name and English text for the new testimonial.");
      return;
    }
    set((d) => ({
      ...d,
      testimonials: [...(d.testimonials || []), { ...newTestimonial, displayOrder: (d.testimonials || []).length }]
    }));
    setNewTestimonial({
      name: "",
      department: "",
      rating: 5,
      text: { en: "", bn: "" },
      avatar: "",
      color: "#76BC21",
      isVisible: true,
      displayOrder: 0
    });
  };

  const removeTestimonial = (index: number) => {
    set((d) => ({
      ...d,
      testimonials: (d.testimonials || []).filter((_, idx) => idx !== index)
    }));
  };

  if (isLoading) {
    return (
      <div className="flex h-[400px] items-center justify-center gap-3">
        <Loader2 className="h-8 w-8 animate-spin text-[#1E2B7A]" />
        <p className="text-sm text-gray-500">Loading Departments page content…</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="rounded-2xl border border-red-100 bg-red-50 p-6 text-center text-red-600">
        <p className="font-semibold">Error Loading Content</p>
        <p className="text-sm mt-1">{status?.text || "Please check if your backend server is up and connected."}</p>
        <button onClick={() => window.location.reload()} className="mt-4 px-4 py-2 bg-red-600 text-white rounded-xl text-sm">Retry</button>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-10">
      <CmsPageHeader
        title="Departments Landing Page CMS"
        description="Edit the global layout, stats, feature highlights, patient testimonials, and CTA of the Departments route"
        onBack={() => router.push("/super-admin/cms")}
        onSave={handleSave}
        isSaving={isSaving}
      />

      <div className="text-xs text-blue-500 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 rounded-xl p-3 border border-blue-100 dark:border-blue-800">
        🏥 Affects route: <strong>/departments</strong>. Manage frontend labels, visibility toggles, stats, features cards, and customer reviews.
      </div>

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
                <SectionDivider title="Language Selection" description="Toggle language tab to translate editable fields below" />
                <LanguageTabs activeTab={langTab} onTabChange={setLangTab} />
              </div>

              {/* Page Hero/Header Banner settings */}
              <div className="space-y-4">
                <SectionDivider
                  title="Hero Section Banner"
                  description="Customize page title and subtitle displayed inside the top hero banner"
                />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <LocalizedInput
                    label="Page Main Title"
                    value={data.title}
                    activeTab={langTab}
                    onChange={(v) => set((d) => ({ ...d, title: v }))}
                    placeholder={{ en: "Our Departments", bn: "আমাদের বিভাগসমূহ" }}
                    required
                  />
                  <LocalizedInput
                    label="Section Badge Tag"
                    value={data.subtitle}
                    activeTab={langTab}
                    onChange={(v) => set((d) => ({ ...d, subtitle: v }))}
                    placeholder={{ en: "DEPARTMENTS", bn: "বিভাগসমূহ" }}
                    required
                  />
                </div>
              </div>

              {/* Statistics settings */}
              <div className="space-y-4">
                <SectionDivider
                  title="Hospital General Statistics"
                  description="Customize patients count and service years counters displayed in the statistics section"
                />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormField label="Patients Treated Count Label (e.g. 15K+)">
                    <FormInput
                      value={data.hospitalStats?.patientsCount || ""}
                      onChange={(e) => set((d) => ({
                        ...d,
                        hospitalStats: { ...d.hospitalStats!, patientsCount: e.target.value }
                      }))}
                      placeholder="15K+"
                    />
                  </FormField>
                  <FormField label="Years of Service Label (e.g. 10+)">
                    <FormInput
                      value={data.hospitalStats?.yearsOfService || ""}
                      onChange={(e) => set((d) => ({
                        ...d,
                        hospitalStats: { ...d.hospitalStats!, yearsOfService: e.target.value }
                      }))}
                      placeholder="10+"
                    />
                  </FormField>
                </div>
              </div>

              {/* Features List */}
              <div className="space-y-4">
                <SectionDivider
                  title="Highlights & Features"
                  description="Configure key features displayed in the columns under the stats bar"
                />
                
                {/* Existing features list */}
                <div className="space-y-3">
                  {(data.features || []).map((feat, idx) => (
                    <div key={idx} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl border border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/30">
                      <div className="flex items-start gap-3">
                        <div className="mt-1 flex h-8 w-8 items-center justify-center rounded-lg text-white" style={{ backgroundColor: feat.color || '#1E2B7A' }}>
                          <span className="text-xs font-bold">{feat.icon?.replace("Fi", "") || "F"}</span>
                        </div>
                        <div>
                          <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                            {feat.title[langTab] || feat.title.en || "Untitled Feature"}
                          </h4>
                          <p className="text-xs text-gray-400 mt-0.5">
                            {feat.description[langTab] || feat.description.en}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 self-end sm:self-auto">
                        <label className="flex items-center gap-1.5 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={feat.isVisible}
                            onChange={(e) => {
                              const list = [...(data.features || [])];
                              list[idx].isVisible = e.target.checked;
                              set((d) => ({ ...d, features: list }));
                            }}
                            className="w-4 h-4 rounded accent-[#1E2B7A]"
                          />
                          <span className="text-xs text-gray-500">Visible</span>
                        </label>
                        <button
                          type="button"
                          onClick={() => removeFeature(idx)}
                          className="h-8 w-8 flex items-center justify-center rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Add new feature form */}
                <div className="p-4 border border-dashed border-gray-200 dark:border-gray-700 rounded-2xl space-y-4">
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">➕ Add Feature Highlight</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <FormField label="Icon">
                      <select
                        value={newFeature.icon}
                        onChange={(e) => setNewFeature({ ...newFeature, icon: e.target.value })}
                        className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-3.5 py-2.5 text-sm text-gray-900 dark:text-gray-100"
                      >
                        <option value="FiAward">Award / Ribbon</option>
                        <option value="FiClock">Clock / Time</option>
                        <option value="FiHeart">Heart / Love</option>
                        <option value="FiShield">Shield / Security</option>
                      </select>
                    </FormField>
                    <FormField label="Accent Color">
                      <FormInput
                        value={newFeature.color}
                        onChange={(e) => setNewFeature({ ...newFeature, color: e.target.value })}
                        placeholder="#1E2B7A"
                      />
                    </FormField>
                    <FormField label="Background Tint">
                      <FormInput
                        value={newFeature.bg}
                        onChange={(e) => setNewFeature({ ...newFeature, bg: e.target.value })}
                        placeholder="rgba(30,43,122,0.08)"
                      />
                    </FormField>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <LocalizedInput
                      label="Feature Title"
                      value={newFeature.title}
                      activeTab={langTab}
                      onChange={(v) => setNewFeature({ ...newFeature, title: v })}
                      placeholder={{ en: "Expert Specialists", bn: "দক্ষ বিশেষজ্ঞ" }}
                    />
                    <LocalizedInput
                      label="Short Description"
                      value={newFeature.description}
                      activeTab={langTab}
                      onChange={(v) => setNewFeature({ ...newFeature, description: v })}
                      placeholder={{ en: "Highly trained specialist staff...", bn: "আমাদের ডাক্তাররা অত্যন্ত প্রশিক্ষিত..." }}
                    />
                  </div>
                  <button
                    type="button"
                    onClick={addFeature}
                    className="flex items-center gap-1.5 px-4 py-2 bg-[#1E2B7A] text-white text-xs font-semibold rounded-xl"
                  >
                    <Plus className="h-3.5 w-3.5" /> Add to Features List
                  </button>
                </div>
              </div>

              {/* Testimonials List */}
              <div className="space-y-4">
                <SectionDivider
                  title="Patient Testimonials"
                  description="Add or edit testimonials from patients speaking about MGH care"
                />

                {/* Existing list */}
                <div className="space-y-3">
                  {(data.testimonials || []).map((test, idx) => (
                    <div key={idx} className="flex flex-col p-4 rounded-xl border border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/30 gap-2">
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">{test.name}</span>
                          <span className="text-xs text-gray-400 ml-2">({test.department})</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <label className="flex items-center gap-1.5 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={test.isVisible}
                              onChange={(e) => {
                                const list = [...(data.testimonials || [])];
                                list[idx].isVisible = e.target.checked;
                                set((d) => ({ ...d, testimonials: list }));
                              }}
                              className="w-4 h-4 rounded accent-[#1E2B7A]"
                            />
                            <span className="text-xs text-gray-500">Visible</span>
                          </label>
                          <button
                            type="button"
                            onClick={() => removeTestimonial(idx)}
                            className="text-red-500 hover:text-red-600"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                      <p className="text-xs text-gray-600 dark:text-gray-400 italic">
                        &ldquo;{test.text[langTab] || test.text.en}&rdquo;
                      </p>
                      <div className="flex items-center gap-1">
                        {Array.from({ length: test.rating }).map((_, i) => (
                          <Star key={i} className="h-3 w-3 fill-amber-400 text-amber-400" />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Add new testimonial form */}
                <div className="p-4 border border-dashed border-gray-200 dark:border-gray-700 rounded-2xl space-y-4">
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">➕ Add Review/Testimonial</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <FormField label="Patient Name">
                      <FormInput
                        value={newTestimonial.name}
                        onChange={(e) => setNewTestimonial({ ...newTestimonial, name: e.target.value })}
                        placeholder="John Doe"
                      />
                    </FormField>
                    <FormField label="Department Affected">
                      <FormInput
                        value={newTestimonial.department}
                        onChange={(e) => setNewTestimonial({ ...newTestimonial, department: e.target.value })}
                        placeholder="Cardiology Department"
                      />
                    </FormField>
                    <FormField label="Rating">
                      <select
                        value={newTestimonial.rating}
                        onChange={(e) => setNewTestimonial({ ...newTestimonial, rating: parseInt(e.target.value) || 5 })}
                        className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-3.5 py-2.5 text-sm text-gray-900 dark:text-gray-100"
                      >
                        <option value="5">5 Stars</option>
                        <option value="4">4 Stars</option>
                        <option value="3">3 Stars</option>
                      </select>
                    </FormField>
                  </div>
                  <LocalizedTextarea
                    label="Testimonial Feedback Text"
                    value={newTestimonial.text}
                    activeTab={langTab}
                    onChange={(v) => setNewTestimonial({ ...newTestimonial, text: v })}
                    placeholder={{ en: "Type review in English...", bn: "বাংলায় মতামত লিখুন..." }}
                    rows={2}
                  />
                  <button
                    type="button"
                    onClick={addTestimonial}
                    className="flex items-center gap-1.5 px-4 py-2 bg-[#1E2B7A] text-white text-xs font-semibold rounded-xl"
                  >
                    <Plus className="h-3.5 w-3.5" /> Add to Reviews List
                  </button>
                </div>
              </div>

              {/* CTA Banner */}
              <div className="space-y-4">
                <SectionDivider
                  title="Call-to-Action Banner"
                  description="Customize the CTA heading, body text, and button settings at the bottom of the page"
                />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <LocalizedInput
                    label="CTA Main Heading"
                    value={data.cta?.title || emptyBilingual()}
                    activeTab={langTab}
                    onChange={(v) => set((d) => ({
                      ...d,
                      cta: { ...d.cta!, title: v }
                    }))}
                    placeholder={{ en: "Need Medical Assistance?", bn: "চিকিৎসা সহায়তা প্রয়োজন?" }}
                  />
                  <LocalizedInput
                    label="CTA Body Description"
                    value={data.cta?.description || emptyBilingual()}
                    activeTab={langTab}
                    onChange={(v) => set((d) => ({
                      ...d,
                      cta: { ...d.cta!, description: v }
                    }))}
                    placeholder={{ en: "Our specialists are ready to help...", bn: "আমাদের চিকিৎসকরা সর্বদা প্রস্তুত..." }}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 p-4 rounded-xl border border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/30">
                  <div className="space-y-3">
                    <h5 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Primary Button Settings</h5>
                    <LocalizedInput
                      label="Button Label"
                      value={data.cta?.primaryBtn?.label || emptyBilingual()}
                      activeTab={langTab}
                      onChange={(v) => set((d) => ({
                        ...d,
                        cta: {
                          ...d.cta!,
                          primaryBtn: { ...d.cta!.primaryBtn!, label: v }
                        }
                      }))}
                      placeholder={{ en: "Book Appointment", bn: "অ্যাপয়েন্টমেন্ট বুক করুন" }}
                    />
                    <FormField label="Primary Button Target Link">
                      <FormInput
                        value={data.cta?.primaryBtn?.link || ""}
                        onChange={(e) => set((d) => ({
                          ...d,
                          cta: {
                            ...d.cta!,
                            primaryBtn: { ...d.cta!.primaryBtn!, link: e.target.value }
                          }
                        }))}
                        placeholder="/appointment"
                      />
                    </FormField>
                  </div>

                  <div className="space-y-3">
                    <h5 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Secondary Button Settings</h5>
                    <LocalizedInput
                      label="Button Label"
                      value={data.cta?.secondaryBtn?.label || emptyBilingual()}
                      activeTab={langTab}
                      onChange={(v) => set((d) => ({
                        ...d,
                        cta: {
                          ...d.cta!,
                          secondaryBtn: { ...d.cta!.secondaryBtn!, label: v }
                        }
                      }))}
                      placeholder={{ en: "View Our Doctors", bn: "আমাদের ডাক্তারদের দেখুন" }}
                    />
                    <FormField label="Secondary Button Target Link">
                      <FormInput
                        value={data.cta?.secondaryBtn?.link || ""}
                        onChange={(e) => set((d) => ({
                          ...d,
                          cta: {
                            ...d.cta!,
                            secondaryBtn: { ...d.cta!.secondaryBtn!, link: e.target.value }
                          }
                        }))}
                        placeholder="/doctors"
                      />
                    </FormField>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* ── SEO TAB ── */}
          {cmsTab === "seo" && (
            <>
              <div className="flex items-center justify-between flex-wrap gap-3">
                <SectionDivider title="SEO Language Settings" description="Set localized metadata for search indexing" />
                <LanguageTabs activeTab={seoLangTab} onTabChange={setSeoLangTab} />
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-1 gap-4">
                  <LocalizedInput
                    label="Meta Title (Head Browser Title)"
                    value={data.seo?.metaTitle || emptyBilingual()}
                    activeTab={seoLangTab}
                    onChange={(v) => set((d) => ({
                      ...d,
                      seo: { ...d.seo!, metaTitle: v }
                    }))}
                    placeholder={{ en: "Hospital Departments - Mirsarai General Hospital", bn: "হাসপাতালের বিভাগসমূহ - মীরসরাই জেনারেল হাসপাতাল" }}
                  />
                  <LocalizedTextarea
                    label="Meta Description"
                    value={data.seo?.metaDescription || emptyBilingual()}
                    activeTab={seoLangTab}
                    onChange={(v) => set((d) => ({
                      ...d,
                      seo: { ...d.seo!, metaDescription: v }
                    }))}
                    placeholder={{ en: "Explore MGH departments...", bn: "আমাদের বিশেষায়িত সেবা ও ইউনিটসমূহ..." }}
                    rows={4}
                  />
                </div>
              </div>
            </>
          )}

          {/* ── VISIBILITY TAB ── */}
          {cmsTab === "visibility" && (
            <div className="p-8 text-center text-gray-500">
              <Info className="h-10 w-10 text-gray-300 mx-auto mb-2" />
              <h4 className="font-semibold text-gray-700 dark:text-gray-300">Visibility settings are configured inline!</h4>
              <p className="text-xs text-gray-400 mt-1 max-w-sm mx-auto">
                Toggle visibility checkmarks on specific feature highlights and testimonial cards under the Content tab.
              </p>
            </div>
          )}
        </div>
      </CmsCard>
    </div>
  );
}
