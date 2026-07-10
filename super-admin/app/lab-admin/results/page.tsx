"use client";
import { useState } from "react";
import { FileText } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { SearchFilter, SelectFilter } from "@/components/ui/SearchFilter";
import { DataTable, Column } from "@/components/ui/DataTable";
import { Badge } from "@/components/ui/Badge";
import { useReports } from "@/lib/hooks/useReports";
import { createActionColumn } from "@/components/ui/ActionButtons";

const statusVariant = { pending: "warning", "in-progress": "info", completed: "success" } as const;

const columns: Column<Record<string, unknown>>[] = [
  { key: "id", header: "ID", cell: (r) => <span className="font-mono text-xs text-gray-400">{r.id as string}</span> },
  { key: "patientName", header: "Patient", cell: (r) => <div><p className="font-medium text-gray-900 dark:text-gray-100">{r.patientName as string}</p><p className="text-xs text-gray-400">{r.patientId as string}</p></div> },
  { key: "testName", header: "Test", cell: (r) => <div><p className="font-medium text-gray-900 dark:text-gray-100">{r.testName as string}</p><p className="text-xs text-gray-400">{r.reportType as string}</p></div> },
  { key: "requestedBy", header: "Requested By" },
  { key: "requestDate", header: "Date" },
  { key: "completedDate", header: "Completed", cell: (r) => <span className="text-gray-400">{(r.completedDate as string) || "—"}</span> },
  { key: "status", header: "Status", cell: (r) => { const s = r.status as keyof typeof statusVariant; return <Badge variant={statusVariant[s] ?? "default"}>{r.status as string}</Badge>; } },
  createActionColumn(),
];

export default function LabResultsPage() {
  const { data = [], isLoading } = useReports();
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const filtered = data.filter((r) => {
    const ms = !search || r.patientName.toLowerCase().includes(search.toLowerCase()) || r.testName.toLowerCase().includes(search.toLowerCase());
    return ms && (!status || r.status === status);
  }) as unknown as Record<string, unknown>[];
  return (
    <div className="space-y-6">
      <PageHeader title="Test Results" description={`${data.length} reports`} icon={FileText} />
      <div className="flex flex-col sm:flex-row gap-3">
        <SearchFilter value={search} onChange={setSearch} placeholder="Search patient or test..." className="flex-1" />
        <SelectFilter value={status} onChange={setStatus}
          options={[{ label: "Pending", value: "pending" }, { label: "In Progress", value: "in-progress" }, { label: "Completed", value: "completed" }]}
          placeholder="All Status" />
      </div>
      <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-4">
        <DataTable data={filtered} columns={columns} isLoading={isLoading} pageSize={8} emptyTitle="No results found" />
      </div>
    </div>
  );
}
