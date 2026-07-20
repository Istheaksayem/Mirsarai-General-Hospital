"use client";
import { Loader } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import type { AvailableSlot } from "@/lib/services/api";

interface Props {
  date: string;
  slots: AvailableSlot[];
  isLoading: boolean;
  appointments: { time: string; patientName: string; status: string }[];
}

export function DayView({ date, slots, isLoading, appointments }: Props) {
  const bookedCount = slots.filter((s) => !s.available).length;
  const availableCount = slots.filter((s) => s.available).length;

  return (
    <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-5">
      <div className="mb-4">
        <h3 className="font-semibold text-gray-900 dark:text-gray-100 text-sm">
          {new Date(date + "T12:00:00").toLocaleDateString("en-US", {
            weekday: "long",
            month: "long",
            day: "numeric",
            year: "numeric",
          })}
        </h3>
        {!isLoading && slots.length > 0 && (
          <p className="text-xs text-gray-400 mt-0.5">
            {availableCount} available &middot; {bookedCount} booked
          </p>
        )}
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-8">
          <Loader className="animate-spin text-gray-400" size={20} />
        </div>
      ) : slots.length === 0 ? (
        <p className="text-sm text-center text-gray-400 py-6">No slots available on this day</p>
      ) : (
        <div className="grid grid-cols-2 gap-2">
          {slots.map((slot) => (
            <div
              key={slot.time}
              className={`flex items-center justify-between rounded-lg border px-3 py-2 text-xs transition-colors ${
                slot.available
                  ? "border-green-200 dark:border-green-800/40 text-green-700 dark:text-green-300"
                  : "border-gray-100 dark:border-gray-800 text-gray-400"
              }`}
            >
              <span className={slot.available ? "font-medium" : ""}>{slot.time}</span>
              <span
                className={`h-2 w-2 rounded-full ${
                  slot.available ? "bg-green-500" : "bg-gray-200 dark:bg-gray-700"
                }`}
              />
            </div>
          ))}
        </div>
      )}

      {appointments.length > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-800 space-y-2">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Appointments</p>
          {appointments.map((apt, i) => (
            <div key={i} className="flex items-center justify-between rounded-xl border border-gray-100 dark:border-gray-800 px-3 py-2">
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{apt.patientName}</p>
                <p className="text-xs text-gray-400">{apt.time}</p>
              </div>
              <Badge
                variant={apt.status === "confirmed" ? "success" : apt.status === "pending" ? "warning" : "default"}
                className="text-[10px]"
              >
                {apt.status}
              </Badge>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
