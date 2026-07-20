"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Users } from "lucide-react";
import { FormPage, FormField, FormInput, FormSelect, FormSection } from "@/components/ui/FormPage";
import { useCreatePatient } from "@/lib/hooks/usePatients";
import { ApiError, formatApiError } from "@/lib/services/api";
import toast from "react-hot-toast";

const DEPARTMENTS = ["General Medicine","Cardiology","Orthopedics","Neurology","Gynecology","Pediatrics","Gastroenterology","Dermatology","ENT","Ophthalmology","Urology","Oncology","Radiology","Pathology","Emergency"];
const BLOOD_GROUPS = ["A+","A-","B+","B-","AB+","AB-","O+","O-"];

const FIELD_MAP: Record<string, string> = {
  "body.fullName": "name",
  "body.mobile": "phone",
  "body.email": "email",
  "body.dateOfBirth": "dob",
  "body.gender": "gender",
  "body.address": "address",
  "body.department": "department",
  "body.bloodGroup": "bloodGroup",
};

function calcAge(dob: string) {
  if (!dob) return 0;
  const today = new Date(), birth = new Date(dob);
  let age = today.getFullYear() - birth.getFullYear();
  if (today.getMonth() - birth.getMonth() < 0 || (today.getMonth() === birth.getMonth() && today.getDate() < birth.getDate())) age--;
  return age;
}

export default function AddPatientPage() {
  const router = useRouter();
  const createMutation = useCreatePatient();
  const today = new Date().toISOString().split("T")[0];

  const [form, setForm] = useState({ name: "", phone: "", email: "", dob: "", gender: "", address: "", department: "", bloodGroup: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const age = calcAge(form.dob);
  const set = (k: string, v: string) => { setForm(f => ({ ...f, [k]: v })); setErrors(e => { const n = { ...e }; delete n[k]; return n; }); };

  function validate() {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = "Name is required";
    if (!form.phone.trim()) e.phone = "Mobile is required";
    else if (!/^01[3-9]\d{8}$/.test(form.phone.replace(/[-\s]/g, ""))) e.phone = "Enter valid BD mobile number";
    if (!form.email.trim()) e.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) e.email = "Enter a valid email address";
    if (!form.dob) e.dob = "Date of birth is required";
    if (!form.gender) e.gender = "Gender is required";
    if (!form.address.trim()) e.address = "Address is required";
    if (!form.department) e.department = "Department is required";
    return e;
  }

  function handleSubmit() {
    const e = validate();
    if (Object.keys(e).length > 0) { setErrors(e); return; }

    createMutation.mutate({
      fullName: form.name.trim(),
      mobile: form.phone.trim(),
      email: form.email.trim(),
      dateOfBirth: form.dob,
      gender: form.gender.toLowerCase(),
      address: form.address.trim(),
      department: form.department,
      bloodGroup: form.bloodGroup || undefined,
    }, {
      onSuccess: () => {
        toast.success("Patient registered successfully");
        router.push("/super-admin/patients?registered=1");
      },
      onError: (err) => {
        if (!(err instanceof ApiError)) {
          toast.error("Failed to register patient");
          return;
        }

        if (err.status === 409) {
          const fieldErrors: Record<string, string> = {};
          fieldErrors.phone = "A patient with this phone number already exists.";
          setErrors(fieldErrors);
          toast.error("A patient with this phone number already exists.");
          return;
        }

        if (err.status === 400 && err.errors && err.errors.length > 0) {
          const fieldErrors: Record<string, string> = {};
          for (const be of err.errors) {
            const formField = FIELD_MAP[be.field] || be.field;
            if (!fieldErrors[formField]) {
              fieldErrors[formField] = be.message;
            }
          }
          setErrors(fieldErrors);
          toast.error(formatApiError(err));
          return;
        }

        toast.error(formatApiError(err));
      },
    });
  }

  return (
    <FormPage title="Add New Patient" backHref="/super-admin/patients" onSubmit={handleSubmit} submitLabel="Register Patient" isSubmitting={createMutation.isPending}>
      <FormSection title="Personal Information">
        <FormField label="Full Name" required error={errors.name}>
          <FormInput placeholder="e.g. Aminul Islam" value={form.name} onChange={e => set("name", e.target.value)} />
        </FormField>
        <FormField label="Mobile Number" required error={errors.phone}>
          <FormInput placeholder="e.g. 01711-234567" value={form.phone} onChange={e => set("phone", e.target.value)} maxLength={14} />
        </FormField>
        <FormField label="Email Address" required error={errors.email}>
          <FormInput type="email" placeholder="e.g. patient@example.com" value={form.email} onChange={e => set("email", e.target.value)} />
        </FormField>
        <FormField label="Date of Birth" required error={errors.dob}>
          <FormInput type="date" max={today} value={form.dob} onChange={e => set("dob", e.target.value)} />
        </FormField>
        <FormField label="Age (auto-calculated)">
          <FormInput value={form.dob ? `${age} years` : "—"} readOnly />
        </FormField>
        <FormField label="Gender" required error={errors.gender}>
          <FormSelect value={form.gender} onChange={e => set("gender", e.target.value)}>
            <option value="">Select gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </FormSelect>
        </FormField>
        <FormField label="Blood Group">
          <FormSelect value={form.bloodGroup} onChange={e => set("bloodGroup", e.target.value)}>
            <option value="">Select (optional)</option>
            {BLOOD_GROUPS.map(bg => <option key={bg} value={bg}>{bg}</option>)}
          </FormSelect>
        </FormField>
      </FormSection>

      <FormSection title="Medical & Contact">
        <FormField label="Department" required error={errors.department}>
          <FormSelect value={form.department} onChange={e => set("department", e.target.value)}>
            <option value="">Select department</option>
            {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
          </FormSelect>
        </FormField>
        <div className="sm:col-span-2">
          <FormField label="Address" required error={errors.address}>
            <FormInput placeholder="e.g. Mirsarai, Chittagong" value={form.address} onChange={e => set("address", e.target.value)} />
          </FormField>
        </div>
      </FormSection>
    </FormPage>
  );
}
