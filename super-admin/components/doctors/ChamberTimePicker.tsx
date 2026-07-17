"use client";
import { useState, useEffect, useCallback, useMemo } from "react";
import { Clock } from "lucide-react";
import { cn } from "@/lib/utils";

const DAYS_ORDER = ["Saturday", "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

const DAYS_BN: Record<string, string> = {
  Saturday: "শনিবার",
  Sunday: "রবিবার",
  Monday: "সোমবার",
  Tuesday: "মঙ্গলবার",
  Wednesday: "বুধবার",
  Thursday: "বৃহস্পতিবার",
  Friday: "শুক্রবার",
};

const BENGALI_DIGITS = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];

const TIME_SLOTS = (() => {
  const slots: string[] = [];
  for (let h = 0; h < 24; h++) {
    for (let m = 0; m < 60; m += 30) {
      const period = h < 12 ? "AM" : "PM";
      const hour12 = h === 0 ? 12 : h > 12 ? h - 12 : h;
      slots.push(`${hour12}:${m === 0 ? "00" : "30"} ${period}`);
    }
  }
  return slots;
})();

function parseChamberTime(chamberTimeEn: string): { startTime: string; endTime: string } | null {
  const m = chamberTimeEn.match(
    /\|\s*(\d{1,2}:\d{2}\s*(?:AM|PM))\s*[-–—]\s*(\d{1,2}:\d{2}\s*(?:AM|PM))/i
  );
  if (m) return { startTime: m[1].trim(), endTime: m[2].trim() };
  return null;
}

function toBnNum(n: number): string {
  return String(n)
    .split("")
    .map((d) => BENGALI_DIGITS[parseInt(d, 10)] ?? d)
    .join("");
}

function formatTimeBn(time12: string): string {
  const m = time12.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
  if (!m) return time12;
  let h = parseInt(m[1], 10);
  const min = parseInt(m[2], 10);
  const period = m[3].toUpperCase();

  if (period === "PM" && h !== 12) h += 12;
  if (period === "AM" && h === 12) h = 0;

  let word: string;
  if (h >= 5 && h < 12) word = "সকাল";
  else if (h >= 12 && h < 17) word = "দুপুর";
  else if (h >= 17 && h < 20) word = "বিকাল";
  else word = "রাত";

  const displayH = period === "PM" ? (h === 12 ? 12 : h - 12) : h === 0 ? 12 : h;
  return `${word} ${toBnNum(displayH)}:${toBnNum(min)}`;
}

function formatDaysEn(days: string[]): string {
  if (days.length === 0) return "";
  const sorted = DAYS_ORDER.filter((d) => days.includes(d));
  const idx = sorted.map((d) => DAYS_ORDER.indexOf(d));
  const contiguous =
    idx.length > 1 &&
    idx[idx.length - 1] - idx[0] === idx.length - 1;
  return contiguous
    ? `${sorted[0]} – ${sorted[sorted.length - 1]}`
    : sorted.join(", ");
}

function formatDaysBn(days: string[]): string {
  if (days.length === 0) return "";
  const sorted = DAYS_ORDER.filter((d) => days.includes(d));
  const bn = sorted.map((d) => DAYS_BN[d]);
  const idx = sorted.map((d) => DAYS_ORDER.indexOf(d));
  const contiguous =
    idx.length > 1 &&
    idx[idx.length - 1] - idx[0] === idx.length - 1;
  return contiguous
    ? `${bn[0]} – ${bn[bn.length - 1]}`
    : bn.join(", ");
}

function generateChamberTimeEn(days: string[], startTime: string, endTime: string): string {
  if (days.length === 0 || !startTime || !endTime) return "";
  return `${formatDaysEn(days)} | ${startTime} – ${endTime}`;
}

function generateChamberTimeBn(days: string[], startTime: string, endTime: string): string {
  if (days.length === 0 || !startTime || !endTime) return "";
  return `${formatDaysBn(days)} | ${formatTimeBn(startTime)} – ${formatTimeBn(endTime)}`;
}

interface ChamberTimePickerProps {
  availableDays: string[];
  chamberTime: { en: string; bn: string };
  onDaysChange: (days: string[]) => void;
  onChamberTimeChange: (time: { en: string; bn: string }) => void;
  dayErrors?: string;
  timeErrors?: string;
  showTitle?: boolean;
}

export function ChamberTimePicker({
  availableDays,
  chamberTime,
  onDaysChange,
  onChamberTimeChange,
  dayErrors,
  timeErrors,
  showTitle = true,
}: ChamberTimePickerProps) {
  const [startTime, setStartTime] = useState("9:00 AM");
  const [endTime, setEndTime] = useState("5:00 PM");

  // Sync internal time state from existing chamberTime prop
  useEffect(() => {
    const parsed = parseChamberTime(chamberTime?.en ?? "");
    if (parsed) {
      setStartTime(parsed.startTime);
      setEndTime(parsed.endTime);
    } else {
      setStartTime("9:00 AM");
      setEndTime("5:00 PM");
    }
  }, [chamberTime?.en]);

  const handleDayToggle = useCallback(
    (day: string) => {
      const next = availableDays.includes(day)
        ? availableDays.filter((d) => d !== day)
        : [...availableDays, day];
      onDaysChange(next);
      onChamberTimeChange({
        en: generateChamberTimeEn(next, startTime, endTime),
        bn: generateChamberTimeBn(next, startTime, endTime),
      });
    },
    [availableDays, startTime, endTime, onDaysChange, onChamberTimeChange]
  );

  const handleStartTimeChange = useCallback(
    (val: string) => {
      setStartTime(val);
      onChamberTimeChange({
        en: generateChamberTimeEn(availableDays, val, endTime),
        bn: generateChamberTimeBn(availableDays, val, endTime),
      });
    },
    [availableDays, endTime, onChamberTimeChange]
  );

  const handleEndTimeChange = useCallback(
    (val: string) => {
      setEndTime(val);
      onChamberTimeChange({
        en: generateChamberTimeEn(availableDays, startTime, val),
        bn: generateChamberTimeBn(availableDays, startTime, val),
      });
    },
    [availableDays, startTime, onChamberTimeChange]
  );

  const previewEn = useMemo(
    () => generateChamberTimeEn(availableDays, startTime, endTime),
    [availableDays, startTime, endTime]
  );

  const previewBn = useMemo(
    () => generateChamberTimeBn(availableDays, startTime, endTime),
    [availableDays, startTime, endTime]
  );

  return (
    <div className="space-y-5">
      {showTitle && (
        <div className="flex items-center gap-2">
          <Clock className="h-5 w-5 text-[#1E2B7A] dark:text-[#76BC21]" />
          <h3 className="font-semibold text-gray-900 dark:text-gray-100">
            Chamber Schedule
          </h3>
        </div>
      )}

      {/* Available Days */}
      <div>
        <label className="mb-2 flex items-center gap-1 text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">
          Available Days <span className="text-red-500">*</span>
        </label>
        <div className="flex flex-wrap gap-2">
          {DAYS_ORDER.map((day) => {
            const selected = availableDays.includes(day);
            return (
              <button
                key={day}
                type="button"
                onClick={() => handleDayToggle(day)}
                className={cn(
                  "rounded-lg border px-3 py-1.5 text-xs font-semibold transition-colors",
                  selected
                    ? "border-[#1E2B7A]/40 bg-[#1E2B7A]/10 text-[#1E2B7A] dark:border-blue-400/30 dark:bg-blue-400/10 dark:text-blue-400"
                    : "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-500 hover:border-gray-300 dark:hover:border-gray-600"
                )}
              >
                {day.slice(0, 3)}
              </button>
            );
          })}
        </div>
        {dayErrors && <p className="mt-1.5 text-xs text-red-500">{dayErrors}</p>}
      </div>

      {/* Time Range */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="mb-2 flex items-center gap-1 text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">
            Start Time <span className="text-red-500">*</span>
          </label>
          <select
            value={startTime}
            onChange={(e) => handleStartTimeChange(e.target.value)}
            className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-3.5 py-2.5 text-sm text-gray-900 dark:text-gray-100 focus:border-[#1E2B7A] focus:ring-2 focus:ring-[#1E2B7A]/20 focus:outline-none transition-all appearance-none cursor-pointer"
          >
            {TIME_SLOTS.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-2 flex items-center gap-1 text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">
            End Time <span className="text-red-500">*</span>
          </label>
          <select
            value={endTime}
            onChange={(e) => handleEndTimeChange(e.target.value)}
            className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-3.5 py-2.5 text-sm text-gray-900 dark:text-gray-100 focus:border-[#1E2B7A] focus:ring-2 focus:ring-[#1E2B7A]/20 focus:outline-none transition-all appearance-none cursor-pointer"
          >
            {TIME_SLOTS.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>
      </div>
      {timeErrors && <p className="text-xs text-red-500">{timeErrors}</p>}

      {/* Live Preview */}
      {previewEn && (
        <div className="rounded-xl border border-blue-100 dark:border-blue-900/30 bg-blue-50/50 dark:bg-blue-950/20 px-4 py-3 space-y-1">
          <p className="text-xs font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wide">
            Preview
          </p>
          <p className="text-sm text-gray-700 dark:text-gray-300">
            <span className="font-medium text-gray-500 dark:text-gray-400">EN:</span> {previewEn}
          </p>
          <p className="text-sm text-gray-700 dark:text-gray-300">
            <span className="font-medium text-gray-500 dark:text-gray-400">BN:</span> {previewBn}
          </p>
        </div>
      )}
    </div>
  );
}
