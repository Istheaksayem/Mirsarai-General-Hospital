"use client";
import { FiFileText, FiDownload, FiEye, FiCalendar } from "react-icons/fi";

const documents = [
  { id: 1, name: "CBC Blood Test Report", type: "Lab Report", date: "2026-07-10", doctor: "Dr. Mahmud", size: "245 KB", category: "lab" },
  { id: 2, name: "Abdominal Ultrasound Report", type: "Radiology", date: "2026-06-10", doctor: "Dr. Nusrat Jahan", size: "1.2 MB", category: "radiology" },
  { id: 3, name: "Metformin Prescription", type: "Prescription", date: "2026-07-05", doctor: "Dr. Abdullah", size: "89 KB", category: "prescription" },
  { id: 4, name: "Lipid Profile Report", type: "Lab Report", date: "2026-05-20", doctor: "Dr. Mahmud", size: "198 KB", category: "lab" },
  { id: 5, name: "Echocardiogram Report", type: "Cardiology", date: "2026-04-15", doctor: "Dr. Nasrin Ahmed", size: "3.4 MB", category: "cardiology" },
];

const catColor: Record<string, string> = {
  lab:          "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400",
  radiology:    "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400",
  prescription: "bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400",
  cardiology:   "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400",
};

export default function DocumentVault() {
  return (
    <div className="space-y-4 max-w-3xl">
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-500 dark:text-slate-400">{documents.length} documents</p>
        <button className="px-4 py-2 bg-[#1E2B7A] hover:bg-[#76BC21] text-white rounded-xl text-xs font-bold transition-all">
          + Upload Document
        </button>
      </div>
      <div className="bg-white dark:bg-[#0f1524] rounded-2xl border border-slate-100 dark:border-slate-800 divide-y divide-slate-50 dark:divide-slate-800 overflow-hidden">
        {documents.map(doc => (
          <div key={doc.id} className="flex items-center gap-4 px-5 py-4 hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
            <div className="h-10 w-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0">
              <FiFileText size={18} className="text-[#1E2B7A] dark:text-[#76BC21]" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-bold text-slate-800 dark:text-slate-200 truncate">{doc.name}</p>
              <div className="flex items-center gap-3 mt-0.5">
                <span className={`text-[10px] px-2 py-0.5 rounded font-black ${catColor[doc.category]}`}>{doc.type}</span>
                <span className="text-xs text-slate-400 flex items-center gap-1"><FiCalendar size={11} />{doc.date}</span>
                <span className="text-xs text-slate-400">{doc.size}</span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">{doc.doctor}</p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button className="h-8 w-8 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 flex items-center justify-center hover:bg-blue-100 transition-colors" title="View">
                <FiEye size={13} />
              </button>
              <button className="h-8 w-8 rounded-lg bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 flex items-center justify-center hover:bg-green-100 transition-colors" title="Download">
                <FiDownload size={13} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
