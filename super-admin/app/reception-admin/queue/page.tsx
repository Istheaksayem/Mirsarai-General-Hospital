"use client";
import { Clock, CheckCircle2 } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Badge } from "@/components/ui/Badge";
import { useAppointments } from "@/lib/hooks/useAppointments";

export default function QueuePage() {
  const { data = [], isLoading } = useAppointments();
  const queue = data.filter((a) => a.status === "confirmed" || a.status === "pending");

  return (
    <div className="space-y-6">
      <PageHeader title="Patient Queue" description={`${queue.length} patients waiting`} icon={Clock} />
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Total in Queue", value: queue.length, color: "text-[#1E2B7A] dark:text-blue-400" },
          { label: "Confirmed", value: queue.filter(a => a.status === "confirmed").length, color: "text-green-600 dark:text-green-400" },
          { label: "Pending", value: queue.filter(a => a.status === "pending").length, color: "text-amber-600 dark:text-amber-400" },
        ].map((s) => (
          <div key={s.label} className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-4 text-center">
            <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
            <p className="text-xs text-gray-400 mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>
      <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 divide-y divide-gray-100 dark:divide-gray-800 overflow-hidden">
        {isLoading ? Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-20 animate-pulse bg-gray-100 dark:bg-gray-800 m-2 rounded-xl" />
        )) : queue.length === 0 ? (
          <div className="p-10 text-center text-gray-400 dark:text-gray-500">Queue is empty</div>
        ) : queue.map((apt, idx) => (
          <div key={apt.id} className="flex items-center gap-4 px-5 py-4 hover:bg-gray-50 dark:hover:bg-gray-800/40 transition-colors">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#1E2B7A] text-white font-bold text-sm">{idx + 1}</div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-gray-900 dark:text-gray-100">{apt.patientName}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">{apt.doctorName} · {apt.department}</p>
            </div>
            <div className="text-right shrink-0">
              <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{apt.time}</p>
              <Badge variant={apt.status === "confirmed" ? "success" : "warning"} className="mt-0.5">{apt.status}</Badge>
            </div>
            <button className="ml-2 flex h-9 w-9 items-center justify-center rounded-xl bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 hover:bg-green-200 dark:hover:bg-green-900/50 transition-colors">
              <CheckCircle2 className="h-4.5 w-4.5" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
