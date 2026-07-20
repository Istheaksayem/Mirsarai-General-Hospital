"use client";
import { Pencil, Trash2, Clock } from "lucide-react";
import type { WeeklySlot } from "@/lib/services/api";

const DAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const TYPE_LABELS: Record<string, string> = { online: "Online", offline: "Offline", both: "Both" };

interface Props {
  slots: WeeklySlot[];
  onEdit: (slot: WeeklySlot) => void;
  onDelete: (slotId: string) => void;
}

export function WeeklySlotList({ slots, onEdit, onDelete }: Props) {
  if (slots.length === 0) {
    return (
      <div className="text-center py-8 text-sm text-gray-400">
        <Clock className="mx-auto h-8 w-8 mb-2 text-gray-300" />
        <p>No weekly slots configured yet.</p>
        <p className="text-xs mt-1">Add your first time slot to start accepting appointments.</p>
      </div>
    );
  }

  const sorted = [...slots].sort((a, b) => a.dayOfWeek - b.dayOfWeek || a.startTime.localeCompare(b.startTime));

  return (
    <div className="space-y-2">
      {sorted.map((slot) => (
        <div
          key={slot._id}
          className="flex items-center gap-3 rounded-xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 px-4 py-3 hover:shadow-sm transition-shadow"
        >
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#1E2B7A]/10 dark:bg-[#1E2B7A]/20 text-xs font-bold text-[#1E2B7A] dark:text-blue-400">
            {DAY_LABELS[slot.dayOfWeek]}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
              {slot.startTime} — {slot.endTime}
            </p>
            <p className="text-xs text-gray-400">
              {slot.slotDuration}min slots &middot; max {slot.maxPatients} per slot &middot; {TYPE_LABELS[slot.type] || slot.type}
              {slot.breakStart && slot.breakEnd && ` &middot; Break ${slot.breakStart}–${slot.breakEnd}`}
            </p>
          </div>
          <div className="flex items-center gap-1 shrink-0">
            <button
              onClick={() => onEdit(slot)}
              className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 hover:text-[#1E2B7A] hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <Pencil className="h-4 w-4" />
            </button>
            <button
              onClick={() => onDelete(slot._id!)}
              className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
