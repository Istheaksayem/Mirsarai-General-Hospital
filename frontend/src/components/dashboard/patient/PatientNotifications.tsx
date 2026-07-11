"use client";
import { useState } from "react";
import { FiBell, FiCalendar, FiFileText, FiAlertCircle, FiCheckCircle } from "react-icons/fi";

const notifications = [
  { id: 1, type: "appointment", title: "Appointment Reminder", message: "You have an appointment with Dr. Farhana Rahman tomorrow at 4:30 PM.", time: "2 hours ago", read: false },
  { id: 2, type: "report",      title: "Lab Report Ready", message: "Your CBC blood test report is now available in Document Vault.", time: "Yesterday", read: false },
  { id: 3, type: "alert",       title: "Prescription Expiring", message: "Your Metformin prescription expires in 7 days. Please consult your doctor.", time: "2 days ago", read: false },
  { id: 4, type: "appointment", title: "Appointment Confirmed", message: "Your appointment with Dr. Abdullah Al Mamun on July 20 has been confirmed.", time: "3 days ago", read: true },
  { id: 5, type: "report",      title: "Ultrasound Report Uploaded", message: "Your abdominal ultrasound report has been uploaded by Dr. Nusrat Jahan.", time: "1 week ago", read: true },
];

const typeIcon: Record<string, React.ReactNode> = {
  appointment: <FiCalendar size={15} className="text-blue-500" />,
  report:      <FiFileText size={15} className="text-green-500" />,
  alert:       <FiAlertCircle size={15} className="text-amber-500" />,
};

export default function PatientNotifications() {
  const [items, setItems] = useState(notifications);
  const unread = items.filter(n => !n.read).length;

  const markAll = () => setItems(i => i.map(n => ({ ...n, read: true })));
  const markOne = (id: number) => setItems(i => i.map(n => n.id === id ? { ...n, read: true } : n));

  return (
    <div className="space-y-4 max-w-2xl">
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-500 dark:text-slate-400">{unread} unread notifications</p>
        {unread > 0 && (
          <button onClick={markAll} className="text-xs font-bold text-[#1E2B7A] dark:text-[#76BC21] hover:underline">
            Mark all as read
          </button>
        )}
      </div>
      <div className="space-y-3">
        {items.map(n => (
          <div key={n.id} className={`bg-white dark:bg-[#0f1524] rounded-2xl border p-4 transition-all ${n.read ? "border-slate-100 dark:border-slate-800 opacity-70" : "border-[#1E2B7A]/20 dark:border-[#76BC21]/20 bg-[#1E2B7A]/2"}`}>
            <div className="flex items-start gap-3">
              <div className="h-9 w-9 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0 mt-0.5">
                {typeIcon[n.type]}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <p className="text-sm font-bold text-slate-800 dark:text-slate-200">{n.title}</p>
                  <span className="text-[10px] text-slate-400 shrink-0">{n.time}</span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{n.message}</p>
                {!n.read && (
                  <button onClick={() => markOne(n.id)} className="mt-2 flex items-center gap-1 text-xs font-bold text-[#1E2B7A] dark:text-[#76BC21] hover:underline">
                    <FiCheckCircle size={11} /> Mark as read
                  </button>
                )}
              </div>
              {!n.read && <span className="w-2 h-2 rounded-full bg-[#76BC21] shrink-0 mt-1.5" />}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
