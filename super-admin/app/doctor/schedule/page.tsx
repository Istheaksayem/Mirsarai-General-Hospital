"use client";
import { useState } from "react";
import { CalendarDays, Clock, ChevronLeft, ChevronRight } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Badge } from "@/components/ui/Badge";
import { useAppointments } from "@/lib/hooks/useAppointments";

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

const TIME_SLOTS = [
  "08:00 AM", "09:00 AM", "10:00 AM", "11:00 AM",
  "12:00 PM", "01:00 PM", "02:00 PM", "03:00 PM",
  "04:00 PM", "05:00 PM",
];

const WORKING_DAYS = [1, 2, 3, 4, 0]; // Mon–Thu + Sun (example schedule)

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year: number, month: number) {
  return new Date(year, month, 1).getDay();
}

function toISODate(year: number, month: number, day: number) {
  return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

export default function DoctorSchedulePage() {
  const today = new Date();
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());
  const [selectedDate, setSelectedDate] = useState(toISODate(today.getFullYear(), today.getMonth(), today.getDate()));

  const { data: appointments = [] } = useAppointments();

  const daysInMonth = getDaysInMonth(viewYear, viewMonth);
  const firstDay = getFirstDayOfMonth(viewYear, viewMonth);

  const aptsForDate = appointments.filter((a) => a.date === selectedDate);

  function prevMonth() {
    if (viewMonth === 0) { setViewMonth(11); setViewYear((y) => y - 1); }
    else setViewMonth((m) => m - 1);
  }

  function nextMonth() {
    if (viewMonth === 11) { setViewMonth(0); setViewYear((y) => y + 1); }
    else setViewMonth((m) => m + 1);
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="My Schedule"
        description="Manage your availability and weekly appointments"
        icon={CalendarDays}
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
        {/* Calendar */}
        <div className="lg:col-span-3 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-5">
          {/* Month nav */}
          <div className="mb-5 flex items-center justify-between">
            <button
              onClick={prevMonth}
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 dark:border-gray-700 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <h3 className="font-semibold text-gray-900 dark:text-gray-100">
              {MONTHS[viewMonth]} {viewYear}
            </h3>
            <button
              onClick={nextMonth}
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 dark:border-gray-700 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>

          {/* Day headers */}
          <div className="mb-2 grid grid-cols-7 gap-1">
            {DAYS.map((d) => (
              <div key={d} className="text-center text-xs font-semibold uppercase tracking-wider text-gray-400 py-1">
                {d}
              </div>
            ))}
          </div>

          {/* Date cells */}
          <div className="grid grid-cols-7 gap-1">
            {/* Empty cells before first day */}
            {Array.from({ length: firstDay }).map((_, i) => (
              <div key={`empty-${i}`} />
            ))}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1;
              const dateStr = toISODate(viewYear, viewMonth, day);
              const isToday =
                day === today.getDate() &&
                viewMonth === today.getMonth() &&
                viewYear === today.getFullYear();
              const isSelected = dateStr === selectedDate;
              const dayOfWeek = new Date(viewYear, viewMonth, day).getDay();
              const isWorking = WORKING_DAYS.includes(dayOfWeek);
              const hasApts = appointments.some((a) => a.date === dateStr);

              return (
                <button
                  key={day}
                  onClick={() => setSelectedDate(dateStr)}
                  className={[
                    "relative flex flex-col items-center justify-center rounded-xl p-2 text-sm transition-all aspect-square",
                    isSelected
                      ? "bg-[#1E2B7A] text-white shadow-md"
                      : isToday
                      ? "border-2 border-[#1E2B7A] text-[#1E2B7A] dark:text-blue-400 font-semibold"
                      : isWorking
                      ? "hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300"
                      : "text-gray-300 dark:text-gray-600 cursor-not-allowed",
                  ].join(" ")}
                  disabled={!isWorking}
                >
                  <span>{day}</span>
                  {hasApts && (
                    <span
                      className={[
                        "absolute bottom-1 h-1 w-1 rounded-full",
                        isSelected ? "bg-white" : "bg-[#76BC21]",
                      ].join(" ")}
                    />
                  )}
                </button>
              );
            })}
          </div>

          {/* Legend */}
          <div className="mt-4 flex flex-wrap items-center gap-4 pt-4 border-t border-gray-100 dark:border-gray-800">
            <div className="flex items-center gap-1.5 text-xs text-gray-500">
              <span className="h-2 w-2 rounded-full bg-[#76BC21]" />
              Has appointments
            </div>
            <div className="flex items-center gap-1.5 text-xs text-gray-500">
              <span className="h-2 w-2 rounded-full bg-[#1E2B7A]" />
              Selected
            </div>
            <div className="flex items-center gap-1.5 text-xs text-gray-500">
              <span className="h-2 w-2 rounded-full bg-gray-300 dark:bg-gray-600" />
              Off day
            </div>
          </div>
        </div>

        {/* Right panel */}
        <div className="lg:col-span-2 space-y-4">
          {/* Selected day appointments */}
          <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-5">
            <div className="mb-4 flex items-center gap-2">
              <CalendarDays className="h-4 w-4 text-[#1E2B7A] dark:text-blue-400" />
              <h3 className="font-semibold text-gray-900 dark:text-gray-100 text-sm">{selectedDate}</h3>
              {aptsForDate.length > 0 && (
                <Badge variant="info" className="ml-auto">{aptsForDate.length}</Badge>
              )}
            </div>
            {aptsForDate.length === 0 ? (
              <p className="text-sm text-center text-gray-400 py-6">No appointments on this day</p>
            ) : (
              <div className="space-y-2">
                {aptsForDate.map((apt) => (
                  <div
                    key={apt.id}
                    className="flex items-start gap-3 rounded-xl border border-gray-100 dark:border-gray-800 px-3 py-2.5 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                  >
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#1E2B7A]/10 dark:bg-[#1E2B7A]/20">
                      <span className="text-xs font-semibold text-[#1E2B7A] dark:text-blue-400">
                        {apt.patientName.charAt(0)}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">{apt.patientName}</p>
                      <p className="text-xs text-gray-400">{apt.reason}</p>
                    </div>
                    <div className="shrink-0 text-right">
                      <p className="text-xs font-semibold text-gray-700 dark:text-gray-300">{apt.time}</p>
                      <Badge
                        variant={apt.status === "confirmed" ? "success" : apt.status === "pending" ? "warning" : "default"}
                        className="mt-0.5"
                      >
                        {apt.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Time slot availability */}
          <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-5">
            <div className="mb-4 flex items-center gap-2">
              <Clock className="h-4 w-4 text-[#76BC21]" />
              <h3 className="font-semibold text-gray-900 dark:text-gray-100 text-sm">Time Slots</h3>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {TIME_SLOTS.map((slot) => {
                const booked = aptsForDate.some((a) => a.time === slot);
                return (
                  <div
                    key={slot}
                    className={[
                      "flex items-center justify-between rounded-lg border px-3 py-2 text-xs transition-colors",
                      booked
                        ? "border-[#1E2B7A]/30 bg-[#1E2B7A]/5 dark:bg-[#1E2B7A]/10"
                        : "border-gray-100 dark:border-gray-800 text-gray-400",
                    ].join(" ")}
                  >
                    <span className={booked ? "font-medium text-[#1E2B7A] dark:text-blue-400" : ""}>{slot}</span>
                    <span
                      className={[
                        "h-2 w-2 rounded-full",
                        booked ? "bg-[#1E2B7A]" : "bg-gray-200 dark:bg-gray-700",
                      ].join(" ")}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
