"use client";
import { FiCalendar, FiBell, FiActivity, FiFileText, FiHeart, FiClock } from "react-icons/fi";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { patientGetProfile, patientGetAppointments, patientGetNotifications, patientGetTimeline, patientGetDocuments } from "@/services/api";

export default function PatientDashboard() {
  const { data: profile } = useQuery({ queryKey: ["patient-profile"], queryFn: patientGetProfile });
  const { data: appointments = [] } = useQuery({ queryKey: ["patient-appointments"], queryFn: patientGetAppointments });
  const { data: notifications = [] } = useQuery({ queryKey: ["patient-notifications"], queryFn: patientGetNotifications });
  const { data: documents = [] } = useQuery({ queryKey: ["patient-documents"], queryFn: patientGetDocuments });
  const { data: timeline = [] } = useQuery({ queryKey: ["patient-timeline"], queryFn: patientGetTimeline });

  const upcoming = (appointments as Record<string, unknown>[]).filter(a => a.status === "pending" || a.status === "confirmed");
  const unread = (notifications as Record<string, unknown>[]).filter(n => !n.isRead);
  const recentTimeline = (timeline as Record<string, unknown>[]).slice(0, 4);

  const stats = [
    { label: "Upcoming Appointments", value: upcoming.length, icon: FiCalendar, color: "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400" },
    { label: "Unread Notifications",  value: unread.length, icon: FiBell,     color: "bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400" },
    { label: "Documents", value: documents.length, icon: FiFileText, color: "bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400" },
    { label: "Active Prescriptions",  value: 0, icon: FiHeart,    color: "bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400" },
  ];

  const nextAppointment = upcoming[0] as Record<string, unknown> | undefined;
  const doc = nextAppointment?.doctor as Record<string, unknown> | undefined;

  const typeColor: Record<string, string> = {
    appointment:  "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400",
    document: "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400",
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
            className="bg-white dark:bg-[#0f1524] rounded-2xl border border-slate-100 dark:border-slate-800 p-5 shadow-sm">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${s.color}`}>
              <s.icon size={18} />
            </div>
            <p className="text-2xl font-black text-slate-900 dark:text-white">{s.value}</p>
            <p className="text-xs text-slate-400 dark:text-slate-500 font-semibold mt-0.5">{s.label}</p>
          </motion.div>
        ))}
      </div>

      {nextAppointment && (
        <div className="bg-gradient-to-r from-[#1E2B7A] to-[#243282] rounded-2xl p-6 text-white shadow-lg">
          <p className="text-xs font-bold uppercase tracking-widest opacity-70 mb-2">Next Appointment</p>
          <h3 className="text-xl font-black mb-1">{doc?.name as string || "Doctor"}</h3>
          <p className="text-sm opacity-80 mb-4">{doc?.department as string || ""}</p>
          <div className="flex items-center gap-6 text-sm">
            <div className="flex items-center gap-2"><FiCalendar size={14} /><span>{new Date(nextAppointment.date as string).toLocaleDateString()}</span></div>
            <div className="flex items-center gap-2"><FiClock size={14} /><span>{nextAppointment.time as string}</span></div>
          </div>
          <div className="mt-4 flex gap-3">
            <button className="px-4 py-2 bg-[#76BC21] hover:bg-[#67a81d] rounded-xl text-xs font-bold transition-colors">View Details</button>
            <button className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-xl text-xs font-bold transition-colors border border-white/20">Reschedule</button>
          </div>
        </div>
      )}

      <div className="bg-white dark:bg-[#0f1524] rounded-2xl border border-slate-100 dark:border-slate-800 p-6">
        <h3 className="text-sm font-black text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-4">Recent Activity</h3>
        <div className="space-y-3">
          {recentTimeline.length > 0 ? recentTimeline.map((item, i) => {
            const t = item as Record<string, unknown>;
            const type = (t.type as string) || "appointment";
            return (
              <div key={i} className="flex items-start gap-3">
                <span className={`mt-0.5 px-2 py-0.5 rounded text-[10px] font-black uppercase shrink-0 ${typeColor[type] || typeColor.appointment}`}>
                  {type === "appointment" ? "Visit" : type === "document" ? "Doc" : "Event"}
                </span>
                <div>
                  <p className="text-sm text-slate-700 dark:text-slate-300 font-medium">{t.title as string}</p>
                  <p className="text-xs text-slate-400 mt-0.5">{new Date(t.date as string).toLocaleDateString()}</p>
                </div>
              </div>
            );
          }) : (
            <p className="text-sm text-slate-400">No recent activity</p>
          )}
        </div>
      </div>
    </div>
  );
}
