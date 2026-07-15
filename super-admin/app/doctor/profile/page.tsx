"use client";
import { useState, useEffect, useCallback } from "react";
import {
  UserCheck, Mail, Phone, Building2, Award, Calendar,
  Edit2, Save, X, Stethoscope, Clock, Camera, Globe, Wifi, WifiOff,
} from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { useMyDoctorProfile, useUpdateMyDoctorProfile } from "@/lib/hooks/useMyDoctorProfile";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import type { DoctorProfileData } from "@/lib/services/api";

const AVAILABILITY_DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

interface FormState {
  specialization: string;
  qualification: string;
  experience: number;
  bmdcNumber: string;
  consultationFee: number;
  availableDays: string[];
  profilePhoto: string;
  gender: string;
  dateOfBirth: string;
  address: string;
  biography: string;

  // ── New bilingual / extra fields ─────────────────────────────────────────
  nameBn: string;
  aboutEn: string;
  aboutBn: string;
  chamberTimeEn: string;
  chamberTimeBn: string;
  services: { en: string; bn: string }[];
  languages: string[];
  onlineConsultation: boolean;
  offlineConsultation: boolean;
  appointmentAvailable: boolean;
  available: boolean;
}

const emptyForm: FormState = {
  specialization: "",
  qualification: "",
  experience: 0,
  bmdcNumber: "",
  consultationFee: 0,
  availableDays: [],
  profilePhoto: "",
  gender: "other",
  dateOfBirth: "",
  address: "",
  biography: "",
  nameBn: "",
  aboutEn: "",
  aboutBn: "",
  chamberTimeEn: "",
  chamberTimeBn: "",
  services: [],
  languages: ["Bangla", "English"],
  onlineConsultation: false,
  offlineConsultation: true,
  appointmentAvailable: true,
  available: true,
};

export default function DoctorProfilePage() {
  const { user, refreshUser } = useAuth();
  const router = useRouter();
  const { data: profile, isLoading, isError } = useMyDoctorProfile();
  const updateMutation = useUpdateMyDoctorProfile();

  const isCompletionMode = user?.profileCompleted === false;
  const [editing, setEditing] = useState(isCompletionMode);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [formErrors, setFormErrors] = useState<Partial<Record<keyof FormState, string>>>({});
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Load profile data into form
  useEffect(() => {
    if (profile) {
      setForm({
        specialization: profile.specialization || "",
        qualification: profile.qualification || "",
        experience: profile.experience || 0,
        bmdcNumber: profile.bmdcNumber || "",
        consultationFee: profile.consultationFee || 0,
        availableDays: profile.availableDays || [],
        profilePhoto: profile.profilePhoto || "",
        gender: profile.gender || "other",
        dateOfBirth: profile.dateOfBirth ? new Date(profile.dateOfBirth).toISOString().split("T")[0] : "",
        address: profile.address || "",
        biography: profile.biography || "",
        nameBn: profile.name?.bn || "",
        aboutEn: profile.about?.en || profile.biography || "",
        aboutBn: profile.about?.bn || "",
        chamberTimeEn: profile.chamberTime?.en || "",
        chamberTimeBn: profile.chamberTime?.bn || "",
        services: profile.services || [],
        languages: profile.languages || ["Bangla", "English"],
        onlineConsultation: profile.onlineConsultation || false,
        offlineConsultation: profile.offlineConsultation !== false,
        appointmentAvailable: profile.appointmentAvailable !== false,
        available: profile.available !== false,
      });
    }
  }, [profile]);

  const updateField = useCallback(
    <K extends keyof FormState>(key: K, value: FormState[K]) => {
      setForm((prev) => ({ ...prev, [key]: value }));
      setFormErrors((prev) => ({ ...prev, [key]: undefined }));
    },
    []
  );

  const toggleDay = useCallback((day: string) => {
    setForm((prev) => ({
      ...prev,
      availableDays: prev.availableDays.includes(day)
        ? prev.availableDays.filter((d) => d !== day)
        : [...prev.availableDays, day],
    }));
  }, []);

  const validate = useCallback((): boolean => {
    const errors: Partial<Record<keyof FormState, string>> = {};
    if (!form.specialization.trim()) errors.specialization = "Specialization is required";
    if (!form.qualification.trim()) errors.qualification = "Qualification is required";
    if (!form.bmdcNumber.trim()) errors.bmdcNumber = "BMDC registration number is required";
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  }, [form]);

  const handleSave = useCallback(async () => {
    if (!validate()) return;
    setSaving(true);
    try {
      const payload: Partial<DoctorProfileData> = {
        specialization: form.specialization,
        qualification: form.qualification,
        experience: form.experience,
        bmdcNumber: form.bmdcNumber,
        consultationFee: form.consultationFee,
        availableDays: form.availableDays,
        profilePhoto: form.profilePhoto,
        gender: form.gender,
        dateOfBirth: form.dateOfBirth || undefined,
        address: form.address,
        biography: form.biography,
        name: { en: user?.fullName || "", bn: form.nameBn },
        about: { en: form.aboutEn, bn: form.aboutBn },
        chamberTime: { en: form.chamberTimeEn, bn: form.chamberTimeBn },
        services: form.services,
        languages: form.languages,
        onlineConsultation: form.onlineConsultation,
        offlineConsultation: form.offlineConsultation,
        appointmentAvailable: form.appointmentAvailable,
        available: form.available,
      };
      await updateMutation.mutateAsync(payload);
      await refreshUser();
      setSaveMessage({ type: "success", text: isCompletionMode ? "Profile completed successfully!" : "Profile updated successfully!" });
      setEditing(false);
      if (isCompletionMode) {
        setTimeout(() => router.refresh(), 1500);
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to save profile";
      setSaveMessage({ type: "error", text: message });
    } finally {
      setSaving(false);
    }
  }, [form, validate, updateMutation, isCompletionMode, router, refreshUser]);

  const handleCancel = useCallback(() => {
    if (profile) {
      setForm({
        specialization: profile.specialization || "",
        qualification: profile.qualification || "",
        experience: profile.experience || 0,
        bmdcNumber: profile.bmdcNumber || "",
        consultationFee: profile.consultationFee || 0,
        availableDays: profile.availableDays || [],
        profilePhoto: profile.profilePhoto || "",
        gender: profile.gender || "other",
        dateOfBirth: profile.dateOfBirth ? new Date(profile.dateOfBirth).toISOString().split("T")[0] : "",
        address: profile.address || "",
        biography: profile.biography || "",
        nameBn: profile.name?.bn || "",
        aboutEn: profile.about?.en || profile.biography || "",
        aboutBn: profile.about?.bn || "",
        chamberTimeEn: profile.chamberTime?.en || "",
        chamberTimeBn: profile.chamberTime?.bn || "",
        services: profile.services || [],
        languages: profile.languages || ["Bangla", "English"],
        onlineConsultation: profile.onlineConsultation || false,
        offlineConsultation: profile.offlineConsultation !== false,
        appointmentAvailable: profile.appointmentAvailable !== false,
        available: profile.available !== false,
      });
    }
    setEditing(false);
    setFormErrors({});
  }, [profile]);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-10 w-48 animate-pulse rounded-xl bg-gray-100 dark:bg-gray-800" />
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="h-80 animate-pulse rounded-2xl bg-gray-100 dark:bg-gray-800" />
          <div className="lg:col-span-2 h-80 animate-pulse rounded-2xl bg-gray-100 dark:bg-gray-800" />
        </div>
      </div>
    );
  }

  // ── Profile Completion Mode ──────────────────────────────────────────────────
  if (isCompletionMode || editing) {
    return (
      <div className="space-y-6">
        <PageHeader
          title={isCompletionMode ? "Complete Your Profile" : "Edit Profile"}
          description={isCompletionMode ? "Please complete your professional information to access the dashboard." : "Update your professional information"}
          icon={UserCheck}
        >
          <div className="flex items-center gap-2">
            <Button size="sm" onClick={handleSave} loading={saving}>
              <Save className="h-4 w-4 mr-1.5" />{isCompletionMode ? "Save & Continue" : "Save"}
            </Button>
            {!isCompletionMode && (
              <Button size="sm" variant="outline" onClick={handleCancel}>
                <X className="h-4 w-4 mr-1.5" />Cancel
              </Button>
            )}
          </div>
        </PageHeader>

        {saveMessage && (
          <div className={`rounded-2xl border p-4 text-sm ${
            saveMessage.type === "success"
              ? "border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400"
              : "border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400"
          }`}>
            {saveMessage.text}
          </div>
        )}

        {isCompletionMode && (
          <div className="rounded-2xl border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-900/20 p-4 text-sm text-amber-700 dark:text-amber-400">
            You must complete your profile before accessing the doctor dashboard.
          </div>
        )}

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Profile Photo (left sidebar) */}
          <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-6 flex flex-col items-center text-center">
            <div className="mb-4 relative">
              <div className="h-24 w-24 rounded-full bg-gradient-to-br from-[#1E2B7A] to-[#76BC21] flex items-center justify-center text-white text-3xl font-bold shadow-lg">
                {form.profilePhoto ? (
                  <img src={form.profilePhoto} alt="Profile" className="h-full w-full rounded-full object-cover" />
                ) : (
                  (user?.name || "D").charAt(0)
                )}
              </div>
              <label className="absolute -bottom-1 -right-1 h-8 w-8 rounded-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 flex items-center justify-center cursor-pointer shadow hover:bg-gray-50 dark:hover:bg-gray-700 transition">
                <Camera className="h-4 w-4 text-gray-500" />
                <input
                  type="text"
                  className="hidden"
                  placeholder="Photo URL"
                  value={form.profilePhoto}
                  onChange={(e) => updateField("profilePhoto", e.target.value)}
                />
              </label>
            </div>
            <input
              type="text"
              placeholder="Profile photo URL"
              value={form.profilePhoto}
              onChange={(e) => updateField("profilePhoto", e.target.value)}
              className="w-full text-center rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-3 py-1.5 text-xs text-gray-600 dark:text-gray-400 focus:outline-none focus:border-[#1E2B7A]"
            />
            <div className="mt-6 w-full space-y-3 border-t border-gray-100 dark:border-gray-800 pt-5">
              <FormField label="Gender" error={formErrors.gender}>
                <select
                  value={form.gender}
                  onChange={(e) => updateField("gender", e.target.value)}
                  className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 text-sm"
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </FormField>
              <FormField label="Date of Birth" error={formErrors.dateOfBirth}>
                <input
                  type="date"
                  value={form.dateOfBirth}
                  onChange={(e) => updateField("dateOfBirth", e.target.value)}
                  className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 text-sm"
                />
              </FormField>
              <FormField label="Address" error={formErrors.address}>
                <textarea
                  value={form.address}
                  onChange={(e) => updateField("address", e.target.value)}
                  rows={2}
                  className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 text-sm resize-none"
                />
              </FormField>
            </div>
          </div>

          {/* Main form */}
          <div className="lg:col-span-2 space-y-5">
            {/* Professional Info */}
            <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-6">
              <h3 className="mb-4 font-semibold text-gray-900 dark:text-gray-100">Professional Information</h3>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <FormField label="Specialization" required error={formErrors.specialization}>
                  <input
                    value={form.specialization}
                    onChange={(e) => updateField("specialization", e.target.value)}
                    placeholder="e.g. Interventional Cardiology"
                    className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 text-sm focus:border-[#1E2B7A] focus:outline-none focus:ring-1 focus:ring-[#1E2B7A]"
                  />
                </FormField>
                <FormField label="Qualification" required error={formErrors.qualification}>
                  <input
                    value={form.qualification}
                    onChange={(e) => updateField("qualification", e.target.value)}
                    placeholder="e.g. MBBS, FCPS"
                    className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 text-sm focus:border-[#1E2B7A] focus:outline-none focus:ring-1 focus:ring-[#1E2B7A]"
                  />
                </FormField>
                <FormField label="Experience (years)" error={formErrors.experience}>
                  <input
                    type="number"
                    min={0}
                    value={form.experience}
                    onChange={(e) => updateField("experience", parseInt(e.target.value) || 0)}
                    className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 text-sm focus:border-[#1E2B7A] focus:outline-none focus:ring-1 focus:ring-[#1E2B7A]"
                  />
                </FormField>
                <FormField label="BMDC Registration No." required error={formErrors.bmdcNumber}>
                  <input
                    value={form.bmdcNumber}
                    onChange={(e) => updateField("bmdcNumber", e.target.value)}
                    placeholder="e.g. A-12345"
                    className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 text-sm focus:border-[#1E2B7A] focus:outline-none focus:ring-1 focus:ring-[#1E2B7A]"
                  />
                </FormField>
                <FormField label="Consultation Fee (৳)" error={formErrors.consultationFee}>
                  <input
                    type="number"
                    min={0}
                    value={form.consultationFee}
                    onChange={(e) => updateField("consultationFee", parseInt(e.target.value) || 0)}
                    className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 text-sm focus:border-[#1E2B7A] focus:outline-none focus:ring-1 focus:ring-[#1E2B7A]"
                  />
                </FormField>
              </div>
            </div>

            {/* Name (Bengali) */}
            <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-6">
              <h3 className="mb-4 font-semibold text-gray-900 dark:text-gray-100">Name <span className="text-gray-400 font-normal">(বাংলা)</span></h3>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <FormField label="English">
                  <input
                    value={user?.fullName || ""}
                    disabled
                    className="w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-3 py-2 text-sm text-gray-500"
                  />
                </FormField>
                <FormField label="বাংলা">
                  <input
                    value={form.nameBn}
                    onChange={(e) => updateField("nameBn", e.target.value)}
                    placeholder="e.g. ডা. মোঃ আব্দুল্লাহ আল মামুন"
                    className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 text-sm focus:border-[#1E2B7A] focus:outline-none focus:ring-1 focus:ring-[#1E2B7A]"
                  />
                </FormField>
              </div>
            </div>

            {/* About (Bilingual) */}
            <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-6">
              <h3 className="mb-4 font-semibold text-gray-900 dark:text-gray-100">About <span className="text-gray-400 font-normal">(bilingual)</span></h3>
              <div className="space-y-3">
                <FormField label="English">
                  <textarea
                    value={form.aboutEn}
                    onChange={(e) => updateField("aboutEn", e.target.value)}
                    rows={3}
                    placeholder="Tell patients about yourself in English..."
                    className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 text-sm resize-none focus:border-[#1E2B7A] focus:outline-none focus:ring-1 focus:ring-[#1E2B7A]"
                  />
                </FormField>
                <FormField label="বাংলা">
                  <textarea
                    value={form.aboutBn}
                    onChange={(e) => updateField("aboutBn", e.target.value)}
                    rows={3}
                    placeholder="বাংলায় আপনার সম্পর্কে লিখুন..."
                    className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 text-sm resize-none focus:border-[#1E2B7A] focus:outline-none focus:ring-1 focus:ring-[#1E2B7A]"
                  />
                </FormField>
              </div>
            </div>

            {/* Chamber Time (Bilingual) */}
            <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-6">
              <h3 className="mb-4 font-semibold text-gray-900 dark:text-gray-100">Chamber Time <span className="text-gray-400 font-normal">(bilingual)</span></h3>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <FormField label="English">
                  <input
                    value={form.chamberTimeEn}
                    onChange={(e) => updateField("chamberTimeEn", e.target.value)}
                    placeholder="e.g. Sat-Thu | 5:00 PM - 9:00 PM"
                    className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 text-sm focus:border-[#1E2B7A] focus:outline-none focus:ring-1 focus:ring-[#1E2B7A]"
                  />
                </FormField>
                <FormField label="বাংলা">
                  <input
                    value={form.chamberTimeBn}
                    onChange={(e) => updateField("chamberTimeBn", e.target.value)}
                    placeholder="e.g. শনি-বৃহ | বিকাল ৫:০০ - রাত ৯:০০"
                    className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 text-sm focus:border-[#1E2B7A] focus:outline-none focus:ring-1 focus:ring-[#1E2B7A]"
                  />
                </FormField>
              </div>
            </div>

            {/* Services */}
            <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-6">
              <h3 className="mb-4 font-semibold text-gray-900 dark:text-gray-100">Services <span className="text-gray-400 font-normal">(bilingual)</span></h3>
              {form.services.map((svc, idx) => (
                <div key={idx} className="flex items-start gap-2 mb-2">
                  <div className="flex-1 grid grid-cols-2 gap-2">
                    <input
                      value={svc.en}
                      onChange={(e) => {
                        const updated = [...form.services];
                        updated[idx] = { ...updated[idx], en: e.target.value };
                        updateField("services", updated);
                      }}
                      placeholder="Service (English)"
                      className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 text-sm focus:border-[#1E2B7A] focus:outline-none focus:ring-1 focus:ring-[#1E2B7A]"
                    />
                    <input
                      value={svc.bn}
                      onChange={(e) => {
                        const updated = [...form.services];
                        updated[idx] = { ...updated[idx], bn: e.target.value };
                        updateField("services", updated);
                      }}
                      placeholder="Service (বাংলা)"
                      className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 text-sm focus:border-[#1E2B7A] focus:outline-none focus:ring-1 focus:ring-[#1E2B7A]"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      const updated = form.services.filter((_, i) => i !== idx);
                      updateField("services", updated);
                    }}
                    className="mt-1 p-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
              <Button
                size="sm"
                variant="outline"
                onClick={() => updateField("services", [...form.services, { en: "", bn: "" }])}
                className="mt-2"
              >
                + Add Service
              </Button>
            </div>

            {/* Languages */}
            <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-6">
              <h3 className="mb-4 font-semibold text-gray-900 dark:text-gray-100">Languages</h3>
              <input
                value={form.languages.join(", ")}
                onChange={(e) => updateField("languages", e.target.value.split(",").map(s => s.trim()).filter(Boolean))}
                placeholder="e.g. Bangla, English, Hindi"
                className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 text-sm focus:border-[#1E2B7A] focus:outline-none focus:ring-1 focus:ring-[#1E2B7A]"
              />
              <p className="mt-1 text-xs text-gray-400">Comma-separated list of languages you speak</p>
            </div>

            {/* Consultation Options */}
            <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-6">
              <h3 className="mb-4 font-semibold text-gray-900 dark:text-gray-100">Consultation Options</h3>
              <div className="flex flex-wrap gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.onlineConsultation}
                    onChange={(e) => updateField("onlineConsultation", e.target.checked)}
                    className="rounded border-gray-300 text-[#1E2B7A] focus:ring-[#1E2B7A]"
                  />
                  <Wifi className="h-4 w-4 text-[#76BC21]" />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Online Consultation</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.offlineConsultation}
                    onChange={(e) => updateField("offlineConsultation", e.target.checked)}
                    className="rounded border-gray-300 text-[#1E2B7A] focus:ring-[#1E2B7A]"
                  />
                  <WifiOff className="h-4 w-4 text-gray-500" />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Offline Consultation</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.appointmentAvailable}
                    onChange={(e) => updateField("appointmentAvailable", e.target.checked)}
                    className="rounded border-gray-300 text-[#1E2B7A] focus:ring-[#1E2B7A]"
                  />
                  <Calendar className="h-4 w-4 text-[#1E2B7A]" />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Appointments Available</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.available}
                    onChange={(e) => updateField("available", e.target.checked)}
                    className="rounded border-gray-300 text-[#1E2B7A] focus:ring-[#1E2B7A]"
                  />
                  <Globe className="h-4 w-4 text-green-500" />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Available for patients</span>
                </label>
              </div>
            </div>

            {/* Available Days */}
            <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-6">
              <h3 className="mb-4 font-semibold text-gray-900 dark:text-gray-100">Available Days</h3>
              <div className="flex flex-wrap gap-2">
                {AVAILABILITY_DAYS.map((day) => {
                  const isSelected = form.availableDays.includes(day);
                  return (
                    <button
                      key={day}
                      type="button"
                      onClick={() => toggleDay(day)}
                      className={[
                        "rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors",
                        isSelected
                          ? "border-[#76BC21]/40 bg-[#76BC21]/10 text-[#76BC21] dark:border-[#76BC21]/30 dark:bg-[#76BC21]/10"
                          : "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-500 hover:border-gray-300",
                      ].join(" ")}
                    >
                      {day}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Biography */}
            <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-6">
              <h3 className="mb-4 font-semibold text-gray-900 dark:text-gray-100">Biography <span className="text-gray-400 font-normal">(optional)</span></h3>
              <textarea
                value={form.biography}
                onChange={(e) => updateField("biography", e.target.value)}
                rows={4}
                placeholder="Tell patients about yourself, your expertise, and approach to care..."
                className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 text-sm resize-none focus:border-[#1E2B7A] focus:outline-none focus:ring-1 focus:ring-[#1E2B7A]"
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── View Mode (profile exists and no editing) ────────────────────────────────
  if (isError || !profile) {
    return (
      <div className="rounded-2xl border border-dashed border-gray-200 dark:border-gray-700 p-12 text-center text-gray-400">
        Doctor profile not found. Please complete your profile.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="My Profile"
        description="View and manage your professional information"
        icon={UserCheck}
      >
        <Button size="sm" variant="outline" onClick={() => setEditing(true)}>
          <Edit2 className="h-4 w-4 mr-1.5" />Edit Profile
        </Button>
      </PageHeader>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Profile card */}
        <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-6 flex flex-col items-center text-center">
          <div className="mb-4 flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-[#1E2B7A] to-[#76BC21] text-white text-3xl font-bold shadow-lg">
            {profile.profilePhoto ? (
              <img src={profile.profilePhoto} alt="Profile" className="h-full w-full rounded-full object-cover" />
            ) : (
              (user?.name || "D").charAt(0)
            )}
          </div>
          <div className="flex items-center gap-2 mb-1">
            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">{user?.name || "Doctor"}</h2>
            {profile.doctorCode && (
              <Badge variant="success">{profile.doctorCode}</Badge>
            )}
          </div>
          <p className="text-sm text-[#1E2B7A] dark:text-blue-400 font-medium mt-0.5">{profile.specialization}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{profile.department}</p>
          <Badge variant="success" className="mt-3">Active</Badge>

          <div className="mt-6 w-full space-y-3 border-t border-gray-100 dark:border-gray-800 pt-5">
            <ProfileInfoItem icon={<Stethoscope className="h-4 w-4 text-[#1E2B7A] dark:text-blue-400" />} label="Experience" value={`${profile.experience} years`} />
            <ProfileInfoItem icon={<Award className="h-4 w-4 text-[#76BC21]" />} label="Qualification" value={profile.qualification} />
            <ProfileInfoItem icon={<Calendar className="h-4 w-4 text-gray-500" />} label="BMDC No." value={profile.bmdcNumber} />
            <ProfileInfoItem icon={<Calendar className="h-4 w-4 text-gray-500" />} label="Joined" value={profile.createdAt ? new Date(profile.createdAt).toLocaleDateString() : "—"} />
          </div>
        </div>

        {/* Details panel */}
        <div className="lg:col-span-2 space-y-5">
          {/* Contact & Professional Info */}
          <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-6">
            <h3 className="mb-4 font-semibold text-gray-900 dark:text-gray-100">Professional Information</h3>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <p className="text-xs font-medium text-gray-400">Department</p>
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100 mt-1">{profile.department || "—"}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-gray-400">Specialization</p>
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100 mt-1">{profile.specialization || "—"}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-gray-400">Qualification</p>
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100 mt-1">{profile.qualification || "—"}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-gray-400">Experience</p>
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100 mt-1">{profile.experience ? `${profile.experience} years` : "—"}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-gray-400">BMDC Registration No.</p>
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100 mt-1">{profile.bmdcNumber || "—"}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-gray-400">Consultation Fee</p>
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100 mt-1">{profile.consultationFee ? `৳${profile.consultationFee}` : "—"}</p>
              </div>
            </div>
          </div>

          {/* Personal Info */}
          <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-6">
            <h3 className="mb-4 font-semibold text-gray-900 dark:text-gray-100">Personal Information</h3>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <p className="text-xs font-medium text-gray-400">Gender</p>
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100 mt-1">{profile.gender ? profile.gender.charAt(0).toUpperCase() + profile.gender.slice(1) : "—"}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-gray-400">Date of Birth</p>
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100 mt-1">{profile.dateOfBirth ? new Date(profile.dateOfBirth).toLocaleDateString() : "—"}</p>
              </div>
              <div className="sm:col-span-2">
                <p className="text-xs font-medium text-gray-400">Address</p>
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100 mt-1">{profile.address || "—"}</p>
              </div>
            </div>
          </div>

          {/* Biography */}
          {profile.biography && (
            <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-6">
              <h3 className="mb-3 font-semibold text-gray-900 dark:text-gray-100">Biography</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 whitespace-pre-wrap">{profile.biography}</p>
            </div>
          )}

          {/* Weekly availability */}
          <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-6">
            <div className="mb-4 flex items-center gap-2">
              <Clock className="h-4 w-4 text-[#76BC21]" />
              <h3 className="font-semibold text-gray-900 dark:text-gray-100">Weekly Availability</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {AVAILABILITY_DAYS.map((day) => {
                const isAvailable = profile.availableDays?.includes(day);
                return (
                  <div
                    key={day}
                    className={[
                      "rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors",
                      isAvailable
                        ? "border-[#76BC21]/40 bg-[#76BC21]/10 text-[#76BC21] dark:border-[#76BC21]/30 dark:bg-[#76BC21]/10"
                        : "border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50 text-gray-400",
                    ].join(" ")}
                  >
                    {day}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Helper sub-components ──────────────────────────────────────────────────────

function ProfileInfoItem({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-800">
        {icon}
      </div>
      <div className="text-left">
        <p className="text-xs text-gray-400">{label}</p>
        <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{value}</p>
      </div>
    </div>
  );
}

function FormField({ label, required, error, children }: { label: string; required?: boolean; error?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="mb-1.5 flex items-center gap-1 text-xs font-medium text-gray-500 dark:text-gray-400">
        {label}
        {required && <span className="text-red-500">*</span>}
      </label>
      {children}
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
}
