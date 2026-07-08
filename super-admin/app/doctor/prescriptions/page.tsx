"use client";
import { ClipboardList, Plus } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { usePrescriptions } from "@/lib/hooks/usePrescriptions";

export default function PrescriptionsPage() {
  const { data = [], isLoading } = usePrescriptions();

  return (
    <div className="space-y-6">
      <PageHeader title="Prescriptions" description={`${data.length} active prescriptions`} icon={ClipboardList}>
        <Button size="sm"><Plus className="h-4 w-4 mr-1.5" />New Prescription</Button>
      </PageHeader>
      {isLoading ? (
        <div className="space-y-3">{Array.from({ length: 3 }).map((_, i) => <div key={i} className="h-40 animate-pulse rounded-2xl bg-gray-100 dark:bg-gray-800" />)}</div>
      ) : data.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-gray-200 dark:border-gray-700 p-12 text-center text-gray-400">No prescriptions found</div>
      ) : (
        <div className="space-y-4">
          {data.map((rx) => (
            <div key={rx.id} className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-5 space-y-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2.5 mb-1">
                    <span className="font-mono text-xs text-gray-400">{rx.id}</span>
                    <Badge variant={rx.status === "active" ? "success" : "default"}>{rx.status}</Badge>
                  </div>
                  <p className="font-semibold text-gray-900 dark:text-gray-100">{rx.patientName}</p>
                  <p className="text-sm text-[#1E2B7A] dark:text-blue-400 font-medium mt-0.5">{rx.diagnosis}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-xs text-gray-400">Issued: {rx.date}</p>
                  <p className="text-xs text-gray-400">Follow-up: {rx.followUp}</p>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                {rx.medications.map((med, i) => (
                  <div key={i} className="rounded-xl border border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50 px-3 py-2.5">
                    <p className="font-semibold text-sm text-gray-900 dark:text-gray-100">{med.name} <span className="font-normal text-gray-500">{med.dosage}</span></p>
                    <p className="text-xs text-gray-400 mt-0.5">{med.frequency} · {med.duration}</p>
                    {med.instructions && <p className="text-xs text-blue-500 dark:text-blue-400 mt-0.5 italic">{med.instructions}</p>}
                  </div>
                ))}
              </div>
              {rx.instructions && (
                <div className="rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-800/40 px-4 py-3">
                  <p className="text-xs font-medium text-amber-800 dark:text-amber-300 mb-1">Instructions</p>
                  <p className="text-sm text-amber-700 dark:text-amber-400">{rx.instructions}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
