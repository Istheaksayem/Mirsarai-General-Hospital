"use client";

import { useState } from "react";
import { CalendarDays, Plus } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { SearchFilter, SelectFilter } from "@/components/ui/SearchFilter";
import { DataTable, Column } from "@/components/ui/DataTable";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { useAppointments } from "@/lib/hooks/useAppointments";
import { type Appointment } from "@/lib/services/api";

const statusVariant: Record<Appointment["status"], "success" | "warning" | "default" | "danger"> = {
  confirmed: "success", pending: "warning", completed: "default", cancelled: "danger",
};

const typeVariant: Record<Appointment["type"], "info" | "default" | "success"> = {
  new: "info", "follow-up": "default", consultation: "success",
};

const columns: Column<Record<string, unknown>>[] = [
  {
    key: "id", header: "ID",
    cell: (r) => <span className="font-mono text-xs text-gray-400">{r.id as string}</span>,
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
    key: "doctorName", header: "Doctor",
    cell: (r) => (
      <div>
        <p className="font-medium text-gray-900 dark:text-gray-100">{r.doctorName as string}</p>
        <p className="text-xs text-gray-400">{r.department as string}</p>
      </div>
    ),
  },
  {
    key: "date", header: "Date & Time",
    cell: (r) => <div><p className="font-medium">{r.date as string}</p><p className="text-xs text-gray-400">{r.time as string}</p></div>,
  },
  { key: "type", header: "Type", cell: (r) => <Badge variant={typeVariant[r.type as Appointment["type"]]}>{r.type as string}</Badge> },
  { key: "status", header: "Status", cell: (r) => <Badge variant={statusVariant[r.status as Appointment["status"]]}>{r.status as string}</Badge> },
];

export default function AppointmentsPage() {
  const { data = [], isLoading } = useAppointments();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const filtered = data.filter((a) => {
    const ms = !search || a.patientName.toLowerCase().includes(search.toLowerCase()) || a.doctorName.toLowerCase().includes(search.toLowerCase());
    const mst = !statusFilter || a.status === statusFilter;
    return ms && mst;
  }) as unknown as Record<string, unknown>[];

  const counts = {
    confirmed: data.filter(a => a.status === "confirmed").length,
    pending: data.filter(a => a.status === "pending").length,
    completed: data.filter(a => a.status === "completed").length,
    cancelled: data.filter(a => a.status === "cancelled").length,
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Appointments" description={`${data.length} total appointments`} icon={CalendarDays}>
        <Button size="sm"><Plus className="h-4 w-4 mr-1.5" />New Appointment</Button>
      </PageHeader>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Confirmed", value: counts.confirmed, color: "text-green-600 dark:text-green-400" },
          { label: "Pending", value: counts.pending, color: "text-amber-600 dark:text-amber-400" },
          { label: "Completed", value: counts.completed, color: "text-blue-600 dark:text-blue-400" },
          { label: "Cancelled", value: counts.cancelled, color: "text-red-500 dark:text-red-400" },
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
            { label: "Confirmed", value: "confirmed" },
            { label: "Pending", value: "pending" },
            { label: "Completed", value: "completed" },
            { label: "Cancelled", value: "cancelled" },
          ]}
          placeholder="All Status"
        />
      </div>

      <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-4">
        <DataTable data={filtered} columns={columns} isLoading={isLoading} pageSize={8} emptyTitle="No appointments found" />
      </div>
    </div>
  );
}
