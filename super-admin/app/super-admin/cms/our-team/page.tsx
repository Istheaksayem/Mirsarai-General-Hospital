"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Plus, Trash2, Loader2, GripVertical, ChevronDown, ChevronRight, GraduationCap, Briefcase, Star, Link as LinkIcon } from "lucide-react";
import {
  getOurTeamData,
  updateOurTeamData,
  uploadCmsImage,
  OurTeamData,
  OurTeamMember,
  LocalizedString,
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
  slug: "",
  qualifications: [],
  experience: [],
  specialties: [],
  socialLinks: [],
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
  const [expandedMembers, setExpandedMembers] = useState<Set<number>>(new Set());

  const toggleMemberExpand = (i: number) => {
    setExpandedMembers(prev => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i); else next.add(i);
      return next;
    });
  };

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
      const result = await updateOurTeamData(data); setData(result);
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

  // ── Member nested arrays helpers ──
  const addQualification = (memberIdx: number) =>
    set((d) => {
      const members = [...d.members];
      const quals = [...(members[memberIdx].qualifications || [])];
      quals.push({ title: { en: "Qualification Title", bn: "যোগ্যতার শিরোনাম" }, institution: { en: "Institution", bn: "প্রতিষ্ঠান" }, year: "" });
      members[memberIdx] = { ...members[memberIdx], qualifications: quals };
      return { ...d, members };
    });

  const removeQualification = (memberIdx: number, qualIdx: number) =>
    set((d) => {
      const members = [...d.members];
      members[memberIdx] = { ...members[memberIdx], qualifications: members[memberIdx].qualifications.filter((_, qi) => qi !== qualIdx) };
      return { ...d, members };
    });

  const updateQualification = (memberIdx: number, qualIdx: number, updated: Partial<OurTeamMember['qualifications'][0]>) =>
    set((d) => {
      const members = [...d.members];
      const quals = [...members[memberIdx].qualifications];
      quals[qualIdx] = { ...quals[qualIdx], ...updated };
      members[memberIdx] = { ...members[memberIdx], qualifications: quals };
      return { ...d, members };
    });

  const addExperience = (memberIdx: number) =>
    set((d) => {
      const members = [...d.members];
      const exp = [...(members[memberIdx].experience || [])];
      exp.push({ title: { en: "Position Title", bn: "পদের শিরোনাম" }, institution: { en: "Institution", bn: "প্রতিষ্ঠান" }, period: "", description: { en: "", bn: "" } });
      members[memberIdx] = { ...members[memberIdx], experience: exp };
      return { ...d, members };
    });

  const removeExperience = (memberIdx: number, expIdx: number) =>
    set((d) => {
      const members = [...d.members];
      members[memberIdx] = { ...members[memberIdx], experience: members[memberIdx].experience.filter((_, ei) => ei !== expIdx) };
      return { ...d, members };
    });

  const updateExperience = (memberIdx: number, expIdx: number, updated: Partial<OurTeamMember['experience'][0]>) =>
    set((d) => {
      const members = [...d.members];
      const exp = [...members[memberIdx].experience];
      exp[expIdx] = { ...exp[expIdx], ...updated };
      members[memberIdx] = { ...members[memberIdx], experience: exp };
      return { ...d, members };
    });

  const addSpecialty = (memberIdx: number) =>
    set((d) => {
      const members = [...d.members];
      const specs = [...(members[memberIdx].specialties || [])];
      specs.push({ en: "Specialty", bn: "বিশেষত্ব" });
      members[memberIdx] = { ...members[memberIdx], specialties: specs };
      return { ...d, members };
    });

  const removeSpecialty = (memberIdx: number, specIdx: number) =>
    set((d) => {
      const members = [...d.members];
      members[memberIdx] = { ...members[memberIdx], specialties: members[memberIdx].specialties.filter((_, si) => si !== specIdx) };
      return { ...d, members };
    });

  const updateSpecialty = (memberIdx: number, specIdx: number, updated: LocalizedString) =>
    set((d) => {
      const members = [...d.members];
      const specs = [...members[memberIdx].specialties];
      specs[specIdx] = { ...specs[specIdx], ...updated };
      members[memberIdx] = { ...members[memberIdx], specialties: specs };
      return { ...d, members };
    });

  const addSocialLink = (memberIdx: number) =>
    set((d) => {
      const members = [...d.members];
      const links = [...(members[memberIdx].socialLinks || [])];
      links.push({ platform: "", url: "" });
      members[memberIdx] = { ...members[memberIdx], socialLinks: links };
      return { ...d, members };
    });

  const removeSocialLink = (memberIdx: number, linkIdx: number) =>
    set((d) => {
      const members = [...d.members];
      members[memberIdx] = { ...members[memberIdx], socialLinks: members[memberIdx].socialLinks.filter((_, li) => li !== linkIdx) };
      return { ...d, members };
    });

  const updateSocialLink = (memberIdx: number, linkIdx: number, updated: Partial<OurTeamMember['socialLinks'][0]>) =>
    set((d) => {
      const members = [...d.members];
      const links = [...members[memberIdx].socialLinks];
      links[linkIdx] = { ...links[linkIdx], ...updated };
      members[memberIdx] = { ...members[memberIdx], socialLinks: links };
      return { ...d, members };
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
                  description="Individual team member cards — each with name, designation, department, bio, image, email, phone, qualifications, experience, specialties, social links"
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

                      {/* ── Expandable Additional Details ── */}
                      <div className="pt-2">
                        <button
                          type="button"
                          onClick={() => toggleMemberExpand(i)}
                          className="flex items-center gap-2 w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 text-sm font-semibold text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                        >
                          {expandedMembers.has(i) ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                          Additional Details (Qualifications, Experience, Specialties, Social Links)
                        </button>

                        {expandedMembers.has(i) && (
                          <div className="mt-4 space-y-5 pl-2 border-l-2 border-gray-100 dark:border-gray-800">
                            {/* Slug */}
                            <div className="space-y-1.5">
                              <label className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">
                                URL Slug
                              </label>
                              <input
                                type="text"
                                value={member.slug || ''}
                                onChange={(e) => updateMember(i, { slug: e.target.value })}
                                placeholder="dr-john-doe"
                                className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2.5 text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-[#1E2B7A]/20 focus:border-[#1E2B7A]"
                              />
                              <p className="text-xs text-gray-400">URL-friendly identifier (e.g., dr-john-doe). Leave empty to auto-generate.</p>
                            </div>

                            {/* ── Qualifications ── */}
                            <div>
                              <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-2">
                                  <GraduationCap className="h-4 w-4 text-blue-500" />
                                  <span className="text-xs font-bold text-gray-500 uppercase tracking-wide">Qualifications ({member.qualifications?.length || 0})</span>
                                </div>
                                <button type="button" onClick={() => addQualification(i)} className="flex items-center gap-1 px-2.5 py-1 rounded-lg border border-blue-200 text-blue-600 text-xs font-semibold hover:bg-blue-50 transition-colors">
                                  <Plus className="h-3 w-3" /> Add
                                </button>
                              </div>
                              <div className="space-y-2">
                                {(member.qualifications || []).map((q, qi) => (
                                  <div key={qi} className="rounded-lg border border-gray-100 dark:border-gray-800 p-3 space-y-2 bg-white dark:bg-gray-900/50">
                                    <div className="flex justify-end">
                                      <button type="button" onClick={() => removeQualification(i, qi)} className="text-red-400 hover:text-red-600">
                                        <Trash2 className="h-3.5 w-3.5" />
                                      </button>
                                    </div>
                                    <LocalizedInput
                                      label="Title"
                                      value={q.title}
                                      activeTab={langTab}
                                      onChange={(v) => updateQualification(i, qi, { title: v })}
                                      placeholder={{ en: "MBBS", bn: "এমবিবিএস" }}
                                    />
                                    <LocalizedInput
                                      label="Institution"
                                      value={q.institution}
                                      activeTab={langTab}
                                      onChange={(v) => updateQualification(i, qi, { institution: v })}
                                      placeholder={{ en: "University", bn: "বিশ্ববিদ্যালয়" }}
                                    />
                                    <div className="space-y-1.5">
                                      <label className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">Year</label>
                                      <input
                                        type="text"
                                        value={q.year}
                                        onChange={(e) => updateQualification(i, qi, { year: e.target.value })}
                                        placeholder="2010"
                                        className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-[#1E2B7A]/20 focus:border-[#1E2B7A]"
                                      />
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>

                            {/* ── Experience ── */}
                            <div>
                              <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-2">
                                  <Briefcase className="h-4 w-4 text-emerald-500" />
                                  <span className="text-xs font-bold text-gray-500 uppercase tracking-wide">Experience ({member.experience?.length || 0})</span>
                                </div>
                                <button type="button" onClick={() => addExperience(i)} className="flex items-center gap-1 px-2.5 py-1 rounded-lg border border-emerald-200 text-emerald-600 text-xs font-semibold hover:bg-emerald-50 transition-colors">
                                  <Plus className="h-3 w-3" /> Add
                                </button>
                              </div>
                              <div className="space-y-2">
                                {(member.experience || []).map((ex, ei) => (
                                  <div key={ei} className="rounded-lg border border-gray-100 dark:border-gray-800 p-3 space-y-2 bg-white dark:bg-gray-900/50">
                                    <div className="flex justify-end">
                                      <button type="button" onClick={() => removeExperience(i, ei)} className="text-red-400 hover:text-red-600">
                                        <Trash2 className="h-3.5 w-3.5" />
                                      </button>
                                    </div>
                                    <LocalizedInput
                                      label="Position Title"
                                      value={ex.title}
                                      activeTab={langTab}
                                      onChange={(v) => updateExperience(i, ei, { title: v })}
                                      placeholder={{ en: "Senior Cardiologist", bn: "সিনিয়র কার্ডিওলজিস্ট" }}
                                    />
                                    <LocalizedInput
                                      label="Institution"
                                      value={ex.institution}
                                      activeTab={langTab}
                                      onChange={(v) => updateExperience(i, ei, { institution: v })}
                                      placeholder={{ en: "Hospital Name", bn: "হাসপাতালের নাম" }}
                                    />
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                      <div className="space-y-1.5">
                                        <label className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">Period</label>
                                        <input
                                          type="text"
                                          value={ex.period}
                                          onChange={(e) => updateExperience(i, ei, { period: e.target.value })}
                                          placeholder="2015 - 2020"
                                          className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-[#1E2B7A]/20 focus:border-[#1E2B7A]"
                                        />
                                      </div>
                                    </div>
                                    <LocalizedTextarea
                                      label="Description"
                                      value={ex.description || { en: '', bn: '' }}
                                      activeTab={langTab}
                                      onChange={(v) => updateExperience(i, ei, { description: v })}
                                      placeholder={{ en: "Brief description of role…", bn: "ভূমিকার সংক্ষিপ্ত বিবরণ…" }}
                                      rows={2}
                                    />
                                  </div>
                                ))}
                              </div>
                            </div>

                            {/* ── Specialties ── */}
                            <div>
                              <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-2">
                                  <Star className="h-4 w-4 text-amber-500" />
                                  <span className="text-xs font-bold text-gray-500 uppercase tracking-wide">Specialties ({member.specialties?.length || 0})</span>
                                </div>
                                <button type="button" onClick={() => addSpecialty(i)} className="flex items-center gap-1 px-2.5 py-1 rounded-lg border border-amber-200 text-amber-600 text-xs font-semibold hover:bg-amber-50 transition-colors">
                                  <Plus className="h-3 w-3" /> Add
                                </button>
                              </div>
                              <div className="space-y-2">
                                {(member.specialties || []).map((spec, si) => (
                                  <div key={si} className="flex items-start gap-2">
                                    <div className="flex-1">
                                      <LocalizedInput
                                        label={`Specialty #${si + 1}`}
                                        value={spec}
                                        activeTab={langTab}
                                        onChange={(v) => updateSpecialty(i, si, v)}
                                        placeholder={{ en: "Cardiology", bn: "কার্ডিওলজি" }}
                                      />
                                    </div>
                                    <button
                                      type="button"
                                      onClick={() => removeSpecialty(i, si)}
                                      className="mt-6 flex h-7 w-7 items-center justify-center rounded-lg border border-red-200 text-red-500 hover:bg-red-50 transition-colors"
                                    >
                                      <Trash2 className="h-3.5 w-3.5" />
                                    </button>
                                  </div>
                                ))}
                              </div>
                            </div>

                            {/* ── Social Links ── */}
                            <div>
                              <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-2">
                                  <LinkIcon className="h-4 w-4 text-purple-500" />
                                  <span className="text-xs font-bold text-gray-500 uppercase tracking-wide">Social Links ({member.socialLinks?.length || 0})</span>
                                </div>
                                <button type="button" onClick={() => addSocialLink(i)} className="flex items-center gap-1 px-2.5 py-1 rounded-lg border border-purple-200 text-purple-600 text-xs font-semibold hover:bg-purple-50 transition-colors">
                                  <Plus className="h-3 w-3" /> Add
                                </button>
                              </div>
                              <div className="space-y-2">
                                {(member.socialLinks || []).map((link, li) => (
                                  <div key={li} className="flex items-start gap-2">
                                    <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-2">
                                      <div className="space-y-1.5">
                                        <label className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">Platform</label>
                                        <select
                                          value={link.platform}
                                          onChange={(e) => updateSocialLink(i, li, { platform: e.target.value })}
                                          className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2.5 text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-[#1E2B7A]/20 focus:border-[#1E2B7A]"
                                        >
                                          <option value="">Select platform</option>
                                          <option value="facebook">Facebook</option>
                                          <option value="twitter">Twitter / X</option>
                                          <option value="linkedin">LinkedIn</option>
                                          <option value="instagram">Instagram</option>
                                          <option value="youtube">YouTube</option>
                                          <option value="website">Website</option>
                                        </select>
                                      </div>
                                      <div className="space-y-1.5">
                                        <label className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">URL</label>
                                        <input
                                          type="url"
                                          value={link.url}
                                          onChange={(e) => updateSocialLink(i, li, { url: e.target.value })}
                                          placeholder="https://facebook.com/..."
                                          className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2.5 text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-[#1E2B7A]/20 focus:border-[#1E2B7A]"
                                        />
                                      </div>
                                    </div>
                                    <button
                                      type="button"
                                      onClick={() => removeSocialLink(i, li)}
                                      className="mt-6 flex h-7 w-7 items-center justify-center rounded-lg border border-red-200 text-red-500 hover:bg-red-50 transition-colors"
                                    >
                                      <Trash2 className="h-3.5 w-3.5" />
                                    </button>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
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
