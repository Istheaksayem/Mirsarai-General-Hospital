"use client";
import { useState } from "react";
import { FileText } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { SearchFilter } from "@/components/ui/SearchFilter";
import { DataTable, Column } from "@/components/ui/DataTable";
import { Badge } from "@/components/ui/Badge";
import { useReports } from "@/lib/hooks/useReports";
import { createActionColumn } from "@/components/ui/ActionButtons";
import type { UnifiedReport } from "@/lib/services/api";

const sv = { pending: "warning", "in-progress": "info", completed: "success" } as const;

const columns: Column<Record<string, unknown>>[] = [
  { key: "_id", header: "ID", cell: (r) => <span className="font-mono text-xs text-gray-400">{(r._id as string)?.slice(-6)}</span> },
  {
    key: "patientName", header: "Patient",
    cell: (r) => (
      <div>
        <p className="font-medium text-gray-900 dark:text-gray-100">{r.patientName as string}</p>
        <p className="text-xs text-gray-400">{r.patientId as string}</p>
      </div>
    ),
  },
  {
    key: "testName", header: "Test",
    cell: (r) => (
      <div>
        <p className="font-medium text-gray-900 dark:text-gray-100">{r.testName as string}</p>
        <p className="text-xs text-gray-400">{r.reportType as string}</p>
      </div>
    ),
  },
  { key: "createdAt", header: "Date", cell: (r) => <span className="text-sm text-gray-500">{(r.createdAt as string)?.split("T")[0]}</span> },
  { key: "completedDate", header: "Completed", cell: (r) => <span className="text-gray-400">{(r.completedDate as string)?.split("T")[0] || "—"}</span> },
  {
    key: "status", header: "Status",
    cell: (r) => {
      const s = r.status as keyof typeof sv;
      return <Badge variant={sv[s] ?? "default"}>{r.status as string}</Badge>;
    },
  },
  createActionColumn(),
];

export default function DoctorReportsPage() {
  const { data = [], isLoading } = useReports();
  const [search, setSearch] = useState("");
  const unified = data as UnifiedReport[];
  const filtered = unified.filter((r) =>
    !search || r.patientName.toLowerCase().includes(search.toLowerCase()) || r.testName.toLowerCase().includes(search.toLowerCase())
  ) as unknown as Record<string, unknown>[];
  return (
    <div className="space-y-6">
      <PageHeader title="Medical Reports" description={`${unified.length} reports`} icon={FileText} />
      <SearchFilter value={search} onChange={setSearch} placeholder="Search patient or test..." className="max-w-sm" />
      <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-4">
        <DataTable data={filtered} columns={columns} isLoading={isLoading} pageSize={8} emptyTitle="No reports found" />
      </div>
    </div>
  );
}
