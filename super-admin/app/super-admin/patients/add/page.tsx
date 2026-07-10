"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Users } from "lucide-react";
import { FormPage, FormField, FormInput, FormSelect, FormSection } from "@/components/ui/FormPage";
import { generatePatientId } from "@/components/patients/RegisterPatientModal";
import { usePatients } from "@/lib/hooks/usePatients";

const DEPARTMENTS = ["General Medicine","Cardiology","Orthopedics","Neurology","Gynecology","Pediatrics","Gastroenterology","Dermatology","ENT","Ophthalmology","Urology","Oncology","Radiology","Pathology","Emergency"];
const BLOOD_GROUPS = ["A+","A−","B+","B−","AB+","AB−","O+","O−"];

function calcAge(dob: string) {
  if (!dob) return 0;
  const today = new Date(), birth = new Date(dob);
  let age = today.getFullYear() - birth.getFullYear();
  if (today.getMonth() - birth.getMonth() < 0 || (today.getMonth() === birth.getMonth() && today.getDate() < birth.getDate())) age--;
  return age;
}

export default function AddPatientPage() {
  const router = useRouter();
  const { data = [] } = usePatients();
  const today = new Date().toISOString().split("T")[0];

  const [form, setForm] = useState({ name: "", phone: "", dob: "", gender: "", address: "", department: "", bloodGroup: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const patientId = generatePatientId(data.length);
  const age = calcAge(form.dob);
  const set = (k: string, v: string) => { setForm(f => ({ ...f, [k]: v })); setErrors(e => { const n = { ...e }; delete n[k]; return n; }); };

  function validate() {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = "Name is required";
    if (!form.phone.trim()) e.phone = "Mobile is required";
    else if (!/^01[3-9]\d{8}$/.test(form.phone.replace(/[-\s]/g, ""))) e.phone = "Enter valid BD mobile number";
    if (!form.dob) e.dob = "Date of birth is required";
    if (!form.gender) e.gender = "Gender is required";
    if (!form.address.trim()) e.address = "Address is required";
    if (!form.department) e.department = "Department is required";
    return e;
  }

  function handleSubmit() {
    const e = validate();
    if (Object.keys(e).length > 0) { setErrors(e); return; }
    // In production: call API. For now just navigate back with success.
    router.push("/super-admin/patients?registered=1");
  }

  return (
    <FormPage title="Add New Patient" description={`Patient ID will be: ${patientId}`} backHref="/super-admin/patients" onSubmit={handleSubmit} submitLabel="Register Patient">
      {/* Auto-generated ID banner */}
      <div className="flex items-center justify-between rounded-xl border border-[#1E2B7A]/20 bg-[#1E2B7A]/5 dark:bg-[#1E2B7A]/10 px-5 py-3">
        <div>
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Auto-Generated Patient ID</p>
          <p className="font-mono text-2xl font-black text-[#1E2B7A] dark:text-blue-400 tracking-wider mt-0.5">{patientId}</p>
        </div>
        <Users className="h-8 w-8 text-[#1E2B7A]/30 dark:text-blue-400/30" />
      </div>

      <FormSection title="Personal Information">
        <FormField label="Full Name" required error={errors.name}>
          <FormInput placeholder="e.g. Aminul Islam" value={form.name} onChange={e => set("name", e.target.value)} />
        </FormField>
        <FormField label="Mobile Number" required error={errors.phone}>
          <FormInput placeholder="e.g. 01711-234567" value={form.phone} onChange={e => set("phone", e.target.value)} maxLength={14} />
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
        <FormField label="Last Visit (auto)">
          <FormInput value={today} readOnly />
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
