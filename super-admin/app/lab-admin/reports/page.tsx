"use client";
import { useState } from "react";
import { BarChart3, FileText, CheckCircle2, Clock, AlertCircle, TrendingUp, Download } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { SearchFilter, SelectFilter } from "@/components/ui/SearchFilter";
import { DataTable, Column } from "@/components/ui/DataTable";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { StatsCard } from "@/components/ui/StatsCard";
import { StatsCardSkeleton } from "@/components/ui/Skeleton";
import { useReports } from "@/lib/hooks/useReports";
import type { Report } from "@/lib/services/api";

const statusVariant: Record<Report["status"], "warning" | "info" | "success"> = {
  pending: "warning",
  "in-progress": "info",
  completed: "success",
};

const columns: Column<Record<string, unknown>>[] = [
  {
    key: "id",
    header: "Report ID",
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
    header: "Test / Report",
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
    header: "Request Date",
    cell: (r) => <span className="text-sm text-gray-500">{r.requestDate as string}</span>,
  },
  {
    key: "completedDate",
    header: "Completed",
    cell: (r) => (
      <span className="text-sm text-gray-400">{(r.completedDate as string) || "—"}</span>
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
];

export default function LabReportsPage() {
  const { data = [], isLoading } = useReports();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");

  const pending = data.filter((r) => r.status === "pending").length;
  const inProgress = data.filter((r) => r.status === "in-progress").length;
  const completed = data.filter((r) => r.status === "completed").length;
  const completionRate = data.length > 0 ? Math.round((completed / data.length) * 100) : 0;

  const reportTypes = [...new Set(data.map((r) => r.reportType))];
  const departments = [...new Set(data.map((r) => r.department))];

  const filtered = data.filter((r) => {
    const matchSearch =
      !search ||
      r.patientName.toLowerCase().includes(search.toLowerCase()) ||
      r.testName.toLowerCase().includes(search.toLowerCase()) ||
      r.id.toLowerCase().includes(search.toLowerCase());
    const matchStatus = !statusFilter || r.status === statusFilter;
    const matchType = !typeFilter || r.reportType === typeFilter;
    return matchSearch && matchStatus && matchType;
  }) as unknown as Record<string, unknown>[];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Lab Reports"
        description={`${data.length} total reports · ${completionRate}% completion rate`}
        icon={BarChart3}
      >
        <Button size="sm" variant="outline">
          <Download className="h-4 w-4 mr-1.5" />Export
        </Button>
      </PageHeader>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {isLoading ? (
          Array.from({ length: 4 }).map((_, i) => <StatsCardSkeleton key={i} />)
        ) : (
          <>
            <StatsCard title="Total Reports" value={data.length} icon={FileText} color="purple" index={0} />
            <StatsCard title="Pending" value={pending} icon={Clock} color="amber" index={1} />
            <StatsCard title="In Progress" value={inProgress} icon={AlertCircle} color="blue" index={2} />
            <StatsCard title="Completed" value={completed} icon={CheckCircle2} color="green" trend={{ value: completionRate, label: "completion rate" }} index={3} />
          </>
        )}
      </div>

      {/* Department breakdown */}
      {!isLoading && departments.length > 0 && (
        <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-5">
          <div className="mb-4 flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-[#76BC21]" />
            <h3 className="font-semibold text-gray-900 dark:text-gray-100 text-sm">Reports by Department</h3>
          </div>
          <div className="space-y-3">
            {departments.map((dept) => {
              const count = data.filter((r) => r.department === dept).length;
              const pct = Math.round((count / data.length) * 100);
              const deptCompleted = data.filter((r) => r.department === dept && r.status === "completed").length;
              return (
                <div key={dept}>
                  <div className="mb-1 flex items-center justify-between">
                    <span className="text-sm text-gray-700 dark:text-gray-300">{dept}</span>
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-gray-400">{deptCompleted}/{count} done</span>
                      <span className="text-xs font-medium text-gray-500 dark:text-gray-400 w-8 text-right">{pct}%</span>
                    </div>
                  </div>
                  <div className="h-2 w-full rounded-full bg-gray-100 dark:bg-gray-800 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-[#1E2B7A] to-[#76BC21] transition-all duration-500"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <SearchFilter
          value={search}
          onChange={setSearch}
          placeholder="Search by patient, test or report ID..."
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
          emptyTitle="No reports found"
          emptyDescription="Try adjusting your search or filter criteria."
        />
      </div>
    </div>
  );
}
