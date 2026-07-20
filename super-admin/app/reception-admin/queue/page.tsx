"use client";
import { useState, useMemo, useCallback } from "react";
import { Clock, CheckCircle2, XCircle, UserCheck, Search, AlertCircle, RefreshCw } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { PageHeader } from "@/components/ui/PageHeader";
import { Badge } from "@/components/ui/Badge";
import { SearchFilter } from "@/components/ui/SearchFilter";
import { getReceptionAppointments, updateAppointmentStatus, ApiError, formatApiError } from "@/lib/services/api";
import toast from "react-hot-toast";

// ── Types ─────────────────────────────────────────────────────────────────────

interface QueueAppointment {
  _id: string;
  appointmentId: string;
  patientName: string;
  patientPhone: string;
  patientAge?: number;
  patientGender?: string;
  doctorName: string;
  doctorDept: string;
  department?: string;
  date: string;
  time: string;
  type: string;
  status: string;
  reason?: string;
}

// ── Status config ─────────────────────────────────────────────────────────────

const STATUS_CONFIG: Record<string, { label: string; variant: "success" | "warning" | "info" | "danger" | "default"; sortOrder: number }> = {
  pending:       { label: "Pending",       variant: "warning", sortOrder: 0 },
  confirmed:     { label: "Confirmed",     variant: "success", sortOrder: 1 },
  "checked-in":  { label: "Checked In",    variant: "info",    sortOrder: 2 },
};

// ── Helpers ───────────────────────────────────────────────────────────────────

function getBilingual(obj: unknown, fallback = ""): string {
  if (!obj) return fallback;
  const o = obj as Record<string, unknown>;
  if (typeof o.en === "string") return o.en;
  if (typeof o.bn === "string") return o.bn;
  return fallback;
}

function transformAppointment(raw: Record<string, unknown>): QueueAppointment {
  const doctor = raw.doctor as Record<string, unknown> | undefined;
  return {
    _id: (raw._id as string) || "",
    appointmentId: (raw.appointmentId as string) || "",
    patientName: (raw.patientName as string) || "Unknown",
    patientPhone: (raw.patientPhone as string) || "",
    patientAge: raw.patientAge as number | undefined,
    patientGender: raw.patientGender as string | undefined,
    doctorName: doctor ? getBilingual(doctor.name, "Doctor") : "N/A",
    doctorDept: doctor ? getBilingual(doctor.department, "") : "",
    department: (raw.department as string) || "",
    date: (raw.date as string) || "",
    time: (raw.time as string) || "",
    type: (raw.type as string) || "",
    status: (raw.status as string) || "",
    reason: (raw.reason as string) || "",
  };
}

function formatTimeDisplay(time: string): string {
  if (!time) return "—";
  const [h, m] = time.split(":");
  if (!h) return time;
  const hour = parseInt(h, 10);
  const ampm = hour >= 12 ? "PM" : "AM";
  const h12 = hour % 12 || 12;
  return `${h12}:${m || "00"} ${ampm}`;
}

// ── Confirm dialog ────────────────────────────────────────────────────────────

function ConfirmDialog({ title, message, onConfirm, onCancel }: { title: string; message: string; onConfirm: () => void; onCancel: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onCancel}>
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
      <div className="relative w-full max-w-sm bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 p-6 space-y-4" onClick={(e) => e.stopPropagation()}>
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30 mx-auto">
          <AlertCircle className="h-5 w-5 text-red-500" />
        </div>
        <div className="text-center">
          <h3 className="font-bold text-gray-900 dark:text-gray-100 mb-1">{title}</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">{message}</p>
        </div>
        <div className="flex gap-2">
          <button onClick={onCancel} className="flex-1 px-4 py-2.5 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 rounded-xl text-sm font-medium hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">Cancel</button>
          <button onClick={onConfirm} className="flex-1 px-4 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-xl text-sm font-medium transition-colors">Confirm</button>
        </div>
      </div>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────

export default function QueuePage() {
  const qc = useQueryClient();
  const [search, setSearch] = useState("");
  const [confirmAction, setConfirmAction] = useState<{ apt: QueueAppointment; status: string } | null>(null);
  const today = new Date().toISOString().split("T")[0];

  // ── Fetch real data ──────────────────────────────────────────────────────────
  const { data: rawData = [], isLoading, isError, error, refetch } = useQuery({
    queryKey: ["reception-queue", today],
    queryFn: async () => {
      const res = await getReceptionAppointments({ date: today, limit: "100" });
      return ((res as { data: unknown[] }).data ?? []) as Record<string, unknown>[];
    },
    refetchInterval: 30000,
    staleTime: 10000,
  });

  // ── Status update mutation ───────────────────────────────────────────────────
  const statusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) => updateAppointmentStatus(id, status),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["reception-queue"] });
    },
    onError: (err: Error) => {
      const msg = err instanceof ApiError ? formatApiError(err) : "Failed to update status";
      toast.error(msg);
    },
  });

  const handleStatusUpdate = useCallback((apt: QueueAppointment, newStatus: string) => {
    if (newStatus === "cancelled" || newStatus === "no-show") {
      setConfirmAction({ apt, status: newStatus });
      return;
    }
    statusMutation.mutate(
      { id: apt._id, status: newStatus },
      { onSuccess: () => toast.success(`Appointment marked as ${newStatus}`) }
    );
  }, [statusMutation]);

  const handleConfirmedAction = useCallback(() => {
    if (!confirmAction) return;
    const { apt, status: s } = confirmAction;
    statusMutation.mutate(
      { id: apt._id, status: s },
      {
        onSuccess: () => toast.success(`Appointment marked as ${s}`),
        onSettled: () => setConfirmAction(null),
      }
    );
  }, [confirmAction, statusMutation]);

  // ── Transform + filter ──────────────────────────────────────────────────────
  const ACTIVE_STATUSES = new Set(["pending", "confirmed", "checked-in"]);

  const appointments = useMemo(() => {
    return rawData
      .filter((a) => ACTIVE_STATUSES.has(a.status as string))
      .map(transformAppointment)
      .filter((a) => {
        if (!search) return true;
        const q = search.toLowerCase();
        return a.patientName.toLowerCase().includes(q) || a.doctorName.toLowerCase().includes(q);
      })
      .sort((a, b) => {
        const orderDiff = (STATUS_CONFIG[a.status]?.sortOrder ?? 99) - (STATUS_CONFIG[b.status]?.sortOrder ?? 99);
        if (orderDiff !== 0) return orderDiff;
        return (a.time || "").localeCompare(b.time || "");
      });
  }, [rawData, search]);

  const confirmedCount = rawData.filter((a) => a.status === "confirmed").length;
  const pendingCount = rawData.filter((a) => a.status === "pending").length;
  const checkedInCount = rawData.filter((a) => a.status === "checked-in").length;

  // ── Render helpers ──────────────────────────────────────────────────────────

  function renderActions(apt: QueueAppointment) {
    const busy = statusMutation.isPending && statusMutation.variables?.id === apt._id;

    switch (apt.status) {
      case "pending":
        return (
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => handleStatusUpdate(apt, "confirmed")}
              disabled={busy}
              title="Confirm"
              className="flex h-9 w-9 items-center justify-center rounded-xl bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 hover:bg-green-200 dark:hover:bg-green-900/50 disabled:opacity-40 transition-colors"
            ><CheckCircle2 className="h-4 w-4" /></button>
            <button
              onClick={() => handleStatusUpdate(apt, "cancelled")}
              disabled={busy}
              title="Cancel"
              className="flex h-9 w-9 items-center justify-center rounded-xl bg-red-100 dark:bg-red-900/30 text-red-500 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-900/50 disabled:opacity-40 transition-colors"
            ><XCircle className="h-4 w-4" /></button>
          </div>
        );
      case "confirmed":
        return (
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => handleStatusUpdate(apt, "checked-in")}
              disabled={busy}
              title="Check In"
              className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 hover:bg-blue-200 dark:hover:bg-blue-900/50 disabled:opacity-40 transition-colors"
            ><UserCheck className="h-4 w-4" /></button>
            <button
              onClick={() => handleStatusUpdate(apt, "cancelled")}
              disabled={busy}
              title="Cancel"
              className="flex h-9 w-9 items-center justify-center rounded-xl bg-red-100 dark:bg-red-900/30 text-red-500 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-900/50 disabled:opacity-40 transition-colors"
            ><XCircle className="h-4 w-4" /></button>
          </div>
        );
      case "checked-in":
        return (
          <button
            onClick={() => handleStatusUpdate(apt, "completed")}
            disabled={busy}
            title="Mark Completed"
            className="flex h-9 w-9 items-center justify-center rounded-xl bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 hover:bg-green-200 dark:hover:bg-green-900/50 disabled:opacity-40 transition-colors"
          ><CheckCircle2 className="h-4 w-4" /></button>
        );
      default:
        return null;
    }
  }

  function renderContent() {
    if (isLoading) {
      return Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="h-20 animate-pulse bg-gray-100 dark:bg-gray-800 m-2 rounded-xl" />
      ));
    }

    if (isError) {
      return (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30 mb-4">
            <AlertCircle className="h-6 w-6 text-red-500" />
          </div>
          <p className="text-base font-semibold text-gray-700 dark:text-gray-300">Failed to load queue</p>
          <p className="text-sm text-gray-400 mt-1 mb-4 max-w-sm">{(error as Error)?.message || "An unexpected error occurred."}</p>
          <button onClick={() => refetch()} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#1E2B7A] text-white text-sm font-medium hover:bg-[#76BC21] transition-colors">
            <RefreshCw className="h-4 w-4" />Retry
          </button>
        </div>
      );
    }

    if (appointments.length === 0) {
      if (search) {
        return (
          <div className="p-10 text-center text-gray-400 dark:text-gray-500">
            <Search className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p>No patients match your search</p>
          </div>
        );
      }
      return (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800 mb-4">
            <Clock className="h-6 w-6 text-gray-400" />
          </div>
          <p className="text-base font-semibold text-gray-700 dark:text-gray-300">Queue is empty</p>
          <p className="text-sm text-gray-400 mt-1 max-w-sm">No patients waiting today. New appointments will appear here automatically.</p>
        </div>
      );
    }

    return appointments.map((apt, idx) => (
      <div key={apt._id} className="flex items-center gap-4 px-5 py-4 hover:bg-gray-50 dark:hover:bg-gray-800/40 transition-colors">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#1E2B7A] text-white font-bold text-sm">{idx + 1}</div>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-gray-900 dark:text-gray-100">{apt.patientName}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">{apt.doctorName} · {apt.doctorDept || apt.department}</p>
        </div>
        <div className="text-right shrink-0">
          <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{formatTimeDisplay(apt.time)}</p>
          <Badge variant={STATUS_CONFIG[apt.status]?.variant ?? "default"} className="mt-0.5">{STATUS_CONFIG[apt.status]?.label ?? apt.status}</Badge>
        </div>
        {renderActions(apt)}
      </div>
    ));
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Patient Queue" description={`${appointments.length} patients waiting`} icon={Clock} />

      <div className="grid grid-cols-4 gap-3">
        {[
          { label: "Total in Queue", value: appointments.length, color: "text-[#1E2B7A] dark:text-blue-400" },
          { label: "Confirmed", value: confirmedCount, color: "text-green-600 dark:text-green-400" },
          { label: "Pending", value: pendingCount, color: "text-amber-600 dark:text-amber-400" },
          { label: "Checked In", value: checkedInCount, color: "text-blue-600 dark:text-blue-400" },
        ].map((s) => (
          <div key={s.label} className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-4 text-center">
            <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
            <p className="text-xs text-gray-400 mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      <SearchFilter
        value={search}
        onChange={setSearch}
        placeholder="Search by patient or doctor name..."
        className="max-w-lg"
      />

      <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 divide-y divide-gray-100 dark:divide-gray-800 overflow-hidden">
        {renderContent()}
      </div>

      {confirmAction && (
        <ConfirmDialog
          title={`Mark as ${confirmAction.status === "cancelled" ? "Cancelled" : "No-Show"}`}
          message={`Are you sure you want to mark ${confirmAction.apt.patientName}'s appointment as ${confirmAction.status === "cancelled" ? "cancelled" : "no-show"}?`}
          onConfirm={handleConfirmedAction}
          onCancel={() => setConfirmAction(null)}
        />
      )}
    </div>
  );
}
