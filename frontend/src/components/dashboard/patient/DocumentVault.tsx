"use client";
import { FiFileText, FiDownload, FiEye, FiCalendar, FiPrinter } from "react-icons/fi";
import { useQuery } from "@tanstack/react-query";
import { patientGetDocuments, API_URL } from "@/services/api";

const catColor: Record<string, string> = {
  diagnostic_report: "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400",
  prescription:      "bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400",
  admission_form:    "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400",
  discharge_summary: "bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400",
  certificate:       "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400",
  bill_receipt:      "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400",
  other:             "bg-slate-100 dark:bg-slate-800 text-slate-500",
};

function docFileUrl(docId: string) {
  return `${API_URL}/patient/documents/${docId}/file`;
}

export default function DocumentVault() {
  const { data: documents = [] } = useQuery({ queryKey: ["patient-documents"], queryFn: patientGetDocuments });
  const docs = documents as Record<string, unknown>[];

  function handlePrint(docId: string) {
    const url = docFileUrl(docId);
    const w = window.open(url, "_blank");
    if (w) {
      w.onload = () => { setTimeout(() => { w.print(); }, 500); };
    }
  }

  return (
    <div className="space-y-4 w-full">
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-500 dark:text-slate-400">{docs.length} documents</p>
      </div>
      <div className="bg-white dark:bg-[#0f1524] rounded-2xl border border-slate-100 dark:border-slate-800 divide-y divide-slate-50 dark:divide-slate-800 overflow-hidden">
        {docs.length === 0 ? (
          <div className="px-5 py-8 text-center text-sm text-slate-400">No documents yet</div>
        ) : (
          docs.map(doc => (
            <div key={doc._id as string} className="flex items-center gap-4 px-5 py-4 hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
              <div className="h-10 w-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0">
                <FiFileText size={18} className="text-[#1E2B7A] dark:text-[#76BC21]" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-slate-800 dark:text-slate-200 truncate">{doc.title as string}</p>
                <div className="flex items-center gap-3 mt-0.5">
                  <span className={`text-[10px] px-2 py-0.5 rounded font-black ${catColor[doc.documentType as string] || "bg-slate-100 text-slate-500"}`}>
                    {(doc.documentType as string || "").replace(/_/g, " ")}
                  </span>
                  <span className="text-xs text-slate-400 flex items-center gap-1"><FiCalendar size={11} />{new Date(doc.createdAt as string).toLocaleDateString()}</span>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <a href={docFileUrl(doc._id as string)} target="_blank" rel="noopener noreferrer"
                  className="h-8 w-8 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 flex items-center justify-center hover:bg-blue-100 transition-colors" title="View">
                  <FiEye size={13} />
                </a>
                <a href={docFileUrl(doc._id as string)} download
                  className="h-8 w-8 rounded-lg bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 flex items-center justify-center hover:bg-green-100 transition-colors" title="Download">
                  <FiDownload size={13} />
                </a>
                <button onClick={() => handlePrint(doc._id as string)}
                  className="h-8 w-8 rounded-lg bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 flex items-center justify-center hover:bg-purple-100 transition-colors" title="Print">
                  <FiPrinter size={13} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
