"use client";
import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { FormPage, FormField, FormInput, FormSelect, FormSection } from "@/components/ui/FormPage";
import { useCmsDoctors } from "@/lib/hooks/useCmsDoctors";
import { useCreateCmsAppointment } from "@/lib/hooks/useCmsAppointments";
import toast from "react-hot-toast";

export default function AddAppointmentPage() {
  const router = useRouter();
  const today = new Date().toISOString().split("T")[0];
  const { data: doctorsData } = useCmsDoctors({ limit: 100 });
  const createAppointment = useCreateCmsAppointment();

  const doctors = useMemo(() => {
    if (!doctorsData?.data) return [];
    return doctorsData.data;
  }, [doctorsData]);

  const departments = useMemo(() => {
    const deps = new Set(doctors.map((d) => d.department?.en).filter(Boolean));
    return Array.from(deps) as string[];
  }, [doctors]);

  const [form, setForm] = useState({
    patientName: "", patientPhone: "", patientEmail: "", patientAge: "", patientGender: "",
    doctor: "", department: "", date: today, time: "",
    type: "new", reason: "", notes: "", status: "pending",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  const set = (k: string, v: string) => {
    setForm(f => ({ ...f, [k]: v }));
    setErrors(e => { const n = { ...e }; delete n[k]; return n; });
    if (k === "department") setForm(f => ({ ...f, doctor: "" }));
  };

  const filteredDoctors = useMemo(() => {
    if (!form.department) return doctors;
    return doctors.filter((d) => d.department?.en === form.department);
  }, [doctors, form.department]);

  function validate() {
    const e: Record<string, string> = {};
    if (!form.patientName.trim()) e.patientName = "Patient name is required";
    if (!form.doctor) e.doctor = "Doctor is required";
    if (!form.department) e.department = "Department is required";
    if (!form.date) e.date = "Date is required";
    if (!form.time) e.time = "Time is required";
    return e;
  }

  async function handleSubmit() {
    const e = validate();
    if (Object.keys(e).length > 0) { setErrors(e); return; }
    setSaving(true);
    try {
      await createAppointment.mutateAsync({
        patientName: form.patientName,
        patientPhone: form.patientPhone || "",
        patientEmail: form.patientEmail || undefined,
        patientAge: form.patientAge ? Number(form.patientAge) : undefined,
        patientGender: form.patientGender?.toLowerCase() || undefined,
        doctor: form.doctor,
        department: form.department,
        date: form.date,
        time: form.time,
        type: form.type as "new" | "follow-up" | "consultation",
        reason: form.reason,
        notes: form.notes,
        status: form.status as "pending" | "confirmed",
      } as any);
      toast.success("Appointment created");
      router.push("/super-admin/appointments");
    } catch (err: any) {
      toast.error(err?.message || "Failed to create appointment");
      setErrors({ form: err.message || "Failed to create appointment" });
    } finally {
      setSaving(false);
    }
  }

  return (
    <FormPage title="New Appointment" description="Schedule a new patient appointment" backHref="/super-admin/appointments" onSubmit={handleSubmit} submitLabel="Book Appointment" isSubmitting={saving}>
      <FormSection title="Patient Information">
        <FormField label="Patient Name" required error={errors.patientName}>
          <FormInput placeholder="Full patient name" value={form.patientName} onChange={e => set("patientName", e.target.value)} />
        </FormField>
        <FormField label="Phone Number">
          <FormInput placeholder="e.g. 01XXXXXXXXX" value={form.patientPhone} onChange={e => set("patientPhone", e.target.value)} />
        </FormField>
        <FormField label="Email">
          <FormInput type="email" placeholder="patient@example.com" value={form.patientEmail} onChange={e => set("patientEmail", e.target.value)} />
        </FormField>
        <FormField label="Patient Age">
          <FormInput type="number" min="0" max="150" placeholder="Age in years" value={form.patientAge} onChange={e => set("patientAge", e.target.value)} />
        </FormField>
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
        <FormField label="Department" required error={errors.department}>
          <FormSelect value={form.department} onChange={e => set("department", e.target.value)}>
            <option value="">Select department</option>
            {departments.map(d => <option key={d} value={d}>{d}</option>)}
          </FormSelect>
        </FormField>
        <FormField label="Doctor" required error={errors.doctor}>
          <FormSelect value={form.doctor} onChange={e => set("doctor", e.target.value)}>
            <option value="">Select doctor</option>
            {filteredDoctors.map(d => (
              <option key={d._id} value={d._id}>{d.name?.en}</option>
            ))}
          </FormSelect>
        </FormField>
        <FormField label="Date" required error={errors.date}>
          <FormInput type="date" min={today} value={form.date} onChange={e => set("date", e.target.value)} />
        </FormField>
        <FormField label="Time" required error={errors.time}>
          <FormInput type="time" value={form.time} onChange={e => set("time", e.target.value)} />
        </FormField>
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
          <FormField label="Reason" required error={errors.reason}>
            <FormInput placeholder="Reason for visit" value={form.reason} onChange={e => set("reason", e.target.value)} />
          </FormField>
        </div>
        <div className="sm:col-span-2">
          <FormField label="Notes">
            <FormInput placeholder="Additional notes (optional)" value={form.notes} onChange={e => set("notes", e.target.value)} />
          </FormField>
        </div>
      </FormSection>
    </FormPage>
  );
}
