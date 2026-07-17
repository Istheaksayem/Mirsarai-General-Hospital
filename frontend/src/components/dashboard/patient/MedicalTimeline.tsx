"use client";
import { FiCalendar, FiFileText, FiActivity, FiHeart, FiAlertCircle } from "react-icons/fi";
import { useQuery } from "@tanstack/react-query";
import { patientGetTimeline } from "@/services/api";

const typeConfig: Record<string, { icon: React.ComponentType<{ size?: number }>; colors: string }> = {
  appointment: { icon: FiActivity, colors: "bg-blue-100 dark:bg-blue-900/30 text-blue-600" },
  document:    { icon: FiFileText, colors: "bg-green-100 dark:bg-green-900/30 text-green-600" },
};

export default function MedicalTimeline() {
  const { data: timeline = [] } = useQuery({ queryKey: ["patient-timeline"], queryFn: patientGetTimeline });
  const items = timeline as Record<string, unknown>[];

  const formatDate = (d: string) => {
    const date = new Date(d);
    return date.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
  };

  return (
    <div className="space-y-4 w-full">
      <p className="text-sm text-slate-500 dark:text-slate-400">{items.length} events in your medical history</p>

      <div className="relative">
        <div className="absolute left-[19px] top-0 bottom-0 w-0.5 bg-slate-200 dark:bg-slate-700" />

        <div className="space-y-6">
          {items.length === 0 ? (
            <p className="text-sm text-slate-400 text-center py-8">No timeline events yet</p>
          ) : (
            items.map((item, i) => {
              const type = (item.type as string) || "appointment";
              const cfg = typeConfig[type] || typeConfig.appointment;
              const Icon = cfg.icon;
              const meta = item.metadata as Record<string, unknown> || {};
              return (
                <div key={i} className="flex gap-4">
                  <div className={`relative z-10 h-10 w-10 rounded-full flex items-center justify-center shrink-0 shadow-sm ${cfg.colors}`}>
                    <Icon size={15} />
                  </div>
                  <div className="flex-1 pb-2">
                    <div className="bg-white dark:bg-[#0f1524] rounded-2xl border border-slate-100 dark:border-slate-800 p-4 shadow-sm hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div>
                          <span className={`text-[10px] px-2 py-0.5 rounded font-black ${cfg.colors} mr-2`}>{type}</span>
                          <span className="text-[10px] text-slate-400 font-semibold">{formatDate(item.date as string)}</span>
                        </div>
                      </div>
                      <h4 className="font-bold text-slate-800 dark:text-slate-200 text-sm mb-1">{item.title as string}</h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{item.description as string}</p>
                      {meta.doctor ? <p className="text-[11px] text-slate-400 mt-2 font-semibold">👤 {String(meta.doctor)}</p> : null}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
