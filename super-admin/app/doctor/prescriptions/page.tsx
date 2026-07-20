"use client";
import React, { useState } from "react";
import { ClipboardList, Plus, FileText, Upload, Calendar, Search, Archive, Loader2 } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { usePrescriptions, useDeletePrescription } from "@/lib/hooks/usePrescriptions";
import { CreatePrescriptionModal } from "@/components/prescriptions/CreatePrescriptionModal";
import { cn } from "@/lib/utils";

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

function getFileIcon(fileType?: string | null) {
  switch (fileType) {
    case "pdf": return FileText;
    case "image": return Upload;
    case "word": return FileText;
    default: return ClipboardList;
  }
}

export default function PrescriptionsPage() {
  const [showCreate, setShowCreate] = useState(false);
  const [search, setSearch] = useState("");
  const { data, isLoading } = usePrescriptions(search ? { patientId: search } : undefined);
  const deletePrescription = useDeletePrescription();

  const prescriptions = data?.data ?? [];
  const total = data?.meta?.total ?? 0;

  return (
    <div className="space-y-6">
      <PageHeader title="Prescriptions" description={`${total} prescription${total !== 1 ? "s" : ""}`} icon={ClipboardList}>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Filter by patient ID..."
              className="w-52 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 pl-9 pr-3 py-2 text-sm text-gray-900 dark:text-gray-100 placeholder:text-gray-400 focus:border-[#1E2B7A] focus:ring-2 focus:ring-[#1E2B7A]/20 focus:outline-none transition-all"
            />
          </div>
          <Button size="sm" onClick={() => setShowCreate(true)}>
            <Plus className="h-4 w-4 mr-1.5" />New Prescription
          </Button>
        </div>
      </PageHeader>

      {isLoading ? (
        <div className="space-y-3">{Array.from({ length: 3 }).map((_, i) => <div key={i} className="h-28 animate-pulse rounded-2xl bg-gray-100 dark:bg-gray-800" />)}</div>
      ) : prescriptions.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-gray-200 dark:border-gray-700 p-12 text-center">
          <div className="flex justify-center mb-3">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800">
              <ClipboardList className="h-6 w-6 text-gray-400" />
            </div>
          </div>
          <p className="font-semibold text-gray-900 dark:text-gray-100">No prescriptions yet</p>
          <p className="text-sm text-gray-400 mt-1">Create your first prescription to get started.</p>
          <Button size="sm" className="mt-4" onClick={() => setShowCreate(true)}>
            <Plus className="h-4 w-4 mr-1.5" />New Prescription
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {prescriptions.map((rx) => (
            <div key={rx._id} className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-5 space-y-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3 min-w-0">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#1E2B7A]/10 dark:bg-[#1E2B7A]/20 mt-0.5">
                    {React.createElement(getFileIcon(rx.fileType), { className: "h-5 w-5 text-[#1E2B7A]" })}
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-gray-900 dark:text-gray-100 truncate">{rx.patientInfo?.name || "Unknown Patient"}</p>
                    <p className="text-xs text-gray-400">{rx.patientInfo?.patientId} · {rx.patientInfo?.mobile}</p>
                    {rx.diagnosis && (
                      <p className="text-sm text-[#1E2B7A] dark:text-blue-400 font-medium mt-1">{rx.diagnosis}</p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <Badge variant={rx.status === "active" ? "success" : "default"}>{rx.status}</Badge>
                  {rx.fileType && (
                    <Badge variant="info">{rx.fileType.toUpperCase()}</Badge>
                  )}
                  {rx.textContent && (
                    <Badge variant="info">TEXT</Badge>
                  )}
                </div>
              </div>
              <div className="flex items-center justify-between text-xs text-gray-400">
                <div className="flex items-center gap-4">
                  <span>Dr. {rx.doctorName}</span>
                  <span className="flex items-center gap-1"><Calendar className="h-3 w-3" />{timeAgo(rx.createdAt)}</span>
                </div>
                <div className="flex items-center gap-2">
                  {rx.followUpDate && (
                    <span className="text-amber-500">Follow-up: {new Date(rx.followUpDate).toLocaleDateString()}</span>
                  )}
                  {rx.status === "active" && (
                    <button
                      onClick={() => { if (confirm("Archive this prescription?")) deletePrescription.mutate(rx._id); }}
                      className="flex items-center gap-1 text-red-400 hover:text-red-500 transition-colors"
                    >
                      <Archive className="h-3.5 w-3.5" />Archive
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showCreate && <CreatePrescriptionModal onClose={() => setShowCreate(false)} />}
    </div>
  );
}
