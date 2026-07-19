"use client";

import { useState, useMemo } from "react";
import { CalendarDays, Plus } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { SearchFilter, SelectFilter } from "@/components/ui/SearchFilter";
import { DataTable, Column } from "@/components/ui/DataTable";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { useCmsAppointments, useDeleteCmsAppointment } from "@/lib/hooks/useCmsAppointments";
import { createActionColumn } from "@/components/ui/ActionButtons";
import Link from "next/link";
import toast from "react-hot-toast";

const statusVariant: Record<string, "success" | "warning" | "default" | "danger" | "info"> = {
  confirmed: "success", pending: "warning", rejected: "danger", completed: "default", cancelled: "danger", "no-show": "danger",
  "checked-in": "info", "in-consultation": "info",
};

const typeVariant: Record<string, "info" | "default" | "success"> = {
  new: "info", "follow-up": "default", consultation: "success",
};

export default function AppointmentsPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [sourceFilter, setSourceFilter] = useState("");
  const [page, setPage] = useState(1);

  const params: Record<string, string> = { page: String(page), limit: "10" };
  if (statusFilter) params.status = statusFilter;
  if (sourceFilter) params.source = sourceFilter;
  if (search) params.search = search;

  const { data, isLoading } = useCmsAppointments(params);
  const deleteMutation = useDeleteCmsAppointment();

  const appointments = data?.data || [];
  const total = data?.total || 0;

  const counts = {
    confirmed: appointments.filter((a: any) => a.status === "confirmed").length,
    pending: appointments.filter((a: any) => a.status === "pending").length,
    rejected: appointments.filter((a: any) => a.status === "rejected").length,
    completed: appointments.filter((a: any) => a.status === "completed").length,
    cancelled: appointments.filter((a: any) => a.status === "cancelled").length,
  };

  const handleDelete = (row: Record<string, unknown>) => {
    deleteMutation.mutate(row._id as string, {
      onSuccess: () => toast.success("Appointment deleted"),
      onError: () => toast.error("Failed to delete appointment"),
    });
  };

  const columns: Column<Record<string, unknown>>[] = useMemo(() => [
    {
      key: "appointmentId", header: "Appt ID",
      cell: (r) => <span className="font-mono text-xs font-bold text-[#1E2B7A] dark:text-blue-400">{(r.appointmentId as string) || "—"}</span>,
    },
    {
      key: "_id", header: "ID",
      cell: (r) => <span className="font-mono text-xs text-gray-400">{(r._id as string)?.slice(-6)}</span>,
    },
    {
      key: "patientName", header: "Patient",
      cell: (r) => (
        <div>
          <p className="font-medium text-gray-900 dark:text-gray-100">{r.patientName as string}</p>
          <p className="text-xs text-gray-400">{r.patientAge as number}y · {r.patientGender as string}</p>
        </div>
      ),
    },
    {
      key: "doctor", header: "Doctor",
      cell: (r) => {
        const doc = r.doctor as Record<string, any> | undefined;
        return (
          <div>
            <p className="font-medium text-gray-900 dark:text-gray-100">{doc?.name?.en || "—"}</p>
            <p className="text-xs text-gray-400">{doc?.department?.en || r.department as string || "—"}</p>
          </div>
        );
      },
    },
    {
      key: "date", header: "Date & Time",
      cell: (r) => {
        const d = r.date as string;
        const formatted = d ? new Date(d).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" }) : "—";
        return <div><p className="font-medium">{formatted}</p><p className="text-xs text-gray-400">{r.time as string}</p></div>;
      },
    },
    {
      key: "type", header: "Type",
      cell: (r) => <Badge variant={typeVariant[r.type as string] || "info"}>{r.type as string}</Badge>,
    },
    {
      key: "status", header: "Status",
      cell: (r) => <Badge variant={statusVariant[r.status as string] || "default"}>{r.status as string}</Badge>,
    },
    {
      key: "appointmentSource", header: "Source",
      cell: (r) => <Badge variant="default">{(r.appointmentSource as string) || "—"}</Badge>,
    },
    createActionColumn({ basePath: "/super-admin/appointments", idKey: "_id", onDelete: handleDelete }),
  ], [handleDelete]);

  return (
    <div className="space-y-6">
      <PageHeader title="Appointments" description={`${total} total appointments`} icon={CalendarDays}>
        <Link href="/super-admin/appointments/add"><Button size="sm"><Plus className="h-4 w-4 mr-1.5" />New Appointment</Button></Link>
      </PageHeader>

      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {[
          { label: "Pending", value: counts.pending, color: "text-amber-600 dark:text-amber-400" },
          { label: "Confirmed", value: counts.confirmed, color: "text-green-600 dark:text-green-400" },
          { label: "Rejected", value: counts.rejected, color: "text-red-500 dark:text-red-400" },
          { label: "Completed", value: counts.completed, color: "text-blue-600 dark:text-blue-400" },
          { label: "Cancelled", value: counts.cancelled, color: "text-gray-500 dark:text-gray-400" },
        ].map((s) => (
          <div key={s.label} className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-4 text-center">
            <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
            <p className="text-xs text-gray-400 mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <SearchFilter value={search} onChange={setSearch} placeholder="Search patient or doctor..." className="flex-1" />
        <SelectFilter value={statusFilter} onChange={setStatusFilter}
          options={[
            { label: "Pending", value: "pending" },
            { label: "Confirmed", value: "confirmed" },
            { label: "Rejected", value: "rejected" },
            { label: "Completed", value: "completed" },
            { label: "Cancelled", value: "cancelled" },
            { label: "No Show", value: "no-show" },
            { label: "Checked In", value: "checked-in" },
            { label: "In Consultation", value: "in-consultation" },
          ]}
          placeholder="All Status"
        />
        <SelectFilter value={sourceFilter} onChange={setSourceFilter}
          options={[
            { label: "Online", value: "online" },
            { label: "Receptionist", value: "receptionist" },
            { label: "Super Admin", value: "super-admin" },
            { label: "Patient Portal", value: "patient-portal" },
          ]}
          placeholder="All Sources"
        />
      </div>

      <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-4">
        <DataTable
          data={appointments as unknown as Record<string, unknown>[]}
          columns={columns}
          isLoading={isLoading}
          pageSize={10}
          emptyTitle="No appointments found"
        />
      </div>
    </div>
  );
}
