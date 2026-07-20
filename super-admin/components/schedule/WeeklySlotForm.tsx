"use client";
import { useState, useEffect } from "react";
import { X } from "lucide-react";
import type { WeeklySlot } from "@/lib/services/api";

const DAY_OPTIONS = [
  { value: 0, label: "Sunday" },
  { value: 1, label: "Monday" },
  { value: 2, label: "Tuesday" },
  { value: 3, label: "Wednesday" },
  { value: 4, label: "Thursday" },
  { value: 5, label: "Friday" },
  { value: 6, label: "Saturday" },
];

interface Props {
  initial?: WeeklySlot | null;
  onSave: (data: Omit<WeeklySlot, "_id">) => void;
  onCancel: () => void;
  saving: boolean;
}

export function WeeklySlotForm({ initial, onSave, onCancel, saving }: Props) {
  const [dayOfWeek, setDayOfWeek] = useState(initial?.dayOfWeek ?? 0);
  const [startTime, setStartTime] = useState(initial?.startTime ?? "09:00 AM");
  const [endTime, setEndTime] = useState(initial?.endTime ?? "05:00 PM");
  const [breakStart, setBreakStart] = useState(initial?.breakStart ?? "");
  const [breakEnd, setBreakEnd] = useState(initial?.breakEnd ?? "");
  const [slotDuration, setSlotDuration] = useState(initial?.slotDuration ?? 15);
  const [maxPatients, setMaxPatients] = useState(initial?.maxPatients ?? 1);
  const [type, setType] = useState<"online" | "offline" | "both">(initial?.type ?? "offline");

  const [error, setError] = useState("");

  function validate() {
    if (!startTime || !endTime) return "Start and end time are required";
    if (breakStart && !breakEnd) return "Break end time is required";
    if (!breakStart && breakEnd) return "Break start time is required";
    return null;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const err = validate();
    if (err) { setError(err); return; }
    setError("");
    onSave({
      dayOfWeek,
      startTime,
      endTime,
      breakStart: breakStart || undefined,
      breakEnd: breakEnd || undefined,
      slotDuration,
      maxPatients,
      type,
      isActive: true,
    });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-lg rounded-2xl bg-white dark:bg-gray-900 shadow-xl">
        <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-gray-100 dark:border-gray-800">
          <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">
            {initial ? "Edit Time Slot" : "Add Time Slot"}
          </h3>
          <button onClick={onCancel} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
            <X className="h-5 w-5" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/40 px-4 py-3 text-sm text-red-600 dark:text-red-400">
              {error}
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Day</label>
              <select value={dayOfWeek} onChange={(e) => setDayOfWeek(Number(e.target.value))}
                className="w-full h-11 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm px-3 focus:outline-none focus:ring-2 focus:ring-[#1E2B7A]/40">
                {DAY_OPTIONS.map((d) => <option key={d.value} value={d.value}>{d.label}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Type</label>
              <select value={type} onChange={(e) => setType(e.target.value as any)}
                className="w-full h-11 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm px-3 focus:outline-none focus:ring-2 focus:ring-[#1E2B7A]/40">
                <option value="offline">Offline</option>
                <option value="online">Online</option>
                <option value="both">Both</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Start Time</label>
              <input type="text" value={startTime} onChange={(e) => setStartTime(e.target.value)}
                placeholder="09:00 AM"
                className="w-full h-11 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm px-3 focus:outline-none focus:ring-2 focus:ring-[#1E2B7A]/40" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">End Time</label>
              <input type="text" value={endTime} onChange={(e) => setEndTime(e.target.value)}
                placeholder="05:00 PM"
                className="w-full h-11 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm px-3 focus:outline-none focus:ring-2 focus:ring-[#1E2B7A]/40" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Break Start</label>
              <input type="text" value={breakStart} onChange={(e) => setBreakStart(e.target.value)}
                placeholder="01:00 PM (optional)"
                className="w-full h-11 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm px-3 focus:outline-none focus:ring-2 focus:ring-[#1E2B7A]/40" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Break End</label>
              <input type="text" value={breakEnd} onChange={(e) => setBreakEnd(e.target.value)}
                placeholder="02:00 PM (optional)"
                className="w-full h-11 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm px-3 focus:outline-none focus:ring-2 focus:ring-[#1E2B7A]/40" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Slot Duration (min)</label>
              <input type="number" min={5} max={120} step={5} value={slotDuration}
                onChange={(e) => setSlotDuration(Number(e.target.value))}
                className="w-full h-11 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm px-3 focus:outline-none focus:ring-2 focus:ring-[#1E2B7A]/40" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Max Patients per Slot</label>
              <input type="number" min={1} max={99} value={maxPatients}
                onChange={(e) => setMaxPatients(Number(e.target.value))}
                className="w-full h-11 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm px-3 focus:outline-none focus:ring-2 focus:ring-[#1E2B7A]/40" />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={onCancel}
              className="px-5 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition">
              Cancel
            </button>
            <button type="submit" disabled={saving}
              className="px-5 py-2.5 rounded-xl bg-[#1E2B7A] text-white text-sm font-bold hover:bg-[#1a2368] disabled:opacity-60 transition">
              {saving ? "Saving..." : initial ? "Update Slot" : "Add Slot"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
