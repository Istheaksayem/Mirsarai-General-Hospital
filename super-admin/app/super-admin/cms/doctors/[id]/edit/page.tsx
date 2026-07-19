"use client";

import { use, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save, CheckCircle2, Loader2, AlertCircle } from "lucide-react";
import { LanguageTabs } from "@/components/cms/LanguageTabs";
import { RichTextEditor } from "@/components/cms/RichTextEditor";
import { ImageUploader } from "@/components/cms/ImageUploader";
import { SeoFields, type SeoValue } from "@/components/cms/SeoFields";
import { FormField, FormInput, FormSelect } from "@/components/ui/FormPage";
import { ChamberTimePicker } from "@/components/doctors/ChamberTimePicker";
import { LanguageMultiSelect } from "@/components/doctors/LanguageMultiSelect";
import { env } from "@/config/env";

const API_URL = env.apiUrl;
const DEPARTMENTS = ["General Medicine","Cardiology","Orthopedics","Neurology","Gynecology","Pediatrics","Gastroenterology","Dermatology","ENT","Ophthalmology","Urology","Radiology","Pathology","Emergency"];
const SPECIALIZATIONS = ["Medicine Specialist","Cardiologist","Orthopedic Surgeon","Neurologist","Gynecologist","Pediatrician","Gastroenterologist","Dermatologist","ENT Specialist","Ophthalmologist","Urologist","Radiologist","Pathologist","Emergency Medicine Specialist"];

type Bi = { en: string; bn: string };
const bi = (en = "", bn = ""): Bi => ({ en, bn });

interface Errors {
  nameEn?: string; nameBn?: string;
  designationEn?: string; designationBn?: string;
  specializationEn?: string; specializationBn?: string;
  departmentEn?: string; departmentBn?: string;
  qualification?: string;
  chamberTimeEn?: string; chamberTimeBn?: string;
  aboutEn?: string; aboutBn?: string;
  addressEn?: string; addressBn?: string;
  phone?: string; email?: string;
  experience?: string;
}

export default function EditDoctorCmsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [langTab, setLangTab] = useState<"en" | "bn">("en");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");
  const [errors, setErrors] = useState<Errors>({});

  const [form, setForm] = useState<Record<string, unknown>>({});

  useEffect(() => {
    fetch(`${API_URL}/admin/doctors/${id}`, { cache: "no-store" })
      .then(r => r.json())
      .then(json => {
        const d = json.data || json;
        setForm({
          name:            d.name        || bi(),
          designation:     d.designation || bi(),
          specialization:  d.specialization || bi(),
          department:      d.department  || bi(),
          qualification:   d.qualification || "",
          registrationNumber: d.registrationNumber || "",
          about:           d.about       || bi(),
          services:        d.services    || [],
          experienceYears: d.experience?.years || 0,
          consultationFee: d.consultationFee || 0,
          chamberTimeEn:   d.chamberTime?.en  || "",
          chamberTimeBn:   d.chamberTime?.bn  || "",
          availableDays:   d.availableDays    || [],
          languages:       d.languages || ["Bangla", "English"],
          phone:           d.phone            || "",
          email:           d.email            || "",
          addressEn:       d.address?.en      || "",
          addressBn:       d.address?.bn      || "",
          image:           d.image            || "",
          bannerImage:     d.bannerImage      || "",
          status:          d.status           || "active",
          available:       d.available        ?? true,
          featured:        d.featured         ?? false,
          isVisible:       d.isVisible        ?? true,
          onlineConsultation:  d.onlineConsultation  ?? false,
          offlineConsultation: d.offlineConsultation ?? true,
          appointmentAvailable: d.appointmentAvailable ?? true,
          displayOrder:    d.displayOrder     || 0,
          seo:             d.seo || { metaTitle: bi(), metaDescription: bi(), keywords: [] },
        });
      })
      .catch(() => setError("Failed to load doctor data"))
      .finally(() => setLoading(false));
  }, [id]);

  const set = (k: string, v: unknown) => setForm(f => ({ ...f, [k]: v }));
  const setBi = (k: string, tab: "en" | "bn", v: string) =>
    setForm(f => ({ ...f, [k]: { ...(f[k] as Bi), [tab]: v } }));

  const uploadImage = async (base64: string) => {
    const res = await fetch(`${API_URL}/admin/upload`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ image: base64 }),
    });
    if (!res.ok) throw new Error("Upload failed");
    const json = await res.json();
    return json.data.url as string;
  };

  const validate = (): boolean => {
    const name = form.name as Bi;
    const desig = form.designation as Bi;
    const spec = form.specialization as Bi;
    const dept = form.department as Bi;
    const about = form.about as Bi;
    const e: Errors = {};
    if (!name?.en?.trim()) e.nameEn = "Name (English) is required";
    if (!name?.bn?.trim()) e.nameBn = "Name (Bangla) is required";
    if (!desig?.en?.trim()) e.designationEn = "Designation (English) is required";
    if (!desig?.bn?.trim()) e.designationBn = "Designation (Bangla) is required";
    if (!spec?.en?.trim()) e.specializationEn = "Specialization (English) is required";
    if (!spec?.bn?.trim()) e.specializationBn = "Specialization (Bangla) is required";
    if (!dept?.en?.trim()) e.departmentEn = "Department (English) is required";
    if (!dept?.bn?.trim()) e.departmentBn = "Department (Bangla) is required";
    if (!(form.qualification as string)?.trim()) e.qualification = "Qualification is required";
    if (!(form.chamberTimeEn as string)?.trim()) e.chamberTimeEn = "Chamber time (English) is required";
    if (!(form.chamberTimeBn as string)?.trim()) e.chamberTimeBn = "Chamber time (Bangla) is required";
    if (!about?.en?.trim()) e.aboutEn = "About (English) is required";
    if (!about?.bn?.trim()) e.aboutBn = "About (Bangla) is required";
    if (!(form.addressEn as string)?.trim()) e.addressEn = "Address (English) is required";
    if (!(form.addressBn as string)?.trim()) e.addressBn = "Address (Bangla) is required";
    if (!(form.phone as string)?.trim()) e.phone = "Phone number is required";
    const email = form.email as string;
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email = "Valid email is required";
    if ((form.experienceYears as number) < 0) e.experience = "Experience years cannot be negative";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;
    setSaving(true); setError("");
    try {
      const payload = {
        name: form.name, designation: form.designation,
        specialization: form.specialization, department: form.department,
        qualification: form.qualification, registrationNumber: form.registrationNumber,
        languages: form.languages,
        about: form.about, services: form.services,
        experience: { years: form.experienceYears, label: { en: `${form.experienceYears}+ Years`, bn: `${form.experienceYears}+ বছর` } },
        consultationFee: form.consultationFee,
        chamberTime: { en: form.chamberTimeEn, bn: form.chamberTimeBn },
        availableDays: form.availableDays,
        onlineConsultation: form.onlineConsultation, offlineConsultation: form.offlineConsultation,
        appointmentAvailable: form.appointmentAvailable,
        phone: form.phone, email: form.email,
        address: { en: form.addressEn, bn: form.addressBn },
        image: form.image, bannerImage: form.bannerImage,
        status: form.status, available: form.available,
        featured: form.featured, isVisible: form.isVisible,
        displayOrder: form.displayOrder, seo: form.seo,
      };
      const res = await fetch(`${API_URL}/admin/doctors/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) { const err = await res.json(); throw new Error(err.message || "Save failed"); }
      setSaved(true);
      setTimeout(() => router.push("/super-admin/cms/doctors"), 1500);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Save failed");
    } finally { setSaving(false); }
  };

  if (loading) return (
    <div className="flex h-64 items-center justify-center gap-3">
      <Loader2 className="h-8 w-8 animate-spin text-[#1E2B7A]" />
      <p className="text-sm text-gray-500">Loading doctor data…</p>
    </div>
  );

  if (saved) return (
    <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#76BC21]/15">
        <CheckCircle2 className="h-10 w-10 text-[#76BC21]" />
      </div>
      <p className="text-xl font-bold text-gray-900 dark:text-gray-100">Changes Saved!</p>
      <p className="text-sm text-gray-500">Redirecting...</p>
    </div>
  );

  const f = (k: string) => form[k] as Bi || bi();
  const s = (k: string) => (form[k] as string) || "";
  const n = (k: string) => (form[k] as number) || 0;
  const b = (k: string) => !!(form[k]);

  const clearError = (key: keyof Errors) => setErrors(e => ({ ...e, [key]: undefined }));

  return (
    <div className="space-y-6 pb-12">
      {/* Sticky header */}
      <div className="flex items-center gap-3 sticky top-0 z-10 bg-gray-50 dark:bg-gray-900 py-3 -mx-4 px-4 border-b border-gray-100 dark:border-gray-800">
        <button onClick={() => router.push("/super-admin/cms/doctors")} className="flex h-9 w-9 items-center justify-center rounded-xl border border-gray-200 dark:border-gray-700 hover:bg-gray-100 transition-colors">
          <ArrowLeft className="h-4 w-4" />
        </button>
        <div className="flex-1">
          <h1 className="text-lg font-black text-gray-900 dark:text-gray-100">Edit Doctor Profile</h1>
          <p className="text-xs text-gray-400">Changes update /doctors listing and /doctors/[slug] detail page</p>
        </div>
        <LanguageTabs activeTab={langTab} onTabChange={setLangTab} />
        <button onClick={handleSave} disabled={saving}
          className="flex items-center gap-2 px-5 py-2.5 bg-[#1E2B7A] hover:bg-[#76BC21] text-white rounded-xl text-sm font-bold transition-all disabled:opacity-50">
          <Save className="h-4 w-4" />
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </div>

      {error && (
        <div className="rounded-xl border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20 px-4 py-3 text-sm text-red-600 dark:text-red-400 flex items-start gap-2">
          <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {Object.keys(errors).length > 0 && (
        <div className="rounded-xl border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20 px-4 py-3">
          <p className="text-sm font-semibold text-red-600 dark:text-red-400 flex items-center gap-2 mb-1">
            <AlertCircle className="h-4 w-4" /> Please fix the following errors:
          </p>
          <ul className="text-xs text-red-500 space-y-0.5 list-disc list-inside">
            {Object.values(errors).map((err, i) => err && <li key={i}>{err}</li>)}
          </ul>
        </div>
      )}

      {/* ⭐ Basic Information */}
      <section className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 space-y-4">
        <div className="pb-3 border-b border-gray-100 dark:border-gray-800">
          <h2 className="font-bold text-gray-900 dark:text-gray-100 text-sm">⭐ Basic Information <span className="text-red-500">*</span></h2>
          <p className="text-xs text-gray-400 mt-0.5">📌 Updates doctor card on /doctors and /doctors/[slug] detail page</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField label={`Name (${langTab.toUpperCase()})`} required>
            <FormInput value={f("name")[langTab]} onChange={e => { setBi("name", langTab, e.target.value); clearError(langTab === 'en' ? 'nameEn' : 'nameBn'); }} placeholder="Dr. Name" />
          </FormField>
          <FormField label={`Designation (${langTab.toUpperCase()})`} required>
            <FormInput value={f("designation")[langTab]} onChange={e => { setBi("designation", langTab, e.target.value); clearError(langTab === 'en' ? 'designationEn' : 'designationBn'); }} />
          </FormField>
          <FormField label={`Specialization (${langTab.toUpperCase()})`} required>
            <FormSelect value={f("specialization")[langTab]} onChange={e => { setBi("specialization", langTab, e.target.value); clearError(langTab === 'en' ? 'specializationEn' : 'specializationBn'); }}>
              <option value="">{langTab === 'en' ? 'Select specialization...' : 'বিশেষায়ন নির্বাচন করুন...'}</option>
              {SPECIALIZATIONS.map(s => <option key={s} value={s}>{s}</option>)}
            </FormSelect>
          </FormField>
          <FormField label={`Department (${langTab.toUpperCase()})`} required>
            <FormSelect value={f("department")[langTab]} onChange={e => { setBi("department", langTab, e.target.value); clearError(langTab === 'en' ? 'departmentEn' : 'departmentBn'); }}>
              <option value="">{langTab === 'en' ? 'Select department...' : 'বিভাগ নির্বাচন করুন...'}</option>
              {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
            </FormSelect>
          </FormField>
          <FormField label="Qualification" required>
            <FormInput value={s("qualification")} onChange={e => { set("qualification", e.target.value); clearError('qualification'); }} />
          </FormField>
          <FormField label="Experience (years)">
            <FormInput type="number" value={String(n("experienceYears"))} onChange={e => { set("experienceYears", parseInt(e.target.value)||0); clearError('experience'); }} />
          </FormField>
          <FormField label="Status">
            <FormSelect value={s("status")} onChange={e => set("status", e.target.value)}>
              <option value="active">Active</option>
              <option value="on-leave">On Leave</option>
              <option value="inactive">Inactive</option>
            </FormSelect>
          </FormField>
          <FormField label="Display Order">
            <FormInput type="number" value={String(n("displayOrder"))} onChange={e => set("displayOrder", parseInt(e.target.value)||0)} />
          </FormField>
        </div>
        <div className="flex flex-wrap gap-4">
          {[
            { key: "available", label: "Available" },
            { key: "featured", label: "⭐ Featured on Homepage" },
            { key: "isVisible", label: "Visible on public site" },
            { key: "onlineConsultation", label: "Online Consultation" },
            { key: "offlineConsultation", label: "Offline Consultation" },
          ].map(({ key, label }) => (
            <label key={key} className="flex items-center gap-2 text-sm cursor-pointer">
              <input type="checkbox" checked={b(key)} onChange={e => set(key, e.target.checked)} className="w-4 h-4 rounded accent-[#1E2B7A]" />
              <span className="text-gray-700 dark:text-gray-300 font-medium">{label}</span>
            </label>
          ))}
        </div>
        <div className="max-w-md">
          <LanguageMultiSelect
            value={form.languages as string[] || []}
            onChange={(languages) => set("languages", languages)}
            required
          />
        </div>
      </section>

      {/* 📌 Biography */}
      <section className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 space-y-4">
        <div className="pb-3 border-b border-gray-100 dark:border-gray-800">
          <h2 className="font-bold text-gray-900 dark:text-gray-100 text-sm">📌 Biography <span className="text-red-500">*</span></h2>
          <p className="text-xs text-gray-400 mt-0.5">Updates the About section on /doctors/[slug]</p>
        </div>
        <RichTextEditor
          label={`Biography — ${langTab === "en" ? "English" : "বাংলা"}`}
          value={f("about")[langTab]}
          onChange={v => { setBi("about", langTab, v); clearError(langTab === 'en' ? 'aboutEn' : 'aboutBn'); }}
          rows={5}
          helpText="Supports **bold**, *italic*, ## heading, - list"
        />
      </section>

      {/* 🔥 Consultation Schedule */}
      <section className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 space-y-4">
        <div className="pb-3 border-b border-gray-100 dark:border-gray-800">
          <h2 className="font-bold text-gray-900 dark:text-gray-100 text-sm">🔥 Consultation Schedule <span className="text-red-500">*</span></h2>
          <p className="text-xs text-gray-400 mt-0.5">Controls appointment availability on /doctors/[slug]</p>
        </div>
        <FormField label="Consultation Fee (৳)">
          <FormInput type="number" value={String(n("consultationFee"))} onChange={e => set("consultationFee", parseInt(e.target.value)||0)} />
        </FormField>
        <ChamberTimePicker
          availableDays={form.availableDays as string[] || []}
          chamberTime={{ en: s("chamberTimeEn"), bn: s("chamberTimeBn") }}
          onDaysChange={(days) => set("availableDays", days)}
          onChamberTimeChange={(ct) => {
            set("chamberTimeEn", ct.en);
            set("chamberTimeBn", ct.bn);
            clearError('chamberTimeEn');
            clearError('chamberTimeBn');
          }}
          showTitle={false}
        />
      </section>

      {/* Contact */}
      <section className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 space-y-4">
        <h2 className="font-bold text-gray-900 dark:text-gray-100 text-sm pb-3 border-b border-gray-100 dark:border-gray-800">📞 Contact Information <span className="text-red-500">*</span></h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField label="Phone" required>
            <FormInput value={s("phone")} onChange={e => { set("phone", e.target.value); clearError('phone'); }} />
          </FormField>
          <FormField label="Email">
            <FormInput type="email" value={s("email")} onChange={e => { set("email", e.target.value); clearError('email'); }} />
          </FormField>
          <FormField label="Address (EN)" required>
            <FormInput value={s("addressEn")} onChange={e => { set("addressEn", e.target.value); clearError('addressEn'); }} />
          </FormField>
          <FormField label="Address (BN)" required>
            <FormInput value={s("addressBn")} onChange={e => { set("addressBn", e.target.value); clearError('addressBn'); }} />
          </FormField>
        </div>
      </section>

      {/* ⭐ Media */}
      <section className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 space-y-5">
        <div className="pb-3 border-b border-gray-100 dark:border-gray-800">
          <h2 className="font-bold text-gray-900 dark:text-gray-100 text-sm">⭐ Media (Important)</h2>
          <p className="text-xs text-gray-400 mt-0.5">Profile image appears on /doctors list and /doctors/[slug] detail</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <ImageUploader label="Profile Photo" value={s("image")} onChange={v => set("image", v)} onUpload={uploadImage} helpText="400×500px portrait recommended" />
          <ImageUploader label="Banner Image" value={s("bannerImage")} onChange={v => set("bannerImage", v)} onUpload={uploadImage} />
        </div>
        <FormField label="Or paste external URL">
          <FormInput value={s("image")} onChange={e => set("image", e.target.value)} placeholder="https://example.com/image.jpg" />
        </FormField>
      </section>

      {/* SEO */}
      <SeoFields value={form.seo as SeoValue} onChange={(v: SeoValue) => set("seo", v)} helpText="SEO for /doctors/[slug] page" />

      {/* Footer */}
      <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100 dark:border-gray-800">
        <button onClick={() => router.push("/super-admin/cms/doctors")} className="px-5 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 text-sm font-semibold text-gray-600 dark:text-gray-400 hover:bg-gray-100 transition-colors">
          Cancel
        </button>
        <button onClick={handleSave} disabled={saving}
          className="px-6 py-2.5 bg-[#1E2B7A] hover:bg-[#76BC21] text-white rounded-xl text-sm font-bold transition-all shadow-md disabled:opacity-50 flex items-center gap-2">
          <Save className="h-4 w-4" />
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </div>
  );
}
