"use client";
import { useState } from "react";
import { CalendarDays, Plus } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { SearchFilter, SelectFilter } from "@/components/ui/SearchFilter";
import { DataTable, Column } from "@/components/ui/DataTable";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { createActionColumn } from "@/components/ui/ActionButtons";
import { useQuery } from "@tanstack/react-query";
import { getReceptionAppointments } from "@/lib/services/api";

const statusVariant: Record<string, "success" | "warning" | "default" | "danger" | "info"> = {
  confirmed: "success", pending: "warning", completed: "default", cancelled: "danger", "no-show": "danger",
  "checked-in": "info", "in-consultation": "info",
};

const columns: Column<Record<string, unknown>>[] = [
  {
    key: "appointmentId", header: "Appt ID",
    cell: (r) => <span className="font-mono text-xs font-bold text-[#1E2B7A] dark:text-blue-400">{(r.appointmentId as string) || "—"}</span>,
  },
  { key: "_id", header: "ID", cell: (r) => <span className="font-mono text-xs text-gray-400">{String(r._id).slice(-6)}</span> },
  {
    key: "patientName", header: "Patient",
    cell: (r) => {
      const name = r.patientName;
      const displayName = typeof name === "string" ? name : typeof name === "object" && name ? String((name as { en?: string; bn?: string }).en || (name as { en?: string; bn?: string }).bn || "") : String(name ?? "");
      const age = r.patientAge;
      const gender = typeof r.patientGender === "string" ? r.patientGender : String(r.patientGender ?? "");
      return <div><p className="font-medium text-gray-900 dark:text-gray-100">{displayName}</p><p className="text-xs text-gray-400">{String(age ?? "")}y · {gender}</p></div>;
    },
  },
  {
    key: "doctor", header: "Doctor",
    cell: (r) => {
      const doc = r.doctor as Record<string, unknown> | undefined;
      const docName = doc?.name ? ((doc.name as { en?: string; bn?: string }).en || (doc.name as { en?: string; bn?: string }).bn || "N/A") : "N/A";
      const dept = typeof doc?.department === "string" ? doc.department : typeof r.department === "string" ? r.department : "";
      return <div><p className="font-medium text-gray-900 dark:text-gray-100">{docName}</p><p className="text-xs text-gray-400">{dept}</p></div>;
    },
  },
  { key: "date", header: "Date", cell: (r) => <div><p className="font-medium">{new Date(String(r.date ?? "")).toLocaleDateString()}</p><p className="text-xs text-gray-400">{String(r.time ?? "")}</p></div> },
  { key: "type", header: "Type", cell: (r) => <Badge variant="info">{String(r.type ?? "")}</Badge> },
  {
    key: "status", header: "Status",
    cell: (r) => <Badge variant={statusVariant[String(r.status)] || "default"}>{String(r.status ?? "")}</Badge>,
  },
  {
    key: "appointmentSource", header: "Source",
    cell: (r) => <Badge variant="default">{(r.appointmentSource as string) || "—"}</Badge>,
  },
  createActionColumn(),
];

export default function ReceptionAppointmentsPage() {
  const { data: fetched, isLoading } = useQuery({
    queryKey: ["reception-appointments"],
    queryFn: async () => {
      const res = await getReceptionAppointments();
      return res.data;
    },
  });
  const data = fetched ?? [];
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const filtered = data.filter((a) => {
    const rawName = (a as Record<string, unknown>).patientName;
    const name = typeof rawName === "string" ? rawName : "";
    const doc = (a as Record<string, unknown>).doctor as Record<string, unknown> | undefined;
    const docNameObj = doc?.name as { en?: string; bn?: string } | undefined;
    const docName = docNameObj?.en || docNameObj?.bn || "";
    const ms = !search || name.toLowerCase().includes(search.toLowerCase()) || docName.toLowerCase().includes(search.toLowerCase());
    return ms && (!status || (a as Record<string, unknown>).status === status);
  }) as unknown as Record<string, unknown>[];
  return (
    <div className="space-y-6">
      <PageHeader title="Appointments" description={`${data.length} total`} icon={CalendarDays}>
        <Button size="sm"><Plus className="h-4 w-4 mr-1.5" />New</Button>
      </PageHeader>
      <div className="flex flex-col sm:flex-row gap-3">
        <SearchFilter value={search} onChange={setSearch} placeholder="Search patient or doctor..." className="flex-1" />
        <SelectFilter value={status} onChange={setStatus}
          options={[
            { label: "Confirmed", value: "confirmed" },
            { label: "Pending", value: "pending" },
            { label: "Completed", value: "completed" },
            { label: "Cancelled", value: "cancelled" },
            { label: "Checked In", value: "checked-in" },
            { label: "In Consultation", value: "in-consultation" },
          ]}
          placeholder="All Status" />
      </div>
      <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-4">
        <DataTable data={filtered} columns={columns} isLoading={isLoading} pageSize={8} emptyTitle="No appointments found" />
      </div>
    </div>
  );
}
