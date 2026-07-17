"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Plus, Trash2, Loader2, GripVertical, Layers } from "lucide-react";
import {
  getOurTeamData,
  updateOurTeamData,
  uploadCmsImage,
  OurTeamData,
  OurTeamMember,
  OurTeamCustomSection,
} from "@/lib/services/api";
import { CmsTabNav, CmsTab, CmsCard, CmsStatusBar, CmsPageHeader } from "@/components/cms/CmsLayout";
import { LanguageTabs } from "@/components/cms/LanguageTabs";
import { ImageUploader } from "@/components/cms/ImageUploader";
import { SeoFields } from "@/components/cms/SeoFields";
import { VisibilityOrderControl } from "@/components/cms/VisibilityOrderControl";
import { LocalizedInput, LocalizedTextarea, SectionDivider } from "@/components/cms/LocalizedFields";

const SECTION_DEFS = [
  { key: "hero",    label: "Hero Section",    description: "Top banner with page title and image" },
  { key: "members", label: "Team Members",    description: "Grid of team member cards" },
  { key: "cta",    label: "Call-to-Action",   description: "Bottom CTA linking to appointments & career" },
];

const EMPTY_MEMBER: OurTeamMember = {
  name:        { en: "Team Member Name", bn: "টিম সদস্যের নাম" },
  designation: { en: "Designation", bn: "পদবী" },
  department:  { en: "Department", bn: "বিভাগ" },
  bio:         { en: "Brief bio…", bn: "সংক্ষিপ্ত পরিচিতি…" },
  image: "",
  email: "",
  phone: "",
  order: 0,
};

export default function OurTeamCmsPage() {
  const router = useRouter();
  const [data, setData] = useState<OurTeamData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [cmsTab, setCmsTab] = useState<CmsTab>("content");
  const [langTab, setLangTab] = useState<"en" | "bn">("en");
  const [seoLangTab, setSeoLangTab] = useState<"en" | "bn">("en");
  const [status, setStatus] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    getOurTeamData()
      .then(setData)
      .catch((e) => setStatus({ type: "error", text: e.message || "Failed to load data" }))
      .finally(() => setIsLoading(false));
  }, []);

  const handleSave = async () => {
    if (!data) return;
    setIsSaving(true);
    setStatus(null);
    try {
      await updateOurTeamData(data);
      setStatus({ type: "success", text: "Our Team content saved successfully!" });
      setTimeout(() => setStatus(null), 4000);
    } catch (e: any) {
      setStatus({ type: "error", text: e.message || "Save failed" });
    } finally {
      setIsSaving(false);
    }
  };

  const set = useCallback((updater: (d: OurTeamData) => OurTeamData) => {
    setData((prev) => (prev ? updater(prev) : prev));
  }, []);

  const handleImageUpload = async (base64: string) => uploadCmsImage(base64);

  const addMember = () =>
    set((d) => ({
      ...d,
      members: [...d.members, { ...EMPTY_MEMBER, order: d.members.length }],
    }));

  const removeMember = (i: number) =>
    set((d) => ({ ...d, members: d.members.filter((_, idx) => idx !== i) }));

  const updateMember = (i: number, updated: Partial<OurTeamMember>) =>
    set((d) => {
      const members = [...d.members];
      members[i] = { ...members[i], ...updated };
      return { ...d, members };
    });

  // ── Custom Sections helpers ──
  const addCustomSection = () =>
    set((d) => {
      const existing = d.customSections || [];
      const newSection: OurTeamCustomSection = {
        id: `section_${Date.now()}`,
        title: { en: "New Section Title", bn: "নতুন সেকশনের শিরোনাম" },
        description: { en: "Section description goes here…", bn: "সেকশনের বিবরণ এখানে লিখুন…" },
        image: "",
        order: existing.length,
      };
      return { ...d, customSections: [...existing, newSection] };
    });

  const removeCustomSection = (i: number) =>
    set((d) => ({
      ...d,
      customSections: (d.customSections || []).filter((_, idx) => idx !== i),
    }));

  const updateCustomSection = (i: number, updated: Partial<OurTeamCustomSection>) =>
    set((d) => {
      const sections = [...(d.customSections || [])];
      sections[i] = { ...sections[i], ...updated };
      return { ...d, customSections: sections };
    });

  if (isLoading) {
    return (
      <div className="flex h-[400px] items-center justify-center gap-3">
        <Loader2 className="h-8 w-8 animate-spin text-[#1E2B7A]" />
        <p className="text-sm text-gray-500">Loading Our Team content…</p>
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
        title="Our Team CMS"
        description="Edit hero section, team members, and call-to-action"
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
                <SectionDivider title="Hero Section" description="Banner displayed at the top of the Our Team page" />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <LocalizedInput
                    label="Hero Title"
                    value={data.hero.title}
                    activeTab={langTab}
                    onChange={(v) => set((d) => ({ ...d, hero: { ...d.hero, title: v } }))}
                    placeholder={{ en: "Meet Our Team", bn: "আমাদের টিমের সাথে পরিচিত হন" }}
                    required
                  />
                  <LocalizedInput
                    label="Hero Subtitle"
                    value={data.hero.subtitle}
                    activeTab={langTab}
                    onChange={(v) => set((d) => ({ ...d, hero: { ...d.hero, subtitle: v } }))}
                    placeholder={{ en: "Dedicated Professionals", bn: "নিবেদিতপ্রাণ পেশাদার" }}
                  />
                </div>
                <LocalizedTextarea
                  label="Hero Description"
                  value={data.hero.description}
                  activeTab={langTab}
                  onChange={(v) => set((d) => ({ ...d, hero: { ...d.hero, description: v } }))}
                  placeholder={{ en: "Our team is dedicated to…", bn: "আমাদের টিম নিবেদিত…" }}
                  rows={3}
                />
                <ImageUploader
                  label="Hero Background Image"
                  value={data.hero.image}
                  onChange={(url) => set((d) => ({ ...d, hero: { ...d.hero, image: url } }))}
                  onUpload={handleImageUpload}
                  helpText="Background image for the hero section (recommended: 1200×500px)"
                />
              </div>

              <hr className="border-gray-100 dark:border-gray-800" />

              {/* Section Header */}
              <div className="space-y-4">
                <SectionDivider title="Members Section Header" description="Title and description shown above the team grid" />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <LocalizedInput
                    label="Section Title"
                    value={data.sectionTitle}
                    activeTab={langTab}
                    onChange={(v) => set((d) => ({ ...d, sectionTitle: v }))}
                    placeholder={{ en: "Our Team Members", bn: "আমাদের টিম সদস্যরা" }}
                    required
                  />
                </div>
                <LocalizedTextarea
                  label="Section Description"
                  value={data.sectionDescription}
                  activeTab={langTab}
                  onChange={(v) => set((d) => ({ ...d, sectionDescription: v }))}
                  placeholder={{ en: "Meet the team who…", bn: "টিমের সাথে পরিচিত হন যারা…" }}
                  rows={3}
                />
              </div>

              <hr className="border-gray-100 dark:border-gray-800" />

              {/* Team Members */}
              <div className="space-y-4">
                <SectionDivider
                  title={`Team Members (${data.members.length})`}
                  description="Individual team member cards — each with name, designation, department, bio, image, email, phone"
                />
                <div className="space-y-4">
                  {data.members.map((member, i) => (
                    <div
                      key={i}
                      className="rounded-xl border border-gray-100 dark:border-gray-800 p-5 space-y-4 bg-gray-50/50 dark:bg-gray-800/30"
                    >
                      {/* Card header */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <GripVertical className="h-4 w-4 text-gray-300" />
                          <span className="text-xs font-bold text-gray-500 uppercase tracking-wide">
                            Member #{i + 1}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeMember(i)}
                          className="flex h-7 w-7 items-center justify-center rounded-lg border border-red-200 text-red-500 hover:bg-red-50 transition-colors"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>

                      {/* Name + Designation */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <LocalizedInput
                          label="Name"
                          value={member.name}
                          activeTab={langTab}
                          onChange={(v) => updateMember(i, { name: v })}
                          placeholder={{ en: "Dr. John Doe", bn: "ডা. জন ডো" }}
                        />
                        <LocalizedInput
                          label="Designation"
                          value={member.designation}
                          activeTab={langTab}
                          onChange={(v) => updateMember(i, { designation: v })}
                          placeholder={{ en: "Senior Physician", bn: "সিনিয়র চিকিৎসক" }}
                        />
                      </div>

                      {/* Department + Order */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <LocalizedInput
                          label="Department"
                          value={member.department}
                          activeTab={langTab}
                          onChange={(v) => updateMember(i, { department: v })}
                          placeholder={{ en: "Cardiology", bn: "কার্ডিওলজি" }}
                        />
                        <div className="space-y-1.5">
                          <label className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">
                            Display Order
                          </label>
                          <input
                            type="number"
                            min={0}
                            value={member.order}
                            onChange={(e) => updateMember(i, { order: Number(e.target.value) })}
                            className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2.5 text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-[#1E2B7A]/20 focus:border-[#1E2B7A]"
                          />
                        </div>
                      </div>

                      {/* Bio */}
                      <LocalizedTextarea
                        label="Bio"
                        value={member.bio}
                        activeTab={langTab}
                        onChange={(v) => updateMember(i, { bio: v })}
                        placeholder={{ en: "Brief professional bio…", bn: "সংক্ষিপ্ত পেশাদার পরিচিতি…" }}
                        rows={3}
                      />

                      {/* Email + Phone */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="space-y-1.5">
                          <label className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">
                            Email
                          </label>
                          <input
                            type="email"
                            value={member.email}
                            onChange={(e) => updateMember(i, { email: e.target.value })}
                            placeholder="doctor@hospital.com"
                            className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2.5 text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-[#1E2B7A]/20 focus:border-[#1E2B7A]"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">
                            Phone
                          </label>
                          <input
                            type="tel"
                            value={member.phone}
                            onChange={(e) => updateMember(i, { phone: e.target.value })}
                            placeholder="+880 1XXX-XXXXXX"
                            className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2.5 text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-[#1E2B7A]/20 focus:border-[#1E2B7A]"
                          />
                        </div>
                      </div>

                      {/* Photo */}
                      <ImageUploader
                        label="Member Photo"
                        value={member.image}
                        onChange={(url) => updateMember(i, { image: url })}
                        onUpload={handleImageUpload}
                        helpText="Recommended: square photo 400×400px"
                      />
                    </div>
                  ))}

                  {/* Add member button */}
                  <button
                    type="button"
                    onClick={addMember}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-dashed border-gray-300 dark:border-gray-600 text-sm text-gray-500 hover:border-[#1E2B7A] hover:text-[#1E2B7A] transition-colors w-full justify-center"
                  >
                    <Plus className="h-4 w-4" /> Add Team Member
                  </button>
                </div>
              </div>

              <hr className="border-gray-100 dark:border-gray-800" />

              {/* Custom Sections */}
              <div className="space-y-4">
                <SectionDivider
                  title={`Custom Sections (${(data.customSections || []).length})`}
                  description="Add extra content sections to the page — each with a title, description, and optional image"
                />
                <div className="space-y-4">
                  {(data.customSections || []).map((section, i) => (
                    <div
                      key={section.id}
                      className="rounded-xl border border-gray-100 dark:border-gray-800 p-5 space-y-4 bg-gradient-to-br from-indigo-50/40 to-purple-50/30 dark:from-gray-800/40 dark:to-gray-800/20"
                    >
                      {/* Section header */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Layers className="h-4 w-4 text-indigo-400" />
                          <span className="text-xs font-bold text-gray-500 uppercase tracking-wide">
                            Section #{i + 1}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeCustomSection(i)}
                          className="flex h-7 w-7 items-center justify-center rounded-lg border border-red-200 text-red-500 hover:bg-red-50 transition-colors"
                          title="Remove this section"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>

                      {/* Title */}
                      <LocalizedInput
                        label="Section Title"
                        value={section.title}
                        activeTab={langTab}
                        onChange={(v) => updateCustomSection(i, { title: v })}
                        placeholder={{ en: "Section Title", bn: "সেকশন শিরোনাম" }}
                        required
                      />

                      {/* Description */}
                      <LocalizedTextarea
                        label="Section Description"
                        value={section.description}
                        activeTab={langTab}
                        onChange={(v) => updateCustomSection(i, { description: v })}
                        placeholder={{ en: "Describe this section…", bn: "এই সেকশনের বিবরণ লিখুন…" }}
                        rows={4}
                      />

                      {/* Order */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="space-y-1.5">
                          <label className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">
                            Display Order
                          </label>
                          <input
                            type="number"
                            min={0}
                            value={section.order}
                            onChange={(e) => updateCustomSection(i, { order: Number(e.target.value) })}
                            className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2.5 text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-[#1E2B7A]/20 focus:border-[#1E2B7A]"
                          />
                        </div>
                      </div>

                      {/* Image */}
                      <ImageUploader
                        label="Section Image"
                        value={section.image}
                        onChange={(url) => updateCustomSection(i, { image: url })}
                        onUpload={handleImageUpload}
                        helpText="Optional image for this section (recommended: 1200×600px)"
                      />
                    </div>
                  ))}

                  {/* Add section button */}
                  <button
                    type="button"
                    onClick={addCustomSection}
                    className="flex items-center gap-2 px-4 py-3 rounded-xl border-2 border-dashed border-indigo-200 dark:border-indigo-800 text-sm font-semibold text-indigo-500 hover:border-indigo-400 hover:text-indigo-600 hover:bg-indigo-50/50 dark:hover:bg-indigo-900/20 transition-all duration-200 w-full justify-center group"
                  >
                    <Plus className="h-4 w-4 transition-transform group-hover:rotate-90 duration-200" />
                    Add New Section
                  </button>
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
