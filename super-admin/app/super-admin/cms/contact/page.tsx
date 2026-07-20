"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import {
  getContactPageData,
  updateContactPageData,
  uploadCmsImage,
  ContactPageData,
} from "@/lib/services/api";
import { CmsTabNav, CmsTab, CmsCard, CmsStatusBar, CmsPageHeader } from "@/components/cms/CmsLayout";
import { LanguageTabs } from "@/components/cms/LanguageTabs";
import { ImageUploader } from "@/components/cms/ImageUploader";
import { SeoFields } from "@/components/cms/SeoFields";
import { VisibilityOrderControl } from "@/components/cms/VisibilityOrderControl";
import { LocalizedInput, LocalizedTextarea, SectionDivider } from "@/components/cms/LocalizedFields";

const SECTION_DEFS = [
  { key: "hero",        label: "Hero Section",          description: "Top banner with page title and background image" },
  { key: "contactInfo", label: "Contact Information",   description: "Address, hotline, and email cards" },
  { key: "form",        label: "Contact Form",           description: "Form header, fields, and submit button" },
];

export default function ContactCmsPage() {
  const router = useRouter();
  const [data, setData] = useState<ContactPageData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [cmsTab, setCmsTab] = useState<CmsTab>("content");
  const [langTab, setLangTab] = useState<"en" | "bn">("en");
  const [seoLangTab, setSeoLangTab] = useState<"en" | "bn">("en");
  const [status, setStatus] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    getContactPageData()
      .then(setData)
      .catch((e) => setStatus({ type: "error", text: e.message || "Failed to load data" }))
      .finally(() => setIsLoading(false));
  }, []);

  const handleSave = async () => {
    if (!data) return;
    setIsSaving(true);
    setStatus(null);
    try {
      const result = await updateContactPageData(data);
      setData(result);
      setStatus({ type: "success", text: "Contact page content saved successfully!" });
      setTimeout(() => setStatus(null), 4000);
    } catch (e: any) {
      setStatus({ type: "error", text: e.message || "Save failed" });
    } finally {
      setIsSaving(false);
    }
  };

  const set = useCallback((updater: (d: ContactPageData) => ContactPageData) => {
    setData((prev) => (prev ? updater(prev) : prev));
  }, []);

  const handleImageUpload = async (base64: string) => uploadCmsImage(base64);

  if (isLoading) {
    return (
      <div className="flex h-[400px] items-center justify-center gap-3">
        <Loader2 className="h-8 w-8 animate-spin text-[#1E2B7A]" />
        <p className="text-sm text-gray-500">Loading Contact page content…</p>
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
        title="Contact Page CMS"
        description="Edit hero, contact information cards, form fields, and SEO"
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
                <SectionDivider title="Hero Section" description="Banner displayed at the top of the Contact page" />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <LocalizedInput
                    label="Hero Title"
                    value={data.hero.title}
                    activeTab={langTab}
                    onChange={(v) => set((d) => ({ ...d, hero: { ...d.hero, title: v } }))}
                    placeholder={{ en: "Get In Touch", bn: "যোগাযোগ করুন" }}
                    required
                  />
                  <LocalizedInput
                    label="Hero Subtitle / Badge"
                    value={data.hero.subtitle}
                    activeTab={langTab}
                    onChange={(v) => set((d) => ({ ...d, hero: { ...d.hero, subtitle: v } }))}
                    placeholder={{ en: "CONTACT US", bn: "যোগাযোগ" }}
                  />
                </div>
                <LocalizedTextarea
                  label="Hero Description"
                  value={data.hero.description}
                  activeTab={langTab}
                  onChange={(v) => set((d) => ({ ...d, hero: { ...d.hero, description: v } }))}
                  placeholder={{ en: "We are here to provide you with the best medical care…", bn: "আমরা আপনাকে সর্বোত্তম চিকিৎসা সেবা প্রদান করতে এখানে আছি…" }}
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

              {/* Contact Info */}
              <div className="space-y-4">
                <SectionDivider title="Contact Information" description="Section title and the three info cards" />

                <LocalizedInput
                  label="Section Title"
                  value={data.contactInfo.title}
                  activeTab={langTab}
                  onChange={(v) => set((d) => ({ ...d, contactInfo: { ...d.contactInfo, title: v } }))}
                  placeholder={{ en: "Contact Information", bn: "যোগাযোগের তথ্য" }}
                  required
                />

                <div className="rounded-xl border border-gray-100 dark:border-gray-800 p-5 space-y-4 bg-gray-50/50 dark:bg-gray-800/30">
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-wide">Address Card</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <LocalizedInput
                      label="Card Label"
                      value={data.contactInfo.addressCard.label}
                      activeTab={langTab}
                      onChange={(v) => set((d) => ({ ...d, contactInfo: { ...d.contactInfo, addressCard: { ...d.contactInfo.addressCard, label: v } } }))}
                      placeholder={{ en: "Our Address", bn: "আমাদের ঠিকানা" }}
                    />
                    <LocalizedInput
                      label="Hospital Name"
                      value={data.contactInfo.addressCard.name}
                      activeTab={langTab}
                      onChange={(v) => set((d) => ({ ...d, contactInfo: { ...d.contactInfo, addressCard: { ...d.contactInfo.addressCard, name: v } } }))}
                      placeholder={{ en: "Mirsarai General Hospital…", bn: "মীরসরাই জেনারেল হাসপাতাল…" }}
                    />
                  </div>
                  <LocalizedTextarea
                    label="Location / Address"
                    value={data.contactInfo.addressCard.location}
                    activeTab={langTab}
                    onChange={(v) => set((d) => ({ ...d, contactInfo: { ...d.contactInfo, addressCard: { ...d.contactInfo.addressCard, location: v } } }))}
                    placeholder={{ en: "Opposite the Police Station…", bn: "পুলিশ স্টেশনের বিপরীতে…" }}
                    rows={2}
                  />
                </div>

                <div className="rounded-xl border border-gray-100 dark:border-gray-800 p-5 space-y-4 bg-gray-50/50 dark:bg-gray-800/30">
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-wide">Hotline Card</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <LocalizedInput
                      label="Card Label"
                      value={data.contactInfo.hotlineCard.label}
                      activeTab={langTab}
                      onChange={(v) => set((d) => ({ ...d, contactInfo: { ...d.contactInfo, hotlineCard: { ...d.contactInfo.hotlineCard, label: v } } }))}
                      placeholder={{ en: "24/7 Hotline", bn: "২৪/৭ হটলাইন" }}
                    />
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">Phone Number</label>
                      <input
                        type="tel"
                        value={data.contactInfo.hotlineCard.number}
                        onChange={(e) => set((d) => ({ ...d, contactInfo: { ...d.contactInfo, hotlineCard: { ...d.contactInfo.hotlineCard, number: e.target.value } } }))}
                        placeholder="01969-997799"
                        className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2.5 text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-[#1E2B7A]/20 focus:border-[#1E2B7A]"
                      />
                    </div>
                  </div>
                  <LocalizedInput
                    label="Number Label (shown after the number)"
                    value={data.contactInfo.hotlineCard.numberLabel}
                    activeTab={langTab}
                    onChange={(v) => set((d) => ({ ...d, contactInfo: { ...d.contactInfo, hotlineCard: { ...d.contactInfo.hotlineCard, numberLabel: v } } }))}
                    placeholder={{ en: "(English)", bn: "(ইংরেজি)" }}
                  />
                </div>

                <div className="rounded-xl border border-gray-100 dark:border-gray-800 p-5 space-y-4 bg-gray-50/50 dark:bg-gray-800/30">
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-wide">Email Card</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <LocalizedInput
                      label="Card Label"
                      value={data.contactInfo.emailCard.label}
                      activeTab={langTab}
                      onChange={(v) => set((d) => ({ ...d, contactInfo: { ...d.contactInfo, emailCard: { ...d.contactInfo.emailCard, label: v } } }))}
                      placeholder={{ en: "Email Address", bn: "ইমেইল ঠিকানা" }}
                    />
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">Email Address</label>
                      <input
                        type="email"
                        value={data.contactInfo.emailCard.address}
                        onChange={(e) => set((d) => ({ ...d, contactInfo: { ...d.contactInfo, emailCard: { ...d.contactInfo.emailCard, address: e.target.value } } }))}
                        placeholder="mirsaraigeneralhospital@gmail.com"
                        className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2.5 text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-[#1E2B7A]/20 focus:border-[#1E2B7A]"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <hr className="border-gray-100 dark:border-gray-800" />

              {/* Form Section */}
              <div className="space-y-4">
                <SectionDivider title="Contact Form" description="Form title, description, button text, and all field labels & placeholders" />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <LocalizedInput
                    label="Form Title"
                    value={data.form.title}
                    activeTab={langTab}
                    onChange={(v) => set((d) => ({ ...d, form: { ...d.form, title: v } }))}
                    placeholder={{ en: "Send us a Message", bn: "আমাদের একটি বার্তা পাঠান" }}
                    required
                  />
                  <LocalizedInput
                    label="Button Text"
                    value={data.form.buttonText}
                    activeTab={langTab}
                    onChange={(v) => set((d) => ({ ...d, form: { ...d.form, buttonText: v } }))}
                    placeholder={{ en: "Send Message", bn: "বার্তা পাঠান" }}
                  />
                </div>
                <LocalizedTextarea
                  label="Form Description"
                  value={data.form.description}
                  activeTab={langTab}
                  onChange={(v) => set((d) => ({ ...d, form: { ...d.form, description: v } }))}
                  placeholder={{ en: "We'd love to hear from you…", bn: "আমরা আপনার কাছ থেকে শুনতে চাই…" }}
                  rows={2}
                />

                <div className="rounded-xl border border-gray-100 dark:border-gray-800 p-5 space-y-4 bg-gray-50/50 dark:bg-gray-800/30">
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-wide">Form Fields</p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <LocalizedInput
                        label="Name Field Label"
                        value={data.form.fields.name.label}
                        activeTab={langTab}
                        onChange={(v) => set((d) => ({ ...d, form: { ...d.form, fields: { ...d.form.fields, name: { ...d.form.fields.name, label: v } } } }))}
                        placeholder={{ en: "Full Name", bn: "পুরো নাম" }}
                      />
                      <LocalizedInput
                        label="Name Field Placeholder"
                        value={data.form.fields.name.placeholder}
                        activeTab={langTab}
                        onChange={(v) => set((d) => ({ ...d, form: { ...d.form, fields: { ...d.form.fields, name: { ...d.form.fields.name, placeholder: v } } } }))}
                        placeholder={{ en: "John Doe", bn: "জন ডো" }}
                      />
                    </div>
                    <div className="space-y-3">
                      <LocalizedInput
                        label="Phone Field Label"
                        value={data.form.fields.phone.label}
                        activeTab={langTab}
                        onChange={(v) => set((d) => ({ ...d, form: { ...d.form, fields: { ...d.form.fields, phone: { ...d.form.fields.phone, label: v } } } }))}
                        placeholder={{ en: "Phone Number", bn: "ফোন নম্বর" }}
                      />
                      <LocalizedInput
                        label="Phone Field Placeholder"
                        value={data.form.fields.phone.placeholder}
                        activeTab={langTab}
                        onChange={(v) => set((d) => ({ ...d, form: { ...d.form, fields: { ...d.form.fields, phone: { ...d.form.fields.phone, placeholder: v } } } }))}
                        placeholder={{ en: "01xxxxxxxxx", bn: "০১xxxxxxxxx" }}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <LocalizedInput
                        label="Email Field Label"
                        value={data.form.fields.email.label}
                        activeTab={langTab}
                        onChange={(v) => set((d) => ({ ...d, form: { ...d.form, fields: { ...d.form.fields, email: { ...d.form.fields.email, label: v } } } }))}
                        placeholder={{ en: "Email Address (Optional)", bn: "ইমেইল ঠিকানা (ঐচ্ছিক)" }}
                      />
                      <LocalizedInput
                        label="Email Field Placeholder"
                        value={data.form.fields.email.placeholder}
                        activeTab={langTab}
                        onChange={(v) => set((d) => ({ ...d, form: { ...d.form, fields: { ...d.form.fields, email: { ...d.form.fields.email, placeholder: v } } } }))}
                        placeholder={{ en: "john@example.com", bn: "জন@উদাহরণ.কম" }}
                      />
                    </div>
                    <div className="space-y-3">
                      <LocalizedInput
                        label="Message Field Label"
                        value={data.form.fields.message.label}
                        activeTab={langTab}
                        onChange={(v) => set((d) => ({ ...d, form: { ...d.form, fields: { ...d.form.fields, message: { ...d.form.fields.message, label: v } } } }))}
                        placeholder={{ en: "Your Message", bn: "আপনার বার্তা" }}
                      />
                      <LocalizedInput
                        label="Message Field Placeholder"
                        value={data.form.fields.message.placeholder}
                        activeTab={langTab}
                        onChange={(v) => set((d) => ({ ...d, form: { ...d.form, fields: { ...d.form.fields, message: { ...d.form.fields.message, placeholder: v } } } }))}
                        placeholder={{ en: "How can we help you?", bn: "আমরা কিভাবে আপনাকে সাহায্য করতে পারি?" }}
                      />
                    </div>
                  </div>
                </div>
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
