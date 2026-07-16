"use client";
import { useState, useEffect, useCallback } from "react";
import { getImageUrl } from "@/lib/getImageUrl";
import {
  UserCheck, Mail, Phone, Building2, Award, Calendar,
  Edit2, Save, X, Camera, GraduationCap, Briefcase, Loader2,
} from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { useMyLabAdminProfile, useUpdateMyLabAdminProfile } from "@/lib/hooks/useMyLabAdminProfile";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { uploadProfilePhoto } from "@/lib/services/api";
import { type LabAdminProfileData } from "@/lib/services/api";
interface FormState {
  profilePhoto: string;
  gender: string;
  dateOfBirth: string;
  address: string;
  qualification: string;
  experience: number;
}

const emptyForm: FormState = {
  profilePhoto: "",
  gender: "",
  dateOfBirth: "",
  address: "",
  qualification: "",
  experience: 0,
};

export default function LabAdminProfilePage() {
  const { user, refreshUser } = useAuth();
  const router = useRouter();
  const { data: profile, isLoading, isError } = useMyLabAdminProfile();
  const updateMutation = useUpdateMyLabAdminProfile();

  const isCompletionMode = user?.profileCompleted === false;
  const [editing, setEditing] = useState(isCompletionMode);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [formErrors, setFormErrors] = useState<Partial<Record<keyof FormState, string>>>({});
  const [saving, setSaving] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [saveMessage, setSaveMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    if (profile) {
      setForm({
        profilePhoto: profile.profilePhoto || "",
        gender: profile.gender || "",
        dateOfBirth: profile.dateOfBirth ? new Date(profile.dateOfBirth).toISOString().split("T")[0] : "",
        address: profile.address || "",
        qualification: profile.qualification || "",
        experience: profile.experience || 0,
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

  const validate = useCallback((): boolean => {
    const errors: Partial<Record<keyof FormState, string>> = {};
    if (!form.profilePhoto.trim()) errors.profilePhoto = "Profile photo is required";
    if (!form.gender.trim()) errors.gender = "Gender is required";
    if (!form.dateOfBirth.trim()) errors.dateOfBirth = "Date of birth is required";
    if (!form.address.trim()) errors.address = "Address is required";
    if (!form.qualification.trim()) errors.qualification = "Qualification is required";
    if (form.experience < 1) errors.experience = "Experience must be at least 1 year";
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  }, [form]);

  const handleSave = useCallback(async () => {
    if (!validate()) return;
    setSaving(true);
    try {
      const payload: Partial<LabAdminProfileData> = {
        profilePhoto: form.profilePhoto,
        gender: form.gender,
        dateOfBirth: form.dateOfBirth || undefined,
        address: form.address,
        qualification: form.qualification,
        experience: form.experience,
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
        profilePhoto: profile.profilePhoto || "",
        gender: profile.gender || "",
        dateOfBirth: profile.dateOfBirth ? new Date(profile.dateOfBirth).toISOString().split("T")[0] : "",
        address: profile.address || "",
        qualification: profile.qualification || "",
        experience: profile.experience || 0,
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

  if (isCompletionMode || editing) {
    return (
      <div className="space-y-6">
        <PageHeader
          title={isCompletionMode ? "Complete Your Profile" : "Edit Profile"}
          description={isCompletionMode ? "Please complete your information to access the lab dashboard." : "Update your profile information"}
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
            You must complete your profile before accessing the lab dashboard.
          </div>
        )}

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-6 flex flex-col items-center text-center">
            <div className="mb-4 relative">
              <div className="h-24 w-24 rounded-full bg-gradient-to-br from-violet-600 to-purple-600 flex items-center justify-center text-white text-3xl font-bold shadow-lg">
                {form.profilePhoto ? (
                  <img src={getImageUrl(form.profilePhoto)} alt="Profile" className="h-full w-full rounded-full object-cover" />
                ) : (
                  (user?.name || "L").charAt(0)
                )}
              </div>
              <label className={`absolute -bottom-1 -right-1 h-8 w-8 rounded-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 flex items-center justify-center ${isUploadingImage ? 'cursor-not-allowed' : 'cursor-pointer'} shadow hover:bg-gray-50 dark:hover:bg-gray-700 transition`}>
                <Camera className="h-4 w-4 text-gray-500" />
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  disabled={isUploadingImage}
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    setIsUploadingImage(true);
                    try {
                      const { url } = await uploadProfilePhoto(file);
                      updateField("profilePhoto", url);
                    } catch (err: unknown) {
                      const message = err instanceof Error ? err.message : "Failed to upload photo";
                      setSaveMessage({ type: "error", text: message });
                    } finally {
                      setIsUploadingImage(false);
                    }
                  }}
                />
              </label>
            </div>
            {formErrors.profilePhoto && <p className="mt-2 text-xs text-red-500">{formErrors.profilePhoto}</p>}
            <div className="mt-6 w-full space-y-3 border-t border-gray-100 dark:border-gray-800 pt-5">
              <FormField label="Gender" required error={formErrors.gender}>
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
              <FormField label="Date of Birth" required error={formErrors.dateOfBirth}>
                <input
                  type="date"
                  value={form.dateOfBirth}
                  onChange={(e) => updateField("dateOfBirth", e.target.value)}
                  className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 text-sm"
                />
              </FormField>
              <FormField label="Address" required error={formErrors.address}>
                <textarea
                  value={form.address}
                  onChange={(e) => updateField("address", e.target.value)}
                  rows={2}
                  className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 text-sm resize-none"
                />
              </FormField>
            </div>
          </div>

          <div className="lg:col-span-2 space-y-5">
            <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-6">
              <h3 className="mb-4 font-semibold text-gray-900 dark:text-gray-100">Professional Information</h3>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <FormField label="Qualification" required error={formErrors.qualification}>
                  <input
                    value={form.qualification}
                    onChange={(e) => updateField("qualification", e.target.value)}
                    placeholder="e.g. MSc in Microbiology, MLT"
                    className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 text-sm focus:border-violet-600 focus:outline-none focus:ring-1 focus:ring-violet-600"
                  />
                </FormField>
                <FormField label="Experience (years)" required error={formErrors.experience}>
                  <input
                    type="number"
                    min={0}
                    value={form.experience}
                    onChange={(e) => updateField("experience", parseInt(e.target.value) || 0)}
                    className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 text-sm focus:border-violet-600 focus:outline-none focus:ring-1 focus:ring-violet-600"
                  />
                </FormField>
              </div>
            </div>

            {profile && (
              <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-6">
                <h3 className="mb-4 font-semibold text-gray-900 dark:text-gray-100">Assigned Information <span className="text-gray-400 font-normal">(read-only)</span></h3>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <p className="text-xs font-medium text-gray-400">Department</p>
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100 mt-1">{profile.department || "—"}</p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-400">Designation</p>
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100 mt-1">{profile.designation || "—"}</p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-400">Branch</p>
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100 mt-1">{profile.branch || "—"}</p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-400">Employment Type</p>
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100 mt-1">{profile.employmentType ? profile.employmentType.charAt(0).toUpperCase() + profile.employmentType.slice(1) : "—"}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (isError || !profile) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-200 dark:border-gray-700 p-12 text-center text-gray-400">
        <p className="mb-4">Lab admin profile not found. Please complete your profile.</p>
        <Button onClick={() => setEditing(true)}>
          <Edit2 className="h-4 w-4 mr-1.5" />Complete Profile
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="My Profile"
        description="View and manage your profile information"
        icon={UserCheck}
      >
        <Button size="sm" variant="outline" onClick={() => setEditing(true)}>
          <Edit2 className="h-4 w-4 mr-1.5" />Edit Profile
        </Button>
      </PageHeader>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-6 flex flex-col items-center text-center">
          <div className="mb-4 flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-violet-600 to-purple-600 text-white text-3xl font-bold shadow-lg overflow-hidden">
            {profile.profilePhoto ? (
              <img src={getImageUrl(profile.profilePhoto)} alt="Profile" className="h-full w-full object-cover" />
            ) : (
              (user?.name || "L").charAt(0)
            )}
          </div>
          <div className="flex items-center gap-2 mb-1">
            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">{user?.name || "Lab Admin"}</h2>
            {profile.labAdminCode && (
              <Badge variant="success">{profile.labAdminCode}</Badge>
            )}
          </div>
          <p className="text-sm text-violet-600 dark:text-violet-400 font-medium mt-0.5">{profile.department}</p>
          <Badge variant="success" className="mt-3">Active</Badge>

          <div className="mt-6 w-full space-y-3 border-t border-gray-100 dark:border-gray-800 pt-5">
            <ProfileInfoItem icon={<GraduationCap className="h-4 w-4 text-violet-600" />} label="Qualification" value={profile.qualification || "—"} />
            <ProfileInfoItem icon={<Briefcase className="h-4 w-4 text-violet-500" />} label="Experience" value={`${profile.experience} years`} />
            <ProfileInfoItem icon={<Calendar className="h-4 w-4 text-gray-500" />} label="Joined" value={profile.createdAt ? new Date(profile.createdAt).toLocaleDateString() : "—"} />
          </div>
        </div>

        <div className="lg:col-span-2 space-y-5">
          <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-6">
            <h3 className="mb-4 font-semibold text-gray-900 dark:text-gray-100">Professional Information</h3>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <p className="text-xs font-medium text-gray-400">Qualification</p>
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100 mt-1">{profile.qualification || "—"}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-gray-400">Experience</p>
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100 mt-1">{profile.experience ? `${profile.experience} years` : "—"}</p>
              </div>
            </div>
          </div>

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

          <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-6">
            <h3 className="mb-4 font-semibold text-gray-900 dark:text-gray-100">Assigned Information</h3>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <p className="text-xs font-medium text-gray-400">Department</p>
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100 mt-1">{profile.department || "—"}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-gray-400">Designation</p>
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100 mt-1">{profile.designation || "—"}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-gray-400">Branch</p>
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100 mt-1">{profile.branch || "—"}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-gray-400">Employment Type</p>
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100 mt-1">{profile.employmentType ? profile.employmentType.charAt(0).toUpperCase() + profile.employmentType.slice(1) : "—"}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

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
