"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Plus, Trash2, Loader2 } from "lucide-react";
import {
  getEmergencyInfo,
  updateEmergencyInfo,
  uploadCmsImage,
  EmergencyInfoData,
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
  { key: "hero",        label: "Hero Section",         description: "Top banner with title, subtitle, and image" },
  { key: "contacts",    label: "Emergency Contacts",   description: "Emergency contact cards (ambulance, hotline, etc.)" },
  { key: "firstAid",    label: "First Aid Guidelines",  description: "First aid procedures with step-by-step instructions" },
  { key: "situations",  label: "When to Call",          description: "Situations requiring emergency services" },
  { key: "preparedness", label: "Preparedness Tips",     description: "Emergency preparedness tips" },
];

export default function EmergencyInfoCmsPage() {
  const router = useRouter();
  const [data, setData] = useState<EmergencyInfoData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [cmsTab, setCmsTab] = useState<CmsTab>("content");
  const [langTab, setLangTab] = useState<"en" | "bn">("en");
  const [seoLangTab, setSeoLangTab] = useState<"en" | "bn">("en");
  const [status, setStatus] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    getEmergencyInfo()
      .then(setData)
      .catch((e) => setStatus({ type: "error", text: e.message || "Failed to load data" }))
      .finally(() => setIsLoading(false));
  }, []);

  const handleSave = async () => {
    if (!data) return;
    setIsSaving(true);
    setStatus(null);
    try {
      const result = await updateEmergencyInfo(data); setData(result);
      setStatus({ type: "success", text: "Emergency Information saved successfully!" });
      setTimeout(() => setStatus(null), 4000);
    } catch (e: any) {
      setStatus({ type: "error", text: e.message || "Save failed" });
    } finally {
      setIsSaving(false);
    }
  };

  const set = useCallback((updater: (d: EmergencyInfoData) => EmergencyInfoData) => {
    setData((prev) => (prev ? updater(prev) : prev));
  }, []);

  const handleImageUpload = async (base64: string) => uploadCmsImage(base64);

  if (isLoading) {
    return (
      <div className="flex h-[400px] items-center justify-center gap-3">
        <Loader2 className="h-8 w-8 animate-spin text-[#1E2B7A]" />
        <p className="text-sm text-gray-500">Loading Emergency Information…</p>
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
        title="Emergency Information CMS"
        description="Edit the Emergency Information page — contacts, first aid, and preparedness"
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
                  description="Top banner of the Emergency Information page"
                />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <LocalizedInput
                    label="Page Title"
                    value={data.hero.title}
                    activeTab={langTab}
                    onChange={(v) => set((d) => ({ ...d, hero: { ...d.hero, title: v } }))}
                    placeholder={{ en: "Emergency Information", bn: "জরুরি তথ্য" }}
                    required
                  />
                  <LocalizedInput
                    label="Subtitle"
                    value={data.hero.subtitle}
                    activeTab={langTab}
                    onChange={(v) => set((d) => ({ ...d, hero: { ...d.hero, subtitle: v } }))}
                    placeholder={{ en: "24/7 Emergency Care & Support", bn: "২৪/৭ জরুরি পরিচর্যা এবং সহায়তা" }}
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

              {/* Emergency Contacts */}
              <div className="space-y-4">
                <SectionDivider
                  title="Emergency Contacts Section"
                  description="Section title and individual contact cards"
                />
                <LocalizedInput
                  label="Section Title"
                  value={data.emergencyContacts.title}
                  activeTab={langTab}
                  onChange={(v) => set((d) => ({ ...d, emergencyContacts: { ...d.emergencyContacts, title: v } }))}
                  placeholder={{ en: "Emergency Contacts", bn: "জরুরি যোগাযোগ" }}
                />
                <div className="space-y-3">
                  {data.emergencyContacts.contacts.map((contact, i) => (
                    <div key={i} className="rounded-xl border border-gray-200 dark:border-gray-700 p-4 space-y-3 bg-gray-50/50 dark:bg-gray-800/30">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-gray-500 uppercase tracking-wide">Contact #{i + 1}</span>
                        <button
                          type="button"
                          onClick={() => set((d) => ({
                            ...d,
                            emergencyContacts: {
                              ...d.emergencyContacts,
                              contacts: d.emergencyContacts.contacts.filter((_, idx) => idx !== i),
                            },
                          }))}
                          className="flex h-7 w-7 items-center justify-center rounded-lg border border-red-200 text-red-500 hover:bg-red-50 transition-colors"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <FormField label="Icon Name">
                          <FormInput
                            value={contact.icon}
                            disabled
                            className="cursor-not-allowed opacity-60"
                            placeholder="FaAmbulance"
                          />
                        </FormField>
                        <FormField label="Phone Number">
                          <FormInput
                            value={contact.number}
                            onChange={(e) => {
                              const updated = [...data.emergencyContacts.contacts];
                              updated[i] = { ...contact, number: e.target.value };
                              set((d) => ({ ...d, emergencyContacts: { ...d.emergencyContacts, contacts: updated } }));
                            }}
                            placeholder="+880 1234-567890"
                          />
                        </FormField>
                        <LocalizedInput
                          label="Title"
                          value={contact.title}
                          activeTab={langTab}
                          onChange={(v) => {
                            const updated = [...data.emergencyContacts.contacts];
                            updated[i] = { ...contact, title: v };
                            set((d) => ({ ...d, emergencyContacts: { ...d.emergencyContacts, contacts: updated } }));
                          }}
                          placeholder={{ en: "Ambulance Service", bn: "অ্যাম্বুলেন্স সেবা" }}
                        />
                        <LocalizedInput
                          label="Availability"
                          value={contact.available}
                          activeTab={langTab}
                          onChange={(v) => {
                            const updated = [...data.emergencyContacts.contacts];
                            updated[i] = { ...contact, available: v };
                            set((d) => ({ ...d, emergencyContacts: { ...d.emergencyContacts, contacts: updated } }));
                          }}
                          placeholder={{ en: "24/7 Available", bn: "২৪/৭ উপলব্ধ" }}
                        />
                      </div>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => set((d) => ({
                      ...d,
                      emergencyContacts: {
                        ...d.emergencyContacts,
                        contacts: [...d.emergencyContacts.contacts, {
                          icon: "FaPhoneAlt",
                          title: { en: "New Contact", bn: "নতুন যোগাযোগ" },
                          number: "+880 0000-000000",
                          available: { en: "24/7 Available", bn: "২৪/৭ উপলব্ধ" },
                        }],
                      },
                    }))}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl border border-dashed border-gray-300 dark:border-gray-600 text-sm text-gray-500 hover:border-[#1E2B7A] hover:text-[#1E2B7A] transition-colors"
                  >
                    <Plus className="h-4 w-4" /> Add Contact
                  </button>
                </div>
              </div>

              <hr className="border-gray-100 dark:border-gray-800" />

              {/* First Aid Guidelines */}
              <div className="space-y-4">
                <SectionDivider
                  title="First Aid Guidelines"
                  description="First aid procedures with step-by-step instructions"
                />
                <LocalizedInput
                  label="Section Title"
                  value={data.firstAid.title}
                  activeTab={langTab}
                  onChange={(v) => set((d) => ({ ...d, firstAid: { ...d.firstAid, title: v } }))}
                  placeholder={{ en: "First Aid Guidelines", bn: "প্রাথমিক চিকিৎসা নির্দেশিকা" }}
                />
                <div className="space-y-4">
                  {data.firstAid.items.map((item, i) => (
                    <div key={i} className="rounded-xl border border-gray-200 dark:border-gray-700 p-4 space-y-3 bg-gray-50/50 dark:bg-gray-800/30">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-gray-500 uppercase tracking-wide">Item #{i + 1}</span>
                        <button
                          type="button"
                          onClick={() => set((d) => ({
                            ...d,
                            firstAid: {
                              ...d.firstAid,
                              items: d.firstAid.items.filter((_, idx) => idx !== i),
                            },
                          }))}
                          className="flex h-7 w-7 items-center justify-center rounded-lg border border-red-200 text-red-500 hover:bg-red-50 transition-colors"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <FormField label="Icon Name">
                          <FormInput
                            value={item.icon}
                            disabled
                            className="cursor-not-allowed opacity-60"
                            placeholder="FaHeartbeat"
                          />
                        </FormField>
                        <LocalizedInput
                          label="Title"
                          value={item.title}
                          activeTab={langTab}
                          onChange={(v) => {
                            const updated = [...data.firstAid.items];
                            updated[i] = { ...item, title: v };
                            set((d) => ({ ...d, firstAid: { ...d.firstAid, items: updated } }));
                          }}
                          placeholder={{ en: "Heart Attack", bn: "হার্ট অ্যাটাক" }}
                        />
                      </div>
                      <div className="space-y-2">
                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Steps</p>
                        {item.steps.map((step, si) => (
                          <div key={si} className="flex gap-2 items-start">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 flex-1">
                              <FormInput
                                value={step.en}
                                onChange={(e) => {
                                  const updated = [...data.firstAid.items];
                                  const updatedSteps = [...updated[i].steps];
                                  updatedSteps[si] = { ...step, en: e.target.value };
                                  updated[i] = { ...updated[i], steps: updatedSteps };
                                  set((d) => ({ ...d, firstAid: { ...d.firstAid, items: updated } }));
                                }}
                                placeholder="Step in English"
                              />
                              <FormInput
                                value={step.bn}
                                onChange={(e) => {
                                  const updated = [...data.firstAid.items];
                                  const updatedSteps = [...updated[i].steps];
                                  updatedSteps[si] = { ...step, bn: e.target.value };
                                  updated[i] = { ...updated[i], steps: updatedSteps };
                                  set((d) => ({ ...d, firstAid: { ...d.firstAid, items: updated } }));
                                }}
                                placeholder="বাংলায় ধাপ"
                              />
                            </div>
                            <button
                              type="button"
                              onClick={() => {
                                const updated = [...data.firstAid.items];
                                updated[i] = { ...updated[i], steps: updated[i].steps.filter((_, idx) => idx !== si) };
                                set((d) => ({ ...d, firstAid: { ...d.firstAid, items: updated } }));
                              }}
                              className="mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-red-200 text-red-500 hover:bg-red-50"
                            >
                              <Trash2 className="h-3 w-3" />
                            </button>
                          </div>
                        ))}
                        <button
                          type="button"
                          onClick={() => {
                            const updated = [...data.firstAid.items];
                            updated[i] = { ...updated[i], steps: [...updated[i].steps, { en: "New step", bn: "নতুন ধাপ" }] };
                            set((d) => ({ ...d, firstAid: { ...d.firstAid, items: updated } }));
                          }}
                          className="text-xs text-[#1E2B7A] hover:text-[#76BC21] transition-colors font-semibold"
                        >
                          + Add Step
                        </button>
                      </div>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => set((d) => ({
                      ...d,
                      firstAid: {
                        ...d.firstAid,
                        items: [...d.firstAid.items, {
                          icon: "FaFirstAid",
                          title: { en: "New Item", bn: "নতুন আইটেম" },
                          steps: [{ en: "Step 1", bn: "ধাপ ১" }],
                        }],
                      },
                    }))}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl border border-dashed border-gray-300 dark:border-gray-600 text-sm text-gray-500 hover:border-[#1E2B7A] hover:text-[#1E2B7A] transition-colors"
                  >
                    <Plus className="h-4 w-4" /> Add First Aid Item
                  </button>
                </div>
              </div>

              <hr className="border-gray-100 dark:border-gray-800" />

              {/* When to Call Emergency */}
              <div className="space-y-4">
                <SectionDivider
                  title="When to Call Emergency"
                  description="Situations that require immediate emergency services"
                />
                <LocalizedInput
                  label="Section Title"
                  value={data.whenToCallEmergency.title}
                  activeTab={langTab}
                  onChange={(v) => set((d) => ({ ...d, whenToCallEmergency: { ...d.whenToCallEmergency, title: v } }))}
                />
                <LocalizedTextarea
                  label="Description"
                  value={data.whenToCallEmergency.description}
                  activeTab={langTab}
                  onChange={(v) => set((d) => ({ ...d, whenToCallEmergency: { ...d.whenToCallEmergency, description: v } }))}
                  rows={2}
                />
                <div className="space-y-2">
                  {data.whenToCallEmergency.situations.map((situation, i) => (
                    <div key={i} className="flex gap-2 items-start">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 flex-1">
                        <FormInput
                          value={situation.en}
                          onChange={(e) => {
                            const updated = [...data.whenToCallEmergency.situations];
                            updated[i] = { ...situation, en: e.target.value };
                            set((d) => ({ ...d, whenToCallEmergency: { ...d.whenToCallEmergency, situations: updated } }));
                          }}
                          placeholder="Situation in English"
                        />
                        <FormInput
                          value={situation.bn}
                          onChange={(e) => {
                            const updated = [...data.whenToCallEmergency.situations];
                            updated[i] = { ...situation, bn: e.target.value };
                            set((d) => ({ ...d, whenToCallEmergency: { ...d.whenToCallEmergency, situations: updated } }));
                          }}
                          placeholder="বাংলায় পরিস্থিতি"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => set((d) => ({
                          ...d,
                          whenToCallEmergency: {
                            ...d.whenToCallEmergency,
                            situations: d.whenToCallEmergency.situations.filter((_, idx) => idx !== i),
                          },
                        }))}
                        className="mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-red-200 text-red-500 hover:bg-red-50"
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => set((d) => ({
                      ...d,
                      whenToCallEmergency: {
                        ...d.whenToCallEmergency,
                        situations: [...d.whenToCallEmergency.situations, { en: "New situation", bn: "নতুন পরিস্থিতি" }],
                      },
                    }))}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl border border-dashed border-gray-300 dark:border-gray-600 text-sm text-gray-500 hover:border-[#1E2B7A] hover:text-[#1E2B7A] transition-colors"
                  >
                    <Plus className="h-4 w-4" /> Add Situation
                  </button>
                </div>
              </div>

              <hr className="border-gray-100 dark:border-gray-800" />

              {/* Emergency Preparedness */}
              <div className="space-y-4">
                <SectionDivider
                  title="Emergency Preparedness Tips"
                  description="Tips shown in the preparedness section"
                />
                <LocalizedInput
                  label="Section Title"
                  value={data.emergencyPreparedness.title}
                  activeTab={langTab}
                  onChange={(v) => set((d) => ({ ...d, emergencyPreparedness: { ...d.emergencyPreparedness, title: v } }))}
                />
                <div className="space-y-3">
                  {data.emergencyPreparedness.tips.map((tip, i) => (
                    <div key={i} className="rounded-xl border border-gray-200 dark:border-gray-700 p-4 space-y-3 bg-gray-50/50 dark:bg-gray-800/30">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-gray-500 uppercase tracking-wide">Tip #{i + 1}</span>
                        <button
                          type="button"
                          onClick={() => set((d) => ({
                            ...d,
                            emergencyPreparedness: {
                              ...d.emergencyPreparedness,
                              tips: d.emergencyPreparedness.tips.filter((_, idx) => idx !== i),
                            },
                          }))}
                          className="flex h-7 w-7 items-center justify-center rounded-lg border border-red-200 text-red-500 hover:bg-red-50 transition-colors"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <FormField label="Icon Name">
                          <FormInput
                            value={tip.icon}
                            disabled
                            className="cursor-not-allowed opacity-60"
                            placeholder="FaFirstAid"
                          />
                        </FormField>
                        <LocalizedInput
                          label="Title"
                          value={tip.title}
                          activeTab={langTab}
                          onChange={(v) => {
                            const updated = [...data.emergencyPreparedness.tips];
                            updated[i] = { ...tip, title: v };
                            set((d) => ({ ...d, emergencyPreparedness: { ...d.emergencyPreparedness, tips: updated } }));
                          }}
                          placeholder={{ en: "Keep a First Aid Kit", bn: "প্রাথমিক চিকিৎসা কিট রাখুন" }}
                        />
                      </div>
                      <LocalizedTextarea
                        label="Description"
                        value={tip.description}
                        activeTab={langTab}
                        onChange={(v) => {
                          const updated = [...data.emergencyPreparedness.tips];
                          updated[i] = { ...tip, description: v };
                          set((d) => ({ ...d, emergencyPreparedness: { ...d.emergencyPreparedness, tips: updated } }));
                        }}
                        rows={2}
                      />
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => set((d) => ({
                      ...d,
                      emergencyPreparedness: {
                        ...d.emergencyPreparedness,
                        tips: [...d.emergencyPreparedness.tips, {
                          icon: "FaFirstAid",
                          title: { en: "New Tip", bn: "নতুন টিপ" },
                          description: { en: "Tip description", bn: "টিপ বিবরণ" },
                        }],
                      },
                    }))}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl border border-dashed border-gray-300 dark:border-gray-600 text-sm text-gray-500 hover:border-[#1E2B7A] hover:text-[#1E2B7A] transition-colors"
                  >
                    <Plus className="h-4 w-4" /> Add Tip
                  </button>
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
