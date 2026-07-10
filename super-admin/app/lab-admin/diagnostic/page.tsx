"use client";
import { useState } from "react";
import { FlaskConical, CheckCircle2, Clock, AlertCircle } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { SearchFilter, SelectFilter } from "@/components/ui/SearchFilter";
import { DataTable, Column } from "@/components/ui/DataTable";
import { Badge } from "@/components/ui/Badge";
import { StatsCard } from "@/components/ui/StatsCard";
import { StatsCardSkeleton } from "@/components/ui/Skeleton";
import { useReports } from "@/lib/hooks/useReports";
import type { Report } from "@/lib/services/api";
import { createActionColumn } from "@/components/ui/ActionButtons";

const statusVariant: Record<Report["status"], "warning" | "info" | "success"> = {
  pending: "warning",
  "in-progress": "info",
  completed: "success",
};

const columns: Column<Record<string, unknown>>[] = [
  {
    key: "id",
    header: "Record ID",
    cell: (r) => <span className="font-mono text-xs text-gray-400">{r.id as string}</span>,
  },
  {
    key: "patientName",
    header: "Patient",
    cell: (r) => (
      <div>
        <p className="font-medium text-gray-900 dark:text-gray-100">{r.patientName as string}</p>
        <p className="text-xs text-gray-400">{r.patientId as string}</p>
      </div>
    ),
  },
  {
    key: "testName",
    header: "Diagnostic Test",
    cell: (r) => (
      <div>
        <p className="font-medium text-gray-900 dark:text-gray-100">{r.testName as string}</p>
        <p className="text-xs text-gray-400">{r.reportType as string}</p>
      </div>
    ),
  },
  {
    key: "department",
    header: "Department",
    cell: (r) => <span className="text-sm text-gray-600 dark:text-gray-400">{r.department as string}</span>,
  },
  {
    key: "requestedBy",
    header: "Requested By",
    cell: (r) => <span className="text-sm text-gray-700 dark:text-gray-300">{r.requestedBy as string}</span>,
  },
  {
    key: "requestDate",
    header: "Requested",
    cell: (r) => <span className="text-sm text-gray-500">{r.requestDate as string}</span>,
  },
  {
    key: "completedDate",
    header: "Completed",
    cell: (r) => (
      <span className="text-sm text-gray-400">
        {(r.completedDate as string) || "—"}
      </span>
    ),
  },
  {
    key: "status",
    header: "Status",
    cell: (r) => {
      const s = r.status as Report["status"];
      return <Badge variant={statusVariant[s] ?? "default"}>{r.status as string}</Badge>;
    },
  },
  createActionColumn(),
];

export default function DiagnosticRecordsPage() {
  const { data = [], isLoading } = useReports();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");

  const pending = data.filter((r) => r.status === "pending").length;
  const inProgress = data.filter((r) => r.status === "in-progress").length;
  const completed = data.filter((r) => r.status === "completed").length;

  const reportTypes = [...new Set(data.map((r) => r.reportType))];

  const filtered = data.filter((r) => {
    const matchSearch =
      !search ||
      r.patientName.toLowerCase().includes(search.toLowerCase()) ||
      r.testName.toLowerCase().includes(search.toLowerCase()) ||
      r.patientId.toLowerCase().includes(search.toLowerCase());
    const matchStatus = !statusFilter || r.status === statusFilter;
    const matchType = !typeFilter || r.reportType === typeFilter;
    return matchSearch && matchStatus && matchType;
  }) as unknown as Record<string, unknown>[];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Diagnostic Records"
        description={`${data.length} total records in the laboratory`}
        icon={FlaskConical}
      />

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {isLoading ? (
          Array.from({ length: 3 }).map((_, i) => <StatsCardSkeleton key={i} />)
        ) : (
          <>
            <StatsCard title="Pending" value={pending} icon={Clock} color="amber" index={0} />
            <StatsCard title="In Progress" value={inProgress} icon={AlertCircle} color="blue" index={1} />
            <StatsCard title="Completed" value={completed} icon={CheckCircle2} color="green" index={2} />
          </>
        )}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <SearchFilter
          value={search}
          onChange={setSearch}
          placeholder="Search patient name, ID or test..."
          className="flex-1"
        />
        <SelectFilter
          value={statusFilter}
          onChange={setStatusFilter}
          options={[
            { label: "Pending", value: "pending" },
            { label: "In Progress", value: "in-progress" },
            { label: "Completed", value: "completed" },
          ]}
          placeholder="All Status"
        />
        <SelectFilter
          value={typeFilter}
          onChange={setTypeFilter}
          options={reportTypes.map((t) => ({ label: t, value: t }))}
          placeholder="All Types"
        />
      </div>

      {/* Table */}
      <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-4">
        <DataTable
          data={filtered}
          columns={columns}
          isLoading={isLoading}
          pageSize={10}
          emptyTitle="No diagnostic records found"
          emptyDescription="Try adjusting your search or filter criteria."
        />
      </div>
    </div>
  );
}
