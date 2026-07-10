"use client";
import { use, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FormPage, FormField, FormInput, FormSelect, FormSection } from "@/components/ui/FormPage";
import { useDoctors } from "@/lib/hooks/useDoctors";

const DEPARTMENTS = ["General Medicine","Cardiology","Orthopedics","Neurology","Gynecology","Pediatrics","Gastroenterology","Dermatology","ENT","Ophthalmology","Urology","Radiology","Pathology","Emergency"];

export default function EditDoctorPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const { data = [], isLoading } = useDoctors();
  const doctor = data.find(d => d.id === decodeURIComponent(id));

  const [form, setForm] = useState({ name: "", specialization: "", department: "", qualification: "", experience: "", phone: "", email: "", consultationFee: "", status: "active" });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (doctor) setForm({ name: doctor.name, specialization: doctor.specialization, department: doctor.department, qualification: doctor.qualification, experience: String(doctor.experience), phone: doctor.phone, email: doctor.email, consultationFee: String(doctor.consultationFee), status: doctor.status });
  }, [doctor]);

  const set = (k: string, v: string) => { setForm(f => ({ ...f, [k]: v })); setErrors(e => { const n = { ...e }; delete n[k]; return n; }); };

  function validate() {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = "Name is required";
    if (!form.specialization.trim()) e.specialization = "Specialization is required";
    if (!form.department) e.department = "Department is required";
    if (!form.phone.trim()) e.phone = "Phone is required";
    return e;
  }

  function handleSubmit() {
    const e = validate();
    if (Object.keys(e).length > 0) { setErrors(e); return; }
    router.push(`/super-admin/doctors/${encodeURIComponent(id)}`);
  }

  if (isLoading) return <div className="flex items-center justify-center h-64"><div className="animate-spin h-8 w-8 rounded-full border-4 border-[#1E2B7A] border-t-transparent" /></div>;
  if (!doctor) return <div className="p-16 text-center text-gray-400">Doctor not found</div>;

  return (
    <FormPage title="Edit Doctor" description={`Editing: ${doctor.name}`} backHref={`/super-admin/doctors/${encodeURIComponent(id)}`} onSubmit={handleSubmit} submitLabel="Save Changes">
      <div className="flex items-center gap-3 rounded-xl border border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50 px-5 py-3">
        <p className="text-xs font-semibold text-gray-400 uppercase">Doctor ID (read-only)</p>
        <p className="font-mono font-bold text-[#1E2B7A] dark:text-blue-400">{doctor.id}</p>
      </div>
      <FormSection title="Personal Information">
        <FormField label="Full Name" required error={errors.name}><FormInput value={form.name} onChange={e => set("name", e.target.value)} /></FormField>
        <FormField label="Specialization" required error={errors.specialization}><FormInput value={form.specialization} onChange={e => set("specialization", e.target.value)} /></FormField>
        <FormField label="Qualification"><FormInput value={form.qualification} onChange={e => set("qualification", e.target.value)} /></FormField>
        <FormField label="Experience (years)"><FormInput type="number" value={form.experience} onChange={e => set("experience", e.target.value)} /></FormField>
      </FormSection>
      <FormSection title="Contact & Department">
        <FormField label="Department" required error={errors.department}>
          <FormSelect value={form.department} onChange={e => set("department", e.target.value)}>
            <option value="">Select</option>
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
        <FormField label="Phone" required error={errors.phone}><FormInput value={form.phone} onChange={e => set("phone", e.target.value)} /></FormField>
        <FormField label="Email"><FormInput type="email" value={form.email} onChange={e => set("email", e.target.value)} /></FormField>
        <FormField label="Consultation Fee (৳)"><FormInput type="number" value={form.consultationFee} onChange={e => set("consultationFee", e.target.value)} /></FormField>
      </FormSection>
    </FormPage>
  );
}
