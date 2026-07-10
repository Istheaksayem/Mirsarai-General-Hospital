"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { FormPage, FormField, FormInput, FormSelect, FormSection } from "@/components/ui/FormPage";

export default function AddDepartmentPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", code: "", headOfDepartment: "", location: "", phone: "", description: "", bedsCount: "", staffCount: "", establishedYear: "", status: "active" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const set = (k: string, v: string) => { setForm(f => ({ ...f, [k]: v })); setErrors(e => { const n = { ...e }; delete n[k]; return n; }); };

  function validate() {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = "Name is required";
    if (!form.code.trim()) e.code = "Code is required";
    if (!form.headOfDepartment.trim()) e.headOfDepartment = "Head of department is required";
    return e;
  }
  function handleSubmit() {
    const e = validate();
    if (Object.keys(e).length > 0) { setErrors(e); return; }
    router.push("/super-admin/departments");
  }

  return (
    <FormPage title="Add Department" description="Create a new hospital department" backHref="/super-admin/departments" onSubmit={handleSubmit} submitLabel="Create Department">
      <FormSection title="Basic Information">
        <FormField label="Department Name" required error={errors.name}><FormInput placeholder="e.g. Cardiology" value={form.name} onChange={e => set("name", e.target.value)} /></FormField>
        <FormField label="Department Code" required error={errors.code}><FormInput placeholder="e.g. CARD" value={form.code} onChange={e => set("code", e.target.value.toUpperCase())} /></FormField>
        <FormField label="Head of Department" required error={errors.headOfDepartment}><FormInput placeholder="Dr. Name" value={form.headOfDepartment} onChange={e => set("headOfDepartment", e.target.value)} /></FormField>
        <FormField label="Location"><FormInput placeholder="e.g. Block A, Floor 2" value={form.location} onChange={e => set("location", e.target.value)} /></FormField>
        <FormField label="Phone"><FormInput placeholder="Contact number" value={form.phone} onChange={e => set("phone", e.target.value)} /></FormField>
        <FormField label="Status">
          <FormSelect value={form.status} onChange={e => set("status", e.target.value)}>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </FormSelect>
        </FormField>
      </FormSection>
      <FormSection title="Capacity">
        <FormField label="Beds Count"><FormInput type="number" min="0" value={form.bedsCount} onChange={e => set("bedsCount", e.target.value)} /></FormField>
        <FormField label="Staff Count"><FormInput type="number" min="0" value={form.staffCount} onChange={e => set("staffCount", e.target.value)} /></FormField>
        <FormField label="Established Year"><FormInput type="number" min="1900" max={new Date().getFullYear()} value={form.establishedYear} onChange={e => set("establishedYear", e.target.value)} /></FormField>
      </FormSection>
    </FormPage>
  );
}
