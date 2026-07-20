"use client";
import { use, useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { FormPage, FormField, FormInput, FormSelect, FormSection } from "@/components/ui/FormPage";
import { useCmsAppointmentById, useUpdateCmsAppointment } from "@/lib/hooks/useCmsAppointments";
import { useCmsDoctors } from "@/lib/hooks/useCmsDoctors";
import toast from "react-hot-toast";

export default function EditAppointmentPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const { data: aptData, isLoading: loadingApt } = useCmsAppointmentById(id);
  const { data: doctorsData } = useCmsDoctors({ limit: 100 });
  const updateAppointment = useUpdateCmsAppointment();

  const apt = aptData?.data;

  const doctors = useMemo(() => {
    if (!doctorsData?.data) return [];
    return doctorsData.data;
  }, [doctorsData]);

  const departments = useMemo(() => {
    const deps = new Set(doctors.map((d) => d.department?.en).filter(Boolean));
    return Array.from(deps) as string[];
  }, [doctors]);

  const [form, setForm] = useState({
    patientName: "", patientAge: "", patientGender: "",
    doctor: "", department: "", date: "", time: "",
    type: "new", reason: "", notes: "", status: "pending",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (apt) {
      setForm({
        patientName: apt.patientName,
        patientAge: apt.patientAge ? String(apt.patientAge) : "",
        patientGender: apt.patientGender || "",
        doctor: typeof apt.doctor === "object" ? apt.doctor._id : apt.doctor,
        department: (typeof apt.doctor === "object" ? apt.doctor.department?.en : "") || apt.department || "",
        date: apt.date ? apt.date.split("T")[0] : "",
        time: apt.time,
        type: apt.type,
        reason: apt.reason || "",
        notes: apt.notes || "",
        status: apt.status,
      });
    }
  }, [apt]);

  const filteredDoctors = useMemo(() => {
    if (!form.department) return doctors;
    return doctors.filter((d) => d.department?.en === form.department);
  }, [doctors, form.department]);

  const set = (k: string, v: string) => {
    setForm(f => ({ ...f, [k]: v }));
    setErrors(e => { const n = { ...e }; delete n[k]; return n; });
    if (k === "department") setForm(f => ({ ...f, doctor: "" }));
  };

  function validate() {
    const e: Record<string, string> = {};
    if (!form.patientName.trim()) e.patientName = "Patient name is required";
    if (!form.doctor) e.doctor = "Doctor is required";
    if (!form.date) e.date = "Date is required";
    if (!form.time) e.time = "Time is required";
    return e;
  }

  async function handleSubmit() {
    const e = validate();
    if (Object.keys(e).length > 0) { setErrors(e); return; }
    setSaving(true);
    try {
      await updateAppointment.mutateAsync({
        id,
        data: {
          patientName: form.patientName,
          patientAge: form.patientAge ? Number(form.patientAge) : undefined,
          patientGender: form.patientGender?.toLowerCase() || undefined,
          doctor: form.doctor,
          department: form.department,
          date: form.date,
          time: form.time,
          type: form.type as "new" | "follow-up" | "consultation",
          reason: form.reason,
          notes: form.notes,
          status: form.status as any,
        } as any,
      });
      toast.success("Appointment updated");
      router.push(`/super-admin/appointments/${encodeURIComponent(id)}`);
    } catch (err: any) {
      toast.error(err?.message || "Failed to update appointment");
      setErrors({ form: err.message || "Failed to update appointment" });
    } finally {
      setSaving(false);
    }
  }

  if (loadingApt) return <div className="flex items-center justify-center h-64"><div className="animate-spin h-8 w-8 rounded-full border-4 border-[#1E2B7A] border-t-transparent" /></div>;
  if (!apt) return <div className="p-16 text-center text-gray-400">Appointment not found</div>;

  return (
    <FormPage title="Edit Appointment" description={`Editing: ${apt._id}`} backHref={`/super-admin/appointments/${encodeURIComponent(id)}`} onSubmit={handleSubmit} submitLabel="Save Changes" isSubmitting={saving}>
      <div className="flex items-center gap-3 rounded-xl border border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50 px-5 py-3">
        <p className="text-xs font-semibold text-gray-400 uppercase">Appointment ID</p>
        <p className="font-mono font-bold text-[#1E2B7A] dark:text-blue-400">{apt._id}</p>
      </div>
      <FormSection title="Patient Information">
        <FormField label="Patient Name" required error={errors.patientName}>
          <FormInput value={form.patientName} onChange={e => set("patientName", e.target.value)} />
        </FormField>
        <FormField label="Age">
          <FormInput type="number" value={form.patientAge} onChange={e => set("patientAge", e.target.value)} />
        </FormField>
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
        <FormField label="Department">
          <FormSelect value={form.department} onChange={e => set("department", e.target.value)}>
            <option value="">Select</option>
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
          <FormInput type="date" value={form.date} onChange={e => set("date", e.target.value)} />
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
