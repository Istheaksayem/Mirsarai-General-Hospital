"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { FormPage, FormField, FormInput, FormSelect, FormSection } from "@/components/ui/FormPage";
import { useDoctors } from "@/lib/hooks/useDoctors";
import { Stethoscope } from "lucide-react";

const DEPARTMENTS = ["General Medicine","Cardiology","Orthopedics","Neurology","Gynecology","Pediatrics","Gastroenterology","Dermatology","ENT","Ophthalmology","Urology","Radiology","Pathology","Emergency"];
const DAYS = ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"];

export default function AddDoctorPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", specialization: "", department: "", qualification: "", experience: "", phone: "", email: "", consultationFee: "", status: "active", availableDays: [] as string[] });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const set = (k: string, v: string) => { setForm(f => ({ ...f, [k]: v })); setErrors(e => { const n = { ...e }; delete n[k]; return n; }); };

  function validate() {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = "Name is required";
    if (!form.specialization.trim()) e.specialization = "Specialization is required";
    if (!form.department) e.department = "Department is required";
    if (!form.qualification.trim()) e.qualification = "Qualification is required";
    if (!form.phone.trim()) e.phone = "Phone is required";
    if (!form.email.trim()) e.email = "Email is required";
    return e;
  }

  function handleSubmit() {
    const e = validate();
    if (Object.keys(e).length > 0) { setErrors(e); return; }
    router.push("/super-admin/doctors?registered=1");
  }

  return (
    <FormPage title="Add New Doctor" description="Register a new doctor to the system" backHref="/super-admin/doctors" onSubmit={handleSubmit} submitLabel="Register Doctor">
      <div className="flex items-center gap-3 rounded-xl border border-[#1E2B7A]/20 bg-[#1E2B7A]/5 dark:bg-[#1E2B7A]/10 px-5 py-3">
        <Stethoscope className="h-8 w-8 text-[#1E2B7A]/40" />
        <p className="text-sm text-gray-600 dark:text-gray-400">Fill in all required fields to add doctor to the system.</p>
      </div>

      <FormSection title="Personal Information">
        <FormField label="Full Name" required error={errors.name}>
          <FormInput placeholder="Dr. Aminul Islam" value={form.name} onChange={e => set("name", e.target.value)} />
        </FormField>
        <FormField label="Specialization" required error={errors.specialization}>
          <FormInput placeholder="e.g. Cardiology Specialist" value={form.specialization} onChange={e => set("specialization", e.target.value)} />
        </FormField>
        <FormField label="Qualification" required error={errors.qualification}>
          <FormInput placeholder="e.g. MBBS, FCPS" value={form.qualification} onChange={e => set("qualification", e.target.value)} />
        </FormField>
        <FormField label="Experience (years)">
          <FormInput type="number" min="0" placeholder="e.g. 10" value={form.experience} onChange={e => set("experience", e.target.value)} />
        </FormField>
      </FormSection>

      <FormSection title="Contact & Department">
        <FormField label="Department" required error={errors.department}>
          <FormSelect value={form.department} onChange={e => set("department", e.target.value)}>
            <option value="">Select department</option>
            {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
          </FormSelect>
        </FormField>
        <FormField label="Status">
          <FormSelect value={form.status} onChange={e => set("status", e.target.value)}>
            <option value="active">Active</option>
            <option value="on-leave">On Leave</option>
            <option value="inactive">Inactive</option>
          </FormSelect>
        </FormField>
        <FormField label="Phone" required error={errors.phone}>
          <FormInput placeholder="01711-234567" value={form.phone} onChange={e => set("phone", e.target.value)} />
        </FormField>
        <FormField label="Email" required error={errors.email}>
          <FormInput type="email" placeholder="doctor@hospital.com" value={form.email} onChange={e => set("email", e.target.value)} />
        </FormField>
        <FormField label="Consultation Fee (৳)">
          <FormInput type="number" min="0" placeholder="e.g. 800" value={form.consultationFee} onChange={e => set("consultationFee", e.target.value)} />
        </FormField>
      </FormSection>
    </FormPage>
  );
}
