"use client";
import { use, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FormPage, FormField, FormInput, FormSelect, FormSection } from "@/components/ui/FormPage";
import { useDepartments } from "@/lib/hooks/useDepartments";

export default function EditDepartmentPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const { data = [], isLoading } = useDepartments();
  const dept = data.find(d => d.id === decodeURIComponent(id));

  const [form, setForm] = useState({ name: "", code: "", headOfDepartment: "", location: "", phone: "", description: "", bedsCount: "", staffCount: "", status: "active" });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (dept) setForm({ name: dept.name, code: dept.code, headOfDepartment: dept.headOfDepartment, location: dept.location, phone: dept.phone, description: dept.description || "", bedsCount: String(dept.bedsCount), staffCount: String(dept.staffCount), status: dept.status });
  }, [dept]);

  const set = (k: string, v: string) => { setForm(f => ({ ...f, [k]: v })); setErrors(e => { const n = { ...e }; delete n[k]; return n; }); };

  function validate() {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = "Name is required";
    if (!form.code.trim()) e.code = "Code is required";
    if (!form.headOfDepartment.trim()) e.headOfDepartment = "Head is required";
    return e;
  }
  function handleSubmit() {
    const e = validate();
    if (Object.keys(e).length > 0) { setErrors(e); return; }
    router.push(`/super-admin/departments/${encodeURIComponent(id)}`);
  }

  if (isLoading) return <div className="flex items-center justify-center h-64"><div className="animate-spin h-8 w-8 rounded-full border-4 border-[#1E2B7A] border-t-transparent" /></div>;
  if (!dept) return <div className="p-16 text-center text-gray-400">Department not found</div>;

  return (
    <FormPage title="Edit Department" description={`Editing: ${dept.name}`} backHref={`/super-admin/departments/${encodeURIComponent(id)}`} onSubmit={handleSubmit} submitLabel="Save Changes">
      <FormSection title="Basic Information">
        <FormField label="Department Name" required error={errors.name}><FormInput value={form.name} onChange={e => set("name", e.target.value)} /></FormField>
        <FormField label="Code" required error={errors.code}><FormInput value={form.code} onChange={e => set("code", e.target.value.toUpperCase())} /></FormField>
        <FormField label="Head of Department" required error={errors.headOfDepartment}><FormInput value={form.headOfDepartment} onChange={e => set("headOfDepartment", e.target.value)} /></FormField>
        <FormField label="Location"><FormInput value={form.location} onChange={e => set("location", e.target.value)} /></FormField>
        <FormField label="Phone"><FormInput value={form.phone} onChange={e => set("phone", e.target.value)} /></FormField>
        <FormField label="Status">
          <FormSelect value={form.status} onChange={e => set("status", e.target.value)}>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </FormSelect>
        </FormField>
      </FormSection>
      <FormSection title="Capacity">
        <FormField label="Beds Count"><FormInput type="number" value={form.bedsCount} onChange={e => set("bedsCount", e.target.value)} /></FormField>
        <FormField label="Staff Count"><FormInput type="number" value={form.staffCount} onChange={e => set("staffCount", e.target.value)} /></FormField>
      </FormSection>
    </FormPage>
  );
}
