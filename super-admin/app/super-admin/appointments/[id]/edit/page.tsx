"use client";
import { use, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FormPage, FormField, FormInput, FormSelect, FormSection } from "@/components/ui/FormPage";
import { useAppointments } from "@/lib/hooks/useAppointments";

const DEPARTMENTS = ["General Medicine","Cardiology","Orthopedics","Neurology","Gynecology","Pediatrics","Gastroenterology","Dermatology","ENT","Ophthalmology","Urology","Radiology","Pathology","Emergency"];

export default function EditAppointmentPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const { data = [], isLoading } = useAppointments();
  const apt = data.find(a => a.id === decodeURIComponent(id));

  const [form, setForm] = useState({ patientName: "", patientAge: "", patientGender: "", doctorName: "", department: "", date: "", time: "", type: "new", reason: "", notes: "", status: "pending" });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (apt) setForm({ patientName: apt.patientName, patientAge: String(apt.patientAge), patientGender: apt.patientGender, doctorName: apt.doctorName, department: apt.department, date: apt.date, time: apt.time, type: apt.type, reason: apt.reason, notes: apt.notes || "", status: apt.status });
  }, [apt]);

  const set = (k: string, v: string) => { setForm(f => ({ ...f, [k]: v })); setErrors(e => { const n = { ...e }; delete n[k]; return n; }); };

  function validate() {
    const e: Record<string, string> = {};
    if (!form.patientName.trim()) e.patientName = "Patient name is required";
    if (!form.doctorName.trim()) e.doctorName = "Doctor name is required";
    if (!form.date) e.date = "Date is required";
    if (!form.time) e.time = "Time is required";
    return e;
  }

  function handleSubmit() {
    const e = validate();
    if (Object.keys(e).length > 0) { setErrors(e); return; }
    router.push(`/super-admin/appointments/${encodeURIComponent(id)}`);
  }

  if (isLoading) return <div className="flex items-center justify-center h-64"><div className="animate-spin h-8 w-8 rounded-full border-4 border-[#1E2B7A] border-t-transparent" /></div>;
  if (!apt) return <div className="p-16 text-center text-gray-400">Appointment not found</div>;

  return (
    <FormPage title="Edit Appointment" description={`Editing: ${apt.id}`} backHref={`/super-admin/appointments/${encodeURIComponent(id)}`} onSubmit={handleSubmit} submitLabel="Save Changes">
      <div className="flex items-center gap-3 rounded-xl border border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50 px-5 py-3">
        <p className="text-xs font-semibold text-gray-400 uppercase">Appointment ID</p>
        <p className="font-mono font-bold text-[#1E2B7A] dark:text-blue-400">{apt.id}</p>
      </div>
      <FormSection title="Patient Information">
        <FormField label="Patient Name" required error={errors.patientName}><FormInput value={form.patientName} onChange={e => set("patientName", e.target.value)} /></FormField>
        <FormField label="Age"><FormInput type="number" value={form.patientAge} onChange={e => set("patientAge", e.target.value)} /></FormField>
        <FormField label="Gender">
          <FormSelect value={form.patientGender} onChange={e => set("patientGender", e.target.value)}>
            <option value="">Select</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </FormSelect>
        </FormField>
      </FormSection>
      <FormSection title="Schedule & Details">
        <FormField label="Doctor Name" required error={errors.doctorName}><FormInput value={form.doctorName} onChange={e => set("doctorName", e.target.value)} /></FormField>
        <FormField label="Department">
          <FormSelect value={form.department} onChange={e => set("department", e.target.value)}>
            <option value="">Select</option>
            {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
          </FormSelect>
        </FormField>
        <FormField label="Date" required error={errors.date}><FormInput type="date" value={form.date} onChange={e => set("date", e.target.value)} /></FormField>
        <FormField label="Time" required error={errors.time}><FormInput type="time" value={form.time} onChange={e => set("time", e.target.value)} /></FormField>
        <FormField label="Type">
          <FormSelect value={form.type} onChange={e => set("type", e.target.value)}>
            <option value="new">New</option>
            <option value="follow-up">Follow-up</option>
            <option value="consultation">Consultation</option>
          </FormSelect>
        </FormField>
        <FormField label="Status">
          <FormSelect value={form.status} onChange={e => set("status", e.target.value)}>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </FormSelect>
        </FormField>
        <div className="sm:col-span-2">
          <FormField label="Reason"><FormInput value={form.reason} onChange={e => set("reason", e.target.value)} /></FormField>
        </div>
        <div className="sm:col-span-2">
          <FormField label="Notes"><FormInput value={form.notes} onChange={e => set("notes", e.target.value)} /></FormField>
        </div>
      </FormSection>
    </FormPage>
  );
}
