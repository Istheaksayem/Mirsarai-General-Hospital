"use client";
import { useState } from "react";
import {
  CalendarDays, Plus, ChevronLeft, ChevronRight,
} from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { useQuery } from "@tanstack/react-query";
import {
  useDoctorSchedule,
  useAvailableSlots,
  useAddWeeklySlot,
  useUpdateWeeklySlot,
  useDeleteWeeklySlot,
  useAddException,
  useDeleteException,
} from "@/lib/hooks/useDoctorSchedule";
import { getDoctorAppointments } from "@/lib/services/api";
import { WeeklySlotList } from "@/components/schedule/WeeklySlotList";
import { WeeklySlotForm } from "@/components/schedule/WeeklySlotForm";
import { ExceptionList } from "@/components/schedule/ExceptionList";
import { ExceptionForm } from "@/components/schedule/ExceptionForm";
import { DayView } from "@/components/schedule/DayView";
import type { WeeklySlot } from "@/lib/services/api";

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

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
  const [selectedDate, setSelectedDate] = useState(
    toISODate(today.getFullYear(), today.getMonth(), today.getDate())
  );
  const [showSlotForm, setShowSlotForm] = useState(false);
  const [editingSlot, setEditingSlot] = useState<WeeklySlot | null>(null);
  const [showExceptionForm, setShowExceptionForm] = useState(false);

  const { data: scheduleRes, isLoading: scheduleLoading, isError: scheduleError } = useDoctorSchedule();
  const schedule = scheduleRes?.data;
  const weeklySlots = schedule?.weeklySlots ?? [];
  const exceptions = schedule?.exceptions ?? [];

  const { data: slotsRes, isLoading: slotsLoading } = useAvailableSlots(selectedDate);
  const availableSlots = slotsRes?.data?.slots ?? [];

  const { data: aptsRes } = useQuery({
    queryKey: ["doctor-appointments", selectedDate],
    queryFn: () => getDoctorAppointments({ dateFrom: selectedDate, dateTo: selectedDate, limit: "50" }),
    staleTime: 1000 * 30,
  });
  const appointmentsForDate = (aptsRes as any)?.data ?? [];

  const addSlotMutation = useAddWeeklySlot();
  const updateSlotMutation = useUpdateWeeklySlot();
  const deleteSlotMutation = useDeleteWeeklySlot();
  const addExceptionMutation = useAddException();
  const deleteExceptionMutation = useDeleteException();

  const daysInMonth = getDaysInMonth(viewYear, viewMonth);
  const firstDay = getFirstDayOfMonth(viewYear, viewMonth);
  const workingDays = new Set(weeklySlots.map((s) => s.dayOfWeek));

  function prevMonth() {
    if (viewMonth === 0) { setViewMonth(11); setViewYear((y) => y - 1); }
    else setViewMonth((m) => m - 1);
  }
  function nextMonth() {
    if (viewMonth === 11) { setViewMonth(0); setViewYear((y) => y + 1); }
    else setViewMonth((m) => m + 1);
  }

  function handleSaveSlot(data: Omit<WeeklySlot, "_id">) {
    if (editingSlot) {
      updateSlotMutation.mutate(
        { slotId: editingSlot._id!, data },
        { onSuccess: () => { setEditingSlot(null); setShowSlotForm(false); } }
      );
    } else {
      addSlotMutation.mutate(data, {
        onSuccess: () => setShowSlotForm(false),
      });
    }
  }

  function handleEditSlot(slot: WeeklySlot) {
    setEditingSlot(slot);
    setShowSlotForm(true);
  }

  function handleDeleteSlot(slotId: string) {
    if (confirm("Remove this time slot?")) {
      deleteSlotMutation.mutate(slotId);
    }
  }

  function handleSaveException(data: any) {
    addExceptionMutation.mutate(data, {
      onSuccess: () => setShowExceptionForm(false),
    });
  }

  const isSaving = addSlotMutation.isPending || updateSlotMutation.isPending;

  if (scheduleLoading) {
    return (
      <div className="space-y-6">
        <PageHeader title="My Schedule" description="Manage your weekly availability" icon={CalendarDays} />
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin h-8 w-8 border-2 border-[#1E2B7A] border-t-transparent rounded-full" />
        </div>
      </div>
    );
  }

  if (scheduleError) {
    return (
      <div className="space-y-6">
        <PageHeader title="My Schedule" description="Manage your weekly availability" icon={CalendarDays} />
        <div className="rounded-2xl border border-red-200 dark:border-red-800/40 bg-red-50 dark:bg-red-900/20 p-6 text-center">
          <p className="text-sm text-red-600 dark:text-red-400">Failed to load schedule. Please try again.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="My Schedule"
        description="Configure your weekly availability and manage exceptions"
        icon={CalendarDays}
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
        {/* Left column — weekly config */}
        <div className="lg:col-span-3 space-y-6">
          {/* Weekly slots */}
          <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900 dark:text-gray-100 text-sm">Weekly Time Slots</h3>
              <button
                onClick={() => { setEditingSlot(null); setShowSlotForm(true); }}
                className="flex items-center gap-1.5 rounded-xl bg-[#1E2B7A] px-3 py-1.5 text-xs font-bold text-white hover:bg-[#1a2368] transition"
              >
                <Plus className="h-3.5 w-3.5" /> Add Slot
              </button>
            </div>
            <WeeklySlotList slots={weeklySlots} onEdit={handleEditSlot} onDelete={handleDeleteSlot} />
          </div>

          {/* Exceptions */}
          <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900 dark:text-gray-100 text-sm">Exceptions</h3>
              <button
                onClick={() => setShowExceptionForm(true)}
                className="flex items-center gap-1.5 rounded-xl border border-gray-200 dark:border-gray-700 px-3 py-1.5 text-xs font-bold text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition"
              >
                <Plus className="h-3.5 w-3.5" /> Add Exception
              </button>
            </div>
            <ExceptionList
              exceptions={exceptions}
              onDelete={(id) => deleteExceptionMutation.mutate(id)}
            />
          </div>
        </div>

        {/* Right column — calendar + daily view */}
        <div className="lg:col-span-2 space-y-4">
          {/* Calendar */}
          <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-5">
            <div className="mb-4 flex items-center justify-between">
              <button onClick={prevMonth}
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 dark:border-gray-700 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                <ChevronLeft className="h-4 w-4" />
              </button>
              <h3 className="font-semibold text-gray-900 dark:text-gray-100 text-sm">
                {MONTHS[viewMonth]} {viewYear}
              </h3>
              <button onClick={nextMonth}
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 dark:border-gray-700 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>

            <div className="mb-2 grid grid-cols-7 gap-1">
              {DAYS.map((d) => (
                <div key={d} className="text-center text-[10px] font-semibold uppercase tracking-wider text-gray-400 py-1">
                  {d}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-1">
              {Array.from({ length: firstDay }).map((_, i) => (<div key={`e-${i}`} />))}
              {Array.from({ length: daysInMonth }).map((_, i) => {
                const day = i + 1;
                const dateStr = toISODate(viewYear, viewMonth, day);
                const isToday = day === today.getDate() && viewMonth === today.getMonth() && viewYear === today.getFullYear();
                const isSelected = dateStr === selectedDate;
                const dayOfWeek = new Date(viewYear, viewMonth, day).getDay();
                const isWorking = workingDays.has(dayOfWeek);
                const hasAppointments = Array.isArray(appointmentsForDate) && appointmentsForDate.some((a: any) => a.date === dateStr);

                return (
                  <button key={day} onClick={() => setSelectedDate(dateStr)}
                    className={`relative flex flex-col items-center justify-center rounded-xl p-1.5 text-xs transition-all aspect-square ${
                      isSelected
                        ? "bg-[#1E2B7A] text-white shadow-md"
                        : isToday
                        ? "border-2 border-[#1E2B7A] text-[#1E2B7A] dark:text-blue-400 font-semibold"
                        : isWorking
                        ? "hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300"
                        : "text-gray-300 dark:text-gray-600 cursor-not-allowed"
                    }`}
                    disabled={!isWorking}
                  >
                    <span>{day}</span>
                    {hasAppointments && (
                      <span className={`absolute bottom-1 h-1 w-1 rounded-full ${isSelected ? "bg-white" : "bg-[#76BC21]"}`} />
                    )}
                  </button>
                );
              })}
            </div>

            <div className="mt-3 flex flex-wrap items-center gap-3 pt-3 border-t border-gray-100 dark:border-gray-800">
              <div className="flex items-center gap-1.5 text-[10px] text-gray-500">
                <span className="h-2 w-2 rounded-full bg-[#76BC21]" /> Has appointments
              </div>
              <div className="flex items-center gap-1.5 text-[10px] text-gray-500">
                <span className="h-2 w-2 rounded-full bg-gray-300 dark:bg-gray-600" /> Off day
              </div>
            </div>
          </div>

          {/* Daily slots */}
          <DayView
            date={selectedDate}
            slots={availableSlots}
            isLoading={slotsLoading}
            appointments={Array.isArray(appointmentsForDate) ? appointmentsForDate.map((a: any) => ({
              time: a.time,
              patientName: a.patientName,
              status: a.status,
            })) : []}
          />
        </div>
      </div>

      {/* Modals */}
      {showSlotForm && (
        <WeeklySlotForm
          initial={editingSlot}
          onSave={handleSaveSlot}
          onCancel={() => { setShowSlotForm(false); setEditingSlot(null); }}
          saving={isSaving}
        />
      )}

      {showExceptionForm && (
        <ExceptionForm
          onSave={handleSaveException}
          onCancel={() => setShowExceptionForm(false)}
          saving={addExceptionMutation.isPending}
        />
      )}
    </div>
  );
}
