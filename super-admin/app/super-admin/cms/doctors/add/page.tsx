"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save, Stethoscope, CheckCircle2, AlertCircle } from "lucide-react";
import { LanguageTabs } from "@/components/cms/LanguageTabs";
import { RichTextEditor } from "@/components/cms/RichTextEditor";
import { ImageUploader } from "@/components/cms/ImageUploader";
import { SeoFields, type SeoValue } from "@/components/cms/SeoFields";
import { FormField, FormInput, FormSelect, FormSection } from "@/components/ui/FormPage";
import { ChamberTimePicker } from "@/components/doctors/ChamberTimePicker";
import { LanguageMultiSelect } from "@/components/doctors/LanguageMultiSelect";
import { env } from "@/config/env";

const API_URL = env.apiUrl;
const DEPARTMENTS = ["General Medicine","Cardiology","Orthopedics","Neurology","Gynecology","Pediatrics","Gastroenterology","Dermatology","ENT","Ophthalmology","Urology","Radiology","Pathology","Emergency"];
const SPECIALIZATIONS = ["Medicine Specialist","Cardiologist","Orthopedic Surgeon","Neurologist","Gynecologist","Pediatrician","Gastroenterologist","Dermatologist","ENT Specialist","Ophthalmologist","Urologist","Radiologist","Pathologist","Emergency Medicine Specialist"];

type Bi = { en: string; bn: string };
const bi = (en = "", bn = ""): Bi => ({ en, bn });

interface ServiceItem { en: string; bn: string }

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

export default function AddDoctorCmsPage() {
  const router = useRouter();
  const [langTab, setLangTab] = useState<"en" | "bn">("en");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");
  const [errors, setErrors] = useState<Errors>({});

  const [form, setForm] = useState({
    name:        bi(), designation: bi(), specialization: bi(), department: bi(),
    qualification: "", registrationNumber: "", languages: ["Bangla", "English"],
    status: "active", available: true, featured: false, isVisible: true,
    displayOrder: 0,
    about:    bi(),
    experienceYears: 0,
    services: [] as ServiceItem[],
    consultationFee: 0,
    chamberTimeEn: "", chamberTimeBn: "",
    availableDays: [] as string[],
    onlineConsultation: false, offlineConsultation: true,
    appointmentAvailable: true,
    phone: "", email: "",
    addressEn: "", addressBn: "",
    image: "", bannerImage: "",
    seo: { metaTitle: bi(), metaDescription: bi(), keywords: [] as string[] },
  });

  const [newService, setNewService] = useState<ServiceItem>({ en: "", bn: "" });

  const set = (k: keyof typeof form, v: unknown) => setForm(f => ({ ...f, [k]: v }));
  const setBi = (k: keyof typeof form, tab: "en" | "bn", v: string) => {
    setForm(f => ({ ...f, [k]: { ...(f[k] as Bi), [tab]: v } }));
  };

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

  const addService = () => {
    if (!newService.en) return;
    set("services", [...form.services, { ...newService }]);
    setNewService({ en: "", bn: "" });
  };

  const removeService = (i: number) => {
    set("services", form.services.filter((_, idx) => idx !== i));
  };

  const validate = (): boolean => {
    const e: Errors = {};
    if (!form.name.en?.trim()) e.nameEn = "Name (English) is required";
    if (!form.name.bn?.trim()) e.nameBn = "Name (Bangla) is required";
    if (!form.designation.en?.trim()) e.designationEn = "Designation (English) is required";
    if (!form.designation.bn?.trim()) e.designationBn = "Designation (Bangla) is required";
    if (!form.specialization.en?.trim()) e.specializationEn = "Specialization (English) is required";
    if (!form.specialization.bn?.trim()) e.specializationBn = "Specialization (Bangla) is required";
    if (!form.department.en?.trim()) e.departmentEn = "Department (English) is required";
    if (!form.department.bn?.trim()) e.departmentBn = "Department (Bangla) is required";
    if (!form.qualification?.trim()) e.qualification = "Qualification is required";
    if (!form.chamberTimeEn?.trim()) e.chamberTimeEn = "Chamber time (English) is required";
    if (!form.chamberTimeBn?.trim()) e.chamberTimeBn = "Chamber time (Bangla) is required";
    if (!form.about.en?.trim()) e.aboutEn = "About (English) is required";
    if (!form.about.bn?.trim()) e.aboutBn = "About (Bangla) is required";
    if (!form.addressEn?.trim()) e.addressEn = "Address (English) is required";
    if (!form.addressBn?.trim()) e.addressBn = "Address (Bangla) is required";
    if (!form.phone?.trim()) e.phone = "Phone number is required";
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Valid email is required";
    if (form.experienceYears < 0) e.experience = "Experience years cannot be negative";
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
        experience: {
          years: form.experienceYears,
          label: { en: `${form.experienceYears}+ Years`, bn: `${form.experienceYears}+ বছর` },
        },
        consultationFee: form.consultationFee,
        chamberTime: { en: form.chamberTimeEn, bn: form.chamberTimeBn },
        availableDays: form.availableDays,
        onlineConsultation: form.onlineConsultation,
        offlineConsultation: form.offlineConsultation,
        appointmentAvailable: form.appointmentAvailable,
        phone: form.phone, email: form.email,
        address: { en: form.addressEn, bn: form.addressBn },
        image: form.image, bannerImage: form.bannerImage,
        status: form.status, available: form.available,
        featured: form.featured, isVisible: form.isVisible,
        displayOrder: form.displayOrder, seo: form.seo,
      };
      const res = await fetch(`${API_URL}/admin/doctors`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Failed to create doctor");
      }
      setSaved(true);
      setTimeout(() => router.push("/super-admin/cms/doctors"), 1500);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Save failed");
    } finally { setSaving(false); }
  };

  if (saved) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#76BC21]/15">
          <CheckCircle2 className="h-10 w-10 text-[#76BC21]" />
        </div>
        <p className="text-xl font-bold text-gray-900 dark:text-gray-100">Doctor Created!</p>
        <p className="text-sm text-gray-500">Redirecting to doctors list...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex items-center gap-3 sticky top-0 z-10 bg-gray-50 dark:bg-gray-900 py-3 -mx-4 px-4 border-b border-gray-100 dark:border-gray-800">
        <button onClick={() => router.push("/super-admin/cms/doctors")} className="flex h-9 w-9 items-center justify-center rounded-xl border border-gray-200 dark:border-gray-700 hover:bg-gray-100 transition-colors">
          <ArrowLeft className="h-4 w-4" />
        </button>
        <div className="flex-1">
          <h1 className="text-lg font-black text-gray-900 dark:text-gray-100">Add New Doctor</h1>
          <p className="text-xs text-gray-400">Fill required fields • Will appear on /doctors and homepage</p>
        </div>
        <div className="flex items-center gap-2">
          <LanguageTabs activeTab={langTab} onTabChange={setLangTab} />
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-5 py-2.5 bg-[#1E2B7A] hover:bg-[#76BC21] text-white rounded-xl text-sm font-bold transition-all disabled:opacity-50"
          >
            <Save className="h-4 w-4" />
            {saving ? "Saving..." : "Save Doctor"}
          </button>
        </div>
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
      <section className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 space-y-5">
        <div className="flex items-center gap-2 pb-3 border-b border-gray-100 dark:border-gray-800">
          <span className="text-lg">⭐</span>
          <div>
            <h2 className="font-bold text-gray-900 dark:text-gray-100 text-sm">Basic Information <span className="text-red-500">*</span></h2>
            <p className="text-xs text-gray-400 mt-0.5">📌 Updates doctor card on <strong>/doctors</strong> list and <strong>/doctors/[slug]</strong> detail page</p>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField label={`Full Name (${langTab.toUpperCase()})`} required>
            <FormInput value={form.name[langTab]} onChange={e => { setBi("name", langTab, e.target.value); setErrors(e => ({...e, [langTab === 'en' ? 'nameEn' : 'nameBn']: undefined})); }} placeholder={langTab === "en" ? "Dr. Aminul Islam" : "ডা. আমিনুল ইসলাম"} />
          </FormField>
          <FormField label={`Designation (${langTab.toUpperCase()})`} required>
            <FormInput value={form.designation[langTab]} onChange={e => { setBi("designation", langTab, e.target.value); setErrors(e => ({...e, [langTab === 'en' ? 'designationEn' : 'designationBn']: undefined})); }} placeholder={langTab === "en" ? "Consultant Physician" : "পরামর্শক চিকিৎসক"} />
          </FormField>
          <FormField label={`Specialization (${langTab.toUpperCase()})`} required>
            <FormSelect value={form.specialization[langTab]} onChange={e => { setBi("specialization", langTab, e.target.value); setErrors(e => ({...e, [langTab === 'en' ? 'specializationEn' : 'specializationBn']: undefined})); }}>
              <option value="">{langTab === 'en' ? 'Select specialization...' : 'বিশেষায়ন নির্বাচন করুন...'}</option>
              {SPECIALIZATIONS.map(s => <option key={s} value={s}>{s}</option>)}
              <option value="__other__">{langTab === 'en' ? 'Other (type below)' : 'অন্যান্য (নিচে লিখুন)'}</option>
            </FormSelect>
          </FormField>
          <FormField label={`Department (${langTab.toUpperCase()})`} required>
            <FormSelect value={form.department[langTab]} onChange={e => { setBi("department", langTab, e.target.value); setErrors(e => ({...e, [langTab === 'en' ? 'departmentEn' : 'departmentBn']: undefined})); }}>
              <option value="">{langTab === 'en' ? 'Select department...' : 'বিভাগ নির্বাচন করুন...'}</option>
              {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
              <option value="__other__">{langTab === 'en' ? 'Other (type below)' : 'অন্যান্য (নিচে লিখুন)'}</option>
            </FormSelect>
          </FormField>
          <FormField label="Qualification" required>
            <FormInput value={form.qualification} onChange={e => { set("qualification", e.target.value); setErrors(e => ({...e, qualification: undefined})); }} placeholder="MBBS, FCPS (Medicine)" />
          </FormField>
          <FormField label="Experience (years)">
            <FormInput type="number" min="0" value={String(form.experienceYears)} onChange={e => { set("experienceYears", parseInt(e.target.value) || 0); setErrors(e => ({...e, experience: undefined})); }} placeholder="12" />
          </FormField>
          <FormField label="Status">
            <FormSelect value={form.status} onChange={e => set("status", e.target.value)}>
              <option value="active">Active</option>
              <option value="on-leave">On Leave</option>
              <option value="inactive">Inactive</option>
            </FormSelect>
          </FormField>
          <FormField label="Registration Number">
            <FormInput value={form.registrationNumber} onChange={e => set("registrationNumber", e.target.value)} placeholder="BMDC-12345" />
          </FormField>
        </div>
        <div className="flex flex-wrap gap-4">
          {[
            { key: "available", label: "Available for appointments" },
            { key: "featured", label: "⭐ Feature on Homepage" },
            { key: "isVisible", label: "Visible on public site" },
            { key: "onlineConsultation", label: "Online Consultation" },
            { key: "offlineConsultation", label: "Offline Consultation" },
          ].map(({ key, label }) => (
            <label key={key} className="flex items-center gap-2 text-sm cursor-pointer">
              <input
                type="checkbox"
                checked={!!form[key as keyof typeof form]}
                onChange={e => set(key as keyof typeof form, e.target.checked)}
                className="w-4 h-4 rounded accent-[#1E2B7A]"
              />
              <span className="text-gray-700 dark:text-gray-300 font-medium">{label}</span>
            </label>
          ))}
        </div>
        <div className="max-w-md">
          <LanguageMultiSelect
            value={form.languages}
            onChange={(languages) => set("languages", languages)}
            required
          />
        </div>
      </section>

      {/* 📌 Biography */}
      <section className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-gray-100 dark:border-gray-800">
          <span className="text-lg">📌</span>
          <div>
            <h2 className="font-bold text-gray-900 dark:text-gray-100 text-sm">Biography <span className="text-red-500">*</span></h2>
            <p className="text-xs text-gray-400 mt-0.5">Updates the "About" section on the doctor detail page <strong>/doctors/[slug]</strong></p>
          </div>
        </div>
        <RichTextEditor
          label={`Biography — ${langTab === "en" ? "English" : "বাংলা"}`}
          value={form.about[langTab]}
          onChange={v => { setBi("about", langTab, v); setErrors(e => ({...e, [langTab === 'en' ? 'aboutEn' : 'aboutBn']: undefined})); }}
          placeholder={langTab === "en" ? "Write doctor biography in English..." : "বাংলায় ডাক্তারের জীবনী লিখুন..."}
          rows={5}
          helpText="Supports **bold**, *italic*, ## heading, - list"
        />
        <div className="space-y-3">
          <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Specialized Services</h3>
          {form.services.map((svc, i) => (
            <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-800">
              <span className="flex-1 text-sm text-gray-700 dark:text-gray-300">{svc.en} {svc.bn ? `/ ${svc.bn}` : ""}</span>
              <button onClick={() => removeService(i)} className="text-red-500 text-xs font-semibold hover:underline">Remove</button>
            </div>
          ))}
          <div className="grid grid-cols-2 gap-2">
            <FormInput value={newService.en} onChange={e => setNewService(s => ({ ...s, en: e.target.value }))} placeholder="Service (EN)" />
            <FormInput value={newService.bn} onChange={e => setNewService(s => ({ ...s, bn: e.target.value }))} placeholder="সেবা (BN)" />
          </div>
          <button onClick={addService} className="px-4 py-2 text-xs font-bold bg-[#1E2B7A] text-white rounded-xl hover:bg-[#76BC21] transition-colors">
            + Add Service
          </button>
        </div>
      </section>

      {/* 🔥 Consultation Schedule */}
      <section className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-gray-100 dark:border-gray-800">
          <span className="text-lg">🔥</span>
          <div>
            <h2 className="font-bold text-gray-900 dark:text-gray-100 text-sm">Consultation Schedule <span className="text-red-500">*</span></h2>
            <p className="text-xs text-gray-400 mt-0.5">Controls appointment availability shown on <strong>/doctors/[slug]</strong> detail page</p>
          </div>
        </div>
        <FormField label="Consultation Fee (৳)">
          <FormInput type="number" min="0" value={String(form.consultationFee)} onChange={e => set("consultationFee", parseInt(e.target.value) || 0)} placeholder="800" />
        </FormField>
        <ChamberTimePicker
          availableDays={form.availableDays}
          chamberTime={{ en: form.chamberTimeEn, bn: form.chamberTimeBn }}
          onDaysChange={(days) => set("availableDays", days)}
          onChamberTimeChange={(ct) => {
            set("chamberTimeEn", ct.en);
            set("chamberTimeBn", ct.bn);
            setErrors(e => ({...e, chamberTimeEn: undefined, chamberTimeBn: undefined}));
          }}
          showTitle={false}
        />
      </section>

      {/* 📞 Contact */}
      <section className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-gray-100 dark:border-gray-800">
          <span>📞</span>
          <h2 className="font-bold text-gray-900 dark:text-gray-100 text-sm">Contact Information <span className="text-red-500">*</span></h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField label="Phone" required>
            <FormInput value={form.phone} onChange={e => { set("phone", e.target.value); setErrors(e => ({...e, phone: undefined})); }} placeholder="+8801711-234567" />
          </FormField>
          <FormField label="Email">
            <FormInput type="email" value={form.email} onChange={e => { set("email", e.target.value); setErrors(e => ({...e, email: undefined})); }} placeholder="doctor@hospital.com" />
          </FormField>
          <FormField label="Address (English)" required>
            <FormInput value={form.addressEn} onChange={e => { set("addressEn", e.target.value); setErrors(e => ({...e, addressEn: undefined})); }} placeholder="Mirsarai General Hospital" />
          </FormField>
          <FormField label="Address (বাংলা)" required>
            <FormInput value={form.addressBn} onChange={e => { set("addressBn", e.target.value); setErrors(e => ({...e, addressBn: undefined})); }} placeholder="মীরসরাই জেনারেল হাসপাতাল" />
          </FormField>
        </div>
      </section>

      {/* ⭐ Media */}
      <section className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 space-y-5">
        <div className="flex items-center gap-2 pb-3 border-b border-gray-100 dark:border-gray-800">
          <span className="text-lg">⭐</span>
          <div>
            <h2 className="font-bold text-gray-900 dark:text-gray-100 text-sm">Media (Important)</h2>
            <p className="text-xs text-gray-400 mt-0.5">Profile image appears on both <strong>/doctors</strong> listing and <strong>/doctors/[slug]</strong> detail page</p>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <ImageUploader label="Profile Photo" value={form.image} onChange={v => set("image", v)} onUpload={uploadImage}
            helpText="Recommended: 400×500px JPG/PNG (portrait orientation)" />
          <ImageUploader label="Banner Image (Optional)" value={form.bannerImage} onChange={v => set("bannerImage", v)} onUpload={uploadImage}
            helpText="Wide banner image for doctor profile header" />
        </div>
        <FormField label="Or paste external image URL">
          <FormInput value={form.image} onChange={e => set("image", e.target.value)} placeholder="https://example.com/image.jpg" />
        </FormField>
      </section>

      {/* SEO */}
      <SeoFields
        value={form.seo}
        onChange={(v: SeoValue) => set("seo", v)}
        helpText="SEO fields for /doctors/[slug] page"
      />

      {/* Save footer */}
      <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100 dark:border-gray-800">
        <button onClick={() => router.push("/super-admin/cms/doctors")} className="px-5 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 text-sm font-semibold text-gray-600 dark:text-gray-400 hover:bg-gray-100 transition-colors">
          Cancel
        </button>
        <button onClick={handleSave} disabled={saving}
          className="px-6 py-2.5 bg-[#1E2B7A] hover:bg-[#76BC21] text-white rounded-xl text-sm font-bold transition-all shadow-md disabled:opacity-50 flex items-center gap-2">
          <Save className="h-4 w-4" />
          {saving ? "Saving..." : "Create Doctor"}
        </button>
      </div>
    </div>
  );
}
