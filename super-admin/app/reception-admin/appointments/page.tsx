"use client";
import { useState } from "react";
import { CalendarDays, Plus } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { SearchFilter, SelectFilter } from "@/components/ui/SearchFilter";
import { DataTable, Column } from "@/components/ui/DataTable";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { useAppointments } from "@/lib/hooks/useAppointments";
import { createActionColumn } from "@/components/ui/ActionButtons";

const columns: Column<Record<string, unknown>>[] = [
  { key: "id", header: "ID", cell: (r) => <span className="font-mono text-xs text-gray-400">{r.id as string}</span> },
  {
    key: "patientName", header: "Patient",
    cell: (r) => <div><p className="font-medium text-gray-900 dark:text-gray-100">{r.patientName as string}</p><p className="text-xs text-gray-400">{r.patientAge as number}y · {r.patientGender as string}</p></div>,
  },
  {
    key: "doctorName", header: "Doctor",
    cell: (r) => <div><p className="font-medium text-gray-900 dark:text-gray-100">{r.doctorName as string}</p><p className="text-xs text-gray-400">{r.department as string}</p></div>,
  },
  { key: "date", header: "Date", cell: (r) => <div><p className="font-medium">{r.date as string}</p><p className="text-xs text-gray-400">{r.time as string}</p></div> },
  { key: "type", header: "Type", cell: (r) => <Badge variant="info">{r.type as string}</Badge> },
  { key: "status", header: "Status", cell: (r) => <Badge variant={r.status === "confirmed" ? "success" : r.status === "pending" ? "warning" : r.status === "cancelled" ? "danger" : "default"}>{r.status as string}</Badge> },
  createActionColumn(),
];

export default function ReceptionAppointmentsPage() {
  const { data = [], isLoading } = useAppointments();
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const filtered = data.filter((a) => {
    const ms = !search || a.patientName.toLowerCase().includes(search.toLowerCase()) || a.doctorName.toLowerCase().includes(search.toLowerCase());
    return ms && (!status || a.status === status);
  }) as unknown as Record<string, unknown>[];
  return (
    <div className="space-y-6">
      <PageHeader title="Appointments" description={`${data.length} total`} icon={CalendarDays}>
        <Button size="sm"><Plus className="h-4 w-4 mr-1.5" />New</Button>
      </PageHeader>
      <div className="flex flex-col sm:flex-row gap-3">
        <SearchFilter value={search} onChange={setSearch} placeholder="Search patient or doctor..." className="flex-1" />
        <SelectFilter value={status} onChange={setStatus}
          options={[{ label: "Confirmed", value: "confirmed" }, { label: "Pending", value: "pending" }, { label: "Completed", value: "completed" }, { label: "Cancelled", value: "cancelled" }]}
          placeholder="All Status" />
      </div>
      <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-4">
        <DataTable data={filtered} columns={columns} isLoading={isLoading} pageSize={8} emptyTitle="No appointments found" />
      </div>
    </div>
  );
}
