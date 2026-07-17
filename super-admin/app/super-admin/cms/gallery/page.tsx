"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Plus, Trash2, Loader2 } from "lucide-react";
import {
  getGalleryData,
  updateGalleryData,
  uploadCmsImage,
  GalleryData,
  GalleryCategory,
  GalleryImage,
  GalleryStatItem,
} from "@/lib/services/api";
import { CmsTabNav, CmsTab, CmsCard, CmsStatusBar, CmsPageHeader } from "@/components/cms/CmsLayout";
import { LanguageTabs } from "@/components/cms/LanguageTabs";
import { ImageUploader } from "@/components/cms/ImageUploader";
import { SeoFields } from "@/components/cms/SeoFields";
import { VisibilityOrderControl } from "@/components/cms/VisibilityOrderControl";
import { LocalizedInput, LocalizedTextarea, SectionDivider } from "@/components/cms/LocalizedFields";
import { FormField, FormInput } from "@/components/ui/FormPage";

const SECTION_DEFS = [
  { key: "hero",       label: "Hero Section",    description: "Top banner with gallery title and description" },
  { key: "stats",      label: "Gallery Stats",   description: "Numeric highlights (total photos, categories, etc.)" },
  { key: "categories", label: "Categories",      description: "Category filter tabs shown above the photo grid" },
  { key: "images",     label: "Photo Grid",      description: "The main gallery photo grid" },
];

export default function GalleryCmsPage() {
  const router = useRouter();
  const [data, setData] = useState<GalleryData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [cmsTab, setCmsTab] = useState<CmsTab>("content");
  const [langTab, setLangTab] = useState<"en" | "bn">("en");
  const [seoLangTab, setSeoLangTab] = useState<"en" | "bn">("en");
  const [status, setStatus] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    getGalleryData()
      .then(setData)
      .catch((e) => setStatus({ type: "error", text: e.message || "Failed to load data" }))
      .finally(() => setIsLoading(false));
  }, []);

  const handleSave = async () => {
    if (!data) return;
    setIsSaving(true);
    setStatus(null);
    try {
      const result = await updateGalleryData(data); setData(result);
      setStatus({ type: "success", text: "Gallery content saved successfully!" });
      setTimeout(() => setStatus(null), 4000);
    } catch (e: any) {
      setStatus({ type: "error", text: e.message || "Save failed" });
    } finally {
      setIsSaving(false);
    }
  };

  const set = useCallback((updater: (d: GalleryData) => GalleryData) => {
    setData((prev) => (prev ? updater(prev) : prev));
  }, []);

  const handleImageUpload = async (base64: string) => uploadCmsImage(base64);

  const nextImageId = () => (data?.images.reduce((max, img) => (img.id > max ? img.id : max), 0) ?? 0) + 1;

  if (isLoading) {
    return (
      <div className="flex h-[400px] items-center justify-center gap-3">
        <Loader2 className="h-8 w-8 animate-spin text-[#1E2B7A]" />
        <p className="text-sm text-gray-500">Loading Gallery content…</p>
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
        title="Gallery CMS"
        description="Manage photo categories, images, stats, and hero section"
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
                <SectionDivider title="Hero Section" description="Banner at the top of the Gallery page" />
                <ImageUploader label="Hero Background Image" value={data.hero.image || ""}
                  onChange={(url) => set((d) => ({ ...d, hero: { ...d.hero, image: url } }))}
                  onUpload={handleImageUpload} />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <LocalizedInput label="Hero Title" value={data.hero.title} activeTab={langTab}
                    onChange={(v) => set((d) => ({ ...d, hero: { ...d.hero, title: v } }))}
                    placeholder={{ en: "Our Gallery", bn: "আমাদের গ্যালারি" }} required />
                  <LocalizedInput label="Hero Subtitle" value={data.hero.subtitle} activeTab={langTab}
                    onChange={(v) => set((d) => ({ ...d, hero: { ...d.hero, subtitle: v } }))}
                    placeholder={{ en: "Moments captured…", bn: "ধারণ করা মুহূর্ত…" }} />
                </div>
                <LocalizedTextarea label="Hero Description" value={data.hero.description} activeTab={langTab}
                  onChange={(v) => set((d) => ({ ...d, hero: { ...d.hero, description: v } }))}
                  placeholder={{ en: "A visual journey…", bn: "একটি দৃশ্যমান যাত্রা…" }} rows={3} />
              </div>

              <hr className="border-gray-100 dark:border-gray-800" />

              {/* Gallery Stats */}
              <div className="space-y-4">
                <SectionDivider title="Gallery Statistics" description="Highlight numbers shown above or below the gallery" />
                <LocalizedInput label="Stats Section Title" value={data.stats.title} activeTab={langTab}
                  onChange={(v) => set((d) => ({ ...d, stats: { ...d.stats, title: v } }))}
                  placeholder={{ en: "Gallery Highlights", bn: "গ্যালারি হাইলাইট" }} />
                <div className="space-y-3">
                  {data.stats.items.map((item, i) => (
                    <div key={i} className="rounded-xl border border-gray-100 dark:border-gray-800 p-4 space-y-3 bg-gray-50/50 dark:bg-gray-800/30">
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-bold text-gray-500 uppercase tracking-wide">Stat #{i + 1}</span>
                        <button type="button" onClick={() => set((d) => ({ ...d, stats: { ...d.stats, items: d.stats.items.filter((_, idx) => idx !== i) } }))}
                          className="flex h-7 w-7 items-center justify-center rounded-lg border border-red-200 text-red-500 hover:bg-red-50 transition-colors">
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <FormField label="Number / Value">
                          <FormInput value={item.number} placeholder="500+"
                            onChange={(e) => {
                              const updated = [...data.stats.items];
                              updated[i] = { ...item, number: e.target.value };
                              set((d) => ({ ...d, stats: { ...d.stats, items: updated } }));
                            }} />
                        </FormField>
                        <LocalizedInput label="Label" value={item.label} activeTab={langTab}
                          onChange={(v) => {
                            const updated = [...data.stats.items];
                            updated[i] = { ...item, label: v };
                            set((d) => ({ ...d, stats: { ...d.stats, items: updated } }));
                          }}
                          placeholder={{ en: "Photos", bn: "ছবি" }} />
                      </div>
                    </div>
                  ))}
                  <button type="button"
                    onClick={() => set((d) => ({ ...d, stats: { ...d.stats, items: [...d.stats.items, { number: "100+", label: { en: "New Stat", bn: "নতুন পরিসংখ্যান" } }] } }))}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl border border-dashed border-gray-300 dark:border-gray-600 text-sm text-gray-500 hover:border-[#1E2B7A] hover:text-[#1E2B7A] transition-colors">
                    <Plus className="h-4 w-4" /> Add Stat
                  </button>
                </div>
              </div>

              <hr className="border-gray-100 dark:border-gray-800" />

              {/* Categories */}
              <div className="space-y-4">
                <SectionDivider title="Photo Categories" description="Filter tabs shown above the gallery grid — each image belongs to a category" />
                <div className="space-y-3">
                  {data.categories.map((cat, i) => (
                    <div key={i} className="rounded-xl border border-gray-100 dark:border-gray-800 p-4 space-y-3 bg-gray-50/50 dark:bg-gray-800/30">
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-bold text-gray-500 uppercase tracking-wide">Category #{i + 1}</span>
                        <button type="button" onClick={() => set((d) => ({ ...d, categories: d.categories.filter((_, idx) => idx !== i) }))}
                          className="flex h-7 w-7 items-center justify-center rounded-lg border border-red-200 text-red-500 hover:bg-red-50 transition-colors">
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <FormField label="Category ID (slug)" required>
                          <FormInput value={cat.id} placeholder="facilities"
                            onChange={(e) => {
                              const updated = [...data.categories];
                              updated[i] = { ...cat, id: e.target.value };
                              set((d) => ({ ...d, categories: updated }));
                            }} />
                        </FormField>
                        <LocalizedInput label="Title" value={cat.title} activeTab={langTab}
                          onChange={(v) => {
                            const updated = [...data.categories];
                            updated[i] = { ...cat, title: v };
                            set((d) => ({ ...d, categories: updated }));
                          }}
                          placeholder={{ en: "Facilities", bn: "সুবিধাসমূহ" }} />
                        <LocalizedInput label="Description" value={cat.description} activeTab={langTab}
                          onChange={(v) => {
                            const updated = [...data.categories];
                            updated[i] = { ...cat, description: v };
                            set((d) => ({ ...d, categories: updated }));
                          }}
                          placeholder={{ en: "Our facilities…", bn: "আমাদের সুবিধাসমূহ…" }} />
                      </div>
                    </div>
                  ))}
                  <button type="button"
                    onClick={() => set((d) => ({ ...d, categories: [...d.categories, { id: `category-${d.categories.length + 1}`, title: { en: "New Category", bn: "নতুন বিভাগ" }, description: { en: "Description…", bn: "বিবরণ…" } }] }))}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl border border-dashed border-gray-300 dark:border-gray-600 text-sm text-gray-500 hover:border-[#1E2B7A] hover:text-[#1E2B7A] transition-colors">
                    <Plus className="h-4 w-4" /> Add Category
                  </button>
                </div>
              </div>

              <hr className="border-gray-100 dark:border-gray-800" />

              {/* Images */}
              <div className="space-y-4">
                <SectionDivider title="Gallery Images" description="Photos displayed in the gallery grid — assign each to a category" />
                <div className="space-y-3">
                  {data.images.map((img, i) => (
                    <div key={i} className="rounded-xl border border-gray-100 dark:border-gray-800 p-4 space-y-3 bg-gray-50/50 dark:bg-gray-800/30">
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-bold text-gray-500 uppercase tracking-wide">Image #{i + 1}</span>
                        <button type="button" onClick={() => set((d) => ({ ...d, images: d.images.filter((_, idx) => idx !== i) }))}
                          className="flex h-7 w-7 items-center justify-center rounded-lg border border-red-200 text-red-500 hover:bg-red-50 transition-colors">
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <ImageUploader label="Photo" value={img.src}
                          onChange={(url) => {
                            const updated = [...data.images];
                            updated[i] = { ...img, src: url };
                            set((d) => ({ ...d, images: updated }));
                          }}
                          onUpload={handleImageUpload} />
                        <div className="space-y-3">
                          <FormField label="Category">
                            <select value={img.category}
                              onChange={(e) => {
                                const updated = [...data.images];
                                updated[i] = { ...img, category: e.target.value };
                                set((d) => ({ ...d, images: updated }));
                              }}
                              className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-3.5 py-2.5 text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-[#1E2B7A]/20">
                              {data.categories.map((c) => (
                                <option key={c.id} value={c.id}>{c.title.en}</option>
                              ))}
                            </select>
                          </FormField>
                          <LocalizedInput label="Image Title" value={img.title} activeTab={langTab}
                            onChange={(v) => {
                              const updated = [...data.images];
                              updated[i] = { ...img, title: v };
                              set((d) => ({ ...d, images: updated }));
                            }}
                            placeholder={{ en: "Photo title…", bn: "ছবির শিরোনাম…" }} />
                        </div>
                      </div>
                    </div>
                  ))}
                  <button type="button"
                    onClick={() => set((d) => ({ ...d, images: [...d.images, { id: nextImageId(), category: d.categories[0]?.id ?? "all", src: "", title: { en: "New Photo", bn: "নতুন ছবি" }, description: { en: "", bn: "" } }] }))}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl border border-dashed border-gray-300 dark:border-gray-600 text-sm text-gray-500 hover:border-[#1E2B7A] hover:text-[#1E2B7A] transition-colors">
                    <Plus className="h-4 w-4" /> Add Image
                  </button>
                </div>
              </div>
            </>
          )}

          {cmsTab === "visibility" && (
            <div className="space-y-4">
              <SectionDivider title="Section Visibility & Display Order" description="Show or hide gallery sections and set their rendering order" />
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
