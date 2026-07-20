"use client";
import { useState, useMemo } from "react";
import { BarChart3 } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { SearchFilter, SelectFilter } from "@/components/ui/SearchFilter";
import { DataTable, Column } from "@/components/ui/DataTable";
import { Badge } from "@/components/ui/Badge";
import { useReports, useDeleteReport } from "@/lib/hooks/useReports";
import { createActionColumn } from "@/components/ui/ActionButtons";
import type { UnifiedReport } from "@/lib/services/api";
import toast from "react-hot-toast";

const statusVariant: Record<string, "warning" | "info" | "success"> = {
  pending: "warning", "in-progress": "info", completed: "success",
};

export default function ReportsPage() {
  const { data = [], isLoading } = useReports();
  const deleteMutation = useDeleteReport();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const unified = data as UnifiedReport[];

  const filtered = unified.filter((r) => {
    const ms = !search || r.patientName.toLowerCase().includes(search.toLowerCase()) || r.testName.toLowerCase().includes(search.toLowerCase());
    const mst = !statusFilter || r.status === statusFilter;
    return ms && mst;
  }) as unknown as Record<string, unknown>[];

  const handleDelete = (row: Record<string, unknown>) => {
    const reportId = row._id as string;
    deleteMutation.mutate(reportId, {
      onSuccess: () => toast.success("Report deleted"),
      onError: () => toast.error("Failed to delete report"),
    });
  };

  const columns: Column<Record<string, unknown>>[] = useMemo(() => [
    { key: "_id", header: "Report ID", cell: (r) => <span className="font-mono text-xs text-gray-500">{(r._id as string)?.slice(-6)}</span> },
    {
      key: "patientName", header: "Patient",
      cell: (r) => <div><p className="font-medium text-gray-900 dark:text-gray-100">{r.patientName as string}</p><p className="text-xs text-gray-400">{r.patientId as string}</p></div>,
    },
    {
      key: "testName", header: "Test",
      cell: (r) => <div><p className="font-medium text-gray-900 dark:text-gray-100">{r.testName as string}</p><p className="text-xs text-gray-400">{r.reportType as string}</p></div>,
    },
    { key: "requestingDoctor", header: "Requested By", cell: (r) => <span>{(r.requestingDoctor as string) || "—"}</span> },
    { key: "createdAt", header: "Request Date", cell: (r) => <span className="text-sm text-gray-500">{(r.createdAt as string)?.split("T")[0] || "—"}</span> },
    { key: "completedDate", header: "Completed", cell: (r) => <span className="text-sm text-gray-500 dark:text-gray-400">{(r.completedDate as string)?.split("T")[0] || "—"}</span> },
    {
      key: "status", header: "Status",
      cell: (r) => <Badge variant={statusVariant[r.status as string] ?? "default"}>{r.status as string}</Badge>,
    },
    createActionColumn({ basePath: "/super-admin/reports", idKey: "_id", onDelete: handleDelete }),
  ], [handleDelete]);

  return (
    <div className="space-y-6">
      <PageHeader title="Lab Reports" description={`${unified.length} reports`} icon={BarChart3} />
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Pending", value: unified.filter((r) => r.status === "pending").length, color: "text-amber-500" },
          { label: "In Progress", value: unified.filter((r) => r.status === "in-progress").length, color: "text-blue-500" },
          { label: "Completed", value: unified.filter((r) => r.status === "completed").length, color: "text-green-600 dark:text-green-400" },
        ].map((s) => (
          <div key={s.label} className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-4 text-center">
            <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
            <p className="text-xs text-gray-400 mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>
      <div className="flex flex-col sm:flex-row gap-3">
        <SearchFilter value={search} onChange={setSearch} placeholder="Search patient or test..." className="flex-1" />
        <SelectFilter value={statusFilter} onChange={setStatusFilter}
          options={[{ label: "Pending", value: "pending" }, { label: "In Progress", value: "in-progress" }, { label: "Completed", value: "completed" }]}
          placeholder="All Status" />
      </div>
      <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-4">
        <DataTable data={filtered} columns={columns} isLoading={isLoading} pageSize={8} emptyTitle="No reports found" />
      </div>
    </div>
  );
}
