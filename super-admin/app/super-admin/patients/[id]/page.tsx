"use client";
import { use } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Pencil, User, Phone, Calendar, MapPin, Building2, Droplets, Activity } from "lucide-react";
import { usePatients } from "@/lib/hooks/usePatients";
import { Badge } from "@/components/ui/Badge";

const statusVariant: Record<string, "success" | "warning" | "info"> = { active: "success", inactive: "warning", admitted: "info" };

export default function ViewPatientPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const { data = [], isLoading } = usePatients();
  const patient = data.find(p => p.id === decodeURIComponent(id));

  if (isLoading) return <div className="flex items-center justify-center h-64"><div className="animate-spin h-8 w-8 rounded-full border-4 border-[#1E2B7A] border-t-transparent" /></div>;
  if (!patient) return <div className="rounded-2xl border border-dashed border-gray-200 dark:border-gray-700 p-16 text-center text-gray-400">Patient not found</div>;

  const fields = [
    { icon: User, label: "Full Name", value: patient.name },
    { icon: Phone, label: "Mobile", value: patient.phone },
    { icon: Calendar, label: "Age", value: `${patient.age} years` },
    { icon: Activity, label: "Gender", value: patient.gender },
    { icon: Droplets, label: "Blood Group", value: patient.bloodGroup || "—" },
    { icon: Building2, label: "Department", value: patient.department || "—" },
    { icon: MapPin, label: "Address", value: patient.address },
    { icon: Calendar, label: "Last Visit", value: patient.lastVisit || "—" },
    { icon: Calendar, label: "Registered", value: patient.registrationDate || "—" },
  ];

  return (
    <div className="space-y-6 w-full">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={() => router.push("/super-admin/patients")} className="flex h-9 w-9 items-center justify-center rounded-xl border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
            <ArrowLeft className="h-4 w-4 text-gray-600 dark:text-gray-400" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">Patient Profile</h1>
            <p className="text-sm text-gray-500 mt-0.5">View patient details</p>
          </div>
        </div>
        <button onClick={() => router.push(`/super-admin/patients/${encodeURIComponent(patient.id)}/edit`)} className="flex items-center gap-2 px-4 py-2 bg-[#1E2B7A] hover:bg-[#76BC21] text-white rounded-xl text-sm font-semibold transition-all">
          <Pencil className="h-3.5 w-3.5" /> Edit
        </button>
      </div>

      {/* Profile card */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
        {/* Top banner */}
        <div className="h-24 bg-gradient-to-r from-[#1E2B7A] to-[#2c3e7a]" />
        <div className="px-6 pb-6">
          <div className="-mt-10 mb-4 flex items-end justify-between">
            <div className="flex h-20 w-20 items-center justify-center rounded-2xl border-4 border-white dark:border-gray-900 bg-gradient-to-br from-[#1E2B7A] to-[#76BC21] text-white text-2xl font-black shadow-lg">
              {patient.name.charAt(0)}
            </div>
            <Badge variant={statusVariant[patient.status] ?? "default"}>{patient.status}</Badge>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{patient.name}</h2>
          <p className="font-mono text-sm text-[#1E2B7A] dark:text-blue-400 font-bold mt-0.5">{patient.id}</p>
          {patient.diagnosis && <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Diagnosis: {patient.diagnosis}</p>}
        </div>
      </div>

      {/* Details grid */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-sm font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wide mb-5">Patient Information</h3>
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
