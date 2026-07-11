"use client";
import { FiCalendar, FiBell, FiActivity, FiFileText, FiHeart, FiClock } from "react-icons/fi";
import { motion } from "framer-motion";

const stats = [
  { label: "Upcoming Appointments", value: 2, icon: FiCalendar, color: "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400" },
  { label: "Unread Notifications",  value: 3, icon: FiBell,     color: "bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400" },
  { label: "Lab Reports Ready",     value: 1, icon: FiFileText, color: "bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400" },
  { label: "Active Prescriptions",  value: 2, icon: FiHeart,    color: "bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400" },
];

const recentActivity = [
  { date: "2026-07-10", text: "Blood test results uploaded by Dr. Mahmud", type: "lab" },
  { date: "2026-07-08", text: "Appointment confirmed with Dr. Farhana Rahman", type: "appointment" },
  { date: "2026-07-05", text: "Prescription renewed — Metformin 500mg", type: "prescription" },
  { date: "2026-07-01", text: "Consultation completed with Dr. Abdullah", type: "consultation" },
];

const typeColor: Record<string, string> = {
  lab:          "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400",
  appointment:  "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400",
  prescription: "bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400",
  consultation: "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400",
};

export default function PatientDashboard() {
  return (
    <div className="space-y-6">
      {/* Stats */}
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

      {/* Next appointment highlight */}
      <div className="bg-gradient-to-r from-[#1E2B7A] to-[#243282] rounded-2xl p-6 text-white shadow-lg">
        <p className="text-xs font-bold uppercase tracking-widest opacity-70 mb-2">Next Appointment</p>
        <h3 className="text-xl font-black mb-1">Dr. Farhana Rahman</h3>
        <p className="text-sm opacity-80 mb-4">Gynecology & Obstetrics · Consultation</p>
        <div className="flex items-center gap-6 text-sm">
          <div className="flex items-center gap-2"><FiCalendar size={14} /><span>July 15, 2026</span></div>
          <div className="flex items-center gap-2"><FiClock size={14} /><span>4:30 PM</span></div>
        </div>
        <div className="mt-4 flex gap-3">
          <button className="px-4 py-2 bg-[#76BC21] hover:bg-[#67a81d] rounded-xl text-xs font-bold transition-colors">
            View Details
          </button>
          <button className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-xl text-xs font-bold transition-colors border border-white/20">
            Reschedule
          </button>
        </div>
      </div>

      {/* Recent activity */}
      <div className="bg-white dark:bg-[#0f1524] rounded-2xl border border-slate-100 dark:border-slate-800 p-6">
        <h3 className="text-sm font-black text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-4">Recent Activity</h3>
        <div className="space-y-3">
          {recentActivity.map((item, i) => (
            <div key={i} className="flex items-start gap-3">
              <span className={`mt-0.5 px-2 py-0.5 rounded text-[10px] font-black uppercase shrink-0 ${typeColor[item.type]}`}>{item.type}</span>
              <div>
                <p className="text-sm text-slate-700 dark:text-slate-300 font-medium">{item.text}</p>
                <p className="text-xs text-slate-400 mt-0.5">{item.date}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
