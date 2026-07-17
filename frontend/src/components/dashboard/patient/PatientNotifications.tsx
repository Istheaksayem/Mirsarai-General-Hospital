"use client";
import { FiBell, FiCalendar, FiFileText, FiAlertCircle, FiCheckCircle } from "react-icons/fi";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { patientGetNotifications, patientMarkNotificationRead, patientMarkAllNotificationsRead } from "@/services/api";
import toast from "react-hot-toast";

const typeIcon: Record<string, React.ReactNode> = {
  appointment_reminder: <FiCalendar size={15} className="text-blue-500" />,
  report_ready:         <FiFileText size={15} className="text-green-500" />,
  announcement:         <FiBell size={15} className="text-purple-500" />,
  status_update:        <FiAlertCircle size={15} className="text-amber-500" />,
  general:              <FiBell size={15} className="text-slate-500" />,
};

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

export default function PatientNotifications() {
  const qc = useQueryClient();
  const { data: items = [] } = useQuery({ queryKey: ["patient-notifications"], queryFn: patientGetNotifications });

  const markAllMutation = useMutation({
    mutationFn: patientMarkAllNotificationsRead,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["patient-notifications"] });
      toast.success("All marked as read");
    },
  });

  const markOneMutation = useMutation({
    mutationFn: (id: string) => patientMarkNotificationRead(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["patient-notifications"] }),
  });

  const notifs = items as Record<string, unknown>[];
  const unread = notifs.filter(n => !n.isRead).length;

  return (
    <div className="space-y-4 w-full">
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-500 dark:text-slate-400">{unread} unread of {notifs.length}</p>
        {unread > 0 && (
          <button onClick={() => markAllMutation.mutate()} className="text-xs font-bold text-[#1E2B7A] dark:text-[#76BC21] hover:underline">
            Mark all as read
          </button>
        )}
      </div>
      <div className="space-y-3">
        {notifs.length === 0 ? (
          <p className="text-sm text-slate-400 text-center py-8">No notifications yet</p>
        ) : (
          notifs.map(n => (
            <div key={n._id as string} className={`bg-white dark:bg-[#0f1524] rounded-2xl border p-4 transition-all ${n.isRead ? "border-slate-100 dark:border-slate-800 opacity-70" : "border-[#1E2B7A]/20 dark:border-[#76BC21]/20 bg-[#1E2B7A]/2"}`}>
              <div className="flex items-start gap-3">
                <div className="h-9 w-9 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0 mt-0.5">
                  {typeIcon[(n.type as string) || "general"] || <FiBell size={15} className="text-slate-500" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-sm font-bold text-slate-800 dark:text-slate-200">{n.title as string}</p>
                    <span className="text-[10px] text-slate-400 shrink-0">{timeAgo(n.createdAt as string)}</span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{n.message as string}</p>
                  {!n.isRead && (
                    <button onClick={() => markOneMutation.mutate(n._id as string)} className="mt-2 flex items-center gap-1 text-xs font-bold text-[#1E2B7A] dark:text-[#76BC21] hover:underline">
                      <FiCheckCircle size={11} /> Mark as read
                    </button>
                  )}
                </div>
                {!n.isRead && <span className="w-2 h-2 rounded-full bg-[#76BC21] shrink-0 mt-1.5" />}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
