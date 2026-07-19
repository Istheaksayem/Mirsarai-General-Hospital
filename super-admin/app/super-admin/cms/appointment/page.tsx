"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Plus, Trash2, Loader2, GripVertical } from "lucide-react";
import {
  getAppointmentPageData,
  updateAppointmentPageData,
  uploadCmsImage,
  AppointmentPageData,
  AppointmentPageFeatureCard,
} from "@/lib/services/api";
import { CmsTabNav, CmsTab, CmsCard, CmsStatusBar, CmsPageHeader } from "@/components/cms/CmsLayout";
import { LanguageTabs } from "@/components/cms/LanguageTabs";
import { ImageUploader } from "@/components/cms/ImageUploader";
import { SeoFields } from "@/components/cms/SeoFields";
import { VisibilityOrderControl } from "@/components/cms/VisibilityOrderControl";
import { LocalizedInput, LocalizedTextarea, SectionDivider } from "@/components/cms/LocalizedFields";
import { FormField, FormInput } from "@/components/ui/FormPage";

const SECTION_DEFS = [
  { key: "hero",     label: "Hero Section",     description: "Top banner with page title and background image" },
  { key: "features", label: "Features Strip",   description: "Cards highlighting key benefits" },
  { key: "sidebar",  label: "Sidebar",          description: "Why Choose Us, Emergency Banner & Contact Card" },
  { key: "form",     label: "Booking Form",      description: "Form header & disclaimer" },
];

const EMPTY_FEATURE: AppointmentPageFeatureCard = {
  icon: "FaHospital",
  title: { en: "Feature Title", bn: "বৈশিষ্ট্যের শিরোনাম" },
  description: { en: "Feature description goes here.", bn: "বৈশিষ্ট্যের বিবরণ এখানে লিখুন।" },
};

const ICON_OPTIONS = [
  { value: "FaHospital", label: "🏥 Hospital" },
  { value: "MdVerified", label: "✅ Verified" },
  { value: "FaShieldAlt", label: "🛡️ Shield" },
  { value: "FaHeadset", label: "🎧 Headset" },
  { value: "FaUserMd", label: "👨‍⚕️ Doctor" },
  { value: "FaAmbulance", label: "🚑 Ambulance" },
  { value: "FaClock", label: "🕐 Clock" },
  { value: "FaHeartbeat", label: "💓 Heartbeat" },
];

export default function AppointmentCmsPage() {
  const router = useRouter();
  const [data, setData] = useState<AppointmentPageData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [cmsTab, setCmsTab] = useState<CmsTab>("content");
  const [langTab, setLangTab] = useState<"en" | "bn">("en");
  const [seoLangTab, setSeoLangTab] = useState<"en" | "bn">("en");
  const [status, setStatus] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    getAppointmentPageData()
      .then(setData)
      .catch((e) => setStatus({ type: "error", text: e.message || "Failed to load data" }))
      .finally(() => setIsLoading(false));
  }, []);

  const handleSave = async () => {
    if (!data) return;
    setIsSaving(true);
    setStatus(null);
    try {
      const result = await updateAppointmentPageData(data);
      setData(result);
      setStatus({ type: "success", text: "Appointment page content saved successfully!" });
      setTimeout(() => setStatus(null), 4000);
    } catch (e: any) {
      setStatus({ type: "error", text: e.message || "Save failed" });
    } finally {
      setIsSaving(false);
    }
  };

  const set = useCallback((updater: (d: AppointmentPageData) => AppointmentPageData) => {
    setData((prev) => (prev ? updater(prev) : prev));
  }, []);

  const handleImageUpload = async (base64: string) => uploadCmsImage(base64);

  const addFeature = () =>
    set((d) => ({
      ...d,
      features: [...d.features, { ...EMPTY_FEATURE, icon: "FaHospital" }],
    }));

  const removeFeature = (i: number) =>
    set((d) => ({ ...d, features: d.features.filter((_, idx) => idx !== i) }));

  const updateFeature = (i: number, updated: Partial<AppointmentPageFeatureCard>) =>
    set((d) => {
      const features = [...d.features];
      features[i] = { ...features[i], ...updated };
      return { ...d, features };
    });

  const addWhyChooseItem = () =>
    set((d) => ({
      ...d,
      whyChooseUs: {
        ...d.whyChooseUs,
        items: [...d.whyChooseUs.items, { en: "New item", bn: "নতুন আইটেম" }],
      },
    }));

  const removeWhyChooseItem = (i: number) =>
    set((d) => ({
      ...d,
      whyChooseUs: {
        ...d.whyChooseUs,
        items: d.whyChooseUs.items.filter((_, idx) => idx !== i),
      },
    }));

  const updateWhyChooseItem = (i: number, value: { en: string; bn: string }) =>
    set((d) => {
      const items = [...d.whyChooseUs.items];
      items[i] = value;
      return { ...d, whyChooseUs: { ...d.whyChooseUs, items } };
    });

  if (isLoading) {
    return (
      <div className="flex h-[400px] items-center justify-center gap-3">
        <Loader2 className="h-8 w-8 animate-spin text-[#1E2B7A]" />
        <p className="text-sm text-gray-500">Loading Appointment page content…</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="rounded-2xl border border-red-100 bg-red-50 p-6 text-center text-red-600">
        <p className="font-semibold">Error Loading Content</p>
        <p className="text-sm mt-1">{status?.text}</p>
        <button onClick={() => window.location.reload()} className="mt-4 px-4 py-2 bg-red-600 text-white rounded-xl text-sm">
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-10">
      <CmsPageHeader
        title="Appointment Page CMS"
        description="Edit hero, features, sidebar cards, form section, and disclaimer"
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

          {/* ── CONTENT TAB ─────────────────────────────────────── */}
          {cmsTab === "content" && (
            <>
              <div className="flex items-center justify-between flex-wrap gap-3">
                <SectionDivider title="Content Language" description="Switch between English and Bangla" />
                <LanguageTabs activeTab={langTab} onTabChange={setLangTab} />
              </div>

              {/* Hero */}
              <div className="space-y-4">
                <SectionDivider title="Hero Section" description="Banner displayed at the top of the Appointment page" />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <LocalizedInput
                    label="Hero Title"
                    value={data.hero.title}
                    activeTab={langTab}
                    onChange={(v) => set((d) => ({ ...d, hero: { ...d.hero, title: v } }))}
                    placeholder={{ en: "Book Appointment", bn: "অ্যাপয়েন্টমেন্ট বুক করুন" }}
                    required
                  />
                  <LocalizedInput
                    label="Hero Subtitle"
                    value={data.hero.subtitle}
                    activeTab={langTab}
                    onChange={(v) => set((d) => ({ ...d, hero: { ...d.hero, subtitle: v } }))}
                    placeholder={{ en: "APPOINTMENT", bn: "অ্যাপয়েন্টমেন্ট" }}
                  />
                </div>
                <LocalizedTextarea
                  label="Hero Description"
                  value={data.hero.description}
                  activeTab={langTab}
                  onChange={(v) => set((d) => ({ ...d, hero: { ...d.hero, description: v } }))}
                  placeholder={{ en: "Schedule your visit with our specialist doctors.", bn: "আমাদের বিশেষজ্ঞ ডাক্তারদের সাথে আপনার সফর নির্ধারণ করুন।" }}
                  rows={3}
                />
                <ImageUploader
                  label="Hero Background Image"
                  value={data.hero.image}
                  onChange={(url) => set((d) => ({ ...d, hero: { ...d.hero, image: url } }))}
                  onUpload={handleImageUpload}
                  helpText="Background image for the hero section (recommended: 1920×600px)"
                />
              </div>

              <hr className="border-gray-100 dark:border-gray-800" />

              {/* Features */}
              <div className="space-y-4">
                <SectionDivider
                  title={`Features Strip (${data.features.length})`}
                  description="Benefit cards shown below the hero — each with icon, title, and description"
                />
                <div className="space-y-4">
                  {data.features.map((feature, i) => (
                    <div
                      key={i}
                      className="rounded-xl border border-gray-100 dark:border-gray-800 p-5 space-y-4 bg-gray-50/50 dark:bg-gray-800/30"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <GripVertical className="h-4 w-4 text-gray-300" />
                          <span className="text-xs font-bold text-gray-500 uppercase tracking-wide">
                            Feature #{i + 1}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeFeature(i)}
                          className="flex h-7 w-7 items-center justify-center rounded-lg border border-red-200 text-red-500 hover:bg-red-50 transition-colors"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="space-y-1.5">
                          <label className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">
                            Icon
                          </label>
                          <select
                            value={feature.icon}
                            onChange={(e) => updateFeature(i, { icon: e.target.value })}
                            className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2.5 text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-[#1E2B7A]/20 focus:border-[#1E2B7A]"
                          >
                            {ICON_OPTIONS.map((opt) => (
                              <option key={opt.value} value={opt.value}>{opt.label}</option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <LocalizedInput
                          label="Title"
                          value={feature.title}
                          activeTab={langTab}
                          onChange={(v) => updateFeature(i, { title: v })}
                          placeholder={{ en: "Expert Specialists", bn: "বিশেষজ্ঞ চিকিৎসক" }}
                        />
                        <LocalizedTextarea
                          label="Description"
                          value={feature.description}
                          activeTab={langTab}
                          onChange={(v) => updateFeature(i, { description: v })}
                          placeholder={{ en: "Board-certified doctors across all departments.", bn: "সব বিভাগে বোর্ড-সার্টিফাইড ডাক্তার।" }}
                          rows={2}
                        />
                      </div>
                    </div>
                  ))}

                  <button
                    type="button"
                    onClick={addFeature}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-dashed border-gray-300 dark:border-gray-600 text-sm text-gray-500 hover:border-[#1E2B7A] hover:text-[#1E2B7A] transition-colors w-full justify-center"
                  >
                    <Plus className="h-4 w-4" /> Add Feature
                  </button>
                </div>
              </div>

              <hr className="border-gray-100 dark:border-gray-800" />

              {/* Why Choose Us */}
              <div className="space-y-4">
                <SectionDivider title="Why Choose Us" description="Sidebar card with a title and checklist items" />
                <LocalizedInput
                  label="Section Title"
                  value={data.whyChooseUs.title}
                  activeTab={langTab}
                  onChange={(v) => set((d) => ({ ...d, whyChooseUs: { ...d.whyChooseUs, title: v } }))}
                  placeholder={{ en: "Why Choose Us?", bn: "কেন আমাদের বেছে নেবেন?" }}
                  required
                />
                <div className="space-y-3">
                  <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">
                    Checklist Items ({data.whyChooseUs.items.length})
                  </p>
                  {data.whyChooseUs.items.map((item, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <input
                          type="text"
                          value={item.en}
                          onChange={(e) => updateWhyChooseItem(i, { ...item, en: e.target.value })}
                          placeholder="English text"
                          className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-[#1E2B7A]/20 focus:border-[#1E2B7A]"
                        />
                        <input
                          type="text"
                          value={item.bn}
                          onChange={(e) => updateWhyChooseItem(i, { ...item, bn: e.target.value })}
                          placeholder="বাংলা টেক্সট"
                          className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-[#1E2B7A]/20 focus:border-[#1E2B7A]"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => removeWhyChooseItem(i)}
                        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-red-200 text-red-500 hover:bg-red-50 transition-colors"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={addWhyChooseItem}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl border border-dashed border-gray-300 dark:border-gray-600 text-sm text-gray-500 hover:border-[#1E2B7A] hover:text-[#1E2B7A] transition-colors w-full justify-center"
                  >
                    <Plus className="h-4 w-4" /> Add Item
                  </button>
                </div>
              </div>

              <hr className="border-gray-100 dark:border-gray-800" />

              {/* Emergency Banner */}
              <div className="space-y-4">
                <SectionDivider title="Emergency Banner" description="Red sidebar banner with emergency contact info" />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <LocalizedInput
                    label="Title"
                    value={data.emergencyBanner.title}
                    activeTab={langTab}
                    onChange={(v) => set((d) => ({ ...d, emergencyBanner: { ...d.emergencyBanner, title: v } }))}
                    placeholder={{ en: "🚨 Emergency?", bn: "🚨 জরুরি?" }}
                  />
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      value={data.emergencyBanner.phone}
                      onChange={(e) => set((d) => ({ ...d, emergencyBanner: { ...d.emergencyBanner, phone: e.target.value } }))}
                      placeholder="+01969997799"
                      className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2.5 text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-[#1E2B7A]/20 focus:border-[#1E2B7A]"
                    />
                  </div>
                </div>
                <LocalizedTextarea
                  label="Description"
                  value={data.emergencyBanner.description}
                  activeTab={langTab}
                  onChange={(v) => set((d) => ({ ...d, emergencyBanner: { ...d.emergencyBanner, description: v } }))}
                  placeholder={{ en: "Do not use this form. Call us directly.", bn: "এই ফর্ম ব্যবহার করবেন না। সরাসরি কল করুন।" }}
                  rows={2}
                />
                <LocalizedInput
                  label="Button Text"
                  value={data.emergencyBanner.buttonText}
                  activeTab={langTab}
                  onChange={(v) => set((d) => ({ ...d, emergencyBanner: { ...d.emergencyBanner, buttonText: v } }))}
                  placeholder={{ en: "Call Emergency: +01969997799", bn: "জরুরি কল: +০১৯৬৯৯৯৭৭৯৯" }}
                />
              </div>

              <hr className="border-gray-100 dark:border-gray-800" />

              {/* Contact Card */}
              <div className="space-y-4">
                <SectionDivider title="Contact Card" description="Sidebar card with contact information" />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <LocalizedInput
                    label="Title"
                    value={data.contactCard.title}
                    activeTab={langTab}
                    onChange={(v) => set((d) => ({ ...d, contactCard: { ...d.contactCard, title: v } }))}
                    placeholder={{ en: "Need Help?", bn: "সাহায্য প্রয়োজন?" }}
                  />
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      value={data.contactCard.phone}
                      onChange={(e) => set((d) => ({ ...d, contactCard: { ...d.contactCard, phone: e.target.value } }))}
                      placeholder="+01969997799"
                      className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2.5 text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-[#1E2B7A]/20 focus:border-[#1E2B7A]"
                    />
                  </div>
                </div>
                <LocalizedTextarea
                  label="Description"
                  value={data.contactCard.description}
                  activeTab={langTab}
                  onChange={(v) => set((d) => ({ ...d, contactCard: { ...d.contactCard, description: v } }))}
                  placeholder={{ en: "Our team is available Mon–Sat, 8AM–8PM", bn: "আমাদের টিম সোম–শনি, সকাল ৮টা–রাত ৮টা পর্যন্ত উপলব্ধ" }}
                  rows={2}
                />
              </div>

              <hr className="border-gray-100 dark:border-gray-800" />

              {/* Form Section */}
              <div className="space-y-4">
                <SectionDivider title="Booking Form Section" description="Header text displayed above the booking form" />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <LocalizedInput
                    label="Form Title"
                    value={data.formSection.title}
                    activeTab={langTab}
                    onChange={(v) => set((d) => ({ ...d, formSection: { ...d.formSection, title: v } }))}
                    placeholder={{ en: "Fill in Your Details", bn: "আপনার তথ্য পূরণ করুন" }}
                    required
                  />
                </div>
                <LocalizedTextarea
                  label="Form Description"
                  value={data.formSection.description}
                  activeTab={langTab}
                  onChange={(v) => set((d) => ({ ...d, formSection: { ...d.formSection, description: v } }))}
                  placeholder={{ en: "Complete the form below to book your appointment.", bn: "আপনার অ্যাপয়েন্টমেন্ট বুক করতে নিচের ফর্মটি পূরণ করুন।" }}
                  rows={2}
                />
              </div>

              <hr className="border-gray-100 dark:border-gray-800" />

              {/* Disclaimer */}
              <div className="space-y-4">
                <SectionDivider title="Disclaimer" description="Footer disclaimer text" />
                <LocalizedTextarea
                  label="Disclaimer Text"
                  value={data.disclaimer}
                  activeTab={langTab}
                  onChange={(v) => set((d) => ({ ...d, disclaimer: v }))}
                  placeholder={{ en: "All appointments are subject to doctor availability.", bn: "সকল অ্যাপয়েন্টমেন্ট ডাক্তারের প্রাপ্যতা সাপেক্ষে।" }}
                  rows={3}
                />
              </div>
            </>
          )}

          {/* ── VISIBILITY TAB ───────────────────────────────────── */}
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

          {/* ── SEO TAB ─────────────────────────────────────────── */}
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

        {/* Footer actions */}
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
            className={`px-6 py-2.5 rounded-xl text-sm font-bold text-white flex items-center gap-2 shadow-md transition-all duration-200 ${
              isSaving ? "bg-gray-400 cursor-not-allowed" : "bg-[#1E2B7A] hover:bg-[#76BC21] hover:-translate-y-0.5 hover:shadow-lg"
            }`}
          >
            💾 {isSaving ? "Saving…" : "Save Changes"}
          </button>
        </div>
      </CmsCard>
    </div>
  );
}
