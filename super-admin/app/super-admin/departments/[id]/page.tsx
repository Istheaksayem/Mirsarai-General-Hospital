"use client";
import { use } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Pencil, Building2, User, MapPin, Phone, Users, BedDouble, Calendar, Activity } from "lucide-react";
import { useDepartments } from "@/lib/hooks/useDepartments";
import { Badge } from "@/components/ui/Badge";

export default function ViewDepartmentPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const { data = [], isLoading } = useDepartments();
  const dept = data.find(d => d.id === decodeURIComponent(id));

  if (isLoading) return <div className="flex items-center justify-center h-64"><div className="animate-spin h-8 w-8 rounded-full border-4 border-[#1E2B7A] border-t-transparent" /></div>;
  if (!dept) return <div className="p-16 text-center text-gray-400">Department not found</div>;

  const fields = [
    { icon: Building2, label: "Department Name", value: dept.name },
    { icon: Building2, label: "Code", value: dept.code },
    { icon: User, label: "Head of Department", value: dept.headOfDepartment },
    { icon: MapPin, label: "Location", value: dept.location },
    { icon: Phone, label: "Phone", value: dept.phone },
    { icon: Users, label: "Staff Count", value: String(dept.staffCount) },
    { icon: BedDouble, label: "Beds", value: String(dept.bedsCount) },
    { icon: Activity, label: "Active Patients", value: String(dept.activePatients) },
    { icon: Calendar, label: "Established", value: String(dept.establishedYear) },
  ];

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={() => router.push("/super-admin/departments")} className="flex h-9 w-9 items-center justify-center rounded-xl border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
            <ArrowLeft className="h-4 w-4 text-gray-600 dark:text-gray-400" />
          </button>
          <div><h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">Department Details</h1><p className="text-sm text-gray-500 mt-0.5">View department information</p></div>
        </div>
        <button onClick={() => router.push(`/super-admin/departments/${encodeURIComponent(dept.id)}/edit`)} className="flex items-center gap-2 px-4 py-2 bg-[#1E2B7A] hover:bg-[#76BC21] text-white rounded-xl text-sm font-semibold transition-all">
          <Pencil className="h-3.5 w-3.5" /> Edit
        </button>
      </div>
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="h-20 bg-gradient-to-r from-[#1E2B7A] to-[#76BC21]" />
        <div className="px-6 pb-6">
          <div className="-mt-8 mb-4 flex items-end justify-between">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl border-4 border-white dark:border-gray-900 bg-[#1E2B7A] shadow-lg">
              <Building2 className="h-7 w-7 text-white" />
            </div>
            <Badge variant={dept.status === "active" ? "success" : "warning"}>{dept.status}</Badge>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{dept.name}</h2>
          <p className="font-mono text-sm text-[#1E2B7A] dark:text-blue-400 font-bold mt-0.5">{dept.code}</p>
          {dept.description && <p className="text-sm text-gray-500 mt-2">{dept.description}</p>}
        </div>
      </div>
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-sm font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wide mb-5">Department Information</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {fields.map(({ icon: Icon, label, value }) => (
            <div key={label} className="flex items-start gap-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-800/50">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#1E2B7A]/10 dark:bg-[#1E2B7A]/20">
                <Icon className="h-4 w-4 text-[#1E2B7A] dark:text-blue-400" />
              </div>
              <div><p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">{label}</p><p className="text-sm font-medium text-gray-900 dark:text-gray-100 mt-0.5">{value}</p></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
