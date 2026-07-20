"use client";

import { useState } from "react";
import { FiFileText, FiCalendar, FiChevronDown, FiChevronUp, FiEye, FiDownload, FiPrinter } from "react-icons/fi";
import { BsClipboardPulse, BsFileEarmarkPdf, BsFiletypeDocx, BsFiletypeJpg } from "react-icons/bs";
import { useQuery } from "@tanstack/react-query";
import { patientGetPrescriptions, patientFetchPrescriptionFile, type PatientPrescription } from "@/services/api";

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
    case "pdf": return BsFileEarmarkPdf;
    case "image": return BsFiletypeJpg;
    case "word": return BsFiletypeDocx;
    default: return FiFileText;
  }
}

function PrescriptionCard({ rx }: { rx: PatientPrescription }) {
  const [expanded, setExpanded] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  async function handleView() {
    if (!rx.textContent) {
      if (!rx.fileUrl) return;
      setActionLoading("view");
      try {
        const { blob } = await patientFetchPrescriptionFile(rx._id);
        const url = URL.createObjectURL(blob);
        window.open(url, "_blank", "noopener,noreferrer");
        setTimeout(() => URL.revokeObjectURL(url), 60000);
      } catch { } finally {
        setActionLoading(null);
      }
    }
  }

  async function handleDownload() {
    if (!rx.fileUrl) return;
    setActionLoading("download");
    try {
      const { blob, filename } = await patientFetchPrescriptionFile(rx._id);
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      a.click();
      URL.revokeObjectURL(url);
    } catch { } finally {
      setActionLoading(null);
    }
  }

  async function handlePrint() {
    if (rx.textContent) {
      const w = window.open("", "_blank");
      if (!w) return;
      w.document.write(`<!DOCTYPE html><html><head><title>Prescription</title><style>body{font-family:sans-serif;padding:40px;max-width:700px;margin:0 auto;line-height:1.6}pre{white-space:pre-wrap;font-family:inherit}</style></head><body>`);
      w.document.write(`<h2>Prescription</h2>`);
      w.document.write(`<p><strong>Doctor:</strong> ${rx.doctorName}</p>`);
      w.document.write(`<p><strong>Date:</strong> ${new Date(rx.createdAt).toLocaleDateString()}</p>`);
      if (rx.diagnosis) w.document.write(`<p><strong>Diagnosis:</strong> ${rx.diagnosis}</p>`);
      w.document.write(`<hr/><pre>${rx.textContent}</pre>`);
      if (rx.notes) w.document.write(`<hr/><p><strong>Notes:</strong> ${rx.notes}</p>`);
      w.document.write(`</body></html>`);
      w.document.close();
      w.onload = () => { setTimeout(() => { w.print(); }, 500); };
      return;
    }
    if (!rx.fileUrl) return;
    setActionLoading("print");
    try {
      const { blob } = await patientFetchPrescriptionFile(rx._id);
      const url = URL.createObjectURL(blob);
      const w = window.open(url, "_blank");
      if (w) {
        w.onload = () => { setTimeout(() => { w.print(); }, 800); };
      }
    } catch { } finally {
      setActionLoading(null);
    }
  }

  const Icon = getFileIcon(rx.fileType);

  return (
    <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-sm">
      <div className="p-4 sm:p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3 min-w-0 flex-1">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#1E2B7A]/10 dark:bg-[#1E2B7A]/20">
              <Icon className="h-5 w-5 text-[#1E2B7A]" />
            </div>
            <div className="min-w-0">
              <p className="font-semibold text-gray-900 dark:text-gray-100">Dr. {rx.doctorName}</p>
              <p className="text-xs text-gray-400 mt-0.5">
                <FiCalendar className="inline h-3 w-3 mr-1 align-middle" />
                {timeAgo(rx.createdAt)}
              </p>
              {rx.diagnosis && (
                <p className="text-sm text-[#1E2B7A] dark:text-blue-400 font-medium mt-1.5">{rx.diagnosis}</p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-1 shrink-0">
            {rx.fileType && (
              <span className="rounded-full bg-gray-100 dark:bg-gray-800 px-2 py-0.5 text-[10px] font-semibold text-gray-500 uppercase">{rx.fileType}</span>
            )}
            {rx.textContent && (
              <span className="rounded-full bg-gray-100 dark:bg-gray-800 px-2 py-0.5 text-[10px] font-semibold text-gray-500 uppercase">Text</span>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 mt-4">
          {rx.fileUrl && (
            <>
              <button onClick={handleView} disabled={actionLoading === "view"} className="flex items-center gap-1.5 rounded-xl bg-gray-100 dark:bg-gray-800 px-3 py-1.5 text-xs font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors disabled:opacity-50">
                <FiEye className="h-3.5 w-3.5" />{actionLoading === "view" ? "..." : "View"}
              </button>
              <button onClick={handleDownload} disabled={actionLoading === "download"} className="flex items-center gap-1.5 rounded-xl bg-gray-100 dark:bg-gray-800 px-3 py-1.5 text-xs font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors disabled:opacity-50">
                <FiDownload className="h-3.5 w-3.5" />{actionLoading === "download" ? "..." : "Download"}
              </button>
            </>
          )}
          <button onClick={handlePrint} disabled={actionLoading === "print"} className="flex items-center gap-1.5 rounded-xl bg-gray-100 dark:bg-gray-800 px-3 py-1.5 text-xs font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors disabled:opacity-50">
            <FiPrinter className="h-3.5 w-3.5" />{actionLoading === "print" ? "..." : "Print"}
          </button>
          {(rx.textContent || rx.notes) && (
            <button onClick={() => setExpanded(!expanded)} className="flex items-center gap-1.5 rounded-xl bg-gray-100 dark:bg-gray-800 px-3 py-1.5 text-xs font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors ml-auto">
              {expanded ? <FiChevronUp className="h-3.5 w-3.5" /> : <FiChevronDown className="h-3.5 w-3.5" />}
              {expanded ? "Less" : "Details"}
            </button>
          )}
        </div>

        {/* Expanded content */}
        {expanded && (
          <div className="mt-4 space-y-3 border-t border-gray-100 dark:border-gray-800 pt-4">
            {rx.textContent && (
              <div className="rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-800 p-4">
                <p className="text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wide">Prescription</p>
                <pre className="text-sm text-gray-800 dark:text-gray-200 whitespace-pre-wrap font-sans leading-relaxed">{rx.textContent}</pre>
              </div>
            )}
            {rx.notes && (
              <div className="rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-800/40 p-4">
                <p className="text-xs font-semibold text-amber-700 dark:text-amber-300 mb-1 uppercase tracking-wide">Notes</p>
                <p className="text-sm text-amber-800 dark:text-amber-400">{rx.notes}</p>
              </div>
            )}
            {rx.followUpDate && (
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <FiCalendar className="h-3.5 w-3.5" />
                <span>Follow-up: <strong>{new Date(rx.followUpDate).toLocaleDateString()}</strong></span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export function PatientPrescriptions() {
  const { data: prescriptions = [], isLoading, error } = useQuery({
    queryKey: ["patient-prescriptions"],
    queryFn: patientGetPrescriptions,
    staleTime: 1000 * 30,
  });

  if (isLoading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="h-28 animate-pulse rounded-2xl bg-gray-100 dark:bg-gray-800" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-red-200 dark:border-red-800/40 bg-red-50 dark:bg-red-900/20 p-6 text-center">
        <p className="text-sm text-red-600 dark:text-red-400">Failed to load prescriptions. Please try again.</p>
      </div>
    );
  }

  if (prescriptions.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-gray-200 dark:border-gray-700 p-12 text-center">
        <div className="flex justify-center mb-3">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800">
            <FiFileText className="h-6 w-6 text-gray-400" />
          </div>
        </div>
        <p className="font-semibold text-gray-900 dark:text-gray-100">No prescriptions yet</p>
        <p className="text-sm text-gray-400 mt-1">Your doctor's prescriptions will appear here.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">{prescriptions.length} prescription{prescriptions.length !== 1 ? "s" : ""}</p>
      </div>
      {prescriptions.map((rx) => (
        <PrescriptionCard key={rx._id} rx={rx} />
      ))}
    </div>
  );
}
