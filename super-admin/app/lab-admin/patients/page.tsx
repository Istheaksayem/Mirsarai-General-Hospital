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
  { key: "id", header: "Patient ID", cell: (r) => <span className="font-mono text-xs text-gray-400">{r.id as string}</span> },
  { key: "name", header: "Name", cell: (r) => <p className="font-medium text-gray-900 dark:text-gray-100">{r.name as string}</p> },
  { key: "age", header: "Age", cell: (r) => `${r.age as number} yrs` },
  { key: "gender", header: "Gender" },
  { key: "phone", header: "Phone" },
  { key: "bloodGroup", header: "Blood Group" },
  { key: "status", header: "Status", cell: (r) => <Badge variant={r.status === "active" ? "success" : r.status === "admitted" ? "info" : "warning"}>{r.status as string}</Badge> },
  createActionColumn(),
];

export default function LabPatientSearchPage() {
  const { data = [], isLoading } = usePatients();
  const [search, setSearch] = useState("");
  const filtered = data.filter((p) =>
    !search || p.name.toLowerCase().includes(search.toLowerCase()) || p.id.toLowerCase().includes(search.toLowerCase()) || p.phone.includes(search)
  ) as unknown as Record<string, unknown>[];
  return (
    <div className="space-y-6">
      <PageHeader title="Patient Search" description="Search patients for lab test lookup" icon={Users} />
      <SearchFilter value={search} onChange={setSearch} placeholder="Search by name, ID or phone..." className="max-w-lg" />
      <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-4">
        <DataTable data={filtered} columns={columns} isLoading={isLoading} pageSize={8} emptyTitle="No patients found" emptyDescription="Try a different search term." />
      </div>
    </div>
  );
}
