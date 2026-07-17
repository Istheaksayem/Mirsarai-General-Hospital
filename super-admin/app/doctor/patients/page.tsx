"use client";
import { useState } from "react";
import { Users } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { SearchFilter } from "@/components/ui/SearchFilter";
import { DataTable, Column } from "@/components/ui/DataTable";
import { Badge } from "@/components/ui/Badge";
import { usePatients } from "@/lib/hooks/usePatients";
import { createActionColumn } from "@/components/ui/ActionButtons";

const columns: Column<Record<string, unknown>>[] = [
  { key: "id", header: "ID", cell: (r) => <span className="font-mono text-xs text-gray-400">{r.id as string}</span> },
  {
    key: "name", header: "Patient",
    cell: (r) => (
      <div className="flex items-center gap-2.5">
        <div className="h-8 w-8 shrink-0 rounded-full bg-[#1E2B7A]/10 flex items-center justify-center">
          <span className="text-xs font-semibold text-[#1E2B7A] dark:text-blue-400">{(r.name as string).charAt(0)}</span>
        </div>
        <div>
          <p className="font-medium text-gray-900 dark:text-gray-100">{r.name as string}</p>
          <p className="text-xs text-gray-400">{r.gender as string} · {r.age as number}y</p>
        </div>
      </div>
    ),
  },
  { key: "phone", header: "Phone" },
  { key: "diagnosis", header: "Diagnosis", cell: (r) => <span className="text-sm text-gray-500 dark:text-gray-400">{(r.diagnosis as string) || "—"}</span> },
  { key: "lastVisit", header: "Last Visit", cell: (r) => <span className="text-sm text-gray-400">{(r.lastVisit as string) || "—"}</span> },
  { key: "status", header: "Status", cell: (r) => <Badge variant={r.status === "active" ? "success" : r.status === "admitted" ? "info" : "warning"}>{r.status as string}</Badge> },
  createActionColumn(),
];

export default function DoctorPatientsPage() {
  const { data = [], isLoading } = usePatients();
  const [search, setSearch] = useState("");
  const filtered = data.filter((p) =>
    !search || p.name.toLowerCase().includes(search.toLowerCase()) || p.id.toLowerCase().includes(search.toLowerCase())
  ) as unknown as Record<string, unknown>[];
  return (
    <div className="space-y-6">
      <PageHeader title="Patient History" description={`${data.length} patients`} icon={Users} />
      <SearchFilter value={search} onChange={setSearch} placeholder="Search patient..." className="max-w-sm" />
      <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-4">
        <DataTable data={filtered} columns={columns} isLoading={isLoading} pageSize={8} emptyTitle="No patients found" />
      </div>
    </div>
  );
}
