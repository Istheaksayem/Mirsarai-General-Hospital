"use client";
import { useState } from "react";
import { X, Plus, Trash2 } from "lucide-react";
import type { ScheduleException } from "@/lib/services/api";

interface Props {
  onSave: (data: Omit<ScheduleException, "_id">) => void;
  onCancel: () => void;
  saving: boolean;
}

export function ExceptionForm({ onSave, onCancel, saving }: Props) {
  const [type, setType] = useState<ScheduleException["type"]>("holiday");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [reason, setReason] = useState("");
  const [isFullDay, setIsFullDay] = useState(true);
  const [blockSlots, setBlockSlots] = useState<{ startTime: string; endTime: string }[]>([]);
  const [error, setError] = useState("");

  function addBlockSlot() {
    setBlockSlots([...blockSlots, { startTime: "09:00 AM", endTime: "10:00 AM" }]);
  }

  function updateBlockSlot(i: number, field: "startTime" | "endTime", value: string) {
    const copy = [...blockSlots];
    copy[i][field] = value;
    setBlockSlots(copy);
  }

  function removeBlockSlot(i: number) {
    setBlockSlots(blockSlots.filter((_, idx) => idx !== i));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!date) { setError("Date is required"); return; }
    if (!isFullDay && blockSlots.length === 0) { setError("Add at least one blocked time range"); return; }
    setError("");
    onSave({
      type,
      date,
      reason: reason || undefined,
      isFullDay,
      slots: isFullDay ? undefined : blockSlots,
    });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-lg rounded-2xl bg-white dark:bg-gray-900 shadow-xl">
        <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-gray-100 dark:border-gray-800">
          <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">Add Exception</h3>
          <button onClick={onCancel} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
            <X className="h-5 w-5" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/40 px-4 py-3 text-sm text-red-600 dark:text-red-400">{error}</div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Type</label>
              <select value={type} onChange={(e) => setType(e.target.value as any)}
                className="w-full h-11 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm px-3 focus:outline-none focus:ring-2 focus:ring-[#1E2B7A]/40">
                <option value="holiday">Holiday</option>
                <option value="vacation">Vacation</option>
                <option value="blocked">Blocked</option>
                <option value="custom">Custom</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Date</label>
              <input type="date" value={date} onChange={(e) => setDate(e.target.value)}
                className="w-full h-11 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm px-3 focus:outline-none focus:ring-2 focus:ring-[#1E2B7A]/40" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Reason (optional)</label>
            <input type="text" value={reason} onChange={(e) => setReason(e.target.value)}
              placeholder="e.g. National holiday, Personal day off"
              className="w-full h-11 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm px-3 focus:outline-none focus:ring-2 focus:ring-[#1E2B7A]/40" />
          </div>

          <div className="flex items-center gap-3">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={isFullDay} onChange={(e) => setIsFullDay(e.target.checked)}
                className="rounded border-gray-300 text-[#1E2B7A] focus:ring-[#1E2B7A]/40" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Full day</span>
            </label>
          </div>

          {!isFullDay && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Blocked Time Ranges</span>
                <button type="button" onClick={addBlockSlot}
                  className="flex items-center gap-1 text-xs font-bold text-[#1E2B7A] hover:underline">
                  <Plus className="h-3 w-3" /> Add range
                </button>
              </div>
              {blockSlots.map((bs, i) => (
                <div key={i} className="flex items-center gap-2">
                  <input type="text" value={bs.startTime} onChange={(e) => updateBlockSlot(i, "startTime", e.target.value)}
                    placeholder="09:00 AM"
                    className="flex-1 h-10 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm px-3 focus:outline-none focus:ring-2 focus:ring-[#1E2B7A]/40" />
                  <span className="text-xs text-gray-400">to</span>
                  <input type="text" value={bs.endTime} onChange={(e) => updateBlockSlot(i, "endTime", e.target.value)}
                    placeholder="10:00 AM"
                    className="flex-1 h-10 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm px-3 focus:outline-none focus:ring-2 focus:ring-[#1E2B7A]/40" />
                  <button type="button" onClick={() => removeBlockSlot(i)}
                    className="flex h-10 w-10 items-center justify-center rounded-xl text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={onCancel}
              className="px-5 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition">
              Cancel
            </button>
            <button type="submit" disabled={saving}
              className="px-5 py-2.5 rounded-xl bg-[#1E2B7A] text-white text-sm font-bold hover:bg-[#1a2368] disabled:opacity-60 transition">
              {saving ? "Saving..." : "Add Exception"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
