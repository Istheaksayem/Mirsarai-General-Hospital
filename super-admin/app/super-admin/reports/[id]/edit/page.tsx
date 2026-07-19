"use client";
import { use, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FormPage, FormField, FormInput, FormSelect, FormSection } from "@/components/ui/FormPage";
import { useReports } from "@/lib/hooks/useReports";

const DEPARTMENTS = ["General Medicine","Cardiology","Orthopedics","Neurology","Gynecology","Pediatrics","Gastroenterology","Radiology","Pathology","Emergency"];

export default function EditReportPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const { data = [], isLoading } = useReports();
  const report = data.find(r => r._id === decodeURIComponent(id));

  const [form, setForm] = useState({ patientName: "", patientId: "", testName: "", reportType: "", department: "", requestingDoctor: "", createdAt: "", completedDate: "", status: "pending", notes: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (report) setForm({ patientName: report.patientName || "", patientId: report.patientId, testName: report.testName, reportType: report.reportType, department: report.department || "", requestingDoctor: report.requestingDoctor || "", createdAt: report.createdAt?.split("T")[0] || "", completedDate: report.completedDate || "", status: report.status, notes: report.notes || "" });
  }, [report]);

  const set = (k: string, v: string) => { setForm(f => ({ ...f, [k]: v })); setErrors(e => { const n = { ...e }; delete n[k]; return n; }); };

  function validate() {
    const e: Record<string, string> = {};
    if (!form.patientName.trim()) e.patientName = "Patient name is required";
    if (!form.testName.trim()) e.testName = "Test name is required";
    if (!form.department) e.department = "Department is required";
    return e;
  }

  function handleSubmit() {
    const e = validate();
    if (Object.keys(e).length > 0) { setErrors(e); return; }
    router.push(`/super-admin/reports/${encodeURIComponent(id)}`);
  }

  if (isLoading) return <div className="flex items-center justify-center h-64"><div className="animate-spin h-8 w-8 rounded-full border-4 border-[#1E2B7A] border-t-transparent" /></div>;
  if (!report) return <div className="p-16 text-center text-gray-400">Report not found</div>;

  return (
    <FormPage title="Edit Report" description={`Editing: ${report._id}`} backHref={`/super-admin/reports/${encodeURIComponent(id)}`} onSubmit={handleSubmit} submitLabel="Save Changes">
      <div className="flex items-center gap-3 rounded-xl border border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50 px-5 py-3">
        <p className="text-xs font-semibold text-gray-400 uppercase">Report ID</p>
        <p className="font-mono font-bold text-[#1E2B7A] dark:text-blue-400">{report._id}</p>
      </div>
      <FormSection title="Patient & Test Information">
        <FormField label="Patient Name" required error={errors.patientName}><FormInput value={form.patientName} onChange={e => set("patientName", e.target.value)} /></FormField>
        <FormField label="Patient ID"><FormInput value={form.patientId} onChange={e => set("patientId", e.target.value)} /></FormField>
        <FormField label="Test Name" required error={errors.testName}><FormInput value={form.testName} onChange={e => set("testName", e.target.value)} /></FormField>
        <FormField label="Report Type"><FormInput value={form.reportType} onChange={e => set("reportType", e.target.value)} /></FormField>
        <FormField label="Department" required error={errors.department}>
          <FormSelect value={form.department} onChange={e => set("department", e.target.value)}>
            <option value="">Select</option>
            {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
          </FormSelect>
        </FormField>
        <FormField label="Requested By"><FormInput value={form.requestingDoctor} onChange={e => set("requestingDoctor", e.target.value)} /></FormField>
        <FormField label="Request Date"><FormInput type="date" value={form.createdAt} onChange={e => set("createdAt", e.target.value)} /></FormField>
        <FormField label="Completed Date"><FormInput type="date" value={form.completedDate} onChange={e => set("completedDate", e.target.value)} /></FormField>
        <FormField label="Status">
          <FormSelect value={form.status} onChange={e => set("status", e.target.value)}>
            <option value="pending">Pending</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
          </FormSelect>
        </FormField>
        <div className="sm:col-span-2">
          <FormField label="Notes"><FormInput value={form.notes} onChange={e => set("notes", e.target.value)} /></FormField>
        </div>
      </FormSection>
    </FormPage>
  );
}
