"use client";
import { useState } from "react";
import { CalendarDays, Eye } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { SearchFilter, SelectFilter } from "@/components/ui/SearchFilter";
import { DataTable, Column } from "@/components/ui/DataTable";
import { Badge } from "@/components/ui/Badge";
import { useDoctorAppointments } from "@/lib/hooks/useCmsAppointments";
import { useRouter } from "next/navigation";

const statusVariant: Record<string, "success" | "warning" | "default" | "danger" | "info"> = {
  confirmed: "success", pending: "warning", completed: "default", cancelled: "danger", "no-show": "danger",
  "checked-in": "info", "in-consultation": "info",
};

export default function DoctorAppointmentsPage() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const params: Record<string, string> = {};
  if (statusFilter) params.status = statusFilter;
  if (search) params.search = search;

  const { data, isLoading } = useDoctorAppointments(params);
  const appointments = data?.data || [];

  const columns: Column<Record<string, unknown>>[] = [
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
      key: "date", header: "Date & Time",
      cell: (r) => {
        const d = r.date as string;
        const formatted = d ? new Date(d).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" }) : "—";
        return <div><p className="font-medium">{formatted}</p><p className="text-xs text-gray-400">{r.time as string}</p></div>;
      },
    },
    { key: "type", header: "Type", cell: (r) => <Badge variant="info">{r.type as string}</Badge> },
    { key: "reason", header: "Reason", cell: (r) => <span className="text-sm text-gray-500 dark:text-gray-400">{r.reason as string}</span> },
    {
      key: "status", header: "Status",
      cell: (r) => <Badge variant={statusVariant[r.status as string] || "default"}>{r.status as string}</Badge>,
    },
    {
      key: "__actions__",
      header: "Actions",
      headerClassName: "text-right",
      className: "text-right",
      cell: (row) => {
        const id = row._id as string;
        return (
          <button
            onClick={() => router.push(`/doctor/appointments/${id}`)}
            title="View"
            className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors"
          >
            <Eye className="h-3.5 w-3.5" />
          </button>
        );
      },
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader title="My Appointments" description={`${appointments.length} appointments`} icon={CalendarDays} />
      <div className="flex flex-col sm:flex-row gap-3">
        <SearchFilter value={search} onChange={setSearch} placeholder="Search patient..." className="flex-1" />
        <SelectFilter value={statusFilter} onChange={setStatusFilter}
          options={[
            { label: "Confirmed", value: "confirmed" },
            { label: "Pending", value: "pending" },
            { label: "Completed", value: "completed" },
            { label: "Cancelled", value: "cancelled" },
            { label: "No Show", value: "no-show" },
            { label: "Checked In", value: "checked-in" },
            { label: "In Consultation", value: "in-consultation" },
          ]}
          placeholder="All Status" />
      </div>
      <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-4">
        <DataTable data={appointments as unknown as Record<string, unknown>[]} columns={columns} isLoading={isLoading} pageSize={8} emptyTitle="No appointments" />
      </div>
    </div>
  );
}
