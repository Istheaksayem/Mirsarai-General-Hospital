"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { FormPage, FormField, FormInput, FormSelect, FormSection } from "@/components/ui/FormPage";

const DEPARTMENTS = ["General Medicine","Cardiology","Orthopedics","Neurology","Gynecology","Pediatrics","Gastroenterology","Dermatology","ENT","Ophthalmology","Urology","Radiology","Pathology","Emergency"];

export default function AddAppointmentPage() {
  const router = useRouter();
  const today = new Date().toISOString().split("T")[0];
  const [form, setForm] = useState({ patientName: "", patientAge: "", patientGender: "", doctorName: "", department: "", date: today, time: "", type: "new", reason: "", notes: "", status: "pending" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const set = (k: string, v: string) => { setForm(f => ({ ...f, [k]: v })); setErrors(e => { const n = { ...e }; delete n[k]; return n; }); };

  function validate() {
    const e: Record<string, string> = {};
    if (!form.patientName.trim()) e.patientName = "Patient name is required";
    if (!form.doctorName.trim()) e.doctorName = "Doctor name is required";
    if (!form.department) e.department = "Department is required";
    if (!form.date) e.date = "Date is required";
    if (!form.time) e.time = "Time is required";
    if (!form.reason.trim()) e.reason = "Reason is required";
    return e;
  }

  function handleSubmit() {
    const e = validate();
    if (Object.keys(e).length > 0) { setErrors(e); return; }
    router.push("/super-admin/appointments");
  }

  return (
    <FormPage title="New Appointment" description="Schedule a new patient appointment" backHref="/super-admin/appointments" onSubmit={handleSubmit} submitLabel="Book Appointment">
      <FormSection title="Patient Information">
        <FormField label="Patient Name" required error={errors.patientName}><FormInput placeholder="Full patient name" value={form.patientName} onChange={e => set("patientName", e.target.value)} /></FormField>
        <FormField label="Patient Age"><FormInput type="number" min="0" max="150" placeholder="Age in years" value={form.patientAge} onChange={e => set("patientAge", e.target.value)} /></FormField>
        <FormField label="Gender">
          <FormSelect value={form.patientGender} onChange={e => set("patientGender", e.target.value)}>
            <option value="">Select gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </FormSelect>
        </FormField>
      </FormSection>
      <FormSection title="Doctor & Schedule">
        <FormField label="Doctor Name" required error={errors.doctorName}><FormInput placeholder="Dr. Name" value={form.doctorName} onChange={e => set("doctorName", e.target.value)} /></FormField>
        <FormField label="Department" required error={errors.department}>
          <FormSelect value={form.department} onChange={e => set("department", e.target.value)}>
            <option value="">Select department</option>
            {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
          </FormSelect>
        </FormField>
        <FormField label="Date" required error={errors.date}><FormInput type="date" min={today} value={form.date} onChange={e => set("date", e.target.value)} /></FormField>
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
          </FormSelect>
        </FormField>
        <div className="sm:col-span-2">
          <FormField label="Reason" required error={errors.reason}><FormInput placeholder="Reason for visit" value={form.reason} onChange={e => set("reason", e.target.value)} /></FormField>
        </div>
        <div className="sm:col-span-2">
          <FormField label="Notes"><FormInput placeholder="Additional notes (optional)" value={form.notes} onChange={e => set("notes", e.target.value)} /></FormField>
        </div>
      </FormSection>
    </FormPage>
  );
}
