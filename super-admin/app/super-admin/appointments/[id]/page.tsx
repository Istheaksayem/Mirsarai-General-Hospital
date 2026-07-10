"use client";
import { use } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Pencil, User, Stethoscope, Calendar, Clock, FileText, Activity } from "lucide-react";
import { useAppointments } from "@/lib/hooks/useAppointments";
import { Badge } from "@/components/ui/Badge";
import { type Appointment } from "@/lib/services/api";

const statusVariant: Record<Appointment["status"], "success" | "warning" | "default" | "danger"> = {
  confirmed: "success", pending: "warning", completed: "default", cancelled: "danger",
};

export default function ViewAppointmentPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const { data = [], isLoading } = useAppointments();
  const apt = data.find(a => a.id === decodeURIComponent(id));

  if (isLoading) return <div className="flex items-center justify-center h-64"><div className="animate-spin h-8 w-8 rounded-full border-4 border-[#1E2B7A] border-t-transparent" /></div>;
  if (!apt) return <div className="p-16 text-center text-gray-400">Appointment not found</div>;

  const fields = [
    { icon: User, label: "Patient Name", value: apt.patientName },
    { icon: Activity, label: "Patient Age / Gender", value: `${apt.patientAge}y · ${apt.patientGender}` },
    { icon: Stethoscope, label: "Doctor", value: apt.doctorName },
    { icon: Stethoscope, label: "Department", value: apt.department },
    { icon: Calendar, label: "Date", value: apt.date },
    { icon: Clock, label: "Time", value: apt.time },
    { icon: Activity, label: "Type", value: apt.type },
    { icon: FileText, label: "Reason", value: apt.reason },
    { icon: FileText, label: "Notes", value: apt.notes || "—" },
  ];

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={() => router.push("/super-admin/appointments")} className="flex h-9 w-9 items-center justify-center rounded-xl border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
            <ArrowLeft className="h-4 w-4 text-gray-600 dark:text-gray-400" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">Appointment Details</h1>
            <p className="text-sm text-gray-500 mt-0.5">View appointment information</p>
          </div>
        </div>
        <button onClick={() => router.push(`/super-admin/appointments/${encodeURIComponent(apt.id)}/edit`)} className="flex items-center gap-2 px-4 py-2 bg-[#1E2B7A] hover:bg-[#76BC21] text-white rounded-xl text-sm font-semibold transition-all">
          <Pencil className="h-3.5 w-3.5" /> Edit
        </button>
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 space-y-4">
        <div className="flex items-start justify-between">
          <div>
            <p className="font-mono text-xs text-gray-400 mb-1">{apt.id}</p>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{apt.patientName}</h2>
            <p className="text-sm text-[#1E2B7A] dark:text-blue-400 font-semibold mt-0.5">{apt.doctorName} · {apt.department}</p>
          </div>
          <div className="flex flex-col items-end gap-2">
            <Badge variant={statusVariant[apt.status]}>{apt.status}</Badge>
            <Badge variant="info">{apt.type}</Badge>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-sm font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wide mb-5">Appointment Information</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {fields.map(({ icon: Icon, label, value }) => (
            <div key={label} className="flex items-start gap-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-800/50">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#1E2B7A]/10 dark:bg-[#1E2B7A]/20">
                <Icon className="h-4 w-4 text-[#1E2B7A] dark:text-blue-400" />
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">{label}</p>
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100 mt-0.5">{value}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
