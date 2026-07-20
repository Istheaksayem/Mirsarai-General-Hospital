"use client";
import { Trash2, CalendarX } from "lucide-react";
import type { ScheduleException } from "@/lib/services/api";

const TYPE_LABELS: Record<string, string> = {
  holiday: "Holiday",
  vacation: "Vacation",
  blocked: "Blocked",
  custom: "Custom",
};

const TYPE_COLORS: Record<string, string> = {
  holiday: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300",
  vacation: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300",
  blocked: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300",
  custom: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
};

interface Props {
  exceptions: ScheduleException[];
  onDelete: (id: string) => void;
}

export function ExceptionList({ exceptions, onDelete }: Props) {
  if (exceptions.length === 0) {
    return (
      <div className="text-center py-8 text-sm text-gray-400">
        <CalendarX className="mx-auto h-8 w-8 mb-2 text-gray-300" />
        <p>No exceptions set.</p>
        <p className="text-xs mt-1">Add holidays, vacations, or blocked time slots.</p>
      </div>
    );
  }

  const sorted = [...exceptions].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  return (
    <div className="space-y-2">
      {sorted.map((exc) => (
        <div
          key={exc._id}
          className="flex items-center gap-3 rounded-xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 px-4 py-3"
        >
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-0.5">
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${TYPE_COLORS[exc.type]}`}>
                {TYPE_LABELS[exc.type]}
              </span>
              <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                {new Date(exc.date).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", year: "numeric" })}
              </span>
              {exc.isFullDay && <span className="text-[10px] text-gray-400 font-medium">Full day</span>}
            </div>
            {exc.reason && <p className="text-xs text-gray-400 truncate">{exc.reason}</p>}
            {!exc.isFullDay && exc.slots && exc.slots.length > 0 && (
              <p className="text-xs text-gray-400 mt-0.5">
                Blocked: {exc.slots.map((s) => `${s.startTime}–${s.endTime}`).join(", ")}
              </p>
            )}
          </div>
          <button
            onClick={() => onDelete(exc._id!)}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      ))}
    </div>
  );
}
