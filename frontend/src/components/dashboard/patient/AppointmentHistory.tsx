"use client";
import { FiCalendar, FiUser, FiFileText } from "react-icons/fi";

const history = [
  { id: "APT-H001", doctor: "Dr. Abdullah Al Mamun", specialty: "Medicine", date: "2026-07-05", time: "6:00 PM", status: "completed", diagnosis: "Hypertension follow-up", hasReport: true },
  { id: "APT-H002", doctor: "Dr. Farhana Rahman", specialty: "Gynecology", date: "2026-06-20", time: "4:30 PM", status: "completed", diagnosis: "Prenatal Care — Week 28", hasReport: true },
  { id: "APT-H003", doctor: "Dr. Nusrat Jahan", specialty: "Radiology", date: "2026-06-10", time: "11:00 AM", status: "completed", diagnosis: "Abdominal USG", hasReport: true },
  { id: "APT-H004", doctor: "Dr. Mahmudul Hasan", specialty: "Pediatrics", date: "2026-05-15", time: "3:00 PM", status: "cancelled", diagnosis: "—", hasReport: false },
];

const statusStyle: Record<string, string> = {
  completed: "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400",
  cancelled: "bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400",
  "no-show": "bg-gray-100 dark:bg-gray-800 text-gray-500",
};

export default function AppointmentHistory() {
  return (
    <div className="space-y-4 max-w-3xl">
      <p className="text-sm text-slate-500 dark:text-slate-400">{history.length} past appointments</p>
      <div className="bg-white dark:bg-[#0f1524] rounded-2xl border border-slate-100 dark:border-slate-800 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40">
              {["Doctor", "Date", "Diagnosis", "Status", "Report"].map(h => (
                <th key={h} className="px-4 py-3 text-left text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-wider">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
            {history.map(apt => (
              <tr key={apt.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                <td className="px-4 py-3.5">
                  <p className="font-bold text-slate-800 dark:text-slate-200">{apt.doctor}</p>
                  <p className="text-xs text-slate-400">{apt.specialty}</p>
                </td>
                <td className="px-4 py-3.5 text-slate-600 dark:text-slate-400">
                  <div className="flex items-center gap-1.5"><FiCalendar size={12} />{apt.date}</div>
                  <p className="text-xs text-slate-400 mt-0.5">{apt.time}</p>
                </td>
                <td className="px-4 py-3.5 text-slate-600 dark:text-slate-400 text-xs">{apt.diagnosis}</td>
                <td className="px-4 py-3.5">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-black ${statusStyle[apt.status]}`}>{apt.status}</span>
                </td>
                <td className="px-4 py-3.5">
                  {apt.hasReport ? (
                    <button className="flex items-center gap-1.5 text-xs font-bold text-[#1E2B7A] dark:text-[#76BC21] hover:underline">
                      <FiFileText size={12} /> View
                    </button>
                  ) : <span className="text-xs text-slate-400">—</span>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
