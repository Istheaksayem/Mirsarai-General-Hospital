"use client";
import { use, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FormPage, FormField, FormInput, FormSelect, FormSection } from "@/components/ui/FormPage";
import { usePatientById, useUpdatePatient } from "@/lib/hooks/usePatients";
import toast from "react-hot-toast";

const DEPARTMENTS = ["General Medicine","Cardiology","Orthopedics","Neurology","Gynecology","Pediatrics","Gastroenterology","Dermatology","ENT","Ophthalmology","Urology","Oncology","Radiology","Pathology","Emergency"];
const BLOOD_GROUPS = ["A+","A−","B+","B−","AB+","AB−","O+","O−"];

export default function EditPatientPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const decodedId = decodeURIComponent(id);
  const { data: patient, isLoading, isError } = usePatientById(decodedId);
  const updateMutation = useUpdatePatient();

  const [form, setForm] = useState({ name: "", phone: "", email: "", age: "", gender: "", bloodGroup: "", address: "", department: "", status: "", diagnosis: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (patient) {
      setForm({
        name: patient.name,
        phone: patient.phone,
        email: patient.email || "",
        age: String(patient.age),
        gender: patient.gender,
        bloodGroup: patient.bloodGroup || "",
        address: patient.address || "",
        department: patient.department || "",
        status: patient.status,
        diagnosis: patient.diagnosis || "",
      });
    }
  }, [patient]);

  const set = (k: string, v: string) => { setForm(f => ({ ...f, [k]: v })); setErrors(e => { const n = { ...e }; delete n[k]; return n; }); };

  function validate() {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = "Name is required";
    if (!form.phone.trim()) e.phone = "Mobile is required";
    if (form.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) e.email = "Enter a valid email address";
    if (!form.gender) e.gender = "Gender is required";
    if (!form.address.trim()) e.address = "Address is required";
    if (!form.department) e.department = "Department is required";
    return e;
  }

  function handleSubmit() {
    const e = validate();
    if (Object.keys(e).length > 0) { setErrors(e); return; }

    updateMutation.mutate({
      id: patient!._id,
      data: {
        fullName: form.name.trim(),
        mobile: form.phone.trim(),
        email: form.email.trim() || undefined,
        age: parseInt(form.age) || undefined,
        gender: form.gender.toLowerCase(),
        bloodGroup: form.bloodGroup || undefined,
        address: form.address.trim(),
        department: form.department,
        status: form.status as "active" | "inactive" | "admitted",
        diagnosis: form.diagnosis || undefined,
      },
    }, {
      onSuccess: () => {
        toast.success("Patient updated successfully");
        router.push(`/super-admin/patients/${patient!._id}`);
      },
      onError: (err) => {
        toast.error(err.message || "Failed to update patient");
      },
    });
  }

  if (isLoading) return <div className="flex items-center justify-center h-64"><div className="animate-spin h-8 w-8 rounded-full border-4 border-[#1E2B7A] border-t-transparent" /></div>;
  if (isError || !patient) return <div className="rounded-2xl border border-dashed border-gray-200 dark:border-gray-700 p-16 text-center text-gray-400">Patient not found</div>;

  return (
    <FormPage title="Edit Patient" description={`Editing: ${patient.id}`} backHref={`/super-admin/patients/${patient._id}`} onSubmit={handleSubmit} submitLabel="Save Changes">
      <div className="flex items-center gap-3 rounded-xl border border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50 px-5 py-3">
        <p className="text-xs font-semibold text-gray-400 uppercase">Patient ID (read-only)</p>
        <p className="font-mono font-bold text-[#1E2B7A] dark:text-blue-400">{patient.id}</p>
      </div>

      <FormSection title="Personal Information">
        <FormField label="Full Name" required error={errors.name}>
          <FormInput value={form.name} onChange={e => set("name", e.target.value)} />
        </FormField>
        <FormField label="Mobile Number" required error={errors.phone}>
          <FormInput value={form.phone} onChange={e => set("phone", e.target.value)} maxLength={14} />
        </FormField>
        <FormField label="Email Address" error={errors.email}>
          <FormInput type="email" value={form.email} onChange={e => set("email", e.target.value)} placeholder="patient@example.com" />
        </FormField>
        <FormField label="Age">
          <FormInput value={form.age} onChange={e => set("age", e.target.value)} type="number" min="0" max="150" />
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
            <option value="">Select</option>
            {BLOOD_GROUPS.map(bg => <option key={bg} value={bg}>{bg}</option>)}
          </FormSelect>
        </FormField>
        <FormField label="Status">
          <FormSelect value={form.status} onChange={e => set("status", e.target.value)}>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="admitted">Admitted</option>
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
        <FormField label="Diagnosis">
          <FormInput value={form.diagnosis} onChange={e => set("diagnosis", e.target.value)} placeholder="Primary diagnosis" />
        </FormField>
        <div className="sm:col-span-2">
          <FormField label="Address" required error={errors.address}>
            <FormInput value={form.address} onChange={e => set("address", e.target.value)} />
          </FormField>
        </div>
      </FormSection>
    </FormPage>
  );
}
