"use client";

import { use, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save, CheckCircle2, Loader2 } from "lucide-react";
import { LanguageTabs } from "@/components/cms/LanguageTabs";
import { RichTextEditor } from "@/components/cms/RichTextEditor";
import { ImageUploader } from "@/components/cms/ImageUploader";
import { SeoFields } from "@/components/cms/SeoFields";
import { FormField, FormInput, FormSelect } from "@/components/ui/FormPage";
import { env } from "@/config/env";

const API_URL = env.apiUrl;
const DAYS = ["Saturday","Sunday","Monday","Tuesday","Wednesday","Thursday","Friday"];

type Bi = { en: string; bn: string };
const bi = (en = "", bn = ""): Bi => ({ en, bn });

export default function EditDoctorCmsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [langTab, setLangTab] = useState<"en" | "bn">("en");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

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

  const handleSave = async () => {
    const name = form.name as Bi;
    const spec = form.specialization as Bi;
    const dept = form.department as Bi;
    if (!name?.en || !spec?.en || !dept?.en || !form.qualification) {
      setError("Name (EN), Specialization (EN), Department (EN), Qualification required.");
      return;
    }
    setSaving(true); setError("");
    try {
      const payload = {
        name: form.name, designation: form.designation,
        specialization: form.specialization, department: form.department,
        qualification: form.qualification, registrationNumber: form.registrationNumber,
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
        <div className="rounded-xl border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20 px-4 py-3 text-sm text-red-600 dark:text-red-400">⚠️ {error}</div>
      )}

      {/* ⭐ Basic Information */}
      <section className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 space-y-4">
        <div className="pb-3 border-b border-gray-100 dark:border-gray-800">
          <h2 className="font-bold text-gray-900 dark:text-gray-100 text-sm">⭐ Basic Information</h2>
          <p className="text-xs text-gray-400 mt-0.5">📌 Updates doctor card on /doctors and /doctors/[slug] detail page</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField label={`Name (${langTab.toUpperCase()})`} required>
            <FormInput value={f("name")[langTab]} onChange={e => setBi("name", langTab, e.target.value)} placeholder="Dr. Name" />
          </FormField>
          <FormField label={`Designation (${langTab.toUpperCase()})`}>
            <FormInput value={f("designation")[langTab]} onChange={e => setBi("designation", langTab, e.target.value)} />
          </FormField>
          <FormField label={`Specialization (${langTab.toUpperCase()})`} required>
            <FormInput value={f("specialization")[langTab]} onChange={e => setBi("specialization", langTab, e.target.value)} />
          </FormField>
          <FormField label={`Department (${langTab.toUpperCase()})`} required>
            <FormInput value={f("department")[langTab]} onChange={e => setBi("department", langTab, e.target.value)} />
          </FormField>
          <FormField label="Qualification" required>
            <FormInput value={s("qualification")} onChange={e => set("qualification", e.target.value)} />
          </FormField>
          <FormField label="Experience (years)">
            <FormInput type="number" value={String(n("experienceYears"))} onChange={e => set("experienceYears", parseInt(e.target.value)||0)} />
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
      </section>

      {/* 📌 Biography */}
      <section className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 space-y-4">
        <div className="pb-3 border-b border-gray-100 dark:border-gray-800">
          <h2 className="font-bold text-gray-900 dark:text-gray-100 text-sm">📌 Biography</h2>
          <p className="text-xs text-gray-400 mt-0.5">Updates the About section on /doctors/[slug]</p>
        </div>
        <RichTextEditor
          label={`Biography — ${langTab === "en" ? "English" : "বাংলা"}`}
          value={f("about")[langTab]}
          onChange={v => setBi("about", langTab, v)}
          rows={5}
          helpText="Supports **bold**, *italic*, ## heading, - list"
        />
      </section>

      {/* 🔥 Consultation Schedule */}
      <section className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 space-y-4">
        <div className="pb-3 border-b border-gray-100 dark:border-gray-800">
          <h2 className="font-bold text-gray-900 dark:text-gray-100 text-sm">🔥 Consultation Schedule <span className="text-xs text-amber-500 font-normal">(Frequently Updated)</span></h2>
          <p className="text-xs text-gray-400 mt-0.5">Controls appointment availability on /doctors/[slug]</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <FormField label="Consultation Fee (৳)">
            <FormInput type="number" value={String(n("consultationFee"))} onChange={e => set("consultationFee", parseInt(e.target.value)||0)} />
          </FormField>
          <FormField label="Chamber Time (EN)">
            <FormInput value={s("chamberTimeEn")} onChange={e => set("chamberTimeEn", e.target.value)} />
          </FormField>
          <FormField label="Chamber Time (BN)">
            <FormInput value={s("chamberTimeBn")} onChange={e => set("chamberTimeBn", e.target.value)} />
          </FormField>
        </div>
        <div>
          <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Available Days</p>
          <div className="flex flex-wrap gap-2">
            {DAYS.map(day => {
              const days = (form.availableDays as string[]) || [];
              return (
                <button key={day} type="button"
                  onClick={() => set("availableDays", days.includes(day) ? days.filter(d => d !== day) : [...days, day])}
                  className={["px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors", days.includes(day) ? "bg-[#76BC21] text-white" : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400"].join(" ")}
                >
                  {day}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Contact */}
      <section className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 space-y-4">
        <h2 className="font-bold text-gray-900 dark:text-gray-100 text-sm pb-3 border-b border-gray-100 dark:border-gray-800">📞 Contact Information</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField label="Phone"><FormInput value={s("phone")} onChange={e => set("phone", e.target.value)} /></FormField>
          <FormField label="Email"><FormInput type="email" value={s("email")} onChange={e => set("email", e.target.value)} /></FormField>
          <FormField label="Address (EN)"><FormInput value={s("addressEn")} onChange={e => set("addressEn", e.target.value)} /></FormField>
          <FormField label="Address (BN)"><FormInput value={s("addressBn")} onChange={e => set("addressBn", e.target.value)} /></FormField>
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
      <SeoFields value={form.seo as Parameters<typeof SeoFields>[0]["value"]} onChange={v => set("seo", v)} helpText="SEO for /doctors/[slug] page" />

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
