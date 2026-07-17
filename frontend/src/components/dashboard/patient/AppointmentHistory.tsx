"use client";
import { FiCalendar, FiUser, FiFileText } from "react-icons/fi";
import { useQuery } from "@tanstack/react-query";
import { patientGetAppointments } from "@/services/api";

const statusStyle: Record<string, string> = {
  completed: "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400",
  cancelled: "bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400",
  "no-show": "bg-gray-100 dark:bg-gray-800 text-gray-500",
};

export default function AppointmentHistory() {
  const { data: appointments = [] } = useQuery({ queryKey: ["patient-appointments"], queryFn: patientGetAppointments });

  const history = (appointments as Record<string, unknown>[]).filter(
    a => a.status === "completed" || a.status === "cancelled" || a.status === "no-show"
  );

  return (
    <div className="space-y-4 w-full">
      <p className="text-sm text-slate-500 dark:text-slate-400">{history.length} past appointments</p>
      <div className="bg-white dark:bg-[#0f1524] rounded-2xl border border-slate-100 dark:border-slate-800 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40">
              {["Doctor", "Date", "Status", "Reason"].map(h => (
                <th key={h} className="px-4 py-3 text-left text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-wider">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
            {history.length === 0 ? (
              <tr><td colSpan={4} className="px-4 py-8 text-center text-sm text-slate-400">No past appointments</td></tr>
            ) : (
              history.map(apt => {
                const doc = apt.doctor as Record<string, unknown> | undefined;
                return (
                  <tr key={apt._id as string} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                    <td className="px-4 py-3.5">
                      <p className="font-bold text-slate-800 dark:text-slate-200">{doc?.name as string || "Doctor"}</p>
                      <p className="text-xs text-slate-400">{doc?.department as string || apt.department as string || ""}</p>
                    </td>
                    <td className="px-4 py-3.5 text-slate-600 dark:text-slate-400">
                      <div className="flex items-center gap-1.5"><FiCalendar size={12} />{new Date(apt.date as string).toLocaleDateString()}</div>
                      <p className="text-xs text-slate-400 mt-0.5">{apt.time as string}</p>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-black ${statusStyle[apt.status as string] || "bg-slate-100 text-slate-500"}`}>{apt.status as string}</span>
                    </td>
                    <td className="px-4 py-3.5 text-xs text-slate-500">{apt.reason as string || "—"}</td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
