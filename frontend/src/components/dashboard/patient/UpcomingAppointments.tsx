"use client";
import { FiCalendar, FiClock, FiMapPin, FiUser, FiCheckCircle, FiXCircle } from "react-icons/fi";
import { motion } from "framer-motion";

const appointments = [
  { id: "APT-001", doctor: "Dr. Farhana Rahman", specialty: "Gynecology", department: "Block B, Room 203", date: "2026-07-15", time: "4:30 PM", type: "Follow-up", status: "confirmed", notes: "Bring previous ultrasound reports." },
  { id: "APT-002", doctor: "Dr. Abdullah Al Mamun", specialty: "Medicine", department: "Block A, Room 101", date: "2026-07-20", time: "6:00 PM", type: "Consultation", status: "pending", notes: "Fasting required before blood sugar test." },
];

const statusStyle: Record<string, string> = {
  confirmed: "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400",
  pending:   "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400",
  cancelled: "bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400",
};

export default function UpcomingAppointments() {
  return (
    <div className="space-y-4 w-full">
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-500 dark:text-slate-400">{appointments.length} upcoming appointments</p>
        <button className="px-4 py-2 bg-[#1E2B7A] hover:bg-[#76BC21] text-white rounded-xl text-xs font-bold transition-all">
          + Book Appointment
        </button>
      </div>
      {appointments.map((apt, i) => (
        <motion.div key={apt.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
          className="bg-white dark:bg-[#0f1524] rounded-2xl border border-slate-100 dark:border-slate-800 p-6 shadow-sm">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="font-black text-slate-900 dark:text-white text-lg">{apt.doctor}</p>
              <p className="text-sm text-[#1E2B7A] dark:text-[#76BC21] font-semibold">{apt.specialty}</p>
            </div>
            <span className={`px-3 py-1 rounded-full text-xs font-black ${statusStyle[apt.status]}`}>{apt.status}</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm text-slate-600 dark:text-slate-400 mb-4">
            <div className="flex items-center gap-2"><FiCalendar size={13} />{apt.date}</div>
            <div className="flex items-center gap-2"><FiClock size={13} />{apt.time}</div>
            <div className="flex items-center gap-2"><FiMapPin size={13} />{apt.department}</div>
            <div className="flex items-center gap-2"><FiUser size={13} />{apt.type}</div>
          </div>
          {apt.notes && <div className="rounded-xl bg-blue-50 dark:bg-blue-900/20 px-4 py-3 text-xs text-blue-700 dark:text-blue-300 font-medium mb-4">📌 {apt.notes}</div>}
          <div className="flex gap-2">
            <button className="flex items-center gap-1.5 px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-300 transition-colors">
              <FiCheckCircle size={13} /> Confirm
            </button>
            <button className="flex items-center gap-1.5 px-4 py-2 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-xl text-xs font-bold text-red-600 dark:text-red-400 transition-colors">
              <FiXCircle size={13} /> Cancel
            </button>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
