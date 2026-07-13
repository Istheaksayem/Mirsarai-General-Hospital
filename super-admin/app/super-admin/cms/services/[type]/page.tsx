"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import { Plus, Trash2, Loader2 } from "lucide-react";
import {
  getServicePageData,
  updateServicePageData,
  ServicePageData,
  ServicePageFeature,
  ServicePageCategory,
  ServicePageStat,
  ServicePageGuideline,
  ServicePageVaccinationEntry,
} from "@/lib/services/api";
import { CmsTabNav, CmsTab, CmsCard, CmsStatusBar, CmsPageHeader } from "@/components/cms/CmsLayout";
import { LanguageTabs } from "@/components/cms/LanguageTabs";
import { ImageUploader } from "@/components/cms/ImageUploader";
import { SeoFields } from "@/components/cms/SeoFields";
import { LocalizedInput, LocalizedTextarea, SectionDivider } from "@/components/cms/LocalizedFields";
import { FormField, FormInput } from "@/components/ui/FormPage";

const SERVICE_LABELS: Record<string, string> = {
  "diagnostic-services": "Diagnostic Services",
  diagnostic: "Diagnostic Services",
  nicu: "NICU & Baby Care",
};

const ICON_SUGGESTIONS = [
  "FaMicroscope", "FaClock", "FaUserMd", "FaCheckCircle", "FaFlask",
  "FaHeartbeat", "FaLaptopMedical", "FaUserNurse", "FaHandHoldingHeart",
  "FaBaby", "FaAmbulance", "FaShieldAlt", "FaSyringe", "FaSmile", "FaBook", "FaStar",
];

const ACCENT_COLORS = [
  { label: "Navy", value: "#1E2B7A" },
  { label: "Green", value: "#76BC21" },
  { label: "Amber", value: "#f59e0b" },
  { label: "Red", value: "#ef4444" },
  { label: "Pink", value: "#ec4899" },
  { label: "Purple", value: "#8b5cf6" },
  { label: "Teal", value: "#14b8a6" },
  { label: "Orange", value: "#f97316" },
];

export default function ServicePageCmsEditor() {
  const router = useRouter();
  const params = useParams();
  const type = params?.type as string;

  const [data, setData] = useState<ServicePageData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [cmsTab, setCmsTab] = useState<CmsTab>("content");
  const [langTab, setLangTab] = useState<"en" | "bn">("en");
  const [seoLangTab, setSeoLangTab] = useState<"en" | "bn">("en");
  const [status, setStatus] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const label = SERVICE_LABELS[type] || type;

  useEffect(() => {
    if (!type) return;
    getServicePageData(type)
      .then((res) => setData(res.data))
      .catch((e) => setStatus({ type: "error", text: e.message || "Failed to load data" }))
      .finally(() => setIsLoading(false));
  }, [type]);

  const handleSave = async () => {
    if (!data) return;
    setIsSaving(true);
    setStatus(null);
    try {
      const payload = { ...data };
      delete payload._id;
      delete payload.createdBy;
      delete payload.updatedBy;
      delete payload.createdAt;
      delete payload.updatedAt;
      await updateServicePageData(type, payload);
      setStatus({ type: "success", text: `${label} content saved successfully!` });
      setTimeout(() => setStatus(null), 4000);
    } catch (e: any) {
      setStatus({ type: "error", text: e.message || "Save failed" });
    } finally {
      setIsSaving(false);
    }
  };

  const set = useCallback((updater: (d: ServicePageData) => ServicePageData) => {
    setData((prev) => (prev ? updater(prev) : prev));
  }, []);

  const handleImageUpload = async (base64: string) => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1"}/about/upload`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ base64Data: base64 }),
        }
      );
      const result = await res.json();
      return result.data.url;
    } catch {
      return "";
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-[400px] items-center justify-center gap-3">
        <Loader2 className="h-8 w-8 animate-spin text-[#1E2B7A]" />
        <p className="text-sm text-gray-500">Loading {label} content&hellip;</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="rounded-2xl border border-red-100 bg-red-50 p-6 text-center text-red-600">
        <p className="font-semibold">Error Loading Content</p>
        <p className="text-sm mt-1">{status?.text || "Please ensure the backend server is running."}</p>
        <button onClick={() => window.location.reload()} className="mt-4 px-4 py-2 bg-red-600 text-white rounded-xl text-sm">
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-10">
      <CmsPageHeader
        title={`${label} CMS`}
        description={`Edit all content for the ${label} page — hero, features, services, statistics, and more`}
        onBack={() => router.push("/super-admin/cms/services")}
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
                <SectionDivider title="Hero Section" description="Top banner with title, subtitle, and background image" />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <LocalizedInput
                    label="Page Title"
                    value={data.title}
                    activeTab={langTab}
                    onChange={(v) => set((d) => ({ ...d, title: v }))}
                    placeholder={{ en: "Diagnostic Services", bn: "ডায়াগনস্টিক সেবা" }}
                    required
                  />
                  <LocalizedInput
                    label="Subtitle"
                    value={data.subtitle}
                    activeTab={langTab}
                    onChange={(v) => set((d) => ({ ...d, subtitle: v }))}
                    placeholder={{ en: "Advanced Medical Testing", bn: "উন্নত মেডিকেল পরীক্ষা" }}
                  />
                </div>
                <LocalizedTextarea
                  label="Hero Description"
                  value={data.heroDescription}
                  activeTab={langTab}
                  onChange={(v) => set((d) => ({ ...d, heroDescription: v }))}
                  placeholder={{ en: "State-of-the-art diagnostic center...", bn: "অত্যাধুনিক ডায়াগনস্টিক সেন্টার..." }}
                  rows={3}
                  required
                />
                <ImageUploader
                  label="Hero Background Image"
                  value={data.backgroundImage}
                  onChange={(url) => set((d) => ({ ...d, backgroundImage: url }))}
                  onUpload={handleImageUpload}
                  helpText="Main background image for the hero section (recommended: 1920×800px)"
                />
              </div>

              <hr className="border-gray-100 dark:border-gray-800" />

              {/* Description / About Section */}
              <div className="space-y-4">
                <SectionDivider title="About Section" description="Main description text displayed below the hero" />
                <LocalizedTextarea
                  label="Description"
                  value={data.description}
                  activeTab={langTab}
                  onChange={(v) => set((d) => ({ ...d, description: v }))}
                  placeholder={{ en: "Mirsarai General Hospital's Diagnostic Center...", bn: "মীরসরাই জেনারেল হাসপাতালের ডায়াগনস্টিক সেন্টার..." }}
                  rows={5}
                  required
                />
              </div>

              <hr className="border-gray-100 dark:border-gray-800" />

              {/* Features */}
              <div className="space-y-4">
                <SectionDivider title="Features" description="Key feature cards displayed below the hero (title, description, icon)" />
                <div className="space-y-3">
                  {data.features.map((feature, i) => (
                    <div key={i} className="rounded-xl border border-gray-100 dark:border-gray-800 p-4 space-y-3 bg-gray-50/50 dark:bg-gray-800/30">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-gray-500 uppercase tracking-wide">Feature #{i + 1}</span>
                        <button
                          type="button"
                          onClick={() => set((d) => ({ ...d, features: d.features.filter((_, idx) => idx !== i) }))}
                          className="flex h-7 w-7 items-center justify-center rounded-lg border border-red-200 text-red-500 hover:bg-red-50 transition-colors"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <LocalizedInput
                          label="Title"
                          value={feature.title}
                          activeTab={langTab}
                          onChange={(v) => {
                            const updated = [...data.features];
                            updated[i] = { ...feature, title: v };
                            set((d) => ({ ...d, features: updated }));
                          }}
                          placeholder={{ en: "Advanced Equipment", bn: "অত্যাধুনিক সরঞ্জাম" }}
                        />
                        <FormField label="Icon">
                          <FormInput
                            value={feature.icon}
                            onChange={(e) => {
                              const updated = [...data.features];
                              updated[i] = { ...feature, icon: e.target.value };
                              set((d) => ({ ...d, features: updated }));
                            }}
                            placeholder="FaMicroscope"
                            list="icon-suggestions"
                          />
                          <datalist id="icon-suggestions">
                            {ICON_SUGGESTIONS.map((ic) => (
                              <option key={ic} value={ic} />
                            ))}
                          </datalist>
                        </FormField>
                      </div>
                      <LocalizedTextarea
                        label="Description"
                        value={feature.description}
                        activeTab={langTab}
                        onChange={(v) => {
                          const updated = [...data.features];
                          updated[i] = { ...feature, description: v };
                          set((d) => ({ ...d, features: updated }));
                        }}
                        rows={2}
                        placeholder={{ en: "Latest medical technology...", bn: "সর্বশেষ মেডিকেল প্রযুক্তি..." }}
                      />
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() =>
                      set((d) => ({
                        ...d,
                        features: [
                          ...d.features,
                          {
                            title: { en: "New Feature", bn: "নতুন বৈশিষ্ট্য" },
                            description: { en: "Feature description", bn: "বৈশিষ্ট্যের বিবরণ" },
                            icon: "FaMicroscope",
                          },
                        ],
                      }))
                    }
                    className="flex items-center gap-2 px-4 py-2 rounded-xl border border-dashed border-gray-300 dark:border-gray-600 text-sm text-gray-500 hover:border-[#1E2B7A] hover:text-[#1E2B7A] transition-colors"
                  >
                    <Plus className="h-4 w-4" /> Add Feature
                  </button>
                </div>
              </div>

              <hr className="border-gray-100 dark:border-gray-800" />

              {/* Service Categories */}
              <div className="space-y-4">
                <SectionDivider title="Service Categories" description="Categories with tests or items, icon, and accent color" />
                <div className="space-y-3">
                  {data.services.map((svc, i) => (
                    <div key={i} className="rounded-xl border border-gray-100 dark:border-gray-800 p-4 space-y-3 bg-gray-50/50 dark:bg-gray-800/30">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-gray-500 uppercase tracking-wide">Category #{i + 1}</span>
                        <button
                          type="button"
                          onClick={() => set((d) => ({ ...d, services: d.services.filter((_, idx) => idx !== i) }))}
                          className="flex h-7 w-7 items-center justify-center rounded-lg border border-red-200 text-red-500 hover:bg-red-50 transition-colors"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <LocalizedInput
                          label="Category Name"
                          value={svc.category}
                          activeTab={langTab}
                          onChange={(v) => {
                            const updated = [...data.services];
                            updated[i] = { ...svc, category: v };
                            set((d) => ({ ...d, services: updated }));
                          }}
                          placeholder={{ en: "Clinical Pathology", bn: "ক্লিনিক্যাল প্যাথলজি" }}
                        />
                        <FormField label="Icon">
                          <FormInput
                            value={svc.icon}
                            onChange={(e) => {
                              const updated = [...data.services];
                              updated[i] = { ...svc, icon: e.target.value };
                              set((d) => ({ ...d, services: updated }));
                            }}
                            placeholder="FaFlask"
                            list="icon-suggestions"
                          />
                        </FormField>
                        <FormField label="Accent Color">
                          <div className="flex flex-wrap gap-2">
                            {ACCENT_COLORS.map((c) => (
                              <button
                                key={c.value}
                                type="button"
                                onClick={() => {
                                  const updated = [...data.services];
                                  updated[i] = { ...svc, accent: c.value };
                                  set((d) => ({ ...d, services: updated }));
                                }}
                                className={`h-8 w-8 rounded-xl border-2 transition-all ${
                                  svc.accent === c.value ? "border-gray-900 dark:border-white scale-110" : "border-transparent"
                                }`}
                                style={{ background: c.value }}
                                title={c.label}
                              />
                            ))}
                            <FormInput
                              value={svc.accent}
                              onChange={(e) => {
                                const updated = [...data.services];
                                updated[i] = { ...svc, accent: e.target.value };
                                set((d) => ({ ...d, services: updated }));
                              }}
                              className="w-24"
                              placeholder="#1E2B7A"
                            />
                          </div>
                        </FormField>
                      </div>

                      {/* Tests (Diagnostic) or Items (NICU / Baby Care) */}
                      <FormField label={type === "diagnostic" ? `Tests (${langTab === "en" ? "English" : "বাংলা"})` : `Items (${langTab === "en" ? "English" : "বাংলা"})`}>
                        <div className="space-y-2">
                          {(type === "diagnostic" ? svc.tests : svc.items)?.map((item, ti) => {
                            const itemVal = typeof item === "string" ? { en: item, bn: "" } : item;
                            return (
                              <div key={ti} className="flex gap-2 items-start">
                                <input
                                  value={langTab === "en" ? itemVal.en : itemVal.bn}
                                  onChange={(e) => {
                                    const field = langTab === "en" ? "en" : "bn";
                                    const arr = [...(type === "diagnostic" ? svc.tests : svc.items)];
                                    const existing = typeof arr[ti] === "string" ? { en: arr[ti] as string, bn: "" } : { ...arr[ti] as any };
                                    existing[field] = e.target.value;
                                    arr[ti] = existing;
                                    const updated = [...data.services];
                                    if (type === "diagnostic") {
                                      updated[i] = { ...svc, tests: arr as any };
                                    } else {
                                      updated[i] = { ...svc, items: arr as any };
                                    }
                                    set((d) => ({ ...d, services: updated }));
                                  }}
                                  className="flex-1 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-3.5 py-2 text-sm text-gray-900 dark:text-gray-100 focus:border-[#1E2B7A] focus:ring-2 focus:ring-[#1E2B7A]/20 focus:outline-none transition-all placeholder:text-gray-400"
                                  placeholder={langTab === "en" ? "Item name" : "আইটেমের নাম"}
                                />
                                <button
                                  type="button"
                                  onClick={() => {
                                    const arr = [...(type === "diagnostic" ? svc.tests : svc.items)];
                                    arr.splice(ti, 1);
                                    const updated = [...data.services];
                                    if (type === "diagnostic") {
                                      updated[i] = { ...svc, tests: arr as any };
                                    } else {
                                      updated[i] = { ...svc, items: arr as any };
                                    }
                                    set((d) => ({ ...d, services: updated }));
                                  }}
                                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-red-200 text-red-500 hover:bg-red-50 transition-colors"
                                >
                                  <Trash2 className="h-3.5 w-3.5" />
                                </button>
                              </div>
                            );
                          })}
                          <button
                            type="button"
                            onClick={() => {
                              const arr = [...(type === "diagnostic" ? svc.tests : svc.items), { en: "", bn: "" }];
                              const updated = [...data.services];
                              if (type === "diagnostic") {
                                updated[i] = { ...svc, tests: arr as any };
                              } else {
                                updated[i] = { ...svc, items: arr as any };
                              }
                              set((d) => ({ ...d, services: updated }));
                            }}
                            className="flex items-center gap-2 px-4 py-2 rounded-xl border border-dashed border-gray-300 dark:border-gray-600 text-sm text-gray-500 hover:border-[#1E2B7A] hover:text-[#1E2B7A] transition-colors"
                          >
                            <Plus className="h-4 w-4" /> {type === "diagnostic" ? "Add Test" : "Add Item"}
                          </button>
                        </div>
                      </FormField>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() =>
                      set((d) => ({
                        ...d,
                        services: [
                          ...d.services,
                          {
                            category: { en: "New Category", bn: "নতুন বিভাগ" },
                            icon: "FaFlask",
                            accent: "#1E2B7A",
                            tests: [],
                            items: [],
                          },
                        ],
                      }))
                    }
                    className="flex items-center gap-2 px-4 py-2 rounded-xl border border-dashed border-gray-300 dark:border-gray-600 text-sm text-gray-500 hover:border-[#1E2B7A] hover:text-[#1E2B7A] transition-colors"
                  >
                    <Plus className="h-4 w-4" /> Add Category
                  </button>
                </div>
              </div>

              <hr className="border-gray-100 dark:border-gray-800" />

              {/* Working Hours (Diagnostic & NICU) */}
              {(type === "diagnostic" || type === "nicu") && (
                <>
                  <div className="space-y-4">
                    <SectionDivider title="Working Hours" description="Weekday and emergency hours" />
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <FormField label="Weekdays">
                        <FormInput
                          value={data.workingHours?.weekdays || ""}
                          onChange={(e) =>
                            set((d) => ({
                              ...d,
                              workingHours: {
                                weekdays: e.target.value,
                                ...(type === "diagnostic" ? { weekends: d.workingHours?.weekends || "" } : {}),
                                emergency: d.workingHours?.emergency || { en: "", bn: "" },
                              },
                            }))
                          }
                          placeholder="8:00 AM - 10:00 PM"
                        />
                      </FormField>
                      {type === "diagnostic" && (
                        <FormField label="Weekends">
                          <FormInput
                            value={data.workingHours?.weekends || ""}
                            onChange={(e) =>
                              set((d) => ({
                                ...d,
                                workingHours: {
                                  weekdays: d.workingHours?.weekdays || "",
                                  weekends: e.target.value,
                                  emergency: d.workingHours?.emergency || { en: "", bn: "" },
                                },
                              }))
                            }
                            placeholder="9:00 AM - 8:00 PM"
                          />
                        </FormField>
                      )}
                      <LocalizedInput
                        label="Emergency"
                        value={data.workingHours?.emergency || { en: "", bn: "" }}
                        activeTab={langTab}
                        onChange={(v) =>
                          set((d) => ({
                            ...d,
                            workingHours: {
                              weekdays: d.workingHours?.weekdays || "",
                              ...(type === "diagnostic" ? { weekends: d.workingHours?.weekends || "" } : {}),
                              emergency: v,
                            },
                          }))
                        }
                        placeholder={{ en: "24/7 Available", bn: "২৪/৭ উপলব্ধ" }}
                      />
                    </div>
                  </div>
                  <hr className="border-gray-100 dark:border-gray-800" />
                </>
              )}

              {/* Statistics */}
              <div className="space-y-4">
                <SectionDivider title="Statistics" description="Key metrics displayed in the statistics section (e.g., 5000+ Tests, 99.5% Accuracy)" />
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
                        <FormField label="Value (e.g. 50,000+)">
                          <FormInput
                            value={stat.value}
                            onChange={(e) => {
                              const updated = [...data.statistics];
                              updated[i] = { ...stat, value: e.target.value };
                              set((d) => ({ ...d, statistics: updated }));
                            }}
                            placeholder="50,000+"
                          />
                        </FormField>
                        <LocalizedInput
                          label="Label"
                          value={stat.label}
                          activeTab={langTab}
                          onChange={(v) => {
                            const updated = [...data.statistics];
                            updated[i] = { ...stat, label: v };
                            set((d) => ({ ...d, statistics: updated }));
                          }}
                          placeholder={{ en: "Tests Conducted", bn: "পরীক্ষা পরিচালিত" }}
                        />
                      </div>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() =>
                      set((d) => ({
                        ...d,
                        statistics: [
                          ...d.statistics,
                          { value: "100+", label: { en: "New Stat", bn: "নতুন পরিসংখ্যান" } },
                        ],
                      }))
                    }
                    className="flex items-center gap-2 px-4 py-2 rounded-xl border border-dashed border-gray-300 dark:border-gray-600 text-sm text-gray-500 hover:border-[#1E2B7A] hover:text-[#1E2B7A] transition-colors"
                  >
                    <Plus className="h-4 w-4" /> Add Statistic
                  </button>
                </div>
              </div>

              <hr className="border-gray-100 dark:border-gray-800" />

              {/* Equipment (NICU only) */}
              {type === "nicu" && (
                <>
                  <div className="space-y-4">
                    <SectionDivider title="Equipment" description="Medical equipment list displayed in the NICU page (bilingual)" />
                    <div className="space-y-3">
                      {data.equipment?.map((item, ei) => {
                        const itemVal = typeof item === "string" ? { en: item, bn: "" } : item;
                        return (
                          <div key={ei} className="flex gap-3 items-start">
                            <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-3">
                              <FormField label={`Equipment ${ei + 1} (English)`}>
                                <FormInput
                                  value={itemVal.en}
                                  onChange={(e) => {
                                    const updated = [...data.equipment].map((old, idx) => {
                                      if (idx !== ei) return old;
                                      const oldVal = typeof old === "string" ? { en: old, bn: "" } : { ...old };
                                      return { ...oldVal, en: e.target.value };
                                    });
                                    set((d) => ({ ...d, equipment: updated as any }));
                                  }}
                                  placeholder="Neonatal Ventilators"
                                />
                              </FormField>
                              <FormField label={`Equipment ${ei + 1} (বাংলা)`}>
                                <FormInput
                                  value={itemVal.bn}
                                  onChange={(e) => {
                                    const updated = [...data.equipment].map((old, idx) => {
                                      if (idx !== ei) return old;
                                      const oldVal = typeof old === "string" ? { en: old, bn: "" } : { ...old };
                                      return { ...oldVal, bn: e.target.value };
                                    });
                                    set((d) => ({ ...d, equipment: updated as any }));
                                  }}
                                  placeholder="নবজাতক ভেন্টিলেটর"
                                />
                              </FormField>
                            </div>
                            <button
                              type="button"
                              onClick={() => {
                                const updated = data.equipment.filter((_, idx) => idx !== ei);
                                set((d) => ({ ...d, equipment: updated as any }));
                              }}
                              className="mt-6 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-red-200 text-red-500 hover:bg-red-50 transition-colors"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        );
                      })}
                      <button
                        type="button"
                        onClick={() =>
                          set((d) => ({
                            ...d,
                            equipment: [...d.equipment, { en: "", bn: "" }] as any,
                          }))
                        }
                        className="flex items-center gap-2 px-4 py-2 rounded-xl border border-dashed border-gray-300 dark:border-gray-600 text-sm text-gray-500 hover:border-[#1E2B7A] hover:text-[#1E2B7A] transition-colors"
                      >
                        <Plus className="h-4 w-4" /> Add Equipment
                      </button>
                    </div>
                  </div>
                  <hr className="border-gray-100 dark:border-gray-800" />
                </>
              )}

              {/* Guidelines (NICU only) */}
              {type === "nicu" && (
                <div className="space-y-4">
                  <SectionDivider title="Visiting Guidelines" description="List of guidelines displayed on the NICU page (bilingual)" />
                  <div className="space-y-3">
                    {data.guidelines.map((guideline, i) => (
                      <div key={i} className="flex gap-3 items-start">
                        <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <FormField label={`Guideline ${i + 1} (English)`}>
                            <FormInput
                              value={guideline.en || ""}
                              onChange={(e) => {
                                const updated = [...data.guidelines];
                                updated[i] = { ...guideline, en: e.target.value };
                                set((d) => ({ ...d, guidelines: updated }));
                              }}
                              placeholder="Parents can visit during designated hours"
                            />
                          </FormField>
                          <FormField label={`Guideline ${i + 1} (বাংলা)`}>
                            <FormInput
                              value={guideline.bn || ""}
                              onChange={(e) => {
                                const updated = [...data.guidelines];
                                updated[i] = { ...guideline, bn: e.target.value };
                                set((d) => ({ ...d, guidelines: updated }));
                              }}
                              placeholder="নির্ধারিত সময়ে অভিভাবকরা দেখতে পারেন"
                            />
                          </FormField>
                        </div>
                        <button
                          type="button"
                          onClick={() => set((d) => ({ ...d, guidelines: d.guidelines.filter((_, idx) => idx !== i) }))}
                          className="mt-6 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-red-200 text-red-500 hover:bg-red-50 transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() =>
                        set((d) => ({
                          ...d,
                          guidelines: [...d.guidelines, { en: "New guideline", bn: "নতুন নির্দেশিকা" }],
                        }))
                      }
                      className="flex items-center gap-2 px-4 py-2 rounded-xl border border-dashed border-gray-300 dark:border-gray-600 text-sm text-gray-500 hover:border-[#1E2B7A] hover:text-[#1E2B7A] transition-colors"
                    >
                      <Plus className="h-4 w-4" /> Add Guideline
                    </button>
                  </div>
                </div>
              )}

              {/* Vaccination Schedule (NICU & Baby Care) */}
              {type === "nicu" && (
                <>
                  <hr className="border-gray-100 dark:border-gray-800" />
                  <div className="space-y-4">
                    <SectionDivider title="Vaccination Schedule" description="Age-based vaccination schedule for the Baby Care page" />
                    <div className="space-y-3">
                      {data.vaccinationSchedule.map((entry, i) => (
                        <div key={i} className="rounded-xl border border-gray-100 dark:border-gray-800 p-4 space-y-3 bg-gray-50/50 dark:bg-gray-800/30">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-gray-500 uppercase tracking-wide">Schedule #{i + 1}</span>
                            <button
                              type="button"
                              onClick={() => set((d) => ({ ...d, vaccinationSchedule: d.vaccinationSchedule.filter((_, idx) => idx !== i) }))}
                              className="flex h-7 w-7 items-center justify-center rounded-lg border border-red-200 text-red-500 hover:bg-red-50 transition-colors"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <LocalizedInput
                              label="Age"
                              value={entry.age}
                              activeTab={langTab}
                              onChange={(v) => {
                                const updated = [...data.vaccinationSchedule];
                                updated[i] = { ...entry, age: v };
                                set((d) => ({ ...d, vaccinationSchedule: updated }));
                              }}
                              placeholder={{ en: "At Birth", bn: "জন্মের সময়" }}
                            />
                          </div>
                          <FormField label="Vaccines (one per line)">
                            <textarea
                              value={entry.vaccines.join("\n")}
                              onChange={(e) => {
                                const lines = e.target.value.split("\n").filter((l) => l.trim());
                                const updated = [...data.vaccinationSchedule];
                                updated[i] = { ...entry, vaccines: lines };
                                set((d) => ({ ...d, vaccinationSchedule: updated }));
                              }}
                              rows={3}
                              className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-3.5 py-2.5 text-sm text-gray-900 dark:text-gray-100 focus:border-[#1E2B7A] focus:ring-2 focus:ring-[#1E2B7A]/20 focus:outline-none transition-all resize-none placeholder:text-gray-400"
                              placeholder="BCG&#10;OPV-0&#10;Hepatitis B-1"
                            />
                          </FormField>
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={() =>
                          set((d) => ({
                            ...d,
                            vaccinationSchedule: [
                              ...d.vaccinationSchedule,
                              { age: { en: "New Age", bn: "নতুন বয়স" }, vaccines: [] },
                            ],
                          }))
                        }
                        className="flex items-center gap-2 px-4 py-2 rounded-xl border border-dashed border-gray-300 dark:border-gray-600 text-sm text-gray-500 hover:border-[#1E2B7A] hover:text-[#1E2B7A] transition-colors"
                      >
                        <Plus className="h-4 w-4" /> Add Schedule Entry
                      </button>
                    </div>
                  </div>
                </>
              )}
            </>
          )}

          {/* ── SEO TAB ── */}
          {cmsTab === "seo" && (
            <SeoFields
              seo={{
                metaTitle: data.seo?.metaTitle || { en: "", bn: "" },
                metaDescription: data.seo?.metaDescription || { en: "", bn: "" },
                keywords: { en: "", bn: "" },
              }}
              activeTab={seoLangTab}
              onTabChange={setSeoLangTab}
              onChange={(field, value) => {
                if (field === "metaTitle" || field === "metaDescription") {
                  set((d) => ({
                    ...d,
                    seo: {
                      metaTitle: d.seo?.metaTitle || { en: "", bn: "" },
                      metaDescription: d.seo?.metaDescription || { en: "", bn: "" },
                      [field]: value,
                    },
                  }));
                }
              }}
              onUpload={handleImageUpload}
            />
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/20">
          <button
            onClick={() => router.push("/super-admin/cms/services")}
            className="px-5 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 text-sm font-semibold text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className={`px-6 py-2.5 rounded-xl text-sm font-bold text-white transition-all duration-200 flex items-center gap-2 shadow-md ${
              isSaving
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-[#1E2B7A] hover:bg-[#76BC21] hover:-translate-y-0.5 hover:shadow-lg"
            }`}
          >
            {isSaving ? "Saving\u2026" : "Save Changes"}
          </button>
        </div>
      </CmsCard>
    </div>
  );
}
