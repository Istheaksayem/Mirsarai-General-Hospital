"use client";

import { use, useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import {
  Save, ArrowLeft, Eye, EyeOff, Star, StarOff,
  Plus, Trash2, GripVertical, Clock, Globe, Phone,
  Mail, MapPin, AlertCircle, CheckCircle2, Loader2,
  User, Stethoscope, BookOpen, Settings
} from "lucide-react";
import Link from "next/link";
import { useCmsDoctorById, useUpdateCmsDoctor, useCreateCmsDoctor } from "@/lib/hooks/useCmsDoctors";
import { uploadCmsImage, type CmsDoctor, type BilingualField } from "@/lib/services/api";
import { LanguageTabs } from "@/components/cms/LanguageTabs";
import { ImageUploader } from "@/components/cms/ImageUploader";
import { ChamberTimePicker } from "@/components/doctors/ChamberTimePicker";
import { LanguageMultiSelect } from "@/components/doctors/LanguageMultiSelect";
import { cn } from "@/lib/utils";

// ─── Constants ────────────────────────────────────────────────────────────────

const STATUS_OPTIONS = [
  { value: "active", label: "Active", color: "text-emerald-600" },
  { value: "on-leave", label: "On Leave", color: "text-amber-600" },
  { value: "inactive", label: "Inactive", color: "text-red-600" },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

const emptyBilingual = (): BilingualField => ({ en: "", bn: "" });

const defaultDoctor = (): Partial<CmsDoctor> => ({
  name: emptyBilingual(),
  designation: emptyBilingual(),
  specialization: emptyBilingual(),
  department: emptyBilingual(),
  qualification: "",
  experience: { years: 0, label: emptyBilingual() },
  languages: ["Bangla", "English"],
  about: emptyBilingual(),
  services: [],
  consultationFee: 0,
  chamberTime: emptyBilingual(),
  chamberAddress: emptyBilingual(),
  address: emptyBilingual(),
  timeSlots: [],
  availableDays: [],
  onlineConsultation: false,
  offlineConsultation: true,
  appointmentAvailable: true,
  phone: "",
  email: "",
  image: "",
  bannerImage: "",
  galleryImages: [],
  status: "active",
  available: true,
  featured: false,
  displayOrder: 0,
  isVisible: true,
  seo: {
    metaTitle: emptyBilingual(),
    metaDescription: emptyBilingual(),
    keywords: [],
  },
});

// ─── Sub-components ───────────────────────────────────────────────────────────

function SectionCard({
  icon: Icon, title, badge, children,
}: {
  icon: React.ElementType; title: string; badge?: string; children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 overflow-hidden">
      <div className="flex items-center gap-3 px-6 py-4 border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/50">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#1E2B7A]/10 dark:bg-blue-900/20">
          <Icon className="h-4 w-4 text-[#1E2B7A] dark:text-blue-400" />
        </div>
        <h3 className="text-sm font-bold text-gray-800 dark:text-gray-200">{title}</h3>
        {badge && (
          <span className="ml-auto text-xs px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-900/20 text-[#1E2B7A] dark:text-blue-400 font-medium">
            {badge}
          </span>
        )}
      </div>
      <div className="p-6 space-y-5">{children}</div>
    </div>
  );
}

function FieldLabel({ children, hint }: { children: React.ReactNode; hint?: string }) {
  return (
    <div className="mb-1.5">
      <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">
        {children}
      </label>
      {hint && <p className="text-xs text-blue-500 dark:text-blue-400 mt-0.5">→ {hint}</p>}
    </div>
  );
}

function Input({
  value, onChange, placeholder, type = "text", className = "",
}: {
  value: string | number; onChange: (v: string) => void;
  placeholder?: string; type?: string; className?: string;
}) {
  return (
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className={cn(
        "w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800",
        "px-3.5 py-2.5 text-sm text-gray-900 dark:text-gray-100",
        "focus:border-[#1E2B7A] focus:ring-2 focus:ring-[#1E2B7A]/20 focus:outline-none transition-all",
        "placeholder:text-gray-400 dark:placeholder:text-gray-500",
        className
      )}
    />
  );
}

function Textarea({
  value, onChange, placeholder, rows = 4,
}: {
  value: string; onChange: (v: string) => void; placeholder?: string; rows?: number;
}) {
  return (
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      rows={rows}
      className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-3.5 py-2.5 text-sm text-gray-900 dark:text-gray-100 focus:border-[#1E2B7A] focus:ring-2 focus:ring-[#1E2B7A]/20 focus:outline-none transition-all resize-none placeholder:text-gray-400"
    />
  );
}

function BilingualField({
  label, value, onChange, multiline = false, hint, rows = 4,
}: {
  label: string; value: BilingualField; onChange: (v: BilingualField) => void;
  multiline?: boolean; hint?: string; rows?: number;
}) {
  const [tab, setTab] = useState<"en" | "bn">("en");
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <FieldLabel hint={hint}>{label}</FieldLabel>
        <LanguageTabs activeTab={tab} onTabChange={setTab} />
      </div>
      {multiline ? (
        <Textarea
          value={value?.[tab] ?? ""}
          onChange={(v) => onChange({ ...value, [tab]: v })}
          placeholder={tab === "en" ? `Enter ${label.toLowerCase()} in English...` : `${label} বাংলায় লিখুন...`}
          rows={rows}
        />
      ) : (
        <Input
          value={value?.[tab] ?? ""}
          onChange={(v) => onChange({ ...value, [tab]: v })}
          placeholder={tab === "en" ? `Enter ${label.toLowerCase()} in English...` : `${label} বাংলায় লিখুন...`}
        />
      )}
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function DoctorCmsEditorPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const isNew = id === "new";
  const router = useRouter();

  const { data: existingData, isLoading } = useCmsDoctorById(id);
  const updateMutation = useUpdateCmsDoctor(id);
  const createMutation = useCreateCmsDoctor();

  const [form, setForm] = useState<Partial<CmsDoctor>>(defaultDoctor());
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [activeTab, setActiveTab] = useState<"en" | "bn">("en");
  const [newService, setNewService] = useState({ en: "", bn: "" });
  const [newKeyword, setNewKeyword] = useState("");

  // Populate form from existing data
  useEffect(() => {
    if (existingData?.data) {
      setForm(existingData.data as Partial<CmsDoctor>);
    }
  }, [existingData]);

  const setField = useCallback(<K extends keyof CmsDoctor>(key: K, value: CmsDoctor[K]) => {
    setForm((f) => ({ ...f, [key]: value }));
    setErrors((e) => { const n = { ...e }; delete n[key as string]; return n; });
  }, []);

  const handleUpload = async (base64: string) => uploadCmsImage(base64);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name?.en?.trim()) e["name.en"] = "Doctor name (English) is required";
    if (!form.designation?.en?.trim()) e["designation.en"] = "Designation is required";
    if (!form.specialization?.en?.trim()) e["specialization.en"] = "Specialization is required";
    if (!form.department?.en?.trim()) e["department.en"] = "Department is required";
    if (!form.qualification?.trim()) e.qualification = "Qualification is required";
    return e;
  };

  const handleSave = async () => {
    const e = validate();
    if (Object.keys(e).length > 0) { setErrors(e); return; }

    setSaveStatus("saving");
    try {
      if (isNew) {
        await createMutation.mutateAsync(form);
      } else {
        await updateMutation.mutateAsync(form);
      }
      setSaveStatus("saved");
      setTimeout(() => setSaveStatus("idle"), 3000);
      if (isNew) router.push("/super-admin/doctors");
    } catch (err) {
      setSaveStatus("error");
      setTimeout(() => setSaveStatus("idle"), 4000);
      console.error("Save failed:", err);
    }
  };

  const addService = () => {
    if (!newService.en.trim()) return;
    setField("services", [...(form.services || []), { en: newService.en, bn: newService.bn }]);
    setNewService({ en: "", bn: "" });
  };

  const removeService = (idx: number) => {
    setField("services", (form.services || []).filter((_, i) => i !== idx));
  };

  const addKeyword = () => {
    if (!newKeyword.trim()) return;
    setField("seo", { ...form.seo!, keywords: [...(form.seo?.keywords || []), newKeyword.trim()] });
    setNewKeyword("");
  };

  const removeKeyword = (idx: number) => {
    setField("seo", { ...form.seo!, keywords: (form.seo?.keywords || []).filter((_, i) => i !== idx) });
  };

  if (isLoading && !isNew) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-[#1E2B7A]" />
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-10">
      {/* ─── Header ─────────────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-3">
          <Link
            href="/super-admin/doctors"
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-gray-200 dark:border-gray-700 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div>
            <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">
              {isNew ? "Add New Doctor" : `Edit: ${form.name?.en || "Doctor"}`}
            </h1>
            <p className="text-xs text-gray-400 mt-0.5">
              🏥 Affects: <strong>/doctors</strong> page (listing) and <strong>/doctors/[slug]</strong> profile page
            </p>
          </div>
        </div>

        {/* Save Status + Button */}
        <div className="flex items-center gap-3">
          {saveStatus === "saved" && (
            <span className="flex items-center gap-1.5 text-sm text-emerald-600 dark:text-emerald-400 font-medium">
              <CheckCircle2 className="h-4 w-4" /> Saved!
            </span>
          )}
          {saveStatus === "error" && (
            <span className="flex items-center gap-1.5 text-sm text-red-500 font-medium">
              <AlertCircle className="h-4 w-4" /> Save failed
            </span>
          )}
          <button
            type="button"
            onClick={handleSave}
            disabled={saveStatus === "saving"}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#1E2B7A] text-white font-semibold text-sm hover:bg-[#1a2460] transition-colors disabled:opacity-50"
          >
            {saveStatus === "saving" ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Save className="h-4 w-4" />
            )}
            {saveStatus === "saving" ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>

      {/* Error Banner */}
      {Object.keys(errors).length > 0 && (
        <div className="rounded-xl border border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/20 px-4 py-3 flex items-start gap-2">
          <AlertCircle className="h-4 w-4 text-red-500 mt-0.5 shrink-0" />
          <div>
            <p className="text-sm font-semibold text-red-600 dark:text-red-400">Please fix the following errors:</p>
            <ul className="mt-1 space-y-0.5">
              {Object.values(errors).map((err, i) => (
                <li key={i} className="text-xs text-red-500">{err}</li>
              ))}
            </ul>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* ─── Main Column ─────────────────────────────────────────────── */}
        <div className="xl:col-span-2 space-y-6">

          {/* Identity */}
          <SectionCard icon={User} title="Identity" badge="🔥 Core Info">
            <BilingualField
              label="Full Name"
              value={form.name || emptyBilingual()}
              onChange={(v) => setField("name", v)}
              hint="Shown in /doctors listing cards and /doctors/[slug] page header"
            />
            {errors["name.en"] && <p className="text-xs text-red-500 -mt-3">{errors["name.en"]}</p>}

            <BilingualField
              label="Designation"
              value={form.designation || emptyBilingual()}
              onChange={(v) => setField("designation", v)}
              hint="Shown below name (e.g. 'Senior Consultant')"
            />

            <div className="grid grid-cols-2 gap-4">
              <div>
                <FieldLabel hint="Shown in doctor cards and department filter">Department</FieldLabel>
                <BilingualField
                  label=""
                  value={form.department || emptyBilingual()}
                  onChange={(v) => setField("department", v)}
                />
                {errors["department.en"] && <p className="text-xs text-red-500 mt-1">{errors["department.en"]}</p>}
              </div>
              <div>
                <FieldLabel hint="Shown in doctor profile and specialty tags">Specialization</FieldLabel>
                <BilingualField
                  label=""
                  value={form.specialization || emptyBilingual()}
                  onChange={(v) => setField("specialization", v)}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <FieldLabel hint="e.g. MBBS, MD, FCPS — shown in profile">Qualification</FieldLabel>
                <Input
                  value={form.qualification || ""}
                  onChange={(v) => setField("qualification", v)}
                  placeholder="MBBS, FCPS (Cardiology)"
                />
                {errors.qualification && <p className="text-xs text-red-500 mt-1">{errors.qualification}</p>}
              </div>
              <div>
                <FieldLabel hint="Shown as '12+ Years' badge in doctor card">Experience (Years)</FieldLabel>
                <Input
                  type="number"
                  value={form.experience?.years || 0}
                  onChange={(v) => setField("experience", { years: parseInt(v) || 0, label: { en: `${v}+ Years`, bn: `${v}+ বছর` } })}
                />
              </div>
            </div>

            <div>
              <FieldLabel hint="BMC/BMDC registration number for credibility display">Registration Number</FieldLabel>
              <Input
                value={form.registrationNumber || ""}
                onChange={(v) => setField("registrationNumber", v)}
                placeholder="BMDC-12345"
              />
            </div>
          </SectionCard>

          {/* Biography */}
          <SectionCard icon={BookOpen} title="Biography & Services" badge="⭐ Important">
            <div>
              <div className="flex items-center justify-between mb-2">
                <FieldLabel hint="Long-form bio shown in /doctors/[slug] profile page">About the Doctor</FieldLabel>
                <LanguageTabs activeTab={activeTab} onTabChange={setActiveTab} />
              </div>
              <Textarea
                value={form.about?.[activeTab] ?? ""}
                onChange={(v) => setField("about", { ...form.about!, [activeTab]: v })}
                placeholder={activeTab === "en" ? "Write a comprehensive biography about the doctor..." : "ডাক্তারের সম্পর্কে বিস্তারিত জীবনী লিখুন..."}
                rows={6}
              />
            </div>

            {/* Services List */}
            <div>
              <FieldLabel hint="Listed in the doctor's profile 'Services' section">Services Offered</FieldLabel>
              <div className="space-y-2">
                {(form.services || []).map((svc, idx) => (
                  <div key={idx} className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                    <GripVertical className="h-4 w-4 text-gray-300 shrink-0" />
                    <span className="flex-1 text-sm text-gray-700 dark:text-gray-300">
                      <span className="font-medium">{svc.en}</span>
                      {svc.bn && <span className="text-gray-400 ml-2">/ {svc.bn}</span>}
                    </span>
                    <button
                      type="button"
                      onClick={() => removeService(idx)}
                      className="h-6 w-6 flex items-center justify-center rounded-md text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))}
                <div className="flex gap-2">
                  <Input value={newService.en} onChange={(v) => setNewService(s => ({ ...s, en: v }))} placeholder="Service (English)" className="flex-1" />
                  <Input value={newService.bn} onChange={(v) => setNewService(s => ({ ...s, bn: v }))} placeholder="সেবা (বাংলা)" className="flex-1" />
                  <button
                    type="button"
                    onClick={addService}
                    className="flex items-center gap-1 px-3 py-2 rounded-xl bg-[#1E2B7A] text-white text-sm font-medium hover:bg-[#1a2460] transition-colors whitespace-nowrap"
                  >
                    <Plus className="h-4 w-4" /> Add
                  </button>
                </div>
              </div>
            </div>
          </SectionCard>

          {/* Consultation */}
          <SectionCard icon={Clock} title="Consultation & Schedule">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <FieldLabel hint="Shown prominently in doctor card and profile">Consultation Fee (৳)</FieldLabel>
                <Input
                  type="number"
                  value={form.consultationFee || 0}
                  onChange={(v) => setField("consultationFee", parseInt(v) || 0)}
                  placeholder="500"
                />
              </div>
              <div>
                <FieldLabel>Status</FieldLabel>
                <select
                  value={form.status || "active"}
                  onChange={(e) => setField("status", e.target.value as CmsDoctor["status"])}
                  className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-3.5 py-2.5 text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-[#1E2B7A]/20"
                >
                  {STATUS_OPTIONS.map(s => (
                    <option key={s.value} value={s.value}>{s.label}</option>
                  ))}
                </select>
              </div>
            </div>

            <ChamberTimePicker
              availableDays={form.availableDays || []}
              chamberTime={form.chamberTime || emptyBilingual()}
              onDaysChange={(days) => setField("availableDays", days)}
              onChamberTimeChange={(ct) => setField("chamberTime", ct)}
              showTitle={true}
            />

            <BilingualField
              label="Chamber Address"
              value={form.chamberAddress || emptyBilingual()}
              onChange={(v) => setField("chamberAddress", v)}
              hint="Shown in doctor profile contact section"
            />

            {/* Consultation Toggles */}
            <div className="flex flex-wrap gap-4">
              {[
                { key: "onlineConsultation", label: "Online Consultation" },
                { key: "offlineConsultation", label: "In-person Consultation" },
                { key: "appointmentAvailable", label: "Appointment Available" },
              ].map(({ key, label }) => (
                <label key={key} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={!!(form as Record<string, unknown>)[key]}
                    onChange={(e) => setField(key as keyof CmsDoctor, e.target.checked as CmsDoctor[keyof CmsDoctor])}
                    className="w-4 h-4 rounded accent-[#1E2B7A]"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">{label}</span>
                </label>
              ))}
            </div>
          </SectionCard>

          {/* Contact */}
          <SectionCard icon={Phone} title="Contact Information">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <FieldLabel hint="Shown in doctor profile contact card">Phone</FieldLabel>
                <Input value={form.phone || ""} onChange={(v) => setField("phone", v)} placeholder="+8801XXXXXXXXX" />
              </div>
              <div>
                <FieldLabel hint="Shown in doctor profile contact card">Email</FieldLabel>
                <Input type="email" value={form.email || ""} onChange={(v) => setField("email", v)} placeholder="doctor@hospital.com" />
              </div>
            </div>
            <BilingualField
              label="Hospital Address"
              value={form.address || emptyBilingual()}
              onChange={(v) => setField("address", v)}
            />
            <LanguageMultiSelect
              value={form.languages || []}
              onChange={(languages) => setField("languages", languages)}
            />
          </SectionCard>

          {/* SEO */}
          <SectionCard icon={Globe} title="SEO & Meta Tags" badge="🔍 SEO">
            <div className="text-xs text-blue-500 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3 mb-2">
              → Affects: <strong>/doctors/[slug]</strong> page &lt;head&gt; meta tags (title, description, keywords)
            </div>
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-gray-600 dark:text-gray-400">Set bilingual SEO metadata for this doctor&apos;s profile page</p>
              <LanguageTabs activeTab={activeTab} onTabChange={setActiveTab} />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <FieldLabel>Meta Title ({activeTab.toUpperCase()})</FieldLabel>
                <Input
                  value={form.seo?.metaTitle?.[activeTab] ?? ""}
                  onChange={(v) => setField("seo", { ...form.seo!, metaTitle: { ...form.seo?.metaTitle!, [activeTab]: v } })}
                  placeholder={activeTab === "en" ? "Dr. Name — Specialization | Hospital" : "ডা. নাম — বিশেষজ্ঞতা | হাসপাতাল"}
                />
              </div>
              <div>
                <FieldLabel>Meta Description ({activeTab.toUpperCase()})</FieldLabel>
                <Input
                  value={form.seo?.metaDescription?.[activeTab] ?? ""}
                  onChange={(v) => setField("seo", { ...form.seo!, metaDescription: { ...form.seo?.metaDescription!, [activeTab]: v } })}
                  placeholder="150 character description..."
                />
              </div>
            </div>
            <div>
              <FieldLabel>Keywords</FieldLabel>
              <div className="flex flex-wrap gap-2 mb-2">
                {(form.seo?.keywords || []).map((kw, idx) => (
                  <span key={idx} className="flex items-center gap-1 px-2 py-1 rounded-lg bg-gray-100 dark:bg-gray-800 text-xs text-gray-700 dark:text-gray-300">
                    {kw}
                    <button type="button" onClick={() => removeKeyword(idx)} className="text-red-400 hover:text-red-600">
                      ×
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <Input value={newKeyword} onChange={setNewKeyword} placeholder="Add keyword..." className="flex-1" />
                <button type="button" onClick={addKeyword} className="px-3 py-2 rounded-xl bg-gray-100 dark:bg-gray-800 text-sm font-medium hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </div>
          </SectionCard>
        </div>

        {/* ─── Sidebar ─────────────────────────────────────────────────── */}
        <div className="space-y-5">

          {/* Display Settings */}
          <SectionCard icon={Settings} title="Display Settings">
            <div className="space-y-4">
              {/* isVisible */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">Visible on Site</p>
                  <p className="text-xs text-gray-400">Shows in /doctors listing</p>
                </div>
                <button
                  type="button"
                  onClick={() => setField("isVisible", !form.isVisible)}
                  className={cn(
                    "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all",
                    form.isVisible
                      ? "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800"
                      : "bg-gray-100 dark:bg-gray-800 text-gray-500 border border-gray-200 dark:border-gray-700"
                  )}
                >
                  {form.isVisible ? <Eye className="h-3.5 w-3.5" /> : <EyeOff className="h-3.5 w-3.5" />}
                  {form.isVisible ? "Visible" : "Hidden"}
                </button>
              </div>

              {/* featured */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">Featured</p>
                  <p className="text-xs text-gray-400">Shows in homepage Featured Doctors section</p>
                </div>
                <button
                  type="button"
                  onClick={() => setField("featured", !form.featured)}
                  className={cn(
                    "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all",
                    form.featured
                      ? "bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-800"
                      : "bg-gray-100 dark:bg-gray-800 text-gray-500 border border-gray-200 dark:border-gray-700"
                  )}
                >
                  {form.featured ? <Star className="h-3.5 w-3.5 fill-current" /> : <StarOff className="h-3.5 w-3.5" />}
                  {form.featured ? "Featured" : "Not Featured"}
                </button>
              </div>

              {/* available */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">Available Today</p>
                  <p className="text-xs text-gray-400">Green badge on doctor card</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={!!form.available}
                    onChange={(e) => setField("available", e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:ring-2 peer-focus:ring-[#1E2B7A]/20 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-emerald-600" />
                </label>
              </div>

              {/* displayOrder */}
              <div>
                <FieldLabel hint="Lower numbers appear first in the doctors listing">Display Order</FieldLabel>
                <Input
                  type="number"
                  value={form.displayOrder ?? 0}
                  onChange={(v) => setField("displayOrder", parseInt(v) || 0)}
                />
              </div>
            </div>
          </SectionCard>

          {/* Profile Photo */}
          <SectionCard icon={User} title="Profile Photo">
            <p className="text-xs text-blue-500 dark:text-blue-400">→ Shown in doctor cards and profile page header</p>
            <ImageUploader
              label="Doctor Photo"
              value={form.image || ""}
              onChange={(url) => setField("image", url)}
              onUpload={handleUpload}
              helpText="Recommended: 400×400px, square crop, professional photo"
            />
          </SectionCard>

          {/* Banner Image */}
          <SectionCard icon={Stethoscope} title="Banner Image">
            <p className="text-xs text-blue-500 dark:text-blue-400">→ Shown as background in /doctors/[slug] hero section</p>
            <ImageUploader
              label="Banner / Hero Image"
              value={form.bannerImage || ""}
              onChange={(url) => setField("bannerImage", url)}
              onUpload={handleUpload}
              helpText="Recommended: 1200×400px, landscape"
            />
          </SectionCard>

          {/* Slug */}
          <SectionCard icon={Globe} title="URL Slug">
            <FieldLabel hint="URL path: /doctors/[slug] — must be lowercase with hyphens">Slug</FieldLabel>
            <Input
              value={form.slug || ""}
              onChange={(v) => setField("slug", v.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, ""))}
              placeholder="dr-john-doe"
            />
            {form.slug && (
              <p className="text-xs text-gray-400 mt-1">
                URL: <span className="text-[#1E2B7A] dark:text-blue-400">/doctors/{form.slug}</span>
              </p>
            )}
          </SectionCard>

          {/* Quick Save */}
          <button
            type="button"
            onClick={handleSave}
            disabled={saveStatus === "saving"}
            className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[#1E2B7A] text-white font-semibold text-sm hover:bg-[#1a2460] transition-colors disabled:opacity-50"
          >
            {saveStatus === "saving" ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : saveStatus === "saved" ? (
              <CheckCircle2 className="h-4 w-4" />
            ) : (
              <Save className="h-4 w-4" />
            )}
            {saveStatus === "saving" ? "Saving..." : saveStatus === "saved" ? "Saved!" : "Save Doctor"}
          </button>
        </div>
      </div>
    </div>
  );
}
