"use client";
import { useState, useMemo } from "react";
import {
  FiFileText, FiDownload, FiEye, FiCalendar, FiPrinter, FiSearch,
  FiFile, FiEdit, FiAward, FiDollarSign, FiFolder, FiActivity,
  FiAlertCircle, FiRefreshCw, FiX,
} from "react-icons/fi";
import { useQuery } from "@tanstack/react-query";
import { patientGetDocuments, patientFetchDocumentFile } from "@/services/api";
import type { PatientDocument } from "@/services/api";
import toast from "react-hot-toast";

const CATEGORIES = [
  { key: "all", label: "All" },
  { key: "prescription", label: "Prescriptions" },
  { key: "diagnostic_report", label: "Diagnostic Reports" },
  { key: "admission_form", label: "Admission Forms" },
  { key: "discharge_summary", label: "Discharge Summaries" },
  { key: "certificate", label: "Certificates" },
  { key: "bill_receipt", label: "Bills & Receipts" },
  { key: "other", label: "Other" },
] as const;

const catIcon: Record<string, React.ReactNode> = {
  prescription: <FiFileText size={16} />,
  diagnostic_report: <FiActivity size={16} />,
  admission_form: <FiEdit size={16} />,
  discharge_summary: <FiFile size={16} />,
  certificate: <FiAward size={16} />,
  bill_receipt: <FiDollarSign size={16} />,
  other: <FiFolder size={16} />,
};

const catColor: Record<string, string> = {
  diagnostic_report: "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800",
  prescription: "bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 border-purple-200 dark:border-purple-800",
  admission_form: "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800",
  discharge_summary: "bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 border-orange-200 dark:border-orange-800",
  certificate: "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800",
  bill_receipt: "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800",
  other: "bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-700",
};

const catIconBg: Record<string, string> = {
  diagnostic_report: "bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400",
  prescription: "bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400",
  admission_form: "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400",
  discharge_summary: "bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400",
  certificate: "bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400",
  bill_receipt: "bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400",
  other: "bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400",
};

const ROLE_LABELS: Record<string, string> = {
  lab: "Lab Admin",
  doctor: "Doctor",
  "super-admin": "Super Admin",
  reception: "Reception Admin",
};

function formatRole(role: string): string {
  return ROLE_LABELS[role] || role || "Unknown";
}

function getFileType(fileUrl: string): string {
  if (!fileUrl) return "Unknown";
  const ext = fileUrl.split('.').pop()?.toLowerCase() || '';
  const types: Record<string, string> = {
    pdf: "PDF", jpg: "JPG", jpeg: "JPG", png: "PNG", gif: "GIF",
    doc: "DOC", docx: "DOCX", xls: "XLS", xlsx: "XLSX",
  };
  return types[ext] || ext.toUpperCase() || "File";
}

function isPdf(fileUrl: string): boolean {
  return fileUrl.toLowerCase().endsWith('.pdf');
}

function SkeletonCard() {
  return (
    <div className="rounded-2xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-[#0f1524] p-5 animate-pulse space-y-3">
      <div className="flex items-start gap-4">
        <div className="w-10 h-10 rounded-xl bg-slate-200 dark:bg-slate-700 shrink-0" />
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-3/4" />
          <div className="h-3 bg-slate-100 dark:bg-slate-800 rounded w-1/2" />
        </div>
      </div>
      <div className="flex gap-2 pt-1">
        <div className="h-6 w-16 bg-slate-100 dark:bg-slate-800 rounded-full" />
        <div className="h-6 w-20 bg-slate-100 dark:bg-slate-800 rounded-full" />
      </div>
    </div>
  );
}

export default function DocumentVault() {
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");

  const { data: documents = [], isLoading, isError, refetch, isFetching } = useQuery({
    queryKey: ["patient-documents"],
    queryFn: patientGetDocuments,
    refetchInterval: 30_000,
  });

  const docs = documents as PatientDocument[];

  const filteredDocs = useMemo(() => {
    return docs.filter((doc) => {
      const matchesCategory = categoryFilter === "all" || doc.documentType === categoryFilter;
      const matchesSearch = !search.trim() || doc.title.toLowerCase().includes(search.toLowerCase().trim());
      return matchesCategory && matchesSearch;
    });
  }, [docs, categoryFilter, search]);

  async function handleView(docId: string) {
    try {
      const { blob } = await patientFetchDocumentFile(docId);
      const url = URL.createObjectURL(blob);
      window.open(url, "_blank", "noopener,noreferrer");
      setTimeout(() => URL.revokeObjectURL(url), 60_000);
    } catch {
      toast.error("Failed to open document");
    }
  }

  async function handleDownload(docId: string) {
    try {
      const { blob, filename } = await patientFetchDocumentFile(docId);
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setTimeout(() => URL.revokeObjectURL(url), 1_000);
    } catch {
      toast.error("Failed to download document");
    }
  }

  async function handlePrint(docId: string) {
    try {
      const { blob } = await patientFetchDocumentFile(docId);
      const url = URL.createObjectURL(blob);
      const w = window.open(url, "_blank", "noopener,noreferrer");
      if (w) {
        w.onload = () => {
          setTimeout(() => { w.print(); }, 800);
        };
      }
    } catch {
      toast.error("Failed to print document");
    }
  }

  return (
    <div className="space-y-5 w-full">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">
            {filteredDocs.length === docs.length
              ? `${docs.length} document${docs.length !== 1 ? 's' : ''}`
              : `${filteredDocs.length} of ${docs.length} documents`}
          </p>
        </div>
      </div>

      {/* Search + Category Filter */}
      <div className="space-y-3">
        {/* Search */}
        <div className="relative">
          <FiSearch size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by document title..."
            className="w-full pl-10 pr-9 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#0f1524] text-sm text-slate-800 dark:text-slate-200 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#1E2B7A]/20 focus:border-[#1E2B7A] transition-all"
          />
          {search && (
            <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300">
              <FiX size={15} />
            </button>
          )}
        </div>

        {/* Category pills */}
        <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {CATEGORIES.map((cat) => {
            const isActive = categoryFilter === cat.key;
            const count = cat.key === "all" ? docs.length : docs.filter((d) => d.documentType === cat.key).length;
            return (
              <button
                key={cat.key}
                onClick={() => setCategoryFilter(cat.key)}
                className={`shrink-0 flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-bold transition-all duration-200 border ${
                  isActive
                    ? "bg-[#1E2B7A] text-white border-[#1E2B7A] shadow-md shadow-[#1E2B7A]/15"
                    : "bg-white dark:bg-[#0f1524] text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/50"
                }`}
              >
                {cat.label}
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                  isActive ? "bg-white/20 text-white" : "bg-slate-100 dark:bg-slate-800 text-slate-400"
                }`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
        </div>
      )}

      {/* Error State */}
      {isError && !isLoading && (
        <div className="rounded-2xl border border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-950/20 p-8 text-center space-y-3">
          <FiAlertCircle size={32} className="mx-auto text-red-400" />
          <p className="font-bold text-red-700 dark:text-red-400">Failed to load documents</p>
          <p className="text-sm text-red-500 dark:text-red-400/80">Could not fetch your documents. Please try again.</p>
          <button
            onClick={() => refetch()}
            disabled={isFetching}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition-colors disabled:opacity-50"
          >
            <FiRefreshCw size={13} className={isFetching ? "animate-spin" : ""} />
            Retry
          </button>
        </div>
      )}

      {/* Empty States */}
      {!isLoading && !isError && filteredDocs.length === 0 && (
        <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#0f1524] p-12 text-center space-y-3">
          <FiFolder size={40} className="mx-auto text-slate-300 dark:text-slate-600" />
          {search || categoryFilter !== "all" ? (
            <>
              <p className="font-bold text-slate-600 dark:text-slate-400">No documents match your search</p>
              <p className="text-sm text-slate-400 dark:text-slate-500">Try adjusting your search term or category filter.</p>
              <button
                onClick={() => { setSearch(""); setCategoryFilter("all"); }}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#1E2B7A] hover:bg-[#76BC21] text-white text-xs font-bold transition-colors"
              >
                <FiRefreshCw size={12} />
                Clear filters
              </button>
            </>
          ) : (
            <>
              <p className="font-bold text-slate-600 dark:text-slate-400">No documents yet</p>
              <p className="text-sm text-slate-400 dark:text-slate-500">Documents uploaded by your healthcare providers will appear here.</p>
            </>
          )}
        </div>
      )}

      {/* Document Grid */}
      {!isLoading && !isError && filteredDocs.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredDocs.map((doc) => {
            const fileType = getFileType(doc.fileUrl);
            const isPdfFile = isPdf(doc.fileUrl);

            return (
              <div
                key={doc._id}
                className="rounded-2xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-[#0f1524] p-5 hover:shadow-lg hover:shadow-slate-200/50 dark:hover:shadow-slate-900/50 transition-all duration-200 group"
              >
                {/* Top row: icon + title + actions */}
                <div className="flex items-start gap-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${catIconBg[doc.documentType] || "bg-slate-50 dark:bg-slate-800 text-slate-500"}`}>
                    {catIcon[doc.documentType] || <FiFolder size={16} />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-slate-800 dark:text-slate-100 text-sm truncate leading-snug">{doc.title}</p>
                    <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5 flex items-center gap-1.5">
                      <FiCalendar size={10} />
                      {new Date(doc.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                    </p>
                  </div>
                </div>

                {/* Meta row */}
                <div className="mt-3 flex flex-wrap items-center gap-2">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${catColor[doc.documentType] || "bg-slate-100 text-slate-500 border-slate-200"}`}>
                    {(doc.documentType || "").replace(/_/g, " ")}
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
                    {fileType}
                  </span>
                </div>

                {/* Uploaded by */}
                {doc.uploadedBy && doc.uploadedBy.role && (
                  <p className="mt-2 text-[11px] text-slate-400 dark:text-slate-500">
                    Uploaded by{' '}
                    <span className="font-semibold text-slate-600 dark:text-slate-300">
                      {doc.uploadedBy.fullName ? `${doc.uploadedBy.fullName} (` : ''}
                      {formatRole(doc.uploadedBy.role)}
                      {doc.uploadedBy.fullName ? ')' : ''}
                    </span>
                  </p>
                )}

                {/* Actions */}
                <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2">
                  <button
                    onClick={() => handleView(doc._id)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors text-xs font-bold"
                    title="View"
                  >
                    <FiEye size={12} />
                    View
                  </button>
                  <button
                    onClick={() => handleDownload(doc._id)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 hover:bg-green-100 dark:hover:bg-green-900/40 transition-colors text-xs font-bold"
                    title="Download"
                  >
                    <FiDownload size={12} />
                    Download
                  </button>
                  {isPdfFile && (
                    <button
                      onClick={() => handlePrint(doc._id)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 hover:bg-purple-100 dark:hover:bg-purple-900/40 transition-colors text-xs font-bold"
                      title="Print"
                    >
                      <FiPrinter size={12} />
                      Print
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
