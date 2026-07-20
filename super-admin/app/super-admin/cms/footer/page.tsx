"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Trash2, Plus } from "lucide-react";
import {
  getFooterData,
  updateFooterData,
  uploadCmsImage,
  FooterData,
} from "@/lib/services/api";
import { CmsTabNav, CmsTab, CmsCard, CmsStatusBar, CmsPageHeader } from "@/components/cms/CmsLayout";
import { LanguageTabs } from "@/components/cms/LanguageTabs";
import { ImageUploader } from "@/components/cms/ImageUploader";
import { SeoFields } from "@/components/cms/SeoFields";
import { VisibilityOrderControl } from "@/components/cms/VisibilityOrderControl";
import { LocalizedInput, LocalizedTextarea, SectionDivider } from "@/components/cms/LocalizedFields";
import { FormField, FormInput } from "@/components/ui/FormPage";

const SECTION_DEFS = [
  { key: "brand",        label: "Brand Section",            description: "Logo, description, and social media links" },
  { key: "exploreLinks", label: "Explore Links",            description: "Quick navigation links" },
  { key: "departments",  label: "Departments",              description: "Department listing" },
  { key: "contactInfo",  label: "Contact Information",      description: "Address, phone, and email" },
  { key: "emergencyCard",label: "Emergency Card",           description: "24/7 emergency contact card" },
  { key: "bottomBar",    label: "Bottom Bar",               description: "Copyright, privacy policy, terms" },
];

export default function FooterCmsPage() {
  const router = useRouter();
  const [data, setData] = useState<FooterData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [cmsTab, setCmsTab] = useState<CmsTab>("content");
  const [langTab, setLangTab] = useState<"en" | "bn">("en");
  const [seoLangTab, setSeoLangTab] = useState<"en" | "bn">("en");
  const [status, setStatus] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    getFooterData()
      .then(setData)
      .catch((e) => setStatus({ type: "error", text: e.message || "Failed to load data" }))
      .finally(() => setIsLoading(false));
  }, []);

  const set = useCallback((updater: (draft: FooterData) => FooterData) => {
    setData((prev) => prev ? updater(prev) : prev);
  }, []);

  const handleImageUpload = async (base64: string) => {
    try {
      return await uploadCmsImage(base64);
    } catch (e: any) {
      setStatus({ type: "error", text: e.message || "Image upload failed" });
      throw e;
    }
  };

  const handleSave = async () => {
    if (!data) return;
    setIsSaving(true);
    setStatus(null);
    try {
      const result = await updateFooterData(data);
      setData(result);
      setStatus({ type: "success", text: "Footer content saved successfully!" });
      setTimeout(() => setStatus(null), 4000);
    } catch (e: any) {
      setStatus({ type: "error", text: e.message || "Save failed" });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-[400px] items-center justify-center gap-3">
        <Loader2 className="h-8 w-8 animate-spin text-[#1E2B7A]" />
        <p className="text-sm text-gray-500">Loading Footer content…</p>
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
        title="Footer CMS"
        description="Manage the global footer — brand, links, contact info, emergency card, and bottom bar"
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
                <SectionDivider title="Content Language" description="Switch between English and Bangla for editing" />
                <LanguageTabs activeTab={langTab} onTabChange={setLangTab} />
              </div>

              {/* ── Brand Section ── */}
              <div className="space-y-4">
                <SectionDivider title="Brand Section" description="Logo, description text, and social media links" />
                <ImageUploader
                  label="Footer Logo"
                  value={data.brand.logo}
                  onChange={(url) => set((d) => ({ ...d, brand: { ...d.brand, logo: url } }))}
                  onUpload={handleImageUpload}
                  helpText="Hospital logo displayed in the footer brand area"
                />
                <LocalizedTextarea
                  label="Brand Description"
                  value={data.brand.description}
                  activeTab={langTab}
                  onChange={(v) => set((d) => ({ ...d, brand: { ...d.brand, description: v } }))}
                  rows={3}
                  placeholder={{ en: "Committed to providing compassionate care...", bn: "সহানুভূতিশীল সেবা..." }}
                />

                {/* Social Links */}
                <div className="space-y-3">
                  <h4 className="text-sm font-bold text-gray-700 dark:text-gray-300">Social Media Links</h4>
                  {data.brand.socialLinks.map((link, i) => (
                    <div key={i} className="rounded-xl border border-gray-100 dark:border-gray-800 p-4 space-y-3 bg-gray-50/50 dark:bg-gray-800/30">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-gray-500 uppercase tracking-wide">Link #{i + 1}</span>
                        <button
                          type="button"
                          onClick={() => set((d) => ({ ...d, brand: { ...d.brand, socialLinks: d.brand.socialLinks.filter((_, idx) => idx !== i) } }))}
                          className="flex h-7 w-7 items-center justify-center rounded-lg border border-red-200 text-red-500 hover:bg-red-50 transition-colors"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <FormField label="Platform">
                          <FormInput
                            value={link.platform}
                            onChange={(e) => {
                              const updated = [...data.brand.socialLinks];
                              updated[i] = { ...link, platform: e.target.value };
                              set((d) => ({ ...d, brand: { ...d.brand, socialLinks: updated } }));
                            }}
                            placeholder="facebook"
                          />
                        </FormField>
                        <FormField label="URL">
                          <FormInput
                            value={link.url}
                            onChange={(e) => {
                              const updated = [...data.brand.socialLinks];
                              updated[i] = { ...link, url: e.target.value };
                              set((d) => ({ ...d, brand: { ...d.brand, socialLinks: updated } }));
                            }}
                            placeholder="https://facebook.com/..."
                          />
                        </FormField>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <FormField label="Icon">
                          <FormInput
                            value={link.icon}
                            disabled
                            className="cursor-not-allowed opacity-60"
                            placeholder="FaFacebookF"
                          />
                        </FormField>
                        <FormField label="Hover Color">
                          <FormInput
                            value={link.hoverColor}
                            disabled
                            className="cursor-not-allowed opacity-60"
                            placeholder="bg-blue-500"
                          />
                        </FormField>
                      </div>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() =>
                      set((d) => ({
                        ...d,
                        brand: {
                          ...d.brand,
                          socialLinks: [...d.brand.socialLinks, { platform: "", icon: "FaFacebookF", url: "", hoverColor: "bg-blue-500" }]
                        }
                      }))
                    }
                    className="flex items-center gap-2 px-4 py-2 rounded-xl border border-dashed border-gray-300 dark:border-gray-600 text-sm text-gray-500 hover:border-[#1E2B7A] hover:text-[#1E2B7A] transition-colors"
                  >
                    <Plus className="h-4 w-4" /> Add Social Link
                  </button>
                </div>
              </div>

              <hr className="border-gray-100 dark:border-gray-800" />

              {/* ── Explore Links Section ── */}
              <div className="space-y-4">
                <SectionDivider title="Explore Links" description="Quick navigation links in the footer" />
                <LocalizedInput
                  label="Section Title"
                  value={data.exploreLinks.title}
                  activeTab={langTab}
                  onChange={(v) => set((d) => ({ ...d, exploreLinks: { ...d.exploreLinks, title: v } }))}
                  placeholder={{ en: "Explore", bn: "এক্সপ্লোর" }}
                />
                <div className="space-y-3">
                  <h4 className="text-sm font-bold text-gray-700 dark:text-gray-300">Links</h4>
                  {data.exploreLinks.links.map((link, i) => (
                    <div key={i} className="rounded-xl border border-gray-100 dark:border-gray-800 p-4 space-y-3 bg-gray-50/50 dark:bg-gray-800/30">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-gray-500 uppercase tracking-wide">Link #{i + 1}</span>
                        <button
                          type="button"
                          onClick={() => set((d) => ({ ...d, exploreLinks: { ...d.exploreLinks, links: d.exploreLinks.links.filter((_, idx) => idx !== i) } }))}
                          className="flex h-7 w-7 items-center justify-center rounded-lg border border-red-200 text-red-500 hover:bg-red-50 transition-colors"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <LocalizedInput
                          label="Label"
                          value={link.label}
                          activeTab={langTab}
                          onChange={(v) => {
                            const updated = [...data.exploreLinks.links];
                            updated[i] = { ...link, label: v };
                            set((d) => ({ ...d, exploreLinks: { ...d.exploreLinks, links: updated } }));
                          }}
                          placeholder={{ en: "Home", bn: "হোম" }}
                        />
                        <FormField label="URL">
                          <FormInput
                            value={link.href}
                            onChange={(e) => {
                              const updated = [...data.exploreLinks.links];
                              updated[i] = { ...link, href: e.target.value };
                              set((d) => ({ ...d, exploreLinks: { ...d.exploreLinks, links: updated } }));
                            }}
                            placeholder="/"
                          />
                        </FormField>
                      </div>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() =>
                      set((d) => ({
                        ...d,
                        exploreLinks: {
                          ...d.exploreLinks,
                          links: [...d.exploreLinks.links, { label: { en: "New Link", bn: "নতুন লিংক" }, href: "/" }]
                        }
                      }))
                    }
                    className="flex items-center gap-2 px-4 py-2 rounded-xl border border-dashed border-gray-300 dark:border-gray-600 text-sm text-gray-500 hover:border-[#1E2B7A] hover:text-[#1E2B7A] transition-colors"
                  >
                    <Plus className="h-4 w-4" /> Add Link
                  </button>
                </div>
              </div>

              <hr className="border-gray-100 dark:border-gray-800" />

              {/* ── Departments Section ── */}
              <div className="space-y-4">
                <SectionDivider title="Departments" description="Department listing in the footer" />
                <LocalizedInput
                  label="Section Title"
                  value={data.departments.title}
                  activeTab={langTab}
                  onChange={(v) => set((d) => ({ ...d, departments: { ...d.departments, title: v } }))}
                  placeholder={{ en: "Departments", bn: "বিভাগসমূহ" }}
                />
                <div className="space-y-3">
                  <h4 className="text-sm font-bold text-gray-700 dark:text-gray-300">Department Items</h4>
                  {data.departments.items.map((item, i) => (
                    <div key={i} className="rounded-xl border border-gray-100 dark:border-gray-800 p-4 space-y-3 bg-gray-50/50 dark:bg-gray-800/30">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-gray-500 uppercase tracking-wide">Item #{i + 1}</span>
                        <button
                          type="button"
                          onClick={() => set((d) => ({ ...d, departments: { ...d.departments, items: d.departments.items.filter((_, idx) => idx !== i) } }))}
                          className="flex h-7 w-7 items-center justify-center rounded-lg border border-red-200 text-red-500 hover:bg-red-50 transition-colors"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <LocalizedInput
                          label="Name"
                          value={item.name}
                          activeTab={langTab}
                          onChange={(v) => {
                            const updated = [...data.departments.items];
                            updated[i] = { ...item, name: v };
                            set((d) => ({ ...d, departments: { ...d.departments, items: updated } }));
                          }}
                          placeholder={{ en: "Cardiology", bn: "কার্ডিওলজি" }}
                        />
                        <FormField label="Link URL">
                          <FormInput
                            value={item.href}
                            onChange={(e) => {
                              const updated = [...data.departments.items];
                              updated[i] = { ...item, href: e.target.value };
                              set((d) => ({ ...d, departments: { ...d.departments, items: updated } }));
                            }}
                            placeholder="/departments"
                          />
                        </FormField>
                      </div>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() =>
                      set((d) => ({
                        ...d,
                        departments: {
                          ...d.departments,
                          items: [...d.departments.items, { name: { en: "New Department", bn: "নতুন বিভাগ" }, href: "/departments" }]
                        }
                      }))
                    }
                    className="flex items-center gap-2 px-4 py-2 rounded-xl border border-dashed border-gray-300 dark:border-gray-600 text-sm text-gray-500 hover:border-[#1E2B7A] hover:text-[#1E2B7A] transition-colors"
                  >
                    <Plus className="h-4 w-4" /> Add Department
                  </button>
                </div>
              </div>

              <hr className="border-gray-100 dark:border-gray-800" />

              {/* ── Contact Info Section ── */}
              <div className="space-y-4">
                <SectionDivider title="Contact Information" description="Address, phone, and email displayed in the footer" />
                <LocalizedInput
                  label="Section Title"
                  value={data.contactInfo.title}
                  activeTab={langTab}
                  onChange={(v) => set((d) => ({ ...d, contactInfo: { ...d.contactInfo, title: v } }))}
                  placeholder={{ en: "Get In Touch", bn: "যোগাযোগ করুন" }}
                />

                {/* Address */}
                <div className="rounded-xl border border-gray-100 dark:border-gray-800 p-4 space-y-3 bg-gray-50/50 dark:bg-gray-800/30">
                  <h4 className="text-sm font-bold text-gray-700 dark:text-gray-300">Address</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <FormField label="Icon">
                      <FormInput
                        value={data.contactInfo.address.icon}
                        disabled
                        className="cursor-not-allowed opacity-60"
                        placeholder="FaMapMarkerAlt"
                      />
                    </FormField>
                    <LocalizedInput
                      label="Hospital Name"
                      value={data.contactInfo.address.hospitalName}
                      activeTab={langTab}
                      onChange={(v) => set((d) => ({ ...d, contactInfo: { ...d.contactInfo, address: { ...d.contactInfo.address, hospitalName: v } } }))}
                      placeholder={{ en: "Mirsarai General Hospital", bn: "মীরসরাই জেনারেল হাসপাতাল" }}
                    />
                  </div>
                  <LocalizedTextarea
                    label="Location"
                    value={data.contactInfo.address.location}
                    activeTab={langTab}
                    onChange={(v) => set((d) => ({ ...d, contactInfo: { ...d.contactInfo, address: { ...d.contactInfo.address, location: v } } }))}
                    rows={2}
                    placeholder={{ en: "Opposite the Police Station...", bn: "পুলিশ স্টেশনের বিপরীতে..." }}
                  />
                </div>

                {/* Phone */}
                <div className="rounded-xl border border-gray-100 dark:border-gray-800 p-4 space-y-3 bg-gray-50/50 dark:bg-gray-800/30">
                  <h4 className="text-sm font-bold text-gray-700 dark:text-gray-300">Phone</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <FormField label="Icon">
                      <FormInput
                        value={data.contactInfo.phone.icon}
                        disabled
                        className="cursor-not-allowed opacity-60"
                        placeholder="FaPhoneAlt"
                      />
                    </FormField>
                    <FormField label="Phone Number">
                      <FormInput
                        value={data.contactInfo.phone.number}
                        onChange={(e) => set((d) => ({ ...d, contactInfo: { ...d.contactInfo, phone: { ...d.contactInfo.phone, number: e.target.value } } }))}
                        placeholder="+8801969-997799"
                      />
                    </FormField>
                  </div>
                </div>

                {/* Email */}
                <div className="rounded-xl border border-gray-100 dark:border-gray-800 p-4 space-y-3 bg-gray-50/50 dark:bg-gray-800/30">
                  <h4 className="text-sm font-bold text-gray-700 dark:text-gray-300">Email</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <FormField label="Icon">
                      <FormInput
                        value={data.contactInfo.email.icon}
                        disabled
                        className="cursor-not-allowed opacity-60"
                        placeholder="FaEnvelope"
                      />
                    </FormField>
                    <FormField label="Email Address">
                      <FormInput
                        value={data.contactInfo.email.address}
                        onChange={(e) => set((d) => ({ ...d, contactInfo: { ...d.contactInfo, email: { ...d.contactInfo.email, address: e.target.value } } }))}
                        placeholder="mirsaraigeneralhospital@gmail.com"
                      />
                    </FormField>
                  </div>
                </div>
              </div>

              <hr className="border-gray-100 dark:border-gray-800" />

              {/* ── Emergency Card ── */}
              <div className="space-y-4">
                <SectionDivider title="Emergency Card" description="24/7 Emergency contact card in the footer" />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <FormField label="Icon">
                    <FormInput
                      value={data.emergencyCard.icon}
                      disabled
                      className="cursor-not-allowed opacity-60"
                      placeholder="FaHeartbeat"
                    />
                  </FormField>
                  <FormField label="Phone Number">
                    <FormInput
                      value={data.emergencyCard.phoneNumber}
                      onChange={(e) => set((d) => ({ ...d, emergencyCard: { ...d.emergencyCard, phoneNumber: e.target.value } }))}
                      placeholder="+01969-997799"
                    />
                  </FormField>
                </div>
                <LocalizedInput
                  label="Label"
                  value={data.emergencyCard.label}
                  activeTab={langTab}
                  onChange={(v) => set((d) => ({ ...d, emergencyCard: { ...d.emergencyCard, label: v } }))}
                  placeholder={{ en: "24/7 Emergency", bn: "২৪/৭ জরুরি সেবা" }}
                />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <FormField label="Gradient">
                    <FormInput
                      value={data.emergencyCard.gradient}
                      disabled
                      className="cursor-not-allowed opacity-60"
                      placeholder="from-[#76BC21] to-green-600"
                    />
                  </FormField>
                  <FormField label="Badge Gradient">
                    <FormInput
                      value={data.emergencyCard.badgeGradient}
                      disabled
                      className="cursor-not-allowed opacity-60"
                      placeholder="from-white/10 to-white/5"
                    />
                  </FormField>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <FormField label="Blob Color">
                    <FormInput
                      value={data.emergencyCard.blobColor}
                      disabled
                      className="cursor-not-allowed opacity-60"
                      placeholder="bg-[#76BC21]/20"
                    />
                  </FormField>
                  <FormField label="Icon Gradient">
                    <FormInput
                      value={data.emergencyCard.iconGradient}
                      disabled
                      className="cursor-not-allowed opacity-60"
                      placeholder="from-[#76BC21] to-green-600"
                    />
                  </FormField>
                </div>
              </div>

              <hr className="border-gray-100 dark:border-gray-800" />

              {/* ── Bottom Bar ── */}
              <div className="space-y-4">
                <SectionDivider title="Bottom Bar" description="Copyright, privacy policy, and terms of service" />
                <LocalizedInput
                  label="Hospital Name"
                  value={data.bottomBar.hospitalName}
                  activeTab={langTab}
                  onChange={(v) => set((d) => ({ ...d, bottomBar: { ...d.bottomBar, hospitalName: v } }))}
                  placeholder={{ en: "Mirsarai General Hospital", bn: "মীরসরাই জেনারেল হাসপাতাল" }}
                />
                <LocalizedTextarea
                  label="Rights Reserved Text"
                  value={data.bottomBar.rightsText}
                  activeTab={langTab}
                  onChange={(v) => set((d) => ({ ...d, bottomBar: { ...d.bottomBar, rightsText: v } }))}
                  rows={1}
                  placeholder={{ en: "All Rights Reserved.", bn: "সর্বস্বত্ব সংরক্ষিত।" }}
                />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="rounded-xl border border-gray-100 dark:border-gray-800 p-4 space-y-3 bg-gray-50/50 dark:bg-gray-800/30">
                    <h4 className="text-sm font-bold text-gray-700 dark:text-gray-300">Privacy Policy</h4>
                    <LocalizedInput
                      label="Label"
                      value={data.bottomBar.privacyPolicy.label}
                      activeTab={langTab}
                      onChange={(v) => set((d) => ({ ...d, bottomBar: { ...d.bottomBar, privacyPolicy: { ...d.bottomBar.privacyPolicy, label: v } } }))}
                      placeholder={{ en: "Privacy Policy", bn: "গোপনীয়তা নীতি" }}
                    />
                    <FormField label="URL">
                      <FormInput
                        value={data.bottomBar.privacyPolicy.href}
                        onChange={(e) => set((d) => ({ ...d, bottomBar: { ...d.bottomBar, privacyPolicy: { ...d.bottomBar.privacyPolicy, href: e.target.value } } }))}
                        placeholder="/privacy"
                      />
                    </FormField>
                  </div>
                  <div className="rounded-xl border border-gray-100 dark:border-gray-800 p-4 space-y-3 bg-gray-50/50 dark:bg-gray-800/30">
                    <h4 className="text-sm font-bold text-gray-700 dark:text-gray-300">Terms of Service</h4>
                    <LocalizedInput
                      label="Label"
                      value={data.bottomBar.termsOfService.label}
                      activeTab={langTab}
                      onChange={(v) => set((d) => ({ ...d, bottomBar: { ...d.bottomBar, termsOfService: { ...d.bottomBar.termsOfService, label: v } } }))}
                      placeholder={{ en: "Terms of Service", bn: "সেবার শর্তাবলী" }}
                    />
                    <FormField label="URL">
                      <FormInput
                        value={data.bottomBar.termsOfService.href}
                        onChange={(e) => set((d) => ({ ...d, bottomBar: { ...d.bottomBar, termsOfService: { ...d.bottomBar.termsOfService, href: e.target.value } } }))}
                        placeholder="/terms"
                      />
                    </FormField>
                  </div>
                </div>
              </div>
            </>
          )}

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
                      [key]: { ...(d.sections[key] || {}), [field]: value },
                    },
                  }))
                }
              />
            </div>
          )}

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
            💾 {isSaving ? "Saving\u2026" : "Save Changes"}
          </button>
        </div>
      </CmsCard>
    </div>
  );
}
